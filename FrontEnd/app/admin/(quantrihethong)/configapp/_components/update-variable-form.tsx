"use client";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { useEffect, useState, useReducer, useRef } from "react";
import { array, number, object, string } from "yup";
import { configAppServices } from "../services";
import { formReducer, INITIAL_STATE_FORM } from "@/lib/common";
import { Button, Col, Row } from "antd";
import { EStepEvent } from "./step.model";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import React from "react";
import { TanetInput } from "@/lib";
import { MdDelete } from "react-icons/md";
export interface IVarProps {
  show: boolean;
  action: string;
  data: any | null;
  dataVar: any;
  onClose: (isRefresh: boolean) => void;
  date?: Date;
  onChange?: (vl: any[]) => void;
}
export default function UpdateVariableForm({
  show,
  action,
  data,
  dataVar,
  onClose,
  date,
  onChange
}: IVarProps) {

  const schema = object({
    // dataVars: array().nullable()
    //   .of(
    //     object().shape({
    //       key: string().required("Trường này bắt buộc").nullable(),
    //     }),
    //   ),
  });
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const [loading, setLoading] = useState(false);
  const [_date, setDate] = useState(date);
  const [dataInit, setDataInit] = useState(() => [...dataVar]);
  const formRef = useRef<HTMLFormElement>(null);
  const onSubmit = async (values: any) => {
    let dt = values.dataVars?.filter((x: any) => x.key != null && x.key != "");
    onChange && onChange(dt);
  };
  useEffect(() => {
    dispatch({ type: action });
  }, [action, data?.id]);
  useEffect(() => {
    if (date != _date) {
      setDataInit(() => [...dataVar])
      setDate(date);
    }
  }, [_date, dataVar, date]);
  const getMaxId = (array: any[]) => {
    if (array.length === 0) {
      return null; // Trả về null nếu mảng rỗng
    }
    return Math.max(...array.map((item) => item.id));
  };
  return (
    <>
      <Modal show={show} size="xl" loading={loading}>
        <Formik
          onSubmit={(values) => {
            onSubmit(values);
          }}
          validationSchema={schema}
          initialValues={{ dataVars: dataInit }}
          enableReinitialize={true}
        >
          {({ handleSubmit, values, setFieldValue }) => (
            <Form noValidate
              ref={formRef}
              onSubmit={(ev) => {
                handleSubmit; ev.stopPropagation(); return false;
              }}
              onKeyPress={(ev) => {
                ev.stopPropagation();
              }}>
              <Modal.Header onClose={onClose}>{data?.label}</Modal.Header>
              <Modal.Body nameClass="grid-cols-12">
                <div className='col-span-12'>
                  <Row className="mb-3">
                    <Col span={6}>
                      <label
                      >
                        Constant variables
                      </label>
                    </Col>
                    <Col span={18}>
                      {
                        values.dataVars?.filter((x: { isFix: boolean; }) => x.isFix == true)?.map((item: { key: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; }, index: React.Key | null | undefined) => {
                          return <span style={{ border: '1px solid #babac4', padding: 3, margin: 3 }} key={index}>{item.key}</span>
                        })}
                    </Col>
                  </Row>
                  {values.dataVars?.filter((x: { isFix: boolean; }) => x.isFix == false)?.map((item: any, index: number) => {
                    return <Row className="mb-3" key={'variable_' + item.id}>
                      <Col span={11}>
                        <TanetInput
                          required={false}
                          view={state?.viewMode}
                          id={`key${item.id}`}
                          name={`key${item.id}`}
                          type="text"
                          defaultValue={item.key}
                          placeholder="Key"
                          onChange={(e: any) => {
                            let dt = values.dataVars;
                            dt[index + 2].key = e.target.value;
                            setFieldValue('dataVars', dt);
                          }}
                        />
                      </Col>
                      <Col span={1} className="text-center">
                        =
                      </Col>
                      <Col span={11}>
                        <TanetInput
                          required={false}
                          view={state?.viewMode}
                          id={`value${item.id}`}
                          name={`value${item.id}`}
                          type="text"
                          defaultValue={item.value}
                          placeholder="Value"
                          onChange={(e: any) => {
                            let dt = values.dataVars;
                            dt[index + 2].value = e.target.value;
                            setFieldValue('dataVars', dt);
                          }}
                        />
                      </Col>
                      <Col span={1} className="text-center" style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18

                      }}>
                        <IoMdClose title="Xoá" onClick={() => {
                          let dt = values.dataVars;
                          dt = dt.filter((x: any) => x.id != item.id);
                          setFieldValue('dataVars', dt);
                        }} />
                      </Col>
                    </Row>
                  })}

                  <Row className="mb-3">
                    <Col span={24}>
                      <Button onClick={() => {
                        let dt = values.dataVars;
                        const maxId = getMaxId(dt);
                        let obj = { key: '', value: '', isFix: false, id: ((maxId ?? 1) + 1) };
                        dt.push(obj);
                        setFieldValue('dataVars', dt);
                      }} type="dashed" block icon={<IoMdAdd />}>
                        Create
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Modal.Body>
              <Modal.Footer onClose={onClose}>
                {!state?.viewMode ? (
                  <>
                    <button
                      data-modal-hide="large-modal"
                      type="button"
                      onClick={(ev) => {
                        onSubmit(values);
                        ev.stopPropagation();
                        // formRef.current?.dispatchEvent(
                        //   new Event('submit', { cancelable: true, bubbles: true }),
                        // );
                      }}
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
      </Modal >
    </>
  );
}
