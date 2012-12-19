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
    public class OverallResultsByGameFilterController : Controller
    {
        protected SelectumContext db = new SelectumContext();
        private List<Log> logMessages = new List<Log>();

        public ActionResult Index()
        {
            string logProcess = "OverallResultsByGameFilterController.Index";

            try
            {
                logMessages.Add(new Log() { GameDateTime = DateTime.Now, Type = "Info", Process = logProcess, Message = "Start" });

                var userResults = db.UserResults.ToList();

                // order by gameFilterId
                var gameFilters = db.GameFilters.OrderBy(gr => gr.GameFilterId).ToList();

                var resultsByGameFilter = BuildResultsByGameFilter(gameFilters, userResults);

                if (resultsByGameFilter.Count > 0)
                {
                    var users = db.Users.ToList();
                    
                    var resultsViewModel = BuildOverallResultsByGameFilter(users, resultsByGameFilter);

                    return View(resultsViewModel);
                }
                else
                {
                    // there were no game results found for this filter
                    throw new ArgumentException(string.Format("There were no user results to process"));
                }
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

        public List<OverallResultByGameFilter> BuildResultsByGameFilter( List<GameFilter> gameFilters, List<UserResult> userResults)
        {
            string logProcess = "OverallResultsByGameFilterController.Index.BuildResultsByGameFilter";
            try
            {
                logMessages.Add(new Log() { GameDateTime = DateTime.Now, Type = "Info", Process = logProcess, Message = "Start" });

                var resultsByGameFilter = new List<OverallResultByGameFilter>();

                // loop through each game filter, adding the user results for that game filter sorted by userid
                foreach (var gameFilter in gameFilters)
                {
                    // make sure it is ordered by userId
                    resultsByGameFilter.Add(new OverallResultByGameFilter(gameFilter, userResults
                                                                                            .Where(ur => ur.GameFilterId == gameFilter.GameFilterId)
                                                                                            .OrderBy(ur => ur.UserId)
                                                                                            .ToList()));
                }
                
                return resultsByGameFilter;
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

        public OverallResultsByGameFilter BuildOverallResultsByGameFilter(List<User> users, List<OverallResultByGameFilter> resultsByGameFilter)
        {
            string logProcess = "OverallResultsByGameFilterController.Index.BuildOverallResultsByGameFilter";
            try
            {
                var resultsViewModel = new OverallResultsByGameFilter();

                // the html is going to blindly put the users data in each game row based on its position in the matrix
                // so we need to make sure the user's in the list exist and are in the same order for every game row.
                // place 0 results for any missing users

                // now check all the userResults for each game filter
                for (int i = 0; i < resultsByGameFilter.Count; i++)
                {
                    logMessages.Add(new Log() { GameDateTime = DateTime.Now, Type = "Info", Process = logProcess, Message = string.Format("Processing GameFilterName:{0}", resultsByGameFilter[i].GameFilter.GameFilterName) });

                    var results = resultsByGameFilter[i];
                    var userResults = resultsByGameFilter[i].UserResults;

                    // first check to see if there are any user results for this gamefilter
                    // if there are not, just add empty ones for each user

                    if (userResults.Count == 0)
                    {
                        string toLog = string.Format("userResults.Count=0 for GameFilterId:{0}", results.GameFilter.GameFilterId);
                        logMessages.Add(new Log() { GameDateTime = DateTime.Now, Type = "Warning", Process = logProcess, Message = toLog });

                        //loop thru each users results, putting in a 0 for each one
                        for (var x = 0; x < users.Count; x++)
                        {
                            // this user does not exist, so add it
                            userResults.Insert(x, new UserResult() { UserId = users[x].UserId, GameFilterId = results.GameFilter.GameFilterId, Bets = 0, Points = 0, Wins = 0 });
                        }
                    }
                    else
                    {

                        // first check to make sure this game filters user results has the same number of users as our main user list
                        // just because the count is the same doesn't mean the exact ones match...this is just a quick fyi check
                        if (users.Count != userResults.Count)
                        {
                            string toLog = string.Format(
                                            "userResults.Count:{0} for GameFilterId:{1} does not match users.Count:{2}",
                                            userResults.Count,
                                            results.GameFilter.GameFilterId,
                                            users.Count);

                            logMessages.Add(new Log() { GameDateTime = DateTime.Now, Type = "Warning", Process = logProcess, Message = toLog });
                        }

                        //now lets find each users results, putting in a 0 when not found
                        //for (var int user in resultsViewModel.Users)
                        for (var x = 0; x < users.Count; x++)
                        {
                            if (userResults[x] == null)
                            {
                                string toLog = string.Format(
                                                "The userResult does not exist for UserId:{0} GameFilterId:{1}",
                                                users[x].UserId,
                                                results.GameFilter.GameFilterId);
                                logMessages.Add(new Log() { GameDateTime = DateTime.Now, Type = "Warning", Process = logProcess, Message = toLog });

                                // this user does not exist, so add it
                                userResults.Insert(i, new UserResult() { UserId = users[x].UserId, GameFilterId = results.GameFilter.GameFilterId, Bets = 0, Points = 0, Wins = 0 });
                            }
                            else if (users[x].UserId != userResults[x].UserId)
                            {
                                string toLog = string.Format(
                                                "The userResult is missing for UserId:{0} GameFilterId:{1}",
                                                users[x].UserId,
                                                results.GameFilter.GameFilterId);
                                logMessages.Add(new Log() { GameDateTime = DateTime.Now, Type = "Warning", Process = logProcess, Message = toLog });

                                // this user does not exist, so add it
                                userResults.Insert(i, new UserResult() { UserId = users[x].UserId, GameFilterId = results.GameFilter.GameFilterId, Bets = 0, Points = 0, Wins = 0 });
                            }
                            else
                            {
                                // do nothing since the userids match
                            }
                        }
                    }

                    // reset the user results just in case the above added in any missing ones
                    resultsByGameFilter[i].UserResults = userResults;
                }

                List<int> totals = new List<int>();
                // lastly calculate a total row
                foreach (var user in users)
                {
                    int total = 0;
                    foreach (var result in resultsByGameFilter)
                    {
                        total += result.UserResults
                                            .Where(ur => ur.UserId == user.UserId)
                                            .Sum(ur => ur.Points);
                    }
                    
                    totals.Add(total);
                }

                // add the users to the view model (this will be column headers on page)
                resultsViewModel.Users = users;
                resultsViewModel.Results = resultsByGameFilter;
                resultsViewModel.Totals = totals;

                return resultsViewModel;
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

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}