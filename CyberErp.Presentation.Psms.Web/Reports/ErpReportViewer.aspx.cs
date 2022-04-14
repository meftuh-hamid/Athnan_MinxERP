using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Data.SqlClient;
using System.Web.UI.WebControls;
using ReportEngine.Reports;
using CrystalDecisions.Web;
using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Shared;
using CyberErp.Presentation.Psms.Web.Classes;
using CyberErp.Presentation.Psms.Web.Controllers;
using System.Data.EntityClient;
using CyberErp.Data.Model;
using CyberErp.Presentation.Psms.Web.Reports;
using CyberErp.Business.Component.Psms;
using System.Data.Entity;
using CyberErp.Presentation.Psms.Web.Reports.List.Inventory.Bincard;
using CyberErp.Presentation.Psms.Web.Reports.List.Inventory.List;
using CyberErp.Presentation.Psms.Web.Reports.List.Purchase;
using CyberErp.Presentation.Psms.Web.Reports.List.FixedAsset;
using CyberErp.Presentation.Psms.Web.Reports.Voucher;
using CyberErp.Presentation.Psms.Web.Reports.Production;
using CyberErp.Presentation.Psms.Web.Reports.Sales;
using CyberErp.Presentation.Psms.Web.Reports.List.Purchase.Payment;


namespace ReportEngine.Reports
{
    public partial class ErpReportViewer : System.Web.UI.Page
    {
        private CrystalReportSource _source;
        private string _report;
        private ReportDocument repDocument = null;
        private readonly DbContext _context;  
        private readonly BaseModel<psmsSetting> _setting;
        public ErpReportViewer()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _setting = new BaseModel<psmsSetting>(_context);
        }
        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);

            var reportType = Request.QueryString["rt"];
            var voucherTypeId = "";
          
            
            var voucherNo = "";
            var statusId = "";
            var showTotalDetail = false;
            voucherNo = (Request.QueryString["vn"]);
            statusId = (Request.QueryString["sId"]);
            if (Request.QueryString["showTotalDetail"]!=null)
            showTotalDetail =bool.Parse( (Request.QueryString["showTotalDetail"]));
            if (Request.QueryString["voucherTypeId"] != null)
                voucherTypeId = (Request.QueryString["voucherTypeId"]);
           
            string reportPath = string.Empty;

            var signaturePath = "";
            var setting = _setting.Find(o => o.Name == Constants.signature_path);
            if (setting != null)
                signaturePath = setting.Remark;
            var barcodePath = "";
            var path = _setting.Find(o => o.Name == Constants.Path);
            if (path != null)
                barcodePath = path.Remark;
            var licenseInformationSetting = _setting.Find(o => o.Name == Constants.licenseInformation_setting_Name);
            var licenseInformation = licenseInformationSetting != null ? licenseInformationSetting.Remark : "";
            licenseInformation = licenseInformation.Replace("\n", ";");
            

            #region Set Connection Info
            EntityConnectionStringBuilder entityBuilder = new EntityConnectionStringBuilder(Constants.ConnectionString);
            SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder(entityBuilder.ProviderConnectionString);
            ConnectionInfo connectionInfo = new ConnectionInfo();
            connectionInfo.DatabaseName = builder.InitialCatalog;
            connectionInfo.UserID = builder.UserID;
            connectionInfo.Password = builder.Password;
            connectionInfo.ServerName = builder.DataSource;
            connectionInfo.IntegratedSecurity = builder.IntegratedSecurity;
            #endregion
            if (reportType == "PreviewProforma" || voucherTypeId == Constants.Voucher_Type_proforma)
            {
                string itemType = "";
                Guid id = Guid.Empty;
                Guid.TryParse(Request.QueryString["id"], out id);
                if (Request.QueryString["id"] != null && Request.QueryString["id"] != "")
                    itemType = Request.QueryString["itemType"];

                this.repDocument = new rpt_Proforma();
                this.reportViewer.ReportSource = repDocument;
                Tables repTbls = repDocument.Database.Tables;
                this.SetDBLogonForReport(connectionInfo, repTbls);
                this.reportViewer.ReportSource = repDocument;
                reportViewer.Zoom(75);
                repDocument.DataDefinition.FormulaFields["voucherId"].Text = Utility.InQuotation(id.ToString());
                repDocument.DataDefinition.FormulaFields["LicenseInformation"].Text = Utility.InQuotation(licenseInformation.ToString());
                repDocument.DataDefinition.FormulaFields["SignaturePath"].Text = Utility.InQuotation(signaturePath.ToString());

            }
            if (reportType == "PreviewSales" || voucherTypeId == Constants.Voucher_Type_sales)
            {
                Guid id = Guid.Empty;
                Guid.TryParse(Request.QueryString["id"], out id);
                this.repDocument = new rpt_Sales();
                this.reportViewer.ReportSource = repDocument;
                Tables repTbls = repDocument.Database.Tables;
                this.SetDBLogonForReport(connectionInfo, repTbls);
                this.reportViewer.ReportSource = repDocument;
                reportViewer.Zoom(75);
                repDocument.DataDefinition.FormulaFields["voucherId"].Text = Utility.InQuotation(id.ToString());
                repDocument.DataDefinition.FormulaFields["SignaturePath"].Text = Utility.InQuotation(signaturePath.ToString());

            }
            if (reportType == "PreviewGRN" || voucherTypeId==Constants.Voucher_Type_StoreReceive)
            {
                 string itemType = "";
                Guid id = Guid.Empty;
                Guid.TryParse(Request.QueryString["id"], out id);
               
                 this.repDocument = new rpt_Receive();
                this.reportViewer.ReportSource = repDocument;
                Tables repTbls = repDocument.Database.Tables;
                this.SetDBLogonForReport(connectionInfo, repTbls);
                this.reportViewer.ReportSource = repDocument;
                reportViewer.Zoom(75);
                repDocument.DataDefinition.FormulaFields["voucherId"].Text =Utility.InQuotation(id.ToString());
                repDocument.DataDefinition.FormulaFields["ItemType"].Text = Utility.InQuotation(itemType); ;
        
            }
            if (reportType == "PreviewSR" || voucherTypeId == Constants.Voucher_Type_StoreRequisition)
            {
                Guid id = Guid.Empty;
                Guid.TryParse(Request.QueryString["id"], out id);

                this.repDocument = new rpt_GoodsRequest();
                this.reportViewer.ReportSource = repDocument;
                Tables repTbls = repDocument.Database.Tables;
                this.SetDBLogonForReport(connectionInfo, repTbls);
                this.reportViewer.ReportSource = repDocument;
                reportViewer.Zoom(75);
                repDocument.DataDefinition.FormulaFields["voucherId"].Text = Utility.InQuotation(id.ToString()); ;
            }
            else if (reportType == "PreviewIssue" || voucherTypeId == Constants.Voucher_Type_StoreIssue)
            {

                string storeRequestType = "";
                Guid id = Guid.Empty;
                Guid.TryParse(Request.QueryString["id"], out id);
                this.repDocument = new rpt_StoreIssue();
                this.reportViewer.ReportSource = repDocument;
                Tables repTbls = repDocument.Database.Tables;
                this.SetDBLogonForReport(connectionInfo, repTbls);
                this.reportViewer.ReportSource = repDocument;
                reportViewer.Zoom(75);
                repDocument.DataDefinition.FormulaFields["voucherId"].Text = Utility.InQuotation(id.ToString()); ;
 
            }
            else if (reportType == "PreviewTransferIssue" || voucherTypeId == Constants.Voucher_Type_StoreTransferIssue)
            {

                Guid id = Guid.Empty;
                Guid.TryParse(Request.QueryString["id"], out id);
                this.repDocument = new rpt_TransferIssue();
                this.reportViewer.ReportSource = repDocument;
                Tables repTbls = repDocument.Database.Tables;
                this.SetDBLogonForReport(connectionInfo, repTbls);
                this.reportViewer.ReportSource = repDocument;
                reportViewer.Zoom(75);
                repDocument.DataDefinition.FormulaFields["voucherId"].Text = Utility.InQuotation(id.ToString()); ;
      
            }
            else if (reportType == "PreviewTransferReceive" || voucherTypeId == Constants.Voucher_Type_StoreTransferReceive)
            {

                Guid id = Guid.Empty;
                Guid.TryParse(Request.QueryString["id"], out id);

                this.repDocument = new rpt_TransferReceive();
                this.reportViewer.ReportSource = repDocument;
                Tables repTbls = repDocument.Database.Tables;
                this.SetDBLogonForReport(connectionInfo, repTbls);
                this.reportViewer.ReportSource = repDocument;
                reportViewer.Zoom(75);
                repDocument.DataDefinition.FormulaFields["voucherId"].Text = Utility.InQuotation(id.ToString()); ;

            }
            else if (reportType == "PreviewStoreReturn" || voucherTypeId == Constants.Voucher_Type_StoreReturn)
            {

                Guid id = Guid.Empty;
                Guid.TryParse(Request.QueryString["id"], out id);
                this.repDocument = new rpt_StoreReturn();
                this.reportViewer.ReportSource = repDocument;
                Tables repTbls = repDocument.Database.Tables;
                this.SetDBLogonForReport(connectionInfo, repTbls);
                this.reportViewer.ReportSource = repDocument;
                reportViewer.Zoom(75);
                repDocument.DataDefinition.FormulaFields["voucherId"].Text = Utility.InQuotation(id.ToString()); ;

            }
            
            else if (reportType == "PreviewDisposal" || voucherTypeId == Constants.Voucher_Type_StoreDisposal)
            {

                Guid id = Guid.Empty;
                Guid.TryParse(Request.QueryString["id"], out id);
                this.repDocument = new rpt_Disposal();
                this.reportViewer.ReportSource = repDocument;
                Tables repTbls = repDocument.Database.Tables;
                this.SetDBLogonForReport(connectionInfo, repTbls);
                this.reportViewer.ReportSource = repDocument;
                reportViewer.Zoom(75);
                repDocument.DataDefinition.FormulaFields["voucherId"].Text = Utility.InQuotation(id.ToString()); ;

            }
            else if (reportType == "PreviewStoreAdjustment" || voucherTypeId == Constants.Voucher_Type_StoreAdjustment)
            {

                Guid id = Guid.Empty;
                Guid.TryParse(Request.QueryString["id"], out id);
                this.repDocument = new rpt_Adjustment();
                this.reportViewer.ReportSource = repDocument;
                Tables repTbls = repDocument.Database.Tables;
                this.SetDBLogonForReport(connectionInfo, repTbls);
                this.reportViewer.ReportSource = repDocument;
                reportViewer.Zoom(75);
                repDocument.DataDefinition.FormulaFields["voucherId"].Text = Utility.InQuotation(id.ToString()); ;

            }
            else if (reportType == "PreviewFixedAssetTransfer")
            {

                Guid id = Guid.Empty;
                Guid.TryParse(Request.QueryString["id"], out id);
                this.repDocument = new rpt_FixedAssetTransfer();
                this.reportViewer.ReportSource = repDocument;
                Tables repTbls = repDocument.Database.Tables;
                this.SetDBLogonForReport(connectionInfo, repTbls);
                this.reportViewer.ReportSource = repDocument;
                reportViewer.Zoom(75);
                repDocument.DataDefinition.FormulaFields["voucherId"].Text = Utility.InQuotation(id.ToString()); ;

            }
           
            else if (reportType == "PreviewDeliveryOrder" || voucherTypeId == Constants.Voucher_Type_DeliveryOrder)
            {

                Guid id = Guid.Empty;
                Guid.TryParse(Request.QueryString["id"], out id);
                this.repDocument = new rpt_DeliveryOrder();
                this.reportViewer.ReportSource = repDocument;
                Tables repTbls = repDocument.Database.Tables;
                this.SetDBLogonForReport(connectionInfo, repTbls);
                this.reportViewer.ReportSource = repDocument;
                reportViewer.Zoom(75);
                repDocument.DataDefinition.FormulaFields["voucherId"].Text = Utility.InQuotation(id.ToString()); ;

            }

           
          
            else if (reportType == "PreviewItemCode")
            {

                Guid id = Guid.Empty;
                Guid.TryParse(Request.QueryString["id"], out id);
                this.repDocument = new rpt_ItemCode();
                this.reportViewer.ReportSource = repDocument;
                Tables repTbls = repDocument.Database.Tables;
                this.SetDBLogonForReport(connectionInfo, repTbls);
                this.reportViewer.ReportSource = repDocument;
                this.repDocument.PrintOptions.DissociatePageSizeAndPrinterPaperSize = true;
                this.repDocument.PrintOptions.PaperOrientation = PaperOrientation.Portrait;
                 reportViewer.Zoom(75);
                repDocument.DataDefinition.FormulaFields["ItemId"].Text = Utility.InQuotation(id.ToString()); ;


            }
            else if (reportType == "PreviewPurchaseRequest" || voucherTypeId == Constants.Voucher_Type_PurchaseRequest)
            {

                Guid id = Guid.Empty;
                Guid.TryParse(Request.QueryString["id"], out id);

                this.repDocument = new rpt_PurchaseRequest();
                this.reportViewer.ReportSource = repDocument;
                Tables repTbls = repDocument.Database.Tables;
                this.SetDBLogonForReport(connectionInfo, repTbls);
                this.reportViewer.ReportSource = repDocument;
                reportViewer.Zoom(75);
                repDocument.DataDefinition.FormulaFields["voucherId"].Text = Utility.InQuotation(id.ToString());
                repDocument.DataDefinition.FormulaFields["SignaturePath"].Text = Utility.InQuotation(signaturePath.ToString());
      

            }

            else if (reportType == "PreviewPurchaseOrder" || voucherTypeId == Constants.Voucher_Type_PurchaseOrder)
            {

                Guid id = Guid.Empty;
                Guid.TryParse(Request.QueryString["id"], out id);
                this.repDocument = new rpt_PurchaseOrder();
                this.reportViewer.ReportSource = repDocument;
                Tables repTbls = repDocument.Database.Tables;
                this.SetDBLogonForReport(connectionInfo, repTbls);
                this.reportViewer.ReportSource = repDocument;
                reportViewer.Zoom(75);
                repDocument.DataDefinition.FormulaFields["voucherId"].Text = Utility.InQuotation(id.ToString());
                repDocument.DataDefinition.FormulaFields["SignaturePath"].Text = Utility.InQuotation(signaturePath.ToString());                        
            }


            if (reportType == "PreviewProductionOrder")
            {

                Guid id = Guid.Empty;
                Guid.TryParse(Request.QueryString["id"], out id);

                this.repDocument = new rpt_ProductionOrder();
                this.reportViewer.ReportSource = repDocument;
                Tables repTbls = repDocument.Database.Tables;
                this.SetDBLogonForReport(connectionInfo, repTbls);
                this.reportViewer.ReportSource = repDocument;
                reportViewer.Zoom(75);
                repDocument.DataDefinition.FormulaFields["voucherId"].Text = Utility.InQuotation(id.ToString()); ;

            }
            if (reportType == "PreviewProductionPlan")
            {

                Guid id = Guid.Empty;
                Guid.TryParse(Request.QueryString["id"], out id);

                this.repDocument = new rpt_ProductionPlan();
                this.reportViewer.ReportSource = repDocument;
                Tables repTbls = repDocument.Database.Tables;
                this.SetDBLogonForReport(connectionInfo, repTbls);
                this.reportViewer.ReportSource = repDocument;
                reportViewer.Zoom(75);
                repDocument.DataDefinition.FormulaFields["voucherId"].Text = Utility.InQuotation(id.ToString()); ;

            }
            if (reportType == "PreviewBillofMaterial")
            {

                Guid id = Guid.Empty;
                Guid.TryParse(Request.QueryString["id"], out id);

                this.repDocument = new rpt_BillofMaterial();
                this.reportViewer.ReportSource = repDocument;
                Tables repTbls = repDocument.Database.Tables;
                this.SetDBLogonForReport(connectionInfo, repTbls);
                this.reportViewer.ReportSource = repDocument;
                reportViewer.Zoom(75);
                repDocument.DataDefinition.FormulaFields["voucherId"].Text = Utility.InQuotation(id.ToString()); ;

            }

            if (reportType == "PreviewJobCard")
            {

                Guid id = Guid.Empty;
                Guid.TryParse(Request.QueryString["id"], out id);

                this.repDocument = new rpt_ProductionPlanJobCard();
                this.reportViewer.ReportSource = repDocument;
                Tables repTbls = repDocument.Database.Tables;
                this.SetDBLogonForReport(connectionInfo, repTbls);
                this.reportViewer.ReportSource = repDocument;
                reportViewer.Zoom(75);
                repDocument.DataDefinition.FormulaFields["voucherId"].Text = Utility.InQuotation(id.ToString()); ;
                repDocument.DataDefinition.FormulaFields["Path"].Text = Utility.InQuotation(barcodePath.ToString());

            }
            else if (reportType == "FixedAsset")
            {
                FixedAssetReport reportParams = (FixedAssetReport)Session["FixedAssetReportParams"];
                if (reportParams != null && reportParams.ReportName != null)
                {
                    if (reportParams.ReportName == "FixedAssetList")
                    {
                        this.repDocument = new  rpt_FixedAssetList();
                        Tables repTbls = repDocument.Database.Tables;
                        this.SetDBLogonForReport(connectionInfo, repTbls);
                        this.reportViewer.ReportSource = repDocument;

                        repDocument.DataDefinition.FormulaFields["StoreId"].Text =reportParams.StoreId!=Guid.Empty? Utility.InQuotation(reportParams.StoreId.ToString()):Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["EmployeeId"].Text = reportParams.EmployeeId !=Guid.Empty ? Utility.InQuotation(reportParams.EmployeeId.ToString()) : Utility.InQuotation("");
              
                    }
                    else if (reportParams.ReportName == "FixedAssetListByItem")
                    {
                        this.repDocument = new rpt_FixedAssetListByItem ();
                        Tables repTbls = repDocument.Database.Tables;
                        this.SetDBLogonForReport(connectionInfo, repTbls);
                        this.reportViewer.ReportSource = repDocument;

                        repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId !=Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["EmployeeId"].Text = reportParams.EmployeeId !=Guid.Empty ? Utility.InQuotation(reportParams.EmployeeId.ToString()) : Utility.InQuotation("");
              
                    }
                    else if (reportParams.ReportName == "FixedAssetListByItemCustodian")
                    {
                        this.repDocument = new rpt_FixedAssetListByItemCustodian();
                        Tables repTbls = repDocument.Database.Tables;
                        this.SetDBLogonForReport(connectionInfo, repTbls);
                        this.reportViewer.ReportSource = repDocument;

                        repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId !=Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["EmployeeId"].Text = reportParams.EmployeeId !=Guid.Empty ? Utility.InQuotation(reportParams.EmployeeId.ToString()) : Utility.InQuotation("");
              
                    }
                    else if (reportParams.ReportName == "FixedAssetTransfer")
                    {
                        this.repDocument = new rpt_FixedAssetTransferList();
                        Tables repTbls = repDocument.Database.Tables;
                        this.SetDBLogonForReport(connectionInfo, repTbls);
                        this.reportViewer.ReportSource = repDocument;

                        repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId !=Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["EmployeeId"].Text = reportParams.EmployeeId !=Guid.Empty ? Utility.InQuotation(reportParams.EmployeeId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["FromDate"].Text = reportParams.StartDate.HasValue ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["ToDate"].Text = reportParams.EndDate.HasValue ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");

                    }
                 
                   
                }
            }
            else if (reportType == "Item")
            {
                BincardReport reportParams = (BincardReport)Session["BincardReportParams"];
                if (reportParams != null && reportParams.ReportName != null)
                {
                   if (reportParams.ReportName == "ItemList")
                    {
                        this.repDocument = new rpt_Item();
                        Tables repTbls = repDocument.Database.Tables;
                        this.SetDBLogonForReport(connectionInfo, repTbls);
                        this.reportViewer.ReportSource = repDocument;

                        repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["IsActive"].Text = Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId != Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");

                    }
                   else if (reportParams.ReportName == "ActiveItem")
                   {
                       this.repDocument = new rpt_Item();
                       Tables repTbls = repDocument.Database.Tables;
                       this.SetDBLogonForReport(connectionInfo, repTbls);
                       this.reportViewer.ReportSource = repDocument;

                       repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");
                       repDocument.DataDefinition.FormulaFields["IsActive"].Text = Utility.InQuotation("1");
                       repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId != Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");

                   }
                   else if (reportParams.ReportName == "InActiveItem")
                    {
                        this.repDocument = new rpt_Item();
                        Tables repTbls = repDocument.Database.Tables;
                        this.SetDBLogonForReport(connectionInfo, repTbls);
                        this.reportViewer.ReportSource = repDocument;

                        repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["IsActive"].Text = Utility.InQuotation("0");
                        repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId != Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");

                    }
                    else if (reportParams.ReportName == "Begining")
                    {
                        this.repDocument = new rpt_BincardBegining();
                        Tables repTbls = repDocument.Database.Tables;
                        this.SetDBLogonForReport(connectionInfo, repTbls);
                        this.reportViewer.ReportSource = repDocument;

                        repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["FiscalYearId"].Text = reportParams.FiscalYearId != Guid.Empty ? Utility.InQuotation(reportParams.FiscalYearId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId != Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");

                    }
                   
                    else if (reportParams.ReportName == "InventoryClosing")
                    {
                        this.repDocument = new rpt_InventoryClosing();
                        Tables repTbls = repDocument.Database.Tables;
                        this.SetDBLogonForReport(connectionInfo, repTbls);
                        this.reportViewer.ReportSource = repDocument;

                        repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["FiscalYear"].Text = reportParams.FiscalYear != null ? Utility.InQuotation(reportParams.FiscalYear.ToString()) : Utility.InQuotation("");


                        repDocument.DataDefinition.FormulaFields["FiscalYearId"].Text = reportParams.FiscalYearId != Guid.Empty ? Utility.InQuotation(reportParams.FiscalYearId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");

                    }
                    else if (reportParams.ReportName == "InventoryReOrder")
                    {
                        this.repDocument = new rpt_InventoryReOrder();
                        Tables repTbls = repDocument.Database.Tables;
                        this.SetDBLogonForReport(connectionInfo, repTbls);
                        this.reportViewer.ReportSource = repDocument;

                        repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["FiscalYear"].Text = reportParams.FiscalYear != null ? Utility.InQuotation(reportParams.FiscalYear.ToString()) : Utility.InQuotation("");


                        repDocument.DataDefinition.FormulaFields["FiscalYearId"].Text = reportParams.FiscalYearId != Guid.Empty ? Utility.InQuotation(reportParams.FiscalYearId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");

                    }
                    else if (reportParams.ReportName == "ItemClass")
                    {
                        this.repDocument = new rpt_ItemClass();
                        Tables repTbls = repDocument.Database.Tables;
                        this.SetDBLogonForReport(connectionInfo, repTbls);
                        this.reportViewer.ReportSource = repDocument;

                        repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");

                    }

                }
            }
            else if (reportType == "Bincard")
            {
                BincardReport reportParams = (BincardReport)Session["BincardReportParams"];
                if (reportParams != null && reportParams.ReportName != null)
                {
                    if (reportParams.ReportName == "Bincard")
                    {
                        this.repDocument = new rpt_Bincard();
                        Tables repTbls = repDocument.Database.Tables;
                        this.SetDBLogonForReport(connectionInfo, repTbls);
                        this.reportViewer.ReportSource = repDocument;

                        repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId !=Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["FiscalYearId"].Text = reportParams.FiscalYearId !=Guid.Empty ? Utility.InQuotation(reportParams.FiscalYearId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");                
                    }
             
                    else  if (reportParams.ReportName == "BincardList")
                    {
                        this.repDocument = new rpt_BincardList();
                        Tables repTbls = repDocument.Database.Tables;
                        this.SetDBLogonForReport(connectionInfo, repTbls);
                        this.reportViewer.ReportSource = repDocument;

                        repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId !=Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["FiscalYearId"].Text = reportParams.FiscalYearId !=Guid.Empty ? Utility.InQuotation(reportParams.FiscalYearId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate.HasValue ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate.HasValue ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");

                    }
                    else if (reportParams.ReportName == "Stockcard")
                    {
                        this.repDocument = new rpt_StockCard();
                        Tables repTbls = repDocument.Database.Tables;
                        this.SetDBLogonForReport(connectionInfo, repTbls);
                        this.reportViewer.ReportSource = repDocument;

                        repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId !=Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["FiscalYearId"].Text = reportParams.FiscalYearId !=Guid.Empty ? Utility.InQuotation(reportParams.FiscalYearId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");                
         
                    }
                    else if (reportParams.ReportName == "Begining")
                    {
                        this.repDocument = new rpt_BincardBegining();
                        Tables repTbls = repDocument.Database.Tables;
                        this.SetDBLogonForReport(connectionInfo, repTbls);
                        this.reportViewer.ReportSource = repDocument;

                        repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId !=Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["FiscalYearId"].Text = reportParams.FiscalYearId !=Guid.Empty ? Utility.InQuotation(reportParams.FiscalYearId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");                
         
                    }
                    else if (reportParams.ReportName == "Inventory")
                    {
                        this.repDocument = new rpt_Inventory ();
                        Tables repTbls = repDocument.Database.Tables;
                        this.SetDBLogonForReport(connectionInfo, repTbls);
                        this.reportViewer.ReportSource = repDocument;

                        repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId !=Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");

                        repDocument.DataDefinition.FormulaFields["FiscalYearId"].Text = reportParams.FiscalYearId !=Guid.Empty ? Utility.InQuotation(reportParams.FiscalYearId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["FiscalYear"].Text = reportParams.FiscalYear != null ? Utility.InQuotation(reportParams.FiscalYear.ToString()) : Utility.InQuotation("");
                 
                        repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");

                    }
                    else if (reportParams.ReportName == "InventoryByStore")
                    {
                        this.repDocument = new rpt_InventoryByStore();
                        Tables repTbls = repDocument.Database.Tables;
                        this.SetDBLogonForReport(connectionInfo, repTbls);
                        this.reportViewer.ReportSource = repDocument;

                        repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");

                        repDocument.DataDefinition.FormulaFields["FiscalYearId"].Text = reportParams.FiscalYearId != Guid.Empty ? Utility.InQuotation(reportParams.FiscalYearId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["FiscalYear"].Text = reportParams.FiscalYear != null ? Utility.InQuotation(reportParams.FiscalYear.ToString()) : Utility.InQuotation("");

                        repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");

                    }
                    
                    else if (reportParams.ReportName == "InventoryCounting")
                    {
                        this.repDocument = new rpt_InventoryCounting();
                        Tables repTbls = repDocument.Database.Tables;
                        this.SetDBLogonForReport(connectionInfo, repTbls);
                        this.reportViewer.ReportSource = repDocument;

                        repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId !=Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["FiscalYear"].Text = reportParams.FiscalYear != null ? Utility.InQuotation(reportParams.FiscalYear.ToString()) : Utility.InQuotation("");
                 
               
                        repDocument.DataDefinition.FormulaFields["FiscalYearId"].Text = reportParams.FiscalYearId !=Guid.Empty ? Utility.InQuotation(reportParams.FiscalYearId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");
                    
                    }
                    else if (reportParams.ReportName == "InventoryClosing")
                    {
                        this.repDocument = new rpt_InventoryClosing();
                        Tables repTbls = repDocument.Database.Tables;
                        this.SetDBLogonForReport(connectionInfo, repTbls);
                        this.reportViewer.ReportSource = repDocument;

                        repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["FiscalYear"].Text = reportParams.FiscalYear != null ? Utility.InQuotation(reportParams.FiscalYear.ToString()) : Utility.InQuotation("");


                        repDocument.DataDefinition.FormulaFields["FiscalYearId"].Text = reportParams.FiscalYearId != Guid.Empty ? Utility.InQuotation(reportParams.FiscalYearId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate.HasValue ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate.HasValue ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");

                    }
                    else if (reportParams.ReportName == "InventoryReOrder")
                    {
                        this.repDocument = new rpt_InventoryReOrder();
                        Tables repTbls = repDocument.Database.Tables;
                        this.SetDBLogonForReport(connectionInfo, repTbls);
                        this.reportViewer.ReportSource = repDocument;

                        repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId !=Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["FiscalYear"].Text = reportParams.FiscalYear != null ? Utility.InQuotation(reportParams.FiscalYear.ToString()) : Utility.InQuotation("");
                 
               
                        repDocument.DataDefinition.FormulaFields["FiscalYearId"].Text = reportParams.FiscalYearId !=Guid.Empty ? Utility.InQuotation(reportParams.FiscalYearId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");

                    }
                    else if (reportParams.ReportName == "ItemClass")
                    {
                        this.repDocument = new rpt_ItemClass();
                        Tables repTbls = repDocument.Database.Tables;
                        this.SetDBLogonForReport(connectionInfo, repTbls);
                        this.reportViewer.ReportSource = repDocument;

                           repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");

                    }

                }
            }
            else if (reportType == "Transaction")
            {
                BincardReport reportParams = (BincardReport)Session["BincardReportParams"];

                if (reportParams.ReportName == "Store Requisition")
                {
                    this.repDocument = new rpt_GoodsRequestList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");               
                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId !=Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != "" && reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId !=Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");

                }
                else if (reportParams.ReportName == "Store Issue")
                {
                    this.repDocument = new rpt_IssueList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");               
                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId !=Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != "" && reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId !=Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");

                }
                else if (reportParams.ReportName == "Transfer Issue")
                {
                    this.repDocument = new rpt_TransferIssueList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");               
                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId !=Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != "" && reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId !=Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");

                }
                else if (reportParams.ReportName == "Transfer Receive")
                {
                    this.repDocument = new rpt_TransferReceiveList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId !=Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != "" && reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId !=Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");

                }
                else if (reportParams.ReportName == "Receive")
                {
                    this.repDocument = new rpt_ReceiveList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId !=Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != "" && reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId !=Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");

                }
                else if (reportParams.ReportName == "Return")
                {
                    this.repDocument = new rpt_ReturnList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId !=Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != "" && reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId !=Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");

                }
                else if (reportParams.ReportName == "Adjustment")
                {
                    this.repDocument = new rpt_AdjustmentList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId !=Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != "" && reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId !=Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");

                }
                else if (reportParams.ReportName == "Delivery Order")
                {
                    this.repDocument = new rpt_DeliveryOrderList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != "" && reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");

                }
               
                else if (reportParams.ReportName == "Disposal")
                {
                    this.repDocument = new rpt_DisposalList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");
                   // repDocument.DataDefinition.FormulaFields["ItemName"].Text = reportParams.ItemName != null ? Utility.InQuotation(reportParams.ItemName.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId !=Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != "" && reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId !=Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");

                }
               
               

               
               


            }
            else if (reportType == "StockSummary")
            {
                BincardReport reportParams = (BincardReport)Session["BincardReportParams"];
              
               
                 if (reportParams.ReportName == "Transaction")
                {
                    this.repDocument = new rpt_Transaction();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemType"].Text = Utility.InQuotation(reportParams.ItemType);
                    this.repDocument.SetParameterValue("@StoreId", reportParams.StoreId.ToString());
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId !=Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
             

                    this.repDocument.SetParameterValue("@StartDate", reportParams.StartDate);
                    this.repDocument.SetParameterValue("@endDate", reportParams.EndDate);
                }
                 else  if (reportParams.ReportName == "ObsoleteStock")
                 {
                     this.repDocument = new rpt_ObSoleteStock();
                     Tables repTbls = repDocument.Database.Tables;
                     this.SetDBLogonForReport(connectionInfo, repTbls);
                     this.reportViewer.ReportSource = repDocument;

                     repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                     repDocument.DataDefinition.FormulaFields["ItemType"].Text = Utility.InQuotation(reportParams.ItemType);
                     this.repDocument.SetParameterValue("@StoreId", reportParams.StoreId.ToString());
                     repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");
                     repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                     repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");

                     this.repDocument.SetParameterValue("@StartDate", reportParams.StartDate);
                     this.repDocument.SetParameterValue("@endDate", reportParams.EndDate);
                 }
               
                else if (reportParams.ReportName == "StockMovement")
                {
                    this.repDocument = new rpt_StockMovement();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;
                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");

                   
                    this.repDocument.SetParameterValue("@StoreId", reportParams.StoreId.ToString());
                    this.repDocument.SetParameterValue("@StartDate", reportParams.StartDate);
                    this.repDocument.SetParameterValue("@endDate", reportParams.EndDate);
                }
                 else if (reportParams.ReportName == "StockMovementBySubCategory")
                 {
                     this.repDocument = new rpt_StockMovement();
                     Tables repTbls = repDocument.Database.Tables;
                     this.SetDBLogonForReport(connectionInfo, repTbls);
                     this.reportViewer.ReportSource = repDocument;
                     repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                     repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                     repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                     repDocument.DataDefinition.FormulaFields["IsBySubCategory"].Text = Utility.InQuotation("true");
                     repDocument.DataDefinition.FormulaFields["IsByCategory"].Text = Utility.InQuotation("");

                   
                     this.repDocument.SetParameterValue("@StoreId", reportParams.StoreId.ToString());
                     this.repDocument.SetParameterValue("@StartDate", reportParams.StartDate);
                     this.repDocument.SetParameterValue("@endDate", reportParams.EndDate);
                 }
                 else if (reportParams.ReportName == "StockMovementByCategory")
                 {
                     this.repDocument = new rpt_StockMovement();
                     Tables repTbls = repDocument.Database.Tables;
                     this.SetDBLogonForReport(connectionInfo, repTbls);
                     this.reportViewer.ReportSource = repDocument;
                     repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                     repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                     repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                     repDocument.DataDefinition.FormulaFields["IsByCategory"].Text = Utility.InQuotation("true");

                     this.repDocument.SetParameterValue("@StoreId", reportParams.StoreId.ToString());
                     this.repDocument.SetParameterValue("@StartDate", reportParams.StartDate);
                     this.repDocument.SetParameterValue("@endDate", reportParams.EndDate);
                 }
                else if (reportParams.ReportName == "StockStatus")
                {
                    this.repDocument = new rpt_StockStatus();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.Value.ToShortDateString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.Value.ToShortDateString()) : Utility.InQuotation("");

                   
                    this.repDocument.SetParameterValue("@StoreId", reportParams.StoreId.ToString());
                    this.repDocument.SetParameterValue("@StartDate", reportParams.StartDate);
                    this.repDocument.SetParameterValue("@endDate", reportParams.EndDate);
          
                }
                 else if (reportParams.ReportName == "StockEvaluation")
                 {
                     this.repDocument = new rpt_StockEvaluation();
                     Tables repTbls = repDocument.Database.Tables;
                     this.SetDBLogonForReport(connectionInfo, repTbls);
                     this.reportViewer.ReportSource = repDocument;

                     repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                     repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.Value.ToShortDateString()) : Utility.InQuotation("");
                     repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.Value.ToShortDateString()) : Utility.InQuotation("");


                     this.repDocument.SetParameterValue("@StoreId", reportParams.StoreId.ToString());
                     this.repDocument.SetParameterValue("@StartDate", reportParams.StartDate);
                     this.repDocument.SetParameterValue("@endDate", reportParams.EndDate);

                 }
            }

            else if (reportType == "Purchase")
            {
                BincardReport reportParams = (BincardReport)Session["BincardReportParams"];

                if (reportParams.ReportName == "Purchase Request")
                {
                    this.repDocument = new rpt_PurchaseRequestList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");


                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != "" ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ReferenceNo"].Text = reportParams.ReferenceNo != null ? Utility.InQuotation(reportParams.ReferenceNo.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemTypeId"].Text = reportParams.ItemTypeId != Guid.Empty? Utility.InQuotation(reportParams.ItemTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId != Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ConsumerTypeId"].Text = reportParams.ConsumerTypeId != Guid.Empty ? Utility.InQuotation(reportParams.ConsumerTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ConsumerName"].Text = reportParams.Consumer != null ? Utility.InQuotation(reportParams.Consumer.ToString()) : Utility.InQuotation("");

                }
                if (reportParams.ReportName == "Purchase Order")
                {
                    this.repDocument = new rpt_PurchaseOrderList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");


                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ReferenceNo"].Text = reportParams.ReferenceNo != null ? Utility.InQuotation(reportParams.ReferenceNo.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemTypeId"].Text = reportParams.ItemTypeId != Guid.Empty ? Utility.InQuotation(reportParams.ItemTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId != Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SupplierId"].Text = reportParams.SupplierId != Guid.Empty && reportParams.SupplierId != null ? Utility.InQuotation(reportParams.SupplierId.ToString()) : Utility.InQuotation("");

                }

              
                if (reportParams.ReportName == "Outstanding Purchase Order")
                {
                    this.repDocument = new rpt_PurchaseOrderOutStandingList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");


                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ReferenceNo"].Text = reportParams.ReferenceNo != null ? Utility.InQuotation(reportParams.ReferenceNo.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemTypeId"].Text = reportParams.ItemTypeId != Guid.Empty ? Utility.InQuotation(reportParams.ItemTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId != Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SupplierId"].Text = reportParams.SupplierId != Guid.Empty && reportParams.SupplierId != null ? Utility.InQuotation(reportParams.SupplierId.ToString()) : Utility.InQuotation("");

                }

                if (reportParams.ReportName == "Delivery")
                {
                    this.repDocument = new rpt_Delivery();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");


                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                   
                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemTypeId"].Text = reportParams.ItemTypeId != Guid.Empty ? Utility.InQuotation(reportParams.ItemTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId != Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SupplierId"].Text = reportParams.SupplierId != Guid.Empty && reportParams.SupplierId != null ? Utility.InQuotation(reportParams.SupplierId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerId"].Text = reportParams.CustomerId != Guid.Empty && reportParams.CustomerId != null ? Utility.InQuotation(reportParams.CustomerId.ToString()) : Utility.InQuotation("");

                }
                if (reportParams.ReportName == "Delivery By Customer")
                {
                    this.repDocument = new rpt_DeliveryByCustomer();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");


                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemTypeId"].Text = reportParams.ItemTypeId != Guid.Empty ? Utility.InQuotation(reportParams.ItemTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId != Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SupplierId"].Text = reportParams.SupplierId != Guid.Empty && reportParams.SupplierId != null ? Utility.InQuotation(reportParams.SupplierId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerId"].Text = reportParams.CustomerId != Guid.Empty && reportParams.CustomerId != null ? Utility.InQuotation(reportParams.CustomerId.ToString()) : Utility.InQuotation("");

                }
                if (reportParams.ReportName == "Customer outstanding")
                {
                    this.repDocument = new rpt_SalesWithDelivery();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");


                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemTypeId"].Text = reportParams.ItemTypeId != Guid.Empty ? Utility.InQuotation(reportParams.ItemTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId != Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SupplierId"].Text = reportParams.SupplierId != Guid.Empty && reportParams.SupplierId != null ? Utility.InQuotation(reportParams.SupplierId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerId"].Text = reportParams.CustomerId != Guid.Empty && reportParams.CustomerId != null ? Utility.InQuotation(reportParams.CustomerId.ToString()) : Utility.InQuotation("");

                }
                if (reportParams.ReportName == "Freight Order")
                {
                    this.repDocument = new rpt_FreightOrder();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");


                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ReferenceNo"].Text = reportParams.ReferenceNo != null ? Utility.InQuotation(reportParams.ReferenceNo.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemTypeId"].Text = reportParams.ItemTypeId != Guid.Empty ? Utility.InQuotation(reportParams.ItemTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId != Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SupplierId"].Text = reportParams.SupplierId != Guid.Empty && reportParams.SupplierId != null ? Utility.InQuotation(reportParams.SupplierId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerId"].Text = reportParams.CustomerId != Guid.Empty && reportParams.CustomerId != null ? Utility.InQuotation(reportParams.CustomerId.ToString()) : Utility.InQuotation("");
                
                }
                if (reportParams.ReportName == "Purchased ATC")
                {
                    this.repDocument = new rpt_PurchaseOrderByATC();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");


                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ReferenceNo"].Text = reportParams.ReferenceNo != null ? Utility.InQuotation(reportParams.ReferenceNo.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemTypeId"].Text = reportParams.ItemTypeId != Guid.Empty ? Utility.InQuotation(reportParams.ItemTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId != Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SupplierId"].Text = reportParams.SupplierId != Guid.Empty && reportParams.SupplierId != null ? Utility.InQuotation(reportParams.SupplierId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerId"].Text = reportParams.CustomerId != Guid.Empty && reportParams.CustomerId != null ? Utility.InQuotation(reportParams.CustomerId.ToString()) : Utility.InQuotation("");
                
                }
                if (reportParams.ReportName == "Purchased ATC outstanding")
                {
                    this.repDocument = new rpt_PurchaseOrderByATCOutStanding();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");


                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ReferenceNo"].Text = reportParams.ReferenceNo != null ? Utility.InQuotation(reportParams.ReferenceNo.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemTypeId"].Text = reportParams.ItemTypeId != Guid.Empty ? Utility.InQuotation(reportParams.ItemTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId != Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SupplierId"].Text = reportParams.SupplierId != Guid.Empty && reportParams.SupplierId != null ? Utility.InQuotation(reportParams.SupplierId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerId"].Text = reportParams.CustomerId != Guid.Empty && reportParams.CustomerId != null ? Utility.InQuotation(reportParams.CustomerId.ToString()) : Utility.InQuotation("");
                
                }
                if (reportParams.ReportName == "Shipment")
                {
                    this.repDocument = new rpt_Shipment();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");


                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ReferenceNo"].Text = reportParams.ReferenceNo != null ? Utility.InQuotation(reportParams.ReferenceNo.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemTypeId"].Text = reportParams.ItemTypeId != Guid.Empty ? Utility.InQuotation(reportParams.ItemTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId != Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SupplierId"].Text = reportParams.SupplierId != Guid.Empty && reportParams.SupplierId != null ? Utility.InQuotation(reportParams.SupplierId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerId"].Text = reportParams.CustomerId != Guid.Empty && reportParams.CustomerId != null ? Utility.InQuotation(reportParams.CustomerId.ToString()) : Utility.InQuotation("");
                
                }

                if (reportParams.ReportName == "Transportation")
                {
                    this.repDocument = new rpt_Transportation();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");


                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ReferenceNo"].Text = reportParams.ReferenceNo != null ? Utility.InQuotation(reportParams.ReferenceNo.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemTypeId"].Text = reportParams.ItemTypeId != Guid.Empty ? Utility.InQuotation(reportParams.ItemTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId != Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SupplierId"].Text = reportParams.SupplierId != Guid.Empty && reportParams.SupplierId != null ? Utility.InQuotation(reportParams.SupplierId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerId"].Text = reportParams.CustomerId != Guid.Empty && reportParams.CustomerId != null ? Utility.InQuotation(reportParams.CustomerId.ToString()) : Utility.InQuotation("");

                }
                if (reportParams.ReportName == "Transportation By Customer")
                {
                    this.repDocument = new rpt_TransportationByCustomer();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");


                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ReferenceNo"].Text = reportParams.ReferenceNo != null ? Utility.InQuotation(reportParams.ReferenceNo.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemTypeId"].Text = reportParams.ItemTypeId != Guid.Empty ? Utility.InQuotation(reportParams.ItemTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId != Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SupplierId"].Text = reportParams.SupplierId != Guid.Empty && reportParams.SupplierId != null ? Utility.InQuotation(reportParams.SupplierId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerId"].Text = reportParams.CustomerId != Guid.Empty && reportParams.CustomerId != null ? Utility.InQuotation(reportParams.CustomerId.ToString()) : Utility.InQuotation("");

                }
                if (reportParams.ReportName == "Transportation By Driver")
                {
                    this.repDocument = new rpt_TransportationByDriver();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");


                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ReferenceNo"].Text = reportParams.ReferenceNo != null ? Utility.InQuotation(reportParams.ReferenceNo.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemTypeId"].Text = reportParams.ItemTypeId != Guid.Empty ? Utility.InQuotation(reportParams.ItemTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId != Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SupplierId"].Text = reportParams.SupplierId != Guid.Empty && reportParams.SupplierId != null ? Utility.InQuotation(reportParams.SupplierId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerId"].Text = reportParams.CustomerId != Guid.Empty && reportParams.CustomerId != null ? Utility.InQuotation(reportParams.CustomerId.ToString()) : Utility.InQuotation("");

                }
                if (reportParams.ReportName == "Transportation By PlateNo")
                {
                    this.repDocument = new rpt_TransportationByPlateNo();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");


                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ReferenceNo"].Text = reportParams.ReferenceNo != null ? Utility.InQuotation(reportParams.ReferenceNo.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemTypeId"].Text = reportParams.ItemTypeId != Guid.Empty ? Utility.InQuotation(reportParams.ItemTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId != Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SupplierId"].Text = reportParams.SupplierId != Guid.Empty && reportParams.SupplierId != null ? Utility.InQuotation(reportParams.SupplierId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerId"].Text = reportParams.CustomerId != Guid.Empty && reportParams.CustomerId != null ? Utility.InQuotation(reportParams.CustomerId.ToString()) : Utility.InQuotation("");

                }

                if (reportParams.ReportName == "Purchase Order By Amount")
                {
                    this.repDocument = new rpt_PurchaseOrderByAmountList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["Store"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");


                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["Store"].Text = reportParams.Store != null ? Utility.InQuotation(reportParams.Store.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ReferenceNo"].Text = reportParams.ReferenceNo != null ? Utility.InQuotation(reportParams.ReferenceNo.ToString()) : Utility.InQuotation("");

                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemTypeId"].Text = reportParams.ItemTypeId != Guid.Empty ? Utility.InQuotation(reportParams.ItemTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId != Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SupplierId"].Text = reportParams.SupplierId != Guid.Empty && reportParams.SupplierId != null ? Utility.InQuotation(reportParams.SupplierId.ToString()) : Utility.InQuotation("");

                }
          
       
          
                
                else if (reportParams.ReportName == "Supplier List")
                {
                    this.repDocument = new rpt_SupplierList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                  
                }
              
                if (reportParams.ReportName == "Payment")
                {
                    this.repDocument = new rpt_PaymentList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SupplierId"].Text = reportParams.SupplierId != Guid.Empty && reportParams.SupplierId != null ? Utility.InQuotation(reportParams.SupplierId.ToString()) : Utility.InQuotation("");

                }
                if (reportParams.ReportName == "Supplier Settlement")
                {
                    this.repDocument = new rpt_SupplierSettlementList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SupplierId"].Text = reportParams.SupplierId != Guid.Empty && reportParams.SupplierId != null ? Utility.InQuotation(reportParams.SupplierId.ToString()) : Utility.InQuotation("");

                }
                if (reportParams.ReportName == "Supplier Ledger")
                {
                    this.repDocument = new rpt_SupplierLedgerList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SupplierId"].Text = reportParams.SupplierId != Guid.Empty && reportParams.SupplierId != null ? Utility.InQuotation(reportParams.SupplierId.ToString()) : Utility.InQuotation("");
                    this.repDocument.SetParameterValue("@StartDate", reportParams.StartDate);
                    this.repDocument.SetParameterValue("@endDate", reportParams.EndDate);

                }
                if (reportParams.ReportName == "Supplier Balance")
                {
                    this.repDocument = new rpt_SupplierLedgerBalanceList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SupplierId"].Text = reportParams.SupplierId != Guid.Empty && reportParams.SupplierId != null ? Utility.InQuotation(reportParams.SupplierId.ToString()) : Utility.InQuotation("");
                    this.repDocument.SetParameterValue("@StartDate", reportParams.StartDate);
                    this.repDocument.SetParameterValue("@endDate", reportParams.EndDate);

                }
                if (reportParams.ReportName == "Supplier Aging")
                {
                    this.repDocument = new rpt_SupplierCreditAgingList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SupplierId"].Text = reportParams.SupplierId != Guid.Empty && reportParams.SupplierId != null ? Utility.InQuotation(reportParams.SupplierId.ToString()) : Utility.InQuotation("");

                }
            }

            else if (reportType == "ProductionStatus")
            {
                ProductionReport reportParams = (ProductionReport)Session["ProductionReportParams"];
                if (reportParams != null && reportParams.ReportName != null)
                {
                    if (reportParams.ReportName == "ProductionStatus")
                    {
                        this.repDocument = new rptProductionOrderDeliveryStatus();
                        Tables repTbls = repDocument.Database.Tables;
                        this.SetDBLogonForReport(connectionInfo, repTbls);
                        this.reportViewer.ReportSource = repDocument;
                        repDocument.DataDefinition.FormulaFields["StartDateParam"].Text = Utility.InQuotation(reportParams.StartDate.ToString());
                        repDocument.DataDefinition.FormulaFields["EndDateParam"].Text = Utility.InQuotation(reportParams.EndDate.ToString());


                    }
                }
                if (reportParams != null && reportParams.ReportName != null)
                {
                    if (reportParams.ReportName == "Production Full Status")
                    {
                        this.repDocument = new rptProductionOrderDeliveryFullStatus();
                        Tables repTbls = repDocument.Database.Tables;
                        this.SetDBLogonForReport(connectionInfo, repTbls);
                        this.reportViewer.ReportSource = repDocument;
                        repDocument.DataDefinition.FormulaFields["StartDateParam"].Text = Utility.InQuotation(reportParams.StartDate.ToString());
                        repDocument.DataDefinition.FormulaFields["EndDateParam"].Text = Utility.InQuotation(reportParams.EndDate.ToString());
                    }
                } if (reportParams != null && reportParams.ReportName != null)
                {
                    if (reportParams.ReportName == "Production Delivery")
                    {
                        this.repDocument = new rptProductionOrderDeliveryList();
                        Tables repTbls = repDocument.Database.Tables;
                        this.SetDBLogonForReport(connectionInfo, repTbls);
                        this.reportViewer.ReportSource = repDocument;
                        repDocument.DataDefinition.FormulaFields["StartDateParam"].Text = Utility.InQuotation(reportParams.StartDate.ToString());
                        repDocument.DataDefinition.FormulaFields["EndDateParam"].Text = Utility.InQuotation(reportParams.EndDate.ToString());
                        repDocument.DataDefinition.FormulaFields["Color"].Text = reportParams.Color != null ? Utility.InQuotation(reportParams.Color) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["Size"].Text = reportParams.Size != null ? Utility.InQuotation(reportParams.Size) : Utility.InQuotation(""); ;
                        repDocument.DataDefinition.FormulaFields["ItemCategory"].Text = reportParams.ItemCategory != null ? Utility.InQuotation(reportParams.ItemCategory) : Utility.InQuotation(""); ;
                        repDocument.DataDefinition.FormulaFields["ItemMainCategory"].Text = reportParams.ItemMainCategory != null ? Utility.InQuotation(reportParams.ItemMainCategory) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["StoreName"].Text = reportParams.Store != null ? Utility.InQuotation(reportParams.Store) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId != 0 ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["ItemName"].Text = reportParams.ItemName != null ? Utility.InQuotation(reportParams.ItemName) : Utility.InQuotation("");
                        repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != 0 ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");

                    }
                }
                if (reportParams != null && reportParams.ReportName != null)
                {
                    if (reportParams.ReportName == "ProductionPlan")
                    {
                        this.repDocument = new rptProductionPlanStatus();
                        Tables repTbls = repDocument.Database.Tables;
                        this.SetDBLogonForReport(connectionInfo, repTbls);
                        this.reportViewer.ReportSource = repDocument;
                        repDocument.DataDefinition.FormulaFields["StartDateParam"].Text = Utility.InQuotation(reportParams.StartDate.ToString());
                        repDocument.DataDefinition.FormulaFields["EndDateParam"].Text = Utility.InQuotation(reportParams.EndDate.ToString());
                    }
                }

               
            }

            else if (reportType == "Sales")
            {
                BincardReport reportParams = (BincardReport)Session["BincardReportParams"];
                if (reportParams.ReportName == "Sales")
                {
                    this.repDocument = new rpt_SalesList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId != Guid.Empty && reportParams.StoreId != null ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");

                }
                if (reportParams.ReportName == "Sales Summary")
                {
                    this.repDocument = new rpt_SalesSummaryList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StoreId"].Text = reportParams.StoreId != Guid.Empty && reportParams.StoreId != null ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");

                }

                if (reportParams.ReportName == "Collection")
                {
                    this.repDocument = new rpt_CollectionList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerId"].Text = reportParams.CustomerId != Guid.Empty && reportParams.CustomerId != null ? Utility.InQuotation(reportParams.CustomerId.ToString()) : Utility.InQuotation("");

                }
                if (reportParams.ReportName == "Settlement")
                {
                    this.repDocument = new rpt_SettlementList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerId"].Text = reportParams.CustomerId != Guid.Empty && reportParams.CustomerId != null ? Utility.InQuotation(reportParams.CustomerId.ToString()) : Utility.InQuotation("");

                }
                if (reportParams.ReportName == "Customer Ledger")
                {
                    this.repDocument = new rpt_CustomerLedgerList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerId"].Text = reportParams.CustomerId != Guid.Empty && reportParams.CustomerId != null ? Utility.InQuotation(reportParams.CustomerId.ToString()) : Utility.InQuotation("");
                    this.repDocument.SetParameterValue("@StartDate", reportParams.StartDate);
                    this.repDocument.SetParameterValue("@endDate", reportParams.EndDate);

                }
                if (reportParams.ReportName == "Customer Balance")
                {
                    this.repDocument = new rpt_CustomerLedgerBalanceList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerId"].Text = reportParams.CustomerId != Guid.Empty && reportParams.CustomerId != null ? Utility.InQuotation(reportParams.CustomerId.ToString()) : Utility.InQuotation("");
                    this.repDocument.SetParameterValue("@StartDate", reportParams.StartDate);
                    this.repDocument.SetParameterValue("@endDate", reportParams.EndDate);

                }
                if (reportParams.ReportName == "Customer Aging")
                {
                    this.repDocument = new rpt_CreditAgingList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerId"].Text = reportParams.CustomerId != Guid.Empty && reportParams.CustomerId != null ? Utility.InQuotation(reportParams.CustomerId.ToString()) : Utility.InQuotation("");
              
                }
                if (reportParams.ReportName == "Sales Order List")
                {
                    this.repDocument = new rpt_SalesOrderList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SalesAreaId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SalesArea"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ReferenceNo"].Text = reportParams.ReferenceNo != null ? Utility.InQuotation(reportParams.ReferenceNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemTypeId"].Text = reportParams.ItemTypeId != Guid.Empty ? Utility.InQuotation(reportParams.ItemTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId != Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerId"].Text = reportParams.CustomerId != Guid.Empty && reportParams.CustomerId != null ? Utility.InQuotation(reportParams.CustomerId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["PriceCategoryId"].Text = reportParams.PriceCategoryId != Guid.Empty && reportParams.PriceCategoryId != null ? Utility.InQuotation(reportParams.PriceCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerCategoryId"].Text = reportParams.CustomerCategoryId != Guid.Empty && reportParams.CustomerCategoryId != null ? Utility.InQuotation(reportParams.CustomerCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SalesTypeId"].Text = reportParams.SalesTypeId != Guid.Empty && reportParams.SalesTypeId != null ? Utility.InQuotation(reportParams.SalesTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty && reportParams.StatusId != null ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");

                }
                if (reportParams.ReportName == "Sales Order By Amount")
                {
                    this.repDocument = new rpt_SalesOrderByAmountList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SalesAreaId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SalesArea"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ReferenceNo"].Text = reportParams.ReferenceNo != null ? Utility.InQuotation(reportParams.ReferenceNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemTypeId"].Text = reportParams.ItemTypeId != Guid.Empty ? Utility.InQuotation(reportParams.ItemTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId != Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerId"].Text = reportParams.CustomerId != Guid.Empty && reportParams.CustomerId != null ? Utility.InQuotation(reportParams.CustomerId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["PriceCategoryId"].Text = reportParams.PriceCategoryId != Guid.Empty && reportParams.PriceCategoryId != null ? Utility.InQuotation(reportParams.PriceCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerCategoryId"].Text = reportParams.CustomerCategoryId != Guid.Empty && reportParams.CustomerCategoryId != null ? Utility.InQuotation(reportParams.CustomerCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SalesTypeId"].Text = reportParams.SalesTypeId != Guid.Empty && reportParams.SalesTypeId != null ? Utility.InQuotation(reportParams.SalesTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty && reportParams.StatusId != null ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");

                }
                if (reportParams.ReportName == "Sales Order By Item")
                {
                    this.repDocument = new rpt_SalesOrderByItemList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SalesAreaId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SalesArea"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ReferenceNo"].Text = reportParams.ReferenceNo != null ? Utility.InQuotation(reportParams.ReferenceNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemTypeId"].Text = reportParams.ItemTypeId != Guid.Empty ? Utility.InQuotation(reportParams.ItemTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId != Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerId"].Text = reportParams.CustomerId != Guid.Empty && reportParams.CustomerId != null ? Utility.InQuotation(reportParams.CustomerId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["PriceCategoryId"].Text = reportParams.PriceCategoryId != Guid.Empty && reportParams.PriceCategoryId != null ? Utility.InQuotation(reportParams.PriceCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerCategoryId"].Text = reportParams.CustomerCategoryId != Guid.Empty && reportParams.CustomerCategoryId != null ? Utility.InQuotation(reportParams.CustomerCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SalesTypeId"].Text = reportParams.SalesTypeId != Guid.Empty && reportParams.SalesTypeId != null ? Utility.InQuotation(reportParams.SalesTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty && reportParams.StatusId != null ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");

                }   
                if (reportParams.ReportName == "Sales Order By All Item")
                {
                    this.repDocument = new rpt_SalesOrderByAllItemList();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SalesAreaId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SalesArea"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ReferenceNo"].Text = reportParams.ReferenceNo != null ? Utility.InQuotation(reportParams.ReferenceNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemTypeId"].Text = reportParams.ItemTypeId != Guid.Empty ? Utility.InQuotation(reportParams.ItemTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId != Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerId"].Text = reportParams.CustomerId != Guid.Empty && reportParams.CustomerId != null ? Utility.InQuotation(reportParams.CustomerId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["PriceCategoryId"].Text = reportParams.PriceCategoryId != Guid.Empty && reportParams.PriceCategoryId != null ? Utility.InQuotation(reportParams.PriceCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerCategoryId"].Text = reportParams.CustomerCategoryId != Guid.Empty && reportParams.CustomerCategoryId != null ? Utility.InQuotation(reportParams.CustomerCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SalesTypeId"].Text = reportParams.SalesTypeId != Guid.Empty && reportParams.SalesTypeId != null ? Utility.InQuotation(reportParams.SalesTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty && reportParams.StatusId != null ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");

                }
                if (reportParams.ReportName == "VAT List")
                {
                    this.repDocument = new rpt_SalesOrderByVat();
                    Tables repTbls = repDocument.Database.Tables;
                    this.SetDBLogonForReport(connectionInfo, repTbls);
                    this.reportViewer.ReportSource = repDocument;

                    repDocument.DataDefinition.FormulaFields["ItemId"].Text = reportParams.ItemId != Guid.Empty ? Utility.InQuotation(reportParams.ItemId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SalesAreaId"].Text = reportParams.StoreId != Guid.Empty ? Utility.InQuotation(reportParams.StoreId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SalesArea"].Text = Utility.InQuotation(reportParams.Store);
                    repDocument.DataDefinition.FormulaFields["StartDate"].Text = reportParams.StartDate != null ? Utility.InQuotation(reportParams.StartDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["EndDate"].Text = reportParams.EndDate != null ? Utility.InQuotation(reportParams.EndDate.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["VoucherNo"].Text = reportParams.VoucherNo != null ? Utility.InQuotation(reportParams.VoucherNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ReferenceNo"].Text = reportParams.ReferenceNo != null ? Utility.InQuotation(reportParams.ReferenceNo.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemTypeId"].Text = reportParams.ItemTypeId != Guid.Empty ? Utility.InQuotation(reportParams.ItemTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["ItemCategoryId"].Text = reportParams.ItemCategoryId != Guid.Empty ? Utility.InQuotation(reportParams.ItemCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerId"].Text = reportParams.CustomerId != Guid.Empty && reportParams.CustomerId != null ? Utility.InQuotation(reportParams.CustomerId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["PriceCategoryId"].Text = reportParams.PriceCategoryId != Guid.Empty && reportParams.PriceCategoryId != null ? Utility.InQuotation(reportParams.PriceCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["CustomerCategoryId"].Text = reportParams.CustomerCategoryId != Guid.Empty && reportParams.CustomerCategoryId != null ? Utility.InQuotation(reportParams.CustomerCategoryId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["SalesTypeId"].Text = reportParams.SalesTypeId != Guid.Empty && reportParams.SalesTypeId != null ? Utility.InQuotation(reportParams.SalesTypeId.ToString()) : Utility.InQuotation("");
                    repDocument.DataDefinition.FormulaFields["StatusId"].Text = reportParams.StatusId != Guid.Empty && reportParams.StatusId != null ? Utility.InQuotation(reportParams.StatusId.ToString()) : Utility.InQuotation("");

                } 
            }

            this.reportViewer.DataBind();
            this.reportViewer.Visible = true;
            this.reportViewer.DisplayGroupTree = false;
            this.reportViewer.HasToggleGroupTreeButton = false;
            this.reportViewer.HasRefreshButton = true;
            this.reportViewer.EnableDatabaseLogonPrompt = false;
            this.reportViewer.EnableParameterPrompt = false;
            this.reportViewer.BorderStyle = BorderStyle.Solid;
            this.reportViewer.BorderColor = System.Drawing.ColorTranslator.FromHtml("#D0DEF0");
            this.reportViewer.BorderWidth = Unit.Pixel(1);
            this.reportViewer.HasCrystalLogo = false;
            this.reportViewer.BestFitPage = true;
            this.reportViewer.PrintMode=PrintMode.ActiveX;
            this.reportViewer.HasDrillUpButton = false;
       }

        protected void Page_Load(object sender, EventArgs e)
        {
            
        }

        private void SetDBLogonForReport(ConnectionInfo connectionInfo, Tables reportTables)
        {
            foreach (CrystalDecisions.CrystalReports.Engine.Table table in reportTables)
            {
                TableLogOnInfo tableLogonInfo = table.LogOnInfo;
                tableLogonInfo.ConnectionInfo = connectionInfo;
                table.ApplyLogOnInfo(tableLogonInfo);
            }
        }

        protected void Page_Unload(object sender, EventArgs e)
        {
            if (this.repDocument != null)
            {
                this.repDocument.Close();
                this.repDocument.Dispose();
            }
            this.reportViewer.BestFitPage = true;
        
        }
        
    }
}