using Cash4Aff.Domain.Validations;
using System;

namespace Cash4Aff.Domain.Entities
{
    public class MenuInRole
    {
        public int Id { get; set; }
        public Guid RoleId { get; set; }
        public int MenuId { get; set; }
    }
}
