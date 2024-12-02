Insert into RoleCategories ("TieuDe", "MoTa", "STT") values (N'Quản trị hệ thống',N'Nhóm đối tượng quản trị hệ thống',1);

Insert into "Roles" ("Name", "Description","CategoryId") values (N'groups',N'Nhóm người dùng',1);
Insert into "Roles" ("Name", "Description","CategoryId") values (N'permissions',N'Quyền người dùng',1);
Insert into "Roles" ("Name", "Description","CategoryId") values (N'users',N'Tài khoản người dùng',1);
Insert into "Roles" ("Name", "Description","CategoryId") values (N'groupuser',N'Nhóm - người dùng',1);
Insert into "Roles" ("Name", "Description","CategoryId") values (N'menumanager',N'Menu hệ thống',1);
Insert into "Roles" ("Name", "Description","CategoryId") values (N'configexcel',N'Cấu hình excel',1);

Insert into "Groups" ("Title", "Code") values (N'Quản trị hệ thống','01');
Insert into "Permissions" ("Title", "Code") values (N'Thêm mới','01');
Insert into "Permissions" ("Title", "Code") values (N'Sửa','02');
Insert into "Permissions" ("Title", "Code") values (N'Xóa','03');
Insert into "Permissions" ("Title", "Code") values (N'Phê duyệt','04');
Insert into "Permissions" ("Title", "Code") values (N'Quyền chức năng','05');

INSERT INTO "MenuManagers" ("Title", "Url", "Stt", "Icon", "Groups", "ParentId", "IsBlank", "IsShow")
VALUES
(N'Quản trị hệ thống', '/-', 1, NULL, ',1,', NULL, 0, 1),
(N'Người dùng', '/admin/users', 2, NULL, ',1,', 1, 0, 1),
(N'Menu', '/admin/menumanager', 3, NULL, ',1,', 1, 0, 1),
(N'Cấu hình người dùng', '/admin/bangcauhinh', 4, NULL, ',1,', 1, 0, 1),
(N'Nhóm người dùng', '/admin/groups', 6, NULL, ',1,', 1, 0, 1),
(N'Nhóm quyền', '/admin/rolecategory', 7, NULL, ',1,', 1, 0, 1),
(N'Cấu hình Import Excel', '/admin/configexcel/2', 8, NULL, ',1,', 1, 0, 1),
(N'Cấu hình Export Excel', '/admin/configexcel/1', 9, NULL, ',1,', 1, 0, 1);
