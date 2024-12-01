"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelectTreeCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor, UploadFile } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, number, object, ref, string, date } from "yup";
import { configExcelServices } from "../services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
export default function ConfigExcelForm({
  show,
  action,
  id,
  onClose,
}: IFormProps) {
  const titleTable = "";
  const dataDefault = {
    tieuDe: '',
    doiTuong: '',
    loai: 1,
    cauHinh: '',
    rowStart: null,
    fileDinhKem: '',
    cauHinhHeader: '',
  };
  const schema = object({
    tieuDe: string().trim().nullable().required('Tiêu đề không được để trống').max(250, 'Bạn nhập tối đa 250 ký tự'),
    doiTuong: string().trim().nullable().required('Đối tượng không được để trống').max(250, 'Bạn nhập tối đa 250 ký tự'),
    cauHinh: string().trim().nullable().required('Cấu hình không được để trống'),
    rowStart: number().nullable().required('Hàng dữ liệu bắt đầu không được để trống').integer('Bạn phải nhập kiểu số nguyên'),
    fileDinhKem: string().trim().nullable(),
    cauHinhHeader: string().trim().nullable(),
  });
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const { data, error, isLoading, mutate } = configExcelServices.GetById(id!);
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: any) => {
    setLoading(true);
    if (id) {
      try {
        await configExcelServices.update(id, values);
        toast.success("Cập nhật thành công");
        await mutate();
        await onClose(true);
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
    } else {
      try {
        await configExcelServices.create(values);
        toast.success("Thêm thành công");
        await mutate();
        await onClose(true);
      } catch (err: any) {
        toast.error("Thêm mới không thành công");
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    dispatch({ type: action });
  }, [action, id]);
  return (
    <>
      <Modal show={show} size="xl" loading={loading}>
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
              <Modal.Header onClose={onClose}>{computedTitle(id, state?.editMode, titleTable)}</Modal.Header>
              <Modal.Body nameClass="grid-cols-12">
                <div className='col-span-12'>
                  <TanetInput
                    label='Tiêu đề'
                    required={true}
                    view={state?.viewMode}
                    id='tieuDe'
                    name='tieuDe'
                  /></div>
                <div className='col-span-6'>
                  <TanetInput
                    label='Đối tượng'
                    required={true}
                    view={state?.viewMode}
                    id='doiTuong'
                    name='doiTuong'
                  /></div>
                <div className='col-span-6'>
                  <TanetInput
                    label='Hàng dữ liệu bắt đầu'
                    required={true}
                    view={state?.viewMode}
                    type='number'
                    id='rowStart'
                    name='rowStart'
                  /></div>
                <div className='col-span-12'>
                  <TanetTextArea
                    label='Cấu hình header'
                    required={false}
                    view={state?.viewMode}
                    id='cauHinhHeader'
                    name='cauHinhHeader'
                    rows={2}
                  /></div>
                <div className='col-span-12'>
                  <TanetTextArea
                    label='Cấu hình'
                    required={true}
                    view={state?.viewMode}
                    id='cauHinh'
                    name='cauHinh'
                    rows={10}
                  /></div>
              </Modal.Body>
              <Modal.Footer onClose={onClose}>
                {!state?.viewMode ? (
                  <>
                    <button
                      data-modal-hide="large-modal"
                      type="submit"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Lưu
                    </button>
                  </>
                ) : (
                  <></>
                )}
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}
