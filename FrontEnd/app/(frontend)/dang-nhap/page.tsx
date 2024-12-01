'use client'
import React, { useEffect, useState } from "react";
import '../../../public/assets/css/styles.css'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Loading } from "../../../shared/components/LoadingComponent"; //shared/components/LoadingComponent
import { AuthService } from "@/shared/services";
import { ToastContainer, toast } from "react-toastify";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TanetInput } from "@/lib/field-formik-custom";

function loginPage() {
    const router = useRouter();
    const { loginFrontend, getAuthPublic } = AuthService();
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
    const [loading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        var auth = getAuthPublic();
        if (auth) {
            // window.location.href = '/';
            router.push('/');
        }
    });
    const onSubmit = async (data: any) => {
        setIsLoading(true);
        if (await loginFrontend(data)) {
            toast.success("Đăng nhập thành công");
            // window.location.href = '/';
            router.push('/');
        } else {
            toast.error("Tài khoản hoặc mật khẩu không chính xác, vui lòng kiểm tra lại.");
            
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className='content-site' style={{ backgroundImage: "url('../assets/images/ckct-background.jpg')" }}>
                <div className="tranparent"></div>
                <div className="container" >
                    <div className='sm:p-5 sm:mt-5'>
                        <div 
                        style={{minHeight: '52vh'}}
                        className="m-auto w-full bg-white rounded-sm shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                <h1 className="uppercase text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-1xl dark:text-white">
                                    Đăng nhập hệ thống
                                </h1>
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={SignupSchema}
                                    onSubmit={onSubmit}
                                >
                                    <Form className="space-y-4 md:space-y-6">
                                        <div>
                                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Tài khoản</label>

                                            <TanetInput
                                                label=""
                                                id="username"
                                                name="username"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Mật khẩu</label>
                                            <TanetInput
                                                label=""
                                                id="password"
                                                name="password"
                                                type="password"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            />

                                        </div>
                                        
                                        <button type="submit"                                            
                                            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-semibold rounded-sm text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Đăng nhập</button>

                                        <div className="flex justify-between items-center">
                                            <a href='doanh-nghiep' className="mr-1 text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-semibold text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800">Đăng ký tài khoản</a>
                                            {/* <a href='#' className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Đăng ký nhà đầu tư</a> */}
                                            <a href="#" className="text-sm font-semibold text-primary-600 hover:underline dark:text-primary-500">Quên mật khẩu?</a>
                                        </div>

                                    </Form>
                                </Formik>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Loading loading={loading} />
            <ToastContainer />
        </>

    )
}

export default loginPage;

