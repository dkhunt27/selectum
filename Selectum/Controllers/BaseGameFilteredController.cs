using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Selectum.DAL;
using Selectum.Models;

namespace Selectum.Controllers
{
    public class BaseGameFilteredController : Controller
    {
        protected SelectumContext db = new SelectumContext();

        protected void SetViewBagGameFilter(int selectedGameFilterId)
        {
            List<SelectListItem> gameFilters = new List<SelectListItem>();
            var filters = db.GameFilters.ToList();

            foreach (var filter in filters)
            {
                gameFilters.Add(new SelectListItem
                {
                    Text = filter.GameFilterName,
                    Value = filter.GameFilterId.ToString(),
                    Selected = filter.GameFilterId == selectedGameFilterId
                });
            }

            ViewBag.GameFilters = gameFilters;
        }

        protected int validateGameFilterId(int id)
        {
            // make sure it is a valid gameFilterId
            var currentGameFilter = db.GameFilters.FirstOrDefault(gf => gf.GameFilterId == id);

            if (currentGameFilter == null)
            {
                throw new ArgumentException(string.Format("Unknown GameFilterId:{0}",id));
            }
            else
            {
                return currentGameFilter.GameFilterId;
            }
        }

        public ActionResult Index()
        {
            var utilities = new ModelUtilities();

            //var now = DateTime.Now;
            var now = new DateTime(2012, 12, 16);
            var currentGameFilterId = utilities.GetGameFilterByDate(db.GameFilters.ToList(), now).GameFilterId;

            return RedirectToAction(string.Concat("GameFilter/", currentGameFilterId));
        }
    }
}