using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Linq;
using System.Web;
using Selectum.Models;

namespace Selectum.ViewModels
{
    public class ResultsByGame
    {
        public ResultsByGame()
        {
            Users = new List<User>();
            Results = new List<ResultByGame>();
        }
        public List<User> Users { get; set; }
        public List<ResultByGame> Results { get; set; }
    }
}