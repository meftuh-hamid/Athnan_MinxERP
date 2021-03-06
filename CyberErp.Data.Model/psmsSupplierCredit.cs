//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace CyberErp.Data.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class psmsSupplierCredit
    {
        public psmsSupplierCredit()
        {
            this.psmsSupplierSettlementDetail = new HashSet<psmsSupplierSettlementDetail>();
        }
    
        public System.Guid Id { get; set; }
        public System.Guid SupplierId { get; set; }
        public string InvoiceReference { get; set; }
        public string Fs { get; set; }
        public Nullable<System.DateTime> Date { get; set; }
        public Nullable<decimal> InvoiceAmount { get; set; }
        public Nullable<decimal> RemainingAmount { get; set; }
        public string Remark { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime UpdatedAt { get; set; }
        public System.DateTime CreatedAt { get; set; }
    
        public virtual psmsSupplier psmsSupplier { get; set; }
        public virtual ICollection<psmsSupplierSettlementDetail> psmsSupplierSettlementDetail { get; set; }
    }
}
