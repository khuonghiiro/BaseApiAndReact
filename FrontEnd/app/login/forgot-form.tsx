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
import ReCAPTCHA from "react-google-recaptcha";
import { NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V2 } from "@/public/app-setting";

export default function ForgotForm({
    onLoading,
    onClickBack,
    onSendRequest
}: {
    onLoading: (isLoading: boolean) => void;
    onClickBack: () => void;
    onSendRequest: (userName: string, isCheckSuccess: boolean) => void;
}) {

    const SignupSchema = Yup.object().shape({
        userName: Yup.string()
            .min(2, "Tên đăng nhập tối thiểu 2 ký tự!")
            .max(70, "Tên đăng nhập tối đa 70 ký tự!")
            .required("Vui lòng nhập tên đăng nhập."),
        recaptcha: Yup.string().required("Vui lòng xác nhận bạn không phải là robot.")
    });
    const initialValues = {
        userName: "",
        recaptcha: ""
    };
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = async (data: any) => {
        onLoading(true);

        // Xác minh reCAPTCHA
        const token = data.recaptcha;

        try
        {
            const result = await loginServices.SendVerifyCaptchaAsync({
                userName: data.userName,
                token: token
            });
    
            if (result) {
                alert("Đã gửi yêu cầu cấp lại mật khẩu, xin vui lòng chờ đợi.");
                onSendRequest(data.userName, true);
                // toast.success("Đã gửi yêu cầu cấp lại mật khẩu, xin vui lòng chờ đợi.")
            } else {
                setErrorMessage("Xác minh reCAPTCHA không thành công, vui lòng thử lại.");
                onSendRequest(data.userName, false);
            }
        }
        catch (error: any)
        {
            setErrorMessage(error?.response?.data);
        }
        finally
        {
            onLoading(false);
        }
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
                        Quên mật khẩu
                    </h2>
                    <p className="text-center text-sm text-red-500">{errorMessage}</p>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={SignupSchema}
                        onSubmit={onSubmit}
                    >
                        {({ setFieldValue }) => (
                            <Form className="space-y-6">
                                <div className="animate-slide-in">
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor="userName"
                                            className="block text-sm font-medium leading-6"
                                        >
                                            Tên đăng nhập
                                        </label>
                                    </div>
                                    <div className="mt-2">
                                        <TanetInput
                                            label=""
                                            id="userName"
                                            name="userName"
                                            type="userName"
                                            className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#00524e] sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div className="animate-slide-in">
                                    <ReCAPTCHA
                                        sitekey={NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V2}
                                        onChange={(value) => setFieldValue("recaptcha", value)}
                                    />
                                    <ErrorMessage name="recaptcha" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <div  className="animate-slide-in">
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
                                <div  className="animate-slide-in">
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00524e] bg-gradient-to-r from-[#00bfae] to-[#0066ad] hover:from-[#0066ad] hover:to-[#00bfae]"
                                    >
                                        Gửi
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
}
