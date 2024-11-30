Insert into RoleCategory ("TieuDe", "MoTa", "STT") values (N'Quản trị hệ thống',N'Nhóm đối tượng quản trị hệ thống',1);

Insert into "Roles" ("Name", "Description","CategoryId") values (N'groups',N'Nhóm người dùng',1);
Insert into "Roles" ("Name", "Description","CategoryId") values (N'permissions',N'Quyền người dùng',1);
Insert into "Roles" ("Name", "Description","CategoryId") values (N'users',N'Tài khoản người dùng',1);
Insert into "Roles" ("Name", "Description","CategoryId") values (N'groupuser',N'Nhóm - người dùng',1);
Insert into "Roles" ("Name", "Description","CategoryId") values (N'menumanager',N'Menu hệ thống',1);
Insert into "Roles" ("Name", "Description","CategoryId") values (N'configexcel',N'Cấu hình excel',1);

Insert into "Group" ("Title", "Code") values (N'Quản trị hệ thống','01');
Insert into "Permission" ("Title", "Code") values (N'Thêm mới','01');
Insert into "Permission" ("Title", "Code") values (N'Sửa','02');
Insert into "Permission" ("Title", "Code") values (N'Xóa','03');
Insert into "Permission" ("Title", "Code") values (N'Phê duyệt','04');
Insert into "Permission" ("Title", "Code") values (N'Quyền chức năng','05');