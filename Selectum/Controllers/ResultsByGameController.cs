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
    [Authorize(Roles = "User")]
    public class ResultsByGameController : BaseGameFilteredController
    {
        public ActionResult GameFilter(int id = 0)
        {
            var vm = new ResultsByGameViewModel(id);
            string viewBagMessageToUser = string.Empty;

            try
            {            
                var userId = GetUserIdentityId();
                int currentGameFilterId = validateGameFilterId(id);
                SetViewBagGameFilter(currentGameFilterId);

                // get this users game selections for this game filter
                var thisUsersGameSelections = db.UserGameSelections
                                                .Where(_ => _.UserId == userId && _.GameSpread.Game.GameFilterId == currentGameFilterId)
                                                .ToList();

                // check to make sure he has saved/submitted his user selections
                if (thisUsersGameSelections == null || thisUsersGameSelections.Count == 0)
                {
                    viewBagMessageToUser = "Sorry.  You cannot view the results until you have submitted your selections.";
                }
                else
                {
                    //check to make sure all the games are saved
                    bool gamesSaved = true;

                    foreach (var userGameSelection in thisUsersGameSelections)
                    {
                        // if anyone saved is false, then it will be false
                        gamesSaved = gamesSaved || userGameSelection.Saved;
                    }

                    if (!gamesSaved)
                    {
                        viewBagMessageToUser = "Sorry.  You cannot view the results until you have submitted ALL your selections.";
                    }
                    else
                    {
                        var users = db.Users.OrderBy(u => u.UserId).ToList();

                        var gameSpreads = db.GameSpreads
                                                .Where(_ => _.Game.GameFilterId == currentGameFilterId)
                                                .OrderBy(_ => _.GameId)
                                                .ToList();

                        var gameResults = db.GameResults
                                            .Include(gr => gr.GameSpread)
                                            .Include(gr => gr.GameSpread.Game)
                                            .Include(gr => gr.GameSpread.FavoriteTeam)
                                            .Include(gr => gr.GameSpread.UnderdogTeam)
                                            .Where(gr => gr.GameSpread.Game.GameFilterId == currentGameFilterId)
                                            .OrderBy(gr => gr.GameSpread.GameId)
                                            .ToList();

                        var userGameSelections = db.UserGameSelections
                                                .Include(ugr => ugr.GameSpread)
                                                .Include(ugr => ugr.GameSpread.Game)
                                                .Where(ugr => ugr.GameSpread.Game.GameFilterId == currentGameFilterId)
                                                .OrderBy(ugr => ugr.GameSpread.GameId)
                                                .ThenBy(ugr => ugr.UserId)
                                                .ToList();

                        var userGameResults = db.UserGameResults
                                                .Include(ugr => ugr.UserGameSelection)
                                                .Include(ugr => ugr.UserGameSelection.GameSpread)
                                                .Include(ugr => ugr.UserGameSelection.GameSpread.Game)
                                                .Where(ugr => ugr.UserGameSelection.GameSpread.Game.GameFilterId == currentGameFilterId)
                                                .OrderBy(ugr => ugr.UserGameSelection.GameSpread.GameId)
                                                .ThenBy(ugr => ugr.UserGameSelection.UserId)
                                                .ToList();

                        var noBetTeam = db.Teams.FirstOrDefault(_ => _.TeamLongName == "No Bet");

                        if (noBetTeam == null)
                        {
                            throw new ArgumentException("No Bet team was not found");
                        }

                        var noWinnerTeam = db.Teams.FirstOrDefault(_ => _.TeamLongName == "No Winner");

                        if (noWinnerTeam == null)
                        {
                            throw new ArgumentException("No Winner team was not found");
                        }

                        var noPicksTeam = db.Teams.FirstOrDefault(_ => _.TeamLongName == "No Picks");

                        if (noPicksTeam == null)
                        {
                            throw new ArgumentException("No Picks team was not found");
                        }

                        vm = BuildResultsByGameViewModel(currentGameFilterId, ref viewBagMessageToUser, users, gameSpreads, gameResults, userGameSelections, userGameResults, noBetTeam, noPicksTeam, noWinnerTeam);
                    }
                }

                ViewBag.MessageToUser = viewBagMessageToUser;
            }
            catch (Exception ex)
            {
                ViewBag.MessageToUser = string.Format("Sorry an error occurred. Please let the admin know. Error:{0}", ex.Message);
            }

            return View(vm);
        }

        public ResultsByGameViewModel BuildResultsByGameViewModel(int currentGameFilterId, ref string viewBagMessageToUser, List<User> users, List<GameSpread> gameSpreads, List<GameResult> gameResults, List<UserGameSelection> userGameSelections, List<UserGameResult> userGameResults, Team noBetTeam, Team noPicksTeam, Team noWinnerTeam)
        {
            #region validate inputs
            if (users == null) throw new ArgumentNullException("users");
            if (gameSpreads == null) throw new ArgumentNullException("gameSpreads");
            if (gameResults == null) throw new ArgumentNullException("gameResults");
            if (userGameSelections == null) throw new ArgumentNullException("userGameSelections");
            if (userGameResults == null) throw new ArgumentNullException("userGameResults");
            if (noBetTeam == null) throw new ArgumentException("No Bet team was not found");
            if (noPicksTeam == null) throw new ArgumentException("No Picks team was not found");
            if (noWinnerTeam == null) throw new ArgumentException("No Winner team was not found");

            // make sure all lists are for this gameFilterId
            var gameSpreadsBad = gameSpreads.FirstOrDefault(_ => _.Game.GameFilterId != currentGameFilterId);
            if (gameSpreadsBad != null) throw new ArgumentOutOfRangeException("gameSpreadsBad", "Contains records from an incorrect GameFilterId");

            var gameResultsBad = gameResults.FirstOrDefault(_ => _.GameSpread.Game.GameFilterId != currentGameFilterId);
            if (gameResultsBad != null) throw new ArgumentOutOfRangeException("gameResultsBad", "Contains records from an incorrect GameFilterId");

            var userGameSelectionsBad = userGameSelections.FirstOrDefault(_ => _.GameSpread.Game.GameFilterId != currentGameFilterId);
            if (userGameSelectionsBad != null) throw new ArgumentOutOfRangeException("userGameSelectionsBad", "Contains records from an incorrect GameFilterId");

            var userGameResultsBad = userGameResults.FirstOrDefault(_ => _.UserGameSelection.GameSpread.Game.GameFilterId != currentGameFilterId);
            if (userGameResultsBad != null) throw new ArgumentOutOfRangeException("userGameResultsBad", "Contains records from an incorrect GameFilterId");

            // make sure the lists are sorted correctly
            users = users.OrderBy(_ => _.UserId).ToList();
            gameSpreads = gameSpreads.OrderBy(_ => _.GameId).ToList();
            gameResults = gameResults.OrderBy(_ => _.GameSpread.GameId).ToList();
            userGameSelections = userGameSelections.OrderBy(_ => _.GameSpread.GameId).ThenBy(_ => _.UserId).ToList();
            userGameResults = userGameResults.OrderBy(_ => _.UserGameSelection.GameSpread.GameId).ThenBy(_ => _.UserGameSelection.UserId).ToList();
            #endregion

            var utilities = new ModelUtilities();
            var vm = new ResultsByGameViewModel(currentGameFilterId);
            vm.Users = users;                                                       // add the users to the view model (this will be column headers on page)

            // loop through each game, creating the initial game row record
            foreach (var gameSpread in gameSpreads)
            {
                vm.GameRows.Add(new ResultsByGameGameRow(gameSpread, noWinnerTeam));
            }

            // now that the gamerows have been created, now lets update them with game results...if they exist
            foreach (var gameResult in gameResults)
            {
                var gameRow = vm.GameRows.FirstOrDefault(_ => _.GameSpreadId == gameResult.GameSpreadId);

                if (gameRow == null)
                {
                    throw new ArgumentException(string.Format("gameRow was not found for gameResult.GameSpreadId ({0})",gameResult.GameSpreadId));
                }
                else
                {
                    gameRow.UpdateWinner(gameResult);
                }
            }

            // need to add the user game selections in the correct order of each row (GameRows) and in the order of each column (Users)
            // loop through each gameRow and then...
            foreach (var gameRow in vm.GameRows)
            {
                // ...loop through each user and then...
                foreach (var user in users)
                {
                    // check to see if this user has made user selections already
                    var userGameSelection = userGameSelections.FirstOrDefault(_ => _.UserId == user.UserId && _.GameSpreadId == gameRow.GameSpreadId);
                    if (userGameSelection == null)
                    {
                        var gameSpread = gameSpreads.FirstOrDefault(_=>_.GameSpreadId == gameRow.GameSpreadId);

                        // the user hasn't made any selections yet...so create the default ones for that user
                        userGameSelection = utilities.CreateDefaultUserGameSelection(gameSpread, user, noBetTeam);
                    }

                    gameRow.AddUserDataSelection(userGameSelection, noBetTeam, noPicksTeam);
                }
            }

            // update any user game results if they exist
            foreach (var userGameResult in userGameResults)
            {
                var gameRow = vm.GameRows.FirstOrDefault(_ => _.GameSpreadId == userGameResult.UserGameSelection.GameSpreadId);

                if (gameRow == null)
                {
                    throw new ArgumentException(string.Format("gameRow was not found for userGameResult.UserGameSelection.GameSpreadId ({0})", userGameResult.UserGameSelection.GameSpreadId));
                }
                else
                {
                    var userData = gameRow.UsersData.FirstOrDefault(_ => _.UserGameSelectionId == userGameResult.UserGameSelectionId && _.UserId == userGameResult.UserGameSelection.UserId);
                    userData.UpdateResult(userGameResult);
                }
            }

            if (vm.GameRows.Count > 0)
            {
                // make sure each game has each user data in the same order
                // get the user order from the first item
                var userDataFirst = vm.GameRows[0].UsersData;

                // now check all the subsequent userGameResults
                for (int i = 1; i < vm.GameRows.Count; i++)
                {
                    var userDataNext = vm.GameRows[i].UsersData;

                    if (userDataFirst.Count != userDataNext.Count)
                    {
                        throw new ArgumentException(
                                        string.Format(
                                        "The number of users does not match GameSpreadId:{0} and GameSpreadId:{1} for UsersData",
                                        vm.GameRows[0].GameSpreadId,
                                        vm.GameRows[i].GameSpreadId));
                    }

                    // now that we know the lengths are equal, make sure each item is in the same 
                    // userid order as the first 
                    for (int x = 0; x < userDataNext.Count; x++)
                    {
                        if (userDataFirst[x].UserId != userDataNext[x].UserId)
                        {
                            throw new ArgumentException(
                                            string.Format(
                                            "The users (UserId:{2}, UserId:{3}) in position:{4} do not match for GameSpreadId:{0} and GameSpreadId:{1} for UsersData",
                                            vm.GameRows[0].GameSpreadId,
                                            vm.GameRows[i].GameSpreadId,
                                            userDataFirst[x].UserId,
                                            userDataNext[x].UserId,
                                            x));
                        }
                    }
                }


                // TODO Move this logic inside view model
                List<int> totals = new List<int>();
                List<int> gains = new List<int>();
                List<int> losses = new List<int>();

                // calculate totals
                foreach (var user in users)
                {
                    int total = 0;
                    int gain = 0;
                    int loss = 0;
                    foreach (var gameRow in vm.GameRows)
                    {
                        total += gameRow.UsersData
                                            .Where(_ => _.UserId == user.UserId)
                                            .Sum(_ => _.Result);

                        gain += gameRow.UsersData
                                            .Where(_ => _.UserId == user.UserId)
                                            .Sum(_ => _.PotentialGain);

                        loss += gameRow.UsersData
                                            .Where(_ => _.UserId == user.UserId)
                                            .Sum(_ => _.PotentialLoss);
                    }

                    totals.Add(total);
                    gains.Add(gain);
                    losses.Add(loss);
                }

                vm.Totals = totals;
                vm.PotentialGains = gains;
                vm.PotentialLosses = losses;
            }
            else
            {
                viewBagMessageToUser = string.Format("Missing games for given GameFilterId:{0}", currentGameFilterId);
            }

            return vm;
        }

        public ResultsByGame BuildResultsByGame(int currentGameFilterId, int userId, ref string viewBagMessageToUser)
        {
            var resultsViewModel = new ResultsByGame();
            var resultsByGame = new List<ResultByGame>();

            // get this users game selections for this game filter
            var thisUsersGameSelections = db.UserGameSelections
                                            .Where(_ => _.UserId == userId && _.GameSpread.Game.GameFilterId == currentGameFilterId)
                                            .ToList();

            // check to make sure he has saved/submitted his user selections
            if (thisUsersGameSelections == null || thisUsersGameSelections.Count == 0)
            {
                viewBagMessageToUser = "Sorry.  You cannot view the results until you have submitted your selections.";
            }
            else
            {
                //check to make sure all the games are saved
                bool gamesSaved = true;

                foreach (var userGameSelection in thisUsersGameSelections)
                {
                    // if anyone saved is false, then it will be false
                    gamesSaved = gamesSaved || userGameSelection.Saved;
                }

                if (!gamesSaved)
                {
                    viewBagMessageToUser = "Sorry.  You cannot view the results until you have submitted your selections.";
                }
                else
                {
                    var users = db.Users.OrderBy(u => u.UserId).ToList();

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

                    // order game results by game then user
                    var userGameSelections = db.UserGameSelections
                                            .Include(ugr => ugr.GameSpread)
                                            .Include(ugr => ugr.GameSpread.Game)
                                            .Where(ugr => ugr.GameSpread.Game.GameFilterId == currentGameFilterId)
                                            .OrderBy(ugr => ugr.GameSpread.GameId)
                                            .ThenBy(ugr => ugr.UserId)
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

                        /*  TODO insert missing users data
                        for (int i = 0; i <users.Count; i++)
                        {
                            // if the user game results do not exist, insert dummy one
                            if (userGameResultsTemp[i] == null)
                            {
                                //doesn't exist, so insert one
                                userGameResultsTemp.Insert(i, new UserGameResult(){ 
                            }
                        }
                        */

                        var userGameSelectionsTemp = userGameSelections
                                                        .Where(ugr => ugr.GameSpread.GameId == gameResult.GameSpread.GameId)
                                                        .OrderBy(ugr => ugr.UserId)
                                                        .ToList();

                        resultsByGame.Add(new ResultByGame(gameResult, userGameResultsTemp, userGameSelectionsTemp));
                    }

                    if (resultsByGame.Count > 0)
                    {
                        // make sure each game has each user in the same order
                        // get the user/game order from the first item
                        var userGameResultsFromFirst = resultsByGame[0].UserGameResults;
                        var userGameSelectionsFromFirst = resultsByGame[0].UserGameSelections;

                        // now check all the subsequent userGameResults
                        for (int i = 1; i < resultsByGame.Count; i++)
                        {
                            var userGameResultsNext = resultsByGame[i].UserGameResults;
                            var userGameSelectionsNext = resultsByGame[i].UserGameSelections;

                            if (userGameResultsFromFirst.Count != userGameResultsNext.Count)
                            {
                                throw new ArgumentException(
                                                string.Format(
                                                "The number of users does not match GameId:{0} and GameId:{1} for UserGameResults",
                                                resultsByGame[0].GameResult.GameSpread.GameId,
                                                resultsByGame[i].GameResult.GameSpread.GameId));
                            }

                            if (userGameSelectionsFromFirst.Count != userGameSelectionsNext.Count)
                            {
                                throw new ArgumentException(
                                                string.Format(
                                                "The number of users does not match GameId:{0} and GameId:{1} for UserGameSelections",
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
                                                    "The users (UserId:{2}, UserId:{3}) in position:{4} do not match for GameId:{0} and GameId:{1} for UserGameResults",
                                                    resultsByGame[0].GameResult.GameSpread.GameId,
                                                    resultsByGame[i].GameResult.GameSpread.GameId,
                                                    userGameResultsFromFirst[x].UserGameSelection.UserId,
                                                    userGameResultsNext[x].UserGameSelection.UserId,
                                                    x));
                                }
                            }

                            for (int x = 0; x < userGameSelectionsNext.Count; x++)
                            {
                                if (userGameSelectionsFromFirst[x].UserId !=
                                    userGameSelectionsNext[x].UserId)
                                {
                                    throw new ArgumentException(
                                                    string.Format(
                                                    "The users (UserId:{2}, UserId:{3}) in position:{4} do not match for GameId:{0} and GameId:{1} for UserGameSelection",
                                                    resultsByGame[0].GameResult.GameSpread.GameId,
                                                    resultsByGame[i].GameResult.GameSpread.GameId,
                                                    userGameSelectionsFromFirst[x].UserId,
                                                    userGameSelectionsNext[x].UserId,
                                                    x));
                                }
                            }
                        }

                        List<int> totals = new List<int>();
                        // lastly calculate a total row
                        foreach (var user in users)
                        {
                            int total = 0;
                            foreach (var result in resultsByGame)
                            {
                                total += result.UserGameResults
                                                    .Where(ur => ur.UserGameSelection.UserId == user.UserId)
                                                    .Sum(ur => ur.BetPoints);
                            }

                            totals.Add(total);
                        }

                        viewBagMessageToUser = string.Format("Until all users have submitted their data, your data might be shifted over to the left (under the wrong user's name)");

                        resultsViewModel.Results = resultsByGame;
                        resultsViewModel.Totals = totals;
                    }
                    else
                    {
                        // there were no game results found for this filter
                        //throw new ArgumentException(string.Format("Missing game results for given GameFilterId:{0}", currentGameFilterId));

                        viewBagMessageToUser = string.Format("Missing game results for given GameFilterId:{0}", currentGameFilterId);
                    }
                }
            }

            return resultsViewModel;
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}