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
    
    public partial class coreUser
    {
        public coreUser()
        {
            this.coreUserRole = new HashSet<coreUserRole>();
            this.coreUserSubsystem = new HashSet<coreUserSubsystem>();
            this.PRNotification = new HashSet<PRNotification>();
            this.PRProductionOrderHeader = new HashSet<PRProductionOrderHeader>();
            this.PRProductionPlanHeader = new HashSet<PRProductionPlanHeader>();
            this.PRProductionPlanDeliveryHeader = new HashSet<PRProductionPlanDeliveryHeader>();
            this.PRProductionPlanDetail = new HashSet<PRProductionPlanDetail>();
            this.PRProductionPlanJobCardTeamDetail = new HashSet<PRProductionPlanJobCardTeamDetail>();
            this.psmsApprover = new HashSet<psmsApprover>();
            this.psmsCustodian_ = new HashSet<psmsCustodian_>();
            this.psmsCustodian_1 = new HashSet<psmsCustodian_>();
            this.psmsDeliveryOrderHeader = new HashSet<psmsDeliveryOrderHeader>();
            this.psmsDeliveryOrderHeader1 = new HashSet<psmsDeliveryOrderHeader>();
            this.psmsDisposalHeader = new HashSet<psmsDisposalHeader>();
            this.psmsDisposalHeader1 = new HashSet<psmsDisposalHeader>();
            this.psmsPurchaseOrderHeader = new HashSet<psmsPurchaseOrderHeader>();
            this.psmsPurchaseOrderHeader1 = new HashSet<psmsPurchaseOrderHeader>();
            this.psmsPurchaseRequestHeader = new HashSet<psmsPurchaseRequestHeader>();
            this.psmsPurchaseRequestHeader1 = new HashSet<psmsPurchaseRequestHeader>();
            this.psmsPurchaseRequestHeader2 = new HashSet<psmsPurchaseRequestHeader>();
            this.psmsRequestOrderHeader = new HashSet<psmsRequestOrderHeader>();
            this.psmsRequestOrderHeader1 = new HashSet<psmsRequestOrderHeader>();
            this.psmsReturnHeader = new HashSet<psmsReturnHeader>();
            this.psmsReturnHeader1 = new HashSet<psmsReturnHeader>();
            this.psmsReturnHeader2 = new HashSet<psmsReturnHeader>();
            this.psmsStorePermission = new HashSet<psmsStorePermission>();
            this.psmsTransferIssueHeader = new HashSet<psmsTransferIssueHeader>();
            this.psmsTransferIssueHeader1 = new HashSet<psmsTransferIssueHeader>();
            this.psmsTransferIssueHeader2 = new HashSet<psmsTransferIssueHeader>();
            this.psmsTransferReceiveHeader = new HashSet<psmsTransferReceiveHeader>();
            this.psmsTransferReceiveHeader1 = new HashSet<psmsTransferReceiveHeader>();
            this.psmsVoucherStatusTransaction = new HashSet<psmsVoucherStatusTransaction>();
            this.slmsProformaHeader = new HashSet<slmsProformaHeader>();
            this.slmsProformaHeader1 = new HashSet<slmsProformaHeader>();
            this.psmsIssueHeader = new HashSet<psmsIssueHeader>();
            this.psmsIssueHeader1 = new HashSet<psmsIssueHeader>();
            this.psmsIssueHeader2 = new HashSet<psmsIssueHeader>();
            this.psmsReceiveHeader = new HashSet<psmsReceiveHeader>();
            this.psmsReceiveHeader1 = new HashSet<psmsReceiveHeader>();
            this.psmsStoreRequisitionHeader = new HashSet<psmsStoreRequisitionHeader>();
            this.psmsStoreRequisitionHeader1 = new HashSet<psmsStoreRequisitionHeader>();
            this.psmsStoreRequisitionHeader2 = new HashSet<psmsStoreRequisitionHeader>();
            this.PRProductionPlanJobCardDetail = new HashSet<PRProductionPlanJobCardDetail>();
            this.psmsAdjustmentHeader = new HashSet<psmsAdjustmentHeader>();
            this.psmsAdjustmentHeader1 = new HashSet<psmsAdjustmentHeader>();
            this.psmsDelivery = new HashSet<psmsDelivery>();
            this.psmsFreightOrder = new HashSet<psmsFreightOrder>();
            this.psmsTransportation = new HashSet<psmsTransportation>();
            this.slmsSalesHeader = new HashSet<slmsSalesHeader>();
            this.slmsSalesHeader1 = new HashSet<slmsSalesHeader>();
        }
    
        public System.Guid Id { get; set; }
        public Nullable<System.Guid> EmployeeId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public System.DateTime DateCreated { get; set; }
        public bool IsActive { get; set; }
        public bool IsRevoked { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime UpdatedAt { get; set; }
    
        public virtual coreUser coreUser1 { get; set; }
        public virtual coreUser coreUser2 { get; set; }
        public virtual coreUser coreUser11 { get; set; }
        public virtual coreUser coreUser3 { get; set; }
        public virtual ICollection<coreUserRole> coreUserRole { get; set; }
        public virtual ICollection<coreUserSubsystem> coreUserSubsystem { get; set; }
        public virtual ICollection<PRNotification> PRNotification { get; set; }
        public virtual ICollection<PRProductionOrderHeader> PRProductionOrderHeader { get; set; }
        public virtual ICollection<PRProductionPlanHeader> PRProductionPlanHeader { get; set; }
        public virtual ICollection<PRProductionPlanDeliveryHeader> PRProductionPlanDeliveryHeader { get; set; }
        public virtual ICollection<PRProductionPlanDetail> PRProductionPlanDetail { get; set; }
        public virtual ICollection<PRProductionPlanJobCardTeamDetail> PRProductionPlanJobCardTeamDetail { get; set; }
        public virtual ICollection<psmsApprover> psmsApprover { get; set; }
        public virtual ICollection<psmsCustodian_> psmsCustodian_ { get; set; }
        public virtual ICollection<psmsCustodian_> psmsCustodian_1 { get; set; }
        public virtual ICollection<psmsDeliveryOrderHeader> psmsDeliveryOrderHeader { get; set; }
        public virtual ICollection<psmsDeliveryOrderHeader> psmsDeliveryOrderHeader1 { get; set; }
        public virtual ICollection<psmsDisposalHeader> psmsDisposalHeader { get; set; }
        public virtual ICollection<psmsDisposalHeader> psmsDisposalHeader1 { get; set; }
        public virtual ICollection<psmsPurchaseOrderHeader> psmsPurchaseOrderHeader { get; set; }
        public virtual ICollection<psmsPurchaseOrderHeader> psmsPurchaseOrderHeader1 { get; set; }
        public virtual ICollection<psmsPurchaseRequestHeader> psmsPurchaseRequestHeader { get; set; }
        public virtual ICollection<psmsPurchaseRequestHeader> psmsPurchaseRequestHeader1 { get; set; }
        public virtual ICollection<psmsPurchaseRequestHeader> psmsPurchaseRequestHeader2 { get; set; }
        public virtual ICollection<psmsRequestOrderHeader> psmsRequestOrderHeader { get; set; }
        public virtual ICollection<psmsRequestOrderHeader> psmsRequestOrderHeader1 { get; set; }
        public virtual ICollection<psmsReturnHeader> psmsReturnHeader { get; set; }
        public virtual ICollection<psmsReturnHeader> psmsReturnHeader1 { get; set; }
        public virtual ICollection<psmsReturnHeader> psmsReturnHeader2 { get; set; }
        public virtual ICollection<psmsStorePermission> psmsStorePermission { get; set; }
        public virtual ICollection<psmsTransferIssueHeader> psmsTransferIssueHeader { get; set; }
        public virtual ICollection<psmsTransferIssueHeader> psmsTransferIssueHeader1 { get; set; }
        public virtual ICollection<psmsTransferIssueHeader> psmsTransferIssueHeader2 { get; set; }
        public virtual ICollection<psmsTransferReceiveHeader> psmsTransferReceiveHeader { get; set; }
        public virtual ICollection<psmsTransferReceiveHeader> psmsTransferReceiveHeader1 { get; set; }
        public virtual ICollection<psmsVoucherStatusTransaction> psmsVoucherStatusTransaction { get; set; }
        public virtual ICollection<slmsProformaHeader> slmsProformaHeader { get; set; }
        public virtual ICollection<slmsProformaHeader> slmsProformaHeader1 { get; set; }
        public virtual ICollection<psmsIssueHeader> psmsIssueHeader { get; set; }
        public virtual ICollection<psmsIssueHeader> psmsIssueHeader1 { get; set; }
        public virtual ICollection<psmsIssueHeader> psmsIssueHeader2 { get; set; }
        public virtual ICollection<psmsReceiveHeader> psmsReceiveHeader { get; set; }
        public virtual ICollection<psmsReceiveHeader> psmsReceiveHeader1 { get; set; }
        public virtual ICollection<psmsStoreRequisitionHeader> psmsStoreRequisitionHeader { get; set; }
        public virtual ICollection<psmsStoreRequisitionHeader> psmsStoreRequisitionHeader1 { get; set; }
        public virtual ICollection<psmsStoreRequisitionHeader> psmsStoreRequisitionHeader2 { get; set; }
        public virtual ICollection<PRProductionPlanJobCardDetail> PRProductionPlanJobCardDetail { get; set; }
        public virtual ICollection<psmsAdjustmentHeader> psmsAdjustmentHeader { get; set; }
        public virtual ICollection<psmsAdjustmentHeader> psmsAdjustmentHeader1 { get; set; }
        public virtual ICollection<psmsDelivery> psmsDelivery { get; set; }
        public virtual ICollection<psmsFreightOrder> psmsFreightOrder { get; set; }
        public virtual ICollection<psmsTransportation> psmsTransportation { get; set; }
        public virtual ICollection<slmsSalesHeader> slmsSalesHeader { get; set; }
        public virtual ICollection<slmsSalesHeader> slmsSalesHeader1 { get; set; }
    }
}