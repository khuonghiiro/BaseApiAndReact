"use client";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { UploadFile } from "@/lib";
import { useEffect, useState } from "react";
import { array, object } from "yup";
export interface IFormImportExcelProps {
  show: boolean;
  type: string;
  onClose: (isRefresh: boolean) => void;
  service: any;
}
export default function ImportExcelModel({
  show,
  type,
  service,
  onClose,
}: IFormImportExcelProps) {
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      await service.importExcel(values, type);
      toast.success("Thêm thành công");
      await onClose(true);
    } catch (err: any) {
      toast.error("Thêm mới thất bại: " + err.response.data);
    }
    setLoading(false);
  };
  useEffect(() => {}, [type, service]);
  const dataDefault = {};
  const schema = object({
    file: array()
      .nullable()
      .required("Chưa chọn file đính kèm")
      .min(1, "Chưa chọn file đính kèm"),
  });

  return (
    <>
      <Modal show={show} size="lg" loading={loading}>
        <Formik
          onSubmit={(values) => {
            onSubmit(values);
          }}
          validationSchema={schema}
          initialValues={dataDefault}
          enableReinitialize={true}
        >
          {({ handleSubmit }) => (
            <Form
              noValidate
              onSubmit={handleSubmit}
              onKeyPress={(ev) => {
                ev.stopPropagation();
              }}
            >
              <Modal.Header onClose={onClose}>Import excel</Modal.Header>
              <Modal.Body nameClass="grid-cols-12">
                <div className="col-span-12 text-right">
                  <a
                    style={{
                      color: "blue",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() => service.downLoadFileTemp(type)}
                  >
                    Tải file mẫu
                  </a>
                </div>
                <div className="col-span-12">
                  <UploadFile
                    action={"add"}
                    nameAttach="file"
                    fileType="fileExcel"
                    maxFiles={1}
                    //loading={true}
                  />
                </div>
              </Modal.Body>
              <Modal.Footer onClose={onClose}>
                <button
                  data-modal-hide="large-modal"
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Import
                </button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}
