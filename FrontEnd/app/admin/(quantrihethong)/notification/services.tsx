import useSWR from 'swr';
import { BaseService } from '@/shared/services';
import api from '@/shared/services/axios-custom';
class services extends BaseService {

    async getListnotifications(userId: number, page: number, limit: number = 10) {
        try {
            // Đã sửa số lượng mục trên mỗi trang từ 20 thành biến limit cho phù hợp với đầu vào
            const response = await api.get(`message/api/user-notifications?UserId=${userId}&Page=${page}&SortBy=createdAt&ItemsPerPage=${limit}`);
            const notify = response.data.map((item: any) => ({
                userId: item.receiverId,
                id: item.id,
                notificationType: item.notificationType,
                title: item.title,
                message: item.message,
                createdAt: item.createdAt,
                type: item.notificationType,
                isRead: item.isRead,
                readAt: item.readAt,
                paramater: item.paramater,
                keyRouter: item.keyRouter
            }));
            return notify;
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            return [];
        }
    };


    async getViewAtUserId(userId: number): Promise<number> {
        try {
            const viewCount = await api.get(`message/api/user-notifications/unwatched-count/${userId}`);
            // Đảm bảo rằng viewCount là một số
            if (typeof viewCount === 'number') {
                return viewCount;
            } else {
                console.error('Invalid type for viewCount:', viewCount);
                return 0; // Trả về 0 nếu dữ liệu không phải là số
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            return 0;
        }
    };

    updateIsReadOfNotification = async (notificationId: any,) => {
        const res = await api.post(`message/api/user-notifications/update-status/${notificationId}`);
        return res;
    };

    // updateIsReadOfNotificationTypeAll = async (notificationId: any,) => {
    //     const res = await api.post(`message/api/user-notifications/update-type-all/${notificationId}`);
    //     return res;
    // };

}
const notificationServices = new services("message/api/user-notifications");

export { notificationServices };

