function Order(objData) {
    var obj = {};

    //constructor
    if (objData) {
        obj.OrderDetails = [];
        if (objData.OrderDetails) {
            objData.OrderDetails.forEach(function (objOrderDetails_Item) {
                var objOrderDetails = new OrderDetails(objOrderDetails_Item);
                obj.OrderDetails.push(objOrderDetails);
            });
        }
    }

    return obj;
}

function OrderDetail(objData) {
    var obj = {
        //Quantity
        get Quantity() { 
            this.Quantity_ = _.reduce(obj.DistributedOrders, function (OrderQuantityTemp, objDistributedOrder) {
                if (objDistributedOrder.IsDeleted) {
                    return OrderQuantityTemp;
                }
                return OrderQuantityTemp + objDistributedOrder.OrderQuantity;
            }, 0);
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

        //OriginalPriceVAT = obj.OriginalPriceBFVAT * obj.VAT / 100 + obj.OriginalPriceVAT;

        //BoxNumber
        get BoxNumber() {
            this.BoxNumber_ = _.reduce(obj.DistributedOrders, function (OrderBoxNumberTemp, objDistributedOrder) {
                if (objDistributedOrder.IsDeleted) {
                    return OrderBoxNumberTemp;
                }
                return OrderBoxNumberTemp + objDistributedOrder.OrderBoxNumber;
            }, 0);
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


        //OrderQuantity
        get OrderQuantity() {
            this.OrderQuantity_ = obj.OrderBoxNumber * obj.NumOfBox; 
            return this.OrderQuantity_;
        },
        set OrderQuantity(value) {
            this.OrderQuantity_ = value;
        },
    }; 
    obj.DistributedOrders = [];

    //constructor
    if (objData) {
        obj.OrderDetailID = objData.OrderDetailID;
        obj.OID = objData.OID;
        obj.OrderID = objData.OrderID;
        obj.PID = objData.PID;
        obj.ProductID = objData.ProductID;
        obj.ReferenceID = objData.ReferenceID;
        obj.QuantityPaidConsign = objData.QuantityPaidConsign;
        obj.OriginalPriceBFVAT = objData.OriginalPriceBFVAT;
        obj.OriginalPriceVAT = objData.OriginalPriceVAT;
        obj.SalePriceVAT = objData.SalePriceVAT;
        obj.VAT = objData.VAT;
        obj.VATPercent = objData.VATPercent;
        obj.NumOfBox = objData.NumOfBox;
        obj.Weight = objData.Weight;
        obj.Volume = objData.Volume;
        obj.ProductName = objData.ProductName;
        obj.DetailInputBox = objData.DetailInputBox;
        obj.DetailOutputBox = objData.DetailOutputBox; 

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
            this.TotalWeight_ = obj.Weight * obj.OrderBoxNumber;
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
            this.TotalVolume_ = obj.Volume * obj.OrderBoxNumber;
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
        //    if (this.DistributedInputBox_ == 0 || !this.DistributedInputBox_ || this.DistributedInputBox_ == null) {
        //        debugger;
        //    } 
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
        obj.DistributedOutputBox = objData.DistributedOutputBox ? objData.DistributedOutputBox : 0; 
        obj.DistributedInputBox = objData.DistributedInputBox;
        obj.InputQuantity = objData.InputQuantity ? objData.InputQuantity : 0;
        obj.TemplateQuantity = objData.TemplateQuantity ? objData.TemplateQuantity : 0;
    }

    return obj;
}