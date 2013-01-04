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
    [Authorize(Roles = "Admin")]
    public class GameFilterController : Controller
    {
        private SelectumContext db = new SelectumContext();

        //
        // GET: /GameFilter/

        public ActionResult Index()
        {
            return View(db.GameFilters.ToList());
        }

        //
        // GET: /GameFilter/Details/5

        public ActionResult Details(int id = 0)
        {
            GameFilter gamefilter = db.GameFilters.Find(id);
            if (gamefilter == null)
            {
                return HttpNotFound();
            }
            return View(gamefilter);
        }

        //
        // GET: /GameFilter/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /GameFilter/Create

        [HttpPost]
        public ActionResult Create(GameFilter gamefilter)
        {
            if (ModelState.IsValid)
            {
                db.GameFilters.Add(gamefilter);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(gamefilter);
        }

        //
        // GET: /GameFilter/Edit/5

        public ActionResult Edit(int id = 0)
        {
            GameFilter gamefilter = db.GameFilters.Find(id);
            if (gamefilter == null)
            {
                return HttpNotFound();
            }
            return View(gamefilter);
        }

        //
        // POST: /GameFilter/Edit/5

        [HttpPost]
        public ActionResult Edit(GameFilter gamefilter)
        {
            if (ModelState.IsValid)
            {
                db.Entry(gamefilter).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(gamefilter);
        }

        //
        // GET: /GameFilter/Delete/5

        public ActionResult Delete(int id = 0)
        {
            GameFilter gamefilter = db.GameFilters.Find(id);
            if (gamefilter == null)
            {
                return HttpNotFound();
            }
            return View(gamefilter);
        }

        //
        // POST: /GameFilter/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {
            GameFilter gamefilter = db.GameFilters.Find(id);
            db.GameFilters.Remove(gamefilter);
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