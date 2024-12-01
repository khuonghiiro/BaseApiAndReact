"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelectTreeCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, number, object, ref, string, date } from "yup";
import { projectServices } from "../services";
import { formReducer, INITIAL_STATE_FORM, computedTitle, formatFullDateTime } from "@/lib/common";
import CustomerForm from "./customer-form";
export default function ProjectForm({
  show,
  action,
  id,
  onClose,
}: IFormProps) {
  const titleTable = "Dự án";
  const dataDefault = {
    ownerId: null,
    code: '',
    name: '',
    description: '',
    departmentIds: '',
    lstDepartmentIds: [],
    lstUserIds: [],
    lstCustomerIds: [],
    startDate: null,
    endDate: null,
  };
  const schema = object({
    ownerId: number().nullable().required('PM dự án  không được để trống'),
    code: string().trim().nullable().required('Mã dự án không được để trống'),
    name: string().trim().nullable().required('Tên dự án không được để trống'),
    description: string().trim().nullable(),
    startDate: date().nullable(),
    endDate: date().nullable(),
  });
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const { data, error, isLoading, mutate } = projectServices.GetById(id!);
  const { data: dataDepartment } = projectServices.GetAllDepartments();
  const { data: dataUsers } = projectServices.GetAllUsers("02");
  const { data: dataUsers3 } = projectServices.GetAllUsers("02,03");
  const [_date, setDate] = useState(new Date());
  const { data: dataUserCustomers } = projectServices.GetAllUsersCustomer("04", _date);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const onSubmit = async (values: any) => {
    setLoading(true);
    if (id) {
      try {
        await projectServices.update(id, values);
        toast.success("Cập nhật thành công");
        await mutate();
        await onClose(true);
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
    } else {
      try {
        await projectServices.create(values);
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
  }, [action, id, _date]);
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
          {({ handleSubmit, values, setFieldValue }) => (
            <Form noValidate
              onSubmit={handleSubmit}
              onKeyPress={(ev) => {
                ev.stopPropagation();
              }}>
              <Modal.Header onClose={onClose}>{computedTitle(id, state?.editMode, titleTable)}</Modal.Header>
              <Modal.Body nameClass="grid-cols-12">

                <div className='col-span-12'>
                  <TanetInput
                    label='Mã dự án'
                    required={true}
                    view={state?.viewMode}
                    id='code'
                    name='code'
                  /></div>
                <div className='col-span-12'>
                  <TanetInput
                    label='Tên dự án'
                    required={true}
                    view={state?.viewMode}
                    id='name'
                    name='name'
                  /></div>
                <div className='col-span-12'>
                  <TanetTextArea
                    label='Mô tả dự án'
                    required={false}
                    rows={3}
                    view={state?.viewMode}
                    id='description'
                    name='description'
                  /></div>
                <div className='col-span-12'>
                  <TanetSelect
                    label='PM dự án'
                    required={true}
                    view={state?.viewMode}
                    id='ownerId'
                    name='ownerId'
                    options={dataUsers}
                    isMulti={false}
                  /></div>
                <div className='col-span-12'>
                  <TanetSelect
                    label='Thành viên dự án'
                    required={false}
                    view={state?.viewMode}
                    id='lstUserIds'
                    name='lstUserIds'
                    options={dataUsers3}
                    isMulti={true}
                  /></div>
                <div className='col-span-12' style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ width: '100%' }}>
                    <TanetSelect
                      label='Khách hàng'
                      required={false}
                      view={state?.viewMode}
                      id='lstCustomerIds'
                      name='lstCustomerIds'
                      options={dataUserCustomers}
                      isMulti={true}
                    />
                  </div>
                  {!state?.viewMode && <button
                    data-modal-hide="large-modal"
                    type="button"
                    onClick={() => setOpen(true)}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Thêm
                  </button>}

                </div>
                <div className='col-span-12'>
                  <TanetSelect
                    label='Phòng ban/đơn vị'
                    required={false}
                    view={state?.viewMode}
                    id='lstDepartmentIds'
                    name='lstDepartmentIds'
                    options={dataDepartment}
                    isMulti={true}
                  /></div>
                <div className='col-span-6'>
                  <TanetFormDate
                    label='Ngày bắt đầu dự án'
                    required={false}
                    view={state?.viewMode}
                    dateFormat='dd/MM/yyyy'
                    id='startDate'
                    name='startDate'
                  /></div>
                <div className='col-span-6'>
                  <TanetFormDate
                    label='Ngày kết thúc dự án'
                    required={false}
                    view={state?.viewMode}
                    dateFormat='dd/MM/yyyy'
                    id='endDate'
                    name='endDate'
                  /></div>
                {open && <CustomerForm show={open} onClose={() => setOpen(false)} onSave={(id: number) => {
                  debugger;
                  let arr = values.lstCustomerIds ?? [];
                  arr.push(id);
                  setFieldValue('lstCustomerIds', arr);
                  setOpen(false)
                  setDate(new Date());
                }} />}
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
