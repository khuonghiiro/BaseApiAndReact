import useSWR from 'swr';
import { BaseService } from '@/shared/services';
import api from '@/shared/services/axios-custom';
import { Meta } from '@/shared/model';
class services extends BaseService {

    GetMessageHasInContacts = (userId: number, page: number = 1) => {
        const { data, error, isLoading } = useSWR(`message/api/contacts?UserId=${userId}&Page=${page}&SortBy=sentAt&SortDesc=true`, () =>
            api.get(`message/api/contacts?UserId=${userId}&Page=${page}&SortBy=sentAt&SortDesc=true`)
        );

        // Kiểm tra lỗi trước để xử lý trường hợp API trả về lỗi
        if (error) return { data: [], isLoading: false, isError: true };

        // Kiểm tra và chuyển đổi data nếu có thể
        const contact = data?.data ? data.data.map((item: any) => ({
            id: item.id,
            userFirstId: item.userFirstId,
            userSecondId: item.userSecondId,
            userFirstName: item.userFirstName,
            userSecondName: item.userSecondName,
            message: item.message,
            sentAt: item.sentAt,
            messageStatus: item.messageStatus,
            lastMessageId: item.lastMessageId,
            view: item.view,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        })) : [];

        return {
            data: contact,
            isLoading: !error && !data, // isLoading true khi không có error và data chưa sẵn sàng
            isError: false
        };
    };

    async getListContacts(userId: number, page: number, limit: number = 10) {
        try {
            const response = await api.get(`message/api/contacts?UserId=${userId}&Page=${page}&SortBy=sentAt&SortDesc=true&ItemsPerPage=20`);
            const users = response.data.map((item: any) => ({
                id: item.id,
                userFirstId: item.userFirstId,
                userSecondId: item.userSecondId,
                userFirstName: item.userFirstName,
                userSecondName: item.userSecondName,
                message: item.message,
                sentAt: item.sentAt,
                messageStatus: item.messageStatus,
                lastMessageId: item.lastMessageId,
                view: item.view,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            }));
            return users;
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
            return [];
        }
    };

    async getContactAtTwoIds(userFirstId: number, userSecondId: number) {
        try {
            const response = await api.get(`message/api/contacts?UserFirstId=${userFirstId}&UserSecondId=${userSecondId}&ItemsPerPage=1`);
            if (response.data.length > 0) {
                const item = response.data[0];
                const user = {
                    id: item.id,
                    userFirstId: item.userFirstId,
                    userSecondId: item.userSecondId,
                    userFirstName: item.userFirstName,
                    userSecondName: item.userSecondName,
                    message: item.message,
                    sentAt: item.sentAt,
                    messageStatus: item.messageStatus,
                    lastMessageId: item.lastMessageId,
                    view: item.view,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                };
                return user;
            } else {
                return null; // Trả về null nếu không có dữ liệu
            }
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
            return null; // Trả về null nếu có lỗi xảy ra
        }
    };

    async getViewAtUserId(userId: number): Promise<number> {
        try {
            const viewCount = await api.get(`message/api/contacts/view/${userId}`);
            // Đảm bảo rằng viewCount là một số
            if (typeof viewCount === 'number') {
                return viewCount;
            } else {
                console.error('Invalid type for viewCount:', viewCount);
                return 0; // Trả về 0 nếu dữ liệu không phải là số
            }
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
            return 0;
        }
    };


}
const contactServices = new services("message/api/contacts");

export { contactServices };

