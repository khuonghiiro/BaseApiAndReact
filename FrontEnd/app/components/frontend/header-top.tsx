'use client'
import '../../../public/assets/css/styles.css'
import React, { useState } from "react";
import Navbar from "./navbar";
import {
  AiOutlineCaretDown, AiOutlineMenu, AiOutlineClose
} from "react-icons/ai";

export default function HeaderTop() {
  const [open, setOpen] = useState(false);
  return (
    <header>
      <div className="container md:header header-top ">


        <nav className="">
          <div className="flex items-center font-medium justify-between">
            <div className="z-50 p-1 md:w-auto w-full flex justify-between items-center">
              <a href='/'><img src="/logo-th.png" alt="logo" className="md:cursor-pointer h-20" /></a>
              {!open ?
                <div className="text-3xl md:hidden" onClick={() => setOpen(!open)}>
                  <AiOutlineMenu className='text-white'></AiOutlineMenu>
                </div>
                :
                <div className="text-3xl md:hidden" onClick={() => setOpen(!open)}>
                  <AiOutlineClose className='text-black'></AiOutlineClose>
                </div>
              }
            </div>
            <div className="md:flex hidden uppercase items-center">
              <Navbar />
            </div>

            {/* Mobile nav */}
            <ul
              className={`z-40 md:hidden bg-white fixed w-full top-0 overflow-y-auto bottom-0 py-24 pl-4 duration-500 ${open ? "left-0" : "left-[-100%]"}`}
            >

              <Navbar />

            </ul>
          </div>
        </nav>


      </div>
    </header>
  )
}
