
using CyberErp.Business.Component.Psms;
using CyberErp.Data.Model;
using CyberErp.Presentation.Psms.Web.Classes;
using CyberErp.Presentation.Web.Psms.Controllers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.OleDb;
using System.Linq;
using System.Transactions;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CyberErp.Presentation.Psms.Web.Calculation
{
    public partial class Import : System.Web.UI.Page
    {
        private readonly DbContext _context;
        private readonly BaseModel<psmsItem> _item;
        private readonly BaseModel<psmsItemUnit> _itemUnit;
        private readonly BaseModel<lupMeasurementUnit> _unit;
        private readonly BaseModel<lupItemType> _itemType;
        private readonly BaseModel<psmsItemCategory> _itemCategory;
        private readonly BaseModel<psmsTaxRate> _taxRate;
        string importQuery = "";
        string importOtherQuery = "";
        List<lupMeasurementUnit> unitList = new List<lupMeasurementUnit>();
        List<psmsItem> itemList = new List<psmsItem>();
        List<lupItemType> itemTypeList = new List<lupItemType>();
        List<psmsItemCategory> itemCategoryList = new List<psmsItemCategory>();
        List<psmsTaxRate> taxRateist = new List<psmsTaxRate>();
       
        public Import()
        {
            _context = new ErpEntities(Constants.ConnectionString);
             _item = new Business.Component.Psms.BaseModel<psmsItem>(_context);
             _itemUnit = new BaseModel<psmsItemUnit>(_context);
             _unit = new BaseModel<lupMeasurementUnit>(_context);
             _itemType = new BaseModel<lupItemType>(_context);
             _itemCategory = new BaseModel<psmsItemCategory>(_context);
             _taxRate = new BaseModel<psmsTaxRate>(_context);
        }
        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);

            var action = Request.QueryString["action"];
            if (action == "Item")
            {
                Label2.Text = "Please wiat until the operation is completed.....";
       
                var file = Request.QueryString["file"];
                var fileExtension = Request.QueryString["fileExtension"];
                unitList = _unit.GetAll().ToList();
                itemTypeList =_itemType.GetAll().ToList();
                itemList = _item.GetAll().AsQueryable().ToList();
                itemCategoryList = _itemCategory.GetAll().ToList();
                taxRateist = _taxRate.GetAll().ToList();
                Importdata(fileExtension, file);
             }
        }
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        #region Item Import
        private void Importdata(string extension, string filePath)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = System.Transactions.IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {

            string conString = string.Empty;
            switch (extension)
            {
                case ".xls": //Excel 97-03.
                    conString = string.Format("Provider=Microsoft.Jet.OLEDB.4.0; data source={0}; Extended Properties=Excel 8.0;", filePath);
                    break;
                case ".xlsx": //Excel 07 and above.
                    conString = string.Format("Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0};Extended Properties=\"Excel 12.0 Xml;HDR=YES;IMEX=1\";OLE DB Services=-4;", filePath);
                    break;
            }
            System.Data.DataTable dt = new System.Data.DataTable();
            conString = string.Format(conString, filePath);

            using (OleDbConnection connExcel = new OleDbConnection(conString))
            {
                using (OleDbCommand cmdExcel = new OleDbCommand())
                {
                    using (OleDbDataAdapter odaExcel = new OleDbDataAdapter())
                    {
                        cmdExcel.Connection = connExcel;

                        connExcel.Open();
                        System.Data.DataTable dtExcelSchema;
                        dtExcelSchema = connExcel.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                        connExcel.Close();
                        connExcel.Open();
                        cmdExcel.CommandText = "SELECT * From [" + "Sheet1$" + "]";
                        odaExcel.SelectCommand = cmdExcel;
                        odaExcel.Fill(dt);
                        connExcel.Close();
                    }
                }
            }
            SaveItemP(dt);
           _context.Database.ExecuteSqlCommand(importQuery);
           _context.SaveChanges();
           if (importOtherQuery!="")
           _context.Database.ExecuteSqlCommand(importOtherQuery);
           _context.SaveChanges();
           transaction.Complete();
           Label2.Text = "Sucessfully Imported";
     
        }
        catch (System.Exception ex)
        {
            Label2.Text=ex.InnerException!=null?ex.InnerException.Message:ex.Message;         
        }
    }


        }
        private void SaveItemP(System.Data.DataTable table)
        {
            var recordList = new List<object>();
            var selectedtable=table.Select("No>0");
             taxRateist = new List<psmsTaxRate>();
             var taxRate = taxRateist.Where(o => o.Name.ToUpper().Contains("VAT")).FirstOrDefault();
             var objUnit1 = unitList.Where(o => o.Name.ToUpper() == "Pcs".ToUpper()).FirstOrDefault();
             Guid pcsUnitId = Guid.Empty;
             if (objUnit1 != null)
             {
                 pcsUnitId = objUnit1.Id;
             }
             foreach (DataRow row in selectedtable)
            {
                string taxable = row[1] != null ? row[1].ToString() : "";
                string itemType = row[2] != null ? row[2].ToString() : "";
                string itemNo = row[3] != null ? row[3].ToString() : "";
                string itemCode= row[4] != null ? row[4].ToString() : "";
                string Supplier = row[5] != null ? row[5].ToString() : "";
                string itemName = row[6] != null ? row[6].ToString() : "";
                string Brand = row[7] != null ? row[7].ToString() : "";
                string movingStatus = row[8] != null ? row[8].ToString() : "";
                string category = row[9] != null ? row[9].ToString() : "";
                string subCategory = row[10] != null ? row[10].ToString() : "";
                string uoM = row[11] != null ? row[11].ToString() : "";
                string quantityPerUoM = row[12] != null ? row[12].ToString() : "";
                decimal weight = row[13] != null && row[13] != "" ? decimal.Parse(row[13].ToString()) : 0;             
              
                 var item = itemList.Where(o => o.Code.ToUpper() == itemCode.ToUpper() || o.PartNumber== itemNo || o.Name.ToUpper() == itemName.ToUpper()).FirstOrDefault();
                var isTaxable=taxable.ToUpper()=="VAT"?true:false;

                if (item == null)
                {
                    var objItemType = itemTypeList.Where(o => o.Name.ToUpper() == itemType.ToUpper()).FirstOrDefault();
                    if (objItemType == null)
                        throw new System.InvalidOperationException(itemType + " ,item type is not Registerd wtih the same name, item at R.No:" + row[0]);                   
                    var objUnit = unitList.Where(o => o.Name.ToUpper() == uoM.ToUpper()).FirstOrDefault();
                    if (objUnit == null)
                        throw new System.InvalidOperationException(uoM + " ,unit is not Registerd wtih the same name, item at R.No:" + row[0]);
                    var itemCategory = itemCategoryList.Where(o => o.Name.ToUpper() == subCategory.ToUpper()).FirstOrDefault();
                    if (itemCategory == null)
                        throw new System.InvalidOperationException(subCategory + " ,sub category is not Registerd wtih the same name, item at R.No:" + row[0]);
                    Guid taxRateId = Guid.Empty;
                    string taxDescription = "";
                    if(isTaxable)
                    {
                        if (taxRate != null)
                        {
                            taxRateId = taxRate.Id;
                            taxDescription = "Vat(o.15)";                  
                        }
                      }
                    var fsm=movingStatus=="Slow"?"S":movingStatus=="High"?"H":"A";
                    AddItemPrice(itemCategory.Id, objItemType.Id, itemName, itemCode, itemNo, objUnit.Id, quantityPerUoM, fsm, weight, Supplier, Brand, taxRateId, taxDescription, pcsUnitId);
                }
                //else
                //{
                //    throw new System.InvalidOperationException(itemName+" ,item is already Registerd with the same name or code, item at R.No:" + row[0]);      
                //}
            }    
        }
    
        private void AddItemPrice(Guid categoryId, Guid itemTypeId, string name,string code,string partNo,Guid unitId,string inventoryUnit,string fsN,decimal weight,string supplier,
            string brand,Guid taxRateId,string taxDescription,Guid pcsUnitId)
        {
           var itemId=Guid.NewGuid();
            importQuery=importQuery+string.Format("Insert Into psmsItem(Id,ItemCategoryId,ItemTypeId,Name,Code,PartNumber,MeasurementUnitId,InventoryUnit,FSN,Weight,Supplier"+
                ",Brand,IsLOTItem,IsSerialItem,IsHazardous,IsActive,TaxRateIds,TaxRateDescription,Remark,IsDeleted,CreatedAt,UpdatedAt)"+
            "values('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}',{9},'{10}','{11}','{12}','{13}','{14}','{15}','{16}','{17}','{18}',0,'{19}','{20}')",
            itemId, categoryId, itemTypeId, name, code, partNo, unitId, inventoryUnit, fsN, weight, supplier, brand, false, false,false,true,taxRateId,taxRateId!=Guid.Empty? taxDescription:"", "", DateTime.Now, DateTime.Now);
            decimal unitAmount = 0;
            decimal.TryParse(inventoryUnit, out unitAmount);
            var conversionRate=unitAmount>0?1/unitAmount:0;
            if (pcsUnitId!=Guid.Empty && conversionRate>0)
            {
                importOtherQuery = importOtherQuery + string.Format("Insert Into psmsItemUnit(Id,ItemId,MeasurementUnitId,ConversionRate,Remark,IsDeleted,CreatedAt,UpdatedAt)" +
                     "values('{0}','{1}','{2}',{3},'',0,'{4}','{5}')",
                         Guid.NewGuid(), itemId, pcsUnitId, conversionRate, DateTime.Now, DateTime.Now);
   
            }
          }

    
        #endregion
    }
}