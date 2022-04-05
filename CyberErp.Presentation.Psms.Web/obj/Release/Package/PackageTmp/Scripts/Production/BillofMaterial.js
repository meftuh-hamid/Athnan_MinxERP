Ext.ns('Ext.erp.ux.billofMaterial');

/**
* @desc      billofMaterial form

* @copyright (c) 2013, 
* @date      June 22, 2013
* @namespace Ext.erp.ux.billofMaterial
* @class     Ext.erp.ux.billofMaterial.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.billofMaterial.Form = function (config) {
    Ext.erp.ux.billofMaterial.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: BillofMaterial.Get,
            submit: BillofMaterial.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'billofMaterial-form',
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
            name: 'ItemId',
            xtype: 'hidden'
        }, {
            name: 'ItemCategoryId',
            xtype: 'hidden'
        }, {
            name: 'Number',
            xtype: 'textfield',
            fieldLabel: 'Number',
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
            hiddenName: 'ItemCategory',
            xtype: 'combo',
            fieldLabel: 'Item Category',
            typeAhead: false,
            width: 100,
            hideTrigger: true,
            minChars: 2,
            listWidth: 280,
            emptyText: '---Type to Search---',
            mode: 'remote',
            allowBlank: true,
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
                    var form = Ext.getCmp('billofMaterial-form').getForm();
                    form.findField('ItemCategoryId').setValue(rec.id);
                },
                change: function (cmb, newvalue, oldvalue) {
                    if (newvalue == "") {
                        var form = Ext.getCmp('billofMaterial-form').getForm();
                        form.findField('ItemCategoryId').reset();

                    }
                }
            }
        }, {
            hiddenName: 'Name',
            xtype: 'combo',
            fieldLabel: 'Item',
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
                    fields: ['Id','Code', 'Name']
                }),
                autoLoad: true,
                api: { read: Psms.GetItemBySearch }
            }),
            valueField: 'Name',
            displayField: 'Name',
            pageSize: 10, listeners: {
                beforequery: function (cmb, rec, idx) {
                    var form = Ext.getCmp('billofMaterial-form').getForm();
                    var itemcategoryId = form.findField('ItemCategoryId').getValue();
                    this.store.baseParams = { itemcategoryId: itemcategoryId };
                    this.getStore().reload({
                        params: {
                            start: 0,
                            limit: this.pageSize
                        }
                    });
                },
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('billofMaterial-form').getForm();
                    form.findField('ItemId').setValue(rec.id);
                },
                change: function (cmb, newvalue, oldvalue) {
                    if (newvalue == "") {
                        var form = Ext.getCmp('billofMaterial-form').getForm();
                        form.findField('ItemId').reset();

                    }
                }
            }
        }, {
            name: 'Quantity',
            xtype: 'numberfield',
            fieldLabel: 'Quantity',
            width: 100,
            readOnly: false,
            allowBlank: false
        }, {
            name: 'MaterialCost',
            xtype: 'numberfield',
            fieldLabel: 'Material Cost',
            width: 100,
            readOnly: false,
            value: 0,
            allowBlank: true
        }, {
            name: 'OperationCost',
            xtype: 'numberfield',
            fieldLabel: 'Operation Cost',
            width: 100,
            readOnly: false,
            value: 0,
            allowBlank: true
        }, {
            name: 'ScrapCost',
            xtype: 'numberfield',
            fieldLabel: 'Scrap Cost',
            width: 100,
            readOnly: false,
            value: 0,
            allowBlank: true
        }, {
            name: 'OverheadCost',
            xtype: 'numberfield',
            fieldLabel: 'Over Head Cost',
            width: 100,
            readOnly: false,
            value: 0,
            allowBlank: true
        }, {
            name: 'Total',
            xtype: 'numberfield',
            fieldLabel: 'Total',
            width: 100,
            readOnly: false,
            value:0,
            allowBlank: true
        },  {
            name: 'Remark',
            xtype: 'textarea',
            fieldLabel: 'Remark',
            width: 100,
            readOnly: false,
            allowBlank: true
        }, ]
    }, config));
};
Ext.extend(Ext.erp.ux.billofMaterial.Form, Ext.form.FormPanel);
Ext.reg('billofMaterial-form', Ext.erp.ux.billofMaterial.Form);

/**
* @desc      billofMaterial registration form host window

* @copyright (c) 2020, 
* @date      January 27, 2011
* @namespace Ext.erp.ux.billofMaterial
* @class     Ext.erp.ux.billofMaterial.Window
* @extends   Ext.Window
*/
Ext.erp.ux.billofMaterial.Window = function (config) {
    Ext.erp.ux.billofMaterial.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.billofMaterialId);
                if (typeof this.billofMaterialId != "undefined" && this.billofMaterialId!="") {
                    this.form.load({ params: { id: this.billofMaterialId } });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.billofMaterial.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.billofMaterial.Form();
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
        Ext.erp.ux.billofMaterial.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('billofMaterial-form').getForm().reset();
                Ext.getCmp('billofMaterial-paging').doRefresh();
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
Ext.reg('billofMaterial-window', Ext.erp.ux.billofMaterial.Window);



/**
* @desc      billofMaterial Grid

* @copyright (c) 2013, 
* @date      June 22, 2013
* @namespace Ext.erp.ux.billofMaterial
* @class     Ext.erp.ux.billofMaterial.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.billofMaterial.Grid = function (config) {
    Ext.erp.ux.billofMaterial.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: BillofMaterial.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Number', 'Description','MaterialCost', 'ItemCategory', 'OverheadCost', 'OperationCost', 'ScrapCost', 'Quantity', 'Total', 'Remark'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('billofMaterial-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('billofMaterial-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('billofMaterial-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'billofMaterial-grid',
        selectedUnitTypeId: 0,
        pageSize: 30,
        height: 300,
        stripeRows: true,
        border: false,
        columnLines: true,
        listeners: {
            rowclick: function (grid, rowIndex, e) {
                var id = Ext.getCmp('billofMaterial-grid').getSelectionModel().getSelected().get("Id");
                var itemGrid = Ext.getCmp('billofMaterialItem-grid');
                var store = itemGrid.getStore();
                itemGrid.billofMaterialId = id;
                store.baseParams = { record: Ext.encode({ billofMaterialId: id }) };
                itemGrid.getStore().reload({
                    params: {
                        start: 0,
                        limit: itemGrid.pageSize
                    }
                });
                var operationGrid = Ext.getCmp('billofMaterialOperation-grid');
                var store = operationGrid.getStore();
                operationGrid.billofMaterialId = id;
                store.baseParams = { record: Ext.encode({ billofMaterialId: id }) };
                operationGrid.getStore().reload({
                    params: {
                        start: 0,
                        limit: operationGrid.pageSize
                    }
                });
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
            dataIndex: 'Number',
            header: 'Number',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'ItemCategory',
            header: 'Item Category',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 150,
            menuDisabled: true
        },  {
            dataIndex: 'MaterialCost',
            header: 'Material Cost',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'OperationCost',
            header: 'Operation Cost',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'ScrapCost',
            header: 'Scrap Cost',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'OverheadCost',
            header: 'Over Head Cost',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Total',
            header: 'Net',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Quantity',
            header: 'Quantity',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, ]
    }, config));
}
Ext.extend(Ext.erp.ux.billofMaterial.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({  }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Add',
            id: 'addBillofMaterial',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Bill of Material', 'CanAdd'),
            handler: this.onAddClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            id: 'editBillofMaterial',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Bill of Material', 'CanEdit'),
            handler: this.onEditClick
        }, {
            xtype: 'button',
            text: 'Delete',
            id: 'deleteBillofMaterial',
            iconCls: 'icon-delete',
            hidden: false,
            disabled: !Ext.erp.ux.Reception.getPermission('Bill of Material', 'CanDelete'),
            handler: this.onDeleteClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Preview',
            hidden: false,
            iconCls: 'icon-preview',
            handler: this.onPreview
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Import BoM',
            iconCls: 'icon-accept',
            disabled: !Ext.erp.ux.Reception.getPermission('Bill of Material', 'CanEdit'),
            handler: this.onImportBoMClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Import Operation',
            iconCls: 'icon-accept',
            disabled: !Ext.erp.ux.Reception.getPermission('Bill of Material', 'CanEdit'),
            handler: this.onImportOperationClick
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
                        var grid = Ext.getCmp('billofMaterial-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('billofMaterial-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'billofMaterial-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.billofMaterial.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {

        var grid = Ext.getCmp('billofMaterial-grid');
        if (!grid.getSelectionModel().hasSelection()) return;


        var voucherId = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        window.open('Reports/ErpReportViewer.aspx?rt=PreviewBillofMaterial&id=' + voucherId, 'PreviewIV', parameter);


    },
    onAddClick: function () {

        new Ext.erp.ux.billofMaterial.Window({
            mode: 'add',
            title: 'Add'
        }).show();
    },
    onImportBoMClick: function () {

        new Ext.erp.ux.documentAttachment.Window({
            type: "BoM"
        }).show();
    },
    onImportOperationClick: function () {

        new Ext.erp.ux.documentAttachment.Window({
            type: "Operation"
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('billofMaterial-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a BillofMaterial to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var billofMaterialId = grid.getSelectionModel().getSelected().get('Id');
        var parentId = grid.parentId;
        new Ext.erp.ux.billofMaterial.Window({
            title: 'Edit BillofMaterial',
            billofMaterialId: billofMaterialId,
            mode: 'edit'
        }).show();
    },

    onDeleteClick: function () {
     
        var grid = Ext.getCmp('billofMaterial-grid');
        var billofMaterialId = grid.getSelectionModel().getSelected().get('Id');

        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected BillofMaterial',
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
                        msg: 'Deleting this BillofMaterial could make other related data invalid. Press Ok to delete, Press Cancel to abort.',
                        buttons: {
                            ok: 'Ok',
                            cancel: 'Cancel'
                        },
                        icon: Ext.MessageBox.WARNING,
                        scope: this,
                        fn: function (btn) {
                            if (btn == 'ok') {
                                BillofMaterial.Delete(billofMaterialId, function (result) {
                                    if (result.success) {
                                        Ext.getCmp('billofMaterial-paging').doRefresh();
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
        Ext.erp.ux.billofMaterial.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('billofMaterial-Grid', Ext.erp.ux.billofMaterial.Grid);



/**
* @desc      billofMaterial panel

* @copyright (c) 2013, 
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.billofMaterial
* @class     Ext.erp.ux.billofMaterial.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.billofMaterial.Panel = function (config) {
    Ext.erp.ux.billofMaterial.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'billofMaterial-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.billofMaterial.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.billofMaterial.Grid();
        this.itemGrid = new Ext.erp.ux.billofMaterialItem.Grid();
        this.operatioinGrid = new Ext.erp.ux.billofMaterialOperation.Grid();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                split: true,
                width: 650,
                minSize: 200,
                maxSize: 600,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.grid]
            }, {
                region: 'center',
                border: false,
                layout: 'fit',
                items: [{
                    layout: 'vbox',
                    layoutConfig: {
                        type: 'hbox',
                        align: 'stretch',
                        pack: 'start'
                    },
                    defaults: {
                        flex: 1
                    },
                    items: [this.itemGrid, this.operatioinGrid]
                }]
            }]
        }];
        Ext.erp.ux.billofMaterial.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('billofMaterial-panel', Ext.erp.ux.billofMaterial.Panel);
