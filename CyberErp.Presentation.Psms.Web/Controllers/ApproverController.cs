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
    public class ApproverController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsApprover> _Approver;
        

        #endregion

        #region Constructor

        public ApproverController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _Approver = new BaseModel<psmsApprover>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(Guid id)
        {
            var objApprover = _Approver.Get(o=>o.Id==id);
            var item = new
            {
                objApprover.Id,
                objApprover.EmployeeId,
                Approver = objApprover.coreUser.FirstName + " " + objApprover.coreUser.LastName,
                objApprover.VoucherTypeId,
                objApprover.StoreId,
                objApprover.UnitId,
                objApprover.StatusId,
                objApprover.Criteria,
                Status=objApprover.StatusId.HasValue?objApprover.lupVoucherStatus.Name:"",
                Store=objApprover.StoreId.HasValue?objApprover.psmsStore.Name:"",
                Unit=objApprover.UnitId.HasValue?objApprover.coreUnit.Name:"",
                VoucherType = objApprover.lupVoucherType.Name + " " + objApprover.lupVoucherType.Description,
                objApprover.CreatedAt
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
           var   searchText=hashtable["searchText"]!=null?hashtable["searchText"].ToString():"";
          
            var filtered =  _Approver.GetAll().AsQueryable();
            filtered = searchText != "" ? filtered.Where(i =>

                (i.coreUser.FirstName + " " + i.coreUser.LastName).ToUpper().Contains(searchText.ToUpper()) ||
                i.lupVoucherType.Name.ToUpper().Contains(searchText.ToUpper()))
                : filtered;
            switch (sort)
            {
             
                case "Employee":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.coreUser.FirstName + " " + u.coreUser.LastName) : filtered.OrderByDescending(u => u.coreUser.FirstName + " " + u.coreUser.LastName);
                    break;
                case "VoucherType":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.lupVoucherType.Name) : filtered.OrderByDescending(u => u.lupVoucherType.Name);
                    break;
                case "Status":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.StatusId.HasValue ? u.lupVoucherStatus.Name : "") : filtered.OrderByDescending(u => u.StatusId.HasValue ? u.lupVoucherStatus.Name : "");
                    break;
                case "Store":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.StoreId.HasValue ? u.psmsStore.Name : "") : filtered.OrderByDescending(u => u.StoreId.HasValue ? u.psmsStore.Name : "");
                    break;
                case "Unit":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.UnitId.HasValue ? u.coreUnit.Name : "") : filtered.OrderByDescending(u => u.UnitId.HasValue ? u.coreUnit.Name : "");
                    break; 
                     default:
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                    break;
               }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);
         
           var Approvers = filtered.Select(item => new
            {
                item.Id,
                item.EmployeeId,
                Approver = item.coreUser.FirstName + " " + item.coreUser.LastName,
                item.VoucherTypeId,
                VoucherType = item.lupVoucherType.Name + " " + item.lupVoucherType.Description,             
                item.Criteria,
                Store = item.StoreId.HasValue ? item.psmsStore.Name : "",
                Unit = item.UnitId.HasValue ? item.coreUnit.Name : "",
                Status = item.StatusId.HasValue ? item.lupVoucherStatus.Name : "",
            
                item.CreatedAt
         
            }).ToList();
            var result = new
            {
                total = count,
                data = Approvers
            };
            return this.Direct(result);
        }

 
        public ActionResult Delete(Guid id)
        {
          
            _Approver.Delete(o=>o.Id==id);
         
            return this.Direct(new { success = true, data = "Data has been successfully deleted!" });
        }

        [FormHandler]
        public ActionResult Save(psmsApprover objApprover)
        {
            try
            {
                 var approver = _Approver.Find(c => c.StatusId == objApprover.StatusId && (objApprover.UnitId.HasValue ? c.UnitId == objApprover.UnitId : true) && (objApprover.StoreId.HasValue ? c.StoreId == objApprover.StoreId : true) && c.EmployeeId == objApprover.EmployeeId && c.VoucherTypeId == objApprover.VoucherTypeId && c.Id != objApprover.Id);
                if (approver != null)
                {
                    var result = new { success = false, data = "Data has already been registered!" };
                    return this.Direct(result);
                }
                if (objApprover.Id == Guid.Empty)
                {
                    objApprover.Id = Guid.NewGuid();
                    objApprover.CreatedAt = DateTime.Now;
                    objApprover.UpdatedAt = DateTime.Now;
                    _Approver.AddNew(objApprover);
                }
                else
                {
                    objApprover.UpdatedAt = DateTime.Now;
                    _Approver.Edit(objApprover);
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