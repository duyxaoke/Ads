using Autofac;
using Autofac.Integration.Mvc;
using Autofac.Integration.WebApi;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Cash4Aff.Application;
using Cash4Aff.Domain.Interfaces.Repositories;
using Cash4Aff.Infra.Data.Context;
using Cash4Aff.Infra.Data.Repositories;
using Cash4Aff.Presentation.Filters;
using Cash4Aff.Presentation.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using Cash4Aff.Application.Cash4Aff;
using Cash4Aff.Application.Application.ICash4Aff;
using Cash4Aff.Application.Application;

namespace Cash4Aff.Presentation
{
    public class AutofacConfig
    {
        public static void Register()
        {
            var builder = new ContainerBuilder();
            //bạn sẽ khai báo các class và interface tương ứng ở đây
            builder.RegisterControllers(Assembly.GetExecutingAssembly()); //Register MVC Controllers
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly()); //Register WebApi Controllers
            // MVC - OPTIONAL: Register model binders that require DI.
            builder.RegisterModelBinders(typeof(MvcApplication).Assembly);
            builder.RegisterModelBinderProvider();
            builder.RegisterModule(new AutofacWebTypesModule());

            builder.RegisterType<SampleContext>().AsSelf().InstancePerRequest();
            builder.RegisterType<ApplicationDbContext>().AsSelf().InstancePerRequest();
            builder.RegisterType<ApplicationUserManager>().AsSelf().InstancePerRequest();
            builder.RegisterType<ApplicationRoleManager>().AsSelf().InstancePerRequest();
            builder.RegisterType<ApplicationSignInManager>().AsSelf().InstancePerRequest();
            builder.RegisterType<ClaimedActionsProvider>().AsSelf().InstancePerRequest();
            builder.Register(c => new UserStore<ApplicationUser>(c.Resolve<ApplicationDbContext>())).AsImplementedInterfaces().InstancePerRequest();
            builder.Register(c => HttpContext.Current.GetOwinContext().Authentication).As<IAuthenticationManager>();
            builder.Register(c => new IdentityFactoryOptions<ApplicationUserManager>
            {
                DataProtectionProvider = new Microsoft.Owin.Security.DataProtection.DpapiDataProtectionProvider("Application​")
            });
            builder.Register(c => new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString))
            .As<IDbConnection>().InstancePerLifetimeScope();

            builder.RegisterType<MenuRepository>().As<IMenuRepository>().InstancePerLifetimeScope();
            builder.RegisterType<MenuAppService>().As<IMenuAppService>().InstancePerDependency();
            builder.RegisterType<MenuInRoleRepository>().As<IMenuInRoleRepository>().InstancePerLifetimeScope();
            builder.RegisterType<MenuInRoleAppService>().As<IMenuInRoleAppService>().InstancePerDependency();
            builder.RegisterType<ConfigRepository>().As<IConfigRepository>().InstancePerLifetimeScope();
            builder.RegisterType<ConfigAppService>().As<IConfigAppService>().InstancePerDependency();
            builder.RegisterType<AdsRepository>().As<IAdsRepository>().InstancePerLifetimeScope();
            builder.RegisterType<AdsAppService>().As<IAdsAppService>().InstancePerDependency();
            builder.RegisterType<UserViewedAdsRepository>().As<IUserViewedAdsRepository>().InstancePerLifetimeScope();
            builder.RegisterType<UserViewedAdsAppService>().As<IUserViewedAdsAppService>().InstancePerDependency();

            #region Cash4Aff
            builder.RegisterType<WithdrawRepository>().As<IWithdrawRepository>().InstancePerLifetimeScope();
            builder.RegisterType<WithdrawAppService>().As<IWithdrawAppService>().InstancePerDependency();
            builder.RegisterType<BankRepository>().As<IBankRepository>().InstancePerLifetimeScope();
            builder.RegisterType<BankAppService>().As<IBankAppService>().InstancePerDependency();
            builder.RegisterType<WalletRepository>().As<IWalletRepository>().InstancePerLifetimeScope();
            builder.RegisterType<WalletAppService>().As<IWalletAppService>().InstancePerDependency();
            builder.RegisterType<UserRefRepository>().As<IUserRefRepository>().InstancePerLifetimeScope();
            builder.RegisterType<UserRefAppService>().As<IUserRefAppService>().InstancePerDependency();
            builder.RegisterType<BalanceRepository>().As<IBalanceRepository>().InstancePerLifetimeScope();
            builder.RegisterType<BalanceAppService>().As<IBalanceAppService>().InstancePerDependency();
            #endregion

            // Set the dependency resolver to be Autofac.
            var container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
            GlobalConfiguration.Configuration.DependencyResolver = new AutofacWebApiDependencyResolver((IContainer)container); //Set the WebApi DependencyResolver

        }
    }
}
