namespace Cash4Aff.Presentation.Models
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class edituser : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "ParentUserID", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "ParentUserID");
        }
    }
}
