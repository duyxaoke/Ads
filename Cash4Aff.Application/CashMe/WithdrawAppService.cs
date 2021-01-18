using AutoMapper;
using Cash4Aff.Application.Application.ICash4Aff;
using Cash4Aff.Application.ViewModels.Cash4Aff;
using Cash4Aff.Domain.Entities;
using Cash4Aff.Domain.Interfaces.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cash4Aff.Application.Cash4Aff
{
    public class WithdrawAppService : IWithdrawAppService
    {
        IWithdrawRepository _repository;

        public WithdrawAppService(IWithdrawRepository repository)
        {
            _repository = repository;
        }

        public async Task<WithdrawViewModel> GetByIdAsync(object id)
        {
            return Mapper.Map<Withdraw, WithdrawViewModel>(await _repository.GetByIdAsync(id));
        }
        public async Task<IEnumerable<WithdrawViewModel>> GetByUserAsync(string userID)
        {
            return Mapper.Map<IEnumerable<Withdraw>, IEnumerable<WithdrawViewModel>>(await _repository.GetByUserAsync(userID));
        }

        public IQueryable<Withdraw> GetAllPaging()
        {
            return _repository.GetAllPaging();
        }

        public async Task<IEnumerable<WithdrawViewModel>> GetAllAsync()
        {
            return Mapper.Map<IEnumerable<Withdraw>, IEnumerable<WithdrawViewModel>>(await _repository.GetAllAsync());
        }

        public void Add(WithdrawViewModel entity)
        {
            var entityAdd = Mapper.Map<WithdrawViewModel, Withdraw>(entity);
            _repository.Add(entityAdd);
        }

        public void Update(WithdrawViewModel entity)
        {
            var entityUpdt = Mapper.Map<WithdrawViewModel, Withdraw>(entity);
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
