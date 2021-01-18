using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.Routing;

namespace Cash4Aff.Presentation.Helpers
{
    public static class InvalidGoogleCaptchaHelper
    {
        public static IHtmlString InvalidGoogleCaptchaLabel(this HtmlHelper helper, string errorText)
        {
            var invalidCaptchaObj = helper.ViewContext.Controller.TempData["InvalidCaptcha"];

            var invalidCaptcha = invalidCaptchaObj?.ToString();
            if (string.IsNullOrWhiteSpace(invalidCaptcha)) return MvcHtmlString.Create("");

            var buttonTag = new TagBuilder("span")
            {
                Attributes =
            {
                new KeyValuePair<string, string>("class", "text text-danger")
            },
                InnerHtml = errorText ?? invalidCaptcha
            };

            return MvcHtmlString.Create(buttonTag.ToString(TagRenderMode.Normal));
        }
    }
}