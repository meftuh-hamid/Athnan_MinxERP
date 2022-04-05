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

namespace CyberErp.Presentation.Slms.Web.Controllers
{
    public class PriceCategoryController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<slmsPriceCategory> _priceCategory;
     
        #endregion

        #region Constructor

        public PriceCategoryController()
        {
            _context = new ErpEntities(Constants.ConnectionString);       
            _priceCategory = new BaseModel<slmsPriceCategory>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(Guid id)
        {
            var objPriceCategory = _priceCategory.Get(o=>o.Id==id);
            var priceCategory = new
            {
                objPriceCategory.Id,
                objPriceCategory.Name,
                objPriceCategory.Code,
                objPriceCategory.Remark,
                objPriceCategory.CreatedAt
            };
            return this.Direct(new
            {
                success = true,
                data = priceCategory
            });

        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid unitId; string searchText = "";
            Guid.TryParse(hashtable["unitId"].ToString(), out unitId);
            searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";

            var filtered =_priceCategory.GetAll().AsQueryable();
            filtered = searchText != "" ? filtered.Where(i =>

                i.Name.ToUpper().Contains(searchText.ToUpper()) ||
                i.Code.ToUpper().Contains(searchText.ToUpper()) )
                : filtered;
            switch (sort)
            {
             
                case "Name":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Name) : filtered.OrderByDescending(u => u.Name);
                    break;
                case "Code":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Code) : filtered.OrderByDescending(u => u.Code);
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
                store.Code              
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

            var priceCategories = _priceCategory.GetAll().AsQueryable();
                              
            var filtered = new ArrayList();
            priceCategories = priceCategories.OrderBy(o => o.Code);
            foreach (var priceCategory in priceCategories)
            {
                isLeafNode = !HasChildCategories(priceCategory.Id);
                var codeList = priceCategory.Code.Split('-');
                string code = codeList.Last();
          
                filtered.Add(new
                {
                    id = priceCategory.Id,
                    text =code+" "+ priceCategory.Name,
                    href = string.Empty,
                    leaf = isLeafNode,
                    iconCls = isLeafNode ? "icon-green-bullet" : "",
                });
            }
            return this.Direct(filtered.ToArray());
        }

        [FormHandler]
        public ActionResult Save(slmsPriceCategory priceCategory)
        {
             try
            {
                var objCategory = _priceCategory.Find(c => (c.Name==priceCategory.Name) && c.Id != priceCategory.Id);
                if (objCategory != null)
                {
                    var result = new { success = false, data = "Data has already been registered!" };
                    return this.Direct(result);
                }
                if (priceCategory.Id==Guid.Empty)
                {
                    priceCategory.Id = Guid.NewGuid();
                    priceCategory.CreatedAt = DateTime.Now;
                    priceCategory.UpdatedAt = DateTime.Now;               
                    _priceCategory.AddNew(priceCategory);
                }
                else
                {
                    priceCategory.UpdatedAt = DateTime.Now;
                    _priceCategory.Edit(priceCategory);
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
             
            _priceCategory.Delete(o=>o.Id==id);
            _context.SaveChanges();
            return this.Direct(new { success = true, data = "Item Category has been successfully deleted!" });
        }

        public ActionResult Restructure(Guid childNodeId, Guid parentNodeId)
        {
            try
            {
                var objUnit = _priceCategory.Get(o=>o.Id==childNodeId);
                _priceCategory.SaveChanges();

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
            return  false;
        }

        #endregion

    }
}
