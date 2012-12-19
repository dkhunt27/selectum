using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Selectum.Controllers;
using Selectum.DAL;
using Selectum.Models;
using Selectum.ViewModels;
using System.Linq;
using System.Data.Entity;

namespace Selectum.Tests.IntegrationTests.Controllers
{
    [TestClass]
    public class OverallResultsByGameFilterControllerTests
    {
        #region BuildOverallResultsByGameFilterTests
        [TestMethod]
        [TestCategory("TestHarness")]
        public void BuildOverallResultsByGameFilterTestsHappyPath()
        {
            Database.SetInitializer<SelectumContext>(null);
            SelectumContext db = new SelectumContext();

            var controller = new OverallResultsByGameFilterController();
            List<User> users = db.Users.ToList();

            var userResults = db.UserResults.ToList();

            // order by gameFilterId
            var gameFilters = db.GameFilters.OrderBy(gr => gr.GameFilterId).ToList();

            List<OverallResultByGameFilter> resultsByGameFilter = controller.BuildResultsByGameFilter(gameFilters, userResults);

            var actual = controller.BuildOverallResultsByGameFilter(users, resultsByGameFilter);
        }

        #endregion
    }
}
