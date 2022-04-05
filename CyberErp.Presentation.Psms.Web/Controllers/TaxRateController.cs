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
using System.Transactions;

namespace CyberErp.Presentation.Web.Psms.Controllers
{
    public class TaxRateController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsTaxRate> _taxRate;
     
        #endregion

        #region Constructor

        public TaxRateController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _taxRate = new BaseModel<psmsTaxRate>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(Guid ids)
        {
            var objTaxRate = _taxRate.Get(o => o.Id == ids);
            var item = new
            {
                objTaxRate.Id,
                objTaxRate.Name,
                objTaxRate.Code,
                objTaxRate.IsIncludedInItemCosting,
                objTaxRate.Rate,
                objTaxRate.IsTaxable,
                objTaxRate.IsAddition,
                objTaxRate.Remark,
                objTaxRate.CreatedAt
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
          
            var filtered =  _taxRate.GetAll().AsQueryable();
            filtered = searchText != "" ? filtered.Where(i =>

                i.Name.ToUpper().Contains(searchText.ToUpper()) ||
                i.Code.ToUpper().Contains(searchText.ToUpper()))
                : filtered;
            switch (sort)
            {
                 case "Name":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Name) : filtered.OrderByDescending(u => u.Name);
                    break;
                case "Code":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Code) : filtered.OrderByDescending(u => u.Code);
                    break;
                case "Rate":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Rate) : filtered.OrderByDescending(u => u.Rate);
                    break;
                case "IsIncludedInItemCosting":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.IsIncludedInItemCosting) : filtered.OrderByDescending(u => u.IsIncludedInItemCosting);
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
         
           var TaxRates = filtered.Select(item => new
            {
                item.Id,
                item.Name,
                item.Code,
                item.Rate,
                item.IsIncludedInItemCosting,
                item.IsAddition,
                item.Remark,
                item.CreatedAt
      
            }).ToList();
            var result = new
            {
                total = count,
                data = TaxRates
            };
            return this.Direct(result);
        }
        public ActionResult Delete(Guid id)
        {
            _taxRate.Delete(o=>o.Id==id);
         
            return this.Direct(new { success = true, data = "Data has been successfully deleted!" });
        }

        [FormHandler]
        public ActionResult Save(psmsTaxRate objTaxRate)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;

                try
                {
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    if (Request.Params["IsIncludedInItemCosting"] != null && Request.Params["IsIncludedInItemCosting"].ToString().Equals("on"))
                        objTaxRate.IsIncludedInItemCosting = true;
                    else
                        objTaxRate.IsIncludedInItemCosting = false;
                    if (Request.Params["IsAddition"] != null && Request.Params["IsAddition"].ToString().Equals("on"))
                        objTaxRate.IsAddition = true;
                    else
                        objTaxRate.IsAddition = false;
                    if (Request.Params["IsTaxable"] != null && Request.Params["IsTaxable"].ToString().Equals("on"))
                        objTaxRate.IsTaxable = true;
                    else
                        objTaxRate.IsTaxable = false;
         
                    var taxRate = _taxRate.Find(c => c.Name.ToUpper() == objTaxRate.Name.ToUpper() && c.Rate == objTaxRate.Rate && c.Id != objTaxRate.Id);
                    if (taxRate != null)
                    {
                        var result = new { success = false, data = "Data has already been registered!" };
                        return this.Direct(result);
                    }
                    if (objTaxRate.Id == Guid.Empty)
                    {
                        objTaxRate.Id = Guid.NewGuid();
                        objTaxRate.CreatedAt = DateTime.Now;
                        objTaxRate.UpdatedAt = DateTime.Now;
                        _taxRate.AddNew(objTaxRate);
                    }
                    else
                    {
                        objTaxRate.UpdatedAt = DateTime.Now;
                        _taxRate.Edit(objTaxRate);
                    }
                     _context.SaveChanges();
                    transaction.Complete();
        
                    return this.Direct(new { success = true, data = "Data has been added successfully!" });
                }
                catch (Exception e)
                {
                    return this.Direct(new { success = false, data = e.InnerException != null ? e.InnerException.Message : e.Message });
                }
            }
             
        }

        #endregion

        #region Methods
    
        #endregion
    }
}