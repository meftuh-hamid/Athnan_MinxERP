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


namespace CyberErp.Presentation.Psms.Web.Controllers
{
    public class CustomerController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<slmsCustomer> _customer;
        private readonly BaseModel<slmsCustomerCredit> _customerCredit;
        #endregion

        #region Constructor

        public CustomerController()
        {
            _context = new ErpEntities(Constants.ConnectionString);       
            _customer = new BaseModel<slmsCustomer>(_context);
            _customerCredit = new Business.Component.Psms.BaseModel<slmsCustomerCredit>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(Guid id)
        {
            var objCustomer = _customer.Get(o=>o.Id==id);
            var customer = new
            {
                objCustomer.Id,
                objCustomer.Name,
                objCustomer.Code,
                objCustomer.Country,
                objCustomer.Region,
                objCustomer.City,
                objCustomer.Woreda,
                objCustomer.HouseNo,
                objCustomer.VatNumber,
                objCustomer.TinNumber,
                objCustomer.Telephone,
                objCustomer.Email,
                objCustomer.POBox,
                objCustomer.PriceCategoryId,
                PriceCategory=objCustomer.PriceCategoryId.HasValue? objCustomer.slmsPriceCategory.Name:"",
                objCustomer.ContactPerson,
                objCustomer.CreditLimit,
                objCustomer.Address,
                objCustomer.LicenseNo,
                objCustomer.RegistrationNo,
                objCustomer.CreatedAt,
                objCustomer.CustomerCategoryId,
                CustomerCategory=objCustomer.slmsCustomerCategory.Name,
                objCustomer.SubsidiaryAccountId,
          
            };
            return this.Direct(new
            {
                success = true,
                data = customer
            });

        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
            var customerCategoryId = Guid.Empty;
            if (hashtable["customerCategoryId"]!=null)
            Guid.TryParse(hashtable["customerCategoryId"].ToString(), out customerCategoryId);

            var filtered = _customer.GetAll().AsQueryable();
            if (customerCategoryId != Guid.Empty)
               filtered= filtered.Where(o => o.CustomerCategoryId == customerCategoryId);
            filtered = searchText != "" ? filtered.Where(i =>

                i.Name.ToUpper().Contains(searchText.ToUpper()) ||
                i.Country.ToUpper().Contains(searchText.ToUpper()) ||
                  i.LicenseNo.ToUpper().Contains(searchText.ToUpper()) ||
                    i.RegistrationNo.ToUpper().Contains(searchText.ToUpper()) ||
                i.City.ToUpper().Contains(searchText.ToUpper()) ||
                i.Woreda.ToUpper().Contains(searchText.ToUpper()) ||
                i.Email.ToUpper().Contains(searchText.ToUpper()) ||
                i.Telephone.ToUpper().Contains(searchText.ToUpper()) ||
                i.ContactPerson.ToUpper().Contains(searchText.ToUpper()) ||
                i.VatNumber.ToUpper().Contains(searchText.ToUpper()) ||
               (i.PriceCategoryId.HasValue?   i.slmsPriceCategory.Name.ToUpper().Contains(searchText.ToUpper()):false) ||
                i.TinNumber.ToUpper().Contains(searchText.ToUpper()))
                : filtered;
            switch (sort)
            {
                 case "Name":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Name) : filtered.OrderByDescending(u => u.Name);
                    break;
                case "ContactPerson":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.ContactPerson) : filtered.OrderByDescending(u => u.ContactPerson);
                    break;
                case "Country":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Country) : filtered.OrderByDescending(u => u.Country);
                    break;
                case "City":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.City) : filtered.OrderByDescending(u => u.City);
                    break;
                case "HouseNo":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.HouseNo) : filtered.OrderByDescending(u => u.HouseNo);
                    break;
                case "Email":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Email) : filtered.OrderByDescending(u => u.Email);
                    break;
                case "PriceCategory":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.PriceCategoryId.HasValue ? u.slmsPriceCategory.Name : "") : filtered.OrderByDescending(u => u.PriceCategoryId.HasValue ? u.slmsPriceCategory.Name : "");
                    break;
                case "Telephone":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Telephone) : filtered.OrderByDescending(u => u.Telephone);
                    break;
                case "TinNumber":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.TinNumber) : filtered.OrderByDescending(u => u.TinNumber);
                    break;
                case "VatNumber":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.VatNumber) : filtered.OrderByDescending(u => u.VatNumber);
                    break;
                case "LicenseNo":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.LicenseNo) : filtered.OrderByDescending(u => u.LicenseNo);
                    break;
                case "RegistrationNo":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.RegistrationNo) : filtered.OrderByDescending(u => u.RegistrationNo);
                    break;
                default:
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Id) : filtered.OrderByDescending(u => u.Id);
                    break;
        
            }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);

            var Customers = filtered.Select(item => new
            {
                item.Id,
                item.Name,
                item.Code,
                item.Country,
                item.Region,
                item.City,
                item.Woreda,
                item.HouseNo,
                item.VatNumber,
                item.TinNumber,
                item.Telephone,
                item.Email,
                item.POBox,
                PriceCategory = item.PriceCategoryId.HasValue ? item.slmsPriceCategory.Name : "",
                item.PriceCategoryId,
                item.ContactPerson,
                item.LicenseNo,
                item.RegistrationNo,
                item.CreatedAt



            }).ToList();
            var result = new
            {
                total = count,
                data = Customers
            };
            return this.Direct(result);
        }
        [FormHandler]
        public ActionResult Save(slmsCustomer customer)
        {
            _context.Database.Connection.Open();
            _context.Database.CommandTimeout = int.MaxValue;

            try
            {

                var objCustomer = _customer.Find(c => (c.Name.ToUpper() == customer.Name.ToUpper()) && c.Id != customer.Id);
                if (objCustomer != null)
                {
                    var result = new { success = false, data = "Data has already been registered!" };
                    return this.Direct(result);
                }
                customer.UpdatedAt = DateTime.Now;
                if (customer.Id ==Guid.Empty)
                {
                    customer.CreatedAt = DateTime.Now;
                    customer.Id = Guid.NewGuid();
                    _customer.AddNew(customer);
                }
                else
                {
                    _customer.Edit(customer);
                }
                _context.SaveChanges();
             
                return this.Direct(new { success = true, customerId = customer.Id, data = "Data has been added successfully!" });
            }
            catch (Exception e)
            {
                return this.Direct(new { success = false, data = e.InnerException != null ? e.InnerException.Message : e.Message });
            }
        }

        public ActionResult Delete(Guid id)
        {
             
            _customer.Delete(o=>o.Id==id);
            _context.SaveChanges();
            return this.Direct(new { success = true, data = "Item Category has been successfully deleted!" });
        }


        #endregion

        #region Credit
        public ActionResult GetAllCustomerCredit(int start, int Amount, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid customerId=Guid.Empty;
            if (hashtable["customerId"]!=null)
            Guid.TryParse(hashtable["customerId"].ToString(), out customerId);
            var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
            var startDate = new DateTime();
            var endDate = new DateTime();
             if (hashtable["startDate"] != null)
                DateTime.TryParse(hashtable["startDate"].ToString(), out startDate);

            if (hashtable["endDate"] != null)
                DateTime.TryParse(hashtable["endDate"].ToString(), out endDate);
            var filtered = _customerCredit.GetAll().AsQueryable().Where(i => i.CustomerId == customerId); ;
          
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
                item.CustomerId,
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
        public ActionResult DeleteCustomerCredit(Guid id)
        {

          _customerCredit.Delete(o => o.Id == id);
            _context.SaveChanges();
            return this.Direct(new { success = true, data = "data has been successfully deleted!" });
        }
        public ActionResult SaveCustomerCredit(Guid customerId, string creditAmountString)
        {
            using (var transaction = new TransactionScope())
            {
                try
                {

                    IList<slmsCustomerCredit> creditAmountList = new List<slmsCustomerCredit>();
                    var oldCreditAmountList = _customerCredit.GetAll().AsQueryable().Where(o => o.CustomerId == customerId).ToList();
                    if (creditAmountString != "")
                        creditAmountString = creditAmountString.Remove(creditAmountString.Length - 1);
                  
                    IList<string> creditAmounts = creditAmountString.Split(new[] { ';' }).ToList();

                    DateTime date = new DateTime();
                    for (var i = 0; i < creditAmounts.Count(); i++)
                    {
                        var creditAmount = creditAmounts[i].Split(new[] { ':' });
                        var creditAmountId = Guid.Empty;
                        Guid.TryParse(creditAmount[0].ToString(), out creditAmountId);

                        var objCreditAmount = creditAmountId != Guid.Empty ? _customerCredit.Get(o => o.Id == creditAmountId) : new slmsCustomerCredit();

                        objCreditAmount.CustomerId = customerId;
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
                            _customerCredit.AddNew(objCreditAmount);
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
