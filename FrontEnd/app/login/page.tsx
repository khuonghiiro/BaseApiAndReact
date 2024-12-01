"use client";
import { useState, useEffect } from "react";
import { Loading } from "../../shared/components/LoadingComponent";
import LoginForm from "./login-form";
import ForgotForm from "./forgot-form";
import { FaUser, FaExclamationTriangle, FaClipboardList, FaBook, FaChartLine } from "react-icons/fa";
import './login-style.css';

const Typewriter = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex(index + 1);
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [index, text]);

  return <span>{displayedText.split('').map((char, i) => (
    <span key={i} className="animated-character" style={{ animationDelay: `${i * 0.1}s` }}>{char}</span>
  ))}</span>;
};

export default function Page() {
  const [loading, setIsLoading] = useState(false);
  const [isShowForgotPass, setIsShowForgotPass] = useState(false);

  const HandleSendRequest = (userName: string, isCheck: boolean) => {
    // nếu isShowForgotPass = false để mở lại form login
    setIsShowForgotPass(!isCheck);
  };

  const HandleLoading = (isCheck: boolean) => {
    // nếu isShowForgotPass = false để mở lại form login
    setIsLoading(isCheck);
  };

  return (
    <>
      <div className="flex h-screen bg-min-size bg-gradient-to-b from-[#3a77ff] to-[#28f7ff]">
        <div className="flex-[70%] flex flex-col items-center px-6 py-12 lg:px-8">
          <div className="col-span-12 text-white">
            <div>
              <img
                className="mx-auto w-auto animate-slide-in"
                src="/logo-th.png"
                alt="ThienHoang"
              />
            </div>

            <p className="text-center text-lg">
              {/* <Typewriter text="Chào mừng đến với công ty của chúng tôi! Chúng tôi cam kết cung cấp những sản phẩm và dịch vụ tốt nhất cho khách hàng. Vui lòng đăng nhập để tiếp tục." /> */}
              CÔNG TY CỔ PHẦN TẬP ĐOÀN CÔNG NGHỆ THIÊN HOÀNG
            </p>
            <p className="text-center text-lg">
              {/* <Typewriter text="Chào mừng đến với công ty của chúng tôi! Chúng tôi cam kết cung cấp những sản phẩm và dịch vụ tốt nhất cho khách hàng. Vui lòng đăng nhập để tiếp tục." /> */}
              Hệ thống hỗ trợ kỹ thuật
            </p>
          </div>

          <div className="col-span-12">
            <section className="flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/path-to-your-background-image.jpg')" }}>
              <div className="container mx-auto px-4 py-12">
                <div className="flex flex-wrap -mx-2">

                  <div className="w-full mt-[60px] md:w-1/3 px-2 mb-4 fadeInLeft" style={{ minWidth: '150px', maxWidth: '170px', animationDelay: '0s' }}>
                    <div className="bg-white rounded-lg shadow-custom p-6 text-center h-[350px]">
                      <span className="inline-block bg-[#f3e9fd] rounded-full p-4 mb-4">
                        <FaUser />
                      </span>
                      <h5 className="text-lg font-semibold text-[#7d20d3] mb-2">Hỗ trợ người dùng</h5>
                      <p className="text-gray-600 text-[14px]">Cung cấp sự trợ giúp và giải đáp thắc mắc cho người dùng về các vấn đề kỹ thuật.</p>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 px-2 mb-4 fadeInLeft" style={{ minWidth: '150px', maxWidth: '170px', animationDelay: '0.2s' }}>
                    <div className="bg-white rounded-lg shadow-custom p-6 text-center h-[350px]">
                      <span className="inline-block bg-[#f3e9fd] rounded-full p-4 mb-4">
                        <FaExclamationTriangle />
                      </span>
                      <h5 className="text-lg font-semibold text-[#7d20d3] mb-2">Quản lý sự cố</h5>
                      <p className="text-gray-600 text-[14px]">Xử lý và giải quyết các sự cố phát sinh trong hệ thống một cách hiệu quả.</p>
                    </div>
                  </div>

                  <div className="w-full mt-[60px] md:w-1/3 px-2 mb-4 fadeInLeft" style={{ minWidth: '150px', maxWidth: '170px', animationDelay: '0.4s' }}>
                    <div className="bg-white rounded-lg shadow-custom p-6 text-center h-[350px]">
                      <span className="inline-block bg-[#f3e9fd] rounded-full p-4 mb-4">
                        <FaClipboardList />
                      </span>
                      <h5 className="text-lg font-semibold text-[#7d20d3] mb-2">Quản lý yêu cầu dịch vụ</h5>
                      <p className="text-gray-600 text-[14px]">Xử lý các yêu cầu dịch vụ từ người dùng, bao gồm cài đặt phần mềm, cấp quyền truy cập,...</p>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 px-2 mb-4 fadeInLeft" style={{ minWidth: '150px', maxWidth: '170px', animationDelay: '0.6s' }}>
                    <div className="bg-white rounded-lg shadow-custom p-6 text-center h-[350px]">
                      <span className="inline-block bg-[#f3e9fd] rounded-full p-4 mb-4">
                        <FaBook />
                      </span>
                      <h5 className="text-lg font-semibold text-[#7d20d3] mb-2">Quản lý tri thức</h5>
                      <p className="text-gray-600 text-[14px]">Xây dựng và duy trì cơ sở tri thức để hỗ trợ giải quyết các vấn đề kỹ thuật thường gặp.</p>
                    </div>
                  </div>

                  <div className="w-full mt-[60px] md:w-1/3 px-2 mb-4 fadeInLeft" style={{ minWidth: '150px', maxWidth: '170px', animationDelay: '0.8s' }}>
                    <div className="bg-white rounded-lg shadow-custom p-6 text-center h-[350px]">
                      <span className="inline-block bg-[#f3e9fd] rounded-full p-4 mb-4">
                        <FaChartLine />
                      </span>
                      <h5 className="text-lg font-semibold text-[#7d20d3] mb-2">Báo cáo và phân tích </h5>
                      <p className="text-gray-600 text-[14px]">Thu thập dữ liệu và tạo báo cáo để phân tích hiệu quả của dịch vụ hỗ trợ và đề xuất cải tiến.</p>
                    </div>
                  </div>

                </div>

              </div>
            </section>

          </div>
        </div>


        <div className="flex-[30%] flex justify-center bg-white animate-slide-in-right">
          {isShowForgotPass ? (
            <ForgotForm
              onLoading={HandleLoading}
              onSendRequest={HandleSendRequest}
              onClickBack={() => setIsShowForgotPass(!isShowForgotPass)}
            />
          ) : (
            <LoginForm
              onLoading={HandleLoading}
              onClickForgotPass={() => setIsShowForgotPass(!isShowForgotPass)}
            />
          )}
        </div>
      </div>
      <Loading loading={loading} />
    </>
  );
}
