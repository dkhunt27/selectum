using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Selectum.Models
{
    public class ModelUtilities
    {
        public GameFilter GetGameFilterByDate(List<GameFilter> gameFilters, DateTime searchDate)
        {
            return gameFilters.FirstOrDefault(gf => gf.GameFilterStartDate <= searchDate && gf.GameFilterEndDate >= searchDate);
        }

        public int GetPlacedBets(List<UserGameSelection> userGameSelections)
        {
            return userGameSelections.Count(ugs => ugs.Bet > 0);
        }

        public int GetAvailablePoints(List<UserGameSelection> userGameSelections, int minSpentPointsForAnyOneWeek, int extraPointFactorPerBetOverMin)
        {
            int availablePoints = 0;
            int placedBets = GetPlacedBets(userGameSelections);

            if (placedBets < minSpentPointsForAnyOneWeek)
            {
                availablePoints = minSpentPointsForAnyOneWeek;
            }
            else
            {
                availablePoints = minSpentPointsForAnyOneWeek + (placedBets - minSpentPointsForAnyOneWeek) * extraPointFactorPerBetOverMin;
            }

            return availablePoints;
        }

        public int GetSpentPoints(List<UserGameSelection> userGameSelections)
        {
            return userGameSelections.Sum(ugs => ugs.Bet);
        }

        public int GetPossibleBets(List<UserGameSelection> userGameSelections)
        {
            return userGameSelections.Count();
        }
    }
}