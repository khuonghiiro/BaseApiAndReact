"use client";
import { GridView } from "@/shared/components/data-grid";
import { DefaultMeta, DefaulPer } from "@/public/app-setting";
import {
  handleChangeAction,
  formatDateTime,
  delAction,
  listReducer,
  getPermisson,
  INITIAL_STATE_LIST,
  ACTION_TYPES,
} from "@/lib/common";
import { TanetInput, TanetSelectTreeCheck, TanetSelect, SelectAsync, TanetFormDate } from "@/lib";
import { useReducer, useState, useEffect } from "react";
import { ticketServices } from "../services";
import { MdOpenInBrowser } from "react-icons/md";
import { FaBusinessTime } from "react-icons/fa";
import {
  AiOutlinePlus,
  AiFillEdit,
  AiFillDelete,
  AiTwotoneEye,
  AiOutlineSend,
  AiFillCheckCircle,
  AiFillCloseCircle
} from "react-icons/ai";
import { FaAngleDown, FaAnglesDown, FaAngleUp, FaAnglesUp, FaEquals } from "react-icons/fa6";
import TicketForm from "./ticket-form";
import { toast } from "react-toastify";
import ConfirmationDialog, { confirm } from "@/shared/components/confirm";
import { EPriorityTicket, TicketStatusEnum } from "../ticket-status-enum";
import TicketStatusForm from "./ticket-status-form";
import TicketView from "./ticket-view";

export const TicketList = ({ status, selectTicketId }: {
  status: number;
  selectTicketId?: string | null;
}) => {
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
    filter: {
      status: status
    }
  });
  const [permisson, setPermisson] = useState<any>({
    ...DefaulPer,

  });
  const { data, isLoading, mutate } = ticketServices.GetList(meta);
  const { data: dataProjects } = ticketServices.GetListProject();
  const { data: dataUsers } = ticketServices.GetAllUsers('');
  const { data: dataStatus } = ticketServices.getAllEnum('EStatusTicket');
  const { data: dataPriority } = ticketServices.getAllEnum('EPriorityTicket');
  const [state, dispatch] = useReducer(listReducer, INITIAL_STATE_LIST);
  const [isShowStatus, setIsShowStatus] = useState<boolean>(false);
  const [showView, setShowView] = useState<boolean>(false);
  const [ticketStatus, setTicketStatus] = useState<number>();
  const [ticket, setTicket] = useState<any>();
  const actions = {
    meta,
  };
  const handleChange = (res: any) => {
    const newMeta = handleChangeAction(res, actions);
    if (newMeta) {
      setMeta({
        ...meta,
        newMeta,
      });
    }
  };
  const onClose = async (isRefresh: boolean) => {
    dispatch({ type: ACTION_TYPES.CLOSE });
    if (isRefresh) {
      await mutate();
    }
  };
  const onCloseView = async (isRefresh: boolean) => {
    setShowView(false);
    setTicket(null);
    if (isRefresh) {
      await mutate();
    }
  };

  // đóng form ticket status form
  const onStatusClose = async (isRefresh: boolean) => {
    setTicketStatus(0);
    setTicket(null);
    setIsShowStatus(false);
    if (isRefresh) {
      await mutate();
    }
  };

  const onHanledSend = async (data: any) => {
    switch (data.status) {
      case TicketStatusEnum.ChuaGui:

        handleUpdateStatus(data, TicketStatusEnum.DaGuiVaChuaXuLy, 'Bạn có chắc chắn muốn gửi yêu cầu không?');

        return;

      case TicketStatusEnum.DangXuLy:
        handleUpdateStatus(data, TicketStatusEnum.HoanThanh, 'Bạn có chắc chắn muốn xác nhận hoàn thành không?');

        return;
      default:
        return;
    }
  };

  const onStatusAcceptOrDeny = async (data: any, statusTicket: number) => {
    setIsShowStatus(true);
    setTicketStatus(statusTicket);
    setTicket(data);
  };


  const renderButtonHtml = (data: any) => {
    switch (data.status) {
      case TicketStatusEnum.ChuaGui:
        return (
          permisson.per_Add && <>
            <button className="btn-edit-step" onClick={() => dispatch({ type: ACTION_TYPES.EDIT, Id: data.id })}>
              <AiFillEdit
                className="cursor-pointer text-lg mr-1 text-blue-800"
                title="Sửa"
              />
            </button>

            <button className="btn-send-step" onClick={() => onHanledSend(data)}>
              <AiOutlineSend
                className="cursor-pointer text-lg mr-1 text-blue-800"
                title="Gửi"
              />
            </button>


          </>
        )

      case TicketStatusEnum.DaGuiVaChuaXuLy:
        return (
          permisson.per_Approve && <>
            <button
              title="Tiếp nhận"
              className='btn-receive-step'
              onClick={() => onStatusAcceptOrDeny(data, TicketStatusEnum.DangXuLy)}>
              <FaBusinessTime
                className="cursor-pointer text-lg mr-1 text-green-500 "

              />
            </button>

          </>
        )

      case TicketStatusEnum.ChoTiepNhanLai:
        return (
          permisson.per_Approve && <>
            <FaBusinessTime
              className="cursor-pointer text-lg mr-1 text-green-500"
              title="Tiếp nhận lại"
              onClick={() => onStatusAcceptOrDeny(data, TicketStatusEnum.DangXuLy)}
            />
          </>
        )

      case TicketStatusEnum.HoanThanh:
        return (
          permisson.per_Add && <>
            <MdOpenInBrowser
              className="cursor-pointer text-lg mr-1 text-[#00b1a2]"
              title="Mở lại"
              onClick={() => handleUpdateStatus(data, TicketStatusEnum.ChoTiepNhanLai)}
            />
          </>
        )

      case TicketStatusEnum.DangXuLy:
        return (
          permisson.per_Approve && <>
            <button
              title="Hoàn thành"
              className="btn-success-step"
              onClick={() => onHanledSend(data)}>
              <AiFillCheckCircle
                className="cursor-pointer text-lg mr-1 text-green-600"
              />
            </button>

          </>
        )

      default:
        return;
    }
  };

  const handleUpdateStatus = async (data: any, statusInput: TicketStatusEnum, notify?: string) => {

    if (statusInput === TicketStatusEnum.ChoTiepNhanLai) {
      setIsShowStatus(true);
      setTicketStatus(TicketStatusEnum.ChoTiepNhanLai);
      setTicket(data);
      return;
    }

    try {
      const input = {
        id: data.id,
        status: statusInput,
        content: null,
        startDate: data.startDate,
        endDate: data.endDate,
      };

      if (notify != null) {
        confirm(notify, async () => {
          const response = await ticketServices.updateTicketStatus(input);
          toast.success('Cập nhật trạng thái thành công');
          await mutate();
        }, "confirm-step-" + statusInput);
        return;
      }
    } catch (error) {
      toast.error('Cập nhật trạng thái thất bại');
    }
  };

  useEffect(() => {
    let meta1 = { ...meta };
    meta1.filter.status = status;
    setMeta(meta1);
    setPermisson(getPermisson("ticket"));
  }, [status]);
  const renderPriorty = (item: any) => {
    switch (item.priority) {
      case EPriorityTicket.Hightest:
        return <FaAnglesUp className="text-red-600 priority-step-0" />
      case EPriorityTicket.Hight:
        return <FaAngleUp className="text-red-600 priority-step-1" />
      case EPriorityTicket.Medium:
        return <FaEquals className="text-orange-300 priority-step-2" />
      case EPriorityTicket.Low:
        return <FaAngleDown className="text-blue-600 priority-step-3" />
      case EPriorityTicket.Lowest:
        return <FaAnglesDown className="text-blue-600 priority-step-4" />
      default:
        return;
    }
  }
  const renderStatus = (item: any) => {
    switch (item.status) {
      case TicketStatusEnum.ChuaGui:
        return <span className="status-step-0 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">{item.statusName}</span>
      case TicketStatusEnum.DaGuiVaChuaXuLy:
        return <span className="status-step-1 inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">{item.statusName}</span>
      case TicketStatusEnum.DangXuLy:
        return <span className="status-step-2 inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">{item.statusName}</span>
      case TicketStatusEnum.HoanThanh:
        return <span className="status-step-3 inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{item.statusName}</span>
      case TicketStatusEnum.ChoTiepNhanLai:
        return <span className="status-step-4 inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-green-600/20">{item.statusName}</span>

      default:
        return;
    }
  }

  const renderClassNameAtStatus = (itemStatus: any) => {
    switch (itemStatus) {
      case TicketStatusEnum.ChuaGui:
        return "ticket-step-0"
      case TicketStatusEnum.DaGuiVaChuaXuLy:
        return "ticket-step-1"
      case TicketStatusEnum.DangXuLy:
        return "ticket-step-2"
      case TicketStatusEnum.HoanThanh:
        return "ticket-step-3"
      case TicketStatusEnum.ChoTiepNhanLai:
        return "ticket-step-4"

      default:
        return "";
    }
  }

  return (
    <>
      <GridView title={''} handleChange={handleChange} loading={isLoading}>
        <GridView.Header
          keySearch={meta.search}
          meta={meta}
          ActionBar={
            <div className="flex">
              {permisson.per_Add && (
                <button
                  className="btn-add"
                  onClick={() => dispatch({ type: ACTION_TYPES.ADD, Id: 0 })}
                >
                  <AiOutlinePlus className="text-[20px]" /> Thêm mới
                </button>
              )}
            </div>
          }
          AdvanceFilter={
            <>
              <div className="">
                <TanetSelect
                  label='Dự án'
                  required={false}
                  id='projectId'
                  name='projectId'
                  options={dataProjects}
                /></div>
              <div className="">
                <TanetSelect
                  label='Ưu tiên'
                  required={false}
                  id='priority'
                  name='priority'
                  options={dataPriority}
                  className=""
                />
              </div>
              <div className="">
                <TanetSelect
                  label='Người tạo'
                  required={false}
                  id='createdUserId'
                  name='createdUserId'
                  options={dataUsers}
                />
              </div>
              <div className="">
                <TanetSelect
                  label='Người thực hiện'
                  required={false}
                  id='assignedId'
                  name='assignedId'
                  options={dataUsers}
                />
              </div>
              <div className="">
                <TanetSelect
                  label='Trạng thái'
                  required={false}
                  id='status'
                  name='status'
                  options={dataStatus}
                />
              </div>
            </>
          }
        ></GridView.Header>
        <GridView.Table
          className={`col-12`}
          data={data?.data}
          keyExtractor={({ item }) => {
            return item.id;
          }}
          page={data?.currentPage}
          page_size={data?.pageSize}
          total={data?.totalRows}
          noSelected={true}
        >
          <GridView.Table.Column
            style={{ width: "3%" }}
            title="STT"
            className="text-center"
            body={({ index }) => (
              <span>{index + 1 + (meta.page - 1) * meta.page_size}</span>
            )}
          />
          <GridView.Table.Column className="text-center" style={{}} title="Mã yêu cầu" sortKey="code" body={({ item }) => (<span>{item.code}</span>)} />
          <GridView.Table.Column style={{}} title="Tiêu đề" sortKey="summary" body={({ item }) => (<span>{item.summary}</span>)} />
          <GridView.Table.Column style={{}} title="Người tạo" sortKey="createdUserId " body={({ item }) => (<span>{item.createdUser?.fullName}</span>)} />
          <GridView.Table.Column style={{}} title="Người được giao xử lý" sortKey="assignedId" body={({ item }) => (<span>{item.assigned?.fullName}</span>)} />
          <GridView.Table.Column className="text-center head-priority-step" style={{ textAlign: 'center' }} title="Ưu tiên" sortKey="priority" body={({ item }) => (<span style={{
            display: 'flex',
            justifyContent: 'center'
          }}>{renderPriorty(item)}</span>)} />
          <GridView.Table.Column className={`text-center head-status-step`} style={{}} title="Trạng thái" sortKey="status" body={({ item }) => (<span style={{
            display: 'flex',
            justifyContent: 'center'
          }}>{renderStatus(item)}</span>)} />
          {/* <GridView.Table.Column className="text-center" style={{}} title="Trạng thái" sortKey="status" body={({ item }) => (<span style={getStatusStyle(item?.status)}>{item.statusName}</span>)} /> */}
          <GridView.Table.Column
            style={{ width: "10%" }}
            className="view-action"
            title="Tác vụ"
            body={({ item }) => (
              <div className="flex flex-row">
                {permisson.per_View && <AiTwotoneEye
                  className="cursor-pointer text-lg mr-1 text-blue-800 btn-view-step"
                  title="Xem chi tiết"
                  //onClick={() => dispatch({ type: ACTION_TYPES.READ, Id: item.id })}
                  onClick={() => {
                    setShowView(true);
                    setTicket(item);
                  }}
                />}
                {(permisson.per_Edit || permisson.per_Approve || permisson.per_Add) && renderButtonHtml(item)}
                {permisson.per_Delete && item.status === TicketStatusEnum.ChuaGui && <AiFillDelete
                  className="cursor-pointer text-lg mr-1 text-red-700 btn-delete-step"
                  title="Xóa"
                  onClick={() => delAction(item, ticketServices, data, setMeta, meta, mutate)}
                />
                }
              </div>
            )}
          />

        </GridView.Table>
      </GridView>
      {state.show && <TicketForm show={state.show} onClose={onClose} action={state.action} id={state.Id} />}
      {showView && ticket && <TicketView show={showView} onClose={onCloseView} ticket={ticket} />}
      {isShowStatus && ticketStatus && ticket && <TicketStatusForm show={isShowStatus} onClose={onStatusClose} status={ticketStatus} data={ticket} />}

      <ConfirmationDialog />
    </>
  );
}
