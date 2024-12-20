USE [QLDGNS]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 2024-12-01 10:40:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DataProtectionKeys]    Script Date: 2024-12-01 10:40:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DataProtectionKeys](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FriendlyName] [nvarchar](max) NULL,
	[Xml] [nvarchar](max) NULL,
 CONSTRAINT [PK_DataProtectionKeys] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FileUploads]    Script Date: 2024-12-01 10:40:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FileUploads](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](250) NOT NULL,
	[DataFile] [varbinary](max) NOT NULL,
	[Type] [nvarchar](100) NOT NULL,
	[CreatedDate] [datetime2](7) NOT NULL,
	[GUIID] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_FileUploads] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GroupRolePermissions]    Script Date: 2024-12-01 10:40:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GroupRolePermissions](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[GroupId] [int] NOT NULL,
	[Value] [int] NOT NULL,
	[RoleId] [int] NOT NULL,
	[PermissionId] [int] NOT NULL,
 CONSTRAINT [PK_GroupRolePermissions] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Groups]    Script Date: 2024-12-01 10:40:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Groups](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](250) NOT NULL,
	[Code] [nvarchar](10) NOT NULL,
 CONSTRAINT [PK_Groups] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GroupTourGuides]    Script Date: 2024-12-01 10:40:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GroupTourGuides](
	[Id] [uniqueidentifier] NOT NULL,
	[EdgeIds] [nvarchar](max) NULL,
	[Name] [nvarchar](255) NOT NULL,
	[KeyName] [nvarchar](255) NOT NULL,
	[GroupIds] [nvarchar](max) NULL,
	[ListNodes] [nvarchar](max) NULL,
	[ListEdges] [nvarchar](max) NULL,
	[IsActive] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedUserId] [int] NULL,
	[LastUpdatedDate] [datetime2](7) NULL,
	[LastUpdatedUserId] [int] NULL,
	[CreatedDate] [datetime2](7) NULL,
	[CreatedUserId] [int] NULL,
 CONSTRAINT [PK_GroupTourGuides] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GroupUsers]    Script Date: 2024-12-01 10:40:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GroupUsers](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[GroupId] [int] NOT NULL,
	[UserId] [int] NOT NULL,
 CONSTRAINT [PK_GroupUsers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[IdentityClients]    Script Date: 2024-12-01 10:40:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[IdentityClients](
	[IdentityClientId] [nvarchar](900) NOT NULL,
	[Description] [nvarchar](100) NOT NULL,
	[SecretKey] [nvarchar](2000) NOT NULL,
	[ClientType] [int] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[RefreshTokenLifetime] [int] NOT NULL,
	[AllowedOrigin] [nvarchar](1000) NOT NULL,
 CONSTRAINT [PK_IdentityClients] PRIMARY KEY CLUSTERED 
(
	[IdentityClientId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[IdentityRefreshTokens]    Script Date: 2024-12-01 10:40:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[IdentityRefreshTokens](
	[IdentityRefreshTokenId] [nvarchar](900) NOT NULL,
	[Identity] [nvarchar](50) NOT NULL,
	[ClientId] [nvarchar](2000) NOT NULL,
	[IssuedUtc] [datetime2](7) NOT NULL,
	[ExpiresUtc] [datetime2](7) NOT NULL,
	[RefreshToken] [nvarchar](2000) NOT NULL,
 CONSTRAINT [PK_IdentityRefreshTokens] PRIMARY KEY CLUSTERED 
(
	[IdentityRefreshTokenId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MenuManagers]    Script Date: 2024-12-01 10:40:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MenuManagers](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](250) NOT NULL,
	[Url] [nvarchar](3000) NOT NULL,
	[Stt] [int] NOT NULL,
	[Icon] [nvarchar](50) NULL,
	[Groups] [nvarchar](100) NULL,
	[ParentId] [int] NULL,
	[IsBlank] [bit] NOT NULL,
	[IsShow] [bit] NOT NULL,
 CONSTRAINT [PK_MenuManagers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PasswordResetRequests]    Script Date: 2024-12-01 10:40:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PasswordResetRequests](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[status] [int] NOT NULL,
	[UserAgreeId] [int] NULL,
	[CreatedAt] [datetime2](7) NULL,
	[UpdatedAt] [datetime2](7) NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedUserId] [int] NULL,
	[LastUpdatedDate] [datetime2](7) NULL,
	[LastUpdatedUserId] [int] NULL,
	[CreatedDate] [datetime2](7) NULL,
	[CreatedUserId] [int] NULL,
 CONSTRAINT [PK_PasswordResetRequests] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Permissions]    Script Date: 2024-12-01 10:40:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Permissions](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](250) NOT NULL,
	[Code] [nvarchar](10) NOT NULL,
 CONSTRAINT [PK_Permissions] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RoleCategories]    Script Date: 2024-12-01 10:40:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RoleCategories](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TieuDe] [nvarchar](250) NOT NULL,
	[MoTa] [nvarchar](max) NOT NULL,
	[STT] [int] NOT NULL,
	[ParentId] [int] NULL,
 CONSTRAINT [PK_RoleCategories] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 2024-12-01 10:40:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](250) NOT NULL,
	[Description] [nvarchar](2000) NOT NULL,
	[CategoryId] [int] NULL,
 CONSTRAINT [PK_Roles] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TourGuideNodes]    Script Date: 2024-12-01 10:40:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TourGuideNodes](
	[Id] [uniqueidentifier] NOT NULL,
	[NodeId] [nvarchar](max) NULL,
	[KeyDiagram] [nvarchar](max) NULL,
	[ClassOrId] [nvarchar](255) NOT NULL,
	[Title] [nvarchar](max) NULL,
	[Content] [nvarchar](max) NULL,
	[PositionX] [float] NULL,
	[PositionY] [float] NULL,
	[StepIndex] [int] NULL,
	[attachment] [nvarchar](max) NULL,
	[TextHtml] [nvarchar](max) NULL,
	[IsClickElem] [bit] NOT NULL,
	[IsHtml] [bit] NOT NULL,
	[IsShow] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedUserId] [int] NULL,
	[LastUpdatedDate] [datetime2](7) NULL,
	[LastUpdatedUserId] [int] NULL,
	[CreatedDate] [datetime2](7) NULL,
	[CreatedUserId] [int] NULL,
 CONSTRAINT [PK_TourGuideNodes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserDetails]    Script Date: 2024-12-01 10:40:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserDetails](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Email] [nvarchar](100) NOT NULL,
	[Phone] [nvarchar](30) NOT NULL,
	[Address] [nvarchar](250) NOT NULL,
	[Avatar] [nvarchar](1000) NOT NULL,
	[Sex] [int] NOT NULL,
	[UserId] [int] NOT NULL,
 CONSTRAINT [PK_UserDetails] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 2024-12-01 10:40:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FullName] [nvarchar](250) NOT NULL,
	[IsAdministrator] [bit] NOT NULL,
	[Status] [int] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedUserId] [int] NULL,
	[CreatedDate] [datetime2](7) NOT NULL,
	[ModifiedDate] [datetime2](7) NOT NULL,
	[UserName] [nvarchar](max) NULL,
	[NormalizedUserName] [nvarchar](max) NULL,
	[Email] [nvarchar](max) NULL,
	[NormalizedEmail] [nvarchar](max) NULL,
	[EmailConfirmed] [bit] NOT NULL,
	[PasswordHash] [nvarchar](max) NULL,
	[SecurityStamp] [nvarchar](max) NULL,
	[ConcurrencyStamp] [nvarchar](max) NULL,
	[PhoneNumber] [nvarchar](max) NULL,
	[PhoneNumberConfirmed] [bit] NOT NULL,
	[TwoFactorEnabled] [bit] NOT NULL,
	[LockoutEnd] [datetimeoffset](7) NULL,
	[LockoutEnabled] [bit] NOT NULL,
	[AccessFailedCount] [int] NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20241130213455_Init', N'8.0.3')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20241201040427_AddTableTourAndPassRequest', N'8.0.3')
GO
SET IDENTITY_INSERT [dbo].[Groups] ON 

INSERT [dbo].[Groups] ([Id], [Title], [Code]) VALUES (1, N'Quản trị hệ thống', N'01')
SET IDENTITY_INSERT [dbo].[Groups] OFF
GO
SET IDENTITY_INSERT [dbo].[GroupUsers] ON 

INSERT [dbo].[GroupUsers] ([Id], [GroupId], [UserId]) VALUES (1, 1, 1)
SET IDENTITY_INSERT [dbo].[GroupUsers] OFF
GO
INSERT [dbo].[IdentityClients] ([IdentityClientId], [Description], [SecretKey], [ClientType], [IsActive], [RefreshTokenLifetime], [AllowedOrigin]) VALUES (N'EPS', N'EPS', N'b0udcdl8k80cqiyt63uq', 0, 1, 30, N'*')
GO
INSERT [dbo].[IdentityRefreshTokens] ([IdentityRefreshTokenId], [Identity], [ClientId], [IssuedUtc], [ExpiresUtc], [RefreshToken]) VALUES (N'263448af-50dd-4196-b5ac-4daca3217ae9', N'admin', N'EPS', CAST(N'2024-12-01T10:12:30.3775028' AS DateTime2), CAST(N'2024-12-31T10:12:30.3775033' AS DateTime2), N'09427792da6c451f9f946b055482b24a')
INSERT [dbo].[IdentityRefreshTokens] ([IdentityRefreshTokenId], [Identity], [ClientId], [IssuedUtc], [ExpiresUtc], [RefreshToken]) VALUES (N'6839074a-755f-4ae6-9ee0-956c7e88c688', N'admin', N'EPS', CAST(N'2024-12-01T09:44:46.8195097' AS DateTime2), CAST(N'2024-12-31T09:44:46.8196094' AS DateTime2), N'ea89f877970248709f675c65af723027')
INSERT [dbo].[IdentityRefreshTokens] ([IdentityRefreshTokenId], [Identity], [ClientId], [IssuedUtc], [ExpiresUtc], [RefreshToken]) VALUES (N'8d01ae1e-3b03-4c37-abfa-105669fac349', N'admin', N'EPS', CAST(N'2024-12-01T10:32:52.6570709' AS DateTime2), CAST(N'2024-12-31T10:32:52.6571515' AS DateTime2), N'1d6ed2ed2080473f891c1a136a8c501c')
INSERT [dbo].[IdentityRefreshTokens] ([IdentityRefreshTokenId], [Identity], [ClientId], [IssuedUtc], [ExpiresUtc], [RefreshToken]) VALUES (N'a8e7cc3a-e2b1-4d62-9bdf-6a84300dbec6', N'admin', N'EPS', CAST(N'2024-12-01T15:32:20.9878554' AS DateTime2), CAST(N'2024-12-31T15:32:20.9878558' AS DateTime2), N'17130f8f63944274bd879a0e9c1e38d2')
INSERT [dbo].[IdentityRefreshTokens] ([IdentityRefreshTokenId], [Identity], [ClientId], [IssuedUtc], [ExpiresUtc], [RefreshToken]) VALUES (N'bfd311a6-cfa2-4a2d-a9f4-c1a3f4874c91', N'admin', N'EPS', CAST(N'2024-12-01T15:29:57.4748315' AS DateTime2), CAST(N'2024-12-31T15:29:57.4748322' AS DateTime2), N'778ab61403be4fd0944e53d8b5c5f8f6')
INSERT [dbo].[IdentityRefreshTokens] ([IdentityRefreshTokenId], [Identity], [ClientId], [IssuedUtc], [ExpiresUtc], [RefreshToken]) VALUES (N'fbb5da3e-0a1b-4379-a2ca-682646c48a69', N'admin', N'EPS', CAST(N'2024-12-01T09:45:12.5253297' AS DateTime2), CAST(N'2024-12-31T09:45:12.5253304' AS DateTime2), N'33d86a4d6f68443c9e1aae9fe40bbcbd')
GO
SET IDENTITY_INSERT [dbo].[MenuManagers] ON 

INSERT [dbo].[MenuManagers] ([Id], [Title], [Url], [Stt], [Icon], [Groups], [ParentId], [IsBlank], [IsShow]) VALUES (2, N'Quản trị hệ thống', N'/-', 1, N'', N',1,', NULL, 0, 1)
INSERT [dbo].[MenuManagers] ([Id], [Title], [Url], [Stt], [Icon], [Groups], [ParentId], [IsBlank], [IsShow]) VALUES (3, N'Người dùng', N'/admin/users', 2, NULL, N',1,', 2, 0, 1)
INSERT [dbo].[MenuManagers] ([Id], [Title], [Url], [Stt], [Icon], [Groups], [ParentId], [IsBlank], [IsShow]) VALUES (4, N'Menu', N'/admin/menumanager', 3, NULL, N',1,', 2, 0, 1)
INSERT [dbo].[MenuManagers] ([Id], [Title], [Url], [Stt], [Icon], [Groups], [ParentId], [IsBlank], [IsShow]) VALUES (5, N'Cấu hình người dùng', N'/admin/bangcauhinh', 3, NULL, N',1,', 2, 0, 1)
INSERT [dbo].[MenuManagers] ([Id], [Title], [Url], [Stt], [Icon], [Groups], [ParentId], [IsBlank], [IsShow]) VALUES (6, N'Nhóm người dùng', N'/admin/groups', 5, NULL, N',1,', 2, 0, 1)
INSERT [dbo].[MenuManagers] ([Id], [Title], [Url], [Stt], [Icon], [Groups], [ParentId], [IsBlank], [IsShow]) VALUES (7, N'Nhóm quyền', N'/admin/rolecategory', 1, NULL, N',1,', 2, 0, 1)
INSERT [dbo].[MenuManagers] ([Id], [Title], [Url], [Stt], [Icon], [Groups], [ParentId], [IsBlank], [IsShow]) VALUES (8, N'Cấu hình Export Excel', N'/admin/configexcel/1', 1, NULL, N',1,', 2, 0, 1)
INSERT [dbo].[MenuManagers] ([Id], [Title], [Url], [Stt], [Icon], [Groups], [ParentId], [IsBlank], [IsShow]) VALUES (9, N'Cấu hình Import Excel', N'/admin/configexcel/2', 1, NULL, N',1,', 2, 0, 1)
SET IDENTITY_INSERT [dbo].[MenuManagers] OFF
GO
SET IDENTITY_INSERT [dbo].[Permissions] ON 

INSERT [dbo].[Permissions] ([Id], [Title], [Code]) VALUES (1, N'Thêm mới', N'01')
INSERT [dbo].[Permissions] ([Id], [Title], [Code]) VALUES (2, N'Sửa', N'02')
INSERT [dbo].[Permissions] ([Id], [Title], [Code]) VALUES (3, N'Xóa', N'03')
INSERT [dbo].[Permissions] ([Id], [Title], [Code]) VALUES (4, N'Phê duyệt', N'04')
INSERT [dbo].[Permissions] ([Id], [Title], [Code]) VALUES (5, N'Quyền chức năng', N'05')
INSERT [dbo].[Permissions] ([Id], [Title], [Code]) VALUES (6, N'Thêm mới', N'01')
INSERT [dbo].[Permissions] ([Id], [Title], [Code]) VALUES (7, N'Sửa', N'02')
INSERT [dbo].[Permissions] ([Id], [Title], [Code]) VALUES (8, N'Xóa', N'03')
INSERT [dbo].[Permissions] ([Id], [Title], [Code]) VALUES (9, N'Phê duyệt', N'04')
INSERT [dbo].[Permissions] ([Id], [Title], [Code]) VALUES (10, N'Quyền chức năng', N'05')
SET IDENTITY_INSERT [dbo].[Permissions] OFF
GO
SET IDENTITY_INSERT [dbo].[RoleCategories] ON 

INSERT [dbo].[RoleCategories] ([Id], [TieuDe], [MoTa], [STT], [ParentId]) VALUES (1, N'Quản trị hệ thống', N'Nhóm đối tượng quản trị hệ thống', 1, NULL)
SET IDENTITY_INSERT [dbo].[RoleCategories] OFF
GO
SET IDENTITY_INSERT [dbo].[Roles] ON 

INSERT [dbo].[Roles] ([Id], [Name], [Description], [CategoryId]) VALUES (1, N'groups', N'Nhóm người dùng', 1)
INSERT [dbo].[Roles] ([Id], [Name], [Description], [CategoryId]) VALUES (2, N'permissions', N'Quyền người dùng', 1)
INSERT [dbo].[Roles] ([Id], [Name], [Description], [CategoryId]) VALUES (3, N'users', N'Tài khoản người dùng', 1)
INSERT [dbo].[Roles] ([Id], [Name], [Description], [CategoryId]) VALUES (4, N'groupuser', N'Nhóm - người dùng', 1)
INSERT [dbo].[Roles] ([Id], [Name], [Description], [CategoryId]) VALUES (5, N'menumanager', N'Menu hệ thống', 1)
INSERT [dbo].[Roles] ([Id], [Name], [Description], [CategoryId]) VALUES (6, N'configexcel', N'Cấu hình excel', 1)
INSERT [dbo].[Roles] ([Id], [Name], [Description], [CategoryId]) VALUES (7, N'groups', N'Nhóm người dùng', 1)
INSERT [dbo].[Roles] ([Id], [Name], [Description], [CategoryId]) VALUES (8, N'permissions', N'Quyền người dùng', 1)
INSERT [dbo].[Roles] ([Id], [Name], [Description], [CategoryId]) VALUES (9, N'users', N'Tài khoản người dùng', 1)
INSERT [dbo].[Roles] ([Id], [Name], [Description], [CategoryId]) VALUES (10, N'groupuser', N'Nhóm - người dùng', 1)
INSERT [dbo].[Roles] ([Id], [Name], [Description], [CategoryId]) VALUES (11, N'menumanager', N'Menu hệ thống', 1)
INSERT [dbo].[Roles] ([Id], [Name], [Description], [CategoryId]) VALUES (12, N'configexcel', N'Cấu hình excel', 1)
SET IDENTITY_INSERT [dbo].[Roles] OFF
GO
SET IDENTITY_INSERT [dbo].[UserDetails] ON 

INSERT [dbo].[UserDetails] ([Id], [Email], [Phone], [Address], [Avatar], [Sex], [UserId]) VALUES (1, N'admin@gmail.com', N'0987654321', N'Hà Nội', N'123', 1, 1)
INSERT [dbo].[UserDetails] ([Id], [Email], [Phone], [Address], [Avatar], [Sex], [UserId]) VALUES (2, N'phamkhuong97@gmail.com', N'0976660097', N'', N'', 3, 2)
SET IDENTITY_INSERT [dbo].[UserDetails] OFF
GO
SET IDENTITY_INSERT [dbo].[Users] ON 

INSERT [dbo].[Users] ([Id], [FullName], [IsAdministrator], [Status], [DeletedDate], [DeletedUserId], [CreatedDate], [ModifiedDate], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount]) VALUES (1, N'Quản trị hệ thống', 1, 2, NULL, NULL, CAST(N'2024-12-01T05:01:29.1077499' AS DateTime2), CAST(N'2024-12-01T05:01:29.1077995' AS DateTime2), N'admin', N'admin', N'admin@gmail.com', N'admin@gmail.com', 1, N'AQAAAAIAAYagAAAAEEV/8997OIj/xoDEEBbzlcQ4/R0UFwMjHq57jbI41r4fJpABUZTIp4iyXLdkAkcHfg==', N'c09fd48d-d4e1-4d39-81f1-e59fa9b8ef08', N'938b4e0f-069d-4357-8b3f-4bdad251ff96', NULL, 0, 0, NULL, 0, 0)
INSERT [dbo].[Users] ([Id], [FullName], [IsAdministrator], [Status], [DeletedDate], [DeletedUserId], [CreatedDate], [ModifiedDate], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount]) VALUES (2, N'phạm khương', 0, 2, NULL, NULL, CAST(N'2024-12-01T18:24:38.6834288' AS DateTime2), CAST(N'2024-12-01T18:25:10.9318996' AS DateTime2), N'khuongpv', N'KHUONGPV', N'phamkhuong97@gmail.com', N'PHAMKHUONG97@GMAIL.COM', 0, N'AQAAAAIAAYagAAAAEECPs0fdNP87I8f75X76eScZ5sMsRpzEt1/KD1ktHwActD9BAvZj8KvYXN0Gxs6kyQ==', N'OQ6VZSC6RZ5HF656MPPMHCQJ4WCSS7HX', N'0394933b-b134-477b-84b3-f8d01a157714', N'0976660097', 0, 0, NULL, 1, 0)
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
ALTER TABLE [dbo].[GroupRolePermissions]  WITH CHECK ADD  CONSTRAINT [FK_GroupRolePermissions_Groups_GroupId] FOREIGN KEY([GroupId])
REFERENCES [dbo].[Groups] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[GroupRolePermissions] CHECK CONSTRAINT [FK_GroupRolePermissions_Groups_GroupId]
GO
ALTER TABLE [dbo].[GroupRolePermissions]  WITH CHECK ADD  CONSTRAINT [FK_GroupRolePermissions_Permissions_PermissionId] FOREIGN KEY([PermissionId])
REFERENCES [dbo].[Permissions] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[GroupRolePermissions] CHECK CONSTRAINT [FK_GroupRolePermissions_Permissions_PermissionId]
GO
ALTER TABLE [dbo].[GroupRolePermissions]  WITH CHECK ADD  CONSTRAINT [FK_GroupRolePermissions_Roles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[Roles] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[GroupRolePermissions] CHECK CONSTRAINT [FK_GroupRolePermissions_Roles_RoleId]
GO
ALTER TABLE [dbo].[GroupUsers]  WITH CHECK ADD  CONSTRAINT [FK_GroupUsers_Groups_GroupId] FOREIGN KEY([GroupId])
REFERENCES [dbo].[Groups] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[GroupUsers] CHECK CONSTRAINT [FK_GroupUsers_Groups_GroupId]
GO
ALTER TABLE [dbo].[GroupUsers]  WITH CHECK ADD  CONSTRAINT [FK_GroupUsers_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[GroupUsers] CHECK CONSTRAINT [FK_GroupUsers_Users_UserId]
GO
ALTER TABLE [dbo].[MenuManagers]  WITH CHECK ADD  CONSTRAINT [FK_MenuManagers_MenuManagers_ParentId] FOREIGN KEY([ParentId])
REFERENCES [dbo].[MenuManagers] ([Id])
GO
ALTER TABLE [dbo].[MenuManagers] CHECK CONSTRAINT [FK_MenuManagers_MenuManagers_ParentId]
GO
ALTER TABLE [dbo].[PasswordResetRequests]  WITH CHECK ADD  CONSTRAINT [FK_PasswordResetRequests_Users_UserAgreeId] FOREIGN KEY([UserAgreeId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[PasswordResetRequests] CHECK CONSTRAINT [FK_PasswordResetRequests_Users_UserAgreeId]
GO
ALTER TABLE [dbo].[PasswordResetRequests]  WITH CHECK ADD  CONSTRAINT [FK_PasswordResetRequests_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PasswordResetRequests] CHECK CONSTRAINT [FK_PasswordResetRequests_Users_UserId]
GO
ALTER TABLE [dbo].[RoleCategories]  WITH CHECK ADD  CONSTRAINT [FK_RoleCategories_RoleCategories_ParentId] FOREIGN KEY([ParentId])
REFERENCES [dbo].[RoleCategories] ([Id])
GO
ALTER TABLE [dbo].[RoleCategories] CHECK CONSTRAINT [FK_RoleCategories_RoleCategories_ParentId]
GO
ALTER TABLE [dbo].[Roles]  WITH CHECK ADD  CONSTRAINT [FK_Roles_RoleCategories_CategoryId] FOREIGN KEY([CategoryId])
REFERENCES [dbo].[RoleCategories] ([Id])
GO
ALTER TABLE [dbo].[Roles] CHECK CONSTRAINT [FK_Roles_RoleCategories_CategoryId]
GO
ALTER TABLE [dbo].[UserDetails]  WITH CHECK ADD  CONSTRAINT [FK_UserDetails_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[UserDetails] CHECK CONSTRAINT [FK_UserDetails_Users_UserId]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_Users_DeletedUserId] FOREIGN KEY([DeletedUserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_Users_DeletedUserId]
GO
