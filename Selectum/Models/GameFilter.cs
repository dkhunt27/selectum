using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Selectum.Models
{
    public partial class GameFilter
    {
        public GameFilter()
        {
        }

        public int GameFilterId { get; set; }
        public string GameFilterName { get; set; }
        public DateTime GameFilterStartDate { get; set; }
        public DateTime GameFilterEndDate { get; set; }
        public bool GameFilterEnabled { get; set; }
        public bool GameFilterAvailable { get; set; }
    }
}