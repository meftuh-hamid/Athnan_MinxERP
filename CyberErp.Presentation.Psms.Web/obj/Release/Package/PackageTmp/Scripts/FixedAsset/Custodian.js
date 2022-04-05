Ext.ns('Ext.erp.ux.custodian');

/**
* @desc      custodian form
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.custodian
* @class     Ext.erp.ux.custodian.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.custodian.Form = function (config) {
    Ext.erp.ux.custodian.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Custodian.Get,
            submit: Custodian.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'custodian-form',
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
            name: 'ConsumerTypeId',
            xtype: 'hidden'
        }, {
            name: 'ItemSerialId',
            xtype: 'hidden'
        }, {
            name: 'VoucherHeaderId',
            xtype: 'hidden'
        }, {
            name: 'VoucherTypeId',
            xtype: 'hidden'
        }, {
            hiddenName: 'ConsumerType',
            xtype: 'combo',
            fieldLabel: 'Consumer Type',
            triggerAction: 'all',
            mode: 'remote',
            editable: false,
            forceSelection: true,
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
                api: { read: Psms.GetConsumerType }
            }),
            valueField: 'Name',
            displayField: 'Name',
            listeners: {
                scope: this,
                select: function (cmb, rec) {
                    var form = Ext.getCmp('custodian-form').getForm();
                    form.findField('ConsumerTypeId').setValue(rec.id);
                    //if Customer type is Store
                    if (rec.get("Name") == 'Store') {
                        form.findField('compositeEmployee').hide();
                        form.findField('compositeUnit').hide();
                        form.findField('compositeStore').show();

                        form.findField('ConsumerStore').allowBlank = false;
                        form.findField('ConsumerEmployee').allowBlank = true;
                        form.findField('ConsumerUnit').allowBlank = true;

                        form.findField('ConsumerEmployee').setValue('');
                        form.findField('ConsumerEmployeeId').setValue('');
                        form.findField('ConsumerUnit').setValue('');
                        form.findField('ConsumerUnitId').setValue('');
                    }
                        //if Customer type is employee
                    else if (rec.get("Name") == 'Employee') {
                        form.findField('compositeEmployee').show();
                        form.findField('compositeStore').hide();
                        form.findField('compositeUnit').hide();
                        form.findField('ConsumerStore').allowBlank = true;
                        form.findField('ConsumerEmployee').allowBlank = false;
                        form.findField('ConsumerUnit').allowBlank = true;


                        form.findField('ConsumerUnit').setValue('');
                        form.findField('ConsumerUnitId').setValue('');
                        form.findField('ConsumerStore').setValue('');
                        form.findField('ConsumerStoreId').setValue('');
                    } //if Customer type is unit
                    else if (rec.get("Name") == 'Unit') {
                        form.findField('compositeEmployee').hide();
                        form.findField('compositeUnit').show();
                        form.findField('compositeStore').hide();
                        form.findField('ConsumerStore').allowBlank = true;
                        form.findField('ConsumerEmployee').allowBlank = true;
                        form.findField('ConsumerUnit').allowBlank = false;


                        form.findField('ConsumerEmployee').setValue('');
                        form.findField('ConsumerEmployeeId').setValue('');
                        form.findField('ConsumerStore').setValue('');
                        form.findField('ConsumerStoreId').setValue('');
                    }
                    else {
                        form.findField('compositeEmployee').hide();
                        form.findField('compositeStore').hide();
                        form.findField('compositeUnit').hide();
                        form.findField('ConsumerStore').allowBlank = true;
                        form.findField('ConsumerEmployee').allowBlank = true;
                        form.findField('ConsumerUnit').allowBlank = true;

                        form.findField('ConsumerEmployee').setValue('');
                        form.findField('ConsumerEmployeeId').setValue('');
                        form.findField('ConsumerUnit').setValue('');
                        form.findField('ConsumerUnitId').setValue('');
                        form.findField('ConsumerStore').setValue('');
                        form.findField('ConsumerStoreId').setValue('');
                    }
                }
            }
        }, {
            xtype: 'hidden',
            name: 'ConsumerStoreId'
        }, {
            xtype: 'compositefield',
            name: 'compositeStore',
            fieldLabel: 'Consumer Store',
            hidden: true,
            defaults: {
                flex: 1
            },
            items: [{
                name: 'ConsumerStore',
                xtype: 'textfield',
                fieldLabel: 'Consumer',
                readonly: true,
                allowBlank: true
            }, {
                xtype: 'button',
                id: 'findStore',
                iconCls: 'icon-filter',
                width: 20,
                handler: function () {
                    var form = Ext.getCmp('custodian-form').getForm();
                    new Ext.erp.ux.common.StoreWindow({
                        parentForm: form,
                        controlIdField: 'ConsumerStoreId',
                        controlNameField: 'ConsumerStore'
                    }).show();
                }
            }]
        }, {
            xtype: 'hidden',
            name: 'ConsumerUnitId'
        }, {
            xtype: 'compositefield',
            name: 'compositeUnit',
            fieldLabel: 'Consumer Department',
            hidden: true,
            defaults: {
                flex: 1
            },
            items: [{
                name: 'ConsumerUnit',
                xtype: 'textfield',
                fieldLabel: 'Consumer',
                readonly: true,
                allowBlank: true
            }, {
                xtype: 'button',
                id: 'findUnit',
                iconCls: 'icon-filter',
                width: 20,
                handler: function () {
                    var form = Ext.getCmp('custodian-form').getForm();
                    new Ext.erp.ux.common.UnitWindow({
                        parentForm: form,
                        controlIdField: 'ConsumerUnitId',
                        controlNameField: 'ConsumerUnit'
                    }).show();
                }
            }]
        }, {
            xtype: 'hidden',
            name: 'ConsumerEmployeeId'
        }, {
            xtype: 'compositefield',
            name: 'compositeEmployee',
            fieldLabel: 'Consumer Employee',
            hidden: true,
            defaults: {
                flex: 1
            },
            items: [{
                name: 'ConsumerEmployee',
                xtype: 'textfield',
                fieldLabel: 'Consumer',
                readonly: true,
                allowBlank: true
            }, {
                xtype: 'button',
                id: 'findEmployee',
                iconCls: 'icon-filter',
                width: 20,
                handler: function () {
                    var form = Ext.getCmp('custodian-form').getForm();
                    new Ext.erp.ux.common.EmployeeWindow({
                        parentForm: form,
                        controlIdField: 'ConsumerEmployeeId',
                        controlNameField: 'ConsumerEmployee'
                    }).show();
                }
            }]
        }, {
            hiddenName: 'ItemSerial',
            xtype: 'combo',
            fieldLabel: 'Item Serial',
            typeAhead: true,
            width: 100,
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
                api: { read: Psms.GetItemSerialBySearch }
            }),
            valueField: 'Name',
            displayField: 'Name',
            pageSize: 10,
            listeners: {
                beforequery: function (queryEvent) {

                    var itemId = Ext.getCmp('custodian-form').itemId;
                    this.store.baseParams = { itemId: itemId, query: queryEvent.query };
                    this.getStore().reload({
                        params: {
                            start: 0,
                            limit: this.pageSize
                        }
                    });
                },
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('custodian-form').getForm();
                    form.findField('ItemSerialId').setValue(rec.id);
                },
                change: function (cmb, newvalue, oldvalue) {
                    if (newvalue == "") {
                        var form = Ext.getCmp('custodian-form').getForm();
                        form.findField('ItemSerialId').reset();

                    }
                }
            }
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
            typeAhead: true,
            forceSelection: true,
            selectOnFocus: true,
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
                    var form = Ext.getCmp('custodian-form').getForm();
                    form.findField("VoucherTypeId").setValue(rec.id);
                },
            }
        }, {
            name: 'VoucherNumber',
            xtype: 'textfield',
            fieldLabel: 'Voucher Number',
            width: 100,
            allowBlank: false,
           }, {
            name: 'Date',
            xtype: 'datefield',
            fieldLabel: 'Date',
            width: 100,
            allowBlank: false,
            value: new Date(),
            maxValue: (new Date()).format('m/d/Y')
        }, {
            name: 'IsReturned',
            checked: true,
            xtype: 'checkbox',
            fieldLabel: 'Is Returned?',
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
Ext.extend(Ext.erp.ux.custodian.Form, Ext.form.FormPanel);
Ext.reg('custodian-form', Ext.erp.ux.custodian.Form);

/**
* @desc      custodian registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      January 27, 2011
* @namespace Ext.erp.ux.custodian
* @class     Ext.erp.ux.custodian.Window
* @extends   Ext.Window
*/
Ext.erp.ux.custodian.Window = function (config) {
    Ext.erp.ux.custodian.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.custodianId);
              
                if (typeof this.custodianId != "undefined" && this.custodianId != "") {
                
                    this.form.load({
                        params: { id: this.custodianId },
                        success: function () {
                            var form = Ext.getCmp('custodian-form');
                            var consumerTypeId = form.getForm().findField('ConsumerTypeId').getValue();
                            var consumerType = form.getForm().findField('ConsumerType').getValue();

                            if (consumerType == 'Store') {
                                form.getForm().findField('compositeEmployee').hide();
                                form.getForm().findField('compositeStore').show();
                                form.getForm().findField('compositeUnit').hide();
                            }
                            if (consumerType == 'Employee') {
                                form.getForm().findField('compositeEmployee').show();
                                form.getForm().findField('compositeStore').hide();
                                form.getForm().findField('compositeUnit').hide();
                            }
                            if (consumerType == 'Unit') {
                                form.getForm().findField('compositeEmployee').hide();
                                form.getForm().findField('compositeStore').hide();
                                form.getForm().findField('compositeUnit').show();
                            }
                        }

                    });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.custodian.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.custodian.Form(
            {
                itemId:this.itemId
            });
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
        Ext.erp.ux.custodian.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var window = this;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('custodian-form').getForm().reset();
                  Ext.getCmp('custodian-paging').doRefresh();
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
Ext.reg('custodian-window', Ext.erp.ux.custodian.Window);



/**
* @desc      custodian Grid
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.custodian
* @class     Ext.erp.ux.custodian.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.custodian.Grid = function (config) {
    Ext.erp.ux.custodian.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Custodian.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },           
            fields: ['Id', 'ItemSerial','Date','IsReturned','ConsumerType', 'ConsumerEmployee', 'ConsumerStore','ConsumerUnit','VoucherNumber', 'Remark'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('custodian-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('custodian-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('custodian-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'custodian-grid',
        selectedUnitTypeId: 0,
        pageSize: 10,
        height: 300,
        stripeRows: true,
        border: false,
        columnLines: true,
        listeners: {
            rowClick: function () {
            },
            rowdblclick: function (grid, rowIndex, e) {
            },
            scope: this
        },
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
            dataIndex: 'ItemSerial',
            header: 'Item Serial',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'ConsumerType',
            header: 'Consumer Type',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'ConsumerEmployee',
            header: 'Employee',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'ConsumerUnit',
            header: 'Unit',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'ConsumerStore',
            header: 'Store',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'VoucherNumber',
            header: 'Voucher Number',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'IsReturned',
            header: 'Is Returned?',
            sortable: true,
            width: 150,
            menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value)
                    return '<img src="Content/images/app/yes.png"/>';
                else
                    return '<img src="Content/images/app/no.png"/>';
            }
        }, {
            dataIndex: 'Remark',
            header: 'Remark',
            sortable: true,
            width: 150,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.custodian.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({  }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Add',
            id: 'addCustodian',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Item Serial', 'CanAdd'),
            handler: this.onAddClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            id: 'editCustodian',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Item Serial', 'CanEdit'),
            handler: this.onEditClick
        }, {
            xtype: 'button',
            text: 'Delete',
            id: 'deleteCustodian',
            iconCls: 'icon-delete',
            hidden: false,
            disabled: !Ext.erp.ux.Reception.getPermission('Item Serial', 'CanDelete'),
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
                        var grid = Ext.getCmp('custodian-grid');
                        var itemId = Ext.getCmp('custodian-form').itemId;

                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), itemId: itemId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('custodian-grid');
                        var itemId = Ext.getCmp('custodian-form').itemId;

                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(),itemId:itemId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'custodian-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.custodian.Grid.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        var grid = Ext.getCmp('itemSerial-itemGrid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var itemId = grid.getSelectionModel().getSelected().get('Id');


        new Ext.erp.ux.custodian.Window({
            mode: 'add',
            itemId: itemId,
            title: 'Add Custodian'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('custodian-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select  Custodian to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var custodianId = grid.getSelectionModel().getSelected().get('Id');
        var itemGrid = Ext.getCmp('itemSerial-itemGrid');
        if (!itemGrid.getSelectionModel().hasSelection()) return;
        var itemId = itemGrid.getSelectionModel().getSelected().get('Id');

        new Ext.erp.ux.custodian.Window({
            title: 'Edit Custodian',
            itemId:itemId,
            custodianId: custodianId,          
            mode: 'edit'
        }).show();
    },

    onDeleteClick: function () {
        var grid = Ext.getCmp('custodian-grid');
        var custodianId = grid.getSelectionModel().getSelected().get('Id');

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
                    Custodian.Delete(custodianId, function (result) {
                        if (result.success) {
                            Ext.getCmp('custodian-paging').doRefresh();
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
        this.loadData();
        Ext.erp.ux.custodian.Grid.superclass.afterRender.apply(this, arguments);
    },
    loadData: function () {
        var grid =this;
        if (typeof grid != "undefined") {
            grid.store.baseParams = { record: Ext.encode({ itemId: this.itemId,searchText:'' }) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });

        }
    }
});
Ext.reg('custodian-Grid', Ext.erp.ux.custodian.Grid);



/**
* @desc      custodian panel
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.custodian
* @class     Ext.erp.ux.custodian.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.custodian.Panel = function (config) {
    Ext.erp.ux.custodian.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'custodian-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.custodian.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.custodian.Grid();
        this.items = [this.grid];
        Ext.erp.ux.custodian.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('custodian-panel', Ext.erp.ux.custodian.Panel);
