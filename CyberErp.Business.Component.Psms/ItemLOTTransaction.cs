using CyberErp.Data.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;

namespace CyberErp.Business.Component.Psms
{
    public class ItemLOTTransaction : BaseModel<psmsItemLOTTransaction>
    {
        private readonly DbContext _dbContext;
        private readonly BaseModel<psmsItemLOT> _itemLOT;
   
        public ItemLOTTransaction(DbContext dbContext)
            : base(dbContext)
        {
              _dbContext = dbContext;
              _itemLOT = new BaseModel<psmsItemLOT>(_dbContext);
        }
        public void AddItemLOTsTransaction(Guid headerId, Guid voucherTypeId, string voucherNo, string itemLOTsString, string action)
        {
            itemLOTsString = itemLOTsString.Remove(itemLOTsString.Length - 1);
            IList<string> itemLOTTransactions = itemLOTsString.Split(new[] { ';' }).ToList();
            IList<psmsItemLOTTransaction> ItemLOTTransactionList = new List<psmsItemLOTTransaction>();

            var oldsItemLOTTransactionList = this.GetAll().AsQueryable().Where(o => o.VoucherId == headerId && o.VoucherTypeId == voucherTypeId);

            for (var i = 0; i < itemLOTTransactions.Count(); i++)
            {
                var itemLOTTransaction = itemLOTTransactions[i].Split(new[] { ':' });
                var itemLOTTransactionId = Guid.Empty;
                Guid.TryParse(itemLOTTransaction[0].ToString(), out itemLOTTransactionId);
                var objItemLOTTransaction = itemLOTTransactionId != Guid.Empty? this.Get(o => o.Id == itemLOTTransactionId) : new psmsItemLOTTransaction();
                  objItemLOTTransaction.VoucherId = headerId;
                objItemLOTTransaction.VoucherTypeId = voucherTypeId;
                objItemLOTTransaction.VoucherNumber = voucherNo;
                objItemLOTTransaction.ItemLOTId = Guid.Parse(itemLOTTransaction[3]);
                objItemLOTTransaction.Quantity = decimal.Parse(itemLOTTransaction[4]);
                objItemLOTTransaction.UpdatedAt = DateTime.Now;
                if (itemLOTTransactionId == Guid.Empty)
                {
                    objItemLOTTransaction.Id = Guid.NewGuid();
            
                    objItemLOTTransaction.CreatedAt = DateTime.Now;
                    this.AddNew(objItemLOTTransaction);
                }
                if (action=="issue")
                    UpdateItemLOT(objItemLOTTransaction.ItemLOTId, objItemLOTTransaction.Quantity);
                if (action == "receive")
                    UpdateItemLOT(objItemLOTTransaction.ItemLOTId, -objItemLOTTransaction.Quantity);
           
                ItemLOTTransactionList.Add(objItemLOTTransaction);
            }
            DeleteItemLOTTransaction(ItemLOTTransactionList, oldsItemLOTTransactionList);

        }
        public void AddItemLOTsTransaction(Guid headerId, Guid voucherTypeId, string voucherNo, Guid itemLOTId, decimal quantity)
        {

            var itemLOTTransaction = this.Get(o => o.VoucherId == headerId && o.VoucherTypeId == voucherTypeId && o.ItemLOTId == itemLOTId);
            var objItemLOTTransaction = itemLOTTransaction != null ? itemLOTTransaction : new psmsItemLOTTransaction();

            objItemLOTTransaction.VoucherId = headerId;
            objItemLOTTransaction.VoucherTypeId = voucherTypeId;
            objItemLOTTransaction.VoucherNumber = voucherNo;
            objItemLOTTransaction.ItemLOTId = itemLOTId;
            objItemLOTTransaction.Quantity = quantity;
            objItemLOTTransaction.UpdatedAt = DateTime.Now;
            if (itemLOTTransaction == null)
            {
                objItemLOTTransaction.Id = Guid.NewGuid();
                objItemLOTTransaction.CreatedAt = DateTime.Now;
                this.AddNew(objItemLOTTransaction);
            }
        }
        private void DeleteItemLOTTransaction(IList<psmsItemLOTTransaction> ItemLOTTransactionList, IQueryable<psmsItemLOTTransaction> oldsItemLOTTransactionList)
        {
            foreach (var objoldsItemLOTTransaction in oldsItemLOTTransactionList)
            {
                var record = ItemLOTTransactionList.Where(o => o.Id == objoldsItemLOTTransaction.Id);

                if (record.Count() == 0)
                {
                    this.Delete(o => o.Id == objoldsItemLOTTransaction.Id);
                }
            }
        }
        public void DeleteItemLOTTransaction(Guid headerId, Guid voucherTypeId, Guid itemLOTId)
        {
            this.Delete(o => o.VoucherId == headerId && o.VoucherTypeId == voucherTypeId && o.ItemLOTId == itemLOTId);

        }
        public void DeleteItemLOTTransaction(Guid headerId, Guid voucherTypeId)
        {
            this.Delete(o => o.VoucherId == headerId && o.VoucherTypeId == voucherTypeId);

        }
        public List<object> GetItemLOTList(Guid headerId, Guid voucherTypeId)
        {

            var itemLOTTransactionList = this.GetAll().AsQueryable().Where(o => o.VoucherId == headerId && o.VoucherTypeId == voucherTypeId).OrderBy(o => o.Id);
            var records = itemLOTTransactionList.Select(item => new
            {
                Id = item.Id,
                item.psmsItemLOT.ItemId,
                ItemName = item.psmsItemLOT.psmsItem.Name,
                item.psmsItemLOT.ManufacturedDate,
                item.psmsItemLOT.ExpiredDate,
                item.psmsItemLOT.Manufacturer,
                item.psmsItemLOT.StoreId,
                item.ItemLOTId,
                item.Quantity,
                AvailableQuantity = item.psmsItemLOT.Quantity,
                item.psmsItemLOT.Number
            }).ToList().Select(item => new
            {
                item.Id,
                item.ItemId,
                item.ItemName,
                ManufacturedDate = item.ManufacturedDate.HasValue ? item.ManufacturedDate.Value.ToShortDateString() : "",
                ExpiredDate = item.ExpiredDate.HasValue ? item.ExpiredDate.Value.ToShortDateString() : "",
                item.Manufacturer,
                item.StoreId,
                item.ItemLOTId,
                item.Quantity,
                AvailableQuantity = item.AvailableQuantity,
                item.Number
            }).ToList().Cast<object>().ToList();
            return records;

        }
        private void UpdateItemLOT(Guid itemLOTId, decimal quantity)
        {
            var objItemSerial = _itemLOT.Get(o => o.Id == itemLOTId);
            objItemSerial.Quantity = objItemSerial.Quantity - quantity;
        }
        public void VoidItemLOTTransaction(Guid headerId, Guid voucherTypeId)
        {
            var itemLOTTransactionList = this.GetAll().Where(o => o.VoucherId == headerId && o.VoucherTypeId == voucherTypeId);
            foreach (var itemLOTTransaction in itemLOTTransactionList)
            {
                UpdateItemLOT(itemLOTTransaction.ItemLOTId, -itemLOTTransaction.Quantity);
            }
        }
        public void VoidItemLOTTransaction(Guid headerId, Guid voucherTypeId,string action)
        {
            var itemLOTTransactionList = this.GetAll().Where(o => o.VoucherId == headerId && o.VoucherTypeId == voucherTypeId);
            foreach (var itemLOTTransaction in itemLOTTransactionList)
            {
                UpdateItemLOT(itemLOTTransaction.ItemLOTId, action == "receive" ? -itemLOTTransaction.Quantity : itemLOTTransaction.Quantity);
            }
        }
    }
}
