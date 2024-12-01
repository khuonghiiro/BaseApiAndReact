// TabMessage.tsx
import React, { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { Contact, ChatUser, WebsocketEnum } from '@/shared/model';
import useInfiniteScroll from '../use-infinite-scroll';
import { formatDistanceToNow } from 'date-fns';
import { contactServices } from '../services';
import { AuthService } from '@/shared/services';
import NumberedIcon from './numbered-icon';
import { useWebSocket } from '../../websocket/services';
import { WebSocketModel } from '@/shared/model';

interface TabMessageProps {
    userLoginId: number | null;
    onSelectContact: (contact: Contact) => void;
    activeUserId: number | null;
    tabHeight: number;
}

const TabContacts: React.FC<TabMessageProps> = ({
    userLoginId,
    onSelectContact,
    activeUserId,
    tabHeight
}) => {
    const [activeContactId, setActiveContactId] = useState<number | null>(null);
    const scrollRefMessage = useRef<HTMLDivElement>(null);  // Khai báo rõ ràng kiểu cho ref
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isInit, setInit] = useState(true);
    const { getOauth } = AuthService();
    const [reload, setReload] = useState(0); // Để theo dõi việc tải lại
    const { getMessage, getContact } = useWebSocket();
    const [containerHeight, setContainerHeight] = useState<number>(0); // State for container height

    const loadUsers = async (userId: number) => {
        if (userId == 0) return;
        setIsLoading(true);
        const fetchedUsers = await contactServices.getListContacts(userId, page);

        if (fetchedUsers.length === 0) {
            setHasMoreData(false);
        } else {
            updateContacts(fetchedUsers);
        }
        setIsLoading(false);
    };

    const updateContacts = (fetchedUsers: Contact[]) => {
        setContacts(prevContacts => isInit ? [...fetchedUsers] : [...prevContacts, ...fetchedUsers]);
        if (isInit) setInit(false);
    };

    useEffect(() => {
        const auth = getOauth();
        if (!auth) return;
        if (hasMoreData) {
            loadUsers(auth.idTaiKhoan);
        }
    }, [page]);

    useEffect(() => {
        let msg = getContact();
        if (msg != null && msg.type === WebsocketEnum.contact) {
            handleNewMessage(msg);
        }
    }, [getContact()?.sentAt]);

    useEffect(() => {
        async function reset() {
            setPage(1);
            setHasMoreData(true);
            setInit(true);
            setIsLoading(false);
            await new Promise(resolve => setTimeout(resolve, 0)); // Đợi next tick

            let attempts = 0; // Biến để đếm số lần thực hiện

            const intervalId = setInterval(async () => {
                if (userLoginId != null && userLoginId !== 0) {

                    const fetchedUsers = await contactServices.getListContacts(userLoginId, 1);

                    if (fetchedUsers.length !== 0) {
                        updateContacts(fetchedUsers);
                    }

                    attempts++; // Tăng số lần thực hiện

                    // Kiểm tra điều kiện để dừng
                    if (attempts >= 3 || (attempts < 3 && fetchedUsers.length !== 0)) {
                        clearInterval(intervalId); // Dừng interval
                    }
                } else {
                    clearInterval(intervalId); // Dừng nếu không có userLoginId
                }
            }, 2000); // Chạy mỗi 2 giây

            return () => clearInterval(intervalId); // Cleanup khi component unmount
        }

        reset();
    }, [reload]);

    useEffect(() => {
        const handleResize = () => {
            const topBarHeight = 55; // Độ cao của top bar
            setContainerHeight(tabHeight - topBarHeight);
        };
        handleResize(); // Khi component được render lần đầu tiên
        window.addEventListener("resize", handleResize); // Thêm event listener để lắng nghe sự thay đổi kích thước cửa sổ
        return () => window.removeEventListener("resize", handleResize); // Cleanup khi component bị unmount
    }, []);

    const handleNewMessage = (data: WebSocketModel) => {

        if (data.type === WebsocketEnum.connection) {
            return;
        }

        if (data.type === WebsocketEnum.contact && data.message != null) {
            let contactData = JSON.parse(data.message);

            console.log("contactData", contactData);
            const input: Contact = {
                id: contactData.id,
                userFirstId: contactData.userFirstId,
                userSecondId: contactData.userSecondId,
                lastMessageId: contactData.lastMessageId,
                message: contactData.message,
                messageStatus: contactData.messageStatus,
                sentAt: contactData.sentAt,
                view: contactData.view ?? 0
            };

            updateContactsFromMessages(input);
        }
    };

    // Hàm cập nhật messages trong contacts dựa vào latestMessages
    const updateContactsFromMessages = async (latestMessages: Contact) => {

        // Kiểm tra nếu không có latestMessages hoặc latestMessages có id là 0
        if (!latestMessages || latestMessages.id === 0) {
            console.log("No updates found, triggering reload");
            setReload(prev => prev + 1); // Thay đổi giá trị reload để kích hoạt useEffect
            return;
        }

        let isUpdated = false; // Biến để kiểm tra liệu có cập nhật nào được thực hiện không

        // Duyệt qua từng liên lạc và cập nhật nếu ID trùng với latestMessages.id
        const updatedContacts = contacts.map(contact => {
            if (contact.id === latestMessages.id) {
                isUpdated = true; // Đánh dấu đã có cập nhật
                return {
                    ...contact,
                    message: latestMessages.message,  // Cập nhật chỉ trường message
                    sentAt: latestMessages.sentAt,    // Cập nhật chỉ trường sentAt
                    view: latestMessages.view,
                    lastMessageId: latestMessages.lastMessageId,
                    messageStatus: latestMessages.messageStatus

                };
            }
            return contact; // Trả về liên lạc không thay đổi nếu không có cập nhật
        });

        if (isUpdated) {
            setContacts(updatedContacts); // Cập nhật state chỉ khi có thay đổi
        } else {
            console.log("No contact updates found, triggering reload");
            setReload(prev => prev + 1); // Thay đổi giá trị reload để kích hoạt useEffect nếu không có thay đổi
        }
    };

    const loadMoreContact = async () => {
        if (!hasMoreData || isLoading) return;
        setPage(prevPage => prevPage + 1);
    };

    const [isFetching] = useInfiniteScroll({ scrollRef: scrollRefMessage, fetchData: loadMoreContact, hasMoreData: hasMoreData });

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
            .replace(/ seconds?/g, 's')
            .replace(/ minutes?/g, 'm')
            .replace(/minute?/g, 'm')
            .replace(/ hours?/g, 'h')
            .replace(/ days?/g, 'd')
            .replace(/ months?/g, 'mo')
            .replace(/ years?/g, 'y');

        return timeAgo;
    };

    const handleSelectContact = useCallback(async (selectContact: Contact) => {
        setActiveContactId(selectContact.id);

        onSelectContact(selectContact);
        // Lưu lại vị trí cuộn hiện tại
        const scrollMessagePosition = scrollRefMessage.current?.scrollTop ?? 0;

        // Đặt lại vị trí cuộn sau khi component cập nhật
        setTimeout(() => {
            if (scrollRefMessage.current) {
                scrollRefMessage.current.scrollTop = scrollMessagePosition;
            }
        }, 0);

    }, [onSelectContact]);

    function getMessageStyle(data: Contact) {
        var isCheck = data.messageStatus === 2 ||
            data.lastMessageId === userLoginId;
        return { color: isCheck ? '#64748b' : 'black', fontWeight: isCheck ? 'normal' : 'bold' };
    }

    // kiểm tra xem nó có nằm trong danh sách không
    const isHasContact = (data: Contact) => {

        if ((activeUserId != null &&
            activeUserId != 0 &&
            (data.userFirstId == activeUserId || data.userSecondId == activeUserId)) ||
            (data.id === activeContactId)
        ) {
            activeUserId = null;
            return true;
        }

        return false;
    }

    // lấy user id và nick name
    const getContactUserNameAndId = (data: Contact): { userId: number, nickName: string } => {
        if (data.userFirstId === userLoginId) {
            // Trả về userSecondId và chỉ rõ người dùng hiện tại là userFirstId
            return { userId: data.id, nickName: data.userSecondName ?? '' };
        } else {
            // Trả về userFirstId và chỉ rõ người dùng hiện tại là userSecondId
            return { userId: data.id, nickName: data.userFirstName ?? '' };
        }
    }

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
        <div ref={scrollRefMessage} className="p-0 bg-white w-full overflow-y-auto"
            style={{ height: containerHeight }}>
            {contacts.map((contact, index) => {

                const { userId, nickName } = getContactUserNameAndId(contact);
                return (
                    <div key={contact.id}
                        className={`flex flex-col py-0.5 pr-0.5 cursor-pointer ${isHasContact(contact) ? 'bg-[#c7edfc]' : 'hover:bg-[#dcf1fa]'}`}
                        onClick={() => handleSelectContact(contact)}>
                        <div className="flex w-full py-1">
                            <div className="flex items-center justify-center px-1">
                                <img src="/user.jpg" alt="profile picture" className="w-10 h-10 rounded-full" />
                            </div>
                            <div className="flex-grow flex flex-col w-8/12">
                                <div className="truncate">{nickName}</div>
                                <div className="truncate text-slate-500 text-[14px]" style={getMessageStyle(contact)}>
                                    {convertUnicodeToEmoji(contact.message) || 'Không có tin nhắn mới'}
                                </div>
                            </div>
                            <div className="flex-grow flex flex-col text-right mx-[5px] w-2/12">
                                <div>
                                    <span className="whitespace-nowrap text-[12px] text-slate-500">
                                        {contact.sentAt ? convertTimeToRelative(contact.sentAt) : ''}
                                    </span>
                                </div>
                                <div className="truncate text-[14px] text-[#0e72cf] flex flex-1 flex-row-reverse">
                                    {contact.lastMessageId == userLoginId ? '' : <NumberedIcon color='#0e72cf' number={contact.view} />}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            )}

            {isFetching && <div>Loading more contact...</div>}
        </div>
    );
};

export default TabContacts;
