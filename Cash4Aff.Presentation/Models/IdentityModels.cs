using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Cash4Aff.Application.ViewModels;

namespace Cash4Aff.Presentation.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {
        public string ParentUserID { get; set; }
        public string Name { get; set; }
        public string Gender { get; set; }
        public DateTime? Birthday { get; set; }
        public string AndroidLink { get; set; }
        public string IOSLink { get; set; }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            return userIdentity;
        }
    }

    public class ApplicationRole : IdentityRole
    {
        private const String CacheKey = "4BA44A3F-F728-42D8-9387-7577EDC0DD99_Role_Claims_";

        public static string GetCacheKey(String roleName)
        {
            return CacheKey + roleName;
        }

        public ICollection<RoleClaim> RoleClaims { get; set; }
    }

    [Table("AspNetRoleClaims")]
    public class RoleClaim
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        public String RoleId { get; set; }

        [ForeignKey("RoleId")]
        public ApplicationRole Role { get; set; }

        public String ClaimType { get; set; }
        public String ClaimValue { get; set; }
    }

    public class CreateRoleViewModel
    {
        [Key]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Tên quyền không được trống")]
        [MaxLength(50, ErrorMessage = "Nhiều nhất 50 ký tự")]
        [MinLength(2, ErrorMessage = "Ít nhất 2 ký tự")]
        public string Name { get; set; }

        public CreateRoleViewModel()
        {
            Id = Guid.NewGuid();
        }
    }
    public class RoleClaimsViewModel
    {
        public RoleClaimsViewModel()
        {
            ClaimGroups = new List<ClaimGroup>();

            SelectedClaims = new List<String>();
        }

        public String RoleId { get; set; }

        public String RoleName { get; set; }

        public List<ClaimGroup> ClaimGroups { get; set; }

        public IEnumerable<String> SelectedClaims { get; set; }


        public class ClaimGroup
        {
            public ClaimGroup()
            {
                GroupClaimsCheckboxes = new List<SelectListViewModel>();
            }
            public String GroupName { get; set; }

            public int GroupId { get; set; }

            public List<SelectListViewModel> GroupClaimsCheckboxes { get; set; }
        }

        public class UsersIndexViewIndex
        {
            public List<ApplicationUser> Users { get; set; }
        }

        public class UserClaimsViewModel
        {
            public UserClaimsViewModel()
            {
                ClaimGroups = new List<ClaimGroup>();

                SelectedClaims = new List<String>();
            }

            public String UserName { get; set; }

            public List<ClaimGroup> ClaimGroups { get; set; }

            public IEnumerable<String> SelectedClaims { get; set; }


            public class ClaimGroup
            {
                public ClaimGroup()
                {
                    GroupClaimsCheckboxes = new List<SelectListViewModel>();
                }
                public String GroupName { get; set; }

                public int GroupId { get; set; }

                public List<SelectListViewModel> GroupClaimsCheckboxes { get; set; }
            }
        }

        public class UserRolesViewModel
        {
            public UserRolesViewModel()
            {
                UserRoles = new List<SelectListViewModel>();
                SelectedRoles = new List<String>();
            }

            public String UserId { get; set; }
            public String Username { get; set; }
            public List<SelectListViewModel> UserRoles { get; set; }
            public List<String> SelectedRoles { get; set; }
        }
        public class UserViewModel
        {
            public string Id { get; set; }
            public string UserName { get; set; }
            [DataType(DataType.Password)]
            public string Password { get; set; }
            [Display(Name = "Confirm Password")]
            [DataType(DataType.Password)]
            public string ConfirmPassword { get; set; }
            public string Name { get; set; }
            public string Email { get; set; }
        }
        public class UpdateMenuInRoleViewModel
        {
            public Guid RoleId { get; set; }
            public List<int> MenuIds { get; set; }

        }

    }
}