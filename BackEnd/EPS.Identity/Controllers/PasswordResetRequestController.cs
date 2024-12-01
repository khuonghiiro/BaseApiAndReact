using EPS.Identity.Authorize;
using EPS.Identity.BaseExt;
using EPS.Identity.Data;
using EPS.Identity.Data.Entities;
using EPS.Identity.Data.Enums;
using EPS.Identity.Dtos.PasswordResetRequest;
using EPS.Identity.Services;
using Microsoft.AspNetCore.Mvc;
namespace EPS.Identity.Controllers
{
    [Produces("application/json")]
    [Route("api/passwordresetrequest")]
    public class PasswordResetRequestController : BaseController
    {
        private CommonService _baseService;
        public PasswordResetRequestController(CommonService baseService)
        {
            _baseService = baseService;
        }
        [BaseAuthorize("passwordresetrequest", true)]
        [HttpGet]
        public async Task<IActionResult> GetLists([FromQuery] PasswordResetRequestGridPaging pagingModel)
        {

            return Ok(await _baseService.FilterPagedAsync<PasswordResetRequest, PasswordResetRequestGridDto>(pagingModel));
        }
        [BaseAuthorize("passwordresetrequest", true)]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await _baseService.FindAsync<PasswordResetRequest, PasswordResetRequestDetailDto>(id));
        }
        //create
        [BaseAuthorize("passwordresetrequest", PrivilegeListEnum.Add)]
        [HttpPost]
        public async Task<IActionResult> Create(PasswordResetRequestCreateDto dto)
        {
            try
            {
                await _baseService.CreateAsync<PasswordResetRequest, PasswordResetRequestCreateDto>(dto);
                //await AddLogAsync(UserIdentity.FullName + ": thêm " + dto.Id, "passwordresetrequest", (int)ActionLogs.Add, (int)StatusLogs.Success);
                return Ok();
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //update
        [BaseAuthorize("passwordresetrequest", PrivilegeListEnum.Edit)]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, PasswordResetRequestUpdateDto dto)
        {
            try
            {
                var oPasswordResetRequestDetail = await _baseService.FindAsync<PasswordResetRequest, PasswordResetRequestDetailDto>(id);
                if (oPasswordResetRequestDetail is null)
                    return BadRequest("Bản ghi không tồn tại");
                await _baseService.UpdateAsync<PasswordResetRequest, PasswordResetRequestUpdateDto>(id, dto);
                //await AddLogAsync(UserIdentity.FullName + ": sửa " + dto.Id, "passwordresetrequest", (int)ActionLogs.Edit, (int)StatusLogs.Success);
                return Ok(true);
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //update
        [BaseAuthorize("passwordresetrequest", PrivilegeListEnum.Edit)]
        [HttpPut("update/{id}/{status}")]
        public async Task<IActionResult> UpdateStatus(int id, int status)
        {
            try
            {
                var oPasswordResetRequestDetail = await _baseService.FindAsync<PasswordResetRequest, PasswordResetRequestDetailDto>(id);
                if (oPasswordResetRequestDetail is null)
                    return BadRequest("Bản ghi không tồn tại");

                if (oPasswordResetRequestDetail.status != (int)PasswordResetRequestEnum.REQUEST)
                    return BadRequest("Yêu cầu không hợp lệ");

                if (status == (int)PasswordResetRequestEnum.REQUEST)
                    return BadRequest("Yêu cầu không hợp lệ");

                PasswordResetRequestUpdateDto input = new();
                input.Id = id;
                input.UpdatedAt = DateTime.Now;
                input.UserAgreeId = UserIdentity.TaiKhoanID;
                input.status = status;
                input.CreatedAt = oPasswordResetRequestDetail.CreatedAt;
                input.UserId = oPasswordResetRequestDetail.UserId;

                await _baseService.UpdateAsync<PasswordResetRequest, PasswordResetRequestUpdateDto>(id, input);
                //await AddLogAsync(UserIdentity.FullName + ": sửa " + input.Id, "passwordresetrequest", (int)ActionLogs.Edit, (int)StatusLogs.Success);
                return Ok(true);
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [BaseAuthorize("passwordresetrequest", PrivilegeListEnum.Delete)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _baseService.DeleteAsync<PasswordResetRequest, int>(id);
                //await AddLogAsync(UserIdentity.FullName + ": xóa " + id, "passwordresetrequest", (int)ActionLogs.Delete, (int)StatusLogs.Success);
                return Ok(true);
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //multiple delete 
        [BaseAuthorize("passwordresetrequest", PrivilegeListEnum.Delete)]
        [HttpDelete]
        public async Task<IActionResult> Deletes(string ids)
        {
            if (string.IsNullOrEmpty(ids))
            {
                return BadRequest();
            }
            try
            {
                var PasswordResetRequestIds = ids.Split(',').Where(x => !string.IsNullOrEmpty(x)).Select(x => Convert.ToInt32(x)).ToArray();
                await _baseService.DeleteAsync<PasswordResetRequest, int>(PasswordResetRequestIds);
                //await AddLogAsync(UserIdentity.FullName + ": xóa danh sách " + ids, "passwordresetrequest", (int)ActionLogs.Delete, (int)StatusLogs.Success);
                return Ok(true);
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}