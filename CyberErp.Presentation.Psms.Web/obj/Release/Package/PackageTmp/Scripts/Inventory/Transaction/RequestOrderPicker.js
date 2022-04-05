/// <reference path="Item.js" />
Ext.ns('Ext.erp.ux.requestOrderPicker');
/**
* @desc      Item selection window
* @author    Meftuh Mohammed
* @copyright (c) 2019, Cybersoft
* @date      oct 16, 2019
* @namespace Ext.erp.ux.requestOrderPicker
* @class     Ext.erp.ux.requestOrderPicker.Window
* @extends   Ext.Window
*/
Ext.erp.ux.requestOrderPicker.Window = function (config) {
    Ext.erp.ux.requestOrderPicker.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 650,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
}
Ext.extend(Ext.erp.ux.requestOrderPicker.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.requestOrderPicker.Grid({
            voucherHeaderId:this.voucherHeaderId
        });
        this.items = [this.grid];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Select',
            iconCls: 'icon-accept',
            scope: this,
            handler: this.onSelect
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.erp.ux.requestOrderPicker.Window.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        var grid = Ext.getCmp('requestOrderPicker-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
      
        var requestOrderId = grid.getSelectionModel().getSelected().get('Id');
         
        var consumer = grid.getSelectionModel().getSelected().get('Consumer');
        var consumerId = grid.getSelectionModel().getSelected().get('ConsumerId');
        var orderType=consumer=="Store"?"Transfer Issue":"Store Issue";
       
        new Ext.erp.ux.requestOrder.Window({
            title: orderType + " Order",
            orderType: orderType,
            store: consumer,
            storeId:consumerId,
            requestOrderHeaderId:requestOrderId,
            action:'orderAtReceive'
       
        }).show();
        this.close();
    },
    onClose: function () {

        this.close();
    }
});
Ext.reg('requestOrderPicker-Window', Ext.erp.ux.requestOrderPicker.Window);
/**
* @desc      Item Selection grid
* @author    Meftuh Mohammed
* @copyright (c) 2014, Cybersoft
* @date      oct 16, 2014
* @namespace Ext.erp.ux.requestOrderPicker
* @class     Ext.erp.ux.requestOrderPicker.Grid
* @extends   Ext.grid.GridPanel
*/
var requestOrderPickerSelectModel = new Ext.grid.RowSelectionModel({
});


Ext.erp.ux.requestOrderPicker.Grid = function (config) {
    Ext.erp.ux.requestOrderPicker.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Receive.GetRequestOrder,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },

            fields: ['Id', 'StoreId', 'Store', 'RequestedDate', 'VoucherNumber', 'OrderedBy', 'ConsumerType', 'Consumer', 'ConsumerId', 'Requester', 'IsRedirected', 'StatusId', 'Status'],
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
        id: 'requestOrderPicker-grid',
        pageSize: 10,
        height: 280,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: requestOrderPickerSelectModel,
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'VoucherNumber',
            header: 'SR No',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'RequestedDate',
            header: 'Requested Date',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Requester',
            header: 'Requested By',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ConsumerType',
            header: 'Consumer Type',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Consumer',
            header: 'Consumer',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Requester',
            header: 'Requested By',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'OrderedBy',
            header: 'Ordered By',
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
};
Ext.extend(Ext.erp.ux.requestOrderPicker.Grid, Ext.grid.GridPanel, {
    initComponent: function () {

        this.store.baseParams = { record: Ext.encode({ voucherHeaderId: this.voucherHeaderId }) };

        this.bbar = new Ext.PagingToolbar({
            id: 'requestOrderPicker-itemSelectionPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.requestOrderPicker.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getSelectionModel().clearSelections();
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.requestOrderPicker.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('requestOrderPicker-grid', Ext.erp.ux.requestOrderPicker.Grid);
