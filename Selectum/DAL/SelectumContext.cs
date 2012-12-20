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
        public DbSet<Team> Teams { get; set; }
        public DbSet<GameFilter> GameFilters { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<GameSpread> GameSpreads { get; set; }
        public DbSet<GameResult> GameResults { get; set; }

        public DbSet<User> Users { get; set; }
        public DbSet<UserToUserProfile> UserToUserProfiles { get; set; }

        public DbSet<UserGameSelection> UserGameSelections { get; set; }
        public DbSet<UserGameResult> UserGameResults { get; set; }
        public DbSet<UserResult> UserResults { get; set; }
        public DbSet<Log> Logs { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            #region Team
            modelBuilder.Entity<Team>().Property(x => x.TeamShortName).HasMaxLength(5).IsRequired();
            modelBuilder.Entity<Team>().Property(x => x.TeamLongName).HasMaxLength(25).IsRequired();
            modelBuilder.Entity<Team>().Property(x => x.TeamOtherName).HasMaxLength(25).IsRequired();
            #endregion

            #region GameFilter
            modelBuilder.Entity<Game>()
                        .HasRequired(x => x.GameFilter)
                        .WithMany()
                        .HasForeignKey(x => x.GameFilterId).WillCascadeOnDelete(false);

            modelBuilder.Entity<Game>()
                        .HasRequired(x => x.Team1)
                        .WithMany()
                        .HasForeignKey(x => x.Team1Id).WillCascadeOnDelete(false);

            modelBuilder.Entity<Game>()
                        .HasRequired(x => x.Team2)
                        .WithMany()
                        .HasForeignKey(x => x.Team2Id).WillCascadeOnDelete(false);

            modelBuilder.Entity<GameFilter>().Property(x => x.GameFilterEndDate).IsRequired();
            modelBuilder.Entity<GameFilter>().Property(x => x.GameFilterName).HasMaxLength(15).IsRequired();
            modelBuilder.Entity<GameFilter>().Property(x => x.GameFilterStartDate).IsRequired();
            #endregion

            #region Game
            modelBuilder.Entity<Game>()
                        .HasRequired(x => x.GameFilter)
                        .WithMany()
                        .HasForeignKey(x => x.GameFilterId).WillCascadeOnDelete(false);

            modelBuilder.Entity<Game>()
                        .HasRequired(x => x.Team1)
                        .WithMany()
                        .HasForeignKey(x => x.Team1Id).WillCascadeOnDelete(false);

            modelBuilder.Entity<Game>()
                        .HasRequired(x => x.Team2)
                        .WithMany()
                        .HasForeignKey(x => x.Team2Id).WillCascadeOnDelete(false);

            modelBuilder.Entity<Game>().Property(x => x.GameDateTime).IsRequired();
            modelBuilder.Entity<Game>().Property(x => x.HomeTeam).IsRequired();
            #endregion

            #region GameSpread
            modelBuilder.Entity<GameSpread>()
                        .HasRequired(x => x.Game)
                        .WithMany()
                        .HasForeignKey(x => x.GameId).WillCascadeOnDelete(false);

            modelBuilder.Entity<GameSpread>()
                        .HasRequired(x => x.FavoriteTeam)
                        .WithMany()
                        .HasForeignKey(x => x.FavoriteTeamId).WillCascadeOnDelete(false);

            modelBuilder.Entity<GameSpread>()
                        .HasRequired(x => x.UnderdogTeam)
                        .WithMany()
                        .HasForeignKey(x => x.UnderdogTeamId).WillCascadeOnDelete(false);

            modelBuilder.Entity<GameSpread>().Property(x => x.Spread).HasPrecision(6, 3).IsRequired();
            #endregion

            #region GameResult
            modelBuilder.Entity<GameResult>()
                        .HasRequired(x => x.GameSpread)
                        .WithMany()
                        .HasForeignKey(x => x.GameSpreadId).WillCascadeOnDelete(false);

            modelBuilder.Entity<GameResult>()
                        .HasRequired(x => x.WinnerTeam)
                        .WithMany()
                        .HasForeignKey(x => x.WinnerTeamId).WillCascadeOnDelete(false);

            modelBuilder.Entity<GameResult>().Property(x => x.FavoriteScore).IsRequired();
            modelBuilder.Entity<GameResult>().Property(x => x.UnderdogScore).IsRequired();
            modelBuilder.Entity<GameResult>().Property(x => x.GamePeriod).HasMaxLength(5).IsRequired();
            #endregion

            #region UserGameSelection
            modelBuilder.Entity<UserGameSelection>()
                        .HasRequired(x => x.PickTeam)
                        .WithMany()
                        .HasForeignKey(x => x.PickTeamId).WillCascadeOnDelete(false);

            modelBuilder.Entity<UserGameSelection>()
                        .HasRequired(x => x.User)
                        .WithMany()
                        .HasForeignKey(x => x.UserId).WillCascadeOnDelete(false);

            modelBuilder.Entity<UserGameSelection>()
                        .HasRequired(x => x.GameSpread)
                        .WithMany()
                        .HasForeignKey(x => x.GameSpreadId).WillCascadeOnDelete(false);

            modelBuilder.Entity<UserGameSelection>().Property(x => x.Bet).IsRequired();
            #endregion

            #region UserGameResult
            modelBuilder.Entity<UserGameResult>()
                        .HasRequired(x => x.UserGameSelection)
                        .WithMany()
                        .HasForeignKey(x => x.UserGameSelectionId).WillCascadeOnDelete(false);

            modelBuilder.Entity<UserGameResult>().Property(x => x.BetPoints).IsRequired();
            modelBuilder.Entity<UserGameResult>().Property(x => x.BetResult).IsRequired();
            #endregion

            #region UserResult
            modelBuilder.Entity<UserResult>()
                        .HasRequired(x => x.GameFilter)
                        .WithMany()
                        .HasForeignKey(x => x.GameFilterId).WillCascadeOnDelete(false);

            modelBuilder.Entity<UserResult>()
                        .HasRequired(x => x.User)
                        .WithMany()
                        .HasForeignKey(x => x.UserId).WillCascadeOnDelete(false);

            modelBuilder.Entity<UserResult>().Property(x => x.Bets).IsRequired();
            modelBuilder.Entity<UserResult>().Property(x => x.Points).IsRequired();
            modelBuilder.Entity<UserResult>().Property(x => x.Wins).IsRequired();
            #endregion

            #region User
            modelBuilder.Entity<User>().Property(x => x.UserName).HasMaxLength(25).IsRequired();
            #endregion

            #region UserToUserProfile
            modelBuilder.Entity<UserToUserProfile>()
                        .HasRequired(utup => utup.User)
                        .WithMany()
                        .HasForeignKey(utup => utup.UserId).WillCascadeOnDelete(false);

            modelBuilder.Entity<UserToUserProfile>().Property(x => x.UserProfileId).IsRequired();
            #endregion
        }
    }
}