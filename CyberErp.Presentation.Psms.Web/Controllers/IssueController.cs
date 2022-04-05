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
    public class IssueController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsIssueHeader> _issueHeader;
        private readonly BaseModel<psmsIssueDetail> _issueDetail;
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
        private readonly Notification _notification;
        private readonly BaseModel<coreVoucherWorkFlow> _voucherWorkFlow;
        private readonly ItemLOTTransaction _itemLOTTransaction;
        private readonly ItemSerialTransaction _itemSerialTransaction;
     
        private Utility _utils;
        Guid postedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Posted);

        Guid certifiedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Certified);
        Guid approvedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Approved);
        Guid partiallyVoucherStatus = Guid.Parse(Constants.Voucher_Status_Partially_Approved);
        Guid rejectedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Rejected);
        Guid voidVoucherStatus = Guid.Parse(Constants.Voucher_Status_Void);
        Guid issuedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Issued);     
        Guid IssueVoucherType = Guid.Parse(Constants.Voucher_Type_StoreIssue);
        private DateTime? fiscalYearStartDate = null;
    
        
        private readonly Lookups _lookup;
        
        private Guid employeeId = Guid.Empty;
        private string employeeName = "";
       
        #endregion
        
        #region Constructor

        public IssueController()
        {
             _context = new ErpEntities(Constants.ConnectionString);
             _issueHeader = new BaseModel<psmsIssueHeader>(_context);
             _issueDetail = new BaseModel<psmsIssueDetail>(_context);
            _item = new BaseModel<psmsItem>(_context);
            _store = new BaseModel<psmsStore>(_context);
            _inventoryRecord = new InventoryRecord(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);
            _unit = new BaseModel<coreUnit>(_context);
            _approver = new BaseModel<psmsApprover>(_context);
            
            _storePermission = new BaseModel<psmsStorePermission>(_context);
            _requestOrderDetail = new BaseModel<psmsRequestOrderDetail>(_context);
            _requestOrderHeader = new BaseModel<psmsRequestOrderHeader>(_context);
            _voucherWorkFlow = new BaseModel<coreVoucherWorkFlow>(_context);
            _itemLOTTransaction = new ItemLOTTransaction(_context);
            _itemSerialTransaction = new ItemSerialTransaction(_context);
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
           
            var objStoreIssue = _issueHeader.Get(o=>o.Id==id);
            var records = new
            {
                objStoreIssue.Id,
                objStoreIssue.RequestOrderHeaderId,
                objStoreIssue.VoucherNumber,
                StoreRequestNumber=objStoreIssue.RequestOrderHeaderId.HasValue?objStoreIssue.psmsRequestOrderHeader.StoreRequisitionHeaderId.HasValue? objStoreIssue.psmsRequestOrderHeader.psmsStoreRequisitionHeader.VoucherNumber:"":"",               
                IssuedDate=objStoreIssue.IssuedDate.ToShortDateString(),
                OrderedBy=objStoreIssue.RequestOrderHeaderId.HasValue?objStoreIssue.psmsRequestOrderHeader.coreUser1.FirstName+" "+objStoreIssue.psmsRequestOrderHeader.coreUser1.LastName:"",
                objStoreIssue.PreparedById,
                objStoreIssue.IssuedById,
                objStoreIssue.ReceivedById,
                objStoreIssue.FiscalYearId,
                FiscalYear=objStoreIssue.coreFiscalYear.Name,
                IssuedBy = objStoreIssue.IssuedById != null ? objStoreIssue.coreUser1.FirstName + " " + objStoreIssue.coreUser1.LastName : "",
                ReceivedBy = objStoreIssue.ReceivedById != null ? objStoreIssue.coreUser2.FirstName + " " + objStoreIssue.coreUser2.LastName : "",
                objStoreIssue.PlateNo,
                objStoreIssue.DriverName,
                objStoreIssue.StatusId,
                objStoreIssue.StoreId,
                objStoreIssue.IsPosted,
                objStoreIssue.ProductionPlanId,
                objStoreIssue.ProductionOrderId,
                ProductionOrder = objStoreIssue.ProductionOrderId.HasValue ? objStoreIssue.PRProductionOrderHeader.VoucherNumber : "",
                ProductionPlan = objStoreIssue.ProductionPlanId.HasValue ? objStoreIssue.PRProductionPlanHeader.VoucherNumber : "",
         
                Store = objStoreIssue.psmsStore != null ? objStoreIssue.psmsStore.Name : "",
                objStoreIssue.Remark,
                objStoreIssue.CreatedAt
            };
            var serialList = _itemSerialTransaction.GetItemSerialTransactionList(objStoreIssue.Id, IssueVoucherType);
            var lotList =_itemLOTTransaction.GetItemLOTList(objStoreIssue.Id, IssueVoucherType);
         
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
                var mode =hashtable["mode"]!=null? hashtable["mode"].ToString():"";
                var isPurchase = hashtable["isPurchase"] != null ? bool.Parse( hashtable["isPurchase"].ToString()) : false;
            
                var userId = Guid.Empty;
                var objUser = (coreUser)Session[Constants.CurrentUser];
                if (objUser != null && objUser.Id != null)
                {
                    employeeId = (Guid)objUser.Id;
                    userId = (Guid)objUser.Id;
                }

                var filtered = _requestOrderHeader.GetAll().AsQueryable().Where(x =>(x.StoreRequisitionHeaderId.HasValue ? x.psmsStoreRequisitionHeader.psmsStore.psmsStorePermission.Where(f => f.UserId == userId).Any() : true));
               
                if (isPurchase)
                    filtered = _requestOrderHeader.GetAll().AsQueryable().Where(x => !x.psmsStoreRequisitionHeader.ConsumerStoreId.HasValue && (x.OrderType == "Purchase Request" || x.OrderType == "Reorder"));
                else
                    filtered = _requestOrderHeader.GetAll().AsQueryable().Where(x => x.OrderType == "Store Issue");
                   
                filtered = SearchTransaction(mode, hashtable,filtered);
                if (mode!="search")
                filtered=filtered.Where( o=>o.StatusId!=voidVoucherStatus && (o.OrderType=="Reorder"?o.psmsRequestOrderDetail.Where(f=>(f.Quantity - f.RemainingQuantity - f.IssuedQuantity)>0).Any():o.psmsRequestOrderDetail.Where(f=>(f.RemainingQuantity - f.IssuedQuantity)>0).Any()));
                switch (sort)
                {
                       case "VoucherNumber":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.StoreRequisitionHeaderId.HasValue ? u.psmsStoreRequisitionHeader.VoucherNumber :"") : filtered.OrderBy(u => u.StoreRequisitionHeaderId.HasValue ? u.psmsStoreRequisitionHeader.VoucherNumber : "");
                        break;
                    case "RequestedDate":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u =>  u.psmsStoreRequisitionHeader.RequestedDate) : filtered.OrderBy(u => u.psmsStoreRequisitionHeader.RequestedDate );
                        break;
                    case "OrderedBy":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.coreUser1.FirstName + " " + u.coreUser1.LastName) : filtered.OrderBy(u => u.coreUser1.FirstName + " " + u.coreUser1.LastName);
                        break;  
                    case "ConsumerType":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.StoreRequisitionHeaderId.HasValue ? u.psmsStoreRequisitionHeader.lupConsumerType.Name : "") : filtered.OrderBy(u => u.StoreRequisitionHeaderId.HasValue ? u.psmsStoreRequisitionHeader.lupConsumerType.Name : "");
                        break;  
                     case "Consumer":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.StoreRequisitionHeaderId.HasValue ? u.psmsStoreRequisitionHeader.ConsumerEmployeeId.HasValue ? u.coreUser.FirstName + " " + u.coreUser.LastName : u.psmsStoreRequisitionHeader.ConsumerStoreId.HasValue ? u.psmsStoreRequisitionHeader.psmsStore1.Name : u.psmsStoreRequisitionHeader.ConsumerUnitId.HasValue ? u.psmsStoreRequisitionHeader.coreUnit.Name : "" : "") : filtered.OrderBy(u => u.StoreRequisitionHeaderId.HasValue ? u.psmsStoreRequisitionHeader.ConsumerEmployeeId.HasValue ? u.coreUser.FirstName + " " + u.coreUser.LastName : u.psmsStoreRequisitionHeader.ConsumerStoreId.HasValue ? u.psmsStoreRequisitionHeader.psmsStore1.Name : u.psmsStoreRequisitionHeader.ConsumerUnitId.HasValue ? u.psmsStoreRequisitionHeader.coreUnit.Name : "" : "");
                        break;  
                     case "Requester":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.StoreRequisitionHeaderId.HasValue ? u.psmsStoreRequisitionHeader.coreUser2.FirstName + " " + u.psmsStoreRequisitionHeader.coreUser2.LastName :"") : filtered.OrderBy(u => u.StoreRequisitionHeaderId.HasValue ? u.psmsStoreRequisitionHeader.coreUser2.FirstName + " " + u.psmsStoreRequisitionHeader.coreUser2.LastName :"");
                        break;
                     case "Remark":
                        filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.Remark) : filtered.OrderBy(u => u.Remark);
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
                    VoucherNumber = item.StoreRequisitionHeaderId.HasValue ? item.psmsStoreRequisitionHeader.VoucherNumber : "",
                    RequestedDate = item.StoreRequisitionHeaderId.HasValue ? item.psmsStoreRequisitionHeader.RequestedDate :DateTime.Now,
                    OrderedBy = item.coreUser1.FirstName + " " + item.coreUser1.LastName,
                    item.StatusId,
                    StoreId=item.StoreRequisitionHeaderId.HasValue ?item.psmsStoreRequisitionHeader.StoreId:Guid.Empty,
                    Store = item.StoreRequisitionHeaderId.HasValue ? item.psmsStoreRequisitionHeader.psmsStore != null ? item.psmsStoreRequisitionHeader.psmsStore.Name : "" : "",
                    Status =item.lupVoucherStatus.Name,
                    ConsumerType = item.StoreRequisitionHeaderId.HasValue ? item.psmsStoreRequisitionHeader.lupConsumerType.Name :"",
                   
                    Consumer = item.StoreRequisitionHeaderId.HasValue ? item.psmsStoreRequisitionHeader.ConsumerEmployeeId.HasValue ? item.psmsStoreRequisitionHeader.coreUser.FirstName + " " + item.psmsStoreRequisitionHeader.coreUser.LastName : item.psmsStoreRequisitionHeader.ConsumerStoreId.HasValue ? item.psmsStoreRequisitionHeader.psmsStore1.Name : item.psmsStoreRequisitionHeader.ConsumerUnitId.HasValue ? item.psmsStoreRequisitionHeader.coreUnit.Name : "" : "",
                    Requester = item.StoreRequisitionHeaderId.HasValue ? item.psmsStoreRequisitionHeader.coreUser2.FirstName + " " + item.psmsStoreRequisitionHeader.coreUser2.LastName : "",
                    RequestedById = item.StoreRequisitionHeaderId.HasValue ? item.psmsStoreRequisitionHeader.RequestedById :Guid.Empty,
                    ConsumerId = item.StoreRequisitionHeaderId.HasValue ? item.psmsStoreRequisitionHeader.ConsumerEmployeeId.HasValue ? item.psmsStoreRequisitionHeader.ConsumerEmployeeId.Value : item.psmsStoreRequisitionHeader.ConsumerStoreId.HasValue ? item.psmsStoreRequisitionHeader.ConsumerStoreId.Value : item.psmsStoreRequisitionHeader.ConsumerUnitId.HasValue ? item.psmsStoreRequisitionHeader.ConsumerUnitId.Value : Guid.Empty : Guid.Empty,
           
                    item.Remark,
                    item.CreatedAt,
                    }).ToList().Select(item => new
                    {
                    item.Id,
                    item.OrderedBy,
                    RequestedDate = item.RequestedDate.ToShortDateString(),
                    item.ConsumerType,
                    item.Consumer,
                    item.Remark,
                    item.Requester,
                    item.RequestedById,
                    item.ConsumerId,
                     item.VoucherNumber,
                    item.StatusId,
                    item.StoreId,
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
                var LastWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == IssueVoucherType).OrderByDescending(o => o.Step).FirstOrDefault();
                var lastVoucherId = LastWorkFlow != null ? LastWorkFlow.VoucherStatusId : Guid.Empty;
                var mode = hashtable["mode"] != null ? hashtable["mode"].ToString() : "";
                var userId = Guid.Empty;
                var objUser = (coreUser)Session[Constants.CurrentUser];
                if (objUser != null && objUser.Id != null)
                {
                    employeeId = (Guid)objUser.Id;
                    userId = (Guid)objUser.Id;
                }

                var filtered = _issueHeader.GetAll().AsQueryable().Where(x =>x.psmsStore.psmsStorePermission.Any()? x.psmsStore.psmsStorePermission.Where(f => f.UserId == userId).Any():true);
         
                if(requestOrderId!=Guid.Empty)
                {
                    filtered = filtered.Where(o => o.RequestOrderHeaderId == requestOrderId);
                }
                filtered = SearchTransactionIssue(mode, hashtable, filtered);
              
                switch (sort)
                {
                      case "VoucherNumber":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.VoucherNumber) : filtered.OrderBy(u => u.VoucherNumber);
                        break;
                    case "IssuedDate":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.IssuedDate) : filtered.OrderBy(u => u.IssuedDate);
                        break;
                    case "IssuedBy":
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
                    IssuedBy = item.coreUser1.FirstName + " " + item.coreUser1.LastName,
                    IsLastStep = lastVoucherId != Guid.Empty ? lastVoucherId == item.StatusId : true,
                    PreparedBy = item.coreUser.FirstName + " " + item.coreUser.LastName,
                    item.StatusId,
                    Store = item.psmsStore.Name,
                    Status = item.lupVoucherStatus.Name,
                    item.StoreId,
                    item.Remark,
                    Approval="Click",
                    item.CreatedAt
                }).ToList().Select(item => new
                {
                    item.Id,
                    item.IssuedBy,
                    item.PreparedBy,
                    IssuedDate = item.IssuedDate.ToShortDateString(),
                    item.VoucherNumber,
                    item.Approval,
                    item.StatusId,
                    item.Store,
                    item.IsLastStep,
                    item.StoreId,
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
                if(action=="storeIssue")
                {
                    var filtered = _issueDetail.GetAll().AsQueryable().Where(d => d.IssueHeaderId == voucherHeaderId).OrderBy(o => o.CreatedAt);
                    var count = filtered.Count();
                    records = filtered.Select(item => new
                    {
                        item.Id,
                        item.IssueHeaderId,
                        Name = item.psmsItem.Name,
                        item.ItemId,
                        item.psmsItem.IsSerialItem,
                        item.psmsItem.IsLOTItem,
                        Code = item.ItemId != null ? item.psmsItem.Code : "",
                        item.StatusId,
                        item.psmsItem.PartNumber,
                        Status = item.lupVoucherStatus.Name,
                        MeasurementUnit = item.ItemId != null ? item.psmsItem.lupMeasurementUnit.Name : "",
                        item.Quantity,
                        item.IssuedQuantity,
                        RemainingQuantity= item.psmsIssueHeader.psmsRequestOrderHeader.psmsRequestOrderDetail.Where(o=>o.ItemId==item.ItemId).Sum(f=>f.RemainingQuantity),
                        AvailableQuantity = item.psmsItem.psmsInventoryRecord.Any() ? item.psmsItem.psmsInventoryRecord.Where(o => o.IsClosed == false && o.StoreId == storeId && o.FiscalYearId == fiscalYearId).Select(f => f.AvailableQuantity).DefaultIfEmpty(0).Sum() : 0,
                        UnitCost = item.psmsItem.psmsInventoryRecord.Any() ? item.psmsItem.psmsInventoryRecord.Where(o => o.IsClosed == false && o.StoreId == storeId && o.FiscalYearId == fiscalYearId).Select(f => f.UnitCost).DefaultIfEmpty(0).Sum() : 0,                
                        item.Remarks,
                    }).ToList().Cast<object>().ToList();
                    var result = new { total = count, data = records };
                    return this.Direct(result);
                }
                else
                {
                    var filtered =_requestOrderDetail.GetAll().AsQueryable().Where(d => d.RequestOrderHeaderId == voucherHeaderId).OrderBy(o => o.CreatedAt);
                    var count = filtered.Count();
                     records = filtered.Select(item => new
                    {
                        item.RequestOrderHeaderId,
                        Name = item.psmsItem.Name,
                        item.ItemId,
                        Code = item.ItemId != null ? item.psmsItem.Code : "",
                        item.psmsItem.IsSerialItem,
                        item.psmsItem.IsLOTItem,
                        item.psmsItem.PartNumber,
                        item.StatusId,
                        Status = item.lupVoucherStatus.Name,
                        MeasurementUnit = item.ItemId != null ? item.psmsItem.lupMeasurementUnit.Name : "",
                        Quantity = item.psmsRequestOrderHeader.OrderType == "Reorder" ? (item.Quantity - item.RemainingQuantity) - item.IssuedQuantity : item.Quantity,
                        RemainingQuantity = item.psmsRequestOrderHeader.OrderType == "Reorder" ? item.Quantity - item.RemainingQuantity - item.IssuedQuantity : item.RemainingQuantity - item.IssuedQuantity,
                        IssuedQuantity = item.psmsRequestOrderHeader.OrderType == "Reorder" ? item.Quantity - item.RemainingQuantity - item.IssuedQuantity : item.RemainingQuantity - item.IssuedQuantity,
                        AvailableQuantity = item.psmsItem.psmsInventoryRecord.Any() ? item.psmsItem.psmsInventoryRecord.Where(o => o.IsClosed == false && o.StoreId == storeId && o.FiscalYearId == fiscalYearId).Select(f => f.AvailableQuantity).DefaultIfEmpty(0).Sum() : 0,
                        UnitCost = item.psmsItem.psmsInventoryRecord.Any() ? item.psmsItem.psmsInventoryRecord.Where(o => o.IsClosed == false && o.StoreId == storeId && o.FiscalYearId == fiscalYearId).Select(f => f.UnitCost).DefaultIfEmpty(0).Sum() : 0,

                    }).ToList().Where(o => o.RemainingQuantity > 0).Cast<object>().ToList(); ;
                     var result = new { total = count, data = records };
                    return this.Direct(result);

                }
                
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }
        public ActionResult GetFilteredStoreRequests(object query)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(JsonConvert.SerializeObject(query));
            int start;
            int.TryParse(hashtable["start"].ToString(), out start);
            int limit;
            int.TryParse(hashtable["limit"].ToString(), out limit);
            var queryparam = hashtable["query"].ToString();

            var filtered = _issueHeader.GetAll().AsQueryable().Where(o => o.VoucherNumber.ToUpper().Contains(queryparam.ToUpper()));
            var count = filtered.Count();
            filtered = filtered.OrderByDescending(o => o.VoucherNumber);
            var stores = filtered.Select(item => new
            {
                item.Id,
                Name = item.VoucherNumber
            });
            var result = new
            {
                total = count,
                data = stores
            };
            return this.Direct(result);
        }
        public DirectResult Void(Guid id)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var objHeader = _issueHeader.Get(o => o.Id == id);
                    if (objHeader.IsPosted == true)
                        return this.Direct(new { success = false, data = "you can't void already posted transaction!" });

                   
                        foreach(var objIssueDetail in objHeader.psmsIssueDetail)
                        {
                            if (objHeader.RequestOrderHeaderId.HasValue)
                            UpdateRequestOrderDetail(objHeader.RequestOrderHeaderId.Value, objIssueDetail.ItemId, -objIssueDetail.IssuedQuantity.Value);
                            objIssueDetail.StatusId = voidVoucherStatus;
                            objIssueDetail.UnitCost = 0;
                            if (objHeader.StatusId == issuedVoucherStatus)
                            UpdateInventoryFromVoidedT(objIssueDetail);
                        }
                        _itemSerialTransaction.VoidItemSerialTransaction(objHeader.Id, IssueVoucherType, objHeader.RequestOrderHeaderId, true);
                        _itemLOTTransaction.VoidItemLOTTransaction(objHeader.Id, IssueVoucherType);
                        _context.SaveChanges();
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
                    var objHeader =_requestOrderHeader.Get(o => o.Id == id);
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
        public ActionResult Save(psmsIssueHeader issueHeader)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var requestOrderDetailsString = hashtable["issueDetails"].ToString();
                    var itemSerialsString = hashtable["itemSerials"].ToString();
                    var itemLOTsString = hashtable["itemLOTs"].ToString();
                    var action = hashtable["action"].ToString();
                    var statusId = issueHeader.StatusId;
                    var voucherno = issueHeader.VoucherNumber;
                    fiscalYearStartDate = _fiscalYear.GetAll().AsQueryable().Where(o => o.Id == issueHeader.FiscalYearId).FirstOrDefault().StartDate;
                
                     if (issueHeader.Id==Guid.Empty)
                    {                       
                      issueHeader.Id = Guid.NewGuid();
                      issueHeader.CreatedAt = DateTime.Now;
                      issueHeader.UpdatedAt = DateTime.Now;                    
                      CyberErp.Presentation.Psms.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Psms.Web.MvcApplication;
                      httpapplication.Application.Lock();
                      if (voucherno == "Draft")
                      issueHeader.VoucherNumber = _utils.GetVoucherNumber("Issue", issueHeader.StoreId);
                      _issueHeader.AddNew(issueHeader);
                      if (voucherno == "Draft")
                      _utils.UpdateVoucherNumber("Issue", issueHeader.StoreId);
                      httpapplication.Application.UnLock();
                      UpdateStatus(issueHeader, action);
                
                    }
                    else
                    {
                        if (action == "revise")
                        {
                            _notification.VoidAllNotification(IssueVoucherType, issueHeader.Id);
                            issueHeader.StatusId = postedVoucherStatus;
                            UpdateStatus(issueHeader, action);
                        }
                        issueHeader.UpdatedAt=DateTime.Now;
                        _issueHeader.Edit(issueHeader);
                    }
                     var isIssue = CheckStatus(issueHeader.StatusId);
                     if (action == "issue")
                     {
                         action = isIssue == true ? "issue" : "post";
                         if (isIssue)
                         {
                             issueHeader.StatusId = issuedVoucherStatus;
                         }
                     } 
                    SaveIssueDetail(issueHeader.Id, requestOrderDetailsString, issueHeader.RequestOrderHeaderId, statusId, action,issueHeader.IssuedDate);
                    if (itemSerialsString != "") _itemSerialTransaction.AddItemSerialTransactions(issueHeader.Id, issueHeader.RequestOrderHeaderId, issueHeader.IssuedDate, IssueVoucherType, issueHeader.VoucherNumber, itemSerialsString, action, true, false, false);
                    if (itemLOTsString != "") _itemLOTTransaction.AddItemLOTsTransaction(issueHeader.Id, IssueVoucherType, issueHeader.VoucherNumber, itemLOTsString, action);
                    if (action == "issue")
                    {
                        _context.SaveChanges();
                        if (issueHeader.RequestOrderHeaderId.HasValue)
                     UpdateRequestOrderHeader(issueHeader.RequestOrderHeaderId.Value,approvedVoucherStatus);
                     issueHeader.StatusId = issuedVoucherStatus;
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
            bool returnValue=false;
            var voucherWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == IssueVoucherType).OrderByDescending(o => o.Step);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == statusId).FirstOrDefault();
            if (currentStep == voucherWorkFlow.FirstOrDefault())
                 returnValue=true;

           return returnValue;
        }
        private void UpdateStatus(psmsIssueHeader issueHeader, string action)
        {
         

            var date = issueHeader.IssuedDate.ToShortDateString();
            var title = "Store Issue(" + issueHeader.VoucherNumber + ")";
            var message = "A new store Issue has be added with voucher no  " + issueHeader.VoucherNumber + "on date " + date + " \n ";


            var voucherWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId ==IssueVoucherType );
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == issueHeader.StatusId).FirstOrDefault();
            if (currentStep == null)
                throw new System.InvalidOperationException("setting error,Please maintain workflow for the store Issue voucher!");
        
            var nextStep = voucherWorkFlow.Where(o => o.Step == currentStep.Step+1).FirstOrDefault();
            if (nextStep != null)
            {
                var approver = _approver.GetAll().AsQueryable().Where(o => o.VoucherTypeId == IssueVoucherType && o.StatusId == nextStep.VoucherStatusId && ((o.StoreId.HasValue ? o.StoreId == issueHeader.StoreId : true)));
              
                if (approver.Count() > 0)
                {
                    string approverIds = "";
                    foreach (var objApprover in approver)
                    {
                        approverIds = approverIds + objApprover.EmployeeId.ToString() + ",";
                    }
                    _notification.SaveNotification(title, message, issueHeader.Id, issueHeader.VoucherNumber, nextStep.VoucherStatusId, IssueVoucherType, approverIds, issueHeader.StoreId, null, "");
                }
            }  

        }
        public void SaveIssueDetail(Guid issueHeaderId, string issueDetailsString, Guid? requestOrderHeaderId, Guid statusId, string action, DateTime transactionDate)
        {
            issueDetailsString = issueDetailsString.Remove(issueDetailsString.Length - 1);
            IList<string> issueDetails = issueDetailsString.Split(new[] { ';' }).ToList();
            IList<psmsIssueDetail> issueDetailList = new List<psmsIssueDetail>();
            var oldsIssueDetailList =_issueDetail.GetAll().AsQueryable().Where(o => o.IssueHeaderId == issueHeaderId);
            var date = DateTime.Now;
            var id = Guid.Empty;
            decimal oldQuantity=0;
            for (var i = 0; i < issueDetails.Count(); i++)
            {
                var issueDetail = issueDetails[i].Split(new[] { ':' });
                var issueDetailId = Guid.Empty;
                Guid.TryParse(issueDetail[0].ToString(), out issueDetailId);
                var objIssueDetail = issueDetailId != Guid.Empty ? _issueDetail.Get(o => o.Id == issueDetailId) : new psmsIssueDetail();
                oldQuantity=objIssueDetail.IssuedQuantity.HasValue?objIssueDetail.IssuedQuantity.Value:0;
                objIssueDetail.IssueHeaderId = issueHeaderId;
                objIssueDetail.ItemId = Guid.Parse(issueDetail[2]);
                objIssueDetail.Quantity = decimal.Parse(issueDetail[3]);
                objIssueDetail.IssuedQuantity = decimal.Parse(issueDetail[4]);            
                objIssueDetail.RemainingQuantity = decimal.Parse(issueDetail[4]);
                objIssueDetail.Remarks = issueDetail[7];
                objIssueDetail.UpdatedAt = DateTime.Now;                
                if (issueDetailId == Guid.Empty)
                {
                    objIssueDetail.Id = Guid.NewGuid();
                    date = date.AddSeconds(2);
                    objIssueDetail.CreatedAt = date;
                    objIssueDetail.StatusId = statusId;
                   _issueDetail.AddNew(objIssueDetail);
                }
                if (action == "issue")
                {
                     UpdateInventory(objIssueDetail, transactionDate);
                }
                if (requestOrderHeaderId != Guid.Empty)
                {
                    decimal quantity = statusId == voidVoucherStatus ? objIssueDetail.IssuedQuantity.Value : objIssueDetail.IssuedQuantity.Value - oldQuantity;
                    UpdateRequestOrderDetail(requestOrderHeaderId, objIssueDetail.ItemId, quantity);
              
                }
               
                 issueDetailList.Add(objIssueDetail);
            }
            DeleteIssueDetail(issueDetailList, oldsIssueDetailList, requestOrderHeaderId);
           
        }
        private void DeleteIssueDetail(IList<psmsIssueDetail> issueDetailList, IQueryable<psmsIssueDetail> oldsIssueDetailList, Guid? requestOrderHeaderId)
        {
            foreach (var objoldsIssueDetail in oldsIssueDetailList)
            {
                var record = issueDetailList.Where(o => o.Id == objoldsIssueDetail.Id);

                if (record.Count() == 0)
                {
                    UpdateRequestOrderDetail(requestOrderHeaderId, objoldsIssueDetail.ItemId, objoldsIssueDetail.Quantity);
                    _issueDetail.Delete(o => o.Id == objoldsIssueDetail.Id);
                }
            }
        }
        private void UpdateRequestOrderDetail(Guid? requestOrderHeaderId, Guid itemId,decimal updateQuantity)
        {
            var objRequestOrderDetail =_requestOrderDetail.GetAll().AsQueryable().Where(o => o.RequestOrderHeaderId == requestOrderHeaderId && o.ItemId == itemId).FirstOrDefault();
            if (objRequestOrderDetail!=null)
                objRequestOrderDetail.IssuedQuantity = objRequestOrderDetail.IssuedQuantity + updateQuantity;
        }
        private void UpdateInventory(psmsIssueDetail issueDetail, DateTime transactionDate)
        {
            var model = new ParameterModel { VoucherId = issueDetail.IssueHeaderId, VoucherTypeId = IssueVoucherType, VoucherNo = issueDetail.psmsIssueHeader.VoucherNumber, ItemId = issueDetail.ItemId, StoreId = issueDetail.psmsIssueHeader.StoreId, FiscalYearId = issueDetail.psmsIssueHeader.FiscalYearId, TransactionDate = transactionDate, Quantity =(double) issueDetail.IssuedQuantity.Value, DamagedQuantity = 0, FiscalYearDate = fiscalYearStartDate };

            var unitCost = _inventoryRecord.IssueInventoryUpdate(model);
           issueDetail.UnitCost = unitCost;
        }
        private void UpdateInventoryFromVoidedT(psmsIssueDetail issueDetail)
        {
            var model = new ParameterModel { VoucherId = issueDetail.IssueHeaderId, VoucherTypeId = IssueVoucherType, VoucherNo = issueDetail.psmsIssueHeader.VoucherNumber, ItemId = issueDetail.ItemId, StoreId = issueDetail.psmsIssueHeader.StoreId, FiscalYearId = issueDetail.psmsIssueHeader.FiscalYearId, TransactionDate = issueDetail.psmsIssueHeader.IssuedDate, Quantity = (double)issueDetail.IssuedQuantity.Value, DamagedQuantity = 0 };

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
        private void UpdateRequestOrderHeader(Guid requestOrderHeaderId,Guid statusId)
        {
            _context.SaveChanges();
            var objRequestOrder = _requestOrderHeader.GetAll().AsQueryable().Where(o => o.Id == requestOrderHeaderId).FirstOrDefault();

           
            var orderType = objRequestOrder.OrderType;

            if (!objRequestOrder.psmsRequestOrderDetail.Where(o => orderType == "Reorder" ? o.IssuedQuantity != o.Quantity - o.RemainingQuantity : o.IssuedQuantity != o.Quantity).Any())
                objRequestOrder.StatusId = statusId;
            else if (objRequestOrder.psmsRequestOrderDetail.Where(o => o.IssuedQuantity > 0).Any())
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
                        filtered = filtered.Where(v =>
                            (
                            v.psmsStoreRequisitionHeader.ConsumerEmployeeId.HasValue ? (v.psmsStoreRequisitionHeader.coreUser.FirstName + " " + v.psmsStoreRequisitionHeader.coreUser.LastName).ToUpper().StartsWith(tSearchText.ToUpper()):
                            v.psmsStoreRequisitionHeader.ConsumerStoreId.HasValue ? v.psmsStoreRequisitionHeader.psmsStore1.Name.ToUpper().Contains(tSearchText.ToUpper()) :
                            v.psmsStoreRequisitionHeader.ConsumerUnitId.HasValue ? v.psmsStoreRequisitionHeader.coreUnit.Name.ToUpper().Contains(tSearchText.ToUpper()) : false
                            ) ||
                           (v.psmsIssueHeader.Where(o => o.VoucherNumber.Contains(tSearchText.ToUpper())).Any()) ||
                            (v.psmsStoreRequisitionHeader.coreUser2.FirstName + " " + v.psmsStoreRequisitionHeader.coreUser2.LastName).ToUpper().Contains(tSearchText.ToUpper()) ||
                            (v.coreUser.FirstName + " " + v.coreUser.LastName).ToUpper().Contains(tSearchText.ToUpper())
                 
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

        private IQueryable<psmsIssueHeader> SearchTransactionIssue(string mode, Hashtable ht, IQueryable<psmsIssueHeader> filtered)
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
                            (v.coreUser2.FirstName + " " + v.coreUser2.LastName).ToUpper().Contains(tSearchText.ToUpper()) ||
                            v.Remark.ToUpper().Contains(tSearchText.ToUpper()) ||
                            v.DriverName.ToUpper().Contains(tSearchText.ToUpper()) ||
                            v.PlateNo.ToUpper().Contains(tSearchText.ToUpper()) ||
                            (v.coreUser.FirstName + " " + v.coreUser.LastName).ToUpper().Contains(tSearchText.ToUpper())||
                            (v.coreUser1.FirstName + " " + v.coreUser1.LastName).ToUpper().Contains(tSearchText.ToUpper())||
                            (v.coreUser2.FirstName + " " + v.coreUser2.LastName).ToUpper().Contains(tSearchText.ToUpper())

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
