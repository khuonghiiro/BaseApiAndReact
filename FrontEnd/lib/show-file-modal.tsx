"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/shared/components/modal";
import { ApiUrl } from "@/public/app-setting";
import Image from "next/image";

// Hàm để lấy loại file từ `file.type`
const getFileType = (fileType: string): string => {
    if (fileType === "application/msword" || fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        return "docx";
    } else if (fileType === "application/vnd.ms-excel" || fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        return "xlsx";
    } else if (fileType === "application/pdf") {
        return "pdf";
    } else {
        return ""; // Trả về một giá trị mặc định hoặc xử lý theo nhu cầu
    }
};

interface ShowFileModalProps {
    isShow: boolean;
    isLoading: boolean;
    onClose: () => void;
    file: File | any;
}

export default function ShowFileModal({
    isShow,
    isLoading,
    onClose,
    file,
}: ShowFileModalProps) {
    const [error, setError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [retry, setRetry] = useState(0);

    useEffect(() => {
        setIsClient(true);
        setError(null); // Reset error on new file
        setRetry(0); // Reset retry count on new file
    }, [file]);

    if (!file) {
        return null;
    }

    const fileUri = `${ApiUrl}fileupload/api/file/download/${file.guiid}`;
    const googleDocViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUri)}&embedded=true`;

    const isDocument = [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/pdf"
    ].includes(file.type);

    const isImage = [
        "image/jpeg",
        "image/png",
        "image/gif"
    ].includes(file.type);

    const handleError = (e: any) => {
        console.error("Error displaying file", e);
        if (retry < 3) {
            setRetry(retry + 1);
        } else {
            setError("Không thể hiển thị tệp này.");
        }
    };

    return (
        <>
            <Modal
                show={isShow}
                loading={isLoading}
                size="heightfull"
            >
                <>
                    <Modal.Header onClose={() => onClose()}>
                        Xem trước {file.title}
                    </Modal.Header>
                    {error ? (
                        <div className="flex justify-center align-center">
                            <p>{error}</p>
                            <a href={fileUri} target="_blank" rel="noopener noreferrer">Tải xuống tệp</a>
                        </div>
                    ) : isDocument ? (
                        <div style={{ width: '100%', height: '100%' }}>
                            <iframe 
                                key={retry} // Thay đổi key để force re-render iframe
                                src={googleDocViewerUrl}
                                style={{ width: '100%', height: '100%' }}
                                frameBorder="0"
                                onError={handleError}
                            />
                        </div>
                    ) : isImage ? (
                        <div className="flex justify-center align-center">
                            <Image
                                title={file.title}
                                src={`${ApiUrl}fileupload/api/file/${file.guiid}`}
                                alt="Không có hiển thị"
                                width={500}
                                height={500}
                                onError={handleError}
                            />
                        </div>
                    ) : (
                        <div className="flex justify-center align-center">
                            <p>Không thể hiển thị tệp này.</p>
                        </div>
                    )}
                </>
            </Modal>
        </>
    );
}
