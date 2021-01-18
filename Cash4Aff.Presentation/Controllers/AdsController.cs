using Cash4Aff.Application.Application.ICash4Aff;
using Cash4Aff.Application.ViewModels.Cash4Aff;
using Cash4Aff.Domain.Entities;
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

        public async Task<ActionResult> Index()
        {
            var lstExist = await _userViewedAdsServices.GetAllAsync();
            var lstExist1 = lstExist.Where(x => x.UserId == User.Identity.GetUserId()).Select(x=> x.AdsId);
            var ads = await _adservices.GetAllAsync();
            var ads1 = ads.Where(x=> !lstExist1.Contains(x.Id)).FirstOrDefault();
            ads1.Url = String.Format(ads1.Url, User.Identity.GetUserId());
            return View(ads1);
        }
    }
}