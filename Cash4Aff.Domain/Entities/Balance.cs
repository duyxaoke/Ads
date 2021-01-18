using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Cash4Aff.Domain.Entities
{
    [Table("Balance")]
    public class Balance : BaseEntity
    {
        [Column(TypeName = "varchar")]
        [StringLength(50)]
        public string UserID { get; set; }
        public decimal AvailableBalance { get; set; }
        public decimal TotalBalance { get; set; }
    }
}
