Ext.ns('Ext.erp.ux.contractAgreement');



/**
* @desc      form

* @copyright (c) 2020, 
* @date      April 27, 2019
* @namespace Ext.erp.ux.contractAgreement
* @class     Ext.erp.ux.contractAgreement.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.contractAgreement.Form = function (config) {
    Ext.erp.ux.contractAgreement.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: ContractAgreement.Get,
            submit: ContractAgreement.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side',
            bodyStyle: 'background-color:transparent;'
        },
        id: 'contractAgreement-form',
        padding: 3,
        labelWidth: 100,
        autoHeight: true,
        border: false,
        fileUpload: true,
        baseCls: 'x-plain',
        items: [{
            layout: 'column',
            border: false,
    
            items: [{
                columnWidth: .5,
                defaults: {
                    anchor: '95%',
                    labelStyle: 'text-align:right;',
                    msgTarget: 'side',
          
                },
                layout: 'form',
                border: false,
                bodyStyle: 'background-color:transparent;',

                items: [
                {
                    name: 'Id',
                    xtype: 'hidden'
                }, {
                    name: 'CreatedAt',
                    xtype: 'hidden'
                }, {
                    name: 'SupplierId',
                    xtype: 'hidden'
                },  {
                    name: 'Description',
                    xtype: 'textarea',
                    fieldLabel: 'Description',
                    width: 100,
                    allowBlank: false
                }, {
                    xtype: 'compositefield',
                    fieldLabel: 'Supplier',
                    defaults: {
                        flex: 1
                    },
                    items: [{
                        hiddenName: 'Supplier',
                        xtype: 'combo',
                        fieldLabel: 'Supplier',
                        typeAhead: false,
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
                                fields: ['Id', 'Name']
                            }),
                            autoLoad: true,
                            api: { read: Psms.GetSupplierBySearch }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        pageSize: 10, listeners: {
                            select: function (cmb, rec, idx) {
                                var form = Ext.getCmp('contractAgreement-form').getForm();
                                form.findField('SupplierId').setValue(rec.id);
                            },
                            change: function (cmb, newvalue, oldvalue) {
                                if (newvalue == "") {
                                    var form = Ext.getCmp('contractAgreement-form').getForm();
                                    form.findField('SupplierId').reset();
                                }
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        width: 30,
                        id: 'new-Supplier',
                        iconCls: 'icon-add',
                        handler: function () {
                            var form = Ext.getCmp('contractAgreement-form').getForm();
                            new Ext.erp.ux.supplier.Window({
                                targetForm: form,
                                supplierId: '0',
                            }).show();

                        }
                    }
                    ]
                }, {
                    name: 'AgreementDate',
                    xtype: 'datefield',
                    fieldLabel: 'Agreement Date',
                    width: 100,
                    readOnly: false,
                    allowBlank: false
                }, {
                    name: 'PriceTerm',
                    xtype: 'textfield',
                    fieldLabel: 'PriceTerm',
                    width: 100,
                    readOnly: false,
                    allowBlank: true
                }, {
                    name: 'PaymentTerm',
                    xtype: 'textarea',
                    fieldLabel: 'Payment Term',
                    width: 100,
                    readOnly: false,
                    allowBlank: true
                }, {
                    name: 'DeliveryTerm',
                    xtype: 'textarea',
                    fieldLabel: 'Delivery Term',
                    width: 100,
                    readOnly: false,
                    allowBlank: true
                }, 
               
                ]
            }, {
                columnWidth: .5,
                defaults: {
                    anchor: '95%',
                    labelStyle: 'text-align:right;',
                    msgTarget: 'side',
                },
                layout: 'form',
                border: false,
                bodyStyle: 'background-color:transparent;',

                items: [
                 {
                     name: 'MarketingTerm',
                     xtype: 'textarea',
                     fieldLabel: 'Marketing Term',
                     width: 100,
                     readOnly: false,
                     allowBlank: true
                 }, 
                {
                    name: 'OtherTerm',
                    xtype: 'textarea',
                    fieldLabel: 'Other Term',
                    readOnly: false,
                    allowBlank: true
                },
                {
                    name: 'Discount',
                    xtype: 'textfield',
                    fieldLabel: 'Discount',
                    readOnly: false,
                    allowBlank: true
                }, {
                    xtype: 'fileuploadfield',
                    fieldLabel: 'File',
                    emptyText: 'Select document',
                    name: 'File[]',
                    buttonText: 'Browse...',
                    multiple: true,
                    iconCls: 'icon-browse',
                    listeners: {
                        'fileselected': function (field, value) {

                        }
                    }
                },

                ]
            }]
        }],
    }, config));
}
Ext.extend(Ext.erp.ux.contractAgreement.Form, Ext.form.FormPanel);
Ext.reg('contractAgreement-form', Ext.erp.ux.contractAgreement.Form);



/**
* @desc      window

* @copyright (c) 2010, 
* @date      April 01, 2019
* @namespace Ext.erp.ux.contractAgreement
* @class     Ext.erp.ux.contractAgreement.Window
* @extends   Ext.Window
*/
Ext.erp.ux.contractAgreement.Window = function (config) {
    Ext.erp.ux.contractAgreement.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 850,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                
                if (typeof this.contractAgreementId != "undefined" && this.contractAgreementId!="") {

                    this.form.load({ params: { id: this.contractAgreementId } });
                }
               
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.contractAgreement.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.contractAgreement.Form();    
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
        Ext.erp.ux.contractAgreement.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        var form = Ext.getCmp('contractAgreement-form');
        if (!form.getForm().isValid()) return;
         
        var window = this;
      form.getForm().submit({
            wapsmsg: 'Please wait...',
            params: { record: Ext.encode({ }) },
            success: function (form, action) {             
                Ext.getCmp('contractAgreement-form').getForm().reset();
                Ext.getCmp('contractAgreement-paging').doRefresh();
                 Ext.MessageBox.show({
                    title: 'Success',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    scope: this
                });

            },
            failure: function (form, action) {
          
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    },
    onClose: function () {
        this.close();
    },
  
});
Ext.reg('contractAgreement-window', Ext.erp.ux.contractAgreement.Window);


/**
* @desc      contractAgreement grid

* @copyright (c) 2020, 
* @date      November 01, 2011
* @namespace Ext.erp.ux.contractAgreement
* @class     Ext.erp.ux.contractAgreement.Grid
* @extends   Ext.grid.GridPanel
*/

Ext.erp.ux.contractAgreement.Grid = function (config) {
    Ext.erp.ux.contractAgreement.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ContractAgreement.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'Description','Supplier', 'AgreementDate', 'PaymentTerm','DeliveryTerm', 'PriceTerm', 'DocumentUrl'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    this.body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    this.body.unmask();
                },
                loadException: function () {
                    this.body.unmask();
                },
                scope: this
            }
        }),
        id: 'contractAgreement-grid',
        pageSize: 20,
        stripeRows: true,
        border: true,
        columnLines: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true

        }),
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        columns:
        [new Ext.grid.RowNumberer(),
            {
                dataIndex: 'Description',
                header: 'Description',
                sortable: true,
                width: 150,
                menuDisabled: true
            }, {
                dataIndex: 'Supplier',
                header: 'Supplier',
                sortable: true,
                width: 150,
                menuDisabled: true
            }, {
                dataIndex: 'AgreementDate',
                header: 'Agreement Date',
                sortable: true,
                width: 150,
                menuDisabled: true
            }, {
                dataIndex: 'PriceTerm',
                header: 'Price',
                sortable: true,
                width: 150,
                menuDisabled: true
            }, {
                dataIndex: 'PaymentTerm',
                header: 'Payment',
                sortable: true,
                width: 150,
                menuDisabled: true
            }, {
                dataIndex: 'DeliveryTerm',
                header: 'Delivery',
                sortable: true,
                width: 150,
                menuDisabled: true
            }, {
                dataIndex: 'DocumentUrl',
                header: 'Document Url',
                sortable: true,
                width: 150,
                menuDisabled: true,
                renderer: function (myValue, myDontKnow, myRecord) {
                    return '<a href="Document/Agreement' + '/' + myValue + '" target="_blank">' + myValue + '</a>';

                }
            }, ]
    }, config));
};
Ext.extend(Ext.erp.ux.contractAgreement.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [
            {
                xtype: 'button',
                text: 'Add',
                id: 'addcontractAgreement',
                iconCls: 'icon-add',
                disabled: !Ext.erp.ux.Reception.getPermission('Contract Agreement', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editcontractAgreement',
                iconCls: 'icon-edit',
                disabled: !Ext.erp.ux.Reception.getPermission('Contract Agreement', 'CanEdit'),


                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletecontractAgreement',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.ux.Reception.getPermission('Contract Agreement', 'CanDelete'),
                handler: this.onDeleteClick
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'textfield',
                emptyText: 'Type Search text here and press "Enter"',
                submitemptyText: false,
                id:'contractAgreementSearchText',
                enableKeyEvents: true,
                style: {
                    borderRadius: '25px',
                    padding: '0 10px',
                    width: '200px'
                },
                listeners: {
                    specialKey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            Ext.getCmp('contractAgreement-grid').onSearchGrid();
                        }
                    },
                    Keyup: function (field, e) {
                        if (field.getValue() == '') {
                            Ext.getCmp('contractAgreement-grid').onSearchGrid();
                        }
                    }
                }
            }];
        this.bbar = new Ext.PagingToolbar({
            id: 'contractAgreement-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.contractAgreement.Grid.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {

        new Ext.erp.ux.contractAgreement.Window({
                   title: 'Add Contract Agreement'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('contractAgreement-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a record to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var id = grid.getSelectionModel().getSelected().get('Id');      
        new Ext.erp.ux.contractAgreement.Window({
            contractAgreementId: id,
               title: 'Edit Contract Agreement'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('contractAgreement-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected contract Agreement',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    ContractAgreement.Delete(id, function (result, response) {
                        if (result.success) {
                            Ext.getCmp('contractAgreement-paging').doRefresh();
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
    onSearchGrid: function () {
           var searchValue = Ext.getCmp('contractAgreementSearchText').getValue();
        
        var grid = Ext.getCmp('contractAgreement-grid');
        grid.store.baseParams['record'] = Ext.encode({ searchText: searchValue });
        grid.store.load({ params: { start: 0, limit: grid.pageSize } });

    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.contractAgreement.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('contractAgreement-Grid', Ext.erp.ux.contractAgreement.Grid);


/**
* @desc      contractAgreement Main panel

* @copyright (c) 2020, 
* @date      Augest 11, 2011
* @namespace Ext.erp.ux.contractAgreement.Panel
* @class     Ext.erp.ux.contractAgreement.itemPanel
* @extends   Ext.Panel
*/
Ext.erp.ux.contractAgreement.Panel = function (config) {
    Ext.erp.ux.contractAgreement.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        flex: 1.5,
        border: false,
    }, config));
};
Ext.extend(Ext.erp.ux.contractAgreement.Panel, Ext.Panel, {
    initComponent: function () {
       this.grid = new Ext.erp.ux.contractAgreement.Grid();
        this.items = [this.grid];

        Ext.erp.ux.contractAgreement.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('contractAgreement-panel', Ext.erp.ux.contractAgreement.Panel);

