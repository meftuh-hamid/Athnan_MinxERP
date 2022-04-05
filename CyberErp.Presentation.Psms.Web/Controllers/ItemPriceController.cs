using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CyberErp.Business.Component;
using System.Data.Objects;
using CyberErp.Data.Model;
using System.Collections;
using CyberErp.Business.Component.Psms;
using Newtonsoft.Json;
using CyberErp.Presentation.Psms.Web.Classes;
using Ext.Direct.Mvc;
using System.Data.Entity;
using System.Transactions;

namespace CyberErp.Presentation.Psms.Web.Controllers
{
    public class ItemPriceController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<slmsItemPrice> _itemPrice;
        private readonly BaseModel<psmsSetting> _setting;
        private readonly BaseModel<psmsItem> _item;
     
        #endregion

        #region Constructor

        public ItemPriceController()
        {
            _context = new ErpEntities(Constants.ConnectionString);       
            _itemPrice = new BaseModel<slmsItemPrice>(_context);
            _setting = new BaseModel<psmsSetting>(_context);
            _item = new BaseModel<psmsItem>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(Guid id)
        {
            var objItemPrice = _itemPrice.Get(o=>o.Id==id);
            var itemPrice = new
            {
                objItemPrice.Id,
                objItemPrice.IsActive,               
                objItemPrice.ItemId,
                objItemPrice.WithHoldingTax,
                objItemPrice.PriceCategoryId,
                PriceCategory=objItemPrice.slmsPriceCategory.Name,
                Item=objItemPrice.psmsItem.Name,
                objItemPrice.psmsItem.Code,
                objItemPrice.IsTaxable,
                objItemPrice.Remark,
                objItemPrice.PriceGroupId,
                PriceGroup=objItemPrice.lupPriceGroup.Name,
                objItemPrice.UnitId,
                Unit=objItemPrice.lupMeasurementUnit.Name,
                objItemPrice.UnitPrice,
                objItemPrice.CreatedAt
            };
            return this.Direct(new
            {
                success = true,
                data = itemPrice
            });

        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid priceCategoryId; Guid itemCategoryId = Guid.Empty; Guid priceGroupId = Guid.Empty; string searchText = "";
            DateTime effectiveDate=DateTime.Now;
            Guid.TryParse(hashtable["priceCategoryId"].ToString(), out priceCategoryId);
            if (hashtable["itemCategoryId"] !=null)
            Guid.TryParse(hashtable["itemCategoryId"].ToString(), out itemCategoryId);
            if (hashtable["priceGroupId"] != null)
                Guid.TryParse(hashtable["priceGroupId"].ToString(), out priceGroupId);
            
            searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
            var filtered = _itemPrice.GetAll().AsQueryable().Where(o =>o.PriceCategoryId == priceCategoryId );
            if(itemCategoryId!=Guid.Empty)
                filtered=filtered.Where(o=>o.psmsItem.ItemCategoryId==itemCategoryId || o.psmsItem.psmsItemCategory.ParentId==itemCategoryId);
            if (priceGroupId != Guid.Empty)
               filtered = filtered.Where(o => o.PriceGroupId == priceGroupId);
          
            filtered = searchText != "" ? filtered.Where(i =>

                i.psmsItem.Name.ToUpper().Contains(searchText.ToUpper()) ||
                i.psmsItem.Code.ToUpper().Contains(searchText.ToUpper())||
                i.psmsItem.PartNumber.ToUpper().Contains(searchText.ToUpper()) ||
                i.psmsItem.Supplier.ToUpper().Contains(searchText.ToUpper()) ||
                i.lupPriceGroup.Name.ToUpper().Contains(searchText.ToUpper())
                )
                : filtered;
            switch (sort)
            {

                     case "Item":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsItem.Name) : filtered.OrderByDescending(u => u.psmsItem.Name);
                    break;
                case "Code":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsItem.Code) : filtered.OrderByDescending(u => u.psmsItem.Code);
                    break;
                case "PartNumber":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsItem.PartNumber) : filtered.OrderByDescending(u => u.psmsItem.PartNumber);
                    break;
                case "Supplier":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsItem.Supplier) : filtered.OrderByDescending(u => u.psmsItem.Supplier);
                    break;
                case "Unit":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.lupMeasurementUnit.Name) : filtered.OrderByDescending(u => u.lupMeasurementUnit.Name);
                    break;
                case "PriceGroup":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.lupPriceGroup.Name) : filtered.OrderByDescending(u => u.lupPriceGroup.Name);
                    break;
                case "IsActive":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.IsActive) : filtered.OrderByDescending(u => u.IsActive);
                    break;
                case "IsTaxable":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.IsTaxable) : filtered.OrderByDescending(u => u.IsTaxable);
                    break;
              
                default:
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                    break;
                }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);

            var stores = filtered.Select(item => new
            {
                item.Id,
                item.IsActive,
                Item = item.psmsItem.Name,
                item.psmsItem.Code,
                item.psmsItem.PartNumber,
                PriceCategory = item.slmsPriceCategory.Name,
                item.psmsItem.Supplier,
                item.IsTaxable,
                PriceGroup = item.lupPriceGroup.Name,
                Unit = item.lupMeasurementUnit.Name,
                item.Remark,
                item.WithHoldingTax,
                item.UnitPrice,


            }).ToList();
            var result = new
            {
                total = count,
                data = stores
            };
            return this.Direct(result);
        }
        [FormHandler]
        public ActionResult Save(slmsItemPrice itemPrice)
        {
             try
            {
                var objItemPrice = _itemPrice.Find(o => (o.ItemId == itemPrice.ItemId && o.PriceCategoryId==itemPrice.PriceCategoryId &&
                    o.PriceGroupId==itemPrice.PriceGroupId
                    ) && o.Id != itemPrice.Id);
                if (objItemPrice != null)
                {
                    var result = new { success = false, data = "Data has already been registered!" };
                    return this.Direct(result);
                }
                if (Request.Params["IsTaxable"] != null && Request.Params["IsTaxable"].ToString().Equals("on"))
                    itemPrice.IsTaxable = true;
                else
                    itemPrice.IsTaxable = false;
                if (Request.Params["IsActive"] != null && Request.Params["IsActive"].ToString().Equals("on"))
                    itemPrice.IsActive = true;
                else
                    itemPrice.IsActive = false;
             
                if (itemPrice.Id==Guid.Empty)
                {
                    itemPrice.Id = Guid.NewGuid();
                    itemPrice.CreatedAt = DateTime.Now;
                    itemPrice.UpdatedAt = DateTime.Now;               
                    _itemPrice.AddNew(itemPrice);
                }
                else
                {
                    itemPrice.UpdatedAt = DateTime.Now;
                    _itemPrice.Edit(itemPrice);
                }
                _context.SaveChanges();
                return this.Direct(new { success = true, data = "Data has been added successfully!" });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }

        public ActionResult Delete(Guid id)
        {
             
            _itemPrice.Delete(o=>o.Id==id);
            _context.SaveChanges();
            return this.Direct(new { success = true, data = "Item Category has been successfully deleted!" });
        }

        public ActionResult SaveItemPriceList(string itemPriceString)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = System.Transactions.IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;

                try
                {
                     
                    if (itemPriceString != "")
                        itemPriceString = itemPriceString.Remove(itemPriceString.Length - 1);

                    IList<string> itemPriceList = itemPriceString.Split(new[] { ';' }).ToList();
                    for (var i = 0; i < itemPriceList.Count(); i++)
                    {
                        var itemPrice = itemPriceList[i].Split(new[] { ':' });
                        var itemPriceId = Guid.Empty;
                        Guid.TryParse(itemPrice[0].ToString(), out itemPriceId);
                        var objItemPrice = _itemPrice.GetAll().AsQueryable().Where(o => o.Id == itemPriceId).FirstOrDefault();
                         objItemPrice.UnitPrice = decimal.Parse(itemPrice[1]);
                        }

                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Direct(new { success = true, data = "Data has been saved successfully!" });

                }
                catch (Exception e)
                {
                    return this.Direct(new { success = false, data = e.InnerException != null ? e.InnerException.Message : e.Message });

                }
            }

        }
 
        #endregion

        #region Methods

 

        #endregion

    }
}
