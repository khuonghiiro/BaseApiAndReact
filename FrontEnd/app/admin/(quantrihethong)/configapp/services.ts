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
  getAllEnum = (name:string) => {
    const { data, error, isLoading, mutate } = useCustomSWR<any>(`${this.url}/enum/${name}`, () => api.get(`${this.url}/enum/${name}`));
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  }; 
}
const configAppServices = new services("crawl/api/configapp");
export { configAppServices };
