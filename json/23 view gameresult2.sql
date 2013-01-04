create view GameResult2 as
SELECT 
	gr.GameResultId,
    gr.GameSpreadId,
    gr.WinnerTeamId,
	wt.TeamLongName as WinnerTeamName,
    gr.FavoriteScore,
    gr.UnderdogScore,
    gr.GamePeriod,
	gs.GameId,
	gs.FavoriteTeamId,
	ft.TeamLongName as FavoriteTeamName,
	gs.UnderdogTeamId,
	ut.TeamLongName as UnderdogTeamName,
	g.GameFilterId,
	gf.GameFilterName
	  
  FROM [dbo].[GameResult] gr
  inner join Team wt on gr.WinnerTeamId = wt.TeamId
  inner join GameSpread gs on gr.GameSpreadId = gs.GameSpreadId
  inner join Team ft on gs.FavoriteTeamId = ft.TeamId
  inner join Team ut on gs.UnderdogTeamId = ut.TeamId
  inner join Game g on gs.GameId = g.GameId
  inner join GameFilter gf on g.GameFilterId = gf.GameFilterId
GO


