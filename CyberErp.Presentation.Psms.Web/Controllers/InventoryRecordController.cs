using System.Data.Objects;
using System.Linq;
using System.Web.Mvc;
using CyberErp.Data.Model;
using Ext.Direct.Mvc;
using CyberErp.Business.Component.Psms;

using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json;
using System;
using CyberErp.Presentation.Psms.Web.Controllers;
using CyberErp.Presentation.Psms.Web.Classes;
using System.Transactions;
using System.Data.Entity;

namespace CyberErp.Presentation.Psms.Web.Controllers
{
    public class InventoryRecordController : DirectController
    {
        #region Members


        private readonly DbContext _context;
        private readonly InventoryRecord _inventoryRecord;
        private readonly BaseModel<psmsItem> _item;
        private readonly BaseModel<psmsBinCard> _bincard;
        private readonly BaseModel<psmsStore> _store;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        private readonly BaseModel<psmsItemCategory> _itemCategory;

        #endregion

        #region Constructor

        public InventoryRecordController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _inventoryRecord = new InventoryRecord(_context);
            _item = new BaseModel<psmsItem>(_context);
            _bincard = new BaseModel<psmsBinCard>(_context);
            _store = new BaseModel<psmsStore>(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);
            _itemCategory = new BaseModel<psmsItemCategory>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(Guid id)
        {
            var objInventoryRecord = _inventoryRecord.Get(o => o.Id == id);
            var inventoryRecord = new
            {
                objInventoryRecord.Id,
                objInventoryRecord.ItemId,
                Item = objInventoryRecord.psmsItem.Name,
                ItemCode = objInventoryRecord.psmsItem.Code,
                Store = objInventoryRecord.psmsStore.Name,
                objInventoryRecord.FiscalYearId,
                objInventoryRecord.BeginingQuantity,
                objInventoryRecord.RunningQuantity,
                objInventoryRecord.AvailableQuantity,
                objInventoryRecord.PhysicalQuantity,
                objInventoryRecord.ClosingQuantity,
                objInventoryRecord.CommittedQuantity,
                objInventoryRecord.Remarks,
                objInventoryRecord.CreatedAt
            };
            return this.Direct(new
            {
                success = true,
                data = inventoryRecord
            });
        }
        public ActionResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid storeId = ht["storeId"] != null ? (ht["storeId"].ToString() == "root-unit" ? Guid.Empty : Guid.Parse(ht["storeId"].ToString())) : Guid.Empty;
            Guid fiscalYearId = ht["fiscalYearId"] != null && ht["fiscalYearId"] != "" ? Guid.Parse(ht["fiscalYearId"].ToString()) : Guid.Empty;
       
             var searchText = ht["searchText"] != null ? ht["searchText"].ToString() : "";
            Guid currentFiscalYearId = _fiscalYear.GetAll().Where(o => o.IsActive == true && o.IsClosed == false).First().Id;

            var filtered = _inventoryRecord.GetAll().AsQueryable().Where(i => i.IsClosed == false && i.StoreId == storeId && i.IsClosed == false);
            if (fiscalYearId!=Guid.Empty)
                filtered = filtered.Where(i => i.FiscalYearId == fiscalYearId);
            else
                filtered = filtered.Where(i => i.FiscalYearId == currentFiscalYearId);
       
            filtered = searchText != "" ? filtered.Where(i => i.psmsItem.Name.ToUpper().Contains(searchText.ToUpper()) ||
                i.psmsItem.Code.ToUpper().Contains(searchText.ToUpper()) ||
                i.psmsItem.PartNumber.ToUpper().Contains(searchText.ToUpper()) ||
                i.psmsItem.lupItemType.Name.ToUpper().Contains(searchText.ToUpper()) ||
                i.psmsItem.psmsItemCategory.Name.ToUpper().Contains(searchText.ToUpper())) : filtered;

            switch (sort)
            {
               
                  case "ItemCategoryName":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsItem.psmsItemCategory.Name) : filtered.OrderByDescending(u => u.psmsItem.psmsItemCategory.Name);
                    break;
                case "ItemCode":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsItem.Code) : filtered.OrderByDescending(u => u.psmsItem.Code);
                    break;
                case "PartNumber":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsItem.PartNumber) : filtered.OrderByDescending(u => u.psmsItem.PartNumber);
                    break;
                case "UnitCost":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.UnitCost) : filtered.OrderByDescending(u => u.UnitCost);
                    break;
                case "MeasurementUnit":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsItem.lupMeasurementUnit.Name) : filtered.OrderByDescending(u => u.psmsItem.lupMeasurementUnit.Name);
                    break;
                case "Store":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsStore.Name) : filtered.OrderByDescending(u => u.psmsStore.Name);
                    break;
                case "ItemCategory":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsItem.psmsItemCategory.Name) : filtered.OrderByDescending(u => u.psmsItem.psmsItemCategory.Name);
                    break;
                case "FiscalYear":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.coreFiscalYear.Name) : filtered.OrderByDescending(u => u.coreFiscalYear.Name);
                    break;
                default:
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                    break;

            }
            var count = filtered.Count();

            filtered = filtered.Skip(start).Take(limit);
          
            var inventories = filtered.Select(inventoryRecord => new
            {
                inventoryRecord.Id,
                Item = inventoryRecord.psmsItem.Name,
                inventoryRecord.ItemId,
                inventoryRecord.psmsItem.ItemCategoryId,
                ItemCategory = inventoryRecord.psmsItem.psmsItemCategory.Name,
                ItemCode = inventoryRecord.psmsItem.Code,
                PartNumber = inventoryRecord.psmsItem.PartNumber,
         
                UnitCost = inventoryRecord.UnitCost,
                TotalCost = inventoryRecord.RunningQuantity * (double)inventoryRecord.UnitCost,
                MeasurementUnit = inventoryRecord.psmsItem.lupMeasurementUnit.Name,
                inventoryRecord.StoreId,
                Store = inventoryRecord.psmsStore.Name,
                inventoryRecord.FiscalYearId,
                FiscalYear = inventoryRecord.coreFiscalYear.Name,
                inventoryRecord.BeginingQuantity,
                inventoryRecord.RunningQuantity,
                inventoryRecord.CommittedQuantity,
                inventoryRecord.AvailableQuantity,
                inventoryRecord.ExpiredQuantity,
                inventoryRecord.DamagedQuantity,
                inventoryRecord.PhysicalQuantity,
                inventoryRecord.ClosingQuantity,
                inventoryRecord.Remarks,
                inventoryRecord.ExpireyDate,
                inventoryRecord.ClosingDate,
                inventoryRecord.IsClosed
            }).ToList();

            var result = new
            {
                total = count,
                data = inventories
            };
            return this.Direct(result);
        }
        public ActionResult Delete(string ids)
        {
            using (var transaction = new TransactionScope())
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                     var idList = ids.Remove(ids.Length - 1).Split(new[] { ';' });;
                     for (int i = 0; i > idList.Count();i++ )
                     {
                         var id =Guid.Parse( idList[i]);
                         _inventoryRecord.Delete(o => o.Id == id);
                     }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Direct(new { success = true, data = "InventoryRecord has been successfully deleted!" });
                }
                catch (Exception e)
                {
                    return this.Direct(new { success = false, data = e.InnerException != null ? e.InnerException.ToString() : "Unable to Finish!" });
                }
            }
        }
        public ActionResult SaveBeginningPhysical(string rec)
        {
            var param = rec.Split(';');
            for (int i = 0; i < param.Length - 1; i++)
            {
                var row = param[i].Split(':');
                var inventoryId = row[0];
                var beginningQuantity = row[1];
                var physicalQuantity = row[2];

                Guid parsedInventoryId=Guid.Empty;
                Guid.TryParse(inventoryId, out parsedInventoryId);
                double parsedBeginning;
                double.TryParse(beginningQuantity, out parsedBeginning);
                double parsedPhysical;
                double.TryParse(physicalQuantity, out parsedPhysical);

                var inventory = _inventoryRecord.Get(o=>o.Id==parsedInventoryId);
                inventory.PhysicalQuantity = parsedPhysical;
                if (inventory.RunningQuantity > inventory.PhysicalQuantity)
                {
                    inventory.ShortageQuantity = inventory.RunningQuantity - inventory.PhysicalQuantity;
                    inventory.OverageQuantity = 0;
                }
                else if (inventory.PhysicalQuantity > inventory.RunningQuantity)
                {
                    inventory.OverageQuantity = inventory.PhysicalQuantity - inventory.RunningQuantity;
                    inventory.ShortageQuantity = 0;
                }
                else if (inventory.RunningQuantity == inventory.PhysicalQuantity)
                {
                    inventory.OverageQuantity = 0;
                    inventory.ShortageQuantity = 0;
                }
                _context.SaveChanges();
            }
            return this.Direct(new { success = true, data = "Physical quantity is saved successfully!" });
        }

        [FormHandler]
        public ActionResult Save(psmsInventoryRecord inventoryRecord)
        {
            using (var transaction = new TransactionScope())
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    Guid storeId = inventoryRecord.StoreId;
                    Guid closingYearId = Guid.Parse(Request.Params["ClosingFiscalYearId"].ToString());
                    Guid newYearId = Guid.Parse(Request.Params["NewFiscalYearId"].ToString());
                    DateTime closingDate = DateTime.Parse(Request.Params["ClosingDate"].ToString());
                    bool usePhysical = false;
                    if (Request.Params["UsePhysical"] != null && Request.Params["UsePhysical"].ToString().Equals("on"))
                        usePhysical = true;
                    else
                        usePhysical = false;
                
                   
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var voucherDetailsString = hashtable["checkedInventories"].ToString();
                    voucherDetailsString = voucherDetailsString.Remove(voucherDetailsString.Length - 1);
                    var voucherDetails = voucherDetailsString.Split(new[] { ';' });
                   
                    CloseInventory(inventoryRecord,usePhysical, voucherDetails.ToList(), storeId, closingYearId, newYearId, closingDate);

                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Direct(new { success = true, data = "InventoryRecord has been added successfully!" });
                }
                catch (Exception e)
                {
                    return this.Direct(new { success = false, data = e.InnerException != null ? e.InnerException.ToString() : "Unable to Finish!" });
                }
            }
        }
        public void CloseInventory(psmsInventoryRecord inventoryRecord,bool usePhysicalQuantity, IList<string> voucherDetails, Guid storeId, Guid closingYearId, Guid newYearId, DateTime closingDate)
        {
            List<psmsInventoryRecord> inventoryList = new List<psmsInventoryRecord>();
            List<psmsBinCard> bincardList = new List<psmsBinCard>();

            for (var i = 0; i < voucherDetails.Count(); i++)
            {
                var row = voucherDetails[i].Split(new[] { ':' });
                var inventoryId = Guid.Parse(row[0]);
                var physicalQty = double.Parse(row[1]);
                var runningQuantity = double.Parse(row[2]);
                var itemId = Guid.Parse(row[3]);
                var UnitCost = decimal.Parse(row[4]);
                var objinventory = _inventoryRecord.Get(o => o.Id == inventoryId);
                objinventory.IsClosed = true;
                var quantity = usePhysicalQuantity ? physicalQty : runningQuantity;
                var inventory = new psmsInventoryRecord
                {
                    Id = Guid.NewGuid(),
                    ItemId = itemId,
                    StoreId = storeId,
                    FiscalYearId = newYearId,
                    BeginingQuantity = quantity,
                    RunningQuantity = quantity,
                    PhysicalQuantity = 0,
                    AvailableQuantity = quantity,
                    ClosingQuantity = 0,
                    CommittedQuantity = 0,
                    ReorderLevel = objinventory.ReorderLevel,
                    MaximumLevel = objinventory.MaximumLevel,
                    SafetyStock = objinventory.SafetyStock,
                    MinimumLevel = objinventory.MinimumLevel,
                    IsClosed = false,
                    UnitCost = UnitCost
                };
                var bincard = new psmsBinCard
                {
                    Id = Guid.NewGuid(),
                    StoreId = storeId,
                    ItemId = itemId,
                    FiscalYearId = newYearId,
                    VoucherTypeId = null,
                    VoucherId =Guid.Empty,
                    Date = closingDate,
                    VoucherNo = "Beginning Quantity",
                    CurrentQuantity = quantity,
                    CurrentAmount = (decimal)(quantity * (double)UnitCost),
                    AverageCost = (decimal)UnitCost,
                    ReceivedQuantity = 0,
                    IssuedQuantity = 0,
                    UnitCost = UnitCost,
                    InAmount = UnitCost
                };
                inventoryList.Add(inventory);
                bincardList.Add(bincard);

                
                objinventory.IsClosed = true;
                objinventory.ClosingDate = closingDate;
            }

            _inventoryRecord.AddNewList(inventoryList);
            _bincard.AddNewList(bincardList);
         
        }
        public ActionResult SaveAll()
        {
            var record = Request.Form["record"];

            List<psmsInventoryRecord> inventoryRecords = JsonConvert.DeserializeObject<List<psmsInventoryRecord>>(record);

            foreach (var inventoryRecord in inventoryRecords)
            {
                _inventoryRecord.Edit(inventoryRecord);
            }
            return this.Direct(new { success = true, data = "Inventory Record has been Saved successfully!" });
        }

    
        [FormHandler]
        public ActionResult SaveInventory(psmsInventoryRecord inventory)
        {
              using (var transaction = new TransactionScope())
             {
                 _context.Database.Connection.Open();
                 _context.Database.CommandTimeout = int.MaxValue;
            try
            {
                if (inventory.Id!=Guid.Empty)
                {
                    var itemId = Guid.Parse(Request.Params["ItemId"].ToString());
                    var storeId = Guid.Parse(Request.Params["StoreId"].ToString());
                    var fiscalYearId = _fiscalYear.GetAll().Where(f => f.IsActive == true && f.IsClosed == false).First().Id;                    
                    var beginingQuantity = double.Parse(Request.Params["BeginingQuantity"].ToString());
                    var unitCost = decimal.Parse(Request.Params["UnitCost"].ToString());
                    var model = new ParameterModel {  ItemId = itemId, StoreId = storeId, FiscalYearId = fiscalYearId };

                    _inventoryRecord.AddNewInventory(model);
                }
                else
                {
                }
                _context.SaveChanges();
                transaction.Complete();
                 return this.Direct(new { success = true, data = "Item has been added to store successfully!" });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.InnerException.Message });
            }
          }
        }

        #endregion
    }
}
