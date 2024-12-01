"use client";
import { FaAngleDown } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TreeMenu({
  node,
  pathname,
  lever,
}: {
  node: any;
  pathname: string;
  lever: number;
}) {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [submenuIndex, setSubmenuIndex] = useState(0);
  const router = useRouter();

  function nav() {
    if (node.url && node.url != "/-") {
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
        <li
          className={`flex items-center gap-x-4 cursor-pointer p-2 pr-5 hover:bg-lemonyellow rounded-md mt-1
                    ${node.url && node.url === pathname ? "active" : ""} ${
            "pdl-" + (lever + 5)
          }`}
          onClick={() => nav()}
        >
          {node.childrens?.length > 0 ? (
            <>
              <span className="flex-1">{node.title}</span>
              <FaAngleDown
                className={`${
                  submenuOpen && submenuIndex === node.id && "rotate-180"
                }`}
              />
            </>
          ) : (
            <>
              <Link href={node.url}>{node.title}</Link>
            </>
          )}
        </li>
      ) : (
        <li
          className="flex items-center gap-x-2 cursor-pointer p-1 hover:bg-lemonyellow rounded-md mt-1"
          onClick={() => nav()}
        >
          {node.childrens?.length > 0 ? (
            <>
              <span className="text-xl block float-left">
                <MdDashboard />
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
              <span className="text-xl block float-left">
                <MdDashboard />
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
                pathname={pathname}
                lever={lever + 1}
              />
            ))}
          </ul>
        )}
    </>
  );
}
