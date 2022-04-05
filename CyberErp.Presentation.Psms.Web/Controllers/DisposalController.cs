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
    public class DisposalController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsDisposalHeader> _disposalHeader;
        private readonly BaseModel<psmsDisposalDetail> _disposalDetail;
        private readonly BaseModel<psmsItem> _item;
        private readonly BaseModel<psmsStore> _store;
        private readonly InventoryRecord _inventoryRecord;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        private readonly BaseModel<coreUnit> _unit;
        private readonly BaseModel<coreUser> _user;
        private readonly BaseModel<psmsApprover> _approver;
        
        private readonly BaseModel<psmsStorePermission> _storePermission;
        private readonly ItemLOTTransaction _itemLOTTransaction;
        private readonly ItemSerialTransaction _itemSerialTransaction;
        private readonly Notification _notification;
        private readonly BaseModel<coreVoucherWorkFlow> _voucherWorkFlow;
     
     
        private Utility _utils;
        Guid postedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Posted);

        Guid certifiedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Certified);
        Guid approvedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Approved);
        Guid partiallyVoucherStatus = Guid.Parse(Constants.Voucher_Status_Partially_Approved);
        Guid rejectedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Rejected);
        Guid voidVoucherStatus = Guid.Parse(Constants.Voucher_Status_Void);
     
        Guid DisposalVoucherType = Guid.Parse(Constants.Voucher_Type_StoreDisposal);
        Guid issuedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Issued);     
     
        
        private readonly Lookups _lookup;
        
        private Guid employeeId = Guid.Empty;
        private string employeeName = "";
        private User _objUser;
       
        #endregion
        
        #region Constructor

        public DisposalController()
        {
             _context = new ErpEntities(Constants.ConnectionString);
             _disposalHeader = new BaseModel<psmsDisposalHeader>(_context);
             _disposalDetail = new BaseModel<psmsDisposalDetail>(_context);
            _item = new BaseModel<psmsItem>(_context);
            _store = new BaseModel<psmsStore>(_context);
            _inventoryRecord = new InventoryRecord(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);
            _unit = new BaseModel<coreUnit>(_context);
            _approver = new BaseModel<psmsApprover>(_context);           
            _storePermission = new BaseModel<psmsStorePermission>(_context);
            _itemLOTTransaction = new ItemLOTTransaction(_context);
            _itemSerialTransaction = new ItemSerialTransaction(_context);
            _notification = new Notification(_context);
            _voucherWorkFlow = new BaseModel<coreVoucherWorkFlow>(_context);
          
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
           
            var objStoreDisposal = _disposalHeader.Get(o=>o.Id==id);
            var records = new
            {
                objStoreDisposal.Id,
                objStoreDisposal.DisposalRequestHeaderId,
                objStoreDisposal.VoucherNumber,
                DisposedDate=objStoreDisposal.DisposedDate.ToShortDateString(),
                objStoreDisposal.PreparedById,
                objStoreDisposal.DisposalTypeId,
                DisposalType=objStoreDisposal.lupDisposalType.Name,
                objStoreDisposal.DisposedById,
                 objStoreDisposal.FiscalYearId,
                FiscalYear=objStoreDisposal.coreFiscalYear.Name,
                DisposedBy = objStoreDisposal.DisposedById != null ? objStoreDisposal.coreUser1.FirstName + " " + objStoreDisposal.coreUser1.LastName : "",
                objStoreDisposal.StatusId,
                objStoreDisposal.StoreId,
                objStoreDisposal.IsPosted,
                Store = objStoreDisposal.psmsStore != null ? objStoreDisposal.psmsStore.Name : "",
                objStoreDisposal.Remark,
                objStoreDisposal.CreatedAt
            };
            var serialList = _itemSerialTransaction.GetItemSerialTransactionList(objStoreDisposal.Id, DisposalVoucherType);
            var lotList =_itemLOTTransaction.GetItemLOTList(objStoreDisposal.Id, DisposalVoucherType);
         
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
                var disposalRequestId = hashtable["disposalRequestId"] != null && hashtable["disposalRequestId"] != "" ? Guid.Parse(hashtable["disposalRequestId"].ToString()) : Guid.Empty;
                var mode = hashtable["mode"] != null ? hashtable["mode"].ToString() : "";
                var LastWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == DisposalVoucherType).OrderByDescending(o => o.Step).FirstOrDefault();
                var lastVoucherId = LastWorkFlow != null ? LastWorkFlow.VoucherStatusId : Guid.Empty;
                var userId = Guid.Empty;
                var objUser = (coreUser)Session[Constants.CurrentUser];
                if (objUser != null && objUser.Id != null)
                {
                    employeeId = (Guid)objUser.Id;
                    userId = (Guid)objUser.Id;
                }
                var filtered = _disposalHeader.GetAll().AsQueryable().Where(x => ( x.psmsStore.psmsStorePermission.Where(f => f.UserId == userId).Any()));
                filtered = SearchTransaction(mode, hashtable, filtered);
            
                switch (sort)
                {
                      case "VoucherNumber":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.VoucherNumber) : filtered.OrderBy(u => u.VoucherNumber);
                        break;
                    case "DisposedDate":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.DisposedDate) : filtered.OrderBy(u => u.DisposedDate);
                        break;
                    case "DisposalType":
                        filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.lupDisposalType.Name) : filtered.OrderBy(u => u.lupDisposalType.Name);
                        break;
                    case "DisposedBy":
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
                    item.DisposedDate,
                    DisposedBy = item.coreUser1.FirstName + " " + item.coreUser1.LastName,
                    item.StatusId,
                    DisposalType = item.lupDisposalType.Name,
                
                    Store = item.psmsStore.Name,
                    Status = item.lupVoucherStatus.Name,
                    item.StoreId,
                    IsLastStep = lastVoucherId != Guid.Empty ? lastVoucherId == item.StatusId : true,
                    PreparedBy = item.coreUser.FirstName + " " + item.coreUser.LastName,
                 
                    item.Remark,
                    item.CreatedAt
                }).ToList().Select(item => new
                {
                    item.Id,
                    item.DisposedBy,
                    item.DisposalType,
                    DisposedDate = item.DisposedDate.ToShortDateString(),
                    item.VoucherNumber,
                    item.PreparedBy,
                    item.IsLastStep,
                    item.StatusId,
                    item.Store,
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
                    var filtered = _disposalDetail.GetAll().AsQueryable().Where(d => d.DisposalHeaderId == voucherHeaderId).OrderBy(o => o.CreatedAt);
                    var count = filtered.Count();
                    records = filtered.Select(item => new
                    {
                        item.Id,
                        item.DisposalHeaderId,
                        Name = item.psmsItem.Name,
                        item.ItemId,
                        item.psmsItem.IsSerialItem,
                        item.psmsItem.IsLOTItem,
                        item.UnitPrice,
                        Code = item.ItemId != null ? item.psmsItem.Code : "",
                        item.StatusId,
                        Status = item.lupVoucherStatus.Name,
                        MeasurementUnit = item.ItemId != null ? item.psmsItem.lupMeasurementUnit.Name : "",
                        item.Quantity,
                        item.DisposedQuantity,
                        RemainingQuantity= item.RemainingQuantity,
                        AvailableQuantity = item.psmsItem.psmsInventoryRecord.Where(o => o.IsClosed == false && o.StoreId == storeId && o.FiscalYearId == fiscalYearId).Select(f => f.AvailableQuantity).DefaultIfEmpty(0).Sum(),
                        Remark = item.Remarks,
                    }).ToList().Cast<object>().ToList();
                    var result = new { total = count, data = records };
                    return this.Direct(result);
                
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

            var filtered = _disposalHeader.GetAll().AsQueryable().Where(o => o.VoucherNumber.ToUpper().Contains(queryparam.ToUpper()));
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
                    var objHeader = _disposalHeader.Get(o => o.Id == id);
                    if (objHeader.IsPosted == true)
                        return this.Direct(new { success = false, data = "you can't void already posted transaction!" });

                    if (objHeader.StatusId == issuedVoucherStatus)
                    {
                      
                        foreach(var objDisposalDetail in objHeader.psmsDisposalDetail)
                        {
                             objDisposalDetail.StatusId = voidVoucherStatus;
                            objDisposalDetail.UnitCost = 0;
                            UpdateInventoryFromVoidedT(objDisposalDetail);
                        }
                       _itemSerialTransaction.VoidItemSerialTransaction(objHeader.Id, DisposalVoucherType,Guid.Empty,false);
                       _itemLOTTransaction.VoidItemLOTTransaction(objHeader.Id, DisposalVoucherType);
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
        public ActionResult Save(psmsDisposalHeader disposalHeader)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var disposalRequestDetailsString = hashtable["disposalDetails"].ToString();
                    var itemSerialsString = hashtable["itemSerials"].ToString();
                    var itemLOTsString = hashtable["itemLOTs"].ToString();
                    var action = hashtable["action"].ToString();
                    var statusId = disposalHeader.StatusId;
                  
                    if (disposalHeader.Id==Guid.Empty)
                    {                       
                      disposalHeader.Id = Guid.NewGuid();
                      disposalHeader.CreatedAt = DateTime.Now;
                      disposalHeader.UpdatedAt = DateTime.Now;                    
                      CyberErp.Presentation.Psms.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Psms.Web.MvcApplication;
                      httpapplication.Application.Lock();
                      disposalHeader.VoucherNumber = _utils.GetVoucherNumber("Disposal", disposalHeader.StoreId);
                      _disposalHeader.AddNew(disposalHeader);
                      _utils.UpdateVoucherNumber("Disposal", disposalHeader.StoreId);
                      httpapplication.Application.UnLock();
                      UpdateStatus(disposalHeader, action);
                
                    }
                    else
                    {
                        disposalHeader.UpdatedAt=DateTime.Now;
                       
                        _disposalHeader.Edit(disposalHeader);
                    }
                    var isIssue = CheckStatus(disposalHeader.StatusId);
                    if (action == "issue")
                    {
                        action = isIssue == true ? "issue" : "post";                 
                        disposalHeader.StatusId = issuedVoucherStatus;              
                    }
                      
                    SaveDisposalDetail(disposalHeader.Id, disposalRequestDetailsString, statusId, action,disposalHeader.DisposedDate);
                    if (itemSerialsString != "") _itemSerialTransaction.AddItemSerialTransactions(disposalHeader.Id,Guid.Empty,disposalHeader.DisposedDate, DisposalVoucherType, disposalHeader.VoucherNumber, itemSerialsString, action,false,false,false);
                    if (itemLOTsString != "") _itemLOTTransaction.AddItemLOTsTransaction(disposalHeader.Id, DisposalVoucherType, disposalHeader.VoucherNumber, itemLOTsString, action);

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
            var voucherWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == DisposalVoucherType).OrderByDescending(o => o.Step);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == statusId).FirstOrDefault();
            if (currentStep == voucherWorkFlow.FirstOrDefault())
                returnValue = true;

            return returnValue;
        }
        private void UpdateStatus(psmsDisposalHeader disposalHeader, string action)
        {


            var date = disposalHeader.DisposedDate.ToShortDateString();
            var title = "Disposal(" + disposalHeader.VoucherNumber + ")";
            var message = "A new disposal has be added with voucher no  " + disposalHeader.VoucherNumber + "on date " + date + " \n ";
            var voucherWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == DisposalVoucherType);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == disposalHeader.StatusId).FirstOrDefault();
            var nextStep = voucherWorkFlow.Where(o => o.Step == currentStep.Step + 1).FirstOrDefault();
            if (nextStep != null)
            {
                var approver = _approver.GetAll().AsQueryable().Where(o => o.VoucherTypeId == DisposalVoucherType && o.StatusId == nextStep.VoucherStatusId && ((o.StoreId.HasValue ? o.StoreId == disposalHeader.StoreId : true)));
                 if (approver.Count() > 0)
                {
                    string approverIds = "";
                    foreach (var objApprover in approver)
                    {
                        approverIds = approverIds + objApprover.EmployeeId.ToString() + ",";
                    }
                    _notification.SaveNotification(title, message, disposalHeader.Id, disposalHeader.VoucherNumber, nextStep.VoucherStatusId, DisposalVoucherType, approverIds, disposalHeader.StoreId, null, "");
                }
            }

        }
    
        public void SaveDisposalDetail(Guid disposalHeaderId, string disposalDetailsString,  Guid statusId, string action, DateTime transactionDate)
        {
            disposalDetailsString = disposalDetailsString.Remove(disposalDetailsString.Length - 1);
            IList<string> disposalDetails = disposalDetailsString.Split(new[] { ';' }).ToList();
            IList<psmsDisposalDetail> disposalDetailList = new List<psmsDisposalDetail>();
            var oldsDisposalDetailList =_disposalDetail.GetAll().AsQueryable().Where(o => o.DisposalHeaderId == disposalHeaderId);
            for (var i = 0; i < disposalDetails.Count(); i++)
            {
                var disposalDetail = disposalDetails[i].Split(new[] { ':' });
                var disposalDetailId = Guid.Empty;decimal unitPrice=0;
                Guid.TryParse(disposalDetail[0].ToString(), out disposalDetailId);
                var objDisposalDetail = disposalDetailId != Guid.Empty ? _disposalDetail.Get(o => o.Id == disposalDetailId) : new psmsDisposalDetail();
               
                objDisposalDetail.DisposalHeaderId = disposalHeaderId;
                objDisposalDetail.ItemId = Guid.Parse(disposalDetail[2]);
                objDisposalDetail.Quantity = decimal.Parse(disposalDetail[3]);
                objDisposalDetail.DisposedQuantity = decimal.Parse(disposalDetail[4]);            
                objDisposalDetail.RemainingQuantity = decimal.Parse(disposalDetail[5]);
                objDisposalDetail.Remarks = disposalDetail[6];
                if (decimal.TryParse(disposalDetail[8].ToString(), out unitPrice))
                    objDisposalDetail.UnitPrice = decimal.Parse(disposalDetail[8]);
                else
                    objDisposalDetail.UnitPrice = 0;
                objDisposalDetail.UpdatedAt = DateTime.Now;                
                if (disposalDetailId == Guid.Empty)
                {
                    objDisposalDetail.Id = Guid.NewGuid();
                    objDisposalDetail.CreatedAt = DateTime.Now.AddSeconds(2);
                    objDisposalDetail.StatusId = statusId;
                   _disposalDetail.AddNew(objDisposalDetail);
                }
                if (action == "issue")
                {
                     UpdateInventory(objDisposalDetail, transactionDate);
                }
                 disposalDetailList.Add(objDisposalDetail);
            }
            DeleteDisposalDetail(disposalDetailList, oldsDisposalDetailList);
           
        }
        private void DeleteDisposalDetail(IList<psmsDisposalDetail> disposalDetailList, IQueryable<psmsDisposalDetail> oldsDisposalDetailList)
        {
            foreach (var objoldsDisposalDetail in oldsDisposalDetailList)
            {
                var record = disposalDetailList.Where(o => o.Id == objoldsDisposalDetail.Id);

                if (record.Count() == 0)
                {
                      _disposalDetail.Delete(o => o.Id == objoldsDisposalDetail.Id);
                }
            }
        }
         private void UpdateInventory(psmsDisposalDetail disposalDetail, DateTime transactionDate)
        {
            var model = new ParameterModel { VoucherId = disposalDetail.DisposalHeaderId, VoucherTypeId = DisposalVoucherType, VoucherNo = disposalDetail.psmsDisposalHeader.VoucherNumber, ItemId = disposalDetail.ItemId, StoreId = disposalDetail.psmsDisposalHeader.StoreId, FiscalYearId = disposalDetail.psmsDisposalHeader.FiscalYearId, TransactionDate = transactionDate, Quantity =(double) disposalDetail.DisposedQuantity.Value, DamagedQuantity = 0 };

            var unitCost = _inventoryRecord.IssueInventoryUpdate(model);
           disposalDetail.UnitCost = unitCost;
        }
        private void UpdateInventoryFromVoidedT(psmsDisposalDetail disposalDetail)
        {
            var model = new ParameterModel { VoucherId = disposalDetail.DisposalHeaderId, VoucherTypeId = DisposalVoucherType, VoucherNo = disposalDetail.psmsDisposalHeader.VoucherNumber, ItemId = disposalDetail.ItemId, StoreId = disposalDetail.psmsDisposalHeader.StoreId, FiscalYearId = disposalDetail.psmsDisposalHeader.FiscalYearId, TransactionDate = disposalDetail.psmsDisposalHeader.DisposedDate, Quantity = (double)disposalDetail.DisposedQuantity.Value, DamagedQuantity = 0 };

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
        private IQueryable<psmsDisposalHeader> SearchTransaction(string mode, Hashtable ht, IQueryable<psmsDisposalHeader> filtered)
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
                        filtered = filtered.Where(v => v.psmsDisposalDetail.Where(f =>
                            (f.psmsItem.Name.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            (f.psmsItem.Code.ToUpper().StartsWith(tSearchText.ToUpper()))).Any() ||
                            (v.psmsStore.Name.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                          
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
                        filtered = filtered.Where(v => v.DisposedDate >= transactionStartDate && v.DisposedDate <= transactionEndDate);
                    }
                    break;
            }
            return filtered;
        }
 
       
        #endregion
    }
}
