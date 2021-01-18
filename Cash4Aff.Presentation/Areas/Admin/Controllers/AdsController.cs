using Cash4Aff.Application.Application.ICash4Aff;
using Cash4Aff.Application.ViewModels.Cash4Aff;
using Cash4Aff.Domain.Entities;
using Cash4Aff.Presentation.Filters;
using Cash4Aff.Presentation.Models;
using DataTablesDotNet;
using DataTablesDotNet.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using System;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Description;
using System.Web.Mvc;

namespace Cash4Aff.Presentation.Areas.Admin.Controllers
{
    [MvcAuthorizeAttribute]
    [ClaimsGroup(ClaimResources.Configs)]

    public class AdsController : Controller
    {
        private readonly IAdsAppService _Adservices;

        public AdsController(IAdsAppService Adservices)
        {
            _Adservices = Adservices;
        }

        [ClaimsAction(ClaimsActions.Index)]
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult Data(DataTablesRequest model)
        {
            var data = _Adservices.GetAllPaging();
            var dataTableParser = new DataTablesParser<Ads>(model, data);
            var formattedList = dataTableParser.Process();
            return Json(formattedList, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [ResponseType(typeof(AdsViewModel))]
        public async Task<ActionResult> GetByIdAsync(int id)
        {
            try
            {
                var result = await _Adservices.GetByIdAsync(id);
                return new JsonResult()
                {
                    Data = new
                    {
                        Data = result
                    },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    MaxJsonLength = Int32.MaxValue
                };
            }
            catch (Exception objEx)
            {
                return Json(new
                {
                    objCodeStep = objEx.Message
                }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}