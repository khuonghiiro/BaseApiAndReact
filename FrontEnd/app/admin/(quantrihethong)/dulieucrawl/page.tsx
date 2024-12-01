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
  formatDateTime,
} from "@/lib/common";
import { useReducer, useState, useEffect } from "react";
import { duLieuCrawlServices } from "./services";
import { TanetSelect } from "@/lib";
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdRemoveRedEye } from "react-icons/md";
import DuLieuCrawlForm from "./_components/dulieucrawl-form";
import ConfirmationDialog from "@/shared/components/confirm";
export default function Page() {
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
  });
  const [permisson, setPermisson] = useState<any>({
    ...DefaulPer,
  });
  const { data, isLoading, mutate } = duLieuCrawlServices.GetList(meta);
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
    setPermisson(getPermisson("dulieucrawl"));
  }, []);
  return (
    <>
      <GridView
        title="Danh sách dữ liệu"
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
          services={duLieuCrawlServices}
          className="col-12"
          data={data?.data}
          keyExtractor={({ item }) => {
            return item.id;
          }}
          page={data?.currentPage}
          page_size={data?.pageSize}
          total={data?.totalRows}
          noSelected={true}
          mutate={mutate}
        >
          <GridView.Table.Column
            style={{ width: "3%" }}
            title="STT"
            className="text-center"
            isShowFilter={false}
            body={({ index }) => (
              <span>{index + 1 + (meta.page - 1) * meta.page_size}</span>
            )}
          />
          <GridView.Table.Column
            style={{ width: "20%" }}
            title="Tên bảng"
            sortKey="bangCauHinhId"
            body={({ item }) => <span>{item.bangCauHinhName}</span>}
          />
          <GridView.Table.Column
            title="Ngày tạo"
            sortKey="createdDate"
            body={({ item }) => <span>{formatDateTime(item.createdDate)}</span>}
          />
          <GridView.Table.Column
            title="Dữ liệu"
            sortKey="data"
            body={({ item }) => <span>{item.data}</span>}
          />
          <GridView.Table.Column
            style={{ width: "10%" }}
            className="view-action"
            title="Tác vụ"
            body={({ item }) => (
              <div className="flex flex-row">
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
                        duLieuCrawlServices,
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
      <DuLieuCrawlForm
        show={state.show}
        onClose={onClose}
        action={state.action}
        id={state.Id}
      />
      <ConfirmationDialog />
    </>
  );
}
