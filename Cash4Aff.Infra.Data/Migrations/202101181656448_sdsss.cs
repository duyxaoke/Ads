namespace Cash4Aff.Infra.Data.Context
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class sdsss : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Ads", "Url", c => c.String(maxLength: 400));
            AlterColumn("dbo.Ads", "ImageUrl", c => c.String(maxLength: 400));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Ads", "ImageUrl", c => c.String(maxLength: 100, unicode: false));
            AlterColumn("dbo.Ads", "Url", c => c.String(maxLength: 200));
        }
    }
}
