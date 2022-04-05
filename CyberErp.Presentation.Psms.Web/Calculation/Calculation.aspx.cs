
using CyberErp.Business.Component.Psms;
using CyberErp.Data.Model;
using CyberErp.Presentation.Psms.Web.Classes;
using CyberErp.Presentation.Psms.Web.Controllers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Transactions;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CyberErp.Presentation.Inventory.Web.Calculation
{
    public partial class Calculation : System.Web.UI.Page
    {
        private readonly DbContext _context;
        private readonly TransactionCalculation _transactionCalculation;
        private readonly Item _item;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        public Calculation()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _transactionCalculation = new TransactionCalculation(_context);
            _item = new Item(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);
        }
        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);

            var action = Request.QueryString["action"];
            if (action == "ItemAnalysis")
                CalculateItemAnalysis();
            else if (action == "Recalculate")
            {
                var storeId = Guid.Parse(Request.QueryString["storeId"]);
                var fiscalYearId = Guid.Parse(Request.QueryString["fiscalYearId"]);

                RecalculateBinCard(storeId, fiscalYearId);
            }
            else if (action == "RecalculateForReceiveOnly")
            {
                var storeId = Guid.Parse(Request.QueryString["storeId"]);
                var fiscalYearId = Guid.Parse(Request.QueryString["fiscalYearId"]);

                RecalculateBinCardForReceive(storeId, fiscalYearId);
            }
        }
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        #region Item Analysis
        public void CalculateItemAnalysis()
        {
             try
            {
                using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
                {
                    _context.Database.Connection.Open();
                    _context.Database.CommandTimeout = int.MaxValue;
                    ItemAnalysis param = (ItemAnalysis)Session["ItemAnalysisParams"];

                    var storesIdsString = param.stores;
                    storesIdsString = storesIdsString.Remove(storesIdsString.Length - 1);
                    var storeIdList = storesIdsString.Split(new[] { ';' }).ToList();
                    IList<Constants.ItemAnalysisModel> itemAnalysisList = new List<Constants.ItemAnalysisModel>();
                    decimal saftyGuardPercent = param.saftyGuardPercent;
                     List<Guid> ids = new List<Guid>();
                    List<psmsItem> itemList = new List<psmsItem>();
                   
                     if (param.action == "classification")
                        itemList = _item.GetAll().AsQueryable().Where(o =>o.lupItemType.Name!="FixedAsset").ToList();                
                    else
                     {
                         param.itemIds = param.itemIds.Remove(param.itemIds.Length - 1);                
                         ids = param.itemIds.Split(',').Select(s => Guid.Parse(s)).ToList();
                         itemList = _item.GetAll().AsQueryable().Where(o => ids.Contains(o.Id)).ToList();
                
                     }
                     foreach (var item in itemList)
                    {
                        var itemId = item.Id;
                         if(param.action!="classification")
                         {
                             decimal averageDialyUsage = _transactionCalculation.CalculateDialyUsageUnit(itemId, storeIdList, param.StartDate, param.EndDate);
                             double leadTime = (double)param.leadTime; //_transactionCalculation.CalculateLeadTime(itemId, storeIdList, reportParams.StartDate, reportParams.EndDate);
                             double safetyStock = _transactionCalculation.CalculateSafetyStock(averageDialyUsage, leadTime, saftyGuardPercent);
                             double reorderLevel = _transactionCalculation.CalculateReorderLevel(averageDialyUsage, leadTime, safetyStock);
                             UpdateIventoryItemAnalysis(item, storeIdList, reorderLevel, safetyStock, averageDialyUsage, leadTime, param.StartDate, param.EndDate);             
         
                         }
                         else
                         {
                             decimal annualUsage = _transactionCalculation.CalculateAnnualUsageUnit(itemId, storeIdList, param.StartDate, param.EndDate);
                             decimal annualCost = _transactionCalculation.CalculateAnnualUsageCost(itemId, storeIdList, param.StartDate, param.EndDate);
                             itemAnalysisList.Add(new Constants.ItemAnalysisModel { Item = item, AnnualUsage = annualUsage, AnnualCost = annualCost, UsagePersent = 0, CostPersent = 0 });
                    
                         }
                   
                     }
                    if (param.action == "classification")                       
                    ABCAnalysis(itemAnalysisList);
                       
                    LabelResult.Text = "Successfully completed!";
         

                    _context.SaveChanges();
                    transaction.Complete();
          
                }
            }
            catch (Exception exception)
            {
                LabelResult.Text = "Error has occured " + exception.Message;
           
            }
        }
        private void UpdateIventoryItemAnalysis(psmsItem item, IList<string> storeIdList, double ReorderLevel, double safetyStock, decimal averageDialyUsage, double leadTime, DateTime startDate, DateTime endDate)
        {
            var fiscalYear = _fiscalYear.Find(o => o.IsActive && o.IsClosed == false);

            for (var i = 0; i < storeIdList.Count(); i++)
            {
                var storeId = Guid.Parse(storeIdList[i]);
                var inventoryRecord = item.psmsInventoryRecord.Where(o => o.IsClosed == false && o.FiscalYearId == fiscalYear.Id && o.StoreId == storeId).FirstOrDefault();
                if (inventoryRecord != null)
                {
                    double OrderingCost = inventoryRecord.OrderingCost.HasValue ? inventoryRecord.OrderingCost.Value : 1;
                    double carryingCost = inventoryRecord.CarryingCost.HasValue ? inventoryRecord.CarryingCost.Value : 1;
                    decimal unitCost = inventoryRecord.UnitCost;
                    var totalDays = decimal.Parse(endDate.Subtract(startDate).TotalDays.ToString()) + 1;

                    decimal annualDemand = averageDialyUsage * totalDays;

                    double orderingQuantity = 0;
                    if (unitCost > 0)
                    {
                        orderingQuantity = (double)Math.Sqrt((double)(2 * (double)annualDemand * carryingCost / ((double)unitCost * carryingCost)));
                    }
                    double maximumLevel = (leadTime *(double) averageDialyUsage) + orderingQuantity;
                    inventoryRecord.ReorderLevel = ReorderLevel;
                    inventoryRecord.SafetyStock = safetyStock;
                    inventoryRecord.MaximumLevel = maximumLevel;

                }
            }

        }
        private void ABCAnalysis(IList<Constants.ItemAnalysisModel> itemAnalysisList)
        {
            var totalUsage = itemAnalysisList.Select(o => o.AnnualUsage).DefaultIfEmpty(0).Sum();
            var totalCost = itemAnalysisList.Select(o => o.AnnualCost).DefaultIfEmpty(0).Sum();

            foreach (var AnalysisItem in itemAnalysisList)
            {
               
                AnalysisItem.UsagePersent = totalUsage > 0 ? AnalysisItem.AnnualUsage / totalUsage : 0;
                AnalysisItem.CostPersent = totalCost > 0 ? AnalysisItem.AnnualCost / totalCost : 0;
            }
            var orderedItemAnalysisList = itemAnalysisList.OrderByDescending(o => o.AnnualCost);
            decimal aClasstotalCostPercent = 0;
            decimal bClasstotalCostPercent = 0;
            foreach (var orderedAnalysisItem in orderedItemAnalysisList)
            {

                    if (orderedAnalysisItem.CostPersent>0 && (aClasstotalCostPercent + orderedAnalysisItem.CostPersent <= (decimal)(0.8)))
                    {
                        orderedAnalysisItem.Item.ABC = "A";
                        aClasstotalCostPercent = aClasstotalCostPercent + orderedAnalysisItem.CostPersent;
                    }
                    else if (orderedAnalysisItem.CostPersent > 0 && (bClasstotalCostPercent + orderedAnalysisItem.CostPersent <= (decimal)(0.15)) || (bClasstotalCostPercent == 0 && orderedAnalysisItem.CostPersent > 0))
                    {
                        orderedAnalysisItem.Item.ABC = "B";
                        bClasstotalCostPercent = bClasstotalCostPercent + orderedAnalysisItem.CostPersent;
                    }
                    else
                    {
                        orderedAnalysisItem.Item.ABC = "C";              
           
                    }            
             }
        }
  
        #endregion

        #region Recalculate Bincard
        #region Recalculate Bincard
        public void RecalculateBinCard(Guid storeId, Guid fiscalYearId)
        {
            try
            {

                _context.Database.CommandTimeout = int.MaxValue;
                SqlParameter param1 = new SqlParameter("@fiscalYearId", fiscalYearId);
                SqlParameter param2 = new SqlParameter("@storeId", storeId);
                var results = _context.Database.ExecuteSqlCommand("exec Recalculate @storeId,@fiscalYearId", param2, param1);
                LabelResult.Text = "Successfully completed!";
                _context.SaveChanges();
            }
            catch (Exception exception)
            {
                LabelResult.Text = "Error has occured " + exception.Message;

            }
        }
        #endregion

        #region Recalculate Bincard ForReceive
        public void RecalculateBinCardForReceive(Guid storeId, Guid fiscalYearId)
        {
            try
            {

                _context.Database.CommandTimeout = int.MaxValue;
                SqlParameter param1 = new SqlParameter("@fiscalYearId", fiscalYearId);
                SqlParameter param2 = new SqlParameter("@storeId", storeId);
                var results = _context.Database.ExecuteSqlCommand("exec RecalculateForReceiveOnly @storeId,@fiscalYearId", param2, param1);
                LabelResult.Text = "Successfully completed!";
                _context.SaveChanges();
            }
            catch (Exception exception)
            {
                LabelResult.Text = "Error has occured " + exception.Message;

            }
        }
        #endregion
        #endregion
    }
}