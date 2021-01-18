using System;
using System.Collections.Generic;

namespace CashMe.Presentation.Models
{
    public class Promotion_Category
    {
        public string category_name { get; set; }
        public string category_name_show { get; set; }
        public int category_no { get; set; }
    }

    public class Promotion_Coupon
    {
        public string coupon_code { get; set; }
        public string coupon_desc { get; set; }
        public string coupon_save { get; set; }
    }

    public class Promotion_Data
    {
        public string aff_link { get; set; }
        public List<object> banners { get; set; }
        public List<Promotion_Category> categories { get; set; }
        public string content { get; set; }
        public List<Promotion_Coupon> coupons { get; set; }
        public string domain { get; set; }
        public DateTime end_time { get; set; }
        public string id { get; set; }
        public string image { get; set; }
        public string link { get; set; }
        public string merchant { get; set; }
        public string name { get; set; }
        public DateTime start_time { get; set; }
    }

    public class JsonPromotion
    {
        public List<Promotion_Data> data { get; set; }
    }
}