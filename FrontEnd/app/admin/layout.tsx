"use client";
import "./styles/styles.css";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { SWRConfig } from "swr";
import { WebSocketProvider } from "./(quantrihethong)/websocket/services";

import dynamic from "next/dynamic";
import { AuthProvider } from "@/shared/Context/appAdminContext";
import { PopupMsgProvider } from "./(quantrihethong)/chatuser/_components/popup-msg-provider";
import { TourProvider } from "@/lib/tour-context";
const TopBar = dynamic(() => import("../components/admin/layout/top-bar"));

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showNav, setShowNav] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  function handleSize() {
    if (innerWidth <= 640) {
      setShowNav(false);
      setIsMobile(true);
    } else {
      setShowNav(true);
      setIsMobile(false);
    }
  }
  useEffect(() => {

    if (typeof window !== "undefined") {
      addEventListener("resize", handleSize);
    }

    return () => {
      removeEventListener("resize", handleSize);
    };
  }, []);
  return (
    <>
      <AuthProvider>
        <TourProvider>
          <WebSocketProvider>
            <SWRConfig
              value={{
                revalidateOnFocus: false,
                onError: (error, key) => {
                  if (error.status !== 403 && error.status !== 404) {
                    // We can send the error to Sentry,
                    // or show a notification UI.
                  }
                },
              }}
            >
              <PopupMsgProvider>
                <TopBar showNav={showNav} setShowNav={setShowNav} />
                <main
                  className={`bg-[#f4f6f9] min-h-screen pt-12 transition-all duration-[400ms] ${showNav && !isMobile ? "pl-56" : ""
                    }`}
                >
                  <div className="mx-1 md:mx-3">{children}</div>
                  <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                  />
                </main>
              </PopupMsgProvider>
            </SWRConfig>
          </ WebSocketProvider>
        </TourProvider>
      </AuthProvider>
    </>
  );
}
