using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Linq;
using System.Web;
using Selectum.Models;

namespace Selectum.ViewModels
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

            GameRows = new List<SelectionGameRow>();
        }

        [Required]
        [Range(5,5)]
        public int MaxBetForAnyOneGame { get { return _maxBetForAnyOneGame; } }

        [Required]
        public int MinSpentPointsForAnyOneWeek { get { return _minSpentPointsForAnyOneWeek; } }

        [Required]
        public int ExtraPointFactorPerBetOverMin { get { return _extraPointFactorPerBetOverMin; } }

        [Required]
        public int PossibleBets { get; set; }

        [Required]
        public int PlacedBets { get; set; }

        [Required]
        [Range(0,0)]
        public int BonusPoints { get; set; }

        [Required]
        public int SpentPoints { get; set; }

        [Required]
        public bool SelectionDisabledForThisGameFilter { get; set; }

        [Required]
        public bool GameRowsHaveBeenSaved { get; set; }

        [Required]
        public List<SelectionGameRow> GameRows { get; set; }

        public BetPicker BetPickers { get; set; }
    }


}