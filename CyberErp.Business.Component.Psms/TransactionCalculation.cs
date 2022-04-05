using CyberErp.Business.Component.Psms;
using CyberErp.Data.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;

namespace CyberErp.Business.Component.Psms
{
    public class TransactionCalculation : BaseModel<psmsItem>
    {
        private readonly DbContext _dbContext;
        private readonly BaseModel<psmsIssueDetail> _issueDetail;
        private readonly BaseModel<psmsReturnDetail> _returnDetail;
      
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        private readonly BaseModel<psmsPurchaseOrderDetail> _purchaseOrderDetail;
        private readonly BaseModel<psmsReceiveDetail> _receiveDetail;
        public Guid Voucher_Status_Approved =Guid.Parse( "05b21fc5-5afc-4b54-b9ad-19b44518b443");
    
        public TransactionCalculation(DbContext dbContext)
            : base(dbContext)
        {
            _dbContext = dbContext;
             _issueDetail = new BaseModel<psmsIssueDetail>(_dbContext);
             _fiscalYear = new BaseModel<coreFiscalYear>(_dbContext);
             _purchaseOrderDetail = new BaseModel<psmsPurchaseOrderDetail>(_dbContext);
             _receiveDetail = new BaseModel<psmsReceiveDetail>(_dbContext);
             _returnDetail = new BaseModel<psmsReturnDetail>(_dbContext);
        }
        public Decimal CalculateDialyUsageUnit(Guid itemId, List<string> storeIdList,DateTime startDate,DateTime endDate)
        {
            decimal issuePerDay = 0;

            List<decimal> transactionList = new List<decimal>();
            for (var i = 0; i < storeIdList.Count(); i++)
            {
                var storeId =Guid.Parse(storeIdList[i]);
                var issuetransaction = _issueDetail.GetAll().AsQueryable().Where(o => o.psmsIssueHeader.IssuedDate >= startDate && o.psmsIssueHeader.IssuedDate <= endDate && o.psmsIssueHeader.StatusId == Voucher_Status_Approved && o.ItemId == itemId && o.psmsIssueHeader.StoreId == storeId).Select(o => o.IssuedQuantity.Value);
                var returntransaction = _returnDetail.GetAll().AsQueryable().Where(o => o.psmsReturnHeader.ReturnedDate >= startDate && o.psmsReturnHeader.ReturnedDate <= endDate && o.psmsReturnHeader.StatusId == Voucher_Status_Approved && o.ItemId == itemId && o.psmsReturnHeader.StoreId == storeId).Select(o => -o.ReturnedQuantity.Value);
                
                transactionList.AddRange(issuetransaction);
                transactionList.AddRange(returntransaction);
            }
            if(transactionList.Any())
            {

                    var totalDays = decimal.Parse(endDate.Subtract(startDate).TotalDays.ToString()) + 1;
                    var totalIssue = transactionList.DefaultIfEmpty(0).Sum();
                    issuePerDay = totalIssue / totalDays;
            }
            return issuePerDay;
        }
        public Decimal CalculateAnnualUsageUnit(Guid itemId, List<string> storeIdList, DateTime startDate, DateTime endDate)
        {
            decimal totalIssue = 0;

             List<decimal> transactionList = new List<decimal>();
            for (var i = 0; i < storeIdList.Count(); i++)
            {
                var storeId = Guid.Parse(storeIdList[i]);
                var issuetransaction = _issueDetail.GetAll().AsQueryable().Where(o => o.psmsIssueHeader.IssuedDate >= startDate && o.psmsIssueHeader.IssuedDate <= endDate && o.psmsIssueHeader.StatusId == Voucher_Status_Approved  && o.ItemId == itemId && o.psmsIssueHeader.StoreId == storeId).Select(o => o.IssuedQuantity.Value);
                 var returntransaction = _returnDetail.GetAll().AsQueryable().Where(o => o.psmsReturnHeader.ReturnedDate >= startDate && o.psmsReturnHeader.ReturnedDate <= endDate && o.psmsReturnHeader.StatusId == Voucher_Status_Approved  && o.ItemId == itemId && o.psmsReturnHeader.StoreId == storeId).Select(o => -o.ReturnedQuantity.Value);

                transactionList.AddRange(issuetransaction);
                 transactionList.AddRange(returntransaction);
    
    
                }
            if (transactionList.Any())
            {
                 totalIssue = transactionList.DefaultIfEmpty(0).Sum();
              
            }
            return totalIssue;
        }
        public Decimal CalculateAnnualUsageCost(Guid itemId, List<string> storeIdList, DateTime startDate, DateTime endDate)
        {
            decimal totalIssue = 0;

             List<decimal> transactionList = new List<decimal>();
            for (var i = 0; i < storeIdList.Count(); i++)
            {
                var storeId = Guid.Parse(storeIdList[i]);
                var issuetransaction = _issueDetail.GetAll().AsQueryable().Where(o => o.psmsIssueHeader.IssuedDate >= startDate && o.psmsIssueHeader.IssuedDate <= endDate && o.psmsIssueHeader.StatusId == Voucher_Status_Approved && o.ItemId == itemId && o.psmsIssueHeader.StoreId == storeId).Select(o => o.IssuedQuantity.Value*o.UnitCost.Value);
                var returntransaction = _returnDetail.GetAll().AsQueryable().Where(o => o.psmsReturnHeader.ReturnedDate >= startDate && o.psmsReturnHeader.ReturnedDate <= endDate && o.psmsReturnHeader.StatusId == Voucher_Status_Approved && o.ItemId == itemId && o.psmsReturnHeader.StoreId == storeId).Select(o => -o.ReturnedQuantity.Value*o.UnitCost);

                transactionList.AddRange(issuetransaction);
                transactionList.AddRange(returntransaction);
    
    
            }
            if (transactionList.Any())
            {
                totalIssue = transactionList.DefaultIfEmpty(0).Sum();
            }
            return totalIssue;
        }

        public double CalculateLeadTime(Guid itemId, List<string> storeIdList, DateTime startDate, DateTime endDate)
        {
            double leadTime = 0;

            List<psmsReceiveDetail> transactionList = new List<psmsReceiveDetail>();
            for (var i = 0; i < storeIdList.Count(); i++)
            {
                var storeId = Guid.Parse(storeIdList[i]);
                var transaction = _receiveDetail.GetAll().AsQueryable().Where(o => o.psmsReceiveHeader.ReceivedDate >= startDate && o.psmsReceiveHeader.ReceivedDate <= endDate && o.ItemId == itemId && o.psmsReceiveHeader.StoreId == storeId);
                transactionList.AddRange(transaction);
            }
            if (transactionList.Any())
            {
                var totalDays = transactionList.Sum(o => o.psmsReceiveHeader.ReceivedDate.Subtract(o.psmsReceiveHeader.psmsPurchaseOrderHeader.OrderedDate).TotalDays + 1);
                var totalPurchase = transactionList.Count();
                leadTime = (totalDays / totalPurchase);
            }
            return leadTime;
        }
        public double CalculateSafetyStock(decimal averageDialyUsage, double leadTime, decimal saftyGuardPercent)
        {
            double safetyStock = 0;
            safetyStock = (double)((decimal)leadTime * averageDialyUsage * saftyGuardPercent);
            return safetyStock;
        }
       
        public double CalculateReorderLevel(decimal averageDialyUsage, double leadTime, double saftyStock)
        {
            double reorderLevel = 0;
            reorderLevel = (leadTime * (double)averageDialyUsage) + saftyStock;
            return reorderLevel;
        }



    }
}
