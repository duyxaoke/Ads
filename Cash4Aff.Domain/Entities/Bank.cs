using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Cash4Aff.Domain.Entities
{
    [Table("Bank")]
    public class Bank : BaseEntity
    {
        [Column(TypeName = "nvarchar")]
        public string BankCode { get; set; }
        [Column(TypeName = "nvarchar")]
        public string BankName { get; set; }
    }
}
