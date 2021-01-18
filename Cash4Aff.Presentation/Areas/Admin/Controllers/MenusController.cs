using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;
using DataTablesDotNet;
using DataTablesDotNet.Models;
using Cash4Aff.Application;
using Cash4Aff.Domain.Entities;
using Cash4Aff.Presentation.Filters;
using Cash4Aff.Presentation.Models;
using Cash4Aff.Application.Application;

namespace Cash4Aff.Presentation.Areas.Admin.Controllers
{
    [MvcAuthorizeAttribute]
    [ClaimsGroup(ClaimResources.Menus)]
    public class MenusController : BaseController
    {
        private readonly IMenuAppService _menuServices;

        public MenusController(IMenuAppService menuServices)
        {
            _menuServices = menuServices;
        }

        [ClaimsAction(ClaimsActions.Index)]
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult Data(DataTablesRequest model)
        {
            var data = _menuServices.GetAllPaging();
            var dataTableParser = new DataTablesParser<Menu>(model, data);
            var formattedList = dataTableParser.Process();
            return Json(formattedList, JsonRequestBehavior.AllowGet);
        }

    }
}