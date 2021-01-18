using Cash4Aff.Application.ViewModels;
using Cash4Aff.Presentation.Controllers.Api;
using Cash4Aff.Presentation.Filters;
using Cash4Aff.Presentation.Models;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using WebApiThrottle;
using static Cash4Aff.Presentation.Models.RoleClaimsViewModel;

namespace Cash4Aff.Presentation.Controllers.Api
{
    [ApiAuthorizeAttribute]
    [RoutePrefix("api/Users")]
    public class UsersController : ApiControllerBase
    {
        private readonly ApplicationRoleManager _roleManager;
        private readonly ApplicationUserManager _userManager;
        private readonly ClaimedActionsProvider _claimedActionsProvider;


        public UsersController(ApplicationRoleManager roleManager, ApplicationUserManager userManager, ClaimedActionsProvider claimedActionsProvider)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _claimedActionsProvider = claimedActionsProvider;
        }
        [HttpGet]
        [Route("list")]
        public IHttpActionResult List()
        {
            try
            {
                var result = _userManager.Users.ToList();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }


        [HttpGet]
        [Route("view-claims/{id}")]
        public async Task<IHttpActionResult> GetAsync(string id)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                {
                    return NotFound();
                }
                var userRoles = await _userManager.GetRolesAsync(id);
                var userclaims = new List<Claim>();
                foreach (var role in userRoles)
                {
                    var roleClaims = await _roleManager.GetClaimsAsync(role);

                    userclaims.AddRange(roleClaims);
                }

                var claimGroups = _claimedActionsProvider.GetClaimGroups();

                var result = new UserClaimsViewModel()
                {
                    UserName = user.UserName,
                };

                foreach (var claimGroup in claimGroups)
                {
                    var claimGroupModel = new UserClaimsViewModel.ClaimGroup()
                    {
                        GroupId = claimGroup.GroupId,
                        GroupName = claimGroup.GroupName,
                        GroupClaimsCheckboxes = claimGroup.Claims
                            .Select(c => new SelectListViewModel()
                            {
                                Value = String.Format("{0}#{1}", claimGroup.GroupId, c),
                                Text = c,
                                Selected = userclaims.Any(ac => ac.Type == claimGroup.GroupId.ToString() && ac.Value == c)
                            }).ToList()
                    };
                    result.ClaimGroups.Add(claimGroupModel);
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }
        [HttpPost]
        [Route("Create")]
        [EnableThrottling(PerSecond = 1)]
        public async Task<IHttpActionResult> PostAsync([FromBody]UserViewModel model)
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
                ApplicationUser user = new ApplicationUser
                {
                    Name = model.Name,
                    UserName = model.UserName,
                    Email = model.Email
                };
                var result = await _userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                {
                    string errorMessage = result.Errors.FirstOrDefault();
                    return BadRequest(errorMessage);
                }
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
        private bool Exists(string id)
        {
            return _userManager.FindByIdAsync(id) != null;
        }

        [HttpGet]
        [Route("{id}")]
        [EnableThrottling(PerSecond = 1)]
        public async Task<IHttpActionResult> GetByIdAsync(string id)
        {
            try
            {
                ApplicationUser result = await _userManager.FindByIdAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }

        }

        [HttpGet]
        [AllowAnonymous]
        [EnableThrottling(PerSecond = 1)]
        public async Task<IHttpActionResult> GetByUsernameAsync(string userid)
        {
            try
            {
                ApplicationUser result = await _userManager.FindByIdAsync(userid);
                if (result == null)
                    return NotFound();
                return Ok(new { Name = result.Name, Email = result.Email, UserName = result.UserName });
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }

        }
        [HttpPut]
        [Route("Update")]
        [EnableThrottling(PerSecond = 1)]
        public async Task<IHttpActionResult> PutAsync([FromBody]UserViewModel model)
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
                ApplicationUser user = await _userManager.FindByIdAsync(model.Id);
                user.Name = model.Name;
                user.Email = model.Email;
                user.UserName = model.UserName;
                if (!String.IsNullOrEmpty(model.Password))
                {
                    user.PasswordHash = _userManager.PasswordHasher.HashPassword(model.Password);
                }
                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    string errorMessage = result.Errors.FirstOrDefault();
                    return BadRequest(errorMessage);
                }
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("Update-Profile")]
        [EnableThrottling(PerSecond = 1)]
        public async Task<IHttpActionResult> UpdateAsync([FromBody]ProfileViewModel model)
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
                ApplicationUser user = await _userManager.FindByIdAsync(User.Identity.GetUserId());
                user.Birthday = model.Birthday;
                user.Gender = model.Gender;
                user.Name = model.Name;
                user.PhoneNumber = model.Phone;
                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    string errorMessage = result.Errors.FirstOrDefault();
                    return BadRequest(errorMessage);
                }
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("EditRoles/{id}")]
        public async Task<IHttpActionResult> EditRoles(string id)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                {
                    return NotFound();
                }
                var assignedRoles = await _userManager.GetRolesAsync(user.Id);

                var allRoles = await _roleManager.Roles.ToListAsync();

                var userRoles = allRoles.Select(r => new SelectListViewModel()
                {
                    Value = r.Name,
                    Text = r.Name,
                    Selected = assignedRoles.Contains(r.Name),
                }).ToList();

                var result = new UserRolesViewModel
                {
                    Username = user.UserName,
                    UserId = user.Id,
                    UserRoles = userRoles,
                };
                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }
        [HttpPost]
        [Route("EditRoles")]
        [EnableThrottling(PerSecond = 1)]
        public async Task<IHttpActionResult> EditRoles([FromBody]UserRolesViewModel model)
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
                var user = await _userManager.FindByIdAsync(model.UserId);
                if (user == null)
                {
                    return NotFound();
                }
                var possibleRoles = await _roleManager.Roles.ToListAsync();
                var userRoles = await _userManager.GetRolesAsync(user.Id);

                var submittedRoles = model.SelectedRoles;

                var shouldUpdateSecurityStamp = false;

                foreach (var submittedRole in submittedRoles)
                {
                    var hasRole = await _userManager.IsInRoleAsync(user.Id, submittedRole);
                    if (!hasRole)
                    {
                        shouldUpdateSecurityStamp = true;
                        await _userManager.AddToRoleAsync(user.Id, submittedRole);
                    }
                }

                foreach (var removedRole in possibleRoles.Select(r => r.Name).Except(submittedRoles))
                {
                    shouldUpdateSecurityStamp = true;
                    await _userManager.RemoveFromRoleAsync(user.Id, removedRole);
                }

                if (shouldUpdateSecurityStamp)
                {
                    await _userManager.UpdateSecurityStampAsync(user.Id);
                }
                return Ok(true);
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }
        [HttpDelete]
        [EnableThrottling(PerSecond = 1)]
        public async Task<IHttpActionResult> DeleteAsync(string id)
        {
            try
            {
                ApplicationUser applicationUser = await _userManager.FindByIdAsync(id);
                if (applicationUser == null)
                {
                    return NotFound();
                }
                var result = await _userManager.DeleteAsync(applicationUser);
                return Ok(result.Succeeded);
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }
        [HttpPost]
        [Route("LockUser/{id}")]
        public async Task<IHttpActionResult> LockUser(string id)
        {
            try
            {
                var result = await _userManager.SetLockoutEnabledAsync(id, true);
                if (!result.Succeeded)
                {
                    string errorMessage = result.Errors.FirstOrDefault();
                    return BadRequest(errorMessage);
                }
                result = await _userManager.SetLockoutEndDateAsync(id, DateTimeOffset.MaxValue);
                return Ok(result.Succeeded);
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }

        }
        [HttpPost]
        [Route("UnlockUser/{id}")]
        public async Task<IHttpActionResult> UnlockUser(string id)
        {
            try
            {
                var result = await _userManager.SetLockoutEnabledAsync(id, false);
                if (!result.Succeeded)
                {
                    string errorMessage = result.Errors.FirstOrDefault();
                    return BadRequest(errorMessage);
                }
                await _userManager.ResetAccessFailedCountAsync(id);
                return Ok(result.Succeeded);
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }
    }
}
