using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Objects;
using CyberErp.Data.Model;
using CyberErp.Business.Component.Psms;
using CyberErp.Presentation.Psms.Web.Classes;
using Newtonsoft.Json;
using System.Transactions;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Ext.Direct.Mvc;
using System.Data.Entity;

namespace CyberErp.Presentation.Psms.Web.Controllers
{
    public class ItemStoreController : DirectController
    {

        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsStore> _store;
        private readonly BaseModel<psmsItem> _item;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        private readonly BaseModel<psmsInventoryRecord> _inventoryRecord;
        private readonly BaseModel<psmsBinCard> _binCard;
        #endregion

        #region Constructor

        public ItemStoreController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _store = new BaseModel<psmsStore>(_context);
            _item = new BaseModel<psmsItem>(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);
            _inventoryRecord = new BaseModel<psmsInventoryRecord>(_context);
            _binCard = new BaseModel<psmsBinCard>(_context);
        }
        #endregion

        #region Actions

        public ActionResult Get(Guid id)
        {
            var objItemStore = _inventoryRecord.Get(o=>o.Id==id);
            var itemStore = new
            {
                objItemStore.Id,
                objItemStore.ItemId,
                objItemStore.StoreId,
                objItemStore.BeginingQuantity,
                objItemStore.UnitCost,
                objItemStore.CreatedAt,
                ExpireyDate = objItemStore.ExpireyDate.HasValue ? objItemStore.ExpireyDate.Value.ToShortDateString() : "",
                objItemStore.ReorderLevel,
                objItemStore.MaximumLevel,
                objItemStore.SafetyStock,
            };
            return this.Direct(new
            {
                success = true,
                data = itemStore
            });
        }
        public ActionResult GetStore(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                Guid itemId;
                Guid.TryParse(hashtable["itemId"].ToString(), out itemId);
                Guid fiscalYearId = _fiscalYear.GetAll().Where(f => f.IsActive == true && f.IsClosed == false).First().Id;
                var filtered = _inventoryRecord.GetAll().AsQueryable().Where(s => s.IsClosed == false && s.ItemId == itemId && s.FiscalYearId == fiscalYearId);
                switch (sort)
                {
                
                    case "Store":
                        filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsStore.Name) : filtered.OrderByDescending(u => u.psmsStore.Name);
                        break;
                    case "Address":
                        filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsStore.Address) : filtered.OrderByDescending(u => u.psmsStore.Address);
                        break;
                    case "BeginingQuantity":
                        filtered = dir == "ASC" ? filtered.OrderBy(u => u.BeginingQuantity) : filtered.OrderByDescending(u => u.BeginingQuantity);
                        break;

                    case "UnitCost":
                        filtered = dir == "ASC" ? filtered.OrderBy(u => u.UnitCost) : filtered.OrderByDescending(u => u.UnitCost);
                        break;
                    case "ReorderLevel":
                        filtered = dir == "ASC" ? filtered.OrderBy(u => u.ReorderLevel) : filtered.OrderByDescending(u => u.ReorderLevel);
                        break;
                    case "MaximumLevel":
                        filtered = dir == "ASC" ? filtered.OrderBy(u => u.MaximumLevel) : filtered.OrderByDescending(u => u.MaximumLevel);
                        break;
                    case "SafetyStock":
                        filtered = dir == "ASC" ? filtered.OrderBy(u => u.SafetyStock) : filtered.OrderByDescending(u => u.SafetyStock);
                        break;
                    default:
                        filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                        break;
                }
                var count = filtered.Count();
                filtered = filtered.Skip(start).Take(limit);
            
                var itemstores = filtered.ToList().Select(item => new
                {
                    item.Id,
                    Store = item.psmsStore.Name,
                    Address = item.psmsStore.Address,
                    BeginningBalance = item.BeginingQuantity,
                    item.UnitCost,
                    item.ReorderLevel,
                    item.MaximumLevel,
                    item.MinimumLevel,
                    item.SafetyStock,
                    item.LeadTime,
                    ExpireyDate=item.ExpireyDate.HasValue?item.ExpireyDate.Value.ToShortDateString():"",
                    item.CarryingCost,
                    item.OrderingCost,
                    item.CreatedAt,
                });
             
               
                var result = new { total = count, data = itemstores.ToList() };
                return this.Direct(result);
            }
            catch (Exception ex)
            {
                return this.Direct(new { success = false, data = ex.Message });
            }
        }
        public ActionResult GetItems(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid itemCategoryId;
            Guid.TryParse(hashtable["itemCategoryId"].ToString(), out itemCategoryId);
            var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";

            var filtered = _item.GetAll().AsQueryable();
            if (itemCategoryId != Guid.Empty) filtered = filtered.Where(i => i.ItemCategoryId == itemCategoryId);
         
            filtered = searchText != "" ? filtered.Where(s =>

                s.Code.ToUpper().Contains(searchText.ToUpper()) ||
                s.Name.ToUpper().Contains(searchText.ToUpper()) ||
                s.psmsItemCategory.Name.ToUpper().Contains(searchText.ToUpper()) ||
                s.lupItemType.Name.ToUpper().Contains(searchText.ToUpper()) ||
                s.PartNumber.ToUpper().Contains(searchText.ToUpper()) ||
                s.lupMeasurementUnit.Name.ToUpper().Contains(searchText.ToUpper())) : filtered;
            switch (sort)
            {
               
                case "Name":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Name) : filtered.OrderByDescending(u => u.Name);
                    break;
                case "Code":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Code) : filtered.OrderByDescending(u => u.Code);
                    break;
                case "PartNumber":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.PartNumber) : filtered.OrderByDescending(u => u.PartNumber);
                    break;

                case "MeasurementUnit":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.lupMeasurementUnit.Name) : filtered.OrderByDescending(u => u.lupMeasurementUnit.Name);
                    break;
                default:
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                    break;
              }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);

            var items = filtered.Select(item => new
            {
                item.Id,
                item.Name,
                item.Code,
                item.PartNumber,
                MeasurementUnit = item.lupMeasurementUnit.Name,
                item.CreatedAt
            }).ToList();

            var result = new
            {
                total = count,
                data = items
            };
            return this.Direct(result);
        }
        public ActionResult Edit(string recordParam)
        {
            using (var transaction = new TransactionScope())
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var parameter = recordParam.Split(':');
                    var inventoryIds = parameter[0].Split(';');
                    var beginningBalanceQtys = parameter[1].Split(';');
                    var unitCosts = parameter[2].Split(';');
                    var reorderLevels = parameter[3].Split(';');
                    var maximumLevels = parameter[4].Split(';');
                    var safetyStocks = parameter[5].Split(';');
                    var leadTime = parameter[6].Split(';');
                    var orderingCost = parameter[7].Split(';');
                    var carryingCost = parameter[8].Split(';');
                    var manimumLevels = parameter[9].Split(';');
                    var expireyDates = parameter[10].Split(';');

                    for (int j = 0; j < inventoryIds.Length; j++)
                    {
                        Guid parsedInventoryId =Guid.Parse(inventoryIds[j]);
                        double parsedBeginningBalanceQty = Convert.ToDouble(beginningBalanceQtys[j]);
                        decimal parsedUnitCost = Convert.ToDecimal(unitCosts[j]);
                        double parsedReorderLevel = Convert.ToDouble(reorderLevels[j] != "null" ? reorderLevels[j] : "0");
                        double parsedMaximumLevel = Convert.ToDouble(maximumLevels[j] != "null" ? maximumLevels[j] : "0");
                        double parsedSafetyStock = Convert.ToDouble(safetyStocks[j] != "null" ? safetyStocks[j] : "0");
                        double parsedLeadTime = Convert.ToDouble(leadTime[j] != "null" ? leadTime[j] : "0");
                        double parsedOrderingCost = Convert.ToDouble(orderingCost[j] != "null" ? orderingCost[j] : "0");
                        double parsedCarryingCost = Convert.ToDouble(carryingCost[j] != "null" ? carryingCost[j] : "0");
                        double parsedMinimumLevel = Convert.ToDouble(manimumLevels[j] != "null" ? manimumLevels[j] : "0");
                        DateTime expireyDate;
                        DateTime.TryParse(expireyDates[j] != "null" ? expireyDates[j] : "0",out expireyDate);

                        UpdateInventory(parsedInventoryId, parsedBeginningBalanceQty, parsedUnitCost, parsedReorderLevel, parsedMaximumLevel, parsedSafetyStock, parsedLeadTime, parsedOrderingCost, parsedCarryingCost, parsedMinimumLevel, expireyDate);

                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Direct(new { success = true, data = "Successfully Updated!" });
                }
                catch (Exception exception)
                {
                    return this.Direct(new { success = false, data = exception.InnerException != null ? exception.InnerException.Message : exception.Message });
                }
            }
        }

        [FormHandler]
        public ActionResult Save(psmsInventoryRecord inventory)
        {
            using (var transaction = new TransactionScope())
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    Guid itemId = Guid.Parse(Request.Params["ItemId"].ToString());
                    Guid storeId = Guid.Parse(Request.Params["StoreId"].ToString());
                    var fiscalYear = _fiscalYear.GetAll().Where(f => f.IsActive == true && f.IsClosed == false).FirstOrDefault();
                    var fiscalYearId = fiscalYear.Id;
                    var inventoryRecords = _inventoryRecord.GetAll().AsQueryable().Where(i => i.IsClosed == false && i.ItemId == itemId && i.StoreId == storeId && i.FiscalYearId == fiscalYearId);
                    if (inventoryRecords.Any())
                    {
                        return this.Direct(new { success = false, data = "Item has already been added to store!" });
                    }

                    decimal beginningqty = decimal.Parse(Request.Params["BeginingQuantity"].ToString());
                    decimal reorderlevel = decimal.Parse(Request.Params["ReorderLevel"].ToString());
                   
                    decimal currentqty = beginningqty;
                    decimal receivedqty = 0;
                    decimal unitcost = decimal.Parse(Request.Params["UnitCost"].ToString());
                    decimal averagecost = unitcost;
                    decimal inamount = currentqty * unitcost;
                    decimal currentamount = currentqty * unitcost;

                    if (inventory.Id==Guid.Empty)
                    {
                        Guid inventoryId = Guid.NewGuid();
                        _context.Database.ExecuteSqlCommand(
                               "insert into psmsInventoryRecord(StoreId,ItemId,FiscalYearId,BeginingQuantity,RunningQuantity,AvailableQuantity,UnitCost,CommittedQuantity,PhysicalQuantity,ClosingQuantity,IsDeleted,ReorderLevel,MaximumLevel,SafetyStock,IsClosed,Id,CreatedAt,UpdatedAt,leadTime,OrderingCost,CarryingCost,MinimumLevel) values({0},{1},{2},{3},{4},{5},{6},{7},{8},{9},0,{10},{11},{12},0,{13},{14},{15},{16},{17},{18},{19})", storeId, itemId, fiscalYear.Id, beginningqty, beginningqty, beginningqty, unitcost, 0, 0, reorderlevel, 0, 0, 0, inventoryId, DateTime.Now, DateTime.Now, 0, 0, 0, 0);
                        var model = new ParameterModel { VoucherId = inventoryId, VoucherTypeId = Guid.Empty, VoucherNo = "Beginning Quantity", ItemId = itemId, StoreId = storeId, FiscalYearId = fiscalYear.Id, Quantity = (double)beginningqty, UnitCost = unitcost };
                         _context.Database.ExecuteSqlCommand(
                               "insert into psmsBinCard(StoreId,ItemId,FiscalYearId,VoucherTypeId,VoucherId,VoucherNo,CurrentQuantity,ReceivedQuantity,IssuedQuantity,UnitCost,AverageCost,InAmount,OutAmount,CurrentAmount,Date,IsDeleted,Id,CreatedAt,UpdatedAt,itemCostId) values({0},{1},{2},{3},{4},{5},{6},{7},0,{8},{9},{10},0,{11},{12},0,{13},{14},{15},{16})", storeId, itemId, fiscalYear.Id, null, Guid.Empty, "Beginning Quantity", currentqty, receivedqty, unitcost, averagecost, inamount, currentamount, fiscalYear.StartDate, Guid.NewGuid(), DateTime.Now, DateTime.Now, Guid.Empty);

                    }
                    _context.SaveChanges();
                    transaction.Complete();
                     return this.Direct(new { success = true, data = "Item has been added to store successfully!" });
                }
                catch (Exception exception)
                {
                    return this.Direct(new { success = false, data = exception.Message });
                }
            }
        }

         #endregion

        #region Methods
        private void UpdateInventory(Guid inventoryId, double beginningBalanceQty, decimal unitCost, double reorderLevel, double maximumLevel, double safetyStock, double leadTime, double orderingCost, double carryingCost, double minimumLevel,DateTime ? expireyDate)
        {
             var objInventoryRecord = _inventoryRecord.Get(o => o.Id == inventoryId);
            var fiscalYearId = _fiscalYear.GetAll().Where(f => f.IsActive == true && f.IsClosed == false).First().Id;
            var itemBinCardsList = _binCard.GetAll().AsQueryable().Where(o =>  o.StoreId == objInventoryRecord.StoreId && o.ItemId == objInventoryRecord.ItemId && o.FiscalYearId == fiscalYearId);

            var beginingBinCard = itemBinCardsList.Where(o => (o.VoucherNo == "Begining Quantity" || o.VoucherNo == "Beginning Quantity")).OrderByDescending(o => o.CreatedAt);
                objInventoryRecord.BeginingQuantity = beginningBalanceQty;
                if (itemBinCardsList.Count() == 1)
                {
                    objInventoryRecord.RunningQuantity = beginningBalanceQty;
                    objInventoryRecord.AvailableQuantity = beginningBalanceQty;
                    objInventoryRecord.UnitCost = unitCost;
                    }
                objInventoryRecord.ReorderLevel = reorderLevel;
                objInventoryRecord.MaximumLevel = maximumLevel;
                objInventoryRecord.SafetyStock = safetyStock;
                objInventoryRecord.LeadTime = leadTime;
                objInventoryRecord.OrderingCost = orderingCost;
                objInventoryRecord.CarryingCost = carryingCost;
                objInventoryRecord.MinimumLevel = minimumLevel;
                if (expireyDate != null && expireyDate.HasValue && expireyDate.Value.ToShortDateString() != "1/1/0001")
                    objInventoryRecord.ExpireyDate = expireyDate.Value;
           
                var query = string.Format("Update  psmsBinCard set CurrentQuantity={0},ReceivedQuantity={1},IssuedQuantity={2},UnitCost={3},AverageCost={4},OutAmount=0,InAmount={5},CurrentAmount={6} where ItemId='{7}'  and storeId='{8}' and FiscalYearId='{9}' and voucherNo='Beginning Quantity'", beginningBalanceQty, beginningBalanceQty, 0, unitCost, unitCost,(decimal)beginningBalanceQty * unitCost, (decimal)beginningBalanceQty * unitCost, objInventoryRecord.ItemId, objInventoryRecord.StoreId, objInventoryRecord.FiscalYearId);
              _context.Database.ExecuteSqlCommand(
                  query
           ); 

        }
        #endregion
    }
}
