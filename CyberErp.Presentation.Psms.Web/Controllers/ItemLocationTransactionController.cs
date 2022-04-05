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
    public class ItemLocationTransactionController : DirectController
    {

        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsItem> _item;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        private readonly BaseModel<psmsItemLocationTransaction> _itemLocationTransaction;
        private readonly BaseModel<psmsItemLocation> _itemLocation;
   
        #endregion

        #region Constructor

        public ItemLocationTransactionController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _item = new BaseModel<psmsItem>(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);
            _itemLocationTransaction = new BaseModel<psmsItemLocationTransaction>(_context);
            _itemLocation = new BaseModel<psmsItemLocation>(_context);
           }
        #endregion

        #region Actions

        public ActionResult Get(Guid id)
        {
            var objItemLocationTransaction =_itemLocationTransaction.Get(o=>o.Id==id);
            var itemLocationTransaction = new
            {
                objItemLocationTransaction.Id,
                objItemLocationTransaction.VoucherTypeId,
                objItemLocationTransaction.ItemLocationId,
                objItemLocationTransaction.VoucherId,
                objItemLocationTransaction.VoucherNumber,
                objItemLocationTransaction.Quantity
             };
            return this.Direct(new
            {
                success = true,
                data = itemLocationTransaction
            });
        }
        public ActionResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                Guid voucherId, voucherTypeId,itemId;
                Guid.TryParse(hashtable["voucherId"].ToString(), out voucherId);
                Guid.TryParse(hashtable["voucherTypeId"].ToString(), out voucherTypeId);
                Guid.TryParse(hashtable["itemId"].ToString(), out itemId);
                  var filtered = _itemLocationTransaction.GetAll().AsQueryable().Where(s => s.VoucherId == voucherId && s.VoucherTypeId==voucherTypeId && s.psmsItemLocation.ItemId==itemId);
                switch (sort)
                {
                    case "Id":
                        filtered = dir == "ASC" ? filtered.OrderBy(u => u.Id) : filtered.OrderByDescending(u => u.Id);
                        break;
                    case "VoucherNumber":
                        filtered = dir == "ASC" ? filtered.OrderBy(u => u.VoucherNumber) : filtered.OrderByDescending(u => u.VoucherNumber);
                        break;
                    case "Location":
                        filtered = dir == "ASC" ? filtered.OrderBy(u =>u.psmsItemLocation.LocationId.HasValue ? u.psmsItemLocation.psmsStoreLocation.Name : "") : filtered.OrderByDescending(u =>u.psmsItemLocation.LocationId.HasValue ? u.psmsItemLocation.psmsStoreLocation.Name : "");
                        break;
                    case "LocationBin":
                        filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsItemLocation.LocationBinId.HasValue ? u.psmsItemLocation.psmsStoreLocationBin.Name : u.psmsItemLocation.psmsStoreLocation.Name) : filtered.OrderByDescending(u => u.psmsItemLocation.LocationBinId.HasValue ? u.psmsItemLocation.psmsStoreLocationBin.Name : u.psmsItemLocation.psmsStoreLocation.Name);
                        break;
             
                    case "Quantity":
                        filtered = dir == "ASC" ? filtered.OrderBy(u => u.Quantity) : filtered.OrderByDescending(u => u.Quantity);
                        break;
                    default:
                        filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                        break;
                }
                var count = filtered.Count();
                filtered = filtered.Skip(start).Take(limit);

                var itemstores = filtered.Select(item => new
                {
                    item.Id,
                    item.VoucherNumber,
                    item.psmsItemLocation.ItemId,
                    item.psmsItemLocation.LocationId,
                    item.ItemLocationId,
                    Location=item.psmsItemLocation.LocationId.HasValue ? item.psmsItemLocation.psmsStoreLocation.Name : "",
                    LocationBin = item.psmsItemLocation.LocationBinId.HasValue ? item.psmsItemLocation.psmsStoreLocationBin.Name : item.psmsItemLocation.psmsStoreLocation.Name,
                    item.Quantity,
                   AvailableQuantity= item.psmsItemLocation.Quantity,
                    item.Remark
              
                });
             
               
                var result = new { total = count, data = itemstores.ToList() };
                return this.Direct(result);
            }
            catch (Exception ex)
            {
                return this.Direct(new { success = false, data = ex.Message });
            }
        }
        public ActionResult Save(Guid voucherId,string voucherNo,Guid voucherTypeId,Guid itemId, string itemLocationString)
        {
            using (var transaction = new TransactionScope())
            {
                try
                {

                    IList<psmsItemLocationTransaction> itemLocationList = new List<psmsItemLocationTransaction>();
                    var oldItemLocationList =_itemLocationTransaction.GetAll().AsQueryable().Where(o =>o.VoucherId==voucherId && o.psmsItemLocation.ItemId == itemId).ToList();
                    if (itemLocationString != "")
                        itemLocationString = itemLocationString.Remove(itemLocationString.Length - 1);
                    else
                    {
                        DeleteItemLocationTransaction(oldItemLocationList, itemLocationList);
                        _context.SaveChanges();
                        transaction.Complete();
                        return this.Direct(new { success = true, data = "Data has been saved successfully!" });
                    }
                    IList<string> itemLocations = itemLocationString.Split(new[] { ';' }).ToList();

                    for (var i = 0; i < itemLocations.Count(); i++)
                    {
                        var itemLocation = itemLocations[i].Split(new[] { ':' });
                        var itemLocationId = Guid.Empty ;
                        Guid.TryParse(itemLocation[0].ToString(), out itemLocationId);
                        decimal oldQuantity = 0;
                        var objItemLocation = itemLocationId !=Guid.Empty ? oldItemLocationList.Where(o => o.Id == itemLocationId).FirstOrDefault() : new psmsItemLocationTransaction();
                        oldQuantity = objItemLocation.Quantity;
                        objItemLocation.VoucherId = voucherId;
                        objItemLocation.VoucherNumber = voucherNo;
                        objItemLocation.VoucherTypeId = voucherTypeId;
                        objItemLocation.ItemLocationId = Guid.Parse(itemLocation[1]);
                        objItemLocation.Quantity = decimal.Parse(itemLocation[2]);
                        objItemLocation.Remark = itemLocation[3];
                        objItemLocation.UpdatedAt = DateTime.Now;

                        if (itemLocationId == Guid.Empty)
                        {
                            objItemLocation.CreatedAt = DateTime.Now;
                            objItemLocation.Id = Guid.NewGuid();
                            _itemLocationTransaction.AddNew(objItemLocation);
                        }
                        itemLocationList.Add(objItemLocation);
                        UpdateItemLocationBin(objItemLocation.ItemLocationId, objItemLocation.Quantity - oldQuantity);
                    }
                    
                
                    DeleteItemLocationTransaction(oldItemLocationList, itemLocationList);
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
        public void DeleteItemLocationTransaction(IList<psmsItemLocationTransaction> oldItemLocationTransactionList, IList<psmsItemLocationTransaction> itemLocationTransactionList)
        {
            foreach (var objoldsItemLocationTransaction in oldItemLocationTransactionList)
            {
                var record = itemLocationTransactionList.Where(o => o.Id == objoldsItemLocationTransaction.Id);

                if (record.Count() == 0)
                {
                    UpdateItemLocationBin(objoldsItemLocationTransaction.ItemLocationId, -objoldsItemLocationTransaction.Quantity);
                    _itemLocationTransaction.Delete(o => o.Id == objoldsItemLocationTransaction.Id);
                }
            }
        }
         #endregion

        #region Methods
        private void UpdateItemLocationBin(Guid itemLocationId, decimal Quantity)
        {
            var objItemLocationTransaction = _itemLocation.Get(o => o.Id == itemLocationId);
            objItemLocationTransaction.Quantity =objItemLocationTransaction.Quantity- Quantity;
        }
        #endregion
    }
}
