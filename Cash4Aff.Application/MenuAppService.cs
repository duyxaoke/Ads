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
    public class MenuAppService : IMenuAppService
    {
        IMenuRepository _repository;

        public MenuAppService(IMenuRepository repository)
        {
            _repository = repository;
        }

        public async Task<MenuViewModel> GetByIdAsync(int id)
        {
            var obj = await _repository.GetByIdAsync(id);
            var result = Mapper.Map<Menu, MenuViewModel>(obj);
            result.Parents = _repository.GetAll()
                .Select(c => new SelectListViewModel
                {
                    Text = c.Name,
                    Value = c.Id.ToString()
                });
            return result;
        }
        public IQueryable<Menu> GetAllPaging()
        {
            return _repository.GetAllPaging();
        }
        public async Task<IEnumerable<Menu>> GetAllAsync()
        {
            var result = await _repository.GetAllAsync();
            return result;
        }

        public IEnumerable<Menu> GetParent()
        {
            return _repository.GetParent();
        }
        public IEnumerable<Menu> GetChildren(int parentId)
        {
            return _repository.GetChildren(parentId);
        }

        public void Add(MenuViewModel model)
        {
            var obj = Mapper.Map<MenuViewModel, Menu>(model);
            _repository.Add(obj);
        }

        public void Update(MenuViewModel model)
        {
            var obj = Mapper.Map<MenuViewModel, Menu>(model);
            obj.Id = model.Id;
            _repository.Update(obj);
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
