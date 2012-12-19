using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using Selectum.Models;

namespace Selectum.ViewModels
{
    public partial class SelectionGameRow
    {
        public SelectionGameRow()
        {
            UserGameSelection = new UserGameSelection();
            SelectionPicker = new SelectionPicker();
            BetPickers = new List<BetPicker>();
        }

        public UserGameSelection UserGameSelection { get; set; }
        public SelectionPicker SelectionPicker { get; set; }
        public List<BetPicker> BetPickers { get; set; }
    }

    public class SelectionPicker
    {
        public bool Disabled { get; set; }
        public bool Toggled { get; set; }
        public string SelectionValue { get; set; }
    }

    public class BetPicker
    {
        public bool Disabled { get; set; }
        public bool Activated { get; set; }
        public bool Toggled { get; set; }
        public int BetValue { get; set; }
    }
}