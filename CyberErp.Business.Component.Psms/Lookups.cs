using CyberErp.Data.Infrastructure;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;

namespace CyberErp.Business.Component.Psms
{
    public class Lookups
    {
        #region Members

        public const string StoreType = "LupStoreType";
        public const string ItemCategoryType = "LupItemCategoryType";
        public const string MeasurementUnit = "LupMeasurementUnit";
        public const string VoucherType = "LupVoucherType";
        public const string VoucherStatus = "LupVoucherStatus";
        public const string RequestType = "LupRequestType";
        public const string RequestPurpose = "LupRequestPurpose";
      
        public const string ItemType = "LupItemType";
        public const string InventoryCostingMethod = "lupInventoryCostingMethod";
        public const string InventoryAccountType = "lupInventoryAccountType";
        public const string Gender = "lupGender";
        public const string EmploymentNature = "lupEmploymentNature";
        public const string InspectionType = "lupInspectionType";
        public const string ReceiveCondition = "lupReceiveCondition";
        public const string ReceiveType = "lupReceiveType";
        public const string SupplierCategory = "lupSupplierCategory";
        public const string SupplierItemMappingType = "lupSupplierItemMappingType";
        public const string ConsumerType = "lupConsumerType";
        public const string PurchasePlanType = "lupPurchasePlanType";
        public const string PurchaseRequestType = "lupPurchaseRequestType";
        public const string PurchaseOrderType = "lupPurchaseOrderType";
        public const string PurchaseType = "lupPurchaseType";
        public const string PaymentTerm = "lupPaymentTerm";
        public const string PurchaseEvaluationCriteriaCategory = "lupPurchaseEvaluationCriteriaCategory";
        public const string ReturnType = "lupReturnType";
        public const string ReturnCondition = "lupReturnCondition";
        public const string PublicityMethod = "lupPublicityMethod";
        public const string PurchaseSubjectType = "lupPurchaseSubjectType";
        public const string SourceofFund = "lupSourceofFund";
        public const string TenderEvaluatorRole = "lupTenderEvaluatorRole";
        public const string TenderStatus = "lupTenderStatus";
        public const string IntegrationAccountType = "lupIntegrationAccountType";
        public const string BalanceSide = "lupBalanceSide";
        public const string AgreementType = "lupAgreementType";
        public const string storeRequestType = "lupStoreRequestType";
        public const string AdjustmentType = "lupAdjustmentType";
        public const string PriceGroup = "lupPriceGroup";
        public const string PurchaseOrderComment = "lupPurchaseOrderComment";
        public const string DisposalType = "lupDisposalType";
        public const string SalesType = "lupSalesType";
        
        private readonly Repository _repository;

        #endregion

        #region Constructor

        public Lookups(DbContext dbContext)
        {
            _repository = new Repository(dbContext);
        }

        #endregion

        #region Methods

        public void AddNew(coreLookup lookup, string table)
        {
            _repository.Add(lookup, table);
        }

        public void Edit(coreLookup lookup, string table)
        {
            _repository.Edit(lookup, table);
        }

        public void Delete(Guid id, string table)
        {
            _repository.Delete(id, table);
        }

        public coreLookup Get(Guid id, string table)
        {
            return _repository.Get(id, table);
        }

        public IEnumerable<coreLookup> GetAll(string table)
        {
            return _repository.GetAll(table);
        }

        public IEnumerable<coreLookup> GetAll(int start, int limit, string table)
        {
            return _repository.GetAll(start, limit, table);
        }

        public static ArrayList GetLookupCategories()
        {
            var categoryList = new ArrayList();

            categoryList.Add(new { id = StoreType, text = "Store Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = ItemCategoryType, text = "Item Category Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
          
            categoryList.Add(new { id = MeasurementUnit, text = "Measurement Unit", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = ItemType, text = "Item Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = InventoryCostingMethod, text = "Inventory Costing", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = RequestPurpose, text = "Request Purpose", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = DisposalType, text = "Disposal Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = ConsumerType, text = "Consumer Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
   
             categoryList.Add(new { id = ReceiveType, text = "Receive Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = SupplierCategory, text = "Supplier Category", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = PurchasePlanType, text = "Purchase Plan Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = PurchaseRequestType, text = "Purchase Request Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = PurchaseOrderType, text = "Purchase Order Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = PurchaseType, text = "Purchase Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = ReturnType, text = "Return Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
         
              categoryList.Add(new { id = RequestType, text = "Request Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = VoucherStatus, text = "Voucher Status", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
             categoryList.Add(new { id = storeRequestType, text = "Store Request Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = AdjustmentType, text = "Adjustment Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = PriceGroup, text = "Price Group", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = PurchaseOrderComment, text = "Purchase Comment", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = SalesType, text = "Sales Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
                         
            return categoryList;
        }

        #endregion
    }
}
