"use client";
import { GridView } from "@/shared/components/data-grid";
import { DefaultMeta, DefaulPer } from "@/public/app-setting";
import {
    handleChangeAction,
    formatFullDateTime,
} from "@/lib/common";
import { useReducer, useState, useEffect } from "react";

import { passwordResetRequestServices } from "../services";

import {
    AiOutlineRetweet,
    AiFillCloseCircle
} from "react-icons/ai";
import { toast } from "react-toastify";
import ConfirmationDialog, { confirm } from "@/shared/components/confirm";
import { MdLockReset, MdOutlinePassword } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
export const TabUserPasswordRequest = ({ onResetPassword }: {
    onResetPassword: (userName: string, passwordId?: number, statusRequest?: number) => void;
}) => {
    const [meta, setMeta] = useState<any>({
        ...DefaultMeta,
        filter: {
        }
    });
    const [permisson, setPermisson] = useState<any>({
        ...DefaulPer,

    });
    const { data, isLoading, mutate } = passwordResetRequestServices.GetList(meta);
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
    
    const handleUpdate = async (data: any) => {
        try {
            if(data.status !== 0) return;
             //status <=> 0: yêu cầu, 1: đồng ý, 2: từ chối
            confirm("Bạn có chắn chắn muốn từ chối yêu cầu cấp lại mật khẩu phải không?", async () => {
              const response = await passwordResetRequestServices.updateStatus(data.id, 2);
              if (response) {
                toast.success('Đã từ chối yêu cầu thành công');
                await mutate();
              }
            });
    
        } catch (error) {
          toast.error('Từ chối yêu cầu thất bại');
        }
      };

      const renderStatus = (status: any) => {
        switch (status) {
          case 0:
            return <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Yêu cầu</span>
          case 1:
            return <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-green-600/20">Chấp nhận</span>
          case 2:
            return <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-red-600/10">Từ chối</span>
         
          default:
            return;
        }
      }

    return (
        <>
            <GridView title={''} handleChange={handleChange} loading={isLoading}>

            <GridView.Header
                    keySearch={meta.search}
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
                    <GridView.Table.Column style={{}} title="Tên đăng nhập" sortKey="summary" body={({ item }) => (<span>{item.passwordResetRequest_UserId?.username}</span>)} />
                    <GridView.Table.Column style={{}} title="Họ và tên" sortKey="createdUserId " body={({ item }) => (<span>{item.passwordResetRequest_UserId?.fullName}</span>)} />
                    <GridView.Table.Column
                        style={{ width: "12%" }}
                        title="Ngày tạo"
                        sortKey="createdAt"
                        className="text-center"
                        body={({ item }) => (
                            <span>
                                {formatFullDateTime(item?.createdAt)}
                            </span>
                        )}
                    />
                    <GridView.Table.Column
                        style={{ width: "12%" }}
                        title="Ngày xử lý"
                        sortKey="updatedAt"
                        className="text-center"
                        body={({ item }) => (
                            <span>
                                {formatFullDateTime(item?.updatedAt)}
                            </span>
                        )}
                    />
                    <GridView.Table.Column
                        style={{ width: "12%" }}
                        title="Người xử lý"
                        sortKey="updatedAt"
                        className="text-center"
                        body={({ item }) => (
                            <span>
                                {item?.passwordResetRequest_UserAgreeId?.fullName}
                            </span>
                        )}
                    />
                    <GridView.Table.Column
                        style={{ width: "12%" }}
                        title="Yêu cầu"
                        sortKey="status"
                        className="text-center"
                        body={({ item }) => (
                            <span>

                                {renderStatus(item.status)}
                            </span>
                        )}
                    />
                    <GridView.Table.Column
                        style={{ width: "12%" }}
                        title="Trạng thái"
                        sortKey="status"
                        className="text-center"
                        body={({ item }) => (
                            <span>
                                {item.passwordResetRequest_UserId?.status === 1 ? (
                                    <span className="badge badge-danger">Không hoạt động</span>
                                ) : item.passwordResetRequest_UserId?.status === 2 ? (
                                    <span className="badge badge-success">Đang hoạt động</span>
                                ) : (
                                    ""
                                )}
                            </span>
                        )}
                    />
                    {/* <GridView.Table.Column className="text-center" style={{}} title="Trạng thái" sortKey="status" body={({ item }) => (<span style={getStatusStyle(item?.status)}>{item.statusName}</span>)} /> */}
                    <GridView.Table.Column
                        style={{ width: "10%" }}
                        className="view-action"
                        title="Tác vụ"
                        body={({ item }) => (
                            <div className="flex flex-row">
                                {<MdOutlinePassword
                                     className={`cursor-pointer text-lg mr-1 ${(item.status != 0) ? 'text-gray-400 cursor-not-allowed' : 'text-blue-800'}`}
                                    title="Đặt lại mật khẩu"
                                    //onClick={() => dispatch({ type: ACTION_TYPES.READ, Id: item.id })}
                                    onClick={() => { onResetPassword(item.passwordResetRequest_UserId?.username, item.id, item.status)}}
                                />}
                                 {<AiFillCloseCircle
                                     className={`cursor-pointer text-lg mr-1 ${(item.status != 0) ? 'text-gray-400 cursor-not-allowed' : 'text-red-700'}`}
                                    title="Từ chối"
                                    //onClick={() => dispatch({ type: ACTION_TYPES.READ, Id: item.id })}
                                    onClick={() => handleUpdate(item)}
                                />}
                                {/* {permisson.per_Delete && <AiFillDelete
                                    className="cursor-pointer text-lg mr-1 text-red-700"
                                    title="Xóa"
                                />
                                } */}
                            </div>
                        )}
                    />
                </GridView.Table>
            </GridView>
        </>
    );
}
