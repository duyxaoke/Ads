using Cash4Aff.Application.Application.ICash4Aff;
using Cash4Aff.Application.ViewModels.Cash4Aff;
using Cash4Aff.Domain.Entities;
using Cash4Aff.Domain.Helpers;
using Cash4Aff.Presentation.Filters;
using Cash4Aff.Presentation.Models;
using DataTablesDotNet;
using DataTablesDotNet.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Description;
using System.Web.Mvc;
using WebApiThrottle;

namespace Cash4Aff.Presentation.Controllers
{
    [MvcAuthorizeAttribute]

    public class AdsController : Controller
    {
        private readonly IAdsAppService _adservices;
        private readonly IUserViewedAdsAppService _userViewedAdsServices;

        public AdsController(IAdsAppService adservices, IUserViewedAdsAppService userViewedAdsServices)
        {
            _adservices = adservices;
            _userViewedAdsServices = userViewedAdsServices;
        }

        public ActionResult Index()
        {
            var ads = _adservices.GetByUserId(User.Identity.GetUserId());
            ads.Url = Command.GetUrl(ads.Url, User.Identity.GetUserId());
            return View(ads);
        }

        [HttpPost]
        [EnableThrottling(PerSecond = 1)]
        public async Task<ActionResult> Skip(int adsId)
        {
            try
            {
                var ads = await _adservices.GetByIdAsync(adsId);
                if(ads == null)
                {
                    return Json(new
                    {
                        success = false,
                        data = "Quảng cáo không tồn tại"
                    }, JsonRequestBehavior.AllowGet);
                }
                var model = new UserViewedAdsViewModel();
                model.Id = Guid.NewGuid();
                model.AdsId = ads.Id;
                model.UserId = User.Identity.GetUserId();
                model.Price = ads.Price;
                model.IsSKip = true;
                model.CreatedDate = DateTime.Now;
                _userViewedAdsServices.Add(model);
                return Json(new
                {
                    success = true,
                    data = "Bỏ qua thành công"
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    message = ex.Message
                }, JsonRequestBehavior.AllowGet);
            }

        }

    }
}