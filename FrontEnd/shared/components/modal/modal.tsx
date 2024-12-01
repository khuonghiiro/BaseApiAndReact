"use client";
import { IModal } from "@/shared/model";
import { ReactNode, useState, createContext } from "react";
import { ModalHeader } from "./header";
import { ModalBody } from "./body";
import { ModalFooter } from "./footer";
import { findByType } from "@/lib/find-by-type";
import { Loading } from "../LoadingComponent";
export const Modal = ({ size = "lg", show = false, loading = false, children }: IModal) => {
    const renderHeader = () => {
        const header = findByType(children, ModalHeader);
        if (!header) {
            return null;
        }
        return header;
    };
    const renderBody = () => {
        const body = findByType(children, ModalBody);
        if (!body) {
            return null;
        }
        return body;
    };
    const renderFooter = () => {
        const footer = findByType(children, ModalFooter);
        if (!footer) {
            return null;
        }
        return footer;
    };
    const renderSize = () => {
        switch (size) {
            case "md":
                return "relative w-full max-w-md max-h-full";
            case "lg":
                return "relative w-full max-w-lg max-h-full";
            case "xl":
                return "relative w-full max-w-4xl max-h-full";
            case "xxl":
                return "relative w-full max-w-7xl max-h-full";
            case "full":
                return "relative w-full max-full max-h-full";
            case "heightfull":
                return "relative w-full max-full h-[100%]";
            default:
                return "relative w-full max-w-7xl max-h-full";
        }
    };
    return (
        <>
            {show && (
                <ModalContext.Provider value={{}}>
                    <div className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full justify-center items-start flex">
                        <div className={renderSize()}>
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 h-[calc(100%-1rem)]">
                                {renderHeader()}
                                {children}
                                {renderBody()}
                                {renderFooter()}
                            </div>
                        </div>
                        <Loading loading={loading} />
                    </div>
                    <div
                        modal-backdrop=""
                        className="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40"
                    ></div>
                </ModalContext.Provider>
            )}
        </>
    );
};
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
export const ModalContext = createContext({});
