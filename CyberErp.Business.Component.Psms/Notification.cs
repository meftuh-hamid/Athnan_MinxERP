using CyberErp.Data.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;

namespace CyberErp.Business.Component.Psms
{
    public class Notification : BaseModel<psmsNotification>
    {
        private readonly DbContext _dbContext;

        public Notification(DbContext dbContext)
            : base(dbContext)
        {
            _dbContext = dbContext;
        }
        public void SaveNotification(string title, string message, Guid voucherStatusId, Guid voucherTypeId, string employeeId)
        {


            var notification = new psmsNotification();
            notification.Id = Guid.NewGuid();
            notification.EmployeeId = employeeId;
            notification.VoucherStatusId = voucherStatusId;
            notification.VoucherTypeId = voucherTypeId;
            notification.Title = title;
            notification.Date = DateTime.Now;
            notification.IsViewed = false;
            notification.IsEmailed = false;
            notification.CreatedAt = DateTime.Now;
            notification.UpdatedAt = DateTime.Now;
            notification.Message = message;

           this.AddNew(notification);
           _dbContext.SaveChanges();
        }
        public void SaveNotification(string title, string message, Guid voucherId, string voucherNo, Guid voucherStatusId, Guid voucherTypeId, string employeeId, Guid? storeId, Guid? unitId)
        {

            var notification = new psmsNotification();
            notification.Id = Guid.NewGuid();
            notification.EmployeeId = employeeId;
            notification.VoucherStatusId = voucherStatusId;
            notification.VoucherTypeId = voucherTypeId;
            notification.VoucherId = voucherId;
            notification.VoucherNo = voucherNo;
            notification.Title = title;
            notification.Date = DateTime.Now;
            notification.IsViewed = false;
            notification.IsEmailed = false;
            notification.CreatedAt = DateTime.Now;
            notification.UpdatedAt = DateTime.Now;
            notification.IsResponsed = false;
            notification.StoreId = storeId;
            notification.UnitId = unitId;
            notification.Message = message;

            this.AddNew(notification);
        }
        public void SaveNotification(string title, string message, Guid voucherId, string voucherNo, Guid voucherStatusId, Guid voucherTypeId, string employeeId, Guid? storeId, Guid? unitId,string criteria)
        {

            var notification = new psmsNotification();
            notification.Id = Guid.NewGuid();
            notification.EmployeeId = employeeId;
            notification.VoucherStatusId = voucherStatusId;
            notification.VoucherTypeId = voucherTypeId;
            notification.VoucherId = voucherId;
            notification.VoucherNo = voucherNo;
            notification.Title = title;
            notification.Date = DateTime.Now;
            notification.IsViewed = false;
            notification.IsEmailed = false;
            notification.CreatedAt = DateTime.Now;
            notification.UpdatedAt = DateTime.Now;
            notification.IsResponsed = false;
            notification.StoreId = storeId;
            notification.UnitId = unitId;
            notification.Message = message;
            notification.Criteria = criteria;
            this.AddNew(notification);
        }
       public void VoidNotification(Guid voucherTypeId,Guid voucherId)
        {
                     _dbContext.Database.ExecuteSqlCommand(
           "Delete psmsNotification where voucherTypeId={0} and voucherId={1} and IsResponsed=0", voucherTypeId,voucherId); 

        }
       public void VoidAllNotification(Guid voucherTypeId, Guid voucherId)
       {
           _dbContext.Database.ExecuteSqlCommand(
 "Delete psmsNotification where voucherTypeId={0} and voucherId={1} ", voucherTypeId, voucherId);
           _dbContext.Database.ExecuteSqlCommand(
         "Delete psmsVoucherStatusTransaction where voucherTypeId={0} and voucherId={1} ", voucherTypeId, voucherId);

       }
       public bool CheckCriteria(string approverCriteria, string voucherCriteria)
       {
           var status = false;
           var criteriaCount = 0;
           var successCount = 0;
           if (voucherCriteria != null && voucherCriteria != "")
           {
               if (approverCriteria != null && approverCriteria != "")
               {
                   voucherCriteria = voucherCriteria.Remove(voucherCriteria.Length - 1);

                   var voucherCriteriaList = voucherCriteria.Split(';');
                   var approverCriterialist = approverCriteria.Split(';');
                   for (int i = 0; i < voucherCriteriaList.Count(); i++)
                   {
                       var vCriteriaList = voucherCriteriaList[i].Split(new char[] { ',' });
                       criteriaCount = vCriteriaList.Count();
                       successCount = 0;
                       foreach (var vCriteria in vCriteriaList)
                       {
                           decimal numberValue1 = 0; string stringValue1 = "";
                           var NameValueList = vCriteria.Split(':');
                           var name = NameValueList[0].ToString();
                           if (!decimal.TryParse(NameValueList[1].ToString(), out numberValue1))
                               stringValue1 = NameValueList[1].ToString();
                           for (int j = 0; j < approverCriterialist.Count(); j++)
                           {
                               var aCriteriaList = approverCriterialist[j].Split(',');
                               foreach (var aCriteria in aCriteriaList)
                               {
                                   decimal numberValue2 = 0; string stringValue2 = "";
                                   NameValueList = aCriteria.Split(':');
                                   var name2 = NameValueList[0].ToString();
                                   if (!decimal.TryParse(NameValueList[1].ToString(), out numberValue2))
                                       stringValue2 = NameValueList[1].ToString();

                                   if (name == name2)
                                   {
                                       if (numberValue1 > 0)
                                       {
                                           if (numberValue1 >= numberValue2)
                                           {
                                               successCount = successCount + 1;
                                           }
                                       }
                                       else
                                       {
                                           if (stringValue1 == stringValue2)
                                           {
                                               successCount = successCount + 1;
                                           }
                                       }
                                   }

                               }
                           }
                       }
                       if (criteriaCount == successCount)
                           break;
                   }

               }
            

           }
                 return criteriaCount == successCount;
       }

   
    }

}
