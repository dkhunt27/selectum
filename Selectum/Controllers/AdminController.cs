using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Selectum.Models;
using Selectum.DAL;
using System.Web.Security;
using System.Data.Entity.Infrastructure;
using Selectum.ViewModels;
using System.Configuration;

namespace Selectum.Controllers
{
    [Authorize]
    public class AdminController : BaseGameFilteredController
    {
        private int extraPointFactorPerBetOverMin = Convert.ToInt32(ConfigurationManager.AppSettings["ExtraPointFactorPerBetOverMin"]);
        private List<Log> logMessages = new List<Log>();

        public ActionResult GameFilter(int id)
        {
            int currentGameFilterId = validateGameFilterId(id);
            SetViewBagGameFilter(currentGameFilterId);

            return View();
        }

        public ActionResult GameResultProcessing(int id)
        {
            string logProcess = "AdminController.GameResultProcessing";
            try
            {
                int currentGameFilterId = validateGameFilterId(id);
                SetViewBagGameFilter(currentGameFilterId);

                var users = db.Users.ToList();

                var thisGameFiltersGameResults = db.GameResults
                                                    .Include(gr => gr.GameSpread)
                                                    .Include(gr => gr.GameSpread.FavoriteTeam)
                                                    .Include(gr => gr.GameSpread.UnderdogTeam)
                                                    .Include(gr => gr.GameSpread.Game)
                                                    .Include(gr => gr.WinnerTeam)
                                                    .Where(gr => gr.GameSpread.Game.GameFilterId == currentGameFilterId)
                                                    .ToList();

                var thisGameFiltersUsersGameSelections = db.UserGameSelections
                                                            .Include(ugs => ugs.GameSpread)
                                                            .Include(ugs => ugs.GameSpread.Game)
                                                            .Include(ugs => ugs.User)
                                                            .Include(ugs => ugs.PickTeam)
                                                            .Where(ugs => ugs.GameSpread.Game.GameFilterId == currentGameFilterId)
                                                            .ToList();

                var noBetPickTeam = db.Teams.First(t => t.TeamLongName == "No Bet");

                var userGameResults = BuildUserGameResults(currentGameFilterId, thisGameFiltersGameResults, thisGameFiltersUsersGameSelections, users, noBetPickTeam, extraPointFactorPerBetOverMin);

                //TODO send back a message of how many records processed correctly/incorrectly
                //TODO do not save ones that were not modified
                userGameResults.ForEach(ugr => db.UserGameResults.Add(ugr));
                db.SaveChanges();

                // fetch the latest users game results from the DB
                //var userGameResultsInDB = db.UserGameResults
                //                                .Where(ugr => ugr.UserGameSelection.GameSpread.Game.GameFilterId == currentGameFilterId)
                //                                .ToList();

                var userResults = BuildUserResults(currentGameFilterId, userGameResults, users);

                //TODO send back a message of how many records processed correctly/incorrectly
                //TODO do not save ones that were not modified
                userResults.ForEach(ur => db.UserResults.Add(ur));
                db.SaveChanges();

                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                logMessages.Add(new Log() { GameDateTime = DateTime.Now, Type = "Error", Process = logProcess, Message = ex.Message });
                return HttpNotFound(ex.Message);
            }
            finally
            {
                logMessages.Add(new Log() { GameDateTime = DateTime.Now, Type = "Info", Process = logProcess, Message = "Ending" });

                foreach (var logMessage in logMessages)
                {
                    db.Logs.Add(logMessage);
                }
                //db.SaveChanges();
            }
        }

        public List<UserGameResult> BuildUserGameResults(int gameFilterId, List<GameResult> thisGameFiltersGameResults, List<UserGameSelection> thisGameFiltersUsersGameSelections, List<User> users, Team noBetPickTeam, int extraPointFactorPerBetOverMin)
        {
            string logProcess = "AdminController.GameResultProcessing.BuildUserGameResults";
            try
            {
                var userGameResults = new List<UserGameResult>();

                foreach (var user in users)
                {
                    var thisUsersGameSelectionsForThisGameFilter = thisGameFiltersUsersGameSelections.Where(ugs => ugs.UserId == user.UserId).ToList();

                    var userGameResult = CalculateUserGameResults(user.UserId, gameFilterId, thisGameFiltersGameResults, thisUsersGameSelectionsForThisGameFilter, noBetPickTeam, extraPointFactorPerBetOverMin);
                    userGameResults.AddRange(userGameResult);
                }

                return userGameResults;
            }
            catch (Exception ex)
            {
                logMessages.Add(new Log() { GameDateTime = DateTime.Now, Type = "Error", Process = logProcess, Message = ex.Message });
                throw;
            }
            finally
            {
                logMessages.Add(new Log() { GameDateTime = DateTime.Now, Type = "Info", Process = logProcess, Message = "Ending" });
            }
        }

        public List<UserGameResult> CalculateUserGameResults(int userId, int gameFilterId, List<GameResult> thisGameFiltersGameResults, List<UserGameSelection> thisUsersGameSelectionsForThisGameFilter, Team noBetPickTeam, int extraPointFactorPerBetOverMin)
        {
            string logProcess = "AdminController.GameResultProcessing.BuildUserGameResults.CalculateUserGameResults";
            try
            {
                var userGameResults = new List<UserGameResult>();

                var wrongGameFilterIdCount = thisGameFiltersGameResults
                                                    .Where(gr => gr.GameSpread.Game.GameFilterId != gameFilterId)
                                                    .Count();

                if (wrongGameFilterIdCount > 0)
                {
                    throw new ArgumentException(string.Format("The game result list has records for the wrong game filter ({0})", wrongGameFilterIdCount));
                }

                var wrongUserIdCount = thisUsersGameSelectionsForThisGameFilter
                                .Where(ugs => ugs.UserId != userId)
                                .Count();

                wrongGameFilterIdCount = thisUsersGameSelectionsForThisGameFilter
                                                    .Where(ugs => ugs.GameSpread.Game.GameFilterId != gameFilterId)
                                                    .Count();

                if (wrongUserIdCount > 0 || wrongGameFilterIdCount > 0)
                {
                    throw new ArgumentException(string.Format("The user game selection list has records for the wrong user ({0}) and/or game filter ({1})", wrongUserIdCount, wrongGameFilterIdCount));
                }

                // loop through each game to see if user was correct or not
                foreach (var gameResult in thisGameFiltersGameResults)
                {
                    var userGameSelection = thisUsersGameSelectionsForThisGameFilter.FirstOrDefault(ugs => ugs.GameSpreadId == gameResult.GameSpreadId);

                    if (userGameSelection == null)
                    {
                        string toLog = string.Format("UserId:{0} is missing a selection for GameSpreadId:{1}", userId, gameResult.GameSpreadId);
                        logMessages.Add(new Log() { GameDateTime = DateTime.Now, Type = "Warning", Process = logProcess, Message = toLog });

                        // create a no bet usergameselection
                        userGameSelection = new UserGameSelection() { UserId = userId, GameSpreadId = gameResult.GameSpreadId, PickTeamId = noBetPickTeam.TeamId, Bet = 0 };

                        //TODO see if no UserGameSelectionId will cause error on save
                        userGameResults.Add(new UserGameResult()
                        {
                            //UserGameSelectionId = userGameSelection.UserGameSelectionId,
                            UserGameSelection = userGameSelection,
                            BetResult = 0,  // no result since it is a no bet
                            BetPoints = 0   // no points since it is a no bet
                        });
                    }
                    else
                    {
                        if (userGameSelection.PickTeamId == noBetPickTeam.TeamId)
                        {
                            //user didn't bet, he picked no bet
                            userGameResults.Add(new UserGameResult()
                            {
                                UserGameSelectionId = userGameSelection.UserGameSelectionId,
                                UserGameSelection = userGameSelection,
                                BetResult = 0,  // no result since it is a no bet
                                BetPoints = 0   // no points since it is a no bet
                            });
                        }
                        else
                        {
                            //user picked a team, betted on this game
                            //determine if they won the bet
                            var result = userGameSelection.PickTeamId == gameResult.WinnerTeamId;
                            var underdog = userGameSelection.PickTeamId == gameResult.GameSpread.UnderdogTeamId;

                            var betPoints = 0;

                            if (underdog && result)
                            {   // only if picked the underdog and won, do you get the extra points
                                betPoints = userGameSelection.Bet * extraPointFactorPerBetOverMin;
                            }
                            else
                            {
                                betPoints = userGameSelection.Bet;
                            }

                            if (result)
                            {
                                //won the bet
                                userGameResults.Add(new UserGameResult()
                                {
                                    UserGameSelectionId = userGameSelection.UserGameSelectionId,
                                    UserGameSelection = userGameSelection,
                                    BetResult = 1,  // bet was won
                                    BetPoints = betPoints
                                });
                            }
                            else
                            {
                                //lost the bet
                                userGameResults.Add(new UserGameResult()
                                {
                                    UserGameSelectionId = userGameSelection.UserGameSelectionId,
                                    UserGameSelection = userGameSelection,
                                    BetResult = -1,  // bet was won
                                    BetPoints = betPoints * -1
                                });
                            }
                        }
                    }
                }

                return userGameResults;
            }
            catch (Exception ex)
            {
                logMessages.Add(new Log() { GameDateTime = DateTime.Now, Type = "Error", Process = logProcess, Message = ex.Message });
                throw;
            }
            finally
            {
                logMessages.Add(new Log() { GameDateTime = DateTime.Now, Type = "Info", Process = logProcess, Message = "Ending" });
            }
        }

        public List<UserResult> BuildUserResults(int gameFilterId, List<UserGameResult> thisGameFiltersUserGameResults, List<User> users)
        {
            string logProcess = "AdminController.GameResultProcessing.BuildUserResults";
            try
            {
                var userResults = new List<UserResult>();

                foreach (var user in users)
                {
                    var thisUsersGameResultsForThisGameFilter = thisGameFiltersUserGameResults.Where(ugr => ugr.UserGameSelection.UserId == user.UserId).ToList();

                    var userResult = CalculateUserResults(user.UserId, gameFilterId, thisUsersGameResultsForThisGameFilter);
                    userResults.Add(userResult);
                }

                return userResults;
            }
            catch (Exception ex)
            {
                logMessages.Add(new Log() { GameDateTime = DateTime.Now, Type = "Error", Process = logProcess, Message = ex.Message });
                throw;
            }
            finally
            {
                logMessages.Add(new Log() { GameDateTime = DateTime.Now, Type = "Info", Process = logProcess, Message = "Ending" });
            }
        }

        public UserResult CalculateUserResults(int userId, int gameFilterId, List<UserGameResult> thisUsersGameResultsForThisGameFilter)
        {
            string logProcess = "AdminController.GameResultProcessing.BuildUserResults.CalculateUserResults";
            try
            {
                var bets = 0;
                var wins = 0;
                var points = 0;

                var wrongUserIdCount = thisUsersGameResultsForThisGameFilter
                                            .Where(ugr => ugr.UserGameSelection.UserId != userId)
                                            .Count();

                var wrongGameFilterIdCount = thisUsersGameResultsForThisGameFilter
                                                    .Where(ugr => ugr.UserGameSelection.GameSpread.Game.GameFilterId != gameFilterId)
                                                    .Count();

                if (wrongUserIdCount > 0 || wrongGameFilterIdCount > 0)
                {
                    throw new ArgumentException(string.Format("The user game result list has records for the wrong user ({0}) and/or game filter ({1})", wrongUserIdCount, wrongGameFilterIdCount));
                }

                // just as a double check, restrict the list to this user and gameFilter
                bets = thisUsersGameResultsForThisGameFilter
                            .Where(ugr => ugr.BetResult == 1 || ugr.BetResult == -1)
                            .Count();
                wins = thisUsersGameResultsForThisGameFilter
                            .Where(ugr => ugr.BetResult == 1)
                            .Count();
                points = thisUsersGameResultsForThisGameFilter
                            .Sum(ugr => ugr.BetPoints);

                var userResult = new UserResult()
                                        {
                                            Bets = bets,
                                            GameFilterId = gameFilterId,
                                            Points = points,
                                            UserId = userId,
                                            Wins = wins
                                        };

                return userResult;
            }
            catch (Exception ex)
            {
                logMessages.Add(new Log() { GameDateTime = DateTime.Now, Type = "Error", Process = logProcess, Message = ex.Message });
                throw;
            }
            finally
            {
                logMessages.Add(new Log() { GameDateTime = DateTime.Now, Type = "Info", Process = logProcess, Message = "Ending" });
            }
        }
    }
}
