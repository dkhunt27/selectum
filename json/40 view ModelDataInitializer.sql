drop view dbo.ModelDataInitializerUser
go

create view dbo.ModelDataInitializerUser as
select 
	'new User { ' +
	'UserId=' + convert(varchar,UserId) + ', ' +
	'UserName="' + UserName + '" ' +
	'},' as Data,
	UserId
from
	[User]
go

drop view dbo.ModelDataInitializerTeam
go

create view dbo.ModelDataInitializerTeam as
select 
	'new Team { ' +
	'TeamId=' + convert(varchar,TeamId) + ', ' +
	'TeamLongName="' + TeamLongName + '", ' +
	'TeamShortName="' + TeamShortName + '", ' +
	'TeamOtherName="' + TeamOtherName + '" ' +
	'},' as Data,
	TeamId
from
	Team
go

drop view dbo.ModelDataInitializerGameFilter
go

create view dbo.ModelDataInitializerGameFilter as
select 
	'new GameFilter { ' +
	'GameFilterId=' + convert(varchar,GameFilterId) + ', ' +
	'GameFilterName="' + GameFilterName + '", ' +
	'GameFilterStartDate=Convert.ToDateTime("' + convert(varchar,GameFilterStartDate) + '"), ' +
	'GameFilterEndDate=Convert.ToDateTime("' + convert(varchar,GameFilterEndDate) + '"), ' +
	'GameFilterEnabled=' + case when GameFilterEnabled = 0 then 'false' else 'true' end + ', ' +
	'GameFilterAvailable=' + case when GameFilterAvailable = 0 then 'false' else 'true' end + ' ' +
	'},' as Data,
	GameFilterId
from
	GameFilter
go

drop view dbo.ModelDataInitializerGame
go
create view dbo.ModelDataInitializerGame as
select 
	'new Game { ' +
	'GameId=' + convert(varchar,g.GameId) + ', ' +
	'GameFilterId=' + convert(varchar,g.GameFilterId) + ', ' +
	'GameDateTime=Convert.ToDateTime("' + convert(varchar,g.GameDateTime) + '"), ' +
	'Team1Id=' + convert(varchar,g.Team1Id) + ', ' +
	'Team2Id=' + convert(varchar,g.Team2Id) + ', ' +
	'HomeTeam=' + convert(varchar,g.HomeTeam) + ', ' +
	'GameFilter=' + gf.data +
	'Team1=' + t1.data +
	'Team2=' + t2.data +
	'},' as Data,
	g.GameId
from
	Game g
	inner join ModelDataInitializerGameFilter gf on (g.GameFilterId = gf.GameFilterId)
	inner join ModelDataInitializerTeam t1 on (g.Team1Id = t1.TeamId)
	inner join ModelDataInitializerTeam t2 on (g.Team2Id = t2.TeamId)
go

drop view dbo.ModelDataInitializerGameSpread
go
create view dbo.ModelDataInitializerGameSpread as
select 
	'new GameSpread { ' +
	'GameSpreadId=' + convert(varchar,gs.GameSpreadId) + ', ' +
	'GameId=' + convert(varchar,gs.GameId) + ', ' +
	'FavoriteTeamId=' + convert(varchar,gs.FavoriteTeamId) + ', ' +
	'UnderdogTeamId=' + convert(varchar,gs.UnderdogTeamId) + ', ' +
	'Spread=Convert.ToDecimal(' + convert(varchar,gs.Spread) + '), ' +
	'Game=' + g.data +
	'FavoriteTeam=' + ft.data +
	'UnderdogTeam=' + ut.data +
	'},' as Data,
	gs.GameSpreadId
from
	GameSpread gs
	inner join ModelDataInitializerGame g on (gs.GameId = g.GameId)
	inner join ModelDataInitializerTeam ft on (gs.FavoriteTeamId = ft.TeamId)
	inner join ModelDataInitializerTeam ut on (gs.UnderdogTeamId = ut.TeamId)
go

drop view dbo.ModelDataInitializerGameResult
go
create view dbo.ModelDataInitializerGameResult as
select 
	'new GameResult { ' +
	'GameResultId=' + convert(varchar,gr.GameResultId) + ', ' +
	'GameSpreadId=' + convert(varchar,gr.GameSpreadId) + ', ' +
	'WinnerTeamId=' + convert(varchar,gr.WinnerTeamId) + ', ' +
	'FavoriteScore=' + convert(varchar,gr.FavoriteScore) + ', ' +
	'UnderdogScore=' + convert(varchar,gr.UnderdogScore) + ', ' +
	'GamePeriod="' + gr.GamePeriod + '", ' +
	'GameSpread=' + gs.data +
	'WinnerTeam=' + wt.data +
	'},' as Data,
	gr.GameResultId
from
	GameResult gr
	inner join ModelDataInitializerGameSpread gs on (gr.GameSpreadId = gs.GameSpreadId)
	inner join ModelDataInitializerTeam wt on (gr.WinnerTeamId = wt.TeamId)
go

drop view dbo.ModelDataInitializerUserGameSelection
go
create view dbo.ModelDataInitializerUserGameSelection as
select 
	'new UserGameSelection { ' +
	'UserGameSelectionId=' + convert(varchar,ugs.UserGameSelectionId) + ', ' +
	'UserId=' + convert(varchar,ugs.UserId) + ', ' +
	'GameSpreadId=' + convert(varchar,ugs.GameSpreadId) + ', ' +
	'PickTeamId=' + convert(varchar,ugs.PickTeamId) + ', ' +
	'Bet=' + convert(varchar,ugs.Bet) + ', ' +
	'Saved=' + case when ugs.Saved = 0 then 'false' else 'true' end + ', ' +
	'User=' + u.data +
	'GameSpread=' + gs.data +
	'PickTeam=' + pt.data +
	'},' as Data,
	ugs.UserGameSelectionId
from
	UserGameSelection ugs
	inner join ModelDataInitializerUser u on (ugs.UserId = u.UserId)
	inner join ModelDataInitializerGameSpread gs on (ugs.GameSpreadId = gs.GameSpreadId)
	inner join ModelDataInitializerTeam pt on (ugs.PickTeamId = pt.TeamId)
go

drop view dbo.ModelDataInitializerUserGameResult
go
create view dbo.ModelDataInitializerUserGameResult as
select 
	'new UserGameResult { ' +
	'UserGameResultId=' + convert(varchar,ugr.UserGameResultId) + ', ' +
	'UserGameSelectionId=' + convert(varchar,ugr.UserGameSelectionId) + ', ' +
	'BetPoints=' + convert(varchar,ugr.BetPoints) + ', ' +
	'BetResult=' + convert(varchar,ugr.BetResult) + ', ' +
	'UserGameSelection=' + ugs.data +
	'},' as Data,
	ugr.UserGameResultId
from
	UserGameResult ugr
	inner join ModelDataInitializerUserGameSelection ugs on (ugr.UserGameSelectionId = ugs.UserGameSelectionId)
go