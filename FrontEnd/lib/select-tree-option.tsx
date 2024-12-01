import React, { useEffect, useState } from "react";
import { useFormikContext, useField } from "formik";
import { TreeSelect } from "antd";
const { SHOW_PARENT } = TreeSelect;

type MyOption = {
  label: string;
  value: any;
};
//define the group option type
type GroupedOption = {
  label: string; // group label
  options: MyOption[];
};

export const TanetSelectTreeCheck = (props: any) => {
  const { name, label, view, required, className, ...restProps } = props;
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  const [value, setValue] = useState(field.value);
  const [treeData, setTreeData] = useState(props.data);
  useEffect(() => {}, []);

  const onChange = (newValue: string[]) => {
    setValue(newValue);
    setFieldValue(name, newValue);
    if (props.onChange) {
      props.onChange({
        persist: () => {},
        target: {
          type: "change",
          id: props.id || null,
          name: props.name,
          value: newValue,
        },
      });
    }
  };

  const getAllValues = (data: any[]) => {
    // Tạo một mảng để lưu trữ các giá trị
    let values: any[] = [];

    // Hàm đệ quy để duyệt qua từng phần tử và phần tử con (nếu có)
    const traverse = (node: { value: any; children: any[] }) => {
      values.push(node.value); // Thêm giá trị của node vào mảng

      // Nếu node có children, tiếp tục duyệt qua các children
      if (node.children && node.children.length > 0) {
        node.children.forEach((child: any) => traverse(child));
      }
    };

    // Duyệt qua từng phần tử trong mảng data và gọi hàm traverse
    data.forEach((item: any) => traverse(item));
    return values;
  };
  const allIds = getAllValues(treeData);
  return (
    <div>
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
        {required ? <span className="text-red-500"> (*)</span> : ""}
      </label>
      <TreeSelect
        {...restProps}
        className={`block w-full mt-2 ${className}`}
        disabled={view}
        allowClear={true}
        treeLine={true}
        placeholder="Chọn"
        treeCheckable={true}
        showCheckedStrategy={TreeSelect.SHOW_ALL}
        treeNodeFilterProp={"title"}
        onChange={onChange}
        value={field.value}
        maxTagCount={3}
        maxTagPlaceholder={(omittedValues) =>
          `+ ${omittedValues.length} item ...`
        }
        treeData={[
          {
            title: (
              <React.Fragment>
                {value && value.length === treeData.length && (
                  <span
                    style={{
                      display: "inline-block",
                      color: "#ccc",
                      cursor: "not-allowed",
                    }}
                  >
                    Chọn tất cả
                  </span>
                )}
                {(!value || (value && value.length < treeData.length)) && (
                  <span
                    onClick={() => {
                      onChange(allIds);
                      // setValue(allIds);
                      // setFieldValue(name, allIds);
                    }}
                    style={{
                      display: "inline-block",
                      color: "#286FBE",
                      cursor: "pointer",
                    }}
                  >
                    Chọn tất cả
                  </span>
                )}
                &nbsp;&nbsp;&nbsp;
                {value && value.length === 0 && (
                  <span
                    style={{
                      display: "inline-block",
                      color: "#ccc",
                      cursor: "not-allowed",
                    }}
                  >
                    Bỏ chọn
                  </span>
                )}
                {value && value.length > 0 && (
                  <span
                    onClick={() => {
                      onChange([]);
                    }}
                    style={{
                      display: "inline-block",
                      color: "#286FBE",
                      cursor: "pointer",
                    }}
                  >
                    Bỏ chọn
                  </span>
                )}
              </React.Fragment>
            ),
            value: "xxx",
            disableCheckbox: true,
            disabled: true,
          },
          ...treeData,
        ]}
      />

      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm">{meta.error}</div>
      ) : null}
    </div>
  );
};

export const TanetSelectTree = (props: any) => {
  const { name, label, view, required, className, ...restProps } = props;
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  const [value, setValue] = useState(field.value);
  const [treeData, setTreeData] = useState(props.data);
  useEffect(() => {
    setTreeData(props.data);
  }, [props.data]);
  const onChange = (newValue: string[]) => {
    setValue(newValue);
    setFieldValue(name, newValue);
    if (props.onChange) {
      props.onChange({
        persist: () => {},
        target: {
          type: "change",
          id: props.id || null,
          name: props.name,
          value: newValue,
        },
      });
    }
  };

  const getAllValues = (data: any[]) => {
    // Tạo một mảng để lưu trữ các giá trị
    let values: any[] = [];

    // Hàm đệ quy để duyệt qua từng phần tử và phần tử con (nếu có)
    const traverse = (node: { value: any; children: any[] }) => {
      values.push(node.value); // Thêm giá trị của node vào mảng

      // Nếu node có children, tiếp tục duyệt qua các children
      if (node.children && node.children.length > 0) {
        node.children.forEach((child: any) => traverse(child));
      }
    };

    // Duyệt qua từng phần tử trong mảng data và gọi hàm traverse
    data.forEach((item: any) => traverse(item));
    return values;
  };
  const allIds = getAllValues(treeData);
  return (
    <div>
      {label && (
        <label
          htmlFor={props.id || props.name}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
          {required ? <span className="text-red-500"> (*)</span> : ""}
        </label>
      )}
      <TreeSelect
        {...props}
        value={field.value}
        disabled={view}
        treeLine={true}
        className={`block ${
          label && "mt-2"
        } w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  ${className}`}
        treeData={treeData}
        treeDefaultExpandAll={false}
        onChange={onChange}
        treeNodeFilterProp={"title"}
        allowClear={true}
      />
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm">{meta.error}</div>
      ) : null}
    </div>
  );
};
