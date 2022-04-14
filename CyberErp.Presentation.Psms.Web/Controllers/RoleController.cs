using System;
using System.Data.Objects;
using System.Linq;
using System.Web.Mvc;
using CyberErp.Data.Model;
using Ext.Direct.Mvc;
using System.Collections;
using CyberErp.Business.Component.Psms;
using System.Collections.Generic;
using Newtonsoft.Json;
using CyberErp.Presentation.Psms.Web.Classes;
using System.Transactions;
using System.Data.Entity;

namespace CyberErp.Presentation.Psms.Web.Controllers
{
    public class RoleController : DirectController
    {
        #region Members

        /**
         * Define reference to data context object
         */
        private readonly DbContext _context;

        /**
         * Define reference to business objects
         */
        private readonly BaseModel<coreRole> _role;
        private readonly BaseModel<coreOperation> _operation;
        private readonly BaseModel<coreRolePermission> _rolePermission;
     
        #endregion

        #region Constructor

        /// <summary>
        /// Initialize data context and business objects
        /// </summary>
        public RoleController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _role = new BaseModel<coreRole>(_context);
            _operation = new BaseModel<coreOperation>(_context);
            _rolePermission = new BaseModel<coreRolePermission>(_context);
         }

        #endregion

        #region Methods

        public ActionResult Get(Guid id)
        {
            var objRole = _role.Get(r=> r.Id == id);
            var role = new
            {
                objRole.Id,
                objRole.Name,
                objRole.Code
            };
            return this.Direct(new
            {
                success = true,
                data = role
            });
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
            var filtered = _role.GetAll();

            if (searchText != "")
                filtered = filtered.Where(r => r.Name.ToUpper().StartsWith(searchText.ToUpper()) || r.Code.ToUpper().StartsWith(searchText.ToUpper()));

            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);
            var roles = filtered.Select(item => new
            {
                item.Id,
                item.Name,
                item.Code
            }).Cast<object>().ToList();
            var result = new
            {
                total = count,
                data = roles
            };
            return this.Direct(result);
        }

        public ActionResult GetOperations(int start, int limit, string sort, string dir, string record)
        {
            
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid roleId, subsystemId;
            Guid.TryParse(hashtable["roleId"].ToString(), out roleId);
            Guid.TryParse(hashtable["subsystemId"].ToString(), out subsystemId);

            var rolePermissions = _rolePermission.GetAll().Where(r => r.RoleId == roleId && r.coreOperation.coreModule.SubsystemId == subsystemId);

            var filtered = _operation.GetAll().Where(o => o.coreModule.SubsystemId == subsystemId).OrderBy(o=>o.ModuleId).AsEnumerable();
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);
            List<object> operations = new List<object>();
            foreach (var item in filtered)
            {
                var rolePermission = rolePermissions.Where(rp => rp.OperationId == item.Id).FirstOrDefault();
                operations.Add(new
                {
                    Id = item.Id,
                    Module = item.coreModule.Name,
                    Operation = item.Name,
                    Add = rolePermission != null ? rolePermission.CanAdd : false,
                    Edit = rolePermission != null ? rolePermission.CanEdit : false,
                    Delete = rolePermission != null ? rolePermission.CanDelete : false,
                    View = rolePermission != null ? rolePermission.CanView : false,
                    Approve = rolePermission != null ? rolePermission.CanApprove : false
                });
            }


            var result = new
            {
                total = count,
                data = operations
            };
            return this.Direct(result);
        }

        [FormHandler]
        public ActionResult Save(coreRole role)
        {
            try
            {
                if (role.Id.Equals(Guid.Empty))
                {
                    var roles = _role.GetAll();
                    var objRole = roles.Where(o => o.Name.Equals(role.Name)).SingleOrDefault();
                    if (objRole != null)
                    {
                        return this.Direct(new { success = false, data = "Role has already been registered!" });
                    }
                    role.Id = Guid.NewGuid();
                    _role.AddNew(role);
                }
                else
                {
                    _role.Edit(role);
                }
                
                return this.Direct(new { success = true, data = "Role has been added successfully!" });
            }
            catch (System.Exception ex)
            {
                return this.Direct(new { success = true, data = ex.InnerException.Message });
            }
        }

        public ActionResult SaveRolePermissions(Guid subSystemId, Guid roleId, string permissionString)
        {
            try
            {
                permissionString = permissionString.Remove(permissionString.Length - 1);
                var permissions = permissionString.Split(new char[] { ';' });

                _rolePermission.Delete(rcp => rcp.coreOperation.
                    coreModule.SubsystemId == subSystemId && rcp.RoleId == roleId);

                for (int i = 0; i < permissions.Count(); i++)
                {
                    string[] permission = permissions[i].Split(new char[] { ':' });
                    var objRolePermission = new coreRolePermission
                    {
                        Id=Guid.NewGuid(),
                        RoleId = roleId,
                        OperationId = Guid.Parse(permission[0]),
                        CanAdd = bool.Parse(permission[1]),
                        CanEdit = bool.Parse(permission[2]),
                        CanDelete = bool.Parse(permission[3]),
                        CanView = bool.Parse(permission[4]),
                        CanApprove = bool.Parse(permission[5])
                    };

                    _rolePermission.AddNew(objRolePermission);
                }

                _rolePermission.SaveChanges();

                return this.Direct(new { success = true, data = "Role Operation Permission has been added successfully!" });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.InnerException != null ? exception.InnerException.Message : exception.Message });
            }
        }

        //public ActionResult Delete(int id)
        //{
        //    try
        //    {
        //        using (var transaction = new TransactionScope())
        //        {
        //            _context.Connection.Open();
                    
        //            var rolePermissions = _rolePermission.GetAll().Where(u => u.RoleId == id).ToList();
        //            foreach (var rolePermission in rolePermissions)
        //            {
        //                _rolePermission.Delete(rolePermission.Id);
        //            }
        //            _role.Delete(id);

        //            transaction.Complete();
        //            _context.AcceptAllChanges();
        //            return this.Direct(new { success = true, data = "Role has been deleted successfully!" });
        //        }
        //    }
        //    catch (System.Exception ex)
        //    {
        //        return this.Direct(new { success = false, data = ex.InnerException.Message });
        //    }
        //}

        #endregion
    }
}
