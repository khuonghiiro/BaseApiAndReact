"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form, FormikProps } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelect, TanetCheckbox } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, number, object, ref, string } from "yup";
import { menuManagerServices } from "../services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
export default function MenuManagerForm({
  show,
  action,
  id,
  onClose,
}: IFormProps) {
  const defaultMenu = {
    title: "",
    url: "",
    stt: 1,
    parentId: null,
    groups: "",
    isShow: true,
    isBlank: false,
    groupIds: [],
    groupTitles: [],
  };
  const schema = object({
    title: string().trim().required("Tên menu không được để trống"),
    url: string().trim().required("Đường dẫn không được để trống"),
    stt: string().trim().required("Không đúng định dạng"),
  });
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const { data, mutate } = menuManagerServices.GetMenuById(id!);
  const { data: groups } = menuManagerServices.GetAllGroups();
  const { data: parents } = menuManagerServices.GetMenuCha();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: any) => {
    let groups = "";
    if (values.groupIds) {
      groups += ",";
      for (let i = 0; i < values.groupIds.length; i++) {
        groups += i === 0 ? `${values.groupIds[i]}` : `,${values.groupIds[i]}`;
      }
      groups += ",";
    }
    values.groups = groups;
    setLoading(true);
    if (id) {
      try {
        await menuManagerServices.update(id, values);
        toast.success("Cập nhật thành công");
        await mutate();
        await onClose(true);
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
    } else {
      try {
        await menuManagerServices.create(values);
        toast.success("Thêm thành công");
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
          initialValues={data ? data : defaultMenu}
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
              <Modal.Header onClose={onClose}>
                {computedTitle(id, state?.editMode)}
              </Modal.Header>
              <Modal.Body nameClass="grid-cols-2">
                <div className="col-span-2">
                  <TanetInput
                    label="Tên menu"
                    required={true}
                    view={state?.viewMode}
                    id="title"
                    name="title"
                  />
                </div>
                <div className="">
                  <TanetInput
                    label="Đường dẫn"
                    view={state?.viewMode}
                    id="url"
                    required={true}
                    name="url"
                  />
                </div>
                <div className="">
                  <TanetInput
                    label="STT"
                    view={state?.viewMode}
                    type="number"
                    id="stt"
                    name="stt"
                  />
                </div>
                <div className="">
                  <TanetSelect
                    label="Menu cha"
                    name="parentId"
                    view={state?.viewMode}
                    options={parents}
                  />
                </div>
                <div className="">
                  <TanetInput
                    label="Icon"
                    view={state?.viewMode}
                    type="number"
                    id="icon"
                    name="icon"
                  />
                </div>
                <div className="col-span-2">
                  <TanetSelect
                    label="Nhóm quyền"
                    name="groupIds"
                    view={state?.viewMode}
                    isMulti
                    options={groups}
                  />
                </div>
                <div className="">
                  <TanetCheckbox
                    view={state?.viewMode}
                    id="isShow"
                    name="isShow"
                  >
                    Hiển thị
                  </TanetCheckbox>
                </div>
                <div className="">
                  <TanetCheckbox
                    view={state?.viewMode}
                    id="isBlank"
                    name="isBlank"
                  >
                    Cửa sổ mới
                  </TanetCheckbox>
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
