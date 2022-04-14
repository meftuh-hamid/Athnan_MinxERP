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

namespace CyberErp.Presentation.Web.Psms.Controllers
{
    public class DeliveryController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsDelivery> _delivery;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        private readonly BaseModel<psmsPurchaseOrderATCDetail> _purchaseOrderATCDetail;
        private readonly InventoryRecord _inventoryRecord;
        private readonly BaseModel<psmsFreightOrder> _freightOrder;
                
         private Utility _utils;
         Guid postedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Posted);
         Guid certifiedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Certified);
         Guid approvedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Approved);
         Guid partiallyVoucherStatus = Guid.Parse(Constants.Voucher_Status_Partially_Approved);
         Guid rejectedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Rejected);
         Guid voidVoucherStatus = Guid.Parse(Constants.Voucher_Status_Void);
         Guid IssueVoucherType = Guid.Parse(Constants.Voucher_Type_StoreIssue);

        private readonly Lookups _lookup;
        private Guid employeeId = Guid.Empty;
        private string employeeName = "";
        private User _user;

        #endregion

        #region Constructor

        public DeliveryController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _delivery = new BaseModel<psmsDelivery>(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);
            _purchaseOrderATCDetail = new BaseModel<psmsPurchaseOrderATCDetail>(_context);
            _utils = new Utility();
            _lookup = new Lookups(_context);
            _inventoryRecord = new InventoryRecord(_context);
            _freightOrder = new BaseModel<psmsFreightOrder>(_context);
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

            var objDelivery = _delivery.Get(o => o.Id == id);
            var delivery = new
            {
                objDelivery.Id,
                objDelivery.VoucherNumber,
                objDelivery.FiscalYearId,
                objDelivery.ATC,
                objDelivery.UnitId,
                Unit=objDelivery.lupMeasurementUnit.Name,
                objDelivery.Quantity,
                objDelivery.FreightOrderId,
                objDelivery.ItemId,
                Item=objDelivery.ItemId.HasValue?objDelivery.psmsItem.Name:"",
                objDelivery.DriverName,
                objDelivery.DriverTelephone,
                objDelivery.PlateNo,
                objDelivery.LicenseNo,
                objDelivery.ShipperName,
                objDelivery.ReceivedBy,
                objDelivery.IsOwnedVehicle,
                objDelivery.PreparedById,
                objDelivery.CustomerId,
                Customer=objDelivery.CustomerId.HasValue?objDelivery.slmsCustomer.Name:"",
                objDelivery.InvoiceNo,
                objDelivery.CustomerTelephone,
                objDelivery.SupplierId,
                Supplier=objDelivery.SupplierId.HasValue?objDelivery.psmsSupplier.Name:"",
                Date = objDelivery.Date.ToShortDateString(),              
                FiscalYear = objDelivery.coreFiscalYear.Name,
                objDelivery.StatusId,
                Status=objDelivery.lupVoucherStatus.Name,
                objDelivery.Remark,
                objDelivery.CreatedAt
            };
            return this.Direct(new
            {
                success = true,
                data = delivery
            });
        }
        public DirectResult GetAllHeader(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                var mode = hashtable["mode"] != null ? hashtable["mode"].ToString() : "";
            
          
                var filtered =_delivery.GetAll().AsQueryable();
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
                       case "Customer":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.CustomerId.HasValue ? u.slmsCustomer.Name : "") : filtered.OrderBy(u => u.CustomerId.HasValue ? u.slmsCustomer.Name : "");
                        break;
                      case "CustomerTelephone":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.CustomerTelephone) : filtered.OrderBy(u => u.CustomerTelephone);
                        break;
                     case "Item":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.ItemId.HasValue ? u.psmsItem.Name : "") : filtered.OrderBy(u => u.ItemId.HasValue ? u.psmsItem.Name : "");
                        break;
                     case "InvoiceNo":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.InvoiceNo) : filtered.OrderBy(u => u.InvoiceNo);
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
                    item.IsOwnedVehicle,
                    item.CreatedAt,
                    Item = item.ItemId.HasValue ? item.psmsItem.Name : "",
                    item.CustomerId,
                    item.CustomerTelephone,
                    item.InvoiceNo,
                    Customer=item.CustomerId.HasValue?item.slmsCustomer.Name:"",
                  


   
                }).ToList().Select(item => new
                {
                    item.Id,
                    item.VoucherNumber,
                    item.ATC,
                    Unit = item.Unit,
                    item.Quantity,
                    item.DriverName,
                    item.DriverTelephone,
                    item.PlateNo,
                    item.LicenseNo,
                    item.ShipperName,
                    item.IsOwnedVehicle,
                    item.ReceivedBy,
                    item.PreparedById,
                    PreparedBy = item.PreparedBy,
                    Supplier = item.Supplier,
                    Date = item.Date.ToShortDateString(),
                    item.Customer,
                    item.InvoiceNo,
                    item.Item,
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
         
        public DirectResult Void(Guid id)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var header = _delivery.Get(o => o.Id == id);
                    UpdateInventoryFromVoidedT(header);
                   
                    _delivery.Delete(o => o.Id == id);
                    
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
        public ActionResult Save(psmsDelivery deliveryHeader)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                decimal odQuantity=0;
                try
                {
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var action = hashtable["action"].ToString();
                    var voucherNo = deliveryHeader.VoucherNumber;
                    if (Request.Params["IsOwnedVehicle"] != null && Request.Params["IsOwnedVehicle"].ToString().Equals("on"))
                        deliveryHeader.IsOwnedVehicle = true;
                    else
                        deliveryHeader.IsOwnedVehicle = false;
             
                    if (deliveryHeader.Id == Guid.Empty)
                    {
                        deliveryHeader.Id = Guid.NewGuid();
                         deliveryHeader.CreatedAt = DateTime.Now;
                        deliveryHeader.UpdatedAt = DateTime.Now;
                         _delivery.AddNew(deliveryHeader);                        
                    }
                    else
                    {
                        deliveryHeader.UpdatedAt = DateTime.Now;   
                         var header = _delivery.GetAll().AsQueryable().AsNoTracking().Where(o => o.Id == deliveryHeader.Id).FirstOrDefault();
                          odQuantity=header.Quantity.Value;
                        _delivery.Edit(deliveryHeader);
                    }
                    UpdateFreightOrder(deliveryHeader.ATC, deliveryHeader.CustomerId,deliveryHeader.InvoiceNo, deliveryHeader.Quantity.Value);
                    UpdateInventory(deliveryHeader,odQuantity);
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
        private void UpdateFreightOrder(string atc,Guid? customerId,string fs, decimal quantity)
        {
            var act1= double.Parse(atc);
            var record = _purchaseOrderATCDetail.GetAll().AsQueryable().Where(o => o.ATC == act1).FirstOrDefault();
            if(record!=null)
            {
                if(quantity<0)
                {
                    record.CustomerId = null;
                    record.InvoiceNo = "";
                    record.DeliveredQuantity = 0;
                    record.IsDelivered = false;
                }
                else
                {
                    record.CustomerId = customerId;
                    record.DeliveredQuantity = quantity;
                    record.InvoiceNo = fs;
                    record.IsDelivered = true;
                }
               
            }
        }
        private void UpdateInventory(psmsDelivery delivery,decimal oldquantity)
        {
            var freightOrder = _freightOrder.Get(a => a.Id == delivery.FreightOrderId);
            var model = new ParameterModel { VoucherId = delivery.Id, VoucherTypeId = IssueVoucherType, VoucherNo = delivery.VoucherNumber, ItemId = delivery.ItemId.Value, StoreId = freightOrder.psmsPurchaseOrderATCDetail.psmsPurchaseOrderDetail.psmsPurchaseOrderHeader.StoreId, FiscalYearId = delivery.FiscalYearId, TransactionDate = DateTime.Now, Quantity = (double)(delivery.Quantity.Value - oldquantity), DamagedQuantity = 0 };
            _inventoryRecord.DeliveryInventoryUpdate(model);          
        
        }
        private void UpdateInventoryFromVoidedT(psmsDelivery delivery)
        {
            var model = new ParameterModel { VoucherId = delivery.Id, VoucherTypeId = IssueVoucherType, VoucherNo = delivery.VoucherNumber, ItemId = delivery.ItemId.Value, StoreId = delivery.psmsFreightOrder.psmsPurchaseOrderATCDetail.psmsPurchaseOrderDetail.psmsPurchaseOrderHeader.StoreId, FiscalYearId = delivery.FiscalYearId, TransactionDate = DateTime.Now, Quantity = (double)(delivery.Quantity.Value ), DamagedQuantity = 0 };
            _inventoryRecord.DeliveryInventoryUpdateFromVoidedT(model);
        }  
        private IQueryable<psmsDelivery> SearchTransaction(string mode, Hashtable ht, IQueryable<psmsDelivery> filtered)
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
 
        #endregion
    }
}
