using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Cash4Aff.Presentation.Models;

namespace Cash4Aff.Presentation.Controllers
{
    public class ErrorsController : Controller
    {
        public ActionResult Unauthorised()
        {
            return View();
        }
    }
}