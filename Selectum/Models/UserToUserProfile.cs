using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Selectum.Models
{
    public class UserToUserProfile
    {
        public UserToUserProfile() { }

        public int UserToUserProfileId { get; set; }
        public int UserId { get; set; }
        public int UserProfileId { get; set; }

        public virtual User User { get; set; }
        //public virtual UserProfile UserProfile { get; set; }
    }
}
