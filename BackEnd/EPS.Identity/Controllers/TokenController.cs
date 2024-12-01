using EPS.Identity.Authorize;
using EPS.Identity.BaseExt;
using EPS.Identity.Data.Entities;
using EPS.Identity.Data.Enums;
using EPS.Identity.Dtos;
using EPS.Identity.Dtos.Captcha;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using User = EPS.Identity.Data.Entities.User;

namespace EPS.Identity.Controllers
{
    [Route("api/token")]
    public class TokenController : BaseController
    {
        private DataDbContext _context;
        //some config in the appsettings.json
        private IOptions<Audience> _settings;
        //repository to handler the sqlite database
        private IConfiguration _configuration;

        private Services.EmailService _emailService;

        private UserManager<User> _userManager;

        public TokenController(
            IOptions<Audience> settings,
            DataDbContext context,
            IConfiguration configuration,
            Services.EmailService emailService,
            UserManager<User> userManager
            )
        {
            this._settings = settings;
            _context = context;
            _configuration = configuration;
            //_SolrLogServices = new SolrServices<SolrLogs>(_solrModel);
            _emailService = emailService;
            _userManager = userManager;
        }
        [HttpPost("auth")]
        public async Task<IActionResult> Auth(TokenRequestParams parameters)
        {

            // Verify client's identification
            var client = await _context.IdentityClients.SingleOrDefaultAsync(x => x.IdentityClientId.Equals(parameters.client_id) && x.SecretKey.Equals(parameters.client_secret));

            if (client == null)
            {
                return BadRequest("Unauthorized client.");
            }

            if (parameters.grant_type == "password")
            {
                //thêm vào thống kê lượt truy cập
                return await DoPassword(parameters, client);
            }
            else if (parameters.grant_type == "refresh_token")
            {
                return await DoRefreshToken(parameters, client);
            }
            else if (parameters.grant_type == "change_token")
            {
                return await DoChangeToken(parameters, client);
            }
            else if (parameters.grant_type == "invalidate_token")
            {
                return await DoInvalidateToken(parameters);
            }
            else
            {
                return BadRequest("Invalid grant type.");
            }
        }

        private async Task<IActionResult> DoInvalidateToken(TokenRequestParams parameters)
        {
            var token = await _context.IdentityRefreshTokens.FirstOrDefaultAsync(x => x.RefreshToken == parameters.refresh_token);

            if (token == null)
            {
                return Ok();
            }

            _context.Remove(token);

            await _context.SaveChangesAsync();

            return Ok();
        }
        private async Task<IActionResult> DoPassword(TokenRequestParams parameters, IdentityClient client)
        {
            //validate the client_id/client_secret/username/password                                          
            var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == parameters.username && x.Status == 2 && !x.DeletedDate.HasValue);



            if (user == null || user.DeletedDate.HasValue)
            {
                //await AddLogLoginAsync("Người dùng ẩn danh", 0, _SolrLogServices, "Đăng nhập hệ thống: với tài khoản " + parameters.username, DOITUONG.Login, ActionLogs.Login, StatusLogs.Error);
                return BadRequest("Invalid user infomation.");
            }

            var passwordHasher = new PasswordHasher<User>();
            var passwordVerificationResult = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, parameters.password);

            if (passwordVerificationResult == PasswordVerificationResult.Failed)
            {
                // await AddLogLoginAsync("Người dùng ẩn danh", 0, _SolrLogServices, "Đăng nhập hệ thống: với tài khoản " + parameters.username, DOITUONG.Login, ActionLogs.Login, StatusLogs.Error);
                return BadRequest("Invalid user infomation.");
            }

            var refresh_token = Guid.NewGuid().ToString().Replace("-", "");

            var rToken = new IdentityRefreshToken
            {
                ClientId = parameters.client_id,
                RefreshToken = refresh_token,
                IdentityRefreshTokenId = Guid.NewGuid().ToString(),
                IssuedUtc = DateTime.UtcNow,
                ExpiresUtc = DateTime.UtcNow.AddDays(client.RefreshTokenLifetime),
                Identity = parameters.username,
            };

            //store the refresh_token
            _context.IdentityRefreshTokens.Add(rToken);

            await _context.SaveChangesAsync();
            //lưu vào log solr
            var returnvalue = GetJwt(parameters.client_id, refresh_token, user, parameters.username);
            //await AddLogLoginAsync(parameters.username, user.Id, _SolrLogServices, "Đăng nhập hệ thống bằng tài khoản: " + parameters.username, DOITUONG.Login, ActionLogs.Login, StatusLogs.Success);

            return Ok(returnvalue);
        }

        private async Task<IActionResult> DoChangeToken(TokenRequestParams parameters, IdentityClient client)
        {
            var token = await _context.IdentityRefreshTokens.FirstOrDefaultAsync(x => x.RefreshToken == parameters.refresh_token);

            if (token == null)
            {
                return BadRequest("Token not found.");
            }

            if (token.IsExpired)
            {
                // Remove refresh token if expired
                _context.IdentityRefreshTokens.Remove(token);
                await _context.SaveChangesAsync();

                return BadRequest("Token has expired.");
            }

            var refresh_token = Guid.NewGuid().ToString().Replace("-", "");

            //remove the old refresh_token and add a new refresh_token
            _context.IdentityRefreshTokens.Remove(token);

            _context.IdentityRefreshTokens.Add(new IdentityRefreshToken
            {
                ClientId = parameters.client_id,
                RefreshToken = refresh_token,
                IdentityRefreshTokenId = Guid.NewGuid().ToString(),
                IssuedUtc = DateTime.UtcNow,
                ExpiresUtc = DateTime.UtcNow.AddDays(client.RefreshTokenLifetime),
                Identity = token.Identity
            });

            await _context.SaveChangesAsync();

            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == token.Identity);

            if (user == null)
            {
                return BadRequest("User not found.");
            }

            return Ok(GetJwt(parameters.client_id, refresh_token, user, token.Identity));
        }
        //scenario 2 ： get the access_token by refresh_token
        private async Task<IActionResult> DoRefreshToken(TokenRequestParams parameters, IdentityClient client)
        {
            var token = await _context.IdentityRefreshTokens.FirstOrDefaultAsync(x => x.RefreshToken == parameters.refresh_token);

            if (token == null)
            {
                return BadRequest("Token not found.");
            }

            if (token.IsExpired)
            {
                // Remove refresh token if expired
                _context.IdentityRefreshTokens.Remove(token);
                await _context.SaveChangesAsync();

                return BadRequest("Token has expired.");
            }

            var refresh_token = Guid.NewGuid().ToString().Replace("-", "");

            //remove the old refresh_token and add a new refresh_token
            _context.IdentityRefreshTokens.Remove(token);

            _context.IdentityRefreshTokens.Add(new IdentityRefreshToken
            {
                ClientId = parameters.client_id,
                RefreshToken = refresh_token,
                IdentityRefreshTokenId = Guid.NewGuid().ToString(),
                IssuedUtc = DateTime.UtcNow,
                ExpiresUtc = DateTime.UtcNow.AddDays(client.RefreshTokenLifetime),
                Identity = token.Identity
            });

            await _context.SaveChangesAsync();

            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == token.Identity);

            if (user == null)
            {
                return BadRequest("User not found.");
            }

            return Ok(GetJwt(parameters.client_id, refresh_token, user, token.Identity));
        }

        private string GetJwt(string client_id, string refresh_token, User user, string userName)
        {
            var now = DateTime.UtcNow;
            //Lấy quyền từ bảng trung gian
            var lstRoles = (from a in _context.GroupRolePermissions
                            join c in _context.GroupUsers on a.GroupId equals c.GroupId
                            join d in _context.Users on c.UserId equals d.Id
                            where d.UserName == userName && a.Value == 1
                            select a.Role.Name + '-' + a.Permission.Code).ToList();

            var PermissionUser = (from a in _context.GroupUsers
                                  join b in _context.Users on a.UserId equals b.Id
                                  where b.UserName == userName
                                  select a.GroupId).ToList();
            var PermissionUserCode = (from a in _context.GroupUsers
                                      join b in _context.Users on a.UserId equals b.Id
                                      where b.UserName == userName
                                      select a.Group.Code).ToList();

            var oUserInfo = _context.UserDetails.FirstOrDefault(x => x.UserId == user.Id);
            var Avatar = oUserInfo is null ? "" : !string.IsNullOrEmpty(oUserInfo.Avatar) ? oUserInfo.Avatar : "";
            //int UnitId = unit_id > 0 ? unit_id :(user.DonViNoiBoId.HasValue ? user.DonViNoiBoId.Value : 0);
            var claims = new Claim[]
           {
                new Claim(CustomClaimTypes.ClientId, client_id),
                new Claim(CustomClaimTypes.UserId, user.Id.ToString()),
                new Claim(ClaimTypes.GivenName, user.FullName, ClaimValueTypes.String),
                new Claim(ClaimTypes.NameIdentifier, user.UserName, ClaimValueTypes.String),
                new Claim(CustomClaimTypes.Privileges, string.Join(",", lstRoles)),
                new Claim(CustomClaimTypes.UnitId, string.Join(",", PermissionUser)),
                new Claim(CustomClaimTypes.UnitCode, string.Join(",", PermissionUserCode)),
                //new Claim(CustomClaimTypes.UnitId, UnitId.ToString()),
                new Claim(CustomClaimTypes.TaiKhoanID, user.Id.ToString()),
                new Claim(CustomClaimTypes.AnhDaiDien, Avatar),
                new Claim(CustomClaimTypes.IsAdministrator, user.IsAdministrator?"true":"false"),
           };


            var symmetricKeyAsBase64 = _settings.Value.Secret;
            var keyByteArray = Encoding.ASCII.GetBytes(symmetricKeyAsBase64);
            var signingKey = new SymmetricSecurityKey(keyByteArray);
            var expires = now.Add(TimeSpan.FromMinutes(_configuration.GetValue<double>("TimeSpanToken")));

            var jwt = new JwtSecurityToken(
                issuer: _settings.Value.ValidIssuer,
                audience: _settings.Value.ValidAudience,
                claims: claims,
                notBefore: now,
                expires: expires,
                signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256));
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            var response = new
            {
                access_token = encodedJwt,
                expires,
                refresh_token,
                fullName = user.FullName,
                username = user.UserName,
                //unitId = UnitId,
                idTaiKhoan = user.Id,
                anhdaidien = Avatar,
                isAdministrator = user.IsAdministrator,
                lstRoles,
                unitCode = PermissionUserCode,
            };

            return JsonConvert.SerializeObject(response, new JsonSerializerSettings { Formatting = Formatting.Indented });
        }

        #region Func xử lý cấp lại mật khẩu qua Email
        [HttpPost("forgot-pass")]
        public async Task<IActionResult> ForgotPassword(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return Ok(false);

            // Logic để tạo mật khẩu mới hoặc token đặt lại mật khẩu
            // Tạo mã xác minh (ví dụ: một mã ngẫu nhiên hoặc mã OTP)
            var verificationCode = GenerateVerificationCode();

            // Lưu mã xác minh vào session
            HttpContext.Session.SetString("VerificationCode", verificationCode);
            HttpContext.Session.SetString("VerificationEmail", email);

            // Gửi email
            var subject = "Mã xác minh đăng nhập website.";
            var message = $@"
                <html>
                <body>
                    <h1>Mã xác minh đăng nhập</h1>
                    <p>Xin chào,</p>
                    <p>Vui lòng nhập mã xác minh dưới đây để lấy lại mật khẩu. Mã này có hiệu lực trong vòng 10 phút:</p>
                    <h2>{verificationCode}</h2>
                    <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                    <p>Trân trọng,</p>
                    <p>Đội ngũ hỗ trợ</p>
                </body>
                </html>";
            await _emailService.SendEmailAsync(email, subject, message);

            return Ok(true);
        }

        private string GenerateVerificationCode()
        {
            // Tạo mã xác minh ngẫu nhiên (ví dụ: 6 chữ số)
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        [HttpPost("verify-code")]
        public async Task<IActionResult> VerifyCode(string email, string code)
        {
            // Lấy mã xác minh từ session
            var storedCode = HttpContext.Session.GetString("VerificationCode");
            var storedEmail = HttpContext.Session.GetString("VerificationEmail");

            if (storedCode == null || storedEmail == null || storedEmail != email)
            {
                return Ok(false);
            }

            if (storedCode == code)
            {
                // Xử lý xác minh thành công
                HttpContext.Session.Remove("VerificationCode");
                HttpContext.Session.Remove("VerificationEmail");

                var userEmail = await _userManager.FindByEmailAsync(email);

                if (userEmail != null && userEmail.UserName != null)
                {
                    var pass = GenerateVerificationCode(12);

                    var passwordHasher = new PasswordHasher<User>();
                    var passwordVerificationResult = passwordHasher.HashPassword(userEmail, pass);
                    userEmail.PasswordHash = passwordVerificationResult;
                    _context.Users.Update(userEmail);
                    await _context.SaveChangesAsync();

                    await SendPassword(email, pass);

                }
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }
        }

        private async Task SendPassword(string email, string pass)
        {
            // Gửi email
            var subject = "Mật khẩu đăng nhập website.";
            var message = $@"
                <html>
                <body>
                    <h1>Mật khẩu đăng nhập</h1>
                    <p>Xin chào,</p>
                    <p>Mật khẩu của bạn</p>
                    <h2>{pass}</h2>
                    <p>XIn vui lòng đăng nhập mật khẩu và đổi mật khẩu lại khi đăng nhập.</p>
                    <p>Trân trọng,</p>
                    <p>Đội ngũ hỗ trợ</p>
                </body>
                </html>";
            await _emailService.SendEmailAsync(email, subject, message);

        }

        private static string GenerateVerificationCode(int length = 10)
        {
            const string uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string lowercase = "abcdefghijklmnopqrstuvwxyz";
            const string digits = "0123456789";
            const string specialCharacters = "!@#$%^&*()_+[]{}|;:,.<>?";
            const string allCharacters = uppercase + lowercase + digits + specialCharacters;

            var random = new Random();
            var result = new StringBuilder(length);

            // Ensure at least one character from each category is included
            result.Append(uppercase[random.Next(uppercase.Length)]);
            result.Append(lowercase[random.Next(lowercase.Length)]);
            result.Append(digits[random.Next(digits.Length)]);
            result.Append(specialCharacters[random.Next(specialCharacters.Length)]);

            // Fill the rest of the result with random characters from all categories
            for (int i = result.Length; i < length; i++)
            {
                result.Append(allCharacters[random.Next(allCharacters.Length)]);
            }

            // Shuffle the result to ensure randomness
            return ShuffleString(result.ToString(), random);
        }

        private static string ShuffleString(string input, Random random)
        {
            var array = input.ToCharArray();
            for (int i = array.Length - 1; i > 0; i--)
            {
                int j = random.Next(i + 1);
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return new string(array);
        }
        #endregion

        #region Gửi captcha và cấp lại 
        [HttpPost("verify-recaptcha")]
        public async Task<IActionResult> VerifyRecaptcha([FromBody] RecaptchaRequestDto request)
        {
            if (string.IsNullOrEmpty(request.Token))
            {
                return BadRequest("Token captcha không tồn tại");
            }

            var secretKey = _configuration["Captcha:SecretKey"];

            if (secretKey == null) return Ok(false);

            var httpClient = new HttpClient();
            var parameters = new Dictionary<string, string>
            {
                { "secret", secretKey },
                { "response", request.Token }
            };
            var content = new FormUrlEncodedContent(parameters);

            var response = await httpClient.PostAsync("https://www.google.com/recaptcha/api/siteverify", content);
            var jsonResponse = await response.Content.ReadAsStringAsync();

            var settings = new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                ContractResolver = new CamelCasePropertyNamesContractResolver(),
                Formatting = Formatting.Indented  // Có thể thêm Formatting để đọc JSON dễ dàng hơn trong quá trình gỡ lỗi
            };

            var result = JsonConvert.DeserializeObject<RecaptchaResponseDto>(jsonResponse, settings);

            if (result != null && result.Success)
            {
                return await SendNotificationToAdmin(request.UserName);
            }
            return BadRequest("Lỗi xác thực captcha.");

        }

        private async Task<IActionResult> SendNotificationToAdmin(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);

            if (user != null)
            {
                var userPassword = await _context.PasswordResetRequests.Where(x => x.UserId == user.Id && x.status == (int)PasswordResetRequestEnum.REQUEST && !x.DeletedDate.HasValue).FirstOrDefaultAsync();
                if (userPassword != null)
                {
                    return BadRequest("Đã gửi yêu cầu, xin chờ hệ thống xác thực.");
                }

                try
                {
                    var listUser = await _context.Users.Where(x => x.IsAdministrator == true && x.Status == 2 && !x.DeletedDate.HasValue).ToListAsync();

                    var data = await CreateOrUpdatePassword(user.Id);

                    if (data != null)
                    {
                        //_rabbitMQManager.SendNotification(
                        //    Libary.RabbitManager.Enums.NotificationTypeEnum.PASSWORD,
                        //    user.Id,
                        //    "Yêu cầu cấp lại mật khẩu với tài khoản <b>" + userName + "</b>",
                        //    string.Empty,

                        //    new RabbitParam()
                        //    {
                        //        ReceiverIds = listUser.Select(s => s.Id).ToList()
                        //    },
                        //    typeof(PasswordResetRequest).Name,
                        //    $"UserName={user.UserName}&PasswordRequestId={data.Id}"
                        //);

                        return Ok(true);
                    }
                    else
                    {
                        return BadRequest("Không thể tạo yêu cầu cấp mật khẩu.");
                    }

                }
                catch (FormatException ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            return BadRequest("Không tìm thấy tài khoản trong hệ thống.");
        }

        private async Task<PasswordResetRequest?> CreateOrUpdatePassword(int userId)
        {
            try
            {
                var data = await _context.PasswordResetRequests.Where(s => s.UserId == userId && !s.DeletedDate.HasValue).FirstOrDefaultAsync();
                if (data != null)
                {
                    data.status = (int)PasswordResetRequestEnum.REQUEST;
                    data.CreatedAt = DateTime.Now;
                    data.UpdatedAt = null;

                    _context.Update(data);
                    await _context.SaveChangesAsync();

                    return data;
                }
                else
                {
                    PasswordResetRequest input = new();

                    input.UserId = userId;
                    input.status = (int)PasswordResetRequestEnum.REQUEST;
                    input.CreatedUserId = userId;
                    input.CreatedDate = DateTime.Now;
                    input.CreatedAt = DateTime.Now;

                    await _context.PasswordResetRequests.AddAsync(input);
                    await _context.SaveChangesAsync();

                    return input;
                }

            }
            catch
            {

            }

            return null;
        }
        #endregion
    }
}
