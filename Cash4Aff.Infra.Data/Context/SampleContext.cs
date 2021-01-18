using Cash4Aff.Domain.Entities;
using System;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;

namespace Cash4Aff.Infra.Data.Context
{
    public class SampleContext : DbContext
    {
        public DbSet<Menu> Menu { get; set; }
        public DbSet<MenuInRole> MenuInRole { get; set; }
        public DbSet<Config> Config { get; set; }
        public DbSet<Withdraw> Withdraw { get; set; }
        public DbSet<Wallet> Wallet { get; set; }
        public DbSet<Bank> Bank { get; set; }
        public DbSet<UserRef> UserRef { get; set; }
        public DbSet<Balance> Balance { get; set; }
        public DbSet<Ads> Ads { get; set; }
        //Cash4Aff

        public SampleContext() : base("name=DefaultConnection")
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<SampleContext, DatabaseInitializer>());//initial database use test data            
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
            modelBuilder.Conventions.Remove<ManyToManyCascadeDeleteConvention>();

            modelBuilder.Properties()
                .Where(p => p.Name == p.ReflectedType.Name + "Id")
                .Configure(p => p.IsKey());

            modelBuilder.Properties<string>()
                .Configure(p => p.HasColumnType("varchar"));

            modelBuilder.Properties<string>()
                .Configure(p => p.HasMaxLength(100));
        }

        public override int SaveChanges()
        {
            foreach (var entry in ChangeTracker.Entries().Where(entry => entry.Entity.GetType().GetProperty("DataCadastro") != null))
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Property("DataCadastro").CurrentValue = DateTime.Now;
                }

                if (entry.State == EntityState.Modified)
                {
                    entry.Property("DataCadastro").IsModified = false;
                }
            }
            return base.SaveChanges();
        }
    }
}
