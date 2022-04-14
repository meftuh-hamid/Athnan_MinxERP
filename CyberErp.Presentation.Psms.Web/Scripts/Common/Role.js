Ext.ns('Ext.erp.ux.role');
/**
* @desc      Role registration form
* @author    Wondwosen Desalegn
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.role
* @class     Ext.erp.ux.role.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.role.Form = function (config) {
    Ext.erp.ux.role.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Role.Get,
            submit: Role.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'role-form',
        padding: 5,
        labelWidth: 100,
        autoHeight: true,
        border: false,
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
            allowBlank: false
        }, {
            name: 'CreatedAt',
            xtype: 'hidden'
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.role.Form, Ext.form.FormPanel);
Ext.reg('role-form', Ext.erp.ux.role.Form);

/**
* @desc      Role registration form host window
* @author    Wondwosen Desalegn
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.role
* @class     Ext.erp.ux.role.Window
* @extends   Ext.Window
*/
Ext.erp.ux.role.Window = function (config) {
    Ext.erp.ux.role.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.roleId);
                if (this.roleId != '') {
                    this.form.load({
                        params: { id: this.roleId },
                        failure: function (form, action) {
                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: action.result.data,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            });
                        }
                    });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.role.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.role.Form();
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
        Ext.erp.ux.role.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('role-form').getForm().reset();
                Ext.getCmp('role-paging').doRefresh();
            },
            failure: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('role-window', Ext.erp.ux.role.Window);

/**
* @desc      Role Permission window
* @author    Wondwosen Desalegn
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.role
* @class     Ext.erp.ux.role.PermissionWindow
* @extends   Ext.Window
*/
Ext.erp.ux.role.PermissionWindow = function (config) {
    Ext.erp.ux.role.PermissionWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 750,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.role.PermissionWindow, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.role.PermissionGrid();
        this.grid.roleId = this.roleId;
        this.items = [this.grid];

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

        Ext.erp.ux.role.PermissionWindow.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        var permissions = this.grid.getStore().data.items;
        var length = permissions.length;
        var permissionString = '';
        for (var i = 0; i < length; i++) {
            permissionString = permissionString + permissions[i].data.Id + ':' + permissions[i].data.Add + ':' + permissions[i].data.Edit + ':' + permissions[i].data.Delete + ':' + permissions[i].data.View + ':' + permissions[i].data.Approve + ';';
        }

        Role.SaveRolePermissions(this.grid.subsystemId, this.roleId, permissionString, function (result, response) {
            Ext.getCmp('rolePermission-paging').doRefresh();
            Ext.MessageBox.show({
                title: result.success ? 'Success' : 'Error',
                msg: result.data,
                buttons: Ext.Msg.OK,
                icon: result.success ? Ext.MessageBox.INFO : Ext.MessageBox.ERROR,
                scope: this
            });
        }, this);
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('role-permissionWindow', Ext.erp.ux.role.PermissionWindow);

/**
* @desc      Role grid
* @author    Wondwosen Desalegn
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.role
* @class     Ext.erp.ux.role.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.role.Grid = function (config) {
    Ext.erp.ux.role.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Role.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DSC'
            },
            fields: ['Id', 'Name', 'Code'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    this.body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    this.body.unmask();
                    this.controlButton();
                },
                loadException: function () {
                    this.body.unmask();
                },
                scope: this
            }
        }),

        id: 'role-grid',
        pageSize: 20,
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
                this.controlButton();
            },
            containermousedown: function (grid, e) {
                grid.getSelectionModel().deselectRange(0, grid.pageSize);
                this.controlButton();
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
        }, {
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
}
Ext.extend(Ext.erp.ux.role.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ roleids: this.roleids }) };

        this.bbar = new Ext.PagingToolbar({
            id: 'role-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.role.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.ux.role.Grid.superclass.afterRender.apply(this, arguments);
    },
    controlButton: function () {
        var enabled = !this.getSelectionModel().hasSelection();
        Ext.getCmp('editRole').setDisabled(enabled);
        Ext.getCmp('deleteRole').setDisabled(enabled);
    }
});
Ext.reg('role-grid', Ext.erp.ux.role.Grid);

/**
* @desc      Role Permison grid
* @author    Wondwosen Desalegn
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.role
* @class     Ext.erp.ux.role.PermissionGrid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.role.PermissionGrid = function (config) {
    Ext.erp.ux.role.PermissionGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Role.GetOperations,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'Module', 'Operation', 'Add', 'Edit', 'Delete', 'View', 'Approve'],
            remoteSort: true
        }),
        height: 400,
        id: 'rolePermission-grid',
        roleId: 0,
        subsystemId: 0,
        pageSize: 100,
        stripeRows: true,
        columnLines: true,
        border: true,
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
        }, {
            dataIndex: 'Module',
            header: 'Module',
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'Operation',
            header: 'Operation',
            width: 200,
            menuDisabled: true
        },
        new Ext.grid.CheckColumn({
            header: '<div><input type="checkbox" id="chkAdd" onclick="javascript: return selectAll(this, \'Add\');">&nbsp;Add</div>',
            dataIndex: 'Add',
            width: 80,
            menuDisabled: true
        }),
        new Ext.grid.CheckColumn({
            header: '<div><input type="checkbox" id="chkEdit" onclick="javascript: return selectAll(this, \'Edit\');">&nbsp;Edit</div>',
            dataIndex: 'Edit',
            width: 80,
            menuDisabled: true
        }),
        new Ext.grid.CheckColumn({
            header: '<div><input type="checkbox" id="chkDelete" onclick="javascript: return selectAll(this, \'Delete\');">&nbsp;Delete</div>',
            dataIndex: 'Delete',
            width: 80,
            menuDisabled: true
        }),
        new Ext.grid.CheckColumn({
            header: '<div><input type="checkbox" id="chkView" onclick="javascript: return selectAll(this, \'View\');">&nbsp;View</div>',
            dataIndex: 'View',
            width: 80,
            menuDisabled: true
        }),
        new Ext.grid.CheckColumn({
            header: '<div><input type="checkbox" id="chkApprove" onclick="javascript: return selectAll(this, \'Approve\');">&nbsp;Approve</div>',
            dataIndex: 'Approve',
            width: 85,
            menuDisabled: true
        })]
    }, config));
}
Ext.extend(Ext.erp.ux.role.PermissionGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.tbar = ['->',
        {
            xtype: 'label',
            text: 'Select Subsystem: ',
            style: 'font-weight:bold; padding-right: 5px;'
        }, {
            hiddenName: 'SubsystemId',
            xtype: 'combo',
            fieldLabel: 'Subsystem',
            triggerAction: 'all',
            mode: 'remote',
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
                api: { read: Psms.GetSubSystem }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                'select': function (cmb, rec, idx) {
                    var grid = Ext.getCmp('rolePermission-grid');
                    grid.subsystemId = this.getValue();
                    grid.store.baseParams = { record: Ext.encode({ subsystemId: this.getValue(), roleId: grid.roleId }) };
                    grid.store.load({ params: { start: 0, limit: grid.pageSize} });
                }
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'rolePermission-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.role.PermissionGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        Ext.erp.ux.role.PermissionGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('rolePermission-grid', Ext.erp.ux.role.PermissionGrid);

/**
* @desc      Role panel
* @author    Wondwosen Desalegn
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010c
* @version   $Id: Role.js, 0.1
* @namespace Ext.erp.ux.role
* @class     Ext.erp.ux.role.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.role.Panel = function (config) {
    Ext.erp.ux.role.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addRole',
                iconCls: 'icon-add',
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editRole',
                iconCls: 'icon-edit',
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteRole',
                iconCls: 'icon-delete',
                handler: this.onDeleteClick
            },
            {
                xtype: 'tbfill'
            }, 
            //{
            //    xtype: 'button',
            //    text: 'Role Command Permission',
            //    id: 'saveRoleCommandPermission',
            //    iconCls: 'icon-accept',
            //    handler: this.onSaveRoleCommandPermissionClick
            //},
            //{
            //    xtype: 'tbseparator'
            //},
            {
                xtype: 'button',
                text: 'Role Permission',
                id: 'saveRolePermission',
                iconCls: 'icon-accept',
                handler: this.onSaveRolePermissionClick
            }]
        }
    }, config));
}
Ext.extend(Ext.erp.ux.role.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'role-grid',
            id: 'role-grid'
        }];
        Ext.erp.ux.role.Panel.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        Ext.erp.ux.role.Panel.superclass.afterRender.apply(this, arguments);
    },
    onAddClick: function () {
        new Ext.erp.ux.role.Window({
            roleId: '',
            title: 'Add Role'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('role-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.ux.role.Window({
            roleId: id,
            title: 'Edit Role'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('role-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected role',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    Role.Delete(id, function (result, response) {
                        Ext.getCmp('role-paging').doRefresh();
                        Ext.MessageBox.show({
                            title: result.success ? 'Success' : 'Error',
                            msg: result.data,
                            buttons: Ext.Msg.OK,
                            icon: result.success ? Ext.MessageBox.INFO : Ext.MessageBox.ERROR,
                            scope: this
                        });
                    }, this);
                }
            }
        });
    },
    //onSaveRoleCommandPermissionClick: function() {
    //    var grid = Ext.getCmp('role-grid');
    //    if (!grid.getSelectionModel().hasSelection()) return;
    //    var id = grid.getSelectionModel().getSelected().get('Id');
    //    new Ext.erp.ux.role.RoleCommandPermissionWindow({
    //        roleId: id,
    //        title: 'Edit Role Command Permission'
    //    }).show();
    //},
    onSaveRolePermissionClick: function () {
        var grid = Ext.getCmp('role-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.ux.role.PermissionWindow({
            roleId: id,
            title: 'Edit Role Permission'
        }).show();
    }
});
Ext.reg('role-panel', Ext.erp.ux.role.Panel);

function selectAll(cb, operation){
    var grid = Ext.getCmp('rolePermission-grid');
    grid.store.each(function(record, index) {
        switch(operation)
        {
            case 'Add':
                record.set('Add', cb.checked); 
                break;
            case 'Edit':
                record.set('Edit', cb.checked); 
                break;
            case 'Delete':
                record.set('Delete', cb.checked); 
                break;
            case 'View':
                record.set('View', cb.checked); 
                break;
            case 'Approve':
                record.set('Approve', cb.checked); 
                break;
        }
    });
    
}