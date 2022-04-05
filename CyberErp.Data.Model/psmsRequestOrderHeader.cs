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
    
    public partial class psmsRequestOrderHeader
    {
        public psmsRequestOrderHeader()
        {
            this.psmsPurchaseRequestHeader = new HashSet<psmsPurchaseRequestHeader>();
            this.psmsRequestOrderDetail = new HashSet<psmsRequestOrderDetail>();
            this.psmsTransferIssueHeader = new HashSet<psmsTransferIssueHeader>();
            this.psmsIssueHeader = new HashSet<psmsIssueHeader>();
        }
    
        public System.Guid Id { get; set; }
        public Nullable<System.Guid> StoreRequisitionHeaderId { get; set; }
        public Nullable<System.Guid> CommitmentHeaderId { get; set; }
        public string OrderType { get; set; }
        public System.DateTime Date { get; set; }
        public Nullable<System.Guid> ToUnitId { get; set; }
        public Nullable<System.Guid> StoreId { get; set; }
        public System.Guid OrderedById { get; set; }
        public System.Guid PreparedById { get; set; }
        public System.Guid StatusId { get; set; }
        public string Remark { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime UpdatedAt { get; set; }
    
        public virtual coreUnit coreUnit { get; set; }
        public virtual coreUser coreUser { get; set; }
        public virtual coreUser coreUser1 { get; set; }
        public virtual lupVoucherStatus lupVoucherStatus { get; set; }
        public virtual ICollection<psmsPurchaseRequestHeader> psmsPurchaseRequestHeader { get; set; }
        public virtual ICollection<psmsRequestOrderDetail> psmsRequestOrderDetail { get; set; }
        public virtual psmsStore psmsStore { get; set; }
        public virtual ICollection<psmsTransferIssueHeader> psmsTransferIssueHeader { get; set; }
        public virtual ICollection<psmsIssueHeader> psmsIssueHeader { get; set; }
        public virtual psmsStoreRequisitionHeader psmsStoreRequisitionHeader { get; set; }
    }
}