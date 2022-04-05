Ext.ns('Ext.erp.ux.store');

/**
* @desc      store form
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.store
* @class     Ext.erp.ux.store.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.store.Form = function (config) {
    Ext.erp.ux.store.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Store.Get,
            submit: Store.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'store-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'ParentId',
            xtype: 'hidden'
        }, {
            name: 'TypeId',
            xtype: 'hidden'
        }, {
            name: 'CostCenterId',
            xtype: 'hidden'
        }, {
            name: 'CreatedAt',
            xtype: 'hidden'
        }, {
            xtype: 'textfield',
            name: 'Parent',
            fieldLabel: 'Parent Store',
            allowBlank: false,
            disabled: true
        }, {
            name: 'Type',
            hiddenName: 'Type',
            xtype: 'combo',
            fieldLabel: 'Type',
            anchor: '95%',
            triggerAction: 'all',
            mode: 'local',
            width: 100,
            editable: false,
            typeAhead: true,
            forceSelection: true,
            selectOnFocus: true,
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
                api: { read: Psms.GetStoreType }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('store-form').getForm();
                    form.findField("TypeId").setValue(rec.id);
                },
            }
        }, {
            name: 'Name',
            xtype: 'textfield',
            fieldLabel: 'Name',
            width: 100,
            allowBlank: true
        }, {
            name: 'Code',
            xtype: 'textfield',
            fieldLabel: 'Code',
            width: 100,
            allowBlank: true
        },{
            xtype: 'textarea',
            name: 'Address',
            width: 100,
            hidden: false,
            fieldLabel: 'Address',
            allowBlank: true
        }]
    }, config));
};
Ext.extend(Ext.erp.ux.store.Form, Ext.form.FormPanel);
Ext.reg('store-form', Ext.erp.ux.store.Form);

/**
* @desc      Location registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.store
* @class     Ext.erp.ux.store.Window
* @extends   Ext.Window
*/
Ext.erp.ux.store.Window = function (config) {
    Ext.erp.ux.store.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 500,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                var tree = Ext.getCmp('store-tree');
                var node = tree.getNodeById(tree.selectedUnitId);
                var parent = node.attributes.text;
                if (this.mode == 'edit') {
                    this.form.getForm().load({ params: { id: this.storeId } });
                }
                this.form.getForm().findField('Parent').setValue(parent);
            }
        }
    }, config));
};
Ext.extend(Ext.erp.ux.store.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.store.Form({ mode: this.mode });
        this.items = [this.form];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Save',
            iconCls: 'icon-save',
            scope: this,
            handler: this.onStoreSave
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onStoreClose,
            scope: this
        }];
        this.tools = [{
            id: 'refresh',
            qtip: 'Reset',
            handler: function () {
                var form = Ext.getCmp('store-form').getForm();
                var parentId = form.findField('ParentId').getValue();
                var parent = form.findField('Parent').getValue();
                form.reset();
                form.findField('ParentId').setRawValue(parentId);
                form.findField('Parent').setRawValue(parent);
            },
            scope: this
        }];
        Ext.erp.ux.store.Window.superclass.initComponent.call(this, arguments);
    },
    onStoreSave: function () {
        if (!this.form.getForm().isValid()) return;
        if (this.parentId != 'root-unit') {
            this.form.getForm().findField('ParentId').setValue(this.parentId);
        }
        var tree = Ext.getCmp('store-tree');
        var parentNode = tree.getNodeById(tree.selectedUnitId);
        var mode = this.mode;
        var win = this;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                var form = Ext.getCmp('store-form').getForm();
                var parentId=form.findField('ParentId').getValue();
                var parent = form.findField('Parent').getValue();
                form.reset();
                form.findField('ParentId').setRawValue(parentId);
                form.findField('Parent').setRawValue(parent);
                Ext.getCmp('store-paging').doRefresh();
                form.findField('Id').setRawValue('');
                if (mode == 'add') {
                    tree.getNodeById(tree.selectedUnitId).reload();
                }
                else {
                    parentNode.reload();
                    win.close();
                }
            },
            failure: function (option, response) {
                Ext.MessageBox.show({
                    title: 'Failure',
                    msg: response.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    },
    onStoreClose: function () {
        this.close();
    }
});
Ext.reg('store-window', Ext.erp.ux.store.Window);


/**
* @desc      store Grid
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.store
* @class     Ext.erp.ux.store.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.store.Grid = function (config) {
    Ext.erp.ux.store.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Store.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code', 'Type',  'Parent', 'Address'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('store-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('store-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('store-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'store-grid',
        selectedUnitTypeId: 0,
        pageSize: 30,
        height: 300,
        stripeRows: true,
        border: false,
        columnLines: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        listeners: {
            rowClick: function () {
                var grid = Ext.getCmp('store-grid');
                var id = grid.getSelectionModel().getSelected().get('Id');
                var store = grid.getSelectionModel().getSelected().get('Name');


                Ext.getCmp('storeLocation-grid').storeId = id;
                Ext.getCmp('storeLocation-grid').storeName = store;
                Ext.getCmp('storeLocation-grid').loadData();

                Ext.getCmp('storeLocationBin-grid').getStore().removeAll();


            },
            rowdblclick: function (grid, rowIndex, e) {
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
            header: 'Name',
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
            dataIndex: 'Type',
            header: 'Type',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, ]
    }, config));
}
Ext.extend(Ext.erp.ux.store.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ unitTypeId: this.unitTypeId }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Add',
            id: 'addStore',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Store', 'CanAdd'),
            handler: this.onAddClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            id: 'editStore',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Store', 'CanEdit'),
            handler: this.onEditClick
        }, {
            xtype: 'button',
            text: 'Delete',
            id: 'deleteStore',
            iconCls: 'icon-delete',
            hidden: false,
            disabled: !Ext.erp.ux.Reception.getPermission('Store', 'CanDelete'),
            handler: this.onDeleteClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Store Permission',
            id: 'addPermission',
            iconCls: 'icon-permission',
            handler: this.onPermissionClick
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'textfield',
            emptyText: 'Type Search text here and press "Enter"',
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
                        var grid = Ext.getCmp('store-grid');
                        parentId = grid.parentId;
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), unitId: parentId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('store-grid');
                        parentId = grid.parentId;
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), unitId: parentId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'store-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.store.Grid.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        var tree = Ext.getCmp('store-tree');
        if (tree.selectedUnitId == 0) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select parent store.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.erp.ux.store.Window({
            unitId: 0,
            parentId: tree.selectedUnitId,
            mode: 'add',
            title: 'Add Store'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('store-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a store to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var storeId = grid.getSelectionModel().getSelected().get('Id');
        var parentId = grid.parentId;
        new Ext.erp.ux.store.Window({
            title: 'Edit Store',
            storeId: storeId,
            parentId: parentId,
            mode: 'edit',
            title: 'Edit Store'
        }).show();
    },
    onPermissionClick: function () {
        var grid = Ext.getCmp('store-grid');

        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a store to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var storeId = grid.getSelectionModel().getSelected().get('Id');

        new Ext.erp.ux.storePermission.Window({
            storeId: storeId
        }).show();
    },
    onDeleteClick: function () {
        var tree = Ext.getCmp('store-tree');
        if (tree.selectedUnitId == 'root-unit' || tree.selectedUnitId == 0) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a Store to delete.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var parentNode = tree.getNodeById(tree.selectedUnitId).parentNode;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected store',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            animEl: 'delete',
            fn: function (btn) {
                if (btn == 'ok') {
                    Ext.MessageBox.show({
                        title: 'Warning',
                        msg: 'Deleting this Store could make other related data invalid. Press Ok to delete, Press Cancel to abort.',
                        buttons: {
                            ok: 'Ok',
                            cancel: 'Cancel'
                        },
                        icon: Ext.MessageBox.WARNING,
                        scope: this,
                        fn: function (btn) {
                            if (btn == 'ok') {
                                Store.Delete(tree.selectedUnitId, function (result) {
                                    Ext.getCmp('store-paging').doRefresh();
                                    if (result.success) {
                                        parentNode.reload();
                                        tree.selectedUnitId = 0;
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
                }
            }
        });
    },
    renderer: function (value, metaData, record, rowIndex, colIndex, store) {

        if(value==0) value = 1;
        var capacity = record.data['Capacity']; if (capacity == 0) capacity = 1;
        var percent = (value / capacity)*100;
        return '<div class="x-progress x-progress-default" style="height: 13px;"><div class="x-progress-bar x-progress-bar-default" style="width: ' + percent + '%"></div></div>';
}
});
Ext.reg('store-Grid', Ext.erp.ux.store.Grid);

/**
* @desc      store tree
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.store
* @class     Ext.erp.ux.store.Tree
* @extends   Ext.tree.TreePanel
*/
Ext.erp.ux.store.Tree = function (config) {
    Ext.erp.ux.store.Tree.superclass.constructor.call(this, Ext.apply({
        id: 'store-tree',
        loader: new Ext.tree.TreeLoader({
            directFn: Store.PopulateTree
        }),
        selectedUnitId: 0,
        selectedUnitTypeId: 0,
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
                node.getOwnerTree().selectedUnitTypeId = node.attributes.id == 'root-unit' ? 'root-unit' : node.attributes.unitTypeId;
                node.getOwnerTree().selectedUnitId = node.attributes.id;
                var StoreGrid = Ext.getCmp('store-grid');
                StoreGrid.parentId = node.id;
                StoreGrid.store.baseParams = { record: Ext.encode({ unitId: node.id }) };
                StoreGrid.store.load({ params: { start: 0, limit: StoreGrid.pageSize} });
            },
            contextmenu: function (node, e) {
                node.select();
                node.getOwnerTree().selectedUnitTypeId = node.attributes.id == 'root-unit' ? 'root-unit' : node.attributes.unitTypeId;
                node.getOwnerTree().selectedUnitId = node.attributes.id;
                var StoreGrid = Ext.getCmp('store-grid');
                StoreGrid.store.baseParams = { record: Ext.encode({ unitId: node.id }) };
                StoreGrid.store.load({ params: { start: 0, limit: StoreGrid.pageSize} });
            },
            expand: function (p) {
                p.syncSize();
            },
            beforenodedrop: function (dropEvent) {
                if (dropEvent.rawEvent.ctrlKey) {
                    childNodeId = dropEvent.dropNode.id;
                    currentParentNodeId = dropEvent.target.id;
                    currentParentNode = dropEvent.tree.getNodeById(currentParentNodeId);

                    Store.Restructure(childNodeId, currentParentNodeId, function (result) {
                        if (result.success) {
                            if (currentParentNode.parentNode.isExpandable()) {
                                currentParentNode.parentNode.reload();
                            }
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
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    }, config));
};
Ext.extend(Ext.erp.ux.store.Tree, Ext.tree.TreePanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            id: 'expand-all',
            iconCls: 'icon-expand-all',
            tooltip: 'Expand All',
            handler: function () {
                Ext.getCmp('store-tree').expandAll();
            }
        }, {
            xtype: 'button',
            id: 'collapse-all',
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function () {
                Ext.getCmp('store-tree').collapseAll();
            }
        }];
        Ext.erp.ux.store.Tree.superclass.initComponent.call(this, arguments);
    }
});
Ext.reg('store-tree', Ext.erp.ux.store.Tree);
/**
* @desc      store panel
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.store
* @class     Ext.erp.ux.store.HeaderPanel
* @extends   Ext.Panel
*/
Ext.erp.ux.store.HeaderPanel = function (config) {
    Ext.erp.ux.store.HeaderPanel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.store.HeaderPanel, Ext.Panel, {
    initComponent: function () {
        this.tree = new Ext.erp.ux.store.Tree();
        this.grid = new Ext.erp.ux.store.Grid();
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
        Ext.erp.ux.store.HeaderPanel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('store-headerPanel', Ext.erp.ux.store.HeaderPanel);
/**
* @desc      store panel
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.store
* @class     Ext.erp.ux.store.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.store.Panel = function (config) {
    Ext.erp.ux.store.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'store-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.store.Panel, Ext.Panel, {
    initComponent: function () {
        this.headerPanel = new Ext.erp.ux.store.HeaderPanel();
        this.locationPanel = new Ext.erp.ux.storeLocation.Panel();
        this.items = [{
            layout: 'vbox',
            layoutConfig: {
                type: 'hbox',
                align: 'stretch',
                pack: 'start'
            },
            defaults: {
                flex: 1
            },
            items: [
                {
                    layout: 'vbox',
                    layoutConfig: {
                        type: 'hbox',
                        align: 'stretch',
                        pack: 'start'
                    },
                    defaults: {
                        flex: 1
                    },
                    items: [this.headerPanel, this.locationPanel]

                }
            ]

        }];
        Ext.erp.ux.store.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('store-panel', Ext.erp.ux.store.Panel);