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
    
    public partial class psmsItem
    {
        public psmsItem()
        {
            this.PRBillofMaterialDetail = new HashSet<PRBillofMaterialDetail>();
            this.PRBillofMaterialHeader = new HashSet<PRBillofMaterialHeader>();
            this.PRProductionOrderDetail = new HashSet<PRProductionOrderDetail>();
            this.PRProductionPlanBOMDetail = new HashSet<PRProductionPlanBOMDetail>();
            this.psmsAdjustmentDetail = new HashSet<psmsAdjustmentDetail>();
            this.psmsBinCard = new HashSet<psmsBinCard>();
            this.psmsDeliveryOrderDetail = new HashSet<psmsDeliveryOrderDetail>();
            this.psmsDisposalDetail = new HashSet<psmsDisposalDetail>();
            this.psmsInventoryRecord = new HashSet<psmsInventoryRecord>();
            this.psmsIssueDetail = new HashSet<psmsIssueDetail>();
            this.psmsItemAlternative = new HashSet<psmsItemAlternative>();
            this.psmsItemAlternative1 = new HashSet<psmsItemAlternative>();
            this.psmsItemLocation = new HashSet<psmsItemLocation>();
            this.psmsItemLOT = new HashSet<psmsItemLOT>();
            this.psmsItemPackage = new HashSet<psmsItemPackage>();
            this.psmsItemPackage1 = new HashSet<psmsItemPackage>();
            this.psmsItemSerial = new HashSet<psmsItemSerial>();
            this.psmsItemUnit = new HashSet<psmsItemUnit>();
            this.psmsPurchaseOrderDetail = new HashSet<psmsPurchaseOrderDetail>();
            this.psmsPurchaseRequestDetail = new HashSet<psmsPurchaseRequestDetail>();
            this.psmsReceiveDetail = new HashSet<psmsReceiveDetail>();
            this.psmsRequestOrderDetail = new HashSet<psmsRequestOrderDetail>();
            this.psmsReturnDetail = new HashSet<psmsReturnDetail>();
            this.psmsStoreRequisitionDetail = new HashSet<psmsStoreRequisitionDetail>();
            this.psmsTransferIssueDetail = new HashSet<psmsTransferIssueDetail>();
            this.psmsTransferReceiveDetail = new HashSet<psmsTransferReceiveDetail>();
            this.PRProductionPlanJobCardResultDetail = new HashSet<PRProductionPlanJobCardResultDetail>();
            this.psmsDelivery = new HashSet<psmsDelivery>();
            this.psmsFreightOrder = new HashSet<psmsFreightOrder>();
            this.psmsTransportation = new HashSet<psmsTransportation>();
            this.slmsItemPrice = new HashSet<slmsItemPrice>();
            this.slmsProformaDetail = new HashSet<slmsProformaDetail>();
            this.slmsSalesDetail = new HashSet<slmsSalesDetail>();
        }
    
        public System.Guid Id { get; set; }
        public System.Guid ItemCategoryId { get; set; }
        public System.Guid ItemTypeId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string PartNumber { get; set; }
        public System.Guid MeasurementUnitId { get; set; }
        public string InventoryUnit { get; set; }
        public string ABC { get; set; }
        public string FSN { get; set; }
        public string SDE { get; set; }
        public decimal Volume { get; set; }
        public decimal Weight { get; set; }
        public string ItemSpecification { get; set; }
        public string BarCode { get; set; }
        public string Supplier { get; set; }
        public string Brand { get; set; }
        public bool IsLOTItem { get; set; }
        public Nullable<bool> IsSerialItem { get; set; }
        public bool IsHazardous { get; set; }
        public Nullable<bool> IsActive { get; set; }
        public string TaxRateIds { get; set; }
        public string TaxRateDescription { get; set; }
        public string Remark { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime UpdatedAt { get; set; }
    
        public virtual lupItemType lupItemType { get; set; }
        public virtual lupMeasurementUnit lupMeasurementUnit { get; set; }
        public virtual ICollection<PRBillofMaterialDetail> PRBillofMaterialDetail { get; set; }
        public virtual ICollection<PRBillofMaterialHeader> PRBillofMaterialHeader { get; set; }
        public virtual ICollection<PRProductionOrderDetail> PRProductionOrderDetail { get; set; }
        public virtual ICollection<PRProductionPlanBOMDetail> PRProductionPlanBOMDetail { get; set; }
        public virtual ICollection<psmsAdjustmentDetail> psmsAdjustmentDetail { get; set; }
        public virtual ICollection<psmsBinCard> psmsBinCard { get; set; }
        public virtual ICollection<psmsDeliveryOrderDetail> psmsDeliveryOrderDetail { get; set; }
        public virtual ICollection<psmsDisposalDetail> psmsDisposalDetail { get; set; }
        public virtual ICollection<psmsInventoryRecord> psmsInventoryRecord { get; set; }
        public virtual ICollection<psmsIssueDetail> psmsIssueDetail { get; set; }
        public virtual psmsItemCategory psmsItemCategory { get; set; }
        public virtual ICollection<psmsItemAlternative> psmsItemAlternative { get; set; }
        public virtual ICollection<psmsItemAlternative> psmsItemAlternative1 { get; set; }
        public virtual ICollection<psmsItemLocation> psmsItemLocation { get; set; }
        public virtual ICollection<psmsItemLOT> psmsItemLOT { get; set; }
        public virtual ICollection<psmsItemPackage> psmsItemPackage { get; set; }
        public virtual ICollection<psmsItemPackage> psmsItemPackage1 { get; set; }
        public virtual ICollection<psmsItemSerial> psmsItemSerial { get; set; }
        public virtual ICollection<psmsItemUnit> psmsItemUnit { get; set; }
        public virtual ICollection<psmsPurchaseOrderDetail> psmsPurchaseOrderDetail { get; set; }
        public virtual ICollection<psmsPurchaseRequestDetail> psmsPurchaseRequestDetail { get; set; }
        public virtual ICollection<psmsReceiveDetail> psmsReceiveDetail { get; set; }
        public virtual ICollection<psmsRequestOrderDetail> psmsRequestOrderDetail { get; set; }
        public virtual ICollection<psmsReturnDetail> psmsReturnDetail { get; set; }
        public virtual ICollection<psmsStoreRequisitionDetail> psmsStoreRequisitionDetail { get; set; }
        public virtual ICollection<psmsTransferIssueDetail> psmsTransferIssueDetail { get; set; }
        public virtual ICollection<psmsTransferReceiveDetail> psmsTransferReceiveDetail { get; set; }
        public virtual ICollection<PRProductionPlanJobCardResultDetail> PRProductionPlanJobCardResultDetail { get; set; }
        public virtual ICollection<psmsDelivery> psmsDelivery { get; set; }
        public virtual ICollection<psmsFreightOrder> psmsFreightOrder { get; set; }
        public virtual ICollection<psmsTransportation> psmsTransportation { get; set; }
        public virtual ICollection<slmsItemPrice> slmsItemPrice { get; set; }
        public virtual ICollection<slmsProformaDetail> slmsProformaDetail { get; set; }
        public virtual ICollection<slmsSalesDetail> slmsSalesDetail { get; set; }
    }
}
