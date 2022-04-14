using CyberErp.Data.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;

namespace CyberErp.Business.Component.Psms
{
    public class InventoryRecord : BaseModel<psmsInventoryRecord>
    {
        private readonly DbContext _dbContext;
        private readonly BaseModel<psmsBinCard> _bincard;
        private readonly BaseModel<psmsItem> _item;
        private readonly BaseModel<psmsItemUnit> _itemUnit;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
     
        public InventoryRecord(DbContext dbContext)
            : base(dbContext)
        {
            _dbContext = dbContext;
            _bincard = new BaseModel<psmsBinCard>(dbContext);
            _item = new BaseModel<psmsItem>(dbContext);
            _itemUnit = new BaseModel<psmsItemUnit>(_dbContext);
            _fiscalYear = new BaseModel<coreFiscalYear>(_dbContext);
      
        }

        public decimal IssueInventoryUpdate(ParameterModel model)
        {
            decimal unitCost = 0;
            var localModel = model.Clone();

            var objInventory = this.GetAll().AsQueryable().Where(o => o.IsClosed == false && o.FiscalYearId == model.FiscalYearId && o.ItemId == model.ItemId && o.StoreId == model.StoreId).FirstOrDefault();
            if (objInventory == null)
                throw new System.InvalidOperationException("There is no inventory record for some of the items!");
            else if (objInventory.AvailableQuantity < model.Quantity)
                throw new System.InvalidOperationException("There is no enough available quantity for some of the items!");
           
            objInventory.RunningQuantity = objInventory.RunningQuantity - model.Quantity;
            var damagedQuantity = objInventory.DamagedQuantity.HasValue ? objInventory.DamagedQuantity.Value : 0;
            var expiredQuantity = objInventory.ExpiredQuantity.HasValue ? objInventory.ExpiredQuantity.Value : 0;
            objInventory.AvailableQuantity = objInventory.RunningQuantity - objInventory.CommittedQuantity - damagedQuantity - expiredQuantity > 0 ? objInventory.RunningQuantity - objInventory.CommittedQuantity.Value - damagedQuantity - expiredQuantity : 0;
            unitCost = objInventory.UnitCost;
            model.UnitCost = unitCost;
            AddBincard(model, Guid.Empty, Guid.Empty, objInventory.RunningQuantity, 0, model.Quantity, unitCost);

            return unitCost;
        }
        public void IssueInventoryUpdateFromVoidedT(ParameterModel model)
        {

            var objInventory = this.GetAll().AsQueryable().Where(o => o.IsClosed == false && o.FiscalYearId == model.FiscalYearId && o.ItemId == model.ItemId && o.StoreId == model.StoreId).FirstOrDefault();
            if (objInventory != null)
            {
                objInventory.RunningQuantity = objInventory.RunningQuantity + model.Quantity;
                var damagedQuantity = objInventory.DamagedQuantity.HasValue ? objInventory.DamagedQuantity.Value : 0;
                var expiredQuantity = objInventory.ExpiredQuantity.HasValue ? objInventory.ExpiredQuantity.Value : 0;
                objInventory.AvailableQuantity = objInventory.RunningQuantity - objInventory.CommittedQuantity - damagedQuantity - expiredQuantity > 0 ? objInventory.RunningQuantity - objInventory.CommittedQuantity.Value - damagedQuantity - expiredQuantity : 0;

                _bincard.Delete(o => o.VoucherTypeId == model.VoucherTypeId && o.FiscalYearId == model.FiscalYearId && o.VoucherId == model.VoucherId);

            }

        }
        public void ReceiveInventoryUpdate(ParameterModel model)
        {

            var objInventory = this.GetAll().AsQueryable().Where(o => o.IsClosed == false && o.FiscalYearId == model.FiscalYearId && o.ItemId == model.ItemId && o.StoreId == model.StoreId).FirstOrDefault();
            var localModel = model.Clone();
            if (objInventory == null) objInventory = AddNewInventory((ParameterModel)localModel);
            var totalReceivedQuantity = model.Quantity + model.DamagedQuantity;
            var invDamagedQuantity = objInventory.DamagedQuantity > 0 ? objInventory.DamagedQuantity.Value : 0;

            decimal totalCost = 0;
            decimal averageCost = 0;
            double totalQuantity = objInventory.RunningQuantity + invDamagedQuantity + totalReceivedQuantity;
            var item = objInventory.psmsItem;
            if (item == null) item = _item.Get(o => o.Id == model.ItemId);
                double localTotalQuntity = objInventory.RunningQuantity + invDamagedQuantity;
            totalCost = (decimal)(localTotalQuntity > 0 ? ((objInventory.RunningQuantity + invDamagedQuantity) * (double)objInventory.UnitCost) + (totalReceivedQuantity * (double)model.UnitCost) : (totalReceivedQuantity * (double)model.UnitCost));
      
            averageCost = (decimal)( localTotalQuntity > 0 ? ((double)totalCost / totalQuantity) : ((double)totalCost / totalReceivedQuantity));
            objInventory.ExpireyDate = model.ExpireyDate;
            objInventory.UnitCost = averageCost;
            objInventory.RunningQuantity = objInventory.RunningQuantity + model.Quantity;
            objInventory.DamagedQuantity = objInventory.DamagedQuantity > 0 ? objInventory.DamagedQuantity + model.DamagedQuantity : model.DamagedQuantity;
            var damagedQuantity = objInventory.DamagedQuantity.HasValue ? objInventory.DamagedQuantity.Value : 0;
            var expiredQuantity = objInventory.ExpiredQuantity.HasValue ? objInventory.ExpiredQuantity.Value : 0;
            objInventory.AvailableQuantity = objInventory.RunningQuantity - objInventory.CommittedQuantity - damagedQuantity - expiredQuantity > 0 ? objInventory.RunningQuantity - objInventory.CommittedQuantity.Value - damagedQuantity - expiredQuantity : 0;
            if (objInventory.RunningQuantity >= objInventory.ReorderLevel)
            {
                objInventory.ReorderdDate = null;
                objInventory.PendingReorderQuantity = 0;
            }

            model.Quantity = model.Quantity;
            AddBincard(model, Guid.Empty, Guid.Empty, objInventory.RunningQuantity, totalReceivedQuantity, 0, averageCost);

        }
        public void ReceiveInventoryUpdateFromVoidedT(ParameterModel model)
        {
            var totalReceivedQuantity = model.Quantity + model.DamagedQuantity;

            var objInventory = this.GetAll().AsQueryable().Where(o => o.IsClosed == false && o.FiscalYearId == model.FiscalYearId && o.ItemId == model.ItemId && o.StoreId == model.StoreId).FirstOrDefault();
            if (objInventory != null)
            {
                objInventory.RunningQuantity = objInventory.RunningQuantity - model.Quantity;
                objInventory.DamagedQuantity = objInventory.DamagedQuantity - model.DamagedQuantity;

                var invDamagedQuantity = objInventory.DamagedQuantity.Value > 0 ? objInventory.DamagedQuantity.Value : 0;

                decimal oldAvrageCost = 0;
                if (objInventory.psmsItem.lupItemType.Name == "Average Cost")
                {
                    if ((objInventory.RunningQuantity + invDamagedQuantity) > 0)
                        oldAvrageCost =(decimal) ((objInventory.RunningQuantity + invDamagedQuantity) > 0 ? ((double)objInventory.UnitCost * (objInventory.RunningQuantity + invDamagedQuantity + totalReceivedQuantity) - ((double)model.UnitCost * totalReceivedQuantity)) / (objInventory.RunningQuantity + invDamagedQuantity) : 0);
                    objInventory.UnitCost = oldAvrageCost;
                }
                var damagedQuantity = objInventory.DamagedQuantity.HasValue ? objInventory.DamagedQuantity.Value : 0;
                var expiredQuantity = objInventory.ExpiredQuantity.HasValue ? objInventory.ExpiredQuantity.Value : 0;
                objInventory.AvailableQuantity = objInventory.RunningQuantity - objInventory.CommittedQuantity - damagedQuantity - expiredQuantity > 0 ? objInventory.RunningQuantity - objInventory.CommittedQuantity.Value - damagedQuantity - expiredQuantity : 0;
                _bincard.Delete(o => o.VoucherTypeId == model.VoucherTypeId && o.FiscalYearId == model.FiscalYearId && o.VoucherId == model.VoucherId);

            }

        }


        public void NoneStockReceiveInventoryUpdate(ParameterModel model)
        {

            var objInventory = this.GetAll().AsQueryable().Where(o => o.IsClosed == false && o.FiscalYearId == model.FiscalYearId && o.ItemId == model.ItemId && o.StoreId == model.StoreId).FirstOrDefault();
            var localModel = model.Clone();
            if (objInventory == null) objInventory = AddNewInventory((ParameterModel)localModel);
            var totalReceivedQuantity = model.Quantity + model.DamagedQuantity;
            var invDamagedQuantity = objInventory.DamagedQuantity > 0 ? objInventory.DamagedQuantity.Value : 0;
            decimal averageCost = 0;
            double totalQuantity = objInventory.RunningQuantity + invDamagedQuantity + totalReceivedQuantity;
            var item = objInventory.psmsItem;
            if (item == null) item = _item.Get(o => o.Id == model.ItemId);
            averageCost = model.UnitCost;
            objInventory.RunningQuantity = objInventory.RunningQuantity + model.Quantity;
            objInventory.DamagedQuantity = objInventory.DamagedQuantity > 0 ? objInventory.DamagedQuantity + model.DamagedQuantity : model.DamagedQuantity;
            var damagedQuantity = objInventory.DamagedQuantity.HasValue ? objInventory.DamagedQuantity.Value : 0;
            var expiredQuantity = objInventory.ExpiredQuantity.HasValue ? objInventory.ExpiredQuantity.Value : 0;
            objInventory.AvailableQuantity = objInventory.RunningQuantity - objInventory.CommittedQuantity - damagedQuantity - expiredQuantity > 0 ? objInventory.RunningQuantity - objInventory.CommittedQuantity.Value - damagedQuantity - expiredQuantity : 0;
            if (objInventory.RunningQuantity >= (double)objInventory.ReorderLevel)
            {
                objInventory.ReorderdDate = null;
                objInventory.PendingReorderQuantity = 0;
            }

            model.Quantity = model.Quantity;
            AddBincard(model, Guid.Empty, Guid.Empty, objInventory.RunningQuantity, totalReceivedQuantity, 0, averageCost);

        }
        public void NoneStockReceiveInventoryUpdateFromVoidedT(ParameterModel model)
        {
            var totalReceivedQuantity = model.Quantity + model.DamagedQuantity;

            var objInventory = this.GetAll().AsQueryable().Where(o => o.IsClosed == false && o.FiscalYearId == model.FiscalYearId && o.ItemId == model.ItemId && o.StoreId == model.StoreId).FirstOrDefault();
            if (objInventory != null)
            {
                objInventory.RunningQuantity = objInventory.RunningQuantity - model.Quantity;
                objInventory.DamagedQuantity = objInventory.DamagedQuantity - model.DamagedQuantity;
                var invDamagedQuantity = objInventory.DamagedQuantity.Value > 0 ? objInventory.DamagedQuantity.Value : 0;
                var damagedQuantity = objInventory.DamagedQuantity.HasValue ? objInventory.DamagedQuantity.Value : 0;
                var expiredQuantity = objInventory.ExpiredQuantity.HasValue ? objInventory.ExpiredQuantity.Value : 0;
                objInventory.AvailableQuantity = objInventory.RunningQuantity - objInventory.CommittedQuantity - damagedQuantity - expiredQuantity > 0 ? objInventory.RunningQuantity - objInventory.CommittedQuantity.Value - damagedQuantity - expiredQuantity : 0;
                _bincard.Delete(o => o.VoucherTypeId == model.VoucherTypeId &&  o.FiscalYearId == model.FiscalYearId && o.VoucherId == model.VoucherId);

            }

        }

        public decimal ReturnInventoryUpdate(ParameterModel model)
        {
            decimal unitCost = 0;
            var quantity = model.Quantity - model.DamagedQuantity;
            var localModel = model.Clone();

            var objInventory = this.GetAll().AsQueryable().Where(o => o.IsClosed == false && o.FiscalYearId == model.FiscalYearId && o.ItemId == model.ItemId && o.StoreId == model.StoreId).FirstOrDefault();

            //if (objInventory == null)
            //    throw new System.InvalidOperationException("There is no inventory record for some of the items!");
            if (objInventory == null) objInventory = AddNewInventory((ParameterModel)localModel);

            objInventory.RunningQuantity = objInventory.RunningQuantity > 0 ? objInventory.RunningQuantity + quantity : quantity;
            objInventory.DamagedQuantity = objInventory.DamagedQuantity > 0 ? objInventory.DamagedQuantity + model.DamagedQuantity : model.DamagedQuantity;

            var damagedQuantity = objInventory.DamagedQuantity.HasValue ? objInventory.DamagedQuantity.Value : 0;
            var expiredQuantity = objInventory.ExpiredQuantity.HasValue ? objInventory.ExpiredQuantity.Value : 0;
            objInventory.AvailableQuantity = objInventory.RunningQuantity - objInventory.CommittedQuantity - damagedQuantity - expiredQuantity > 0 ? objInventory.RunningQuantity - objInventory.CommittedQuantity.Value - damagedQuantity - expiredQuantity : 0;
            unitCost = objInventory.UnitCost;
            model.UnitCost = unitCost;
            decimal outAmount =(decimal) quantity * unitCost;
            decimal currentAmount =(decimal) objInventory.RunningQuantity * unitCost;
            AddBincard(model, Guid.Empty, Guid.Empty, objInventory.RunningQuantity, quantity, 0, unitCost);
            return unitCost;
        }
        public void ReturnInventoryUpdateFromVoidedT(ParameterModel model)
        {

            var objInventory = this.GetAll().AsQueryable().Where(o => o.IsClosed == false && o.FiscalYearId == model.FiscalYearId && o.ItemId == model.ItemId && o.StoreId == model.StoreId).FirstOrDefault();
            if (objInventory != null)
            {
                var quantity = model.Quantity - model.DamagedQuantity;
                objInventory.RunningQuantity = objInventory.RunningQuantity > 0 ? objInventory.RunningQuantity - quantity : quantity;
                objInventory.DamagedQuantity = objInventory.DamagedQuantity > 0 ? objInventory.DamagedQuantity - model.DamagedQuantity : 0;
                var damagedQuantity = objInventory.DamagedQuantity.HasValue ? objInventory.DamagedQuantity.Value : 0;
                var expiredQuantity = objInventory.ExpiredQuantity.HasValue ? objInventory.ExpiredQuantity.Value : 0;
                objInventory.AvailableQuantity = objInventory.RunningQuantity - objInventory.CommittedQuantity - damagedQuantity - expiredQuantity > 0 ? objInventory.RunningQuantity - objInventory.CommittedQuantity.Value - damagedQuantity - expiredQuantity : 0;

                _bincard.Delete(o => o.VoucherTypeId == model.VoucherTypeId && o.FiscalYearId == model.FiscalYearId && o.VoucherId == model.VoucherId);

            }

        }
        public void CommiteInventoryUpdate(ParameterModel model, double quantity)
        {

            var objInventory = this.GetAll().AsQueryable().Where(o => o.IsClosed == false && o.FiscalYearId == model.FiscalYearId && o.ItemId == model.ItemId && o.StoreId == model.StoreId).FirstOrDefault();
            if (objInventory == null) objInventory = AddNewInventory(model);

            objInventory.RunningQuantity = objInventory.RunningQuantity;
            objInventory.CommittedQuantity = objInventory.CommittedQuantity > 0 ? objInventory.CommittedQuantity + quantity : quantity;
            var damagedQuantity = objInventory.DamagedQuantity.HasValue ? objInventory.DamagedQuantity.Value : 0;
            var expiredQuantity = objInventory.ExpiredQuantity.HasValue ? objInventory.ExpiredQuantity.Value : 0;
            objInventory.AvailableQuantity = objInventory.RunningQuantity - objInventory.CommittedQuantity - damagedQuantity - expiredQuantity > 0 ? objInventory.RunningQuantity - objInventory.CommittedQuantity.Value - damagedQuantity - expiredQuantity : 0;
        }
        public void CommiteInventoryUpdateForVoidT(ParameterModel model, double quantity)
        {

            var objInventory = this.GetAll().AsQueryable().Where(o => o.IsClosed == false && o.FiscalYearId == model.FiscalYearId && o.ItemId == model.ItemId && o.StoreId == model.StoreId).FirstOrDefault();

            objInventory.RunningQuantity = objInventory.RunningQuantity;
            objInventory.CommittedQuantity = objInventory.CommittedQuantity > 0 ? objInventory.CommittedQuantity - quantity : 0;
            var damagedQuantity = objInventory.DamagedQuantity.HasValue ? objInventory.DamagedQuantity.Value : 0;
            var expiredQuantity = objInventory.ExpiredQuantity.HasValue ? objInventory.ExpiredQuantity.Value : 0;
            objInventory.AvailableQuantity = objInventory.RunningQuantity - objInventory.CommittedQuantity - damagedQuantity - expiredQuantity > 0 ? objInventory.RunningQuantity - objInventory.CommittedQuantity.Value - damagedQuantity - expiredQuantity : 0;
        }
        public void DamageInventoryUpdate(ParameterModel model, double quantity)
        {

            var objInventory = this.GetAll().AsQueryable().Where(o => o.IsClosed == false && o.FiscalYearId == model.FiscalYearId && o.ItemId == model.ItemId && o.StoreId == model.StoreId).FirstOrDefault();
            if (objInventory == null) objInventory = AddNewInventory(model);

            objInventory.RunningQuantity = objInventory.RunningQuantity;
            objInventory.DamagedQuantity = objInventory.DamagedQuantity > 0 ? objInventory.DamagedQuantity + quantity : quantity;
            var damagedQuantity = objInventory.DamagedQuantity.HasValue ? objInventory.DamagedQuantity.Value : 0;
            var expiredQuantity = objInventory.ExpiredQuantity.HasValue ? objInventory.ExpiredQuantity.Value : 0;
            objInventory.AvailableQuantity = objInventory.RunningQuantity - objInventory.CommittedQuantity - damagedQuantity - expiredQuantity > 0 ? objInventory.RunningQuantity - objInventory.CommittedQuantity.Value - damagedQuantity - expiredQuantity : 0;
        }
        public void ExpireyInventoryUpdate(ParameterModel model, double quantity)
        {

            var objInventory = this.GetAll().AsQueryable().Where(o => o.IsClosed == false && o.FiscalYearId == model.FiscalYearId && o.ItemId == model.ItemId && o.StoreId == model.StoreId).FirstOrDefault();
            if (objInventory == null) objInventory = AddNewInventory(model);

            objInventory.RunningQuantity = objInventory.RunningQuantity;
            objInventory.ExpiredQuantity = objInventory.ExpiredQuantity > 0 ? objInventory.ExpiredQuantity + quantity : quantity;
            var damagedQuantity = objInventory.DamagedQuantity.HasValue ? objInventory.DamagedQuantity.Value : 0;
            var expiredQuantity = objInventory.ExpiredQuantity.HasValue ? objInventory.ExpiredQuantity.Value : 0;
            objInventory.AvailableQuantity = objInventory.RunningQuantity - objInventory.CommittedQuantity - damagedQuantity - expiredQuantity > 0 ? objInventory.RunningQuantity - objInventory.CommittedQuantity.Value - damagedQuantity - expiredQuantity : 0;
        }


        public decimal DeliveryInventoryUpdate(ParameterModel model)
        {
            decimal unitCost = 0;
            var localModel = model.Clone();

            var objInventory = this.GetAll().AsQueryable().Where(o => o.IsClosed == false && o.FiscalYearId == model.FiscalYearId && o.ItemId == model.ItemId && o.StoreId == model.StoreId).FirstOrDefault();
            if (objInventory == null)
                throw new System.InvalidOperationException("There is no inventory record for some of the items!");
            //else if (objInventory.RunningQuantity < model.Quantity)
            //    throw new System.InvalidOperationException("There is no enough available quantity for some of the items!");

            objInventory.RunningQuantity = objInventory.RunningQuantity - model.Quantity;
            var damagedQuantity = objInventory.DamagedQuantity.HasValue ? objInventory.DamagedQuantity.Value : 0;
            var expiredQuantity = objInventory.ExpiredQuantity.HasValue ? objInventory.ExpiredQuantity.Value : 0;
            objInventory.CommittedQuantity=objInventory.CommittedQuantity>0?objInventory.CommittedQuantity-model.Quantity:0;
            objInventory.AvailableQuantity = objInventory.RunningQuantity - objInventory.CommittedQuantity - damagedQuantity - expiredQuantity > 0 ? objInventory.RunningQuantity - objInventory.CommittedQuantity.Value - damagedQuantity - expiredQuantity : 0;
            unitCost = objInventory.UnitCost;
            model.UnitCost = unitCost;
            AddBincard(model, Guid.Empty, Guid.Empty, objInventory.RunningQuantity, 0, model.Quantity, unitCost);

            return unitCost;
        }
        public void DeliveryInventoryUpdateFromVoidedT(ParameterModel model)
        {

            var objInventory = this.GetAll().AsQueryable().Where(o => o.IsClosed == false && o.FiscalYearId == model.FiscalYearId && o.ItemId == model.ItemId && o.StoreId == model.StoreId).FirstOrDefault();
            if (objInventory != null)
            {
                objInventory.RunningQuantity = objInventory.RunningQuantity + model.Quantity;
                var damagedQuantity = objInventory.DamagedQuantity.HasValue ? objInventory.DamagedQuantity.Value : 0;
                var expiredQuantity = objInventory.ExpiredQuantity.HasValue ? objInventory.ExpiredQuantity.Value : 0;
                objInventory.CommittedQuantity=objInventory.CommittedQuantity+model.Quantity;
         
                objInventory.AvailableQuantity = objInventory.RunningQuantity - objInventory.CommittedQuantity - damagedQuantity - expiredQuantity > 0 ? objInventory.RunningQuantity - objInventory.CommittedQuantity.Value - damagedQuantity - expiredQuantity : 0;

                _bincard.Delete(o => o.VoucherTypeId == model.VoucherTypeId && o.FiscalYearId == model.FiscalYearId && o.VoucherId == model.VoucherId);

            }

        }
   



        public psmsInventoryRecord AddNewInventory(ParameterModel model)
        {
            var objInventory = new psmsInventoryRecord();
            objInventory.Id = Guid.NewGuid();
            objInventory.ItemId = model.ItemId;
            objInventory.StoreId = model.StoreId;
            objInventory.FiscalYearId = model.FiscalYearId;
            objInventory.BeginingQuantity = 0;
            objInventory.RunningQuantity = 0;
            objInventory.AvailableQuantity = 0;
            objInventory.CommittedQuantity = 0;
            objInventory.UnitCost = 0;
            objInventory.IsClosed = false;
            objInventory.CreatedAt = DateTime.Now;
            objInventory.UpdatedAt = DateTime.Now;
            this.AddNew(objInventory);
            model.UnitCost = 0;
            model.VoucherNo = "Beginning Quantity";
            model.VoucherId = Guid.Empty;
            model.VoucherTypeId = null;
            var fiscalYear = _fiscalYear.GetAll().Where(f => f.IsActive == true && f.IsClosed == false).FirstOrDefault();

            model.TransactionDate =fiscalYear.StartDate;// model.FiscalYearDate.HasValue ? model.FiscalYearDate.Value : model.TransactionDate.AddHours(-1);
            AddBincard(model, Guid.Empty, Guid.Empty, 0, 0, 0, 0);
            return objInventory;

        }
        private void AddBincard(ParameterModel model, Guid costTypeId, Guid itemCostId, double currentQuantity, double receivedQuantity, double issuedQuantity, decimal averageCost)
        {
            decimal inAmount =(decimal) receivedQuantity * model.UnitCost;
            decimal outAmount = (decimal)issuedQuantity * model.UnitCost;
            decimal currentAmount =(decimal) currentQuantity * averageCost;       
            _dbContext.Database.ExecuteSqlCommand(
           "insert into psmsBinCard(Id,StoreId,ItemId,FiscalYearId,VoucherTypeId,VoucherId,VoucherNo,CurrentQuantity,ReceivedQuantity,IssuedQuantity,UnitCost,AverageCost,InAmount,OutAmount,CurrentAmount,Date,CreatedAt,UpdatedAt,CostTypeId,ItemCostId,Remark,FromStoreId,FromVoucherId,IsDeleted) values({0},{1},{2},{3},{4},{5},{6},{7},{8},{9},{10},{11},{12},{13},{14},{15},{16},{17},{18},{19},{20},{21},{22},0)", Guid.NewGuid(), model.StoreId, model.ItemId, model.FiscalYearId, model.VoucherTypeId, model.VoucherId, model.VoucherNo, currentQuantity, receivedQuantity, issuedQuantity, model.UnitCost, averageCost, inAmount, outAmount, currentAmount, model.TransactionDate, DateTime.Now, DateTime.Now, costTypeId, itemCostId, model.Remark, model.FromStoreId, model.FromVoucherId);
        }
        private decimal GetUnitConversion(Guid itemId, Guid unitId)
        {
            decimal conversionRate = 0;
            var itemUnit = _itemUnit.GetAll().AsQueryable().Where(o => o.ItemId == itemId && o.MeasurementUnitId == unitId).FirstOrDefault();

            if (itemUnit != null)
            {
                conversionRate = itemUnit.ConversionRate;
            }
            return conversionRate;
        }

    }
}
