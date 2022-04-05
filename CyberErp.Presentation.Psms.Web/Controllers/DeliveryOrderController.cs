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
    public class DeliveryOrderController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsDeliveryOrderHeader> _deliveryOrderHeader;
        private readonly BaseModel<psmsDeliveryOrderDetail> _deliveryOrderDetail;
        private readonly BaseModel<psmsItem> _item;
        private readonly BaseModel<psmsStore> _store;
        private readonly InventoryRecord _inventoryRecord;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        private readonly BaseModel<coreUnit> _unit;
        private readonly BaseModel<coreUser> _user;
        private readonly BaseModel<psmsApprover> _approver;
        
        private readonly BaseModel<psmsStorePermission> _storePermission;
        private readonly BaseModel<slmsSalesDetail> _salesDetail;
        private readonly BaseModel<slmsSalesHeader> _salesHeader;
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
        Guid issuedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Issued);
     
        Guid deliveryOrderVoucherType = Guid.Parse(Constants.Voucher_Type_DeliveryOrder);

        Guid salesVoucherType = Guid.Parse(Constants.Voucher_Type_sales);
        
        private readonly Lookups _lookup;
        
        private Guid employeeId =Guid.Empty;
        
        #endregion
        
        #region Constructor

        public DeliveryOrderController()
        {
             _context = new ErpEntities(Constants.ConnectionString);
             _deliveryOrderHeader = new BaseModel<psmsDeliveryOrderHeader>(_context);
             _deliveryOrderDetail = new BaseModel<psmsDeliveryOrderDetail>(_context);
            _item = new BaseModel<psmsItem>(_context);
            _store = new BaseModel<psmsStore>(_context);
            _inventoryRecord = new InventoryRecord(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);
            _unit = new BaseModel<coreUnit>(_context);
            _approver = new BaseModel<psmsApprover>(_context);
            
            _storePermission = new BaseModel<psmsStorePermission>(_context);
            _salesDetail = new BaseModel<slmsSalesDetail>(_context);
            _salesHeader = new BaseModel<slmsSalesHeader>(_context);
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

            var objDeliveryOrder = _deliveryOrderHeader.Get(o => o.Id == id);
            var returns = new
            {
                objDeliveryOrder.Id,
                objDeliveryOrder.SalesHeaderId,
                objDeliveryOrder.VoucherNumber,
                objDeliveryOrder.AttachmentNumber,
                DeliveryOrderdDate = objDeliveryOrder.DeliveryOrderdDate.ToShortDateString(),
                objDeliveryOrder.PreparedById,
                objDeliveryOrder.DeliveryOrderdById,
                objDeliveryOrder.ReceivedBy,
                objDeliveryOrder.FiscalYearId,
                FiscalYear = objDeliveryOrder.coreFiscalYear.Name,
                DeliveryOrderdBy = objDeliveryOrder.DeliveryOrderdById != null ? objDeliveryOrder.coreUser1.FirstName + " " + objDeliveryOrder.coreUser1.LastName : "",
                objDeliveryOrder.StatusId,
                objDeliveryOrder.StoreId,
                objDeliveryOrder.PlateNo,
                objDeliveryOrder.Driver,
                objDeliveryOrder.IsPosted,
                objDeliveryOrder.Customer,
                Store = objDeliveryOrder.psmsStore != null ? objDeliveryOrder.psmsStore.Name : "",
                objDeliveryOrder.Remark,
                objDeliveryOrder.CreatedAt    
            };
            var serialList = _itemSerialTransaction.GetItemSerialTransactionList((Guid)objDeliveryOrder.Id, deliveryOrderVoucherType);
            var lotList = _itemLOTTransaction.GetItemLOTList((Guid)objDeliveryOrder.Id, deliveryOrderVoucherType);
        
            return this.Direct(new
            {
                success = true,
                data = returns,
                serialList = serialList,
                lotList = lotList
            });
        }
        public DirectResult GetAllSalesHeader(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                var mode =hashtable["mode"]!=null? hashtable["mode"].ToString():"";

                var isManualSales = hashtable["isManualSales"] != null && hashtable["isManualSales"] != ""? bool.Parse( hashtable["isManualSales"].ToString()) :false;

            
                var userId = Guid.Empty;
                var objUser = (coreUser)Session[Constants.CurrentUser];
                if (objUser != null && objUser.Id != null)
                {
                    employeeId = (Guid)objUser.Id;
                    userId = (Guid)objUser.Id;
                }
                var LastWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == salesVoucherType).OrderByDescending(o => o.Step).FirstOrDefault();
                var lastVoucherId = LastWorkFlow != null ? LastWorkFlow.VoucherStatusId : Guid.Empty;
                    var filtered = _salesHeader.GetAll().AsQueryable().Where(x => x.StatusId == lastVoucherId);
                    filtered = SearchTransaction(mode, hashtable, filtered);
                    filtered = filtered.Where(o => o.slmsSalesDetail.Where(f => f.RemainingQuantity > 0).Any());
                    var deliveryOrderDetailList = _deliveryOrderDetail.GetAll().AsQueryable();
                    switch (sort)
                    {
                        case "Id":
                            filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.CreatedAt) : filtered.OrderBy(u => u.CreatedAt);
                            break;
                        case "VoucherNumber":
                            filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.VoucherNumber) : filtered.OrderBy(u => u.VoucherNumber);
                            break;
                        case "Date":
                            filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.Date) : filtered.OrderBy(u => u.Date);
                            break;
                        case "FsNo":
                            filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.FsNo) : filtered.OrderBy(u => u.FsNo);
                            break;
                        //case "SalesType":
                        //    filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.lupSalesType.Name) : filtered.OrderBy(u => u.lupSalesType.Name);
                        //    break;
                        case "SalesArea":
                            filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.slmsSalesArea.Name) : filtered.OrderBy(u => u.slmsSalesArea.Name);
                            break;
                        case "Customer":
                            filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.slmsCustomer.Name) : filtered.OrderBy(u => u.slmsCustomer.Name);
                            break;
                        case "NetPay":
                            filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.NetPay) : filtered.OrderBy(u => u.NetPay);
                            break;
                        default:
                            filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                            break;


                    }
                    var count = filtered.Count();
                    filtered = filtered.Skip(start).Take(limit);
                    var records = filtered.Select(item => new
                    {
                        item.Id,
                        item.VoucherNumber,
                      //  SalesType = item.lupSalesType.Name,
                        Customer = item.slmsCustomer.Name,
                        item.Date,
                        item.FsNo,
                        SalesArea = item.slmsSalesArea.Name,
                        IsFullyIssued = !item.slmsSalesDetail.Where(o => o.RemainingQuantity > 0).Any(),
                    }).ToList().Select(item => new
                    {
                        item.Id,
                        item.VoucherNumber,
                      //  item.SalesType,
                        item.FsNo,
                        item.SalesArea,
                        Customer = item.Customer,
                        Date = item.Date.ToShortDateString(),
                        item.IsFullyIssued


                    });
                    return this.Direct(new { total = count, data = records });
             
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
                var salesId = hashtable["salesId"] != null ? Guid.Parse(hashtable["salesId"].ToString()) : Guid.Empty;
                var isThirdParty = hashtable["isThirdParty"] != null ? bool.Parse(hashtable["isThirdParty"].ToString()) : false;
                var LastWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == deliveryOrderVoucherType).OrderByDescending(o => o.Step).FirstOrDefault();
                var lastVoucherId = LastWorkFlow != null ? LastWorkFlow.VoucherStatusId : Guid.Empty;
                var mode = hashtable["mode"] != null ? hashtable["mode"].ToString() : "";
                var userId = Guid.Empty;
                var objUser = (coreUser)Session[Constants.CurrentUser];
                if (objUser != null && objUser.Id != null)
                {
                    employeeId = (Guid)objUser.Id;
                    userId = (Guid)objUser.Id;
                }

                var filtered = _deliveryOrderHeader.GetAll().AsQueryable().Where(x =>x.psmsStore.psmsStorePermission.Any()? x.psmsStore.psmsStorePermission.Where(f => f.UserId == userId).Any():true);
                filtered =SearchTransactionDeliveryOrder(mode, hashtable, filtered);
               
                switch (sort)
                {
                    case "Id":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.Id) : filtered.OrderBy(u => u.Id);
                        break;
                    case "VoucherNumber":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.VoucherNumber) : filtered.OrderBy(u => u.VoucherNumber);
                        break;
                    case "DeliveryOrderdDate":
                        filtered = dir == "DESC"? filtered.OrderByDescending(u => u.DeliveryOrderdDate) : filtered.OrderBy(u => u.DeliveryOrderdDate);
                        break;
                    case "Store":
                        filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.psmsStore.Name) : filtered.OrderBy(u => u.psmsStore.Name);
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
                    item.DeliveryOrderdDate,
                    SalesOrderNo=item.SalesHeaderId.HasValue?item.slmsSalesHeader.VoucherNumber:"",
                    FSNo = item.SalesHeaderId.HasValue ? item.slmsSalesHeader.FsNo : "",
                    IssuedBy = item.coreUser.FirstName + " " + item.coreUser.LastName,
                    ApprovedBy = item.coreUser1.FirstName + " " + item.coreUser1.LastName,                                                   
                    item.StatusId,
                    IsLastStep = lastVoucherId != Guid.Empty ? lastVoucherId == item.StatusId : true,
                    item.Customer,
                    Status = item.lupVoucherStatus.Name,
                    item.StoreId,
                    Store=item.psmsStore.Name,
                 }).ToList().Select(item => new
                {
                    item.Id,
                    item.IssuedBy,
                    DeliveryOrderdDate = item.DeliveryOrderdDate.ToShortDateString(),
                    item.VoucherNumber,
                    item.Customer,
                    item.FSNo,
                    item.SalesOrderNo,
                    item.StatusId,
                    item.IsLastStep,
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
                   var deliveryOrderDetailList=_deliveryOrderDetail.GetAll().AsQueryable();
             
                if(action=="deliveryOrder")
                {
                    var filtered = _deliveryOrderDetail.GetAll().AsQueryable().Where(d => d.DeliveryOrderHeaderId == voucherHeaderId).OrderBy(o => o.CreatedAt);
                    var count = filtered.Count();
                    records = filtered.Select(item => new
                    {
                        item.Id,
                        item.DeliveryOrderHeaderId,
                        Name = item.psmsItem.Name,
                        item.ItemId,
                        item.psmsItem.IsSerialItem,
                        item.psmsItem.IsLOTItem,
                        Code = item.ItemId != null ? item.psmsItem.Code : "",
                        item.StatusId,
                        Status = item.lupVoucherStatus.Name,
                        MeasurementUnit = item.lupMeasurementUnit.Name,
                        item.UnitId,
                        item.DeliveryOrderdQuantity,
                        Quantity=item.Quantity,
                        RemainingQuantity = item.Quantity - deliveryOrderDetailList.Where(f => f.psmsDeliveryOrderHeader.StatusId == issuedVoucherStatus && f.ItemId == item.ItemId && f.psmsDeliveryOrderHeader.SalesHeaderId == item.psmsDeliveryOrderHeader.SalesHeaderId).Select(d => d.DeliveryOrderdQuantity).DefaultIfEmpty(0).Sum(),
                        AvailableQuantity = item.psmsItem.psmsInventoryRecord.Where(o => o.IsClosed == false && o.StoreId == storeId && o.FiscalYearId == fiscalYearId).Select(f => f.AvailableQuantity).DefaultIfEmpty(0).Sum(),
                
                    }).ToList().Cast<object>().ToList();
                    var result = new { total = count, data = records };
                    return this.Direct(result);
                } 
                else
                {
                    var filtered =_salesDetail.GetAll().AsQueryable().Where(d => d.SalesHeaderId == voucherHeaderId).OrderBy(o => o.CreatedAt);
                    var count = filtered.Count();
                     records = filtered.Select(item => new
                    {
                        SalesDetailId=item.Id,
                        item.SalesHeaderId,
                        Name = item.psmsItem.Name,
                        ItemId=item.ItemId,
                        Code =item.psmsItem.Code ,
                        item.psmsItem.IsSerialItem,
                        item.psmsItem.IsLOTItem,  
                        item.UnitId,
                        MeasurementUnit =  item.lupMeasurementUnit.Name ,
                        Quantity=item.Quantity,
                        RemainingQuantity = item.RemainingQuantity,
                        DeliveryOrderdQuantity = item.RemainingQuantity,
                        AvailableQuantity = item.psmsItem.psmsInventoryRecord.Where(o => o.IsClosed == false && o.StoreId == storeId && o.FiscalYearId == fiscalYearId).Select(f => f.AvailableQuantity).DefaultIfEmpty(0).Sum(),
            
                    }).ToList().Cast<object>().ToList(); ;
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
                    var objHeader = _deliveryOrderHeader.Get(o => o.Id == id);
                    if (objHeader.IsPosted == true)
                        return this.Direct(new { success = false, data = "you can't void already posted transaction!" });
                    var salesHeaderId = objHeader.SalesHeaderId.HasValue ? objHeader.SalesHeaderId.Value : Guid.Empty;
                 
                        foreach(var objDeliveryOrderDetail in objHeader.psmsDeliveryOrderDetail)
                        {
                             objDeliveryOrderDetail.StatusId = voidVoucherStatus;
                            objDeliveryOrderDetail.UnitCost = 0;
                            if (objHeader.SalesHeaderId != null && objHeader.SalesHeaderId != Guid.Empty)
                                UpdateSalesDetail(salesHeaderId, objDeliveryOrderDetail.ItemId, -objDeliveryOrderDetail.DeliveryOrderdQuantity);
                            if (objHeader.StatusId==issuedVoucherStatus)
                          UpdateInventoryFromVoidedT(objDeliveryOrderDetail, objHeader.SalesHeaderId);
                        }
                        _itemSerialTransaction.VoidItemSerialTransaction((Guid)objHeader.Id, deliveryOrderVoucherType, objHeader.SalesHeaderId, true);
                       _itemLOTTransaction.VoidItemLOTTransaction((Guid)objHeader.Id, deliveryOrderVoucherType);
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
        public ActionResult Save(psmsDeliveryOrderHeader deliveryHeader)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var deliveryOrderDetailsString = hashtable["deliveryOrderDetails"].ToString();
                    var itemSerialsString = hashtable["itemSerials"].ToString();
                    var itemLOTsString = hashtable["itemLOTs"].ToString();
                    var action = hashtable["action"].ToString();
                    var statusId = Guid.Empty;
                    statusId = deliveryHeader.StatusId;
                    if (deliveryHeader.Id==Guid.Empty)
                    {
                        deliveryHeader.CreatedAt=DateTime.Now;
                        deliveryHeader.Id = Guid.NewGuid();
                        CyberErp.Presentation.Psms.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Psms.Web.MvcApplication;
                      httpapplication.Application.Lock();
                      deliveryHeader.VoucherNumber = _utils.GetVoucherNumber("Delivery Order", deliveryHeader.StoreId);
                      _deliveryOrderHeader.AddNew(deliveryHeader);
                      _utils.UpdateVoucherNumber("Delivery Order", deliveryHeader.StoreId);
                      httpapplication.Application.UnLock();
                      UpdateStatus(deliveryHeader, action);
                
                    }
                    else
                    {
                   
                        deliveryHeader.UpdatedAt=DateTime.Now;
                        _deliveryOrderHeader.Edit(deliveryHeader);
                    }
                    var isIssue = CheckStatus(deliveryHeader.StatusId);
                    if (action == "issue")
                    {
                        action = isIssue == true ? "issue" : "post";                 
                        deliveryHeader.StatusId = issuedVoucherStatus;                
                    }
                    var salesHeaderId = deliveryHeader.SalesHeaderId.HasValue ? deliveryHeader.SalesHeaderId.Value : Guid.Empty;
                    var source = deliveryHeader.SalesHeaderId.HasValue ? "Sales" :"";

                    SaveDeliveryOrderDetail(deliveryHeader.Id, salesHeaderId, deliveryOrderDetailsString, statusId, action, source);
                    if (itemSerialsString != "") _itemSerialTransaction.AddItemSerialTransactions((Guid)deliveryHeader.Id, deliveryHeader.SalesHeaderId, deliveryHeader.DeliveryOrderdDate, deliveryOrderVoucherType, deliveryHeader.VoucherNumber, itemSerialsString, action, true, false, false);
                    if (itemLOTsString != "") _itemLOTTransaction.AddItemLOTsTransaction((Guid)deliveryHeader.Id, deliveryOrderVoucherType, deliveryHeader.VoucherNumber, itemLOTsString, action);
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
            var voucherWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == deliveryOrderVoucherType).OrderByDescending(o => o.Step);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == statusId).FirstOrDefault();
            if (currentStep == voucherWorkFlow.FirstOrDefault())
                returnValue = true;

            return returnValue;
        }
        private void UpdateStatus(psmsDeliveryOrderHeader deliveryHeader, string action)
        {


            var date = deliveryHeader.DeliveryOrderdDate.ToShortDateString();
            var title = "Delivery Order(" + deliveryHeader.VoucherNumber + ")";
            var message = "A new Delivery Order has be added with voucher no  " + deliveryHeader.VoucherNumber + "on date " + date + " \n ";


            var voucherWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == deliveryOrderVoucherType);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == deliveryHeader.StatusId).FirstOrDefault();
            var nextStep = voucherWorkFlow.Where(o => o.Step == currentStep.Step + 1).FirstOrDefault();
            if (nextStep != null)
            {
                var approver = _approver.GetAll().AsQueryable().Where(o => o.VoucherTypeId == deliveryOrderVoucherType && o.StatusId == nextStep.VoucherStatusId && ((o.StoreId.HasValue ? o.StoreId == deliveryHeader.StoreId : true)));             
                if (approver.Count() > 0)
                {
                    string approverIds = "";
                    foreach (var objApprover in approver)
                    {
                              approverIds = approverIds + objApprover.EmployeeId.ToString() + ",";
                    }
                    _notification.SaveNotification(title, message, deliveryHeader.Id, deliveryHeader.VoucherNumber, nextStep.VoucherStatusId, deliveryOrderVoucherType, approverIds, deliveryHeader.StoreId, null, "");

                }

            }

        }
     
        public void SaveDeliveryOrderDetail(Guid deliveryOrderHeaderId,Guid?salesHeaderId, string deliveryOrderDetailsString,Guid statusId, string action,string source)
        {
            deliveryOrderDetailsString = deliveryOrderDetailsString.Remove(deliveryOrderDetailsString.Length - 1);
            IList<string> deliveryOrderDetails = deliveryOrderDetailsString.Split(new[] { ';' }).ToList();
            IList<psmsDeliveryOrderDetail> deliveryOrderDetailList = new List<psmsDeliveryOrderDetail>();
            var oldsDeliveryOrderDetailList =_deliveryOrderDetail.GetAll().AsQueryable().Where(o => o.DeliveryOrderHeaderId == deliveryOrderHeaderId).ToList();
            decimal oldQuatity = 0;
            for (var i = 0; i < deliveryOrderDetails.Count(); i++)
            {
                var deliveryOrderDetail = deliveryOrderDetails[i].Split(new[] { ':' });
                var deliveryOrderDetailId = Guid.Empty;
                Guid.TryParse(deliveryOrderDetail[0].ToString(), out deliveryOrderDetailId);
                var objDeliveryOrderDetail = deliveryOrderDetailId != Guid.Empty ? oldsDeliveryOrderDetailList.Where(o => o.Id == deliveryOrderDetailId).FirstOrDefault() : new psmsDeliveryOrderDetail();
               
                objDeliveryOrderDetail.DeliveryOrderHeaderId = deliveryOrderHeaderId;
                objDeliveryOrderDetail.ItemId = Guid.Parse(deliveryOrderDetail[2]);
                oldQuatity = objDeliveryOrderDetail.DeliveryOrderdQuantity;
                decimal quantity=0;
                if (decimal.TryParse(deliveryOrderDetail[3], out quantity))
                objDeliveryOrderDetail.Quantity = decimal.Parse(deliveryOrderDetail[3]);
                objDeliveryOrderDetail.DeliveryOrderdQuantity = decimal.Parse(deliveryOrderDetail[4]);            
                objDeliveryOrderDetail.RemainingQuantity = decimal.Parse(deliveryOrderDetail[5]);
                objDeliveryOrderDetail.UnitId = Guid.Parse(deliveryOrderDetail[6]);
             
                 if (deliveryOrderDetailId == Guid.Empty)
                {
                    objDeliveryOrderDetail.CreatedAt = DateTime.Now;
                    objDeliveryOrderDetail.StatusId = statusId;
                    objDeliveryOrderDetail.Id = Guid.NewGuid();
                   _deliveryOrderDetail.AddNew(objDeliveryOrderDetail);
                }
                    if(salesHeaderId!=null && salesHeaderId!=Guid.Empty)
                        UpdateSalesDetail(salesHeaderId.Value, objDeliveryOrderDetail.ItemId, objDeliveryOrderDetail.DeliveryOrderdQuantity - oldQuatity);
                if(action=="issue")
                  UpdateInventory(objDeliveryOrderDetail, salesHeaderId);
                 deliveryOrderDetailList.Add(objDeliveryOrderDetail);
            }
            DeleteDeliveryOrderDetail(deliveryOrderDetailList, oldsDeliveryOrderDetailList, salesHeaderId, source);
           
        }
        private void DeleteDeliveryOrderDetail(IList<psmsDeliveryOrderDetail> deliveryOrderDetailList, IList<psmsDeliveryOrderDetail> oldsDeliveryOrderDetailList, Guid? salesHeaderId, string source)
        {
            foreach (var objoldsDeliveryOrderDetail in oldsDeliveryOrderDetailList)
            {
                var record = deliveryOrderDetailList.Where(o => o.Id == objoldsDeliveryOrderDetail.Id);

                if (record.Count() == 0)
                {
                    if (salesHeaderId != null && salesHeaderId != Guid.Empty)
                        UpdateSalesDetail(salesHeaderId.Value, objoldsDeliveryOrderDetail.ItemId, -objoldsDeliveryOrderDetail.DeliveryOrderdQuantity);
          
                     _deliveryOrderDetail.Delete(o => o.Id == objoldsDeliveryOrderDetail.Id);
                }
            }
        }
        private void UpdateSalesDetail(Guid headerId, Guid itemId, decimal updateQuantity)
        {         
                var objSalesDetail = _salesDetail.GetAll().AsQueryable().Where(o => o.SalesHeaderId == headerId && o.ItemId == itemId).FirstOrDefault();
                objSalesDetail.RemainingQuantity = objSalesDetail.RemainingQuantity - updateQuantity;
        }  
        private void UpdateInventory(psmsDeliveryOrderDetail deliveryOrderDetail, Guid? salesHeaderId)
        {
            var model = new ParameterModel { VoucherId = deliveryOrderDetail.DeliveryOrderHeaderId, VoucherTypeId = deliveryOrderVoucherType, VoucherNo = deliveryOrderDetail.psmsDeliveryOrderHeader.VoucherNumber, ItemId = deliveryOrderDetail.ItemId, StoreId = deliveryOrderDetail.psmsDeliveryOrderHeader.StoreId, FiscalYearId = deliveryOrderDetail.psmsDeliveryOrderHeader.FiscalYearId, TransactionDate = DateTime.Now, Quantity =(double) deliveryOrderDetail.DeliveryOrderdQuantity, DamagedQuantity = 0 };
            var unitCost = _inventoryRecord.IssueInventoryUpdate(model);          
            deliveryOrderDetail.UnitCost = unitCost;
        }
        private void UpdateInventoryFromVoidedT(psmsDeliveryOrderDetail deliveryOrderDetail, Guid? salesHeaderId)
        {
            var model = new ParameterModel { VoucherId = deliveryOrderDetail.DeliveryOrderHeaderId, VoucherTypeId = deliveryOrderVoucherType, VoucherNo = deliveryOrderDetail.psmsDeliveryOrderHeader.VoucherNumber, ItemId = deliveryOrderDetail.ItemId, StoreId = deliveryOrderDetail.psmsDeliveryOrderHeader.StoreId, FiscalYearId = deliveryOrderDetail.psmsDeliveryOrderHeader.FiscalYearId, TransactionDate = DateTime.Now, Quantity =(double) deliveryOrderDetail.DeliveryOrderdQuantity, DamagedQuantity = 0 };
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

        private IQueryable<slmsSalesHeader> SearchTransaction(string mode, Hashtable ht, IQueryable<slmsSalesHeader> filtered)
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
                        filtered = filtered.Where(v => v.ReferenceNo.Contains(referenceNo) || v.VoucherNumber.Contains(referenceNo));
                    }
                    if (!string.IsNullOrEmpty(tSearchText))
                    {
                        filtered = filtered.Where(i => 

                            i.VoucherNumber.ToUpper().Contains(tSearchText.ToUpper()) ||
                            i.ReferenceNo.ToUpper().Contains(tSearchText.ToUpper()) ||
                            i.FsNo.ToUpper().Contains(tSearchText.ToUpper()) ||
                            i.slmsCustomer.Name.ToUpper().Contains(tSearchText.ToUpper()) ||
                            i.lupVoucherStatus.Name.ToUpper().Contains(tSearchText.ToUpper())

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
                        filtered = filtered.Where(v => v.Date >= transactionStartDate && v.Date <= transactionEndDate);
                    }
                    break;
            }
            return filtered;
        }
        private IQueryable<psmsDeliveryOrderHeader> SearchTransactionDeliveryOrder(string mode, Hashtable ht, IQueryable<psmsDeliveryOrderHeader> filtered)
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
                        filtered = filtered.Where(v => (v.SalesHeaderId.HasValue?v.slmsSalesHeader.VoucherNumber.Contains(referenceNo):false) || v.VoucherNumber.Contains(referenceNo));
                    }
                    if (!string.IsNullOrEmpty(tSearchText))
                    {
                        filtered = filtered.Where(i => 

                          i.VoucherNumber.ToUpper().Contains(tSearchText.ToUpper()) ||
                          ( i.SalesHeaderId.HasValue? i.slmsSalesHeader.FsNo.ToUpper().Contains(tSearchText.ToUpper()):false) ||
                          (i.SalesHeaderId.HasValue ? i.slmsSalesHeader.VoucherNumber.ToUpper().Contains(tSearchText.ToUpper()) : false) ||
                          (i.SalesHeaderId.HasValue ? i.slmsSalesHeader.slmsCustomer.Name.ToUpper().Contains(tSearchText.ToUpper()) : false) ||
                          i.psmsStore.Name.ToUpper().Contains(tSearchText.ToUpper())||
                          i.lupVoucherStatus.Name.ToUpper().Contains(tSearchText.ToUpper())

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
                        filtered = filtered.Where(v => v.DeliveryOrderdDate >= transactionStartDate && v.DeliveryOrderdDate <= transactionEndDate);
                    }
                    break;
            }
            return filtered;
        }
  

        #endregion
    }
}
