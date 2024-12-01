import useSWR, { mutate } from 'swr';
import { BaseService } from '@/shared/services';
import api from '@/shared/services/axios-custom';
import { ChatUser, Meta } from '@/shared/model';
class services extends BaseService {

  GetListMessages = (sendId: number, receiverId: number, page: number) => {
    const { data, error, isLoading } = useSWR(`${this.url}?SenderId=${sendId}&ReceiverId=${receiverId}&SortBy=sentAt&SortDesc=true&Page=${page}`, () =>
      api.get(`${this.url}?SenderId=${sendId}&ReceiverId=${receiverId}&SortBy=sentAt&SortDesc=true&Page=${page}`)
    );

    // Kiểm tra lỗi trước để xử lý trường hợp API trả về lỗi
    if (error) return { data: [], isLoading: false, isError: true };

    // Kiểm tra và chuyển đổi data nếu có thể
    const users = data?.data ? data.data.map((item: any) => ({
      id: item.id,
      senderId: item.senderId,
      receiverId: item.receiverId,
      message: item.message,
      sentAt: new Date(item.sentAt),
      isOwn: item.senderId == sendId ? true : false,
      messageStatus: item.messageStatus // 0: đã gửi, 1: đã nhận, 2: đã xem
    })) : [];

    return {
      data: users,
      error,
      isLoading,
    };

  };

  async GetListMessageAtId(sendId: number, receiverId: number, page: number): Promise<ChatUser[]> {
    try {
      const response = await api.get(`${this.url}?SenderId=${sendId}&ReceiverId=${receiverId}&SortBy=sentAt&SortDesc=true&Page=${page}`);
      const users = response.data.map((item: any): ChatUser => ({
        id: item.id,
        senderId: item.senderId,
        receiverId: item.receiverId,
        message: item.message,
        sentAt: new Date(item.sentAt),
        isOwn: item.senderId == sendId,
        messageStatus: item.messageStatus
      }));
      return users;
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      return [];
    }
  }
  

}
const chatUserServices = new services("message/api/chat-users");

export { chatUserServices };

