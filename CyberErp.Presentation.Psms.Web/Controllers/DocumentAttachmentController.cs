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
using CyberErp.Business.Component.Psms;
using System.Transactions;
using System.IO;
using System.Data.OleDb;
using System.Data;


namespace CyberErp.Presentation.Psms.Web.Controllers
{
    public class DocumentAttachmentController : DirectController
    {
        #region Members

        private readonly DbContext _context;
         
        #endregion

        #region Constructor

        public DocumentAttachmentController()
        {
            _context = new ErpEntities(Constants.ConnectionString);       
            }

        #endregion

        #region Actions

         [FormHandler]
        public ActionResult Save()
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = System.Transactions.IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                HttpPostedFileBase postedFile = Request.Files["DocumentUrl"];
                
                try
                {
                    IList<object> records = new List<object>();
                    string fileExtension="";
                    string filePath="";

                    if ((postedFile != null) && (postedFile.ContentLength > 0))
                    {
                       
                        string appPath = HttpContext.Request.ApplicationPath;
                        string physicalPath = HttpContext.Request.MapPath(appPath);
                        string location = System.IO.Path.Combine(physicalPath, "Document");
                        System.IO.Directory.CreateDirectory(location);
                        fileExtension = System.IO.Path.GetExtension(postedFile.FileName);
                        filePath = location + "\\" + Path.GetFileName(postedFile.FileName);
                        postedFile.SaveAs(filePath);
                    }
                    _context.SaveChanges();
                    transaction.Complete();

                    return this.Direct(new { success = true, data = "successfully saved", file = filePath, fileExtension = fileExtension });


                }
                catch (Exception exception)
                {
                    return this.Direct(new { success = false, data = exception.InnerException != null ? exception.InnerException.Message : exception.Message });
                }
            }
        }
     
        #endregion

        #region Methods

 

        #endregion

    }
}
