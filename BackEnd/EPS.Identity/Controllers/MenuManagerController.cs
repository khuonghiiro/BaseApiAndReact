using EPS.Identity.Authorize;
using EPS.Identity.BaseExt;
using EPS.Identity.Data.Entities;
using EPS.Identity.Dtos.Group;
using EPS.Identity.Dtos.MenuManager;
using EPS.Identity.Pages;
using EPS.Identity.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EPS.API.Controllers
{
    [Produces("application/json")]
    [Route("api/menumanager")]
    [Authorize]
    public class MenuManagerController : BaseController
    {
        private CommonService _baseService;

        public MenuManagerController(CommonService baseService)
        {
            _baseService = baseService;
            lstALL = new List<MenuManagerGridDto>();
        }


        //list all
        [BaseAuthorize("menumanager", true)]
        [HttpGet]
        public async Task<IActionResult> GetLists([FromQuery] MenuManagerGridPaging pagingModel)
        {
            var result = await GetListsData(pagingModel);
            return Ok(result);
        }
        private async Task<PagingResult<MenuManagerGridDto>> GetListsData(MenuManagerGridPaging pagingModel)
        {

            return await _baseService.FilterPagedAsync<MenuManager, MenuManagerGridDto>(pagingModel);

        }
        [HttpGet("listtree")]
        public async Task<IActionResult> GetListTree([FromQuery] MenuManagerTreeGridPaging pagingModel)
        {
            pagingModel.ItemsPerPage = -1;
            pagingModel.Page = 1;
            return Ok(await _baseService.FilterPagedAsync<MenuManager, MenuManagerTreeGridDto>(pagingModel));
        }

        //detail
        [BaseAuthorize("menumanager", true)]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var oMenu = await _baseService.FindAsync<MenuManager, MenuManagerDetailDto>(id);
            if (!string.IsNullOrEmpty(oMenu.Groups))
            {
                var GroupIds = oMenu.Groups.Split(",")
                    .Where(x => !string.IsNullOrEmpty(x))
                    .Select(y => Convert.ToInt32(y)).ToList();
                if (GroupIds != null)
                {
                    oMenu.GroupIds = GroupIds;
                    foreach (var item in GroupIds)
                    {
                        GroupDetailDto oGroupUser = await _baseService.FindAsync<Group, GroupDetailDto>(item);
                        oMenu.LstGroups.Add(oGroupUser);
                    }
                }


            }
            return Ok(oMenu);
        }

        //create
        [BaseAuthorize("menumanager", EPS.Identity.Data.Enums.PrivilegeListEnum.Add)]
        [HttpPost]
        public async Task<IActionResult> Create(MenuManagerCreateDto MenuManagerCreateDto)
        {
            await _baseService.CreateAsync<MenuManager, MenuManagerCreateDto>(MenuManagerCreateDto);
            // await AddLogAsync(UserIdentity.FullName + ": thêm " + MenuManagerCreateDto.Title, "MENUMANAGERS", (int)ActionLogs.Add, (int)StatusLogs.Success);
            return Ok();
        }

        //update
        [BaseAuthorize("menumanager", EPS.Identity.Data.Enums.PrivilegeListEnum.Edit)]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, MenuManagerUpdateDto MenuManagerUpdateDto)
        {
            await _baseService.UpdateAsync<MenuManager, MenuManagerUpdateDto>(id, MenuManagerUpdateDto);
            // await AddLogAsync(UserIdentity.FullName + ": sửa " + MenuManagerUpdateDto.Title, "MENUMANAGERS", (int)ActionLogs.Edit, (int)StatusLogs.Success);
            return Ok(true);
        }

        [BaseAuthorize("menumanager", EPS.Identity.Data.Enums.PrivilegeListEnum.Delete)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _baseService.DeleteAsync<MenuManager, int>(id);
            // await AddLogAsync(UserIdentity.FullName + ": xóa " + id, "MENUMANAGERS", (int)ActionLogs.Delete, (int)StatusLogs.Success);
            return Ok(true);
        }

        //multiple delete 
        [BaseAuthorize("menumanager", EPS.Identity.Data.Enums.PrivilegeListEnum.Delete)]
        [HttpDelete]
        public async Task<IActionResult> Deletes(string ids)
        {
            if (string.IsNullOrEmpty(ids))
            {
                return BadRequest();
            }
            try
            {
                var MenuManagerIds = ids.Split(',').Select(x => Convert.ToInt32(x)).ToArray();
                await _baseService.DeleteAsync<MenuManager, int>(MenuManagerIds);
                // await AddLogAsync(UserIdentity.FullName + ": xóa danh sách " + ids, "MENUMANAGERS", (int)ActionLogs.Delete, (int)StatusLogs.Success);
                return Ok(true);
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("selectmenu")]
        public async Task<IActionResult> GetSelectMENU()
        {
            lstALL = new List<MenuManagerGridDto>();
            MenuManagerGridPaging paging = new MenuManagerGridPaging();
            paging.ItemsPerPage = 0;
            var predicates = paging.GetPredicates();
            lstALL = _baseService.FilterPaged<MenuManager, MenuManagerGridDto>(paging, predicates.ToArray()).Data;
            getMenuCon(0, lstALL, "");
            return Ok(new PagingResult<MenuManagerGridDto> { Data = treeView });
        }
        private List<MenuManagerGridDto> treeView = new List<MenuManagerGridDto>();
        private void getMenuCon(int idCha, List<MenuManagerGridDto> lstALL, string startWith)
        {
            List<MenuManagerGridDto> tempMenu = new List<MenuManagerGridDto>();
            if (idCha == 0)
            {
                tempMenu = lstALL.Where(x => (x.ParentId == null)).OrderBy(y => y.Stt).ToList();
            }
            else
            {
                tempMenu = lstALL.Where(x => x.ParentId == idCha).OrderBy(y => y.Stt).ToList();
            }
            foreach (var item in tempMenu)
            {
                item.Title = startWith + item.Title;
                treeView.Add(item);
                getMenuCon(item.Id, lstALL, "--");
            }
        }
        List<MenuManagerGridDto> lstALL { get; set; }
        [HttpGet("treemenu")]
        public async Task<IActionResult> GetTREEMENU()
        {
            List<MenuManagerGridDto> treeView = new List<MenuManagerGridDto>();
            lstALL = new List<MenuManagerGridDto>();
            MenuManagerGridPaging param = new MenuManagerGridPaging();
            param.ItemsPerPage = -1;
            param.Page = 1;
            param.IsAllShow = true;
            var predicates = param.GetPredicates();
            lstALL = _baseService.FilterPaged<MenuManager, MenuManagerGridDto>(param, predicates.ToArray()).Data;
            // là admin thì view hết
            if (UserIdentity.IsAdministrator)
            {
                treeView = BuldTreeView(0, lstALL);
            }
            else
            {
                if (!string.IsNullOrEmpty(UserIdentity.UnitId))
                {
                    string[] tempIDs = UserIdentity.UnitId.Split(',');
                    lstALL = lstALL.Where(x => tempIDs.Any(y => x.Groups.Contains(string.Format(",{0},", y)))).ToList();
                    treeView = BuldTreeView(0, lstALL);
                }
            }
            treeView = BuldTreeView(0, lstALL);
            return Ok(new PagingResult<MenuManagerGridDto> { Data = treeView });
        }
        private List<MenuManagerGridDto> BuldTreeView(int idCha, List<MenuManagerGridDto> lstALL)
        {
            List<MenuManagerGridDto> tempMenu = new List<MenuManagerGridDto>();
            if (idCha == 0)
            {
                tempMenu = lstALL.Where(x => (x.ParentId == null)).OrderBy(y => y.Stt).ToList();
            }
            else
            {
                tempMenu = lstALL.Where(x => x.ParentId == idCha).OrderBy(y => y.Stt).ToList();
            }
            foreach (var item in tempMenu)
            {
                item.Childrens = BuldTreeView(item.Id, lstALL);
            }
            return tempMenu;
        }
    }
}
