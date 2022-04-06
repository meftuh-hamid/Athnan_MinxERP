using CyberErp.Business.Component.Psms;
using CyberErp.Data.Model;
using CyberErp.Presentation.Psms.Web.Classes;
using Ext.Direct.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace CyberErp.Presentation.Psms.Web.Controllers
{
    public class PsmsController : DirectController
    {
        #region Member

        private readonly DbContext _context;
        private readonly Lookups _lookup;
        private readonly BaseModel<coreUser> _user;          
        private readonly BaseModel<coreUser> _users;
        private readonly BaseModel<coreRole> _role;
        private readonly BaseModel<psmsItem> _item;
        private readonly BaseModel<psmsStore> _store;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        private readonly BaseModel<coreUnit> _unit;
        private readonly BaseModel<psmsItemCategory> _itemCategory;
        private readonly BaseModel<psmsTaxRate> _taxRate;
        private readonly BaseModel<psmsSupplier> _supplier;
        private readonly BaseModel<psmsInventoryRecord> _inventoryRecord;

        private readonly BaseModel<psmsPurchaseRequestDetail> _purchaseRequestDetail;
        private readonly BaseModel<psmsPurchaseRequestHeader> _purchaseRequestHeader;
        private readonly BaseModel<psmsStoreRequisitionHeader> _storeRequisitionHeader;
        private readonly BaseModel<psmsPurchaseOrderHeader> _purchaseOrderHeader;
        private readonly BaseModel<psmsItemSerial> _itemSerial;
        private readonly BaseModel<psmsIssueHeader> _issueHeader;
        private readonly BaseModel<psmsTransferIssueHeader> _transferIssueHeader;
        private readonly BaseModel<lupVoucherType> _voucherType;
        private readonly BaseModel<slmsSalesHeader> _salesHeader;
        private readonly BaseModel<coreVoucherWorkFlow> _voucherWorkFlow;         
        private readonly BaseModel<psmsStoreLocation> _storeLocation;
        private readonly BaseModel<psmsStoreLocationBin> _storeLocationBin;
        private readonly BaseModel<psmsItemLocation> _itemLocation;
        private readonly BaseModel<slmsCustomer> _customer;
        private readonly BaseModel<slmsCustomerCategory> _customerCategory;
        private readonly BaseModel<PRWorkStation> _workStation;
        private readonly BaseModel<PROperation> _operation;
        private readonly BaseModel<slmsSalesArea> _area;
        private readonly BaseModel<PRProductionPlanHeader> _productionPlanHeader;
        private readonly BaseModel<PRProductionPlanJobCardDetail> _productionPlanJobCardDetail;
        private readonly BaseModel<lupVoucherStatus> _voucherStatus;
        private readonly BaseModel<PRProductionOrderHeader> _productionOrderHeader;
        private readonly BaseModel<PRProductionPlanDeliveryDetail> _productionPlanDeliveryDetail;
        private readonly BaseModel<slmsCustomerCredit> _customerCredit;
        private readonly BaseModel<psmsSupplierCredit> _supplierCredit;
        private readonly BaseModel<psmsFreightOrder> _freightOrder;
        private readonly BaseModel<psmsPurchaseOrderATCDetail> _atc;
        private readonly BaseModel<slmsPriceCategory> _priceCategory;
        private readonly BaseModel<psmsSetting> _setting;
        private readonly BaseModel<slmsItemPrice> _itemPrice;
        private readonly BaseModel<slmsProformaHeader> _proformaHeader;

        
        Guid approvedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Approved);
        Guid voidVoucherStatus = Guid.Parse(Constants.Voucher_Status_Void);
        Guid salesOrderVoucherType = Guid.Parse(Constants.Voucher_Type_sales);
        Guid orderVoucherStatus = Guid.Parse(Constants.Voucher_Status_Ordered);
        Guid finalVoucherStatus = Guid.Parse(Constants.Voucher_Status_Final_Approved);
        #endregion

        #region Constructor

        public PsmsController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _lookup = new Lookups(_context);
            _voucherType = new Business.Component.Psms.BaseModel<lupVoucherType>(_context);
            _user = new BaseModel<coreUser>(_context);
            _users = new BaseModel<coreUser>(_context);
            _role = new BaseModel<coreRole>(_context);
            _item = new BaseModel<psmsItem>(_context);
            _store = new BaseModel<psmsStore>(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);
            _unit = new BaseModel<coreUnit>(_context);
            _taxRate = new BaseModel<psmsTaxRate>(_context);
            _supplier = new BaseModel<psmsSupplier>(_context);
            _itemCategory=new BaseModel<psmsItemCategory>(_context);
            _inventoryRecord = new BaseModel<psmsInventoryRecord>(_context);
            _purchaseRequestDetail = new BaseModel<psmsPurchaseRequestDetail>(_context);
            _purchaseRequestHeader = new BaseModel<psmsPurchaseRequestHeader>(_context);
            _storeRequisitionHeader = new Business.Component.Psms.BaseModel<psmsStoreRequisitionHeader>(_context);
            _purchaseOrderHeader = new Business.Component.Psms.BaseModel<psmsPurchaseOrderHeader>(_context);
            _itemSerial = new Business.Component.Psms.BaseModel<psmsItemSerial>(_context);
            _issueHeader = new Business.Component.Psms.BaseModel<psmsIssueHeader>(_context);
            _transferIssueHeader = new Business.Component.Psms.BaseModel<psmsTransferIssueHeader>(_context);
             _storeLocation = new Business.Component.Psms.BaseModel<psmsStoreLocation>(_context);
             _storeLocationBin = new Business.Component.Psms.BaseModel<psmsStoreLocationBin>(_context);
             _itemLocation = new Business.Component.Psms.BaseModel<psmsItemLocation>(_context);
             _salesHeader = new BaseModel<slmsSalesHeader>(_context);
             _voucherWorkFlow = new BaseModel<coreVoucherWorkFlow>(_context);
             _customer = new BaseModel<slmsCustomer>(_context);
             _workStation = new BaseModel<PRWorkStation>(_context);
             _operation = new BaseModel<PROperation>(_context);
             _productionPlanHeader = new BaseModel<PRProductionPlanHeader>(_context);
             _area = new BaseModel<slmsSalesArea>(_context);
             _productionPlanJobCardDetail = new BaseModel<PRProductionPlanJobCardDetail>(_context);
             _voucherStatus = new BaseModel<lupVoucherStatus>(_context);
             _productionOrderHeader = new BaseModel<PRProductionOrderHeader>(_context);
             _productionPlanDeliveryDetail = new BaseModel<PRProductionPlanDeliveryDetail>(_context);
             _customerCredit = new BaseModel<slmsCustomerCredit>(_context);
             _supplierCredit = new BaseModel<psmsSupplierCredit>(_context);
             _freightOrder = new BaseModel<psmsFreightOrder>(_context);
             _atc = new BaseModel<psmsPurchaseOrderATCDetail>(_context);
             _customerCategory = new BaseModel<slmsCustomerCategory>(_context);
             _priceCategory = new BaseModel<slmsPriceCategory>(_context);
             _setting = new BaseModel<psmsSetting>(_context);
             _itemPrice = new BaseModel<slmsItemPrice>(_context);
             _proformaHeader = new BaseModel<slmsProformaHeader>(_context);
         }

        #endregion

        #region Lookups

        public ActionResult GetAll(string table)
        {
            var lookup = _lookup.GetAll(table).OrderBy(l => l.Code);
            var result = new
            {
                total = lookup.Count(),
                data = lookup
            };
            return this.Direct(result);
        }
      
        public ActionResult GetStoreType()
        {
            return GetAll(Lookups.StoreType);
        }
        public ActionResult GetRequestPurpose()
        {
            return GetAll(Lookups.RequestPurpose);
        }
        public ActionResult GetItemCategoryType()
        {
            return GetAll(Lookups.ItemCategoryType);
        }
        public ActionResult GetItemType()
        {
            return GetAll(Lookups.ItemType);
        }
        public ActionResult GetPriceGroup()
        {
            return GetAll(Lookups.PriceGroup);
        } 
        public ActionResult GetMeasurementUnit()
        {
            return GetAll(Lookups.MeasurementUnit);
        }
        public ActionResult GetDisposalType()
        {
            return GetAll(Lookups.DisposalType);
        }
      
        public ActionResult GetAdjustmentType()
        {
            return GetAll(Lookups.AdjustmentType);
        }
       
        public ActionResult GetVoucherStatus()
        {
            return GetAll(Lookups.VoucherStatus);
        }
     
        public ActionResult GetReceiveType()
        {
            return GetAll(Lookups.ReceiveType);
        }
        public ActionResult GetSupplierCategory()
        {
            return GetAll(Lookups.SupplierCategory);
        }                
        public ActionResult GetEmploymentNature()
        {
            return GetAll(Lookups.EmploymentNature);
        }
        public ActionResult GetConsumerType()
        {
            return GetAll(Lookups.ConsumerType);
        }
        public ActionResult GetPurchaseRequestType()
        {
            return GetAll(Lookups.PurchaseRequestType);
        }
        public ActionResult GetPurchaseOrderType()
        {
            return GetAll(Lookups.PurchaseOrderType);
        }
        public ActionResult GetPurchaseType()
        {
            return GetAll(Lookups.PurchaseType);
        }
       
        public ActionResult GetReturnType()
        {
            return GetAll(Lookups.ReturnType);
        }
        public ActionResult GetSalesType()
        {
            return GetAll(Lookups.SalesType);
        }
        #endregion

        #region Actions
        public ActionResult GetPriceCategory()
        {
            var records =_priceCategory .GetAll().OrderBy(o => o.Name);
            var Items = records.Select(item => new
            {
                item.Id,
                Name = item.Name,
            }).ToList();
            var result = new
            {
                total = Items.Count(),
                data = Items
            };
            return this.Direct(result);
        }
        public ActionResult GetProductionStatus()
        {
            var records = _voucherStatus.GetAll().Where(a => a.Id ==orderVoucherStatus || a.Id==finalVoucherStatus).OrderBy(o => o.Name);
            var Items = records.Select(item => new
            {
                item.Id,
                Name = item.Name,
            }).ToList();
            var result = new
            {
                total = Items.Count(),
                data = Items
            };
            return this.Direct(result);
        }
        public ActionResult GetCustomerCategory()
        {
            var records =_customerCategory.GetAll().OrderBy(o => o.Name);
            var Items = records.Select(item => new
            {
                item.Id,
                Name = item.Name,
            }).ToList();
            var result = new
            {
                total = Items.Count(),
                data = Items
            };
            return this.Direct(result);
        }
        public ActionResult GetWorkStation()
        {
            var records = _workStation.GetAll().OrderBy(o => o.Name);
            var Items = records.Select(item => new
            {
                item.Id,
                Name = item.Name,
            }).ToList();
            var result = new
            {
                total = Items.Count(),
                data = Items
            };
            return this.Direct(result);
        }
        public ActionResult GetSalesArea()
        {
            var records = _area.GetAll().OrderBy(o => o.Name);
            var Items = records.Select(item => new
            {
                item.Id,
                Name = item.Name,
                item.StoreId,
                Store=item.StoreId.HasValue?item.psmsStore.Name:"",
                item.PriceCategoryId,
                PriceCategory = item.PriceCategoryId.HasValue ? item.slmsPriceCategory.Name : "",

            }).ToList();
            var result = new
            {
                total = Items.Count(),
                data = Items
            };
            return this.Direct(result);
        }
        public ActionResult GetOperation()
        {
            var records = _operation.GetAll().OrderBy(o => o.Name);
            var Items = records.Select(item => new
            {
                item.Id,
                Name = item.Name,
                item.WorkStationId,
                WorkStation = item.WorkStationId.HasValue ? item.PRWorkStation.Name : ""
            }).ToList();
            var result = new
            {
                total = Items.Count(),
                data = Items
            };
            return this.Direct(result);
        }
        public DirectResult GetJobCardOperation(object query)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0; var planNo = "";
            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start = int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            if (ht != null && ht["planNo"] != null)
                planNo = ht["planNo"].ToString();
            var records = _productionPlanJobCardDetail.GetAll().AsQueryable().Where(a => a.StatusId != voidVoucherStatus && a.PRProductionPlanHeader.VoucherNumber == planNo);
            if (quarystring != "")
                records = records.Where(o => o.PRProductionPlanHeader.VoucherNumber.ToUpper().StartsWith(quarystring.ToUpper()));
            var count = records.Count();
            records = records.OrderBy(o => o.Id).Skip(start).Take(limit);
            var Items = records.Select(item => new
            {
                item.Id,
                item.ProductionPlanHeaderId,
                Name = item.PROperation.Name
            }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Direct(result);

        }

        public DirectResult GetProductionPlanBySearch(object query)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0;
            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start = int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            var records = _productionPlanHeader.GetAll().AsQueryable().Where(a => a.StatusId != voidVoucherStatus);
            if (quarystring != "")
                records = records.Where(o =>
                    o.VoucherNumber.ToUpper().StartsWith(quarystring.ToUpper())
                    );
            var count = records.Count();
            records = records.OrderBy(o => o.Id).Skip(start).Take(limit);
            var Items = records.Select(item => new
            {
                item.Id,
                Name = item.VoucherNumber
            }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Direct(result);

        }

        public DirectResult GetProductionOrderBySearch(object query)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0;
            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start = int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            var records =_productionOrderHeader.GetAll().AsQueryable().Where(a => a.StatusId != voidVoucherStatus);
            if (quarystring != "")
                records = records.Where(o =>
                    o.VoucherNumber.ToUpper().StartsWith(quarystring.ToUpper())
                    );
            var count = records.Count();
            records = records.OrderBy(o => o.Id).Skip(start).Take(limit);
            var Items = records.Select(item => new
            {
                item.Id,
                Name = item.VoucherNumber
            }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Direct(result);

        }
   
        public ActionResult GetUsers(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);

            var filtered = _users.GetAll();

            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);
            var users = filtered.Select(item => new
            {
                item.Id,
                item.FirstName,
                item.LastName,
                item.UserName,
                Role = ""
            }).Cast<object>().ToList();
            var result = new { total = count, data = users };
            return this.Direct(result);
        }
        public DirectResult GetUserBySearch(object query)
        {

            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0; long ItemId = 0;

            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start =int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());

            var filtered =_users.GetAll().AsQueryable();
            if (quarystring != "")
                filtered = filtered.Where(o => (o.FirstName+" "+o.LastName).ToUpper().StartsWith(quarystring.ToUpper()));
            else
                filtered = filtered.Where(o => o.Id == Guid.Empty);

            var count = filtered.Count();
            filtered = filtered.OrderBy(o=>o.Id).Skip(start).Take(limit);

            var Items = filtered.Select(item => new
            {
                item.Id,
                Name = item.FirstName + " " + item.LastName
               }).ToList();

            var result = new
            {
                total = count,
                data = Items
            };

            return this.Direct(result);

        }
        public DirectResult GetItemBySearch(object query)
        {

            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0; Guid storeId = Guid.Empty;

            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start =int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            if (ht != null && ht["storeId"] != null)
                storeId = Guid.Parse(ht["storeId"].ToString());

            var filtered = _item.GetAll().OrderBy(o => o.CreatedAt).AsQueryable().Where(a => a.IsActive == true);
            var fiscalYearId = _fiscalYear.GetAll().Where(o => o.IsActive == true && o.IsClosed == false).FirstOrDefault().Id;
          
            if (quarystring != "")
                filtered = filtered.Where(o => o.Name.ToUpper().Contains(quarystring.ToUpper()) ||
                     o.Code.ToUpper().Contains(quarystring.ToUpper()) ||
                  ( o.PartNumber!=null?  o.PartNumber.ToUpper().Contains(quarystring.ToUpper()):false)||
                     o.lupItemType.Name.ToUpper().StartsWith(quarystring.ToUpper())||
                     o.psmsItemCategory.Name.ToUpper().StartsWith(quarystring.ToUpper())
                    );
            else
                filtered = filtered.Where(o => o.Id == Guid.Empty);

            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);

            var Items = filtered.ToList().Select(item => new
            {
                item.Id,
                Name = item.Name,
                item.Code,
                item.PartNumber,
                ItemCategory=item.psmsItemCategory.Name,
                UnitId=item.MeasurementUnitId,
                MeasurementUnit=item.lupMeasurementUnit.Name,
                item.IsSerialItem,
                item.IsLOTItem,
                item.Weight,
                AvailableQuantity = item.psmsInventoryRecord.Any() ? item.psmsInventoryRecord.Where(o => o.IsClosed == false && o.StoreId == storeId && o.FiscalYearId == fiscalYearId).Select(f => f.AvailableQuantity).DefaultIfEmpty(0).Sum() : 0,
                UnitCost = item.psmsInventoryRecord.Any() ? item.psmsInventoryRecord.Where(o => o.IsClosed == false && o.StoreId == storeId && o.FiscalYearId == fiscalYearId).Select(f => f.UnitCost).DefaultIfEmpty(0).Sum() : 0,
                item.TaxRateIds,
                item.TaxRateDescription,
                TaxRate = getTaxRate(item.TaxRateIds),          
             
            }).ToList();

            var result = new
            {
                total = count,
                data = Items
            };

            return this.Direct(result);

        }
        public DirectResult GetItemCategoryBySearch(object query)
        {

            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0;

            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start =int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());

            var filtered =_itemCategory.GetAll().OrderBy(o => o.CreatedAt).AsQueryable();
            if (quarystring != "")
                filtered = filtered.Where(o => o.Name.ToUpper().StartsWith(quarystring.ToUpper()) ||
                  o.Code.ToUpper().StartsWith(quarystring.ToUpper())
                   );
            else
                filtered = filtered.Where(o => o.Id == Guid.Empty);

            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);

            var Items = filtered.Select(item => new
            {
                item.Id,
                Name = item.Name,
                item.Code,
                ParentItemCategory =item.ParentId.HasValue? item.psmsItemCategory2.Name:"",
               
            }).ToList();

            var result = new
            {
                total = count,
                data = Items
            };

            return this.Direct(result);

        }
   
        public DirectResult GetStoreBySearch(object query)
        {

            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0; 

            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start =int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());

            var filtered = _store.GetAll().OrderBy(o => o.CreatedAt).AsQueryable();
            if (quarystring != "")
                filtered = filtered.Where(o => o.Name.ToUpper().StartsWith(quarystring.ToUpper()) ||
                     o.lupStoreType.Name.ToUpper().StartsWith(quarystring.ToUpper()) ||
                     o.Code.ToUpper().StartsWith(quarystring.ToUpper()));
            else
                filtered = filtered.Where(o => o.Id == Guid.Empty);

            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);

            var Items = filtered.Select(item => new
            {
                item.Id,
                Name = item.Name ,
                item.Address
            }).ToList();

            var result = new
            {
                total = count,
                data = Items
            };

            return this.Direct(result);

        }
        public DirectResult GetRoles(object query)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0; 
            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start =int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            var records = _role.GetAll().AsQueryable();
            if (quarystring != "")
                records = records.Where(o => o.Name.ToUpper().StartsWith(quarystring.ToUpper()) );
            var count = records.Count();
            records = records.OrderBy(o => o.CreatedAt).Skip(start).Take(limit);
            var Items = records.Select(item => new
            {
                item.Id,
                item.Name
            }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Direct(result);

        }
        public DirectResult GetEmployeeBySearch(object query)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0;
            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start =int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            var records =_user.GetAll().AsQueryable();
            if (quarystring != "")
                records = records.Where(o => 
                    (o.FirstName+" "+o.LastName).ToUpper().StartsWith(quarystring.ToUpper())||
                    o.LastName.ToUpper().StartsWith(quarystring.ToUpper())
                    );
            var count = records.Count();
            records = records.OrderBy(o => o.CreatedAt).Skip(start).Take(limit);
            var Items = records.Select(item => new
            {
                item.Id,
                Name=item.FirstName+" "+item.LastName
            }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Direct(result);

        }
        public DirectResult GetSupplierBySearch(object query)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0; 
            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start =int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            var records =_supplier.GetAll().AsQueryable();
            if (quarystring != "")
                records = records.Where(o =>
                    o.Name.ToUpper().StartsWith(quarystring.ToUpper()) ||
                    o.Code.ToUpper().StartsWith(quarystring.ToUpper()) ||
                    o.TIN.ToUpper().StartsWith(quarystring.ToUpper()) ||
                    o.Telephone.ToUpper().StartsWith(quarystring.ToUpper()) ||
                    o.Code.ToUpper().StartsWith(quarystring.ToUpper()) ||
                    o.lupSupplierCategory.Name.ToUpper().StartsWith(quarystring.ToUpper())
                    );
            var count = records.Count();
            records = records.OrderBy(o => o.CreatedAt).Skip(start).Take(limit);
            var Items = records.ToList().Select(item => new
            {
                item.Id,
                Name = item.Name,
                item.Code,
                TaxRateDescription = item.TaxRateDescription,
                TaxRateIds = item.TaxRateIds,
                TaxRate = getTaxRateWithCode(item.TaxRateIds),       
                item.PurchaseModality
            }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Direct(result);

        }
        public DirectResult GetStoreRequisitioinBySearch(object query)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0;
            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start =int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            var records = _storeRequisitionHeader.GetAll().AsQueryable().Where(o => o.StatusId == approvedVoucherStatus);
            if (quarystring != "")
                records = records.Where(o =>
                    o.VoucherNumber.ToUpper().StartsWith(quarystring.ToUpper()) ||
                    o.lupConsumerType.Name.ToUpper().StartsWith(quarystring.ToUpper())
                    );
            var count = records.Count();
            records = records.OrderBy(o => o.CreatedAt).Skip(start).Take(limit);
            var Items = records.Select(item => new
            {
                item.Id,
                Name = item.VoucherNumber,
                item.StoreId,
                Store = item.psmsStore.Name
            }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Direct(result);

        }  
        public DirectResult GetPurchaseRequestBySearch(object query)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0;
            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start =int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());

            var records = _purchaseRequestHeader.GetAll().AsQueryable().Where(o => o.StatusId == approvedVoucherStatus && o.psmsPurchaseRequestDetail.Where(f => f.UnprocessedQuantity > 0).Any());
            if (quarystring != "")
                records = records.Where(o =>
                    o.VoucherNumber.ToUpper().StartsWith(quarystring.ToUpper())
                    );
            var count = records.Count();
            records = records.OrderBy(o => o.CreatedAt).Skip(start).Take(limit);
            var Items = records.Select(item => new
            {
                item.Id,
                Name = item.VoucherNumber,
                item.StoreId,
                Store = item.psmsStore.Name
            }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Direct(result);

        }    
        public DirectResult GetIssueBySearch(object query)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0;
            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start =int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            var records =_issueHeader.GetAll().AsQueryable().Where(o => o.StatusId == approvedVoucherStatus);
            if (quarystring != "")
                records = records.Where(o =>
                    o.VoucherNumber.ToUpper().StartsWith(quarystring.ToUpper())
                    );
            var count = records.Count();
            records = records.OrderBy(o => o.CreatedAt).Skip(start).Take(limit);
            var Items = records.Select(item => new
            {
                item.Id,
                Name = item.VoucherNumber,
                item.StoreId,
                Store = item.psmsStore.Name,

                ConsumerTypeId = item.psmsRequestOrderHeader.StoreRequisitionHeaderId.HasValue ? item.psmsRequestOrderHeader.psmsStoreRequisitionHeader.ConsumerTypeId: Guid.Empty,
                ConsumerType = item.psmsRequestOrderHeader.StoreRequisitionHeaderId.HasValue ? item.psmsRequestOrderHeader.psmsStoreRequisitionHeader.lupConsumerType.Name : "",
                ConsumerEmployeeId = item.psmsRequestOrderHeader.StoreRequisitionHeaderId.HasValue ? item.psmsRequestOrderHeader.psmsStoreRequisitionHeader.ConsumerEmployeeId :Guid.Empty,            
                ConsumerEmployee = item.psmsRequestOrderHeader.StoreRequisitionHeaderId.HasValue ? item.psmsRequestOrderHeader.psmsStoreRequisitionHeader.coreUser.FirstName + " " + item.psmsRequestOrderHeader.psmsStoreRequisitionHeader.coreUser.LastName :"",
             
                ConsumerStoreId = item.psmsRequestOrderHeader.StoreRequisitionHeaderId.HasValue ? item.psmsRequestOrderHeader.psmsStoreRequisitionHeader.ConsumerStoreId: Guid.Empty,
                ConsumerStore = item.psmsRequestOrderHeader.StoreRequisitionHeaderId.HasValue ? item.psmsRequestOrderHeader.psmsStoreRequisitionHeader.psmsStore1.Name : "",
                ConsumerUnitId = item.psmsRequestOrderHeader.StoreRequisitionHeaderId.HasValue ? item.psmsRequestOrderHeader.psmsStoreRequisitionHeader.ConsumerUnitId: Guid.Empty,
                ConsumerUnit = item.psmsRequestOrderHeader.StoreRequisitionHeaderId.HasValue ? item.psmsRequestOrderHeader.psmsStoreRequisitionHeader.coreUnit.Name : "",
              
                
               
   


            }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Direct(result);

        }
        public DirectResult GetTransferIssueBySearch(object query)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0;
            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start =int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            var records = _transferIssueHeader.GetAll().AsQueryable().Where(o => o.StatusId == approvedVoucherStatus);
            if (quarystring != "")
                records = records.Where(o =>
                    o.VoucherNumber.ToUpper().StartsWith(quarystring.ToUpper())
                    );
            var count = records.Count();
            records = records.OrderBy(o => o.CreatedAt).Skip(start).Take(limit);
            var Items = records.Select(item => new
            {
                item.Id,
                Name = item.VoucherNumber,
                StoreId=item.FromStoreId,
                Store = item.psmsStore.Name
            }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Direct(result);

        }
        public DirectResult GetPurchaseOrderBySearch(object query)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0;
            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start =int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            var records = _purchaseOrderHeader.GetAll().AsQueryable().Where(o => o.StatusId == approvedVoucherStatus && o.psmsPurchaseOrderDetail.Where(f => f.RemainingQuantity > 0).Any());
            if (quarystring != "")
                records = records.Where(o =>
                    o.VoucherNumber.ToUpper().StartsWith(quarystring.ToUpper()) ||
                    o.lupPurchaseOrderType.Name.ToUpper().StartsWith(quarystring.ToUpper()) ||
                     (o.PurchaseRequestHeaderId.HasValue ? o.psmsPurchaseRequestHeader.VoucherNumber.ToUpper().StartsWith(quarystring.ToUpper()) : false)  ||

                    o.psmsSupplier.Name.ToUpper().StartsWith(quarystring.ToUpper())
                    );
            var count = records.Count();
            records = records.OrderBy(o => o.CreatedAt).Skip(start).Take(limit);
            var Items = records.ToList().Select(item => new
            {
                item.Id,
                Name = item.VoucherNumber + "-" + item.Version + " " + (item.PurchaseRequestHeaderId.HasValue ? item.psmsPurchaseRequestHeader.VoucherNumber : ""),
                item.StoreId,
                Store = item.psmsStore.Name,
                Supplier = item.psmsSupplier.Name,
                SupplierId = item.SupplierId,
                TaxRateIds = item.TaxRateIds,
                TaxRate = getTaxRate(item.TaxRateIds),
                TaxRateDescription = item.TaxRateDescription,
                TotalSummarry = item.TotalSummarry,
                PRNo = item.PurchaseRequestHeaderId.HasValue ? item.psmsPurchaseRequestHeader.VoucherNumber :"",
             
            }).ToList().Select(item => new
            {
                item.Id,
                Name = item.Name,
                item.StoreId,
                Store = item.Store,
                Supplier = item.Supplier,
                SupplierId = item.SupplierId,
                TaxRateIds = item.TaxRateIds,
                TaxRate = getTaxRate(item.TaxRateIds),
                TaxRateDescription = item.TaxRateDescription,
                TotalSummarry = item.TotalSummarry,
                PRNo = item.PRNo
            }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Direct(result);

        }
        public DirectResult GetLocationBySearch(object query)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0; Guid storeId = Guid.Empty;
            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start =int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            if (ht != null && ht["storeId"] != null)
                storeId = Guid.Parse(ht["storeId"].ToString());

            var records = _storeLocation.GetAll().AsQueryable().Where(o => o.StoreId == storeId);
            if (quarystring != "")
                records = records.Where(o =>
                    o.Name.ToUpper().StartsWith(quarystring.ToUpper())
                    );
            var count = records.Count();
            records = records.OrderBy(o => o.CreatedAt);
            if (limit > 0)
                records = records.Skip(start).Take(limit);

            var Items = records.Select(item => new
            {
                item.Id,
                Name = item.Name,
            }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Direct(result);

        }
        public DirectResult GetItemLocationBySearch(object query)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0; Guid storeId = Guid.Empty; Guid itemId = Guid.Empty; Guid locationId = Guid.Empty;
            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start =int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            if (ht != null && ht["storeId"] != null)
                storeId = Guid.Parse(ht["storeId"].ToString());
            if (ht != null && ht["itemId"] != null)
                itemId = Guid.Parse(ht["itemId"].ToString());
            if (ht != null && ht["locationId"] != null)
                locationId = Guid.Parse(ht["locationId"].ToString());

            var records = _itemLocation.GetAll().AsQueryable().Where(o => o.StoreId == storeId && o.LocationId == locationId && o.ItemId == itemId);
            if (quarystring != "")
                records = records.Where(o =>
                    o.psmsStoreLocationBin.Name.ToUpper().StartsWith(quarystring.ToUpper())
                    );
            var count = records.Count();
            records = records.OrderBy(o => o.CreatedAt);
            if (limit > 0)
                records = records.Skip(start).Take(limit);
            var Items = records.Select(item => new
            {
                item.Id,
                Name = item.LocationBinId.HasValue ? item.psmsStoreLocationBin.Name : item.psmsStoreLocation.Name,
                item.Quantity,
            }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Direct(result);

        }
        public DirectResult GetFrieghtOrderBySearch(object query)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0;
            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start = int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            var records = _freightOrder.GetAll().AsQueryable().Where(o => o.psmsPurchaseOrderATCDetail.IsDelivered == false).AsEnumerable();
            if (quarystring != "")
                records = records.Where(o =>
                    o.ATC.ToString().ToUpper().StartsWith(quarystring.ToUpper()) ||
                    o.VoucherNumber.ToString().ToUpper().StartsWith(quarystring.ToUpper())
                    );
            var count = records.Count();
            records = records.OrderBy(o => o.Id).Skip(start).Take(limit);
            var Items = records.Select(item => new
            {
                item.Id,
                Name = item.VoucherNumber,
                Code = item.ATC,
                item.ATC,
                item.Quantity,
                item.UnitId,
                item.ItemId,
                Item = item.ItemId.HasValue ? item.psmsItem.Name : "",
                Unit = item.lupMeasurementUnit.Name,
                item.SupplierId,
                Supplier = item.psmsSupplier.Name,
                item.CustomerId,
                Customer = item.CustomerId.HasValue ? item.slmsCustomer.Name : "",
                item.InvoiceNo,

            }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Direct(result);

        }

        public DirectResult GetAllFrieghtOrderBySearch(object query)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0;
            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start = int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            var records = _freightOrder.GetAll().AsQueryable().AsEnumerable();
            if (quarystring != "")
                records = records.Where(o =>
                    o.ATC.ToString().ToUpper().StartsWith(quarystring.ToUpper()) ||
                    o.VoucherNumber.ToString().ToUpper().StartsWith(quarystring.ToUpper())
                    );
            var count = records.Count();
            records = records.OrderBy(o => o.Id).Skip(start).Take(limit);
            var Items = records.Select(item => new
            {
                item.Id,
                Name = item.VoucherNumber,
                Code = item.ATC,
                item.ATC,
                item.Quantity,
                item.UnitId,
                item.ItemId,
                Item = item.ItemId.HasValue ? item.psmsItem.Name : "",
                Unit = item.lupMeasurementUnit.Name,
                item.SupplierId,
                Supplier = item.psmsSupplier.Name,
                item.CustomerId,
                Customer = item.CustomerId.HasValue ? item.slmsCustomer.Name : "",
                item.InvoiceNo,

            }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Direct(result);

        }
        public DirectResult GetATCBySearch(object query)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0;
            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start = int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            var records = _atc.GetAll().AsQueryable().Where(o => o.IsDelivered == false).AsEnumerable();
            if (quarystring != "")
                records = records.Where(o =>
                    o.ATC.ToString().ToUpper().StartsWith(quarystring.ToUpper())
                    );
            var count = records.Count();
            records = records.OrderBy(o => o.Id).Skip(start).Take(limit);
            var Items = records.Select(item => new
            {
                item.Id,
                Name = item.ATC,
                item.Quantity,
                item.psmsPurchaseOrderDetail.ItemId,
                Item = item.psmsPurchaseOrderDetail.psmsItem.Name,
                item.psmsPurchaseOrderDetail.UnitId,
                Unit = item.psmsPurchaseOrderDetail.lupMeasurementUnit.Name,
                item.psmsPurchaseOrderDetail.psmsPurchaseOrderHeader.SupplierId,
                Supplier = item.psmsPurchaseOrderDetail.psmsPurchaseOrderHeader.psmsSupplier.Name,

            }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Direct(result);

        }

        public DirectResult GetSalesOrderBySearch(object query)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0; Guid customerId = Guid.Empty;
            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start =int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            if (ht != null && ht["customerId"] != null)
                customerId = Guid.Parse(ht["customerId"].ToString());
          
            var LastWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == salesOrderVoucherType).OrderByDescending(o => o.Step).FirstOrDefault();
            var lastVoucherId = LastWorkFlow != null ? LastWorkFlow.VoucherStatusId : Guid.Empty;

            var records = _salesHeader.GetAll().AsQueryable().Where(o =>lastVoucherId==Guid.Empty?true: o.StatusId == lastVoucherId);
            if (quarystring != "")
                records = records.Where(o =>
                    o.slmsCustomer.Name.ToUpper().StartsWith(quarystring.ToUpper())||
                     o.VoucherNumber.ToUpper().StartsWith(quarystring.ToUpper())
                    );
            if (customerId != Guid.Empty)
            {
                records = records.Where(a => a.CustomerId == customerId);
            }
            var count = records.Count();
            records = records.OrderBy(o => o.CreatedAt);
            if (limit > 0)
                records = records.Skip(start).Take(limit);
            var Items = records.Select(item => new
            {
                item.Id,
                item.SalesAreaId,
                SalesArea=item.slmsSalesArea.Name,
                item.slmsSalesArea.StoreId,
                item.VoucherNumber,
                Name = item.VoucherNumber+" "+item.slmsCustomer.Name,
                item.CustomerId,
                Customer=item.slmsCustomer.Name,
                Address = item.slmsCustomer.Address,
            }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Direct(result);

        }
        public DirectResult GetSalesItemBySearch(object query)
        {

            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0; Guid priceCategoryId = Guid.Empty; string priceGroup = "";

            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start = int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            if (ht != null && ht["priceCategoryId"] != null && ht["priceCategoryId"] != "")
                priceCategoryId = Guid.Parse(ht["priceCategoryId"].ToString());
            if (ht != null && ht["priceGroup"] != null && ht["priceGroup"] != "")
                priceGroup = ht["priceGroup"].ToString();

            var objPriceGroupSetting = _setting.Find(o => o.Name == Constants.priceGroup_setting_Name);
            var defaultPriceGroup = priceGroup != "" ? priceGroup : objPriceGroupSetting != null ? objPriceGroupSetting.Value : "";
            var filtered = _item.GetAll().AsQueryable().Where(o => o.IsActive == true);
            if (quarystring != "")
                filtered = filtered.Where(o => o.Name.ToUpper().StartsWith(quarystring.ToUpper()) ||
                     o.Code.ToUpper().StartsWith(quarystring.ToUpper()) ||
                  (o.PartNumber != null ? o.PartNumber.ToUpper().StartsWith(quarystring.ToUpper()) : false) ||
                  (o.lupItemType.Name.ToUpper().StartsWith(quarystring.ToUpper())) ||
                  (o.psmsItemCategory.Name.ToUpper().StartsWith(quarystring.ToUpper()))
                    );
            else
                filtered = filtered.Where(o => o.Id == Guid.Empty);

            var count = filtered.Count();
            filtered = filtered.OrderBy(o => o.Id);
            filtered = filtered.Skip(start).Take(limit);

            var Items = filtered.Select(item => new
            {
                item.Id,
                Name = item.Name,
                item.Code,
                ItemCategory = item.psmsItemCategory.Name,
                UnitId = item.MeasurementUnitId,
                MeasurementUnit = item.lupMeasurementUnit.Name,
                item.IsSerialItem,
                item.IsLOTItem,
                PriceGroupId = item.slmsItemPrice.Where(o =>  o.PriceCategoryId == priceCategoryId && o.lupPriceGroup.Name == defaultPriceGroup).Any() ? item.slmsItemPrice.Where(o => o.PriceCategoryId == priceCategoryId && o.lupPriceGroup.Name == defaultPriceGroup).FirstOrDefault().PriceGroupId : Guid.Empty,
                IsTaxable = item.slmsItemPrice.Where(o => o.PriceCategoryId == priceCategoryId && o.lupPriceGroup.Name == defaultPriceGroup).Any() ? item.slmsItemPrice.Where(o =>  o.PriceCategoryId == priceCategoryId && o.lupPriceGroup.Name == defaultPriceGroup).FirstOrDefault().IsTaxable : true,
                UnitPrice = item.slmsItemPrice.Where(o => o.PriceCategoryId == priceCategoryId && o.lupPriceGroup.Name == defaultPriceGroup).Any() ? item.slmsItemPrice.Where(o => o.PriceCategoryId == priceCategoryId && o.lupPriceGroup.Name == defaultPriceGroup).FirstOrDefault().UnitPrice : 0,
                WithHoldingTax = item.slmsItemPrice.Where(o => o.PriceCategoryId == priceCategoryId && o.lupPriceGroup.Name == defaultPriceGroup).Any() ? item.slmsItemPrice.Where(o => o.PriceCategoryId == priceCategoryId && o.lupPriceGroup.Name == defaultPriceGroup).FirstOrDefault().WithHoldingTax : 0,
          
                PriceGroup = defaultPriceGroup,
            }).ToList();

            var result = new
            {
                total = count,
                data = Items
            };

            return this.Direct(result);

        }
        public DirectResult GetItemPriceByPriceGroup(Guid? itemId, Guid priceGroupId, Guid priceCategoryId)
        {

            var records = _itemPrice.GetAll().AsQueryable().Where(o =>  o.PriceCategoryId == priceCategoryId && o.ItemId == itemId && o.PriceGroupId == priceGroupId).FirstOrDefault();

            var result = new
            {
                total = 0,
                data = records != null ? records.UnitPrice : 0,
                WithHoldingTax = records != null ? records.WithHoldingTax : 0,
                IsTaxable = records != null ? records.IsTaxable : true
            };
            return this.Direct(result);

        }

        public DirectResult GetItemPriceByByQuantity(Guid? itemId, Guid priceCategoryId, Guid priceGroupId, decimal quantity)
        {

            var records = _itemPrice.GetAll().AsQueryable().Where(o => o.PriceCategoryId == priceCategoryId && o.ItemId == itemId && o.lupPriceGroup.Name == "Discount" ).FirstOrDefault();
            if (records == null)
            {
                records = _itemPrice.GetAll().AsQueryable().Where(o =>  o.PriceCategoryId == priceCategoryId && o.ItemId == itemId && o.PriceGroupId == priceGroupId).FirstOrDefault();
            }
            var result = new
            {
                total = 0,
                data = records != null ? records.UnitPrice : 0,
                IsTaxable = records != null ? records.IsTaxable : true
            };
            return this.Direct(result);

        }
        public DirectResult GetItemPriceBySearch(object query)
        {

            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0; Guid itemId = Guid.Empty; Guid priceCategoryId = Guid.Empty; Guid priceGroupId = Guid.Empty;

            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start = int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            if (ht != null && ht["itemId"] != null)
                itemId = Guid.Parse(ht["itemId"].ToString());

            if (ht != null && ht["priceCategoryId"] != null)
                priceCategoryId = Guid.Parse(ht["priceCategoryId"].ToString());
            if (ht != null && ht["priceGroupId"] != null)
                priceGroupId = Guid.Parse(ht["priceGroupId"].ToString());
            var filtered = _itemPrice.GetAll().AsQueryable().Where(o =>  o.ItemId == itemId && o.PriceCategoryId == priceCategoryId && o.PriceGroupId == priceGroupId);
            var count = filtered.Count();
            filtered = filtered.OrderBy(o => o.Id);
            filtered = filtered.Skip(start).Take(limit);

            var Items = filtered.Select(item => new
            {
                item.Id,
                Name = item.UnitPrice + " " + item.Remark,
                item.UnitPrice,
                UnitId = item.UnitId,
                Unit = item.lupMeasurementUnit.Name,
                item.IsTaxable
            }).ToList();

            var result = new
            {
                total = count,
                data = Items
            };

            return this.Direct(result);

        }

        public DirectResult GetProformaBySearch(object query)
        {

            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0;

            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start = int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            var filtered = _proformaHeader.GetAll().AsQueryable().Where(o => o.StatusId == approvedVoucherStatus && o.slmsProformaDetail.Where(f => f.RemainingQuantity > 0).Any());
            if (quarystring != "")
                filtered = filtered.Where(o => o.VoucherNumber.ToUpper().StartsWith(quarystring.ToUpper()) ||
                     o.slmsCustomer.Name.ToUpper().StartsWith(quarystring.ToUpper())
                    );
            else
                filtered = filtered.Where(o => o.Id == Guid.Empty);

            var count = filtered.Count();
            filtered = filtered.OrderBy(o => o.Id);
            filtered = filtered.Skip(start).Take(limit);

            var Items = filtered.Select(item => new
            {
                item.Id,
                Name = item.VoucherNumber,
                item.SalesAreaId,
                SalesArea = item.slmsSalesArea.Name,
                item.CustomerId,
                Customer = item.slmsCustomer.Name,
                Address = item.slmsCustomer.Address,
                item.slmsSalesArea.StoreId,
                item.PriceCategoryId,
                item.ApplyWithHolding,
                PriceCategory = item.PriceCategoryId.HasValue ? item.slmsPriceCategory.Name : "",
                PriceCategoryRemark = item.PriceCategoryId.HasValue ? item.slmsPriceCategory.Remark : "",
                Comment = item.PaymentTerm + "\n" + item.DeliveryCondition
            }).ToList();

            var result = new
            {
                total = count,
                data = Items
            };

            return this.Direct(result);

        }
    
        public DirectResult GetCustomerBySearch(object query)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0;
            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start =int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
          
            var records =_customer.GetAll().AsQueryable();
            if (quarystring != "")
                records = records.Where(o =>
                    o.Name.ToUpper().StartsWith(quarystring.ToUpper()) ||
                    o.TinNumber.ToUpper().StartsWith(quarystring.ToUpper()) ||
                    o.Telephone.ToUpper().StartsWith(quarystring.ToUpper()) ||
                    o.Code.ToUpper().StartsWith(quarystring.ToUpper())
                    );
            var count = records.Count();
            records = records.OrderBy(o => o.CreatedAt);
            if (limit > 0)
                records = records.Skip(start).Take(limit);
            var Items = records.Select(item => new
            {
                item.Id,
                 Name = item.Name
                        }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Direct(result);

        }   
        public DirectResult GetStoreLocation(Guid storeId)
        {

            var records = _storeLocation.GetAll().AsQueryable().Where(o => o.StoreId == storeId).OrderBy(o => o.CreatedAt);
            var Items = records.Select(item => new
            {
                item.Id,
                item.Name
            }).ToList();
            var result = new
            {
                total = 0,
                data = Items
            };
            return this.Direct(result);

        }
        public DirectResult GetStore()
        {

            var records = _store.GetAll().AsQueryable().OrderBy(o => o.CreatedAt);
            var Items = records.Select(item => new
            {
                item.Id,
                item.Name
            }).ToList();
            var result = new
            {
                total = 0,
                data = Items
            };
            return this.Direct(result);

        }
        public DirectResult GetUnit()
        {

            var records =_unit.GetAll().AsQueryable().OrderBy(o => o.CreatedAt);
            var Items = records.Select(item => new
            {
                item.Id,
                item.Name
            }).ToList();
            var result = new
            {
                total = 0,
                data = Items
            };
            return this.Direct(result);

        }
        public DirectResult GetStoreLocationBin(Guid locationId)
        {

            var records = _storeLocationBin.GetAll().AsQueryable().Where(o => o.StoreLocationId == locationId).OrderBy(o => o.CreatedAt);
            var Items = records.Select(item => new
            {
                item.Id,
                item.Name
            }).ToList();
            var result = new
            {
                total = 0,
                data = Items
            };
            return this.Direct(result);

        }   
        public DirectResult GetItemSerialBySearch(object query)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0; Guid itemId = Guid.Empty;
            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start =int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            if (ht != null && ht["itemId"] != null)
                itemId = Guid.Parse(ht["itemId"].ToString());

            var records = _itemSerial.GetAll().AsQueryable().Where(o => o.ItemId == itemId);
            if (quarystring != "")
                records = records.Where(o =>
                    o.Number.ToUpper().StartsWith(quarystring.ToUpper()) ||
                    o.GRNNumber.ToUpper().StartsWith(quarystring.ToUpper())
                    );
            var count = records.Count();
            records = records.OrderBy(o => o.CreatedAt).Skip(start).Take(limit);
            var Items = records.Select(item => new
            {
                item.Id,
                Name = item.Number,
            }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Direct(result);

        }
        public DirectResult GetFiscalYear()
        {
            
            var records =_fiscalYear .GetAll().AsQueryable().OrderBy(o=>o.Id);
              var Items = records.Select(item => new
            {
                item.Id,
                item.Name
            }).ToList();
            var result = new
            {
                total = 0,
                data = Items
            };
            return this.Direct(result);

        }
        public DirectResult GetItemCategory()
        {

            var records =_itemCategory.GetAll().AsQueryable().OrderBy(o => o.CreatedAt);
            var Items = records.Select(item => new
            {
                item.Id,
                item.Name
            }).ToList();
            var result = new
            {
                total = 0,
                data = Items
            };
            return this.Direct(result);

        }
        public DirectResult GetTaxRate()
        {

            var records =_taxRate.GetAll().AsQueryable().OrderBy(o => o.CreatedAt);
            var Items = records.Select(item => new
            {
                item.Id,
                item.Name,
                item.Rate
            }).ToList();
            var result = new
            {
                total = 0,
                data = Items
            };
            return this.Direct(result);

        }
        public DirectResult GetVoucherType()
        {

            var records =_voucherType.GetAll().AsQueryable().OrderBy(o => o.CreatedAt);
            var Items = records.Select(item => new
            {
                item.Id,
                Description = item.Name + " " + item.Description,
                Name = item.Name + " " + item.Description
             }).ToList();
            var result = new
            {
                total = 0,
                data = Items
            };
            return this.Direct(result);

        }
        public ActionResult GetPagedItemBalance(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid itemId = Guid.Empty;
            Guid.TryParse(hashtable["itemId"].ToString(), out itemId);

            var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
            var fiscalYearId = _fiscalYear.GetAll().Where(o => o.IsActive == true && o.IsClosed == false).FirstOrDefault().Id;

            var filtered = _inventoryRecord.GetAll().AsQueryable().Where(o => o.IsClosed == false && o.FiscalYearId == fiscalYearId);
            if (itemId != Guid.Empty)
            {
                filtered = filtered.Where(o => o.ItemId == itemId);
            }
            filtered = searchText != "" ? filtered.Where(s =>

                s.psmsStore.Name.ToUpper().StartsWith(searchText.ToUpper())) : filtered;
            switch (sort)
            {

                case "Store":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsStore.Name) : filtered.OrderByDescending(u => u.psmsStore.Name);
                    break;

                default:
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                    break;

            }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);

            var items = filtered.ToList().Select(item => new
            {
                item.Id,
                Store = item.psmsStore.Name,
                item.AvailableQuantity,
                item.CommittedQuantity,
                item.OrderedQuantity,
            }).ToList();

            var result = new
            {
                total = count,
                data = items
            };
            return this.Direct(result);
        }
        public ActionResult GetPagedSalesItem(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid priceCategoryId = Guid.Empty;
            Guid priceGroupId = Guid.Empty;
            Guid itemTypeId = Guid.Empty;
            if (hashtable["priceCategoryId"] != null)
                Guid.TryParse(hashtable["priceCategoryId"].ToString(), out priceCategoryId);
            if (hashtable["priceGroupId"] != null)
                Guid.TryParse(hashtable["priceGroupId"].ToString(), out priceGroupId);

            var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
            var objPriceGroupSetting = _setting.Find(o => o.Name == Constants.priceGroup_setting_Name);
            var defaultPriceGroup = objPriceGroupSetting != null ? objPriceGroupSetting.Value : "";
            var defaultPurchaseName = ""; var setting = _setting.Find(o => o.Name == Constants.default_PurchasePrice);
            if (setting != null) defaultPurchaseName = setting.Value;
            var filtered = _item.GetAll().AsQueryable().Where(o => o.IsActive == true);
            filtered = searchText != "" ? filtered.Where(s =>

                s.Code.ToUpper().Contains(searchText.ToUpper()) ||
                s.Name.ToUpper().Contains(searchText.ToUpper()) ||
                s.psmsItemCategory.Name.ToUpper().Contains(searchText.ToUpper()) ||
                s.Supplier.ToUpper().StartsWith(searchText.ToUpper()) ||
                s.lupItemType.Name.ToUpper().Contains(searchText.ToUpper()) ||
               (s.PartNumber != null ? s.PartNumber.ToUpper().Contains(searchText.ToUpper()) : false) ||
                s.lupMeasurementUnit.Name.ToUpper().StartsWith(searchText.ToUpper())) : filtered;
            switch (sort)
            {
                case "Id":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Id) : filtered.OrderByDescending(u => u.Id);
                    break;

                case "Name":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Name) : filtered.OrderByDescending(u => u.Name);
                    break;
                case "Code":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Code) : filtered.OrderByDescending(u => u.Code);
                    break;
                case "PartNumber":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.PartNumber) : filtered.OrderByDescending(u => u.PartNumber);
                    break;

                case "Type":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.lupItemType.Name) : filtered.OrderByDescending(u => u.lupItemType.Name);
                    break;
                case "ItemCategory":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsItemCategory.Name) : filtered.OrderByDescending(u => u.psmsItemCategory.Name);
                    break;
            }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);

            var items = filtered.Select(item => new
            {
                item.Id,
                item.Name,
                item.Code,
                item.PartNumber,
                item.MeasurementUnitId,
                item.IsSerialItem,
                item.IsLOTItem,
                UnitId = item.MeasurementUnitId,
                MeasurementUnit = item.lupMeasurementUnit.Name,
                ItemType = item.lupItemType.Name,
                ItemCategory = item.psmsItemCategory.Name,
                 ItemPrice = item.slmsItemPrice.Where(o => (priceGroupId != Guid.Empty ? o.PriceGroupId == priceGroupId : o.lupPriceGroup.Name == defaultPriceGroup) && o.PriceCategoryId == priceCategoryId).FirstOrDefault(),
            }).ToList().Select(item => new
            {
                item.Id,
                item.Name,
                item.Code,
                item.PartNumber,
                item.MeasurementUnitId,
                item.IsSerialItem,
                item.IsLOTItem,
                UnitId = item.MeasurementUnitId,
                item.MeasurementUnit,
                item.ItemType,
                item.ItemCategory,
                PriceGroupId = item.ItemPrice != null ? item.ItemPrice.PriceGroupId : Guid.Empty,
                UnitPrice = item.ItemPrice != null ? item.ItemPrice.UnitPrice : 0,
                PriceGroup = item.ItemPrice != null ? item.ItemPrice.lupPriceGroup.Name : defaultPriceGroup,
                IsTaxable = item.ItemPrice != null ? item.ItemPrice.IsTaxable : true,
                PriceCategoryId = item.ItemPrice != null ? item.ItemPrice.PriceCategoryId : Guid.Empty,
                PriceCategory = item.ItemPrice != null ? item.ItemPrice.slmsPriceCategory.Name : "",
                ItemPriceId = item.ItemPrice != null ? item.ItemPrice.Id : Guid.Empty,
                WithHoldingTax = item.ItemPrice != null ? item.ItemPrice.WithHoldingTax : 0,
             


            }).ToList();

            var result = new
            {
                total = count,
                data = items
            };
            return this.Direct(result);
        }
    
        public ActionResult GetPagedCreditSales(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid customerId = Guid.Empty;
            var isbiginning = hashtable["isbiginning"] != null ? hashtable["isbiginning"].ToString() : "";
            Guid.TryParse(hashtable["customerId"].ToString(), out customerId);

            var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";

            var salesfiltered = _salesHeader.GetAll().AsQueryable();
            var beginningFilter =_customerCredit.GetAll().AsQueryable();
            var creditSalesType = Guid.Parse(Constants.Voucher_Type_CreditSales);
            if (customerId != Guid.Empty)
            {
                salesfiltered = salesfiltered.Where(o => o.CustomerId == customerId && o.SalesTypeId == creditSalesType);
                beginningFilter = beginningFilter.Where(o => o.CustomerId == customerId);
            }
            var filtered = salesfiltered.Select(item => new
            {
                item.Id,
                CreditId = Guid.Empty,
                item.VoucherNumber,
                item.Date,
                SalesArea = item.slmsSalesArea.Name,
                item.NetPay,
                RemainingAmount = item.NetPay - item.slmsSettlementDetail.Select(a => a.SettledAmount).DefaultIfEmpty(0).Sum(),
                item.CreatedAt,
            }).Concat(
               beginningFilter.Select(item => new
               {
                   Id = Guid.Empty,
                   CreditId = item.Id,
                   VoucherNumber = item.Fs,
                   Date = item.Date.Value,
                   SalesArea = "",
                   NetPay = item.RemainingAmount.Value,
                   RemainingAmount = item.RemainingAmount.Value - item.slmsSettlementDetail.Select(a => a.SettledAmount).DefaultIfEmpty(0).Sum(),
                   item.CreatedAt
               })

               );

            filtered = searchText != "" ? filtered.Where(s =>
                s.VoucherNumber.ToUpper().StartsWith(searchText.ToUpper()) ) : filtered;
            switch (sort)
            {

                 case "VoucherNumber":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.VoucherNumber) : filtered.OrderByDescending(u => u.VoucherNumber);
                    break;
                case "SalesArea":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.SalesArea) : filtered.OrderByDescending(u => u.SalesArea);
                    break;
                case "NetPay":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.NetPay) : filtered.OrderByDescending(u => u.NetPay);
                    break;
                case "RemainingAmount":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.RemainingAmount) : filtered.OrderByDescending(u => u.RemainingAmount);
                    break;
                default:
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                    break;

            }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);

            var items = filtered.ToList().Select(item => new
            {
                item.Id,
                item.CreditId,
                item.VoucherNumber,
                item.Date,
                item.NetPay,
                RemainingAmount = item.RemainingAmount
            }).ToList().Where(a=>a.RemainingAmount>0);

            var result = new
            {
                total = count,
                data = items
            };
            return this.Direct(result);
        }

        public ActionResult GetPagedCreditPurchase(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid supplierId = Guid.Empty;
            var isbiginning = hashtable["isbiginning"] != null ? hashtable["isbiginning"].ToString() : "";
            Guid.TryParse(hashtable["supplierId"].ToString(), out supplierId);

            var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";

            var purchasefiltered =_purchaseOrderHeader.GetAll().AsQueryable();
            var beginningFilter =_supplierCredit.GetAll().AsQueryable();

            if (supplierId != Guid.Empty)
            {
                purchasefiltered = purchasefiltered.Where(o => o.SupplierId == supplierId && o.SalesType=="Credit");
                beginningFilter = beginningFilter.Where(o => o.SupplierId == supplierId);
            }
            var filtered = purchasefiltered.Select(item => new
            {
                item.Id,
                CreditId = Guid.Empty,
                item.VoucherNumber,
                Date=item.OrderedDate,
                SalesArea = item.psmsStore.Name,
                NetPay = item.Discount.Value,
               RemainingAmount = item.Discount.Value ,
               //- item.psmsSupplierSettlementDetail.Select(a => a.SettledAmount).DefaultIfEmpty(0).Sum(),
                item.CreatedAt,
            }).Concat(
               beginningFilter.Select(item => new
               {
                   Id = Guid.Empty,
                   CreditId = item.Id,
                   VoucherNumber = item.Fs,
                   Date = item.Date.Value,
                   SalesArea = "",
                   NetPay = item.RemainingAmount.Value,
                   RemainingAmount = item.RemainingAmount.Value - item.psmsSupplierSettlementDetail.Select(a => a.SettledAmount).DefaultIfEmpty(0).Sum(),
                   item.CreatedAt
               })

               );

            filtered = searchText != "" ? filtered.Where(s =>
                s.VoucherNumber.ToUpper().StartsWith(searchText.ToUpper())) : filtered;
            switch (sort)
            {

                case "VoucherNumber":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.VoucherNumber) : filtered.OrderByDescending(u => u.VoucherNumber);
                    break;
                case "SalesArea":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.SalesArea) : filtered.OrderByDescending(u => u.SalesArea);
                    break;
                case "NetPay":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.NetPay) : filtered.OrderByDescending(u => u.NetPay);
                    break;
                case "RemainingAmount":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.RemainingAmount) : filtered.OrderByDescending(u => u.RemainingAmount);
                    break;
                default:
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                    break;

            }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);

            var items = filtered.ToList().Select(item => new
            {
                item.Id,
                item.CreditId,
                item.VoucherNumber,
                item.Date,
                item.NetPay,
                RemainingAmount = item.RemainingAmount
            }).ToList().Where(a => a.RemainingAmount > 0);

            var result = new
            {
                total = count,
                data = items
            };
            return this.Direct(result);
        }
  
        public ActionResult GetPagedProductionItem(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid itemCategoryId =Guid.Empty;
            Guid itemTypeId = Guid.Empty;
            Guid.TryParse(hashtable["itemCategoryId"].ToString(), out itemCategoryId);
            Guid.TryParse(hashtable["itemTypeId"].ToString(), out itemTypeId);

            var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
            var filtered = _productionPlanDeliveryDetail.GetAll().AsQueryable().Where(o => o.RemainingQuantity > 0);

            filtered = searchText != "" ? filtered.Where(s =>

                s.PRProductionOrderDetail.psmsItem.Code.ToUpper().StartsWith(searchText.ToUpper()) ||
                s.PRProductionOrderDetail.psmsItem.Name.ToUpper().StartsWith(searchText.ToUpper()) ||
                s.PRProductionOrderDetail.psmsItem.psmsItemCategory.Name.ToUpper().StartsWith(searchText.ToUpper()) ||
                s.PRProductionOrderDetail.PRProductionOrderHeader.VoucherNumber.ToUpper().StartsWith(searchText.ToUpper()) ||
                s.PRProductionPlanDeliveryHeader.PRProductionPlanHeader.VoucherNumber.ToUpper().StartsWith(searchText.ToUpper()) ||
                (s.PRProductionPlanDeliveryHeader.coreUser.FirstName + " " + s.PRProductionPlanDeliveryHeader.coreUser.LastName).ToUpper().StartsWith(searchText.ToUpper())
                ) : filtered;
            switch (sort)
            {
                case "Id":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Id) : filtered.OrderByDescending(u => u.Id);
                    break;

                case "Name":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.PRProductionOrderDetail.psmsItem.Name) : filtered.OrderByDescending(u => u.PRProductionOrderDetail.psmsItem.Name);
                    break;
                case "Code":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.PRProductionOrderDetail.psmsItem.Code) : filtered.OrderByDescending(u => u.PRProductionOrderDetail.psmsItem.Code);
                    break;
                case "PRONO":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.PRProductionOrderDetail.PRProductionOrderHeader.VoucherNumber) : filtered.OrderByDescending(u => u.PRProductionOrderDetail.PRProductionOrderHeader.VoucherNumber);
                    break;
                case "PPNo":
                    filtered = dir == "ASC" ? filtered.OrderBy(item => item.PRProductionPlanDeliveryHeader.PRProductionPlanHeader.VoucherNumber + " " + item.PRProductionPlanDeliveryHeader.coreUser.FirstName + " " + item.PRProductionPlanDeliveryHeader.coreUser.LastName) : filtered.OrderByDescending(item => item.PRProductionPlanDeliveryHeader.PRProductionPlanHeader.VoucherNumber + " " + item.PRProductionPlanDeliveryHeader.coreUser.FirstName + " " + item.PRProductionPlanDeliveryHeader.coreUser.LastName);
                    break;


            }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);

            var items = filtered.Select(item => new
            {
                item.Quantity,
                ProductionDeliveryDetailId = item.Id,
                item.PRProductionOrderDetail.ItemId,
                item.PRProductionOrderDetail.psmsItem.Name,
                item.PRProductionOrderDetail.psmsItem.Code,
                item.PRProductionOrderDetail.psmsItem.MeasurementUnitId,
                UnitId = item.PRProductionOrderDetail.psmsItem.MeasurementUnitId,
                MeasurementUnit = item.PRProductionOrderDetail.psmsItem.lupMeasurementUnit.Name,
                ItemCategory = item.PRProductionOrderDetail.psmsItem.psmsItemCategory.Name,
                PRONO = item.PRProductionOrderDetail.PRProductionOrderHeader.VoucherNumber,
                PPNo = item.PRProductionPlanDeliveryHeader.PRProductionPlanHeader.VoucherNumber + " " + item.PRProductionPlanDeliveryHeader.coreUser.FirstName + " " + item.PRProductionPlanDeliveryHeader.coreUser.LastName,
                Assigned = item.PRProductionPlanDeliveryHeader.coreUser.FirstName + " " + item.PRProductionPlanDeliveryHeader.coreUser.LastName



            }).ToList();

            var result = new
            {
                total = count,
                data = items
            };
            return this.Direct(result);
        }
     
        public ActionResult GetPagedItem(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid itemCategoryId=Guid.Empty;
            Guid itemTypeId = Guid.Empty;
            Guid storeId = Guid.Empty;

            Guid.TryParse(hashtable["itemCategoryId"].ToString(), out itemCategoryId);
            Guid.TryParse(hashtable["itemTypeId"].ToString(), out itemTypeId);
            if (hashtable["storeId"]!=null)
            Guid.TryParse(hashtable["storeId"].ToString(), out storeId);
        
            var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";          
            var fiscalYearId = _fiscalYear.GetAll().Where(o => o.IsActive == true && o.IsClosed == false).FirstOrDefault().Id;        
            var filtered = _item.GetAll().AsQueryable().Where(a=>a.IsActive==true);
            if (itemCategoryId != Guid.Empty)
            {
                filtered = filtered.Where(o => o.ItemCategoryId == itemCategoryId);
            }
            if (itemTypeId != Guid.Empty)
            {
                filtered = filtered.Where(o => o.ItemTypeId == itemTypeId);
            }
            filtered = searchText != "" ? filtered.Where(s =>

                s.Code.ToUpper().Contains(searchText.ToUpper()) ||
                s.Name.ToUpper().Contains(searchText.ToUpper()) ||
                s.psmsItemCategory.Name.ToUpper().StartsWith(searchText.ToUpper()) ||
                s.lupItemType.Name.ToUpper().StartsWith(searchText.ToUpper()) ||
               (s.PartNumber != null ? s.PartNumber.ToUpper().Contains(searchText.ToUpper()) : false) ||
               (s.Supplier != null ? s.Supplier.ToUpper().StartsWith(searchText.ToUpper()) : false) ||
               (s.Brand != null ? s.Brand.ToUpper().StartsWith(searchText.ToUpper()) : false) ||
               (s.BarCode != null ? s.BarCode.ToUpper().StartsWith(searchText.ToUpper()) : false) ||
                s.lupMeasurementUnit.Name.ToUpper().StartsWith(searchText.ToUpper())) : filtered;
            switch (sort)
            {
               
                case "Name":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Name) : filtered.OrderByDescending(u => u.Name);
                    break;
                case "Code":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Code) : filtered.OrderByDescending(u => u.Code);
                    break;
                case "PartNumber":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.PartNumber) : filtered.OrderByDescending(u => u.PartNumber);
                    break;

                case "Type":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.lupItemType.Name) : filtered.OrderByDescending(u => u.lupItemType.Name);
                    break;
                case "ItemCategory":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsItemCategory.Name) : filtered.OrderByDescending(u => u.psmsItemCategory.Name);
                    break;
                default:
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                    break;
 
            }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);

            var items = filtered.ToList().Select(item => new
            {
                item.Id,
                item.Name,
                item.Code,
                item.PartNumber,
                item.MeasurementUnitId,
                item.IsSerialItem,
                item.IsLOTItem,
                item.IsActive,
                item.Weight,
                item.Brand,
                item.Supplier,
                UnitId=item.MeasurementUnitId,
                MeasurementUnit = item.lupMeasurementUnit.Name,
                ItemType = item.lupItemType.Name,
                ItemCategory = item.psmsItemCategory.Name,
                item.TaxRateIds,
                item.TaxRateDescription,
                TaxRate = getTaxRate(item.TaxRateIds),
                AvailableQuantity = item.psmsInventoryRecord.Any() ? item.psmsInventoryRecord.Where(o => o.IsClosed == false && o.StoreId == storeId && o.FiscalYearId == fiscalYearId).Select(f => f.AvailableQuantity).DefaultIfEmpty(0).Sum() : 0,
              
                item.CreatedAt
            }).ToList();

            var result = new
            {
                total = count,
                data = items
            };
            return this.Direct(result);
        }
        public ActionResult GetPagedStore(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
        
            var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
            var filtered =_store.GetAll().AsQueryable();
           
            filtered = searchText != "" ? filtered.Where(s =>

                s.Code.ToUpper().StartsWith(searchText.ToUpper()) ||
                s.Name.ToUpper().StartsWith(searchText.ToUpper()) ||
                s.psmsStore2.Name.ToUpper().StartsWith(searchText.ToUpper())) : filtered;
            switch (sort)
            {
             
                case "Name":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Name) : filtered.OrderByDescending(u => u.Name);
                    break;
                case "Code":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Code) : filtered.OrderByDescending(u => u.Code);
                    break;
                default:
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                    break;
 
             }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);

            var items = filtered.Select(item => new
            {
                item.Id,
                item.Name,
                item.Code
             }).ToList();

            var result = new
            {
                total = count,
                data = items
            };
            return this.Direct(result);
        }
        public DirectResult GetPagedItemQuantity(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid itemId = Guid.Empty;
            if (hashtable["itemId"] != null)
                Guid.TryParse(hashtable["itemId"].ToString(), out itemId);

            var fiscalYearId = _fiscalYear.GetAll().Where(o => o.IsActive == true && o.IsClosed == false).FirstOrDefault().Id;
            var filtered = _inventoryRecord.GetAll().AsQueryable().Where(i => i.IsClosed == false && i.ItemId == itemId && i.FiscalYearId == fiscalYearId);
            var count = filtered.Count();
            var quantities = filtered.Select(item => new
            {
                item.Id,
                item.ItemId,
                AvailableQuantity = item.AvailableQuantity,
                Store = item.psmsStore.Name
            }).ToList();
            var result = new { total = count, data = quantities };
            return this.Direct(result);
        }
        public ActionResult GetPagedTax(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
          
            var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
            var filtered =_taxRate.GetAll().AsQueryable();
          
            filtered = searchText != "" ? filtered.Where(s =>

                s.Code.ToUpper().StartsWith(searchText.ToUpper()) ||
                s.Name.ToUpper().StartsWith(searchText.ToUpper())) : filtered;
            switch (sort)
            {
               
                case "Name":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Name) : filtered.OrderByDescending(u => u.Name);
                    break;
                case "Code":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Code) : filtered.OrderByDescending(u => u.Code);
                    break;
                case "Rate":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Rate) : filtered.OrderByDescending(u => u.Rate);
                    break;
                default:
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                    break;
 

             }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);

            var items = filtered.Select(item => new
            {
                item.Id,
                item.Name,
                item.Code,
                item.Rate,
                item.IsAddition,
                item.IsTaxable,
            }).ToList();

            var result = new
            {
                total = count,
                data = items
            };
            return this.Direct(result);
        }  
        public ActionResult PopulateUnitTree(string nodeId)
        {
            Guid selectedNodeId;
            Guid.TryParse(nodeId, out selectedNodeId);
            var units = selectedNodeId == Guid.Empty
                            ? _unit.GetAll().AsQueryable().Where(u => u.ParentId == null)
                            : _unit.GetAll().AsQueryable().Where(u => u.ParentId == selectedNodeId);
            var filtered = new ArrayList();
            foreach (var unit in units)
            {
                filtered.Add(new
                {
                    id = unit.Id,
                    text = unit.Name,
                    href = string.Empty,
                    unitTypeId = unit.TypeId
                });
            }
            return this.Direct(filtered.ToArray());
        }
     

        private string getTaxRate(string taxRateIds)
        {
            var taxRate = "";
            if (taxRateIds != null && taxRateIds != "")
            {
                var taxRateIdList = taxRateIds.Split(':');
                foreach (var taxRateId in taxRateIdList)
                {
                    if (taxRateId != "")
                    {
                        var parsedTaxRateId = Guid.Parse(taxRateId);
                        var objTaxRate = _taxRate.Get(o => o.Id == parsedTaxRateId);
                        var isTaxable = objTaxRate.IsTaxable.HasValue ? objTaxRate.IsTaxable : false;
                        taxRate = taxRate + objTaxRate.Rate + ":" + objTaxRate.IsAddition + ":" + isTaxable + ":" + objTaxRate.Code + ";";

                    }
                }
            }
            return taxRate;


        }
        private string getTaxRateWithCode(string taxRateIds)
        {
            var taxRate = "";
            if (taxRateIds != null && taxRateIds != "")
            {
                var taxRateIdList = taxRateIds.Split(':');
                foreach (var taxRateId in taxRateIdList)
                {
                    if (taxRateId != "")
                    {
                        var parsedTaxRateId = Guid.Parse(taxRateId);
                        var objTaxRate = _taxRate.Get(o => o.Id == parsedTaxRateId);
                        var isTaxable = objTaxRate.IsTaxable.HasValue ? objTaxRate.IsTaxable : false;
                        taxRate = taxRate + objTaxRate.Rate + ":" + objTaxRate.IsAddition + ":" + isTaxable + ":" + objTaxRate.Code + ";";
                    }
                }
            }
            return taxRate;


        }
    
  
        #endregion

        #region Common Methods 

        public Guid GetCurrentUserEmployeeId()
        {
            Guid employeeId = Guid.Empty;
            var objUser = (coreUser)Session[Constants.CurrentUser];
            if (objUser != null && objUser.Id != null)
            {
                employeeId = (Guid)objUser.Id;
            }
            return employeeId;
        }

        #endregion
    }
}
