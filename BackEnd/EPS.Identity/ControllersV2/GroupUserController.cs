using EPS.Identity.Data.Entities;
using EPS.Identity.Dtos.GroupUser;
using EPS.Identity.Services;
using EPS.Libary.Identity;
using EPS.Libary.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EPS.Identity.Controllers
{
    [Produces("application/json")]
    [Route("api/groupuser")]
    [Authorize]
    public class GroupUserController : BaseController
    {
        private EPSService _baseService;

        public GroupUserController(EPSService baseService)
        {
            _baseService = baseService;
        }

        //list all
        [CustomAuthorize("groupuser", true)]
        [HttpGet]
        public async Task<IActionResult> GetLists([FromQuery] GroupUserGridPaging pagingModel)
        {
            var predicates = pagingModel.GetPredicates();
            return Ok(await _baseService.FilterPagedAsync<GroupUser, GroupUserGridDto>(pagingModel, predicates.ToArray()));
        }

        //detail
        [CustomAuthorize("groupuser", true)]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await _baseService.FindAsync<GroupUser, GroupUserDetailDto>(id));
        }

        //create
        [CustomAuthorize("groupuser", PrivilegeList.Add)]
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
        [CustomAuthorize("groupuser", PrivilegeList.Edit)]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, GroupUserUpdateDto GroupUserUpdateDto)
        {
            await _baseService.UpdateAsync<GroupUser, GroupUserUpdateDto>(id, GroupUserUpdateDto);
            return Ok(true);
        }

        [CustomAuthorize("groupuser", PrivilegeList.Delete)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _baseService.DeleteAsync<GroupUser, int>(id);
            return Ok(true);
        }
        //create
        [CustomAuthorize("groupuser", PrivilegeList.Delete)]
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
        [CustomAuthorize("groupuser", PrivilegeList.Delete)]
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
