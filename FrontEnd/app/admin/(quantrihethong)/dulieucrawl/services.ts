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
  GetById = (id: any) => {
    const { data, error, isLoading, mutate } = useSWR<any>(id ? `${this.url}${id}` : null, () => api.get(`${this.url}/${id}`));
  
    return {
      data:{ ...data, listDataFields: data?.listFields?JSON.parse(data?.listFields):[] },
      error,
      isLoading,
      mutate,
    };
  };

  GetAllBangCauHinh = () => {
    const { data, isLoading } = useSWR('crawl/api/bangcauhinh', () => api.get('crawl/api/bangcauhinh?page=1&itemPerPage=-1'));
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
const duLieuCrawlServices = new services("crawl/api/dulieucrawl");

export { duLieuCrawlServices };

