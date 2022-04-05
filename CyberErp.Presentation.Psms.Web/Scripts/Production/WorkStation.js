Ext.ns('Ext.erp.ux.workStation');

/**
* @desc      workStation form

* @copyright (c) 2013, 
* @date      June 22, 2013
* @namespace Ext.erp.ux.workStation
* @class     Ext.erp.ux.workStation.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.workStation.Form = function (config) {
    Ext.erp.ux.workStation.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: WorkStation.Get,
            submit: WorkStation.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'workStation-form',
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
            name: 'ElectricityCostPerHour',
            xtype: 'numberfield',
            fieldLabel: 'Electricity Cost Per Hour',
            width: 100,
            readOnly: false,
            allowBlank: false
        }, {
            name: 'ConsumableCostPerHour',
            xtype: 'numberfield',
            fieldLabel: 'Consumable Cost Per Hour',
            width: 100,
            readOnly: false,
            allowBlank: false
        }, {
            name: 'RentCostPerHour',
            xtype: 'numberfield',
            fieldLabel: 'Rent Cost Per Hour',
            width: 100,
            readOnly: false,
            allowBlank: false
        }, {
            name: 'WageCostPerHour',
            xtype: 'numberfield',
            fieldLabel: 'Wage Cost Per Hour',
            width: 100,
            readOnly: false,
            allowBlank: false
        }, {
            name: 'TotalCostPerHour',
            xtype: 'numberfield',
            fieldLabel: 'Net Per Hour',
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
Ext.extend(Ext.erp.ux.workStation.Form, Ext.form.FormPanel);
Ext.reg('workStation-form', Ext.erp.ux.workStation.Form);

/**
* @desc      workStation registration form host window

* @copyright (c) 2020, 
* @date      January 27, 2011
* @namespace Ext.erp.ux.workStation
* @class     Ext.erp.ux.workStation.Window
* @extends   Ext.Window
*/
Ext.erp.ux.workStation.Window = function (config) {
    Ext.erp.ux.workStation.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.workStationId);
                if (typeof this.workStationId != "undefined" && this.workStationId!="") {
                    this.form.load({ params: { id: this.workStationId } });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.workStation.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.workStation.Form();
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
        Ext.erp.ux.workStation.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('workStation-form').getForm().reset();
                Ext.getCmp('workStation-paging').doRefresh();
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
Ext.reg('workStation-window', Ext.erp.ux.workStation.Window);



/**
* @desc      workStation Grid

* @copyright (c) 2013, 
* @date      June 22, 2013
* @namespace Ext.erp.ux.workStation
* @class     Ext.erp.ux.workStation.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.workStation.Grid = function (config) {
    Ext.erp.ux.workStation.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: WorkStation.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Description', 'ElectricityCostPerHour', 'ConsumableCostPerHour', 'RentCostPerHour', 'WageCostPerHour', 'TotalCostPerHour', 'Remark'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('workStation-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('workStation-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('workStation-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'workStation-grid',
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
            dataIndex: 'ElectricityCostPerHour',
            header: 'Electricity',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'ConsumableCostPerHour',
            header: 'Consumable',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'RentCostPerHour',
            header: 'Rent',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'WageCostPerHour',
            header: 'Wage',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'TotalCostPerHour',
            header: 'Net',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, ]
    }, config));
}
Ext.extend(Ext.erp.ux.workStation.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({  }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Add',
            id: 'addWorkStation',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Station', 'CanAdd'),
            handler: this.onAddClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            id: 'editWorkStation',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Station', 'CanEdit'),
            handler: this.onEditClick
        }, {
            xtype: 'button',
            text: 'Delete',
            id: 'deleteWorkStation',
            iconCls: 'icon-delete',
            hidden: false,
            disabled: !Ext.erp.ux.Reception.getPermission('Station', 'CanDelete'),
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
                        var grid = Ext.getCmp('workStation-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('workStation-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'workStation-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.workStation.Grid.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {

        new Ext.erp.ux.workStation.Window({
            mode: 'add',
            title: 'Add'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('workStation-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a WorkStation to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var workStationId = grid.getSelectionModel().getSelected().get('Id');
        var parentId = grid.parentId;
        new Ext.erp.ux.workStation.Window({
            title: 'Edit WorkStation',
            workStationId: workStationId,
            mode: 'edit'
        }).show();
    },

    onDeleteClick: function () {
     
        var grid = Ext.getCmp('workStation-grid');
        var workStationId = grid.getSelectionModel().getSelected().get('Id');

        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected WorkStation',
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
                        msg: 'Deleting this WorkStation could make other related data invalid. Press Ok to delete, Press Cancel to abort.',
                        buttons: {
                            ok: 'Ok',
                            cancel: 'Cancel'
                        },
                        icon: Ext.MessageBox.WARNING,
                        scope: this,
                        fn: function (btn) {
                            if (btn == 'ok') {
                                WorkStation.Delete(workStationId, function (result) {
                                    if (result.success) {
                                        Ext.getCmp('workStation-paging').doRefresh();
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
        Ext.erp.ux.workStation.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('workStation-Grid', Ext.erp.ux.workStation.Grid);



/**
* @desc      workStation panel

* @copyright (c) 2013, 
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.workStation
* @class     Ext.erp.ux.workStation.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.workStation.Panel = function (config) {
    Ext.erp.ux.workStation.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'workStation-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.workStation.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.workStation.Grid();
        this.items = [this.grid];
        Ext.erp.ux.workStation.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('workStation-panel', Ext.erp.ux.workStation.Panel);
