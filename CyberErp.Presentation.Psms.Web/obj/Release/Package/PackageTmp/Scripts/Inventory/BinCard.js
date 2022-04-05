
Ext.ns('Ext.erp.ux.binCard');


/**
* @desc      binCard Record grid
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      January 27, 2011
* @namespace Ext.erp.ux.binCard
* @class     Ext.erp.ux.binCard.Grid
* @extends   Ext.grid.GridPanel
*/

Ext.erp.ux.binCard.Grid = function (config) {
    Ext.erp.ux.binCard.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: BinCard.GetAll,
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
            fields: ['Id', 'ItemId', 'StoreId', 'VoucherTypeId', 'VoucherId', 'ItemCatagory', 'VoucherType', 'Remark',  'Store', 'ReferenceNo', 'Date', 'ReceivedQuantity', 'IssuedQuantity', 'BalanceQuantity', 'CreatedAt'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('binCard-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('binCard-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('binCard-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'binCard-grid',
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
                var grid = Ext.getCmp('binCard-grid');
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
        },  {
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
            dataIndex: 'CreatedAt',
            header: 'Created At',
            sortable: true,
            width: 180,
            menuDisabled: true,
          
        }, {
            dataIndex: 'Remark',
            header: 'Remark',
            sortable: true,
            width: 100,
            menuDisabled: true,

        }, ]
    }, config));
}
Ext.extend(Ext.erp.ux.binCard.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.tbar = [
           {
               xtype: 'textfield',
               emptyText: 'Type Search text here and press "Enter"',
               submitEmptyText: false,
               id: 'searchBincard-text',
               enableKeyEvents: true,
               style: {
                   borderRadius: '25px',
                   padding: '0 10px',
                   width: '200px'
               },
               listeners: {
                   specialKey: function (field, e) {
                       if (e.getKey() == e.ENTER) {
                           Ext.getCmp('binCard-grid').loadBincard();
                       }
                   },
                   Keyup: function (field, e) {
                       if (field.getValue() == '') {
                           Ext.getCmp('binCard-grid').loadBincard();
                       }
                   }
               }
           },{
               name: 'FromDate',
               id:'binCard-FromDate',
               xtype: 'datefield',
               fieldLabel: 'Date From',
               emptyText: '---Date From---',
               width: 140,
            }, {
               name: 'ToDate',
               xtype: 'datefield',
               id: 'binCard-ToDate',
               fieldLabel: 'Date To',
               emptyText: '---Date To---',
               width: 140,
               allowBlank: false
            }, {
                xtype: 'tbseparator'
            }, {
                text: 'Search',
                iconCls: 'icon-filter',
                handler: this.onSearch
            }, {
                xtype: 'tbseparator'
            }, {
                text: 'Clear',
                iconCls: 'icon-accept',
                handler: this.onClear
            }, {
               xtype: 'tbseparator'
           }, {
               xtype: 'button',
               text: '',
               iconCls: 'icon-excel',
               handler: this.onExportExcel
           }];
        this.bbar = new Ext.PagingToolbar({
            id: 'binCard-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.binCard.Grid.superclass.initComponent.apply(this, arguments);
    },
    onSearch: function () {
        Ext.getCmp('binCard-grid').loadBincard();
    },
    onClear: function () {
        Ext.getCmp('searchBincard-text').reset();
        Ext.getCmp('binCard-FromDate').reset();
        Ext.getCmp('binCard-ToDate').reset();
        Ext.getCmp('binCard-grid').loadBincard();

    },
     loadBincard: function () {
        var bincardGrid = Ext.getCmp('binCard-grid');
        var bincardStore = bincardGrid.getStore();
        var grid = Ext.getCmp('binCard-ItemGrid');
        var searchText = Ext.getCmp('searchBincard-text').getValue();
        var storeId = grid.storeId;
        var itemId = grid.getSelectionModel().getSelected().get('Id');
        bincardGrid.storeId = storeId;
        bincardGrid.itemId = itemId;
        var fromDate = Ext.getCmp('binCard-FromDate').getValue();
        var toDate = Ext.getCmp('binCard-ToDate').getValue();
      
         var result = {};
        result['mode'] = 'get';
        result['itemId'] = itemId;
        result['storeId'] = storeId;
        result['searchText'] = searchText;
        result['startDate'] = fromDate;
        result['endDate'] = toDate;

        bincardStore.baseParams = { record: Ext.encode(result) };
        bincardStore.load({
            params: { start: 0, limit: bincardGrid.pageSize }
        });
    },
    onSave: function () {
        var grid = Ext.getCmp('binCard-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');

        new Ext.erp.ux.binCard.Window({
            bincardId: id
        }).show();
    },
   
    onExportExcel: function () {
        var result = {};
        var grid = Ext.getCmp('binCard-grid');
        var searchText = Ext.getCmp('searchBincard-text').getValue();
        var fromDate = Ext.getCmp('binCard-FromDate').getValue();
        var toDate = Ext.getCmp('binCard-ToDate').getValue();
        result['searchText'] = searchText;
        result['startDate'] = fromDate;
        result['endDate'] = toDate;
        result['itemId'] = grid.itemId;
        result['storeId'] = grid.storeId;

        window.open('BinCard/ExportToExcel?' + Ext.urlEncode(result), '', '');
    },
    customRenderer: function (value, metaData, record, rowIndex, colIndex, store) {
        return '<span style="color:green;">' + value + '</span>';
    }
});
Ext.reg('binCard-grid', Ext.erp.ux.binCard.Grid);

/**
* @desc      binCard ItemGrid
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.binCard
* @class     Ext.erp.ux.binCard.ItemGrid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.binCard.ItemGrid = function (config) {
    Ext.erp.ux.binCard.ItemGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: BinCard.GetItemsFromStore,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'ItemId', 'StoreId', 'Name', 'Code','PartNumber', 'MeasurementUnit', 'CurrentAmount'],
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
        id: 'binCard-ItemGrid',
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
            dataIndex: 'PartNumber',
            header: 'Part Number',
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
Ext.extend(Ext.erp.ux.binCard.ItemGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'button',
            text: 'Re-Calculate Quantity',
            iconCls: 'icon-accept',
            handler: this.onRecalculate
        },  {
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
                        var grid = Ext.getCmp('binCard-ItemGrid');
                        var storeId = grid.storeId;

                        grid.store.baseParams['record'] = Ext.encode({ storeId: storeId, searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('binCard-ItemGrid');
                        var storeId = grid.storeId;

                        grid.store.baseParams['record'] = Ext.encode({ storeId: storeId, searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }, ]
        this.bbar = new Ext.PagingToolbar({
            id: 'binCard-itemgridpaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.binCard.ItemGrid.superclass.initComponent.apply(this, arguments);
    },
    onRecalculate: function () {
        var storeGrid = Ext.getCmp('binCard-ItemGrid');
        var storeId = storeGrid.storeId;
        if (typeof storeId == "undefined") return;

        new Ext.erp.ux.binCard.RecalculateWindow({
            action: 'Recalculate'
        }).show();
    }, 
    loadBincard: function () {
        var bincardGrid = Ext.getCmp('binCard-grid');
        var bincardStore = bincardGrid.getStore();
        var grid = Ext.getCmp('binCard-ItemGrid');
        var storeId = grid.storeId;
        var itemId = grid.getSelectionModel().getSelected().get('Id');
        bincardGrid.storeId = storeId;
        bincardGrid.itemId = itemId;
        var result = {};
        result['mode'] = 'get';
        result['itemId'] = itemId;
        result['storeId'] = storeId;
        bincardStore.baseParams = { record: Ext.encode(result) };
        bincardStore.load({
            params: { start: 0, limit: bincardGrid.pageSize }
        });
    },
    onSearchVoucher: function () {
        Ext.erp.ux.binCard.Observable.on('searchbincard', function (result) {
            result['mode'] = 'search';
            var grid = Ext.getCmp('binCard-ItemGrid');
            result['storeId'] = grid.storeId;
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.binCard.SearchItemWindow({ title: 'Search Bincard' }).show();
    }
});
Ext.reg('binCard-ItemGrid', Ext.erp.ux.binCard.ItemGrid);

/**
* @desc      binCard Record tree
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.binCard
* @class     Ext.erp.ux.binCard.Tree
* @extends   Ext.tree.TreePanel
*/
Ext.erp.ux.binCard.Tree = function (config) {
    Ext.erp.ux.binCard.Tree.superclass.constructor.call(this, Ext.apply({
        id: 'binCard-tree',
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
                var storeGrid = Ext.getCmp('binCard-ItemGrid');
                var bincardStore = storeGrid.getStore();
                storeGrid.storeId = node.id;
                var result = {};
                result['mode'] = 'get';
                result['storeId'] = node.id;
                bincardStore.baseParams = { record: Ext.encode(result) };
                bincardStore.load({
                    params: { start: 0, limit: 30 }
                });
            },
            contextmenu: function (node, e) {
                node.select();
                node.getOwnerTree().selectedStoreTypeId = node.attributes.id == 'root-unit' ? 'root-unit' : node.attributes.unitTypeId;
                node.getOwnerTree().selectedStoreId = node.attributes.id;
                var storeGrid = Ext.getCmp('binCard-ItemGrid');
                storeGrid.storeId = node.id;
                var bincardStore = storeGrid.getStore();
                var result = {};
                result['mode'] = 'get';
                result['storeId'] = node.id;
                bincardStore.baseParams = { record: Ext.encode(result) };
                bincardStore.load({
                    params: { start: 0, limit: 30 }
                });
            },
            expand: function (p) {
                p.syncSize();
            }
        }
    }, config));
};
Ext.extend(Ext.erp.ux.binCard.Tree, Ext.tree.TreePanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            id: 'expand-all',
            iconCls: 'icon-expand-all',
            tooltip: 'Expand All',
            handler: function () {
                Ext.getCmp('binCard-tree').expandAll();
            }
        }, {
            xtype: 'button',
            id: 'collapse-all',
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function () {
                Ext.getCmp('binCard-tree').collapseAll();
            }
        }];
        Ext.erp.ux.binCard.Tree.superclass.initComponent.call(this, arguments);
    }
});
Ext.reg('binCard-tree', Ext.erp.ux.binCard.Tree);

/**
* @desc      binCard Record panel
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      January 27, 2011
* @version   $Id: binCard.js, 0.1
* @namespace Ext.erp.ux.binCard
* @class     Ext.erp.ux.binCard.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.binCard.Panel = function (config) {
    Ext.erp.ux.binCard.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.binCard.Panel, Ext.Panel, {
    initComponent: function () {
        this.tree = new Ext.erp.ux.binCard.Tree();
        this.grid = new Ext.erp.ux.binCard.Grid();
        this.itemGrid = new Ext.erp.ux.binCard.ItemGrid();
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
        Ext.erp.ux.binCard.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('bincard-panel', Ext.erp.ux.binCard.Panel);






/**
* @desc      SearchBinCard Recalculate
* @author    Senper Aklilu, Henock Melisse
* @copyright (c) 2011, Cybersoft
* @date      January 14, 2011
* @namespace Ext.erp.ux.recalculate
* @class     Ext.erp.ux.recalculate.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.binCard.RecalculateForm = function (config) {
    Ext.erp.ux.binCard.RecalculateForm.superclass.constructor.call(this, Ext.apply({
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'recalculateBinCard-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            hiddenName: 'FiscalYearId',
            xtype: 'combo',
            fieldLabel: 'Fiscal Year',
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
                api: { read: Psms.GetFiscalYear }
            }),
            valueField: 'Id',
            displayField: 'Name'
        }, {
            hiddenName: 'ItemId',
            xtype: 'combo',
            fieldLabel: 'Item',
            typeAhead: false,
            hideTrigger: true,
            minChars: 2,
            listWidth: 280,
            emptyText: '---Type to Search---',
            mode: 'remote',
            allowBlank: true,
            tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: Psms.GetItemBySearch }
            }),
            valueField: 'Id',
            displayField: 'Name',
            pageSize: 10, listeners: {
                select: function (cmb, rec, idx) {

                },
            }
        }, {
            name: 'FromDate',
            xtype: 'datefield',
            fieldLabel: 'Date From',
            hidden: true,

            emptyText: '---Select Date From---',
            width: 140,
            allowBlank: false,
            maxValue: (new Date()).format('m/d/Y')
        }, {
            name: 'ToDate',
            xtype: 'datefield',
            fieldLabel: 'Date To',
            hidden: true,
            emptyText: '---Select Date To---',
            width: 140,
            allowBlank: false
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.binCard.RecalculateForm, Ext.form.FormPanel);
Ext.reg('recalculateBinCard-form', Ext.erp.ux.binCard.RecalculateForm);

/**
* @desc      SearchBinCard search form host window
* @author    Senper Aklilu
* @copyright (c) 2011, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.searchBinCard
* @class     Ext.erp.ux.searchBinCard.Window
* @extends   Ext.Window
*/
Ext.erp.ux.binCard.RecalculateWindow = function (config) {
    Ext.erp.ux.binCard.RecalculateWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 400,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        id: 'searchBinCard-window',
        listeners: {
            show: function () {
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.binCard.RecalculateWindow, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.binCard.RecalculateForm();
        this.items = [this.form];
        this.bbar = [{
            xtype: 'button',
            text: 'Search',
            id: 'SearchBinCardF',
            iconCls: 'icon-accept',
            handler: this.onRecalculate
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
        Ext.erp.ux.binCard.RecalculateWindow.superclass.initComponent.call(this, arguments);
    },
    onRecalculate: function () {
        var storeGrid = Ext.getCmp('binCard-ItemGrid');
        var storeId = storeGrid.storeId;
        var form = Ext.getCmp('recalculateBinCard-form').getForm();
        var fiscalYearId = form.findField('FiscalYearId').getValue();
         var itemId = form.findField('ItemId').getValue();
        var action = Ext.getCmp('searchBinCard-window').action;
        var parameter = 'width=300,height=400,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
        globalWindow.open(('Calculation/Calculation.aspx?action=' + action + '&storeId=' + storeId + '&fiscalYearId=' + fiscalYearId + '&itemId=' + itemId), '_blank', "height=300,width=400");

    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('recalculateBinCard-window', Ext.erp.ux.binCard.RecalculateWindow);