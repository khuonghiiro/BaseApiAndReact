//cấu hình mặc đinh phân trang của grid
export const defaultGrid = {
  page: 1,
  page_size: 14,
  total: 0,
  pageSizeOptions: [15, 30, 50, 100],
};
//Cấu hình mặc định dữ liệu data get
export const DefaultMeta = {
  page: 1,
  page_size: 15,
  sort: { id: "asc" },
  search: "",
  filter: {},
  total: 0,
};
export const DefaulPer = {
  per_Add: false,
  per_Edit: false,
  per_View: false,
  per_Delete: false,
  per_Approve: false,
};
export const PERM = {
  ADD: "01",
  EDIT: "02",
  DELETE: "03",
  APROVE: "04",
  VIEW: "05",
};

export const UpFileErr = 0 //0 - not allow upload file, 1 - allow upload file
export const ApiHostUrl = process.env.NEXT_PUBLIC_API_HOST_ENDPOINT;
export const ApiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
export const WebSocketUrl = process.env.NEXT_PUBLIC_WS_ENDPOINT;
// export const ApiUrl = "http://10.0.1.31:2001/";
export const URL_GEOSERVER = "http://10.0.0.33:8080/geoserver/CSDLVP";
export const NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V2 = "6LfykAApAAAAAGi2XMxTk-BGZzmYrtr-wXYmfDGw";
export const RECAPTCHA_SECRET_KEY_V2 = "6LfykAApAAAAAKAHKzAhzmwmlLVXVQ4q-MeRxAas";
