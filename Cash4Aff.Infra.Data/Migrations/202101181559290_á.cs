namespace Cash4Aff.Infra.Data.Context
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class á : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.UserViewedAds",
                c => new
                    {
                        Id = c.Guid(nullable: false, identity: true),
                        AdsId = c.Int(nullable: false),
                        UserId = c.String(maxLength: 100, unicode: false),
                        Price = c.Decimal(nullable: false, precision: 18, scale: 2),
                        CreatedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.Ads", "ImageUrl", c => c.String(maxLength: 100, unicode: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Ads", "ImageUrl");
            DropTable("dbo.UserViewedAds");
        }
    }
}
