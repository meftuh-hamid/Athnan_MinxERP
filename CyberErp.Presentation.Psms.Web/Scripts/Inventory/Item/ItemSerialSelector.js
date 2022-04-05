/// <reference path="Item.js" />
Ext.ns('Ext.erp.ux.itemSerialSelector');
/**
* @desc      Item selection window
* @author    Meftuh Mohammed
* @copyright (c) 2019, Cybersoft
* @date      oct 16, 2019
* @namespace Ext.erp.ux.itemSerialSelector
* @class     Ext.erp.ux.itemSerialSelector.Window
* @extends   Ext.Window
*/
Ext.erp.ux.itemSerialSelector.Window = function (config) {
    Ext.erp.ux.itemSerialSelector.Window.superclass.constructor.call(this, Ext.apply({
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
                var serialItemGrid= store.recordType;
                this.itemStore.each(function (item) {

                        var p = new serialItemGrid({
                            Id: item.get('Id'),
                            ItemId: item.get('ItemId'),
                            ItemSerialId: item.get('ItemSerialId'),
                            StoreId: item.get('StoreId'),
                            Number: item.get('Number'),
                            Description: item.get('Description'),
                            SN: item.get('SN'),
                            PlateNo: item.get('PlateNo'),
                            Remark: item.get('Remark'),
                        });
                        var count = store.getCount();
                        store.insert(count, p);
                    });  
            }
        }
    }, config));
}
Ext.extend(Ext.erp.ux.itemSerialSelector.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.itemSerialSelector.Grid({
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
        Ext.erp.ux.itemSerialSelector.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

         var selectionGrid = this.grid;
        var store = selectionGrid.getStore();
        var gridDatastore = this.targetGrid.serialStore;
        this.removeOldRecord();
        if (this.issuedQuantity!=store.getCount())
        {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "Serial Items count must be equal to Issued Quantity",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        store.each(function (item) {
            var index = gridDatastore.findExact("ItemSerialId", item.get('Id'))
            if (index == -1) {

                var p = new Ext.data.Record({
                    Id: item.get('Id'),
                    ItemId: item.get('ItemId'),
                    StoreId: item.get('StoreId'),
                    ItemSerialId: item.get('ItemSerialId'),
                    Number: item.get('Number'),
                    IsAvailable: item.get('IsAvailable'),
                    Description: item.get('Description'),
                    SN: item.get('SN'),
                    PlateNo: item.get('PlateNo'),
                    Remark: item.get('Remark'),
                });
                var count = gridDatastore.getCount();
                gridDatastore.insert(count, p);
            }

        });
        this.close();
    },
    removeOldRecord: function () {
        var gridDatastore = this.targetGrid.serialStore;

        this.itemStore.each(function (item) {
            gridDatastore.remove(item);
        });
    },
    onClose: function () {

        this.close();
    }
});
Ext.reg('itemSerialSelector-Window', Ext.erp.ux.itemSerialSelector.Window);
/**
* @desc      Item Selection grid
* @author    Meftuh Mohammed
* @copyright (c) 2014, Cybersoft
* @date      oct 16, 2014
* @namespace Ext.erp.ux.itemSerialSelector
* @class     Ext.erp.ux.itemSerialSelector.Grid
* @extends   Ext.grid.GridPanel
*/
var selModel = new Ext.grid.RowSelectionModel();

Ext.erp.ux.itemSerialSelector.Grid = function (config) {
    Ext.erp.ux.itemSerialSelector.Grid.superclass.constructor.call(this, Ext.apply({
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
            fields: ['Id', 'ItemSerialId', 'StoreId', 'ItemId', 'Number','Description', 'SN', 'PlateNo', 'IsAvailable', 'Remark'],
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
            id: 'itemSerialSelector-grid',
            pageSize: 10,
            height: 280,
            stripeRows: true,
            columnLines: true,
            border: false,
            sm: selModel,
            columns: [
             new Ext.grid.RowNumberer(),
             {
            dataIndex: 'Number',
            header: 'ETRE Code',
            sortable: true,
            width: 120,
            menuDisabled: true,
             },
              {
                  dataIndex: 'Description',
                  header: 'Description',
                  sortable: true,
                  width: 120,
                  menuDisabled: true,
              }, {
                  dataIndex: 'SN',
                  header: 'SN',
                  sortable: true,
                  width: 120,
                  menuDisabled: true,
              },
               {
                   dataIndex: 'PlateNo',
                   header: 'Plate No',
                   sortable: true,
                   width: 120,
                   menuDisabled: true,
               },
             {
             dataIndex: 'IsAvailable',
             header: 'Is Available?',
             sortable: true,
             width: 120,
             menuDisabled: true,
             renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                 if (value)
                     return '<img src="Content/images/app/accept.png"/>';
                 else
                     return '<img src="Content/images/app/cancel.png"/>';
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
Ext.extend(Ext.erp.ux.itemSerialSelector.Grid, Ext.grid.GridPanel, {
    initComponent: function () {

        this.store.baseParams = { record: Ext.encode({ itemCategoryId:''}) };
        this.tbar = [
           {
               xtype: 'button',
               text: 'Remove',
               iconCls: 'icon-exit',
               disabled: false,
               handler: function () {
                   var grid = Ext.getCmp('itemSerialSelector-grid');

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
                     var detailGrid = Ext.getCmp('itemSerialSelector-grid');
                        new Ext.erp.ux.itemSerial.PickerWindow({
                            title: 'Search Item Serial',
                            targetGrid: detailGrid,
                            storeId: detailGrid.storeId,
                            itemId: detailGrid.itemId
                        }).show();
                }
            }, 
        ];
        this.bbar = [];
        Ext.erp.ux.itemSerialSelector.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        Ext.erp.ux.itemSerialSelector.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('itemSerialSelector-grid', Ext.erp.ux.itemSerialSelector.Grid);