using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.Routing;

namespace Cash4Aff.Presentation.Helpers
{
    public static class GoogleCaptchaHelper
    {
        public static IHtmlString GoogleCaptcha(this HtmlHelper helper)
        {
            string publicSiteKey = WebConfigurationManager.AppSettings["GoogleRecaptchaSiteKey"];

            var mvcHtmlString = new TagBuilder("div")
            {
                Attributes =
            {
                new KeyValuePair<string, string>("class", "g-recaptcha"),
                new KeyValuePair<string, string>("data-sitekey", publicSiteKey)
            }
            };

            const string googleCaptchaScript = "<script src='https://www.google.com/recaptcha/api.js'></script>";
            var renderedCaptcha = mvcHtmlString.ToString(TagRenderMode.Normal);

            return MvcHtmlString.Create($"{googleCaptchaScript}{renderedCaptcha}");
        }
    }
}