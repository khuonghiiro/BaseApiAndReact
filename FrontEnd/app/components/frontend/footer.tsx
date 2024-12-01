
'use client'
import '../../../public/assets/css/styles.css'
import { FaMapLocation, FaPhoneVolume } from 'react-icons/fa6';
import { AiFillMail } from 'react-icons/ai';

export default function Footer() {
  return (
    <>
      <footer>
        <div className="container pb-4 pt-5">
          <div className="sm:flex sm:flex-wrap">
            <div className="sm:w-1/2 p-4" id="tpl-footer-part1">

              <div className="footer-content">
                <h5 className="text-uppercase mb-3">PHẦN MỀM HELPDESK THIÊN HOÀNG</h5>
                <p>
                  <strong>Chịu trách nhiệm:</strong>
                  <br /> Công ty Cổ phần Tập đoàn Công nghệ Thiên Hoàng </p>
                {/* <p>
                  <strong>Giấy phép:</strong>
                  <br />04/GP-TTĐT của Cục Quản lý phát thanh, truyền hình và thông tin điện tử-Bộ Thông tin và Truyền thông cấp ngày 13/02/2014
                </p> */}
              </div>
            </div>
            <div className='sm:w-2/12'></div>
            <div className="sm:w-1/3 p-4" id="tpl-footer-part2">
              <div className="footer-content">
                <h5 className="text-uppercase mb-3">Liên hệ
                </h5>
                <ul className="list-unstyled footer__list-lien-he">
                  <li>
                    <FaMapLocation className='mr-2' /> Tầng 22, Viwaseen, 48 Tố Hữu, Nam Từ Liêm, Hà Nội.
                  </li>
                  <li>
                    <FaPhoneVolume className='mr-2' /> 84.24.3558 9666
                  </li>
                  <li>
                    <FaPhoneVolume className='mr-2' /> 84.24.3557 1666
                  </li>
                  <li>
                    <AiFillMail className='mr-2' /> support@thienhoang.com.vn
                  </li>
                </ul>

              </div>
            </div>
          </div>
          <div className="flex justify-center items-center p-2" id="tpl-footer-part3">
            © 2024 - Bản quyền thuộc về Công ty Cổ phần Tập đoàn Công nghệ Thiên Hoàng. Ghi rõ nguồn gốc khi phát lại thông tin từ website này
          </div>
        </div>
      </footer>
    </>
  )
}