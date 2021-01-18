function Order(objData) {
    var obj = {};

    //constructor
    if (objData) {
        obj.OrderDetails = objData.OrderDetails;
    }

    return obj;
}

function OrderDetail(objData) {
    var obj = {
        //Quantity
        get Quantity() {
            this.Quantity_ = obj.BoxNumber * obj.NumOfBox;
            return this.Quantity_;
        },
        set Quantity(value) {
            this.Quantity_ = value;
        },

        //TaxAmount
        get TaxAmount() {
            this.TaxAmount_ = obj.OriginalPriceBFVAT * obj.VAT / 100 * obj.Quantity;
            return this.TaxAmount_;
        },
        set TaxAmount(value) {
            this.TaxAmount_ = value;
        },

        //PriceAmount
        get PriceAmount() {
            this.PriceAmount_ = obj.OriginalPriceVAT * obj.Quantity;
            return this.PriceAmount_;
        },
        set PriceAmount(value) {
            this.PriceAmount_ = value;
        },

        //BoxNumber
        get BoxNumber() {
            return this.BoxNumber_;
        },
        set BoxNumber(value) {
            this.BoxNumber_ = value;
        },

        //TotalVolume
        get TotalVolume() {
            this.TotalVolume_ = obj.Volume * obj.BoxNumber;
            return this.TotalVolume_;
        },
        set TotalVolume(value) {
            this.TotalVolume_ = value;
        },

        //TotalWeight
        get TotalWeight() {
            this.TotalWeight_ = obj.Weight * obj.BoxNumber;
            return this.TotalWeight_;
        },
        set TotalWeight(value) {
            this.TotalWeight_ = value;
        },
    };
    obj.DistributedOrders = [];

    //constructor
    if (objData) {
        obj.OID = objData.OID;
        obj.OrderDetailID = objData.OrderDetailID;
        obj.OrderID = objData.OrderID;
        obj.PID = objData.PID;
        obj.ProductID = objData.ProductID;
        obj.ProductName = objData.ProductName;
        obj.QuantityPaidConsign = objData.QuantityPaidConsign;
        obj.OriginalPriceBFVAT = objData.OriginalPriceBFVAT;
        obj.OriginalPriceVAT = objData.OriginalPriceVAT;
        obj.SalePriceVAT = objData.SalePriceVAT;
        obj.VAT = objData.VAT;
        obj.VATPercent = objData.VATPercent;
        obj.NumOfBox = objData.NumOfBox;
        obj.Weight = objData.Weight;
        obj.Volume = objData.Volume;
        obj.BoxNumber = objData.BoxNumber;
        obj.DetailInputBox = objData.DetailInputBox;
        obj.PaymentAF = objData.PaymentAF;
        obj.DebtAF = objData.DebtAF;
        obj.PriceAmountAF = objData.PriceAmountAF;
        obj.SysOriginalPriceBFVAT = objData.SysOriginalPriceBFVAT;
        obj.Quantity = objData.Quantity;
        
    }

    return obj;
}