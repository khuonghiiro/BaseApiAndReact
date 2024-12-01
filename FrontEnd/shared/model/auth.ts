export interface Login {
  grant_type: string;
  username: string;
  password: string;
}
export interface User {
  access_token: string;
  expires: string;
  refresh_token: string;
  fullName: string;
  username: string;
  unitId: string;
  UnitCode: string;
  idTaiKhoan: number;
  anhdaidien: string;
  isAdministrator: boolean;
  lstRoles: string[];
}

export interface ChatUser {
  id: any;
  senderId?: number;
  receiverId?: number;
  message?: string;
  sentAt?: Date;
  isOwn?: boolean;
  lastMessageId?: number;
  attachmentType?: string;
  attachmentUrl?: string;
  messageStatus: MessageStatusEnum; // 0: đã gửi, 1: đã nhận, 2: đã xem
}

// export interface WebSocketModel {
//   chatUserId?: any;
//   contactId?: any;
//   notificationId?: any;
//   userNotificationId?: any;
//   senderId?: number;
//   receiverId?: number;
//   senderName?: string;
//   receiverName?: string;
//   type?: WebsocketEnum;
//   notificationType?: NotificationTypeEnum;
//   title?: string;
//   message?: string;
//   sentAt?: Date;
//   isOwn?: boolean;
//   view?: number;
//   lastMessageId?: number;
//   messageStatus: MessageStatusEnum; // 0: đã gửi, 1: đã nhận, 2: đã xem
// }

export interface WebSocketModel {
  receiverId?: any;
  receiverName?: string;
  message?: string;
  sentAt?: Date;
  isSendAll?: boolean;
  type?: WebsocketEnum;
  isOwn?: boolean;
}

export interface Contact {
  id: any;
  userFirstId?: number;  // ID của người tham gia thứ nhất
  userSecondId?: number;  // ID của người tham gia thứ hai
  userFirstName?: string;  // Biệt danh mà người tham gia thứ nhất đặt cho bản thân
  userSecondName?: string;  // Biệt danh mà người tham gia thứ hai đặt cho bản thân
  message?: string;
  sentAt?: Date;
  messageStatus: MessageStatusEnum;  // 0: đã gửi, 1: đã nhận, 2: đã xem
  lastMessageId?: number;  // ID của tin nhắn cuối cùng trong cuộc trò chuyện
  view: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserNotificationModel {
  id: any;
  userId?: number;
  title?: string;
  message?: string;
  createdAt?: Date;
  notificationType?: NotificationTypeEnum;
  isRead: boolean;
  readAt?: Date;
  paramater?: string;
  keyRouter: string;
}

export enum MessageStatusEnum {
  /// <summary>
  /// đã gửi tin nhắn
  /// </summary>
  sent,
  /// <summary>
  /// đã nhận tin nhắn
  /// </summary>
  received,
  /// <summary>
  /// đã xem tin nhắn
  /// </summary>
  watched
}

export enum NotificationTypeEnum {

  /// <summary>
  /// Thông báo đến tất cả mọi người
  /// </summary>
  all,

  /// <summary>
  /// Thông báo tin nhắn trong nhóm
  /// </summary>
  group,

  /// <summary>
  ///  thông báo cho người dùng biết có ai đó muốn kết bạn với họ
  /// </summary>
  friend_request,

  /// <summary>
  /// thông báo này được gửi khi một người dùng nhận được tin nhắn mới từ một người dùng khác
  /// </summary>
  message,

  /// <summary>
  /// thông báo này được gửi khi một người dùng được đề cập (tag) trong một bài viết, hình ảnh hoặc video
  /// </summary>
  tag,

  /// <summary>
  /// thông báo này được gửi khi một bài viết, hình ảnh hoặc bình luận của người dùng nhận được "like" từ người dùng khác
  /// </summary>
  like,

  /// <summary>
  /// thông báo này được gửi khi có người bình luận về bài viết, hình ảnh hoặc video của người dùng
  /// </summary>
  comment,

  /// <summary>
  /// Thông báo cho 1 người
  /// </summary>
  single,

  /// <summary>
  /// Thông báo về việc cấp mật khẩu
  /// </summary>
  password
}

export enum WebsocketEnum {
  /// <summary>
  /// Kết nối dùng để check online hay không
  /// </summary>
  connection,

  /// <summary>
  /// trò chuyện tin nhắn
  /// </summary>
  chat,

  /// <summary>
  /// Dùng để xác nhận đã xem tin nhắn và load lại danh bạ nếu thuộc type đó
  /// </summary>
  contact,

  /// <summary>
  /// thông báo
  /// </summary>
  notify
}
