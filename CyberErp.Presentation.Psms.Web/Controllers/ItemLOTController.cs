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

namespace CyberErp.Presentation.Web.Psms.Controllers
{
    public class ItemLOTController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsItemLOT> _itemLOT;
        

        #endregion

        #region Constructor

        public ItemLOTController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _itemLOT = new BaseModel<psmsItemLOT>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(Guid ids)
        {
            var objitemLOT = _itemLOT.Get(o => o.Id == ids);
            var item = new
            {
                objitemLOT.Id,
                objitemLOT.Number,
                objitemLOT.ItemId,
                objitemLOT.CommittedQuantity,
                ExpiredDate=objitemLOT.ExpiredDate.HasValue?objitemLOT.ExpiredDate.Value.ToShortDateString():"",
                ManufacturedDate=objitemLOT.ManufacturedDate.HasValue?objitemLOT.ManufacturedDate.Value.ToShortDateString():"",
                objitemLOT.Quantity,
                objitemLOT.Manufacturer,
                objitemLOT.StoreId,
                Store=objitemLOT.psmsStore.Name,
                objitemLOT.Remark,
                objitemLOT.CreatedAt
            };
            return this.Direct(new
            {
                success = true,
                data = item
            });
        }        
        public ActionResult GetAll(int start, int limit, string sort, string dir , string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            var searchText=hashtable["searchText"]!=null?hashtable["searchText"].ToString():"";
            var itemId = hashtable["itemId"] != null && hashtable["itemId"] != "" ? Guid.Parse(hashtable["itemId"].ToString()) : Guid.Empty;
            var storeId = hashtable["storeId"] != null && hashtable["storeId"] != "" ? Guid.Parse(hashtable["storeId"].ToString()) : Guid.Empty;
            var itemLOTId = hashtable["itemLOTId"] != null && hashtable["itemLOTId"] != "" ? Guid.Parse(hashtable["itemLOTId"].ToString()) : Guid.Empty;
        
          
            DateTime date = new DateTime();
            decimal quantity =0;
            bool isDatestring = DateTime.TryParse(searchText, out date);
            bool isNumber = decimal.TryParse(searchText, out quantity);

            var filtered =  _itemLOT.GetAll().AsQueryable().Where(o=>o.ExpiredDate.HasValue?o.ExpiredDate>DateTime.Now:true);

            if (itemLOTId == Guid.Empty) filtered = filtered.Where(o => o.ItemId == itemId);
            if (itemLOTId == Guid.Empty) filtered = filtered.Where(o => o.StoreId == storeId);
            if (itemLOTId != Guid.Empty) filtered = filtered.Where(o => o.Id == itemLOTId);
         
            filtered = searchText != "" ? filtered.Where(i =>

                i.Number.ToUpper().Contains(searchText.ToUpper()) ||
                i.psmsStore.Name.ToUpper().Contains(searchText.ToUpper()) ||
                i.psmsItem.Name.ToUpper().Contains(searchText.ToUpper()) ||
                i.psmsItem.Code.ToUpper().Contains(searchText.ToUpper()) ||
                i.psmsItem.PartNumber.ToUpper().Contains(searchText.ToUpper()) ||
             
                (isDatestring ? i.ExpiredDate >= date.Date : false) ||
                (isDatestring ? i.ManufacturedDate >= date : false) ||
                (isNumber ? i.Quantity >= quantity : false) ||
                (isNumber ? i.CommittedQuantity >= quantity : false)
                
                ): filtered;
            switch (sort)
            {
                   case "Item":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsItem.Name) : filtered.OrderByDescending(u => u.psmsItem.Name);
                    break;
                case "Number":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Number) : filtered.OrderByDescending(u => u.Number);
                    break;
                case "ExpiredDate":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.ExpiredDate) : filtered.OrderByDescending(u => u.ExpiredDate);
                    break;
                case "ManufacturedDate":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.ManufacturedDate) : filtered.OrderByDescending(u => u.ManufacturedDate);
                    break;
             case "Store":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsStore.Name) : filtered.OrderByDescending(u => u.psmsStore.Name);
                    break;
               case "Quantity":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Quantity) : filtered.OrderByDescending(u => u.Quantity);
                    break;
              case "CommittedQuantity":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.CommittedQuantity) : filtered.OrderByDescending(u => u.CommittedQuantity);
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
         
           var itemLOTs = filtered.Select(item => new
            {
                item.Id,
                item.ItemId,
                Item=item.psmsItem.Name,
                item.Number,
                item.CommittedQuantity,
                ExpiredDate = item.ExpiredDate,
                ManufacturedDate = item.ManufacturedDate,
                item.Quantity,
                item.Manufacturer,
                item.StoreId,
                Store = item.psmsStore.Name,
                item.Remark,
                item.CreatedAt
     
            }).ToList().Select(item => new
            {
                item.Id,
                item.ItemId,
                item.Item,
                item.Number,
                item.CommittedQuantity,
                ExpiredDate = item.ExpiredDate.HasValue ? item.ExpiredDate.Value.ToShortDateString() : "",
                ManufacturedDate = item.ManufacturedDate.HasValue ? item.ManufacturedDate.Value.ToShortDateString() : "",
                item.Quantity,
                item.Manufacturer,
                item.StoreId,
                Store = item.Store,
                item.Remark,
                item.CreatedAt
     
            }).ToList();
            var result = new
            {
                total = count,
                data = itemLOTs
            };
            return this.Direct(result);
        } 
        public ActionResult Delete(Guid id)
        {
          
            _itemLOT.Delete(o=>o.Id==id);
         
            return this.Direct(new { success = true, data = "Data has been successfully deleted!" });
        }

        [FormHandler]
        public ActionResult Save(psmsItemLOT objitemLOT)
        {
            try
            {
                var itemLOT = _itemLOT.Find(c => c.Number.ToUpper() == objitemLOT.Number.ToUpper() && c.Id != objitemLOT.Id);
                if (itemLOT != null)
                {
                    var result = new { success = false, data = "Data has already been registered!" };
                    return this.Direct(result);
                }
                if (objitemLOT.Id == Guid.Empty)
                {
                    objitemLOT.Id = Guid.NewGuid();
                    objitemLOT.CreatedAt = DateTime.Now;
                    objitemLOT.UpdatedAt = DateTime.Now;
                    _itemLOT.AddNew(objitemLOT);
                }
                else
                {
                    objitemLOT.UpdatedAt = DateTime.Now;
                    _itemLOT.Edit(objitemLOT);
                }
                return this.Direct(new { success = true, data = "Data has been added successfully!" });
            }
            catch (Exception e)
            {
                return this.Direct(new { success = false, data = e.InnerException != null ? e.InnerException.Message : e.Message });
            }
             
        }
        public ActionResult SaveItemLOT(Guid itemId,Guid storeId, string itemLOTString)
        {
            using (var transaction = new TransactionScope())
            {
                try
                {

                    itemLOTString = itemLOTString.Remove(itemLOTString.Length - 1);
                    IList<string> itemLOTs = itemLOTString.Split(new[] { ';' }).ToList();
                    IList<psmsItemLOT> itemLOTList = new List<psmsItemLOT>();
                    var oldItemLOTList = _itemLOT.GetAll().AsQueryable().Where(o => o.ItemId == itemId);
                    var date=new DateTime();
                    for (var i = 0; i < itemLOTs.Count(); i++)
                    {
                        var itemLOT = itemLOTs[i].Split(new[] { ':' });
                        var itemLOTId = Guid.Empty;
                        Guid.TryParse(itemLOT[0].ToString(), out itemLOTId);

                        var objItemLOT = itemLOTId != Guid.Empty ? _itemLOT.Get(o => o.Id == itemLOTId) : new psmsItemLOT();

                        objItemLOT.ItemId = itemId;
                        objItemLOT.StoreId = storeId;
                        objItemLOT.Number = itemLOT[3];
                        objItemLOT.Manufacturer = itemLOT[4];
                        if (DateTime.TryParse(itemLOT[5].ToString(),out date))objItemLOT.ManufacturedDate=date;
                        if (DateTime.TryParse(itemLOT[6].ToString(),out date))objItemLOT.ExpiredDate=date;
                        objItemLOT.Quantity = decimal.Parse(itemLOT[7]);
                        objItemLOT.CommittedQuantity = decimal.Parse(itemLOT[8]);
                        objItemLOT.Remark = itemLOT[9];
                        objItemLOT.UpdatedAt = DateTime.Now;

                        if (itemLOTId == Guid.Empty)
                        {
                            objItemLOT.Id = Guid.NewGuid();
                            objItemLOT.CreatedAt = DateTime.Now;
                            _itemLOT.AddNew(objItemLOT);
                        }
                        itemLOTList.Add(objItemLOT);
                    }
                   // DeleteItemLOT(oldItemLOTList, itemLOTList);
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
   
        #endregion

        #region Methods

        public void DeleteItemLOT(IQueryable<psmsItemLOT> oldItemLOTList, IList<psmsItemLOT> itemLOTList)
        {
            foreach (var objoldsItemLOT in oldItemLOTList)
            {
                var record = itemLOTList.Where(o => o.Id == objoldsItemLOT.Id);

                if (record.Count() == 0)
                {
                    _itemLOT.Delete(o => o.Id == objoldsItemLOT.Id);
                }
            }
        }

        #endregion
    }
}