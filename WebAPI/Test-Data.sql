USE [WebApiSample]
GO

TRUNCATE TABLE [dbo].[Students]

--DBCC CHECKIDENT (Students,RESEED,0)

SET IDENTITY_INSERT [dbo].[Students] ON 
GO

INSERT [dbo].[Students] ([ID], [FirstName], [LastName], [Address], [City], [PostalCode], [Province], [Country], [Email], [Website], [Phone])
VALUES
(1, N'John', N'Smith', N'123 Toronto St.', N'Toronto', N'A1B 2C3', N'ON', N'Canada', N'nsmith@test.com', NULL, NULL),
(2, N'Bruce', N'Banner', N'123 Toronto St.', N'Toronto', N'A1B 2C3', N'ON', N'Canada', N'bbanner@test.com', NULL, NULL),
(3, N'Clark', N'Kent', N'123 Toronto St.', N'Toronto', N'A1B 2C3', N'ON', N'Canada', N'ckent@test.com', NULL, NULL),
(4, N'Barry', N'Allan', N'123 Toronto St.', N'Toronto', N'A1B 2C3', N'ON', N'Canada', N'ballan@test.com', NULL, NULL),
(5, N'Steve', N'Rogers', N'123 Toronto St.', N'Toronto', N'A1B 2C3', N'ON', N'Canada', N'srogers@test.com', NULL, NULL),
(6, N'Tony', N'Stark', N'123 Toronto St.', N'Toronto', N'A1B 2C3', N'ON', N'Canada', N'tstark@test.com', NULL, NULL),
(7, N'Nick', N'Fury', N'123 Toronto St.', N'Toronto', N'A1B 2C3', N'ON', N'Canada', N'nfury@test.com', NULL, NULL),
(8, N'Natasha', N'Romanoff', N'123 Toronto St.', N'Toronto', N'A1B 2C3', N'ON', N'Canada', N'nromanoff@test.com', NULL, NULL),
(9, N'Peter', N'Parker', N'123 Toronto St.', N'Toronto', N'A1B 2C3', N'ON', N'Canada', N'pparker@test.com', NULL, NULL),
(10, N'Black', N'Panther', N'123 Toronto St.', N'Toronto', N'A1B 2C3', N'ON', N'Canada', N'bpanther@test.com', NULL, NULL)

GO
SET IDENTITY_INSERT [dbo].[Students] OFF
GO
