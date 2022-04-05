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
using Presentation.Psms.Web.Classes;
using System.IO;

namespace CyberErp.Presentation.Psms.Web.Controllers
{
    public class ProductionPlanController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<PRProductionOrderHeader> _productionOrderHeader;
        private readonly BaseModel<PRProductionOrderDetail> _productionOrderDetail;
        private readonly BaseModel<PRProductionPlanHeader> _ProductionPlanHeader;
        private readonly BaseModel<PRProductionPlanDetail> _ProductionPlanDetail;
      
        private readonly BaseModel<PRBillofMaterialHeader> _BillofMaterialHeader;
        private readonly BaseModel<PRBillofMaterialDetail> _BillofMaterialDetail;
        private readonly BaseModel<PRBillofMaterialOperationDetail> _BillofMaterialOperationDetail;
        private readonly BaseModel<PRProductionPlanJobCardDetail> _productionPlanJobCardDetail;
        private readonly BaseModel<PRProductionPlanJobCardTeamDetail> _productionPlanJobCardTeamDetail;
        private readonly BaseModel<PRProductionPlanBOMDetail> _productionPlanBOMDetail;
        private readonly BaseModel<PRProductionPlanJobCardResultDetail> _resultDetail;
        private readonly BaseModel<psmsIssueDetail> _issue;
        Utility _utils;
        Guid postedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Posted);
        Guid certifiedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Certified);
        Guid approvedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Approved);
        Guid partiallyVoucherStatus = Guid.Parse(Constants.Voucher_Status_Partially_Approved);
        Guid rejectedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Rejected);
        Guid voidVoucherStatus = Guid.Parse(Constants.Voucher_Status_Void);
        private Guid employeeId = Guid.Empty;
        private readonly Lookups _lookup;
        Guid orderVoucherStatus = Guid.Parse(Constants.Voucher_Status_Ordered);
        Guid finalVoucherStatus = Guid.Parse(Constants.Voucher_Status_Final_Approved);
        Guid receiveVoucherStatus = Guid.Parse(Constants.Voucher_Status_Receive);
        Guid issueVoucherStatus = Guid.Parse(Constants.Voucher_Status_Issued);

        #endregion

        #region Constructor

        public ProductionPlanController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
             _utils = new Utility();
            _BillofMaterialHeader = new BaseModel<PRBillofMaterialHeader>(_context);
            _BillofMaterialDetail = new BaseModel<PRBillofMaterialDetail>(_context);
            _BillofMaterialOperationDetail = new BaseModel<PRBillofMaterialOperationDetail>(_context);
            _productionOrderHeader = new BaseModel<PRProductionOrderHeader>(_context);
            _ProductionPlanHeader = new BaseModel<PRProductionPlanHeader>(_context);
            _ProductionPlanDetail = new BaseModel<PRProductionPlanDetail>(_context);
            _productionPlanJobCardDetail = new BaseModel<PRProductionPlanJobCardDetail>(_context);
            _productionPlanBOMDetail = new BaseModel<PRProductionPlanBOMDetail>(_context);
            _productionOrderDetail = new BaseModel<PRProductionOrderDetail>(_context);
            _productionPlanJobCardTeamDetail = new BaseModel<PRProductionPlanJobCardTeamDetail>(_context);
            _issue = new BaseModel<psmsIssueDetail>(_context);
            _resultDetail = new BaseModel<PRProductionPlanJobCardResultDetail>(_context);
        }

        #endregion

        #region Actions
        #region Plan
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
             };
            var result = new
            {
                total = 1,
                data = Constantsfields
            };
            return this.Direct(result);
        }
        public ActionResult Get(Guid ids)
        {
            var productionPlan =_ProductionPlanHeader.Get(o => o.Id == ids);
            var item =productionPlan!=null? new
            {
                productionPlan.Id,
                productionPlan.VoucherNumber,
                PlanStartDate = productionPlan.PlanStartDate.HasValue ? productionPlan.PlanStartDate.Value.ToShortDateString() : "",
                PlanEndDate = productionPlan.PlanEndDate.HasValue ? productionPlan.PlanEndDate.Value.ToShortDateString() : "",           
                productionPlan.Interval,
                productionPlan.ActualOperatingCost,
                productionPlan.PlanStartTime,
                productionPlan.PlanEndTime,
                productionPlan.PlannedOperatingCost,
                productionPlan.AdditionalCost,                            
                productionPlan.MaterialCost,
                productionPlan.TotalCost,
                productionPlan.StatusId,
                productionPlan.PreparedById,
                PreparedBy= productionPlan.PreparedById.HasValue?productionPlan.coreUser.FirstName+" "+productionPlan.coreUser.LastName:"",
                Status = productionPlan.lupVoucherStatus.Name,
                productionPlan.Remark,
                productionPlan.CreatedAt
                
            }:null;
            return this.Direct(new
            {
                success = true,
                data = item
            });
        }
        public ActionResult GetAllHeader(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
            var action = hashtable["action"] != null ? hashtable["action"].ToString() : "";
             var employeeId = getCurrentEmployee();
            var userId = Guid.Empty;
            var objUser = (coreUser)Session[Constants.CurrentUser];
            if (objUser != null && objUser.Id != null)
            {
                employeeId = (Guid)objUser.Id;
                userId = (Guid)objUser.Id;
            }

            var filtered = _ProductionPlanHeader.GetAll().AsQueryable().Where(o => o.StatusId != voidVoucherStatus).Where(x => x.PRProductionPlanDetail.Where(z => z.PRProductionOrderDetail.PRProductionOrderHeader.StoreId.HasValue ? z.PRProductionOrderDetail.PRProductionOrderHeader.psmsStore.psmsStorePermission.Where(f => f.UserId == userId).Any() :true).Any());
          
            if (action == "jobCard")
            {
                filtered = filtered.Where(f => f.PreparedById == employeeId || f.PRProductionPlanDetail.Where(a => a.AssignedId == employeeId).Any());            
            }
            filtered = searchText != "" ? filtered.Where(i =>

                i.VoucherNumber.ToUpper().Contains(searchText.ToUpper()) ||
                (i.PreparedById.HasValue ? (i.coreUser.FirstName + " " + i.coreUser.LastName).ToUpper().Contains(searchText.ToUpper()):false) ||
                i.lupVoucherStatus.Name.ToUpper().Contains(searchText.ToUpper()))
                : filtered;
            switch (sort)
            {
                 case "VoucherNumber":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.VoucherNumber) : filtered.OrderByDescending(u => u.VoucherNumber);
                    break;
                case "PreparedBy":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.PreparedById.HasValue ? u.coreUser.FirstName + " " + u.coreUser.LastName : "") : filtered.OrderByDescending(u => u.PreparedById.HasValue ? u.coreUser.FirstName + " " + u.coreUser.LastName : "");
                    break;
                case "lupVoucherStatus":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.PlanStartDate) : filtered.OrderByDescending(u => u.lupVoucherStatus);
                    break;
                case "PlanEndDate":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.PlanEndDate) : filtered.OrderByDescending(u => u.PlanEndDate);
                    break;
                case "Status":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.lupVoucherStatus.Name) : filtered.OrderByDescending(u => u.lupVoucherStatus.Name);
                    break;
                case "Remark":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Remark) : filtered.OrderByDescending(u => u.Remark);
                    break;
                default:
                    filtered = dir == "ASC" ? filtered.OrderByDescending(u => u.Id) : filtered.OrderBy(u => u.Id);
                    break;
            }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);

            var records = filtered.ToList().Select(item => new
            {
                item.Id,
                item.VoucherNumber,
                PlanStartDate = item.PlanStartDate.HasValue ? item.PlanStartDate.Value.ToShortDateString() : "",
                PlanEndDate = item.PlanEndDate.HasValue ? item.PlanEndDate.Value.ToShortDateString() : "",
                item.PlanStartTime,
                item.PlanEndTime,
                item.Interval,
                PreparedBy = item.PreparedById.HasValue ? item.coreUser.FirstName + " " + item.coreUser.LastName : "",                
                item.ActualOperatingCost,
                item.PlannedOperatingCost,
                item.AdditionalCost,
                item.MaterialCost,
                item.TotalCost,
                item.StatusId,
                Status = item.lupVoucherStatus.Name,
                item.Remark,
                item.CreatedAt

            }).ToList();
            var result = new
            {
                total = count,
                data = records
            };
            return this.Direct(result);
        }
        public DirectResult GetAllDetail(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                Guid voucherHeaderId;
                Guid.TryParse(hashtable["voucherHeaderId"].ToString(), out voucherHeaderId);
              
                    var filtered = _ProductionPlanDetail.GetAll().AsQueryable().Where(d => d.ProductionPlanHeaderId == voucherHeaderId).OrderBy(o => o.Id);
                    var count = filtered.Count();
                    var records = filtered.Select(item => new
                    {
                        item.Id,
                        item.ProductionPlanHeaderId,
                        item.ProductionOrderDetailId,
                        Name=item.PRProductionOrderDetail.psmsItem.Name,
                        Code = item.PRProductionOrderDetail.psmsItem.Code,
                         item.AssignedId,
                        ProductionCenter = item.PRProductionOrderDetail.psmsItem.psmsItemCategory.PRProductionCenter.Any() ? item.PRProductionOrderDetail.psmsItem.psmsItemCategory.PRProductionCenter.FirstOrDefault().coreUnit.Name : "",
                        Assigned = item.AssignedId.HasValue ? item.coreUser.FirstName + " " + item.coreUser.LastName: "",                                         
                        item.Quantity,
                        item.RemainingQuantity,
                        item.Remark
                    }).ToList().Cast<object>().ToList();
                    var result = new { total = count, data = records };
                    return this.Direct(result);
                }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }

        public DirectResult GetAllStatusDetail(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                  var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
                var startDate = hashtable["startDate"] != null ? hashtable["startDate"].ToString() : "";
                var endDate = hashtable["endDate"] != null ? hashtable["endDate"].ToString() : "";
                var status = hashtable["status"] != null && hashtable["status"] != "" ? Guid.Parse(hashtable["status"].ToString()) : Guid.Empty;
                var filtered = _ProductionPlanDetail.GetAll().AsQueryable();
                var employeeId = getCurrentEmployee();
                if (startDate!="")
                {
                    var pStartDate=DateTime.Now;
                        DateTime.TryParse(startDate,out pStartDate);
                        filtered = filtered.Where(f => f.PRProductionPlanHeader.PRProductionPlanJobCardDetail.Where(a => a.StatusId.HasValue && a.StartDate.Value >= pStartDate).Any());
                }
                if (endDate != "")
                {
                    var pEndDate = DateTime.Now;
                    DateTime.TryParse(endDate, out pEndDate);
                    
                    filtered = filtered.Where(f => f.PRProductionPlanHeader.PRProductionPlanJobCardDetail.Where(a => a.StatusId.HasValue && a.EndDate.Value <= pEndDate).Any());
                } if (status !=Guid.Empty)
                {
                     filtered = filtered.Where(f => f.PRProductionPlanHeader.PRProductionPlanJobCardDetail.Where(a => a.StatusId==status).Any());
                }
                filtered = searchText != "" ? filtered.Where(i =>

                    i.PRProductionOrderDetail.PRProductionOrderHeader.VoucherNumber.ToUpper().Contains(searchText.ToUpper()) ||
                    i.PRProductionPlanHeader.VoucherNumber.ToUpper().Contains(searchText.ToUpper()) ||
                    i.PRProductionOrderDetail.psmsItem.Name.ToUpper().Contains(searchText.ToUpper()) ||
                    i.PRProductionOrderDetail.psmsItem.Code.ToUpper().Contains(searchText.ToUpper()) ||
                    i.PRProductionOrderDetail.psmsItem.Code.ToUpper().Contains(searchText.ToUpper()) ||
                   ( i.AssignedId.HasValue ?( i.coreUser.FirstName + " " + i.coreUser.LastName).ToUpper().Contains(searchText.ToUpper()):false) ||
                   (i.PRProductionPlanHeader.PRProductionPlanJobCardDetail.Where(a => a.StatusId.HasValue).Any() ? i.PRProductionPlanHeader.PRProductionPlanJobCardDetail.Where(a => a.StatusId.HasValue).OrderByDescending(o => o.OperationId).FirstOrDefault().PROperation.Name.ToUpper().Contains(searchText.ToUpper()) : false))
                         : filtered;
                switch (sort)
                {

                    default:
                        filtered = dir == "ASC" ? filtered.OrderByDescending(u => u.Id) : filtered.OrderBy(u => u.Id);
                        break;
                }
                var count = filtered.Count();
                var records = filtered.Select(item => new
                {
                    item.Id,
                    item.ProductionPlanHeaderId,
                    item.ProductionOrderDetailId,
                    VoucherNumber=item.PRProductionPlanHeader.VoucherNumber,
                    ProductionOrderNo = item.PRProductionOrderDetail.PRProductionOrderHeader.VoucherNumber,
                    Name =item.PRProductionOrderDetail.psmsItem.Code+" "+ item.PRProductionOrderDetail.psmsItem.Name,
                    ProgressStatus=item.PRProductionPlanHeader.PRProductionPlanJobCardDetail.Where(a=>a.StatusId.HasValue).Any()? item.PRProductionPlanHeader.PRProductionPlanJobCardDetail.Where(a=>a.StatusId.HasValue).OrderByDescending(o=>o.OperationId).FirstOrDefault().lupVoucherStatus.Name:"Not Started",
                    Operation = item.PRProductionPlanHeader.PRProductionPlanJobCardDetail.Where(a => a.StatusId.HasValue).Any() ? item.PRProductionPlanHeader.PRProductionPlanJobCardDetail.Where(a => a.StatusId.HasValue).OrderByDescending(o => o.OperationId).FirstOrDefault().PROperation.Name : "Not Started",
                    Assigned = item.AssignedId.HasValue ? item.coreUser.FirstName + " " + item.coreUser.LastName : "",
                    item.Quantity,
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
                    var objHeader =_ProductionPlanHeader.Get(o => o.Id == id);

                        foreach (var objPRProductionPlanDetail in objHeader.PRProductionPlanDetail)
                        {
                            UpdateProductionOrderDetail(objPRProductionPlanDetail.ProductionOrderDetailId, -objPRProductionPlanDetail.Quantity);
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
        public ActionResult Save(PRProductionPlanHeader objProductionPlan)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;

                try
                {
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var detailsString = hashtable["productionPlanDetails"].ToString();
                    var action = hashtable["action"].ToString();
                    var statusId = objProductionPlan.StatusId;

                    if (objProductionPlan.Id == Guid.Empty)
                    {
                        objProductionPlan.Id = Guid.NewGuid() ;
                        objProductionPlan.CreatedAt = DateTime.Now;
                        objProductionPlan.UpdatedAt = DateTime.Now;
                        Presentation.Psms.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as Presentation.Psms.Web.MvcApplication;
                        httpapplication.Application.Lock();
                        objProductionPlan.VoucherNumber = _utils.GetVoucherNumber("Production Plan");
                         _ProductionPlanHeader.AddNew(objProductionPlan);
                        _utils.UpdateVoucherNumber("Production Plan");
                        httpapplication.Application.UnLock();
                        GenerateBarCode(objProductionPlan.VoucherNumber);                  
                    }
                    else
                    {
                        objProductionPlan.UpdatedAt = DateTime.Now;
                        _ProductionPlanHeader.Edit(objProductionPlan);
                    }
                    GenerateBarCode(objProductionPlan.VoucherNumber);                           
                    SaveProductionPlanDetail(objProductionPlan.Id, detailsString, statusId, action);
                    _context.SaveChanges();
                    transaction.Complete();
               
                    return this.Direct(new { success = true, data = "Data has been added successfully!" });
                }
                catch (Exception e)
                {
                    return this.Direct(new { success = false, data = e.InnerException != null ? e.InnerException.Message : e.Message });
                }
            }
        }
        public void SaveProductionPlanDetail(Guid ProductionPlanHeaderId, string ProductionPlanDetailsString, Guid statusId,string action)
        {
            ProductionPlanDetailsString = ProductionPlanDetailsString.Remove(ProductionPlanDetailsString.Length - 1);
            IList<string> productionOrderDetails = ProductionPlanDetailsString.Split(new[] { ';' }).ToList();
            IList<PRProductionPlanDetail> ProductionPlanDetailList = new List<PRProductionPlanDetail>();
            var oldsPRProductionPlanDetailList = _ProductionPlanDetail.GetAll().AsQueryable().Where(o => o.ProductionPlanHeaderId == ProductionPlanHeaderId).ToList();
            for (var i = 0; i < productionOrderDetails.Count(); i++)
            {
                var productionPlanDetail = productionOrderDetails[i].Split(new[] { ':' });
                var productionPlanDetailId = Guid.Empty;
                decimal quantity = 0;
                Guid.TryParse(productionPlanDetail[0].ToString(), out productionPlanDetailId);
                var objPRProductionPlanDetail = productionPlanDetailId != Guid.Empty ? oldsPRProductionPlanDetailList.Where(o => o.Id == productionPlanDetailId).FirstOrDefault() : new PRProductionPlanDetail();
                quantity = objPRProductionPlanDetail.Quantity;
                objPRProductionPlanDetail.ProductionPlanHeaderId = ProductionPlanHeaderId;
                objPRProductionPlanDetail.ProductionOrderDetailId = Guid.Parse(productionPlanDetail[2]);
                objPRProductionPlanDetail.Quantity = decimal.Parse(productionPlanDetail[3]);
                objPRProductionPlanDetail.RemainingQuantity = decimal.Parse(productionPlanDetail[4]);
                objPRProductionPlanDetail.Remark = productionPlanDetail[5];
                objPRProductionPlanDetail.AssignedId = Guid.Parse(productionPlanDetail[6]);
                objPRProductionPlanDetail.StatusId =statusId;

                objPRProductionPlanDetail.UpdatedAt = DateTime.Now;
                if (productionPlanDetailId == Guid.Empty)
                {
                    objPRProductionPlanDetail.Id = Guid.NewGuid();
                    objPRProductionPlanDetail.CreatedAt = DateTime.Now;
                  _ProductionPlanDetail.AddNew(objPRProductionPlanDetail);
                }
                UpdateProductionOrderDetail(objPRProductionPlanDetail.ProductionOrderDetailId, objPRProductionPlanDetail.Quantity - quantity);
                ProductionPlanDetailList.Add(objPRProductionPlanDetail);
            }
            DeletePRProductionPlanDetail(ProductionPlanDetailList, oldsPRProductionPlanDetailList);

        }
        private void DeletePRProductionPlanDetail(IList<PRProductionPlanDetail> ProductionPlanDetailList, IList<PRProductionPlanDetail> oldsProductionPlanDetailList)
        {
            foreach (var objoldsProductionPlanDetail in oldsProductionPlanDetailList)
            {
                var record = ProductionPlanDetailList.Where(o => o.Id == objoldsProductionPlanDetail.Id);

                if (record.Count() == 0)
                {
                    _productionOrderDetail.Delete(o => o.Id == objoldsProductionPlanDetail.Id);
                    UpdateProductionOrderDetail(objoldsProductionPlanDetail.ProductionOrderDetailId, -objoldsProductionPlanDetail.Quantity);

                }
            }
        } 
        private void UpdateProductionOrderDetail(Guid productionOrderDetailId, decimal quantity)
        {
            var objslmsSalesDetail = _productionOrderDetail.GetAll().AsQueryable().Where(f => f.Id == productionOrderDetailId).FirstOrDefault();
            if (objslmsSalesDetail != null)
            {
                objslmsSalesDetail.RemainingQuantity = objslmsSalesDetail.RemainingQuantity - quantity;
            }
        }
        public void GenerateBarCode(string planNo)
        {
            try
            {
                string filePath;
                string appPath = HttpContext.Request.ApplicationPath;
                string physicalPath = HttpContext.Request.MapPath(appPath);
                string location = System.IO.Path.Combine(physicalPath, "Document" + "\\" + "Barcode");
                System.IO.Directory.CreateDirectory(location);
                filePath = location + "\\" + Path.GetFileName(planNo) + ".png";
                Barcode barcode = new Barcode();
                var barcodeData = planNo;
                barcode.GenerateBarcode(barcodeData, filePath);
                _context.SaveChanges();
            }
            catch( Exception e){

            }
             
        }
        #endregion


   
      
        #endregion

        #region Item
        public ActionResult GetAllItem(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid productionPlanId = Guid.Empty;
            Guid.TryParse(hashtable["productionPlanId"].ToString(), out productionPlanId);
            var action = hashtable["action"] != null ? hashtable["action"].ToString() : "";
            var objPlan = _ProductionPlanHeader.Get(o => o.Id == productionPlanId);
            var productionItemList = objPlan.PRProductionPlanDetail.Select(
                item => new
                {
                    item.Id,
                    item.PRProductionOrderDetail.ItemId,
                    item.Quantity,
                });
            var itemIdList = _ProductionPlanHeader.Get(o => o.Id == productionPlanId).PRProductionPlanDetail.Select(
                o=>o.PRProductionOrderDetail.ItemId);
            var lists = _productionPlanBOMDetail.GetAll().AsQueryable().Where(o => o.ProductionPlanHeaderId == productionPlanId);
            var planId = objPlan.Id;
            Guid[] OrderId = new Guid[] { };
            OrderId = objPlan.PRProductionPlanDetail.Select(a => a.PRProductionOrderDetail.ProductionOrderHeaderId).ToArray();
            var issueList = _issue.GetAll().AsQueryable().Where(a => a.psmsIssueHeader.StatusId == issueVoucherStatus && (a.psmsIssueHeader.psmsRequestOrderHeader.psmsStoreRequisitionHeader.ProductionPlanId == objPlan.Id || OrderId.Contains(a.psmsIssueHeader.psmsRequestOrderHeader.psmsStoreRequisitionHeader.ProductionOrderId.HasValue ? a.psmsIssueHeader.psmsRequestOrderHeader.psmsStoreRequisitionHeader.ProductionOrderId.Value : Guid.Empty)));
            if (action == "boM" && !lists.Any())
            {
                var filtered = _BillofMaterialDetail.GetAll().AsQueryable().Where(i =>itemIdList.Contains(i.PRBillofMaterialHeader.ItemId));
                var groupedBOM = filtered.ToList().GroupBy(o => new { o.ItemId,o.psmsItem, Unit = o.lupMeasurementUnit.Name, o.UnitId,o.StoreId,Store=o.StoreId.HasValue?o.psmsStore.Name:"", o.UnitCost,ProductionQ=(productionItemList.Where(d => d.ItemId == o.PRBillofMaterialHeader.ItemId).Select(a => a.Quantity).DefaultIfEmpty(0).Sum()) });
                var count = groupedBOM.Count();
                var items = groupedBOM.ToList().Select(item => new
                {
                    item.Key.ItemId,
                    item.Key.UnitId,
                    Description = item.Key.psmsItem.Name,
                    item.Key.StoreId,
                    item.Key.Store,
                    item.Key.UnitCost,
                    Quantity = item.Select(o => o.Quantity).DefaultIfEmpty(0).Sum() * item.Key.ProductionQ,
                    RemainingQuantity = item.Select(o => o.Quantity).DefaultIfEmpty(0).Sum() * item.Key.ProductionQ,
                    ConsumedQuantity = 0,
                    Unit = item.Key.Unit,
                    Remark = "",
                }).ToList();
                var result = new
                {
                    total = count,
                    data = items.ToList()
                };
                return this.Direct(result);
       
            }
            else
            {
                var filtered = lists;
                var count = filtered.Count();


                var items = filtered.Select(item => new
                {
                    item.ItemId,
                    item.UnitId,
                    item.UnitCost,
                    item.StoreId,
                    Store=item.StoreId.HasValue?item.psmsStore.Name:"",
                    Description=item.psmsItem.Name,
                    Quantity = item.Quantity,
                    item.RemainingQuantity,
                    Unit = item.lupMeasurementUnit.Name,
                   ConsumedQuantity = issueList.Where(a=>a.ItemId==item.ItemId).Select(a=>a.IssuedQuantity).DefaultIfEmpty(0).Sum(),
                
                    item.Remark,
                    item.CreatedAt
                }).ToList().Select(item => new
                {
                    item.ItemId,
                    item.UnitId,
                    Description = item.Description,
                    item.StoreId,
                    item.Store,
                    item.UnitCost,
                    Quantity = item.Quantity,
                    RemainingQuantity = item.Quantity - item.ConsumedQuantity,
                   item.ConsumedQuantity ,
                    Unit = item.Unit,
                    Remark = "",
                }); ;
                var result = new
                {
                    total = count,
                    data = items
                };
                return this.Direct(result);
            }


        }
        public ActionResult SaveItem(Guid productionOrderHeaderId, string itemString)
        {
            using (var transaction = new TransactionScope())
            {
                try
                {

                    IList<PRProductionPlanBOMDetail> itemList = new List<PRProductionPlanBOMDetail>();
                    var oldbillofMaterialItemList =_productionPlanBOMDetail.GetAll().AsQueryable().Where(o => o.ProductionPlanHeaderId == productionOrderHeaderId).ToList();
                    if (itemString != "")
                        itemString = itemString.Remove(itemString.Length - 1);
                    else
                    {
                        DeleteIBillofMaterialItem(oldbillofMaterialItemList, itemList);
                        _context.SaveChanges();
                        transaction.Complete();
                        return this.Direct(new { success = true, data = "Data has been saved successfully!" });
                    }
                    IList<string> items = itemString.Split(new[] { ';' }).ToList();
                    Guid storeId = Guid.Empty;
                    for (var i = 0; i < items.Count(); i++)
                    {
                        var billofMaterialItem = items[i].Split(new[] { ':' });
                        var billofMaterialItemId = Guid.Empty;
                        Guid.TryParse(billofMaterialItem[0].ToString(), out billofMaterialItemId);
                        var itemId = Guid.Empty;
                        Guid.TryParse(billofMaterialItem[2].ToString(), out itemId);

                        var objBillofQuantityItem = billofMaterialItemId != Guid.Empty ? oldbillofMaterialItemList.Where(o => o.ItemId == itemId).FirstOrDefault() : new PRProductionPlanBOMDetail();

                        objBillofQuantityItem.ItemId = productionOrderHeaderId;
                        objBillofQuantityItem.ProductionPlanHeaderId = productionOrderHeaderId;
                        objBillofQuantityItem.ItemId = Guid.Parse(billofMaterialItem[2]);
                        objBillofQuantityItem.UnitId = Guid.Parse(billofMaterialItem[3]);
                        objBillofQuantityItem.Quantity = decimal.Parse(billofMaterialItem[4]);
                        objBillofQuantityItem.UnitCost = 0;// decimal.Parse(billofMaterialItem[5]);
                        objBillofQuantityItem.Remark = billofMaterialItem[6];
                        objBillofQuantityItem.RemainingQuantity = decimal.Parse(billofMaterialItem[7]);
                        objBillofQuantityItem.ConsumedQuantity = decimal.Parse(billofMaterialItem[8]);
                        if (Guid.TryParse(billofMaterialItem[9], out storeId))
                            objBillofQuantityItem.StoreId = storeId;
                     
                        objBillofQuantityItem.UpdatedAt = DateTime.Now;

                        if (billofMaterialItemId == Guid.Empty)
                        {
                            objBillofQuantityItem.Id = Guid.NewGuid();
                            objBillofQuantityItem.CreatedAt = DateTime.Now;
                          _productionPlanBOMDetail.AddNew(objBillofQuantityItem);
                        }
                        itemList.Add(objBillofQuantityItem);
                    }
                    DeleteIBillofMaterialItem(oldbillofMaterialItemList, itemList);
                  //  UpdateBillofMaterial(productionOrderHeaderId,itemList, new List<PRBillofMaterialOperationDetail>());
                  
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Direct(new { success = true, data = "Data has been added successfully!" });

                }
                catch (Exception exception)
                {
                    return this.Direct(new { success = false, data = exception.Message });
                }
            }


        }
        public void DeleteIBillofMaterialItem(IList<PRProductionPlanBOMDetail> oldBillofMaterialItemList, IList<PRProductionPlanBOMDetail> BillofMaterialItemList)
        {
            foreach (var objoldsItem in oldBillofMaterialItemList)
            {
                var record = BillofMaterialItemList.Where(o => o.Id == objoldsItem.Id);

                if (record.Count() == 0)
                {
                 _productionPlanBOMDetail.Delete(o => o.Id == objoldsItem.Id);
                }
            }
        }


        #endregion

        #region Operation
        public ActionResult GetJobCard(Guid ids)
        {
            var jobCard =_productionPlanJobCardDetail.Get(o => o.Id == ids);
            var item = jobCard != null ? new
            {
                jobCard.Id,
                jobCard.ProductionPlanHeaderId,
                jobCard.Number,
                StartDate = jobCard.StartDate.HasValue ? jobCard.StartDate.Value.ToShortDateString() : "",
                EndDate = jobCard.EndDate.HasValue ? jobCard.EndDate.Value.ToShortDateString() : "",
                jobCard.EndMinute,
                jobCard.StartMinute,
                jobCard.OperationTime,
                jobCard.Interval,
                jobCard.AssignedEmployeeId,
                AssignedEmployee = jobCard.AssignedEmployeeId.HasValue ? jobCard.coreUser.FirstName + " " + jobCard.coreUser.LastName : "",
                jobCard.OperationId,
                Description = jobCard.PROperation.Name,
                jobCard.WorkStationId,
                WorkStation = jobCard.PRWorkStation.Name,
                jobCard.HourRate,
                jobCard.Quantity,
                jobCard.StatusId,
                Status = jobCard.StatusId.HasValue ? jobCard.lupVoucherStatus.Name : "",
                jobCard.Remark,
                jobCard.CreatedAt
                

            } : null;
            return this.Direct(new
            {
                success = true,
                data = item
            });
        }
  
        public ActionResult GetAllOperation(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid productionPlanId;
            Guid.TryParse(hashtable["productionPlanId"].ToString(), out productionPlanId);
            var action = hashtable["action"] != null ? hashtable["action"].ToString() : "";
            var productionItemList =_ProductionPlanHeader.Get(o => o.Id == productionPlanId).PRProductionPlanDetail.Select(
                item => new
                {
                    item.Id,
                    item.PRProductionOrderDetail.ItemId,
                    item.Quantity,
                });
            var itemIdList = _ProductionPlanHeader.Get(o => o.Id == productionPlanId).PRProductionPlanDetail.Select(
               o => o.PRProductionOrderDetail.ItemId);
            var lists = _productionPlanJobCardDetail.GetAll().AsQueryable().Where(o => o.ProductionPlanHeaderId == productionPlanId);
            if (action == "boM" && !lists.Any())
            {
                var filtered =_BillofMaterialOperationDetail.GetAll().AsQueryable().Where(i => itemIdList.Contains(i.PRBillofMaterialHeader.ItemId));
                var groupedBOM = filtered.ToList().GroupBy(o => new { o.OperationId, Name = o.PROperation.Name, WorkStation = o.PRWorkStation.Name, o.WorkStationId, o.HourRate, ProductionQ = (productionItemList.Where(d => d.ItemId == o.PRBillofMaterialHeader.ItemId).Select(a => a.Quantity).DefaultIfEmpty(0).Sum()) });
                var count = groupedBOM.Count();
                var items = groupedBOM.ToList().Select(item => new
                {
                    item.Key.OperationId,
                    item.Key.WorkStationId,
                    Description = item.Key.Name,
                    item.Key.HourRate,
                    OperationTime = item.Select(o => o.OperationTime).DefaultIfEmpty(0).Sum() * item.Key.ProductionQ,
                    ConsumedQuantity = 0,
                    item.Key.WorkStation,
                    Remark = "",
                }).ToList().GroupBy(f => new {

                    f.OperationId,
                    f.WorkStationId,
                    f.Description,
                    f.HourRate,
                    f.WorkStation,
                    Remark = "",
                }).Select(item => new
                {
                    item.Key.OperationId,
                    item.Key.WorkStationId,
                    Description = item.Key.Description,
                    item.Key.HourRate,
                    OperationTime = item.Select(o => o.OperationTime).DefaultIfEmpty(0).Sum(),
                    ConsumedQuantity = 0,
                    item.Key.WorkStation,
                    Remark = "",
                });
                var result = new
                {
                    total = count,
                    data = items
                };
                return this.Direct(result);

            }
            else
            {
                var filtered =lists;
                var count = filtered.Count();


                var items = filtered.ToList().Select(item => new
                {
                    item.Id,
                    item.AssignedEmployeeId,
                    AssignedEmployee=item.AssignedEmployeeId.HasValue?item.coreUser.FirstName+" "+item.coreUser.LastName:"",
                    item.OperationId,
                    Description = item.PROperation.Name,
                    item.WorkStationId,
                    WorkStation = item.PRWorkStation.Name,
                    StartDate=item.StartDate.HasValue?item.StartDate.Value.ToShortDateString():"",
                    EndDate = item.EndDate.HasValue ? item.EndDate.Value.ToShortDateString():"",
                    item.HourRate,
                    item.OperationTime,
                    item.Interval,
                    item.Quantity,
                    item.StatusId,
                    Status=item.StatusId.HasValue?item.lupVoucherStatus.Name:"",
                    item.Remark,
                    item.CreatedAt
                }).ToList();
                var result = new
                {
                    total = count,
                    data = items
                };
                return this.Direct(result);
            }
          
        }

        public ActionResult GetAllOperationForStatus(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
            var action = hashtable["action"] != null ? hashtable["action"].ToString() : "";
            var employeeId = getCurrentEmployee();
            var userId = Guid.Empty;
            var objUser = (coreUser)Session[Constants.CurrentUser];
            if (objUser != null && objUser.Id != null)
            {
                employeeId = (Guid)objUser.Id;
                userId = (Guid)objUser.Id;
            }

            var filtered = _productionPlanJobCardDetail.GetAll().AsQueryable().Where(o => o.PRProductionPlanHeader.StatusId != voidVoucherStatus).Where(x => x.PRProductionPlanHeader.PRProductionPlanDetail.Where(z => z.PRProductionOrderDetail.PRProductionOrderHeader.StoreId.HasValue ? z.PRProductionOrderDetail.PRProductionOrderHeader.psmsStore.psmsStorePermission.Where(f => f.UserId == userId).Any() : true).Any());

            filtered = searchText != "" ? filtered.Where(i =>

                i.PRProductionPlanHeader.VoucherNumber.ToUpper().Contains(searchText.ToUpper()) ||
                i.PRWorkStation.Name.ToUpper().Contains(searchText.ToUpper()) ||
                i.PROperation.Name.ToUpper().Contains(searchText.ToUpper()) ||
                (i.AssignedEmployeeId.HasValue ? (i.coreUser.FirstName + " " + i.coreUser.LastName).ToUpper().Contains(searchText.ToUpper()) : false) ||
                i.lupVoucherStatus.Name.ToUpper().Contains(searchText.ToUpper()))
                : filtered;
            switch (sort)
            {
                case "VoucherNumber":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.PRProductionPlanHeader.VoucherNumber) : filtered.OrderByDescending(u => u.PRProductionPlanHeader.VoucherNumber);
                    break;
                case "AssignedEmployee":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.AssignedEmployeeId.HasValue ? u.coreUser.FirstName + " " + u.coreUser.LastName : "") : filtered.OrderByDescending(u => u.AssignedEmployeeId.HasValue ? u.coreUser.FirstName + " " + u.coreUser.LastName : "");
                    break;
                case "Description":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.PROperation.Name) : filtered.OrderByDescending(u => u.PROperation.Name);
                    break;
                case "WorkStation":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.PRWorkStation.Name) : filtered.OrderByDescending(u => u.PRWorkStation.Name);
                    break;
                case "Status":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.lupVoucherStatus.Name) : filtered.OrderByDescending(u => u.lupVoucherStatus.Name);
                    break;
                case "Remark":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Remark) : filtered.OrderByDescending(u => u.Remark);
                    break;
                default:
                    filtered = dir == "ASC" ? filtered.OrderByDescending(u => u.Id) : filtered.OrderBy(u => u.Id);
                    break;
            }
              var count = filtered.Count();


                var items = filtered.ToList().Select(item => new
                {
                    item.Id,
                    item.PRProductionPlanHeader.VoucherNumber,
                    item.AssignedEmployeeId,
                    AssignedEmployee = item.AssignedEmployeeId.HasValue ? item.coreUser.FirstName + " " + item.coreUser.LastName : "",
                    item.OperationId,
                    Description = item.PROperation.Name,
                    item.WorkStationId,
                    WorkStation = item.PRWorkStation.Name,
                    StartDate = item.StartDate.HasValue ? item.StartDate.Value.ToShortDateString() : "",
                    EndDate = item.EndDate.HasValue ? item.EndDate.Value.ToShortDateString() : "",
                    item.HourRate,
                    item.OperationTime,
                    item.Interval,
                    item.Quantity,
                    item.StatusId,
                    Status = item.StatusId.HasValue ? item.lupVoucherStatus.Name : "",
                    item.Remark,
                    item.CreatedAt
                }).ToList();
                var result = new
                {
                    total = count,
                    data = items
                };
                return this.Direct(result);
        }
        public DirectResult GetAllResultDetail(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                Guid voucherHeaderId=Guid.Empty,statusId=Guid.Empty; 
                if (hashtable["voucherHeaderId"]!=null)
                Guid.TryParse(hashtable["voucherHeaderId"].ToString(), out voucherHeaderId);
                if (hashtable["statusId"] != null)
                    Guid.TryParse(hashtable["statusId"].ToString(), out statusId);
             
                List<object> records = new List<object>();
                var filtered = _resultDetail.GetAll().AsQueryable().Where(d => d.ProductionPlanJobCardDetailId == voucherHeaderId && d.StatusId == statusId).OrderBy(o => o.Id);
                var count = filtered.Count();
                    records = filtered.Select(item => new
                    {
                        item.Id,
                        item.ProductionPlanJobCardDetailId,
                        Name = item.psmsItem.Name,
                        item.ItemId,
                        Code = item.ItemId != null ? item.psmsItem.Code : "",
                        MeasurementUnit = item.psmsItem.lupMeasurementUnit.Name,
                        Quantity =  item.Quantity,
                        item.AcceptedQuantity,
                        item.RemainingQuantity,
                        item.ReturnedQuantity,
                        item.Remark,
                    }).ToList().Cast<object>().ToList();
                    var result = new { total = count, data = records };
                    return this.Direct(result);

            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }
 
        [FormHandler]
        public ActionResult SaveJobCard(PRProductionPlanJobCardDetail objProductionPlanJobCardDetail)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;

                try
                {                   
                    if (objProductionPlanJobCardDetail.Id == Guid.Empty)
                    {
                        objProductionPlanJobCardDetail.Id = Guid.Empty;
                        objProductionPlanJobCardDetail.CreatedAt = DateTime.Now;
                        objProductionPlanJobCardDetail.UpdatedAt = DateTime.Now;
                         _productionPlanJobCardDetail.AddNew(objProductionPlanJobCardDetail);
                     }
                    else
                    {
                        objProductionPlanJobCardDetail.UpdatedAt = DateTime.Now;
                        _productionPlanJobCardDetail.Edit(objProductionPlanJobCardDetail);
                    }
                    _context.SaveChanges();
                    transaction.Complete();

                    return this.Direct(new { success = true, data = "Data has been added successfully!" });
                }
                catch (Exception e)
                {
                    return this.Direct(new { success = false, data = e.InnerException != null ? e.InnerException.Message : e.Message });
                }
            }
        }
    
        public ActionResult SaveOperation(Guid porductionPllanHeaderId, string operationString)
        {
            using (var transaction = new TransactionScope())
            {
                try
                {

                    IList<PRProductionPlanJobCardDetail> OperationList = new List<PRProductionPlanJobCardDetail>();
                    var oldbillofMaterialOperationList =_productionPlanJobCardDetail.GetAll().AsQueryable().Where(o => o.ProductionPlanHeaderId == porductionPllanHeaderId).ToList();
                    if (operationString != "")
                        operationString = operationString.Remove(operationString.Length - 1);
                    else
                    {
                        DeleteIBillofMaterialOperation(oldbillofMaterialOperationList, OperationList);
                        _context.SaveChanges();
                        transaction.Complete();
                        return this.Direct(new { success = true, data = "Data has been saved successfully!" });
                    }
                    IList<string> Operations = operationString.Split(new[] { ';' }).ToList();
                    Guid id = Guid.Empty; decimal value = 0; DateTime date; decimal interval = 0;
                    for (var i = 0; i < Operations.Count(); i++)
                    {
                        var billofMaterialOperation = Operations[i].Split(new[] { ':' });
                        var billofMaterialOperationId = Guid.Empty;
                        Guid.TryParse(billofMaterialOperation[0].ToString(), out billofMaterialOperationId);
                        var operationId = Guid.Empty;
                        Guid.TryParse(billofMaterialOperation[2].ToString(), out operationId);

                        var objBillofQuantityOperation = billofMaterialOperationId != Guid.Empty ? oldbillofMaterialOperationList.Where(o => o.OperationId == operationId).FirstOrDefault() : new PRProductionPlanJobCardDetail();
                        objBillofQuantityOperation.Number = "000";
                        objBillofQuantityOperation.ProductionPlanHeaderId = porductionPllanHeaderId;
                        objBillofQuantityOperation.OperationId = Guid.Parse(billofMaterialOperation[2]);
                        objBillofQuantityOperation.WorkStationId = Guid.Parse(billofMaterialOperation[3]);
                        if(Guid.TryParse(billofMaterialOperation[4],out id))
                        objBillofQuantityOperation.AssignedEmployeeId =id;
                        if(decimal.TryParse(billofMaterialOperation[5],out value))                  
                        objBillofQuantityOperation.HourRate = value;
                        if (decimal.TryParse(billofMaterialOperation[6], out value))
                            objBillofQuantityOperation.OperationTime = value;
                          if(DateTime.TryParse(billofMaterialOperation[7],out date))                                     
                        objBillofQuantityOperation.StartDate = date;
                          if(DateTime.TryParse(billofMaterialOperation[8],out date))                                     
                        objBillofQuantityOperation.EndDate = date;
                          if(decimal.TryParse(billofMaterialOperation[9],out interval))                                     
                        objBillofQuantityOperation.Interval = interval;
                         if(Guid.TryParse(billofMaterialOperation[10],out id))                                     
                        objBillofQuantityOperation.StatusId = id;
                     
                        objBillofQuantityOperation.Remark = billofMaterialOperation[11];                       
                        objBillofQuantityOperation.UpdatedAt = DateTime.Now;

                        if (billofMaterialOperationId == Guid.Empty)
                        {
                            objBillofQuantityOperation.Id = Guid.NewGuid();
                            objBillofQuantityOperation.CreatedAt = DateTime.Now;
                           _productionPlanJobCardDetail.AddNew(objBillofQuantityOperation);
                        }
                        OperationList.Add(objBillofQuantityOperation);
                    }
                    DeleteIBillofMaterialOperation(oldbillofMaterialOperationList, OperationList);
                  //  UpdateBillofMaterial(billofMaterialId, new List<PRBillofMaterialDetail>(), OperationList);
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Direct(new { success = true, data = "Data has been added successfully!" });

                }
                catch (Exception exception)
                {
                    return this.Direct(new { success = false, data = exception.Message });
                }
            }


        }
        public void DeleteIBillofMaterialOperation(IList<PRProductionPlanJobCardDetail> oldBillofMaterialOperationList, IList<PRProductionPlanJobCardDetail> BillofMaterialOperationList)
        {
            foreach (var objoldsOperation in oldBillofMaterialOperationList)
            {
                var record = BillofMaterialOperationList.Where(o => o.Id == objoldsOperation.Id);

                if (record.Count() == 0)
                {
                  _productionPlanJobCardDetail.Delete(o => o.Id == objoldsOperation.Id);
                }
            }
        }


        public ActionResult UpdateJobcarStatus(Guid planHeaderId,Guid jobcardId)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;

                try
                {
                    var jobcrad = _productionPlanJobCardDetail.GetAll().AsQueryable().Where(o => o.ProductionPlanHeaderId == planHeaderId && o.Id==jobcardId).FirstOrDefault();
                    if (jobcrad!=null)
                    {
                        if (jobcrad.StatusId==null && jobcrad.StartDate==null)
                        {
                                jobcrad.StartDate = DateTime.Now;
                                jobcrad.StartMinute = DateTime.Now.Hour.ToString() +":"+DateTime.Now.Minute.ToString();
                                jobcrad.StatusId =Guid.Parse( Constants.Voucher_Status_Ordered);
                         }
                        else
                        {
                            jobcrad.EndDate = DateTime.Now;
                            jobcrad.EndMinute = DateTime.Now.Hour.ToString() + ":" + DateTime.Now.Minute.ToString();
                            jobcrad.StatusId = Guid.Parse(Constants.Voucher_Status_Final_Approved);

                            var span = (jobcrad.EndDate.Value - jobcrad.StartDate.Value).TotalHours;
                            jobcrad.Interval = Convert.ToDecimal(span);

                        }
                  }
                       
                    _context.SaveChanges();
                    transaction.Complete();

                    return this.Direct(new { success = true, data = "Data has been added successfully!" });
                }
                catch (Exception e)
                {
                    return this.Direct(new { success = false, data = e.InnerException != null ? e.InnerException.Message : e.Message });
                }
            }
        }
        public ActionResult SaveResultDetail(string resultItemList, Guid jobcardId, Guid statusId)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;

                try
                {
                    resultItemList = resultItemList.Remove(resultItemList.Length - 1);
                    IList<string> resultDetails = resultItemList.Split(new[] { ';' }).ToList();
                    IList<PRProductionPlanJobCardResultDetail> resultDetailList = new List<PRProductionPlanJobCardResultDetail>();

                    var oldsResultDetailList = _resultDetail.GetAll().AsQueryable().Where(o => o.ProductionPlanJobCardDetailId == jobcardId).ToList();
                    for (var i = 0; i < resultDetails.Count(); i++)
                    {
                        var resultDetail = resultDetails[i].Split(new[] { ':' });
                        var resultDetailId = Guid.Empty;
                        decimal quantity = 0;
                        Guid.TryParse(resultDetail[0].ToString(), out resultDetailId);
                        var objResultDetail = resultDetailId != Guid.Empty ? oldsResultDetailList.Where(o => o.Id == resultDetailId).FirstOrDefault() : new PRProductionPlanJobCardResultDetail();
                        quantity = objResultDetail.Quantity;
                        objResultDetail.ProductionPlanJobCardDetailId = jobcardId;
                        objResultDetail.ItemId = Guid.Parse(resultDetail[2]);
                        objResultDetail.Quantity = decimal.Parse(resultDetail[3]);
                        objResultDetail.AcceptedQuantity = decimal.Parse(resultDetail[4]);
                        objResultDetail.RemainingQuantity = decimal.Parse(resultDetail[5]);
                        objResultDetail.ReturnedQuantity = decimal.Parse(resultDetail[6]);
                        objResultDetail.Remark = resultDetail[7];
                        objResultDetail.StatusId = statusId;

                        objResultDetail.UpdatedAt = DateTime.Now;
                        if (resultDetailId == Guid.Empty)
                        {
                            objResultDetail.Id = Guid.NewGuid();
                            objResultDetail.CreatedAt = DateTime.Now;
                            _resultDetail.AddNew(objResultDetail);
                        }
                        resultDetailList.Add(objResultDetail);
                    }
                    DeleteResultDetail(resultDetailList, oldsResultDetailList);
                    transaction.Complete();

                    return this.Direct(new { success = true, data = "Data has been added successfully!" });
                }
                catch (Exception e)
                {
                    return this.Direct(new { success = false, data = e.InnerException != null ? e.InnerException.Message : e.Message });
                }
            }

        }
        private void DeleteResultDetail(IList<PRProductionPlanJobCardResultDetail> resultDetailList, IList<PRProductionPlanJobCardResultDetail> oldsResultDetailList)
        {
            foreach (var objoldsPRProductionOrderDetail in oldsResultDetailList)
            {
                var record = resultDetailList.Where(o => o.Id == objoldsPRProductionOrderDetail.Id);

                if (record.Count() == 0)
                {
                    _productionOrderDetail.Delete(o => o.Id == objoldsPRProductionOrderDetail.Id);               
                }
            }
        }

        #endregion

        #region Team
        public ActionResult GetAllOperationTeam(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid productionPlanJobCardId;
            Guid.TryParse(hashtable["productionPlanJobCardId"].ToString(), out productionPlanJobCardId);

            var filtered = _productionPlanJobCardTeamDetail.GetAll().AsQueryable().Where(o => o.ProductionPlanJobCardDetailId == productionPlanJobCardId);
                var count = filtered.Count();

                var items = filtered.ToList().Select(item => new
                {
                    item.Id,
                    item.ProductionPlanJobCardDetailId,
                    item.AssignedEmployeeId,
                    AssignedEmployee = item.AssignedEmployeeId.HasValue ? item.coreUser.FirstName + " " + item.coreUser.LastName : "",
                    item.Remark,
                    item.CreatedAt
                }).ToList();
                var result = new
                {
                    total = count,
                    data = items
                };
                return this.Direct(result);
        }
        public ActionResult SaveOperationTeam(Guid porductionPllanJobCardHeaderId, string operationTeamString)
        {
            using (var transaction = new TransactionScope())
            {
                try
                {

                    IList<PRProductionPlanJobCardTeamDetail> OperationTeamList = new List<PRProductionPlanJobCardTeamDetail>();
                    var oldOperationTeamList = _productionPlanJobCardTeamDetail.GetAll().AsQueryable().Where(o => o.ProductionPlanJobCardDetailId == porductionPllanJobCardHeaderId).ToList();
                    if (operationTeamString != "")
                        operationTeamString = operationTeamString.Remove(operationTeamString.Length - 1);
                    else
                    {
                        DeleteIOperationTeam(oldOperationTeamList, OperationTeamList);
                        _context.SaveChanges();
                        transaction.Complete();
                        return this.Direct(new { success = true, data = "Data has been saved successfully!" });
                    }
                    IList<string> OperationsTeams = operationTeamString.Split(new[] { ';' }).ToList();
                    Guid id = Guid.Empty; decimal value = 0; DateTime date;
                    for (var i = 0; i < OperationsTeams.Count(); i++)
                    {
                        var operationTeam = OperationsTeams[i].Split(new[] { ':' });
                        var operationTeamId = Guid.Empty;
                        Guid.TryParse(operationTeam[0].ToString(), out operationTeamId);
                        var employeeId = Guid.Empty;
                        Guid.TryParse(operationTeam[2].ToString(), out employeeId);

                        var objOperationTeam = operationTeamId != Guid.Empty ? oldOperationTeamList.Where(o => o.AssignedEmployeeId == employeeId).FirstOrDefault() : new PRProductionPlanJobCardTeamDetail();
                        objOperationTeam.Number = "000";
                        objOperationTeam.ProductionPlanJobCardDetailId = porductionPllanJobCardHeaderId;
                        objOperationTeam.AssignedEmployeeId = employeeId;                
                        objOperationTeam.Remark = operationTeam[3];
                        objOperationTeam.UpdatedAt = DateTime.Now;

                        if (operationTeamId == Guid.Empty)
                        {
                            objOperationTeam.Id = Guid.NewGuid();
                            objOperationTeam.CreatedAt = DateTime.Now;
                            _productionPlanJobCardTeamDetail.AddNew(objOperationTeam);
                        }
                        OperationTeamList.Add(objOperationTeam);
                    }
                    DeleteIOperationTeam(oldOperationTeamList, OperationTeamList);
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Direct(new { success = true, data = "Data has been added successfully!" });

                }
                catch (Exception exception)
                {
                    return this.Direct(new { success = false, data = exception.Message });
                }
            }


        }
        public void DeleteIOperationTeam(IList<PRProductionPlanJobCardTeamDetail> oldOperationTeamList, IList<PRProductionPlanJobCardTeamDetail> OperationTeamList)
        {
            foreach (var objoldsOperation in oldOperationTeamList)
            {
                var record = OperationTeamList.Where(o => o.Id == objoldsOperation.Id);

                if (record.Count() == 0)
                {
                    _productionPlanJobCardTeamDetail.Delete(o => o.Id == objoldsOperation.Id);
                }
            }
        }


        #endregion

        #region Methods
        private Guid getCurrentEmployee()
        {
            var objUser = (coreUser)Session[Constants.CurrentUser];
            if (objUser != null && objUser.Id != null)
            {
                employeeId = (Guid)objUser.Id;
            }
            return employeeId;
        }
        private void UpdateProductionPlan(Guid billofMaterialId, IList<PRBillofMaterialDetail> billofMaterialItemList, IList<PRBillofMaterialOperationDetail> billofMaterialOperationList)
        {
            decimal materialCost = 0, scrapCost = 0, operationCost = 0;
            if(billofMaterialItemList.Any())
            {
                 materialCost = billofMaterialItemList.Select(o => o.Quantity * o.UnitCost).DefaultIfEmpty().Sum();
                scrapCost = billofMaterialItemList.Select(o =>(o.ScrapQuantity.HasValue? o.ScrapQuantity.Value * o.UnitCost:0)).DefaultIfEmpty().Sum();
                 var objBillofMaterial = _BillofMaterialHeader.Get(o => o.Id == billofMaterialId);
                 objBillofMaterial.MaterialCost = materialCost;
                 objBillofMaterial.ScrapCost = scrapCost;
                 objBillofMaterial.Total = objBillofMaterial.ScrapCost + objBillofMaterial.MaterialCost + objBillofMaterial.OperationCost;
       
            }
            else if (billofMaterialOperationList.Any())
            {
                operationCost = billofMaterialOperationList.Select(o =>(o.OperationTime.HasValue? o.HourRate * o.OperationTime.Value:0)).DefaultIfEmpty().Sum();
                var objBillofMaterial = _BillofMaterialHeader.Get(o => o.Id == billofMaterialId);
                objBillofMaterial.OperationCost = operationCost;
                objBillofMaterial.Total = objBillofMaterial.ScrapCost + objBillofMaterial.MaterialCost + objBillofMaterial.OperationCost;
             
            }
        }

        #endregion
    }
}