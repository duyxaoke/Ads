using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity.Migrations;
using System.Linq;
using Cash4Aff.Domain.Helpers;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security;

namespace Cash4Aff.Presentation.Models
{
    public class DatabaseInitializer : DbMigrationsConfiguration<ApplicationDbContext>
    {
        public DatabaseInitializer()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }
        protected override void Seed(ApplicationDbContext context)
        {

            if (!context.Roles.Any(r => r.Name == "Administrator"))
            {

                var store = new RoleStore<ApplicationRole>(context);
                var manager = new RoleManager<ApplicationRole>(store);

                var role = new ApplicationRole { Id = RoleIds.Administrator.GetGuid().ToString(), Name = "Administrator" };
                manager.Create(role);
            }
            if (!context.Roles.Any(r => r.Name == "User"))
            {
                var store = new RoleStore<ApplicationRole>(context);
                var manager = new RoleManager<ApplicationRole>(store);
                var role = new ApplicationRole { Id = RoleIds.User.GetGuid().ToString(), Name = "User" };
                manager.Create(role);
            }

            if (!context.Roles.Any(r => r.Name == "Manager"))
            {
                var store = new RoleStore<ApplicationRole>(context);
                var manager = new RoleManager<ApplicationRole>(store);
                var role = new ApplicationRole { Id = RoleIds.Manager.GetGuid().ToString(), Name = "Manager" };
                manager.Create(role);
            }

            if (!context.Users.Any(u => u.UserName == "admin"))
            {
                var store = new UserStore<ApplicationUser>(context);
                var manager = new UserManager<ApplicationUser>(store);
                var user = new ApplicationUser
                {
                    Id = AccountIds.Admin.GetGuid().ToString(),
                    UserName = "admin",
                    Name = "Tran Duy",
                    Email = "duytran1402@gmail.com",
                    EmailConfirmed = true
                };

                manager.Create(user, "123456");
                manager.AddToRole(user.Id, "Administrator");
            }
            if (!context.Users.Any(u => u.UserName == "user"))
            {
                var store = new UserStore<ApplicationUser>(context);
                var manager = new UserManager<ApplicationUser>(store);
                var user = new ApplicationUser
                {
                    Id = AccountIds.User.GetGuid().ToString(),
                    UserName = "user",
                    Name = "user",
                    Email = "user@gmail.com",
                    EmailConfirmed = true
                };

                manager.Create(user, "123456");
                manager.AddToRole(user.Id, "User");
            }

            var roleAdminId = RoleIds.Administrator.GetGuid().ToString();
            if (!context.RoleClaims.Any(r => r.RoleId == roleAdminId))
            {
                var model1 = new RoleClaim { RoleId = roleAdminId, ClaimType = "1", ClaimValue = "Index" };
                var model2 = new RoleClaim { RoleId = roleAdminId, ClaimType = "2", ClaimValue = "Index" };
                context.RoleClaims.Add(model1);
                context.RoleClaims.Add(model2);
            }

            base.Seed(context);
        }

        #region AccountIds
        enum AccountIds
        {
            [EnumGuid("240de0d4-ade7-417e-a034-9b63cc2de853")] Admin,
            [EnumGuid("1966c895-c0d4-40d6-b201-47c0dd0228e1")] User
        }
        #endregion

        #region RoleIds
        enum RoleIds
        {
            [EnumGuid("0d0915ce-2f24-4555-8e83-ba2c4381b6d1")] Administrator,
            [EnumGuid("93e661d8-9172-4d99-bbcb-c905372065d4")] Manager,
            [EnumGuid("3c4e1a4a-0adf-47d4-a29f-27bee1380248")] User
        }
        #endregion

    }
}