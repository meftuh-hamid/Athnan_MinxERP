Ext.ns('Ext.erp.ux.approver');

/**
* @desc      approver form
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.approver
* @class     Ext.erp.ux.approver.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.approver.Form = function (config) {
    Ext.erp.ux.approver.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Approver.Get,
            submit: Approver.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'approver-form',
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
            name: 'VoucherTypeId',
            xtype: 'hidden'
        }, {
            name: 'StoreId',
            xtype: 'hidden'
        }, {
            name: 'StatusId',
            xtype: 'hidden'
        }, {
            hiddenName: 'VoucherType',
            xtype: 'combo',
            fieldLabel: 'Type',
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
                api: { read: Psms.GetVoucherType }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('approver-form').getForm();
                    form.findField("VoucherTypeId").setValue(rec.id);
                },
            }
        }, {
            xtype: 'hidden',
            name: 'EmployeeId'
        }, {
            xtype: 'compositefield',
            name: 'approver',
            fieldLabel: 'Approver',
            defaults: {
                flex: 1
            },
            items: [ {
                hiddenName: 'Approver',
                xtype: 'combo',
                fieldLabel: 'Approver',
                typeAhead: true,
                hideTrigger: true,
                minChars: 2,
                listWidth: 280,
                emptyText: '---Type to Search---',
                mode: 'remote',
                allowBlank: false,
                tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name']
                    }),
                    autoLoad: true,
                    api: { read: Psms.GetEmployeeBySearch }
                }),
                valueField: 'Name',
                displayField: 'Name',
                pageSize: 10, listeners: {
                    select: function (cmb, rec, idx) {
                        var form = Ext.getCmp('approver-form').getForm();
                        form.findField('EmployeeId').setValue(rec.id);
                    },
                    change: function (cmb, newvalue, oldvalue) {
                        if (newvalue == "") {
                            var form = Ext.getCmp('approver-form').getForm();
                            form.findField('EmployeeId').reset();

                        }
                    }
                }
            }, {
                xtype: 'button',
                id: 'findEmployee',
                iconCls: 'icon-filter',
                width: 25,
                handler: function () {
                    var form = Ext.getCmp('approver-form').getForm();
                    new Ext.erp.ux.common.EmployeeWindow({
                        parentForm: form,
                        controlIdField: 'EmployeeId',
                        controlNameField: 'Approver'
                    }).show();
                }
            }]
        }, {
            name: 'Status',
            hiddenName: 'Status',
            xtype: 'combo',
            fieldLabel: 'Voucher Status',
            anchor: '95%',
            triggerAction: 'all',
            mode: 'local',
            width: 100,
            editable: false,
            typeAhead: false,
            forceSelection: true,
            selectOnFocus: true,
            emptyText: '---Select---',
            allowBlank: false,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Description', 'Name']
                }),
                autoLoad: true,
                api: { read: Psms.GetVoucherStatus }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('approver-form').getForm();
                    form.findField("StatusId").setValue(rec.id);
                },
            }
        }, {
            hiddenName: 'Store',
            xtype: 'combo',
            fieldLabel: 'Store',
            typeAhead: true,
            width: 100,
            hideTrigger: true,
            minChars: 2,
            listWidth: 280,
            emptyText: '---Type to Search---',
            mode: 'remote',
            allowBlank: true,
            hidden: false,
            tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: Psms.GetStoreBySearch }
            }),
            valueField: 'Name',
            displayField: 'Name',
            pageSize: 10,
            listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('approver-form').getForm();
                    form.findField('StoreId').setValue(rec.id);
                },
                change: function (cmb, newvalue, oldvalue) {
                    if (newvalue == "") {
                        var form = Ext.getCmp('approver-form').getForm();
                        form.findField('StoreId').reset();

                    }
                }
            }
        }, {
            xtype: 'hidden',
            name: 'UnitId'
        }, {
            xtype: 'compositefield',
            name: 'compositeUnit',
            fieldLabel: 'Unit',
            hidden: false,
            defaults: {
                flex: 1
            },
            items: [{
                name: 'Unit',
                xtype: 'textfield',
                fieldLabel: 'Unit',
                readonly: true,
                allowBlank: true
            }, {
                xtype: 'button',
                id: 'findUnit',
                iconCls: 'icon-filter',
                width: 20,
                handler: function () {
                    var form = Ext.getCmp('approver-form').getForm();
                    new Ext.erp.ux.common.UnitWindow({
                        parentForm: form,
                        controlIdField: 'UnitId',
                        controlNameField: 'Unit'
                    }).show();
                }
            }]
        }, {
            name: 'IsSupperApprover',
            xtype: 'checkbox',
            boxLabel: 'Is Supper Approver'
        }, {
            name: 'Criteria',
            xtype: 'textarea',
            fieldLabel: 'Criteria',
            readOnly: false,
            allowBlank: true
        }, ]
    }, config));
};
Ext.extend(Ext.erp.ux.approver.Form, Ext.form.FormPanel);
Ext.reg('approver-form', Ext.erp.ux.approver.Form);

/**
* @desc      approver registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      January 27, 2011
* @namespace Ext.erp.ux.approver
* @class     Ext.erp.ux.approver.Window
* @extends   Ext.Window
*/
Ext.erp.ux.approver.Window = function (config) {
    Ext.erp.ux.approver.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 700,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.approverId);
                if (typeof this.approverId != "undefined" && this.approverId!="") {
                    this.form.load({ params: { id: this.approverId } });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.approver.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.approver.Form();
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
        Ext.erp.ux.approver.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('approver-form').getForm().reset();
                Ext.getCmp('approver-paging').doRefresh();
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
Ext.reg('approver-window', Ext.erp.ux.approver.Window);



/**
* @desc      approver Grid
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.approver
* @class     Ext.erp.ux.approver.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.approver.Grid = function (config) {
    Ext.erp.ux.approver.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.GroupingStore({
            proxy: new Ext.data.DirectProxy({
                directFn: Approver.GetAll,
                paramsAsHash: false,
                paramOrder: 'start|limit|sort|dir|record',
            }),
            reader: new Ext.data.JsonReader({
                root: 'data',
                idProperty: 'Id',
                totalProperty: 'total',
                sortInfo: {
                    field: 'VoucherType',
                    direction: 'ASC'
                },
                fields: ['Id', 'VoucherType', 'Approver', 'Criteria','IsSupperApprover', 'Status', 'Unit', 'Store'],
            }),
            groupField: 'VoucherType',
            sortInfo: {
                field: 'VoucherType',
                direction: 'ASC'
            },
            remoteSort: true,
            listeners: {
                beforeLoad: function () { this.body.mask('Loading...', 'x-mask-loading'); },
                load: function () { this.body.unmask(); },
                loadException: function () { this.body.unmask(); },
                scope: this
            }
        }),
        view: new Ext.grid.GroupingView({
            forceFit: true,
            showGroupName: false,
            groupTextTpl: '{text}'
        }),
        id: 'approver-grid',
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
            dataIndex: 'VoucherType',
            header: 'Type',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Status',
            header: 'Voucher Status',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Approver',
            header: 'Approver',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Store',
            header: 'Store',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Unit',
            header: 'Unit',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'IsSupperApprover',
            header: 'Is Supper Approver?',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Criteria',
            header: 'Criteria',
            sortable: true,
            width: 150,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.approver.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({  }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Add',
            id: 'addApprover',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Approver', 'CanAdd'),
            handler: this.onAddClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            id: 'editApprover',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Approver', 'CanEdit'),
            handler: this.onEditClick
        }, {
            xtype: 'button',
            text: 'Delete',
            id: 'deleteApprover',
            iconCls: 'icon-delete',
            hidden: false,
            disabled: !Ext.erp.ux.Reception.getPermission('Approver', 'CanDelete'),
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
                        var grid = Ext.getCmp('approver-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('approver-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'approver-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.approver.Grid.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {

        new Ext.erp.ux.approver.Window({
            mode: 'add',
            title: 'Add'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('approver-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a Approver to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var approverId = grid.getSelectionModel().getSelected().get('Id');
        var parentId = grid.parentId;
        new Ext.erp.ux.approver.Window({
            title: 'Edit Approver',
            approverId: approverId,
            mode: 'edit'
        }).show();
    },

    onDeleteClick: function () {
     
        var grid = Ext.getCmp('approver-grid');
        var approverId = grid.getSelectionModel().getSelected().get('Id');

        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Approver',
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
                        msg: 'Deleting this Approver could make other related data invalid. Press Ok to delete, Press Cancel to abort.',
                        buttons: {
                            ok: 'Ok',
                            cancel: 'Cancel'
                        },
                        icon: Ext.MessageBox.WARNING,
                        scope: this,
                        fn: function (btn) {
                            if (btn == 'ok') {
                                Approver.Delete(approverId, function (result) {
                                    if (result.success) {
                                        Ext.getCmp('approver-paging').doRefresh();
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
        Ext.erp.ux.alternativeItem.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('approver-Grid', Ext.erp.ux.approver.Grid);



/**
* @desc      approver panel
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.approver
* @class     Ext.erp.ux.approver.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.approver.Panel = function (config) {
    Ext.erp.ux.approver.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'approver-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.approver.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.approver.Grid();
        this.items = [this.grid];
        Ext.erp.ux.approver.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('approver-panel', Ext.erp.ux.approver.Panel);