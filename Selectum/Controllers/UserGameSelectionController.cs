using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Selectum.Models;
using Selectum.DAL;

namespace Selectum.Controllers
{
    [Authorize]
    public class UserGameSelectionController : Controller
    {
        private SelectumContext db = new SelectumContext();

        //
        // GET: /UserGameSelection/

        public ActionResult Index()
        {
            //var now = new DateTime(2012, 10, 5);

            //var gameFilters = db.GameFilters;
            //var utilities = new ModelUtilities();
            //var gameFilter = utilities.GetGameFilterByDate(gameFilters.ToList(), now);

            //var utilities = new ModelUtilities();
            //var userId = (int)Membership.GetUser().ProviderUserKey;

            //var userGameSelectionsDB = db.UserGameSelections.Include(ugs => ugs.Game).Include(t => t.PickTeam).Include(g => g.Game.FavoriteTeam).Include(g => g.Game.UnderdogTeam).Include(u => u.User).Where(u => u.UserId == userId).Where(ugs => ugs.Game.GameFilterId == id);

            //var userGameSelections = userGameSelectionsDB.ToList();

            //if (userGameSelections.Count == 0)
            //{
            //    var games = db.Games.Include(g => g.FavoriteTeam).Include(g => g.UnderdogTeam).Where(g => g.GameFilterId == id);
            //    var noBetTeam = db.Teams.First(t => t.TeamLongName == "No Bet");
            //    var user = db.Users.First(u => u.UserId == id);

            //    // initialize the userGameSelections with No Bets
            //    foreach (var game in games)
            //    {
            //        userGameSelections.Add(new UserGameSelection() { Bet = 0, GameId = game.GameId, PickTeamId = noBetTeam.TeamId, Game = game, PickTeam = noBetTeam, UserId = user.UserId, User = user });
            //    }
            //}

            //var selection = new Selection();
            //selection.UserGameSelections = userGameSelections;
            //selection.PlacedBets = utilities.GetPlacedBets(selection.UserGameSelections);
            //selection.AvailablePoints = utilities.GetAvailablePoints(selection.UserGameSelections, selection.MinSpentPointsForAnyOneWeek, selection.ExtraPointFactorPerBetOverMin);
            //selection.SpentPoints = utilities.GetSpentPoints(selection.UserGameSelections);
            //selection.PossibleBets = utilities.GetPossibleBets(selection.UserGameSelections);
            //selection.GameFilters = gameFilters.ToList();
            //selection.CurrentGameFilter = currentGameFilter;
            //selection.MaxBetForAnyOneGame = 5;
            //selection.MinSpentPointsForAnyOneWeek = 6;

            var userGameSelections = db.UserGameSelections.Include(ugs => ugs.Game).Include(t => t.PickTeam).Include(g => g.Game.FavoriteTeam).Include(g => g.Game.UnderdogTeam).Include(u => u.User);
            return View(userGameSelections.ToList());
        }

        //
        // GET: /UserGameSelection/Details/5

        public ActionResult Details(int id = 0)
        {
            var usergameselection = db.UserGameSelections.Where(ugs => ugs.Game.GameFilterId == id);
            if (usergameselection == null)
            {
                return HttpNotFound();
            }
            return View(usergameselection.ToList());
        }

        //
        // GET: /UserGameSelection/Create

        public ActionResult Create()
        {
            ViewBag.GameId = new SelectList(db.Games, "GameId", "HomeTeam");
            ViewBag.UserId = new SelectList(db.Users, "UserId", "UserName");
            return View();
        }

        //
        // POST: /UserGameSelection/Create

        [HttpPost]
        public ActionResult Create(UserGameSelection usergameselection)
        {
            if (ModelState.IsValid)
            {
                db.UserGameSelections.Add(usergameselection);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.GameId = new SelectList(db.Games, "GameId", "HomeTeam", usergameselection.GameId);
            ViewBag.UserId = new SelectList(db.Users, "UserId", "UserName", usergameselection.UserId);
            return View(usergameselection);
        }

        //
        // GET: /UserGameSelection/Edit/5

        public ActionResult Edit(int id = 0)
        {
            UserGameSelection usergameselection = db.UserGameSelections.Find(id);
            if (usergameselection == null)
            {
                return HttpNotFound();
            }
            ViewBag.GameId = new SelectList(db.Games, "GameId", "HomeTeam", usergameselection.GameId);
            ViewBag.UserId = new SelectList(db.Users, "UserId", "UserName", usergameselection.UserId);
            return View(usergameselection);
        }

        //
        // POST: /UserGameSelection/Edit/5

        [HttpPost]
        public ActionResult Edit(UserGameSelection usergameselection)
        {
            if (ModelState.IsValid)
            {
                db.Entry(usergameselection).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.GameId = new SelectList(db.Games, "GameId", "HomeTeam", usergameselection.GameId);
            ViewBag.UserId = new SelectList(db.Users, "UserId", "UserName", usergameselection.UserId);
            return View(usergameselection);
        }

        //
        // GET: /UserGameSelection/Delete/5

        public ActionResult Delete(int id = 0)
        {
            UserGameSelection usergameselection = db.UserGameSelections.Find(id);
            if (usergameselection == null)
            {
                return HttpNotFound();
            }
            return View(usergameselection);
        }

        //
        // POST: /UserGameSelection/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {
            UserGameSelection usergameselection = db.UserGameSelections.Find(id);
            db.UserGameSelections.Remove(usergameselection);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}