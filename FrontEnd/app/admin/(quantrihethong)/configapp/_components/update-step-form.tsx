"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelectTreeCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor, UploadFile } from "@/lib";
import { useEffect, useState, useReducer, useRef } from "react";
import { array, number, object, ref, string, date } from "yup";
import { configAppServices } from "../services";
import { formReducer, INITIAL_STATE_FORM, computedTitle, formatFullDateTime } from "@/lib/common";
import { Button, Col, Collapse, CollapseProps, Dropdown, Radio, RadioChangeEvent, Row, Slider, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { EStepActionExcel, EStepAppendMode, EStepContentType, EStepEvent, EStepInputType, EStepLoopType, EStepMethod, EStepResponseType, EStepSelectBy, EStepSelectWriteMode, EStepSelectorTypeWriteFile, EStepStorageExcel, EStepWaitForNavigation } from "./step.model";
import React from "react";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { DropDownVariable } from "./DropDownVariable";
import { ChooseFile } from "./ChooseFile";

export interface IStepProps {
  show: boolean;
  action: string;
  data: any | null;
  onClose: (isRefresh: boolean) => void;
  dataVar: any[];
  onChange?: (vl: any) => void;
  onDelete?: () => void;
}
export default function UpdateFormStepForm({
  show,
  action,
  data,
  onClose,
  dataVar,
  onChange,
  onDelete,
}: IStepProps) {
  const schema = object({
    sleepTime: string().nullable().required('Trường này không được để trống'),
    timeOut: string().nullable().required('Trường này không được để trống'),
    waitTime: string().when('value', {
      is: (val: any) => val == EStepEvent.NewTab || val == EStepEvent.OpenUrl,
      then: (schema) =>
        schema.required('Trường này không được để trống').nullable(),
      otherwise: (schema) => schema.nullable(),
    }),
    tabNumber: string().when(['value', 'isCurrentTab'], {
      is: (val: any, isCurrentTab: boolean) => val == EStepEvent.ActivateTab || (val == EStepEvent.CloseTab && !isCurrentTab),
      then: (schema) =>
        schema.required('Trường này không được để trống').nullable(),
      otherwise: (schema) => schema.nullable(),
    }),
    clickCount: string().when(['value', 'selectBy'], {
      is: (val: any, selectBy: any) => (val == EStepEvent.Click && selectBy),
      then: (schema) =>
        schema.required('Trường này không được để trống').nullable(),
      otherwise: (schema) => schema.nullable(),
    }),
    timeOutMouse: string().when(['value', 'selectBy', 'selectorType'], {
      is: (val: any, selectBy: any, selectorType: any) => ((val == EStepEvent.Click || val == EStepEvent.PressAndHold) && selectBy)
        || (val == EStepEvent.Scroll && selectorType),
      then: (schema) =>
        schema.required('Trường này không được để trống').nullable(),
      otherwise: (schema) => schema.nullable(),
    }),
    coordinateX: string().when(['value', 'selectBy', 'scollType'], {
      is: (val: any, selectBy: any, scollType: any) => (((val == EStepEvent.Click || val == EStepEvent.PressAndHold) && selectBy == EStepSelectBy.Coordinates)
        || val == EStepEvent.MouseMovement
        || (val == EStepEvent.Scroll && scollType == EStepSelectBy.Coordinates)),
      then: (schema) =>
        schema.required('Trường này không được để trống').nullable(),
      otherwise: (schema) => schema.nullable(),
    }),
    coordinateY: string().when(['value', 'selectBy'], {
      is: (val: any, selectBy: any, scollType: any) => (((val == EStepEvent.Click || val == EStepEvent.PressAndHold) && selectBy == EStepSelectBy.Coordinates)
        || val == EStepEvent.MouseMovement
        || (val == EStepEvent.Scroll && scollType == EStepSelectBy.Coordinates)),
      then: (schema) =>
        schema.required('Trường này không được để trống').nullable(),
      otherwise: (schema) => schema.nullable(),
    }),
    timeHold: string().when(['value'], {
      is: (val: any) => (val == EStepEvent.PressAndHold),
      then: (schema) =>
        schema.nullable(),
      otherwise: (schema) => schema.nullable(),
    }),
    timeOutData: string().when(['value', 'selectorType'], {
      is: (val: any, selectorType: any) => ((val == EStepEvent.ElementExists) && selectorType)
        || (val == EStepEvent.Scroll && selectorType),
      then: (schema) =>
        schema.required('Trường này không được để trống').nullable(),
      otherwise: (schema) => schema.nullable(),
    }),

  });
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const { data: dataWaitForNavs } = configAppServices.getAllEnum("EStepWaitForNavigation");
  const { data: dataStepButtons } = configAppServices.getAllEnum("EStepButton");
  const { data: dataStepSelectBys } = configAppServices.getAllEnum("EStepSelectBy");
  const { data: dataStepSelectorTypes } = configAppServices.getAllEnum("EStepSelectorType");
  const { data: dataStepDirections } = configAppServices.getAllEnum("EStepDirection");
  const { data: dataTypeRandoms } = configAppServices.getAllEnum("EStepTypeRandom");
  const { data: dataFileTypes } = configAppServices.getAllEnum("EStepFileType");
  const { data: dataMethods } = configAppServices.getAllEnum("EStepMethod");
  const { data: dataResponseTypes } = configAppServices.getAllEnum("EStepResponseType");
  const { data: dataContentTypes } = configAppServices.getAllEnum("EStepContentType");
  const { data: dataInputTypes } = configAppServices.getAllEnum("EStepInputType");
  const { data: dataModes } = configAppServices.getAllEnum("EStepMode");
  const { data: dataSelectorTypeWriteFiles } = configAppServices.getAllEnum("EStepSelectorTypeWriteFile");
  const { data: dataSelectWriteModes } = configAppServices.getAllEnum("EStepSelectWriteMode");
  const { data: dataEStepAppendModes } = configAppServices.getAllEnum("EStepAppendMode");
  const { data: dataEStepOperatorVariables } = configAppServices.getAllEnum("EStepOperatorVariable");
  const { data: dataEStepLoopTypes } = configAppServices.getAllEnum("EStepLoopType");
  const { data: dataEStepOperators } = configAppServices.getAllEnum("EStepOperator");
  const { data: dataEStepActionExcels } = configAppServices.getAllEnum("EStepActionExcel");
  const { data: dataEStepStorageExcels } = configAppServices.getAllEnum("EStepStorageExcel");
  const { data: dataEStepTargets } = configAppServices.getAllEnum("EStepTarget");

  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const onSubmit = async (values: any) => {
    onChange && onChange(values);
  };
  useEffect(() => {
    dispatch({ type: action });
  }, [action, data?.id]);
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
          initialValues={data}
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
                  <Tabs defaultActiveKey="0">
                    <TabPane tab="Options" key={0}>
                      {(values.value == EStepEvent.NewTab || values.value == EStepEvent.OpenUrl) && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='Url'
                              required={false}
                              view={state?.viewMode}
                              id='urlTab'
                              name='urlTab'
                              placeholder="https://www.youtube.com/"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('urlTab', values.urlTab + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>
                        <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='Wait time (milliseconds) - Default is wait until page loaded'
                              required={true}
                              view={state?.viewMode}
                              id='waitTime'
                              name='waitTime'
                              type="text"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('waitTime', values.waitTime + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>
                        <Row className="mb-3">
                          <Col span={24}>
                            <label
                              className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                              Wait for navigation
                            </label>
                            <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("waitForNav", e.target.value)} value={values.waitForNav}>
                              {
                                dataWaitForNavs?.map((item: any, index: number) =>
                                  <Radio key={`waitForNav_` + index} value={item.value}>{item.label}</Radio>
                                )
                              }
                            </Radio.Group>
                          </Col>
                        </Row>
                      </React.Fragment>}

                      {values.value == EStepEvent.ActivateTab && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='Select tab number'
                              required={true}
                              view={state?.viewMode}
                              id='tabNumber'
                              name='tabNumber'
                              type="text"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('tabNumber', values.tabNumber + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>
                      </React.Fragment>}
                      {values.value == EStepEvent.CloseTab && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={24}>
                            <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("isCurrentTab", e.target.value)} value={values.isCurrentTab}>
                              <Radio value={true}>Current tab</Radio>
                              <Radio value={false}>Select tab</Radio>
                            </Radio.Group>
                          </Col>
                        </Row>
                        {
                          !values.isCurrentTab && <Row className="mb-3">
                            <Col span={24}>
                              <TanetInput
                                label='Select tab number'
                                required={true}
                                view={state?.viewMode}
                                id='tabNumber'
                                name='tabNumber'
                                type="text"
                              />
                            </Col>
                          </Row>
                        }

                      </React.Fragment>}
                      {values.value == EStepEvent.Click && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={24}>
                            <label
                              className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                              Button
                            </label>
                            <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("button", e.target.value)} value={values.button}>
                              {
                                dataStepButtons?.map((item: any, index: number) =>
                                  <Radio key={`button_` + index} value={item.value}>{item.label}</Radio>
                                )
                              }
                            </Radio.Group>
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Col span={24}>
                            <label
                              className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                              Select by
                            </label>
                            <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("selectBy", e.target.value)} value={values.selectBy}>
                              {
                                dataStepSelectBys?.map((item: any, index: number) =>
                                  <Radio key={`selectBy_` + index} value={item.value}>{item.label}</Radio>
                                )
                              }
                            </Radio.Group>
                          </Col>
                        </Row>
                        {values.selectBy == EStepSelectBy.Selector && <>
                          <Row className="mb-3">
                            <Col span={24}>
                              <label
                                className="block text-sm font-semibold leading-6 text-gray-900"
                              >
                                Selector type
                              </label>
                              <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("selectorType", e.target.value)} value={values.selectorType}>
                                {
                                  dataStepSelectorTypes?.map((item: any, index: number) =>
                                    <Radio key={`selectorType_` + index} value={item.value}>{item.label}</Radio>
                                  )
                                }
                              </Radio.Group>
                            </Col>
                          </Row>
                          {values.selectorType && <Row className="mb-3">
                            <Col span={state?.viewMode ? 24 : 22} className="">
                              <TanetInput
                                label='Selector'
                                required={false}
                                view={state?.viewMode}
                                id='selector'
                                name='selector'
                                type="text"
                                placeholder="Enter selector of element"
                              />
                            </Col>
                            {
                              !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <DropDownVariable items={dataVar}
                                  onChange={(key: any) => {
                                    setFieldValue('selector', values.selector + '${' + key + '}')
                                  }} />
                              </Col>
                            }
                          </Row>}
                        </>}
                        {values.selectBy == EStepSelectBy.Coordinates && <Row className="mb-3">

                          <Col span={state?.viewMode ? 12 : 10} className="p-2">
                            <TanetInput
                              label='X Coordinate'
                              required={false}
                              view={state?.viewMode}
                              id='coordinateX'
                              name='coordinateX'
                              type="text"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('coordinateX', values.coordinateX + '${' + key + '}')
                                }} />
                            </Col>
                          }
                          <Col span={state?.viewMode ? 12 : 10} className="p-2">
                            <TanetInput
                              label='Y Coordinate'
                              required={false}
                              view={state?.viewMode}
                              id='coordinateY'
                              name='coordinateY'
                              type="number"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('coordinateY', values.coordinateY + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>}

                        {values.selectBy && <Row className="mb-3">
                          <Col span={12} className="p-2">
                            <TanetInput
                              label='Click count'
                              required={false}
                              view={state?.viewMode}
                              id='clickCount'
                              name='clickCount'
                              type="number"
                            />
                          </Col>
                          <Col span={state?.viewMode ? 12 : 10} className="p-2">
                            <TanetInput
                              label='Timeout (seconds)'
                              required={false}
                              view={state?.viewMode}
                              id='timeOutMouse'
                              name='timeOutMouse'
                              type="text"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('timeOutMouse', values.timeOutMouse + '${' + key + '}')
                                }} />
                            </Col>
                          }

                        </Row>}
                      </React.Fragment>}
                      {values.value == EStepEvent.PressAndHold && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='Time holding mouse down before release (seconds)'
                              required={false}
                              view={state?.viewMode}
                              id='timeHold'
                              name='timeHold'
                              type="text"
                              placeholder="Default no holding"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('timeHold', values.timeHold + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>
                        <Row className="mb-3">
                          <Col span={24}>
                            <label
                              className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                              Button
                            </label>
                            <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("button", e.target.value)} value={values.button}>
                              {
                                dataStepButtons?.map((item: any, index: number) =>
                                  <Radio key={`button_` + index} value={item.value}>{item.label}</Radio>
                                )
                              }
                            </Radio.Group>
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Col span={24}>
                            <label
                              className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                              Select by
                            </label>
                            <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("selectBy", e.target.value)} value={values.selectBy}>
                              {
                                dataStepSelectBys?.map((item: any, index: number) =>
                                  <Radio key={`selectBy_` + index} value={item.value}>{item.label}</Radio>
                                )
                              }
                            </Radio.Group>
                          </Col>
                        </Row>
                        {values.selectBy == EStepSelectBy.Selector && <>
                          <Row className="mb-3">
                            <Col span={24}>
                              <label
                                className="block text-sm font-semibold leading-6 text-gray-900"
                              >
                                Selector type
                              </label>
                              <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("selectorType", e.target.value)} value={values.selectorType}>
                                {
                                  dataStepSelectorTypes?.map((item: any, index: number) =>
                                    <Radio key={`selectorType_` + index} value={item.value}>{item.label}</Radio>
                                  )
                                }
                              </Radio.Group>
                            </Col>
                          </Row>
                          {values.selectorType && <Row className="mb-3">
                            <Col span={state?.viewMode ? 24 : 22}>
                              <TanetInput
                                label='Selector'
                                required={false}
                                view={state?.viewMode}
                                id='selector'
                                name='selector'
                                type="text"
                                placeholder="Enter selector of element"
                              />
                            </Col>
                            {
                              !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <DropDownVariable items={dataVar}
                                  onChange={(key: any) => {
                                    setFieldValue('selector', values.selector + '${' + key + '}')
                                  }} />
                              </Col>
                            }
                          </Row>}
                        </>}
                        {values.selectBy == EStepSelectBy.Coordinates && <Row className="mb-3">

                          <Col span={state?.viewMode ? 12 : 10} className="p-2">
                            <TanetInput
                              label='X Coordinate'
                              required={false}
                              view={state?.viewMode}
                              id='coordinateX'
                              name='coordinateX'
                              type="text"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('coordinateX', values.coordinateX + '${' + key + '}')
                                }} />
                            </Col>
                          }
                          <Col span={state?.viewMode ? 12 : 10} className="p-2">
                            <TanetInput
                              label='Y Coordinate'
                              required={false}
                              view={state?.viewMode}
                              id='coordinateY'
                              name='coordinateY'
                              type="number"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('coordinateY', values.coordinateY + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>}

                        {values.selectBy && <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='Timeout (seconds)'
                              required={false}
                              view={state?.viewMode}
                              id='timeOutMouse'
                              name='timeOutMouse'
                              type="number"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('timeOutMouse', values.timeOutMouse + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>}
                      </React.Fragment>}
                      {values.value == EStepEvent.MouseMovement && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='X Coordinate'
                              required={false}
                              view={state?.viewMode}
                              id='coordinateX'
                              name='coordinateX'
                              type="text"
                            />
                          </Col>

                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('coordinateX', values.coordinateX + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>
                        <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='Y Coordinate'
                              required={false}
                              view={state?.viewMode}
                              id='coordinateY'
                              name='coordinateY'
                              type="text"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('coordinateY', values.coordinateY + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>
                      </React.Fragment>}
                      {values.value == EStepEvent.Scroll && <React.Fragment>

                        <Row className="mb-3">
                          <Col span={24}>
                            <label
                              className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                              Scroll type
                            </label>
                            <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("scrollType", e.target.value)} value={values.scrollType}>
                              {
                                dataStepSelectBys?.map((item: any, index: number) =>
                                  <Radio key={`scrollType_` + index} value={item.value}>{item.label}</Radio>
                                )
                              }
                            </Radio.Group>
                          </Col>
                        </Row>
                        {values.scrollType == EStepSelectBy.Selector && <>
                          <Row className="mb-3">
                            <Col span={24}>
                              <label
                                className="block text-sm font-semibold leading-6 text-gray-900"
                              >
                                Selector type
                              </label>
                              <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("selectorType", e.target.value)} value={values.selectorType}>
                                {
                                  dataStepSelectorTypes?.map((item: any, index: number) =>
                                    <Radio key={`selectorType_` + index} value={item.value}>{item.label}</Radio>
                                  )
                                }
                              </Radio.Group>
                            </Col>
                          </Row>
                          {values.selectorType && <Row className="mb-3">
                            <Col span={state?.viewMode ? 24 : 22}>
                              <TanetInput
                                label='Selector'
                                required={false}
                                view={state?.viewMode}
                                id='selector'
                                name='selector'
                                placeholder="Enter selector of element"
                                type="text"
                              />
                            </Col>
                            {
                              !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <DropDownVariable items={dataVar}
                                  onChange={(key: any) => {
                                    setFieldValue('selector', values.selector + '${' + key + '}')
                                  }} />
                              </Col>
                            }
                          </Row>}
                          {values.selectorType && <Row className="mb-3">
                            <Col span={state?.viewMode ? 24 : 22}>
                              <TanetInput
                                label='Timeout (seconds)'
                                required={false}
                                view={state?.viewMode}
                                id='timeOutMouse'
                                name='timeOutMouse'
                                type="number"
                              />
                            </Col>
                            {
                              !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <DropDownVariable items={dataVar}
                                  onChange={(key: any) => {
                                    setFieldValue('timeOutMouse', values.timeOutMouse + '${' + key + '}')
                                  }} />
                              </Col>
                            }
                          </Row>}
                        </>}
                        {values.scrollType == EStepSelectBy.Coordinates && <>
                          <Row className="mb-3">
                            <Col span={24}>
                              <label
                                className="block text-sm font-semibold leading-6 text-gray-900"
                              >
                                Direction
                              </label>
                              <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("direction", e.target.value)} value={values.direction}>
                                {
                                  dataStepDirections?.map((item: any, index: number) =>
                                    <Radio key={`direction_` + index} value={item.value}>{item.label}</Radio>
                                  )
                                }
                              </Radio.Group>
                            </Col>
                          </Row>

                          <Row className="mb-3">
                            <Col span={4} className="">
                              <label
                                className="block text-sm font-semibold leading-6 text-gray-900"
                              >
                                X Coordinate
                              </label>
                            </Col>
                            <Col span={state?.viewMode ? 20 : 18} className="">
                              <TanetInput
                                label=''
                                required={false}
                                view={state?.viewMode}
                                id='coordinateX'
                                name='coordinateX'
                                type="number"
                              />
                            </Col>
                            {
                              !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <DropDownVariable items={dataVar}
                                  onChange={(key: any) => {
                                    setFieldValue('coordinateX', values.coordinateX + '${' + key + '}')
                                  }} />
                              </Col>
                            }
                          </Row>
                          <Row className="mb-3">
                            <Col span={4} className="">
                              <label
                                className="block text-sm font-semibold leading-6 text-gray-900"
                              >
                                Y Coordinate
                              </label>
                            </Col>
                            <Col span={state?.viewMode ? 20 : 18} className="">
                              <TanetInput
                                label=''
                                required={false}
                                view={state?.viewMode}
                                id='coordinateY'
                                name='coordinateY'
                                type="number"
                              />
                            </Col>
                            {
                              !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <DropDownVariable items={dataVar}
                                  onChange={(key: any) => {
                                    setFieldValue('coordinateY', values.coordinateY + '${' + key + '}')
                                  }} />
                              </Col>
                            }
                          </Row>
                          <Row className="mb-3">
                            <Col span={24}>
                              <label
                                className="block text-sm font-semibold leading-6 text-gray-900"
                              >
                                Speed
                              </label>
                              <Slider min={0}
                                max={5}
                                step={0.5}
                                defaultValue={values.speed}
                                onChange={(vl) => setFieldValue("speed", vl)}
                              />
                            </Col>
                          </Row>
                        </>}

                      </React.Fragment>}
                      {/* KEYBOARD */}
                      {values.value == EStepEvent.TypeText && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={24}>
                            <label
                              className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                              Selector type (Optional)
                            </label>
                            <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("selectorType", e.target.value)} value={values.selectorType}>
                              {
                                dataStepSelectorTypes?.map((item: any, index: number) =>
                                  <Radio key={`selectorType_` + index} value={item.value}>{item.label}</Radio>
                                )
                              }
                            </Radio.Group>
                          </Col>
                        </Row>
                        {values.selectorType && <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='Selector'
                              required={false}
                              view={state?.viewMode}
                              id='selector'
                              name='selector'
                              placeholder="Enter selector of element"
                              type="text"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('selector', values.selector + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>}
                        <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetTextArea
                              label='Text'
                              required={false}
                              view={state?.viewMode}
                              id='text'
                              name='text'
                              placeholder="Enter text"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('text', values.text + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>
                        <Row className="mb-3">
                          <Col span={24}>
                            <TanetCheckbox
                              view={state?.viewMode}
                              id="isTypeHuman"
                              name="isTypeHuman"
                            >
                              Type as human
                            </TanetCheckbox>
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Col span={24}>
                            <label
                              className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                              Speed
                            </label>
                            <Slider min={0}
                              max={5}
                              step={0.5}
                              defaultValue={values.speed}
                              onChange={(vl) => setFieldValue("speed", vl)}
                            />
                          </Col>
                        </Row>

                      </React.Fragment>}

                      {/* DATA */}
                      {values.value == EStepEvent.ElementExists && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={24}>
                            <label
                              className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                              Selector type (Optional)
                            </label>
                            <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("selectorType", e.target.value)} value={values.selectorType}>
                              {
                                dataStepSelectorTypes?.map((item: any, index: number) =>
                                  <Radio key={`selectorType_` + index} value={item.value}>{item.label}</Radio>
                                )
                              }
                            </Radio.Group>
                          </Col>
                        </Row>
                        {values.selectorType && <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='Selector'
                              required={false}
                              view={state?.viewMode}
                              id='selector'
                              name='selector'
                              placeholder="Enter selector of element"
                              type="text"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('selector', values.selector + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>}
                        {values.selectorType && <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='Timeout (seconds)'
                              required={false}
                              view={state?.viewMode}
                              id='timeOutData'
                              name='timeOutData'
                              type="number"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('timeOutData', values.timeOutData + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>}
                      </React.Fragment>}
                      {values.value == EStepEvent.GetURL && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={24}>
                            <TanetSelect
                              id="outputVariable"
                              name="outputVariable"
                              options={dataVar?.map((x: any) => {
                                x.label = x.key;
                                x.value = x.id;
                                return x;
                              })}
                              required={false}
                              view={state?.viewMode}
                              label="Output Variables"
                            />
                          </Col>
                        </Row>

                      </React.Fragment>}
                      {(values.value == EStepEvent.GetText || values.value == EStepEvent.GetValue) && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={24}>
                            <label
                              className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                              Selector type
                            </label>
                            <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("selectorType", e.target.value)} value={values.selectorType}>
                              {
                                dataStepSelectorTypes?.map((item: any, index: number) =>
                                  <Radio key={`selectorType_` + index} value={item.value}>{item.label}</Radio>
                                )
                              }
                            </Radio.Group>
                          </Col>
                        </Row>
                        {values.selectorType && <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='Selector'
                              required={false}
                              view={state?.viewMode}
                              id='selector'
                              name='selector'
                              placeholder="Enter selector of element"
                              type="text"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('selector', values.selector + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>}
                        <Row className="mb-3">
                          <Col span={24}>
                            <TanetSelect
                              id="outputVariable"
                              name="outputVariable"
                              options={dataVar?.map((x: any) => {
                                x.label = x.key;
                                x.value = x.id;
                                return x;
                              })}
                              required={false}
                              view={state?.viewMode}
                              label="Output Variables"
                            />
                          </Col>
                        </Row>

                      </React.Fragment>}
                      {(values.value == EStepEvent.GetAttribute) && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='Attribute Name'
                              required={false}
                              view={state?.viewMode}
                              id='attributeName'
                              name='attributeName'
                              type="text"
                              placeholder="Enter attribute Name"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('attributeName', values.attributeName + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>
                        <Row className="mb-3">
                          <Col span={24}>
                            <label
                              className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                              Selector type
                            </label>
                            <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("selectorType", e.target.value)} value={values.selectorType}>
                              {
                                dataStepSelectorTypes?.map((item: any, index: number) =>
                                  <Radio key={`selectorType_` + index} value={item.value}>{item.label}</Radio>
                                )
                              }
                            </Radio.Group>
                          </Col>
                        </Row>
                        {values.selectorType && <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='Selector'
                              required={false}
                              view={state?.viewMode}
                              id='selector'
                              name='selector'
                              placeholder="Enter selector of element"
                              type="text"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('selector', values.selector + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>}
                        <Row className="mb-3">
                          <Col span={24}>
                            <TanetSelect
                              id="outputVariable"
                              name="outputVariable"
                              options={dataVar?.map((x: any) => {
                                x.label = x.key;
                                x.value = x.id;
                                return x;
                              })}
                              required={false}
                              view={state?.viewMode}
                              label="Output Variables"
                            />
                          </Col>
                        </Row>

                      </React.Fragment>}
                      {(values.value == EStepEvent.SelectDropdown) && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='Selector'
                              required={false}
                              view={state?.viewMode}
                              id='selector'
                              name='selector'
                              placeholder="Enter selector of element"
                              type="text"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('selector', values.selector + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>
                        <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='Option value'
                              required={false}
                              view={state?.viewMode}
                              id='optionValue'
                              name='optionValue'
                              type="text"
                              placeholder="Enter option value"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('optionValue', values.optionValue + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>
                      </React.Fragment>}
                      {(values.value == EStepEvent.Random) && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={24}>
                            <TanetSelect
                              id="language"
                              name="language"
                              options={[{ label: 'Việt Nam', value: 'vi' }, { label: 'English', value: 'en' }]}
                              required={false}
                              view={state?.viewMode}
                              label="Language"
                            />
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Col span={24}>
                            <TanetSelect
                              id="typeRandom"
                              name="typeRandom"
                              options={dataTypeRandoms}
                              required={false}
                              view={state?.viewMode}
                              label="Type random"
                            />
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Col span={24}>
                            <TanetSelect
                              id="outputVariable"
                              name="outputVariable"
                              options={dataVar?.map((x: any) => {
                                x.label = x.key;
                                x.value = x.id;
                                return x;
                              })}
                              required={false}
                              view={state?.viewMode}
                              label="Output Variables"
                            />
                          </Col>
                        </Row>
                      </React.Fragment>}
                      {(values.value == EStepEvent.FileUpload) && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={24}>
                            <label
                              className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                              Selector type
                            </label>
                            <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("selectorType", e.target.value)} value={values.selectorType}>
                              {
                                dataStepSelectorTypes?.map((item: any, index: number) =>
                                  <Radio key={`selectorType_` + index} value={item.value}>{item.label}</Radio>
                                )
                              }
                            </Radio.Group>
                          </Col>
                        </Row>
                        {values.selectorType && <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='Selector'
                              required={false}
                              view={state?.viewMode}
                              id='selector'
                              name='selector'
                              placeholder="Enter selector of element"
                              type="text"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('selector', values.selector + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>}
                        <Row className="mb-3">
                          <Col span={24}>
                            <label
                              className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                              File type
                            </label>
                            <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("fileType", e.target.value)} value={values.fileType}>
                              {
                                dataFileTypes?.map((item: any, index: number) =>
                                  <Radio key={`fileType_` + index} value={item.value}>{item.label}</Radio>
                                )
                              }
                            </Radio.Group>
                          </Col>
                        </Row>
                        {values.fileType && <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='File path'
                              required={false}
                              view={state?.viewMode}
                              id='filePath'
                              name='filePath'
                              type="text"
                              placeholder=""
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('filePath', values.filePath + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>}
                        <Row className="mb-3">
                          <Col span={24}>
                            <TanetCheckbox
                              view={state?.viewMode}
                              id="isClickToUpload"
                              name="isClickToUpload"
                            >
                              Click to upload
                            </TanetCheckbox>
                          </Col>
                        </Row>
                      </React.Fragment>}
                      {(values.value == EStepEvent.HTTP) && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={24}>
                            <label
                              className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                              Request method
                            </label>
                            <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("requestMethod", e.target.value)} value={values.requestMethod}>
                              {
                                dataMethods?.map((item: any, index: number) =>
                                  <Radio key={`requestMethod_` + index} value={item.value}>{item.label}</Radio>
                                )
                              }
                            </Radio.Group>
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='URL'
                              required={false}
                              view={state?.viewMode}
                              id='url'
                              name='url'
                              type="text"
                              placeholder="Enter url"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('url', values.url + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>
                        <Row className="mb-3">
                          <Col span={24}>
                            <Collapse defaultActiveKey={['1']} bordered={false} items={[
                              {
                                key: '1',
                                label: 'Headers',
                                children: <React.Fragment>
                                  {values.headers?.map((item: any, index: number) => {
                                    return <Row className="mb-3" key={'headers_' + item.id}>
                                      <Col span={11}>
                                        <TanetInput
                                          required={false}
                                          view={state?.viewMode}
                                          id={`name${item.id}`}
                                          name={`name${item.id}`}
                                          type="text"
                                          defaultValue={item.name}
                                          placeholder="Name"
                                          onChange={(e: any) => {
                                            let dt = values.headers;
                                            dt[index].name = e.target.value;
                                            setFieldValue('headers', dt);
                                          }}
                                        />
                                      </Col>
                                      <Col span={1} className="text-center">
                                        =
                                      </Col>

                                      <Col span={state?.viewMode ? 11 : 9}>
                                        <TanetInput
                                          required={false}
                                          view={state?.viewMode}
                                          id={`value${item.id}`}
                                          name={`value${item.id}`}
                                          type="text"
                                          defaultValue={item.value}
                                          placeholder="Value"
                                          onChange={(e: any) => {
                                            let dt = values.headers;
                                            dt[index].value = e.target.value;
                                            setFieldValue('headers', dt);
                                          }}
                                        />
                                      </Col>
                                      {
                                        !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                          <DropDownVariable items={dataVar}
                                            onChange={(key: any) => {
                                              let dt = values.headers;
                                              dt[index].value = (item.value ?? '') + '${' + key + '}';
                                              setFieldValue('headers', dt);
                                            }} />
                                        </Col>
                                      }
                                      <Col span={1} className="text-center" style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18

                                      }}>
                                        <IoMdClose title="Xoá" onClick={() => {
                                          let dt = values.headers;
                                          dt = dt.filter((x: any) => x.id != item.id);
                                          setFieldValue('headers', dt);
                                        }} />
                                      </Col>
                                    </Row>
                                  })}

                                  <Row className="mb-3">
                                    <Col span={24}>
                                      <Button onClick={() => {
                                        let dt = values.headers;
                                        const maxId = getMaxId(dt);
                                        let obj = { name: '', value: '', id: ((maxId ?? 1) + 1) };
                                        dt.push(obj);
                                        setFieldValue('headers', dt);
                                      }} type="dashed" block icon={<IoMdAdd />}>
                                        Create
                                      </Button>
                                    </Col>
                                  </Row>
                                </React.Fragment>,
                              },
                              {
                                key: '2',
                                label: 'Params',
                                children: <React.Fragment>
                                  {values.params?.map((item: any, index: number) => {
                                    return <Row className="mb-3" key={'params_' + item.id}>
                                      <Col span={11}>
                                        <TanetInput
                                          required={false}
                                          view={state?.viewMode}
                                          id={`name${item.id}`}
                                          name={`name${item.id}`}
                                          type="text"
                                          defaultValue={item.name}
                                          placeholder="Name"
                                          onChange={(e: any) => {
                                            let dt = values.params;
                                            dt[index].name = e.target.value;
                                            setFieldValue('params', dt);
                                          }}
                                        />
                                      </Col>
                                      <Col span={1} className="text-center">
                                        =
                                      </Col>
                                      <Col span={state?.viewMode ? 11 : 9}>
                                        <TanetInput
                                          required={false}
                                          view={state?.viewMode}
                                          id={`value${item.id}`}
                                          name={`value${item.id}`}
                                          type="text"
                                          defaultValue={item.value}
                                          placeholder="Value"
                                          onChange={(e: any) => {
                                            let dt = values.params;
                                            dt[index].value = e.target.value;
                                            setFieldValue('params', dt);
                                          }}
                                        />
                                      </Col>
                                      {
                                        !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                          <DropDownVariable items={dataVar}
                                            onChange={(key: any) => {
                                              let dt = values.params;
                                              dt[index].value = (item.value ?? '') + '${' + key + '}';
                                              setFieldValue('params', dt);
                                            }} />
                                        </Col>
                                      }
                                      <Col span={1} className="text-center" style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18

                                      }}>
                                        <IoMdClose title="Xoá" onClick={() => {
                                          let dt = values.params;
                                          dt = dt.filter((x: any) => x.id != item.id);
                                          setFieldValue('params', dt);
                                        }} />
                                      </Col>
                                    </Row>
                                  })}

                                  <Row className="mb-3">
                                    <Col span={24}>
                                      <Button onClick={() => {
                                        let dt = values.params;
                                        const maxId = getMaxId(dt);
                                        let obj = { name: '', value: '', id: ((maxId ?? 1) + 1) };
                                        dt.push(obj);
                                        setFieldValue('params', dt);
                                      }} type="dashed" block icon={<IoMdAdd />}>
                                        Create
                                      </Button>
                                    </Col>
                                  </Row>
                                </React.Fragment>,
                              },
                              {
                                key: '3',
                                label: 'Cookies',
                                children: <React.Fragment>
                                  {values.cookies?.map((item: any, index: number) => {
                                    return <Row className="mb-3" key={'cookies_' + item.id}>
                                      <Col span={11}>
                                        <TanetInput
                                          required={false}
                                          view={state?.viewMode}
                                          id={`name${item.id}`}
                                          name={`name${item.id}`}
                                          type="text"
                                          defaultValue={item.name}
                                          placeholder="Name"
                                          onChange={(e: any) => {
                                            let dt = values.cookies;
                                            dt[index].name = e.target.value;
                                            setFieldValue('cookies', dt);
                                          }}
                                        />
                                      </Col>
                                      <Col span={1} className="text-center">
                                        =
                                      </Col>
                                      <Col span={state?.viewMode ? 11 : 9}>
                                        <TanetInput
                                          required={false}
                                          view={state?.viewMode}
                                          id={`value${item.id}`}
                                          name={`value${item.id}`}
                                          type="text"
                                          defaultValue={item.value}
                                          placeholder="Value"
                                          onChange={(e: any) => {
                                            let dt = values.cookies;
                                            dt[index].value = e.target.value;
                                            setFieldValue('cookies', dt);
                                          }}
                                        />
                                      </Col>
                                      {
                                        !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                          <DropDownVariable items={dataVar}
                                            onChange={(key: any) => {
                                              let dt = values.cookies;
                                              dt[index].value = (item.value ?? '') + '${' + key + '}';
                                              setFieldValue('cookies', dt);
                                            }} />
                                        </Col>
                                      }

                                      <Col span={1} className="text-center" style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18

                                      }}>
                                        <IoMdClose title="Xoá" onClick={() => {
                                          let dt = values.cookies;
                                          dt = dt.filter((x: any) => x.id != item.id);
                                          setFieldValue('cookies', dt);
                                        }} />
                                      </Col>
                                    </Row>
                                  })}

                                  <Row className="mb-3">
                                    <Col span={24}>
                                      <Button onClick={() => {
                                        let dt = values.cookies;
                                        const maxId = getMaxId(dt);
                                        let obj = { name: '', value: '', id: ((maxId ?? 1) + 1) };
                                        dt.push(obj);
                                        setFieldValue('cookies', dt);
                                      }} type="dashed" block icon={<IoMdAdd />}>
                                        Create
                                      </Button>
                                    </Col>
                                  </Row>
                                </React.Fragment>,
                              },
                            ]} />
                          </Col>
                        </Row>
                        {values.requestMethod != EStepMethod.GET && <React.Fragment>
                          <Row className="mb-3">
                            <Col span={24}>
                              <TanetSelect
                                id="contentType"
                                name="contentType"
                                options={dataContentTypes}
                                required={false}
                                view={state?.viewMode}
                                label="Content type"
                              />
                            </Col>
                          </Row>
                          {(values.contentType == EStepContentType.JSON || values.contentType == EStepContentType.Text) && <Row className="mb-3">
                            <Col span={24}>
                              <TanetTextArea
                                label='Body'
                                required={false}
                                view={state?.viewMode}
                                id='body'
                                name='body'
                                placeholder=""
                                rows={5}
                              />
                            </Col>
                          </Row>}
                          {(values.contentType == EStepContentType.FormUrlEndcoded || values.contentType == EStepContentType.FormData) && <Row className="mb-3">
                            <Col span={24}>
                              <label
                                className="block text-sm font-semibold leading-6 text-gray-900"
                              >
                                Form Data
                              </label>
                              <React.Fragment>
                                {values.formDatas?.map((item: any, index: number) => {
                                  return <Row className="mb-3" key={'formDatas_' + item.id}>
                                    <Col span={11}>
                                      <TanetInput
                                        required={false}
                                        view={state?.viewMode}
                                        id={`name${item.id}`}
                                        name={`name${item.id}`}
                                        type="text"
                                        defaultValue={item.name}
                                        placeholder="Name"
                                        onChange={(e: any) => {
                                          let dt = values.formDatas;
                                          dt[index].name = e.target.value;
                                          setFieldValue('formDatas', dt);
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
                                          let dt = values.formDatas;
                                          dt[index].value = e.target.value;
                                          setFieldValue('formDatas', dt);
                                        }}
                                      />
                                    </Col>
                                    <Col span={1} className="text-center" style={{
                                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18

                                    }}>
                                      <IoMdClose title="Xoá" onClick={() => {
                                        let dt = values.formDatas;
                                        dt = dt.filter((x: any) => x.id != item.id);
                                        setFieldValue('formDatas', dt);
                                      }} />
                                    </Col>
                                  </Row>
                                })}

                                <Row className="mb-3">
                                  <Col span={24}>
                                    <Button onClick={() => {
                                      let dt = values.formDatas;
                                      const maxId = getMaxId(dt);
                                      let obj = { name: '', value: '', id: ((maxId ?? 1) + 1) };
                                      dt.push(obj);
                                      setFieldValue('formDatas', dt);
                                    }} type="dashed" block icon={<IoMdAdd />}>
                                      Create
                                    </Button>
                                  </Col>
                                </Row>
                              </React.Fragment>
                            </Col>
                          </Row>}
                        </React.Fragment>}
                        <Row className="mb-3">
                          <Col span={24}>
                            <label
                              className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                              Response type
                            </label>
                            <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("responseType", e.target.value)} value={values.responseType}>
                              {
                                dataResponseTypes?.map((item: any, index: number) =>
                                  <Radio key={`responseType_` + index} value={item.value}>{item.label}</Radio>
                                )
                              }
                            </Radio.Group>
                          </Col>
                        </Row>
                        {values.responseType == EStepResponseType.JSON &&
                          <Row className="mb-3">
                            <Col span={24}>
                              <label
                                className="block text-sm font-semibold leading-6 text-gray-900"
                              >
                                Response body mapping
                              </label>
                              <React.Fragment>
                                {values.responseBodyMappings?.map((item: any, index: number) => {
                                  return <Row className="mb-3" key={'responseBodyMappings_' + item.id}>
                                    <Col span={state?.viewMode ? 11 : 9}>
                                      <TanetInput
                                        required={false}
                                        view={state?.viewMode}
                                        id={`path${item.id}`}
                                        name={`path${item.id}`}
                                        type="text"
                                        defaultValue={item.path}
                                        placeholder="Path"
                                        onChange={(e: any) => {
                                          let dt = values.responseBodyMappings;
                                          dt[index].path = e.target.value;
                                          setFieldValue('responseBodyMappings', dt);
                                        }}
                                      />
                                    </Col>
                                    {
                                      !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <DropDownVariable items={dataVar}
                                          onChange={(key: any) => {
                                            let dt = values.responseBodyMappings;
                                            dt[index].path = (item.path ?? '') + '${' + key + '}';
                                            setFieldValue('responseBodyMappings', dt);
                                          }} />
                                      </Col>
                                    }
                                    <Col span={1} className="text-center">
                                      =
                                    </Col>
                                    <Col span={11}>
                                      <TanetSelect
                                        id={`value${item.id}`}
                                        name={`value${item.id}`}
                                        options={dataVar?.map((x: any) => {
                                          x.label = x.key;
                                          x.value = x.id;
                                          return x;
                                        })}
                                        required={false}
                                        view={state?.viewMode}
                                        label=""
                                        onChange={(e: any) => {
                                          let dt = values.responseBodyMappings;
                                          dt[index].value = e.target.value;
                                          setFieldValue('responseBodyMappings', dt);
                                        }}
                                      />
                                    </Col>
                                    <Col span={1} className="text-center" style={{
                                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18

                                    }}>
                                      <IoMdClose title="Xoá" onClick={() => {
                                        let dt = values.responseBodyMappings;
                                        dt = dt.filter((x: any) => x.id != item.id);
                                        setFieldValue('responseBodyMappings', dt);
                                      }} />
                                    </Col>
                                  </Row>
                                })}

                                <Row className="mb-3">
                                  <Col span={24}>
                                    <Button onClick={() => {
                                      let dt = values.responseBodyMappings;
                                      const maxId = getMaxId(dt);
                                      let obj = { name: '', value: '', id: ((maxId ?? 1) + 1) };
                                      dt.push(obj);
                                      setFieldValue('responseBodyMappings', dt);
                                    }} type="dashed" block icon={<IoMdAdd />}>
                                      Create
                                    </Button>
                                  </Col>
                                </Row>
                              </React.Fragment>
                            </Col>
                          </Row>}
                        {values.responseType == EStepResponseType.RAW &&
                          <Row className="mb-3">
                            <Col span={state?.viewMode ? 24 : 22}>
                              <TanetInput
                                label="Output raw data"
                                required={false}
                                view={state?.viewMode}
                                id="outputRawData"
                                name="outputRawData"
                                type="text"
                                placeholder=""
                              />
                            </Col>
                            {
                              !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <DropDownVariable items={dataVar}
                                  onChange={(key: any) => {
                                    setFieldValue('outputRawData', values.outputRawData + '${' + key + '}')
                                  }} />
                              </Col>
                            }
                          </Row>}
                      </React.Fragment>}
                      {(values.value == EStepEvent.ReadFile) && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={24}>
                            <label
                              className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                              Input type
                            </label>
                            <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("inputType", e.target.value)} value={values.inputType}>
                              {
                                dataInputTypes?.map((item: any, index: number) =>
                                  <Radio key={`inputType_` + index} value={item.value}>{item.label}</Radio>
                                )
                              }
                            </Radio.Group>
                          </Col>
                        </Row>
                        {values.inputType == EStepInputType.File && <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='File path'
                              required={false}
                              view={state?.viewMode}
                              id='filePath'
                              name='filePath'
                              type="text"
                              placeholder=""
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('filePath', values.filePath + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>}
                        {values.inputType == EStepInputType.Variable && <Row className="mb-3">
                          <Col span={24}>
                            <TanetSelect
                              id="variable"
                              name="variable"
                              options={dataVar?.map((x: any) => {
                                x.label = x.key;
                                x.value = x.id;
                                return x;
                              })}
                              required={false}
                              view={state?.viewMode}
                              label="Variable"
                            />
                          </Col>
                        </Row>}
                        <Row className="mb-3">
                          <Col span={24}>
                            <TanetSelect
                              id="mode"
                              name="mode"
                              options={dataModes}
                              required={false}
                              view={state?.viewMode}
                              label="Mode"
                            />
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Col span={24}>
                            <TanetSelect
                              id="outputVariable"
                              name="outputVariable"
                              options={dataVar?.map((x: any) => {
                                x.label = x.key;
                                x.value = x.id;
                                return x;
                              })}
                              required={false}
                              view={state?.viewMode}
                              label="Output Variables"
                            />
                          </Col>
                        </Row>
                      </React.Fragment>}
                      {(values.value == EStepEvent.WriteFile) && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='File path'
                              required={false}
                              view={state?.viewMode}
                              id='filePath'
                              name='filePath'
                              type="text"
                              placeholder=""
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('filePath', values.filePath + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>
                        <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='Select input data from variable'
                              required={false}
                              view={state?.viewMode}
                              id='inputData'
                              name='inputData'
                              type="text"
                              placeholder="Enter input data"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('inputData', values.inputData + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>
                        <Row className="mb-3">
                          <Col span={24}>
                            <label
                              className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                              Selector type
                            </label>
                            <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("selectorType", e.target.value)} value={values.selectorType}>
                              {
                                dataSelectorTypeWriteFiles?.map((item: any, index: number) =>
                                  <Radio key={`selectorType_` + index} value={item.value}>{item.label}</Radio>
                                )
                              }
                            </Radio.Group>
                          </Col>
                        </Row>
                        {values.selectorType == EStepSelectorTypeWriteFile.CSV && <Row className="mb-3">
                          <Col span={24}>
                            <TanetInput
                              label='CSV delimeter'
                              required={false}
                              view={state?.viewMode}
                              id='csvDelimeter'
                              name='csvDelimeter'
                              type="text"
                              placeholder="Default comma (,)"
                            />
                          </Col>
                        </Row>}
                        {
                          values.selectorType && <Row className="mb-3">
                            <Col span={24}>
                              <label
                                className="block text-sm font-semibold leading-6 text-gray-900"
                              >
                                Selector write mode
                              </label>
                              <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("selectorWriteMode", e.target.value)} value={values.selectorWriteMode}>
                                {
                                  dataSelectWriteModes?.map((item: any, index: number) =>
                                    <Radio key={`selectorWriteMode_` + index} value={item.value}>{item.label}</Radio>
                                  )
                                }
                              </Radio.Group>
                            </Col>
                          </Row>
                        }
                        {values.selectorWriteMode == EStepSelectWriteMode.Append && values.selectorType == EStepSelectorTypeWriteFile.TXT && <Row className="mb-3">
                          <Col span={24}>
                            <label
                              className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                              Append mode
                            </label>
                            <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("appendMode", e.target.value)} value={values.appendMode}>
                              {
                                dataEStepAppendModes?.map((item: any, index: number) =>
                                  <Radio key={`appendMode_` + index} value={item.value}>{item.label}</Radio>
                                )
                              }
                            </Radio.Group>
                          </Col>
                        </Row>}
                        {values.selectorType == EStepSelectorTypeWriteFile.TXT && values.appendMode == EStepAppendMode.SameLine && <Row className="mb-3">
                          <Col span={24}>
                            <TanetInput
                              label='CSV delimeter'
                              required={false}
                              view={state?.viewMode}
                              id='csvDelimeter'
                              name='csvDelimeter'
                              type="text"
                              placeholder="Default comma (,)"
                            />
                          </Col>
                        </Row>}
                      </React.Fragment>}
                      {values.value == EStepEvent.Screenshot && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='File name'
                              required={false}
                              view={state?.viewMode}
                              id='fileName'
                              name='fileName'
                              type="text"
                              placeholder=""
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('fileName', values.fileName + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>
                        <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='Folder output'
                              required={false}
                              view={state?.viewMode}
                              id='folderOutput'
                              name='folderOutput'
                              type="text"
                              placeholder=""
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('folderOutput', values.folderOutput + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>
                      </React.Fragment>}
                      {values.value == EStepEvent.SetVariable && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={24}>
                            <TanetSelect
                              id="variable"
                              name="variable"
                              options={dataVar?.map((x: any) => {
                                x.label = x.key;
                                x.value = x.id;
                                return x;
                              })}
                              required={false}
                              view={state?.viewMode}
                              label="Select variable"
                            />
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Col span={24}>
                            <TanetSelect
                              id="operator"
                              name="operator"
                              options={dataEStepOperatorVariables}
                              required={false}
                              view={state?.viewMode}
                              label="Operator"
                            />
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='Variable or value'
                              required={false}
                              view={state?.viewMode}
                              id='variableOrValue'
                              name='variableOrValue'
                              type="text"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('variableOrValue', values.variableOrValue + '${' + key + '}')
                                }} />
                            </Col>
                          }

                        </Row>
                      </React.Fragment>}
                      {values.value == EStepEvent.Sleep && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='Seconds'
                              required={false}
                              view={state?.viewMode}
                              id='seconds'
                              name='seconds'
                              type="text"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('seconds', values.seconds + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>
                      </React.Fragment>}
                      {values.value == EStepEvent.If && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={24}>
                            <TanetSelect
                              id="variable"
                              name="variable"
                              options={dataVar?.map((x: any) => {
                                x.label = x.key;
                                x.value = x.id;
                                return x;
                              })}
                              required={false}
                              view={state?.viewMode}
                              label="Select left operand"
                            />
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Col span={24}>
                            <TanetSelect
                              id="operator"
                              name="operator"
                              options={dataEStepOperators}
                              required={false}
                              view={state?.viewMode}
                              label="Operator"
                            />
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='Select right operand'
                              required={false}
                              view={state?.viewMode}
                              id='variableOrValue'
                              name='variableOrValue'
                              type="text"
                              placeholder="Default is empty string"
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('variableOrValue', values.variableOrValue + '${' + key + '}')
                                }} />
                            </Col>
                          }

                        </Row>
                      </React.Fragment>}
                      {values.value == EStepEvent.Loop && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={24}>
                            <TanetSelect
                              id="loopType"
                              name="loopType"
                              options={dataEStepLoopTypes}
                              required={false}
                              view={state?.viewMode}
                              label="Loop type"
                            />
                          </Col>
                        </Row>
                        {values.loopType == EStepLoopType.For && <React.Fragment>
                          <Row className="mb-3">
                            <Col span={state?.viewMode ? 24 : 22}>
                              <TanetInput
                                label='For from value'
                                required={false}
                                view={state?.viewMode}
                                id='forFromValue'
                                name='forFromValue'
                                type="text"
                                placeholder="Enter number or insert variable"
                              />
                            </Col>
                            {
                              !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <DropDownVariable items={dataVar}
                                  onChange={(key: any) => {
                                    setFieldValue('forFromValue', values.forFromValue + '${' + key + '}')
                                  }} />
                              </Col>
                            }

                          </Row>
                          <Row className="mb-3">
                            <Col span={state?.viewMode ? 24 : 22}>
                              <TanetInput
                                label='For to value'
                                required={false}
                                view={state?.viewMode}
                                id='forToValue'
                                name='forToValue'
                                type="text"
                                placeholder="Enter number or insert variable"
                              />
                            </Col>
                            {
                              !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <DropDownVariable items={dataVar}
                                  onChange={(key: any) => {
                                    setFieldValue('forToValue', values.forToValue + '${' + key + '}')
                                  }} />
                              </Col>
                            }
                          </Row>
                        </React.Fragment>}
                        {values.loopType == EStepLoopType.While && <React.Fragment>
                          <Row className="mb-3">
                            <Col span={24}>
                              <TanetSelect
                                id="variable"
                                name="variable"
                                options={dataVar?.map((x: any) => {
                                  x.label = x.key;
                                  x.value = x.id;
                                  return x;
                                })}
                                required={false}
                                view={state?.viewMode}
                                label="Variable"
                              />
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col span={24}>
                              <TanetSelect
                                id="operator"
                                name="operator"
                                options={dataEStepOperators}
                                required={false}
                                view={state?.viewMode}
                                label="Operator"
                              />
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col span={state?.viewMode ? 24 : 22}>
                              <TanetInput
                                label='Variable or value'
                                required={false}
                                view={state?.viewMode}
                                id='variableOrValue'
                                name='variableOrValue'
                                type="text"
                                placeholder="Select right operand"
                              />
                            </Col>
                            {
                              !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <DropDownVariable items={dataVar}
                                  onChange={(key: any) => {
                                    setFieldValue('variableOrValue', values.variableOrValue + '${' + key + '}')
                                  }} />
                              </Col>
                            }

                          </Row>
                        </React.Fragment>}

                      </React.Fragment>}
                      {values.value == EStepEvent.Comment && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={24}>
                            <TanetTextArea
                              label=''
                              required={false}
                              view={state?.viewMode}
                              id='comment'
                              name='comment'
                              placeholder="Enter comment"
                              rows={5}
                            />
                          </Col>
                        </Row>
                      </React.Fragment>}
                      {values.value == EStepEvent.Spreadsheet && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={24}>
                            <label
                              className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                              Action
                            </label>
                            <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("action", e.target.value)} value={values.action}>
                              {
                                dataEStepActionExcels?.map((item: any, index: number) =>
                                  <Radio key={`action_` + index} value={item.value}>{item.label}</Radio>
                                )
                              }
                            </Radio.Group>
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Col span={state?.viewMode ? 24 : 22}>
                            <TanetInput
                              label='File path'
                              required={false}
                              view={state?.viewMode}
                              id='filePath'
                              name='filePath'
                              type="text"
                              placeholder=""
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('filePath', values.filePath + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>
                        <Row className="mb-3">
                          <Col span={state?.viewMode ? 12 : 10}>
                            <TanetInput
                              label='Range'
                              required={false}
                              view={state?.viewMode}
                              id='range'
                              name='range'
                              type="text"
                              placeholder=""
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('range', values.filePath + '${' + key + '}')
                                }} />
                            </Col>
                          }
                          <Col span={state?.viewMode ? 12 : 10}>
                            <TanetInput
                              label='Sheet Name'
                              required={false}
                              view={state?.viewMode}
                              id='sheetName'
                              name='sheetName'
                              type="text"
                              placeholder=""
                            />
                          </Col>
                          {
                            !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <DropDownVariable items={dataVar}
                                onChange={(key: any) => {
                                  setFieldValue('sheetName', values.filePath + '${' + key + '}')
                                }} />
                            </Col>
                          }
                        </Row>
                        <Row className="mb-3">
                          <Col span={24}>
                            <TanetCheckbox
                              view={state?.viewMode}
                              id="isFirstRowAsKey"
                              name="isFirstRowAsKey"
                            >
                              First rows as keys
                            </TanetCheckbox>
                          </Col>
                        </Row>
                        {
                          values.action == EStepActionExcel.Read && <>
                            <Row className="mb-3">
                              <Col span={24}>
                                <label
                                  className="block text-sm font-semibold leading-6 text-gray-900"
                                >
                                  Storage
                                </label>
                                <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("storage", e.target.value)} value={values.storage}>
                                  {
                                    dataEStepStorageExcels?.map((item: any, index: number) =>
                                      <Radio key={`storage_` + index} value={item.value}>{item.label}</Radio>
                                    )
                                  }
                                </Radio.Group>
                              </Col>

                            </Row>
                            {
                              values.storage == EStepStorageExcel.Variable && <>
                                {values.mapSpreadSheetData?.map((item: any, index: number) => {
                                  return <Row className="mb-3" key={'mapSpreadSheetData_' + item.id}>
                                    <Col span={11}>
                                      <TanetInput
                                        required={false}
                                        view={state?.viewMode}
                                        id={`path${item.id}`}
                                        name={`path${item.id}`}
                                        type="text"
                                        defaultValue={item.path}
                                        placeholder="Path"
                                        onChange={(e: any) => {
                                          let dt = values.mapSpreadSheetData;
                                          dt[index].path = e.target.value;
                                          setFieldValue('mapSpreadSheetData', dt);
                                        }}
                                      />
                                    </Col>
                                    <Col span={1} className="text-center">
                                      =
                                    </Col>
                                    <Col span={state?.viewMode ? 11 : 9}>
                                      <TanetInput
                                        required={false}
                                        view={state?.viewMode}
                                        id={`value${item.id}`}
                                        name={`value${item.id}`}
                                        type="text"
                                        defaultValue={item.value}
                                        placeholder=""
                                        onChange={(e: any) => {
                                          let dt = values.mapSpreadSheetData;
                                          dt[index].value = e.target.value;
                                          setFieldValue('mapSpreadSheetData', dt);
                                        }}
                                      />
                                    </Col>
                                    {
                                      !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <DropDownVariable items={dataVar}
                                          onChange={(key: any) => {
                                            let dt = values.mapSpreadSheetData;
                                            dt[index].value = (item.value ?? '') + '${' + key + '}';
                                            setFieldValue('mapSpreadSheetData', dt);
                                          }} />
                                      </Col>
                                    }
                                    <Col span={1} className="text-center" style={{
                                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18

                                    }}>
                                      <IoMdClose title="Xoá" onClick={() => {
                                        let dt = values.mapSpreadSheetData;
                                        dt = dt.filter((x: any) => x.id != item.id);
                                        setFieldValue('mapSpreadSheetData', dt);
                                      }} />
                                    </Col>
                                  </Row>
                                })}
                                <Row className="mb-3">
                                  <Col span={24}>
                                    <Button onClick={() => {
                                      let dt = values.mapSpreadSheetData;
                                      const maxId = getMaxId(dt);
                                      let obj = { name: '', value: '', id: ((maxId ?? 1) + 1) };
                                      dt.push(obj);
                                      setFieldValue('mapSpreadSheetData', dt);
                                    }} type="dashed" block icon={<IoMdAdd />}>
                                      Create
                                    </Button>
                                  </Col>
                                </Row>
                              </>
                            }
                            {
                              values.storage == EStepStorageExcel.Loop && <Row className="mb-3">
                                <Col span={state?.viewMode ? 24 : 22}>
                                  <TanetInput
                                    label='Ref key'
                                    required={false}
                                    view={state?.viewMode}
                                    id='refKey'
                                    name='refKey'
                                    type="text"
                                    placeholder=""
                                  />
                                </Col>
                                {
                                  !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <DropDownVariable items={dataVar}
                                      onChange={(key: any) => {
                                        setFieldValue('refKey', values.refKey + '${' + key + '}')
                                      }} />
                                  </Col>
                                }
                              </Row>
                            }
                          </>
                        }
                        {
                          values.action == EStepActionExcel.Write && <>
                            <Row className="mb-3">
                              <Col span={state?.viewMode ? 24 : 22}>
                                <TanetInput
                                  label='Input variable'
                                  required={false}
                                  view={state?.viewMode}
                                  id='inputVariable'
                                  name='inputVariable'
                                  type="text"
                                  placeholder=""
                                />
                              </Col>
                              {
                                !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                  <DropDownVariable items={dataVar}
                                    onChange={(key: any) => {
                                      setFieldValue('inputVariable', values.inputVariable + '${' + key + '}')
                                    }} />
                                </Col>
                              }
                            </Row>
                            <Row className="mb-3">
                              <Col span={24}>
                                <label
                                  className="block text-sm font-semibold leading-6 text-gray-900"
                                >
                                  Target
                                </label>
                                <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("target", e.target.value)} value={values.target}>
                                  {
                                    dataEStepTargets?.map((item: any, index: number) =>
                                      <Radio key={`target_` + index} value={item.value}>{item.label}</Radio>
                                    )
                                  }
                                </Radio.Group>
                              </Col>
                            </Row>
                          </>
                        }

                      </React.Fragment>}

                      {values.value == EStepEvent.Stop && <React.Fragment>
                        <Row className="mb-3">
                          <Col span={24}>
                            <label
                              className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                              Stop browser
                            </label>
                            <TanetCheckbox
                              view={state?.viewMode}
                              id="stopBrowser"
                              name="stopBrowser"
                            >
                              Enable
                            </TanetCheckbox>
                          </Col>
                        </Row>
                      </React.Fragment>}
                    </TabPane>
                    <TabPane tab="Settings" key={1}>
                      <Row className="mb-3">
                        <Col span={state?.viewMode ? 24 : 22}>
                          <TanetInput
                            label='Thời gian ngủ(giây) cho node (0 là tắt)'
                            required={true}
                            view={state?.viewMode}
                            id='sleepTime'
                            name='sleepTime'
                            type="text"
                          />
                        </Col>
                        {
                          !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <DropDownVariable items={dataVar}
                              onChange={(key: any) => {
                                setFieldValue('sleepTime', values.sleepTime + '${' + key + '}')
                              }} />
                          </Col>
                        }

                      </Row>
                      <Row className="mb-3">
                        <Col span={state?.viewMode ? 24 : 22}>
                          <TanetInput
                            label='Thời gian chờ(giây) cho node (0 là tắt)'
                            required={true}
                            view={state?.viewMode}
                            id='timeOut'
                            name='timeOut'
                            type="text"
                          />
                        </Col>
                        {
                          !state?.viewMode && <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <DropDownVariable items={dataVar}
                              onChange={(key: any) => {
                                setFieldValue('timeOut', values.timeOut + '${' + key + '}')
                              }} />
                          </Col>
                        }
                      </Row>
                      <Row className="mb-3">
                        <Col span={24}>
                          <Radio.Group onChange={(e: RadioChangeEvent) => setFieldValue("statusNode", e.target.value)} value={values.statusNode}>
                            <Radio value={true}>Nút thành công</Radio>
                            <Radio value={false}>Nút thất bại</Radio>
                          </Radio.Group>
                        </Col>
                      </Row>

                    </TabPane>
                    <TabPane tab="Note" key={2}>
                      <Row className="mb-3">
                        <Col span={24}>
                          <TanetTextArea
                            label=''
                            required={false}
                            view={state?.viewMode}
                            id='note'
                            name='note'
                            placeholder="Nhập ghi chú"
                          />
                        </Col>
                      </Row>
                    </TabPane>
                  </Tabs>
                </div>
              </Modal.Body>
              <Modal.Footer onClose={onClose}>
                {!state?.viewMode ? (
                  <>
                    <button
                      data-modal-hide="large-modal"
                      type="button"
                      onClick={onDelete && onDelete}
                      className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                    >
                      Xoá
                    </button>
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
