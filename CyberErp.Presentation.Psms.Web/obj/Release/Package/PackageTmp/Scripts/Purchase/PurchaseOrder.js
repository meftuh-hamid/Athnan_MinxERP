Ext.ns('Ext.erp.ux.purchaseOrder');

/**
* @desc      PurchaseOrder form
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.purchaseOrder
* @class     Ext.erp.ux.purchaseOrder.Form
* @extends   Ext.form.FormPanel
*/

Ext.erp.ux.purchaseOrder.Form = function (config) {
    Ext.erp.ux.purchaseOrder.Form.superclass.constructor.call(this, Ext.apply({
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
        id: 'purchaseOrder-form',
        frame: true,
        labelWidth: 100,
        padding: 5,
        autoHeight: false,
        border: false,

        loadDocument: function () {

            PurchaseOrder.GetDocumentNo(function (result) {
                var form = Ext.getCmp('purchaseOrder-form').getForm();
                form.findField('VoucherNumber').setValue(result.data.DocNo);
                form.findField('StatusId').setValue(result.data.StatusId);
                form.findField('PreparedById').setValue(result.data.EmployeeId);
                form.findField('OrderedById').setValue(result.data.EmployeeId);
                form.findField('OrderedBy').setValue(result.data.Employee);
                form.findField('OrderedDate').setValue(new Date());
                form.findField('FiscalYearId').setValue(result.data.FiscalYearId);
                form.findField('Remark').setValue( "If you have any questions about this purchase order, please contact "+result.data.Address);
               



            });


        },
        onOrderTypeChange: function () {
            var form = Ext.getCmp('purchaseOrder-form').getForm();
            var orderType = form.findField('OrderType').getRawValue();
            cm = Ext.getCmp('purchaseOrder-detailGrid').getColumnModel();

            if (orderType == "Direct") {
                form.findField('SalesOrderNo').setVisible(false);
                form.findField('RequestForQuotationNo').setVisible(false);
                form.findField('PurchaseRequestNo').setVisible(true);

                form.findField('SalesOrderNo').allowBlank = true;
                form.findField('RequestForQuotationNo').allowBlank = true;
                form.findField('PurchaseRequestNo').allowBlank = true;


            }
            else if (orderType == "RFQ") {
                form.findField('SalesOrderNo').setVisible(false);
                form.findField('PurchaseRequestNo').setVisible(false);
                form.findField('SalesOrderNo').allowBlank = true;
                    form.findField('PurchaseRequestNo').allowBlank = true;

            }
            else if (orderType == "SalesOrder") {

                form.findField('SalesOrderNo').setVisible(true);
                form.findField('PurchaseRequestNo').setVisible(false);

                form.findField('SalesOrderNo').allowBlank = false;
                 form.findField('PurchaseRequestNo').allowBlank = true;
            }
            else {
                form.findField('SalesOrderNo').setVisible(true);
                form.findField('PurchaseRequestNo').setVisible(false);
                form.findField('SalesOrderNo').allowBlank = true;
                form.findField('PurchaseRequestNo').allowBlank = true;


            }


        },
        loadPurchaseModality: function () {
            var form = Ext.getCmp('purchaseOrder-form').getForm();
            var purchaseModalityData = form.findField('PurchaseModalityData').getValue();

            var dataList = purchaseModalityData != '' ? purchaseModalityData.split(',') : '';
            var arrayData = [];
            for (i = 0; i < dataList.length; i++) {
                arrayData.push([dataList[i], dataList[i]])
            }
            var field = form.findField('PurchaseModality');
            field.getStore().loadData(arrayData);
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
                },  {
                    name: 'CustomerId',
                    xtype: 'hidden'
                }, {
                    name: 'RevisedPurchaseOrderId',
                    xtype: 'hidden'
                }, {
                    name: 'FiscalYearId',
                    xtype: 'hidden'
                },  {
                    name: 'SalesOrderId',
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
                },  {
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
                },  {
                    name: 'VoucherNumber',
                    xtype: 'textfield',
                    fieldLabel: 'Voucher Number',
                    readOnly: false,
                    allowBlank: false
                }, {
                    name: 'Version',
                    xtype: 'textfield',
                    fieldLabel: 'Version',
                    readOnly: false,
                    hidden:true,
                    value:'',
                    allowBlank: true
                }, {
                    hiddenName: 'SalesType',
                    xtype: 'combo',
                    fieldLabel: 'Cash/Credit',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: false,
                    hidden: false,
                    forceSelection: false,
                    emptyText: '---Select---',
                    allowBlank: false,
                    store: new Ext.data.ArrayStore({
                        fields: ['Id', 'Name'],
                        idProperty: 'Id',
                        data: [
                            ['Cash', 'Cash'],
                            ['Credit', 'Credit'],
                       
                        ]
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
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
                        typeAhead: true,
                        hideTrigger: true,
                        minChars: 2,
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
                                fields: ['Id', 'Name', 'PurchaseModality', 'TaxRateIds', 'TaxRateDescription', 'TaxRate']
                            }),
                            autoLoad: true,
                            api: { read: Psms.GetSupplierBySearch }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        pageSize: 10, listeners: {
                            select: function (cmb, rec, idx) {
                                var form = Ext.getCmp('purchaseOrder-form').getForm();
                                form.findField('SupplierId').setValue(rec.id);
                                 form.findField('TaxRateIds').setValue(rec.get("TaxRateIds"));
                                form.findField('TaxRateDescription').setValue(rec.get("TaxRateDescription"));
                                form.findField('TaxRate').setValue(rec.get("TaxRate"));
                                Ext.getCmp('purchaseOrder-form').loadPurchaseModality();
                                Ext.getCmp('purchaseOrder-detailGrid').getTotalSummary();

                            },
                            change: function (cmb, newvalue, oldvalue) {
                                if (newvalue == "") {
                                    var form = Ext.getCmp('purchaseOrder-form').getForm();
                                    form.findField('SupplierId').reset();
                                    form.findField('PurchaseModality').reset();
                                    Ext.getCmp('purchaseOrder-detailGrid').getTotalSummary();

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
                            var form = Ext.getCmp('purchaseOrder-form').getForm();
                            new Ext.erp.ux.supplier.Window({
                                targetForm: form,
                            }).show();

                        }
                    }
                    ]
                }, {
                    name: 'SupplierReferenceNo',
                    xtype: 'textfield',
                    hidden:true,
                    fieldLabel: 'Supplier Ref. No',
                    allowBlank: true
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
                            var form = Ext.getCmp('purchaseOrder-form').getForm();
                            form.findField("OrderTypeId").setValue(rec.id);
                            Ext.getCmp('purchaseOrder-form').onOrderTypeChange();
                        },
                    }
                },  {
                    hiddenName: 'PurchaseRequestNo',
                    xtype: 'combo',
                    fieldLabel: 'PR No',
                    typeAhead: true,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    hidden:true,
                    emptyText: '---Type to Search---',
                    mode: 'remote',
                    allowBlank: true,
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
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
                            var form = Ext.getCmp('purchaseOrder-form').getForm();
                            form.findField('PurchaseRequestHeaderId').setValue(rec.id);
                            form.findField('StoreId').setValue(rec.get('StoreId'));
                            form.findField('Store').setValue(rec.get('Store'));

                           var grid = Ext.getCmp('purchaseOrder-detailGrid');
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
                                var form = Ext.getCmp('purchaseOrder-form').getForm();
                                form.findField('PurchaseRequestHeaderId').reset();
                            }
                        }
                    }
                },]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [
                     {
                         hiddenName: 'Store',
                         xtype: 'combo',
                         fieldLabel: 'Store',
                         typeAhead: true,
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
                                 fields: ['Id', 'Name', 'Address']
                             }),
                             autoLoad: true,
                             api: { read: Psms.GetStoreBySearch }
                         }),
                         valueField: 'Name',
                         displayField: 'Name',
                         pageSize: 10,
                         listeners: {
                             select: function (cmb, rec, idx) {
                                 var form = Ext.getCmp('purchaseOrder-form').getForm();
                                 form.findField('StoreId').setValue(rec.id);
                     
                             },
                             change: function (cmb, newvalue, oldvalue) {
                                 if (newvalue == "") {
                                     var form = Ext.getCmp('purchaseOrder-form').getForm();
                                     form.findField('StoreId').reset();
                        

                                 }
                             }
                         }
                     },
                      {
                          hiddenName: 'SalesOrderNo',
                          xtype: 'combo',
                          fieldLabel: 'Sales Order No',
                          typeAhead: true,
                          hideTrigger: true,
                          minChars: 2,
                          hidden: true,
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
                                  fields: ['Id', 'Name', 'VoucherNumber', 'CustomerId', 'Customer']
                              }),
                              autoLoad: true,
                              api: { read: Psms.GetSalesOrderBySearch }
                          }),
                          valueField: 'VoucherNumber',
                          displayField: 'VoucherNumber',
                          pageSize: 10, listeners: {
                              select: function (cmb, rec, idx) {
                                  var form = Ext.getCmp('purchaseOrder-form').getForm();
                                  form.findField('CustomerId').setValue(rec.data['CustomerId']);
                                  form.findField('Customer').setValue(rec.data['Customer']);
                                  var grid = Ext.getCmp('purchaseOrder-detailGrid');
                                  var store = grid.getStore();
                                  store.baseParams = { record: Ext.encode({ voucherHeaderId: rec.id, action: "salesOrder" }) };
                                  grid.getStore().reload({
                                      params: {
                                          start: 0,
                                          limit: grid.pageSize
                                      }
                                  });
                              },
                              change: function (cmb, newvalue, oldvalue) {
                                  if (newvalue == "") {
                                      var form = Ext.getCmp('purchaseOrder-form').getForm();
                                      form.findField('CustomerId').reset();
                                      form.findField('Customer').reset();
                                  }
                              }
                          }
                      }, {
                          hiddenName: 'Customer',
                          xtype: 'combo',
                          fieldLabel: 'Customer',
                          typeAhead: true,
                          hideTrigger: true,
                          minChars: 2,
                          hidden: true,
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
                                  fields: ['Id', 'Name']
                              }),
                              autoLoad: true,
                              api: { read: Psms.GetCustomerBySearch }
                          }),
                          valueField: 'Name',
                          displayField: 'Name',
                          pageSize: 10, listeners: {
                              select: function (cmb, rec, idx) {
                                  var form = Ext.getCmp('purchaseOrder-form').getForm();
                                  form.findField('CustomerId').setValue(rec.id);
                              },
                              change: function (cmb, newvalue, oldvalue) {
                                  if (newvalue == "") {
                                      var form = Ext.getCmp('purchaseOrder-form').getForm();
                                      form.findField('CustomerId').reset();
                                  }
                              }
                          }
                      },


                    {
                         name: 'OrderedDate',
                         xtype: 'datefield',
                         fieldLabel: 'Order Date',
                         width: 100,
                         allowBlank: false,
                         value: new Date(),
                         maxValue: (new Date()).format('m/d/Y')
                     },
                ]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [
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
                                   var form = Ext.getCmp('purchaseOrder-form').getForm();
                                   var targetGrid = Ext.getCmp('purchaseOrder-detailGrid');
                                   new Ext.erp.ux.taxPicker.Window({
                                       targetForm: form,
                                       targetGrid: targetGrid
                                   }).show();

                               }
                           }
                           ]
                       }, {
                        hiddenName: 'OrderedBy',
                        xtype: 'combo',
                        fieldLabel: 'Ordered By',
                        typeAhead: true,
                        width: 100,
                        hideTrigger: true,
                        minChars: 2,
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
                                var form = Ext.getCmp('purchaseOrder-form').getForm();
                                form.findField('OrderedById').setValue(rec.id);
                            },
                            change: function (cmb, newvalue, oldvalue) {
                                if (newvalue == "") {
                                    var form = Ext.getCmp('purchaseOrder-form').getForm();
                                    form.findField('OrderedById').reset();

                                }
                            }
                        }
                       }, {
                           name: 'Discount',
                           xtype: 'numberfield',
                           fieldLabel: 'Discount',
                           width: 100,
                           allowBlank: true,
                           readOnly: false,
                           listeners: {
                               change: function (arg, newvalue) {
                                   var grid = Ext.getCmp('purchaseOrder-detailGrid');
                                   grid.getTotalSummary();
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
Ext.extend(Ext.erp.ux.purchaseOrder.Form, Ext.form.FormPanel);
Ext.reg('purchaseOrder-form', Ext.erp.ux.purchaseOrder.Form);



/**
* @desc      PurchaseOrder detailGrid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.purchaseOrder
* @class     Ext.erp.ux.purchaseOrder.GridDetail
* @extends   Ext.grid.GridPanel
*/

Ext.erp.ux.purchaseOrder.GridDetail = function (config) {
    Ext.erp.ux.purchaseOrder.GridDetail.superclass.constructor.call(this, Ext.apply({
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

            fields: ['Id', 'PurchaseOrderHeaderId', 'ItemId', 'UnitId', 'MeasurementUnit', 'UnitCost', 'Tax','Weight', 'TaxRate', 'TaxRateIds', 'TaxRateDescription', 'Name', 'Code', 'Quantity', 'UnprocessedQuantity', 'BudgetedQuantity', 'RemainingQuantity', 'Remark'],

            remoteSort: true,
            listeners: {
                load: function () {
                    var grid = Ext.getCmp('purchaseOrder-detailGrid');
                        grid.calculateTax(true);
                },
            },
        }),
        id: 'purchaseOrder-detailGrid',
        clicksToEdit: 1,
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        taxStore: new Ext.data.Store(),
        purchaseOrderSourceStore: new Ext.data.Store(),
        border: true,
        height: 250,
        calculateTax: function (isRecalculate, itemRecord) {

            var grid = Ext.getCmp('purchaseOrder-detailGrid');
            var form = Ext.getCmp('purchaseOrder-form');
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
            var grid = Ext.getCmp('purchaseOrder-detailGrid');
            var form = Ext.getCmp('purchaseOrder-form');
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
                total = total + itemTotal;
                for (var i = 0; i < taxRate.length - 1; i++) {
                    tax = 0;
                    var taxRateValue = taxRate[i].split(':')[0];
                    taxRateValue = parseFloat(taxRateValue);
                    var isAddition = taxRate[i].split(':')[1];
                    if (isAddition == "true" || isAddition == "True")
                        tax = tax + parseFloat(otherTaxableAmount+itemTotal - discountAmount) * parseFloat(taxRateValue);
                    else
                        tax = tax - parseFloat(otherTaxableAmount+itemTotal - discountAmount) * parseFloat(taxRateValue);                  
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
            Ext.getCmp('purchaseOrder-totalSummary').setValue(totalSummary);
            form.getForm().findField('TotalSummarry').setValue(totalSummary);
        },
        getOtherTax: function () {
            var grid = Ext.getCmp('purchaseOrder-detailGrid');
            var form = Ext.getCmp('purchaseOrder-form');
            var discount = form.getForm().findField('Discount').getValue(); if (typeof discount == "undefined" || discount == "") discount = 0;
            var taxRateString = form.getForm().findField('TaxRate').getValue();
            var taxRateDescriptionString = form.getForm().findField('TaxRateDescription').getValue();
            var taxRate = taxRateString != "" && typeof taxRateString != "undefined" ? this.getTaxRate(taxRateString) : '';
            var taxRateDescription = taxRateDescriptionString != "" && typeof taxRateDescriptionString != "undefined" ? this.getTaxRateDescription(taxRateDescriptionString) : '';
            var store = grid.getStore();
            var totalCount = store.getCount();
            var totalSummary =grid.totalSummary;
            var taxTotal = grid.taxTotal;
            for (var i = 0; i < taxRate.length - 1; i++) {
                var tax = 0;
                totalSummary = totalSummary + " " + taxRateDescription[i] + ":";
                Ext.each(store.getRange(0, totalCount - 1), function (record) {
                    var itemTotal = parseFloat(record.data['UnitCost']) * parseFloat(record.data['Quantity']);
                    var discountAmount = discount > 0 ? grid.getDiscount(store, totalCount, discount, itemTotal) : 0;
                    var weight=record.data['Weight'];if(weight==0 || typeof weight=='undefined' || weight=='')weight=1;
                    var unitCost = record.data['UnitCost'] - discountAmount;
                    
                    var taxRateValue = taxRate[i].split(':')[0];
                    var isAddition = taxRate[i].split(':')[1];
                    var code = taxRate[i].split(':')[3];
                    if (code == 'Transportation')
                    {
                        tax = tax + parseFloat(record.data['Quantity']) * parseFloat(taxRateValue) / parseFloat(weight);
                    }
                    else
                    {
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
            var grid = Ext.getCmp('purchaseOrder-detailGrid');
            var queryStore = grid.taxStore.query("taxType", taxType);
            if (queryStore.getCount() > 0)
            {
                queryStore.each(function (item) {
                    var recordAmount = item.get('amount');
                    item.set('amount', recordAmount + amount)
                });
             }
            else
            {
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
            var grid = Ext.getCmp('purchaseOrder-detailGrid');
            var taxStore = grid.taxStore
            var addtaxSummary = '';
            var subtaxSummary = '';
            var totalAmount = 0;
            var taxSummary = "";
            taxStore.each(function (item) {
                if (parseFloat(item.get('amount')) > 0 )
                {
                    addtaxSummary = addtaxSummary + " " + item.get('taxType') + ":" + Ext.util.Format.number(item.get('amount'), '0,000.00 ') + " ; ";
                    totalAmount = totalAmount + parseFloat(item.get('amount'));
                }
                else
                    subtaxSummary = subtaxSummary + " " + item.get('taxType') + ":" + Ext.util.Format.number(item.get('amount'), '0,000.00 ') + " ; ";
            });
            var total=parseFloat( subTotal)+ parseFloat(totalAmount) ;
            addtaxSummary = addtaxSummary + " ; " + " Total:" + Ext.util.Format.number(total, '0,000.00 ') + " ; ";;
            taxSummary = addtaxSummary + subtaxSummary;
            return taxSummary;
        },
        getTaxTotal: function (subTotal) {
            var grid = Ext.getCmp('purchaseOrder-detailGrid');
            var taxStore = grid.taxStore
            var taxtotal = 0;
            taxStore.each(function (item) {
                if (parseFloat(item.get('amount')) < 0) {
                    if (parseFloat(subTotal) > 10000)
                        taxtotal = taxtotal + parseFloat(item.get('amount'));
                }
                else
                taxtotal = taxtotal +parseFloat( item.get('amount'));
            });
            return taxtotal;
        },
        getDiscount: function (store,totalCount, discountAmount, itemPriceTtoal) {
            var total = 0;
            Ext.each(store.getRange(0, totalCount - 1), function (record) {
                    total = total + parseFloat(record.data['UnitCost']) * parseFloat(record.data['Quantity']);               
            });
            var discount = (itemPriceTtoal /total) * ((total)*discountAmount/100);
            return discount;
        },
        rFQStore: new Ext.data.Store(),
        getTaxableRates:function(){
            var grid = Ext.getCmp('purchaseOrder-detailGrid');
            var form = Ext.getCmp('purchaseOrder-form');
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
        sm:Ext.erp.ux.common.SelectionModel,
        viewConfig: {
            forceFit: true
        },
        listeners: {
            beforeLoad: function () {
                Ext.getCmp('purchaseOrder-detailGrid').body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
                Ext.getCmp('purchaseOrder-detailGrid').body.unmask();


            },
            loadException: function () {
                Ext.getCmp('purchaseOrder-detailGrid').body.unmask();
            },
            afteredit: function (e) {
                var record = e.record;
                if (record.get('UnitCost') > 0) {
                    var grid = Ext.getCmp('purchaseOrder-detailGrid');
                    grid.calculateTax(false, record);
                }
                if (e.field == 'Quantity') {
                    var grid = Ext.getCmp('purchaseOrder-detailGrid');
                    grid.getTotalSummary();
                }
            }
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
                    //editor: new Ext.form.ComboBox({
                    //    typeAhead: true, width: 100,
                    //    hideTrigger: true,
                    //    minChars: 2,
                    //    listWidth: 300,
                    //    emptyText: '---Type to Search---',
                    //    mode: 'remote',
                    //    pageSize: 12,
                    //    allowBlank: false,
                    //    tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
                    //    store: new Ext.data.DirectStore({
                    //        reader: new Ext.data.JsonReader({
                    //            successProperty: 'success',
                    //            idProperty: 'Id',
                    //            root: 'data',
                    //            fields: ['Id', 'Name', 'Code','UnitId', 'MeasurementUnit','TaxRateIds','TaxRateDescription','TaxRate']
                    //        }),
                    //        api: { read: Psms.GetItemBySearch }
                    //    }),
                    //    valueField: 'Name',
                    //    displayField: 'Name',
                    //    listeners: {

                    //        select: function (combo, record, index) {                           

                    //            var detailDrid = Ext.getCmp('purchaseOrder-detailGrid');
                    //            var selectedrecord = detailDrid.getSelectionModel().getSelected();
                    //            selectedrecord.set('ItemId', record.get("Id"));
                    //            selectedrecord.set('UnitId', record.get("UnitId"));
                    //            selectedrecord.set('Code', record.get("Code"));
                    //            selectedrecord.set('MeasurementUnit', record.get("MeasurementUnit"));
                    //            selectedrecord.set('TaxRateIds', record.get("TaxRateIds"));
                    //            selectedrecord.set('TaxRateDescription', record.get("TaxRateDescription"));
                    //            selectedrecord.set('TaxRate', record.get("TaxRate"));
                    //        }
                    //    }
                    //})
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

                                var detailDrid = Ext.getCmp('purchaseOrder-detailGrid');
                                var selectedrecord = detailDrid.getSelectionModel().getSelected();
                                selectedrecord.set('UnitId', record.get("Id"));
                            }
                        }
                    })
                },  {
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
Ext.extend(Ext.erp.ux.purchaseOrder.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };

        this.tbar = [
            {
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: false,
                handler: function () {
                    var detailDrid = Ext.getCmp('purchaseOrder-detailGrid');
                    var store = detailDrid.getStore();
                    var defaultData = {
                        Remark:'',
                        Quantity: 0,
                        Tax: 0,
                        UnitCost:0,
                        OrderedQuantity: 0,
                        RemainingQuantity: 0
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
                    var grid = Ext.getCmp('purchaseOrder-detailGrid');

                    if (!grid.getSelectionModel().hasSelection())
                        return;

                    var selectedrecord = grid.getSelectionModel().getSelected();
                    grid.getStore().remove(selectedrecord);
                    var headerGrid = Ext.getCmp('purchaseOrder-detailGrid');
                                   headerGrid.getTotalSummary();
                }
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Purchase Order',
                hidden:true,
                iconCls: 'icon-accept',
                disabled: false,
                handler: function () {
                    var detailDrid = Ext.getCmp('purchaseOrder-detailGrid');
                    new Ext.erp.ux.purchaseRequestSelector.Window({
                        title: 'Purchase Order Selector',
                        itemStore: detailDrid.purchaseOrderSourceStore,
                        targetGrid: detailDrid,
                        targetStore: detailDrid.purchaseOrderSourceStore
                    }).show();
                }
            }, '->',
            {
                xtype: 'button',
                text: 'Picker',
                iconCls: 'icon-picker',
                disabled: false,
                handler: function () {
                    var detailGrid = Ext.getCmp('purchaseOrder-detailGrid');
                    new Ext.erp.ux.itemPicker.Window({
                        targetGrid: detailGrid
                    }).show();
                }
            },

        ]
        this.bbar = [{
            xtype: 'displayfield',
            id: "purchaseOrder-totalSummary",
            style: 'font-weight: bold;font-size:12px;'
        }, ]

        Ext.erp.ux.purchaseOrder.GridDetail.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        Ext.erp.ux.purchaseOrder.GridDetail.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('purchaseOrder-detailGrid', Ext.erp.ux.purchaseOrder.GridDetail);

/* @desc     purchaseOrderOrder form host window
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date     September 2013
* @namespace Ext.erp.ux.purchaseOrderOrder
* @class     Ext.erp.ux.purchaseOrderOrder.Window
* @extends   Ext.Window
*/

Ext.erp.ux.purchaseOrder.Window = function (config) {
    Ext.erp.ux.purchaseOrder.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 900,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'purchaseOrder-window',
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        approve:"",
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.purchaseOrderHeaderId);
                var window = this;
                if (typeof this.purchaseOrderHeaderId != "undefined" && this.purchaseOrderHeaderId != "") {
                    this.form.load({
                        waitMsg: 'Loading...',
                        params: { id: this.purchaseOrderHeaderId },
                        success: function (form,action) {
                            Ext.getCmp('purchaseOrder-detailGrid').getTotalSummary();
                            var grid = Ext.getCmp('purchaseOrder-detailGrid');
                            var purchaseOrderSourceStore = grid.purchaseOrderSourceStore;
                            Ext.getCmp('purchaseOrder-form').onOrderTypeChange();
                            Ext.getCmp('purchaseOrder-form').loadPurchaseModality();
                            if (window.action == 'revision') {

                                form.findField('RevisedPurchaseOrderId').setValue(window.purchaseOrderHeaderId);
                                form.findField('Id').reset();
                                      }
                            var purchaseOrderSourceList = action.result.purchaseOrderSourceList;
                           
                            for (var i = 0; i < purchaseOrderSourceList.length; i++) {
                                var item = purchaseOrderSourceList[i];
                                var p = new Ext.data.Record({
                                    Id: item.Id,
                                    PurchaseOrderHeaderId: item.PurchaseOrderHeaderId,
                                    RequestForQuotationDetailId: item.RequestForQuotationDetailId,
                                    PurchaseRequestDetailId: item.PurchaseRequestDetailId,
                                    VoucherNumber: item.VoucherNumber,
                                    ItemId: item.ItemId,
                                    Code:item.Code,
                                    UnitId: item.UnitId,
                                    MeasurementUnit: item.MeasurementUnit,
                                    Name: item.Name,
                                    QuantityToProcess: item.Quantity,
                                    UnprocessedQuantity:item.UnprocessedQuantity,
                                    Remark: item.Remark,
                                });
                                var count = purchaseOrderSourceStore.getCount();
                                purchaseOrderSourceStore.insert(count, p);
                            };

                        }
                    });
                    var grid = Ext.getCmp('purchaseOrder-detailGrid');
                    var store = grid.getStore();
                    var id = '';
                    var orderType=window.orderType;
                    
                    if (window.action == "revision" && typeof window.reorderSheetHeaderId != "undefined" && window.reorderSheetHeaderId != "" && window.reorderSheetHeaderId != null) {
                        id = window.reorderSheetHeaderId;
                    }
                    else
                        id = this.purchaseOrderHeaderId;
                    store.baseParams = { record: Ext.encode({ voucherHeaderId: id,reorderSheetHeaderId:window.reorderSheetHeaderId, action:window.action,orderType:orderType}) };

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
                    Ext.getCmp('purchaseOrder-form').onOrderTypeChange();
                    if (typeof this.reorderSheetHeaderId != "undefined" && this.reorderSheetHeaderId != "") {
                        {
                            var form = this.form.getForm();
                            form.findField('ReorderSheetHeaderId').setValue(this.reorderSheetHeaderId);
                            form.findField('StoreId').setValue(this.storeId);
                            form.findField('Store').setValue(this.store);
                            form.findField('SupplierId').setValue(this.supplierId);
                            form.findField('Supplier').setValue(this.supplier);
                            form.findField('PurchaseModalityData').setValue(this.purchaseModality);
                            form.findField('Shipment').setValue(this.address+' \n Plate No '+this.plateNo+' \n Driver '+this.driverName);
                            form.findField('TaxRateIds').setValue(this.taxRateIds);
                            form.findField('TaxRateDescription').setValue(this.taxRateDescription);
                            form.findField('TaxRate').setValue(this.taxRate);
                            form.findField('Customer').setValue(this.customer);
                            form.findField('CustomerId').setValue(this.customerId);
                            form.findField('SalesOrderNo').setValue(this.salesOrderNo);
                            form.findField('ReorderNo').setValue(this.reorderSheetNumber);

                            Ext.getCmp('purchaseOrder-form').loadPurchaseModality();

                            var grid = Ext.getCmp('purchaseOrder-detailGrid');
                            var store = grid.getStore();
                            store.baseParams = { record: Ext.encode({ voucherHeaderId: this.reorderSheetHeaderId, action: "reorderSheet" }) };
                            grid.getStore().reload({
                                params: {
                                    start: 0,
                                    limit: grid.pageSize
                                }
                            });
                        }
                          }
                }

            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.ux.purchaseOrder.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.purchaseOrder.Form();
        this.grid = new Ext.erp.ux.purchaseOrder.GridDetail(
            {
                inventoryUnit:this.inventoryUnit 
            });
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
                text: 'Approve',
                iconCls: 'icon-accept',
                scope: this,
                handler: this.onApprove
            }, {
                xtype: 'tbseparator'
            }, {
                text: 'Close',
                iconCls: 'icon-exit',
                handler: this.onCancel,
                scope: this
            }];
        Ext.erp.ux.purchaseOrder.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function (param) {
        if (!this.form.getForm().isValid()) return;
        var grid = Ext.getCmp('purchaseOrder-detailGrid');
        var store = grid.getStore();
        var rec = '', purchaseOrderSourceRec = ''; var errorMesssage = "";
        var purchaseOrderSourceStore = grid.purchaseOrderSourceStore;
        if (typeof param == "undefined" || param == null) param = "";

        var selectedItems = grid.getSelectionModel().getSelections();
        var store = grid.getStore();
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
        store.each(function (item) {
            if (typeof item.get('Quantity') == 'undefined' || item.get('Quantity') < 0) {
                if (errorMesssage == "")
                    errorMesssage = "Quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "           Quantity";
            }
            if (typeof item.get('UnitId') == 'undefined' || item.get('UnitId') == "") {
                if (errorMesssage == "")
                    errorMesssage = "Unit";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Unit";
            } if (typeof item.get('Name') == 'undefined' || item.get('Name') == "") {
                if (errorMesssage == "")
                    errorMesssage = "Name";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Name";
            } if (typeof item.get('UnitCost') == 'undefined' || item.get('UnitCost') == "" || item.get('UnitCost') < 0) {
                if (errorMesssage == "")
                    errorMesssage = "UnitCost";
                else
                    errorMesssage = errorMesssage + "</br>" + "          UnitCost";
            }
            if (errorMesssage != '') {
                Ext.MessageBox.show({
                    title: 'Save failed',
                    msg: "Please Enter Valid values for Item  " + item.data['Name'] + " for feilds " + "</br>" + errorMesssage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
            rec = rec + item.data['Id'] + ':' +

                              item.data['PurchaseOrderHeaderId'] + ':' +
                              item.data['ItemId'] + ':' +
                              item.data['UnitId'] + ':' +
                              item.data['Quantity'] + ':' +
                              item.data['RemainingQuantity'] + ':' +
                              item.data['Name'] + ':' +
                              item.data['UnitCost'] + ':' +
                              item.data['Tax'] + ':' +
                              item.data['Remark'] + ';';
        });
        purchaseOrderSourceStore.each(function (item) {
            purchaseOrderSourceRec = purchaseOrderSourceRec + item.data['Id'] + ':' +
                             item.data['PurchaseOrderHeaderId'] + ':' +
                             item.data['PurchaseRequestDetailId'] + ':' +
                             item.data['RequestForQuotationDetailId'] + ':' +
                             item.data['VoucherNumber'] + ':' +
                             item.data['ItemId'] + ':' +
                             item.data['UnitId'] + ':' +
                             item.data['Name'] + ':' +
                             item.data['QuantityToProcess'] + ':' +
                             item.data['Remark'] + ';';
        });
        if (errorMesssage != "")
            return;

        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
        var window = this;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ purchaseOrderDetails: rec, purchaseOrderSourceDetails: purchaseOrderSourceRec, action: this.action,otherParam:this.approve }) },

            success: function (form, action) {

                Ext.getCmp('purchaseOrder-form').getForm().reset();
                Ext.getCmp('purchaseOrder-detailGrid').getStore().removeAll();
                Ext.getCmp('purchaseOrder-paging').doRefresh();
                Ext.getCmp('purchaseOrder-detailGrid').purchaseOrderSourceStore = new Ext.data.Store();
            
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
    onApprove: function () {
        this.approve = "approve";
        this.onSave('approve');
    },
    onCancel: function () {
        this.close();
    }
});
Ext.reg('purchaseOrder-window', Ext.erp.ux.purchaseOrder.Window);

/**
* @desc      PurchaseOrder grid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.purchaseOrder
* @class     Ext.erp.ux.purchaseOrder.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.purchaseOrder.Grid = function (config) {
    Ext.erp.ux.purchaseOrder.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PurchaseOrder.GetAllHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DESC'
            },
            fields: ['Id', 'VoucherNumber', 'PurchaseRequestNo', 'SalesOrderNo', 'ReorderSheetHeaderId', 'SalesType', 'RequestForQuotationNo', 'PreparedBy', 'OrderedDate', 'IsLastStep', 'RequiredDate', 'SupplierReferenceNo', 'Supplier', 'Consumer', 'StatusId', 'Status', 'OrderedBy', 'Store', 'OrderType'],
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
        id: 'purchaseOrder-grid',
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
                if (record.get("IsLastStep") == true || record.get("Status") == 'Final Approval')
                    return '<img src="Content/images/app/yes.png"/>';
                else
                    return '<img src="Content/images/app/no.png"/>';
            }
        }, {
            dataIndex: 'VoucherNumber',
            header: 'Voucher Number',
            sortable: true,
            width: 100,
            menuDisabled: true
        },  {
            dataIndex: 'PurchaseRequestNo',
            header: 'PR No',
            sortable: true,
            width: 100,
            menuDisabled: true
        },  {
            dataIndex: 'OrderType',
            header: 'Order Type',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'SalesType',
            header: 'Sales Type',
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
            header: 'Supplier Ref No',
            sortable: true,
            hidden:true,
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
            dataIndex: 'PreparedBy',
            header: 'Prepared By',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Status',
            header: 'Status',
            sortable: true,
            width: 100,
            menuDisabled: true
        } ,{
            dataIndex: 'Approval',
            header: 'Approval',
            sortable: true,
            width: 100,
            menuDisabled: true,
            editor: new Ext.form.TriggerField({
                id: 'purchaseOrderApproval',
                onTriggerClick: function (e) {
                    var grid = Ext.getCmp('purchaseOrder-grid');
                    var selectedrecord = grid.getSelectionModel().getSelected();
                    var id = selectedrecord.get('Id');
                    var position = Ext.getCmp('purchaseOrderApproval').getPosition(false);
                    new Ext.erp.ux.voucherApproval.Window({
                        title: 'Approval',
                        transactionId: id,
                        x: position[0]-290,
                        y: position[1] + 21,
                    }).show();
                }
            })
        },]
    }, config));
}
Ext.extend(Ext.erp.ux.purchaseOrder.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [{
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
            disabled: !Ext.erp.ux.Reception.getPermission('Purchase Order', 'CanAdd'),
            handler: this.onAdd
        },{
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Purchase Order', 'CanEdit'),
     
            handler: this.onEdit
        },  {
            xtype: 'button',
            text: 'Void',
            iconCls: 'icon-delete',
            disabled: !Ext.erp.ux.Reception.getPermission('Purchase Order', 'CanDelete'),
            handler: this.onDelete
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Revise',
            iconCls: 'icon-accept',
            handler: this.onRevise,
            disabled: !Ext.erp.ux.Reception.getPermission('Purchase Order', 'CanEdit'),
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Accept',
            iconCls: 'icon-accept',
            handler: this.onAccept,
            disabled: !Ext.erp.ux.Reception.getPermission('Purchase Order', 'CanEdit'),
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'History',
            iconCls: 'icon-preview',
            handler: this.onHistory
        }, {
            xtype: 'button',
            text: 'Preview',
            id: 'preview-PurchaseOrder',
            hidden: false,
            iconCls: 'icon-preview',
            handler: this.onPreview
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'purchaseOrder-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.purchaseOrder.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {

        var grid = Ext.getCmp('purchaseOrder-grid');
        if (!grid.getSelectionModel().hasSelection()) return;


        var voucherId = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        window.open('Reports/ErpReportViewer.aspx?rt=PreviewPurchaseOrder&id=' + voucherId, 'PreviewIV', parameter);


    },
    onAdd: function () {
           new Ext.erp.ux.purchaseOrder.Window({
            title: 'Add Purchase Order',
            action: 'allAtOnce'
        }).show();
    },
    onEdit: function () {
        var grid = Ext.getCmp('purchaseOrder-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var status = grid.getSelectionModel().getSelected().get('Status');
        if (status != "Posted") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "Only Posted transaction are edited, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.erp.ux.purchaseOrder.Window({
            title: 'Edit Purchase Order',
            purchaseOrderHeaderId: id,
            action: 'edit'
        }).show();
    },
    onRevise: function () {
        var grid = Ext.getCmp('purchaseOrder-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var status = grid.getSelectionModel().getSelected().get('Status');

        if (status == "Final Approval") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "You cant edit finally approved Purchase order!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var orderType = grid.getSelectionModel().getSelected().get('OrderType');
        
        var reorderSheetHeaderId = grid.getSelectionModel().getSelected().get('ReorderSheetHeaderId');
        new Ext.erp.ux.purchaseOrder.Window({
            title: 'Revise Purchase Order',
            purchaseOrderHeaderId: id,
            reorderSheetHeaderId:reorderSheetHeaderId,
            action: 'revision'
        }).show();
    },
    onAccept: function () {
        var grid = Ext.getCmp('purchaseOrder-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var status = grid.getSelectionModel().getSelected().get('Status');
        var IsLastStep = grid.getSelectionModel().getSelected().get('IsLastStep');

        if (IsLastStep == false) {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "The trnasaction is not fuly approved yet!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var orderType = grid.getSelectionModel().getSelected().get('OrderType');

        var reorderSheetHeaderId = grid.getSelectionModel().getSelected().get('ReorderSheetHeaderId');
        new Ext.erp.ux.purchaseOrder.Window({
            title: 'accept Purchase Order',
            purchaseOrderHeaderId: id,
            reorderSheetHeaderId: reorderSheetHeaderId,
            action: 'accept'
        }).show();
    },
    onHistory: function () {
        var grid = Ext.getCmp('purchaseOrder-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var voucherNumber = grid.getSelectionModel().getSelected().get('VoucherNumber');
        var status = grid.getSelectionModel().getSelected().get('Status');
        new Ext.erp.ux.purchaseOrderRevision.PanelWindow({
            title: 'Purchase Order History',
            voucherNo: voucherNumber,          
            action: 'history',
        }).show();
    },
    onDelete: function () {
        var grid = Ext.getCmp('purchaseOrder-grid');
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
                    PurchaseOrder.Void(id, function (result) {
                        if (result.success) {
                            Ext.getCmp('purchaseOrder-paging').doRefresh();
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
    onSearchVoucher: function () {
        Ext.erp.ux.voucherSearch.Observable.on('searchvoucher', function (result) {
            result['mode'] = 'search';
            var grid = Ext.getCmp('purchaseOrder-grid');
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.voucherSearch.Window({ title: 'Search PurchaseOrder' }).show();

       

    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.purchaseOrder.Grid.superclass.afterRender.apply(this, arguments);
    },

});
Ext.reg('purchaseOrder-grid', Ext.erp.ux.purchaseOrder.Grid);



/**
* @desc      purchaseOrder panel
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @version   $Id: purchaseOrder.js, 0.1
* @namespace Ext.erp.ux.purchaseOrder
* @class     Ext.erp.ux.purchaseOrder.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.purchaseOrder.Panel = function (config) {
    Ext.erp.ux.purchaseOrder.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.purchaseOrder.Panel, Ext.Panel, {
    initComponent: function () {
        this.headerGrid = new Ext.erp.ux.purchaseOrder.Grid();
   
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'center',
                border: false,
                layout: 'fit',
                items: [this.headerGrid]
            }]
        }];


        Ext.erp.ux.purchaseOrder.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('purchaseOrder-panel', Ext.erp.ux.purchaseOrder.Panel);

