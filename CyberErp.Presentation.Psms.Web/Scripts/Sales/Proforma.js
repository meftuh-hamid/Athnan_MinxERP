
Ext.ns('Ext.erp.ux.proforma');

/**
* @desc      Proforma form

* @copyright (c) 2020, 
* @date      September 2013
* @namespace Ext.erp.ux.proforma
* @class     Ext.erp.ux.proforma.Form
* @extends   Ext.form.FormPanel
*/

Ext.erp.ux.proforma.Form = function (config) {
    Ext.erp.ux.proforma.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Proforma.Get,
            submit: Proforma.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'proforma-form',
        frame: true,
        labelWidth: 70,
        padding: 5,
        autoHeight: false,
        border: false,
        vatRate: 0,
        withHoldingRate:0,
        loadDocument: function () {

            Proforma.GetDocumentNo(function (result) {

                var form = Ext.getCmp('proforma-form').getForm();
                form.findField('VoucherNumber').setValue(result.data.DocNo);
                form.findField('StatusId').setValue(result.data.StatusId);
                form.findField('PreparedById').setValue(result.data.EmployeeId);
                form.findField('SalesPersonId').setValue(result.data.EmployeeId);
                form.findField('SalesPerson').setValue(result.data.Employee);

                form.findField('Date').setValue(new Date());
                form.findField('FiscalYearId').setValue(result.data.FiscalYearId);
                Ext.getCmp('proforma-form').vatRate = result.data.VatRate;
                Ext.getCmp('proforma-form').withHoldingRate = result.data.WithholdingRate;
    
            });
        },
        loadTax: function () {

            Proforma.GetDocumentNo(function (result) {
                Ext.getCmp('proforma-form').vatRate = result.data.VatRate;
                Ext.getCmp('proforma-form').withHoldingRate = result.data.WithholdingRate;
                Ext.getCmp('proforma-form').calculateTotal();

            });
        },
        calculateTotal: function () {

            var grid = Ext.getCmp('proforma-detailGrid');
            var form = Ext.getCmp('proforma-form').getForm();
            var vatRate = Ext.getCmp('proforma-form').vatRate;
            var withHoldingRate = Ext.getCmp('proforma-form').withHoldingRate;
            var withholdableTotal = 0;

            var totalAmount = 0, tax = 0, withholding = 0, netAmount = 0, discountAmount = 0;

            var applyWithholding = form.findField('ApplyWithHolding').getValue();
            var discountAmount = form.findField('DiscountAmount').getValue();
            discountAmount = typeof discountAmount == "undefined" || discountAmount == "" ? 0 : discountAmount;
            var store = grid.getStore();
            var totalCount = store.getCount();
            var taxableAmount = 0;
            Ext.each(store.getRange(0, totalCount - 1), function (record) {
                if (record.data['IsTaxable'] == true)
                    taxableAmount = taxableAmount + parseFloat(record.data['Quantity']) * parseFloat(record.data['UnitPrice']);
                else
                    totalAmount = totalAmount + parseFloat(record.data['Quantity']) * parseFloat(record.data['UnitPrice']);
                withholdableTotal = withholdableTotal + parseFloat(record.data['Quantity']) * parseFloat(record.data['WithHoldingTax'])

            });
            totalAmount = taxableAmount + totalAmount - discountAmount;
            tax = ((taxableAmount - discountAmount) * (vatRate));
            var taxTotal = this.roundToDecimal(tax);
            var parsedTotalAmount = this.roundToDecimal(totalAmount);
            if (applyWithholding) {
                var parsedwithholdableTotal = this.roundToDecimal(withholdableTotal);

                if (parsedwithholdableTotal > 10000) {
                    withholding = (parsedwithholdableTotal * withHoldingRate);
                }
            }
            netAmount = parsedTotalAmount + taxTotal - withholding;
            form.findField('TaxableAmount').setValue(parsedTotalAmount);
            form.findField('Tax').setValue(taxTotal);
            form.findField('WithHolding').setValue(withholding);

            form.findField('NetPay').setValue(netAmount);
            var totalSummary = " Sub Total:" + (totalAmount + discountAmount) + " ; " + (discountAmount > 0 ? " Discount: " + discountAmount + " ; " + " Sub Total:" + parsedTotalAmount + " ; " : "") + "Tax:" + taxTotal + " ; " + (withholding > 0 ? " Withholding: " + withholding + " ; " : "") + " Net:" + netAmount;

            Ext.getCmp('proforma-totalSummary').setValue(totalSummary);



        },
        roundToDecimal: function round(num) {
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
                    name: 'FiscalYearId',
                    xtype: 'hidden'
                },  {
                    name: 'CustomerId',
                    xtype: 'hidden'
                }, {
                    name: 'CreatedAt',
                    xtype: 'hidden'
                }, {
                    name: 'StatusId',
                    xtype: 'hidden'
                }, {
                    name: 'SalesAreaId',
                    xtype: 'hidden'
                }, {
                    name: 'PreparedById',
                    xtype: 'hidden'
                }, {
                    name: 'SalesPersonId',
                    xtype: 'hidden'
                },  {
                    name: 'StoreId',
                    xtype: 'hidden'
                }, {
                    name: 'PriceCategoryId',
                    xtype: 'hidden'
                },{
                    name: 'VoucherNumber',
                    xtype: 'textfield',
                    fieldLabel: 'Voucher No',
                    readOnly: true,
                    allowBlank: false
                }, {
                    name: 'ReferenceNo',
                    xtype: 'textfield',
                    fieldLabel: 'Reference No',
                    readOnly: false,
                    value: ' ',
                    hidden:true,
                    allowBlank: true
                },{
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
                            fields: ['Id', 'Name', 'StoreId', 'PriceCategoryId', 'PriceCategory']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetSalesArea }
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('proforma-form').getForm();
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
                                fields: ['Id', 'Name','Code', 'PriceCategoryId', 'PriceCategory','PaymentTerm','DeliveryTerm']
                            }),
                            autoLoad: true,
                            api: { read: Psms.GetCustomerBySearch }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        pageSize: 10, listeners: {
                            select: function (cmb, rec, idx) {
                                var form = Ext.getCmp('proforma-form').getForm();
                                form.findField('CustomerId').setValue(rec.id);
                                form.findField("PriceCategoryId").setValue(rec.data['PriceCategoryId']);
                                form.findField("PriceCategory").setValue(rec.data['PriceCategory']);
                      
                            },
                            change: function (cmb, newvalue, oldvalue) {
                                if (newvalue == "") {
                                    var form = Ext.getCmp('proforma-form').getForm();
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
                            var form = Ext.getCmp('proforma-form').getForm();
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
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetPriceCategory }
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('proforma-form').getForm();
                            form.findField("PriceCategoryId").setValue(rec.id);
                        },
                    }
                }, {
                    name: 'Date',
                    xtype: 'datefield',
                    fieldLabel: 'Date',
                    width: 100,
                    allowBlank: false,
                    value: new Date(),
                    maxValue: (new Date()).format('m/d/Y')
                }, {
                    name: 'ValidityUntilDate',
                    xtype: 'datefield',
                    fieldLabel: 'Valid Until',
                    width: 100,
                    allowBlank: false,
                }, ]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [
                   {
                       name: 'PaymentTerm',
                       xtype: 'textfield',
                       fieldLabel: 'Payment Term',
                       width: 100,
                       hidden:false,
                       allowBlank: true,
                       readOnly: false
                   }, {
                       name: 'DeliveryCondition',
                       xtype: 'textarea',
                       fieldLabel: 'Delivery Condition',
                       width: 100,
                       height: 60,
                       hidden: false,
                       allowBlank: true,
                       readOnly: false
                   }, 
                     {
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
                                 fields: ['Id', 'Name','Code']
                             }),
                             autoLoad: true,
                             api: { read: Psms.GetEmployeeBySearch }
                         }),
                         valueField: 'Name',
                         displayField: 'Name',
                         pageSize: 10, listeners: {
                             select: function (cmb, rec, idx) {
                                 var form = Ext.getCmp('proforma-form').getForm();
                                 form.findField('SalesPersonId').setValue(rec.id);
                             },
                             change: function (cmb, newvalue, oldvalue) {
                                 if (newvalue == "") {
                                     var form = Ext.getCmp('proforma-form').getForm();
                                     form.findField('SalesPersonId').reset();

                                 }
                             }
                         }
                     }, 
                    {
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
                                Ext.getCmp('proforma-form').calculateTotal();
                            },
                        }
                    },
                ]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [
                    {
                        name: 'BankInformation',
                        xtype: 'textarea',
                        fieldLabel: 'Bank Information',
                        width: 100,
                        height: 60,
                        hidden: false,
                        allowBlank: true,
                        readOnly: false
                    }, {
                        name: 'TaxableAmount',
                        xtype: 'numberfield',
                        fieldLabel: 'Amount',
                        readOnly: true,
                        hidden: true,
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
                        allowBlank: true,
                        listeners: {
                            change: function (cmb, rec, idx) {
                                Ext.getCmp('proforma-form').calculateTotal();
                            },
                        }
                    }, {
                        name: 'NetPay',
                        xtype: 'numberfield',
                        fieldLabel: 'Net Pay',
                        readOnly: true,
                        hidden:true,
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
Ext.extend(Ext.erp.ux.proforma.Form, Ext.form.FormPanel);
Ext.reg('proforma-form', Ext.erp.ux.proforma.Form);



/**
* @desc      Proforma detailGrid

* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.proforma
* @class     Ext.erp.ux.proforma.GridDetail
* @extends   Ext.grid.GridPanel
*/

Ext.erp.ux.proforma.GridDetail = function (config) {
    Ext.erp.ux.proforma.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Proforma.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'SalesProformaHeaderId', 'IsSerialItem', 'IsLOTItem', 'ItemId', 'IsTaxable', 'WithHoldingTax', 'UnitId', 'MeasurementUnit', 'PriceGroupId', 'PriceGroup', 'UnitCost', 'UnitPrice', 'Tax', 'Name', 'Code', 'Quantity', 'RemainingQuantity', 'Remark'],

            remoteSort: true
        }),
        id: 'proforma-detailGrid',
        clicksToEdit: 1,
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: true,
        height: 250,
        serialStore: new Ext.data.Store(),
        lOTStore: new Ext.data.Store(),
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true
        },
        listeners: {
            beforeLoad: function () {
                Ext.getCmp('proforma-detailGrid').body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
                Ext.getCmp('proforma-detailGrid').body.unmask();
            },
            loadException: function () {
                Ext.getCmp('proforma-detailGrid').body.unmask();
            },
            afteredit: function (e) {
                var record = e.record;
               
                if (record.get('UnitPrice') > 0 || e.field == 'Quantity' || e.field == 'UnitPrice') {
                    Ext.getCmp('proforma-form').calculateTotal();
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
                                fields: ['Id', 'Name', 'Code', 'IsTaxable', 'IsSerialItem', 'WithHoldingTax', 'IsLOTItem', 'UnitId', 'MeasurementUnit', 'UnitPrice', 'PriceGroup', 'PriceGroupId']
                            }),
                            api: { read: Psms.GetSalesItemBySearch }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        listeners: {
                            beforeQuery: function (combo, record, index) {
                                var form = Ext.getCmp('proforma-form').getForm();
                                var priceCategoryId = form.findField('PriceCategoryId').getValue();
                                var detailDrid = Ext.getCmp('proforma-detailGrid');
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
                                var detailDrid = Ext.getCmp('proforma-detailGrid');
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
                                selectedrecord.set('WithHoldingTax', record.get("WithHoldingTax"));

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

                                var detailGrid = Ext.getCmp('proforma-detailGrid');
                                var selectedrecord = detailGrid.getSelectionModel().getSelected();
                                selectedrecord.set('UnitId', record.get("Id"));
                            }
                        }
                    })
                },  {
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
                                var form = Ext.getCmp('proforma-form').getForm();
                                var priceCategoryId = form.findField('PriceCategoryId').getValue();
                                var detailGrid = Ext.getCmp('proforma-detailGrid');
                                var selectedrecord = detailGrid.getSelectionModel().getSelected();
                                selectedrecord.set('PriceGroupId', record.get("Id"));
                                var priceGroupId = record.get("Id");
                                var itemId = selectedrecord.get("ItemId");
                                Psms.GetItemPriceByPriceGroup(itemId, priceGroupId, priceCategoryId, function (result) {
                                    selectedrecord.set('IsTaxable', result.IsTaxable);
                                    selectedrecord.set('UnitPrice', result.data);
                                    selectedrecord.set('WithHoldingTax', result.WithHoldingTax);
                                    Ext.getCmp('proforma-form').calculateTotal();
                                });
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
Ext.extend(Ext.erp.ux.proforma.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };

        this.tbar = [
            {
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: false,
                handler: function () {
                    var detailDrid = Ext.getCmp('proforma-detailGrid');
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
                    var grid = Ext.getCmp('proforma-detailGrid');

                    if (!grid.getSelectionModel().hasSelection())
                        return;

                    var selectedrecord = grid.getSelectionModel().getSelected();
                    grid.getStore().remove(selectedrecord);
                }
            }, '->',
             {
                 xtype: 'button',
                 text: 'Picker',
                 iconCls: 'icon-accept',
                 disabled: false,
                 handler: function () {
                     var detailGrid = Ext.getCmp('proforma-detailGrid');
                     var form = Ext.getCmp('proforma-form').getForm();

                     var priceCategoryId = form.findField('PriceCategoryId').getValue();

                     new Ext.erp.ux.salesItemPicker.Window({
                         targetGrid: detailGrid,
                         priceCategoryId: priceCategoryId
                     }).show();
                 }
             },
            

        ]
        this.bbar = [{
            xtype: 'displayfield',
            id: "proforma-totalSummary",
            style: 'font-weight: bold;font-size:12px;'
        }, ]

        Ext.erp.ux.proforma.GridDetail.superclass.initComponent.apply(this, arguments);
    },
   
    afterRender: function () {

        Ext.erp.ux.proforma.GridDetail.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('proforma-detailGrid', Ext.erp.ux.proforma.GridDetail);

/* @desc     proformaOrder form host window

* @copyright (c) 2020, 
* @date     September 2013
* @namespace Ext.erp.ux.proformaOrder
* @class     Ext.erp.ux.proformaOrder.Window
* @extends   Ext.Window
*/

Ext.erp.ux.proforma.Window = function (config) {
    Ext.erp.ux.proforma.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 800,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'proforma-window',
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        errorMesssage:'',
        bodyStyle: 'padding:5px;',
   
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.SalesProformaHeaderId);
                var window = Ext.getCmp('proforma-window');
                if (typeof this.SalesProformaHeaderId != "undefined" && this.SalesProformaHeaderId != "") {
                    this.form.load({
                        waitMsg: 'Loading...',
                        params: { id: this.SalesProformaHeaderId },
                        success: function (form, action) {
                            var form = Ext.getCmp('proforma-form');
                            var grid = Ext.getCmp('proforma-detailGrid');
                                form.loadTax();
                            
                          

                        }
                    });
                   
                    var grid = Ext.getCmp('proforma-detailGrid');
                    var store = grid.getStore();
                    store.baseParams = { record: Ext.encode({ voucherHeaderId: this.SalesProformaHeaderId, storeId:this.storeId, action: "storeProforma" }) };

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
Ext.extend(Ext.erp.ux.proforma.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.proforma.Form();
        this.grid = new Ext.erp.ux.proforma.GridDetail();
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
        Ext.erp.ux.proforma.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var grid = Ext.getCmp('proforma-detailGrid');
        var store = grid.getStore();
        var rec = '', serialRec = '', lotRec = '';
        this.errorMesssage = "";
        var store = grid.getStore();
         var form = Ext.getCmp('proforma-form').getForm();
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
        rec = this.parseDetailData(store);

         if (this.errorMesssage != "")
            return;     
            this.submitForm(rec);

    },
    parseDetailData: function (store) {
        var rec = '';
        store.each(function (item) {
            Ext.getCmp('proforma-window').errorMesssage = Ext.getCmp('proforma-window').validateDetailData(item);
            if (Ext.getCmp('proforma-window').errorMesssage != '') {
                Ext.MessageBox.show({
                    title: 'Save failed',
                    msg: "Please Enter Valid values for Item  " + item.data['Name'] + " for feilds " + "</br>" + Ext.getCmp('proforma-window').errorMesssage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
            rec = rec + item.data['Id'] + ':' +

                item.data['SalesProformaHeaderId'] + ':' +
                item.data['ItemId'] + ':' +
                item.data['Quantity'] + ':' +
                item.data['RemainingQuantity'] + ':' +
                item.data['UnitId'] + ':' +
                item.data['UnitPrice'] + ':' +
                item.data['PriceGroupId'] + ':' +
                  item.data['IsTaxable'] + ':' +
            item.data['WithHoldingTax'] + ';';

        });
        return rec;
    },
     validateDetailData: function (item) {
        var errorMesssage = '';
        var form = Ext.getCmp('proforma-form').getForm();
        var grid = Ext.getCmp('proforma-detailGrid');

        
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
        return errorMesssage;
    },
    submitForm: function (rec) {
        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
        var window = this;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ proformaDetails: rec, action: this.action }) },

            success: function (form, action) {

                Ext.getCmp('proforma-form').getForm().reset();
                Ext.getCmp('proforma-detailGrid').getStore().removeAll();
                Ext.getCmp('proforma-paging').doRefresh();

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
   
    onCancel: function () {
        this.close();
    }
});
Ext.reg('proforma-window', Ext.erp.ux.proforma.Window);

/**
* @desc      Proforma grid

* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.proforma
* @class     Ext.erp.ux.proforma.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.proforma.Grid = function (config) {
    Ext.erp.ux.proforma.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Proforma.GetAllHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DSC'
            },
            fields: ['Id', 'VoucherNumber', 'ReferenceNo', 'Date', 'Customer', 'StatusId', 'IsLastStep', 'Status', 'SalesPerson', 'Driver', 'ProformaType', 'SalesArea', 'StoreId'],
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
        id: 'proforma-grid',
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
                if (record.get("IsLastStep") ==true)
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
            dataIndex: 'ReferenceNo',
            header: 'Reference No',
            sortable: true,
            width: 100,
            hidden:true,
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

        }]
    }, config));
}
Ext.extend(Ext.erp.ux.proforma.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [{
            id: 'searchProforma',
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearchVoucher
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Proforma', 'CanAdd'),
            handler: this.onAdd
        },{
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Proforma', 'CanEdit'),
     
            handler: this.onEdit
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Approve',
            iconCls: 'icon-accept',
            disabled: !Ext.erp.ux.Reception.getPermission('Proforma', 'CanApprove'),

            handler: this.onApprove
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Revise',
            iconCls: 'icon-accept',
            disabled: !Ext.erp.ux.Reception.getPermission('Proforma', 'CanEdit'),
            handler: this.onRevise
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Void',
            iconCls: 'icon-delete',
            disabled: !Ext.erp.ux.Reception.getPermission('Proforma', 'CanDelete'),
            handler: this.onDelete
        },  {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Preview',
            id: 'preview-Proforma',
            hidden: false,
            iconCls: 'icon-preview',
            handler: this.onPreview
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'proforma-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.proforma.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {

        var grid = Ext.getCmp('proforma-grid');
        if (!grid.getSelectionModel().hasSelection()) return;


        var voucherId = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        window.open('Reports/ErpReportViewer.aspx?rt=PreviewProforma&id=' + voucherId, 'PreviewIV', parameter);


    },
    onAdd: function () {
           new Ext.erp.ux.proforma.Window({
            title: 'Add Proforma',
            action: 'add'
        }).show();
    },
    onEdit: function () {
        var grid = Ext.getCmp('proforma-grid');
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
        new Ext.erp.ux.proforma.Window({
            title: 'Edit Proforma',
            SalesProformaHeaderId: id,
            storeId:storeId,
            action: 'edit'
        }).show();
    },
    onRevise: function () {
        var grid = Ext.getCmp('proforma-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var status = grid.getSelectionModel().getSelected().get('Status');
        var storeId = grid.getSelectionModel().getSelected().get('StoreId');

   
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.ux.proforma.Window({
            title: 'Revise Proforma',
            SalesProformaHeaderId: id,
            storeId: storeId,
            action: 'revise'
        }).show();
    },

     onDelete: function () {
        var grid = Ext.getCmp('proforma-grid');
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
                    Proforma.Void(id, function (result) {
                        if (result.success) {
                            Ext.getCmp('proforma-paging').doRefresh();
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
            var grid = Ext.getCmp('proforma-grid');
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
        Ext.erp.ux.proforma.Grid.superclass.afterRender.apply(this, arguments);
    },

});
Ext.reg('proforma-grid', Ext.erp.ux.proforma.Grid);



/**
* @desc      proforma panel

* @copyright (c) 2010, 
* @date      September 2013
* @version   $Id: proforma.js, 0.1
* @namespace Ext.erp.ux.proforma
* @class     Ext.erp.ux.proforma.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.proforma.Panel = function (config) {
    Ext.erp.ux.proforma.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.proforma.Panel, Ext.Panel, {
    initComponent: function () {
        this.headerGrid = new Ext.erp.ux.proforma.Grid();
   
        this.items = [this.headerGrid];

        Ext.erp.ux.proforma.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('proforma-panel', Ext.erp.ux.proforma.Panel);

