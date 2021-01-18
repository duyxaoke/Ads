using Cash4Aff.Application.ViewModels.Cash4Aff;
using Cash4Aff.Domain.Entities;
using System.Threading.Tasks;

namespace Cash4Aff.Application.Application.ICash4Aff
{
    public interface IWalletAppService : IApplication<WalletViewModel, Wallet>
    {
        WalletViewModel GetByUser(string userID);
    }
}
