using DevTrends.MvcDonutCaching;
using System.Web.Mvc;

namespace Cash4Aff.Presentation.Controllers
{
    public class OutputCacheController : Controller
    {
        public JsonResult Remove()
        {
            var cacheManager = new OutputCacheManager();
            ////remove a single cached action output (Index action)
            //cacheManager.RemoveItem("OutputCache", "IndexCache");

            ////remove a single cached action output (page 1 of List action) -> remove theo id /OutputCache/IndexCache1?ProductID=1
            //cacheManager.RemoveItem("OutputCache", "IndexCache1", new { product_Id = 1 });

            ////remove all cached actions outputs for List action in Home controller
            //cacheManager.RemoveItems("OutputCache", "Index");

            ////remove all cached actions outputs for Home controller
            //cacheManager.RemoveItems("OutputCache");

            ////remove all cached action outputs
            cacheManager.RemoveItems();
            return Json(new
            {
                Result = "Ok"
            }, JsonRequestBehavior.AllowGet);
        }

    }
}