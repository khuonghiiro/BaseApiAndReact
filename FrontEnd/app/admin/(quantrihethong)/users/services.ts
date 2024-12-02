import useSWR from 'swr';
import { BaseService, useCustomSWR } from '@/shared/services';
import api from '@/shared/services/axios-custom';
import { Meta } from '@/shared/model';
class services extends BaseService {
  GetList = (meta: Meta) => {
    const { data, error, isLoading, mutate } = useCustomSWR<any>([this.url, meta], () => this.getManyCus(meta));
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  };
  GetAllGroups = () => {
    const { data, isLoading } = useCustomSWR<any>('api/groups', () => api.get('api/groups'));
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

  GetAllGroupsSelectValueCode = () => {
    const { data, isLoading } = useCustomSWR<any>('api/groups', () => api.get('api/groups'));
    return {
      data: data?.data.map((item: any) => {
        return {
          value: item.code,
          label: item.title,
        };
      }),
      isLoading,
    };
  };

  async getListUsers(excludeId: number, page: number, limit: number = 10) {
    try {
      const response = await api.get(`api/users/lists?ExcludeId=${excludeId}&page=${page}&SortBy=fullName&SortDesc=false&ItemsPerPage=20`);
      const users = response.data.map((item: any) => ({
        idTaiKhoan: item.id,
        fullName: item.fullName,
      }));
      return users;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return [];
    }
  };

  GetAllUsers = (excludeId: number, page: number, limit: number = 10) => {
    const { data, error, isLoading } = useCustomSWR<any>(`api/users/lists?ExcludeId=${excludeId}&page=${page}&SortBy=fullName&SortDesc=false`, () =>
      api.get(`api/users/lists?ExcludeId=${excludeId}&page=${page}&SortBy=fullName&SortDesc=false`)
    );
  
    // Kiểm tra lỗi trước để xử lý trường hợp API trả về lỗi
    if (error) return { data: [], isLoading: false, isError: true };
  
    // Kiểm tra và chuyển đổi data nếu có thể
    const users = data?.data ? data.data.map((item: any) => ({
      idTaiKhoan: item.id,
      fullName: item.fullName,
    })) : [];
  
    return {
      data: users,
      isLoading: !error && !data, // isLoading true khi không có error và data chưa sẵn sàng
      isError: false
    };
  };

  GetUserById = (id: number) => {
    const { data, error, isLoading, mutate } = useCustomSWR<any>(id ? `${this.url}${id}` : null, () => api.get(`${this.url}/${id}`));
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  };
  GetTreeMenu = () => {
    const { data, error, isLoading, mutate } = useCustomSWR<any>('api/menumanager/treemenu', () => api.get('api/menumanager/treemenu'), { revalidateOnFocus: false });
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  };
  ActiveUser = async (id: string) => {
    const res = await api.put(`api/users/active/${id}`);
    return res;
  };

  DeactiveUser = async (id: string) => {
    const res = await api.put(`api/users/deactive/${id}`);
    return res;
  };
  ResetPassword = async (data: any) => {
    const res = await api.put('api/users/resetpass', data);
    return res;
  };
  ChangePassword = async (data: any) => {
    const res = await api.put('api/users/password', data);
    return res;
  };

  AddUserToGroup = async (idUser: any, idGroup: any) => {
    const res = api.post('api/groupuser', { groupId: idGroup, userId: idUser });
    return res;
  };
  RemoveUserToGroup = async (idUser: any, idGroup: any) => {
    const res = api.put(`api/groupuser/remove`, { groupId: idGroup, userId: idUser });
    return res;
  };
  // GetDonVi = () => { 
  //   const { data, isLoading } = useCustomSWR<any>('api/donvinoibo/treeselect', () => api.get('api/donvinoibo/treeselect'));
  //   if (data && data.data) {
  //     let arr = data.data;
  //     this.addValueToTree(arr, 1);
  //     return {
  //       data: arr,
  //       isLoading,
  //     };
  //   }
  //   else {
  //     return {
  //       data: [],
  //       isLoading,
  //     };
  //   }
  // };
  addValueToTree(tree: any, type: number = 1) {
    for (const node of tree) {
      node.value = type == 1 ? node.id : node.maDV; // Thêm thuộc tính Value với giá trị từ Id
      node.title = node.maDV + "-" + node.tenDV;
      if (node.children.length > 0) {
        this.addValueToTree(node.children, type); // Đệ quy cho các node con
      }
    }
  }

  checkTrung = async (email: any, id: any) => {
    id = id ? id : 0;
    return api.get('api/users?page=1&itemsPerPage=1&sortDesc=false&Email=' + email + "&neqId=" + id);
  }

  getManyCus = async (meta: any) => {
    let sortBy = "";
    let sortDesc = false;
    let title = meta.search;
    let unincludeGroupId = meta.unincludeGroupId;
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
      UnincludeGroupId: unincludeGroupId,
      ...filter,
    };
    const res: any = await api.get(this.url, { params: params });
    return res;
  };

}
const userServices = new services("api/users");

export { userServices };

