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
    
    public partial class lupMeasurementUnit
    {
        public lupMeasurementUnit()
        {
            this.PRBillofMaterialDetail = new HashSet<PRBillofMaterialDetail>();
            this.PRProductionPlanBOMDetail = new HashSet<PRProductionPlanBOMDetail>();
            this.PRProductionOrderDetail = new HashSet<PRProductionOrderDetail>();
            this.psmsDeliveryOrderDetail = new HashSet<psmsDeliveryOrderDetail>();
            this.psmsIssueDetail = new HashSet<psmsIssueDetail>();
            this.psmsItem = new HashSet<psmsItem>();
            this.psmsItemPackage = new HashSet<psmsItemPackage>();
            this.psmsItemUnit = new HashSet<psmsItemUnit>();
            this.psmsPurchaseOrderDetail = new HashSet<psmsPurchaseOrderDetail>();
            this.psmsPurchaseRequestDetail = new HashSet<psmsPurchaseRequestDetail>();
            this.psmsReceiveDetail = new HashSet<psmsReceiveDetail>();
            this.psmsRequestOrderDetail = new HashSet<psmsRequestOrderDetail>();
            this.psmsStoreRequisitionDetail = new HashSet<psmsStoreRequisitionDetail>();
            this.psmsDelivery = new HashSet<psmsDelivery>();
            this.psmsFreightOrder = new HashSet<psmsFreightOrder>();
            this.psmsTransportation = new HashSet<psmsTransportation>();
            this.slmsItemPrice = new HashSet<slmsItemPrice>();
            this.slmsProformaDetail = new HashSet<slmsProformaDetail>();
            this.slmsSalesDetail = new HashSet<slmsSalesDetail>();
        }
    
        public System.Guid Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime UpdatedAt { get; set; }
    
        public virtual ICollection<PRBillofMaterialDetail> PRBillofMaterialDetail { get; set; }
        public virtual ICollection<PRProductionPlanBOMDetail> PRProductionPlanBOMDetail { get; set; }
        public virtual ICollection<PRProductionOrderDetail> PRProductionOrderDetail { get; set; }
        public virtual ICollection<psmsDeliveryOrderDetail> psmsDeliveryOrderDetail { get; set; }
        public virtual ICollection<psmsIssueDetail> psmsIssueDetail { get; set; }
        public virtual ICollection<psmsItem> psmsItem { get; set; }
        public virtual ICollection<psmsItemPackage> psmsItemPackage { get; set; }
        public virtual ICollection<psmsItemUnit> psmsItemUnit { get; set; }
        public virtual ICollection<psmsPurchaseOrderDetail> psmsPurchaseOrderDetail { get; set; }
        public virtual ICollection<psmsPurchaseRequestDetail> psmsPurchaseRequestDetail { get; set; }
        public virtual ICollection<psmsReceiveDetail> psmsReceiveDetail { get; set; }
        public virtual ICollection<psmsRequestOrderDetail> psmsRequestOrderDetail { get; set; }
        public virtual ICollection<psmsStoreRequisitionDetail> psmsStoreRequisitionDetail { get; set; }
        public virtual ICollection<psmsDelivery> psmsDelivery { get; set; }
        public virtual ICollection<psmsFreightOrder> psmsFreightOrder { get; set; }
        public virtual ICollection<psmsTransportation> psmsTransportation { get; set; }
        public virtual ICollection<slmsItemPrice> slmsItemPrice { get; set; }
        public virtual ICollection<slmsProformaDetail> slmsProformaDetail { get; set; }
        public virtual ICollection<slmsSalesDetail> slmsSalesDetail { get; set; }
    }
}
