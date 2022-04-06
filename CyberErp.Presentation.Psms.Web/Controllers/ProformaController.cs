using CyberErp.Data.Model;
using CyberErp.Presentation.Psms.Web.Classes;
using Ext.Direct.Mvc;
using Newtonsoft.Json;
using CyberErp.Business.Component.Psms;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Transactions;
namespace CyberErp.Presentation.Psms.Web.Controllers
{
    public class ProformaController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<slmsProformaHeader> _proformaHeader;
        private readonly BaseModel<slmsProformaDetail> _proformaDetail;
        private readonly Item _item;
        private readonly BaseModel<psmsStore> _store;
        private readonly InventoryRecord _inventoryRecord;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        private readonly BaseModel<coreUnit> _unit;
        private readonly ItemLOTTransaction _itemLOTTransaction;
        private readonly ItemSerialTransaction _itemSerialTransaction;
        private readonly BaseModel<psmsSetting> _setting;
        private readonly BaseModel<psmsTaxRate> _taxRate;
        private readonly Notification _notification;
        private readonly BaseModel<coreVoucherWorkFlow> _voucherWorkFlow;
        private readonly BaseModel<psmsApprover> _approver;
        private Utility _utils;
        Guid postedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Posted);

        Guid certifiedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Certified);
        Guid approvedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Approved);
        Guid partiallyVoucherStatus = Guid.Parse(Constants.Voucher_Status_Partially_Approved);
        Guid rejectedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Rejected);
        Guid voidVoucherStatus = Guid.Parse(Constants.Voucher_Status_Void);
        Guid proformaVoucherType = Guid.Parse(Constants.Voucher_Type_proforma);

        
        private readonly Lookups _lookup;
        
        private Guid employeeId = Guid.Empty;
        private Guid currentVoucherTypeId=Guid.Empty;
        private Guid storeId = Guid.Empty;
       
        #endregion
        
        #region Constructor

        public ProformaController()
        {
             _context = new ErpEntities(Constants.ConnectionString);
             _proformaHeader = new BaseModel<slmsProformaHeader>(_context);
             _proformaDetail = new BaseModel<slmsProformaDetail>(_context);
            _item = new Item(_context);
            _store = new BaseModel<psmsStore>(_context);
            _inventoryRecord = new InventoryRecord(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);
            _unit = new BaseModel<coreUnit>(_context);
            _itemLOTTransaction = new ItemLOTTransaction(_context);
            _itemSerialTransaction = new ItemSerialTransaction(_context);
            _setting = new BaseModel<psmsSetting>(_context);
            _taxRate = new BaseModel<psmsTaxRate>(_context);
            _notification = new Notification(_context);
            _voucherWorkFlow = new BaseModel<coreVoucherWorkFlow>(_context);
            _approver = new BaseModel<psmsApprover>(_context);
            _utils = new Utility();
            _lookup = new Lookups(_context);

        }

        #endregion

        #region Actions

        public ActionResult GetDocumentNo()
        {
            decimal vatRate = 0, withHoldingRate = 0;
         
            var taxRateList = _taxRate.GetAll();
            var objVatRate = taxRateList.Where(o => o.Name == Constants.vatRate_setting_Name).FirstOrDefault();
            var objWithHolding = taxRateList.Where(o => o.Name == Constants.withholding_setting_Name).FirstOrDefault();
            decimal.TryParse(objVatRate != null ? objVatRate.Rate.ToString() : "0", out vatRate);
            decimal.TryParse(objWithHolding != null ? objWithHolding.Rate.ToString() : "0", out withHoldingRate);
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
                FiscalYearId = _fiscalYear.GetAll().Where(o => o.IsActive == true && o.IsClosed == false).FirstOrDefault().Id,
                VatRate=vatRate,
                WithholdingRate=withHoldingRate,
                address = ""
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
           
            var objProforma = _proformaHeader.Get(o=>o.Id==id);
            var records = new
            {
                objProforma.Id,
                objProforma.VoucherNumber,
                objProforma.ReferenceNo,
                objProforma.FiscalYearId,
                objProforma.SalesAreaId,
                SalesArea=objProforma.slmsSalesArea.Name,           
                StoreId=objProforma.slmsSalesArea.StoreId,
                objProforma.PriceCategoryId,
                PriceCategory = objProforma.PriceCategoryId.HasValue ? objProforma.slmsPriceCategory.Name : "",           
                objProforma.CustomerId,
                Customer=objProforma.slmsCustomer.Name,
                objProforma.PaymentTerm,
                objProforma.DeliveryCondition,
                Date=objProforma.Date.ToShortDateString(),
                  objProforma.ApplyWithHolding,
                objProforma.TaxableAmount,
                objProforma.Tax,
                objProforma.WithHolding,
                objProforma.NetPay,
                objProforma.DiscountAmount,
                objProforma.PreparedById,
                objProforma.SalesPersonId,
                SalesPerson = objProforma.coreUser1.FirstName + " " + objProforma.coreUser1.LastName,
                objProforma.Remark,
                objProforma.StatusId,
                ValidityUntilDate= objProforma.ValidityUntilDate.HasValue?objProforma.ValidityUntilDate.Value.ToShortDateString():"",
                objProforma.BankInformation,
               objProforma.CreatedAt
            };          
            return this.Direct(new
            {
                success = true,
                data = records,
            });
        }
        public DirectResult GetAllHeader(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
                var mode =hashtable["mode"]!=null? hashtable["mode"].ToString():"";
                var LastWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == proformaVoucherType).OrderByDescending(o => o.Step).FirstOrDefault();
                var lastVoucherId = LastWorkFlow != null ? LastWorkFlow.VoucherStatusId : Guid.Empty;
          
                var filtered = _proformaHeader.GetAll().AsQueryable();
                filtered= SearchTransaction(mode, hashtable, filtered);
                switch (sort)
                {
                    case "Id":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.CreatedAt) : filtered.OrderBy(u => u.CreatedAt);
                        break;
                    case "VoucherNumber":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.VoucherNumber) : filtered.OrderBy(u => u.VoucherNumber);
                        break;
                    case "ReferenceNo":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.ReferenceNo) : filtered.OrderBy(u => u.ReferenceNo);
                        break;
                     case "SalesArea":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.slmsSalesArea.Name) : filtered.OrderBy(u => u.slmsSalesArea.Name);
                        break;
                        case "Date":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.Date) : filtered.OrderBy(u => u.Date);
                        break;
                        case "SalesPerson":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.coreUser1.FirstName + " " + u.coreUser1.LastName) : filtered.OrderBy(u => u.coreUser1.FirstName + " " + u.coreUser1.LastName);
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
                    item.ReferenceNo,
                    StoreId = item.slmsSalesArea.StoreId,
                    SalesArea=item.slmsSalesArea.Name,
                    Customer=item.slmsCustomer.Name,
                    Date=item.Date,
                    IsLastStep = lastVoucherId != Guid.Empty ? lastVoucherId == item.StatusId : true,
                
                    item.NetPay,
                    SalesPerson = item.coreUser1.FirstName + " " + item.coreUser1.LastName,
                    item.StatusId,
                    Status = item.lupVoucherStatus.Name,
                }).ToList().Select(item => new
                {
                    item.Id,
                    item.VoucherNumber,
                    item.ReferenceNo,
                    item.SalesArea,
                    item.Customer,
                    item.IsLastStep,
                    item.StoreId,
                    item.SalesPerson,
                    item.Status,
                    item.StatusId,
                    Date = item.Date.ToShortDateString(),
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
                Guid voucherHeaderId;Guid storeId;string action = "";
                Guid.TryParse(hashtable["voucherHeaderId"].ToString(), out voucherHeaderId);
                Guid.TryParse(hashtable["storeId"].ToString(), out storeId);
                action = hashtable["action"].ToString();
                var fiscalYearId = _fiscalYear.GetAll().Where(o => o.IsActive == true && o.IsClosed == false).FirstOrDefault().Id;        
                List<object> records = new List<object>();
             
                    var filtered = _proformaDetail.GetAll().AsQueryable().Where(d => d.ProformaHeaderId == voucherHeaderId).OrderBy(o => o.CreatedAt);
                    var count = filtered.Count();
                    records = filtered.Select(item => new
                    {
                        item.Id,
                        item.ProformaHeaderId,
                        Name = item.psmsItem.Name,
                        item.ItemId,
                        item.psmsItem.IsSerialItem,
                        item.psmsItem.IsLOTItem,
                        item.UnitId,
                        Code = item.ItemId != null ? item.psmsItem.Code : "",
                        item.StatusId,
                        item.UnitPrice,
                        item.IsTaxable,
                        item.PriceGroupId,
                       WithHoldingTax= item.WithholdableUnitPrice,
                        PriceGroup=item.PriceGroupId.HasValue? item.lupPriceGroup.Name:"",
                        Status = item.lupVoucherStatus.Name,
                        MeasurementUnit = item.UnitId != null ? item.lupMeasurementUnit.Name : item.psmsItem.lupMeasurementUnit.Name,
                        item.Quantity,
                        item.RemainingQuantity,
                        AvailableQuantity = item.psmsItem.psmsInventoryRecord.Where(o => o.StoreId == storeId && o.FiscalYearId == fiscalYearId).Select(f =>f.AvailableQuantity).DefaultIfEmpty(0).Sum(),
                        item.Remarks,
                    }).ToList().Cast<object>().ToList();
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
                    var objHeader = _proformaHeader.Get(o => o.Id == id);
                    storeId = objHeader.slmsSalesArea.StoreId.Value;
                    foreach(var objProformaDetail in objHeader.slmsProformaDetail)
                    {
                        objProformaDetail.StatusId = voidVoucherStatus;
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
        public ActionResult Save(slmsProformaHeader slmsProformaHeader)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    if (Request.Params["ApplyWithHolding"] != null && Request.Params["ApplyWithHolding"].ToString().Equals("on"))
                        slmsProformaHeader.ApplyWithHolding = true;
                    else
                        slmsProformaHeader.ApplyWithHolding = false;
         
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var requestOrderDetailsString = hashtable["proformaDetails"].ToString();
                    var action = hashtable["action"].ToString();
                    var statusId = Guid.Empty;
                    storeId =Guid.Parse( Request.Params["StoreId"]);
                    statusId = slmsProformaHeader.StatusId;                    
                    if (slmsProformaHeader.Id==Guid.Empty)
                    {
                        slmsProformaHeader.Id = Guid.NewGuid();
                      slmsProformaHeader.CreatedAt = DateTime.Now;
                      slmsProformaHeader.UpdatedAt = DateTime.Now;
                      CyberErp.Presentation.Psms.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Psms.Web.MvcApplication;
                      httpapplication.Application.Lock();
                        slmsProformaHeader.VoucherNumber = _utils.GetVoucherNumber("Proforma", storeId);
                      _proformaHeader.AddNew(slmsProformaHeader);
                      _utils.UpdateVoucherNumber("Proforma", storeId);
                      httpapplication.Application.UnLock();
                      UpdateStatus(slmsProformaHeader, action, storeId);           
                    }
                    else
                    {
                        slmsProformaHeader.UpdatedAt=DateTime.Now;
                        if (action == "revise")
                        {
                            _notification.VoidAllNotification(proformaVoucherType, slmsProformaHeader.Id);
                            slmsProformaHeader.StatusId = postedVoucherStatus;
                            UpdateStatus(slmsProformaHeader, action, storeId);

                        }
                        _proformaHeader.Edit(slmsProformaHeader);
                    }

                     SaveProformaDetail(slmsProformaHeader.Id, requestOrderDetailsString, statusId, action);
               
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
            var voucherWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == proformaVoucherType).OrderByDescending(o => o.Step);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == statusId).FirstOrDefault();
            if (currentStep == voucherWorkFlow.FirstOrDefault())
                returnValue = true;

            return returnValue;
        }
        private void UpdateStatus(slmsProformaHeader proformaHeader, string action, Guid? storeId)
        {
             var date = proformaHeader.Date.ToShortDateString();
            var title = "Proforma(" + proformaHeader.VoucherNumber + ")";
            var message = "A new  proforma has be added with voucher no  " + proformaHeader.VoucherNumber + "on date " + date + " \n ";
            var criteria = "";

            var voucherWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == proformaVoucherType);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == proformaHeader.StatusId).FirstOrDefault();
            if (currentStep == null)
                throw new System.InvalidOperationException("Please maintain authorization step for the voucher!");

            var nextStep = voucherWorkFlow.Where(o => o.Step == currentStep.Step + 1).FirstOrDefault();
            if (nextStep != null)
            {
                var approver = _approver.GetAll().AsQueryable().Where(o => o.VoucherTypeId == proformaVoucherType && o.StatusId == nextStep.VoucherStatusId && ((o.StoreId.HasValue ? o.StoreId == storeId : true)));
                if (approver.Count() > 0)
                {
                    string approverIds = "";
                    foreach (var objApprover in approver)
                    {
                        var status = _notification.CheckCriteria(criteria, objApprover.Criteria);
                        if (status == true)
                            approverIds = approverIds + objApprover.EmployeeId.ToString() + ",";
                    }
                    _notification.SaveNotification(title, message, proformaHeader.Id, proformaHeader.VoucherNumber, nextStep.VoucherStatusId, proformaVoucherType, approverIds, storeId, null, criteria);

                }
            }

        }
        public void SaveProformaDetail(Guid slmsProformaHeaderId, string proformaDetailsString, Guid statusId, string action)
        {
            proformaDetailsString = proformaDetailsString.Remove(proformaDetailsString.Length - 1);
            IList<string> proformaDetails = proformaDetailsString.Split(new[] { ';' }).ToList();
            IList<slmsProformaDetail> proformaDetailList = new List<slmsProformaDetail>();
            var oldsProformaDetailList =_proformaDetail.GetAll().AsQueryable().Where(o => o.ProformaHeaderId == slmsProformaHeaderId).ToList();
            Guid id = Guid.Empty; decimal amount = 0;
            for (var i = 0; i < proformaDetails.Count(); i++)
            {
                var proformaDetail = proformaDetails[i].Split(new[] { ':' });
                var proformaDetailId = Guid.Empty;
                var istTaxable = false;
                     
                Guid.TryParse(proformaDetail[0].ToString(), out proformaDetailId);
                var objProformaDetail = proformaDetailId != Guid.Empty ? oldsProformaDetailList.Where(o => o.Id == proformaDetailId).FirstOrDefault() : new slmsProformaDetail();
               
                objProformaDetail.ProformaHeaderId = slmsProformaHeaderId;
                objProformaDetail.ItemId = Guid.Parse(proformaDetail[2]);
                objProformaDetail.Quantity = decimal.Parse(proformaDetail[3]);
                objProformaDetail.RemainingQuantity = decimal.Parse(proformaDetail[3]);
                objProformaDetail.UnitId = Guid.Parse(proformaDetail[5]);
                objProformaDetail.UnitPrice = decimal.Parse(proformaDetail[6]);
                if (Guid.TryParse(proformaDetail[7], out id))
                    objProformaDetail.PriceGroupId = id;
                if (bool.TryParse(proformaDetail[8].ToString(), out istTaxable))
                    objProformaDetail.IsTaxable = istTaxable;
                if (decimal.TryParse(proformaDetail[9].ToString(), out amount))
                    objProformaDetail.WithholdableUnitPrice = amount;
              
                objProformaDetail.UpdatedAt = DateTime.Now;                
                if (proformaDetailId == Guid.Empty)
                {
                    objProformaDetail.Id = Guid.NewGuid();
                     objProformaDetail.CreatedAt = DateTime.Now;
                    objProformaDetail.StatusId = statusId;
                   _proformaDetail.AddNew(objProformaDetail);
                }
                
                 proformaDetailList.Add(objProformaDetail);
            }
            DeleteProformaDetail(proformaDetailList, oldsProformaDetailList);
           
        }
        private void DeleteProformaDetail(IList<slmsProformaDetail> proformaDetailList, IList<slmsProformaDetail> oldsProformaDetailList)
        {
            foreach (var objoldsProformaDetail in oldsProformaDetailList)
            {
                var record = proformaDetailList.Where(o => o.Id == objoldsProformaDetail.Id);

                if (record.Count() == 0)
                {
                    _proformaDetail.Delete(o => o.Id == objoldsProformaDetail.Id);
                }
            }
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
        private string getCurrentUser()
        {
            var user = "";
            var objUser = (coreUser)Session[Constants.CurrentUser];
            if (objUser != null && objUser.Id != null)
            {
                user = objUser.FirstName + " " + objUser.LastName;
            }
            return user;
        }
    
        private IQueryable<slmsProformaHeader> SearchTransaction(string mode, Hashtable ht, IQueryable<slmsProformaHeader> filtered)
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
                        filtered = filtered.Where(i => i.slmsProformaDetail.Where(f =>
                            (f.psmsItem.Name.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            ( f.psmsItem.Code.ToUpper().StartsWith(tSearchText.ToUpper()))).Any()||

                            i.VoucherNumber.ToUpper().Contains(tSearchText.ToUpper()) ||
                            i.ReferenceNo.ToUpper().Contains(tSearchText.ToUpper()) ||
                            i.slmsCustomer.Name.ToUpper().Contains(tSearchText.ToUpper()) ||                      
                            i.slmsSalesArea.Name.ToUpper().Contains(tSearchText.ToUpper()) ||
                            (i.coreUser1.FirstName + " " + i.coreUser1.LastName).ToUpper().Contains(tSearchText.ToUpper()) ||
                            (i.coreUser.FirstName + " " + i.coreUser.LastName).ToUpper().Contains(tSearchText.ToUpper()) ||
                     
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
        #endregion
    }
}
