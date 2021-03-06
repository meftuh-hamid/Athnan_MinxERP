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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class ErpEntities : DbContext
    {
        public ErpEntities()
            : base("name=ErpEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<coreModule> coreModule { get; set; }
        public virtual DbSet<coreOperation> coreOperation { get; set; }
        public virtual DbSet<corePeriod> corePeriod { get; set; }
        public virtual DbSet<coreRole> coreRole { get; set; }
        public virtual DbSet<coreRolePermission> coreRolePermission { get; set; }
        public virtual DbSet<coreUnit> coreUnit { get; set; }
        public virtual DbSet<coreFiscalYear> coreFiscalYear { get; set; }
        public virtual DbSet<coreUser> coreUser { get; set; }
        public virtual DbSet<coreUserRole> coreUserRole { get; set; }
        public virtual DbSet<coreVoucherWorkFlow> coreVoucherWorkFlow { get; set; }
        public virtual DbSet<lupAdjustmentType> lupAdjustmentType { get; set; }
        public virtual DbSet<lupConsumerType> lupConsumerType { get; set; }
        public virtual DbSet<lupDisposalType> lupDisposalType { get; set; }
        public virtual DbSet<lupItemCategoryType> lupItemCategoryType { get; set; }
        public virtual DbSet<lupItemType> lupItemType { get; set; }
        public virtual DbSet<lupMeasurementUnit> lupMeasurementUnit { get; set; }
        public virtual DbSet<lupPriceGroup> lupPriceGroup { get; set; }
        public virtual DbSet<lupPurchaseOrderType> lupPurchaseOrderType { get; set; }
        public virtual DbSet<lupPurchaseRequestType> lupPurchaseRequestType { get; set; }
        public virtual DbSet<lupReceiveType> lupReceiveType { get; set; }
        public virtual DbSet<lupRequestPurpose> lupRequestPurpose { get; set; }
        public virtual DbSet<lupReturnType> lupReturnType { get; set; }
        public virtual DbSet<lupSalesType> lupSalesType { get; set; }
        public virtual DbSet<lupStoreType> lupStoreType { get; set; }
        public virtual DbSet<lupSupplierCategory> lupSupplierCategory { get; set; }
        public virtual DbSet<lupVoucherStatus> lupVoucherStatus { get; set; }
        public virtual DbSet<lupVoucherType> lupVoucherType { get; set; }
        public virtual DbSet<PRBillofMaterialDetail> PRBillofMaterialDetail { get; set; }
        public virtual DbSet<PRBillofMaterialHeader> PRBillofMaterialHeader { get; set; }
        public virtual DbSet<PRDocumentNoSetting> PRDocumentNoSetting { get; set; }
        public virtual DbSet<PRHoliday> PRHoliday { get; set; }
        public virtual DbSet<PRNotification> PRNotification { get; set; }
        public virtual DbSet<PROperation> PROperation { get; set; }
        public virtual DbSet<PRProductionCenter> PRProductionCenter { get; set; }
        public virtual DbSet<PRProductionOrderDetail> PRProductionOrderDetail { get; set; }
        public virtual DbSet<PRProductionOrderHeader> PRProductionOrderHeader { get; set; }
        public virtual DbSet<PRProductionPlanBOMDetail> PRProductionPlanBOMDetail { get; set; }
        public virtual DbSet<PRProductionPlanDeliveryDetail> PRProductionPlanDeliveryDetail { get; set; }
        public virtual DbSet<PRProductionPlanDeliveryHeader> PRProductionPlanDeliveryHeader { get; set; }
        public virtual DbSet<PRProductionPlanDetail> PRProductionPlanDetail { get; set; }
        public virtual DbSet<PRProductionPlanHeader> PRProductionPlanHeader { get; set; }
        public virtual DbSet<PRProductionPlanJobCardTeamDetail> PRProductionPlanJobCardTeamDetail { get; set; }
        public virtual DbSet<PRSetting> PRSetting { get; set; }
        public virtual DbSet<PRWorkStation> PRWorkStation { get; set; }
        public virtual DbSet<PRWorkStationWorkingHour> PRWorkStationWorkingHour { get; set; }
        public virtual DbSet<psmsAdjustmentDetail> psmsAdjustmentDetail { get; set; }
        public virtual DbSet<psmsApprover> psmsApprover { get; set; }
        public virtual DbSet<psmsBinCard> psmsBinCard { get; set; }
        public virtual DbSet<psmsCustodian_> psmsCustodian_ { get; set; }
        public virtual DbSet<psmsDeliveryOrderDetail> psmsDeliveryOrderDetail { get; set; }
        public virtual DbSet<psmsDeliveryOrderHeader> psmsDeliveryOrderHeader { get; set; }
        public virtual DbSet<psmsDisposalDetail> psmsDisposalDetail { get; set; }
        public virtual DbSet<psmsDisposalHeader> psmsDisposalHeader { get; set; }
        public virtual DbSet<psmsDocumentNoSetting> psmsDocumentNoSetting { get; set; }
        public virtual DbSet<psmsInventoryRecord> psmsInventoryRecord { get; set; }
        public virtual DbSet<psmsIssueDetail> psmsIssueDetail { get; set; }
        public virtual DbSet<psmsItem> psmsItem { get; set; }
        public virtual DbSet<psmsItemAlternative> psmsItemAlternative { get; set; }
        public virtual DbSet<psmsItemCategory> psmsItemCategory { get; set; }
        public virtual DbSet<psmsItemLocation> psmsItemLocation { get; set; }
        public virtual DbSet<psmsItemLocationTransaction> psmsItemLocationTransaction { get; set; }
        public virtual DbSet<psmsItemLOT> psmsItemLOT { get; set; }
        public virtual DbSet<psmsItemLOTTransaction> psmsItemLOTTransaction { get; set; }
        public virtual DbSet<psmsItemPackage> psmsItemPackage { get; set; }
        public virtual DbSet<psmsItemSerial> psmsItemSerial { get; set; }
        public virtual DbSet<psmsItemSerialTransaction> psmsItemSerialTransaction { get; set; }
        public virtual DbSet<psmsItemUnit> psmsItemUnit { get; set; }
        public virtual DbSet<psmsNotification> psmsNotification { get; set; }
        public virtual DbSet<psmsPurchaseOrderDetail> psmsPurchaseOrderDetail { get; set; }
        public virtual DbSet<psmsPurchaseOrderHeader> psmsPurchaseOrderHeader { get; set; }
        public virtual DbSet<psmsPurchaseRequestDetail> psmsPurchaseRequestDetail { get; set; }
        public virtual DbSet<psmsPurchaseRequestHeader> psmsPurchaseRequestHeader { get; set; }
        public virtual DbSet<psmsReceiveDetail> psmsReceiveDetail { get; set; }
        public virtual DbSet<psmsRequestOrderDetail> psmsRequestOrderDetail { get; set; }
        public virtual DbSet<psmsRequestOrderHeader> psmsRequestOrderHeader { get; set; }
        public virtual DbSet<psmsReturnDetail> psmsReturnDetail { get; set; }
        public virtual DbSet<psmsReturnHeader> psmsReturnHeader { get; set; }
        public virtual DbSet<psmsSetting> psmsSetting { get; set; }
        public virtual DbSet<psmsStore> psmsStore { get; set; }
        public virtual DbSet<psmsStoreLocation> psmsStoreLocation { get; set; }
        public virtual DbSet<psmsStoreLocationBin> psmsStoreLocationBin { get; set; }
        public virtual DbSet<psmsStorePermission> psmsStorePermission { get; set; }
        public virtual DbSet<psmsStoreRequisitionDetail> psmsStoreRequisitionDetail { get; set; }
        public virtual DbSet<psmsSupplier> psmsSupplier { get; set; }
        public virtual DbSet<psmsTaxRate> psmsTaxRate { get; set; }
        public virtual DbSet<psmsTransferIssueDetail> psmsTransferIssueDetail { get; set; }
        public virtual DbSet<psmsTransferIssueHeader> psmsTransferIssueHeader { get; set; }
        public virtual DbSet<psmsTransferReceiveDetail> psmsTransferReceiveDetail { get; set; }
        public virtual DbSet<psmsTransferReceiveHeader> psmsTransferReceiveHeader { get; set; }
        public virtual DbSet<psmsVoucherStatusTransaction> psmsVoucherStatusTransaction { get; set; }
        public virtual DbSet<slmsCustomerCategory> slmsCustomerCategory { get; set; }
        public virtual DbSet<slmsPriceCategory> slmsPriceCategory { get; set; }
        public virtual DbSet<slmsProformaHeader> slmsProformaHeader { get; set; }
        public virtual DbSet<PRProductionPlanJobCardResultDetail> PRProductionPlanJobCardResultDetail { get; set; }
        public virtual DbSet<psmsIssueHeader> psmsIssueHeader { get; set; }
        public virtual DbSet<psmsReceiveHeader> psmsReceiveHeader { get; set; }
        public virtual DbSet<psmsStoreRequisitionHeader> psmsStoreRequisitionHeader { get; set; }
        public virtual DbSet<PRProductionPlanJobCardDetail> PRProductionPlanJobCardDetail { get; set; }
        public virtual DbSet<PRBillofMaterialOperationDetail> PRBillofMaterialOperationDetail { get; set; }
        public virtual DbSet<psmsAdjustmentHeader> psmsAdjustmentHeader { get; set; }
        public virtual DbSet<slmsCustomerCredit> slmsCustomerCredit { get; set; }
        public virtual DbSet<psmsSupplierCredit> psmsSupplierCredit { get; set; }
        public virtual DbSet<slmsDailySales> slmsDailySales { get; set; }
        public virtual DbSet<slmsSettlementDetail> slmsSettlementDetail { get; set; }
        public virtual DbSet<psmsSupplierSettlementDetail> psmsSupplierSettlementDetail { get; set; }
        public virtual DbSet<psmsSupplierSettlementHeader> psmsSupplierSettlementHeader { get; set; }
        public virtual DbSet<psmsDelivery> psmsDelivery { get; set; }
        public virtual DbSet<psmsFreightOrder> psmsFreightOrder { get; set; }
        public virtual DbSet<psmsPurchaseOrderATCDetail> psmsPurchaseOrderATCDetail { get; set; }
        public virtual DbSet<slmsCustomer> slmsCustomer { get; set; }
        public virtual DbSet<slmsSalesHeader> slmsSalesHeader { get; set; }
        public virtual DbSet<slmsItemPrice> slmsItemPrice { get; set; }
        public virtual DbSet<slmsSalesArea> slmsSalesArea { get; set; }
        public virtual DbSet<slmsProformaDetail> slmsProformaDetail { get; set; }
        public virtual DbSet<slmsSalesDetail> slmsSalesDetail { get; set; }
        public virtual DbSet<slmsSettlementHeader> slmsSettlementHeader { get; set; }
        public virtual DbSet<psmsTransportation> psmsTransportation { get; set; }
        public virtual DbSet<coreUserSubsystem> coreUserSubsystem { get; set; }
        public virtual DbSet<coreSubsystem> coreSubsystem { get; set; }
    }
}
