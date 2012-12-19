using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Selectum.Models
{
    public partial class UserGameSelection
    {
        public UserGameSelection()
        {
        }

        public int UserGameSelectionId { get; set; }
        public int UserId { get; set; }
        public int GameSpreadId { get; set; }
        public int PickTeamId { get; set; }
        public int Bet { get; set; }
        public bool Saved { get; set; }

        public virtual GameSpread GameSpread { get; set; }
        public virtual Team PickTeam { get; set; }
        public virtual User User { get; set; }
    }
}