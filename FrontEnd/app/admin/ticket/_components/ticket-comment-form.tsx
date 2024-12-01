"use client";
import { useState, useEffect } from "react";
import { ticketServices } from "../services";
import { Formik, Form } from "formik";
import { array, object, string } from "yup";
import { toast } from "react-toastify";
import { TanetTextArea, ACTION_TYPES } from "@/lib";
import { FileAttach } from "@/lib/file-attachment";

export const TicketCommentForm = ({ ticketId, onReloadForm }: { ticketId: number, onReloadForm: (dateTime: Date) => void; }) => {
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState<string>("");
    const [fileAttach, setFileAttach] = useState([]);

    const dataDefault = {
        content: comment,
        fileAttach: fileAttach,
    };

    const schema = object({
        content: string().trim().nullable().required('Bình luận không được để trống'),
        fileAttach: array().nullable().max(5, 'Không chọn quá 5 file'),
    });

    const onSubmit = async (values: any, { resetForm }: any) => {
        setLoading(true);
        try {
            if (ticketId) {
                let input = {
                    ticketId: ticketId,
                    content: values.content,
                    fileAttach: values.fileAttach
                };
                let resp = await ticketServices.CreateTicketComment(input);
                if (resp) {

                    onReloadForm(new Date());
                    resetForm(); // Đặt lại form sau khi submit thành công
                    toast.success("Thêm thành công");
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
        <div className="">
            <div className="relative h-auto w-auto border p-3 rounded mt-6">
                <div className="absolute left-2 -top-[16px] bg-white p-1 font-bold text-blue-600">Trả lời</div>
                <Formik
                    onSubmit={onSubmit}
                    validationSchema={schema}
                    initialValues={dataDefault}
                    enableReinitialize={true}
                >
                    {({ handleSubmit, submitForm, values }) => (
                        <Form noValidate onSubmit={handleSubmit} onKeyPress={(ev) => { ev.stopPropagation(); }}>
                            <div className="col-span-12 mt-4">
                                <div className='col-span-12'>
                                    <TanetTextArea
                                        label='Bình luận'
                                        rows={3}
                                        required={true}
                                        id='content'
                                        name='content'
                                    />
                                </div>
                                <div className='col-span-12'>
                                    <FileAttach
                                        action={ACTION_TYPES.EDIT}
                                        nameAttach='fileAttach'
                                        displayImage={true}
                                        fileType='fileAll'
                                        maxFiles={5}
                                        required={false}
                                        label="Đính kèm"
                                    />
                                </div>

                                <div className='col-span-12 mt-4'>
                                    <button
                                        type="button"
                                        className="text-white bg-[#1068bf] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        onClick={(ev) => {
                                            ev.preventDefault();
                                            submitForm(); // Gọi submitForm để kích hoạt xác thực và submit
                                            ev.stopPropagation();
                                        }}
                                    >
                                        Bình luận
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
