using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CyberErp.Business.Component;
using System.Data.Objects;
using CyberErp.Data.Model;
using System.Collections;
using CyberErp.Business.Component.Psms;
using Newtonsoft.Json;
using CyberErp.Presentation.Psms.Web.Classes;
using Ext.Direct.Mvc;
using System.Data.Entity;
using System.Transactions;

namespace CyberErp.Presentation.Web.Psms.Controllers
{
    public class StoreRequestController : Controller
    {
        #region Members
        private readonly DbContext _context;
        private readonly Store _store;
        private readonly Lookups _lookup;
        private readonly Item _item;
        private readonly BaseModel<psmsStoreRequisitionHeader> _storeRequestHeader;
        private readonly BaseModel<psmsStoreRequisitionDetail> _storeRequestDetail;
        private readonly BaseModel<coreVoucherWorkFlow> _voucherorkFlow;
        private readonly BaseModel<psmsVoucherStatusTransaction> _voucherStatusTransaction;
        private readonly Notification _notification;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        private readonly BaseModel<coreUser> _user;
        private readonly BaseModel<psmsApprover> _approver;
        private Utility _utils;

        Guid postedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Posted);
        Guid rejectedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Rejected);
        Guid voidVoucherStatus = Guid.Parse(Constants.Voucher_Status_Void);
        Guid StoreRequistionVoucherType = Guid.Parse(Constants.Voucher_Type_StoreRequisition);
      

        #endregion

        #region Constructor

        public StoreRequestController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _store = new Store(_context);
            _lookup = new Lookups(_context);
            _item = new Item(_context);
            _storeRequestHeader = new BaseModel<psmsStoreRequisitionHeader>(_context);
            _storeRequestDetail = new BaseModel<psmsStoreRequisitionDetail>(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);
             _notification = new Notification(_context);
             _voucherorkFlow = new BaseModel<coreVoucherWorkFlow>(_context);
             _voucherStatusTransaction = new BaseModel<psmsVoucherStatusTransaction>(_context);
             _user = new BaseModel<coreUser>(_context);
             _approver = new BaseModel<psmsApprover>(_context);
             _utils = new Utility();

         }


        #endregion

        #region Actions

        public DirectResult GetDocumentNo()
        {
            var objUser = (coreUser)Session[Constants.CurrentUser];

             var employeeId = (Guid)objUser.Id;
            var employeeName = objUser.FirstName + " " + objUser.LastName;
            var userId = objUser.Id;
            var fiscalYearId = _fiscalYear.GetAll().AsQueryable().Where(o => o.IsActive == true && o.IsClosed == false).FirstOrDefault().Id;
            var Constantsfields = new
            {
                User = employeeName,
                RequestedById = employeeId,
                DocNo = "Draft",
                UserId = employeeId,
                StatusId = postedVoucherStatus,
                Status = _lookup.GetAll(Lookups.VoucherStatus).Where(o => o.Id == postedVoucherStatus).FirstOrDefault().Name,
                FiscalYearId = fiscalYearId
            };
            var result = new
            {
                data = Constantsfields
            };
            return this.Direct(result);
        }
  
        public ActionResult Get(Guid id)
        {
            var objGoodsRequest = _storeRequestHeader.Get(a=>a.Id==id);
            var purchaseRequest = new
            {
                objGoodsRequest.Id,
                objGoodsRequest.RequestedById,
                objGoodsRequest.ConsumerTypeId,
                objGoodsRequest.FiscalYearId,
                objGoodsRequest.StoreRequestTypeId,
                ConsumerType=objGoodsRequest.lupConsumerType.Name,
                Purpose=objGoodsRequest.lupRequestPurpose.Name,
                objGoodsRequest.StoreId,
                Store=objGoodsRequest.psmsStore.Name,
                ConsumerEmployee = objGoodsRequest.ConsumerEmployeeId != null ? objGoodsRequest.coreUser.FirstName + " " + objGoodsRequest.coreUser.LastName : "",
                ConsumerStore = objGoodsRequest.ConsumerStoreId != null ? objGoodsRequest.psmsStore1.Name : "",
                ConsumerUnit = objGoodsRequest.ConsumerUnitId != null ? objGoodsRequest.coreUnit.Name : "",
                RequestedDate=objGoodsRequest.RequestedDate,
                RequiredDate=objGoodsRequest.RequiredDate,
                objGoodsRequest.ConsumerEmployeeId,
                objGoodsRequest.ConsumerStoreId,
                objGoodsRequest.ConsumerUnitId,
                Requester = objGoodsRequest.coreUser1.FirstName + " " + objGoodsRequest.coreUser1.LastName,
                objGoodsRequest.ProductionPlanId,
                objGoodsRequest.ProductionOrderId,
                ProductionOrder=objGoodsRequest.ProductionOrderId.HasValue?objGoodsRequest.PRProductionOrderHeader.VoucherNumber:"",
                ProductionPlan = objGoodsRequest.ProductionPlanId.HasValue ? objGoodsRequest.PRProductionPlanHeader.VoucherNumber : "",
                objGoodsRequest.PurposeId,
                objGoodsRequest.VoucherNumber,
                objGoodsRequest.StatusId,
                objGoodsRequest.ReferenceNo,
                objGoodsRequest.Remarks,
                Status = objGoodsRequest.lupVoucherStatus.Name,                      
                objGoodsRequest.CreatedAt
             

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
                var objUser = (coreUser)Session[Constants.CurrentUser];
                var employeeId = (Guid)objUser.Id;

                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
                var filtered = _storeRequestHeader.GetAll().AsQueryable().Where(e => e.RequestedById == employeeId);
               
                filtered = searchText != "" ? filtered.Where(p => 
                            (p.coreUser1.FirstName +" "+p.coreUser1.LastName).ToUpper().Contains(searchText.ToUpper())||
                            p.VoucherNumber.ToUpper().Contains(searchText.ToUpper())||
                            p.psmsStore.Name.ToUpper().Contains(searchText.ToUpper())
                ) : filtered;

                var count = filtered.Count();
                filtered = filtered.OrderByDescending(o => o.CreatedAt).Skip(start).Take(limit);
                var purchaserequestHeaders = filtered.Select(item => new
                {
                    item.Id,
                    Requester = item.coreUser1.FirstName + " " + item.coreUser1.LastName,
                    Consumer = item.ConsumerEmployeeId.HasValue ? item.coreUser.FirstName + " " + item.coreUser.LastName : item.ConsumerStoreId.HasValue ? item.psmsStore1.Name : item.ConsumerUnitId.HasValue ? item.coreUnit.Name : "",
                    ConsumerType = item.lupConsumerType.Name,
                
                    item.RequestedDate,
                    item.RequiredDate,
                    RequestPurpose = item.lupRequestPurpose.Name,
                    item.VoucherNumber,                  
                    Status = item.lupVoucherStatus.Name,
                    item.StatusId
                }).ToList().Select(item => new
                {
                    item.Id,
                    Requester = item.Requester,
                    item.Consumer,
                    item.ConsumerType,               
                    Date = string.Format("{0:MMMM dd, yyyy}", item.RequestedDate),
                    RequiredDate = string.Format("{0:MMMM dd, yyyy}", item.RequiredDate),
                    item.RequestPurpose,
                    item.VoucherNumber,
                    item.Status,
                    item.StatusId
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
                Guid storeRequisitionHeaderId;
                Guid.TryParse(hashtable["storeRequisitionHeaderId"].ToString(), out storeRequisitionHeaderId);

                var filtered = _storeRequestDetail.GetAll().AsQueryable().Where(d => d.StoreRequisitionHeaderId == storeRequisitionHeaderId).OrderBy(o=>o.CreatedAt);

                var fiscalYearId = _fiscalYear.GetAll().Where(o => o.IsActive == true && o.IsClosed == false).First().Id;
                var count = filtered.Count();
                var voucherDetails = filtered.Select(item => new
                {
                    item.Id,
                    item.ItemId,
                    ItemName =item.ItemId.HasValue? item.psmsItem.Name:item.Description,
                    UnitId =  item.UnitId,
                 
                    Code =item.ItemId!=null? item.psmsItem.Code:"",
                    Unit =item.UnitId!=null?item.lupMeasurementUnit.Name: item.psmsItem.lupMeasurementUnit.Name,
                    Weight = item.ItemId != null ? item.psmsItem.Weight :0,
                 
                    item.StatusId,
                    item.Quantity,
                    item.ApprovedQuantity,
                    item.CertifiedQuantity,
                    item.RemainingQuantity,
                    item.UnprocessedQuantity,
                    TechnicalSpecification = item.TechnicalSpecification == null || item.TechnicalSpecification == "undefined" ? "" : item.TechnicalSpecification,
                    AvailableQuantity = item.ItemId.HasValue ? item.psmsItem.psmsInventoryRecord.Where(o =>( o.StoreId == item.psmsStoreRequisitionHeader.StoreId || o.psmsStore.ParentId == item.psmsStoreRequisitionHeader.StoreId) && o.FiscalYearId == fiscalYearId).Select(f => f.AvailableQuantity).DefaultIfEmpty(0).Sum() : 0,
            
                }).ToList().Select(item => new
                {
                    item.Id,
                    item.ItemId,
                    item.UnitId,
                    item.ItemName,
                    item.Weight,
                    TotalWeight=item.Quantity*item.Weight,
                    item.Code,
                    Item =item.Code,
                    Unit = item.Unit,
                    item.StatusId,
                    item.Quantity,
                    item.ApprovedQuantity,
                    item.CertifiedQuantity,
                    item.RemainingQuantity,
                    item.UnprocessedQuantity,
                    item.AvailableQuantity,
                  
                    TechnicalSpecification = item.TechnicalSpecification != "" ? item.TechnicalSpecification : "",
                });
                var result = new { total = count, data = voucherDetails };
                return this.Direct(result);
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }
         public DirectResult Delete(Guid id)
        {
            _storeRequestDetail.Delete(a=>a.StoreRequisitionHeaderId==id);
            _storeRequestHeader.Delete(a=>a.Id==id);
            return this.Direct(new { success = true, data = "Sucessfully deleted" });
        }

        [FormHandler]
        public DirectResult Save(psmsStoreRequisitionHeader storeRequest)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var detailsString = hashtable["storeRequisitionDetails"].ToString();
                    var action = hashtable["action"].ToString();
      
                    if (storeRequest.Id == Guid.Empty)
                    {
                       storeRequest.Id = Guid.NewGuid();
                       var storeId = storeRequest.ConsumerStoreId != null ? storeRequest.ConsumerStoreId.Value : storeRequest.StoreId.Value;
                        storeRequest.CreatedAt = DateTime.Now;
                        storeRequest.UpdatedAt = DateTime.Now;
                   
                        CyberErp.Presentation.Psms.Web.MvcApplication httpapplication =
                            HttpContext.ApplicationInstance as CyberErp.Presentation.Psms.Web.MvcApplication;

                        httpapplication.Application.Lock();

                        storeRequest.VoucherNumber = _utils.GetVoucherNumber("Store Requisition", storeId);
                        _storeRequestHeader.AddNew(storeRequest);
                        _utils.UpdateVoucherNumber("Store Requisition", storeId);
                        httpapplication.Application.UnLock();
                        AddNotification(storeRequest);

                     }
                    else
                    {
                        storeRequest.UpdatedAt = DateTime.Now;
                        if (action == "revise")
                        {
                          _notification.VoidAllNotification(StoreRequistionVoucherType, storeRequest.Id);
                            storeRequest.StatusId =postedVoucherStatus;
                            AddNotification(storeRequest);
                        }
                        _storeRequestHeader.Edit(storeRequest);
                    }                
                    SaveDetail(storeRequest.Id, detailsString);
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Direct(new { success = true, 
                        data = "Goods Request has been added Successfully!",
                        HeaderId = storeRequest.Id
                    });
                }
                catch (Exception exception)
                {
                    return this.Direct(new { success = false, data = exception.InnerException != null ? exception.InnerException.Message : exception.Message });
                }
            }

        }
     #endregion

        #region Methods
        private void AddNotification(psmsStoreRequisitionHeader storeRequest)
        {
            var objUser= _user.Get(a=>a.Id==storeRequest.RequestedById);
            var Requester = objUser.FirstName + " " + objUser.LastName;
            var storeId = storeRequest.ConsumerStoreId != null ? storeRequest.ConsumerStoreId.Value : storeRequest.StoreId.Value;
                   
            var consumer ="";
            if (storeRequest.ConsumerEmployeeId.HasValue)
            {
                var  objConsumer = _user.Get(a=>a.Id==storeRequest.ConsumerEmployeeId.Value);
                consumer = objConsumer.FirstName + " " + objConsumer.LastName;         
            }
            else if (storeRequest.ConsumerStoreId.HasValue)
            {
                consumer=_store.Get(a=>a.Id==storeRequest.ConsumerStoreId.Value).Name;
            }        
            var date = storeRequest.RequestedDate.ToShortDateString();
            var title = "Store Requisition(" + storeRequest.VoucherNumber + ")";
            var message = "A new Store Requisition has be added   " + storeRequest.VoucherNumber + " on date " + date + " \n " +
                " Requested By " + Requester + " \n " +
                " Reference " + storeRequest.ReferenceNo + " \n " +
                "Consumer " + consumer + " \n ";
            var voucherWorkFlow = _voucherorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId ==StoreRequistionVoucherType);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == storeRequest.StatusId).FirstOrDefault();
            if(currentStep==null)
                throw new System.InvalidOperationException("setting error,Please maintain workflow for the store requistion voucher!");
        
            var nextStep = voucherWorkFlow.Where(o => o.Step == currentStep.Step+1).FirstOrDefault();
            if (nextStep!=null)
            {
                var approver = _approver.GetAll().AsQueryable().Where(o => o.VoucherTypeId == StoreRequistionVoucherType&& o.StatusId == nextStep.VoucherStatusId && (  (o.StoreId.HasValue ? o.StoreId == storeId : true)));
                if (approver.Count() > 0)
                {
                    string approverIds = "";
                    foreach (var objApprover in approver)
                    {
                        approverIds = approverIds + objApprover.EmployeeId.ToString() + ",";
                    }
                 _notification.SaveNotification(title, message, storeRequest.Id, storeRequest.VoucherNumber, nextStep.VoucherStatusId,StoreRequistionVoucherType, approverIds, storeId, Guid.Empty,"");

                }
            }
         }
        private void SaveDetail(Guid storeRequisitionHeaderId, string storeRequisitionDetailString)
        {

                IList<string> storeRequisitionDetails = storeRequisitionDetailString.Remove(storeRequisitionDetailString.Length - 1).Split(new[] { ';' }).ToList();
                IList<psmsStoreRequisitionDetail> storeRequisitionDetailList = new List<psmsStoreRequisitionDetail>();
                var oldStoreRequisitionDetailList = _storeRequestDetail.GetAll().AsQueryable().Where(o => o.StoreRequisitionHeaderId == storeRequisitionHeaderId);
                var date = DateTime.Now;
                for (var i = 0; i < storeRequisitionDetails.Count(); i++)
                {
                    var storeRequisitionDetail = storeRequisitionDetails[i].Split(new[] { ':' });
                    Guid storeRequisitionDetailId = Guid.Empty;
                    Guid.TryParse(storeRequisitionDetail[0].ToString(), out storeRequisitionDetailId);

                    var objStoreRequisitionDetail = storeRequisitionDetailId != Guid.Empty ? _storeRequestDetail.Get(a=>a.Id==storeRequisitionDetailId) : new psmsStoreRequisitionDetail();

                    objStoreRequisitionDetail.StoreRequisitionHeaderId = storeRequisitionHeaderId;
                    objStoreRequisitionDetail.Quantity = decimal.Parse(storeRequisitionDetail[2]);
                    objStoreRequisitionDetail.Description=storeRequisitionDetail[1];
                    objStoreRequisitionDetail.ApprovedQuantity = decimal.Parse(storeRequisitionDetail[2]);
                    objStoreRequisitionDetail.UnprocessedQuantity = decimal.Parse(storeRequisitionDetail[2]);
                    var itemId = Guid.Empty;
                    if (Guid.TryParse( storeRequisitionDetail[4] ,out itemId))
                        objStoreRequisitionDetail.ItemId = itemId;
                    objStoreRequisitionDetail.StatusId =postedVoucherStatus;
                    objStoreRequisitionDetail.UnitId = Guid.Parse(storeRequisitionDetail[6]);
                    objStoreRequisitionDetail.TechnicalSpecification =storeRequisitionDetail[7];
                    objStoreRequisitionDetail.UpdatedAt = DateTime.Now; ;

                    if (storeRequisitionDetailId == Guid.Empty)
                    {
                        objStoreRequisitionDetail.Id = Guid.NewGuid();
                        date = date.AddSeconds(2);

                        objStoreRequisitionDetail.CreatedAt = date;
                        _storeRequestDetail.AddNew(objStoreRequisitionDetail);
                    }
                    storeRequisitionDetailList.Add(objStoreRequisitionDetail);
                }
                DeleteStoreRequistionDetail(oldStoreRequisitionDetailList, storeRequisitionDetailList);
                 

        }
  
        public void DeleteStoreRequistionDetail(
            IQueryable<psmsStoreRequisitionDetail> oldStoreRequisitionDetailList, 
                IList<psmsStoreRequisitionDetail> storeRequisitionDetailList)
        {
            foreach (var objoldsItem in oldStoreRequisitionDetailList)
            {
                var record = storeRequisitionDetailList.Where(o => o.Id == objoldsItem.Id);

                if (record.Count() == 0)
                {
                  _storeRequestDetail.Delete(a=>a.Id== objoldsItem.Id);
                }
            }
        }
       
        #endregion
    }
}
