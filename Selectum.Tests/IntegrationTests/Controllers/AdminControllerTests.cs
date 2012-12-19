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
    public class AdminControllerTests
    {
        #region BuildUserGameResultsTests
        [TestMethod]
        public void BuildUserGameResultsTestsHappyPath()
        {
            Database.SetInitializer<SelectumContext>(null);
            SelectumContext db = new SelectumContext();

            var controller = new AdminController();
            int gameFilterId = 6;
            int extraPointFactorPerBetOverMin = 2;
            var noBetPickTeam = db.Teams.First(t => t.TeamLongName == "No Bet");
            List<User> users = db.Users.ToList();
            var thisGameFiltersGameResults = db.GameResults
                                                .Include(gr => gr.GameSpread)
                                                .Include(gr => gr.GameSpread.FavoriteTeam)
                                                .Include(gr => gr.GameSpread.UnderdogTeam)
                                                .Include(gr => gr.GameSpread.Game)
                                                .Include(gr => gr.WinnerTeam)
                                                .Where(gr => gr.GameSpread.Game.GameFilterId == gameFilterId)
                                                .ToList();

            var thisGameFiltersUsersGameSelections = db.UserGameSelections
                                                        .Include(ugs => ugs.GameSpread)
                                                        .Include(ugs => ugs.GameSpread.Game)
                                                        .Include(ugs => ugs.User)
                                                        .Include(ugs => ugs.PickTeam)
                                                        .Where(ugs => ugs.GameSpread.Game.GameFilterId == gameFilterId)
                                                        .ToList();
            var actual = controller.BuildUserGameResults(gameFilterId, thisGameFiltersGameResults, thisGameFiltersUsersGameSelections, users, noBetPickTeam, extraPointFactorPerBetOverMin);
            Assert.Inconclusive("This is just a test harness");
        }

        [TestMethod]
        public void BuildUserGameResultsTestsRebuildTable()
        {
            Database.SetInitializer<SelectumContext>(null);
            SelectumContext db = new SelectumContext();

            db.UserGameResults.ToList().ForEach(ugr => db.UserGameResults.Remove(ugr));
            db.SaveChanges();

            var controller = new AdminController();
            
            int extraPointFactorPerBetOverMin = 2;
            var noBetPickTeam = db.Teams.First(t => t.TeamLongName == "No Bet");
            List<User> users = db.Users.ToList();           

            for (int i = 1; i <= 14; i++)
            {
                int gameFilterId = i;

                var thisGameFiltersGameResults = db.GameResults
                                                    .Include(gr => gr.GameSpread)
                                                    .Include(gr => gr.GameSpread.FavoriteTeam)
                                                    .Include(gr => gr.GameSpread.UnderdogTeam)
                                                    .Include(gr => gr.GameSpread.Game)
                                                    .Include(gr => gr.WinnerTeam)
                                                    .Where(gr => gr.GameSpread.Game.GameFilterId == gameFilterId)
                                                    .ToList();

                var thisGameFiltersUsersGameSelections = db.UserGameSelections
                                                            .Include(ugs => ugs.GameSpread)
                                                            .Include(ugs => ugs.GameSpread.Game)
                                                            .Include(ugs => ugs.User)
                                                            .Include(ugs => ugs.PickTeam)
                                                            .Where(ugs => ugs.GameSpread.Game.GameFilterId == gameFilterId)
                                                            .ToList();
                var userGameResults = controller.BuildUserGameResults(gameFilterId, thisGameFiltersGameResults, thisGameFiltersUsersGameSelections, users, noBetPickTeam, extraPointFactorPerBetOverMin);

                userGameResults.ForEach(ugr => db.UserGameResults.Add(ugr));
                db.SaveChanges();
            }
            Assert.Fail("This should not be ran except for manually");
        }
        #endregion

        #region BuildUserResultsTests
        [TestMethod]
        public void BuildUserResultsTestsHappyPath()
        {
            Database.SetInitializer<SelectumContext>(null);
            SelectumContext db = new SelectumContext();

            var controller = new AdminController();
            int gameFilterId = 6;
            List<User> users = db.Users.ToList();


            var thisGameFiltersUsersGameSelections = db.UserGameResults
                                                        .Include(ugs => ugs.UserGameSelection)
                                                        .Include(ugs => ugs.UserGameSelection.GameSpread)
                                                        .Include(ugs => ugs.UserGameSelection.GameSpread.Game)
                                                        .Include(ugs => ugs.UserGameSelection.User)
                                                        .Include(ugs => ugs.UserGameSelection.PickTeam)
                                                        .Where(ugs => ugs.UserGameSelection.GameSpread.Game.GameFilterId == gameFilterId)
                                                        .ToList();
            var actual = controller.BuildUserResults(gameFilterId, thisGameFiltersUsersGameSelections, users);
            Assert.Inconclusive("This is just a test harness");
        }

        [TestMethod]
        public void BuildUserResultsTestsRebuildTable()
        {
            Database.SetInitializer<SelectumContext>(null);
            SelectumContext db = new SelectumContext();

            db.UserResults.ToList().ForEach(ur => db.UserResults.Remove(ur));
            db.SaveChanges();

            var controller = new AdminController();
            List<User> users = db.Users.ToList();
            for (int i = 1; i <= 14; i++)
            {
                int gameFilterId = i;
                
                var thisGameFiltersUsersGameSelections = db.UserGameResults
                                                            .Include(ugs => ugs.UserGameSelection)
                                                            .Include(ugs => ugs.UserGameSelection.GameSpread)
                                                            .Include(ugs => ugs.UserGameSelection.GameSpread.Game)
                                                            .Include(ugs => ugs.UserGameSelection.User)
                                                            .Include(ugs => ugs.UserGameSelection.PickTeam)
                                                            .Where(ugs => ugs.UserGameSelection.GameSpread.Game.GameFilterId == gameFilterId)
                                                            .ToList();
                var userResults = controller.BuildUserResults(gameFilterId, thisGameFiltersUsersGameSelections, users);
                userResults.ForEach(ur => db.UserResults.Add(ur));
                db.SaveChanges();
            }
            Assert.Fail("This should not be ran except for manually");
        }
        #endregion
    }
}
