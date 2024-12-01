using EPS.Identity.Data.Entities;
using EPS.Identity.Dtos.GroupUser;
using EPS.Identity.Services;
using EPS.Identity.BaseExt;
using EPS.Identity.Repositories.Interface; using EPS.Identity.Pages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EPS.Identity.Authorize;

namespace EPS.Identity.Controllers
{
    [Produces("application/json")]
    [Route("api/groupuser")]
    [Authorize]
    public class GroupUserController : BaseController
    {
        private CommonService _baseService;

        public GroupUserController(CommonService baseService)
        {
            _baseService = baseService;
        }

        //list all
        [BaseAuthorize("groupuser", true)]
        [HttpGet]
        public async Task<IActionResult> GetLists([FromQuery] GroupUserGridPaging pagingModel)
        {
            var predicates = pagingModel.GetPredicates();
            return Ok(await _baseService.FilterPagedAsync<GroupUser, GroupUserGridDto>(pagingModel, predicates.ToArray()));
        }

        //detail
        [BaseAuthorize("groupuser", true)]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await _baseService.FindAsync<GroupUser, GroupUserDetailDto>(id));
        }

        //create
        [BaseAuthorize("groupuser", EPS.Identity.Data.Enums.PrivilegeListEnum.Add)]
        [HttpPost]
        public async Task<IActionResult> Create(GroupUserCreateDto GroupUserCreateDto)
        {
            var pagingModel = new GroupUserGridPaging() { GroupId = GroupUserCreateDto.GroupId, UserId = GroupUserCreateDto.UserId, LstGroupIds=new List<int>() };
            var predicates = pagingModel.GetPredicates();
            var result = await _baseService.FilterPagedAsync<GroupUser, GroupUserGridDto>(pagingModel, predicates.ToArray());
            if (result.Data.Count > 0)
            {
                return BadRequest("Bản ghi đã tồn tại, vui lòng load lại trang đề làm mới");
            }
            await _baseService.CreateAsync<GroupUser, GroupUserCreateDto>(GroupUserCreateDto);
            return Ok();
        }

        //update
        [BaseAuthorize("groupuser", EPS.Identity.Data.Enums.PrivilegeListEnum.Edit)]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, GroupUserUpdateDto GroupUserUpdateDto)
        {
            await _baseService.UpdateAsync<GroupUser, GroupUserUpdateDto>(id, GroupUserUpdateDto);
            return Ok(true);
        }

        [BaseAuthorize("groupuser", EPS.Identity.Data.Enums.PrivilegeListEnum.Delete)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _baseService.DeleteAsync<GroupUser, int>(id);
            return Ok(true);
        }
        //create
        [BaseAuthorize("groupuser", EPS.Identity.Data.Enums.PrivilegeListEnum.Delete)]
        [HttpPut("remove")]
        public async Task<IActionResult> Remove(GroupUserCreateDto GroupUserCreateDto)
        {
            var pagingModel = new GroupUserGridPaging() { GroupId = GroupUserCreateDto.GroupId, UserId = GroupUserCreateDto.UserId, LstGroupIds = new List<int>() };
            var predicates = pagingModel.GetPredicates();
            var result = await _baseService.FilterPagedAsync<GroupUser, GroupUserGridDto>(pagingModel, predicates.ToArray());
            if(result.Data.Count>0)
            {
                await _baseService.DeleteAsync<GroupUser, int>(result.Data.FirstOrDefault().Id);
                return Ok(true);
            }
            return BadRequest("Không tìm thấy bản ghi");
        }
        //multiple delete 
        [BaseAuthorize("groupuser", EPS.Identity.Data.Enums.PrivilegeListEnum.Delete)]
        [HttpDelete]
        public async Task<IActionResult> Deletes(string ids)
        {
            if (string.IsNullOrEmpty(ids))
            {
                return BadRequest();
            }
            try
            {
                var GroupUserIds = ids.Split(',').Select(x => Convert.ToInt32(x)).ToArray();
                await _baseService.DeleteAsync<GroupUser, int>(GroupUserIds);
                return Ok(true);
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
