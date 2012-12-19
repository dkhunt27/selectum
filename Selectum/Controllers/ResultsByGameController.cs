using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Selectum.Models;
using Selectum.DAL;
using Selectum.ViewModels;

namespace Selectum.Controllers
{
    [Authorize]
    public class ResultsByGameController : BaseGameFilteredController
    {
        //
        // GET: /ResultsByGame/GameFilter/5
        public ActionResult GameFilter(int id = 0)
        {
            try
            {
                int currentGameFilterId = validateGameFilterId(id);
                SetViewBagGameFilter(currentGameFilterId);

                var resultsViewModel = new ResultsByGame();
                var resultsByGame = new List<ResultByGame>();

                var users = db.Users.ToList();

                // add the users to the view model (this will be column headers on page)
                resultsViewModel.Users = users;

                // order game results by game then user
                var userGameResults = db.UserGameResults
                                        .Include(ugr => ugr.UserGameSelection)
                                        .Include(ugr => ugr.UserGameSelection.GameSpread)
                                        .Include(ugr => ugr.UserGameSelection.GameSpread.Game)
                                        .Where(ugr => ugr.UserGameSelection.GameSpread.Game.GameFilterId == currentGameFilterId)
                                        .OrderBy(ugr => ugr.UserGameSelection.GameSpread.GameId)
                                        .ThenBy(ugr => ugr.UserGameSelection.UserId)
                                        .ToList();

                var gameResults = db.GameResults
                    .Include(gr => gr.GameSpread)
                    .Include(gr => gr.GameSpread.Game)
                    .Include(gr => gr.GameSpread.FavoriteTeam)
                    .Include(gr => gr.GameSpread.UnderdogTeam)
                    .Where(gr => gr.GameSpread.Game.GameFilterId == currentGameFilterId)
                    .OrderBy(gr => gr.GameSpread.GameId)
                    .ToList();

                // loop through each game, adding the user game results for that game sorted by userid
                foreach (var gameResult in gameResults)
                {
                    // make sure it is ordered by userId
                    var userGameResultsTemp = userGameResults
                                                .Where(ugr => ugr.UserGameSelection.GameSpread.GameId == gameResult.GameSpread.GameId)
                                                .OrderBy(ugr => ugr.UserGameSelection.UserId)
                                                .ToList();

                    resultsByGame.Add(new ResultByGame(gameResult, userGameResultsTemp));
                }

                if (resultsByGame.Count > 0)
                {
                    // make sure each game has each user in the same order
                    // get the user/game order from the first item
                    var userGameResultsFromFirst = resultsByGame[0].UserGameResults;

                    // now check all the subsequent userGameResults
                    for (int i = 1; i < resultsByGame.Count; i++)
                    {
                        var userGameResultsNext = resultsByGame[i].UserGameResults;

                        if (userGameResultsFromFirst.Count != userGameResultsNext.Count)
                        {
                            throw new ArgumentException(
                                            string.Format(
                                            "The number of users does not match GameId:{0} and GameId:{1}",
                                            resultsByGame[0].GameResult.GameSpread.GameId,
                                            resultsByGame[i].GameResult.GameSpread.GameId));
                        }

                        // now that we know the lengths are equal, make sure each item is in the same 
                        // userid order as the first userGameResult
                        for (int x = 0; x < userGameResultsNext.Count; x++)
                        {
                            if (userGameResultsFromFirst[x].UserGameSelection.UserId !=
                                userGameResultsNext[x].UserGameSelection.UserId)
                            {
                                throw new ArgumentException(
                                                string.Format(
                                                "The users (UserId:{2}, UserId:{3}) in position:{4} do not match for GameId:{0} and GameId:{1}",
                                                resultsByGame[0].GameResult.GameSpread.GameId,
                                                resultsByGame[i].GameResult.GameSpread.GameId,
                                                userGameResultsFromFirst[x].UserGameSelection.UserId,
                                                userGameResultsNext[x].UserGameSelection.UserId,
                                                x));
                            }
                        }
                    }

                    resultsViewModel.Results = resultsByGame;
                    return View(resultsViewModel);
                }
                else
                {
                    // there were no game results found for this filter
                    throw new ArgumentException(string.Format("Missing game results for given GameFilterId:{0}", currentGameFilterId));
                }
            }
            catch (Exception ex)
            {
                return HttpNotFound(ex.Message);
            }
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}