using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Linq;
using System.Web;
using Selectum.Models;

namespace Selectum.ViewModels
{
    public class OverallResultByGameFilter
    {
        public OverallResultByGameFilter(GameFilter gameFilter, List<UserResult> userResults)
        {
            if (gameFilter == null) throw new ArgumentNullException("gameFilter");
            if (userResults == null) throw new ArgumentNullException("userResults");

            if (userResults.Count == 0)
            {
                //userResults.Add(new UserResult(){ 
            }
            else
            {
                foreach (var userResult in userResults)
                {
                    if (gameFilter.GameFilterId != userResult.GameFilterId)
                    {
                        throw new ArgumentException(
                                        string.Format("gameFilter.GameFilterId:{0} does not match userResult.GameFilterId:{1}",
                                        gameFilter.GameFilterId,
                                        userResult.GameFilterId));
                    }
                }
            }
            GameFilter = gameFilter;
            UserResults = userResults;
            Places = new List<int>();
        }

        public GameFilter GameFilter { get; set; }
        public List<UserResult> UserResults { get; set; }
        public List<int> Places { get; set; }

    }
}