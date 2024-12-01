"use client";
import { defaultGrid } from "../../../public/app-setting";
import { useRef } from "react";
import { IPaginationProps } from "../../model";
import { FaAnglesLeft } from "react-icons/fa6";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { FaAnglesRight } from "react-icons/fa6";

export const Pagination = ({
  page = defaultGrid.page,
  page_size = defaultGrid.page_size,
  total = defaultGrid.total,
  pageSizeOptions = defaultGrid.pageSizeOptions,
  handleChange,
}: IPaginationProps) => {
  const _inputSelect = useRef<HTMLInputElement>(null);
  var _from = 0;
  var _to = 0;
  //tính bản ghi từ bao nhiêu đến bao nhiêu
  if (total > 0) {
    _from = (page - 1) * page_size + 1;
    _to = page * page_size > total ? total : page * page_size;
  }
  //tính tổng số page
  const getTotalPage = () => {
    return Math.ceil(total / page_size) || 1;
  };
  //sự kiện thay đổi số bản ghi trên page
  const onchangePageSize = (page_size: any) => {
    handleChange({
      event: "changePageSize",
      data: {
        page_size: Number(page_size),
      },
    });
  };
  //sự kiện thay đổi page theo page nhập vào
  const onChangePage = (page: any) => {
    const regexp = /^[0-9\b]+$/;
    //chỉ cho nhập số và page phải nhỏ hơn < totalPage
    if (page === "" || regexp.test(page)) {
      if (page === "") {
        handleChange({
          event: "changePage",
          data: {
            page: 1,
          },
        });
      } else if (page <= getTotalPage()) {
        handleChange({
          event: "changePage",
          data: {
            page: Number(page),
          },
        });
      }
    }
  };
  //sự kiện nhấn enter thay đổi page
  const onKeyDown = (ev: any) => {
    if (ev.key === "Enter") {
      const page = ev.currentTarget.value || 1;
      handleChange({
        event: "changePage",
        data: {
          page: Number(page),
        },
      });
    }
  };
  const onBlur = (ev: any) => {
    const page = ev.currentTarget.value || 1;
    handleChange({
      event: "changePage",
      data: {
        page: Number(page),
      },
    });
  };
  //sự kiện về page đầu tiên
  const toFristPage = () => {
    if (page > 1) {
      handleChange({
        event: "changePage",
        data: {
          page: 1,
        },
      });
    }
  };
  //sự kiện về page trước page hiện tại
  const toPrevPage = () => {
    if (page > 1) {
      handleChange({
        event: "changePage",
        data: {
          page: page - 1,
        },
      });
    }
  };
  //sự kiện đến page tiếp theo
  const toNextPage = () => {
    if (page < getTotalPage()) {
      handleChange({
        event: "changePage",
        data: {
          page: page + 1,
        },
      });
    }
  };
  //sự kiện đến page cuối cùng
  const toLastPage = () => {
    if (page < getTotalPage()) {
      handleChange({
        event: "changePage",
        data: {
          page: getTotalPage(),
        },
      });
    }
  };
  return (
    <>
      <div className="flex items-center justify-between bg-white px-2 py-3 sm:px-2">
        <div className="flex flex-1 justify-between sm:hidden">
          <a
            onClick={toPrevPage}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Trang trước
          </a>
          <a
            onClick={toNextPage}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Trang sau
          </a>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between px-1">
          <div>
            <span className="text-sm text-gray-700">Hiển thị </span>
            <select
              className="border-solid border-sky-400"
              value={page_size}
              onChange={(event) => {
                onchangePageSize(event.currentTarget.value);
              }}
            >
              {pageSizeOptions.map((item, key) => {
                return (
                  <option key={key} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
            <span className="text-sm text-gray-700"> bản ghi </span>
          </div>
          <div>
            <p className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">{_from}</span> đến{" "}
              <span className="font-medium">{_to}</span> trên{" "}
              <span className="font-medium">{total}</span> bản ghi
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px shadow-sm"
              aria-label="Pagination"
            >
              <li
                className={`relative ${
                  page > 1 ? "text-pagination" : "text-disabled"
                } inline-flex items-center rounded-l-md px-3 py-2 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0`}
                onClick={toFristPage}
              >
                <span className="sr-only">First</span>
                <FaAnglesLeft className="h-5 w-5 " aria-hidden="true" />
              </li>
              <li
                className={`relative ${
                  page > 1 ? "text-pagination" : "text-disabled"
                } inline-flex items-center px-3 py-2 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0`}
                onClick={toPrevPage}
              >
                <span className="sr-only">Previous</span>
                <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
              </li>
              <li className="relative inline-flex items-center px-3 py-2 text-black ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                <input
                  className="focus-visible-ring"
                  style={{ textAlign: "right", width: "50px" }}
                  value={page}
                  onChange={(event) => {
                    onChangePage(event.currentTarget.value);
                  }}
                  onKeyDown={onKeyDown}
                  onBlur={onBlur}
                />
                <span style={{ width: "50px" }}>/{getTotalPage()}</span>
              </li>
              <li
                className={`relative ${
                  page < getTotalPage() ? "text-pagination" : "text-disabled"
                } inline-flex items-center px-3 py-2 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0`}
                onClick={toNextPage}
              >
                <span className="sr-only">Next</span>
                <FaChevronRight className="h-5 w-5" aria-hidden="true" />
              </li>
              <li
                className={`relative ${
                  page < getTotalPage() ? "text-pagination" : "text-disabled"
                } inline-flex items-center rounded-r-md px-3 py-2 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0`}
                onClick={toLastPage}
              >
                <span className="sr-only">Last</span>
                <FaAnglesRight className="h-5 w-5" aria-hidden="true" />
              </li>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};
