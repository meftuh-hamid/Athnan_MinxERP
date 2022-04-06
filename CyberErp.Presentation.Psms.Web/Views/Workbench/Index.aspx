
<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Procurement and Supply chain Management System</title>
   <link rel="shortcut icon" href="<% = Url.Content("~/Content/images/app/favicon.ico") %>" />
    <link type="text/css" href="<% = Url.Content("~/Content/css/ext-all.css") %>" rel="Stylesheet" />
    <link type="text/css" href="<% = Url.Content("~/Content/css/app/main.css") %>" rel="Stylesheet" />
    <link type="text/css" href="<% = Url.Content("~/Content/css/app/icons.css") %>" rel="Stylesheet" />
    <link type="text/css" href="<% = Url.Content("~/Content/css/app/fileuploadfield.css") %>" rel="Stylesheet" />
     <link type="text/css" href="<% = Url.Content("~/Content/css/azzurra-legacy.css") %>" rel="Stylesheet" />
   
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/ext-base.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/ext-all.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/tab-close-menu.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/ux-util.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/array-tree.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/SystemMessage.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/SystemMessageManager.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/PagingRowNumberer.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/iframe-component.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/FileUploadField.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/ComboColumn.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/azzurra.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/jquery-3.6.0.min.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/Portal.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/PortalColumn.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/Portlet.js") %>"></script>

     
     <script type="text/javascript" src="<% = Url.Content("~/Direct/Api") %>"></script> 
   

   <%--Commom--%>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Common/Lookup.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Common/Common.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Common/DocumentNoSetting.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Common/Notifications.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Common/Login.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Common/Logout.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Common/Reception.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Common/Workbench.js") %>"></script>     
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Common/SearchTransactions.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Common/PasswordChange.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Common/TaxRate.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Common/Approver.js") %>"></script> 
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Common/Setting.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Common/VoucherWorkFlow.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Common/TaxPicker.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Common/VoucherApproval.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Common/DocumentAttachment.js") %>"></script>
     <script type="text/javascript" src="<% = Url.Content("~/Scripts/Common/NotificationWindow.js") %>"></script>
    
    <%--Item--%>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Item/Item.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Item/ItemCategory.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Item/AlternativeItem.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Item/ItemUnit.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Item/ItemStore.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Item/ItemLOT.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Item/ItemSerial.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Item/ItemSerialSelector.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Item/ItemLOTSelector.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Item/ItemPicker.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Item/ItemSerialItemChange.js") %>"></script>     
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Item/ItemCategoryChange.js") %>"></script> 
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Item/ItemBarcode.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Item/ItemReport.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Item/ItemLocation.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Item/ItemLocationTransaction.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Item/ItemPackage.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Item/ProductionPicker.js") %>"></script>
 
    <%-- Transaction --%>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Transaction/Issue.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Transaction/TransferIssue.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Transaction/TransferReceive.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Transaction/RequestOrder.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Transaction/Receive.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Transaction/Return.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Transaction/Disposal.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Transaction/Adjustment.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/InventoryTransaction/DeliveryOrder.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Transaction/GoodsRequestManagement.js") %>"></script>
   <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Transaction/RequestOrderPicker.js") %>"></script>   
              <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Transaction/StoreRequest.js") %>"></script>
   
 
  
     <%-- Inventory --%>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/Store.js") %>"></script> 
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/StorePermission.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/InventoryRecord.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/BinCard.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/BincardReport.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/TransactionReport.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/StockSummaryReport.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/TransactionReport.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/StoreLocation.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/StoreLocationBin.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/InventoryEvaluation.js") %>"></script> 
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Inventory/BinCardStockCard.js") %>"></script> 
    
    <%-- Purchase --%>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Purchase/ItemPurchasePrice.js") %>"></script>     
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Purchase/Supplier.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Purchase/PurchaseRequest.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Purchase/PurchaseOrder.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Purchase/PurchaseOrderRevision.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Purchase/PurchaseRequestItemPicker.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Purchase/PurchaseRequestSelector.js") %>"></script> 
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Purchase/SupplierCredit.js") %>"></script> 
     <script type="text/javascript" src="<% = Url.Content("~/Scripts/Purchase/PurchaseReport.js") %>"></script>  
   
         <script type="text/javascript" src="<% = Url.Content("~/Scripts/Purchase/SupplierSettlement.js") %>"></script>  
   
    
       <%-- Purchase --%>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Production/Holiday.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Production/Operation.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Production/WorkStation.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Production/BillofMaterial.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Production/BillofMaterialtem.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Production/BillofMaterialOperation.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Production/ProductionOrder.js") %>"></script>
     <script type="text/javascript" src="<% = Url.Content("~/Scripts/Production/ProductionPlan.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Production/ProductionPlanItem.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Production/ProductionPlanOperation.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Production/ProductionJobCard.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Production/ProductionPlanOperationTeam.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Production/productionJobCardStatus.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Production/ProductionDelivery.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Production/ProductionPlanStatus.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Production/ProductionCenter.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Production/ProductionReport.js") %>"></script> 
  <script type="text/javascript" src="<% = Url.Content("~/Scripts/Production/WorkStation.js") %>"></script> 
 
   <%-- Fixed Asset --%>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/FixedAsset/Custodian.js") %>"></script>  
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/FixedAsset/FixedAssetReport.js") %>"></script>     
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/FixedAsset/FixedAssetTransfer.js") %>"></script>     
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/FixedAsset/PurchaseReport.js") %>"></script>
   
     <%-- Sales --%>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Sales/Customer.js") %>"></script>  
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Sales/CustomerCategory.js") %>"></script>  
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Sales/CustomerCredit.js") %>"></script>  
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Sales/DailySales.js") %>"></script>  
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Sales/Settlement.js") %>"></script>  
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Sales/SalesReport.js") %>"></script>  
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Sales/ItemPrice.js") %>"></script>  
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Sales/PriceCategory.js") %>"></script>  
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Sales/SalesArea.js") %>"></script>  
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Sales/Sales.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Sales/SalesItemPicker.js") %>"></script>  
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Sales/Proforma.js") %>"></script>  
 <script type="text/javascript" src="<% = Url.Content("~/Scripts/Sales/ItemBalancePicker.js") %>"></script>  
     <script type="text/javascript" src="<% = Url.Content("~/Scripts/Sales/SalesReport.js") %>"></script>  
      <%-- Sales --%>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Cement/ATCCollection.js") %>"></script>  
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Cement/CementReport.js") %>"></script>  
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Cement/Delivery.js") %>"></script>  
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Cement/DeliverySchedule.js") %>"></script>  
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Cement/FreightOrder.js") %>"></script>  
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Cement/Transportation.js") %>"></script>  

   
             <%--Script Tag to access C# constants from extjs --%>
    <script type="text/javascript" src="<% = Url.Action("ConstantsViewer") %>"></script>
</head>
<body>
    <form id="Form1" runat="server">
    
    </form>
</body>
</html>
