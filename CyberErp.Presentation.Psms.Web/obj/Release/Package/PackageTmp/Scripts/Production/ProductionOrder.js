
Ext.ns('Ext.erp.ux.productionOrder');

/**
* @desc      ProductionOrder form
* @copyright (c) 2020, 
* @date      September 2013
* @namespace Ext.erp.ux.productionOrder
* @class     Ext.erp.ux.productionOrder.Form
* @extends   Ext.form.FormPanel
*/

Ext.erp.ux.productionOrder.Form = function (config) {
    Ext.erp.ux.productionOrder.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: ProductionOrder.Get,
            submit: ProductionOrder.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'productionOrder-form',
        frame: true,
        labelWidth: 100,
        padding: 5,
        autoHeight: false,
        border: false,
        vatRate: 0,
        withHoldingRate:0,
        loadDocument: function () {

            ProductionOrder.GetDocumentNo(function (result) {

                var form = Ext.getCmp('productionOrder-form').getForm();
                form.findField('VoucherNumber').setValue(result.data.DocNo);
                form.findField('StatusId').setValue(result.data.StatusId);
                form.findField('PreparedById').setValue(result.data.EmployeeId);
                form.findField('Date').setValue(new Date());
                form.findField('FiscalYearId').setValue(result.data.FiscalYearId);
              });
        },
        baseCls: 'x-plain',
        items: [{
            layout: 'column',
            bodyStyle: 'background-color:transparent;',
            border: false,
            defaults: {
                columnWidth: .5,
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
                },  {
                    name: 'PreparedById',
                    xtype: 'hidden'
                }, {
                    name: 'SalesOrderId',
                    xtype: 'hidden'
                }, {
                    name: 'DriverId',
                    xtype: 'hidden'
                }, {
                    name: 'StoreId',
                    xtype: 'hidden'
                },  {
                    name: 'VoucherNumber',
                    xtype: 'textfield',
                    fieldLabel: 'Order No',
                    readOnly: true,
                    allowBlank: false
                }, {
                    hiddenName: 'ReferenceNo',
                    xtype: 'combo',
                    fieldLabel: 'Sales Order',
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
                            fields: ['Id', 'Name',  'SalesAreaId', 'SalesArea', 'CustomerId', 'Customer']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetSalesOrderBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10, listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('productionOrder-form').getForm();
                            form.findField('SalesOrderId').setValue(rec.id);
                            form.findField('SalesAreaId').setValue(rec.get('SalesAreaId'));
                            form.findField('SalesArea').setValue(rec.get('SalesArea'));
                            form.findField('CustomerId').setValue(rec.get('CustomerId'));
                            form.findField('Customer').setValue(rec.get('Customer'));
                            
                            var grid = Ext.getCmp('productionOrder-detailGrid');
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
                                var form = Ext.getCmp('productionOrder-form').getForm();
                                form.findField('SalesOrderId').reset();
                            }
                        }
                    }
                }, {
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
                            fields: ['Id', 'Name','StoreId']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetSalesArea }
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('productionOrder-form').getForm();
                            form.findField("SalesAreaId").setValue(rec.id);
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
                               tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' +'<h3><span>{Name}</span></h3> {Code}</div></tpl>',
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
                                var form = Ext.getCmp('productionOrder-form').getForm();
                                form.findField('CustomerId').setValue(rec.id);
                            },
                            change: function (cmb, newvalue, oldvalue) {
                                if (newvalue == "") {
                                    var form = Ext.getCmp('productionOrder-form').getForm();
                                    form.findField('CustomerId').reset();
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
                            var form = Ext.getCmp('productionOrder-form').getForm();
                            new Ext.erp.ux.customer.Window({
                                targetForm: form,
                            }).show();

                        }
                    }
                    ]
                },   ]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [
                    {
                        hiddenName: 'Store',
                        xtype: 'combo',
                        fieldLabel: 'Location',
                        typeAhead: false,
                        width: 100,
                        hideTrigger: true,
                        minChars: 2,
                        listWidth: 280,
                        emptyText: '---Type to Search---',
                        mode: 'remote',
                        allowBlank: true,
                        hidden: false,
                        tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> {Code}</div></tpl>',
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
                                var form = Ext.getCmp('productionOrder-form').getForm();
                                form.findField('StoreId').setValue(rec.id);
                            },
                            change: function (cmb, newvalue, oldvalue) {
                                if (newvalue == "") {
                                    var form = Ext.getCmp('productionOrder-form').getForm();
                                    form.findField('StoreId').reset();

                                }
                            }
                        }
                    }, {
                         name: 'Date',
                         xtype: 'datefield',
                         fieldLabel: 'Date',
                         width: 100,
                         allowBlank: false,
                         value: new Date(),
                         maxValue: (new Date()).format('m/d/Y')
                    },
                    {
                        name: 'PromisedDate',
                        xtype: 'datefield',
                        fieldLabel: 'Promised Date',
                        width: 100,
                        allowBlank: false
                        //value: new Date(),
                        //maxValue: (new Date()).format('m/d/Y')
                    }, {
                        name: 'Remark',
                        xtype: 'textarea',
                        fieldLabel: 'Remark',
                        allowBlank: true
                    },
                  
                ]
            },]
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.productionOrder.Form, Ext.form.FormPanel);
Ext.reg('productionOrder-form', Ext.erp.ux.productionOrder.Form);



/**
* @desc      ProductionOrder detailGrid

* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.productionOrder
* @class     Ext.erp.ux.productionOrder.GridDetail
* @extends   Ext.grid.GridPanel
*/
var productionOrderSelectionModel = new Ext.grid.RowSelectionModel({
});
Ext.erp.ux.productionOrder.GridDetail = function (config) {
    Ext.erp.ux.productionOrder.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ProductionOrder.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'ProductionOrderHeaderId','ItemId', 'UnitId', 'MeasurementUnit', 'UnitCost', 'UnitPrice', 'Tax', 'Name', 'Code', 'SoldQuantity', 'Quantity', 'RemainingQuantity', 'Remark'],

            remoteSort: true,
            listeners: {
                load: function () {
                }
            }
        }),
        id: 'productionOrder-detailGrid',
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
                Ext.getCmp('productionOrder-detailGrid').body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
                Ext.getCmp('productionOrder-detailGrid').body.unmask();
            },
            loadException: function () {
                Ext.getCmp('productionOrder-detailGrid').body.unmask();
            },
            afteredit: function (e) {
                var record = e.record;
                if (record.get('UnitPrice') > 0 || e.field == 'SoldQuantity' || e.field == 'UnitPrice') {
                }
            }
        },
        sm: productionOrderSelectionModel,
        cm: new Ext.grid.ColumnModel({
            columns: [
                new Ext.grid.RowNumberer(),
                {
                    dataIndex: 'Code',
                    header: 'Code',
                    sortable: true,
                    width: 100,
                    menuDisabled: true
                }, {
                    dataIndex: 'Name',
                    header: 'Name',
                    sortable: true,
                    width: 140,
                    readOnly: true,
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
                        tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> {Code}</div></tpl>',
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'Name', 'Code', 'Color', 'Size', 'IsSerialItem', 'IsLOTItem', 'UnitId', 'MeasurementUnit', 'UnitPrice', 'PriceGroup', 'PriceGroupId']
                            }),
                            api: { read: Psms.GetItemBySearch }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        listeners: {
                            select: function (combo, record, index) {
                                var detailDrid = Ext.getCmp('productionOrder-detailGrid');
                                var selectedrecord = detailDrid.getSelectionModel().getSelected();
                                selectedrecord.set('ItemId', record.get("Id"));
                                selectedrecord.set('UnitId', record.get("UnitId"));
                                selectedrecord.set('Code', record.get("Code"));
                                selectedrecord.set('SoldQuantity',0);
                                 selectedrecord.set('MeasurementUnit', record.get("MeasurementUnit"));
                            }
                        }
                    })
                },  {
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

                                var detailGrid = Ext.getCmp('productionOrder-detailGrid');
                                var selectedrecord = detailGrid.getSelectionModel().getSelected();
                                selectedrecord.set('UnitId', record.get("Id"));
                            }
                        }
                    })
                }, {
                    dataIndex: 'SoldQuantity',
                    header: 'Sold Qty',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000 ');
                    },
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: false
                    }
                }, {
                    dataIndex: 'RemainingQuantity',
                    header: 'Remaining Qty',
                    sortable: true,
                    width: 70,
                   // hidden: false,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000 ');
                    },
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: false
                    }
                },
                {
                    dataIndex: 'Quantity',
                    header: 'Ordered Qty',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000 ');
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
Ext.extend(Ext.erp.ux.productionOrder.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };

        this.tbar = [          
            {
                xtype: 'button',
                text: 'Remove',
                iconCls: 'icon-exit',
                disabled: false,
                handler: function () {
                    var grid = Ext.getCmp('productionOrder-detailGrid');

                    if (!grid.getSelectionModel().hasSelection())
                        return;

                    var selectedrecord = grid.getSelectionModel().getSelected();
                    grid.getStore().remove(selectedrecord);
                }
            },
            '->',
            {
                xtype: 'button',
                text: 'Select Items',
                hidden:false,
                iconCls: 'icon-accept',
                disabled: false,
                handler: function () {
                    var detailGrid = Ext.getCmp('productionOrder-detailGrid');
                    new Ext.erp.ux.itemPicker.Window({
                        targetGrid: detailGrid
                    }).show();
                }
            },

        ]
        this.bbar = [{
            xtype: 'displayfield',
            id: "productionOrder-totalSummary",
            style: 'font-weight: bold;font-size:12px;'
        }, ]

        Ext.erp.ux.productionOrder.GridDetail.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        Ext.erp.ux.productionOrder.GridDetail.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('productionOrder-detailGrid', Ext.erp.ux.productionOrder.GridDetail);

/* @desc     productionOrderOrder form host window

* @copyright (c) 2020, 
* @date     September 2013
* @namespace Ext.erp.ux.productionOrderOrder
* @class     Ext.erp.ux.productionOrderOrder.Window
* @extends   Ext.Window
*/

Ext.erp.ux.productionOrder.Window = function (config) {
    Ext.erp.ux.productionOrder.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 800,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'productionOrder-window',
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        errorMesssage:'',
        bodyStyle: 'padding:5px;',
   
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.productionOrderHeaderId);
                var window = Ext.getCmp('productionOrder-window');
                if (typeof this.productionOrderHeaderId != "undefined" && this.productionOrderHeaderId != "") {
                    this.form.load({
                        waitMsg: 'Loading...',
                        params: { id: this.productionOrderHeaderId },
                        success: function (form, action) {
                            var form = Ext.getCmp('productionOrder-form');
                                                                            
                        }
                    });
                    var form = Ext.getCmp('productionOrder-form');
                   
                        var grid = Ext.getCmp('productionOrder-detailGrid');
                        var store = grid.getStore();
                        store.baseParams = { record: Ext.encode({ voucherHeaderId: this.productionOrderHeaderId, storeId: this.storeId, action: "storeProductionOrder" }) };
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
Ext.extend(Ext.erp.ux.productionOrder.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.productionOrder.Form();
        this.grid = new Ext.erp.ux.productionOrder.GridDetail();
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
        Ext.erp.ux.productionOrder.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var grid = Ext.getCmp('productionOrder-detailGrid');
        var store = grid.getStore();
        var rec = '';
        this.errorMesssage = "";
        var store = grid.getStore();
        var form = Ext.getCmp('productionOrder-form').getForm();
        if (store.getCount() < 1 ) {
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
            Ext.getCmp('productionOrder-window').errorMesssage = Ext.getCmp('productionOrder-window').validateDetailData(item);
            if (Ext.getCmp('productionOrder-window').errorMesssage != '') {
                Ext.MessageBox.show({
                    title: 'Save failed',
                    msg: "Please Enter Valid values for Item  " + item.data['Name'] + " for feilds " + "</br>" + Ext.getCmp('productionOrder-window').errorMesssage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
            rec = rec + item.data['Id'] + ':' +

                item.data['ProductionOrderHeaderId'] + ':' +
                item.data['ItemId'] + ':' +
                item.data['Quantity'] + ':' +
                item.data['SoldQuantity'] + ':' +
                item.data['RemainingQuantity'] + ':' +
                item.data['UnitId'] + ';';

        });
        return rec;
    },
    validateDetailData: function (item) {
        var errorMesssage = '';
        var form = Ext.getCmp('productionOrder-form').getForm();
        var grid = Ext.getCmp('productionOrder-detailGrid');

       
        var salesOrderId = form.findField("SalesOrderId").getValue();
      
        if (typeof item.get('Quantity') == 'undefined' || item.get('Quantity') < 0) {
            if (errorMesssage == "")
                errorMesssage = "Quantity";
            else
                errorMesssage = errorMesssage + "</br>" + "           Quantity";
        }
        if ((salesOrderId != "") && item.get('RemainingQuantity') < item.get('Quantity')) {
            if (errorMesssage == "")
                errorMesssage = "Remaining Quantity should be greater than  quantity";
            else
                errorMesssage = errorMesssage + "</br>" + "           Remaining Quantity should be greater than  quantity";
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
            params: { record: Ext.encode({ productionOrderDetails: rec, action: this.action }) },

            success: function (form, action) {

                Ext.getCmp('productionOrder-form').getForm().reset();
                Ext.getCmp('productionOrder-detailGrid').getStore().removeAll();
                Ext.getCmp('productionOrder-paging').doRefresh();
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
    },
   
});
Ext.reg('productionOrder-window', Ext.erp.ux.productionOrder.Window);

/**
* @desc      ProductionOrder grid

* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.productionOrder
* @class     Ext.erp.ux.productionOrder.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.productionOrder.Grid = function (config) {
    Ext.erp.ux.productionOrder.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ProductionOrder.GetAllHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DSC'
            },
            fields: ['Id', 'VoucherNumber', 'ReferenceNo', 'Date', 'PromisedDate', 'Customer','Store',  'StatusId', 'Status', 'PreparedBy','SalesArea'],
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
        id: 'productionOrder-grid',
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
                if (record.get("Status") == "Approved")
                    return '<img src="Content/images/app/OkPass.png"/>';
                else if (record.get("Status") == "Certified")
                    return '<img src="Content/images/app/pending.png"/>';
                else
                    return '<img src="Content/images/app/Cancel1.png"/>';
            }
        }, {
            dataIndex: 'Store',
            header: 'Location',
            sortable: true,
            width: 100,

            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'VoucherNumber',
            header: 'Production Order Number',
            sortable: true,
            width: 100,
      
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'ReferenceNo',
            header: 'Reference No',
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

        }, {
            dataIndex: 'PromisedDate',
            header: 'Promised Date',
            sortable: true,
            width: 80,
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

        }]
    }, config));
}
Ext.extend(Ext.erp.ux.productionOrder.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [{
            id: 'searchProductionOrder',
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearchVoucher
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Production Order', 'CanAdd'),
            handler: this.onAdd
        },  {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Production Order', 'CanEdit'),
     
            handler: this.onEdit
        },  {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Void',
            iconCls: 'icon-delete',
            disabled: !Ext.erp.ux.Reception.getPermission('Production Order', 'CanDelete'),
            handler: this.onDelete
        },  {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Preview',
            id: 'preview-Production Order',
            hidden: false,
            iconCls: 'icon-preview',
            handler: this.onPreview
        }, 


        ];
        this.bbar = new Ext.PagingToolbar({
            id: 'productionOrder-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.productionOrder.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {

        var grid = Ext.getCmp('productionOrder-grid');
        if (!grid.getSelectionModel().hasSelection()) return;


        var voucherId = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        window.open('Reports/ErpReportViewer.aspx?rt=PreviewProductionOrder&id=' + voucherId, 'PreviewIV', parameter);


    },
     
    onAdd: function () {
           new Ext.erp.ux.productionOrder.Window({
               title: 'Add Production Order',
            action: 'approve'
        }).show();
    },
  
    onEdit: function () {
        var grid = Ext.getCmp('productionOrder-grid');
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
        new Ext.erp.ux.productionOrder.Window({
            title: 'Edit Production Order',
            productionOrderHeaderId: id,
            storeId:storeId,
            action: 'edit'
        }).show();
    },
   
    onDelete: function () {
        var grid = Ext.getCmp('productionOrder-grid');
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
                    ProductionOrder.Void(id, function (result) {
                        if (result.success) {
                            Ext.getCmp('productionOrder-paging').doRefresh();
                            Ext.MessageBox.show({
                                title: 'Success',
                                msg: "Data has been deleted successfully",
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO,
                                scope: this
                            });
                            Ext.getCmp('productionOrder-grid').onSendToPos();
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
            var grid = Ext.getCmp('productionOrder-grid');
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.voucherSearch.Window({ title: 'Search Transactions' }).show();
    },
    customRenderer: function (value, metaData, record, rowIndex, colIndex, store) {

        if (record.get("Status") == "Approved")
            return '<span style=color:blue>' + value + '</span>';
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
        Ext.erp.ux.productionOrder.Grid.superclass.afterRender.apply(this, arguments);
    },


});
Ext.reg('productionOrder-grid', Ext.erp.ux.productionOrder.Grid);



/**
* @desc      productionOrder panel

* @copyright (c) 2010, 
* @date      September 2013
* @version   $Id: productionOrder.js, 0.1
* @namespace Ext.erp.ux.productionOrder
* @class     Ext.erp.ux.productionOrder.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.productionOrder.Panel = function (config) {
    Ext.erp.ux.productionOrder.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.productionOrder.Panel, Ext.Panel, {
    initComponent: function () {
        this.headerGrid = new Ext.erp.ux.productionOrder.Grid();
   
        this.items = [this.headerGrid];

        Ext.erp.ux.productionOrder.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('productionOrder-panel', Ext.erp.ux.productionOrder.Panel);
