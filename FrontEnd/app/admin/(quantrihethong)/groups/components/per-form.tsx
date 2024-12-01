"use client";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetCheckbox } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, number, object, ref, string, date } from "yup";
import { groupsServices } from "../services";
export default function PerForm({
  roleid = null,
  groupid = null,
}) {
  const dataDefault = {
    actAdd: false,
    actEdit: false,
    actApprove: false,
    actDelete: false,
    actPer: false,
    groupId: '',
  };
  const schema = object({

  });
  const { data, isLoading } = groupsServices.GetPer(groupid!, roleid!);
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      await groupsServices.updateGRP(values);
      toast.success("Cập nhật thành công");
    } catch (err: any) {
      toast.error("Cập nhật không thành công");
    }
    setLoading(false);
  };
  useEffect(() => {

  }, [roleid, groupid]);
  return (
    <>
      <Formik
        onSubmit={(values) => {
          onSubmit(values);
        }}
        validationSchema={schema}
        initialValues={data ? data : dataDefault}
        enableReinitialize={true}
      >
        {({ handleSubmit }) => (
          <Form noValidate
            onSubmit={handleSubmit}
            onKeyPress={(ev) => {
              ev.stopPropagation();
            }}>
            <div className="grid grid-cols-2  p-3 gap-4">
              <div className="col-span-2">
                <TanetCheckbox
                  //className="text-center"
                  id={`actAdd${data?.id}`}
                  name='actAdd'
                >Thêm mới</TanetCheckbox>
              </div>
              <div className="col-span-2">
                <TanetCheckbox
                  //className="text-center"
                  id={`actEdit${data?.id}`}
                  name='actEdit'
                >Sửa</TanetCheckbox>
              </div>
              <div className="col-span-2">
                <TanetCheckbox
                  //className="text-center"
                  id={`actDelete${data?.id}`}
                  name='actDelete'
                >Xóa</TanetCheckbox>
              </div>
              <div className="col-span-2">
                <TanetCheckbox
                  //className="text-center"
                  id={`actApprove${data?.id}`}
                  name='actApprove'
                >Phê duyệt</TanetCheckbox>
              </div>
              <div className="col-span-4">
                <TanetCheckbox
                  //className="text-center"
                  id={`actPer${data?.id}`}
                  name='actPer'
                >Quyền chức năng</TanetCheckbox>
              </div>
              <div className="col-span-4 text-right border-t-2 pt-3">
                <button
                  data-modal-hide="large-modal"
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Cập nhật
                </button></div>
            </div>

          </Form>
        )}
      </Formik>

    </>
  );
}
