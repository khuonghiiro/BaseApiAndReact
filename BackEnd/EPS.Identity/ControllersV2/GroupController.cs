using EPS.Identity.Data.Entities;
using EPS.Identity.Dtos.Group;
using EPS.Identity.Services;
using EPS.Libary.Identity;
using EPS.Libary.RabbitManager;
using EPS.Libary.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EPS.Identity.Controllers
{
    [Produces("application/json")]
    [Route("api/groups")]
    [Authorize]
    public class GroupController : BaseController
    {
        private EPSService _baseService;
        private readonly IUserIdentity<int> _userIdentity;

        public GroupController(EPSService baseService, IUserIdentity<int> userIdentity)
        {
            _baseService = baseService;
            _userIdentity = userIdentity;
        }

        //list all
        [CustomAuthorize("groups", true)]
        [HttpGet]
        public async Task<IActionResult> GetLists([FromQuery]GroupGridPaging pagingModel)
        {
            var predicates = pagingModel.GetPredicates();
            var result = await _baseService.FilterPagedAsync<Group, GroupGridDto>(pagingModel, predicates.ToArray());
            return Ok(result);
        }

        //detail
        [CustomAuthorize("groups", true)]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await _baseService.FindAsync<Group, GroupDetailDto>(id));
        }

        //create
        [CustomAuthorize("groups", PrivilegeList.Add)]
        [HttpPost]
        public async Task<IActionResult> Create(GroupCreateDto GroupCreateDto)
        {
            await _baseService.CreateAsync<Group, GroupCreateDto>(GroupCreateDto);
            await AddLogAsync("Thêm mới: " + GroupCreateDto.Title, "Groups", (int)ActionLogs.Add, (int)StatusLogs.Success, GroupCreateDto.Id);
            return Ok();
        }

        //update
        [CustomAuthorize("groups", PrivilegeList.Edit)]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, GroupUpdateDto GroupUpdateDto)
        {
            await _baseService.UpdateAsync<Group, GroupUpdateDto>(id, GroupUpdateDto);
            await AddLogAsync( "Chỉnh sửa: " + GroupUpdateDto.Title, "Groups", (int) ActionLogs.Edit, (int)StatusLogs.Success, GroupUpdateDto.Id);
            return Ok(true);
        }

        [CustomAuthorize("groups", PrivilegeList.Delete)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _baseService.DeleteAsync<Group, int>(id);
            await AddLogAsync( "Xóa: " + id, "Groups", (int)ActionLogs.Delete, (int)StatusLogs.Success, id);
            return Ok(true);
        }

        //multiple delete 
        [CustomAuthorize("groups", PrivilegeList.Delete)]
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
                foreach(var id in GroupIds)
                {
                    await AddLogAsync( "Xóa: " + id, "Groups", (int)ActionLogs.Delete, (int)StatusLogs.Success, id);
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
