using Cash4Aff.Application.ViewModels;
using Cash4Aff.Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cash4Aff.Application.Application
{
    public interface IConfigAppService
    {
        void Add(ConfigViewModel model);
        Task<ConfigViewModel> GetByIdAsync(int id);
        Task<IEnumerable<ConfigViewModel>> GetAllAsync();
        IQueryable<Config> GetAllPaging();
        void Update(ConfigViewModel model);
        void Remove(int id);
        void Dispose();
    }
}
