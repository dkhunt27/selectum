create view [dbo].[game2] as
select
	gf.GameFilterId,
	gf.GameFilterName,
	g.GameId,
	g.GameDateTime,
	g.Team1Id,
	t1.TeamLongName as Team1LongName,
	t1.TeamShortName as Team1ShortName,
	g.Team2Id,
	t2.TeamLongName as Team2LongName,
	t2.TeamShortName as Team2ShortName,
	g.HomeTeam
from
	game g
	inner join team t1 on g.Team1Id = t1.TeamId
	inner join team t2 on g.Team2Id = t2.TeamId
	inner join gamefilter gf on g.GameFilterId = gf.GameFilterId
GO


