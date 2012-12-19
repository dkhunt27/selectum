using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Selectum.Models
{
    public partial class Log
    {
        public Log()
        {
        }

        public int LogId { get; set; }
        public DateTime GameDateTime { get; set; }
        public string Type { get; set; }
        public string Process { get; set; }
        public string Message { get; set; }

    }
}