using AutoMapper;
using EPS.Identity.BaseExt;
using EPS.Identity.Data.Entities;
using EPS.Identity.Dtos.Role;
using EPS.Identity.Dtos.User;
using EPS.Identity.Pages;
using EPS.Identity.Repositories.Interface;
using Microsoft.AspNetCore.Identity;

namespace EPS.Identity.Services
{
    public class AuthorizationService
    {
        private CommonService _baseService;
        private ICommonRepository _repository;
        private IMapper _mapper;
        private UserManager<User> _userManager;
        private ILogger<AuthorizationService> _logger;
        private IUserIdentity<int> _userIdentity;
        private IConfiguration _configuration;

        public AuthorizationService(ICommonRepository repository, IMapper mapper, UserManager<User> userManager, ILogger<AuthorizationService> logger, IUserIdentity<int> userIdentity, IConfiguration configuration)
        {
            _repository = repository;
            _mapper = mapper;
            _userManager = userManager;
            _logger = logger;
            _userIdentity = userIdentity;
            _baseService = new CommonService(repository, mapper);
            _configuration = configuration;
        }


        //public async Task<List<string>> GetUserPrivileges(int userId)
        //{
        //    return await _repository.Filter<UserPrivilege>(x => x.UserId == userId).Select(x => x.PrivilegeId).ToListAsync();
        //}


        //public async Task SaveUserPrivileges(int userId, string[] privileges)
        //{
        //    using (var ts = _repository.BeginTransaction())
        //    {
        //        var db = _repository.GetDbContext<CommonContext>();
        //        var userPrivileges = await db.UserPrivileges.Include(x => x.Privilege).Where(x => x.UserId == userId).ToListAsync();

        //        foreach (var removingPrivilges in userPrivileges.Where(x => !privileges.Contains(x.PrivilegeId)))
        //        {
        //            db.Remove(removingPrivilges);
        //        }

        //        foreach (var newPrivilege in privileges.Where(x => !userPrivileges.Any(y => y.PrivilegeId == x)))
        //        {
        //            db.Add(new UserPrivilege() { UserId = userId, PrivilegeId = newPrivilege });
        //        }

        //        await db.SaveChangesAsync();

        //        ts.Commit();
        //    }
        //}

        public async Task<bool> ChangePassword(string userName, ChangePasswordDto model)
        {
            var user = await _userManager.FindByNameAsync(userName);
            var result = await _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);

            if (result.Succeeded)
            {
                return true;
            }
            else
            {
                throw new Exception(string.Format(". \n\r", result.Errors.Select(x => x.Description)));
            }
        }
        public async Task<bool> ResetPassword(string userName, string NewPassword)
        {
            var user = await _userManager.FindByNameAsync(userName);
            var code = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, code, NewPassword);

            if (result.Succeeded)
            {
                return true;
            }
            else
            {
                throw new Exception(string.Format(". \n\r", result.Errors.Select(x => x.Description)));
            }
        }

        #region Role
        public async Task<int> CreateRole(RoleCreateDto roleCreate, bool isExploiting = false)
        {
            await _baseService.CreateAsync<Role, RoleCreateDto>(roleCreate);
            return roleCreate.Id;
        }

        public async Task<PagingResult<RoleGridDto>> GetRoles(RoleGridPagingDto pagingModel)
        {
            return await _baseService.FilterPagedAsync<Role, RoleGridDto>(pagingModel);
        }

        public async Task<int> DeleteRole(int id)
        {
            return await _baseService.DeleteAsync<Role, int>(id);
        }

        public async Task<int> DeleteRole(int[] ids)
        {
            return await _baseService.DeleteAsync<Role, int>(ids);
        }

        public async Task<RoleDetailDto> GetRoleById(int id)
        {
            return await _baseService.FindAsync<Role, RoleDetailDto>(id);
        }

        public async Task<int> UpdateRole(int id, RoleUpdateDto editedRole)
        {
            return await _baseService.UpdateAsync<Role, RoleUpdateDto>(id, editedRole);
        }
        #endregion

        #region User
        public async Task<int> CreateUser(UserCreateDto newUser)
        {
            using (var ts = _repository.BeginTransaction())
            {
                var entityUser = _mapper.Map<User>(newUser);

                var result = await _userManager.CreateAsync(entityUser, newUser.Password);

                if (!result.Succeeded)
                {
                    var errors = string.Join(".", result.Errors.Select(x => x.Description));

                    throw new CommonException(errors);
                }
                else
                {
                    //await SaveUserRoles(entityUser.Id, newUser.RoleIds);
                    // Must log manually if not using BaseService


                   // _logger.Log(Microsoft.Extensions.Logging.LogLevel.Information, default(EventId), new ExtraPropertyLogger("User {username} added new {entity} {identifier}", _userIdentity.Username, typeof(User).Name, entityUser.ToString()).AddProp("data", entityUser), null, ExtraPropertyLogger.Formatter);
                }

                ts.Commit();
                return entityUser.Id;
            }
        }
        public async Task<int> CreateUser(UserAddDto newUser)
        {
            using (var ts = _repository.BeginTransaction())
            {
                var entityUser = _mapper.Map<User>(newUser);

                var result = await _userManager.CreateAsync(entityUser, newUser.Password);
                ts.Commit();
                return newUser.Id;
            }
        }

        public async Task<PagingResult<UserGridDto>> GetUsers(UserGridPagingDto pagingModel)
        {
            return await _baseService.FilterPagedAsync<User, UserGridDto>(pagingModel);
        }

        public async Task<int> DeleteUser(int id)
        {
            return await _baseService.DeleteAsync<User, int>(id);
        }

        public async Task<int> DeleteUser(int[] ids)
        {
            return await _baseService.DeleteAsync<User, int>(ids);
        }

        public async Task<UserDetailDto> GetUserById(int id)
        {
            return await _baseService.FindAsync<User, UserDetailDto>(id);
        }

        public async Task<UserDetailDto> GetAuthUser(int id, string code)
        {
            return await _baseService.FindAsync<User, UserDetailDto>(id);
        }

        public async Task<UserDetailDto> GetUserByUserName(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (user != null)
                return await _baseService.FindAsync<User, UserDetailDto>(user.Id);
            else
                return new UserDetailDto();
        }

        public async Task<bool> UpdateUser(int id, UserUpdateDto editedUser)
        {
            using (var ts = _repository.BeginTransaction())
            {
                await _baseService.UpdateAsync<User, UserUpdateDto>(id, editedUser);

                //await SaveUserRoles(id, editedUser.RoleIds);
                //if (!string.IsNullOrEmpty(editedUser.NewPassword))
                //{
                //    var user = await _baseService.GetDbContext<CommonContext>().Users.FindAsync(id);
                //    var token = await _userManager.GeneratePasswordResetTokenAsync(user);

                //    var result = await _userManager.ResetPasswordAsync(user, token, editedUser.NewPassword);

                //    if (!result.Succeeded)
                //    {
                //        throw new CommonException(string.Join(".", result.Errors.Select(x => x.Description)));
                //    }
                //    else
                //    {
                //        // Must log manually if not using BaseService
                //        _logger.Log(Microsoft.Extensions.Logging.LogLevel.Information, default(EventId), string.Format("User {0} has changed password for user {1}", _userIdentity.Username, user.ToString()), null, ExtraPropertyLogger.Formatter);
                //    }
                //}

                ts.Commit();
                return true;
            }
        }
        public async Task<bool> UpdateInfoUser(int id, UserUpdateInfoDto oUser)
        {
            using (var ts = _repository.BeginTransaction())
            {
                await _baseService.UpdateAsync<User, UserUpdateInfoDto>(id, oUser);
                return true;
            }
        }
        #endregion



        #region Ldap mobile
        //public bool IsAuthenticated(string usr, string pwd)
        //{
        //    bool authenticated = false;
        //    try
        //    {
        //        var LdapConfig = _configuration.GetSection("Ldap");
        //        string Ldap_Address = LdapConfig["Ldap_Address"];
        //        string Ldap_User = string.Format("uid={0},ou=people,dc=dms,dc=gov,dc=vn", usr);
        //        DirectoryEntry entry = new DirectoryEntry(Ldap_Address, Ldap_User, pwd);
        //        entry.AuthenticationType = AuthenticationTypes.None;
        //        object nativeObject = entry.NativeObject;
        //        authenticated = true;
        //    }
        //    catch (DirectoryServicesCOMException cex)
        //    {
        //        return authenticated;
        //    }
        //    catch (Exception ex)
        //    {
        //        return authenticated;
        //    }
        //    return authenticated;
        //}
        #endregion

    }
}
