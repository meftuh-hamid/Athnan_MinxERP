using System;
using System.Data.Objects;
using System.Linq;
using System.Web.Mvc;
using CyberErp.Data.Model;
using Ext.Direct.Mvc;
using System.Collections;
using CyberErp.Business.Component.Psms;
using System.Collections.Generic;
using Newtonsoft.Json;
using CyberErp.Presentation.Psms.Web.Classes;
using System.Transactions;
using System.Data.Entity;

namespace CyberErp.Presentation.Psms.Web.Controllers
{
    public class ReceiveController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsReceiveHeader> _receiveHeader;
        private readonly BaseModel<psmsReceiveDetail> _receiveDetail;
        private readonly Item _item;
        private readonly BaseModel<psmsStore> _store;
        private readonly BaseModel<psmsItemCategory> _itemCategory;
        private readonly BaseModel<lupItemType> _itemType;
      
        private readonly InventoryRecord _inventoryRecord;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        private readonly BaseModel<coreUnit> _unit;
        private readonly BaseModel<coreUser> _user;
        private readonly BaseModel<psmsApprover> _approver;
        
        private readonly BaseModel<psmsStorePermission> _storePermission;
        private readonly BaseModel<psmsTaxRate> _taxRate;
        private readonly BaseModel<psmsItemSerial> _itemSerial;
        private readonly BaseModel<psmsItemLOT> _itemLOT;
        private readonly ItemSerialTransaction _itemSerialTransaction;
        private readonly ItemLOTTransaction _itemLOTTransaction;
        private readonly BaseModel<psmsRequestOrderHeader> _requestOrderHeader;
        private readonly BaseModel<psmsPurchaseRequestDetail> _purchaseRequestDetail;
        private readonly BaseModel<psmsPurchaseOrderDetail> _purchaseOrderDetail;
        private readonly BaseModel<psmsPurchaseOrderHeader> _purchaseOrderHeader;
        private readonly BaseModel<PRProductionPlanDeliveryDetail> _productionPlanDeliveryDetail;
      
        
        private readonly BaseModel<coreVoucherWorkFlow> _voucherWorkFlow;
        private readonly Notification _notification;
      
       
        private Utility _utils;
        Guid postedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Posted);
        Guid receivedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Receive);
        Guid approvedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Approved);
        Guid partiallyVoucherStatus = Guid.Parse(Constants.Voucher_Status_Partially_Approved);
        Guid rejectedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Rejected);
        Guid voidVoucherStatus = Guid.Parse(Constants.Voucher_Status_Void);
        Guid ReceiveVoucherType = Guid.Parse(Constants.Voucher_Type_StoreReceive);
        Guid purchaseOrderVoucherType = Guid.Parse(Constants.Voucher_Type_PurchaseOrder);
        Guid finalApprovedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Final_Approved);
       
        private readonly Lookups _lookup;
        private Guid employeeId = Guid.Empty;
        private DateTime ? fiscalYearStartDate = null;
       #endregion

        #region Constructor

        public ReceiveController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _receiveHeader = new BaseModel<psmsReceiveHeader>(_context);
            _receiveDetail = new BaseModel<psmsReceiveDetail>(_context);
            _item = new Item(_context);
            _itemCategory = new BaseModel<psmsItemCategory>(_context);
            _store = new BaseModel<psmsStore>(_context);
            _inventoryRecord = new InventoryRecord(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);
            _unit = new BaseModel<coreUnit>(_context);
            _approver = new BaseModel<psmsApprover>(_context);           
            _storePermission = new BaseModel<psmsStorePermission>(_context);
            _taxRate = new BaseModel<psmsTaxRate>(_context);
            _itemSerial = new BaseModel<psmsItemSerial>(_context);
            _itemSerialTransaction = new ItemSerialTransaction(_context);
            _itemLOTTransaction = new ItemLOTTransaction(_context);
            _requestOrderHeader = new BaseModel<psmsRequestOrderHeader>(_context);
            _purchaseRequestDetail = new BaseModel<psmsPurchaseRequestDetail>(_context);
            _purchaseOrderDetail = new BaseModel<psmsPurchaseOrderDetail>(_context);
            _itemType = new BaseModel<lupItemType>(_context);
            _itemLOT = new BaseModel<psmsItemLOT>(_context);
            _voucherWorkFlow = new BaseModel<coreVoucherWorkFlow>(_context);
            _notification = new Notification(_context);
            _purchaseOrderHeader = new BaseModel<psmsPurchaseOrderHeader>(_context);
            _utils = new Utility();
            _lookup = new Lookups(_context);
            _productionPlanDeliveryDetail = new BaseModel<PRProductionPlanDeliveryDetail>(_context);
        }

        #endregion

        #region Actions

        public ActionResult GetDocumentNo()
        {
            var objUser = (coreUser)Session[Constants.CurrentUser];
            if (objUser != null && objUser.Id != null)
            {
                employeeId = (Guid)objUser.Id;
            }
            var Constantsfields = new
            {
                Employee = objUser.FirstName + " " + objUser.LastName,
                EmployeeId = employeeId,
                DocNo = "Draft",
                StatusId = postedVoucherStatus,
                Status = _lookup.GetAll(Lookups.VoucherStatus).Where(o => o.Id == postedVoucherStatus).FirstOrDefault().Name,
                FiscalYearId = _fiscalYear.GetAll().Where(o => o.IsActive == true && o.IsClosed == false).FirstOrDefault().Id

            };
            var result = new
            {
                total = 1,
                data = Constantsfields
            };
            return this.Direct(result);
        }
        public ActionResult Get(Guid id)
        {

            var objStoreReceive = _receiveHeader.Get(o => o.Id == id);
            var receive = new
            {
                objStoreReceive.Id,
                objStoreReceive.PurchaseOrderId,
                objStoreReceive.VoucherNumber,
                 objStoreReceive.ReceiveTypeId,
                ReceivedDate=objStoreReceive.ReceivedDate.ToShortDateString(),
                 objStoreReceive.PurchaseRequestHeaderId,
                PurchaseRequestNo = objStoreReceive.PurchaseRequestHeaderId.HasValue ? objStoreReceive.psmsPurchaseRequestHeader.VoucherNumber : "",
            
                PurchaseOrderNo =objStoreReceive.PurchaseOrderId.HasValue?objStoreReceive.psmsPurchaseOrderHeader.VoucherNumber: "",
                ReceiveType = objStoreReceive.lupReceiveType.Name,
                objStoreReceive.SupplierId,
                Supplier=objStoreReceive.SupplierId.HasValue? objStoreReceive.psmsSupplier.Name:"",
                objStoreReceive.TaxRateIds,
                objStoreReceive.TaxRateDescription,
                objStoreReceive.TotalSummarry,
                objStoreReceive.PreparedById,
                objStoreReceive.Discount,
                objStoreReceive.PONo,
                 objStoreReceive.PRNo,
                objStoreReceive.ReceivedById,
                objStoreReceive.FiscalYearId,
                FiscalYear = objStoreReceive.coreFiscalYear.Name,
                ReceivedBy =  objStoreReceive.coreUser1.FirstName + " " + objStoreReceive.coreUser1.LastName,            
                objStoreReceive.CommercialInvoiceNo,
                objStoreReceive.BillofLoadingNo,
                objStoreReceive.PackingListNo,
                objStoreReceive.LCCADNo,
                objStoreReceive.DeliveryNoteNo,
                objStoreReceive.TruckPlateNo,
                objStoreReceive.StatusId,
                objStoreReceive.StoreId,
                objStoreReceive.IsPosted,
                Store = objStoreReceive.psmsStore.Name,
                objStoreReceive.Remark,
                TaxRate = GetTaxRate(objStoreReceive.TaxRateIds),         
                objStoreReceive.CreatedAt
            };
            var serialList = _itemSerialTransaction.GetItemSerialTransactionList((Guid)objStoreReceive.Id, ReceiveVoucherType);
            var lotList = _itemLOTTransaction.GetItemLOTList((Guid)objStoreReceive.Id, ReceiveVoucherType);
             
            return this.Direct(new
            {
                success = true,
                data = receive,
                serialList = serialList,
                lotList = lotList
   
            });
        }

        public DirectResult GetAllPurchaseOrderHeader(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
                var mode = hashtable["mode"] != null ? hashtable["mode"].ToString() : "";
                var LastWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == purchaseOrderVoucherType).OrderByDescending(o => o.Step);

                var lastVoucherId = LastWorkFlow.Count() > 0 ? LastWorkFlow.FirstOrDefault().VoucherStatusId : Guid.Empty;
                var step = LastWorkFlow.Count() > 0 ? LastWorkFlow.FirstOrDefault().Step : 0;
                var secondLastVoucherId = LastWorkFlow.Count() > 1 ? LastWorkFlow.Where(o => o.Step == step - 1).FirstOrDefault().VoucherStatusId : Guid.Empty;
          
                Guid userId = Guid.Empty;
                var objUser = (coreUser)Session[Constants.CurrentUser];
                if (objUser != null && objUser.Id != null)
                {
                    employeeId = (Guid)objUser.Id;
                    userId = (Guid)objUser.Id;
                }

                var filtered = _purchaseOrderHeader.GetAll().AsQueryable().Where(x => (x.StatusId == finalApprovedVoucherStatus || x.StatusId == approvedVoucherStatus) && (x.psmsStore.psmsStorePermission.Any() ? x.psmsStore.psmsStorePermission.Where(f => f.UserId == userId).Any() : true));
                 filtered = SearchPurchaseOrderTransaction(mode, hashtable, filtered);
                 filtered = filtered.Where(o => o.StatusId != voidVoucherStatus && o.psmsPurchaseOrderDetail.Where(f => f.RemainingQuantity > 0).Any());
        

                switch (sort)
                {
                    case "VoucherNumber":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.VoucherNumber) : filtered.OrderBy(u => u.VoucherNumber);
                        break;
                    case "OrderType":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.lupPurchaseOrderType.Name) : filtered.OrderBy(u => u.lupPurchaseOrderType.Name);
                        break;
                    case "Supplier":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.psmsSupplier.Name) : filtered.OrderBy(u => u.psmsSupplier.Name);
                        break;
                    case "OrderedDate":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.OrderedDate) : filtered.OrderBy(u => u.OrderedDate);
                        break;
                    case "Store":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.psmsStore.Name) : filtered.OrderBy(u => u.psmsStore.Name);
                        break;
                    case "PurchaseOrderdBy":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.coreUser1.FirstName + " " + u.coreUser1.LastName) : filtered.OrderBy(u => u.coreUser1.FirstName + " " + u.coreUser1.LastName);
                        break;
                    case "Status":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.lupVoucherStatus.Name) : filtered.OrderBy(u => u.lupVoucherStatus.Name);
                        break;
                    default:
                        filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                        break;


                }
                var count = filtered.Count();
                filtered = filtered.Skip(start).Take(limit);
                var purchaseOrderHeaders = filtered.Select(item => new
                {
                    item.Id,
                    item.VoucherNumber,
                    OrderType = item.lupPurchaseOrderType.Name,
                    FiscalYear = item.coreFiscalYear.Name,
                    item.OrderedDate,
                    Supplier = item.psmsSupplier.Name,
                    item.SupplierReferenceNo,               
                    OrderedBy = item.coreUser1.FirstName + " " + item.coreUser1.LastName,
                    item.StatusId,
                     item.Discount,
                    item.StoreId,
                    Store = item.psmsStore.Name,
                    Status = item.lupVoucherStatus.Name,
                    item.Remark,
                    item.SupplierId,
                    item.TaxRateIds,
                    item.TaxRateDescription,
                    item.TotalSummarry,
            
             
                }).ToList().Select(item => new
                {
                    item.Id,
                    item.VoucherNumber,
                    item.Supplier,
                    item.SupplierReferenceNo,
                    OrderType = item.OrderType,
                    FiscalYear = item.FiscalYear,
                    OrderedDate = item.OrderedDate.ToShortDateString(),
                    OrderedBy = item.OrderedBy,
                    item.StatusId,
                    item.StoreId,
                    Store = item.Store,
                    item.Status,
                    item.Remark,
                    item.SupplierId,
                    item.TaxRateIds,
                    item.TaxRateDescription,
                    item.TotalSummarry,
                    TaxRate = GetTaxRate(item.TaxRateIds),
        
                });
                return this.Direct(new { total = count, data = purchaseOrderHeaders });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }
      
        public DirectResult GetAllHeader(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                var mode = hashtable["mode"] != null ? hashtable["mode"].ToString() : "";
                var purchaseOrderHeaderId = hashtable["purchaseOrderHeaderId"] != null ? Guid.Parse(hashtable["purchaseOrderHeaderId"].ToString()) : Guid.Empty;
            
                Guid userId = Guid.Empty;
                var objUser = (coreUser)Session[Constants.CurrentUser];
                if (objUser != null && objUser.Id != null)
                {
                    employeeId = (Guid)objUser.Id;
                    userId = (Guid)objUser.Id;
                }
                var LastWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == ReceiveVoucherType).OrderByDescending(o => o.Step).FirstOrDefault();
                var lastVoucherId = LastWorkFlow != null ? LastWorkFlow.VoucherStatusId : Guid.Empty;
          
                var filtered = _receiveHeader.GetAll().AsQueryable().Where(x =>  (x.psmsStore.psmsStorePermission.Any() ?x.psmsStore.psmsStorePermission.Where(f => f.UserId == userId).Any():true));
               
                if (purchaseOrderHeaderId != Guid.Empty)
                    filtered = filtered.Where(o => o.PurchaseOrderId == purchaseOrderHeaderId);
             
                filtered = SearchTransaction(mode, hashtable, filtered);
             
                switch (sort)
                {
                       case "VoucherNumber":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.VoucherNumber) : filtered.OrderBy(u => u.VoucherNumber);
                        break;
                    case "ReceivedDate":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.ReceivedDate) : filtered.OrderBy(u => u.ReceivedDate);
                        break;
                    case "PurchaseRequestNo":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.PurchaseRequestHeaderId.HasValue ? u.psmsPurchaseRequestHeader.VoucherNumber : "") : filtered.OrderBy(u => u.PurchaseRequestHeaderId.HasValue ? u.psmsPurchaseRequestHeader.VoucherNumber : "");
                        break;
               
                    case "ReceivedBy":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.coreUser1.FirstName + " " + u.coreUser1.LastName) : filtered.OrderBy(u => u.coreUser1.FirstName + " " + u.coreUser1.LastName);
                        break;
                    case "Status":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.lupVoucherStatus.Name) : filtered.OrderBy(u => u.lupVoucherStatus.Name);
                        break;
                    default:
                        filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                        break;
 

                }
                var count = filtered.Count();
                filtered = filtered.Skip(start).Take(limit);
                var purchaserequestHeaders = filtered.Select(item => new
                {
                    item.Id,
                    item.VoucherNumber,
                    PurchaseOrderNo =item.PurchaseOrderId.HasValue? item.psmsPurchaseOrderHeader.VoucherNumber : "" ,
                    PurchaseRequestNo = item.PurchaseRequestHeaderId.HasValue ? item.psmsPurchaseRequestHeader.VoucherNumber : "",
                    Supplier=item.SupplierId.HasValue?item.psmsSupplier.Name:"",
                    item.ReceivedDate,
                    ReceiveType=item.lupReceiveType.Name,
                    IsLastStep = lastVoucherId != Guid.Empty ? lastVoucherId == item.StatusId : true,
                    ReceivedBy = item.coreUser1.FirstName + " " + item.coreUser1.LastName,
                    PreparedBy = item.coreUser.FirstName + " " + item.coreUser.LastName,
                    item.StatusId,
                    Store = item.psmsStore.Name,  
                    Status = item.lupVoucherStatus.Name,
                    item.Remark,
                    item.CreatedAt
                }).ToList().Select(item => new
                {
                    item.Id,
                    item.ReceiveType,
                    item.PreparedBy,
                    item.PurchaseRequestNo,
                    item.IsLastStep,
                    item.Supplier,
                    item.PurchaseOrderNo,
                    item.ReceivedBy,
                    ReceivedDate = item.ReceivedDate.ToShortDateString(),
                    item.VoucherNumber,
                    item.StatusId,
                    Store = item.Store,
                    Status = item.Status,
                });
                return this.Direct(new { total = count, data = purchaserequestHeaders });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }
        public DirectResult GetAllDetail(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                Guid voucherHeaderId;
                string action = "";
                Guid.TryParse(hashtable["voucherHeaderId"].ToString(), out voucherHeaderId);
                action = hashtable["action"].ToString();
                if (action == "purchaseRequest")
                {
                    var records = GetPurchaseRequestDetail(voucherHeaderId);
                    var result = new { total = records.Count, data = records };
                    return this.Direct(result);
                }
                else if (action == "purchaseOrder")
                {
                    var records = GetPurchaseOrderDetail(voucherHeaderId);
                    var result = new { total = records.Count, data = records };
                    return this.Direct(result);
                }
                else
                {
                    var receiveDetailList = _receiveDetail.GetAll().AsQueryable();
                    var filtered = receiveDetailList.Where(d => d.ReceiveHeaderId == voucherHeaderId).OrderBy(o => o.CreatedAt);
                  
                    var count = filtered.Count();
                    var records = filtered.ToList().Select(item => new
                    {
                        item.Id,
                        item.ReceiveHeaderId,
                        Name = item.psmsItem.Name,
                        ItemCategory = item.psmsItem.psmsItemCategory.Name,                      
                        item.psmsItem.IsSerialItem,
                        item.psmsItem.IsLOTItem,
                        item.psmsItem.PartNumber,
                        item.ItemId,
                        item.UnitId,
                        Code = item.ItemId != null ? item.psmsItem.Code : "",
                        item.StatusId,
                        item.UnitCost,
                        item.Tax,
                        item.Remark,
                        item.ProductionDeliveryDetailId,
                        TaxRateIds = item.psmsItem.TaxRateIds ,
                        TaxRateDescription = item.psmsItem.TaxRateDescription ,
                        TaxRate = GetTaxRate(item.psmsItem.TaxRateIds),
                        ExpireyDate=item.ExpireyDate.HasValue?item.ExpireyDate.Value.ToShortDateString():"",
                        Status = item.lupVoucherStatus.Name,
                        MeasurementUnit = item.UnitId != null ? item.lupMeasurementUnit.Name : item.psmsItem.lupMeasurementUnit.Name,
                        item.Quantity,
                        item.ReceivedQuantity,
                        item.RemainingQuantity,
                        item.DamagedQuantity,
                    }).ToList();
                    var result = new { total = count, data = records };
                    return this.Direct(result);
                }
               

            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }
        public DirectResult Void(Guid id)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var objHeader = _receiveHeader.Get(o => o.Id == id);
                    if (objHeader.IsPosted == true)
                        return this.Direct(new { success = false, data = "you can't void already posted transaction!" });

                    var sourceVoucherTypeId = objHeader.PurchaseRequestHeaderId.HasValue ? Constants.Voucher_Type_PurchaseRequest : objHeader.PurchaseOrderId.HasValue ? Constants.Voucher_Type_PurchaseOrder : "0";
                    var sourceHeaderId = objHeader.PurchaseRequestHeaderId.HasValue ? objHeader.PurchaseRequestHeaderId.Value : objHeader.PurchaseOrderId.HasValue ? objHeader.PurchaseOrderId.Value : Guid.Empty;
                    var lastorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == ReceiveVoucherType).OrderByDescending(o => o.Step).FirstOrDefault();

                    foreach (var objReceiveDetail in objHeader.psmsReceiveDetail)
                    {
                        if (sourceVoucherTypeId != "0")
                            UpdateSourceDetail(Guid.Parse(sourceVoucherTypeId), sourceHeaderId, objReceiveDetail.ItemId, -(objReceiveDetail.ReceivedQuantity.Value + objReceiveDetail.DamagedQuantity.Value));
                        if (objReceiveDetail.ProductionDeliveryDetailId.HasValue)
                            UpdateProductionDetail(objReceiveDetail.ProductionDeliveryDetailId.Value, -objReceiveDetail.ReceivedQuantity.Value);
                     
                        objReceiveDetail.StatusId = voidVoucherStatus;
                        if (objHeader.StatusId == receivedVoucherStatus)
                            UpdateInventoryFromVoidedT(objReceiveDetail, objHeader.TaxRateIds);
                    }
                    foreach (var receiveDetail in objHeader.psmsReceiveDetail)
                    {
                        Guid[] itemSerialLIst = _itemSerial.GetAll().AsQueryable().Where(o => o.psmsItemSerialTransaction.Where(f => f.VoucherId == objHeader.Id && f.VoucherTypeId == ReceiveVoucherType).Any()).Select(o => o.Id).ToArray();

                        _itemSerialTransaction.DeleteItemSerialTransaction((Guid)objHeader.Id, ReceiveVoucherType);
                        _itemSerial.Delete(o => itemSerialLIst.Contains(o.Id));

                        Guid[] itemLOTLIst = _itemLOT.GetAll().AsQueryable().Where(o => o.psmsItemLOTTransaction.Where(f => f.VoucherId == objHeader.Id && f.VoucherTypeId == ReceiveVoucherType).Any()).Select(o => o.Id).ToArray();

                        _itemLOTTransaction.DeleteItemLOTTransaction((Guid)objHeader.Id, ReceiveVoucherType);
                        _itemLOT.Delete(o => itemLOTLIst.Contains(o.Id));

                    }
                    objHeader.StatusId = voidVoucherStatus;
                     _context.SaveChanges();
                    transaction.Complete();
                    return this.Direct(new { success = true, data = "Data has been added successfully!" });

                }
                catch (System.Exception ex)
                {
                    return this.Direct(new { success = false, data = ex.InnerException != null ? ex.InnerException.Message : ex.Message });
                }
            }
        }
        [FormHandler]
        public ActionResult Save(psmsReceiveHeader ReceiveHeader)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var requestOrderDetailsString = hashtable["receiveDetails"].ToString();
                    var itemSerialsString = hashtable["itemSerials"].ToString();
                    var itemLOTsString = hashtable["itemLOTs"].ToString();
                    
                    fiscalYearStartDate = _fiscalYear.GetAll().AsQueryable().Where(o => o.Id == ReceiveHeader.FiscalYearId).FirstOrDefault().StartDate;
                    var action = hashtable["action"].ToString();
                    var statusId = ReceiveHeader.StatusId;
                    var voucherno = ReceiveHeader.VoucherNumber;
                    if (ReceiveHeader.Id == Guid.Empty)
                    {
                        ReceiveHeader.Id = Guid.NewGuid();
                        ReceiveHeader.CreatedAt = DateTime.Now;
                        ReceiveHeader.UpdatedAt = DateTime.Now;
                        CyberErp.Presentation.Psms.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Psms.Web.MvcApplication;
                        httpapplication.Application.Lock();
                        if (voucherno=="Draft")
                        ReceiveHeader.VoucherNumber = _utils.GetVoucherNumber("Receive", ReceiveHeader.StoreId);
                   
                        _receiveHeader.AddNew(ReceiveHeader);
                        if (voucherno == "Draft")
                        _utils.UpdateVoucherNumber("Receive", ReceiveHeader.StoreId);
                        httpapplication.Application.UnLock();
                        UpdateStatus(ReceiveHeader, action);
             
                    }
                    else
                    {
                        if (action == "revise")
                        {
                            _notification.VoidAllNotification(receivedVoucherStatus, ReceiveHeader.Id);
                            ReceiveHeader.StatusId = postedVoucherStatus;
                            UpdateStatus(ReceiveHeader, action);
                        }
                        ReceiveHeader.UpdatedAt = DateTime.Now;                       
                        _receiveHeader.Edit(ReceiveHeader);
                    }
                    var isReceive = CheckStatus(ReceiveHeader.StatusId);

                    if (action == "receive")
                    {
                        action = isReceive == true ? "receive" : "post";
                        if (isReceive)
                        {
                            ReceiveHeader.StatusId = receivedVoucherStatus;
                        }
                    }                 
                    SaveReceiveDetail(ReceiveHeader,ReceiveHeader.VoucherNumber, ReceiveHeader.StoreId, ReceiveHeader.ReceivedDate, ReceiveHeader.TaxRateIds, requestOrderDetailsString, itemSerialsString, itemLOTsString, statusId, action,ReceiveHeader.ReceivedDate);
                 
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Direct(new { success = true, data = "Data has been added successfully!" });

                }
                catch (System.Exception ex)
                {
                    return this.Direct(new { success = false, data = ex.InnerException != null ? ex.InnerException.Message : ex.Message });
                }
            }
        }
   
        #endregion

        #region Methods
        private bool CheckStatus(Guid statusId)
        {
            bool returnValue = false;
            var voucherWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == ReceiveVoucherType).OrderByDescending(o => o.Step);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == statusId).FirstOrDefault();
            if (currentStep == voucherWorkFlow.FirstOrDefault())
                returnValue = true;

            return returnValue;
        }
        private void UpdateStatus(psmsReceiveHeader receiveHeader, string action)
        {


            var date = receiveHeader.ReceivedDate.ToShortDateString();
            var title = "Receive(" + receiveHeader.VoucherNumber + ")";
            var message = "A new  receive has be added with voucher no  " + receiveHeader.VoucherNumber + "on date " + date + " \n ";


            var voucherWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == ReceiveVoucherType);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == receiveHeader.StatusId).FirstOrDefault();
            var nextStep = voucherWorkFlow.Where(o => o.Step == currentStep.Step + 1).FirstOrDefault();
            if (currentStep == null)
                throw new System.InvalidOperationException("setting error,Please maintain workflow for the store Receive voucher!");
        
            if (nextStep != null)
            {
                var approver = _approver.GetAll().AsQueryable().Where(o => o.VoucherTypeId == ReceiveVoucherType && o.StatusId == nextStep.VoucherStatusId && ((o.StoreId.HasValue ? o.StoreId == receiveHeader.StoreId : true)));
                 if (approver.Count() > 0)
                {
                    string approverIds = "";
                    foreach (var objApprover in approver)
                    {
                        approverIds = approverIds + objApprover.EmployeeId.ToString() + ",";
                    }
                    _notification.SaveNotification(title, message, receiveHeader.Id, receiveHeader.VoucherNumber, nextStep.VoucherStatusId, ReceiveVoucherType, approverIds, receiveHeader.StoreId, null, "");
                }

            }

        }  
        private IList GetPurchaseRequestDetail(Guid voucherHeaderId)
        {
            var filtered = _purchaseRequestDetail.GetAll().AsQueryable().Where(d => d.PurchaseRequestHeaderId == voucherHeaderId).OrderBy(o => o.CreatedAt);
            var count = filtered.Count();
            var records = filtered.ToList().Select(item => new
            {
                Name = item.psmsItem.Name,
                item.ItemId,
                Code = item.ItemId != null ? item.psmsItem.Code : "",
                ItemCategory = item.ItemId != null ? item.psmsItem.psmsItemCategory.Name : "",
               
                item.StatusId,
                item.UnitId,
                Status = item.lupVoucherStatus.Name,
                MeasurementUnit =item.lupMeasurementUnit.Name,
                TaxRate =item.ItemId.HasValue? GetTaxRate(item.psmsItem.TaxRateIds):"",
                TaxRateDescription = item.ItemId.HasValue ? item.psmsItem.TaxRateDescription : "",
                     
                Quantity = item.Quantity,
                UnitCost = 0,
                ReceivedQuantity = item.Quantity,
                RemainingQuantity = item.Quantity,
                item.Remark,
                AcceptedQuantity = 0,
                SampleQuantity = 0,
                DamagedQuantity = 0
            }).ToList();

            return records;
        }
        private IList GetPurchaseOrderDetail(Guid voucherHeaderId)
        {
            var filtered = _purchaseOrderDetail.GetAll().AsQueryable().Where(d => d.PurchaseOrderHeaderId == voucherHeaderId).OrderBy(o => o.CreatedAt);
            var receiveDetailList =_receiveDetail.GetAll().AsQueryable();
            var count = filtered.Count();
            var records = filtered.ToList().Select(item => new
            {
                Name = item.psmsItem.Name,
                item.ItemId,
                Code = item.ItemId != null ? item.psmsItem.Code : "",
                ItemCategory = item.ItemId != null ? item.psmsItem.psmsItemCategory.Name : "",
                TaxRate = item.ItemId.HasValue ? GetTaxRate(item.psmsItem.TaxRateIds) : "",
                TaxRateDescription = item.ItemId.HasValue ? item.psmsItem.TaxRateDescription : "",
             
                item.StatusId,
                item.UnitId,
                item.UnitCost,
                item.Tax,
                Status = item.lupVoucherStatus.Name,
                MeasurementUnit =item.UnitId!=null? item.lupMeasurementUnit.Name:"",
                Quantity = item.Quantity,
                DamagedQuantity=0,
                item.RemainingQuantity,
                ReceivedQuantity=item.RemainingQuantity,
             
            }).ToList();

            return records;
        }
         public void SaveReceiveDetail(psmsReceiveHeader receiveHeader, string voucherNo, Guid storeId, DateTime grnDate, string taxRateIds, string ReceiveDetailsString, string itemSerialString, string itemLOTsString, Guid statusId, string action, DateTime transactionDate)
        {
            ReceiveDetailsString = ReceiveDetailsString.Remove(ReceiveDetailsString.Length - 1);
            IList<string> ReceiveDetails = ReceiveDetailsString.Split(new[] { ';' }).ToList();
            IList<psmsReceiveDetail> ReceiveDetailList = new List<psmsReceiveDetail>();
            var oldsReceiveDetailList = _receiveDetail.GetAll().AsQueryable().Where(o => o.ReceiveHeaderId == receiveHeader.Id);
            var sourceVoucherTypeId = receiveHeader.PurchaseRequestHeaderId.HasValue ? Constants.Voucher_Type_PurchaseRequest : receiveHeader.PurchaseOrderId.HasValue ? Constants.Voucher_Type_PurchaseOrder :  "0";
            var sourceHeaderId = receiveHeader.PurchaseRequestHeaderId.HasValue ? receiveHeader.PurchaseRequestHeaderId.Value : receiveHeader.PurchaseOrderId.HasValue ? receiveHeader.PurchaseOrderId.Value :  Guid.Empty;
            var date = DateTime.Now; Guid id = Guid.Empty;
            for (var i = 0; i < ReceiveDetails.Count(); i++)
            {
                var receiveDetail = ReceiveDetails[i].Split(new[] { ':' });
                var receiveDetailId = Guid.Empty;
                Guid.TryParse(receiveDetail[0].ToString(), out receiveDetailId);
                var objReceiveDetail = receiveDetailId != Guid.Empty ? _receiveDetail.Get(o => o.Id == receiveDetailId) : new psmsReceiveDetail();
                decimal oldQuantity = (objReceiveDetail.ReceivedQuantity.HasValue ? objReceiveDetail.ReceivedQuantity.Value : 0) + (objReceiveDetail.DamagedQuantity.HasValue ? objReceiveDetail.DamagedQuantity.Value : 0);

                objReceiveDetail.ReceiveHeaderId = receiveHeader.Id;
                var itemId = Guid.Empty;
                if (Guid.TryParse(receiveDetail[2], out itemId))
                objReceiveDetail.ItemId = itemId;
                else
                {
                  objReceiveDetail.ItemId=  AddNewItem(receiveDetail[10], Guid.Parse(receiveDetail[11]), receiveDetail[13]);
                }
                objReceiveDetail.Quantity = decimal.Parse(receiveDetail[3]);
                objReceiveDetail.ReceivedQuantity = decimal.Parse(receiveDetail[4]);
                objReceiveDetail.RemainingQuantity = decimal.Parse(receiveDetail[5]);
                objReceiveDetail.DamagedQuantity = decimal.Parse(receiveDetail[6]);
               
                objReceiveDetail.UnitCost = decimal.Parse(receiveDetail[7]);
                objReceiveDetail.Tax = decimal.Parse(receiveDetail[8]);
                objReceiveDetail.UnitId = Guid.Parse(receiveDetail[11]);
                objReceiveDetail.Remark = receiveDetail[12];
                 if (DateTime.TryParse(receiveDetail[13],out date))
                objReceiveDetail.ExpireyDate=date;
                 if (Guid.TryParse(receiveDetail[14], out id))
                     objReceiveDetail.ProductionDeliveryDetailId = id;

                objReceiveDetail.UpdatedAt = DateTime.Now;

                if (receiveDetailId == Guid.Empty)
                {
                    objReceiveDetail.Id = Guid.NewGuid();
                    objReceiveDetail.CreatedAt = DateTime.Now.AddSeconds(2);
                    objReceiveDetail.StatusId = statusId;
                    _receiveDetail.AddNew(objReceiveDetail);
                }
                if (action == "receive")
                {
                    UpdateInventory(objReceiveDetail, taxRateIds, transactionDate);
                }
                if (itemSerialString.Count() > 0)
                    AddItemSerial(receiveHeader.Id, voucherNo, objReceiveDetail.ItemId, receiveDetail[9], storeId, itemSerialString, taxRateIds, grnDate, objReceiveDetail.UnitCost);
                if (itemLOTsString.Count() > 0)
                    AddItemLot(receiveHeader.Id, voucherNo, objReceiveDetail.ItemId, receiveDetail[9], storeId, itemLOTsString);
                ReceiveDetailList.Add(objReceiveDetail);
                 
                if (sourceVoucherTypeId != "0")
                {
                    decimal quantity = statusId == voidVoucherStatus ? objReceiveDetail.ReceivedQuantity.Value : objReceiveDetail.ReceivedQuantity.Value - oldQuantity;

                    UpdateSourceDetail(Guid.Parse(sourceVoucherTypeId), sourceHeaderId, objReceiveDetail.ItemId, quantity);                 
                }
                if (objReceiveDetail.ProductionDeliveryDetailId.HasValue)
                    UpdateProductionDetail(objReceiveDetail.ProductionDeliveryDetailId.Value, objReceiveDetail.ReceivedQuantity.Value - oldQuantity);


                 


           }
            var sourceVoucherTypeIds = Guid.Empty;
            if (sourceVoucherTypeId != "0")
                sourceVoucherTypeIds = Guid.Parse(sourceVoucherTypeId);

            DeleteReceiveDetail(ReceiveDetailList, oldsReceiveDetailList, sourceVoucherTypeIds, sourceHeaderId);

        }
        private void AddItemSerial(Guid receiveHeaderId, string voucherNo, Guid itemId,string itemName, Guid storeId,string itemSerialString,string taxRateIds, DateTime grnDate, decimal unitCost)
        {         
                var taxRate = GetincludedTaxRate(taxRateIds);
                unitCost = unitCost + taxRate * unitCost;
                itemSerialString = itemSerialString.Remove(itemSerialString.Length - 1);
                IList<string> itemSerials = itemSerialString.Split(new[] { ';' }).ToList();
                IList<string[]> itemSerialList = new List<string[]>();
                for (var f = 0; f < itemSerials.Count(); f++)
                {
                    var itemSerial = itemSerials[f].Split(new[] { ':' });
                    if (itemSerial[6].ToString() == itemName)
                    {
                        itemSerialList.Add(itemSerial);
                    }
                }

                SaveItemSerial(receiveHeaderId, voucherNo,itemId, storeId, itemSerialList, grnDate, unitCost);
        }
        private void AddItemLot(Guid receiveHeaderId, string voucherNo, Guid itemId, string itemName, Guid storeId, string itemLotString)
        {
            itemLotString = itemLotString.Remove(itemLotString.Length - 1);
            IList<string> itemLots = itemLotString.Split(new[] { ';' }).ToList();
            IList<string[]> itemLostList = new List<string[]>();
            for (var f = 0; f < itemLots.Count(); f++)
            {
                var itemLot = itemLots[f].Split(new[] { ':' });
                if (itemLot[11].ToString() == itemName)
                {
                    itemLostList.Add(itemLot);
                }
            }

            SaveItemLot(receiveHeaderId, voucherNo, itemId, storeId, itemLostList);
        }
        private void DeleteReceiveDetail(IList<psmsReceiveDetail> ReceiveDetailList, IQueryable<psmsReceiveDetail> oldsReceiveDetailList, Guid sourceHeaderId, Guid sourceVoucherTypeId)
        {
            foreach (var objoldsReceiveDetail in oldsReceiveDetailList)
            {
                var record = ReceiveDetailList.Where(o => o.Id == objoldsReceiveDetail.Id);

                if (record.Count() == 0)
                {
                    if (sourceVoucherTypeId != Guid.Empty)
                        UpdateSourceDetail(sourceVoucherTypeId, sourceHeaderId, objoldsReceiveDetail.ItemId, -(objoldsReceiveDetail.ReceivedQuantity.Value + objoldsReceiveDetail.DamagedQuantity.Value));
                    if (objoldsReceiveDetail.ProductionDeliveryDetailId.HasValue)
                        UpdateProductionDetail(objoldsReceiveDetail.ProductionDeliveryDetailId.Value, objoldsReceiveDetail.ReceivedQuantity.Value + objoldsReceiveDetail.DamagedQuantity.Value);

                    _receiveDetail.Delete(o => o.Id == objoldsReceiveDetail.Id);
                }
            }
        }
        private void UpdateProductionDetail(Guid productionDetailId, decimal updateQuantity)
        {
            var objSourceDetail = _productionPlanDeliveryDetail.GetAll().AsQueryable().Where(o => o.Id == productionDetailId).FirstOrDefault();
            if (objSourceDetail != null)
                objSourceDetail.RemainingQuantity = objSourceDetail.RemainingQuantity - updateQuantity;
        }
        private void UpdateInventory(psmsReceiveDetail receiveDetail, string taxRateIds, DateTime transactionDate)
        {
            var itemPriceTotal = (receiveDetail.UnitCost) * receiveDetail.ReceivedQuantity.Value;
            var taxRate = GetincludedTaxRate(taxRateIds);
            decimal unitCost = receiveDetail.UnitCost + taxRate * receiveDetail.UnitCost;
            var model = new ParameterModel { VoucherId = receiveDetail.ReceiveHeaderId, VoucherTypeId = ReceiveVoucherType, VoucherNo = receiveDetail.psmsReceiveHeader.VoucherNumber, ItemId = receiveDetail.ItemId, StoreId = receiveDetail.psmsReceiveHeader.StoreId, FiscalYearId = receiveDetail.psmsReceiveHeader.FiscalYearId, TransactionDate = transactionDate, Quantity = (double)receiveDetail.ReceivedQuantity.Value, DamagedQuantity = (double)receiveDetail.DamagedQuantity.Value, UnitCost = receiveDetail.UnitCost, FiscalYearDate = fiscalYearStartDate, ExpireyDate = receiveDetail.ExpireyDate };
            _inventoryRecord.ReceiveInventoryUpdate(model);
        }
        private void UpdateInventoryFromVoidedT(psmsReceiveDetail ReceiveDetail,string taxRateIds)
        {
            var taxRate = GetincludedTaxRate(taxRateIds);
            decimal unitCost = ReceiveDetail.UnitCost + ReceiveDetail.UnitCost*taxRate;
            var model = new ParameterModel { VoucherId = ReceiveDetail.ReceiveHeaderId, VoucherTypeId = ReceiveVoucherType, VoucherNo = ReceiveDetail.psmsReceiveHeader.VoucherNumber, ItemId = ReceiveDetail.ItemId, StoreId = ReceiveDetail.psmsReceiveHeader.StoreId, FiscalYearId = ReceiveDetail.psmsReceiveHeader.FiscalYearId, TransactionDate = ReceiveDetail.psmsReceiveHeader.ReceivedDate, Quantity = (double)ReceiveDetail.ReceivedQuantity.Value, DamagedQuantity = (double)ReceiveDetail.DamagedQuantity.Value, UnitCost = ReceiveDetail.UnitCost };
            _inventoryRecord.ReceiveInventoryUpdateFromVoidedT(model);
        }
        private Guid getCurrentEmployee()
        {
            var objUser = (coreUser)Session[Constants.CurrentUser];
            if (objUser != null && objUser.Id != null)
            {
                employeeId = (Guid)objUser.Id;
            }
            return employeeId;
        }
        private string GetTaxRate(string taxRateIds)
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

    
        private decimal GetincludedTaxRate(string taxRateIds)
        {
            decimal taxRate =0;
            if(taxRateIds!=null)
            {
                var taxRateIdList = taxRateIds.Split(':');
                foreach (var taxRateId in taxRateIdList)
                {
                    if (taxRateId != "")
                    {
                        var parsedTaxRateId = Guid.Parse(taxRateId);
                        var objTaxRate = _taxRate.Get(o => o.Id == parsedTaxRateId);
                        if (objTaxRate.IsIncludedInItemCosting)
                            taxRate = taxRate + objTaxRate.Rate.Value;
                    }

                }
            }
            
            return taxRate;


        }
        private void SaveItemSerial(Guid voucherHeaderId, string voucherNo, Guid itemId, Guid storeId, IList<string[]> itemSerials, DateTime gRNDate, decimal PurchaseCost)
        {
          
            var oldItemSerialList = _itemSerial.GetAll().AsQueryable().Where(o =>o.ItemId==itemId && o.psmsItemSerialTransaction.Where(f => f.VoucherId == voucherHeaderId && f.VoucherTypeId==ReceiveVoucherType).Any());
            List<psmsItemSerial> itemSerialList = new List<psmsItemSerial>();       
            for (var i = 0; i < itemSerials.Count(); i++)
            {

                var itemSerial = itemSerials[i];

                    var itemSerialId = Guid.Empty;
                    Guid.TryParse(itemSerial[3].ToString(), out itemSerialId);

                    var objItemSerial = itemSerialId != Guid.Empty ? _itemSerial.Get(o => o.Id == itemSerialId) : new psmsItemSerial();

                    objItemSerial.ItemId = itemId;
                    objItemSerial.StoreId = storeId;
                    objItemSerial.IsAvailable = bool.Parse(itemSerial[4]);
                    objItemSerial.Number = itemSerial[5];
                    objItemSerial.GRNDate = gRNDate;
                    objItemSerial.GRNNumber = voucherNo;
                    objItemSerial.PurchaseCost = PurchaseCost;
                    objItemSerial.Description = itemSerial[7];
                    objItemSerial.SN = itemSerial[8];
                    objItemSerial.PlateNo = itemSerial[9];
                    objItemSerial.IsDisposed = bool.Parse(itemSerial[10]);
                    objItemSerial.Remark = itemSerial[11];
                    objItemSerial.UpdatedAt = DateTime.Now;

                    if (itemSerialId == Guid.Empty)
                    {
                        objItemSerial.Id = Guid.NewGuid();
                        objItemSerial.CreatedAt = DateTime.Now;
                        _itemSerial.AddNew(objItemSerial);
                    }
                    _itemSerialTransaction.AddItemSerialTransaction(voucherHeaderId, ReceiveVoucherType, voucherNo, objItemSerial.Id);
                    itemSerialList.Add(objItemSerial);
            }
            DeleteItemSerial(voucherHeaderId, oldItemSerialList, itemSerialList);              
                  
        }

        private void SaveItemLot(Guid voucherHeaderId, string voucherNo, Guid itemId, Guid storeId, IList<string[]> itemLots)
        {

            var oldItemLOTList = _itemLOT.GetAll().AsQueryable().Where(o => o.ItemId == itemId && o.psmsItemLOTTransaction.Where(f => f.VoucherId == voucherHeaderId && f.VoucherTypeId == ReceiveVoucherType).Any());
            List<psmsItemLOT> itemLOTList = new List<psmsItemLOT>();
            for (var i = 0; i < itemLots.Count(); i++)
            {
                var date = new DateTime(); 

                var itemLOT = itemLots[i];

                var itemLOTId = Guid.Empty;
                Guid.TryParse(itemLOT[3].ToString(), out itemLOTId);

                var objItemLOT = itemLOTId != Guid.Empty ? _itemLOT.Get(o => o.Id == itemLOTId) : new psmsItemLOT();

                objItemLOT.ItemId = itemId;
                objItemLOT.StoreId = storeId;
                objItemLOT.Number = itemLOT[3];
                objItemLOT.Manufacturer = itemLOT[4];
                if (DateTime.TryParse(itemLOT[5].ToString(), out date)) objItemLOT.ManufacturedDate = date;
                if (DateTime.TryParse(itemLOT[6].ToString(), out date)) objItemLOT.ExpiredDate = date;

                objItemLOT.Quantity = decimal.Parse(itemLOT[7]);
                objItemLOT.CommittedQuantity = 0;
                objItemLOT.Remark = itemLOT[9];
               
                objItemLOT.UpdatedAt = DateTime.Now;

                if (itemLOTId == Guid.Empty)
                {
                    objItemLOT.Id = Guid.NewGuid();
                    objItemLOT.CreatedAt = DateTime.Now;
                    _itemLOT.AddNew(objItemLOT);
                }
                _itemLOTTransaction.AddItemLOTsTransaction(voucherHeaderId, ReceiveVoucherType, voucherNo, objItemLOT.Id, objItemLOT.Quantity);
                itemLOTList.Add(objItemLOT);
            }
            DeleteItemLOT(voucherHeaderId, oldItemLOTList, itemLOTList);

        }         
 
        public void DeleteItemSerial(Guid voucherHeaderId,IQueryable<psmsItemSerial> oldItemSerialList, IList<psmsItemSerial> itemSerialList)
        {
            foreach (var objoldsItemSerial in oldItemSerialList)
            {
                var record = itemSerialList.Where(o => o.Id == objoldsItemSerial.Id);

                if (record.Count() == 0)
                {
                    _itemSerialTransaction.DeleteItemSerialTransaction(voucherHeaderId, ReceiveVoucherType, objoldsItemSerial.Id);             
                    _itemSerial.Delete(o => o.Id == objoldsItemSerial.Id);
                }
            }
        }
        public void DeleteItemLOT(Guid voucherHeaderId, IQueryable<psmsItemLOT> oldItemLOTList, IList<psmsItemLOT> itemLOTList)
        {
            foreach (var objoldsItemLot in oldItemLOTList)
            {
                var record = itemLOTList.Where(o => o.Id == objoldsItemLot.Id);

                if (record.Count() == 0)
                {
                    _itemLOTTransaction.DeleteItemLOTTransaction(voucherHeaderId, ReceiveVoucherType, objoldsItemLot.Id);
                    _itemLOT.Delete(o => o.Id == objoldsItemLot.Id);
                }
            }
        }
     
        private Guid AddNewItem(string itemName,Guid unitId,string itemCategory)
        {
            var newItem = new psmsItem();
            var objItemCategory = _itemCategory.GetAll().Where(o => o.Name == itemCategory).FirstOrDefault();
            var objItemType = _itemType.GetAll().FirstOrDefault();
         
            newItem.Id = Guid.NewGuid();
            newItem.MeasurementUnitId = unitId;
            newItem.Name = itemName;
            newItem.ItemCategoryId = objItemCategory.Id;
            var code = _item.GenerateItemCode(objItemCategory.Id, Constants.autoCode_setting_Name);
            newItem.Code = code != "" ? code : newItem.Code;
            newItem.IsHazardous = false;
            newItem.IsLOTItem = false;
            newItem.MeasurementUnitId = unitId;
            newItem.IsSerialItem = objItemType.Name=="FixedAsset" ? true : false;
         //   newItem.ItemTypeId = itemTypeId;
            newItem.CreatedAt = DateTime.Now;
            newItem.UpdatedAt = DateTime.Now;
            _item.AddNew(newItem);
            return newItem.Id;
        }
        private IQueryable<psmsReceiveHeader> SearchTransaction(string mode, Hashtable ht, IQueryable<psmsReceiveHeader> filtered)
        {
            switch (mode)
            {
                case "search":
                    var startDate = ht["startDate"].ToString();
                    var endDate = ht["endDate"].ToString();
                    var referenceNo = ht["referenceNo"].ToString();
                    var tSearchText = ht["tSearchText"].ToString();

                    var status = ht["status"].ToString();

                    if (!string.IsNullOrEmpty(referenceNo))
                    {
                        filtered = filtered.Where(v => v.VoucherNumber.Contains(referenceNo));
                    }
                    if (!string.IsNullOrEmpty(tSearchText))
                    {
                        filtered = filtered.Where(v => v.psmsReceiveDetail.Where(f =>
                            (f.psmsItem.Name.ToUpper().Contains(tSearchText.ToUpper())) ||
                            (f.psmsItem.Code.ToUpper().Contains(tSearchText.ToUpper()))).Any() ||                         
                            (v.psmsStore.Name.ToUpper().Contains(tSearchText.ToUpper())) ||
                            (v.lupReceiveType.Name.ToUpper().Contains(tSearchText.ToUpper())) ||                          
                            (v.PurchaseOrderId.HasValue ? v.psmsPurchaseOrderHeader.VoucherNumber.ToUpper().Contains(tSearchText.ToUpper()) : false) ||
                            (v.PurchaseRequestHeaderId.HasValue ? v.psmsPurchaseRequestHeader.VoucherNumber.ToUpper().Contains(tSearchText.ToUpper()) : false) ||
                            (v.coreUser.FirstName + " " + v.coreUser.LastName).ToUpper().Contains(tSearchText.ToUpper()) ||
                            (v.coreUser1.FirstName + " " + v.coreUser1.LastName).ToUpper().Contains(tSearchText.ToUpper())
                            );
                    }
                    if (!string.IsNullOrEmpty(status))
                    {
                        filtered = filtered.Where(v => v.lupVoucherStatus.Name.Contains(status));
                    }
                    if (!string.IsNullOrEmpty(startDate))
                    {
                        DateTime transactionStartDate, transactionEndDate;
                        DateTime.TryParse(startDate, out transactionStartDate);
                        DateTime.TryParse(endDate, out transactionEndDate);
                        filtered = filtered.Where(v => v.ReceivedDate >= transactionStartDate && v.ReceivedDate <= transactionEndDate);
                    }
                    break;
            }
            return filtered;
        }
        private IQueryable<psmsPurchaseOrderHeader> SearchPurchaseOrderTransaction(string mode, Hashtable ht, IQueryable<psmsPurchaseOrderHeader> filtered)
        {
            switch (mode)
            {
                case "search":
                    var startDate = ht["startDate"].ToString();
                    var endDate = ht["endDate"].ToString();
                    var referenceNo = ht["referenceNo"].ToString();
                    var tSearchText = ht["tSearchText"].ToString();

                    var status = ht["status"].ToString();

                    if (!string.IsNullOrEmpty(referenceNo))
                    {
                        filtered = filtered.Where(v => v.VoucherNumber.Contains(referenceNo));
                    }
                    if (!string.IsNullOrEmpty(tSearchText))
                    {
                        filtered = filtered.Where(v =>
                            (v.psmsStore.Name.ToUpper().Contains(tSearchText.ToUpper())) ||
                            (v.lupPurchaseOrderType.Name.ToUpper().Contains(tSearchText.ToUpper())) ||
                            (v.psmsSupplier.Name.ToUpper().Contains(tSearchText.ToUpper())) ||                          
                            (v.coreUser1.FirstName + " " + v.coreUser1.LastName).ToUpper().Contains(tSearchText.ToUpper())                       
                            );
                    }
                    if (!string.IsNullOrEmpty(status))
                    {
                        filtered = filtered.Where(v => v.lupVoucherStatus.Name.Contains(status));
                    }
                    if (!string.IsNullOrEmpty(startDate))
                    {
                        DateTime transactionStartDate, transactionEndDate;
                        DateTime.TryParse(startDate, out transactionStartDate);
                        DateTime.TryParse(endDate, out transactionEndDate);
                        filtered = filtered.Where(v => v.OrderedDate >= transactionStartDate && v.OrderedDate <= transactionEndDate);
                    }
                    break;
            }
            return filtered;
        }

        private void UpdateSourceDetail(Guid sourceVoucherType, Guid headerId, Guid? itemId, decimal updateQuantity)
        {
            if (sourceVoucherType == Guid.Parse(Constants.Voucher_Type_PurchaseRequest))
            {
                var objSourceDetail = _purchaseRequestDetail.GetAll().AsQueryable().Where(o => o.PurchaseRequestHeaderId == headerId && o.ItemId == itemId).FirstOrDefault();
                objSourceDetail.UnprocessedQuantity = objSourceDetail.UnprocessedQuantity - updateQuantity;
            }
            else if (sourceVoucherType == Guid.Parse(Constants.Voucher_Type_PurchaseOrder))
            {
                var objSourceDetail = _purchaseOrderDetail.GetAll().AsQueryable().Where(o => o.PurchaseOrderHeaderId == headerId && o.ItemId == itemId).FirstOrDefault();
                objSourceDetail.RemainingQuantity = objSourceDetail.RemainingQuantity - updateQuantity;
            }
           
        } 
   
        #endregion
    }
}
