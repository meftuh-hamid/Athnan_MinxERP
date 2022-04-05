using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace CyberErp.Presentation.Psms.Web.Classes
{
    class Model
    {
        public class SalesTransaction
        {
             public string branch { get; set; }
             public string code { get; set; }
             public string voucherDefinition { get; set; }
             public string consignee { get; set; }
             public string article { get; set; }
             public DateTime IssuedDate { get; set; }
             public decimal quantity { get; set; }
             public decimal unitAmt { get; set; } 
             public string UOM { get; set; } 
             public decimal totalAmount { get; set; } 
             public decimal calculatedCost { get; set; }
             public string period { get; set; }
             public string name { get; set; }
             public decimal grandTotal { get; set; }
            
        }
        public class ImportModel
        {           
            public Guid ItemId { get; set; }
            public string Name { get; set; }
            public string Supplier { get; set; }
            public Guid UnitId { get; set; }        
            public string MeasurementUnit { get; set; }
            public string Code { get; set; }
            public decimal Quantity { get; set; }
            public decimal UnitCost { get; set; }
        }
        public class VoucherDetail
        {
            public Guid ItemId { get; set; }
            public decimal Quantity { get; set; }
            public decimal ItemUnitPrice { get; set; }           
        }


        public class Bincard
        {
            public Guid Id { get; set; }
            public Guid ItemId { get; set; }
            public Guid VoucherTypeId { get; set; }
            public Guid VoucherId { get; set; }
            public Guid StoreId { get; set; }   
            public Guid? FromStoreId { get; set; }
            public Guid? FromVoucherId { get; set; }
            public decimal UnitCost { get; set; }
            public decimal AverageCost { get; set; }
            public double IssuedQuantity { get; set; }
            public double ReceivedQuantity { get; set; }
            public double CurrentQuantity { get; set; }           
            public DateTime CreatedAt { get; set; }
            public DateTime UpdatedAt { get; set; }
            public string VoucherNo { get; set; }
            public Int64 IdentityId { get; set; }
            public bool IsCalculated { get; set; }
        }

    }
}
