Ext.ns('Ext.erp.ux.deliverySchedule');

/**
* @desc      DeliverySchedule form

* @copyright (c) 2020, 
* @date      September 2013
* @namespace Ext.erp.ux.deliverySchedule
* @class     Ext.erp.ux.deliverySchedule.Form
* @extends   Ext.form.FormPanel
*/

Ext.erp.ux.deliverySchedule.Form = function (config) {
    Ext.erp.ux.deliverySchedule.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FreightOrder.GetSchedule,
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'deliverySchedule-form',
        frame: true,
        labelWidth: 70,
        padding: 5,
        autoHeight: false,
        border: false,

        loadDocument: function () {

            FreightOrder.GetDocumentNo(function (result) {
                var form = Ext.getCmp('deliverySchedule-form').getForm();
                form.findField('VoucherNumber').setValue(result.data.DocNo);
                form.findField('StatusId').setValue(result.data.StatusId);
                form.findField('PreparedById').setValue(result.data.EmployeeId);
                form.findField('Date').setValue(new Date());
                form.findField('FiscalYearId').setValue(result.data.FiscalYearId);
                form.findField('DriverName').setValue('');
                form.findField('PlateNo').setValue('');
                form.findField('DriverTelephone').setValue('');


            });


        },
         baseCls: 'x-plain',
         items: [{
             name: 'Id',
             xtype: 'hidden'
         }, {
             name: 'CustomerId',
             xtype: 'hidden'
         }, {
             name: 'VoucherNumber',
             xtype: 'textfield',
             fieldLabel: 'Voucher Number',
             readOnly: true,
             allowBlank: false
         }, {
             name: 'ATC',
             xtype: 'textfield',
             fieldLabel: 'ATC',
             readOnly: false,
             allowBlank: false
         }, {
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
                     fields: ['Id', 'Name', 'Telephone']
                 }),
                 autoLoad: true,
                 api: { read: Psms.GetCustomerBySearch }
             }),
             valueField: 'Name',
             displayField: 'Name',
             pageSize: 10, listeners: {
                 select: function (cmb, rec, idx) {
                     var form = Ext.getCmp('deliverySchedule-form').getForm();
                     form.findField('CustomerId').setValue(rec.id);
                     form.findField('CustomerTelephone').setValue(rec.data['Telephone']);
                 },
                 change: function (cmb, newvalue, oldvalue) {
                     if (newvalue == "") {
                         var form = Ext.getCmp('deliverySchedule-form').getForm();
                         form.findField('CustomerId').reset();
                     }
                 }
             }
         }, {
             hiddenName: 'InvoiceNo',
             xtype: 'combo',
             fieldLabel: 'Fs',
             typeAhead: false,
             width: 100,
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
                     fields: ['Id', 'Name', 'SupplierId', 'Supplier', 'Quantity', 'Unit', 'UnitId']
                 }),
                 autoLoad: true,
                 api: { read: Psms.GetSalesOrderBySearch }
             }),
             valueField: 'Name',
             displayField: 'Name',
             pageSize: 10,
             listeners: {
                 beforeQuery: function (combo, record, index) {
                     var form = Ext.getCmp('deliverySchedule-form').getForm();
                     var customerId = form.findField('CustomerId').getValue();
                     this.store.baseParams = { customerId: customerId };
                     this.getStore().reload({
                         params: {
                             start: 0,
                             limit: this.pageSize
                         }
                     });

                 },
                 select: function (cmb, rec, idx) {
                    },
                 change: function (cmb, newvalue, oldvalue) {
                     if (newvalue == "") {
                         var form = Ext.getCmp('deliverySchedule-form').getForm();
                       
                     }
                 }
             }
         }, {
             name: 'CustomerTelephone',
             xtype: 'textfield',
             fieldLabel: 'Telephone',
             width: 100,
             allowBlank: false,
          }, {
             name: 'Date',
             xtype: 'datefield',
             fieldLabel: 'Date',
             width: 100,
             allowBlank: false,
             value: new Date(),
          }, {
              name: 'Quantity',
              xtype: 'numberfield',
              fieldLabel: 'Quantity',
              width: 100,
              allowBlank: false,
          }, ]
       
    }, config));
}
Ext.extend(Ext.erp.ux.deliverySchedule.Form, Ext.form.FormPanel);
Ext.reg('deliverySchedule-form', Ext.erp.ux.deliverySchedule.Form);



/* @desc     deliveryScheduleOrder form host window

* @copyright (c) 2020, 
* @date     September 2013
* @namespace Ext.erp.ux.deliveryScheduleOrder
* @class     Ext.erp.ux.deliveryScheduleOrder.Window
* @extends   Ext.Window
*/

Ext.erp.ux.deliverySchedule.Window = function (config) {
    Ext.erp.ux.deliverySchedule.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 800,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'deliverySchedule-window',
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
   
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.deliveryScheduleHeaderId);
               
                if (typeof this.deliveryScheduleHeaderId != "undefined" && this.deliveryScheduleHeaderId != "") {
                    this.form.load({
                        waitMsg: 'Loading...',
                        params: { id: this.deliveryScheduleHeaderId },
                        success: function () {
                     
                        }
                    });
                }
                else {
                    Ext.getCmp('deliverySchedule-form').loadDocument();
                }

            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.ux.deliverySchedule.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.deliverySchedule.Form();
        this.items = [this.form];
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
        Ext.erp.ux.deliverySchedule.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var id = this.form.getForm().findField('Id').getValue();
        var customerId = this.form.getForm().findField('CustomerId').getValue();
        var invoiceNo = this.form.getForm().findField('InvoiceNo').getValue();
        var date = this.form.getForm().findField('Date').getValue();
        var customerTelephone = this.form.getForm().findField('CustomerTelephone').getValue();
        
        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
        var window = this;
        FreightOrder.SaveSchedule(id, customerId, invoiceNo, customerTelephone, date, function (result) {
            if (result.success) {
                Ext.getCmp('deliverySchedule-paging').doRefresh();
                Ext.getCmp('deliveryScheduleDateList-paging').doRefresh();

                
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
    },
    onCancel: function () {
        this.close();
    }
});
Ext.reg('deliverySchedule-window', Ext.erp.ux.deliverySchedule.Window);

/**
* @desc      DeliverySchedule grid

* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.deliverySchedule
* @class     Ext.erp.ux.deliverySchedule.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.deliverySchedule.Grid = function (config) {
    Ext.erp.ux.deliverySchedule.Grid.superclass.constructor.call(this, Ext.apply({

        store: new Ext.data.GroupingStore({
            proxy: new Ext.data.DirectProxy({
                directFn: FreightOrder.GetAllScheduleHeader,
                paramsAsHash: false,
                paramOrder: 'start|limit|sort|dir|record',
            }),
            reader: new Ext.data.JsonReader({
                root: 'data',
                idProperty: 'Id',
                totalProperty: 'total',
                sortInfo: {
                    field: 'Item',
                    direction: 'ASC'
                },
                fields: ['Id', 'VoucherNumber', 'Item', 'Date', 'ATC', 'Customer', 'InvoiceNo', 'CustomerTelephone'],
            }),
            groupField: 'Item',
            sortInfo: {
                field: 'Item',
                direction: 'ASC'
            },
            remoteSort: true,
            listeners: {
                beforeLoad: function () { this.body.mask('Loading...', 'x-mask-loading'); },
                load: function () { this.body.unmask(); },
                loadException: function () { this.body.unmask(); },
                scope: this
            }
        }),
        view: new Ext.grid.GroupingView({
            forceFit: true,
            showGroupName: false,
            groupTextTpl: '{text}'
        }),


      
        id: 'deliverySchedule-grid',
        pageSize: 36,
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
            dataIndex: 'Item',
            header: 'Item',
            sortable: true,
            hidden:true,
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
            dataIndex: 'VoucherNumber',
            header: 'VoucherNumber',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'ATC',
            header: 'ATC',
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
            dataIndex: 'InvoiceNo',
            header: 'FS',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'CustomerTelephone',
            header: 'Telephone',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, ]
    }, config));
}
Ext.extend(Ext.erp.ux.deliverySchedule.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ action: 'for schedule' }) };
        this.tbar = [{
            id: 'searchDeliverySchedule',
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearchVoucher
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Delivery Schedule', 'CanEdit'),
     
            handler: this.onEdit
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Preview',
            id: 'preview-DeliverySchedule',
            hidden: false,
            iconCls: 'icon-preview',
            handler: this.onPreview
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'deliverySchedule-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.deliverySchedule.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {

        var grid = Ext.getCmp('deliverySchedule-grid');
        if (!grid.getSelectionModel().hasSelection()) return;

       
        var voucherId = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        window.open('Reports/ErpReportViewer.aspx?rt=PreviewDeliverySchedule&id=' + voucherId, 'PreviewIV', parameter);

    },

    onEdit: function () {
        var grid = Ext.getCmp('deliverySchedule-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var status = grid.getSelectionModel().getSelected().get('Status');
        new Ext.erp.ux.deliverySchedule.Window({
            title: 'Edit Delivery Schedule',
            deliveryScheduleHeaderId: id,
            action: 'edit'
        }).show();
    },
    onSearchVoucher: function () {
        Ext.erp.ux.voucherSearch.Observable.on('searchvoucher', function (result) {
            result['mode'] = 'search';
            result['action'] = 'for schedule';
            var grid = Ext.getCmp('deliverySchedule-grid');
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.voucherSearch.Window({ title: 'Search Transactions' }).show();
    },
    customRenderer: function (value, metaData, record, rowIndex, colIndex, store) {

        if ( record.get("Customer") != null)
            return '<span style=color:blue>' + value + '</span>';
        else if (record.get("Status") == "Void")
            return '<span style=color:red>' + value + '</span>';
        else if (record.get("Status") == "Certified")
            return '<span style=color:black>' + value + '</span>';

        else
            return '<span style=color:black>' + value + '</span>';


    },
    customRendererForAmount: function (value, metaData, record, rowIndex, colIndex, store) {
        return '<span style=color:darkorange>' + Ext.util.Format.number(value, '0,000.00 ') + '</span>';
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.ux.deliverySchedule.Grid.superclass.afterRender.apply(this, arguments);
    },

});
Ext.reg('deliverySchedule-grid', Ext.erp.ux.deliverySchedule.Grid);




/**
* @desc      DeliverySchedule grid

* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.deliverySchedule
* @class     Ext.erp.ux.deliverySchedule.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.deliverySchedule.DateListGrid = function (config) {
    Ext.erp.ux.deliverySchedule.DateListGrid.superclass.constructor.call(this, Ext.apply({

        store: new Ext.data.GroupingStore({
            proxy: new Ext.data.DirectProxy({
                directFn: FreightOrder.GetAllScheduleHeader,
                paramsAsHash: false,
                paramOrder: 'start|limit|sort|dir|record',
            }),
            reader: new Ext.data.JsonReader({
                root: 'data',
                idProperty: 'Id',
                totalProperty: 'total',
                sortInfo: {
                    field: 'Date',
                    direction: 'ASC'
                },
                fields: ['Id', 'VoucherNumber', 'Item', 'Date', 'ATC', 'Customer', 'InvoiceNo', 'CustomerTelephone'],
            }),
            groupField: 'Date',
            sortInfo: {
                field: 'Date',
                direction: 'DESC'
            },
            remoteSort: true,
            listeners: {
                beforeLoad: function () { this.body.mask('Loading...', 'x-mask-loading'); },
                load: function () { this.body.unmask(); },
                loadException: function () { this.body.unmask(); },
                scope: this
            }
        }),
        view: new Ext.grid.GroupingView({
            forceFit: true,
            showGroupName: false,
            groupTextTpl: '{text}'
        }),



        id: 'deliverySchedule-dateListGrid',
        pageSize: 36,
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
            dataIndex: 'Item',
            header: 'Item',
            sortable: true,
            hidden: true,
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
            dataIndex: 'VoucherNumber',
            header: 'VoucherNumber',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'ATC',
            header: 'ATC',
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
            dataIndex: 'InvoiceNo',
            header: 'FS',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'CustomerTelephone',
            header: 'Telephone',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, ]
    }, config));
}
Ext.extend(Ext.erp.ux.deliverySchedule.DateListGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({action:'scheduled'}) };
        this.tbar = [{
            id: 'searchDeliverySchedule',
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearchVoucher
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'deliveryScheduleDateList-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.deliverySchedule.DateListGrid.superclass.initComponent.apply(this, arguments);
    },
    onSearchVoucher: function () {
        Ext.erp.ux.voucherSearch.Observable.on('searchvoucher', function (result) {
            result['mode'] = 'search';
            result['action'] = 'scheduled';
            var grid = Ext.getCmp('deliverySchedule-dateListGrid');
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.voucherSearch.Window({ title: 'Search Transactions' }).show();
    },
    customRenderer: function (value, metaData, record, rowIndex, colIndex, store) {

        if (record.get("Customer") != null)
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
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.ux.deliverySchedule.DateListGrid.superclass.afterRender.apply(this, arguments);
    },

});
Ext.reg('deliverySchedule-dateListGrid', Ext.erp.ux.deliverySchedule.DateListGrid);


/**
* @desc      PurchaseRequest grid

* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.deliverySchedule
* @class     Ext.erp.ux.deliverySchedule.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.deliverySchedule.CustomerGrid = function (config) {
    Ext.erp.ux.deliverySchedule.CustomerGrid.superclass.constructor.call(this, Ext.apply({

        store: new Ext.data.GroupingStore({
            proxy: new Ext.data.DirectProxy({
                directFn: FreightOrder.GetAllHeaderCustomerBalance,
                paramsAsHash: false,
                paramOrder: 'start|limit|sort|dir|record',
            }),
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total',
                sortInfo: {
                    field: 'Item',
                    direction: 'ASC'
                },
                fields: ['Id', 'Item', 'LastDeliveryDate', 'ItemId', 'RemainingBalance', 'ScheduledAmount', 'Customer', 'CustomerId'],
            }),
            groupField: 'Item',
            sortInfo: {
                field: 'Item',
                direction: 'ASC'
            },
            remoteSort: true,
            listeners: {
                beforeLoad: function () { this.body.mask('Loading...', 'x-mask-loading'); },
                load: function () { this.body.unmask(); },
                loadException: function () { this.body.unmask(); },
                scope: this
            }
        }),
        view: new Ext.grid.GroupingView({
            forceFit: true,
            showGroupName: false,
            groupTextTpl: '{text}'
        }),
        id: 'deliverySchedule-customerGrid',
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
           dataIndex: 'Item',
           header: 'Item',
           sortable: true,
           width: 100,
           menuDisabled: true,
           hidden:true,
       }, {
           dataIndex: 'Customer',
           header: 'Customer',
           sortable: true,
           width: 80,
           menuDisabled: true,
       },  {
           dataIndex: 'LastDeliveryDate',
           header: 'Last Delivery',
           sortable: true,
           width: 100,
           menuDisabled: true,
       },  {
           dataIndex: 'RemainingBalance',
           header: 'Remaining Balance',
           sortable: true,
           width: 100,
           menuDisabled: true,
       },{
           dataIndex: 'ScheduledAmount',
           header: 'Scheduled Quantity',
           sortable: true,
           width: 100,
           menuDisabled: true,
       },]
    }, config));
}
Ext.extend(Ext.erp.ux.deliverySchedule.CustomerGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [{
            id: 'searchdeliverySchedule',
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearchVoucher
        }, ];
        this.bbar = new Ext.PagingToolbar({
            id: 'deliverySchedulecustomerGrid-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.deliverySchedule.CustomerGrid.superclass.initComponent.apply(this, arguments);
    },
    onSearchVoucher: function () {
        Ext.erp.ux.voucherSearch.Observable.on('searchvoucher', function (result) {
            result['mode'] = 'search';
            var grid = Ext.getCmp('deliverySchedule-customerGrid');
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.voucherSearch.Window({ title: 'Search Transactions' }).show();
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.ux.deliverySchedule.CustomerGrid.superclass.afterRender.apply(this, arguments);
    },

});
Ext.reg('deliverySchedule-customerGrid', Ext.erp.ux.deliverySchedule.CustomerGrid);



/**
* @desc      deliverySchedule panel

* @copyright (c) 2010, 
* @date      September 2013
* @version   $Id: deliverySchedule.js, 0.1
* @namespace Ext.erp.ux.deliverySchedule
* @class     Ext.erp.ux.deliverySchedule.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.deliverySchedule.Panel = function (config) {
    Ext.erp.ux.deliverySchedule.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.deliverySchedule.Panel, Ext.Panel, {
    initComponent: function () {
        this.headerGrid = new Ext.erp.ux.deliverySchedule.Grid();
        this.customerGrid = new Ext.erp.ux.deliverySchedule.CustomerGrid();
        this.dateListGrid = new Ext.erp.ux.deliverySchedule.DateListGrid();


        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                collapsed: false,
                split: true,
                width: 500,
                minSize: 200,
                maxSize: 600,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.customerGrid]
            }, {
                region: 'center',
                border: false,
                layout: 'fit',
                items: [{
                    layout: 'vbox',
                    layoutConfig: {
                        type: 'hbox',
                        align: 'stretch',
                        pack: 'start'
                    },
                    defaults: {
                        flex: 1
                    },
                    items: [this.headerGrid]

                }]
            }, {
                region: 'east',
                border: true,
                collapsible: true,
                collapsed: true,
                split: true,
                width: 500,
                minSize: 200,
                maxSize: 600,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.dateListGrid]
            }, ]
        }];
        Ext.erp.ux.deliverySchedule.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('deliverySchedule-panel', Ext.erp.ux.deliverySchedule.Panel);
