using Cash4Aff.Application.Application.ICash4Aff;
using Cash4Aff.Application.ViewModels.Cash4Aff;
using Cash4Aff.Presentation.Filters;
using Microsoft.AspNet.Identity;
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
    [ApiAuthorize]
    [RoutePrefix("api/Withdraws")]
    public class WithdrawsController : ApiControllerBase
    {
        private readonly IWithdrawAppService _service;
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;

        public WithdrawsController(IWithdrawAppService service, ApplicationUserManager userManager, ApplicationSignInManager signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _service = service;
        }

        [HttpGet]
        [ResponseType(typeof(IEnumerable<WithdrawViewModel>))]
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
        [ResponseType(typeof(WithdrawViewModel))]
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
        [HttpGet]
        [Route("GetByUser")]
        [ResponseType(typeof(WithdrawViewModel))]
        public async Task<IHttpActionResult> GetByUserAsync(string userID)
        {
            try
            {
                var result = await _service.GetByUserAsync(userID);
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
        public async Task<IHttpActionResult> PostAsync([FromBody]WithdrawViewModel model)
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
                var user = _userManager.FindById(User.Identity.GetUserId());
                //if(user.Balance < model.Amount)
                //{
                //    return Content(HttpStatusCode.NotAcceptable, "Không đủ số dư");
                //}
                model.UserID = User.Identity.GetUserId();
                model.Status = 0;
                model.CreateDate = DateTime.Now;
                model.UpdateDate = DateTime.Now;
                _service.Add(model);

                //update balance
                //user.Balance -= model.Amount;
                await _userManager.UpdateAsync(user);
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
                    return InternalServerError();
                }
            }
        }

        [HttpPut]
        [ResponseType(typeof(void))]
        [EnableThrottling(PerSecond = 1)]
        public IHttpActionResult Put([FromBody]WithdrawViewModel model)
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
                    return InternalServerError();
                }
            }
        }

        [HttpDelete]
        [Route("{id:int}")]
        [ResponseType(typeof(void))]
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
