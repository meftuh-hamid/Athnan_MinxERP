Ext.ns('Ext.erp.ux.itemStore');

/**
* @desc      itemStore form
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.itemStore
* @class     Ext.erp.ux.itemStore.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.itemStore.Form = function (config) {
    Ext.erp.ux.itemStore.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: ItemStore.Get,
            submit: ItemStore.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'itemstore-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'FiscalYearId',
            xtype: 'hidden'
        }, {
            name: 'ItemId',
            xtype: 'hidden'
        }, {
            name: 'StoreId',
            xtype: 'hidden'
        }, {
            name: 'CreatedAt',
            xtype: 'hidden'
        },{
            hiddenName: 'ItemName',
            xtype: 'combo',
            fieldLabel: 'Item',
            typeAhead: false,
            hideTrigger: true,
            minChars: 2,
            listWidth: 280,
            allowBlank: true,
            mode: 'remote',
            tpl:
                    '<tpl for="."><div ext:qtip="{Name}" class="x-combo-list-item">' +
                        '<p><h6 class="w3-text-teal w3-small "><span> ' + '{Name}' + '</span></h6></p>' +
                        '<p><h6 class="w3-text-teal w3-small "><span> ' + '{Code}' + '-' + '{PartNumber}' + '</span></h6></p>' +
                    '</span></div></tpl>', store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            totalProperty: 'total',
                            root: 'data',
                            fields: ['Id', 'Name', 'Code', 'PartNumber']
                        }),
                        api: { read: Psms.GetItemBySearch }
                    }),
            valueField: 'Name',
            displayField: 'Name',
            pageSize: 10,
            listeners: {
                scope: this,
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('itemstore-form').getForm();
                    form.findField('ItemId').setValue(rec.id);
                }
            }
        }, {
            hiddenName: 'Store',
            xtype: 'combo',
            id: 'comboItemStore',
            fieldLabel: 'Store',
            typeAhead: true,
            hideTrigger: true,
            minChars: 2,
            listWidth: 280,
            mode: 'remote',
            tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' +
                    '<h3><span>{Name}</span></h3> {Code}</div></tpl>',
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    totalProperty: 'total',
                    root: 'data',
                    fields: ['Id', 'Name', 'Code']
                }),
                api: { read: Psms.GetStoreBySearch }
            }),
            valueField: 'Name',
            displayField: 'Name',
            pageSize: 10,
            listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('itemstore-form').getForm();
                    form.findField('StoreId').setValue(rec.id);
                }
            }
        }, {
            name: 'BeginingQuantity',
            fieldLabel: 'Beginning Balance',
            xtype: 'numberfield',
            Value: 0,
            width: 100,
            allowBlank: false,
            allowNegative: false,
            allowDecimals: true,
            decimalPrecision: 4
        }, {
            name: 'UnitCost',
            xtype: 'numberfield',
            fieldLabel: 'Unit Cost',
            Value: 0.00,
            width: 100,
            allowBlank: false,
            allowNegative: false,
            allowDecimals: true,
            decimalPrecision: 4
        }, {
            name: 'ReorderLevel',
            xtype: 'numberfield',
            fieldLabel: 'Reorder Level',
            width: 100,
            value:0,
            allowBlank: false,
            allowNegative: false,
            allowDecimals: true
        },]
    }, config));
};
Ext.extend(Ext.erp.ux.itemStore.Form, Ext.form.FormPanel);
Ext.reg('itemStore-form', Ext.erp.ux.itemStore.Form);

/**
* @desc      itemStore registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.itemStore
* @class     Ext.erp.ux.itemStore.Window
* @extends   Ext.Window
*/
Ext.erp.ux.itemStore.Window = function (config) {
    Ext.erp.ux.itemStore.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 500,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                var form = Ext.getCmp('itemstore-form').getForm();
                form.findField('ItemId').setValue(this.itemId);
                form.findField('ItemName').setValue(this.itemName);
                if (typeof this.itemStoreId != "undefined" && this.itemStoreId != "") {
                    this.form.load({
                        params: { id: this.itemStoreId },
                        success: function (form, action) {

                        },
                        failure: function (form, action) {
                        }
                    });
                }
            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.ux.itemStore.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.itemStore.Form();
        this.items = [this.form];
        this.bbar = ['->', {
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSave,
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        this.tools = [{
            id: 'refresh',
            qtip: 'Reset',
            handler: function () {
                this.form.getForm().reset();
            },
            scope: this
        }];
        Ext.erp.ux.itemStore.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var form = this.form.getForm();
        var itemName = form.findField('ItemName').getValue();
        var itemId=form.findField('ItemId').getValue();
       var storeId=form.findField('StoreId').getValue();
       var store=form.findField('Store').getValue();

        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function (option, response) {
                Ext.MessageBox.show({
                    title: 'Success',
                    msg: response.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });
                Ext.getCmp('itemstore-form').getForm().reset();

                var form = Ext.getCmp('itemstore-form').getForm();
             //   form.findField('ItemName').setRawValue(itemName);
             //   form.findField('ItemId').setValue(itemId); 
            form.findField('Store').setRawValue(store);
               form.findField('StoreId').setValue(storeId); 
          
                 Ext.getCmp('itemStore-paging').doRefresh();
            },
            failure: function (option, response) {
                Ext.MessageBox.show({
                    title: 'Failure',
                    msg: response.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('item-window', Ext.erp.ux.itemStore.Window);

/**
* @desc      itemStore ItemGrid
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.itemStore
* @class     Ext.erp.ux.itemStore.ItemGrid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.itemStore.ItemGrid = function (config) {
    Ext.erp.ux.itemStore.ItemGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ItemStore.GetItems,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code', 'MeasurementUnit', 'PartNumber'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('itemStore-ItemGrid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('itemStore-ItemGrid').body.unmask(); },
                loadException: function () { Ext.getCmp('itemStore-ItemGrid').body.unmask(); },
                scope: this
            }
        }),
        id: 'itemStore-ItemGrid',
        pageSize: 30,
        width: 400,
        stripeRows: true,
        border: true,
        columnLines: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: false,
            autoExpandColumn: 'Name',
            autoFill: true
        },
        listeners: {
            rowClick: function () {
                this.loadStore();
            },
            scope: this
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'Name',
            header: 'Description',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Code',
            header: 'Code',
            sortable: true,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'PartNumber',
            header: 'Part Number',
            sortable: true,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'MeasurementUnit',
            header: 'Unit of Measure',
            sortable: true,
            width: 80,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.itemStore.ItemGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'tbfill'
        }, {
            xtype: 'textfield',
            emptyText: 'Type Search text here and press "Enter"',
            submitEmptyText: false,
            enableKeyEvents: true,
            style: {
                borderRadius: '25px',
                padding: '0 10px',
                width: '300px'
            },
            listeners: {
                specialKey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        var grid = Ext.getCmp('itemStore-ItemGrid');
                        var tree = Ext.getCmp('itemStore-tree');
                      
                        var itemCategoryId = tree.selectedUnitId;
                        grid.store.baseParams['record'] = Ext.encode({ itemCategoryId: itemCategoryId, searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize} });
                    }
                },
                Keyup: function (field, e) {
                    var tree = Ext.getCmp('itemStore-tree');
                    var grid = Ext.getCmp('itemStore-ItemGrid');
                    var itemCategoryId = tree.selectedUnitId;
                    if (field.getValue() == '') {
                        grid.store.baseParams['record'] = Ext.encode({ itemCategoryId: itemCategoryId, searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize} });
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'itemStore-itemgridpaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.itemStore.ItemGrid.superclass.initComponent.apply(this, arguments);
    },
    loadStore: function () {
        var itemStoreGrid = Ext.getCmp('itemStore-grid');
        var itemStoreStore = itemStoreGrid.getStore();
        var itemId = 0;
        if (this.getSelectionModel().hasSelection()) {
            itemId = this.getSelectionModel().getSelected().get('Id');
        }
        itemStoreStore.baseParams = { record: Ext.encode({ itemId: itemId }) };
        itemStoreStore.load({
            params: { start: 0, limit: 30 }
        });
    }
});
Ext.reg('itemStore-ItemGrid', Ext.erp.ux.itemStore.ItemGrid);

var sm = new Ext.grid.CheckboxSelectionModel({
    clicksToEdit: 1,
    checkOnly: true,
    singleSelect: false
})
/**
* @desc      itemStore Grid
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.itemStore
* @class     Ext.erp.ux.itemStore.Grid
* @extends   Ext.grid.GridPanel
*/
var itemStoreSelectionModel = new Ext.grid.CheckboxSelectionModel({
});
Ext.erp.ux.itemStore.Grid = function (config) {
    Ext.erp.ux.itemStore.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ItemStore.GetStore,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'Store', 'Address', 'BeginningBalance', 'UnitCost', 'ExpireyDate', 'ReorderLevel', 'MaximumLevel', 'MinimumLevel', 'SafetyStock', 'LeadTime', 'OrderingCost', 'CarryingCost'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('itemStore-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('itemStore-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('itemStore-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'itemStore-grid',
        pageSize: 10,
        stripeRows: true,
        border: false,
        columnLines: true,
        clicksToEdit: 1,

        sm: itemStoreSelectionModel,
         viewConfig: {
    },
         columns: [itemStoreSelectionModel, {
        dataIndex: 'Id',
        header: 'Id',
        sortable: true,
        hidden: true,
        width: 100,
        menuDisabled: true
    }, new Ext.grid.RowNumberer(), {
        dataIndex: 'Store',
        header: 'Store',
        sortable: true,
        width: 100,
        menuDisabled: true
    },{
        dataIndex: 'BeginningBalance',
        header: 'Beginning Quantity',
        sortable: true,
        width: 120,
        menuDisabled: true,
        editor: {
            xtype: 'numberfield',
            allowBlank: false
        }
    }, {
        dataIndex: 'UnitCost',
        header: 'Unit Cost',
        sortable: true,
        width: 120,
        menuDisabled: true,
        editor: {
            xtype: 'numberfield',
            allowBlank: false
        }
    },  {
        dataIndex: 'ReorderLevel',
        header: 'Re-Order Level',
        sortable: true,
        width: 120,
        menuDisabled: true,
        editor: {
            xtype: 'numberfield',
            allowBlank: false
        }
    },]
}, config));
}
Ext.extend(Ext.erp.ux.itemStore.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'button',
            text: 'Add to Store',
            id: 'addToStore',
            iconCls: 'icon-add',
            handler: this.onAdd
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Update',
            iconCls: 'icon-add',
            handler: this.onUpdateClick
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'itemStore-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.store.Grid.superclass.initComponent.apply(this, arguments);
    },
    onAdd: function () {
        var grid = Ext.getCmp('itemStore-ItemGrid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var itemId = grid.getSelectionModel().getSelected().get('Id');
        var itemName = grid.getSelectionModel().getSelected().get('Name');
        new Ext.erp.ux.itemStore.Window({
            itemStoreId: '',
            itemId: itemId,
            itemName: itemName,
            title: 'Add ' + itemName + ' to Store'
        }).show();
    },
    onUpdateClick: function () {

        var gridDetail = Ext.getCmp('itemStore-grid');
        var selectedRows = gridDetail.getSelectionModel().getSelections();

        var inventoryIds = '';
        var beginningBalanceQtys = '';
        var unitCosts = '';
        var reorderLevels = '';
        var maximumLevels = '';
        var safetyStocks = '';
        var leadTime = '';
        var orderingCost = '';
        var carryingCost = '';
        var minimumLevels = '';
        var expireyDates = '';
        var parameterToSend;

        if (selectedRows.length <= 0) {
            Ext.Msg.alert('Unable To Finish', 'Please check the box');
            return;
        }
    
        for (var i = 0; i < selectedRows.length; i++) {

            if (selectedRows[i].get("BeginningBalance") == null) {
                Ext.Msg.alert('Unable To Finish', 'Please enter appropriate value for Beginning Balance!');
                return;
            }
            if (i < selectedRows.length - 1) {
                inventoryIds = inventoryIds + selectedRows[i].get("Id") + ';';
                beginningBalanceQtys = beginningBalanceQtys + selectedRows[i].get("BeginningBalance") + ';';
                unitCosts = unitCosts + selectedRows[i].get("UnitCost") + ';';
                reorderLevels = reorderLevels + selectedRows[i].get("ReorderLevel") + ';';
                maximumLevels = maximumLevels + selectedRows[i].get("MaximumLevel") + ';';
                safetyStocks = safetyStocks + selectedRows[i].get("SafetyStock") + ';';
                leadTime = leadTime + selectedRows[i].get("LeadTime") + ';';
                orderingCost = orderingCost + selectedRows[i].get("OrderingCost") + ';';
                carryingCost = carryingCost + selectedRows[i].get("CarryingCost") + ';';
                minimumLevels = minimumLevels + selectedRows[i].get("MinimumLevel") + ';';
                expireyDates = expireyDates + selectedRows[i].get("ExpireyDate") + ';';

            }
            else {
                inventoryIds = inventoryIds + selectedRows[i].get("Id");
                beginningBalanceQtys = beginningBalanceQtys + selectedRows[i].get("BeginningBalance");
                unitCosts = unitCosts + selectedRows[i].get("UnitCost");
                reorderLevels = reorderLevels + selectedRows[i].get("ReorderLevel");
                maximumLevels = maximumLevels + selectedRows[i].get("MaximumLevel");
                safetyStocks = safetyStocks + selectedRows[i].get("SafetyStock");
                leadTime = leadTime + selectedRows[i].get("LeadTime") + ';';
                orderingCost = orderingCost + selectedRows[i].get("OrderingCost") + ';';
                carryingCost = carryingCost + selectedRows[i].get("CarryingCost") + ';';
                minimumLevels = minimumLevels + selectedRows[i].get("MinimumLevel") + ';';
                expireyDates = expireyDates + selectedRows[i].get("ExpireyDate") + ';';

            }
        }

        parameterToSend = inventoryIds + ':' + beginningBalanceQtys + ':' + unitCosts + ':' + reorderLevels + ':' + maximumLevels + ':' + safetyStocks + ':' + leadTime + ':' + orderingCost + ':' + carryingCost + ':' + minimumLevels + ':' + expireyDates;

        ItemStore.Edit(parameterToSend, function (result) {

            if (result.success = true) {
                Ext.MessageBox.show({
                    title: 'Success',
                    msg: result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });
                Ext.getCmp('itemStore-grid').getSelectionModel().clearSelections();
            }
            else {
                Ext.MessageBox.show({
                    title: 'Failure',
                    msg: result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });
            }
        });
    }
});
Ext.reg('itemStore-Grid', Ext.erp.ux.itemStore.Grid);

/**
* @desc      ItemCategory tree
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      December 01, 2011
* @namespace Ext.erp.ux.item
* @class     Ext.erp.ux.item.Tree
* @extends   Ext.tree.TreePanel
*/
Ext.erp.ux.itemStore.Tree = function (config) {
    Ext.erp.ux.itemStore.Tree.superclass.constructor.call(this, Ext.apply({
        id: 'itemStore-tree',
        loader: new Ext.tree.TreeLoader({
            directFn: ItemCategory.PopulateTree
        }),
        selectedUnitId: 0,
        selectedUnitTypeId: 0,
        border: false,
        rootVisible: true,
        lines: true,
        autoScroll: true,
        stateful: false,
        root: {
            text: 'Item Categories',
            id: 'root-unit'
        },
        listeners: {
            click: function (node, e) {
                e.stopEvent();
                node.select();
                node.getOwnerTree().selectedUnitTypeId = node.attributes.id == 'root-unit' ? 0 : node.attributes.unitTypeId;
                node.getOwnerTree().selectedUnitId = node.attributes.id == 'root-unit' ? 0 : node.attributes.id;
                var itemGrid = Ext.getCmp('itemStore-ItemGrid');
                var selectedUnit = node.attributes.id == 'root-unit' ? '' : '[' + node.attributes.text + ']';
                Ext.getCmp('selected-unit').setValue(selectedUnit);
                itemGrid.store.baseParams['record'] = Ext.encode({ itemCategoryId: node.id });
                itemGrid.store.baseParams['loadMode'] = 'simple';
                itemGrid.store.load({ params: { start: 0, limit: itemGrid.pageSize } });
                Ext.getCmp('itemStore-grid').getStore().removeAll();

            },
            contextmenu: function (node, e) {
                node.select();
                node.getOwnerTree().selectedUnitTypeId = node.attributes.id == 'root-unit' ? 0 : node.attributes.unitTypeId;
                node.getOwnerTree().selectedUnitId = node.attributes.id == 'root-unit' ? 0 : node.attributes.id;
                var selectedUnit = node.attributes.id == 'root-unit' ? '' : '[' + node.attributes.text + ']';
                Ext.getCmp('selected-unit').setValue(selectedUnit);
                var itemGrid = Ext.getCmp('itemStore-ItemGrid');
                itemGrid.store.baseParams['record'] = Ext.encode({ itemCategoryId: node.id });
                itemGrid.store.baseParams['loadMode'] = 'simple';
                itemGrid.store.load({ params: { start: 0, limit: itemGrid.pageSize} });
            },
            expand: function (p) {
                p.syncSize();
            }
        }
    }, config));
}
Ext.extend(Ext.erp.ux.itemStore.Tree, Ext.tree.TreePanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'displayfield',
            id: 'selected-unit',
            style: 'font-weight: bold'
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            id: 'expand-all-item',
            iconCls: 'icon-expand-all',
            tooltip: 'Expand All',
            handler: function () {
                Ext.getCmp('itemStore-tree').expandAll();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'collapse-all-item',
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function () {
                Ext.getCmp('itemStore-tree').collapseAll();
            }
        }];
        Ext.erp.ux.itemStore.Tree.superclass.initComponent.call(this, arguments);
    }
});
Ext.reg('itemStore-tree', Ext.erp.ux.itemStore.Tree);


/**
* @desc      itemStore panel
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.itemStore
* @class     Ext.erp.ux.itemStore.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.itemStore.Panel = function (config) {
    Ext.erp.ux.itemStore.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'itemStore-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.itemStore.Panel, Ext.Panel, {
    initComponent: function () {
        this.itemTree = new Ext.erp.ux.itemStore.Tree();
        this.itemGrid = new Ext.erp.ux.itemStore.ItemGrid();
        this.grid = new Ext.erp.ux.itemStore.Grid();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                width: 250,
                minSize: 200,
                maxSize: 600,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.itemTree]
            }, {
                region: 'center',
                border: true,
                layout: 'fit',
                items: [{
                    layout: 'hbox',
                    layoutConfig: {
                        type: 'vbox',
                        align: 'stretch',
                        pack: 'start'
                    },
                    defaults: {
                        flex: 1
                    },
                    items: [this.itemGrid, this.grid]
                }]
            }]
        }];
        Ext.erp.ux.itemStore.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('itemStore-panel', Ext.erp.ux.itemStore.Panel);