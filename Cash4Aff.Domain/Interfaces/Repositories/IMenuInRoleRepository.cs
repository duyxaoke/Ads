using Cash4Aff.Domain.Entities;
using System;
using System.Collections.Generic;

namespace Cash4Aff.Domain.Interfaces.Repositories
{
    public interface IMenuInRoleRepository : IRepositoryBase<MenuInRole>
    {
        IEnumerable<MenuInRole> GetMenuByRoleId(Guid roleId);
    }
}
