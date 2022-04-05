Ext.ns('Ext.erp.ux.itemPurchasePrice');



/**
* @desc      ItemPurchasePrice form
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.itemPurchasePrice
* @class     Ext.erp.ux.itemPurchasePrice.Form
* @extends   Ext.form.FormPanel
*/

Ext.erp.ux.itemPurchasePrice.Form = function (config) {
    Ext.erp.ux.itemPurchasePrice.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: ItemPurchasePrice.Get,
            submit: ItemPurchasePrice.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'itemPurchasePrice-form',
        frame: true,
        labelWidth: 130,
        padding: 5,
        autoHeight: false,
        border: false,
        loadDocument: function () {

            ItemPurchasePrice.GetDocumentNo(function (result) {
                var form = Ext.getCmp('itemPurchasePrice-form').getForm();
                form.findField('VoucherNumber').setValue(result.data.DocNo);                
            });
        },
        baseCls: 'x-plain',
        listeners: {
            afterlayout: function () {

            }
        },
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'CreatedAt',
            xtype: 'hidden'
        }, {
            name: 'UpdatedAt',
            xtype: 'hidden'
        },{
            name: 'ItemId',
            xtype: 'hidden'
        }, {
            hiddenName: 'Item',
            xtype: 'combo',
            fieldLabel: 'Item',
            typeAhead: false,
            hideTrigger: true,
            minChars: 2,
            listWidth: 280,
            allowBlank: true,
            mode: 'remote',
            tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' +
                    '<h3><span>{Name}</span></h3> {Code}</div></tpl>',
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    totalProperty: 'total',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                api: { read: Item.GetSearchItems }
            }),
            valueField: 'Name',
            displayField: 'Name',
            pageSize: 10,
            listeners: {
                scope: this,
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('itemPurchasePrice-form').getForm();
                    form.findField('ItemId').setValue(rec.id);
                }
            }
        } , {
            name: 'Type',
            xtype: 'textfield',
            fieldLabel: 'Price Type',
            width: 100,
            allowBlank: false
        }, {
            name: 'UnitPrice',
            xtype: 'numberfield',
            fieldLabel: 'Price',
            width: 100,
            allowBlank: false
        }, {
            name: 'StartDate',
            xtype: 'datefield',
            fieldLabel: 'Start Date',
            width: 100,
            allowBlank: true,
           }, {
            name: 'EndDate',
            xtype: 'datefield',
            fieldLabel: 'End Date',
            width: 100,
            allowBlank: true,
           }, {
            name: 'Description',
            xtype: 'textarea',
            fieldLabel: 'Description',
            width: 100,
            allowBlank: false
        }, ]
    }, config));
}
Ext.extend(Ext.erp.ux.itemPurchasePrice.Form, Ext.form.FormPanel);
Ext.reg('itemPurchasePrice-form', Ext.erp.ux.itemPurchasePrice.Form);



/* @desc     itemPurchasePriceOrder form host window
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date     September 2013
* @namespace Ext.erp.ux.itemPurchasePriceOrder
* @class     Ext.erp.ux.itemPurchasePriceOrder.Window
* @extends   Ext.Window
*/

Ext.erp.ux.itemPurchasePrice.Window = function (config) {
    Ext.erp.ux.itemPurchasePrice.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 600,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'itemPurchasePrice-window',
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
   
        listeners: {
            show: function () {
               
                if (typeof this.itemPurchasePriceId != "undefined" && this.itemPurchasePriceId != "") {

                    this.form.load({ params: { id: this.itemPurchasePriceId } });

                }


            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.ux.itemPurchasePrice.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.itemPurchasePrice.Form({

        });
        this.items = [this.form];
        this.bbar = [
            {
                xtype: 'tbfill'
            }, {
                text: 'Save',
                iconCls: 'icon-accept',
                scope: this,
                handler: this.onSave
            }, {
                xtype: 'tbseparator'
            }, {
                text: 'Close',
                iconCls: 'icon-exit',
                handler: this.onCancel,
                scope: this
            }];
        Ext.erp.ux.itemPurchasePrice.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var window = this;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
        
            success: function () {
                Ext.getCmp('itemPurchasePrice-form').getForm().reset();

                Ext.getCmp('itemPurchasePrice-paging').doRefresh();
                window.close();
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
    onCancel: function () {
        this.close();
    }
});
Ext.reg('itemPurchasePrice-window', Ext.erp.ux.itemPurchasePrice.Window);


/**
* @desc      itemPurchasePrice Grid
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.itemPurchasePrice
* @class     Ext.erp.ux.itemPurchasePrice.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.itemPurchasePrice.Grid = function (config) {
    Ext.erp.ux.itemPurchasePrice.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ItemPurchasePrice.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Item',
                direction: 'ASC'
            },
            fields: ['Id', 'Item', 'Code', 'Type', 'PartNumber','Description', 'StartDate','EndDate','Supplier', 'Brand', 'UnitPrice'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('itemPurchasePrice-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('itemPurchasePrice-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('itemPurchasePrice-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'itemPurchasePrice-grid',
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
            dataIndex: 'Item',
            header: 'Name',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Code',
            header: 'Code',
            sortable: true,
            width: 150,
            menuDisabled: true
        },  {
            dataIndex: 'Supplier',
            header: 'Supplier',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {dataIndex: 'Type',
            header: 'Price Type',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'UnitPrice',
            header: 'Unit Price',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'StartDate',
            header: 'Start Date',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'EndDate',
            header: 'End Date',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Remark',
            header: 'Description',
            sortable: true,
            width: 150,
            menuDisabled: true
        },
            ]
    }, config));
}
Ext.extend(Ext.erp.ux.itemPurchasePrice.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [{
            xtype: 'button',
            text: 'Add',
            id: 'addItemPurchasePrice',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Purchase Price', 'CanAdd'),
            handler: this.onAddClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            id: 'editItemPurchasePrice',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Purchase Price', 'CanEdit'),
            handler: this.onEditClick
        }, {
            xtype: 'button',
            text: 'Delete',
            id: 'deleteItemPurchasePrice',
            iconCls: 'icon-delete',
            hidden: false,
            disabled: !Ext.erp.ux.Reception.getPermission('Purchase Price', 'CanDelete'),
            handler: this.onDeleteClick
        },{
            xtype: 'button',
            text: 'Preview',
            hidden: false,
            iconCls: 'icon-preview',
            handler: this.onPreview
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
                        var grid = Ext.getCmp('itemPurchasePrice-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('itemPurchasePrice-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'itemPurchasePrice-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.itemPurchasePrice.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {

        var grid = Ext.getCmp('itemPurchasePrice-grid');
       

        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        window.open('Reports/ErpReportViewer.aspx?rt=PreviewItemPurchasePrice', 'PreviewIV', parameter);

    },
    onAddClick: function () {

        new Ext.erp.ux.itemPurchasePrice.Window({
            mode: 'add',
            title: 'Add ItemPurchasePrice'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('itemPurchasePrice-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a ItemPurchasePrice to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var itemPurchasePriceId = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.ux.itemPurchasePrice.Window({
            title: 'Edit ItemPurchasePrice',
            itemPurchasePriceId: itemPurchasePriceId,
            mode: 'edit'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('itemPurchasePrice-grid');
        var itemPurchasePriceId = grid.getSelectionModel().getSelected().get('Id');

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
                    ItemPurchasePrice.Delete(itemPurchasePriceId, function (result) {
                        if (result.success) {
                            Ext.getCmp('itemPurchasePrice-paging').doRefresh();
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
        Ext.erp.ux.itemPurchasePrice.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('itemPurchasePrice-Grid', Ext.erp.ux.itemPurchasePrice.Grid);


/**
* @desc      itemPurchasePrice panel
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @version   $Id: itemPurchasePrice.js, 0.1
* @namespace Ext.erp.ux.itemPurchasePrice
* @class     Ext.erp.ux.itemPurchasePrice.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.itemPurchasePrice.Panel = function (config) {
    Ext.erp.ux.itemPurchasePrice.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.itemPurchasePrice.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.itemPurchasePrice.Grid();
        this.items = [this.grid];
        Ext.erp.ux.itemPurchasePrice.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('itemPurchasePrice-panel', Ext.erp.ux.itemPurchasePrice.Panel);



