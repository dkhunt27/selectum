using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Selectum.Models
{
    public partial class Team
    {
        public Team()
        {
            //this.FavoriteGames = new HashSet<Game>();
            //this.UnderdogGames = new HashSet<Game>();
            //this.GameResults = new HashSet<GameResult>();
            //this.UserGameSelections = new HashSet<UserGameSelection>();
        }

        public int TeamId { get; set; }
        public string TeamLongName { get; set; }
        public string TeamShortName { get; set; }
        public string TeamOtherName { get; set; }

        //public virtual ICollection<Game> FavoriteGames { get; set; }
        //public virtual ICollection<Game> UnderdogGames { get; set; }
        //public virtual ICollection<GameResult> GameResults { get; set; }
        //public virtual ICollection<UserGameSelection> UserGameSelections { get; set; }
    }
}
