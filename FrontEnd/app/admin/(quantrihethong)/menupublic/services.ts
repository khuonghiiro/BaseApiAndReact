import useSWR from 'swr';
import { BaseService } from '@/shared/services';
import api from '@/shared/services/axios-custom';
import { Meta } from '@/shared/model';
class services extends BaseService {
  GetList = (meta: Meta) => {
    const { data, error, isLoading, mutate } = useSWR([this.url, meta], () => this.getMany(meta));
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  };
  GetById = (id: number) => {
    const { data, error, isLoading, mutate } = useSWR(id ? `${this.url}${id}` : null, () => api.get(`${this.url}/${id}`));
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  };
  GetParent = () => {
    const { data, isLoading } = useSWR('api/menupublic', () => api.get('api/menupublic'));
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
    const { data } = useSWR('api/menupublic/selectmenu', () => api.get('api/menupublic/selectmenu'));
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
    const { data } = useSWR('api/menupublic/selectmenu/public', () => api.get('api/menupublic/selectmenu/public'));
    return {
      data
    };
  };

}
const menuPublicServices = new services("api/menupublic");
export { menuPublicServices };
