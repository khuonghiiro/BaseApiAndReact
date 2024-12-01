"use client";
import { GridView } from "@/shared/components/data-grid";
import { DefaultMeta } from "@/public/app-setting";
import { handleChangeAction, formatFullDateTime } from "@/lib";
import { useContext, useEffect, useState } from "react";
import { logsServices } from "./services";
import { toast } from "react-toastify";
import { confirm } from "@/shared/components/confirm";
import dynamic from 'next/dynamic';
const ConfirmationDialog = dynamic(() => import('@/shared/components/confirm'))

export default function Page({ params }: { params: { action: string } }) {
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
    sort: {
      Created: "desc",
    },
    filter: {
      type: params.action === "change" ? 3 : params.action === "access" ? 2 : 1,
    },
  });
  const { data, isLoading, mutate } = logsServices.GetList(meta);
  const [show, setShow] = useState(false);
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
    setShow(false);
    if (isRefresh) {
      await mutate();
    }
  };
  const del = async (item: any) => {
    confirm("Bạn có chắc chắn muốn xóa?", async () => {
      try {
        await logsServices.del(item.id);
        toast.success("Xóa thành công");
        await mutate();
      } catch (err) {
        toast.error("Xóa thất bại");
      }
    });
  };
  if (params.action === "change") {
    return (
      <>
        <GridView title='Danh sách nhật ký thay đổi' handleChange={handleChange} loading={isLoading}>
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
              style={{ width: "12%" }}
              title="Thời gian"
              sortKey="Created"
              body={({ item }) => (
                <span>{formatFullDateTime(item.created)}</span>
              )}
            />

            <GridView.Table.Column
              style={{ width: "17%" }}
              title="Người xử lý"
              sortKey="CreatedBy"
              body={({ item }) => <span>{item.createdBy}</span>}
            />
            <GridView.Table.Column
              style={{ width: "10%" }}
              className="view-action"
              title="Địa chỉ truy cập"
              body={({ item }) => <span>{item.remoteIpAddress}</span>}
            />
            <GridView.Table.Column
              style={{ width: "10%" }}
              title="Hành động"
              sortKey="ActionName"
              body={({ item }) => <span>{item.actionName}</span>}
            />
            <GridView.Table.Column
              style={{ width: "12%" }}
              title="Đối tượng"
              sortKey="Title"
              body={({ item }) => <span>{item.title}</span>}
            />

            <GridView.Table.Column
              title="Nội dung"
              sortKey="Content"
              body={({ item }) => <span>{item.content}</span>}
            />

            <GridView.Table.Column
              style={{ width: "10%" }}
              title="Trạng thái"
              sortKey="status"
              body={({ item }) => (
                <span>
                  {item.status === 1 ? "Thành công" : "Không thành công"}
                </span>
              )}
            />
          </GridView.Table>
        </GridView>
        <ConfirmationDialog />
      </>
    );
  } else if (params.action === "access") {
    return (
      <>
        <GridView title='Danh sách nhật ký truy cập' handleChange={handleChange} loading={isLoading}>
          <GridView.Header keySearch={meta.search}></GridView.Header>
          <GridView.Table
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
              style={{ width: "12%" }}
              title="Thời gian"
              sortKey="Created"
              body={({ item }) => (
                <span>{formatFullDateTime(item.created)}</span>
              )}
            />

            <GridView.Table.Column
              style={{ width: "17%" }}
              title="Người thao tác"
              sortKey="CreatedBy"
              body={({ item }) => <span>{item.createdBy}</span>}
            />
            <GridView.Table.Column
              style={{ width: "10%" }}
              className="view-action"
              title="Địa chỉ truy cập"
              body={({ item }) => <span>{item.remoteIpAddress}</span>}
            />
            <GridView.Table.Column
              title="Đường dẫn trang"
              sortKey="Content"
              body={({ item }) => <span>{item.content}</span>}
            />
            <GridView.Table.Column
              style={{ width: "10%" }}
              title="Trạng thái"
              sortKey="status"
              body={({ item }) => (
                <span>
                  {item.status === 1 ? "Thành công" : "Không thành công"}
                </span>
              )}
            />
          </GridView.Table>
        </GridView>
        <ConfirmationDialog />
      </>
    );
  } else {
    return (
      <>
        <GridView title='Danh sách nhật ký đăng nhập' handleChange={handleChange} loading={isLoading}>
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
              style={{ width: "12%" }}
              title="Thời gian"
              sortKey="Created"
              body={({ item }) => (
                <span>{formatFullDateTime(item.created)}</span>
              )}
            />

            <GridView.Table.Column
              style={{ width: "12%" }}
              title="Thời gian"
              sortKey="Created"
              body={({ item }) => (
                <span>{formatFullDateTime(item.created)}</span>
              )}
            />
            <GridView.Table.Column
              style={{ width: "10%" }}
              className="view-action"
              title="Địa chỉ truy cập"
              body={({ item }) => <span>{item.remoteIpAddress}</span>}
            />
            <GridView.Table.Column
              title="Nội dung"
              sortKey="Content"
              body={({ item }) => <span>{item.content}</span>}
            />
            <GridView.Table.Column
              style={{ width: "10%" }}
              title="Trạng thái"
              sortKey="status"
              body={({ item }) => (
                <span>
                  {item.status === 1 ? "Thành công" : "Không thành công"}
                </span>
              )}
            />
          </GridView.Table>
        </GridView>
        <ConfirmationDialog />
      </>
    );
  }
}
