"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TanetInput } from "@/lib/field-formik-custom";
import { Loading } from "../../shared/components/LoadingComponent";
import { AuthService } from "@/shared/services";
import { toast } from "react-toastify";
import './login-style.css'; 

export default function LoginForm({
    onLoading,
    onClickForgotPass
}: {
    onLoading: (isLoading: boolean) => void;
    onClickForgotPass: () => void;
}) {

    const router = useRouter();
    const { login } = AuthService();
    const SignupSchema = Yup.object().shape({
        username: Yup.string()
            .min(2, "Tên đăng nhập tối thiểu 2 ký tự!")
            .max(70, "Tên đăng nhập tối đa 70 ký tự!")
            .required("Vui lòng nhập tên đăng nhập."),
        password: Yup.string().required("Vui lòng nhập mật khẩu."),
    });
    const initialValues = {
        username: "",
        password: "",
    };
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        // var auth = getOauth();
        // if (auth) {
        //     router.push('/admin');
        // }
    });
    const onSubmit = async (data: any) => {
        onLoading(true);
        if (await login(data)) {
            toast.success("Đăng nhập thành công");
            router.push("/admin");
        } else {
            setErrorMessage(
                "Tài khoản hoặc mật khẩu không chính xác, vui lòng kiểm tra lại."
            );
            onLoading(false);
        }
    };

    const handleForgotPassword = () => {
        onClickForgotPass();
    };

    return (
        <>
            <div className="w-96 mx-auto items-center justify-center px-8 py-8 bg-white animate-fade-in">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto w-auto animate-slide-in"
                        src="/logo-th.png"
                        alt="ThienHoang"
                    />
                    <h2 className="mt-10 text-center text-xl font-bold leading-9 tracking-tight animate-slide-in">
                        Đăng nhập
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
                            <div className="animate-slide-in">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium leading-6"
                                >
                                    Tên đăng nhập
                                </label>
                                <div className="mt-2">
                                    <TanetInput
                                        label=""
                                        id="username"
                                        name="username"
                                        className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#00524e] sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="animate-slide-in">
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium leading-6"
                                    >
                                        Mật khẩu
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <TanetInput
                                        label=""
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#00524e] sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="animate-slide-in">
                                <div className="flex items-center justify-between">
                                    <label
                                        onClick={handleForgotPassword}
                                        htmlFor="password"
                                        className="block text-sm font-medium leading-6 hover:text-blue-800 hover:underline cursor-pointer"
                                    >
                                        Quên mật khẩu
                                    </label>
                                </div>
                            </div>
                            <div className="animate-slide-in">
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00524e] bg-gradient-to-r from-[#00bfae] to-[#0066ad] hover:from-[#0066ad] hover:to-[#00bfae]"
                                >
                                    Đăng nhập
                                </button>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </div>
        </>
    );
}
