import React, { useRef, useState, useEffect, useCallback } from 'react';
import { UserNotificationModel, NotificationTypeEnum, WebsocketEnum } from '@/shared/model';
import useInfiniteScroll from '../../contact/use-infinite-scroll';
import { formatDistanceToNow, isToday, isYesterday, isThisWeek, isThisMonth, isLastDayOfMonth, isThisYear } from 'date-fns';
import { AuthService } from '@/shared/services';
import { useWebSocket } from '../../websocket/services';
import { WebSocketModel } from '@/shared/model';
import { notificationServices } from '../services';
import DOMPurify from 'dompurify';
import { BsThreeDots } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import { FaUsers } from "react-icons/fa";
import { IoCheckmarkOutline, IoCheckmarkDone } from "react-icons/io5";
import { AiFillLike, AiOutlineComment, AiOutlineTag, AiFillMessage, AiOutlineUserAdd, AiOutlineNotification } from "react-icons/ai";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdNotificationAdd } from "react-icons/md";
import { PiPasswordBold } from "react-icons/pi";

interface NotificationListProps {
    userLoginId: number | null;
    tabHeight: number;
    setIsVisible: (isVisible: boolean) => void; // Thêm prop setIsVisible
    isVisible: boolean;
    onClickNotification: (data: UserNotificationModel) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
    userLoginId,
    tabHeight,
    setIsVisible,
    isVisible,
    onClickNotification,
}) => {
    const scrollRefNotification = useRef<HTMLDivElement>(null);  // Khai báo rõ ràng kiểu cho ref
    const [notifications, setNotifications] = useState<UserNotificationModel[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isInit, setInit] = useState(true);
    const { getOauth } = AuthService();
    const { getMessage } = useWebSocket();
    const [containerHeight, setContainerHeight] = useState<number>(0); // State for container height

    const loadNotifications = async (userId: number) => {
        if (userId === 0) return;
        setIsLoading(true);
        const fetchedNotifications = await notificationServices.getListnotifications(userId, page);

        if (fetchedNotifications.length === 0) {
            setHasMoreData(false);
        } else {
            updateNotifications(fetchedNotifications);
        }
        setIsLoading(false);
    };

    const updateNotifications = (fetchedNotifications: UserNotificationModel[]) => {
        setNotifications(prevNotifications => isInit ? [...fetchedNotifications] : [...prevNotifications, ...fetchedNotifications]);
        if (isInit) setInit(false);
    };

    useEffect(() => {
        const auth = getOauth();
        if (!auth) return;
        if (hasMoreData) {
            loadNotifications(auth.idTaiKhoan);
        }
    }, [page]);

    useEffect(() => {
        let msg = getMessage();
        if (msg != null && (msg.type === WebsocketEnum.notify || msg?.type === WebsocketEnum.chat)) {
            handleNewMessage(msg);
        }
    }, [getMessage()?.sentAt]);

    useEffect(() => {
        setNotifications([]);

        const handleResize = () => {
            const topBarHeight = 0; // Độ cao của top bar
            setContainerHeight(tabHeight - topBarHeight);
        };
        handleResize(); // Khi component được render lần đầu tiên
        window.addEventListener("resize", handleResize); // Thêm event listener để lắng nghe sự thay đổi kích thước cửa sổ
        return () => window.removeEventListener("resize", handleResize); // Cleanup khi component bị unmount
    }, [tabHeight]);

    const handleNewMessage = (data: WebSocketModel) => {
        if (data.type === WebsocketEnum.connection) {
            return;
        }

        if (data.message != null) {
            let notificationData = JSON.parse(data.message);
            const input: UserNotificationModel = {
                id: notificationData.id,
                title: notificationData.title,
                message: notificationData.message,
                createdAt: notificationData.createdAt,
                notificationType: notificationData.notificationType,
                isRead: notificationData.isRead,
                keyRouter: ''
            };

            setNotifications(s => [input, ...s]);
        }
    };

    const loadMoreNotification = async () => {
        if (!hasMoreData || isLoading) return;
        setPage(prevPage => prevPage + 1);
    };

    const [isFetching] = useInfiniteScroll({ scrollRef: scrollRefNotification, fetchData: loadMoreNotification, hasMoreData: hasMoreData });

    const convertTimeToRelative = (dateTime: any | undefined): string => {
        if (dateTime === undefined) {
            return '';
        }

        const date = new Date(dateTime);

        let timeAgo = formatDistanceToNow(date, { addSuffix: false, includeSeconds: true });

        // Thay thế các chuỗi để định dạng tùy chỉnh
        timeAgo = timeAgo.replace(/about /g, '')
            .replace(/less than /g, '')
            .replace(/half /g, '')
            .replace(/a /g, '1')
            .replace(/ seconds?/g, ' giây')
            .replace(/ minutes?/g, ' phút')
            .replace(/minute?/g, ' phút')
            .replace(/ hours?/g, ' giờ')
            .replace(/ days?/g, ' ngày')
            .replace(/ months?/g, ' tháng')
            .replace(/ years?/g, ' năm');

        return timeAgo;
    };

    const groupNotificationsByDate = (notifications: UserNotificationModel[]) => {
        const groupedNotifications: { [key: string]: UserNotificationModel[] } = {};

        notifications.forEach(notification => {
            const createdAt = notification.createdAt;
            if (!createdAt) {
                return;
            }

            const date = new Date(createdAt);

            if (isNaN(date.getTime())) {
                return;
            }

            let groupKey = '';
            if (isToday(date)) {
                groupKey = 'Hôm nay';
            } else if (isYesterday(date)) {
                groupKey = 'Hôm qua';
            } else if (isThisWeek(date)) {
                groupKey = 'Tuần này';
            } else if (isThisMonth(date)) {
                groupKey = 'Tháng này';
            } else if (isThisYear(date)) {
                groupKey = 'Năm nay';
            } else {
                groupKey = date.toLocaleDateString();
            }

            if (!groupedNotifications[groupKey]) {
                groupedNotifications[groupKey] = [];
            }
            groupedNotifications[groupKey].push(notification);
        });

        return groupedNotifications;
    };

    const groupedNotifications = groupNotificationsByDate(notifications);

    // tạo icon thông báo hiển thị cạnh ảnh avatar
    const getNotifyIconStyle = (data: UserNotificationModel) => {
        let baseClassNames = "absolute -bottom-1 -right-1 text-[16px] p-1 rounded-full border border-solid border-2";
        let additionalClassNames = "";

        const icons = {
            [NotificationTypeEnum.all]: <AiOutlineNotification />, // Icon cho thông báo chung cho tất cả
            [NotificationTypeEnum.group]: <FaUsers />, // Icon cho thông báo nhóm
            [NotificationTypeEnum.friend_request]: <AiOutlineUserAdd />, // Icon cho lời mời kết bạn
            [NotificationTypeEnum.message]: <AiFillMessage />, // Icon cho tin nhắn mới
            [NotificationTypeEnum.tag]: <AiOutlineTag />, // Icon khi được tag
            [NotificationTypeEnum.like]: <AiFillLike />, // Icon khi nhận được like
            [NotificationTypeEnum.comment]: <AiOutlineComment />, // Icon cho bình luận mới
            [NotificationTypeEnum.single]: <MdNotificationAdd />, // Icon cho thông báo đơn
            [NotificationTypeEnum.password]: <PiPasswordBold />, // Icon cho password
            default: <AiOutlineNotification /> // Icon mặc định
        };

        switch (data.notificationType) {
            case NotificationTypeEnum.all:
                additionalClassNames = "bg-blue-500 text-white";
                break;
            case NotificationTypeEnum.group:
                additionalClassNames = "bg-green-500 text-white";
                break;
            case NotificationTypeEnum.friend_request:
                additionalClassNames = "bg-yellow-500 text-white";
                break;
            case NotificationTypeEnum.message:
                additionalClassNames = "bg-[#1c64f2] text-white";
                break;
            case NotificationTypeEnum.tag:
                additionalClassNames = "bg-purple-500 text-white";
                break;
            case NotificationTypeEnum.like:
                additionalClassNames = "bg-red-500 text-white";
                break;
            case NotificationTypeEnum.comment:
                additionalClassNames = "bg-orange-500 text-white";
                break;
            case NotificationTypeEnum.single:
                additionalClassNames = "bg-gray-600 text-white";
                break;
            case NotificationTypeEnum.password:
                additionalClassNames = "bg-red-600 text-white";
                break;
            default:
                additionalClassNames = "bg-gray-400 text-white";
        }

        let classNames = `${baseClassNames} ${additionalClassNames}`;
        let IconComponent = data.notificationType !== undefined ? icons[data.notificationType] : icons.default;

        return (
            <div className={classNames}>
                {IconComponent}
            </div>
        );
    };

    const safeHTMLComponent = ({ html }: { html?: string }) => {
        const cleanHTML = DOMPurify.sanitize(html || '');

        return (
            <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />
        );
    };

    const handleSelectNotification = useCallback(async (data: UserNotificationModel) => {
        // Đóng UserList khi chọn user
        setIsVisible(false);
        onClickNotification(data);
        // if (!data.isRead) await updateIsReadOfNotification(data);

    }, [onClickNotification, setIsVisible]);

    // hàm chuyển đổi unicode sang emoij nếu có
    function convertUnicodeToEmoji(str?: string | null): string {
        if (!str) return '';
        return str.replace(/U\+([0-9A-F]{4,6})/gi, (_, code) => {
            let codePoint = parseInt(code, 16);
            while (code.length > 0) {
                try {
                    if (codePoint <= 0x10FFFF) {
                        return String.fromCodePoint(codePoint);
                    } else {
                        console.log('Invalid Unicode code point:', code);
                        code = code.slice(0, -1); // Giảm một ký tự
                        codePoint = parseInt(code, 16);
                    }
                } catch (e) {
                    console.warn('Error converting code point:', code, e);
                    code = code.slice(0, -1); // Giảm một ký tự
                    codePoint = parseInt(code, 16);
                }
            }
            return ''; // Trả về chuỗi trống nếu mã không hợp lệ
        });
    }    


    return (
        <div ref={scrollRefNotification} className="p-0 bg-white w-full overflow-y-auto" style={{ height: containerHeight }}>
            {Object.keys(groupedNotifications).map(group => (
                <div key={group}>
                    <div className="text-xl font-bold p-1">{group}</div>
                    {groupedNotifications[group].map(notification => (
                        <div key={notification.id}
                            className={`flex flex-col cursor-pointer rounded-[10px] m-1 ${notification.isRead ? 'hover:bg-[#dcf1fa]' : 'bg-[#c7edfc]'}`}
                            onClick={() => handleSelectNotification(notification)}
                        >
                            <div className="flex w-full py-1">
                                <div className="flex items-center justify-center px-1 text-[20px] relative">
                                    <div className="relative z-10">
                                        <GoDotFill size={25} color={`${notification.isRead ? 'gray' : 'blue'}`} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-center mr-[10px]">
                                    <div className="relative h-16 w-16">
                                        <img src="/user.jpg" alt="profile picture" className="w-16 h-16 rounded-full" />
                                        {getNotifyIconStyle(notification)}
                                    </div>
                                </div>
                                <div className="flex-grow flex flex-col w-[65%]">
                                    <div className="">{safeHTMLComponent({ html: notification.title })}</div>
                                    <div className="truncate text-slate-500 text-[12px]">
                                        {convertTimeToRelative(notification.createdAt)} ·
                                        <i> {convertUnicodeToEmoji(notification.message)}</i>
                                    </div>
                                </div>

                                <div className="flex-grow flex flex-col text-right mx-[5px] w-[5%]">
                                    <div className="flex flex-col w-full h-full justify-between">
                                        <div className="w-full flex items-center justify-center mt-2">
                                            <span className="whitespace-nowrap text-[12px] text-slate-500">
                                                <BsThreeDots />
                                            </span>
                                        </div>
                                        <div className="w-full flex items-center justify-center truncate text-[14px] mb-2">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
            {isFetching && <div>Đang tải thêm...</div>}
        </div>
    );
};

export default NotificationList;
