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
    public class GameController : Controller
    {
        private SelectumContext db = new SelectumContext();

        //
        // GET: /Game/
        public ActionResult Index()
        {
            var games = db.Games.Include(g => g.GameDateTime);
            return View(games.ToList());
        }

        //
        // GET: /Game/Details/5

        public ActionResult Details(int id = 0)
        {
            Game game = db.Games.Find(id);
            if (game == null)
            {
                return HttpNotFound();
            }
            return View(game);
        }

        //
        // GET: /Game/Create

        public ActionResult Create()
        {
            ViewBag.GameFilterId = new SelectList(db.GameFilters, "GameFilterId", "GameFilterName");
            ViewBag.FavoriteTeamId = new SelectList(db.Teams, "TeamId", "TeamLongName");
            ViewBag.UnderdogTeamId = new SelectList(db.Teams, "TeamId", "TeamLongName");
            return View();
        }

        //
        // POST: /Game/Create

        [HttpPost]
        public ActionResult Create(Game game)
        {
            if (ModelState.IsValid)
            {
                db.Games.Add(game);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.GameFilterId = new SelectList(db.GameFilters, "GameFilterId", "GameFilterName", game.GameFilterId);
            ViewBag.FavoriteTeamId = new SelectList(db.Teams, "TeamId", "TeamLongName", game.FavoriteTeamId);
            ViewBag.UnderdogTeamId = new SelectList(db.Teams, "TeamId", "TeamLongName", game.UnderdogTeamId);
            return View(game);
        }

        //
        // GET: /Game/Edit/5

        public ActionResult Edit(int id = 0)
        {
            Game game = db.Games.Find(id);
            if (game == null)
            {
                return HttpNotFound();
            }
            ViewBag.GameFilterId = new SelectList(db.GameFilters, "GameFilterId", "GameFilterName", game.GameFilterId);
            ViewBag.FavoriteTeamId = new SelectList(db.Teams, "TeamId", "TeamLongName", game.FavoriteTeamId);
            ViewBag.UnderdogTeamId = new SelectList(db.Teams, "TeamId", "TeamLongName", game.UnderdogTeamId);
            return View(game);
        }

        //
        // POST: /Game/Edit/5

        [HttpPost]
        public ActionResult Edit(Game game)
        {
            if (ModelState.IsValid)
            {
                db.Entry(game).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.GameFilterId = new SelectList(db.GameFilters, "GameFilterId", "GameFilterName", game.GameFilterId);
            ViewBag.FavoriteTeamId = new SelectList(db.Teams, "TeamId", "TeamLongName", game.FavoriteTeamId);
            ViewBag.UnderdogTeamId = new SelectList(db.Teams, "TeamId", "TeamLongName", game.UnderdogTeamId);
            return View(game);
        }

        //
        // GET: /Game/Delete/5

        public ActionResult Delete(int id = 0)
        {
            Game game = db.Games.Find(id);
            if (game == null)
            {
                return HttpNotFound();
            }
            return View(game);
        }

        //
        // POST: /Game/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {
            Game game = db.Games.Find(id);
            db.Games.Remove(game);
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