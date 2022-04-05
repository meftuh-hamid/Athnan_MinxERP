using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using CyberErp.Presentation.Psms.Web.Classes;
using System.Globalization;
using CyberErp.Data.Model;
using System.Data.Entity;
using System.Net.Mail;
using CyberErp.Business.Component.Psms;
using System.Net;

namespace CyberErp.Presentation.Psms.Web
{
    public class MvcApplication : System.Web.HttpApplication
    {
        private static object locker = new object();
        private readonly DbContext _context;
        private readonly BaseModel<psmsNotification> _notification;
        private readonly BaseModel<psmsSetting> _setting;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        private readonly BaseModel<psmsInventoryRecord> _inventoryRecord;
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.IgnoreRoute("{*allaspx}", new { allaspx = @".*(CrystalImageHandler).*" }); //This is required for crystal report runtime image view
            routes.MapRoute(
                "Default", // Route name
                "{controller}/{action}/{id}", // URL with parameters
                new { controller = "Reception", action = "Index", id = UrlParameter.Optional } // Parameter defaults
            );

        }
        public MvcApplication()
        {
            var connString = ConfigReader.GetConnectionString("ErpEntities");
            Constants.ConnectionStringForAdoNet = ConfigReader.GetConnectionString("ErpEntitiesForADONet");
         
            _context = new ErpEntities(connString);
            _notification = new BaseModel<psmsNotification>(_context);
            _setting = new BaseModel<psmsSetting>(_context);
            _inventoryRecord = new BaseModel<psmsInventoryRecord>(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);

        }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            RegisterRoutes(RouteTable.Routes);
            Constants.ConnectionString = ConfigReader.GetConnectionString("ErpEntities");

            //System.Timers.Timer timScheduledTask = new System.Timers.Timer();
            //timScheduledTask.Interval = 60 * 1000;
            //timScheduledTask.Enabled = true;
            //timScheduledTask.Elapsed +=
            //new System.Timers.ElapsedEventHandler(timScheduledTask_Elapsed);
            //timScheduledTask.Stop();
            //timScheduledTask.Start();
        }
        void timScheduledTask_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        {

            AddReorderNotification();
            _context.SaveChanges();

        }
        public void Email()
        {
            if (!CheckForInternetConnection())
                return;
            var notification = _notification.GetAll().AsQueryable().Where(o => o.IsEmailed == false).OrderBy(o => o.CreatedAt).FirstOrDefault();
            if (notification != null)
            {
                //var address = notification.EmployeeId.HasValue ? notification.coreUserAddress.FirstOrDefault() : null;
                //var email = address != null ? address.coreAddress.Email : "";
                //if (email != null && email != "" && email != "undefined" && email.Trim() != "")
                //{
                //    var isSend = SendEmail(email, notification.Title, notification.Message);
                //    notification.IsEmailed = isSend;

                //}
            }


        }
        public void AddReorderNotification()
        {
            var currentFiscalYear=_fiscalYear.Get(o=>o.IsActive==true && o.IsClosed==false);
            var inventoryRecordList = _inventoryRecord.GetAll().AsQueryable().Where(o => o.IsClosed == false && o.FiscalYearId == currentFiscalYear.Id && (o.RunningQuantity < o.ReorderLevel && o.ReorderLevel > 0 && !o.ReorderdDate.HasValue));
            inventoryRecordList= inventoryRecordList.OrderBy(o=>o.psmsStore.Name).Skip(0).Take(20);
            foreach(var record in inventoryRecordList)
            {
                record.ReorderdDate = DateTime.Now;
                record.PendingReorderQuantity =(decimal) (record.ReorderLevel - record.RunningQuantity);
            }
            _context.SaveChanges();
        }
        public static bool CheckForInternetConnection()
        {
            try
            {
                using (var client = new WebClient())
                using (var stream = client.OpenRead("http://www.google.com"))
                {
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }
        private bool SendEmail(string email, string title, string message)
        {
            var emailConfigString = _setting.Find(o => o.Name == Constants.emailConfigration_setting_Name);
            if (emailConfigString == null)
                return false;
            if (emailConfigString.Remark == "")
                return false;
            IList<string> configList = emailConfigString.Remark.Split(new[] { ';' }).ToList();
            var servername = emailConfigString.Remark != "" ? configList[0].Split(new[] { ':' }).ToList().Last().Trim() : "";
            var emailaddress = emailConfigString.Remark != "" ? configList[1].Split(new[] { ':' }).ToList().Last().Trim() : "";
            var password = emailConfigString.Remark!="" ? configList[2].Split(new[] { ':' }).ToList().Last().Trim() : "";

            MailMessage mail = new MailMessage();
            using (SmtpClient smtp = new SmtpClient(servername))
            {
                mail.From = new MailAddress(emailaddress);
                mail.To.Add(email);
                mail.IsBodyHtml = false;
                mail.Subject = title;
                mail.Body = message;
                smtp.Port = 587;
                smtp.EnableSsl = true;
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtp.UseDefaultCredentials = false;
                smtp.Credentials = new System.Net.NetworkCredential(emailaddress, password);
                smtp.Send(mail);
                return true;
            }
        }
        protected void Application_AcquireRequestState(object sender, EventArgs e)
        {
            if (HttpContext.Current.Session != null)
            {
                CultureInfo ci = (CultureInfo)this.Session[Constants.CurrentCulture];
                if (ci == null)
                {
                    string langName = Constants.DefaultLanguage;
                    if (HttpContext.Current.Request.UserLanguages != null && HttpContext.Current.Request.UserLanguages.Length != 0)
                    {
                        langName = HttpContext.Current.Request.UserLanguages[0].Substring(0, 2);
                    }
                    ci = new CultureInfo(langName);
                    Session[Constants.CurrentCulture] = ci;
                }
                System.Threading.Thread.CurrentThread.CurrentUICulture = ci;
                System.Threading.Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(ci.Name);
            }
        }

        protected void Session_Start()
        {
            Session.Timeout = 660;
            Session[Constants.CurrentUser] = null;
            Session[Constants.CurrentSubsystem] = null;
            Session[Constants.UserPermission] = null;
        }

        protected void Session_End()
        {
            Session[Constants.CurrentUser] = null;
            Session[Constants.CurrentSubsystem] = null;
            Session[Constants.UserPermission] = null;
        }
    }
}