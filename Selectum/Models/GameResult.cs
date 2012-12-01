using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Selectum.Models
{
    public partial class GameResult
    {
        public int GameResultId { get; set; }
        public int GameId { get; set; }
        public int WinnerTeamId { get; set; }
        public int FavoriteScore { get; set; }
        public int UnderdogScore { get; set; }
        public string GamePeriod { get; set; }

        public virtual Game Game { get; set; }
        public virtual Team WinnerTeam { get; set; }
    }
}