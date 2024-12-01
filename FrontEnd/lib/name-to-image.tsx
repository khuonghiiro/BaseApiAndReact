import React, { useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';

interface NameToImageProps {
    name: string;
    filePath: string;
    className?: string;
}

const NameToImage: React.FC<NameToImageProps> = ({ name, filePath, className = '' }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    const colorPairs = [
        { bg: '#FF5733', text: '#FFFFFF' }, // Màu cam
        // { bg: '#33FF57', text: '#FFFFFF' }, // Màu xanh lá cây
        // { bg: '#3357FF', text: '#FFFFFF' }, // Màu xanh dương
        // { bg: '#FF33A1', text: '#FFFFFF' }, // Màu hồng
        // { bg: '#FF8C33', text: '#FFFFFF' }, // Màu cam nhạt
        // { bg: '#8C33FF', text: '#FFFFFF' }, // Màu tím
        // { bg: '#FFB533', text: '#FFFFFF' }, // Màu vàng
        // { bg: '#33FFF2', text: '#FFFFFF' }, // Màu xanh ngọc
        // { bg: '#FF3333', text: '#FFFFFF' }, // Màu đỏ
        // { bg: '#33FFCE', text: '#FFFFFF' }, // Màu xanh lá nhạt
        // { bg: '#FF5733', text: '#FFFFFF' }, // Màu cam đậm
        // { bg: '#5D33FF', text: '#FFFFFF' }, // Màu xanh dương đậm
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            // console.error('Canvas not found');
            return; // Kiểm tra sự tồn tại của canvas
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            // console.error('Context not found');
            return; // Kiểm tra sự tồn tại của ctx
        }

        const width = 100;
        const height = 100;

        // Tách các từ từ tên
        const nameParts = name.split(' ');

        // Lấy chữ cái đầu tiên của từ đầu tiên và từ cuối cùng
        const initials = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();

        // Chọn ngẫu nhiên một cặp màu
        const randomIndex = Math.floor(Math.random() * colorPairs.length);
        const bgColor = colorPairs[randomIndex].bg;
        const textColor = colorPairs[randomIndex].text;

        // Vẽ nền
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        // Vẽ chữ
        ctx.fillStyle = textColor;
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initials, width / 2, height / 2);

        // Hiển thị canvas để kiểm tra
        // console.log('Canvas drawn:', canvas.toDataURL());

        // Chuyển đổi canvas thành hình ảnh
        toPng(canvas)
            .then((dataUrl) => {
                const img = imageRef.current;
                if (!img) {
                    // console.error('Image element not found');
                    return; // Kiểm tra sự tồn tại của img
                }
                img.src = dataUrl;
                console.log('Image created successfully:', dataUrl);

                // Lưu hình ảnh nếu cần
                // dùng api để lưu ảnh và đường dẫn ảnh
            })
            .catch((error) => {
                // console.error('Đã xảy ra lỗi tạo ảnh!', error);
            });
    }, [name, filePath]);

    return (
        <div >
            <canvas ref={canvasRef} width={100} height={100} style={{ display: 'block' }} className={className}/>
            {/* <img ref={imageRef} alt={name} className={className}/> */}
        </div>
    );
};

export default NameToImage;