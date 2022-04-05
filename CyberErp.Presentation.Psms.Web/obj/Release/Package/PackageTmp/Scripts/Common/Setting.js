Ext.ns('Ext.erp.ux.setting');

/**
* @desc      setting form
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.setting
* @class     Ext.erp.ux.setting.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.setting.Form = function (config) {
    Ext.erp.ux.setting.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Setting.Get,
            submit: Setting.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'setting-form',
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
            readOnly: false,
            allowBlank: false
        }, {
            name: 'Value',
            xtype: 'textfield',
            fieldLabel: 'Value',
            width: 100,
            readOnly: false,
            allowBlank: false
        }, {
            name: 'Remark',
            xtype: 'textarea',
            fieldLabel: 'Remark',
            width: 100,
            readOnly: false,
            allowBlank: false
        }, ]
    }, config));
};
Ext.extend(Ext.erp.ux.setting.Form, Ext.form.FormPanel);
Ext.reg('setting-form', Ext.erp.ux.setting.Form);

/**
* @desc      setting registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      January 27, 2011
* @namespace Ext.erp.ux.setting
* @class     Ext.erp.ux.setting.Window
* @extends   Ext.Window
*/
Ext.erp.ux.setting.Window = function (config) {
    Ext.erp.ux.setting.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.settingId);
                if (typeof this.settingId != "undefined" && this.settingId != "") {
                
                    this.form.load({ params: { id: this.settingId } });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.setting.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.setting.Form();
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
        Ext.erp.ux.setting.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('setting-form').getForm().reset();
                Ext.getCmp('setting-paging').doRefresh();
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
    onClose: function () {
        this.close();
    }
});
Ext.reg('setting-window', Ext.erp.ux.setting.Window);



/**
* @desc      setting Grid
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.setting
* @class     Ext.erp.ux.setting.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.setting.Grid = function (config) {
    Ext.erp.ux.setting.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Setting.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Value', 'Remark'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('setting-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('setting-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('setting-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'setting-grid',
        selectedUnitTypeId: 0,
        pageSize: 10,
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
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Value',
            header: 'Value',
            sortable: true,
            width: 150,
            menuDisabled: true
        },  {
            dataIndex: 'Remark',
            header: 'Remark',
            sortable: true,
            width: 150,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.setting.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({  }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Add',
            id: 'addSetting',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Setting', 'CanAdd'),
            handler: this.onAddClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            id: 'editSetting',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Setting', 'CanEdit'),
            handler: this.onEditClick
        }, {
            xtype: 'button',
            text: 'Delete',
            id: 'deleteSetting',
            iconCls: 'icon-delete',
            hidden: false,
            disabled: !Ext.erp.ux.Reception.getPermission('Setting', 'CanDelete'),
            handler: this.onDeleteClick
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
                        var grid = Ext.getCmp('setting-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('setting-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'setting-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.setting.Grid.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        
        new Ext.erp.ux.setting.Window({
            mode: 'add',
            title: 'Add Setting'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('setting-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a Setting to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var settingId = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.ux.setting.Window({
            title: 'Edit Setting',
            settingId: settingId,          
            mode: 'edit'
        }).show();
    },

    onDeleteClick: function () {
        var grid = Ext.getCmp('setting-grid');
        var settingId = grid.getSelectionModel().getSelected().get('Id');

        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected TaxR ate',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            animEl: 'delete',
            fn: function (btn) {
                if (btn == 'ok') {
                    Setting.Delete(settingId, function (result) {
                        if (result.success) {
                            Ext.getCmp('setting-paging').doRefresh();
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
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.setting.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('setting-Grid', Ext.erp.ux.setting.Grid);



/**
* @desc      setting panel
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.setting
* @class     Ext.erp.ux.setting.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.setting.Panel = function (config) {
    Ext.erp.ux.setting.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'setting-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.setting.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.setting.Grid();
        this.items = [this.grid];
        Ext.erp.ux.setting.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('setting-panel', Ext.erp.ux.setting.Panel);
