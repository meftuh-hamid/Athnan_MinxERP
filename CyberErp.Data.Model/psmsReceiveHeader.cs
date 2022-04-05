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
    
    public partial class psmsReceiveHeader
    {
        public psmsReceiveHeader()
        {
            this.psmsReceiveDetail = new HashSet<psmsReceiveDetail>();
        }
    
        public System.Guid Id { get; set; }
        public System.Guid FiscalYearId { get; set; }
        public string VoucherNumber { get; set; }
        public Nullable<System.Guid> PurchaseRequestHeaderId { get; set; }
        public Nullable<System.Guid> PurchaseOrderId { get; set; }
        public System.Guid ReceiveTypeId { get; set; }
        public Nullable<System.Guid> SupplierId { get; set; }
        public System.Guid StoreId { get; set; }
        public string TaxRateIds { get; set; }
        public string TaxRateDescription { get; set; }
        public string TotalSummarry { get; set; }
        public string PRNo { get; set; }
        public string PONo { get; set; }
        public System.Guid PreparedById { get; set; }
        public System.Guid ReceivedById { get; set; }
        public System.DateTime ReceivedDate { get; set; }
        public string CommercialInvoiceNo { get; set; }
        public string BillofLoadingNo { get; set; }
        public string LCCADNo { get; set; }
        public string DeliveryNoteNo { get; set; }
        public string TruckPlateNo { get; set; }
        public string PackingListNo { get; set; }
        public Nullable<decimal> Discount { get; set; }
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
        public virtual lupReceiveType lupReceiveType { get; set; }
        public virtual lupVoucherStatus lupVoucherStatus { get; set; }
        public virtual psmsPurchaseOrderHeader psmsPurchaseOrderHeader { get; set; }
        public virtual psmsPurchaseRequestHeader psmsPurchaseRequestHeader { get; set; }
        public virtual ICollection<psmsReceiveDetail> psmsReceiveDetail { get; set; }
        public virtual psmsStore psmsStore { get; set; }
        public virtual psmsSupplier psmsSupplier { get; set; }
    }
}
