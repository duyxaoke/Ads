using Cash4Aff.Application;
using Cash4Aff.Application.Application;
using Cash4Aff.Application.ViewModels;
using Cash4Aff.Presentation;
using Cash4Aff.Presentation.Controllers.Api;
using Cash4Aff.Presentation.Filters;
using Cash4Aff.Presentation.Models;
using System;
using System.Collections.Generic;
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
    [RoutePrefix("api/Roles")]
    public class RolesController : ApiControllerBase
    {
        private readonly ApplicationRoleManager _roleManager;
        private readonly ClaimedActionsProvider _claimedActionsProvider;
        private IMenuAppService _menuService;
        private IMenuInRoleAppService _menuInRolesService;


        public RolesController(ApplicationRoleManager roleManager, ClaimedActionsProvider claimedActionsProvider,
            IMenuAppService menuService, IMenuInRoleAppService menuInRolesService)
        {
            _roleManager = roleManager;
            _claimedActionsProvider = claimedActionsProvider;
            _menuService = menuService;
            _menuInRolesService = menuInRolesService;
        }
        [HttpGet]
        [Route("list")]
        public IHttpActionResult List()
        {
            try
            {
                var result = _roleManager.Roles.ToList();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> Get(string id)
        {
            try
            {
                var result = await _roleManager.FindByIdAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }

        [HttpPost]
        [Route("create")]
        [EnableThrottling(PerSecond = 1)]
        public async Task<IHttpActionResult> Post([FromBody]CreateRoleViewModel model)
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
                var newRole = new ApplicationRole()
                {
                    Name = model.Name,
                };
                var result = await _roleManager.CreateAsync(newRole);
                if (!result.Succeeded)
                {
                    string errorMessage = result.Errors.FirstOrDefault();
                    return BadRequest(errorMessage);
                }
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

        // DELETE: api/ClienteApi/5
        [HttpDelete]
        [Route("delete")]
        public async Task<IHttpActionResult> Delete(string id)
        {
            try
            {
                var role = await _roleManager.FindByIdAsync(id);
                if (role == null)
                {
                    return NotFound();
                }
                var roleClaims = await _roleManager.GetClaimsAsync(role.Name);
                // this is ugly. Deletes all the claims and adds them back in.
                // can be done in a better fashion
                foreach (var removedClaim in roleClaims)
                {
                    await _roleManager.RemoveClaimAsync(role.Id, removedClaim);
                }
                var result = _roleManager.DeleteAsync(role).Result;
                if (!result.Succeeded)
                {
                    string errorMessage = result.Errors.FirstOrDefault();
                    return BadRequest(errorMessage);
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }

        [HttpGet]
        [Route("edit-claims/{id}")]
        public async Task<IHttpActionResult> EditClaimsAsync(string id)
        {
            try
            {
                var role = await _roleManager.FindByIdAsync(id);
                if (role == null)
                {
                    return StatusCode(HttpStatusCode.NoContent);
                }
                var claimGroups = _claimedActionsProvider.GetClaimGroups();

                var assignedClaims = await _roleManager.GetClaimsAsync(role.Name);

                var result = new RoleClaimsViewModel()
                {
                    RoleId = role.Id,
                    RoleName = role.Name,
                };

                foreach (var claimGroup in claimGroups)
                {
                    var claimGroupModel = new RoleClaimsViewModel.ClaimGroup()
                    {
                        GroupId = claimGroup.GroupId,
                        GroupName = claimGroup.GroupName,
                        GroupClaimsCheckboxes = claimGroup.Claims
                            .Select(c => new SelectListViewModel()
                            {
                                Value = String.Format("{0}#{1}", claimGroup.GroupId, c),
                                Text = c,
                                Selected = assignedClaims.Any(ac => ac.Type == claimGroup.GroupId.ToString() && ac.Value == c)
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
        [Route("edit-claims")]
        public async Task<IHttpActionResult> EditClaimsAsync([FromBody]RoleClaimsViewModel viewModel)
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
                var role = await _roleManager.FindByIdAsync(viewModel.RoleId);
                if (role == null)
                {
                    return NotFound();
                }
                role.Name = viewModel.RoleName;
                var roleResult = await _roleManager.UpdateAsync(role);
                var roleClaims = await _roleManager.GetClaimsAsync(role.Name);
                // this is ugly. Deletes all the claims and adds them back in.
                // can be done in a better fashion
                foreach (var removedClaim in roleClaims)
                {
                    await _roleManager.RemoveClaimAsync(role.Id, removedClaim);
                }

                var submittedClaims = viewModel
                    .SelectedClaims
                    .Select(s =>
                    {
                        var tokens = s.Split('#');
                        if (tokens.Count() != 2)
                        {
                            throw new Exception(String.Format("Claim {0} can't be processed because it is in incorrect format", s));
                        }
                        return new Claim(tokens[0], tokens[1]);
                    }).ToList();


                roleClaims = await _roleManager.GetClaimsAsync(role.Name);

                foreach (var submittedClaim in submittedClaims)
                {
                    var hasClaim = roleClaims.Any(c => c.Value == submittedClaim.Value && c.Type == submittedClaim.Type);
                    if (!hasClaim)
                    {
                        await _roleManager.AddClaimAsync(role.Id, submittedClaim);
                    }
                }

                roleClaims = await _roleManager.GetClaimsAsync(role.Name);

                var cacheKey = ApplicationRole.GetCacheKey(role.Name);
                System.Web.HttpContext.Current.Cache.Remove(cacheKey);
                return Ok(roleClaims);
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }

        }

        private bool Exists(Guid id)
        {
            return _roleManager.FindByIdAsync(id.ToString()) != null;
        }

        [HttpGet]
        [Route("menu-in-role/{roleId:guid}")]
        public IHttpActionResult MenuInRoles(Guid? roleId)
        {
            try
            {
                var result = new List<MenuViewModel>();
                var menus = _menuService.GetParent().OrderBy(l => l.Order);
                foreach (var item in menus)
                {
                    MenuViewModel model = new MenuViewModel();
                    model.Id = item.Id;
                    model.Name = item.Name;
                    model.Url = item.Url;
                    model.Icon = item.Icon;
                    model.Order = item.Order;
                    model.IsActive = item.IsActive;
                    model.ParentId = item.ParentId;
                    model.RoleId = roleId;
                    model.Childrens = GetChildrens(item.Id, roleId);
                    if (roleId.HasValue)
                    {
                        var menu = _menuInRolesService.GetMenuByRoleId(roleId.Value).Any(c => c.MenuId == item.Id);
                        if (menu)
                            model.Checked = true;
                        else
                            model.Checked = false;
                    }
                    result.Add(model);
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }

        [HttpPost]
        [Route("menu-in-role")]
        [EnableThrottling(PerSecond = 1)]
        public IHttpActionResult MenuInRoles(UpdateMenuInRoleViewModel model)
        {
            try
            {
                var result = _menuInRolesService.AddOrUpdateMenuInRole(model.RoleId, model.MenuIds);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }

        #region Helper
        private List<MenuViewModel> GetChildrens(int parentId, Guid? roleId)
        {
            var lsmodel = new List<MenuViewModel>();
            var menus = _menuService.GetChildren(parentId).OrderBy(l => l.Order);
            foreach (var item in menus)
            {
                MenuViewModel model = new MenuViewModel();
                model.Id = item.Id;
                model.Name = item.Name;
                model.Url = item.Url;
                model.Icon = item.Icon;
                model.Order = item.Order;
                model.IsActive = item.IsActive;
                model.ParentId = item.ParentId;
                if (roleId.HasValue)
                {
                    var menu = _menuInRolesService.GetMenuByRoleId(roleId.Value).Any(c => c.MenuId == item.Id);
                    if (menu)
                        model.Checked = true;
                    else
                        model.Checked = false;
                }
                lsmodel.Add(model);
            }
            return lsmodel;
        }

        #endregion

    }
}
