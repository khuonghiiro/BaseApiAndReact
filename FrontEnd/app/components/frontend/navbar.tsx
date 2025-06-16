'use client'
import {
    AiOutlineCaretDown, AiOutlineMenu
} from "react-icons/ai";

import React, { useEffect, useState } from "react";
import { AuthService } from "@/shared/services";
import { menuPublicServices } from "@/app/admin/(quantrihethong)/menupublic/services";
import { useRouter } from "next/navigation";
export default function HeaderTop() {
    const router = useRouter();
    const { loginFrontend, setLogoutPublic, getAuthPublic } = AuthService();
    const [heading, setHeading] = useState("");
    const [subHeading, setSubHeading] = useState("");
    const [authPublic, setAuthPublic] = useState(null);
    const { data: parents } = menuPublicServices.GetMenuPublic();
    const logOut = (e: any) => {
        setLogoutPublic();
        setAuthPublic(null);
        window.location.href = '/dang-nhap'
    }
    useEffect(() => {
        let auth = getAuthPublic();
        if (auth) {
            setAuthPublic(auth);
        }

    }, [parents?.data]);

    let arr = parents?.data;
    const convertArrToObj = (arr: any, id: number) => {
        if (arr) {
            return arr.filter((item: { parentId: number; }) => item.parentId == id)
                .map((item: { title: string; id: number; url: string; }) => ({
                    name: item.title.replace("--", ""),
                    sublinks: ({
                        Head: item.title.replace("--", ""),
                        sublink: convertArrToObj(arr, item.id)
                    }),
                    submenu: true,
                    link: (item.title == 'Trang chủ' ? '/' :  (item.url == '/' ? '#' : item.url)),
                })
                );
        }
    };
    const result = convertArrToObj(arr);    
    
    return (
        <>
            {result?.map((link) => (
                <div>
                    <div className="px-3 text-left md:cursor-pointer group relative">
                        <a                                                 
                            className="font-semibold py-3 flex justify-between items-center md:pr-0 pr-5 group sm:text-white"
                            onClick={() => {
                                heading !== link?.name ? setHeading(link?.name) : setHeading("");
                                setSubHeading("");
                                router.push(link?.link);
                            }}
                        >
                            {link?.name}
                            {link?.sublinks?.sublink.length > 0 &&
                                <>
                                    <span className="text-xl md:hidden inline">
                                        <AiOutlineCaretDown
                                            name={`${heading === link?.name ? "chevron-up" : "chevron-down"
                                                }`}
                                        ></AiOutlineCaretDown>
                                    </span>
                                    <span className="text-xl md:mt-1 md:ml-2  md:block hidden group-hover:rotate-180 group-hover:-mt-2">
                                        <AiOutlineCaretDown name="chevron-down"></AiOutlineCaretDown>
                                    </span>
                                </>
                            }
                        </a>
                        {link?.sublinks?.sublink.length > 0 && (
                            <div>
                                <div style={{width: '35rem'}} className={`z-10 right-0 absolute top-15 hidden group-hover:md:block hover:md:block  ${link?.sublinks?.sublink.length > 1 ? 'custom-width-sub-nav' : ''}`}>
                                    <div className="py-3">
                                        <div
                                            className={`w-4 h-4 right-3 absolute mt-1 bg-white rotate-45 ${link?.sublinks?.sublink.length > 1 ? 'custom-rotate-sub-nav' : ''}`}
                                        ></div>
                                    </div>                                    
                                    <div className={`${link?.sublinks?.sublink.length > 1 ? 'bg-white p-5 grid grid-cols-2' : 'bg-white px-5 py-2 w-56'}`}>
                                        {link?.sublinks?.sublink.length > 0 && link?.sublinks?.sublink.map((mysublinks) => (
                                            <div className="nav-sub">
                                                <h1 className="text-lg font-semibold">
                                                    {mysublinks?.name}
                                                </h1>
                                                <ul className="normal-case">
                                                    {mysublinks?.sublinks?.sublink.length > 0 && mysublinks?.sublinks?.sublink.map((slink) => (
                                                        <><li className="text-sm text-gray-600 my-2.5">
                                                            <a 
                                                            onClick={() => router.push(slink?.link)}                                                            
                                                            >{slink?.name}</a>
                                                        </li></>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Mobile menus */}
                    <div
                        className={`${heading === link.name ? "md:hidden" : "hidden"}`}
                    >
                        {/* sublinks */}
                        {link?.sublinks?.sublink.length > 0 && link?.sublinks?.sublink.map((slinks) => (
                            <div>
                                <div>
                                    <h1
                                        onClick={() =>
                                            subHeading !== slinks?.name
                                                ? setSubHeading(slinks?.name)
                                                : setSubHeading("")
                                        }
                                        className="py-4 pl-7 font-semibold md:pr-0 pr-5 flex justify-between items-center md:pr-0 pr-5"
                                    >
                                        {slinks?.name}

                                        <span className="text-xl md:mt-1 md:ml-2 inline">
                                            <AiOutlineCaretDown
                                                name={`${subHeading === slinks?.name
                                                    ? "chevron-up"
                                                    : "chevron-down"
                                                    }`}
                                            ></AiOutlineCaretDown>
                                        </span>
                                    </h1>
                                    <div
                                        className={`${subHeading === slinks?.name ? "md:hidden" : "hidden"}`}
                                    >
                                        {slinks?.sublinks?.sublink.map((slink) => (
                                            <li className="py-3 pl-14">
                                                <a href={slink?.link}>{slink?.name}</a>
                                            </li>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div>
                <div className="px-3 text-left md:cursor-pointer group relative">
                    {!authPublic ?
                        <a 
                        onClick={() => router.push('/dang-nhap')}
                        // href="/dang-nhap" 
                        className="font-semibold py-3 flex justify-between items-center md:pr-0 pr-5 group sm:text-white">Đăng nhập</a>
                        :
                        <>
                            <div className="px-3 text-left md:cursor-pointer group"><a href="#" className="font-semibold py-3 flex justify-between items-center md:pr-0 pr-5 group sm:text-white">Tài khoản<span className="text-xl md:hidden inline"><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" name="chevron-down" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path></svg></span><span className="text-xl md:mt-1 md:ml-2  md:block hidden group-hover:rotate-180 group-hover:-mt-2"><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" name="chevron-down" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path></svg></span></a>
                                <div>
                                    <div style={{right: '25px'}} className="z-10 absolute top-15 hidden group-hover:md:block hover:md:block w-56">
                                        <div className="py-3">
                                            <div className="w-4 h-4 right-3 absolute mt-1 bg-white rotate-45 "></div>
                                        </div>
                                        <div className="bg-white px-5 py-2 w-56">
                                            <div className="nav-sub">
                                                <h1 className="text-lg font-semibold"></h1>
                                                <ul className="normal-case">
                                                    <li className="text-sm text-gray-600 my-2.5"><a href="/doanh-nghiep/thong-ke" >Thống kê</a>
                                                    </li>                                                    
                                                    <li className="text-sm text-gray-600 my-2.5"><a onClick={() => router.push('/doanh-nghiep/thong-tin')}>Thay đổi thông tin</a>
                                                    </li>
                                                    <li className="text-sm text-gray-600 my-2.5"><a onClick={(e) => logOut(e)}>Đăng xuất</a>
                                                    </li>

                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </div>

            </div>
        </>
    )
}
