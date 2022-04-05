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
    public class AdjustmentController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsAdjustmentHeader> _adjustmentHeader;
        private readonly BaseModel<psmsAdjustmentDetail> _adjustmentDetail;
        private readonly BaseModel<psmsItem> _item;
        private readonly BaseModel<psmsStore> _store;
        private readonly InventoryRecord _inventoryRecord;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        private readonly BaseModel<coreUnit> _unit;
        private readonly BaseModel<psmsApprover> _approver;
        
        private readonly BaseModel<psmsStorePermission> _storePermission;
        private readonly BaseModel<psmsIssueHeader> _issueHeader;
        private readonly Notification _notification;
        private readonly BaseModel<coreVoucherWorkFlow> _voucherWorkFlow;
    
        private readonly BaseModel<psmsIssueDetail> _issueDetail;
        private readonly ItemLOTTransaction _itemLOTTransaction;
        private readonly ItemSerialTransaction _itemSerialTransaction;
        private readonly BaseModel<lupAdjustmentType> _adjustmentType;
    
       
        private Utility _utils;
        Guid postedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Posted);
        Guid certifiedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Certified);
        Guid approvedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Approved);
        Guid partiallyVoucherStatus = Guid.Parse(Constants.Voucher_Status_Partially_Approved);
        Guid rejectedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Rejected);
        Guid voidVoucherStatus = Guid.Parse(Constants.Voucher_Status_Void);
        Guid AdjustmentVoucherType = Guid.Parse(Constants.Voucher_Type_StoreAdjustment);
        Guid receiveVoucherStatus = Guid.Parse(Constants.Voucher_Status_Receive);
        Guid issueVoucherStatus = Guid.Parse(Constants.Voucher_Status_Issued);

        private readonly Lookups _lookup;
        private Guid employeeId = Guid.Empty;
       
        #endregion

        #region Constructor

        public AdjustmentController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _adjustmentHeader = new BaseModel<psmsAdjustmentHeader>(_context);
            _adjustmentDetail = new BaseModel<psmsAdjustmentDetail>(_context);
            _item = new BaseModel<psmsItem>(_context);
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
            _adjustmentType=new BaseModel<lupAdjustmentType>(_context);
            _voucherWorkFlow = new BaseModel<coreVoucherWorkFlow>(_context);
            _notification = new Notification(_context);
        
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

            var objStoreAdjustment = _adjustmentHeader.Get(o => o.Id == id);
            var records = new
            {
                objStoreAdjustment.Id,
                objStoreAdjustment.AdjustmentTypeId,
                objStoreAdjustment.VoucherNumber,
                AdjustmentType = objStoreAdjustment.lupAdjustmentType.Name,
                objStoreAdjustment.PreparedById,
                objStoreAdjustment.AdjustmentedById,
                objStoreAdjustment.FiscalYearId,
                FiscalYear = objStoreAdjustment.coreFiscalYear.Name,
                AdjustmentedBy =  objStoreAdjustment.coreUser1.FirstName + " " + objStoreAdjustment.coreUser1.LastName,
                objStoreAdjustment.StatusId,
                objStoreAdjustment.StoreId,
                objStoreAdjustment.IsPosted,
                Store = objStoreAdjustment.psmsStore.Name,
                objStoreAdjustment.Remark,
                objStoreAdjustment.CreatedAt
            };
            var serialList = _itemSerialTransaction.GetItemSerialTransactionList(objStoreAdjustment.Id, AdjustmentVoucherType);
            var lotList = _itemLOTTransaction.GetItemLOTList(objStoreAdjustment.Id, AdjustmentVoucherType);

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
                var LastWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == AdjustmentVoucherType).OrderByDescending(o => o.Step).FirstOrDefault();
                var lastVoucherId = LastWorkFlow != null ? LastWorkFlow.VoucherStatusId : Guid.Empty;
             
                var userId = Guid.Empty;
                var objUser = (coreUser)Session[Constants.CurrentUser];
                if (objUser != null && objUser.Id != null)
                {
                    employeeId = (Guid)objUser.Id;
                    userId = (Guid)objUser.Id;
                }
           
                var filtered = _adjustmentHeader.GetAll().AsQueryable().Where(x => (x.psmsStore.psmsStorePermission.Where(f => f.UserId == userId).Any()));
                filtered = SearchTransaction(mode, hashtable, filtered);
            
                switch (sort)
                {
                   case "VoucherNumber":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.VoucherNumber) : filtered.OrderBy(u => u.VoucherNumber);
                        break;
                    case "AdjustmentedDate":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.AdjustmentedDate) : filtered.OrderBy(u => u.AdjustmentedDate);
                        break;
                    case "AdjustmentedBy":
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
                    item.AdjustmentedDate,
                    AdjustmentType=item.lupAdjustmentType.Name,
                    AdjustmentedBy = item.coreUser1.FirstName + " " + item.coreUser1.LastName,
                    IsLastStep = lastVoucherId != Guid.Empty ? lastVoucherId == item.StatusId : true,
                    PreparedBy = item.coreUser.FirstName + " " + item.coreUser.LastName,
                 
                    item.StatusId,
                    Store = item.psmsStore.Name,  
                    Status = item.lupVoucherStatus.Name,
                    item.Remark,
                    item.CreatedAt
                }).ToList().Select(item => new
                {
                    item.Id,
                    item.AdjustmentType,
                    item.AdjustmentedBy,
                    AdjustmentedDate = item.AdjustmentedDate.ToShortDateString(),
                    item.VoucherNumber,
                    item.PreparedBy,
                    item.IsLastStep,
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

                    var filtered = _adjustmentDetail.GetAll().AsQueryable().Where(d => d.AdjustmentHeaderId == voucherHeaderId).OrderBy(o => o.CreatedAt);
                    var count = filtered.Count();
                    var records = filtered.Select(item => new
                    {
                        item.Id,
                        item.AdjustmentHeaderId,
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
                      }).ToList();
                    var result = new { total = count, data = records };
                    return this.Direct(result);

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
                    var objHeader = _adjustmentHeader.Get(o => o.Id == id);
                    if (objHeader.IsPosted==true)
                        return this.Direct(new { success = false, data = "you can't void already posted transaction!" });

                 if  (objHeader.StatusId == issueVoucherStatus || objHeader.StatusId==receiveVoucherStatus)
                 {
                        foreach (var objAdjustmentDetail in objHeader.psmsAdjustmentDetail)
                        {
                            objAdjustmentDetail.StatusId = voidVoucherStatus;
                            var adjsutmentType = getAdjustmentType(objHeader.AdjustmentTypeId);

                            UpdateInventoryFromVoided(objAdjustmentDetail, adjsutmentType);
                        }
                        var storeRequisitionId = Guid.Empty;
                            _itemSerialTransaction.VoidItemSerialTransaction(objHeader.Id, AdjustmentVoucherType, storeRequisitionId, false);
                        _itemLOTTransaction.VoidItemLOTTransaction(objHeader.Id, AdjustmentVoucherType);
              
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
        public ActionResult Save(psmsAdjustmentHeader adjustmentHeader)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var requestOrderDetailsString = hashtable["adjustmentDetails"].ToString();
                    var itemSerialsString = hashtable["itemSerials"].ToString();
                    var itemLOTsString = hashtable["itemLOTs"].ToString();
               
                    var action = hashtable["action"].ToString();
                    var statusId = adjustmentHeader.StatusId;
                    if (adjustmentHeader.Id == Guid.Empty)
                    {
                        adjustmentHeader.Id = Guid.NewGuid();
                        adjustmentHeader.CreatedAt = DateTime.Now;
                        adjustmentHeader.UpdatedAt = DateTime.Now;
                        CyberErp.Presentation.Psms.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Psms.Web.MvcApplication;
                        httpapplication.Application.Lock();
                        adjustmentHeader.VoucherNumber = _utils.GetVoucherNumber("Adjustment", adjustmentHeader.StoreId);
                        _adjustmentHeader.AddNew(adjustmentHeader);
                        _utils.UpdateVoucherNumber("Adjustment", adjustmentHeader.StoreId);
                        httpapplication.Application.UnLock();
                        UpdateStatus(adjustmentHeader, action);
                
                    }
                    else
                    {
                        if (action == "revise")
                        {
                            _notification.VoidAllNotification(AdjustmentVoucherType, adjustmentHeader.Id);
                            adjustmentHeader.StatusId = postedVoucherStatus;
                            UpdateStatus(adjustmentHeader, action);
                        }
                        adjustmentHeader.UpdatedAt = DateTime.Now;                        
                        _adjustmentHeader.Edit(adjustmentHeader);
                    }
                    var adjustType = getAdjustmentType(adjustmentHeader.AdjustmentTypeId);
                    bool isIssue = adjustType == "Issue" ? true : false;

                    var isLastStep = CheckStatus(adjustmentHeader.StatusId);
                   
                    if (action == "issue")
                    {
                        action = isLastStep == true ? isIssue ? "issue" : "receive" : "post";
                        adjustmentHeader.StatusId = action == "issue" ? issueVoucherStatus : action == "receive" ? receiveVoucherStatus : adjustmentHeader.StatusId;
                    } 
                    SaveAdjustmentDetail(adjustmentHeader.Id,adjustmentHeader.AdjustmentTypeId, requestOrderDetailsString, statusId, action,adjustmentHeader.AdjustmentedDate);
                    var storeRequisitionId=Guid.Empty;
                    if (itemSerialsString != "") _itemSerialTransaction.AddItemSerialTransactions(adjustmentHeader.Id, storeRequisitionId, adjustmentHeader.AdjustmentedDate, AdjustmentVoucherType, adjustmentHeader.VoucherNumber, itemSerialsString, action, isIssue, !isIssue, true);
                    if (itemLOTsString != "") _itemLOTTransaction.AddItemLOTsTransaction(adjustmentHeader.Id, AdjustmentVoucherType, adjustmentHeader.VoucherNumber, itemLOTsString, action);

                  
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
            var voucherWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == AdjustmentVoucherType).OrderByDescending(o => o.Step);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == statusId).FirstOrDefault();
            if (currentStep == voucherWorkFlow.FirstOrDefault())
                returnValue = true;

            return returnValue;
        }
        private void UpdateStatus(psmsAdjustmentHeader adjustmentHeader, string action)
        {


            var date = adjustmentHeader.AdjustmentedDate.ToShortDateString();
            var title = "Adjustment(" + adjustmentHeader.VoucherNumber + ")";
            var message = "A new Adjustment has be added with voucher no  " + adjustmentHeader.VoucherNumber + "on date " + date + " \n ";


            var voucherWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == AdjustmentVoucherType);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == adjustmentHeader.StatusId).FirstOrDefault();
            var nextStep = voucherWorkFlow.Where(o => o.Step == currentStep.Step + 1).FirstOrDefault();
            if (nextStep != null)
            {
                var approver = _approver.GetAll().AsQueryable().Where(o => o.VoucherTypeId == AdjustmentVoucherType && o.StatusId == nextStep.VoucherStatusId && ((o.StoreId.HasValue ? o.StoreId == adjustmentHeader.StoreId : true)));
             
                if (approver.Count() > 0)
                {
                    string approverIds = "";
                    foreach (var objApprover in approver)
                    {
                        approverIds = approverIds + objApprover.EmployeeId.ToString() + ",";
                    }
                    _notification.SaveNotification(title, message, adjustmentHeader.Id, adjustmentHeader.VoucherNumber, nextStep.VoucherStatusId, AdjustmentVoucherType, approverIds, adjustmentHeader.StoreId, null, "");

                }

            }

        }
    
        public void SaveAdjustmentDetail(Guid AdjustmentHeaderId, Guid adjustmentTypeId, string AdjustmentDetailsString, Guid statusId, string action, DateTime transactionDate)
        {
            AdjustmentDetailsString = AdjustmentDetailsString.Remove(AdjustmentDetailsString.Length - 1);
            IList<string> AdjustmentDetails = AdjustmentDetailsString.Split(new[] { ';' }).ToList();
            IList<psmsAdjustmentDetail> AdjustmentDetailList = new List<psmsAdjustmentDetail>();
            var oldsAdjustmentDetailList = _adjustmentDetail.GetAll().AsQueryable().Where(o => o.AdjustmentHeaderId == AdjustmentHeaderId);
            for (var i = 0; i < AdjustmentDetails.Count(); i++)
            {
                var AdjustmentDetail = AdjustmentDetails[i].Split(new[] { ':' });
                var AdjustmentDetailId = Guid.Empty;
                Guid.TryParse(AdjustmentDetail[0].ToString(), out AdjustmentDetailId);
                var objAdjustmentDetail = AdjustmentDetailId != Guid.Empty ? _adjustmentDetail.Get(o => o.Id == AdjustmentDetailId) : new psmsAdjustmentDetail();

                objAdjustmentDetail.AdjustmentHeaderId = AdjustmentHeaderId;
                objAdjustmentDetail.ItemId = Guid.Parse(AdjustmentDetail[2]);
                objAdjustmentDetail.Quantity = decimal.Parse(AdjustmentDetail[3]);
                objAdjustmentDetail.UnitCost = decimal.Parse(AdjustmentDetail[4]);
              
                objAdjustmentDetail.UpdatedAt = DateTime.Now;
                if (AdjustmentDetailId == Guid.Empty)
                {
                    objAdjustmentDetail.Id = Guid.NewGuid();
                    objAdjustmentDetail.CreatedAt = DateTime.Now.AddSeconds(2);
                    objAdjustmentDetail.StatusId = statusId;
                    _adjustmentDetail.AddNew(objAdjustmentDetail);
                }
                if (action == "issue" || action == "receive")
                {
                    var adjsutmentType = getAdjustmentType(adjustmentTypeId);
                    UpdateInventory(objAdjustmentDetail, adjsutmentType, transactionDate);
                }
                AdjustmentDetailList.Add(objAdjustmentDetail);
            }
            DeleteAdjustmentDetail(AdjustmentDetailList, oldsAdjustmentDetailList);

        }
        private void DeleteAdjustmentDetail(IList<psmsAdjustmentDetail> AdjustmentDetailList, IQueryable<psmsAdjustmentDetail> oldsAdjustmentDetailList)
        {
            foreach (var objoldsAdjustmentDetail in oldsAdjustmentDetailList)
            {
                var record = AdjustmentDetailList.Where(o => o.Id == objoldsAdjustmentDetail.Id);

                if (record.Count() == 0)
                {
                   _adjustmentDetail.Delete(o => o.Id == objoldsAdjustmentDetail.Id);
                }
            }
        }     
        private void UpdateInventory(psmsAdjustmentDetail AdjustmentDetail,string adjustmentType,DateTime transactionDate)
        {
            var model = new ParameterModel { VoucherId = AdjustmentDetail.AdjustmentHeaderId, VoucherTypeId = AdjustmentVoucherType, VoucherNo = AdjustmentDetail.psmsAdjustmentHeader.VoucherNumber, ItemId = AdjustmentDetail.ItemId, StoreId = AdjustmentDetail.psmsAdjustmentHeader.StoreId, FiscalYearId = AdjustmentDetail.psmsAdjustmentHeader.FiscalYearId, TransactionDate = transactionDate, Quantity = (double)AdjustmentDetail.Quantity, UnitCost = AdjustmentDetail.UnitCost, DamagedQuantity = 0 };
                   
            if (adjustmentType=="Issue")
                _inventoryRecord.IssueInventoryUpdate(model);
            else if (adjustmentType == "Receive")
                _inventoryRecord.ReceiveInventoryUpdate(model);
            else if (adjustmentType == "Damage")
                _inventoryRecord.DamageInventoryUpdate(model,model.Quantity);
            else if (adjustmentType == "Expiry")
                _inventoryRecord.ExpireyInventoryUpdate(model,model.Quantity);
  
    
        }
        private void UpdateInventoryFromVoided(psmsAdjustmentDetail AdjustmentDetail, string adjustmentType)
        {
            var model = new ParameterModel { VoucherId = AdjustmentDetail.AdjustmentHeaderId, VoucherTypeId = AdjustmentVoucherType, VoucherNo = AdjustmentDetail.psmsAdjustmentHeader.VoucherNumber, ItemId = AdjustmentDetail.ItemId, StoreId = AdjustmentDetail.psmsAdjustmentHeader.StoreId, FiscalYearId = AdjustmentDetail.psmsAdjustmentHeader.FiscalYearId, TransactionDate = AdjustmentDetail.psmsAdjustmentHeader.AdjustmentedDate, Quantity = (double)AdjustmentDetail.Quantity,DamagedQuantity=0, UnitCost = AdjustmentDetail.UnitCost };
       
            if (adjustmentType == "Issue")
                _inventoryRecord.IssueInventoryUpdateFromVoidedT(model);
            else if (adjustmentType == "Receive")
                _inventoryRecord.ReceiveInventoryUpdateFromVoidedT(model);
            else if (adjustmentType == "Damage")
                _inventoryRecord.DamageInventoryUpdate(model,-model.Quantity);
            else if (adjustmentType == "Expiry")
                _inventoryRecord.ExpireyInventoryUpdate(model, -model.Quantity);
        
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
         private string getAdjustmentType(Guid typeId)
        {
           var adjustmentType=_adjustmentType.Get(o=>o.Id==typeId);
            return adjustmentType.Name;
        }
         private IQueryable<psmsAdjustmentHeader> SearchTransaction(string mode, Hashtable ht, IQueryable<psmsAdjustmentHeader> filtered)
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
                         filtered = filtered.Where(v => v.psmsAdjustmentDetail.Where(f =>
                             (f.psmsItem.Name.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                             (f.psmsItem.Code.ToUpper().StartsWith(tSearchText.ToUpper()))).Any() ||
                             (v.psmsStore.Name.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                             (v.lupAdjustmentType.Name.ToUpper().StartsWith(tSearchText.ToUpper())) ||                                                      
                             (v.coreUser1.FirstName + " " + v.coreUser1.LastName).ToUpper().StartsWith(tSearchText.ToUpper())
                             ||
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
                         filtered = filtered.Where(v => v.AdjustmentedDate >= transactionStartDate && v.AdjustmentedDate <= transactionEndDate);
                     }
                     break;
             }
             return filtered;
         }
 
        #endregion
    }
}
