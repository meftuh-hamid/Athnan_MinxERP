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
    public class StoreLocationController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsStoreLocation> _storeLocation;
        private readonly BaseModel<psmsStoreLocationBin> _storeLocationBin;
       

        #endregion

        #region Constructor

        public StoreLocationController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _storeLocation = new BaseModel<psmsStoreLocation>(_context);
            _storeLocationBin = new BaseModel<psmsStoreLocationBin>(_context);
        }

        #endregion

        #region Actions

        #region Store Location
        public ActionResult Get(Guid id)
        {
            var objStoreLocation = _storeLocation.Get(o=>o.Id==id);
            var item = new
            {
                objStoreLocation.Id,
                objStoreLocation.Name,
                objStoreLocation.Code,
                objStoreLocation.Type,
                 objStoreLocation.Size,
                objStoreLocation.Capacity,
                objStoreLocation.UtilizedSpace,
                objStoreLocation.StoreId,
                Store=objStoreLocation.psmsStore.Name,                        
                objStoreLocation.Remark,
                objStoreLocation.CreatedAt
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
            Guid storeId=Guid.Empty; string searchText = "";
            if (hashtable["storeId"] != null)
                Guid.TryParse(hashtable["storeId"].ToString(), out storeId);
            searchText=hashtable["searchText"]!=null?hashtable["searchText"].ToString():"";
            var action = hashtable["action"] != null ? hashtable["action"].ToString() : "";

            var filtered = _storeLocation.GetAll().AsQueryable().Where(c => c.StoreId == storeId);
            filtered = searchText != "" ? filtered.Where(i =>

                i.Name.ToUpper().Contains(searchText.ToUpper()) ||
                i.Code.ToUpper().Contains(searchText.ToUpper())||
                i.Type.ToUpper().Contains(searchText.ToUpper()) ||
                i.psmsStore.Name.ToUpper().Contains(searchText.ToUpper()))
                : filtered;
            switch (sort)
            {
               
                case "Name":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Name) : filtered.OrderByDescending(u => u.Name);
                    break;
                case "Code":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Code) : filtered.OrderByDescending(u => u.Code);
                    break;
                 case "Type":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Type) : filtered.OrderByDescending(u => u.Type);
                    break;
                 case "Store":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsStore.Name) : filtered.OrderByDescending(u => u.psmsStore.Name);
                    break;                              
                default:
                filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                break;

            }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);
         
           var storeLocations = filtered.Select(storeLocation => new
            {
                storeLocation.Id,
                storeLocation.Name,
                storeLocation.Code,
                storeLocation.Type,
                storeLocation.StoreId,
                Store=storeLocation.psmsStore.Name,
                storeLocation.UtilizedSpace,
                storeLocation.Size,
                storeLocation.Capacity,
                Remark = storeLocation.Remark != null ? storeLocation.Remark : "",
                storeLocation.CreatedAt
            }).ToList();
            var result = new
            {
                total = count,
                data = storeLocations
            };
            return this.Direct(result);
        }

        public ActionResult Delete(Guid id)
        {
           
            _storeLocation.Delete(o=>o.Id==id);
         
            return this.Direct(new { success = true, data = "Data has been successfully deleted!" });
        }

        [FormHandler]
        public ActionResult Save(psmsStoreLocation storeLocation)
        {
            try
            {
                var objStoreLocation = _storeLocation.Find(c =>c.StoreId==storeLocation.StoreId && (c.Name.Equals(storeLocation.Name) && c.Id != storeLocation.Id));  
                if (objStoreLocation != null)
                {
                    var result = new { success = false, data = "Data has already been registered!" };
                    return this.Direct(result);
                }
                if (storeLocation.Id == Guid.Empty)
                {
                    storeLocation.Id = Guid.NewGuid();
                    storeLocation.CreatedAt = DateTime.Now;
                    storeLocation.UpdatedAt = DateTime.Now;
                    _storeLocation.AddNew(storeLocation);
                }
                else
                {
                    storeLocation.UpdatedAt = DateTime.Now;
                    _storeLocation.Edit(storeLocation);
                }
                return this.Direct(new { success = true, data = "Data has been added successfully!" });
            }
            catch (Exception e)
            {
                return this.Direct(new { success = false, data = e.InnerException != null ? e.InnerException.Message : e.Message });
            }

        }

        #endregion

        #region Location Bin
        public ActionResult GetLocationBin(Guid id)
        {
            var objStoreLocation = _storeLocationBin.Get(o => o.Id == id);
            var item = new
            {
                objStoreLocation.Id,
                objStoreLocation.Name,
                objStoreLocation.Code,
                objStoreLocation.Size,
                objStoreLocation.Capacity,
                objStoreLocation.UtilizedSpace,
                objStoreLocation.StoreLocationId,
                StoreLocation = objStoreLocation.psmsStoreLocation.Name,
                objStoreLocation.Remark,
                objStoreLocation.CreatedAt
            };
            return this.Direct(new
            {
                success = true,
                data = item
            });
        }

        public ActionResult GetAllLocationBin(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid storeLocationId = Guid.Empty; string searchText = "";
            if (hashtable["storeLocationId"] != null)
                Guid.TryParse(hashtable["storeLocationId"].ToString(), out storeLocationId);
            searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
            var action = hashtable["action"] != null ? hashtable["action"].ToString() : "";

            var filtered = _storeLocationBin.GetAll().AsQueryable().Where(c => c.StoreLocationId == storeLocationId);
            filtered = searchText != "" ? filtered.Where(i =>

                i.Name.ToUpper().Contains(searchText.ToUpper()) ||
                i.Code.ToUpper().Contains(searchText.ToUpper()) ||
                i.psmsStoreLocation.Name.ToUpper().Contains(searchText.ToUpper()))
                : filtered;
            switch (sort)
            {

                case "Name":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Name) : filtered.OrderByDescending(u => u.Name);
                    break;
                case "Code":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Code) : filtered.OrderByDescending(u => u.Code);
                    break;              
                case "StoreLocation":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.psmsStoreLocation.Name) : filtered.OrderByDescending(u => u.psmsStoreLocation.Name);
                    break;
                default:
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                    break;

            }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);

            var storeLocations = filtered.Select(storeLocation => new
            {
                storeLocation.Id,
                storeLocation.Name,
                storeLocation.Code,
               storeLocation.StoreLocationId,
                StoreLocation = storeLocation.psmsStoreLocation.Name,
                storeLocation.UtilizedSpace,
                storeLocation.Size,
                storeLocation.Capacity,
                Remark = storeLocation.Remark != null ? storeLocation.Remark : "",
                storeLocation.CreatedAt
            }).ToList();
            var result = new
            {
                total = count,
                data = storeLocations
            };
            return this.Direct(result);
        }

        public ActionResult DeleteLocationBin(Guid id)
        {

            _storeLocationBin.Delete(o => o.Id == id);

            return this.Direct(new { success = true, data = "Data has been successfully deleted!" });
        }

        [FormHandler]
        public ActionResult SaveLocationBin(psmsStoreLocationBin storeLocationBin)
        {
            try
            {
                var objStoreLocation = _storeLocationBin.Find(c => c.StoreLocationId == storeLocationBin.StoreLocationId && (c.Name.Equals(storeLocationBin.Name) && c.Id != storeLocationBin.Id));
                if (objStoreLocation != null)
                {
                    var result = new { success = false, data = "Data has already been registered!" };
                    return this.Direct(result);
                }
                if (storeLocationBin.Id == Guid.Empty)
                {
                    storeLocationBin.Id = Guid.NewGuid();
                    storeLocationBin.CreatedAt = DateTime.Now;
                    storeLocationBin.UpdatedAt = DateTime.Now;
                    _storeLocationBin.AddNew(storeLocationBin);
                }
                else
                {
                    storeLocationBin.UpdatedAt = DateTime.Now;
                    _storeLocationBin.Edit(storeLocationBin);
                }
                return this.Direct(new { success = true, data = "Data has been added successfully!" });
            }
            catch (Exception e)
            {
                return this.Direct(new { success = false, data = e.InnerException != null ? e.InnerException.Message : e.Message });
            }

        }

        #endregion


        #endregion

        #region Methods


        #endregion
    }
}