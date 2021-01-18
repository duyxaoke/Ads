using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Cash4Aff.Domain.Entities
{
    [Table("Wallet")]
    public class Wallet : BaseEntity
    {
        public string UserID { get; set; }
        [Column(TypeName = "nvarchar")]
        public string BankAccountNumber { get; set; }//STK
        [Column(TypeName = "nvarchar")]
        public string BankAccountName { get; set; }//Ten TK
        public int BankID { get; set; } //ID bank
        [Column(TypeName = "nvarchar")]
        public string BranchName { get; set; } //chi nhanh
        public string Phone { get; set; } //neu thanh toan = momo
    }
}
