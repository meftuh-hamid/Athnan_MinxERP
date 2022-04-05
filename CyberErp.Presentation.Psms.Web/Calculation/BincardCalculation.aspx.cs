
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
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CyberErp.Presentation.Psms.Web.Calculation
{
    public partial class BincardCalculation : System.Web.UI.Page
    {
        private readonly DbContext _context;
        private readonly TransactionCalculation _transactionCalculation;
        private readonly Item _item;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        private readonly BaseModel<psmsStore> _store;
        private readonly BaseModel<psmsBinCard> _bincard;              
        private readonly BaseModel<psmsSetting> _setting; 
        Guid TransferReceiveVoucherType = Guid.Parse(Constants.Voucher_Type_StoreTransferReceive);
        Guid receiveVoucherType = Guid.Parse(Constants.Voucher_Type_StoreReceive);
        Guid TransferOutVoucherType = Guid.Parse(Constants.Voucher_Type_StoreTransferIssue);
     
        private IList<psmsItem> itemList = new List<psmsItem>();
        private IList<Guid> receiveBincardList = new List<Guid>();
        string query = "";
        DateTime updateFrom = DateTime.Now;
        Utility _util = new Utility();
        IList<Model.Bincard> list;    
        public BincardCalculation()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _transactionCalculation = new TransactionCalculation(_context);
            _item = new Item(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);
            _store = new BaseModel<psmsStore>(_context);
            _bincard = new BaseModel<psmsBinCard>(_context);
            _setting = new BaseModel<psmsSetting>(_context);
        }
        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);

            var action = Request.QueryString["action"];
            if (action == "RecalculateCost")
            {
                var storeId = Guid.Empty;
                var itemId = Guid.Empty;
                var storeRecord = "";
                if (Request.QueryString["storeId"] != null && Request.QueryString["storeId"] != "")
                    storeId = Guid.Parse(Request.QueryString["storeId"]);
                if (Request.QueryString["itemId"] != null && Request.QueryString["itemId"] != "")
                    itemId = Guid.Parse(Request.QueryString["itemId"]);
                if (Request.QueryString["storeRecord"] != null && Request.QueryString["storeRecord"] != "")
                    storeRecord = Request.QueryString["storeRecord"];
                var fiscalYearId = Guid.Parse(Request.QueryString["fiscalYearId"]);
                var setting = _setting.Find(o => o.Name == Constants.recalculateTime_setting_Name);
                if (setting != null)
                {
                    DateTime.TryParse(setting.Value, out updateFrom);
                }
                RecalculateBinCard(storeRecord, fiscalYearId, itemId, updateFrom);
            }
          
        }
        [WebMethod]
        public static string RecalculateStockcard(string action, string storeRecord, Guid fiscalYearId)
        {
          if (action == "RecalculateCost")
            {
                var storeId = Guid.Empty;
                var itemId = Guid.Empty;
                BincardCalculation obj = new BincardCalculation();
                var setting = obj._setting.Find(o => o.Name == Constants.recalculateTime_setting_Name);
               
               DateTime updateFrom=DateTime.Now;
                if (setting != null)
                {
                    DateTime.TryParse(setting.Value, out updateFrom);
                }
                obj.RecalculateBinCard(storeRecord, fiscalYearId, itemId, updateFrom);
            }
            return "";
    
        }
         [WebMethod]
        public static string UpdateAllCost()
        {
                BincardCalculation obj = new BincardCalculation();

                var query = "update ifmsVoucherDetail set DebitAmount=(case when cast(ifmsVoucherDetail.Remark as nvarchar(100)) ='Cost of Good Sold' then psmsBinCard.UnitCost*psmsBinCard.IssuedQuantity else 0 end),CreditAmount=(case when cast(ifmsVoucherDetail.Remark as nvarchar(500)) ='Stock' then psmsBinCard.UnitCost*psmsBinCard.IssuedQuantity else 0 end)" +
                           "from ifmsVoucherDetail inner join ifmsVoucherHeader on VoucherHeaderId=ifmsVoucherHeader.Id inner join psmsBinCard on psmsBinCard.ItemId=ifmsVoucherDetail.ItemId and psmsBinCard.VoucherTypeId=ifmsVoucherHeader.VoucherTypeId and( psmsBinCard.ReceivedQuantity=Quantity or IssuedQuantity=Quantity)" +
                           "inner join psmsStore on StoreId=psmsStore.Id where psmsBinCard.Date=ifmsVoucherHeader.Date and psmsStore.CostCenterId=ifmsVoucherDetail.CostCenterId  and Quantity>0 and substring(VoucherNo, charindex('-', VoucherNo, (charindex('-', VoucherNo, 1))+1)+1,len(VoucherNo))=ReferenceNo and ReferenceNo<>''";

                if (query != "")
                   obj._context.Database.ExecuteSqlCommand(query);

                obj._context.SaveChanges();
        
             return "";
    
        }


    
        protected void Page_Load(object sender, EventArgs e)
        {

        }
  
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
     
        #region Recalculate Bincard Cost
        public  void RecalculateBinCard(string storeRecord, Guid fiscalYearId, Guid? itemId, DateTime currentDate)
        {
            try
            {
                _context.Database.CommandTimeout = 0;
                var itemList = _item.GetAll().AsQueryable().Where(o =>(itemId!=Guid.Empty?o.Id==itemId :true) && o.psmsInventoryRecord.Where(f => f.FiscalYearId == fiscalYearId).Any()).Select(a=>a.Id).ToList();
                var storeRecordList = storeRecord.Remove(storeRecord.Length - 1).Split(';').Select(Guid.Parse).ToList();
                var storeList = _store.GetAll().AsQueryable().Where(o => storeRecordList.Contains(o.Id) && o.psmsInventoryRecord.Where(f => f.FiscalYearId == fiscalYearId).Any()).Select(a => a.Id).ToList();


                string connetionString = _util.GetConnectionString();
                DataHelper dataHelper = new DataHelper(connetionString);
                var criteria = "FiscalYearId='" + fiscalYearId + "' and psmsBinCard.UpdatedAt<='" + currentDate + "' and (VoucherTypeId='" + receiveVoucherType + "' or VoucherTypeId='" + TransferReceiveVoucherType + "' or VoucherTypeId='" + TransferOutVoucherType + "' or VoucherNo='Beginning Quantity') order by Date,psmsBincard.CreatedAt,lupVoucherType.Code,VoucherNo";
                 list = dataHelper.GetBincardTransaction(criteria).ToList();
           


                foreach(var item in itemList)
                {
                    double avrageCost = 0, unitCost = 0;Int64 nextId = 0;
                  
                    foreach(var store in storeList)
                    {
                       
                        var receiveList = list.Where(a => a.ItemId == item && a.StoreId==store && (a.VoucherTypeId==TransferReceiveVoucherType || a.VoucherTypeId==receiveVoucherType || a.VoucherNo=="Beginning Quantity") ).ToList();
                        foreach (var receive in receiveList)
                        {
                            unitCost = (double)receive.UnitCost;
                            nextId = GetNextDate(receive.IdentityId, receiveList);
                            if (item == Guid.Parse("B44AAB4C-DB2A-4020-BAAA-CC2E7D3893B3") && store == Guid.Parse("B52EF2A8-85FF-4C69-993F-727AD67941CC") && receive.VoucherNo == "GRN-02738")
                            {

                            }
                            if (nextId == 0) nextId = int.MaxValue;
                           
                            if (receive.VoucherTypeId == receiveVoucherType && receive.VoucherNo != "Beginning Quantity")
                            {
                                var currentQuantity = receive.CurrentQuantity - receive.ReceivedQuantity;
                                if (currentQuantity < 0) currentQuantity = 0;
                                avrageCost = currentQuantity > 0 ? (currentQuantity * avrageCost + receive.ReceivedQuantity * unitCost) / receive.CurrentQuantity : unitCost;
                                query = query + string.Format("update psmsbincard set AverageCost={0} where Id='{1}'", avrageCost, receive.Id);
                                avrageCost = Math.Round(avrageCost, 2);
                                query = query + string.Format("update psmsbincard set unitCost={0},AverageCost={1},UpdatedAt='{2}' where voucherno<>'Beginning Quantity' and IdentityId>{3} and IdentityId<{4} and id<>'{5}' and itemId='{6}' and storeId='{7}' and FiscalYearId='{8}'", avrageCost, avrageCost, currentDate, receive.IdentityId, nextId, receive.Id, item, store, fiscalYearId);
                            }
                            else if (receive.VoucherTypeId == TransferReceiveVoucherType && receive.VoucherNo!="Beginning Quantity")
                            {
                                unitCost = (double)GetUpdatedCost(item, receive.FromStoreId, fiscalYearId, currentDate, receive.FromVoucherId);
                                var currentQuantity = receive.CurrentQuantity - receive.ReceivedQuantity;
                                if (currentQuantity < 0) currentQuantity = 0;
                                avrageCost = currentQuantity > 0 ? (currentQuantity * avrageCost + receive.ReceivedQuantity * unitCost) / receive.CurrentQuantity : unitCost;
                                avrageCost = Math.Round(avrageCost, 2);
                                query = query + string.Format("update psmsbincard set unitCost={0}, AverageCost={1} where Id='{2}'",unitCost, avrageCost, receive.Id);
                                query = query + string.Format("update psmsbincard set unitCost={0},AverageCost={1},UpdatedAt='{2}' where voucherno<>'Beginning Quantity' and IdentityId>{3} and IdentityId<{4} and id<>'{5}' and itemId='{6}' and storeId='{7}' and FiscalYearId='{8}'", avrageCost, avrageCost, currentDate, receive.IdentityId, nextId, receive.Id, item, store, fiscalYearId);
                            } 
                            else 
                                {
                                    unitCost = (double)receive.UnitCost; avrageCost = unitCost;
                                    query = query + string.Format("update psmsbincard set unitCost={0},AverageCost={1},UpdatedAt='{2}' where voucherno<>'Beginning Quantity' and IdentityId>{3} and IdentityId<{4} and id<>'{5}' and itemId='{6}' and storeId='{7}' and FiscalYearId='{8}'", avrageCost, avrageCost,currentDate, receive.IdentityId, nextId, receive.Id, item, store, fiscalYearId);
                      
                                }
                            receive.IsCalculated = true;
                            receive.AverageCost = (decimal)avrageCost;
                        }
                    }

                }
                if (query != "")
                 _context.Database.ExecuteSqlCommand(query);

              //  LabelResult.Text = "Successfully committed";
                _context.SaveChanges();
            }
            catch (Exception exception)
            {
                LabelResult.Text = exception.Message;
            }
        }
        private decimal GetUpdatedCost(Guid itemId, Guid? storeId, Guid fiscalYearId, DateTime currentDate,Guid?fromVoucherId)
        {
            double avrageCost = 0, unitCost = 0;
            var fromBincard = list.Where(a => a.ItemId == itemId && a.StoreId == storeId && a.VoucherId == fromVoucherId).FirstOrDefault();
          if(fromBincard==null)
          {
              return 0;
          }
          else if (fromBincard.UpdatedAt==currentDate)
          {
            return  fromBincard.UnitCost;
          }
          //else if(fromBincard.IsCalculated==true)
          //{
          //    return fromBincard.AverageCost;
          //}       
           var receiveList = list.Where(a =>a.ItemId == itemId && a.StoreId == storeId && a.IdentityId <= fromBincard.IdentityId && (a.VoucherTypeId == TransferReceiveVoucherType || a.VoucherTypeId == receiveVoucherType || a.VoucherNo == "Beginning Quantity")).OrderBy(o => o.IdentityId).ToList();
           Int64 nextId = 0;      
            foreach (var receive in receiveList)
            {
               unitCost =(double) receive.UnitCost;
               nextId= GetNextDate(receive.IdentityId, receiveList);
               if (nextId == 0) nextId = fromBincard.IdentityId;
              
                if (receive.VoucherTypeId == receiveVoucherType && receive.VoucherNo != "Beginning Quantity")
                {
                    var currentQuantity = receive.CurrentQuantity - receive.ReceivedQuantity;
                    if (currentQuantity < 0) currentQuantity = 0;
                    avrageCost = currentQuantity > 0 ? (currentQuantity * avrageCost + receive.ReceivedQuantity * unitCost) / receive.CurrentQuantity : unitCost;
                    avrageCost = Math.Round(avrageCost, 2);
                    
                    query = query + string.Format("update psmsbincard set AverageCost={0} where Id='{1}'", avrageCost, receive.Id);
                    query = query + string.Format("update psmsbincard set unitCost={0},AverageCost={1},UpdatedAt='{2}' where voucherno<>'Beginning Quantity' and IdentityId>{3} and IdentityId<{4} and id<>'{5}' and itemId='{6}' and storeId='{7}' and FiscalYearId='{8}'", avrageCost, avrageCost,currentDate, receive.IdentityId, nextId, receive.Id, itemId, storeId, fiscalYearId);
                }
                else if (receive.VoucherTypeId == TransferReceiveVoucherType && receive.VoucherNo != "Beginning Quantity")
                {
                      unitCost = (double)GetUpdatedCost(itemId, receive.FromStoreId, fiscalYearId, currentDate, receive.FromVoucherId);
                    var currentQuantity = receive.CurrentQuantity - receive.ReceivedQuantity;
                    if (currentQuantity < 0) currentQuantity = 0;
                    avrageCost = currentQuantity>0 ? (currentQuantity * avrageCost + receive.ReceivedQuantity * unitCost) / receive.CurrentQuantity : unitCost;
                    avrageCost = Math.Round(avrageCost, 2);
                    query = query + string.Format("update psmsbincard set AverageCost={0} where Id='{1}'", avrageCost, receive.Id);
                }
                else
                {
                    unitCost = (double)receive.UnitCost; avrageCost = unitCost;
                    query = query + string.Format("update psmsbincard set unitCost={0},AverageCost={1},UpdatedAt='{2}' where voucherno<>'Beginning Quantity' and IdentityId>{3} and IdentityId<{4} and id<>'{5}' and itemId='{6}' and storeId='{7}' and FiscalYearId='{8}'", avrageCost, avrageCost, currentDate, receive.IdentityId, nextId, receive.Id, itemId, storeId, fiscalYearId);
                      
                }
                receive.IsCalculated = true;
                receive.AverageCost = (decimal)avrageCost;

            }

            return (decimal)avrageCost;
        }
        private long GetNextDate(long identittyId, IList<Model.Bincard> receiveList)
        {
            long nextId =0;
            var nextRecord = receiveList.Where(a => a.IdentityId > identittyId).OrderBy(a=>a.IdentityId).FirstOrDefault();
            if (nextRecord != null) nextId = nextRecord.IdentityId;
            return nextId;
        }
        #endregion

       
        #endregion
    }
}