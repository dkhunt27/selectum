using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Linq;
using System.Web;
using Selectum.Models;

namespace Selectum.ViewModels
{
    public class ResultByGame
    {
        public ResultByGame(GameResult gameResult, List<UserGameResult> userGameResults, List<UserGameSelection> userGameSelections)
        {
            if (gameResult == null) throw new ArgumentNullException("gameResult");
            if (gameResult.GameSpread == null) throw new ArgumentNullException("gameResult.GameSpread");
            if (gameResult.GameSpread.Game == null) throw new ArgumentNullException("gameResult.GameSpread.Game");
            if (gameResult.GameSpread.FavoriteTeam == null) throw new ArgumentNullException("gameResult.GameSpread.FavoriteTeam");
            if (gameResult.GameSpread.UnderdogTeam == null) throw new ArgumentNullException("gameResult.GameSpread.UnderdogTeam");
            if (userGameResults == null) throw new ArgumentNullException("userGameResults");
            if (userGameSelections == null) throw new ArgumentNullException("userGameSelections");
            //if (userGameResults.Count == 0) throw new ArgumentException("userGameResults.Count = 0");

            foreach (var userGameResult in userGameResults)
            {
                if (userGameResult.UserGameSelection == null) throw new ArgumentNullException("userGameResult.UserGameSelection");
                if (userGameResult.UserGameSelection.GameSpread == null) throw new ArgumentNullException("userGameResult.UserGameSelection.GameSpread");

                if (gameResult.GameSpread.GameId != userGameResult.UserGameSelection.GameSpread.GameId)
                {
                    throw new ArgumentException(
                                    string.Format("gameResult.GameSpread.GameId:{0} does not match userGameResult.UserGameSelection.GameSpread.GameId:{1}",
                                    gameResult.GameSpread.GameId,
                                    userGameResult.UserGameSelection.GameSpread.GameId));
                }
            }

            foreach (var userGameSelection in userGameSelections)
            {
                if (userGameSelection.GameSpread == null) throw new ArgumentNullException("userGameSelection.GameSpread");

                if (gameResult.GameSpread.GameId != userGameSelection.GameSpread.GameId)
                {
                    throw new ArgumentException(
                                    string.Format("gameResult.GameSpread.GameId:{0} does not match userGameSelection.GameSpread.GameId:{1}",
                                    gameResult.GameSpread.GameId,
                                    userGameSelection.GameSpread.GameId));
                }
            }

            GameResult = gameResult;
            UserGameResults = userGameResults;
            UserGameSelections = userGameSelections;
        }

        public GameResult GameResult { get; set; }
        public List<UserGameResult> UserGameResults {get;set;}
        public List<UserGameSelection> UserGameSelections {get;set;}

    }
}