using CyberErp.Data.Model;
using CyberErp.Presentation.Psms.Web.Classes;
using Ext.Direct.Mvc;
using Newtonsoft.Json;
using CyberErp.Business.Component.Psms;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Transactions;

namespace CyberErp.Presentation.Psms.Web.Controllers
{
    public class BillofMaterialController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<PRBillofMaterialHeader> _BillofMaterialHeader;
        private readonly BaseModel<PRBillofMaterialDetail> _BillofMaterialDetail;
        private readonly BaseModel<PRBillofMaterialOperationDetail> _BillofMaterialOperationDetail;
        

        #endregion

        #region Constructor

        public BillofMaterialController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _BillofMaterialHeader = new BaseModel<PRBillofMaterialHeader>(_context);
            _BillofMaterialDetail = new BaseModel<PRBillofMaterialDetail>(_context);
            _BillofMaterialOperationDetail = new BaseModel<PRBillofMaterialOperationDetail>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(Guid ids)
        {
            var objBillofMaterial = _BillofMaterialHeader.Get(o => o.Id == ids);
            var item = new
            {
                objBillofMaterial.Id,
                objBillofMaterial.Number,
                objBillofMaterial.ItemId,
                objBillofMaterial.OverheadCost,
                ItemCtegory = objBillofMaterial.ItemCategoryId.HasValue ? objBillofMaterial.psmsItemCategory.Name : "",
             
                objBillofMaterial.psmsItem.Name,
                objBillofMaterial.Description,
                objBillofMaterial.MaterialCost,
                objBillofMaterial.ScrapCost,
                objBillofMaterial.OperationCost,
                objBillofMaterial.Total,
                objBillofMaterial.Quantity,
                objBillofMaterial.Remark,
                objBillofMaterial.CreatedAt
                
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
          
            var filtered =_BillofMaterialHeader.GetAll().AsQueryable();
            filtered = searchText != "" ? filtered.Where(i =>

                i.Number.ToUpper().Contains(searchText.ToUpper()) ||
               (  i.ItemCategoryId.HasValue?  i.psmsItemCategory.Name.ToUpper().Contains(searchText.ToUpper()):false) ||
                i.Description.ToUpper().Contains(searchText.ToUpper()) ||
               i.psmsItem.Code.ToUpper().Contains(searchText.ToUpper()) ||
               i.psmsItem.PartNumber.ToUpper().Contains(searchText.ToUpper()))
                : filtered;
            switch (sort)
            {
                case "Id":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Id) : filtered.OrderByDescending(u => u.Id);
                    break;
                case "Number":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Number) : filtered.OrderByDescending(u => u.Number);
                    break;
                case "Description":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Description) : filtered.OrderByDescending(u => u.Description);
                    break;
                case "Name":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsItem.Name) : filtered.OrderByDescending(u => u.psmsItem.Name);
                    break;
                   case "ItemCategory":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.ItemCategoryId.HasValue? u.psmsItemCategory.Name:"") : filtered.OrderByDescending(u =>u.ItemCategoryId.HasValue? u.psmsItemCategory.Name:"");
                    break;
                    case "Remark":
                    filtered = dir == "ASC" ? filtered.OrderBy(u =>u.Remark) : filtered.OrderByDescending(u =>u.Remark);
                    break;
                   }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);
         
           var BillofMaterials = filtered.Select(item => new
            {
                item.Id,
                item.Number,
                item.ItemId,
                item.OverheadCost,
                ItemCategory=item.ItemCategoryId.HasValue? item.psmsItemCategory.Name:"",
                item.psmsItem.Name,
                item.Description,
                item.MaterialCost,
                item.ScrapCost,
                item.OperationCost,
                item.Total,
                item.Quantity,
                item.Remark,
                item.CreatedAt
     
            }).ToList();
            var result = new
            {
                total = count,
                data = BillofMaterials
            };
            return this.Direct(result);
        } 
        public ActionResult Delete(Guid id)
        {
          
           _BillofMaterialHeader.Delete(o=>o.Id==id);
         
            return this.Direct(new { success = true, data = "Data has been successfully deleted!" });
        }

        [FormHandler]
        public ActionResult Save(PRBillofMaterialHeader objBillofMaterial)
        {
            try
            {
                var BillofMaterial =_BillofMaterialHeader.Find(c => c.Description == objBillofMaterial.Description && c.ItemId==objBillofMaterial.ItemId  && c.Id != objBillofMaterial.Id);
                if (BillofMaterial != null)
                {
                    var result = new { success = false, data = "Data has already been registered!" };
                    return this.Direct(result);
                }
                if (objBillofMaterial.Id == Guid.Empty)
                {
                    objBillofMaterial.Id = Guid.NewGuid();
                     objBillofMaterial.CreatedAt = DateTime.Now;
                    objBillofMaterial.UpdatedAt = DateTime.Now;
                   _BillofMaterialHeader.AddNew(objBillofMaterial);
                }
                else
                {
                    objBillofMaterial.UpdatedAt = DateTime.Now;
                    _BillofMaterialHeader.Edit(objBillofMaterial);
                }
                return this.Direct(new { success = true, data = "Data has been added successfully!" });
            }
            catch (Exception e)
            {
                return this.Direct(new { success = false, data = e.InnerException != null ? e.InnerException.Message : e.Message });
            }
             
        }

        #endregion

        #region Item
        public ActionResult GetAllItem(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid billofMaterialId;
            Guid.TryParse(hashtable["billofMaterialId"].ToString(), out billofMaterialId);
            var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";

            var filtered = _BillofMaterialDetail.GetAll().AsQueryable().Where(i => i.BillofMaterialHeaderId == billofMaterialId);

            filtered = searchText != "" ? filtered.Where(s =>

                s.Description.ToUpper().Contains(searchText.ToUpper()) ||
                s.lupMeasurementUnit.Name.ToUpper().Contains(searchText.ToUpper())) : filtered;

            switch (sort)
            {
                 case "Description":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Description) : filtered.OrderByDescending(u => u.Description);
                    break;
                case "Unit":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.lupMeasurementUnit.Name) : filtered.OrderByDescending(u => u.lupMeasurementUnit.Name);
                    break;
                case "UnitCost":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.UnitCost) : filtered.OrderByDescending(u => u.UnitCost);
                    break;
                case "Quantity":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Quantity) : filtered.OrderByDescending(u => u.Quantity);
                    break;
                case "ScrapQuantity":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.ScrapQuantity) : filtered.OrderByDescending(u => u.ScrapQuantity);
                    break;
                case "Remark":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Remark) : filtered.OrderByDescending(u => u.Remark);
                    break;
                default:
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Id) : filtered.OrderByDescending(u => u.Id);
                    break;
            }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);


            var items = filtered.Select(item => new
            {
                item.Id,
                item.ItemId,
                item.UnitId,
                item.UnitCost,
                item.Quantity,
                item.ScrapQuantity,
                item.StoreId,
                Store = item.StoreId.HasValue ? item.psmsStore.Name : "",               
                Description=item.psmsItem.Name,
                Unit = item.lupMeasurementUnit.Name,
                item.Remark,
                item.CreatedAt
            }).ToList();


            var result = new
            {
                total = count,
                data = items
            };
            return this.Direct(result);
        }
        public ActionResult SaveItem(Guid billofMaterialId, string itemString)
        {
            using (var transaction = new TransactionScope())
            {
                try
                {

                    IList<PRBillofMaterialDetail> itemList = new List<PRBillofMaterialDetail>();
                    var oldbillofMaterialItemList =_BillofMaterialDetail.GetAll().AsQueryable().Where(o => o.BillofMaterialHeaderId == billofMaterialId).ToList();
                    if (itemString != "")
                        itemString = itemString.Remove(itemString.Length - 1);
                    else
                    {
                        DeleteIBillofMaterialItem(oldbillofMaterialItemList, itemList);
                        _context.SaveChanges();
                        transaction.Complete();
                        return this.Direct(new { success = true, data = "Data has been saved successfully!" });
                    }
                    IList<string> items = itemString.Split(new[] { ';' }).ToList();
                    Guid storeId = Guid.Empty;
                    for (var i = 0; i < items.Count(); i++)
                    {
                        var billofMaterialItem = items[i].Split(new[] { ':' });
                        var billofMaterialItemId = Guid.Empty;
                        Guid.TryParse(billofMaterialItem[0].ToString(), out billofMaterialItemId);

                        var objBillofQuantityItem= billofMaterialItemId != Guid.Empty ? oldbillofMaterialItemList.Where(o => o.Id == billofMaterialItemId).FirstOrDefault() : new PRBillofMaterialDetail();

                        objBillofQuantityItem.ItemId = billofMaterialId;
                        objBillofQuantityItem.BillofMaterialHeaderId = billofMaterialId;
                        objBillofQuantityItem.ItemId = Guid.Parse(billofMaterialItem[2]);
                        objBillofQuantityItem.Description = billofMaterialItem[3];
                        objBillofQuantityItem.UnitId = Guid.Parse(billofMaterialItem[4]);
                        objBillofQuantityItem.Quantity = decimal.Parse(billofMaterialItem[5]);
                        objBillofQuantityItem.UnitCost = 0;// decimal.Parse(billofMaterialItem[6]);
                        objBillofQuantityItem.Remark = billofMaterialItem[7];
                        objBillofQuantityItem.ScrapQuantity = decimal.Parse(billofMaterialItem[8]);
                        if (Guid.TryParse(billofMaterialItem[9],out storeId))
                            objBillofQuantityItem.StoreId = storeId;
                      
                        objBillofQuantityItem.UpdatedAt = DateTime.Now;

                        if (billofMaterialItemId == Guid.Empty)
                        {
                            objBillofQuantityItem.Id = Guid.NewGuid();
                            objBillofQuantityItem.CreatedAt = DateTime.Now;
                            _BillofMaterialDetail.AddNew(objBillofQuantityItem);
                        }
                        itemList.Add(objBillofQuantityItem);
                    }
                    DeleteIBillofMaterialItem(oldbillofMaterialItemList, itemList);
                    UpdateBillofMaterial(billofMaterialId,itemList, new List<PRBillofMaterialOperationDetail>());
                  
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
        public void DeleteIBillofMaterialItem(IList<PRBillofMaterialDetail> oldBillofMaterialItemList, IList<PRBillofMaterialDetail> BillofMaterialItemList)
        {
            foreach (var objoldsItem in oldBillofMaterialItemList)
            {
                var record = BillofMaterialItemList.Where(o => o.Id == objoldsItem.Id);

                if (record.Count() == 0)
                {
                  _BillofMaterialDetail.Delete(o => o.Id == objoldsItem.Id);
                }
            }
        }


        #endregion

        #region Operation
        public ActionResult GetAllOperation(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid billofMaterialId;
            Guid.TryParse(hashtable["billofMaterialId"].ToString(), out billofMaterialId);
            var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";

            var filtered =_BillofMaterialOperationDetail.GetAll().AsQueryable().Where(i => i.BillofMaterialHeaderId == billofMaterialId);

            filtered = searchText != "" ? filtered.Where(s =>

                s.Description.ToUpper().Contains(searchText.ToUpper()) ||
                s.PRWorkStation.Name.ToUpper().Contains(searchText.ToUpper()) ||
                s.PROperation.Name.ToUpper().Contains(searchText.ToUpper())) : filtered;

            switch (sort)
            {
                case "Id":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Id) : filtered.OrderByDescending(u => u.Id);
                    break;
                case "Description":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Description) : filtered.OrderByDescending(u => u.Description);
                    break;
                case "Operation":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.PROperation.Name) : filtered.OrderByDescending(u => u.PROperation.Name);
                    break;
                case "WorkStation":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.PRWorkStation.Name) : filtered.OrderByDescending(u => u.PRWorkStation.Name);
                    break;
                case "HourRate":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.HourRate) : filtered.OrderByDescending(u => u.HourRate);
                    break;
                case "OperationTime":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.OperationTime) : filtered.OrderByDescending(u => u.OperationTime);
                    break;
                  case "Remark":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Remark) : filtered.OrderByDescending(u => u.Remark);
                    break;
            }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);


            var items = filtered.Select(item => new
            {
                item.Id,
                item.Description,
                item.SequenceNo,
                item.OperationId,
                Operation=item.PROperation.Name,
                item.WorkStationId,
                WorkStation=item.PRWorkStation.Name,
                item.HourRate,
                item.OperationTime,
                item.Remark,
                item.CreatedAt
            }).ToList();


            var result = new
            {
                total = count,
                data = items
            };
            return this.Direct(result);
        }
        public ActionResult SaveOperation(Guid billofMaterialId, string operationString)
        {
            using (var transaction = new TransactionScope())
            {
                try
                {

                    IList<PRBillofMaterialOperationDetail> OperationList = new List<PRBillofMaterialOperationDetail>();
                    var oldbillofMaterialOperationList = _BillofMaterialOperationDetail.GetAll().AsQueryable().Where(o => o.BillofMaterialHeaderId == billofMaterialId).ToList();
                    if (operationString != "")
                        operationString = operationString.Remove(operationString.Length - 1);
                    else
                    {
                        DeleteIBillofMaterialOperation(oldbillofMaterialOperationList, OperationList);
                        _context.SaveChanges();
                        transaction.Complete();
                        return this.Direct(new { success = true, data = "Data has been saved successfully!" });
                    }
                    IList<string> Operations = operationString.Split(new[] { ';' }).ToList();

                    for (var i = 0; i < Operations.Count(); i++)
                    {
                        var billofMaterialOperation = Operations[i].Split(new[] { ':' });
                        var billofMaterialOperationId = Guid.Empty;
                        Guid.TryParse(billofMaterialOperation[0].ToString(), out billofMaterialOperationId);

                        var objBillofQuantityOperation = billofMaterialOperationId != Guid.Empty ? oldbillofMaterialOperationList.Where(o => o.Id == billofMaterialOperationId).FirstOrDefault() : new PRBillofMaterialOperationDetail();

                        objBillofQuantityOperation.BillofMaterialHeaderId = billofMaterialId;
                        objBillofQuantityOperation.OperationId = Guid.Parse(billofMaterialOperation[2]);
                        objBillofQuantityOperation.WorkStationId = Guid.Parse(billofMaterialOperation[3]);
                        objBillofQuantityOperation.Description = billofMaterialOperation[4];
                        objBillofQuantityOperation.HourRate = decimal.Parse(billofMaterialOperation[5]);
                        objBillofQuantityOperation.OperationTime = decimal.Parse(billofMaterialOperation[6]);
                        objBillofQuantityOperation.Remark = billofMaterialOperation[7];
                        objBillofQuantityOperation.SequenceNo = int.Parse(billofMaterialOperation[8]);
                       
                        objBillofQuantityOperation.UpdatedAt = DateTime.Now;

                        if (billofMaterialOperationId == Guid.Empty)
                        {
                            objBillofQuantityOperation.Id = Guid.NewGuid();
                            objBillofQuantityOperation.CreatedAt = DateTime.Now;
                            _BillofMaterialOperationDetail.AddNew(objBillofQuantityOperation);
                        }
                        OperationList.Add(objBillofQuantityOperation);
                    }
                    DeleteIBillofMaterialOperation(oldbillofMaterialOperationList, OperationList);
                    UpdateBillofMaterial(billofMaterialId, new List<PRBillofMaterialDetail>(), OperationList);
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
        public void DeleteIBillofMaterialOperation(IList<PRBillofMaterialOperationDetail> oldBillofMaterialOperationList, IList<PRBillofMaterialOperationDetail> BillofMaterialOperationList)
        {
            foreach (var objoldsOperation in oldBillofMaterialOperationList)
            {
                var record = BillofMaterialOperationList.Where(o => o.Id == objoldsOperation.Id);

                if (record.Count() == 0)
                {
                  _BillofMaterialOperationDetail.Delete(o => o.Id == objoldsOperation.Id);
                }
            }
        }


        #endregion

        #region Methods
        private void UpdateBillofMaterial(Guid billofMaterialId, IList<PRBillofMaterialDetail> billofMaterialItemList, IList<PRBillofMaterialOperationDetail> billofMaterialOperationList)
        {
            decimal materialCost = 0, scrapCost = 0, operationCost = 0;
            var objBillofMaterial = _BillofMaterialHeader.Get(o => o.Id == billofMaterialId);
               
            if(billofMaterialItemList.Any())
            {
                 materialCost = billofMaterialItemList.Select(o => o.Quantity * o.UnitCost).DefaultIfEmpty().Sum();
                scrapCost = billofMaterialItemList.Select(o =>(o.ScrapQuantity.HasValue? o.ScrapQuantity.Value * o.UnitCost:0)).DefaultIfEmpty().Sum();
                 objBillofMaterial.MaterialCost = materialCost;
                 objBillofMaterial.ScrapCost = scrapCost;       
            }
            else if (billofMaterialOperationList.Any())
            {
                operationCost = billofMaterialOperationList.Select(o =>(o.OperationTime.HasValue? o.HourRate * o.OperationTime.Value:0)).DefaultIfEmpty().Sum();
                objBillofMaterial.OperationCost = operationCost;             
            }
            objBillofMaterial.Total = objBillofMaterial.OverheadCost+objBillofMaterial.ScrapCost + objBillofMaterial.MaterialCost + objBillofMaterial.OperationCost;
         
        }

        #endregion
    }
}