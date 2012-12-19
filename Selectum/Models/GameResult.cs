using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Selectum.Models
{
    public partial class GameResult
    {
        public GameResult()
        {
            //this.UserGameResults = new HashSet<UserGameResult>();
        }
        public int GameResultId { get; set; }
        public int GameSpreadId { get; set; }
        public int WinnerTeamId { get; set; }
        public int FavoriteScore { get; set; }
        public int UnderdogScore { get; set; }
        public string GamePeriod { get; set; }

        public virtual GameSpread GameSpread { get; set; }
        public virtual Team WinnerTeam { get; set; }

        //public virtual ICollection<UserGameResult> UserGameResults { get; set; }
    }
}