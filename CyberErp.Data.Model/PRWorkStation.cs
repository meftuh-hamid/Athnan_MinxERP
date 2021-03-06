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
    
    public partial class PRWorkStation
    {
        public PRWorkStation()
        {
            this.PROperation = new HashSet<PROperation>();
            this.PRWorkStationWorkingHour = new HashSet<PRWorkStationWorkingHour>();
            this.PRProductionPlanJobCardDetail = new HashSet<PRProductionPlanJobCardDetail>();
            this.PRBillofMaterialOperationDetail = new HashSet<PRBillofMaterialOperationDetail>();
        }
    
        public System.Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Remark { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime UpdatedAt { get; set; }
        public Nullable<decimal> ElectricityCostPerHour { get; set; }
        public Nullable<decimal> ConsumableCostPerHour { get; set; }
        public Nullable<decimal> RentCostPerHour { get; set; }
        public Nullable<decimal> WageCostPerHour { get; set; }
        public Nullable<decimal> TotalCostPerHour { get; set; }
    
        public virtual ICollection<PROperation> PROperation { get; set; }
        public virtual ICollection<PRWorkStationWorkingHour> PRWorkStationWorkingHour { get; set; }
        public virtual ICollection<PRProductionPlanJobCardDetail> PRProductionPlanJobCardDetail { get; set; }
        public virtual ICollection<PRBillofMaterialOperationDetail> PRBillofMaterialOperationDetail { get; set; }
    }
}
