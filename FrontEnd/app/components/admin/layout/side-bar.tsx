import React from "react";
import { userServices } from "../../../admin/(quantrihethong)/users/services";
import TreeMenu from "./tree-menu";
import { usePathname } from "next/navigation";

export default React.memo(function SideBar() {
    const { data } = userServices.GetTreeMenu();

    const pathname = usePathname();
    return (
        <>
            <div className="fixed z-40 w-56 h-full shadow-xl bg-gradient text-white text-sm overflow-y-auto">
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
                    {data?.data?.map((menu: any) => (
                        <TreeMenu key={menu.id} node={menu} pathname={pathname} lever={0} />
                    ))}
                </ul>
            </div>
        </>
    );
});