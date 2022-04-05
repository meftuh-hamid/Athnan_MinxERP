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

namespace CyberErp.Presentation.Psms.Web.Controllers
{
    public class ProductionCenterController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<PRProductionCenter> _ProductionCenter;
        

        #endregion

        #region Constructor

        public ProductionCenterController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _ProductionCenter = new BaseModel<PRProductionCenter>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(Guid ids)
        {
            var objProductionCenter =_ProductionCenter.Get(o => o.Id == ids);
            var item = new
            {
                objProductionCenter.Id,
                objProductionCenter.ItemCategoryId,
                ItemCategory=objProductionCenter.psmsItemCategory.Name,
                objProductionCenter.UnitId,
                Unit=objProductionCenter.coreUnit.Name
                
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
          
            var filtered =_ProductionCenter.GetAll().AsQueryable();
            filtered = searchText != "" ? filtered.Where(i =>

                i.psmsItemCategory.Name.ToUpper().Contains(searchText.ToUpper()) ||
                i.coreUnit.Name.ToUpper().Contains(searchText.ToUpper()))
                : filtered;
            switch (sort)
            {
                case "Id":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Id) : filtered.OrderByDescending(u => u.Id);
                    break;
                case "Name":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.coreUnit.Name) : filtered.OrderByDescending(u => u.coreUnit.Name);
                    break;
                case "Description":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsItemCategory.Name) : filtered.OrderByDescending(u => u.psmsItemCategory.Name);
                    break;
                
                   }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);
         
           var SalesAreas = filtered.ToList().Select(item => new
            {
                item.Id,
                item.UnitId,
                Unit=item.coreUnit.Name,
                item.ItemCategoryId,
                ItemCategory = item.psmsItemCategory.Name
                        
            }).ToList();
            var result = new
            {
                total = count,
                data = SalesAreas
            };
            return this.Direct(result);
        } 
        public ActionResult Delete(Guid id)
        {
          
           _ProductionCenter.Delete(o=>o.Id==id);
         
            return this.Direct(new { success = true, data = "Data has been successfully deleted!" });
        }

        [FormHandler]
        public ActionResult Save(PRProductionCenter objProductionCenter)
        {
            try
            {
                var ProductionCenter =_ProductionCenter.Find(c => c.ItemCategoryId == objProductionCenter.ItemCategoryId && c.Id != objProductionCenter.Id);
                if (ProductionCenter != null)
                {
                    var result = new { success = false, data = "Data has already been registered!" };
                    return this.Direct(result);
                }
                          
                if (objProductionCenter.Id == Guid.Empty)
                {
                    objProductionCenter.Id = Guid.NewGuid();
                   _ProductionCenter.AddNew(objProductionCenter);
                }
                else
                {
                    _ProductionCenter.Edit(objProductionCenter);
                }
                return this.Direct(new { success = true, data = "Data has been added successfully!" });
            }
            catch (Exception e)
            {
                return this.Direct(new { success = false, data = e.InnerException != null ? e.InnerException.Message : e.Message });
            }
             
        }

        #endregion

        #region Methods


        #endregion
    }
}