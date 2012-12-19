using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Linq;
using System.Web;
using Selectum.Models;

namespace Selectum.ViewModels
{
    public class OverallResultsByGameFilter
    {
        public OverallResultsByGameFilter()
        {
            Users = new List<User>();
            Results = new List<OverallResultByGameFilter>();
        }
        public List<User> Users { get; set; }
        public List<OverallResultByGameFilter> Results { get; set; }
        public List<int> Totals { get; set; }
    }
}