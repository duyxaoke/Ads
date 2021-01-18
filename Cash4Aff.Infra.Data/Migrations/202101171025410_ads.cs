namespace Cash4Aff.Infra.Data.Context
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ads : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Ads",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Title = c.String(maxLength: 200),
                        Description = c.String(maxLength: 500),
                        Url = c.String(maxLength: 200),
                        Price = c.Decimal(nullable: false, precision: 18, scale: 2),
                        SecondView = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Ads");
        }
    }
}
