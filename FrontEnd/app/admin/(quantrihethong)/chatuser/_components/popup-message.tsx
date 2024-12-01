import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MdOutlineClose } from "react-icons/md";
import { userServices } from '../../users/services';
import { ChatUser, User, WebSocketModel, WebsocketEnum } from '@/shared/model';
import MessageList from './message-list';
import MessageInput from './message-input';
import { useWebSocket } from '../../websocket/services';

interface PopupType {
    userId: number;
    chatUserId: number | null;
    forceFocus: boolean;
}


// chỉ dùng cho trường hợp muốn xử lý forcus với input, còn không thì dùng import-msg-popup.tsx để click mở popup luôn
function PopupMessage(
    {
        selectUserId,
        userLoginId,
        fullName,
        onClickClose,
        forceFocus,
        openPopups,
        setOpenPopups,
        isVisible = false,
        chatUserId = null
    }: {
        selectUserId: number,
        userLoginId: number,
        fullName: string,
        onClickClose: (index: number) => void,
        forceFocus: boolean,
        isVisible: boolean,
        chatUserId?: any
        openPopups: PopupType[]; // Định nghĩa PopupType nếu cần
        setOpenPopups: React.Dispatch<React.SetStateAction<PopupType[]>>;
    }) {
    const [userData, setUserData] = useState<User | null>(null);

    const { resetMessage, getMessage } = useWebSocket();
    const [messages, setMessages] = useState<ChatUser[]>([]);
    const messageInputRef = useRef<HTMLTextAreaElement>(null);  // Tạo ref cho input focus
    const [isInit, setInit] = useState(true);
    const [isFocus, setIsFocus] = useState(false);
    const [isSeen, setIsSeen] = useState(true);

    useEffect(() => {
        return () => {
            resetMessage();
        };
    }, []);

    useEffect(() => {
        setMessages([]);
        fetchUserData(selectUserId);

        setInit(false);
    }, [isVisible]); // useEffect sẽ chạy lại mỗi khi selectUserId thay đổi

    useEffect(() => {
        if (forceFocus && messageInputRef.current) {
            messageInputRef.current.focus();
            // Đặt lại forceFocus để không focus nữa trừ khi được kích hoạt lại
            const newPopups = openPopups.map(popup =>
                popup.userId === selectUserId ? { ...popup, forceFocus: false } : popup
            );
            setOpenPopups(newPopups);
        }
    }, [forceFocus, messageInputRef, openPopups, setOpenPopups, selectUserId]);
    

    useEffect(() => {
        let msg = getMessage();

        if (msg != null && msg.type === WebsocketEnum.chat) {
            handleNewMessage(msg);
        }
    }, [getMessage()?.sentAt]);

    const handleClose = useCallback(() => {
        onClickClose(selectUserId);  // Sửa lại nếu cần sử dụng index
    }, [onClickClose, selectUserId]);

    async function fetchUserData(userId: number) {
        try {
            if (userId != 0) {
                var userObj = await userServices.findById(userId);
                userObj.idTaiKhoan = userObj.id;

                setUserData(userObj);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    // hàm để gửi tin nhắn
    const handleSendMessage = async (chatUserId: any, newMessage: string) => {

        if (userLoginId != null) {

            const messageData: ChatUser = {
                id: chatUserId,
                senderId: userLoginId,
                receiverId: selectUserId ?? 0,
                message: newMessage,
                sentAt: new Date(),
                isOwn: true,
                lastMessageId: userLoginId,
                messageStatus: 0
            };

            setMessages(prevMessages => sortMessages([...prevMessages, messageData]));
            setIsSeen(true);
        }

    }

    // hàm nhận tin nhắn
    const handleNewMessage = (async (data: WebSocketModel) => {
        if (data.type === WebsocketEnum.connection && data.receiverId === 0) {
            console.log('Đã kết nối websocket.');
            return;
        }

        if (data.type === WebsocketEnum.connection && data.receiverId === 0) {
            console.log('Người nhận không tồn tại trong danh sách.');
            return;
        }

        if (data.type === WebsocketEnum.connection && data.receiverId !== 0) {
            console.log('Người nhận hiện đang không online.');
            return;
        }

        if(data.type !== WebsocketEnum.chat) return;

        if (isInit) {
            setInit(false);
            setMessages([]);
            setIsSeen(false);
        }
        else if(data != null && data.type === WebsocketEnum.chat && data.message != null) {

            let chatUserObj = JSON.parse(data.message);

            const messageData: ChatUser = {
                id: chatUserObj.id,
                senderId: chatUserObj.senderId,
                receiverId: chatUserObj.receiverId,
                message: chatUserObj.message,
                sentAt: chatUserObj.sentAt,
                isOwn: false,
                lastMessageId: chatUserObj.lastMessageId,
                messageStatus: chatUserObj.messageStatus
            };

            setMessages(prevMessages => sortMessages([...prevMessages, messageData]));

            // kiểm tra xem tin nhắn gửi đến có thuộc popup có user id đã mở lên hay không
            if (chatUserObj.senderId === selectUserId) {
                setIsSeen(false);
            }
        }

    });

    const handleInputFocus = (isInputFocus: boolean) => {
        setIsFocus(isInputFocus);

        if (isInputFocus) setIsSeen(true);
    }

    function setPopupStyle() {
        if (!isSeen) {
            return { backgroundColor: '#ff1a1a' };
        }

        // Mặc định trả về màu xanh nếu không có tin nhắn
        return { backgroundColor: isFocus ? '#1c64f2' : '#5fc1ff' };
    }


    // Hàm sortMessages sẽ sắp xếp các tin nhắn theo thời gian từ mới nhất đến cũ nhất
    const sortMessages = (messages: ChatUser[]) => {
        return messages.sort((a: ChatUser, b: ChatUser) => {
            const dateA = new Date(a.sentAt ?? new Date());
            const dateB = new Date(b.sentAt ?? new Date());
            return dateB.getTime() - dateA.getTime(); // Sắp xếp thời gian tăng dần
        });
    };


    const filteredMessages = messages.filter(msg => msg.senderId === selectUserId ||
        msg.receiverId === selectUserId);

    return (
        <div className="bg-white rounded-lg w-[320px] h-[450px] flex flex-col">
            <div className="bg-blue-400 text-white text-left rounded-t-lg rounded-tr-lg h-[50px]"
                style={setPopupStyle()}
            >
                <div className={`flex flex-col py-0.5 pr-2 cursor-pointer`}>
                    <div className="flex w-full py-1">
                        <div className="flex items-center justify-center px-1">
                            <img src="/user.jpg" alt="profile picture" className="w-10 h-10 rounded-full" />
                        </div>
                        <div className="flex items-center justify-left w-8/12">
                            <div className="truncate">{userData?.fullName ?? 'Tài khoản lạ'}</div>
                        </div>
                        <div className="ml-auto flex items-center justify-center pr-2"
                            onClick={() => handleClose()}
                        >
                            <MdOutlineClose />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col flex-grow h-[400px]">
                <div className="flex-grow overflow-y-auto">
                    <MessageList
                        userLoginId={userLoginId}
                        selectUserId={selectUserId}
                        messages={filteredMessages}
                        isVisible={isVisible}
                        scrollToMessageId={chatUserId}
                    />
                </div>
                <div className="bg-white p-1">
                    <MessageInput
                        onInputFocus={handleInputFocus}
                        onSendMessage={handleSendMessage}
                        inputRef={messageInputRef}
                        userLoginId={userLoginId}
                        fullName={fullName}
                        selectUserId={selectUserId} />
                </div>
            </div>
        </div>
    );
}

export default PopupMessage;
