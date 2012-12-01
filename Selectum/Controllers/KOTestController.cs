using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Selectum.Models;

namespace Selectum.Controllers
{
    public class KOTestController : Controller
    {
        public ActionResult KOTest()
        {
            return View();
        }
        [HttpPost]
        public JsonResult Create(Candidate candidate)
        {
            //do the persistence logic here
            var message = "Candidate: " + candidate.FirstName + " Saved";
            return Json(message);
        }
    }
}
