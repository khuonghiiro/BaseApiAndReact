"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelectTreeCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor } from "@/lib";
import { useEffect, useState, useReducer, useRef } from "react";
import { array, number, object, ref, string, date } from "yup";
import { formMauServices } from "../services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
export default function FormMauForm({
  show,
  action,
  id,
  onClose,
}: IFormProps) {
  const titleTable = "Bảng mẫu";
  const dataDefault = {
    tieuDe: '',
    moTa: '',
    hienThi: false,
    noiDung: '',
    diem: null,
    ngaySinh: null,
    anhDaiDien: '',
    files: [],
  };
  const schema = object({
    tieuDe: string().trim().nullable().required('Tiêu đề không được để trống').max(250, 'Bạn nhập tối đa 250 ký tự'),
    moTa: string().trim().nullable().max(1000, 'Bạn nhập tối đa 1000 ký tự'),
    noiDung: string().trim().nullable().required('Nội dung không được để trống'),
    diem: number().nullable(),
    ngaySinh: date().nullable(),
    anhDaiDien: string().trim().nullable(),
    //files: string().trim().nullable(),
    //files: array().nullable().required('Chưa chọn file đính kèm').min(1, "Chưa chọn file đính kèm"),
  });
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const { data, error, isLoading, mutate } = formMauServices.GetById(id!);
  const [loading, setLoading] = useState(false);


  const onSubmit = async (values: any) => {
    setLoading(true);
    if (id) {
      try {
        await formMauServices.update(id, values);
        toast.success("Cập nhật thành công");
        await mutate();
        await onClose(true);
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
    } else {
      try {
        await formMauServices.create(values);
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

  const onChangeSelectTree = (e) => {
    console.log('DATA', e);
  }
  const allOptions = [
    {
      label: 'Parent 1',
      value: 'parent1',
      children: [
        { label: 'Child 1.1', value: 'child1.1' },
        { label: 'Child 1.2', value: 'child1.2' },
      ],
    },
    {
      label: 'Parent 2',
      value: 'parent2',
      children: [
        { label: 'Child 2.1', value: 'child2.1' },
        { label: 'Child 2.2', value: 'child2.2' },
        {
          label: 'Subparent 2.3',
          value: 'subparent2.3',
          children: [
            { label: 'Child 2.3.1', value: 'child2.3.1' },
            { label: 'Child 2.3.2', value: 'child2.3.2' },
          ],
        },
      ],
    },
  ];
  const allOptionsSelect = [
    {
      label: 'option 1',
      value: 'option1',
    },
    {
      label: 'option 2',
      value: 'option2',
    },
    {
      label: 'option 3',
      value: 'option3',
    },
    {
      label: 'option 4',
      value: 'option4',
    },
  ];


  const dataTree = [
    {
      label: "Node 1",
      value: "node1",
      children: [
        {
          label: "Node 1.1",
          value: "node1.1",
          children: [
            {
              label: "Node 1.1.1",
              value: "node1.1.1",
            },
            {
              label: "Node 1.1.2",
              value: "node1.1.2",
            },
          ],
        },
        {
          label: "Node 1.2",
          value: "node1.2",
        },
      ],
    },
    {
      label: "Node 2",
      value: "node2",
      children: [
        {
          label: "Node 2.1",
          value: "node2.1",
        },
        {
          label: "Node 2.2",
          value: "node2.2",
          children: [
            {
              label: "Node 2.2.1",
              value: "node2.2.1",
            },
            {
              label: "Node 2.2.2",
              value: "node2.2.2",
            },
          ],
        },
      ],
    },
  ];

  const treeDataCheck = [
    {
      title: 'Node1',
      value: 'node1',
      children: [
        {
          title: 'Child Node1',
          value: 'node1.1',
        },
      ],
    },
    {
      title: 'Node2',
      value: 'node2',
      children: [
        {
          title: 'Child Node 2.1',
          value: 'node2.1',
        },
        {
          title: 'Child Node 2.2',
          value: 'node2.2',
        },
        {
          title: 'Child Node 2.3',
          value: 'node2.3',
        },
      ],
    },
  ];
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
          {({ handleSubmit }) => (
            <Form noValidate
              onSubmit={handleSubmit}
              onKeyPress={(ev) => {
                ev.stopPropagation();
              }}>
              <Modal.Header onClose={onClose}>{computedTitle(id, state?.editMode, titleTable)}</Modal.Header>
              <Modal.Body nameClass="grid-cols-12">
                <div className='col-span-6'>
                  <TanetInput
                    label='Tiêu đề'
                    required={true}
                    view={state?.viewMode}
                    id='tieuDe'
                    name='tieuDe'
                  /></div>

                <div className='col-span-6'>
                  <TanetTextArea
                    label='Mô tả'
                    required={false}
                    view={state?.viewMode}
                    rows={3}
                    id='moTa'
                    name='moTa'
                  /></div>
                <div className='col-span-6'>
                  <TanetCheckbox
                    view={state?.viewMode}
                    id='hienThi'
                    name='hienThi'
                  >Hiển thị</TanetCheckbox></div>
                <div className='col-span-6'>
                  {
                    !isLoading ? <TanetCKEditor
                      label='Nội dung'
                      required={true}
                      view={state?.viewMode}
                      id='noiDung'
                      name='noiDung'
                      data={data?.noiDung}
                    /> : ''}
                </div>
                <div className='col-span-6'>
                  <TanetInput
                    label='Điểm số'
                    required={false}
                    view={state?.viewMode}
                    type='number'
                    id='diem'
                    name='diem'
                  /></div>
                <div className='col-span-6'>
                  <TanetFormDate
                    label='Ngày sinh'
                    required={false}
                    view={state?.viewMode}
                    dateFormat='dd/MM/yyyy'
                    id='ngaySinh'
                    name='ngaySinh'
                  /></div>
                <div className='col-span-6'>
                  <TanetInput
                    label='Ảnh đại diện'
                    required={false}
                    view={state?.viewMode}
                    id='anhDaiDien'
                    name='anhDaiDien'
                  /></div>
                <div className='col-span-6'></div>
                <div className='col-span-6'>
                  {
                    !isLoading && <SelectAsync
                      name="selectAsyn"
                      treeLine={true}
                      id="selectAsyn"
                      required={true}
                      view={state?.viewMode}
                      textValue={data?.selectAsynText}
                      placeholder="Chọn"
                      url="/api/menumanager/listtree"
                      fieldSearch="ParentId"
                      paramDefault="-1"
                      label='Select Tree Async'
                      defaultValue={data?.selectAsyn}
                      className="abccc"
                    />
                  }
                </div>
                <div className='col-span-6'>
                  <TanetSelect
                    label="Select"
                    className="block mt-2 w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    name="parentId"
                    view={state?.viewMode}
                    isMulti={true}
                    options={allOptionsSelect}
                  />
                </div>
                <div className='col-span-6'>
                  <TanetSelectTreeCheck
                    label="Select Tree"
                    name="tree_check"
                    view={state?.viewMode}
                    data={treeDataCheck}
                    onChange={onChangeSelectTree}
                    className="abccc"
                  />
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
    </>
  );


  
}
