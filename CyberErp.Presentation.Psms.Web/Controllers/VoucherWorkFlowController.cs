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
    public class VoucherWorkFlowController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<coreVoucherWorkFlow> _voucherWorkFlow;
        private readonly BaseModel<psmsVoucherStatusTransaction> _voucherStatusTransaction;

        #endregion

        #region Constructor

        public VoucherWorkFlowController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _voucherWorkFlow = new BaseModel<coreVoucherWorkFlow>(_context);
            _voucherStatusTransaction = new BaseModel<psmsVoucherStatusTransaction>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(Guid ids)
        {
            var objVoucherWorkFlow = _voucherWorkFlow.Get(o => o.Id == ids);
            var item = new
            {
                objVoucherWorkFlow.Id,
                objVoucherWorkFlow.VoucherTypeId,             
                VoucherType = objVoucherWorkFlow.lupVoucherType.Name + " " + objVoucherWorkFlow.lupVoucherType.Description,
                objVoucherWorkFlow.VoucherStatusId,
                VoucherStatus=objVoucherWorkFlow.lupVoucherStatus.Name,
                objVoucherWorkFlow.VoucherCategory,
                objVoucherWorkFlow.Description,
                VoucherName=objVoucherWorkFlow.lupVoucherType.Name,
                objVoucherWorkFlow.Step,
                objVoucherWorkFlow.Remark,
                objVoucherWorkFlow.CreatedAt
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
             var filtered = _voucherWorkFlow.GetAll().AsQueryable();
            filtered = searchText != "" ? filtered.Where(i =>

                i.lupVoucherType.Name.ToUpper().Contains(searchText.ToUpper()) ||
                i.VoucherCategory.ToUpper().Contains(searchText.ToUpper()) ||
                i.Description.ToUpper().Contains(searchText.ToUpper()))
                : filtered;
            switch (sort)
            {
                   case "VoucherType":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.lupVoucherType.Name + " " + u.lupVoucherType.Description+" "+u.VoucherCategory) : filtered.OrderByDescending(u => u.lupVoucherType.Name + " " + u.lupVoucherType.Description+" "+u.VoucherCategory);
                    break;
                   case "VoucherStatus":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.lupVoucherStatus.Name) : filtered.OrderByDescending(u => u.lupVoucherStatus.Name);
                    break;
                   case "Step":
                    filtered = dir == "ASC" ? filtered.OrderBy(u =>  u.Step) : filtered.OrderByDescending(u => u.Step);
                    break;
                   case "Description":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Description) : filtered.OrderByDescending(u => u.Description);
                    break;
                   case "VoucherCategory":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.VoucherCategory) : filtered.OrderByDescending(u => u.VoucherCategory);
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

            var VoucherWorkFlows = filtered.Select(item => new
            {
                item.Id,
                item.VoucherTypeId,
                VoucherType = item.lupVoucherType.Name + " " + item.lupVoucherType.Description+" "+item.VoucherCategory,
                item.VoucherStatusId,
                VoucherStatus = item.lupVoucherStatus.Name,
                item.VoucherCategory,
                item.Description,
                item.Step,
                item.Remark,
                item.CreatedAt
      
            }).ToList();
            var result = new
            {
                total = count,
                data = VoucherWorkFlows
            };
            return this.Direct(result);
        } 
        public ActionResult Delete(Guid id)
        {
          
            _voucherWorkFlow.Delete(o=>o.Id==id);
         
            return this.Direct(new { success = true, data = "Data has been successfully deleted!" });
        }

        [FormHandler]
        public ActionResult Save(coreVoucherWorkFlow objVoucherWorkFlow)
        {
            try
            {
                var voucherWorkFlow = _voucherWorkFlow.Find(c => c.VoucherCategory == objVoucherWorkFlow.VoucherCategory && c.VoucherTypeId == objVoucherWorkFlow.VoucherTypeId && c.VoucherStatusId == objVoucherWorkFlow.VoucherStatusId && c.Id != objVoucherWorkFlow.Id);
                if (voucherWorkFlow != null)
                {
                    var result = new { success = false, data = "Data has already been registered!" };
                    return this.Direct(result);
                }
                if (objVoucherWorkFlow.Id == Guid.Empty)
                {
                   objVoucherWorkFlow.Id = Guid.NewGuid();
                    objVoucherWorkFlow.CreatedAt = DateTime.Now;
                    objVoucherWorkFlow.UpdatedAt = DateTime.Now;
                    _voucherWorkFlow.AddNew(objVoucherWorkFlow);
                }
                else
                {
                    objVoucherWorkFlow.UpdatedAt = DateTime.Now;
                    _voucherWorkFlow.Edit(objVoucherWorkFlow);
                }
                return this.Direct(new { success = true, data = "Data has been added successfully!" });
            }
            catch (Exception e)
            {
                return this.Direct(new { success = false, data = e.InnerException != null ? e.InnerException.Message : e.Message });
            }
             
        }

        #endregion

        #region Approval
        public ActionResult GetAllApproval(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            var voucherId = hashtable["voucherId"] != null ? Guid.Parse( hashtable["voucherId"].ToString()) : Guid.Empty;
          
            var filtered =_voucherStatusTransaction.GetAll().AsQueryable().Where(o => o.VoucherId == voucherId);
            switch (sort)
            {
             
                default:
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                    break;
            }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);

            var VoucherWorkFlows = filtered.Select(item => new
            {
                item.Id,
                Name=item.EmployeeName,
                Status = item.StatusName,
                item.Date,   
                item.Remark
            }).ToList().Select(item => new
            {
                item.Id,
                Name=item.Name,
                Status = item.Status+" By",
                Date=item.Date.ToShortDateString(), 
                Response=item.Remark
            });
            var result = new
            {
                total = count,
                data = VoucherWorkFlows
            };
            return this.Direct(result);
        } 
    
        #endregion
     
        #region Methods

        #endregion
    }
}