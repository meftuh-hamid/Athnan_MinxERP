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
    
    public partial class PRProductionPlanJobCardTeamDetail
    {
        public System.Guid Id { get; set; }
        public string Number { get; set; }
        public System.Guid ProductionPlanJobCardDetailId { get; set; }
        public Nullable<System.Guid> AssignedEmployeeId { get; set; }
        public string Remark { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime UpdatedAt { get; set; }
    
        public virtual coreUser coreUser { get; set; }
        public virtual PRProductionPlanJobCardDetail PRProductionPlanJobCardDetail { get; set; }
    }
}