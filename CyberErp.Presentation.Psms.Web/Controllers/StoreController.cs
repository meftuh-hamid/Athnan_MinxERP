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

namespace CyberErp.Presentation.Web.Psms.Controllers
{
    public class StoreController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsStore> _store;
        

        #endregion

        #region Constructor

        public StoreController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _store = new BaseModel<psmsStore>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(Guid id)
        {
            var objStore = _store.Get(o=>o.Id==id);
            var item = new
            {
                objStore.Id,
                objStore.Name,
                objStore.Code,
                objStore.TypeId,
                objStore.CostCenterId,
                objStore.Size,
                objStore.Capacity,
                objStore.UtilizedSpace,
                Type = objStore.lupStoreType.Name,
                objStore.ParentId,
                objStore.Address,
                objStore.Remark,
                objStore.CreatedAt
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
            Guid unitId=Guid.Empty; string searchText = "";
            if (hashtable["unitId"]!=null)
            Guid.TryParse(hashtable["unitId"].ToString(), out unitId);
            searchText=hashtable["searchText"]!=null?hashtable["searchText"].ToString():"";
            var action = hashtable["action"] != null ? hashtable["action"].ToString() : "";
          
            var filtered = unitId != Guid.Empty
                           ? _store.GetAll().AsQueryable().Where(c => c.ParentId == unitId)
                           :action!=""?_store.GetAll().AsQueryable(): _store.GetAll().AsQueryable().Where(c => c.ParentId == null);
            filtered = searchText != "" ? filtered.Where(i =>

                i.Name.ToUpper().Contains(searchText.ToUpper()) ||
                i.Code.ToUpper().Contains(searchText.ToUpper())||
                i.lupStoreType.Name.ToUpper().Contains(searchText.ToUpper()))
                : filtered;
            switch (sort)
            {
               
                case "Name":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Name) : filtered.OrderByDescending(u => u.Name);
                    break;
                case "Code":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Code) : filtered.OrderByDescending(u => u.Code);
                    break;
                 case "Type":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.lupStoreType.Name) : filtered.OrderByDescending(u => u.lupStoreType.Name);
                    break;
                 case "Parent":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.ParentId.HasValue ? u.psmsStore2.Name : "") : filtered.OrderByDescending(u => u.ParentId.HasValue ? u.psmsStore2.Name : "");
                    break;
            
                case "Address":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Address) : filtered.OrderByDescending(u => u.Address);
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
         
           var stores = filtered.Select(store => new
            {
                store.Id,
                store.Name,
                store.Code,
                Type = store.lupStoreType.Name,
                Parent = store.psmsStore2 == null ? "" : store.psmsStore2.Name,
                Address = store.Address != null ? store.Address : "",
                store.UtilizedSpace,
                store.Size,
                store.Capacity,
                Remark = store.Remark != null ? store.Remark : "",
                store.CreatedAt
            }).ToList();
            var result = new
            {
                total = count,
                data = stores
            };
            return this.Direct(result);
        }

        public ActionResult PopulateTree(string nodeId)
        {
            bool isLeafNode;
            Guid selectedNodeId;
            Guid.TryParse(nodeId, out selectedNodeId);
            var stores = selectedNodeId !=Guid.Empty?
                        _store.GetAll().AsQueryable().Where(c => c.ParentId == selectedNodeId)
                        : _store.GetAll().AsQueryable().Where(u => u.ParentId == null);
                                         
            var filtered = new ArrayList();
            foreach (var store in stores)
            {
                isLeafNode = !HasChildCategories(store.Id);
                filtered.Add(new
                {
                    id = store.Id,
                    text = store.Name + "-" + store.Code,
                    href = string.Empty,
                    leaf = isLeafNode,
                    iconCls = isLeafNode ? "icon-green-bullet" : "",
                    unitTypeId = store.TypeId
                });
            }
            return this.Direct(filtered.ToArray());
        }

        public ActionResult Delete(Guid id)
        {
            var itemCategories = _store.GetAll().AsQueryable().Where(u => u.ParentId == id);
            
            if (itemCategories.Count() > 0) 
                return this.Direct(new { success = false, data = "Could not delete this data. Related data exist for this data!" });
        
            _store.Delete(o=>o.Id==id);
         
            return this.Direct(new { success = true, data = "Data has been successfully deleted!" });
        }

        [FormHandler]
        public ActionResult Save(psmsStore store)
        {
            try
            {
                var objStore = _store.Find(c => (c.Name.Equals(store.Name) && c.Id != store.Id));  
                if (objStore != null)
                {
                    var result = new { success = false, data = "Data has already been registered!" };
                    return this.Direct(result);
                }
                if (store.Id == Guid.Empty)
                {
                    store.Id = Guid.NewGuid();
                    store.CreatedAt = DateTime.Now;
                    store.UpdatedAt = DateTime.Now;
                    _store.AddNew(store);
                }
                else
                {
                    store.UpdatedAt = DateTime.Now;
                    _store.Edit(store);
                }
                return this.Direct(new { success = true, data = "Data has been added successfully!" });
            }
            catch (Exception e)
            {
                return this.Direct(new { success = false, data = e.InnerException != null ? e.InnerException.Message : e.Message });
            }
             
        }

        public ActionResult Restructure(Guid childNodeId, Guid parentNodeId)
        {
            try
            {
                var objUnit = _store.Get(o=>o.Id==childNodeId);
                objUnit.ParentId = parentNodeId;
                _store.SaveChanges();

                return this.Direct(new { success = true, data = "Restructuring completed successfully" });
            }
            catch (Exception e)
            {
                return this.Direct(new { success = false, data = e.InnerException != null ? e.InnerException.Message : e.Message });
         
            }
        }

        #endregion

        #region Methods

        private bool HasChildCategories(Guid parentId)
        {
            var objCategory = _store.Find(c => c.ParentId == parentId);
            return objCategory != null ? true : false;
        }

        #endregion
    }
}