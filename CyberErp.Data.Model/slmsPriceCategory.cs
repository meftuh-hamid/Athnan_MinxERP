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
    
    public partial class slmsPriceCategory
    {
        public slmsPriceCategory()
        {
            this.slmsProformaHeader = new HashSet<slmsProformaHeader>();
            this.slmsCustomer = new HashSet<slmsCustomer>();
            this.slmsSalesHeader = new HashSet<slmsSalesHeader>();
            this.slmsItemPrice = new HashSet<slmsItemPrice>();
            this.slmsSalesArea = new HashSet<slmsSalesArea>();
        }
    
        public System.Guid Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime UpdatedAt { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public string Remark { get; set; }
    
        public virtual ICollection<slmsProformaHeader> slmsProformaHeader { get; set; }
        public virtual ICollection<slmsCustomer> slmsCustomer { get; set; }
        public virtual ICollection<slmsSalesHeader> slmsSalesHeader { get; set; }
        public virtual ICollection<slmsItemPrice> slmsItemPrice { get; set; }
        public virtual ICollection<slmsSalesArea> slmsSalesArea { get; set; }
    }
}
