"use client";
import { FaAngleDown, FaAngleRight } from "react-icons/fa"; // Các icon không cần phải load động
import React, { useState, forwardRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Hàm để load động icon từ react-icons
const loadIcon = (iconName: string) => {
  try {
    const Icon =
      require("react-icons/fa")[iconName] ||
      require("react-icons/md")[iconName];
    if (Icon) {
      return <Icon />; // Trả về JSX element thay vì function
    }
    return <FaAngleRight />;
  } catch (error) {
    console.error("Error loading icon:", iconName, error);
    return <FaAngleRight />; // fallback icon nếu có lỗi
  }
};

// Hàm kiểm tra trạng thái active của node và các node con
const isActive = (node: any, pathname: string): boolean => {
  if (node.url === pathname) {
    return true;
  }
  if (node.childrens?.length > 0) {
    return node.childrens.some((child: any) => isActive(child, pathname));
  }
  return false;
};

// Component TreeMenu được chuyển thành forwardRef
const TreeMenu = forwardRef<HTMLLIElement, {
  node: any;
  pathname: string;
  lever: number;
  iconnew?: string;
}>
(({ node, pathname, lever, iconnew }, ref) => {

  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [submenuIndex, setSubmenuIndex] = useState(0);
  const router = useRouter();

  const active = isActive(node, pathname); // Kiểm tra trạng thái active

  function nav() {
    if (node.url && node.url !== "/-" && node.url !== "-" && node.url !== "/") {
      router.push(node.url);
    }
    setSubmenuIndex(node.id);
    if (node.id !== submenuIndex) {
      setSubmenuOpen(false);
      setSubmenuOpen(true);
    } else {
      setSubmenuOpen(!submenuOpen);
    }
  }

  return (
    <>
      {node.parentId && node.parentId > 0 ? (
        <li ref={ref}
          className={`flex items-center gap-x-2 cursor-pointer p-2 pr-5 hover:bg-lemonyellow rounded-md mt-1
                    ${active ? "active" : ""} ${"pdl-" + (lever + 5)}`}
          onClick={() => nav()}
        >
          {node.childrens?.length > 0 ? (
            <>
              <span className="text-xl block float-left !text-[18px]">
                {/* Render icon từ prop iconnew */}
                {iconnew && iconnew !== "" && loadIcon(iconnew)}
              </span>
              <span className="flex-1">{node.title}</span>
              <FaAngleDown
                className={`${
                  submenuOpen && submenuIndex === node.id && "rotate-180"
                }`}
              />
            </>
          ) : (
            <>
              <span className="text-xl block float-left !text-[15px]">
                {/* Render icon từ prop iconnew */}
                {iconnew && iconnew !== "" && loadIcon(iconnew)}
              </span>
              <Link href={node.url}>{node.title}</Link>
            </>
          )}
        </li>
      ) : (
        <li ref={ref}
          className={`flex items-center gap-x-2 cursor-pointer p-1 hover:bg-lemonyellow rounded-md mt-1 ${
            active ? "active" : ""
          }`}
          onClick={() => nav()}
        >
          {node.childrens?.length > 0 ? (
            <>
              <span className="text-xl block float-left !text-[18px]">
                {/* Render icon từ prop iconnew */}
                {iconnew && iconnew !== "" && loadIcon(iconnew)}
              </span>
              <span className="text-sm font-medium flex-1">{node.title}</span>
              <FaAngleDown
                className={`${
                  submenuOpen && submenuIndex === node.id && "rotate-180"
                }`}
              />
            </>
          ) : (
            <>
              <span className="text-xl block float-left !text-[18px]">
                {/* Render icon từ prop iconnew */}
                {iconnew && iconnew !== "" && loadIcon(iconnew)}
              </span>
              <span className="text-sm font-medium flex-1">
                <Link href={node.url}>{node.title}</Link>
              </span>
            </>
          )}
        </li>
      )}
      {node.childrens?.length > 0 &&
        submenuOpen &&
        submenuIndex === node.id && (
          <ul>
            {node.childrens.map((child: any) => (
              <TreeMenu
                key={child.id}
                node={child}
                iconnew={child.icon}
                pathname={pathname}
                lever={lever + 1}
              />
            ))}
          </ul>
        )}
    </>
  );
});

// Đặt displayName cho component
TreeMenu.displayName = "TreeMenu";

export default TreeMenu;