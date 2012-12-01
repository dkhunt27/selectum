using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Linq;
using System.Web;

namespace Selectum.Models
{
    public class Selection
    {
        private readonly int _maxBetForAnyOneGame;
        private readonly int _minSpentPointsForAnyOneWeek;
        private readonly int _extraPointFactorPerBetOverMin;
        public Selection()
        {
            _maxBetForAnyOneGame = Convert.ToInt32(ConfigurationManager.AppSettings["MaxBetForAnyOneGame"]);
            _minSpentPointsForAnyOneWeek = Convert.ToInt32(ConfigurationManager.AppSettings["MinSpentPointsForAnyOneWeek"]);
            _extraPointFactorPerBetOverMin = Convert.ToInt32(ConfigurationManager.AppSettings["ExtraPointFactorPerBetOverMin"]);

            CurrentGameFilter = new GameFilter();
            GameFilters = new List<GameFilter>();
            UserGameSelections = new List<UserGameSelection>();
        }

        public int MaxBetForAnyOneGame { get { return _maxBetForAnyOneGame; } }
        public int MinSpentPointsForAnyOneWeek { get { return _minSpentPointsForAnyOneWeek; } }
        public int ExtraPointFactorPerBetOverMin { get { return _extraPointFactorPerBetOverMin; } }
        public int PossibleBets { get; set; }
        public int PlacedBets { get; set; }
        public int AvailablePoints { get; set; }
        public int SpentPoints { get; set; }

        public GameFilter CurrentGameFilter { get; set; }
        public List<GameFilter> GameFilters { get; set; }
        public List<UserGameSelection> UserGameSelections { get; set; }
    }

    public class SelectionTeams
    {
        public bool? FavoriteTeamSelected { get; set; }
        public Game Game { get; set; }
    }
}