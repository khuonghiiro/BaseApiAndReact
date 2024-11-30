using EPS.Identity.Data.Entities;
using EPS.Identity.Dtos.Permission;
using EPS.Identity.Services;
using EPS.Libary.Identity;
using EPS.Libary.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EPS.Identity.Controllers
{
    [Produces("application/json")]
    [Route("api/permissions")]
    [Authorize]
    public class PermissionController : BaseController
    {
        private EPSService _baseService;

        public PermissionController(EPSService baseService)
        {
            _baseService = baseService;
        }

        //list all
        [CustomAuthorize("permissions", true)]
        [HttpGet]
        public async Task<IActionResult> GetLists([FromQuery]PermissionGridPaging pagingModel)
        {
            var predicates = pagingModel.GetPredicates();
            return Ok(await _baseService.FilterPagedAsync<Permission, PermissionGridDto>(pagingModel, predicates.ToArray()));
        }

        //detail
        [CustomAuthorize("permissions", true)]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await _baseService.FindAsync<Permission, PermissionDetailDto>(id));
        }

        //create
        [CustomAuthorize("permissions", PrivilegeList.Add)]
        [HttpPost]
        public async Task<IActionResult> Create(PermissionCreateDto PermissionCreateDto)
        {
            await _baseService.CreateAsync<Permission, PermissionCreateDto>(PermissionCreateDto);
            return Ok();
        }

        //update
        [CustomAuthorize("permissions", PrivilegeList.Edit)]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, PermissionUpdateDto PermissionUpdateDto)
        {
            await _baseService.UpdateAsync<Permission, PermissionUpdateDto>(id, PermissionUpdateDto);
            return Ok(true);
        }

        //[CustomAuthorize(PrivilegeList.ManagePermission)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _baseService.DeleteAsync<Permission, int>(id);
            return Ok(true);
        }

        //multiple delete 
        //[CustomAuthorize(PrivilegeList.ManagePermission)]
        [HttpDelete]
        public async Task<IActionResult> Deletes(string ids)
        {
            if (string.IsNullOrEmpty(ids))
            {
                return BadRequest();
            }
            try
            {
                var PermissionIds = ids.Split(',').Select(x => Convert.ToInt32(x)).ToArray();
                await _baseService.DeleteAsync<Permission, int>(PermissionIds);
                return Ok(true);
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }       
    }
}
