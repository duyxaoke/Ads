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
    public class AdsAppService : IAdsAppService
    {
        IAdsRepository _repository;

        public AdsAppService(IAdsRepository repository)
        {
            _repository = repository;
        }

        public async Task<AdsViewModel> GetByIdAsync(object id)
        {
            return Mapper.Map<Ads, AdsViewModel>(await _repository.GetByIdAsync(id));
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
