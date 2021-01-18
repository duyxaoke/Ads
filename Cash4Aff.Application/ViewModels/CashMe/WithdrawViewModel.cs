using FluentValidation;
using FluentValidation.Attributes;
using System;

namespace Cash4Aff.Application.ViewModels.Cash4Aff
{
    [Validator(typeof(WithdrawViewModelValidator))]
    public class WithdrawViewModel : BaseViewModel
    {
        public string UserID { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public int Status { get; set; }
    }
    public class WithdrawViewModelValidator : AbstractValidator<WithdrawViewModel>
    {
        public WithdrawViewModelValidator()
        {
            RuleFor(x => x.Amount).NotNull().GreaterThan(49999).WithMessage("Số tiền rút tối thiểu là 50.000đ").LessThan(1000001).WithMessage("Số tiền rút tối đa là 1.000.000đ");
        }
    }

}
