using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Selectum.Models;

namespace Selectum.ViewModels
{
    public class ResultsByGameViewModel
    {
        // lookup key
        public int GameFilterId { get; set; }

        public List<User> Users { get; set; }
        public List<ResultsByGameGameRow> GameRows { get; set; }
        public List<int> Totals { get; set; }
        public List<int> PotentialGains { get; set; }
        public List<int> PotentialLosses { get; set; }

        public ResultsByGameViewModel(int gameFilterId)
        {
            GameFilterId = gameFilterId;

            Users = new List<User>();
            GameRows = new List<ResultsByGameGameRow>();
            Totals = new List<int>();
            PotentialGains = new List<int>();
            PotentialLosses = new List<int>();
        }
    }

    public class ResultsByGameGameRow
    {
        // lookup key
        public int GameSpreadId { get; set; }

        public int FavoriteTeamId { get; set; }
        public string FavoriteTeamName { get; set; }
        public int UnderdogTeamId { get; set; }
        public string UnderdogTeamName { get; set; }
        public decimal Spread { get; set; }
        public int WinnerTeamId { get; set; }
        public string WinnerTeamName { get; set; }
        public List<ResultsByGameGameRowUserData> UsersData { get; set; }

        public ResultsByGameGameRow(GameSpread gameSpread, Team noWinnerTeam)
        {
            if (gameSpread == null) throw new ArgumentNullException("gameSpread");
            if (noWinnerTeam == null) throw new ArgumentNullException("noWinnerTeam");

            GameSpreadId = gameSpread.GameSpreadId;

            FavoriteTeamId = gameSpread.FavoriteTeamId;
            FavoriteTeamName = gameSpread.FavoriteTeam.TeamLongName;
            UnderdogTeamId = gameSpread.UnderdogTeamId;
            UnderdogTeamName = gameSpread.UnderdogTeam.TeamLongName;
            Spread = gameSpread.Spread;
            WinnerTeamId = noWinnerTeam.TeamId;
            WinnerTeamName = noWinnerTeam.TeamLongName;
            UsersData = new List<ResultsByGameGameRowUserData>();
        }

        public void UpdateWinner (GameResult gameResult)
        {
            if (gameResult == null) throw new ArgumentException("gameResult is null");

            if (gameResult.GameSpreadId != GameSpreadId)
            {
                throw new ArgumentException(string.Format("The gameResult.GameSpreadId ({0}) does not match GameSpreadId ({1})", gameResult.GameSpreadId, GameSpreadId));
            }
            else
            {
                WinnerTeamId = gameResult.WinnerTeamId;
                WinnerTeamName = gameResult.WinnerTeam.TeamLongName;
            }
        }

        public void AddUserDataSelection(UserGameSelection userGameSelection, Team noBetTeam, Team noPicksTeam)
        {
            UsersData.Add(new ResultsByGameGameRowUserData(userGameSelection, noBetTeam, noPicksTeam));
        }
    }

    public class ResultsByGameGameRowUserData
    {
        // lookup keys
        public int UserGameSelectionId { get; set; }
        public int UserId { get; set; }

        public bool PickedFavorite { get; set; }
        public bool PickedUnderdog { get; set; }
        public bool PickedNoBet { get; set; }
        public bool PickedNoPicks { get; set; }
        public string Pick { get; set; }
        public int Bet { get; set; }
        public int Result { get; set; }
        public int PotentialGain { get; set; }
        public int PotentialLoss { get; set; }

        public ResultsByGameGameRowUserData (UserGameSelection userGameSelection, Team noBetTeam, Team noPicksTeam)
	    {
            var found = false;

            if (userGameSelection == null) throw new ArgumentException("userGameSelection is null");

            UserGameSelectionId = userGameSelection.UserGameSelectionId;
            UserId = userGameSelection.UserId;

            if (userGameSelection.GameSpread == null) throw new ArgumentException("userGameSelection.GameSpread is null");
            if (userGameSelection.PickTeam == null) throw new ArgumentException("userGameSelection.PickTeam is null");
            if (userGameSelection.GameSpread.FavoriteTeamId == userGameSelection.GameSpread.UnderdogTeamId) throw new ArgumentException(string.Format("favoriteTeamId ({0}) cannot equal underdogTeamId ({1})", userGameSelection.GameSpread.FavoriteTeamId, userGameSelection.GameSpread.UnderdogTeamId));
            if (userGameSelection.GameSpread.FavoriteTeamId == noBetTeam.TeamId) throw new ArgumentException(string.Format("favoriteTeamId ({0}) cannot equal noBetTeamId ({1})", userGameSelection.GameSpread.FavoriteTeamId, noBetTeam.TeamId));
            if (userGameSelection.GameSpread.FavoriteTeamId == noPicksTeam.TeamId) throw new ArgumentException(string.Format("favoriteTeamId ({0}) cannot equal noPicksTeamId ({1})", userGameSelection.GameSpread.FavoriteTeamId, noPicksTeam.TeamId));
            if (userGameSelection.GameSpread.UnderdogTeamId == noBetTeam.TeamId) throw new ArgumentException(string.Format("underdogTeamId ({0}) cannot equal noBetTeamId ({1})", userGameSelection.GameSpread.UnderdogTeamId, noBetTeam.TeamId));
            if (userGameSelection.GameSpread.UnderdogTeamId == noPicksTeam.TeamId) throw new ArgumentException(string.Format("underdogTeamId ({0}) cannot equal noPicksTeamId ({1})", userGameSelection.GameSpread.UnderdogTeamId, noPicksTeam.TeamId)); ;
            if (noBetTeam.TeamId == noPicksTeam.TeamId) throw new ArgumentException(string.Format("noBetTeamId ({0}) cannot equal noPicksTeamId ({1})", noBetTeam.TeamId, noPicksTeam.TeamId));
    
            if (userGameSelection.PickTeamId == userGameSelection.GameSpread.FavoriteTeamId) 
            {
                PickedFavorite = true;
                found = true;
            } 
            else if (userGameSelection.PickTeamId == userGameSelection.GameSpread.UnderdogTeamId) 
            {
                PickedUnderdog = true;
                found = true;
            } 
            else if (userGameSelection.PickTeamId == noBetTeam.TeamId) 
            {
                PickedNoBet = true;
                found = true;
            }
            else if (userGameSelection.PickTeamId == noPicksTeam.TeamId)
            {
                PickedNoPicks = true;
                found = true;
            }


            if (found == false)
            {
                throw new ArgumentException(string.Format("pickTeamId ({0}) not found", userGameSelection.PickTeamId));
            }

            Pick = userGameSelection.PickTeam.TeamShortName;
            Bet = userGameSelection.Bet;
            Result = 0;

            if (PickedUnderdog)
            {
                PotentialGain = userGameSelection.Bet * 2; //TODO remove hardcoding and factor in upset bonus
            }
            else
            {
                PotentialGain = userGameSelection.Bet;
            }

            PotentialLoss = userGameSelection.Bet * -1;
	    }

        public void UpdateResult(UserGameResult userGameResult)
        {
            if (userGameResult == null) throw new ArgumentException("userGameResult is null");

            if (userGameResult.UserGameSelectionId != UserGameSelectionId && userGameResult.UserGameSelection.UserId != UserId)
            {
                throw new ArgumentException(string.Format("The userGameResult.UserGameSelectionId ({0}) does not match UserGameSelectionId ({1}) and/or userGameResult.UserGameSelection.UserId ({2}) does not match UserId ({3})", userGameResult.UserGameSelectionId, UserGameSelectionId, userGameResult.UserGameSelection.UserId, UserId));
            }
            else
            {
                Result = userGameResult.BetPoints;
                PotentialLoss = 0;
                PotentialGain = 0;
            }
        }
    }
}