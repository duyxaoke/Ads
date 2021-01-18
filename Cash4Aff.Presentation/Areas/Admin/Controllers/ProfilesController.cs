using Cash4Aff.Application.Application.ICash4Aff;
using Cash4Aff.Domain.Entities;
using Cash4Aff.Presentation.Filters;
using Cash4Aff.Presentation.Models;
using DataTablesDotNet;
using DataTablesDotNet.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Cash4Aff.Presentation.Areas.Admin.Controllers
{
    [MvcAuthorize]
    public class ProfilesController : BaseController
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;

        public ProfilesController()
        {
        }

        public ProfilesController(ApplicationUserManager userManager, ApplicationSignInManager signInManager)
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

        public ActionResult Index()
        {
            var userId = User.Identity.GetUserId();
            var user = UserManager.FindById(userId);
            ProfileViewModel model = new ProfileViewModel();
            model.Email = user.Email;
            model.Birthday = user.Birthday.HasValue ? user.Birthday : null;
            model.Name = user.Name;
            model.Gender = user.Gender;
            model.Phone = user.PhoneNumber;
            return View(model);
        }

    }
}