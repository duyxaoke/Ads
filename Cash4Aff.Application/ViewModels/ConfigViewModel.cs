using System;
using System.ComponentModel.DataAnnotations;

namespace Cash4Aff.Application.ViewModels
{
    public class ConfigViewModel
    {
        [Key]
        public int Id { get; set; }
        public bool SystemEnable { get; set; }
    }
}
