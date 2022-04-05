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
    public class TransferReceiveController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsTransferReceiveHeader> _transferReceiveHeader;
        private readonly BaseModel<psmsTransferReceiveDetail> _transferReceiveDetail;
        private readonly BaseModel<psmsItem> _item;
        private readonly BaseModel<psmsStore> _store;
        private readonly InventoryRecord _inventoryRecord;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        private readonly BaseModel<coreUnit> _unit;
        private readonly BaseModel<coreUser> _user;
        private readonly BaseModel<psmsApprover> _approver;
        private readonly BaseModel<psmsStorePermission> _storePermission;
        private readonly BaseModel<psmsTransferIssueDetail> _transferIssueDetail;
        private readonly BaseModel<psmsTransferIssueHeader> _transferIssueHeader;
        private readonly BaseModel<coreVoucherWorkFlow> _voucherWorkFlow;
        private readonly Notification _notification;
        private Utility _utils;
        Guid postedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Posted);
        Guid certifiedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Certified);
        Guid approvedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Approved);
        Guid partiallyVoucherStatus = Guid.Parse(Constants.Voucher_Status_Partially_Approved);
        Guid rejectedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Rejected);
        Guid voidVoucherStatus = Guid.Parse(Constants.Voucher_Status_Void);
        Guid TransferReceiveVoucherType = Guid.Parse(Constants.Voucher_Type_StoreTransferReceive);
        Guid receivedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Receive);
        Guid issuedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Issued);

    
        private readonly Lookups _lookup;
        private Guid employeeId = Guid.Empty;
        private string employeeName = "";
        private DateTime? fiscalYearStartDate = null;
     
        private User _objUser;

        #endregion

        #region Constructor

        public TransferReceiveController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _transferReceiveHeader = new BaseModel<psmsTransferReceiveHeader>(_context);
            _transferReceiveDetail = new BaseModel<psmsTransferReceiveDetail>(_context);
            _item = new BaseModel<psmsItem>(_context);
            _store = new BaseModel<psmsStore>(_context);
            _inventoryRecord = new InventoryRecord(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);
            _unit = new BaseModel<coreUnit>(_context);
            _approver = new BaseModel<psmsApprover>(_context);
            _storePermission = new BaseModel<psmsStorePermission>(_context);
            _transferIssueDetail = new BaseModel<psmsTransferIssueDetail>(_context);
            _transferIssueHeader = new BaseModel<psmsTransferIssueHeader>(_context);
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

            var objStoreTransferReceive = _transferReceiveHeader.Get(o => o.Id == id);
            var purchaseRequest = new
            {
                objStoreTransferReceive.Id,
                objStoreTransferReceive.TransferIssueHeaderId,
                objStoreTransferReceive.VoucherNumber,
                StoreRequestNumber = objStoreTransferReceive.TransferIssueHeaderId.HasValue && objStoreTransferReceive.psmsTransferIssueHeader.RequestOrderHeaderId.HasValue ? objStoreTransferReceive.psmsTransferIssueHeader.psmsRequestOrderHeader.psmsStoreRequisitionHeader.VoucherNumber : "",
              
                TransferIssueNumber = objStoreTransferReceive.TransferIssueHeaderId.HasValue ? objStoreTransferReceive.psmsTransferIssueHeader.VoucherNumber : "",
                ReceivedDate = objStoreTransferReceive.ReceivedDate.ToShortDateString(),
             
                TransferIssuedBy = objStoreTransferReceive.TransferIssueHeaderId.HasValue ? objStoreTransferReceive.psmsTransferIssueHeader.coreUser1.FirstName + " " + objStoreTransferReceive.psmsTransferIssueHeader.coreUser1.LastName : "",
               
                objStoreTransferReceive.PreparedById,
                objStoreTransferReceive.ReceivedById,
                objStoreTransferReceive.FiscalYearId,
                FiscalYear = objStoreTransferReceive.coreFiscalYear.Name,
                ReceivedBy = objStoreTransferReceive.ReceivedById != null && objStoreTransferReceive.ReceivedById != Guid.Empty ? objStoreTransferReceive.coreUser1.FirstName + " " + objStoreTransferReceive.coreUser1.LastName : "",
                
                objStoreTransferReceive.StatusId,
                objStoreTransferReceive.PlateNo,
                objStoreTransferReceive.DriverName,
                objStoreTransferReceive.FromStoreId,
                objStoreTransferReceive.ToStoreId,
                objStoreTransferReceive.IsPosted,
                FromStore = objStoreTransferReceive.psmsStore.Name,
                ToStore = objStoreTransferReceive.psmsStore1.Name,
                objStoreTransferReceive.Remark,
                objStoreTransferReceive.CreatedAt
            };
            return this.Direct(new
            {
                success = true,
                data = purchaseRequest
            });
        }
        public DirectResult GetAllTransferIssueHeader(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
                var mode = hashtable["mode"] != null ? hashtable["mode"].ToString() : "";
            
                var userId = Guid.Empty;
                var objUser = (coreUser)Session[Constants.CurrentUser];
                if (objUser != null && objUser.Id != null)
                {
                    employeeId = (Guid)objUser.Id;
                    userId = (Guid)objUser.Id;
                }

                var filtered = _transferIssueHeader.GetAll().AsQueryable().Where(x => x.StatusId==issuedVoucherStatus && (x.psmsStore1.psmsStorePermission.Any()? x.psmsStore1.psmsStorePermission.Where(f => f.UserId == userId).Any():true));
              
                filtered = SearchTransaction(mode, hashtable, filtered);
                filtered = filtered.Where(o => o.psmsTransferIssueDetail.Where(f => f.RemainingQuantity > 0).Any());
                filtered = filtered.Where(o => o.psmsTransferIssueDetail.Where(f => f.RemainingQuantity > 0).Any());
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
                    StoreRequestNumber=item.RequestOrderHeaderId.HasValue? item.psmsRequestOrderHeader.psmsStoreRequisitionHeader.VoucherNumber:"",
                    TransferIssuedBy = item.coreUser1.FirstName + " " + item.coreUser1.LastName,
                    item.ReceivedById,
                    ReceivedBy = item.coreUser2.FirstName + " " + item.coreUser2.LastName,
                    item.StatusId,
                    item.FromStoreId,
                    item.ToStoreId,
                    item.DriverName,
                    item.PlateNo,
                    item.TransferIssuedById,
                    FromStore =item.psmsStore.Name ,
                    ToStore =item.psmsStore1.Name,                
                    Status = item.lupVoucherStatus.Name,
                    ConsumerType =item.RequestOrderHeaderId.HasValue? item.psmsRequestOrderHeader.psmsStoreRequisitionHeader.lupConsumerType.Name:"",
                    Consumer = item.RequestOrderHeaderId.HasValue?item.psmsRequestOrderHeader.psmsStoreRequisitionHeader.ConsumerEmployeeId.HasValue ? item.coreUser.FirstName + " " + item.coreUser.LastName : item.psmsRequestOrderHeader.psmsStoreRequisitionHeader.ConsumerStoreId.HasValue ? item.psmsRequestOrderHeader.psmsStoreRequisitionHeader.psmsStore1.Name : item.psmsRequestOrderHeader.psmsStoreRequisitionHeader.ConsumerUnitId.HasValue ? item.psmsRequestOrderHeader.psmsStoreRequisitionHeader.coreUnit.Name : "":"",
                    Requester =item.RequestOrderHeaderId.HasValue? item.psmsRequestOrderHeader.psmsStoreRequisitionHeader.coreUser2.FirstName + " " + item.psmsRequestOrderHeader.psmsStoreRequisitionHeader.coreUser2.LastName:"",
                    item.Remark,
                    IsReceived=false,
                    item.CreatedAt
                }).ToList().Select(item => new
                {
                    item.Id,
                    item.TransferIssuedBy,
                    item.ReceivedBy,
                    item.Remark,
                    item.StoreRequestNumber,
                    IssuedDate=item.IssuedDate.ToShortDateString(),
                    RequestedDate = "",
                    item.ConsumerType,
                    item.Consumer,
                    item.Requester,
                    item.VoucherNumber,
                    item.DriverName,
                    item.ReceivedById,
                    item.TransferIssuedById,
                    item.PlateNo,
                    item.StatusId,
                    item.FromStoreId,
                    item.ToStoreId,
                    item.FromStore,
                    item.ToStore,
                    item.IsReceived,
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
                var transferIssueId = hashtable["transferIssueId"] != null && hashtable["transferIssueId"] != "" ? Guid.Parse(hashtable["transferIssueId"].ToString()) : Guid.Empty;
                var LastWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == TransferReceiveVoucherType).OrderByDescending(o => o.Step).FirstOrDefault();
                var mode = hashtable["mode"] != null ? hashtable["mode"].ToString() : "";
            
              
                var lastVoucherId = LastWorkFlow != null ? LastWorkFlow.VoucherStatusId : Guid.Empty;
          
                 var userId = Guid.Empty;
                var objUser = (coreUser)Session[Constants.CurrentUser];
                if (objUser != null && objUser.Id != null)
                {
                    employeeId = (Guid)objUser.Id;
                    userId = (Guid)objUser.Id;
                }


                var filtered = _transferReceiveHeader.GetAll().AsQueryable().Where(x => (x.psmsStore1.psmsStorePermission.Any() ? x.psmsStore1.psmsStorePermission.Where(f => f.UserId == userId).Any() : true));

                filtered = SearchTransactionReceive(mode, hashtable, filtered);
                
                switch (sort)
                {
                     case "VoucherNumber":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.VoucherNumber) : filtered.OrderBy(u => u.VoucherNumber);
                        break;
                    case "FromStore":
                        filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.psmsStore.Name) : filtered.OrderBy(u => u.psmsStore.Name);
                        break;
                    case "ToStore":
                        filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.psmsStore1.Name) : filtered.OrderBy(u => u.psmsStore1.Name);
                        break;
                    case "TransferoutNo":
                        filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.TransferIssueHeaderId.HasValue ? u.psmsTransferIssueHeader.VoucherNumber : "") : filtered.OrderBy(u => u.TransferIssueHeaderId.HasValue ? u.psmsTransferIssueHeader.VoucherNumber : "");
                        break;
                    case "ReceivedDate":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.ReceivedDate) : filtered.OrderBy(u => u.ReceivedDate);
                        break;
                    case "TransferReceivedBy":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.coreUser1.FirstName + " " + u.coreUser1.LastName) : filtered.OrderBy(u => u.coreUser1.FirstName + " " + u.coreUser1.LastName);
                        break;
                    default:
                        filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.CreatedAt) : filtered.OrderBy(u => u.CreatedAt);
                        break;

                }
                var count = filtered.Count();
                filtered = filtered.Skip(start).Take(limit);
                var purchaserequestHeaders = filtered.Select(item => new
                {
                    item.Id,
                    item.VoucherNumber,
                    TransferoutNo=item.TransferIssueHeaderId.HasValue?item.psmsTransferIssueHeader.VoucherNumber:"",
                    item.ReceivedDate,
                    TransferReceivedBy =item.ReceivedById!=Guid.Empty? item.coreUser1.FirstName + " " + item.coreUser1.LastName:"",
                    item.StatusId,
                    item.FromStoreId,
                    item.ToStoreId,
                    IsLastStep = lastVoucherId != Guid.Empty ? lastVoucherId == item.StatusId : true,
                    PreparedBy = item.coreUser.FirstName + " " + item.coreUser.LastName,
                 
                    FromStore = item.psmsStore.Name,
                    ToStore = item.psmsStore1.Name,           
                    Status = item.lupVoucherStatus.Name,
                    item.Remark,
                    item.CreatedAt
                }).ToList().Select(item => new
                {
                    item.Id,
                    item.TransferReceivedBy,
                    item.TransferoutNo,
                    ReceivedDate = item.ReceivedDate.ToShortDateString(),
                    item.VoucherNumber,
                    item.StatusId,
                    item.IsLastStep,
                    item.PreparedBy,
                    item.FromStoreId,
                    item.ToStoreId,
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
                Guid voucherHeaderId=Guid.Empty;
                string action = "";
                if (hashtable["voucherHeaderId"]!=null)
                Guid.TryParse(hashtable["voucherHeaderId"].ToString(), out voucherHeaderId);
                action = hashtable["action"].ToString();

                List<object> records = new List<object>();
                if (action == "storeTransferReceive")
                {
                    var filtered = _transferReceiveDetail.GetAll().AsQueryable().Where(d => d.TransferReceiveHeaderId == voucherHeaderId).OrderBy(o => o.CreatedAt);
                    var count = filtered.Count();
                    records = filtered.Select(item => new
                    {
                        item.Id,
                        item.TransferReceiveHeaderId,
                        Name = item.psmsItem.Name,
                        item.ItemId,
                        Code = item.ItemId != null ? item.psmsItem.Code : "",
                        item.StatusId,
                        item.UnitCost,
                        item.psmsItem.PartNumber,
                        Status = item.lupVoucherStatus.Name,
                        MeasurementUnit = item.ItemId != null ? item.psmsItem.lupMeasurementUnit.Name : "",
                        item.Quantity,
                        item.TransferReceivedQuantity,
                        RemainingQuantity = item.psmsTransferReceiveHeader.psmsTransferIssueHeader.psmsTransferIssueDetail.Where(o => o.ItemId == item.ItemId).Sum(f => f.RemainingQuantity),
                    }).ToList().Cast<object>().ToList();
                    var result = new { total = count, data = records };
                    return this.Direct(result);
                }
                else
                {
                    var filtered = _transferIssueDetail.GetAll().AsQueryable().Where(d => d.TransferIssueHeaderId == voucherHeaderId).OrderBy(o => o.CreatedAt);
                    var count = filtered.Count();
                    records = filtered.Select(item => new
                    {
                        item.TransferIssueHeaderId,
                        Name = item.psmsItem.Name,
                        item.ItemId,
                        Code = item.ItemId != null ? item.psmsItem.Code : "",
                        item.StatusId,
                        item.psmsItem.PartNumber,
                        item.UnitCost,
                        Status = item.lupVoucherStatus.Name,
                        MeasurementUnit = item.ItemId != null ? item.psmsItem.lupMeasurementUnit.Name : "",
                        Quantity=item.TransferIssuedQuantity,
                        RemainingQuantity = item.RemainingQuantity,
                        TransferReceivedQuantity = item.RemainingQuantity,
                    }).Where(o => o.RemainingQuantity > 0).ToList().Cast<object>().ToList(); ;
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

            var filtered = _transferReceiveHeader.GetAll().AsQueryable().Where(o => o.VoucherNumber.ToUpper().Contains(queryparam.ToUpper()));
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
                    var objHeader = _transferReceiveHeader.Get(o => o.Id == id);
                    if (objHeader.IsPosted == true)
                        return this.Direct(new { success = false, data = "you can't void already posted transaction!" });

                        foreach (var objTransferReceiveDetail in objHeader.psmsTransferReceiveDetail)
                        {                     
                            if(objHeader.TransferIssueHeaderId.HasValue)
                            UpdateTransferIssueDetail(objHeader.TransferIssueHeaderId.Value, objTransferReceiveDetail.ItemId, -objTransferReceiveDetail.TransferReceivedQuantity.Value);
                            objTransferReceiveDetail.StatusId = voidVoucherStatus;
                            if (objHeader.StatusId == receivedVoucherStatus)                 
                           UpdateInventoryFromVoidedT(objTransferReceiveDetail,objHeader.ReceivedDate);
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
        public ActionResult Save(psmsTransferReceiveHeader transferReceiveHeader)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var requestOrderDetailsString = hashtable["transferReceiveDetails"].ToString();
                    var action = hashtable["action"].ToString();
                    var statusId = transferReceiveHeader.StatusId;
                    var voucherno = transferReceiveHeader.VoucherNumber;
                    fiscalYearStartDate = _fiscalYear.GetAll().AsQueryable().Where(o => o.Id == transferReceiveHeader.FiscalYearId).FirstOrDefault().StartDate;
                 
                    if (transferReceiveHeader.Id == Guid.Empty)
                    {
                        transferReceiveHeader.Id = Guid.NewGuid();
                        transferReceiveHeader.CreatedAt = DateTime.Now;
                        transferReceiveHeader.UpdatedAt = DateTime.Now;
                        CyberErp.Presentation.Psms.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Psms.Web.MvcApplication;
                        httpapplication.Application.Lock();
                          if (voucherno=="Draft")
                        transferReceiveHeader.VoucherNumber = _utils.GetVoucherNumber("Transfer Receive", transferReceiveHeader.ToStoreId);
                        _transferReceiveHeader.AddNew(transferReceiveHeader);
                          if (voucherno=="Draft")
                        _utils.UpdateVoucherNumber("Transfer Receive", transferReceiveHeader.ToStoreId);
                        httpapplication.Application.UnLock();
                        UpdateStatus(transferReceiveHeader, action);
             
                    }
                    else
                    {
                        if (action == "revise")
                        {
                            _notification.VoidAllNotification(TransferReceiveVoucherType, transferReceiveHeader.Id);
                            transferReceiveHeader.StatusId = postedVoucherStatus;
                            UpdateStatus(transferReceiveHeader, action);
                        }
                        transferReceiveHeader.UpdatedAt = DateTime.Now;                        
                        _transferReceiveHeader.Edit(transferReceiveHeader);
                    }
                    var isReceive = CheckStatus(transferReceiveHeader.StatusId);                     
                    if (action == "receive")
                    {
                        action = isReceive == true ? "receive" : "post";
                        if (isReceive)
                        {
                            transferReceiveHeader.StatusId = receivedVoucherStatus;
                        }
                    }   
                    SaveTransferReceiveDetail(transferReceiveHeader.Id, requestOrderDetailsString, transferReceiveHeader.TransferIssueHeaderId, statusId, action,transferReceiveHeader.ReceivedDate);
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
            var voucherWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == TransferReceiveVoucherType).OrderByDescending(o => o.Step);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == statusId).FirstOrDefault();
            if (currentStep == voucherWorkFlow.FirstOrDefault())
                returnValue = true;

            return returnValue;
        }
        private void UpdateStatus(psmsTransferReceiveHeader transferReceiveHeader, string action)
        {


            var date = transferReceiveHeader.ReceivedDate.ToShortDateString();
            var title = "Transfer Receive(" + transferReceiveHeader.VoucherNumber + ")";
            var message = "A new transfer Receive has be added with voucher no  " + transferReceiveHeader.VoucherNumber + "on date " + date + " \n ";


            var voucherWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == TransferReceiveVoucherType);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == transferReceiveHeader.StatusId).FirstOrDefault();
            if (currentStep == null)
                throw new System.InvalidOperationException("setting error,Please maintain workflow for the Store transfer receive voucher!");
        
            var nextStep = voucherWorkFlow.Where(o => o.Step == currentStep.Step + 1).FirstOrDefault();
            if (nextStep != null)
            {
                var approver = _approver.GetAll().AsQueryable().Where(o => o.VoucherTypeId == TransferReceiveVoucherType && o.StatusId == nextStep.VoucherStatusId && ((o.StoreId.HasValue ? o.StoreId == transferReceiveHeader.ToStoreId : true)));               
                if (approver.Count() > 0)
                {
                    string approverIds = "";
                    foreach (var objApprover in approver)
                    {
                        approverIds = approverIds + objApprover.EmployeeId.ToString() + ",";
                    }
                    _notification.SaveNotification(title, message, transferReceiveHeader.Id, transferReceiveHeader.VoucherNumber, nextStep.VoucherStatusId, TransferReceiveVoucherType, approverIds, transferReceiveHeader.ToStoreId, null, "");
                }

            }

        }
        public void SaveTransferReceiveDetail(Guid transferReceiveHeaderId, string transferReceiveDetailsString, Guid? transferIssueHeaderId, Guid statusId, string action, DateTime transactionDate)
        {
            transferReceiveDetailsString = transferReceiveDetailsString.Remove(transferReceiveDetailsString.Length - 1);
            IList<string> transferReceiveDetails = transferReceiveDetailsString.Split(new[] { ';' }).ToList();
            IList<psmsTransferReceiveDetail> transferReceiveDetailList = new List<psmsTransferReceiveDetail>();
            var oldsTransferReceiveDetailList = _transferReceiveDetail.GetAll().AsQueryable().Where(o => o.TransferReceiveHeaderId == transferReceiveHeaderId);
            decimal quantity=0;
            for (var i = 0; i < transferReceiveDetails.Count(); i++)
            {
                var transferReceiveDetail = transferReceiveDetails[i].Split(new[] { ':' });
                var transferReceiveDetailId = Guid.Empty;
                Guid.TryParse(transferReceiveDetail[0].ToString(), out transferReceiveDetailId);
                decimal oldQuantity = 0;
                var objTransferReceiveDetail = transferReceiveDetailId != Guid.Empty ? _transferReceiveDetail.Get(o => o.Id == transferReceiveDetailId) : new psmsTransferReceiveDetail();
                oldQuantity =objTransferReceiveDetail.TransferReceivedQuantity.HasValue? objTransferReceiveDetail.TransferReceivedQuantity.Value:0;
                objTransferReceiveDetail.TransferReceiveHeaderId = transferReceiveHeaderId;
                objTransferReceiveDetail.ItemId = Guid.Parse(transferReceiveDetail[2]);
                objTransferReceiveDetail.Quantity = decimal.Parse(transferReceiveDetail[3]);
                objTransferReceiveDetail.TransferReceivedQuantity = decimal.Parse(transferReceiveDetail[4]); ;
                if (decimal.TryParse(transferReceiveDetail[5], out quantity))
                    objTransferReceiveDetail.RemainingQuantity = quantity;
                objTransferReceiveDetail.UnitCost = decimal.Parse(transferReceiveDetail[7]);
             
                objTransferReceiveDetail.UpdatedAt = DateTime.Now;
                if (transferReceiveDetailId == Guid.Empty)
                {
                    objTransferReceiveDetail.Id = Guid.NewGuid();
                    objTransferReceiveDetail.CreatedAt = DateTime.Now.AddSeconds(2);
                    objTransferReceiveDetail.StatusId = statusId;
                    _transferReceiveDetail.AddNew(objTransferReceiveDetail);
                }
                if (action == "receive")
                {
                   UpdateInventory(objTransferReceiveDetail, transactionDate);
                }
                if (transferIssueHeaderId.HasValue)
                {
                    decimal revQuantity = statusId == voidVoucherStatus ? objTransferReceiveDetail.TransferReceivedQuantity.Value : objTransferReceiveDetail.TransferReceivedQuantity.Value - oldQuantity;
                    UpdateTransferIssueDetail(transferIssueHeaderId.Value, objTransferReceiveDetail.ItemId,revQuantity);           
                }
                
                transferReceiveDetailList.Add(objTransferReceiveDetail);
            }
            DeleteTransferReceiveDetail(transferReceiveDetailList, oldsTransferReceiveDetailList, transferIssueHeaderId);

        }
        private void DeleteTransferReceiveDetail(IList<psmsTransferReceiveDetail> transferReceiveDetailList, IQueryable<psmsTransferReceiveDetail> oldsTransferReceiveDetailList, Guid? referenceeaderId)
        {
            foreach (var objoldsTransferReceiveDetail in oldsTransferReceiveDetailList)
            {
                var record = transferReceiveDetailList.Where(o => o.Id == objoldsTransferReceiveDetail.Id);

                if (record.Count() == 0)
                {
                    if (referenceeaderId.HasValue)
                    UpdateTransferIssueDetail(referenceeaderId.Value, objoldsTransferReceiveDetail.ItemId, objoldsTransferReceiveDetail.Quantity);
                    _transferReceiveDetail.Delete(o => o.Id == objoldsTransferReceiveDetail.Id);
                }
            }
        }
        private void UpdateTransferIssueDetail(Guid transferIssueHeaderId, Guid itemId, decimal updateQuantity)
        {
            var objTransferIssueDetail = _transferIssueDetail.GetAll().AsQueryable().Where(o => o.TransferIssueHeaderId == transferIssueHeaderId && o.ItemId == itemId).FirstOrDefault();
            if (objTransferIssueDetail!=null)
            objTransferIssueDetail.RemainingQuantity = objTransferIssueDetail.RemainingQuantity - updateQuantity;
        }
        private void UpdateInventory(psmsTransferReceiveDetail transferReceiveDetail, DateTime transactionDate)
        {
            var fromId = transferReceiveDetail.psmsTransferReceiveHeader.TransferIssueHeaderId.HasValue ? transferReceiveDetail.psmsTransferReceiveHeader.TransferIssueHeaderId : Guid.Empty;
            var model = new ParameterModel { VoucherId = transferReceiveDetail.TransferReceiveHeaderId, VoucherTypeId = TransferReceiveVoucherType, VoucherNo = transferReceiveDetail.psmsTransferReceiveHeader.VoucherNumber, ItemId = transferReceiveDetail.ItemId, StoreId = transferReceiveDetail.psmsTransferReceiveHeader.ToStoreId, FiscalYearId = transferReceiveDetail.psmsTransferReceiveHeader.FiscalYearId, TransactionDate = transactionDate, Quantity = (double)transferReceiveDetail.TransferReceivedQuantity.Value, DamagedQuantity = 0, UnitCost = transferReceiveDetail.UnitCost.Value, FiscalYearDate = fiscalYearStartDate, FromStoreId = transferReceiveDetail.psmsTransferReceiveHeader.FromStoreId, FromVoucherId = fromId };
            _inventoryRecord.ReceiveInventoryUpdate(model);
        }
        private void UpdateInventoryFromVoidedT(psmsTransferReceiveDetail transferReceiveDetail, DateTime transactionDate)
        {
            var model = new ParameterModel { VoucherId = transferReceiveDetail.TransferReceiveHeaderId, VoucherTypeId = TransferReceiveVoucherType, VoucherNo = transferReceiveDetail.psmsTransferReceiveHeader.VoucherNumber, ItemId = transferReceiveDetail.ItemId, StoreId = transferReceiveDetail.psmsTransferReceiveHeader.ToStoreId, FiscalYearId = transferReceiveDetail.psmsTransferReceiveHeader.FiscalYearId, TransactionDate = transactionDate, Quantity = (double)transferReceiveDetail.TransferReceivedQuantity.Value, DamagedQuantity = 0, UnitCost = transferReceiveDetail.UnitCost.Value };
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
        private IQueryable<psmsTransferIssueHeader> SearchTransaction(string mode, Hashtable ht, IQueryable<psmsTransferIssueHeader> filtered)
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
                            (v.RequestOrderHeaderId.HasValue ? v.psmsRequestOrderHeader.psmsStoreRequisitionHeader.VoucherNumber.ToUpper().Contains(tSearchText.ToUpper()) : false) ||                      
                            (v.psmsStore.Name.ToUpper().Contains(tSearchText.ToUpper())) ||
                            (v.psmsStore1.Name.ToUpper().Contains(tSearchText.ToUpper())) ||
                            (v.Remark.ToUpper().Contains(tSearchText.ToUpper())) ||
                            (v.PlateNo.ToUpper().Contains(tSearchText.ToUpper())) ||
                            (v.DriverName.ToUpper().Contains(tSearchText.ToUpper())) ||
                            (v.coreUser1.FirstName + " " + v.coreUser1.LastName).ToUpper().Contains(tSearchText.ToUpper()) ||
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
                        filtered = filtered.Where(v => v.IssuedDate >= transactionStartDate && v.IssuedDate <= transactionEndDate);
                    }
                    break;
            }
            return filtered;
        }
        private IQueryable<psmsTransferReceiveHeader> SearchTransactionReceive(string mode, Hashtable ht, IQueryable<psmsTransferReceiveHeader> filtered)
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
                            (v.TransferIssueHeaderId.HasValue? v.psmsTransferIssueHeader.VoucherNumber.ToUpper().Contains(tSearchText.ToUpper()):false) ||
                            v.psmsStore.Name.ToUpper().Contains(tSearchText.ToUpper()) ||
                            v.psmsStore1.Name.ToUpper().Contains(tSearchText.ToUpper()) ||                       
                            (v.Remark.ToUpper().Contains(tSearchText.ToUpper())) ||                            
                            v.DriverName.ToUpper().Contains(tSearchText.ToUpper()) ||
                            v.PlateNo.ToUpper().Contains(tSearchText.ToUpper()) ||
                            (v.coreUser1.FirstName + " " + v.coreUser1.LastName).ToUpper().StartsWith(tSearchText.ToUpper()) ||
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
                        filtered = filtered.Where(v => v.ReceivedDate >= transactionStartDate && v.ReceivedDate <= transactionEndDate);
                    }
                    break;
            }
            return filtered;
        }
   
        #endregion
    }
}
