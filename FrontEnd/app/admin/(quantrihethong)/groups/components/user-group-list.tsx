"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { toast } from "react-toastify";
import { GridView } from "@/shared/components/data-grid";
import { groupsServices } from "../services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
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
import { userServices } from "../../users/services";
import { FaUserPlus } from "react-icons/fa";
import { FaUserMinus } from "react-icons/fa";

export default function UserGroupList({
  show,
  action,
  id,
  onClose,
}: IFormProps) {
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
  });
  const [permisson, setPermisson] = useState<any>({
    ...DefaulPer,
  });
  const { data, isLoading, mutate } = userServices.GetList(meta);
  const { data: dataGroup } = groupsServices.GetById(id!);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [username, setUsername] = useState("");
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

  useEffect(() => {
    setPermisson(getPermisson("groups"));
  }, [id]);
  const onRemoveUser = async (idUser: number) => {
    try {
      await userServices.RemoveUserToGroup(idUser, id);
      toast.success("Gỡ người dùng khỏi nhóm thành công");
      await mutate();
    } catch (err) {
      toast.error("Gỡ người dùng thất bại");
    }
  };
  const onAddUser = async (idUser: number) => {
    try {
      await userServices.AddUserToGroup(idUser, id);
      toast.success("Thêm người dùng vào nhóm thành công");
      await mutate();
    } catch (err) {
      toast.error("Thêm người dùng vào nhóm thất bại");
    }
  };
  return (
    <>
      <Modal show={show} size="xxl" loading={isLoading}>
        <>
          <Modal.Header onClose={onClose}>
            Cập nhật người dùng cho nhóm: {dataGroup?.title}
          </Modal.Header>
          <Modal.Body nameClass="gap-2">
            <GridView handleChange={handleChange} loading={isLoading}>
              <GridView.Header keySearch={meta.search}></GridView.Header>
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
                  style={{ width: "20%" }}
                  title="Tên đăng nhập"
                  sortKey="username"
                  body={({ item }) => <span>{item.username}</span>}
                />
                <GridView.Table.Column
                  title="Họ và tên"
                  sortKey="fullName"
                  body={({ item }) => <span>{item.fullName}</span>}
                />
                <GridView.Table.Column
                  title="Email"
                  sortKey="email"
                  body={({ item }) => <span>{item.email}</span>}
                />
                <GridView.Table.Column
                  style={{ width: "12%" }}
                  title="Trạng thái"
                  sortKey="status"
                  className="text-center"
                  body={({ item }) => (
                    <span>
                      {item.status === 1 ? (
                        <span className="badge badge-danger">
                          Không hoạt động
                        </span>
                      ) : item.status === 2 ? (
                        <span className="badge badge-success">
                          Đang hoạt động
                        </span>
                      ) : (
                        ""
                      )}
                    </span>
                  )}
                />
                <GridView.Table.Column
                  style={{ width: "10%" }}
                  className="view-action"
                  title="Tác vụ"
                  body={({ item }) => (
                    <div className="flex flex-row">
                      {permisson.per_Edit && !item.lstGroupIds.includes(id) && (
                        <FaUserPlus
                          className="cursor-pointer text-base mr-1 text-blue-800"
                          title="Thêm"
                          onClick={() => onAddUser(item.id)}
                        />
                      )}
                      {permisson.per_Edit && item.lstGroupIds.includes(id) && (
                        <FaUserMinus
                          className="cursor-pointer text-base mr-1 text-red-700"
                          title="Xóa"
                          onClick={() => onRemoveUser(item.id)}
                        />
                      )}
                    </div>
                  )}
                />
              </GridView.Table>
            </GridView>
          </Modal.Body>
          <Modal.Footer onClose={onClose}></Modal.Footer>
        </>
      </Modal>
    </>
  );
}
