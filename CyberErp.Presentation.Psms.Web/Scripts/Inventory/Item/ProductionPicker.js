/// <reference path="Item.js" />
Ext.ns('Ext.erp.ux.productionPicker');
/**
* @desc      Item selection window

* @copyright (c) 2019, 
* @date      oct 16, 2019
* @namespace Ext.erp.ux.productionPicker
* @class     Ext.erp.ux.productionPicker.Window
* @extends   Ext.Window
*/
Ext.erp.ux.productionPicker.Window = function (config) {
    Ext.erp.ux.productionPicker.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 750,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
}
Ext.extend(Ext.erp.ux.productionPicker.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.productionPicker.Grid({
        });
        this.items = [this.grid];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Ok',
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
        Ext.erp.ux.productionPicker.Window.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {

        var targetgrid = this.targetGrid;
        var selectionGrid = this.grid;
        if (!selectionGrid.getSelectionModel().hasSelection()) return;
        var selectedItems = selectionGrid.getSelectionModel().getSelections();
        var gridDatastore = targetgrid.getStore();
        var item = gridDatastore.recordType;
      
        for (var i = 0; i < selectedItems.length; i++) {

            var index = gridDatastore.findExact("ItemId", selectedItems[i].get('Id'))
            if (index == -1) {

                var p = new item({
                    ProductionDeliveryDetailId:selectedItems[i].get('ProductionDeliveryDetailId'),
                    ItemId: selectedItems[i].get('ItemId'),
                    Name: selectedItems[i].get('Name'),
                    Code: selectedItems[i].get('Code'),
                    MeasurementUnit: selectedItems[i].get('MeasurementUnit'),
                    UnitId: selectedItems[i].get('UnitId'),
                    IsSerialItem: selectedItems[i].get('IsSerialItem'),
                    IsLOTItem: selectedItems[i].get('IsLOTItem'),
                    ItemCategory: selectedItems[i].get('ItemCategory'),

                    Tax: 0,
                    UnitCost: 0,
                    Quantity: selectedItems[i].get('Quantity'),
                    ReceivedQuantity: selectedItems[i].get('Quantity'),
                    PlanedQuantity: 0,
                    DamagedQuantity: 0,
                    RemainingQuantity: 0,
                    BudgetedQuantity: 0,
                    SoldQuantity: 0,
                    IsUsedItem:false,
                    Remark:''
                });

                var count = gridDatastore.getCount();
                gridDatastore.insert(count, p);
            }

        }
    },
    onClose: function () {

        this.close();
    }
});
Ext.reg('productionPicker-Window', Ext.erp.ux.productionPicker.Window);
/**
* @desc      Item Selection grid

* @copyright (c) 2014, 
* @date      oct 16, 2014
* @namespace Ext.erp.ux.productionPicker
* @class     Ext.erp.ux.productionPicker.Grid
* @extends   Ext.grid.GridPanel
*/
var productionPickerSelectModel = new Ext.grid.CheckboxSelectionModel({
});


Ext.erp.ux.productionPicker.Grid = function (config) {
    Ext.erp.ux.productionPicker.Grid.superclass.constructor.call(this, Ext.apply({

        store: new Ext.data.GroupingStore({
            proxy: new Ext.data.DirectProxy({
                directFn: Psms.GetPagedProductionItem,
                paramsAsHash: false,
                paramOrder: 'start|limit|sort|dir|record',
            }),
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total',
                sortInfo: {
                    field: 'PPNo',
                    direction: 'ASC'
                },
                fields: ['Id','ItemId', 'ProductionDeliveryDetailId', 'PRONO', 'PPNo', 'Assigned','Quantity', 'Code', 'Name', 'Color', 'ColorId', 'Size', 'UnitId', 'IsSerialItem', 'IsLOTItem', 'UnitCost', 'ItemCategory', 'ItemType', 'PartNumber', 'MeasurementUnit'],
            }),
            groupField: 'PPNo',
            sortInfo: {
                field: 'PPNo',
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
        id: 'productionPicker-grid',
        pageSize: 10,
        height: 380,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: productionPickerSelectModel,
        columns: [

        productionPickerSelectModel, new Ext.grid.RowNumberer(),
        {
            dataIndex: 'PPNo',
            header: 'PPNo',
            sortable: true,
            hidden:true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'PRONO',
            header: 'Production No',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Assigned',
            header: 'Assigned',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Code',
            header: 'Code',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 170,
            menuDisabled: true
        }, {
            dataIndex: 'Color',
            header: 'Color',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Size',
            header: 'Size',
            sortable: true,
            width: 100,
            menuDisabled: true
        },
        {
            dataIndex: 'Quantity',
            header: 'Quantity',
            sortable: true,
            width: 100,
            menuDisabled: true
        },
        ]
    }, config));
};
Ext.extend(Ext.erp.ux.productionPicker.Grid, Ext.grid.GridPanel, {
    initComponent: function () {

        this.store.baseParams = { record: Ext.encode({ itemCategoryId:'',itemTypeId:''}) };
        this.tbar = [ '->',
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
                        var grid = Ext.getCmp('productionPicker-grid');
                       
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {

                        var grid = Ext.getCmp('productionPicker-grid');
                        var itemTypeId = Ext.getCmp('productionPicker-itemType').getValue();

                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue()});
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }
        ];
        this.bbar = new Ext.PagingToolbar({
            id: 'productionPicker-itemSelectionPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.productionPicker.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getSelectionModel().clearSelections();
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.productionPicker.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('productionPicker-grid', Ext.erp.ux.productionPicker.Grid);