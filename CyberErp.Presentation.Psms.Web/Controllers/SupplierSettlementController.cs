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
    public class SupplierSettlementController : DirectController
    {
        #region Members 

        private readonly DbContext _context;
        private readonly BaseModel<psmsSupplierSettlementHeader> _supplierSettlementHeader;
        private readonly BaseModel<psmsSupplierSettlementDetail> _supplierSettlementDetail;
         private readonly BaseModel<psmsPurchaseOrderHeader> _purchaseOrderHeader;
        private readonly BaseModel<psmsSupplier> _supplier;
        Guid issuedVoucherStatus = Guid.Parse(Constants.Voucher_Status_Issued);
   
        #endregion

        #region Constractor 
        public SupplierSettlementController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _supplierSettlementHeader = new BaseModel<psmsSupplierSettlementHeader>(_context);
            _supplierSettlementDetail = new BaseModel<psmsSupplierSettlementDetail>(_context);
            _purchaseOrderHeader = new BaseModel<psmsPurchaseOrderHeader>(_context);
            _supplier = new BaseModel<psmsSupplier>(_context);
          }

        #endregion

        #region Actions 
      
        #region SupplierSettlement
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
            var obj = _supplierSettlementHeader.Get(c => c.Id == id);

            var supplierSettlement = new
            {
              

                obj.Id,
                obj.ReferenceNo,
                Date=obj.Date.ToShortDateString(),
                obj.CollectedFrom,
                obj.Amount,
                obj.SupplierId,
                obj.Remark,
               };
            return this.Direct(new
            {
                success = true,
                data = supplierSettlement
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
            var records = _supplierSettlementHeader.GetAll().AsQueryable();

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
            var supplierSettlements = records.Select(record => new
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
            var result = new { total = count, data = supplierSettlements };
            return this.Direct(result);
        }
        public ActionResult GetAllDetail(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            Guid supplierSettlementId = Guid.Empty;
            if (hashtable["supplierSettlementId"] != null)
                Guid.TryParse(hashtable["supplierSettlementId"].ToString(), out supplierSettlementId);
           
            var records = _supplierSettlementDetail.GetAll().AsQueryable().Where(o => o.SupplierSettlementHeaderId == supplierSettlementId);
            var count = records.Count();
            var detailRecords = records.ToList().Select(record => new
            {
                record.Id,
                record.SupplierSettlementHeaderId,
                record.InvoiceId,
                Invoice = record.InvoiceId.HasValue ? record.psmsPurchaseOrderHeader.VoucherNumber : record.psmsSupplierCredit.InvoiceReference,
                NetPay = record.InvoiceId.HasValue ? 0 : record.psmsSupplierCredit.RemainingAmount,
                record.CreditId,
                record.SettledAmount,
                SupplierSettlementAmount = record.InvoiceId.HasValue ? record.psmsPurchaseOrderHeader.psmsSupplierSettlementDetail : record.psmsSupplierCredit.psmsSupplierSettlementDetail,
                record.Remark,
            }).Select(record => new
            {
                record.Id,
                record.SupplierSettlementHeaderId,
                record.InvoiceId,
                Invoice = record.Invoice,
                InvoiceAmount= record.NetPay,
                record.SettledAmount,
                RemainingAmount = record.NetPay - record.SupplierSettlementAmount.Where(a=>a.Id!=record.Id).Select(a=>a.SettledAmount).DefaultIfEmpty(0).Sum(),
                record.Remark,
            }).ToList();
            var result = new { total = count, data = detailRecords };
            return this.Direct(result);
        }
       
        [FormHandler]
        public ActionResult Save(psmsSupplierSettlementHeader supplierSettlement)
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
                    var voucherDetailsString = hashtable["supplierSettlementDetails"].ToString();
                    var voucherDetails = voucherDetailsString.Remove(voucherDetailsString.Length - 1).Split(new[] { ';' });
                    string action = hashtable["action"].ToString();
                    if (supplierSettlement.Id.Equals(Guid.Empty))
                    {
                       
                        supplierSettlement.Id = Guid.NewGuid();
                        supplierSettlement.CreatedAt = DateTime.Now;
                        supplierSettlement.UpdatedAt = DateTime.Now;
                           _supplierSettlementHeader.AddNew(supplierSettlement);
                        
                    }
                    else
                    {
                        supplierSettlement.UpdatedAt = DateTime.Now;
                        _supplierSettlementHeader.Edit(supplierSettlement);
                    }

                    SaveSupplierSettlementDetails(supplierSettlement, voucherDetails.ToList(), action);

                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Direct(new {success = true, data = "SupplierSettlement Request has been saved Successfully!"});
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
                 _supplierSettlementDetail.Delete(c => c.SupplierSettlementHeaderId == id);
                _supplierSettlementHeader.Delete(c => c.Id == id);
                _context.SaveChanges();
                return this.Direct(new { success = true, data = "Record has been successfully deleted!" });
            }
            catch (Exception)
            {
                return this.Direct(new { success = false, data = "Could not delete the selected record!" });
            }
        } 
        public void SaveSupplierSettlementDetails(psmsSupplierSettlementHeader supplierSettlementHeader, IList<string> supplierSettlementDetails, string action)
        {
            IList<psmsSupplierSettlementDetail> advanceDetailList = new List<psmsSupplierSettlementDetail>();
            var oldsSupplierSettlementDetailList = _supplierSettlementDetail.GetAll().AsQueryable().Where(o => o.SupplierSettlementHeaderId == supplierSettlementHeader.Id).ToList();
            Guid id = Guid.Empty;
            for (var i = 0; i < supplierSettlementDetails.Count(); i++)
            {
                var advanceDetail = supplierSettlementDetails[i].Split(new[] { ':' });
                Guid advanceDetailId = Guid.Empty;
                Guid.TryParse(advanceDetail[0].ToString(), out advanceDetailId);
                var objSupplierSettlementDetail = advanceDetailId != Guid.Empty ? oldsSupplierSettlementDetailList.Where(o => o.Id == advanceDetailId).FirstOrDefault() : new psmsSupplierSettlementDetail();

                objSupplierSettlementDetail.SupplierSettlementHeaderId = supplierSettlementHeader.Id;
                if (Guid.TryParse(advanceDetail[2],out id))
                {
                    if(id!=Guid.Empty)
                        objSupplierSettlementDetail.InvoiceId = id;
                }                 
                   objSupplierSettlementDetail.InvoiceAmount =decimal.Parse( advanceDetail[3]);
                   objSupplierSettlementDetail.SettledAmount =decimal.Parse( advanceDetail[4]);
                   objSupplierSettlementDetail.RemainingAmount = decimal.Parse( advanceDetail[5]);
                    if (Guid.TryParse(advanceDetail[6], out id))
                    {
                        if (id != Guid.Empty)
                        objSupplierSettlementDetail.CreditId = id;        
                    }
                             
                 objSupplierSettlementDetail.Remark = advanceDetail[7];
                 objSupplierSettlementDetail.UpdatedAt=DateTime.Now;
                if (advanceDetailId == Guid.Empty)
                {
                    objSupplierSettlementDetail.Id = Guid.NewGuid();
                    objSupplierSettlementDetail.CreatedAt = DateTime.Now;
                    _supplierSettlementDetail.AddNew(objSupplierSettlementDetail);
                }              
                advanceDetailList.Add(objSupplierSettlementDetail);
               
            }
            DeleteSupplierSettlementDetail(advanceDetailList, oldsSupplierSettlementDetailList, supplierSettlementHeader);

        }
        private void DeleteSupplierSettlementDetail(IList<psmsSupplierSettlementDetail> advanceDetailList, IList<psmsSupplierSettlementDetail> oldsSupplierSettlementDetailList,psmsSupplierSettlementHeader supplierSettlement)
        {
            foreach (var objoldsSupplierSettlementDetail in oldsSupplierSettlementDetailList)
            {
                var record = advanceDetailList.Where(o => o.Id == objoldsSupplierSettlementDetail.Id);

                if (record.Count() == 0)
                {
                     _supplierSettlementDetail.Delete(o => o.Id == objoldsSupplierSettlementDetail.Id);
                }
            }
        }
        public void ExportToExcel()
        {
            var searchText = Request.QueryString["st"];
            DateTime date = new DateTime();
            bool isDatestring = DateTime.TryParse(searchText, out date);

            var records = _supplierSettlementHeader.GetAll().AsQueryable().Where(o=>o.IsDeleted==false);

            records = searchText != "" ? records.Where(p =>
                p.ReferenceNo.ToUpper().Contains(searchText.ToUpper()) ||
                

                (isDatestring ? p.Date >= date : false)

                ) : records; var suppliers = records.Select(record => new
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
            exportToExcelHelper.ToExcel(Response, suppliers);
        }
     
     
        #endregion

          #endregion
    }
}