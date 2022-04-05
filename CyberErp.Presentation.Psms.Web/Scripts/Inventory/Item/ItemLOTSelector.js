/// <reference path="Item.js" />
Ext.ns('Ext.erp.ux.itemLOTSelector');
/**
* @desc      Item selection window
* @author    Meftuh Mohammed
* @copyright (c) 2019, Cybersoft
* @date      oct 16, 2019
* @namespace Ext.erp.ux.itemLOTSelector
* @class     Ext.erp.ux.itemLOTSelector.Window
* @extends   Ext.Window
*/
Ext.erp.ux.itemLOTSelector.Window = function (config) {
    Ext.erp.ux.itemLOTSelector.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 650,
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
                var lOTItemGrid = store.recordType;
                this.itemStore.each(function (item) {

                        var p = new lOTItemGrid({
                            Id: item.get('Id'),
                            ItemId: item.get('ItemId'),
                            ItemLOTId: item.get('ItemLOTId'),
                            StoreId: item.get('StoreId'),
                            Number: item.get('Number'),
                            Quantity: item.get('Quantity'),
                            AvailableQuantity: item.get('AvailableQuantity'),
                            Remark: item.get('Remark'),
                        });
                        var count = store.getCount();
                        store.insert(count, p);
                    });  
            }
        }
    }, config));
}
Ext.extend(Ext.erp.ux.itemLOTSelector.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.itemLOTSelector.Grid({
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
        Ext.erp.ux.itemLOTSelector.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

         var selectionGrid = this.grid;
        var store = selectionGrid.getStore();
        var gridDatastore = this.targetGrid.lOTStore;
        this.removeOldRecord();
        if (this.issuedQuantity != store.sum('Quantity'))
        {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "LOT Items count must be equal to Issued Quantity",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        store.each(function (item) {
            var errorMessage = "";
            if (item.get('Quantity') < 0) {
                errorMessage = "quantity should be filled,must be greater than zero";            
            } else if (item.get('Quantity') > item.get('AvailableQuantity'))
            {
                errorMessage = "quantity should not be greater than available quantity ";
            }
            if (errorMessage!="") {
                Ext.MessageBox.show({
                    title: 'error',
                    msg: errorMessage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
            var index = gridDatastore.findExact("ItemLOTId", item.get('Id'))
            if (index == -1) {

                var p = new Ext.data.Record({
                    Id: item.get('Id'),
                    ItemId: item.get('ItemId'),
                    StoreId: item.get('StoreId'),
                    ItemLOTId: item.get('ItemLOTId'),
                    Number: item.get('Number'),
                    Quantity: item.get('Quantity'),
                    AvailableQuantity: item.get('AvailableQuantity'),
                    Remark: item.get('Remark'),
                });
                var count = gridDatastore.getCount();
                gridDatastore.insert(count, p);
            }

        });
        this.close();
    },
    removeOldRecord: function () {
        var gridDatastore = this.targetGrid.lOTStore;

        this.itemStore.each(function (item) {
            gridDatastore.remove(item);
        });
    },
    onClose: function () {

        this.close();
    }
});
Ext.reg('itemLOTSelector-Window', Ext.erp.ux.itemLOTSelector.Window);
/**
* @desc      Item Selection grid
* @author    Meftuh Mohammed
* @copyright (c) 2014, Cybersoft
* @date      oct 16, 2014
* @namespace Ext.erp.ux.itemLOTSelector
* @class     Ext.erp.ux.itemLOTSelector.Grid
* @extends   Ext.grid.GridPanel
*/
var selModel = new Ext.grid.RowSelectionModel();

Ext.erp.ux.itemLOTSelector.Grid = function (config) {
    Ext.erp.ux.itemLOTSelector.Grid.superclass.constructor.call(this, Ext.apply({
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
            fields: ['Id', 'ItemLOTId', 'StoreId', 'ItemId', 'Number', 'Quantity', 'AvailableQuantity', 'Remark'],
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
            id: 'itemLOTSelector-grid',
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
            dataIndex: 'Number',
            header: 'LOT Number',
            sortable: true,
            width: 120,
            menuDisabled: true,
             },{
                 dataIndex: 'AvailableQuantity',
                 header: 'Available Qnty',
                 sortable: true,
                 width: 120,
                 menuDisabled: true,
             },
             {
             dataIndex: 'Quantity',
             header: 'Quantity',
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
Ext.extend(Ext.erp.ux.itemLOTSelector.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {

        this.store.baseParams = { record: Ext.encode({ itemCategoryId:''}) };
        this.tbar = [
           {
               xtype: 'button',
               text: 'Remove',
               iconCls: 'icon-exit',
               disabled: false,
               handler: function () {
                   var grid = Ext.getCmp('itemLOTSelector-grid');

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
                    var detailGrid = Ext.getCmp('itemLOTSelector-grid');
                    new Ext.erp.ux.itemLOT.PickerWindow({
                        title:'Search Item LOT',
                        targetGrid:detailGrid,
                        storeId: detailGrid.storeId,
                        itemId: detailGrid.itemId
                    }).show();
                }
            },
        ];
        this.bbar = [];
        Ext.erp.ux.itemLOTSelector.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        Ext.erp.ux.itemLOTSelector.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('itemLOTSelector-grid', Ext.erp.ux.itemLOTSelector.Grid);