"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelectTreeCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor, FileAttach } from "@/lib";
import { useEffect, useState, useReducer, useRef } from "react";
import { array, number, object, ref, string, date } from "yup";
import { groupTourGuideServices } from "../services";
import { formReducer, INITIAL_STATE_FORM, computedTitle, formatFullDateTime, listReducer, INITIAL_STATE_LIST, ACTION_TYPES, getPermisson } from "@/lib/common";
import { Edge, Node, ReactFlowProvider, XYPosition } from "@xyflow/react";
import TourGuideNodeForm from "../../tourguidenode/_components/tourguidenode-form";
import { DiagramIndex } from "../../tour-diagram/_components/diagram-index";
import { userServices } from "../../(quantrihethong)/users/services";
import { AuthService } from "@/shared/services";
import { DefaulPer, DefaultMeta } from "@/public/app-setting";
import { v4 as uuidv4 } from 'uuid';
import { tourGuideNodeServices } from "../../tourguidenode/services";

export default function GroupTourGuideForm({
  show,
  action,
  id,
  onClose,
}: IFormProps) {
  const titleTable = "Các bước hướng dẫn website";
  const dataDefault = {
    edgeIds: '',
    keyName: '',
    name: '',
    listGroupCodes: [],
    isActive: true,
  };

  const schema = object({
    keyName: string().trim().nullable().required('Tên khóa không được để trống').max(255, 'Bạn nhập tối đa 255 ký tự'),
    edgeIds: string().trim().nullable(),
    name: string().trim().nullable().required('Tên hướng dẫn không được để trống').max(255, 'Bạn nhập tối đa 255 ký tự'),
    listGroupCodes: array().min(1, "Bạn chưa chọn nhóm người dùng"),
  });
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const { data, error, isLoading, mutate } = groupTourGuideServices.GetById(id!);

  const [loading, setLoading] = useState(false);
  const { data: groups } = userServices.GetAllGroupsSelectValueCode();
  const [listNodes, setListNodes] = useState<any>([]);
  const [listEdges, setListEdges] = useState<any>([]);
  const [positionAdd, setPositionAdd] = useState<XYPosition | null>(null);
  const [nodeId, setNodeId] = useState<any | null>(null);

  //   const { data, error, isLoading, mutate } = tourGuideServices.GetById(id!);

  const [state2, setState2] = useState({
    show: false,
    action: ACTION_TYPES.READ,
    id: 0,
    stepIndex: 0

  });
  // const [nodeData, setNodeData] = useState<any>()
  const [date, setDate] = useState(new Date());
  const [nodeNew, setNodeNew] = useState();

  const idCurrent = useRef<any>(uuidv4());

  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
  });
  const [permisson, setPermisson] = useState<any>({
    ...DefaulPer,
  });


  const dataId = (id && id !== 0) ? (data ? data.id : idCurrent.current) : idCurrent.current;

    // Hàm để cập nhật tất cả các trường cùng một lúc
    const updateAllFields = (newValues: any) => {
      setState2(prevState => ({
          ...prevState,
          ...newValues
      }));
  };

  const onSubmit = async (values: any) => {
    setLoading(true);

    values.listNodes = JSON.stringify(listNodes);
    values.listEdges = JSON.stringify(listEdges);

    if (id) {
      try {
        var isCheck = await groupTourGuideServices.update(id, values);
        if (isCheck) {
          toast.success("Cập nhật thành công");

          localStorage.removeItem('edges-' + dataId);

          await mutate();
        }
        await onClose(true);
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
    } else {
      try {
        values.id = idCurrent.current;
        await groupTourGuideServices.create(values);
        toast.success("Thêm thành công");

        localStorage.removeItem('edges-' + dataId);
        
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
    localStorage.removeItem('edges-' + dataId);
  }, [action, id]);

  const { getOauth } = AuthService();
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    var auth = getOauth();
    setIsAdmin(auth.isAdministrator)
  }, []);

  useEffect(() => {
    setPermisson(getPermisson("tourguide"));
    setPermisson(getPermisson("tourguideedge"));

    setMeta({
      ...DefaultMeta,
      page_size: 1000
    });

  }, []);

  const handleConnectEnd = (screenToFlowPosition: any, nodeNewId: any, stepIndex: any, connectingNodeId?: React.MutableRefObject<string | null>) => {

    updateAllFields({ show: true, action: ACTION_TYPES.ADD, id: nodeNewId , stepIndex: stepIndex});
    setNodeId(connectingNodeId?.current);
    setPositionAdd(screenToFlowPosition);
  };

  const handleConnectEdge = async (sourceId: any, targetId: any) => {

  };

  const handleEditClick = (editId: string, stepIndex: any, screenToFlowPosition?: any) => {
    setPositionAdd(screenToFlowPosition);
    updateAllFields({ show: true, action: ACTION_TYPES.EDIT, id: editId, stepIndex: stepIndex });
  };

  const onMute = () => {

  };

  const onClose2 = async (isRefresh: boolean) => {
    updateAllFields({ show: false, action: ACTION_TYPES.CLOSE, id: 0 });
    // if (isRefresh) {
    //   //   await mutate();
    //   setDate(new Date());
    // }
    setDate(new Date());

    // localStorage.removeItem('edges-' + dataId);
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
              <Modal.Body nameClass="grid-cols-12">
                <div className='col-span-3'>
                  <div className='col-span-12'>
                    <TanetInput
                      label='Tên khóa'
                      required={true}
                      view={state?.viewMode}
                      id='keyName'
                      name='keyName'
                    /></div>
                  <div className='col-span-12'>
                    <TanetInput
                      label='Tên hướng dẫn'
                      required={true}
                      view={state?.viewMode}
                      id='name'
                      name='name'
                    /></div>
                  <div className='col-span-12'>
                    {isAdmin == true ?
                      <div className="">
                        <TanetSelect
                          label="Nhóm người dùng"
                          name="listGroupCodes"
                          isMulti
                          required={true}
                          view={state?.viewMode}
                          options={groups}
                        />
                      </div>
                      :
                      <div className="">
                        <TanetSelect
                          label="Nhóm người dùng"
                          name="groupIds"
                          isMulti
                          view={true}
                          options={groups}
                        />
                      </div>

                    }
                  </div>
                  <div className='col-span-12'>
                    <TanetCheckbox
                      view={state?.viewMode}
                      id='isActive'
                      name='isActive'
                    >Kích hoạt</TanetCheckbox></div>
                  {state?.viewMode && (
                    <>
                      <div className='col-span-12'>
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
                      <div className='col-span-12'>
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
                        <div className='col-span-12'>
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
                        <div className='col-span-12'>
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
                  )}
                </div>
                <div className='col-span-9'>

                  <ReactFlowProvider>
                    <DiagramIndex
                      handleEditClick={handleEditClick}
                      handleConnectEnd={handleConnectEnd}
                      setListNodes={setListNodes} // Truyền props setListNodes
                      setListEdges={setListEdges} // Truyền props setListEdges
                      onMute={onMute}
                      data={data}
                      nodeNew={nodeNew}
                      isView={state?.viewMode}
                      date={date}
                      keyDiagram={dataId}
                    />
                  </ReactFlowProvider>
                </div>
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

      {state2.show && <TourGuideNodeForm
        id={state2.id}
        show={state2.show}
        onClose={onClose2}
        action={state2.action}
        positionAdd={positionAdd}
        keyDiagram={dataId}
        nodeId={nodeId}
        stepIndex={state2.stepIndex}
      />}
    </>
  );
}
