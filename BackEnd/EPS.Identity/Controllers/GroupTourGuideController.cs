using EPS.Identity.Authorize;
using EPS.Identity.BaseExt;
using EPS.Identity.Data.Entities;
using EPS.Identity.Data.Enums;
using EPS.Identity.Dtos.GroupTourGuide;
using EPS.Identity.Dtos.TourGuideNode;
using EPS.Identity.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
namespace EPS.Identity.Controllers
{
    [Produces("application/json")]
    [Route("api/grouptourguide")]
    public class GroupTourGuideController : BaseController
    {
        private CommonService _baseService;
        public GroupTourGuideController(CommonService baseService)
        {
            _baseService = baseService;
        }
        [BaseAuthorize("grouptourguide", true)]
        [HttpGet]
        public async Task<IActionResult> GetLists([FromQuery] GroupTourGuideGridPaging pagingModel)
        {
            return Ok(await _baseService.FilterPagedAsync<GroupTourGuide, GroupTourGuideGridDto>(pagingModel));
        }

        [BaseAuthorize("grouptourguide", true)]
        [HttpGet("steps")]
        public async Task<IActionResult> GetListStepV2s([FromQuery] GroupTourGuideGridPaging pagingModel)
        {
            var listGroupTourGuides = await _baseService.FilterPagedAsync<GroupTourGuide, GroupTourGuideGridDto>(pagingModel);

            Dictionary<string, List<StepDto>> stepsDictionary = new();
            Dictionary<string, List<TourStepDto>> listDict = new();

            if (listGroupTourGuides.Success)
            {
                foreach (var item in listGroupTourGuides.Data)
                {
                    stepsDictionary[item.KeyName] = JsonConvert.DeserializeObject<List<StepDto>>(item.ListNodes ?? "[]") ?? new();
                }

                foreach (var kvp in stepsDictionary)
                {
                    TourGuideNodeGridPaging pagingNodeModel = new TourGuideNodeGridPaging();

                    pagingNodeModel.ItemsPerPage = 1000;
                    pagingNodeModel.Ids = kvp.Value.OrderBy(o => o.StepIndex).Select(x => x.Id).ToList();

                    // Chuyển đổi danh sách thành dictionary
                    Dictionary<Guid, int> stepDictionary = kvp.Value.ToDictionary(step => step.Id, step => step.StepIndex);


                    var listDataNodes = await _baseService.FilterPagedAsync<TourGuideNode, TourGuideNodeGridDto>(pagingNodeModel);

                    if (listDataNodes.Success && listDataNodes.Data != null)
                    {
                        List<TourStepDto> listDto = new();

                        foreach (var item in listDataNodes.Data)
                        {
                            if (!item.IsShow) continue;

                            TourStepDto input = new();
                            input.IsClickElem = item.IsClickElem;
                            input.Title = item.Title;
                            input.Content = item.IsHtml ? (item.TextHtml ?? "") : (item.Content ?? "");
                            input.Order = stepDictionary[item.Id];
                            input.Selector = item.ClassOrId;
                            input.Attachment = item.attachment;

                            listDto.Add(input);
                        }

                        listDict[kvp.Key] = listDto.OrderBy(s => s.Order).ToList();

                    }

                }


            }
            return Ok(listDict);
        }

        [BaseAuthorize("grouptourguide", true)]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            return Ok(await _baseService.FindAsync<GroupTourGuide, GroupTourGuideDetailDto>(id));
        }
        //create
        [BaseAuthorize("grouptourguide", PrivilegeListEnum.Add)]
        [HttpPost]
        public async Task<IActionResult> Create(GroupTourGuideCreateDto dto)
        {
            try
            {
                if (dto.ListGroupCodes != null && dto.ListGroupCodes.Count > 0)
                {
                    dto.GroupIds = "," + string.Join(",", dto.ListGroupCodes.Select(x => x)) + ",";
                }
                await _baseService.CreateAsync<GroupTourGuide, GroupTourGuideCreateDto>(dto);
                //await AddLogAsync(UserIdentity.FullName + ": thêm " + dto.Id, "grouptourguide", (int)ActionLogs.Add, (int)StatusLogs.Success);
                return Ok();
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //update
        [BaseAuthorize("grouptourguide", PrivilegeListEnum.Edit)]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, GroupTourGuideUpdateDto dto)
        {
            try
            {
                var oGroupTourGuideDetail = await _baseService.FindAsync<GroupTourGuide, GroupTourGuideDetailDto>(id);
                if (oGroupTourGuideDetail is null)
                    return BadRequest("Bản ghi không tồn tại");

                if (dto.ListGroupCodes != null && dto.ListGroupCodes.Count > 0)
                {
                    dto.GroupIds = "," + string.Join(",", dto.ListGroupCodes.Select(x => x)) + ",";
                }

                await _baseService.UpdateAsync<GroupTourGuide, GroupTourGuideUpdateDto>(id, dto);
                //await AddLogAsync(UserIdentity.FullName + ": sửa " + dto.Id, "grouptourguide", (int)ActionLogs.Edit, (int)StatusLogs.Success);
                return Ok(true);
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [BaseAuthorize("grouptourguide", PrivilegeListEnum.Delete)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _baseService.DeleteAsync<GroupTourGuide, Guid>(id);
                //await AddLogAsync(UserIdentity.FullName + ": xóa " + id, "grouptourguide", (int)ActionLogs.Delete, (int)StatusLogs.Success);
                return Ok(true);
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //multiple delete 
        [BaseAuthorize("grouptourguide", PrivilegeListEnum.Delete)]
        [HttpDelete]
        public async Task<IActionResult> Deletes(string ids)
        {
            if (string.IsNullOrEmpty(ids))
            {
                return BadRequest();
            }
            try
            {
                var GroupTourGuideIds = ids.Split(',').Where(x => !string.IsNullOrEmpty(x)).Select(x => Guid.Parse(x)).ToArray();
                await _baseService.DeleteAsync<GroupTourGuide, Guid>(GroupTourGuideIds);
                //await AddLogAsync(UserIdentity.FullName + ": xóa danh sách " + ids, "grouptourguide", (int)ActionLogs.Delete, (int)StatusLogs.Success);
                return Ok(true);
            }
            catch (FormatException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}