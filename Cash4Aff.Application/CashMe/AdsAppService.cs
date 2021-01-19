using AutoMapper;
using Cash4Aff.Application.Application;
using Cash4Aff.Application.Application.ICash4Aff;
using Cash4Aff.Application.ViewModels.Cash4Aff;
using Cash4Aff.Domain.Entities;
using Cash4Aff.Domain.Interfaces.Repositories;
using Cash4Aff.Infra.Data.Context;
using Dapper;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Cash4Aff.Application.Cash4Aff
{
    public class AdsAppService : IAdsAppService
    {
        IAdsRepository _repository;
        private readonly IConnectionFactory _dbConnFactory;

        public AdsAppService(IAdsRepository repository, IConnectionFactory dbConnFactory)
        {
            _repository = repository;
            _dbConnFactory = dbConnFactory;
        }

        public async Task<AdsViewModel> GetByIdAsync(object id)
        {
            return Mapper.Map<Ads, AdsViewModel>(await _repository.GetByIdAsync(id));
        }

        public AdsViewModel GetByUserId(object userId)
        {
            using (IDbConnection db = _dbConnFactory.GetConnection())
            {
                return db.Query<AdsViewModel>("GetAdsByUserID", new { UserId = userId }, commandType: CommandType.StoredProcedure).FirstOrDefault();
            }
        }


        public IQueryable<Ads> GetAllPaging()
        {
            return _repository.GetAllPaging();
        }

        public async Task<IEnumerable<AdsViewModel>> GetAllAsync()
        {
            
            return Mapper.Map<IEnumerable<Ads>, IEnumerable<AdsViewModel>>(await _repository.GetAllAsync());
        }

        public void Add(AdsViewModel entity)
        {
            var entityAdd = Mapper.Map<AdsViewModel, Ads>(entity);
            _repository.Add(entityAdd);
        }

        public void Update(AdsViewModel entity)
        {
            var entityUpdt = Mapper.Map<AdsViewModel, Ads>(entity);
            _repository.Update(entityUpdt);
        }

        public void Remove(object id)
        {
            _repository.Remove(id);
        }

        public void Dispose()
        {
            _repository.Dispose();
        }
    }
}
