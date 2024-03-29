create view UserGameSelection2 as
SELECT 
	ugs.UserGameSelectionId,
	ugs.UserId,
	u.UserName,
	ugs.GameSpreadId,
	gs.FavoriteTeamId,
	ft.TeamLongName as FavoriteTeamLongName,
	gs.UnderdogTeamId,
	ut.TeamLongName as UnderdogTeamLongName,
	gs.Spread,
	gs.GameId,
	g.GameFilterId,
	g.GameDateTime,
	ugs.PickTeamId,
	pt.TeamLongName as PickTeamLongName,
	ugs.Bet,
	ugs.Saved
FROM 
	UserGameSelection ugs
	inner join [User] u on (ugs.UserId = u.UserId)
	inner join GameSpread gs on (ugs.GameSpreadId = gs.GameSpreadId)
	inner join Game g on (gs.GameId = g.GameId)
	inner join Team ft on (gs.FavoriteTeamId = ft.TeamId)
	inner join Team ut on (gs.UnderdogTeamId = ut.TeamId)
	inner join Team pt on (ugs.PickTeamId = pt.TeamId)