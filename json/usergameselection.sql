select
	'{ userGameSelectionId: ' + convert(varchar,ugs.UserGameSelectionId) + ',' +
	' userId: ' + convert(varchar,ugs.UserId) + ',' +
	' gameId: ' + convert(varchar,ugs.GameId) + ',' +
	' game: ' +
	' {' +
		' gameId: ' + convert(varchar, g.GameId) + ',' +
		' gameFilterId: ' + convert(varchar, g.GameFilterId) + ',' +
		' gameDateTime: "' + convert(varchar, g.GameDateTime) + '"' + ',' +
		' favoriteTeamId: ' + convert(varchar, g.FavoriteTeamId) + ',' +
		' favoriteTeam: ' +
		' {' +
			' teamId: ' + convert(varchar, ft.TeamId) + ',' +
			' teamShortName: "' + convert(varchar, ft.TeamShortName) + '"' + ',' +
			' teamLongName:  "' + convert(varchar, ft.TeamLongName) + '"' + 
		' }'+ ',' +
		' underdogTeamId: ' + convert(varchar, g.UnderdogTeamId) + ',' +
		' underdogTeam: ' +
		' {' +
			' teamId: ' + convert(varchar, ut.TeamId) + ',' +
			' teamShortName: "' + convert(varchar, ut.TeamShortName) + '"' + ',' +
			' teamLongName:  "' + convert(varchar, ut.TeamLongName) + '"' + 
		' }'+ ',' +
		' spread: ' + convert(varchar, g.Spread) + ',' +
		' homeTeam: "' + convert(varchar, g.HomeTeam) + '"' + 
	' }'+ ',' +
	' bet: ' + convert(varchar,ugs.Bet) + ',' +
	--' pickTeamId: ' + convert(varchar,ugs.PickTeamId) + ',' +
	' pickTeamId: ' + convert(varchar,pt.TeamId) + ',' +
	' pickTeam: ' +
			' {' +
			' teamId: ' + convert(varchar, pt.TeamId) + ',' +
			' teamShortName: "' + convert(varchar, pt.TeamShortName) + '"' + ',' +
			' teamLongName:  "' + convert(varchar, pt.TeamLongName) + '"' +
			' }'+
	'},'
from
	UserGameSelection ugs
	inner join Game g on ugs.GameId = g.GameId
	inner join Team ft on g.FavoriteTeamId = ft.TeamId
	inner join Team ut on g.UnderdogTeamId = ut.TeamId
	--inner join Team pt on ugs.PickTeamId = pt.TeamId
	inner join Team pt on pt.TeamId = 1
where
	ugs.UserId = 1 and
	g.GameId between 49 and 61