using AutoMapper;
using Cash4Aff.Application.Application;
using Cash4Aff.Application.Application.ICash4Aff;
using Cash4Aff.Application.ViewModels.Cash4Aff;
using Cash4Aff.Domain.Entities;
using Cash4Aff.Domain.Interfaces.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cash4Aff.Application.Cash4Aff
{
    public class BalanceAppService : IBalanceAppService
    {
        IBalanceRepository _repository;

        public BalanceAppService(IBalanceRepository repository)
        {
            _repository = repository;
        }

        public async Task<BalanceViewModel> GetByIdAsync(object id)
        {
            return Mapper.Map<Balance, BalanceViewModel>(await _repository.GetByIdAsync(id));
        }

        public BalanceViewModel GetByUser(string userId)
        {
            return Mapper.Map<Balance, BalanceViewModel>(_repository.Find(x=> x.UserID == userId).FirstOrDefault());
        }

        public IQueryable<Balance> GetAllPaging()
        {
            return _repository.GetAllPaging();
        }

        public async Task<IEnumerable<BalanceViewModel>> GetAllAsync()
        {
            return Mapper.Map<IEnumerable<Balance>, IEnumerable<BalanceViewModel>>(await _repository.GetAllAsync());
        }

        public void Add(BalanceViewModel entity)
        {
            var entityAdd = Mapper.Map<BalanceViewModel, Balance>(entity);
            _repository.Add(entityAdd);
        }

        public void Update(BalanceViewModel entity)
        {
            var entityUpdt = Mapper.Map<BalanceViewModel, Balance>(entity);
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
