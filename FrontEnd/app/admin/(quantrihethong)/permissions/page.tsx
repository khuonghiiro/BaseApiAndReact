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
import { useReducer, useState, useEffect } from "react";
import { permissionsServices } from "./services";
import { IoMdAdd } from "react-icons/io";
import dynamic from "next/dynamic";
const PermissionsForm = dynamic(() => import("./components/permissions-form"));
const ConfirmationDialog = dynamic(() => import("@/shared/components/confirm"));

export default function Page() {
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
  });
  const [permisson, setPermisson] = useState<any>({
    ...DefaulPer,
  });
  const titleTable = "Quyền người dùng";
  const { data, isLoading, mutate } = permissionsServices.GetList(meta);
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
    setPermisson(getPermisson("permissions"));
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
            permisson.per_Add && (
              <button
                className="btn-add"
                onClick={() => dispatch({ type: ACTION_TYPES.ADD, Id: 0 })}
              >
                <IoMdAdd className="text-[20px]" /> Thêm mới
              </button>
            )
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
            title="Mã quyền"
            sortKey="code"
            body={({ item }) => <span>{item.code}</span>}
          />
          <GridView.Table.Column
            style={{}}
            title="Tên quyền"
            sortKey="title"
            body={({ item }) => <span>{item.title}</span>}
          />
          {/* <GridView.Table.Column
            style={{ width: "10%" }}
            className="view-action"
            title="Tác vụ"
            body={({ item }) => (
              <div className="flex flex-row">
                {permisson.per_View && <MdRemoveRedEye
                  className="cursor-pointer text-base mr-1 text-blue-800"
                  titleAccess="Xem chi tiết"
                  onClick={() => dispatch({ type: ACTION_TYPES.READ, Id: item.id })}
                />}
                {permisson.per_Edit && <MdEdit
                  className="cursor-pointer text-base mr-1 text-blue-800"
                  titleAccess="Chỉnh sửa"
                  onClick={() => dispatch({ type: ACTION_TYPES.EDIT, Id: item.id })}
                />}
                {permisson.per_Delete && <MdDelete
                  className="cursor-pointer text-base mr-1 text-red-700"
                  titleAccess="Xóa"
                  onClick={() => delAction(item, permissionsServices, data, setMeta, meta, mutate)}
                />
                }
              </div>
            )}
          /> */}
        </GridView.Table>
      </GridView>
      <PermissionsForm
        show={state.show}
        onClose={onClose}
        action={state.action}
        id={state.Id}
      />
      <ConfirmationDialog />
    </>
  );
}
