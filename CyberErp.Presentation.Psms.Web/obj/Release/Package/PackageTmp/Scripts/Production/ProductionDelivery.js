
Ext.ns('Ext.erp.ux.productionDelivery');

/**
* @desc      ProductionPlanDelivery form
* @copyright (c) 2020, 
* @date      September 2013
* @namespace Ext.erp.ux.productionDelivery
* @class     Ext.erp.ux.productionDelivery.Form
* @extends   Ext.form.FormPanel
*/

Ext.erp.ux.productionDelivery.Form = function (config) {
    Ext.erp.ux.productionDelivery.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: ProductionPlanDelivery.Get,
            submit: ProductionPlanDelivery.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'productionDelivery-form',
        frame: true,
        labelWidth: 100,
        padding: 5,
        autoHeight: false,
        border: false,
        vatRate: 0,
        withHoldingRate:0,
        loadDocument: function () {

            ProductionPlanDelivery.GetDocumentNo(function (result) {

                var form = Ext.getCmp('productionDelivery-form').getForm();
                form.findField('StatusId').setValue(result.data.StatusId);
                form.findField('AssignedId').setValue(result.data.EmployeeId);
                form.findField('Date').setValue(new Date());
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
                    name: 'ProductionPlanHeaderId',
                    xtype: 'hidden'
                },  {
                    name: 'CreatedAt',
                    xtype: 'hidden'
                }, {
                    name: 'StatusId',
                    xtype: 'hidden'
                }, {
                    name: 'AssignedId',
                    xtype: 'hidden'
                }, {
                    hiddenName: 'ProductionPlan',
                    xtype: 'combo',
                    fieldLabel: 'Plan No',
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
                        api: { read: Psms.GetProductionPlanBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10, listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('productionDelivery-form').getForm();
                            form.findField('ProductionPlanHeaderId').setValue(rec.id);
                            
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('productionDelivery-form').getForm();
                                form.findField('ProductionPlanDeliveryHeaderId').reset();
                            }
                        }
                    }
                }, {
                    hiddenName: 'Assigned',
                    xtype: 'combo',
                    fieldLabel: 'Assigned',
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
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetEmployeeBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10, listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('productionDelivery-form').getForm();
                            form.findField('AssignedId').setValue(rec.id);
                            var planId = form.findField('ProductionPlanHeaderId').getValue();
                            var grid = Ext.getCmp('productionDelivery-detailGrid');
                            var store = grid.getStore();
                            store.baseParams = { record: Ext.encode({ voucherHeaderId: planId, action: "productionPlanDelivery", assignedId: rec.id }) };
                            grid.getStore().reload({
                                params: {
                                    start: 0,
                                    limit: grid.pageSize
                                }
                            });
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('productionDelivery-form').getForm();
                                form.findField('ProductionPlanDeliveryHeaderId').reset();
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
                }, {
                    name: 'Quantity',
                    xtype: 'numberfield',
                    fieldLabel: 'Quantity',
                    width: 100,
                    allowBlank: false,
                     }, ]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [
                   
                    {
                        name: 'Remark',
                        xtype: 'textarea',
                        fieldLabel: 'Remark',
                        width: 100,
                        allowBlank: true,
                          },
                  
                ]
            },]
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.productionDelivery.Form, Ext.form.FormPanel);
Ext.reg('productionDelivery-form', Ext.erp.ux.productionDelivery.Form);



/**
* @desc      ProductionPlanDelivery detailGrid

* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.productionDelivery
* @class     Ext.erp.ux.productionDelivery.GridDetail
* @extends   Ext.grid.GridPanel
*/
var productionDeliverySelectionModel = new Ext.grid.RowSelectionModel({
});
Ext.erp.ux.productionDelivery.GridDetail = function (config) {
    Ext.erp.ux.productionDelivery.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ProductionPlanDelivery.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'ProductionPlanDeliveryHeaderId', 'ProductionOrderDetailId', 'UnitId', 'ProductionOrder', 'MeasurementUnit', 'UnitCost', 'UnitPrice', 'Tax', 'Name', 'Code', 'PlanedQuantity', 'Quantity', 'RemainingQuantity', 'Remark'],

            remoteSort: true,
            listeners: {
                load: function () {
                }
            }
        }),
        id: 'productionDelivery-detailGrid',
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
                Ext.getCmp('productionDelivery-detailGrid').body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
                Ext.getCmp('productionDelivery-detailGrid').body.unmask();
            },
            loadException: function () {
                Ext.getCmp('productionDelivery-detailGrid').body.unmask();
            },
            afteredit: function (e) {
                var record = e.record;
                if (record.get('UnitPrice') > 0 || e.field == 'PlanedQuantity' || e.field == 'UnitPrice') {
                }
            }
        },
        sm: productionDeliverySelectionModel,
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
                               tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' +'<h3><span>{Name}</span></h3> {Code}</div></tpl>',
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'Name', 'Code', 'IsSerialItem', 'IsLOTItem', 'UnitId', 'MeasurementUnit', 'UnitPrice', 'PriceGroup', 'PriceGroupId']
                            }),
                            api: { read: Psms.GetProductionPlanDeliveryItemBySearch }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        listeners: {
                           

                            select: function (combo, record, index) {
                                var detailDrid = Ext.getCmp('productionDelivery-detailGrid');
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

                                var detailGrid = Ext.getCmp('productionDelivery-detailGrid');
                                var selectedrecord = detailGrid.getSelectionModel().getSelected();
                                selectedrecord.set('UnitId', record.get("Id"));
                            }
                        }
                    })
                },{
                    dataIndex: 'PlanedQuantity',
                    header: 'Planed Qty',
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
                    hidden: false,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000 ');
                    }
                },
                {
                    dataIndex: 'Quantity',
                    header: 'Qty',
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
Ext.extend(Ext.erp.ux.productionDelivery.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };

        this.tbar = [          
            {
                xtype: 'button',
                text: 'Remove',
                iconCls: 'icon-exit',
                disabled: false,
                handler: function () {
                    var grid = Ext.getCmp('productionDelivery-detailGrid');

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
                    var detailGrid = Ext.getCmp('productionDelivery-detailGrid');
                    new Ext.erp.ux.itemPicker.Window({
                        targetGrid: detailGrid
                    }).show();
                }
            },

        ]
        this.bbar = [{
            xtype: 'displayfield',
            id: "productionDelivery-totalSummary",
            style: 'font-weight: bold;font-size:12px;'
        }, ]

        Ext.erp.ux.productionDelivery.GridDetail.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        Ext.erp.ux.productionDelivery.GridDetail.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('productionDelivery-detailGrid', Ext.erp.ux.productionDelivery.GridDetail);

/* @desc     productionDeliveryOrder form host window

* @copyright (c) 2020, 
* @date     September 2013
* @namespace Ext.erp.ux.productionDeliveryOrder
* @class     Ext.erp.ux.productionDeliveryOrder.Window
* @extends   Ext.Window
*/

Ext.erp.ux.productionDelivery.Window = function (config) {
    Ext.erp.ux.productionDelivery.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 800,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'productionDelivery-window',
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        errorMesssage:'',
        bodyStyle: 'padding:5px;',
   
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.productionDeliveryHeaderId);
                var window = Ext.getCmp('productionDelivery-window');
                if (typeof this.productionDeliveryHeaderId != "undefined" && this.productionDeliveryHeaderId != "") {
                    this.form.load({
                        waitMsg: 'Loading...',
                        params: { id: this.productionDeliveryHeaderId },
                        success: function (form, action) {
                            var form = Ext.getCmp('productionDelivery-form');
                                                                            
                        }
                    });
                    var form = Ext.getCmp('productionDelivery-form');
                   
                        var grid = Ext.getCmp('productionDelivery-detailGrid');
                        var store = grid.getStore();
                        store.baseParams = { record: Ext.encode({ voucherHeaderId: this.productionDeliveryHeaderId, storeId: this.storeId, action: "storeProductionPlanDelivery" }) };
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
Ext.extend(Ext.erp.ux.productionDelivery.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.productionDelivery.Form();
        this.grid = new Ext.erp.ux.productionDelivery.GridDetail();
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
        Ext.erp.ux.productionDelivery.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var grid = Ext.getCmp('productionDelivery-detailGrid');
        var store = grid.getStore();
        var rec = '';
        this.errorMesssage = "";
        var store = grid.getStore();
        var form = Ext.getCmp('productionDelivery-form').getForm();
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
            Ext.getCmp('productionDelivery-window').errorMesssage = Ext.getCmp('productionDelivery-window').validateDetailData(item);
            if (Ext.getCmp('productionDelivery-window').errorMesssage != '') {
                Ext.MessageBox.show({
                    title: 'Save failed',
                    msg: "Please Enter Valid values for Item  " + item.data['Name'] + " for feilds " + "</br>" + Ext.getCmp('productionDelivery-window').errorMesssage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
            rec = rec + item.data['Id'] + ':' +

                item.data['ProductionPlanDeliveryHeaderId'] + ':' +
                item.data['ProductionOrderDetailId'] + ':' +
                item.data['Quantity'] + ':' +
                item.data['PlanedQuantity'] + ':' +
                item.data['RemainingQuantity'] + ':' +
                item.data['UnitId'] + ';';

        });
        return rec;
    },
     validateDetailData: function (item) {
        var errorMesssage = '';
        var form = Ext.getCmp('productionDelivery-form').getForm();
        var grid = Ext.getCmp('productionDelivery-detailGrid');

       
        var planedId = form.findField("ProductionPlanHeaderId").getValue();
      
        if (typeof item.get('Quantity') == 'undefined' || item.get('Quantity') < 0) {
            if (errorMesssage == "")
                errorMesssage = "Quantity";
            else
                errorMesssage = errorMesssage + "</br>" + "           Quantity";
        }
        if ((planedId != "") && item.get('RemainingQuantity') < item.get('Quantity')) {
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
            params: { record: Ext.encode({ productionDeliveryDetails: rec, action: this.action }) },

            success: function (form, action) {

                Ext.getCmp('productionDelivery-form').getForm().reset();
                Ext.getCmp('productionDelivery-detailGrid').getStore().removeAll();
                Ext.getCmp('productionDelivery-paging').doRefresh();
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
Ext.reg('productionDelivery-window', Ext.erp.ux.productionDelivery.Window);

/**
* @desc      ProductionPlanDelivery grid

* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.productionDelivery
* @class     Ext.erp.ux.productionDelivery.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.productionDelivery.Grid = function (config) {
    Ext.erp.ux.productionDelivery.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ProductionPlanDelivery.GetAllHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DSC'
            },
            fields: ['Id', 'ProductionPlan', 'Date', 'Assigned', 'Status','Quantity'],
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
        id: 'productionDelivery-grid',
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
            dataIndex: 'ProductionPlan',
            header: 'Plan No',
            sortable: true,
            width: 100,
      
            menuDisabled: true,
            renderer: this.customRenderer,

        },  {
            dataIndex: 'Date',
            header: 'Date',
            sortable: true,
            width: 80,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'Assigned',
            header: 'Assigned',
            sortable: true,
            width: 80,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'Quantity',
            header: 'Quantity',
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
Ext.extend(Ext.erp.ux.productionDelivery.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [{
            id: 'searchProductionPlanDelivery',
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearchVoucher
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Production Delivery', 'CanAdd'),
            handler: this.onAdd
        },  {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Production Delivery', 'CanEdit'),
     
            handler: this.onEdit
        },  {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Void',
            iconCls: 'icon-delete',
            disabled: !Ext.erp.ux.Reception.getPermission('Production Delivery', 'CanDelete'),
            handler: this.onDelete
        },  {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Preview',
            id: 'preview-Production Delivery',
            hidden: false,
            iconCls: 'icon-preview',
            handler: this.onPreview
        }, 


        ];
        this.bbar = new Ext.PagingToolbar({
            id: 'productionDelivery-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.productionDelivery.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {

        var grid = Ext.getCmp('productionDelivery-grid');
        if (!grid.getSelectionModel().hasSelection()) return;


        var voucherId = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        window.open('Reports/ErpReportViewer.aspx?rt=PreviewProductionPlanDelivery&id=' + voucherId, 'PreviewIV', parameter);


    },
     
    onAdd: function () {
           new Ext.erp.ux.productionDelivery.Window({
               title: 'Add Production Delivery',
            action: 'approve'
        }).show();
    },
  
    onEdit: function () {
        var grid = Ext.getCmp('productionDelivery-grid');
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
        new Ext.erp.ux.productionDelivery.Window({
            title: 'Edit Production Delivery',
            productionDeliveryHeaderId: id,
            storeId:storeId,
            action: 'edit'
        }).show();
    },
   
    onDelete: function () {
        var grid = Ext.getCmp('productionDelivery-grid');
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
                    ProductionPlanDelivery.Void(id, function (result) {
                        if (result.success) {
                            Ext.getCmp('productionDelivery-paging').doRefresh();
                            Ext.MessageBox.show({
                                title: 'Success',
                                msg: "Data has been deleted successfully",
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO,
                                scope: this
                            });
                            Ext.getCmp('productionDelivery-grid').onSendToPos();
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
            var grid = Ext.getCmp('productionDelivery-grid');
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
        Ext.erp.ux.productionDelivery.Grid.superclass.afterRender.apply(this, arguments);
    },


});
Ext.reg('productionDelivery-grid', Ext.erp.ux.productionDelivery.Grid);



/**
* @desc      productionDelivery panel

* @copyright (c) 2010, 
* @date      September 2013
* @version   $Id: productionDelivery.js, 0.1
* @namespace Ext.erp.ux.productionDelivery
* @class     Ext.erp.ux.productionDelivery.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.productionDelivery.Panel = function (config) {
    Ext.erp.ux.productionDelivery.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.productionDelivery.Panel, Ext.Panel, {
    initComponent: function () {
        this.headerGrid = new Ext.erp.ux.productionDelivery.Grid();
   
        this.items = [this.headerGrid];

        Ext.erp.ux.productionDelivery.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('productionDelivery-panel', Ext.erp.ux.productionDelivery.Panel);
