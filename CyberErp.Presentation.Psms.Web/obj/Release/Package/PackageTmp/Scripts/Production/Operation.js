Ext.ns('Ext.erp.ux.operation');

/**
* @desc      operation form

* @copyright (c) 2013, 
* @date      June 22, 2013
* @namespace Ext.erp.ux.operation
* @class     Ext.erp.ux.operation.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.operation.Form = function (config) {
    Ext.erp.ux.operation.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Operation.Get,
            submit: Operation.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'operation-form',
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
            name: 'WorkStationId',
            xtype: 'hidden'
        }, {
            name: 'Name',
            xtype: 'textfield',
            fieldLabel: 'Name',
            width: 100,
            readOnly: false,
            allowBlank: false
        }, {
            name: 'Description',
            xtype: 'textfield',
            fieldLabel: 'Description',
            width: 100,
            readOnly: false,
            allowBlank: false
        }, {
            hiddenName: 'WorkStation',
            xtype: 'combo',
            fieldLabel: 'Work Station',
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
                api: { read: Psms.GetWorkStation }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('operation-form').getForm();
                    form.findField("WorkStationId").setValue(rec.id);
                },
            }
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
Ext.extend(Ext.erp.ux.operation.Form, Ext.form.FormPanel);
Ext.reg('operation-form', Ext.erp.ux.operation.Form);

/**
* @desc      operation registration form host window

* @copyright (c) 2020, 
* @date      January 27, 2011
* @namespace Ext.erp.ux.operation
* @class     Ext.erp.ux.operation.Window
* @extends   Ext.Window
*/
Ext.erp.ux.operation.Window = function (config) {
    Ext.erp.ux.operation.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.operationId);
                if (typeof this.operationId != "undefined" && this.operationId!="") {
                    this.form.load({ params: { id: this.operationId } });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.operation.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.operation.Form();
        this.items = [this.form];
        this.buttons = [{
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
        Ext.erp.ux.operation.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('operation-form').getForm().reset();
                Ext.getCmp('operation-paging').doRefresh();
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
Ext.reg('operation-window', Ext.erp.ux.operation.Window);



/**
* @desc      operation Grid

* @copyright (c) 2013, 
* @date      June 22, 2013
* @namespace Ext.erp.ux.operation
* @class     Ext.erp.ux.operation.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.operation.Grid = function (config) {
    Ext.erp.ux.operation.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Operation.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Description', 'WorkStation','Remark'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('operation-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('operation-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('operation-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'operation-grid',
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
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Description',
            header: 'Description',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'WorkStation',
            header: 'Work Station',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, ]
    }, config));
}
Ext.extend(Ext.erp.ux.operation.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({  }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Add',
            id: 'addOperation',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Operation', 'CanAdd'),
            handler: this.onAddClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            id: 'editOperation',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Operation', 'CanEdit'),
            handler: this.onEditClick
        }, {
            xtype: 'button',
            text: 'Delete',
            id: 'deleteOperation',
            iconCls: 'icon-delete',
            hidden: false,
            disabled: !Ext.erp.ux.Reception.getPermission('Operation', 'CanDelete'),
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
                        var grid = Ext.getCmp('operation-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('operation-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'operation-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.operation.Grid.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {

        new Ext.erp.ux.operation.Window({
            mode: 'add',
            title: 'Add'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('operation-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a Operation to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var operationId = grid.getSelectionModel().getSelected().get('Id');
        var parentId = grid.parentId;
        new Ext.erp.ux.operation.Window({
            title: 'Edit Operation',
            operationId: operationId,
            mode: 'edit'
        }).show();
    },

    onDeleteClick: function () {
     
        var grid = Ext.getCmp('operation-grid');
        var operationId = grid.getSelectionModel().getSelected().get('Id');

        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Operation',
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
                        msg: 'Deleting this Operation could make other related data invalid. Press Ok to delete, Press Cancel to abort.',
                        buttons: {
                            ok: 'Ok',
                            cancel: 'Cancel'
                        },
                        icon: Ext.MessageBox.WARNING,
                        scope: this,
                        fn: function (btn) {
                            if (btn == 'ok') {
                                Operation.Delete(operationId, function (result) {
                                    if (result.success) {
                                        Ext.getCmp('operation-paging').doRefresh();
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
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.operation.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('operation-Grid', Ext.erp.ux.operation.Grid);



/**
* @desc      operation panel

* @copyright (c) 2013, 
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.operation
* @class     Ext.erp.ux.operation.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.operation.Panel = function (config) {
    Ext.erp.ux.operation.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'operation-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.operation.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.operation.Grid();
        this.items = [this.grid];
        Ext.erp.ux.operation.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('operation-panel', Ext.erp.ux.operation.Panel);
