using Cash4Aff.Domain.Entities;
using Cash4Aff.Domain.Helpers;
using System.Data.Entity.Migrations;
using System.Linq;

namespace Cash4Aff.Infra.Data.Context
{
    public class DatabaseInitializer : DbMigrationsConfiguration<SampleContext>
    {
        public DatabaseInitializer()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }
        protected override void Seed(SampleContext context)
        {
            if (!context.Menu.Any(r => r.Name == "Manage"))
            {
                var model = new Menu();
                model.Id = 1;
                model.Name = "Manage";
                model.Url = "#";
                model.Icon = "fa fa-cubes";
                model.IsActive = true;
                model.Order = 1;
                context.Menu.Add(model);
            }
            if (!context.Menu.Any(r => r.Name == "Role"))
            {
                var model = new Menu();
                model.Id = 2;
                model.ParentId = 1;
                model.Name = "Role";
                model.Url = "/Admin/Roles";
                model.Icon = "fa fa-cogs";
                model.IsActive = true;
                model.Order = 1;
                context.Menu.Add(model);
            }
            if (!context.Menu.Any(r => r.Name == "User"))
            {
                var model = new Menu();
                model.Id = 3;
                model.ParentId = 1;
                model.Name = "User";
                model.Url = "/Admin/Users";
                model.Icon = "fa fa-users";
                model.IsActive = true;
                model.Order = 2;
                context.Menu.Add(model);
            }
            if (!context.Menu.Any(r => r.Name == "Menu"))
            {
                var model = new Menu();
                model.Id = 4;
                model.ParentId = 1;
                model.Name = "Menu";
                model.Url = "/Admin/Menus";
                model.Icon = "fa fa-bars";
                model.IsActive = true;
                model.Order = 3;
                context.Menu.Add(model);
            }
            var roleId = RoleIds.Administrator.GetGuid();
            if (!context.MenuInRole.Any(r => r.RoleId == roleId))
            {
                var model1 = new MenuInRole { RoleId = RoleIds.Administrator.GetGuid(), MenuId = 1 };
                var model2 = new MenuInRole { RoleId = RoleIds.Administrator.GetGuid(), MenuId = 2 };
                var model3 = new MenuInRole { RoleId = RoleIds.Administrator.GetGuid(), MenuId = 3 };
                var model4 = new MenuInRole { RoleId = RoleIds.Administrator.GetGuid(), MenuId = 4 };
                context.MenuInRole.Add(model1);
                context.MenuInRole.Add(model2);
                context.MenuInRole.Add(model3);
                context.MenuInRole.Add(model4);

            }


            base.Seed(context);
        }
    }
    #region RoleIds
    enum RoleIds
    {
        [EnumGuid("0d0915ce-2f24-4555-8e83-ba2c4381b6d1")] Administrator,
        [EnumGuid("93e661d8-9172-4d99-bbcb-c905372065d4")] Manager,
        [EnumGuid("3c4e1a4a-0adf-47d4-a29f-27bee1380248")] User
    }
    #endregion
}