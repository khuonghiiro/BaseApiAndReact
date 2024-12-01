import useSWR from "swr";
import { BaseService } from "@/shared/services";
import api from "@/shared/services/axios-custom";
import { Meta } from "@/shared/model";
class services extends BaseService {
  GetList = (meta: Meta) => {
    const { data, error, isLoading, mutate } = useSWR<any>(
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
    const { data, error, isLoading, mutate } = useSWR<any>(
      id ? `${this.url}${id}` : null,
      () => api.get(`${this.url}/${id}`)
    );
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  };

  GetAllDepartments = () => {
    const { data, isLoading } = useSWR<any>("helpdesk/api/department", () =>
      api.get("helpdesk/api/department")
    );

    return {
      data: data?.data?.map((item: any) => {
        return {
          value: item.id,
          label: item.code + " - " + item.title,
        };
      }),
      isLoading,
    };
  };

  GetAllUsers = (groupCode: string) => {
    const { data, isLoading } = useSWR<any>(
      "identity/api/users/userselect/" + groupCode,
      () => api.get("identity/api/users/userselect?groupCode=" + groupCode)
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
  GetAllUsersCustomer = (groupCode: string, date: Date) => {
    const { data, isLoading } = useSWR<any>(
      "identity/api/users/userselect/" + groupCode + date.toString(),
      () => api.get("identity/api/users/userselect?groupCode=" + groupCode)
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

  createCustomer = async (data: any) => {
    const res: any = await api.post("identity/api/users", data);
    return res;
  };
}
const projectServices = new services("helpdesk/api/project");
export { projectServices };
