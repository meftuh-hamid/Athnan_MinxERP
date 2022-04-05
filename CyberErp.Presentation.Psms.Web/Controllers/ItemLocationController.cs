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
    public class ItemLocationController : DirectController
    {

        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsItem> _item;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        private readonly BaseModel<psmsItemLocation> _itemLocation;
        #endregion

        #region Constructor

        public ItemLocationController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _item = new BaseModel<psmsItem>(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);
            _itemLocation = new BaseModel<psmsItemLocation>(_context);
           }
        #endregion

        #region Actions

        public ActionResult Get(Guid id)
        {
            var objItemLocation =_itemLocation.Get(o=>o.Id==id);
            var itemLocation = new
            {
                objItemLocation.Id,
                objItemLocation.ItemId,
                objItemLocation.StoreId,
                objItemLocation.Quantity,
                Store=objItemLocation.psmsStore.Name,
                objItemLocation.LocationId,
                Location=objItemLocation.LocationId.HasValue?objItemLocation.psmsStoreLocation.Name:"",
                objItemLocation.LocationBinId,
                LocationBin = objItemLocation.LocationId.HasValue ? objItemLocation.psmsStoreLocationBin.Name : "",          
                objItemLocation.Remark,
            };
            return this.Direct(new
            {
                success = true,
                data = itemLocation
            });
        }
        public ActionResult GetLocation(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                Guid itemId;
                Guid.TryParse(hashtable["itemId"].ToString(), out itemId);
                Guid fiscalYearId = _fiscalYear.GetAll().Where(f => f.IsActive == true && f.IsClosed == false).First().Id;
                var filtered =_itemLocation.GetAll().AsQueryable().Where(s => s.ItemId == itemId);
                switch (sort)
                {
                    case "Id":
                        filtered = dir == "ASC" ? filtered.OrderBy(u => u.Id) : filtered.OrderByDescending(u => u.Id);
                        break;

                    case "Store":
                        filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsStore.Name) : filtered.OrderByDescending(u => u.psmsStore.Name);
                        break;
                    case "StoreWithLocation":
                        filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsStore.Name + " " + (u.LocationId.HasValue ? u.psmsStoreLocation.Name : "")) : filtered.OrderByDescending(u => u.psmsStore.Name + " " + (u.LocationId.HasValue ? u.psmsStoreLocation.Name : ""));
                        break;
                    case "Quantity":
                        filtered = dir == "ASC" ? filtered.OrderBy(u => u.Quantity) : filtered.OrderByDescending(u => u.Quantity);
                        break;

                    case "Location":
                        filtered = dir == "ASC" ? filtered.OrderBy(u => u.LocationId.HasValue ? u.psmsStoreLocation.Name : "") : filtered.OrderByDescending(u => u.LocationId.HasValue ? u.psmsStoreLocation.Name : "");
                        break;
                    case "LocationBin":
                        filtered = dir == "ASC" ? filtered.OrderBy(u => u.LocationBinId.HasValue ? u.psmsStoreLocationBin.Name : "") : filtered.OrderByDescending(u => u.LocationBinId.HasValue ? u.psmsStoreLocationBin.Name : "");
                        break;

                    case "Remark":
                        filtered = dir == "ASC" ? filtered.OrderBy(u => u.Remark) : filtered.OrderByDescending(u => u.Remark);
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
                    item.ItemId,
                    item.StoreId,
                    item.Quantity,
                    Store = item.psmsStore.Name,
                    item.LocationId,
                    Location = item.LocationId.HasValue ? item.psmsStoreLocation.Name : "",
                    StoreWithLocation=item.psmsStore.Name+" "+(item.LocationId.HasValue ? item.psmsStoreLocation.Name : ""),
                    item.LocationBinId,
                    LocationBin = item.LocationId.HasValue ? item.psmsStoreLocationBin.Name : "",
                    item.Remark,

                });
             
               
                var result = new { total = count, data = itemstores.ToList() };
                return this.Direct(result);
            }
            catch (Exception ex)
            {
                return this.Direct(new { success = false, data = ex.Message });
            }
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
                    var itemLocationIds = parameter[0].Split(';');
                    var quantity = parameter[1].Split(';');
                        
                    for (int j = 0; j < itemLocationIds.Length; j++)
                    {
                        Guid parsedItemLocationId =Guid.Parse(itemLocationIds[j]);
                        decimal parsedQuantity = Convert.ToDecimal(quantity[j]);
                                    
                        UpdateItemLocation(parsedItemLocationId, parsedQuantity);

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

        public ActionResult Delete(Guid id)
        {

            var objInventoryRecord =_itemLocation.Get(o => o.Id == id);          
             _context.SaveChanges();
            return this.Direct(new { success = true, data = "Data has been successfully deleted!" });
        }
        [FormHandler]
        public ActionResult Save(psmsItemLocation itemLocation)
        {
            using (var transaction = new TransactionScope())
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {

                    var objItemLocation = _itemLocation.GetAll().AsQueryable().Where(i => i.ItemId == itemLocation.ItemId && i.StoreId == itemLocation.StoreId && i.LocationId == itemLocation.LocationId && i.LocationBinId==itemLocation.LocationBinId && i.Id!=itemLocation.Id);
                    if (objItemLocation.Any())
                    {
                        return this.Direct(new { success = false, data = "Data already exists!" });
                    }
                    itemLocation.Id = Guid.NewGuid();
                    itemLocation.CreatedAt = DateTime.Now;
                    itemLocation.UpdatedAt = DateTime.Now;
                    _itemLocation.AddNew(itemLocation);
                    _context.SaveChanges();
                    transaction.Complete();
                     return this.Direct(new { success = true, data = "data has been successfully added!" });
                }
                catch (Exception exception)
                {
                    return this.Direct(new { success = false, data = exception.Message });
                }
            }
        }

         #endregion

        #region Methods
        private void UpdateItemLocation(Guid itemLocationId, decimal Quantityt)
        {
            var objItemLocation= _itemLocation.Get(o => o.Id == itemLocationId);
            objItemLocation.Quantity = Quantityt;
        }
        #endregion
    }
}
