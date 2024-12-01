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
import { TanetInput, TanetSelectTreeCheck, TanetSelect, SelectAsync, TanetFormDate } from "@/lib";
import { useReducer, useState, useEffect } from "react";
import { departmentServices } from "./services";
import { MdFileUpload, MdDownload } from "react-icons/md";
import {
  AiOutlinePlus,
  AiFillEdit,
  AiFillDelete,
  AiTwotoneEye,
} from "react-icons/ai";
import DepartmentForm from "./_components/department-form";
import { toast } from "react-toastify";
import ConfirmationDialog, { confirm } from "@/shared/components/confirm";
import { ViewAvatar } from "@/lib/file-attachment";
export default function Page() {
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
  });
  const [permisson, setPermisson] = useState<any>({
    ...DefaulPer,
  });
  const titleTable = "Phòng ban/đơn vị";
  const { data, isLoading, mutate } = departmentServices.GetList(meta);
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
    setPermisson(getPermisson("department"));
  }, []);
  return (
    <>
      <GridView title={'Danh sách ' + titleTable} handleChange={handleChange} loading={isLoading}>
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
                  <AiOutlinePlus className="text-[20px]" /> Thêm mới
                </button>
              )}
            </div>
          }
          AdvanceFilter={
            <>
              <div className="">
                <TanetInput
                  label='Mã phòng ban/đơn vị'
                  id='code'
                  name='code'
                />
              </div>
              <div className="">
                <TanetInput
                  label='Tên phòng ban/đơn vị'
                  id='title'
                  name='title'
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
          <GridView.Table.Column style={{}} title="Mã phòng ban/đơn vị" sortKey="code" body={({ item }) => (<span>{item.code}</span>)} />
          <GridView.Table.Column style={{}} title="Tên phòng ban/đơn vị" sortKey="title" body={({ item }) => (<span>{item.title}</span>)} />
          <GridView.Table.Column style={{ width: 140 }} title="Ảnh đại diện" sortKey="avatar" body={({ item }) => (<ViewAvatar data={item?.avatar} />)} />
          <GridView.Table.Column
            style={{ width: "10%" }}
            className="view-action"
            title="Tác vụ"
            body={({ item }) => (
              <div className="flex flex-row">
                {permisson.per_View && <AiTwotoneEye
                  className="cursor-pointer text-lg mr-1 text-blue-800"
                  title="Xem chi tiết"
                  onClick={() => dispatch({ type: ACTION_TYPES.READ, Id: item.id })}
                />}
                {permisson.per_Edit && <AiFillEdit
                  className="cursor-pointer text-lg mr-1 text-blue-800"
                  title="Chỉnh sửa"
                  onClick={() => dispatch({ type: ACTION_TYPES.EDIT, Id: item.id })}
                />}
                {permisson.per_Delete && <AiFillDelete
                  className="cursor-pointer text-lg mr-1 text-red-700"
                  title="Xóa"
                  onClick={() => delAction(item, departmentServices, data, setMeta, meta, mutate)}
                />
                }
              </div>
            )}
          />
        </GridView.Table>
      </GridView>
      {state.show && <DepartmentForm show={state.show} onClose={onClose} action={state.action} id={state.Id} />}
      <ConfirmationDialog />
    </>
  );
}
