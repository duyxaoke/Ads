using Cash4Aff.Domain.Entities;
using Cash4Aff.Domain.Interfaces.Repositories;
using System.Linq;

namespace Cash4Aff.Infra.Data.Repositories
{
    public class ConfigRepository : RepositoryBase<Config>, IConfigRepository
    {
    }
}
