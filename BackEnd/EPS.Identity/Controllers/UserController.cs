using EPS.Identity.Authorize;
using EPS.Identity.BaseExt;
using EPS.Identity.Data.Entities;
using EPS.Identity.Data.Enums;
using EPS.Identity.Dtos.GroupUser;
using EPS.Identity.Dtos.User;
using EPS.Identity.Dtos.UserInfo;
using EPS.Identity.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EPS.Identity.Controllers
{
    [Produces("application/json")]
    [Route("api/users")]
    [Authorize]
    public class UserController : BaseController
    {
        private AuthorizationService _authorizationService;
        private CommonService _baseService;
        public UserController(AuthorizationService authorizationService, CommonService baseService)
        {
            _authorizationService = authorizationService;
            _baseService = baseService;
        }

        [HttpPut("password")]
        [BaseAuthorize("users", EPS.Identity.Data.Enums.PrivilegeListEnum.Add, PrivilegeListEnum.Approved, EPS.Identity.Data.Enums.PrivilegeListEnum.Delete, EPS.Identity.Data.Enums.PrivilegeListEnum.Edit, PrivilegeListEnum.Permission)]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return Ok(await _authorizationService.ChangePassword(UserIdentity.Username, model));
        }
        [HttpPut("resetpass")]
        [BaseAuthorize("users", EPS.Identity.Data.Enums.PrivilegeListEnum.Edit)]
        public async Task<IActionResult> ChangePassword(ResetPasswordDto user)
        {
            try
            {
                if (UserIdentity.IsAdministrator || UserIdentity.UnitCode.Contains("01"))
                    return Ok(await _authorizationService.ResetPassword(user.UserName, user.NewPassword));
                else
                    return BadRequest("Bạn không có quyền truy cập chức năng này");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet]
        [BaseAuthorize("users", EPS.Identity.Data.Enums.PrivilegeListEnum.Add, PrivilegeListEnum.Approved, EPS.Identity.Data.Enums.PrivilegeListEnum.Delete, EPS.Identity.Data.Enums.PrivilegeListEnum.Edit, PrivilegeListEnum.Permission)]
        public async Task<IActionResult> GetUsers([FromQuery] UserGridPagingDto pagingModel)
        {
            var predicates = pagingModel.GetPredicates();
            var result = await _baseService.FilterPagedAsync<User, UserGridDto>(pagingModel, predicates.ToArray());
            if (pagingModel.GroupId > 0)
            {
                if (result.Data.Count > 0)
                {
                    for (int i = 0; i < result.Data.Count; i++)
                    {
                        result.Data[i].IsCheck = result.Data[i].LstGroupIds.Contains(pagingModel.GroupId);
                    }
                }
            }
            return Ok(result);
        }

        [HttpGet("userselect")]
        [BaseAuthorize("users", true)]
        public async Task<IActionResult> GetUserInfos([FromQuery] UserInfoGridPagingDto pagingModel)
        {
            pagingModel.Page = 1;
            pagingModel.ItemsPerPage = -1;
            var predicates = pagingModel.GetPredicates();
            var result = await _baseService.FilterPagedAsync<User, UserInfoGridDto>(pagingModel, predicates.ToArray());
            List<UserInfoGridDto> oListUsers = new List<UserInfoGridDto>();
            if (result.TotalRows > 0)
            {
                oListUsers = result.Data;
            }
            //if (!string.IsNullOrEmpty(pagingModel.GroupCode) && oListUsers.Count > 0)
            //{
            //    if (pagingModel.GroupCode.Contains(",") || pagingModel.GroupCode.Contains(";"))
            //    {
            //        var codes = pagingModel.GroupCode.Replace(";", ",");
            //        var arr = codes.Split(",");

            //        var listUsers = new List<UserGridInfoDto>();
            //        foreach (var item in arr)
            //        {
            //            {
            //                var dataUs = oListUsers.Where(x => x.GroupCodes.Contains(item)).ToList();
            //                listUsers.AddRange(dataUs);
            //            }
            //        }

            //        oListUsers = listUsers;
            //    }
            //    else
            //    {
            //        oListUsers = oListUsers.Where(x => x.GroupCodes.Contains(pagingModel.GroupCode)).ToList();
            //    }
            //}

            // Loại bỏ các phần tử trùng lặp
            oListUsers = oListUsers.Distinct(new UserInfoGridDtoComparer()).ToList();

            return Ok(oListUsers);
        }


        [BaseAuthorize("users", EPS.Identity.Data.Enums.PrivilegeListEnum.Add, PrivilegeListEnum.Approved, EPS.Identity.Data.Enums.PrivilegeListEnum.Delete, EPS.Identity.Data.Enums.PrivilegeListEnum.Edit, PrivilegeListEnum.Permission)]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            return Ok(await _authorizationService.GetUserById(id));
        }

        [HttpGet("userinfo/{id}")]
        public async Task<IActionResult> GetUserInfoById(int id)
        {
            return Ok(await _baseService.FindAsync<User, UserInfo>(id));
        }

        [BaseAuthorize("users", EPS.Identity.Data.Enums.PrivilegeListEnum.Add)]
        [HttpPost]
        public async Task<IActionResult> CreateUser(UserCreateDto oUserCreate) //UserCreateDto oUserCreate
        {
            var oUser = await _authorizationService.GetUserByUserName(oUserCreate.Username);
            if (oUser.Id > 0)
            {
                return BadRequest("Tên đăng nhập đã tồn tại, vui lòng nhập lại tên đăng nhập!");
            }
            //oUserCreate.Status = (int)EPS.Identity.Data.Enums.StatusUserEnum.Deactive;
            oUserCreate.CreatedDate = DateTime.Now;
            oUserCreate.ModifiedDate = DateTime.Now;
            var idUser = await _authorizationService.CreateUser(oUserCreate);
            if (idUser == 0)
            {
                // //await AddLogAsync(UserIdentity.FullName + ": thêm " + oUserCreate.FullName, "USERS", (int)ActionLogs.Add, (int)StatusLogs.Error);
                return BadRequest("Có lỗi trong quá trình tạo tại khoản!");
            }
            // //await AddLogAsync(UserIdentity.FullName + ": thêm " + oUserCreate.FullName, "USERS", (int)ActionLogs.Add, (int)StatusLogs.Success);
            #region Thêm mới Userinfo   
            UserInfoCreateDto userInfo = new UserInfoCreateDto();
            userInfo.Address = oUserCreate.Address;
            userInfo.Email = oUserCreate.Email;
            userInfo.Avatar = oUserCreate.Avatar;
            userInfo.Phone = oUserCreate.PhoneNumber;
            userInfo.Sex = oUserCreate.Sex;
            userInfo.UserId = idUser;
            await _baseService.CreateAsync<UserDetail, UserInfoCreateDto>(userInfo);
            #endregion
            #region Thêm mới Group   
            if (oUserCreate.GroupIds.Count > 0)
            {
                foreach (var item in oUserCreate.GroupIds)
                {
                    if (item > 0)
                    {
                        await _baseService.CreateAsync<GroupUser, GroupUserCreateDto>(new GroupUserCreateDto() { GroupId = item, UserId = idUser });
                    }
                }
            }
            #endregion
            return Ok(idUser);
        }


        [HttpPut("{id}")]
        [BaseAuthorize("users", EPS.Identity.Data.Enums.PrivilegeListEnum.Edit)]
        public async Task<IActionResult> UpdateUser(int id, UserUpdateDto oUserUpdate)
        {

            //return Ok(await _authorizationService.UpdateUser(id, editedUser));
            UserInfoItem oUser = await _baseService.FindAsync<User, UserInfoItem>(id);
            if (oUser.Id == 0)
            {
                return BadRequest("Tài khoản không tồn tại");
            }
            oUserUpdate.ModifiedDate = DateTime.Now;
            bool check = await _authorizationService.UpdateUser(id, oUserUpdate);
            if (!check)
            {
                // //await AddLogAsync(UserIdentity.FullName + ": sửa " + oUserUpdate.FullName, "USERS", (int)ActionLogs.Edit, (int)StatusLogs.Error);
                return BadRequest("Có lỗi trong quá trình update tài khoản!");
            }
            // //await AddLogAsync(UserIdentity.FullName + ": sửa " + oUserUpdate.FullName, "USERS", (int)ActionLogs.Edit, (int)StatusLogs.Success);
            #region Update Userinfo   
            if (oUser.User.Id > 0)
            {
                UserInfoUpdateDto userInfo = new UserInfoUpdateDto();
                userInfo.Id = oUser.User.Id;
                userInfo.Address = oUserUpdate.Address;
                userInfo.Email = oUserUpdate.Email;
                userInfo.Avatar = oUserUpdate.Avatar;
                userInfo.Phone = oUserUpdate.PhoneNumber;
                userInfo.Sex = oUserUpdate.Sex;
                await _baseService.UpdateAsync<UserDetail, UserInfoUpdateDto>(userInfo.Id, userInfo);
            }
            #endregion
            #region Cập nhật Group 
            if (oUser.GroupIds.Count > 0)
            {
                List<int> lstDelete = new List<int>();
                List<int> lstAdd = new List<int>();
                if (oUserUpdate.GroupIds.Count > 0)
                {
                    lstDelete = oUser.GroupIds.Where(x => oUserUpdate.GroupIds.IndexOf(x) == -1).ToList();
                    lstAdd = oUserUpdate.GroupIds.Where(x => oUser.GroupIds.IndexOf(x) == -1).ToList();
                }
                else
                {
                    lstDelete = oUser.GroupIds;
                }
                if (lstDelete.Count > 0)
                {
                    var pagingModel = new GroupUserGridPaging() { UserId = id, LstGroupIds = lstDelete };
                    var predicates = pagingModel.GetPredicates();
                    var lstNhomNguoiDung = await _baseService.FilterPagedAsync<GroupUser, GroupUserGridDto>(pagingModel, predicates.ToArray());
                    if (lstNhomNguoiDung.Data.Count > 0)
                    {
                        foreach (var item in lstNhomNguoiDung.Data)
                        {
                            await _baseService.DeleteAsync<GroupUser, int>(item.Id);
                        }
                    }
                }
                if (lstAdd.Count > 0)
                {
                    foreach (var itemAdd in lstAdd)
                    {
                        if (itemAdd > 0)
                        {
                            await _baseService.CreateAsync<GroupUser, GroupUserCreateDto>(new GroupUserCreateDto() { GroupId = itemAdd, UserId = id });
                        }
                    }
                }
            }
            else
            {
                if (oUserUpdate.GroupIds.Count > 0)
                {
                    foreach (var item in oUserUpdate.GroupIds)
                    {
                        if (item > 0)
                        {
                            await _baseService.CreateAsync<GroupUser, GroupUserCreateDto>(new GroupUserCreateDto() { GroupId = item, UserId = id });
                        }
                    }
                }
            }
            #endregion
            return Ok();
        }
        [HttpPut("active/{id}")]
        [BaseAuthorize("users", EPS.Identity.Data.Enums.PrivilegeListEnum.Edit)]
        public async Task<IActionResult> ActiveUser(int id)
        {

            try
            {
                UserDetailDto oUser = await _baseService.FindAsync<User, UserDetailDto>(id);
                if (oUser.Id == 0)
                {
                    return BadRequest("Tài khoản không tồn tại");
                }
                if (oUser.Status != (int)EPS.Identity.Data.Enums.StatusUserEnum.Deactive)
                {
                    return BadRequest("Tài khoản đã chuyển trạng thái, vui lòng kiểm tra lại");
                }
                var oUserUpdate = new UserUpdateStatus() { Id = oUser.Id, Status = (int)EPS.Identity.Data.Enums.StatusUserEnum.Active, ModifiedDate = DateTime.Now };
                await _baseService.UpdateAsync<User, UserUpdateStatus>(oUser.Id, oUserUpdate);
                // //await AddLogAsync(UserIdentity.FullName + ": kích hoạt" + oUser.FullName, "USERS", (int)ActionLogs.Edit, (int)StatusLogs.Success);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("deactive/{id}")]
        [BaseAuthorize("users", EPS.Identity.Data.Enums.PrivilegeListEnum.Edit)]
        public async Task<IActionResult> DeActiveUser(int id)
        {

            try
            {
                UserDetailDto oUser = await _baseService.FindAsync<User, UserDetailDto>(id);
                if (oUser.Id == 0)
                {
                    return BadRequest("Tài khoản không tồn tại");
                }
                if (oUser.Status != (int)EPS.Identity.Data.Enums.StatusUserEnum.Active)
                {
                    return BadRequest("Tài khoản đã chuyển trạng thái, vui lòng kiểm tra lại");
                }
                var oUserUpdate = new UserUpdateStatus() { Id = oUser.Id, Status = (int)EPS.Identity.Data.Enums.StatusUserEnum.Deactive, ModifiedDate = DateTime.Now };
                await _baseService.UpdateAsync<User, UserUpdateStatus>(oUser.Id, oUserUpdate);
                // //await AddLogAsync(UserIdentity.FullName + ": khóa" + oUser.FullName, "USERS", (int)ActionLogs.Edit, (int)StatusLogs.Success);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        ////[BaseAuthorize(PrivilegeList.ManageUser)]
        [HttpDelete("{id}")]
        [BaseAuthorize("users", EPS.Identity.Data.Enums.PrivilegeListEnum.Delete)]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _authorizationService.DeleteUser(id);
            // //await AddLogAsync(UserIdentity.FullName + ": xóa " + id, "USERS", (int)ActionLogs.Delete, (int)StatusLogs.Success);
            return Ok(true);
        }

        //multiple delete 
        //[BaseAuthorize(PrivilegeList.ManageUser)]
        [HttpDelete]
        [BaseAuthorize("users", EPS.Identity.Data.Enums.PrivilegeListEnum.Delete)]
        public async Task<IActionResult> DeleteUsers(string ids)
        {
            if (string.IsNullOrEmpty(ids))
            {
                return BadRequest();
            }
            try
            {
                var userIds = ids.Split(',').Select(x => Convert.ToInt32(x)).ToArray();
                await _authorizationService.DeleteUser(userIds);
                // //await AddLogAsync(UserIdentity.FullName + ": xóa danh sách " + ids, "USERS", (int)ActionLogs.Delete, (int)StatusLogs.Success);
                return Ok(true);
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("lists")]
        public async Task<IActionResult> GetListUserAsync([FromQuery] UserGridPagingDto pagingModel)
        {
            var result = await _authorizationService.GetUsers(pagingModel);
            return Ok(result);

        }
    }
}
