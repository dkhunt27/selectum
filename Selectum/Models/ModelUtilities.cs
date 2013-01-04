using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Selectum.DAL;

namespace Selectum.Models
{
    public class ModelUtilities
    {
        public GameFilter GetGameFilterByDate(List<GameFilter> gameFilters, DateTime searchDate)
        {
            GameFilter gameFilter = gameFilters.FirstOrDefault(gf => gf.GameFilterStartDate <= searchDate && gf.GameFilterEndDate >= searchDate);
            if (gameFilter == null)
            {
                gameFilter = gameFilters.Last(_ => _.GameFilterAvailable == true);
            }
            return gameFilter;
        }

        public int GetPlacedBets(List<UserGameSelection> userGameSelections)
        {
            return userGameSelections.Count(ugs => ugs.Bet > 0);
        }

        public int GetBonusPoints(List<UserGameSelection> userGameSelections, int minSpentPointsForAnyOneWeek, int extraPointFactorPerBetOverMin)
        {
            int bonusPoints = 0;
            int placedBets = GetPlacedBets(userGameSelections);

            if (placedBets < minSpentPointsForAnyOneWeek)
            {
                //bonusPoints = minSpentPointsForAnyOneWeek;
                bonusPoints = 0;
            }
            else
            {
                bonusPoints = minSpentPointsForAnyOneWeek + (placedBets - minSpentPointsForAnyOneWeek) * extraPointFactorPerBetOverMin;
            }

            return bonusPoints;
        }

        public int GetSpentPoints(List<UserGameSelection> userGameSelections)
        {
            return userGameSelections.Sum(ugs => ugs.Bet);
        }

        public int GetPossibleBets(List<UserGameSelection> userGameSelections)
        {
            return userGameSelections.Count();
        }

        public List<UserGameSelection> CreateDefaultUserGameSelections(List<GameSpread> gameSpreads, User user, Team noBetTeam)
        {
            var userGameSelections = new List<UserGameSelection>();

            // initialize the userGameSelections with No Bets
            foreach (var gameSpread in gameSpreads)
            {
                userGameSelections.Add(CreateDefaultUserGameSelection(gameSpread, user, noBetTeam));
            }
            
            return userGameSelections;
        }

        public UserGameSelection CreateDefaultUserGameSelection(GameSpread gameSpread, User user, Team noBetTeam)
        {
            if (gameSpread == null) throw new ArgumentNullException("gameSpread");
            if (noBetTeam == null) throw new ArgumentNullException("noBetTeam");
            if (user == null) throw new ArgumentNullException("user");

            // create the userGameSelection with No Bets
            var userGameSelection = new UserGameSelection()
                                         {
                                             Bet = 0,
                                             GameSpreadId = gameSpread.GameSpreadId,
                                             PickTeamId = noBetTeam.TeamId,
                                             GameSpread = gameSpread,
                                             PickTeam = noBetTeam,
                                             UserId = user.UserId,
                                             User = user,
                                             Saved = false
                                         };

            return userGameSelection;
        }
    }
}