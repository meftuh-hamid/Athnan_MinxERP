Ext.ns('Ext.erp.ux.notification');


Ext.erp.ux.notification.ReorderGrid = function (config) {
    Ext.erp.ux.notification.ReorderGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Item.GetExpiringReorder,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'Store', 'ItemCategory', 'Name', 'Code', 'ReorderLevel', 'RunningQuantity', 'Type'],
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
        id: 'itemReorderNotification-grid',
        pageSize: 15,
        stripeRows: true,
        border: true,
        columnLines: true,
        autoheight: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
             scope: this
        },
        columns: [new Ext.grid.RowNumberer(),
            {
            dataIndex: 'Store',
            header: 'Store',
            sortable: true,
            width: 120,
            menuDisabled: true,
        }, {
            dataIndex: 'Type',
            header: 'Type',
            sortable: true,
            width: 100,
            menuDisabled: true,
        }, {
            dataIndex: 'Name',
            header: 'Item',
            sortable: true,
            width: 140,
            menuDisabled: true,
        }, {
            dataIndex: 'Code',
            header: 'Item Code',
            sortable: true,
            width: 100,
            menuDisabled: true,
        }, {
            dataIndex: 'ReorderLevel',
            header: 'Reorder Level',
            sortable: true,
            width: 80,
            menuDisabled: true,
        }, {
            dataIndex: 'RunningQuantity',
            header: 'Current Balance',
            sortable: true,
            width: 80,
            menuDisabled: true,
        }
        ]
    }, config));
}
Ext.extend(Ext.erp.ux.notification.ReorderGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [
             {
                 xtype: 'button',
                 text: '',
                 iconCls: 'icon-excel',
                 handler:function(){
                     var result = {};
                     var search = Ext.getCmp('reorderNotification-searchText').getValue();
                     result['search'] = search;
                     window.open('Item/ReorderExportToExcel?' + Ext.urlEncode(result), '', '');
                 }
             }, {
            xtype: 'tbfill'
        }, {
            xtype: 'textfield',
            emptyText: 'Type Search text here and press "Enter"',
            submitEmptyText: false,
            enableKeyEvents: true,
            id:'reorderNotification-searchText',
            style: {
                borderRadius: '25px',
                padding: '0 10px',
                width: '200px'
            },
            listeners: {
                specialKey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        var grid = Ext.getCmp('itemReorderNotification-grid');

                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('itemReorderNotification-grid');

                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'itemReorderNotification-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.notification.ReorderGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });

        Ext.erp.ux.notification.ReorderGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('Documentnotification-reorderGrid', Ext.erp.ux.notification.ReorderGrid);

/**
* @desc      Document notification grid
* @author    Wondwosen Desalegn
* @copyright (c) 2010, 
* @date      November 01, 2010
* @namespace Ext.erp.ux.notification
* @class     Ext.erp.ux.notification.notificationGrid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.notification.Grid = function (config) {
    Ext.erp.ux.notification.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Notification.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DESC'
            },
            fields: ['Id', 'Title', 'Message', 'Type', 'Date', 'VoucherStatus', 'IsViewed'],
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
        id: 'notification-grid',
        pageSize: 15,
        stripeRows: true,
        border: true,
        columnLines: true,
        autoheight: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
            rowdblclick: function () {
                var id = this.getSelectionModel().getSelected().get('Id');

                var type = this.getSelectionModel().getSelected().get('Type');
                var title = this.getSelectionModel().getSelected().get('Title');
                var date = this.getSelectionModel().getSelected().get('Date');
                var message = this.getSelectionModel().getSelected().get('Message');
                var voucherStatus = this.getSelectionModel().getSelected().get('VoucherStatus');

                new Ext.erp.ux.notification.notificationWindow({
                    id: id,
                    type: type,
                    title: title,
                    date: date,
                    message: message,
                    voucherStatus: voucherStatus
                }).show();
            },
            scope: this
        },
        columns: [new Ext.grid.RowNumberer(), {
            dataIndex: 'Id', header: 'Id', sortable: true, hidden: true, width: 100, menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                return '<span style=color:green>' + value + '</span>';

            }
        }, {
            dataIndex: 'Type', header: 'Type', sortable: true, width: 150, menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.get("IsViewed") == true)
                    return '<span style=color:black>' + value + '</span>';
                else
                    return '<span style=color:green>' + value + '</span>';

            }
        }, {
            dataIndex: 'Title', header: 'Title', sortable: true, width: 150, menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.get("IsViewed") == true)
                    return '<span style=color:black>' + value + '</span>';
                else
                    return '<span style=color:green>' + value + '</span>';

            }
        }, {
            dataIndex: 'VoucherStatus', header: 'Action', sortable: true, hidden: false, width: 100, menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                return '<span style=color:green>' + value + '</span>';

            }
        }, {
            dataIndex: 'Date', header: 'Date', sortable: true, width: 100, menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.get("IsViewed") == true)
                    return '<span style=color:black>' + value + '</span>';
                else
                    return '<span style=color:green>' + value + '</span>';

            }
        }, {
            dataIndex: 'Message', header: 'Message', sortable: true, width: 370, menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.get("IsViewed") == true)
                    return '<span style=color:black>' + value + '</span>';
                else
                    return '<span style=color:green>' + value + '</span>';

            }
        }
        ]
    }, config));
}
Ext.extend(Ext.erp.ux.notification.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'notification-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.notification.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });

        Ext.erp.ux.notification.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('Documentnotification-grid', Ext.erp.ux.notification.Grid);


Ext.erp.ux.notification.notificationForm = function (config) {
    Ext.erp.ux.notification.notificationForm.superclass.constructor.call(this, Ext.apply({
        api: {
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '90%', labelStyle: 'text-align:right;', msgTarget: 'side'
        },
        id: 'notification-notificationForm',
        padding: 5,
        labelWidth: 120,
        // height: 400,
        border: false,
        fileUpload: true,

        isFormLoad: false,
        frame: false,
        autoScroll: true,
        baseCls: 'x-plain',
        items: [
            {
                xtype: 'textfield',
                name: 'Type',
                allowBlank: true,
                fieldLabel: 'Type',
                disabled: false,
                readOnly: true
            },
            {
                xtype: 'textfield',
                name: 'Title',
                allowBlank: true,
                fieldLabel: 'Title',
                disabled: false,
                readOnly: true
            },
             {
                 xtype: 'textfield',
                 name: 'VoucherStatus',
                 allowBlank: true,
                 fieldLabel: 'Action',
                 disabled: false,
                 readOnly: true
             },
            {
                xtype: 'textfield',
                name: 'Date',
                allowBlank: true,
                fieldLabel: 'Date',
                disabled: false,
                readOnly: true
            },
             {
                 name: 'Message',
                 xtype: 'textarea',
                 fieldLabel: 'Message',
                 width: 100,
                 readOnly: false,
                 allowBlank: true,
                 height: 200,
             }
        ]

    }, config));
}
Ext.extend(Ext.erp.ux.notification.notificationForm, Ext.form.FormPanel);
Ext.reg('notification-notificationForm', Ext.erp.ux.notification.notificationForm);
/**
* @desc      Item selection window
* @author    Girmaye Delelegn
* @copyright (c) 2014, 
* @date      oct 16, 2014
* @namespace Ext.erp.ux.notification
* @class     Ext.erp.ux.notification.notificationWindow
* @extends   Ext.Window
*/
Ext.erp.ux.notification.notificationWindow = function (config) {
    Ext.erp.ux.notification.notificationWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 500,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {

                Ext.getCmp('notification-notificationForm').getForm().findField('Type').setValue(this.type);
                Ext.getCmp('notification-notificationForm').getForm().findField('Title').setValue(this.title);
                Ext.getCmp('notification-notificationForm').getForm().findField('Date').setValue(this.date);
                Ext.getCmp('notification-notificationForm').getForm().findField('Message').setValue(this.message);
                Ext.getCmp('notification-notificationForm').getForm().findField('VoucherStatus').setValue(this.voucherStatus);

                Notification.UpdateViewStatus(this.id, function (result) {
                    Ext.getCmp('notification-paging').doRefresh();



                });
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.notification.notificationWindow, Ext.Window, {
    initComponent: function () {
        this.notificationForm = new Ext.erp.ux.notification.notificationForm();
        this.items = [this.notificationForm];
        Ext.erp.ux.notification.notificationWindow.superclass.initComponent.call(this, arguments);
    },
    onClose: function () {

        this.close();
    }
});
Ext.reg('notification-notificationWindow', Ext.erp.ux.notification.notificationWindow);



/**
* @desc      Notification panel
* @author    Wondwosen Desalegn
* @copyright (c) 2012, 
* @date      April 24, 2012
* @namespace Ext.erp.ux.notification
* @class     Ext.erp.ux.notification.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.notification.Panel = function (config) {
    Ext.erp.ux.notification.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.notification.Panel, Ext.Panel, {
    initComponent: function () {
        this.ReorderGrid = new Ext.erp.ux.notification.ReorderGrid();
        this.grid = new Ext.erp.ux.notification.Grid();

        this.items = [{
            xtype: 'portal',
            region: 'center',
            margins: '35 5 5 0',

            items: [{
                columnWidth: .50,
                style: 'padding:10px 0 10px 10px',
                items: [{
                    title: 'Notification',
                    layout: 'fit',
                    height: 300,
                    items: [this.grid]
                }]
            }, {
                columnWidth: .50,
                style: 'padding:10px 0 10px 10px',
                items: [{
                    title: 'Items To Be Reordered',
                    layout: 'fit',
                    height: 300,
                    items: [this.ReorderGrid]
                }]
            }

            ]
        }];

        Ext.erp.ux.notification.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('notification-panel', Ext.erp.ux.notification.Panel);

