/// <reference path="Item.js" />
Ext.ns('Ext.erp.ux.voucherApproval');
/**
* @desc      Item selection window
* @author    Meftuh Mohammed
* @copyright (c) 2019, Cybersoft
* @date      oct 16, 2019
* @namespace Ext.erp.ux.voucherApproval
* @class     Ext.erp.ux.voucherApproval.Window
* @extends   Ext.Window
*/
Ext.erp.ux.voucherApproval.Window = function (config) {
    Ext.erp.ux.voucherApproval.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 450,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
}
Ext.extend(Ext.erp.ux.voucherApproval.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.voucherApproval.Grid({
         transactionId: this.transactionId
        });
        this.items = [this.grid];
        this.bbar = [ {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.erp.ux.voucherApproval.Window.superclass.initComponent.call(this, arguments);
    },
    onClose: function () {

        this.close();
    }
});
Ext.reg('voucherApproval-Window', Ext.erp.ux.voucherApproval.Window);
/**
* @desc      Item Selection grid
* @author    Meftuh Mohammed
* @copyright (c) 2014, Cybersoft
* @date      oct 16, 2014
* @namespace Ext.erp.ux.voucherApproval
* @class     Ext.erp.ux.voucherApproval.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.voucherApproval.Grid = function (config) {
    Ext.erp.ux.voucherApproval.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
           directFn: VoucherWorkFlow.GetAllApproval,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Response', 'Date', 'Status'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('voucherApproval-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('voucherApproval-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('voucherApproval-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'voucherApproval-grid',
        selectedUnitTypeId: 0,
        pageSize: 10,
        height: 250,
        stripeRows: true,
        border: false,
        columnLines: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
           // forceFit: true,
            autoFill: true
        },
        columns: [{
                        dataIndex: 'Name',
                        header: 'Name',
                        sortable: true,
                        width: 120,
                        menuDisabled: true
                    }, {
                        dataIndex: 'Date',
                        header: 'Date',
                        sortable: true,
                        width: 80,
                        menuDisabled: true
                    }, {
                        dataIndex: 'Status',
                        header: 'Status',
                        sortable: true,
                        width: 80,
                        menuDisabled: true
                    }, {
                        dataIndex: 'Response',
                        header: 'Response',
                        sortable: true,
                        width: 200,
                        menuDisabled: true,
                        editor: {
                            xtype: 'textarea',
                            allowBlank: false
                        }
                    },
        ]
    }, config));
}
Ext.extend(Ext.erp.ux.voucherApproval.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
       this.store.baseParams = { record: Ext.encode({ voucherId: this.transactionId }) };
        Ext.erp.ux.voucherApproval.Grid.superclass.initComponent.apply(this, arguments);
    },
   
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.voucherApproval.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('voucherApproval-Grid', Ext.erp.ux.voucherApproval.Grid);
