Ext.ns('Ext.erp.ux.user');
/**
* @desc      User registration form
* @author    Michael Chernet
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.user
* @class     Ext.erp.ux.user.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.user.Form = function (config) {
    Ext.erp.ux.user.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: User.Get,
            submit: User.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'user-form',
        autoHeight: true,
        border: false,
        width: 500,
        baseCls: 'x-plain'
    }, config));
}
Ext.extend(Ext.erp.ux.user.Form, Ext.form.FormPanel);
Ext.reg('user-form', Ext.erp.ux.user.Form);

/**
* @desc      User registration form host window
* @author    Michael Chernet
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.user
* @class     Ext.erp.ux.user.Window
* @extends   Ext.Window
*/
Ext.erp.ux.user.Window = function (config) {
    Ext.erp.ux.user.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 500,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.userId);
                if (this.userId != '') {
                    this.form.load({
                        params: { id: this.userId },
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
Ext.extend(Ext.erp.ux.user.Window, Ext.Window, {
    initComponent: function () {


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
        Ext.erp.ux.user.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var roles = '';
        var subsystems = '';
        var grid = Ext.getCmp('user-roleGrid');
        var store = grid.getStore();
        var totalCount = store.getCount();
        if (totalCount == 0) {
            var msg = Ext.MessageBox;
            Ext.MessageBox.show({
                title: 'Save failed',
                msg: "Please Select Roles First", buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }

        store.each(function (item) {
            roles = roles + item.data['Id'] + ':';
        });
        //for(var i=0; i < this.roles.length; i++){
        //    if(this.roles[i].checked){
        //        roles = roles + this.roles[i].roleId + ':';
        //    }
        //}
        for (var i = 0; i < this.subsystems.length; i++) {
            if (this.subsystems[i].checked) {
                subsystems = subsystems + this.subsystems[i].subsystemId + ':';
            }
        }
        roles = roles || ':';
        subsystems = subsystems || ':';
        this.form.getForm().submit({
            params: { record: Ext.encode({ roles: roles, subsystems: subsystems }) },
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('user-form').getForm().reset();
                Ext.getCmp('user-paging').doRefresh();
                Ext.MessageBox.show({
                    title: 'Success',
                    msg: "Sucessfully Saved",
                    buttons: Ext.Msg.OK,
                    scope: this
                });
                var Grid = Ext.getCmp('user-roleGrid');
                var GridStore = Grid.getStore();
                GridStore.removeAll();
                this.close();
            },
            failure: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Errors',
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
Ext.reg('user-window', Ext.erp.ux.user.Window);
/**
* @desc      Role Selection grid
* @author    Meftuh Mohammed
* @copyright (c) 2014, Cybersoft
* @date      oct 16, 2014
* @namespace Ext.erp.ux.user
* @class     Ext.erp.ux.user.roleGrid
* @extends   Ext.grid.GridPanel
*/
var selModel = new Ext.grid.CheckboxSelectionModel();

Ext.erp.ux.user.roleGrid = function (config) {
    Ext.erp.ux.user.roleGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: User.GetuserRoles,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },

            fields: ['Id', 'Name'],
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
        id: 'user-roleGrid',
        pageSize: 10,
        height: 200,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: selModel,
        columns: [
          new Ext.grid.RowNumberer(),
        {
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Name',
            header: 'Role',
            sortable: true,
            width: 250,
            menuDisabled: true
        }
        ]
    }, config));
};
Ext.extend(Ext.erp.ux.user.roleGrid, Ext.grid.GridPanel, {
    initComponent: function () {

        this.store.baseParams = { record: Ext.encode({ userId: this.userId }) };

        this.tbar = [
            {
                xtype: 'button',
                text: 'Remove Role',
                iconCls: 'icon-exit',
                disabled: false,
                handler: function () {
                    var grid = Ext.getCmp('user-roleGrid');

                    if (!grid.getSelectionModel().hasSelection())
                        return;

                    var selectedrecord = grid.getSelectionModel().getSelected();
                    grid.getStore().remove(selectedrecord);
                }
            },
          '->',
         {
             iconCls: 'icon-add',
             text: 'Role Selection',
             handler: function () {
                 new Ext.erp.ux.user.roleSelectionWindow({
                     title: 'Load Roles'
                 }).show();
             }
         }

        ];

        Ext.erp.ux.user.roleGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getSelectionModel().clearSelections();
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.ux.user.roleGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('user-roleGrid', Ext.erp.ux.user.roleGrid);

/**
* @desc      User grid
* @author    Michael Chernet
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.user
* @class     Ext.erp.ux.user.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.user.Grid = function (config) {
    Ext.erp.ux.user.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: User.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'UserName',
                direction: 'ASC'
            },
            fields: ['Id', 'EmployeeId', 'IsEmployee', 'UserName', 'FirstName', 'LastName'],
            remoteSort: true
        }),
        loadMask: true,
        id: 'user-grid',
        pageSize: 20,
        stripeRows: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        listeners: {
            containermousedown: function (grid, e) {
                grid.getSelectionModel().deselectRange(0, grid.pageSize);
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
            dataIndex: 'EmployeeId',
            header: 'Employee Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'UserName',
            header: 'User Name',
            sortable: true,
            width: 100,
            menuDisabled: false
        }, {
            dataIndex: 'FirstName',
            header: 'First Name',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'LastName',
            header: 'Last Name',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.user.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams['record'] = Ext.encode({ searchText: '' });
        this.bbar = new Ext.PagingToolbar({
            id: 'user-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.user.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.ux.user.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('user-grid', Ext.erp.ux.user.Grid);

/**
* @desc      User panel
* @author    Michael Chernet
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010c
* @version   $Id: User.js, 0.1
* @namespace Ext.erp.ux.user
* @class     Ext.erp.ux.user.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.user.Panel = function (config) {
    Ext.erp.ux.user.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addUser',
                iconCls: 'icon-add',
                disabled: !Ext.erp.ux.Reception.getPermission('User', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editUser',
                iconCls: 'icon-edit',
                disabled: !Ext.erp.ux.Reception.getPermission('User', 'CanEdit'),
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteUser',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.ux.Reception.getPermission('User', 'CanDelete'),
                handler: this.onDeleteClick
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'textfield',
                emptyText: 'Type search text here',
                submitEmptyText: false,
                enableKeyEvents: true,
                style: {
                    borderRadius: '25px',
                    padding: '0 10px',
                    width: '300px'
                },
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            var grid = Ext.getCmp('user-grid');
                            grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('user-grid');
                            grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    }
                }
            }, '->', {
                xtype: 'button',
                text: 'Reset',
                id: 'resetuserpassword',
                iconCls: 'icon-delete',
                handler: this.onRecetClick
            }]
        }
    }, config));
}
Ext.extend(Ext.erp.ux.user.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'user-grid',
            id: 'user-grid'
        }];
        Ext.erp.ux.user.Panel.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        var roleCheckBoxCollection = new Array();
        var subsystemCheckBoxCollection = new Array();
        Psms.GetRolesAndSubsystems(function (result) {
            for (var i = 0; i < result.countRoles; i++) {
                roleCheckBox = new Ext.form.Checkbox({
                    name: 'chkRole' + i,
                    roleId: result.roles[i].Id,
                    checkBoxIndex: i,
                    boxLabel: result.roles[i].Name,
                    hideLabel: true
                });
                roleCheckBoxCollection[i] = roleCheckBox;
            }

            for (var j = 0; j < result.countSubsystems; j++) {
                subsystemCheckBox = new Ext.form.Checkbox({
                    name: 'chkSubsystem' + j,
                    checkBoxIndex: j,
                    subsystemId: result.subsystems[j].Id,
                    boxLabel: result.subsystems[j].Name,
                    hideLabel: true
                });
                subsystemCheckBoxCollection[j] = subsystemCheckBox;
            }
            var grid = new Ext.erp.ux.user.roleGrid({
                userId: 0
            });
            var form = new Ext.erp.ux.user.Form({
                items: [{
                    layout: 'column',
                    border: false,
                    width: 500,
                    bodyStyle: 'background-color:transparent;',
                    defaults: {
                        border: false,
                        bodyStyle: 'background-color:transparent;',
                        layout: 'form'
                    },
                    items: [
                        {
                            columnWidth: .65,
                            items: [{
                                xtype: 'fieldset',
                                anchor: '95%',
                                title: 'User Data',
                                AutoHeight: true,
                                autoScroll: true,
                                items: [{
                                    name: 'Id',
                                    xtype: 'hidden'
                                },
                                {
                                    name: 'FirstName',
                                    xtype: 'textfield',
                                    fieldLabel: 'First Name',
                                    allowBlank: false
                                }, {
                                    name: 'LastName',
                                    xtype: 'textfield',
                                    fieldLabel: 'Last Name',
                                    allowBlank: false
                                }, {
                                    name: 'UserName',
                                    xtype: 'textfield',
                                    fieldLabel: 'User Name',
                                    allowBlank: false
                                }, {
                                    name: 'Password',
                                    xtype: 'textfield',
                                    inputType: 'password',
                                    fieldLabel: 'Password',
                                    allowBlank: false
                                }]
                            }]
                        },
                    {
                        columnWidth: .35,
                        items: [{
                            xtype: 'fieldset',
                            title: 'User Subsystems',
                            anchor: '95%',

                            autoHeight: true,
                            autoScroll: true,
                            items: [subsystemCheckBoxCollection]
                        }]
                    }]
                }]
            });
            new Ext.erp.ux.user.Window({
                form: form,
                // grid:grid,
                // roles: roleCheckBoxCollection,
                subsystems: subsystemCheckBoxCollection,
                items: [form, grid],
                userId: '',
                title: 'Add User'
            }).show();
        });
    },
    onEditClick: function () {
        var grid = Ext.getCmp('user-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var roleCheckBoxCollection = new Array();
        var subsystemCheckBoxCollection = new Array();
        Psms.GetRolesAndSubsystems(function (result) {
            Psms.GetRolesAndSubsystemsByUser(id, function (userRoleSubsystemResult) {
                var userRoles = userRoleSubsystemResult.roles;
                var userSubsystems = userRoleSubsystemResult.subsystems;
                var countUserRoles = userRoleSubsystemResult.countUserRoles;
                var countUserSubsystems = userRoleSubsystemResult.countUserSubsystems;
                for (var i = 0; i < result.countRoles; i++) {
                    var checked = false;
                    for (var j = 0; j < countUserRoles; j++) {
                        if (result.roles[i].Id == userRoles[j].Id) {
                            checked = true;
                            break;
                        }
                    }
                    roleCheckBox = new Ext.form.Checkbox({
                        name: 'chkRole' + i,
                        roleId: result.roles[i].Id,
                        checkBoxIndex: i,
                        boxLabel: result.roles[i].Name,
                        hideLabel: true,
                        checked: checked
                    });
                    roleCheckBoxCollection[i] = roleCheckBox;
                }

                for (var i = 0; i < result.countSubsystems; i++) {
                    var checked = false;
                    for (var j = 0; j < countUserSubsystems; j++) {
                        if (result.subsystems[i].Id == userSubsystems[j].Id) {
                            checked = true;
                            break;
                        }
                    }
                    subsystemCheckBox = new Ext.form.Checkbox({
                        name: 'chkSubsystem' + i,
                        checkBoxIndex: i,
                        subsystemId: result.subsystems[i].Id,
                        boxLabel: result.subsystems[i].Name,
                        hideLabel: true,
                        checked: checked
                    });
                    subsystemCheckBoxCollection[i] = subsystemCheckBox;
                }
                var grid = new Ext.erp.ux.user.roleGrid({
                    userId: id
                });
                var form = new Ext.erp.ux.user.Form({
                    items: [{
                        layout: 'column',
                        border: false,
                        width: 500,
                        bodyStyle: 'background-color:transparent;',
                        defaults: {
                            border: false,
                            bodyStyle: 'background-color:transparent;',
                            layout: 'form'
                        },
                        items: [
                            {
                                columnWidth: .65,
                                items: [{
                                    xtype: 'fieldset',
                                    anchor: '95%',
                                    title: 'User Data',
                                    AutoHeight: true,
                                    autoScroll: true,
                                    items: [{
                                        name: 'Id',
                                        xtype: 'hidden'
                                    }, {
                                        name: 'FirstName',
                                        xtype: 'textfield',
                                        fieldLabel: 'First Name',
                                        allowBlank: false
                                    }, {
                                        name: 'LastName',
                                        xtype: 'textfield',
                                        fieldLabel: 'Last Name',
                                        allowBlank: false
                                    }, {
                                        name: 'UserName',
                                        xtype: 'textfield',
                                        fieldLabel: 'User Name',
                                        allowBlank: false
                                    }, {
                                        name: 'Password',
                                        xtype: 'textfield',
                                        inputType: 'password',
                                        fieldLabel: 'Password',
                                        allowBlank: false,
                                        hidden:true
                                    }, {
                                        name: 'IsRevoked',
                                        xtype: 'checkbox',
                                        fieldLabel: 'Revoked'
                                    }]
                                }]
                            },
                        {
                            columnWidth: .35,
                            items: [{
                                xtype: 'fieldset',
                                title: 'User Subsystems',
                                anchor: '95%',

                                autoHeight: true,
                                autoScroll: true,
                                items: [subsystemCheckBoxCollection]
                            }]
                        }]
                    }]
                });
                new Ext.erp.ux.user.Window({
                    form: form,
                    // roles: roleCheckBoxCollection,
                    subsystems: subsystemCheckBoxCollection,
                    items: [form, grid],
                    userId: id,
                    title: 'Add User'
                }).show();
            })
        });
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('user-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected user',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    User.Delete(id, function (result, response) {
                        Ext.getCmp('user-paging').doRefresh();
                        if (!result.success) {
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
    onRecetClick: function () {
        var grid = Ext.getCmp('user-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to Reset the selected user Password',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    User.Reset(id, function (result, response) {
                        Ext.getCmp('user-paging').doRefresh();
                        if (result.success) {
                            Ext.MessageBox.show({
                                title: 'Passwored Reset',
                                msg: ' Reset Password successfully completed.',
                                buttons: {
                                    ok: 'Ok'
                                },
                                icon: Ext.MessageBox.SUCCESS,
                                scope: this,
                                animEl: 'success'
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
    }
});
Ext.reg('user-panel', Ext.erp.ux.user.Panel);


/**
* @desc      Role Selection window
* @author    Meftuh mohammed
* @copyright (c) 2014, Cybersoft
* @date      Feb 2, 2017
* @namespace Ext.erp.ux.user
* @class     Ext.erp.ux.user.roleSelectionWindow
* @extends   Ext.Window
*/
Ext.erp.ux.user.roleSelectionWindow = function (config) {
    Ext.erp.ux.user.roleSelectionWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 500,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
}
Ext.extend(Ext.erp.ux.user.roleSelectionWindow, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.user.roleSelectionGrid({
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
        Ext.erp.ux.user.roleSelectionWindow.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        var grid = Ext.getCmp('user-roleGrid');

        var selectionGrid = this.grid;
        if (!selectionGrid.getSelectionModel().hasSelection()) return;
        var selectedItems = selectionGrid.getSelectionModel().getSelections();
        var gridDatastore = grid.getStore();
        var item = gridDatastore.recordType;

        var totalCount = gridDatastore.getCount();
        var msg = '';
        var newitemadded = false;

        for (var i = 0; i < selectedItems.length; i++) {
            //check existence of item 
            var index = gridDatastore.findExact("Id", selectedItems[i].get('Id'))

            if (index == -1) { //if item does not exist in the already selected sales items list

                var p = new item({
                    Id: selectedItems[i].get('Id'),
                    Name: selectedItems[i].get('Name'),
                    RoleType: selectedItems[i].get('RoleType'),

                    StatusId: 2,
                    StatusName: 'Initial Issue'
                });
                newitemadded = true;
                var count = gridDatastore.getCount();
                gridDatastore.insert(count, p);

            }
        }


    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('user-roleSelectionWindow', Ext.erp.ux.user.roleSelectionWindow);
/**
* @desc      Role Selection grid
* @author    Meftuh Mohammed
* @copyright (c) 2014, Cybersoft
* @date      oct 16, 2014
* @namespace Ext.erp.ux.user
* @class     Ext.erp.ux.user.roleSelectionGrid
* @extends   Ext.grid.GridPanel
*/
var roleSelectionModel = new Ext.grid.CheckboxSelectionModel({
});

Ext.erp.ux.user.roleSelectionGrid = function (config) {
    Ext.erp.ux.user.roleSelectionGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Role.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },

            fields: ['Id', 'Name'],
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
        id: 'user-roleSelectionGrid',
        pageSize: 10,
        height: 280,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: roleSelectionModel,
        columns: [

        roleSelectionModel, new Ext.grid.RowNumberer(),
        {
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
            width: 240,
            menuDisabled: true
        }
        ]
    }, config));
};
Ext.extend(Ext.erp.ux.user.roleSelectionGrid, Ext.grid.GridPanel, {
    initComponent: function () {

        this.store.baseParams = { record: Ext.encode({ userids: this.userids }) };
        this.tbar = [

          '->',
        {
            xtype: 'tbfill'
        }, {
            xtype: 'textfield',
            emptyText: 'Type Search text here and press                                             "Enter"',
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
                        var grid = Ext.getCmp('user-roleSelectionGrid');

                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {

                        var grid = Ext.getCmp('user-roleSelectionGrid');

                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }
        ];
        this.bbar = new Ext.PagingToolbar({
            id: 'user-rolePaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.user.roleSelectionGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getSelectionModel().clearSelections();
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.ux.user.roleSelectionGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('user-roleSelectionGrid', Ext.erp.ux.user.roleSelectionGrid);

