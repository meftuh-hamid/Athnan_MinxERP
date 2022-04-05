Ext.ns('Ext.erp.ux.receive');

/**
* @desc      Receive form
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.receive
* @class     Ext.erp.ux.receive.Form
* @extends   Ext.form.FormPanel
*/

Ext.erp.ux.receive.Form = function (config) {
    Ext.erp.ux.receive.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Receive.Get,
            submit: Receive.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'receive-form',
        frame: true,
        labelWidth: 100,
        padding: 5,
        autoHeight: false,
        border: false,
        loadDocument: function () {

            Receive.GetDocumentNo(function (result) {
                var form = Ext.getCmp('receive-form').getForm();
                form.findField('VoucherNumber').setValue(result.data.DocNo);
                form.findField('StatusId').setValue(result.data.StatusId);
                form.findField('PreparedById').setValue(result.data.EmployeeId);
                form.findField('ReceivedById').setValue(result.data.EmployeeId);
                form.findField('ReceivedBy').setValue(result.data.Employee);
                form.findField('ReceivedDate').setValue(new Date());
                form.findField('FiscalYearId').setValue(result.data.FiscalYearId);


            });


        },
        onReceiveTypeChange: function () {
            var form = Ext.getCmp('receive-form').getForm();
            var receiverType = form.findField('ReceiveType').getRawValue();
            cm = Ext.getCmp('receive-detailGrid').getColumnModel();
            if(receiverType=="Order Receive")
            {
                form.findField('PurchaseOrderNo').setVisible(true);
                form.findField('PurchaseRequestNo').setVisible(false);
                Ext.getCmp('receiveSupplier').setVisible(true);
                Ext.getCmp('receiveTax').setVisible(true);


                 form.findField('PurchaseOrderNo').allowBlank = true;
                form.findField('PurchaseRequestNo').allowBlank = true;
                Ext.getCmp('receiveSupplier').allowBlank = false;
                Ext.getCmp('receiveTax').allowBlank = false;


            }
            else if (receiverType == "PettyCash Receive")
            {
                 form.findField('PurchaseOrderNo').setVisible(false);
                form.findField('PurchaseRequestNo').setVisible(true);
                Ext.getCmp('receiveSupplier').setVisible(true);
              
                form.findField('PurchaseOrderNo').allowBlank = true;
                form.findField('PurchaseRequestNo').allowBlank = false;
                Ext.getCmp('receiveSupplier').allowBlank = false;
                Ext.getCmp('receiveTax').allowBlank = true;



                Ext.getCmp('receiveTax').setVisible(true);
           

            }
            else if (receiverType == "Donation Receive") {

                 form.findField('PurchaseOrderNo').setVisible(false);
                form.findField('PurchaseRequestNo').setVisible(false);
                Ext.getCmp('receiveSupplier').setVisible(false);
                Ext.getCmp('receiveTax').setVisible(false);

                form.findField('PurchaseOrderNo').allowBlank = true;
                form.findField('PurchaseRequestNo').allowBlank = true;
                Ext.getCmp('receiveSupplier').allowBlank = true;
                Ext.getCmp('receiveTax').allowBlank = true;
            }
            else
            {
                 form.findField('PurchaseOrderNo').setVisible(false);
                form.findField('PurchaseRequestNo').setVisible(false);
                 Ext.getCmp('receiveSupplier').setVisible(false);
                Ext.getCmp('receiveTax').setVisible(true);



                 form.findField('PurchaseOrderNo').allowBlank=true;
                form.findField('PurchaseRequestNo').allowBlank=true;
                Ext.getCmp('receiveSupplier').allowBlank = true;
                Ext.getCmp('receiveTax').allowBlank = true;
             



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
                },{
                    name: 'PurchaseRequestHeaderId',
                    xtype: 'hidden'
                }, {
                    name: 'PurchaseOrderId',
                    xtype: 'hidden'
                }, {
                    name: 'CreatedAt',
                    xtype: 'hidden'
                }, {
                    name: 'PONo',
                    xtype: 'hidden'
                }, {
                    name: 'PRNo',
                    xtype: 'hidden'
                }, {
                    name: 'StatusId',
                    xtype: 'hidden'
                },{
                    name: 'PreparedById',
                    xtype: 'hidden'
                }, {
                    name: 'DeliveredById',
                    xtype: 'hidden'
                },{
                    name: 'ReceivedById',
                    xtype: 'hidden'
                },  {
                    name: 'PurchaseOrderId',
                    xtype: 'hidden'
                }, {
                    name: 'StoreId',
                    xtype: 'hidden'
                },{
                    name: 'ReceiveTypeId',
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
                    name: 'SupplierId',
                    xtype: 'hidden'
                }, {
                    name: 'VoucherNumber',
                    xtype: 'textfield',
                    fieldLabel: 'Voucher Number',
                    readOnly: false,
                    allowBlank: false
                }, {
                    hiddenName: 'ReceiveType',
                    xtype: 'combo',
                    fieldLabel: 'Receive Type',
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
                        api: { read: Psms.GetReceiveType }
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('receive-form').getForm();
                            form.findField("ReceiveTypeId").setValue(rec.id);
                            Ext.getCmp('receive-form').onReceiveTypeChange();
                        },
                    }
                }, {
                    hiddenName: 'PurchaseOrderNo',
                    xtype: 'combo',
                    fieldLabel: 'Purchase Order',
                    typeAhead: false,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    emptyText: '---Type to Search---',
                    mode: 'remote',
                    allowBlank: true,
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name', 'StoreId', 'Store', 'Supplier', 'SupplierId', 'TaxRateIds', 'TaxRateDescription', 'TotalSummarry', 'TaxRate']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetPurchaseOrderBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10, listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('receive-form').getForm();
                            form.findField('PurchaseOrderId').setValue(rec.id);
                            form.findField('PONo').setValue(rec.get('Name'));

                            form.findField('StoreId').setValue(rec.get('StoreId'));
                            form.findField('Store').setValue(rec.get('Store'));
                            form.findField('SupplierId').setValue(rec.get('SupplierId'));
                            form.findField('Supplier').setValue(rec.get('Supplier'));
                            form.findField('TaxRateIds').setValue(rec.get('TaxRateIds'));
                            form.findField('TaxRateDescription').setValue(rec.get('TaxRateDescription'));
                            form.findField('TotalSummarry').setValue(rec.get('TotalSummarry'));
                            form.findField('TaxRate').setValue(rec.get('TaxRate'));

                            var grid = Ext.getCmp('receive-detailGrid');
                            var store = grid.getStore();
                            store.baseParams = { record: Ext.encode({ voucherHeaderId: rec.id, action: "purchaseOrder" }) };
                            grid.getStore().reload({
                                params: {
                                    start: 0,
                                    limit: grid.pageSize
                                }
                            });
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('receive-form').getForm();
                                form.findField('PurchaseOrderHeaderId').reset();
                            }
                        }
                    }
                }, {
                    hiddenName: 'PurchaseRequestNo',
                    xtype: 'combo',
                    fieldLabel: 'PR No',
                    typeAhead: false,
                    hideTrigger: true,
                    hidden: true,
                    minChars: 2,
                    listWidth: 280,
                    emptyText: '---Type to Search---',
                    mode: 'remote',
                    allowBlank:true,
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name', 'StoreId', 'Store']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetPurchaseRequestBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10, listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('receive-form').getForm();
                            form.findField('PurchaseRequestHeaderId').setValue(rec.id);
                            form.findField('StoreId').setValue(rec.get('StoreId'));
                            form.findField('Store').setValue(rec.get('Store'));

                            var grid = Ext.getCmp('receive-detailGrid');
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
                                var form = Ext.getCmp('receive-form').getForm();
                                form.findField('PurchaseRequestHeaderId').reset();
                            }
                        }
                    }
                },  {
                    xtype: 'compositefield',
                    fieldLabel: 'Tax',
                    id: 'receiveTax',
                    hidden: true,
                    defaults: {
                        flex: 1
                    },
                    items: [
                        {
                            name: 'TaxRateDescription',
                            xtype: 'textfield',
                            fieldLabel: 'Tax',
                            allowBlank: true,
                            readOnly: false,
                            listeners: {
                                change: function (cmb, newvalue, oldvalue) {
                                    if (newvalue == "") {
                                        var form = Ext.getCmp('purchaseOrder-form').getForm();
                                        form.findField('TaxRateIds').reset();
                                        form.findField('TaxRate').reset();
                                    }
                                }
                            }
                        },
                    {
                        xtype: 'button',
                        width: 30,
                        iconCls: 'icon-add',
                        handler: function () {
                            var form = Ext.getCmp('receive-form').getForm();

                            var targetGrid = Ext.getCmp('receive-detailGrid');
                            new Ext.erp.ux.taxPicker.Window({
                                targetForm: form,
                                targetGrid: targetGrid
                            }).show();

                        }
                    }
                    ]
                }]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [
                 {
                    name: 'ReceivedDate',
                    xtype: 'datefield',
                    fieldLabel: 'Received Date',
                    width: 100,
                    allowBlank: false,
                    value: new Date(),
                    maxValue: (new Date()).format('m/d/Y')
                 }, {
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
                     tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
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
                             var form = Ext.getCmp('receive-form').getForm();
                             form.findField('StoreId').setValue(rec.id);
                         },
                         change: function (cmb, newvalue, oldvalue) {
                             if (newvalue == "") {
                                 var form = Ext.getCmp('receive-form').getForm();
                                 form.findField('StoreId').reset();

                             }
                         }
                     }
                 },  {
                     name: 'IsForign',
                     checked: true,
                     xtype: 'checkbox',
                     fieldLabel: 'Is Forign?',
                     width: 100,
                     hidden:true,
                     readOnly: false,
                     allowBlank: true,
                     checked: false
                 }, {
                     xtype: 'compositefield',
                     fieldLabel: 'Supplier',
                     id: 'receiveSupplier',
                     hidden: true,
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
                         allowBlank: true,
                         tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
                         store: new Ext.data.DirectStore({
                             reader: new Ext.data.JsonReader({
                                 successProperty: 'success',
                                 idProperty: 'Id',
                                 root: 'data',
                                 fields: ['Id', 'Name', 'TaxRateIds', 'TaxRateDescription', 'TaxRate']
                             }),
                             autoLoad: true,
                             api: { read: Psms.GetSupplierBySearch }
                         }),
                         valueField: 'Name',
                         displayField: 'Name',
                         pageSize: 10, listeners: {
                             select: function (cmb, rec, idx) {
                                 var form = Ext.getCmp('receive-form').getForm();
                                 form.findField('SupplierId').setValue(rec.id);
                                 form.findField('TaxRateIds').setValue(rec.get("TaxRateIds"));
                                 form.findField('TaxRateDescription').setValue(rec.get("TaxRateDescription"));
                                 form.findField('TaxRate').setValue(rec.get("TaxRate"));

                             },
                             change: function (cmb, newvalue, oldvalue) {
                                 if (newvalue == "") {
                                     var form = Ext.getCmp('receive-form').getForm();
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
                             var form = Ext.getCmp('receive-form').getForm();
                             new Ext.erp.ux.supplier.Window({
                                 targetForm: form,
                             }).show();

                         }
                     }
                     ]
                 },  {
                     hiddenName: 'ReceivedBy',
                     xtype: 'combo',
                     fieldLabel: 'Received By',
                     typeAhead: false,
                     width: 100,
                     hideTrigger: true,
                     minChars: 2,
                     hidden:true,
                     listWidth: 280,
                     emptyText: '---Type to Search---',
                     mode: 'remote',
                     allowBlank: false,
                     tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
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
                             var form = Ext.getCmp('receive-form').getForm();
                             form.findField('ReceivedById').setValue(rec.id);
                         },
                         change: function (cmb, newvalue, oldvalue) {
                             if (newvalue == "") {
                                 var form = Ext.getCmp('receive-form').getForm();
                                 form.findField('ReceivedById').reset();

                             }
                         }
                     }
                 }, {
                     name: 'Discount',
                     xtype: 'numberfield',
                     fieldLabel: 'Discount',
                     width: 100,
                     hidden:true,
                     allowBlank: true,
                     readOnly: false,
                     listeners: {
                         change: function (arg, newvalue) {
                             var grid = Ext.getCmp('receive-detailGrid');
                             grid.getTotalSummary();
                         }
                     }
                 }, ]
            }, {
                defaults: {
                    anchor: '95%',
                 },
                items: [
                  {
                      name: 'CommercialInvoiceNo',
                      xtype: 'textfield',
                      fieldLabel: 'Commercial Invoice No',
                      readOnly: false,
                      hidden: false,
                      allowBlank: true
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
Ext.extend(Ext.erp.ux.receive.Form, Ext.form.FormPanel);
Ext.reg('receive-form', Ext.erp.ux.receive.Form);



/**
* @desc      Receive detailGrid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.receive
* @class     Ext.erp.ux.receive.GridDetail
* @extends   Ext.grid.GridPanel
*/
var receiveSelectionModel =  new Ext.grid.RowSelectionModel({
});
Ext.erp.ux.receive.GridDetail = function (config) {
    Ext.erp.ux.receive.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Receive.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            //  idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'ReceiveHeaderId', 'IsSerialItem','PartNumber','AvailableQuantity', 'IsLOTItem', 'ExpireyDate', 'TaxRate', 'ProductionDeliveryDetailId','TaxRateIds', 'TaxRateDescription', 'ItemCategory', 'ItemId', 'TaxRate', 'TaxRateDescription', 'UnitId', 'DamagedQuantity', 'UnitCost', 'Tax', 'ReceiveConditionId', 'ReceiveCondition', 'Name', 'Code', 'MeasurementUnit', 'Quantity', 'ReceivedQuantity', 'RemainingQuantity'],

            remoteSort: true,
            listeners: {
                load: function () {
                     var grid = Ext.getCmp('receive-detailGrid');
                    grid.getTotalSummary();
                },

            },
        }),
        id: 'receive-detailGrid',
        clicksToEdit: 1,
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: true,
        height: 450,
        currentRecord: '',
        serialStore: new Ext.data.Store(),
        lOTStore: new Ext.data.Store(),
        taxStore: new Ext.data.Store(),
        purchaseOrderSourceStore: new Ext.data.Store(),
        border: true,
        calculateTax: function (isRecalculate, itemRecord) {

            var grid = Ext.getCmp('receive-detailGrid');
            var form = Ext.getCmp('receive-form');
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
            varallTaxRates = taxRatesString != '' && taxRatesString != null ? taxRatesString.split(';') : '';
            return varallTaxRates;
        },
        getTaxRateDescription: function (taxRatesString) {
            varallTaxRates = taxRatesString != '' && taxRatesString != null ? taxRatesString.split(':') : '';
            return varallTaxRates;
        },
        getTotalSummary: function () {
            var grid = Ext.getCmp('receive-detailGrid');
            var form = Ext.getCmp('receive-form');
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
                var itemTotal = parseFloat(record.data['UnitCost']) * parseFloat(record.data['ReceivedQuantity']);
                var taxableRate = grid.getTaxableRates();
                var otherTaxableAmount = taxableRate * itemTotal;
                var discountAmount = discount > 0 ? grid.getDiscount(store, totalCount, discount, itemTotal) : 0;
                var unitCost = record.data['UnitCost'] - discountAmount;
                total = total + itemTotal;

                for (var i = 0; i < taxRate.length - 1; i++) {
                    tax = 0;
                    var taxRateValue = taxRate[i].split(':')[0];
                    taxRateValue = parseFloat(taxRateValue);
                    var isAddition = taxRate[i].split(':')[1];
                    if (isAddition == "true" || isAddition == "True")
                        tax = tax + parseFloat(otherTaxableAmount + itemTotal - discountAmount) * parseFloat(taxRateValue);
                    else
                        tax = tax - parseFloat(otherTaxableAmount + itemTotal - discountAmount) * parseFloat(taxRateValue);

                    grid.updateTotalSum(taxRateDescription[i], tax);

                }

            });
            grid.getOtherTax();
            discount = ((total.toFixed(2)) * discount) / 100;
            subTotal = subTotal + total.toFixed(2) - discount;
            var subtotalAmount = 0;
            var grandTotal = (parseFloat(grid.getTaxTotal(subTotal)) + parseFloat(subTotal)).toFixed(2);
            total = Ext.util.Format.number(total, '0,000.00 ');
            grandTotal = Ext.util.Format.number(grandTotal, '0,000.00 ');
            var discountValue = Ext.util.Format.number(discount, '0,000.00 ');
            subTotal = Ext.util.Format.number(subTotal, '0,000.00 ');
            totalSummary = " Sub Total:" + total + " ; " + (discount > 0 ? " Discount: " + discountValue + " ; " + " Sub Total:" + subTotal + " ; " : "") + grid.getTaxSummary(subtotalAmount) + " To be Paid:" + grandTotal;
            Ext.getCmp('receive-totalSummary').setValue(totalSummary);
            form.getForm().findField('TotalSummarry').setValue(totalSummary);
        },
        getOtherTax: function () {
            var grid = Ext.getCmp('receive-detailGrid');
            var form = Ext.getCmp('receive-form');
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
                    var itemTotal = parseFloat(record.data['UnitCost']) * parseFloat(record.data['ReceivedQuantity']);
                    var discountAmount = discount > 0 ? grid.getDiscount(store, totalCount, discount, itemTotal) : 0;
                    var weight = record.data['Weight']; if (weight == 0 || typeof weight == 'undefined' || weight == '') weight = 1;
                    var unitCost = record.data['UnitCost'] - discountAmount;

                    var taxRateValue = taxRate[i].split(':')[0];
                    var isAddition = taxRate[i].split(':')[1];
                    var code = taxRate[i].split(':')[3];
                    if (code == 'Transportation') {
                        tax = tax + parseFloat(record.data['ReceivedQuantity']) * parseFloat(taxRateValue) / parseFloat(weight);
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
            var grid = Ext.getCmp('receive-detailGrid');
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
            var grid = Ext.getCmp('receive-detailGrid');
            var taxStore = grid.taxStore
            var taxSummary = '';
            taxStore.each(function (item) {
                if (parseFloat(item.get('amount')) < 0) {
                    if (parseFloat(subTotal) > 10000)
                        taxSummary = taxSummary + " " + item.get('taxType') + ":" + Ext.util.Format.number(item.get('amount'), '0,000.00 ') + " ; " + " Sub Total:" + Ext.util.Format.number(subTotal + parseFloat(item.get('amount')), '0,000.00 ') + " ; ";

                }
                else
                    taxSummary = taxSummary + " " + item.get('taxType') + ":" + Ext.util.Format.number(item.get('amount'), '0,000.00 ') + " ; ";
            });
            return taxSummary;
        },
        getTaxTotal: function (subTotal) {
            var grid = Ext.getCmp('receive-detailGrid');
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
                total = total + parseFloat(record.data['UnitCost']) * parseFloat(record.data['ReceivedQuantity']);
            });
            var discount = (itemPriceTtoal / total) * ((total) * discountAmount / 100);
            return discount;
        },
        rFQStore: new Ext.data.Store(),
        getTaxableRates: function () {
            var grid = Ext.getCmp('receive-detailGrid');
            var form = Ext.getCmp('receive-form');
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
                Ext.getCmp('receive-detailGrid').body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
              
                Ext.getCmp('receive-detailGrid').body.unmask();
                var grid = Ext.getCmp('receive-detailGrid');
                grid.getTotalSummary();
            },
            loadException: function () {
                Ext.getCmp('receive-detailGrid').body.unmask();
            },
            afteredit: function (e) {
                var record = e.record;
                if (record.get('UnitCost') > 0) {
                    var grid = Ext.getCmp('receive-detailGrid');
                    grid.calculateTax(false, record);
                }
                if (e.field == 'Quantity') {
                    var grid = Ext.getCmp('receive-detailGrid');
                    grid.getTotalSummary();
                }
            },
            rowClick: function (grid, index) {
                var detailGrid = Ext.getCmp('receive-detailGrid');
                var currentRecord = detailGrid.getStore().getAt(index);
                detailGrid.currentRecord = currentRecord;
            },
        },
        cm: new Ext.grid.ColumnModel({
            columns: [
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
                        tpl:
                     '<tpl for="."><div ext:qtip="{Name}" class="x-combo-list-item">' +
                         '<p><h6 class="w3-text-teal w3-small "><span>' + '{Name}'  + '</span></h6></p>' +
                         '<p><h6 class="w3-text-teal w3-small "><span>' + '{Code}' + '-' + '{PartNumber}' + '</span></h6></p>' +
                     '</span></div></tpl>',   store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'Name', 'Code', 'PartNumber','MeasurementUnit', 'UnitId', 'ItemCategory', 'IsSerialItem', 'IsLOTItem', 'TaxRateIds', 'TaxRateDescription', 'TaxRate']
                            }),
                            api: { read: Psms.GetItemBySearch }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        listeners: {

                            select: function (combo, record, index) {

                                var detailDrid = Ext.getCmp('receive-detailGrid');
                                var selectedrecord = detailDrid.getSelectionModel().getSelected();
                                selectedrecord.set('ItemId', record.get("Id"));
                                selectedrecord.set('Code', record.get("Code"));
                                selectedrecord.set('PartNumber', record.get("PartNumber"));
                                selectedrecord.set('ItemCategory', record.get("ItemCategory"));

                                selectedrecord.set('IsSerialItem', record.get("IsSerialItem"));
                                selectedrecord.set('IsLOTItem', record.get("IsLOTItem"));
                                selectedrecord.set('MeasurementUnit', record.get("MeasurementUnit"));
                                selectedrecord.set('UnitId', record.get("UnitId"));
                                selectedrecord.set('TaxRateIds', record.get("TaxRateIds"));
                                selectedrecord.set('TaxRateDescription', record.get("TaxRateDescription"));
                                selectedrecord.set('TaxRate', record.get("TaxRate"));

                            }
                        }
                    })
                }, {
                    dataIndex: 'Code',
                    header: 'Code',
                    sortable: true,
                    width: 100,
                    menuDisabled: true
                },  {
                    dataIndex: 'PartNumber',
                    header: 'Part Number',
                    sortable: true,
                    width: 100,
                    hidden: true,
                    menuDisabled: true
                },{
                    dataIndex: 'ItemCategory',
                    header: 'Item Category',
                    sortable: true,
                    width: 100,
                    hidden: true,
                    menuDisabled: true,
                    editor: new Ext.form.ComboBox({
                        hiddenName: 'ItemCategory',
                        xtype: 'combo',
                        typeAhead: false,
                        width: 100,
                        hideTrigger: true,
                        minChars: 2,
                        listWidth: 280,
                        emptyText: '---Type to Search---',
                        mode: 'remote',
                        allowBlank: false,
                        tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> {Code}</div></tpl>',
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'Name']
                            }),
                            autoLoad: true,
                            api: { read: Psms.GetItemCategoryBySearch }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        pageSize: 10, 
                    })
                }, {
                    dataIndex: 'MeasurementUnit',
                    header: 'Unit',
                    sortable: true,
                    width: 100,
                    hidden:true,
                    menuDisabled: true,
                    editor: new Ext.form.ComboBox({
                        hiddenName: 'MeasurementUnit',
                        xtype: 'combo',
                        triggerAction: 'all',
                        mode: 'remote',
                        editable: true,
                        forceSelection: false,
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

                                var detailDrid = Ext.getCmp('receive-detailGrid');
                                var selectedrecord = detailDrid.getSelectionModel().getSelected();
                                selectedrecord.set('UnitId', record.get("Id"));
                            }
                        }
                    })
                }, {
                    dataIndex: 'Quantity',
                    header: 'Order Qty',
                    sortable: true,
                    hidden:true,
                    width: 70,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000.00 ');
                    }
                }, {
                    dataIndex: 'RemainingQuantity',
                    header: 'Remaining Qty',
                    sortable: true,
                    width: 70,
                    hidden:true,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000.00 ');
                    }
                }, {
                    dataIndex: 'DamagedQuantity',
                    header: 'Damaged Qty',
                    sortable: true,
                    width: 70,
                    hidden:true,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000.00 ');
                    },
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: false
                    }
                }, {
                    dataIndex: 'ReceivedQuantity',
                    header: 'Received Qty',
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
                    hidden:true,
                    width: 70,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000.00 ');
                    },
                }, {
                    dataIndex: 'ExpireyDate',
                    header: 'Expirey Date',
                    sortable: true,
                    width: 70,
                    hidden:true,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000.00 ');
                    },
                    editor: {
                        xtype: 'datefield',
                        allowBlank: false
                    }
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
Ext.extend(Ext.erp.ux.receive.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };

        this.tbar = [
            {
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: false,
                handler: function () {
                    var detailDrid = Ext.getCmp('receive-detailGrid');
                    var store = detailDrid.getStore();

                    var defaultData = {
                        Tax: 0,
                        UnitCost: 0,
                        ReceivedQuantity:0,
                        Quantity: 0,
                        RemainingQuantity: 0,
                        DamagedQuantity: 0,
                    };
                    var records = new store.recordType(defaultData);
                    store.add(records);
                }
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Remove',
                iconCls: 'icon-exit',
                disabled: false,
                handler: function () {
                    var grid = Ext.getCmp('receive-detailGrid');

                    if (!grid.getSelectionModel().hasSelection())
                        return;

                    var selectedrecord = grid.getSelectionModel().getSelected();
                    grid.getStore().remove(selectedrecord);
                    var headerGrid = Ext.getCmp('receive-detailGrid');
                                   headerGrid.getTotalSummary();
                }
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Add Serial/LOT',
                iconCls: 'icon-add',
                handler: this.onSerialLOtClick
            }, '->',
            {
                xtype: 'button',
                text: 'Production Picker',
                iconCls: 'icon-accept',
                disabled: false,
                handler: function () {
                    var detailGrid = Ext.getCmp('receive-detailGrid');
                    new Ext.erp.ux.productionPicker.Window({
                        targetGrid: detailGrid
                    }).show();
                }
            }, {
                xtype: 'tbseparator'
            },{
                xtype: 'button',
                text: 'Picker',
                iconCls: 'icon-picker',
                disabled: false,
                handler: function () {
                    var detailGrid = Ext.getCmp('receive-detailGrid');
                    var storeId = Ext.getCmp('receive-form').getForm().findField("StoreId").getValue();

                    new Ext.erp.ux.itemPicker.Window({
                        targetGrid: detailGrid,
                        storeId: storeId
                    }).show();
                }
            },

        ]
        this.bbar = [{
            xtype: 'displayfield',
            id: "receive-totalSummary",
            style: 'font-weight: bold;font-size:12px;'
        }, ]
        Ext.erp.ux.receive.GridDetail.superclass.initComponent.apply(this, arguments);
    },
    onSerialLOtClick: function () {
        var form = Ext.getCmp('receive-form').getForm();
        var itemType = form.findField('ItemType').getRawValue();

        var detailDrid = Ext.getCmp('receive-detailGrid');
        var currentRecord = detailDrid.currentRecord;
        var storeId = Ext.getCmp('receive-form').getForm().findField("StoreId").getValue();
        var itemName = currentRecord.get("Name");
        var itemId = currentRecord.get("ItemId");

        var receivedQuantity = currentRecord.get("ReceivedQuantity");
        var damagedQuantity = currentRecord.get("DamagedQuantity");
        var quantity = receivedQuantity + damagedQuantity;
        if (quantity <= 0) {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "received Quantity or damaged quantity must be greater than 0",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;

        }
        if (itemType == "FixedAsset" || currentRecord.get("IsSerialItem")) {
            new Ext.erp.ux.itemSerial.Window({
                title: 'Add Item Serials',
                itemStore: detailDrid.serialStore.query("ItemName", itemName),
                targetGrid: detailDrid,
                storeId: storeId,
                itemName: itemName,
                receivedQuantity: quantity,
                isReceive: true,
            }).show();
        }
        else if (currentRecord.get("IsLOTItem")) {
            new Ext.erp.ux.itemLOT.Window({
                title: 'Add Item LOT',
                itemStore: detailDrid.lOTStore.query("ItemName", itemName),
                targetGrid: detailDrid,
                storeId: storeId,
                itemId: itemId,
                itemName: itemName,
                ReceivedQuantity: quantity,
                isReceive: true,
            }).show();
        }
    },

    afterRender: function () {

        Ext.erp.ux.receive.GridDetail.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('receive-detailGrid', Ext.erp.ux.receive.GridDetail);

/* @desc     receiveOrder form host window
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date     September 2013
* @namespace Ext.erp.ux.receiveOrder
* @class     Ext.erp.ux.receiveOrder.Window
* @extends   Ext.Window
*/

Ext.erp.ux.receive.Window = function (config) {
    Ext.erp.ux.receive.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 900,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'receive-window',
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
   
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.receiveHeaderId);
               
                if (typeof this.receiveHeaderId != "undefined" && this.receiveHeaderId != "") {
                    this.form.load({
                        waitMsg: 'Loading...',
                        params: { id: this.receiveHeaderId },
                        success: function (form, action) {
                           Ext.getCmp('receive-detailGrid').getTotalSummary();
                            var grid = Ext.getCmp('receive-detailGrid');
                            Ext.getCmp('receive-form').onReceiveTypeChange();


                            var serilList = action.result.serialList;
                            var lOTList = action.result.lotList;
                            Ext.getCmp('receive-window').onLoadLOSerial(serilList, lOTList);

                        }
                    });
                    var grid = Ext.getCmp('receive-detailGrid');
                    var store = grid.getStore();
                    store.baseParams = { record: Ext.encode({ voucherHeaderId: this.receiveHeaderId, action: "storeReceive" }) };

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
                    if (typeof this.purchaseOrderHeaderId != "undefined" && this.purchaseOrderHeaderId != "") {
                        {
                            var form = this.form.getForm();
                            form.findField('PurchaseOrderId').setValue(this.purchaseOrderHeaderId);
                            form.findField('PurchaseOrderNo').setValue(this.purchaseOrderNumber);
                            form.findField('PONo').setValue(this.purchaseOrderNumber);

                            form.findField('StoreId').setValue(this.storeId);
                            form.findField('Store').setValue(this.store);
                            form.findField('SupplierId').setValue(this.supplierId);
                            form.findField('Supplier').setValue(this.supplier);
                            form.findField('TaxRateIds').setValue(this.taxRateIds);
                            form.findField('TaxRateDescription').setValue(this.taxRateDescription);
                            form.findField('TotalSummarry').setValue(this.totalSummarry);
                            form.findField('TaxRate').setValue(this.taxRate);
                            form.findField('Discount').setValue(this.discount);

                          //  form.findField('ReceiveType').setValue("Order Receive");

                            var grid = Ext.getCmp('receive-detailGrid');
                            var store = grid.getStore();
                            store.baseParams = { record: Ext.encode({ voucherHeaderId: this.purchaseOrderHeaderId, action: "purchaseOrder" }) };
                            grid.getStore().reload({
                                params: {
                                    start: 0,
                                    limit: grid.pageSize
                                }
                            });
                        }
                        Ext.getCmp('receive-form').onReceiveTypeChange();
                    }

                }

            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.ux.receive.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.receive.Form();
        this.grid = new Ext.erp.ux.receive.GridDetail();
        this.items = [this.form, this.grid];
        this.bbar = [
            {
                xtype: 'tbfill'
            }, {
                text: 'Save',
                iconCls: 'icon-accept',
                scope: this,
                handler: this.onSave
            }, {
                xtype: 'tbseparator'
            }, {
                text: 'Close',
                iconCls: 'icon-exit',
                handler: this.onCancel,
                scope: this
            }];
        Ext.erp.ux.receive.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var grid = Ext.getCmp('receive-detailGrid');
        var store = grid.getStore();
        var rec = '', serialRec = '', lotRec = '';
        this.errorMesssage = "";
        var store = grid.getStore();
        var serialStore = grid.serialStore;
        var lOTStore = grid.lOTStore;
        var form = Ext.getCmp('receive-form').getForm();
        if (store.getCount() < 1) {
            Ext.MessageBox.show({
                title: 'Save failed',
                msg: "Please select detail items",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        rec = this.parseDetailData(store);
        lotRec = this.parseLOTDetailData(lOTStore);
        serialRec = this.parseSerialDetailData(serialStore);

        if (this.errorMesssage != "")
            return;
        if (this.action == "priceUpdate")
            this.updatePrice(rec);
        else
            this.submitForm(rec, serialRec, lotRec);

    },
    parseDetailData: function (store,) {
        var rec = '';
        var receiveWindow = Ext.getCmp('receive-window');

        store.each(function (item) {
            receiveWindow.errorMesssage = receiveWindow.validateDetailData(item);
            if (receiveWindow.errorMesssage != '') {
                Ext.MessageBox.show({
                    title: 'Save failed',
                    msg: "Please Enter Valid values for Item  " + item.data['Name'] + " for feilds " + "</br>" + receiveWindow.errorMesssage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
            rec = rec + item.data['Id'] + ':' +

                item.data['ReceiveHeaderId'] + ':' +
                item.data['ItemId'] + ':' +
                item.data['Quantity'] + ':' +
                item.data['ReceivedQuantity'] + ':' +
                item.data['RemainingQuantity'] + ':' +
                item.data['DamagedQuantity'] + ':' +
                item.data['UnitCost'] + ':' +
                item.data['Tax'] + ':' +
                item.data['ReceiveConditionId'] + ':' +
                item.data['Name'] + ':' +
                item.data['UnitId'] + ':' +
                item.data['Remark'] + ':' +
                item.data['ItemCategory'] + ':' +
            (typeof item.data['ExpireyDate'] != "undefined" && item.data['ExpireyDate'] != "" ? (new Date(item.data['ExpireyDate'])).format('M/d/y') : "") + ':' +
            item.data['ProductionDeliveryDetailId'] + ';';
        });
        return rec;
    },
    parseLOTDetailData: function (lOTStore) {
        var lotRec = '';
        lOTStore.each(function (item) {


            lotRec = lotRec + item.data['Id'] + ':' +
            item.data['ItemId'] + ':' +
            item.data['StoreId'] + ':' +
            item.data['Number'] + ':' +
            item.data['Manufacturer'] + ':' +
            (typeof item.data['ManufacturedDate'] != "undefined" && item.data['ManufacturedDate'] != "" ? (new Date(item.data['ManufacturedDate'])).format('M/d/y') : "") + ':' +
            (typeof item.data['ExpiredDate'] != "undefined" && item.data['ExpiredDate'] != "" ? (new Date(item.data['ExpiredDate'])).format('M/d/y') : "") + ':' +
            item.data['Quantity'] + ':' +
            item.data['CommittedQuantity'] + ':' +
            item.data['Remark'] + ':' +
            item.data['OperationId'] + ':' +
            item.data['ItemName'] + ';';


        });
        return lotRec;
    },
    parseSerialDetailData: function (serialStore) {
        var serialRec = '';
        serialStore.each(function (item) {
            serialRec = serialRec + item.data['Id'] + ':' +
                        item.data['ItemId'] + ':' +
                        item.data['StoreId'] + ':' +
                        item.data['ItemSerialId'] + ':' +
                        item.data['IsAvailable'] + ':' +
                        item.data['Number'] + ':' +
                        item.data['ItemName'] + ':' +
                        item.data['Description'] + ':' +
                        item.data['SN'] + ':' +
                        item.data['PlateNo'] + ':' +
                        item.data['IsDisposed'] + ':' +

                        item.data['Remark'] + ';';
        });
        return serialRec;
    },
    validateDetailData: function (item) {
        var errorMesssage = '';
        var form = Ext.getCmp('receive-form').getForm();
        var grid = Ext.getCmp('receive-detailGrid');

        var serialStore = grid.serialStore;
        var lOTStore = grid.lOTStore;

        var purchaseRequestId = form.findField("PurchaseRequestHeaderId").getValue();
        var purchaseOrderId = form.findField("PurchaseOrderId").getValue();
      
        if (typeof item.get('ReceivedQuantity') == 'undefined' || item.get('ReceivedQuantity') <= 0) {
            if (errorMesssage == "")
                errorMesssage = "Received Quantity";
            else
                errorMesssage = errorMesssage + "</br>" + "           Received Quantity";
        }
        if ((purchaseRequestId != "" || purchaseOrderId != "" ) && item.get('RemainingQuantity') < item.get('ReceivedQuantity') + item.get('DamagedQuantity')) {
            if (errorMesssage == "")
                errorMesssage = "Remaining Quantity should be greater than received quantity";
            else
                errorMesssage = errorMesssage + "</br>" + "           Remaining Quantity should be greater than received quantity";
        }
        if (typeof item.get('UnitCost') == 'undefined') {
            if (errorMesssage == "")
                errorMesssage = "Unit Cost";
            else
                errorMesssage = errorMesssage + "</br>" + "          Unit Cost";
        }
        if (typeof item.get('UnitId') == 'undefined' || item.get('UnitId') == "") {
            if (errorMesssage == "")
                errorMesssage = "Unit ";
            else
                errorMesssage = errorMesssage + "</br>" + "          Unit";
        }
        if (typeof item.get('ItemCategory') == 'undefined' || item.get('ItemCategory') == "") {
            if (errorMesssage == "")
                errorMesssage = "Item Category";
            else
                errorMesssage = errorMesssage + "</br>" + "          Item Category";
        }
       
        if (item.get('IsSerialItem') && (item.get('ReceivedQuantity') + item.get('DamagedQuantity')) != serialStore.query("ItemName", item.get('Name')).length) {
            if (errorMesssage == "")
                errorMesssage = "Total received quantity should be equal to number of serials added";
            else
                errorMesssage = errorMesssage + "</br>" + "          Total received quantity should be equal to number of serials added";

        }
        if (item.get('IsLOTItem')) {

            var lotList = lOTStore.query("ItemName", item.get('Item'));
            var totlLotQuantity = 0;
            lotList.each(function (item) {
                totlLotQuantity = totlLotQuantity + item.get('Quantity');

            });

            if (item.get('ReceivedQuantity') != totlLotQuantity)
                if (errorMesssage == "")
                    errorMesssage = "Total Received quantity should be equal to total added LOT quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Total Received quantity should be equal to total added LOT quantity";

        }
        return errorMesssage;
    },
    submitForm: function (rec, serialRec, lotRec) {
        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
        var window = this;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ receiveDetails: rec, itemSerials: serialRec, itemLOTs: lotRec, action: this.action }) },

            success: function (form, action) {

                Ext.getCmp('receive-form').getForm().reset();
                Ext.getCmp('receive-detailGrid').getStore().removeAll();
                Ext.getCmp('receive-paging').doRefresh();
                Ext.getCmp('receivePurchaseOrder-paging').doRefresh();

                Ext.MessageBox.show({
                    title: 'Success',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    scope: this
                });
                window.close();
            },
            failure: function (form, action) {
                Ext.MessageBox.hide();

                Ext.MessageBox.show({
                    title: 'Error',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            },
        });
    },
    updatePrice: function (rec) {
        var grid = Ext.getCmp('receive-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to update  the price for selected records',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            animEl: 'delete',
            fn: function (btn) {
                if (btn == 'ok') {
                    Ext.MessageBox.show({
                        msg: 'Please wait...',
                        width: 250,
                        wait: true,
                        waitConfig: { interval: 1000 }
                    });
                    var window = this;
                    Receive.UpdateReceivePriceDetail(id, rec, function (result) {
                        if (result.success) {
                            Ext.getCmp('receive-paging').doRefresh();
                            Ext.MessageBox.show({
                                title: 'Success',
                                msg: "Data has been deleted successfully",
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO,
                                scope: this
                            });
                            window.close();
                        }
                        else {
                            Ext.MessageBox.show({
                                title: 'Failed',
                                msg: result.data,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            });
                        }
                    });
                }
            }
        });

    },

    onLoadLOSerial: function (serilList, lOTList) {

        var grid = Ext.getCmp('receive-detailGrid');
        var serilStore = grid.serialStore;
        var lOTStore = grid.lOTStore;

        if (typeof serilList != "undefined" && serilList != null && serilList != "") {
            for (var i = 0; i < serilList.length; i++) {
                var item = serilList[i];
                var p = new Ext.data.Record({
                    Id: item.Id,
                    ItemId: item.ItemId,
                    StoreId: item.StoreId,
                    ItemSerialId: item.ItemSerialId,
                    Number: item.Number,
                    IsAvailable: item.IsAvailable,
                    Remark: '',
                });
                var count = serilStore.getCount();
                serilStore.insert(count, p);
            };
        }
        if (typeof lOTList != "undefined" && lOTList != null && lOTList != "") {
            for (var i = 0; i < lOTList.length; i++) {
                var item = lOTList[i];
                var p = new Ext.data.Record({
                    Id: item.Id,
                    ItemId: item.ItemId,
                    ItemName: item.ItemName,
                    OperationId: item.OperationId,
                    StoreId: item.StoreId,
                    ItemLOTId: item.ItemLOTId,
                    Number: item.Number,
                    Quantity: item.Quantity,
                    Manufacturer: item.Manufacturer,
                    ManufacturedDate: item.ManufacturedDate,
                    ExpiredDate: item.ExpiredDate,
                    Remark: '',
                });
                var count = lOTStore.getCount();
                lOTStore.insert(count, p);
            };
        }

    },
    onCancel: function () {
        this.close();
    }
});
Ext.reg('receive-window', Ext.erp.ux.receive.Window);

/**
* @desc      Receive grid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.receive
* @class     Ext.erp.ux.receive.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.receive.Grid = function (config) {
    Ext.erp.ux.receive.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Receive.GetAllHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DESC'
            },
            fields: ['Id', 'VoucherNumber', 'ItemType', 'ReceivedDate', 'Approval','StatusId', 'Status', 'Supplier','PreparedBy', 'PurchaseOrderNo', 'IsLastStep', 'IsForign', 'ReceivedBy', 'DelivereddBy', 'Store', 'ReceiveType'],
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
        id: 'receive-grid',
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
                this.onEdit();
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
                if (record.get("Status") == "Received")
                    return '<img src="Content/images/app/yes.png"/>';
                else if (record.get("IsLastStep") == true)
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
            dataIndex: 'ReceivedDate',
            header: 'Receive Date',
            sortable: true,
            width: 80,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'IsForign',
            header: 'Is Forign?',
            sortable: true,
            width: 100,
            hidden:true,
            menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value)
                    return '<img src="Content/images/app/yes.png"/>';
                          else
                    return '<img src="Content/images/app/no.png"/>';
            }
        }, {
            dataIndex: 'Supplier',
            header: 'Supplier',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'Store',
            header: 'Store',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'PurchaseOrderNo',
            header: 'PO',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        },  {
            dataIndex: 'ReceiveType',
            header: 'Receive Type',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'PreparedBy',
            header: 'Prepared By',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'Status',
            header: 'Status',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'Approval',
            header: 'Approval',
            sortable: true,
            width: 100,
            menuDisabled: true,
            editor: new Ext.form.TriggerField({
                id:'recieveApproval',
                onTriggerClick: function (e) {
                    var grid = Ext.getCmp('receive-grid');
                    var selectedrecord = grid.getSelectionModel().getSelected();
                    var id = selectedrecord.get('Id');
                    var position = Ext.getCmp('recieveApproval').getPosition(false);
                    new Ext.erp.ux.voucherApproval.Window({
                        title: 'Approval',
                        id: id,
                        x: position[0]-290,
                        y: position[1] + 21,
                    }).show();
                }
            })
        }, ]
    }, config));
}
Ext.extend(Ext.erp.ux.receive.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [{
            id: 'searchReceive',
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearchVoucher
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Receive', 'CanAdd'),
            handler: this.onAdd
        },{
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Receive', 'CanEdit'),
     
            handler: this.onEdit
        },  {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Receive',
            iconCls: 'icon-accept',
            disabled: !Ext.erp.ux.Reception.getPermission('Receive', 'CanEdit'),
            handler: this.onReceive
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Void',
            iconCls: 'icon-delete',
            disabled: !Ext.erp.ux.Reception.getPermission('Receive', 'CanDelete'),
            handler: this.onDelete
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Revise',
            iconCls: 'icon-accept',
            disabled: !Ext.erp.ux.Reception.getPermission('Receive', 'CanEdit'),
            handler: this.onRevise
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Preview',
            id: 'preview-Receive',
            hidden: false,
            iconCls: 'icon-preview',
            handler: this.onPreview
        },];
        this.bbar = new Ext.PagingToolbar({
            id: 'receive-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.receive.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {

        var grid = Ext.getCmp('receive-grid');
        if (!grid.getSelectionModel().hasSelection()) return;

        var voucherId = grid.getSelectionModel().getSelected().get('Id');
        var itemType = grid.getSelectionModel().getSelected().get('ItemType');

        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        window.open('Reports/ErpReportViewer.aspx?rt=PreviewGRN&id=' + voucherId + '&itemType=' + itemType, 'PreviewIV', parameter);

    },
    onSearchVoucher: function () {
        Ext.erp.ux.voucherSearch.Observable.on('searchvoucher1', function (result) {
            result['mode'] = 'search';
            var grid = Ext.getCmp('receive-grid');
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.voucherSearch.Window({ title: 'Search Transactions', action: 'searcVoucher1' }).show();
    },
    onAdd: function () {
           new Ext.erp.ux.receive.Window({
            title: 'Add Receive',
            action: 'add'
        }).show();
    },
    onEdit: function () {
        var grid = Ext.getCmp('receive-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var status = grid.getSelectionModel().getSelected().get('Status');

        if (status != "Posted") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "Only Posted transaction can be edited, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.erp.ux.receive.Window({
            title: 'Edit Receive',
            receiveHeaderId: id,
            action: 'edit'
        }).show();
    },
    onRevise: function () {
        var grid = Ext.getCmp('receive-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var status = grid.getSelectionModel().getSelected().get('Status');
        if (status == "Received" ) {
            Ext.MessageBox.show({
                title: 'Error',
                msg: " received transaction are  not be revised, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.ux.receive.Window({
            title: 'Revise Receive',
            receiveHeaderId: id,
            action: 'revise'
        }).show();
    },
     onReceive: function () {
         var grid = Ext.getCmp('receive-grid');
         if (!grid.getSelectionModel().hasSelection()) return;
         var id = grid.getSelectionModel().getSelected().get('Id');
         var storeId = grid.getSelectionModel().getSelected().get('StoreId');
         var isLastStep = grid.getSelectionModel().getSelected().get('IsLastStep');
         var Status = grid.getSelectionModel().getSelected().get('Status');

         if (isLastStep == false || Status == "Received") {
             Ext.MessageBox.show({
                 title: 'Error',
                 msg: "please authorization step is remain or already received, check the status!",
                 buttons: Ext.Msg.OK,
                 icon: Ext.MessageBox.INFO,
                 scope: this
             });
             return;
         }
         new Ext.erp.ux.receive.Window({
             title: 'Receive',
             receiveHeaderId: id,
             storeId: storeId,
             action: 'receive'
         }).show();
    },
    onDelete: function () {
        var grid = Ext.getCmp('receive-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var status = grid.getSelectionModel().getSelected().get('Status');
        if (status == "Void") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "you can not void already void transaction, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected record',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            animEl: 'delete',
            fn: function (btn) {
                if (btn == 'ok') {
                    Ext.MessageBox.show({
                        msg: 'Please wait...',
                        width: 250,
                        wait: true,
                        waitConfig: { interval: 1000 }
                    });
                    Receive.Void(id, function (result) {
                        if (result.success) {
                            Ext.getCmp('receive-paging').doRefresh();
                            Ext.getCmp('receivePurchaseOrder-paging').doRefresh();

                            Ext.MessageBox.show({
                                title: 'Success',
                                msg: "Data has been deleted successfully",
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO,
                                scope: this
                            });
                        }
                        else {
                            Ext.MessageBox.show({
                                title: 'Failed',
                                msg: result.data,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            });
                        }
                    });
                }
            }
        });

    },
    onIssue: function () {
        var grid = Ext.getCmp('receive-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.ux.requestOrderPicker.Window({
            title: 'Select Request Order',
            voucherHeaderId: id,
            action: 'Select'
        }).show();

    },
    customRenderer: function (value, metaData, record, rowIndex, colIndex, store) {

        if (record.get("Status") == "Approved")
            return '<span style=color:green>' + value + '</span>';
        else if (record.get("Status") == "Void")
            return '<span style=color:red>' + value + '</span>';
        else if (record.get("Status") == "Delivered")
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
        Ext.erp.ux.receive.Grid.superclass.afterRender.apply(this, arguments);
    },

});
Ext.reg('receive-grid', Ext.erp.ux.receive.Grid);

/**
* @desc     receive grid
* @author   Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.receive
* @class     Ext.erp.ux.receive.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.receive.PurchaseOrderGrid = function (config) {
    Ext.erp.ux.receive.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Receive.GetAllPurchaseOrderHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DESC'
            }, 
    fields: ['Id', 'VoucherNumber', 'OrderedDate', 'RequiredDate', 'SupplierReferenceNo','Discount','TaxRateIds','TaxRate','TotalSummarry','TaxRateDescription','SupplierId', 'Supplier', 'Consumer', 'StatusId', 'Status', 'OrderedBy', 'Store','StoreId', 'OrderType'],
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
        id: 'receivePurchaseOrder-grid',
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
            rowclick: function (grid, rowIndex, e) {
            },
            scope: this
        },
        columns: [{
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
            menuDisabled: true
        }, {
            dataIndex: 'OrderType',
            header: 'Purchase Order Type',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Supplier',
            header: 'Supplier',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'SupplierReferenceNo',
            header: 'Supplier Reference No',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'OrderedDate',
            header: 'Order Date',
            sortable: true,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'Store',
            header: 'Store',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Status',
            header: 'Status',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.receive.PurchaseOrderGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [
            {
                id: 'searchPurchaseOrder',
                text: 'Search',
                iconCls: 'icon-filter',
                handler: this.onSearchVoucher
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: !Ext.erp.ux.Reception.getPermission('Receive', 'CanAdd'),
                handler: this.onAdd
            },];
        this.bbar = new Ext.PagingToolbar({
            id: 'receivePurchaseOrder-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.receive.PurchaseOrderGrid.superclass.initComponent.apply(this, arguments);
    },
    onSearchVoucher: function () {
        Ext.erp.ux.voucherSearch.Observable.on('searchvoucher', function (result) {
            result['mode'] = 'search';
            var grid = Ext.getCmp('receivePurchaseOrder-grid');
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.voucherSearch.Window({ title: 'Search Transactions' }).show();
    },
    onAdd: function () {
        var grid = Ext.getCmp('receivePurchaseOrder-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');

        var purchaseOrderNumber = grid.getSelectionModel().getSelected().get('VoucherNumber');
        var orderedBy = grid.getSelectionModel().getSelected().get('OrderedBy');
        var storeId = grid.getSelectionModel().getSelected().get('StoreId');
        var store = grid.getSelectionModel().getSelected().get('Store');
        var supplierId = grid.getSelectionModel().getSelected().get('SupplierId');
        var supplier = grid.getSelectionModel().getSelected().get('Supplier');

        var taxRateIds = grid.getSelectionModel().getSelected().get('TaxRateIds');
        var taxRateDescription = grid.getSelectionModel().getSelected().get('TaxRateDescription');
        var totalSummarry = grid.getSelectionModel().getSelected().get('TotalSummarry');
        var taxRate = grid.getSelectionModel().getSelected().get('TaxRate');
        var discount = grid.getSelectionModel().getSelected().get('Discount');

        new Ext.erp.ux.receive.Window({
            title: 'Add Receive',
            purchaseOrderHeaderId: id,
            purchaseOrderNumber: purchaseOrderNumber,
            orderedBy: orderedBy,
            storeId: storeId,
            store: store,
            discount:discount,
            supplierId: supplierId,
            supplier: supplier,
            taxRateIds: taxRateIds,
            taxRateDescription: taxRateDescription,
            totalSummarry: totalSummarry,
            taxRate:taxRate,
            action: 'add'
        }).show();
    },
    onVoid: function () {
        var grid = Ext.getCmp('receivePurchaseOrder-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var status = grid.getSelectionModel().getSelected().get('Status');
        if (status != "Posted") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "Only Posted requisition order is to be void, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to void the selected record',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            animEl: 'delete',
            fn: function (btn) {
                if (btn == 'ok') {
                    Ext.MessageBox.show({
                        msg: 'Please wait...',
                        width: 250,
                        wait: true,
                        waitConfig: { interval: 1000 }
                    });
                    Receive.VoidRequisitionOrder(id, function (result) {
                        if (result.success) {
                            Ext.getCmp('receivePurchaseOrder-paging').doRefresh();

                            Ext.MessageBox.show({
                                title: 'Success',
                                msg: "Data has been void successfully",
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO,
                                scope: this
                            });
                        }
                        else {
                            Ext.MessageBox.show({
                                title: 'Failed',
                                msg: result.data,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            });
                        }
                    });
                }
            }
        });
    },
    customRenderer: function (value, metaData, record, rowIndex, colIndex, store) {

        if (record.get("Status") == "Approved")
            return '<span style=color:green>' + value + '</span>';
        else if (record.get("Status") == "Void")
            return '<span style=color:red>' + value + '</span>';
        else if (record.get("Status") == "Partially")
            return '<span style=color:blue>' + value + '</span>';

        else
            return '<span style=color:black>' + value + '</span>';

    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.ux.receive.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('receivePurchaseOrder-grid', Ext.erp.ux.receive.PurchaseOrderGrid);

/**
* @desc      receive panel
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @version   $Id: receive.js, 0.1
* @namespace Ext.erp.ux.receive
* @class     Ext.erp.ux.receive.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.receive.Panel = function (config) {
    Ext.erp.ux.receive.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.receive.Panel, Ext.Panel, {
    initComponent: function () {
        this.headerGrid = new Ext.erp.ux.receive.Grid();
   
        this.purchaseOrderGrid = new Ext.erp.ux.receive.PurchaseOrderGrid();

        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                split: true,
                width: 250,
                minSize: 200,
                maxSize: 600,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.purchaseOrderGrid]
            }, {
                region: 'center',
                border: false,
                layout: 'fit',
                items: [this.headerGrid]
            }]
        }];


        Ext.erp.ux.receive.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('receive-panel', Ext.erp.ux.receive.Panel);
