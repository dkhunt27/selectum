using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Linq;
using System.Web;
using Selectum.Models;

namespace Selectum.ViewModels
{
    public class ResultByUser
    {
        public ResultByUser(User user, List<UserGameResult> userGameResults)
        {
            if (user == null) throw new ArgumentNullException("user");
            if (userGameResults == null) throw new ArgumentNullException("userGameResults");
            if (userGameResults.Count == 0) throw new ArgumentException("userGameResults.Count = 0");

            foreach (var userGameResult in userGameResults)
            {
                if (userGameResult.UserGameSelection == null) throw new ArgumentNullException("userGameResult.UserGameSelection");
                if (userGameResult.UserGameSelection.GameSpread == null) throw new ArgumentNullException("userGameResult.UserGameSelection.GameSpread");

                if (user.UserId != userGameResult.UserGameSelection.UserId)
                {
                    throw new ArgumentException(string.Format("user.UserId:{0} does not match userGameResult.UserGameSelection.UserId:{1}", user.UserId, userGameResult.UserGameSelection.UserId));
                }
            }

            User = user;
            UserGameResults = userGameResults;
        }

        public User User { get; set; }
        public List<UserGameResult> UserGameResults {get;set;}

    }
}