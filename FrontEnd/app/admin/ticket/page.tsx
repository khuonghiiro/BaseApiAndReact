"use client";
import { TicketList } from "./_components/ticket-list";
import { useEffect, useState } from "react";
import { useAuth } from "@/shared/Context/appAdminContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ticketServices } from "./services";
import TourStepTicket from "./tour-step-ticket";
import StartEndModal from "./_components/start-end-modal";
import TourStepCommon from "@/lib/tour-step-common";

export default function Page() {
  const { user } = useAuth();
  const Tab = ({ label, onClick, isActive, className }: any) => (
    <button
      onClick={onClick}
      className={`${isActive
        ? 'bg-[#00524e] text-white'
        : 'bg-gray-300 text-gray-600 hover:bg-[#00524ec2] hover:text-white'
        } px-4 py-2 ${className}`}
    >
      {label}
    </button>
  );

  const TabContent = ({ children }: any) => (
    <div className="p-4 border border-t-0 rounded-b-lg">{children}</div>
  );

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathNameRoot = usePathname();
  const selectTicketId = searchParams.get('ticketId');
  const activateStatusTab = searchParams.get('status');
  const [isLoading, setIsLoading] = useState(false);;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState([
    { value: 0, label: "Tất cả", className: "tab-step-0" },
    { value: 1, label: "Chưa gửi", className: "tab-step-1" },
    { value: 2, label: "Đã gửi -  Chưa xử lý", className: "tab-step-2" },
    { value: 3, label: "Đang xử lý", className: "tab-step-3" },
    { value: 4, label: "Hoàn thành", className: "tab-step-4" }
  ]);

  const [userId, setUserId] = useState<number>(0);
  const [unitCode, setUnitCode] = useState<any>(null);
  const [isStartPopup, setIsStartPopup] = useState<string | null>(null);

  useEffect(() => {
    if (user?.unitCode?.includes('02') || user?.unitCode?.includes('03')) {
      setTabs(tabs.filter(tab => tab.value !== 1));
    }
    if (user?.unitCode?.includes('04')) {
      setActiveTab(1);
    } else {
      setActiveTab(2);
    }
    setUnitCode(user?.unitCode);
    setUserId(user.idTaiKhoan);
    setIsLoading(true);
  }, [user?.unitCode]);

  useEffect(() => {
    if (isLoading) {
      if (typeof window !== "undefined") {
        const isUserStartPopup = localStorage.getItem(`${userId}-isStartPopup`);
        setIsStartPopup(isUserStartPopup);
      }
      setIsModalOpen(true);
    }
  }, [isLoading]);

  useEffect(() => {
    fetchData();
  }, [selectTicketId, activateStatusTab]);

  const fetchData = async () => {
    if (selectTicketId && activateStatusTab) {
      let ticketstatus = await ticketServices.GetTicketStatusByIdAsync(selectTicketId);
      if (ticketstatus) {
        setActiveTab(ticketstatus);
      }

      router.replace(pathNameRoot);
    }
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsTourOpen(false);

    // localStorage.setItem(`${userId}-isStartPopup`, "true");
  };

  const handleConfirm = () => {
    // Xử lý logic khi người dùng nhấn nút Đồng ý
    setIsModalOpen(false);
    setIsTourOpen(true);

    // localStorage.setItem(`${userId}-isStartPopup`, "true");
  };

  return (
    <>
      {/* {!isStartPopup && <StartEndModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Hướng dẫn sử dụng chức năng yêu cầu"
        content={<img className="!mx-auto w-[50%]" src="../start.gif" alt="GIF bắt đầu" />}
        onConfirm={handleConfirm}
      />}

      {isTourOpen && <TourStepCommon tourKey="ticket" tourTitle="Hướng dẫn quản lý yêu cầu hỗ trợ" />} */}
      <TourStepTicket tourKey="ticket" tourTitle="Hướng dẫn quản lý yêu cầu hỗ trợ" />
      <div className="sidebar_event">
        <div className="flex text-base font-bold text-turquoise-400 my-2 uppercase">Danh sách yêu cầu hỗ trợ</div>
        <div className="flex border-1 border-b-gray-600">
          {tabs.map((tab, index) => (
            <Tab
              key={tab.value}
              label={tab.label}
              onClick={() => setActiveTab(tab.value)}
              isActive={tab.value === activeTab}
              className={tab.className}
            />
          ))}

        </div>
        <TabContent>
          {activeTab == 0 && <>
            <TicketList selectTicketId={selectTicketId} status={0} />
          </>}
          {activeTab == 1 && <>
            <TicketList selectTicketId={selectTicketId} status={1} />
          </>}
          {activeTab == 2 && <>
            <TicketList selectTicketId={selectTicketId} status={2} />
          </>}
          {activeTab == 3 && <>
            <TicketList selectTicketId={selectTicketId} status={3} />
          </>}
          {activeTab == 4 && <>
            <TicketList selectTicketId={selectTicketId} status={4} />
          </>}
        </TabContent>
      </div>
    </>
  );
}
