import { useAuth } from '@/shared/Context/appAdminContext';
import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: React.ReactNode;
    onConfirm?: () => void;
    btnNameYes?: string;
}

const StartEndModal: React.FC<ModalProps> = ({ isOpen, onClose, title, content, onConfirm, btnNameYes }) => {
    if (!isOpen) return null;

    return (

        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700 w-11/12 max-w-md mx-auto p-6">
                <button
                    type="button"
                    className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                    onClick={onClose}
                >
                    <IoMdClose className="w-5 h-5" />
                </button>
                <h3 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white text-center">{title}</h3>
                <div className="mb-4 text-gray-500 dark:text-gray-400">{content}</div>
                <div className="flex justify-center">
                    <button
                        type="button"
                        className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2"
                        onClick={onConfirm}
                    >
                        {(btnNameYes && btnNameYes != '') ? btnNameYes : 'Bắt đầu'}

                    </button>
                    <button
                        type="button"
                        className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                        onClick={onClose}
                    >
                        Thoát
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StartEndModal;
