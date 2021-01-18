using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Cash4Aff.Domain.Interfaces.Repositories
{
    public interface IRepositoryBase<TEntity>
    {
        void Add(TEntity obj);
        IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> predicate);
        TEntity GetById(object id);
        Task<TEntity> GetByIdAsync(object id);
        IEnumerable<TEntity> GetAll();
        Task<IEnumerable<TEntity>> GetAllAsync();
        IQueryable<TEntity> GetAllPaging();
        void Update(TEntity obj);
        void Remove(object id, bool IsAutoSaveChange = true);
        void SaveChanges();
        void Dispose();
    }
}
