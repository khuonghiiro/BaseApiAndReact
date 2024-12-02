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
  GetById = (id: any) => {
    const { data, error, isLoading, mutate } = useCustomSWR<any>(id ? `${this.url}${id}` : null, () => api.get(`${this.url}/${id}`));
    return {
      data: {
        ...data, attachment: data?.attachment ? JSON.parse(data?.attachment) : [],
      },
      error,
      isLoading,
      mutate,
    };
  };
  create = async (data: any) => {
    if (data.attachment && data.attachment.length > 0) {
      const resUrlImg = await this.uploadListImage({
        files: data.attachment,
      });
      data.attachment = JSON.stringify(resUrlImg);
    } else {
      data.attachment = "[]";
    }
    const res: any = await api.post(this.url, data);
    return res;
  };

  deleteEdge = async (id: any) => {
    const res = await api.post(`api/tourguidenode/del-egde/${id}`);
    return res;
  }

  update = async (id: any, data: any) => {
    if (data.attachment && data.attachment.length > 0) {
      if (data.attachment.filter((el: any) => !el.id).length > 0) {
        const resUrlImg = await this.uploadListImage({
          files: data.attachment.filter((el: any) => !el.id),
        });
        data.attachment = [
          ...data.attachment.filter((el: any) => el.id && el.id > 0),
          ...resUrlImg,
        ];
      }
      data.attachment = JSON.stringify(data.attachment);
    } else {
      data.attachment = "[]";
    }
    const res: any = await api.put(`${this.url}/${id}`, data);
    return res;
  };
}
const tourGuideNodeServices = new services("api/tourguidenode");
export { tourGuideNodeServices };
