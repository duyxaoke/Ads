using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cash4Aff.Domain.Entities
{
    [Table("Withdraw")]
    public class Withdraw : BaseEntity
    {
        [StringLength(100)]
        public string UserID { get; set; }
        public decimal Amount { get; set; }
        [Column(TypeName = "nvarchar")]
        [StringLength(250)]
        public string Description { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public int Status { get; set; }

    }
}
