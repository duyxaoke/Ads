namespace Cash4Aff.Infra.Data.Context
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class adsadasd : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.UserViewedAds", "IsSKip", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.UserViewedAds", "IsSKip");
        }
    }
}
