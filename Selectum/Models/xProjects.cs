using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Selectum.Models
{
    public partial class Task
    {
        public Task()
        {
        }

        public int TaskId { get; set; }
        public string TaskName { get; set; }
        public string TaskName2 { get; set; }
    }

    public partial class Work
    {
        public Work()
        {
            //this.UserTaskSelections = new HashSet<UserTaskSelection>();
        }

        public int WorkId { get; set; }

        public int ChoiceATaskId { get; set; }
        public int ChoiceBTaskId { get; set; }
        public virtual Task ChoiceA { get; set; }
        public virtual Task ChoiceB { get; set; }
        //public virtual ICollection<UserTaskSelection> UserTaskSelections { get; set; }
    }

    public partial class UserTaskSelection
    {
        public UserTaskSelection()
        {
        }

        public int UserTaskSelectionId { get; set; }
        //[ForeignKey("UserId")]
        public int UserId { get; set; }
        //[ForeignKey("WorkId")]
        public int WorkId { get; set; }
        public int Hours { get; set; }
        //[ForeignKey("SelectedTaskId")]
        public int SelectedTaskId { get; set; }

        public virtual Work Work { get; set; }
        public virtual Task SelectedTask { get; set; }
        public virtual User User { get; set; }
    }
}
