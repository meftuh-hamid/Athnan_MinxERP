/// <reference path="Item.js" />
Ext.ns('Ext.erp.ux.purchaseRequestItemPicker');

/**
* @desc      Item selection window
* @author    Meftuh Mohammed
* @copyright (c) 2019, Cybersoft
* @date      oct 16, 2019
* @namespace Ext.erp.ux.purchaseRequestItemPicker
* @class     Ext.erp.ux.purchaseRequestItemPicker.Window
* @extends   Ext.Window
*/
Ext.erp.ux.purchaseRequestItemPicker.Window = function (config) {
    Ext.erp.ux.purchaseRequestItemPicker.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 750,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
}
Ext.extend(Ext.erp.ux.purchaseRequestItemPicker.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.purchaseRequestItemPicker.Grid({
            sourceType: this.sourceType
        });
        this.detailGrid = new Ext.erp.ux.purchaseRequestItemPicker.DetailGrid();
        this.items = [this.grid, this.detailGrid];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Select',
            iconCls: 'icon-accept',
            scope: this,
            handler: this.onSelect
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.erp.ux.purchaseRequestItemPicker.Window.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {

        var targetgrid = this.targetGrid;
        var selectionGrid = this.detailGrid;
        if (!selectionGrid.getSelectionModel().hasSelection()) return;
        var selectedItems = selectionGrid.getSelectionModel().getSelections();
        var gridDatastore = targetgrid.getStore();
        var item = gridDatastore.recordType;
        var voucherNumber = Ext.getCmp('purchaseRequestItemPicker-grid').getSelectionModel().getSelected().get("VoucherNumber");

        for (var i = 0; i < selectedItems.length; i++) {
            var errorMessage = "";
            if (typeof selectedItems[i].get('QuantityToProcess')=="undefined" ||  selectedItems[i].get('QuantityToProcess')==""  || selectedItems[i].get('QuantityToProcess') < 0) {
                errorMessage = "quantity should be filled,must be greater than zero";
            } else if (selectedItems[i].get('QuantityToProcess') > selectedItems[i].get('UnprocessedQuantity')) {
                errorMessage = "Quantity to Process should not be greater than remaining unprocessed quantity ";
            }
            if (errorMessage != "") {
                Ext.MessageBox.show({
                    title: 'error',
                    msg: errorMessage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
            var index = gridDatastore.findExact("PurchaseRequestDetailId", selectedItems[i].get('Id'))
            if (index == -1) {
                var p = new item({
                    PurchaseRequestDetailId: selectedItems[i].get('Id'),
                    VoucherNumber: voucherNumber,            
                    ItemId: selectedItems[i].get('ItemId'),
                    Name: selectedItems[i].get('Name'),
                    Code: selectedItems[i].get('Code'),
                    MeasurementUnit: selectedItems[i].get('MeasurementUnit'),
                    UnitId: selectedItems[i].get('UnitId'),
                    QuantityToProcess: selectedItems[i].get('QuantityToProcess'),
                    UnprocessedQuantity: selectedItems[i].get('UnprocessedQuantity'),
                    Remark: selectedItems[i].get('Remark'),
                    UnitCost: selectedItems[i].get('UnitCost')
                });
                var count = gridDatastore.getCount();
                gridDatastore.insert(count, p);
            }

        }
    },
    onClose: function () {

        this.close();
    }
});
Ext.reg('purchaseRequestItemPicker-Window', Ext.erp.ux.purchaseRequestItemPicker.Window);
/**
* @desc      Item Selection grid
* @author    Meftuh Mohammed
* @copyright (c) 2014, Cybersoft
* @date      oct 16, 2014
* @namespace Ext.erp.ux.purchaseRequestItemPicker
* @class     Ext.erp.ux.purchaseRequestItemPicker.Grid
* @extends   Ext.grid.GridPanel
*/

Ext.erp.ux.purchaseRequestItemPicker.Grid = function (config) {
    Ext.erp.ux.purchaseRequestItemPicker.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PurchaseRequest.GetAllHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'VoucherNumber', 'RequestedDate', 'RequiredDate', 'StoreRequestNo', 'ConsumerType', 'Consumer', 'StatusId', 'Status', 'RequestedBy','Remark', 'Store', 'RequestType'],
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
        id: 'purchaseRequestItemPicker-grid',
        pageSize: 10,
        height: 280,
        stripeRows: true,
        columnLines: true,
        border: false,
        listeners: {
            rowClick: function () {
                var headerId = this.getSelectionModel().getSelected().get("Id");
                var detailGrid = Ext.getCmp('purchaseRequestItemPicker-detailGrid');
                detailGrid.getStore().baseParams = { record: Ext.encode({ voucherHeaderId: headerId ,action:'purchaseRequest'}) };

                detailGrid.getStore().reload({
                    params: {
                        start: 0,
                        limit: detailGrid.pageSize
                    }
                });
            },
            rowdblclick: function (grid, rowIndex, e) {
            },
            scope: this
        },
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        columns: [
             new Ext.grid.RowNumberer(),
            {
                dataIndex: 'Status',
                header: 'Status',
                sortable: true,
                width: 100,
                menuDisabled: true,
                renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                    if (record.get("Status") == "Approved")
                        return '<img src="Content/images/app/yes.png"/>';
                    else if (record.get("Status") == "Certified")
                        return '<img src="Content/images/app/pending.png"/>';
                    else
                        return '<img src="Content/images/app/no.png"/>';
                }
            }, {
                dataIndex: 'VoucherNumber',
                header: 'Voucher Number',
                sortable: true,
                width: 100,
                menuDisabled: true
            }, {
                dataIndex: 'RequestType',
                header: 'Purchase Request Type',
                sortable: true,
                width: 100,
                menuDisabled: true
            }, {
                dataIndex: 'StoreRequestNo',
                header: 'Store Request No',
                sortable: true,
                width: 100,
                menuDisabled: true
            }, {
                dataIndex: 'ConsumerType',
                header: 'Consumer Type',
                sortable: true,
                width: 100,
                menuDisabled: true
            }, {
                dataIndex: 'Consumer',
                header: 'Consumer',
                sortable: true,
                width: 100,
                menuDisabled: true
            }, {
                dataIndex: 'RequestedDate',
                header: 'Request Date',
                sortable: true,
                width: 80,
                menuDisabled: true
            }, {
                dataIndex: 'RequiredDate',
                header: 'Required Date',
                sortable: true,
                width: 80,
                menuDisabled: true
            }, {
                dataIndex: 'Store',
                header: 'Store',
                sortable: true,
                width: 100,
                menuDisabled: true
            }, {
                dataIndex: 'Status',
                header: 'Status',
                sortable: true,
                width: 100,
                menuDisabled: true
            }
        ]
    }, config));
};
Ext.extend(Ext.erp.ux.purchaseRequestItemPicker.Grid, Ext.grid.GridPanel, {
    initComponent: function () {

        this.store.baseParams = { record: Ext.encode({ sourceType: this.sourceType }) };
        this.tbar = [
        {
            name: 'StartDate',
            xtype: 'datefield',
            id:'purchaseRequestItemPicker-startDate',
            fieldLabel: 'Start Date',
            width: 100,
            allowBlank: false,
            value: new Date(),
            listeners: {
                select: function (field, value) {
                    Ext.getCmp('purchaseRequestItemPicker-grid').reload();
                }
            },
        }, {
            name: 'EndDate',
            xtype: 'datefield',
            id: 'purchaseRequestItemPicker-endDate',

            fieldLabel: 'End Date',
            width: 100,
            allowBlank: false,
            value: new Date(),
            listeners: {
                select: function (field, value) {
                        Ext.getCmp('purchaseRequestItemPicker-grid').reload();
                    }
            },
        },
            '->',
        {
            xtype: 'tbfill'
        }, {
            xtype: 'textfield',
            emptyText: 'Type Search text here and press   Enter',
            submitEmptyText: false,
            id:'purchaseRequestItemPicker-searchText',
            enableKeyEvents: true,
            style: {
                borderRadius: '25px',
                padding: '0 10px',
                width: '200px'
            },
            listeners: {
                specialKey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        Ext.getCmp('purchaseRequestItemPicker-grid').reload();
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        Ext.getCmp('purchaseRequestItemPicker-grid').reload();
                    }
                }
            }
        }
        ];
        this.bbar = new Ext.PagingToolbar({
            id: 'purchaseRequestItemPicker-Paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.purchaseRequestItemPicker.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.reload();
        Ext.erp.ux.purchaseRequestItemPicker.Grid.superclass.afterRender.apply(this, arguments);
    },
    reload: function () {
        var startDate = Ext.getCmp('purchaseRequestItemPicker-startDate').getValue();
        var endDate = Ext.getCmp('purchaseRequestItemPicker-endDate').getValue();
        var searchText = Ext.getCmp('purchaseRequestItemPicker-searchText').getValue();
        this.store.baseParams = { record: Ext.encode({ searchText: searchText, sourceType: this.sourceType, startDate: startDate, endDate: endDate, action: 'picker'}) };
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.purchaseRequestItemPicker.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('purchaseRequestItemPicker-grid', Ext.erp.ux.purchaseRequestItemPicker.Grid);




/**
* @desc      Item Selection detailGrid
* @author    Meftuh Mohammed
* @copyright (c) 2014, Cybersoft
* @date      oct 16, 2014
* @namespace Ext.erp.ux.purchaseRequestItemPicker
* @class     Ext.erp.ux.purchaseRequestItemPicker.DetailGrid
* @extends   Ext.detailGrid.DetailGridPanel
*/
var purchaseItemSelectModel = new Ext.grid.CheckboxSelectionModel();

Ext.erp.ux.purchaseRequestItemPicker.DetailGrid = function (config) {
    Ext.erp.ux.purchaseRequestItemPicker.DetailGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PurchaseRequest.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },

            fields: ['Id', 'ItemId', 'UnitId', 'MeasurementUnit', 'Name', 'Code', 'UnitCost', 'Quantity', 'RequestedQuantity', 'UnprocessedQuantity', 'BudgetedQuantity', 'RemainingQuantity', 'Remark'],
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
        id: 'purchaseRequestItemPicker-detailGrid',
        pageSize: 10,
        height: 280,
        stripeRows: true,
        columnLines: true,
        border: false,
        clicksToEdit: 1,
        sm: purchaseItemSelectModel,
        columns: [
        purchaseItemSelectModel, new Ext.grid.RowNumberer(), {
            dataIndex: 'Name',
            header: 'Item Name',
            sortable: true,
            width: 170,
            menuDisabled: true
        }, {
            dataIndex: 'Code',
            header: 'Code',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'MeasurementUnit',
            header: 'Measurement Unit',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Remark',
            header: 'Remark',
            sortable: true,
            width: 170,
            menuDisabled: true
        }, {
            dataIndex: 'UnprocessedQuantity',
            header: 'unprocessed Qty',
            sortable: true,
            width: 60,
            menuDisabled: true
        },{
            dataIndex: 'QuantityToProcess',
            header: 'Qty to Process',
            sortable: true,
            width: 60,
             menuDisabled: true,
            renderer: function (value) {
                return Ext.util.Format.number(value, '0,000.00 ');
            },
            editor: {
                xtype: 'numberfield',
                allowBlank: false
            }
        },
        ]
    }, config));
};
Ext.extend(Ext.erp.ux.purchaseRequestItemPicker.DetailGrid, Ext.grid.EditorGridPanel, {
    initComponent: function () {

        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [
        {
            xtype: 'tbfill'
        }, {
            xtype: 'textfield',
            emptyText: 'Type Search text here and press   Enter',
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
                        var detailGrid = Ext.getCmp('purchaseRequestItemPicker-detailGrid');
                        var headerId = Ext.getCmp('purchaseRequestItemPicker-grid').getSelectionModel().getSelected().get("Id");
                        detailGrid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), headerId: headerId });
                        detailGrid.store.load({ params: { start: 0, limit: detailGrid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {

                        var detailGrid = Ext.getCmp('purchaseRequestItemPicker-detailGrid');
                        var headerId = Ext.getCmp('purchaseRequestItemPicker-grid').getSelectionModel().getSelected().get("Id");
                        detailGrid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), headerId: headerId });
                        detailGrid.store.load({ params: { start: 0, limit: detailGrid.pageSize } });
                    }
                }
            }
        }
        ];
        this.bbar = new Ext.PagingToolbar({
            id: 'purchaseRequestItemPicker-itemSelectionPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.purchaseRequestItemPicker.DetailGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getSelectionModel().clearSelections();

        Ext.erp.ux.purchaseRequestItemPicker.DetailGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('purchaseRequestItemPicker-detailGrid', Ext.erp.ux.purchaseRequestItemPicker.DetailGrid);


