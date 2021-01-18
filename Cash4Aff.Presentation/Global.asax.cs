using DataTablesDotNet.ModelBinding;
using DataTablesDotNet.Models;
using Cash4Aff.Application.AutoMapper;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Cash4Aff.Presentation.Schedule;
using System;
using System.Web;
using Microsoft.AspNet.Identity;

namespace Cash4Aff.Presentation
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            ModelBinders.Binders.Add(typeof(DataTablesRequest), new DataTablesModelBinder());
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            //BundleConfig.RegisterBundles(BundleTable.Bundles);
            AutoMapperConfig.RegisterMappings();
            AutofacConfig.Register();
            //JobScheduler.Start();
        }
    }
}
