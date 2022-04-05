Ext.ns('Ext.erp.ux.itemCategory');

/**
* @desc      itemCategory form
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.itemCategory
* @class     Ext.erp.ux.itemCategory.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.itemCategory.Form = function (config) {
    Ext.erp.ux.itemCategory.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: ItemCategory.Get,
            submit: ItemCategory.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'itemCategory-form',
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
            name: 'CreatedAt',
            xtype: 'hidden'
        }, {
            name: 'CostingMethodId',
            xtype: 'hidden'
        }, {
            xtype: 'textfield',
            name: 'Parent',
            fieldLabel: 'Parent Category',
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
                api: { read: Psms.GetItemCategoryType }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('itemCategory-form').getForm();
                    form.findField("TypeId").setValue(rec.id);     
                },
            }
        }, {
            name: 'CostingMethod',
            hiddenName: 'CostingMethod',
            xtype: 'combo',
            fieldLabel: 'Costing Method',
            anchor: '95%',
            triggerAction: 'all',
            mode: 'local',
            width: 100,
            editable: false,
            typeAhead: true,
            forceSelection: true,
            selectOnFocus: true,
            emptyText: '---Select---',
            hidden:true,
            allowBlank: true,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: Psms.GetInventoryCostingMethod }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('itemCategory-form').getForm();
                    form.findField("CostingMethodId").setValue(rec.id);
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
        }]
    }, config));
};
Ext.extend(Ext.erp.ux.itemCategory.Form, Ext.form.FormPanel);
Ext.reg('itemCategory-form', Ext.erp.ux.itemCategory.Form);

/**
* @desc      Location registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.itemCategory
* @class     Ext.erp.ux.itemCategory.Window
* @extends   Ext.Window
*/
Ext.erp.ux.itemCategory.Window = function (config) {
    Ext.erp.ux.itemCategory.Window.superclass.constructor.call(this, Ext.apply({
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
                var tree = Ext.getCmp('itemCategory-tree');
                var node = tree.getNodeById(tree.selectedUnitId);
                var parent = node.attributes.text;
                if (this.mode == 'edit') {
                    this.form.getForm().load({ params: { id: this.itemCategoryId } });
                }
                this.form.getForm().findField('Parent').setValue(parent);
            }
        }
    }, config));
};
Ext.extend(Ext.erp.ux.itemCategory.Window, Ext.Window, {
    initComponent: function () {
       this.form = new Ext.erp.ux.itemCategory.Form({ mode: this.mode });
        this.items = [this.form];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Save',
            iconCls: 'icon-save',
            scope: this,
            handler: this.onItemCategorySave
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onItemCategoryClose,
            scope: this
        }];
        this.tools = [{
            id: 'refresh',
            qtip: 'Reset',
            handler: function () {
                this.form.getForm().findField('Name').setRawValue('');
                this.form.getForm().findField('Code').setRawValue('');
                this.form.getForm().findField('CostingMethodId').setRawValue('');
                this.form.getForm().findField('CostingMethod').setRawValue('');

            },
            scope: this
        }];
        Ext.erp.ux.itemCategory.Window.superclass.initComponent.call(this, arguments);
    },
    onItemCategorySave: function () {
        if (!this.form.getForm().isValid()) return;
        if (this.parentId != 'root-unit') {
            this.form.getForm().findField('ParentId').setValue(this.parentId);
        }
        var tree = Ext.getCmp('itemCategory-tree');
        var parentNode = tree.getNodeById(tree.selectedUnitId);
        var mode = this.mode;
        var win = this;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                var form = Ext.getCmp('itemCategory-form').getForm();
                form.findField('Name').setRawValue('');
                form.findField('Code').setRawValue('');
                form.findField('CostingMethod').setRawValue('');
                form.findField('CostingMethodId').setRawValue('');
                Ext.getCmp('itemCategory-paging').doRefresh();
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
    onItemCategoryClose: function () {
        this.close();
    }
});
Ext.reg('itemCategory-window', Ext.erp.ux.itemCategory.Window);


/**
* @desc      itemCategory Grid
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.itemCategory
* @class     Ext.erp.ux.itemCategory.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.itemCategory.Grid = function (config) {
    Ext.erp.ux.itemCategory.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ItemCategory.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code', 'Type', 'Parent', 'CostingMethod'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('itemCategory-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('itemCategory-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('itemCategory-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'itemCategory-grid',
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
        }, {
            dataIndex: 'CostingMethod',
            header: 'Costing Method',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Parent',
            header: 'Parent',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.itemCategory.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ unitTypeId: this.unitTypeId }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Add',
            id: 'addItemCategory',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Item Category', 'CanAdd'),
            handler: this.onAddClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            id: 'editItemCategory',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Item Category', 'CanEdit'),
            handler: this.onEditClick
        }, {
            xtype: 'button',
            text: 'Delete',
            id: 'deleteItemCategory',
            iconCls: 'icon-delete',
            hidden: false,
            disabled: !Ext.erp.ux.Reception.getPermission('Item Category', 'CanDelete'),
            handler: this.onDeleteClick
        },  {
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
                        var grid = Ext.getCmp('itemCategory-grid');
                        parentId = grid.parentId;
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), unitId: parentId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('itemCategory-grid');
                        parentId = grid.parentId;
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), unitId: parentId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'itemCategory-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.itemCategory.Grid.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        var tree = Ext.getCmp('itemCategory-tree');
        if (tree.selectedUnitId == 0) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select parent item Category.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.erp.ux.itemCategory.Window({
            unitId: 0,
            parentId: tree.selectedUnitId,
            mode: 'add',
            title: 'Add'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('itemCategory-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a item Category to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var itemCategoryId = grid.getSelectionModel().getSelected().get('Id');
        var parentId = grid.parentId;
        new Ext.erp.ux.itemCategory.Window({
            title: 'Edit ItemCategory',
            itemCategoryId: itemCategoryId,
            parentId: parentId,
            mode: 'edit'
        }).show();
    },
    onAccountMappingClick: function () {
        var grid = Ext.getCmp('itemCategory-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a item Category to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var itemCategoryId = grid.getSelectionModel().getSelected().get('Id');
        var parentId = grid.parentId;
        new Ext.erp.ux.accountMapping.Window({
            itemId:'',
            itemCategoryId: itemCategoryId,
            title: 'Account Mapping'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('itemCategory-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a item Category to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var itemCategoryId = grid.getSelectionModel().getSelected().get('Id');

        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected item Category',
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
                        msg: 'Deleting this Item Category could make other related data invalid. Press Ok to delete, Press Cancel to abort.',
                        buttons: {
                            ok: 'Ok',
                            cancel: 'Cancel'
                        },
                        icon: Ext.MessageBox.WARNING,
                        scope: this,
                        fn: function (btn) {
                            if (btn == 'ok') {
                                ItemCategory.Delete(itemCategoryId, function (result) {
                                    if (result.success) {
                                        var tree = Ext.getCmp('itemCategory-tree');
                                        var parentNode = tree.getNodeById(tree.selectedUnitId);
                                        parentNode.reload();
                                        Ext.getCmp('itemCategory-paging').doRefresh();


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
    }
});
Ext.reg('itemCategory-Grid', Ext.erp.ux.itemCategory.Grid);

/**
* @desc      itemCategory tree
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.itemCategory
* @class     Ext.erp.ux.itemCategory.Tree
* @extends   Ext.tree.TreePanel
*/
Ext.erp.ux.itemCategory.Tree = function (config) {
    Ext.erp.ux.itemCategory.Tree.superclass.constructor.call(this, Ext.apply({
        id: 'itemCategory-tree',
        loader: new Ext.tree.TreeLoader({
            directFn: ItemCategory.PopulateTree
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
            text: 'ItemCategorys',
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
                var ItemCategoryGrid = Ext.getCmp('itemCategory-grid');
                ItemCategoryGrid.parentId = node.id;
                ItemCategoryGrid.store.baseParams = { record: Ext.encode({ unitId: node.id }) };
                ItemCategoryGrid.store.load({ params: { start: 0, limit: ItemCategoryGrid.pageSize } });
            },
            contextmenu: function (node, e) {
                node.select();
                node.getOwnerTree().selectedUnitTypeId = node.attributes.id == 'root-unit' ? 'root-unit' : node.attributes.unitTypeId;
                node.getOwnerTree().selectedUnitId = node.attributes.id;
                var ItemCategoryGrid = Ext.getCmp('itemCategory-grid');
                ItemCategoryGrid.store.baseParams = { record: Ext.encode({ unitId: node.id }) };
                ItemCategoryGrid.store.load({ params: { start: 0, limit: ItemCategoryGrid.pageSize } });
            },
            expand: function (p) {
                p.syncSize();
            },
            beforenodedrop: function (dropEvent) {
                if (dropEvent.rawEvent.ctrlKey) {
                    childNodeId = dropEvent.dropNode.id;
                    currentParentNodeId = dropEvent.target.id;
                    currentParentNode = dropEvent.tree.getNodeById(currentParentNodeId);

                    ItemCategory.Restructure(childNodeId, currentParentNodeId, function (result) {
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
Ext.extend(Ext.erp.ux.itemCategory.Tree, Ext.tree.TreePanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            id: 'expand-all',
            iconCls: 'icon-expand-all',
            tooltip: 'Expand All',
            handler: function () {
                Ext.getCmp('itemCategory-tree').expandAll();
            }
        }, {
            xtype: 'button',
            id: 'collapse-all',
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function () {
                Ext.getCmp('itemCategory-tree').collapseAll();
            }
        }];
        Ext.erp.ux.itemCategory.Tree.superclass.initComponent.call(this, arguments);
    }
});
Ext.reg('itemCategory-tree', Ext.erp.ux.itemCategory.Tree);

/**
* @desc      itemCategory panel
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.itemCategory
* @class     Ext.erp.ux.itemCategory.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.itemCategory.Panel = function (config) {
    Ext.erp.ux.itemCategory.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'itemCategory-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.itemCategory.Panel, Ext.Panel, {
    initComponent: function () {
        this.tree = new Ext.erp.ux.itemCategory.Tree();
        this.grid = new Ext.erp.ux.itemCategory.Grid();
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
        Ext.erp.ux.itemCategory.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('itemCategory-panel', Ext.erp.ux.itemCategory.Panel);