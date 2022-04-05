Ext.ns('Ext.erp.ux.goodsRequestManagement');
/**
* @desc      Purchase Request registration form
* @author   Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      Sep , 2019
* @namespace Ext.erp.ux.goodsRequestManagement
* @class     Ext.erp.ux.goodsRequestManagement.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.goodsRequestManagement.Form = function (config) {
    Ext.erp.ux.goodsRequestManagement.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: GoodsRequestManagement.Get,
            submit: GoodsRequestManagement.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'goodsRequestManagement-form',
        padding: 5,
        labelWidth: 100,
        bodyStyle: 'background: #dfe8f6; padding: 20px 5px 5px 10px;',
        autoHeight: false,
        border: false,
        baseCls: 'x-plain',


        items: [
          {
              layout: 'column',
              border: false,
              bodyStyle: 'background-color:transparent;',
              defaults: {
                  columnWidth: .5,
                  border: false,
                  bodyStyle: 'background-color:transparent;',
                  layout: 'form'
              },
              items: [{
                  defaults: {
                      anchor: '95%'
                  },
                  items: [{
                      name: 'Id',
                      xtype: 'hidden'
                  }, {
                      name: 'OrderType',
                      xtype: 'hidden'
                  }, {
                      name: 'StoreId',
                      xtype: 'hidden'
                  }, {
                      name: 'ConsumerId',
                      xtype: 'hidden'
                  }, {
                      name: 'VoucherNumber',
                      xtype: 'textfield',
                      fieldLabel: 'Voucher Number',
                      readonly: true,
                      allowBlank: true
                  }, {
                      name: 'ConsumerType',
                      xtype: 'textfield',
                      fieldLabel: 'Consumer Type',
                      readonly: true,
                      allowBlank: true
                  },  {
                      name: 'Consumer',
                      xtype: 'textfield',
                      fieldLabel: 'Consumer',
                      readonly: true,
                      allowBlank: true
                  }, {
                      name: 'Requester',
                      xtype: 'textfield',
                      fieldLabel: 'Requested By',
                      width: 100,
                      allowBlank: false,
                      readOnly: true
                  }, {
                      name: 'RequestedDate',
                      xtype: 'datefield',
                      fieldLabel: 'Request Date',
                      altFormats: 'c',
                      readOnly: true,
                      editable: true,
                      anchor: '95%',
                      allowBlank: false,
                      Value: (new Date()).format('m/d/Y')
                  }, {
                      name: 'RequiredDate',
                      xtype: 'datefield',
                      fieldLabel: 'Required Date',
                      altFormats: 'c',
                      editable: true,
                      readOnly: true,
                      anchor: '95%',
                      allowBlank: false,
                      Value: (new Date()).format('m/d/Y')
                  }, ]
              }, {
                  defaults: {
                      anchor: '95%'
                  },
                  items: [{
                      name: 'Store',
                      xtype: 'textfield',
                      fieldLabel: 'Store',
                      readonly: true,
                      allowBlank: true
                  },  {
                      name: 'Purpose',
                      xtype: 'textfield',
                      fieldLabel: 'Purpose',
                      readonly: true,
                      allowBlank: true
                  }, {
                      name: 'Remark',
                      xtype: 'textarea',
                      fieldLabel: 'Remark',
                      width: 100,
                      allowBlank: true,
                      readOnly: true
                  }]
              }]
          }
        ],

    }, config));
}
Ext.extend(Ext.erp.ux.goodsRequestManagement.Form, Ext.form.FormPanel);
Ext.reg('goodsRequestManagement-form', Ext.erp.ux.goodsRequestManagement.Form);



/**
* @desc      goodsRequestManagement grid
* @author   Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      Sep , 2019
* @namespace Ext.erp.ux.goodsRequestManagement
* @class     Ext.erp.ux.goodsRequestManagement.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.goodsRequestManagement.Grid = function (config) {
    Ext.erp.ux.goodsRequestManagement.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: window.GoodsRequestManagement.GetAllHeaders,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DESC'
            },
            fields: ['Id', 'VoucherNumber', 'IsRedirected', 'Status','Requester', 'RequestDate', 'RequiredDate', 'ConsumerType', 'Consumer'],
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
        id: 'goodsRequestManagementHeader-grid',
        searchCriteria: {},
        pageSize: 30,
        columnLines: true,
        stripeRows: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                scope: this,
                rowSelect: function () {
                }
            }
        }),
        viewConfig: {
           // forceFit: true
        },
        listeners: {
            rowClick: function () {
                var grid = Ext.getCmp('goodsRequestManagementHeader-grid');
                var record = grid.getSelectionModel().getSelected();
                var consumerType = record.get('ConsumerType');
                var Status = record.get('Status');                           
                var IsRedirected = record.get('IsRedirected');
                if (consumerType == "Store" && IsRedirected == false) {

                    Ext.getCmp('sendTransferOrder').setDisabled(false);
                    Ext.getCmp('sendIssueOrder').setDisabled(true);
                }
                else if (consumerType != "Store" && IsRedirected == false) {

                    Ext.getCmp('sendTransferOrder').setDisabled(true);
                    Ext.getCmp('sendIssueOrder').setDisabled(false);
                }
                else if (IsRedirected == true) {

                    Ext.getCmp('sendIssueOrder').setDisabled(true);
                    Ext.getCmp('sendTransferOrder').setDisabled(false);
                }               
                if (Status == "Issued") {
                    Ext.getCmp('sendTransferOrder').setDisabled(true);
                    Ext.getCmp('sendIssueOrder').setDisabled(true);
                    Ext.getCmp('sendPurchaseRequest').setDisabled(true); 
                }
               
                this.loadVoucherHeader();
                this.loadVoucherDetail();
            },
            scope: this
        },
        columns: [new Ext.grid.RowNumberer(),{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'VoucherNumber',
            header: 'SR Ref.No.',
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
            dataIndex: 'Requester',
            header: 'Requested By',
            sortable: true,
            width: 120,
            menuDisabled: true
        }, {
            dataIndex: 'RequestDate',
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
            dataIndex: 'Status',
            header: 'Status',
            sortable: true,
            width: 70,
            menuDisabled: true
        }, ]
    }, config));
};
Ext.extend(Ext.erp.ux.goodsRequestManagement.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [{
            id: 'showAllPR',
            text: 'Show All',
            iconCls: 'icon-filter',
            hidden: true,
            handler: this.onShowAll
        }, {
            xtype: 'button',
            text: 'Preview',
            id: 'previewPR',
            iconCls: 'icon-preview',
            handler: this.onPreview
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Reject',
            iconCls: 'icon-delete',
             handler: this.onVoid
        },{
            xtype: 'tbfill'
        }, {
            id: 'searchGoodsRequestTransactions',
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearchVoucher
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'goodsRequestManagement-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.goodsRequestManagement.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.ux.goodsRequestManagement.Grid.superclass.afterRender.apply(this, arguments);
    },
    onShowAll: function () {

        var grid = Ext.getCmp('goodsRequestManagementHeader-grid');
        var store = grid.store;
        if (store.lastOptions && store.lastOptions.params) {
            store.lastOptions.params['start'] = 0,
            store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        }
        store.load({ params: { start: 0, limit: grid.pageSize} });
    },
    onPreview: function () {

        var grid = Ext.getCmp('goodsRequestManagementHeader-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=818,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
        window.open('Reports/ErpReportViewer.aspx?rt=PreviewSR&id=' + id, '', parameter);
    },
    onSearchVoucher: function () {
        Ext.erp.ux.voucherSearch.Observable.on('searchvoucher', function (result) {
            result['mode'] = 'search';
            var grid = Ext.getCmp('goodsRequestManagementHeader-grid');
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.voucherSearch.Window({ title: 'Search Transactions' }).show();
    },
    loadVoucherHeader: function () {

        if (!this.getSelectionModel().hasSelection()) return;
        var id = this.getSelectionModel().getSelected().get('Id');      
        var form = Ext.getCmp('goodsRequestManagement-form');
        if (typeof id !="undefined" && id!="") {
            form.load({
                params: { id: id },
                success: function () {
                }
            });
        }
    },
    loadVoucherDetail: function () {
        var voucherDetailGrid = Ext.getCmp('goodsRequestVoucherDetail-grid');
        var voucherDetailStore = voucherDetailGrid.getStore();
        var voucherHeaderId = 0;
        if (this.getSelectionModel().hasSelection()) {
            voucherHeaderId = this.getSelectionModel().getSelected().get('Id');
        }
        voucherDetailStore.baseParams = { record: Ext.encode({ voucherHeaderId: voucherHeaderId }) };
        voucherDetailStore.load({
            params: { start: 0, limit: voucherDetailGrid.pageSize }
        });
    },
    onVoid: function () {
        var grid = Ext.getCmp('goodsRequestManagementHeader-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to void the selected record',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            animEl: 'delete',
            fn: function (btn) {
                if (btn == 'ok') {
                    Ext.MessageBox.show({
                        msg: 'Please wait...',
                        width: 250,
                        wait: true,
                        waitConfig: { interval: 1000 }
                    });
                    GoodsRequestManagement.VoidRequisition(id, function (result) {
                        if (result.success) {
                            Ext.getCmp('transferIssueRequestOrder-paging').doRefresh();

                            Ext.MessageBox.show({
                                title: 'Success',
                                msg: "Data has been void successfully",
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO,
                                scope: this
                            });
                        }
                        else {
                            Ext.MessageBox.show({
                                title: 'Failed',
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


});
Ext.reg('goodsRequestManagement-grid', Ext.erp.ux.goodsRequestManagement.Grid);

var smGM = new Ext.grid.RowSelectionModel({

});
/**
* @desc      goodsRequestManagement grid
* @author   Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      Sep , 2019
* @namespace Ext.erp.ux.goodsRequestManagement
* @class     Ext.erp.ux.goodsRequestManagement.DetailGrid
* @extends   Ext.grid.GridPanel
*/
var goodsRequestSelectionModel = new Ext.grid.CheckboxSelectionModel({
});
Ext.erp.ux.goodsRequestManagement.DetailGrid = function (config) {
    Ext.erp.ux.goodsRequestManagement.DetailGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: window.GoodsRequestManagement.GetAllDetails,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            clickToEdit: 1,
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id','StoreRequisitionHeaderId','ItemId','PartNumber', 'Name', 'Code', 'UnitId','MeasurementUnit', 'UnprocessedQuantity', 'ApprovedQuantity'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('goodsRequestVoucherDetail-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    Ext.getCmp('goodsRequestVoucherDetail-grid').body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('goodsRequestVoucherDetail-grid').body.unmask();
                },
                scope: this
            }
        }),
        id: 'goodsRequestVoucherDetail-grid',
        voucherId: 0,
        pageSize: 1000,
        width: 500,
        stripeRows: true,
        columnLines: true,
        border: true,
        clicksToEdit: 1,
        sm: goodsRequestSelectionModel,

        viewConfig: {
           // forceFit: true
        },
        listeners: {
            rowClick: function () {
                this.loadQuantityGrid();
            },
            scope: this
        },
        columns: [
           new Ext.grid.RowNumberer(),goodsRequestSelectionModel, {
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 130,
            menuDisabled: true
        }, {
            dataIndex: 'Code',
            header: 'Code',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'PartNumber',
            header: 'Part Number',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'MeasurementUnit',
            header: 'Unit',
            sortable: true,
            width: 40,
            menuDisabled: true
        },{
            dataIndex: 'ApprovedQuantity',
            header: 'Approved Qty',
            sortable: true,
            width: 70,
            menuDisabled: true
        }, {
            dataIndex: 'UnprocessedQuantity',
            header: 'Qty to Process',
            sortable: true,
            width: 70,
            menuDisabled: true,
            editor: {
                xtype: 'numberfield',
                allowBlank: false
            }
        }]
    }, config));
};
Ext.extend(Ext.erp.ux.goodsRequestManagement.DetailGrid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ voucherTypeId: this.voucherTypeId }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Issue Order',
            id: 'sendIssueOrder',
            disabled: true,
            iconCls: 'icon-accept',
            handler: this.onSendIssueOrder
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Transfer Order',
            id: 'sendTransferOrder',
            disabled: true,
            iconCls: 'icon-accept',
            handler: this.onSendTransferOrder
        },{
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Reorder',
            id: 'sendToReorder',
            disabled: false,
            iconCls: 'icon-accept',
            handler: this.onSendToReorder
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Send To Purchase Request',
            id: 'sendPurchaseRequest',
            iconCls: 'icon-accept',
            handler: this.onSendToPR
        }, ];
        this.bbar = new Ext.PagingToolbar({
            id: 'goodsRequestManagementDetail-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.goodsRequestManagement.DetailGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        Ext.erp.ux.goodsRequestManagement.DetailGrid.superclass.afterRender.apply(this, arguments);
    },
    onNewClick: function () {

    },
    onDeleteClick: function () {

        var grid = Ext.getCmp('goodsRequestVoucherDetail-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var record = grid.getSelectionModel().getSelected();
        if (record !== undefined) {
            grid.store.remove(record);
        }
    },
    loadQuantityGrid: function () {

        var targetGrid = Ext.getCmp('goodsRequestManagement-QuantityGrid');
        var store = targetGrid.getStore();
        var itemId = 0;
        if (!this.getSelectionModel().hasSelection()) return;

        itemId = this.getSelectionModel().getSelected().get('ItemId');
        store.baseParams = { record: Ext.encode({ itemId: itemId }) };
        store.load({
            params: { start: 0, limit: targetGrid.pageSize }
        });
              
    },

    onCheckQuantity: function () {
        var gridDetail = Ext.getCmp('goodsRequestVoucherDetail-grid');
        new Ext.erp.ux.goodsRequestManagement.QuantityWindow({
            gridDetail: gridDetail,
            itemId: 0,
            title: 'Check Quantity'
        }).show();
    },

    onSendIssueOrder: function () {      
        Ext.getCmp('goodsRequestVoucherDetail-grid').SendRequestOrder("Store Issue", "Store Issue");
    },
    onSendTransferOrder: function () {
        Ext.getCmp('goodsRequestVoucherDetail-grid').SendRequestOrder("Transfer Issue", "Transfer Issue");
    },
    onSendToPR: function () {
        Ext.getCmp('goodsRequestVoucherDetail-grid').SendRequestOrder("Purchase Request", "Purchase Request");

    },
    onSendToReorder: function () {
        Ext.getCmp('goodsRequestVoucherDetail-grid').SendRequestOrder("Reorder", "Reorder");

    },
    customRenderer: function (value, metaData, record, rowIndex, colIndex, store) {
        if (record.data.RemainingQuantity > 0) {
            return '<span style="color:red;">' + value + '</span>';
        }
        else if (record.data.RemainingQuantity == 0) {
            return '<span style="color:green;">' + value + '</span>';
        }
        else if (record.data.ApprovedQuantity > 0) {
            return '<span style="color:green;">' + value + '</span>';
        }
        else {
            return '<span style="color:red;">' + value + '</span>';
        }
    },
    SendRequestOrder: function (orderType, windowTitle) {
        if (!Ext.getCmp('goodsRequestManagementHeader-grid').getSelectionModel().hasSelection()) return;
        var form =Ext.getCmp('goodsRequestManagement-form').getForm();
        var storeRequisitionHeaderId = form.findField('Id').getValue();
        var consumer = form.findField('Consumer').getValue();
        var consumerId = form.findField('ConsumerId').getValue();
        var store = form.findField('Store').getValue();
        var storeId = form.findField('StoreId').getValue();

        var gridDetail = Ext.getCmp('goodsRequestVoucherDetail-grid');
        var selectedRecords = gridDetail.getSelectionModel().getSelections();

        new Ext.erp.ux.requestOrder.Window({
            title: windowTitle+" Order",
            orderType: orderType,
            store: store,
            storeId: storeId,
            consumerStore: consumerId,
            consumerStore:consumer,
            storeRequisitionHeaderId: storeRequisitionHeaderId,
            selectedRecords: selectedRecords,

        }).show();



    }
});
Ext.reg('goodsRequestVoucherDetail-grid', Ext.erp.ux.goodsRequestManagement.DetailGrid);


/**
* @desc      Item Selection Window
* @author   Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      Sep , 2019
* @namespace Ext.erp.ux.goodsRequestManagement
* @class     Ext.erp.ux.goodsRequestManagement.QuantityWindow
* @extends   Ext.Window
*/
Ext.erp.ux.goodsRequestManagement.QuantityWindow = function (config) {
    Ext.erp.ux.goodsRequestManagement.QuantityWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 650,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                var goodsGrid = this.gridDetail;
                var selectedRows = goodsGrid.getSelectionModel().getSelections();
                for (var j = 0; j < selectedRows.length; j++) {
                    this.itemId = selectedRows[j].get("Id");
                }
            }
        }
    }, config));
};
Ext.extend(Ext.erp.ux.goodsRequestManagement.QuantityWindow, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.goodsRequestManagement.QuantityGrid({ itemId: this.itemId });
        this.items = [this.grid];
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
            text: 'Cancel',
            iconCls: 'icon-cancel',
            scope: this,
            handler: this.onCancel
        }];
        Ext.erp.ux.goodsRequestManagement.QuantityWindow.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {

        var grid = Ext.getCmp('goodsRequestVoucherDetail-grid');
        var selectionGrid = Ext.getCmp('goodsRequestManagement-selectionGrid');
        if (!selectionGrid.getSelectionModel().hasSelection()) return;
        var selectedItems = selectionGrid.getSelectionModel().getSelections();
        var store = grid.getStore();
        var goodsRequestManagement = store.recordType;

        for (var i = 0; i < selectedItems.length; i++) {
            var p = new goodsRequestManagement({
                Id: selectedItems[i].get('Id'),
                Name: selectedItems[i].get('Name'),
                Code: selectedItems[i].get('Code'),
                MeasurementUnit: selectedItems[i].get('MeasurementUnit'),
                UnitId: selectedItems[i].get('UnitId'),
                RequestedQuantity: 0
            });
            var count = store.getCount();
            store.insert(count, p);
        }
    },
    onCancel: function () {
        Ext.getCmp('goodsRequestManagement-selectionGrid').getSelectionModel().clearSelections();
    }
});
Ext.reg('goodsRequestManagement-QuantityWindow', Ext.erp.ux.goodsRequestManagement.QuantityWindow);
/**
* @desc      Item selection grid
* @author   Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      November 18, 2013
* @namespace Ext.erp.ux.goodsRequestManagement
* @class     Ext.erp.ux.goodsRequestManagement.SelectionGrid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.goodsRequestManagement.QuantityGrid = function (config) {
    Ext.erp.ux.goodsRequestManagement.QuantityGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Psms.GetPagedItemQuantity,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['ItemId', 'AvailableQuantity', 'Store'],
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
        id: 'goodsRequestManagement-QuantityGrid',
        pageSize: 50,
        stripeRows: true,
        border: true,
        sm: selModel,
        columns: [
            new Ext.grid.RowNumberer(),
            {
                dataIndex: 'ItemId',
                header: 'Id',
                sortable: true,
                hidden: true,
                width: 100,
                menuDisabled: true
            }, {
                dataIndex: 'Store',
                header: 'Store',
                sortable: true,
                width: 80,
                menuDisabled: true
            }, {
                dataIndex: 'AvailableQuantity',
                header: 'Available Quantity',
                sortable: true,
                width: 120,
                menuDisabled: true,
                renderer: this.customRenderer
            }]
    }, config));
};
Ext.extend(Ext.erp.ux.goodsRequestManagement.QuantityGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ itemId: this.itemId }) };
        this.tbar = [{
            xtype: 'displayfield',
            value: 'Available Quantities: ',
            width: 100,
            iconCls: 'icon-add',
            style: 'font-weight: bold'
        }, '->', {
            xtype: 'button',
            name: 'Preview'

        }],
        Ext.erp.ux.goodsRequestManagement.QuantityGrid.superclass.initComponent.apply(this, arguments);
    },
    customRenderer: function (value, metaData, record, rowIndex, colIndex, store) {
        if (record.data.AvailableQuantity > 0) {
              return value;
        }
        else {
          

        }
    }
});
Ext.reg('goodsRequestManagement-QuantityGrid', Ext.erp.ux.goodsRequestManagement.QuantityGrid);


/**
* @desc      goodsRequestManagement panel
* @author   Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @version   $Id: goodsRequestManagement.js, 0.1
* @namespace Ext.erp.ux.goodsRequestManagement
* @class     Ext.erp.ux.goodsRequestManagement.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.goodsRequestManagement.Panel = function (config) {
    Ext.erp.ux.goodsRequestManagement.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.goodsRequestManagement.Panel, Ext.Panel, {
    initComponent: function () {
        this.goodsRequestManagementForm = new Ext.erp.ux.goodsRequestManagement.Form();
        this.headerGrid = new Ext.erp.ux.goodsRequestManagement.Grid();
        this.detailGrid = new Ext.erp.ux.goodsRequestManagement.DetailGrid();
        this.quantityGrid = new Ext.erp.ux.goodsRequestManagement.QuantityGrid();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                split: true,
                width: 400,
                minSize: 200,
                maxSize: 700,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.headerGrid]
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
                    items: [this.goodsRequestManagementForm, {
                        layout: 'hbox',
                        layoutConfig: {
                            align: 'stretch',
                            pack: 'start'
                        },
                        defaults: {
                            flex: 1,
                            layout: 'fit'
                        },
                        items: [this.detailGrid, this.quantityGrid]
                    }]
                }]
            }]
        }];
        Ext.erp.ux.goodsRequestManagement.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('goodsRequestManagement-panel', Ext.erp.ux.goodsRequestManagement.Panel);
