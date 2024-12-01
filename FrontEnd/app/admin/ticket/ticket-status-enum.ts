export enum TicketStatusEnum {
  ChuaGui = 1,

  DaGuiVaChuaXuLy,

  DangXuLy,

  HoanThanh,

  ChoTiepNhanLai
}

export enum EActionTicketHistory {
  // [Description("Tạo mới")]
  TaoMoi = 1,
  // [Description("Chỉnh sửa")]
  ChinhSua,
  // [Description("Gửi yêu cầu")]
  GuiYeuCau,
  // [Description("Tiếp nhận yêu cầu")]
  TiepNhan,
  // [Description("Xác nhận đã giải quyết")]
  XacNhanGiaiQuyet,
  // [Description("Đóng")]
  Dong,
  // [Description("Mở lại")]
  MoLai,
  // [Description("Từ chối xử lý")]
  TuChoi,
  //[Description("Tạo mới và gửi yêu cầu")]
  TaoMoi_Gui,
  //[Description("Chỉnh sửa và gửi yêu cầu")]
  ChinhSua_Gui,
}

export enum EPriorityTicket {
  //[Description("Hightest")]
  Hightest = 1,
  //[Description("Hight")]
  Hight,
  //[Description("Medium")]
  Medium,
  //[Description("Low")]
  Low,
  //[Description("Lowest")]
  Lowest,
}
