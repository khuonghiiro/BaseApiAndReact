/* eslint-disable @next/next/no-img-element */
import { FormikErrors, useField } from "formik";
import { useMemo, useState, useEffect, lazy } from "react";
import { useDropzone } from "react-dropzone";
import { ApiUrl, UpFileErr } from "@/public/app-setting";
import { MdDelete } from "react-icons/md";
import { MdRemoveRedEye } from "react-icons/md";
import { MdFileDownload } from "react-icons/md";
import { useFormikContext } from "formik";
import Image from "next/image";
import { IoAddCircleOutline } from "react-icons/io5";
import ShowFileModal from "./show-file-modal";

// const ShowFileModal = lazy(() => import('./show-file-modal'));

interface FormatDropzone {
  errors?: FormikErrors<{ fileAttachs?: any }>;
  fileType: string;
  maxFiles: number;
  action: string;
  onDataUpdate?: any;
  data?: any[];
  nameAttach: string;
  loading?: any;
  displayImage?: any;
  label?: string;
  required?: boolean;
}

const baseStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  flexDirection: "column" as 'column',
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#2196f3",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#2196f3",
  outline: "none",
  transition: "border .24s ease-in-out",
  minHeight: '140px',
};

const focusedStyle: React.CSSProperties = {
  borderColor: "#2196f3",
};

const acceptStyle: React.CSSProperties = {
  borderColor: "#00e676",
};

const rejectStyle: React.CSSProperties = {
  borderColor: "#ff1744",
};

export const FileAttach = ({
  errors,
  fileType,
  maxFiles,
  action,
  nameAttach,
  displayImage,
  label,
  required,
}: FormatDropzone) => {
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: {}, // file type hợp lệ
    noClick: true,
    noKeyboard: true,
    maxFiles: maxFiles, // max files được upload
    onDrop: (acceptedFiles) => {
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      configFile(acceptedFiles);
    },
  });

  const [field, meta] = useField(nameAttach);
  const isAvatar = (maxFiles == 1 && fileType == "fileImage") ? true : false;
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
      ...(isAvatar ? {
        justifyContent: "center", padding: '0 !important'
      } : {}),

    }),
    [isFocused, isDragAccept, isDragReject, isAvatar]
  );

  const { setFieldValue } = useFormikContext();

  //danh sách file có trong component không bao gồm file lỗi
  const [errorMaxFiles, setErrorMaxFiles] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | any>(null);
  const lsttypeFile = getTypeFile(fileType);
  const maxSize = 50;

  /**
   *
   * @param file lấy danh sách định dạng file được dùng
   * @returns
   */
  function getTypeFile(file: string) {
    switch (file) {
      case "fileImage":
        return ["jpg", "jpeg", "png"];
      case "fileAllImage":
        return ["jpg", "jpeg", "png", "gif"];
      case "fileDocument":
        return ["doc", "docx", "xls", "xlsx", "pdf"];
      case "fileExcel":
        return ["xls", "xlsx"];
      case "fileAll":
        return ["doc", "docx", "xls", "xlsx", "pdf", "jpg", "jpeg", "png"];
      default:
        return [];
    }
  }

  function onChangeHandler(event: any) {
    let files: File[] = new Array<File>();
    files = event.target.files;
    if (UpFileErr == 0) configFile(files);
    else configFile1(files);
  }

  function configFile1(files: any) {
    let totalFiles = [...files];
    // check file type hợp lệ
    let totalArr = Array.from(totalFiles).map((file: any, index: number) => {
      if (isAvatar) {
        if (index == 0) {
          file.preview = URL.createObjectURL(file);
          file.filetype = file.name.split(".").pop();
          file.title = file.name;
          file.error = new Array();
          if (checkFileType(file.filetype) !== "")
            file.error.push(checkFileType(file.name.split(".").pop()));

          if (checkSize(file.size) !== "") file.error.push(checkSize(file.size));

          return file;
        }
      }
      else {
        file.preview = URL.createObjectURL(file);
        file.filetype = file.name.split(".").pop();
        file.title = file.name;
        file.error = new Array();
        if (checkFileType(file.filetype) !== "")
          file.error.push(checkFileType(file.name.split(".").pop()));
        if (checkSize(file.size) !== "") file.error.push(checkSize(file.size));
        return file;
      }

    });
    // check nếu tồn tại rồi xóa file cũ thay thế file mới
    if (!isAvatar) {
      if (action == "add" && field.value) {
        field.value?.forEach((element: any) => {
          if (totalArr.filter((file) => file.name === element.name).length == 0)
            totalArr.push(element);
        });
      }
      //trong trường hợp sửa sẽ vẫn thêm file mới
      else {
        field.value?.forEach((element: any) => {
          totalArr.push(element);
        });
      }
    }
    let arrRe = new Array();
    totalArr.map((x) => {
      if (!x.error || (x.error && x.error.length == 0)) arrRe.push(x);
    });
    if (arrRe.length > maxFiles) {
      setErrorMaxFiles(true);
    } else {
      setErrorMaxFiles(false);
      setFieldValue(nameAttach, arrRe);
    }
  }

  function configFile(files: any) {
    let totalFiles = [...files];
    // check file type hợp lệ
    let totalArr = Array.from(totalFiles).map((file: any) => {
      file.preview = URL.createObjectURL(file);
      file.filetype = file.name.split(".").pop();
      file.title = file.name;
      file.error = new Array();
      if (checkFileType(file.filetype) !== "")
        file.error.push(checkFileType(file.name.split(".").pop()));

      if (checkSize(file.size) !== "") file.error.push(checkSize(file.size));

      return file;
    });

    // Lọc ra những file có định dạng hợp lệ
    let validFiles = totalArr.filter(
      (x) => !x.error || (x.error && x.error.length === 0)
    );

    // Trường hợp thêm file mới trong quá trình sửa đổi
    if (action === "add" && field.value) {
      field.value?.forEach((element: any) => {
        if (
          validFiles.filter((file) => file.name === element.name).length === 0
        ) {
          validFiles.push(element);
        }
      });
    }
    // Trường hợp sửa đổi vẫn thêm file mới
    else {
      field.value?.forEach((element: any) => {
        validFiles.push(element);
      });
    }
    // Truyền vào state chỉ những file hợp lệ
    if (isAvatar) {
      setFieldValue(nameAttach, validFiles);
    }
    else {
      setFieldValue(nameAttach, [...validFiles]);
    }
    // Kiểm tra số lượng file
    if (validFiles.length > maxFiles) {
      setErrorMaxFiles(true);
    } else {
      setErrorMaxFiles(false);
    }
  }

  function checkSize(size: any) {
    if (maxSize * 1000000 >= size) return "";
    else return "Dung lượng file vượt quá cho phép";
  }

  // xóa file
  function deleteFiles(e: any) {
    var array = field.value;
    var index = array?.indexOf(e);
    if (index !== -1 && array !== undefined) {
      array.splice(index, 1);
    }

    let arrRe = new Array();
    array.map((x: any) => {
      if (!x.error || (x.error && x.error.length == 0)) arrRe.push(x);
    });
    if (arrRe.length > maxFiles) {
      setErrorMaxFiles(true);
    } else {
      setErrorMaxFiles(false);
    }
    setFieldValue(nameAttach, arrRe);
  }

  // check file type hợp lệ
  function checkFileType(file: string): string {
    if (lsttypeFile.indexOf(file.toLowerCase()) > -1) return "";
    else return "Định dạng file không được phép tải lên";
  }


  function shortText(file: any, length: any) {
    if (file.title.length > length) {
      if (file.format) {
        return file.title.slice(0, length - 2) + ".." + file.format;
      } else {
        return file.title.slice(0, length - 2) + ".." + file.filetype;
      }
    } else {
      return file.title;
    }
  }

  const showPreviewFile = async (file: any) => {
    console.log("showPreviewFile", file);
    setSelectedFile(file);
  };

  const onDownload = async (file: any) => {
    let a = document.createElement("a");
    a.href = ApiUrl + "fileupload/api/file/download/" + file.guiid;
    a.target = "_blank";
    a.click();
  };

  return (
    <div style={{ maxWidth: isAvatar ? '150px' : '100%' }}>
      {label && (
        <>
          {action == "read" ?
            <label
              className="block text-sm font-semibold leading-6 text-gray-900"
              style={{ color: '#7f7f7f' }}
            >
              {label}
              {required ? <span className="text-red-500"> (*)</span> : ""}
            </label>
            :
            <label
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              {label}
              {required ? <span className="text-red-500"> (*)</span> : ""}
            </label>
          }
        </>
      )}

      <section className="container" >
        <div {...getRootProps({ style })}>
          {!isAvatar && <p className="mb-2 text-gray-500 text-xs">
            (Định dạng cho phép: {lsttypeFile.toString()})
          </p>}
          {action == "add" || action == "edit" ? (
            isAvatar ? <>
              {(field.value && field.value.length > 0) ? <label htmlFor={nameAttach + "file-input"}><img
                title={field.value[0].title}
                src={field.value[0].id ? `${ApiUrl}fileupload/api/file/${field.value[0].guiid}` : field.value[0].preview}
                alt={field.value[0].title}
                style={{ minHeight: 140 }}
              /> </label> :
                <button
                  type="button"
                  className=""
                >
                  <label htmlFor={nameAttach + "file-input"}><IoAddCircleOutline style={{ fontSize: 50, cursor: 'pointer' }} /></label>
                </button>}
            </> :
              <button
                type="button"
                className="bg-green-400 cursor-pointer flex hover:bg-green-500 px-5 py-2 text-sm leading-5 rounded-md font-semibold text-white"
              >
                <label htmlFor={nameAttach + "file-input"}>
                  Thêm tệp
                </label>
              </button>
          ) : (
            <></>
          )}
          <input
            type="file"
            id={nameAttach + "file-input"}
            className="hidden"
            onChange={(e) => {
              onChangeHandler(e);
            }}
            multiple={maxFiles > 1 ? true : false}
          />
          {isAvatar ? (action == "read" && field.value && field.value.length > 0) ? <img
            title={field.value[0].title}
            src={field.value[0].id ? `${ApiUrl}fileupload/api/file/${field.value[0].guiid}` : field.value[0].preview}
            alt={field.value[0].title}
            style={{ minHeight: 140 }}
          /> : '' : <><hr />
            <ul>
              <div className="flex ">
                {Array.isArray(field.value) && field.value.map((file: File | any, index: number) => {
                  return (
                    <div key={index}>
                      <li
                        className=""
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        {
                          <>
                            <div style={{ margin: "0px", marginLeft: "10px" }}>
                              {displayImage == true ? (
                                <div>
                                  {file.filetype == "doc" ||
                                    file.filetype == "docx" ||
                                    file.format == ".doc" ||
                                    file.format == ".docx" ? (
                                    <div>
                                      <Image
                                        title={file.title}
                                        src="/doc.png"
                                        alt="File Word"
                                        height={80}
                                        width={80}
                                      />
                                    </div>
                                  ) : (
                                    <div>
                                      {file.filetype == "xls" ||
                                        file.filetype == "xlsx" ||
                                        file.format == ".xls" ||
                                        file.format == ".xlsx" ? (
                                        <div>
                                          <Image
                                            title={file.title}
                                            src="/excel.png"
                                            alt="File Excel"
                                            height={80}
                                            width={80}
                                          />
                                        </div>
                                      ) : (
                                        <div>
                                          {file.filetype == "pdf" ||
                                            file.format == ".pdf" ? (
                                            <div>
                                              <Image
                                                title={file.title}
                                                src="/pdf.png"
                                                alt="File PDF"
                                                height={80}
                                                width={80}
                                              />
                                            </div>
                                          ) : (
                                            <div>
                                              {fileType == "fileImage" ? (
                                                <div>
                                                  {file.id ? (
                                                    <div>
                                                      <Image
                                                        title={file.title}
                                                        src={`${ApiUrl}fileupload/api/file/${file.guiid}`}
                                                        alt="Không có hiển thị 2"
                                                        height={80}
                                                        width={80}
                                                      />
                                                    </div>
                                                  ) : (
                                                    <div>
                                                      <Image
                                                        title={file.title}
                                                        src={file.preview}
                                                        alt="Không có hiển thị"
                                                        height={80}
                                                        width={80}
                                                      />
                                                    </div>
                                                  )}
                                                </div>
                                              ) : (
                                                <div></div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div></div>
                              )}
                              <div className="flex flex-row">
                                <p title={file.title}>{shortText(file, 20)}</p>
                                {action == "add" || action == "edit" ? (
                                  <div className="flex flex-row">
                                    {file.id && <button
                                      type="button"
                                      className="ml-1"
                                      onClick={() => onDownload(file)}
                                    >
                                      <MdFileDownload />
                                    </button>}
                                    <button
                                      type="button"
                                      className="ml-1"
                                      style={{ color: "red" }}
                                      onClick={() => deleteFiles(file)}
                                    >
                                      <MdDelete />
                                    </button>
                                    <small
                                      style={{ color: "red", marginLeft: "10px" }}
                                    >
                                      {file.error?.map((err: any, index: any) => {
                                        return <span key={index}>{err} </span>;
                                      })}
                                    </small>
                                  </div>
                                ) : (
                                  <div className="flex flex-row">
                                    {file.id && <button
                                      type="button"
                                      className="ml-1"
                                      onClick={() => showPreviewFile(file)}
                                    >
                                      <MdRemoveRedEye />
                                    </button>}
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        }
                      </li>
                      {action == "read" ? (
                        <ShowFileModal
                          isShow={!!selectedFile}
                          isLoading={false}
                          onClose={() => setSelectedFile(null)}
                          file={selectedFile}
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                  );
                })}
              </div>
              <div>
                {errorMaxFiles == true ? (
                  <p style={{ color: "red" }}>
                    Số file tải lên vượt quá mức quy định!
                  </p>
                ) : (
                  ""
                )}
              </div>
            </ul></>}
        </div>
      </section >
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm">{meta.error}</div>
      ) : null}
    </div >
  );
};

export const ViewAvatar = ({ data, width, height }: { data: string; width?: number; height?: number; }) => {
  const jsonData = data ? JSON.parse(data) : [];

  return <div>
    {
      jsonData.length > 0 && <img src={ApiUrl + "fileupload/api/file/" + jsonData[0].guiid} alt={jsonData[0].title} style={{ width: width ?? '120px', height: height ?? '120px' }} />
    }
  </div>;

}