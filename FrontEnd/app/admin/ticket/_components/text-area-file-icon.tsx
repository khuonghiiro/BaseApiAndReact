/* eslint-disable @next/next/no-img-element */
import { FormikErrors, useField } from "formik";
import { useMemo, useState, useEffect, useRef, ChangeEvent } from "react";
import { useDropzone } from "react-dropzone";
import { ApiUrl, UpFileErr } from "@/public/app-setting";
import { MdDelete } from "react-icons/md";
import { MdRemoveRedEye } from "react-icons/md";
import { MdFileDownload } from "react-icons/md";
import { useFormikContext } from "formik";
import Image from "next/image";
import { Modal } from "@/shared/components/modal";
import { IoAddCircleOutline } from "react-icons/io5";
import { FaPaperPlane } from 'react-icons/fa';
import { MdOutlineAttachFile } from "react-icons/md";
import { toast } from "react-toastify";

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

    textAreaId: string;
    textAreaName: string;
    placeholderText: string;
    onClickButtonSend: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const baseStyle = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
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

const focusedStyle = {
    borderColor: "#2196f3",
};

const acceptStyle = {
    borderColor: "#00e676",
};

const rejectStyle = {
    borderColor: "#ff1744",
};
export const TextAreaFileIcon = ({
    errors,
    fileType,
    maxFiles,
    action,
    nameAttach,
    displayImage,
    label,
    required,

    textAreaId,
    textAreaName,
    placeholderText,
    onClickButtonSend
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
    const [fieldTextArea, metaTextArea] = useField(textAreaName);
    const isAvatar = (maxFiles == 1 && fileType == "fileImage") ? true : false;
    const [isTextAreaFocused, setIsTextAreaFocused] = useState(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "40px"; // Chiều cao ban đầu
            textAreaRef.current.style.height = Math.min(textAreaRef.current.scrollHeight, 150) + "px";
            setIsExpanded(textAreaRef.current.scrollHeight > 40);
            setIsTextAreaFocused(false);
        }
    }, [isTextAreaFocused]);

    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setFieldValue(textAreaName, e.target.value);
        setIsTextAreaFocused(false);

        if (textAreaRef.current) {
            textAreaRef.current.style.height = "40px"; // Đặt lại chiều cao trước khi tính toán lại
            textAreaRef.current.style.height = Math.min(textAreaRef.current.scrollHeight, 150) + "px";
            setIsExpanded(textAreaRef.current.scrollHeight > 40);
        }
    };


    const onClickButtonTextAreaSend = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        onClickButtonSend(ev);
        if (textAreaRef.current) {
            textAreaRef.current.value = "";
            textAreaRef.current.style.height = "40px"; // Đặt lại chiều cao trước khi tính toán lại
            textAreaRef.current.style.height = Math.min(textAreaRef.current.scrollHeight, 150) + "px";
        }
    }

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

    const [previewFile, setPreviewFile] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);

    const showPreviewFile = async () => {
        setPreviewLoading(true);
        setPreviewFile(true);
        setPreviewLoading(false);
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
                <div className="">
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
                        src={field.value[0].id ? `${ApiUrl}identity/${field.value[0].url}` : field.value[0].preview}
                        alt={field.value[0].title}
                        style={{ minHeight: 140 }}
                    /> : '' : <>
                        <ul className="flex overflow-x-auto">
                            <div className="flex ">
                                {Array.isArray(field.value) && field.value.map((file: File | any, index: number) => {
                                    return (
                                        <div key={index} className="w-[120px] h-[50px] border border-blue-500 border-dashed m-0 mb-1 mr-1 p-1">
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
                                                                                height={20}
                                                                                width={20}
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
                                                                                        height={20}
                                                                                        width={20}
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
                                                                                                height={20}
                                                                                                width={20}
                                                                                            />
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div>
                                                                                            {(file.filetype === "png" ||
                                                                                                file.filetype === "jpg"
                                                                                            ) && (
                                                                                                    <div>
                                                                                                        {file.id ? (
                                                                                                            <Image
                                                                                                                title={file.title}
                                                                                                                src={`${ApiUrl}identity/${file.url}`}
                                                                                                                alt={file.title}
                                                                                                                height={20}
                                                                                                                width={20}
                                                                                                                className="w-5 h-5"
                                                                                                            />
                                                                                                        ) : (
                                                                                                            <Image
                                                                                                                title={file.title}
                                                                                                                src={file.preview}
                                                                                                                alt={file.title}
                                                                                                                height={20}
                                                                                                                width={20}
                                                                                                                className="w-5 h-5"
                                                                                                            />
                                                                                                        )}
                                                                                                    </div>
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
                                                            <div className="flex flex-row text-[12px]">
                                                                <p title={file.title} className="truncate">{shortText(file, 10)}</p>
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
                                                                            onClick={() => onDownload(file)}
                                                                        >
                                                                            <MdFileDownload />
                                                                        </button>}
                                                                        <button
                                                                            type="button"
                                                                            className="ml-1"
                                                                            onClick={() => showPreviewFile()}
                                                                        >
                                                                            <MdRemoveRedEye />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </>
                                                }
                                            </li>
                                            {action == "read" ? (
                                                <Modal
                                                    show={previewFile}
                                                    loading={previewLoading}
                                                    size="heightfull"
                                                >
                                                    <>
                                                        <Modal.Header onClose={() => setPreviewFile(false)}>
                                                            Xem trước {file.title}
                                                        </Modal.Header>
                                                        {file.format == ".doc" ||
                                                            file.format == ".docx" ||
                                                            file.format == ".xls" ||
                                                            file.format == ".xlsx" ||
                                                            file.format == ".pdf" ? (
                                                            <iframe
                                                                //src="https://docs.google.com/gview?url=https://download.microsoft.com/download/1/4/E/14EDED28-6C58-4055-A65C-23B4DA81C4DE/Financial%20Sample.xlsx&embedded=true"
                                                                src={`https://docs.google.com/gview?url=${ApiUrl + file.urlView
                                                                    }&embedded=true`}
                                                                frameBorder="0"
                                                            ></iframe>
                                                        ) : (
                                                            <div className="flex justify-center align-center">
                                                                <Image
                                                                    title={""}
                                                                    src={`${ApiUrl}identity/${file.url}`}
                                                                    alt="Không có hiển thị"
                                                                    width={500}
                                                                    height={500}
                                                                />
                                                            </div>
                                                        )}
                                                    </>
                                                </Modal>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </ul>
                        <div className="text-[12px] my-2">
                            {errorMaxFiles == true ? (
                                <p style={{ color: "red" }}>
                                    Số file tải lên vượt quá mức quy định!
                                </p>
                            ) : (
                                ""
                            )}
                        </div>
                    </>}
                </div>
                {action == "add" || action == "edit" ? (
                    isAvatar ? <>
                        {(field.value && field.value.length > 0) ? <label htmlFor={nameAttach + "file-input"}><img
                            title={field.value[0].title}
                            src={field.value[0].id ? `${ApiUrl}identity/${field.value[0].url}` : field.value[0].preview}
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

                        <>
                            <div className="relative mr-0.5">
                                <textarea
                                    ref={textAreaRef}
                                    required={required}
                                    id={textAreaId}
                                    name={textAreaName}
                                    placeholder={placeholderText}
                                    className="bg-white w-full pr-[45px] text-black border border-gray-300 leading-6 text-[14px] pl-8 resize-none overflow-hidden focus:border-blue-500"
                                    onFocus={() => setIsTextAreaFocused(true)}
                                    onBlur={() => setIsTextAreaFocused(false)}
                                    onChange={handleTextChange}
                                    style={{
                                        height: "40px",
                                        overflow: "hidden",
                                        maxHeight: "100px",
                                        borderRadius: isExpanded ? "20px" : "50px",
                                        transition: "border-radius 0.1s ease"
                                    }} // Chiều cao ban đầu và chiều cao tối đa, border-radius
                                />
                                <div className={`absolute ${isExpanded ? "left-[10px] bottom-[12px]" : "left-[10px] top-[10px]"} transition-all duration-300`} >
                                    <label htmlFor={nameAttach + "file-input"} className="cursor-pointer">
                                        <MdOutlineAttachFile size={20} />
                                    </label>
                                </div>
                                <div className={`absolute ${isExpanded ? "bottom-[12px]" : "top-[10px]"} right-0 transition-all duration-300`}>
                                    <button
                                        className="px-2.5 pl-2.5 bg-transparent hover:text-blue-400 text-blue-500 border-none cursor-pointer flex items-center justify-center"
                                        onClick={(ev) => onClickButtonTextAreaSend(ev)}
                                    >
                                        <FaPaperPlane size={20} />
                                    </button>
                                </div>
                            </div>
                        </>

                ) : (
                    <></>
                )}
            </section >
            {meta.touched && meta.error ? (
                <div className="text-red-500 text-sm">{meta.error}</div>
            ) : null}
            {metaTextArea.touched && metaTextArea.error ? (
                <div className="text-red-500 text-sm">{metaTextArea.error}</div>
            ) : null}
        </div >

    );
};

export const ViewAvatar = ({ data, width, height }: { data: string; width?: number; height?: number; }) => {
    const jsonData = data ? JSON.parse(data) : [];

    return <div>
        {
            jsonData.length > 0 && <img src={ApiUrl + "identity/" + jsonData[0].url} alt={jsonData[0].title} style={{ width: width ?? '120px', height: height ?? '120px' }} />
        }
    </div>;

}
