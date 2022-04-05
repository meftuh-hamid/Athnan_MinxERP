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
    public class HolidayController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<PRHoliday> _holiday;
        

        #endregion

        #region Constructor

        public HolidayController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _holiday = new BaseModel<PRHoliday>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(Guid ids)
        {
            var objHoliay =_holiday.Get(o => o.Id == ids);
            var item = new
            {
                objHoliay.Id,
                objHoliay.Name,
                objHoliay.Description,
                Date=objHoliay.Date.ToShortDateString(),
                objHoliay.IsHalfDay,
                objHoliay.Remark,
                objHoliay.CreatedAt
                
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
          
            var filtered =_holiday.GetAll().AsQueryable();
            filtered = searchText != "" ? filtered.Where(i =>

                i.Name.ToUpper().Contains(searchText.ToUpper()) ||
                i.Description.ToUpper().Contains(searchText.ToUpper()))
                : filtered;
            switch (sort)
            {
                 case "Name":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Name) : filtered.OrderByDescending(u => u.Name);
                    break;
                case "Description":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Description) : filtered.OrderByDescending(u => u.Description);
                    break;
                case "Date":
                    filtered = dir == "ASC" ? filtered.OrderBy(u =>u.Date) : filtered.OrderByDescending(u =>u.Date);
                    break;
                    case "IsHalfDay":
                    filtered = dir == "ASC" ? filtered.OrderBy(u =>u.IsHalfDay) : filtered.OrderByDescending(u =>u.IsHalfDay);
                    break;
                    default:
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Id) : filtered.OrderByDescending(u => u.Id);
                    break;
                   }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);
         
           var SalesAreas = filtered.ToList().Select(item => new
            {
                item.Id,
                item.Name,
                item.Description,
                Date = item.Date.ToShortDateString(),
                item.IsHalfDay,
                item.Remark,
                item.CreatedAt
        
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
          
           _holiday.Delete(o=>o.Id==id);
         
            return this.Direct(new { success = true, data = "Data has been successfully deleted!" });
        }

        [FormHandler]
        public ActionResult Save(PRHoliday objHoliday)
        {
            try
            {
                var holiday =_holiday.Find(c => c.Name == objHoliday.Name && c.Id != objHoliday.Id);
                if (holiday != null)
                {
                    var result = new { success = false, data = "Data has already been registered!" };
                    return this.Direct(result);
                }
                if (Request.Params["IsHalfDay"] != null && Request.Params["IsHalfDay"].ToString().Equals("on"))
                    objHoliday.IsHalfDay = true;
                else
                    objHoliday.IsHalfDay = false;
             
            
                if (objHoliday.Id == Guid.Empty)
                {
                    objHoliday.Id = Guid.NewGuid();
                     objHoliday.CreatedAt = DateTime.Now;
                    objHoliday.UpdatedAt = DateTime.Now;
                   _holiday.AddNew(objHoliday);
                }
                else
                {
                    objHoliday.UpdatedAt = DateTime.Now;
                    _holiday.Edit(objHoliday);
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