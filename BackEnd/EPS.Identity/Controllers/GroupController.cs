using EPS.Identity.Authorize;
using EPS.Identity.BaseExt;
using EPS.Identity.Data.Entities;
using EPS.Identity.Data.Enums;
using EPS.Identity.Dtos.Group;
using EPS.Identity.Repositories.Interface; using EPS.Identity.Pages;
using EPS.Identity.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EPS.Identity.Controllers
{
    [Produces("application/json")]
    [Route("api/groups")]
    [Authorize]
    public class GroupController : BaseController
    {
        private CommonService _baseService;
        private readonly IUserIdentity<int> _userIdentity;

        public GroupController(CommonService baseService, IUserIdentity<int> userIdentity)
        {
            _baseService = baseService;
            _userIdentity = userIdentity;
        }

        //list all
        [BaseAuthorize("groups", true)]
        [HttpGet]
        public async Task<IActionResult> GetLists([FromQuery] GroupGridPaging pagingModel)
        {
            var predicates = pagingModel.GetPredicates();
            var result = await _baseService.FilterPagedAsync<Group, GroupGridDto>(pagingModel, predicates.ToArray());
            return Ok(result);
        }

        //detail
        [BaseAuthorize("groups", true)]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await _baseService.FindAsync<Group, GroupDetailDto>(id));
        }

        //create
        [BaseAuthorize("groups", PrivilegeListEnum.Add)]
        [HttpPost]
        public async Task<IActionResult> Create(GroupCreateDto GroupCreateDto)
        {
            await _baseService.CreateAsync<Group, GroupCreateDto>(GroupCreateDto);
            //// //await AddLogAsync("Thêm mới: " + GroupCreateDto.Title, "Groups", (int)ActionLogs.Add, (int)StatusLogs.Success, GroupCreateDto.Id);
            return Ok();
        }

        //update
        [BaseAuthorize("groups", EPS.Identity.Data.Enums.PrivilegeListEnum.Edit)]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, GroupUpdateDto GroupUpdateDto)
        {
            await _baseService.UpdateAsync<Group, GroupUpdateDto>(id, GroupUpdateDto);
            //// //await AddLogAsync("Chỉnh sửa: " + GroupUpdateDto.Title, "Groups", (int)ActionLogs.Edit, (int)StatusLogs.Success, GroupUpdateDto.Id);
            return Ok(true);
        }

        [BaseAuthorize("groups", EPS.Identity.Data.Enums.PrivilegeListEnum.Delete)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _baseService.DeleteAsync<Group, int>(id);
            //// //await AddLogAsync("Xóa: " + id, "Groups", (int)ActionLogs.Delete, (int)StatusLogs.Success, id);
            return Ok(true);
        }

        //multiple delete 
        [BaseAuthorize("groups", EPS.Identity.Data.Enums.PrivilegeListEnum.Delete)]
        [HttpDelete]
        public async Task<IActionResult> Deletes(string ids)
        {
            if (string.IsNullOrEmpty(ids))
            {
                return BadRequest();
            }
            try
            {
                var GroupIds = ids.Split(',').Select(x => Convert.ToInt32(x)).ToArray();
                await _baseService.DeleteAsync<Group, int>(GroupIds);
                foreach (var id in GroupIds)
                {
                    //// //await AddLogAsync("Xóa: " + id, "Groups", (int)ActionLogs.Delete, (int)StatusLogs.Success, id);
                }
                return Ok(true);

            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
