using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Selectum.Models
{
    public class User
    {
        public User() {}

        public int UserId { get; set; }
        public string UserName { get; set; }
    }
}
