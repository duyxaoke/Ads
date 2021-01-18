using System.Threading.Tasks;
using Cash4Aff.Application.ViewModels.Cash4Aff;
using Cash4Aff.Domain.Entities;

namespace Cash4Aff.Application.Application.ICash4Aff
{
    public interface IAdsAppService : IApplication<AdsViewModel, Ads>
    {
    }
}
