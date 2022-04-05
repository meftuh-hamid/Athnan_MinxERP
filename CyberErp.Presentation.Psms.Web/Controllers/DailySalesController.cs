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
    public class DailySalesController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<slmsDailySales> _dailySales;
     
        #endregion

        #region Constructor

        public DailySalesController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _dailySales = new BaseModel<slmsDailySales>(_context);
        }

        #endregion

        #region Actions
        #region Credit
        public ActionResult GetAll(int start, int Amount, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid storeId = Guid.Empty;
            var startDate = new DateTime();
            var endDate = new DateTime();
            if (hashtable["storeId"] != null)
                Guid.TryParse(hashtable["storeId"].ToString(), out storeId);
            if (hashtable["startDate"] != null)
                DateTime.TryParse(hashtable["startDate"].ToString(), out startDate);

            if (hashtable["endDate"] != null)
                DateTime.TryParse(hashtable["endDate"].ToString(), out endDate);

            var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";

            var filtered = _dailySales.GetAll().AsQueryable().Where(i => i.StoreId == storeId); ;
            if (hashtable["startDate"] != null) filtered = filtered.Where(a => a.Date >= startDate);
            if (hashtable["endDate"] != null) filtered = filtered.Where(a => a.Date <= endDate);
         
            filtered = searchText != "" ? filtered.Where(s =>

                s.Remark.Contains(searchText.ToUpper())) : filtered;

            switch (sort)
            {

                case "SalesAmount":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.SalesAmount) : filtered.OrderByDescending(u => u.SalesAmount);
                    break;
                case "SalesReturnAMount":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.SalesReturnAMount) : filtered.OrderByDescending(u => u.SalesReturnAMount);
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
                item.StoreId,
                item.SalesAmount,
                item.Expense,
                item.BankDeposite,
                item.SalesReturnAMount,
                Date = item.Date.ToShortDateString(),
                item.UnDepositedAmount,
                item.Difference,
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
        public ActionResult Delete(Guid id)
        {

           _dailySales.Delete(o => o.Id == id);
            _context.SaveChanges();
            return this.Direct(new { success = true, data = "data has been successfully deleted!" });
        }
        public ActionResult Save(Guid storeId, string dailySalesString)
        {
            using (var transaction = new TransactionScope())
            {
                try
                {

                    IList<slmsDailySales> dailySalesList = new List<slmsDailySales>();
                    var oldDailySalesList = _dailySales.GetAll().AsQueryable().Where(o => o.StoreId == storeId).ToList();
                    if (dailySalesString != "")
                        dailySalesString = dailySalesString.Remove(dailySalesString.Length - 1);
                  
                    IList<string> dailySaless = dailySalesString.Split(new[] { ';' }).ToList();

                    DateTime date = new DateTime();
                    for (var i = 0; i < dailySaless.Count(); i++)
                    {
                        var dailySales = dailySaless[i].Split(new[] { ':' });
                        var dailySalesId = Guid.Empty;
                        Guid.TryParse(dailySales[0].ToString(), out dailySalesId);

                        var objDailySales = dailySalesId != Guid.Empty ? _dailySales.Get(o => o.Id == dailySalesId) : new slmsDailySales();

                        objDailySales.StoreId = storeId;
                        objDailySales.SalesAmount = decimal.Parse(dailySales[1]);
                        objDailySales.Expense = decimal.Parse(dailySales[2]);
                        objDailySales.BankDeposite = decimal.Parse(dailySales[3]);
                        objDailySales.UnDepositedAmount = decimal.Parse(dailySales[4]);
                      
                        if (DateTime.TryParse(dailySales[5], out date))
                            objDailySales.Date = date;
                        objDailySales.Remark = dailySales[6];
                        objDailySales.SalesReturnAMount = decimal.Parse(dailySales[7]);
                        objDailySales.Difference = decimal.Parse(dailySales[8]);
                        objDailySales.UpdatedAt = DateTime.Now;

                        if (dailySalesId == Guid.Empty)
                        {
                            objDailySales.Id = Guid.NewGuid();
                            objDailySales.CreatedAt = DateTime.Now;
                            _dailySales.AddNew(objDailySales);
                        }
                        dailySalesList.Add(objDailySales);
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

      
        #endregion

        #region Methods
    
        #endregion
    }
}