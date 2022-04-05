/// <reference path="Item.js" />
Ext.ns('Ext.erp.ux.salesItemPicker');
/**
* @desc      Item selection window

* @copyright (c) 2019, 
* @date      oct 16, 2019
* @namespace Ext.erp.ux.salesItemPicker
* @class     Ext.erp.ux.salesItemPicker.Window
* @extends   Ext.Window
*/
Ext.erp.ux.salesItemPicker.Window = function (config) {
    Ext.erp.ux.salesItemPicker.Window.superclass.constructor.call(this, Ext.apply({
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
                Ext.getCmp('salesItemPicker-priceCategory').setValue(this.priceCategoryId);
                Ext.getCmp('salesItemPicker-priceGroup').setValue(this.priceGroupId);

            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.salesItemPicker.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.salesItemPicker.Grid({
            priceCategoryId: this.priceCategoryId,
            priceGorupId:this.priceGroupId
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
        Ext.erp.ux.salesItemPicker.Window.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {

        var targetgrid = this.targetGrid;
        var selectionGrid = this.grid;
        if (!selectionGrid.getSelectionModel().hasSelection()) return;
        var selectedItems = selectionGrid.getSelectionModel().getSelections();
        var gridDatastore = targetgrid.getStore();
        var item = gridDatastore.recordType;
        var isPriceChange = this.isPriceChange;
        for (var i = 0; i < selectedItems.length; i++) {
            var index = gridDatastore.findExact("ItemId", selectedItems[i].get('Id'))
            if (index == -1 || isPriceChange) {

                var p = new item({
                    ItemId: selectedItems[i].get('Id'),
                    PreviousPriceId: selectedItems[i].get('ItemPriceId'),
                    Name: selectedItems[i].get('Name'),
                    Code: selectedItems[i].get('Code'),
                    MeasurementUnit: selectedItems[i].get('MeasurementUnit'),
                    Unit: selectedItems[i].get('MeasurementUnit'),
                    UnitId: selectedItems[i].get('UnitId'),
                    PriceCategoryId: selectedItems[i].get('PriceCategoryId'),
                    PriceCategory: selectedItems[i].get('PriceCategory'),
                    PriceGroupId: selectedItems[i].get('PriceGroupId'),
                    PriceGroup: selectedItems[i].get('PriceGroup'),
                    UnitPrice: selectedItems[i].get('UnitPrice'),
                    IsSerialItem: selectedItems[i].get('IsSerialItem'),
                    IsLOTItem: selectedItems[i].get('IsLOTItem'),
                    ItemCategory: selectedItems[i].get('ItemCategory'),
                    IsTaxable: selectedItems[i].get('IsTaxable'),
                    Tax: 0,
                    UnitCost: 0,
                    Quantity: 0,
                    PlanedQuantity: 0,
                    DamagedQuantity: 0,
                    ReceivedQuantity:0,
                    RemainingQuantity: 0,
                    BudgetedQuantity: 0,
                    SoldQuantity: 0,
                    IsUsedItem: false,
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
Ext.reg('salesItemPicker-Window', Ext.erp.ux.salesItemPicker.Window);
/**
* @desc      Item Selection grid

* @copyright (c) 2014, 
* @date      oct 16, 2014
* @namespace Ext.erp.ux.salesItemPicker
* @class     Ext.erp.ux.salesItemPicker.Grid
* @extends   Ext.grid.GridPanel
*/
var salesItemPickerSelectModel = new Ext.grid.CheckboxSelectionModel({
});


Ext.erp.ux.salesItemPicker.Grid = function (config) {
    Ext.erp.ux.salesItemPicker.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Psms.GetPagedSalesItem,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },

          

            fields: ['Id', 'Name', 'Code', 'UnitId', 'IsSerialItem', 'IsLOTItem', 'IsTaxable', 'ItemCategory', 'PriceCategoryId', 'PriceCategory', 'ItemType', 'PartNumber', 'MeasurementUnit', 'PriceGroupId', 'PriceGroup', 'UnitPrice', 'RangeEndValue', 'RangeStartValue', 'VolumeRangeType', 'SalesPriceWithMinimumQuantity', 'AdjustedSellingPriceIncludingTax', 'ItemPriceId', 'PurchasePrice'],
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
        id: 'salesItemPicker-grid',
        pageSize: 10,
        height: 320,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: salesItemPickerSelectModel,
        columns: [

        salesItemPickerSelectModel, new Ext.grid.RowNumberer(), {
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
            dataIndex: 'UnitPrice',
            header: 'Unit Price',
            sortable: true,
            width: 100,
            menuDisabled: true
        }
        ]
    }, config));
};
Ext.extend(Ext.erp.ux.salesItemPicker.Grid, Ext.grid.GridPanel, {
    initComponent: function () {

        this.store.baseParams = { record: Ext.encode({ priceCategoryId: this.priceCategoryId, priceGroupId: this.priceGroupId }) };
        this.tbar = [
          {
              xtype: 'displayfield',
              value:"Price Category",
              style: 'font-weight: bold;font-size:12px;'
          }, {
              id: 'salesItemPicker-priceCategory',
              xtype: 'combo',
              fieldLabel: '',
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
                      read: Psms.GetPriceCategory
                  }
              }),
              valueField: 'Id',
              displayField: 'Name',
              listeners: {
                  select: function (cmb, rec, idx) {
                      Ext.getCmp('salesItemPicker-grid').loadData();
                  }
              }
          }, {
              xtype: 'tbseparator'
          }, {
              xtype: 'displayfield',
              value: "Price Group",
              style: 'font-weight: bold;font-size:12px;'
          }, {
              id: 'salesItemPicker-priceGroup',
              xtype: 'combo',
              fieldLabel: 'Price Group',
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
                      read: Psms.GetPriceGroup
                  }
              }),
              valueField: 'Id',
              displayField: 'Name',
              listeners: {
                  select: function (cmb, rec, idx) {
                      Ext.getCmp('salesItemPicker-grid').loadData();
                  }
              }
          }, {
              xtype: 'button',
              text: 'Balance',
              iconCls: 'icon-accept',
              disabled: false,
              handler: function () {
                  var detailGrid = Ext.getCmp('salesItemPicker-grid');
                  var itemId = detailGrid.getSelectionModel().getSelections()[0].get('Id');

                  new Ext.erp.ux.itemBalancePicker.Window({
                      targetGrid: detailGrid,
                      itemId: itemId
                  }).show();
              }
          },
             '->',
        {
            xtype: 'tbfill'
        }, {
            xtype: 'textfield',
            emptyText: 'Type Search text here and press   Enter',
            submitEmptyText: false,
            id:'itemPicker-searchtext',
            enableKeyEvents: true,
            style: {
                borderRadius: '25px',
                padding: '0 10px',
                width: '200px'
            },
            listeners: {
                specialKey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        Ext.getCmp('salesItemPicker-grid').loadData();
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                       Ext.getCmp('salesItemPicker-grid').loadData();
                    }
                }
            }
        }
        ];
        this.bbar = new Ext.PagingToolbar({
            id: 'salesItemPicker-itemSelectionPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.salesItemPicker.Grid.superclass.initComponent.apply(this, arguments);
    },
    loadData:function(){
        var grid = Ext.getCmp('salesItemPicker-grid');
        var priceCategoryId = Ext.getCmp('salesItemPicker-priceCategory').getValue();
        var priceGroupId = Ext.getCmp('salesItemPicker-priceGroup').getValue();
        var searchText = Ext.getCmp('itemPicker-searchtext').getValue();

        grid.store.baseParams['record'] = Ext.encode({ searchText: searchText, priceGroupId: priceGroupId, priceCategoryId: priceCategoryId });
        grid.store.load({ params: { start: 0, limit: grid.pageSize } });

    },
    afterRender: function () {
        this.getSelectionModel().clearSelections();
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.salesItemPicker.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('salesItemPicker-grid', Ext.erp.ux.salesItemPicker.Grid);