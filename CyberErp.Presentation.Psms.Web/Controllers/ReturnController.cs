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
    public class ReturnController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsReturnHeader> _returnHeader;
        private readonly BaseModel<psmsReturnDetail> _returnDetail;
        private readonly Item _item;
        private readonly BaseModel<psmsStore> _store;
        private readonly InventoryRecord _inventoryRecord;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        private readonly BaseModel<coreUnit> _unit;
        private readonly BaseModel<psmsApprover> _approver;
        
        private readonly BaseModel<psmsStorePermission> _storePermission;
        private readonly BaseModel<psmsIssueHeader> _issueHeader;
   
        private readonly BaseModel<psmsIssueDetail> _issueDetail;
        private readonly ItemLOTTransaction _itemLOTTransaction;
        private readonly ItemSerialTransaction _itemSerialTransaction;
        private readonly Notification _notification;
        private readonly BaseModel<coreVoucherWorkFlow> _voucherWorkFlow;
        private readonly BaseModel<lupReturnType> _returnType;
    
       
        private Utility _utils;
        Guid postedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Posted);
        Guid certifiedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Certified);
        Guid approvedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Approved);
        Guid partiallyVoucherStatus = Guid.Parse(Constants.Voucher_Status_Partially_Approved);
        Guid rejectedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Rejected);
        Guid voidVoucherStatus = Guid.Parse(Constants.Voucher_Status_Void);
        Guid ReturnVoucherType = Guid.Parse(Constants.Voucher_Type_StoreReturn);

        Guid receiveVoucherStatus = Guid.Parse(Constants.Voucher_Status_Receive);
        Guid issueVoucherStatus = Guid.Parse(Constants.Voucher_Status_Issued);

        private readonly Lookups _lookup;
        private Guid employeeId = Guid.Empty;
       
        #endregion

        #region Constructor

        public ReturnController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _returnHeader = new BaseModel<psmsReturnHeader>(_context);
            _returnDetail = new BaseModel<psmsReturnDetail>(_context);
            _item = new Item(_context);
            _store = new BaseModel<psmsStore>(_context);
            _inventoryRecord = new InventoryRecord(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);
            _unit = new BaseModel<coreUnit>(_context);
            _approver = new BaseModel<psmsApprover>(_context);
            
            _storePermission = new BaseModel<psmsStorePermission>(_context);
            _utils = new Utility();
            _lookup = new Lookups(_context);
            _issueHeader = new BaseModel<psmsIssueHeader>(_context);
            _issueDetail = new BaseModel<psmsIssueDetail>(_context);
            _itemLOTTransaction = new ItemLOTTransaction(_context);
            _itemSerialTransaction = new ItemSerialTransaction(_context);
            _voucherWorkFlow = new BaseModel<coreVoucherWorkFlow>(_context);
            _notification = new Notification(_context);
            _returnType = new BaseModel<lupReturnType>(_context);
        
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

            var objStoreReturn = _returnHeader.Get(o => o.Id == id);
            var records = new
            {
                objStoreReturn.Id,
                objStoreReturn.IssueHeaderId,
                IssueNo = objStoreReturn.IssueHeaderId.HasValue ? objStoreReturn.psmsIssueHeader.VoucherNumber : "",
                objStoreReturn.ConsumerTypeId,
                ConsumerType=objStoreReturn.lupConsumerType.Name,
                objStoreReturn.ConsumerEmployeeId,
                objStoreReturn.ConsumerStoreId,
                objStoreReturn.ConsumerUnitId,
                objStoreReturn.SupplierId,
                Supplier=objStoreReturn.SupplierId.HasValue?objStoreReturn.psmsSupplier.Name:"",
                ConsumerEmployee = objStoreReturn.ConsumerEmployeeId != null ? objStoreReturn.coreUser2.FirstName + " " + objStoreReturn.coreUser2.LastName : "",
                ConsumerStore = objStoreReturn.ConsumerStoreId != null ? objStoreReturn.psmsStore1.Name : "",
                ConsumerUnit = objStoreReturn.ConsumerUnitId != null ? objStoreReturn.coreUnit.Name : "",
                objStoreReturn.VoucherNumber,
                objStoreReturn.InvoiceNo,
                objStoreReturn.ReturnTypeId,
                ReturnType = objStoreReturn.lupReturnType.Name,
                objStoreReturn.PreparedById,
                 objStoreReturn.ReturnedById,
                objStoreReturn.FiscalYearId,
                FiscalYear = objStoreReturn.coreFiscalYear.Name,
                ReturnedBy =  objStoreReturn.coreUser1.FirstName + " " + objStoreReturn.coreUser1.LastName,
                PreparedBy = objStoreReturn.coreUser.FirstName + " " + objStoreReturn.coreUser.LastName,
                objStoreReturn.ProductionPlanId,
                objStoreReturn.ProductionOrderId,
                ProductionOrder = objStoreReturn.ProductionOrderId.HasValue ? objStoreReturn.PRProductionOrderHeader.VoucherNumber : "",
                ProductionPlan = objStoreReturn.ProductionPlanId.HasValue ? objStoreReturn.PRProductionPlanHeader.VoucherNumber : "",
         
                objStoreReturn.StatusId,
                objStoreReturn.StoreId,
                objStoreReturn.IsPosted,
                Store = objStoreReturn.psmsStore.Name,
                objStoreReturn.Remark,
                objStoreReturn.CreatedAt
            };
            var serialList = _itemSerialTransaction.GetItemSerialTransactionList(objStoreReturn.Id, ReturnVoucherType);
            var lotList = _itemLOTTransaction.GetItemLOTList(objStoreReturn.Id, ReturnVoucherType);

            return this.Direct(new
            {
                success = true,
                data = records,
                serialList = serialList,
                lotList = lotList
            });
        }
        public DirectResult GetAllHeader(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
                var mode = hashtable["mode"] != null ? hashtable["mode"].ToString() : "";
                var LastWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == ReturnVoucherType).OrderByDescending(o => o.Step).FirstOrDefault();
                var lastVoucherId = LastWorkFlow != null ? LastWorkFlow.VoucherStatusId : Guid.Empty;
             
                var userId = Guid.Empty;
                var objUser = (coreUser)Session[Constants.CurrentUser];
                if (objUser != null && objUser.Id != null)
                {
                    employeeId = (Guid)objUser.Id;
                    userId = (Guid)objUser.Id;
                }
           
                var filtered = _returnHeader.GetAll().AsQueryable().Where(x => (x.psmsStore.psmsStorePermission.Any()? x.psmsStore.psmsStorePermission.Where(f => f.UserId == userId).Any():true));
              
                filtered = SearchTransaction(mode, hashtable, filtered);
                if (mode != "search")
                    filtered = filtered.Where(o => o.StatusId != voidVoucherStatus);
        
                switch (sort)
                {
                    case "VoucherNumber":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.VoucherNumber) : filtered.OrderBy(u => u.VoucherNumber);
                        break;
                    case "ReturnedDate":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.ReturnedDate) : filtered.OrderBy(u => u.ReturnedDate);
                        break;
                    case "Supplier":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.SupplierId.HasValue ? u.psmsSupplier.Name : "") : filtered.OrderBy(u => u.SupplierId.HasValue ? u.psmsSupplier.Name : "");
                        break;
                       case "ReturnedBy":
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
                    item.ReturnedDate,
                    ReturnType=item.lupReturnType.Name,
                    ReturnedBy = item.coreUser1.FirstName + " " + item.coreUser1.LastName,
                    ConsumerType = item.lupConsumerType.Name,
                    Consumer = item.ConsumerEmployeeId.HasValue ? item.coreUser.FirstName + " " + item.coreUser.LastName : item.ConsumerStoreId.HasValue ? item.psmsStore1.Name : item.ConsumerUnitId.HasValue ? item.coreUnit.Name : "",
                    IsLastStep = lastVoucherId != Guid.Empty ? lastVoucherId == item.StatusId : true,
                    Supplier = item.SupplierId.HasValue ? item.psmsSupplier.Name : "",
                    PreparedBy = item.coreUser.FirstName + " " + item.coreUser.LastName,                             
                    item.StatusId,
                    Store = item.psmsStore.Name,  
                    Status = item.lupVoucherStatus.Name,
                    item.Remark,
                    item.CreatedAt
                }).ToList().Select(item => new
                {
                    item.Id,
                    item.ReturnType,
                    item.ReturnedBy,
                    item.Supplier,
                    ReturnedDate = item.ReturnedDate.ToShortDateString(),
                    item.Consumer,
                    item.PreparedBy,
                    item.IsLastStep,
                    item.ConsumerType,
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
               
                if (action == "issue")
                {
                    var records = GetIssueDetail(voucherHeaderId);
                    var result = new { total = records.Count, data = records };
                    return this.Direct(result);
                }
               
                else
                {
                    var filtered = _returnDetail.GetAll().AsQueryable().Where(d => d.ReturnHeaderId == voucherHeaderId).OrderBy(o => o.CreatedAt);
                    var count = filtered.Count();
                    var records = filtered.Select(item => new
                    {
                        item.Id,
                        item.ReturnHeaderId,
                        Name = item.psmsItem.Name,
                        item.psmsItem.IsSerialItem,
                        item.psmsItem.IsLOTItem,
                        item.psmsItem.PartNumber,
                        item.ItemId,
                        Code = item.ItemId != null ? item.psmsItem.Code : "",
                        item.StatusId,
                        item.UnitCost,
                        Status = item.lupVoucherStatus.Name,
                        MeasurementUnit = item.ItemId != null ? item.psmsItem.lupMeasurementUnit.Name : "",
                        item.Quantity,
                        item.ReturnedQuantity,
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
                    var objHeader = _returnHeader.Get(o => o.Id == id);
                    if (objHeader.IsPosted == true)
                        return this.Direct(new { success = false, data = "you can't void already posted transaction!" });

                    if  (objHeader.StatusId == issueVoucherStatus || objHeader.StatusId==receiveVoucherStatus)
                    {
                        var action = objHeader.StatusId == issueVoucherStatus ? "issue" : "receive";
                       
                        foreach (var objReturnDetail in objHeader.psmsReturnDetail)
                        {
                            objReturnDetail.StatusId = voidVoucherStatus;
                              UpdateInventoryFromVoidedT(objReturnDetail, action);
                        }
                        var storeRequisitionId=objHeader.IssueHeaderId.HasValue?objHeader.psmsIssueHeader.psmsRequestOrderHeader.StoreRequisitionHeaderId.HasValue?objHeader.psmsIssueHeader.psmsRequestOrderHeader.StoreRequisitionHeaderId:Guid.Empty:Guid.Empty;
                        var returnType = GetReturnType(objHeader.ReturnTypeId);
                        bool isToSupplier = returnType == "To Supplier" ? true : false;
                        _itemSerialTransaction.VoidItemSerialTransaction(objHeader.Id, ReturnVoucherType, storeRequisitionId, !isToSupplier);
                        _itemLOTTransaction.VoidItemLOTTransaction(objHeader.Id, ReturnVoucherType,action);
              
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
        public ActionResult Save(psmsReturnHeader returnHeader)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var requestOrderDetailsString = hashtable["returnDetails"].ToString();
                    var itemSerialsString = hashtable["itemSerials"].ToString();
                    var itemLOTsString = hashtable["itemLOTs"].ToString();
               
                    var action = hashtable["action"].ToString();
                    var statusId = returnHeader.StatusId;
                    var voucherno = returnHeader.VoucherNumber;
                    if (returnHeader.Id == Guid.Empty)
                    {
                        returnHeader.Id = Guid.NewGuid();
                        returnHeader.CreatedAt = DateTime.Now;
                        returnHeader.UpdatedAt = DateTime.Now;
                        CyberErp.Presentation.Psms.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Psms.Web.MvcApplication;
                        httpapplication.Application.Lock();
                        if (voucherno == "Draft")
                        returnHeader.VoucherNumber = _utils.GetVoucherNumber("Return", returnHeader.StoreId);
                        _returnHeader.AddNew(returnHeader);
                        if (voucherno == "Draft")
                        _utils.UpdateVoucherNumber("Return", returnHeader.StoreId);
                        httpapplication.Application.UnLock();
                        UpdateStatus(returnHeader, action);
                    }
                    else
                    {
                        if (action == "revise")
                        {
                            _notification.VoidAllNotification(ReturnVoucherType, returnHeader.Id);
                            returnHeader.StatusId = postedVoucherStatus;
                            UpdateStatus(returnHeader, action);
                        }
                        returnHeader.UpdatedAt = DateTime.Now;                        
                        _returnHeader.Edit(returnHeader);
                    }
                    var returnType = GetReturnType(returnHeader.ReturnTypeId);
                    bool isToSupplier = returnType == "To Supplier" ? true : false;

                    var isReceive = CheckStatus(returnHeader.StatusId);
                   
                    if (action == "receive")
                    {
                        action = isReceive == true ? isToSupplier ? "issue" : "receive" : "post";
                        returnHeader.StatusId = action == "issue" ? issueVoucherStatus : receiveVoucherStatus;             
                    } 
                    SaveReturnDetail(returnHeader.Id, requestOrderDetailsString, statusId, action,returnHeader.ReturnedDate);
                    var storeRequisitionId=Guid.Empty;
                    if(returnHeader.IssueHeaderId.HasValue)
                    {
                           var issueHeader=_issueHeader.Get(o=>o.Id==returnHeader.IssueHeaderId.Value);
                            storeRequisitionId = issueHeader.psmsRequestOrderHeader.StoreRequisitionHeaderId.HasValue ? issueHeader.psmsRequestOrderHeader.StoreRequisitionHeaderId.Value : Guid.Empty;
                    }
                  
                    if (itemSerialsString != "") _itemSerialTransaction.AddItemSerialTransactions(returnHeader.Id, storeRequisitionId, returnHeader.ReturnedDate, ReturnVoucherType, returnHeader.VoucherNumber, itemSerialsString, action, isToSupplier, !isToSupplier, true);
                    if (itemLOTsString != "") _itemLOTTransaction.AddItemLOTsTransaction(returnHeader.Id, ReturnVoucherType, returnHeader.VoucherNumber, itemLOTsString, action);
                  
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
            var voucherWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == ReturnVoucherType).OrderByDescending(o => o.Step);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == statusId).FirstOrDefault();
            if (currentStep == voucherWorkFlow.FirstOrDefault())
                returnValue = true;

            return returnValue;
        }
        private void UpdateStatus(psmsReturnHeader returnHeader, string action)
        {


            var date = returnHeader.ReturnedDate.ToShortDateString();
            var title = "Return(" + returnHeader.VoucherNumber + ")";
            var message = "A new return has be added with voucher no  " + returnHeader.VoucherNumber + "on date " + date + " \n ";


            var voucherWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == ReturnVoucherType);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == returnHeader.StatusId).FirstOrDefault();
            var nextStep = voucherWorkFlow.Where(o => o.Step == currentStep.Step + 1).FirstOrDefault();
            if (nextStep != null)
            {
                var approver = _approver.GetAll().AsQueryable().Where(o => o.VoucherTypeId == ReturnVoucherType && o.StatusId == nextStep.VoucherStatusId && ((o.StoreId.HasValue ? o.StoreId == returnHeader.StoreId : true)));
               
                if (approver.Count() > 0)
                {
                    string approverIds = "";
                    foreach (var objApprover in approver)
                    {
                        approverIds = approverIds + objApprover.EmployeeId.ToString() + ",";
                    }
                    _notification.SaveNotification(title, message, returnHeader.Id, returnHeader.VoucherNumber, nextStep.VoucherStatusId, ReturnVoucherType, approverIds, returnHeader.StoreId, null, "");
                }

            }

        }
    
        private IList GetIssueDetail(Guid voucherHeaderId)
        {
            var filtered =_issueDetail.GetAll().AsQueryable().Where(d => d.IssueHeaderId == voucherHeaderId).OrderBy(o => o.CreatedAt);
            var filteredReturnDetail = _returnDetail.GetAll().AsQueryable();
            var count = filtered.Count();
            var records = filtered.Select(item => new
            {
                Name = item.psmsItem.Name,
                item.ItemId,
                Code = item.ItemId != null ? item.psmsItem.Code : "",
                item.StatusId,
                item.psmsItem.IsSerialItem,
                item.psmsItem.IsLOTItem,
                Status = item.lupVoucherStatus.Name,
                MeasurementUnit = item.ItemId != null ? item.psmsItem.lupMeasurementUnit.Name : "",
                DamagedQuantity=0,
                Quantity = item.IssuedQuantity,
                RemainingQuantity = item .IssuedQuantity- filteredReturnDetail.Where(d => d.psmsReturnHeader.StatusId == approvedVoucherStatus && d.psmsReturnHeader.IssueHeaderId == voucherHeaderId).Where(a => a.ItemId == item.ItemId).Select(h => h.ReturnedQuantity).DefaultIfEmpty(0).Sum(),                             
            }).ToList();

            return records;
        }
        public void SaveReturnDetail(Guid ReturnHeaderId, string ReturnDetailsString, Guid statusId, string action, DateTime transactionDate)
        {
            ReturnDetailsString = ReturnDetailsString.Remove(ReturnDetailsString.Length - 1);
            IList<string> ReturnDetails = ReturnDetailsString.Split(new[] { ';' }).ToList();
            IList<psmsReturnDetail> ReturnDetailList = new List<psmsReturnDetail>();
            var oldsReturnDetailList = _returnDetail.GetAll().AsQueryable().Where(o => o.ReturnHeaderId == ReturnHeaderId);
            for (var i = 0; i < ReturnDetails.Count(); i++)
            {
                var ReturnDetail = ReturnDetails[i].Split(new[] { ':' });
                Guid ReturnDetailId = Guid.Empty, id = Guid.Empty;
                Guid.TryParse(ReturnDetail[0].ToString(), out ReturnDetailId);
                var objReturnDetail = ReturnDetailId != Guid.Empty ? _returnDetail.Get(o => o.Id == ReturnDetailId) : new psmsReturnDetail();
                decimal quantity = 0;
                objReturnDetail.ReturnHeaderId = ReturnHeaderId;
                objReturnDetail.ItemId = Guid.Parse(ReturnDetail[2]);
                objReturnDetail.Quantity = decimal.Parse(ReturnDetail[3]);
                objReturnDetail.ReturnedQuantity = decimal.Parse(ReturnDetail[4]);
                if (decimal.TryParse(ReturnDetail[5], out quantity))
                objReturnDetail.RemainingQuantity = decimal.Parse(ReturnDetail[5]);
                if (decimal.TryParse( ReturnDetail[6], out quantity))
                objReturnDetail.DamagedQuantity = quantity;
                objReturnDetail.UpdatedAt = DateTime.Now;
                if (ReturnDetailId == Guid.Empty)
                {
                    objReturnDetail.Id = Guid.NewGuid();
                    objReturnDetail.CreatedAt = DateTime.Now.AddSeconds(2);
                    objReturnDetail.StatusId = statusId;
                    _returnDetail.AddNew(objReturnDetail);
                }
                if (action == "receive" || action=="issue")
                {
                    UpdateInventory(objReturnDetail, transactionDate, action);
                }
                ReturnDetailList.Add(objReturnDetail);
            }
            DeleteReturnDetail(ReturnDetailList, oldsReturnDetailList);

        }
        private void DeleteReturnDetail(IList<psmsReturnDetail> ReturnDetailList, IQueryable<psmsReturnDetail> oldsReturnDetailList)
        {
            foreach (var objoldsReturnDetail in oldsReturnDetailList)
            {
                var record = ReturnDetailList.Where(o => o.Id == objoldsReturnDetail.Id);

                if (record.Count() == 0)
                {
                   _returnDetail.Delete(o => o.Id == objoldsReturnDetail.Id);
                }
            }
        }
        private void UpdateInventory(psmsReturnDetail returnDetail, DateTime transactionDate,string action)
        {
            var model = new ParameterModel { VoucherId = returnDetail.ReturnHeaderId, VoucherTypeId = ReturnVoucherType, VoucherNo = returnDetail.psmsReturnHeader.VoucherNumber, ItemId = returnDetail.ItemId, StoreId = returnDetail.psmsReturnHeader.StoreId, FiscalYearId = returnDetail.psmsReturnHeader.FiscalYearId, TransactionDate = transactionDate, Quantity = (double)returnDetail.ReturnedQuantity.Value, DamagedQuantity =(double) returnDetail.DamagedQuantity.Value };
        
            if (action == "issue")
                _inventoryRecord.IssueInventoryUpdate(model);

            else
                _inventoryRecord.ReturnInventoryUpdate(model);
        }
        private void UpdateInventoryFromVoidedT(psmsReturnDetail returnDetail, string action)
        {
            if (!returnDetail.DamagedQuantity.HasValue)
                returnDetail.DamagedQuantity = 0;
            var model = new ParameterModel { VoucherId = returnDetail.ReturnHeaderId, VoucherTypeId = ReturnVoucherType, VoucherNo = returnDetail.psmsReturnHeader.VoucherNumber, ItemId = returnDetail.ItemId, StoreId = returnDetail.psmsReturnHeader.StoreId, FiscalYearId = returnDetail.psmsReturnHeader.FiscalYearId, TransactionDate = returnDetail.psmsReturnHeader.ReturnedDate, Quantity =(double) returnDetail.ReturnedQuantity.Value, DamagedQuantity =(double) returnDetail.DamagedQuantity.Value };
        
            if (action == "issue")
                _inventoryRecord.IssueInventoryUpdateFromVoidedT(model);

            else
                _inventoryRecord.ReturnInventoryUpdateFromVoidedT(model);
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
        private string GetReturnType(Guid typeId)
        {
            var returnType = _returnType.Get(o => o.Id == typeId);
            return returnType.Name;
        }
        private IQueryable<psmsReturnHeader> SearchTransaction(string mode, Hashtable ht, IQueryable<psmsReturnHeader> filtered)
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
                        filtered = filtered.Where(v => v.psmsReturnDetail.Where(f =>
                            (f.psmsItem.Name.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            (f.psmsItem.Code.ToUpper().StartsWith(tSearchText.ToUpper()))).Any() ||

                            (v.psmsStore.Name.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            (v.lupConsumerType.Name.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            (v.lupReturnType.Name.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            (v.SupplierId.HasValue ? v.psmsSupplier.Name.ToUpper().StartsWith(tSearchText.ToUpper()) : false) ||
                            (v.IssueHeaderId.HasValue ? v.psmsIssueHeader.VoucherNumber.ToUpper().StartsWith(tSearchText.ToUpper()) : false) ||
                            (v.ConsumerEmployeeId.HasValue ? (v.coreUser2.FirstName + " " + v.coreUser2.LastName).ToUpper().StartsWith(tSearchText.ToUpper()) : false) ||
                            (v.ConsumerStoreId.HasValue ? v.psmsStore1.Name.ToUpper().StartsWith(tSearchText.ToUpper()) : false) ||
                            (v.ConsumerUnitId.HasValue ? v.coreUnit.Name.ToUpper().StartsWith(tSearchText.ToUpper()) : false) ||

                            (v.coreUser1.FirstName + " " + v.coreUser1.LastName).ToUpper().StartsWith(tSearchText.ToUpper())||
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
                        filtered = filtered.Where(v => v.ReturnedDate >= transactionStartDate && v.ReturnedDate <= transactionEndDate);
                    }
                    break;
            }
            return filtered;
        }
 
        #endregion
    }
}
