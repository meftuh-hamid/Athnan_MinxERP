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
    public class WorkStationController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<PRWorkStation> _workStation;
        

        #endregion

        #region Constructor

        public WorkStationController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _workStation = new BaseModel<PRWorkStation>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(Guid ids)
        {
            var objWorkStation =_workStation.Get(o => o.Id == ids);
            var item = new
            {
                objWorkStation.Id,
                objWorkStation.Name,
                objWorkStation.Description,
                objWorkStation.ElectricityCostPerHour,
                objWorkStation.ConsumableCostPerHour,
                objWorkStation.RentCostPerHour,
                objWorkStation.WageCostPerHour,
                objWorkStation.TotalCostPerHour,
                objWorkStation.Remark,
                objWorkStation.CreatedAt
                
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
          
            var filtered =_workStation.GetAll().AsQueryable();
            filtered = searchText != "" ? filtered.Where(i =>

                i.Name.ToUpper().Contains(searchText.ToUpper()) ||
                i.Description.ToUpper().Contains(searchText.ToUpper()))
                : filtered;
            switch (sort)
            {
                case "Id":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Id) : filtered.OrderByDescending(u => u.Id);
                    break;
                case "Name":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Name) : filtered.OrderByDescending(u => u.Name);
                    break;
                case "Description":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Description) : filtered.OrderByDescending(u => u.Description);
                    break;
                case "Remark":
                    filtered = dir == "ASC" ? filtered.OrderBy(u =>u.Remark) : filtered.OrderByDescending(u =>u.Remark);
                    break;
                   }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);
         
           var WorkStations = filtered.ToList().Select(item => new
            {
                item.Id,
                item.Name,
                item.Description,
                item.ElectricityCostPerHour,
                item.ConsumableCostPerHour,
                item.RentCostPerHour,
                item.WageCostPerHour,
                item.TotalCostPerHour,
                item.Remark,
                item.CreatedAt
        
            }).ToList();
            var result = new
            {
                total = count,
                data = WorkStations
            };
            return this.Direct(result);
        } 
        public ActionResult Delete(Guid id)
        {
          
           _workStation.Delete(o=>o.Id==id);
         
            return this.Direct(new { success = true, data = "Data has been successfully deleted!" });
        }

        [FormHandler]
        public ActionResult Save(PRWorkStation objWorkStation)
        {
            try
            {
                var workStation =_workStation.Find(c => c.Name == objWorkStation.Name && c.Id != objWorkStation.Id);
                if (workStation != null)
                {
                    var result = new { success = false, data = "Data has already been registered!" };
                    return this.Direct(result);
                }
                if (objWorkStation.Id == Guid.Empty)
                {
                    objWorkStation.Id = Guid.NewGuid();
                     objWorkStation.CreatedAt = DateTime.Now;
                    objWorkStation.UpdatedAt = DateTime.Now;
                   _workStation.AddNew(objWorkStation);
                }
                else
                {
                    objWorkStation.UpdatedAt = DateTime.Now;
                    _workStation.Edit(objWorkStation);
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