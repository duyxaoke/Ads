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
    public class UserViewedAdsAppService : IUserViewedAdsAppService
    {
        IUserViewedAdsRepository _repository;

        public UserViewedAdsAppService(IUserViewedAdsRepository repository)
        {
            _repository = repository;
        }

        public async Task<UserViewedAdsViewModel> GetByIdAsync(object id)
        {
            return Mapper.Map<UserViewedAds, UserViewedAdsViewModel>(await _repository.GetByIdAsync(id));
        }

        public IQueryable<UserViewedAds> GetAllPaging()
        {
            return _repository.GetAllPaging();
        }

        public async Task<IEnumerable<UserViewedAdsViewModel>> GetAllAsync()
        {
            return Mapper.Map<IEnumerable<UserViewedAds>, IEnumerable<UserViewedAdsViewModel>>(await _repository.GetAllAsync());
        }

        public void Add(UserViewedAdsViewModel entity)
        {
            var entityAdd = Mapper.Map<UserViewedAdsViewModel, UserViewedAds>(entity);
            _repository.Add(entityAdd);
        }

        public void Update(UserViewedAdsViewModel entity)
        {
            var entityUpdt = Mapper.Map<UserViewedAdsViewModel, UserViewedAds>(entity);
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
