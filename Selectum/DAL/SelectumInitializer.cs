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

            //context.Database.ExecuteSqlCommand

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

            var gameSpreads = initializer.InitializeGameSpreads();
            gameSpreads.ForEach(g => context.GameSpreads.Add(g));
            context.SaveChanges();

            var gameResults = initializer.InitializeGameResults();
            gameResults.ForEach(gr => context.GameResults.Add(gr));
            context.SaveChanges();

            var userGameSelections = initializer.InitializeUserGameSelections();
            userGameSelections.ForEach(ugs => context.UserGameSelections.Add(ugs));
            context.SaveChanges();

            var userGameResults = initializer.InitializeUserGameResults();
            userGameResults.ForEach(ugr => context.UserGameResults.Add(ugr));
            context.SaveChanges();

            base.Seed(context);
        }
    }
}