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
    
    public partial class psmsApprover
    {
        public System.Guid Id { get; set; }
        public System.Guid EmployeeId { get; set; }
        public System.Guid VoucherTypeId { get; set; }
        public Nullable<System.Guid> UnitId { get; set; }
        public Nullable<System.Guid> StoreId { get; set; }
        public Nullable<System.Guid> StatusId { get; set; }
        public string Criteria { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime UpdatedAt { get; set; }
    
        public virtual coreUnit coreUnit { get; set; }
        public virtual coreUser coreUser { get; set; }
        public virtual lupVoucherStatus lupVoucherStatus { get; set; }
        public virtual lupVoucherType lupVoucherType { get; set; }
        public virtual psmsStore psmsStore { get; set; }
    }
}