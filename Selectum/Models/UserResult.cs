using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Selectum.Models
{
    public class UserResult
    {
        public UserResult()
        {
        }

        public int UserResultId { get; set; }
        public int UserId { get; set; }
        public int GameFilterId { get; set; }
        public int Bets { get; set; }
        public int Wins { get; set; }
        public int Points { get; set; }

        public virtual GameFilter GameFilter { get; set; }
        public virtual User User { get; set; }
    }
}