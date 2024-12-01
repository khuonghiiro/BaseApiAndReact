"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { useEffect, useState, useReducer, useRef } from "react";
import { number, object, string } from "yup";
import { configAppServices } from "../services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
import React, { useCallback } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Edge,
  ReactFlowProvider,
  Background,
} from 'reactflow';
import { Sidebar } from './Sidebar';

import 'reactflow/dist/style.css';
import { CustomNode, StartNode, VariablesNode, StyleStart, StyleDefault, StyleVariables, EndNode, StyleEnd, LoopNode, StyleLoop } from './custom-node';
import { Col, Row } from "antd";
import { TanetInput } from "@/lib";
import './style.css';
import UpdateFormStepForm from "./update-step-form";
import { EStepButton, EStepDirection, EStepEvent, EStepSelectBy, EStepTypeRandom, EStepWaitForNavigation, EStepFileType, EStepMethod, EStepResponseType, EStepContentType, EStepInputType, EStepMode, EStepSelectWriteMode, EStepAppendMode, EStepLoopType, EStepActionExcel, EStepStorageExcel, EStepTarget } from "./step.model";
import UpdateVariableForm from "./update-variable-form";
import { toast } from "react-toastify";
const nodeTypes = {
  start: StartNode,
  end: EndNode,
  custom: CustomNode,
  loop: LoopNode,
  variable: VariablesNode,
};

export default function ConfigAppForm({
  show,
  action,
  id,
  onClose,
}: IFormProps) {
  const titleTable = "Cấu hình app";
  const dataDefault = {
    desctiption: '',
    status: 1,
    title: '',
    maxId: 0,
  };
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const _animated = false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const connectionLineStyleTrue = { stroke: 'green' };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const connectionLineStyleFalse = { stroke: 'red' };
  const connectionLineStyleLoop = { stroke: '#c7a71a' };
  const initialNodes: any[] = [
    {
      id: '0',
      type: 'start',
      data: { label: 'Start' },
      position: { x: 0, y: 40 },
      style: StyleStart,
    },
    {
      id: '-1',
      type: 'variable',
      data: { label: 'Variables', dataVariables: [{ id: 1, key: 'PROFILE_ID', value: 'PROFILE_ID', isFix: true, }, { id: 2, key: 'PROFILE_NAME', value: 'PROFILE_NAME', isFix: true }] },
      position: { x: 10, y: 100 },
      style: StyleVariables,
    },
  ];
  const initialEdges: Edge<any>[] = [];
  const schema = object({
    desctiption: string().trim().nullable().max(1000, 'Bạn nhập tối đa 1000 ký tự'),
    status: number().nullable().required('Trạng thái không được để trống').integer('Bạn phải nhập kiểu số nguyên'),
    title: string().trim().nullable().required('Tên app không được để trống').max(250, 'Bạn nhập tối đa 250 ký tự'),
  });
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const { data, error, isLoading, mutate } = configAppServices.GetById(id!);

  const { data: dataEvents } = configAppServices.getAllEnum("EStepEvent");
  const [loading, setLoading] = useState(false);
  const [propStep, setPropSteps] = useState({ open: false, node: null, action: action, id: null });
  const [propVar, setPropVar] = useState({ open: false, node: null, action: action, data: null });
  const [date, setDate] = useState<any>(null);
  const [idEvent, setIdEvent] = useState<number>(0);
  const [dataVariables, setDataVariables] = useState<any>();
  const [menu, setMenu] = useState<any>(null);
  const ref = useRef<any>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>(initialEdges);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getId = () => {
    let idE = idEvent + 1;
    setIdEvent(idE);
    return `${idE}`;
  };
  const onSubmit = async (values: any) => {

    try {

      values.nodes = JSON.stringify(nodes);
      values.edges = JSON.stringify(edges);
      values.maxId = idEvent;
      setLoading(true);
      if (id) {
        try {
          await configAppServices.update(id, values);
          toast.success("Cập nhật thành công");
          await mutate();
          await onClose(true);
        } catch (err: any) {
          toast.error("Cập nhật không thành công");
        }
      } else {
        try {
          await configAppServices.create(values);
          toast.success("Thêm thành công");
          await mutate();
          await onClose(true);
        } catch (err: any) {
          toast.error("Thêm mới không thành công");
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error serializing object: nodes hoặc edges");
      throw error;
    }

  };

  useEffect(() => {
    dispatch({ type: action });
    if (id > 0) {
      if (data?.nodes) {
        setNodes(JSON.parse(data?.nodes))
      }
      if (data?.edges) {
        setEdges(JSON.parse(data?.edges))
      }
      if (data?.maxId) {
        setIdEvent(data?.maxId)
      }
    }
  }, [action, data?.edges, data?.maxId, data?.nodes, id, setEdges, setNodes]);

  const onConnect = useCallback(
    (params: any) => {
      if (params)
        setEdges((eds) => addEdge({ ...params, animated: true, style: params.sourceHandle && params.sourceHandle == 'F' ? connectionLineStyleFalse : (params.sourceHandle == 'O' || params.targetHandle == 'I') ? connectionLineStyleLoop : connectionLineStyleTrue }, eds))
    },
    [connectionLineStyleFalse, connectionLineStyleLoop, connectionLineStyleTrue, setEdges]
  );
  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      let _ev = dataEvents.find((x: { value: any; }) => x.value == type);
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      let idevent = getId();

      const newNode = {
        id: idevent,
        type: _ev.value == EStepEvent.Stop ? 'end' : _ev.value == EStepEvent.Loop ? 'loop' : 'custom',
        position,
        data: {
          ..._ev, sleepTime: '0', timeOut: '30', statusNode: true, note: ''
          , urlTab: '', waitTime: '0', waitForNav: EStepWaitForNavigation.Load, tabNumber: _ev.value == EStepEvent.ActivateTab ? 0 : 1,
          isCurrentTab: true, button: EStepButton.Left, selectBy: null, selectorType: null, selector: '', clickCount: 1, timeOutMouse: '10',
          coordinateX: '0', coordinateY: '0', timeHold: null,
          scrollType: EStepSelectBy.Coordinates, direction: EStepDirection.Down, speed: 1,
          text: '', isTypeHuman: true, timeOutData: '10', outputVariable: null, attributeName: '', optionValue: '', typeRandom: EStepTypeRandom.Email,
          fileType: EStepFileType.File, filePath: '', isClickToUpload: false, requestMethod: EStepMethod.GET, url: '', headers: [], params: [], cookies: [],
          responseType: EStepResponseType.JSON, responseBodyMappings: [], outputRawData: '', contentType: EStepContentType.JSON, body: '', formDatas: [],
          inputType: EStepInputType.File, variable: null, mode: EStepMode.Line, inputData: '', csvDelimeter: '', selectorWriteMode: EStepSelectWriteMode.Overwrite, appendMode: EStepAppendMode.NewLine,
          fileName: '', folderOutput: '', comment: 'Comment', stopBrowser: true, operator: null, variableOrValue: '', seconds: '1',
          loopType: EStepLoopType.For, forFromValue: '', forToValue: '', action: EStepActionExcel.Read, range: '',
          sheetName: '', isFirstRowAsKey: true, storage: EStepStorageExcel.Variable, mapSpreadSheetData: [], refKey: '', inputVariable: '', target: EStepTarget.Array
        },
        style: _ev.value == EStepEvent.Stop ? StyleEnd : _ev.value == EStepEvent.Loop ? StyleLoop : StyleDefault
      };
      let nds = nodes;
      setNodes((nds) => nds.concat(newNode));
    },
    [dataEvents, getId, nodes, reactFlowInstance, setNodes],
  );
  const onClickNode = (event: any, node: any) => {
    const nodeVar = nodes.find((x: any) => x.id == -1);
    if (node.type == "custom" || node.type == 'end' || node.type == 'loop') {
      setDataVariables(nodeVar?.data?.dataVariables ?? []);
      setPropSteps({ open: true, node: node?.data, action: action, id: node?.id })
    }
    if (node.type == "variable") {
      setPropVar({ open: true, node: node?.data, action: action, data: node?.data?.dataVariables })
      setDate(new Date());
    }

  }
  const onCloseStepForm = async (isRefresh: boolean) => {
    setPropSteps({ open: false, node: null, action: action, id: null })
    if (isRefresh) {
      await mutate();
    }
  };
  const onCloseVarForm = async (isRefresh: boolean) => {
    setPropVar({ open: false, node: null, action: action, data: null })
    setDate(null);
    if (isRefresh) {
      await mutate();
    }
  };

  const onUpdateStep = (vl: any, id: null) => {
    const newArray = nodes.map(item => {
      if (item.id == id) {
        return { ...item, data: vl };
      } else {
        return item;
      }
    });
    setNodes(newArray);
  }
  // const onNodeContextMenu = useCallback(
  //   (event: any, node: any) => {
  //     // Prevent native context menu from showing
  //     event.preventDefault();

  //     // Calculate position of the context menu. We want to make sure it
  //     // doesn't get positioned off-screen.
  //     const pane = ref.current.getBoundingClientRect();
  //     setMenu({
  //       id: node.id,
  //       top: event.clientY < pane.height - 200 && event.clientY,
  //       left: event.clientX < pane.width - 200 && event.clientX,
  //       right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
  //       bottom:
  //         event.clientY >= pane.height - 200 && pane.height - event.clientY,
  //     });
  //   },
  //   [setMenu],
  // );
  // const onPaneClick = useCallback(() => setMenu(null), [setMenu]);
  const deleteNode = (id: any) => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
    onCloseStepForm(true);
  };
  return (
    <>
      <Modal show={show} size="full" loading={loading}>
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
              <Modal.Body nameClass="grid-cols-12 p-0">
                <div className="col-span-12">
                  <Row>
                    <Col span={12}>
                      <TanetInput
                        label='Tên app'
                        required={true}
                        view={state?.viewMode}
                        id='title'
                        name='title'
                      />
                    </Col>
                    <Col span={12}>
                      <TanetInput
                        label='Mô tả'
                        required={false}
                        view={state?.viewMode}
                        id='desctiption'
                        name='desctiption'
                      />
                    </Col>
                  </Row>
                </div>
                <div className="col-span-12">
                  <div className="dndflow" style={{ minHeight: '500px' }}>
                    <ReactFlowProvider>
                      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                        <ReactFlow
                          ref={ref}
                          nodes={nodes}
                          edges={edges}
                          onNodesChange={onNodesChange}
                          onEdgesChange={onEdgesChange}
                          onConnect={onConnect}
                          onInit={setReactFlowInstance}
                          onDrop={onDrop}
                          onDragOver={onDragOver}
                          onNodeClick={onClickNode}
                          nodeTypes={nodeTypes}
                          //onNodeContextMenu={onNodeContextMenu}
                          fitView
                        >
                          <Controls />
                          <Background />
                          {/* {menu && <ContextMenu onClick={onPaneClick} {...menu} />} */}
                        </ReactFlow>
                      </div>
                      <div style={{ width: '20%', backgroundColor: '#eff2f2' }}>
                        {dataEvents && <Sidebar data={dataEvents} />}
                      </div>

                    </ReactFlowProvider>
                  </div>
                </div>
                {propStep.node && propStep.id && <UpdateFormStepForm dataVar={dataVariables} show={propStep.open} onClose={onCloseStepForm} action={propStep.action} data={propStep.node}
                  onChange={(vl: any) => {
                    setDataVariables(null);
                    onUpdateStep(vl, propStep.id);
                    onCloseStepForm(true);
                  }}
                  onDelete={() => deleteNode(propStep.id)}
                />}
                {propVar.node && date && <UpdateVariableForm date={date} show={propVar.open} onClose={onCloseVarForm}
                  onChange={(vl: any[]) => {
                    setDataVariables(null);
                    const newArray = nodes.map(item => {
                      if (item.id == '-1') {
                        return { ...item, data: { ...item.data, dataVariables: vl } };
                      } else {
                        return item;
                      }
                    });
                    setNodes(newArray);
                    onCloseVarForm(true);
                  }}
                  action={propVar.action} data={propVar.node} dataVar={propVar.data} />}
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
      </Modal >
    </>
  );
}
