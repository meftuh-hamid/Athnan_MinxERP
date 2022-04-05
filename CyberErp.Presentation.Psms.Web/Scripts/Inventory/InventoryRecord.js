Ext.ns('Ext.erp.ux.inventoryRecord');

/**
* @desc      Purchase Request registration form
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      November 19, 2013
* @namespace Ext.erp.ux.inventoryRecord
* @class     Ext.erp.ux.inventoryRecord.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.inventoryRecord.Form = function (config) {
    Ext.erp.ux.inventoryRecord.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: window.InventoryRecord.Get,
            submit: window.InventoryRecord.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '98%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'inventoryRecord-form',
        padding: 5,
        labelWidth: 120,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'StoreId',
            xtype: 'hidden'
        }, {
            hiddenName: 'ClosingFiscalYearId',
            xtype: 'combo',
            fieldLabel: 'Closing Fiscal Year',
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
                api: { read: Psms.GetFiscalYear }
            }),
            valueField: 'Id',
            displayField: 'Name'
        }, {
            hiddenName: 'NewFiscalYearId',
            xtype: 'combo',
            fieldLabel: 'New Fiscal Year',
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
                api: { read: Psms.GetFiscalYear }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                select: function (cmb, rec, idx) {
                }
            }
        }, {
            name: 'ClosingDate',
            xtype: 'datefield',
            fieldLabel: 'Closing Date',
            altFormats: 'c',
            editable: true,
            anchor: '98%',
            allowBlank: false,
            maxValue: (new Date()).format('m/d/Y')
        }, {
            name: 'UsePhysical',
            xtype: 'checkbox',
            allowBlank: true,
            checked: false,
            boxLabel: 'Use Physical Qty as Closing Qty'
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.inventoryRecord.Form, Ext.form.FormPanel);
Ext.reg('inventoryRecord-form', Ext.erp.ux.inventoryRecord.Form);

/**
* @desc      Inventory Record form host window
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      January 27, 2011
* @namespace Ext.erp.ux.inventoryRecord
* @class     Ext.erp.ux.inventoryRecord.Window
* @extends   Ext.Window
*/
Ext.erp.ux.inventoryRecord.Window = function (config) {
    Ext.erp.ux.inventoryRecord.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 400,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        id: 'inventoryRecordWindow',
        listeners: {
            show: function () {
                var storeId = this.storeId;
                Ext.getCmp('inventoryRecord-form').getForm().findField('StoreId').setValue(storeId);
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.inventoryRecord.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.inventoryRecord.Form();
        this.items = [this.form];
        this.bbar = [{
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
        Ext.erp.ux.inventoryRecord.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        if (!this.form.getForm().isValid()) return;
        var grid = Ext.getCmp('inventoryRecord-grid');
        var form = Ext.getCmp('inventoryRecord-form');
        var rec = '';
        var store = grid.getStore();
        var resultdata;
        var physicalnotfilled = false;
        var selectedRows = grid.getSelectionModel().getSelections();
        for (var i = 0; i < selectedRows.length; i++) {

                rec = rec + selectedRows[i].get("Id") + ':' +
                            selectedRows[i].get("PhysicalQuantity") + ':' +
                            selectedRows[i].get("RunningQuantity") + ':' +
                            selectedRows[i].get("ItemId") + ':' +
                            selectedRows[i].get("UnitCost") + ';';
      }

        Ext.MessageBox.show({
            title: 'Confirmation',
            msg: "Once you proceed with this you can't undo it. Are you sure you want to close inventory for the selected store!",
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.INFO,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                        form.getForm().submit({
                            waitMsg: 'Please wait...',
                            params: { record: Ext.encode({ checkedInventories: rec }) },
                            success: function (form, action) {
                                Ext.getCmp('inventoryRecord-form').getForm().reset();
                                Ext.getCmp('inventoryRecord-paging').doRefresh();
                                grid.getSelectionModel().deselectRange(0, grid.pageSize);
                                Ext.getCmp('inventoryRecordWindow').close();
                                Ext.MessageBox.show({
                                    title: 'Success',
                                    msg: action.result.data,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.INFO,
                                    scope: this
                                });
                            },
                            failure: function (form, action) {
                                Ext.MessageBox.show({
                                    title: 'Failure',
                                    msg: action.result.data,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.ERROR,
                                    scope: this
                                });
                                Ext.getCmp('inventoryRecord-form').getForm().reset();
                            },
                            scope: this
                        });
                }
            }
        });
    },
    formSubmit: function (rec, physicalQuantity) {
        var form = Ext.getCmp('inventoryRecord-form');
        var grid = Ext.getCmp('inventoryRecord-grid');
        form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ checkedInventories: rec }) },
            success: function () {
                Ext.getCmp('inventoryRecord-form').getForm().reset();
                Ext.getCmp('inventoryRecord-paging').doRefresh();
                grid.getSelectionModel().deselectRange(0, grid.pageSize);
                Ext.getCmp('inventoryRecordWindow').close();
            },
            failure: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Failure',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                Ext.getCmp('inventoryRecord-form').getForm().reset();
                Ext.getCmp('inventoryRecord-paging').doRefresh();
            },
            scope: this,
            params: {
                record: rec,
                record1: Ext.encode({ physicalQuantity: physicalQuantity })
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('inventoryRecord-window', Ext.erp.ux.inventoryRecord.Window);

var inventorySelectionModel = new Ext.grid.CheckboxSelectionModel({
    clicksToEdit: 1,
    checkOnly: true,
    singleSelect: false
})

/**
* @desc      Inventory Record grid
* @author    Tewodros Wondimu
* @copyright (c) 2011, Cybersoft
* @date      January 27, 2011
* @namespace Ext.erp.ux.inventoryRecord
* @class     Ext.erp.ux.inventoryRecord.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.inventoryRecord.Grid = function (config) {
    Ext.erp.ux.inventoryRecord.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: InventoryRecord.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            clickToEdit: 1,
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'ItemId', 'StoreId', 'ItemCategory', 'Item', 'ItemCode', 'Store', 'ExpireyDate', 'UnitCost', 'FiscalYearId', 'FiscalYear', 'ExpiredQuantity', 'BeginingQuantity', 'DamagedQuantity', 'RunningQuantity', 'CommittedQuantity', 'AvailableQuantity', 'PhysicalQuantity', 'ClosingQuantity', 'TotalCost', 'Remark', 'IsClosed'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('inventoryRecord-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('inventoryRecord-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('inventoryRecord-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'inventoryRecord-grid',
        clicksToEdit: 1,
        pageSize: 1000,
        storeId: 0,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: inventorySelectionModel,
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        columns: [inventorySelectionModel, {
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'IsClosed',
            header: 'Closed',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value) 
                    return '<img src="Content/images/app/yes.png"/>';
                else
                    return '<img src="Content/images/app/no.png"/>';
            }
        }, {
            dataIndex: 'ItemCategory',
            header: 'Item Category',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Item',
            header: 'Description',
            sortable: true,
            width: 300,
            menuDisabled: true
        }, {
            dataIndex: 'ItemCode',
            header: 'Item Code',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Store',
            header: 'Store',
            sortable: true,
            width: 100,
            hidden:true,
            menuDisabled: true
        },  {
            dataIndex: 'FiscalYear',
            header: 'Fiscal Year',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'BeginingQuantity',
            header: 'Begining',
            sortable: true,
            width: 120,
            menuDisabled: true,
            editor: {
                xtype: 'numberfield',
                allowBlank: false
            }
        }, {
            dataIndex: 'RunningQuantity',
            header: 'Running',
            sortable: true,
            width: 120,
            menuDisabled: true
        }, {
            dataIndex: 'CommittedQuantity',
            header: 'Committed',
            sortable: true,
            width: 150,
            menuDisabled: true
        },  {
            dataIndex: 'DamagedQuantity',
            header: 'Damaged',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'ExpiredQuantity',
            header: 'Expired',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'AvailableQuantity',
            header: 'Available',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'PhysicalQuantity',
            header: 'Physical',
            sortable: true,
            width: 150,
            menuDisabled: true,
            editor: {
                xtype: 'numberfield',
                allowBlank: false
            }
        }, {
            dataIndex: 'UnitCost',
            header: 'Unit Cost',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'TotalCost',
            header: 'Total Cost',
            sortable: true,
            width: 150,
            menuDisabled: true
        },]
    }, config));
}
Ext.extend(Ext.erp.ux.inventoryRecord.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.tbar = [
            {
                xtype: 'displayfield',
                value: 'Fiscal Year',
                style: 'font-weight:bold;'
            }, {
                hiddenName: 'FiscalYearId',
                id:'inventoryRecord-fiscalYear',
                xtype: 'combo',
                fieldLabel: 'Fiscal Year',
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
                    api: { read: Psms.GetFiscalYear }
                }),
                valueField: 'Id',
                displayField: 'Name',
                listeners: {
                    select: function (cmb, rec, idx) {
                        var tree = Ext.getCmp('inventoryRecord-tree');
                        var storeId = tree.selectedStoreId;                 
                        var grid = Ext.getCmp('inventoryRecord-grid');
                        grid.store.baseParams['record'] = Ext.encode({ storeId: storeId, fiscalYearId: rec.id });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });

                    }
                }
            }, {
            xtype: 'button',
            text: 'Save Physical Count',
            iconCls: 'icon-save',
            id: 'saveInventory',
            disabled: !Ext.erp.ux.Reception.getPermission('Inventory Record', 'CanAdd'),

            handler: this.onSave
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Import Blance',
            iconCls: 'icon-excel',
            disabled: false,
            handler: function () {
                var detailGrid = Ext.getCmp('item-grid');
                new Ext.erp.ux.documentAttachment.Window({
                    targetGrid: detailGrid,
                    type: "Item Balance"
                }).show();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Import Physical Balance',
            iconCls: 'icon-excel',
            disabled: false,
            handler: function () {
                var detailGrid = Ext.getCmp('item-grid');
                new Ext.erp.ux.documentAttachment.Window({
                    targetGrid: detailGrid,
                    type: "Physical Balance"
                }).show();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Close Inventory',
            iconCls: 'icon-permission',
            id: 'transferInventory',
            disabled: !Ext.erp.ux.Reception.getPermission('Inventory Record', 'CanAdd'),

            handler: this.onTransferInventory
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Delete',
            iconCls: 'icon-delete',
            hidden: false,
            disabled: !Ext.erp.ux.Reception.getPermission('Inventory Record', 'CanDelete'),
            handler: this.onDelete
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'textfield',
            emptyText: 'Type Search text here and press "Enter"',
            id:"inventroyRecord-searchText",
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
                        var tree = Ext.getCmp('inventoryRecord-tree');
                      
                        if (tree.selectedStoreId == 0 ) {
                            Ext.MessageBox.show({
                                title: 'Select',
                                msg: 'You must first select Store.',
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO,
                                scope: this
                            });
                            return;
                        }
                        var storeId = tree.selectedStoreId;
                        var grid = Ext.getCmp('inventoryRecord-grid');
                        var fiscalYearId = Ext.getCmp('inventoryRecord-fiscalYear').getValue();

                        grid.store.baseParams['record'] = Ext.encode({ storeId: storeId, searchText: field.getValue(), fiscalYearId: fiscalYearId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize} });
                    }
                },
                Keyup: function (field, e) {
                    var tree = Ext.getCmp('inventoryRecord-tree');
                    var storeId = tree.selectedStoreId;
                    var fiscalYearId = Ext.getCmp('inventoryRecord-fiscalYear').getValue();

                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('inventoryRecord-grid');
                        grid.store.baseParams['record'] = Ext.encode({ storeId: storeId, searchText: field.getValue(), fiscalYearId: fiscalYearId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize} });
                    }
                }
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'inventoryRecord-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.inventoryRecord.Grid.superclass.initComponent.apply(this, arguments);
    },
    onSave: function () {
        var grid = Ext.getCmp('inventoryRecord-grid');
        var rec = '';
        var store = grid.getStore();
        var selectedRows = grid.getSelectionModel().getSelections();
        for (var i = 0; i < selectedRows.length; i++) {
            rec = rec + selectedRows[i].get("Id") + ':' +
                        selectedRows[i].get("BeginingQuantity") + ':' +
                        selectedRows[i].get("PhysicalQuantity") + ';';
        }

        Ext.MessageBox.show({
            msg: 'Updating physical quantity, please wait...',
            progressText: 'Working on it...',
            width: 300,
            wait: true,
            waitConfig: { interval: 1000 }
        });
    
        InventoryRecord.SaveBeginningPhysical(rec, function (result) {
            if (result.success) {
                Ext.getCmp('inventoryRecord-paging').doRefresh();
                var grid = Ext.getCmp('inventoryRecord-grid');
                grid.getSelectionModel().deselectRange(0, grid.pageSize);

                Ext.MessageBox.show({
                    title: 'Success',
                    msg: result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });
            }
            else {
                Ext.MessageBox.show({
                    title: 'Failure',
                    msg: result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    },
    onTransferInventory: function () {
        var grid = Ext.getCmp('inventoryRecord-grid');
        var storeId = grid.storeId;
        if (storeId <= 0) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: "You must select a store to close inventory!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        new Ext.erp.ux.inventoryRecord.Window({
            title: 'Inventory Closing',
            storeId: storeId
        }).show();
    },
    onDelete: function () {

        var grid = Ext.getCmp('inventoryRecord-grid');
         var rec = '';
        var selectedRows = grid.getSelectionModel().getSelections();
        for (var i = 0; i < selectedRows.length; i++) {
                rec = rec + selectedRows[i].get("Id") + ';';
        }

        if (rec == '') {
            var msg = Ext.MessageBox;
            Ext.erp.ux.SystemMessageManager.show({
                title: 'Save Failed',
                msg: "One or more of the items should be selected",
                buttons: msg.OK,
                icon: msg.ERROR,
                cls: 'msgbox-critical',
                width: 400
            });
            return;
        }

        Ext.MessageBox.show({
            title: 'Confirmation',
            msg: "Once you proceed with this you can't undo it. Are you sure you want to delete inventory for the selected items!",
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.INFO,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    InventoryRecord.Delete(rec, function (result) {
                        Ext.getCmp('inventoryRecord-paging').doRefresh();
                        if (result.success) {
                            Ext.MessageBox.show({
                                title: 'Success',
                                msg: result.data,
                                buttons: Ext.Msg.OK,
                                scope: this
                            });
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
    onSearchInventory: function () {
        new Ext.erp.ux.inventoryRecord.InventoryWindow({
        }).show();
    },
    customRenderer: function (value, metaData, record, rowIndex, colIndex, store) {
        if (record.data.IsClosed) {
            return '<span style="color:green;">' + value + '</span>';
        }
        else {
            return '<span style="color:red;">' + value + '</span>';
        }
    }
});
Ext.reg('inventoryRecord-grid', Ext.erp.ux.inventoryRecord.Grid);



/**
* @desc      Inventory Record tree
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.inventoryRecord
* @class     Ext.erp.ux.inventoryRecord.Tree
* @extends   Ext.tree.TreePanel
*/
Ext.erp.ux.inventoryRecord.Tree = function (config) {
    Ext.erp.ux.inventoryRecord.Tree.superclass.constructor.call(this, Ext.apply({
        id: 'inventoryRecord-tree',
        loader: new Ext.tree.TreeLoader({
            directFn: Store.PopulateTree
        }),
        selectedStoreId: 0,
        selectedStoreTypeId: 0,
        border: false,
        rootVisible: true,
        lines: true,
        useArrows: true,
        animate: true,
        autoScroll: true,
        enableDD: true,
        containerScroll: true,
        stateful: false,
        root: {
            text: 'Stores',
            id: 'root-unit'
        },
        listeners: {
            click: function (node, e) {
                e.stopEvent();
                node.select();
                if (node.isExpandable()) {
                    node.reload();
                }
                node.getOwnerTree().selectedStoreTypeId = node.attributes.id == 'root-unit' ? 'root-unit' : node.attributes.unitTypeId;
                node.getOwnerTree().selectedStoreId = node.attributes.id;
                var storeGrid = Ext.getCmp('inventoryRecord-grid');
                var fiscalYearId = Ext.getCmp('inventoryRecord-fiscalYear').getValue();

                storeGrid.parentId = node.id;
                storeGrid.storeId = node.id;
                storeGrid.store.baseParams = { record: Ext.encode({ storeId: node.id, fiscalYearId: fiscalYearId }) };
                storeGrid.store.load({ params: { start: 0, limit: storeGrid.pageSize} });
            },
            contextmenu: function (node, e) {
                node.select();
                node.getOwnerTree().selectedStoreTypeId = node.attributes.id == 'root-unit' ? 'root-unit' : node.attributes.unitTypeId;
                node.getOwnerTree().selectedStoreId = node.attributes.id;
                var storeGrid = Ext.getCmp('inventoryRecord-grid');
                var fiscalYearId = Ext.getCmp('inventoryRecord-fiscalYear').getValue();

                storeGrid.storeId = node.id;
                storeGrid.store.baseParams = { record: Ext.encode({ storeId: node.id, fiscalYearId: fiscalYearId }) };
                storeGrid.store.load({ params: { start: 0, limit: storeGrid.pageSize} });
            },
            expand: function (p) {
                p.syncSize();
            }
        }
    }, config));
};
Ext.extend(Ext.erp.ux.inventoryRecord.Tree, Ext.tree.TreePanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            id: 'expand-all',
            iconCls: 'icon-expand-all',
            tooltip: 'Expand All',
            handler: function () {
                Ext.getCmp('inventoryRecord-tree').expandAll();
            }
        }, {
            xtype: 'button',
            id: 'collapse-all',
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function () {
                Ext.getCmp('inventoryRecord-tree').collapseAll();
            }
        }];
        Ext.erp.ux.inventoryRecord.Tree.superclass.initComponent.call(this, arguments);
    }
});
Ext.reg('inventoryRecord-tree', Ext.erp.ux.inventoryRecord.Tree);

/**
* @desc      Inventory Record panel
* @author    Tewodros Wondimu
* @copyright (c) 2011, Cybersoft
* @date      January 27, 2011
* @version   $Id: InventoryRecord.js, 0.1
* @namespace Ext.erp.ux.inventoryRecord
* @class     Ext.erp.ux.inventoryRecord.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.inventoryRecord.Panel = function (config) {
    Ext.erp.ux.inventoryRecord.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.inventoryRecord.Panel, Ext.Panel, {
    initComponent: function () {
        this.tree = new Ext.erp.ux.inventoryRecord.Tree();
        this.grid = new Ext.erp.ux.inventoryRecord.Grid();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                width: 300,
                minSize: 200,
                maxSize: 400,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.tree]
            }, {
                region: 'center',
                border: true,
                layout: 'fit',
                items: [this.grid]
            }]
        }];
        Ext.erp.ux.inventoryRecord.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('inventoryRecord-panel', Ext.erp.ux.inventoryRecord.Panel);