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
    
    public partial class psmsSupplierSettlementDetail
    {
        public System.Guid Id { get; set; }
        public System.Guid SupplierSettlementHeaderId { get; set; }
        public Nullable<System.Guid> InvoiceId { get; set; }
        public Nullable<System.Guid> CreditId { get; set; }
        public decimal InvoiceAmount { get; set; }
        public decimal SettledAmount { get; set; }
        public decimal RemainingAmount { get; set; }
        public string Remark { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime UpdatedAt { get; set; }
    
        public virtual psmsPurchaseOrderHeader psmsPurchaseOrderHeader { get; set; }
        public virtual psmsSupplierCredit psmsSupplierCredit { get; set; }
        public virtual psmsSupplierSettlementHeader psmsSupplierSettlementHeader { get; set; }
    }
}
