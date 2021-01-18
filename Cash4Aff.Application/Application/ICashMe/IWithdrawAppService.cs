using Cash4Aff.Application.ViewModels.Cash4Aff;
using Cash4Aff.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Cash4Aff.Application.Application.ICash4Aff
{
    public interface IWithdrawAppService : IApplication<WithdrawViewModel, Withdraw>
    {
        Task<IEnumerable<WithdrawViewModel>> GetByUserAsync(string userID);
    }
}
