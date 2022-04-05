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
    
    public partial class slmsSalesHeader
    {
        public slmsSalesHeader()
        {
            this.PRProductionOrderHeader = new HashSet<PRProductionOrderHeader>();
            this.psmsDeliveryOrderHeader = new HashSet<psmsDeliveryOrderHeader>();
            this.slmsSalesDetail = new HashSet<slmsSalesDetail>();
            this.slmsSettlementDetail = new HashSet<slmsSettlementDetail>();
        }
    
        public System.Guid Id { get; set; }
        public Nullable<System.Guid> ProformaHeaderId { get; set; }
        public string VoucherNumber { get; set; }
        public string ReferenceNo { get; set; }
        public System.Guid FiscalYearId { get; set; }
        public System.Guid SalesTypeId { get; set; }
        public System.Guid CustomerId { get; set; }
        public System.Guid SalesAreaId { get; set; }
        public string CheckNo { get; set; }
        public string PaymentMethod { get; set; }
        public System.DateTime Date { get; set; }
        public string FsNo { get; set; }
        public Nullable<System.Guid> PriceCategoryId { get; set; }
        public bool ApplyWithHolding { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal Tax { get; set; }
        public Nullable<decimal> WithHolding { get; set; }
        public decimal NetPay { get; set; }
        public Nullable<decimal> DiscountAmount { get; set; }
        public System.Guid PreparedById { get; set; }
        public System.Guid SalesPersonId { get; set; }
        public string Remark { get; set; }
        public bool IsPosted { get; set; }
        public System.Guid StatusId { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime UpdatedAt { get; set; }
        public System.DateTime CreatedAt { get; set; }
    
        public virtual coreUser coreUser { get; set; }
        public virtual coreUser coreUser1 { get; set; }
        public virtual lupSalesType lupSalesType { get; set; }
        public virtual lupVoucherStatus lupVoucherStatus { get; set; }
        public virtual ICollection<PRProductionOrderHeader> PRProductionOrderHeader { get; set; }
        public virtual ICollection<psmsDeliveryOrderHeader> psmsDeliveryOrderHeader { get; set; }
        public virtual slmsCustomer slmsCustomer { get; set; }
        public virtual slmsPriceCategory slmsPriceCategory { get; set; }
        public virtual slmsProformaHeader slmsProformaHeader { get; set; }
        public virtual ICollection<slmsSalesDetail> slmsSalesDetail { get; set; }
        public virtual ICollection<slmsSettlementDetail> slmsSettlementDetail { get; set; }
        public virtual slmsSalesArea slmsSalesArea { get; set; }
    }
}
