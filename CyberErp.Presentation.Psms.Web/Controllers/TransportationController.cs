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
    public class TransportationController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsTransportation> _transportation;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        private readonly BaseModel<psmsPurchaseOrderATCDetail> _purchaseOrderATCDetail;
                
         private Utility _utils;
         Guid postedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Posted);
         Guid certifiedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Certified);
         Guid approvedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Approved);
         Guid partiallyVoucherStatus = Guid.Parse(Constants.Voucher_Status_Partially_Approved);
         Guid rejectedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Rejected);
         Guid voidVoucherStatus = Guid.Parse(Constants.Voucher_Status_Void);
         Guid deliveryOrderVoucherType = Guid.Parse(Constants.Voucher_Type_DeliveryOrder);
   
        private readonly Lookups _lookup;
        private Guid employeeId = Guid.Empty;
        private string employeeName = "";
     
        #endregion

        #region Constructor

        public TransportationController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _transportation = new BaseModel<psmsTransportation>(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);
            _purchaseOrderATCDetail = new BaseModel<psmsPurchaseOrderATCDetail>(_context);
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

            var objTransportation = _transportation.Get(o => o.Id == id);
            var transportation = new
            {
                objTransportation.Id,
                objTransportation.VoucherNumber,
                objTransportation.FiscalYearId,
                objTransportation.ATC,
                objTransportation.UnitId,
                Unit=objTransportation.lupMeasurementUnit.Name,
                objTransportation.Quantity,
                objTransportation.IsOwnedVehicle,
                objTransportation.ItemId,
                Item=objTransportation.ItemId.HasValue?objTransportation.psmsItem.Name:"",
                objTransportation.DriverName,
                objTransportation.DriverTelephone,
                objTransportation.PlateNo,
                objTransportation.LicenseNo,
                objTransportation.ShipperName,
                objTransportation.ReceivedBy,
                objTransportation.PreparedById,
                objTransportation.Location,
                objTransportation.UnitCost,
                 objTransportation.SupplierId,
                 objTransportation.CustomerId,
                 Customer=objTransportation.CustomerId.HasValue?objTransportation.slmsCustomer.Name:"",
                Supplier=objTransportation.SupplierId.HasValue?objTransportation.psmsSupplier.Name:"",
                Date = objTransportation.Date.ToShortDateString(),              
                FiscalYear = objTransportation.coreFiscalYear.Name,
                objTransportation.StatusId,
                Status=objTransportation.lupVoucherStatus.Name,
                objTransportation.Remark,
                objTransportation.CreatedAt
            };
            return this.Direct(new
            {
                success = true,
                data = transportation
            });
        }
        public DirectResult GetAllHeader(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                var mode = hashtable["mode"] != null ? hashtable["mode"].ToString() : "";
            
          
                var filtered =_transportation.GetAll().AsQueryable();
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
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.slmsCustomer.Name) : filtered.OrderBy(u => u.slmsCustomer.Name);
                        break;   
                        case "Location":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.Location) : filtered.OrderBy(u => u.Location);
                        break;
                     case "Item":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.ItemId.HasValue ? u.psmsItem.Name : "") : filtered.OrderBy(u => u.ItemId.HasValue ? u.psmsItem.Name : "");
                        break;
                     case "IsOwnedVehicle":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.IsOwnedVehicle) : filtered.OrderBy(u => u.IsOwnedVehicle);
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
                    Customer = item.CustomerId.HasValue ? item.slmsCustomer.Name : "",
             
                    Date = item.Date,
                    FiscalYear = item.coreFiscalYear.Name,
                    Status=item.lupVoucherStatus.Name,
                    item.Remark,
                    item.CreatedAt,
                    Item = item.ItemId.HasValue ? item.psmsItem.Name : "",
                    item.IsOwnedVehicle,
                    item.Location,
                    item.UnitCost,
                  


   
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
                    item.Customer,
                    item.ReceivedBy,
                    item.PreparedById,
                    PreparedBy = item.PreparedBy,
                    Supplier = item.Supplier,
                    Date = item.Date.ToShortDateString(),
                    item.IsOwnedVehicle,
                    item.UnitCost,
                    item.Location,
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
                    _transportation.Delete(o => o.Id == id);
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
        public ActionResult Save(psmsTransportation transportationHeader)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var action = hashtable["action"].ToString();
                    var voucherNo = transportationHeader.VoucherNumber;

                    if (Request.Params["IsOwnedVehicle"] != null && Request.Params["IsOwnedVehicle"].ToString().Equals("on"))
                        transportationHeader.IsOwnedVehicle = true;
                    else
                        transportationHeader.IsOwnedVehicle = false;
             
                    if (transportationHeader.Id == Guid.Empty)
                    {
                        transportationHeader.Id = Guid.NewGuid();
                         transportationHeader.CreatedAt = DateTime.Now;
                        transportationHeader.UpdatedAt = DateTime.Now;
                         _transportation.AddNew(transportationHeader);                        
                    }
                    else
                    {
                        transportationHeader.UpdatedAt = DateTime.Now;                       
                        _transportation.Edit(transportationHeader);
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
        private IQueryable<psmsTransportation> SearchTransaction(string mode, Hashtable ht, IQueryable<psmsTransportation> filtered)
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
                            (v.CustomerId.HasValue? v.slmsCustomer.Name.ToUpper().StartsWith(tSearchText.ToUpper()):false) ||                         
                            (v.ATC.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            (v.DriverName.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            (v.DriverTelephone.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            (v.ShipperName.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            (v.Location.ToUpper().StartsWith(tSearchText.ToUpper())) ||
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
