Ext.ns('Ext.erp.ux.customerCategory');

/**
* @desc      customerCategory form
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.customerCategory
* @class     Ext.erp.ux.customerCategory.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.customerCategory.Form = function (config) {
    Ext.erp.ux.customerCategory.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: CustomerCategory.Get,
            submit: CustomerCategory.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'customerCategory-form',
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
            name: 'CreatedAt',
            xtype: 'hidden'
        }, {
            name: 'ParentCategory',
            xtype: 'textfield',
            fieldLabel: 'Parent Category',
            width: 100,
            disabled:true,
            allowBlank: true
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
            allowBlank: false
        }]
    }, config));
};
Ext.extend(Ext.erp.ux.customerCategory.Form, Ext.form.FormPanel);
Ext.reg('customerCategory-form', Ext.erp.ux.customerCategory.Form);

/**
* @desc      Location registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.customerCategory
* @class     Ext.erp.ux.customerCategory.Window
* @extends   Ext.Window
*/
Ext.erp.ux.customerCategory.Window = function (config) {
    Ext.erp.ux.customerCategory.Window.superclass.constructor.call(this, Ext.apply({
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
                var tree = Ext.getCmp('customerCategory-tree');
                var node = tree.getNodeById(tree.selectedUnitId);
                var parent = node.attributes.text;
                if (this.mode == 'edit') {
                    this.form.getForm().load({ params: { id: this.customerCategoryId } });
                }
                this.form.getForm().findField('ParentCategory').setValue(parent);
                this.form.getForm().findField('ParentId').setValue(tree.selectedUnitId);

            }
        }
    }, config));
};
Ext.extend(Ext.erp.ux.customerCategory.Window, Ext.Window, {
    initComponent: function () {
       this.form = new Ext.erp.ux.customerCategory.Form({ mode: this.mode });
        this.items = [this.form];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Save',
            iconCls: 'icon-save',
            scope: this,
            handler: this.onCustomerCategorySave
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onCustomerCategoryClose,
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
        Ext.erp.ux.customerCategory.Window.superclass.initComponent.call(this, arguments);
    },
    onCustomerCategorySave: function () {
        if (!this.form.getForm().isValid()) return;
        var tree = Ext.getCmp('customerCategory-tree');
        var parentNode = tree.getNodeById(tree.selectedUnitId);
        var mode = this.mode;
        var win = this;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                var form = Ext.getCmp('customerCategory-form').getForm();
                form.reset();
              //    Ext.getCmp('customerCategory-paging').doRefresh();
                if (mode == 'add') {
                    tree.getNodeById(tree.selectedUnitId).reload();
                }
                else {
                    tree.getNodeById(tree.selectedUnitId).reload();

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
    onCustomerCategoryClose: function () {
        this.close();
    }
});
Ext.reg('customerCategory-window', Ext.erp.ux.customerCategory.Window);


/**
* @desc      customerCategory Grid
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.customerCategory
* @class     Ext.erp.ux.customerCategory.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.customerCategory.Grid = function (config) {
    Ext.erp.ux.customerCategory.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: CustomerCategory.GetAll,
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
                beforeLoad: function () { Ext.getCmp('customerCategory-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('customerCategory-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('customerCategory-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'customerCategory-grid',
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
        }, ]
    }, config));
}
Ext.extend(Ext.erp.ux.customerCategory.Grid, Ext.grid.GridPanel, {
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
                        var grid = Ext.getCmp('customerCategory-grid');
                        parentId = grid.parentId;
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), unitId: parentId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('customerCategory-grid');
                        parentId = grid.parentId;
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), unitId: parentId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'customerCategory-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.customerCategory.Grid.superclass.initComponent.apply(this, arguments);
    },
 
});
Ext.reg('customerCategory-Grid', Ext.erp.ux.customerCategory.Grid);

/**
* @desc      customerCategory tree
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.customerCategory
* @class     Ext.erp.ux.customerCategory.Tree
* @extends   Ext.tree.TreePanel
*/
Ext.erp.ux.customerCategory.Tree = function (config) {
    Ext.erp.ux.customerCategory.Tree.superclass.constructor.call(this, Ext.apply({
        id: 'customerCategory-tree',
        loader: new Ext.tree.TreeLoader({
            directFn: CustomerCategory.PopulateTree
        }),
        selectedUnitId: '',
        selectedUnitTypeId: '',
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
            text: 'Customer Category',
            id: 'root-customer'
        },
        listeners: {
            click: function (node, e) {
                e.stopEvent();
                node.select();
                if (node.isExpandable()) {
                    node.reload();
                }
                node.getOwnerTree().selectedUnitTypeId = node.attributes.id == 'root-customer' ? 'root-customer' : node.attributes.unitTypeId;
                node.getOwnerTree().selectedUnitId = node.attributes.id;
              
                Ext.getCmp('customer-grid').onSearchGrid();
            },
            contextmenu: function (node, e) {
                node.select();
                node.getOwnerTree().selectedUnitTypeId = node.attributes.id == 'root-customer' ? 'root-customer' : node.attributes.unitTypeId;
                node.getOwnerTree().selectedUnitId = node.attributes.id;
               
                Ext.getCmp('customer-grid').onSearchGrid();
            },
            expand: function (p) {
                p.syncSize();
            },
            beforenodedrop: function (dropEvent) {
                if (dropEvent.rawEvent.ctrlKey) {
                    childNodeId = dropEvent.dropNode.id;
                    currentParentNodeId = dropEvent.target.id;
                    currentParentNode = dropEvent.tree.getNodeById(currentParentNodeId);

                    CustomerCategory.Restructure(childNodeId, currentParentNodeId, function (result) {
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
Ext.extend(Ext.erp.ux.customerCategory.Tree, Ext.tree.TreePanel, {
    initComponent: function () {
        this.tbar = [
            {
                xtype: 'displayfield',
                id: 'selected-customerCategory',
                style: 'font-weight: bold'
            }, {
            xtype: 'button',
            text: 'Add',
            id: 'addCustomerCategory',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Customer', 'CanAdd'),
            handler: this.onAddClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            id: 'editCustomerCategory',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Customer', 'CanEdit'),
            handler: this.onEditClick
        }, {
            xtype: 'button',
            text: 'Delete',
            id: 'deleteCustomerCategory',
            iconCls: 'icon-delete',
            hidden: false,
            disabled: !Ext.erp.ux.Reception.getPermission('Customer', 'CanDelete'),
            handler: this.onDeleteClick
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            id: 'expand-all',
            iconCls: 'icon-expand-all',
            tooltip: 'Expand All',
            handler: function () {
                Ext.getCmp('customerCategory-tree').expandAll();
            }
        }, {
            xtype: 'button',
            id: 'collapse-all',
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function () {
                Ext.getCmp('customerCategory-tree').collapseAll();
            }
        }];
        Ext.erp.ux.customerCategory.Tree.superclass.initComponent.call(this, arguments);
    },
    onAddClick: function () {
        var tree = Ext.getCmp('customerCategory-tree');
        new Ext.erp.ux.customerCategory.Window({
            mode: 'add',
            title: 'Add'
        }).show();
    },
    onEditClick: function () {
        var tree = Ext.getCmp('customerCategory-tree');
        if (tree.selectedUnitId == "" || typeof tree.selectedUnitId == "undefined" || tree.selectedUnitId=="root-customer") {
            return;
        }

        var customerCategoryId = tree.selectedUnitId;
        new Ext.erp.ux.customerCategory.Window({
            title: 'Edit CustomerCategory',
            customerCategoryId: customerCategoryId,
            mode: 'edit'
        }).show();
    },
    onDeleteClick: function () {
        var tree = Ext.getCmp('customerCategory-tree');
        if (tree.selectedUnitId == "" || typeof tree.selectedUnitId == "undefined") {
            return;
        }
        var customerCategoryId = tree.selectedUnitId;

        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Customer Category',
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
                        msg: 'Deleting this Customer Category could make other related data invalid. Press Ok to delete, Press Cancel to abort.',
                        buttons: {
                            ok: 'Ok',
                            cancel: 'Cancel'
                        },
                        icon: Ext.MessageBox.WARNING,
                        scope: this,
                        fn: function (btn) {
                            if (btn == 'ok') {
                                CustomerCategory.Delete(customerCategoryId, function (result) {
                                    if (result.success) {
                                        var tree = Ext.getCmp('customerCategory-tree');
                                        var parentNode = tree.getNodeById(tree.selectedUnitId);
                                        parentNode.reload();
                                        Ext.getCmp('customerCategory-paging').doRefresh();


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
Ext.reg('customerCategory-tree', Ext.erp.ux.customerCategory.Tree);

/**
* @desc      customerCategory panel
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.customerCategory
* @class     Ext.erp.ux.customerCategory.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.customerCategory.Panel = function (config) {
    Ext.erp.ux.customerCategory.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'customerCategory-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.customerCategory.Panel, Ext.Panel, {
    initComponent: function () {
        this.tree = new Ext.erp.ux.customerCategory.Tree();
        this.items = [this.tree];
        Ext.erp.ux.customerCategory.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('customerCategory-panel', Ext.erp.ux.customerCategory.Panel);