using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using Selectum.Models;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace Selectum.DAL
{
    public class SelectumContext : DbContext
    {
        public DbSet<Game> Games { get; set; }
        public DbSet<GameFilter> GameFilters { get; set; }
        public DbSet<GameResult> GameResults { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserToUserProfile> UserToUserProfiles { get; set; }
        public DbSet<UserGameResult> UserGameResults { get; set; }
        public DbSet<UserGameSelection> UserGameSelections { get; set; }

        /*
        public DbSet<Task> Tasks { get; set; }
        public DbSet<Work> Works { get; set; }
        public DbSet<UserTaskSelection> UserTaskSelections { get; set; }
        public DbSet<User> Users2 { get; set; }
        */

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            modelBuilder.Entity<Game>()
                        .HasRequired(g => g.FavoriteTeam)
                        .WithMany()
                        .HasForeignKey(g => g.FavoriteTeamId).WillCascadeOnDelete(false);

            modelBuilder.Entity<Game>()
                        .HasRequired(g => g.UnderdogTeam)
                        .WithMany()
                        .HasForeignKey(g => g.UnderdogTeamId).WillCascadeOnDelete(false);

            modelBuilder.Entity<GameResult>()
                        .HasRequired(gr => gr.WinnerTeam)
                        .WithMany()
                        .HasForeignKey(gr => gr.WinnerTeamId).WillCascadeOnDelete(false);

            modelBuilder.Entity<UserGameSelection>()
                        .HasRequired(ugs => ugs.PickTeam)
                        .WithMany()
                        .HasForeignKey(ugs => ugs.PickTeamId).WillCascadeOnDelete(false);

            modelBuilder.Entity<UserGameSelection>()
                        .HasRequired(ugs => ugs.User)
                        .WithMany()
                        .HasForeignKey(ugs => ugs.UserId).WillCascadeOnDelete(false);

            modelBuilder.Entity<UserToUserProfile>()
                        .HasRequired(utup => utup.User)
                        .WithMany()
                        .HasForeignKey(utup => utup.UserId).WillCascadeOnDelete(false);



            /*
            modelBuilder.Entity<Work>()
                        .HasRequired(g => g.ChoiceA)
                        .WithMany()
                        .HasForeignKey(g => g.ChoiceATaskId).WillCascadeOnDelete(false);

            modelBuilder.Entity<Work>()
                        .HasRequired(g => g.ChoiceB)
                        .WithMany()
                        .HasForeignKey(g => g.ChoiceBTaskId).WillCascadeOnDelete(false);

            modelBuilder.Entity<UserTaskSelection>()
                        .HasRequired(g => g.SelectedTask)
                        .WithMany()
                        .HasForeignKey(g => g.SelectedTaskId).WillCascadeOnDelete(false);
             */
        }
    }
}