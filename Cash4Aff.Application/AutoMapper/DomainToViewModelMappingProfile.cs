using AutoMapper;
using Cash4Aff.Application.ViewModels;
using Cash4Aff.Application.ViewModels.Cash4Aff;
using Cash4Aff.Domain.Entities;

namespace Cash4Aff.Application.AutoMapper
{
    public class DomainToViewModelMappingProfile : Profile
    {
        protected override void Configure()
        {
            CreateMap<Menu, MenuViewModel>();
            CreateMap<Config, ConfigViewModel>();

            // Cash4Aff
            CreateMap<Withdraw, WithdrawViewModel>();
            CreateMap<Bank, BankViewModel>();
            CreateMap<Wallet, WalletViewModel>();
            CreateMap<UserRef, UserRefViewModel>();
            CreateMap<Balance, BalanceViewModel>();
            CreateMap<Ads, AdsViewModel>();
            CreateMap<UserViewedAds, UserViewedAdsViewModel>();
        }
    }
}