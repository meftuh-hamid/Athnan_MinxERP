using System.Collections;
using System.Linq;
using System.Web.Mvc;
using CyberErp.Presentation.Psms.Web.Classes;
using CyberErp.Data.Model;
using System.Collections.Generic;
using CyberErp.Presentation.Psms.Web.Classes;
using Ext.Direct.Mvc;
using System.Data.Entity;
using System.Web.Script.Serialization;
using CyberErp.Business.Component.Psms;
using System;
using CyberErp.Presentation.Main.Web.Classes;

namespace CyberErp.Presentation.Psms.Web.Controllers
{
    public class WorkbenchController : DirectController
    {
        #region Members

        private readonly DbContext _context;

        private readonly BaseModel<coreModule> _module;
        private readonly BaseModel<coreSubsystem> _subsystem;
        private readonly BaseModel<coreOperation> _operation;

        private readonly User _user;
        private readonly BaseModel<coreUserRole> _userRole;
        private readonly BaseModel<coreRolePermission> _rolePermission;

        private readonly ReceptionController _reception;

        #endregion

        #region Constructor

        public WorkbenchController()
        {
            _context = new ErpEntities(Constants.ConnectionString);

            _module = new BaseModel<coreModule>(_context);
            _subsystem = new BaseModel<coreSubsystem>(_context);
            _operation = new BaseModel<coreOperation>(_context);
            _user = new User(_context);
            _userRole = new BaseModel<coreUserRole>(_context);
            _rolePermission = new BaseModel<coreRolePermission>(_context);

            _reception = new ReceptionController();
        }

        #endregion

        #region Actions

        public ActionResult Index()
        {
            SetRootPath();
            string queryString = Server.HtmlDecode(Request.QueryString["loginParam"]);
            if (queryString != null)
            {
                string loginParam = Encryption.DecryptString(queryString, Constants.Key);
                int separatorIndex = loginParam.IndexOf("/");
                if (separatorIndex != -1)
                {
                    string userName = loginParam.Substring(0, separatorIndex);
                    string password = loginParam.Substring(separatorIndex + 1);
                    var objUser = _user.Find(u => u.UserName == userName && u.Password == password);
                    if (objUser != null)
                    {
                        SetUserPermission(objUser);
                        Response.Redirect(Constants.ApplicationPath + "/Workbench");
                    }
                    else
                    {
                        Response.Redirect(Constants.ApplicationPath + "/Reception");
                    }
                }
                else
                {
                    Response.Redirect(Constants.ApplicationPath + "/Reception");
                }
            }

            return View();
        }

        public ActionResult InitializeApp()
        {
            try
            {
                if (Session[Constants.CurrentUser] == null || Session[Constants.UserPermission] == null)
                {
                    return this.Direct(new { success = false, data = new { Constants.ApplicationPath } });
                }
                else
                {
                    var currentUser = Session[Constants.CurrentUser] as coreUser;
                    var permissions = Session[Constants.UserPermission] as List<Permission>; 
                    return this.Direct(new { success = true, data = new { Constants.ApplicationPath, currentUser.Id, currentUser.UserName, Permissions = permissions } });
                }
            }
            catch (System.Exception ex)
            {
                return this.Direct(new { success = false, data = ex.InnerException != null ? ex.InnerException.Message : ex.Message });
            }           
        }

        public ActionResult GetModules()
        {
            var objSubsystem = _subsystem.Find(s => s.Name == Constants.Psms);
            var modules = _module.GetAll().Where(m => m.SubsystemId == (objSubsystem ==null ? Guid.Empty : objSubsystem.Id));
            modules = modules.OrderBy(m => m.Code);
            var subsystemModules = modules.Select(module => new
            {
                id = module.Id,
                text = module.Name,
                href = string.Empty,
                iconCls = string.Empty,
                leaf = true
            }).Cast<object>().ToList();
            var result = new { total = modules.Count(), data = subsystemModules };
            return this.Direct(result);
        }

        public ActionResult GetOperations(string nodeId)
        {
            var moduleId = Guid.Parse(nodeId);
            var operations = _operation.GetAll().Where(m => m.ModuleId == moduleId && m.IsMenu == true);
            operations = operations.OrderBy(o => o.Code);
            var filtered = new ArrayList();
            foreach (var operation in operations)
            {
                filtered.Add(new
                {
                    id = operation.Id,
                    text = operation.Name,
                    href = operation.Href,
                    iconCls = operation.IconCls,
                    leaf = true,
                    hidden =false//!CheckViewPermission(operation.Name, Constants.CanView)
                });
            }
            return this.Direct(filtered.ToArray());
        }

        public ActionResult Logout()
        {
            Session[Constants.CurrentCulture] = null;
            Session[Constants.CurrentUser] = null;
            Session[Constants.UserPermission] = null;
            return this.Direct(new { success = true, data = new { Constants.ApplicationPath } });
        }

        public ActionResult ConstantsViewer()
        {
            var constants = typeof(Constants)
                .GetFields()
                .ToDictionary(x => x.Name, x => x.GetValue(null));
            var json = new JavaScriptSerializer().Serialize(constants);
            return JavaScript("var constants = " + json + ";");
        }
        #endregion

        #region Methods

        private void SetRootPath()
        {
            var applicationPath = Request.ApplicationPath;
            if (applicationPath == null) return;
            if (applicationPath.Equals("/"))
            {
                applicationPath = string.Empty;
            }
            Constants.ApplicationPath = applicationPath;
        }

        private bool CheckViewPermission(string operation, string accessLevel)
        {
            var userPermissions =  Session[Constants.UserPermission] as List<Permission>;
            if (userPermissions != null)
            {
                userPermissions = userPermissions.Where(p => p.Operation == operation && p.CanView.Equals(true)).ToList();
                if (userPermissions != null)
                {
                    return userPermissions.Count() > 0;
                }
                return false;
            }
            return false;
        }

        private void SetUserPermission(coreUser currentUser)
        {
            var userPermissions = new List<Permission>();
            var userRoles = _userRole.GetAll().Where(r => r.UserId == currentUser.Id);
            foreach (var rolePermissions in userRoles.Select(role => _rolePermission.GetAll().Where(p => p.RoleId == role.RoleId && p.coreOperation.coreModule.coreSubsystem.Name == Constants.Psms)))
            {
                userPermissions.AddRange(rolePermissions.Select(permission => new Permission
                {
                    User = currentUser.UserName,
                    Role = permission.coreRole.Name,
                    Operation = permission.coreOperation.Name,
                    CanAdd = permission.CanAdd,
                    CanEdit = permission.CanEdit,
                    CanDelete = permission.CanDelete,
                    CanView = permission.CanView,
                    CanApprove = permission.CanApprove,
                  //  CanCertify = permission.CanCertify
                }));
            }
            Session[Constants.CurrentUser] = currentUser;
            Session[Constants.UserPermission] = userPermissions;
        }        

        public ActionResult CheckPermission(string href)
        {
            var userPermissions = Session[Constants.UserPermission] as List<Permission>;
            if (userPermissions != null)
            {
                var userPermission = userPermissions.Where(p => p.Href.Equals(href)).SingleOrDefault();
                if (userPermission != null)
                {
                    return this.Direct(new
                    {
                        success = true,
                        data = new
                        {
                            CanAdd = userPermission.CanAdd,
                            CanEdit = userPermission.CanEdit,
                            CanDelete = userPermission.CanDelete,
                            CanView = userPermission.CanView,
                            CanApprove = userPermission.CanApprove,
                            CanCertify = userPermission.CanCertify
                        }
                    });
                }
                else
                {
                    return this.Direct(new
                    {
                        success = true,
                        data = new
                        {
                            CanAdd = true,
                            CanEdit = true,
                            CanDelete = true,
                            CanView = true,
                            CanApprove = true,
                            CanCertify = true
                        }
                    });
                }

            }
            return this.Direct(new { success = false, data = "Can not set permission" });
        }

        #endregion
    }
}