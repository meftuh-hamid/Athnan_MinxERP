using System;
using System.Data.Objects;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CyberErp.Data.Model;
using Ext.Direct.Mvc;
using CyberErp.Business.Component.Psms;
using Newtonsoft.Json;
using System.Collections;
using CyberErp.Presentation.Psms.Web.Classes;
using System.Transactions;
using System.Data.Entity;


namespace CyberErp.Presentation.Psms.Web.Controllers
{
    public class StorePermissionController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsStorePermission> _storePermission;
     
        #endregion

        #region Constructor

        public StorePermissionController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _storePermission = new BaseModel<psmsStorePermission>(_context);
        }

        #endregion

        #region Actions


        public ActionResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            var storeId = Guid.Empty;
            var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
            Guid.TryParse(hashtable["storeId"].ToString(), out storeId);

            var filtered = _storePermission.GetAll().AsQueryable().Where(u => u.StoreId == storeId);
            filtered = searchText != "" ? filtered.Where(p => (p.coreUser.FirstName + " " + p.coreUser.LastName).ToUpper().Contains(searchText.ToUpper())) : filtered;

            switch (sort)
            {
                 
                case "User":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.coreUser.FirstName+" "+u.coreUser.LastName) : filtered.OrderByDescending(u =>u.coreUser.FirstName+" "+u.coreUser.LastName);
                    break;
               case "Remark":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Remark) : filtered.OrderByDescending(u =>u.Remark);
                    break;
                case "IsCoordinator":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.IsCoordinator) : filtered.OrderByDescending(u =>u.IsCoordinator);
                    break;
                default:
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                    break;
 
            }

            var users = filtered.Select(item => new
                {
                    item.Id,
                    item.UserId,
                    User=item.coreUser.FirstName+" "+item.coreUser.LastName,
                    item.IsCoordinator,
                    item.StoreId,
                    item.Remark,
                    item.CreatedAt
                    
                }).ToList();

            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);
        
            var result = new
            {
                total = count,
                data = users
            };
            return this.Direct(result);
        }
        public ActionResult Save(Guid storeId, string storePermissionsString)
        {
             using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
               {
                 _context.Database.Connection.Open();
                 _context.Database.CommandTimeout = int.MaxValue;
                   
                try{
                        storePermissionsString = storePermissionsString.Remove(storePermissionsString.Length - 1);
                    IList<string> storePermissions = storePermissionsString.Split(new[] { ';' }).ToList();  
                    IList<psmsStorePermission> storePermissionList = new List<psmsStorePermission>();
               
                    var oldStorePermissionList =_storePermission.GetAll().AsQueryable().Where(o => o.StoreId == storeId);

                    for (var i = 0; i < storePermissions.Count(); i++)
                    {
                        var storePermission = storePermissions[i].Split(new[] { ':' });
                        var storePermissionId = Guid.Empty;
                        Guid.TryParse(storePermission[0].ToString(), out storePermissionId);
                        var objStorePermission = storePermissionId != Guid.Empty ? _storePermission.Get(o=>o.Id==storePermissionId) : new psmsStorePermission();
                  
                        objStorePermission.StoreId = storeId;
                        objStorePermission.UserId = Guid.Parse(storePermission[1]);
                        objStorePermission.IsCoordinator =bool.Parse(storePermission[2]);
                        objStorePermission.Remark = storePermission[3];
                        objStorePermission.UpdatedAt = DateTime.Now;                   
                        if (storePermissionId == Guid.Empty)
                        {
                            objStorePermission.Id = Guid.NewGuid();
                            objStorePermission.CreatedAt = DateTime.Now;
                            _storePermission.AddNew(objStorePermission);
                        }
                        storePermissionList.Add(objStorePermission);
                    }
                    Delete(oldStorePermissionList, storePermissionList);
          
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Direct(new { success = true, data = "Data has been saved successfully!" });
      
                }
                catch(Exception e)
                {
                    return this.Direct(new { success = false, data = e.InnerException != null ? e.InnerException.Message : e.Message });
             
                }
             }
      
        }

        #endregion
     
        #region Method
        private void Delete(IQueryable<psmsStorePermission> oldStorePermissionList, IList<psmsStorePermission> storePermissionList)
            {
                foreach (var objoldStorePermission in oldStorePermissionList)
                {
                    var record = storePermissionList.Where(o => o.Id == objoldStorePermission.Id);

                    if (record.Count() == 0)
                    {
                        _storePermission.Delete(o=>o.Id==objoldStorePermission.Id);
                    }
                }
            }
     
        #endregion
    }
}