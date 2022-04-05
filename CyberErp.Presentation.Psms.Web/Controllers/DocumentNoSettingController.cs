using CyberErp.Data.Model;
using CyberErp.Presentation.Psms.Web.Classes;
using Ext.Direct.Mvc;
using Newtonsoft.Json;
using CyberErp.Business.Component.Psms;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CyberErp.Presentation.Psms.Web.Controllers
{
    public class DocumentNoSettingController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsDocumentNoSetting> _documentNoSetting;

        #endregion

        #region Constructor

        public DocumentNoSettingController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _documentNoSetting = new BaseModel<psmsDocumentNoSetting>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(Guid id)
        {
            var objDocumentNoSetting = _documentNoSetting.Get(c=>c.Id == id);
            
            var documentNoSetting = new
            {
                objDocumentNoSetting.Id,
                objDocumentNoSetting.PreFix,
                objDocumentNoSetting.SurFix,
                objDocumentNoSetting.Year,
                objDocumentNoSetting.DocumentType,
                objDocumentNoSetting.LastNumber,
                objDocumentNoSetting.StoreId,
                objDocumentNoSetting.SupplierId,
                Store=objDocumentNoSetting.StoreId.HasValue? objDocumentNoSetting.psmsStore.Name:"",
                Supplier = objDocumentNoSetting.SupplierId.HasValue ? objDocumentNoSetting.psmsSupplier.Name : "",
            
                objDocumentNoSetting.NoofDigit,
            };
            return this.Direct(new
            {
                success = true,
                data = documentNoSetting
            });
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = hashtable["searchText"].ToString();

            var records = _documentNoSetting.GetAll();
            records = searchText != "" ? records.Where(p => p.DocumentType.ToUpper().Contains(searchText.ToUpper())) : records;
            records = records.OrderBy(o =>o.SupplierId.HasValue? o.psmsSupplier.Name:"");
         //   records = dir == "ASC" ? records.OrderBy(r => r.GetType().GetProperty(sort).GetValue(r, null)) : records.OrderByDescending(r => r.GetType().GetProperty(sort).GetValue(r, null));

            var count = records.Count();
            records = records.Skip(start).Take(limit);
            var documentNoSettings = records.Select(record => new
            {
                record.Id,
                record.PreFix,
                record.SurFix,
                record.Year,
                Supplier = record.SupplierId.HasValue ? record.psmsSupplier.Name : "",
        
                Store = record.StoreId.HasValue ? record.psmsStore.Name : "",          
                record.DocumentType,
                record.LastNumber,
                record.NoofDigit

            }).Cast<object>().ToList();
            var result = new { total = count, data = documentNoSettings };
            return this.Direct(result);
        }

        [FormHandler]
        public ActionResult Save(psmsDocumentNoSetting documentNoSetting)
        {
            if (documentNoSetting.Id==Guid.Empty)
            {
                documentNoSetting.Id = Guid.NewGuid();
                _documentNoSetting.AddNew(documentNoSetting);
            }
            else
            {
                _documentNoSetting.Edit(documentNoSetting);
            }
            return this.Direct(new { success = true, data = "Data has been saved successfully!" });
        }

        public ActionResult Delete(Guid id)
        {
            try
            {
                _documentNoSetting.Delete(c=>c.Id == id);
                
                return this.Direct(new { success = true, data = "record has been successfully deleted!" });
            }
            catch (Exception)
            {
                return this.Direct(new { success = false, data = "Could not delete the selected record!" });
            }
        }

        #endregion  
    }
}
