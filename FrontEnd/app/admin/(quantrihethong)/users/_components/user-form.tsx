"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelect, TanetSelectTree } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, number, object, ref, string } from "yup";
import { userServices } from "../services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
import React from "react";
import { AuthService } from '@/shared/services';

export default React.memo(function UserForm({ show, action, id, onClose }: IFormProps) {
    const defaultUser = {
        username: "",
        password: "",
        fullName: "",
        email: "",
        phoneNumber: "",
        groupIds: [],
        address: "",
        avatar: "",
        sex: 3,
        status: 1,
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
        // .max(30, "Bạn nhập tối đa 30 ký tự").test('Unique Email', 'Email đã tồn tại',
        //     function (value) {
        //         if (!value)
        //             return true;
        //         return new Promise(async (resolve, reject) => {
        //             let result = await userServices.checkTrung(value, this.parent.id);
        //             if (result.data.length > 0)
        //                 resolve(false)
        //             else
        //                 resolve(true)
        //         });
        //     }
        // ),
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
    const schemaEdit = object({
        fullName: string()
            .trim()
            .required("Bạn chưa nhập họ và tên")
            .min(3, "Bạn nhập tối thiểu 3 ký tự")
            .max(100, "Bạn nhập tối đa 100 ký tự"),
        phoneNumber: string()
            .trim()
            .max(20, "Bạn nhập tối đa 20 ký tự")
            .min(6, "Bạn nhập tối thiểu 6 ký tự")
            .matches(/^[0-9]+$/, "Bạn chỉ nhập được số"),
        email: string()
            .required("Bạn chưa nhập email")
            .email("Email không đúng định dạng")
            .nullable()
            .min(3, "Bạn nhập tối thiểu 3 ký tự")
            .max(30, "Bạn nhập tối đa 30 ký tự"),
        groupIds: array().min(1, "Bạn chưa chọn nhóm người dùng"),
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
    const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
    const { data: groups } = userServices.GetAllGroups();
    const [loading, setLoading] = useState(false);
    const { data, mutate } = userServices.GetUserById(id!);
    // const { data: dataDonVis } = userServices.GetDonVi();
    const onSubmit = async (values: any) => {
        setLoading(true);
        if (id) {
            try {
                await userServices.update(id, values);
                toast.success("Cập nhật thành công");
                await mutate();
                await onClose(true);
            } catch (err: any) {
                toast.error("Cập nhật không thành công");
            }
        } else {
            try {
                await userServices.create(values);
                toast.success("Thêm thành công");
                await onClose(true);
            } catch (err: any) {
                toast.error("Thêm mới không thành công");
            }
        }
        setLoading(false);
    };
    useEffect(() => {
        dispatch({ type: action });
    }, [action, id]);

    const { getOauth } = AuthService();
    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        var auth = getOauth();
        setIsAdmin(auth.isAdministrator)
    }, []);

    return (
        <>
            <Modal show={show} size="xl" loading={loading}>
                <Formik
                    onSubmit={(values) => {
                        onSubmit(values);
                    }}
                    validationSchema={state?.editMode ? schemaEdit : schema}
                    initialValues={data ? data : defaultUser}
                    enableReinitialize={true}
                >
                    <Form>
                        <Modal.Header onClose={onClose}>{computedTitle(id, state?.editMode)}</Modal.Header>
                        <Modal.Body nameClass="grid-cols-2">
                            <div className="">
                                <TanetInput
                                    label="Họ và tên"
                                    required={true}
                                    view={state?.viewMode}
                                    id="fullName"
                                    name="fullName"
                                />
                            </div>
                            <div className="">
                                <TanetInput
                                    label="Tên đăng nhập"
                                    id="username"
                                    view={state?.viewMode ? true : state?.editMode}
                                    required={true}
                                    name="username"
                                />
                            </div>

                            {!state?.editMode && !state?.viewMode ? (
                                <>
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
                                </>
                            ) : (
                                <></>
                            )}
                            {isAdmin == true ?
                                <div className="">
                                    <TanetSelect
                                        label="Nhóm người dùng"
                                        name="groupIds"
                                        isMulti
                                        view={state?.viewMode}
                                        options={groups}
                                    />
                                </div>
                                :
                                <div className="">
                                    <TanetSelect
                                        label="Nhóm người dùng"
                                        name="groupIds"
                                        isMulti
                                        view={true}
                                        options={groups}
                                    />
                                </div>
                            }
                            <div className="">
                                <TanetSelect
                                    label="Giới tính"
                                    name="sex"
                                    view={state?.viewMode}
                                    options={dataSexs}
                                />
                            </div>
                            <div className="">
                                <TanetInput
                                    label="Số điện thoại"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    view={state?.viewMode}
                                />
                            </div>
                            <div className="">
                                <TanetInput
                                    label="Email"
                                    id="email"
                                    required={true}
                                    name="email"
                                    view={state?.viewMode}
                                />
                            </div>
                            {/* <div className="">
                                <TanetSelectTree
                                    label="Đơn vị"
                                    name="donViNoiBoId"
                                    id='donViNoiBoId'
                                    data={dataDonVis}
                                    view={state?.viewMode}
                                    placeholder="Chọn đơn vị"
                                />
                            </div> */}
                        </Modal.Body>
                        <Modal.Footer onClose={onClose}>
                            {!state?.viewMode ? (
                                <>
                                    <button
                                        data-modal-hide="large-modal"
                                        type="submit"
                                        className="btn-submit"
                                    >
                                        Lưu
                                    </button>
                                </>
                            ) : (
                                <></>
                            )}
                        </Modal.Footer>
                    </Form>
                </Formik>
            </Modal>
        </>
    );
});
