"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelectTreeCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor, UploadFile } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, number, object, ref, string, date } from "yup";
import { testServices } from "../services";
import { formReducer, INITIAL_STATE_FORM, computedTitle, formatFullDateTime } from "@/lib/common";
export default function TestForm({
  show,
  action,
  id,
  onClose,
}: IFormProps) {
  const titleTable = "Bảng test";
  const dataDefault = {
    title: '',
    moTa: '',
    content: '',
  };
  const schema = object({
    title: string().trim().nullable().required('Tên tài liệu không được để trống').max(100, 'Bạn nhập tối đa 100 ký tự'),
    moTa: string().trim().nullable().required('Mô tả không được để trống').max(1000, 'Bạn nhập tối đa 1000 ký tự'),
    content: string().trim().nullable().max(3000, 'Bạn nhập tối đa 3000 ký tự'),
  });
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const { data, error, isLoading, mutate } = testServices.GetById(id!);
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: any) => {
    setLoading(true);
    if (id) {
      try {
        await testServices.update(id, values);
        toast.success("Cập nhật thành công");
        await mutate();
        await onClose(true);
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
    } else {
      try {
        await testServices.create(values);
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
          {({ handleSubmit, values }) => (
            <Form noValidate
              onSubmit={handleSubmit}
              onKeyPress={(ev) => {
                ev.stopPropagation();
              }}>
              <Modal.Header onClose={onClose}>{computedTitle(id, state?.editMode, titleTable)}</Modal.Header>
              <Modal.Body nameClass="grid-cols-12">
                <div className='col-span-12'>
                  <TanetInput
                    label='Tên tài liệu'
                    required={true}
                    view={state?.viewMode}
                    id='title'
                    name='title'
                  /></div>
                <div className='col-span-12'>
                  <TanetTextArea
                    label='Mô tả'
                    required={true}
                    view={state?.viewMode}
                    rows={3}
                    id='moTa'
                    name='moTa'
                  /></div>
                <div className='col-span-12'>
                  {
                    !isLoading ? <TanetCKEditor
                      label='Nội dung'
                      required={false}
                      view={state?.viewMode}
                      id='content'
                      name='content'
                      data={data?.content}
                    /> : ''}
                </div>
                {state?.viewMode && (
                  <>
                    <div className='col-span-6'>
                      <div>
                        <label
                          className="block text-sm font-medium leading-6 text-gray-900"
                          style={{ color: '#7f7f7f' }}
                        >
                          Ngày tạo
                        </label>
                        {formatFullDateTime(values?.createdDate)}
                      </div>
                    </div>
                    <div className='col-span-6'>
                      <div>
                        <label
                          className="block text-sm font-medium leading-6 text-gray-900"
                          style={{ color: '#7f7f7f' }}
                        >
                          Người tạo
                        </label>
                        {values?.createdUser?.fullName}
                      </div>
                    </div>
                    {values?.lastUpdatedDate && <>
                      <div className='col-span-6'>
                        <div>
                          <label
                            className="block text-sm font-medium leading-6 text-gray-900"
                            style={{ color: '#7f7f7f' }}
                          >
                            Ngày cập nhật
                          </label>
                          {formatFullDateTime(values?.lastUpdatedDate)}
                        </div>
                      </div>
                      <div className='col-span-6'>
                        <div>
                          <label
                            className="block text-sm font-medium leading-6 text-gray-900"
                            style={{ color: '#7f7f7f' }}
                          >
                            Người cập nhật
                          </label>
                          {values?.lastUpdatedUser?.fullName}
                        </div>
                      </div>
                    </>}
                  </>
                )}
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
