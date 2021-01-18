function Order(objData) {
    var obj = {
        //Tổng số lượng
        get TotalQuantity() {
            this.TotalQuantity_ = _.reduce(obj.OrderDetails, function (QuantityTemp, objOrderDetail) {
                if (objOrderDetail.IsDeleted) {
                    return QuantityTemp;
                }
                return QuantityTemp + objOrderDetail.Quantity; //(objOrderDetail.BoxNumber * objOrderDetail.NumOfBox);
            }, 0);
            return this.TotalQuantity_;
        },
        set TotalQuantity(value) {
            this.TotalQuantity_ = value;
        },

        //Tổng số thùng
        get TotalRequestBox() {
            this.TotalRequestBox_ = _.reduce(obj.OrderDetails, function (RequestBoxTemp, objOrderDetai) {
                if (objOrderDetai.IsDeleted) {
                    return RequestBoxTemp;
                }
                return RequestBoxTemp + objOrderDetai.BoxNumber;
            }, 0);
            return this.TotalRequestBox_;
        },
        set TotalRequestBox(value) {
            this.TotalRequestBox_ = value;
        },

        //Tổng số lượng nhập
        get TotalInputBox() {
            this.TotalInputBox_ = _.reduce(obj.OrderDetails, function (InputBoxTemp, objOrderDetai) {
                if (objOrderDetai.IsDeleted) {
                    return InputBoxTemp;
                }
                return InputBoxTemp + objOrderDetai.DetailInputBox;
            }, 0);
            return this.TotalInputBox_;
        },
        set TotalInputBox(value) {
            this.TotalInputBox_ = value;
        },

        //Tổng số lượng xuất
        get TotalOutputBox() {
            this.TotalOutputBox_ = _.reduce(obj.OrderDetails, function (TotalOutputBoxTemp, objOrderDetai) {
                if (objOrderDetai.IsDeleted) {
                    return TotalOutputBoxTemp;
                }
                return TotalOutputBoxTemp + objOrderDetai.DetailOutputBox;
            }, 0);
            return this.TotalOutputBox_;
        },
        set TotalOutputBox(value) {
            this.TotalOutputBox_ = value;
        },

        //Tổng tiền thuế VAT.
        get TotalTaxAmount() {
            this.TotalTaxAmount_ = _.reduce(obj.OrderDetails, function (TaxAmountTemp, objOrderDetai) {
                if (objOrderDetai.IsDeleted) {
                    return TaxAmountTemp;
                }
                return TaxAmountTemp + objOrderDetai.TaxAmount;
            }, 0);
            return this.TotalTaxAmount_;
        },
        set TotalTaxAmount(value) {
            this.TotalTaxAmount_ = value;
        },

        //Tổng tiền thuế VAT (thực)
        get TotalTaxAmountAF() {
            this.TotalTaxAmountAF_ = _.reduce(obj.OrderDetails, function (TotalTaxAmountAFTemp, objOrderDetai) {
                if (objOrderDetai.IsDeleted) {
                    return TotalTaxAmountAFTemp;
                }
                return TotalTaxAmountAFTemp + objOrderDetai.TaxAmountAF;
            }, 0);
            return this.TotalTaxAmountAF_;
        },
        set TotalTaxAmountAF(value) {
            this.TotalTaxAmountAF_ = value;
        },

        //Tổng tiền
        get TotalAmount() {
            this.TotalAmount_ = _.reduce(obj.OrderDetails, function (TotalAmountTemp, objOrderDetai) {
                if (objOrderDetai.IsDeleted) {
                    return TotalAmountTemp;
                }
                return TotalAmountTemp + objOrderDetai.PriceAmount;
            }, 0);
            return this.TotalAmount_;
        },
        set TotalAmount(value) {
            this.TotalAmount_ = value;
        },

        //Tổng tiền sau thuế
        get TotalAmountAF() {
            this.TotalAmountAF_ = _.reduce(obj.OrderDetails, function (TotalAmountAFTemp, objOrderDetai) {
                if (objOrderDetai.IsDeleted) {
                    return TotalAmountAFTemp;
                }
                return TotalAmountAFTemp + objOrderDetai.PriceAmountAF;
            }, 0);
            return this.TotalAmountAF_;
        },
        set TotalAmountAF(value) {
            this.TotalAmountAF_ = value;
        },

        //Tổng thể tích
        get TotalVolume() {
            this.TotalVolume_ = _.reduce(obj.OrderDetails, function (TotalVolumeTemp, objOrderDetai) {
                if (objOrderDetai.IsDeleted) {
                    return TotalVolumeTemp;
                }
                return TotalVolumeTemp + objOrderDetai.TotalVolume;
            }, 0);
            return this.TotalVolume_;
        },
        set TotalVolume(value) {
            this.TotalVolume_ = value;
        },

        //Tổng trọng lượng
        get TotalWeight() {
            this.TotalWeight_ = _.reduce(obj.OrderDetails, function (TotalWeightTemp, objOrderDetai) {
                if (objOrderDetai.IsDeleted) {
                    return TotalVolumeTemp;
                }
                return TotalWeightTemp + objOrderDetai.TotalWeight;
            }, 0);
            return this.TotalWeight_;
        },
        set TotalWeight(value) {
            this.TotalWeight_ = value;
        },

        //Tổng trọng lượng
        get TotalQuantityPaidConsign() {
            this.TotalQuantityPaidConsign_ = _.reduce(obj.OrderDetails, function (TotalQuantityPaidConsignTemp, objOrderDetai) {
                if (objOrderDetai.IsDeleted) {
                    return TotalQuantityPaidConsignTemp;
                }
                return TotalQuantityPaidConsignTemp + objOrderDetai.QuantityPaidConsign;
            }, 0);
            return this.TotalQuantityPaidConsign_;
        },
        set TotalQuantityPaidConsign(value) {
            this.TotalQuantityPaidConsign_ = value;
        }
    };

    //constructor
    if (objData) {
        obj.OID = objData.OID;
        obj.OrderID = objData.OrderID;
        obj.OrderTypeID = objData.OrderTypeID;
        obj.OrderTypeName = objData.OrderTypeName;
        obj.OrderStatusID = objData.OrderStatusID;
        obj.OrderStatusName = objData.OrderStatusName;
        obj.StoreID = objData.StoreID;
        obj.StoreGroupID = objData.StoreGroupID;
        obj.StoreGroupName = objData.StoreGroupName;
        obj.FormID = objData.FormID;
        obj.PaymentTypeID = objData.PaymentTypeID;
        obj.OrderPaymentTypeID = objData.OrderPaymentTypeID;
        obj.SupplierID = objData.SupplierID;
        obj.SupplierName = objData.SupplierName;
        obj.SupplierAddress = objData.SupplierAddress;
        obj.SupplierPhone = objData.SupplierPhone;
        obj.SupplierFax = objData.SupplierFax;
        obj.SupplierEmail = objData.SupplierEmail;
        obj.TaxNo = objData.TaxNo;
        obj.CurrencyUnitID = objData.CurrencyUnitID;
        obj.CurrencyExchange = objData.CurrencyExchange;
        obj.DurationDay = objData.DurationDay;
        obj.MaxDayPaymentLimit = objData.MaxDayPaymentLimit;
        obj.MaxDayLimit = objData.MaxDayLimit;
        obj.MaxPaymentLimit = objData.MaxPaymentLimit;
        obj.IsNew = objData.IsNew;
        obj.IsAuto = objData.IsAuto;
        obj.IsNotConfirm = objData.IsNotConfirm;
        obj.IsAutoSend = objData.IsAutoSend;
        obj.PaymentDate = objData.PaymentDate;
        obj.OrderDate = objData.OrderDate;
        obj.OutputDate = objData.OutputDate;
        obj.InputDate = objData.InputDate;
        obj.InputDateFrom = objData.InputDateFrom;
        obj.InputDateTo = objData.InputDateTo;
        obj.PaymentAF = objData.PaymentAF;
        obj.DebtAF = objData.DebtAFd;
        obj.ReferenceOrderID = objData.ReferenceOrderID;
        obj.ReferenceOID = objData.ReferenceOID;
        obj.MerchandiseDescription = objData.MerchandiseDescription;
        obj.AccountingDescription = objData.AccountingDescription;
        obj.SupplierDescription = objData.SupplierDescription;
        obj.UpdatedDateSupplier = objData.UpdatedDateSupplier;
        obj.UpdatedSupplierID = objData.UpdatedSupplierID;
        obj.CreatedDate = objData.CreatedDate;
        obj.CreatedUser = objData.CreatedUser;
        obj.CreatedUserFullName = objData.CreatedUserFullName;
        obj.UpdatedDate = objData.UpdatedDate;
        obj.UpdatedUser = objData.UpdatedUser;
        obj.IsDeleted = objData.IsDeleted;
        obj.PurcOrderID = objData.PurcOrderID;
        obj.InputStoreID = objData.InputStoreID;
        obj.InputVoucherID = objData.InputVoucherID;
        obj.DeliveryDays = objData.DeliveryDays;
        obj.Quantity = objData.Quantity;
        obj.StoreName = objData.StoreName;
        obj.ParentStoreGroupID = objData.ParentStoreGroupID;
        obj.AreaID = objData.AreaID;
        obj.AreaName = objData.AreaName;
        obj.TotalProductVolume = objData.TotalProductVolume;
        obj.Volume = objData.Volume;
        obj.IsComplete = objData.IsComplete;
        obj.TotalRecord = objData.TotalRecord;
        obj.RowNumber = objData.RowNumber;
        obj.SumTotalDebt = objData.SumTotalDebt;
        obj.SumTotalAmount = objData.SumTotalAmount;
        obj.SumTotalAmountAF = objData.SumTotalAmountAF;
        obj.QuantityPaidConsign = objData.QuantityPaidConsign;
        obj.OrderPaymentName = objData.OrderPaymentName;
        obj.PaymentTypeName = objData.PaymentTypeName;
        obj.ExpectedInputDate = objData.ExpectedInputDate;
        obj.OrderDetails = [];
        if (objData.OrderDetails) {
            objData.OrderDetails.forEach(function (objOrderDetail) {
                var objOrderDetail = new OrderDetail(objOrderDetail);
                obj.OrderDetails.push(objOrderDetail);
            });
        }
    }
    return obj;
}

function OrderDetail(objData) {
    var obj = {
        //Quantity
        //get Quantity() {
        //    this.Quantity_ = obj.BoxNumber * obj.NumOfBox;
        //    return this.Quantity_;
        //},
        //set Quantity(value) {
        //    this.Quantity_ = value;
        //},

        //TaxAmount
        get TaxAmount() {
            this.TaxAmount_ = obj.OriginalPriceBFVAT * obj.VAT / 100 * (obj.BoxNumber * obj.NumOfBox);
            return this.TaxAmount_;
        },
        set TaxAmount(value) {
            this.TaxAmount_ = value;
        },

        //OriginalPriceVAT
        get OriginalPriceVAT() {
            this.OriginalPriceVAT_ = obj.OriginalPriceBFVAT * obj.VAT / 100 + obj.OriginalPriceBFVAT;
            return this.OriginalPriceVAT_;
        },
        set OriginalPriceVAT(value) {
            this.OriginalPriceVAT_ = value;
        },

        //PriceAmount
        get PriceAmount() {
            this.PriceAmount_ = obj.OriginalPriceVAT * (obj.Quantity);
            return this.PriceAmount_;
        },
        set PriceAmount(value) {
            this.PriceAmount_ = value;
        },

        //BoxNumber
        get BoxNumber() {
            return this.BoxNumber_ = obj.Quantity / obj.NumOfBox;
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

        //PriceAmountAF
        get PriceAmountAF() {
            this.PriceAmountAF_ = obj.OriginalPriceVAT * obj.QuantityAF;
            return this.PriceAmountAF_;
        },
        set PriceAmountAF(value) {
            this.PriceAmountAF_ = value;
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
        obj.Weight = objData.Weight;
        obj.Volume = objData.Volume;
        obj.BoxNumber = objData.BoxNumber;
        obj.NumOfBox = objData.NumOfBox;
        obj.DetailInputBox = objData.DetailInputBox;
        obj.Quantity = objData.Quantity;
        obj.QuantityAF = objData.QuantityAF;
        obj.PaymentAF = objData.PaymentAF;
        obj.DebtAF = objData.DebtAF;
        obj.PriceAmountAF = objData.PriceAmountAF;
        obj.SysOriginalPriceBFVAT = objData.SysOriginalPriceBFVAT;
        obj.TaxAmount = objData.TaxAmount;
    }

    return obj;
}