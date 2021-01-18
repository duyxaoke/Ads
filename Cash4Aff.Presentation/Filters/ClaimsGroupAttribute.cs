using System;
using System.ComponentModel.DataAnnotations;


namespace Cash4Aff.Presentation.Filters
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
    public class ClaimsGroupAttribute : Attribute
    {
        public ClaimResources Resource { get; private set; }

        public ClaimsGroupAttribute(ClaimResources resource)
        {
            Resource = resource;
        }

        public String GetGroupId()
        {
            return ((int)Resource).ToString();
        }
    }


    [AttributeUsage(AttributeTargets.Method, AllowMultiple = true)]
    public class ClaimsActionAttribute : Attribute
    {
        public ClaimsActions Claim { get; private set; }

        public ClaimsActionAttribute(ClaimsActions claim)
        {
            Claim = claim;
        }
    }

    public enum ClaimsActions
    {
        Index,
        View,
        Create,
        Edit,
        Delete,
        HolidayRequest
    }


    public enum ClaimResources
    {
        [Display(Name = "Menus")]
        Menus = 1,
        [Display(Name = "Users")]
        Users = 2,
        [Display(Name = "Configs")]
        Configs = 3
    }
}