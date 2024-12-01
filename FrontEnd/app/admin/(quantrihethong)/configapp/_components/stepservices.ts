import useSWR from 'swr';
import { BaseService } from '@/shared/services';
import api from '@/shared/services/axios-custom';
import { Meta } from '@/shared/model';
class services extends BaseService {
  GetList = (meta: Meta) => {
    const { data, error, isLoading, mutate } = useSWR<any>([this.url, meta], () => this.getMany(meta));
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  };
  GetById = (id: number) => {
    const { data, error, isLoading, mutate } = useSWR<any>(id ? `${this.url}${id}` : null, () => api.get(`${this.url}/${id}`));
    if(data)
    {
      data.fieldData=JSON.parse(data.fieldDynamic);
    }
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  }; 
  getAllEnum = (name:string) => {
    const { data, error, isLoading, mutate } = useSWR<any>(`${this.url}/enum/${name}`, () => api.get(`${this.url}/enum/${name}`));
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  }; 
  getAllStepByAppId = (appId:number, id:number) => {
    const { data, error, isLoading, mutate } = useSWR<any>(`${this.url}/${appId}`, () => api.get(`${this.url}?appId=${appId}&page=1&itemPerPages=-1`));
   
    return {
      data: data?.data.filter((x: { id: number; })=>x.id!=id).map((item: any) => {
        return {
          value: item.id,
          label: item.stt+"."+item.eventName,
        };
      }),
      isLoading,
    };
  }; 
}
const configStepServices = new services("crawl/api/configstep");
export { configStepServices };
