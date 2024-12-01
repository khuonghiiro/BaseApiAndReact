import useSWR from "swr";
import { BaseService } from "@/shared/services";
import api from "@/shared/services/axios-custom";
import { Meta } from "@/shared/model";
class services extends BaseService {
  GetList = (meta: Meta) => {
    const { data, error, isLoading, mutate } = useSWR([this.url, meta], () =>
      this.getMany(meta)
    );
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  };
  GetById = (id: number) => {
    const { data, error, isLoading, mutate } = useSWR(
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
  GetParent = () => {
    const { data, isLoading } = useSWR("api/rolecategory", () =>
      api.get("api/rolecategory")
    );
    return {
      data: data?.data.map((item: any) => {
        return {
          value: item.id,
          label: item.tieuDe,
        };
      }),
      isLoading,
    };
  };
}
const roleCategoryServices = new services("api/rolecategory");
export { roleCategoryServices };
