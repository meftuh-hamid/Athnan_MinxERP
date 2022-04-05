Ext.ns('Ext.erp.ux.holiday');

/**
* @desc      holiday form

* @copyright (c) 2013, 
* @date      June 22, 2013
* @namespace Ext.erp.ux.holiday
* @class     Ext.erp.ux.holiday.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.holiday.Form = function (config) {
    Ext.erp.ux.holiday.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Holiday.Get,
            submit: Holiday.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'holiday-form',
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
            name: 'Description',
            xtype: 'textfield',
            fieldLabel: 'Description',
            width: 100,
            readOnly: false,
            allowBlank: false
        }, {
            name: 'Date',
            xtype: 'datefield',
            fieldLabel: 'Date',
            width: 100,
            readOnly: false,
            allowBlank: false
        }, {
            name: 'IsHalfDay',
            checked: true,
            xtype: 'checkbox',
            fieldLabel: 'Is Half Day?',
            width: 100,
            readOnly: false,
            allowBlank: true,
            checked: false
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
Ext.extend(Ext.erp.ux.holiday.Form, Ext.form.FormPanel);
Ext.reg('holiday-form', Ext.erp.ux.holiday.Form);

/**
* @desc      holiday registration form host window

* @copyright (c) 2020, 
* @date      January 27, 2011
* @namespace Ext.erp.ux.holiday
* @class     Ext.erp.ux.holiday.Window
* @extends   Ext.Window
*/
Ext.erp.ux.holiday.Window = function (config) {
    Ext.erp.ux.holiday.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.holidayId);
                if (typeof this.holidayId != "undefined" && this.holidayId!="") {
                    this.form.load({ params: { id: this.holidayId } });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.holiday.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.holiday.Form();
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
        Ext.erp.ux.holiday.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('holiday-form').getForm().reset();
                Ext.getCmp('holiday-paging').doRefresh();
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
Ext.reg('holiday-window', Ext.erp.ux.holiday.Window);



/**
* @desc      holiday Grid

* @copyright (c) 2013, 
* @date      June 22, 2013
* @namespace Ext.erp.ux.holiday
* @class     Ext.erp.ux.holiday.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.holiday.Grid = function (config) {
    Ext.erp.ux.holiday.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Holiday.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Description', 'Date','IsHalfDay', 'Remark'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('holiday-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('holiday-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('holiday-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'holiday-grid',
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
            dataIndex: 'Date',
            header: 'Date',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'IsHalfDay',
            header: 'Is Half Day?',
            sortable: true,
            width: 150,
            menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value)
                    return '<img src="Content/images/app/OkPass.png"/>';
                else
                    return '<img src="Content/images/app/Cancel1.png"/>';
            }
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.holiday.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({  }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Add',
            id: 'addHoliday',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Holiday', 'CanAdd'),
            handler: this.onAddClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            id: 'editHoliday',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Holiday', 'CanEdit'),
            handler: this.onEditClick
        }, {
            xtype: 'button',
            text: 'Delete',
            id: 'deleteHoliday',
            iconCls: 'icon-delete',
            hidden: false,
            disabled: !Ext.erp.ux.Reception.getPermission('Holiday', 'CanDelete'),
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
                        var grid = Ext.getCmp('holiday-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('holiday-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'holiday-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.holiday.Grid.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {

        new Ext.erp.ux.holiday.Window({
            mode: 'add',
            title: 'Add'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('holiday-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a Holiday to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var holidayId = grid.getSelectionModel().getSelected().get('Id');
        var parentId = grid.parentId;
        new Ext.erp.ux.holiday.Window({
            title: 'Edit Holiday',
            holidayId: holidayId,
            mode: 'edit'
        }).show();
    },

    onDeleteClick: function () {
     
        var grid = Ext.getCmp('holiday-grid');
        var holidayId = grid.getSelectionModel().getSelected().get('Id');

        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Holiday',
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
                        msg: 'Deleting this Holiday could make other related data invalid. Press Ok to delete, Press Cancel to abort.',
                        buttons: {
                            ok: 'Ok',
                            cancel: 'Cancel'
                        },
                        icon: Ext.MessageBox.WARNING,
                        scope: this,
                        fn: function (btn) {
                            if (btn == 'ok') {
                                Holiday.Delete(holidayId, function (result) {
                                    if (result.success) {
                                        Ext.getCmp('holiday-paging').doRefresh();
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
        Ext.erp.ux.holiday.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('holiday-Grid', Ext.erp.ux.holiday.Grid);



/**
* @desc      holiday panel

* @copyright (c) 2013, 
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.holiday
* @class     Ext.erp.ux.holiday.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.holiday.Panel = function (config) {
    Ext.erp.ux.holiday.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'holiday-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.holiday.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.holiday.Grid();
        this.items = [this.grid];
        Ext.erp.ux.holiday.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('holiday-panel', Ext.erp.ux.holiday.Panel);
