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
    public class UserRefAppService : IUserRefAppService
    {
        IUserRefRepository _repository;

        public UserRefAppService(IUserRefRepository repository)
        {
            _repository = repository;
        }
        
        public async Task<UserRefViewModel> GetByIdAsync(object id)
        {
            return Mapper.Map<UserRef, UserRefViewModel>(await _repository.GetByIdAsync(id));
        }

        public IQueryable<UserRef> GetAllPaging()
        {
            return _repository.GetAllPaging();
        }

        public async Task<IEnumerable<UserRefViewModel>> GetAllAsync()
        {
            return Mapper.Map<IEnumerable<UserRef>, IEnumerable<UserRefViewModel>>(await _repository.GetAllAsync());
        }

        public void Add(UserRefViewModel entity)
        {
            var entityAdd = Mapper.Map<UserRefViewModel, UserRef>(entity);
            _repository.Add(entityAdd);
        }

        public void Update(UserRefViewModel entity)
        {
            var entityUpdt = Mapper.Map<UserRefViewModel, UserRef>(entity);
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
