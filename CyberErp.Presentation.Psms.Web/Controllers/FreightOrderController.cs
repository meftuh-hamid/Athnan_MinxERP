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

namespace Presentation.Inventory.Web.Controllers
{
    public class FreightOrderController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsFreightOrder> _freightOrder;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        private readonly BaseModel<psmsPurchaseOrderATCDetail> _purchaseOrderATCDetail;
        private readonly BaseModel<slmsCustomer> _customer;
        private readonly BaseModel<slmsSalesDetail> _salesOrderDetail;
        private readonly BaseModel<psmsDelivery> _delivery;
        private readonly BaseModel<coreVoucherWorkFlow> _voucherWorkFlow;          
         private Utility _utils;
         Guid postedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Posted);
         Guid certifiedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Certified);
         Guid approvedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Approved);
         Guid partiallyVoucherStatus = Guid.Parse(Constants.Voucher_Status_Partially_Approved);
         Guid rejectedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Rejected);
         Guid voidVoucherStatus = Guid.Parse(Constants.Voucher_Status_Void);
         Guid deliveryOrderVoucherType = Guid.Parse(Constants.Voucher_Type_DeliveryOrder);
         Guid finalApprovedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Final_Approved);
         Guid issuedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Issued);     
       
        private readonly Lookups _lookup;
        private Guid employeeId = Guid.Empty;
        private string employeeName = "";
        Guid PurchaseOrderVoucherType = Guid.Parse(Constants.Voucher_Type_PurchaseOrder);
       
        #endregion

        #region Constructor

        public FreightOrderController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _freightOrder = new BaseModel<psmsFreightOrder>(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);
            _purchaseOrderATCDetail = new BaseModel<psmsPurchaseOrderATCDetail>(_context);
            _utils = new Utility();
            _lookup = new Lookups(_context);
            _customer = new BaseModel<slmsCustomer>(_context);
            _salesOrderDetail = new BaseModel<slmsSalesDetail>(_context);
            _delivery = new BaseModel<psmsDelivery>(_context);
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

            var objFreightOrder = _freightOrder.Get(o => o.Id == id);
            var freightOrder = new
            {
                objFreightOrder.Id,
                objFreightOrder.VoucherNumber,
                objFreightOrder.FiscalYearId,
                objFreightOrder.ATC,
                objFreightOrder.From,
                objFreightOrder.To,
                objFreightOrder.UnitId,
                Unit=objFreightOrder.lupMeasurementUnit.Name,
                objFreightOrder.Quantity,
                objFreightOrder.PurchaseReqeustATCDetailId,
                objFreightOrder.DriverName,
                objFreightOrder.DriverTelephone,
                objFreightOrder.PlateNo,
                objFreightOrder.ItemId,
                Item=objFreightOrder.ItemId.HasValue?objFreightOrder.psmsItem.Name:"",
                objFreightOrder.LicenseNo,
                objFreightOrder.ShipperName,
                objFreightOrder.ReceivedBy,
                objFreightOrder.PreparedById,
                objFreightOrder.CustomerId,
                Customer=objFreightOrder.CustomerId.HasValue?objFreightOrder.slmsCustomer.Name:"",
                objFreightOrder.InvoiceNo,
                objFreightOrder.CustomerTelephone,
                objFreightOrder.SupplierId,
                Supplier=objFreightOrder.SupplierId.HasValue?objFreightOrder.psmsSupplier.Name:"",
                Date = objFreightOrder.Date.ToShortDateString(),              
                FiscalYear = objFreightOrder.coreFiscalYear.Name,
                objFreightOrder.StatusId,
                Status=objFreightOrder.lupVoucherStatus.Name,
                objFreightOrder.Remark,
                objFreightOrder.CreatedAt
            };
            return this.Direct(new
            {
                success = true,
                data = freightOrder
            });
        }
        public DirectResult GetAllHeader(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                var mode = hashtable["mode"] != null ? hashtable["mode"].ToString() : "";
            
          
                var filtered =_freightOrder.GetAll().AsQueryable();
                filtered = SearchTransaction(mode, hashtable, filtered);
                switch (sort)
                {
                       case "VoucherNumber":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.VoucherNumber) : filtered.OrderBy(u => u.VoucherNumber);
                        break;
                    case "Date":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.Date) : filtered.OrderBy(u => u.Date);
                        break;
                    case "ATC":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.ATC) : filtered.OrderBy(u => u.ATC);
                        break;
                    case "Unit":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.lupMeasurementUnit.Name) : filtered.OrderBy(u => u.lupMeasurementUnit.Name);
                        break;
                    case "Item":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.ItemId.HasValue ? u.psmsItem.Name : "") : filtered.OrderBy(u => u.ItemId.HasValue ? u.psmsItem.Name : "");
                        break;
                    case "Quantity":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.Quantity) : filtered.OrderBy(u => u.Quantity);
                        break;
                    case "DriverName":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.DriverName) : filtered.OrderBy(u => u.DriverName);
                        break;
                    case "PlateNo":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.PlateNo) : filtered.OrderBy(u => u.PlateNo);
                        break;
                    case "PreparedBy":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.coreUser.FirstName + " " + u.coreUser.LastName) : filtered.OrderBy(u => u.coreUser.FirstName + " " + u.coreUser.LastName);
                        break;
                     case "Supplier":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.psmsSupplier.Name) : filtered.OrderBy(u => u.psmsSupplier.Name);
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
                    item.ATC,
                    item.From,
                    item.To,
                    Item=item.ItemId.HasValue?item.psmsItem.Name:"",
                    Unit = item.lupMeasurementUnit.Name,
                    item.Quantity,
                    item.DriverName,
                    item.DriverTelephone,
                    item.PlateNo,
                    item.LicenseNo,
                    item.ShipperName,
                    item.ReceivedBy,
                    item.PreparedById,
                    PreparedBy=item.coreUser.FirstName+" "+item.coreUser.LastName,
                    Supplier = item.SupplierId.HasValue ? item.psmsSupplier.Name : "",
                    Date = item.Date,
                    FiscalYear = item.coreFiscalYear.Name,
                    Status=item.lupVoucherStatus.Name,
                    item.Remark,
                    item.CreatedAt

   
                }).ToList().Select(item => new
                {
                    item.Id,
                    item.VoucherNumber,
                    item.Item,
                    item.ATC,
                    item.From,
                    item.To,
                    Unit = item.Unit,
                    item.Quantity,
                    item.DriverName,
                    item.DriverTelephone,
                    item.PlateNo,
                    item.LicenseNo,
                    item.ShipperName,
                    item.ReceivedBy,
                    item.PreparedById,
                    PreparedBy = item.PreparedBy,
                    Supplier = item.Supplier,
                    Date = item.Date.ToShortDateString(),
                    Status = item.Status,
                    item.Remark,
                });
                return this.Direct(new { total = count, data = purchaserequestHeaders });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }

        public DirectResult GetAllHeaderPurchaseATC(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                var mode = hashtable["mode"] != null ? hashtable["mode"].ToString() : "";
                var LastWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == PurchaseOrderVoucherType).OrderByDescending(o => o.Step);
                var lastVoucherId = LastWorkFlow.Count() > 0 ? LastWorkFlow.FirstOrDefault().VoucherStatusId : Guid.Empty;


                var filtered = _purchaseOrderATCDetail.GetAll().AsQueryable().Where(o => o.psmsPurchaseOrderDetail.psmsPurchaseOrderHeader.StatusId == finalApprovedVoucherStatus && !o.psmsFreightOrder.Any());
                filtered = SearchTransactionPurchaseATC(mode, hashtable, filtered);
                switch (sort)
                {
                    case "Id":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.Id) : filtered.OrderBy(u => u.Id);
                        break;
                    case "VoucherNumber":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.psmsPurchaseOrderDetail.psmsPurchaseOrderHeader.VoucherNumber + " " + u.psmsPurchaseOrderDetail.psmsItem.Name) : filtered.OrderBy(u => u.psmsPurchaseOrderDetail.psmsPurchaseOrderHeader.VoucherNumber + " " + u.psmsPurchaseOrderDetail.psmsItem.Name);
                        break;
                    case "Date":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.psmsPurchaseOrderDetail.psmsPurchaseOrderHeader.OrderedDate) : filtered.OrderBy(u => u.psmsPurchaseOrderDetail.psmsPurchaseOrderHeader.OrderedDate);
                        break;
                    case "ATC":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.ATC) : filtered.OrderBy(u => u.ATC);
                        break;
                    case "Item":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.psmsPurchaseOrderDetail.ItemId.HasValue ? u.psmsPurchaseOrderDetail.psmsItem.Name : "") : filtered.OrderBy(u => u.psmsPurchaseOrderDetail.ItemId.HasValue ? u.psmsPurchaseOrderDetail.psmsItem.Name : "");
                        break;
                    case "Quantity":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.Quantity) : filtered.OrderBy(u => u.Quantity);
                        break;                
                    case "Supplier":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.psmsPurchaseOrderDetail.psmsPurchaseOrderHeader.psmsSupplier.Name) : filtered.OrderBy(u => u.psmsPurchaseOrderDetail.psmsPurchaseOrderHeader.psmsSupplier.Name);
                        break;
                    default:
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.Id) : filtered.OrderBy(u => u.Id);
                        break;

                }
                var count = filtered.Count();
                filtered = filtered.Skip(start).Take(limit);

                var purchaserequestHeaders = filtered.Select(item => new
                {
                    item.Id,
                   VoucherNumber= item.psmsPurchaseOrderDetail.psmsPurchaseOrderHeader.VoucherNumber,
                    item.ATC,
                    item.psmsPurchaseOrderDetail.ItemId,
                    item.psmsPurchaseOrderDetail.UnitId,
                    Item = item.psmsPurchaseOrderDetail.ItemId.HasValue ? item.psmsPurchaseOrderDetail.psmsItem.Name : "",
                    item.Quantity,
                    SupplierId=item.psmsPurchaseOrderDetail.psmsPurchaseOrderHeader.SupplierId,
                    Supplier = item.psmsPurchaseOrderDetail.psmsPurchaseOrderHeader.psmsSupplier.Name ,
                    Date = item.psmsPurchaseOrderDetail.psmsPurchaseOrderHeader.OrderedDate,
                 

                }).ToList().Select(item => new
                {
                    item.Id,
                    VoucherNumber = item.VoucherNumber + item.Item,
                    item.Item,
                    item.ATC,
                    item.Quantity,
                    item.UnitId,
                    item.ItemId,
                    Supplier = item.Supplier,
                    item.SupplierId,
                    Date = item.Date.ToShortDateString(),
                  });
                return this.Direct(new { total = count, data = purchaserequestHeaders });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }
        public DirectResult GetAllHeaderCustomerBalance(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                var mode = hashtable["mode"] != null ? hashtable["mode"].ToString() : "";

                var deliveryList=_delivery.GetAll().AsQueryable();
                var filtered =_salesOrderDetail.GetAll().AsQueryable().Where(a=>a.slmsSalesHeader.StatusId==issuedVoucherStatus);
                var scheduleList = _freightOrder.GetAll().AsQueryable().Where(o => o.CustomerId.HasValue && o.psmsPurchaseOrderATCDetail.IsDelivered==false);
                filtered = SearchTransactionCustmerBalance(mode, hashtable, filtered);
                switch (sort)
                {
                    case "Id":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.Id) : filtered.OrderBy(u => u.Id);
                        break;
                    case "Customer":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.slmsSalesHeader.slmsCustomer.Name) : filtered.OrderBy(u => u.slmsSalesHeader.slmsCustomer.Name);
                        break;
                     case "Item":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.psmsItem.Name) : filtered.OrderBy(u =>  u.psmsItem.Name);
                        break;                  
                    default:
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.Id) : filtered.OrderBy(u => u.Id);
                        break;

                }
                var count = filtered.Count();
                filtered = filtered.Skip(start).Take(limit);
                var groupedFiltered = filtered.GroupBy(o => new { o.slmsSalesHeader.slmsCustomer, o.psmsItem });
                var salesOrderList = groupedFiltered.Select(item => new
                {
                    CustomerId=item.Key.slmsCustomer.Id,
                    Customer = item.Key.slmsCustomer.Name,
                    ItemId=item.Key.psmsItem.Id,
                    Item = item.Key.psmsItem.Name,
                    RemainingBalance = item.Sum(f=>f.SoldQuantity)-deliveryList.Where(a=>a.ItemId==item.Key.psmsItem.Id && a.CustomerId==item.Key.slmsCustomer.Id).Select(s=>s.Quantity).DefaultIfEmpty(0).Sum(),
                    ObjLastDelivery = deliveryList.Where(a => a.ItemId == item.Key.psmsItem.Id && a.CustomerId == item.Key.slmsCustomer.Id).OrderByDescending(o => o.Id).FirstOrDefault(),
                    ScheduledAmount = scheduleList.Where(a => a.ItemId == item.Key.psmsItem.Id && a.CustomerId == item.Key.slmsCustomer.Id).Select(a=>a.Quantity).DefaultIfEmpty(0).Sum(),

                }).ToList().Select(item => new
                {
                    item.CustomerId,
                    item.Customer,
                    item.RemainingBalance,
                    item.ItemId,
                    item.Item,
                    LastDeliveryDate = item.ObjLastDelivery!=null?item.ObjLastDelivery.Date.ToShortDateString():"",
                    ScheduledAmount=item.ScheduledAmount,
                    
                }).Where(o=>o.RemainingBalance>0).OrderBy(a=>a.Item);
                return this.Direct(new { total = count, data = salesOrderList });
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
                    _freightOrder.Delete(o => o.Id == id);
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
        public ActionResult Save(psmsFreightOrder freightOrderHeader)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var action = hashtable["action"].ToString();
                    var statusId = 0;                                     
                    var voucherNo = freightOrderHeader.VoucherNumber;
                    if (freightOrderHeader.Id == Guid.Empty)
                    {
                        freightOrderHeader.Id = Guid.NewGuid();
                        freightOrderHeader.CreatedAt = DateTime.Now;
                        freightOrderHeader.UpdatedAt = DateTime.Now;
                        CyberErp.Presentation.Psms.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Psms.Web.MvcApplication;
                        httpapplication.Application.Lock();
                        if (voucherNo == "Draft")
                        freightOrderHeader.VoucherNumber = _utils.GetVoucherNumber("Freight Order");
                        _freightOrder.AddNew(freightOrderHeader);
                        if (voucherNo=="Draft")
                        _utils.UpdateVoucherNumber("Freight Order");
                        httpapplication.Application.UnLock();
                        
                    }
                    else
                    {
                        freightOrderHeader.UpdatedAt = DateTime.Now;                       
                        _freightOrder.Edit(freightOrderHeader);
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


        #region Schedule
        public ActionResult GetSchedule(Guid id)
        {

            var objFreightOrder = _freightOrder.Get(o => o.Id == id);
            var freightOrder = new
            {
                objFreightOrder.Id,
                objFreightOrder.VoucherNumber,
                objFreightOrder.ATC,
                objFreightOrder.Quantity,
                objFreightOrder.CustomerId,
                Customer = objFreightOrder.CustomerId.HasValue ? objFreightOrder.slmsCustomer.Name : "",
                objFreightOrder.InvoiceNo,
                Date = objFreightOrder.Date.ToShortDateString(),

            };
            return this.Direct(new
            {
                success = true,
                data = freightOrder
            });
        }
        public DirectResult GetAllScheduleHeader(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                var mode = hashtable["mode"] != null ? hashtable["mode"].ToString() : "";
                var action = hashtable["action"] != null ? hashtable["action"].ToString() : "";


                var filtered = _freightOrder.GetAll().AsQueryable();
                if (action == "scheduled")
                {
                    filtered = filtered.Where(a => a.CustomerId.HasValue);            
                }
                else if (action == "for schedule")
                {
                    filtered = filtered.Where(a => !a.CustomerId.HasValue);
                }
                filtered = SearchTransaction(mode, hashtable, filtered);
                switch (sort)
                {
                    case "Id":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.Id) : filtered.OrderBy(u => u.Id);
                        break;
                    case "VoucherNumber":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.VoucherNumber) : filtered.OrderBy(u => u.VoucherNumber);
                        break;
                    case "Date":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.Date) : filtered.OrderBy(u => u.Date);
                        break;
                    case "ATC":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.ATC) : filtered.OrderBy(u => u.ATC);
                        break;
                    case "Customer":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.CustomerId.HasValue ? u.slmsCustomer.Name : "") : filtered.OrderBy(u => u.CustomerId.HasValue ? u.slmsCustomer.Name : "");
                        break;
                    case "Quantity":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.Quantity) : filtered.OrderBy(u => u.Quantity);
                        break;
                    case "CustomerTelephone":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.CustomerTelephone) : filtered.OrderBy(u => u.CustomerTelephone);
                        break;
                    case "Item":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => (u.PurchaseReqeustATCDetailId.HasValue ? u.psmsPurchaseOrderATCDetail.psmsPurchaseOrderDetail.psmsPurchaseOrderHeader.VoucherNumber : "") + " " + (u.ItemId.HasValue ? u.psmsItem.Name : "")) : filtered.OrderBy(u => (u.PurchaseReqeustATCDetailId.HasValue ? u.psmsPurchaseOrderATCDetail.psmsPurchaseOrderDetail.psmsPurchaseOrderHeader.VoucherNumber : "") + " " + (u.ItemId.HasValue ? u.psmsItem.Name : ""));
                        break;
                    case "InvoiceNo":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.InvoiceNo) : filtered.OrderBy(u => u.InvoiceNo);
                        break;
                   

                }
                var count = filtered.Count();
                filtered = filtered.Skip(start).Take(limit);

                var records = filtered.Select(item => new
                {
                    item.Id,
                    item.VoucherNumber,
                    item.ATC,
                    Item = (item.PurchaseReqeustATCDetailId.HasValue ? item.psmsPurchaseOrderATCDetail.psmsPurchaseOrderDetail.psmsPurchaseOrderHeader.VoucherNumber : "") + " " + (item.ItemId.HasValue ? item.psmsItem.Name : ""),
                    item.Quantity,
                    item.CustomerId,
                    item.CustomerTelephone,
                    Customer=item.CustomerId.HasValue?item.slmsCustomer.Name:"",
                    Date = item.Date,
                    item.InvoiceNo,


                }).ToList().Select(item => new
                {
                    item.Id,
                    item.VoucherNumber,
                    item.ATC,
                    Item=item.Item,
                    item.Quantity,
                    item.CustomerTelephone,
                    item.CustomerId,
                    Customer = item.Customer,
                    Date = item.Date.ToShortDateString(),
                    item.InvoiceNo,
                });
                return this.Direct(new { total = count, data = records });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }
        public DirectResult SaveSchedule(Guid id,Guid? customerId,string invoice,string CustomerTelephone,DateTime date)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                  var objRecord=  _freightOrder.Get(o => o.Id == id);
                      objRecord.CustomerId = customerId;
                      objRecord.InvoiceNo = invoice;
                      objRecord.Date=date;
                      objRecord.CustomerTelephone = CustomerTelephone;
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

        #endregion

        #region Methods
        private IQueryable<psmsFreightOrder> SearchTransaction(string mode, Hashtable ht, IQueryable<psmsFreightOrder> filtered)
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

                            (v.psmsSupplier.Name.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            (v.ATC.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            (v.DriverName.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            (v.DriverTelephone.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            (v.PlateNo.ToUpper().StartsWith(tSearchText.ToUpper())) ||                            
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
                        filtered = filtered.Where(v => v.Date >= transactionStartDate && v.Date <= transactionEndDate);
                    }
                    break;
            }
            return filtered;
        }
        private IQueryable<psmsPurchaseOrderATCDetail> SearchTransactionPurchaseATC(string mode, Hashtable ht, IQueryable<psmsPurchaseOrderATCDetail> filtered)
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
                        filtered = filtered.Where(v => v.psmsPurchaseOrderDetail.psmsPurchaseOrderHeader.VoucherNumber.Contains(referenceNo));
                    }
                    if (!string.IsNullOrEmpty(tSearchText))
                    {
                        filtered = filtered.Where(v =>


                            (v.psmsPurchaseOrderDetail.psmsPurchaseOrderHeader.psmsSupplier.Name.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            (v.psmsPurchaseOrderDetail.psmsItem.Name.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            (v.ATC.ToString().ToUpper().StartsWith(tSearchText.ToUpper()))                             );
                    }
                    if (!string.IsNullOrEmpty(status))
                    {
                        filtered = filtered.Where(v => v.psmsPurchaseOrderDetail.psmsPurchaseOrderHeader.lupVoucherStatus.Name.Contains(status));
                    }
                    if (!string.IsNullOrEmpty(startDate))
                    {
                        DateTime transactionStartDate, transactionEndDate;
                        DateTime.TryParse(startDate, out transactionStartDate);
                        DateTime.TryParse(endDate, out transactionEndDate);
                        filtered = filtered.Where(v => v.psmsPurchaseOrderDetail.psmsPurchaseOrderHeader.OrderedDate >= transactionStartDate && v.psmsPurchaseOrderDetail.psmsPurchaseOrderHeader.OrderedDate <= transactionEndDate);
                    }
                    break;
            }
            return filtered;
        }
        private IQueryable<slmsSalesDetail> SearchTransactionCustmerBalance(string mode, Hashtable ht, IQueryable<slmsSalesDetail> filtered)
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
                        filtered = filtered.Where(v => v.slmsSalesHeader.slmsCustomer.Name.ToUpper().StartsWith(tSearchText.ToUpper()));
                    }
                    if (!string.IsNullOrEmpty(tSearchText))
                    {
                        filtered = filtered.Where(v =>


                            (v.slmsSalesHeader.slmsCustomer.Name.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            (v.psmsItem.Name.ToUpper().StartsWith(tSearchText.ToUpper())));
                    }
                    if (!string.IsNullOrEmpty(status))
                    {
                        filtered = filtered.Where(v => v.slmsSalesHeader.lupVoucherStatus.Name.Contains(status));
                    }
                    if (!string.IsNullOrEmpty(startDate))
                    {
                        DateTime transactionStartDate, transactionEndDate;
                        DateTime.TryParse(startDate, out transactionStartDate);
                        DateTime.TryParse(endDate, out transactionEndDate);
                        filtered = filtered.Where(v => v.slmsSalesHeader.Date >= transactionStartDate &&  v.slmsSalesHeader.Date <= transactionEndDate);
                    }
                    break;
            }
            return filtered;
        }
 
        #endregion
    }
}
