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
    
    public partial class PRBillofMaterialHeader
    {
        public PRBillofMaterialHeader()
        {
            this.PRBillofMaterialDetail = new HashSet<PRBillofMaterialDetail>();
            this.PRBillofMaterialDetail1 = new HashSet<PRBillofMaterialDetail>();
            this.PRBillofMaterialOperationDetail = new HashSet<PRBillofMaterialOperationDetail>();
        }
    
        public System.Guid Id { get; set; }
        public string Number { get; set; }
        public Nullable<System.Guid> ItemId { get; set; }
        public Nullable<System.Guid> ItemCategoryId { get; set; }
        public string Description { get; set; }
        public Nullable<decimal> MaterialCost { get; set; }
        public Nullable<decimal> OperationCost { get; set; }
        public Nullable<decimal> ScrapCost { get; set; }
        public Nullable<decimal> OverheadCost { get; set; }
        public Nullable<decimal> Total { get; set; }
        public Nullable<decimal> Quantity { get; set; }
        public string Remark { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime UpdatedAt { get; set; }
    
        public virtual ICollection<PRBillofMaterialDetail> PRBillofMaterialDetail { get; set; }
        public virtual ICollection<PRBillofMaterialDetail> PRBillofMaterialDetail1 { get; set; }
        public virtual psmsItem psmsItem { get; set; }
        public virtual psmsItemCategory psmsItemCategory { get; set; }
        public virtual ICollection<PRBillofMaterialOperationDetail> PRBillofMaterialOperationDetail { get; set; }
    }
}