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
    
    public partial class coreVoucherWorkFlow
    {
        public System.Guid Id { get; set; }
        public System.Guid VoucherTypeId { get; set; }
        public System.Guid VoucherStatusId { get; set; }
        public string VoucherCategory { get; set; }
        public string Description { get; set; }
        public int Step { get; set; }
        public string Remark { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime UpdatedAt { get; set; }
    
        public virtual lupVoucherStatus lupVoucherStatus { get; set; }
        public virtual lupVoucherType lupVoucherType { get; set; }
    }
}
