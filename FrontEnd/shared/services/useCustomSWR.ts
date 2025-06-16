import { toast } from 'react-toastify';
import useSWR, { SWRConfiguration, Key } from 'swr';
import api from './axios-custom';

// Cập nhật kiểu Fetcher chỉ trả về dữ liệu
type Fetcher<T> = (url: string, meta: any) => Promise<T>;

const useCustomSWR = <T>(key: Key, fetcher: Fetcher<T>, options: SWRConfiguration = {}) => {
    return useSWR<T>(key, fetcher, {
        ...options,
        onErrorRetry: async (error: any, key, config, revalidate, { retryCount }) => {
            // Kiểm tra nếu gặp lỗi 403, không retry nữa
            if (error?.response?.status === 403) {

                if (error?.response) {
                    const { status, statusText } = error.response;
                    const method = error?.config?.method || 'Unknown';
                    const url = error?.config?.url || 'Unknown URL';
                    // toast.error(`Error ${status}: ${statusText} - Method: ${method} - URL: ${url}`);

                    const params = {
                        status: status,
                        method: method,
                        url: url,
                      };
                      const res: any = await api.post("api/users/auth-check", params);
                      toast.warn(res);
                }
                
                return;
            }

            // Nếu có lỗi khác, lấy thông tin từ response (status, config...)
            // if (error?.response) {
            //     const { status, statusText } = error.response;
            //     const method = error?.config?.method || 'Unknown';
            //     const url = error?.config?.url || 'Unknown URL';
            //     toast.error(`Error ${status}: ${statusText} - Method: ${method} - URL: ${url}`);
            // }

            // Dừng retry sau 3 lần thử
            if (retryCount >= 3) return;

            // Thử lại sau 3 giây
            setTimeout(() => revalidate({ retryCount }), 3000);
        },
    });
};

export default useCustomSWR;

// khi dùng mặc định useSWR tự cấu hình thêm
// const { data, error, isLoading, mutate } = useSWR(
//     [this.url, meta],
//     () => this.getManyCus(meta),
//     {
//       revalidateOnFocus: false, // Tắt việc tự động tải lại khi chuyển lại tab
//       retry: 2, // Chỉ thử lại tối đa 2 lần
//       retryOnError: false, // Không tự động thử lại khi có lỗi
//     }
//   );
