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
    
    public partial class psmsTransferIssueDetail
    {
        public System.Guid Id { get; set; }
        public System.Guid TransferIssueHeaderId { get; set; }
        public System.Guid ItemId { get; set; }
        public decimal Quantity { get; set; }
        public Nullable<decimal> TransferIssuedQuantity { get; set; }
        public Nullable<decimal> RemainingQuantity { get; set; }
        public System.Guid StatusId { get; set; }
        public Nullable<decimal> UnitCost { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime UpdatedAt { get; set; }
    
        public virtual lupVoucherStatus lupVoucherStatus { get; set; }
        public virtual psmsItem psmsItem { get; set; }
        public virtual psmsTransferIssueHeader psmsTransferIssueHeader { get; set; }
    }
}
