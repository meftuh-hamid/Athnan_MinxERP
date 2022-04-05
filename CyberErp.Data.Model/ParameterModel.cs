using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CyberErp.Data.Model
{
    public class ParameterModel
    {
       public Guid FiscalYearId { get; set; }
       public Guid ItemId { get; set; }
       public Guid StoreId { get; set; }
       public Guid? FromStoreId { get; set; }
       public double Quantity { get; set; }
       public double DamagedQuantity { get; set; }
       public decimal UnitCost { get; set; }
        public Guid? VoucherTypeId { get; set; }
       public Guid? VoucherId { get; set; }
       public Guid? FromVoucherId { get; set; }
       public string VoucherNo { get; set; }
       public DateTime TransactionDate { get; set; }
       public DateTime? FiscalYearDate { get; set; }
       public DateTime? ExpireyDate { get; set; }
       public string param { get; set; }
        public string Remark {get;set;}
        public object Clone()
        {
            return this.MemberwiseClone();
        }
    }
}
