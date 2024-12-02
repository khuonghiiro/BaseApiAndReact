import useSWR from 'swr';
import { BaseService, useCustomSWR } from '@/shared/services';
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
}
const logsServices = new services("api/logs");

export { logsServices };

