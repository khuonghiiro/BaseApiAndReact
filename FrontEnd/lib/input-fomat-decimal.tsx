import React, { useEffect, useState } from "react";
import { useFormikContext, useField } from "formik";
import CurrencyInput from "react-currency-input-field";
export const TanetDecimal = ({
  label = "",
  view = false,
  required = false,
  textValue = "",
  defaultValue = null,
  url = "",
  fieldSearch = "",
  paramDefault = "",
  className = "",
  ...props
}) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const { name } = props;
  const [field, meta] = useField(props);
  const { setFieldValue } = useFormikContext();
  const [value, setValue] = useState<any>(defaultValue);
  const onChange = (value: any) => {
    setFieldValue(name, value);
    if (props.onChange) {
      props.onChange({
        persist: () => {},
        target: {
          type: "change",
          id: props.id || null,
          name: props.name,
          value: value,
        },
      });
    }
  };

  return (
    <>
      {label && (
        <label
          htmlFor={props.id || props.name}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
          {required ? <span className="text-red-500"> (*)</span> : ""}
        </label>
      )}
      <CurrencyInput
        {...props}
        disabled={view}
        className={`text-input block w-full ${
          label && "mt-2"
        } rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
          view && "cursor-not-allowed bg-gray-200"
        }`}
        //defaultValue={field.value}
        value={field.value}
        decimalsLimit={4}
        onValueChange={onChange}
        intlConfig={{ locale: "vi-VN" }}
        decimalSeparator="."
        groupSeparator=","
      />

      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm">{meta.error}</div>
      ) : null}
    </>
  );
};
