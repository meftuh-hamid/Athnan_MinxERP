using CyberErp.Data.Model;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;


namespace CyberErp.Business.Component.Psms
{
    public class ItemSerialTransaction : BaseModel<psmsItemSerialTransaction>
    {

        private readonly DbContext _dbContext;
        private readonly BaseModel<psmsItemSerial> _itemSerial;
        private readonly BaseModel<psmsCustodian_> _custodian;
        private readonly BaseModel<psmsRequestOrderHeader> _requestOrderHeader;
        private readonly BaseModel<psmsStoreRequisitionHeader> _storeRequisitionHeader;

     
        public ItemSerialTransaction(DbContext dbContext)
            : base(dbContext)
        {
            _dbContext = dbContext;
            _itemSerial = new BaseModel<psmsItemSerial>(dbContext);
            _custodian = new BaseModel<psmsCustodian_>(_dbContext);
            _requestOrderHeader = new BaseModel<psmsRequestOrderHeader>(_dbContext);
            _storeRequisitionHeader = new BaseModel<psmsStoreRequisitionHeader>(_dbContext);
        }
        public void AddItemSerialTransactions(Guid headerId,Guid? requestOrderHeaderId,DateTime date, Guid voucherTypeId, string voucherNo, string itemSerialsString, string action, bool isIssue,bool isReturn,bool status)
        {
            itemSerialsString = itemSerialsString.Remove(itemSerialsString.Length - 1);
            IList<string> itemSerialTransactions = itemSerialsString.Split(new[] { ';' }).ToList();
            IList<psmsItemSerialTransaction> ItemSerialTransactionList = new List<psmsItemSerialTransaction>();
           
            var oldsItemSerialTransactionList = this.GetAll().AsQueryable().Where(o => o.VoucherId == headerId && o.VoucherTypeId==voucherTypeId);
          
            for (var i = 0; i < itemSerialTransactions.Count(); i++)
            {
                var itemSerialTransaction = itemSerialTransactions[i].Split(new[] { ':' });
                var itemSerialTransactionId = Guid.Empty;
                Guid.TryParse(itemSerialTransaction[0].ToString(), out itemSerialTransactionId);
                var objItemSerialTransaction = itemSerialTransactionId != Guid.Empty ? this.Get(o => o.Id == itemSerialTransactionId) : new psmsItemSerialTransaction();

                objItemSerialTransaction.VoucherId = headerId;
                objItemSerialTransaction.VoucherTypeId = voucherTypeId;
                objItemSerialTransaction.VoucherNumber = voucherNo;
                objItemSerialTransaction.ItemSerialId = Guid.Parse(itemSerialTransaction[3]);
               
                objItemSerialTransaction.UpdatedAt = DateTime.Now;
                if (itemSerialTransactionId == Guid.Empty)
                {
                    objItemSerialTransaction.Id = Guid.NewGuid();
                    objItemSerialTransaction.CreatedAt = DateTime.Now;
                    this.AddNew(objItemSerialTransaction);
                }
                if (action == "issue" || action == "receive")
                {
                    UpdateItemSerial(objItemSerialTransaction.ItemSerialId, status,null);

                }
                else if (action == "approveDisposal")
                {
                    UpdateItemSerial(objItemSerialTransaction.ItemSerialId, status, true);

                }
                ItemSerialTransactionList.Add(objItemSerialTransaction);
             
                if (action == "issue" && isIssue)
                    AddCustodian(headerId, requestOrderHeaderId,date, objItemSerialTransaction.ItemSerialId, voucherTypeId, voucherNo);
                if (action == "receive" && isReturn)
                    RemoveCustodian(objItemSerialTransaction.ItemSerialId,requestOrderHeaderId, status);
                
           
            }
            DeleteItemSerialTransaction(ItemSerialTransactionList, oldsItemSerialTransactionList);
          
        }
        public void AddItemSerialTransactionsByConsumer(Guid headerId, Guid? requestOrderHeaderId, Guid? fromConsumerTypeId, Guid? fromConsumerEmployeeId, Guid? fromConsumerUnitId, Guid? fromConsumerStoreId, Guid? consumerTypeId, Guid? consumerEmployeeId, Guid? consumerUnitId, Guid? consumerStoreId, DateTime date, Guid voucherTypeId, string voucherNo, string itemSerialsString, string action, bool isIssue, bool isReturn, bool status)
        {
            itemSerialsString = itemSerialsString.Remove(itemSerialsString.Length - 1);
            IList<string> itemSerialTransactions = itemSerialsString.Split(new[] { ';' }).ToList();
            IList<psmsItemSerialTransaction> ItemSerialTransactionList = new List<psmsItemSerialTransaction>();

            var oldsItemSerialTransactionList = this.GetAll().AsQueryable().Where(o => o.VoucherId == headerId && o.VoucherTypeId == voucherTypeId);

            for (var i = 0; i < itemSerialTransactions.Count(); i++)
            {
                var itemSerialTransaction = itemSerialTransactions[i].Split(new[] { ':' });
                var itemSerialTransactionId = Guid.Empty;
                Guid.TryParse(itemSerialTransaction[0].ToString(), out itemSerialTransactionId);
                var objItemSerialTransaction = itemSerialTransactionId != Guid.Empty ? this.Get(o => o.Id == itemSerialTransactionId) : new psmsItemSerialTransaction();

                objItemSerialTransaction.VoucherId = headerId;
                objItemSerialTransaction.VoucherTypeId = voucherTypeId;
                objItemSerialTransaction.VoucherNumber = voucherNo;
                objItemSerialTransaction.ItemSerialId = Guid.Parse(itemSerialTransaction[3]);

                objItemSerialTransaction.UpdatedAt = DateTime.Now;
                if (itemSerialTransactionId == Guid.Empty)
                {
                    objItemSerialTransaction.Id = Guid.NewGuid();
                    objItemSerialTransaction.CreatedAt = DateTime.Now;
                    this.AddNew(objItemSerialTransaction);
                }
               
                ItemSerialTransactionList.Add(objItemSerialTransaction);

                if (action == "receive" || action=="issue")
                {
                    if (requestOrderHeaderId != Guid.Empty)
                    {
                        RemoveCustodian(objItemSerialTransaction.ItemSerialId, requestOrderHeaderId, status);
                    }
                    else
                    {
                        RemoveCustodianByConsumerType(objItemSerialTransaction.ItemSerialId, fromConsumerEmployeeId, fromConsumerStoreId, fromConsumerUnitId, status);
                    }
                    AddCustodianByConsumer(headerId, consumerTypeId.Value, consumerEmployeeId, consumerUnitId, date, objItemSerialTransaction.ItemSerialId, voucherTypeId, voucherNo);
                }
            }
            DeleteItemSerialTransaction(ItemSerialTransactionList, oldsItemSerialTransactionList);

        }
        public void AddItemSerialTransaction(Guid headerId, Guid voucherTypeId, string voucherNo, Guid itemSerialId)
        {
           
                  var itemSerialTransaction =this.Get(o=>o.VoucherId==headerId && o.VoucherTypeId==voucherTypeId && o.ItemSerialId==itemSerialId);
                  var objItemSerialTransaction = itemSerialTransaction != null ? itemSerialTransaction : new psmsItemSerialTransaction();

                objItemSerialTransaction.VoucherId = headerId;
                objItemSerialTransaction.VoucherTypeId = voucherTypeId;
                objItemSerialTransaction.VoucherNumber = voucherNo;
                objItemSerialTransaction.ItemSerialId = itemSerialId;
                objItemSerialTransaction.UpdatedAt = DateTime.Now;
                if (itemSerialTransaction == null)
                {
                    objItemSerialTransaction.Id = Guid.NewGuid();
                    objItemSerialTransaction.CreatedAt = DateTime.Now;
                    this.AddNew(objItemSerialTransaction);
                }                          
        }  
        private void DeleteItemSerialTransaction(IList<psmsItemSerialTransaction> ItemSerialTransactionList, IQueryable<psmsItemSerialTransaction> oldsItemSerialTransactionList)
        {
            foreach (var objoldsItemSerialTransaction in oldsItemSerialTransactionList)
            {
                var record = ItemSerialTransactionList.Where(o => o.Id == objoldsItemSerialTransaction.Id);

                if (record.Count() == 0)
                {
                     this.Delete(o => o.Id == objoldsItemSerialTransaction.Id);
                     DeleteCustodian(objoldsItemSerialTransaction.VoucherId.Value, objoldsItemSerialTransaction.ItemSerialId);
                }
            }
        }
       public void DeleteItemSerialTransaction(Guid headerId, Guid voucherTypeId,Guid itemSerialId)
       {
           this.Delete(o=>o.VoucherId==headerId && o.VoucherTypeId==voucherTypeId && o.ItemSerialId==itemSerialId);

       }
       public void DeleteItemSerialTransaction(Guid headerId, Guid voucherTypeId)
       {
           this.Delete(o => o.VoucherId == headerId && o.VoucherTypeId == voucherTypeId);

       }
      
        public List<object> GetItemSerialTransactionList(Guid headerId, Guid voucherTypeId)
        {
            
            var itemSerialTransactionList = this.GetAll().AsQueryable().Where(o => o.VoucherId == headerId && o.VoucherTypeId == voucherTypeId);
            var records = itemSerialTransactionList.Select(item => new
            {
                Id = item.Id,
                item.psmsItemSerial.ItemId,
                ItemName=item.psmsItemSerial.psmsItem.Name,
                item.psmsItemSerial.StoreId,
                item.ItemSerialId,
                item.psmsItemSerial.IsAvailable,
                item.psmsItemSerial.Number,
                item.psmsItemSerial.Description,
                item.psmsItemSerial.PlateNo,
                item.psmsItemSerial.IsDisposed,
                item.psmsItemSerial.SN,
                item.psmsItemSerial.Remark
            }).ToList().Cast<object>().ToList();
            return records;
           
        }
        public List<object> GetItemSerialList(Guid headerId, Guid voucherTypeId)
        {

            var itemSerialTransactionList = this.GetAll().AsQueryable().Where(o => o.VoucherId == headerId && o.VoucherTypeId == voucherTypeId);
            var records = itemSerialTransactionList.Select(item => new
            {
                Id = item.ItemSerialId,
                item.psmsItemSerial.ItemId,
                ItemName = item.psmsItemSerial.psmsItem.Name,
                item.psmsItemSerial.StoreId,
                item.ItemSerialId,
                item.psmsItemSerial.IsAvailable,
                item.psmsItemSerial.Number,
                item.psmsItemSerial.Description,
                item.psmsItemSerial.PlateNo,
               item.psmsItemSerial.IsDisposed,
                item.psmsItemSerial.Remark
            }).ToList().Cast<object>().ToList();
            return records;

        }
      
        private void UpdateItemSerial(Guid itemSerialId,bool status,bool? isDisposed){
           
            var objItemSerial = _itemSerial.Get(o => o.Id == itemSerialId);
            objItemSerial.IsAvailable = status;
            if (isDisposed.HasValue)
                objItemSerial.IsDisposed = isDisposed.Value;
        }
        public void VoidItemSerialTransaction(Guid headerId, Guid voucherTypeId, Guid? issueHeaderId, bool status)
        {
            var itemSerialTransactionList = this.GetAll().Where(o => o.VoucherId == headerId && o.VoucherTypeId == voucherTypeId);
            foreach (var itemSerialTransaction in itemSerialTransactionList)
            {
               
                UpdateItemSerial(itemSerialTransaction.ItemSerialId, status,null);
                RemoveCustodian(itemSerialTransaction.ItemSerialId, issueHeaderId, status);
     
            }    
        }
        public void VoidItemSerialTransactionDisposal(Guid headerId, Guid voucherTypeId, Guid? issueHeaderId, bool status)
        {
            var itemSerialTransactionList = this.GetAll().Where(o => o.VoucherId == headerId && o.VoucherTypeId == voucherTypeId);
            foreach (var itemSerialTransaction in itemSerialTransactionList)
            {

                UpdateItemSerial(itemSerialTransaction.ItemSerialId, status, false);
            }
        }
        public void VoidItemSerialTransactionByConsumer(Guid headerId, Guid? fromConsumerEmployeeId, Guid? fromConsumerStoreId, Guid? fromConsumerUnitId, Guid? consumerEmployeeId, Guid? consumerStoreId, Guid? consumerUnitId, Guid voucherTypeId, Guid? issueHeaderId, bool status)
        {
            var itemSerialTransactionList = this.GetAll().Where(o => o.VoucherId == headerId && o.VoucherTypeId == voucherTypeId);
            foreach (var itemSerialTransaction in itemSerialTransactionList)
            {
                if (issueHeaderId != Guid.Empty)
                {
                    RemoveCustodian(itemSerialTransaction.ItemSerialId, issueHeaderId, status);
                }
                else
                {
                    RemoveCustodianByConsumerType(itemSerialTransaction.ItemSerialId, fromConsumerEmployeeId, fromConsumerStoreId, fromConsumerUnitId, !status);
                }
                RemoveCustodianByConsumerType(itemSerialTransaction.ItemSerialId, consumerEmployeeId, consumerStoreId, consumerUnitId, status);
           

            }
        }
        public void AddCustodian(Guid headerId, Guid? requestOrderHeaderId, DateTime date, Guid itemSerialId, Guid voucherTypeId, string voucherNo)
        {
            var objRequestOrder = _requestOrderHeader.Get(o => o.Id == requestOrderHeaderId.Value);
            var objCustodian = new psmsCustodian_();
            objCustodian.Id = Guid.NewGuid();
                 
            objCustodian.ConsumerTypeId =objRequestOrder.StoreRequisitionHeaderId.HasValue ? objRequestOrder.psmsStoreRequisitionHeader.ConsumerTypeId : Guid.Empty;
            objCustodian.ConsumerEmployeeId = objRequestOrder.StoreRequisitionHeaderId.HasValue ? objRequestOrder.psmsStoreRequisitionHeader.ConsumerEmployeeId : Guid.Empty;
            objCustodian.ConsumerUnitId = objRequestOrder.StoreRequisitionHeaderId.HasValue ? objRequestOrder.psmsStoreRequisitionHeader.ConsumerUnitId : Guid.Empty;
        
            objCustodian.VoucherTypeId = voucherTypeId;
            objCustodian.VoucherNumber = voucherNo;
            objCustodian.VoucherHeaderId = headerId;
            objCustodian.Date = date;
            objCustodian.ItemSerialId = itemSerialId;
            objCustodian.IsReturned = false;
            _custodian.AddNew(objCustodian);                       
        }
        public void AddCustodianByConsumer(Guid headerId, Guid consumerTypeId, Guid? consumerEmployeeId, Guid? consumerUnitId, DateTime date, Guid itemSerialId, Guid voucherTypeId, string voucherNo)
        {
            var objCustodian = new psmsCustodian_();
            objCustodian.Id = Guid.NewGuid();

            objCustodian.ConsumerTypeId = consumerTypeId;
            objCustodian.ConsumerEmployeeId = consumerEmployeeId;
            objCustodian.ConsumerUnitId = consumerUnitId;

            objCustodian.VoucherTypeId = voucherTypeId;
            objCustodian.VoucherNumber = voucherNo;
            objCustodian.VoucherHeaderId = headerId;
            objCustodian.Date = date;
            objCustodian.ItemSerialId = itemSerialId;
            objCustodian.IsReturned = false;
            _custodian.AddNew(objCustodian);
        }
        public void RemoveCustodian(Guid itemSerialId,Guid? storeRequisitionId,bool isReturned)
        {
            var objStoreRequisition = _storeRequisitionHeader.Get(o => o.Id == storeRequisitionId.Value);
                var customerId = objStoreRequisition.ConsumerEmployeeId.HasValue ? objStoreRequisition.ConsumerEmployeeId.Value : objStoreRequisition.ConsumerStoreId.HasValue ? objStoreRequisition.ConsumerStoreId.Value : objStoreRequisition.ConsumerUnitId.HasValue ? objStoreRequisition.ConsumerUnitId.Value : Guid.Empty;
           
                var objCustodian = _custodian.GetAll().AsQueryable().Where(o => o.IsReturned != isReturned && o.ItemSerialId == itemSerialId && (objStoreRequisition.ConsumerEmployeeId.HasValue ? o.ConsumerEmployeeId == objStoreRequisition.ConsumerEmployeeId.Value : objStoreRequisition.ConsumerStoreId.HasValue ? o.ConsumerStoreId == objStoreRequisition.ConsumerStoreId.Value : objStoreRequisition.ConsumerUnitId.HasValue ? o.ConsumerUnitId == objStoreRequisition.ConsumerUnitId.Value : false)).OrderBy(o=>o.CreatedAt).LastOrDefault();
            if (objCustodian != null)
              objCustodian.IsReturned = isReturned;
       }
        public void RemoveCustodianByConsumerType(Guid itemSerialId, Guid? consumerEmployeeId, Guid? consumerStoreId,Guid? consumerUnitId, bool isReturned)
        {

            var objCustodian = _custodian.GetAll().AsQueryable().Where(o => o.IsReturned != isReturned && o.ItemSerialId == itemSerialId && (consumerEmployeeId.HasValue ? o.ConsumerEmployeeId == consumerEmployeeId.Value : consumerStoreId.HasValue ? o.ConsumerStoreId == consumerStoreId.Value : consumerUnitId.HasValue ? o.ConsumerUnitId == consumerUnitId.Value : false)).OrderBy(o => o.CreatedAt).LastOrDefault();
            if (objCustodian != null)
                objCustodian.IsReturned = isReturned;    
        }
        private void DeleteCustodian(Guid? headerId,Guid itemSerialId)
        {
            _custodian.Delete(o =>o.VoucherHeaderId==headerId && o.ItemSerialId == itemSerialId);           
        }
        
    }
}
