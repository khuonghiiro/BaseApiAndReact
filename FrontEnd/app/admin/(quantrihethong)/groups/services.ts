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
  GetListRoles = (meta: Meta) => {
    let sortBy = "";
    let sortDesc = false;
    let title = meta.search;
    const { page, page_size, sort, filter } = meta;

    if (meta.sort) {
      sortBy = Object.keys(meta.sort)[0];
      sortDesc = sort[sortBy] === "desc";
    }
    const params = {
      page: page,
      itemsPerPage: page_size,
      sortBy: sortBy,
      sortDesc: sortDesc,
      FilterText: title,
      ...filter,
    };
    const { data, error, isLoading, mutate } = useSWR(['api/roles/listper', meta], () => api.get('api/roles/listper', { params: params }));
    return {
      data,
      error,
      isLoading,
      mutate,
    };

  };

  updateGRP = async (data: any) => {
    const res: any = await api.put('api/roles/updategrp', data);
    return res;
  };

  GetTreeCategory = (id: number) => {
    const { data, isLoading } = useSWR(id ? `${'api/rolecategory/tree'}${id}` : null, () => api.get('api/rolecategory/tree'));
    if (data) {
      return {
        data: data,
        isLoading,
      };
    }
    else {
      return {
        data: [],
        isLoading,
      };
    }
  };
  GetPer = (groupid: number, roleid:number) => {
    const { data, isLoading } = useSWR((groupid&&roleid) ? `api/grouprolepermission/getper/${groupid}/${roleid}` : null, () => api.get(`api/grouprolepermission/getper/${groupid}/${roleid}`));
    return {
      data: data,
      isLoading,
    };    
  };


}
const groupsServices = new services("api/groups");
export { groupsServices };
