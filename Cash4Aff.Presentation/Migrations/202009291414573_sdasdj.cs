namespace Cash4Aff.Presentation.Models
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class sdasdj : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.AspNetUsers", "Balance");
        }
        
        public override void Down()
        {
            AddColumn("dbo.AspNetUsers", "Balance", c => c.Decimal(nullable: false, precision: 18, scale: 2));
        }
    }
}
