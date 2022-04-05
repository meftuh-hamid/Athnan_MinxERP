/// <reference path="PurchaseOrder.js" />
Ext.ns('Ext.erp.ux.purchaseOrderRevision');

/**
* @desc      PurchaseOrder form
* @author    Henock Melisse
* @copyright (c) 2011, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.purchaseOrderRevision
* @class     Ext.erp.ux.purchaseOrderRevision.Form
* @extends   Ext.form.FormPanel
*/

Ext.erp.ux.purchaseOrderRevision.Form = function (config) {
    Ext.erp.ux.purchaseOrderRevision.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PurchaseOrder.Get,
            submit: PurchaseOrder.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'purchaseOrderRevision-form',
        frame: true,
        labelWidth: 100,
        padding: 5,
        autoHeight: false,
        border: false,

        loadDocument: function () {

            PurchaseOrder.GetDocumentNo(function (result) {
                var form = Ext.getCmp('purchaseOrderRevision-form').getForm();
                form.findField('VoucherNumber').setValue(result.data.DocNo);
                form.findField('StatusId').setValue(result.data.StatusId);
                form.findField('PreparedById').setValue(result.data.EmployeeId);
                form.findField('OrderedById').setValue(result.data.EmployeeId);
                form.findField('OrderedBy').setValue(result.data.Employee);
                form.findField('OrderedDate').setValue(new Date());
                form.findField('FiscalYearId').setValue(result.data.FiscalYearId);


            });


        },
        onOrderTypeChange: function () {
            var form = Ext.getCmp('purchaseOrderRevision-form').getForm();
            var orderType = form.findField('OrderType').getRawValue();
            cm = Ext.getCmp('purchaseOrderRevision-detailGrid').getColumnModel();
           
            if (orderType == "Direct") {
                form.findField('TenderNo').setVisible(false);
                form.findField('RequestForQuotationNo').setVisible(false);
                form.findField('PurchaseRequestNo').setVisible(true);

                form.findField('TenderNo').allowBlank = true;
                form.findField('RequestForQuotationNo').allowBlank = true;
                form.findField('PurchaseRequestNo').allowBlank = false;


            }
            else if (orderType == "Proforma") {
                form.findField('TenderNo').setVisible(false);
                form.findField('RequestForQuotationNo').setVisible(true);
                form.findField('PurchaseRequestNo').setVisible(false);
               
                form.findField('TenderNo').allowBlank = true;
                form.findField('RequestForQuotationNo').allowBlank = false;
                form.findField('PurchaseRequestNo').allowBlank = true;
      
            }
            else if (orderType == "Tender") {

                form.findField('TenderNo').setVisible(true);
                form.findField('RequestForQuotationNo').setVisible(false);
                form.findField('PurchaseRequestNo').setVisible(false);
                
                form.findField('TenderNo').allowBlank = false;
                form.findField('RequestForQuotationNo').allowBlank = true;
                form.findField('PurchaseRequestNo').allowBlank = true;
            }
            else {
                form.findField('TenderNo').setVisible(false);
                form.findField('RequestForQuotationNo').setVisible(false);
                form.findField('PurchaseRequestNo').setVisible(false);

                form.findField('TenderNo').allowBlank = true;
                form.findField('RequestForQuotationNo').allowBlank = true;
                form.findField('PurchaseRequestNo').allowBlank = true;


            }


        },
        baseCls: 'x-plain',
        items: [{
            layout: 'column',
            bodyStyle: 'background-color:transparent;',
            border: false,
            defaults: {
                columnWidth: .33,
                border: false,
                disabled:true,
                bodyStyle: 'background-color:transparent;',
                layout: 'form'
            },
            items: [{
                defaults: {
                    anchor: '95%',

                },
                items: [{
                    name: 'Id',
                    xtype: 'hidden'
                }, {
                    name: 'FiscalYearId',
                    xtype: 'hidden'
                }, {
                    name: 'IsRevised',
                    xtype: 'hidden'
                }, {
                    name: 'RevisedPurchaseOrderId',
                    xtype: 'hidden'
                }, {
                    name: 'RequestForQuotationHeaderId',
                    xtype: 'hidden'
                }, {
                    name: 'CertifiedDate',
                    xtype: 'hidden'
                }, {
                    name: 'PurchaseOrderId',
                    xtype: 'hidden'
                }, {
                    name: 'TenderHeaderId',
                    xtype: 'hidden'
                }, {
                    name: 'PurchaseRequestHeaderId',
                    xtype: 'hidden'
                }, {
                    name: 'SupplierId',
                    xtype: 'hidden'
                }, {
                    name: 'CreatedAt',
                    xtype: 'hidden'
                }, {
                    name: 'StatusId',
                    xtype: 'hidden'
                }, {
                    name: 'PreparedById',
                    xtype: 'hidden'
                }, {
                    name: 'CertifiedById',
                    xtype: 'hidden'
                }, {
                    name: 'ApprovedById',
                    xtype: 'hidden'
                }, {
                    name: 'OrderedById',
                    xtype: 'hidden'
                }, {
                    name: 'TaxRateIds',
                    xtype: 'hidden'
                }, {
                    name: 'TaxRate',
                    xtype: 'hidden'
                }, {
                    name: 'TotalSummarry',
                    xtype: 'hidden'
                }, {
                    name: 'StoreId',
                    xtype: 'hidden'
                }, {
                    name: 'OrderTypeId',
                    xtype: 'hidden'
                }, {
                    name: 'VoucherNumber',
                    xtype: 'textfield',
                    fieldLabel: 'Voucher Number',
                    readOnly: true,
                    allowBlank: false
                }, {
                    name: 'Version',
                    xtype: 'textfield',
                    fieldLabel: 'Version',
                    readOnly: true,
                    value:'00',
                    allowBlank: false
                }, {
                    xtype: 'compositefield',
                    fieldLabel: 'Supplier',
                    defaults: {
                        flex: 1
                    },
                    items: [{
                        hiddenName: 'Supplier',
                        xtype: 'combo',
                        fieldLabel: 'Supplier',
                        typeAhead: false,
                        hideTrigger: true,
                        minChars: 2,
                        listWidth: 280,
                        emptyText: '---Type to Search---',
                        mode: 'remote',
                        allowBlank: false,
                               tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' +'<h3><span>{Name}</span></h3> {Code}</div></tpl>',
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'Name']
                            }),
                            autoLoad: true,
                            api: { read: Psms.GetSupplierBySearch }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        pageSize: 10, listeners: {
                            select: function (cmb, rec, idx) {
                                var form = Ext.getCmp('purchaseOrderRevision-form').getForm();
                                form.findField('SupplierId').setValue(rec.id);
                            },
                            change: function (cmb, newvalue, oldvalue) {
                                if (newvalue == "") {
                                    var form = Ext.getCmp('purchaseOrderRevision-form').getForm();
                                    form.findField('SupplierId').reset();
                                }
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        width: 30,
                        id: 'new-Supplier',
                        iconCls: 'icon-add',
                        handler: function () {
                            var form = Ext.getCmp('purchaseOrderRevision-form').getForm();
                            new Ext.erp.ux.supplier.Window({
                                targetForm: form,
                            }).show();

                        }
                    }
                    ]
                }, {
                    hiddenName: 'OrderType',
                    xtype: 'combo',
                    fieldLabel: 'Order Type',
                    triggerAction: 'all',
                    mode: 'remote',
                    editable: false,
                    forceSelection: true,
                    emptyText: '---Select---',
                    allowBlank: false,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetPurchaseOrderType }
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('purchaseOrderRevision-form').getForm();
                            form.findField("OrderTypeId").setValue(rec.id);
                            Ext.getCmp('purchaseOrderRevision-form').onOrderTypeChange();
                        },
                    }
                }, {
                    hiddenName: 'TenderNo',
                    xtype: 'combo',
                    fieldLabel: 'Tender No',
                    typeAhead: false,
                    hideTrigger: true,
                    minChars: 2,
                    hidden: true,
                    listWidth: 280,
                    emptyText: '---Type to Search---',
                    mode: 'remote',
                    allowBlank: true,
                           tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' +'<h3><span>{Name}</span></h3> {Code}</div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetTenderBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10, listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('purchaseOrderRevision-form').getForm();
                            form.findField('TenderHeaderId').setValue(rec.id);
                            var supplierId = form.findField('SupplierId').getValue();

                            var grid = Ext.getCmp('purchaseOrderRevision-detailGrid');
                            var store = grid.getStore();
                            store.baseParams = { record: Ext.encode({ voucherHeaderId: rec.id, supplierId: supplierId, action: "tender" }) };
                            grid.getStore().reload({
                                params: {
                                    start: 0,
                                    limit: grid.pageSize
                                }
                            });
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('purchaseOrderRevision-form').getForm();
                                form.findField('TenderHeaderId').reset();
                            }
                        }
                    }
                }, {
                    hiddenName: 'RequestForQuotationNo',
                    xtype: 'combo',
                    fieldLabel: 'RFQ No',
                    typeAhead: false,
                    hideTrigger: true,
                    minChars: 2,
                    hidden:true,
                    listWidth: 280,
                    emptyText: '---Type to Search---',
                    mode: 'remote',
                    allowBlank: true,
                           tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' +'<h3><span>{Name}</span></h3> {Code}</div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name', 'StoreId', 'Store', 'TaxRateDescription', 'TaxRateIds', 'TaxRate']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetRequestForQuotationBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10, listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('purchaseOrderRevision-form').getForm();
                            form.findField('RequestForQuotationHeaderId').setValue(rec.id);
                            form.findField('StoreId').setValue(rec.get('StoreId'));
                            form.findField('Store').setValue(rec.get('Store'));
                            form.findField('TaxRateDescription').setValue(rec.get('TaxRateDescription'));
                            form.findField('TaxRateIds').setValue(rec.get('TaxRateIds'));
                            form.findField('TaxRate').setValue(rec.get('TaxRate'));

                            var supplierId = form.findField('SupplierId').getValue();

                            var grid = Ext.getCmp('purchaseOrderRevision-detailGrid');
                            var store = grid.getStore();
                            store.baseParams = { record: Ext.encode({ voucherHeaderId: rec.id, supplierId: supplierId, action: "requestForQuotation" }) };
                            grid.getStore().reload({
                                params: {
                                    start: 0,
                                    limit: grid.pageSize
                                }
                            });
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('purchaseOrderRevision-form').getForm();
                                form.findField('RequestForQuotationHeaderId').reset();
                            }
                        }
                    }
                }, {
                    hiddenName: 'PurchaseRequestNo',
                    xtype: 'combo',
                    fieldLabel: 'PR No',
                    typeAhead: false,
                    hideTrigger: true,
                    minChars: 2,
                    hidden: true,
                    listWidth: 280,
                    emptyText: '---Type to Search---',
                    mode: 'remote',
                    allowBlank: true,
                           tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' +'<h3><span>{Name}</span></h3> {Code}</div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name','StoreId','Store']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetPurchaseRequestBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10, listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('purchaseOrderRevision-form').getForm();
                            form.findField('PurchaseRequestHeaderId').setValue(rec.id);
                            form.findField('StoreId').setValue(rec.get('StoreId'));
                            form.findField('Store').setValue(rec.get('Store'));

                           var grid = Ext.getCmp('purchaseOrderRevision-detailGrid');
                            var store = grid.getStore();
                            store.baseParams = { record: Ext.encode({ voucherHeaderId: rec.id, action: "purchaseRequest" }) };
                            grid.getStore().reload({
                                params: {
                                    start: 0,
                                    limit: grid.pageSize
                                }
                            });
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('purchaseOrderRevision-form').getForm();
                                form.findField('PurchaseRequestHeaderId').reset();
                            }
                        }
                    }
                },   ]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [
                     {
                         hiddenName: 'Store',
                         xtype: 'combo',
                         fieldLabel: 'Store',
                         typeAhead: false,
                         width: 100,
                         hideTrigger: true,
                         minChars: 2,
                         listWidth: 280,
                         emptyText: '---Type to Search---',
                         mode: 'remote',
                         allowBlank: false,
                         hidden: false,
                                tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' +'<h3><span>{Name}</span></h3> {Code}</div></tpl>',
                         store: new Ext.data.DirectStore({
                             reader: new Ext.data.JsonReader({
                                 successProperty: 'success',
                                 idProperty: 'Id',
                                 root: 'data',
                                 fields: ['Id', 'Name']
                             }),
                             autoLoad: true,
                             api: { read: Psms.GetStoreBySearch }
                         }),
                         valueField: 'Name',
                         displayField: 'Name',
                         pageSize: 10,
                         listeners: {
                             select: function (cmb, rec, idx) {
                                 var form = Ext.getCmp('purchaseOrderRevision-form').getForm();
                                 form.findField('StoreId').setValue(rec.id);
                             },
                             change: function (cmb, newvalue, oldvalue) {
                                 if (newvalue == "") {
                                     var form = Ext.getCmp('purchaseOrderRevision-form').getForm();
                                     form.findField('StoreId').reset();

                                 }
                             }
                         }
                     }, {
                         name: 'OrderedDate',
                         xtype: 'datefield',
                         fieldLabel: 'Order Date',
                         width: 100,
                         allowBlank: false,
                         value: new Date(),
                         maxValue: (new Date()).format('m/d/Y')
                     },
                {
                        xtype: 'compositefield',
                        fieldLabel: 'Tax',
                        defaults: {
                            flex: 1
                        },
                        items: [
                            {
                            name: 'TaxRateDescription',
                            xtype: 'textfield',
                            fieldLabel: 'Tax',
                            allowBlank: true,
                            readOnly: false
                        },
                        {
                            xtype: 'button',
                            width: 30,
                            iconCls: 'icon-add',
                            handler: function () {
                                var form = Ext.getCmp('purchaseOrderRevision-form').getForm();
                                var targetGrid = Ext.getCmp('purchaseOrderRevision-detailGrid');
                                new Ext.erp.ux.taxPicker.Window({
                                    targetForm: form,
                                    targetGrid: targetGrid
                                }).show();

                            }
                        }
                        ]
                    },]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [
                    {
                        name: 'SupplierReferenceNo',
                        xtype: 'textfield',
                        fieldLabel: 'Supplier Ref. No',
                        allowBlank: true
                    }, {
                        hiddenName: 'OrderedBy',
                        xtype: 'combo',
                        fieldLabel: 'Ordered By',
                        typeAhead: false,
                        width: 100,
                        hideTrigger: true,
                        minChars: 2,
                        listWidth: 280,
                        emptyText: '---Type to Search---',
                        mode: 'remote',
                        allowBlank: false,
                               tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' +'<h3><span>{Name}</span></h3> {Code}</div></tpl>',
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'Name']
                            }),
                            autoLoad: true,
                            api: { read: Psms.GetEmployeeBySearch }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        pageSize: 10, listeners: {
                            select: function (cmb, rec, idx) {
                                var form = Ext.getCmp('purchaseOrderRevision-form').getForm();
                                form.findField('OrderedById').setValue(rec.id);
                            },
                            change: function (cmb, newvalue, oldvalue) {
                                if (newvalue == "") {
                                    var form = Ext.getCmp('purchaseOrderRevision-form').getForm();
                                    form.findField('OrderedById').reset();

                                }
                            }
                        }
                    }, {
                        name: 'Remark',
                        xtype: 'textarea',
                        fieldLabel: 'Remark',
                        width: 100,
                        allowBlank: true,
                        readOnly: false
                    }]
            }]
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.purchaseOrderRevision.Form, Ext.form.FormPanel);
Ext.reg('purchaseOrderRevision-form', Ext.erp.ux.purchaseOrderRevision.Form);



/**
* @desc      PurchaseOrder detailGrid
* @author    Henock Melisse
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.purchaseOrderRevision
* @class     Ext.erp.ux.purchaseOrderRevision.GridDetail
* @extends   Ext.grid.GridPanel
*/
var purchaseOrderRevisionSelectionModel = new Ext.grid.CheckboxSelectionModel({
});
Ext.erp.ux.purchaseOrderRevision.GridDetail = function (config) {
    Ext.erp.ux.purchaseOrderRevision.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PurchaseOrder.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'PurchaseOrderHeaderId', 'ItemId', 'UnitId', 'MeasurementUnit','UnitCost','Tax', 'Name', 'Code', 'Quantity', 'UnprocessedQuantity', 'BudgetedQuantity', 'RemainingQuantity','Remark'],

            remoteSort: true
        }),
        id: 'purchaseOrderRevision-detailGrid',
        clicksToEdit: 1,
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: true,
        height: 250,
        calculateTax: function (isRecalculate, itemRecord) {

            var grid = Ext.getCmp('purchaseOrderRevision-detailGrid');
            var form = Ext.getCmp('purchaseOrderRevision-form');
            var store = grid.getStore();
            var totalCount = store.getCount();
            if (isRecalculate) {
                Ext.each(store.getRange(0, totalCount - 1), function (record) {
                    var taxRateString = record.data['TaxRate'];
                    var taxRate = taxRateString != "" && typeof taxRateString != "undefined" ? grid.getTaxRate(taxRateString) : '';

                    var tax = 0;
                    for (var i = 0; i < taxRate.length - 1; i++) {
                        var taxRateValue = taxRate[i].split(':')[0];
                        var isAddition = taxRate[i].split(':')[1];
                        if (isAddition == "true" || isAddition == "True")
                            tax = tax + parseFloat(record.data['UnitCost']) * parseFloat(taxRateValue);
                    }
                    record.set('Tax', tax);
                    record.commit();

                });
            }
            else {
                var tax = 0;
                var taxRateString = itemRecord.data['TaxRate'];
                var taxRate = taxRateString != "" && typeof taxRateString != "undefined" ? grid.getTaxRate(taxRateString) : '';
                for (var i = 0; i < taxRate.length - 1; i++) {
                    var taxRateValue = taxRate[i].split(':')[0];
                    var isAddition = taxRate[i].split(':')[1];
                    if (isAddition == "true" || isAddition == "True")
                        tax = tax + parseFloat(itemRecord.data['UnitCost']) * parseFloat(taxRateValue);
                }
                itemRecord.set('Tax', tax);
                itemRecord.commit();
            }
            grid.getTotalSummary();

        },
        getTaxRate: function (taxRatesString) {
            varallTaxRates = taxRatesString.split(';');
            return varallTaxRates;
        },
        getTaxRateDescription: function (taxRatesString) {
            varallTaxRates = taxRatesString.split(':');
            return varallTaxRates;
        },
        getTotalSummary: function () {
            var grid = Ext.getCmp('purchaseOrderRevision-detailGrid');
            var form = Ext.getCmp('purchaseOrderRevision-form');
            var discount = form.getForm().findField('Discount').getValue(); if (typeof discount == "undefined" || discount == "") discount = 0;
            var store = grid.getStore();
            var totalCount = store.getCount();
            var subTotal = ''; var tax = 0; var total = 0;
            grid.taxStore.removeAll();
            Ext.each(store.getRange(0, totalCount - 1), function (record) {
                var taxRateString = record.data['TaxRate'];
                var taxRateDescriptionString = record.data['TaxRateDescription'];
                var taxRate = taxRateString != "" && typeof taxRateString != "undefined" ? grid.getTaxRate(taxRateString) : '';
                var taxRateDescription = taxRateDescriptionString != "" && typeof taxRateDescriptionString != "undefined" ? grid.getTaxRateDescription(taxRateDescriptionString) : '';
                var itemTotal = parseFloat(record.data['UnitCost']) * parseFloat(record.data['Quantity']);
                var taxableRate = grid.getTaxableRates();
                var otherTaxableAmount = taxableRate * itemTotal;
                var discountAmount = discount > 0 ? grid.getDiscount(store, totalCount, discount, itemTotal) : 0;
                var unitCost = record.data['UnitCost'] - discountAmount;
                for (var i = 0; i < taxRate.length - 1; i++) {
                    tax = 0;
                    var taxRateValue = taxRate[i].split(':')[0];
                    taxRateValue = parseFloat(taxRateValue);
                    var isAddition = taxRate[i].split(':')[1];
                    if (isAddition == "true" || isAddition == "True")
                        tax = tax + parseFloat(otherTaxableAmount + itemTotal - discountAmount) * parseFloat(taxRateValue);
                    else
                        tax = tax - parseFloat(otherTaxableAmount + itemTotal - discountAmount) * parseFloat(taxRateValue);

                    total = total + itemTotal;
                    grid.updateTotalSum(taxRateDescription[i], tax);

                }

            });
            grid.getOtherTax();
            discount = ((total.toFixed(2)) * discount) / 100;
            subTotal = subTotal + total.toFixed(2) - discount;
            var subTotalAmount = subTotal;
            var grandTotal = (parseFloat(grid.getTaxTotal(subTotal)) + parseFloat(subTotal)).toFixed(2);
            total = Ext.util.Format.number(total, '0,000.00 ');
            grandTotal = Ext.util.Format.number(grandTotal, '0,000.00 ');
            var discountValue = Ext.util.Format.number(discount, '0,000.00 ');
            subTotal = Ext.util.Format.number(subTotal, '0,000.00 ');
            totalSummary = " Sub Total:" + total + " ; " + (discount > 0 ? " Discount: " + discountValue + " ; " + " Sub Total:" + subTotal + " ; " : "") + grid.getTaxSummary(subTotalAmount) + " To be Paid:" + grandTotal;
            Ext.getCmp('purchaseOrderRevision-totalSummary').setValue(totalSummary);
            form.getForm().findField('TotalSummarry').setValue(totalSummary);
        },
        getOtherTax: function () {
            var grid = Ext.getCmp('purchaseOrderRevision-detailGrid');
            var form = Ext.getCmp('purchaseOrderRevision-form');
            var discount = form.getForm().findField('Discount').getValue(); if (typeof discount == "undefined" || discount == "") discount = 0;
            var taxRateString = form.getForm().findField('TaxRate').getValue();
            var taxRateDescriptionString = form.getForm().findField('TaxRateDescription').getValue();
            var taxRate = taxRateString != "" && typeof taxRateString != "undefined" ? this.getTaxRate(taxRateString) : '';
            var taxRateDescription = taxRateDescriptionString != "" && typeof taxRateDescriptionString != "undefined" ? this.getTaxRateDescription(taxRateDescriptionString) : '';
            var store = grid.getStore();
            var totalCount = store.getCount();
            var totalSummary = grid.totalSummary;
            var taxTotal = grid.taxTotal;
            for (var i = 0; i < taxRate.length - 1; i++) {
                var tax = 0;
                totalSummary = totalSummary + " " + taxRateDescription[i] + ":";
                Ext.each(store.getRange(0, totalCount - 1), function (record) {
                    var itemTotal = parseFloat(record.data['UnitCost']) * parseFloat(record.data['Quantity']);
                    var discountAmount = discount > 0 ? grid.getDiscount(store, totalCount, discount, itemTotal) : 0;
                    var weight = record.data['Weight']; if (weight == 0 || typeof weight == 'undefined' || weight == '') weight = 1;
                    var unitCost = record.data['UnitCost'] - discountAmount;

                    var taxRateValue = taxRate[i].split(':')[0];
                    var isAddition = taxRate[i].split(':')[1];
                    var code = taxRate[i].split(':')[3];
                    if (code == 'Transportation') {
                        tax = tax + parseFloat(record.data['Quantity']) * parseFloat(taxRateValue) / parseFloat(weight);
                    }
                    else {
                        if (isAddition == "true" || isAddition == "True")
                            tax = tax + parseFloat(itemTotal - discountAmount) * parseFloat(taxRateValue);
                        else
                            tax = tax - parseFloat(itemTotal - discountAmount) * parseFloat(taxRateValue);
                    }

                });
                grid.updateTotalSum(taxRateDescription[i], tax);

            }
        },
        updateTotalSum: function (taxType, amount) {
            var grid = Ext.getCmp('purchaseOrderRevision-detailGrid');
            var queryStore = grid.taxStore.query("taxType", taxType);
            if (queryStore.getCount() > 0) {
                queryStore.each(function (item) {
                    var recordAmount = item.get('amount');
                    item.set('amount', recordAmount + amount)
                });
            }
            else {
                var taxStore = grid.taxStore;
                var p = new Ext.data.Record({
                    taxType: taxType,
                    amount: amount,
                });
                var count = taxStore.getCount();
                taxStore.insert(count, p);
            }


        },
        getTaxSummary: function (subTotal) {
            var grid = Ext.getCmp('purchaseOrderRevision-detailGrid');
            var taxStore = grid.taxStore
            var addtaxSummary = '';
            var subtaxSummary = '';
            var totalAmount = 0;
            var taxSummary = "";
            taxStore.each(function (item) {
                if (parseFloat(item.get('amount')) > 0) {
                    addtaxSummary = addtaxSummary + " " + item.get('taxType') + ":" + Ext.util.Format.number(item.get('amount'), '0,000.00 ') + " ; ";
                    totalAmount = totalAmount + parseFloat(item.get('amount'));
                }
                else
                    subtaxSummary = subtaxSummary + " " + item.get('taxType') + ":" + Ext.util.Format.number(item.get('amount'), '0,000.00 ') + " ; ";
            });
            var total = parseFloat(subTotal) + parseFloat(totalAmount);
            addtaxSummary = addtaxSummary + " ; " + " Total:" + Ext.util.Format.number(total, '0,000.00 ') + " ; ";;
            taxSummary = addtaxSummary + subtaxSummary;
            return taxSummary;
        },
        getTaxTotal: function (subTotal) {
            var grid = Ext.getCmp('purchaseOrderRevision-detailGrid');
            var taxStore = grid.taxStore
            var taxtotal = 0;
            taxStore.each(function (item) {
                if (parseFloat(item.get('amount')) < 0) {
                    if (parseFloat(subTotal) > 10000)
                        taxtotal = taxtotal + parseFloat(item.get('amount'));
                }
                else
                    taxtotal = taxtotal + parseFloat(item.get('amount'));
            });
            return taxtotal;
        },
        getDiscount: function (store, totalCount, discountAmount, itemPriceTtoal) {
            var total = 0;
            Ext.each(store.getRange(0, totalCount - 1), function (record) {
                total = total + parseFloat(record.data['UnitCost']) * parseFloat(record.data['Quantity']);
            });
            var discount = (itemPriceTtoal / total) * ((total) * discountAmount / 100);
            return discount;
        },
        rFQStore: new Ext.data.Store(),
        getTaxableRates: function () {
            var grid = Ext.getCmp('purchaseOrderRevision-detailGrid');
            var form = Ext.getCmp('purchaseOrderRevision-form');
            var taxRateString = form.getForm().findField('TaxRate').getValue();
            var taxRate = taxRateString != "" && typeof taxRateString != "undefined" ? this.getTaxRate(taxRateString) : '';
            var tax = 0;
            for (var i = 0; i < taxRate.length - 1; i++) {
                var taxRateValue = taxRate[i].split(':')[0];
                var isAddition = taxRate[i].split(':')[1];
                var isTaxable = taxRate[i].split(':')[2];
                if (isTaxable == 'true' || isTaxable == 'True')
                    tax = tax + parseFloat(taxRateValue);
            }
            return tax;
        },
        sm: Ext.erp.ux.common.SelectionModel,

        viewConfig: {
            forceFit: true
        },
        listeners: {
            beforeLoad: function () {
                Ext.getCmp('purchaseOrderRevision-detailGrid').body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
                Ext.getCmp('purchaseOrderRevision-detailGrid').body.unmask();
            },
            loadException: function () {
                Ext.getCmp('purchaseOrderRevision-detailGrid').body.unmask();
            },
            afteredit: function (e) {
                var record = e.record;
                if (record.get('UnitCost') > 0) {
                    var grid = Ext.getCmp('purchaseOrderRevision-detailGrid');
                    grid.calculateTax(false, record);
                }
                if (e.field == 'Quantity') {
                    var grid = Ext.getCmp('purchaseOrderRevision-detailGrid');
                    grid.getTotalSummary();
                }
            }
        },
        cm: new Ext.grid.ColumnModel({
            columns: [
                purchaseOrderRevisionSelectionModel,
                new Ext.grid.RowNumberer(),
                {
                    dataIndex: 'Name',
                    header: 'Name',
                    sortable: true,
                    width: 140,
                    menuDisabled: true,
                    editor: new Ext.form.ComboBox({
                        typeAhead: false, width: 100,
                        hideTrigger: true,
                        minChars: 2,
                        listWidth: 300,
                        emptyText: '---Type to Search---',
                        mode: 'remote',
                        pageSize: 12,
                        allowBlank: false,
                               tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' +'<h3><span>{Name}</span></h3> {Code}</div></tpl>',
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'Name', 'Code','UnitId', 'MeasurementUnit']
                            }),
                            api: { read: Psms.GetItemBySearch }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        listeners: {

                            select: function (combo, record, index) {

                                var detailDrid = Ext.getCmp('purchaseOrderRevision-detailGrid');
                                var selectedrecord = detailDrid.getSelectionModel().getSelected();
                                selectedrecord.set('ItemId', record.get("Id"));
                                selectedrecord.set('UnitId', record.get("UnitId"));
                                selectedrecord.set('Code', record.get("Code"));
                                selectedrecord.set('MeasurementUnit', record.get("MeasurementUnit"));
                                
                            }
                        }
                    })
                }, {
                    dataIndex: 'Code',
                    header: 'Code',
                    sortable: true,
                    width: 100,
                    menuDisabled: true
                }, {
                    dataIndex: 'MeasurementUnit',
                    header: 'Unit',
                    sortable: true,
                    width: 100,
                    menuDisabled: true,
                    editor: new Ext.form.ComboBox({
                        hiddenName: 'MeasurementUnit',
                        xtype: 'combo',
                        triggerAction: 'all',
                        mode: 'remote',
                        editable: false,
                        forceSelection: true,
                        emptyText: '---Select---',
                        allowBlank: false,
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'Name']
                            }),
                            autoLoad: true,
                            api: { read: Psms.GetMeasurementUnit }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        listeners: {

                            select: function (combo, record, index) {

                                var detailDrid = Ext.getCmp('purchaseOrderRevision-detailGrid');
                                var selectedrecord = detailDrid.getSelectionModel().getSelected();
                                selectedrecord.set('UnitId', record.get("Id"));
                            }
                        }
                    })
                }, {
                    dataIndex: 'Quantity',
                    header: 'Qty',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000.00 ');
                    },
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: false
                    }
                },{
                    dataIndex: 'RemainingQuantity',
                    header: 'Remaining Qty',
                    sortable: true,
                    width: 70,
                    hidden: true,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000.00 ');
                    }
                }, {
                    dataIndex: 'UnitCost',
                    header: 'Unit Cost',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000.00 ');
                    },
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: false
                    }
                }, {
                    dataIndex: 'Tax',
                    header: 'Tax',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000.00 ');
                    },
                }, {
                    dataIndex: 'Remark',
                    header: 'Remark',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,
                    editor: {
                        xtype: 'textarea',
                        allowBlank: false
                    }
                }]
        })
    }, config));
}
Ext.extend(Ext.erp.ux.purchaseOrderRevision.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };

        this.bbar = [{
            xtype: 'displayfield',
            id: "purchaseOrderRevision-totalSummary",
            style: 'font-weight: bold;font-size:12px;'
        }, ]

        Ext.erp.ux.purchaseOrderRevision.GridDetail.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        Ext.erp.ux.purchaseOrderRevision.GridDetail.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('purchaseOrderRevision-detailGrid', Ext.erp.ux.purchaseOrderRevision.GridDetail);

/* @desc     purchaseOrderRevisionOrder form host window
* @author    Henock Melisse
* @copyright (c) 2011, Cybersoft
* @date     September 2013
* @namespace Ext.erp.ux.purchaseOrderRevisionOrder
* @class     Ext.erp.ux.purchaseOrderRevisionOrder.Window
* @extends   Ext.Window
*/

Ext.erp.ux.purchaseOrderRevision.Window = function (config) {
    Ext.erp.ux.purchaseOrderRevision.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 800,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'purchaseOrderRevision-window',
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
   
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.purchaseOrderRevisionHeaderId);
                var window = Ext.getCmp('purchaseOrderRevision-window');
                if (typeof this.purchaseOrderRevisionHeaderId != "undefined" && this.purchaseOrderRevisionHeaderId != "") {
                    this.form.load({
                        waitMsg: 'Loading...',
                        params: { id: this.purchaseOrderRevisionHeaderId },
                        success: function (form, action) {
                            var form = Ext.getCmp('purchaseOrderRevision-form').getForm();
                            Ext.getCmp('purchaseOrderRevision-detailGrid').getTotalSummary();
                            var grid = Ext.getCmp('purchaseOrderRevision-detailGrid');
                            Ext.getCmp('purchaseOrderRevision-form').onOrderTypeChange();                          

                        }
                    });
                   
                    var grid = Ext.getCmp('purchaseOrderRevision-detailGrid');
                    var store = grid.getStore();
                    store.baseParams = { record: Ext.encode({ voucherHeaderId: this.purchaseOrderRevisionHeaderId, action: "storePurchaseOrder" }) };

                    grid.getStore().reload({
                        params: {
                            start: 0,
                            limit: grid.pageSize
                        }
                    });
                }
                else
                {
                    this.form.loadDocument();
                    Ext.getCmp('purchaseOrderRevision-form').onOrderTypeChange();
                }

            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.ux.purchaseOrderRevision.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.purchaseOrderRevision.Form();
        this.grid = new Ext.erp.ux.purchaseOrderRevision.GridDetail();
        this.items = [this.form, this.grid];
        this.bbar = [
              {
                xtype: 'tbfill'
            },  {
                text: 'Close',
                iconCls: 'icon-exit',
                handler: this.onCancel,
                scope: this
            }];
        Ext.erp.ux.purchaseOrderRevision.Window.superclass.initComponent.call(this, arguments);
    },
  
    onCancel: function () {
        this.close();
    }
});
Ext.reg('purchaseOrderRevision-window', Ext.erp.ux.purchaseOrderRevision.Window);

/**
* @desc      PurchaseOrder grid
* @author    Henock Melisse
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.purchaseOrderRevision
* @class     Ext.erp.ux.purchaseOrderRevision.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.purchaseOrderRevision.Grid = function (config) {
    Ext.erp.ux.purchaseOrderRevision.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PurchaseOrder.GetAllHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DSC'
            },
            fields: ['Id', 'VoucherNumber','OrderReferenceNo','OrderedDate', 'RequiredDate', 'SupplierReferenceNo', 'Supplier', 'Consumer', 'StatusId', 'Status', 'OrderedBy', 'Store', 'OrderType'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    this.body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    this.body.unmask();
                },
                loadException: function () {
                    this.body.unmask();
                },
                scope: this
            }
        }),
        id: 'purchaseOrderRevision-grid',
        pageSize: 36,
        height: 300,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true
        },
        listeners: {
            rowClick: function () {
            },
            rowdblclick: function (grid, rowIndex, e) {
                var grid =this;
                if (!grid.getSelectionModel().hasSelection()) return;
                var id = grid.getSelectionModel().getSelected().get('Id');
                new Ext.erp.ux.purchaseOrderRevision.Window({
                    title: 'Purchase Order Version',
                    purchaseOrderRevisionHeaderId: id,
                }).show();
            },
            scope: this
        },
        columns: [
            new Ext.grid.RowNumberer(),
        {
            dataIndex: 'Status',
            header: 'Status',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.get("Status") == "Approved")
                    return '<img src="Content/images/app/yes.png"/>';
                else if (record.get("Status") == "Certified")
                    return '<img src="Content/images/app/pending.png"/>';
                else
                    return '<img src="Content/images/app/no.png"/>';
            }
        }, {
            dataIndex: 'VoucherNumber',
            header: 'Voucher Number',
            sortable: true,
            width: 100,
      
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'OrderType',
            header: 'Order Type',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'OrderReferenceNo',
            header: 'Reference No',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'Supplier',
            header: 'Supplier',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        },  {
            dataIndex: 'OrderedDate',
            header: 'Order Date',
            sortable: true,
            width: 80,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'Store',
            header: 'Store',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        },  {
            dataIndex: 'Status',
            header: 'Status',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }]
    }, config));
}
Ext.extend(Ext.erp.ux.purchaseOrderRevision.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({voucherNo:this.voucherNo,isRevised:true}) };
        this.tbar = [{
            id: 'searchPurchaseOrder',
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearchVoucher
        }, {
            xtype: 'button',
            text: 'Preview',
            id: 'preview-PurchaseOrder',
            hidden: false,
            iconCls: 'icon-preview',
            handler: this.onPreview
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'purchaseOrderRevision-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.purchaseOrderRevision.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {

        var grid = Ext.getCmp('purchaseOrderRevision-grid');
        if (!grid.getSelectionModel().hasSelection()) return;


        var voucherId = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        window.open('Reports/ErpReportViewer.aspx?rt=PreviewPurchaseOrder&id=' + voucherId, 'PreviewIV', parameter);


    },
   
    onSearchVoucher: function () {
        Ext.erp.ux.voucherSearch.Observable.on('searchvoucher', function (result) {
            result['mode'] = 'search';
            var grid = Ext.getCmp('purchaseOrderRevision-grid');
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.voucherSearch.Window({ title: 'Search Transactions' }).show();
    },
    customRenderer: function (value, metaData, record, rowIndex, colIndex, store) {

        if (record.get("Status") == "Approved")
            return '<span style=color:green>' + value + '</span>';
        else if (record.get("Status") == "Void")
            return '<span style=color:red>' + value + '</span>';
        else if (record.get("Status") == "Certified")
            return '<span style=color:black>' + value + '</span>';

        else
            return '<span style=color:black>' + value + '</span>';


    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.purchaseOrderRevision.Grid.superclass.afterRender.apply(this, arguments);
    },

});
Ext.reg('purchaseOrderRevision-grid', Ext.erp.ux.purchaseOrderRevision.Grid);



/* @desc     purchaseOrderRevisionOrder form host window
* @author    Henock Melisse
* @copyright (c) 2011, Cybersoft
* @date     September 2013
* @namespace Ext.erp.ux.purchaseOrderRevisionOrder
* @class     Ext.erp.ux.purchaseOrderRevisionOrder.Window
* @extends   Ext.Window
*/

Ext.erp.ux.purchaseOrderRevision.PanelWindow = function (config) {
    Ext.erp.ux.purchaseOrderRevision.PanelWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 800,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'purchaseOrderRevision-panelWindow',
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',

        listeners: {
            show: function () {


            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.ux.purchaseOrderRevision.PanelWindow, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.purchaseOrderRevision.Grid({
            voucherNo: this.voucherNo
        });
        this.items = [this.grid];
        this.bbar = [
              {
                  xtype: 'tbfill'
              },{
                  text: 'Close',
                  iconCls: 'icon-exit',
                  handler: this.onCancel,
                  scope: this
              }];
        Ext.erp.ux.purchaseOrderRevision.PanelWindow.superclass.initComponent.call(this, arguments);
    },
    
    onCancel: function () {
        this.close();
    }
});
Ext.reg('purchaseOrderRevision-panelWindow', Ext.erp.ux.purchaseOrderRevision.PanelWindow);

