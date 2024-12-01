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
  GetMenuById = (id: any) => {
    const { data, error, isLoading, mutate } = useSWR(id ? `${this.url}${id}` : null, () => api.get(`${this.url}/${id}`));
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  };
  GetMenuCha = () => {
    const { data } = useSWR<any>('identity/api/menumanager/selectmenu', () => api.get('identity/api/menumanager/selectmenu'));
   
    return {
      data: data?data?.data?.map((item: any) => {
        return {
          value: item.id,
          label: item.title,
        };
      }):[]
    };
  };
  GetAllGroups = () => {
    const { data, isLoading } = useSWR('identity/api/groups', () => api.get('identity/api/groups'));
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
const menuManagerServices = new services("identity/api/menumanager");

export { menuManagerServices };

