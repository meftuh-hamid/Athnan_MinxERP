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
    public class CustodianController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsCustodian_> _custodian;
        

        #endregion

        #region Constructor

        public CustodianController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _custodian = new BaseModel<psmsCustodian_>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(Guid ids)
        {
            var objcustodian = _custodian.Get(o => o.Id == ids);
            var item = new
            {
                objcustodian.Id,
                objcustodian.ConsumerEmployeeId,
                objcustodian.ConsumerStoreId,
                objcustodian.ConsumerTypeId,
                objcustodian.ConsumerUnitId,
                ConsumerType = objcustodian.lupConsumerType.Name,             
                ConsumerEmployee = objcustodian.ConsumerEmployeeId != null ? objcustodian.coreUser.FirstName + " " + objcustodian.coreUser.LastName : "",
                ConsumerStore = objcustodian.ConsumerStoreId != null ? objcustodian.psmsStore.Name : "",
                ConsumerUnit = objcustodian.ConsumerUnitId != null ? objcustodian.coreUnit.Name : "",           
                objcustodian.VoucherNumber,
                objcustodian.VoucherHeaderId,
                objcustodian.VoucherTypeId,
                VoucherType=objcustodian.VoucherTypeId.HasValue?objcustodian.lupVoucherType.Name:"",
                ItemSerial=objcustodian.psmsItemSerial.Number,
                objcustodian.ItemSerialId,
                Date=objcustodian.Date.ToShortDateString(),
                objcustodian.IsReturned,
                objcustodian.Remark,
                objcustodian.CreatedAt
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
            var itemId = hashtable["itemId"] != null && hashtable["itemId"] != "" ? Guid.Parse(hashtable["itemId"].ToString()) : Guid.Empty;
            var storeId = hashtable["storeId"] != null && hashtable["storeId"] != "" ? Guid.Parse(hashtable["storeId"].ToString()) : Guid.Empty;
            var custodianId = hashtable["custodianId"] != null && hashtable["custodianId"] != "" ? Guid.Parse(hashtable["custodianId"].ToString()) : Guid.Empty;

            var filtered = _custodian.GetAll().AsQueryable();
            if (itemId != Guid.Empty) filtered = filtered.Where(o =>o.IsReturned!=true && o.psmsItemSerial.ItemId == itemId);
             
            filtered = searchText != "" ? filtered.Where(i =>

                i.psmsItemSerial.Number.ToUpper().Contains(searchText.ToUpper()) ||
                i.psmsStore.Name.ToUpper().Contains(searchText.ToUpper()) ||
                i.lupConsumerType.Name.ToUpper().Contains(searchText.ToUpper()) ||
                i.VoucherNumber.ToUpper().Contains(searchText.ToUpper()) ||            
                (i.ConsumerEmployeeId != null ? (i.coreUser.FirstName + " " + i.coreUser.LastName).ToUpper().Contains(searchText.ToUpper()) :false) ||
                (i.ConsumerStoreId != null ? (i.psmsStore.Name).ToUpper().Contains(searchText.ToUpper()) :false) ||
                (i.ConsumerUnitId != null ? (i.coreUnit.Name).ToUpper().Contains(searchText.ToUpper()) :false) 
           
                   
                ): filtered;
            switch (sort)
            {
                case "ItemSerial":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsItemSerial.Number) : filtered.OrderByDescending(u => u.psmsItemSerial.Number);
                    break;
                case "ConsumerType":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.lupConsumerType.Name) : filtered.OrderByDescending(u => u.lupConsumerType.Name);
                    break;
                case "ConsumerEmployee":
                filtered = dir == "ASC" ? filtered.OrderBy(u => u.ConsumerEmployeeId != null ? u.coreUser.FirstName + " " + u.coreUser.LastName: "") : filtered.OrderByDescending(u => u.ConsumerEmployeeId != null ? u.coreUser.FirstName + " " + u.coreUser.LastName : "");
                break;
                case "ConsumerStore":
                filtered = dir == "ASC" ? filtered.OrderBy(u => u.ConsumerStoreId != null ? u.psmsStore.Name : "") : filtered.OrderByDescending(u => u.ConsumerStoreId != null ? u.psmsStore.Name : "");
                break;
                case "ConsumerUnit":
                filtered = dir == "ASC" ? filtered.OrderBy(u => u.ConsumerUnitId != null ? u.coreUnit.Name : "") : filtered.OrderByDescending(u => u.ConsumerUnitId != null ? u.coreUnit.Name : "");
                break;
                case "VoucherNumber":
                filtered = dir == "ASC" ? filtered.OrderBy(u => u.VoucherNumber) : filtered.OrderByDescending(u => u.VoucherNumber);
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

            var custodians = filtered.Select(item => new
            {
                item.Id,
                ConsumerType = item.lupConsumerType.Name,             
                ConsumerEmployee = item.ConsumerEmployeeId != null ? item.coreUser.FirstName + " " + item.coreUser.LastName : "",
                ConsumerStore = item.ConsumerStoreId != null ? item.psmsStore.Name : "",
                ConsumerUnit = item.ConsumerUnitId != null ? item.coreUnit.Name : "",
                item.VoucherNumber,
                ItemSerial = item.psmsItemSerial.Number,
                item.Date,
                item.IsReturned,
                item.Remark,
                item.CreatedAt
     
            }).ToList().Select(item => new
            {
                item.Id,
                item.ConsumerType,
               item.ConsumerEmployee,
                item.ConsumerStore,
                item.ConsumerUnit,
                item.VoucherNumber,
                item.ItemSerial,
                Date = item.Date.ToShortDateString(),
                item.IsReturned,
                item.Remark,
                item.CreatedAt
     
            });
            var result = new
            {
                total = count,
                data = custodians
            };
            return this.Direct(result);
        } 
        public ActionResult Delete(Guid id)
        {
          
            _custodian.Delete(o=>o.Id==id);
         
            return this.Direct(new { success = true, data = "Data has been successfully deleted!" });
        }

        [FormHandler]
        public ActionResult Save(psmsCustodian_ objcustodian)
        {
            try
            {
                if (Request.Params["IsReturned"] != null && Request.Params["IsReturned"].ToString().Equals("on"))
                    objcustodian.IsReturned = true;
                else
                    objcustodian.IsReturned = false;
             
                if (objcustodian.Id == Guid.Empty)
                {
                    objcustodian.Id = Guid.NewGuid();
                    objcustodian.CreatedAt = DateTime.Now;
                    objcustodian.UpdatedAt = DateTime.Now;
                    _custodian.AddNew(objcustodian);
                }
                else
                {
                    objcustodian.UpdatedAt = DateTime.Now;
                    _custodian.Edit(objcustodian);
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