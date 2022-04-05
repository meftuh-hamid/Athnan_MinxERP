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
namespace CyberErp.Presentation.Psms.Web.Controllers
{
    public class SalesController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<slmsSalesHeader> _salesHeader;
        private readonly BaseModel<slmsSalesDetail> _salesDetail;
        private readonly BaseModel<slmsProformaDetail> _proformaDetail;
        private readonly Item _item;
        private readonly BaseModel<psmsStore> _store;
        private readonly InventoryRecord _inventoryRecord;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        private readonly BaseModel<coreUnit> _unit;
        private readonly BaseModel<psmsSetting> _setting;
        private readonly BaseModel<psmsTaxRate> _taxRate;
        private readonly BaseModel<slmsSalesArea> _salesArea;
        private readonly Notification _notification;
        private readonly BaseModel<coreVoucherWorkFlow> _voucherWorkFlow;
        private readonly BaseModel<psmsApprover> _approver;
        private readonly BaseModel<slmsPriceCategory> _priceCategory;
        private readonly ItemLOTTransaction _itemLOTTransaction;
        private readonly ItemSerialTransaction _itemSerialTransaction;
     
        private Utility _utils;
        Guid postedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Posted);
        Guid issuedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Issued);
     
        Guid certifiedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Certified);
        Guid approvedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Approved);
        Guid authorizedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Authorized);    
        Guid partiallyVoucherStatus = Guid.Parse(Constants.Voucher_Status_Partially_Approved);
        Guid rejectedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Rejected);
        Guid voidVoucherStatus = Guid.Parse(Constants.Voucher_Status_Void);
        Guid salesVoucherType = Guid.Parse(Constants.Voucher_Type_sales);

      
        
        private readonly Lookups _lookup;
        
        private Guid employeeId = Guid.Empty;
        private Guid currentVoucherTypeId=Guid.Empty;
        private Guid storeId = Guid.Empty;
       
        #endregion
        
        #region Constructor

        public SalesController()
        {
             _context = new ErpEntities(Constants.ConnectionString);
             _salesHeader = new BaseModel<slmsSalesHeader>(_context);
             _salesDetail = new BaseModel<slmsSalesDetail>(_context);
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
            _salesArea = new BaseModel<slmsSalesArea>(_context);
            _notification = new Notification(_context);
            _voucherWorkFlow = new BaseModel<coreVoucherWorkFlow>(_context);
            _approver = new BaseModel<psmsApprover>(_context);
            _utils = new Utility();
            _lookup = new Lookups(_context);
            _priceCategory=new BaseModel<slmsPriceCategory>(_context);
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
           
            var objSales = _salesHeader.Get(o=>o.Id==id);
            var records = new
            {
                objSales.Id,
                objSales.VoucherNumber,
                objSales.ReferenceNo,
                objSales.FiscalYearId,
                objSales.SalesAreaId,
                SalesArea=objSales.slmsSalesArea.Name,
                StoreId=objSales.slmsSalesArea.StoreId,
                objSales.CustomerId,
                Customer=objSales.slmsCustomer.Name+"-"+objSales.slmsCustomer.Code,
                objSales.CheckNo,
                SalesType=objSales.lupSalesType.Name,
                objSales.SalesTypeId,
                objSales.TotalAmount,
                objSales.PriceCategoryId,
                PriceCategory=objSales.PriceCategoryId.HasValue?objSales.slmsPriceCategory.Name:"",
                Date=objSales.Date.ToShortDateString(),
                objSales.ApplyWithHolding,
                objSales.PaymentMethod,
                objSales.FsNo,
                objSales.ProformaHeaderId,
                ProformaNumber=objSales.ProformaHeaderId.HasValue?objSales.slmsProformaHeader.VoucherNumber:"",
                objSales.Tax,
                objSales.WithHolding,
                objSales.NetPay,
                objSales.DiscountAmount,
                objSales.PreparedById,
                objSales.SalesPersonId,
                SalesPerson=objSales.coreUser1.FirstName+" "+objSales.coreUser1.LastName,
                objSales.StatusId,
                objSales.Remark,
               objSales.CreatedAt
            };
            var serialList = _itemSerialTransaction.GetItemSerialTransactionList(objSales.Id, salesVoucherType);
            var lotList = _itemLOTTransaction.GetItemLOTList(objSales.Id, salesVoucherType);

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
                var mode =hashtable["mode"]!=null? hashtable["mode"].ToString():"";
                var LastWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == salesVoucherType).OrderByDescending(o => o.Step).FirstOrDefault();
                var lastVoucherId = LastWorkFlow != null ? LastWorkFlow.VoucherStatusId : Guid.Empty;
               var userId = Guid.Empty;
                var objUser = (coreUser)Session[Constants.CurrentUser];
                if (objUser != null && objUser.EmployeeId != null)
                {
                    employeeId = (Guid)objUser.EmployeeId;
                    userId = (Guid)objUser.Id;
                }

               var filtered = _salesHeader.GetAll().AsQueryable().Where(x =>x.slmsSalesArea.StoreId.HasValue? x.slmsSalesArea.psmsStore.psmsStorePermission.Any()? x.slmsSalesArea.psmsStore.psmsStorePermission.Where(f => f.UserId == userId).Any():true:true);
               
                filtered= SearchTransaction(mode, hashtable, filtered);
                switch (sort)
                {
                    case "Id":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.CreatedAt) : filtered.OrderBy(u => u.CreatedAt);
                        break;
                    case "VoucherNumber":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.VoucherNumber) : filtered.OrderBy(u => u.VoucherNumber);
                        break;
                    case "ProformaNumber":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.ProformaHeaderId.HasValue ? u.slmsProformaHeader.VoucherNumber : "") : filtered.OrderBy(u => u.ProformaHeaderId.HasValue ? u.slmsProformaHeader.VoucherNumber : "");
                        break;
                    case "ReferenceNo":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.ReferenceNo) : filtered.OrderBy(u => u.ReferenceNo);
                        break;
                     case "SalesArea":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.slmsSalesArea.Name) : filtered.OrderBy(u => u.slmsSalesArea.Name);
                        break;
                     case "Customer":
                        filtered = dir == "DSC" ? filtered.OrderByDescending(u => u.slmsCustomer.Name + " " + u.slmsCustomer.Code) : filtered.OrderBy(u => u.slmsCustomer.Name + " " + u.slmsCustomer.Code);
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
                    SalesType=item.lupSalesType.Name,
                    ProformaNumber =item.ProformaHeaderId.HasValue? item.slmsProformaHeader.VoucherNumber:"",
                    item.PaymentMethod,
                    StoreId = item.slmsSalesArea.StoreId,
                    SalesArea=item.slmsSalesArea.Name,
                    Customer = item.slmsCustomer.Name + "-" + item.slmsCustomer.Code,
                    IsLastStep = lastVoucherId != Guid.Empty ? lastVoucherId == item.StatusId : true,
                    item.FsNo,
                    Date=item.Date,
                    SalesPerson = item.coreUser1.FirstName + " " + item.coreUser1.LastName,
           
                    item.NetPay,
                    item.StatusId,
                    Status = item.lupVoucherStatus.Name,
                }).ToList().Select(item => new
                {
                    item.Id,
                    item.VoucherNumber,
                    item.ReferenceNo,
                    item.ProformaNumber,
                    item.SalesArea,
                    item.SalesType,
                    item.IsLastStep,
                    item.SalesPerson,
                    item.PaymentMethod,
                    item.Customer,
                    item.FsNo,
                    item.StoreId,
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
                Guid voucherHeaderId; Guid storeId; string action = "";
                Guid.TryParse(hashtable["voucherHeaderId"].ToString(), out voucherHeaderId);
                Guid.TryParse(hashtable["storeId"].ToString(), out storeId);
              
                action = hashtable["action"].ToString();
                var fiscalYearId = _fiscalYear.GetAll().Where(o => o.IsActive == true && o.IsClosed == false).FirstOrDefault().Id;
                if (action == "proforma")
                {
                    var records = GetProformaDetail(voucherHeaderId, storeId, fiscalYearId);
                    var result = new { total = records.Count, data = records };
                    return this.Direct(result);
                }
                else
                {
                    var filtered = _salesDetail.GetAll().AsQueryable().Where(d => d.SalesHeaderId == voucherHeaderId).OrderBy(o => o.CreatedAt);
                    var count = filtered.Count();
                   var records = filtered.Select(item => new
                    {
                        item.Id,
                        item.SalesHeaderId,
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
                        PriceGroup = item.lupPriceGroup.Name,                       
                        Status = item.lupVoucherStatus.Name,
                        MeasurementUnit = item.UnitId != null ? item.lupMeasurementUnit.Name : item.psmsItem.lupMeasurementUnit.Name,
                        item.Quantity,
                        item.RemainingQuantity,
                        AvailableQuantity = item.psmsItem.psmsInventoryRecord.Where(o => o.StoreId == storeId && o.FiscalYearId == fiscalYearId).Select(f => f.AvailableQuantity).DefaultIfEmpty(0).Sum(),
                        item.Remarks,
                    }).ToList().Cast<object>().ToList();
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
                    var objHeader = _salesHeader.Get(o => o.Id == id);                
                        storeId = objHeader.slmsSalesArea.StoreId.Value;
                        foreach(var objSalesDetail in objHeader.slmsSalesDetail)
                        {
                            if (objHeader.ProformaHeaderId != Guid.Empty && objHeader.ProformaHeaderId != null)
                                UpdateProformaDetail(objHeader.ProformaHeaderId.Value, objSalesDetail.ItemId,-objSalesDetail.Quantity);
                                objSalesDetail.StatusId = voidVoucherStatus;
                                if (objHeader.StatusId==issuedVoucherStatus)
                                UpdateInventoryFromVoidedT(objSalesDetail, storeId, objHeader.FiscalYearId, -objSalesDetail.Quantity, objHeader.VoucherNumber, objHeader.Date);
                        }
                        _itemSerialTransaction.VoidItemSerialTransaction(objHeader.Id, salesVoucherType,Guid.Empty, true);
                        _itemLOTTransaction.VoidItemLOTTransaction(objHeader.Id, salesVoucherType);
                      
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
        public ActionResult Save(slmsSalesHeader salesHeader)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    if (Request.Params["ApplyWithHolding"] != null && Request.Params["ApplyWithHolding"].ToString().Equals("on"))
                        salesHeader.ApplyWithHolding = true;
                    else
                        salesHeader.ApplyWithHolding = false;
         
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var requestOrderDetailsString = hashtable["salesDetails"].ToString();
                    var itemSerialsString =hashtable["itemSerials"]!=null? hashtable["itemSerials"].ToString():"";
                    var itemLOTsString =hashtable["itemLOTs"]!=null? hashtable["itemLOTs"].ToString():"";
                  
                    var action = hashtable["action"].ToString();
                    var statusId = Guid.Empty;
                    storeId =Guid.Parse( Request.Params["StoreId"]);
                    statusId = salesHeader.StatusId;
                    var voucherno = salesHeader.VoucherNumber;
                    if (salesHeader.Id==Guid.Empty)
                    {
                        salesHeader.Id = Guid.NewGuid();
                      salesHeader.CreatedAt = DateTime.Now;
                      salesHeader.UpdatedAt = DateTime.Now;
                      CyberErp.Presentation.Psms.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Psms.Web.MvcApplication;
                      httpapplication.Application.Lock();
                      if (voucherno=="Draft")
                          salesHeader.VoucherNumber = _utils.GetVoucherNumber("Sales Order", salesHeader.SalesAreaId);
                      _salesHeader.AddNew(salesHeader);
                      if (voucherno == "Draft")
                          _utils.UpdateVoucherNumber("Sales Order", salesHeader.SalesAreaId);
                      httpapplication.Application.UnLock();
                      UpdateStatus(salesHeader, action, storeId);
           
                    }
                    else
                    {
                        if (salesHeader.StatusId == issuedVoucherStatus && action == "revise")
                        {
                            return this.Direct(new { success = false, data = "you can not revise already issued Sales order" });

                        }

                        if (action == "revise")
                        {
                            _notification.VoidAllNotification(salesVoucherType, salesHeader.Id);

                            salesHeader.StatusId = postedVoucherStatus;
                            UpdateStatus(salesHeader, action, storeId);

                        }
                        salesHeader.UpdatedAt=DateTime.Now;
                        _salesHeader.Edit(salesHeader);
                    }
                    var isIssue = CheckStatus(salesHeader.StatusId);
                     if (action == "issue")
                     {
                         action = isIssue == true ? "issue" : "post";
                         salesHeader.StatusId = issuedVoucherStatus;

                     }
                     if (itemSerialsString != "") _itemSerialTransaction.AddItemSerialTransactions(salesHeader.Id,Guid.Empty, salesHeader.Date, salesVoucherType, salesHeader.VoucherNumber, itemSerialsString, action, true, false, false);
                     if (itemLOTsString != "") _itemLOTTransaction.AddItemLOTsTransaction(salesHeader.Id, salesVoucherType, salesHeader.VoucherNumber, itemLOTsString, action);
                                     
                    SaveSalesDetail(salesHeader, salesHeader.ProformaHeaderId, requestOrderDetailsString, statusId, action);
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
            var voucherWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == salesVoucherType).OrderByDescending(o => o.Step);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == statusId).FirstOrDefault();
            if (currentStep == voucherWorkFlow.FirstOrDefault())
                returnValue = true;

            return returnValue;
        }
        private void UpdateStatus(slmsSalesHeader salesHeader, string action, Guid? storeId)
        {
              decimal total = salesHeader.NetPay;
            var date = salesHeader.Date.ToShortDateString();
            var title = "Sales Order(" + salesHeader.VoucherNumber + ")";
            var message =  "A new  Sales Order has be added with voucher no  " + salesHeader.VoucherNumber + " on date " + date + " \n ";
            var criteria ="Total:" + total;

            var voucherWorkFlow = _voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == salesVoucherType);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == salesHeader.StatusId).FirstOrDefault();
            if (currentStep == null)
                throw new System.InvalidOperationException("Please maintain authorization step for the voucher!");

            var nextStep = voucherWorkFlow.Where(o => o.Step == currentStep.Step + 1).FirstOrDefault();
            if (nextStep != null)
            {
                var approver = _approver.GetAll().AsQueryable().Where(o => o.VoucherTypeId == salesVoucherType && o.StatusId == nextStep.VoucherStatusId && ((o.StoreId.HasValue ? o.StoreId == storeId : true)));
                if (approver.Count() > 0)
                {
                    string approverIds = "";
                    foreach (var objApprover in approver)
                    {
                        var status = _notification.CheckCriteria(criteria, objApprover.Criteria);
                        if (status == true)
                            approverIds = approverIds + objApprover.EmployeeId.ToString() + ",";
                    }
                    _notification.SaveNotification(title, message, salesHeader.Id, salesHeader.VoucherNumber, nextStep.VoucherStatusId, salesVoucherType, approverIds, storeId, null, criteria);

                }
            }
        }
        private IList GetProformaDetail(Guid voucherHeaderId, Guid storeId, Guid fiscalYearId)
        {
            var filtered =_proformaDetail.GetAll().AsQueryable().Where(d => d.ProformaHeaderId == voucherHeaderId).OrderBy(o => o.CreatedAt);
            
            var count = filtered.Count();

            var records = filtered.Select(item => new
            {
                item.ProformaHeaderId,
                Name = item.psmsItem.Name,
                item.ItemId,
                item.psmsItem.IsSerialItem,
                item.psmsItem.IsLOTItem,
                item.UnitId,
                Code = item.ItemId != null ? item.psmsItem.Code : "",
                item.StatusId,
                item.UnitPrice,
                item.PriceGroupId,
                item.IsTaxable,
                PriceGroup = item.lupPriceGroup.Name,
                Status = item.lupVoucherStatus.Name,
                MeasurementUnit = item.UnitId != null ? item.lupMeasurementUnit.Name : item.psmsItem.lupMeasurementUnit.Name,
                item.Quantity,
                item.RemainingQuantity,
                AvailableQuantity = item.psmsItem.psmsInventoryRecord.Where(o => o.StoreId == storeId && o.FiscalYearId == fiscalYearId).Select(f => f.AvailableQuantity).DefaultIfEmpty(0).Sum(),
                item.Remarks,

            }).Where(f => f.RemainingQuantity > 0).ToList();


            return records;
        }
        public void SaveSalesDetail(slmsSalesHeader salesHeader,Guid? proformaHeaderId, string salesDetailsString,Guid statusId, string action)
        {
            salesDetailsString = salesDetailsString.Remove(salesDetailsString.Length - 1);
            IList<string> salesDetails = salesDetailsString.Split(new[] { ';' }).ToList();
            IList<slmsSalesDetail> salesDetailList = new List<slmsSalesDetail>();
            var oldsSalesDetailList = _salesDetail.GetAll().AsQueryable().Where(o => o.SalesHeaderId == salesHeader.Id).ToList();
            var id = Guid.Empty;
            for (var i = 0; i < salesDetails.Count(); i++)
            {
                var salesDetail = salesDetails[i].Split(new[] { ':' });
                var salesDetailId = Guid.Empty;
                var istTaxable = false;
                Guid.TryParse(salesDetail[0].ToString(), out salesDetailId);
                var objSalesDetail = salesDetailId != Guid.Empty ? oldsSalesDetailList.Where(o => o.Id == salesDetailId).FirstOrDefault() : new slmsSalesDetail();
                decimal oldQuantity = objSalesDetail.Quantity;


                objSalesDetail.SalesHeaderId = salesHeader.Id;
                objSalesDetail.ItemId = Guid.Parse(salesDetail[2]);
                objSalesDetail.Quantity = decimal.Parse(salesDetail[3]);
                objSalesDetail.SoldQuantity = decimal.Parse(salesDetail[3]);
                objSalesDetail.RemainingQuantity = decimal.Parse(salesDetail[3]);
                objSalesDetail.UnitId = Guid.Parse(salesDetail[5]);
                objSalesDetail.UnitPrice = decimal.Parse(salesDetail[6]);
                if (Guid.TryParse( salesDetail[7],out id))
                {
                    if (id != Guid.Empty)
                        objSalesDetail.PriceGroupId = id;
            
                }
                if (bool.TryParse(salesDetail[8].ToString(),out istTaxable))
                    objSalesDetail.IsTaxable = istTaxable;
              
                objSalesDetail.UpdatedAt = DateTime.Now;                
                if (salesDetailId == Guid.Empty)
                {
                    objSalesDetail.Id = Guid.NewGuid();
                     objSalesDetail.CreatedAt = DateTime.Now;
                    objSalesDetail.StatusId = statusId;
                   _salesDetail.AddNew(objSalesDetail);
                }
                if (proformaHeaderId != Guid.Empty && proformaHeaderId!=null)
                    UpdateProformaDetail(proformaHeaderId.Value, objSalesDetail.ItemId, objSalesDetail.Quantity - oldQuantity);
                if (action == "issue")
                {
                    UpdateInventory(objSalesDetail,salesHeader.SalesAreaId,salesHeader.FiscalYearId, objSalesDetail.Quantity, salesHeader.VoucherNumber, salesHeader.Date);
                }
                 salesDetailList.Add(objSalesDetail);
            }
            DeleteSalesDetail(salesDetailList, oldsSalesDetailList, proformaHeaderId);
           
        }
        private void DeleteSalesDetail(IList<slmsSalesDetail> salesDetailList, IList<slmsSalesDetail> oldsSalesDetailList, Guid? proformaHeaderId)
        {
            foreach (var objoldsSalesDetail in oldsSalesDetailList)
            {
                var record = salesDetailList.Where(o => o.Id == objoldsSalesDetail.Id);

                if (record.Count() == 0)
                {
                    if (proformaHeaderId != Guid.Empty && proformaHeaderId != null)             
                    UpdateProformaDetail(objoldsSalesDetail.SalesHeaderId, objoldsSalesDetail.ItemId, -objoldsSalesDetail.Quantity);
                   _salesDetail.Delete(o => o.Id == objoldsSalesDetail.Id);
                }
            }
        }
        private void UpdateProformaDetail(Guid headerId, Guid itemId, decimal updateQuantity)
        {
            var objProformaDetail = _proformaDetail.GetAll().AsQueryable().Where(o => o.ProformaHeaderId == headerId && o.ItemId == itemId).FirstOrDefault();
            objProformaDetail.RemainingQuantity = objProformaDetail.RemainingQuantity - updateQuantity;

        }  
        private Guid getCurrentEmployee()
        {
          var objUser = (coreUser)Session[Constants.CurrentUser];
            if (objUser != null && objUser.EmployeeId != null)
            {
                employeeId = (Guid)objUser.EmployeeId;
            }
            return employeeId;
        }

        private string getCurrentUser()
        {
            var user="";
            var objUser = (coreUser)Session[Constants.CurrentUser];
            if (objUser != null && objUser.EmployeeId != null)
            {
                user = objUser.FirstName + " " + objUser.LastName;
            }
            return user;
        }
        private void UpdateInventory(slmsSalesDetail salesDetail, Guid salesAreaId, Guid fiscalYearId, decimal updateQuantity, string voucherNo, DateTime date)
        {
            var salesArea = _salesArea.Get(o => o.Id == salesAreaId);
            var model = new ParameterModel { VoucherId = salesDetail.SalesHeaderId, VoucherTypeId = salesVoucherType, VoucherNo = voucherNo, ItemId = salesDetail.ItemId, StoreId = salesArea.StoreId.Value, FiscalYearId = fiscalYearId, TransactionDate = date, Quantity =(double) salesDetail.Quantity, DamagedQuantity = 0,Remark="" };
            
            var unitCost = _inventoryRecord.IssueInventoryUpdate(model);
            salesDetail.UnitCost = unitCost;
        }
        private void UpdateInventoryFromVoidedT(slmsSalesDetail salesDetail, Guid storeId, Guid fiscalYearId, decimal updateQuantity, string voucherNo, DateTime date)
        {
            var model = new ParameterModel { VoucherId = salesDetail.SalesHeaderId, VoucherTypeId = salesVoucherType, VoucherNo = voucherNo, ItemId = salesDetail.ItemId, StoreId = storeId, FiscalYearId = fiscalYearId, TransactionDate = date, Quantity =(double) salesDetail.Quantity, DamagedQuantity = 0 };
         
            _inventoryRecord.IssueInventoryUpdateFromVoidedT(model);
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
                        filtered = filtered.Where(v =>v.ReferenceNo.Contains(referenceNo) || v.VoucherNumber.Contains(referenceNo));
                    }
                    if (!string.IsNullOrEmpty(tSearchText))
                    {
                        filtered = filtered.Where(i => i.slmsSalesDetail.Where(f =>
                            (f.psmsItem.Name.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            ( f.psmsItem.Code.ToUpper().StartsWith(tSearchText.ToUpper()))).Any()||

                            i.VoucherNumber.ToUpper().Contains(tSearchText.ToUpper()) ||
                            i.ReferenceNo.ToUpper().Contains(tSearchText.ToUpper()) ||
                            i.FsNo.ToUpper().Contains(tSearchText.ToUpper()) ||
                            i.slmsCustomer.Name.ToUpper().Contains(tSearchText.ToUpper()) || 
                            i.slmsSalesArea.Name.ToUpper().Contains(tSearchText.ToUpper()) ||
                            i.lupSalesType.Name.ToUpper().Contains(tSearchText.ToUpper()) ||
                            (i.ProformaHeaderId.HasValue?i.slmsProformaHeader.VoucherNumber.ToUpper().Contains(tSearchText.ToUpper()):false)||
                            (i.coreUser1.FirstName+" "+i.coreUser1.LastName) .ToUpper().Contains(tSearchText.ToUpper()) ||
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
        #endregion
    }
}
