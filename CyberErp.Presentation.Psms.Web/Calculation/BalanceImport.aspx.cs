
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
    public partial class BalanceImport : System.Web.UI.Page
    {
        private readonly DbContext _context;
        private readonly BaseModel<psmsItem> _item;
        private readonly BaseModel<psmsItemUnit> _itemUnit;
        private readonly BaseModel<lupMeasurementUnit> _unit;
        private readonly BaseModel<lupItemType> _itemType;
        private readonly BaseModel<psmsItemCategory> _itemCategory;
        private readonly BaseModel<psmsTaxRate> _taxRate;
        private readonly BaseModel<psmsStore> _store;
        private readonly BaseModel<coreFiscalYear> _fiscalYearId;
        private readonly BaseModel<psmsInventoryRecord> _inventoryRecord;
        string inventoryImportQuery = "";
        string bincardImportQuery = "";
        List<psmsItem> itemList = new List<psmsItem>();
        List<psmsStore> storeList = new List<psmsStore>();
        string action = "";
        public BalanceImport()
        {
            _context = new ErpEntities(Constants.ConnectionString);
             _item = new Business.Component.Psms.BaseModel<psmsItem>(_context);
             _itemUnit = new BaseModel<psmsItemUnit>(_context);
             _unit = new BaseModel<lupMeasurementUnit>(_context);
             _itemType = new BaseModel<lupItemType>(_context);
             _itemCategory = new BaseModel<psmsItemCategory>(_context);
             _taxRate = new BaseModel<psmsTaxRate>(_context);
             _store = new BaseModel<psmsStore>(_context);
             _fiscalYearId = new BaseModel<coreFiscalYear>(_context);
             _inventoryRecord = new BaseModel<psmsInventoryRecord>(_context);
        }
        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);

             action = Request.QueryString["action"];
            if (action == "Item Balance" || action == "Physical Balance")
            {
                Label2.Text = "Please wiat until the operation is completed.....";
       
                var file = Request.QueryString["file"];
                var fileExtension = Request.QueryString["fileExtension"];
                 itemList = _item.GetAll().AsQueryable().ToList();
                 storeList = _store.GetAll().ToList();
                Importdata(fileExtension, file);
             }         
        }
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        #region Item Balance Import
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
                    SaveItemBalance(dt);
                    if (inventoryImportQuery!="")
                    _context.Database.ExecuteSqlCommand(inventoryImportQuery);
                    if (bincardImportQuery != "")                  
                    _context.Database.ExecuteSqlCommand(bincardImportQuery);
                    _context.SaveChanges();
                    transaction.Complete();
                    Label2.Text = "Sucessfully Imported";

                }
                catch (System.Exception ex)
                {
                    Label2.Text = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                }
            }


        }
        private void SaveItemBalance(System.Data.DataTable table)
        {
            var recordList = new List<object>();
            var selectedtable = table.Select("No>0");
            var objFiscalYear = _fiscalYearId.GetAll().AsQueryable().Where(o => o.IsActive == true && o.IsClosed == false).FirstOrDefault();
            if (objFiscalYear==null)
            throw new System.InvalidOperationException("Please set curent fiscal year first");
              
            var fiscalYearId = objFiscalYear.Id;
            var startDate = objFiscalYear.StartDate;
           
            var inventoryRecordList =_inventoryRecord.GetAll().AsQueryable().Where(o => o.FiscalYearId == fiscalYearId).ToList();
            foreach (DataRow row in selectedtable)
            {
                string itemCode = row[1] != null ? row[1].ToString() : "";
                string itemName = row[2] != null ? row[2].ToString() : "";
                decimal unitCost = 0;
                decimal.TryParse(row[3].ToString(), out unitCost);
               
                var item = itemList.Where(o => o.Code.ToUpper() == itemCode.ToUpper() || o.PartNumber == itemCode || o.Name.ToUpper() == itemName.ToUpper()).FirstOrDefault();
                if (item != null)
                {
                    RetailItemBalanceImport(table, inventoryRecordList, row, unitCost, item, fiscalYearId, startDate);
                }
                else
                {
                    throw new System.InvalidOperationException(itemName + " ,item is not Registerd with the same name or code, item at R.No:" + row[0]);
                }
            }
        }
        private void RetailItemBalanceImport(DataTable table, List<psmsInventoryRecord> inventoryRecordList, DataRow row, decimal unitCost, psmsItem item, Guid fiscalYearId, DateTime date)
        {
            for (int i = 4; i < table.Columns.Count; i++)
            {
                var columnName = table.Columns[i].ColumnName;
                var objStore =storeList.Where(o => o.Name.Trim().ToUpper() == columnName.Trim().ToUpper()).FirstOrDefault();
                if (objStore == null)
                    throw new System.InvalidOperationException(columnName + " ,store name is not Registerd with the same name, item at R.No:" + row[0]);
                decimal  quantity = 0;
                decimal.TryParse(row[i].ToString(), out quantity);
                if (quantity > 0)
                {
                    var objInventoryRecord = inventoryRecordList.Where(o => o.StoreId == objStore.Id && o.ItemId == item.Id && o.FiscalYearId == fiscalYearId).FirstOrDefault();
                         
                      if (action == "Item Balance" )
                      {
                          if (objInventoryRecord != null)
                              UpdateItemBalance(objInventoryRecord.Id, item.Id, objStore.Id, fiscalYearId, quantity, unitCost);
                          else
                              AddItemBalance(item.Id, objStore.Id, fiscalYearId, quantity, unitCost, date);
                      }
                      else if (action == "Physical Balance" && objInventoryRecord!=null)
                    
                      {
                          UpdatePhysicalBalance(objInventoryRecord.Id, item.Id, objStore.Id, fiscalYearId, quantity, unitCost);
                 
                      }
                             
                }
            }
        }

        private void AddItemBalance( Guid itemId, Guid storeId, Guid fiscalYearId, decimal quantity, decimal unitCost,DateTime date)
        {

            inventoryImportQuery = inventoryImportQuery + string.Format("insert into psmsInventoryRecord(Id,StoreId,ItemId,FiscalYearId,BeginingQuantity,RunningQuantity,AvailableQuantity,UnitCost,CommittedQuantity,PhysicalQuantity,ClosingQuantity,DamagedQuantity,ExpiredQuantity,IsClosed,CreatedAt,UpdatedAt,IsDeleted) values('{0}','{1}','{2}','{3}',{4},{5},{6},{7},0,0,0,0,0,0,'{8}','{9}',0)", Guid.NewGuid(), storeId, itemId, fiscalYearId,quantity, quantity, quantity, unitCost, DateTime.Now, DateTime.Now);
            bincardImportQuery = bincardImportQuery + string.Format("insert into psmsBinCard(Id,StoreId,ItemId,FiscalYearId,VoucherId,VoucherNo,CurrentQuantity,ReceivedQuantity,IssuedQuantity,UnitCost,AverageCost,InAmount,OutAmount,CurrentAmount,Date,CreatedAt,UpdatedAt,CostTypeId,ItemCostId,Remark,IsDeleted) values('{0}','{1}','{2}','{3}','{4}','{5}',{6},{7},{8},{9},{10},{11},{12},{13},'{14}','{15}','{16}','{17}','{18}','{19}',0)", Guid.NewGuid(), storeId, itemId, fiscalYearId, Guid.Empty, "Beginning Quantity", quantity, 0, 0, unitCost, unitCost, 0, 0,quantity*unitCost,date, DateTime.Now, DateTime.Now, Guid.Empty, Guid.Empty,"");

        }

        private void UpdateItemBalance(Guid Id,Guid itemId,Guid storeId,Guid fiscalYearId,decimal quantity,decimal unitCost)
        {
            inventoryImportQuery = inventoryImportQuery + string.Format("Update  psmsInventoryRecord set BeginingQuantity={0}, RunningQuantity={1},AvailableQuantity={2},UnitCost={3}, where id='{4}'",quantity, quantity, quantity, unitCost, Id);      
            bincardImportQuery =bincardImportQuery+ string.Format("Update  psmsBinCard set CurrentQuantity={0},ReceivedQuantity={1},IssuedQuantity={2},UnitCost={3},AverageCost={4},OutAmount=0,InAmount={5},CurrentAmount={6} where ItemId='{7}'  and storeId='{8}' and FiscalYearId='{9}' and voucherNo='Beginning Quantity'", quantity, quantity, 0, unitCost, unitCost, quantity * unitCost, quantity * unitCost,itemId,storeId, fiscalYearId);       
        }
        private void UpdatePhysicalBalance(Guid Id, Guid itemId, Guid storeId, Guid fiscalYearId, decimal quantity, decimal unitCost)
        {
            inventoryImportQuery = inventoryImportQuery + string.Format("Update  psmsInventoryRecord set PhysicalQuantity={0} where id='{1}'", quantity, Id);
        }

        #endregion
    }
}