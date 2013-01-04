using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Selectum;
using Selectum.Controllers;
using System.Web.Optimization;
using System.Data.Entity;
using System.Web.Http;
using System.Web.Routing;
using Selectum.DAL;
using Selectum.ViewModels;
using Selectum.Tests.Utilities;
using Selectum.Models;

namespace Selectum.Tests.UnitTests.Controllers
{
    [TestClass]
    public class ResultsByGameControllerTests
    {
        public TestContext TestContext { get; set; }

        public List<User> Users { get; set; }
        public List<Team> Teams { get; set; }
        public List<GameFilter> GameFilters { get; set; }
        public List<Game> Games { get; set; }
        
        public List<GameSpread> GameSpreads { get; set; }
        public List<GameResult> GameResults { get; set; }
        public List<UserGameSelection> UserGameSelections { get; set; }
        public List<UserGameResult> UserGameResults { get; set; }

        #region Additional test attributes
        //Use ClassInitialize to run code before running the first test in the class
        //[ClassInitialize]
        //public static void ResultsByGameControllerTestsInitialize(TestContext testContext)
        //{
        //}

        //Use ClassCleanup to run code after all tests in a class have run
        //[ClassCleanup]
        //public static void ResultsByGameControllerTestsCleanup()
        //{
        //}

        //Use TestInitialize to run code before running each test
        [TestInitialize]
        public void ResultsByGameControllerTestInitialize()
        {
            var initializer = new ModelDataInitializer();
            Users = initializer.InitializeUsers();
            Teams = initializer.InitializeTeams();
            GameFilters = initializer.InitializeGameFilters();
            Games = initializer.InitializeGames();
            GameSpreads = initializer.InitializeGameSpreads();
            GameResults = initializer.InitializeGameResults();
            UserGameSelections = initializer.InitializeUserGameSelections();
            UserGameResults = initializer.InitializeUserGameResults();
        }

        //Use TestCleanup to run code after each test has run
        //[TestCleanup]
        //public void ResultsByGameControllerTestCleanup()
        //{
        //}
        #endregion

        [TestMethod]
        public void GameFilter()
        {
            //AreaRegistration.RegisterAllAreas();

            //WebApiConfig.Register(GlobalConfiguration.Configuration);
            //FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            //RouteConfig.RegisterRoutes(RouteTable.Routes);
            //BundleConfig.RegisterBundles(BundleTable.Bundles);
            //AuthConfig.RegisterAuth();
            //Database.SetInitializer<SelectumContext>(new SelectumInitializer());
            Database.SetInitializer<SelectumContext>(null);

            int id = 0;

            // expecteds
            string messageToUser = "Sorry an error occurred. Please let the admin know. Error:Unknown GameFilterId:0";
            var resultsViewModel = new ResultsByGame();
            resultsViewModel.Results.Add(new ResultByGame());

            ResultsByGameController controller = new ResultsByGameController();
            ViewResult result = controller.GameFilter(id) as ViewResult;

            Assert.AreEqual(messageToUser, result.ViewBag.MessageToUser);

            IgnoreProperties ignoreProps = new IgnoreProperties();
            ignoreProps.Add(new PropertyComparisonExclusion(typeof(List<string>), "Capacity"));
            UnitTestingHelper.AssertPublicPropertiesEqual(resultsViewModel, result.Model, ignoreProps);
        }

        [TestMethod]
        public void BuildResultsByGameTest()
        {
            Database.SetInitializer<SelectumContext>(null);

            int currentGameFilterId = 1;
            int userId = 1;
            string viewBagMessageToUser = string.Empty;

            // expected
            string expectedMessageToUser = "Until all users have submitted their data, your data might be shifted over to the left (under the wrong user's name)";
            var expected = new ResultsByGame();
            expected.Results = new List<ResultByGame>();
            expected.Totals = new List<int>();
            expected.Users = new List<User>();
            expected.Results.Add(new ResultByGame());

            ResultsByGameController controller = new ResultsByGameController();
            ResultsByGame actual = controller.BuildResultsByGame(currentGameFilterId, userId, ref viewBagMessageToUser);

            actual.Results = new List<ResultByGame>();
            actual.Results.Add(new ResultByGame());
            actual.Users = new List<User>();

            Assert.AreEqual(expectedMessageToUser, viewBagMessageToUser);

            UnitTestingHelper.AssertPublicPropertiesEqual(expected, actual);
        }

        [TestMethod]
        public void BuildResultsByGameViewModelTestForGameFilter10WithResults()
        {
            int currentGameFilterId = 10;
            int userId = 1;
            string viewBagMessageToUser = string.Empty;
            var users = Users;
            var teams = Teams;
            var gameFilters = GameFilters;
            var games = Games;
            var gameSpreads = GameSpreads.Where(_ => _.Game.GameFilterId == currentGameFilterId).ToList();
            var gameResults = GameResults.Where(_ => _.GameSpread.Game.GameFilterId == currentGameFilterId).ToList();
            var userGameSelections = UserGameSelections.Where(_ => _.GameSpread.Game.GameFilterId == currentGameFilterId).ToList();
            var userGameResults = UserGameResults.Where(_ => _.UserGameSelection.GameSpread.Game.GameFilterId == currentGameFilterId).ToList();
            var noBetTeam = Teams.FirstOrDefault(_ => _.TeamLongName == "No Bet");
            var noPicksTeam = Teams.FirstOrDefault(_ => _.TeamLongName == "No Picks");
            var noWinnerTeam = Teams.FirstOrDefault(_ => _.TeamLongName == "No Winner");

            // expected
            string expectedMessageToUser = "Until all users have submitted their data, your data might be shifted over to the left (under the wrong user's name)";
            var expected = new ResultsByGameViewModel(currentGameFilterId);
            expected.Totals = new List<int> { 1, 2, 3, 4 };
            expected.Users = Users;

            ResultsByGameController controller = new ResultsByGameController();
            ResultsByGameViewModel actual = controller.BuildResultsByGameViewModel(currentGameFilterId, ref viewBagMessageToUser, users, gameSpreads, gameResults, userGameSelections, userGameResults, noBetTeam, noPicksTeam, noWinnerTeam);

            Assert.AreEqual(expectedMessageToUser, viewBagMessageToUser);

            Assert.AreEqual(14, actual.GameRows.Count);

            AssertResultsByGameGameRows("Indianapolis", "Jacksonville", Convert.ToDecimal(-3.00), "Indianapolis", actual.GameRows[0]);
            AssertResultsByGameGameRows("New England", "Buffalo", Convert.ToDecimal(-11.00), "New England", actual.GameRows[1]);
            AssertResultsByGameGameRows("NY Giants", "Cincinnati", Convert.ToDecimal(-4.00), "Cincinnati", actual.GameRows[2]);
            AssertResultsByGameGameRows("Tampa Bay", "San Diego", Convert.ToDecimal(-3.00), "Tampa Bay", actual.GameRows[3]);
            AssertResultsByGameGameRows("Denver", "Carolina", Convert.ToDecimal(-3.50), "Denver", actual.GameRows[4]);
            AssertResultsByGameGameRows("Miami", "Tennessee", Convert.ToDecimal(-6.00), "Tennessee", actual.GameRows[5]);
            AssertResultsByGameGameRows("Baltimore", "Oakland", Convert.ToDecimal(-7.50), "Baltimore", actual.GameRows[6]);
            AssertResultsByGameGameRows("Atlanta", "New Orleans", Convert.ToDecimal(-2.50), "New Orleans", actual.GameRows[7]);
            AssertResultsByGameGameRows("Detroit", "Minnesota", Convert.ToDecimal(-2.00), "Minnesota", actual.GameRows[8]);
            AssertResultsByGameGameRows("Seattle", "NY Jets", Convert.ToDecimal(-6.50), "Seattle", actual.GameRows[9]);
            AssertResultsByGameGameRows("Dallas", "Philadelphia", Convert.ToDecimal(-1.00), "Dallas", actual.GameRows[10]);
            AssertResultsByGameGameRows("San Francisco", "St. Louis", Convert.ToDecimal(-11.50), "No Winner", actual.GameRows[11]);
            AssertResultsByGameGameRows("Chicago", "Houston", Convert.ToDecimal(-1.00), "Houston", actual.GameRows[12]);
            AssertResultsByGameGameRows("Pittsburgh", "Kansas City", Convert.ToDecimal(-12.50), "Pittsburgh", actual.GameRows[13]);

            int gameRowId = 0;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Favorite", "IND", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Favorite", "IND", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "NoBet", "X", 0, 0, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "IND", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 1;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Favorite", "NE", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Favorite", "NE", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Favorite", "NE", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "NE", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 2;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Favorite", "NYG", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Favorite", "NYG", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Underdog", "CIN", 1, 2, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "NYG", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 3;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Favorite", "TB", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Underdog", "SD", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Underdog", "SD", 4, -4, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "TB", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 4;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Favorite", "DEN", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Favorite", "DEN", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Favorite", "DEN", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "DEN", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 5;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Favorite", "MIA", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Favorite", "MIA", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Underdog", "TEN", 1, 2, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "MIA", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 6;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Favorite", "BAL", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Favorite", "BAL", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Favorite", "BAL", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "BAL", 5, 5, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 7;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Favorite", "ATL", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Underdog", "NO", 5, 10, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Underdog", "NO", 1, 2, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "ATL", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 8;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Favorite", "DET", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Favorite", "DET", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Underdog", "MIN", 1, 2, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "DET", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 9;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Favorite", "SEA", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Favorite", "SEA", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Favorite", "SEA", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "SEA", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 10;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Underdog", "PHI", 3, -3, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Underdog", "PHI", 5, -5, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Underdog", "PHI", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "DAL", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 11;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Favorite", "SF", 3, -3, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Favorite", "SF", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Favorite", "SF", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "SF", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 12;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Underdog", "HOU", 3, 6, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Underdog", "HOU", 1, 2, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Underdog", "HOU", 1, 2, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "CHI", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 13;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Favorite", "PIT", 3, 3, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Favorite", "PIT", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Favorite", "PIT", 5, 5, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "PIT", 5, 5, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            Assert.AreEqual(5, actual.Totals[0], "Totals not equal");
            Assert.AreEqual(8, actual.Totals[1], "Totals not equal");
            Assert.AreEqual(13, actual.Totals[2], "Totals not equal");
            Assert.AreEqual(10, actual.Totals[3], "Totals not equal");

            Assert.AreEqual(0, actual.PotentialGains[0], "PotentialGains not equal");
            Assert.AreEqual(0, actual.PotentialGains[1], "PotentialGains not equal");
            Assert.AreEqual(0, actual.PotentialGains[2], "PotentialGains not equal");
            Assert.AreEqual(0, actual.PotentialGains[3], "PotentialGains not equal");

            Assert.AreEqual(0, actual.PotentialLosses[0], "PotentialLosses not equal");
            Assert.AreEqual(0, actual.PotentialLosses[1], "PotentialLosses not equal");
            Assert.AreEqual(0, actual.PotentialLosses[2], "PotentialLosses not equal");
            Assert.AreEqual(0, actual.PotentialLosses[3], "PotentialLosses not equal");
        }


        [TestMethod]
        public void BuildResultsByGameViewModelTest_WhenGameSpreadsExistButNoUserGameSelections_ShouldCreateDefaultUserGameSelections()
        {
            int currentGameFilterId = 10;
            int userId = 1;
            string viewBagMessageToUser = string.Empty;
            var users = Users;
            var teams = Teams;
            var noBetTeam = Teams.FirstOrDefault(_ => _.TeamLongName == "No Bet");
            var noPicksTeam = Teams.FirstOrDefault(_ => _.TeamLongName == "No Picks");
            var noWinnerTeam = Teams.FirstOrDefault(_ => _.TeamLongName == "No Winner");
            var gameSpreads = GameSpreads.Where(_ => _.Game.GameFilterId == currentGameFilterId).ToList();
            var gameResults = new List<GameResult>(); // if there are no user game selections, no need to worry about results
            var userGameSelections = new List<UserGameSelection>(); // this is what we are testing...when this is empty
            var userGameResults = new List<UserGameResult>(); // if there are no user game selections, then there cannot be any user game results

            // expected
            string expectedMessageToUser = "Until all users have submitted their data, your data might be shifted over to the left (under the wrong user's name)";

            ResultsByGameController controller = new ResultsByGameController();
            ResultsByGameViewModel actual = controller.BuildResultsByGameViewModel(currentGameFilterId, ref viewBagMessageToUser, users, gameSpreads, gameResults, userGameSelections, userGameResults, noBetTeam, noPicksTeam, noWinnerTeam);

            Assert.AreEqual(expectedMessageToUser, viewBagMessageToUser);

            Assert.AreEqual(14, actual.GameRows.Count);

            AssertResultsByGameGameRows("Indianapolis", "Jacksonville", Convert.ToDecimal(-3.00), "Indianapolis", actual.GameRows[0]);
            AssertResultsByGameGameRows("New England", "Buffalo", Convert.ToDecimal(-11.00), "New England", actual.GameRows[1]);
            AssertResultsByGameGameRows("NY Giants", "Cincinnati", Convert.ToDecimal(-4.00), "Cincinnati", actual.GameRows[2]);
            AssertResultsByGameGameRows("Tampa Bay", "San Diego", Convert.ToDecimal(-3.00), "Tampa Bay", actual.GameRows[3]);
            AssertResultsByGameGameRows("Denver", "Carolina", Convert.ToDecimal(-3.50), "Denver", actual.GameRows[4]);
            AssertResultsByGameGameRows("Miami", "Tennessee", Convert.ToDecimal(-6.00), "Tennessee", actual.GameRows[5]);
            AssertResultsByGameGameRows("Baltimore", "Oakland", Convert.ToDecimal(-7.50), "Baltimore", actual.GameRows[6]);
            AssertResultsByGameGameRows("Atlanta", "New Orleans", Convert.ToDecimal(-2.50), "New Orleans", actual.GameRows[7]);
            AssertResultsByGameGameRows("Detroit", "Minnesota", Convert.ToDecimal(-2.00), "Minnesota", actual.GameRows[8]);
            AssertResultsByGameGameRows("Seattle", "NY Jets", Convert.ToDecimal(-6.50), "Seattle", actual.GameRows[9]);
            AssertResultsByGameGameRows("Dallas", "Philadelphia", Convert.ToDecimal(-1.00), "Dallas", actual.GameRows[10]);
            AssertResultsByGameGameRows("San Francisco", "St. Louis", Convert.ToDecimal(-11.50), "No Winner", actual.GameRows[11]);
            AssertResultsByGameGameRows("Chicago", "Houston", Convert.ToDecimal(-1.00), "Houston", actual.GameRows[12]);
            AssertResultsByGameGameRows("Pittsburgh", "Kansas City", Convert.ToDecimal(-12.50), "Pittsburgh", actual.GameRows[13]);

            int gameRowId = 0;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Favorite", "IND", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Favorite", "IND", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "NoBet", "X", 0, 0, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "IND", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 1;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Favorite", "NE", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Favorite", "NE", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Favorite", "NE", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "NE", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 2;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Favorite", "NYG", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Favorite", "NYG", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Underdog", "CIN", 1, 2, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "NYG", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 3;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Favorite", "TB", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Underdog", "SD", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Underdog", "SD", 4, -4, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "TB", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 4;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Favorite", "DEN", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Favorite", "DEN", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Favorite", "DEN", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "DEN", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 5;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Favorite", "MIA", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Favorite", "MIA", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Underdog", "TEN", 1, 2, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "MIA", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 6;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Favorite", "BAL", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Favorite", "BAL", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Favorite", "BAL", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "BAL", 5, 5, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 7;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Favorite", "ATL", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Underdog", "NO", 5, 10, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Underdog", "NO", 1, 2, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "ATL", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 8;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Favorite", "DET", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Favorite", "DET", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Underdog", "MIN", 1, 2, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "DET", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 9;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Favorite", "SEA", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Favorite", "SEA", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Favorite", "SEA", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "SEA", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 10;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Underdog", "PHI", 3, -3, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Underdog", "PHI", 5, -5, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Underdog", "PHI", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "DAL", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 11;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Favorite", "SF", 3, -3, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Favorite", "SF", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Favorite", "SF", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "SF", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 12;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Underdog", "HOU", 3, 6, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Underdog", "HOU", 1, 2, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Underdog", "HOU", 1, 2, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "CHI", 1, -1, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            gameRowId = 13;
            Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
            AssertResultsByGameGameRowUserData(1, "Favorite", "PIT", 3, 3, 0, 0, actual.GameRows[gameRowId].UsersData[0]);
            AssertResultsByGameGameRowUserData(2, "Favorite", "PIT", 1, 1, 0, 0, actual.GameRows[gameRowId].UsersData[1]);
            AssertResultsByGameGameRowUserData(3, "Favorite", "PIT", 5, 5, 0, 0, actual.GameRows[gameRowId].UsersData[2]);
            AssertResultsByGameGameRowUserData(4, "Favorite", "PIT", 5, 5, 0, 0, actual.GameRows[gameRowId].UsersData[3]);

            Assert.AreEqual(5, actual.Totals[0], "Totals not equal");
            Assert.AreEqual(8, actual.Totals[1], "Totals not equal");
            Assert.AreEqual(13, actual.Totals[2], "Totals not equal");
            Assert.AreEqual(10, actual.Totals[3], "Totals not equal");

            Assert.AreEqual(0, actual.PotentialGains[0], "PotentialGains not equal");
            Assert.AreEqual(0, actual.PotentialGains[1], "PotentialGains not equal");
            Assert.AreEqual(0, actual.PotentialGains[2], "PotentialGains not equal");
            Assert.AreEqual(0, actual.PotentialGains[3], "PotentialGains not equal");

            Assert.AreEqual(0, actual.PotentialLosses[0], "PotentialLosses not equal");
            Assert.AreEqual(0, actual.PotentialLosses[1], "PotentialLosses not equal");
            Assert.AreEqual(0, actual.PotentialLosses[2], "PotentialLosses not equal");
            Assert.AreEqual(0, actual.PotentialLosses[3], "PotentialLosses not equal");
        }

        public void AssertResultsByGameGameRows(string expFavoriteTeamName, string expUnderdogTeamName, decimal expSpread, string expWinnerTeamName, ResultsByGameGameRow actual)
        {
            Assert.AreEqual(expFavoriteTeamName, actual.FavoriteTeamName, "The favorite teams do not match");
            Assert.AreEqual(expUnderdogTeamName, actual.UnderdogTeamName, "The underdog teams do not match");
            Assert.AreEqual(expSpread, actual.Spread, "The spreads do not match");
            Assert.AreEqual(expWinnerTeamName, actual.WinnerTeamName, "The winner teams do not match");
        }

        public void AssertResultsByGameGameRowUserData(int expUserId, string expPicked, string expPick, int expBet, int expResult, int expPotentialGain, int expPotentialLoss, ResultsByGameGameRowUserData actual)
        {
            bool expPickedFavorite = false;
            bool expPickedUnderdog = false;
            bool expPickedNoBet = false;
            bool expPickedNoPicks = false;

            if (expPicked == "Favorite") expPickedFavorite = true;
            if (expPicked == "Underdog") expPickedUnderdog = true;
            if (expPicked == "NoBet") expPickedNoBet = true;
            if (expPicked == "NoPicks") expPickedNoPicks = true;

            Assert.AreEqual(expUserId, actual.UserId, "UserId not equal");
            Assert.AreEqual(expPickedFavorite, actual.PickedFavorite, "PickedFavorite not equal");
            Assert.AreEqual(expPickedUnderdog, actual.PickedUnderdog, "PickedUnderdog not equal");
            Assert.AreEqual(expPickedNoBet, actual.PickedNoBet, "PickedNoBet not match");
            Assert.AreEqual(expPickedNoPicks, actual.PickedNoPicks, "PickedNoPicks not equal");
            Assert.AreEqual(expPick.TrimEnd(), actual.Pick.TrimEnd(), "Pick not equal");
            Assert.AreEqual(expBet, actual.Bet, "Bet not equal");
            Assert.AreEqual(expPotentialGain, actual.PotentialGain, "PotentialGain not equal");
            Assert.AreEqual(expPotentialLoss, actual.PotentialLoss, "PotentialLoss not equal");
            Assert.AreEqual(expResult, actual.Result, "Result not equal");
            
        }
    }
}
