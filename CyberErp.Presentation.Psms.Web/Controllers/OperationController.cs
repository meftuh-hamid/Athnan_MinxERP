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
    public class OperationController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<PROperation> _operation;
        

        #endregion

        #region Constructor

        public OperationController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _operation = new BaseModel<PROperation>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(Guid ids)
        {
            var objOperation =_operation.Get(o => o.Id == ids);
            var item = new
            {
                objOperation.Id,
                objOperation.Name,
                objOperation.Description,
                WorkStation = objOperation.WorkStationId.HasValue ? objOperation.PRWorkStation.Name : "",
                objOperation.Remark,
                objOperation.CreatedAt
                
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
          
            var filtered =_operation.GetAll().AsQueryable();
            filtered = searchText != "" ? filtered.Where(i =>

                i.Name.ToUpper().Contains(searchText.ToUpper()) ||
               (i.WorkStationId.HasValue?  i.PRWorkStation.Name.ToUpper().Contains(searchText.ToUpper()):false) || 
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
                case "WorkStation":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.WorkStationId.HasValue ? u.PRWorkStation.Name : "") : filtered.OrderByDescending(u => u.WorkStationId.HasValue ? u.PRWorkStation.Name : "");
                    break;
                    case "Remark":
                    filtered = dir == "ASC" ? filtered.OrderBy(u =>u.Remark) : filtered.OrderByDescending(u =>u.Remark);
                    break;
                    default:
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Id) : filtered.OrderByDescending(u => u.Id);
                    break;
                   }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);
         
           var Operations = filtered.ToList().Select(item => new
            {
                item.Id,
                item.Name,
                item.Description,
                WorkStation = item.WorkStationId.HasValue ? item.PRWorkStation.Name : "",
                item.Remark,
                 item.CreatedAt
        
            }).ToList();
            var result = new
            {
                total = count,
                data = Operations
            };
            return this.Direct(result);
        } 
        public ActionResult Delete(Guid id)
        {
          
           _operation.Delete(o=>o.Id==id);
         
            return this.Direct(new { success = true, data = "Data has been successfully deleted!" });
        }

        [FormHandler]
        public ActionResult Save(PROperation objOperation)
        {
            try
            {
                var operation =_operation.Find(c => c.Name == objOperation.Name && c.Id != objOperation.Id);
                if (operation != null)
                {
                    var result = new { success = false, data = "Data has already been registered!" };
                    return this.Direct(result);
                }
                if (objOperation.Id == Guid.Empty)
                {
                    objOperation.Id = Guid.NewGuid();
                     objOperation.CreatedAt = DateTime.Now;
                    objOperation.UpdatedAt = DateTime.Now;
                   _operation.AddNew(objOperation);
                }
                else
                {
                    objOperation.UpdatedAt = DateTime.Now;
                    _operation.Edit(objOperation);
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