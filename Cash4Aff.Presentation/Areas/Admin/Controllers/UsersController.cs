using System.Linq;
using System.Web.Mvc;
using DataTablesDotNet;
using DataTablesDotNet.Models;
using Cash4Aff.Presentation.Filters;
using Cash4Aff.Presentation.Models;

namespace Cash4Aff.Presentation.Areas.Admin.Controllers
{
    [ClaimsGroup(ClaimResources.Users)]
    [MvcAuthorizeAttribute]
    public class UsersController : BaseController
    {
        private readonly ApplicationUserManager _userManager;
        private readonly ClaimedActionsProvider _claimedActionsProvider;
        private readonly ApplicationRoleManager _roleManager;


        public UsersController(ApplicationUserManager userManager, ClaimedActionsProvider claimedActionsProvider, ApplicationRoleManager roleManager)
        {
            _userManager = userManager;
            _claimedActionsProvider = claimedActionsProvider;
            _roleManager = roleManager;
        }

        [ClaimsAction(ClaimsActions.Index)]
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Data(DataTablesRequest model)
        {
            var data = _userManager.Users.AsQueryable();
            var dataTableParser = new DataTablesParser<ApplicationUser>(model, data);
            var formattedList = dataTableParser.Process();
            return Json(formattedList, JsonRequestBehavior.AllowGet);
        }
    }
}