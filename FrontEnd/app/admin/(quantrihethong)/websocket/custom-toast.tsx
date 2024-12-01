import React from 'react';
import { ChatUser } from '@/shared/model';
import { formatDistanceToNow } from 'date-fns';
import { Toast } from 'react-toastify/dist/components';

interface CustomToastProps {
    chatUserObj: ChatUser;
}

export const CustomToast: React.FC<CustomToastProps> = ({ chatUserObj }) => {

    const convertTimeToRelative = (dateTime: Date | undefined): string => {

        if (!dateTime) {
            return '';
        }

        const date = new Date(dateTime);

        let timeAgo = formatDistanceToNow(date, { addSuffix: false, includeSeconds: true });

        // Thay thế các chuỗi để định dạng tùy chỉnh
        timeAgo = timeAgo.replace(/about /g, '')
            .replace(/less than /g, '')
            .replace(/half /g, '')
            .replace(/a /g, '1')
            .replace(/ seconds?/g, 's')
            .replace(/ minutes?/g, 'm')
            .replace(/minute?/g, 'm')
            .replace(/ hours?/g, 'h')
            .replace(/ days?/g, 'd')
            .replace(/ months?/g, 'mo')
            .replace(/ years?/g, 'y');

        return timeAgo;
    };

    return (
        <div className={`flex flex-col cursor-pointer`} >
            <div className="flex w-full">
                <div className="flex items-center justify-center px-1">
                    <img src="/user.jpg" alt="profile picture" className="w-10 h-10 rounded-full" />
                </div>
                <div className="flex-grow flex flex-col w-8/12">
                    <div className="truncate">Nguyễn Văn A</div>
                    <div className="pt-1 truncate text-slate-500 text-[14px] color-[#64748b]">
                        {chatUserObj.message || 'Không có tin nhắn mới'}
                    </div>
                </div>
                <div className="flex-none w-1/12 text-right pr-1">
                    <span className="whitespace-nowrap text-[12px] text-slate-500">
                        {chatUserObj.sentAt ? convertTimeToRelative(chatUserObj.sentAt) : ''}
                    </span>
                </div>
            </div>
        </div>
    );
};
