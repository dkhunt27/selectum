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
    public class GameResultController : Controller
    {
        private SelectumContext db = new SelectumContext();

        //
        // GET: /Default1/

        public ActionResult Index()
        {
            var gameresults = db.GameResults.Include(g => g.GameSpread).Include(g => g.WinnerTeam);
            return View(gameresults.ToList());
        }

        //
        // GET: /Default1/Details/5

        public ActionResult Details(int id = 0)
        {
            GameResult gameresult = db.GameResults.Find(id);
            if (gameresult == null)
            {
                return HttpNotFound();
            }
            return View(gameresult);
        }

        //
        // GET: /Default1/Create

        public ActionResult Create()
        {
            ViewBag.GameSpreadId = new SelectList(db.GameSpreads, "GameSpreadId", "GameSpreadId");
            ViewBag.WinnerTeamId = new SelectList(db.Teams, "TeamId", "TeamLongName");
            return View();
        }

        //
        // POST: /Default1/Create

        [HttpPost]
        public ActionResult Create(GameResult gameresult)
        {
            if (ModelState.IsValid)
            {
                db.GameResults.Add(gameresult);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.GameSpreadId = new SelectList(db.GameSpreads, "GameSpreadId", "GameSpreadId", gameresult.GameSpreadId);
            ViewBag.WinnerTeamId = new SelectList(db.Teams, "TeamId", "TeamLongName", gameresult.WinnerTeamId);
            return View(gameresult);
        }

        //
        // GET: /Default1/Edit/5

        public ActionResult Edit(int id = 0)
        {
            GameResult gameresult = db.GameResults.Find(id);
            if (gameresult == null)
            {
                return HttpNotFound();
            }
            ViewBag.GameSpreadId = new SelectList(db.GameSpreads, "GameSpreadId", "GameSpreadId", gameresult.GameSpreadId);
            ViewBag.WinnerTeamId = new SelectList(db.Teams, "TeamId", "TeamLongName", gameresult.WinnerTeamId);
            return View(gameresult);
        }

        //
        // POST: /Default1/Edit/5

        [HttpPost]
        public ActionResult Edit(GameResult gameresult)
        {
            if (ModelState.IsValid)
            {
                db.Entry(gameresult).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.GameSpreadId = new SelectList(db.GameSpreads, "GameSpreadId", "GameSpreadId", gameresult.GameSpreadId);
            ViewBag.WinnerTeamId = new SelectList(db.Teams, "TeamId", "TeamLongName", gameresult.WinnerTeamId);
            return View(gameresult);
        }

        //
        // GET: /Default1/Delete/5

        public ActionResult Delete(int id = 0)
        {
            GameResult gameresult = db.GameResults.Find(id);
            if (gameresult == null)
            {
                return HttpNotFound();
            }
            return View(gameresult);
        }

        //
        // POST: /Default1/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {
            GameResult gameresult = db.GameResults.Find(id);
            db.GameResults.Remove(gameresult);
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