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
    public class ProductionPlanDeliveryController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<PRProductionPlanDeliveryHeader> _productionPlanDeliveryHeader;
        private readonly BaseModel<PRProductionPlanDeliveryDetail> _productionPlanDeliveryDetail;
        private readonly BaseModel<PRProductionPlanDetail> _productionPlanDetail;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;

        private Utility _utils;
        Guid postedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Posted);

        private readonly Lookups _lookup;

        private Guid employeeId = Guid.Empty;
        private Guid currentVoucherTypeId = Guid.Empty;
        private Guid storeId = Guid.Empty;
        private bool isAutoIssue = false;
        Guid voidVoucherStatus = Guid.Parse(Constants.Voucher_Status_Void);

        #endregion

        #region Constructor

        public ProductionPlanDeliveryController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _productionPlanDeliveryHeader = new BaseModel<PRProductionPlanDeliveryHeader>(_context);
            _productionPlanDeliveryDetail = new BaseModel<PRProductionPlanDeliveryDetail>(_context);
            _utils = new Utility();
            _lookup = new Lookups(_context);
            _productionPlanDetail = new BaseModel<PRProductionPlanDetail>(_context);
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

            var objDelivery = _productionPlanDeliveryHeader.Get(o => o.Id == id);
            var records = new
            {
                objDelivery.Id,
                objDelivery.ProductionPlanHeaderId,
                objDelivery.AssignedId,
                Date=objDelivery.Date.Value.ToShortDateString(),
                objDelivery.Quantity,
                ProductionPlan = objDelivery.ProductionPlanHeaderId.HasValue ? objDelivery.PRProductionPlanHeader.VoucherNumber : "",                
                Assigned = objDelivery.AssignedId.HasValue ? objDelivery.coreUser.FirstName + " " + objDelivery.coreUser.LastName : "",               
                objDelivery.StatusId,
             //   Status=objDelivery.lupVoucherStatus.Name,
                objDelivery.CreatedAt
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

                var filtered = _productionPlanDeliveryHeader.GetAll().AsQueryable();
                if (type == "forProductionPlan")
                {
                    filtered = filtered.Where(o => o.PRProductionPlanDeliveryDetail.Where(f => f.RemainingQuantity > 0).Any());
                }
                filtered = SearchTransaction(mode, hashtable, filtered);
                switch (sort)
                {
                    case "Id":
                        filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.Id) : filtered.OrderBy(u => u.Id);
                        break;
                    case "ProductionPlan":
                        filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.ProductionPlanHeaderId.HasValue ? u.PRProductionPlanHeader.VoucherNumber : "") : filtered.OrderBy(u => u.ProductionPlanHeaderId.HasValue ? u.PRProductionPlanHeader.VoucherNumber : "");
                        break;
                    
                    case "Assigned":
                        filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.coreUser.FirstName + " " + u.coreUser.LastName) : filtered.OrderBy(u => u.coreUser.FirstName + " " + u.coreUser.LastName);
                        break;
                    case "Date":
                        filtered = dir == "DESC" ? filtered.OrderByDescending(u => u.Date) : filtered.OrderBy(u => u.Date);
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
                    item.ProductionPlanHeaderId,
                    item.AssignedId,
                    Date = item.Date,
                    item.Quantity,
                    ProductionPlan=item.ProductionPlanHeaderId.HasValue ? item.PRProductionPlanHeader.VoucherNumber : "",
                    Assigned = item.AssignedId.HasValue ? item.coreUser.FirstName + " " + item.coreUser.LastName : "",
                    item.StatusId,
                 //   Status=item.lupVoucherStatus.Name,
                    item.CreatedAt
                }).ToList().Select(item => new
                {
                    item.Id,
                    item.ProductionPlanHeaderId,
                    item.AssignedId,
                  //  item.Status,
                    item.ProductionPlan,
                    Date = item.Date.Value.ToShortDateString(),
                    item.Quantity,
                    Assigned =item.Assigned,
                    item.StatusId,
                    item.CreatedAt
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
                Guid voucherHeaderId; Guid storeId; Guid assignedId = Guid.Empty; string action = "";
                Guid.TryParse(hashtable["voucherHeaderId"].ToString(), out voucherHeaderId);
                action = hashtable["action"].ToString();
                 if (hashtable["assignedId"]!=null)
                     Guid.TryParse(hashtable["assignedId"].ToString(), out assignedId);
              
                List<object> records = new List<object>();
                if (action == "productionPlanDelivery")
                {
                    var recordLists = GetProductionOrderDetail(voucherHeaderId, assignedId);
                    var result = new { total = recordLists.Count, data = recordLists };
                    return this.Direct(result);
                }
                else
                {
                    var filtered = _productionPlanDeliveryDetail.GetAll().AsQueryable().Where(d => d.ProductionPlanDeliveryHeaderId == voucherHeaderId).OrderBy(o => o.Id);
                    var count = filtered.Count();
                    records = filtered.Select(item => new
                    {
                        item.Id,
                        item.ProductionPlanDeliveryHeaderId,
                        item.ProductionOrderDetailId,
                        ProductionOrder=item.PRProductionOrderDetail.PRProductionOrderHeader.VoucherNumber,
                        Name = item.PRProductionOrderDetail.psmsItem.Name,
                        MeasurementUnit = item.PRProductionOrderDetail.psmsItem.lupMeasurementUnit.Name,                      
                        item.PRProductionOrderDetail.ItemId,
                        Code =  item.PRProductionOrderDetail.psmsItem.Code,
                        item.Quantity,
                        item.PlanedQuantity,
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
                    var objHeader = _productionPlanDeliveryHeader.Get(o => o.Id == id);

                    
                    foreach (var objPRProductionPlanDeliveryDetail in objHeader.PRProductionPlanDeliveryDetail)
                    {
                        if (objHeader.ProductionPlanHeaderId.HasValue)
                            UpdateOrderDeliveryDetail(objHeader.ProductionPlanHeaderId.Value, objPRProductionPlanDeliveryDetail.ProductionOrderDetailId, -objPRProductionPlanDeliveryDetail.Quantity);

                    }
                    _productionPlanDeliveryDetail.Delete(o => o.ProductionPlanDeliveryHeaderId == id);
                    _productionPlanDeliveryHeader.Delete(o => o.Id == id);
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
        public ActionResult Save(PRProductionPlanDeliveryHeader productionPlanDeliveryHeader)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var requestPlanDeliveryDetailsString = hashtable["productionDeliveryDetails"].ToString();
                    var action = hashtable["action"].ToString();
                    var statusId = Guid.Empty;
                    statusId = productionPlanDeliveryHeader.StatusId;

                    if (productionPlanDeliveryHeader.Id == Guid.Empty)
                    {
                        productionPlanDeliveryHeader.Id = Guid.NewGuid();
                        productionPlanDeliveryHeader.CreatedAt = DateTime.Now;
                        productionPlanDeliveryHeader.UpdatedAt = DateTime.Now;
                        _productionPlanDeliveryHeader.AddNew(productionPlanDeliveryHeader);
                    }
                    else
                    {
                        productionPlanDeliveryHeader.UpdatedAt = DateTime.Now;
                        _productionPlanDeliveryHeader.Edit(productionPlanDeliveryHeader);
                    }

                    SavePRProductionPlanDeliveryDetail(productionPlanDeliveryHeader.Id, requestPlanDeliveryDetailsString, statusId, productionPlanDeliveryHeader.ProductionPlanHeaderId, action);

                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Direct(new { success = true, data = "Data has been added successfully!", ProductionPlanDeliveryHeaderId = productionPlanDeliveryHeader.Id });

                }
                catch (System.Exception ex)
                {
                    return this.Direct(new { success = false, data = ex.InnerException != null ? ex.InnerException.Message : ex.Message });
                }
            }
        }

        #endregion

        #region Methods
        private IList GetProductionOrderDetail(Guid voucherHeaderId, Guid assignedId)
        {
            var filtered = _productionPlanDetail.GetAll().AsQueryable().Where(d => d.ProductionPlanHeaderId == voucherHeaderId && d.AssignedId == assignedId).OrderBy(o => o.CreatedAt);

            var count = filtered.Count();

            var records = filtered.Select(item => new
            {
                 item.ProductionOrderDetailId,
                Name = item.PRProductionOrderDetail.psmsItem.Name,
                item.PRProductionOrderDetail.ItemId,
                Code = item.PRProductionOrderDetail.psmsItem.Code,
                Quantity = item.RemainingQuantity,
                PlanedQuantity = item.Quantity,
                RemainingQuantity=item.RemainingQuantity,
                item.Remark,
                ProductionOrder = item.PRProductionOrderDetail.PRProductionOrderHeader.VoucherNumber,
                 MeasurementUnit = item.PRProductionOrderDetail.psmsItem.lupMeasurementUnit.Name,
                      

            }).ToList().Where(o=>o.RemainingQuantity>0).ToList();


            return records;
        }

        public void SavePRProductionPlanDeliveryDetail(Guid productionPlanDeliveryHeaderId, string productionPlanDeliveryDetailsString, Guid statusId, Guid? salesPlanDeliveryId, string action)
        {
            productionPlanDeliveryDetailsString = productionPlanDeliveryDetailsString.Remove(productionPlanDeliveryDetailsString.Length - 1);
            IList<string> productionPlanDeliveryDetails = productionPlanDeliveryDetailsString.Split(new[] { ';' }).ToList();
            IList<PRProductionPlanDeliveryDetail> productionPlanDeliveryDetailList = new List<PRProductionPlanDeliveryDetail>();
            var oldsPRProductionPlanDeliveryDetailList = _productionPlanDeliveryDetail.GetAll().AsQueryable().Where(o => o.ProductionPlanDeliveryHeaderId == productionPlanDeliveryHeaderId).ToList();
            for (var i = 0; i < productionPlanDeliveryDetails.Count(); i++)
            {
                var productionPlanDeliveryDetail = productionPlanDeliveryDetails[i].Split(new[] { ':' });
                var productionPlanDeliveryDetailId = Guid.Empty;
                decimal quantity = 0;
                Guid.TryParse(productionPlanDeliveryDetail[0].ToString(), out productionPlanDeliveryDetailId);
                var objPRProductionPlanDeliveryDetail = productionPlanDeliveryDetailId != Guid.Empty ? oldsPRProductionPlanDeliveryDetailList.Where(o => o.Id == productionPlanDeliveryDetailId).FirstOrDefault() : new PRProductionPlanDeliveryDetail();
                quantity = objPRProductionPlanDeliveryDetail.Quantity;
                objPRProductionPlanDeliveryDetail.ProductionPlanDeliveryHeaderId = productionPlanDeliveryHeaderId;
                objPRProductionPlanDeliveryDetail.ProductionOrderDetailId = Guid.Parse(productionPlanDeliveryDetail[2]);
                objPRProductionPlanDeliveryDetail.Quantity = decimal.Parse(productionPlanDeliveryDetail[3]);
                objPRProductionPlanDeliveryDetail.PlanedQuantity = decimal.Parse(productionPlanDeliveryDetail[4]);
                objPRProductionPlanDeliveryDetail.RemainingQuantity = decimal.Parse(productionPlanDeliveryDetail[5]);
               
                objPRProductionPlanDeliveryDetail.UpdatedAt = DateTime.Now;
                if (productionPlanDeliveryDetailId == Guid.Empty)
                {
                    objPRProductionPlanDeliveryDetail.Id = Guid.NewGuid();
                    objPRProductionPlanDeliveryDetail.CreatedAt = DateTime.Now;
                    _productionPlanDeliveryDetail.AddNew(objPRProductionPlanDeliveryDetail);
                }
                if (salesPlanDeliveryId.HasValue)
                    UpdateOrderDeliveryDetail(salesPlanDeliveryId.Value, objPRProductionPlanDeliveryDetail.ProductionOrderDetailId, objPRProductionPlanDeliveryDetail.Quantity - quantity);
                productionPlanDeliveryDetailList.Add(objPRProductionPlanDeliveryDetail);
            }
            DeletePRProductionPlanDeliveryDetail(productionPlanDeliveryDetailList, oldsPRProductionPlanDeliveryDetailList, salesPlanDeliveryId);

        }
        private void DeletePRProductionPlanDeliveryDetail(IList<PRProductionPlanDeliveryDetail> productionPlanDeliveryDetailList, IList<PRProductionPlanDeliveryDetail> oldsPRProductionPlanDeliveryDetailList, Guid? productionPlanId)
        {
            foreach (var objoldsPRProductionPlanDeliveryDetail in oldsPRProductionPlanDeliveryDetailList)
            {
                var record = productionPlanDeliveryDetailList.Where(o => o.Id == objoldsPRProductionPlanDeliveryDetail.Id);

                if (record.Count() == 0)
                {
                    _productionPlanDeliveryDetail.Delete(o => o.Id == objoldsPRProductionPlanDeliveryDetail.Id);
                    if (productionPlanId.HasValue)
                        UpdateOrderDeliveryDetail(productionPlanId.Value, objoldsPRProductionPlanDeliveryDetail.ProductionOrderDetailId, -objoldsPRProductionPlanDeliveryDetail.Quantity);

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
        private void UpdateOrderDeliveryDetail(Guid productionPlanId, Guid orderDetailId, decimal quantity)
        {
            var objPlanDetail = _productionPlanDetail.GetAll().AsQueryable().Where(f => f.ProductionOrderDetailId == orderDetailId && f.ProductionPlanHeaderId == productionPlanId).FirstOrDefault();
            if (objPlanDetail != null)
            {
                objPlanDetail.RemainingQuantity = objPlanDetail.RemainingQuantity - quantity;
            }
        }

        private IQueryable<PRProductionPlanDeliveryHeader> SearchTransaction(string mode, Hashtable ht, IQueryable<PRProductionPlanDeliveryHeader> filtered)
        {
            switch (mode)
            {
                case "search":
                    var startDate = ht["startDate"].ToString();
                    var endDate = ht["endDate"].ToString();
                    var referenceNo = ht["referenceNo"].ToString();
                    var tSearchText = ht["tSearchText"].ToString();

                    var status = ht["status"].ToString();

                   

                    if (!string.IsNullOrEmpty(tSearchText))
                    {
                        filtered = filtered.Where(i => i.PRProductionPlanDeliveryDetail.Where(f =>
                            (f.PRProductionOrderDetail.psmsItem.Name.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            (f.PRProductionOrderDetail.PRProductionOrderHeader.VoucherNumber.ToUpper().StartsWith(tSearchText.ToUpper())) ||
                            (f.PRProductionOrderDetail.psmsItem.Code.ToUpper().StartsWith(tSearchText.ToUpper()))).Any() ||

                         (i.ProductionPlanHeaderId.HasValue?   i.PRProductionPlanHeader.VoucherNumber.ToUpper().Contains(tSearchText.ToUpper()):false) 
                          

                            );
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
