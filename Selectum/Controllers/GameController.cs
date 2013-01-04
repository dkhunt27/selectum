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
    [Authorize (Roles="Admin")]
    public class GameController : BaseGameFilteredController
    {
        //
        // GET: /Game/GameFilter/5
        public ActionResult GameFilter(int id = 0)
        {
            try
            {
                int currentGameFilterId = validateGameFilterId(id);
                SetViewBagGameFilter(currentGameFilterId);

                var games = db.Games
                                .Include(g => g.GameFilter)
                                .Include(g => g.Team1)
                                .Include(g => g.Team2)
                                .Where(g => g.GameFilter.GameFilterId == currentGameFilterId).ToList();

                if (games == null)
                {
                    throw new ArgumentException(string.Format("Missing games for given GameFilterId:{0}", currentGameFilterId));
                }

                return View(games);
            }
            catch (Exception ex)
            {
                return HttpNotFound(ex.Message);
            }
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}