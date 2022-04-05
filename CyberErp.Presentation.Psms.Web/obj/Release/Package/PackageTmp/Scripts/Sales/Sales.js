
Ext.ns('Ext.erp.ux.sales');

/**
* @desc      Sales form

* @copyright (c) 2020, 
* @date      September 2013
* @namespace Ext.erp.ux.sales
* @class     Ext.erp.ux.sales.Form
* @extends   Ext.form.FormPanel
*/

Ext.erp.ux.sales.Form = function (config) {
    Ext.erp.ux.sales.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Sales.Get,
            submit: Sales.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'sales-form',
        frame: true,
        labelWidth: 70,
        padding: 5,
        autoHeight: false,
        border: false,
        vatRate: 0,
        withHoldingRate:0,
        loadDocument: function () {

            Sales.GetDocumentNo(function (result) {

                var form = Ext.getCmp('sales-form').getForm();
                form.findField('VoucherNumber').setValue(result.data.DocNo);
                form.findField('StatusId').setValue(result.data.StatusId);
                form.findField('PreparedById').setValue(result.data.EmployeeId);
                form.findField('SalesPersonId').setValue(result.data.EmployeeId);
                form.findField('SalesPerson').setValue(result.data.Employee);
                form.findField('Date').setValue(new Date());
                form.findField('FiscalYearId').setValue(result.data.FiscalYearId);
                Ext.getCmp('sales-form').vatRate = result.data.VatRate;
                Ext.getCmp('sales-form').withHoldingRate = result.data.WithholdingRate;
           
            });
        },
        loadTax: function () {

            Sales.GetDocumentNo(function (result) {
                Ext.getCmp('sales-form').vatRate = result.data.VatRate;
                Ext.getCmp('sales-form').withHoldingRate = result.data.WithholdingRate;
                Ext.getCmp('sales-form').calculateTotal();

            });
        },
        calculateTotal: function () {

            var grid = Ext.getCmp('sales-detailGrid');
            var form = Ext.getCmp('sales-form').getForm();
            var vatRate=Ext.getCmp('sales-form').vatRate;
            var withHoldingRate=Ext.getCmp('sales-form').withHoldingRate;

            var totalAmount = 0,tax = 0,withholding = 0,netAmount = 0,discountAmount = 0;
   
            var applyWithholding = form.findField('ApplyWithHolding').getValue();
            var discountAmount = form.findField('DiscountAmount').getValue();
            discountAmount=typeof discountAmount=="undefined" || discountAmount==""?0:discountAmount;
            var store = grid.getStore();
            var totalCount = store.getCount();
            var taxableAmount = 0;
            Ext.each(store.getRange(0, totalCount - 1), function (record) {
                if(record.data['IsTaxable']==true)
                taxableAmount = taxableAmount + parseFloat(record.data['Quantity']) * parseFloat(record.data['UnitPrice']);
            else
               totalAmount = totalAmount + parseFloat(record.data['Quantity']) * parseFloat(record.data['UnitPrice']);
             
      
            });
            totalAmount=taxableAmount+totalAmount-discountAmount;
            tax = ((taxableAmount - discountAmount) * (vatRate));
            var taxTotal = this.roundToDecimal(tax);
            var parsedTotalAmount = this.roundToDecimal(totalAmount);
            if (applyWithholding) {
                if (totalAmount > 10000) {
                    withholding = (parsedTotalAmount * withHoldingRate);
                }
            }
            netAmount = parsedTotalAmount + taxTotal - withholding;
            form.findField('TotalAmount').setValue(parsedTotalAmount);
            form.findField('Tax').setValue(taxTotal);
            form.findField('WithHolding').setValue(withholding);

            form.findField('NetPay').setValue(netAmount);
            var totalSummary = " Sub Total:" + (parsedTotalAmount - discountAmount )+ " ; " + (discountAmount > 0 ? " Discount: " + discountAmount + " ; " + " Sub Total:" + parsedTotalAmount + " ; " : "") + "Tax:" + taxTotal + " ; " + (withholding > 0 ? " Withholding: " + withholding + " ; " : "") + " Net:" + netAmount;

            Ext.getCmp('sales-totalSummary').setValue(totalSummary);

            

        },
        roundToDecimal:function round(num) {
            var m = Number((Math.abs(num) * 100).toPrecision(15));
            return Math.round(m) / 100 * Math.sign(num);
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
                    name: 'SubsidiaryAccountId',
                    xtype: 'hidden'
                },   {
                    name: 'FiscalYearId',
                    xtype: 'hidden'
                },{
                    name: 'CustomerId',
                    xtype: 'hidden'
                }, {
                    name: 'CreatedAt',
                    xtype: 'hidden'
                },  {
                    name: 'StatusId',
                    xtype: 'hidden'
                }, {
                    name: 'SalesAreaId',
                    xtype: 'hidden'
                }, {
                    name: 'ProformaHeaderId',
                    xtype: 'hidden'
                }, {
                    name: 'PreparedById',
                    xtype: 'hidden'
                }, {
                    name: 'SalesPersonId',
                    xtype: 'hidden'
                },{
                    name: 'SalesTypeId',
                    xtype: 'hidden'
                }, {
                    name: 'StoreId',
                    xtype: 'hidden'
                }, {
                    name: 'PriceCategoryId',
                    xtype: 'hidden'
                },  {
                    name: 'VoucherNumber',
                    xtype: 'textfield',
                    fieldLabel: 'Voucher No',
                    readOnly: true,
                    allowBlank: false
                }, {
                    name: 'ReferenceNo',
                    xtype: 'textfield',
                    fieldLabel: 'Reference No',
                    readOnly: true,
                    hidden:true,
                    value:'',
                    allowBlank: true
                }, {
                    hiddenName: 'SalesType',
                    xtype: 'combo',
                    fieldLabel: 'Sales Type',
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
                        api: { read: Psms.GetSalesType }
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('sales-form').getForm();
                            form.findField("SalesTypeId").setValue(rec.id);
                        },
                    }
                }, {
                    hiddenName: 'ProformaNumber',
                    xtype: 'combo',
                    fieldLabel: 'Proforma Number',
                    typeAhead: false,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    emptyText: '---Type to Search---',
                    mode: 'remote',
                    allowBlank: true,
                 
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> {Code}</div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name', 'PriceCategoryRemark', 'SalesAreaId', 'SalesArea', 'StoreId', 'ApplyWithHolding', 'Address', 'PriceCategoryId', 'CustomerId', 'Customer', 'PriceCategory', 'Comment']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetProformaBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10, listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('sales-form').getForm();
                            form.findField('ProformaHeaderId').setValue(rec.id);
                            form.findField('SalesAreaId').setValue(rec.get('SalesAreaId'));
                            form.findField('SalesArea').setValue(rec.get('SalesArea'));
                            form.findField('StoreId').setValue(rec.get('StoreId'));
                            form.findField('CustomerId').setValue(rec.get('CustomerId'));
                            form.findField('Customer').setValue(rec.get('Customer'));
                            form.findField('PriceCategoryId').setValue(rec.get('PriceCategoryId'));
                            form.findField('PriceCategory').setValue(rec.get('PriceCategory'));
                            form.findField("ApplyWithHolding").setValue(rec.get('ApplyWithHolding'));

                         
                            var grid = Ext.getCmp('sales-detailGrid');
                            var store = grid.getStore();
                            store.baseParams = { record: Ext.encode({ voucherHeaderId: rec.id,storeId:rec.get('StoreId'), action: "proforma" }) };
                            grid.getStore().reload({
                                params: {
                                    start: 0,
                                    limit: grid.pageSize
                                }
                            });
                        },
                        change: function (cmb, newvalue, oldvalue) {
                        }
                    }
                },  {
                    name: 'Date',
                    xtype: 'datefield',
                    fieldLabel: 'Date',
                    width: 100,
                    allowBlank: false,
                    value: new Date(),
                    maxValue: (new Date()).format('m/d/Y')
                }, {
                    hiddenName: 'SalesPerson',
                    xtype: 'combo',
                    fieldLabel: 'Sales Person',
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
                        api: { read: Psms.GetEmployeeBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10, listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('sales-form').getForm();
                            form.findField('SalesPersonId').setValue(rec.id);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('sales-form').getForm();
                                form.findField('SalesPersonId').reset();

                            }
                        }
                    }
                } ]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [
                   {
                       hiddenName: 'SalesArea',
                       xtype: 'combo',
                       fieldLabel: 'Sales Area',
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
                               fields: ['Id', 'Name', 'StoreId', 'PriceCategoryId', 'PriceCategory', , 'Remark']
                           }),
                           autoLoad: true,
                           api: { read: Psms.GetSalesArea }
                       }),
                       valueField: 'Id',
                       displayField: 'Name',
                       listeners: {
                           select: function (cmb, rec, idx) {
                               var form = Ext.getCmp('sales-form').getForm();
                               form.findField("SalesAreaId").setValue(rec.id);
                               form.findField("StoreId").setValue(rec.data['StoreId']);
                               form.findField("PriceCategoryId").setValue(rec.data['PriceCategoryId']);
                               form.findField("PriceCategory").setValue(rec.data['PriceCategory']);

                           },
                       }
                   }, {
                       xtype: 'compositefield',
                       fieldLabel: 'Customer',
                       defaults: {
                           flex: 1
                       },
                       items: [{
                           hiddenName: 'Customer',
                           xtype: 'combo',
                           fieldLabel: 'Customer',
                           typeAhead: false,
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
                                   root: 'data',
                                   fields: ['Id', 'Name', 'Code', 'PriceCategoryId', 'PriceCategory', 'PaymentTerm', 'Address', 'DeliveryTerm']
                               }),
                               autoLoad: true,
                               api: { read: Psms.GetCustomerBySearch }
                           }),
                           valueField: 'Name',
                           displayField: 'Name',
                           pageSize: 10, listeners: {
                               select: function (cmb, rec, idx) {
                                   var form = Ext.getCmp('sales-form').getForm();
                                   form.findField('CustomerId').setValue(rec.id);
                                   form.findField("PriceCategoryId").setValue(rec.data['PriceCategoryId']);
                                   form.findField("PriceCategory").setValue(rec.data['PriceCategory']);

                               },
                               change: function (cmb, newvalue, oldvalue) {
                                   if (newvalue == "") {
                                       var form = Ext.getCmp('sales-form').getForm();
                                       form.findField('CustomerId').reset();
                                       form.findField("PriceCategoryId").reset();
                                       form.findField("PriceCategory").reset();

                                   }
                               }
                           }
                       },
                       {
                           xtype: 'button',
                           width: 30,
                           id: 'new-Customer',
                           iconCls: 'icon-add',
                           handler: function () {
                               var form = Ext.getCmp('sales-form').getForm();
                               new Ext.erp.ux.customer.Window({
                                   targetForm: form,
                                   customerId: '0',
                               }).show();

                           }
                       }
                       ]
                   }, {
                       hiddenName: 'PriceCategory',
                       xtype: 'combo',
                       fieldLabel: 'Price Category',
                       triggerAction: 'all',
                       mode: 'remote',
                       editable: false,
                       forceSelection: true,
                       emptyText: '---Select---',
                       allowBlank: true,
                       store: new Ext.data.DirectStore({
                           reader: new Ext.data.JsonReader({
                               successProperty: 'success',
                               idProperty: 'Id',
                               root: 'data',
                               fields: ['Id', 'Name', 'Remark']
                           }),
                           autoLoad: true,
                           api: { read: Psms.GetPriceCategory }
                       }),
                       valueField: 'Id',
                       displayField: 'Name',
                       listeners: {
                           select: function (cmb, rec, idx) {
                               var form = Ext.getCmp('sales-form').getForm();
                               form.findField("PriceCategoryId").setValue(rec.id);
                           },
                       }
                   }, {
                        name: 'ApplyWithHolding',
                        checked: true,
                        xtype: 'checkbox',
                        fieldLabel: 'Apply Withholding?',
                        width: 100,
                        readOnly: false,
                        allowBlank: true,
                        checked: false,
                        listeners: {
                            check: function (cmb, rec, idx) {
                                Ext.getCmp('sales-form').calculateTotal();
                            },
                        }
                    },
                     {
                         name: 'FsNo',
                         xtype: 'textfield',
                         fieldLabel: 'FsNo',
                         readOnly: false,
                         allowBlank: true
                     },
                ]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [
                    {
                        hiddenName: 'PaymentMethod',
                        xtype: 'combo',
                        fieldLabel: 'Payment Method',
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
                                ['Check', 'Check'],
                                ['Enquiry', 'Enquiry'],
                                ['Other', 'Other']

                            ]
                        }),
                        valueField: 'Id',
                        displayField: 'Name',
                    }, {
                        name: 'CheckNo',
                        xtype: 'textfield',
                        fieldLabel: 'Payment Ref. No',
                        width: 100,
                        hidden: false,
                        allowBlank: true,
                        readOnly: false
                    }, {
                        name: 'TotalAmount',
                        xtype: 'numberfield',
                        fieldLabel: 'Amount',
                        readOnly: true,
                        hidden:true,
                        allowBlank: true
                    }, {
                        name: 'Tax',
                        xtype: 'numberfield',
                        fieldLabel: 'Tax',
                        hidden: true,
                        readOnly: true,
                        allowBlank: true
                    }, {
                        name: 'WithHolding',
                        xtype: 'numberfield',
                        fieldLabel: 'WithHolding',
                        hidden: true,
                        readOnly: true,
                        allowBlank: true
                    }, {
                        name: 'DiscountAmount',
                        xtype: 'numberfield',
                        fieldLabel: 'Discount',
                        readOnly: false,
                        allowBlank: true
                    }, {
                        name: 'NetPay',
                        xtype: 'numberfield',
                        fieldLabel: 'Net Pay',
                        hidden: true,
                        readOnly: true,
                        allowBlank: true
                    }, {
                        name: 'Remark',
                        xtype: 'textarea',
                        fieldLabel: 'Remark',
                        width: 100,
                        height: 60,
                        hidden: false,
                        allowBlank: true,
                        readOnly: false
                    }, ]
            }]
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.sales.Form, Ext.form.FormPanel);
Ext.reg('sales-form', Ext.erp.ux.sales.Form);



/**
* @desc      Sales detailGrid

* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.sales
* @class     Ext.erp.ux.sales.GridDetail
* @extends   Ext.grid.GridPanel
*/
var salesSelectionModel = new Ext.grid.RowSelectionModel({
});
Ext.erp.ux.sales.GridDetail = function (config) {
    Ext.erp.ux.sales.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Sales.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'SalesSalesHeaderId', 'IsSerialItem', 'IsLOTItem', 'ItemId', 'IsTaxable', 'UnitId', 'MeasurementUnit', 'PriceGroupId', 'PriceGroup', 'UnitCost', 'UnitPrice', 'Tax', 'Name', 'Code', 'Quantity', 'RemainingQuantity', 'Remark'],

            remoteSort: true,
            listeners: {
                load: function () {
                    Ext.getCmp('sales-form').calculateTotal();
                },
            }
        }),
        id: 'sales-detailGrid',
        clicksToEdit: 1,
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: true,
        height: 250,
        serialStore: new Ext.data.Store(),
        lOTStore: new Ext.data.Store(),
       
        viewConfig: {
            forceFit: true
        },
        listeners: {
            beforeLoad: function () {
                Ext.getCmp('sales-detailGrid').body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
                Ext.getCmp('sales-detailGrid').body.unmask();
            },
            loadException: function () {
                Ext.getCmp('sales-detailGrid').body.unmask();
            },
            afteredit: function (e) {
                var record = e.record;
                if (e.field == 'Quantity')
                {
                    var form = Ext.getCmp('sales-form').getForm();
                    var priceCategoryId = form.findField('PriceCategoryId').getValue();
                    var detailGrid = Ext.getCmp('sales-detailGrid');
                    var selectedrecord = detailGrid.getSelectionModel().getSelected();
                    var priceGroupId = record.get("PriceGroupId");
                    var itemId = selectedrecord.get("ItemId");
                    var quantity = record.get("Quantity");
                }
                if (record.get('UnitPrice') > 0 ||  e.field == 'Quantity' || e.field == 'UnitPrice') {
                    Ext.getCmp('sales-form').calculateTotal();
                }
            }
        },
        sm: Ext.erp.ux.common.SelectionModel,
        cm: new Ext.grid.ColumnModel({
            columns: [
                new Ext.grid.RowNumberer(),
                {
                    dataIndex: 'Name',
                    header: 'Name',
                    sortable: true,
                    width: 140,
                    menuDisabled: true,
                    xtype: 'combocolumn',
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
                                fields: ['Id', 'Name', 'Code', 'IsTaxable', 'IsSerialItem', 'IsLOTItem', 'UnitId', 'MeasurementUnit', 'UnitPrice', 'PriceGroup', 'PriceGroupId']
                            }),
                            api: { read: Psms.GetSalesItemBySearch }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                       
                        listeners: {
                            beforeQuery: function (combo, record, index) {
                                var form = Ext.getCmp('sales-form').getForm();
                                var priceCategoryId = form.findField('PriceCategoryId').getValue();
                                var detailDrid = Ext.getCmp('sales-detailGrid');
                                var selectedrecord = detailDrid.currentRecord;
                                this.store.baseParams = { priceCategoryId: priceCategoryId };
                                this.getStore().reload({
                                    params: {
                                        start: 0,
                                        limit: this.pageSize
                                    }
                                });

                            },

                            select: function (combo, record, index) {
                                var detailDrid = Ext.getCmp('sales-detailGrid');
                                var selectedrecord = detailDrid.getSelectionModel().getSelected();
                                selectedrecord.set('ItemId', record.get("Id"));
                                selectedrecord.set('UnitId', record.get("UnitId"));
                                selectedrecord.set('Code', record.get("Code"));
                                selectedrecord.set('IsSerialItem', record.get("IsSerialItem"));
                                selectedrecord.set('IsLOTItem', record.get("IsLOTItem"));
                                selectedrecord.set('IsTaxable', record.get("IsTaxable"));
                                selectedrecord.set('MeasurementUnit', record.get("MeasurementUnit"));
                                selectedrecord.set('PriceGroupId', record.get("PriceGroupId"));
                                selectedrecord.set('PriceGroup', record.get("PriceGroup"));
                                selectedrecord.set('UnitPrice', record.get("UnitPrice"));

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

                                var detailGrid = Ext.getCmp('sales-detailGrid');
                                var selectedrecord = detailGrid.getSelectionModel().getSelected();
                                selectedrecord.set('UnitId', record.get("Id"));
                            }
                        }
                    })
                }, {
                    dataIndex: 'PriceGroup',
                    header: 'Price Group',
                    sortable: true,
                    width: 100,
                    menuDisabled: true,
                    editor: new Ext.form.ComboBox({
                        hiddenName: 'PriceGroup',
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
                            api: { read: Psms.GetPriceGroup }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        listeners: {

                            select: function (combo, record, index) {
                                var form = Ext.getCmp('sales-form').getForm();
                                var priceCategoryId = form.findField('PriceCategoryId').getValue();
                                var detailGrid = Ext.getCmp('sales-detailGrid');
                                var selectedrecord = detailGrid.getSelectionModel().getSelected();
                                selectedrecord.set('PriceGroupId', record.get("Id"));
                                var priceGroupId = record.get("Id");
                                var itemId = selectedrecord.get("ItemId");
                            }
                        }
                    })
                }, {
                    dataIndex: 'IsTaxable',
                    header: 'IsTaxable',
                    sortable: true,
                    width: 100,
                    menuDisabled: true,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                        if (value == true)
                            return '<img src="Content/images/app/yes.png"/>';
                        else
                            return '<img src="Content/images/app/no.png"/>';
                    },
                    editor: {
                        xtype: 'checkbox',
                        allowBlank: false
                    }
                }, {
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
                }, {
                    dataIndex: 'UnitPrice',
                    header: 'Unit Price',
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
                },
                ]
        })
    }, config));
}
Ext.extend(Ext.erp.ux.sales.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };

        this.tbar = [
            {
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: false,
                handler: function () {
                    var detailDrid = Ext.getCmp('sales-detailGrid');
                    var store = detailDrid.getStore();

                    var defaultData = {
                        Remark:'',
                        Quantity: 0,
                        Tax: 0,
                        UnitPrice:0,
                        Quantity: 0,
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
                    var grid = Ext.getCmp('sales-detailGrid');

                    if (!grid.getSelectionModel().hasSelection())
                        return;

                    var selectedrecord = grid.getSelectionModel().getSelected();
                    grid.getStore().remove(selectedrecord);
                }
            },{
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Add Serial/LOT',
                iconCls: 'icon-add',
                handler: this.onSerialLOtClick
            } , '->',
             {
                 xtype: 'button',
                 text: 'Picker',
                 iconCls: 'icon-accept',
                 disabled: false,
                 handler: function () {
                     var detailGrid = Ext.getCmp('sales-detailGrid');
                     var form = Ext.getCmp('sales-form').getForm();
                     var priceCategoryId=form.findField('PriceCategoryId').getValue();

                     new Ext.erp.ux.salesItemPicker.Window({
                         targetGrid: detailGrid,
                         priceCategoryId: priceCategoryId
                     }).show();
                 }
             },
            

        ]
        this.bbar = [{
            xtype: 'displayfield',
            id: "sales-totalSummary",
            style: 'font-weight: bold;font-size:12px;'
        }, ]

        Ext.erp.ux.sales.GridDetail.superclass.initComponent.apply(this, arguments);
    },
   
    afterRender: function () {

        Ext.erp.ux.sales.GridDetail.superclass.afterRender.apply(this, arguments);
    },
    onSerialLOtClick: function () {

        var detailDrid = Ext.getCmp('sales-detailGrid');
        var currentRecord = detailDrid.getSelectionModel().getSelected();
        var storeId = Ext.getCmp('sales-form').getForm().findField("StoreId").getValue();
        var itemId = currentRecord.get("ItemId");
        var issuedQuantity = currentRecord.get("Quantity");
        if (issuedQuantity <= 0) {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "Sales Quantity must be greater than 0",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;

        }
        if (currentRecord.get("IsSerialItem")) {
            new Ext.erp.ux.itemSerialSelector.Window({
                title: 'Add Item Serials',
                itemStore: detailDrid.serialStore.query("ItemId", itemId),
                targetGrid: detailDrid,
                storeId: storeId,
                itemId: itemId,
                issuedQuantity: issuedQuantity
            }).show();
        }
        else if (currentRecord.get("IsLOTItem")) {
            new Ext.erp.ux.itemLOTSelector.Window({
                title: 'Add Item LOT',
                itemStore: detailDrid.lOTStore.query("ItemId", itemId),
                targetGrid: detailDrid,
                storeId: storeId,
                itemId: itemId,
                issuedQuantity: issuedQuantity
            }).show();
        }
    },
});
Ext.reg('sales-detailGrid', Ext.erp.ux.sales.GridDetail);

/* @desc     salesOrder form host window

* @copyright (c) 2020, 
* @date     September 2013
* @namespace Ext.erp.ux.salesOrder
* @class     Ext.erp.ux.salesOrder.Window
* @extends   Ext.Window
*/

Ext.erp.ux.sales.Window = function (config) {
    Ext.erp.ux.sales.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 800,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'sales-window',
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        errorMesssage:'',
        bodyStyle: 'padding:5px;',
   
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.SalesSalesHeaderId);
                var window = Ext.getCmp('sales-window');
                Ext.getCmp('sales-detailGrid').lOTStore.removeAll();
                Ext.getCmp('sales-detailGrid').serialStore.removeAll();
                if (typeof this.SalesSalesHeaderId != "undefined" && this.SalesSalesHeaderId != "") {
                    this.form.load({
                        waitMsg: 'Loading...',
                        params: { id: this.SalesSalesHeaderId },
                        success: function (form, action) {
                            var form = Ext.getCmp('sales-form');
                            var grid = Ext.getCmp('sales-detailGrid');
                                form.loadTax();
                                var serilList = action.result.serialList;
                                var lOTList = action.result.lotList;
                                Ext.getCmp('sales-window').onLoadLOTSerial(serilList, lOTList);

                          

                        }
                    });
                   
                    var grid = Ext.getCmp('sales-detailGrid');
                    var store = grid.getStore();
                    store.baseParams = { record: Ext.encode({ voucherHeaderId: this.SalesSalesHeaderId, storeId:this.storeId, action: "storeSales" }) };

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
                }

            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.ux.sales.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.sales.Form();
        this.grid = new Ext.erp.ux.sales.GridDetail();
        this.items = [this.form, this.grid];
        this.buttons = [
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
        this.bbar = [{
            xtype: 'displayfield',
            id: "sales-totalSummary",
            style: 'font-weight: bold;font-size:12px;'
        }, ]
        Ext.erp.ux.sales.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var grid = Ext.getCmp('sales-detailGrid');
        var store = grid.getStore();
        var rec = '', serialRec = '', lotRec = '';
        var serialStore = grid.serialStore;
        var lOTStore = grid.lOTStore;
        this.errorMesssage = "";
        var store = grid.getStore();
         var form = Ext.getCmp('sales-form').getForm();
        if (store.getCount() < 1) {
            Ext.MessageBox.show({
                title: 'Save failed',
                msg: "Please Add detail items",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        rec = this.parseDetailData(store, serialStore, lOTStore);
        serialStore.each(function (item) {
            serialRec = serialRec + item.data['Id'] + ':' +
                             item.data['ItemId'] + ':' +
                             item.data['StoreId'] + ':' +
                             item.data['ItemSerialId'] + ';';

        });
        lOTStore.each(function (item) {
            lotRec = lotRec + item.data['Id'] + ':' +
                             item.data['ItemId'] + ':' +
                             item.data['StoreId'] + ':' +
                             item.data['ItemLOTId'] + ':' +
                             item.data['Quantity'] + ';';

        });
         if (this.errorMesssage != "")
            return;     
         this.submitForm(rec, serialRec, lotRec);

    },
    parseDetailData: function (store, serialStore, lOTStore) {
        var rec = '';
        store.each(function (item) {
            Ext.getCmp('sales-window').errorMesssage = Ext.getCmp('sales-window').validateDetailData(item, serialStore,lOTStore);
            if (Ext.getCmp('sales-window').errorMesssage != '') {
                Ext.MessageBox.show({
                    title: 'Save failed',
                    msg: "Please Enter Valid values for Item  " + item.data['Name'] + " for feilds " + "</br>" + Ext.getCmp('sales-window').errorMesssage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
            rec = rec + item.data['Id'] + ':' +

                item.data['SalesSalesHeaderId'] + ':' +
                item.data['ItemId'] + ':' +
                item.data['Quantity'] + ':' +
                item.data['RemainingQuantity'] + ':' +
                item.data['UnitId'] + ':' +
                item.data['UnitPrice'] + ':' +
                item.data['PriceGroupId'] + ':' +
            item.data['IsTaxable'] + ';';
        });
        return rec;
    },
    validateDetailData: function (item, serialStore, lOTStore) {
        var errorMesssage = '';
        var form = Ext.getCmp('sales-form').getForm();
        var grid = Ext.getCmp('sales-detailGrid');

        
        if (typeof item.get('Quantity') == 'undefined' || item.get('Quantity') < 0) {
            if (errorMesssage == "")
                errorMesssage = "Sold Quantity";
            else
                errorMesssage = errorMesssage + "</br>" + "           Sold Quantity";
        }
       
        if ( item.get('UnitPrice') < 1) {
            if (errorMesssage == "")
                errorMesssage = "Unit Price";
            else
                errorMesssage = errorMesssage + "</br>" + "          Unit Price";
        }
        if (typeof item.get('UnitId') == 'undefined' || item.get('UnitId') == "") {
            if (errorMesssage == "")
                errorMesssage = "Unit ";
            else
                errorMesssage = errorMesssage + "</br>" + "          Unit";
        }
        if (typeof item.get('PriceGroupId') == 'undefined' || item.get('PriceGroupId') == "") {
            if (errorMesssage == "")
                errorMesssage = "Price Group ";
            else
                errorMesssage = errorMesssage + "</br>" + "          Price Group";
        }
        if (item.get('IsSerialItem') && item.get('Quantity') != serialStore.query("ItemId", item.get('ItemId')).length) {
            if (errorMesssage == "")
                errorMesssage = "Total quantity should be equal to number of serials added";
            else
                errorMesssage = errorMesssage + "</br>" + "          Total issued quantity should be equal to number of serials added";

        }
        if (item.get('IsLOTItem')) {

            var lotList = lOTStore.query("ItemId", item.get('ItemId'));
            var totlLotQuantity = 0;
            lotList.each(function (item) {
                totlLotQuantity = totlLotQuantity + item.get('Quantity');

            });

            if (item.get('Quantity') != totlLotQuantity)
                if (errorMesssage == "")
                    errorMesssage = "Total quantity should be equal to total added LOT quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Total quantity should be equal to total added LOT quantity";

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
            params: { record: Ext.encode({ salesDetails: rec, action: this.action, itemSerials: serialRec, itemLOTs: lotRec, }) },

            success: function (form, action) {

                Ext.getCmp('sales-form').getForm().reset();
                Ext.getCmp('sales-detailGrid').getStore().removeAll();
                Ext.getCmp('sales-paging').doRefresh();

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
    onLoadLOTSerial: function (serilList, lOTList) {

        var grid = Ext.getCmp('sales-detailGrid');
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
                    StoreId: item.StoreId,
                    ItemLOTId: item.ItemLOTId,
                    Number: item.Number,
                    Quantity: item.Quantity,
                    AvailableQuantity: item.AvailableQuantity,
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
Ext.reg('sales-window', Ext.erp.ux.sales.Window);

/**
* @desc      Sales grid

* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.sales
* @class     Ext.erp.ux.sales.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.sales.Grid = function (config) {
    Ext.erp.ux.sales.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Sales.GetAllHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DSC'
            },
            fields: ['Id', 'VoucherNumber', 'ProformaNumber', 'SalesType', 'ReferenceNo', 'FsNo', 'IsLastStep', 'Date', 'Customer', 'StatusId', 'Status', 'SalesPerson', 'Driver', 'SalesType', 'SalesArea', 'StoreId'],
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
        id: 'sales-grid',
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
             //   this.onEdit();
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
                if (record.get("IsLastStep") == true || record.get("Status")=="Issued")
                    return '<img src="Content/images/app/yes.png"/>';
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
            dataIndex: 'SalesType',
            header: 'Sales Type',
            sortable: true,
            width: 100,

            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'FsNo',
            header: 'Fs No',
            sortable: true,
            width: 100,

            menuDisabled: true,
            renderer: this.customRenderer,

        },  {
            dataIndex: 'SalesArea',
            header: 'Sales Area',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'Customer',
            header: 'Customer',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'Date',
            header: 'Date',
            sortable: true,
            width: 80,
            menuDisabled: true,
            renderer: this.customRenderer,

        },  {
            dataIndex: 'SalesPerson',
            header: 'Sales Person',
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

        },{
            dataIndex: 'Approval',
            header: 'Approval',
            sortable: true,
            width: 100,
            menuDisabled: true,
            editor: new Ext.form.TriggerField({
                id: 'salesApproval',
                onTriggerClick: function (e) {
                    var grid = Ext.getCmp('sales-grid');
                    var selectedrecord = grid.getSelectionModel().getSelected();
                    var id = selectedrecord.get('Id');
                    var position = Ext.getCmp('salesApproval').getPosition(false);
                    new Ext.erp.ux.voucherApproval.Window({
                        title: 'Approval',
                        transactionId: id,
                        x: position[0] - 290,
                        y: position[1] + 21,
                    }).show();
                }
            })
        }, ]
    }, config));
}
Ext.extend(Ext.erp.ux.sales.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [{
            id: 'searchSales',
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearchVoucher
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Sales Order', 'CanAdd'),
            handler: this.onAdd
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Sales Order', 'CanEdit'),
     
            handler: this.onEdit
        },  {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Void',
            iconCls: 'icon-delete',
            disabled: !Ext.erp.ux.Reception.getPermission('Sales Order', 'CanDelete'),
            handler: this.onDelete
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Issue',
            iconCls: 'icon-accept',
            disabled: !Ext.erp.ux.Reception.getPermission('Sales Order', 'CanEdit'),
            handler: this.onIssue
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Invoice',
            iconCls: 'icon-accept',
            disabled: !Ext.erp.ux.Reception.getPermission('Sales Order', 'CanEdit'),
            handler: this.onInvoice
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Revise',
            iconCls: 'icon-accept',
            disabled: !Ext.erp.ux.Reception.getPermission('Sales Order', 'CanEdit'),
            handler: this.onRevise
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Preview',
            id: 'preview-Sales',
            hidden: false,
            iconCls: 'icon-preview',
            handler: this.onPreview
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'sales-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.sales.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {

        var grid = Ext.getCmp('sales-grid');
        if (!grid.getSelectionModel().hasSelection()) return;


        var voucherId = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        window.open('Reports/ErpReportViewer.aspx?rt=PreviewSales&id=' + voucherId, 'PreviewIV', parameter);


    },
    onAdd: function () {
           new Ext.erp.ux.sales.Window({
               title: 'Add Sales Order',
            action: 'add'
        }).show();
    },
    onEdit: function () {
        var grid = Ext.getCmp('sales-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var status = grid.getSelectionModel().getSelected().get('Status');
        var storeId = grid.getSelectionModel().getSelected().get('StoreId');

       if (status != "Posted") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "Only posted transaction are edited, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.erp.ux.sales.Window({
            title: 'Edit Sales Order',
            SalesSalesHeaderId: id,
            storeId:storeId,
            action: 'edit'
        }).show();
    },
    onRevise: function () {
        var grid = Ext.getCmp('sales-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var status = grid.getSelectionModel().getSelected().get('Status');
        var storeId = grid.getSelectionModel().getSelected().get('StoreId');

        if (status == "Issued") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: " issued transaction  can not be revised, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.ux.sales.Window({
            title: 'Revise Sales Order',
            SalesSalesHeaderId: id,
            storeId: storeId,
            action: 'revise'
        }).show();
    },
    onIssue: function () {
        var grid = Ext.getCmp('sales-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var status = grid.getSelectionModel().getSelected().get('Status');
        var storeId = grid.getSelectionModel().getSelected().get('StoreId');
        var isLastStep = grid.getSelectionModel().getSelected().get('IsLastStep');
       
        if (isLastStep == false || status == "Issued") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "please authorization step is remain or already issued, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }

        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.ux.sales.Window({
            title: 'Sales Order',
            SalesSalesHeaderId: id,
            storeId: storeId,
            action: 'issue'
        }).show();
    },
    onInvoice: function () {
        var grid = Ext.getCmp('sales-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var status = grid.getSelectionModel().getSelected().get('Status');
        var storeId = grid.getSelectionModel().getSelected().get('StoreId');
        var isLastStep = grid.getSelectionModel().getSelected().get('IsLastStep');

        if (isLastStep == false || status == "Issued") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "please authorization step is remain or already invoice, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }

        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.ux.sales.Window({
            title: 'Sales Order',
            SalesSalesHeaderId: id,
            storeId: storeId,
            action: 'invoice'
        }).show();
    },
    onDelete: function () {
        var grid = Ext.getCmp('sales-grid');
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
                    Sales.Void(id, function (result) {
                        if (result.success) {
                            Ext.getCmp('sales-paging').doRefresh();
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
            var grid = Ext.getCmp('sales-grid');
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.voucherSearch.Window({ title: 'Search Transactions' }).show();
    },
    customRenderer: function (value, metaData, record, rowIndex, colIndex, store) {

        if (record.get("IsLastStep") == true)
            return '<span style=color:green>' + value + '</span>';
        else if (record.get("Status") == "Void")
            return '<span style=color:red>' + value + '</span>';
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
        Ext.erp.ux.sales.Grid.superclass.afterRender.apply(this, arguments);
    },

});
Ext.reg('sales-grid', Ext.erp.ux.sales.Grid);



/**
* @desc      sales panel

* @copyright (c) 2010, 
* @date      September 2013
* @version   $Id: sales.js, 0.1
* @namespace Ext.erp.ux.sales
* @class     Ext.erp.ux.sales.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.sales.Panel = function (config) {
    Ext.erp.ux.sales.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.sales.Panel, Ext.Panel, {
    initComponent: function () {
        this.headerGrid = new Ext.erp.ux.sales.Grid();
   
        this.items = [this.headerGrid];

        Ext.erp.ux.sales.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('sales-panel', Ext.erp.ux.sales.Panel);
