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
    
    public partial class PRBillofMaterialOperationDetail
    {
        public System.Guid Id { get; set; }
        public System.Guid BillofMaterialHeaderId { get; set; }
        public string Description { get; set; }
        public System.Guid OperationId { get; set; }
        public Nullable<System.Guid> WorkStationId { get; set; }
        public decimal HourRate { get; set; }
        public Nullable<decimal> OperationTime { get; set; }
        public Nullable<int> SequenceNo { get; set; }
        public string Remark { get; set; }
        public string DocumentUrl { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime UpdatedAt { get; set; }
    
        public virtual PRBillofMaterialHeader PRBillofMaterialHeader { get; set; }
        public virtual PROperation PROperation { get; set; }
        public virtual PRWorkStation PRWorkStation { get; set; }
    }
}
