using Cash4Aff.Application.Application.ICash4Aff;
using Cash4Aff.Application.ViewModels.Cash4Aff;
using Cash4Aff.Domain.Entities;
using Cash4Aff.Presentation.Filters;
using Cash4Aff.Presentation.Models;
using DataTablesDotNet;
using DataTablesDotNet.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Cash4Aff.Presentation.Areas.Admin.Controllers
{
    [MvcAuthorize]
    public class WalletsController : BaseController
    {
        private readonly IWalletAppService _service;

        public WalletsController(IWalletAppService service)
        {
            _service = service;
        }

        public ActionResult Index(bool isError = false)
        {
            var model = _service.GetByUser(User.Identity.GetUserId());
            if (isError)
            {
                ViewBag.IsError = isError;
            }
            return View(model);
        }

    }
}