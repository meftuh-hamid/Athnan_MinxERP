using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;


namespace CyberErp.Presentation.Psms.Web.Classes
{
    class DataHelper
    {
        string connString;
       public DataHelper(string connectionString)
        {
            connString = connectionString;
             }

        #region TRansaction
       public IList<CyberErp.Presentation.Psms.Web.Classes.Model.SalesTransaction> GetSalesTransaction(int start, int limit, string criteria)
        {
            IList<CyberErp.Presentation.Psms.Web.Classes.Model.SalesTransaction> salestransactionList = new List<CyberErp.Presentation.Psms.Web.Classes.Model.SalesTransaction>();

            var salesTransactionData = GetSalesTransactionData(start, limit, criteria);

                while (salesTransactionData.Read())
                {
                    var SalesTransaction = GetSalesTransactionObject(salesTransactionData);
                    salestransactionList.Add(SalesTransaction);
                }
                return salestransactionList;

        }

       public IList<CyberErp.Presentation.Psms.Web.Classes.Model.VoucherDetail> GetVoucherDetailTransaction( string criteria)
       {
           IList<CyberErp.Presentation.Psms.Web.Classes.Model.VoucherDetail> voucherDetailtransactionList = new List<CyberErp.Presentation.Psms.Web.Classes.Model.VoucherDetail>();
           var salesTransactionData = GetVoucherDetailTransactionData(criteria);        
           while (salesTransactionData.Read())
           {
               var SalesTransaction =GetVoucherDetailObject(salesTransactionData);             
               voucherDetailtransactionList.Add(SalesTransaction);
           }
           return voucherDetailtransactionList;

       }

       public IList<CyberErp.Presentation.Psms.Web.Classes.Model.VoucherDetail> GetVoucherDetailManualSalesTransaction(string criteria)
       {
           IList<CyberErp.Presentation.Psms.Web.Classes.Model.VoucherDetail> voucherDetailtransactionList = new List<CyberErp.Presentation.Psms.Web.Classes.Model.VoucherDetail>();

           var salesTransactionData = GetVoucherDetailMaunalSalesTransactionData(criteria);

           while (salesTransactionData.Read())
           {
               var SalesTransaction = GetVoucherDetailObject(salesTransactionData);
               voucherDetailtransactionList.Add(SalesTransaction);
           }
           return voucherDetailtransactionList;

       }

       public IList<CyberErp.Presentation.Psms.Web.Classes.Model.Bincard> GetBincardTransaction(string criteria)
       {
           IList<CyberErp.Presentation.Psms.Web.Classes.Model.Bincard> voucherDetailtransactionList = new List<CyberErp.Presentation.Psms.Web.Classes.Model.Bincard>();

           var salesTransactionData = GetBincardTransactionData(criteria);

           while (salesTransactionData.Read())
           {
               var SalesTransaction = GetBincardObject(salesTransactionData);
               voucherDetailtransactionList.Add(SalesTransaction);
           }
           return voucherDetailtransactionList;

       }



       public SqlDataReader GetSalesTransactionData(int start, int limit, string criteria)
        {
            if (criteria != "")
                criteria = "Where  " + criteria;
          var sqlInsertQuery = string.Format("select code, voucherDefinition, consignee, article, IssuedDate, quantity, unitAmt, UOM, totalAmount, calculatedCost, period, name, grandTotal,branch FROM SalesTransaction "+ criteria+ " ORDER BY Id DESC offset "+start.ToString()+" rows fetch next "+ limit.ToString()+" rows only");

            var reader = DataGetCommand(sqlInsertQuery);
            return reader;
        }
       public SqlDataReader GetVoucherDetailTransactionData( string criteria)
       {
           var sqlInsertQuery = string.Format(" select itemId,itemUnitPrice,Quantity from ifmsVoucherDetail inner join ifmsVoucherHeader on VoucherHeaderId=ifmsVoucherHeader.Id where not itemId is null and cast( ifmsVoucherDetail.remark as nvarchar(100))='Unearned Revenue' and " + criteria);

           var reader = DataGetCommand(sqlInsertQuery);
           return reader;
       }

       public SqlDataReader GetVoucherDetailMaunalSalesTransactionData(string criteria)
       {
           var status=Guid.Parse( Constants.Voucher_Status_Issued);
           var sqlInsertQuery = string.Format(" select itemId,itemUnitPrice,Quantity from slmsManualSalesDetail inner join slmsManualSalesHeader on SalesHeaderId=slmsManualSalesHeader.Id where slmsManualSalesHeader.stattusId='" + status + "' and " + criteria);

           var reader = DataGetCommand(sqlInsertQuery);
           return reader;
       }
       public SqlDataReader GetBincardTransactionData(string criteria)
       {
           var status = Guid.Parse(Constants.Voucher_Status_Issued);
           var sqlInsertQuery = string.Format(" SELECT  psmsBinCard.Id, StoreId, ItemId, VoucherTypeId,VoucherId, CurrentQuantity, ReceivedQuantity, IssuedQuantity, UnitCost, psmsBinCard.CreatedAt, FromStoreId, FromVoucherId,VoucherNo,IdentityId,psmsBinCard.UpdatedAt from psmsBinCard left outer join lupVoucherType on VoucherTypeId=lupVoucherType.Id where  " + criteria);

           var reader = DataGetCommand(sqlInsertQuery);
           return reader;
       }

       public long GetSalesTransactionCount(string criteria)
        {
            if (criteria != "")
                criteria = "Where  " + criteria;
            var sqlInsertQuery = string.Format("select count(*) FROM SalesTransaction " + criteria);

            var reader = DataGetCommand(sqlInsertQuery);
            long count = 0;
            while (reader.Read())
            {
               count =long.Parse( reader.GetValue(0).ToString());
            }
            return count;
        }
        public CyberErp.Presentation.Psms.Web.Classes.Model.SalesTransaction GetSalesTransactionObject(SqlDataReader Reader)
        {

             var SalesTransaction = new CyberErp.Presentation.Psms.Web.Classes.Model.SalesTransaction();
          
            SalesTransaction.code = Reader.GetValue(0).ToString();
            if (Reader.GetValue(1) != null)
                SalesTransaction.voucherDefinition = Reader.GetValue(1).ToString();
            if (Reader.GetValue(2) != null)
                SalesTransaction.consignee = Reader.GetValue(2).ToString();
            SalesTransaction.article = Reader.GetValue(3).ToString();
            SalesTransaction.IssuedDate = DateTime.Parse(Reader.GetValue(4).ToString());
            SalesTransaction.quantity = decimal.Parse(Reader.GetValue(5).ToString());
            SalesTransaction.unitAmt = decimal.Parse( Reader.GetValue(6).ToString());
            SalesTransaction.UOM = Reader.GetValue(7).ToString();
            SalesTransaction.totalAmount = decimal.Parse(Reader.GetValue(8).ToString());
            SalesTransaction.calculatedCost = decimal.Parse(Reader.GetValue(9).ToString());
            SalesTransaction.period = Reader.GetValue(10).ToString();
            SalesTransaction.name = Reader.GetValue(11).ToString();
            SalesTransaction.grandTotal = decimal.Parse(Reader.GetValue(12).ToString());
        

            return SalesTransaction;
        }

        public CyberErp.Presentation.Psms.Web.Classes.Model.Bincard GetBincardObject(SqlDataReader Reader)
        {

            var bincardTransaction = new CyberErp.Presentation.Psms.Web.Classes.Model.Bincard();

            bincardTransaction.Id =Guid.Parse( Reader.GetValue(0).ToString());
            bincardTransaction.StoreId = Guid.Parse(Reader.GetValue(1).ToString());
            bincardTransaction.ItemId = Guid.Parse(Reader.GetValue(2).ToString());
          
            if (Reader.GetValue(3) != null  && Reader.GetValue(3).ToString() != "")        
            bincardTransaction.VoucherTypeId = Guid.Parse(Reader.GetValue(3).ToString());
           if (Reader.GetValue(4) != null  && Reader.GetValue(4).ToString() != "")        
             bincardTransaction.VoucherId = Guid.Parse(Reader.GetValue(4).ToString());
            bincardTransaction.CurrentQuantity = double.Parse(Reader.GetValue(5).ToString());
            bincardTransaction.ReceivedQuantity = double.Parse(Reader.GetValue(6).ToString());
            bincardTransaction.IssuedQuantity = double.Parse(Reader.GetValue(7).ToString());
            bincardTransaction.UnitCost = decimal.Parse(Reader.GetValue(8).ToString());
            bincardTransaction.CreatedAt = DateTime.Parse(Reader.GetValue(9).ToString());

            if (Reader.GetValue(10) != null && Reader.GetValue(10).ToString() != "")
                bincardTransaction.FromStoreId = Guid.Parse(Reader.GetValue(10).ToString());
            if (Reader.GetValue(11) != null && Reader.GetValue(11).ToString() != "")
                bincardTransaction.FromVoucherId = Guid.Parse(Reader.GetValue(11).ToString());
            bincardTransaction.VoucherNo = Reader.GetValue(12).ToString();
            if (Reader.GetValue(13) != null && Reader.GetValue(13).ToString() != "")
                bincardTransaction.IdentityId = long.Parse(Reader.GetValue(13).ToString());

            if (Reader.GetValue(14) != null && Reader.GetValue(14).ToString() != "")
                bincardTransaction.UpdatedAt = DateTime.Parse(Reader.GetValue(14).ToString());
         
            return bincardTransaction;
        }

       
          public CyberErp.Presentation.Psms.Web.Classes.Model.VoucherDetail GetVoucherDetailObject(SqlDataReader Reader)
        {

            var voucherDetail = new CyberErp.Presentation.Psms.Web.Classes.Model.VoucherDetail();
            decimal value = 0;
                voucherDetail.ItemId =Guid.Parse( Reader.GetValue(0).ToString());
             if (Reader.GetValue(1) != null)
             {
                 decimal.TryParse(Reader.GetValue(1).ToString(), out value);
                 voucherDetail.ItemUnitPrice = value;
          
             }
             if (Reader.GetValue(2) != null)
             {
                 decimal.TryParse(Reader.GetValue(2).ToString(), out value);
                 voucherDetail.Quantity = value;

             }
              return voucherDetail;
        }

        #endregion
        private void DataExcuteCommand(string query)
        {
            SqlCommand command = new SqlCommand();
            var connection = new SqlConnection(connString);

            connection.Open();
            command.Connection = connection;
            command.CommandText = query;
            command.ExecuteNonQuery();
            connection.Close();

        }
        private SqlDataReader DataGetCommand(string query)
        {
            SqlCommand command = new SqlCommand();
            var connection = new SqlConnection(connString);
            connection.Open();
            command.Connection = connection;
            command.CommandText = query;
            var result = command.ExecuteReader();
            
            return result;

        }
    }
}
