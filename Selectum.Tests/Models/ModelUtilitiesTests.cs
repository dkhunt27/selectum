using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Selectum.Models;
using System.Collections.Generic;
using Selectum.DAL;
using System.Linq;

namespace Selectum.Tests.Models
{
    [TestClass]
    public class ModelUtilitiesTests
    {
        #region GetGameFilterByDateTests
        [TestMethod]
        public void GetGameFilterByDateTestsSearchDateEqualsStartDateReturnsCorrect()
        {
            var modelUtils = new ModelUtilities();
            var initializer = new ModelDataInitializer();
            List<GameFilter> gameFilters = initializer.InitializeGameFilters();

            var actual = modelUtils.GetGameFilterByDate(gameFilters, new DateTime(2012, 09, 4));
            Assert.AreEqual("Week 01", actual.GameFilterName);
        }

        [TestMethod]
        public void GetGameFilterByDateTestsSearchDateEqualsEndDateReturnsCorrect()
        {
            var modelUtils = new ModelUtilities();
            var initializer = new ModelDataInitializer();
            List<GameFilter> gameFilters = initializer.InitializeGameFilters();

            var actual = modelUtils.GetGameFilterByDate(gameFilters, new DateTime(2012, 09, 24, 23, 59, 59));
            Assert.AreEqual("Week 03", actual.GameFilterName);
        }

        [TestMethod]
        public void GetGameFilterByDateTestsSearchDateBeforeStartDateReturnsError()
        {
            var modelUtils = new ModelUtilities();
            var initializer = new ModelDataInitializer();
            List<GameFilter> gameFilters = initializer.InitializeGameFilters();

            var actual = modelUtils.GetGameFilterByDate(gameFilters, new DateTime(2011, 07, 4));
            Assert.AreEqual(null, actual);
        } 
        #endregion

        #region GetAvailablePointsTests
        [TestMethod]
        public void GetAvailablePointsTests0PlacedBetsReturnsMinRequired()
        {
            var modelUtils = new ModelUtilities();
            var initializer = new ModelDataInitializer();
            List<UserGameSelection> userGameSelections = initializer.InitializeUserGameSelections();
            userGameSelections = userGameSelections.Where(ugs => ugs.UserId == -1).ToList();
            int minPointsRequired = 6;
            int extraPointFactorPerBetOverMin = 2;

            var actual = modelUtils.GetAvailablePoints(userGameSelections, minPointsRequired, extraPointFactorPerBetOverMin);
            Assert.AreEqual(minPointsRequired, actual);
        }

        [TestMethod]
        public void GetAvailablePointsTests9PlacedBetsReturnsMinRequired()
        {
            var modelUtils = new ModelUtilities();
            var initializer = new ModelDataInitializer();
            List<UserGameSelection> userGameSelections = initializer.InitializeUserGameSelections();
            userGameSelections = userGameSelections.Where(ugs => ugs.UserId == 3 && ugs.GameId >= 48 && ugs.GameId <= 61).ToList();
            int minPointsRequired = 6;
            int extraPointFactorPerBetOverMin = 2;

            var actual = modelUtils.GetAvailablePoints(userGameSelections, minPointsRequired, extraPointFactorPerBetOverMin);
            Assert.AreEqual(12, actual);
        }

        [TestMethod]
        public void GetAvailablePointsTests16PlacedBetsReturnsMinRequired()
        {
            var modelUtils = new ModelUtilities();
            var initializer = new ModelDataInitializer();
            List<UserGameSelection> userGameSelections = initializer.InitializeUserGameSelections();
            userGameSelections = userGameSelections.Where(ugs => ugs.UserId == 2 && ugs.GameId >= 17 && ugs.GameId <= 32).ToList();
            int minPointsRequired = 6;
            int extraPointFactorPerBetOverMin = 2;

            var actual = modelUtils.GetAvailablePoints(userGameSelections, minPointsRequired, extraPointFactorPerBetOverMin);
            Assert.AreEqual(26, actual);
        } 
        #endregion

        #region GetPossibleBetsTests
        [TestMethod]
        public void GetPossibleBetsTests0PossibleBetsReturnsCorrectly()
        {
            var modelUtils = new ModelUtilities();
            var initializer = new ModelDataInitializer();
            List<UserGameSelection> userGameSelections = initializer.InitializeUserGameSelections();
            userGameSelections = userGameSelections.Where(ugs => ugs.UserId == -1).ToList();

            var actual = modelUtils.GetPossibleBets(userGameSelections);
            Assert.AreEqual(0, actual);
        }

        [TestMethod]
        public void GetPossibleBetsTests16PossibleBetsReturnsCorrectly()
        {
            var modelUtils = new ModelUtilities();
            var initializer = new ModelDataInitializer();
            List<UserGameSelection> userGameSelections = initializer.InitializeUserGameSelections();
            userGameSelections = userGameSelections.Where(ugs => ugs.UserId == 2 && ugs.GameId >= 17 && ugs.GameId <= 32).ToList();

            var actual = modelUtils.GetPossibleBets(userGameSelections);
            Assert.AreEqual(16, actual);
        }
        #endregion

        #region GetPlacedBetsTests
        [TestMethod]
        public void GetPlacedBetsTests0PlacedBetsReturnsCorrectly()
        {
            var modelUtils = new ModelUtilities();
            var initializer = new ModelDataInitializer();
            List<UserGameSelection> userGameSelections = initializer.InitializeUserGameSelections();
            userGameSelections = userGameSelections.Where(ugs => ugs.UserId == -1).ToList();

            var actual = modelUtils.GetPlacedBets(userGameSelections);
            Assert.AreEqual(0, actual);
        }

        [TestMethod]
        public void GetPlacedBetsTestsAlmostAllPlacedBetsReturnsMinCorrectly()
        {
            var modelUtils = new ModelUtilities();
            var initializer = new ModelDataInitializer();
            List<UserGameSelection> userGameSelections = initializer.InitializeUserGameSelections();
            userGameSelections = userGameSelections.Where(ugs => ugs.UserId == 1 && ugs.GameId >= 1 && ugs.GameId <= 16).ToList();

            var actual = modelUtils.GetPlacedBets(userGameSelections);
            Assert.AreEqual(14, actual);
        }

        [TestMethod]
        public void GetPlacedBetsTestsAllPlacedBetsReturnsMinCorrectly()
        {
            var modelUtils = new ModelUtilities();
            var initializer = new ModelDataInitializer();
            List<UserGameSelection> userGameSelections = initializer.InitializeUserGameSelections();
            userGameSelections = userGameSelections.Where(ugs => ugs.UserId == 2 && ugs.GameId >= 17 && ugs.GameId <= 32).ToList();

            var actual = modelUtils.GetPlacedBets(userGameSelections);
            Assert.AreEqual(16, actual);
        }
        #endregion

        #region GetSpentPointsTests
        [TestMethod]
        public void GetSpentPointsTests0SpentPointsReturnsCorrectly()
        {
            var modelUtils = new ModelUtilities();
            var initializer = new ModelDataInitializer();
            List<UserGameSelection> userGameSelections = initializer.InitializeUserGameSelections();
            userGameSelections = userGameSelections.Where(ugs => ugs.UserId == -1).ToList();

            var actual = modelUtils.GetSpentPoints(userGameSelections);
            Assert.AreEqual(0, actual);
        }

        [TestMethod]
        public void GetSpentPointsTestsAlmostAllSpentPointsReturnsMinCorrectly()
        {
            var modelUtils = new ModelUtilities();
            var initializer = new ModelDataInitializer();
            List<UserGameSelection> userGameSelections = initializer.InitializeUserGameSelections();
            userGameSelections = userGameSelections.Where(ugs => ugs.UserId == 1 && ugs.GameId >= 1 && ugs.GameId <= 16).ToList();

            var actual = modelUtils.GetSpentPoints(userGameSelections);
            Assert.AreEqual(19, actual);
        }

        [TestMethod]
        public void GetSpentPointsTestsAllSpentPointsReturnsMinCorrectly()
        {
            var modelUtils = new ModelUtilities();
            var initializer = new ModelDataInitializer();
            List<UserGameSelection> userGameSelections = initializer.InitializeUserGameSelections();
            userGameSelections = userGameSelections.Where(ugs => ugs.UserId == 2 && ugs.GameId >= 17 && ugs.GameId <= 32).ToList();

            var actual = modelUtils.GetSpentPoints(userGameSelections);
            Assert.AreEqual(26, actual);
        }
        #endregion
    }
}
