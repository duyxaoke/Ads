using Cash4Aff.Application.Application.ICash4Aff;
using Cash4Aff.Application.ViewModels.Cash4Aff;
using Cash4Aff.Presentation.Filters;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using WebApiThrottle;

namespace Cash4Aff.Presentation.Controllers.Api
{
    [ApiAuthorizeAttribute]
    [RoutePrefix("api/UserRefs")]
    public class UserRefsController : ApiControllerBase
    {
        private readonly IUserRefAppService _service;

        public UserRefsController(IUserRefAppService service)
        {
            _service = service;
        }

        [HttpGet]
        [ResponseType(typeof(IEnumerable<UserRefViewModel>))]
        public async Task<IHttpActionResult> GetAllAsync()
        {
            try
            {
                var result = await _service.GetAllAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }

        [HttpGet]
        [Route("{id:int}")]
        [ResponseType(typeof(UserRefViewModel))]
        public async Task<IHttpActionResult> GetByIdAsync(int id)
        {
            try
            {
                var result = await _service.GetByIdAsync(id);
                if (result == null)
                {
                    return NotFound();
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }

        [HttpPost]
        [ResponseType(typeof(void))]
        [EnableThrottling(PerSecond = 1)]
        public IHttpActionResult Post([FromBody]UserRefViewModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = new List<string>();
                foreach (var state in ModelState)
                {
                    foreach (var error in state.Value.Errors)
                    {
                        errors.Add(error.ErrorMessage);
                    }
                }
                return Content(HttpStatusCode.NotAcceptable, errors);
            }
            try
            {
                _service.Add(model);
                return Content(HttpStatusCode.Created, model.Id);

            }
            catch (DbUpdateException)
            {
                if (Exists(model.Id))
                {
                    return Conflict();
                }
                else
                {
                    return InternalServerError();
                }
            }
        }

        [HttpPut]
        [ResponseType(typeof(void))]
        [EnableThrottling(PerSecond = 1)]
        public IHttpActionResult Put([FromBody]UserRefViewModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = new List<string>();
                foreach (var state in ModelState)
                {
                    foreach (var error in state.Value.Errors)
                    {
                        errors.Add(error.ErrorMessage);
                    }
                }
                return Content(HttpStatusCode.NotAcceptable, errors);
            }
            try
            {
                _service.Update(model);
                return Ok();

            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Exists(model.Id))
                {
                    return NotFound();
                }
                else
                {
                    return InternalServerError();
                }
            }
        }

        [HttpDelete]
        [Route("{id:int}")]
        [EnableThrottling(PerSecond = 1)]
        public IHttpActionResult Delete(int id)
        {
            try
            {
                _service.Remove(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }

        #region Helpers
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _service.Dispose();
            }
            base.Dispose(disposing);
        }
        private bool Exists(int id)
        {
            return _service.GetByIdAsync(id) != null;
        }
        #endregion
    }
}
