import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { DefaultMeta, DefaulPer } from "@/public/app-setting";
import { formatFullDateTime } from "@/lib";
import { ticketServices } from "../services";
import NameToImage from "@/lib/name-to-image";
import { TicketCommentFormV2 } from "./ticket-comment-form-v2";
import { FcDownRight } from "react-icons/fc";
import ShowFileAttachment from "@/lib/show-file-acttachment";
import ImportMessagegPopup from "../../(quantrihethong)/chatuser/_components/import-messsage-popup";

export const TicketComment = ({ ticketId, date }: { ticketId: number; date: Date }) => {
    const [replyCommentId, setReplyCommentId] = useState<number | null>(-1); // State để quản lý comment nào đang được trả lời
    const { data, isLoading, mutate } = ticketServices.GetListTicketComment(ticketId, replyCommentId);
    const [_date, setDate] = useState(date);
    const [childComments, setChildComments] = useState<{ [key: number]: any[] }>({}); // State để lưu trữ các bình luận con
    const [emotions, setEmotions] = useState<{ [key: number]: boolean }>({}); // State để lưu trữ trạng thái emotion
    const [userId, setUserId] = useState<number>(0);

    const onClickUserId = (selectUserId?: any | null) => {
        if (selectUserId !== undefined && selectUserId !== null) {
            setUserId(selectUserId);
        } else {
            console.log("selectUserId is undefined or null");
        }
    }

    const onCLickFeedBack = async (parentCommentId: number) => {
        let dataChild = await ticketServices.GetListTicketCommentV2(ticketId, parentCommentId);
        setChildComments((prev) => ({
            ...prev,
            [parentCommentId]: dataChild.data,
        }));
        setReplyCommentId(parentCommentId); // Set the reply comment ID to show the reply form
    }

    const onClickEmotion = async (commentId: number, emot: number) => {
        let isLike = (emot == 1) ? true : false;
        let currentEmotion = emotions[commentId] ?? isLike;
        setEmotions((prev) => ({
            ...prev,
            [commentId]: !prev[commentId] // Toggle trạng thái true/false
        }));
    };

    const handleSendComment = () => {
        setDate(new Date());
    }

    useEffect(() => {
        if (date != _date) {
            setDate(date);
        }
    }, [ticketId, date]);

    useEffect(() => {
        onCLickFeedBack(replyCommentId ?? -1);
    }, [_date]);

    const renderComment = (object: any) => (
        <>
            <div className="flex items-start">
                <div className="flex-shrink-0 mr-1 cursor-pointer" onClick={() => onClickUserId(object?.createdUser?.id)}>
                    <NameToImage className="w-8 h-8 rounded-full" filePath={object?.createdUser?.fullName} name={object?.createdUser?.fullName} />
                </div>
                <div className="flex-grow">
                    <div className="inline-block text-[16px] p-1.5 rounded-2xl bg-[#f2f3f5] max-w-full">
                        <div className="text-zinc-950 cursor-pointer mx-1 font-bold" onClick={() => onClickUserId(object?.createdUser?.id)}>
                            {object?.createdUser?.fullName}
                        </div>

                        <div className="mx-1 text-[14px] text-black">
                            {object?.content}
                        </div>
                    </div>
                    {object?.fileAttach && object?.fileAttach !== '[]' &&
                        <div className="my-4">
                            <ShowFileAttachment fileData={object?.fileAttach} />
                        </div>
                    }
                    <div className="flex text-[12px] text-[#4367b3] mt-1">
                        <button onClick={() => onClickEmotion(object.id, object?.emotion)}>
                            {emotions[object.id] ? "Bỏ thích" : "Thích"}
                        </button>
                        <button
                            className="mx-2 hover:text-blue-400"
                            onClick={() => setReplyCommentId(replyCommentId === object.id ? null : object.id)}>
                            Trả lời
                        </button>
                        <span>{formatFullDateTime(object?.createdDate)}</span>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <div className="p-4 border border-gray-300">
            {data?.data?.length > 0 ? (
                data?.data?.map((object: any) => {
                    return (
                        <div key={object.id} className="col-span-12 mb-4">
                            <div className="flex-grow">
                                {renderComment(object)}
                                {!childComments[object.id] && object?.commentChildCount > 0 &&
                                    <>
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 mr-1 w-10"></div>
                                            <div className="flex-grow">
                                                <div className="flex text-[12px] text-[#4367b3] mt-2 cursor-pointer"
                                                    onClick={() => onCLickFeedBack(object?.id)}>
                                                    <FcDownRight />
                                                    <span className="ml-2 hover:text-blue-400">{object?.commentChildCount} phản hồi</span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }
                                {childComments[object.id]?.map((childComment) => (
                                    <div key={childComment.id} className="pl-8 mt-2 flex items-start">
                                        {renderComment(childComment)}
                                        {replyCommentId === childComment.id && (
                                            <TicketCommentFormV2 key={childComment.id} replyCommentId={replyCommentId} ticketId={ticketId} onReloadForm={handleSendComment} />
                                        )}
                                    </div>
                                ))}
                            </div>
                            {replyCommentId === object.id && (
                                <TicketCommentFormV2 key={object.id} replyCommentId={replyCommentId} ticketId={ticketId} onReloadForm={handleSendComment} />
                            )}
                        </div>
                    );
                })
            ) : (
                <div className="text-slate-500">Không có bình luận</div>
            )}
            <ImportMessagegPopup selectUserId={userId} />
        </div>
    );
}

export default TicketComment;
