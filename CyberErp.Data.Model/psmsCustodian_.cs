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
    
    public partial class psmsCustodian_
    {
        public System.Guid Id { get; set; }
        public System.Guid VoucherHeaderId { get; set; }
        public Nullable<System.Guid> VoucherTypeId { get; set; }
        public string VoucherNumber { get; set; }
        public System.Guid ConsumerTypeId { get; set; }
        public Nullable<System.Guid> ConsumerStoreId { get; set; }
        public Nullable<System.Guid> ConsumerEmployeeId { get; set; }
        public Nullable<System.Guid> ConsumerUnitId { get; set; }
        public Nullable<System.Guid> ItemSerialId { get; set; }
        public System.DateTime Date { get; set; }
        public string Remark { get; set; }
        public bool IsReturned { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime UpdatedAt { get; set; }
    
        public virtual coreUnit coreUnit { get; set; }
        public virtual coreUser coreUser { get; set; }
        public virtual coreUser coreUser1 { get; set; }
        public virtual lupConsumerType lupConsumerType { get; set; }
        public virtual lupVoucherType lupVoucherType { get; set; }
        public virtual psmsItemSerial psmsItemSerial { get; set; }
        public virtual psmsStore psmsStore { get; set; }
    }
}
