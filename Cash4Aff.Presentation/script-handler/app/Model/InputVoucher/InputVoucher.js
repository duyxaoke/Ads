function InputVoucher(objData) {
    var obj = {};

    //constructor
    if (objData) {
        obj.InputVoucherDetails = [];
        if (objData.InputVoucherDetails) {
            objData.InputVoucherDetails.forEach(function (objInputVoucherDetails_Item) {
                var objInputVoucherDetails = new InputVoucherDetails(objInputVoucherDetails_Item);
                obj.InputVoucherDetails.push(objInputVoucherDetails);
            });
        }
    }
    return obj;
}

function InputVoucherDetail(objData) {
    var obj = {
        //Quantity
        get InputBox() {
            this.InputBox_ = _.reduce(obj.DistributedOrders, function (OrderQuantityTemp, objDistributedOrder) {
                if (objDistributedOrder.IsDeleted) {
                    return OrderQuantityTemp;
                }
                return OrderQuantityTemp + objDistributedOrder.DistributedInputBox;
            }, 0);
            return this.InputBox_;
        },
        set InputBox(value) {
            this.InputBox_ = value;
        },

        //TotalWeight
        get TotalWeight() {
            this.TotalWeight_ = obj.Weight * obj.InputBox;
            return this.TotalWeight_;
        },
        set TotalWeight(value) {
            this.TotalWeight_ = value;
        },
        //TotalVolume
        get TotalVolume() {
            this.TotalVolume_ = obj.Volume * obj.InputBox;
            return this.TotalVolume_;
        },
        set TotalVolume(value) {
            this.TotalVolume_ = value;
        }
    };
    obj.DistributedOrders = [];

    //constructor
    if (objData) {
        obj.InputVoucherDetailID = objData.InputVoucherDetailID;
        obj.OrderDetailID = objData.OrderDetailID;
        obj.TotalQuantity = objData.TotalQuantity;
        obj.PaymentTypeID = objData.PaymentTypeID;
        obj.IVID = objData.IVID;
        obj.InputVoucherID = objData.InputVoucherID;
        obj.PID = objData.PID;
        obj.ProductID = objData.ProductID;
        obj.ProductName = objData.ProductName;
        obj.ReferenceID = objData.ReferenceID;
        obj.ProduceDate = objData.ProduceDate;
        obj.WarrantyDate = objData.WarrantyDate;
        obj.Quantity = objData.Quantity;
        obj.OriginalPriceBFVAT = objData.OriginalPriceBFVAT;
        obj.OriginalPriceVAT = objData.OriginalPriceVAT;
        obj.SalePriceVAT = objData.SalePriceVAT;
        obj.AveragePrice = objData.AveragePrice;
        obj.VAT = objData.VAT;
        obj.VATPercent = objData.VATPercent;
        obj.TaxAmount = objData.TaxAmount;
        obj.PriceAmount = objData.PriceAmount;
        obj.Weight = objData.Weight;
        obj.RequestBox = objData.RequestBox
        obj.Volume = objData.Volume;
        obj.IsConfirm = objData.IsConfirm;
        obj.NumOfBox = objData.NumOfBox;
        if (objData.DistributedOrders) {
            objData.DistributedOrders.forEach(function (objDistributedOrder_Item) {
                var objDistributedOrder = new DistributedOrder(objDistributedOrder_Item);
                obj.DistributedOrders.push(objDistributedOrder);
            });
        }
    }

    return obj;
}

function DistributedOrder(objData) {
    var obj = {
        //OrderQuantity
        get OrderQuantity() {
            this.OrderQuantity_ = obj.OrderBoxNumber * obj.NumOfBox;
            return this.OrderQuantity_;
        },
        set OrderQuantity(value) {
            this.OrderQuantity_ = value;
        },

        //OriginalPriceVAT
        get OriginalPriceVAT() {
            this.OriginalPriceVAT_ = obj.OriginalPriceBFVAT + obj.OriginalPriceBFVAT * obj.VAT / 100;
            return this.OriginalPriceVAT_;
        },
        set OriginalPriceVAT(value) {
            this.OriginalPriceVAT_ = value;
        },

        //TaxAmount
        get TaxAmount() {
            this.TaxAmount_ = (obj.OriginalPriceBFVAT * obj.VAT / 100) * (obj.OrderBoxNumber * obj.NumOfBox);
            return this.TaxAmount_;
        },
        set TaxAmount(value) {
            this.TaxAmount_ = value;
        },

        //PriceAmount
        get PriceAmount() {
            this.PriceAmount_ = (obj.OriginalPriceBFVAT + obj.OriginalPriceBFVAT * obj.VAT / 100) * (obj.OrderBoxNumber * obj.NumOfBox);
            return this.PriceAmount_;
        },
        set PriceAmount(value) {
            this.PriceAmount_ = value;
        },

        //TotalWeight
        get TotalWeight() {
            this.TotalWeight_ = obj.Weight * obj.DistributedInputBox;
            if (this.TotalWeight_ == NaN) {
                this.TotalWeight_ = 0;
            }
            return this.TotalWeight_;
        },
        set TotalWeight(value) {
            this.TotalWeight_ = value;
        },

        //TotalVolume
        get TotalVolume() {
            this.TotalVolume_ = obj.Volume * obj.DistributedInputBox;
            if (this.TotalVolume_ == NaN) {
                this.TotalVolume_ = 0;
            }
            return this.TotalVolume_;
        },
        set TotalVolume(value) {
            this.TotalVolume_ = value;
        },

        //DistributedInputBox
        //get DistributedInputBox() {
        //    this.DistributedInputBox_ = obj.OrderBoxNumber;
        //    return this.DistributedInputBox_;
        //},
        //set DistributedInputBox(value) {
        //    this.DistributedInputBox_ = value;
        //}
    };

    //constructor
    if (objData) {
        obj.OrderDistributedID = objData.OrderDistributedID;
        obj.OrderDetailID = objData.OrderDetailID;
        obj.PID = objData.PID;
        obj.ProductID = objData.ProductID;
        obj.ProductName = objData.ProductName;
        obj.OrderBoxNumber = objData.OrderBoxNumber;
        obj.NumOfBox = objData.NumOfBox;
        obj.OriginalPriceBFVAT = objData.OriginalPriceBFVAT;
        obj.OriginalPriceVAT = objData.OriginalPriceVAT;
        obj.VAT = objData.VAT;
        obj.SalePriceVAT = objData.SalePriceVAT;
        obj.Volume = objData.Volume;
        obj.Weight = objData.Weight;
        obj.StoreID = objData.StoreID;
        obj.StoreName = objData.StoreName;
        obj.AreaID = objData.AreaID;
        obj.AreaName = objData.AreaName;
        obj.DistributedInputBox = objData.DistributedInputBox ? objData.DistributedInputBox : 0;
        obj.DistributedOutputBox = objData.DistributedOutputBox ? objData.DistributedOutputBox : 0;
        obj.InputQuantity = objData.InputQuantity ? objData.InputQuantity : 0;
    }

    return obj;
}