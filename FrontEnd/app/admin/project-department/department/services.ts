import useSWR from "swr";
import { BaseService, useCustomSWR } from "@/shared/services";
import api from "@/shared/services/axios-custom";
import { Meta } from "@/shared/model";
class services extends BaseService {
  GetList = (meta: Meta) => {
    const { data, error, isLoading, mutate } = useCustomSWR<any>(
      [this.url, meta],
      () => this.getMany(meta)
    );
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  };
  GetById = (id: number) => {
    const { data, error, isLoading, mutate } = useCustomSWR<any>(
      id ? `${this.url}${id}` : null,
      () => api.get(`${this.url}/${id}`)
    );
    return {
      data: { ...data, avatar: data?.avatar ? JSON.parse(data?.avatar) : [] },
      error,
      isLoading,
      mutate,
    };
  };
  create = async (data: any) => {
    if (data.avatar && data.avatar.length > 0) {
      const resUrlImg = await this.uploadListImage({
        files: data.avatar,
      });
      try {
        data.avatar = JSON.stringify(resUrlImg);
      } catch (error) {
        console.error("Error serializing object: ", resUrlImg);
        throw error;
      }

    } else {
      data.avatar = "[]";
    }
    const res: any = await api.post(this.url, data);
    return res;
  };
  update = async (id: number, data: any) => {
    if (data.avatar && data.avatar.length > 0) {

      try {
        if (data.avatar.filter((el: any) => !el.id).length > 0) {
          const resUrlImg = await this.uploadListImage({
            files: data.avatar.filter((el: any) => !el.id),
          });
          data.avatar = JSON.stringify(resUrlImg);
        } else {
          data.avatar = JSON.stringify(data.avatar);
        }
      } catch (error) {
        console.error("Error serializing object: resUrlImg or avatar");
        throw error;
      }

    } else {
      data.avatar = "[]";
    }
    const res: any = await api.put(`${this.url}/${id}`, data);
    return res;
  };

  GetAllUsers = () => {
    const { data, isLoading } = useCustomSWR<any>(
      "api/users/userselect",
      () => api.get("api/users/userselect")
    );
    return {
      data: data?.map((item: any) => {
        return {
          value: item.id,
          label: item.fullName,
        };
      }),
      isLoading,
    };
  };
}
const departmentServices = new services("helpdesk/api/department");
export { departmentServices };
