using Cash4Aff.Domain.Entities;
using Cash4Aff.Infra.Data.Repositories;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace Cash4Aff.Domain.Interfaces.Repositories
{
    public class WithdrawRepository : RepositoryBase<Withdraw>, IWithdrawRepository
    {
        public Task<List<Withdraw>> GetByUserAsync(string userID)
        {
            return Db.Withdraw.Where(c => c.UserID == userID).ToListAsync();
        }

    }
}
