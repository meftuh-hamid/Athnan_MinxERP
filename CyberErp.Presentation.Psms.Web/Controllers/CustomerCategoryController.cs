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
using CyberErp.Business.Component.Psms;


namespace CyberErp.Presentation.Psms.Web.Controllers
{
    public class CustomerCategoryController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<slmsCustomerCategory> _customerCategory;
     
        #endregion

        #region Constructor

        public CustomerCategoryController()
        {
            _context = new ErpEntities(Constants.ConnectionString);       
            _customerCategory = new BaseModel<slmsCustomerCategory>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(Guid id)
        {
            var objCustomerCategory = _customerCategory.Get(o=>o.Id==id);
            var customerCategory = new
            {
                objCustomerCategory.Id,
                objCustomerCategory.Name,
                objCustomerCategory.Code,
                objCustomerCategory.ParentId,
                ParentCategory=objCustomerCategory.ParentId.HasValue?objCustomerCategory.slmsCustomerCategory2.Name:"",
                objCustomerCategory.CreatedAt
            };
            return this.Direct(new
            {
                success = true,
                data = customerCategory
            });

        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid unitId; string searchText = "";
            Guid.TryParse(hashtable["unitId"].ToString(), out unitId);
            searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";

            var filtered =_customerCategory.GetAll().AsQueryable();
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

            var customerCategories = selectedNodeId != Guid.Empty
                ?_customerCategory.GetAll().AsQueryable().Where(c => c.ParentId == selectedNodeId) :
                    _customerCategory.GetAll().AsQueryable().Where(c => c.ParentId == null);

            var filtered = new ArrayList();
            customerCategories = customerCategories.OrderBy(o => o.Code);
            foreach (var itemCategory in customerCategories)
            {
                isLeafNode = !HasChildCategories(itemCategory.Id);
                var codeList = itemCategory.Code.Split('-');
                string code = codeList.Last();

                filtered.Add(new
                {
                    id = itemCategory.Id,
                    text = code + " " + itemCategory.Name,
                    href = string.Empty,
                    leaf = isLeafNode,
                    iconCls = isLeafNode ? "icon-green-bullet" : "",
                });
            }
            return this.Direct(filtered.ToArray());
        }

        [FormHandler]
        public ActionResult Save(slmsCustomerCategory customerCategory)
        {
             try
            {
                var objCategory = _customerCategory.Find(c => (c.Name==customerCategory.Name) && c.Id != customerCategory.Id);
                if (objCategory != null)
                {
                    var result = new { success = false, data = "Data has already been registered!" };
                    return this.Direct(result);
                }
                if (customerCategory.Id==Guid.Empty)
                {
                    customerCategory.Id = Guid.NewGuid();
                    customerCategory.CreatedAt = DateTime.Now;
                    customerCategory.UpdatedAt = DateTime.Now;               
                    _customerCategory.AddNew(customerCategory);
                }
                else
                {
                    customerCategory.UpdatedAt = DateTime.Now;
                    _customerCategory.Edit(customerCategory);
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
             
            _customerCategory.Delete(o=>o.Id==id);
            _context.SaveChanges();
          
            return this.Direct(new { success = true, data = "Item Category has been successfully deleted!" });
        }

        public ActionResult Restructure(Guid childNodeId, Guid parentNodeId)
        {
            try
            {
                var objUnit = _customerCategory.Get(o=>o.Id==childNodeId);
                _customerCategory.SaveChanges();

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
            var objCategory =_customerCategory.Find(c => c.ParentId == parentId);
            return objCategory != null ? true : false;

        }

        #endregion

    }
}
