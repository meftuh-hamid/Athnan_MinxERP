Ext.ns('Ext.erp.ux.itemLocationTransaction');

var financialPostSelModel = new Ext.grid.CheckboxSelectionModel();

Ext.erp.ux.itemLocationTransaction.HeaderGrid = function (config) {
    Ext.erp.ux.itemLocationTransaction.HeaderGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FinancialPost.GetAllHeaders,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'OperationType','StoreId','Store', 'OperationTypeName', 'VoucherTypeId', 'ReferenceNo', 'Date', 'Purpose', 'Amount', 'IsPosted'],
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
        id: 'itemLocationTransactionHeader-grid',
        searchCriteria: {},
        mode: 'get',
        pageSize: 30,
        height: 300,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true

        }),
        listeners: {
            rowClick: function (grid, rowIndex, e) {
                var selectedRow = grid.getStore().getAt(rowIndex);
                this.loadVoucherDetail(selectedRow);
                 },
            containermousedown: function (grid) {
                grid.getSelectionModel().deselectRange(0, grid.pageSize);
                var itemLocationTransactionDetailGrid = Ext.getCmp('itemLocationTransactionDetail-grid');
                var itemLocationTransactionDetailStore = itemLocationTransactionDetailGrid.getStore();
                itemLocationTransactionDetailStore.removeAll();
            },
            scope: this
        },
        viewConfig: {
            forceFit: true
        },
        columns: [{
            dataIndex: 'VoucherTypeId',
            hidden: true
        }, {
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'OperationType',
            header: 'OperationType',
            sortable: true,
            width: 100,
            hidden: true,
            menuDisabled: true,
            renderer: this.customRenderer
        }, {
            dataIndex: 'OperationTypeName',
            header: 'Operation Type',
            sortable: true,
            width: 200,
            menuDisabled: true,
            renderer: this.customRenderer
        }, {
            dataIndex: 'ReferenceNo',
            header: 'Reference No',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer
        }, {
            dataIndex: 'Date',
            header: 'Date',
            sortable: true,
            width: 120,
            menuDisabled: true,
            renderer: this.customRenderer
        }, {
            dataIndex: 'Store',
            header: 'Store',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer
        }, ]
    }, config));
};
Ext.extend(Ext.erp.ux.itemLocationTransaction.HeaderGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        var param = { mode: 'get', voucherType: '' };
        this.store.baseParams = { record: Ext.encode(param) };
        this.tbar = [
           {
               hiddenName: 'VoucherTypeId',
               xtype: 'combo',
               id: 'VoucherTypeIdOnPostToFinance',
               fieldLabel: 'Voucher Type',
               triggerAction: 'all',
               mode: 'local',
               editable: false,
               forceSelection: false,
               emptyText: '---Select---',
               allowBlank: false,
               store: new Ext.data.ArrayStore({
                   fields: ['Id', 'Name'],
                   idProperty: 'Id',
                   data: [
                       [1, 'GRN'],
                       [1, 'Issue'],
                       [1, 'Transfer Issue'],
                       [1, 'Transfer Receive'],
                       [1, 'Return'],
                       [1, 'Adjustment'],
                       [1, 'Delivery Order'],
                       [1, 'Disposal'],
                    ]
               }),
               valueField: 'Name',
               displayField: 'Name',
               listeners: {
                   scope: this,
                   select: function (comb, rec) {
                       var voucherType = rec.get("Name")
                       var grid = Ext.getCmp('itemLocationTransactionHeader-grid');
                       var store = grid.getStore();
                       store.baseParams = { record: Ext.encode({ voucherType: voucherType, mode: 'get' }) };
                       grid.getStore().reload({
                           params: {
                               start: 0,
                               limit: grid.pageSize
                           }
                       });
                       Ext.getCmp('itemLocationTransactionHeader-grid').getSelectionModel().clearSelections();

                   }
               }
           }, {
               xtype: 'tbfill'
           }, {
               id: 'searchFinancialPost',
               text: 'Search',
               iconCls: 'icon-filter',
               handler: this.onSearchVoucher
           }];
        this.bbar = new Ext.PagingToolbar({
            id: 'itemLocationTransactionHeader-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.itemLocationTransaction.HeaderGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        Ext.getCmp('itemLocationTransactionHeader-grid').getSelectionModel().clearSelections();
        Ext.erp.ux.itemLocationTransaction.HeaderGrid.superclass.afterRender.apply(this, arguments);
    },
    onSearchVoucher: function () {
        var voucherTypeId = Ext.getCmp('VoucherTypeIdOnPostToFinance').getValue();
        if (voucherTypeId == '') {
            Ext.MessageBox.show({
                title: 'Failure',
                msg: 'You must select a voucher to use the filter feature.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        Ext.erp.ux.voucherSearch.Observable.on('searchvoucher', function (result) {
            result['mode'] = 'search';
            var grid = Ext.getCmp('itemLocationTransactionHeader-grid');
            result['voucherType'] = Ext.getCmp('VoucherTypeIdOnPostToFinance').getRawValue();

            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.voucherSearch.Window({ title: 'Search Financial Post' }).show();
    },
   loadVoucherDetail: function (selectedRow) {
        var itemLocationTransactionDetailGrid = Ext.getCmp('itemLocationTransactionDetail-grid');
        var itemLocationTransactionDetailStore = itemLocationTransactionDetailGrid.getStore();
        var itemLocationTransactionHeaderId = selectedRow.get('Id');

        var voucherType = selectedRow.get('OperationTypeName');
        var voucherNo = selectedRow.get('ReferenceNo');
        var voucherTypeId = selectedRow.get('VoucherTypeId');

        itemLocationTransactionDetailStore.baseParams = { record: Ext.encode({ voucherHeaderId: itemLocationTransactionHeaderId, voucherType: voucherType, mode: this.mode }) };
        itemLocationTransactionDetailStore.load({
            params: { start: 0, limit: 100 }
        });

    },
   customRenderer: function (value, metaData, record, rowIndex, colIndex, store) {
        if (record.data.IsPosted == true) {
            return '<span style="color:green;">' + value + '</span>';
        }
        else {
            return '<span style="color:red;">' + value + '</span>';
        }
    }
});
Ext.reg('itemLocationTransactionHeader-grid', Ext.erp.ux.itemLocationTransaction.HeaderGrid);


/**
* @desc      Voucher grid
* @author    Binalfew Kassa
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.itemLocationTransaction
* @class     Ext.erp.ux.itemLocationTransaction.DetailGrid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.itemLocationTransaction.DetailGrid = function (config) {
    Ext.erp.ux.itemLocationTransaction.DetailGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FinancialPost.GetAllDetails,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'ItemId', 'Name', 'Code', 'VoucherHeaderId', 'Quanity', 'UnitCost'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('itemLocationTransactionDetail-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () {
                    var grid = Ext.getCmp('itemLocationTransactionDetail-grid');

                    grid.body.unmask();
                },
                loadException: function () { Ext.getCmp('itemLocationTransactionDetail-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'itemLocationTransactionDetail-grid',
        selectedVoucherTypeId: 0,
        pageSize: 10,
        stripeRows: true,
        columnLines: true,
        border: true,
        sm: Ext.erp.ux.common.SelectionModel,
        listeners: {
            containermousedown: function (grid) {
                grid.getSelectionModel().deselectRange(0, grid.pageSize);
            },
            rowClick:function(){
                Ext.getCmp('itemLocationTransaction-grid').loadGrid();
            },
            scope: this
        },
        viewConfig: {
            forceFit: true
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: false,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'ItemId',
            header: 'ItemId',
            sortable: true,
            width: 100,
            hidden: true,
            menuDisabled: true,
            xtype: 'combocolumn'
        }, {
            dataIndex: 'VoucherHeaderId',
            header: 'VoucherHeaderId',
            sortable: true,
            width: 100,
            hidden: true,
            menuDisabled: true,
            xtype: 'combocolumn'
        }, {
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'Code',
            header: 'Code',
            sortable: false,
            width: 130,
            menuDisabled: true
        }, {
            dataIndex: 'Quanity',
            header: 'Quanity',
            sortable: true,
            width: 60,
            menuDisabled: true,
            align: 'center'
        }, {
            dataIndex: 'UnitCost',
            header: 'Unit Cost',
            sortable: true,
            width: 80,
            menuDisabled: true,
            align: 'center',
            renderer: function (value) {
                if (value > 0) {
                    return Ext.util.Format.number(value, '0,000.00 ');
                } else {
                    return '';
                }
            }
        }]
    }, config));
};
Ext.extend(Ext.erp.ux.itemLocationTransaction.DetailGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ voucherTypeId: this.voucherTypeId }) };

        Ext.erp.ux.itemLocationTransaction.DetailGrid.superclass.initComponent.apply(this, arguments);
    },
});
Ext.reg('itemLocationTransactionDetail-grid', Ext.erp.ux.itemLocationTransaction.DetailGrid);

var sm = new Ext.grid.RowSelectionModel({
    clicksToEdit: 1,
    checkOnly: true,
    singleSelect: false
})
/**
* @desc      itemLocationTransaction Grid
* @author    Henock Melisse
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.itemLocationTransaction
* @class     Ext.erp.ux.itemLocationTransaction.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.itemLocationTransaction.Grid = function (config) {
    Ext.erp.ux.itemLocationTransaction.Grid.superclass.constructor.call(this, Ext.apply({

        store: new Ext.data.DirectStore({
            directFn: ItemLocationTransaction.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'Store', 'ItemId', 'ItemLocationId', 'LocationId', 'Location', 'LocationBin', 'LocationBinId', 'StoreWithLocation', 'AvailableQuantity', 'Quantity'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('itemLocationTransaction-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('itemLocationTransaction-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('itemLocationTransaction-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'itemLocationTransaction-grid',
        pageSize: 10,
        stripeRows: true,
        border: false,
        columnLines: true,
        clicksToEdit: 1,

        sm: sm,
         viewConfig: {
    },
    columns: [{
        dataIndex: 'Id',
        header: 'Id',
        sortable: true,
        hidden: true,
        width: 100,
        menuDisabled: true
    }, new Ext.grid.RowNumberer(),{
        dataIndex: 'Location',
        header: 'Location',
        sortable: true,
        width: 100,
        menuDisabled: true,
        editor: new Ext.form.ComboBox({
            xtype: 'combo',
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
                api: { read: Psms.GetLocationBySearch }
            }),
            valueField: 'Name',
            displayField: 'Name',
            listeners: {
                beforeQuery: function (combo, record, index) {
                    var storeId = Ext.getCmp('itemLocationTransactionHeader-grid').getSelectionModel().getSelected().get('StoreId');
                    this.store.baseParams = { storeId: storeId };
                    this.getStore().reload({
                        params: {
                            start: 0,
                            limit: this.pageSize
                        }
                    });

                },
                select: function (combo, record, index) {

                    var detailDrid = Ext.getCmp('itemLocationTransaction-grid');
                    var selectedrecord = detailDrid.getSelectionModel().getSelected();
                    selectedrecord.set('LocationId', record.get("Id"));
                }
            }
        })
    }, {
        dataIndex: 'LocationBin',
        header: 'Location Bin',
        sortable: true,
        width: 100,
        menuDisabled: true,
        editor: new Ext.form.ComboBox({
           xtype: 'combo',
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
                    fields: ['Id', 'Name', 'Quantity']
                }),
                autoLoad: true,
                api: { read: Psms.GetItemLocationBySearch }
            }),
            valueField: 'Name',
            displayField: 'Name',
            listeners: {
                beforeQuery: function (combo, record, index) {
                    var storeId = Ext.getCmp('itemLocationTransactionHeader-grid').getSelectionModel().getSelected().get('StoreId');
                    var detailDrid = Ext.getCmp('itemLocationTransaction-grid');
                    var selectedrecord = detailDrid.getSelectionModel().getSelected();
                    var itemId = selectedrecord.get('ItemId');
                    var locationId = selectedrecord.get('LocationId');
                    this.store.baseParams = {storeId:storeId, itemId: itemId, locationId: locationId};
                    this.getStore().reload({
                        params: {
                            start: 0,
                            limit: this.pageSize
                        }
                    });

                },
                select: function (combo, record, index) {

                    var detailDrid = Ext.getCmp('itemLocationTransaction-grid');
                    var selectedrecord = detailDrid.getSelectionModel().getSelected();
                    selectedrecord.set('ItemLocationId', record.get("Id"));
                    selectedrecord.set('AvailableQuantity', record.get("Quantity"));
                }
            }
        })
    }, {
        dataIndex: 'AvailableQuantity',
        header: 'Available Q.',
        sortable: true,
        width: 100,
        menuDisabled: true,
    }, {
        dataIndex: 'Quantity',
        header: 'Quantity',
        sortable: true,
        width: 100,
        menuDisabled: true,
        editor: {
            xtype: 'numberfield',
            allowBlank: false
        }
    }, {
        dataIndex: 'Remark',
        header: 'Remark',
        sortable: true,
        width: 100,
        menuDisabled: true,
        editor: {
            xtype: 'textarea',
            allowBlank: false
        }
    }, ]
}, config));
}
Ext.extend(Ext.erp.ux.itemLocationTransaction.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'button',
            text: 'Add',
            disabled: !Ext.erp.ux.Reception.getPermission('Location Transaction', 'CanAdd'),

            iconCls: 'icon-add',
            handler: function () {
                var grid = Ext.getCmp('itemLocationTransaction-grid');
                var store = grid.getStore();
                var detailGrid = Ext.getCmp('itemLocationTransactionDetail-grid');
                if (!detailGrid.getSelectionModel().hasSelection()) {
                    Ext.MessageBox.show({
                        title: 'Failure',
                        msg: 'You must select a voucher detail item first.',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,
                        scope: this
                    });
                    return;
                }
                var itemId = detailGrid.getSelectionModel().getSelected().get('ItemId');
                var defaultData = {
                    Remark: '',
                    ItemId:itemId,
                    Quantity: 0,
                };
                var records = new store.recordType(defaultData);
                store.add(records);
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Remove',
            iconCls: 'icon-delete',
            handler: function () {
                var grid = Ext.getCmp('itemLocationTransaction-grid');

                if (!grid.getSelectionModel().hasSelection())
                    return;

                var selectedrecord = grid.getSelectionModel().getSelected();
                grid.getStore().remove(selectedrecord);
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSaveClick
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'itemLocationTransaction-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.store.Grid.superclass.initComponent.apply(this, arguments);
    },
    onAdd: function () {
        var grid = Ext.getCmp('itemLocationTransaction-ItemGrid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var itemId = grid.getSelectionModel().getSelected().get('Id');
        var itemName = grid.getSelectionModel().getSelected().get('Name');
        new Ext.erp.ux.itemLocationTransaction.Window({
            itemLocationTransactionId: '',
            itemId: itemId,
            itemName: itemName,
            title: 'Add ' + itemName + ' to Location'
        }).show();
    },
    onSaveClick: function () {

        var grid = Ext.getCmp('itemLocationTransaction-grid');

        var store = grid.getStore();
        var headerGrid = Ext.getCmp('itemLocationTransactionHeader-grid');
        var voucherId = headerGrid.getSelectionModel().getSelected().get('Id');
        var voucherNo = headerGrid.getSelectionModel().getSelected().get('ReferenceNo');
        var voucherTypeId = headerGrid.getSelectionModel().getSelected().get('VoucherTypeId');
        var detailGrid = Ext.getCmp('itemLocationTransactionDetail-grid');
        var selectedrecord = detailGrid.getSelectionModel().getSelected();
        var itemId = selectedrecord.get('ItemId');

        var rec = ''; var errorMesssage = "";
        store.each(function (item) {
            if (typeof item.get('Quantity') == 'undefined' || item.get('Quantity') == "") {
                if (errorMesssage == "")
                    errorMesssage = "Quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "           Quantity";
            }
            if (typeof item.get('Quantity')> item.get('AvailableQuantity')) {
                if (errorMesssage == "")
                    errorMesssage = "Quantity should not be greater than available ";
                else
                    errorMesssage = errorMesssage + "</br>" + "           Quantity should not be greater than available ";
            }
            if (typeof item.get('ItemLocationId') == 'undefined' || item.get('ItemLocationId') == "") {
                if (errorMesssage == "")
                    errorMesssage = "location";
                else
                    errorMesssage = errorMesssage + "</br>" + "           location";
            }
            if (errorMesssage != '') {
                Ext.MessageBox.show({
                    title: 'Save failed',
                    msg: "Please Enter Valid values for Item  " + item.data['Location'] + " for feilds " + "</br>" + errorMesssage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
            rec = rec + item.get('Id')+ ':' +
                   item.data['ItemLocationId'] + ':' +
                   item.data['Quantity'] + ':' +
                   item.data['Remark'] + ';';


        });
        if (errorMesssage != "")
            return;
    
        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
        ItemLocationTransaction.Save(voucherId, voucherNo, voucherTypeId, itemId,rec, function (result) {

            if (result.success = true) {
                Ext.MessageBox.show({
                    title: 'Success',
                    msg: result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });
                Ext.getCmp('itemLocationTransaction-grid').loadGrid();
            }
            else {
                Ext.MessageBox.show({
                    title: 'Failure',
                    msg: result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });
            }
        });
    },
    loadGrid: function () {
        var grid = Ext.getCmp('itemLocationTransaction-grid');
        var store = grid.getStore();
        var voucherId = Ext.getCmp('itemLocationTransactionHeader-grid').getSelectionModel().getSelected().get('Id');
        var voucherTypeId = Ext.getCmp('itemLocationTransactionHeader-grid').getSelectionModel().getSelected().get('VoucherTypeId');

        var detailGrid = Ext.getCmp('itemLocationTransactionDetail-grid');
        var selectedrecord = detailGrid.getSelectionModel().getSelected();
        var itemId = selectedrecord.get('ItemId');

        store.baseParams = { record: Ext.encode({ itemId: itemId, voucherId: voucherId, voucherTypeId: voucherTypeId }) };

        grid.getStore().reload({
            params: {
                start: 0,
                limit: grid.pageSize
            }
        });
    }
});
Ext.reg('itemLocationTransaction-Grid', Ext.erp.ux.itemLocationTransaction.Grid);



/**
* @desc      itemLocationTransaction panel
* @author    Henock Melisse
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.itemLocationTransaction
* @class     Ext.erp.ux.itemLocationTransaction.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.itemLocationTransaction.Panel = function (config) {
    Ext.erp.ux.itemLocationTransaction.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'itemLocationTransaction-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.itemLocationTransaction.Panel, Ext.Panel, {
    initComponent: function () {
        this.headerGrid = new Ext.erp.ux.itemLocationTransaction.HeaderGrid();
        this.detailGrid = new Ext.erp.ux.itemLocationTransaction.DetailGrid();
        this.grid = new Ext.erp.ux.itemLocationTransaction.Grid();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                width: 350,
                minSize: 200,
                maxSize: 600,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.headerGrid]
            }, {
                region: 'center',
                border: true,
                layout: 'fit',
                items: [{
                    layout: 'hbox',
                    layoutConfig: {
                        type: 'vbox',
                        align: 'stretch',
                        pack: 'start'
                    },
                    defaults: {
                        flex: 1
                    },
                    items: [this.detailGrid, this.grid]
                }]
            }]
        }];
        Ext.erp.ux.itemLocationTransaction.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('itemLocationTransaction-panel', Ext.erp.ux.itemLocationTransaction.Panel);
