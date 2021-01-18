using Cash4Aff.Domain.Entities;
using Cash4Aff.Domain.Interfaces.Repositories;
using System.Collections.Generic;
using System.Linq;

namespace Cash4Aff.Infra.Data.Repositories
{
    public class MenuRepository : RepositoryBase<Menu>, IMenuRepository
    {
        public IEnumerable<Menu> GetParent()
        {
            return Db.Menu.Where(c => c.ParentId == null && c.IsActive == true);
        }
        public IEnumerable<Menu> GetChildren(int parentId)
        {
            return Db.Menu.Where(c => c.ParentId == parentId && c.IsActive == true);
        }
    }
}
