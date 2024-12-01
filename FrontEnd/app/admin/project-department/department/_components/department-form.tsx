"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetTextArea, TanetSelect } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, object, string } from "yup";
import { departmentServices } from "../services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
import { FileAttach } from "@/lib/file-attachment";
export default function DepartmentForm({
  show,
  action,
  id,
  onClose,
}: IFormProps) {
  const titleTable = "Phòng ban/đơnv vị";
  const dataDefault = {
    code: '',
    title: '',
    desctiption: '',
    avatar: [],
    lstUserIds: [],
  };
  const schema = object({
    code: string().trim().nullable().required('Mã phòng ban/đơn vị không được để trống').max(50, 'Bạn nhập tối đa 50 ký tự'),
    title: string().trim().nullable().required('Tên phòng ban/đơn vị không được để trống').max(250, 'Bạn nhập tối đa 250 ký tự'),
    desctiption: string().trim().nullable().max(1000, 'Bạn nhập tối đa 1000 ký tự'),
    avatar: array().nullable(),
  });
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const { data, mutate } = departmentServices.GetById(id!);
  const { data: dataUsers } = departmentServices.GetAllUsers();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: any) => {
    setLoading(true);
    if (id) {
      try {
        await departmentServices.update(id, values);
        toast.success("Cập nhật thành công");
        await mutate();
        await onClose(true);
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
    } else {
      try {
        await departmentServices.create(values);
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
                    label='Mã phòng ban/đơn vị'
                    required={true}
                    view={state?.viewMode}
                    id='code'
                    name='code'
                  /></div>
                <div className='col-span-12'>
                  <TanetInput
                    label='Tên phòng ban/đơn vị'
                    required={true}
                    view={state?.viewMode}
                    id='title'
                    name='title'
                  /></div>
                <div className='col-span-12'>
                  <TanetTextArea
                    label='Mô tả'
                    required={false}
                    view={state?.viewMode}
                    rows={3}
                    id='desctiption'
                    name='desctiption'
                  /></div>
                <div className="col-span-12">
                  <TanetSelect
                    label="Thành viên phòng ban/đơn vị"
                    name="lstUserIds"
                    view={state?.viewMode}
                    options={dataUsers}
                    isMulti={true}
                  />
                </div>
                <div className='col-span-12'><FileAttach
                  action={action}
                  nameAttach='avatar'
                  displayImage={true}
                  fileType='fileImage'
                  maxFiles={1}
                  required={false}
                  label="Ảnh đại diện"
                /></div>
                {/* {state?.viewMode && (
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
                )} */}
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
