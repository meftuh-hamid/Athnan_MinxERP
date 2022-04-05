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
    public class TransferIssueController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsTransferIssueHeader> _transferIssueHeader;
        private readonly BaseModel<psmsTransferIssueDetail> _transferIssueDetail;
        private readonly BaseModel<psmsItem> _item;
        private readonly BaseModel<psmsStore> _store;
        private readonly InventoryRecord _inventoryRecord;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        private readonly BaseModel<coreUnit> _unit;
        private readonly BaseModel<coreUser> _user;
        private readonly BaseModel<psmsApprover> _approver;
        private readonly BaseModel<psmsStorePermission> _storePermission;
        private readonly BaseModel<psmsRequestOrderDetail> _requestOrderDetail;
        private readonly BaseModel<psmsRequestOrderHeader> _requestOrderHeader;
        private readonly BaseModel<coreVoucherWorkFlow> _voucherWorkFlow;
        private readonly ItemLOTTransaction _itemLOTTransaction;
        private readonly ItemSerialTransaction _itemSerialTransaction;
        private readonly Notification _notification;
     
        private Utility _utils;
        Guid postedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Posted);
        Guid certifiedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Certified);
        Guid approvedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Approved);
        Guid partiallyVoucherStatus = Guid.Parse(Constants.Voucher_Status_Partially_Approved);
        Guid rejectedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Rejected);
        Guid voidVoucherStatus = Guid.Parse(Constants.Voucher_Status_Void);
        Guid TransferIssueVoucherType = Guid.Parse(Constants.Voucher_Type_StoreTransferIssue);
        Guid issuedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Issued);
        private DateTime? fiscalYearStartDate = null;
    
   
        private readonly Lookups _lookup;
        private Guid employeeId = Guid.Empty;
        private string employeeName = "";
        private User _objUser;

        #endregion

        #region Constructor

        public TransferIssueController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _transferIssueHeader = new BaseModel<psmsTransferIssueHeader>(_context);
            _transferIssueDetail = new BaseModel<psmsTransferIssueDetail>(_context);
            _item = new BaseModel<psmsItem>(_context);
            _store = new BaseModel<psmsStore>(_context);
            _inventoryRecord = new InventoryRecord(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);
            _unit = new BaseModel<coreUnit>(_context);
            _approver = new BaseModel<psmsApprover>(_context);
            
            _storePermission = new BaseModel<psmsStorePermission>(_context);
            _requestOrderDetail = new BaseModel<psmsRequestOrderDetail>(_context);
            _requestOrderHeader = new BaseModel<psmsRequestOrderHeader>(_context);
            _itemLOTTransaction = new ItemLOTTransaction(_context);
            _itemSerialTransaction = new ItemSerialTransaction(_context);
            _voucherWorkFlow = new BaseModel<coreVoucherWorkFlow>(_context);
            _notification = new Notification(_context);
            _utils = new Utility();
            _lookup = new Lookups(_context);
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

            var objStoreTransferIssue = _transferIssueHeader.Get(o => o.Id == id);
            var records = new
            {
                objStoreTransferIssue.Id,
                objStoreTransferIssue.RequestOrderHeaderId,
                objStoreTransferIssue.VoucherNumber,
                StoreRequestNumber = objStoreTransferIssue.RequestOrderHeaderId.HasValue ? objStoreTransferIssue.psmsRequestOrderHeader.psmsStoreRequisitionHeader.VoucherNumber : "",
                IssuedDate = objStoreTransferIssue.IssuedDate.ToShortDateString(),
                OrderedBy = objStoreTransferIssue.RequestOrderHeaderId.HasValue ? objStoreTransferIssue.psmsRequestOrderHeader.coreUser1.FirstName + " " + objStoreTransferIssue.psmsRequestOrderHeader.coreUser1.LastName : "",
                objStoreTransferIssue.PreparedById,
                objStoreTransferIssue.TransferIssuedById,
                objStoreTransferIssue.ReceivedById,
                objStoreTransferIssue.FiscalYearId,
                FiscalYear = objStoreTransferIssue.coreFiscalYear.Name,
                TransferIssuedBy = objStoreTransferIssue.TransferIssuedById != null ? objStoreTransferIssue.coreUser1.FirstName + " " + objStoreTransferIssue.coreUser1.LastName : "",
                ReceivedBy = objStoreTransferIssue.ReceivedById != null && objStoreTransferIssue.ReceivedById != Guid.Empty ? objStoreTransferIssue.coreUser2.FirstName + " " + objStoreTransferIssue.coreUser2.LastName : "",
               objStoreTransferIssue.StatusId,
                objStoreTransferIssue.FromStoreId,
                objStoreTransferIssue.ToStoreId,
                objStoreTransferIssue.IsPosted,
                objStoreTransferIssue.PlateNo,
                objStoreTransferIssue.DriverName,
                FromStore = objStoreTransferIssue.psmsStore.Name,
                ToStore = objStoreTransferIssue.psmsStore1.Name,
                objStoreTransferIssue.Remark,
                objStoreTransferIssue.CreatedAt
            };
            var serialList = _itemSerialTransaction.GetItemSerialTransactionList(objStoreTransferIssue.Id, TransferIssueVoucherType);
            var lotList = _itemLOTTransaction.GetItemLOTList(objStoreTransferIssue.Id, TransferIssueVoucherType);

            return this.Direct(new
            {
                success = true,
                data = records,
                serialList = serialList,
                lotList = lotList
            });
        }
        public DirectResult GetAllRequestOrderHeader(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                var mode = hashtable["mode"] != null ? hashtable["mode"].ToString() : "";
                var isPurchase = hashtable["isPurchase"] != null ? bool.Parse(hashtable["isPurchase"].ToString()) : false;
            
             
                var userId = Guid.Empty;
                var objUser = (coreUser)Session[Constants.CurrentUser];
                if (objUser != null && objUser.Id != null)
                {
                    employeeId = (Guid)objUser.Id;
                    userId = (Guid)objUser.Id;
                }

               var filtered = _requestOrderHeader.GetAll().AsQueryable().Where(x => (x.psmsStoreRequisitionHeader.psmsStore.psmsStorePermission.Any()? x.psmsStoreRequisitionHeader.psmsStore.psmsStorePermission.Where(f => f.UserId == userId).Any():true));
                
                if (isPurchase)
                    filtered = _requestOrderHeader.GetAll().AsQueryable().Where(x => x.psmsStoreRequisitionHeader.ConsumerStoreId.HasValue && (x.OrderType == "Purchase Request" || x.OrderType == "Reorder"));
                else
                    filtered = _requestOrderHeader.GetAll().AsQueryable().Where(x => x.OrderType == "Transfer Issue");
   
                filtered = SearchTransaction(mode, hashtable, filtered);
                if (mode != "search")
                filtered = filtered.Where(o => o.StatusId != voidVoucherStatus && (o.OrderType == "Reorder" ? o.psmsRequestOrderDetail.Where(f => (f.Quantity - f.RemainingQuantity - f.IssuedQuantity) > 0).Any() : o.psmsRequestOrderDetail.Where(f => (f.RemainingQuantity - f.IssuedQuantity) > 0).Any()));
        
                switch (sort)
                {
                     case "VoucherNumber":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.psmsStoreRequisitionHeader.VoucherNumber) : filtered.OrderBy(u => u.psmsStoreRequisitionHeader.VoucherNumber);
                        break;
                    case "RequestedDate":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.psmsStoreRequisitionHeader.RequestedDate) : filtered.OrderBy(u => u.psmsStoreRequisitionHeader.RequestedDate);
                        break;
                    case "OrderedBy":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.coreUser1.FirstName + " " + u.coreUser1.LastName) : filtered.OrderBy(u => u.coreUser1.FirstName + " " + u.coreUser1.LastName);
                        break;
                    case "ConsumerType":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.psmsStoreRequisitionHeader.lupConsumerType.Name) : filtered.OrderBy(u => u.psmsStoreRequisitionHeader.lupConsumerType.Name);
                        break;
                    case "Consumer":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.psmsStoreRequisitionHeader.ConsumerEmployeeId.HasValue ? u.coreUser.FirstName + " " + u.coreUser.LastName : u.psmsStoreRequisitionHeader.ConsumerStoreId.HasValue ? u.psmsStoreRequisitionHeader.psmsStore1.Name : u.psmsStoreRequisitionHeader.ConsumerUnitId.HasValue ? u.psmsStoreRequisitionHeader.coreUnit.Name : "") : filtered.OrderBy(u => u.psmsStoreRequisitionHeader.lupConsumerType.Name);
                        break;
                    case "Requester":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.psmsStoreRequisitionHeader.coreUser2.FirstName + " " + u.psmsStoreRequisitionHeader.coreUser2.LastName) : filtered.OrderBy(u => u.psmsStoreRequisitionHeader.coreUser2.FirstName + " " + u.psmsStoreRequisitionHeader.coreUser2.LastName);
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
                    item.psmsStoreRequisitionHeader.VoucherNumber,
                    RequestedDate=item.psmsStoreRequisitionHeader.RequestedDate,
                 
                    OrderedBy = item.coreUser1.FirstName + " " + item.coreUser1.LastName,
                    item.StatusId,
                    item.psmsStoreRequisitionHeader.StoreId,
                    Store = item.psmsStoreRequisitionHeader.psmsStore != null ? item.psmsStoreRequisitionHeader.psmsStore.Name : "",
                    Status = item.lupVoucherStatus.Name,
                    ConsumerType = item.psmsStoreRequisitionHeader.lupConsumerType.Name,
                    Consumer = item.StoreRequisitionHeaderId.HasValue ? item.psmsStoreRequisitionHeader.ConsumerEmployeeId.HasValue ? item.psmsStoreRequisitionHeader.coreUser.FirstName + " " + item.psmsStoreRequisitionHeader.coreUser.LastName : item.psmsStoreRequisitionHeader.ConsumerStoreId.HasValue ? item.psmsStoreRequisitionHeader.psmsStore1.Name : item.psmsStoreRequisitionHeader.ConsumerUnitId.HasValue ? item.psmsStoreRequisitionHeader.coreUnit.Name : "": "",
                    Requester = item.psmsStoreRequisitionHeader.coreUser2.FirstName + " " + item.psmsStoreRequisitionHeader.coreUser2.LastName,
                    ToStoreId=item.psmsStoreRequisitionHeader.ConsumerStoreId,
                    item.Remark,
                    item.CreatedAt
                }).ToList().Select(item => new
                {
                    item.Id,
                    item.OrderedBy,
                    RequestedDate = item.RequestedDate,
                    item.ConsumerType,
                    item.Consumer,
                    item.Remark,
                    item.Requester,
                    item.VoucherNumber,
                    item.StatusId,
                    item.StoreId,
                    item.ToStoreId,
                    item.Store,
                    Status = item.Status,
                });
                return this.Direct(new { total = count, data = purchaserequestHeaders });
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
                var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
                var requestOrderId = hashtable["requestOrderId"] != null && hashtable["requestOrderId"] != "" ? Guid.Parse(hashtable["requestOrderId"].ToString()) : Guid.Empty;
                var LastWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == TransferIssueVoucherType).OrderByDescending(o => o.Step).FirstOrDefault();
                var mode = hashtable["mode"] != null ? hashtable["mode"].ToString() : "";
                var userId = Guid.Empty;
                var objUser = (coreUser)Session[Constants.CurrentUser];
                if (objUser != null && objUser.Id != null)
                {
                    employeeId = (Guid)objUser.Id;
                    userId = (Guid)objUser.Id;
                }
              
               
                var filtered = _transferIssueHeader.GetAll().AsQueryable().Where(x => (x.psmsStore.psmsStorePermission.Any()? x.psmsStore.psmsStorePermission.Where(f => f.UserId == userId).Any():true));

                var lastVoucherId = LastWorkFlow != null ? LastWorkFlow.VoucherStatusId : Guid.Empty;
            
                filtered = SearchTransactionIssue(mode, hashtable, filtered);
             
                if (requestOrderId != Guid.Empty)
                {
                    filtered = filtered.Where(o => o.RequestOrderHeaderId == requestOrderId);
                }
                switch (sort)
                {
                     case "VoucherNumber":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.VoucherNumber) : filtered.OrderBy(u => u.VoucherNumber);
                        break;
                    case "IssuedDate":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.IssuedDate) : filtered.OrderBy(u => u.IssuedDate);
                        break;
                    case "FromStore":
                        filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.psmsStore.Name) : filtered.OrderBy(u => u.psmsStore.Name);
                        break;
                    case "ToStore":
                        filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.psmsStore1.Name) : filtered.OrderBy(u => u.psmsStore1.Name);
                        break;

                    case "Remark":
                        filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.Remark) : filtered.OrderBy(u => u.Remark);
                        break;
                    case "TransferIssuedBy":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.coreUser1.FirstName + " " + u.coreUser1.LastName) : filtered.OrderBy(u => u.coreUser1.FirstName + " " + u.coreUser1.LastName);
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
                    item.IssuedDate,
                    TransferIssuedBy = item.coreUser1.FirstName + " " + item.coreUser1.LastName,
                    item.StatusId,
                    IsLastStep = lastVoucherId != Guid.Empty ? lastVoucherId == item.StatusId : true,
                    PreparedBy = item.coreUser.FirstName + " " + item.coreUser.LastName,
                 
                    item.FromStoreId,
                    FromStore = item.psmsStore.Name,
                    ToStore = item.psmsStore1.Name,           
                    Status = item.lupVoucherStatus.Name,
                    item.Remark,
                    item.CreatedAt
                }).ToList().Select(item => new
                {
                    item.Id,
                    item.TransferIssuedBy,
                    IssuedDate = item.IssuedDate.ToShortDateString(),
                    item.PreparedBy,
                    item.Remark,
                    item.VoucherNumber,
                    item.IsLastStep,
                    item.StatusId,
                    item.FromStoreId,
                    FromStore = item.FromStore,
                    ToStore = item.ToStore,           
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
                Guid storeId;
                string action = "";
                Guid.TryParse(hashtable["voucherHeaderId"].ToString(), out voucherHeaderId);
                Guid.TryParse(hashtable["storeId"].ToString(), out storeId);
                action = hashtable["action"].ToString();

                var fiscalYearId = _fiscalYear.GetAll().Where(o => o.IsActive == true && o.IsClosed == false).FirstOrDefault().Id;

                List<object> records = new List<object>();
                if (action == "storeTransferIssue")
                {
                    var filtered = _transferIssueDetail.GetAll().AsQueryable().Where(d => d.TransferIssueHeaderId == voucherHeaderId).OrderBy(o => o.CreatedAt);
                    var count = filtered.Count();
                    records = filtered.Select(item => new
                    {
                        item.Id,
                        item.TransferIssueHeaderId,
                        Name = item.psmsItem.Name,
                        item.ItemId,
                        item.psmsItem.IsSerialItem,
                        item.psmsItem.IsLOTItem,
                        item.psmsItem.PartNumber,
                        Code = item.ItemId != null ? item.psmsItem.Code : "",
                        item.StatusId,
                        Status = item.lupVoucherStatus.Name,
                        MeasurementUnit = item.ItemId != null ? item.psmsItem.lupMeasurementUnit.Name : "",
                        item.Quantity,
                        item.TransferIssuedQuantity,
                        RemainingQuantity =item.psmsTransferIssueHeader.RequestOrderHeaderId.HasValue? item.psmsTransferIssueHeader.psmsRequestOrderHeader.psmsRequestOrderDetail.Where(o => o.ItemId == item.ItemId).Sum(f => f.RemainingQuantity):0,
                        AvailableQuantity = item.psmsItem.psmsInventoryRecord.Where(o => o.IsClosed == false && o.StoreId == storeId && o.FiscalYearId == fiscalYearId).Select(f => f.AvailableQuantity).DefaultIfEmpty(0).Sum(),
                        UnitCost = item.UnitCost,
             
                    }).ToList().Cast<object>().ToList();
                    var result = new { total = count, data = records };
                    return this.Direct(result);
                }
                else
                {
                    var filtered = _requestOrderDetail.GetAll().AsQueryable().Where(d => d.RequestOrderHeaderId == voucherHeaderId).OrderBy(o => o.CreatedAt);
                    var count = filtered.Count();
                    records = filtered.Select(item => new
                    {
                        item.RequestOrderHeaderId,
                        Name = item.psmsItem.Name,
                        item.ItemId,
                        item.psmsItem.IsSerialItem,
                        item.psmsItem.IsLOTItem,                      
                        Code = item.ItemId != null ? item.psmsItem.Code : "",
                        item.psmsItem.PartNumber,
                        item.StatusId,
                        Status = item.lupVoucherStatus.Name,
                        MeasurementUnit = item.ItemId != null ? item.psmsItem.lupMeasurementUnit.Name : "",
                        Quantity = item.psmsRequestOrderHeader.OrderType == "Reorder" ? (item.Quantity - item.RemainingQuantity)-item.IssuedQuantity : item.Quantity,
                        RemainingQuantity = item.psmsRequestOrderHeader.OrderType == "Reorder" ? item.Quantity - item.RemainingQuantity - item.IssuedQuantity : item.RemainingQuantity - item.IssuedQuantity,
                        TransferIssuedQuantity = item.psmsRequestOrderHeader.OrderType == "Reorder" ? item.Quantity - item.RemainingQuantity - item.IssuedQuantity : item.RemainingQuantity - item.IssuedQuantity,
                        AvailableQuantity = item.psmsItem.psmsInventoryRecord.Any() ? item.psmsItem.psmsInventoryRecord.Where(o => o.IsClosed == false && o.StoreId == storeId && o.FiscalYearId == fiscalYearId).Select(f => f.AvailableQuantity).DefaultIfEmpty(0).Sum() : 0,
                        UnitCost = item.psmsItem.psmsInventoryRecord.Any() ? item.psmsItem.psmsInventoryRecord.Where(o => o.IsClosed == false && o.StoreId == storeId && o.FiscalYearId == fiscalYearId).Select(f => f.UnitCost).DefaultIfEmpty(0).Sum() : 0,
             
                    }).Where(o=>o.RemainingQuantity>0).ToList().Cast<object>().ToList(); ;
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
                    var objHeader = _transferIssueHeader.Get(o => o.Id == id);
                    if (objHeader.IsPosted == true)
                        return this.Direct(new { success = false, data = "you can't void already posted transaction!" });


                        foreach (var objTransferIssueDetail in objHeader.psmsTransferIssueDetail)
                        {
                            if (objHeader.RequestOrderHeaderId.HasValue)
                            UpdateRequestOrderDetail(objHeader.RequestOrderHeaderId.Value, objTransferIssueDetail.ItemId, -objTransferIssueDetail.TransferIssuedQuantity.Value);
                            objTransferIssueDetail.StatusId = voidVoucherStatus;
                            objTransferIssueDetail.UnitCost = 0;
                            if (objHeader.StatusId == issuedVoucherStatus)                   
                            UpdateInventoryFromVoidedT(objTransferIssueDetail);
                        }
                        _itemSerialTransaction.VoidItemSerialTransaction(objHeader.Id, TransferIssueVoucherType,Guid.Empty,true);
                        _itemLOTTransaction.VoidItemLOTTransaction(objHeader.Id, TransferIssueVoucherType);
                        if (objHeader.RequestOrderHeaderId.HasValue)
                        UpdateRequestOrderHeader(objHeader.RequestOrderHeaderId.Value, postedVoucherStatus);              
               
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
        public DirectResult VoidRequisitionOrder(Guid id)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var objHeader = _requestOrderHeader.Get(o => o.Id == id);
                    foreach (var objRequestOrderDetail in objHeader.psmsRequestOrderDetail)
                    {
                        objRequestOrderDetail.StatusId = voidVoucherStatus;
                        var objStoreRequisitionDetail = objHeader.psmsStoreRequisitionHeader.psmsStoreRequisitionDetail.Where(o => (objRequestOrderDetail.ItemId != null ? o.ItemId == objRequestOrderDetail.ItemId : o.Description == objRequestOrderDetail.Description)).FirstOrDefault();
                        objStoreRequisitionDetail.UnprocessedQuantity = objStoreRequisitionDetail.UnprocessedQuantity + objRequestOrderDetail.Quantity;
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
        public ActionResult Save(psmsTransferIssueHeader transferIssueHeader)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var requestOrderDetailsString = hashtable["transferIssueDetails"].ToString();
                    var itemSerialsString = hashtable["itemSerials"].ToString();
                    var itemLOTsString = hashtable["itemLOTs"].ToString();
                    var param = hashtable["otherParam"] != null ? hashtable["otherParam"].ToString() : "";
                   
                    var action = hashtable["action"].ToString();
                    var statusId = transferIssueHeader.StatusId;
                    var voucherno = transferIssueHeader.VoucherNumber;
                    fiscalYearStartDate = _fiscalYear.GetAll().AsQueryable().Where(o => o.Id == transferIssueHeader.FiscalYearId).FirstOrDefault().StartDate;
                   
                    if (transferIssueHeader.Id == Guid.Empty)
                    {
                        transferIssueHeader.Id = Guid.NewGuid();
                        transferIssueHeader.CreatedAt = DateTime.Now;
                        transferIssueHeader.UpdatedAt = DateTime.Now;
                        CyberErp.Presentation.Psms.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Psms.Web.MvcApplication;
                        httpapplication.Application.Lock();
                        if (voucherno=="Draft")
                        transferIssueHeader.VoucherNumber =_utils.GetVoucherNumber("Transfer Issue", transferIssueHeader.FromStoreId);
                        _transferIssueHeader.AddNew(transferIssueHeader);
                        if (voucherno == "Draft")
                        _utils.UpdateVoucherNumber("Transfer Issue", transferIssueHeader.FromStoreId);
                        httpapplication.Application.UnLock();
                        UpdateStatus(transferIssueHeader, action);
                
                    }
                    else
                    {
                        if (action == "revise")
                        {
                            _notification.VoidAllNotification(TransferIssueVoucherType, transferIssueHeader.Id);
                            transferIssueHeader.StatusId = postedVoucherStatus;
                            UpdateStatus(transferIssueHeader, action);
                        }
                        transferIssueHeader.UpdatedAt = DateTime.Now;                      
                        _transferIssueHeader.Edit(transferIssueHeader);
                    }
                    var isIssue = CheckStatus(transferIssueHeader.StatusId);
                    if (action == "issue")
                    {
                        action = isIssue == true ? "issue" : "post";
                        if (isIssue)
                        {
                            transferIssueHeader.StatusId = issuedVoucherStatus;
                        }
                    } 
                    SaveTransferIssueDetail(transferIssueHeader.Id, requestOrderDetailsString, transferIssueHeader.RequestOrderHeaderId, statusId, action, transferIssueHeader.IssuedDate, param);
                    if (itemSerialsString != "") _itemSerialTransaction.AddItemSerialTransactions(transferIssueHeader.Id, transferIssueHeader.RequestOrderHeaderId, transferIssueHeader.IssuedDate, TransferIssueVoucherType, transferIssueHeader.VoucherNumber, itemSerialsString, action, true, false, false);
                    if (itemLOTsString != "") _itemLOTTransaction.AddItemLOTsTransaction(transferIssueHeader.Id, TransferIssueVoucherType, transferIssueHeader.VoucherNumber, itemLOTsString, action);
                    if (action == "issue")
                    {
                        if (transferIssueHeader.RequestOrderHeaderId.HasValue)                     
                        UpdateRequestOrderHeader(transferIssueHeader.RequestOrderHeaderId.Value, approvedVoucherStatus);
                        transferIssueHeader.StatusId = issuedVoucherStatus;
                
                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Direct(new { success = true, data = "Data has been added successfully!" });

                }
                catch (System.Exception ex)
                {
                    return this.Direct(new { success = false, data = ex.InnerException != null ? ex.InnerException.Message : ex.Message, erroName = ex.Message });
                }
            }
        }

        #endregion

        #region Methods

        private bool CheckStatus(Guid statusId)
        {
            bool returnValue = false;
            var voucherWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == TransferIssueVoucherType).OrderByDescending(o => o.Step);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == statusId).FirstOrDefault();
            if (currentStep == voucherWorkFlow.FirstOrDefault())
                returnValue = true;

            return returnValue;
        }
        private void UpdateStatus(psmsTransferIssueHeader transferIssueHeader, string action)
        {


            var date = transferIssueHeader.IssuedDate.ToShortDateString();
            var title = "Transfer Issue(" + transferIssueHeader.VoucherNumber + ")";
            var message = "A new transfer Issue has be added with voucher no  " + transferIssueHeader.VoucherNumber + "on date " + date + " \n ";


            var voucherWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == TransferIssueVoucherType);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == transferIssueHeader.StatusId).FirstOrDefault();
            if (currentStep == null)
                throw new System.InvalidOperationException("setting error,Please maintain workflow for the store transfer issue voucher!");
        
            var nextStep = voucherWorkFlow.Where(o => o.Step == currentStep.Step+1).FirstOrDefault();
            if (nextStep != null)
            {
                var approver = _approver.GetAll().AsQueryable().Where(o => o.VoucherTypeId == TransferIssueVoucherType && o.StatusId == nextStep.VoucherStatusId && ((o.StoreId.HasValue ? o.StoreId == transferIssueHeader.FromStoreId : true)));
             
                if (approver.Count() > 0)
                {
                    string approverIds = "";
                    foreach (var objApprover in approver)
                    {
                        approverIds = approverIds + objApprover.EmployeeId.ToString() + ",";
                    }
                    _notification.SaveNotification(title, message, transferIssueHeader.Id, transferIssueHeader.VoucherNumber, nextStep.VoucherStatusId, TransferIssueVoucherType, approverIds, transferIssueHeader.FromStoreId, null, "");

                }


            }

        }

        public void SaveTransferIssueDetail(Guid transferIssueHeaderId, string transferIssueDetailsString, Guid? requestOrderHeaderId, Guid statusId, string action, DateTime transactionDate, string param)
        {
            transferIssueDetailsString = transferIssueDetailsString.Remove(transferIssueDetailsString.Length - 1);
            IList<string> transferIssueDetails = transferIssueDetailsString.Split(new[] { ';' }).ToList();
            IList<psmsTransferIssueDetail> transferIssueDetailList = new List<psmsTransferIssueDetail>();
            var oldsTransferIssueDetailList = _transferIssueDetail.GetAll().AsQueryable().Where(o => o.TransferIssueHeaderId == transferIssueHeaderId);
            decimal unitCost = 0;
            for (var i = 0; i < transferIssueDetails.Count(); i++)
            {
                var transferIssueDetail = transferIssueDetails[i].Split(new[] { ':' });
                var transferIssueDetailId = Guid.Empty;
                Guid.TryParse(transferIssueDetail[0].ToString(), out transferIssueDetailId);
                decimal oldQuantity = 0;
             
                var objTransferIssueDetail = transferIssueDetailId != Guid.Empty ? _transferIssueDetail.Get(o => o.Id == transferIssueDetailId) : new psmsTransferIssueDetail();
                oldQuantity =objTransferIssueDetail.TransferIssuedQuantity.HasValue? objTransferIssueDetail.TransferIssuedQuantity.Value:0;
                objTransferIssueDetail.TransferIssueHeaderId = transferIssueHeaderId;
                objTransferIssueDetail.ItemId = Guid.Parse(transferIssueDetail[2]);
                objTransferIssueDetail.Quantity = decimal.Parse(transferIssueDetail[3]);
                objTransferIssueDetail.TransferIssuedQuantity = decimal.Parse(transferIssueDetail[4]);
                objTransferIssueDetail.RemainingQuantity = decimal.Parse(transferIssueDetail[4]);
                if (decimal.TryParse(transferIssueDetail[7], out unitCost))
                    objTransferIssueDetail.UnitCost = unitCost;
                 objTransferIssueDetail.UpdatedAt = DateTime.Now;
                if (transferIssueDetailId == Guid.Empty)
                {
                    objTransferIssueDetail.Id = Guid.NewGuid();
                    objTransferIssueDetail.CreatedAt = DateTime.Now.AddSeconds(2);
                    objTransferIssueDetail.StatusId = statusId;
                    _transferIssueDetail.AddNew(objTransferIssueDetail);
                }
                if (action == "issue")
                {
                       UpdateInventory(objTransferIssueDetail, transactionDate, param);
                }
                if (requestOrderHeaderId != null && requestOrderHeaderId != Guid.Empty)
                {
                    decimal quantity = statusId == voidVoucherStatus ? objTransferIssueDetail.TransferIssuedQuantity.Value : objTransferIssueDetail.TransferIssuedQuantity.Value - oldQuantity;
                    UpdateRequestOrderDetail(requestOrderHeaderId.Value, objTransferIssueDetail.ItemId,quantity);
               
                }
               
                transferIssueDetailList.Add(objTransferIssueDetail);
            }
            DeleteTransferIssueDetail(transferIssueDetailList, oldsTransferIssueDetailList, requestOrderHeaderId);

        }
        private void DeleteTransferIssueDetail(IList<psmsTransferIssueDetail> transferIssueDetailList, IQueryable<psmsTransferIssueDetail> oldsTransferIssueDetailList, Guid? requestOrderHeaderId)
        {
            foreach (var objoldsTransferIssueDetail in oldsTransferIssueDetailList)
            {
                var record = transferIssueDetailList.Where(o => o.Id == objoldsTransferIssueDetail.Id);

                if (record.Count() == 0)
                {
                    if (requestOrderHeaderId != null && requestOrderHeaderId != Guid.Empty)                 
                    UpdateRequestOrderDetail(requestOrderHeaderId.Value, objoldsTransferIssueDetail.ItemId, objoldsTransferIssueDetail.Quantity);
                    _transferIssueDetail.Delete(o => o.Id == objoldsTransferIssueDetail.Id);
                }
            }
        }
        private void UpdateRequestOrderDetail(Guid requestOrderHeaderId, Guid itemId, decimal updateQuantity)
        {
            var objRequestOrderDetail = _requestOrderDetail.GetAll().AsQueryable().Where(o => o.RequestOrderHeaderId == requestOrderHeaderId && o.ItemId == itemId).FirstOrDefault();
            objRequestOrderDetail.IssuedQuantity = objRequestOrderDetail.IssuedQuantity + updateQuantity;
        }
        private void UpdateInventory(psmsTransferIssueDetail transferIssueDetail, DateTime transactionDate, string param)
        {
            var model = new ParameterModel { VoucherId = transferIssueDetail.TransferIssueHeaderId, VoucherTypeId = TransferIssueVoucherType, VoucherNo = transferIssueDetail.psmsTransferIssueHeader.VoucherNumber, ItemId = transferIssueDetail.ItemId, StoreId = transferIssueDetail.psmsTransferIssueHeader.FromStoreId, FiscalYearId = transferIssueDetail.psmsTransferIssueHeader.FiscalYearId, TransactionDate = transactionDate, Quantity = (double)transferIssueDetail.TransferIssuedQuantity.Value, DamagedQuantity = 0, param = param, FiscalYearDate = fiscalYearStartDate };

            var unitCost = _inventoryRecord.IssueInventoryUpdate(model);
            transferIssueDetail.UnitCost = unitCost;
        }
        private void UpdateInventoryFromVoidedT(psmsTransferIssueDetail transferIssueDetail)
        {
            var model = new ParameterModel { VoucherId = transferIssueDetail.TransferIssueHeaderId, VoucherTypeId = TransferIssueVoucherType, VoucherNo = transferIssueDetail.psmsTransferIssueHeader.VoucherNumber, ItemId = transferIssueDetail.ItemId, StoreId = transferIssueDetail.psmsTransferIssueHeader.FromStoreId, FiscalYearId = transferIssueDetail.psmsTransferIssueHeader.FiscalYearId, TransactionDate = transferIssueDetail.psmsTransferIssueHeader.IssuedDate, Quantity = (double)transferIssueDetail.TransferIssuedQuantity.Value, DamagedQuantity = 0 };

            _inventoryRecord.IssueInventoryUpdateFromVoidedT(model);
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
        private void UpdateRequestOrderHeader(Guid requestOrderHeaderId, Guid statusId)
        {
            _context.SaveChanges();
            var objRequestOrder = _requestOrderHeader.GetAll().AsQueryable().Where(o => o.Id == requestOrderHeaderId).FirstOrDefault();

            var orderType=objRequestOrder.OrderType;

            if (!objRequestOrder.psmsRequestOrderDetail.Where(o => orderType == "Reorder" ? o.IssuedQuantity!=o.Quantity- o.RemainingQuantity : o.IssuedQuantity != o.Quantity).Any())
                objRequestOrder.StatusId = statusId;
            else if (objRequestOrder.psmsRequestOrderDetail.Where(o =>o.IssuedQuantity>0).Any())
                objRequestOrder.StatusId = partiallyVoucherStatus;
            else
                objRequestOrder.StatusId = statusId;

        }
    
        private IQueryable<psmsRequestOrderHeader> SearchTransaction(string mode, Hashtable ht, IQueryable<psmsRequestOrderHeader> filtered)
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
                        filtered = filtered.Where(v => v.psmsStoreRequisitionHeader.VoucherNumber.Contains(referenceNo));
                    }
                    if (!string.IsNullOrEmpty(tSearchText))
                    {
                        filtered = filtered.Where(v => v.psmsRequestOrderDetail.Where(f =>
                            (f.ItemId.HasValue ? f.psmsItem.Name.ToUpper().StartsWith(tSearchText.ToUpper()) : f.Description.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            (f.ItemId.HasValue ? f.psmsItem.Code.ToUpper().StartsWith(tSearchText.ToUpper()) : false)).Any() ||
                            (
                            v.psmsStoreRequisitionHeader.ConsumerEmployeeId.HasValue ? (v.psmsStoreRequisitionHeader.coreUser.FirstName + " " + v.psmsStoreRequisitionHeader.coreUser.LastName).ToUpper().StartsWith(tSearchText.ToUpper()) :
                            v.psmsStoreRequisitionHeader.ConsumerStoreId.HasValue ? v.psmsStoreRequisitionHeader.psmsStore1.Name.ToUpper().StartsWith(tSearchText.ToUpper()) :
                            v.psmsStoreRequisitionHeader.ConsumerUnitId.HasValue ? v.psmsStoreRequisitionHeader.coreUnit.Name.ToUpper().StartsWith(tSearchText.ToUpper()) : false
                            ) ||
                            (v.psmsTransferIssueHeader.Where(o=>o.VoucherNumber.StartsWith(tSearchText.ToUpper())).Any())||
                            (v.psmsStoreRequisitionHeader.coreUser2.FirstName + " " + v.psmsStoreRequisitionHeader.coreUser2.LastName).ToUpper().StartsWith(tSearchText.ToUpper())||
                            (v.coreUser.FirstName + " " + v.coreUser.LastName).ToUpper().StartsWith(tSearchText.ToUpper())
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
                        filtered = filtered.Where(v => v.psmsStoreRequisitionHeader.RequestedDate >= transactionStartDate && v.psmsStoreRequisitionHeader.RequestedDate <= transactionEndDate);
                    }
                    break;
            }
            return filtered;      

        }
        private IQueryable<psmsTransferIssueHeader> SearchTransactionIssue(string mode, Hashtable ht, IQueryable<psmsTransferIssueHeader> filtered)
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
                        filtered = filtered.Where(v => v.psmsTransferIssueDetail.Where(f =>
                            (f.psmsItem.Name.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            (f.psmsItem.Code.ToUpper().StartsWith(tSearchText.ToUpper()))).Any() ||
                            (v.coreUser2.FirstName + " " + v.coreUser2.LastName).ToUpper().StartsWith(tSearchText.ToUpper()) ||
                            v.Remark.ToUpper().StartsWith(tSearchText.ToUpper()) ||
                            v.psmsStore.Name.ToUpper().StartsWith(tSearchText.ToUpper()) ||
                            v.psmsStore1.Name.ToUpper().StartsWith(tSearchText.ToUpper()) ||
                            v.DriverName.ToUpper().StartsWith(tSearchText.ToUpper()) ||
                            v.PlateNo.ToUpper().StartsWith(tSearchText.ToUpper()) ||
                            (v.coreUser.FirstName + " " + v.coreUser.LastName).ToUpper().StartsWith(tSearchText.ToUpper())

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
                        filtered = filtered.Where(v => v.IssuedDate >= transactionStartDate && v.IssuedDate <= transactionEndDate);
                    }
                    break;
            }
            return filtered;
        }

   
        #endregion
    }
}
