using AutoMapper;
using Cash4Aff.Application.Application;
using Cash4Aff.Domain.Entities;
using Cash4Aff.Domain.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cash4Aff.Application
{
    public class MenuInRoleAppService : IMenuInRoleAppService
    {
        IMenuInRoleRepository _repository;

        public MenuInRoleAppService(IMenuInRoleRepository repository)
        {
            _repository = repository;
        }

        public async Task<MenuInRole> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public IEnumerable<MenuInRole> GetAll()
        {
            return _repository.GetAll();
        }
        public async Task<IEnumerable<MenuInRole>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }
        public IEnumerable<MenuInRole> GetMenuByRoleId(Guid roleId)
        {
            return _repository.GetMenuByRoleId(roleId);
        }

        public void Add(MenuInRole model)
        {
            _repository.Add(model);
        }

        public void Update(MenuInRole model)
        {
            _repository.Update(model);
        }
        public void Delete(int id)
        {
            _repository.Remove(id);
        }

        public bool AddOrUpdateMenuInRole(Guid roleId, List<int> menuIds)
        {
            var existRole = _repository.GetMenuByRoleId(roleId);
            if (existRole != null)
            {
                try
                {
                    //xóa hết dữ liệu trong MenuInRoles theo RoleId
                    foreach (var item in existRole)
                    {
                        _repository.Remove(item.Id, false);
                    }
                    _repository.SaveChanges();
                    if (menuIds.Count > 0)
                    {
                        //thêm dữ liệu mới
                        foreach (var item in menuIds)
                        {
                            var model = new MenuInRole();
                            model.MenuId = item;
                            model.RoleId = roleId;
                            _repository.Add(model);
                        }
                    }
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
            return true;
        }

        public void Dispose()
        {
            _repository.Dispose();
        }
    }
}
