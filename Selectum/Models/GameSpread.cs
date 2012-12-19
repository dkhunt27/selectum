using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Selectum.Models
{
    public partial class GameSpread
    {
        public GameSpread()
        {
        }

        public int GameSpreadId { get; set; }
        public int GameId { get; set; }
        public int FavoriteTeamId { get; set; }
        public int UnderdogTeamId { get; set; }
        public decimal Spread { get; set; }

        public virtual Team FavoriteTeam { get; set; }
        public virtual Team UnderdogTeam { get; set; }
        public virtual Game Game { get; set; }
    }
}