import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FaPaperPlane, FaSmile } from 'react-icons/fa';
import { CgAttachment } from "react-icons/cg";
import { IoCloseOutline } from "react-icons/io5";
import { contactServices } from '../../contact/services';
import { ChatUser, MessageStatusEnum, WebSocketModel, WebsocketEnum } from '@/shared/model';
import { useWebSocket } from '../../websocket/services';
import { userServices } from '../../users/services';
import { v4 as uuidv4 } from 'uuid';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data'; // Import the emoji data
import { FaRegFaceSmile } from 'react-icons/fa6';
import './emoji-mart.css'

interface MessageInputProps {
    onSendMessage: (chatUserId: any, newMessage: string) => void;
    inputRef: React.RefObject<HTMLTextAreaElement>;
    userLoginId: number | null;
    fullName: string | null;
    selectUserId: number | null;
    onInputFocus: (isForcus: boolean) => void;
}

function MessageInput({ onSendMessage, inputRef, userLoginId, fullName, selectUserId, onInputFocus }: MessageInputProps) {
    const { cancelView, sendMessage } = useWebSocket();
    const [message, setMessage] = useState<string>('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [filePreviews, setFilePreviews] = useState<string[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [initialTextareaWidth, setInitialTextareaWidth] = useState<number>(0);
    const [initialContainerHeight, setInitialContainerHeight] = useState<number>(0);
    const [roundedClass, setRoundedClass] = useState<string>('rounded-full');
    const inputFileId = `file-upload-${uuidv4()}`;
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

    const sendMessageText = () => {
        if (message.trim()) {
            let msgId = uuidv4();
            onSendMessage(msgId, message);
            setMessage('');
            setSelectedFiles([]);
            setFilePreviews([]);
            focusInputAndUpdateContact(userLoginId, selectUserId, message, msgId);
        }
    };

    const handleEmojiSelect = (emoji: any) => {
        setMessage(prevMessage => prevMessage + emoji.native);
        setShowEmojiPicker(false);
    };

    // Hàm chuyển đổi emoji sang unicode
    function convertEmojiToUnicode(str: string): string {
        // Sử dụng regex để tìm tất cả các ký tự bao gồm cả các emoji
        return str.match(/[\s\S]/gu)?.map(char => {
            const code = char.codePointAt(0);
            // Kiểm tra nếu code thuộc phạm vi emoji
            if (code !== undefined && (code >= 0x1F600 && code <= 0x1F64F || // Emoticons
                                       code >= 0x1F300 && code <= 0x1F5FF || // Miscellaneous Symbols and Pictographs
                                       code >= 0x1F680 && code <= 0x1F6FF || // Transport and Map Symbols
                                       code >= 0x1F700 && code <= 0x1F77F || // Alchemical Symbols
                                       code >= 0x1F780 && code <= 0x1F7FF || // Geometric Shapes Extended
                                       code >= 0x1F800 && code <= 0x1F8FF || // Supplemental Arrows-C
                                       code >= 0x1F900 && code <= 0x1F9FF || // Supplemental Symbols and Pictographs
                                       code >= 0x1FA00 && code <= 0x1FA6F || // Chess Symbols
                                       code >= 0x1FA70 && code <= 0x1FAFF || // Symbols and Pictographs Extended-A
                                       code >= 0x2600 && code <= 0x26FF ||   // Miscellaneous Symbols
                                       code >= 0x2700 && code <= 0x27BF ||   // Dingbats
                                       code >= 0x2B50 && code <= 0x2B55)) {  // Other symbols
                return `U+${code.toString(16).toUpperCase()}`;
            }
            return char; // Trả về ký tự gốc nếu không phải là emoji
        }).join('') || '';
    }     

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
        const previews = files.map(file => {
            if (file.type.startsWith('image/')) {
                return URL.createObjectURL(file);
            } 
            else if (file.name.endsWith('.pdf')) {
                return '/pdf.png'; // Thay thế bằng đường dẫn đến biểu tượng pdf.png
            }
            else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
                return '/doc.png'; // Thay thế bằng đường dẫn đến biểu tượng doc.png
            }
            else if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
                return '/excel.png'; // Thay thế bằng đường dẫn đến biểu tượng xls.png
            }
            return null;
        }).filter(Boolean) as string[];
        setFilePreviews((prevPreviews) => [...prevPreviews, ...previews]);
    };

    const handleFileRemove = (index: number) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        setFilePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessageText();
        }
    };

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [message]);

    useEffect(() => {
        if (containerRef.current) {
            setInitialTextareaWidth(containerRef.current.offsetWidth);
            setInitialContainerHeight(containerRef.current.offsetHeight);
        }
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const currentWidth = containerRef.current.offsetWidth;
                if (currentWidth !== initialTextareaWidth) {
                    // Handle width change logic here
                    console.log('Textarea width changed:', currentWidth);
                    setInitialTextareaWidth(currentWidth);
                }
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [initialTextareaWidth]);

    useEffect(() => {
        const checkContainerHeight = () => {
            if (containerRef.current) {
                const currentHeight = containerRef.current.offsetHeight;
                if (currentHeight > initialContainerHeight) {
                    setRoundedClass('rounded-[20px]');
                } else {
                    setRoundedClass('rounded-full');
                }
            }
        };

        const observer = new MutationObserver(checkContainerHeight);
        if (containerRef.current) {
            observer.observe(containerRef.current, { childList: true, subtree: true });
        }

        return () => {
            if (containerRef.current) {
                observer.disconnect();
            }
        };
    }, [initialContainerHeight]);

    const handleForcus = useCallback(async () => {
        await updateStatusAndViewOfContactAtData();
        onInputFocus(true);
    }, [selectUserId]);

    const handleBlur = useCallback(async () => {
        onInputFocus(false);
    }, [selectUserId]);

    async function findContact(userFirstId: number, userSecondId: number) {
        try {
            if (userFirstId !== 0 && userSecondId !== 0) {
                return await contactServices.getContactAtTwoIds(userFirstId, userSecondId);
            }
        } catch (err: any) {
            return null;
        }
        return null;
    }

    async function updateStatusAndViewOfContactAtData() {
        if (!userLoginId && !selectUserId && userLoginId === 0 && selectUserId === 0) return;

        let contactObj = await findContact(userLoginId ?? 0, selectUserId ?? 0);

        if (contactObj) {
            if (contactObj.lastMessageId === userLoginId) {
                return;
            }

            contactObj.messageStatus = MessageStatusEnum.watched;

            try {
                const messageData: WebSocketModel = {
                    receiverId: userLoginId ?? 0,
                    type: WebsocketEnum.contact,
                    message: JSON.stringify(contactObj)
                };
    
                cancelView(messageData);
            } catch (error) {
                console.error("Error serializing object: ", contactObj);
                throw error;
            }
            
        }
    }

    const focusInputAndUpdateContact = async (userLoginId: number | null, selectUserId: number | null, message: string, chatUserId: any) => {
        if (!userLoginId || !selectUserId || selectUserId === 0) {
            console.log("Không có user id đã chọn.");
            return;
        }
        var userReceiver = await userServices.findById(selectUserId);

        let unicodeEmoij = convertEmojiToUnicode(message);
        const chatUserData: ChatUser = {
            id: uuidv4(),
            senderId: userLoginId,
            receiverId: selectUserId,
            message: unicodeEmoij,
            sentAt: new Date(),
            messageStatus: MessageStatusEnum.sent
        };

        try {
            const messageData: WebSocketModel = {
                type: WebsocketEnum.chat,
                isOwn: true,
                receiverId: userReceiver.id,
                receiverName: userReceiver.fullName,
                message: JSON.stringify(chatUserData)
            };
    
            sendMessage(messageData);
        } catch (error) {
            console.error("Error serializing object: ", chatUserData);
            throw error;
        }

        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div
            ref={containerRef}
            className={`flex flex-col w-full border border-gray-300 ${roundedClass} hover:bg-[#f0f0f0] focus-within:border-blue-400`}>
            <div className="flex flex-col w-full overflow-x-auto">
                <div className="flex flex-row">
                    {selectedFiles.map((file, index) => (
                        <div key={index} className="p-1 ml-2.5 mb-1 relative mt-2 border border-blue-500 border-dashed" title={filePreviews[index]}>
                            {filePreviews[index] && (
                                <img src={filePreviews[index]} alt="Preview" className="w-10 h-10 object-cover rounded" />
                            )}
                            <div className="absolute -right-0 -top-2" title='Xóa file'>
                                <button
                                    className="p-0.5 bg-red-500 text-white rounded-full"
                                    onClick={() => handleFileRemove(index)}
                                >
                                    <IoCloseOutline size={15} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-end">
                <label htmlFor={inputFileId} className="cursor-pointer m-2">
                    <input
                        id={inputFileId}
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                        multiple
                    />
                    <CgAttachment className="text-xl" />
                </label>

                <button className='my-2 mr-2' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    <FaRegFaceSmile className="text-xl" />
                </button>
                {showEmojiPicker && (
                    <div className="emoji-picker-container">
                        <Picker data={data} onEmojiSelect={handleEmojiSelect} locale="vi" theme='auto' />
                    </div>
                )}
                <textarea
                    ref={textareaRef}
                    className="flex-1 px-0 bg-transparent text-black border-none resize-none overflow-hidden focus:outline-none focus:bg-transparent focus:border-none focus:ring-0 focus:shadow-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={handleForcus}
                    onBlur={handleBlur}
                    placeholder="Nhập tin nhắn..."
                    rows={1} // Chỉ định số hàng ban đầu
                    style={{ minHeight: '40px', maxHeight: '60px' }} // Đặt max-height
                />

                <button
                    className="p-2.5 bg-transparent text-blue-500 border-none cursor-pointer flex items-center justify-center"
                    onClick={sendMessageText}
                >
                    <FaPaperPlane />
                </button>

            </div>
        </div>
    );
}

export default MessageInput;