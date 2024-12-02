import useSWR from "swr";
import { BaseService, useCustomSWR } from "@/shared/services";
import api from "@/shared/services/axios-custom";
import { Meta } from "@/shared/model";
import { ApiUrl } from "@/public/app-setting";
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
      data: {
        ...data,
        attachment: data?.attachment ? JSON.parse(data?.attachment) : [],
      },
      error,
      isLoading,
      mutate,
    };
  };
  create = async (data: any) => {
    if (data.attachment && data.attachment.length > 0) {
      const resUrlImg = await this.uploadListImage({
        files: data.attachment,
      });
      try {
        data.attachment = JSON.stringify(resUrlImg);
      } catch (error) {
        console.error("Error serializing object: ", resUrlImg);
        throw error;
      }

    } else {
      data.attachment = "[]";
    }
    const res: any = await api.post(this.url, data);
    return res;
  };
  update = async (id: number, data: any) => {
    if (data.attachment && data.attachment.length > 0) {
      if (data.attachment.filter((el: any) => !el.id).length > 0) {
        const resUrlImg = await this.uploadListImage({
          files: data.attachment.filter((el: any) => !el.id),
        });
        data.attachment = [
          ...data.attachment.filter((el: any) => el.id && el.id > 0),
          ...resUrlImg,
        ];
      }
      try {
        data.attachment = JSON.stringify(data.attachment);
      } catch (error) {
        console.error("Error serializing object: ", data.attachment);
        throw error;
      }

    } else {
      data.attachment = "[]";
    }
    const res: any = await api.put(`${this.url}/${id}`, data);
    return res;
  };
  GetListProject = () => {
    const { data, isLoading } = useCustomSWR<any>("helpdesk/api/project/myproject", () =>
      api.get("helpdesk/api/project/myproject")
    );
    return {
      data: data?.data.map((item: any) => {
        return {
          value: item.id,
          label: item.code + " - " + item.name,
        };
      }),
      isLoading,
    };
  };

  GetAllUsers = (strIds?: string | null) => {
    if (!strIds) {
      return {
        value: 0,
        label: '',

      };
    }

    const { data, isLoading } = useCustomSWR<any>(
      "api/users/userselect",
      () => api.get(`api/users/userselect?strIds=${strIds}`)
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

  updateTicketStatus = async (data: {
    id: number;
    status: number;
    content?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    assignedId?: number | null;
  }) => {
    const url = `${this.url}/updatestatus`;
    const res: any = await api.put(url, data);
    return res;
  };
  getAllEnum = (name: string) => {
    const { data, error, isLoading, mutate } = useCustomSWR<any>(
      `${this.url}/enum/${name}`,
      () => api.get(`${this.url}/enum/${name}`)
    );
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  };
  GetListHistory = (ticketId: number) => {
    const { data, error, isLoading, mutate } = useCustomSWR<any>(
      "helpdesk/api/tickethistory/" + ticketId,
      () => api.get(`helpdesk/api/tickethistory?ticketId=${ticketId}&page=1&itemsPerPage=-1&SortBy=Id&SortDesc=false`)
    );
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  };

  GetListTicketComment = (ticketId: any, parentCommentId?: number | null) => {

    let pcId = parentCommentId ?? -1;
    const { data, error, isLoading, mutate } = useCustomSWR<any>(
      "helpdesk/api/ticketcomment/" + ticketId,
      () => api.get(`helpdesk/api/ticketcomment?ticketId=${ticketId}&parentCommentId=${pcId}&page=1&itemsPerPage=-1&SortBy=Id&SortDesc=false`)
    );
    return {
      data,
      error,
      isLoading,
      mutate,
    };
  };

  UpdateTicketCommentEmotion = async (ticketId: any, isLike: boolean) => {

    let emot = isLike ? 1 : 0;

    const url = `helpdesk/api/ticketcomment/${ticketId}/${emot}`;
    const res: any = await api.put(url);
    return res;
  };

  GetListTicketCommentV2 = async (ticketId: any, parentCommentId?: number | null) => {
    if (parentCommentId == null || parentCommentId == 0) return [];

    const url = `helpdesk/api/ticketcomment?ticketId=${ticketId}&parentCommentId=${parentCommentId}&page=1&itemsPerPage=-1&SortBy=Id&SortDesc=false`;
    const res: any = await api.get(url);
    return res;
  };

  GetAllUserInDepartments = async (strIds?: string | null) => {
    const url = `api/users/userselect?strIds=${strIds}`;
    const res: any = await api.get(url);

    return {
      data: res?.map((item: any) => {
        return {
          value: item.id,
          label: item.fullName,
        };
      })
    };
  };

  GetTicketStatusByIdAsync = async (id: string) => {
    const res: any = await api.get(`${this.url}/${id}`);
    return res.status;
  }

  CreateTicketComment = async (data: any) => {
    if (data.fileAttach && data.fileAttach.length > 0) {
      const resUrlImg = await this.uploadListImage({
        files: data.fileAttach,
      });
      try {
        data.fileAttach = JSON.stringify(resUrlImg);
      } catch (error) {
        console.error("Error serializing object: ", resUrlImg);
        throw error;
      }

    } else {
      data.fileAttach = "[]";
    }
    const res: any = await api.post('helpdesk/api/ticketcomment', data);
    return res;
  };

  GetLinkFile = (url: string) => {
    const downloadTypeExcels = ["xls", "xlsx"];
    const downloadTypeWords = ["doc", "docx"];
    const downloadTypePdf = ["pdf"];
    // Lấy phần mở rộng file
    const fileType = url.split('.').pop()?.toLowerCase();

    if (fileType && downloadTypeExcels.includes(fileType)) {
      return "/excel.png";
    }
    else if (fileType && downloadTypeWords.includes(fileType)) {
      return "/doc.png";
    }
    else if (fileType && downloadTypePdf.includes(fileType)) {
      return "/pdf.png";
    }

    return `${ApiUrl}${url}`;
  }

}
const ticketServices = new services("helpdesk/api/ticket");
export { ticketServices };
