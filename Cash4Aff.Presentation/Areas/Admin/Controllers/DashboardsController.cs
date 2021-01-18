using Cash4Aff.Presentation.Filters;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Cash4Aff.Application.Application.ICash4Aff;
using Cash4Aff.Application.ViewModels;

namespace Cash4Aff.Presentation.Areas.Admin.Controllers
{
    [MvcAuthorizeAttribute]
    public class DashboardsController : Controller
    {

        private readonly ApplicationUserManager _userManager;
        private readonly ClaimedActionsProvider _claimedActionsProvider;
        private readonly ApplicationRoleManager _roleManager;
        private IBalanceAppService _BalanceAppService;


        public DashboardsController(ApplicationUserManager userManager, ClaimedActionsProvider claimedActionsProvider, ApplicationRoleManager roleManager, IBalanceAppService BalanceAppService)
        {
            _userManager = userManager;
            _claimedActionsProvider = claimedActionsProvider;
            _roleManager = roleManager;
            _BalanceAppService = BalanceAppService;
        }
        public ActionResult Index()
        {
            var balance = _BalanceAppService.GetByUser(User.Identity.GetUserId());
            var userInfo = new UserInfoViewModel();
            userInfo.UserID = balance.UserID;
            userInfo.AvailableBalance = balance.AvailableBalance;
            userInfo.TotalBalance = balance.TotalBalance;
            userInfo.ReferenceBalance = 0;
            userInfo.TotalRef = 0;
            userInfo.RankName = "Vàng";
            ViewBag.UserInfo = userInfo;
            return View();
        }
    }
}