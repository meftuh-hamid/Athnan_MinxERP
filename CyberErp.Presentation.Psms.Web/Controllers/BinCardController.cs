﻿using System.Collections;
using System.Data.Objects;
using System;
using System.Linq;
using System.Web.Mvc;
using CyberErp.Data.Model;
using Ext.Direct.Mvc;
using CyberErp.Business.Component.Psms;
using System.Collections.Generic;
using Newtonsoft.Json;
using CyberErp.Presentation.Psms.Web.Classes;
using CyberErp.Presentation.Psms.Web.Controllers;
using System.Transactions;
using System.Data.Entity;

namespace CyberErp.Presentation.Web.Psms.Controllers
{
    public class BinCardController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<psmsBinCard> _binCard;
        private readonly BaseModel<psmsStore> _store;
        private readonly BaseModel<psmsItem> _item;
        private readonly BaseModel<coreFiscalYear> _fiscalYear;
        private readonly BaseModel<psmsInventoryRecord> _inventoryRecord;
        private readonly BaseModel<psmsIssueHeader> _issueHeader;
        private readonly BaseModel<psmsTransferIssueHeader> _transferIssueHeader;
        private readonly BaseModel<psmsReceiveHeader> _receiveHeader;
        private readonly BaseModel<psmsTransferReceiveHeader> _transferReceiveHeader;
        private readonly BaseModel<psmsReturnHeader> _retunHeader;
        private readonly BaseModel<psmsSetting> _setting;
        #endregion

        #region Constructor

        public BinCardController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _binCard = new BaseModel<psmsBinCard>(_context);
            _store = new BaseModel<psmsStore>(_context);
            _item = new BaseModel<psmsItem>(_context);
            _fiscalYear = new BaseModel<coreFiscalYear>(_context);
            _inventoryRecord = new BaseModel<psmsInventoryRecord>(_context);
            _issueHeader = new BaseModel<psmsIssueHeader>(_context);
            _transferIssueHeader = new BaseModel<psmsTransferIssueHeader>(_context);
            _receiveHeader = new BaseModel<psmsReceiveHeader>(_context);
            _transferReceiveHeader = new BaseModel<psmsTransferReceiveHeader>(_context);
            _retunHeader = new BaseModel<psmsReturnHeader>(_context);
            _setting = new BaseModel<psmsSetting>(_context);

        }

        #endregion

        #region Actions
        public ActionResult GetDocumentNo()
        {
            var setting = _setting.GetAll().AsQueryable().Where(o => o.Name == Constants.recalculateTime_setting_Name).FirstOrDefault();
            if (setting != null)
            {
                setting.Value = DateTime.Now.ToString();
                _context.SaveChanges();
            }
            var Constantsfields = new
            {
                Date = setting.Value
            };
            var result = new
            {
                total = 1,
                data = Constantsfields
            };
            return this.Direct(result);
        }
       
        public ActionResult GetAll(int start, int limit, string sort, string dir, string record)
        {

            var ht = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid storeId, itemId;
            Guid.TryParse(ht["storeId"].ToString(), out storeId);
            Guid.TryParse(ht["itemId"].ToString(), out itemId);
            var searchText = ht["searchText"] != null ? ht["searchText"].ToString() : "";

            Guid activeFiscalYearId = GetCurrentFiscalYear();

            var filtered = _binCard.GetAll().AsQueryable().Where(i => i.StoreId == storeId && i.FiscalYearId == activeFiscalYearId && i.ItemId == itemId);
           
            filtered = searchText != "" ? filtered.Where(s =>

               s.VoucherNo.Contains(searchText.ToUpper()) ||
               s.psmsItem.psmsItemCategory.Name.ToUpper().Contains(searchText.ToUpper()) ||
               (s.VoucherTypeId!=null?  s.lupVoucherType.Name.ToUpper().Contains(searchText.ToUpper()):false) ||
               s.psmsItem.lupItemType.Name.ToUpper().Contains(searchText.ToUpper()) ||
               s.psmsItem.PartNumber.ToUpper().Contains(searchText.ToUpper()) ||
               s.psmsItem.Code.ToUpper().Contains(searchText.ToUpper()) ||
               s.psmsItem.Name.ToUpper().Contains(searchText.ToUpper()) ||
               s.Remark.ToUpper().Contains(searchText.ToUpper()) || 
               s.psmsItem.lupMeasurementUnit.Name.ToUpper().Contains(searchText.ToUpper())) : filtered;
           
            var startDate = ht["startDate"] != null ? ht["startDate"].ToString() : "";
            var endDate = ht["endDate"] != null ? ht["endDate"].ToString() : "";

            if (!string.IsNullOrEmpty(startDate))
            {
                DateTime transactionStartDate;
                DateTime.TryParse(startDate, out transactionStartDate);
                filtered = filtered.Where(v => v.Date >= transactionStartDate);
            }
            if (!string.IsNullOrEmpty(endDate))
            {
                DateTime transactionEndDate;
                DateTime.TryParse(endDate, out transactionEndDate);
                filtered = filtered.Where(v => v.Date <= transactionEndDate);
            }
            var count = filtered.Count();
            filtered = filtered.OrderBy(o => o.Date).ThenBy(o => o.CreatedAt).ThenBy(o => o.lupVoucherType.Code).ThenBy(o => o.VoucherNo).Skip(start).Take(limit);

            var BinCards = filtered.Select(item => new
            {
                item.Id,
                item.Date,
                item.VoucherTypeId,
                item.VoucherId,
                item.VoucherNo,
                item.Remark,
                VoucherType=item.VoucherTypeId.HasValue?item.lupVoucherType.Name:"Beginning",
                item.ReceivedQuantity,
                item.IssuedQuantity,
                BalanceQuantity = item.CurrentQuantity,
                item.CreatedAt,
            }).ToList().Select(item => new
            {
                item.Id,
                Date = string.Format("{0:MMMM dd, yyyy}", item.Date),
                ReferenceNo = item.VoucherNo,
                item.ReceivedQuantity,
                item.VoucherType,
                item.Remark,
                item.VoucherTypeId,
                item.VoucherId,
                item.IssuedQuantity,
                item.BalanceQuantity,
                CreatedAt=item.CreatedAt.ToString(),
            
            });

            var result = new
            {
                total = count,
                data = BinCards,
                success = true
            };
            return this.Direct(result);

        }


        public ActionResult GetItemsFromStore(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            Guid activeFiscalYearId = GetCurrentFiscalYear();
            Guid storeId;
            Guid.TryParse(hashtable["storeId"].ToString(), out storeId);
            DateTime unParsedEndDate = DateTime.Now;

             var searchText = hashtable["searchText"] != null ? hashtable["searchText"].ToString() : "";

            var filtered = _item.GetAll().AsQueryable();
            //filtered = filtered.Where(i =>i.psmsInventoryRecord.Where(f=>f.FiscalYearId==activeFiscalYearId && f.StoreId==storeId && f.IsClosed==false).Any());

            filtered = searchText != "" ? filtered.Where(s =>

                s.Code.ToUpper().Contains(searchText.ToUpper()) ||
                s.Name.ToUpper().Contains(searchText.ToUpper()) ||
                s.psmsItemCategory.Name.ToUpper().Contains(searchText.ToUpper()) ||
                s.lupItemType.Name.ToUpper().Contains(searchText.ToUpper()) ||
                s.PartNumber.ToUpper().Contains(searchText.ToUpper()) ||
                s.lupMeasurementUnit.Name.ToUpper().Contains(searchText.ToUpper())) : filtered;
            switch (sort)
            {

                case "Name":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Name) : filtered.OrderByDescending(u => u.Name);
                    break;
                case "Code":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Code) : filtered.OrderByDescending(u => u.Code);
                    break;
                case "PartNumber":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.PartNumber) : filtered.OrderByDescending(u => u.PartNumber);
                    break;

                case "MeasurementUnit":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.lupMeasurementUnit.Name) : filtered.OrderByDescending(u => u.lupMeasurementUnit.Name);
                    break;
                default:
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.CreatedAt) : filtered.OrderByDescending(u => u.CreatedAt);
                    break;
            }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);

            var items = filtered.Select(item => new
            {
                item.Id,
                item.Name,
                item.Code,
                item.PartNumber,
                MeasurementUnit = item.lupMeasurementUnit.Name,
                item.CreatedAt

            }).ToList();

            var result = new
            {
                total = count,
                data = items
            };
            return this.Direct(result);
        }
   
     

        public void ExportToExcel()
        {
            try
            {
                Guid activeFiscalYearId = GetCurrentFiscalYear();
                Guid itemId, storeId;
                Guid.TryParse(Request.QueryString["itemId"].ToString(), out itemId);
                Guid.TryParse(Request.QueryString["storeId"].ToString(), out storeId);
                var startDate =""; var endDate="";
                if(Request.QueryString["startDate"]!=null)startDate = Request.QueryString["startDate"].ToString();
                 if(Request.QueryString["startDate"]!=null)endDate = Request.QueryString["endDate"].ToString();
                 var searchText = Request.QueryString["searchText"] != null ? Request.QueryString["searchText"] : "";
             
                var filtered = _binCard.GetAll().AsQueryable().Where(i => i.StoreId == storeId && i.FiscalYearId == activeFiscalYearId && i.ItemId == itemId);

                filtered = searchText != "" ? filtered.Where(s =>

              s.VoucherNo.Contains(searchText.ToUpper()) ||
              s.psmsItem.psmsItemCategory.Name.ToUpper().Contains(searchText.ToUpper()) ||
              (s.VoucherTypeId != null ? s.lupVoucherType.Name.ToUpper().Contains(searchText.ToUpper()) : false) ||
              s.psmsItem.lupItemType.Name.ToUpper().Contains(searchText.ToUpper()) ||
              s.psmsItem.PartNumber.ToUpper().Contains(searchText.ToUpper()) ||
              s.psmsItem.Code.ToUpper().Contains(searchText.ToUpper()) ||
              s.psmsItem.Name.ToUpper().Contains(searchText.ToUpper()) ||
              s.Remark.ToUpper().Contains(searchText.ToUpper()) ||
              s.psmsItem.lupMeasurementUnit.Name.ToUpper().Contains(searchText.ToUpper())) : filtered;

                if (!string.IsNullOrEmpty(startDate))
                {
                    DateTime transactionStartDate;
                    DateTime.TryParse(startDate, out transactionStartDate);
                    filtered = filtered.Where(v => v.Date >= transactionStartDate);
                }
                if (!string.IsNullOrEmpty(endDate))
                {
                    DateTime transactionEndDate;
                    DateTime.TryParse(endDate, out transactionEndDate);
                    filtered = filtered.Where(v => v.Date <= transactionEndDate);
                }

                var count = filtered.Count();
                filtered = filtered.OrderBy(o => o.Date).ThenBy(o => o.CreatedAt).ThenBy(o => o.lupVoucherType.Code).ThenBy(o => o.VoucherNo);

                var BinCards = filtered.Select(item => new
                {
                    item.Id,
                    item.Date,
                    item.VoucherTypeId,
                    item.psmsItem.Name,
                    item.psmsItem.Code,
                    VoucherType = item.VoucherTypeId.HasValue ? item.lupVoucherType.Name : "Beginning",         
                    item.VoucherNo,
                    item.ReceivedQuantity,
                    item.IssuedQuantity,
                    BalanceQuantity = item.CurrentQuantity,
                      item.Remark
                }).ToList().Select(item => new
                {
                    item.Name,
                    item.Code,
                    Date = string.Format("{0:MMMM dd, yyyy}", item.Date),
                    item.VoucherType,
                    ReferenceNo = item.VoucherNo,
                    ReceivedQty = item.ReceivedQuantity,
                    IssuedQty = item.IssuedQuantity,
                    Balance = item.BalanceQuantity,
                    item.Remark
                });


                var exportToExcelHelper = new ExportToExcelHelper();
                exportToExcelHelper.ToExcel(Response, BinCards);
            }
            catch (Exception e)
            {

            }
        }

        #endregion
    
        #region methods
         private Guid GetCurrentFiscalYear()
        {
            Guid activeFiscalYearId = _fiscalYear.GetAll().Where(o => o.IsActive == true && o.IsClosed == false).First().Id;
            return activeFiscalYearId;
        }
        #endregion
    }
}