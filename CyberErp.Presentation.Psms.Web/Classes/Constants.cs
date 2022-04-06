using CyberErp.Data.Model;
using System;
namespace CyberErp.Presentation.Psms.Web.Classes
{
    public static class Constants
    {
        #region Members

        public static string ApplicationPath = string.Empty;
        public static string CurrentCulture = "CurrentCulture";
        public static string DefaultLanguage = "en-US";
        public static string ConnectionString = string.Empty;
        public static string ConnectionStringForAdoNet = string.Empty;
        public static string CurrentUser = "CurrentUser";
        public static string CurrentSubsystem = "CurrentSubsystem";
        public const string UserPermission = "UserPermission";

        public const string Psms = "Inventory";
        
        public const string CanAdd = "CanAdd";
        public const string CanEdit = "CanEdit";
        public const string CanDelete = "CanDelete";
        public const string CanView = "CanView";
        public const string CanApprove = "CanApprove";
        public const string All = "All";

        public const string Key = "0b1f131c";

        //Document Confirmation
        public const string DOCUMENT_CONFIRM = "Confirm";
        public const string DOCUMENT_REJECT = "Reject";

        //Notification Operations
        public const string NTF_OPN_JOB_ORDER = "JOB ORDER";
        public const string NTF_OPN_QUOTATION = "QUOTATION";
        public const string NTF_OPN_OPERATION = "OPERATION";
        public const string NTF_OPN_MESSAGE_APPROVED = "Job order approved!";


        public const string Voucher_Status_Posted = "05b21fc5-5afc-4b54-b9ad-19b44518b441";
        public const string Voucher_Status_Approved = "05b21fc5-5afc-4b54-b9ad-19b44518b443";
        public const string Voucher_Status_Partially_Approved = "05b21fc5-5afc-4b54-b9ad-19b44518b444";
        public const string Voucher_Status_Rejected = "05b21fc5-5afc-4b54-b9ad-19b44518b445";
        public const string Voucher_Status_Certified = "05b21fc5-5afc-4b54-b9ad-19b44518b442";
        public const string Voucher_Status_Void = "05b21fc5-5afc-4b54-b9ad-19b44518b446";
        public const string Voucher_Status_Issued = "05b21fc5-5afc-4b54-b9ad-19b44518b455";
        public const string Voucher_Status_Receive = "05b21fc5-5afc-4b54-b9ad-19b44518b466";
        public const string Voucher_Status_Ordered = "05b21fc5-5afc-4b54-b9ad-19b44518b422";
        public const string Voucher_Status_Partially_Ordered = "05b21fc5-5afc-4b54-b9ad-19b44518b477";
        public const string Voucher_Status_Authorized = "05b21fc5-5afc-4b54-b9ad-19b14514b477";
        public const string Voucher_Status_Waiting_Estimation_Approval = "05b21fc5-5afc-4b54-b9ad-19b34118b477";
        public const string Voucher_Status_Estimation_Approved = "05b21fc5-5afc-4b54-b9ad-19b34218b477";
        public const string Voucher_Status_Final_Approved = "05b21fc5-5afc-4b54-b9ad-19b44818b477";
     



        public const string Voucher_Type_StoreRequisition = "f632fa86-0f74-4804-895d-c55a062c658d";
        public const string Voucher_Type_StoreIssue = "f632fa86-0f74-4804-895d-c55a062c6582";
        public const string Voucher_Type_StoreTransferIssue = "f632fa86-0f74-4804-895d-c55a062c658f";
        public const string Voucher_Type_StoreTransferReceive = "f632fa86-0f74-4804-895d-c55a062c658a";
        public const string Voucher_Type_StoreReceive = "f632fa86-0f74-4804-895d-c55a062c6583";
        public const string Voucher_Type_PurchaseRequest = "f632fa86-0f74-4804-895d-c55a062c6593";
        public const string Voucher_Type_PurchaseOrder = "f632fa86-0f74-4804-895d-c55a062c6590";
        public const string Voucher_Type_RequestForQuotation = "f632fa86-0f74-4804-895d-c55a062c4599";
        public const string Voucher_Type_StoreReturn = "f632fa86-0f74-4804-895d-c55a162c6599";
        public const string Voucher_Type_StoreDisposal = "f632fa86-0f74-4804-8951-c55a162c6599";
        public const string Voucher_Type_StoreFixedAssetTransfer = "6df74827-24b9-486c-ac23-fb42a161dceb";
        public const string Voucher_Type_StoreAdjustment = "6df74827-24b9-486c-ac23-fb42a362dceb";
        public const string Voucher_Type_DeliveryOrder = "6df74827-24b9-486c-ac23-fb41a362dceb";
        public const string Voucher_Type_sales = "6df74827-24b9-486c-ac23-fb42a3641ceb";
        public const string Voucher_Type_Manualsales = "6df74827-24b9-486c-ac23-fb42a3649ceb";
        public const string Voucher_Type_proforma = "d10a9bb6-356c-4da8-b4c6-7bf46bb3d3a0";
      
        public const string Voucher_Type_CashSales = "a69e88a1-95bf-41ce-b153-02c115f2c0e6";
        public const string Voucher_Type_CreditSales = "a69e88a1-95bf-41ce-b153-02c11522c0e6";
        public const string Path = "Path";

        public const string vatRate_setting_Name = "Vat";
        public const string withholding_setting_Name = "Withholding";
        
        public const string priceGroup_setting_Name = "DefaultPriceGroup";
        public const string licenseInformation_setting_Name = "LicenseInformation";
     


        public const string autoCode_setting_Name = "Auto-Generated Item Code";

        public const string autoGeneratRFQ = "Auto Generate RFQ";

        public const string autoEvaluate_RFQ_By_Price = "Auto Evaluate RFQ By Price";
        public const string default_PurchasePrice = "Default Purchase Price";


        public const string emailConfigration_setting_Name = "Email Server Configration";
        public const string defaultSupplierCategory_setting_Name = "Default Supplier Category";
        public const string signature_path = "Signature Path";
        public const string defaultTransactionTemplate_setting_Name = "Default Transaction Template";
        public const string recalculateTime_setting_Name = "RecalculateTime";

        
        #endregion
   
        public class ItemAnalysisModel{
           public psmsItem Item{get;set;}
           public decimal AnnualUsage{get;set;}
           public decimal AnnualCost{get;set;}
           public decimal UsagePersent { get; set; }
           public decimal CostPersent { get; set; }
           public char Class { get; set; }
        }
       
    }
}