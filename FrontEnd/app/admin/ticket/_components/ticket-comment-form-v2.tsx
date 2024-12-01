"use client";
import { useState, useEffect, useRef } from "react";
import { ticketServices } from "../services";
import { Formik, Form } from "formik";
import { array, object, string } from "yup";
import { toast } from "react-toastify";
import NameToImage from "@/lib/name-to-image";
import { useAuth } from "@/shared/Context/appAdminContext";
import { TextAreaFileIcon } from "./text-area-file-icon";
import { ACTION_TYPES } from "@/lib";

export const TicketCommentFormV2 = (
    {
        ticketId,
        onReloadForm,
        replyCommentId

    }: { ticketId: number, onReloadForm: (dateTime: Date) => void; replyCommentId?: number | null }) => {
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState<string>("");
    const [fileAttach, setFileAttach] = useState([]);
    const { user } = useAuth();

    const dataDefault = {
        content: comment,
        fileAttach: fileAttach,
    };

    const schema = object({
        content: string().trim().nullable().required('Bình luận không được để trống'),
        fileAttach: array().nullable().max(5, 'Không chọn quá 5 file'),
    });

    const onSubmit = async (values: any, { resetForm, setFieldValue }: any) => {
        setLoading(true);
        try {
            if (ticketId) {
                let input = {
                    ticketId: ticketId,
                    content: values.content,
                    fileAttach: values.fileAttach,
                    commentOldId: replyCommentId
                };

                let resp = await ticketServices.CreateTicketComment(input);
                if (resp) {

                    onReloadForm(new Date());
                    resetForm(); // Đặt lại form sau khi submit thành công
                    // toast.success("Thêm thành công");
                } else {
                    toast.error("Bình luận không thành công");
                }
            } else {
                toast.error("Bình luận không thành công");
            }
        } catch (err: any) {
            toast.error("Có lỗi xảy ra, vui lòng thử lại");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { }, [ticketId]);

    return (
        <>
            <div className={`${replyCommentId ? 'ml-4' : ''}`}>
                {replyCommentId ? <hr className="my-2" /> : <></>}

                <Formik
                    onSubmit={onSubmit}
                    validationSchema={schema}
                    initialValues={dataDefault}
                    enableReinitialize={true}
                >
                    {({ handleSubmit, submitForm, values, errors, touched, setFieldValue }) => (
                        <Form
                            noValidate
                            onSubmit={handleSubmit}
                            onKeyPress={(ev) => { ev.stopPropagation(); }}>
                            <div className="flex w-full py-1 my-2">
                                <div className="flex justify-center items-center px-1">
                                    <NameToImage className="w-8 h-8 rounded-full" filePath={user?.fullName} name={user?.fullName} />
                                </div>

                                <div className="flex-grow flex flex-col w-8/12">
                                    <TextAreaFileIcon
                                        action={ACTION_TYPES.EDIT}
                                        nameAttach='fileAttach'
                                        displayImage={true}
                                        fileType='fileAll'
                                        maxFiles={5}
                                        required={true}
                                        textAreaName="content"
                                        textAreaId="content"
                                        placeholderText="Viết bình luận..."
                                        onClickButtonSend={(ev) => {
                                            ev.preventDefault();
                                            submitForm(); // Gọi submitForm để kích hoạt xác thực và submit
                                            ev.stopPropagation();
                                        }}
                                    />
                                </div>

                            </div>
                            <div className="col-span-12 mt-4">
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>

        </>
    );
}
