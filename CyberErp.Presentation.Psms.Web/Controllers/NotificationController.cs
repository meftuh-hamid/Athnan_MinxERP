using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CyberErp.Business.Component;
using System.Data.Objects;
using CyberErp.Data.Model;
using System.Collections;
using CyberErp.Business.Component.Psms;
using Newtonsoft.Json;
using CyberErp.Presentation.Psms.Web.Classes;
using Ext.Direct.Mvc;
using System.Data.Entity;

namespace CyberErp.Presentation.Web.Psms.Controllers
{
    public class NotificationController : Controller
    {
        #region Members

        private readonly DbContext _context;
        private readonly Notification _notification;
        private readonly BaseModel<coreVoucherWorkFlow> _voucherWorkFlow;
        private readonly BaseModel<psmsApprover> _approver;
       

        #endregion

        #region Constructor

        public NotificationController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _notification = new Notification(_context);
            _approver = new BaseModel<psmsApprover>(_context);
            _voucherWorkFlow = new BaseModel<coreVoucherWorkFlow>(_context);
        }

        #endregion

        #region Actions


        public ActionResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";
            var employeeId = getCurrentEmployee().ToString();
            var filtered = _notification.GetAll().AsQueryable().Where(o => o.IsResponsed == false && o.EmployeeId.Contains(employeeId));
            filtered = searchText != "" ? filtered.Where(i =>


                i.Message.ToUpper().Contains(searchText.ToUpper()) ||
                i.Title.ToUpper().Contains(searchText.ToUpper()) ||
                i.lupVoucherType.Name.ToUpper().Contains(searchText.ToUpper()))
                : filtered;
            switch (sort)
            {

                case "Type":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.lupVoucherType.Name) : filtered.OrderByDescending(u => u.lupVoucherType.Name);
                    break;
                case "Title":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Title) : filtered.OrderByDescending(u => u.Title);
                    break;
                case "Date":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Date) : filtered.OrderByDescending(u => u.Date);
                    break;
                case "Message":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Message) : filtered.OrderByDescending(u => u.Message);
                    break;
                default:
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                    break;
            }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);

            var Notifications = filtered.Select(item => new
            {
                item.Id,
                item.EmployeeId,
                Employee = "",
                item.VoucherTypeId,
                item.VoucherId,
                Type = item.lupVoucherType.Name,
                VoucherStatus = item.lupVoucherStatus.Name,
                item.Message,
                item.Title,
                item.VoucherStatusId,
                item.Response,
                item.Date,
                item.StoreId,
                item.UnitId,
                item.Criteria,
                item.IsViewed,
                item.VoucherNo,
                item.CreatedAt

            }).ToList().Select(item => new
            {
                item.Id,
                item.EmployeeId,
                item.Employee,
                item.VoucherTypeId,
                item.Type,
                item.VoucherId,
                item.StoreId,
                item.UnitId,
                item.VoucherNo,
                Status = item.VoucherStatus,
                VoucherStatus = "To be " + item.VoucherStatus,
                Supplier = item.Message.Split(')').Count() > 1 ? item.Message.Split(')').FirstOrDefault() : "",
                Message = item.Message.Split(')').LastOrDefault(),
                item.Title,
                item.Criteria,
                item.VoucherStatusId,
                item.Response,
                Date = item.Date.ToShortDateString(),
                item.IsViewed,
                item.CreatedAt

            }).ToList();
            var result = new
            {
                total = count,
                data = Notifications
            };
            return this.Direct(result);
        }
        public ActionResult UpdateViewStatus(Guid id)
        {
            var record = _notification.Get(a=>a.Id==id);
            record.IsViewed = true;
            _context.SaveChanges();


            return this.Direct(new { success = true, data = "Data has been successfully deleted!" });
        }
        private Guid getCurrentEmployee()
        {
            var employeeId = Guid.Empty;
            var objUser = (coreUser)Session[Constants.CurrentUser];
            if (objUser != null && objUser.EmployeeId != null)
            {
                employeeId = (Guid)objUser.Id;
            }
            return employeeId;
        }
        private string getCurrentEmployeeName()
        {
            var employee = "";
            var objUser = (coreUser)Session[Constants.CurrentUser];
            if (objUser != null && objUser.EmployeeId != null)
            {
                employee = objUser.FirstName + " " + objUser.LastName;
            }
            return employee;
        }
        public DirectResult Save(Guid notificationId, string title, Guid voucherId, string voucherNo, Guid voucherTypeId, Guid voucherStatusId, string voucherStatus, string message, string response, string action, string criteria, Guid? storeId, Guid? unitId)
        {
            try
            {
                var notification = new psmsNotification
                {
                    Id = notificationId,
                    VoucherId = voucherId,
                    VoucherNo = voucherNo,
                    VoucherTypeId = voucherTypeId,
                    VoucherStatusId = action == "reject" ?Guid.Parse( Constants.Voucher_Status_Rejected) : voucherStatusId,
                    Message = message,
                    Response = response,
                    Criteria = criteria,
                    StoreId = storeId,
                    UnitId = unitId,
                    Title = title
                };
                UpdateVoucher(notification, voucherStatus);
                if (action != "reject")
                    AddNotification(notification);
                _context.SaveChanges();
                return this.Direct(new { success = true, data = "Goods Request has been added Successfully!" });
            }
            catch (Exception exception)
            {
                return this.Direct(new { success = false, data = exception.InnerException != null ? exception.InnerException.Message : exception.Message });
            }

        }
        #endregion
        #region Methods
        private void UpdateVoucher(psmsNotification notification, string status)
        {
            if (notification.VoucherTypeId ==Guid.Parse( Constants.Voucher_Type_StoreRequisition))
            {
                var query = "Update psmsNotification set IsViewed=1, IsResponsed=1,Response='" + notification.Response + "' where id='" + notification.Id + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = "Update psmsStoreRequisitionHeader set statusId='" + notification.VoucherStatusId + "' where id='" + notification.VoucherId + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = string.Format("Insert into psmsVoucherStatusTransaction(Id,Date,EmployeeId,VoucherId,VoucherNumber,EmployeeName,StatusId,StatusName,VoucherTypeId,Remark,IsDeleted) values('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}',0)", Guid.NewGuid(), DateTime.Now, getCurrentEmployee(), notification.VoucherId, notification.VoucherNo, getCurrentEmployeeName(), notification.VoucherStatusId.Value, status, notification.VoucherTypeId, notification.Response);
                _context.Database.ExecuteSqlCommand(query);
            }
            else if (notification.VoucherTypeId == Guid.Parse( Constants.Voucher_Type_StoreIssue))
            {
                var query = "Update psmsNotification set IsViewed=1, IsResponsed=1,Response='" + notification.Response + "' where id='" + notification.Id + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = "Update psmsIssueHeader set statusId='" + notification.VoucherStatusId + "' where id='" + notification.VoucherId + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = string.Format("Insert into psmsVoucherStatusTransaction(Id,Date,EmployeeId,VoucherId,VoucherNumber,EmployeeName,StatusId,StatusName,VoucherTypeId,Remark,IsDeleted) values('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}',0)", Guid.NewGuid(), DateTime.Now, getCurrentEmployee(), notification.VoucherId, notification.VoucherNo, getCurrentEmployeeName(), notification.VoucherStatusId.Value, status, notification.VoucherTypeId, notification.Response);
                _context.Database.ExecuteSqlCommand(query);
            }
            else if (notification.VoucherTypeId ==Guid.Parse(  Constants.Voucher_Type_StoreTransferIssue))
            {
                var query = "Update psmsNotification set IsViewed=1, IsResponsed=1,Response='" + notification.Response + "' where id='" + notification.Id + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = "Update psmsTransferIssueHeader set statusId='" + notification.VoucherStatusId + "' where id='" + notification.VoucherId + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = string.Format("Insert into psmsVoucherStatusTransaction(Id,Date,EmployeeId,VoucherId,VoucherNumber,EmployeeName,StatusId,StatusName,VoucherTypeId,Remark,IsDeleted) values('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}',0)", Guid.NewGuid(), DateTime.Now, getCurrentEmployee(), notification.VoucherId, notification.VoucherNo, getCurrentEmployeeName(), notification.VoucherStatusId.Value, status, notification.VoucherTypeId, notification.Response);
                _context.Database.ExecuteSqlCommand(query);
            }
            else if (notification.VoucherTypeId == Guid.Parse( Constants.Voucher_Type_StoreTransferReceive))
            {
                var query = "Update psmsNotification set IsViewed=1, IsResponsed=1,Response='" + notification.Response + "' where id='" + notification.Id + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = "Update psmsTransferReceiveHeader set statusId='" + notification.VoucherStatusId + "' where id='" + notification.VoucherId + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = string.Format("Insert into psmsVoucherStatusTransaction(Id,Date,EmployeeId,VoucherId,VoucherNumber,EmployeeName,StatusId,StatusName,VoucherTypeId,Remark,IsDeleted) values('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}',0)", Guid.NewGuid(), DateTime.Now, getCurrentEmployee(), notification.VoucherId, notification.VoucherNo, getCurrentEmployeeName(), notification.VoucherStatusId.Value, status, notification.VoucherTypeId, notification.Response);
                _context.Database.ExecuteSqlCommand(query);
            }
            else if (notification.VoucherTypeId == Guid.Parse( Constants.Voucher_Type_StoreReceive))
            {
                var query = "Update psmsNotification set IsViewed=1, IsResponsed=1,Response='" + notification.Response + "' where id='" + notification.Id + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = "Update psmsReceiveHeader set statusId='" + notification.VoucherStatusId + "' where id='" + notification.VoucherId + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = string.Format("Insert into psmsVoucherStatusTransaction(Id,Date,EmployeeId,VoucherId,VoucherNumber,EmployeeName,StatusId,StatusName,VoucherTypeId,Remark,IsDeleted) values('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}',0)", Guid.NewGuid(), DateTime.Now, getCurrentEmployee(), notification.VoucherId, notification.VoucherNo, getCurrentEmployeeName(), notification.VoucherStatusId.Value, status, notification.VoucherTypeId, notification.Response);
                _context.Database.ExecuteSqlCommand(query);
            }
            else if (notification.VoucherTypeId == Guid.Parse( Constants.Voucher_Type_StoreReturn))
            {
                var query = "Update psmsNotification set IsViewed=1, IsResponsed=1,Response='" + notification.Response + "' where id='" + notification.Id + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = "Update psmsReturnHeader set statusId='" + notification.VoucherStatusId + "' where id='" + notification.VoucherId + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = string.Format("Insert into psmsVoucherStatusTransaction(Id,Date,EmployeeId,VoucherId,VoucherNumber,EmployeeName,StatusId,StatusName,VoucherTypeId,Remark,IsDeleted) values('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}',0)", Guid.NewGuid(), DateTime.Now, getCurrentEmployee(), notification.VoucherId, notification.VoucherNo, getCurrentEmployeeName(), notification.VoucherStatusId.Value, status, notification.VoucherTypeId, notification.Response);
                _context.Database.ExecuteSqlCommand(query);
            }
            else if (notification.VoucherTypeId == Guid.Parse( Constants.Voucher_Type_PurchaseRequest))
            {
                var query = "Update psmsNotification set IsViewed=1, IsResponsed=1,Response='" + notification.Response + "' where id='" + notification.Id + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = "Update psmsPurchaseRequestHeader set statusId='" + notification.VoucherStatusId + "' where id='" + notification.VoucherId + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = string.Format("Insert into psmsVoucherStatusTransaction(Id,Date,EmployeeId,VoucherId,VoucherNumber,EmployeeName,StatusId,StatusName,VoucherTypeId,Remark,IsDeleted) values('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}',0)", Guid.NewGuid(), DateTime.Now, getCurrentEmployee(), notification.VoucherId, notification.VoucherNo, getCurrentEmployeeName(), notification.VoucherStatusId.Value, status, notification.VoucherTypeId, notification.Response);
                _context.Database.ExecuteSqlCommand(query);
            }
            else if (notification.VoucherTypeId == Guid.Parse( Constants.Voucher_Type_PurchaseOrder))
            {
                var query = "Update psmsNotification set IsViewed=1, IsResponsed=1,Response='" + notification.Response + "' where id='" + notification.Id + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = "Update psmsPurchaseOrderHeader set statusId='" + notification.VoucherStatusId + "' where id='" + notification.VoucherId + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = string.Format("Insert into psmsVoucherStatusTransaction(Id,Date,EmployeeId,VoucherId,VoucherNumber,EmployeeName,StatusId,StatusName,VoucherTypeId,Remark,IsDeleted) values('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}',0)", Guid.NewGuid(), DateTime.Now, getCurrentEmployee(), notification.VoucherId, notification.VoucherNo, getCurrentEmployeeName(), notification.VoucherStatusId.Value, status, notification.VoucherTypeId, notification.Response);
                _context.Database.ExecuteSqlCommand(query);
            }
          
            else if (notification.VoucherTypeId == Guid.Parse( Constants.Voucher_Type_DeliveryOrder))
            {
                var query = "Update psmsNotification set IsViewed=1, IsResponsed=1,Response='" + notification.Response + "' where id='" + notification.Id + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = "Update psmsDeliveryOrderHeader set statusId='" + notification.VoucherStatusId + "' where id='" + notification.VoucherId + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = string.Format("Insert into psmsVoucherStatusTransaction(Id,Date,EmployeeId,VoucherId,VoucherNumber,EmployeeName,StatusId,StatusName,VoucherTypeId,Remark,IsDeleted) values('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}',0)", Guid.NewGuid(), DateTime.Now, getCurrentEmployee(), notification.VoucherId, notification.VoucherNo, getCurrentEmployeeName(), notification.VoucherStatusId.Value, status, notification.VoucherTypeId, notification.Response);
                _context.Database.ExecuteSqlCommand(query);
            }
            else if (notification.VoucherTypeId == Guid.Parse( Constants.Voucher_Type_StoreAdjustment))
            {
                var query = "Update psmsNotification set IsViewed=1, IsResponsed=1,Response='" + notification.Response + "' where id='" + notification.Id + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = "Update psmsAdjustmentHeader set statusId='" + notification.VoucherStatusId + "' where id='" + notification.VoucherId + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = string.Format("Insert into psmsVoucherStatusTransaction(Id,Date,EmployeeId,VoucherId,VoucherNumber,EmployeeName,StatusId,StatusName,VoucherTypeId,Remark,IsDeleted) values('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}',0)", Guid.NewGuid(), DateTime.Now, getCurrentEmployee(), notification.VoucherId, notification.VoucherNo, getCurrentEmployeeName(), notification.VoucherStatusId.Value, status, notification.VoucherTypeId, notification.Response);
                _context.Database.ExecuteSqlCommand(query);
            }
            else if (notification.VoucherTypeId == Guid.Parse( Constants.Voucher_Type_StoreDisposal))
            {
                var query = "Update psmsNotification set IsViewed=1, IsResponsed=1,Response='" + notification.Response + "' where id='" + notification.Id + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = "Update psmsDisposalHeader set statusId='" + notification.VoucherStatusId + "' where id='" + notification.VoucherId + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = string.Format("Insert into psmsVoucherStatusTransaction(Id,Date,EmployeeId,VoucherId,VoucherNumber,EmployeeName,StatusId,StatusName,VoucherTypeId,Remark,IsDeleted) values('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}',0)", Guid.NewGuid(), DateTime.Now, getCurrentEmployee(), notification.VoucherId, notification.VoucherNo, getCurrentEmployeeName(), notification.VoucherStatusId.Value, status, notification.VoucherTypeId, notification.Response);
                _context.Database.ExecuteSqlCommand(query);
            }
            else if (notification.VoucherTypeId == Guid.Parse( Constants.Voucher_Type_proforma))
            {
                var query = "Update psmsNotification set IsViewed=1, IsResponsed=1,Response='" + notification.Response + "' where id='" + notification.Id + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = "Update slmsProformaHeader set statusId='" + notification.VoucherStatusId + "' where id='" + notification.VoucherId + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = string.Format("Insert into psmsVoucherStatusTransaction(Id,Date,EmployeeId,VoucherId,VoucherNumber,EmployeeName,StatusId,StatusName,VoucherTypeId,Remark,IsDeleted) values('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}',0)", Guid.NewGuid(), DateTime.Now, getCurrentEmployee(), notification.VoucherId, notification.VoucherNo, getCurrentEmployeeName(), notification.VoucherStatusId.Value, status, notification.VoucherTypeId, notification.Response);
                _context.Database.ExecuteSqlCommand(query);
            }
            else if (notification.VoucherTypeId == Guid.Parse( Constants.Voucher_Type_sales))
            {
                var query = "Update psmsNotification set IsViewed=1, IsResponsed=1,Response='" + notification.Response + "' where id='" + notification.Id + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = "Update slmsSalesHeader set statusId='" + notification.VoucherStatusId + "' where id='" + notification.VoucherId + "'";
                _context.Database.ExecuteSqlCommand(query);
                query = string.Format("Insert into psmsVoucherStatusTransaction(Id,Date,EmployeeId,VoucherId,VoucherNumber,EmployeeName,StatusId,StatusName,VoucherTypeId,Remark,IsDeleted) values('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}',0)", Guid.NewGuid(), DateTime.Now, getCurrentEmployee(), notification.VoucherId, notification.VoucherNo, getCurrentEmployeeName(), notification.VoucherStatusId.Value, status, notification.VoucherTypeId, notification.Response);
                _context.Database.ExecuteSqlCommand(query);
            }
       

        }
        private void AddNotification(psmsNotification notification)
        {
            var voucherWorkFlow =_voucherWorkFlow.GetAll().AsQueryable().Where(o => o.VoucherTypeId == notification.VoucherTypeId);
            var currentStep = voucherWorkFlow.Where(o => o.VoucherStatusId == notification.VoucherStatusId).FirstOrDefault();
            var nextStep = voucherWorkFlow.Where(o => o.Step == currentStep.Step + 1).FirstOrDefault();
            if (nextStep != null)
            {
                var approver = _approver.GetAll().AsQueryable().Where(o => o.VoucherTypeId == notification.VoucherTypeId && o.StatusId == nextStep.VoucherStatusId && ((o.UnitId.HasValue ? o.UnitId == notification.UnitId : true) && (o.StoreId.HasValue ? o.StoreId == notification.StoreId : true)));
                if (approver.Count() > 0)
                {
                    string approverIds = "";
                    foreach (var objApprover in approver)
                    {
                        var status = CheckCriteria(notification.Criteria, objApprover.Criteria);
                        if (status == true)
                            approverIds = approverIds + objApprover.EmployeeId.ToString() + ",";
                    }
                    SaveNotification(notification.Title, notification.Message, notification.VoucherId.Value, nextStep.VoucherStatusId, notification.VoucherTypeId.Value, approverIds, notification.Criteria, notification.StoreId, notification.UnitId);
                }
            }

        }
        private void SaveNotification(string title, string message, Guid voucherId, Guid voucherStatusId, Guid voucherTypeId, string employeeId, string criteria, Guid? storeId, Guid? unitId)
        {

            var notification = new psmsNotification();
            notification.Id = Guid.NewGuid();
            notification.EmployeeId = employeeId;
            notification.VoucherStatusId = voucherStatusId;
            notification.VoucherTypeId = voucherTypeId;
            notification.VoucherId = voucherId;
            notification.Title = title;
            notification.Date = DateTime.Now;
            notification.IsViewed = false;
            notification.IsEmailed = false;
            notification.CreatedAt = DateTime.Now;
            notification.UpdatedAt = DateTime.Now;
            notification.IsResponsed = false;
            notification.Message = message;
            notification.Criteria = criteria;
            if (storeId != Guid.Empty && storeId != null)
                notification.StoreId = storeId;
            if (unitId != Guid.Empty && unitId != null)
                notification.UnitId = unitId;

            _notification.AddNew(notification);
        }
        private bool CheckCriteria(string approverCriteria, string voucherCriteria)
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
                /*   else
                   {
                       status = true;      
                   }*/


            }
            /*  else
              {
                  status = true;
              }*/
            return criteriaCount == successCount;
        }

        #endregion
    }
}