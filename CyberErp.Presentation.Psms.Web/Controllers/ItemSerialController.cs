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
    public class ItemSerialController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsItemSerial> _itemSerial;
        

        #endregion

        #region Constructor

        public ItemSerialController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _itemSerial = new BaseModel<psmsItemSerial>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(Guid ids)
        {
            var objitemSerial = _itemSerial.Get(o => o.Id == ids);
            var item = new
            {
                objitemSerial.Id,
                objitemSerial.Number,
                objitemSerial.ItemId,
                objitemSerial.IsAvailable,
                objitemSerial.StoreId,
                objitemSerial.Description,
                objitemSerial.SN,
                objitemSerial.PlateNo,
                objitemSerial.IsDisposed,
                objitemSerial.GRNDate,
                objitemSerial.GRNNumber,
                objitemSerial.PurchaseCost,
                Store=objitemSerial.psmsStore.Name,
                objitemSerial.Remark,
                objitemSerial.CreatedAt
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
            var itemSerialId = hashtable["itemSerialId"] != null && hashtable["itemSerialId"] != "" ? Guid.Parse(hashtable["itemSerialId"].ToString()) : Guid.Empty;

            var filtered = _itemSerial.GetAll().AsQueryable().Where(o=>o.IsDisposed!=true);
            if (itemSerialId == Guid.Empty) filtered = filtered.Where(o => o.ItemId == itemId);
              if (itemSerialId == Guid.Empty) filtered = filtered.Where(o => o.StoreId == storeId);
            if (itemSerialId != Guid.Empty) filtered = filtered.Where(o => o.Id == itemSerialId);
            
            filtered = searchText != "" ? filtered.Where(i =>

                i.Number.ToUpper().Contains(searchText.ToUpper()) ||
               ( i.Description!=null?i.Number.ToUpper().Contains(searchText.ToUpper()):false)||
               (i.PlateNo != null ? i.PlateNo.ToUpper().Contains(searchText.ToUpper()) : false) ||
               (i.SN != null ? i.SN.ToUpper().Contains(searchText.ToUpper()) : false) ||
               
                i.psmsStore.Name.ToUpper().Contains(searchText.ToUpper()) ||
                i.psmsItem.Name.ToUpper().Contains(searchText.ToUpper()) ||
                i.psmsItem.Code.ToUpper().Contains(searchText.ToUpper()) ||
             (i.psmsItem.PartNumber != null ? i.psmsItem.PartNumber.ToUpper().Contains(searchText.ToUpper()) : false)
                   
                ): filtered;
            switch (sort)
            {
                  case "Item":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsItem.Name) : filtered.OrderByDescending(u => u.psmsItem.Name);
                    break;
                case "Number":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Number) : filtered.OrderByDescending(u => u.Number);
                    break;
                case "Store":
                filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsStore.Name) : filtered.OrderByDescending(u => u.psmsStore.Name);
                break;
                case "IsAvailable":
                filtered = dir == "ASC" ? filtered.OrderBy(u => u.IsAvailable) : filtered.OrderByDescending(u => u.IsAvailable);
                break;
                case "GRNDate":
                filtered = dir == "ASC" ? filtered.OrderBy(u => u.GRNDate) : filtered.OrderByDescending(u => u.GRNDate);
                break;
                case "GRNNumber":
                filtered = dir == "ASC" ? filtered.OrderBy(u => u.GRNNumber) : filtered.OrderByDescending(u => u.GRNNumber);
                break;
                case "PurchaseCost":
                filtered = dir == "ASC" ? filtered.OrderBy(u => u.PurchaseCost) : filtered.OrderByDescending(u => u.PurchaseCost);
                break;
                case "PlateNo":
                filtered = dir == "ASC" ? filtered.OrderBy(u => u.PlateNo) : filtered.OrderByDescending(u => u.PlateNo);
                break;
                case "IsDisposed":
                filtered = dir == "ASC" ? filtered.OrderBy(u => u.IsDisposed) : filtered.OrderByDescending(u => u.IsDisposed);
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
         
           var itemSerials = filtered.Select(item => new
            {
                item.Id,
                item.ItemId,
                Item=item.psmsItem.Name,
                item.Number,
                item.IsAvailable,
                item.StoreId,
                item.GRNNumber,
                item.GRNDate,
                item.Description,
                item.PlateNo,
                item.IsDisposed,
              
                item.SN,
                item.PurchaseCost,
                Store = item.psmsStore.Name,
                item.Remark,
                item.CreatedAt
     
            }).ToList().Select(item => new
            {
                item.Id,
                item.ItemId,
                Item=item.Item,
                item.Number,
                item.IsAvailable,
                item.StoreId,
                item.GRNNumber,
                item.PlateNo,
                item.IsDisposed,
              
                item.Description,
                item.SN,
                GRNDate=item.GRNDate.HasValue? item.GRNDate.Value.ToShortDateString():"",
                item.PurchaseCost,
                Store = item.Store,
                item.Remark,
                item.CreatedAt
     
            });
            var result = new
            {
                total = count,
                data = itemSerials
            };
            return this.Direct(result);
        } 
        public ActionResult Delete(Guid id)
        {
          
            _itemSerial.Delete(o=>o.Id==id);
         
            return this.Direct(new { success = true, data = "Data has been successfully deleted!" });
        }
        public ActionResult ChangeItem(Guid fromItemId,Guid toItemId)
        {
            var itemSerialList = _itemSerial.GetAll().AsQueryable().Where(o => o.ItemId == fromItemId);
            foreach (var itemSerial in itemSerialList)
            {
                itemSerial.ItemId = toItemId;
            }
            _context.SaveChanges();
            return this.Direct(new { success = true, data = "Data has been successfully deleted!" });
        }

        [FormHandler]
        public ActionResult Save(psmsItemSerial objitemSerial)
        {
            try
            {
                var itemSerial = _itemSerial.Find(c => c.Number.ToUpper() == objitemSerial.Number.ToUpper() && c.Id != objitemSerial.Id);
                if (itemSerial != null)
                {
                    var result = new { success = false, data = "Data has already been registered!" };
                    return this.Direct(result);
                }
                if (objitemSerial.Id == Guid.Empty)
                {
                    objitemSerial.Id = Guid.NewGuid();
                    objitemSerial.CreatedAt = DateTime.Now;
                    objitemSerial.UpdatedAt = DateTime.Now;
                    _itemSerial.AddNew(objitemSerial);
                }
                else
                {
                    objitemSerial.UpdatedAt = DateTime.Now;
                    _itemSerial.Edit(objitemSerial);
                }
                return this.Direct(new { success = true, data = "Data has been added successfully!" });
            }
            catch (Exception e)
            {
                return this.Direct(new { success = false, data = e.InnerException != null ? e.InnerException.Message : e.Message });
            }
             
        }
        public ActionResult SaveItemSerial(Guid itemId,Guid storeId, string itemSerialString)
        {
            using (var transaction = new TransactionScope())
            {
                try
                {

                    itemSerialString = itemSerialString.Remove(itemSerialString.Length - 1);
                    IList<string> itemSerials = itemSerialString.Split(new[] { ';' }).ToList();
                    IList<psmsItemSerial> itemSerialList = new List<psmsItemSerial>();
                    var oldItemSerialList = _itemSerial.GetAll().AsQueryable().Where(o => o.ItemId == itemId);
                    var date=new DateTime();
                    for (var i = 0; i < itemSerials.Count(); i++)
                    {
                        var itemSerial = itemSerials[i].Split(new[] { ':' });
                        var itemSerialId = Guid.Empty;
                        Guid.TryParse(itemSerial[0].ToString(), out itemSerialId);

                        var objItemSerial = itemSerialId != Guid.Empty ? _itemSerial.Get(o => o.Id == itemSerialId) : new psmsItemSerial();

                        objItemSerial.ItemId = itemId;
                        objItemSerial.StoreId= storeId;
                        objItemSerial.Number = itemSerial[3];
                         objItemSerial.IsAvailable = bool.Parse(itemSerial[4]);
                         objItemSerial.GRNDate = DateTime.Parse(itemSerial[5]);
                         objItemSerial.GRNNumber = itemSerial[6];
                         objItemSerial.PurchaseCost =decimal.Parse( itemSerial[7]);
                         objItemSerial.Description = itemSerial[8];
                         objItemSerial.SN = itemSerial[9];
                         objItemSerial.PlateNo = itemSerial[10];
                         objItemSerial.IsDisposed =bool.Parse( itemSerial[11]);
                      
                        objItemSerial.Remark = itemSerial[12];
                        objItemSerial.UpdatedAt = DateTime.Now;

                        if (itemSerialId == Guid.Empty)
                        {
                            objItemSerial.Id = Guid.NewGuid();
                            objItemSerial.CreatedAt = DateTime.Now;
                            _itemSerial.AddNew(objItemSerial);
                        }
                        itemSerialList.Add(objItemSerial);
                    }
                    //DeleteItemSerial(oldItemSerialList, itemSerialList);
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

        public void DeleteItemSerial(IQueryable<psmsItemSerial> oldItemSerialList, IList<psmsItemSerial> itemSerialList)
        {
            foreach (var objoldsItemSerial in oldItemSerialList)
            {
                var record = itemSerialList.Where(o => o.Id == objoldsItemSerial.Id);

                if (record.Count() == 0)
                {
                    _itemSerial.Delete(o => o.Id == objoldsItemSerial.Id);
                }
            }
        }

        #endregion
    }
}