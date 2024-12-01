import { useState, useEffect, useCallback, Fragment, useRef } from "react";

import { FaBell } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { BiSolidMessageDetail } from "react-icons/bi";
import { FaCaretDown } from "react-icons/fa";
import { AiOutlineRetweet } from "react-icons/ai";
import { MdOutlineLogout } from "react-icons/md";
import { MdInfo } from "react-icons/md";

import { Menu, Transition, Popover } from "@headlessui/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useAuth } from "@/shared/Context/appAdminContext";
import React from "react";
import { contactServices } from "@/app/admin/(quantrihethong)/contact/services";

import { notificationServices } from "@/app/admin/(quantrihethong)/notification/services";

import { useWebSocket } from "@/app/admin/(quantrihethong)/websocket/services";
import NumberedIcon from "@/app/admin/(quantrihethong)/contact/_components/numbered-icon";
import { UserList } from "@/app/admin/(quantrihethong)/contact/_components/user-list";
import PopupMessage from "@/app/admin/(quantrihethong)/chatuser/_components/popup-message";
import NotificationList from "@/app/admin/(quantrihethong)/notification/_components/notification-list";
import { NotificationTypeEnum, UserNotificationModel, WebsocketEnum } from "@/shared/model";
import { chatUserServices } from "@/app/admin/(quantrihethong)/chatuser/services";
import { useRouter } from "next/navigation";
import { usePopupMsgContext } from "@/app/admin/(quantrihethong)/chatuser/_components/popup-msg-provider";
import IntroPopup from "@/shared/components/intro-popup";
import { useTour } from "@/lib/tour-context";

const SideBar = dynamic(() => import("./side-bar"));
// const ResetPassword = dynamic(
//   () =>
//     import("@/app/admin/(quantrihethong)/users/_components/user-reset-password")
// );
const ChangePassword = dynamic(
  () =>
    import(
      "@/app/admin/(quantrihethong)/users/_components/user-change-password"
    )
);
const UserForm = dynamic(
  () => import("@/app/admin/(quantrihethong)/users/_components/user-form")
);

export default React.memo(function TopBar({
  showNav,
  setShowNav
}: {
  showNav: boolean;
  setShowNav: any;
}) {
  const router = useRouter();

  const { connect, disconnect, resetMessage, getMessage, getContact } = useWebSocket();
  const { openPopups, setOpenPopups, onActiveUserId, handleRemoveUserPopup } = usePopupMsgContext();
  
  const { logout, user } = useAuth();

  const [edit, setEdit] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState<number>(0);
  const [view, setView] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [viewCount, setViewCount] = useState<number>(0);
  const [viewNotity, setViewNotity] = useState<number>(0);
  // const [openPopups, setOpenPopups] = useState<{ userId: number; chatUserId: number | null; forceFocus: boolean }[]>([]);
  const [popupPositions, setPopupPositions] = useState<{ [key: number]: { right: number } }>({});
  const [isOpen, setOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [dynamicHeight, setDynamicHeight] = useState<number>(0);
  const [tourUserShow, setTourUserShow] = useState(false);
  const [isIntroOpen, setIntroOpen] = useState(false); // State for controlling intro popup

  async function getViewCount(userId: number) {
    try {
      console.log("Lấy lượt tin nhắn chưa xem thành công");
      let viewMsg = await contactServices.getViewAtUserId(userId);
      setViewCount(viewMsg);

    } catch (err: any) {
      console.log("Lấy lượt tin nhắn chưa xem không thành công");
      return 0;
    }
  }

  async function getViewCountNotification(userId: number) {
    try {
      console.log("Lấy lượt thông báo chưa xem thành công");
      let viewMsg = await notificationServices.getViewAtUserId(userId);
      setViewNotity(viewMsg);

    } catch (err: any) {
      console.log("Lấy lượt thông báo chưa xem không thành công");
      return 0;
    }
  }

  async function getChatUserAtId(chatUserId: any) {
    try {
      console.log("Lấy data chatuser thành công");
      return await chatUserServices.findById(chatUserId);

    } catch (err: any) {
      console.log("Lấy data chatuser không thành công");
      return null;
    }
  }

  function logoutUser() {
    disconnect();
    logout();
  };

  useEffect(() => {
    setFullName(user.fullName);
    connect(user.idTaiKhoan);

    setUserId(user.idTaiKhoan);
    getViewCount(user.idTaiKhoan);
    getViewCountNotification(user.idTaiKhoan);

    return () => {
      setOpen(false);
      setIsNotificationOpen(false);
      resetMessage();
    };

  }, [user]);

  // useEffect(() => {
  //   setOpen(false);
  //   setIsNotificationOpen(false);

  // }, [clickScreen]);

  useEffect(() => {
    let msg = getContact();
    if (msg != null) {
      if (msg.type === WebsocketEnum.contact) {
        getViewCount(msg.receiverId ?? 0);
      }
    }
  }, [getContact()]);

  useEffect(() => {
    let msg = getMessage();
    if (msg != null) {

      if (msg.message && msg?.type === WebsocketEnum.chat) {

        setViewCount(s => s + 1);
        setViewNotity(s => s + 1);
        let chatUserData = JSON.parse(msg.message);

        if (chatUserData.senderId && chatUserData.senderId != 0) {
          onActiveUserId(chatUserData.senderId);
        }
      }
      else if (msg?.type === WebsocketEnum.notify) {
        setViewNotity(s => s + 1);
      }
    }
  }, [getMessage()]);

  const handleNotificationViewCount = async (data: UserNotificationModel) => {

    switch (data.notificationType) {
      case NotificationTypeEnum.all:
        // updateIsReadOfNotificationTypeAll(data);
        updateIsReadOfNotification(data);
        break;
      case NotificationTypeEnum.group:
        if (!data.isRead && data.notificationType) {
          updateIsReadOfNotification(data);
        }

        if (data.keyRouter && data.paramater && data.keyRouter.toLowerCase() === 'ticket') {
          router.push('/admin/ticket?' + data.paramater);
        }

        break;
      case NotificationTypeEnum.friend_request:
        if (!data.isRead && data.notificationType) {
          updateIsReadOfNotification(data);
        }
        break;
      case NotificationTypeEnum.message:
        if (!data.isRead && data.notificationType) {
          updateIsReadOfNotification(data);
        }
        else {
          let dataChatUser = await getChatUserAtId(data.id);
          onActiveUserId(dataChatUser.senderId, data.id);
        }

        break;
      case NotificationTypeEnum.tag:
        if (!data.isRead && data.notificationType) {
          updateIsReadOfNotification(data);
        }
        break;
      case NotificationTypeEnum.like:
        if (!data.isRead && data.notificationType) {
          updateIsReadOfNotification(data);
        }
        break;
      case NotificationTypeEnum.comment:
        if (!data.isRead && data.notificationType) {
          updateIsReadOfNotification(data);
        }
        break;
      case NotificationTypeEnum.password:
        if (!data.isRead && data.notificationType) {
          updateIsReadOfNotification(data);
        }

        router.push('/admin/users?' + data.paramater);

        break;

      default:
    }
  };

  async function updateIsReadOfNotification(data: UserNotificationModel) {
    try {
      var isUpdate = await notificationServices.updateIsReadOfNotification(data.id);

      if (isUpdate) {
        let dataChatUser = await getChatUserAtId(data.id);

        if (dataChatUser && dataChatUser.senderId != null) {
          if (dataChatUser.isRead) {
            viewNotity === 0 ? setViewNotity(0) : setViewNotity(s => s - 1);
          }
        };

        if (data.notificationType === NotificationTypeEnum.message) {
          onActiveUserId(dataChatUser.senderId, data.id);
        }
      }

    } catch (err: any) {

    }
  }

  // async function updateIsReadOfNotificationTypeAll(data: UserNotificationModel) {
  //   try {
  //     var isUpdate = await notificationServices.updateIsReadOfNotificationTypeAll(data.id);

  //     if (isUpdate) {
  //       setViewNotity(s => s - 1);
  //     }

  //   } catch (err: any) {
  //   }
  // }

  const handleRemovePopup = useCallback((userIdToRemove: number) => {
    handleRemoveUserPopup(userIdToRemove);
  }, []);

  // tạo độ cao của popup user-list chat
  useEffect(() => {
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      const topBarHeight = 0; // Độ cao của top bar
      const calculatedHeight = windowHeight - topBarHeight - 55; // Trừ đi độ cao của top bar và 55px
      setDynamicHeight(calculatedHeight);
    };
    handleResize(); // Khi component được render lần đầu tiên
    window.addEventListener("resize", handleResize); // Thêm event listener để lắng nghe sự thay đổi kích thước cửa sổ
    return () => window.removeEventListener("resize", handleResize); // Cleanup khi component bị unmount
  }, []);

  const onclickUserOpen = () => {
    if (!isOpen) {
      setIsNotificationOpen(false);
      // Reset open popups state when the user panel is toggled
      setOpenPopups(popups => popups.map(popup => ({
        ...popup,
        chatUserId: null,
        forceFocus: false
      })));
    }
    setOpen(!isOpen);
  };

  const onclickNotificationOpen = () => {
    if (!isNotificationOpen) {
      setOpen(false);
      // Reset open popups state when the notification panel is toggled
      setOpenPopups(popups => popups.map(popup => ({
        ...popup,
        chatUserId: null,
        forceFocus: false
      })));
    }
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <>

      <div
        className={`fixed w-full z-40 h-12 bg-white flex justify-between items-center transition-all duration-[450ms] ${showNav ? "pl-56" : ""
          }`}
      >
        <div className="pl-2 md:pl-4">
          <FaBars
            className="text-[26px] text-slate-500 cursor-pointer step-1"
            onClick={() => setShowNav(!showNav)}
          />
        </div>
        <div className="uppercase text-xl font-bold text-turquoise-400">
          PHẦN MỀM HELPDESK THIÊN HOÀNG
        </div>
        <div className="flex items-center pr-4 md:pr-4">

          <Popover className="relative">
            <div className="flex flex-1 flex-row mr-5 md:mr-8'">
              <Popover.Button
                onClick={onclickUserOpen}
                className="outline-none cursor-pointer text-slate-500 step-2"
              >
                <BiSolidMessageDetail color="#1c64f2" className="h-6 w-6" />
              </Popover.Button>
              <div className={`${viewCount > 0 ? 'ml-[-9px] mt-[-10px]' : ''}`}>
                <NumberedIcon number={viewCount} color="#cf0e0e" />

              </div>
            </div>

            <Transition
              as={Fragment}
              show={isOpen}
              enter="transition ease-out duration-100"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Popover.Panel className="rounded-b-lg absolute w-[25%] z-[80] mt-[12px] origin-bottom-right bg-white shadow-lg"
                style={{ position: 'fixed', right: '0px', overflow: 'hidden', height: dynamicHeight + "px" }}>
                <UserList
                  tabHeight={dynamicHeight}
                  userLoginId={userId}
                  onActiveUserId={onActiveUserId}
                  setIsVisible={setOpen}
                  isVisible={isOpen}
                />
              </Popover.Panel>
            </Transition>
          </Popover>

          <Popover className="relative">
            <div className="flex flex-1 flex-row mr-5 md:mr-8">
              <Popover.Button
                className="outline-none text-slate-500 cursor-pointer step-3"
                onClick={onclickNotificationOpen}
              >
                <FaBell className="h-6 w-6" />
              </Popover.Button>
              <div className='ml-[-9px] mt-[-10px]' >
                <NumberedIcon number={viewNotity} color="#cf0e0e" />

              </div>
            </div>

            <Transition
              as={Fragment}
              show={isNotificationOpen}
              enter="transition ease-out duration-100"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Popover.Panel className="rounded-b-lg absolute w-[25%] z-[80] mt-[12px] origin-bottom-right bg-white shadow-lg"
                style={{ position: 'fixed', right: '0px', overflow: 'hidden', height: dynamicHeight + "px" }}>
                <NotificationList
                  tabHeight={dynamicHeight}
                  userLoginId={userId}
                  setIsVisible={setIsNotificationOpen}
                  isVisible={isNotificationOpen}
                  onClickNotification={handleNotificationViewCount}
                />
              </Popover.Panel>
            </Transition>
          </Popover>

          <Menu
            as="div"
            className="relative inline-block text-left text-slate-500"
          >
            <div>
              <Menu.Button className="inline-flex w-full justify-center items-center step-4">
                <picture>
                  <img
                    src="/user.jpg"
                    className="rounded-full h-8 w-8 md:mr-4 border-2 border-white shadow-sm"
                    alt="profile picture"
                  />
                </picture>
                <span className="hidden md:block font-medium" onClick={() => setTourUserShow(true)}>{fullName}</span>
                <FaCaretDown className="ml-2 h-4 w-4" />
              </Menu.Button>
            </div>

            <Transition
			  // show={tourUserShow}
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform scale-95"
              enterTo="transform scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform scale-100"
              leaveTo="transform scale-95"
            >
              <Menu.Items className="absolute right-0 w-56 z-50 mt-2 origin-top-right bg-white rounded shadow-sm">
                <div className="p-1">
                  <Menu.Item>
                    <a
                      onClick={() => setView(true)}
                      className="flex hover:bg-orange-500 hover:text-white text-gray-700 rounded p-2 text-sm group transition-color items-center"
                    >
                      <button className="flex flex-row user-step-1">
                        <MdInfo className="h-4 w-4 mr-2" />
                        Xem thông tin
                      </button>
                    </a>
                  </Menu.Item>
                  <Menu.Item>
                    <a
                      onClick={() => setEdit(true)}
                      className="flex hover:bg-orange-500 hover:text-white text-gray-700 rounded p-2 text-sm group transition-color items-center"
                    >
                      <button className="flex flex-row user-step-2">
                        <MdEdit className="h-4 w-4 mr-2" />
                        Sửa thông tin
                      </button>
                    </a>
                  </Menu.Item>
                  <Menu.Item>
                    <a
                      onClick={() => setChangePassword(true)}
                      className="flex hover:bg-orange-500 hover:text-white text-gray-700 rounded p-2 text-sm group transition-color items-center"
                    >
                      <button className="flex flex-row user-step-3">
                        <AiOutlineRetweet className="h-4 w-4 mr-2" />
                        Đổi mật khẩu
                      </button>
                    </a>
                  </Menu.Item>
                  <Menu.Item>
                    <Link
                      href="#"
                      className="user-step-4 flex border-t-2 border-dashed border-sky-400 hover:bg-orange-500 hover:text-white text-gray-700 rounded p-2 text-sm group transition-color items-center"
                      onClick={() => logoutUser()}
                    >
                      <MdOutlineLogout className="h-4 w-4 mr-2" />
                      Đăng xuất
                    </Link>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        <UserForm
          show={view}
          onClose={() => setView(false)}
          action="read"
          id={user?.idTaiKhoan}
        />
        <UserForm
          show={edit}
          onClose={() => setEdit(false)}
          action="edit"
          id={user?.idTaiKhoan}
        />
        {/* <ResetPassword
          show={changePassword}
          onClose={() => setChangePassword(false)}
          username={user?.username}
        /> */}
        <ChangePassword
          show={changePassword}
          onClose={() => setChangePassword(false)}
          username={user?.username}
        />
		{/* <IntroPopup
          show={isIntroOpen}
          onClose={() => setIntroOpen(false)}
          onClick={startTourGuide}
        /> */}
      </div>
      <Transition
        show={showNav}
        enter="transition ease-in-out duration-400 transform"
        enterFrom="-translate-x-full"
        enterTo=""
        leave="transition ease-in-out duration-400 transform"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <SideBar />
      </Transition>

      {openPopups.map((popup, index) => (
        <Transition
          as={Fragment}
          show={true}
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
          key={popup.userId}
        >
          <div className={`fixed bottom-0 shadow-lg z-30`}
            style={{ right: `${index * 320 + (index + 1) * 30}px` }}
          >
            <PopupMessage
              selectUserId={popup.userId}
              chatUserId={popup.chatUserId}
              userLoginId={userId}
              fullName={fullName}
              onClickClose={() => handleRemovePopup(popup.userId)}
              isVisible={true}
              openPopups={openPopups}
              setOpenPopups={setOpenPopups}
              forceFocus={popup.forceFocus}
            />
          </div>
        </Transition>
      ))}
    </>
  );
});
