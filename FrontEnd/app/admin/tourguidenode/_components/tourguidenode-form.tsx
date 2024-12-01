import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState, useReducer } from 'react';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import { array, number, object, ref, string, bool } from 'yup';
import { formReducer, INITIAL_STATE_FORM, computedTitle, formatFullDateTime, ACTION_TYPES } from '@/lib/common';
import { XYPosition } from '@xyflow/react';
import { Modal } from '@/shared/components/modal';
import { TanetInput, TanetSelectTreeCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor, FileAttach } from '@/lib';
import { tourGuideNodeServices } from '../services';
import { v4 as uuidv4 } from 'uuid';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function TourGuideNodeForm({
  id,
  show,
  action,
  onClose,
  positionAdd,
  keyDiagram,
  nodeId,
  stepIndex
}: {
  id?: any | null,
  show: boolean;
  action: string;
  nodeId?: any | null;
  keyDiagram: any,
  onClose: (isRefresh: boolean) => void;
  positionAdd?: XYPosition | null;
  stepIndex?: any | null;
}) {
  const titleTable = "Hướng dẫn website";
  const dataDefault = {
    classOrId: '',
    content: '',
    stepIndex: stepIndex ?? 0,
    positionX: positionAdd?.x ?? 0,
    positionY: positionAdd?.y ?? 0,
    isClickElem: false,
    isShow: true,
    nodeId: nodeId ?? '',
    title: '',
    attachment: [],
    isHtml: false,
    textHtml: '',
    keyDiagram: keyDiagram ?? '',
  };

  const schema = object({
    classOrId: string().trim().nullable().required('Tên class hoặc id của thẻ html không được để trống').max(255, 'Bạn nhập tối đa 255 ký tự'),
    content: string().trim().nullable(),
    positionX: number().nullable(),
    positionY: number().nullable(),
    stepIndex: number().nullable().integer('Bạn phải nhập kiểu số nguyên'),
    attachment: array().nullable().max(1, 'Chỉ được chọn 1 file'),
    isHtml: bool().nullable(),
    textHtml: string().trim().nullable(),
  });
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const { data, error, isLoading, mutate } = tourGuideNodeServices.GetById(id!);
  const [loading, setLoading] = useState(false);
  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }, { 'direction': 'rtl' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['clean']
    ]
  };

  function formatText(input: string) {
    // Kiểm tra nếu ký tự đầu tiên là '.' hoặc '#'
    if (input.startsWith('.') || input.startsWith('#')) {
      return input;
    }
    // Nếu không, gán '.' vào đầu tiên
    return '.' + input;
  }

  const onSubmit = async (values: any, { resetForm }: any) => {
    setLoading(true);


    if (id && action === ACTION_TYPES.EDIT) {
      try {
        values.stepIndex = (stepIndex ?? 0) + 1;
        values.classOrId = formatText(values.classOrId);

        await tourGuideNodeServices.update(id, values);
        toast.success("Cập nhật thành công");
        await mutate();
        await onClose(true);
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
    } else {
      try {
        values.id = id;
        values.stepIndex = (values.stepIndex == 0) ? 1 : (stepIndex ?? 1);
        values.classOrId = formatText(values.classOrId);

        await tourGuideNodeServices.create(values);
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
      <Modal show={show} size="lg" loading={loading}>
        <Formik
          onSubmit={onSubmit}
          validationSchema={schema}
          initialValues={(id && action !== ACTION_TYPES.ADD) ? (data ? data : dataDefault) : dataDefault}
          enableReinitialize={true}
        >
          {({ handleSubmit, submitForm, values, setFieldValue }) => (
            <Form noValidate
              onSubmit={handleSubmit}
              onKeyPress={(ev) => {
                ev.stopPropagation();
              }}>
              <Modal.Header onClose={onClose}>{computedTitle(id, state?.editMode, titleTable)}</Modal.Header>
              <Modal.Body nameClass="grid-cols-12">
                <div className='col-span-12'>
                  <TanetInput
                    label='Tên class hoặc id của thẻ html'
                    required={true}
                    view={state?.viewMode}
                    id='classOrId'
                    name='classOrId'
                  />
                </div>

                <div className='col-span-12'>
                  <TanetInput
                    label='Tiêu đề'
                    required={false}
                    view={state?.viewMode}
                    id='title'
                    name='title'
                  />
                </div>
                <div className='flex items-center col-span-12'>
                  <div className='mr-4'>
                    <TanetCheckbox
                      view={state?.viewMode}
                      id='isHtml'
                      name='isHtml'
                    >Sử dụng HTML</TanetCheckbox>
                  </div>
                  <div className='mr-4'>
                    <TanetCheckbox
                      view={state?.viewMode}
                      id='isClickElem'
                      name='isClickElem'
                    >Nhấn chọn</TanetCheckbox>
                  </div>
                  <div className='mr-4'>
                    <TanetCheckbox
                      view={state?.viewMode}
                      id='isShow'
                      name='isShow'
                    >Hiển thị </TanetCheckbox>
                  </div>

                </div>
                {!values.isHtml ? (
                  <div className='col-span-12'>
                    <label className="block text-sm font-medium text-gray-700">Nội dung</label>
                    {state?.viewMode ? (
                      <div dangerouslySetInnerHTML={{ __html: values.content }} className="prose prose-sm mx-auto max-w-full" />
                    ) : (
                      <ReactQuill
                        className="custom-quill-editor"  // Áp dụng lớp Tailwind và lớp tùy chỉnh
                        value={values.content}
                        onChange={(value) => setFieldValue('content', value)}
                        modules={modules}
                      />
                    )}
                  </div>
                ) : (
                  <div className='col-span-12'>
                    <TanetTextArea
                      label='Mã HTML'
                      required={false}
                      view={state?.viewMode}
                      id='textHtml'
                      name='textHtml'
                      cols={8}
                    />
                  </div>
                )}

                <div className="hidden">
                  <div className='col-span-12'>
                    <TanetInput
                      label='keyDiagram'
                      required={false}
                      view={state?.viewMode}
                      id='keyDiagram'
                      name='keyDiagram'
                    />
                  </div>
                  <div className='col-span-12'>
                    <TanetInput
                      label='nodeId'
                      required={false}
                      view={true}
                      id='nodeId'
                      name='nodeId'
                    />
                  </div>
                  <div className='col-span-12'>
                    <TanetInput
                      label='Tọa độ X'
                      required={false}
                      view={true}
                      type='string'
                      id='positionX'
                      name='positionX'
                    />
                  </div>
                  <div className='col-span-12'>
                    <TanetInput
                      label='Tọa độ Y'
                      required={false}
                      view={true}
                      type='number'
                      id='positionY'
                      name='positionY'
                    />
                  </div>
                  <div className='col-span-12'>
                    <TanetInput
                      label='Bước thực hiện'
                      required={false}
                      view={true}
                      type='number'
                      id='stepIndex'
                      name='stepIndex'
                    />
                  </div>
                </div>

                <div className='col-span-12'>
                  <FileAttach
                    action={action}
                    nameAttach='attachment'
                    displayImage={true}
                    fileType='fileAllImage'
                    maxFiles={1}
                    required={false}
                    label="Đính kèm"
                  />
                </div>

                {state?.viewMode && (
                  <>
                    <div className='col-span-6'>
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
                    <div className='col-span-6'>
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
                      <div className='col-span-6'>
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
                      <div className='col-span-6'>
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

              </Modal.Body>
              <Modal.Footer onClose={onClose}>
                {!state?.viewMode ? (
                  <>
                    <button
                      data-modal-hide="large-modal"
                      type="button"
                      onClick={(ev) => {
                        ev.preventDefault();
                        submitForm();
                        ev.stopPropagation();
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
      </Modal>
    </>
  );
}
