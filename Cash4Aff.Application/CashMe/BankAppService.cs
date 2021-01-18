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
    public class BankAppService : IBankAppService
    {
        IBankRepository _repository;

        public BankAppService(IBankRepository repository)
        {
            _repository = repository;
        }
        
        public async Task<BankViewModel> GetByIdAsync(object id)
        {
            return Mapper.Map<Bank, BankViewModel>(await _repository.GetByIdAsync(id));
        }

        public IQueryable<Bank> GetAllPaging()
        {
            return _repository.GetAllPaging();
        }

        public async Task<IEnumerable<BankViewModel>> GetAllAsync()
        {
            return Mapper.Map<IEnumerable<Bank>, IEnumerable<BankViewModel>>(await _repository.GetAllAsync());
        }

        public void Add(BankViewModel entity)
        {
            var entityAdd = Mapper.Map<BankViewModel, Bank>(entity);
            _repository.Add(entityAdd);
        }

        public void Update(BankViewModel entity)
        {
            var entityUpdt = Mapper.Map<BankViewModel, Bank>(entity);
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
