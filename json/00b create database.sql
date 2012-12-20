/****** Object:  Table [dbo].[webpages_OAuthMembership]    Script Date: 12/19/2012 9:39:19 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE TABLE [dbo].[User](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[UserName] [nvarchar](25) NOT NULL,
 CONSTRAINT [PK_dbo.User] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)
)

GO

CREATE TABLE [dbo].[UserToUserProfile](
	[UserToUserProfileId] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[UserProfileId] [int] NOT NULL,
 CONSTRAINT [PK_dbo.UserToUserProfile] PRIMARY KEY CLUSTERED 
(
	[UserToUserProfileId] ASC
)
)

GO

ALTER TABLE [dbo].[UserToUserProfile]  WITH CHECK ADD  CONSTRAINT [FK_dbo.UserToUserProfile_dbo.User_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([UserId])
GO

ALTER TABLE [dbo].[UserToUserProfile] CHECK CONSTRAINT [FK_dbo.UserToUserProfile_dbo.User_UserId]
GO



CREATE TABLE [dbo].[Team](
	[TeamId] [int] IDENTITY(1,1) NOT NULL,
	[TeamLongName] [nvarchar](25) NOT NULL,
	[TeamShortName] [nvarchar](5) NOT NULL,
	[TeamOtherName] [nvarchar](25) NOT NULL,
 CONSTRAINT [PK_dbo.Team] PRIMARY KEY CLUSTERED 
(
	[TeamId] ASC
)
)

GO

CREATE TABLE [dbo].[GameFilter](
	[GameFilterId] [int] IDENTITY(1,1) NOT NULL,
	[GameFilterName] [nvarchar](15) NOT NULL,
	[GameFilterStartDate] [datetime] NOT NULL,
	[GameFilterEndDate] [datetime] NOT NULL,
	[GameFilterEnabled] [bit] NOT NULL,
	[GameFilterAvailable] [bit] NOT NULL,
 CONSTRAINT [PK_dbo.GameFilter] PRIMARY KEY CLUSTERED 
(
	[GameFilterId] ASC
)
)

GO

CREATE TABLE [dbo].[Game](
	[GameId] [int] IDENTITY(1,1) NOT NULL,
	[GameFilterId] [int] NOT NULL,
	[GameDateTime] [datetime] NOT NULL,
	[Team1Id] [int] NOT NULL,
	[Team2Id] [int] NOT NULL,
	[HomeTeam] [int] NOT NULL,
 CONSTRAINT [PK_dbo.Game] PRIMARY KEY CLUSTERED 
(
	[GameId] ASC
)
)

GO

ALTER TABLE [dbo].[Game]  WITH CHECK ADD  CONSTRAINT [FK_dbo.Game_dbo.GameFilter_GameFilterId] FOREIGN KEY([GameFilterId])
REFERENCES [dbo].[GameFilter] ([GameFilterId])
GO

ALTER TABLE [dbo].[Game] CHECK CONSTRAINT [FK_dbo.Game_dbo.GameFilter_GameFilterId]
GO

ALTER TABLE [dbo].[Game]  WITH CHECK ADD  CONSTRAINT [FK_dbo.Game_dbo.Team_Team1Id] FOREIGN KEY([Team1Id])
REFERENCES [dbo].[Team] ([TeamId])
GO

ALTER TABLE [dbo].[Game] CHECK CONSTRAINT [FK_dbo.Game_dbo.Team_Team1Id]
GO

ALTER TABLE [dbo].[Game]  WITH CHECK ADD  CONSTRAINT [FK_dbo.Game_dbo.Team_Team2Id] FOREIGN KEY([Team2Id])
REFERENCES [dbo].[Team] ([TeamId])
GO

ALTER TABLE [dbo].[Game] CHECK CONSTRAINT [FK_dbo.Game_dbo.Team_Team2Id]
GO


CREATE TABLE [dbo].[GameSpread](
	[GameSpreadId] [int] IDENTITY(1,1) NOT NULL,
	[GameId] [int] NOT NULL,
	[FavoriteTeamId] [int] NOT NULL,
	[UnderdogTeamId] [int] NOT NULL,
	[Spread] [decimal](6, 3) NOT NULL,
 CONSTRAINT [PK_dbo.GameSpread] PRIMARY KEY CLUSTERED 
(
	[GameSpreadId] ASC
)
)

GO

ALTER TABLE [dbo].[GameSpread]  WITH CHECK ADD  CONSTRAINT [FK_dbo.GameSpread_dbo.Game_GameId] FOREIGN KEY([GameId])
REFERENCES [dbo].[Game] ([GameId])
GO

ALTER TABLE [dbo].[GameSpread] CHECK CONSTRAINT [FK_dbo.GameSpread_dbo.Game_GameId]
GO

ALTER TABLE [dbo].[GameSpread]  WITH CHECK ADD  CONSTRAINT [FK_dbo.GameSpread_dbo.Team_FavoriteTeamId] FOREIGN KEY([FavoriteTeamId])
REFERENCES [dbo].[Team] ([TeamId])
GO

ALTER TABLE [dbo].[GameSpread] CHECK CONSTRAINT [FK_dbo.GameSpread_dbo.Team_FavoriteTeamId]
GO

ALTER TABLE [dbo].[GameSpread]  WITH CHECK ADD  CONSTRAINT [FK_dbo.GameSpread_dbo.Team_UnderdogTeamId] FOREIGN KEY([UnderdogTeamId])
REFERENCES [dbo].[Team] ([TeamId])
GO

ALTER TABLE [dbo].[GameSpread] CHECK CONSTRAINT [FK_dbo.GameSpread_dbo.Team_UnderdogTeamId]
GO

CREATE TABLE [dbo].[GameResult](
	[GameResultId] [int] IDENTITY(1,1) NOT NULL,
	[GameSpreadId] [int] NOT NULL,
	[WinnerTeamId] [int] NOT NULL,
	[FavoriteScore] [int] NOT NULL,
	[UnderdogScore] [int] NOT NULL,
	[GamePeriod] [nvarchar](5) NOT NULL,
 CONSTRAINT [PK_dbo.GameResult] PRIMARY KEY CLUSTERED 
(
	[GameResultId] ASC
)
)

GO

ALTER TABLE [dbo].[GameResult]  WITH CHECK ADD  CONSTRAINT [FK_dbo.GameResult_dbo.GameSpread_GameSpreadId] FOREIGN KEY([GameSpreadId])
REFERENCES [dbo].[GameSpread] ([GameSpreadId])
GO

ALTER TABLE [dbo].[GameResult] CHECK CONSTRAINT [FK_dbo.GameResult_dbo.GameSpread_GameSpreadId]
GO

ALTER TABLE [dbo].[GameResult]  WITH CHECK ADD  CONSTRAINT [FK_dbo.GameResult_dbo.Team_WinnerTeamId] FOREIGN KEY([WinnerTeamId])
REFERENCES [dbo].[Team] ([TeamId])
GO

ALTER TABLE [dbo].[GameResult] CHECK CONSTRAINT [FK_dbo.GameResult_dbo.Team_WinnerTeamId]
GO

CREATE TABLE [dbo].[UserGameSelection](
	[UserGameSelectionId] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[GameSpreadId] [int] NOT NULL,
	[PickTeamId] [int] NOT NULL,
	[Bet] [int] NOT NULL,
	[Saved] [bit] NULL,
 CONSTRAINT [PK_dbo.UserGameSelection] PRIMARY KEY CLUSTERED 
(
	[UserGameSelectionId] ASC
)
)

GO

ALTER TABLE [dbo].[UserGameSelection]  WITH CHECK ADD  CONSTRAINT [FK_dbo.UserGameSelection_dbo.GameSpread_GameSpreadId] FOREIGN KEY([GameSpreadId])
REFERENCES [dbo].[GameSpread] ([GameSpreadId])
GO

ALTER TABLE [dbo].[UserGameSelection] CHECK CONSTRAINT [FK_dbo.UserGameSelection_dbo.GameSpread_GameSpreadId]
GO

ALTER TABLE [dbo].[UserGameSelection]  WITH CHECK ADD  CONSTRAINT [FK_dbo.UserGameSelection_dbo.Team_PickTeamId] FOREIGN KEY([PickTeamId])
REFERENCES [dbo].[Team] ([TeamId])
GO

ALTER TABLE [dbo].[UserGameSelection] CHECK CONSTRAINT [FK_dbo.UserGameSelection_dbo.Team_PickTeamId]
GO

ALTER TABLE [dbo].[UserGameSelection]  WITH CHECK ADD  CONSTRAINT [FK_dbo.UserGameSelection_dbo.User_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([UserId])
GO

ALTER TABLE [dbo].[UserGameSelection] CHECK CONSTRAINT [FK_dbo.UserGameSelection_dbo.User_UserId]
GO

CREATE TABLE [dbo].[UserGameResult](
	[UserGameResultId] [int] IDENTITY(1,1) NOT NULL,
	[UserGameSelectionId] [int] NOT NULL,
	[BetResult] [int] NOT NULL,
	[BetPoints] [int] NOT NULL,
 CONSTRAINT [PK_dbo.UserGameResult] PRIMARY KEY CLUSTERED 
(
	[UserGameResultId] ASC
)
)

GO

ALTER TABLE [dbo].[UserGameResult]  WITH CHECK ADD  CONSTRAINT [FK_dbo.UserGameResult_dbo.UserGameSelection_UserGameSelectionId] FOREIGN KEY([UserGameSelectionId])
REFERENCES [dbo].[UserGameSelection] ([UserGameSelectionId])
GO

ALTER TABLE [dbo].[UserGameResult] CHECK CONSTRAINT [FK_dbo.UserGameResult_dbo.UserGameSelection_UserGameSelectionId]
GO

CREATE TABLE [dbo].[UserResult](
	[UserResultId] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[GameFilterId] [int] NOT NULL,
	[Bets] [int] NOT NULL,
	[Wins] [int] NOT NULL,
	[Points] [int] NOT NULL,
 CONSTRAINT [PK_dbo.UserResult] PRIMARY KEY CLUSTERED 
(
	[UserResultId] ASC
)
)

GO

ALTER TABLE [dbo].[UserResult]  WITH CHECK ADD  CONSTRAINT [FK_dbo.UserResult_dbo.GameFilter_GameFilterId] FOREIGN KEY([GameFilterId])
REFERENCES [dbo].[GameFilter] ([GameFilterId])
GO

ALTER TABLE [dbo].[UserResult] CHECK CONSTRAINT [FK_dbo.UserResult_dbo.GameFilter_GameFilterId]
GO

ALTER TABLE [dbo].[UserResult]  WITH CHECK ADD  CONSTRAINT [FK_dbo.UserResult_dbo.User_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([UserId])
GO

ALTER TABLE [dbo].[UserResult] CHECK CONSTRAINT [FK_dbo.UserResult_dbo.User_UserId]
GO

