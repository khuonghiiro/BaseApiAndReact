"use client";
import { Modal } from "@/shared/components/modal";
import { TanetLabel } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, number, object, string, date } from "yup";
import { ticketServices } from "../services";
import { formReducer, INITIAL_STATE_FORM, formatFullDateTime } from "@/lib/common";
import { TicketComment } from "./ticket-comment";
import { HistoryList } from "./history-list";
import { TicketCommentFormV2 } from "./ticket-comment-form-v2";
import ShowFileAttachment from "@/lib/show-file-acttachment";

export default function TicketView({
  show,
  ticket,
  onClose
}: {
  show: boolean;
  ticket: any;
  onClose: (isRefresh: boolean) => void;
}) {


  const { data, error, isLoading, mutate } = ticketServices.GetById(ticket?.id!);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [date, setDate] = useState(new Date());

  interface TabContentProps {
    children: React.ReactNode;
  }

  const TabContent: React.FC<TabContentProps> = ({ children }) => (
    <div className="p-4 border border-t-0 rounded-b-lg">{children}</div>
  );
  interface TabProps {
    label: string;       // Kiểu dữ liệu của label là string
    onClick: () => void; // Kiểu dữ liệu của onClick là một hàm không có tham số và không trả về gì
    isActive: boolean;   // Kiểu dữ liệu của isActive là boolean
  }

  const Tab: React.FC<TabProps> = ({ label, onClick, isActive }) => (
    <button
      onClick={onClick}
      className={`${isActive
        ? 'bg-[#00524e] text-white'
        : 'bg-gray-300 text-gray-600 hover:bg-[#00524e] hover:text-white'
        } px-4 py-2 rounded-t-lg`}
    >
      {label}
    </button>
  );

  const tabs = [
    {
      value: 0,
      label: "Bình luận",
    },
    {
      value: 1,
      label: "Lịch sử",
    }
  ];

  const dataPriority = [
    { value: 1, label: "Cao nhất", color: "#dc2626" },        // Màu đỏ đậm
    { value: 2, label: "Cao", color: "#f87171" }, // Màu đỏ 
    { value: 3, label: "Bình thường", color: "#4ade80" }, // Màu xanh
    { value: 4, label: "Thấp", color: "#0ea5e9" },       // Màu sky
    { value: 5, label: "Thấp nhất", color: "#67e8f9" },  // Màu cyan nhạt
  ];

  const getTextColor = (bgColor: any) => {
    const color = bgColor.substring(1); // Remove #
    const rgb = parseInt(color, 16); // Convert to integer
    const r = (rgb >> 16) & 0xff; // Extract red
    const g = (rgb >> 8) & 0xff; // Extract green
    const b = (rgb >> 0) & 0xff; // Extract blue
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness > 156 ? '#000000' : '#FFFFFF'; // Adjust threshold as necessary
  };

  const renderPriorty = (priorityEnum: any) => {
    const priority = dataPriority.find(p => p.value === priorityEnum);
    if (!priority) '';
    return priority?.label;
  }

  const getPriorityStyle = (priorityEnum: any) => {
    const priority = dataPriority.find(p => p.value === priorityEnum);
    if (!priority) return {};
    const textColor = getTextColor(priority.color);
    return {
      color: textColor,
      backgroundColor: priority.color,
      // textShadow: '0 0 0px #000000', // Add text shadow to create a border effect
      fontWeight: 'bold',
      fontSize: '14px',
      paddingTop: '4px',
      paddingBottom: '4px',
      border: '1px solid #ccc', // Add border with black color
    };
  };

  const handleSendComment = (dateTime: Date) => {
    setDate(new Date());
  }

  useEffect(() => {
  }, [ticket?.id]);

  return (
    <>
      <Modal show={show} size="xxl" loading={loading}>
        <>
          <Modal.Header onClose={onClose}>Chi tiết yêu cầu hỗ trợ</Modal.Header>
          <Modal.Body nameClass="grid-cols-12">
            <div className='col-span-9 overflow-y-auto'>
              <div className="col-span-12">
                <TanetLabel
                  htmlFor="projectId"
                  label={`Tiêu đề: ${data?.summary}`}
                  className="!text-[35px] text-black leading-9"
                />
              </div>

              <div className='col-span-12 mt-4'>
                <TanetLabel
                  htmlFor="projectId"
                  label={`Mô tả: ${data?.description ?? ''}`}
                  className="text-[24px] text-black"
                />
              </div>

              <div className='col-span-12 my-6'>
                {(data?.attachment && data?.attachment.length > 0) ?
                  (<>
                    <ShowFileAttachment fileData={data?.attachment} />
                  </>)
                  :
                  (
                    <>
                      <div className="text-[12px] text-gray-600 border border-blue-500 border-dashed p-8 text-center">
                        Không có tệp đính kèm
                      </div>
                    </>
                  )
                }
              </div>

              <div className="flex mt-4">
                {tabs.map(tab => (
                  <Tab
                    key={tab.value}
                    label={tab.label}
                    onClick={() => setActiveTab(tab.value)}
                    isActive={tab.value === activeTab}
                  />
                ))}
              </div>
              <TabContent>
                {activeTab == 0 && ticket?.id && <>
                  <TicketComment ticketId={ticket?.id} date={date} />
                </>}
                {activeTab == 1 && ticket?.id && <>
                  <HistoryList ticketId={ticket?.id} />
                </>}
              </TabContent>

              <TicketCommentFormV2 ticketId={ticket?.id} onReloadForm={handleSendComment} />

            </div>

            <div className='col-span-3'>

              {/* Người tạo */}
              <div className='col-span-12 flex items-center'>
                <div className='flex-1'>
                  <TanetLabel
                    label='Người tạo:'
                    className="text-[14px] text-slate-600"
                  />
                </div>

                <div className='flex-1'>
                  <TanetLabel
                    label={data?.createdUser?.fullName}
                    className="text-[14px] text-black"
                  />

                </div>
              </div>

              {/* Người giao */}
              <div className='col-span-12 flex items-center'>
                <div className='flex-1'>
                  <TanetLabel
                    label='Người thực hiện:'
                    className="text-[14px] text-slate-600"
                  />
                </div>

                <div className='flex-1'>
                  <TanetLabel
                    label={data?.assigned?.fullName}
                    className="text-[14px] text-black"
                  />

                </div>
              </div>

              {/* Dự án */}
              <div className='col-span-12 flex items-center'>
                <div className='flex-1 self-start'>
                  <TanetLabel
                    label='Dự án:'
                    className="text-[14px] text-slate-600"
                  />
                </div>

                <div className='flex-1'>
                  <TanetLabel
                    label={`[${data?.project?.code}]-${data?.project?.name}`}
                    className="text-[14px] text-black"
                  />
                </div>
              </div>

              {/* Mức độ */}
              <div className='col-span-12 flex items-center'>
                <div className='flex-1'>
                  <TanetLabel
                    label='Mực độ:'
                    className="text-[14px] text-slate-600"
                  />
                </div>

                <div className='flex-1'>
                  <label
                    className="text-black pl-2 pr-2 rounded"
                    style={getPriorityStyle(data?.priority)}
                  >
                    {renderPriorty(data?.priority)}
                  </label>
                </div>
              </div>

              {/* Ngày tạo */}
              <div className='col-span-12 flex items-center'>
                <div className='flex-1'>
                  <TanetLabel
                    label='Ngày tạo:'
                    className="text-[14px] text-slate-600"
                  />
                </div>

                <div className='flex-1'>
                  <TanetLabel
                    label={formatFullDateTime(data?.startDate)}
                    className="text-[14px] text-black"
                  />
                </div>
              </div>

              {/* Ngày cập nhật */}
              <div className='col-span-12 flex items-center'>
                <div className='flex-1'>
                  <TanetLabel
                    label='Ngày cập nhật:'
                    className="text-[14px] text-slate-600"
                  />
                </div>

                <div className='flex-1'>
                  <TanetLabel
                    label={formatFullDateTime(data?.endDate)}
                    className="text-[14px] text-black"
                  />
                </div>
              </div>

              {/* Trạng thái */}
              <div className='col-span-12 flex items-center'>
                <div className='flex-1'>
                  <TanetLabel
                    label='Trạng thái:'
                    className="text-[14px] text-slate-600"
                  />
                </div>

                <div className='flex-1'>
                  <TanetLabel
                    label={`${data?.statusName}`}
                    className="text-[14px] text-black"
                  />
                </div>
              </div>

            </div>

          </Modal.Body>
          <Modal.Footer onClose={onClose}>
            {/* <button
                  data-modal-hide="large-modal"
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Lưu
                </button> */}
          </Modal.Footer>
        </>
      </Modal>
    </>
  );
}
