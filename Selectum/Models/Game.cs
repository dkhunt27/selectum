using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Selectum.Models
{
    public partial class Game
    {
        public Game()
        {
            this.GameResults = new HashSet<GameResult>();
            this.UserGameSelections = new HashSet<UserGameSelection>();
        }

        public int GameId { get; set; }
        public int GameFilterId { get; set; }
        public DateTime GameDateTime { get; set; }

        public int FavoriteTeamId { get; set; }
        public int UnderdogTeamId { get; set; }
        public decimal Spread { get; set; }
        public string HomeTeam { get; set; }

        public virtual GameFilter GameFilter { get; set; }

        //[ForeignKey("FavoriteTeamId")]
        public virtual Team FavoriteTeam { get; set; }

        //[ForeignKey("UnderdogTeamId")]
        public virtual Team UnderdogTeam { get; set; }
        public virtual ICollection<GameResult> GameResults { get; set; }
        public virtual ICollection<UserGameSelection> UserGameSelections { get; set; }
    }
}