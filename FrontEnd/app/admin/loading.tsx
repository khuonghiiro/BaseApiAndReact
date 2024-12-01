"use client";
import { TbRefresh } from "react-icons/tb";
export default function Loading() {
  return (
    <>
      <div
        className="flex items-center justify-center absolute top-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 inset-0 z-40"
        style={{ top: "0", bottom: "0", left: "0", right: "0" }}
      >
        <TbRefresh className="text-3xl text-sky-600 animate-spin" />
      </div>
    </>
  );
}
