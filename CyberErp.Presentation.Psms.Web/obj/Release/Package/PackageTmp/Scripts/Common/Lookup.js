Ext.ns('Ext.erp.ux.lookup');
/**
* @desc      Lookup form
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      December 13, 2017
* @namespace Ext.erp.ux.lookup
* @class     Ext.erp.ux.lookup.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.lookup.Form = function (config) {
    Ext.erp.ux.lookup.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Lookup.Get,
            submit: Lookup.Save
        },
        paramOrder: ['id', 'tableName'],
        defaults: {
            anchor: '95%',
            msgTarget: 'side',
            labelStyle: 'text-align:right;'
        },
        id: 'lookup-form',
        padding: 5,
        labelWidth: 100,
        autoHeight: true,
        border: false,
        width: 840,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'Name',
            xtype: 'textfield',
            fieldLabel: 'Name',
            allowBlank: false
        }, {
            name: 'Code',
            xtype: 'textfield',
            fieldLabel: 'Code',
            allowBlank: false,
            anchor: '70%'
        }]
    }, config));
};
Ext.extend(Ext.erp.ux.lookup.Form, Ext.form.FormPanel);
Ext.reg('lookup-form', Ext.erp.ux.lookup.Form);

/**
* @desc      Lookup registration form host window
* @author    Wondwosen Desalegn
* @copyright (c) 2010, Cybersoft
* @date      November 10, 2010
* @namespace Ext.erp.ux.lookup
* @class     Ext.erp.ux.lookup.Window
* @extends   Ext.Window
*/
Ext.erp.ux.lookup.Window = function (config) {
    Ext.erp.ux.lookup.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 400,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.lookupId);
                if (typeof this.lookupId != "undefined" && this.lookupId!="") {
                    this.form.load({
                        waitMsg: 'Loading...',
                        params: { id: this.lookupId, tableName: this.tableName }
                    });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.lookup.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.lookup.Form();
        this.items = [this.form];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSave,
            scope: this
        }, {
            xtype: 'tbseparator'
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
        Ext.erp.ux.lookup.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('lookup-form').getForm().reset();
                Ext.getCmp('lookup-paging').doRefresh();
            },
            params: {
                record: Ext.encode({ tableName: this.tableName })
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('lookup-window', Ext.erp.ux.lookup.Window);


/**
* @desc      Lookup grid
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      December 13, 2017
* @namespace Ext.erp.ux.lookup
* @class     Ext.erp.ux.lookup.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.lookup.Grid = function (config) {
    Ext.erp.ux.lookup.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Lookup.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code'],
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
        id: 'lookup-grid',
        tableName: '',
        pageSize: 20,
        height: 590,
        stripeRows: true,
        columnLines: true,
        border: false,
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
            scope: this
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.erp.ux.grid.PagingRowNumberer(), {
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
        }]
    }, config));
};
Ext.extend(Ext.erp.ux.lookup.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ tableName: '' }) };
        this.tbar = [{
            xtype: 'displayfield',
            id: 'lookupCategory-name',
            style: 'font-weight: bold; height: 20px; line-height: 20px'
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            text: 'Add',
            id: 'addLookupItem',
            iconCls: 'icon-add',
            handler: this.onAddClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            id: 'editLookupItem',
            iconCls: 'icon-edit',
            handler: this.onEditClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Delete',
            id: 'deleteLookupItem',
            iconCls: 'icon-delete',
            handler: this.onDeleteClick
        }]

        this.bbar = new Ext.PagingToolbar({
            id: 'lookup-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.lookup.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        //Workbench.CheckPermission('lookup-panel', function (result) {
        //    Ext.getCmp('addLookupItem').setDisabled(!result.data.CanAdd);
        //    Ext.getCmp('editLookupItem').setDisabled(!result.data.CanEdit);
        //    Ext.getCmp('deleteLookupItem').setDisabled(!result.data.CanDelete);
        //    Ext.getCmp('lookup-tree').setDisabled(!result.data.CanView);
        //});
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.ux.lookup.Grid.superclass.afterRender.apply(this, arguments);
    },
    onAddClick: function () {
        var grid = Ext.getCmp('lookup-grid');
        if (grid.tableName == '') return;
        new Ext.erp.ux.lookup.Window({
            lookupId: 0,
            title: 'Add Lookup',
            tableName: grid.tableName
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('lookup-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.ux.lookup.Window({
            lookupId: id,
            title: 'Edit Lookup',
            tableName: grid.tableName
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('lookup-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
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
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    Lookup.Delete(id, grid.tableName, function (result, response) {
                        Ext.getCmp('lookup-paging').doRefresh();
                    }, this);
                }
            }
        });
    }
});
Ext.reg('lookup-grid', Ext.erp.ux.lookup.Grid);

/**
* @desc      Lookup Category tree
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      December 13, 2017
* @namespace Ext.erp.ux.lookup
* @class     Ext.erp.ux.lookup.Tree
* @extends   Ext.tree.TreePanel
*/
Ext.erp.ux.lookup.Tree = function (config) {
    Ext.erp.ux.lookup.Tree.superclass.constructor.call(this, Ext.apply({
        id: 'lookup-tree',
        loader: new Ext.tree.TreeLoader({
            directFn: Lookup.PopulateLookupCategoryTree,
            scope: this,
            paramsAsHash: true,
            paramOrder: 'node|type',
            listeners: {
                beforeload: function (treeLoader, node) {
                    this.baseParams = {
                        type: (node.attributes.type) ? node.attributes.type : 'root'
                    };
                }
            }
        }),
        border: false,
        rootVisible: false,
        lines: false,
        autoScroll: true,
        stateful: false,
        root: {
            text: 'Lookup Category',
            id: 'root',
            type: 'root'
        },
        listeners: {
            click: function (node, e) {
                e.stopEvent();
                node.select();
                if (node.isExpandable()) {
                    node.reload();
                }
                var selectedCategory = node.attributes.id == 'root' ? '' : '[' + node.attributes.text + ']';
                Ext.getCmp('lookupCategory-name').setValue(selectedCategory);
                if (node.attributes.type == 'category') {
                    var grid = Ext.getCmp('lookup-grid');
                    grid.tableName = node.id;
                    grid.store.baseParams['record'] = Ext.encode({ tableName: node.id });
                    grid.store.load({ params: { start: 0, limit: grid.pageSize} });
                }
                else {
                    var grid = Ext.getCmp('lookup-grid');
                    grid.tableName = '';
                    grid.store.baseParams['record'] = Ext.encode({ tableName: '' });
                    grid.store.load({ params: { start: 0, limit: grid.pageSize} });
                }
            },
            expand: function (p) {
                p.syncSize();
            }
        }
    }, config));
}
Ext.extend(Ext.erp.ux.lookup.Tree, Ext.tree.TreePanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'displayfield',
            value: 'Lookup Category',
            style: 'font-weight: bold; height: 20px; line-height: 20px'
        }];
        Ext.erp.ux.lookup.Tree.superclass.initComponent.call(this, arguments);
    }
});
Ext.reg('lookup-tree', Ext.erp.ux.lookup.Tree);

/**
* @desc      Lookup panel
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      December 13, 2017
* @namespace Ext.erp.ux.lookup
* @class     Ext.erp.ux.lookup.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.lookup.Panel = function (config) {
    Ext.erp.ux.lookup.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.lookup.Panel, Ext.Panel, {
    initComponent: function () {
        this.form = new Ext.erp.ux.lookup.Form();
        this.grid = new Ext.erp.ux.lookup.Grid();
        this.tree = new Ext.erp.ux.lookup.Tree();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                width: 400,
                minSize: 400,
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
        Ext.erp.ux.lookup.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('lookup-panel', Ext.erp.ux.lookup.Panel);
