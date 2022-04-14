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
using CyberErp.Presentation.Main.Web.Classes;

namespace CyberErp.Presentation.Psms.Web.Controllers
{
    public class UserController : DirectController
    {
        #region Members

        /**
         * Define a reference to the data context
         */
        private readonly DbContext _context;

        /**
         * Define a reference to user object
         */
        private readonly User _user;

        /**
         * Define a reference to user roles
         */
        private readonly BaseModel<coreUserRole> _userRole;

        /**
         * Define a reference to user subsystems
         */
        private readonly BaseModel<coreUserSubsystem> _userSubsystem;

        #endregion

        #region Constructor

        /// <summary>
        /// Initialize objects
        /// </summary>
        public UserController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _user = new User(_context);
            _userRole = new BaseModel<coreUserRole>(_context);
            _userSubsystem = new BaseModel<coreUserSubsystem>(_context);
        }

        #endregion

        #region Methods

        /// <summary>
        /// Get user by id
        /// </summary>
        /// <param name="id">user id</param>
        /// <returns>user object in the form of json</returns>
        public ActionResult Get(Guid id)
        {
            /**
             * Select user by the specified id
             */
            var objUser = _user.Get(o=>o.Id==id);

            /**
             * Format and return user info as json
             */
            var user = new
            {
                objUser.Id,
                objUser.EmployeeId,
                objUser.FirstName,
                objUser.LastName,
                objUser.UserName,
                objUser.Password,
                objUser.DateCreated,
                objUser.IsActive,
                objUser.IsRevoked
            };

            return this.Direct(new
            {
                success = true,
                data = user
            });
        }

        /// <summary>
        /// Get all users as paged
        /// </summary>
        /// <param name="start">page number</param>
        /// <param name="limit">page size</param>
        /// <param name="sort">sort field</param>
        /// <param name="dir">sort direction(asc or desc)</param>
        /// <returns>List of user in json format</returns>
        public ActionResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
            IEnumerable<coreUser> filtered;

             filtered = _user.GetAll();
             if (searchText != "")
             {
                 filtered = filtered.AsQueryable().Where(s => (s.FirstName.ToUpper().Contains(searchText.ToUpper()) || s.LastName.ToUpper().Contains(searchText.ToUpper())));
             }
             var count = filtered.Count();
             filtered = dir == "ASC" ? filtered.AsQueryable().OrderBy(o => o.FirstName).ToList() : filtered.AsQueryable().OrderByDescending(o => o.LastName).ToList();
          
            filtered = filtered.Skip(start).Take(limit);

            /**
             * Format and return users list as json
             */
            var users = filtered.Select(item => new
            {
                item.Id,
                EmployeeId = item.EmployeeId != null ? item.EmployeeId : null,
                IsEmployee = item.EmployeeId != null ? true : false,
                item.FirstName,
                item.LastName,
                item.UserName
            }).Cast<object>().ToList();
            var result = new
            {
                total = count,
                data = users
            };
            return this.Direct(result);
        }

        public ActionResult GetuserRoles(int start, int limit, string sort, string dir, string record)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid userId = Guid.Empty;
            if (ht["userId"] != null)
                Guid.TryParse(ht["userId"].ToString(), out userId);
            var filtered = _userRole.GetAll().AsQueryable().Where(o => o.UserId == userId);
            var count = filtered.Count();
            var userRoles = filtered.Select(userRole => new
            {
                Id = userRole.RoleId,
                userRole.coreRole.Name

            }).ToList();

            var result = new
            {
                total = count,
                data = userRoles
            };
            return this.Direct(result);
        }

        /// <summary>
        /// Save user
        /// </summary>
        /// <param name="user">user object populated from the client</param>
        /// <returns>success or failure object as json</returns>
        [FormHandler]
        public ActionResult Save(coreUser user)
        {
            try
            {
                /**
                 * Check to see if the user is active or revoked grant
                 */
                if (Request.Params["IsActive"] != null)
                    user.IsActive = true;
                if (Request.Params["IsRevoked"] != null)
                    user.IsRevoked = true;

                user.DateCreated = DateTime.Today;

                if (user.Id.Equals(Guid.Empty))
                {
                    /**
                     * Make sure this user has already been registered
                     */
                    var users = _user.GetAll();
                    var objUser = users.Where(o => o.UserName.Equals(user.UserName)).SingleOrDefault();
                    if (objUser != null)
                    {
                        return this.Direct(new { success = false, data = "User has already been registered!" });
                    }
                    /**
                     * Add this user as a new record
                     */
                    //user.Password = Business.Component.Ffms.UserCreate.Encrypt(user.Password);
                    user.Password = CyberErp.Business.Component.Srms.User.Encrypt(user.Password); 
                    user.Id = Guid.NewGuid();
                    _user.AddNew(user);
                }
                else
                {
                    /**
                     * Update fields for this user
                     */
                    //user.Password = CyberErp.Business.Component.Srms.User.Encrypt(user.Password);
                    _user.Edit(user);
                }

                /**
                 * Extract params sent from the client
                 */
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);

                /**
                 * Get roles (concatinated with a colon (:)) assigned to this user
                 */
                var rolesString = hashtable["roles"].ToString();

                /**
                 * Make sure at least one role is selected
                 */
                if (rolesString.IndexOf(':') > 0)
                {
                    /**
                     * Remove the last colon
                     */
                    rolesString = rolesString.Remove(rolesString.Length - 1);

                    /**
                     * Get selected roles
                     */
                    var roles = rolesString.Split(new char[] { ':' });

                    /**
                     * Save the selected roles
                     */
                    SaveUserRoles(user.Id, roles);
                }

                /**
                 * Get subsystems (concatinated with colons (:)) that the user is allowed to logon
                 */
                var subsystemsString = hashtable["subsystems"].ToString();

                /**
                 * Make sure at least one subsystem is selected
                 */
                if (subsystemsString.IndexOf(':') > 0)
                {
                    /**
                     * Remove the last colon
                     */
                    subsystemsString = subsystemsString.Remove(subsystemsString.Length - 1);

                    /**
                     * Get selected subsystems
                     */
                    var subsystems = subsystemsString.Split(new char[] { ':' });

                    /**
                     * Save selected subsystems
                     */
                    SaveUserSubsystems(user.Id, subsystems);
                }

                /**
                 * Notify the client that the user is successflly saved
                 */
                return this.Direct(new { success = true, data = "User has been added successfully!" });
            }
            catch (System.Exception ex)
            {
                /**
                 * Notify the client that an error occured while saving user information
                 */
                return this.Direct(new { success = false, data = ex.InnerException.Message });
            }
        }

        /// <summary>
        /// Delete user specified by a given id
        /// </summary>
        /// <param name="id">user id</param>
        /// <returns>success or failure object as json</returns>
        public ActionResult Delete(Guid id)
        {
            try
            {
                /**
                 * Get all roles assigned to this user
                 */
                var userRoles = _userRole.GetAll().Where(u => u.UserId == id).ToList();

                /**
                 * Detach this user from these roles
                 */
                foreach (var userRole in userRoles)
                {
                    _userRole.Delete(u=> u.Id == userRole.Id);
                }

                /**
                 * Get all subsystems this user is can logon to
                 */
                var userSubsystems = _userSubsystem.GetAll().Where(u => u.UserId == id).ToList();

                /**
                 * Detach this user from these subsystems
                 */
                foreach (var userSubsystem in userSubsystems)
                {
                    _userSubsystem.Delete(u=> u.Id == userSubsystem.Id);
                }

                /**
                 * Finally, delete the user itself
                 */
                _user.Delete(a=>a.Id==id);

                /**
                 * Notify the client whether the user is deleted or not
                 */
                return this.Direct(new { success = true, data = "User has been deleted successfully!" });
            }
            catch (System.Exception ex)
            {
                return this.Direct(new { success = false, data = ex.Message });
            }
        }

        public ActionResult GetUserRolesAndSubsystems(Guid userId)
        {
            var filteredUserRoles = _userRole.GetAll().Where(u => u.UserId == userId);
            var filteredUserSubsystems = _userSubsystem.GetAll().Where(u => u.UserId == userId);
            var countUserRoles = filteredUserRoles.Count();
            var countUserSubsystems = filteredUserSubsystems.Count();
            var roles = filteredUserRoles.Select(r => new { r.Id, r.RoleId }).Cast<object>().ToList();
            var subsystems = filteredUserSubsystems.Select(s => new { s.Id, s.SubsystemId }).Cast<object>().ToList();
            var result = new
            {
                countUserRoles = countUserRoles,
                countUserSubsystems = countUserSubsystems,
                roles,
                subsystems
            };
            return this.Direct(result);
        }

        /// <summary>
        /// Save user roles
        /// </summary>
        /// <param name="userId">user id</param>
        /// <param name="roles">an array of roles</param>
        private void SaveUserRoles(Guid userId, string[] roles)
        {
            /**
             * First delete all previously assigned roles
             */
            _userRole.Delete(u => u.UserId == userId);

            /**
             * Iterate through the roles and assign to the user
             */
            for (int i = 0; i < roles.Count(); i++)
            {
                var userRole = new coreUserRole
                {
                    Id=Guid.NewGuid(),
                    UserId = userId,
                    RoleId = Guid.Parse(roles[i].ToString()),
                    IsDeleted = false
                };
                _userRole.AddNew(userRole);
            }
        }

        /// <summary>
        /// Save user subsystems
        /// </summary>
        /// <param name="userId">user id</param>
        /// <param name="subsystems">an array of subsystems</param>
        private void SaveUserSubsystems(Guid userId, string[] subsystems)
        {
            /**
             * First delete all previously assigned subsystems for the user
             */
            _userSubsystem.Delete(u => u.UserId == userId);

            /**
             * Iterate through the subsystems and assign to the user
             */
            for (int j = 0; j < subsystems.Count(); j++)
            {
                var userSubsystem = new coreUserSubsystem
                {
                    Id=Guid.NewGuid(),
                    UserId = userId,
                    SubsystemId = Guid.Parse(subsystems[j].ToString()),
                    IsDeleted = false
                };
                _userSubsystem.AddNew(userSubsystem);
            }
        }

        [FormHandler]
        public ActionResult ChangePassword(PasswordParams param)
        {
            try
            {
                var objUser = _user.Get(a=>a.Id==param.Id);
                if (objUser != null)
                {
                    var oldPassword = CyberErp.Business.Component.Srms.User.Encrypt(param.OldPassword) ; 
                    if (objUser.Password != oldPassword) return this.Direct(new { success = false, data = "Please enter the correct old password." });
                    if (param.NewPassword != param.ConfirmNewPassword) return this.Direct(new { success = false, data = "The New Password and Confirm New Password should be the same" });
                    objUser.Password = CyberErp.Business.Component.Srms.User.Encrypt(param.NewPassword);
                    _context.SaveChanges();
                    return this.Direct(new { success = true, data = "Change Password successfully completed." });
                }
                else {
                    return this.Direct(new { success = false, data = "Change Password failed! The user doesn't exist" });
                }
                
            }
            catch (System.Exception ex)
            {
                return this.Direct(new { success = false, data = ex.InnerException.Message });
            }
        }
        public ActionResult Reset(Guid id)
        {
            try
            {
                var objUser = _user.Get(a=>a.Id==id);
                if (objUser != null)
                {
                    var newpassword = objUser.Password = "password";
                    objUser.Password = CyberErp.Business.Component.Srms.User.Encrypt(newpassword);
                    _context.SaveChanges();
                    return this.Direct(new { success = true, data = "Reset Password successfully completed." });
                }
                else
                {
                    return this.Direct(new { success = false, data = "Reset Password failed! The user doesn't exist" });
                }

            }
            catch (System.Exception ex)
            {
                return this.Direct(new { success = false, data = ex.InnerException.Message });
            }
        }

        #endregion
    }

    public class PasswordParams
    {
        public Guid Id { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmNewPassword { get; set; }

    }
}
