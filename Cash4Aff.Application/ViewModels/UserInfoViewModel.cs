using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FluentValidation;
using FluentValidation.Attributes;

namespace Cash4Aff.Application.ViewModels
{
    public class UserInfoViewModel
    {
        public string UserID { get; set; }
        public int TotalRef { get; set; }
        public decimal AvailableBalance { get; set; }
        public decimal ReferenceBalance { get; set; }
        public decimal TotalBalance { get; set; }
        public string RankName { get; set; }
    }
}