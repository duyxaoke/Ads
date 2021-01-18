using Cash4Aff.Presentation.Filters;
using System.Web;
using System.Web.Mvc;

namespace Cash4Aff.Presentation
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            filters.Add(new WeborisationFilter());

        }
    }
}
