using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Cash4Aff.Domain.Entities
{
    [Table("Ads")]
    public class Ads : BaseEntity
    {
        [Column(TypeName = "nvarchar")]
        [StringLength(200)]
        public string Title { get; set; }
        [Column(TypeName = "nvarchar")]
        [StringLength(500)]
        public string Description { get; set; }
        [Column(TypeName = "nvarchar")]
        [StringLength(200)]
        public string Url { get; set; }
        public decimal Price { get; set; }
        public int SecondView { get; set; }
    }
}
