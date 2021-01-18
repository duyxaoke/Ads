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
using System.Data.Entity.Infrastructure;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Description;
using System.Web.Mvc;
using WebApiThrottle;

namespace Cash4Aff.Presentation.Areas.Admin.Controllers
{
    [MvcAuthorizeAttribute]

    public class AdsController : Controller
    {
        private readonly IAdsAppService _Adservices;

        public AdsController(IAdsAppService Adservices)
        {
            _Adservices = Adservices;
        }

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

        [HttpPost]
        [ResponseType(typeof(AdsViewModel))]
        public async Task<ActionResult> GetById(int id)
        {
            try
            {
                var result = await _Adservices.GetByIdAsync(id);
                return Json(new
                {
                    data = result
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception objEx)
            {
                return Json(new
                {
                    message = objEx.Message
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        [EnableThrottling(PerSecond = 1)]
        public ActionResult Create(AdsViewModel model)
        {
            try
            {
                _Adservices.Add(model);
                return Json(new
                {
                    data = true
                }, JsonRequestBehavior.AllowGet);
            }
            catch (DbUpdateException ex)
            {
                return Json(new
                {
                    message = ex.Message
                }, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        [EnableThrottling(PerSecond = 1)]
        public ActionResult Update(AdsViewModel model)
        {
            try
            {
                _Adservices.Update(model);
                return Json(new
                {
                    data = true
                }, JsonRequestBehavior.AllowGet);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Json(new
                {
                    message = ex.Message
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult Delete(int id)
        {
            try
            {
                _Adservices.Remove(id);
                return Json(new
                {
                    data = true
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    message = ex.Message
                }, JsonRequestBehavior.AllowGet);
            }
        }

        #region Helpers
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _Adservices.Dispose();
            }
            base.Dispose(disposing);
        }
        private bool Exists(int id)
        {
            return _Adservices.GetByIdAsync(id) != null;
        }
        #endregion

    }
}