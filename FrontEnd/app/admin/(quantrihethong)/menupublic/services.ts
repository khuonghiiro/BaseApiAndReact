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
      data,
      error,
      isLoading,
      mutate,
    };
  };
  GetParent = () => {
    const { data, isLoading } = useCustomSWR<any>('api/menupublic', () => api.get('api/menupublic'));
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

  GetMenuCha = () => {
    const { data } = useCustomSWR<any>('api/menupublic/selectmenu', () => api.get('api/menupublic/selectmenu'));
    return {
      data: data?.data.map((item: any) => {
        return {
          value: item.id,
          label: item.title,
        };
      })
    };
  };

  GetMenuPublic = () => {
    const { data } = useCustomSWR<any>('api/menupublic/selectmenu/public', () => api.get('api/menupublic/selectmenu/public'));
    return {
      data
    };
  };

}
const menuPublicServices = new services("api/menupublic");
export { menuPublicServices };
