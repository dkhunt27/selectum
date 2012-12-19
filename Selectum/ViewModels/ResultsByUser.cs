using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Linq;
using System.Web;
using Selectum.Models;

namespace Selectum.ViewModels
{
    public class ResultsByUser
    {
        public ResultsByUser()
        {
            GameResults = new List<GameResult>();
            Results = new List<ResultByUser>();
        }
        public List<GameResult> GameResults { get; set; }
        public List<ResultByUser> Results { get; set; }
    }
}