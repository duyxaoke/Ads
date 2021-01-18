using Cash4Aff.Application.Application.ICash4Aff;
using Cash4Aff.Domain.Entities;
using Cash4Aff.Presentation.Filters;
using DataTablesDotNet;
using DataTablesDotNet.Models;
using System.Web.Mvc;
using Cash4Aff.Presentation.Helpers;
using System.Linq;
using Microsoft.AspNet.Identity;

namespace Cash4Aff.Presentation.Areas.Admin.Controllers
{
    [MvcAuthorize]
    public class ReferencesController : BaseController
    {
        private readonly ApplicationUserManager _userManager;


        public ReferencesController(ApplicationUserManager userManager)
        {
            _userManager = userManager;

        }

        //[ClaimsAction(ClaimsActions.Index)]
        public ActionResult Index()
        {
            var lstUser = UserTreesHelper.BuildTree(_userManager.Users.ToList().ToDataTable(), User.Identity.GetUserId());
            ViewBag.UserTreeView = lstUser;
            return View();
        }

    }
}