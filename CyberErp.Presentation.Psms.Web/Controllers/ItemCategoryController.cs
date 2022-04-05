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


namespace CyberErp.Presentation.Psms.Web.Controllers
{
    public class ItemCategoryController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsItemCategory> _itemCategory;
     
        #endregion

        #region Constructor

        public ItemCategoryController()
        {
            _context = new ErpEntities(Constants.ConnectionString);       
            _itemCategory = new BaseModel<psmsItemCategory>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(Guid id)
        {
            var objItemCategory = _itemCategory.Get(o=>o.Id==id);
            var itemCategory = new
            {
                objItemCategory.Id,
                objItemCategory.Name,
                objItemCategory.Code,
                objItemCategory.TypeId,
                Type = objItemCategory.lupItemCategoryType.Name,
                objItemCategory.ParentId,
                objItemCategory.CreatedAt
            };
            return this.Direct(new
            {
                success = true,
                data = itemCategory
            });

        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid unitId; string searchText = "";
            Guid.TryParse(hashtable["unitId"].ToString(), out unitId);
            searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";

            var filtered = unitId != Guid.Empty
                           ?_itemCategory.GetAll().AsQueryable().Where(c => c.ParentId == unitId)
                           : _itemCategory.GetAll().AsQueryable().Where(c => c.ParentId == null);
            filtered = searchText != "" ? filtered.Where(i =>

                i.Name.ToUpper().Contains(searchText.ToUpper()) ||
                i.Code.ToUpper().Contains(searchText.ToUpper()) ||
                i.lupItemCategoryType.Name.ToUpper().Contains(searchText.ToUpper()))
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
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.lupItemCategoryType.Name) : filtered.OrderByDescending(u => u.lupItemCategoryType.Name);
                    break;
                case "Parent":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.ParentId.HasValue ? u.psmsItemCategory2.Name : "") : filtered.OrderByDescending(u => u.ParentId.HasValue ? u.psmsItemCategory2.Name : "");            
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
                Type = store.lupItemCategoryType.Name,
                Parent = store.ParentId.HasValue ? store.psmsItemCategory2.Name : "",
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

            var itemCategories = selectedNodeId != Guid.Empty
                ?   _itemCategory.GetAll().AsQueryable().Where(c => c.ParentId == selectedNodeId):
                    _itemCategory.GetAll().AsQueryable().Where(c => c.ParentId == null);
                              
            var filtered = new ArrayList();
            itemCategories = itemCategories.OrderBy(o => o.Code);
            foreach (var itemCategory in itemCategories)
            {
                isLeafNode = !HasChildCategories(itemCategory.Id);
                var codeList = itemCategory.Code.Split('-');
                string code = codeList.Last();
          
                filtered.Add(new
                {
                    id = itemCategory.Id,
                    text =code+" "+ itemCategory.Name,
                    href = string.Empty,
                    leaf = isLeafNode,
                    iconCls = isLeafNode ? "icon-green-bullet" : "",
                    unitTypeId = itemCategory.TypeId
                });
            }
            return this.Direct(filtered.ToArray());
        }

        [FormHandler]
        public ActionResult Save(psmsItemCategory itemCategory)
        {
             try
            {
                var objCategory = _itemCategory.Find(c => (c.Name==itemCategory.Name  || c.Code==itemCategory.Code) && c.Id != itemCategory.Id);
                if (objCategory != null)
                {
                    var result = new { success = false, data = "Item Category has already been registered!" };
                    return this.Direct(result);
                }
                if (itemCategory.Id==Guid.Empty)
                {
                    itemCategory.Id = Guid.NewGuid();
                    itemCategory.CreatedAt = DateTime.Now;
                    itemCategory.UpdatedAt = DateTime.Now;
               
                    _itemCategory.AddNew(itemCategory);
                }
                else
                {
                    itemCategory.UpdatedAt = DateTime.Now;
                    _itemCategory.Edit(itemCategory);
                }
                return this.Direct(new { success = true, data = "Item Category has been added successfully!" });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }

        public ActionResult Delete(Guid id)
        {
            var itemCategories = _itemCategory.GetAll().AsQueryable().Where(u => u.ParentId == id);
            
            if (itemCategories.Count() > 0) 
                return this.Direct(new { success = false, data = "Could not delete this category. Related data exist for this category!" });
         
            _itemCategory.Delete(o=>o.Id==id);
          
            return this.Direct(new { success = true, data = "Item Category has been successfully deleted!" });
        }

        public ActionResult Restructure(Guid childNodeId, Guid parentNodeId)
        {
            try
            {
                var objUnit = _itemCategory.Get(o=>o.Id==childNodeId);
                objUnit.ParentId = parentNodeId;
                _itemCategory.SaveChanges();

                return this.Direct(new { success = true, data = "Restructuring completed successfully" });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.Message });
            }
        }

        #endregion

        #region Methods

        private bool HasChildCategories(Guid parentId)
        {
            var objCategory = _itemCategory.Find(c => c.ParentId == parentId);
            return objCategory != null ? true : false;
        }

        #endregion

    }
}
