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
    
    public partial class slmsSettlementHeader
    {
        public slmsSettlementHeader()
        {
            this.slmsSettlementDetail = new HashSet<slmsSettlementDetail>();
        }
    
        public System.Guid Id { get; set; }
        public string ReferenceNo { get; set; }
        public Nullable<System.Guid> CustomerId { get; set; }
        public string CollectedFrom { get; set; }
        public Nullable<decimal> Amount { get; set; }
        public System.DateTime Date { get; set; }
        public string Remark { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime UpdatedAt { get; set; }
    
        public virtual slmsCustomer slmsCustomer { get; set; }
        public virtual ICollection<slmsSettlementDetail> slmsSettlementDetail { get; set; }
    }
}
