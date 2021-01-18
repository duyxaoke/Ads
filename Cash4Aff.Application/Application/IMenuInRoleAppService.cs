using Cash4Aff.Application.ViewModels;
using Cash4Aff.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Cash4Aff.Application.Application
{
    public interface IMenuInRoleAppService
    {
        Task<MenuInRole> GetByIdAsync(int id);
        IEnumerable<MenuInRole> GetAll();
        Task<IEnumerable<MenuInRole>> GetAllAsync();
        void Add(MenuInRole model);
        void Update(MenuInRole model);
        void Delete(int id);
        bool AddOrUpdateMenuInRole(Guid roleId, List<int> menuIds);
        IEnumerable<MenuInRole> GetMenuByRoleId(Guid roleId);
        void Dispose();
    }
}
