/// <reference path="Item.js" />
Ext.ns('Ext.erp.ux.purchaseRequestSelector');
/**
* @desc      Item selection window
* @author    Meftuh Mohammed
* @copyright (c) 2019, Cybersoft
* @date      oct 16, 2019
* @namespace Ext.erp.ux.purchaseRequestSelector
* @class     Ext.erp.ux.purchaseRequestSelector.Window
* @extends   Ext.Window
*/
Ext.erp.ux.purchaseRequestSelector.Window = function (config) {
    Ext.erp.ux.purchaseRequestSelector.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 750,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                var grid = this.grid;
                var store = grid.getStore();
                var purchaseRequestDetailType = store.recordType;

                this.itemStore.each(function (item) {
           
                    var p = new purchaseRequestDetailType({
                        Id: item.get('Id'),
                        ItemId: item.get('ItemId'),
                        PurchaseRequestDetailId: item.get('PurchaseRequestDetailId'),
                        VoucherNumber: item.get('VoucherNumber'),
                        Name: item.get('Name'),
                        Code: item.get('Code'),
                        MeasurementUnit: item.get('MeasurementUnit'),
                        UnitId: item.get('UnitId'),
                        QuantityToProcess: item.get('QuantityToProcess'),
                        UnprocessedQuantity: item.get('UnprocessedQuantity'),
                        Remark: item.get('Remark'),
                        UnitCost: item.get('UnitCost'),
                    });
                    var count = store.getCount();
                    store.insert(count, p);
                });
            }
        }
    }, config));
}
Ext.extend(Ext.erp.ux.purchaseRequestSelector.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.purchaseRequestSelector.Grid({
            storeId: this.storeId,
            itemId: this.itemId
        });
        this.items = [this.grid];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Save',
            iconCls: 'icon-save',
            scope: this,
            handler: this.onSave
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.erp.ux.purchaseRequestSelector.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        var selectionGrid = this.grid;
        var store = selectionGrid.getStore();
        var gridDatastore = this.targetStore;
        this.removeOldRecord();

        store.each(function (item) {
            var errorMessage = "";
            if (item.get('QuantityToProcess') < 0) {
                errorMessage = "quantity should be filled,must be greater than zero";
            } else if (item.get('QuantityToProcess') > item.get('UnprocessedQuantity')) {
                errorMessage = "Quantity to Process should not be greater than remaining unprocessed quantity ";
            }
            if (errorMessage != "") {
                Ext.MessageBox.show({
                    title: 'error',
                    msg: errorMessage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
            var index = gridDatastore.findExact("PurchaseRequestDetailId", item.get('PurchaseRequestDetailId'));
            if (index == -1) {

                var p = new Ext.data.Record({
                    Id: item.get('Id'),
                    ItemId: item.get('ItemId'),
                    PurchaseRequestDetailId: item.get('PurchaseRequestDetailId'),
                    VoucherNumber: item.get('VoucherNumber'),
                    Name: item.get('Name'),
                    Code: item.get('Code'),
                    MeasurementUnit: item.get('MeasurementUnit'),
                    UnitId: item.get('UnitId'),
                    QuantityToProcess: item.get('QuantityToProcess'),
                    UnprocessedQuantity: item.get('UnprocessedQuantity'),
                    Remark: item.get('Remark'),
                    UnitCost: item.get('UnitCost'),
                });
                var count = gridDatastore.getCount();
                gridDatastore.insert(count, p);
            }

        });
        this.updateMainTargetGrid();
        this.close();
    },
    removeOldRecord: function () {
        var gridDatastore = this.targetStore;

        this.itemStore.each(function (item) {
            gridDatastore.remove(item);
        });
    },
    updateMainTargetGrid:function(){
        var gridDatastore = this.targetStore;
        var mainGridStore = this.targetGrid.getStore();
        var window = this;
        gridDatastore.each(function (item) {

            var index = mainGridStore.findExact("Name", item.get('Name'));
            if (index == -1) {
                var d = window.sumQuantity(gridDatastore.query("Name", item.get('Name')))
                var p = new Ext.data.Record({
                    ItemId: item.get('ItemId'),
                    Name: item.get('Name'),
                    Code: item.get('Code'),
                    MeasurementUnit: item.get('MeasurementUnit'),
                    UnitId: item.get('UnitId'),
                    QuantityToProcess: item.get('QuantityToProcess'),
                    Quantity: window.sumQuantity(gridDatastore.query("Name", item.get('Name'))),
                    RemainingQuantity:0,
                    Remark: item.get('Remark'),
                    UnitCost: item.get('UnitCost'),
                    Tax:0,
                });
                var count = mainGridStore.getCount();
                mainGridStore.insert(count, p);
            }
            else
            {
                var record = mainGridStore.getAt(index);
                var totalQuantity = window.sumQuantity(gridDatastore.query("Name", record.get('Name')));
                record.set('Quantity', totalQuantity);
                record.commit();
            }

        });
    },
    sumQuantity: function (mixedCollection) {
        var total = 0;
       mixedCollection.each(function (item) {
            total = total +parseFloat( item.get("QuantityToProcess"));
        });
        return total;
    },
    onClose: function () {

        this.close();
    }
});
Ext.reg('purchaseRequestSelector-Window', Ext.erp.ux.purchaseRequestSelector.Window);
/**
* @desc      Item Selection grid
* @author    Meftuh Mohammed
* @copyright (c) 2014, Cybersoft
* @date      oct 16, 2014
* @namespace Ext.erp.ux.purchaseRequestSelector
* @class     Ext.erp.ux.purchaseRequestSelector.Grid
* @extends   Ext.grid.GridPanel
*/
var selModel = new Ext.grid.RowSelectionModel();

Ext.erp.ux.purchaseRequestSelector.Grid = function (config) {
    Ext.erp.ux.purchaseRequestSelector.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            //  idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'PurchaseRequestDetailId', 'VoucherNumber', 'UnitCost', 'ItemId', 'Name', 'Code', 'UnitId', 'MeasurementUnit', 'QuantityToProcess', 'UnprocessedQuantity', 'Remark'],
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
        id: 'purchaseRequestSelector-grid',
        pageSize: 10,
        height: 280,
        stripeRows: true,
        columnLines: true,
        border: false,
        clicksToEdit: 1,
        sm: selModel,
        columns: [
         new Ext.grid.RowNumberer(),
         {
             dataIndex: 'VoucherNumber',
             header: 'PR No',
             sortable: true,
             width: 120,
             menuDisabled: true,
         }, {
             dataIndex: 'Name',
             header: 'Name',
             sortable: true,
             width: 170,
             menuDisabled: true,
         }, {
             dataIndex: 'Code',
             header: 'Code',
             sortable: true,
             width: 80,
             menuDisabled: true,
         }, {
             dataIndex: 'MeasurementUnit',
             header: 'Unit',
             sortable: true,
             width: 80,
             menuDisabled: true,
         }, {
             dataIndex: 'UnprocessedQuantity',
             header: 'Unprocessed Qty',
             sortable: true,
             width: 120,
             menuDisabled: true,
         },
         {
             dataIndex: 'QuantityToProcess',
             header: 'Qty To Process',
             sortable: true,
             width: 120,
             menuDisabled: true,
             editor: {
                 xtype: 'numberfield',
                 allowBlank: false
             },

         }, {
             dataIndex: 'Remark',
             header: 'Remark',
             sortable: true,
             width: 70,
             menuDisabled: true,

         },
        ]
    }, config));
};
Ext.extend(Ext.erp.ux.purchaseRequestSelector.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {

        this.store.baseParams = { record: Ext.encode({ itemCategoryId: '' }) };
        this.tbar = [
           {
               xtype: 'button',
               text: 'Remove',
               iconCls: 'icon-exit',
               disabled: false,
               handler: function () {
                   var grid = Ext.getCmp('purchaseRequestSelector-grid');

                   if (!grid.getSelectionModel().hasSelection())
                       return;

                   var selectedrecord = grid.getSelectionModel().getSelected();
                   grid.getStore().remove(selectedrecord);
               }
           }, '->',
            {
                xtype: 'button',
                text: 'Picker',
                iconCls: 'icon-picker',
                disabled: false,
                handler: function () {
                    var detailGrid = Ext.getCmp('purchaseRequestSelector-grid');
                    new Ext.erp.ux.purchaseRequestItemPicker.Window({
                        title: 'Search Purchase Request Item',
                        targetGrid: detailGrid,
                        storeId: detailGrid.storeId,
                        itemId: detailGrid.itemId
                    }).show();
                }
            },
        ];
        this.bbar = [];
        Ext.erp.ux.purchaseRequestSelector.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        Ext.erp.ux.purchaseRequestSelector.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('purchaseRequestSelector-grid', Ext.erp.ux.purchaseRequestSelector.Grid);