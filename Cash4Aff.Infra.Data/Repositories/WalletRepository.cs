using Cash4Aff.Domain.Entities;
using Cash4Aff.Infra.Data.Repositories;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace Cash4Aff.Domain.Interfaces.Repositories
{
    public class WalletRepository : RepositoryBase<Wallet>, IWalletRepository
    {
        public Task<Wallet> GetByUserID(string userID)
        {
            return Db.Wallet.Where(c => c.UserID == userID).FirstOrDefaultAsync();
        }
    }
}
