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

  GetListSteps = async (meta: Meta) => {
    const res: any = api.get('identity/api/grouptourguide/steps', { params: meta });
    return res;
  };

  GetById = (id: number) => {
    const { data, error, isLoading, mutate } = useSWR<any>(id ? `${this.url}${id}` : null, () => api.get(`${this.url}/${id}`));
    return {
      data ,
      error,
      isLoading,
      mutate,
    };
  }; 
}
const groupTourGuideServices = new services("identity/api/grouptourguide");
export { groupTourGuideServices };
