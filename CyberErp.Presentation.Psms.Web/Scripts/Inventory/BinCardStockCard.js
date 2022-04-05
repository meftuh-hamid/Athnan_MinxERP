
Ext.ns('Ext.erp.ux.stockCard');


/**
* @desc      stockCard Record grid
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      January 27, 2011
* @namespace Ext.erp.ux.stockCard
* @class     Ext.erp.ux.stockCard.Grid
* @extends   Ext.grid.GridPanel
*/

Ext.erp.ux.stockCard.Grid = function (config) {
    Ext.erp.ux.stockCard.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: BinCardStockCard.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            clickToEdit: 1,
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'ItemId', 'StoreId', 'VoucherTypeId', 'VoucherId', 'ItemCatagory', 'VoucherType', 'UnitPrice', 'Remark','AverageCost', 'Store', 'ReferenceNo', 'Date', 'ReceivedQuantity', 'IssuedQuantity', 'BalanceQuantity', 'InAmount', 'CurrentAmount', 'OutAmount'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('stockCard-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('stockCard-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('stockCard-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'stockCard-grid',
        clickstoEdit: 1,
        pageSize: 50,
        itemId: 0,
        storeId: 0,
        columnLines: true,
        stripeRows: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel(),
        viewConfig: {
            //forceFit: true,
            //autoFill: true
        },
        listeners: {
            rowdblclick: function () {
                var grid = Ext.getCmp('stockCard-grid');
                if (!grid.getSelectionModel().hasSelection()) return;
                var id = grid.getSelectionModel().getSelected().get('VoucherId');
                var voucherTypeId = grid.getSelectionModel().getSelected().get('VoucherTypeId');
                var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
                window.open('Reports/ErpReportViewer.aspx?rt=aa&id=' + id + '&voucherTypeId=' + voucherTypeId, 'PreviewIV', parameter);

            },
            scope: this
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(),
        {
            dataIndex: 'VoucherType',
            header: 'Voucher Type',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Date',
            header: 'Date',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ReferenceNo',
            header: 'Ref. No',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'UnitPrice',
            header: 'Unit Price',
            sortable: true,
            width: 80,
            menuDisabled: true,
            renderer: function (value) {
                return Ext.util.Format.number(value, '0,000.00 ');
            }
        }, {
            dataIndex: 'AverageCost',
            header: 'Average Cost',
            sortable: true,
            width: 80,
            menuDisabled: true,
            renderer: function (value) {
                return Ext.util.Format.number(value, '0,000.00 ');
            }
        }, {
            dataIndex: 'ReceivedQuantity',
            header: 'Received Qty',
            sortable: true,
            width: 80,
            menuDisabled: true,
            renderer: function (value) {
                return Ext.util.Format.number(value, '0,000.00 ');
            }
        }, {
            dataIndex: 'IssuedQuantity',
            header: 'Issued Qty ',
            sortable: true,
            width: 80,
            menuDisabled: true,
            renderer: function (value) {
                return Ext.util.Format.number(value, '0,000.00 ');
            }
        }, {
            dataIndex: 'BalanceQuantity',
            header: 'Balance (Qty)',
            sortable: true,
            width: 80,
            menuDisabled: true,
            renderer: function (value) {
                return Ext.util.Format.number(value, '0,000.00 ');
            }
        }, {
            dataIndex: 'InAmount',
            header: 'Received Amount',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: function (value) {
                return Ext.util.Format.number(value, '0,000.00 ');
            }
        }, {
            dataIndex: 'OutAmount',
            header: 'Issued Amount',
            sortable: true,
            width: 80,
            menuDisabled: true,
            renderer: function (value) {
                return Ext.util.Format.number(value, '0,000.00 ');
            }
        }, {
            dataIndex: 'CurrentAmount',
            header: 'Balance (Amount)',
            sortable: true,
            width: 80,
            menuDisabled: true,
            renderer: function (value) {
                return Ext.util.Format.number(value, '0,000.00 ');
            }
        }, {
            dataIndex: 'Remark',
            header: 'Remark',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: function (value) {
                return Ext.util.Format.number(value, '0,000.00 ');
            }
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.stockCard.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.tbar = [
           {
               xtype: 'textfield',
               emptyText: 'Type Search text here and press "Enter"',
               submitEmptyText: false,
               id:'searchBincard-text',
               enableKeyEvents: true,
               style: {
                   borderRadius: '25px',
                   padding: '0 10px',
                   width: '200px'
               },
               listeners: {
                   specialKey: function (field, e) {
                       if (e.getKey() == e.ENTER) {
                           Ext.getCmp('stockCard-grid').loadBincard();
                       }
                   },
                   Keyup: function (field, e) {
                       if (field.getValue() == '') {
                           Ext.getCmp('stockCard-grid').loadBincard();
                              }
                   }
               }
           }, {
               xtype: 'tbseparator'
           }, {
               xtype: 'button',
               text: '',
               iconCls: 'icon-excel',
               handler: this.onExportExcel
           }, {
            xtype: 'tbseparator'
        }, {
            id: 'searchTransferIssue',
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearchVoucher
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'stockCard-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.stockCard.Grid.superclass.initComponent.apply(this, arguments);
    },
    onRecalculate: function () {
        var grid = Ext.getCmp('stockCard-ItemGrid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var itemId = grid.getSelectionModel().getSelected().get('ItemId');
        var storeId = grid.getSelectionModel().getSelected().get('StoreId');

        Ext.MessageBox.show({
            title: 'Confirmation',
            msg: 'Are you sure you want to recalculate the stockCard for the selected item?',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.WARNING,
            scope: this,
            animEl: 'accept',
            fn: function (btn) {
                if (btn == 'ok') {
                    Ext.MessageBox.show({
                        msg: 'Recalculating',
                        progressText: 'please wait...',
                        width: 300,
                        wait: true
                    });

                    Ext.Ajax.timeout = 6000000;
                    BinCardStockCard.Recalculate(itemId, storeId, function (result) {
                        if (result.success) {
                            var stockCardgrid = Ext.getCmp('stockCard-grid');
                            var res = {};
                            res['mode'] = 'get';
                            res['itemId'] = itemId;
                            res['storeId'] = storeId;
                            stockCardgrid.store.baseParams = { record: Ext.encode(res) };
                            stockCardgrid.store.load({ params: { start: 0, limit: stockCardgrid.pageSize } });
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
                                title: 'Failure',
                                msg: result.data,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            });
                        }
                    });
                }
            }
        });
    },
    onRecalculateCost: function () {
        var grid = Ext.getCmp('stockCard-ItemGrid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var itemId = grid.getSelectionModel().getSelected().get('ItemId');
        var storeId = grid.getSelectionModel().getSelected().get('StoreId');

        Ext.MessageBox.show({
            title: 'Confirmation',
            msg: 'Are you sure you want to recalculate the cost for the selected item?',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.WARNING,
            scope: this,
            animEl: 'accept',
            fn: function (btn) {
                if (btn == 'ok') {
                    Ext.MessageBox.show({
                        msg: 'Recalculating cost',
                        progressText: 'please wait...',
                        width: 300,
                        wait: true
                    });

                    Ext.Ajax.timeout = 6000000;
                    BinCardStockCard.RecalculateCost(itemId, storeId, function (result) {
                        if (result.success) {
                            var stockCardgrid = Ext.getCmp('stockCard-grid');
                            var res = {};
                            res['mode'] = 'get';
                            res['itemId'] = itemId;
                            res['storeId'] = storeId;
                            stockCardgrid.store.baseParams = { record: Ext.encode(res) };
                            stockCardgrid.store.load({ params: { start: 0, limit: stockCardgrid.pageSize } });
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
                                title: 'Failure',
                                msg: result.data,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            });
                        }
                    });
                }
            }
        });
    },
    loadBincard: function () {
        var stockCardGrid = Ext.getCmp('stockCard-grid');
        var stockCardStore = stockCardGrid.getStore();
        var grid = Ext.getCmp('stockCard-ItemGrid');
        var searchText = Ext.getCmp('searchBincard-text').getValue();
        var storeId = grid.storeId;
        var itemId = grid.getSelectionModel().getSelected().get('Id');
        stockCardGrid.storeId = storeId;
        stockCardGrid.itemId = itemId;
        var result = {};
        result['mode'] = 'get';
        result['itemId'] = itemId;
        result['storeId'] = storeId;
        result['searchText'] = searchText;
        stockCardStore.baseParams = { record: Ext.encode(result) };
        stockCardStore.load({
            params: { start: 0, limit: 30 }
        });
    },
    onSearchVoucher: function () {
        Ext.erp.ux.stockCard.Observable.on('searchvoucher', function (result) {
            result['mode'] = 'search';
            var grid = Ext.getCmp('stockCard-grid');
            var searchText = Ext.getCmp('searchBincard-text').getValue();
            result['searchText'] = searchText;
            result['itemId'] = grid.itemId;
            result['storeId'] = grid.storeId;
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.stockCard.SearchWindow({ title: 'Search Bincard' }).show();
    },
    onSave: function () {
        var grid = Ext.getCmp('stockCard-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        
        new Ext.erp.ux.stockCard.Window({
            stockCardId: id
        }).show();
    },
    onExportExcel: function () {
        var result = {};
        var grid = Ext.getCmp('stockCard-grid');
         result['itemId'] = grid.itemId;
        result['storeId'] = grid.storeId;
      
        window.open('BinCardStockCard/ExportToExcel?' + Ext.urlEncode(result), '', '');
    },
    customRenderer: function (value, metaData, record, rowIndex, colIndex, store) {
        return '<span style="color:green;">' + value + '</span>';
    }
});
Ext.reg('stockCard-grid', Ext.erp.ux.stockCard.Grid);

/**
* @desc      stockCard ItemGrid
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.stockCard
* @class     Ext.erp.ux.stockCard.ItemGrid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.stockCard.ItemGrid = function (config) {
    Ext.erp.ux.stockCard.ItemGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: BinCardStockCard.GetItemsFromStore,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'ItemId', 'StoreId', 'Name', 'Code', 'MeasurementUnit', 'CurrentAmount'],
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
        id: 'stockCard-ItemGrid',
        pageSize: 30,
        width: 400,
        stripeRows: true,
        storeId: 0,
        border: true,
        columnLines: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: false,
            autoExpandColumn: 'Name',
            autoFill: true
        },
        listeners: {
            rowClick: function () {
                this.loadBincard();
            },
            scope: this
        },
        columns: [{
            dataIndex: 'ItemId',
            header: 'ItemId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'StoreId',
            header: 'StoreId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'Name',
            header: 'Description',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'Code',
            header: 'Code',
            sortable: true,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'MeasurementUnit',
            header: 'Unit',
            sortable: true,
            width: 80,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.stockCard.ItemGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.tbar = [ {
            xtype: 'button',
            text: 'Re-Calculate Cost',
            iconCls: 'icon-accept',
            handler: this.onRecalculateForMain
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
                        var grid = Ext.getCmp('stockCard-ItemGrid');
                        var storeId = grid.storeId;
                      
                        grid.store.baseParams['record'] = Ext.encode({ storeId: storeId, searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize} });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('stockCard-ItemGrid');
                        var storeId = grid.storeId;

                         grid.store.baseParams['record'] = Ext.encode({ storeId: storeId, searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize} });
                    }
                }
            }
        },]
        this.bbar = new Ext.PagingToolbar({
            id: 'stockCard-itemgridpaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.stockCard.ItemGrid.superclass.initComponent.apply(this, arguments);
    },
    onRecalculateForMain: function () {
        var storeGrid = Ext.getCmp('stockCard-ItemGrid');
        var storeId = storeGrid.storeId;
        if (typeof storeId == "undefined") return;

        new Ext.erp.ux.inventoryEvaluation.Window({
            action: 'Recalculate'
        }).show();
    },
    loadBincard: function () {
        var stockCardGrid = Ext.getCmp('stockCard-grid');
        var stockCardStore = stockCardGrid.getStore();
        var grid = Ext.getCmp('stockCard-ItemGrid');
        var storeId = grid.storeId;
        var itemId = grid.getSelectionModel().getSelected().get('Id');
        stockCardGrid.storeId = storeId;
        stockCardGrid.itemId = itemId;
        var result = {};
        result['mode'] = 'get';
        result['itemId'] = itemId;
        result['storeId'] = storeId;
        stockCardStore.baseParams = { record: Ext.encode(result) };
        stockCardStore.load({
            params: { start: 0, limit: stockCardGrid.pageSize }
        });
    },
    onSearchVoucher: function () {
        Ext.erp.ux.stockCard.Observable.on('searchstockCard', function (result) {
            result['mode'] = 'search';
            var grid = Ext.getCmp('stockCard-ItemGrid');
            result['storeId'] = grid.storeId;
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.stockCard.SearchItemWindow({ title: 'Search Bincard' }).show();
    }
});
Ext.reg('stockCard-ItemGrid', Ext.erp.ux.stockCard.ItemGrid);

/**
* @desc      stockCard Record tree
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.stockCard
* @class     Ext.erp.ux.stockCard.Tree
* @extends   Ext.tree.TreePanel
*/
Ext.erp.ux.stockCard.Tree = function (config) {
    Ext.erp.ux.stockCard.Tree.superclass.constructor.call(this, Ext.apply({
        id: 'stockCard-tree',
        loader: new Ext.tree.TreeLoader({
            directFn: Store.PopulateTree
        }),
        selectedStoreId: 0,
        selectedStoreTypeId: 0,
        border: false,
        rootVisible: true,
        lines: true,
        useArrows: true,
        animate: true,
        autoScroll: true,
        enableDD: true,
        containerScroll: true,
        stateful: false,
        root: {
            text: 'Stores',
            id: 'root-unit'
        },
        listeners: {
            click: function (node, e) {
                e.stopEvent();
                node.select();
                if (node.isExpandable()) {
                    node.reload();
                }
                node.getOwnerTree().selectedStoreTypeId = node.attributes.id == 'root-unit' ? 'root-unit' : node.attributes.unitTypeId;
                node.getOwnerTree().selectedStoreId = node.attributes.id;
                var storeGrid = Ext.getCmp('stockCard-ItemGrid');
                var stockCardStore = storeGrid.getStore();
                storeGrid.storeId = node.id;
                var result = {};
                result['mode'] = 'get';
                result['storeId'] = node.id;
                stockCardStore.baseParams = { record: Ext.encode(result) };
                stockCardStore.load({
                    params: { start: 0, limit: 30 }
                });
           },
            contextmenu: function (node, e) {
                node.select();
                node.getOwnerTree().selectedStoreTypeId = node.attributes.id == 'root-unit' ? 'root-unit' : node.attributes.unitTypeId;
                node.getOwnerTree().selectedStoreId = node.attributes.id;
                var storeGrid = Ext.getCmp('stockCard-ItemGrid');
                storeGrid.storeId = node.id;
                var stockCardStore = storeGrid.getStore();
                var result = {};
                result['mode'] = 'get';
                result['storeId'] = node.id;
                stockCardStore.baseParams = { record: Ext.encode(result) };
                stockCardStore.load({
                    params: { start: 0, limit: 30 }
                });
            },
            expand: function (p) {
                p.syncSize();
            }
        }
    }, config));
};
Ext.extend(Ext.erp.ux.stockCard.Tree, Ext.tree.TreePanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            id: 'expand-all',
            iconCls: 'icon-expand-all',
            tooltip: 'Expand All',
            handler: function () {
                Ext.getCmp('stockCard-tree').expandAll();
            }
        }, {
            xtype: 'button',
            id: 'collapse-all',
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function () {
                Ext.getCmp('stockCard-tree').collapseAll();
            }
        }];
        Ext.erp.ux.stockCard.Tree.superclass.initComponent.call(this, arguments);
    }
});
Ext.reg('stockCard-tree', Ext.erp.ux.stockCard.Tree);

/**
* @desc      stockCard Record panel
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      January 27, 2011
* @version   $Id: stockCard.js, 0.1
* @namespace Ext.erp.ux.stockCard
* @class     Ext.erp.ux.stockCard.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.stockCard.Panel = function (config) {
    Ext.erp.ux.stockCard.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.stockCard.Panel, Ext.Panel, {
    initComponent: function () {
        this.tree = new Ext.erp.ux.stockCard.Tree();
        this.grid = new Ext.erp.ux.stockCard.Grid();
        this.itemGrid = new Ext.erp.ux.stockCard.ItemGrid();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                width: 200,
                minSize: 200,
                collapsible: true,
                maxSize: 400,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.tree]
            }, {
                region: 'center',
                border: false,
                layout: 'border',
                items: [{
                    region: 'west',
                    width: 350,
                    minSize: 200,
                    split: true,
                    maxSize: 600,
                    collapsible: true,
                    layout: 'fit',
                    margins: '0 3 0 0',
                    items: [this.itemGrid]
                }, {
                    region: 'center',
                    layout: 'fit',
                    items: [this.grid]
                }]
            }]
        }];
        Ext.erp.ux.stockCard.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('stockCard-panel', Ext.erp.ux.stockCard.Panel);



