using EPS.Identity.Authorize;
using EPS.Identity.BaseExt;
using EPS.Identity.Data.Entities;
using EPS.Identity.Data.Enums;
using EPS.Identity.Dtos.TourGuideNode;
using EPS.Identity.Services;
using Microsoft.AspNetCore.Mvc;
namespace EPS.Identity.Controllers
{
    [Produces("application/json")]
    [Route("api/tourguidenode")]
    public class TourGuideNodeController : BaseController
    {
        private CommonService _baseService;
        public TourGuideNodeController(CommonService baseService)
        {
            _baseService = baseService;
        }

        [BaseAuthorize("tourguidenode", true)]
        [HttpGet]
        public async Task<IActionResult> GetLists([FromQuery] TourGuideNodeGridPaging pagingModel)
        {
            return Ok(await _baseService.FilterPagedAsync<TourGuideNode, TourGuideNodeGridDto>(pagingModel));
        }
        [BaseAuthorize("tourguidenode", true)]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            return Ok(await _baseService.FindAsync<TourGuideNode, TourGuideNodeDetailDto>(id));
        }


        //update-data
        [BaseAuthorize("tourguidenode", PrivilegeListEnum.Edit)]
        [HttpPost("del-egde/{id}")]
        public async Task<IActionResult> DelEdge(Guid id)
        {

            try
            {
                var data = await _baseService.FindAsync<TourGuideNode, TourGuideNodeDetailDto>(id);
                if (data is null)
                    return BadRequest("Bản ghi không tồn tại");

                TourGuideNodeUpdateDto dto = new()
                {
                    ClassOrId = data.ClassOrId,
                    attachment = data.attachment,
                    Content = data.Content,
                    Id = data.Id,
                    IsClickElem = data.IsClickElem,
                    IsHtml = data.IsHtml,
                    IsShow = data.IsShow,
                    KeyDiagram = data.KeyDiagram,
                    NodeId = null,
                    PositionX = data.PositionX,
                    PositionY = data.PositionY,
                    StepIndex = -1,
                    TextHtml = data.TextHtml,
                    Title = data.Title

                };

                await _baseService.UpdateAsync<TourGuideNode, TourGuideNodeUpdateDto>(id, dto);
                //await AddLogAsync(UserIdentity.FullName + ": sửa " + dto.Id, "tourguidenode", (int)ActionLogs.Edit, (int)StatusLogs.Success);
                return Ok(true);
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //create
        [BaseAuthorize("tourguidenode", PrivilegeListEnum.Add)]
        [HttpPost]
        public async Task<IActionResult> Create(TourGuideNodeCreateDto dto)
        {
            try
            {
                await _baseService.CreateAsync<TourGuideNode, TourGuideNodeCreateDto>(dto);
                //await AddLogAsync(UserIdentity.FullName + ": thêm " + dto.Id, "tourguidenode", (int)ActionLogs.Add, (int)StatusLogs.Success);
                return Ok();
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //update
        [BaseAuthorize("tourguidenode", PrivilegeListEnum.Edit)]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, TourGuideNodeUpdateDto dto)
        {
            try
            {
                var oTourGuideNodeDetail = await _baseService.FindAsync<TourGuideNode, TourGuideNodeDetailDto>(id);
                if (oTourGuideNodeDetail is null)
                    return BadRequest("Bản ghi không tồn tại");
                await _baseService.UpdateAsync<TourGuideNode, TourGuideNodeUpdateDto>(id, dto);
                //await AddLogAsync(UserIdentity.FullName + ": sửa " + dto.Id, "tourguidenode", (int)ActionLogs.Edit, (int)StatusLogs.Success);
                return Ok(true);
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [BaseAuthorize("tourguidenode", PrivilegeListEnum.Delete)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _baseService.DeleteAsync<TourGuideNode, Guid>(id);
                //await AddLogAsync(UserIdentity.FullName + ": xóa " + id, "tourguidenode", (int)ActionLogs.Delete, (int)StatusLogs.Success);
                return Ok(true);
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //multiple delete 
        [BaseAuthorize("tourguidenode", PrivilegeListEnum.Delete)]
        [HttpDelete]
        public async Task<IActionResult> Deletes(string ids)
        {
            if (string.IsNullOrEmpty(ids))
            {
                return BadRequest();
            }
            try
            {
                var TourGuideNodeIds = ids.Split(',').Where(x => !string.IsNullOrEmpty(x)).Select(x => Guid.Parse(x)).ToArray();
                await _baseService.DeleteAsync<TourGuideNode, Guid>(TourGuideNodeIds);
                //await AddLogAsync(UserIdentity.FullName + ": xóa danh sách " + ids, "tourguidenode", (int)ActionLogs.Delete, (int)StatusLogs.Success);
                return Ok(true);
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}