import React, { useEffect, useState } from "react";
import { useFormikContext, useField } from "formik";
import { commonServices } from './services';
import type { TreeSelectProps } from 'antd';
import { TreeSelect } from 'antd';
import { debounce } from 'lodash';
import type { DefaultOptionType } from 'antd/es/select';

export const SelectAsync = ({
  label = '',
  view = false,
  required = false,
  textValue = "",
  defaultValue = null,
  url = "",
  fieldSearch = "",
  paramDefault = "",
  className="",
  ...props
}) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const { name } = props;
  const [field, meta] = useField(props);
  const { setFieldValue } = useFormikContext();
  const [timeRender, setTimeRender] = useState(null);
  const [num, setNum] = useState(0);
  const [value, setValue] = useState<any>(defaultValue);
  const [treeData, setTreeData] = useState<Omit<DefaultOptionType, 'label'>[]>([]);
  useEffect(() => {
    getDataOption(paramDefault, true);
  }, []);
  const onChange = (newValue: string) => {
    if (!newValue) {
      getDataOption(paramDefault, true, true);
    }
    setFieldValue(name, newValue);
    setValue(newValue);
    if (props.onChange) {
      props.onChange({
        persist: () => { },
        target: {
          type: 'change',
          id: props.id || null,
          name: props.name,
          value: newValue
        }
      });
    }
  }
  const getDataOption = async (ParentId: any, init: boolean = false, isClear: boolean = false) => {
    const data = await commonServices.getDataSelectTree(url, ParentId, fieldSearch);
    if (init) {
      setTreeData(data);
      setDataValue(data, isClear);
    }
    else {
      let treeDT = treeData.filter((item) => item.pId !== ParentId);
      let treeDT1 = treeDT.concat(data);
      setTreeData(treeDT1);
    }
    if (num < 2) {
      setNum(num + 1)
    }

  }
  const setDataValue = (data: any[], isClear: boolean) => {
    if (!isClear) {
      if (data && value) {
        if (props.isMulti) {
          setValue(value);
        }
        else {
          let check = data.some((item: { value: any; }) => item.value === value);
          if (!check && textValue) {
            setValue(textValue);
          }
        }
      }
    }
  }

  const onLoadData: TreeSelectProps['loadData'] = ({ id }) =>
    new Promise((resolve) => {
      setTimeout(() => {
        getDataOption(id);
        resolve(undefined);
      }, 300);
    });

  const filterSearch = async (search: string) => {
    if (search) {
      let data = await commonServices.getDataSelectTree(url, search, '');
      setTreeData(data);
    }
  }

  const onSearch = debounce((search: string) => {
    // Gọi API tại đây với searchTerm
    filterSearch(search);
  }, 500); // Thời gian debounce là 500ms

  return (
    <>
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
        {required ? <span className="text-red-500"> (*)</span> : ""}
      </label>
      <TreeSelect
        {...props}
        disabled={view}
        className={`block w-full mt-2 ${className}`}
        showSearch
        treeDataSimpleMode
        style={{ width: '100%' }}
        value={value}
        dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
        onChange={onChange}
        loadData={onLoadData}
        treeData={treeData}
        onSearch={onSearch}
        allowClear={true}
        treeNodeFilterProp={"title"}
      //multiple={props.multiple}
      />
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm">{meta.error}</div>
      ) : null}
    </>
  );
}