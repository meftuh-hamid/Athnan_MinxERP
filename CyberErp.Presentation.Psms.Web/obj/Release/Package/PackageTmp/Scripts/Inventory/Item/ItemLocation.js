Ext.ns('Ext.erp.ux.itemLocation');

/**
* @desc      itemLocation form
* @author    Henock Melisse
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.itemLocation
* @class     Ext.erp.ux.itemLocation.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.itemLocation.Form = function (config) {
    Ext.erp.ux.itemLocation.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: ItemLocation.Get,
            submit: ItemLocation.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'ItemLocation-form',
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
            name: 'LocationId',
            xtype: 'hidden'
        }, {
            name: 'LocationBinId',
            xtype: 'hidden'
        }, {
            name: 'CreatedAt',
            xtype: 'hidden'
        }, {
            name: 'ItemName',
            fieldLabel: 'Item',
            xtype: 'textfield',
            width: 100,
            allowBlank: false,
            disabled: true
        }, {
            hiddenName: 'Store',
            xtype: 'combo',
            id: 'comboItemLocation',
            fieldLabel: 'Store',
            typeAhead: false,
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
            valueField: 'Id',
            displayField: 'Name',
            pageSize: 10,
            listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('ItemLocation-form').getForm();
                    form.findField('StoreId').setValue(rec.id);
                    Ext.getCmp('itemLocation-location').store.baseParams = { storeId: rec.id };
                    Ext.getCmp('itemLocation-location').getStore().load({
                        params: {
                            start: 0,
                            limit: this.pageSize
                        }
                    });
                }
            }
        }, {
            hiddenName: 'Location',
            xtype: 'combo',
            id: 'itemLocation-location',
            fieldLabel: 'Location',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            forceSelection: true,
            emptyText: '---Select---',
            allowBlank: true,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                paramOrder: ['storeId'],
                api: {
                    read: Psms.GetStoreLocation
                }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('ItemLocation-form').getForm();
                    form.findField('LocationId').setValue(rec.id);
                    Ext.getCmp('itemLocation-locationBin').store.baseParams = { locationId: rec.id };
                    Ext.getCmp('itemLocation-locationBin').getStore().load({
                        params: {
                            start: 0,
                            limit: this.pageSize
                        }
                    });

                }
            }
        }, {
            hiddenName: 'LocationBin',
            xtype: 'combo',
            id: 'itemLocation-locationBin',
            fieldLabel: 'Location Bin',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            forceSelection: true,
            emptyText: '---Select---',
            allowBlank: true,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                paramOrder: ['locationId'],
                api: {
                    read: Psms.GetStoreLocationBin
                }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('ItemLocation-form').getForm();
                    form.findField('LocationBinId').setValue(rec.id);
                }
            }
        }, {
            name: 'Quantity',
            fieldLabel: 'Quantity',
            xtype: 'numberfield',
            Value: 0,
            width: 100,
            allowBlank: false,
            allowNegative: false,
            allowDecimals: true,
            decimalPrecision: 4
        }, ]
    }, config));
};
Ext.extend(Ext.erp.ux.itemLocation.Form, Ext.form.FormPanel);
Ext.reg('itemLocation-form', Ext.erp.ux.itemLocation.Form);

/**
* @desc      itemLocation registration form host window
* @author    Henock Melisse
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.itemLocation
* @class     Ext.erp.ux.itemLocation.Window
* @extends   Ext.Window
*/
Ext.erp.ux.itemLocation.Window = function (config) {
    Ext.erp.ux.itemLocation.Window.superclass.constructor.call(this, Ext.apply({
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
                var form = Ext.getCmp('ItemLocation-form').getForm();
                form.findField('ItemId').setValue(this.itemId);
                form.findField('ItemName').setValue(this.itemName);
                if (typeof this.itemLocationId != "undefined" && this.itemLocationId != "") {
                    this.form.load({
                        params: { id: this.itemLocationId },
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
Ext.extend(Ext.erp.ux.itemLocation.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.itemLocation.Form();
        Ext.getCmp('itemLocation-location').store.baseParams = { storeId:'{00000000-0000-0000-0000-000000000000}' };
        Ext.getCmp('itemLocation-locationBin').store.baseParams = { locationId: '{00000000-0000-0000-0000-000000000000}' };

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
        Ext.erp.ux.itemLocation.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var form = this.form.getForm();
        var itemName = form.findField('ItemName').getValue();
        var itemId=form.findField('ItemId').getValue();
        var store = form.findField('Store').getValue();
        var storeId = form.findField('StoreId').getValue();
        var location = form.findField('Location').getValue();
        var locationId = form.findField('LocationId').getValue();

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
                Ext.getCmp('ItemLocation-form').getForm().reset();

                var form = Ext.getCmp('ItemLocation-form').getForm();
                form.findField('ItemName').setRawValue(itemName);
                form.findField('ItemId').setValue(itemId);
                form.findField('Store').setRawValue(store);
                form.findField('StoreId').setValue(storeId);
                form.findField('Location').setRawValue(location);
                form.findField('LocationId').setValue(locationId);
                 Ext.getCmp('itemLocation-paging').doRefresh();
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
Ext.reg('item-window', Ext.erp.ux.itemLocation.Window);

/**
* @desc      itemLocation ItemGrid
* @author    Henock Melisse
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.itemLocation
* @class     Ext.erp.ux.itemLocation.ItemGrid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.itemLocation.ItemGrid = function (config) {
    Ext.erp.ux.itemLocation.ItemGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Item.GetAll,
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
                beforeLoad: function () { Ext.getCmp('itemLocation-ItemGrid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('itemLocation-ItemGrid').body.unmask(); },
                loadException: function () { Ext.getCmp('itemLocation-ItemGrid').body.unmask(); },
                scope: this
            }
        }),
        id: 'itemLocation-ItemGrid',
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
Ext.extend(Ext.erp.ux.itemLocation.ItemGrid, Ext.grid.GridPanel, {
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
                        var grid = Ext.getCmp('itemLocation-ItemGrid');
                        var tree = Ext.getCmp('itemLocation-tree');
                        if (tree.selectedUnitId == 0) {
                            Ext.MessageBox.show({
                                title: 'Select',
                                msg: 'You must first select Item Category.',
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO,
                                scope: this
                            });
                            return;
                        }
                        var itemCategoryId = tree.selectedUnitId;
                        grid.store.baseParams['record'] = Ext.encode({ itemCategoryId: itemCategoryId, searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize} });
                    }
                },
                Keyup: function (field, e) {
                    var tree = Ext.getCmp('itemLocation-tree');
                    var grid = Ext.getCmp('itemLocation-ItemGrid');
                    var itemCategoryId = tree.selectedUnitId;
                    if (field.getValue() == '') {
                        grid.store.baseParams['record'] = Ext.encode({ itemCategoryId: itemCategoryId, searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize} });
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'itemLocation-itemgridpaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.itemLocation.ItemGrid.superclass.initComponent.apply(this, arguments);
    },
    loadStore: function () {
        var itemLocationGrid = Ext.getCmp('itemLocation-grid');
        var itemLocationStore = itemLocationGrid.getStore();
        var itemId = 0;
        if (this.getSelectionModel().hasSelection()) {
            itemId = this.getSelectionModel().getSelected().get('Id');
        }
        itemLocationStore.baseParams = { record: Ext.encode({ itemId: itemId }) };
        itemLocationStore.load({
            params: { start: 0, limit: 30 }
        });
    }
});
Ext.reg('itemLocation-ItemGrid', Ext.erp.ux.itemLocation.ItemGrid);

var sm = new Ext.grid.CheckboxSelectionModel({
    clicksToEdit: 1,
    checkOnly: true,
    singleSelect: false
})
/**
* @desc      itemLocation Grid
* @author    Henock Melisse
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.itemLocation
* @class     Ext.erp.ux.itemLocation.Grid
* @extends   Ext.grid.GridPanel
*/
var itemLocationSelectionModel = new Ext.grid.CheckboxSelectionModel({
});
Ext.erp.ux.itemLocation.Grid = function (config) {
    Ext.erp.ux.itemLocation.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.GroupingStore({
            proxy: new Ext.data.DirectProxy({
                directFn: ItemLocation.GetLocation,
                paramsAsHash: false,
                paramOrder: 'start|limit|sort|dir|record',
            }),
            reader: new Ext.data.JsonReader({
                root: 'data',
                idProperty: 'Id',
                totalProperty: 'total',
                sortInfo: {
                    field: 'StoreWithLocation',
                    direction: 'ASC'
                },
                fields: ['Id', 'Store', 'Location', 'LocationBin', 'StoreWithLocation', 'Quantity'],
            }),
            groupField: 'StoreWithLocation',
            sortInfo: {
                field: 'StoreWithLocation',
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
        id: 'itemLocation-grid',
        pageSize: 10,
        stripeRows: true,
        border: false,
        columnLines: true,
        clicksToEdit: 1,

        sm: itemLocationSelectionModel,
         viewConfig: {
    },
         columns: [itemLocationSelectionModel, {
        dataIndex: 'Id',
        header: 'Id',
        sortable: true,
        hidden: true,
        width: 100,
        menuDisabled: true
    }, {
        dataIndex: 'StoreWithLocation',
        header: 'StoreWithLocation',
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
    }, {
        dataIndex: 'Location',
        header: 'Location',
        sortable: true,
        width: 100,
        menuDisabled: true
    }, {
        dataIndex: 'LocationBin',
        header: 'Location Bin',
        sortable: true,
        width: 100,
        menuDisabled: true
    }, {
        dataIndex: 'Quantity',
        header: 'Quantity',
        sortable: true,
        width: 150,
        menuDisabled: true,
        editor: {
            xtype: 'numberfield',
            allowBlank: false
        }
    },]
}, config));
}
Ext.extend(Ext.erp.ux.itemLocation.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'button',
            text: 'Add To Location',
            id: 'addToLocation',
            iconCls: 'icon-add',
            handler: this.onAdd,
            disabled: !Ext.erp.ux.Reception.getPermission('Item Location', 'CanAdd'),

        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Update',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Item Location', 'CanEdit'),

            handler: this.onUpdateClick
        },{
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Delete',
            iconCls: 'icon-delete',
            disabled: !Ext.erp.ux.Reception.getPermission('Item Location', 'CanDelete'),

            handler: this.onDeleteClick
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'itemLocation-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.store.Grid.superclass.initComponent.apply(this, arguments);
    },
    onAdd: function () {
        var grid = Ext.getCmp('itemLocation-ItemGrid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var itemId = grid.getSelectionModel().getSelected().get('Id');
        var itemName = grid.getSelectionModel().getSelected().get('Name');
        new Ext.erp.ux.itemLocation.Window({
            itemLocationId: '',
            itemId: itemId,
            itemName: itemName,
            title: 'Add ' + itemName + ' to Location'
        }).show();
    },
    onUpdateClick: function () {

        var gridDetail = Ext.getCmp('itemLocation-grid');
        var selectedRows = gridDetail.getSelectionModel().getSelections();

        var itemLocationIds = '';
        var quantities = '';

        if (selectedRows.length <= 0) {
            Ext.Msg.alert('Unable To Finish', 'Please check the box');
            return;
        }
    
        for (var i = 0; i < selectedRows.length; i++) {

            if (selectedRows[i].get("Quantity") < 0 || selectedRows[i].get("Quantity") == null) {
                Ext.Msg.alert('Unable To Finish', 'Please enter appropriate value for Quantity!');
                return;
            }
            if (i < selectedRows.length - 1) {
                itemLocationIds = itemLocationIds + selectedRows[i].get("Id") + ';';
                quantities = quantities + selectedRows[i].get("Quantity") + ';';
              }
            else {
                itemLocationIds = itemLocationIds + selectedRows[i].get("Id");
                quantities = quantities + selectedRows[i].get("Quantity");
                           
            }
        }

        parameterToSend = itemLocationIds + ':' + quantities ;

        ItemLocation.Edit(parameterToSend, function (result) {

            if (result.success = true) {
                Ext.MessageBox.show({
                    title: 'Success',
                    msg: result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });
                Ext.getCmp('itemLocation-grid').getSelectionModel().clearSelections();
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
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('itemLocation-grid');
        var settingId = grid.getSelectionModel().getSelected().get('Id');

        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected record',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            animEl: 'delete',
            fn: function (btn) {
                if (btn == 'ok') {
                    ItemLocation.Delete(settingId, function (result) {
                        if (result.success) {
                            Ext.getCmp('itemLocation-paging').doRefresh();
                        }
                        else {
                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: result.data,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            });
                        }
                    }, this);
                }
            }
        });
    },
});
Ext.reg('itemLocation-Grid', Ext.erp.ux.itemLocation.Grid);

/**
* @desc      ItemCategory tree
* @author    Henock Melisse
* @copyright (c) 2011, Cybersoft
* @date      December 01, 2011
* @namespace Ext.erp.ux.item
* @class     Ext.erp.ux.item.Tree
* @extends   Ext.tree.TreePanel
*/
Ext.erp.ux.itemLocation.Tree = function (config) {
    Ext.erp.ux.itemLocation.Tree.superclass.constructor.call(this, Ext.apply({
        id: 'itemLocation-tree',
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
                var itemGrid = Ext.getCmp('itemLocation-ItemGrid');
                var selectedUnit = node.attributes.id == 'root-unit' ? '' : '[' + node.attributes.text + ']';
                Ext.getCmp('selected-unit').setValue(selectedUnit);
                itemGrid.store.baseParams['record'] = Ext.encode({ itemCategoryId: node.id });
                itemGrid.store.baseParams['loadMode'] = 'simple';
                itemGrid.store.load({ params: { start: 0, limit: itemGrid.pageSize } });
                Ext.getCmp('itemLocation-grid').getStore().removeAll();

            },
            contextmenu: function (node, e) {
                node.select();
                node.getOwnerTree().selectedUnitTypeId = node.attributes.id == 'root-unit' ? 0 : node.attributes.unitTypeId;
                node.getOwnerTree().selectedUnitId = node.attributes.id == 'root-unit' ? 0 : node.attributes.id;
                var selectedUnit = node.attributes.id == 'root-unit' ? '' : '[' + node.attributes.text + ']';
                Ext.getCmp('selected-unit').setValue(selectedUnit);
                var itemGrid = Ext.getCmp('itemLocation-ItemGrid');
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
Ext.extend(Ext.erp.ux.itemLocation.Tree, Ext.tree.TreePanel, {
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
                Ext.getCmp('itemLocation-tree').expandAll();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'collapse-all-item',
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function () {
                Ext.getCmp('itemLocation-tree').collapseAll();
            }
        }];
        Ext.erp.ux.itemLocation.Tree.superclass.initComponent.call(this, arguments);
    }
});
Ext.reg('itemLocation-tree', Ext.erp.ux.itemLocation.Tree);


/**
* @desc      itemLocation panel
* @author    Henock Melisse
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.itemLocation
* @class     Ext.erp.ux.itemLocation.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.itemLocation.Panel = function (config) {
    Ext.erp.ux.itemLocation.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'itemLocation-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.itemLocation.Panel, Ext.Panel, {
    initComponent: function () {
        this.itemTree = new Ext.erp.ux.itemLocation.Tree();
        this.itemGrid = new Ext.erp.ux.itemLocation.ItemGrid();
        this.grid = new Ext.erp.ux.itemLocation.Grid();
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
        Ext.erp.ux.itemLocation.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('itemLocation-panel', Ext.erp.ux.itemLocation.Panel);
