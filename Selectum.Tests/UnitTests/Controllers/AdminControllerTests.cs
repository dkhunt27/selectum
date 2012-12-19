using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Selectum.Controllers;
using Selectum.Models;

namespace Selectum.Tests.UnitTests.Controllers
{
    [TestClass]
    public class AdminControllerTests
    {
        #region CalculateUserResultsTests
        [TestMethod]
        public void CalculateUserResultsTestHappyPath()
        {
            var adminController = new AdminController();
            int userId = 1;
            int gameFilterId = 1;
            //Team noBetPickTeam = new Team() { TeamId = 1, TeamLongName = "No Bet", TeamOtherName = "No Bet", TeamShortName = "X  " };
            var userGameResults = new List<UserGameResult>() {
                                      new UserGameResult(){ UserGameResultId = 1, UserGameSelectionId = 1, BetResult = 1, BetPoints = 2, UserGameSelection = new UserGameSelection(){UserId = userId, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = gameFilterId}}}},
                                      new UserGameResult(){ UserGameResultId = 2, UserGameSelectionId = 2, BetResult = 0, BetPoints = 0, UserGameSelection = new UserGameSelection(){UserId = userId, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = gameFilterId}}}},
                                      new UserGameResult(){ UserGameResultId = 3, UserGameSelectionId = 3, BetResult = 0, BetPoints = 0, UserGameSelection = new UserGameSelection(){UserId = userId, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = gameFilterId}}}},
                                      new UserGameResult(){ UserGameResultId = 4, UserGameSelectionId = 4, BetResult = -1, BetPoints = -1, UserGameSelection = new UserGameSelection(){UserId = userId, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = gameFilterId}}}},
                                      new UserGameResult(){ UserGameResultId = 5, UserGameSelectionId = 5, BetResult = -1, BetPoints = -1, UserGameSelection = new UserGameSelection(){UserId = userId, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = gameFilterId}}}},
                                      new UserGameResult(){ UserGameResultId = 6, UserGameSelectionId = 6, BetResult = 1, BetPoints = 1, UserGameSelection = new UserGameSelection(){UserId = userId, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = gameFilterId}}}},
                                      new UserGameResult(){ UserGameResultId = 7, UserGameSelectionId = 7, BetResult = 1, BetPoints = 3, UserGameSelection = new UserGameSelection(){UserId = userId, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = gameFilterId}}}},
                                  };

            var expected = new UserResult() { Bets = 5, GameFilterId = gameFilterId, Points = 4, UserId = userId, Wins = 3 };
            var actual = adminController.CalculateUserResults(userId, gameFilterId, userGameResults);

            Assert.AreEqual(expected.Bets, actual.Bets);
            Assert.AreEqual(expected.GameFilterId, actual.GameFilterId);
            Assert.AreEqual(expected.Points, actual.Points);
            Assert.AreEqual(expected.UserId, actual.UserId);
            Assert.AreEqual(expected.Wins, actual.Wins);
        }

        [TestMethod]
        public void CalculateUserResultsTestWrongUserIdShouldError()
        {
            var adminController = new AdminController();
            int userId = 1;
            int gameFilterId = 1;
            var userGameResults = new List<UserGameResult>() {
                                      new UserGameResult(){ UserGameResultId = 1, UserGameSelectionId = 1, BetResult = 1, BetPoints = 2, UserGameSelection = new UserGameSelection(){UserId = 2, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = gameFilterId}}}},
                                      new UserGameResult(){ UserGameResultId = 2, UserGameSelectionId = 2, BetResult = 0, BetPoints = 0, UserGameSelection = new UserGameSelection(){UserId = 2, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = gameFilterId}}}},
                                      new UserGameResult(){ UserGameResultId = 3, UserGameSelectionId = 3, BetResult = 0, BetPoints = 0, UserGameSelection = new UserGameSelection(){UserId = userId, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = gameFilterId}}}},
                                      new UserGameResult(){ UserGameResultId = 4, UserGameSelectionId = 4, BetResult = -1, BetPoints = -1, UserGameSelection = new UserGameSelection(){UserId = userId, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = gameFilterId}}}},
                                      new UserGameResult(){ UserGameResultId = 5, UserGameSelectionId = 5, BetResult = -1, BetPoints = -1, UserGameSelection = new UserGameSelection(){UserId = userId, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = gameFilterId}}}},
                                      new UserGameResult(){ UserGameResultId = 6, UserGameSelectionId = 6, BetResult = 1, BetPoints = 1, UserGameSelection = new UserGameSelection(){UserId = userId, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = gameFilterId}}}},
                                      new UserGameResult(){ UserGameResultId = 7, UserGameSelectionId = 7, BetResult = 1, BetPoints = 3, UserGameSelection = new UserGameSelection(){UserId = userId, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = gameFilterId}}}},
                                  };

            var expected = new UserResult() { Bets = 5, GameFilterId = gameFilterId, Points = 4, UserId = userId, Wins = 3 };
            try
            {
                var actual = adminController.CalculateUserResults(userId, gameFilterId, userGameResults);
                Assert.Fail("Should have thrown exception");
            }
            catch (Exception ex)
            {
                Assert.IsInstanceOfType(ex, typeof(ArgumentException));
                Assert.IsTrue(ex.Message.Contains("The user game result list has records for the wrong user (2) and/or game filter (0)"));
            }
        }

        [TestMethod]
        public void CalculateUserResultsTestWrongGameFilterIdShouldError()
        {
            var adminController = new AdminController();
            int userId = 1;
            int gameFilterId = 1;
            var userGameResults = new List<UserGameResult>() {
                                      new UserGameResult(){ UserGameResultId = 1, UserGameSelectionId = 1, BetResult = 1, BetPoints = 2, UserGameSelection = new UserGameSelection(){UserId = userId, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = gameFilterId}}}},
                                      new UserGameResult(){ UserGameResultId = 2, UserGameSelectionId = 2, BetResult = 0, BetPoints = 0, UserGameSelection = new UserGameSelection(){UserId = userId, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = gameFilterId}}}},
                                      new UserGameResult(){ UserGameResultId = 3, UserGameSelectionId = 3, BetResult = 0, BetPoints = 0, UserGameSelection = new UserGameSelection(){UserId = userId, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = gameFilterId}}}},
                                      new UserGameResult(){ UserGameResultId = 4, UserGameSelectionId = 4, BetResult = -1, BetPoints = -1, UserGameSelection = new UserGameSelection(){UserId = userId, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = 2}}}},
                                      new UserGameResult(){ UserGameResultId = 5, UserGameSelectionId = 5, BetResult = -1, BetPoints = -1, UserGameSelection = new UserGameSelection(){UserId = userId, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = 2}}}},
                                      new UserGameResult(){ UserGameResultId = 6, UserGameSelectionId = 6, BetResult = 1, BetPoints = 1, UserGameSelection = new UserGameSelection(){UserId = userId, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = gameFilterId}}}},
                                      new UserGameResult(){ UserGameResultId = 7, UserGameSelectionId = 7, BetResult = 1, BetPoints = 3, UserGameSelection = new UserGameSelection(){UserId = userId, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = gameFilterId}}}},
                                  };

            var expected = new UserResult() { Bets = 5, GameFilterId = gameFilterId, Points = 4, UserId = userId, Wins = 3 };
            try
            {
                var actual = adminController.CalculateUserResults(userId, gameFilterId, userGameResults);
                Assert.Fail("Should have thrown exception");
            }
            catch (Exception ex)
            {
                Assert.IsInstanceOfType(ex, typeof(ArgumentException));
                Assert.IsTrue(ex.Message.Contains("The user game result list has records for the wrong user (0) and/or game filter (2)"));
            }
        }

        [TestMethod]
        public void CalculateUserResultsTestWrongUserIdAndGameFilterIdShouldError()
        {
            var adminController = new AdminController();
            int userId = 1;
            int gameFilterId = 1;
            var userGameResults = new List<UserGameResult>() {
                                      new UserGameResult(){ UserGameResultId = 1, UserGameSelectionId = 1, BetResult = 1, BetPoints = 2, UserGameSelection = new UserGameSelection(){UserId = 2, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = gameFilterId}}}},
                                      new UserGameResult(){ UserGameResultId = 2, UserGameSelectionId = 2, BetResult = 0, BetPoints = 0, UserGameSelection = new UserGameSelection(){UserId = 2, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = 2}}}},
                                      new UserGameResult(){ UserGameResultId = 3, UserGameSelectionId = 3, BetResult = 0, BetPoints = 0, UserGameSelection = new UserGameSelection(){UserId = userId, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = gameFilterId}}}},
                                      new UserGameResult(){ UserGameResultId = 4, UserGameSelectionId = 4, BetResult = -1, BetPoints = -1, UserGameSelection = new UserGameSelection(){UserId = userId, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = gameFilterId}}}},
                                      new UserGameResult(){ UserGameResultId = 5, UserGameSelectionId = 5, BetResult = -1, BetPoints = -1, UserGameSelection = new UserGameSelection(){UserId = userId, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = gameFilterId}}}},
                                      new UserGameResult(){ UserGameResultId = 6, UserGameSelectionId = 6, BetResult = 1, BetPoints = 1, UserGameSelection = new UserGameSelection(){UserId = userId, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = 2}}}},
                                      new UserGameResult(){ UserGameResultId = 7, UserGameSelectionId = 7, BetResult = 1, BetPoints = 3, UserGameSelection = new UserGameSelection(){UserId = userId, GameSpread = new GameSpread(){Game = new Game(){GameFilterId = gameFilterId}}}},
                                  };

            var expected = new UserResult() { Bets = 5, GameFilterId = gameFilterId, Points = 4, UserId = userId, Wins = 3 };
            try
            {
                var actual = adminController.CalculateUserResults(userId, gameFilterId, userGameResults);
                Assert.Fail("Should have thrown exception");
            }
            catch (Exception ex)
            {
                Assert.IsInstanceOfType(ex, typeof(ArgumentException));
                Assert.IsTrue(ex.Message.Contains("The user game result list has records for the wrong user (2) and/or game filter (2)"));
            }
        }
        #endregion

        #region CalculateUserGameResultsTests
        [TestMethod]
        public void CalculateUserGameResultsTestAllFavoriteWins()
        {
            var adminController = new AdminController();
            int userId = 1;
            int gameFilterId = 1;
            int extraPointFactorPerBetOverMin = 2;
            Team noBetPickTeam = new Team() { TeamId = 1, TeamLongName = "No Bet", TeamOtherName = "No Bet", TeamShortName = "X  " };
            var gameResults = new List<GameResult>() 
                                    { 
                                        new GameResult(){ GameSpreadId = 1, WinnerTeamId = 10, GameSpread = new GameSpread(){UnderdogTeamId = 11, Game = new Game(){GameFilterId =1}}}, 
                                        new GameResult(){ GameSpreadId = 2, WinnerTeamId = 20, GameSpread = new GameSpread(){UnderdogTeamId = 21, Game = new Game(){GameFilterId =1}}}, 
                                        new GameResult(){ GameSpreadId = 3, WinnerTeamId = 30, GameSpread = new GameSpread(){UnderdogTeamId = 31, Game = new Game(){GameFilterId =1}}}
                                    };
            var userGameSelections = new List<UserGameSelection>()
                                    {
                                        new UserGameSelection(){ UserGameSelectionId = 1, UserId = 1, GameSpreadId = 1, PickTeamId = 10, Bet = 3, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}},
                                        new UserGameSelection(){ UserGameSelectionId = 2, UserId = 1, GameSpreadId = 2, PickTeamId = 20, Bet = 2, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}},
                                        new UserGameSelection(){ UserGameSelectionId = 3, UserId = 1, GameSpreadId = 3, PickTeamId = 30, Bet = 1, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}}
                                    };


            var expected = new List<UserGameResult>() 
                                    {
                                        new UserGameResult(){ UserGameSelectionId=1, BetResult=1, BetPoints=3},
                                        new UserGameResult(){ UserGameSelectionId=2, BetResult=1, BetPoints=2},
                                        new UserGameResult(){ UserGameSelectionId=3, BetResult=1, BetPoints=1}
                                    };
            var actual = adminController.CalculateUserGameResults(userId, gameFilterId, gameResults, userGameSelections, noBetPickTeam, extraPointFactorPerBetOverMin);

            Assert.AreEqual(expected.Count, actual.Count);
            foreach (var exp in expected)
            {
                Assert.AreEqual(exp.UserGameSelectionId, actual.FirstOrDefault(a => a.UserGameSelectionId == exp.UserGameSelectionId).UserGameSelectionId);
                Assert.AreEqual(exp.BetPoints, actual.FirstOrDefault(a => a.UserGameSelectionId == exp.UserGameSelectionId).BetPoints);
                Assert.AreEqual(exp.BetResult, actual.FirstOrDefault(a => a.UserGameSelectionId == exp.UserGameSelectionId).BetResult);
            }
        }

        [TestMethod]
        public void CalculateUserGameResultsTestAllFavoriteLosses()
        {
            var adminController = new AdminController();
            int userId = 1;
            int gameFilterId = 1;
            int extraPointFactorPerBetOverMin = 2;
            Team noBetPickTeam = new Team() { TeamId = 1, TeamLongName = "No Bet", TeamOtherName = "No Bet", TeamShortName = "X  " };
            var gameResults = new List<GameResult>() 
                                    { 
                                        new GameResult(){ GameSpreadId = 1, WinnerTeamId = 11, GameSpread = new GameSpread(){UnderdogTeamId = 11, Game = new Game(){GameFilterId =1}}}, 
                                        new GameResult(){ GameSpreadId = 2, WinnerTeamId = 21, GameSpread = new GameSpread(){UnderdogTeamId = 21, Game = new Game(){GameFilterId =1}}}, 
                                        new GameResult(){ GameSpreadId = 3, WinnerTeamId = 31, GameSpread = new GameSpread(){UnderdogTeamId = 31, Game = new Game(){GameFilterId =1}}}
                                    };
            var userGameSelections = new List<UserGameSelection>()
                                    {
                                        new UserGameSelection(){ UserGameSelectionId = 1, UserId = 1, GameSpreadId = 1, PickTeamId = 10, Bet = 3, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}},
                                        new UserGameSelection(){ UserGameSelectionId = 2, UserId = 1, GameSpreadId = 2, PickTeamId = 20, Bet = 2, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}},
                                        new UserGameSelection(){ UserGameSelectionId = 3, UserId = 1, GameSpreadId = 3, PickTeamId = 30, Bet = 1, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}}
                                    };


            var expected = new List<UserGameResult>() 
                                    {
                                        new UserGameResult(){ UserGameSelectionId=1, BetResult=-1, BetPoints=-3},
                                        new UserGameResult(){ UserGameSelectionId=2, BetResult=-1, BetPoints=-2},
                                        new UserGameResult(){ UserGameSelectionId=3, BetResult=-1, BetPoints=-1}
                                    };
            var actual = adminController.CalculateUserGameResults(userId, gameFilterId, gameResults, userGameSelections, noBetPickTeam, extraPointFactorPerBetOverMin);

            Assert.AreEqual(expected.Count, actual.Count);
            foreach (var exp in expected)
            {
                Assert.AreEqual(exp.UserGameSelectionId, actual.FirstOrDefault(a => a.UserGameSelectionId == exp.UserGameSelectionId).UserGameSelectionId);
                Assert.AreEqual(exp.BetPoints, actual.FirstOrDefault(a => a.UserGameSelectionId == exp.UserGameSelectionId).BetPoints);
                Assert.AreEqual(exp.BetResult, actual.FirstOrDefault(a => a.UserGameSelectionId == exp.UserGameSelectionId).BetResult);
            }
        }

        [TestMethod]
        public void CalculateUserGameResultsTestAllUnderdogWins()
        {
            var adminController = new AdminController();
            int userId = 1;
            int gameFilterId = 1;
            int extraPointFactorPerBetOverMin = 2;
            Team noBetPickTeam = new Team() { TeamId = 1, TeamLongName = "No Bet", TeamOtherName = "No Bet", TeamShortName = "X  " };
            var gameResults = new List<GameResult>() 
                                    { 
                                        new GameResult(){ GameSpreadId = 1, WinnerTeamId = 11, GameSpread = new GameSpread(){UnderdogTeamId = 11, Game = new Game(){GameFilterId =1}}}, 
                                        new GameResult(){ GameSpreadId = 2, WinnerTeamId = 21, GameSpread = new GameSpread(){UnderdogTeamId = 21, Game = new Game(){GameFilterId =1}}}, 
                                        new GameResult(){ GameSpreadId = 3, WinnerTeamId = 31, GameSpread = new GameSpread(){UnderdogTeamId = 31, Game = new Game(){GameFilterId =1}}}
                                    };
            var userGameSelections = new List<UserGameSelection>()
                                    {
                                        new UserGameSelection(){ UserGameSelectionId = 1, UserId = 1, GameSpreadId = 1, PickTeamId = 11, Bet = 3, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}},
                                        new UserGameSelection(){ UserGameSelectionId = 2, UserId = 1, GameSpreadId = 2, PickTeamId = 21, Bet = 2, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}},
                                        new UserGameSelection(){ UserGameSelectionId = 3, UserId = 1, GameSpreadId = 3, PickTeamId = 31, Bet = 1, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}}
                                    };


            var expected = new List<UserGameResult>() 
                                    {
                                        new UserGameResult(){ UserGameSelectionId=1, BetResult=1, BetPoints=6},
                                        new UserGameResult(){ UserGameSelectionId=2, BetResult=1, BetPoints=4},
                                        new UserGameResult(){ UserGameSelectionId=3, BetResult=1, BetPoints=2}
                                    };
            var actual = adminController.CalculateUserGameResults(userId, gameFilterId, gameResults, userGameSelections, noBetPickTeam, extraPointFactorPerBetOverMin);

            Assert.AreEqual(expected.Count, actual.Count);
            foreach (var exp in expected)
            {
                Assert.AreEqual(exp.UserGameSelectionId, actual.FirstOrDefault(a => a.UserGameSelectionId == exp.UserGameSelectionId).UserGameSelectionId);
                Assert.AreEqual(exp.BetPoints, actual.FirstOrDefault(a => a.UserGameSelectionId == exp.UserGameSelectionId).BetPoints);
                Assert.AreEqual(exp.BetResult, actual.FirstOrDefault(a => a.UserGameSelectionId == exp.UserGameSelectionId).BetResult);
            }
        }

        [TestMethod]
        public void CalculateUserGameResultsTestAllUnderdogLosses()
        {
            var adminController = new AdminController();
            int userId = 1;
            int gameFilterId = 1;
            int extraPointFactorPerBetOverMin = 2;
            Team noBetPickTeam = new Team() { TeamId = 1, TeamLongName = "No Bet", TeamOtherName = "No Bet", TeamShortName = "X  " };
            var gameResults = new List<GameResult>() 
                                    { 
                                        new GameResult(){ GameSpreadId = 1, WinnerTeamId = 10, GameSpread = new GameSpread(){UnderdogTeamId = 11, Game = new Game(){GameFilterId =1}}}, 
                                        new GameResult(){ GameSpreadId = 2, WinnerTeamId = 20, GameSpread = new GameSpread(){UnderdogTeamId = 21, Game = new Game(){GameFilterId =1}}}, 
                                        new GameResult(){ GameSpreadId = 3, WinnerTeamId = 30, GameSpread = new GameSpread(){UnderdogTeamId = 31, Game = new Game(){GameFilterId =1}}}
                                    };
            var userGameSelections = new List<UserGameSelection>()
                                    {
                                        new UserGameSelection(){ UserGameSelectionId = 1, UserId = 1, GameSpreadId = 1, PickTeamId = 11, Bet = 3, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}},
                                        new UserGameSelection(){ UserGameSelectionId = 2, UserId = 1, GameSpreadId = 2, PickTeamId = 21, Bet = 2, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}},
                                        new UserGameSelection(){ UserGameSelectionId = 3, UserId = 1, GameSpreadId = 3, PickTeamId = 31, Bet = 1, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}}
                                    };


            var expected = new List<UserGameResult>() 
                                    {
                                        new UserGameResult(){ UserGameSelectionId=1, BetResult=-1, BetPoints=-3},
                                        new UserGameResult(){ UserGameSelectionId=2, BetResult=-1, BetPoints=-2},
                                        new UserGameResult(){ UserGameSelectionId=3, BetResult=-1, BetPoints=-1}
                                    };
            var actual = adminController.CalculateUserGameResults(userId, gameFilterId, gameResults, userGameSelections, noBetPickTeam, extraPointFactorPerBetOverMin);

            Assert.AreEqual(expected.Count, actual.Count);
            foreach (var exp in expected)
            {
                Assert.AreEqual(exp.UserGameSelectionId, actual.FirstOrDefault(a => a.UserGameSelectionId == exp.UserGameSelectionId).UserGameSelectionId);
                Assert.AreEqual(exp.BetPoints, actual.FirstOrDefault(a => a.UserGameSelectionId == exp.UserGameSelectionId).BetPoints);
                Assert.AreEqual(exp.BetResult, actual.FirstOrDefault(a => a.UserGameSelectionId == exp.UserGameSelectionId).BetResult);
            }
        }

        [TestMethod]
        public void CalculateUserGameResultsTestAllNoBets()
        {
            var adminController = new AdminController();
            int userId = 1;
            int gameFilterId = 1;
            int extraPointFactorPerBetOverMin = 2;
            Team noBetPickTeam = new Team() { TeamId = 1, TeamLongName = "No Bet", TeamOtherName = "No Bet", TeamShortName = "X  " };
            var gameResults = new List<GameResult>() 
                                    { 
                                        new GameResult(){ GameSpreadId = 1, WinnerTeamId = 10, GameSpread = new GameSpread(){UnderdogTeamId = 11, Game = new Game(){GameFilterId =1}}}, 
                                        new GameResult(){ GameSpreadId = 2, WinnerTeamId = 20, GameSpread = new GameSpread(){UnderdogTeamId = 21, Game = new Game(){GameFilterId =1}}}, 
                                        new GameResult(){ GameSpreadId = 3, WinnerTeamId = 30, GameSpread = new GameSpread(){UnderdogTeamId = 31, Game = new Game(){GameFilterId =1}}}
                                    };
            var userGameSelections = new List<UserGameSelection>()
                                    {
                                        new UserGameSelection(){ UserGameSelectionId = 1, UserId = 1, GameSpreadId = 1, PickTeamId = 1, Bet = 3, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}},
                                        new UserGameSelection(){ UserGameSelectionId = 2, UserId = 1, GameSpreadId = 2, PickTeamId = 1, Bet = 2, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}},
                                        new UserGameSelection(){ UserGameSelectionId = 3, UserId = 1, GameSpreadId = 3, PickTeamId = 1, Bet = 1, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}}
                                    };


            var expected = new List<UserGameResult>() 
                                    {
                                        new UserGameResult(){ UserGameSelectionId=1, BetResult=0, BetPoints=0},
                                        new UserGameResult(){ UserGameSelectionId=2, BetResult=0, BetPoints=0},
                                        new UserGameResult(){ UserGameSelectionId=3, BetResult=0, BetPoints=0}
                                    };
            var actual = adminController.CalculateUserGameResults(userId, gameFilterId, gameResults, userGameSelections, noBetPickTeam, extraPointFactorPerBetOverMin);

            Assert.AreEqual(expected.Count, actual.Count);
            foreach (var exp in expected)
            {
                Assert.AreEqual(exp.UserGameSelectionId, actual.FirstOrDefault(a => a.UserGameSelectionId == exp.UserGameSelectionId).UserGameSelectionId);
                Assert.AreEqual(exp.BetPoints, actual.FirstOrDefault(a => a.UserGameSelectionId == exp.UserGameSelectionId).BetPoints);
                Assert.AreEqual(exp.BetResult, actual.FirstOrDefault(a => a.UserGameSelectionId == exp.UserGameSelectionId).BetResult);
            }
        }

        [TestMethod]
        public void CalculateUserGameResultsTestMixOfBets()
        {
            var adminController = new AdminController();
            int userId = 1;
            int gameFilterId = 1;
            int extraPointFactorPerBetOverMin = 2;
            Team noBetPickTeam = new Team() { TeamId = 1, TeamLongName = "No Bet", TeamOtherName = "No Bet", TeamShortName = "X  " };
            var gameResults = new List<GameResult>() 
                                    { 
                                        new GameResult(){ GameSpreadId = 1, WinnerTeamId = 10, GameSpread = new GameSpread(){UnderdogTeamId = 11, Game = new Game(){GameFilterId =1}}}, 
                                        new GameResult(){ GameSpreadId = 2, WinnerTeamId = 20, GameSpread = new GameSpread(){UnderdogTeamId = 21, Game = new Game(){GameFilterId =1}}}, 
                                        new GameResult(){ GameSpreadId = 3, WinnerTeamId = 30, GameSpread = new GameSpread(){UnderdogTeamId = 31, Game = new Game(){GameFilterId =1}}},
                                        new GameResult(){ GameSpreadId = 4, WinnerTeamId = 41, GameSpread = new GameSpread(){UnderdogTeamId = 41, Game = new Game(){GameFilterId =1}}}, 
                                        new GameResult(){ GameSpreadId = 5, WinnerTeamId = 51, GameSpread = new GameSpread(){UnderdogTeamId = 51, Game = new Game(){GameFilterId =1}}}
                                    };
            var userGameSelections = new List<UserGameSelection>()
                                    {
                                        new UserGameSelection(){ UserGameSelectionId = 1, UserId = 1, GameSpreadId = 1, PickTeamId = 1, Bet = 0, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}},
                                        new UserGameSelection(){ UserGameSelectionId = 2, UserId = 1, GameSpreadId = 2, PickTeamId = 20, Bet = 2, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}},
                                        new UserGameSelection(){ UserGameSelectionId = 3, UserId = 1, GameSpreadId = 3, PickTeamId = 31, Bet = 4, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}},
                                        new UserGameSelection(){ UserGameSelectionId = 4, UserId = 1, GameSpreadId = 4, PickTeamId = 40, Bet = 2, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}},
                                        new UserGameSelection(){ UserGameSelectionId = 5, UserId = 1, GameSpreadId = 5, PickTeamId = 51, Bet = 5, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}}
                                    };


            var expected = new List<UserGameResult>() 
                                    {
                                        new UserGameResult(){ UserGameSelectionId=1, BetResult=0, BetPoints=0},
                                        new UserGameResult(){ UserGameSelectionId=2, BetResult=1, BetPoints=2},
                                        new UserGameResult(){ UserGameSelectionId=3, BetResult=-1, BetPoints=-4},
                                        new UserGameResult(){ UserGameSelectionId=4, BetResult=-1, BetPoints=-2},
                                        new UserGameResult(){ UserGameSelectionId=5, BetResult=1, BetPoints=10}
                                    };
            var actual = adminController.CalculateUserGameResults(userId, gameFilterId, gameResults, userGameSelections, noBetPickTeam, extraPointFactorPerBetOverMin);

            Assert.AreEqual(expected.Count, actual.Count);
            foreach (var exp in expected)
            {
                Assert.AreEqual(exp.UserGameSelectionId, actual.FirstOrDefault(a => a.UserGameSelectionId == exp.UserGameSelectionId).UserGameSelectionId);
                Assert.AreEqual(exp.BetPoints, actual.FirstOrDefault(a => a.UserGameSelectionId == exp.UserGameSelectionId).BetPoints);
                Assert.AreEqual(exp.BetResult, actual.FirstOrDefault(a => a.UserGameSelectionId == exp.UserGameSelectionId).BetResult);
            }
        }

        [TestMethod]
        public void CalculateUserGameResultsTestIfMissingGameSpreadThrowError()
        {
            var adminController = new AdminController();
            int userId = 1;
            int gameFilterId = 1;
            int extraPointFactorPerBetOverMin = 2;
            Team noBetPickTeam = new Team() { TeamId = 1, TeamLongName = "No Bet", TeamOtherName = "No Bet", TeamShortName = "X  " };
            var gameResults = new List<GameResult>() 
                                    { 
                                        new GameResult(){ GameSpreadId = 1, WinnerTeamId = 10, GameSpread = new GameSpread(){UnderdogTeamId = 11, Game = new Game(){GameFilterId =1}}}, 
                                        new GameResult(){ GameSpreadId = 2, WinnerTeamId = 20, GameSpread = new GameSpread(){UnderdogTeamId = 21, Game = new Game(){GameFilterId =1}}}, 
                                        new GameResult(){ GameSpreadId = 3, WinnerTeamId = 30, GameSpread = new GameSpread(){UnderdogTeamId = 31, Game = new Game(){GameFilterId =1}}}
                                    };
            var userGameSelections = new List<UserGameSelection>()
                                    {
                                        new UserGameSelection(){ UserGameSelectionId = 1, UserId = 1, GameSpreadId = 1, PickTeamId = 10, Bet = 3, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}},
                                        new UserGameSelection(){ UserGameSelectionId = 2, UserId = 1, GameSpreadId = 2, PickTeamId = 20, Bet = 2, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}},
                                        new UserGameSelection(){ UserGameSelectionId = 3, UserId = 1, GameSpreadId = 4, PickTeamId = 30, Bet = 1, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}}
                                    };


            var expected = new List<UserGameResult>() 
                                    {
                                        new UserGameResult(){ UserGameSelectionId=1, BetResult=1, BetPoints=3},
                                        new UserGameResult(){ UserGameSelectionId=2, BetResult=1, BetPoints=2},
                                        new UserGameResult(){ UserGameSelectionId=3, BetResult=1, BetPoints=1}
                                    };
            try
            {
                var actual = adminController.CalculateUserGameResults(userId, gameFilterId, gameResults, userGameSelections, noBetPickTeam, extraPointFactorPerBetOverMin);
                Assert.Fail("Should have thrown an exception");
            }
            catch (Exception ex)
            {
                Assert.IsInstanceOfType(ex, typeof(ArgumentException));
                Assert.IsTrue(ex.Message.Contains("UserId:1 is missing a selection for GameSpreadId:3"));
            }
        }

        [TestMethod]
        public void CalculateUserGameResultsTestWrongUserIdShouldError()
        {
            var adminController = new AdminController();
            int userId = 1;
            int gameFilterId = 1;
            int extraPointFactorPerBetOverMin = 2;
            Team noBetPickTeam = new Team() { TeamId = 1, TeamLongName = "No Bet", TeamOtherName = "No Bet", TeamShortName = "X  " };
            var gameResults = new List<GameResult>() 
                                    { 
                                        new GameResult(){ GameSpreadId = 1, WinnerTeamId = 10, GameSpread = new GameSpread(){UnderdogTeamId = 11, Game = new Game(){GameFilterId =1}}}, 
                                        new GameResult(){ GameSpreadId = 2, WinnerTeamId = 20, GameSpread = new GameSpread(){UnderdogTeamId = 21, Game = new Game(){GameFilterId =1}}}, 
                                        new GameResult(){ GameSpreadId = 3, WinnerTeamId = 30, GameSpread = new GameSpread(){UnderdogTeamId = 31, Game = new Game(){GameFilterId =1}}}
                                    };
            var userGameSelections = new List<UserGameSelection>()
                                    {
                                        new UserGameSelection(){ UserGameSelectionId = 1, UserId = 1, GameSpreadId = 1, PickTeamId = 10, Bet = 3, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}},
                                        new UserGameSelection(){ UserGameSelectionId = 2, UserId = 2, GameSpreadId = 2, PickTeamId = 20, Bet = 2, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}},
                                        new UserGameSelection(){ UserGameSelectionId = 3, UserId = 1, GameSpreadId = 4, PickTeamId = 30, Bet = 1, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}}
                                    };


            var expected = new List<UserGameResult>() 
                                    {
                                        new UserGameResult(){ UserGameSelectionId=1, BetResult=1, BetPoints=3},
                                        new UserGameResult(){ UserGameSelectionId=2, BetResult=1, BetPoints=2},
                                        new UserGameResult(){ UserGameSelectionId=3, BetResult=1, BetPoints=1}
                                    };
            try
            {
                var actual = adminController.CalculateUserGameResults(userId, gameFilterId, gameResults, userGameSelections, noBetPickTeam, extraPointFactorPerBetOverMin);
                Assert.Fail("Should have thrown an exception");
            }
            catch (Exception ex)
            {
                Assert.IsInstanceOfType(ex, typeof(ArgumentException));
                Assert.IsTrue(ex.Message.Contains("The user game selection list has records for the wrong user (1) and/or game filter (0)"));
            }
        }

                [TestMethod]
        public void CalculateUserGameResultsTestWrongGameFilterIdShouldError()
        {
            var adminController = new AdminController();
            int userId = 1;
            int gameFilterId = 1;
            int extraPointFactorPerBetOverMin = 2;
            Team noBetPickTeam = new Team() { TeamId = 1, TeamLongName = "No Bet", TeamOtherName = "No Bet", TeamShortName = "X  " };
            var gameResults = new List<GameResult>() 
                                    { 
                                        new GameResult(){ GameSpreadId = 1, WinnerTeamId = 10, GameSpread = new GameSpread(){UnderdogTeamId = 11, Game = new Game(){GameFilterId =1}}}, 
                                        new GameResult(){ GameSpreadId = 2, WinnerTeamId = 20, GameSpread = new GameSpread(){UnderdogTeamId = 21, Game = new Game(){GameFilterId =1}}}, 
                                        new GameResult(){ GameSpreadId = 3, WinnerTeamId = 30, GameSpread = new GameSpread(){UnderdogTeamId = 31, Game = new Game(){GameFilterId =1}}}
                                    };
            var userGameSelections = new List<UserGameSelection>()
                                    {
                                        new UserGameSelection(){ UserGameSelectionId = 1, UserId = 1, GameSpreadId = 1, PickTeamId = 10, Bet = 3, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}},
                                        new UserGameSelection(){ UserGameSelectionId = 2, UserId = 1, GameSpreadId = 2, PickTeamId = 20, Bet = 2, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =3}}},
                                        new UserGameSelection(){ UserGameSelectionId = 3, UserId = 1, GameSpreadId = 4, PickTeamId = 30, Bet = 1, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =3}}}
                                    };


            var expected = new List<UserGameResult>() 
                                    {
                                        new UserGameResult(){ UserGameSelectionId=1, BetResult=1, BetPoints=3},
                                        new UserGameResult(){ UserGameSelectionId=2, BetResult=1, BetPoints=2},
                                        new UserGameResult(){ UserGameSelectionId=3, BetResult=1, BetPoints=1}
                                    };
            try
            {
                var actual = adminController.CalculateUserGameResults(userId, gameFilterId, gameResults, userGameSelections, noBetPickTeam, extraPointFactorPerBetOverMin);
                Assert.Fail("Should have thrown an exception");
            }
            catch (Exception ex)
            {
                Assert.IsInstanceOfType(ex, typeof(ArgumentException));
                Assert.IsTrue(ex.Message.Contains("The user game selection list has records for the wrong user (0) and/or game filter (2)"));
            }
        }

        [TestMethod]
        public void CalculateUserGameResultsTestWrongUserIdAndGameFilterIdShouldError()
        {
            var adminController = new AdminController();
            int userId = 1;
            int gameFilterId = 1;
            int extraPointFactorPerBetOverMin = 2;
            Team noBetPickTeam = new Team() { TeamId = 1, TeamLongName = "No Bet", TeamOtherName = "No Bet", TeamShortName = "X  " };
            var gameResults = new List<GameResult>() 
                                    { 
                                        new GameResult(){ GameSpreadId = 1, WinnerTeamId = 10, GameSpread = new GameSpread(){UnderdogTeamId = 11, Game = new Game(){GameFilterId =1}}}, 
                                        new GameResult(){ GameSpreadId = 2, WinnerTeamId = 20, GameSpread = new GameSpread(){UnderdogTeamId = 21, Game = new Game(){GameFilterId =1}}}, 
                                        new GameResult(){ GameSpreadId = 3, WinnerTeamId = 30, GameSpread = new GameSpread(){UnderdogTeamId = 31, Game = new Game(){GameFilterId =1}}}
                                    };
            var userGameSelections = new List<UserGameSelection>()
                                    {
                                        new UserGameSelection(){ UserGameSelectionId = 1, UserId = 1, GameSpreadId = 1, PickTeamId = 10, Bet = 3, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}},
                                        new UserGameSelection(){ UserGameSelectionId = 2, UserId = 1, GameSpreadId = 2, PickTeamId = 20, Bet = 2, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =4}}},
                                        new UserGameSelection(){ UserGameSelectionId = 3, UserId = 2, GameSpreadId = 4, PickTeamId = 30, Bet = 1, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =5}}}
                                    };


            var expected = new List<UserGameResult>() 
                                    {
                                        new UserGameResult(){ UserGameSelectionId=1, BetResult=1, BetPoints=3},
                                        new UserGameResult(){ UserGameSelectionId=2, BetResult=1, BetPoints=2},
                                        new UserGameResult(){ UserGameSelectionId=3, BetResult=1, BetPoints=1}
                                    };
            try
            {
                var actual = adminController.CalculateUserGameResults(userId, gameFilterId, gameResults, userGameSelections, noBetPickTeam, extraPointFactorPerBetOverMin);
                Assert.Fail("Should have thrown an exception");
            }
            catch (Exception ex)
            {
                Assert.IsInstanceOfType(ex, typeof(ArgumentException));
                Assert.IsTrue(ex.Message.Contains("The user game selection list has records for the wrong user (1) and/or game filter (2)"));
            }
        }

        [TestMethod]
        public void CalculateUserGameResultsTestWrongGameFilterIdGameResultsShouldError()
        {
            var adminController = new AdminController();
            int userId = 1;
            int gameFilterId = 1;
            int extraPointFactorPerBetOverMin = 2;
            Team noBetPickTeam = new Team() { TeamId = 1, TeamLongName = "No Bet", TeamOtherName = "No Bet", TeamShortName = "X  " };
            var gameResults = new List<GameResult>() 
                                    { 
                                        new GameResult(){ GameSpreadId = 1, WinnerTeamId = 10, GameSpread = new GameSpread(){UnderdogTeamId = 11, Game = new Game(){GameFilterId =1}}}, 
                                        new GameResult(){ GameSpreadId = 2, WinnerTeamId = 20, GameSpread = new GameSpread(){UnderdogTeamId = 21, Game = new Game(){GameFilterId =2}}}, 
                                        new GameResult(){ GameSpreadId = 3, WinnerTeamId = 30, GameSpread = new GameSpread(){UnderdogTeamId = 31, Game = new Game(){GameFilterId =1}}}
                                    };
            var userGameSelections = new List<UserGameSelection>()
                                    {
                                        new UserGameSelection(){ UserGameSelectionId = 1, UserId = 1, GameSpreadId = 1, PickTeamId = 10, Bet = 3, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}},
                                        new UserGameSelection(){ UserGameSelectionId = 2, UserId = 1, GameSpreadId = 2, PickTeamId = 20, Bet = 2, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}},
                                        new UserGameSelection(){ UserGameSelectionId = 3, UserId = 1, GameSpreadId = 4, PickTeamId = 30, Bet = 1, GameSpread = new GameSpread(){Game = new Game(){GameFilterId =1}}}
                                    };


            var expected = new List<UserGameResult>() 
                                    {
                                        new UserGameResult(){ UserGameSelectionId=1, BetResult=1, BetPoints=3},
                                        new UserGameResult(){ UserGameSelectionId=2, BetResult=1, BetPoints=2},
                                        new UserGameResult(){ UserGameSelectionId=3, BetResult=1, BetPoints=1}
                                    };
            try
            {
                var actual = adminController.CalculateUserGameResults(userId, gameFilterId, gameResults, userGameSelections, noBetPickTeam, extraPointFactorPerBetOverMin);
                Assert.Fail("Should have thrown an exception");
            }
            catch (Exception ex)
            {
                Assert.IsInstanceOfType(ex, typeof(ArgumentException));
                Assert.IsTrue(ex.Message.Contains("The game result list has records for the wrong game filter (1)"));
            }
        }
        #endregion
    }
}
