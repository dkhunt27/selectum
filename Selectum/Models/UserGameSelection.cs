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
            //this.UserGameResults = new HashSet<UserGameResult>();
        }

        public int UserGameSelectionId { get; set; }
        public int UserId { get; set; }
        public int GameId { get; set; }
        public int Bet { get; set; }
        public int PickTeamId { get; set; }

        public virtual Game Game { get; set; }
        public virtual Team PickTeam { get; set; }
        public virtual User User { get; set; }
        //public virtual ICollection<UserGameResult> UserGameResults { get; set; }
    }
}