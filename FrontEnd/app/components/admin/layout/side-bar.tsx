import React, { forwardRef } from 'react';
import { userServices } from "../../../admin/(quantrihethong)/users/services";
import TreeMenu from "./tree-menu";
import { usePathname } from "next/navigation";

// Chỉ định kiểu cho ref là HTMLDivElement
const SideBar = forwardRef<HTMLDivElement, {}>((props, ref) => {
  const { data } = userServices.GetTreeMenu();
  const pathname = usePathname();
  return (
    <div
      ref={ref}  // Truyền ref vào div chính của Sidebar
      className="fixed z-40 w-56 h-full shadow-xl bg-gradient text-white text-sm overflow-y-auto"
    >
      <div className="flex justify-center mt-6 mb-1">
        <a href='/admin'>
          <picture>
            <img className="max-w max-h-20" src="/logo-th.png" alt="company logo" />
          </picture>
        </a>
      </div>
      <div className="flex justify-center">
        {/* <ChangeDonVi /> */}
      </div>
      <ul className="pt-2 pl-2">
        {data && data?.data && data?.data?.map((menu: any) => (
          <TreeMenu key={menu.id} node={menu} iconnew={menu.icon} pathname={pathname} lever={0} />
        ))}
      </ul>
    </div>
  );
});

export default React.memo(SideBar);
