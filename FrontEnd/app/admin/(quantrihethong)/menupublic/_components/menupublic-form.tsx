"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelectTreeCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor, UploadFile } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, number, object, ref, string, date } from "yup";
import { menuPublicServices } from "../services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
export default function MenuPublicForm({
  show,
  action,
  id,
  onClose,
}: IFormProps) {
  const titleTable = "Menu trang công khai";
  const dataDefault = {
    title: '',
    url: '',
    stt: 1,
    parentId: null,
    isShow: true,
    isBlank: false,
  };
  const schema = object({
    title: string().trim().nullable().required('Tên menu không được để trống').max(255, 'Bạn nhập tối đa 255 ký tự'),
    url: string().trim().nullable().required('Đường dẫn không được để trống').max(50, 'Bạn nhập tối đa 50 ký tự'),
    stt: number().nullable().integer('Bạn phải nhập kiểu số nguyên'),
    parentId: number().nullable(),
  });
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const { data, error, isLoading, mutate } = menuPublicServices.GetById(id!);
  // const { data: dataParents } = menuPublicServices.GetParent()
  const { data: dataParents } = menuPublicServices.GetMenuCha()
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: any) => {
    setLoading(true);
    if (id) {
      try {
        await menuPublicServices.update(id, values);
        toast.success("Cập nhật thành công");
        await mutate();
        await onClose(true);
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
    } else {
      try {
        await menuPublicServices.create(values);
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
                    label='Tên menu'
                    required={true}
                    view={state?.viewMode}
                    id='title'
                    name='title'
                  /></div>
                <div className='col-span-6'>
                  <TanetInput
                    label='Đường dẫn'
                    required={true}
                    view={state?.viewMode}
                    id='url'
                    name='url'
                  /></div>
                <div className='col-span-6'>
                  <TanetInput
                    label='STT'
                    required={false}
                    view={state?.viewMode}
                    type='number'
                    id='stt'
                    name='stt'
                  /></div>
                <div className='col-span-12'>
                  <TanetSelect
                    label='Menu cha'
                    required={false}
                    view={state?.viewMode}
                    id='parentId'
                    name='parentId'
                    options={dataParents}
                  /></div>
                <div className='col-span-6'>
                  <TanetCheckbox
                    view={state?.viewMode}
                    id='isShow'
                    name='isShow'
                  >Hiển thị</TanetCheckbox></div>
                <div className='col-span-6'>
                  <TanetCheckbox
                    view={state?.viewMode}
                    id='isBlank'
                    name='isBlank'
                  >Cửa sổ mới</TanetCheckbox></div>
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
