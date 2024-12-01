
'use client'
import { useEffect, useState } from 'react';
import '../../../public/assets/css/styles.css'
import { trangGioiThieuServices } from '@/app/(frontend)/service';
import { ApiUrl } from "@/public/app-setting";
export default function ContentHome() {
    useEffect(() => {
     
    }, []);
   
    const { data } = trangGioiThieuServices.GetDetail();
    
    return (
        <>

            <div className='content-body'>
                <div className="md:w-3/6 tim-kiem-text-box m-auto">
                    <div className="underline-icon text-center">
                        <img src="../assets/images/underline-icon.png" alt="" />
                    </div>
                </div>

                <div className="container ">
                    <div className="sm:flex sm:flex-wrap" id="">

                        <div className="sm:w-4/12 p-5">
                            <a href="/search-p1.html" className="d-block linh-vuc-item">
                                <div className="linhvuc-image" style={{ backgroundImage: "url('../assets/images/01-dap.jpg')" }}></div>
                                <div className="linhvuc-background linhvuc-background--blue"></div>
                                <div className="linhvuc-text">
                                    <div className="flex justify-between items-center">
                                        <div className="text-uppercase linhvuc-text__left">Dập</div>
                                        <div className="linhvuc-text__right">181</div>
                                    </div>
                                </div>
                            </a>
                        </div>

                        <div className="sm:w-4/12 p-5">
                            <a href="/search-p1.html" className="d-block linh-vuc-item">
                                <div className="linhvuc-image" style={{ backgroundImage: "url('../assets/images//03-GiaCongCoKhi.jpg')" }}></div>
                                <div className="linhvuc-background linhvuc-background--red"></div>
                                <div className="linhvuc-text">
                                    <div className="flex justify-between items-center">
                                        <div className="text-uppercase linhvuc-text__left">Dập</div>
                                        <div className="linhvuc-text__right">181</div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="sm:w-4/12 p-5">
                            <a href="/search-p1.html" className="d-block linh-vuc-item">
                                <div className="linhvuc-image" style={{ backgroundImage: "url('../assets/images/01-dap.jpg')" }}></div>
                                <div className="linhvuc-background linhvuc-background--blue"></div>
                                <div className="linhvuc-text">
                                    <div className="flex justify-between items-center">
                                        <div className="text-uppercase linhvuc-text__left">Dập</div>
                                        <div className="linhvuc-text__right">181</div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="sm:w-4/12 p-5">
                            <a href="/search-p1.html" className="d-block linh-vuc-item">
                                <div className="linhvuc-image" style={{ backgroundImage: "url('../assets/images/01-dap.jpg')" }}></div>
                                <div className="linhvuc-background linhvuc-background--red"></div>
                                <div className="linhvuc-text">
                                    <div className="flex justify-between items-center">
                                        <div className="text-uppercase linhvuc-text__left">Dập</div>
                                        <div className="linhvuc-text__right">181</div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="sm:w-4/12 p-5">
                            <a href="/search-p1.html" className="d-block linh-vuc-item">
                                <div className="linhvuc-image" style={{ backgroundImage: "url('../assets/images/01-dap.jpg')" }}></div>
                                <div className="linhvuc-background linhvuc-background--blue"></div>
                                <div className="linhvuc-text">
                                    <div className="flex justify-between items-center">
                                        <div className="text-uppercase linhvuc-text__left">Dập</div>
                                        <div className="linhvuc-text__right">181</div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="sm:w-4/12 p-5">
                            <a href="/search-p1.html" className="d-block linh-vuc-item">
                                <div className="linhvuc-image" style={{ backgroundImage: "url('../assets/images/01-dap.jpg')" }}></div>
                                <div className="linhvuc-background linhvuc-background--red"></div>
                                <div className="linhvuc-text">
                                    <div className="flex justify-between items-center">
                                        <div className="text-uppercase linhvuc-text__left">Dập</div>
                                        <div className="linhvuc-text__right">181</div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="sm:w-4/12 p-5">
                            <a href="/search-p1.html" className="d-block linh-vuc-item">
                                <div className="linhvuc-image" style={{ backgroundImage: "url('../assets/images/01-dap.jpg')" }}></div>
                                <div className="linhvuc-background linhvuc-background--blue"></div>
                                <div className="linhvuc-text">
                                    <div className="flex justify-between items-center">
                                        <div className="text-uppercase linhvuc-text__left">Dập</div>
                                        <div className="linhvuc-text__right">181</div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="sm:w-4/12 p-5">
                            <a href="/search-p1.html" className="d-block linh-vuc-item">
                                <div className="linhvuc-image" style={{ backgroundImage: "url('../assets/images/01-dap.jpg')" }}></div>
                                <div className="linhvuc-background linhvuc-background--red"></div>
                                <div className="linhvuc-text">
                                    <div className="flex justify-between items-center">
                                        <div className="text-uppercase linhvuc-text__left">Dập</div>
                                        <div className="linhvuc-text__right">181</div>
                                    </div>
                                </div>
                            </a>
                        </div>

                    </div>
                </div>

            </div>

            <div className="gioithieu-csdl">
                <div className="container">
                    <div className="sm:flex sm:flex-wrap">
                        <div className="sm:w-3/6 p-4">
                            {data?.lstAttachment.length > 0 ?
                                <img width="100%" src={`${ApiUrl}${data?.lstAttachment[0]?.url}/`} alt={data?.title} />
                                :
                                ''
                            }

                        </div>
                        <div className="sm:w-3/6 p-4 gioithieu-left" id="tpl-gioithieu-home">
                            <h3 className="text-uppercase heading ">{data?.title}</h3>
                            <p className='des-intro mb-5'>
                                {data?.moTa}
                            </p>
                            <a href='/gioi-thieu' className="mt-5 text-white right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Xem thêm</a>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}