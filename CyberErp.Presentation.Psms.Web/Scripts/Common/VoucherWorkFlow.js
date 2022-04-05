Ext.ns('Ext.erp.ux.voucherWorkFlow');

/**
* @desc      voucherWorkFlow form
* @author    Meftuh Mohammed
* @copyright (c) 2013, 
* @date      June 22, 2013
* @namespace Ext.erp.ux.voucherWorkFlow
* @class     Ext.erp.ux.voucherWorkFlow.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.voucherWorkFlow.Form = function (config) {
    Ext.erp.ux.voucherWorkFlow.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: VoucherWorkFlow.Get,
            submit: VoucherWorkFlow.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'voucherWorkFlow-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        voucherTypeChange: function () {
            var form = Ext.getCmp('voucherWorkFlow-form').getForm();

            var voucherTypeId = form.findField('VoucherTypeId').getValue();
            var voucherTypeName = form.findField('VoucherName').getValue();
            var categoryName = form.findField('VoucherCategory').getValue();
            if (voucherTypeName == "SIV" || voucherTypeName == "TIV" || voucherTypeName == "TRV") {

                form.findField('VoucherCategory').setVisible(true);
                form.findField('VoucherCategory').allowBlank = trues;
                var categoryCombo = form.findField('VoucherCategory');
                categoryCombo.store.load({
                    params: { table: 'lupRequestPurpose' },

                });
            }
            else if (voucherTypeName == "GRN") {
                form.findField('VoucherCategory').setVisible(true);
                form.findField('VoucherCategory').allowBlank = true;
                var categoryCombo = form.findField('VoucherCategory');
                categoryCombo.store.load({ params: { table: 'lupReceiveType' } });
            }
            else if (voucherTypeName == "RN") {
                form.findField('VoucherCategory').setVisible(true);
                form.findField('VoucherCategory').allowBlank = true;
                var categoryCombo = form.findField('VoucherCategory');
                categoryCombo.store.load({ params: { table: 'lupReturnType' } });
            }
            else if (voucherTypeName == "ADN") {
                form.findField('VoucherCategory').setVisible(true);
                form.findField('VoucherCategory').allowBlank = true;
                var categoryCombo = form.findField('VoucherCategory');
                categoryCombo.store.load({ params: { table: 'lupAdjustmentType' } });
            }
            else {
                 var categoryCombo = form.findField('VoucherCategory');
                categoryCombo.clearValue();
                form.findField('VoucherCategory').setVisible(false);
                form.findField('VoucherCategory').allowBlank = true;


            }
        },
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'SubSystemId',
            xtype: 'hidden'
        }, {
            name: 'VoucherTypeId',
            xtype: 'hidden'
        }, {
            name: 'VoucherStatusId',
            xtype: 'hidden'
        }, {
            name: 'VoucherCategoryId',
            xtype: 'hidden'
        }, {
            name: 'StoreId',
            xtype: 'hidden'
        }, {
            name: 'CreatedAt',
            xtype: 'hidden'
        }, {
            name: 'VoucherName',
            xtype: 'hidden'
        }, {
            name: 'VoucherType',
            hiddenName: 'VoucherType',
            xtype: 'combo',
            fieldLabel: 'Voucher Type',
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
                api: { read: Psms.GetVoucherType }
            }),
            valueField: 'Id',
            displayField: 'Description',
            listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('voucherWorkFlow-form').getForm();
                    form.findField("VoucherTypeId").setValue(rec.id);
                    form.findField("VoucherName").setValue(rec.data['Name']);
                    Ext.getCmp('voucherWorkFlow-form').voucherTypeChange();
                },
            }
        }, {
            hiddenName: 'VoucherCategory',
            name: 'VoucherCategory',
            xtype: 'combo',
            fieldLabel: 'Category',
            id: 'Voucher Category',
            triggerAction: 'all',
            mode: 'local',
            hidden: true,
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
                paramOrder: ['table'],
                api: { read: Psms.GetAll }
            }),
            valueField: 'Name',
            displayField: 'Name',
            listeners: {
                'select': function (cmb, rec, idx) {
                    var form = Ext.getCmp('voucherWorkFlow-form').getForm();
                    form.findField("VoucherCategoryId").setValue(rec.id);
                }
            }
        }, {
            name: 'VoucherStatus',
            hiddenName: 'VoucherStatus',
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
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: Psms.GetVoucherStatus }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('voucherWorkFlow-form').getForm();
                    form.findField("VoucherStatusId").setValue(rec.id);
                    form.findField("Description").setValue(rec.data['Name']);
                },
            }
        }, {
            name: 'Description',
            xtype: 'textfield',
            fieldLabel: 'Description',
            width: 100,
            readOnly: false,
            allowBlank: true
        },  {
            hiddenName: 'Step',
            xtype: 'combo',
            fieldLabel: 'Step',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            hidden: false,
            forceSelection: false,
            emptyText: '---Select---',
            allowBlank: false,
            store: new Ext.data.ArrayStore({
                fields: ['Id', 'Name'],
                idProperty: 'Id',
                data: [
                    [1, 1],
                    [2, 2],
                    [3, 3],
                    [4, 4],
                    [5, 5],
                    [6, 6],
                    [7, 7],
                    [8, 8],
                    [9, 9],
                    [10, 10],

                ]
            }),
            valueField: 'Id',
            displayField: 'Name',
        }, {
            name: 'Remark',
            xtype: 'textarea',
            fieldLabel: 'Remark',
            width: 100,
            readOnly: false,
            allowBlank: true
        }, ]
    }, config));
};
Ext.extend(Ext.erp.ux.voucherWorkFlow.Form, Ext.form.FormPanel);
Ext.reg('voucherWorkFlow-form', Ext.erp.ux.voucherWorkFlow.Form);

/**
* @desc      voucherWorkFlow registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2020, 
* @date      January 27, 2011
* @namespace Ext.erp.ux.voucherWorkFlow
* @class     Ext.erp.ux.voucherWorkFlow.Window
* @extends   Ext.Window
*/
Ext.erp.ux.voucherWorkFlow.Window = function (config) {
    Ext.erp.ux.voucherWorkFlow.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.voucherWorkFlowId);
                if (typeof this.voucherWorkFlowId != "undefined" && this.voucherWorkFlowId != "") {

                    this.form.load({
                        params: { id: this.voucherWorkFlowId },
                        success: function () {
                            Ext.getCmp('voucherWorkFlow-form').voucherTypeChange();
                        }
                    });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.voucherWorkFlow.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.voucherWorkFlow.Form();
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
        Ext.erp.ux.voucherWorkFlow.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('voucherWorkFlow-form').getForm().reset();
                Ext.getCmp('voucherWorkFlow-paging').doRefresh();
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
Ext.reg('voucherWorkFlow-window', Ext.erp.ux.voucherWorkFlow.Window);



/**
* @desc      voucherWorkFlow Grid
* @author    Meftuh Mohammed
* @copyright (c) 2013, 
* @date      June 22, 2013
* @namespace Ext.erp.ux.voucherWorkFlow
* @class     Ext.erp.ux.voucherWorkFlow.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.voucherWorkFlow.Grid = function (config) {
    Ext.erp.ux.voucherWorkFlow.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.GroupingStore({
            proxy: new Ext.data.DirectProxy({
                directFn: VoucherWorkFlow.GetAll,
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
                fields: ['Id', 'Description','Step','VoucherType', 'VoucherStatus', 'Remark'],
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
        id: 'voucherWorkFlow-grid',
        selectedUnitTypeId: 0,
        pageSize: 50,
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
            header: 'Voucher Type',
            sortable: true,
            hidden: true,
            width: 150,
            menuDisabled: true
        },  {
            dataIndex: 'Description',
            header: 'Description',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'VoucherStatus',
            header: 'Voucher Status',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Step',
            header: 'Step',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Remark',
            header: 'Remark',
            sortable: true,
            width: 150,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.voucherWorkFlow.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [{
            xtype: 'button',
            text: 'Add',
            id: 'addvoucherWorkFlow',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Voucher Work Flow', 'CanAdd'),
            handler: this.onAddClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            id: 'editvoucherWorkFlow',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Voucher Work Flow', 'CanEdit'),
            handler: this.onEditClick
        }, {
            xtype: 'button',
            text: 'Delete',
            id: 'deletevoucherWorkFlow',
            iconCls: 'icon-delete',
            hidden: false,
            disabled: !Ext.erp.ux.Reception.getPermission('Voucher Work Flow', 'CanDelete'),
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
                        var grid = Ext.getCmp('voucherWorkFlow-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('voucherWorkFlow-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'voucherWorkFlow-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.voucherWorkFlow.Grid.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {

        new Ext.erp.ux.voucherWorkFlow.Window({
            mode: 'add',
            title: 'Add Voucher Work Flow'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('voucherWorkFlow-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a voucherWorkFlow to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var voucherWorkFlowId = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.ux.voucherWorkFlow.Window({
            title: 'Edit Voucher Work Flow',
            voucherWorkFlowId: voucherWorkFlowId,
            mode: 'edit'
        }).show();
    },

    onDeleteClick: function () {
        var grid = Ext.getCmp('voucherWorkFlow-grid');
        var voucherWorkFlowId = grid.getSelectionModel().getSelected().get('Id');

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
                    VoucherWorkFlow.Delete(voucherWorkFlowId, function (result) {
                        if (result.success) {
                            Ext.getCmp('voucherWorkFlow-paging').doRefresh();
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
        Ext.erp.ux.voucherWorkFlow.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('voucherWorkFlow-Grid', Ext.erp.ux.voucherWorkFlow.Grid);



/**
* @desc      voucherWorkFlow panel
* @author    Meftuh Mohammed
* @copyright (c) 2013, 
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.voucherWorkFlow
* @class     Ext.erp.ux.voucherWorkFlow.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.voucherWorkFlow.Panel = function (config) {
    Ext.erp.ux.voucherWorkFlow.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'voucherWorkFlow-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.voucherWorkFlow.Panel, Ext.Panel, {
    initComponent: function () {
       this.grid = new Ext.erp.ux.voucherWorkFlow.Grid();
        this.items = [this.grid];
        Ext.erp.ux.voucherWorkFlow.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('voucherWorkFlow-panel', Ext.erp.ux.voucherWorkFlow.Panel);
