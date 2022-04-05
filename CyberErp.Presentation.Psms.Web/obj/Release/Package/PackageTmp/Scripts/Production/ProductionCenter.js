Ext.ns('Ext.erp.ux.ProductionCenter');

/**
* @desc      ProductionCenter form

* @copyright (c) 2013, 
* @date      June 22, 2013
* @namespace Ext.erp.ux.ProductionCenter
* @class     Ext.erp.ux.ProductionCenter.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.ProductionCenter.Form = function (config) {
    Ext.erp.ux.ProductionCenter.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: ProductionCenter.Get,
            submit: ProductionCenter.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'ProductionCenter-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'UnitId',
            xtype: 'hidden'
        }, {
            name: 'ItemCategoryId',
            xtype: 'hidden'
        }, {
            hiddenName: 'ItemCategory',
            xtype: 'combo',
            fieldLabel: 'Production Type',
            typeAhead: false,
            width: 100,
            hideTrigger: true,
            minChars: 2,
            listWidth: 280,
            emptyText: '---Type to Search---',
            mode: 'remote',
            allowBlank: false,
            tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> {Code}</div></tpl>',
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Code', 'Name']
                }),
                autoLoad: true,
                api: { read: Psms.GetItemCategoryBySearch }
            }),
            valueField: 'Name',
            displayField: 'Name',
            pageSize: 10, listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('ProductionCenter-form').getForm();
                    form.findField('ItemCategoryId').setValue(rec.id);
                },
                change: function (cmb, newvalue, oldvalue) {
                    if (newvalue == "") {
                        var form = Ext.getCmp('ProductionCenter-form').getForm();
                        form.findField('ItemCategoryId').reset();

                    }
                }
            }
        },
        {
            hiddenName: 'Unit',
            xtype: 'combo',
            fieldLabel: 'Department',
            typeAhead: false,
            width: 100,
            hideTrigger: true,
            minChars: 2,
            listWidth: 280,
            emptyText: '---Type to Search---',
            mode: 'remote',
            allowBlank: false,
            tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> {Code}</div></tpl>',
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Code', 'Name']
                }),
                autoLoad: true,
                api: { read: Psms.GetUnit }
            }),
            valueField: 'Name',
            displayField: 'Name',
            pageSize: 10, listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('ProductionCenter-form').getForm();
                    form.findField('UnitId').setValue(rec.id);
                },
                change: function (cmb, newvalue, oldvalue) {
                    if (newvalue == "") {
                        var form = Ext.getCmp('ProductionCenter-form').getForm();
                        form.findField('UnitId').reset();

                    }
                }
            }
        },
        ]
    }, config));
};
Ext.extend(Ext.erp.ux.ProductionCenter.Form, Ext.form.FormPanel);
Ext.reg('ProductionCenter-form', Ext.erp.ux.ProductionCenter.Form);

/**
* @desc      ProductionCenter registration form host window

* @copyright (c) 2020, 
* @date      January 27, 2011
* @namespace Ext.erp.ux.ProductionCenter
* @class     Ext.erp.ux.ProductionCenter.Window
* @extends   Ext.Window
*/
Ext.erp.ux.ProductionCenter.Window = function (config) {
    Ext.erp.ux.ProductionCenter.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.ProductionCenterId);
                if (typeof this.ProductionCenterId != "undefined" && this.ProductionCenterId!="") {
                    this.form.load({ params: { id: this.ProductionCenterId } });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.ProductionCenter.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.ProductionCenter.Form();
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
        Ext.erp.ux.ProductionCenter.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('ProductionCenter-form').getForm().reset();
                Ext.getCmp('ProductionCenter-paging').doRefresh();
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
Ext.reg('ProductionCenter-window', Ext.erp.ux.ProductionCenter.Window);



/**
* @desc      ProductionCenter Grid

* @copyright (c) 2013, 
* @date      June 22, 2013
* @namespace Ext.erp.ux.ProductionCenter
* @class     Ext.erp.ux.ProductionCenter.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.ProductionCenter.Grid = function (config) {
    Ext.erp.ux.ProductionCenter.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ProductionCenter.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'Unit', 'ItemCategory'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('ProductionCenter-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('ProductionCenter-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('ProductionCenter-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'ProductionCenter-grid',
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
            dataIndex: 'ItemCategory',
            header: 'Product Type',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Unit',
            header: 'Department',
            sortable: true,
            width: 150,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.ProductionCenter.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({  }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Add',
            id: 'addProductionCenter',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Production Center', 'CanAdd'),
            handler: this.onAddClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            id: 'editProductionCenter',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Production Center', 'CanEdit'),
            handler: this.onEditClick
        }, {
            xtype: 'button',
            text: 'Delete',
            id: 'deleteProductionCenter',
            iconCls: 'icon-delete',
            hidden: false,
            disabled: !Ext.erp.ux.Reception.getPermission('Production Center', 'CanDelete'),
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
                        var grid = Ext.getCmp('ProductionCenter-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('ProductionCenter-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'ProductionCenter-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.ProductionCenter.Grid.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {

        new Ext.erp.ux.ProductionCenter.Window({
            mode: 'add',
            title: 'Add'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('ProductionCenter-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a ProductionCenter to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var ProductionCenterId = grid.getSelectionModel().getSelected().get('Id');
        var parentId = grid.parentId;
        new Ext.erp.ux.ProductionCenter.Window({
            title: 'Edit ProductionCenter',
            ProductionCenterId: ProductionCenterId,
            mode: 'edit'
        }).show();
    },

    onDeleteClick: function () {
     
        var grid = Ext.getCmp('ProductionCenter-grid');
        var ProductionCenterId = grid.getSelectionModel().getSelected().get('Id');

        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Production Center',
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
                        msg: 'Deleting this ProductionCenter could make other related data invalid. Press Ok to delete, Press Cancel to abort.',
                        buttons: {
                            ok: 'Ok',
                            cancel: 'Cancel'
                        },
                        icon: Ext.MessageBox.WARNING,
                        scope: this,
                        fn: function (btn) {
                            if (btn == 'ok') {
                                ProductionCenter.Delete(ProductionCenterId, function (result) {
                                    if (result.success) {
                                        Ext.getCmp('ProductionCenter-paging').doRefresh();
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
        Ext.erp.ux.ProductionCenter.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('ProductionCenter-Grid', Ext.erp.ux.ProductionCenter.Grid);



/**
* @desc      ProductionCenter panel

* @copyright (c) 2013, 
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.ProductionCenter
* @class     Ext.erp.ux.ProductionCenter.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.ProductionCenter.Panel = function (config) {
    Ext.erp.ux.ProductionCenter.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'ProductionCenter-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.ProductionCenter.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.ProductionCenter.Grid();
        this.items = [this.grid];
        Ext.erp.ux.ProductionCenter.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('ProductionCenter-panel', Ext.erp.ux.ProductionCenter.Panel);
