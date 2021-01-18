using System;
using System.Web;
using System.Web.Mvc;
using Cash4Aff.Presentation.Models;
using DevTrends.MvcDonutCaching;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Newtonsoft.Json;
using WebApi.OutputCache.V2;

namespace Cash4Aff.Presentation.Areas.Admin.Controllers
{
    //[AutoInvalidateCacheOutput]
    //[CacheOutput(ServerTimeSpan = 84000, ExcludeQueryStringFromCacheKey = true)]
    //[DonutOutputCache(Duration = 10800)]
    public class BaseController : Controller
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;

        public BaseController()
        {
        }

        public BaseController(ApplicationUserManager userManager, ApplicationSignInManager signInManager)
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set
            {
                _signInManager = value;
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        protected ApplicationUser UserPrincipal()
        {
            var user = UserManager.FindByIdAsync(User.Identity.GetUserId()).Result;
            return user;
        }

        // GET: Base
        protected class JsonNetResult : JsonResult
        {
            public override void ExecuteResult(ControllerContext context)
            {
                if (context == null)
                    throw new ArgumentNullException("context");

                var response = context.HttpContext.Response;

                response.ContentType = !String.IsNullOrEmpty(ContentType)
                    ? ContentType
                    : "application/json";

                if (ContentEncoding != null)
                    response.ContentEncoding = ContentEncoding;

                var serializedObject = JsonConvert.SerializeObject(Data, Formatting.Indented,
                        new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        });
                response.Write(serializedObject);
            }
        }

    }
}