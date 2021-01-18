using Cash4Aff.Application;
using Cash4Aff.Application.Application;
using Cash4Aff.Application.ViewModels;
using Cash4Aff.Domain.Entities;
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
    [RoutePrefix("api/Menus")]
    public class MenusController : ApiControllerBase
    {
        private readonly IMenuAppService _service;

        public MenusController(IMenuAppService service)
        {
            _service = service;
        }

        [HttpGet]
        [ResponseType(typeof(IEnumerable<Menu>))]
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
        [ResponseType(typeof(Menu))]
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
        public IHttpActionResult Post([FromBody]MenuViewModel model)
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
            catch (DbUpdateException ex)
            {
                if (Exists(model.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }
        }

        [HttpPut]
        [ResponseType(typeof(void))]
        [EnableThrottling(PerSecond = 1)]
        public IHttpActionResult Put([FromBody]MenuViewModel model)
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
            catch (DbUpdateConcurrencyException ex)
            {
                if (!Exists(model.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        [HttpDelete]
        [Route("{id}")]
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
        private bool Exists(int id)
        {
            return _service.GetByIdAsync(id) != null;
        }
        #endregion
    }
}
