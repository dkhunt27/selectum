//using System;
//using System.Collections.Generic;
//using System.Data;
//using System.Data.Entity;
//using System.Linq;
//using System.Web;
//using System.Web.Mvc;
//using Selectum.Models;
//using Selectum.DAL;

//namespace Selectum.Controllers
//{
//    public class UserTaskSelectionController : Controller
//    {
//        private SelectumContext db = new SelectumContext();

//        //
//        // GET: /UserTaskSelection/

//        public ActionResult Index()
//        {
//            var userid = 1;
//            var usertaskselections = db.UserTaskSelections.Include(u => u.Work).Include(u => u.SelectedTask).Include(u => u.User).Where(u => u.UserId == userid);
//            return View(usertaskselections.ToList());
//        }

//        //
//        // GET: /UserTaskSelection/Details/5

//        public ActionResult Details(int id = 0)
//        {
//            UserTaskSelection usertaskselection = db.UserTaskSelections.Find(id);
//            if (usertaskselection == null)
//            {
//                return HttpNotFound();
//            }
//            return View(usertaskselection);
//        }

//        //
//        // GET: /UserTaskSelection/Create

//        public ActionResult Create()
//        {
//            ViewBag.WorkId = new SelectList(db.Works, "WorkId", "WorkId");
//            ViewBag.SelectedTaskId = new SelectList(db.Tasks, "TaskId", "TaskName");
//            ViewBag.UserId = new SelectList(db.Users2, "UserId", "UserName");

//            List<UserTaskSelection> userTasks = new List<UserTaskSelection>();
//            userTasks.Add(new UserTaskSelection());
//            userTasks.Add(new UserTaskSelection());
//            userTasks.Add(new UserTaskSelection());
//            return View(userTasks);
//        }

//        //
//        // POST: /UserTaskSelection/Create

//        [HttpPost]
//        public ActionResult Create(List<UserTaskSelection> usertaskselection)
//        {
//            if (ModelState.IsValid)
//            {
//                foreach (var usertask in usertaskselection)
//                {
//                    db.UserTaskSelections.Add(usertask);
//                }
//                db.SaveChanges();
//                return RedirectToAction("Index");
//            }

//            //ViewBag.WorkId = new SelectList(db.Works, "WorkId", "WorkId", usertaskselection.WorkId);
//            //ViewBag.SelectedTaskId = new SelectList(db.Tasks, "TaskId", "TaskName", usertaskselection.SelectedTaskId);
//            //ViewBag.UserId = new SelectList(db.Users2, "UserId", "UserName", usertaskselection.UserId);
//            return View(usertaskselection);
//        }

//        //
//        // GET: /UserTaskSelection/Edit/5

//        public ActionResult Edit(int id = 0)
//        {
//            UserTaskSelection usertaskselection = db.UserTaskSelections.Find(id);
//            if (usertaskselection == null)
//            {
//                return HttpNotFound();
//            }
//            ViewBag.WorkId = new SelectList(db.Works, "WorkId", "WorkId", usertaskselection.WorkId);
//            ViewBag.SelectedTaskId = new SelectList(db.Tasks, "TaskId", "TaskName", usertaskselection.SelectedTaskId);
//            ViewBag.UserId = new SelectList(db.Users2, "UserId", "UserName", usertaskselection.UserId);
//            return View(usertaskselection);
//        }

//        //
//        // POST: /UserTaskSelection/Edit/5

//        [HttpPost]
//        public ActionResult Edit(UserTaskSelection usertaskselection)
//        {
//            if (ModelState.IsValid)
//            {
//                db.Entry(usertaskselection).State = EntityState.Modified;
//                db.SaveChanges();
//                return RedirectToAction("Index");
//            }
//            ViewBag.WorkId = new SelectList(db.Works, "WorkId", "WorkId", usertaskselection.WorkId);
//            ViewBag.SelectedTaskId = new SelectList(db.Tasks, "TaskId", "TaskName", usertaskselection.SelectedTaskId);
//            ViewBag.UserId = new SelectList(db.Users2, "UserId", "UserName", usertaskselection.UserId);
//            return View(usertaskselection);
//        }

//        //
//        // GET: /UserTaskSelection/Delete/5

//        public ActionResult Delete(int id = 0)
//        {
//            UserTaskSelection usertaskselection = db.UserTaskSelections.Find(id);
//            if (usertaskselection == null)
//            {
//                return HttpNotFound();
//            }
//            return View(usertaskselection);
//        }

//        //
//        // POST: /UserTaskSelection/Delete/5

//        [HttpPost, ActionName("Delete")]
//        public ActionResult DeleteConfirmed(int id)
//        {
//            UserTaskSelection usertaskselection = db.UserTaskSelections.Find(id);
//            db.UserTaskSelections.Remove(usertaskselection);
//            db.SaveChanges();
//            return RedirectToAction("Index");
//        }

//        protected override void Dispose(bool disposing)
//        {
//            db.Dispose();
//            base.Dispose(disposing);
//        }
//    }
//}