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

namespace Selectum.Controllers
{
    //[Authorize]
    public class SelectionController : Controller
    {
        private SelectumContext db = new SelectumContext();

        public ActionResult KOIndex()
        {
            return View();
        }

        public ActionResult KOIndex2()
        {
            return View();
        }

        //
        // GET: /UserGameSelection/

        public ActionResult Index()
        {
            var utilities = new ModelUtilities();

            //var now = DateTime.Today();
            var now = new DateTime(2012, 10, 5);

            var userProfileId = 1;
            //var userProfileId = (int)Membership.GetUser().ProviderUserKey;
            var userId = db.UserToUserProfiles.First(utup => utup.UserProfileId == userProfileId).UserId;

            var gameFilters = db.GameFilters;
            var currentGameFilter = utilities.GetGameFilterByDate(gameFilters.ToList(), now);
            var userGameSelectionsDB = db.UserGameSelections
                                            .Include(ugs => ugs.Game)
                                            .Include(t => t.PickTeam)
                                            .Include(g => g.Game.FavoriteTeam)
                                            .Include(g => g.Game.UnderdogTeam)
                                            .Include(u => u.User)
                                            .Where(u => u.UserId == userId)
                                            .Where(ugs => ugs.Game.GameFilterId == currentGameFilter.GameFilterId);

            var userGameSelections = userGameSelectionsDB.ToList();

            if (userGameSelections.Count == 0)
            {
                var games = db.Games.Include(g => g.FavoriteTeam).Include(g => g.UnderdogTeam).Where(g => g.GameFilterId == currentGameFilter.GameFilterId);
                var noBetTeam = db.Teams.First(t => t.TeamLongName == "No Bet");
                var user = db.Users.First(u => u.UserId == userId);

                // initialize the userGameSelections with No Bets
                foreach (var game in games)
                {
                    userGameSelections.Add(new UserGameSelection() { Bet = 0, GameId = game.GameId, PickTeamId = noBetTeam.TeamId, Game = game, PickTeam = noBetTeam, UserId = user.UserId, User = user });
                }
            }

            var selection = new Selection();
            selection.UserGameSelections = userGameSelections;
            selection.PlacedBets = utilities.GetPlacedBets(selection.UserGameSelections);
            selection.AvailablePoints = utilities.GetAvailablePoints(selection.UserGameSelections, selection.MinSpentPointsForAnyOneWeek, selection.ExtraPointFactorPerBetOverMin);
            selection.SpentPoints = utilities.GetSpentPoints(selection.UserGameSelections);
            selection.PossibleBets = utilities.GetPossibleBets(selection.UserGameSelections);
            selection.GameFilters = gameFilters.ToList();
            selection.CurrentGameFilter = currentGameFilter;

            return View(selection);
        }

        //
        // GET: /UserGameSelection/Details/5

        public ActionResult GameFilter(int id = 0)
        {
            var utilities = new ModelUtilities();
            var userId = 5;
            //var userId = (int)Membership.GetUser().ProviderUserKey;

            var gameFilters = db.GameFilters;
            var currentGameFilter = db.GameFilters.First(gf => gf.GameFilterId == id);
            var userGameSelectionsDB = db.UserGameSelections.Include(ugs => ugs.Game).Include(t => t.PickTeam).Include(g => g.Game.FavoriteTeam).Include(g => g.Game.UnderdogTeam).Include(u => u.User).Where(u => u.UserId == userId).Where(ugs => ugs.Game.GameFilterId == id);
            
            var userGameSelections = userGameSelectionsDB.ToList();

            if (userGameSelections.Count == 0)
            {
                var games = db.Games.Include(g => g.FavoriteTeam).Include(g => g.UnderdogTeam).Where(g => g.GameFilterId == id);
                var noBetTeam = db.Teams.First(t => t.TeamLongName == "No Bet");
                var user = db.Users.First(u => u.UserId == id);
           
                // initialize the userGameSelections with No Bets
                foreach (var game in games)
                {
                    userGameSelections.Add(new UserGameSelection() { Bet = 0, GameId = game.GameId, PickTeamId = noBetTeam.TeamId, Game = game, PickTeam = noBetTeam, UserId = user.UserId, User = user });
                }
            }

            var selection = new Selection();
            selection.UserGameSelections = userGameSelections;
            selection.PlacedBets = utilities.GetPlacedBets(selection.UserGameSelections);
            selection.AvailablePoints = utilities.GetAvailablePoints(selection.UserGameSelections, selection.MinSpentPointsForAnyOneWeek, selection.ExtraPointFactorPerBetOverMin);
            selection.SpentPoints = utilities.GetSpentPoints(selection.UserGameSelections);
            selection.PossibleBets = utilities.GetPossibleBets(selection.UserGameSelections);
            selection.GameFilters = gameFilters.ToList();
            selection.CurrentGameFilter = currentGameFilter;

            if (userGameSelections == null)
            {
                return HttpNotFound();
            }

            return View(selection);
        }

        [HttpPost]
        public JsonResult Save(List<UserGameSelection> userGameSelections)
        {
            var saveCount = 0;
            if (ModelState.IsValid)
            {
                // server side validations
                foreach (var ugs in userGameSelections)
                {
                    // make sure the picked team is correct
                    if (ugs.PickTeamId != 1 && ugs.PickTeamId != ugs.Game.FavoriteTeamId && ugs.PickTeamId != ugs.Game.UnderdogTeamId)
                    {
                        throw new ArgumentException(string.Format("PickTeamId not valid. UserGameSelectionId:{0} PickTeamId:{1}", ugs.UserGameSelectionId, ugs.PickTeamId));
                    }
                }

                
                foreach (var ugs in userGameSelections)
                {
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

        [HttpPost]
        public ActionResult Index(Selection selection)
        {
            return View(selection);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}