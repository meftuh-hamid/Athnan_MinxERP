Ext.ns('Ext.erp.ux.customerCredit');

/**
* @desc      customer grid

* @copyright (c) 2020, 
* @date      November 01, 2011
* @namespace Ext.erp.ux.customer
* @class     Ext.erp.ux.customerCredit.CustomerGrid
* @extends   Ext.grid.GridPanel
*/

Ext.erp.ux.customerCredit.CustomerGrid = function (config) {
    Ext.erp.ux.customerCredit.CustomerGrid.superclass.constructor.call(this, Ext.apply({
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

            fields: ['Id', 'Name', 'City', 'ContactPerson', 'Email', 'Country', 'City', 'Telephone', 'TinNumber', 'VatNumber', 'Remarks', 'PriceCategory'],
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
        listeners: {
            rowClick: function () {
                var customerGrid = Ext.getCmp('customerCredit-customerGrid');
                if (!customerGrid.getSelectionModel().hasSelection()) return;
                var customerId = customerGrid.getSelectionModel().getSelected().get('Id');
                var detailDrid = Ext.getCmp('customerCredit-grid');
                   detailDrid.customerId = customerId;
                   Ext.getCmp('customerCredit-grid').onSearchGrid();
            },
            rowdblclick: function (grid, rowIndex, e) {
            },
            scope: this
        },
        id: 'customerCredit-customerGrid',
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
                dataIndex: 'VatNumber',
                header: 'Vat Re.No',
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
                dataIndex: 'ContactPerson',
                header: 'Contact Person',
                sortable: true,
                width: 150,
                menuDisabled: true
            }, ]
    }, config));
};
Ext.extend(Ext.erp.ux.customerCredit.CustomerGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [
            {
                xtype: 'tbfill'
            }, {
                xtype: 'textfield',
                emptyText: 'Type Search text here and press "Enter"',
                submitemptyText: false,
                id: 'customerSearchText',
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
            id: 'customerCredit-customerPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.customerCredit.CustomerGrid.superclass.initComponent.apply(this, arguments);
    },
    onSearchGrid: function () {
        var searchValue = Ext.getCmp('customerSearchText').getValue();
        var grid = Ext.getCmp('customerGrid-grid');
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
        Ext.erp.ux.customerCredit.CustomerGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('customerGrid-Grid', Ext.erp.ux.customerCredit.CustomerGrid);


/**
* @desc      user grid
* @author    Meftuh Mohammed
* @copyright (c) 2012, Cybersoft
* @namespace Ext.erp.ux.customerCredit
* @class     Ext.erp.ux.customerCredit.Grid
* @extends   Ext.grid.GridPanel
*/
var selectionModel = new Ext.grid.RowSelectionModel();

Ext.erp.ux.customerCredit.Grid = function (config) {
    Ext.erp.ux.customerCredit.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Customer.GetAllCustomerCredit,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DESC'
            },
            fields: ['Id', 'InvoiceReference', 'CustomerId', 'Fs', 'InvoiceAmount','Date', 'RemainingAmount', 'Remark'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('customerCredit-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('customerCredit-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('customerCredit-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'customerCredit-grid',
        pageSize: 20,
         stripeRows: true,
        border: false,
        clicksToEdit: 1,
        sm: selectionModel,
      
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(),
          {
              dataIndex: 'InvoiceReference',
              header: 'Invoice Reference',
              sortable: false,
              width: 120,
              menuDisabled: true,
              editor: new Ext.form.TextField({
               })
          }, {
              dataIndex: 'Fs',
              header: 'Fs',
              sortable: false,
              width: 120,
              menuDisabled: true,
              editor: new Ext.form.TextField({
              })
          }, {
              dataIndex: 'Date',
              header: 'Date',
              sortable: false,
              width: 100,
              menuDisabled: true,
              editor: new Ext.form.DateField({
              })
          },
              {
                  dataIndex: 'InvoiceAmount',
                  header: 'Invoice Amount',
              sortable: false,
              width: 100,
              menuDisabled: true,
              editor: new Ext.form.NumberField({
                  decimalPrecision: 4
              })
              }, {
                  dataIndex: 'RemainingAmount',
                  header: 'Remaining Amount',
                  sortable: false,
                  width: 100,
                  menuDisabled: true,
                  editor: new Ext.form.NumberField({
                      decimalPrecision: 4
                  })
              }, {
                dataIndex: 'Remark',
                header: 'Remark',
                width: 120,
                menuDisabled: true,
                editor: new Ext.form.TextArea({
                    height: 150,

                })
            }]
    }, config));
}
Ext.extend(Ext.erp.ux.customerCredit.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: "" }) };
        this.tbar = [
             {
                 name: 'StartDate',
                 xtype: 'datefield',
                 width: 100,
                 id: 'customerCredit-startDate',
                 allowBlank: false,
                 value: new Date(),
                 listeners: {
                     select: function (cmb, rec, idx) {
                         Ext.getCmp('customerCredit-grid').onSearchGrid();
                     },
                 }
             }, {
                 name: 'EndDate',
                 xtype: 'datefield',
                 width: 100,
                 id: 'customerCredit-endDate',

                 allowBlank: false,
                 value: new Date(),
                 listeners: {
                     select: function (cmb, rec, idx) {
                         Ext.getCmp('customerCredit-grid').onSearchGrid();

                     },
                 }
             }, {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: false,
            handler: function () {

                var customerGrid = Ext.getCmp('customerCredit-customerGrid');              
                if (!customerGrid.getSelectionModel().hasSelection()){
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: "Please select customer!",
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO,
                        scope: this
                    });
                    return;
                }
                var customerId=customerGrid.getSelectionModel().getSelected().get('Id');
                var detailDrid = Ext.getCmp('customerCredit-grid');
                var store = detailDrid.getStore();           
                var defaultData = {
                    Remark: '',
                    customerId: customerId
                 };
                var records = new store.recordType(defaultData);
                store.insert(0,records);
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Remove',
            iconCls: 'icon-exit',
            disabled: false,
            handler: this.onDeleteClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Save',
            iconCls: 'icon-save',
            disabled: false,
            handler: this.onSave,
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'textfield',
            emptyText: 'Type Search text here and press "Enter"',
            submitEmptyText: false,
            id: 'customerCredit-Search',
            enableKeyEvents: true,
            style: {
                borderRadius: '25px',
                padding: '0 10px',
                width: '280px'
            },
            listeners: {
                specialKey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        Ext.getCmp('customerCredit-grid').onSearchGrid();
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        Ext.getCmp('customerCredit-grid').onSearchGrid();
                    }
                }
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'customerCredit-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.customerCredit.Grid.superclass.initComponent.apply(this, arguments);
    },
    onSearchGrid: function () {
        var searchValue = Ext.getCmp('customerCredit-Search').getValue();
        var startDate = new Date(Ext.getCmp('customerCredit-startDate').getValue()).format('M/d/y');
        var endDate = new Date(Ext.getCmp('customerCredit-endDate').getValue()).format('M/d/y');
        var grid = Ext.getCmp('customerCredit-grid');
        var customerId = grid.customerId;
        grid.store.baseParams['record'] = Ext.encode({ searchText: searchValue, startDate: startDate, endDate: endDate, customerId: customerId });
        grid.store.load({ params: { start: 0, limit: grid.pageSize } });

    },
    onSave: function () {

        var grid = Ext.getCmp('customerCredit-grid');
        var rec = '';
        var store = grid.getStore();
        var rec = '';
        store.each(function (item) {

            rec = rec + item.data['Id'] + ':' +
           item.data['InvoiceReference'] + ':' +
           item.data['Fs'] + ':' +
           item.data['InvoiceAmount'] + ':' +
           item.data['RemainingAmount'] + ':' +
           new Date(item.data['Date']).format('M/d/y') + ':' +
           item.data['Remark'] + ';';

        });
        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });

        Customer.SaveCustomerCredit(grid.customerId, rec, function (result) {
            if (result.success) {
                Ext.getCmp('customerCredit-paging').doRefresh();
                Ext.MessageBox.show({
                    title: 'Success',
                    msg: result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });
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
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('customerCredit-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected record',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    Customer.DeleteCustomerCredit(id, function (result, response) {
                        if (result.success) {
                            Ext.getCmp('customerCredit-paging').doRefresh();
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
        this.store.baseParams = { record: Ext.encode({ customerId:this.customerId }) };
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.customerCredit.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('customerCredit-grid', Ext.erp.ux.customerCredit.Grid);


/**
* @desc      Permission registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.customerCredit
* @class     Ext.erp.ux.customerCredit.Window
* @extends   Ext.Window
*/
Ext.erp.ux.customerCredit.Window = function (config) {
    Ext.erp.ux.customerCredit.Window.superclass.constructor.call(this, Ext.apply({
        title: 'Item Units',
        layout: 'hbox',
        width: 700,
        bodyStyle: 'margin: 5px; padding-right: 10px',
        align: 'stretch',
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
    }, config));
}
Ext.extend(Ext.erp.ux.customerCredit.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.customerCredit.Grid(
            {
                customerId: this.customerId,
                inventoryUnit: this.inventoryUnit
            });
        this.items = [this.grid];

        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSave,
            scope: this
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.erp.ux.customerCredit.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        var grid = Ext.getCmp('customerCredit-grid');
        var rec = '';
        var store = grid.getStore();
        var rec = '';
        store.each(function (item) {

            rec = rec + item.data['Id'] + ':' +
           item.data['InvoiceReference'] + ':' +
           item.data['Fs'] + ':' +
           item.data['InvoiceAmount'] + ':' +
           item.data['RemainingAmount'] + ':' +
           new Date(item.data['Date']).format('M/d/y') + ':' +                   
           item.data['Remark'] + ';';

        });
        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
      
        Customer.SaveCustomerCredit(this.customerId, rec, function (result) {
            if (result.success) {
                Ext.getCmp('customerCredit-paging').doRefresh();
                Ext.MessageBox.show({
                    title: 'Success',
                    msg: result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });
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
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('customerCredit-Window', Ext.erp.ux.customerCredit.Window);

/**
* @desc      customer Main panel

* @copyright (c) 2020, 
* @date      Augest 11, 2011
* @namespace Ext.erp.ux.customer.Panel
* @class     Ext.erp.ux.customer.itemPanel
* @extends   Ext.Panel
*/
Ext.erp.ux.customerCredit.Panel = function (config) {
    Ext.erp.ux.customerCredit.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        flex: 1.5,
        border: false,
    }, config));
};
Ext.extend(Ext.erp.ux.customerCredit.Panel, Ext.Panel, {
    initComponent: function () {
        this.customerGrid = new Ext.erp.ux.customerCredit.CustomerGrid();
        this.grid = new Ext.erp.ux.customerCredit.Grid();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                width: 500,
                minSize: 200,
                maxSize: 400,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.customerGrid]
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

        Ext.erp.ux.customerCredit.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('customerCredit-panel', Ext.erp.ux.customerCredit.Panel);






