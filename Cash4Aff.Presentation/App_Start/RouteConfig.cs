using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Cash4Aff.Presentation
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            // BotDetect requests must not be routed 
            routes.IgnoreRoute("{*botdetect}",
            new { botdetect = @"(.*)BotDetectCaptcha\.ashx" });

            routes.MapRoute(
                "RedirectAndroid",
                "tai-ve-cho-android",
                new { controller = "Shorteners", action = "RedirectToAndroid", partner = UrlParameter.Optional },
                new[] { "Cash4Aff.Presentation.Controllers" }
            );

            routes.MapRoute(
                "RedirectIOS",
                "tai-ve-cho-ios",
                new { controller = "Shorteners", action = "RedirectToIOS", partner = UrlParameter.Optional },
                new[] { "Cash4Aff.Presentation.Controllers" }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
