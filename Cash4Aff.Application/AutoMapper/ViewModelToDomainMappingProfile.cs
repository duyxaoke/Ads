using AutoMapper;
using Cash4Aff.Application.ViewModels;
using Cash4Aff.Application.ViewModels.Cash4Aff;
using Cash4Aff.Domain.Entities;

namespace Cash4Aff.Application.AutoMapper
{
    public class ViewModelToDomainMappingProfile : Profile
    {
        protected override void Configure()
        {
            CreateMap<MenuViewModel, Menu>();
            CreateMap<ConfigViewModel, Config>();

            // Cash4Aff
            CreateMap<WithdrawViewModel, Withdraw>();
            CreateMap<BankViewModel, Bank>();
            CreateMap<WalletViewModel, Wallet>();
            CreateMap<UserRefViewModel, UserRef>();
            CreateMap<BalanceViewModel, Balance>();
            CreateMap<AdsViewModel, Ads>();
        }
    }
}