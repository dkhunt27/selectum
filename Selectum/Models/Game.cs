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
        }

        public int GameId { get; set; }
        public int GameFilterId { get; set; }
        public DateTime GameDateTime { get; set; }
        public int Team1Id { get; set; }
        public int Team2Id { get; set; }
        public int HomeTeam { get; set; }

        public virtual GameFilter GameFilter { get; set; }
        public virtual Team Team1 { get; set; }
        public virtual Team Team2 { get; set; }
    }
}