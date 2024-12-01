import React, { useState, useContext, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdFilterListAlt } from "react-icons/md";
import TanetSelect from "react-select";
import { TanetInput, TanetCheckbox } from "@/lib";
import { Formik, Form } from "formik";
import { GridViewContext } from "./grid-view";
import { DefaultMeta } from "@/public/app-setting";
import { optionsTextFilter, optionsNumberFilter } from "./filter-option";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";

export default function ToggleVisibility(props: any) {
  const contextValue = useContext(GridViewContext);
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
  });
  const optionsText = optionsTextFilter;
  const optionsNumber = optionsNumberFilter;
  const [newMeta, setNewMeta] = useState("");
  const [keySearch, setKeySearch] = useState("");
  const [valueOption, setValueOption] = useState("");
  const [show, setShow] = useState();
  const [isActive, setIsActive] = useState({
    id: "title",
  });
  const [valueDateTime, setvalueDateTime] = useState(
    new Date().toLocaleDateString("vi-VN")
  );
  function toggleShow(e: any) {
    setShow(!show);
  }

  const customStyles = {
    option: (provided: any) => ({
      ...provided,
      color: "black",
      textTransform: "none",
    }),
    control: (provided: any) => ({
      ...provided,
      color: "black",
      textTransform: "none",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "black",
      textTransform: "none",
    }),
  };

  function onClose() {
    setShow(!show);
  }
  useEffect(() => {
    if (keySearch) {
      setKeySearch(keySearch);
    }

    if (valueDateTime) {
      setvalueDateTime(keySearch);
    }
  }, [keySearch, valueDateTime, isActive]);

  const handleClick = (e: any) => {
    let obj = {
      column: props.filterName,
      value: keySearch,
      option: valueOption,
    };
    processHanleChange("filterChange", obj, contextValue);
    setShow(!show);
  };
  const handleKeyDown = (ev: any, contextValue: any) => {
    if (ev.key === "Enter") {
      const keySearch = ev.currentTarget?.value;
      processHanleChange(
        "changeKeySearch",
        { search: keySearch },
        contextValue
      );
      setShow(!show);
    }
  };

  const hideShowDiv = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    setIsActive({
      id: e.target.id,
    });
  };

  const processHanleChange = (event: any, data: any, contextValue: any) => {
    if (contextValue && contextValue.gridViewHandleChange) {
      contextValue.gridViewHandleChange({ event: event, data: data });
    }
  };

  let buttonText = null;
  if (show) {
    buttonText = <MdFilterListAlt />;
  } else if (!show && (keySearch || valueDateTime || valueOption)) {
    buttonText = <MdFilterListAlt />;
  } else {
    buttonText = (
      <BsThreeDotsVertical
        id={props.filterName}
        onClick={(e) => {
          hideShowDiv(e);
        }}
      />
    );
  }

  const handleChangeDate = (newValue: any) => {
    const dateFormat = new Date(newValue).toLocaleDateString("vi-VN");
    setvalueDateTime(dateFormat);
    setKeySearch(dateFormat);
  };

  return (
    <div className="component-container">
      {show && (
        <div className="default-container text-left">
          <div>
            <label className="checkbox-input ">{props.title}</label>
            {(props.typeColumn == "text" || props.typeColumn == "date") && (
              <TanetSelect
                className=" mb-2 mt-2 option-value"
                isClearable
                options={optionsText}
                value={optionsText.find(function (option) {
                  return option.value === valueOption;
                })}
                styles={customStyles}
                onChange={(e: any) => {
                  setValueOption(e?.value);
                }}
              />
            )}

            {props.typeColumn == "number" && (
              <TanetSelect
                className=" mb-2 mt-2 option-value"
                isClearable
                options={optionsNumber}
                value={optionsNumber.find(function (option) {
                  return option.value === valueOption;
                })}
                styles={customStyles}
                onChange={(e: any) => {
                  setValueOption(e?.value);
                }}
              />
            )}

            {props.typeColumn == "text" && (
              <input
                type="text"
                value={keySearch}
                onChange={(ev: any) => {
                  setKeySearch(ev.target?.value);
                }}
                onKeyDown={(ev: any) => {
                  handleKeyDown(ev, contextValue);
                }}
                placeholder="Nhập từ khóa"
                className="mb-2 text-input block w-full mt-2 rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus-visible:outline-none"
              />
            )}

            {props.typeColumn == "date" && (
              <DatePicker
                isClearable
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn ngày/tháng"
                onChange={handleChangeDate}
                value={valueDateTime}
                autoComplete="off"
                dropdownMode="select"
                className={`mb-2 block w-full mt-2 rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
              />
            )}

            {props.typeColumn == "select" && props.filterOption && (
              <TanetSelect
                isClearable
                className=" mb-2 mt-2"
                styles={customStyles}
                options={props.filterOption}
                value={props.filterOption?.find(function (option: {
                  value: string;
                }) {
                  return option.value === valueOption;
                })}
                onChange={(e: any) => {
                  setValueOption(e?.value);
                }}
              />
            )}

            {props.typeColumn == "boolean" && <div></div>}
          </div>

          <div className="flex" style={{ justifyContent: "space-between" }}>
            <button
              type="submit"
              className="btn-apply"
              onClick={(e) => {
                handleClick(e, contextValue);
              }}
            >
              Áp dụng
            </button>
            <button type="submit" className="btn-close" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      )}

      {props.typeColumn && (
        <a
          title="Lọc kết quả"
          style={{ cursor: "pointer" }}
          onClick={toggleShow}
        >
          {buttonText}
        </a>
      )}
    </div>
  );
}
