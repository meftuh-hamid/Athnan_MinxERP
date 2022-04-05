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
    
    public partial class slmsCustomer
    {
        public slmsCustomer()
        {
            this.PRProductionOrderHeader = new HashSet<PRProductionOrderHeader>();
            this.psmsDelivery = new HashSet<psmsDelivery>();
            this.psmsFreightOrder = new HashSet<psmsFreightOrder>();
            this.psmsPurchaseOrderATCDetail = new HashSet<psmsPurchaseOrderATCDetail>();
            this.slmsCustomerCredit = new HashSet<slmsCustomerCredit>();
            this.slmsProformaHeader = new HashSet<slmsProformaHeader>();
            this.slmsSettlementHeader = new HashSet<slmsSettlementHeader>();
            this.slmsSalesHeader = new HashSet<slmsSalesHeader>();
        }
    
        public System.Guid Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string ContactPerson { get; set; }
        public Nullable<System.Guid> PriceCategoryId { get; set; }
        public System.Guid CustomerCategoryId { get; set; }
        public Nullable<System.Guid> SubsidiaryAccountId { get; set; }
        public string TinNumber { get; set; }
        public string VatNumber { get; set; }
        public string LicenseNo { get; set; }
        public string RegistrationNo { get; set; }
        public string Country { get; set; }
        public string Region { get; set; }
        public string City { get; set; }
        public string Telephone { get; set; }
        public string Woreda { get; set; }
        public string HouseNo { get; set; }
        public string POBox { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public decimal CreditLimit { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime UpdatedAt { get; set; }
        public System.DateTime CreatedAt { get; set; }
    
        public virtual ICollection<PRProductionOrderHeader> PRProductionOrderHeader { get; set; }
        public virtual ICollection<psmsDelivery> psmsDelivery { get; set; }
        public virtual ICollection<psmsFreightOrder> psmsFreightOrder { get; set; }
        public virtual ICollection<psmsPurchaseOrderATCDetail> psmsPurchaseOrderATCDetail { get; set; }
        public virtual slmsCustomerCategory slmsCustomerCategory { get; set; }
        public virtual slmsPriceCategory slmsPriceCategory { get; set; }
        public virtual ICollection<slmsCustomerCredit> slmsCustomerCredit { get; set; }
        public virtual ICollection<slmsProformaHeader> slmsProformaHeader { get; set; }
        public virtual ICollection<slmsSettlementHeader> slmsSettlementHeader { get; set; }
        public virtual ICollection<slmsSalesHeader> slmsSalesHeader { get; set; }
    }
}
