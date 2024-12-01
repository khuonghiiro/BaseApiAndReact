"use client";
import { GridView } from "@/shared/components/data-grid";
import { DefaultMeta, DefaulPer } from "@/public/app-setting";
import {
  handleChangeAction,
  delAction,
  listReducer,
  getPermisson,
  INITIAL_STATE_LIST,
  ACTION_TYPES,
} from "@/lib/common";
import { useReducer, useState, useEffect } from "react";
import { groupsServices } from "./services";
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdRemoveRedEye } from "react-icons/md";
import { MdManageAccounts } from "react-icons/md";
import { MdGroup } from "react-icons/md";
import dynamic from "next/dynamic";
const GroupsForm = dynamic(() => import("./components/groups-form"));
const UserGroupList = dynamic(() => import("./components/user-group-list"));
const PhanQuyenGroup = dynamic(() => import("./components/phanquyen"));
const ConfirmationDialog = dynamic(() => import("@/shared/components/confirm"));

export default function Page() {
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
  });
  const [permisson, setPermisson] = useState<any>({
    ...DefaulPer,
  });
  const titleTable = "Nhóm người dùng";
  const { data, isLoading, mutate } = groupsServices.GetList(meta);
  const [state, dispatch] = useReducer(listReducer, INITIAL_STATE_LIST);
  const actions = {
    meta,
  };
  const [isShowPer, setIsShowPer] = useState(false);
  const [isShowUpdateUser, setIsShowUpdateUser] = useState(false);
  const [idGroup, setIdGroup] = useState(null);
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
  const onClosePer = () => {
    setIsShowPer(false);
    setIsShowUpdateUser(false);
    setIdGroup(null);
  };
  const actPermissionGroup = (data: any) => {
    setIsShowPer(true);
    setIdGroup(data.id);
  };
  const actAddOrUpdateUser = (data: any) => {
    setIsShowUpdateUser(true);
    setIdGroup(data.id);
  };

  useEffect(() => {
    setPermisson(getPermisson("groups"));
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
            title="Tên nhóm người dùng"
            sortKey="title"
            body={({ item }) => <span>{item.title}</span>}
          />
          <GridView.Table.Column
            style={{}}
            title="Mã nhóm người dùng"
            sortKey="code"
            body={({ item }) => <span>{item.code}</span>}
          />
          <GridView.Table.Column
            style={{ width: "10%" }}
            className="view-action"
            title="Tác vụ"
            body={({ item }) => (
              <div className="flex flex-row">
                {permisson.per_Edit && (
                  <MdManageAccounts
                    className="cursor-pointer text-base mr-2 text-blue-800"
                    title="Phân quyền người dùng"
                    onClick={() => actPermissionGroup(item)}
                  />
                )}
                {permisson.per_Edit && (
                  <MdGroup
                    className="cursor-pointer text-base mr-2 text-blue-800"
                    title="Thêm người dùng"
                    onClick={() => actAddOrUpdateUser(item)}
                  />
                )}
                {permisson.per_View && (
                  <MdRemoveRedEye
                    className="cursor-pointer text-base mr-1 text-blue-800"
                    title="Xem chi tiết"
                    onClick={() =>
                      dispatch({ type: ACTION_TYPES.READ, Id: item.id })
                    }
                  />
                )}
                {permisson.per_Edit && (
                  <MdEdit
                    className="cursor-pointer text-base mr-1 text-blue-800"
                    title="Chỉnh sửa"
                    onClick={() =>
                      dispatch({ type: ACTION_TYPES.EDIT, Id: item.id })
                    }
                  />
                )}
                {permisson.per_Delete && (
                  <MdDelete
                    className="cursor-pointer text-base mr-1 text-red-700"
                    title="Xóa"
                    onClick={() =>
                      delAction(
                        item,
                        groupsServices,
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
      <GroupsForm
        show={state.show}
        onClose={onClose}
        action={state.action}
        id={state.Id}
      />
      {/* <PermissionGroups show={isShowPer}  onClose={onClosePer} action="per-group" id={idGroup}/> */}

      <PhanQuyenGroup
        show={isShowPer}
        onClose={onClosePer}
        action="per-group"
        id={idGroup}
      />
      <UserGroupList
        show={isShowUpdateUser}
        onClose={onClosePer}
        action="update-user-group"
        id={idGroup}
      />
      <ConfirmationDialog />
    </>
  );
}
