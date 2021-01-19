using System;

namespace Cash4Aff.Application.ViewModels.Cash4Aff
{
    public class UserViewedAdsViewModel
    {
        public Guid Id { get; set; }
        public int AdsId { get; set; }
        public string UserId { get; set; }
        public decimal Price { get; set; }
        public bool IsSKip { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
