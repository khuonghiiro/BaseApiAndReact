using Microsoft.AspNetCore.Mvc;
using EPS.Libary.Utils;
using EPS.Identity.Dtos.TourGuideNode;
using EPS.Identity.Services;
using EPS.Libary.Identity;
using EPS.Identity.Data;
using Microsoft.AspNetCore.Authorization;
namespace EPS.Identity.Controllers
{
    [Produces("application/json")]
    [Route("api/tourguidenode")]
    public class TourGuideNodeController : BaseController
    {
        private EPSService _baseService;
        public TourGuideNodeController(EPSService baseService)
        {
            _baseService = baseService;
        }

        [CustomAuthorize("tourguidenode", true)]
        [HttpGet]
        public async Task<IActionResult> GetLists([FromQuery] TourGuideNodeGridPaging pagingModel)
        {
            return Ok(await _baseService.FilterPagedAsync<TourGuideNode, TourGuideNodeGridDto>(pagingModel));
        }
        [CustomAuthorize("tourguidenode", true)]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            return Ok(await _baseService.FindAsync<TourGuideNode, TourGuideNodeDetailDto>(id));
        }


        //update-data
        [CustomAuthorize("tourguidenode", PrivilegeList.Edit)]
        [HttpPost("del-egde/{id}")]
        public async Task<IActionResult> DelEdge(Guid id)
        {
            
            try
            {
                var data = await _baseService.FindAsync<TourGuideNode, TourGuideNodeDetailDto>(id);
                if (data is null)
                    return BadRequest("Bản ghi không tồn tại");

                TourGuideNodeUpdateDto dto = new(){ 
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
                await AddLogAsync(UserIdentity.FullName + ": sửa " + dto.Id, "tourguidenode", (int)ActionLogs.Edit, (int)StatusLogs.Success);
                return Ok(true);
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //create
        [CustomAuthorize("tourguidenode", PrivilegeList.Add)]
        [HttpPost]
        public async Task<IActionResult> Create(TourGuideNodeCreateDto dto)
        {
            try
            {
                await _baseService.CreateAsync<TourGuideNode, TourGuideNodeCreateDto>(dto);
                await AddLogAsync(UserIdentity.FullName + ": thêm " + dto.Id, "tourguidenode", (int)ActionLogs.Add, (int)StatusLogs.Success);
                return Ok();
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //update
        [CustomAuthorize("tourguidenode", PrivilegeList.Edit)]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id,TourGuideNodeUpdateDto dto)
        {
            try
            {
                var oTourGuideNodeDetail = await _baseService.FindAsync<TourGuideNode, TourGuideNodeDetailDto>(id);
                if (oTourGuideNodeDetail is null)
                    return BadRequest("Bản ghi không tồn tại");
                await _baseService.UpdateAsync<TourGuideNode, TourGuideNodeUpdateDto>(id, dto);
                await AddLogAsync(UserIdentity.FullName + ": sửa " + dto.Id, "tourguidenode", (int)ActionLogs.Edit, (int)StatusLogs.Success);
                return Ok(true);
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [CustomAuthorize("tourguidenode", PrivilegeList.Delete)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _baseService.DeleteAsync<TourGuideNode, Guid>(id);
                await AddLogAsync(UserIdentity.FullName + ": xóa " + id, "tourguidenode", (int)ActionLogs.Delete, (int)StatusLogs.Success);
                return Ok(true);
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //multiple delete 
        [CustomAuthorize("tourguidenode", PrivilegeList.Delete)]
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
                await AddLogAsync(UserIdentity.FullName + ": xóa danh sách " + ids, "tourguidenode", (int)ActionLogs.Delete, (int)StatusLogs.Success);
                return Ok(true);
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}