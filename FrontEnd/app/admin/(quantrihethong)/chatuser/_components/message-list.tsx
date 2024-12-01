import React, { useEffect, useRef, useState, useMemo, useLayoutEffect } from 'react';
import { ChatUser } from '@/shared/model';
import { chatUserServices } from '../services';

interface MessageListProps {
  userLoginId: number | null;
  selectUserId: number | null;
  messages: ChatUser[];
  isVisible: boolean;
  scrollToMessageId?: any;
}

function MessageList({ userLoginId, selectUserId, messages, isVisible = false, scrollToMessageId = null }: MessageListProps) {
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [listMessages, setListMessages] = useState<ChatUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInit, setInit] = useState(true);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const newMessages = await chatUserServices.GetListMessageAtId(userLoginId ?? -1, selectUserId ?? -1, pageIndex);
      if (newMessages.length > 0) {
        updateChatUsers(newMessages);
      } else {
        console.log("Không tìm thấy danh sách chat user");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setIsLoading(false);
    }
  };

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



  const updateChatUsers = (fetchedUsers: ChatUser[]) => {
    setListMessages(prevMessages => {
      const currentScrollPosition = messageContainerRef.current?.scrollTop ?? 0;
      const scrollHeightBeforeUpdate = messageContainerRef.current?.scrollHeight ?? 0;
      const updatedMessages = isInit ? [...fetchedUsers] : [...prevMessages, ...fetchedUsers];
      requestAnimationFrame(() => {
        if (messageContainerRef.current) {
          messageContainerRef.current.scrollTop = currentScrollPosition + (messageContainerRef.current.scrollHeight - scrollHeightBeforeUpdate);
        }
      });
      return updatedMessages;
    });

    if (isInit) setInit(false);
  };

  useEffect(() => {
    setPageIndex(1);
    setListMessages([]);
  }, [isVisible]);

  useEffect(() => {
    if (userLoginId != null && selectUserId != null) {
      fetchMessages();
    }
  }, [pageIndex, isVisible]);

  const handleScroll = () => {
    if (messageContainerRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = messageContainerRef.current;
      if (scrollTop === 0 && clientHeight < scrollHeight && !isLoading) {
        setPageIndex(prevPageIndex => prevPageIndex + 1);
      }
    }
  };

  useEffect(() => {
    const currentRef = messageContainerRef.current;
    currentRef?.addEventListener('scroll', handleScroll);
    return () => {
      currentRef?.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading]);

  useEffect(() => {
    if (scrollToMessageId && messageContainerRef.current) {
      const element = document.getElementById(scrollToMessageId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [scrollToMessageId, messages, listMessages]);

  const sortedMessages = useMemo(() => {
    return messages.concat(listMessages).sort((a, b) => {
      const dateA = new Date(a.sentAt ?? new Date());
      const dateB = new Date(b.sentAt ?? new Date());
      return dateA.getTime() - dateB.getTime();
    });
  }, [messages, listMessages]);

  useLayoutEffect(() => {
    if (messageContainerRef.current) {
      const { clientHeight, scrollHeight } = messageContainerRef.current;
      messageContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [sortedMessages]);

  const renderAttachment = (message: ChatUser) => {
    if (message.attachmentType === "image") {
      return <img src={message.attachmentUrl} alt="Hình ảnh" />;
    } else if (message.attachmentType === "document") {
      return <a href={message.attachmentUrl} target="_blank" rel="noopener noreferrer">Tài liệu</a>;
    }
  };

  const getTimeTooltip = (sentAt?: Date) => {
    if (!sentAt) return "";

    const messageDate = new Date(sentAt);
    const today = new Date();
    const isToday = messageDate.toDateString() === today.toDateString();

    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    if (isToday) {
      return messageDate.toLocaleTimeString('vi-VN', options);
    } else {
      const dateFormatOptions: Intl.DateTimeFormatOptions = {
        ...options,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      };
      return messageDate.toLocaleDateString('vi-VN', dateFormatOptions);
    }
  };

  const groupMessagesByDateAndOwner = (messages: ChatUser[]) => {
    const groupedMessages: { [key: string]: ChatUser[][] } = {};

    messages.forEach(message => {
      const messageDate = new Date(message.sentAt ?? new Date());
      let dateKey = '';

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (messageDate.toDateString() === today.toDateString()) {
        dateKey = 'Hôm nay';
      } else if (messageDate.toDateString() === yesterday.toDateString()) {
        dateKey = 'Hôm qua';
      } else {
        const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
        dateKey = `${days[messageDate.getDay()]}, Ngày ${messageDate.getDate()}-${messageDate.getMonth() + 1}-${messageDate.getFullYear()}`;
      }

      if (!groupedMessages[dateKey]) {
        groupedMessages[dateKey] = [];
      }
      if (groupedMessages[dateKey].length === 0 || groupedMessages[dateKey][groupedMessages[dateKey].length - 1][0].isOwn !== message.isOwn) {
        groupedMessages[dateKey].push([]);
      }
      groupedMessages[dateKey][groupedMessages[dateKey].length - 1].push(message);
    });

    return groupedMessages;
  };

  const groupedMessages = groupMessagesByDateAndOwner(sortedMessages);

  return (
    <div ref={messageContainerRef} className="flex flex-col flex-1 overflow-y-auto p-2 h-full">
      <div className="flex flex-1 mb-2.5 flex-row"></div>
      <div className="flex flex-1 mb-2.5 flex-row"></div>
      <div className="flex flex-1 mb-2.5 flex-row"></div>
      <div className="flex flex-1 mb-2.5 flex-row"></div>
      {Object.keys(groupedMessages).map(dateKey => (
        <div key={dateKey}>
          <div className="flex items-center mb-2 text-gray-500 text-[12px]">
            <hr className="flex-grow border-t border-gray-300 mr-2" />
            {dateKey}
            <hr className="flex-grow border-t border-gray-300 ml-2" />
          </div>

          {groupedMessages[dateKey].map((group, groupIndex) => (
            <div key={groupIndex} className="flex flex-col">
              {group.map((msg, index) => (
                <div key={index} id={msg.id} className={`break-all flex flex-1 mb-0.5 ${msg.isOwn ? 'flex-row-reverse' : ''}`}>
                  {!msg.isOwn && (
                    <>
                      {index === group.length - 1 && (
                        <div className="flex items-end justify-center px-1 w-[50px]">
                          <img src="/user.jpg" alt="profile picture" className="w-10 h-10 rounded-full" />
                        </div>
                      )}
                      {!(index === group.length - 1) && (
                        <div className="flex items-end justify-center px-1 w-[50px]"></div>
                      )}
                    </>
                  )}
                  <div
                    className={`flex items-center justify-center p-2.5 rounded-xl max-w-[60%] ${msg.isOwn ? 'self-end bg-[#dcf8c6]' : 'self-start bg-[#f0f0f0]'} whitespace-pre-wrap ${msg.id === scrollToMessageId ? 'border-[#528ef0] border-2' : ''}`}
                    title={getTimeTooltip(msg.sentAt)}
                  >
                    {convertUnicodeToEmoji(msg.message)}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default MessageList;
