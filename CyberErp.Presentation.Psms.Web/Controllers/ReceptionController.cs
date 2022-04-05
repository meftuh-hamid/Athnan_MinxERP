using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using CyberErp.Data.Model;
using System.Globalization;
using CyberErp.Presentation.Psms.Web.Classes;
using System.Data.Entity;
using Ext.Direct.Mvc;
using CyberErp.Business.Component.Psms;

namespace CyberErp.Presentation.Psms.Web.Controllers
{
    public class ReceptionController : DirectController
    {
        #region Members

        private readonly DbContext _context;

        private readonly User _user;
        private readonly BaseModel<coreUserSubsystem> _userSubsystem;
        private readonly BaseModel<coreUserRole> _userRole;
        private readonly BaseModel<coreRolePermission> _rolePermission;
        private readonly BaseModel<coreOperation> _operation;

        public enum AuthenticationEnums
        {
            UserNotExist = 0,
            InvalidPassword = 1,
            Success = 2
        };

        #endregion

        #region Constructor

        public ReceptionController()
        {
            _context = new ErpEntities(Constants.ConnectionString);

            _user = new User(_context);
            _userSubsystem = new BaseModel<coreUserSubsystem>(_context);
            _userRole = new BaseModel<coreUserRole>(_context);
            _rolePermission = new BaseModel<coreRolePermission>(_context);
            _operation = new BaseModel<coreOperation>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Index()
        {
            SetRootPath();
            return View();
        }

        [FormHandler]
        public ActionResult Login(coreUser user)
        {
            try
            {
                 
                var language = Request.Params["Language"];
                var hasehedPassword = CyberErp.Business.Component.Srms.User.Encrypt(user.Password);
                var objUser = _user.GetAll().Where(u => u.UserName.Equals(user.UserName) && u.Password.Equals(hasehedPassword)).FirstOrDefault();
                if (objUser != null)
                {
                   // var objUserSubsystem = _userSubsystem.Find(s => s.coreSubsystem.Name == Constants.Psms && s.UserId==objUser.Id);
                   var objUserSubsystem = _userSubsystem.Find(s => s.UserId==objUser.Id);
                 
                    if (objUserSubsystem == null)
                    {
                        return this.Direct(new { success = false, data = "You are not authorized to access this system!" });
                    }
                    SetPermission(objUser);
                    return this.Direct(new { success = true, data = new { Constants.ApplicationPath, userId = objUser.Id, userName = objUser.UserName } });
                }
                return this.Direct(new { success = false, data = "Invalid username and password combination...!" });
            }
            catch (System.Exception ex)
            {
                return this.Direct(new { success = false, data = ex.InnerException != null ? ex.InnerException.Message : ex.Message });
            }
        }

        public ActionResult ChangeCulture(string language)
        {
            Session[Constants.CurrentCulture] = new CultureInfo(language);
            return this.Direct(new { success = true, data = new { SelectedLanguage = language } });
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

        private void SetPermission(coreUser currentUser)
        {
            var userPermissions = new List<Permission>();
            var userRoles = _userRole.GetAll().Where(r => r.UserId == currentUser.Id);
            foreach (var rolePermissions in userRoles.Select(role => _rolePermission.GetAll().Where(p => p.RoleId == role.RoleId && p.coreOperation.coreModule.coreSubsystem.Name == Constants.Psms )))
            {
                userPermissions.AddRange(rolePermissions.Select(permission => new Permission
                {
                    User = currentUser.UserName,
                    Role = permission.coreRole.Name,
                    Operation = permission.coreOperation.Name,
                    Href = permission.coreOperation.Href,
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

        #endregion
    }
}