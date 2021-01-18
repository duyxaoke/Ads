namespace Cash4Aff.Application.ViewModels.Cash4Aff
{
    public class BalanceViewModel : BaseViewModel
    {
        public string UserID { get; set; }
        public decimal AvailableBalance { get; set; } = 0;
        public decimal TotalBalance { get; set; } = 0;
    }
}
