using DataTablesDotNet;
using DataTablesDotNet.Models;
using Cash4Aff.Application;
using Cash4Aff.Application.ViewModels;
using Cash4Aff.Domain.Entities;
using Cash4Aff.Presentation.Filters;
using System.Linq;
using System.Web.Mvc;
using Cash4Aff.Application.Application;

namespace Cash4Aff.Presentation.Areas.Admin.Controllers
{
    [MvcAuthorizeAttribute]
    [ClaimsGroup(ClaimResources.Configs)]

    public class ConfigsController : Controller
    {
        private readonly IConfigAppService _configServices;

        public ConfigsController(IConfigAppService configServices)
        {
            _configServices = configServices;
        }

        [ClaimsAction(ClaimsActions.Index)]
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult Data(DataTablesRequest model)
        {
            var data = _configServices.GetAllPaging();
            var dataTableParser = new DataTablesParser<Config>(model, data);
            var formattedList = dataTableParser.Process();
            return Json(formattedList, JsonRequestBehavior.AllowGet);
        }

    }
}