using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Cash4Aff.Presentation.Startup))]
namespace Cash4Aff.Presentation
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
