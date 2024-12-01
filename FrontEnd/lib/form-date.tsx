import React, { useEffect, useState } from "react";
import { useFormikContext, useField } from "formik";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import vi from 'date-fns/locale/vi';
import { parseISO, format, parse } from 'date-fns';
import { formatFullDateTime } from "@/lib/common";
registerLocale('vi', vi);
setDefaultLocale('vi');

export const TanetFormDate = ({
  formatOutput = 'yyyy-MM-dd\'T\'HH:mm:ss.SSS',
  dateFormat = "",
  placeholder = "",
  size = false,
  showTimeSelect = false,
  showTimeSelectOnly = false,
  minDate = null,
  maxDate = null,
  showMonthDropdown = false,
  showYearDropdown = false,
  className = "",
  ...props
}) => {
  const { name, label, view, required, ...restProps } = props;
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  const [valueselect, setValueSelect] = useState<Date>((field && field.value) ? new Date(field.value) : null);
  // useEffect(() => {
  //   let x=field;
  //   if (value)
  //     setValueSelect(new Date(value));
  // }, []);
  const handleChange = (newValue: any) => {
    setValueSelect(newValue);
    const processOutValue = (val: any) => {
      if (val) {
        return format(val, formatOutput);
      } else {
        return val;
      }
    }
    setFieldValue(name, processOutValue(newValue));
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
    };
  }

  return (
    <div>
      {label &&
        <>
          {view ?
            <label
              htmlFor={props.id || props.name}
              className="block text-sm font-medium leading-6 text-gray-900"
              style={{ color: '#7f7f7f' }}
            >
              {label}
              {required ? <span className="text-red-500"> (*)</span> : ""}
            </label>
            :
            <label
              htmlFor={props.id || props.name}
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {label}
              {required ? <span className="text-red-500"> (*)</span> : ""}
            </label>
          }
        </>
      }

      {view ?
        <>
          {field.value &&
            <> {formatFullDateTime(field.value)}</>
          }
        </>
        :
        <DatePicker
          {...props}
          selected={valueselect ?? (field && field.value) ? new Date(field.value) : null}
          disabled={view}
          placeholderText={placeholder ?? dateFormat}
          dateFormat={dateFormat}
          showTimeSelect={showTimeSelect}
          showTimeSelectOnly={showTimeSelectOnly}
          onChange={handleChange}
          autoComplete='off'
          showMonthDropdown={showMonthDropdown}
          showYearDropdown={showYearDropdown}
          dropdownMode="select"
          minDate={minDate}
          maxDate={maxDate}
          // popperProps={{
          //   positionFixed: true  
          // }}
          className={`${label && "mt-2"
            } block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${className} ${view && 'bg-gray-200'}`}
          {...props}
        />
      }

      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm">{meta.error}</div>
      ) : null}
    </div>
  );
};