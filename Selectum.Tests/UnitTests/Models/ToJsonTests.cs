using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Selectum.Models;
using System.Collections.Generic;
using Selectum.DAL;
using System.Linq;

namespace Selectum.Tests.UnitTests.Models
{
    [TestClass]
    public class ToJsonTests
    {
        #region SerializeTests
        [TestMethod]
        public void SerializeTest()
        {
            var team = new Team() { TeamId = 1, TeamLongName = "abc", TeamShortName = "def" };
            var expected = "{\"teamId\":1,\"teamLongName\":\"abc\",\"teamShortName\":\"def\"}";
            var actual = team.ToJson();

            Assert.AreEqual(expected, actual);
        }
        #endregion
    }
}
