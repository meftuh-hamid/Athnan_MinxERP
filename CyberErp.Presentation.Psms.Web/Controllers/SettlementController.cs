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
using Newtonsoft.Json;
namespace CyberErp.Presentation.Iffs.Web.Controllers
{
    public class SettlementController : DirectController
    {
        #region Members 

        private readonly DbContext _context;
        private readonly BaseModel<slmsSettlementHeader> _settlementHeader;
        private readonly BaseModel<slmsSettlementDetail> _settlementDetail;
         private readonly BaseModel<slmsSalesHeader> _invoiceHeader;
        private readonly BaseModel<slmsCustomer> _customer;
        Guid issuedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Issued);
   
        #endregion

        #region Constractor 
        public SettlementController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _settlementHeader = new BaseModel<slmsSettlementHeader>(_context);
            _settlementDetail = new BaseModel<slmsSettlementDetail>(_context);
            _invoiceHeader = new BaseModel<slmsSalesHeader>(_context);
            _customer = new BaseModel<slmsCustomer>(_context);
          }

        #endregion

        #region Actions 
      
        #region Settlement
        public ActionResult GetDocumentNo()
        {
            var ReferenceNo = "Auto-Genereted";

            var Permirmition = (List<Permission>)Session[Constants.UserPermission];
            var currentuser = (coreUser)Session[Constants.CurrentUser];
            var user = currentuser.FirstName + " " + currentuser.LastName;
            var EmployeeId = (Guid)currentuser.EmployeeId;
            var Constantsfields = new
            {
                ReferenceNo = ReferenceNo,
                user = user,
                userId = EmployeeId
            };
            var result = new
            {
                total = 1,
                data = Constantsfields,

            };
            return this.Direct(result);


        }
        public ActionResult Get(Guid id)
        {
            var obj = _settlementHeader.Get(c => c.Id == id);

            var settlement = new
            {
              

                obj.Id,
                obj.ReferenceNo,
                Date=obj.Date.ToShortDateString(),
                obj.CollectedFrom,
                 obj.Amount,
                obj.CustomerId,
                obj.Remark,
               };
            return this.Direct(new
            {
                success = true,
                data = settlement
            });
        }
        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText="";
            if(hashtable["searchText"]!=null)
             searchText = hashtable["searchText"].ToString();
            DateTime date = new DateTime();
            bool isDatestring = DateTime.TryParse(searchText, out date);
            var records = _settlementHeader.GetAll().AsQueryable();

            records = searchText != "" ? records.Where(p => 
                p.ReferenceNo.ToUpper().Contains(searchText.ToUpper()) ||
                 p.CollectedFrom.ToUpper().Contains(searchText.ToUpper())||
                 
         
                (isDatestring ? p.Date >= date : false) 
              
                ) : records;
           
            switch (sort)
            {
                 case "Id":
                 records = dir == "ASC" ? records.OrderByDescending(r => r.CreatedAt) : records.OrderByDescending(r => r.CreatedAt);
                  break;
                 case "ReferenceNo":
                  records = dir == "ASC" ? records.OrderBy(r => r.ReferenceNo) : records.OrderByDescending(r => r.ReferenceNo);
                 break;               
                 case "Date":
                 records = dir == "ASC" ? records.OrderBy(r => r.Date) : records.OrderByDescending(r => r.Date);
                  break;
                 case "Amount":
                  records = dir == "ASC" ? records.OrderBy(r => r.Amount) : records.OrderByDescending(r => r.Amount);
                  break;
                 case "Remark":
                  records = dir == "ASC" ? records.OrderBy(r => r.Remark) : records.OrderByDescending(r => r.Remark);
                  break;
                       
           
            }


            var count = records.Count();
            records = records.Skip(start).Take(limit);
            var settlements = records.Select(record => new
            {
                record.Id,
                record.ReferenceNo,
                Date = record.Date,
                record.CollectedFrom,
                 record.Amount,
                record.Remark,
        
            }).ToList().Select(record => new
            {
                record.Id,
                record.ReferenceNo,              
                Date = record.Date.ToShortDateString(),
                record.CollectedFrom,
                 record.Amount,
                record.Remark,

            }).ToList();
            var result = new { total = count, data = settlements };
            return this.Direct(result);
        }
        public ActionResult GetAllDetail(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            Guid settlementId = Guid.Empty;
            if (hashtable["settlementId"] != null)
                Guid.TryParse(hashtable["settlementId"].ToString(), out settlementId);
           
            var records = _settlementDetail.GetAll().AsQueryable().Where(o => o.SettlementHeaderId == settlementId);
            var count = records.Count();
            var detailRecords = records.ToList().Select(record => new
            {
                record.Id,
                record.SettlementHeaderId,
                record.InvoiceId,
                Invoice = record.InvoiceId.HasValue ? record.slmsSalesHeader.VoucherNumber : record.slmsCustomerCredit.InvoiceReference,
                NetPay = record.InvoiceId.HasValue ? record.slmsSalesHeader.NetPay : record.slmsCustomerCredit.RemainingAmount,
                record.CreditId,
                record.SettledAmount,
                SettlementAmount = record.InvoiceId.HasValue ? record.slmsSalesHeader.slmsSettlementDetail : record.slmsCustomerCredit.slmsSettlementDetail,
                record.Remark,
            }).Select(record => new
            {
                record.Id,
                record.SettlementHeaderId,
                record.InvoiceId,
                Invoice = record.Invoice,
                InvoiceAmount= record.NetPay,
                record.SettledAmount,
                RemainingAmount = record.NetPay - record.SettlementAmount.Where(a=>a.Id!=record.Id).Select(a=>a.SettledAmount).DefaultIfEmpty(0).Sum(),
                record.Remark,
            }).ToList();
            var result = new { total = count, data = detailRecords };
            return this.Direct(result);
        }
       
        [FormHandler]
        public ActionResult Save(slmsSettlementHeader settlement)
        {
            using (
                var transaction = new TransactionScope((TransactionScopeOption.Required),
                    new TransactionOptions {IsolationLevel = IsolationLevel.ReadCommitted}))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var voucherDetailsString = hashtable["settlementDetails"].ToString();
                    var voucherDetails = voucherDetailsString.Remove(voucherDetailsString.Length - 1).Split(new[] { ';' });
                    string action = hashtable["action"].ToString();
                    if (settlement.Id.Equals(Guid.Empty))
                    {
                       
                        settlement.Id = Guid.NewGuid();
                        settlement.CreatedAt = DateTime.Now;
                        settlement.UpdatedAt = DateTime.Now;
                           _settlementHeader.AddNew(settlement);
                        
                    }
                    else
                    {
                        settlement.UpdatedAt = DateTime.Now;
                        _settlementHeader.Edit(settlement);
                    }

                    SaveSettlementDetails(settlement, voucherDetails.ToList(), action);

                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Direct(new {success = true, data = "Settlement Request has been saved Successfully!"});
                }
                catch (Exception exception)
                {
                    return
                        this.Direct( new {success = false,data =exception.InnerException != null? exception.InnerException.Message: exception.Message
                            });
                }
            }
        }
        public ActionResult Delete(Guid id)
        {
            try
            {               
                 _settlementDetail.Delete(c => c.SettlementHeaderId == id);
                _settlementHeader.Delete(c => c.Id == id);
                _context.SaveChanges();
                return this.Direct(new { success = true, data = "Record has been successfully deleted!" });
            }
            catch (Exception)
            {
                return this.Direct(new { success = false, data = "Could not delete the selected record!" });
            }
        } 
        public void SaveSettlementDetails(slmsSettlementHeader settlementHeader, IList<string> settlementDetails, string action)
        {
            IList<slmsSettlementDetail> advanceDetailList = new List<slmsSettlementDetail>();
            var oldsSettlementDetailList = _settlementDetail.GetAll().AsQueryable().Where(o => o.SettlementHeaderId == settlementHeader.Id).ToList();
            Guid id = Guid.Empty;
            for (var i = 0; i < settlementDetails.Count(); i++)
            {
                var advanceDetail = settlementDetails[i].Split(new[] { ':' });
                Guid advanceDetailId = Guid.Empty;
                Guid.TryParse(advanceDetail[0].ToString(), out advanceDetailId);
                var objSettlementDetail = advanceDetailId != Guid.Empty ? oldsSettlementDetailList.Where(o => o.Id == advanceDetailId).FirstOrDefault() : new slmsSettlementDetail();

                objSettlementDetail.SettlementHeaderId = settlementHeader.Id;
                if (Guid.TryParse(advanceDetail[2],out id))
                {
                    if(id!=Guid.Empty)
                        objSettlementDetail.InvoiceId = id;
                }                 
                   objSettlementDetail.InvoiceAmount =decimal.Parse( advanceDetail[3]);
                   objSettlementDetail.SettledAmount =decimal.Parse( advanceDetail[4]);
                   objSettlementDetail.RemainingAmount = decimal.Parse( advanceDetail[5]);
                    if (Guid.TryParse(advanceDetail[6], out id))
                    {
                        if (id != Guid.Empty)
                        objSettlementDetail.CreditId = id;        
                    }
                             
                 objSettlementDetail.Remark = advanceDetail[7];
                 objSettlementDetail.UpdatedAt=DateTime.Now;
                if (advanceDetailId == Guid.Empty)
                {
                    objSettlementDetail.Id = Guid.NewGuid();
                    objSettlementDetail.CreatedAt = DateTime.Now;
                    _settlementDetail.AddNew(objSettlementDetail);
                }              
                advanceDetailList.Add(objSettlementDetail);
               
            }
            DeleteSettlementDetail(advanceDetailList, oldsSettlementDetailList, settlementHeader);

        }
        private void DeleteSettlementDetail(IList<slmsSettlementDetail> advanceDetailList, IList<slmsSettlementDetail> oldsSettlementDetailList,slmsSettlementHeader settlement)
        {
            foreach (var objoldsSettlementDetail in oldsSettlementDetailList)
            {
                var record = advanceDetailList.Where(o => o.Id == objoldsSettlementDetail.Id);

                if (record.Count() == 0)
                {
                     _settlementDetail.Delete(o => o.Id == objoldsSettlementDetail.Id);
                }
            }
        }
        public void ExportToExcel()
        {
            var searchText = Request.QueryString["st"];
            DateTime date = new DateTime();
            bool isDatestring = DateTime.TryParse(searchText, out date);

            var records = _settlementHeader.GetAll().AsQueryable().Where(o=>o.IsDeleted==false);

            records = searchText != "" ? records.Where(p =>
                p.ReferenceNo.ToUpper().Contains(searchText.ToUpper()) ||
                

                (isDatestring ? p.Date >= date : false)

                ) : records; var customers = records.Select(record => new
            {
                record.Id,
                record.ReferenceNo,
                Date = record.Date,
                record.CollectedFrom,
                 record.Amount,
                record.Remark,
            }).ToList().Select(record => new
            {
                record.Id,
                record.ReferenceNo,
                Date = record.Date.ToShortDateString(),
                record.CollectedFrom,
                record.Amount,
                record.Remark
            
            }).ToList();

            var exportToExcelHelper = new ExportToExcelHelper();
            exportToExcelHelper.ToExcel(Response, customers);
        }
     
     
        #endregion

          #endregion
    }
}