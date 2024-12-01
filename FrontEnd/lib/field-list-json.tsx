import { TanetFormDate, TanetInput, TanetSelect } from "@/lib";
import { useField, useFormikContext } from "formik";
import { useState, useEffect } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";

export enum EDataType {
  STRING = 1,
  DATETIME = 2,
  NUMBER = 3,
  SELECT = 4,
  SELECTMUTIL = 5,
}

export interface TFieldItem {
  name: string;
  type: EDataType;
  option?: any[];
  label: string;
  width: number;
  required: boolean;
}

export interface TanetFieldJsonProps {
  fields: TFieldItem[];
  view: boolean;
  valueDefault?: any[];
  name: string;
  onChange?: (value: any[]) => void;
  label?: string;
}

export const TanetFieldJson = (props: TanetFieldJsonProps) => {
  const { fields, view, valueDefault, name, onChange, label } = props;
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
  }, [name, field, view, loading]);
  const getMaxId = (array: any[]) => {
    if (array.length === 0) {
      return 1; // Trả về null nếu mảng rỗng
    }
    return Math.max(...array.map((item) => item.id)) + 1;
  };
  const deleteRow = (index: number) => {
    let dt = field.value;
    setFieldValue("listDataFields", []);
    const newArray = dt.filter((el: any, idx: number) => idx != index);

    // dt.splice(index, 1);
    setFieldValue("listDataFields", newArray);
    setLoading(!loading);
    // handleChange(dt);
  }

  const addRow = () => {
    const itemAdd: any = {}; // Tạo một bản ghi mới trống
    itemAdd.id = getMaxId(field.value);
    fields.forEach((_field: TFieldItem) => {
      itemAdd[_field.name] = _field.type == EDataType.STRING ? "" : _field.type == EDataType.DATETIME ? null :
        _field.type == EDataType.NUMBER ? null :
          _field.type == EDataType.SELECT ? null : null;
    });
    let dt = field.value;
    dt.push(itemAdd);
    setFieldValue(name, dt);
    handleChange(dt);

  }
  const handleChange = (value: any[]) => {
    if (onChange) {
      onChange(value);
    }
  }
  return (
    <>
      <div>
        <h6>{label}</h6>
        <table className='table'>
          <thead>
            <tr>
              <th className="p-1 border border-slate-300" style={{ fontWeight: '500', fontSize: '13px', width: 50 }}>STT</th>
              {
                fields?.map((item: TFieldItem, index: number) => {
                  return <th key={index} className="p-1 border border-slate-300" style={{ fontWeight: '500', fontSize: '13px', width: item.width }}>{item.label}</th>
                })
              }
              {
                !view && <th className="p-1 border border-slate-300" style={{ fontWeight: '500', fontSize: '13px', width: 50 }}>#</th>
              }

            </tr>
          </thead>
          <tbody>
            {
              field.value?.map((item: any, index: number) => {
                return <tr key={`row_${item.id}`}>
                  <td className="p-1 text-center border border-slate-300">{index + 1}</td>
                  {
                    fields?.filter(x => x.name != 'id')?.map((_field: TFieldItem, idx: number) => {
                      return <td key={idx} className="p-1 border border-slate-300">
                        {
                          _field.type == EDataType.STRING ?
                            <TanetInput
                              required={_field.required}
                              view={view}
                              id={`${_field.name}_${item.id}`}
                              name={`${_field.name}_${item.id}`}
                              defaultvalue={item[_field.name]}
                              onChange={(e: any) => {
                                const updatedData = [...field.value];
                                updatedData[index][_field.name] = e.target.value;
                                setFieldValue(name, updatedData);
                                setFieldValue(`${_field.name}_${item.id}`, e.target.value);
                                handleChange(updatedData);
                              }}
                            /> :
                            _field.type == EDataType.NUMBER ?
                              <TanetInput
                                required={_field.required}
                                view={view}
                                id={`${_field.name}_${item.id}`}
                                name={`${_field.name}_${item.id}`}
                                value={item[_field.name]}
                                type="number"
                                defaultvalue={item[_field.name]}
                                onChange={(e: any) => {
                                  const updatedData = [...field.value];
                                  updatedData[index][_field.name] = e.target.value;
                                  setFieldValue(name, updatedData);
                                  setFieldValue(`${_field.name}_${item.id}`, e.target.value);
                                  handleChange(updatedData);
                                }}
                              /> :
                              _field.type == EDataType.SELECT ?
                                <TanetSelect
                                  required={_field.required}
                                  view={view}
                                  id={`${_field.name}_${item.id}`}
                                  name={`${_field.name}_${item.id}`}
                                  options={_field.option ?? []}
                                  defaultValue={item[_field.name]}
                                  onChange={(e: any) => {
                                    const updatedData = [...field.value];
                                    updatedData[index][_field.name] = e.target.value;
                                    setFieldValue(name, updatedData);
                                    setFieldValue(`${_field.name}_${item.id}`, e.target.value);
                                    handleChange(updatedData);
                                  }}
                                /> :
                                _field.type == EDataType.SELECTMUTIL ?
                                  <TanetSelect
                                    required={_field.required}
                                    view={view}
                                    id={`${_field.name}_${item.id}`}
                                    name={`${_field.name}_${item.id}`}
                                    options={_field.option ?? []}
                                    defaultValue={item[_field.name]}
                                    isMulti
                                    onChange={(e: any) => {
                                      const updatedData = [...field.value];
                                      updatedData[index][_field.name] = e.target.value;
                                      setFieldValue(name, updatedData);
                                      setFieldValue(`${_field.name}_${item.id}`, e.target.value);
                                      handleChange(updatedData);
                                    }}
                                  /> :
                                  _field.type == EDataType.DATETIME ?
                                    <TanetFormDate
                                      required={_field.required}
                                      view={view}
                                      id={`${_field.name}_${item.id}`}
                                      name={`${_field.name}_${item.id}`}
                                      options={_field.option ?? []}
                                      defaultValue={item[_field.name]}
                                      isMulti
                                      onChange={(e: any) => {
                                        const updatedData = [...field.value];
                                        updatedData[index][_field.name] = e.target.value;
                                        setFieldValue(name, updatedData);
                                        setFieldValue(`${_field.name}_${item.id}`, e.target.value);
                                        handleChange(updatedData);
                                      }}
                                    /> : ''
                        }
                      </td>
                    })
                  }
                  {
                    !view && <td className="p-1 text-center border border-slate-300"><button type="button" onClick={() => deleteRow(index)}><RiDeleteBin6Line /></button></td>
                  }

                </tr>
              })
            }
          </tbody>
          {
            !view && <tfoot>
              <tr>
                <td className="p-2 text-center border border-slate-300" colSpan={fields.length + 1}></td>
                <td className="p-2 text-center border border-slate-300"><button type='button' onClick={addRow}><IoMdAddCircle style={{ fontSize: '21px' }} /></button></td>
              </tr>
            </tfoot>
          }

        </table>

      </div>
    </>
  );
}