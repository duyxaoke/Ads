namespace Cash4Aff.Infra.Data.Context
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class adsad : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Ads", "Type", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Ads", "Type");
        }
    }
}
