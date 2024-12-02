/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef } from "react";
import { ApiUrl } from "@/public/app-setting";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useFormikContext } from "formik";
import { BaseService, useCustomSWR } from "@/shared/services";

interface IFieUpload {
  multiple?: boolean;
  action?: string;
  name?: string;
  id?: string;
  value?: any;
  onChange?: any | null;
  fileType?: string[] | null;
  textChoose?: string | null;
}

export const FileAttachGrid = ({
  action,
  name,
  id,
  value,
  multiple,
  onChange,
  fileType,
  textChoose,
}: IFieUpload) => {
  const maxSize = 50;
  const types = fileType ?? [
    "doc",
    "docx",
    "xls",
    "xlsx",
    "pdf",
    "jpg",
    "jpeg",
    "png",
  ];
  const { setFieldValue } = useFormikContext();
  const [data, setData] = useState(value ? JSON.parse(value) : null);
  const service = new BaseService("");
  useEffect(() => {}, [action, id, name]);
  const fileInputRef = useRef(null);
  const handleClick = () => {
    fileInputRef.current.click();
  };
  const onChangeFile = async (e: any) => {
    if (e.target.files) {
      let formData = new FormData();
      for (var i = 0; i < e.target.files.length; i++) {
        var size = e.target.files[i].size / 1048576;
        let check = true;
        var fileExtension = e.target.files[i].name.split(".").pop();
        if (types.indexOf(fileExtension) == -1) {
          check = false;
          alert("File không đúng định dạng cho phép là " + types.join(", "));
          return false;
        }
        if (maxSize * 1000000 < size) {
          check = false;
          alert("Dung lượng file vượt quá cho phép");
          return false;
        }

        if (check) formData.append("files", e.target.files[i]);
      }
      if (formData.has("files")) {
        try {
          const result = await service.uploadFile(formData);
          if (result.length > 0) {
            if (multiple) {
              setData(result);
            } else {
              setData(result[0]);
              if (name) setFieldValue(name, JSON.stringify(result[0]));
              if (onChange) {
                onChange({
                  persist: () => {},
                  target: {
                    type: "change",
                    id: id || null,
                    name: name,
                    value: JSON.stringify(result[0]),
                  },
                });
              }
            }
          }
        } catch (err: any) {
          console.log(err);
          alert(err);
        }
      }
    }
  };
  const onDownload = async (url: any) => {
    let res = await service.gettime();
    let a = document.createElement("a");
    a.href = ApiUrl + url + "/" + res;
    a.target = "_blank";
    a.click();
  };
  const onDelete = () => {
    setData(null);
    if (name) setFieldValue(name, "");
    if (onChange) {
      onChange({
        persist: () => {},
        target: {
          type: "change",
          id: id || null,
          name: name,
          value: "",
        },
      });
    }
  };
  return (
    <>
      {multiple ? (
        <></>
      ) : (
        data && (
          <>
            <div className="flex">
              <a
                onClick={() => onDownload(data?.url)}
                href="#"
                className="font-semibold text-blue-900 underline dark:text-white decoration-indigo-500"
              >
                {data?.title}
              </a>
              {action != "read" && (
                <MdDelete
                  onClick={() => onDelete()}
                  title="Xóa"
                  className="cursor-pointer text-base text-red-800 ml-2"
                />
              )}
            </div>
          </>
        )
      )}

      {action != "read" && (
        <>
          {multiple ? (
            <></>
          ) : data ? (
            ""
          ) : (
            <>
              {textChoose ? (
                <a
                  className="cursor-pointer text-sm underline text-blue-600"
                  onClick={handleClick}
                >
                  {textChoose}
                </a>
              ) : (
                <div style={{ float: "right" }}>
                  <MdEdit
                    onClick={handleClick}
                    title="Cập nhật"
                    className="cursor-pointer text-base text-blue-800"
                  />
                </div>
              )}
            </>
          )}

          <input
            style={{ display: "none" }}
            type="file"
            multiple={multiple}
            onChange={(e) => onChangeFile(e)}
            ref={fileInputRef}
          />
        </>
      )}
    </>
  );
};
