'use client'
import Image from 'next/image'
import '../../../public/assets/css/styles.css'
import {
  AiOutlineSearch
} from "react-icons/ai";
export default function NavTop() {
  return (
    <div className='banner' style={{ backgroundImage: "url('../assets/images/ckct-background.jpg')" }}>
      <div className="text-heading banner__text-headding">
        <h1 className="text-uppercase text-center header-h1">Kết nối doanh nghiệp với toàn cầu
        </h1>
        <h5 id="titlecon" className="text-center header-h5">Hệ thống cơ sở dữ liệu lĩnh vực cơ khí chế tạo </h5>
      </div>
      <div className="container pr-3 pl-3 mt-5 pt-5 md:w-3/5">
        <form>
          <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input type="search" id="search" className="text-lg block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tìm kiếm nhà cung cấp" required />
            <button type="submit" className="text-3xl custom-search text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <AiOutlineSearch />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
