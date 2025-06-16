"use client";
import { GridView } from "@/shared/components/data-grid";
import { DefaultMeta, DefaulPer } from "@/public/app-setting";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import {
  handleChangeAction,
  delAction,
  listReducer,
  getPermisson,
  INITIAL_STATE_LIST,
  ACTION_TYPES,
} from "@/lib/common";
import { useReducer, useState, useEffect } from "react";
import { userServices } from "./services";
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdRemoveRedEye } from "react-icons/md";
import { AiOutlineRetweet } from "react-icons/ai";
import { IoMdLock } from "react-icons/io";
import { IoMdUnlock } from "react-icons/io";
import { toast } from "react-toastify";
import { confirm } from "@/shared/components/confirm";
import dynamic from "next/dynamic";
import UserList from "./_components/user-list";
import { TabUserPasswordRequest } from "../passwordresetrequest/_components/tab-user-password-request";
import { passwordResetRequestServices } from "../passwordresetrequest/services";
const UserForm = dynamic(() => import("./_components/user-form"));
const ResetPassword = dynamic(
  () => import("./_components/user-reset-password")
);
const ConfirmationDialog = dynamic(() => import("@/shared/components/confirm"));

export default function Page() {
  const [meta, setMeta] = useState<any>({
    unincludeGroupId: 5,
    ...DefaultMeta,
  });
  const [permisson, setPermisson] = useState<any>({
    ...DefaulPer,
  });
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathNameRoot = usePathname();
  const selectUserUserName = searchParams.get('UserName');
  const passwordRequestId = searchParams.get('PasswordRequestId');

  const { data, isLoading, mutate } = userServices.GetList(meta);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [passwordId, setPasswordId] = useState<number | null>(null);

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
  const onReset = (userName: string, passId?: number, statusRequest?: number) => {
    // if(statusRequest == null || statusRequest !== 0) return;
    setShowResetPassword(true);
    setUsername(userName);
    setPasswordId(passId ?? 0)
  };

  const onCloseDialog = async (isRefresh: boolean) => {
    if (isRefresh) {
      await mutate();
    }
    setShowResetPassword(false);
    setPasswordId(null);
    setUsername('');
  };

  const [activeTab, setActiveTab] = useState(0);
  const Tab = ({ label, onClick, isActive }: any) => (
    <button
      onClick={onClick}
      className={`${isActive
        ? 'bg-[#00524e] text-white'
        : 'bg-gray-300 text-gray-600 hover:bg-[#00524ec2] hover:text-white'
        } px-4 py-2`}
    >
      {label}
    </button>
  );
  const TabContent = ({ children }: any) => (
    <div className="p-4 border border-t-0 rounded-b-lg">{children}</div>
  );

  const tabs = [
    {
      value: 0,
      label: "Danh sách người dùng",
    },
    {
      value: 1,
      label: "Danh sách yêu cầu cấp lại mật khẩu",
    }
  ]

  useEffect(() => {
    setPermisson(getPermisson("users"));
  }, []);

  // dùng useEffect để xử lý link và và dialog reset password
  useEffect(() => {
    fetchData();
  }, [passwordRequestId, selectUserUserName]);

  const fetchData = async () => {
    if (passwordRequestId && selectUserUserName) {
      let passObj = await passwordResetRequestServices.getObjectAtIdAsync(passwordRequestId);
      if (passObj && passObj.status == 0) {
        setUsername(selectUserUserName);
        setPasswordId(parseInt(passwordRequestId, 10) || null);

        setShowResetPassword(true);
        setActiveTab(1); // Assuming the tab 0 corresponds to the user list
      }
      else if (passObj && passObj.status == 1) {
        toast.warn('Tài khoản đã được người dùng khác cấp lại');
      }
      else if (passObj && passObj.status == 2) {
        toast.warn('Tài khoản đã được người dùng khác từ chối cấp lại mật khẩu');
      }
      else {
        toast.warn('không có yêu cầu từ người dùng');
      }
      router.replace(pathNameRoot);
    }
  };

  return (
    <>
      <div className="flex text-base font-bold text-turquoise-400 my-2 uppercase">Danh sách tài khoản</div>
      <div className="flex border-1 border-b-gray-600">
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
        {activeTab == 0 && <>
          <UserList onResetPassword={onReset} />
        </>}
        {activeTab == 1 && <>
          <TabUserPasswordRequest onResetPassword={onReset} />
        </>}
      </TabContent>

      <ResetPassword
        passwordId={passwordId}
        status={activeTab}
        show={showResetPassword}
        onClose={onCloseDialog}
        username={username}
      />
      <ConfirmationDialog />
    </>
  );
}
