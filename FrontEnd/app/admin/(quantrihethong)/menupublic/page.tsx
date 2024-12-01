"use client";
import { GridView } from "@/shared/components/data-grid";
import { DefaultMeta, DefaulPer } from "@/public/app-setting";
import {
  handleChangeAction,
  formatDateTime,
  delAction,
  listReducer,
  getPermisson,
  INITIAL_STATE_LIST,
  ACTION_TYPES,
} from "@/lib/common";
import {
  TanetInput,
  TanetSelectTreeCheck,
  TanetSelect,
  SelectAsync,
  TanetFormDate,
} from "@/lib";
import { useReducer, useState, useEffect } from "react";
import { menuPublicServices } from "./services";
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdRemoveRedEye } from "react-icons/md";
import MenuPublicForm from "./_components/menupublic-form";
import { toast } from "react-toastify";
import ConfirmationDialog, { confirm } from "@/shared/components/confirm";
export default function Page() {
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
  });
  const [permisson, setPermisson] = useState<any>({
    ...DefaulPer,
  });
  const titleTable = "Menu trang công khai";
  const { data, isLoading, mutate } = menuPublicServices.GetList(meta);
  const { data: parents } = menuPublicServices.GetMenuCha();
  const [state, dispatch] = useReducer(listReducer, INITIAL_STATE_LIST);
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
  const onClose = async (isRefresh: boolean) => {
    dispatch({ type: ACTION_TYPES.CLOSE });
    if (isRefresh) {
      await mutate();
    }
  };
  useEffect(() => {
    setPermisson(getPermisson("menupublic"));
  }, []);
  return (
    <>
      <GridView
        title={"Danh sách " + titleTable}
        handleChange={handleChange}
        loading={isLoading}
      >
        <GridView.Header
          keySearch={meta.search}
          meta={meta}
          ActionBar={
            <div className="flex">
              {permisson.per_Add && (
                <button
                  className="btn-add"
                  onClick={() => dispatch({ type: ACTION_TYPES.ADD, Id: 0 })}
                >
                  <IoMdAdd className="text-[20px]" /> Thêm mới
                </button>
              )}
            </div>
          }
          AdvanceFilter={
            <>
              <div className="">
                <TanetSelect
                  label="Menu cha"
                  name="ParentId"
                  view={false}
                  options={parents}
                />
              </div>
            </>
          }
        ></GridView.Header>
        <GridView.Table
          className="col-12"
          data={data?.data}
          keyExtractor={({ item }) => {
            return item.id;
          }}
          page={data?.currentPage}
          page_size={data?.pageSize}
          total={data?.totalRows}
          noSelected={true}
        >
          <GridView.Table.Column
            style={{ width: "3%" }}
            title="STT"
            className="text-center"
            body={({ index }) => (
              <span>{index + 1 + (meta.page - 1) * meta.page_size}</span>
            )}
          />
          <GridView.Table.Column
            style={{}}
            title="Tên menu"
            sortKey="title"
            body={({ item }) => <span>{item.title}</span>}
          />
          <GridView.Table.Column
            style={{}}
            title="Đường dẫn"
            sortKey="url"
            body={({ item }) => <span>{item.url}</span>}
          />
          <GridView.Table.Column
            title="Menu cha"
            sortKey="parentId"
            filterName="parentId"
            isShowFilter={true}
            typeColumn="select"
            filterOption={parents}
            editLine={false}
            body={({ item }) => <span>{item.parent}</span>}
          />
          <GridView.Table.Column
            title="Hiển thị"
            sortKey="isShow"
            isShowFilter={false}
            filterName="isShow"
            // typeColumn="boolean"
            editLine={false}
            body={({ item }) => (
              <span>{item.isShow ? "Hiển thị" : "Không hiển thị"}</span>
            )}
          />
          <GridView.Table.Column
            style={{ width: "10%" }}
            className="view-action"
            title="Tác vụ"
            body={({ item }) => (
              <div className="flex flex-row">
                {permisson.per_View && (
                  <MdRemoveRedEye
                    className="cursor-pointer text-lg mr-1 text-blue-800"
                    title="Xem chi tiết"
                    onClick={() =>
                      dispatch({ type: ACTION_TYPES.READ, Id: item.id })
                    }
                  />
                )}
                {permisson.per_Edit && (
                  <MdEdit
                    className="cursor-pointer text-lg mr-1 text-blue-800"
                    title="Chỉnh sửa"
                    onClick={() =>
                      dispatch({ type: ACTION_TYPES.EDIT, Id: item.id })
                    }
                  />
                )}
                {permisson.per_Delete && (
                  <MdDelete
                    className="cursor-pointer text-lg mr-1 text-red-700"
                    title="Xóa"
                    onClick={() =>
                      delAction(
                        item,
                        menuPublicServices,
                        data,
                        setMeta,
                        meta,
                        mutate
                      )
                    }
                  />
                )}
              </div>
            )}
          />
        </GridView.Table>
      </GridView>
      {state.show && (
        <MenuPublicForm
          show={state.show}
          onClose={onClose}
          action={state.action}
          id={state.Id}
        />
      )}
      <ConfirmationDialog />
    </>
  );
}
