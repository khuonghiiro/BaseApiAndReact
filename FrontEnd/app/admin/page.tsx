"use client";
import { useEffect, useRef, useState } from "react";
import { DefaultMeta, DefaulPer } from "@/public/app-setting";
import React from "react";

import { userServices } from "./(quantrihethong)/users/services";
import { useAuth } from "@/shared/Context/appAdminContext";

export default function Page() {
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
  });

  const { user } = useAuth();
  const userDetail = userServices.GetUserById(user?.idTaiKhoan!);
  useEffect(() => {}, [user, userDetail]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="mt-3 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="mb-4 flex text-base font-bold text-turquoise-400 uppercase">
            Thống kê TỔNG QUAN
          </div>

          <div className="mx-auto"></div>
        </div>
        <div className="mt-3 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="mb-4 flex text-base font-bold text-turquoise-400 uppercase">
            Thống kê yêu cầu hỗ trợ
          </div>
          <div className="mx-auto w-10/12 pb-3"></div>
        </div>
      </div>
    </>
  );
}
