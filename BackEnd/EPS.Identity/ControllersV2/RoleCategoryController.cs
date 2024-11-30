
using EPS.Identity.Data.Entities;
using EPS.Identity.Dtos.RoleCategory;
using EPS.Identity.Services;
using EPS.Libary.Identity;
using EPS.Libary.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace EPS.API.Controllers
{
    [Produces("application/json")]
    [Route("api/rolecategory")]
    [Authorize]
    public class RoleCategoryController : BaseController
    {
        private EPSService _baseService;

        public RoleCategoryController(EPSService baseService)
        {
            _baseService = baseService;
        }

        
        [CustomAuthorize("rolecategory", true)]
        [HttpGet]
        public async Task<IActionResult> GetLists([FromQuery] RoleCategoryGridPaging pagingModel)
        {
            return Ok(await GetListsData(pagingModel));
        }
        private async Task<PagingResult<RoleCategoryGridDto>> GetListsData([FromQuery] RoleCategoryGridPaging pagingModel)
        {
            return await _baseService.FilterPagedAsync<RoleCategory, RoleCategoryGridDto>(pagingModel);
        }
       
        [CustomAuthorize("rolecategory", true)]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await _baseService.FindAsync<RoleCategory, RoleCategoryDetailDto>(id));
        }
        //create
        [CustomAuthorize("rolecategory", PrivilegeList.Add)]
        [HttpPost]
        public async Task<IActionResult> Create(RoleCategoryCreateDto RoleCategoryCreateDto)
        {
            try
            {
                await _baseService.CreateAsync<RoleCategory, RoleCategoryCreateDto>(RoleCategoryCreateDto);
                await AddLogAsync(UserIdentity.FullName + ": thêm " + RoleCategoryCreateDto.TieuDe, "rolecategory", (int)ActionLogs.Add, (int)StatusLogs.Success, RoleCategoryCreateDto.Id);
                return Ok();
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //update
        [CustomAuthorize("rolecategory", PrivilegeList.Edit)]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, RoleCategoryUpdateDto RoleCategoryUpdateDto)
        {
            try
            {
                var oRoleCategoryDetail = await _baseService.FindAsync<RoleCategory, RoleCategoryDetailDto>(id);
                if (oRoleCategoryDetail is null)
                    return BadRequest("Bản ghi không tồn tại");
                await _baseService.UpdateAsync<RoleCategory, RoleCategoryUpdateDto>(id, RoleCategoryUpdateDto);
                await AddLogAsync(UserIdentity.FullName + ": sửa " + RoleCategoryUpdateDto.TieuDe, "rolecategory", (int)ActionLogs.Edit, (int)StatusLogs.Success, RoleCategoryUpdateDto.Id);
                return Ok(true);
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [CustomAuthorize("rolecategory", PrivilegeList.Delete)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _baseService.DeleteAsync<RoleCategory, int>(id);
                await AddLogAsync(UserIdentity.FullName + ": xóa " + id, "rolecategory", (int)ActionLogs.Delete, (int)StatusLogs.Success, id);
                return Ok(true);
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //multiple delete 
        [CustomAuthorize("rolecategory", PrivilegeList.Delete)]
        [HttpDelete]
        public async Task<IActionResult> Deletes(string ids)
        {
            if (string.IsNullOrEmpty(ids))
            {
                return BadRequest();
            }
            try
            {
                var RoleCategoryIds = ids.Split(',').Where(x => !string.IsNullOrEmpty(x)).Select(x => Convert.ToInt32(x)).ToArray();
                await _baseService.DeleteAsync<RoleCategory, int>(RoleCategoryIds);
                await AddLogAsync(UserIdentity.FullName + ": xóa danh sách " + ids, "rolecategory", (int)ActionLogs.Delete, (int)StatusLogs.Success);
                return Ok(true);
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [CustomAuthorize("rolecategory", true)]
        [HttpGet("tree")]
        public async Task<IActionResult> GetListsTree([FromQuery] RoleCategoryTreeGridPaging pagingModel)
        {

            pagingModel.ItemsPerPage = -1;
            pagingModel.Page = 1;
            pagingModel.ParentId = -1;
            pagingModel.SortDesc = false;
            pagingModel.SortBy = "STT";
            var result = await _baseService.FilterPagedAsync<RoleCategory, RoleCategoryTreeGridDto>(pagingModel);
            var data = renderDataTree(result.Data);
            //var result = await BaseService.FilterPagedAsync<RoleCategory, RoleCategoryTreeGridDto>(pagingModel);
            return Ok(data);
        }

        private List<TreeRoleItem> renderDataTree(List<RoleCategoryTreeGridDto> treeData)
        {
            List<TreeRoleItem> LstReturn = new List<TreeRoleItem>();
            foreach (var item in treeData)
            {
                TreeRoleItem itemtree = new TreeRoleItem();
                itemtree.Id = item.Id;
                itemtree.Title = item.TieuDe;
                itemtree.IsRole = false;
                if (item.Children.Count > 0)
                {
                    var lstItem = renderDataTree(item.Children);
                    itemtree.Children.AddRange(lstItem);
                }
                if (item.LstRole.Count > 0)
                {
                    foreach (var itemRole in item.LstRole)
                        itemtree.Children.Add(new TreeRoleItem() { Id = itemRole.Id, Title = itemRole.Description, IsRole = true });
                }
                LstReturn.Add(itemtree);
            }
            return LstReturn;
        }
    }
}
