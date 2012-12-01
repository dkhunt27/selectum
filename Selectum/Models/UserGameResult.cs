using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Selectum.Models
{
    public partial class UserGameResult
    {
        public int UserGameResultId { get; set; }
        public int UserGameSelectionId { get; set; }
        public int BetResult { get; set; }
        public int BetPoints { get; set; }

        public virtual UserGameSelection UserGameSelection { get; set; }
    }
}