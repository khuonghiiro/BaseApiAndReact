import React, { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import { useFormikContext, useField } from "formik";
import { commonServices } from "./services";

type MyOption = {
  label: string;
  value: any;
};
//define the group option type
type GroupedOption = {
  label: string; // group label
  options: MyOption[];
};

export const TanetSelectAsyn = (props: Props) => {
  const { name, label, view, required, ...restProps } = props;
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  const [value, setValue] = useState();
  const [defaultValue, setDefaultValue] = useState();
  const promiseOptions = async (inputValue: string) => {
    const data = await commonServices.getDataSelect(
      props.url,
      inputValue,
      props.fieldSearch
    );
    if (data) {
      return new Promise((resolve) => {
        resolve(
          data.data.map((item: any) => {
            return {
              value: item.id,
              label: item.title,
            };
          })
        );
      });
    } else {
      return new Promise((resolve) => {
        resolve([]);
      });
    }
  };

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
      <AsyncSelect
        {...restProps}
        isMulti
        cacheOptions
        defaultOptions
        value={value}
        isDisabled={view}
        loadOptions={promiseOptions}
      />
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm">{meta.error}</div>
      ) : null}
    </div>
  );
};
