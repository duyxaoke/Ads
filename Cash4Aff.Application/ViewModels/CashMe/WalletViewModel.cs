namespace Cash4Aff.Application.ViewModels.Cash4Aff
{
    public class WalletViewModel : BaseViewModel
    {
        public string UserID { get; set; }
        public string BankAccountNumber { get; set; }//STK
        public string BankAccountName { get; set; }//Ten TK
        public int BankID { get; set; } //ID bank
        public string BranchName { get; set; } //chi nhanh
        public string Phone { get; set; } //neu thanh toan = momo
    }
}
