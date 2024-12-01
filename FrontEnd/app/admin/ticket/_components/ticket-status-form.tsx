import { useEffect, useState, useReducer } from "react";
import { Formik, Form } from "formik";
import { Modal } from "@/shared/components/modal";
import { toast } from "react-toastify";
import { object, string, number, date } from "yup";
import {
  TanetSelect,
  TanetFormDate,
  TanetTextArea,
} from "@/lib";
import { ticketServices } from "../services";
import {
  formReducer,
  INITIAL_STATE_FORM,
} from "@/lib/common";
import { TicketStatusEnum } from "../ticket-status-enum";

interface DataDefault {
  assignedId: number | null;
  status: any;
  content: string;
  startDate: Date | null;
  endDate: Date | null;
  id: number | undefined;
}

export default function TicketStatusForm({
  show,
  status,
  data,
  onClose,
}: {
  show: boolean;
  status: number;
  data: any;
  onClose: (isRefresh: boolean) => void;
}) {
  const dataDefault: DataDefault = {
    assignedId: (data.status === TicketStatusEnum.ChoTiepNhanLai) ? data?.assignedId ?? null : null,
    status: status,
    content: "",
    startDate: (data.status === TicketStatusEnum.ChoTiepNhanLai) ? data?.startDate ?? null : null,
    endDate: (data.status === TicketStatusEnum.ChoTiepNhanLai) ? data?.endDate ?? null : null,
    id: data?.id,
  };
 
  const schema = object({
    assignedId: number().when("$status", {
      is: TicketStatusEnum.DangXuLy,
      then: schema => schema.required("Trường này không được để trống"),
      otherwise: schema => schema.nullable(),
    }),
    content: string().when("$status", {
      is: TicketStatusEnum.ChoTiepNhanLai,
      then: schema => schema.required("Trường này không được để trống"),
      otherwise: schema => schema.nullable(),
    }),
    startDate: date().when("$status", {
      is: TicketStatusEnum.DangXuLy,
      then: schema => schema.required("Trường này không được để trống"),
      otherwise: schema => schema.nullable(),
    }),
    endDate: date().when("$status", {
      is: TicketStatusEnum.DangXuLy,
      then: schema => schema.required("Trường này không được để trống"),
      otherwise: schema => schema.nullable(),
    }),
  }).test(
    "date-order",
    "Thời gian bắt đầu dự kiến phải nhỏ hơn thời gian kết thúc dự kiến",
    values => {
      const { startDate, endDate } = values;
      return !startDate || !endDate || startDate <= endDate;
    }
  );

  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const [dataUserDepart, setDataUserDepart] = useState([]);
  // const { data: dataUserDepart } = ticketServices.GetAllUsers(data?.project?.userIds);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data?.project?.userIds) {
      const fetchData = async () => {
        try {
          const response = await ticketServices.GetAllUserInDepartments(data.project.userIds);
          setDataUserDepart(response.data);
        } catch (err) {
          toast.error("Lỗi khi tải dữ liệu người dùng");
        }
      };
      fetchData();
    }
  }, [data]);


  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (values.id) {
        await ticketServices.updateTicketStatus(values);
        toast.success("Cập nhật thành công");
        await onClose(true);
      }
    } catch (err) {
      toast.error("Cập nhật không thành công");
    }
    setLoading(false);
  };

  useEffect(() => { }, [data.id, status]);

  return (
    <Modal show={show} size="xl" loading={loading}>
      <Formik
        initialValues={dataDefault}
        validationSchema={schema}
        onSubmit={onSubmit}
        enableReinitialize
        context={{ status }} // Truyền trạng thái vào context
      >
        {({ handleSubmit, values }) => (
          <Form
            noValidate
            onSubmit={handleSubmit}
            onKeyPress={(ev) => {
              ev.stopPropagation();
            }}
          >
            <Modal.Header onClose={onClose}>
              {status === TicketStatusEnum.DangXuLy
                ? `Yêu cầu chấp nhận ${data.code}`
                : `Yêu cầu từ chối ${data.code}`}
            </Modal.Header>
            <Modal.Body nameClass="grid-cols-12 body-request-step">
              {status === TicketStatusEnum.DangXuLy ? (
                <>
                  <div className="col-span-12">
                    <TanetSelect
                      label="Người được giao xử lý"
                      required
                      view={false}
                      id="assignedId"
                      name="assignedId"
                      options={dataUserDepart}
                      isMulti={false}
                    />
                  </div>
                  <div className="col-span-6">
                    <TanetFormDate
                      label="Thời gian bắt đầu dự kiến"
                      required
                      view={state?.viewMode}
                      dateFormat="dd/MM/yyyy"
                      id="startDate"
                      name="startDate"
                    />
                  </div>
                  <div className="col-span-6">
                    <TanetFormDate
                      label="Thời gian kết thúc dự kiến"
                      required
                      view={state?.viewMode}
                      dateFormat="dd/MM/yyyy"
                      id="endDate"
                      name="endDate"
                    />
                  </div>
                </>
              ) : (
                <div className="col-span-12">
                  <TanetTextArea
                    label="Lý do mở lại"
                    rows={3}
                    required
                    view={state?.viewMode}
                    id="content"
                    name="content"
                  />
                </div>
              )}
            </Modal.Body>
            <Modal.Footer onClose={onClose}>
              {!state?.viewMode && (
                <button
                  data-modal-hide="large-modal"
                  type="submit"
                  className="submit-request-step text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Lưu
                </button>
              )}
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
