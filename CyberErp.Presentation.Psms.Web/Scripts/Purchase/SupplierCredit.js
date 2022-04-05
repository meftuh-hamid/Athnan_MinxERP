Ext.ns('Ext.erp.ux.supplierCredit');

/**
* @desc      supplier grid

* @copyright (c) 2020, 
* @date      November 01, 2011
* @namespace Ext.erp.ux.supplier
* @class     Ext.erp.ux.supplierCredit.SupplierGrid
* @extends   Ext.grid.GridPanel
*/

Ext.erp.ux.supplierCredit.SupplierGrid = function (config) {
    Ext.erp.ux.supplierCredit.SupplierGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Supplier.GetAll,
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
                var supplierGrid = Ext.getCmp('supplierCredit-supplierGrid');
                if (!supplierGrid.getSelectionModel().hasSelection()) return;
                var supplierId = supplierGrid.getSelectionModel().getSelected().get('Id');
                var detailDrid = Ext.getCmp('supplierCredit-grid');
                   detailDrid.supplierId = supplierId;
                   Ext.getCmp('supplierCredit-grid').onSearchGrid();
            },
            rowdblclick: function (grid, rowIndex, e) {
            },
            scope: this
        },
        id: 'supplierCredit-supplierGrid',
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
Ext.extend(Ext.erp.ux.supplierCredit.SupplierGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [
            {
                xtype: 'tbfill'
            }, {
                xtype: 'textfield',
                emptyText: 'Type Search text here and press "Enter"',
                submitemptyText: false,
                id: 'supplierSearchText',
                enableKeyEvents: true,
                style: {
                    borderRadius: '25px',
                    padding: '0 10px',
                    width: '200px'
                },
                listeners: {
                    specialKey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            Ext.getCmp('supplier-grid').onSearchGrid();
                        }
                    },
                    Keyup: function (field, e) {
                        if (field.getValue() == '') {
                            Ext.getCmp('supplier-grid').onSearchGrid();
                        }
                    }
                }
            }];
        this.bbar = new Ext.PagingToolbar({
            id: 'supplierCredit-supplierPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.supplierCredit.SupplierGrid.superclass.initComponent.apply(this, arguments);
    },
    onSearchGrid: function () {
        var searchValue = Ext.getCmp('supplierSearchText').getValue();
        var grid = Ext.getCmp('supplierGrid-grid');
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
        Ext.erp.ux.supplierCredit.SupplierGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('supplierGrid-Grid', Ext.erp.ux.supplierCredit.SupplierGrid);


/**
* @desc      user grid
* @author    Meftuh Mohammed
* @copyright (c) 2012, Cybersoft
* @namespace Ext.erp.ux.supplierCredit
* @class     Ext.erp.ux.supplierCredit.Grid
* @extends   Ext.grid.GridPanel
*/
var selectionModel = new Ext.grid.RowSelectionModel();

Ext.erp.ux.supplierCredit.Grid = function (config) {
    Ext.erp.ux.supplierCredit.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Supplier.GetAllSupplierCredit,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DESC'
            },
            fields: ['Id', 'InvoiceReference', 'SupplierId', 'Fs', 'InvoiceAmount','Date', 'RemainingAmount', 'Remark'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('supplierCredit-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('supplierCredit-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('supplierCredit-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'supplierCredit-grid',
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
Ext.extend(Ext.erp.ux.supplierCredit.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: "" }) };
        this.tbar = [
            {
                name: 'StartDate',
                xtype: 'datefield',
                width: 100,
                id: 'supplierCredit-startDate',
                allowBlank: false,
                value: new Date(),
                listeners: {
                    select: function (cmb, rec, idx) {
                        Ext.getCmp('supplierCredit-grid').onSearchGrid();
                    },
                }
            }, {
                name: 'EndDate',
                xtype: 'datefield',
                width: 100,
                id: 'supplierCredit-endDate',

                allowBlank: false,
                value: new Date(),
                listeners: {
                    select: function (cmb, rec, idx) {
                        Ext.getCmp('supplierCredit-grid').onSearchGrid();

                    },
                }
            }, {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: false,
            handler: function () {

                var supplierGrid = Ext.getCmp('supplierCredit-supplierGrid');              
                if (!supplierGrid.getSelectionModel().hasSelection()){
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: "Please select supplier!",
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO,
                        scope: this
                    });
                    return;
                }
                var supplierId=supplierGrid.getSelectionModel().getSelected().get('Id');
                var detailDrid = Ext.getCmp('supplierCredit-grid');
                var store = detailDrid.getStore();           
                var defaultData = {
                    Remark: '',
                    supplierId: supplierId
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
            id: 'supplierCredit-Search',

            enableKeyEvents: true,
            style: {
                borderRadius: '25px',
                padding: '0 10px',
                width: '280px'
            },
            listeners: {
                specialKey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        Ext.getCmp('supplierCredit-grid').onSearchGrid();
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        Ext.getCmp('supplierCredit-grid').onSearchGrid();
                    }
                }
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'supplierCredit-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.supplierCredit.Grid.superclass.initComponent.apply(this, arguments);
    },
    onSearchGrid: function () {
        var searchValue = Ext.getCmp('supplierCredit-Search').getValue();
        var startDate = new Date(Ext.getCmp('supplierCredit-startDate').getValue()).format('M/d/y');
        var endDate = new Date(Ext.getCmp('supplierCredit-endDate').getValue()).format('M/d/y');
        var grid = Ext.getCmp('supplierCredit-grid');
        var supplierId = grid.supplierId;
        grid.store.baseParams['record'] = Ext.encode({ searchText: searchValue, startDate: startDate, endDate: endDate, supplierId: supplierId });
        grid.store.load({ params: { start: 0, limit: grid.pageSize } });

    },
    onSave: function () {

        var grid = Ext.getCmp('supplierCredit-grid');
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

        Supplier.SaveSupplierCredit(grid.supplierId, rec, function (result) {
            if (result.success) {
                Ext.getCmp('supplierCredit-paging').doRefresh();
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
        var grid = Ext.getCmp('supplierCredit-grid');
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
                    Supplier.DeleteSupplierCredit(id, function (result, response) {
                        if (result.success) {
                            Ext.getCmp('supplierCredit-paging').doRefresh();
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
        this.store.baseParams = { record: Ext.encode({ supplierId:this.supplierId }) };
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.supplierCredit.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('supplierCredit-grid', Ext.erp.ux.supplierCredit.Grid);


/**
* @desc      Permission registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.supplierCredit
* @class     Ext.erp.ux.supplierCredit.Window
* @extends   Ext.Window
*/
Ext.erp.ux.supplierCredit.Window = function (config) {
    Ext.erp.ux.supplierCredit.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.erp.ux.supplierCredit.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.supplierCredit.Grid(
            {
                supplierId: this.supplierId,
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
        Ext.erp.ux.supplierCredit.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        var grid = Ext.getCmp('supplierCredit-grid');
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
      
        Supplier.SaveSupplierCredit(this.supplierId, rec, function (result) {
            if (result.success) {
                Ext.getCmp('supplierCredit-paging').doRefresh();
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
Ext.reg('supplierCredit-Window', Ext.erp.ux.supplierCredit.Window);

/**
* @desc      supplier Main panel

* @copyright (c) 2020, 
* @date      Augest 11, 2011
* @namespace Ext.erp.ux.supplier.Panel
* @class     Ext.erp.ux.supplier.itemPanel
* @extends   Ext.Panel
*/
Ext.erp.ux.supplierCredit.Panel = function (config) {
    Ext.erp.ux.supplierCredit.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        flex: 1.5,
        border: false,
    }, config));
};
Ext.extend(Ext.erp.ux.supplierCredit.Panel, Ext.Panel, {
    initComponent: function () {
        this.supplierGrid = new Ext.erp.ux.supplierCredit.SupplierGrid();
        this.grid = new Ext.erp.ux.supplierCredit.Grid();
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
                items: [this.supplierGrid]
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

        Ext.erp.ux.supplierCredit.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('supplierCredit-panel', Ext.erp.ux.supplierCredit.Panel);






