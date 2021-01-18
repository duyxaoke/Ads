    using System;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Google;
using Owin;
using Cash4Aff.Presentation.Models;
using System.Web;
using System.Linq;
using System.Security.Claims;
using System.Collections.Generic;
using System.Web.Mvc;

namespace Cash4Aff.Presentation
{
    public partial class Startup
    {
        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
            // Configure the db context, user manager and signin manager to use a single instance per request
            app.CreatePerOwinContext(ApplicationDbContext.Create);
            app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);
            app.CreatePerOwinContext<ApplicationSignInManager>(ApplicationSignInManager.Create);

            // Enable the application to use a cookie to store information for the signed in user
            // and to use a cookie to temporarily store information about a user logging in with a third party login provider
            // Configure the sign in cookie
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/Account/Login"),
                ExpireTimeSpan = TimeSpan.FromDays(365),
                //Provider = GetStandardCookieAuthenticationProvider(),
                Provider = GetMyCookieAuthenticationProvider(),
                CookieName = "jumpingjacks",
                CookieHttpOnly = true,
            });

            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // Enables the application to temporarily store user information when they are verifying the second factor in the two-factor authentication process.
            app.UseTwoFactorSignInCookie(DefaultAuthenticationTypes.TwoFactorCookie, TimeSpan.FromDays(365));

            // Enables the application to remember the second login verification factor such as phone or email.
            // Once you check this option, your second step of verification during the login process will be remembered on the device where you logged in from.
            // This is similar to the RememberMe option when you log in.
            app.UseTwoFactorRememberBrowserCookie(DefaultAuthenticationTypes.TwoFactorRememberBrowserCookie);

            // Uncomment the following lines to enable logging in with third party login providers
            //app.UseMicrosoftAccountAuthentication(
            //    clientId: "",
            //    clientSecret: "");

            //app.UseTwitterAuthentication(
            //   consumerKey: "",
            //   consumerSecret: "");

            app.UseFacebookAuthentication(
               appId: "2177326965865790",
               appSecret: "9568e389dd237d3c2ba7e656fe3c5b39");

            app.UseGoogleAuthentication(new GoogleOAuth2AuthenticationOptions()
            {
                ClientId = "283446633757-0aivemr1tn3ckt0soj6r4q398632nt7k.apps.googleusercontent.com",
                ClientSecret = "fHKhHvwLhqSI9S2whF87c4OG"
            });
        }
        private static bool IsApiRequest(IOwinRequest request)
        {
            string apiPath = VirtualPathUtility.ToAbsolute("~/api/");
            return request.Uri.LocalPath.StartsWith(apiPath);
        }

        /// <summary>
        /// Cookie auth provider that adds extra role claims on the identity
        /// Role claims are kept in cache and added on the identity on every request
        /// </summary>
        /// <returns></returns>
        private static CookieAuthenticationProvider GetMyCookieAuthenticationProvider()
        {
            var cookieAuthenticationProvider = new CookieAuthenticationProvider();

            cookieAuthenticationProvider.OnValidateIdentity = async context =>
            {
                var cookieValidatorFunc = SecurityStampValidator.OnValidateIdentity<ApplicationUserManager, ApplicationUser>(
                    TimeSpan.FromDays(365),
                    (manager, user) =>
                    {
                        var identity = user.GenerateUserIdentityAsync(manager);
                        return identity;
                    });
                await cookieValidatorFunc.Invoke(context);

                if (context.Identity == null || !context.Identity.IsAuthenticated)
                {
                    return;
                }

                // get list of roles on the user
                var userRoles = context.Identity
                                       .Claims
                                       .Where(c => c.Type == ClaimTypes.Role)
                                       .Select(c => c.Value)
                                       .ToList();

                foreach (var roleName in userRoles)
                {
                    var cacheKey = ApplicationRole.GetCacheKey(roleName);
                    var cachedClaims = System.Web.HttpContext.Current.Cache[cacheKey] as IEnumerable<Claim>;
                    if (cachedClaims == null)
                    {
                        var roleManager = DependencyResolver.Current.GetService<ApplicationRoleManager>();
                        cachedClaims = await roleManager.GetClaimsAsync(roleName);
                        System.Web.HttpContext.Current.Cache[cacheKey] = cachedClaims;
                    }
                    context.Identity.AddClaims(cachedClaims);
                }
            };
            cookieAuthenticationProvider.OnApplyRedirect = ctx =>
            {
                if (!IsApiRequest(ctx.Request))
                {
                    ctx.Response.Redirect(ctx.RedirectUri);
                }
            };
            return cookieAuthenticationProvider;
        }


        /// <summary>
        /// This is run of the mill cookie authentication provider
        /// with invalidating the cookie on security stamp change every 10 minutes
        /// </summary>
        /// <returns></returns>
        private static CookieAuthenticationProvider GetStandardCookieAuthenticationProvider()
        {
            return new CookieAuthenticationProvider()
            {
                OnValidateIdentity = SecurityStampValidator.OnValidateIdentity<ApplicationUserManager, ApplicationUser>(
                    TimeSpan.FromDays(365),
                    (manager, user) =>
                    {
                        var identity = manager.GenerateUserIdentityAsync(user);
                        return identity;
                    })
            };
        }


        //private static CookieAuthenticationProvider RoleUpdatingAuthenticationProvider()
        //{
        //    var cookieAuthenticationProvider = new CookieAuthenticationProvider();
        //    cookieAuthenticationProvider.OnValidateIdentity = async context =>
        //    {
        //        // invalidate user cookie if user's security stamp have changed
        //        var invalidateBySecirityStamp = SecurityStampValidator.OnValidateIdentity<ApplicationUserManager, ApplicationUser>(
        //                validateInterval: TimeSpan.FromMinutes(30),
        //                regenerateIdentity: (manager, user) => user.GenerateUserIdentityAsync(manager));
        //        await invalidateBySecirityStamp.Invoke(context);


        //        if (context.Identity == null || !context.Identity.IsAuthenticated)
        //        {
        //            return;
        //        }

        //        var userManager = context.OwinContext.GetUserManager<UserManager>();
        //        var username = context.Identity.Name;
        //        var updatedUser = await userManager.FindByNameAsync(username);

        //        var newIdentity = updatedUser.GenerateUserIdentityAsync(manager);

        //        // kill old cookie
        //        context.OwinContext.Authentication.SignOut(context.Options.AuthenticationType);

        //        // sign in again
        //        var authenticationProperties = new AuthenticationProperties() { IsPersistent = context.Properties.IsPersistent };
        //        context.OwinContext.Authentication.SignIn(authenticationProperties, newIdentity);
        //    };
        //    return cookieAuthenticationProvider;
        //}
    }
}