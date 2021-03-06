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
    
    public partial class psmsIssueHeader
    {
        public psmsIssueHeader()
        {
            this.psmsIssueDetail = new HashSet<psmsIssueDetail>();
            this.psmsReturnHeader = new HashSet<psmsReturnHeader>();
        }
    
        public System.Guid Id { get; set; }
        public System.Guid FiscalYearId { get; set; }
        public string VoucherNumber { get; set; }
        public Nullable<System.Guid> RequestOrderHeaderId { get; set; }
        public System.Guid StoreId { get; set; }
        public Nullable<System.Guid> ProductionOrderId { get; set; }
        public Nullable<System.Guid> ProductionPlanId { get; set; }
        public System.Guid PreparedById { get; set; }
        public System.Guid IssuedById { get; set; }
        public System.Guid ReceivedById { get; set; }
        public System.DateTime IssuedDate { get; set; }
        public string PlateNo { get; set; }
        public string DriverName { get; set; }
        public string Remark { get; set; }
        public System.Guid StatusId { get; set; }
        public bool IsPosted { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime UpdatedAt { get; set; }
    
        public virtual coreFiscalYear coreFiscalYear { get; set; }
        public virtual coreUser coreUser { get; set; }
        public virtual coreUser coreUser1 { get; set; }
        public virtual coreUser coreUser2 { get; set; }
        public virtual lupVoucherStatus lupVoucherStatus { get; set; }
        public virtual PRProductionOrderHeader PRProductionOrderHeader { get; set; }
        public virtual PRProductionPlanHeader PRProductionPlanHeader { get; set; }
        public virtual ICollection<psmsIssueDetail> psmsIssueDetail { get; set; }
        public virtual psmsRequestOrderHeader psmsRequestOrderHeader { get; set; }
        public virtual psmsStore psmsStore { get; set; }
        public virtual ICollection<psmsReturnHeader> psmsReturnHeader { get; set; }
    }
}
