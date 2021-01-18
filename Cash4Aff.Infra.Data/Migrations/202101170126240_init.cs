namespace Cash4Aff.Infra.Data.Context
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class init : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Balance",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserID = c.String(maxLength: 50, unicode: false),
                        AvailableBalance = c.Decimal(nullable: false, precision: 18, scale: 2),
                        TotalBalance = c.Decimal(nullable: false, precision: 18, scale: 2),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Bank",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        BankCode = c.String(maxLength: 100),
                        BankName = c.String(maxLength: 100),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Config",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SystemEnable = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Menu",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ParentId = c.Int(),
                        Name = c.String(maxLength: 100),
                        Url = c.String(maxLength: 100),
                        Icon = c.String(maxLength: 100, unicode: false),
                        IsActive = c.Boolean(nullable: false),
                        Order = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.MenuInRole",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        RoleId = c.Guid(nullable: false),
                        MenuId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.UserRef",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserID = c.String(maxLength: 50, unicode: false),
                        ParentID = c.String(maxLength: 50, unicode: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Wallet",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserID = c.String(maxLength: 100, unicode: false),
                        BankAccountNumber = c.String(maxLength: 100),
                        BankAccountName = c.String(maxLength: 100),
                        BankID = c.Int(nullable: false),
                        BranchName = c.String(maxLength: 100),
                        Phone = c.String(maxLength: 100, unicode: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Withdraw",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserID = c.String(maxLength: 100, unicode: false),
                        Amount = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Description = c.String(maxLength: 250),
                        CreateDate = c.DateTime(nullable: false),
                        UpdateDate = c.DateTime(nullable: false),
                        Status = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Withdraw");
            DropTable("dbo.Wallet");
            DropTable("dbo.UserRef");
            DropTable("dbo.MenuInRole");
            DropTable("dbo.Menu");
            DropTable("dbo.Config");
            DropTable("dbo.Bank");
            DropTable("dbo.Balance");
        }
    }
}
