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
    [Authorize]
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

                // convert the security user to its user profile id
                //var userProfileId = 2;
                var userProfileId = WebSecurity.GetUserId(User.Identity.Name);

                var userToUserProfile = db.UserToUserProfiles.FirstOrDefault(utup => utup.UserProfileId == userProfileId);
                if (userToUserProfile == null)
                {
                    throw new ArgumentException(string.Format("Your user profile is not associated with a selectum user yet. Please contact the admin and ask for the association to be set up for userName:{0}", User.Identity.Name));
                }

                // convert the user profile userid to the data userid
                var userId = userToUserProfile.UserId;


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
                                            .Include(g => g.Game)
                                            .Include(g => g.FavoriteTeam)
                                            .Include(g => g.UnderdogTeam)
                                            .Where(g => g.Game.GameFilterId == currentGameFilterId);

                    var noBetTeam = db.Teams.First(t => t.TeamLongName == "No Bet");

                    var user = db.Users.First(u => u.UserId == userId);

                    // initialize the userGameSelections with No Bets
                    foreach (var gameSpread in gameSpreads)
                    {
                        userGameSelections.Add(new UserGameSelection()
                                            {
                                                Bet = 0,
                                                GameSpreadId = gameSpread.GameSpreadId,
                                                PickTeamId = noBetTeam.TeamId,
                                                GameSpread = gameSpread,
                                                PickTeam = noBetTeam,
                                                UserId = user.UserId,
                                                User = user,
                                                Saved = false
                                            });
                    }

                    //save the no bets to the database to initialize the usergameselectionid which is used to identify the rows in the html
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
                return Json(saveCount);
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