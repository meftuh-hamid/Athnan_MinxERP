Ext.ns('Ext.erp.ux.customer');



/**
* @desc      form

* @copyright (c) 2020, 
* @date      April 27, 2019
* @namespace Ext.erp.ux.customer
* @class     Ext.erp.ux.customer.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.customer.Form = function (config) {
    Ext.erp.ux.customer.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Customer.Get,
            submit: Customer.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side',
            bodyStyle: 'background-color:transparent;'
        },
        id: 'customer-form',
        padding: 3,
        labelWidth: 100,
        autoHeight: true,
        border: false,
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
                    name: 'CustomerCategoryId',
                    xtype: 'hidden'
                },
                {
                    name: 'SubsidiaryAccountId',
                    xtype: 'hidden'
                }, {
                    hiddenName: 'CustomerCategory',
                    xtype: 'combo',
                    fieldLabel: 'Customer',
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
                        api: { read: Psms.GetCustomerCategory }
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('purchaseOrder-form').getForm();
                            form.findField("CustomerCategoryId").setValue(rec.id);
                        },
                    }
                }, {
                    name: 'Name',
                    xtype: 'textarea',
                    fieldLabel: 'Name',
                    width: 100,
                    readOnly: false,
                    allowBlank: false
                }, {
                    name: 'Code',
                    xtype: 'textfield',
                    fieldLabel: 'Code',
                    width: 100,
                    readOnly: false,
                    allowBlank: true
                }, {
                    name: 'Country',
                    xtype: 'textfield',
                    fieldLabel: 'Country',
                    width: 100,
                    readOnly: false,
                    allowBlank: true
                }, {
                    name: 'Region',
                    xtype: 'textfield',
                    fieldLabel: 'Region',
                    width: 100,
                    readOnly: false,
                    allowBlank: true
                }, {
                    name: 'City',
                    xtype: 'textfield',
                    fieldLabel: 'City/SubCity',
                    width: 100,
                    readOnly: false,
                    allowBlank: true
                },  {
                    name: 'Woreda',
                    xtype: 'textfield',
                    fieldLabel: 'Woreda',
                    readOnly: false,
                    allowBlank: true
                }, {
                    name: 'HouseNo',
                    xtype: 'textfield',
                    fieldLabel: 'House No',
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
                     name: 'ContactPerson',
                     xtype: 'textfield',
                     fieldLabel: 'Contact Person',
                     width: 100,
                     readOnly: false,
                     allowBlank: true
                 },{
                    name: 'TinNumber',
                    xtype: 'textfield',
                    fieldLabel: 'TIN No',
                    readOnly: false,
                    allowBlank: true
                 },
                 {
                     name: 'RegistrationNo',
                     xtype: 'textfield',
                     fieldLabel: 'Registration No',
                     readOnly: false,
                     allowBlank: true
                 },
                 {
                     name: 'LicenseNo',
                     xtype: 'textfield',
                     fieldLabel: 'License No',
                     readOnly: false,
                     allowBlank: true
                 },
                {
                    name: 'VatNumber',
                    xtype: 'textfield',
                    fieldLabel: 'Vat Reg.No',
                    readOnly: false,
                    allowBlank: true
                },
                {
                    name: 'Telephone',
                    xtype: 'textfield',
                    fieldLabel: 'Phone No',
                    readOnly: false,
                    allowBlank: true
                }, {
                    name: 'Email',
                    xtype: 'textfield',
                    fieldLabel: 'Email',
                    readOnly: false,
                    allowBlank: true
                }, {
                    name: 'CreditLimit',
                    xtype: 'numberfield',
                    fieldLabel: 'Credit Limit',
                    readOnly: false,
                    allowBlank: true
                }, {
                    name: 'OutstandingBalance',
                    xtype: 'numberfield',
                    fieldLabel: 'Outstanding Balance',
                    readOnly: false,
                    allowBlank: true
                }, {
                    name: 'Address',
                    xtype: 'textarea',
                    fieldLabel: 'Shipping Address',
                    width: 100,
                    readOnly: false,
                    allowBlank: true
                },

                ]
            }]
        }],
    }, config));
}
Ext.extend(Ext.erp.ux.customer.Form, Ext.form.FormPanel);
Ext.reg('customer-form', Ext.erp.ux.customer.Form);



/**
* @desc      window

* @copyright (c) 2010, 
* @date      April 01, 2019
* @namespace Ext.erp.ux.customer
* @class     Ext.erp.ux.customer.Window
* @extends   Ext.Window
*/
Ext.erp.ux.customer.Window = function (config) {
    Ext.erp.ux.customer.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 650,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                
                if (typeof this.customerId != "undefined" && this.customerId!="") {

                    this.form.load({ params: { id: this.customerId } });
                }
                else {
                    this.form.getForm().findField('Id').setValue(this.customerId);
                    var nodeName = this.customerCategory.attributes.text;
                    this.form.getForm().findField('CustomerCategory').setValue(nodeName);
                    this.form.getForm().findField('CustomerCategoryId').setValue(this.customerCategoryId);

                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.customer.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.customer.Form();    
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
        Ext.erp.ux.customer.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        var form = Ext.getCmp('customer-form');
        if (!form.getForm().isValid()) return;
        var customerCategoryId = Ext.getCmp('customerCategory-tree').selectedUnitId;
        if (customerCategoryId != '' && customerCategoryId != "root-customer")
            this.form.getForm().findField('CustomerCategoryId').setValue(customerCategoryId);
       
        var window = this;
      form.getForm().submit({
            wapsmsg: 'Please wait...',
            params: { record: Ext.encode({ }) },
            success: function (form, action) {
                if (typeof window.targetForm != "undefined")
                {
                    window.targetForm.findField("CustomerId").setValue(action.result.customerId);
                    window.targetForm.findField("Customer").setValue(Ext.getCmp('customer-form').getForm().findField("Name").getValue());

                }
          
                Ext.getCmp('customer-form').getForm().reset();
                if (typeof Ext.getCmp('customer-paging') != "undefined")
                    Ext.getCmp('customer-paging').doRefresh();
                else
                    window.close();
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
Ext.reg('customer-window', Ext.erp.ux.customer.Window);


/**
* @desc      customer grid

* @copyright (c) 2020, 
* @date      November 01, 2011
* @namespace Ext.erp.ux.customer
* @class     Ext.erp.ux.customer.Grid
* @extends   Ext.grid.GridPanel
*/

Ext.erp.ux.customer.Grid = function (config) {
    Ext.erp.ux.customer.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Customer.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'Name', 'City', 'ContactPerson', 'Email', 'Woreda','Region', 'LicenseNo', 'RegistrationNo', 'Country', 'City', 'Telephone', 'TinNumber', 'VatNumber', 'Remarks', 'PriceCategory'],
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
        id: 'customer-grid',
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
                dataIndex: 'Name',
                header: 'Name',
                sortable: true,
                width: 150,
                menuDisabled: true
            }, {
                dataIndex: 'TinNumber',
                header: 'TIN',
                sortable: true,
                width: 150,
                menuDisabled: true
            }, {
                dataIndex: 'RegistrationNo',
                header: 'Registration No',
                sortable: true,
                width: 150,
                menuDisabled: true
            }, {
                dataIndex: 'LicenseNo',
                header: 'License No',
                sortable: true,
                width: 150,
                menuDisabled: true
            }, {
                dataIndex: 'Telephone',
                header: 'Phone No',
                sortable: true,
                width: 150,
                menuDisabled: true
            }, {
                dataIndex: 'Region',
                header: 'Region',
                sortable: true,
                width: 150,
                menuDisabled: true
            }, {
                dataIndex: 'City',
                header: 'City/SubCity',
                sortable: true,
                width: 150,
                menuDisabled: true
            }, {
                dataIndex: 'Woreda',
                header: 'Woreda',
                sortable: true,
                width: 150,
                menuDisabled: true
            }, ]
    }, config));
};
Ext.extend(Ext.erp.ux.customer.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [
            {
                xtype: 'button',
                text: 'Add',
                id: 'addcustomer',
                iconCls: 'icon-add',
                disabled: !Ext.erp.ux.Reception.getPermission('Customer', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editcustomer',
                iconCls: 'icon-edit',
                disabled: !Ext.erp.ux.Reception.getPermission('Customer', 'CanEdit'),


                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletecustomer',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.ux.Reception.getPermission('Customer', 'CanDelete'),
                handler: this.onDeleteClick
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'textfield',
                emptyText: 'Type Search text here and press "Enter"',
                submitemptyText: false,
                id:'customerSearchText',
                enableKeyEvents: true,
                style: {
                    borderRadius: '25px',
                    padding: '0 10px',
                    width: '200px'
                },
                listeners: {
                    specialKey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            Ext.getCmp('customer-grid').onSearchGrid();
                        }
                    },
                    Keyup: function (field, e) {
                        if (field.getValue() == '') {
                            Ext.getCmp('customer-grid').onSearchGrid();
                        }
                    }
                }
            }];
        this.bbar = new Ext.PagingToolbar({
            id: 'customer-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.customer.Grid.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        var tree = Ext.getCmp('customerCategory-tree');
        var customerCategoryId = tree.selectedUnitId;
        var selectedNode = tree.getSelectionModel().getSelectedNode();
        if (typeof customerCategoryId == "undefined" || customerCategoryId == "" || customerCategoryId == "root-customer") {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select an Customer Category.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.erp.ux.customer.Window({
           customerCategoryId: customerCategoryId,
            customerCategory: selectedNode,
            title: 'Add Customer'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('customer-grid');
        var tree = Ext.getCmp('customerCategory-tree');
        var customerCategoryId = tree.selectedUnitId;
        var selectedNode = tree.getSelectionModel().getSelectedNode();
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
        new Ext.erp.ux.customer.Window({
            customerId: id,
            customerCategoryId: customerCategoryId,
            customerCategory: selectedNode,
            title: 'Edit Customer'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('customer-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected customer',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    Customer.Delete(id, function (result, response) {
                        if (result.success) {
                            Ext.getCmp('customer-paging').doRefresh();
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
        var customerCategoryTree = Ext.getCmp('customerCategory-tree');
        var customerCategoryId = customerCategoryTree.selectedUnitId;
        var searchValue = Ext.getCmp('customerSearchText').getValue();
        
        var grid = Ext.getCmp('customer-grid');
        grid.store.baseParams['record'] = Ext.encode({ customerCategoryId: customerCategoryId, searchText: searchValue });
        grid.store.load({ params: { start: 0, limit: grid.pageSize } });

    },
    afterRender: function () {
      
        Ext.erp.ux.customer.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('customer-Grid', Ext.erp.ux.customer.Grid);


/**
* @desc      customer Main panel

* @copyright (c) 2020, 
* @date      Augest 11, 2011
* @namespace Ext.erp.ux.customer.Panel
* @class     Ext.erp.ux.customer.itemPanel
* @extends   Ext.Panel
*/
Ext.erp.ux.customer.Panel = function (config) {
    Ext.erp.ux.customer.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        flex: 1.5,
        border: false,
    }, config));
};
Ext.extend(Ext.erp.ux.customer.Panel, Ext.Panel, {
    initComponent: function () {
        this.tree = new Ext.erp.ux.customerCategory.Tree();
        this.grid = new Ext.erp.ux.customer.Grid();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                width: 300,
                minSize: 200,
                maxSize: 400,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.tree]
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
                    items: [this.grid]
                }]
            }]
        }];

        Ext.erp.ux.customer.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('customer-panel', Ext.erp.ux.customer.Panel);

