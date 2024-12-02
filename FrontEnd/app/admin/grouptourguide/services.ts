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

  GetListSteps = async (meta: Meta) => {
    const res: any = api.get('api/grouptourguide/steps', { params: meta });
    return res;
  };

  GetById = (id: number) => {
    const { data, error, isLoading, mutate } = useCustomSWR<any>(id ? `${this.url}${id}` : null, () => api.get(`${this.url}/${id}`));
    return {
      data ,
      error,
      isLoading,
      mutate,
    };
  }; 
}
const groupTourGuideServices = new services("api/grouptourguide");
export { groupTourGuideServices };
