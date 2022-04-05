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
    public class SettingController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsSetting> _setting;
        

        #endregion

        #region Constructor

        public SettingController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _setting = new BaseModel<psmsSetting>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(Guid ids)
        {
            var objSetting = _setting.Get(o => o.Id == ids);
            var item = new
            {
                objSetting.Id,
                objSetting.Name,
                objSetting.Value,
                objSetting.Remark,
                objSetting.CreatedAt
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
          
            var filtered =  _setting.GetAll().AsQueryable();
            filtered = searchText != "" ? filtered.Where(i =>

                i.Name.ToUpper().Contains(searchText.ToUpper()) ||
                i.Value.ToUpper().Contains(searchText.ToUpper()))
                : filtered;
            switch (sort)
            {
                   case "Name":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Name) : filtered.OrderByDescending(u => u.Name);
                    break;
                case "Value":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Value) : filtered.OrderByDescending(u => u.Value);
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
         
           var Settings = filtered.Select(item => new
            {
                item.Id,
                item.Name,
                item.Value,
                 item.Remark,
                item.CreatedAt
      
            }).ToList();
            var result = new
            {
                total = count,
                data = Settings
            };
            return this.Direct(result);
        } 
        public ActionResult Delete(Guid id)
        {
          
            _setting.Delete(o=>o.Id==id);
         
            return this.Direct(new { success = true, data = "Data has been successfully deleted!" });
        }

        [FormHandler]
        public ActionResult Save(psmsSetting objSetting)
        {
            try
            {
                var setting = _setting.Find(c => c.Name.ToUpper() == objSetting.Name.ToUpper() && c.Id != objSetting.Id);
                if (setting != null)
                {
                    var result = new { success = false, data = "Data has already been registered!" };
                    return this.Direct(result);
                }
                if (objSetting.Id == Guid.Empty)
                {
                    objSetting.Id = Guid.NewGuid();
                    objSetting.CreatedAt = DateTime.Now;
                    objSetting.UpdatedAt = DateTime.Now;
                    _setting.AddNew(objSetting);
                }
                else
                {
                    objSetting.UpdatedAt = DateTime.Now;
                    _setting.Edit(objSetting);
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