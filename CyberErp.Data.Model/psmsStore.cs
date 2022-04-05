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
    
    public partial class psmsStore
    {
        public psmsStore()
        {
            this.PRBillofMaterialDetail = new HashSet<PRBillofMaterialDetail>();
            this.PRDocumentNoSetting = new HashSet<PRDocumentNoSetting>();
            this.PRProductionOrderHeader = new HashSet<PRProductionOrderHeader>();
            this.PRProductionPlanBOMDetail = new HashSet<PRProductionPlanBOMDetail>();
            this.psmsApprover = new HashSet<psmsApprover>();
            this.psmsBinCard = new HashSet<psmsBinCard>();
            this.psmsCustodian_ = new HashSet<psmsCustodian_>();
            this.psmsDeliveryOrderHeader = new HashSet<psmsDeliveryOrderHeader>();
            this.psmsDisposalHeader = new HashSet<psmsDisposalHeader>();
            this.psmsDocumentNoSetting = new HashSet<psmsDocumentNoSetting>();
            this.psmsInventoryRecord = new HashSet<psmsInventoryRecord>();
            this.psmsItemLocation = new HashSet<psmsItemLocation>();
            this.psmsItemLOT = new HashSet<psmsItemLOT>();
            this.psmsItemSerial = new HashSet<psmsItemSerial>();
            this.psmsPurchaseOrderHeader = new HashSet<psmsPurchaseOrderHeader>();
            this.psmsPurchaseRequestHeader = new HashSet<psmsPurchaseRequestHeader>();
            this.psmsPurchaseRequestHeader1 = new HashSet<psmsPurchaseRequestHeader>();
            this.psmsRequestOrderHeader = new HashSet<psmsRequestOrderHeader>();
            this.psmsReturnHeader = new HashSet<psmsReturnHeader>();
            this.psmsReturnHeader1 = new HashSet<psmsReturnHeader>();
            this.psmsStore1 = new HashSet<psmsStore>();
            this.psmsStoreLocation = new HashSet<psmsStoreLocation>();
            this.psmsStorePermission = new HashSet<psmsStorePermission>();
            this.psmsTransferIssueHeader = new HashSet<psmsTransferIssueHeader>();
            this.psmsTransferIssueHeader1 = new HashSet<psmsTransferIssueHeader>();
            this.psmsTransferReceiveHeader = new HashSet<psmsTransferReceiveHeader>();
            this.psmsTransferReceiveHeader1 = new HashSet<psmsTransferReceiveHeader>();
            this.psmsIssueHeader = new HashSet<psmsIssueHeader>();
            this.psmsReceiveHeader = new HashSet<psmsReceiveHeader>();
            this.psmsStoreRequisitionHeader = new HashSet<psmsStoreRequisitionHeader>();
            this.psmsStoreRequisitionHeader1 = new HashSet<psmsStoreRequisitionHeader>();
            this.psmsAdjustmentHeader = new HashSet<psmsAdjustmentHeader>();
            this.slmsDailySales = new HashSet<slmsDailySales>();
            this.slmsSalesArea = new HashSet<slmsSalesArea>();
        }
    
        public System.Guid Id { get; set; }
        public Nullable<System.Guid> ParentId { get; set; }
        public System.Guid TypeId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public Nullable<System.Guid> CostCenterId { get; set; }
        public decimal Size { get; set; }
        public decimal Capacity { get; set; }
        public decimal UtilizedSpace { get; set; }
        public string Address { get; set; }
        public string Remark { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime UpdatedAt { get; set; }
    
        public virtual lupStoreType lupStoreType { get; set; }
        public virtual ICollection<PRBillofMaterialDetail> PRBillofMaterialDetail { get; set; }
        public virtual ICollection<PRDocumentNoSetting> PRDocumentNoSetting { get; set; }
        public virtual ICollection<PRProductionOrderHeader> PRProductionOrderHeader { get; set; }
        public virtual ICollection<PRProductionPlanBOMDetail> PRProductionPlanBOMDetail { get; set; }
        public virtual ICollection<psmsApprover> psmsApprover { get; set; }
        public virtual ICollection<psmsBinCard> psmsBinCard { get; set; }
        public virtual ICollection<psmsCustodian_> psmsCustodian_ { get; set; }
        public virtual ICollection<psmsDeliveryOrderHeader> psmsDeliveryOrderHeader { get; set; }
        public virtual ICollection<psmsDisposalHeader> psmsDisposalHeader { get; set; }
        public virtual ICollection<psmsDocumentNoSetting> psmsDocumentNoSetting { get; set; }
        public virtual ICollection<psmsInventoryRecord> psmsInventoryRecord { get; set; }
        public virtual ICollection<psmsItemLocation> psmsItemLocation { get; set; }
        public virtual ICollection<psmsItemLOT> psmsItemLOT { get; set; }
        public virtual ICollection<psmsItemSerial> psmsItemSerial { get; set; }
        public virtual ICollection<psmsPurchaseOrderHeader> psmsPurchaseOrderHeader { get; set; }
        public virtual ICollection<psmsPurchaseRequestHeader> psmsPurchaseRequestHeader { get; set; }
        public virtual ICollection<psmsPurchaseRequestHeader> psmsPurchaseRequestHeader1 { get; set; }
        public virtual ICollection<psmsRequestOrderHeader> psmsRequestOrderHeader { get; set; }
        public virtual ICollection<psmsReturnHeader> psmsReturnHeader { get; set; }
        public virtual ICollection<psmsReturnHeader> psmsReturnHeader1 { get; set; }
        public virtual ICollection<psmsStore> psmsStore1 { get; set; }
        public virtual psmsStore psmsStore2 { get; set; }
        public virtual ICollection<psmsStoreLocation> psmsStoreLocation { get; set; }
        public virtual ICollection<psmsStorePermission> psmsStorePermission { get; set; }
        public virtual ICollection<psmsTransferIssueHeader> psmsTransferIssueHeader { get; set; }
        public virtual ICollection<psmsTransferIssueHeader> psmsTransferIssueHeader1 { get; set; }
        public virtual ICollection<psmsTransferReceiveHeader> psmsTransferReceiveHeader { get; set; }
        public virtual ICollection<psmsTransferReceiveHeader> psmsTransferReceiveHeader1 { get; set; }
        public virtual ICollection<psmsIssueHeader> psmsIssueHeader { get; set; }
        public virtual ICollection<psmsReceiveHeader> psmsReceiveHeader { get; set; }
        public virtual ICollection<psmsStoreRequisitionHeader> psmsStoreRequisitionHeader { get; set; }
        public virtual ICollection<psmsStoreRequisitionHeader> psmsStoreRequisitionHeader1 { get; set; }
        public virtual ICollection<psmsAdjustmentHeader> psmsAdjustmentHeader { get; set; }
        public virtual ICollection<slmsDailySales> slmsDailySales { get; set; }
        public virtual ICollection<slmsSalesArea> slmsSalesArea { get; set; }
    }
}