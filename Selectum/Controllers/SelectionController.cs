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
using WebMatrix.WebData;

namespace Selectum.Controllers
{
    [Authorize(Roles = "User")]
    public class SelectionController : BaseGameFilteredController
    {
        public ActionResult GameFilter(int id = 0)
        {
            try
            {
                int currentGameFilterId = validateGameFilterId(id);
                SetViewBagGameFilter(currentGameFilterId);

                bool selectionDisabledForThisGameFilter = !db.GameFilters.FirstOrDefault(gf => gf.GameFilterId == currentGameFilterId).GameFilterEnabled;

                var utilities = new ModelUtilities();

                var userId = GetUserIdentityId();


                var userGameSelections = db.UserGameSelections
                                                .Include(ugs => ugs.GameSpread)
                                                .Include(t => t.PickTeam)
                                                .Include(g => g.GameSpread.FavoriteTeam)
                                                .Include(g => g.GameSpread.UnderdogTeam)
                                                .Include(g => g.GameSpread.Game)
                                                .Include(u => u.User)
                                                .Where(u => u.UserId == userId)
                                                .Where(ugs => ugs.GameSpread.Game.GameFilterId == currentGameFilterId)
                                                .ToList();


                if (userGameSelections.Count == 0)
                {
                    var gameSpreads = db.GameSpreads
                                            .Where(_ => _.Game.GameFilterId == currentGameFilterId)
                                            .OrderBy(_ => _.GameId)
                                            .ToList();

                    var user = db.Users.FirstOrDefault(_=>_.UserId == userId);

                    var noBetTeam = db.Teams.FirstOrDefault(_ => _.TeamLongName == "No Bet");

                    userGameSelections = utilities.CreateDefaultUserGameSelections(gameSpreads, user, noBetTeam);

                    // save to the db so the output has unique row numbers (it uses UserGameSelectionId)
                    userGameSelections.ForEach(ugs => db.UserGameSelections.Add(ugs));
                    db.SaveChanges();
                }

                var selection = new Selection();

                //selection.UserGameSelections = userGameSelections;
                selection.PlacedBets = utilities.GetPlacedBets(userGameSelections);
                selection.BonusPoints = utilities.GetBonusPoints(userGameSelections,
                                                                         selection.MinSpentPointsForAnyOneWeek,
                                                                         selection.ExtraPointFactorPerBetOverMin);
                selection.SpentPoints = utilities.GetSpentPoints(userGameSelections);
                selection.PossibleBets = utilities.GetPossibleBets(userGameSelections);
                selection.SelectionDisabledForThisGameFilter = selectionDisabledForThisGameFilter;
                selection.GameRowsHaveBeenSaved = userGameSelections.Where(ugs => ugs.Saved == false).Count() == 0;  // all records are false, meaning all have been saved

                var gameRows = new List<SelectionGameRow>();

                foreach (var ugs in userGameSelections)
                {
                    var gameRow = new SelectionGameRow();
                    /*gameRow.Bet = ugs.Bet;
                    gameRow.GameSpread = ugs.GameSpread;
                    gameRow.GameSpreadId = ugs.GameSpreadId;
                    gameRow.PickTeam = ugs.PickTeam;
                    gameRow.PickTeamId = ugs.PickTeamId;
                    gameRow.Saved = ugs.Saved;
                    gameRow.User = ugs.User;
                    gameRow.UserGameSelectionId = ugs.UserGameSelectionId;
                    gameRow.UserId = ugs.UserId;*/

                    if (ugs.GameSpread.Game.HomeTeam == 1)
                    {
                        if (ugs.GameSpread.UnderdogTeam.TeamId == ugs.GameSpread.Game.Team1.TeamId)
                        {
                            ugs.GameSpread.UnderdogTeam.TeamLongName = string.Concat("@" + ugs.GameSpread.UnderdogTeam.TeamLongName);
                        }
                        else
                        {
                            ugs.GameSpread.FavoriteTeam.TeamLongName = string.Concat("@" + ugs.GameSpread.FavoriteTeam.TeamLongName);
                        }
                    }
                    else
                    {
                        if (ugs.GameSpread.UnderdogTeam.TeamId == ugs.GameSpread.Game.Team2.TeamId)
                        {
                            ugs.GameSpread.UnderdogTeam.TeamLongName = string.Concat("@" + ugs.GameSpread.UnderdogTeam.TeamLongName);
                        }
                        else
                        {
                            ugs.GameSpread.FavoriteTeam.TeamLongName = string.Concat("@" + ugs.GameSpread.FavoriteTeam.TeamLongName);
                        }
                    }
                    gameRow.UserGameSelection = ugs;

                    var betPickers = new List<BetPicker>();

                    for (int i = 0; i < selection.MaxBetForAnyOneGame; i++)
                    {
                        var betPicker = new BetPicker();
                        var berPickerValue = i + 1;
                        if (ugs.Bet == 0)
                        {
                            betPicker.Disabled = true;
                        }
                        else
                        {
                            betPicker.Disabled = selection.SelectionDisabledForThisGameFilter || ugs.Saved;
                        }
                        betPicker.Toggled = berPickerValue == ugs.Bet;
                        betPicker.BetValue = berPickerValue;

                        betPickers.Add(betPicker);
                    }

                    gameRow.BetPickers.AddRange(betPickers);
                    gameRows.Add(gameRow);
                }

                selection.GameRows = gameRows;


                // validation rules

                if (userGameSelections == null || userGameSelections.Count == 0)
                {
                    //throw new ArgumentException(string.Format("Missing user game selections for given GameFilterId:{0}", currentGameFilterId));
                    ViewBag.MessageToUser = string.Format("Missing user game selections for given GameFilterId:{0}", currentGameFilterId);
                }

                return View(selection);
            }
            catch (Exception ex)
            {
                return HttpNotFound(ex.Message);
            }
        }

        [HttpPost]
        public JsonResult Save(Selection selection)
        {
            var saveCount = 0;
            if (ModelState.IsValid)
            {
                // make sure they spent the correct amount
                if (selection.SpentPoints >= selection.MinSpentPointsForAnyOneWeek)
                {
                    // make sure they spent all their bonus points
                    if (selection.BonusPoints == 0)
                    {
                        // server side validations
                        foreach (var gameRow in selection.GameRows)
                        {
                            var ugs = gameRow.UserGameSelection;

                            // make sure the picked team is correct
                            if (ugs.PickTeamId != 1 &&
                                ugs.PickTeamId != ugs.GameSpread.FavoriteTeamId &&
                                ugs.PickTeamId != ugs.GameSpread.UnderdogTeamId)
                            {
                                throw new ArgumentException(
                                                string.Format("PickTeamId not valid. UserGameSelectionId:{0} PickTeamId:{1}",
                                                ugs.UserGameSelectionId,
                                                ugs.PickTeamId));
                            }
                        }

                        foreach (var gameRow in selection.GameRows)
                        {
                            var ugs = gameRow.UserGameSelection;
                            ugs.Saved = true;  // mark this record as the user saved it
                            var existing = db.UserGameSelections.Find(ugs.UserGameSelectionId);
                            db.Entry(existing).CurrentValues.SetValues(ugs);

                            //((IObjectContextAdapter)db).ObjectContext.Detach(existing);

                            //db.Entry(ugs).State = EntityState.Modified;
                            db.SaveChanges();
                            saveCount++;
                        }
                    }
                }
            }

            return Json(saveCount);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}