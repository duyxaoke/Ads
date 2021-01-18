using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Cash4Aff.Domain.Entities
{
    [Table("UserRef")]
    public class UserRef : BaseEntity
    {
        [Column(TypeName = "varchar")]
        [StringLength(50)]
        public string UserID { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(50)]
        public string ParentID { get; set; }
    }
}
