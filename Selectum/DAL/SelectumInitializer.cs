using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using Selectum.Models;

namespace Selectum.DAL
{
    public class SelectumInitializer : DropCreateDatabaseAlways<SelectumContext>
    {
        protected override void Seed(SelectumContext context)
        {
            var initializer = new ModelDataInitializer();

            var users = initializer.InitializeUsers();
            users.ForEach(u => context.Users.Add(u));
            context.SaveChanges();

            var userToUserProfiles = initializer.InitializeUserToUserProfiles();
            userToUserProfiles.ForEach(utup => context.UserToUserProfiles.Add(utup));
            context.SaveChanges();

            var teams = initializer.InitializeTeams();
            teams.ForEach(t => context.Teams.Add(t));
            context.SaveChanges();

            var gameFilters = initializer.InitializeGameFilters();
            gameFilters.ForEach(gf => context.GameFilters.Add(gf));
            context.SaveChanges();

            var games = initializer.InitializeGames();
            games.ForEach(g => context.Games.Add(g));
            context.SaveChanges();

            var userGameSelections = initializer.InitializeUserGameSelections();
            userGameSelections.ForEach(ugs => context.UserGameSelections.Add(ugs));
            context.SaveChanges();

            var userGameResults = initializer.InitializeUserGameResults();
            userGameResults.ForEach(ugr => context.UserGameResults.Add(ugr));
            context.SaveChanges();

            /*
            var tasks = new List<Task>()
            {
                new Task{ TaskName = "task 1"},
                new Task{ TaskName = "task 2"},
                new Task{ TaskName = "task 3"},
                new Task{ TaskName = "task 4"},
                new Task{ TaskName = "task 5"},
                new Task{ TaskName = "task 6"},
                new Task{ TaskName = "task 7"},
                new Task{ TaskName = "task 8"},
                new Task{ TaskName = "task 9"},
                new Task{ TaskName = "task 10"},
            };
            tasks.ForEach(t => context.Tasks.Add(t));
            context.SaveChanges();

            var works = new List<Work>()
            {
                //new Work{ ChoiceA = tasks.First(t=>t.TaskName == "Task 1"), ChoiceB = tasks.First(t=>t.TaskName == "Task 2")},
                //new Work{ ChoiceA = tasks.First(t=>t.TaskName == "Task 3"), ChoiceB = tasks.First(t=>t.TaskName == "Task 4")},
                //new Work{ ChoiceA = tasks.First(t=>t.TaskName == "Task 5"), ChoiceB = tasks.First(t=>t.TaskName == "Task 6")},
                //new Work{ ChoiceA = tasks.First(t=>t.TaskName == "Task 7"), ChoiceB = tasks.First(t=>t.TaskName == "Task 8")},
                //new Work{ ChoiceA = tasks.First(t=>t.TaskName == "Task 9"), ChoiceB = tasks.First(t=>t.TaskName == "Task 10")},

                new Work{ ChoiceATaskId = 1, ChoiceBTaskId=2},
                new Work{ ChoiceATaskId = 3, ChoiceBTaskId=4},
                new Work{ ChoiceATaskId = 5, ChoiceBTaskId=6},
                new Work{ ChoiceATaskId = 7, ChoiceBTaskId=8},
                new Work{ ChoiceATaskId = 9, ChoiceBTaskId=10},
            };
            works.ForEach(w => context.Works.Add(w));
            context.SaveChanges();

            var users2 = new List<User>()
            {
                new User{ UserName = "Bob"},
                new User{ UserName = "Bill"},
            };
            users2.ForEach(u => context.Users2.Add(u));
            context.SaveChanges();

            var userTaskSelections = new List<UserTaskSelection>()
            {
                //new UserTaskSelection{ Work = works.First(w=>w.ChoiceA.TaskName == "Task 1"), SelectedTask = tasks.First(t=>t.TaskName == "Task 1"), User = users2.First(u=>u.UserName=="Bob")}, 
                //new UserTaskSelection{ Work = works.First(w=>w.ChoiceA.TaskName == "Task 3"), SelectedTask = tasks.First(t=>t.TaskName == "Task 4"), User = users2.First(u=>u.UserName=="Bob")}, 
                //new UserTaskSelection{ Work = works.First(w=>w.ChoiceA.TaskName == "Task 5"), SelectedTask = tasks.First(t=>t.TaskName == "Task 6"), User = users2.First(u=>u.UserName=="Bob")}, 

                new UserTaskSelection{ WorkId=1, SelectedTaskId=1, UserId=1, Hours=2}, 
                new UserTaskSelection{ WorkId=2, SelectedTaskId=4, UserId=1, Hours=3},
                new UserTaskSelection{ WorkId=3, SelectedTaskId=6, UserId=1, Hours=1},
            };
            userTaskSelections.ForEach(uts => context.UserTaskSelections.Add(uts));
            context.SaveChanges();
            */

            base.Seed(context);
        }
    }
}