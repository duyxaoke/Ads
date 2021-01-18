using Cash4Aff.Domain.Interfaces.Repositories;
using Cash4Aff.Infra.Data.Context;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Cash4Aff.Infra.Data.Repositories
{
    public class RepositoryBase<TEntity> : IRepositoryBase<TEntity> where TEntity : class
    {
        protected SampleContext Db;
        protected DbSet<TEntity> DbSet;

        public RepositoryBase()
        {
            Db = new SampleContext();
            DbSet = Db.Set<TEntity>();
        }

        public virtual void Add(TEntity obj)
        {
            try
            {
                DbSet.Add(obj);
                Db.SaveChanges();
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
                            ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }

        public virtual TEntity GetById(object id)
        {
            return  DbSet.Find(id);
        }
        public virtual async Task<TEntity> GetByIdAsync(object id)
        {
            return await DbSet.FindAsync(id);
        }

        public virtual IEnumerable<TEntity> GetAll()//(int s, int t)
        {
            return DbSet.ToList(); //Take(t).Skip(s).ToList();
        }

        public virtual async Task<IEnumerable<TEntity>> GetAllAsync()//(int s, int t)
        {
            return await DbSet.ToListAsync(); //Take(t).Skip(s).ToList();
        }

        public virtual IQueryable<TEntity> GetAllPaging()//(int s, int t)
        {
            return DbSet.AsQueryable(); //Take(t).Skip(s).ToList();
        }

        public virtual void Update(TEntity obj)
        {
            var entry = Db.Entry(obj);
            DbSet.Attach(obj);
            entry.State = EntityState.Modified;
            Db.SaveChanges();
        }

        public virtual void Remove(object id, bool IsAutoSaveChange = true)
        {
            DbSet.Remove(DbSet.Find(id));
            if (IsAutoSaveChange)
            {
                Db.SaveChanges();
            }
        }

        public IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> predicate)
        {
            return DbSet.Where(predicate);
        }

        public virtual void SaveChanges()
        {
            Db.SaveChanges();
        }

        public void Dispose()
        {
            Db.Dispose();
            GC.SuppressFinalize(this);
        }
    }
}
