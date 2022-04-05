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
    public class GoodsRequestManagementController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsStoreRequisitionHeader> _storeRequisitionHeader;
        private readonly BaseModel<psmsStoreRequisitionDetail> _storeRequisitionDetail;
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
        Guid postedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Posted);

        private readonly BaseModel<psmsPurchaseRequestDetail> _purchaseRequestDetail;
        private readonly BaseModel<psmsPurchaseRequestHeader> _purchaseRequestHeader;
        IList<psmsRequestOrderDetail> requestOrderDetailList = new List<psmsRequestOrderDetail>();

        private readonly Notification _notification;
        private Utility _utils;
 
        Guid rejectedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Rejected);
        Guid storeRequisitionVoucherType = Guid.Parse(Constants.Voucher_Type_StoreRequisition);
        Guid orderedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Ordered);
        Guid partiallyOrderedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Partially_Ordered);
        Guid purchaseRequestVoucherType = Guid.Parse(Constants.Voucher_Type_PurchaseRequest);
      
        private readonly Lookups _lookup;
        
        private Guid employeeId = Guid.Empty;
        private string employeeName = "";
       
        #endregion
        
        #region Constructor

        public GoodsRequestManagementController()
        {
             _context = new ErpEntities(Constants.ConnectionString);
             _storeRequisitionHeader = new BaseModel<psmsStoreRequisitionHeader>(_context);
             _storeRequisitionDetail = new BaseModel<psmsStoreRequisitionDetail>(_context);
            _item = new BaseModel<psmsItem>(_context);
            _store = new BaseModel<psmsStore>(_context);
            _inventoryRecord = new InventoryRecord(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);
            _unit = new BaseModel<coreUnit>(_context);
            _approver = new BaseModel<psmsApprover>(_context);
            
            _storePermission = new BaseModel<psmsStorePermission>(_context);
            _requestOrderDetail = new BaseModel<psmsRequestOrderDetail>(_context);
            _requestOrderHeader = new BaseModel<psmsRequestOrderHeader>(_context);
              _purchaseRequestDetail = new BaseModel<psmsPurchaseRequestDetail>(_context);
            _purchaseRequestHeader = new BaseModel<psmsPurchaseRequestHeader>(_context);
            _voucherWorkFlow = new BaseModel<coreVoucherWorkFlow>(_context);
            _notification = new Notification(_context);
            _lookup = new Lookups(_context);
            _utils = new Utility();
      
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
           
            var objGoodsRequest = _storeRequisitionHeader.Get(o=>o.Id==id);
            var purchaseRequest = new
            {
                objGoodsRequest.Id,
                objGoodsRequest.VoucherNumber,
                objGoodsRequest.RequestedDate,
                objGoodsRequest.StoreRequestTypeId,
                objGoodsRequest.ReferenceNo,
                objGoodsRequest.ConsumerTypeId,
                ConsumerType=objGoodsRequest.lupConsumerType.Name,
                Consumer=objGoodsRequest.ConsumerEmployeeId.HasValue?objGoodsRequest.coreUser.FirstName+" "+objGoodsRequest.coreUser.LastName:objGoodsRequest.ConsumerStoreId.HasValue?objGoodsRequest.psmsStore1.Name:objGoodsRequest.ConsumerUnitId.HasValue?objGoodsRequest.coreUnit.Name:"",
                ConsumerId = objGoodsRequest.ConsumerEmployeeId.HasValue ? objGoodsRequest.ConsumerEmployeeId.Value : objGoodsRequest.ConsumerStoreId.HasValue ? objGoodsRequest.ConsumerStoreId.Value : objGoodsRequest.ConsumerUnitId.HasValue ? objGoodsRequest.ConsumerUnitId.Value :Guid.Empty,
           
                objGoodsRequest.RequiredDate,
                objGoodsRequest.StatusId,
                objGoodsRequest.RequestedById,
                RequestDateView = objGoodsRequest.RequestedDate,
                RequiredDateView = objGoodsRequest.RequiredDate,
                Requester = objGoodsRequest.coreUser2.FirstName + " " + objGoodsRequest.coreUser2.LastName,
                objGoodsRequest.StoreId,
                objGoodsRequest.PurposeId,
                Purpose = objGoodsRequest.lupRequestPurpose.Name,
                Store = objGoodsRequest.psmsStore != null ? objGoodsRequest.psmsStore.Name : "",
                EmployeeId = employeeId,
                objGoodsRequest.Remarks,
                objGoodsRequest.CreatedAt
            };
            return this.Direct(new
            {
                success = true,
                data = purchaseRequest
            });
        }
        public ActionResult GetRequestOrder(Guid id)
        {
           
            var objRequestOrder = _requestOrderHeader.Get(o => o.Id == id);
            var purchaseRequest = new
            {
                objRequestOrder.Id,
                objRequestOrder.StoreRequisitionHeaderId,
                VoucherNumber = objRequestOrder.StoreRequisitionHeaderId.HasValue ? objRequestOrder.psmsStoreRequisitionHeader.VoucherNumber :"",
                objRequestOrder.Date,
                objRequestOrder.OrderType,
                objRequestOrder.StoreId,
                Store=objRequestOrder.StoreId.HasValue?objRequestOrder.psmsStore.Name:"",
                Unit=objRequestOrder.ToUnitId.HasValue?objRequestOrder.coreUnit.Name:"",
                objRequestOrder.StatusId,
                Status=objRequestOrder.lupVoucherStatus.Name,
                EmployeeId = employeeId,
                objRequestOrder.Remark,
                objRequestOrder.CreatedAt
            };
            return this.Direct(new
            {
                success = true,
                data = purchaseRequest
            });
        }       
        public DirectResult GetAllHeaders(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                var mode = hashtable["mode"] != null ? hashtable["mode"].ToString() : "";
            
                var userId = Guid.Empty;
                var objUser = (coreUser)Session[Constants.CurrentUser];
                if (objUser != null && objUser.Id != null)
                {
                    employeeId = (Guid)objUser.Id;
                    userId = (Guid)objUser.Id;
                }
                var LastWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == storeRequisitionVoucherType).OrderByDescending(o => o.Step).FirstOrDefault();
                var lastVoucherId=LastWorkFlow!=null?LastWorkFlow.VoucherStatusId:Guid.Empty;
                var filtered = _storeRequisitionHeader.GetAll().AsQueryable().Where(x =>(lastVoucherId!=Guid.Empty?x.StatusId==lastVoucherId:false) && (x.psmsStore.psmsStorePermission.Where(f => f.UserId == userId && f.IsCoordinator).Any()));
                filtered = filtered.Where(o => o.psmsStoreRequisitionDetail.Where(f => f.UnprocessedQuantity > 0).Any());
                filtered = SearchTransaction(mode, hashtable, filtered);
              
                switch (sort)
                {
                      case "VoucherNumber":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.VoucherNumber) : filtered.OrderBy(u => u.VoucherNumber);
                        break;
                    case "RequestDate":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.RequestedDate) : filtered.OrderBy(u => u.RequestedDate);
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
                    Requester = item.coreUser2.FirstName + " " + item.coreUser2.LastName,
                    Consumer = item.ConsumerEmployeeId.HasValue ? item.coreUser.FirstName + " " + item.coreUser.LastName : item.ConsumerStoreId.HasValue ? item.psmsStore1.Name : item.ConsumerUnitId.HasValue ? item.coreUnit.Name : "",
                    ConsumerType = item.lupConsumerType.Name,
                    item.RequestedDate,
                    item.RequiredDate,
                    item.VoucherNumber,
                    item.StatusId,
                    Status = item.lupVoucherStatus.Name,
                }).ToList().Select(item => new
                {
                    item.Id,
                    item.Consumer,
                    item.ConsumerType,
                    Requester = item.Requester,
                    RequestDate =item.RequestedDate.ToShortDateString(),
                    RequiredDate =item.RequiredDate.ToShortDateString(),
                    item.VoucherNumber,
                     item.StatusId,
                    Status = item.Status,
                });
                return this.Direct(new { total = count, data = purchaserequestHeaders });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }
        public DirectResult GetAllDetails(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                Guid voucherHeaderId;
                Guid.TryParse(hashtable["voucherHeaderId"].ToString(), out voucherHeaderId);

                var filtered =_storeRequisitionDetail.GetAll().AsQueryable().Where(d => d.StoreRequisitionHeaderId == voucherHeaderId).OrderBy(o=>o.CreatedAt);
                var count = filtered.Count();
                var voucherDetails = filtered.Select(item => new
                {
                    item.Id,
                    item.StoreRequisitionHeaderId,
                    Name = item.ItemId != null ? item.psmsItem.Name : item.Description,
                    PartNumber = item.ItemId != null ? item.psmsItem.PartNumber : "",
                  
                    item.ItemId,
                    Code = item.ItemId != null ? item.psmsItem.Code : "",
                    item.StatusId,
                    Status = item.lupVoucherStatus.Name,
                    item.UnitId,
                    MeasurementUnit = item.UnitId != null ? item.lupMeasurementUnit.Name: item.psmsItem.lupMeasurementUnit.Name,
                    item.ApprovedQuantity,
                    item.UnprocessedQuantity,
                    item.TechnicalSpecification,
                   }).ToList();
                var result = new { total = count, data = voucherDetails };
                return this.Direct(result);
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }
        public DirectResult GetAllRequestOrderDetails(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                Guid requestOrderHeaderId=Guid.Empty;
                  var action = "";
                 if (hashtable["requestOrderHeaderId"] != null)
                    Guid.TryParse(hashtable["requestOrderHeaderId"].ToString(), out requestOrderHeaderId);
                if (hashtable["action"] != null)
                    action= hashtable["action"].ToString();;
       
                  var filtered = _requestOrderDetail.GetAll().AsQueryable().Where(d => d.RequestOrderHeaderId == requestOrderHeaderId).OrderBy(o => o.CreatedAt);
                  var count = filtered.Count();
                  var voucherDetails = filtered.Select(item => new
                  {
                      item.Id,
                      item.RequestOrderHeaderId,
                      Name = item.ItemId != null ? item.psmsItem.Name : item.Description,
                      PartNumber = item.ItemId != null ? item.psmsItem.PartNumber : "",
                
                      item.ItemId,
                      Code = item.ItemId != null ? item.psmsItem.Code : "",
                      item.StatusId,
                      Status = item.lupVoucherStatus.Name,
                      item.UnitId,
                      MeasurementUnit = item.UnitId != null ? item.lupMeasurementUnit.Name : item.psmsItem.lupMeasurementUnit.Name,
                      item.Quantity,
                      UnprocessedQuantity = action == "orderAtReceive" ? item.Quantity : item.psmsRequestOrderHeader.psmsStoreRequisitionHeader.psmsStoreRequisitionDetail.Where(o => o.ItemId == item.ItemId).Sum(f => f.UnprocessedQuantity),
                      RemainingQuantity = item.RemainingQuantity,
                  }).ToList();
                  var result = new { total = count, data = voucherDetails };
                  return this.Direct(result);
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }
        public DirectResult VoidRequisition(Guid id)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var objHeader =_storeRequisitionHeader.Get(o => o.Id == id);

                    objHeader.StatusId = rejectedVoucherStatus;
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
        public ActionResult SaveRequestOrder(psmsRequestOrderHeader requestOrder)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;

                try
                {
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var requestOrderDetailsString = hashtable["requestOrderDetails"].ToString();
                    var storeRequestTypeId = Guid.Empty;
                    var fromStoreId = Guid.Empty;
                    Guid.TryParse(Request.Params["StoreRequestTypeId"], out storeRequestTypeId);
                    Guid.TryParse(Request.Params["FromStoreId"], out fromStoreId);
                      
                    if (requestOrder.Id==Guid.Empty)
                    {
                        
                        requestOrder.Id = Guid.NewGuid();
                        requestOrder.CreatedAt = DateTime.Now;
                        requestOrder.UpdatedAt = DateTime.Now;
                      _requestOrderHeader.AddNew(requestOrder);
                    }
                    else
                    {
                        requestOrder.UpdatedAt = DateTime.Now;                       
                        _requestOrderHeader.Edit(requestOrder);
                    }
                    SaveRequestOrderDetail(requestOrder.Id, requestOrderDetailsString, requestOrder.StoreRequisitionHeaderId, requestOrder.OrderType);                
                    if (requestOrder.OrderType == "Purchase Request")
                    {
                        var orderedBy = Request.Params["OrderedBy"];

                        SavePurchaseRequest(requestOrder, orderedBy);
                    }
                    else if(requestOrder.OrderType=="Store Issue" || requestOrder.OrderType=="Transfer Issue")
                    {
                        UpdateStoreRequisitionHeader(requestOrder.StoreRequisitionHeaderId.Value, fromStoreId, storeRequestTypeId);
                 
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

        #endregion

        #region Methods
        public void SaveRequestOrderDetail(Guid requestOrderHeaderId, string requestOrderDetailsString,Guid? storeRequisitionHeaderId,string orderType)
        {
            requestOrderDetailsString = requestOrderDetailsString.Remove(requestOrderDetailsString.Length - 1);
            IList<string> requestOrderDetails = requestOrderDetailsString.Split(new[] { ';' }).ToList();
            var oldsRequestOrderDetailList =_requestOrderDetail.GetAll().AsQueryable().Where(o => o.RequestOrderHeaderId == requestOrderHeaderId);
            decimal oldQuantity = 0;
            Guid statusId = orderedVoucherStatus;
            for (var i = 0; i < requestOrderDetails.Count(); i++)
            {
                var requestOrderDetail = requestOrderDetails[i].Split(new[] { ':' });
                var requestOrderDetailId = Guid.Empty;
                Guid.TryParse(requestOrderDetail[0].ToString(), out requestOrderDetailId);
                var objRequestOrderDetail = requestOrderDetailId != Guid.Empty ? _requestOrderDetail.Get(o => o.Id == requestOrderDetailId) : new psmsRequestOrderDetail();
                oldQuantity = requestOrderDetailId != Guid.Empty ? objRequestOrderDetail.Quantity : 0;

                objRequestOrderDetail.RequestOrderHeaderId = requestOrderHeaderId;
                var itemId=Guid.Empty;
                objRequestOrderDetail.Description = requestOrderDetail[1];
               
                if(Guid.TryParse(requestOrderDetail[2],out itemId))
                objRequestOrderDetail.ItemId =itemId;
                objRequestOrderDetail.Quantity = decimal.Parse(requestOrderDetail[3]);
                objRequestOrderDetail.RemainingQuantity = decimal.Parse(requestOrderDetail[3]);
                objRequestOrderDetail.UnitId = Guid.Parse(requestOrderDetail[5]);
              
                objRequestOrderDetail.UpdatedAt = DateTime.Now;                
                if (requestOrderDetailId == Guid.Empty)
                {
                    objRequestOrderDetail.Id = Guid.NewGuid();
                    objRequestOrderDetail.CreatedAt = DateTime.Now.AddSeconds(2);
                    objRequestOrderDetail.StatusId = postedVoucherStatus;
                   _requestOrderDetail.AddNew(objRequestOrderDetail);
                }
                if (storeRequisitionHeaderId != null) UpdateStoreRequisitionDetail(storeRequisitionHeaderId.Value, objRequestOrderDetail.ItemId, objRequestOrderDetail.Description, objRequestOrderDetail.Quantity - oldQuantity,orderType);
        
                requestOrderDetailList.Add(objRequestOrderDetail);
            }
            DeleteRequestOrderDetail(requestOrderDetailList, oldsRequestOrderDetailList, storeRequisitionHeaderId, ref statusId,orderType);
        
        }
        private void DeleteRequestOrderDetail(IList<psmsRequestOrderDetail> requestOrderDetailList, IQueryable<psmsRequestOrderDetail> oldsRequestOrderDetailList, Guid? storeRequisitionHeaderId, ref Guid statusId, string orderType)
        {
            foreach (var objoldsRequestOrderDetail in oldsRequestOrderDetailList)
            {
                var record = requestOrderDetailList.Where(o => o.Id == objoldsRequestOrderDetail.Id);

                if (record.Count() == 0)
                {
                    if (storeRequisitionHeaderId != null) UpdateStoreRequisitionDetail(storeRequisitionHeaderId.Value, objoldsRequestOrderDetail.ItemId, objoldsRequestOrderDetail.Description, objoldsRequestOrderDetail.Quantity, orderType);
                  
                    _requestOrderDetail.Delete(o => o.Id == objoldsRequestOrderDetail.Id);
                }
            }
        }
        private void UpdateStoreRequisitionDetail(Guid storeRequisitionHeaderId, Guid? itemId, string itemName, decimal updateQuantity, string orderType)
        {
            var objStoreRequisitionDetail = _storeRequisitionDetail.GetAll().AsQueryable().Where(o => o.StoreRequisitionHeaderId == storeRequisitionHeaderId && ( itemId != null ? o.ItemId == itemId : o.Description == itemName )).FirstOrDefault();
            objStoreRequisitionDetail.UnprocessedQuantity = objStoreRequisitionDetail.UnprocessedQuantity - updateQuantity;
          
        }
        private void UpdateStoreRequisitionHeader(Guid storeRequisitionHeaderId, Guid storeId, Guid? storeRequestTypeId)
        {
            var objStoreRequisitionHeader = _storeRequisitionHeader.GetAll().AsQueryable().Where(o => o.Id == storeRequisitionHeaderId ).FirstOrDefault();

            objStoreRequisitionHeader.StoreId = storeId;
            objStoreRequisitionHeader.StoreRequestTypeId = storeRequestTypeId;
        }  
         public void SavePurchaseRequest(psmsRequestOrderHeader requestOrderHeader,string orderedBy)
        {
            var objStoreRequisition =_storeRequisitionHeader.Get(o => o.Id == requestOrderHeader.StoreRequisitionHeaderId);
            var objPurchaseRequestHeader = new psmsPurchaseRequestHeader();
            objPurchaseRequestHeader.Id = Guid.NewGuid();
            objPurchaseRequestHeader.ConsumerEmployeeId =  objStoreRequisition.ConsumerEmployeeId ;
            objPurchaseRequestHeader.ConsumerStoreId = objStoreRequisition.ConsumerStoreId ;
            objPurchaseRequestHeader.ConsumerUnitId =  objStoreRequisition.ConsumerUnitId ;
            objPurchaseRequestHeader.ConsumerTypeId =  objStoreRequisition.ConsumerTypeId ;
            objPurchaseRequestHeader.FiscalYearId =objStoreRequisition.FiscalYearId;
            objPurchaseRequestHeader.PreparedById = requestOrderHeader.PreparedById;
            objPurchaseRequestHeader.Remark = requestOrderHeader.Remark;
            objPurchaseRequestHeader.RequestedById = requestOrderHeader.PreparedById;
            objPurchaseRequestHeader.RequestedDate = requestOrderHeader.Date;
            objPurchaseRequestHeader.RequestOrderHeaderId = requestOrderHeader.Id;
            objPurchaseRequestHeader.RequestTypeId = Guid.Parse(Request.Params["RequestTypeId"]);
            objPurchaseRequestHeader.RequiredDate = objStoreRequisition.RequiredDate;
            objPurchaseRequestHeader.StatusId = postedVoucherStatus;
            objPurchaseRequestHeader.CreatedAt=DateTime.Now;
            objPurchaseRequestHeader.UpdatedAt = DateTime.Now;
            objPurchaseRequestHeader.StoreId = objStoreRequisition.StoreId.Value ;
            CyberErp.Presentation.Psms.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Psms.Web.MvcApplication;
            httpapplication.Application.Lock();

            objPurchaseRequestHeader.VoucherNumber = _utils.GetVoucherNumber("Purchase Request", objPurchaseRequestHeader.StoreId);
            _purchaseRequestHeader.AddNew(objPurchaseRequestHeader);
            _utils.UpdateVoucherNumber("Purchase Request", objPurchaseRequestHeader.StoreId);
            httpapplication.Application.UnLock();
            AddPurchaseRequestDetail(objPurchaseRequestHeader.Id, objStoreRequisition);
           
        }
        private void AddPurchaseRequestDetail(Guid purchaseRequestHeaderId,psmsStoreRequisitionHeader storeRequisition)
        {
            foreach (var requestOrderDetail in requestOrderDetailList)
            {
                var purchaseRequestDetail = new psmsPurchaseRequestDetail();
                 purchaseRequestDetail.PurchaseRequestHeaderId = purchaseRequestHeaderId;

                purchaseRequestDetail.ItemId = requestOrderDetail.ItemId;
                purchaseRequestDetail.Description = requestOrderDetail.Description;
                purchaseRequestDetail.UnitId =requestOrderDetail.UnitId!=Guid.Empty?requestOrderDetail.UnitId.Value:Guid.Empty;
                purchaseRequestDetail.Quantity = requestOrderDetail.Quantity;
                purchaseRequestDetail.RemainingQuantity = requestOrderDetail.Quantity;
                purchaseRequestDetail.UnprocessedQuantity = requestOrderDetail.Quantity;
                purchaseRequestDetail.UpdatedAt = DateTime.Now;
               
                purchaseRequestDetail.Id = Guid.NewGuid();
                purchaseRequestDetail.CreatedAt = DateTime.Now.AddSeconds(2);
                purchaseRequestDetail.StatusId = postedVoucherStatus;
                purchaseRequestDetail.Remark =storeRequisition.psmsStoreRequisitionDetail.Where(o => o.ItemId == requestOrderDetail.ItemId).FirstOrDefault().TechnicalSpecification ;
                _purchaseRequestDetail.AddNew(purchaseRequestDetail);
            }
      
        }
        private IQueryable<psmsStoreRequisitionHeader> SearchTransaction(string mode, Hashtable ht, IQueryable<psmsStoreRequisitionHeader> filtered)
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
                        filtered = filtered.Where(v => v.psmsStoreRequisitionDetail.Where(f =>
                            (f.ItemId.HasValue ? f.psmsItem.Name.ToUpper().StartsWith(tSearchText.ToUpper()) : f.Description.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            (f.ItemId.HasValue ? f.psmsItem.Code.ToUpper().StartsWith(tSearchText.ToUpper()) : false)).Any() ||
                            (
                            v.ConsumerEmployeeId.HasValue ? (v.coreUser.FirstName + " " + v.coreUser.LastName).ToUpper().StartsWith(tSearchText.ToUpper()) :
                            v.ConsumerStoreId.HasValue ? v.psmsStore1.Name.ToUpper().StartsWith(tSearchText.ToUpper()) :
                            v.ConsumerUnitId.HasValue ? v.coreUnit.Name.ToUpper().StartsWith(tSearchText.ToUpper()) : false
                            ) ||
                            (v.coreUser2.FirstName + " " + v.coreUser2.LastName).ToUpper().StartsWith(tSearchText.ToUpper())

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
                        filtered = filtered.Where(v => v.RequestedDate >= transactionStartDate && v.RequestedDate <= transactionEndDate);
                    }
                    break;
            }
            return filtered;
        }
        private void AddNotification(psmsPurchaseRequestHeader purchaseRequest, psmsStoreRequisitionHeader storeRequest, string orderedBy)
        {
            var Requester = storeRequest.coreUser2.FirstName + " " + storeRequest.coreUser2.LastName;
            var consumer = storeRequest.ConsumerEmployeeId.HasValue ? storeRequest.coreUser.FirstName + " " + storeRequest.coreUser.LastName : storeRequest.ConsumerStoreId.HasValue ? storeRequest.psmsStore1.Name : storeRequest.ConsumerUnitId.HasValue ? storeRequest.coreUnit.Name : "";


            var date = purchaseRequest.RequestedDate.ToShortDateString();
            var title = "Purchase Requisition(" + purchaseRequest.VoucherNumber + ")";
            var message = "A new purchase Requisition has be added with voucher no  " + purchaseRequest.VoucherNumber + "on date " + date + " \n " +
                 " From store Requisition " + storeRequest.VoucherNumber + " Requested By " + Requester + " \n " +
                 " Requested Purpose " + storeRequest.lupRequestPurpose.Name + " \n " +
                 "Consumer " + consumer + " \n " + " \n " +
                 "Order By " + orderedBy + " \n ";

           
            var voucherWorkFlow =_voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId ==purchaseRequestVoucherType);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == purchaseRequest.StatusId).FirstOrDefault();
            if(currentStep!=null)
            {
                var nextStep = voucherWorkFlow.Where(o => o.Step > currentStep.Step).FirstOrDefault();
                if (nextStep != null)
                {
                    var approver = _approver.GetAll().AsQueryable().Where(o => o.VoucherTypeId == purchaseRequestVoucherType && o.StatusId == nextStep.VoucherStatusId && ( (o.StoreId.HasValue ? o.StoreId == purchaseRequest.StoreId : true)));                
                    if (approver.Count() > 0)
                    {
                        string approverIds = "";
                        foreach (var objApprover in approver)
                        {
                            approverIds = approverIds + objApprover.EmployeeId.ToString() + ",";
                        }
                        _notification.SaveNotification(title, message, purchaseRequest.Id, purchaseRequest.VoucherNumber, nextStep.VoucherStatusId, purchaseRequestVoucherType, approverIds, purchaseRequest.StoreId, null, "");
                    }
               

                }

            }
           
        }

        private void UpdateInventory(psmsStoreRequisitionDetail storeRequisitionDetail, double updateQuantity)
        {
            var model = new ParameterModel { ItemId = storeRequisitionDetail.ItemId.Value, StoreId = storeRequisitionDetail.psmsStoreRequisitionHeader.StoreId.Value, FiscalYearId = storeRequisitionDetail.psmsStoreRequisitionHeader.FiscalYearId, Quantity =(double) storeRequisitionDetail.ApprovedQuantity.Value };

            _inventoryRecord.CommiteInventoryUpdate(model, updateQuantity);
        }
        private void UpdateInventoryFromVoidedT(psmsStoreRequisitionDetail storeRequisitionDetail,double updateQuantity)
        {
            var model = new ParameterModel { ItemId = storeRequisitionDetail.ItemId.Value, StoreId = storeRequisitionDetail.psmsStoreRequisitionHeader.StoreId.Value, FiscalYearId = storeRequisitionDetail.psmsStoreRequisitionHeader.FiscalYearId, Quantity = (double)storeRequisitionDetail.ApprovedQuantity.Value };

            _inventoryRecord.CommiteInventoryUpdateForVoidT(model,updateQuantity);
        } 

        #endregion
    }
}
