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
using System.Transactions;

namespace CyberErp.Presentation.Web.Psms.Controllers
{
    public class SupplierController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsSupplier> _supplier;
        private readonly BaseModel<psmsSupplierCredit> _supplierCredit;
        #endregion

        #region Constructor

        public SupplierController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _supplier = new BaseModel<psmsSupplier>(_context);
            _supplierCredit = new BaseModel<psmsSupplierCredit>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(Guid ids)
        {
            var objSupplier = _supplier.Get(o => o.Id == ids);
            var item = new
            {
                objSupplier.Id,
                objSupplier.Name,
                objSupplier.Code,
                objSupplier.PurchaseModality,
                objSupplier.Address,
                objSupplier.ContactPerson,
                objSupplier.Email,
                objSupplier.SupplierCategoryId,
                SupplierCategory=objSupplier.lupSupplierCategory.Name,
                objSupplier.SubsidiaryAccountId,
                 
                objSupplier.Telephone,
                objSupplier.TIN,
                objSupplier.VAT,
                objSupplier.TaxRateIds,
                objSupplier.TaxRateDescription,
                 objSupplier.Remark,
                objSupplier.CreatedAt
            };
            return this.Direct(new
            {
                success = true,
                data = item
            });
        }        
        public ActionResult GetAll(int start, int limit, string sort, string dir , string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            var searchText=hashtable["searchText"]!=null?hashtable["searchText"].ToString():"";
          
            var filtered =  _supplier.GetAll().AsQueryable();
            filtered = searchText != "" ? filtered.Where(i =>

                i.Name.ToUpper().Contains(searchText.ToUpper()) ||
                i.Code.ToUpper().Contains(searchText.ToUpper())||
                i.ContactPerson.ToUpper().Contains(searchText.ToUpper()) ||
                i.Email.ToUpper().Contains(searchText.ToUpper()) ||
                i.Telephone.ToUpper().Contains(searchText.ToUpper()) ||
                i.TIN.ToUpper().Contains(searchText.ToUpper()) ||
                i.VAT.ToUpper().Contains(searchText.ToUpper())||
                i.lupSupplierCategory.Name.ToUpper().Contains(searchText.ToUpper()))
                : filtered;
            switch (sort)
            {
                  case "Name":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Name) : filtered.OrderByDescending(u => u.Name);
                    break;
                case "Code":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Code) : filtered.OrderByDescending(u => u.Code);
                    break;
                case "ContactPerson":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.ContactPerson) : filtered.OrderByDescending(u => u.ContactPerson);
                    break;
                case "Email":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Email) : filtered.OrderByDescending(u => u.Email);
                    break;
                case "Telephone":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Telephone) : filtered.OrderByDescending(u => u.Telephone);
                    break;
                case "TIN":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.TIN) : filtered.OrderByDescending(u => u.TIN);
                    break;
                case "VAT":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.VAT) : filtered.OrderByDescending(u => u.VAT);
                    break;
                case "SupplierCategory":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.lupSupplierCategory.Name) : filtered.OrderByDescending(u => u.lupSupplierCategory.Name);
                    break;
              
                 case "Remark":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Remark) : filtered.OrderByDescending(u => u.Remark);
                    break;
                 default:
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                    break;
 
               }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);
         
           var Suppliers = filtered.Select(item => new
            {
                item.Id,
                item.Name,
                item.Code,
                item.Address,
                item.ContactPerson,
                item.Email,
                item.SupplierCategoryId,
                SupplierCategory = item.lupSupplierCategory.Name,
                item.SubsidiaryAccountId,
                item.Telephone,
                item.TIN,
                item.VAT,
                item.Remark,
                item.CreatedAt
       
      
            }).ToList();
            var result = new
            {
                total = count,
                data = Suppliers
            };
            return this.Direct(result);
        }

        public ActionResult Delete(Guid id)
        {
          
            _supplier.Delete(o=>o.Id==id);
         
            return this.Direct(new { success = true, data = "Data has been successfully deleted!" });
        }

        [FormHandler]
        public ActionResult Save(psmsSupplier supplier)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
         
                try
                {
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var supplierItemsString = hashtable["supplierItems"].ToString();

                    var objSupplier = _supplier.Find(c => (c.Name.ToUpper() == supplier.Name.ToUpper()) && c.Id != supplier.Id);
                    if (objSupplier != null)
                    {
                        var result = new { success = false, data = "Data has already been registered!" };
                        return this.Direct(result);
                    }
                    if (supplier.Id == Guid.Empty)
                    {
                        supplier.Id = Guid.NewGuid();
                        supplier.CreatedAt = DateTime.Now;
                        supplier.UpdatedAt = DateTime.Now;
                        _supplier.AddNew(supplier);
                    }
                    else
                    {
                        supplier.UpdatedAt = DateTime.Now;
                        _supplier.Edit(supplier);
                    }
                          _context.SaveChanges();
                        transaction.Complete();
              
                    return this.Direct(new { success = true,supplierId=supplier.Id, data = "Data has been added successfully!" });
                }
                catch (Exception e)
                {
                    return this.Direct(new { success = false, data = e.InnerException != null ? e.InnerException.Message : e.Message });
                }
            }
             
        }

        #endregion

        #region Credit
        public ActionResult GetAllSupplierCredit(int start, int Amount, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid supplierId=Guid.Empty;
            if(hashtable["supplierId"]!=null)
            Guid.TryParse(hashtable["supplierId"].ToString(), out supplierId);
            var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";

            var startDate = new DateTime();
            var endDate = new DateTime();
            if (hashtable["startDate"] != null)
                DateTime.TryParse(hashtable["startDate"].ToString(), out startDate);

            if (hashtable["endDate"] != null)
                DateTime.TryParse(hashtable["endDate"].ToString(), out endDate);
            var filtered = _supplierCredit.GetAll().AsQueryable().Where(i => i.SupplierId == supplierId);
           
            if (hashtable["startDate"] != null) filtered = filtered.Where(a => a.Date >= startDate);
            if (hashtable["endDate"] != null) filtered = filtered.Where(a => a.Date <= endDate);
         
            filtered = searchText != "" ? filtered.Where(s =>

                s.InvoiceReference.ToUpper().Contains(searchText.ToUpper()) ||
                s.Fs.ToUpper().Contains(searchText.ToUpper())) : filtered;

            switch (sort)
            {

                case "InvoiceReference":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.InvoiceReference) : filtered.OrderByDescending(u => u.InvoiceReference);
                    break;
                case "Fs":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Fs) : filtered.OrderByDescending(u => u.Fs);
                    break;
                case "Date":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Date) : filtered.OrderByDescending(u => u.Date);
                    break;
                case "Remark":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Remark) : filtered.OrderByDescending(u => u.Remark);
                    break;
                default:
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                    break;
            }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(Amount);


            var items = filtered.ToList().Select(item => new
            {
                item.Id,
                item.SupplierId,
                item.InvoiceReference,
                item.InvoiceAmount,
                item.RemainingAmount,
                item.Fs,
                Date = item.Date.HasValue ? item.Date.Value.ToShortDateString() : "",
                item.Remark,
                item.CreatedAt
            }).ToList();


            var result = new
            {
                total = count,
                data = items
            };
            return this.Direct(result);
        }
        public ActionResult DeleteSupplierCredit(Guid id)
        {

           _supplierCredit.Delete(o => o.Id == id);
            _context.SaveChanges();
            return this.Direct(new { success = true, data = "data has been successfully deleted!" });
        }
        public ActionResult SaveSupplierCredit(Guid supplierId, string creditAmountString)
        {
            using (var transaction = new TransactionScope())
            {
                try
                {

                    IList<psmsSupplierCredit> creditAmountList = new List<psmsSupplierCredit>();
                    var oldCreditAmountList = _supplierCredit.GetAll().AsQueryable().Where(o => o.SupplierId == supplierId).ToList();
                    if (creditAmountString != "")
                        creditAmountString = creditAmountString.Remove(creditAmountString.Length - 1);
               
                    IList<string> creditAmounts = creditAmountString.Split(new[] { ';' }).ToList();

                    DateTime date = new DateTime();
                    for (var i = 0; i < creditAmounts.Count(); i++)
                    {
                        var creditAmount = creditAmounts[i].Split(new[] { ':' });
                        var creditAmountId = Guid.Empty;
                        Guid.TryParse(creditAmount[0].ToString(), out creditAmountId);

                        var objCreditAmount = creditAmountId != Guid.Empty ? _supplierCredit.Get(o => o.Id == creditAmountId) : new psmsSupplierCredit();

                        objCreditAmount.SupplierId = supplierId;
                        objCreditAmount.InvoiceReference = creditAmount[1];
                        objCreditAmount.Fs = creditAmount[2];
                        objCreditAmount.InvoiceAmount = decimal.Parse(creditAmount[3]);
                        objCreditAmount.RemainingAmount = decimal.Parse(creditAmount[4]);
                        if (DateTime.TryParse(creditAmount[5], out date))
                            objCreditAmount.Date = date;
                        objCreditAmount.Remark = creditAmount[6];
                        objCreditAmount.UpdatedAt = DateTime.Now;

                        if (creditAmountId == Guid.Empty)
                        {
                            objCreditAmount.Id = Guid.NewGuid();
                            objCreditAmount.CreatedAt = DateTime.Now;
                            _supplierCredit.AddNew(objCreditAmount);
                        }
                        creditAmountList.Add(objCreditAmount);
                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Direct(new { success = true, data = "Data has been added successfully!" });

                }
                catch (Exception exception)
                {
                    return this.Direct(new { success = false, data = exception.Message });
                }
            }


        }
       
        #endregion



        #region Methods
        #endregion
    }
}