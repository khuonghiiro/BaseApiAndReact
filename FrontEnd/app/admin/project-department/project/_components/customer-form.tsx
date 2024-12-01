"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelect, TanetSelectTree } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { number, object, ref, string } from "yup";
import { projectServices } from "../services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
import React from "react";
import { AuthService } from '@/shared/services';

export default React.memo(function CustomerForm({ show, onClose, onSave }: {
    show: boolean;
    onClose: () => void;
    onSave: (customerId: number) => void;
}) {
    const defaultUser = {
        username: "",
        password: "",
        fullName: "",
        email: "",
        phoneNumber: "",
        groupIds: [5],
        address: "",
        avatar: "",
        sex: 3,
        status: 2,
    };
    const schema = object({
        fullName: string()
            .trim()
            .required("Bạn chưa nhập họ và tên")
            .min(3, "Bạn nhập tối thiểu 3 ký tự")
            .max(100, "Bạn nhập tối đa 100 ký tự"),
        username: string()
            .trim()
            .required("Bạn chưa nhập tên đăng nhập")
            .min(5, "Bạn nhập tối thiểu 5 ký tự")
            .max(30, "Bạn nhập tối đa 30 ký tự")
            .matches(
                /^[a-z0-9]+$/,
                "Tên đăng nhập không chứa kí tự đặc biệt và chữ in hoa"
            ),
        phoneNumber: string()
            .trim()
            .max(20, "Bạn nhập tối đa 20 ký tự")
            .min(6, "Bạn nhập tối thiểu 6 ký tự")
            .matches(/^[0-9]+$/, "Bạn chỉ nhập được số"),
        email: string()
            .required("Bạn chưa nhập email")
            .email("Email không đúng định dạng")
            .nullable()
            .min(3, "Bạn nhập tối thiểu 3 ký tự"),
        password: string()
            .trim()
            .required("Bạn chưa nhập mật khẩu")
            .matches(
                /(?=^.{6,30}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
                "Mật khẩu phải có ít nhất một chữ số, một chữ cái in hoa, một ký tự đặc biệt"
            )
            .min(6, "Bạn nhập tối thiểu 6 ký tự")
            .max(30, "Bạn nhập tối đa 30 ký tự"),
        repassword: string()
            .trim()
            .required("Bạn chưa nhập lại mật khẩu")
            .oneOf([ref("password"), ""], "Mật khẩu nhập lại không đúng"),
        sex: number().min(1, "Bạn phải chọn giới tính"),
    });
    const dataSexs = [
        {
            value: 1,
            label: "Nam",
        },
        {
            value: 2,
            label: "Nữ",
        },
        {
            value: 3,
            label: "Khác",
        },
    ];
    const [loading, setLoading] = useState(false);
    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            let id = await projectServices.createCustomer(values);
            if (id) {
                toast.success("Thêm thành công");
                await onSave(id);
            }
            else {
                toast.error("Thêm mới không thành công");
            }

        } catch (err: any) {
            toast.error("Thêm mới không thành công");
        }
        setLoading(false);
    };
    useEffect(() => {
    }, []);

    const { getOauth } = AuthService();
    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        var auth = getOauth();
        setIsAdmin(auth.isAdministrator)
    }, []);

    return (
        <>
            <Modal show={show} size="xxl" loading={loading}>
                <Formik
                    onSubmit={(values) => {
                        onSubmit(values);
                    }}
                    validationSchema={schema}
                    initialValues={defaultUser}
                    enableReinitialize={true}
                >
                    {({ handleSubmit, values, setFieldValue }) => (
                        <Form noValidate
                            onSubmit={handleSubmit}
                            onKeyPress={(ev) => {
                                ev.stopPropagation();
                            }}>
                            <Modal.Header onClose={onClose}>Thêm mới khách hàng</Modal.Header>
                            <Modal.Body nameClass="grid-cols-2">
                                <div className="">
                                    <TanetInput
                                        label="Họ và tên"
                                        required={true}
                                        view={false}
                                        id="fullName"
                                        name="fullName"
                                    />
                                </div>
                                <div className="">
                                    <TanetInput
                                        label="Tên đăng nhập"
                                        id="username"
                                        view={false}
                                        required={true}
                                        name="username"
                                    />
                                </div>
                                <div className="">
                                    <TanetInput
                                        label="Mật khẩu"
                                        required={true}
                                        id="password"
                                        name="password"
                                        type="password"
                                    />
                                </div>
                                <div className="">
                                    <TanetInput
                                        label="Nhập lại mật khẩu"
                                        required={true}
                                        id="repassword"
                                        name="repassword"
                                        type="password"
                                    />
                                </div>
                                <div className="">
                                    <TanetSelect
                                        label="Giới tính"
                                        name="sex"
                                        view={false}
                                        options={dataSexs}
                                    />
                                </div>
                                <div className="">
                                    <TanetInput
                                        label="Số điện thoại"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        view={false}
                                    />
                                </div>
                                <div className="">
                                    <TanetInput
                                        label="Email"
                                        id="email"
                                        required={true}
                                        name="email"
                                        view={false}
                                    />
                                </div>
                            </Modal.Body>
                            <Modal.Footer onClose={onClose}>
                                {!false ? (
                                    <>
                                        <button
                                            data-modal-hide="large-modal"
                                            type="button"
                                            onClick={(ev) => {
                                                onSubmit(values);
                                                ev.stopPropagation();
                                            }}
                                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            Lưu
                                        </button>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </>
    );
});
