/// <reference path="Item.js" />
Ext.ns('Ext.erp.ux.itemBalancePicker');
/**
* @desc      Item selection window
* @author    Meftuh Mohammed
* @copyright (c) 2019, Cybersoft
* @date      oct 16, 2019
* @namespace Ext.erp.ux.itemBalancePicker
* @class     Ext.erp.ux.itemBalancePicker.Window
* @extends   Ext.Window
*/
Ext.erp.ux.itemBalancePicker.Window = function (config) {
    Ext.erp.ux.itemBalancePicker.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.erp.ux.itemBalancePicker.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.itemBalancePicker.Grid({
            itemId:this.itemId
        });
        this.items = [this.grid];
        this.bbar = [{
            xtype: 'tbfill'
        },  {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.erp.ux.itemBalancePicker.Window.superclass.initComponent.call(this, arguments);
    },
    onClose: function () {

        this.close();
    }
});
Ext.reg('itemBalancePicker-Window', Ext.erp.ux.itemBalancePicker.Window);
/**
* @desc      Item Selection grid
* @author    Meftuh Mohammed
* @copyright (c) 2014, Cybersoft
* @date      oct 16, 2014
* @namespace Ext.erp.ux.itemBalancePicker
* @class     Ext.erp.ux.itemBalancePicker.Grid
* @extends   Ext.grid.GridPanel
*/
var itemBalancePickerSelectModel = new Ext.grid.CheckboxSelectionModel({
});


Ext.erp.ux.itemBalancePicker.Grid = function (config) {
    Ext.erp.ux.itemBalancePicker.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Psms.GetPagedItemBalance,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
           

            fields: ['Id', 'Store', 'AvailableQuantity', 'CommittedQuantity', 'OrderedQuantity'],
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
        id: 'itemBalancePicker-grid',
        pageSize: 10,
        height: 280,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: itemBalancePickerSelectModel,
        columns: [

        itemBalancePickerSelectModel, new Ext.grid.RowNumberer(), {
            dataIndex: 'Store',
            header: 'Store',
            sortable: true,
            width: 170,
            menuDisabled: true
        }, {
            dataIndex: 'AvailableQuantity',
            header: 'Avalilble Quantity',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'CommittedQuantity',
            header: 'Committed Quantity',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'OrderedQuantity',
            header: 'Ordered Quantity',
            sortable: true,
            width: 100,
            menuDisabled: true
        }
        ]
    }, config));
};
Ext.extend(Ext.erp.ux.itemBalancePicker.Grid, Ext.grid.GridPanel, {
    initComponent: function () {

        this.store.baseParams = { record: Ext.encode({ itemId:this.itemId}) };
        this.tbar = ['->',
        {
            xtype: 'tbfill'
        }, {
            xtype: 'textfield',
            emptyText: 'Type Search text here and press   Enter',
            submitEmptyText: false,
            enableKeyEvents: true,
            style: {
                borderRadius: '25px',
                padding: '0 10px',
                width: '200px'
            },
            listeners: {
                specialKey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        var grid = Ext.getCmp('itemBalancePicker-grid');
                         var itemId = Ext.getCmp('itemBalancePicker-grid').itemId;

                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), itemId: itemId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {

                        var grid = Ext.getCmp('itemBalancePicker-grid');
                        var itemId = Ext.getCmp('itemBalancePicker-grid').itemId;

                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), itemId: itemId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }
        ];
        this.bbar = new Ext.PagingToolbar({
            id: 'itemBalancePicker-itemSelectionPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.itemBalancePicker.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getSelectionModel().clearSelections();
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.itemBalancePicker.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('itemBalancePicker-grid', Ext.erp.ux.itemBalancePicker.Grid);