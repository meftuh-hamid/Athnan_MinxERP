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
    public class PurchaseOrderController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsPurchaseOrderHeader> _purchaseOrderHeader;
        private readonly BaseModel<psmsPurchaseOrderDetail> _purchaseOrderDetail;
        private readonly BaseModel<psmsItem> _item;
        private readonly BaseModel<psmsStore> _store;
        private readonly InventoryRecord _inventoryRecord;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        private readonly BaseModel<coreUnit> _unit;
        private readonly BaseModel<coreUser> _user;
        private readonly BaseModel<psmsApprover> _approver;
        
        private readonly BaseModel<psmsStorePermission> _storePermission;
        private readonly BaseModel<psmsTaxRate> _taxRate;
        private readonly BaseModel<psmsPurchaseRequestDetail> _purchaseRequestDetail;
        private readonly BaseModel<coreVoucherWorkFlow> _voucherWorkFlow;
        private readonly Notification _notification;
        private readonly BaseModel<psmsSetting> _setting;
        private readonly BaseModel<psmsSupplier> _supplier;
        private readonly BaseModel<slmsSalesDetail> _salesDetail;
        private readonly BaseModel<psmsPurchaseOrderATCDetail> _purchaseOrderATCDetail;
  
        private Utility _utils;
        Guid postedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Posted);
        Guid certifiedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Certified);
        Guid approvedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Approved);
        Guid partiallyVoucherStatus = Guid.Parse(Constants.Voucher_Status_Partially_Approved);
        Guid rejectedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Rejected);
        Guid voidVoucherStatus = Guid.Parse(Constants.Voucher_Status_Void);
        Guid PurchaseOrderVoucherType = Guid.Parse(Constants.Voucher_Type_PurchaseOrder);
        Guid finalApprovedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Final_Approved);
      
        private readonly Lookups _lookup;
        private Guid employeeId = Guid.Empty;
        private string employeeName = "";
       
        #endregion

        #region Constructor

        public PurchaseOrderController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _purchaseOrderHeader = new BaseModel<psmsPurchaseOrderHeader>(_context);
            _purchaseOrderDetail = new BaseModel<psmsPurchaseOrderDetail>(_context);
            _item = new BaseModel<psmsItem>(_context);
            _store = new BaseModel<psmsStore>(_context);
            _inventoryRecord = new InventoryRecord(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);
            _unit = new BaseModel<coreUnit>(_context);
            _approver = new BaseModel<psmsApprover>(_context);           
            _storePermission = new BaseModel<psmsStorePermission>(_context);
            _utils = new Utility();
            _lookup = new Lookups(_context);
            _taxRate = new BaseModel<psmsTaxRate>(_context);
            _purchaseRequestDetail = new BaseModel<psmsPurchaseRequestDetail>(_context);
            _voucherWorkFlow = new BaseModel<coreVoucherWorkFlow>(_context);
            _notification = new Notification(_context);
            _setting = new BaseModel<psmsSetting>(_context);
            _user = new BaseModel<coreUser>(_context);
            _supplier = new BaseModel<psmsSupplier>(_context);
            _salesDetail = new BaseModel<slmsSalesDetail>(_context);
            _purchaseOrderATCDetail = new BaseModel<psmsPurchaseOrderATCDetail>(_context);
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
            var employee = _user.Get(o => o.Id == employeeId);
            var address = "";
          
            var Constantsfields = new
            {
                Employee = objUser.FirstName + " " + objUser.LastName,
                EmployeeId = employeeId,
                DocNo = "Draft",
                StatusId = postedVoucherStatus,
                Status = _lookup.GetAll(Lookups.VoucherStatus).Where(o => o.Id == postedVoucherStatus).FirstOrDefault().Name,
                FiscalYearId = _fiscalYear.GetAll().Where(o => o.IsActive == true && o.IsClosed == false).FirstOrDefault().Id,
                Address = address
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

            var objPurchaseOrder = _purchaseOrderHeader.Get(o => o.Id == id);
            var purchaseOrder = new
            {
                objPurchaseOrder.Id,
                objPurchaseOrder.VoucherNumber,
                
                objPurchaseOrder.FiscalYearId,
                objPurchaseOrder.SupplierId,
                objPurchaseOrder.Version,
                objPurchaseOrder.PurchaseRequestHeaderId,
                PurchaseRequestNo=objPurchaseOrder.PurchaseRequestHeaderId.HasValue?objPurchaseOrder.psmsPurchaseRequestHeader.VoucherNumber:"",
                Supplier=objPurchaseOrder.psmsSupplier.Name,
                objPurchaseOrder.SupplierReferenceNo,
                objPurchaseOrder.TaxRateIds,
                objPurchaseOrder.TaxRateDescription ,              
                objPurchaseOrder.TotalSummarry,
                objPurchaseOrder.SalesType,
                OrderedDate = objPurchaseOrder.OrderedDate.ToShortDateString(),
                PurchaseModalityData=objPurchaseOrder.psmsSupplier.PurchaseModality,
                objPurchaseOrder.OrderTypeId,
                OrderType = objPurchaseOrder.lupPurchaseOrderType.Name,
                objPurchaseOrder.PreparedById,
                 objPurchaseOrder.OrderedById,
                FiscalYear = objPurchaseOrder.coreFiscalYear.Name,
                OrderedBy =  objPurchaseOrder.coreUser1.FirstName + " " + objPurchaseOrder.coreUser1.LastName,
                objPurchaseOrder.StatusId,
                objPurchaseOrder.Discount,
                objPurchaseOrder.StoreId,
                Store = objPurchaseOrder.psmsStore.Name,
                TaxRate=getTaxRate(objPurchaseOrder.TaxRateIds),
                objPurchaseOrder.Remark,
                objPurchaseOrder.CreatedAt

            };
           
            return this.Direct(new
            {
                success = true,
                data = purchaseOrder,
             });
        }
         public DirectResult GetAllHeader(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
                var mode = hashtable["mode"] != null ? hashtable["mode"].ToString() : "";
                Guid userId = Guid.Empty;
                var objUser = (coreUser)Session[Constants.CurrentUser];
                if (objUser != null && objUser.Id != null)
                {
                    employeeId = (Guid)objUser.Id;
                    userId = (Guid)objUser.Id;
                }
               
              
                var LastWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == PurchaseOrderVoucherType).OrderByDescending(o => o.Step);              
                var lastVoucherId = LastWorkFlow.Count()>0 ? LastWorkFlow.FirstOrDefault().VoucherStatusId : Guid.Empty;
                var step = LastWorkFlow.Count()>0 ? LastWorkFlow.FirstOrDefault().Step : 0;
                var secondLastVoucherId = LastWorkFlow.Count() > 1 ? LastWorkFlow.Where(o => o.Step ==step-1).FirstOrDefault().VoucherStatusId : Guid.Empty;

                var filtered = _purchaseOrderHeader.GetAll().AsQueryable().Where(x => (x.psmsStore.psmsStorePermission.Any() ? x.psmsStore.psmsStorePermission.Where(f => f.UserId == userId).Any() : true));
              
                filtered = SearchTransaction(mode, hashtable, filtered);
                if (mode != "search")
                    filtered = filtered.Where(o => o.StatusId != voidVoucherStatus);
        
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
                    case "PurchaseRequestNo":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.PurchaseRequestHeaderId.HasValue ? u.psmsPurchaseRequestHeader.VoucherNumber : "") : filtered.OrderBy(u => u.PurchaseRequestHeaderId.HasValue ? u.psmsPurchaseRequestHeader.VoucherNumber : "");
                        break;
                    case "OrderedDate":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.OrderedDate) : filtered.OrderBy(u => u.OrderedDate);
                        break;
                    case "SalesType":
                        filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.SalesType) : filtered.OrderBy(u => u.SalesType);
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
                    VoucherNumber=item.VoucherNumber+" "+(item.Version==null?"":item.Version),
                 
                    OrderType = item.lupPurchaseOrderType.Name,
                    FiscalYear = item.coreFiscalYear.Name,
                    item.OrderedDate,
                    Supplier = item.psmsSupplier.Name,
                    item.SupplierReferenceNo,
                    PurchaseRequestNo = item.PurchaseRequestHeaderId.HasValue ? item.psmsPurchaseRequestHeader.VoucherNumber : "",                
                    OrderedBy = item.coreUser1.FirstName + " " + item.coreUser1.LastName,
                    IsLastStep = lastVoucherId != Guid.Empty? item.StatusId==lastVoucherId:true,
                    item.StatusId,
                    item.SalesType,
                    item.StoreId,
                    Store = item.psmsStore.Name,
                    Status=item.lupVoucherStatus.Name,
                    item.Remark,
   
                }).ToList().Select(item => new
                {
                    item.Id,
                    item.VoucherNumber,
                    item.Supplier,
                    item.SalesType,
                    item.PurchaseRequestNo,
                    item.SupplierReferenceNo,
                    OrderType = item.OrderType,
                    FiscalYear = item.FiscalYear,
                    OrderedDate=item.OrderedDate.ToShortDateString(),                   
                    OrderedBy = item.OrderedBy,
                    item.IsLastStep,
                    item.StatusId,
                    item.StoreId,
                    Store = item.Store,
                    item.Status,
                    item.Remark,
                });
                return this.Direct(new { total = count, data = purchaseOrderHeaders });
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
                Guid voucherHeaderId, supplierId = Guid.Empty; Guid reorderSheetHeaderId = Guid.Empty;
                string action = "";
                Guid.TryParse(hashtable["voucherHeaderId"].ToString(), out voucherHeaderId);
                if (hashtable["supplierId"]!=null)
                    Guid.TryParse(hashtable["supplierId"].ToString(), out supplierId);
                if (hashtable["orderType"] != null)
                    Guid.TryParse(hashtable["orderType"].ToString(), out supplierId);
               
                action = hashtable["action"].ToString();

                action = hashtable["action"].ToString();
               
                if (action == "purchaseRequest")
                {
                    var records = GetPurchaseRequestDetail(voucherHeaderId, supplierId);
                    var result = new { total = records.Count, data = records };
                    return this.Direct(result);
                }
                else
                {
                    var filtered = _purchaseOrderDetail.GetAll().AsQueryable().Where(d => d.PurchaseOrderHeaderId == voucherHeaderId).OrderBy(o => o.CreatedAt);
                    var count = filtered.Count();
                    var records = filtered.ToList().Select(item => new
                    {
                        item.Id,
                        item.PurchaseOrderHeaderId,
                        item.ItemId,
                        Name = item.ItemId.HasValue ? item.psmsItem.Name : item.Description,
                        Code = item.ItemId != null ? item.psmsItem.Code : "",
                        item.UnitId,
                        MeasurementUnit =item.UnitId!=null? item.lupMeasurementUnit.Name:"",
                        item.Quantity,
                        item.UnitCost,
                        item.Tax,
                        TaxRateIds = item.ItemId.HasValue ? item.psmsItem.TaxRateIds : "",
                        item.psmsItem.Weight,
                        TaxRateDescription=item.ItemId.HasValue ? item.psmsItem.TaxRateDescription:"",
                        TaxRate =item.ItemId.HasValue ? getTaxRate(item.psmsItem.TaxRateIds):"",                       
                        item.RemainingQuantity,
                        item.StatusId,
                        Status = item.lupVoucherStatus.Name,
                        item.InvoiceNo,
                        item.ATCFrom,
                        item.ATCTo,
                        item.NoofATC,
                        item.TruckSize,
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
                    var objHeader = _purchaseOrderHeader.Get(o => o.Id == id);
                    var sourceVoucherTypeId = objHeader.PurchaseRequestHeaderId.HasValue ?Constants.Voucher_Type_PurchaseRequest: "0";
                    var sourceHeaderId = objHeader.PurchaseRequestHeaderId.HasValue ? objHeader.PurchaseRequestHeaderId.Value : Guid.Empty;
                    var lastorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == PurchaseOrderVoucherType).OrderByDescending(o => o.Step).FirstOrDefault();

                    foreach (var objPurchaseOrderDetail in objHeader.psmsPurchaseOrderDetail)
                        {
                            if (sourceVoucherTypeId != "0")
                                UpdateSourceDetail(Guid.Parse(sourceVoucherTypeId), sourceHeaderId, objPurchaseOrderDetail.ItemId, objPurchaseOrderDetail.Description, -objPurchaseOrderDetail.Quantity);
                       if(objHeader.StatusId==finalApprovedVoucherStatus)
                        UpdateInventoryFromVoidedT(objPurchaseOrderDetail);
                 
                            objPurchaseOrderDetail.StatusId = voidVoucherStatus;
                         }                     
                    objHeader.StatusId = voidVoucherStatus;
                    _notification.VoidNotification(PurchaseOrderVoucherType, objHeader.Id);
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

        public DirectResult Check(Guid id)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var objHeader = _purchaseOrderHeader.Get(o => o.Id == id);
                    _notification.VoidAllNotification(PurchaseOrderVoucherType,id);                  
                    UpdateStatus(objHeader, "");
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
        public ActionResult Save(psmsPurchaseOrderHeader PurchaseOrderHeader)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var OrderOrderDetailsString = hashtable["purchaseOrderDetails"].ToString();
                    var param = hashtable["otherParam"] != null ? hashtable["otherParam"].ToString() : "";
                   
                    var action = hashtable["action"].ToString();
                    if (action == "accept")
                        PurchaseOrderHeader.StatusId = finalApprovedVoucherStatus;
                    if (PurchaseOrderHeader.Id == Guid.Empty)
                    {
                        PurchaseOrderHeader.Id = Guid.NewGuid();
                        PurchaseOrderHeader.CreatedAt = DateTime.Now;
                        PurchaseOrderHeader.UpdatedAt = DateTime.Now;
                        if (action == "revision")
                        PurchaseOrderHeader.StatusId = postedVoucherStatus;
                        var voucherNo = PurchaseOrderHeader.VoucherNumber;
                        CyberErp.Presentation.Psms.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Psms.Web.MvcApplication;
                        httpapplication.Application.Lock();
                        if (action != "revision" && voucherNo == "Draft")                  
                        PurchaseOrderHeader.VoucherNumber = _utils.GetVoucherNumberBySupplier("Purchase Order", PurchaseOrderHeader.SupplierId);
                          else
                          {
                              if (PurchaseOrderHeader.Version == null)
                                  PurchaseOrderHeader.Version = "0";
                              PurchaseOrderHeader.Version = string.Format(_utils.GetVoucherFormat(2), int.Parse(PurchaseOrderHeader.Version) + 1);
                              _notification.VoidAllNotification(PurchaseOrderVoucherType, PurchaseOrderHeader.Id);
                  
                          }
                     
                        _purchaseOrderHeader.AddNew(PurchaseOrderHeader);
                        if (action != "revision" && voucherNo == "Draft")                                    
                        _utils.UpdateVoucherNumberBySpplier("Purchase Order", PurchaseOrderHeader.SupplierId);
                        httpapplication.Application.UnLock();
                        if (action != "revision")                                                         
                        UpdateStatus(PurchaseOrderHeader, action);
           
                    }
                    else
                    {
                        PurchaseOrderHeader.UpdatedAt = DateTime.Now;
                        
                        _purchaseOrderHeader.Edit(PurchaseOrderHeader);
                    }
                    var statusId = PurchaseOrderHeader.StatusId;               
                     SavePurchaseOrderDetail(PurchaseOrderHeader, OrderOrderDetailsString, statusId, action);
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
        public ActionResult SaveDetailFromATCCollection(Guid purchaseOrderHeaderId, string detailsString)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;

                try
                {
                    var purchaseOrder = _purchaseOrderHeader.Get(a => a.Id == purchaseOrderHeaderId);
                    SavePurchaseOrderDetail(purchaseOrder, detailsString, postedVoucherStatus, "atc");

                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Direct(new { success = true, data = "Item has been successfully deleted!" });
                }
                catch (Exception exception)
                {
                    return this.Direct(new { success = false, data = exception.InnerException.Message });
                }
            }
        }

        #endregion

        #region Methods
        private bool CheckStatus(Guid statusId)
        {
            bool returnValue = false;
            var voucherWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == PurchaseOrderVoucherType).OrderByDescending(o => o.Step);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == statusId).FirstOrDefault();
            if (currentStep == voucherWorkFlow.FirstOrDefault())
                returnValue = true;

            return returnValue;
        }
        private void UpdateStatus(psmsPurchaseOrderHeader purchaseOrderHeader, string action)
        {
                var objSuplier= _supplier.Get(o => o.Id == purchaseOrderHeader.SupplierId);
        
            var suplierCategory= objSuplier.lupSupplierCategory.Name;
            decimal total = GetVoucherTotal(purchaseOrderHeader.TotalSummarry);
            var date = purchaseOrderHeader.OrderedDate.ToShortDateString();
            var title = "Purchase Order(" + purchaseOrderHeader.VoucherNumber + ")";
            var message ="("+objSuplier.Name+")"+ " A new  purchase Order has be added with voucher no  " + purchaseOrderHeader.VoucherNumber + "on date " + date + " \n ";
           var objType= _lookup.Get(purchaseOrderHeader.OrderTypeId, Lookups.PurchaseOrderType);
           var criteria = "Supplier:" + suplierCategory + ",Total:" + total + ",Type:" + objType.Name;
         
            var voucherWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == PurchaseOrderVoucherType);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == purchaseOrderHeader.StatusId).FirstOrDefault();
            if(currentStep==null)
                throw new System.InvalidOperationException("Please maintain authorization step for the voucher!");
          
            var nextStep = voucherWorkFlow.Where(o => o.Step == currentStep.Step + 1).FirstOrDefault();
            if (nextStep != null)
            {
                var approver = _approver.GetAll().AsQueryable().Where(o => o.VoucherTypeId == PurchaseOrderVoucherType && o.StatusId == nextStep.VoucherStatusId && ((o.StoreId.HasValue ? o.StoreId == purchaseOrderHeader.StoreId : true)));
             if (approver.Count()>0)
             {
                 string approverIds = "";
                    foreach (var objApprover in approver)
                    {
                        var status = _notification.CheckCriteria(criteria, objApprover.Criteria);
                        if (status == true)
                            approverIds = approverIds + objApprover.EmployeeId.ToString() + ",";
                  }
                 _notification.SaveNotification(title, message, purchaseOrderHeader.Id,purchaseOrderHeader.VoucherNumber, nextStep.VoucherStatusId, PurchaseOrderVoucherType, approverIds,purchaseOrderHeader.StoreId,null, criteria);
          
             }
            
            }

        }
        private IList GetPurchaseRequestDetail(Guid voucherHeaderId, Guid supplierId)
        {
            var filtered = _purchaseRequestDetail.GetAll().AsQueryable().Where(d => d.PurchaseRequestHeaderId == voucherHeaderId).OrderBy(o => o.CreatedAt);
            var count = filtered.Count();
            var records = filtered.Select(item => new
            {
                Name = item.ItemId != null ? item.psmsItem.Name : item.Description,
                item.ItemId,
                Code = item.ItemId != null ? item.psmsItem.Code : "",
                item.StatusId,
                item.UnitId,
                Status = item.lupVoucherStatus.Name,
                item.psmsItem.Weight,
                MeasurementUnit = item.lupMeasurementUnit.Name,
                Quantity = item.Quantity,
                UnitCost =0,
                ReceivedQuantity = item.Quantity,
                RemainingQuantity = item.Quantity,
                item.Remark,
                AcceptedQuantity = 0,
                SampleQuantity = 0,
                DamagedQuantity = 0
            }).ToList();

            return records;
        }
        public void SavePurchaseOrderDetail(psmsPurchaseOrderHeader purchaseOrderHeader, string PurchaseOrderDetailsString, Guid statusId, string action)
        {
            PurchaseOrderDetailsString = PurchaseOrderDetailsString.Remove(PurchaseOrderDetailsString.Length - 1);
            IList<string> PurchaseOrderDetails = PurchaseOrderDetailsString.Split(new[] { ';' }).ToList();
            IList<psmsPurchaseOrderDetail> PurchaseOrderDetailList = new List<psmsPurchaseOrderDetail>();
            var oldsPurchaseOrderDetailList = _purchaseOrderDetail.GetAll().AsQueryable().Where(o => o.PurchaseOrderHeaderId == purchaseOrderHeader.Id);
            var sourceVoucherTypeId = purchaseOrderHeader.PurchaseRequestHeaderId.HasValue ? Constants.Voucher_Type_PurchaseRequest : "0";
            var sourceHeaderId = purchaseOrderHeader.PurchaseRequestHeaderId.HasValue ? purchaseOrderHeader.PurchaseRequestHeaderId.Value : Guid.Empty;
            decimal decimalValue = 0; double doubleValue = 0;
            for (var i = 0; i < PurchaseOrderDetails.Count(); i++)
            {
                var PurchaseOrderDetail = PurchaseOrderDetails[i].Split(new[] { ':' });
                var PurchaseOrderDetailId = Guid.Empty;
                var itemId=Guid.Empty;
                Guid.TryParse(PurchaseOrderDetail[0].ToString(), out PurchaseOrderDetailId);
                var objPurchaseOrderDetail =PurchaseOrderDetailId != Guid.Empty ? oldsPurchaseOrderDetailList.Where(o => o.Id == PurchaseOrderDetailId).FirstOrDefault() : new psmsPurchaseOrderDetail();
                decimal oldQuantity = objPurchaseOrderDetail.Quantity;
                objPurchaseOrderDetail.PurchaseOrderHeaderId = purchaseOrderHeader.Id;
                if(Guid.TryParse(PurchaseOrderDetail[2],out itemId))objPurchaseOrderDetail.ItemId=itemId;
                objPurchaseOrderDetail.UnitId = Guid.Parse(PurchaseOrderDetail[3]);
                objPurchaseOrderDetail.Quantity = decimal.Parse(PurchaseOrderDetail[4]);
                objPurchaseOrderDetail.RemainingQuantity = decimal.Parse(PurchaseOrderDetail[4]);
                objPurchaseOrderDetail.Description = PurchaseOrderDetail[6];
                objPurchaseOrderDetail.UnitCost = decimal.Parse(PurchaseOrderDetail[7]);
                objPurchaseOrderDetail.Tax = decimal.Parse(PurchaseOrderDetail[8]);
                objPurchaseOrderDetail.Remark = PurchaseOrderDetail[9];
                if (action == "atc")
                {
                    if (PurchaseOrderDetail[10] != null)
                        objPurchaseOrderDetail.InvoiceNo = PurchaseOrderDetail[10];
                    if (PurchaseOrderDetail[11] != null && double.TryParse(PurchaseOrderDetail[11], out doubleValue))
                        objPurchaseOrderDetail.ATCFrom = doubleValue;
                    if (PurchaseOrderDetail[12] != null && double.TryParse(PurchaseOrderDetail[12], out doubleValue))
                        objPurchaseOrderDetail.ATCTo = doubleValue;
                    if (PurchaseOrderDetail[13] != null && decimal.TryParse(PurchaseOrderDetail[13], out decimalValue))
                        objPurchaseOrderDetail.NoofATC = decimalValue;
                    if (PurchaseOrderDetail[14] != null && decimal.TryParse(PurchaseOrderDetail[14], out decimalValue))
                        objPurchaseOrderDetail.TruckSize = decimalValue;

                }
                objPurchaseOrderDetail.UpdatedAt = DateTime.Now;


                if (objPurchaseOrderDetail.Id == Guid.Empty)
                {
                    objPurchaseOrderDetail.Id = Guid.NewGuid();
                    objPurchaseOrderDetail.CreatedAt = DateTime.Now.AddSeconds(2);
                    objPurchaseOrderDetail.StatusId = statusId;
                    _purchaseOrderDetail.AddNew(objPurchaseOrderDetail);
                }
                PurchaseOrderDetailList.Add(objPurchaseOrderDetail);
                if (sourceVoucherTypeId != "0")
                    UpdateSourceDetail(Guid.Parse(sourceVoucherTypeId), sourceHeaderId, objPurchaseOrderDetail.ItemId, objPurchaseOrderDetail.Description, objPurchaseOrderDetail.Quantity - oldQuantity);
                 if(action=="accept")
                    {
                        UpdateInventory(objPurchaseOrderDetail, purchaseOrderHeader.OrderedDate);
                    }
            }
           
              var  sourceVoucherTypeIds=Guid.Empty;
              if (sourceVoucherTypeId != "0")
              sourceVoucherTypeIds=  Guid.Parse(sourceVoucherTypeId);
            DeletePurchaseOrderDetail(PurchaseOrderDetailList, oldsPurchaseOrderDetailList, sourceVoucherTypeIds, sourceHeaderId);
        }
        private void DeletePurchaseOrderDetail(IList<psmsPurchaseOrderDetail> PurchaseOrderDetailList, IQueryable<psmsPurchaseOrderDetail> oldsPurchaseOrderDetailList, Guid ?sourceVoucherTypeId, Guid headerId)
        {
            foreach (var objoldsPurchaseOrderDetail in oldsPurchaseOrderDetailList)
            {
                var record = PurchaseOrderDetailList.Where(o => o.Id == objoldsPurchaseOrderDetail.Id);

                if (record.Count() == 0)
                {
                    if (sourceVoucherTypeId != Guid.Empty)
                        UpdateSourceDetail(sourceVoucherTypeId.Value, headerId, objoldsPurchaseOrderDetail.ItemId, objoldsPurchaseOrderDetail.Description, -objoldsPurchaseOrderDetail.Quantity);
           
                     _purchaseOrderDetail.Delete(o => o.Id == objoldsPurchaseOrderDetail.Id);
                }
            }
        }

        private void UpdateInventory(psmsPurchaseOrderDetail purchaseOrderDetail, DateTime transactionDate)
        {
            var model = new ParameterModel { VoucherId = purchaseOrderDetail.PurchaseOrderHeaderId, VoucherTypeId = PurchaseOrderVoucherType, VoucherNo = purchaseOrderDetail.psmsPurchaseOrderHeader.VoucherNumber, ItemId = purchaseOrderDetail.ItemId.Value, StoreId = purchaseOrderDetail.psmsPurchaseOrderHeader.StoreId, FiscalYearId = purchaseOrderDetail.psmsPurchaseOrderHeader.FiscalYearId, TransactionDate = transactionDate, Quantity = (double)purchaseOrderDetail.Quantity, DamagedQuantity = 0, UnitCost = purchaseOrderDetail.UnitCost, FiscalYearDate = DateTime.Now, ExpireyDate = null };
            _inventoryRecord.ReceiveInventoryUpdate(model);
        }
        private void UpdateInventoryFromVoidedT(psmsPurchaseOrderDetail purchaseOrderDetail)
        {
            var model = new ParameterModel { VoucherId = purchaseOrderDetail.PurchaseOrderHeaderId, VoucherTypeId = PurchaseOrderVoucherType, VoucherNo = purchaseOrderDetail.psmsPurchaseOrderHeader.VoucherNumber, ItemId = purchaseOrderDetail.ItemId.Value, StoreId = purchaseOrderDetail.psmsPurchaseOrderHeader.StoreId, FiscalYearId = purchaseOrderDetail.psmsPurchaseOrderHeader.FiscalYearId, TransactionDate = purchaseOrderDetail.psmsPurchaseOrderHeader.OrderedDate, Quantity = (double)purchaseOrderDetail.Quantity, DamagedQuantity = 0, UnitCost = purchaseOrderDetail.UnitCost, FiscalYearDate = DateTime.Now, ExpireyDate = null };
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
        private string getTaxRate(string taxRateIds)
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
        private decimal GetVoucherTotal(string totalSummary)
        {
            decimal total = 0;
            if (totalSummary != null && totalSummary != "")
            {
                var totalList = totalSummary.Split(';').LastOrDefault();
                if(totalList!=null)
                {
                    totalList = totalList.Split(':').LastOrDefault();
                    total = decimal.Parse(totalList);
                }

            }
            return total;
        }
        private void UpdateSourceDetail(Guid sourceVoucherType, Guid headerId, Guid? itemId, string itemName, decimal updateQuantity)
        {
            if (sourceVoucherType == Guid.Parse(Constants.Voucher_Type_PurchaseRequest))
            {
                var objSourceDetail = _purchaseRequestDetail.GetAll().AsQueryable().Where(o => o.PurchaseRequestHeaderId == headerId && (itemId != null ? o.ItemId == itemId : o.Description == itemName)).FirstOrDefault();
                if (objSourceDetail != null)
                objSourceDetail.UnprocessedQuantity = objSourceDetail.UnprocessedQuantity - updateQuantity;
            }          
        }
        private IQueryable<psmsPurchaseOrderHeader> SearchTransaction(string mode, Hashtable ht, IQueryable<psmsPurchaseOrderHeader> filtered)
        {
            switch (mode)
            {
                case "search":
                    var startDate = ht["startDate"].ToString();
                    var endDate = ht["endDate"].ToString();
                    var referenceNo = ht["referenceNo"].ToString();
                    var tSearchText = ht["tSearchText"].ToString();
                    var pending =ht["pending"]!=null?bool.Parse( ht["pending"].ToString()):false;
                    var status = ht["status"].ToString();

                    if (!string.IsNullOrEmpty(referenceNo))
                    {
                        filtered = filtered.Where(v => v.VoucherNumber.Contains(referenceNo));
                    }
                    if (!string.IsNullOrEmpty(tSearchText))
                    {
                        filtered = filtered.Where(v =>
                            (v.psmsStore.Name.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            (v.lupPurchaseOrderType.Name.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            (v.psmsSupplier.Name.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                               (v.SalesType.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                        
                            (v.coreUser.FirstName + " " + v.coreUser.LastName).ToUpper().StartsWith(tSearchText.ToUpper()) ||                       
                            (v.coreUser1.FirstName + " " + v.coreUser1.LastName).ToUpper().StartsWith(tSearchText.ToUpper())                        
                            );
                    }
                    if (!string.IsNullOrEmpty(status))
                    {
                        filtered = filtered.Where(v => v.lupVoucherStatus.Name.Contains(status));
                    }
                    if (pending)
                    {
                        filtered = filtered.Where(v =>v.StatusId!=rejectedVoucherStatus && v.StatusId!=voidVoucherStatus && v.StatusId!=approvedVoucherStatus && v.StatusId!=finalApprovedVoucherStatus);
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
        #endregion

        #region
        public DirectResult GetAllATCDetail(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                Guid voucherHeaderId = Guid.Empty;
                if (hashtable["voucherHeaderId"] != null && hashtable["voucherHeaderId"] != "")
                    Guid.TryParse(hashtable["voucherHeaderId"].ToString(), out voucherHeaderId);

                var filtered =_purchaseOrderATCDetail.GetAll().AsQueryable().Where(d => d.PurchaseOrderDetailId == voucherHeaderId).OrderBy(o => o.Id);
                var count = filtered.Count();
                decimal? sumTotal = 0;
                var records = filtered.Select(item => new
                {
                    item.Id,
                    item.PurchaseOrderDetailId,
                    item.ATC,
                    item.InvoiceNo,
                    item.CustomerId,
                    item.Quantity,
                    item.DeliveredQuantity,
                    Different = item.DeliveredQuantity > 0 ? item.Quantity - item.DeliveredQuantity.Value : 0,
                    item.IsDelivered,
                    Customer = item.CustomerId.HasValue ? item.slmsCustomer.Name : "",
                    item.Remark
                }).ToList().Select(item => new
                {
                    item.Id,
                    item.PurchaseOrderDetailId,
                    item.ATC,
                    item.InvoiceNo,
                    item.CustomerId,
                    item.Quantity,
                    item.DeliveredQuantity,
                    Different = item.Different,
                    item.IsDelivered,
                    Customer = item.Customer,
                    TotalQuantity = sumTotal = sumTotal + item.Different,
                    sumTotal = 0,
                    item.Remark
                }).ToList();
                var result = new { total = count, data = records };
                return this.Direct(result);
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }
  
        public ActionResult SaveATCDetail(Guid PurchaseRequestDetailId, string PurchaseRequestATCDetailsString)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    SavePurchaseRequestATCDetail(PurchaseRequestDetailId, PurchaseRequestATCDetailsString);
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Direct(new { success = true, data = "Item has been successfully deleted!" });
                }
                catch (Exception exception)
                {
                    return this.Direct(new { success = false, data = exception.InnerException.Message });
                }
            }
        }

        public void SavePurchaseRequestATCDetail(Guid PurchaseRequestDetailId, string PurchaseRequestATCDetailsString)
        {
            var oldsPurchaseRequestATCDetailList = _purchaseOrderATCDetail.GetAll().AsQueryable().Where(o => o.PurchaseOrderDetailId == PurchaseRequestDetailId).ToList();
            Guid id = Guid.Empty ;
            var PurchaseRequestATCDetailList = new List<psmsPurchaseOrderATCDetail>();

            if (PurchaseRequestATCDetailsString != "")
                PurchaseRequestATCDetailsString = PurchaseRequestATCDetailsString.Remove(PurchaseRequestATCDetailsString.Length - 1);
            else
            {
                DeletePurchaseRequesATCtDetail(PurchaseRequestATCDetailList, oldsPurchaseRequestATCDetailList);
                _context.SaveChanges();
                return;
            }
            IList<string> PurchaseRequestATCDetails = PurchaseRequestATCDetailsString.Split(new[] { ';' }).ToList();

            bool isDelivered = false; decimal quantity = 0;
            for (var i = 0; i < PurchaseRequestATCDetails.Count(); i++)
            {
                var PurchaseRequestDetail = PurchaseRequestATCDetails[i].Split(new[] { ':' });
                var PurchaseRequestATCDetailId = Guid.Empty;
                Guid.TryParse(PurchaseRequestDetail[0].ToString(), out PurchaseRequestATCDetailId);
                var objPurchaseRequestATCDetail = PurchaseRequestATCDetailId != Guid.Empty ? oldsPurchaseRequestATCDetailList.Where(o => o.Id == PurchaseRequestATCDetailId).FirstOrDefault() : new psmsPurchaseOrderATCDetail();

                objPurchaseRequestATCDetail.PurchaseOrderDetailId = PurchaseRequestDetailId;
                objPurchaseRequestATCDetail.ATC = double.Parse(PurchaseRequestDetail[2]);
                if (Guid.TryParse(PurchaseRequestDetail[3], out id)) objPurchaseRequestATCDetail.CustomerId = id;
                objPurchaseRequestATCDetail.InvoiceNo = PurchaseRequestDetail[4];
                objPurchaseRequestATCDetail.Remark = PurchaseRequestDetail[5];
                if (bool.TryParse(PurchaseRequestDetail[6], out isDelivered))
                    objPurchaseRequestATCDetail.IsDelivered = isDelivered;
                if (decimal.TryParse(PurchaseRequestDetail[7], out quantity))
                    objPurchaseRequestATCDetail.Quantity = quantity;
                if (decimal.TryParse(PurchaseRequestDetail[8], out quantity))
                    objPurchaseRequestATCDetail.DeliveredQuantity = quantity;

                objPurchaseRequestATCDetail.UpdatedAt = DateTime.Now;
                if (PurchaseRequestATCDetailId == Guid.Empty)
                {
                    objPurchaseRequestATCDetail.Id = Guid.NewGuid();
                    objPurchaseRequestATCDetail.CreatedAt = DateTime.Now;
                    _purchaseOrderATCDetail.AddNew(objPurchaseRequestATCDetail);
                }
                PurchaseRequestATCDetailList.Add(objPurchaseRequestATCDetail);
            }
            DeletePurchaseRequesATCtDetail(PurchaseRequestATCDetailList, oldsPurchaseRequestATCDetailList);

        }
        private void DeletePurchaseRequesATCtDetail(IList<psmsPurchaseOrderATCDetail> PurchaseRequestATCDetailList, IList<psmsPurchaseOrderATCDetail> oldsPurchaseRequestATCDetailList)
        {
            foreach (var objoldsPurchaseRequestDetail in oldsPurchaseRequestATCDetailList)
            {
                var record = PurchaseRequestATCDetailList.Where(o => o.Id == objoldsPurchaseRequestDetail.Id);

                if (record.Count() == 0)
                {
                    _purchaseOrderATCDetail.Delete(o => o.Id == objoldsPurchaseRequestDetail.Id);
                }
            }
        }
   
      
        #endregion
    }
}
