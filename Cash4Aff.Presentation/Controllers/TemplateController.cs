using System;
using System.Net;
using System.Web.Mvc;
using Cash4Aff.Application.ViewModels;
using Cash4Aff.Application;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNet.Identity;
using System.Linq;
using Cash4Aff.Application.Application;

namespace Cash4Aff.Presentation.Controllers
{
    public class TemplateController : Controller
    {
        private IMenuAppService _menuAppService;
        private IMenuInRoleAppService _menuInRolesAppService;
        private readonly ApplicationUserManager userManager;
        private readonly ApplicationRoleManager roleManager;
        public TemplateController(ApplicationUserManager userManager, ApplicationRoleManager roleManager,
            IMenuAppService menuAppService, IMenuInRoleAppService menuInRolesAppService)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            _menuInRolesAppService = menuInRolesAppService;
            _menuAppService = menuAppService;
        }
        public PartialViewResult Header()
        {
            return PartialView();
        }
        public PartialViewResult Sidebar()
        {

            var lsCurrentRole = new List<string>();
            //Da login => lay list role
            if (User.Identity.IsAuthenticated)
            {
                var currentRole = CurrentRole();
                foreach (var name in currentRole)
                {
                    lsCurrentRole.Add(roleManager.FindByNameAsync(name).Result.Id);
                }
                string userId = User.Identity.GetUserId();
                var Name = userManager.Users.FirstOrDefault(c => c.Id == userId).Name;
                ViewBag.Name = Name;
            }
            //chua login/ thi lay role la anomymous
            else
            {
                return PartialView(new List<MenuViewModel>());
                //lsCurrentRole.Add(roleManager.FindByNameAsync("Anonymous").Result.Id);
            }
            //get current menu tu role
            var lsCurrentMenu = _menuInRolesAppService.GetAll().Where(c => lsCurrentRole.Contains(c.RoleId.ToString())).Select(c => c.MenuId);

            var model = _menuAppService.GetParent()
                .Where(c => lsCurrentMenu.Contains(c.Id))
                .OrderBy(c => c.Order)
                .Select(l => new MenuViewModel
                {
                    Id = l.Id,
                    Name = l.Name,
                    Url = l.Url,
                    Icon = l.Icon,
                    Order = l.Order,
                    IsActive = l.IsActive,
                    ParentId = l.ParentId,
                    Childrens = GetChildren(l.Id)
                });
            return PartialView(model);
        }
        public PartialViewResult Footer()
        {
            return PartialView();
        }

        private List<MenuViewModel> GetChildren(int parentId)
        {
            var lsCurrentRole = new List<string>();
            //Da login => lay list role
            if (User.Identity.IsAuthenticated)
            {
                var currentRole = CurrentRole();
                foreach (var name in currentRole)
                {
                    lsCurrentRole.Add(roleManager.FindByNameAsync(name).Result.Id);
                }
            }
            //chua login/ thi lay role la anomymous
            else
            {
                lsCurrentRole = new List<string>();
                //lsCurrentRole.Add(roleManager.FindByNameAsync("Anonymous").Result.Id);
            }
            //get current menu tu role
            var lsCurrentMenu = _menuInRolesAppService.GetAll().Where(c => lsCurrentRole.Contains(c.RoleId.ToString())).Select(c => c.MenuId);

            return _menuAppService.GetChildren(parentId)
                 .Where(c => lsCurrentMenu.Contains(c.Id))
                 .OrderBy(l => l.Order)
                .Select(l => new MenuViewModel
                {
                    Id = l.Id,
                    Name = l.Name,
                    Url = l.Url,
                    Icon = l.Icon,
                    Order = l.Order,
                    IsActive = l.IsActive,
                    ParentId = l.ParentId,
                    Childrens = GetChildren(l.Id)
                }).ToList();
        }
        private List<string> CurrentRole()
        {
            var UserId = HttpContext.User.Identity.GetUserId();
            var currentRole = userManager.GetRoles(UserId);
            return currentRole.ToList();
        }


    }
}
