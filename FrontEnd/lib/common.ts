import { object } from 'yup';
import { toast } from "react-toastify";
import { AuthService } from "@/shared/services";
import { Meta } from "@/shared/model";
import { confirm } from "@/shared/components/confirm";
import { PERM } from "@/public/app-setting";
import { useAuth } from '@/shared/Context/appAdminContext';
const { getOauth } = AuthService();
export function formatDateTime(strValue: string) {
  if (!strValue) {
    return "";
  } else {
    var d = new Date(strValue);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output =
      (day >= 10 ? "" : "0") +
      day +
      "/" +
      (("" + month).length < 2 ? "0" : "") +
      month +
      "/" +
      d.getFullYear();
    if (output === "01/01/1") return "";
    return output;
  }
}
export function formatDateTimeMDY(strValue: string) {
  if (strValue === null || strValue === "") {
    return "";
  } else {
    var d = new Date(strValue);
    var month = d.getMonth() + 1;
    var day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
    var output =
      (("" + month).length < 2 ? "0" : "") +
      month +
      "/" +
      day +
      "/" +
      d.getFullYear();
    if (output === "1/01/1") return "";
    return output;
  }
}

export function formatFullDateTime(strValue: string) {
  if (strValue === undefined || strValue === "" || strValue === null) {
    return "";
  } else {
    let output = "";
    let d = new Date(strValue);
    let month: any =
      d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
    let day: any = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
    let hour: any = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
    let minute: any =
      d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
    output =
      day +
      "/" +
      (("" + month).length < 2 ? "0" : "") +
      month +
      "/" +
      d.getFullYear();
    if (hour > 0) {
      output = output + " " + hour + ":" + minute;
    }
    if (output === "1/01/1") return "";
    return output;
  }
}
//ChageFormat datetime yyyy-mm-dd phục vụ tìm kiếm mở rộng
export function changeFormatDateTime(strValue: any) {
  if (strValue === null) {
    return "";
  } else {
    var d = new Date(strValue);
    var month = d.getMonth() + 1;
    var day = d.getDate();

    var output =
      d.getFullYear() +
      "-" +
      (("" + month).length < 2 ? "0" : "") +
      month +
      "-" +
      (("" + day).length < 2 ? "0" : "") +
      day;
    return output;
  }
}
export function formartPriceVND(strNumber: string) {
  return strNumber
    ? strNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    : strNumber;
}
export function formatCurrentcy(strNumber: any) {
  return new Intl.NumberFormat('vi-VN').format(strNumber);
}
export function getStringByArray(arr: string[]) {
  var str = "";
  if (!arr) {
    return "";
  } else {
    for (var i = 0; i < arr.length; i++) {
      if (i === 0) {
        str += arr[i];
      } else {
        str += ", " + arr[i];
      }
    }
    return str;
  }
}

export function lowerCaseStartChar(str: string) {
  if (str) return str[0].toLowerCase() + str.substring(1);
}
export const ACTION_TYPES = {
  ADD: "add",
  EDIT: "edit",
  READ: "read",
  CLOSE: "close",
};
export const getPermisson = (object: string) => {
  var oauth = getOauth() || {};
  var per_Add = checkPermisson(object, PERM.ADD);
  var per_Edit = checkPermisson(object, PERM.EDIT);
  var per_View = checkPermisson(object, PERM.VIEW);
  var per_Delete = checkPermisson(object, PERM.DELETE);
  var per_Approve = checkPermisson(object, PERM.APROVE);
  var config_Approve = oauth.isApprove == '1' ? true : false;
  return {
    per_Add,
    per_Edit,
    per_View,
    per_Delete,
    per_Approve,
    config_Approve,
  }
}
export const INITIAL_STATE_LIST = {
  show: false,
  action: "add",
  Id: 0,
};
export const listReducer = (state: any, action: any) => {
  switch (action.type) {
    case "edit":
      return {
        ...state,
        show: true,
        action: "edit",
        Id: action.Id,
      };
    case "add":
      return {
        ...state,
        show: true,
        action: "add",
        Id: action.Id,
      };
    case "read":
      return {
        ...state,
        show: true,
        action: "read",
        Id: action.Id,
      };
    case "close":
      return {
        ...state,
        show: false,
      };
  }
};
export const INITIAL_STATE_FORM = {
  editMode: false,
  viewMode: false,
};
export const formReducer = (state: any, action: any) => {
  switch (action.type) {
    case "edit":
      return {
        editMode: true,
        viewMode: false,
      };
    case "add":
      return {
        editMode: false,
        viewMode: false,
      };
    case "read":
      return {
        editMode: false,
        viewMode: true,
      };
  }
};
export const computedTitle = (id: any, editMode: any, title: string = '') => {
  if (id) {
    if (editMode) {
      return "Chỉnh sửa thông tin " + title;
    }
    return "Chi tiết " + title;
  }
  return "Thêm mới " + title;
};
export function handleChangeAction(res: any, actions: any, setSelectedItems?: any) {
  const { meta } = actions;
  let newMeta: Meta = {};
  newMeta = Object.assign({}, meta, res.data);
  switch (res.event) {
    case "changeSelected":
      if (setSelectedItems) {
        setSelectedItems(Object.keys(res.data.selected));
      }
      break;
    case "changeSort":
      if (newMeta.sort != meta.sort) {
        meta.sort = newMeta.sort;
      }
      return newMeta;
    case "changeKeySearch":
      newMeta.page = 1;
      meta.search = newMeta.search;
      return newMeta;
    case "changePage":
      if (meta.page !== newMeta.page) {
        meta.page = newMeta.page;
      }
      return newMeta;
    case "changePageSize":
      if (newMeta.page_size != meta.page_size) {
        meta.page_size = newMeta.page_size;
      }
      return newMeta;
    case "changeFilter":
      newMeta.page = 1;
      meta.filter = newMeta.filter;
      return newMeta;
    case "cancelExtendSearch":
      newMeta.filter = {};
      meta.filter = newMeta.filter;
      return newMeta;
    case "resetColumn":
      newMeta.filter = {};
      meta.filter = newMeta.filter;
      return newMeta;
    case "filterChange":
      let filterList = [];
      if (meta.filter.filterList)
        filterList = meta.filter.filterList;

      filterList.push(res.data);

      meta.filter.filterList = filterList;
      newMeta.filter = filterList;
      return newMeta;
  }
}
export const onClose = async (
  isRefresh: boolean,
  dispatch: any,
  mutate: any
) => {
  dispatch({ type: ACTION_TYPES.CLOSE });
  if (isRefresh) {
    await mutate();
  }
};
export const delAction = async (
  item: any,
  service: any,
  data: any,
  setMeta: any,
  meta: any,
  mutate: any,
) => {
  confirm("Bạn có chắc chắn muốn xóa?", async () => {
    try {
      debugger;
      if (item.id == undefined) {
        await service.del(item.identityClientId);
      } else {
        await service.del(item.id);
      }
      toast.success("Xóa thành công");
      if (data?.data.length === 1 && data.currentPage !== 1) {
        setMeta({
          ...meta,
          page: data?.currentPage - 1,
        });
      } else await mutate();
    } catch (err) {
      toast.error("Xóa thất bại");
    }
  });
};
export function onKeyPressForm(ev: any) {
  const keyCode = ev.keyCode || ev.which;
  if (
    keyCode === 13 &&
    "text,number,select,checkbox".includes(ev.target.type)
  ) {
    ev.preventDefault();
    return false;
  }
}
/**
 * Check quyền người dùng
 * @param {any} strObjectPer: mã đối tượng
 * @param {any} strPrivilege: mã quyền
 */
export function checkPermisson(strObjectPer: any, strPrivilege: any) {
  var oauth = getOauth() || {};
  if (oauth.isAdministrator) {
    return true;
  }
  if (oauth.lstRoles && oauth.lstRoles.length > 0 && oauth.lstRoles.includes(strObjectPer + "-" + strPrivilege)) {
    return true;
  }
  return false;
}
export const flattenTree = (data: any, map: any = new Map()) => {
  data.forEach((item: any) => {
    map.set(item.value, item);
    if (item.children && item.children.length > 0) {
      flattenTree(item.children, map);
    }
  });
  return { data, map };
};

export const setValue = (value: any, map: any, mode: any, checked: any) => {
  if (["radioSelect", "simpleSelect"].includes(mode!)) {
    let item = map.get(value);
    if (item) {
      item.checked = checked;
    }
  } else {
    (value || []).forEach((key: any) => {
      let item = map.get(key);
      if (item) {
        item.checked = checked;
        item.expanded = checked;
      }
    });
  }
};
