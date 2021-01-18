using Cash4Aff.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Cash4Aff.Domain.Interfaces.Repositories
{
    public interface IWithdrawRepository : IRepositoryBase<Withdraw>
    {
        Task<List<Withdraw>> GetByUserAsync(string userID);

    }
}
