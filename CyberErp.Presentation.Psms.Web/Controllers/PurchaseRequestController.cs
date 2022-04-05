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
    public class PurchaseRequestController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsPurchaseRequestHeader> _purchaseRequestHeader;
        private readonly BaseModel<psmsPurchaseRequestDetail> _purchaseRequestDetail;
        private readonly BaseModel<psmsItem> _item;
        private readonly BaseModel<psmsStore> _store;
        private readonly InventoryRecord _inventoryRecord;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        private readonly BaseModel<coreUnit> _unit;
        private readonly BaseModel<coreUser> _user;
        private readonly BaseModel<psmsApprover> _approver;
        
        private readonly BaseModel<psmsStorePermission> _storePermission;
        private readonly BaseModel<psmsRequestOrderHeader> _requestOrderHeader;
        private readonly BaseModel<psmsRequestOrderDetail> _requestOrderDetail;
        private readonly Notification _notification;     
        private readonly BaseModel<coreVoucherWorkFlow> _voucherWorkFlow;   
        IList<psmsPurchaseRequestDetail> PurchaseRequestDetailList = new List<psmsPurchaseRequestDetail>();
          
         private Utility _utils;
        Guid postedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Posted);
        Guid certifiedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Certified);
        Guid approvedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Approved);
        Guid partiallyVoucherStatus = Guid.Parse(Constants.Voucher_Status_Partially_Approved);
        Guid rejectedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Rejected);
        Guid voidVoucherStatus = Guid.Parse(Constants.Voucher_Status_Void);
        Guid purchaseRequestVoucherType = Guid.Parse(Constants.Voucher_Type_PurchaseRequest);

        private readonly Lookups _lookup;
        private Guid employeeId = Guid.Empty;
        private string employeeName = "";
       
        #endregion

        #region Constructor

        public PurchaseRequestController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _purchaseRequestHeader = new BaseModel<psmsPurchaseRequestHeader>(_context);
            _purchaseRequestDetail = new BaseModel<psmsPurchaseRequestDetail>(_context);
            _item = new BaseModel<psmsItem>(_context);
            _store = new BaseModel<psmsStore>(_context);
            _inventoryRecord = new InventoryRecord(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);
            _unit = new BaseModel<coreUnit>(_context);
            _approver = new BaseModel<psmsApprover>(_context);
            
            _storePermission = new BaseModel<psmsStorePermission>(_context);
            _requestOrderHeader = new BaseModel<psmsRequestOrderHeader>(_context);
            _requestOrderDetail = new BaseModel<psmsRequestOrderDetail>(_context);
            _notification = new Notification(_context);
            _user = new BaseModel<coreUser>(_context);
            _utils = new Utility();
            _lookup = new Lookups(_context);
            _voucherWorkFlow = new BaseModel<coreVoucherWorkFlow>(_context);
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

            var objPurchaseRequest = _purchaseRequestHeader.Get(o => o.Id == id);
            var purchaseRequest = new
            {
                objPurchaseRequest.Id,
                objPurchaseRequest.VoucherNumber,
                objPurchaseRequest.FiscalYearId,
                objPurchaseRequest.RequestOrderHeaderId,
                StoreRequestNo = objPurchaseRequest.RequestOrderHeaderId.HasValue ? objPurchaseRequest.psmsRequestOrderHeader.StoreRequisitionHeaderId.HasValue ? objPurchaseRequest.psmsRequestOrderHeader.psmsStoreRequisitionHeader.VoucherNumber : "": "",
                objPurchaseRequest.ConsumerTypeId,
                objPurchaseRequest.ConsumerEmployeeId,               
                objPurchaseRequest.PurchaseTypeId,
                objPurchaseRequest.ConsumerStoreId,
                objPurchaseRequest.ConsumerUnitId,
                ConsumerType = objPurchaseRequest.lupConsumerType.Name,
                ConsumerEmployee = objPurchaseRequest.ConsumerEmployeeId != null ? objPurchaseRequest.coreUser.FirstName + " " + objPurchaseRequest.coreUser.LastName : "",
                ConsumerStore = objPurchaseRequest.ConsumerStoreId != null ? objPurchaseRequest.psmsStore1.Name : "",
                ConsumerUnit = objPurchaseRequest.ConsumerUnitId != null ? objPurchaseRequest.coreUnit.Name : "",
                RequestedDate = objPurchaseRequest.RequestedDate.ToShortDateString(),
                RequiredDate = objPurchaseRequest.RequiredDate.ToShortDateString(),

                objPurchaseRequest.RequestTypeId,
                RequestType = objPurchaseRequest.lupPurchaseRequestType.Name,
                objPurchaseRequest.PreparedById,
                   objPurchaseRequest.RequestedById,
                FiscalYear = objPurchaseRequest.coreFiscalYear.Name,
                RequestedBy = objPurchaseRequest.coreUser1.FirstName + " " + objPurchaseRequest.coreUser1.LastName,
                 objPurchaseRequest.StatusId,
                objPurchaseRequest.StoreId,
                Store = objPurchaseRequest.psmsStore.Name,
                objPurchaseRequest.Remark,
                objPurchaseRequest.CreatedAt
            };
            return this.Direct(new
            {
                success = true,
                data = purchaseRequest
            });
        }
     
        public DirectResult GetAllHeader(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
              
                var requestOrderId = hashtable["requestOrderId"] != null && hashtable["requestOrderId"] != "" ? Guid.Parse(hashtable["requestOrderId"].ToString()) : Guid.Empty;

                var LastWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == purchaseRequestVoucherType).OrderByDescending(o => o.Step);
                var lastVoucherId = LastWorkFlow.Count() > 0 ? LastWorkFlow.FirstOrDefault().VoucherStatusId : Guid.Empty;
                var step = LastWorkFlow.Count() > 0 ? LastWorkFlow.FirstOrDefault().Step : 0;
                var secondLastVoucherId = LastWorkFlow.Count() > 1 ? LastWorkFlow.Where(o => o.Step == step - 1).FirstOrDefault().VoucherStatusId : Guid.Empty;
          
                var filtered = GetFilteredHeader(record);
                if (requestOrderId!=Guid.Empty)
                filtered = filtered.Where(o => o.RequestOrderHeaderId == requestOrderId);
                filtered = GetFilteredHeader(filtered, sort, dir);
                var count = filtered.Count();
                filtered = filtered.Skip(start).Take(limit);
                var purchaserequestHeaders = filtered.Select(item => new
                {
                    item.Id,
                    item.VoucherNumber,
                    StoreRequestNo = item.RequestOrderHeaderId.HasValue ? item.psmsRequestOrderHeader.StoreRequisitionHeaderId.HasValue ? item.psmsRequestOrderHeader.psmsStoreRequisitionHeader.VoucherNumber:"":"",          
                    RequestType = item.lupPurchaseRequestType.Name,                
                    FiscalYear = item.coreFiscalYear.Name,
                    item.RequestedDate,
                    RequiredDate = item.RequiredDate,
                    ConsumerType = item.lupConsumerType.Name,
                    Consumer = item.ConsumerEmployeeId.HasValue ? item.coreUser.FirstName + " " + item.coreUser.LastName : item.ConsumerStoreId.HasValue ? item.psmsStore1.Name : item.ConsumerUnitId.HasValue ? item.coreUnit.Name :"",                          
                    RequestedBy = item.coreUser1.FirstName + " " + item.coreUser1.LastName,
                    IsLastStep = lastVoucherId != Guid.Empty ?lastVoucherId == item.StatusId : true,               
                    item.StatusId,
                    item.StoreId,
                    Store = item.psmsStore.Name,
                    Status=item.lupVoucherStatus.Name,
                    item.Remark,
   
                }).ToList().Select(item => new
                {
                    item.Id,
                    item.VoucherNumber,
                    item.StoreRequestNo,
                    item.ConsumerType,
                    item.Consumer,
                    item.IsLastStep,
                    RequestType = item.RequestType,
                    FiscalYear = item.FiscalYear,
                    RequestedDate=item.RequestedDate.ToShortDateString(),
                    RequiredDate = item.RequiredDate.ToShortDateString(),               
                    RequestedBy = item.RequestedBy,
                    item.StatusId,
                    item.StoreId,
                    Store = item.Store,
                    item.Status,
                    item.Remark,
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
                if (hashtable["voucherHeaderId"] != null && hashtable["voucherHeaderId"] != "")
                Guid.TryParse(hashtable["voucherHeaderId"].ToString(), out voucherHeaderId);

                var action = hashtable["action"].ToString();
                if (action == "requestOrder")
                {
                    var records =GetRequestOrderDetail(voucherHeaderId);
                    var result = new { total = records.Count, data = records };
                    return this.Direct(result);
                }
                else
                {
                    var filtered = _purchaseRequestDetail.GetAll().AsQueryable().Where(d => d.PurchaseRequestHeaderId == voucherHeaderId).OrderBy(o => o.CreatedAt);
                    var count = filtered.Count();
                    var records = filtered.Select(item => new
                    {
                        item.Id,
                        item.PurchaseRequestHeaderId,
                        item.ItemId,
                        Name = item.ItemId.HasValue ? item.psmsItem.Name : item.Description,
                        Code = item.ItemId != null ? item.psmsItem.Code : "",
                        item.UnitId,
                        item.UnprocessedQuantity,
                        MeasurementUnit = item.lupMeasurementUnit.Name,
                        item.Quantity,
                        item.RemainingQuantity,
                        item.StatusId,
                        Status = item.lupVoucherStatus.Name,
                        UnitCost=0,
                        item.Remark
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
                    var objHeader = _purchaseRequestHeader.Get(o => o.Id == id);
                    var lastorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == purchaseRequestVoucherType).OrderByDescending(o => o.Step).FirstOrDefault();

                    if (objHeader.StatusId == lastorkFlow.VoucherStatusId)
                    {
                        foreach (var objPurchaseRequestDetail in objHeader.psmsPurchaseRequestDetail)
                        {
                            if (objHeader.RequestOrderHeaderId.HasValue)
                            UpdateRequestOrderDetail(objHeader.RequestOrderHeaderId.Value, objPurchaseRequestDetail.ItemId.Value, -objPurchaseRequestDetail.Quantity);                       
                            objPurchaseRequestDetail.StatusId = voidVoucherStatus;
                         }
                    }
                    objHeader.StatusId = voidVoucherStatus;
                    if (objHeader.RequestOrderHeaderId.HasValue)
                    {
                        VoidRequisitionOrder(objHeader.RequestOrderHeaderId.Value);
                    } 
                
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
        public void VoidRequisitionOrder(Guid id)
        {
            var objHeader = _requestOrderHeader.Get(o => o.Id == id);
            foreach (var objRequestOrderDetail in objHeader.psmsRequestOrderDetail)
            {
                objRequestOrderDetail.StatusId = voidVoucherStatus;
                var objStoreRequisitionDetail = objHeader.psmsStoreRequisitionHeader.psmsStoreRequisitionDetail.Where(o =>  (objRequestOrderDetail.ItemId != null ? o.ItemId == objRequestOrderDetail.ItemId : o.Description == objRequestOrderDetail.Description)).FirstOrDefault();
                objStoreRequisitionDetail.UnprocessedQuantity = objStoreRequisitionDetail.UnprocessedQuantity + objRequestOrderDetail.Quantity;
            }
            objHeader.StatusId = voidVoucherStatus;
        }
   
        [FormHandler]
        public ActionResult Save(psmsPurchaseRequestHeader PurchaseRequestHeader)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var requestOrderDetailsString = hashtable["purchaseRequestDetails"].ToString();
                    var action = hashtable["action"].ToString();
                    var statusId = Guid.Empty;
                    if (PurchaseRequestHeader.Id == Guid.Empty)
                    {
                         PurchaseRequestHeader.Id = Guid.NewGuid();
                        PurchaseRequestHeader.CreatedAt = DateTime.Now;
                        PurchaseRequestHeader.UpdatedAt = DateTime.Now;
                        CyberErp.Presentation.Psms.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Psms.Web.MvcApplication;
                        httpapplication.Application.Lock();

                        PurchaseRequestHeader.VoucherNumber = _utils.GetVoucherNumber("Purchase Request", PurchaseRequestHeader.StoreId);
                        _purchaseRequestHeader.AddNew(PurchaseRequestHeader);
                        _utils.UpdateVoucherNumber("Purchase Request", PurchaseRequestHeader.StoreId);
                        httpapplication.Application.UnLock();
                        UpdateStatus(PurchaseRequestHeader, action);
          
                     }
                    else
                    {
                        if (action == "revise")
                        {
                            _notification.VoidAllNotification(purchaseRequestVoucherType, PurchaseRequestHeader.Id);

                            PurchaseRequestHeader.StatusId = postedVoucherStatus;
                            UpdateStatus(PurchaseRequestHeader, action);

                        }
                        PurchaseRequestHeader.UpdatedAt = DateTime.Now;
                        _purchaseRequestHeader.Edit(PurchaseRequestHeader);
                    }
                    statusId = PurchaseRequestHeader.StatusId;
                    SavePurchaseRequestDetail(PurchaseRequestHeader.Id,PurchaseRequestHeader.RequestOrderHeaderId, requestOrderDetailsString, statusId, action);
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
            var voucherWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == purchaseRequestVoucherType).OrderByDescending(o => o.Step);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == statusId).FirstOrDefault();
            if (currentStep == voucherWorkFlow.FirstOrDefault())
                returnValue = true;

            return returnValue;
        }
        private void UpdateStatus(psmsPurchaseRequestHeader purchaseRequestHeader, string action)
        {
            var date = purchaseRequestHeader.RequestedDate.ToShortDateString();
            var title = "Purchase Request(" + purchaseRequestHeader.VoucherNumber + ")";
            var message = " A new  purchase Request has be added with voucher no  " + purchaseRequestHeader.VoucherNumber + "on date " + date + " \n ";
             var criteria = "";

            var voucherWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == purchaseRequestVoucherType);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == purchaseRequestHeader.StatusId).FirstOrDefault();
            if (currentStep == null)
                throw new System.InvalidOperationException("Please maintain authorization step for the voucher!");

            var nextStep = voucherWorkFlow.Where(o => o.Step == currentStep.Step + 1).FirstOrDefault();
            if (nextStep != null)
            {
                var approver = _approver.GetAll().AsQueryable().Where(o => o.VoucherTypeId == purchaseRequestVoucherType && o.StatusId == nextStep.VoucherStatusId && ((o.StoreId.HasValue ? o.StoreId == purchaseRequestHeader.StoreId : true)));
                if (approver.Count() > 0)
                {
                    string approverIds = "";
                    foreach (var objApprover in approver)
                    {
                        approverIds = approverIds + objApprover.EmployeeId.ToString() + ",";
                    }
                    _notification.SaveNotification(title, message, purchaseRequestHeader.Id, purchaseRequestHeader.VoucherNumber, nextStep.VoucherStatusId, purchaseRequestVoucherType, approverIds, purchaseRequestHeader.StoreId, null, criteria);

                }

            }

        }
     
        private IQueryable<psmsPurchaseRequestHeader> GetFilteredHeader(string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            DateTime startDate, endDate;
            var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
            var action = hashtable["action"] != null ? hashtable["action"].ToString() : "";
            var startDateP = hashtable["startDate"] != null ? hashtable["startDate"].ToString() : "";
            var endDateP = hashtable["endDate"] != null ? hashtable["endDate"].ToString() : "";

            var userId = getCurrentUser();
            var filtered = _purchaseRequestHeader.GetAll().AsQueryable().Where(x => (x.psmsStore.psmsStorePermission.Where(f => f.UserId == userId).Any()));

            if (action == "picker") filtered = filtered.Where(o => o.StatusId == approvedVoucherStatus && o.psmsPurchaseRequestDetail.Where(f => f.UnprocessedQuantity > 0).Any());
            if (DateTime.TryParse(startDateP, out startDate)) filtered = filtered.Where(o => o.RequestedDate >= startDate.Date);
            if (DateTime.TryParse(endDateP, out endDate)) filtered = filtered.Where(o => o.RequestedDate <= endDate.Date);           
            filtered = searchText != "" ? filtered.Where(i =>

               i.VoucherNumber.ToUpper().Contains(searchText.ToUpper()) ||
               (i.RequestOrderHeaderId.HasValue ?i.psmsRequestOrderHeader.StoreRequisitionHeaderId.HasValue ?i.psmsRequestOrderHeader.psmsStoreRequisitionHeader.VoucherNumber.ToUpper().Contains(searchText.ToUpper()) :false:false)||
               i.lupPurchaseRequestType.Name.ToUpper().Contains(searchText.ToUpper()) ||
               i.lupConsumerType.Name.ToUpper().Contains(searchText.ToUpper()) ||
               (i.ConsumerEmployeeId.HasValue?(i.coreUser.FirstName + " " + i.coreUser.LastName).ToUpper().Contains(searchText.ToUpper()): i.ConsumerStoreId.HasValue ?i.psmsStore1.Name.ToUpper().Contains(searchText.ToUpper()):i.ConsumerUnitId.HasValue ?i.coreUnit.Name.ToUpper().Contains(searchText.ToUpper()):false)||
               i.psmsStore.Name.ToUpper().Contains(searchText.ToUpper()) 
               ) : filtered;
          
            return filtered;
        }
        private IOrderedQueryable<psmsPurchaseRequestHeader> GetFilteredHeader(IQueryable<psmsPurchaseRequestHeader> filtered, string sort, string dir)
        {
            switch (sort)
            {
                  case "VoucherNumber":
                    filtered = dir == "DESC"? filtered.OrderByDescending(u => u.VoucherNumber) : filtered.OrderBy(u => u.VoucherNumber);
                    break;
                case "RequestOrderHeader":
                    filtered = dir == "DESC"? filtered.OrderByDescending(u => u.RequestOrderHeaderId.HasValue ? u.psmsRequestOrderHeader.StoreRequisitionHeaderId.HasValue ? u.psmsRequestOrderHeader.psmsStoreRequisitionHeader.VoucherNumber : "" : "") : filtered.OrderBy(u => u.RequestOrderHeaderId.HasValue ? u.psmsRequestOrderHeader.StoreRequisitionHeaderId.HasValue ? u.psmsRequestOrderHeader.psmsStoreRequisitionHeader.VoucherNumber : "" : "");
                    break;

                case "RequestType":
                    filtered = dir == "DESC"? filtered.OrderByDescending(u => u.lupPurchaseRequestType.Name) : filtered.OrderBy(u => u.lupPurchaseRequestType.Name);
                    break;
                case "ConsumerType":
                    filtered = dir == "DESC"? filtered.OrderByDescending(u => u.lupConsumerType.Name) : filtered.OrderBy(u => u.lupConsumerType.Name);
                    break;
                case "Consumer":
                    filtered = dir == "DESC"? filtered.OrderByDescending(u => u.ConsumerEmployeeId.HasValue ? u.coreUser.FirstName + " " + u.coreUser.LastName : u.ConsumerStoreId.HasValue ? u.psmsStore1.Name : u.ConsumerUnitId.HasValue ? u.coreUnit.Name : "") : filtered.OrderBy(u => u.ConsumerEmployeeId.HasValue ? u.coreUser.FirstName + " " + u.coreUser.LastName : u.ConsumerStoreId.HasValue ? u.psmsStore1.Name : u.ConsumerUnitId.HasValue ? u.coreUnit.Name : "");
                    break;

                case "RequestedDate":
                    filtered = dir == "DESC"? filtered.OrderByDescending(u => u.RequestedDate) : filtered.OrderBy(u => u.RequestedDate);
                    break;
                case "PurchaseRequestdBy":
                    filtered = dir == "DESC"? filtered.OrderByDescending(u => u.coreUser2.FirstName + " " + u.coreUser2.LastName) : filtered.OrderBy(u => u.coreUser2.FirstName + " " + u.coreUser2.LastName);
                    break;
                case "Status":
                    filtered = dir == "DESC"? filtered.OrderByDescending(u => u.lupVoucherStatus.Name) : filtered.OrderBy(u => u.lupVoucherStatus.Name);
                    break;
                default:
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                    break;
 

            }
            return (IOrderedQueryable<psmsPurchaseRequestHeader>)filtered;
        }
        public IList GetRequestOrderDetail(Guid voucherHeaderId)
        {
                
                var filtered =_requestOrderDetail.GetAll().AsQueryable().Where(d => d.RequestOrderHeaderId == voucherHeaderId).OrderBy(o => o.CreatedAt);
                var count = filtered.Count();
                var records = filtered.Select(item => new
                {
                    item.RequestOrderHeaderId,
                    Name = item.psmsItem.Name,
                    item.ItemId,
                    item.psmsItem.IsSerialItem,
                    item.psmsItem.IsLOTItem,
                    Code = item.ItemId != null ? item.psmsItem.Code : "",
                    item.StatusId,
                    Status = item.lupVoucherStatus.Name,
                    item.UnitId,
                    MeasurementUnit = item.UnitId != null ? item.lupMeasurementUnit.Name : item.psmsItem.lupMeasurementUnit.Name,
                    item.Quantity,
                    item.RemainingQuantity,
                    Remark=item.psmsRequestOrderHeader.psmsStoreRequisitionHeader.psmsStoreRequisitionDetail.Where(o=>o.ItemId==item.ItemId).FirstOrDefault().TechnicalSpecification
            
                }).ToList();
                return records;
              
        }    
        public void SavePurchaseRequestDetail(Guid PurchaseRequestHeaderId,Guid? requestOrderHeaderId, string PurchaseRequestDetailsString, Guid statusId, string action)
        {
            PurchaseRequestDetailsString = PurchaseRequestDetailsString.Remove(PurchaseRequestDetailsString.Length - 1);
            IList<string> PurchaseRequestDetails = PurchaseRequestDetailsString.Split(new[] { ';' }).ToList();
             var oldsPurchaseRequestDetailList = _purchaseRequestDetail.GetAll().AsQueryable().Where(o => o.PurchaseRequestHeaderId == PurchaseRequestHeaderId);
            for (var i = 0; i < PurchaseRequestDetails.Count(); i++)
            {
                var PurchaseRequestDetail = PurchaseRequestDetails[i].Split(new[] { ':' });
                var PurchaseRequestDetailId = Guid.Empty;
                var itemId=Guid.Empty;
                Guid.TryParse(PurchaseRequestDetail[0].ToString(), out PurchaseRequestDetailId);
                var objPurchaseRequestDetail = PurchaseRequestDetailId != Guid.Empty ? _purchaseRequestDetail.Get(o => o.Id == PurchaseRequestDetailId) : new psmsPurchaseRequestDetail();

                objPurchaseRequestDetail.PurchaseRequestHeaderId = PurchaseRequestHeaderId;
                if(Guid.TryParse(PurchaseRequestDetail[2],out itemId))objPurchaseRequestDetail.ItemId=itemId;
                objPurchaseRequestDetail.UnitId = Guid.Parse(PurchaseRequestDetail[3]);
                objPurchaseRequestDetail.Quantity = decimal.Parse(PurchaseRequestDetail[4]);
                objPurchaseRequestDetail.RemainingQuantity = decimal.Parse(PurchaseRequestDetail[5]);
                objPurchaseRequestDetail.UnprocessedQuantity = decimal.Parse(PurchaseRequestDetail[4]);
                objPurchaseRequestDetail.Description = PurchaseRequestDetail[6];
                objPurchaseRequestDetail.Remark = PurchaseRequestDetail[7];
             
                objPurchaseRequestDetail.UpdatedAt = DateTime.Now;
                if (PurchaseRequestDetailId == Guid.Empty)
                {
                    objPurchaseRequestDetail.Id = Guid.NewGuid();
                    objPurchaseRequestDetail.CreatedAt = DateTime.Now.AddSeconds(2);
                    objPurchaseRequestDetail.StatusId = statusId;
                    _purchaseRequestDetail.AddNew(objPurchaseRequestDetail);
                }
                if (action == "approve")
                {
                    if (requestOrderHeaderId.HasValue)
                    UpdateRequestOrderDetail(requestOrderHeaderId.Value, objPurchaseRequestDetail.ItemId.Value, objPurchaseRequestDetail.Quantity);
               }
                PurchaseRequestDetailList.Add(objPurchaseRequestDetail);
            }
            DeletePurchaseRequestDetail(PurchaseRequestDetailList, oldsPurchaseRequestDetailList);

        }
        private void DeletePurchaseRequestDetail(IList<psmsPurchaseRequestDetail> PurchaseRequestDetailList, IQueryable<psmsPurchaseRequestDetail> oldsPurchaseRequestDetailList)
        {
            foreach (var objoldsPurchaseRequestDetail in oldsPurchaseRequestDetailList)
            {
                var record = PurchaseRequestDetailList.Where(o => o.Id == objoldsPurchaseRequestDetail.Id);

                if (record.Count() == 0)
                {
                     _purchaseRequestDetail.Delete(o => o.Id == objoldsPurchaseRequestDetail.Id);
                }
            }
        }
        private void UpdateRequestOrderDetail(Guid requestOrderHeaderId, Guid itemId, decimal updateQuantity)
        {
            var objRequestOrderDetail = _requestOrderDetail.GetAll().AsQueryable().Where(o => o.RequestOrderHeaderId == requestOrderHeaderId && o.ItemId == itemId).FirstOrDefault();
            objRequestOrderDetail.RemainingQuantity = objRequestOrderDetail.RemainingQuantity - updateQuantity;
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
        private Guid getCurrentUser()
        {
            var userId=Guid.Empty;
            var objUser = (coreUser)Session[Constants.CurrentUser];
            if (objUser != null && objUser.Id != null)
            {
                userId = (Guid)objUser.Id;
            }
            return userId;
        }     
        private void UpdateInventory(psmsStoreRequisitionDetail storeRequisitionDetail, double updateQuantity)
        {
            var model = new ParameterModel { ItemId = storeRequisitionDetail.ItemId.Value, StoreId = storeRequisitionDetail.psmsStoreRequisitionHeader.StoreId.Value, FiscalYearId = storeRequisitionDetail.psmsStoreRequisitionHeader.FiscalYearId, Quantity = (double)storeRequisitionDetail.ApprovedQuantity.Value };

            _inventoryRecord.CommiteInventoryUpdate(model, updateQuantity);
        }
        private void UpdateInventoryFromVoidedT(psmsStoreRequisitionDetail storeRequisitionDetail, double updateQuantity)
        {
            var model = new ParameterModel { ItemId = storeRequisitionDetail.ItemId.Value, StoreId = storeRequisitionDetail.psmsStoreRequisitionHeader.StoreId.Value, FiscalYearId = storeRequisitionDetail.psmsStoreRequisitionHeader.FiscalYearId, Quantity =(double) storeRequisitionDetail.ApprovedQuantity.Value };

            _inventoryRecord.CommiteInventoryUpdateForVoidT(model, updateQuantity);
        } 
        #endregion
    }
}
