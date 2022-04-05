using CyberErp.Data.Model;
using System.Collections.Generic;
using CyberErp.Business.Component.Psms;
using System;
using System.Data.Entity;
using System.Data.Objects;
using System.Linq;
using System.Web;
using System.Data.Entity.Core.EntityClient;
using System.Data.SqlClient;
using CrystalDecisions.Shared;
namespace CyberErp.Presentation.Psms.Web.Classes
{
    public class Utility
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsDocumentNoSetting> _documentNoSetting;
        private readonly Store _store;
        private readonly BaseModel<corePeriod> _period;

        #endregion

        #region Constructor

        public Utility()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _documentNoSetting = new BaseModel<psmsDocumentNoSetting>(_context);
            _period = new BaseModel<corePeriod>(_context);
            _store = new Store(_context);
        }

        #endregion

        public static string InQuotation(string paramString)
        {
            if (paramString == "")
            {
                return (char)39 + "" + (char)39;
            }
            else
            {
                return (char)39 + paramString + (char)39;
            }

        }
        public static double DateDiffInMonths(DateTime startDate, DateTime endDate)
        {
            int monthsOnly = (endDate.Month + endDate.Year * 12) - (startDate.Month + startDate.Year * 12);
            double daysInEndMonth = (endDate - endDate.AddMonths(1)).Days;
            double totalMonths = monthsOnly + ((startDate.Day - endDate.Day - 1) / daysInEndMonth);
            return totalMonths;
        }
        public string GetVoucherNumber(string documentType)
        {
            try
            {
                var objdocumentNoSetting = _documentNoSetting.Get(s => s.DocumentType == documentType);
                var format = GetVoucherFormat(objdocumentNoSetting.NoofDigit);
                var currentNumber = string.Format(format, objdocumentNoSetting.LastNumber);
                var document = GetDocument(objdocumentNoSetting.PreFix, objdocumentNoSetting.SurFix, currentNumber, objdocumentNoSetting.Year);
                return document;
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }
        public void UpdateVoucherNumber(string documentType)
        {
            var objDocumentNoSetting = _documentNoSetting.Get(s => s.DocumentType == documentType);
            if (objDocumentNoSetting != null)
            {
                objDocumentNoSetting.LastNumber += 1;
            }
            _context.SaveChanges();
        }
        public string GetVoucherNumber(string documentType, Guid storeId)
        {
            try
            {
                var store = _store.GetAll().AsQueryable().Where(o => o.Id == storeId).FirstOrDefault();
                var parentId = Guid.Empty;
                if (store != null)
                    parentId = parentId;
                var objdocumentNoSetting = new psmsDocumentNoSetting();

                objdocumentNoSetting = _documentNoSetting.GetAll().AsQueryable().Where(s => s.DocumentType == documentType && (s.StoreId == storeId || s.StoreId == parentId)).FirstOrDefault();
                if (objdocumentNoSetting == null)
                    objdocumentNoSetting = _documentNoSetting.GetAll().AsQueryable().Where(s => s.DocumentType == documentType && !s.StoreId.HasValue).FirstOrDefault();


                var format = GetVoucherFormat(objdocumentNoSetting.NoofDigit);
                var currentNumber = string.Format(format, objdocumentNoSetting.LastNumber);
                var document = GetDocument(objdocumentNoSetting.PreFix.Trim(), objdocumentNoSetting.SurFix, currentNumber, objdocumentNoSetting.Year);

                return document;
            }
            catch (Exception e)
            {
                return string.Empty;
            }
        }
        public void UpdateVoucherNumber(string documentType, Guid storeId)
        {
            var store = _store.GetAll().AsQueryable().Where(o => o.Id == storeId).FirstOrDefault();
            var parentId = Guid.Empty;
            if (store != null)
                parentId = parentId;
            var objdocumentNoSetting = new psmsDocumentNoSetting();

            objdocumentNoSetting = _documentNoSetting.GetAll().AsQueryable().Where(s => s.DocumentType == documentType && (s.StoreId == storeId || s.StoreId == parentId)).FirstOrDefault();
            if (objdocumentNoSetting == null)
                objdocumentNoSetting = _documentNoSetting.GetAll().AsQueryable().Where(s => s.DocumentType == documentType && !s.StoreId.HasValue).FirstOrDefault();

            if (objdocumentNoSetting != null)
            {
                objdocumentNoSetting.LastNumber += 1;
            }
            _context.SaveChanges();
        }

        public string GetVoucherNumberBySupplier(string documentType, Guid supplierId)
        {
            try
            {
                var objdocumentNoSetting = _documentNoSetting.GetAll().AsQueryable().Where(s => s.DocumentType == documentType && (s.SupplierId == null || s.SupplierId == supplierId)).FirstOrDefault();
                var format = GetVoucherFormat(objdocumentNoSetting.NoofDigit);
                var currentNumber = string.Format(format, objdocumentNoSetting.LastNumber);
                var document = GetDocument(objdocumentNoSetting.PreFix.Trim(), objdocumentNoSetting.SurFix, currentNumber, objdocumentNoSetting.Year);

                return document;
            }
            catch (Exception e)
            {
                return string.Empty;
            }
        }
        public void UpdateVoucherNumberBySpplier(string documentType, Guid supplierId)
        {
            var objdocumentNoSetting = _documentNoSetting.GetAll().AsQueryable().Where(s => s.DocumentType == documentType && (s.SupplierId == null || s.SupplierId == supplierId)).FirstOrDefault();
            if (objdocumentNoSetting != null)
            {
                objdocumentNoSetting.LastNumber += 1;
            }
            _context.SaveChanges();
        }
    
        public string GetVoucherFormat(int numberOfDigits)
        {
            var format = "{0:";
            for (var i = 0; i < numberOfDigits; i++)
            {
                format += "0";
            }
            format += "}";
            return format;
        }
        public string GetDocument(string prefix, string sufix, string documentNo, int? year)
        {
            string document = "";
           
            document = prefix + "-" + documentNo;
            if (sufix != null && sufix != "")
                document = document + "-" + sufix;
            if (year != null)
                document = document + "-" + year.ToString();

            return document;
        }

        public corePeriod GetPeriod(DateTime date)
        {
            var period = _period.Find(p => p.StartDate <= date && p.EndDate >= date);
            return period;
        }

        public static void CopyObject(object source, object destination)
        {
            var destProperties = destination.GetType().GetProperties();

            foreach (var sourceProperty in source.GetType().GetProperties())
            {
                foreach (var destProperty in destProperties)
                {
                    if (destProperty.Name == sourceProperty.Name && destProperty.PropertyType.IsAssignableFrom(sourceProperty.PropertyType))
                    {
                        destProperty.SetValue(destination, sourceProperty.GetValue(source, new object[] { }), new object[] { });
                        break;
                    }
                }
            }
        }

        public class DataModel
        {
            public Guid Id { get; set; }
        }
        public string GetConnectionString()
        {
            var connString = "";
            EntityConnectionStringBuilder entityBuilder = new EntityConnectionStringBuilder(Constants.ConnectionString);
            SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder(entityBuilder.ProviderConnectionString);
            ConnectionInfo connectionInfo = new ConnectionInfo();
            connString = "Data Source=" + builder.DataSource + ";Initial Catalog=" + builder.InitialCatalog + ";Integrated Security=SSPI;MultipleActiveResultSets=true";
            return connString;
        }
    }
}