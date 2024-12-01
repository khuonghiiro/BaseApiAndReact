"use client";
import { useContext, useState, useEffect, ReactNode } from "react";
import { GridViewContext } from "./grid-view";
import { IGridViewHeaderProps } from "../../model";
import { IoSearchSharp } from "react-icons/io5";
import { Formik, Form } from "formik";
export const GridHeader = ({
  ActionBar,
  AdvanceFilter,
  meta,
  isWrapper,
  placeholder,
  isNotQuickSearch,
  isNoneQuickSearch,
  isNotTextAdvanceFilter,
  textHeader,
  children,
  isNotFixAdvanceFilter,
}: IGridViewHeaderProps) => {
  const contextValue = useContext(GridViewContext);
  const [isAdvSearchOpen, setIsAdvSearchOpen] = useState(false);
  const [keySearch, setKeySearch] = useState("");

  useEffect(() => {
    if (keySearch) {
      setKeySearch(keySearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keySearch]);
  const handleKeyDown = (ev: any, contextValue: any) => {
    if (ev.key === "Enter") {
      const keySearch = ev.currentTarget?.value;
      processHanleChange(
        "changeKeySearch",
        { search: keySearch },
        contextValue
      );
    }
  };
  const handleClickSeachBtnDong = (contextValue: any) => {
    if (isAdvSearchOpen) {
      processHanleChange(
        "cancelExtendSearch",
        { search: keySearch },
        contextValue
      );
    }
    setIsAdvSearchOpen(!isAdvSearchOpen);
  };
  const processHanleChange = (event: any, data: any, contextValue: any) => {
    if (contextValue && contextValue.gridViewHandleChange) {
      contextValue.gridViewHandleChange({ event: event, data: data });
    }
  };

  return (
    <>
      {!isNoneQuickSearch && (
        <div className="pb-4 sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div className="mx-2 mt-2">
            <div className="flex">
              {!isNoneQuickSearch && (
                <div>
                  <label className="sr-only">Search</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 ml-1 flex items-center pl-3 pointer-events-none">
                      <IoSearchSharp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="table-search"
                      className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Tìm kiếm"
                      value={keySearch}
                      onChange={(ev: any) => {
                        setKeySearch(ev.currentTarget?.value);
                      }}
                      onKeyDown={(ev: any) => {
                        handleKeyDown(ev, contextValue);
                      }}
                    />
                  </div>
                </div>
              )}
              {AdvanceFilter && (
                <div className="mx-2 mt-[5px]">
                  {isAdvSearchOpen ? (
                    <button
                      className="text-sky-500 text-sm"
                      onClick={() => {
                        handleClickSeachBtnDong(contextValue);
                      }}
                      title="thu gọn tìm kiếm"
                    >
                      Thu gọn
                    </button>
                  ) : (
                    <button
                      className="text-sky-500 text-sm"
                      onClick={() => {
                        handleClickSeachBtnDong(contextValue);
                      }}
                      title="Mở rộng tìm kiếm"
                    >
                      Mở rộng
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          {ActionBar && <div className="mx-2 mt-2">{ActionBar}</div>}
        </div>
      )}

      {isAdvSearchOpen && AdvanceFilter && (
        <div className="relative border rounded-lg p-4 mx-2 mb-3">
          <div className="absolute -top-4 left-3 bg-white px-2 py-1 rounded-tl-lg">
            <p className="text-sm">Tìm kiếm mở rộng</p>
          </div>
          {isNotFixAdvanceFilter ? (
            AdvanceFilter
          ) : (
            <Formik
              onSubmit={(values: any) => {
                processHanleChange(
                  "changeFilter",
                  { filter: values },
                  contextValue
                );
              }}
              initialValues={meta.filter}
            >
              {({ handleSubmit }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <div className={`gap-4 grid grid-cols-3`}>
                    {AdvanceFilter}
                    <div className="col-start-1 col-end-4 text-center">
                      <button
                        data-modal-hide="large-modal"
                        type="submit"
                        className="text-white bg-lemonyellow hover:bg-amber-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center"
                      >
                        <IoSearchSharp className="text-[20px] inline" />
                        Tìm kiếm
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      )}
    </>
  );
};

GridHeader.displayName = "GridHeader";
