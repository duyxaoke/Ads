using FluentValidation.WebApi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Tracing;
using WebApiThrottle;

namespace Cash4Aff.Presentation
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Serialize;
            GlobalConfiguration.Configuration.Formatters.Remove(GlobalConfiguration.Configuration.Formatters.XmlFormatter);

            //trace provider
            var traceWriter = new SystemDiagnosticsTraceWriter()
            {
                IsVerbose = true
            };
            config.Services.Replace(typeof(ITraceWriter), traceWriter);
            config.EnableSystemDiagnosticsTracing();

            config.MessageHandlers.Add(new ThrottlingHandler()
            {
                Policy = new ThrottlePolicy(perSecond: 1)
                {
                    IpThrottling = true, //Configure o throttling por id
                    EndpointThrottling = true,//habilitado a diferenca por endpoint
                    ClientThrottling = true, //configura a throttling a partir do header Authorization-Token
                    //IpWhitelist = new List<string>() { }
                    //ClientWhitelist = new List<string>() { "2222"}
                    StackBlockedRequests = true, //armazena o count das requests bloqueadas,
                    EndpointRules = new Dictionary<string, RateLimits>
                    {
                        { "api/trackings", new RateLimits { PerSecond = 5 } }
                    }
                },
                Repository = new CacheRepository()
            });
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();
            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("application/octet-stream"));
            var cors = new EnableCorsAttribute("https://localhost:44345", "*", "*");
            config.EnableCors(cors);
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            FluentValidationModelValidatorProvider.Configure(config);
        }
    }
}
