using Cash4Aff.Domain.Entities;
using System.Threading.Tasks;

namespace Cash4Aff.Domain.Interfaces.Repositories
{
    public interface IWalletRepository : IRepositoryBase<Wallet>
    {
        Task<Wallet> GetByUserID(string userID);
    }
}
