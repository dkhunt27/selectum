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
    public class ResultsByUserController : BaseGameFilteredController
    {
        //
        // GET: /ResultsByUser/GameFilter/5
        public ActionResult GameFilter(int id = 0)
        {
            try
            {
                int currentGameFilterId = validateGameFilterId(id);
                SetViewBagGameFilter(currentGameFilterId);

                var resultsViewModel = new ResultsByUser();
                var resultsByUser = new List<ResultByUser>();

                var gameResults = db.GameResults
                                    .Include(gr => gr.GameSpread)
                                    .Include(gr => gr.GameSpread.Game)
                                    .Include(gr => gr.GameSpread.FavoriteTeam)
                                    .Include(gr => gr.GameSpread.UnderdogTeam)
                                    .Where(gr => gr.GameSpread.Game.GameFilterId == currentGameFilterId)
                                    .OrderBy(gr => gr.GameSpread.GameId)
                                    .ToList();

                // add the game results to the view model (this will be column headers on page)
                resultsViewModel.GameResults = gameResults;

                // order game results by user then game
                var userGameResults = db.UserGameResults
                                        .Include(ugr => ugr.UserGameSelection)
                                        .Include(ugr => ugr.UserGameSelection.GameSpread)
                                        .Include(ugr => ugr.UserGameSelection.GameSpread.Game)
                                        .Where(ugr => ugr.UserGameSelection.GameSpread.Game.GameFilterId == currentGameFilterId)
                                        .OrderBy(ugr => ugr.UserGameSelection.UserId)
                                        .ThenBy(ugr => ugr.UserGameSelection.GameSpread.GameId)
                                        .ToList();

                var users = db.Users.ToList();

                // loop through each user, adding the user game results for that game sorted by gameid
                foreach (var user in users)
                {
                    // make sure it is ordered by gameId
                    var userGameResultsTemp = userGameResults
                                                    .Where(x => x.UserGameSelection.UserId == user.UserId)
                                                    .OrderBy(ugr => ugr.UserGameSelection.GameSpread.GameId)
                                                    .ToList();

                    resultsByUser.Add(new ResultByUser(user, userGameResultsTemp));
                }

                if (resultsByUser.Count > 0)
                {
                    // make sure each user has each game in the same order
                    // get the user/game order from the first item
                    var userGameResultsFromFirst = resultsByUser[0].UserGameResults;

                    // now check all the subsequent userGameResults
                    for (int i = 1; i < resultsByUser.Count; i++)
                    {
                        var userGameResultsNext = resultsByUser[i].UserGameResults;

                        if (userGameResultsFromFirst.Count != userGameResultsNext.Count)
                        {
                            throw new ArgumentException(
                                            string.Format(
                                            "The number of games does not match UserId:{0} and UserId:{1}",
                                            resultsByUser[0].User.UserId,
                                            resultsByUser[i].User.UserId));
                        }

                        // now that we know the lengths are equal, make sure each item is in the same 
                        // gameid order as the first userGameResult
                        for (int x = 0; x < userGameResultsNext.Count; x++)
                        {
                            if (userGameResultsFromFirst[x].UserGameSelection.GameSpread.GameId !=
                                userGameResultsNext[x].UserGameSelection.GameSpread.GameId)
                            {
                                throw new ArgumentException(
                                                string.Format(
                                                "The games (GameId:{2}, GameId:{3}) in position:{4} do not match for UserId:{0} and UserId:{1}",
                                                resultsByUser[0].User.UserId,
                                                resultsByUser[i].User.UserId,
                                                userGameResultsFromFirst[x].UserGameSelection.GameSpread.GameId,
                                                userGameResultsNext[x].UserGameSelection.GameSpread.GameId,
                                                x));
                            }
                        }
                    }

                    resultsViewModel.Results = resultsByUser;
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