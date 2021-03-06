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
    
    public partial class psmsTransferReceiveHeader
    {
        public psmsTransferReceiveHeader()
        {
            this.psmsTransferReceiveDetail = new HashSet<psmsTransferReceiveDetail>();
        }
    
        public System.Guid Id { get; set; }
        public System.Guid FiscalYearId { get; set; }
        public string VoucherNumber { get; set; }
        public Nullable<System.Guid> TransferIssueHeaderId { get; set; }
        public System.Guid FromStoreId { get; set; }
        public System.Guid ToStoreId { get; set; }
        public System.Guid PreparedById { get; set; }
        public System.Guid ReceivedById { get; set; }
        public System.DateTime ReceivedDate { get; set; }
        public string PlateNo { get; set; }
        public string DriverName { get; set; }
        public System.Guid StatusId { get; set; }
        public string Remark { get; set; }
        public bool IsPosted { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime UpdatedAt { get; set; }
    
        public virtual coreFiscalYear coreFiscalYear { get; set; }
        public virtual coreUser coreUser { get; set; }
        public virtual coreUser coreUser1 { get; set; }
        public virtual lupVoucherStatus lupVoucherStatus { get; set; }
        public virtual psmsStore psmsStore { get; set; }
        public virtual psmsStore psmsStore1 { get; set; }
        public virtual psmsTransferIssueHeader psmsTransferIssueHeader { get; set; }
        public virtual ICollection<psmsTransferReceiveDetail> psmsTransferReceiveDetail { get; set; }
    }
}
