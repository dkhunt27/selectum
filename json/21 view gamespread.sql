create view GameSpread2 as
select
	gs.GameSpreadId,
	gs.GameId,
	g.GameFilterId,
	g.GameDateTime,
	gs.FavoriteTeamId,
	ft.TeamLongName as FavoriteTeamLongName,
	gs.UnderdogTeamId,
	ut.TeamLongName as UnderdogTeamLongName,
	gs.Spread
from
	GameSpread gs
	inner join Game g on (gs.GameId = g.GameId)
	inner join Team ft on gs.FavoriteTeamId = ft.TeamId
	inner join Team ut on gs.UnderdogTeamId = ut.TeamId