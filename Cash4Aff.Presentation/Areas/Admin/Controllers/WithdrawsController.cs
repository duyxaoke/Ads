using Cash4Aff.Application.Application.ICash4Aff;
using Cash4Aff.Domain.Entities;
using Cash4Aff.Presentation.Filters;
using DataTablesDotNet;
using DataTablesDotNet.Models;
using Microsoft.AspNet.Identity;
using System.Web.Mvc;

namespace Cash4Aff.Presentation.Areas.Admin.Controllers
{
    [MvcAuthorize]
    public class WithdrawsController : BaseController
    {
        private readonly IWithdrawAppService _services;
        private readonly IWalletAppService _walletAppService;

        public WithdrawsController(IWithdrawAppService services, IWalletAppService walletAppService)
        {
            _services = services;
            _walletAppService = walletAppService;
        }

        public ActionResult Index()
        {
            var ExistWallet = _walletAppService.GetByUser(User.Identity.GetUserId());
            if(ExistWallet == null)
            {
                return RedirectToAction("Index", "Wallets", new { isError = true});
            }
            var balance = 0; // UserPrincipal().Balance;
            ViewBag.Balance = balance;
            return View();
        }

        public JsonResult Data(DataTablesRequest model)
        {
            var data = _services.GetAllPaging();
            var dataTableParser = new DataTablesParser<Withdraw>(model, data);
            var formattedList = dataTableParser.Process();
            return Json(formattedList, JsonRequestBehavior.AllowGet);
        }
    }
}