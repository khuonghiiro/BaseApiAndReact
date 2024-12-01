"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form, FormikProps } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelect, TanetCheckbox, TanetTextArea } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, number, object, ref, string } from "yup";
import { duLieuCrawlServices } from "../services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
import { MdClose, MdDelete } from "react-icons/md";
import React from "react";

export default function DuLieuCrawlForm({
  show,
  action,
  id,
  onClose,
}: IFormProps) {
  const ReactJson = React.lazy(() => import('react-json-view'));
  const defaultMenu = {
    bangCauHinhId: "",
    data: "",
  };
  const schema = object({
    bangCauHinhId: number().nullable().required("Trường này bắt buộc"),
    data: string().trim().required("Trường này bắt buộc"),

  });
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const { data, mutate } = duLieuCrawlServices.GetById(id!);
  const { data: dataBangCauHinhs } = duLieuCrawlServices.GetAllBangCauHinh();
  const [loading, setLoading] = useState(false);
  const content = data?.data ? JSON.parse(data?.data) : null;
  console.log('content', content);
  const onSubmit = async (values: any) => {

    try {
      values.listFields = JSON.stringify(values.listDataFields);
      setLoading(true);
      if (id) {
        try {
          await duLieuCrawlServices.update(id, values);
          toast.success("Cập nhật thành công");
          await mutate();
          await onClose(true);
        } catch (err: any) {
          toast.error("Cập nhật không thành công");
        }
      } else {
        try {
          await duLieuCrawlServices.create(values);
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
                <div className="col-span-12">
                  <TanetSelect
                    label="Bảng cấu hình"
                    name="bangCauHinhId"
                    view={state?.viewMode}
                    options={dataBangCauHinhs}
                    required={true}
                  />
                </div>

                {
                  !state?.viewMode && <div className="col-span-12">
                    <TanetTextArea
                      label="Dữ liệu"
                      view={state?.viewMode}
                      id="data"
                      required={true}
                      name="data"
                      rows={10}
                    />
                  </div>
                }
                {
                  state?.viewMode && <div className="col-span-12">
                    Dữ liệu<br />
                    {content && <ReactJson src={content} />}
                  </div>
                }
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
