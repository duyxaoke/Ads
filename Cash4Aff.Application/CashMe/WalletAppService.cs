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
    public class WalletAppService : IWalletAppService
    {
        IWalletRepository _repository;

        public WalletAppService(IWalletRepository repository)
        {
            _repository = repository;
        }

        public async Task<WalletViewModel> GetByIdAsync(object id)
        {
            return Mapper.Map<Wallet, WalletViewModel>(await _repository.GetByIdAsync(id));
        }

        public WalletViewModel GetByUser(string userID)
        {
            return Mapper.Map<Wallet, WalletViewModel>(_repository.GetByUserID(userID).Result);
        }

        public IQueryable<Wallet> GetAllPaging()
        {
            return _repository.GetAllPaging();
        }

        public async Task<IEnumerable<WalletViewModel>> GetAllAsync()
        {
            return Mapper.Map<IEnumerable<Wallet>, IEnumerable<WalletViewModel>>(await _repository.GetAllAsync());
        }

        public void Add(WalletViewModel entity)
        {
            var entityAdd = Mapper.Map<WalletViewModel, Wallet>(entity);
            _repository.Add(entityAdd);
        }

        public void Update(WalletViewModel entity)
        {
            var entityUpdt = Mapper.Map<WalletViewModel, Wallet>(entity);
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
