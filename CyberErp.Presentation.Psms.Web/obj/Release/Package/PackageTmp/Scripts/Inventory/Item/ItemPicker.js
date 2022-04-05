/// <reference path="Item.js" />
Ext.ns('Ext.erp.ux.itemPicker');
/**
* @desc      Item selection window
* @author    Meftuh Mohammed
* @copyright (c) 2019, Cybersoft
* @date      oct 16, 2019
* @namespace Ext.erp.ux.itemPicker
* @class     Ext.erp.ux.itemPicker.Window
* @extends   Ext.Window
*/
Ext.erp.ux.itemPicker.Window = function (config) {
    Ext.erp.ux.itemPicker.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.erp.ux.itemPicker.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.itemPicker.Grid({
            storeId:this.storeId
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
        Ext.erp.ux.itemPicker.Window.superclass.initComponent.call(this, arguments);
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
                    ItemId: selectedItems[i].get('Id'),
                    Name: selectedItems[i].get('Name'),
                    ItemName: selectedItems[i].get('Name'),

                    Code: selectedItems[i].get('Code'),
                    MeasurementUnit: selectedItems[i].get('MeasurementUnit'),
                    Unit: selectedItems[i].get('MeasurementUnit'),
               
                    
                    UnitId: selectedItems[i].get('UnitId'),
                    IsSerialItem: selectedItems[i].get('IsSerialItem'),
                    IsLOTItem: selectedItems[i].get('IsLOTItem'),
                    ItemCategory: selectedItems[i].get('ItemCategory'),
                    Weight: selectedItems[i].get('Weight'),
                    TaxRateIds:selectedItems[i].get('TaxRateIds'),
                    TaxRateDescription:selectedItems[i].get('TaxRateDescription'),
                    TaxRate:selectedItems[i].get('TaxRate'),              
                    Tax: 0,
                    UnitCost: selectedItems[i].get('UnitCost'),
                    Supplier: selectedItems[i].get('Supplier'),
                    AvailableQuantity: selectedItems[i].get('AvailableQuantity'),
                    Quantity: 0,
                    PlanedQuantity: 0,
                    DamagedQuantity: 0,
                    ReceivedQuantity:0,
                    RemainingQuantity: 0,
                    BudgetedQuantity: 0,
                    SoldQuantity: 0,
                    AcceptedQuantity:0,
                    ReturnedQuantity:0,
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
Ext.reg('itemPicker-Window', Ext.erp.ux.itemPicker.Window);
/**
* @desc      Item Selection grid
* @author    Meftuh Mohammed
* @copyright (c) 2014, Cybersoft
* @date      oct 16, 2014
* @namespace Ext.erp.ux.itemPicker
* @class     Ext.erp.ux.itemPicker.Grid
* @extends   Ext.grid.GridPanel
*/
var itemPickerSelectModel = new Ext.grid.CheckboxSelectionModel({
});


Ext.erp.ux.itemPicker.Grid = function (config) {
    Ext.erp.ux.itemPicker.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Psms.GetPagedItem,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
           

            fields: ['Id', 'Name', 'Code', 'UnitCost', 'Supplier', 'UnitId', 'IsSerialItem', 'AvailableQuantity', 'IsLOTItem', 'TaxRateIds', 'TaxRateDescription', 'TaxRate', 'Weight', 'ItemCategory', 'ItemType', 'PartNumber', 'MeasurementUnit'],
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
        id: 'itemPicker-grid',
        pageSize: 10,
        height: 280,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: itemPickerSelectModel,
        columns: [

        itemPickerSelectModel, new Ext.grid.RowNumberer(), {
            dataIndex: 'Name',
            header: 'Item Name',
            sortable: true,
            width: 170,
            menuDisabled: true
        }, {
            dataIndex: 'Code',
            header: 'Code',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'PartNumber',
            header: 'Part Number',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ItemCategory',
            header: 'Item Category',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'AvailableQuantity',
            header: 'Available Quantity',
            sortable: true,
            width: 100,
            menuDisabled: true
        }
        ]
    }, config));
};
Ext.extend(Ext.erp.ux.itemPicker.Grid, Ext.grid.GridPanel, {
    initComponent: function () {

        this.store.baseParams = { record: Ext.encode({ itemCategoryId:'',itemTypeId:'',storeId:this.storeId}) };
        this.tbar = [
          {
              hiddenName: 'ItemCategory',
              xtype: 'combo',
              id: 'itemPicker-itemCategory',

              fieldLabel: 'Item Category',
              typeAhead: true,
              width: 100,
              hideTrigger: true,
              minChars: 2,
              listWidth: 280,
              emptyText: '---Type to Search---',
              mode: 'remote',
              allowBlank: false,
              tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
              store: new Ext.data.DirectStore({
                  reader: new Ext.data.JsonReader({
                      successProperty: 'success',
                      idProperty: 'Id',
                      root: 'data',
                      fields: ['Id', 'Name']
                  }),
                  autoLoad: true,
                  api: { read: Psms.GetItemCategoryBySearch }
              }),
              valueField: 'Name',
              displayField: 'Name',
              pageSize: 10, listeners: {
                  select: function (cmb, rec, idx) {
                      var itemTypeId = Ext.getCmp('itemPicker-itemType').getValue();
                      Ext.getCmp('itemPicker-grid').store.baseParams = { record: Ext.encode({ itemCategoryId: rec.id, itemTypeId: itemTypeId }) };

                      Ext.getCmp('itemPicker-grid').store.load({ params: { start: 0, limit: Ext.getCmp('itemPicker-grid').pageSize } });
                  }
              }
          }, {
              xtype: 'tbseparator'
          },  {
              id: 'itemPicker-itemType',
              xtype: 'combo',
              fieldLabel: 'item Type',
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
                  api: {
                      read: Psms.GetItemType
                  }
              }),
              valueField: 'Id',
              displayField: 'Name',
              listeners: {
                  select: function (cmb, rec, idx) {
                      var itemCategoryId = Ext.getCmp('itemPicker-itemCategory').getValue();
                      Ext.getCmp('itemPicker-grid').store.baseParams = { record: Ext.encode({ itemCategoryId: itemCategoryId, itemTypeId: rec.id, storeId: Ext.getCmp('itemPicker-grid').storeId }) };
                      Ext.getCmp('itemPicker-grid').store.load({ params: { start: 0, limit: Ext.getCmp('itemPicker-grid').pageSize } });
                  }
              }
          }, '->',
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
                        var grid = Ext.getCmp('itemPicker-grid');
                        var itemCategoryId = Ext.getCmp('itemPicker-itemCategory').getValue();
                        var itemTypeId = Ext.getCmp('itemPicker-itemType').getValue();
                        var storeId = grid.storeId;

                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), itemCategoryId: itemCategoryId, itemTypeId: itemTypeId, storeId: storeId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {

                        var grid = Ext.getCmp('itemPicker-grid');
                        var itemTypeId = Ext.getCmp('itemPicker-itemType').getValue();
                        var storeId = grid.storeId;

                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), itemCategoryId: itemCategoryId, itemTypeId: itemTypeId, storeId: storeId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }
        ];
        this.bbar = new Ext.PagingToolbar({
            id: 'itemPicker-itemSelectionPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.itemPicker.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getSelectionModel().clearSelections();
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.itemPicker.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('itemPicker-grid', Ext.erp.ux.itemPicker.Grid);
