using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Selectum.DAL;
using Selectum.Models;
using WebMatrix.WebData;

namespace Selectum.Controllers
{
    public class BaseGameFilteredController : Controller
    {
        protected SelectumContext db = new SelectumContext();

        protected int GetUserIdentityId()
        {
            if (User == null || User.Identity == null)
            {
                throw new ArgumentException("Your user information was not properly loaded");
            }
            // convert the security user to its user profile id
            //var userProfileId = 2;
            var userProfileId = WebSecurity.GetUserId(User.Identity.Name);

            // convert the user profile userid to the data userid
            var userToUserProfile = db.UserToUserProfiles.FirstOrDefault(utup => utup.UserProfileId == userProfileId);
            if (userToUserProfile == null)
            {
                throw new ArgumentException(string.Format("Your user profile is not associated with a selectum user yet. Please contact the admin and ask for the association to be set up for userName:{0}", User.Identity.Name));
            }

            // set the userId (the data user id)
            var userId = userToUserProfile.UserId;

            return userId;
        }
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

            ViewBag.MessageToUserSelectedGameFilterId = "Selected " + gameFilters.First(gf => gf.Selected).Text;
        }

        protected void SetViewBagGameFilterToFirst()
        {
            var firstGameFilterId = db.GameFilters.OrderBy(_ => _.GameFilterId).FirstOrDefault().GameFilterId;
            SetViewBagGameFilter(firstGameFilterId);
        }

        protected int validateGameFilterId(int id)
        {
            // make sure it is a valid gameFilterId
            var currentGameFilter = db.GameFilters.FirstOrDefault(gf => gf.GameFilterId == id);

            if (currentGameFilter == null)
            {
                throw new ArgumentException(string.Format("Unknown GameFilterId:{0}", id));
            }
            else
            {
                return currentGameFilter.GameFilterId;
            }
        }

        public ActionResult Index()
        {
            var utilities = new ModelUtilities();
            var now = DateTime.Now;
            //var now = new DateTime(2012, 12, 16);
            string viewBagMessageToUser = string.Empty;

            try
            {
                var currentGameFilterId = utilities.GetGameFilterByDate(db.GameFilters.ToList(), now).GameFilterId;
                return RedirectToAction(string.Concat("GameFilter/", currentGameFilterId));
            }
            catch (Exception ex)
            {
                ViewBag.MessageToUser = string.Format("Sorry an error occurred. Please let the admin know. Error:{0}", ex.Message);
                SetViewBagGameFilterToFirst();
                return View();
            }
        }
    }
}