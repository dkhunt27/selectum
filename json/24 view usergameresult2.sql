create view UserGameResult2 as
select 
	ugr.UserGameResultId,
	ugr.UserGameSelectionId,
	ugr.BetResult,
	ugr.BetPoints,
	ugs.UserId,
	ugs.UserName,
	ugs.GameSpreadId,
	ugs.FavoriteTeamId,
	ugs.FavoriteTeamLongName,
	ugs.UnderdogTeamId,
	ugs.UnderdogTeamLongName,
	ugs.Spread,
	ugs.GameId,
	ugs.GameFilterId,
	ugs.GameDateTime,
	ugs.PickTeamId,
	ugs.PickTeamLongName,
	ugs.Bet,
	ugs.Saved
from 
	usergameresult ugr
	inner join usergameselection2 ugs on ugr.usergameselectionid = ugs.usergameselectionid

	


