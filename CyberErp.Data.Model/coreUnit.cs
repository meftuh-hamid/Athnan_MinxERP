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
    
    public partial class coreUnit
    {
        public coreUnit()
        {
            this.coreUnit1 = new HashSet<coreUnit>();
            this.PRProductionCenter = new HashSet<PRProductionCenter>();
            this.psmsApprover = new HashSet<psmsApprover>();
            this.psmsCustodian_ = new HashSet<psmsCustodian_>();
            this.psmsPurchaseRequestHeader = new HashSet<psmsPurchaseRequestHeader>();
            this.psmsRequestOrderHeader = new HashSet<psmsRequestOrderHeader>();
            this.psmsReturnHeader = new HashSet<psmsReturnHeader>();
            this.psmsStoreRequisitionHeader = new HashSet<psmsStoreRequisitionHeader>();
        }
    
        public System.Guid Id { get; set; }
        public string Name { get; set; }
        public string NameA { get; set; }
        public string Code { get; set; }
        public System.Guid TypeId { get; set; }
        public Nullable<System.Guid> ParentId { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime UpdatedAt { get; set; }
    
        public virtual ICollection<coreUnit> coreUnit1 { get; set; }
        public virtual coreUnit coreUnit2 { get; set; }
        public virtual ICollection<PRProductionCenter> PRProductionCenter { get; set; }
        public virtual ICollection<psmsApprover> psmsApprover { get; set; }
        public virtual ICollection<psmsCustodian_> psmsCustodian_ { get; set; }
        public virtual ICollection<psmsPurchaseRequestHeader> psmsPurchaseRequestHeader { get; set; }
        public virtual ICollection<psmsRequestOrderHeader> psmsRequestOrderHeader { get; set; }
        public virtual ICollection<psmsReturnHeader> psmsReturnHeader { get; set; }
        public virtual ICollection<psmsStoreRequisitionHeader> psmsStoreRequisitionHeader { get; set; }
    }
}