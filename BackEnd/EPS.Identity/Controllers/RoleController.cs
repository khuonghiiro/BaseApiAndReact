using EPS.Identity.Data.Entities;
using EPS.Identity.Dtos.GroupRolePermission;
using EPS.Identity.Dtos.Permission;
using EPS.Identity.Dtos.Role;
using EPS.Identity.Services;
using EPS.Identity.BaseExt;
using EPS.Identity.Repositories.Interface; 
using EPS.Identity.Pages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EPS.Identity.Authorize;

namespace EPS.Identity.Controllers
{
    [Produces("application/json")]
    [Route("api/roles")]
    [Authorize]
    public class RoleController : BaseController
    {
        private CommonService _baseService;

        public RoleController(CommonService baseService)
        {
            _baseService = baseService;
        }

        //list all
        [BaseAuthorize("roles", true)]
        [HttpGet]
        public async Task<IActionResult> GetListRoles([FromQuery] RoleGridPagingDto pagingModel)
        {
            var predicates = pagingModel.GetPredicates();
            return Ok(await _baseService.FilterPagedAsync<Role, RoleGridDto>(pagingModel, predicates.ToArray()));
        }


        //detail
        [BaseAuthorize("roles", true)]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoleById(int id)
        {
            return Ok(await _baseService.FindAsync<Role, RoleDetailDto>(id));
        }

        //create
        [BaseAuthorize("roles", EPS.Identity.Data.Enums.PrivilegeListEnum.Add)]
        [HttpPost]
        public async Task<IActionResult> Create(RoleCreateDto roleCreateDto)
        {
            await _baseService.CreateAsync<Role, RoleCreateDto>(roleCreateDto);
            return Ok();
        }

        //update
        [BaseAuthorize("roles", EPS.Identity.Data.Enums.PrivilegeListEnum.Edit)]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(int id, RoleUpdateDto roleUpdateDto)
        {
            await _baseService.UpdateAsync<Role, RoleUpdateDto>(id, roleUpdateDto);
            return Ok(true);
        }

        [BaseAuthorize("roles", EPS.Identity.Data.Enums.PrivilegeListEnum.Delete)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _baseService.DeleteAsync<Role, int>(id);
            return Ok(true);
        }

        //multiple delete 
        [BaseAuthorize("roles", EPS.Identity.Data.Enums.PrivilegeListEnum.Delete)]
        [HttpDelete]
        public async Task<IActionResult> DeleteRoles(string ids)
        {
            if (string.IsNullOrEmpty(ids))
            {
                return BadRequest();
            }
            try
            {
                var roleIds = ids.Split(',').Select(x => Convert.ToInt32(x)).ToArray();
                await _baseService.DeleteAsync<Role, int>(roleIds);
                return Ok(true);
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //update
        [BaseAuthorize("roles", EPS.Identity.Data.Enums.PrivilegeListEnum.Edit)]
        [HttpPut("updategrp")]
        public async Task<IActionResult> UpdateGRP(RolePerGridDto roleDto)
        {
            var pagingModelper = new PermissionGridPaging();
            var predicatesPer = pagingModelper.GetPredicates();
            var oPermission = await _baseService.FilterPagedAsync<Permission, PermissionGridDto>(pagingModelper, predicatesPer.ToArray());
            if (roleDto.Id>0&&roleDto.GroupId>0&& oPermission.TotalRows>0)
            {

                //Thêm
                var idPer1 = oPermission.Data.Where(x => x.Code.Equals("01")).FirstOrDefault()?.Id;
                if (idPer1.HasValue&&idPer1>0)
                {
                    var pagingModel1 = new GroupRolePermissionGridPaging() { PermissionId = idPer1.Value, RoleId = roleDto.Id, GroupId = roleDto.GroupId };
                    var predicates1 = pagingModel1.GetPredicates();
                    var result1 = await _baseService.FilterPagedAsync<GroupRolePermission, GroupRolePermissionGridDto>(pagingModel1, predicates1.ToArray());
                    if (result1.Data.Count > 0)
                    {
                        GroupRolePermissionUpdateDto oUpdate1 = new GroupRolePermissionUpdateDto { Id = result1.Data.FirstOrDefault().Id, PermissionId = idPer1.Value, RoleId = roleDto.Id, GroupId = roleDto.GroupId, Value = roleDto.ActAdd == true ? 1 : 0 };
                        await _baseService.UpdateAsync<GroupRolePermission, GroupRolePermissionUpdateDto>(result1.Data.FirstOrDefault().Id, oUpdate1);

                    }
                    else
                    {
                        GroupRolePermissionCreateDto oCreate1 = new GroupRolePermissionCreateDto() { PermissionId = idPer1.Value, RoleId = roleDto.Id, GroupId = roleDto.GroupId, Value = roleDto.ActAdd == true ? 1 : 0 };
                        await _baseService.CreateAsync<GroupRolePermission, GroupRolePermissionCreateDto>(oCreate1);
                    }
                }

                //Sửa
                var idPer2 = oPermission.Data.Where(x => x.Code.Equals("02")).FirstOrDefault()?.Id;
                if (idPer2.HasValue && idPer2 > 0)
                {
                    var pagingModel1 = new GroupRolePermissionGridPaging() { PermissionId = idPer2.Value, RoleId = roleDto.Id, GroupId = roleDto.GroupId };
                    var predicates1 = pagingModel1.GetPredicates();
                    var result1 = await _baseService.FilterPagedAsync<GroupRolePermission, GroupRolePermissionGridDto>(pagingModel1, predicates1.ToArray());
                    if (result1.Data.Count > 0)
                    {
                        GroupRolePermissionUpdateDto oUpdate1 = new GroupRolePermissionUpdateDto { Id = result1.Data.FirstOrDefault().Id, PermissionId = idPer2.Value, RoleId = roleDto.Id, GroupId = roleDto.GroupId, Value = roleDto.ActEdit == true ? 1 : 0 };
                        await _baseService.UpdateAsync<GroupRolePermission, GroupRolePermissionUpdateDto>(result1.Data.FirstOrDefault().Id, oUpdate1);

                    }
                    else
                    {
                        GroupRolePermissionCreateDto oCreate1 = new GroupRolePermissionCreateDto() { PermissionId = idPer2.Value, RoleId = roleDto.Id, GroupId = roleDto.GroupId, Value = roleDto.ActEdit == true ? 1 : 0 };
                        await _baseService.CreateAsync<GroupRolePermission, GroupRolePermissionCreateDto>(oCreate1);
                    }
                }

                //Xóa
                var idPer3 = oPermission.Data.Where(x => x.Code.Equals("03")).FirstOrDefault()?.Id;
                if (idPer3.HasValue && idPer3 > 0)
                {
                    var pagingModel1 = new GroupRolePermissionGridPaging() { PermissionId = idPer3.Value, RoleId = roleDto.Id, GroupId = roleDto.GroupId };
                    var predicates1 = pagingModel1.GetPredicates();
                    var result1 = await _baseService.FilterPagedAsync<GroupRolePermission, GroupRolePermissionGridDto>(pagingModel1, predicates1.ToArray());
                    if (result1.Data.Count > 0)
                    {
                        GroupRolePermissionUpdateDto oUpdate1 = new GroupRolePermissionUpdateDto { Id = result1.Data.FirstOrDefault().Id, PermissionId = idPer3.Value, RoleId = roleDto.Id, GroupId = roleDto.GroupId, Value = roleDto.ActDelete == true ? 1 : 0 };
                        await _baseService.UpdateAsync<GroupRolePermission, GroupRolePermissionUpdateDto>(result1.Data.FirstOrDefault().Id, oUpdate1);

                    }
                    else
                    {
                        GroupRolePermissionCreateDto oCreate1 = new GroupRolePermissionCreateDto() { PermissionId = idPer3.Value, RoleId = roleDto.Id, GroupId = roleDto.GroupId, Value = roleDto.ActDelete == true ? 1 : 0 };
                        await _baseService.CreateAsync<GroupRolePermission, GroupRolePermissionCreateDto>(oCreate1);
                    }
                }

                //Phê duyệt
                var idPer4 = oPermission.Data.Where(x => x.Code.Equals("04")).FirstOrDefault()?.Id;
                if (idPer4.HasValue && idPer4 > 0)
                {
                    var pagingModel1 = new GroupRolePermissionGridPaging() { PermissionId = idPer4.Value, RoleId = roleDto.Id, GroupId = roleDto.GroupId };
                    var predicates1 = pagingModel1.GetPredicates();
                    var result1 = await _baseService.FilterPagedAsync<GroupRolePermission, GroupRolePermissionGridDto>(pagingModel1, predicates1.ToArray());
                    if (result1.Data.Count > 0)
                    {
                        GroupRolePermissionUpdateDto oUpdate1 = new GroupRolePermissionUpdateDto { Id = result1.Data.FirstOrDefault().Id, PermissionId = idPer4.Value, RoleId = roleDto.Id, GroupId = roleDto.GroupId, Value = roleDto.ActApprove == true ? 1 : 0 };
                        await _baseService.UpdateAsync<GroupRolePermission, GroupRolePermissionUpdateDto>(result1.Data.FirstOrDefault().Id, oUpdate1);

                    }
                    else
                    {
                        GroupRolePermissionCreateDto oCreate1 = new GroupRolePermissionCreateDto() { PermissionId = idPer4.Value, RoleId = roleDto.Id, GroupId = roleDto.GroupId, Value = roleDto.ActApprove == true ? 1 : 0 };
                        await _baseService.CreateAsync<GroupRolePermission, GroupRolePermissionCreateDto>(oCreate1);
                    }
                }

                //Quyền chức năng
                var idPer5 = oPermission.Data.Where(x => x.Code.Equals("05")).FirstOrDefault()?.Id;
                if (idPer5.HasValue && idPer5 > 0)
                {
                    var pagingModel1 = new GroupRolePermissionGridPaging() { PermissionId = idPer5.Value, RoleId = roleDto.Id, GroupId = roleDto.GroupId };
                    var predicates1 = pagingModel1.GetPredicates();
                    var result1 = await _baseService.FilterPagedAsync<GroupRolePermission, GroupRolePermissionGridDto>(pagingModel1, predicates1.ToArray());
                    if (result1.Data.Count > 0)
                    {
                        GroupRolePermissionUpdateDto oUpdate1 = new GroupRolePermissionUpdateDto { Id = result1.Data.FirstOrDefault().Id, PermissionId = idPer5.Value, RoleId = roleDto.Id, GroupId = roleDto.GroupId, Value = roleDto.ActPer == true ? 1 : 0 };
                        await _baseService.UpdateAsync<GroupRolePermission, GroupRolePermissionUpdateDto>(result1.Data.FirstOrDefault().Id, oUpdate1);

                    }
                    else
                    {
                        GroupRolePermissionCreateDto oCreate1 = new GroupRolePermissionCreateDto() { PermissionId = idPer5.Value, RoleId = roleDto.Id, GroupId = roleDto.GroupId, Value = roleDto.ActPer == true ? 1 : 0 };
                        await _baseService.CreateAsync<GroupRolePermission, GroupRolePermissionCreateDto>(oCreate1);
                    }
                }
                return Ok("Cập nhật thành công");
            }
            else
            {
                return BadRequest("Cập nhật quyền không thành công");
            }
        }
    }
}
