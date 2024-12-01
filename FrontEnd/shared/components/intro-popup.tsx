"use client";
import { Modal } from "@/shared/components/modal";
import { useState, useEffect } from "react";
import { useAuth } from "../Context/appAdminContext";

export default function IntroPopup({
    show,
    onClose,
    onClick
}: {
    show: boolean;
    onClose: (isRefresh: boolean) => void;
    onClick: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [isStartPopup, setIsStartPopup] = useState<string | null>(null);
    const [userId, setUserId] = useState<number>(0);
    const { logout, user } = useAuth();
     // Lấy thông tin người dùng khi component được mount
    useEffect(() => {
        setUserId(user.idTaiKhoan);
    }, [user]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const isStartPopup = localStorage.getItem(`${userId}-isStartPopup`);
            setIsStartPopup(isStartPopup);
        }
    }, []);

    return (
        <>
            {isStartPopup && isStartPopup === 'true'
                ? <></>
                :
                <Modal show={show} size="md" loading={loading}>
                    <>
                        <Modal.Header onClose={onClose}>Hướng dẫn sử dụng</Modal.Header>
                        <Modal.Body nameClass="grid-cols-12">
                            <div className="col-span-12">
                                Chào mừng bạn đến với ứng dụng của chúng tôi.
                                Hãy nhấn nút <b>Bắt đầu</b> để bắt đầu tour giới thiệu.
                            </div>
                        </Modal.Body>
                        <Modal.Footer onClose={onClose}>
                            <button
                                onClick={onClick}
                                data-modal-hide="large-modal"
                                type="button"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Bắt đầu
                            </button>
                        </Modal.Footer>
                    </>
                </Modal>
            }
        </>
    );
}
