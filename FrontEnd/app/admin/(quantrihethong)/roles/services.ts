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

  GetDanhMuc = () => {
    const { data, isLoading } = useSWR("api/rolecategory/tree", () =>
      api.get("api/rolecategory/tree")
    );
    if (data) {
      let arr = data;
      this.addValueToTree(arr);
      return {
        data: arr,
        isLoading,
      };
    } else {
      return {
        data: [],
        isLoading,
      };
    }
  };
  addValueToTree(tree: any) {
    tree = tree.filter((x: any) => !x.isRole);
    if (tree && tree.length > 0) {
      for (const node of tree) {
        node.value = node.id; // Thêm thuộc tính Value với giá trị từ Id
        node.title = node.title;
        let childs = node.children.filter((y: any) => !y.isRole);
        if (node.children.length > 0 && childs.length > 0) {
          node.children = childs;
          this.addValueToTree(childs); // Đệ quy cho các node con
        } else {
          node.children = [];
        }
      }
    }
  }
}
const rolesServices = new services("api/roles");
export { rolesServices };
