Ext.ns('Ext.erp.ux.dailySales');

/**
* @desc      store grid

* @copyright (c) 2020, 
* @date      November 01, 2011
* @namespace Ext.erp.ux.store
* @class     Ext.erp.ux.dailySales.StoreGrid
* @extends   Ext.grid.GridPanel
*/

Ext.erp.ux.dailySales.StoreGrid = function (config) {
    Ext.erp.ux.dailySales.StoreGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Store.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'Name', 'Code'],
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
                var storeGrid = Ext.getCmp('dailySales-storeGrid');
                if (!storeGrid.getSelectionModel().hasSelection()) return;
                var storeId = storeGrid.getSelectionModel().getSelected().get('Id');
                var detailDrid = Ext.getCmp('dailySales-grid');
                   detailDrid.storeId = storeId;
                    Ext.getCmp('dailySales-grid').onSearchGrid();

            },
            rowdblclick: function (grid, rowIndex, e) {
            },
            scope: this
        },
        id: 'dailySales-storeGrid',
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
                dataIndex: 'Code',
                header: 'Code',
                sortable: true,
                width: 150,
                menuDisabled: true
            },  ]
    }, config));
};
Ext.extend(Ext.erp.ux.dailySales.StoreGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [
            {
                xtype: 'tbfill'
            }, {
                xtype: 'textfield',
                emptyText: 'Type Search text here and press "Enter"',
                submitemptyText: false,
                id: 'storeSearchText',
                enableKeyEvents: true,
                style: {
                    borderRadius: '25px',
                    padding: '0 10px',
                    width: '200px'
                },
                listeners: {
                    specialKey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            Ext.getCmp('store-grid').onSearchGrid();
                        }
                    },
                    Keyup: function (field, e) {
                        if (field.getValue() == '') {
                            Ext.getCmp('store-grid').onSearchGrid();
                        }
                    }
                }
            }];
        this.bbar = new Ext.PagingToolbar({
            id: 'dailySales-storePaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.dailySales.StoreGrid.superclass.initComponent.apply(this, arguments);
    },
    onSearchGrid: function () {
        var searchValue = Ext.getCmp('storeSearchText').getValue();
        var grid = Ext.getCmp('storeGrid-grid');
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
        Ext.erp.ux.dailySales.StoreGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('storeGrid-Grid', Ext.erp.ux.dailySales.StoreGrid);


/**
* @desc      user grid
* @author    Meftuh Mohammed
* @copyright (c) 2012, Cybersoft
* @namespace Ext.erp.ux.dailySales
* @class     Ext.erp.ux.dailySales.Grid
* @extends   Ext.grid.GridPanel
*/
var selectionModel = new Ext.grid.RowSelectionModel();

Ext.erp.ux.dailySales.Grid = function (config) {
    Ext.erp.ux.dailySales.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: DailySales.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DESC'
            },
            fields: ['Id', 'SalesAmount', 'StoreId', 'Expense', 'BankDeposite', 'Date', 'SalesReturnAMount', 'UnDepositedAmount', 'Difference', 'Remark'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('dailySales-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('dailySales-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('dailySales-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'dailySales-grid',
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
             dataIndex: 'Date',
             header: 'Date',
             sortable: false,
             width: 100,
             menuDisabled: true,
             editor: new Ext.form.DateField({
             })
         },
          {
              dataIndex: 'SalesAmount',
              header: 'Sales Amount',
              sortable: false,
              width: 120,
              menuDisabled: true,
              editor: new Ext.form.TextField({
               })
          }, {
              dataIndex: 'Expense',
              header: 'Expense',
              sortable: false,
              width: 120,
              menuDisabled: true,
              editor: new Ext.form.TextField({
              })
          },{
              dataIndex: 'BankDeposite',
              header: 'Bank Deposite',
              sortable: false,
              width: 100,
              menuDisabled: true,
              editor: new Ext.form.NumberField({
                  decimalPrecision: 4
              })
              }, {
                  dataIndex: 'SalesReturnAMount',
                  header: 'Return Amount',
                  sortable: false,
                  width: 100,
                  menuDisabled: true,
                  editor: new Ext.form.NumberField({
                      decimalPrecision: 4
                  })
              }, {
                  dataIndex: 'UnDepositedAmount',
                  header: 'Un Deposited Amount',
                  sortable: false,
                  width: 100,
                  menuDisabled: true,
                  editor: new Ext.form.NumberField({
                      decimalPrecision: 4
                  })
              }, {
                  dataIndex: 'Difference',
                  header: 'Difference',
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
Ext.extend(Ext.erp.ux.dailySales.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: "" }) };
        this.tbar = [
           {
               name: 'StartDate',
               xtype: 'datefield',
               width: 100,
               id:'dailySales-startDate',
               allowBlank: false,
               value: new Date(),
               listeners: {
                   select: function (cmb, rec, idx) {
                       Ext.getCmp('dailySales-grid').onSearchGrid();
                   },
               }
           }, {
               name: 'EndDate',
               xtype: 'datefield',
               width: 100,
               id: 'dailySales-endDate',

               allowBlank: false,
               value: new Date(),
               listeners: {
                   select: function (cmb, rec, idx) {
                       Ext.getCmp('dailySales-grid').onSearchGrid();

                   },
               }
           }, {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: false,
            handler: function () {

                var storeGrid = Ext.getCmp('dailySales-storeGrid');              
                if (!storeGrid.getSelectionModel().hasSelection()){
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: "Please select store!",
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO,
                        scope: this
                    });
                    return;
                }
                 var detailDrid = Ext.getCmp('dailySales-grid');
                var store = detailDrid.getStore();           
                var defaultData = {
                    Remark: '',
                    SalesAmount: 0,
                    Expense: 0,
                    BankDeposite: 0,
                    SalesReturnAMount: 0,
                    UnDepositedAmount: 0,
                    Difference:0,
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
            id:'dailySales-Search',
            enableKeyEvents: true,
            style: {
                borderRadius: '25px',
                padding: '0 10px',
                width: '280px'
            },
            listeners: {
                specialKey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        Ext.getCmp('dailySales-grid').onSearchGrid();
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        Ext.getCmp('dailySales-grid').onSearchGrid();
                      }
                }
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'dailySales-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.dailySales.Grid.superclass.initComponent.apply(this, arguments);
    },
    onSearchGrid: function () {
        var searchValue = Ext.getCmp('dailySales-Search').getValue();
        var startDate = new Date(Ext.getCmp('dailySales-startDate').getValue()).format('M/d/y');
        var endDate = new Date(Ext.getCmp('dailySales-endDate').getValue()).format('M/d/y');
        var grid = Ext.getCmp('dailySales-grid');
        var storeId = grid.storeId;
        grid.store.baseParams['record'] = Ext.encode({ searchText: searchValue, startDate: startDate, endDate: endDate, storeId: storeId });
        grid.store.load({ params: { start: 0, limit: grid.pageSize } });

    },
    onSave: function () {

        var grid = Ext.getCmp('dailySales-grid');
        var rec = '';
        var store = grid.getStore();
        var rec = '';
        var errorMesssage = "";
        store.each(function (item) {

            if (typeof item.get('Date') == 'undefined' || item.get('Date') =="") {
                if (errorMesssage == "")
                    errorMesssage = "Date";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Date";
            }
            if (errorMesssage != '') {
                Ext.MessageBox.show({
                    title: 'Save failed',
                    msg: "Please Enter Valid values for " + errorMesssage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
           rec = rec + item.data['Id'] + ':' +
           item.data['SalesAmount'] + ':' +
           item.data['Expense'] + ':' +
           item.data['BankDeposite'] + ':' +
           item.data['UnDepositedAmount'] + ':' +
           new Date(item.data['Date']).format('M/d/y') + ':' +
           item.data['Remark'] + ':' +
           item.data['SalesReturnAMount'] + ':' +
           item.data['Difference'] + ';';

        });
        if (errorMesssage != "")
            return;

        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });

        DailySales.Save(grid.storeId, rec, function (result) {
            if (result.success) {
                Ext.getCmp('dailySales-paging').doRefresh();
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
        var grid = Ext.getCmp('dailySales-grid');
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
                    DailySales.Delete(id, function (result, response) {
                        if (result.success) {
                            Ext.getCmp('dailySales-paging').doRefresh();
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
        this.store.baseParams = { record: Ext.encode({ storeId:this.storeId }) };
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.dailySales.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('dailySales-grid', Ext.erp.ux.dailySales.Grid);


/**
* @desc      Permission registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.dailySales
* @class     Ext.erp.ux.dailySales.Window
* @extends   Ext.Window
*/
Ext.erp.ux.dailySales.Window = function (config) {
    Ext.erp.ux.dailySales.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.erp.ux.dailySales.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.dailySales.Grid(
            {
                storeId: this.storeId,
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
        Ext.erp.ux.dailySales.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        var grid = Ext.getCmp('dailySales-grid');
        var rec = '';
        var store = grid.getStore();
        var rec = '';
        store.each(function (item) {

            rec = rec + item.data['Id'] + ':' +
           item.data['SalesAmount'] + ':' +
           item.data['Expense'] + ':' +
           item.data['BankDeposite'] + ':' +
           item.data['SalesReturnAMount'] + ':' +
           new Date(item.data['Date']).format('M/d/y') + ':' +                   
           item.data['Remark'] + ';';

        });
        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
      
        DailySales.SaveDailySales(this.storeId, rec, function (result) {
            if (result.success) {
                Ext.getCmp('dailySales-paging').doRefresh();
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
Ext.reg('dailySales-Window', Ext.erp.ux.dailySales.Window);

/**
* @desc      store Main panel

* @copyright (c) 2020, 
* @date      Augest 11, 2011
* @namespace Ext.erp.ux.store.Panel
* @class     Ext.erp.ux.store.itemPanel
* @extends   Ext.Panel
*/
Ext.erp.ux.dailySales.Panel = function (config) {
    Ext.erp.ux.dailySales.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        flex: 1.5,
        border: false,
    }, config));
};
Ext.extend(Ext.erp.ux.dailySales.Panel, Ext.Panel, {
    initComponent: function () {
        this.storeGrid = new Ext.erp.ux.dailySales.StoreGrid();
        this.grid = new Ext.erp.ux.dailySales.Grid();
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
                items: [this.storeGrid]
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

        Ext.erp.ux.dailySales.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('dailySales-panel', Ext.erp.ux.dailySales.Panel);






