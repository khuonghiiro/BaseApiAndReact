"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelectTreeCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor, TanetLabel } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, number, object, ref, string, date } from "yup";
import { ticketServices } from "../services";
import { formReducer, INITIAL_STATE_FORM, computedTitle, formatFullDateTime } from "@/lib/common";
import { EPriorityTicket, TicketStatusEnum } from "../ticket-status-enum";
import { FileAttach } from "@/lib/file-attachment";

export default function TicketForm({
  show,
  action,
  id,
  onClose
}: IFormProps) {
  const titleTable = "Yêu cầu hỗ trợ";
  const dataDefault = {
    projectId: null,
    code: '--',
    summary: '',
    priority: EPriorityTicket.Medium,
    status: TicketStatusEnum.ChuaGui,
    assignedId: null,
    description: '',
    startDate: null,
    endDate: null,
    attachment: [],
  };

  const schema = object({
    projectId: number().nullable().required('Dự án không được để trống'),
    summary: string().trim().nullable().required('Tiêu đề không được để trống'),
    priority: number().nullable().required('Mức độ ưu tiên không được để trống'),
    description: string().trim().nullable(),
    startDate: date().nullable(),
    endDate: date().nullable(),
    attachment: array().nullable().max(5, 'Không chọn quá 5 file'),
  });

  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const { data, error, isLoading, mutate } = ticketServices.GetById(id!);
  const { data: dataProjects } = ticketServices.GetListProject();
  const { data: dataUserDepart } = ticketServices.GetAllUsers();
  const [loading, setLoading] = useState(false);
  const [assignedLoginId, setAssignedLoginId] = useState<number | null>(null);

  const dataPriority = [
    { value: 1, label: "Cao nhất" },  
    { value: 2, label: "Cao" }, 
    { value: 3, label: "Bình thường" },
    { value: 4, label: "Thấp" },     
    { value: 5, label: "Thấp nhất" }, 
  ];

  const onSubmit = async (values: any) => {
    setLoading(true);
    if (id) {
      try {
        await ticketServices.update(id, values);
        toast.success("Cập nhật thành công");
        await mutate();
        await onClose(true);
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
    } else {
      try {
        values.code = '--';
        await ticketServices.create(values);
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
          {({ handleSubmit, values, validateForm, setFieldValue }) => (
            <Form noValidate onSubmit={handleSubmit} onKeyPress={(ev) => { ev.stopPropagation(); }}>
              <Modal.Header onClose={onClose}>{computedTitle(id, state?.editMode, titleTable)}</Modal.Header>
              <Modal.Body nameClass="grid-cols-12 body-step-0">

                <div className='col-span-8'>
                  <TanetSelect
                    label='Dự án'
                    required={true}
                    view={id ? true : state?.viewMode}
                    id='projectId'
                    name='projectId'
                    options={dataProjects}
                  />
                </div>
                <div className='col-span-4'>
                  <TanetSelect
                    label='Mức độ ưu tiên'
                    required={true}
                    view={state?.viewMode}
                    id='priority'
                    name='priority'
                    options={dataPriority}
                    isMulti={false}
                  />
                </div>
                <div className='col-span-12'>
                  <TanetInput
                    label='Tiêu đề'
                    required={true}
                    view={state?.viewMode}
                    id='summary'
                    name='summary'
                  />
                </div>
                <div className='col-span-12'>
                  <TanetTextArea
                    label='Mô tả'
                    rows={3}
                    required={false}
                    view={state?.viewMode}
                    id='description'
                    name='description'
                  />
                </div>
                <div className='col-span-12'>
                  <FileAttach
                    action={action}
                    nameAttach='attachment'
                    displayImage={true}
                    fileType='fileAll'
                    maxFiles={5}
                    required={false}
                    label="Đính kèm"
                  />
                </div>
                <input type="hidden" name="status" />
              </Modal.Body>
              <Modal.Footer onClose={onClose}>
                {!state?.viewMode ? (
                  <>
                    <button
                      data-modal-hide="large-modal"
                      type="button"
                      onClick={() => {
                        validateForm().then(errors => {
                          if (Object.keys(errors).length === 0) {
                            values.status = TicketStatusEnum.ChuaGui;
                            onSubmit(values);
                          }
                        });
                      }}
                      className="footer-step-save-0 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Lưu
                    </button>
                    <button
                      data-modal-hide="large-modal"
                      type="button"
                      onClick={() => {
                        validateForm().then(errors => {
                          if (Object.keys(errors).length === 0) {
                            values.status = TicketStatusEnum.DaGuiVaChuaXuLy;
                            onSubmit(values);
                          }
                        });
                      }}
                      className="footer-step-save-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Lưu & gửi
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
