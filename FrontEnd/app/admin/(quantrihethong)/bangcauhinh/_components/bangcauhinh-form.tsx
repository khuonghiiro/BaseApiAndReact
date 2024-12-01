"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetTextArea, TanetFieldJson, TFieldItem, EDataType } from "@/lib";
import { useEffect, useState, useReducer, useMemo } from "react";
import { array, object, string } from "yup";
import { bangCauHinhServices } from "../services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
import { MdClose } from "react-icons/md";
export default function BangCauHinhForm({
  show,
  action,
  id,
  onClose,
}: IFormProps) {
  const defaultMenu = {
    title: "",
    urlDomain: "",
    cronTab: "",
    listFields: "",
    urlListData: "",
    desctiption: "",
    listDataFields: [],
  };
  const schema = object({
    title: string().trim().required("Trường này bắt buộc"),
    urlDomain: string().trim().required("Trường này bắt buộc"),
    urlListData: string().trim().required("Trường này bắt buộc"),
    listDataFields: array().of(
      object({
        name: string().trim().required("Trường này là bắt buộc"),
        xpath: string().trim().required("Trường này là bắt buộc"),
      })
    ),
  });
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const { data, mutate } = bangCauHinhServices.GetById(id!);

  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: any) => {
    try {
      values.listFields = JSON.stringify(values.listDataFields);
      setLoading(true);
      if (id) {
        try {
          await bangCauHinhServices.update(id, values);
          toast.success("Cập nhật thành công");
          await mutate();
          await onClose(true);
        } catch (err: any) {
          toast.error("Cập nhật không thành công");
        }
      } else {
        try {
          await bangCauHinhServices.create(values);
          toast.success("Thêm thành công");
          await onClose(true);
        } catch (err: any) {
          toast.error("Thêm mới không thành công");
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error serializing object: ", values.listDataFields);
      throw error;
    }
  };
  useEffect(() => {
    dispatch({ type: action });
  }, [action, id]);

  const fields = useMemo<TFieldItem[]>(
    () => [
      {
        name: 'name',
        label: 'Tên trường',
        type: EDataType.STRING,
        width: 150,
        required: true,

      },
      {
        name: 'description',
        label: 'Mô tả',
        type: EDataType.STRING,
        width: 180,
        required: true,

      },
      {
        name: 'dataType',
        label: 'Kiểu dữ liệu',
        type: EDataType.SELECT,
        width: 180,
        required: true,
        option: [{ value: 1, label: 'int' }, { value: 2, label: 'string' }, { value: 3, label: 'datetime' }]
      },
      {
        name: 'xpath',
        label: 'XPath',
        type: EDataType.STRING,
        width: 300,
        required: true
      },
    ],
    [],
  );
  return (
    <>
      <Modal show={show} size="xl" loading={loading}>
        <Formik
          onSubmit={(values) => {
            onSubmit(values);
          }}
          validationSchema={schema}
          initialValues={data ? data : defaultMenu}
          enableReinitialize={true}
        >
          {({ handleSubmit, values, setFieldValue }) => (
            <Form
              noValidate
              onSubmit={handleSubmit}
              onKeyPress={(ev) => {
                ev.stopPropagation();
              }}
            >
              <Modal.Header onClose={onClose}>
                {computedTitle(id, state?.editMode)}
              </Modal.Header>
              <Modal.Body nameClass="grid-cols-12">
                <div className="col-span-6">
                  <TanetInput
                    label="Tên bảng"
                    required={true}
                    view={state?.viewMode}
                    id="title"
                    name="title"
                  />
                </div>
                <div className="col-span-6">
                  <TanetInput
                    label="Lịch chạy"
                    required={true}
                    view={state?.viewMode}
                    id="cronTab"
                    name="cronTab"
                  />
                </div>
                <div className="col-span-12">
                  <TanetInput
                    label="Đường dẫn domain"
                    required={true}
                    view={state?.viewMode}
                    id="urlDomain"
                    name="urlDomain"
                  />
                </div>
                <div className="col-span-12">
                  <TanetInput
                    label="Đường dẫn danh sách dữ liệu"
                    required={true}
                    view={state?.viewMode}
                    id="urlListData"
                    name="urlListData"
                  />
                </div>
                <div className="col-span-12">
                  <TanetTextArea
                    label="Mô tả"
                    view={state?.viewMode}
                    id="desctiption"
                    required={false}
                    name="desctiption"
                  />
                </div>
                <div className="col-span-12">
                  <TanetFieldJson label="Danh sách trường dữ liệu" fields={fields} view={state?.viewMode ?? false} name="listDataFields" />
                </div>

              </Modal.Body>
              <Modal.Footer onClose={onClose}>
                {!state?.viewMode ? (
                  <>
                    <button
                      data-modal-hide="large-modal"
                      type="submit"
                      className="btn-submit"
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
