using AutoMapper;
using Cash4Aff.Application.Application;
using Cash4Aff.Application.ViewModels;
using Cash4Aff.Domain.Entities;
using Cash4Aff.Domain.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cash4Aff.Application
{
    public class ConfigAppService : IConfigAppService
    {
        IConfigRepository _repository;

        public ConfigAppService(IConfigRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ConfigViewModel>> GetAllAsync()
        {
            return Mapper.Map<IEnumerable<Config>, IEnumerable<ConfigViewModel>>(await _repository.GetAllAsync());
        }

        public IQueryable<Config> GetAllPaging()
        {
            return _repository.GetAllPaging();
        }

        public async Task<ConfigViewModel> GetByIdAsync(int id)
        {
            return Mapper.Map<Config, ConfigViewModel>(await _repository.GetByIdAsync(id));
        }

        public void Add(ConfigViewModel model)
        {
            var data = Mapper.Map<ConfigViewModel, Config>(model);
            _repository.Add(data);
        }

        public void Update(ConfigViewModel model)
        {
            var data = Mapper.Map<ConfigViewModel, Config>(model);
            _repository.Update(data);
        }

        public void Remove(int id)
        {
            _repository.Remove(id);
        }

        public void Dispose()
        {
            _repository.Dispose();
        }
    }
}
