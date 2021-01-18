using Cash4Aff.Domain.Validations;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cash4Aff.Domain.Entities
{
    public class Menu
    {
        public int Id { get; set; }
        public int? ParentId { get; set; }
        [Column(TypeName = "nvarchar")]
        public string Name { get; set; }
        [Column(TypeName = "nvarchar")]
        public string Url { get; set; }
        public string Icon { get; set; }
        public bool IsActive { get; set; }
        public int Order { get; set; }
    }
}
