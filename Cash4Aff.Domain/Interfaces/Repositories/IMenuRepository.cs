using Cash4Aff.Domain.Entities;
using System.Collections.Generic;

namespace Cash4Aff.Domain.Interfaces.Repositories
{
    public interface IMenuRepository : IRepositoryBase<Menu>
    {
        IEnumerable<Menu> GetParent();
        IEnumerable<Menu> GetChildren(int parentId);
    }
}
