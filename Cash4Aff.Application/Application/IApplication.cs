using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cash4Aff.Application.Application
{
    public interface IApplication<TEntity, GEntity>
    {
        Task<TEntity> GetByIdAsync(object id);
        Task<IEnumerable<TEntity>> GetAllAsync();
        IQueryable<GEntity> GetAllPaging();
        void Add(TEntity obj);
        void Update(TEntity obj);
        void Remove(object id);
        void Dispose();
    }
}
