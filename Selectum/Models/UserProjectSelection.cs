using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Selectum.Models
{
    public partial class UserProjectSelection
    {
        public UserProjectSelection()
        {
        }

        public int UserProjectSelectionId { get; set; }
        public int UserId { get; set; }
        public int ProjectId { get; set; }
        public int Resources { get; set; }
        public int PickProjectId { get; set; }

        public virtual Game Game { get; set; }
        public virtual Team PickTeam { get; set; }
        public virtual UserProfile User { get; set; }
    }
}