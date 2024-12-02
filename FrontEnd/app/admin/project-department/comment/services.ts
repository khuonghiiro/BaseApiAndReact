import useSWR from 'swr';
import { BaseService, useCustomSWR } from '@/shared/services';
import api from '@/shared/services/axios-custom';
import { Meta } from '@/shared/model';
class services extends BaseService {
  GetList = (meta: Meta) => {
    const { data, error, isLoading, mutate } = useCustomSWR<any>([this.url, meta], () => this.getMany(meta));
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  };
  GetById = (id: number) => {
    const { data, error, isLoading, mutate } = useCustomSWR<any>(id ? `${this.url}${id}` : null, () => api.get(`${this.url}/${id}`));
    return {
      data: {
        ...data, files: data?.files ? JSON.parse(data?.files) : [],
      },
      error,
      isLoading,
      mutate,
    };
  };
  create = async (data: any) => {
    if (data.files && data.files.length > 0) {
      const resUrlImg = await this.uploadListImage({
        files: data.files,
      });
      try {
        data.files = JSON.stringify(resUrlImg);
      } catch (error) {
        console.error("Error serializing object: ", resUrlImg);
        throw error;
      }

    } else {
      data.files = "[]";
    }
    const res: any = await api.post(this.url, data);
    return res;
  };
  update = async (id: number, data: any) => {
    if (data.files && data.files.length > 0) {
      if (data.files.filter((el: any) => !el.id).length > 0) {
        const resUrlImg = await this.uploadListImage({
          files: data.files.filter((el: any) => !el.id),
        });
        data.files = [
          ...data.files.filter((el: any) => el.id && el.id > 0),
          ...resUrlImg,
        ];
      }
      try {
        data.files = JSON.stringify(data.files);
      } catch (error) {
        console.error("Error serializing object: ", data.files);
        throw error;
      }

    } else {
      data.files = "[]";
    }
    const res: any = await api.put(`${this.url}/${id}`, data);
    return res;
  };
  GetTicket = () => {
    const { data, isLoading } = useCustomSWR<any>('api/ticket', () => api.get('api/ticket'));
    return {
      data: data?.data.map((item: any) => {
        return {
          value: item.id,
          label: item.title,
        };
      }),
      isLoading,
    };
  };
}
const commentServices = new services("helpdesk/api/comment");
export { commentServices };
