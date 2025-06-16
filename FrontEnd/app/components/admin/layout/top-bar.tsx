import { useState, useEffect, useCallback, Fragment, useRef, forwardRef } from "react";

import { FaBars } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FaCaretDown } from "react-icons/fa";
import { AiOutlineRetweet } from "react-icons/ai";
import { MdOutlineLogout } from "react-icons/md";
import { MdInfo } from "react-icons/md";

import { Menu, Transition, Popover } from "@headlessui/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useAuth } from "@/shared/Context/appAdminContext";
import React from "react";

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


const TopBar = forwardRef<HTMLDivElement, { showNav: boolean, setShowNav: any }>(
  ({ showNav, setShowNav }, ref) => {

  const { logout, user } = useAuth();

  const [edit, setEdit] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState<number>(0);
  const [view, setView] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [isOpen, setOpen] = useState(false);

  function logoutUser() {
    logout();
  };

  useEffect(() => {
    setFullName(user.fullName);

    setUserId(user.idTaiKhoan);

    return () => {
      setOpen(false);
    };

  }, [user]);

  // useEffect(() => {
  //   setOpen(false);
  //   setIsNotificationOpen(false);

  // }, [clickScreen]);


  return (
    <>

      <div ref={ref}
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
                <span className="hidden md:block font-medium" >{fullName}</span>
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

    </>
  );
});

// Sử dụng React.memo để tối ưu hóa việc render lại
export default React.memo(TopBar);