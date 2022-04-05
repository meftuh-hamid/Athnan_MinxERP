using System;
using System.Data.Objects;
using System.Linq;
using System.Web.Mvc;
using CyberErp.Data.Model;
using Ext.Direct.Mvc;
using System.Collections;
using CyberErp.Business.Component.Psms;
using System.Collections.Generic;
using Newtonsoft.Json;
using CyberErp.Presentation.Psms.Web.Classes;
using System.Transactions;
using System.Data.Entity;


namespace CyberErp.Presentation.Psms.Web.Controllers
{
    public class SalesAreaController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<slmsSalesArea> _salesArea;

        #endregion

        #region Constructor

        public SalesAreaController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _salesArea = new BaseModel<slmsSalesArea>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(Guid id)
        {
            var objSalesArea = _salesArea.Get(o => o.Id == id);
            var salesArea = new
            {
                objSalesArea.Id,
                objSalesArea.Name,
                objSalesArea.Code,
                objSalesArea.StoreId,
                objSalesArea.IsSalesOrderCommited,
                Store=objSalesArea.StoreId.HasValue?objSalesArea.psmsStore.Name:"",           
                objSalesArea.PriceCategoryId,
                PriceCategory = objSalesArea.PriceCategoryId.HasValue ? objSalesArea.slmsPriceCategory.Name : "",
                objSalesArea.CreatedAt,
            
            };
            return this.Direct(new
            {
                success = true,
                data = salesArea
            });

        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
            var filtered = _salesArea.GetAll().AsQueryable();
             filtered = searchText != "" ? filtered.Where(i =>

                i.Name.ToUpper().Contains(searchText.ToUpper()) ||
                i.Code.ToUpper().Contains(searchText.ToUpper()) )
                : filtered;
            switch (sort)
            {
                case "Id":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Id) : filtered.OrderByDescending(u => u.Id);
                    break;
                case "Name":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Name) : filtered.OrderByDescending(u => u.Name);
                    break;
                case "Code":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Code) : filtered.OrderByDescending(u => u.Code);
                    break;
                case "Store":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.StoreId.HasValue ? u.psmsStore.Name : "") : filtered.OrderByDescending(u => u.StoreId.HasValue ? u.psmsStore.Name : "");
                    break;
                case "PriceCategory":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.PriceCategoryId.HasValue ? u.slmsPriceCategory.Name : "") : filtered.OrderByDescending(u => u.PriceCategoryId.HasValue ? u.slmsPriceCategory.Name : "");
                    break;
               
            }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);

            var SalesAreas = filtered.Select(item => new
            {

                item.Id,
                item.Name,
                item.Code,
                item.StoreId,
                Store = item.StoreId.HasValue ? item.psmsStore.Name : "",
                item.PriceCategoryId,
                PriceCategory = item.PriceCategoryId.HasValue ? item.slmsPriceCategory.Name : "",




            }).ToList();
            var result = new
            {
                total = count,
                data = SalesAreas
            };
            return this.Direct(result);
        }
        [FormHandler]
        public ActionResult Save(slmsSalesArea salesArea)
        {
            _context.Database.Connection.Open();
            _context.Database.CommandTimeout = int.MaxValue;

            try
            {
                if (Request.Params["IsSalesOrderCommited"] != null && Request.Params["IsSalesOrderCommited"].ToString().Equals("on"))
                    salesArea.IsSalesOrderCommited = true;
                else
                    salesArea.IsSalesOrderCommited= false;
         
                var objSalesArea = _salesArea.Find(c => (c.Name.ToUpper() == salesArea.Name.ToUpper()) && c.Id != salesArea.Id);
                if (objSalesArea != null)
                {
                    var result = new { success = false, data = "Data has already been registered!" };
                    return this.Direct(result);
                }
                salesArea.UpdatedAt = DateTime.Now;
                if (salesArea.Id == Guid.Empty)
                {
                    salesArea.CreatedAt = DateTime.Now;
                    salesArea.Id = Guid.NewGuid();
                    _salesArea.AddNew(salesArea);
                }
                else
                {
                    _salesArea.Edit(salesArea);
                }
                _context.SaveChanges();

                return this.Direct(new { success = true, salesAreaId = salesArea.Id, data = "Data has been added successfully!" });
            }
            catch (Exception e)
            {
                return this.Direct(new { success = false, data = e.InnerException != null ? e.InnerException.Message : e.Message });
            }
        }

        public ActionResult Delete(Guid id)
        {

            _salesArea.Delete(o => o.Id == id);
            _context.SaveChanges();
            return this.Direct(new { success = true, data = "Item Category has been successfully deleted!" });
        }
        public ActionResult PopulateTree(string nodeId)
        {
            Guid selectedNodeId;
            Guid.TryParse(nodeId, out selectedNodeId);
            var units = selectedNodeId == Guid.Empty
                            ?_salesArea.GetAll().AsQueryable().ToList()
                            :new List<slmsSalesArea>();
            var filtered = new ArrayList();
            foreach (var unit in units)
            {
                filtered.Add(new
                {
                    id = unit.Id,
                    text = unit.Name,
                    href = string.Empty,
                });
            }
            return this.Direct(filtered.ToArray());
        }

        #endregion

        #region Methods



        #endregion

    }
}
