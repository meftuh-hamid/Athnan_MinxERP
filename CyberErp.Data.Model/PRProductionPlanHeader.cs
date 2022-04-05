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
    
    public partial class PRProductionPlanHeader
    {
        public PRProductionPlanHeader()
        {
            this.PRProductionPlanBOMDetail = new HashSet<PRProductionPlanBOMDetail>();
            this.PRProductionPlanDeliveryHeader = new HashSet<PRProductionPlanDeliveryHeader>();
            this.PRProductionPlanDetail = new HashSet<PRProductionPlanDetail>();
            this.psmsIssueHeader = new HashSet<psmsIssueHeader>();
            this.psmsStoreRequisitionHeader = new HashSet<psmsStoreRequisitionHeader>();
            this.PRProductionPlanJobCardDetail = new HashSet<PRProductionPlanJobCardDetail>();
            this.psmsReturnHeader = new HashSet<psmsReturnHeader>();
        }
    
        public System.Guid Id { get; set; }
        public System.Guid ProductionOrderHeaderId { get; set; }
        public string VoucherNumber { get; set; }
        public Nullable<System.DateTime> PlanStartDate { get; set; }
        public Nullable<System.DateTime> PlanEndDate { get; set; }
        public string PlanStartTime { get; set; }
        public string PlanEndTime { get; set; }
        public Nullable<System.Guid> Interval { get; set; }
        public Nullable<decimal> PlannedOperatingCost { get; set; }
        public Nullable<decimal> ActualOperatingCost { get; set; }
        public Nullable<decimal> AdditionalCost { get; set; }
        public Nullable<decimal> MaterialCost { get; set; }
        public Nullable<decimal> TotalCost { get; set; }
        public System.Guid StatusId { get; set; }
        public Nullable<System.Guid> PreparedById { get; set; }
        public string Remark { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime UpdatedAt { get; set; }
    
        public virtual coreUser coreUser { get; set; }
        public virtual lupVoucherStatus lupVoucherStatus { get; set; }
        public virtual lupVoucherStatus lupVoucherStatus1 { get; set; }
        public virtual ICollection<PRProductionPlanBOMDetail> PRProductionPlanBOMDetail { get; set; }
        public virtual ICollection<PRProductionPlanDeliveryHeader> PRProductionPlanDeliveryHeader { get; set; }
        public virtual ICollection<PRProductionPlanDetail> PRProductionPlanDetail { get; set; }
        public virtual ICollection<psmsIssueHeader> psmsIssueHeader { get; set; }
        public virtual ICollection<psmsStoreRequisitionHeader> psmsStoreRequisitionHeader { get; set; }
        public virtual ICollection<PRProductionPlanJobCardDetail> PRProductionPlanJobCardDetail { get; set; }
        public virtual ICollection<psmsReturnHeader> psmsReturnHeader { get; set; }
    }
}
