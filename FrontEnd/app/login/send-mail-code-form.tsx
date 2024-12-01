"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TanetInput } from "@/lib/field-formik-custom";
import { Loading } from "../../shared/components/LoadingComponent";
import { AuthService } from "@/shared/services";
import { toast } from "react-toastify";
import { loginServices } from "./services";

export default function SendMailCodeForm({
    emailName,
    onClickBack,
    onVerifyCode
}: {
    emailName: string;
    onClickBack: () => void;
    onVerifyCode: (isCheckMail: boolean) => void;
}) {

    const SignupSchema = Yup.object().shape({
        email: Yup.string()
            .email("Email không hợp lệ!")
            .required("Vui lòng nhập Email."),
            code: Yup.string()
            .required("Vui lòng nhập mã xác minh."),
    });
    const initialValues = {
        email: emailName,
        code: ''
    };
    const [loading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        // var auth = getOauth();
        // if (auth) {
        //     router.push('/admin');
        // }
    });
    const onSubmit = async (data: any) => {
        setIsLoading(true);

        let isCheck = await loginServices.SendVerifyCodeAsync(data.email, data.code);
        
        if (isCheck) {
            toast.success("Vui lòng đăng nhập từ mật khẩu gửi tới Email: " + data.email);
            onVerifyCode(true);
        } else {
            setErrorMessage(
                "Mã xác minh không hợp lệ, vui lòng kiểm tra lại."
            );

            onVerifyCode(false);
        }

        setIsLoading(false);
    };

    return (
        <>
            <div className="w-96 mx-auto items-center justify-center px-8 py-8 rounded-lg bg-white">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto w-auto"
                        src="/logo-th.png"
                        alt="ThienHoang"
                    />
                    <h2 className="mt-10 text-center text-xl font-bold leading-9 tracking-tight">
                        Mã xác minh tài khoản
                    </h2>
                    <p className="text-center text-sm text-red-500">{errorMessage}</p>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={SignupSchema}
                        onSubmit={onSubmit}
                    >
                        <Form className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium leading-6"
                                    >
                                        Email
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <TanetInput
                                        label=""
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#00524e] sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="code"
                                        className="block text-sm font-medium leading-6"
                                    >
                                        Mã xác minh
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <TanetInput
                                        label=""
                                        id="code"
                                        name="code"
                                        type="code"
                                        className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#00524e] sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label
                                        onClick={onClickBack}
                                        htmlFor="back"
                                        className="block text-sm font-medium leading-6 hover:text-blue-800 hover:underline cursor-pointer"
                                    >
                                        Trở về đăng nhập
                                    </label>
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00524e] bg-gradient-to-r from-[#00bfae] to-[#0066ad] hover:from-[#0066ad] hover:to-[#00bfae]"
                                >
                                    Gửi
                                </button>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </div>
        </>
    );
}
