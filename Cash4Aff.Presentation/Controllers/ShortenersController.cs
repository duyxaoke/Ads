using System.Web.Mvc;
using Cash4Aff.Presentation.Helpers;
using System.Web;
using System.Text;
using static Cash4Aff.Presentation.Helpers.StringExtensions;
using Cash4Aff.Presentation.Models;
using System;

namespace Cash4Aff.Presentation.Controllers
{
    public class ShortenersController : Controller
    {
        private readonly ApplicationUserManager _userManager;

        public ShortenersController(ApplicationUserManager userManager)
        {
            _userManager = userManager;
        }

        public ActionResult RedirectToAndroid(string code)
        {
            try
            {
                ApplicationUser user = _userManager.FindByNameAsync(code).Result;
                string url = string.Format(user.AndroidLink, DateTime.Now.ToString("dd-MM-yyyy-HH:mm:ss"));
                return Redirect(url);
            }
            catch
            {
                return View("~/Views/Errors/NotFound.cshtml");
            }
        }

        public ActionResult RedirectToIOS(string code)
        {
            try
            {
                ApplicationUser user = _userManager.FindByNameAsync(code).Result;
                string url = string.Format(user.IOSLink, DateTime.Now.ToString("dd-MM-yyyy-HH:mm:ss"));
                return Redirect(url);
            }
            catch
            {
                return View("~/Views/Errors/NotFound.cshtml");
            }
        }

    }
}