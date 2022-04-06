using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Ext.Direct.Mvc;
using Newtonsoft.Json;
using System.Collections;

namespace CyberErp.Presentation.Psms.Web.Controllers
{
    public class ERPReportController : Controller
    {
        #region Constructor

        public ERPReportController()
        {

        }

        #endregion

        #region Methods




        [FormHandler]
        public ActionResult SetProductionReportParam(ProductionReport rptParams)
        {
            try
            {
                Session["ProductionReportParams"] = rptParams;
                return this.Direct(new { success = true, data = "" });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.InnerException != null ? exception.InnerException.Message : exception.Message });
            }
        }

        [FormHandler]
        public ActionResult SetFixedAssetReportParam(FixedAssetReport rptParams)
        {
            try
            {
                Session["FixedAssetReportParams"] = rptParams;
                return this.Direct(new { success = true, data = "" });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.InnerException != null ? exception.InnerException.Message : exception.Message });
            }
        }
        [FormHandler]
        public ActionResult SetBincardReportParam(BincardReport rptParams)
        {
            try
            {
                if (Request.Params["ShowDetail"] != null && Request.Params["ShowDetail"].ToString().Equals("on"))
                    rptParams.ShowDetail = true;
                else
                    rptParams.ShowDetail = false;
                
                Session["BincardReportParams"] = rptParams;
                return this.Direct(new { success = true, data = "" });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.InnerException != null ? exception.InnerException.Message : exception.Message });
            }
        }
        [FormHandler]
        public ActionResult SetItemAnalysisParam(ItemAnalysis rptParams)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                var storesIdsString = hashtable["stores"].ToString();
                var action = hashtable["action"].ToString();

                var itemIds = hashtable["itemIds"].ToString();

                decimal saftyGuardPercent = decimal.Parse(Request.Params["saftyGuardPercent"]);
                decimal leadTime = decimal.Parse(Request.Params["saftyGuardPercent"]);

                DateTime startDate = DateTime.Parse(Request.Params["StartDate"]);
                DateTime endDate = DateTime.Parse(Request.Params["EndDate"]);


                rptParams.stores = storesIdsString;
                rptParams.saftyGuardPercent = saftyGuardPercent;
                rptParams.StartDate = startDate;
                rptParams.EndDate = endDate;
                rptParams.leadTime = leadTime;
                rptParams.itemIds = itemIds;
                rptParams.action = action;
                Session["ItemAnalysisParams"] = rptParams;
                return this.Direct(new { success = true, data = "" });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.InnerException != null ? exception.InnerException.Message : exception.Message });
            }
        }
        #endregion

    }
    public class PriceAnalysisReport
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class OverallItemTransactionReport
    {
        public string Item { get; set; }
    }

    public class SupplierItemReport
    {
        public string Item { get; set; }
        public string Supplier { get; set; }
    }

    public class InventoryClosingReport
    {
        public string Store { get; set; }
        public string Item { get; set; }
        public DateTime ClosingDate { get; set; }
    }


    public class PurchasingReport
    {
        public string ReportName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string StoreId { get; set; }
        public string VoucherNumber { get; set; }
        public string SupplierId { get; set; }
    }

    public class TransactionReport
    {
        public string ReportName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int StoreId { get; set; }
        public Guid id { get; set; }
        public int ItemId { get; set; }
        public int FromStoreId { get; set; }
        public int ToStoreId { get; set; }
    }
    public class FixedAssetReport
    {
        public string ReportName { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public Guid StoreId { get; set; }
        public Guid ItemCategoryId { get; set; }
        public Guid Id { get; set; }
        public Guid ItemId { get; set; }
        public Guid EmployeeId { get; set; }
    }

    public class StockMovtListReport
    {
        public string dateFrom { get; set; }
        public string dateTo { get; set; }
        public string Item { get; set; }
        public string store { get; set; }
        public string TransferType { get; set; }
    }

    public class StockstatusListReport
    {
        public string subcategory { get; set; }
        public string category { get; set; }
        public string Item { get; set; }
        public string store { get; set; }
    }

    public class BincardReport
    {
        public string ReportName { get; set; }
      
        public Guid StoreId { get; set; }
        public string Store { get; set; }
     
        public Guid FiscalYearId { get; set; }
        public Guid ItemId { get; set; }
        public Guid ItemTypeId { get; set; }
        public Guid ItemCategoryId { get; set; }
        public Guid ConsumerTypeId { get; set; }
        public string ItemType { get; set; }
        public string VoucherNo { get; set; }
        public string Consumer { get; set; }
        public string ReferenceNo { get; set; }
        public bool ShowDetail { get; set; }
        public Guid SupplierId { get; set; }
        public Guid CustomerId { get; set; }
        public Guid CustomerCategoryId { get; set; }
        public Guid PriceCategoryId { get; set; }
        public Guid SalesTypeId { get; set; }
        public string Supplier { get; set; }
        public string SupplierCode { get; set; }
        public Guid StatusId { get; set; }
        public string FiscalYear { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
    public class ItemAnalysis
    {
        public string stores { get; set; }
        public string itemIds { get; set; }
        public decimal saftyGuardPercent { get; set; }
        public decimal leadTime { get; set; }
        public string Item { get; set; }
        public string store { get; set; }
        public string action { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

    }
    public class ProductionReport
    {
        public string ReportName { get; set; }

        public int StoreId { get; set; }
        public string Store { get; set; }
        public string VoucherNo { get; set; }

        public int FiscalYearId { get; set; }

        public string FiscalYear { get; set; }
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public int StatusId { get; set; }
        public int ItemTypeId { get; set; }
        public string ItemType { get; set; }

        public string Color { get; set; }

        public string Size { get; set; }
        public string ItemCategory { get; set; }
        public string ItemMainCategory { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
