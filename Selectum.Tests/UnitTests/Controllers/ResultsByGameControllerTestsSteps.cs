using System;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Selectum.Controllers;
using Selectum.Models;
using Selectum.ViewModels;
using TechTalk.SpecFlow;
using System.Linq;

namespace Selectum.Tests.UnitTests.Controllers
{
    [Binding]
    public class ResultsByGameControllerTestsSteps
    {
        public List<User> Users { get; set; }
        public List<Team> Teams { get; set; }
        public List<GameFilter> GameFilters { get; set; }
        public List<Game> Games { get; set; }
        public List<GameSpread> GameSpreads { get; set; }
        public List<GameResult> GameResults { get; set; }
        public List<UserGameSelection> UserGameSelections { get; set; }
        public List<UserGameResult> UserGameResults { get; set; }

        private int gameFilterId;
        private ResultsByGameViewModel actual;
        private List<User> users;
        private List<GameSpread> gameSpreads;
        private List<GameResult> gameResults;
        private List<UserGameSelection> userGameSelections;
        private List<UserGameResult> userGameResults;
        private Team noBetTeam;
        private Team noPicksTeam;
        private Team noWinnerTeam;
        private string viewBagMessageToUser;

        [BeforeScenario]
        public virtual void Initialize()
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

        [Given(@"The data is loaded for GameFilterId (.*)")]
        public void GivenTheDataIsLoadedForGameFilterId(int p0)
        {
            gameFilterId = p0;
            users = Users;
            var teams = Teams;
            gameSpreads = GameSpreads.Where(_ => _.Game.GameFilterId == gameFilterId).ToList();
            gameResults = GameResults.Where(_ => _.GameSpread.Game.GameFilterId == gameFilterId).ToList();
            userGameSelections = UserGameSelections.Where(_ => _.GameSpread.Game.GameFilterId == gameFilterId).ToList();
            userGameResults = UserGameResults.Where(_ => _.UserGameSelection.GameSpread.Game.GameFilterId == gameFilterId).ToList();
            noBetTeam = Teams.FirstOrDefault(_ => _.TeamLongName == "No Bet");
            noPicksTeam = Teams.FirstOrDefault(_ => _.TeamLongName == "No Picks");
            noWinnerTeam = Teams.FirstOrDefault(_ => _.TeamLongName == "No Winner");
        }

        [When(@"the view model is built")]
        public void WhenTheViewModelIsBuilt()
        {
            ResultsByGameController controller = new ResultsByGameController();
            actual = controller.BuildResultsByGameViewModel(gameFilterId, ref viewBagMessageToUser, users, gameSpreads, gameResults, userGameSelections, userGameResults, noBetTeam, noPicksTeam, noWinnerTeam);
        }

        [Given(@"there are no game user selections, game results, and user game results")]
        public void GivenThereAreNoGameUserSelectionsGameResultsAndUserGameResults()
        {
            // empty out the items
            userGameSelections = new List<UserGameSelection>();
            userGameResults = new List<UserGameResult>();
            gameResults = new List<GameResult>();
        }

        [Then(@"the view model game rows should be correct for GameFilterId (.*)")]
        public void ThenTheViewModelGameRowsShouldBeCorrectForGameFilterId(int p0)
        {
            int gameFilterId = p0;

            var gs = GameSpreads
                        .Where(_ => _.Game.GameFilterId == gameFilterId)
                        .OrderBy(_ => _.GameId)
                        .ToList();

            Assert.AreEqual(gs.Count, actual.GameRows.Count, string.Format("GameRows.Count not equal for GameFilterId:{0}", gameFilterId));

            int gameRowId = 0;
            foreach (var item in gs)
            {
                string expFavoriteTeam = item.FavoriteTeam.TeamLongName;
                string expUnderdogTeam = item.UnderdogTeam.TeamLongName;
                decimal expSpread = item.Spread;
                string expWinnerTeam = string.Empty;
                var gr = GameResults.FirstOrDefault(_ => _.GameSpreadId == item.GameSpreadId);

                if (gr == null)
                {
                    expWinnerTeam = Teams.First(_ => _.TeamLongName == "No Winner").TeamLongName;
                }
                else
                {
                    expWinnerTeam = gr.WinnerTeam.TeamLongName;
                }

                AssertResultsByGameGameRows(gameFilterId, gameRowId, expFavoriteTeam, expUnderdogTeam, expSpread, expWinnerTeam, actual.GameRows[gameRowId]);

                gameRowId++;
            }
        }

        [Then(@"the view model game rows should be correct for GameFilterId (.*) defaulted to no winner")]
        public void ThenTheViewModelGameRowsShouldBeCorrectForGameFilterIdDefaultedToNoWinner(int p0)
        {
            int gameFilterId = p0;

            var gs = GameSpreads
                        .Where(_ => _.Game.GameFilterId == gameFilterId)
                        .OrderBy(_ => _.GameId)
                        .ToList();

            Assert.AreEqual(gs.Count, actual.GameRows.Count, string.Format("GameRows.Count not equal for GameFilterId:{0}", gameFilterId));

            int gameRowId = 0;
            foreach (var item in gs)
            {
                string expFavoriteTeam = item.FavoriteTeam.TeamLongName;
                string expUnderdogTeam = item.UnderdogTeam.TeamLongName;
                decimal expSpread = item.Spread;
                string expWinnerTeam = Teams.First(_ => _.TeamLongName == "No Winner").TeamLongName;

                AssertResultsByGameGameRows(gameFilterId, gameRowId, expFavoriteTeam, expUnderdogTeam, expSpread, expWinnerTeam, actual.GameRows[gameRowId]);

                gameRowId++;
            }
        }

        [Then(@"the view model game rows should be correct for GameFilterId (.*) \(hardcoded\)")]
        public void ThenTheViewModelGameRowsShouldBeCorrectForGameFilterIdHardcoded(int p0)
        {
            int gameFilterId = p0;
            int gameRowId = 0;

            #region asserts by game filter id
            switch (gameFilterId)
            {
                case 10:
                    Assert.AreEqual(14, actual.GameRows.Count, "GameRows.Count not equal");
                    gameRowId = 0;
                    AssertResultsByGameGameRows(gameFilterId, gameRowId, "Indianapolis", "Jacksonville", Convert.ToDecimal(-3.00), "Indianapolis", actual.GameRows[gameRowId++]);
                    AssertResultsByGameGameRows(gameFilterId, gameRowId, "New England", "Buffalo", Convert.ToDecimal(-11.00), "New England", actual.GameRows[gameRowId++]);
                    AssertResultsByGameGameRows(gameFilterId, gameRowId, "NY Giants", "Cincinnati", Convert.ToDecimal(-4.00), "Cincinnati", actual.GameRows[gameRowId++]);
                    AssertResultsByGameGameRows(gameFilterId, gameRowId, "Tampa Bay", "San Diego", Convert.ToDecimal(-3.00), "Tampa Bay", actual.GameRows[gameRowId++]);
                    AssertResultsByGameGameRows(gameFilterId, gameRowId, "Denver", "Carolina", Convert.ToDecimal(-3.50), "Denver", actual.GameRows[gameRowId++]);
                    AssertResultsByGameGameRows(gameFilterId, gameRowId, "Miami", "Tennessee", Convert.ToDecimal(-6.00), "Tennessee", actual.GameRows[gameRowId++]);
                    AssertResultsByGameGameRows(gameFilterId, gameRowId, "Baltimore", "Oakland", Convert.ToDecimal(-7.50), "Baltimore", actual.GameRows[gameRowId++]);
                    AssertResultsByGameGameRows(gameFilterId, gameRowId, "Atlanta", "New Orleans", Convert.ToDecimal(-2.50), "New Orleans", actual.GameRows[gameRowId++]);
                    AssertResultsByGameGameRows(gameFilterId, gameRowId, "Detroit", "Minnesota", Convert.ToDecimal(-2.00), "Minnesota", actual.GameRows[gameRowId++]);
                    AssertResultsByGameGameRows(gameFilterId, gameRowId, "Seattle", "NY Jets", Convert.ToDecimal(-6.50), "Seattle", actual.GameRows[gameRowId++]);
                    AssertResultsByGameGameRows(gameFilterId, gameRowId, "Dallas", "Philadelphia", Convert.ToDecimal(-1.00), "Dallas", actual.GameRows[gameRowId++]);
                    AssertResultsByGameGameRows(gameFilterId, gameRowId, "San Francisco", "St. Louis", Convert.ToDecimal(-11.50), "No Winner", actual.GameRows[gameRowId++]);
                    AssertResultsByGameGameRows(gameFilterId, gameRowId, "Chicago", "Houston", Convert.ToDecimal(-1.00), "Houston", actual.GameRows[gameRowId++]);
                    AssertResultsByGameGameRows(gameFilterId, gameRowId, "Pittsburgh", "Kansas City", Convert.ToDecimal(-12.50), "Pittsburgh", actual.GameRows[gameRowId++]);

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
                    break;
                default:
                    throw new NotImplementedException(string.Format("The gameFilterId ({0}) is not implemented", p0));
            }
            #endregion

        }

        [Then(@"the view model user data for GameFilterId (.*) UserId (.*) should be correct \(hardcoded\)")]
        public void ThenTheViewModelUserDataForGameFilterIdUserIdShouldBeCorrectHardcoded(int p0, int p1)
        {
            int gameFilterId = p0;
            int userId = p1;
            int gameRowId = 0;
            int userDataId = userId - 1;

            #region asserts by game filter id and userid
            switch (gameFilterId)
            {
                case 10:

                    switch (userId)
                    {
                        case 1:
                            gameRowId = 0;
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "IND", 1, 1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "NE", 1, 1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "NYG", 1, -1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "TB", 1, 1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "DEN", 1, 1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "MIA", 1, -1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "BAL", 1, 1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "ATL", 1, -1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "DET", 1, -1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "SEA", 1, 1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Underdog", "PHI", 3, -3, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "SF", 3, -3, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Underdog", "HOU", 3, 6, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "PIT", 3, 3, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            break;
                        case 2:
                            gameRowId = 0;
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "IND", 1, 1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "NE", 1, 1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "NYG", 1, -1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Underdog", "SD", 1, -1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "DEN", 1, 1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "MIA", 1, -1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "BAL", 1, 1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Underdog", "NO", 5, 10, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "DET", 1, -1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "SEA", 1, 1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Underdog", "PHI", 5, -5, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "SF", 1, -1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Underdog", "HOU", 1, 2, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "PIT", 1, 1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            break;
                        case 3:
                            gameRowId = 0;
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "NoBet", "X", 0, 0, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "NE", 1, 1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Underdog", "CIN", 1, 2, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Underdog", "SD", 4, -4, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "DEN", 1, 1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Underdog", "TEN", 1, 2, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "BAL", 1, 1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Underdog", "NO", 1, 2, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Underdog", "MIN", 1, 2, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "SEA", 1, 1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Underdog", "PHI", 1, -1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "SF", 1, -1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Underdog", "HOU", 1, 2, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "PIT", 5, 5, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            break;
                        case 4:
                            gameRowId = 0;
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "IND", 1, 1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "NE", 1, 1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "NYG", 1, -1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "TB", 1, 1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "DEN", 1, 1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "MIA", 1, -1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "BAL", 5, 5, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "ATL", 1, -1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "DET", 1, -1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "SEA", 1, 1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "DAL", 1, 1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "SF", 1, -1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "CHI", 1, -1, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, "Favorite", "PIT", 5, 5, 0, 0, actual.GameRows[gameRowId++].UsersData[userDataId]);
                            break;
                        default:
                            throw new NotImplementedException(string.Format("Not implemented for userId ({0})", userId));
                    }

                    //Assert.AreEqual(4, actual.GameRows[gameRowId].UsersData.Count);
                    /*
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
                     Assert.AreEqual(0, actual.PotentialLosses[3], "PotentialLosses not equal");*/
                    break;
                default:
                    throw new NotImplementedException(string.Format("The gameFilterId ({0}) is not implemented", p0));
            }
            #endregion
        }

        [Then(@"the view model user data for GameFilterId (.*) UserId (.*) should be correct")]
        public void ThenTheViewModelUserDataForGameFilterIdUserIdShouldBeCorrect(int p0, int p1)
        {
            int gameFilterId = p0;
            int userId = p1;
            int userDataId = userId - 1;

            var ugs = UserGameSelections
                        .Where(_ => _.GameSpread.Game.GameFilterId == gameFilterId && _.UserId == userId)
                        .OrderBy(_=>_.GameSpread.GameId)
                        .ToList();

            int gameRowId = 0;
            foreach (var item in ugs)
            {
                var ugr = UserGameResults.FirstOrDefault(_ => _.UserGameSelection.UserGameSelectionId == item.UserGameSelectionId && _.UserGameSelection.UserId == userId);

                string expPick = item.PickTeam.TeamShortName;
                int expBet = item.Bet;
                int expResult = 0;
                int expGain = 0;
                int expLoss = 0;
                string expPicked = string.Empty;

                if (item.PickTeamId == item.GameSpread.FavoriteTeamId)
                {
                    expPicked = "Favorite";
                }
                else if (item.PickTeamId == item.GameSpread.UnderdogTeamId)
                {
                    expPicked = "Underdog";
                }
                else if (item.PickTeamId == Teams.First(_ => _.TeamLongName == "No Bet").TeamId)
                {
                    expPicked = "NoBet";
                }
                else
                {
                    expPicked = "NoPicks";
                }

                if (ugr == null)
                {
                    expResult = 0;
                    expGain = item.Bet;
                    expLoss = item.Bet * -1;
                }
                else
                {
                    expResult = ugr.BetPoints;
                    expGain = 0;
                    expLoss = 0;
                }

                AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, expPicked, expPick, expBet, expResult, expGain, expLoss, actual.GameRows[gameRowId].UsersData[userDataId]);

                gameRowId++;
            }
        }

        [Then(@"the view model user data for GameFilterId (.*) UserId (.*) should be defaulted to no bet \(hardcoded\)")]
        public void ThenTheViewModelUserDataForGameFilterIdUserIdShouldBeDefaultedToNoBetHardcoded(int p0, int p1)
        {
            int gameFilterId = p0;
            int userId = p1;
            int userDataId = userId - 1;

            var gameRowCount = 0;
            switch (gameFilterId)
            {
                case 1:
                case 2:
                case 3:
                case 12:
                case 13:
                case 14:
                case 15:
                case 16:
                case 17:
                    gameRowCount = 16;
                    break;
                case 4:
                    gameRowCount = 15;
                    break;
                case 5:
                case 6:
                case 8:
                case 9:
                case 10:
                case 11:
                    gameRowCount = 14;
                    break;
                case 7:
                    gameRowCount = 13;
                    break;
                default:
                    throw new NotImplementedException(string.Format("Not implemented for gameFilterId ({0})", gameFilterId));
            }

            for (int gameRowId = 0; gameRowId < gameRowCount; gameRowId++)
            {
                string expPick = "X";
                int expBet = 0;
                int expResult = 0;
                int expGain = 0;
                int expLoss = 0;
                string expPicked = "NoBet";

                AssertResultsByGameGameRowUserData(gameFilterId, gameRowId, userId, expPicked, expPick, expBet, expResult, expGain, expLoss, actual.GameRows[gameRowId].UsersData[userDataId]);
            }
        
        }

        [Then(@"the view model total rows should be correct for GameFilterId (.*) UserId (.*)")]
        public void ThenTheViewModelTotalRowsShouldBeCorrectForGameFilterIdUserId(int p0, int p1)
        {
            int gameFilterId = p0;
            int userId = p1;
            int userDataId = userId - 1;

            var ugs = UserGameSelections
                        .Where(_ => _.GameSpread.Game.GameFilterId == gameFilterId && _.UserId == userId)
                        .OrderBy(_=>_.GameSpread.GameId)
                        .ToList();

            int expTotal = 0;
            int expGain = 0;
            int expLoss = 0;

            foreach (var item in ugs)
            {
                var ugr = UserGameResults.FirstOrDefault(_ => _.UserGameSelection.UserGameSelectionId == item.UserGameSelectionId && _.UserGameSelection.UserId == userId);
                var gr = GameResults.FirstOrDefault(_=>_.GameSpreadId == item.GameSpreadId);

                if (gr.GamePeriod == "F")
                {
                    // then it is a final score, add to total
                    expTotal = expTotal + ugr.BetPoints;
                }
                else
                {
                    // this it is not a final score, so add to potential
                    if (item.PickTeamId == item.GameSpread.FavoriteTeamId)
                    {
                        expGain = expGain + item.Bet;
                    }
                    else if (item.PickTeamId == item.GameSpread.UnderdogTeamId)
                    {
                        expGain = expGain + (item.Bet * 2);  // TODO remove hardcoded *2 and factor in extrapoint
                    }

                    expLoss = expLoss - (item.Bet * -1);
                }
            }

            Assert.AreEqual(expTotal, actual.Totals[userDataId], string.Format("Totals not equalfor GameFilterId:{0} UserId:{1}", gameFilterId, userId));
            Assert.AreEqual(expGain, actual.PotentialGains[0], string.Format("PotentialGains not equalfor GameFilterId:{0} UserId:{1}", gameFilterId, userId));
            Assert.AreEqual(expLoss, actual.PotentialLosses[0], string.Format("PotentialLosses not equalfor GameFilterId:{0} UserId:{1}", gameFilterId, userId));
        }

        public void AssertResultsByGameGameRows(int gameFilterId, int gameRowId, string expFavoriteTeamName, string expUnderdogTeamName, decimal expSpread, string expWinnerTeamName, ResultsByGameGameRow actual)
        {
            Assert.AreEqual(expFavoriteTeamName, actual.FavoriteTeamName, "FavoriteTeamName not equal for GameFilterId:{0} GameRowId:{1}", gameFilterId, gameRowId);
            Assert.AreEqual(expUnderdogTeamName, actual.UnderdogTeamName, "UnderdogTeamName not equal for GameFilterId:{0} GameRowId:{1}", gameFilterId, gameRowId);
            Assert.AreEqual(expSpread, actual.Spread, "Spread not equal for GameFilterId:{0} GameRowId:{1}", gameFilterId, gameRowId);
            Assert.AreEqual(expWinnerTeamName, actual.WinnerTeamName, "WinnerTeamName not equal for GameFilterId:{0} GameRowId:{1}", gameFilterId, gameRowId);
        }

        public void AssertResultsByGameGameRowUserData(int gameFilterId, int gameRowId, int expUserId, string expPicked, string expPick, int expBet, int expResult, int expPotentialGain, int expPotentialLoss, ResultsByGameGameRowUserData actual)
        {
            bool expPickedFavorite = false;
            bool expPickedUnderdog = false;
            bool expPickedNoBet = false;
            bool expPickedNoPicks = false;

            if (expPicked == "Favorite") expPickedFavorite = true;
            if (expPicked == "Underdog") expPickedUnderdog = true;
            if (expPicked == "NoBet") expPickedNoBet = true;
            if (expPicked == "NoPicks") expPickedNoPicks = true;

            Assert.AreEqual(expUserId, actual.UserId, string.Format("UserId not equal for GameFilterId:{0} GameRowId:{1}", gameFilterId, gameRowId));
            Assert.AreEqual(expPickedFavorite, actual.PickedFavorite, string.Format("PickedFavorite not equal for GameFilterId:{0} GameRowId:{1} UserId:{2}", gameFilterId, gameRowId, expUserId));
            Assert.AreEqual(expPickedUnderdog, actual.PickedUnderdog, string.Format("PickedUnderdog not equal for GameFilterId:{0} GameRowId:{1} UserId:{2}", gameFilterId, gameRowId, expUserId));
            Assert.AreEqual(expPickedNoBet, actual.PickedNoBet, string.Format("PickedNoBet not match for GameFilterId:{0} GameRowId:{1} UserId:{2}", gameFilterId, gameRowId, expUserId));
            Assert.AreEqual(expPickedNoPicks, actual.PickedNoPicks, string.Format("PickedNoPicks not equal for GameFilterId:{0} GameRowId:{1} UserId:{2}", gameFilterId, gameRowId, expUserId));
            Assert.AreEqual(expPick.TrimEnd(), actual.Pick.TrimEnd(), string.Format("Pick not equal for GameFilterId:{0} GameRowId:{1} UserId:{2}", gameFilterId, gameRowId, expUserId));
            Assert.AreEqual(expBet, actual.Bet, string.Format("Bet not equal for GameFilterId:{0} GameRowId:{1} UserId:{2}", gameFilterId, gameRowId, expUserId));
            Assert.AreEqual(expPotentialGain, actual.PotentialGain, string.Format("PotentialGain not equal for GameFilterId:{0} GameRowId:{1} UserId:{2}", gameFilterId, gameRowId, expUserId));
            Assert.AreEqual(expPotentialLoss, actual.PotentialLoss, string.Format("PotentialLoss not equal for GameFilterId:{0} GameRowId:{1} UserId:{2}", gameFilterId, gameRowId, expUserId));
            Assert.AreEqual(expResult, actual.Result, string.Format("Result not equal for GameFilterId:{0} GameRowId:{1} UserId:{2}", gameFilterId, gameRowId, expUserId));

        }
    }
}
