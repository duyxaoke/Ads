using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FluentValidation;
using FluentValidation.Attributes;

namespace Cash4Aff.Application.ViewModels
{
    public class SelectListViewModel
    {
        public string Value { get; set; }
        public string Text { get; set; }
        public bool Selected { get; set; }
    }
}