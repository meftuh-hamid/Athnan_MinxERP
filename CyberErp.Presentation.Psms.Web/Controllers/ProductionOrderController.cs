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
    public class ProductionOrderController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<PRProductionOrderHeader> _productionOrderHeader;
        private readonly BaseModel<PRProductionOrderDetail> _productionOrderDetail;
        private readonly BaseModel<slmsSalesDetail> _salesOrderDetail;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;

        private Utility _utils;
        Guid postedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Posted);

        Guid certifiedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Certified);
        Guid approvedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Approved);
        Guid partiallyVoucherStatus = Guid.Parse(Constants.Voucher_Status_Partially_Approved);
        Guid rejectedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Rejected);
        Guid voidVoucherStatus = Guid.Parse(Constants.Voucher_Status_Void);



        private readonly Lookups _lookup;

        private Guid employeeId = Guid.Empty;
        private Guid currentVoucherTypeId = Guid.Empty;
        private Guid storeId = Guid.Empty;
        private bool isAutoIssue = false;

        #endregion

        #region Constructor

        public ProductionOrderController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _productionOrderHeader = new BaseModel<PRProductionOrderHeader>(_context);
            _productionOrderDetail = new BaseModel<PRProductionOrderDetail>(_context);
            _utils = new Utility();
            _lookup = new Lookups(_context);
            _salesOrderDetail = new BaseModel<slmsSalesDetail>(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);
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
                FiscalYearId = _fiscalYear.GetAll().Where(o => o.IsActive == true && o.IsClosed == false).FirstOrDefault().Id,
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

            var objSales = _productionOrderHeader.Get(o => o.Id == id);
            var records = new
            {
                objSales.Id,
                objSales.VoucherNumber,
                objSales.ReferenceNo,
                objSales.FiscalYearId,
                objSales.SalesAreaId,
                objSales.StoreId,
                Store=objSales.StoreId.HasValue?objSales.psmsStore.Name:"",
                SalesArea = objSales.slmsSalesArea.Name,
                objSales.CustomerId,
                Customer = objSales.slmsCustomer.Name,
                Date = objSales.Date.ToShortDateString(),
                PromisedDate = objSales.PromisedDate.ToShortDateString(),
                objSales.SalesOrderId,
                objSales.PreparedById,
                objSales.StatusId,
                objSales.Remark,
                objSales.IsPosted,
                objSales.CreatedAt
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
                var mode = hashtable["mode"] != null ? hashtable["mode"].ToString() : "";
                var type = hashtable["type"] != null ? hashtable["type"].ToString() : "";
                var userId = Guid.Empty;
                var objUser = (coreUser)Session[Constants.CurrentUser];
                if (objUser != null && objUser.Id != null)
                {
                    employeeId = (Guid)objUser.Id;
                    userId = (Guid)objUser.Id;
                }

                var filtered = _productionOrderHeader.GetAll().AsQueryable().Where(x=> x.StoreId.HasValue ? x.psmsStore.psmsStorePermission.Where(f => f.UserId == userId).Any() :true);
                if (type == "forProductionPlan")
                {
                    filtered = filtered.Where(o => o.PRProductionOrderDetail.Where(f => f.RemainingQuantity > 0).Any());
                }
                filtered = SearchTransaction(mode, hashtable, filtered);
                switch (sort)
                {
                    case "Id":
                        filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.Id) : filtered.OrderBy(u => u.Id);
                        break;
                    case "VoucherNumber":
                        filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.VoucherNumber) : filtered.OrderBy(u => u.VoucherNumber);
                        break;
                    case "ReferenceNo":
                        filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.ReferenceNo) : filtered.OrderBy(u => u.ReferenceNo);
                        break;

                    case "SalesArea":
                        filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.slmsSalesArea.Name) : filtered.OrderBy(u => u.slmsSalesArea.Name);
                        break;
                    case "Cutomer":
                        filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.slmsCustomer.Name) : filtered.OrderBy(u => u.slmsCustomer.Name);
                        break;
                    case "PreparedBy":
                        filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.coreUser.FirstName + " " + u.coreUser.LastName) : filtered.OrderBy(u => u.coreUser.FirstName + " " + u.coreUser.LastName);
                        break;
                    case "Date":
                        filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.Date) : filtered.OrderBy(u => u.Date);
                        break;
                    case "PromisedDate":
                        filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.PromisedDate) : filtered.OrderBy(u => u.PromisedDate);
                        break;
                    default:
                        filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.Id) : filtered.OrderBy(u => u.Id);
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
                    SalesArea = item.slmsSalesArea.Name,
                    Customer = item.slmsCustomer.Name,
                    Store = item.StoreId.HasValue ? item.psmsStore.Name : "",              
                    Date = item.Date,
                    item.PromisedDate,
                     item.StatusId,
                    item.IsPosted,
                    Status = item.lupVoucherStatus.Name,
                    PreparedBy = item.coreUser.FirstName + " " + item.coreUser.LastName,
                }).ToList().Select(item => new
                {
                    item.Id,
                    item.VoucherNumber,
                    item.ReferenceNo,
                    item.SalesArea,
                    item.Customer,
                    item.Store,
                    item.StoreId,
                    item.Status,
                    item.StatusId,
                    Date = item.Date.ToShortDateString(),
                    PromisedDate = item.PromisedDate.ToShortDateString(),
                    item.PreparedBy,
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
                action = hashtable["action"].ToString();
                List<object> records = new List<object>();
                if (action == "salesOrder")
                {
                    var recordLists = GetslmsSalesDetail(voucherHeaderId);
                    var result = new { total = recordLists.Count, data = recordLists };
                    return this.Direct(result);
                }
                else
                {
                    var filtered = _productionOrderDetail.GetAll().AsQueryable().Where(d => d.ProductionOrderHeaderId == voucherHeaderId).OrderBy(o => o.Id);
                    var count = filtered.Count();
                    records = filtered.Select(item => new
                    {
                        item.Id,
                        item.ProductionOrderHeaderId,
                        Name = item.psmsItem.Name ,
                        item.ItemId,
                        item.psmsItem.IsSerialItem,
                        item.psmsItem.IsLOTItem,
                        item.UnitId,
                        ProductionCenter = item.psmsItem.psmsItemCategory.PRProductionCenter.Any() ? item.psmsItem.psmsItemCategory.PRProductionCenter.FirstOrDefault().coreUnit.Name : "",
                        Code = item.ItemId != null ? item.psmsItem.Code : "",
                        MeasurementUnit = item.UnitId != null ? item.lupMeasurementUnit.Name : item.psmsItem.lupMeasurementUnit.Name,
                        Quantity = action == "plan" ? item.RemainingQuantity : item.Quantity,
                        item.SoldQuantity,
                        item.RemainingQuantity,                      
                        item.Remark,
                    }).ToList().Where(o => action == "plan" ? o.RemainingQuantity > 0 : true).Cast<object>().ToList();
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
                    var objHeader = _productionOrderHeader.Get(o => o.Id == id);
                 
                    foreach (var objPRProductionOrderDetail in objHeader.PRProductionOrderDetail)
                    {
                        objPRProductionOrderDetail.UnitCost = 0;
                        if (objHeader.SalesOrderId.HasValue)
                            UpdateslmsSalesDetail(objHeader.SalesOrderId.Value, objPRProductionOrderDetail.ItemId.Value, -objPRProductionOrderDetail.Quantity);

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
        public ActionResult Save(PRProductionOrderHeader productionOrderHeader)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var requestOrderDetailsString = hashtable["productionOrderDetails"].ToString();
                    var action = hashtable["action"].ToString();
                    var statusId = Guid.Empty;
                    UpdateStatus(productionOrderHeader, action);
                    statusId = productionOrderHeader.StatusId;

                    if (productionOrderHeader.Id == Guid.Empty)
                    {
                        productionOrderHeader.Id = Guid.NewGuid();
                        productionOrderHeader.CreatedAt = DateTime.Now;
                        productionOrderHeader.UpdatedAt = DateTime.Now;
                        Presentation.Psms.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as Presentation.Psms.Web.MvcApplication;
                        httpapplication.Application.Lock();
                        productionOrderHeader.VoucherNumber = _utils.GetVoucherNumber("Production Order", productionOrderHeader.StoreId.Value);
                        _productionOrderHeader.AddNew(productionOrderHeader);
                        _utils.UpdateVoucherNumber("Production Order", productionOrderHeader.StoreId.Value);
                        httpapplication.Application.UnLock();
                    }
                    else
                    {
                        productionOrderHeader.UpdatedAt = DateTime.Now;
                        _productionOrderHeader.Edit(productionOrderHeader);
                    }
                    SavePRProductionOrderDetail(productionOrderHeader.Id, requestOrderDetailsString, statusId, productionOrderHeader.SalesAreaId, action);
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Direct(new { success = true, data = "Data has been added successfully!", ProductionOrderHeaderId = productionOrderHeader.Id });
                }
                catch (System.Exception ex)
                {
                    return this.Direct(new { success = false, data = ex.InnerException != null ? ex.InnerException.Message : ex.Message });
                }
            }
        }

        #endregion

        #region Methods
        private void UpdateStatus(PRProductionOrderHeader productionOrderHeader, string action)
        {
            if (action == "certify" || action == "allAtOnce")
            {
                productionOrderHeader.StatusId = certifiedVoucherStatus;
            }
            if (action == "approve" || action == "allAtOnce")
            {
                productionOrderHeader.StatusId = approvedVoucherStatus;
            }

        }
        private IList GetslmsSalesDetail(Guid voucherHeaderId)
        {
            var filtered = _salesOrderDetail.GetAll().AsQueryable().Where(d => d.SalesHeaderId == voucherHeaderId).OrderBy(o => o.CreatedAt);

            var count = filtered.Count();

            var records = filtered.Select(item => new
            {
                item.SalesHeaderId,
                Name = item.psmsItem.Name,
                item.ItemId,
                item.psmsItem.IsSerialItem,
                item.psmsItem.IsLOTItem,
                item.UnitId,
                Code = item.ItemId != null ? item.psmsItem.Code : "",
                item.StatusId,
                item.UnitPrice,
                item.PriceGroupId,
                Status = item.lupVoucherStatus.Name,
                MeasurementUnit = item.UnitId != null ? item.lupMeasurementUnit.Name : item.psmsItem.lupMeasurementUnit.Name,
                Quantity = item.RemainingQuantity,
                RemainingQuantity = item.RemainingQuantity,
                SoldQuantity = item.SoldQuantity,
                item.Remarks,

            }).ToList();


            return records;
        }

        public void SavePRProductionOrderDetail(Guid productionOrderHeaderId, string productionOrderDetailsString, Guid statusId, Guid? salesOrderId, string action)
        {
            productionOrderDetailsString = productionOrderDetailsString.Remove(productionOrderDetailsString.Length - 1);
            IList<string> productionOrderDetails = productionOrderDetailsString.Split(new[] { ';' }).ToList();
            IList<PRProductionOrderDetail> productionOrderDetailList = new List<PRProductionOrderDetail>();
            var oldsPRProductionOrderDetailList = _productionOrderDetail.GetAll().AsQueryable().Where(o => o.ProductionOrderHeaderId == productionOrderHeaderId).ToList();
            for (var i = 0; i < productionOrderDetails.Count(); i++)
            {
                var productionOrderDetail = productionOrderDetails[i].Split(new[] { ':' });
                var productionOrderDetailId = Guid.Empty;
                decimal quantity = 0;
                Guid.TryParse(productionOrderDetail[0].ToString(), out productionOrderDetailId);
                var objPRProductionOrderDetail = productionOrderDetailId != Guid.Empty ? oldsPRProductionOrderDetailList.Where(o => o.Id == productionOrderDetailId).FirstOrDefault() : new PRProductionOrderDetail();
                quantity = objPRProductionOrderDetail.Quantity;
                objPRProductionOrderDetail.ProductionOrderHeaderId = productionOrderHeaderId;
                objPRProductionOrderDetail.ItemId = Guid.Parse(productionOrderDetail[2]);
                objPRProductionOrderDetail.Quantity = decimal.Parse(productionOrderDetail[3]);
                objPRProductionOrderDetail.SoldQuantity = decimal.Parse(productionOrderDetail[4]);
                objPRProductionOrderDetail.RemainingQuantity = decimal.Parse(productionOrderDetail[5]);
                objPRProductionOrderDetail.UnitId = Guid.Parse(productionOrderDetail[6]);

                objPRProductionOrderDetail.UpdatedAt = DateTime.Now;
                if (productionOrderDetailId == Guid.Empty)
                {
                    objPRProductionOrderDetail.Id = Guid.NewGuid();
                    objPRProductionOrderDetail.CreatedAt = DateTime.Now;
                    _productionOrderDetail.AddNew(objPRProductionOrderDetail);
                }
                if (salesOrderId.HasValue)
                    UpdateslmsSalesDetail(salesOrderId.Value, objPRProductionOrderDetail.ItemId.Value, objPRProductionOrderDetail.Quantity - quantity);
                productionOrderDetailList.Add(objPRProductionOrderDetail);
            }
            DeletePRProductionOrderDetail(productionOrderDetailList, oldsPRProductionOrderDetailList, salesOrderId);

        }
        private void DeletePRProductionOrderDetail(IList<PRProductionOrderDetail> productionOrderDetailList, IList<PRProductionOrderDetail> oldsPRProductionOrderDetailList, Guid? salesOrderId)
        {
            foreach (var objoldsPRProductionOrderDetail in oldsPRProductionOrderDetailList)
            {
                var record = productionOrderDetailList.Where(o => o.Id == objoldsPRProductionOrderDetail.Id);

                if (record.Count() == 0)
                {
                    _productionOrderDetail.Delete(o => o.Id == objoldsPRProductionOrderDetail.Id);
                    if (salesOrderId.HasValue)
                        UpdateslmsSalesDetail(salesOrderId.Value, objoldsPRProductionOrderDetail.ItemId.Value, -objoldsPRProductionOrderDetail.Quantity);

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
        private void UpdateslmsSalesDetail(Guid salesOrderId, Guid itemId, decimal quantity)
        {
            var objslmsSalesDetail = _salesOrderDetail.GetAll().AsQueryable().Where(f => f.ItemId == itemId && f.SalesHeaderId == salesOrderId).FirstOrDefault();
            if (objslmsSalesDetail != null)
            {
                objslmsSalesDetail.RemainingQuantity = objslmsSalesDetail.RemainingQuantity - quantity;
            }
        }

        private IQueryable<PRProductionOrderHeader> SearchTransaction(string mode, Hashtable ht, IQueryable<PRProductionOrderHeader> filtered)
        {
            switch (mode)
            {
                case "search":
                    var startDate = ht["startDate"].ToString();
                    var endDate = ht["endDate"].ToString();
                    var referenceNo = ht["referenceNo"].ToString();
                    //var fsn = ht["FsNo"].ToString();
                    var tSearchText = ht["tSearchText"].ToString();

                    var status = ht["status"].ToString();

                    if (!string.IsNullOrEmpty(referenceNo))
                    {
                        filtered = filtered.Where(v => v.ReferenceNo.Contains(referenceNo) || v.VoucherNumber.Contains(referenceNo));
                    }

                    if (!string.IsNullOrEmpty(tSearchText))
                    {
                        filtered = filtered.Where(i => i.PRProductionOrderDetail.Where(f =>
                            (f.psmsItem.Name.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            (f.psmsItem.Code.ToUpper().StartsWith(tSearchText.ToUpper()))).Any() ||

                            i.VoucherNumber.ToUpper().Contains(tSearchText.ToUpper()) ||
                            i.ReferenceNo.ToUpper().Contains(tSearchText.ToUpper()) ||
                            i.slmsSalesArea.Name.ToUpper().Contains(tSearchText.ToUpper()) ||
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
