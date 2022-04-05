Ext.ns('Ext.erp.ux.priceCategory');

/**
* @desc      priceCategory form
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.priceCategory
* @class     Ext.erp.ux.priceCategory.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.priceCategory.Form = function (config) {
    Ext.erp.ux.priceCategory.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PriceCategory.Get,
            submit: PriceCategory.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'priceCategory-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'CreatedAt',
            xtype: 'hidden'
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
        name: 'Remark',
        xtype: 'textarea',
        fieldLabel: 'Remark',
        width: 100,
        readOnly: false,
        allowBlank: false
                },]
    }, config));
};
Ext.extend(Ext.erp.ux.priceCategory.Form, Ext.form.FormPanel);
Ext.reg('priceCategory-form', Ext.erp.ux.priceCategory.Form);

/**
* @desc      Location registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.priceCategory
* @class     Ext.erp.ux.priceCategory.Window
* @extends   Ext.Window
*/
Ext.erp.ux.priceCategory.Window = function (config) {
    Ext.erp.ux.priceCategory.Window.superclass.constructor.call(this, Ext.apply({
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
                var tree = Ext.getCmp('priceCategory-tree');
                var node = tree.getNodeById(tree.selectedUnitId);
                var parent = node.attributes.text;
                if (this.mode == 'edit') {
                    this.form.getForm().load({ params: { id: this.priceCategoryId } });
                }
            }
        }
    }, config));
};
Ext.extend(Ext.erp.ux.priceCategory.Window, Ext.Window, {
    initComponent: function () {
       this.form = new Ext.erp.ux.priceCategory.Form({ mode: this.mode });
        this.items = [this.form];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Save',
            iconCls: 'icon-save',
            scope: this,
            handler: this.onPriceCategorySave
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onPriceCategoryClose,
            scope: this
        }];
        this.tools = [{
            id: 'refresh',
            qtip: 'Reset',
            handler: function () {
                this.form.getForm().form.reset();
          
            },
            scope: this
        }];
        Ext.erp.ux.priceCategory.Window.superclass.initComponent.call(this, arguments);
    },
    onPriceCategorySave: function () {
        if (!this.form.getForm().isValid()) return;
        var tree = Ext.getCmp('priceCategory-tree');
        var selectedNode = tree.selectedNode;
        var mode = this.mode;
        var win = this;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                var form = Ext.getCmp('priceCategory-form').getForm();
                form.reset();
                if (mode == 'add') {
                    tree.getLoader().load(selectedNode);
                }
                else {
                     tree.getLoader().load(selectedNode.parentNode);
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
    onPriceCategoryClose: function () {
        this.close();
    }
});
Ext.reg('priceCategory-window', Ext.erp.ux.priceCategory.Window);


/**
* @desc      priceCategory Grid
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.priceCategory
* @class     Ext.erp.ux.priceCategory.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.priceCategory.Grid = function (config) {
    Ext.erp.ux.priceCategory.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PriceCategory.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('priceCategory-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('priceCategory-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('priceCategory-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'priceCategory-grid',
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
            },
            rowdblclick: function (grid, rowIndex, e) {
             Ext.getCmp('priceCategory-tree').onEdit();
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
        }, ]
    }, config));
}
Ext.extend(Ext.erp.ux.priceCategory.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ unitTypeId: this.unitTypeId }) };
        this.tbar = [ {
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
                        var grid = Ext.getCmp('priceCategory-grid');
                        parentId = grid.parentId;
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), unitId: parentId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('priceCategory-grid');
                        parentId = grid.parentId;
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), unitId: parentId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'priceCategory-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.priceCategory.Grid.superclass.initComponent.apply(this, arguments);
    },
 
});
Ext.reg('priceCategory-Grid', Ext.erp.ux.priceCategory.Grid);

/**
* @desc      priceCategory tree
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.priceCategory
* @class     Ext.erp.ux.priceCategory.Tree
* @extends   Ext.tree.TreePanel
*/
Ext.erp.ux.priceCategory.Tree = function (config) {
    Ext.erp.ux.priceCategory.Tree.superclass.constructor.call(this, Ext.apply({
        id: 'priceCategory-tree',
        loader: new Ext.tree.TreeLoader({
            directFn: PriceCategory.PopulateTree
        }),
        selectedUnitId: '',
        selectedUnitTypeId: '',
        selectedNode:'',
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
            text: 'Price Category',
            id: 'root-priceCategory'
        },
        listeners: {
            click: function (node, e) {
                e.stopEvent();
                node.select();
                if (node.isExpandable()) {
                    node.reload();
                }
                node.getOwnerTree().selectedUnitTypeId = node.attributes.id == 'root-priceCategory' ? 'root-priceCategory' : node.attributes.unitTypeId;
                node.getOwnerTree().selectedUnitId = node.attributes.id;
                node.getOwnerTree().selectedNode = node;

                Ext.getCmp('itemPrice-grid').onSearchGrid();
            },
            contextmenu: function (node, e) {
                node.select();
                node.getOwnerTree().selectedUnitTypeId = node.attributes.id == 'root-priceCategory' ? 'root-priceCategory' : node.attributes.unitTypeId;
                node.getOwnerTree().selectedUnitId = node.attributes.id;
                node.getOwnerTree().selectedNode = node;

                Ext.getCmp('itemPrice-grid').onSearchGrid();
            },
            expand: function (p) {
                p.syncSize();
            },
            beforenodedrop: function (dropEvent) {
                if (dropEvent.rawEvent.ctrlKey) {
                    childNodeId = dropEvent.dropNode.id;
                    currentParentNodeId = dropEvent.target.id;
                    currentParentNode = dropEvent.tree.getNodeById(currentParentNodeId);

                    PriceCategory.Restructure(childNodeId, currentParentNodeId, function (result) {
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
Ext.extend(Ext.erp.ux.priceCategory.Tree, Ext.tree.TreePanel, {
    initComponent: function () {
        this.tbar = [
            {
                xtype: 'displayfield',
                id: 'selected-priceCategory',
                style: 'font-weight: bold'
            }, {
            xtype: 'button',
            text: 'Add',
            id: 'addPriceCategory',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Item Price', 'CanAdd'),
            handler: this.onAddClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            id: 'editPriceCategory',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Item Price', 'CanEdit'),
            handler: this.onEdit
        }, {
            xtype: 'button',
            text: 'Delete',
            id: 'deletePriceCategory',
            iconCls: 'icon-delete',
            hidden: false,
            disabled: !Ext.erp.ux.Reception.getPermission('Item Price', 'CanDelete'),
            handler: this.onDeleteClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Personnel',
            iconCls: 'icon-accept',
            disabled: !Ext.erp.ux.Reception.getPermission('Item Price', 'CanEdit'),
            handler: this.onAddPersonnelClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Criteria',
            iconCls: 'icon-accept',
            disabled: !Ext.erp.ux.Reception.getPermission('Item Price', 'CanEdit'),
            handler: this.onAddCriteriaClick
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            id: 'expand-all',
            iconCls: 'icon-expand-all',
            tooltip: 'Expand All',
            handler: function () {
                Ext.getCmp('priceCategory-tree').expandAll();
            }
        }, {
            xtype: 'button',
            id: 'collapse-all',
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function () {
                Ext.getCmp('priceCategory-tree').collapseAll();
            }
        }];
        Ext.erp.ux.priceCategory.Tree.superclass.initComponent.call(this, arguments);
    },
    onAddClick: function () {
        var tree = Ext.getCmp('priceCategory-tree');
        new Ext.erp.ux.priceCategory.Window({
            mode: 'add',
            title: 'Add'
        }).show();
    },
    onEdit: function () {
        var tree = Ext.getCmp('priceCategory-tree');
        if (tree.selectedUnitId == "" || typeof tree.selectedUnitId == "undefined" || tree.selectedUnitId=="root-priceCategory") {
            return;
        }

        var priceCategoryId = tree.selectedUnitId;
        new Ext.erp.ux.priceCategory.Window({
            title: 'Edit PriceCategory',
            priceCategoryId: priceCategoryId,
            mode: 'edit'
        }).show();
    },
    onAddPersonnelClick: function () {
        var tree = Ext.getCmp('priceCategory-tree');
        if (tree.selectedUnitId == "" || typeof tree.selectedUnitId == "undefined" || tree.selectedUnitId == "root-priceCategory") {
            return;
        }
        var priceCategoryId = tree.selectedUnitId;
        new Ext.erp.ux.priceCategoryPersonnel.Window({
            title: 'Edit Price Category Personnel',
            priceCategoryId: priceCategoryId,
            mode: 'add'
        }).show();
    },
    onAddCriteriaClick: function () {
        var tree = Ext.getCmp('priceCategory-tree');
        if (tree.selectedUnitId == "" || typeof tree.selectedUnitId == "undefined" || tree.selectedUnitId == "root-priceCategory") {
            return;
        }
        var priceCategoryId = tree.selectedUnitId;
        new Ext.erp.ux.priceCategoryCriteria.Window({
            title: 'Edit Price Category Criteria',
            priceCategoryId: priceCategoryId,
            mode: 'add'
        }).show();
    },
    onDeleteClick: function () {
        var tree = Ext.getCmp('priceCategory-tree');
        if (tree.selectedUnitId == "" || typeof tree.selectedUnitId == "undefined") {
            return;
        }
        var priceCategoryId = tree.selectedUnitId;
      
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Price Category',
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
                        msg: 'Deleting this Price Category could make other related data invalid. Press Ok to delete, Press Cancel to abort.',
                        buttons: {
                            ok: 'Ok',
                            cancel: 'Cancel'
                        },
                        icon: Ext.MessageBox.WARNING,
                        scope: this,
                        fn: function (btn) {
                            if (btn == 'ok') {
                                PriceCategory.Delete(priceCategoryId, function (result) {
                                    if (result.success) {
                                        var tree = Ext.getCmp('priceCategory-tree');
                                        var selectedNode = tree.selectedNode;
                                        tree.getLoader().load(selectedNode.parentNode);
                                        Ext.getCmp('priceCategory-paging').doRefresh();


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
Ext.reg('priceCategory-tree', Ext.erp.ux.priceCategory.Tree);

/**
* @desc      priceCategory panel
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.priceCategory
* @class     Ext.erp.ux.priceCategory.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.priceCategory.Panel = function (config) {
    Ext.erp.ux.priceCategory.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'priceCategory-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.priceCategory.Panel, Ext.Panel, {
    initComponent: function () {
        this.tree = new Ext.erp.ux.priceCategory.Tree();
        this.items = [this.tree];
        Ext.erp.ux.priceCategory.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('priceCategory-panel', Ext.erp.ux.priceCategory.Panel);