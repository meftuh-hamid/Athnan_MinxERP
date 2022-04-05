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
    public class NotificationController : Controller
    {
        #region Members

        private readonly DbContext _context;
        private readonly Notification _Notification;
        

        #endregion

        #region Constructor

        public NotificationController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _Notification = new Notification(_context);
        }

        #endregion

        #region Actions


        public ActionResult GetAll(int start, int limit, string sort, string dir , string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
           var   searchText=hashtable["searchText"]!=null?hashtable["searchText"].ToString():"";
           var employeeId = getCurrentEmployee().ToString();
           var filtered = _Notification.GetAll().AsQueryable().Where(o => o.EmployeeId.Contains( employeeId));
            filtered = searchText != "" ? filtered.Where(i =>

                i.lupVoucherType.Name.ToUpper().Contains(searchText.ToUpper()))
                : filtered;
            switch (sort)
            {
               
                 case "Type":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.lupVoucherType.Name) : filtered.OrderByDescending(u => u.lupVoucherType.Name);
                    break;
                case "Title":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Title) : filtered.OrderByDescending(u => u.Title);
                    break;
                case "Date":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Date) : filtered.OrderByDescending(u => u.Date);
                    break;
                case "Message":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Message) : filtered.OrderByDescending(u => u.Message);
                    break;
                default:
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                    break;
               }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);

            var Notifications = filtered.Select(item => new
            {
                item.Id,
                item.EmployeeId,
                Employee ="",
                item.VoucherTypeId,
                Type = item.lupVoucherType.Code + " " + item.lupVoucherType.Name,
                VoucherStatus=item.lupVoucherStatus.Name,
                item.Message,
                item.Title,
                item.Date,
                item.IsViewed,
                item.CreatedAt

            }).ToList().Select(item => new
            {
                item.Id,
                item.EmployeeId,
                item.Employee,
                item.VoucherTypeId,
                item.Type,
                item.VoucherStatus,
                item.Message,
                item.Title,
                Date=item.Date.ToShortDateString(),
                item.IsViewed,
                item.CreatedAt

            }).ToList();
            var result = new
            {
                total = count,
                data = Notifications
            };
            return this.Direct(result);
        }
        public ActionResult UpdateViewStatus(Guid id)
        {
            var record = _Notification.Get(u => u.Id == id);
            record.IsViewed = true;
            _context.SaveChanges();


            return this.Direct(new { success = true, data = "Data has been successfully deleted!" });
        }
        private Guid getCurrentEmployee()
        {
            var employeeId = Guid.Empty;
            var objUser = (coreUser)Session[Constants.CurrentUser];
            if (objUser != null && objUser.Id != null)
            {
                employeeId = (Guid)objUser.Id;
            }
            return employeeId;
        }
        #endregion
    }
}