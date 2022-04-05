Ext.ns('Ext.erp.ux.aTCCollection');




/**
* @desc      PurchaseOrder detailGrid

* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.aTCCollection
* @class     Ext.erp.ux.aTCCollection.GridDetail
* @extends   Ext.grid.GridPanel
*/
var aTCCollectionSelectionModel = new Ext.grid.CheckboxSelectionModel({
});
Ext.erp.ux.aTCCollection.GridDetail = function (config) {
    Ext.erp.ux.aTCCollection.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PurchaseOrder.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'PurchaseOrderHeaderId', 'ItemId', 'UnitId', 'MeasurementUnit', 'InvoiceNo', 'ATCFrom', 'ATCTo', 'NoofATC', 'TruckSize', 'UnitCost', 'Tax', 'Weight', 'TaxRate', 'TaxRateIds', 'TaxRateDescription', 'Name', 'Code', 'Quantity', 'UnprocessedQuantity', 'BudgetedQuantity', 'RemainingQuantity', 'Remark'],

            remoteSort: true
        }),
        id: 'aTCCollection-detailGrid',
        clicksToEdit: 1,
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: true,
        height: 250,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true
        },
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
            afteredit: function (e) {
                var record = e.record;
                if (e.field == 'Quantity' || e.field == 'UnitCost') {
                    Ext.getCmp('aTCCollection-form').calculateTotal();
                }
            },
            rowClick: function () {
                var detailGrid = Ext.getCmp('aTCCollection-detailGrid');
                var id = detailGrid.getSelectionModel().getSelected().get('Id');
                var detailATCGrid = Ext.getCmp('aTCCollection-detailATCGrid');
                var store = detailATCGrid.getStore();
                store.baseParams = { record: Ext.encode({ voucherHeaderId: id, action: "storePurchaseOrder" }) };

                detailATCGrid.getStore().reload({
                    params: {
                        start: 0,
                        limit: detailATCGrid.pageSize
                    }
                });
            },
        },
        cm: new Ext.grid.ColumnModel({
            columns: [
                new Ext.grid.RowNumberer(),
                 {
                     dataIndex: 'Name',
                     header: 'Name',
                     sortable: true,
                     width: 140,
                     menuDisabled: true,
                 }, {
                     dataIndex: 'InvoiceNo',
                     header: 'Invoice No',
                     sortable: true,
                     width: 70,
                     menuDisabled: true,
                    
                     editor: {
                         xtype: 'textfield',
                         allowBlank: false
                     }
                 }, {
                     dataIndex: 'ATCFrom',
                     header: 'ATC From',
                     sortable: true,
                     width: 70,
                     menuDisabled: true,                    
                     editor: {
                         xtype: 'numberfield',
                         allowBlank: false
                     }
                 }, {
                     dataIndex: 'ATCTo',
                     header: 'ATC To',
                     sortable: true,
                     width: 70,
                     menuDisabled: true,
                    
                     editor: {
                         xtype: 'numberfield',
                         allowBlank: false
                     }
                 },
                  {
                      dataIndex: 'TruckSize',
                      header: 'Truck Size',
                      sortable: true,
                      width: 70,
                      menuDisabled: true,
                      renderer: function (value) {
                          return Ext.util.Format.number(value, '0,000 ');
                      },
                      editor: {
                          xtype: 'numberfield',
                          allowBlank: false
                      }
                  },
                  {
                      dataIndex: 'NoofATC',
                      header: 'No of ATC',
                      sortable: true,
                      width: 70,
                      menuDisabled: true,
                      renderer: function (value) {
                          return Ext.util.Format.number(value, '0,000 ');
                      },
                      editor: {
                          xtype: 'numberfield',
                          allowBlank: false
                      }
                  },{
                    dataIndex: 'RemainingQuantity',
                    header: 'Remaining Qty',
                    sortable: true,
                    width: 70,
                    hidden: true,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000 ');
                    }
                }, {
                    dataIndex: 'Quantity',
                    header: 'Qty',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000 ');
                    },
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: false
                    }
                },]
        })
    }, config));
}
Ext.extend(Ext.erp.ux.aTCCollection.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };

        this.tbar = [
            {
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: false,
                handler: function () {
                    var detailDrid = Ext.getCmp('aTCCollection-detailGrid');
                    var store = detailDrid.getStore();

                    var defaultData = {
                        Remark:'',
                        Quantity: 0,
                        OrderedQuantity: 0,
                        RemainingQuantity: 0
                    };
                    var records = new store.recordType(defaultData);
                    store.add(records);
                }
            },  {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Save',
                id: 'aTCCollection-save',
                iconCls: 'icon-save',
                disabled: false,
                handler: function () {
                    var detailGrid = Ext.getCmp('aTCCollection-detailGrid');
                    detailGrid.onSave();
                }
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Remove',
                iconCls: 'icon-exit',
                disabled: false,
                handler: function () {
                    var grid = Ext.getCmp('aTCCollection-detailGrid');

                    if (!grid.getSelectionModel().hasSelection())
                        return;

                    var selectedrecord = grid.getSelectionModel().getSelected();
                    grid.getStore().remove(selectedrecord);
                }
            }, '->',
            

        ]
        this.bbar = []

        Ext.erp.ux.aTCCollection.GridDetail.superclass.initComponent.apply(this, arguments);
    },
    onSave: function () {
        var mainGrid = Ext.getCmp('aTCCollection-grid');
        var id = mainGrid.getSelectionModel().getSelected().get('Id');
        var grid = Ext.getCmp('aTCCollection-detailGrid');
        var store = grid.getStore();
        var rec = ''; var errorMesssage = "";
        var store = grid.getStore();
        if (store.getCount() < 1) {
            Ext.MessageBox.show({
                title: 'Save failed',
                msg: "Please select detail items",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        store.each(function (item) {

            if (typeof item.get('Quantity') == 'undefined' || item.get('Quantity') < 0) {
                if (errorMesssage == "")
                    errorMesssage = "Quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "           Quantity";
            }
            if (typeof item.get('ATCFrom') == 'undefined' || item.get('ATCFrom') == "") {
                if (errorMesssage == "")
                    errorMesssage = "ATCFrom";
                else
                    errorMesssage = errorMesssage + "</br>" + "          ATCFrom";
            } if (typeof item.get('TruckSize') == 'undefined' || item.get('TruckSize') == "") {
                if (errorMesssage == "")
                    errorMesssage = "TruckSize";
                else
                    errorMesssage = errorMesssage + "</br>" + "          TruckSize";
            } if (typeof item.get('NoofATC') == 'undefined' || item.get('NoofATC') < 0) {
                if (errorMesssage == "")
                    errorMesssage = "NoofATC";
                else
                    errorMesssage = errorMesssage + "</br>" + "          NoofATC";
            }
            if (errorMesssage != '') {
                Ext.MessageBox.show({
                    title: 'Save failed',
                    msg: "Please Enter Valid values for Item  " + item.data['Name'] + " for feilds " + "</br>" + errorMesssage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
            rec = rec + item.data['Id'] + ':' +

                              item.data['PurchaseOrderHeaderId'] + ':' +
                              item.data['ItemId'] + ':' +
                              item.data['UnitId'] + ':' +
                              item.data['Quantity'] + ':' +
                              item.data['RemainingQuantity'] + ':' +
                              item.data['Name'] + ':' +
                              item.data['UnitCost'] + ':' +
                              item.data['Tax'] + ':' +
                              item.data['Remark'] + ':' +
                              item.data['InvoiceNo'] + ':' +
                              item.data['ATCFrom'] + ':' +
                              item.data['ATCTo'] + ':' +
                              item.data['NoofATC'] + ':' +
                              item.data['TruckSize'] + ';';
        });

        if (errorMesssage != "")
            return;

        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
        PurchaseOrder.SaveDetailFromATCCollection(id, rec, function (result) {
            if (result.success) {
                Ext.getCmp('aTCCollection-paging').doRefresh();
                Ext.MessageBox.show({
                    title: 'Success',
                    msg: "Data has been deleted successfully",
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
    },
    afterRender: function () {

        Ext.erp.ux.aTCCollection.GridDetail.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('aTCCollection-detailGrid', Ext.erp.ux.aTCCollection.GridDetail);





/**
* @desc      PurchaseOrder detailATCGrid
* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.aTCCollection
* @class     Ext.erp.ux.aTCCollection.GridATCDetail
* @extends   Ext.grid.GridPanel
*/

Ext.erp.ux.aTCCollection.GridATCDetail = function (config) {
    Ext.erp.ux.aTCCollection.GridATCDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PurchaseOrder.GetAllATCDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'PurchaseOrderDetailId', 'ATC', 'InvoiceNo', 'CustomerId', 'DeliveredQuantity', 'Quantity', 'Customer', 'Different', 'Different', 'IsDelivered', 'Remark'],

            remoteSort: true
        }),
        id: 'aTCCollection-detailATCGrid',
        clicksToEdit: 1,
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: true,
       // height: 450,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true
        },
        listeners: {
            beforeLoad: function () {
                Ext.getCmp('aTCCollection-detailATCGrid').body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
                Ext.getCmp('aTCCollection-detailATCGrid').body.unmask();
            },
            loadException: function () {
                Ext.getCmp('aTCCollection-detailATCGrid').body.unmask();
            },
            afteredit: function (e) {

            }    
        },
        cm: new Ext.grid.ColumnModel({
            columns: [
                new Ext.grid.RowNumberer(),
                 {
                     dataIndex: 'ATC',
                     header: 'ATC',
                     sortable: true,
                     width: 70,
                     menuDisabled: true,
                     renderer: this.customRenderer,
                     editor: {
                         xtype: 'numberfield',
                         allowBlank: false
                     }
                 },               
                {
                    dataIndex: 'Customer',
                    header: 'Customer',
                    sortable: true,
                    width: 100,
                    menuDisabled: true,
                    renderer: this.customRenderer,
                    editor: new Ext.form.ComboBox({
                        typeAhead: false, width: 100,
                        hideTrigger: true,
                        minChars: 2,
                        listWidth: 300,
                        emptyText: '---Type to Search---',
                        mode: 'remote',
                        pageSize: 12,
                        allowBlank: false,
                        tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> {Code}</div></tpl>',
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'Name', 'Code',]
                            }),
                            api: { read: Psms.GetCustomerBySearch }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        listeners: {

                            select: function (combo, record, index) {

                                var detailDrid = Ext.getCmp('aTCCollection-detailATCGrid');
                                var selectedrecord = detailDrid.getSelectionModel().getSelected();
                                selectedrecord.set('CustomerId', record.get("Id"));
                         
                            }
                        }
                    })
                }, {
                    dataIndex: 'InvoiceNo',
                    header: 'FSN No',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,
                    renderer: this.customRenderer,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                }, {
                    dataIndex: 'Quantity',
                    header: 'Quantity',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,
                    renderer: this.customRenderer,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                }, {
                    dataIndex: 'DeliveredQuantity',
                    header: 'Delivered Quantity',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,
                    renderer: this.customRenderer,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                }, {
                    dataIndex: 'Different',
                    header: 'Different',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,
                    renderer: this.customRenderer,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
                   {
                    dataIndex: 'Remark',
                    header: 'Remark',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,
                    renderer: this.customRenderer,
                    editor: {
                        xtype: 'textarea',
                        allowBlank: false
                    }
                },]
        })
    }, config));
}
Ext.extend(Ext.erp.ux.aTCCollection.GridATCDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [
    {
        xtype: 'button',
        text: 'Add',
        iconCls: 'icon-add',
        disabled: false,
        handler: function () {
            var detailDrid = Ext.getCmp('aTCCollection-detailATCGrid');
            var store = detailDrid.getStore();

            var defaultData = {
                Remark: '',
                Quantity: 0,
                Customer: '',
                InvoiceNo: '',
                Different:0,
                IsDelivered:false,
                OrderedQuantity: 0,
                RemainingQuantity: 0
            };
            var records = new store.recordType(defaultData);
            store.add(records);
        }
    }, {
        xtype: 'tbseparator'
    }, {
        xtype: 'button',
        text: 'Generate',
        iconCls: 'icon-accept',
        disabled: false,
        handler: function () {

            var detailDrid = Ext.getCmp('aTCCollection-detailGrid');
            var selectedRecord = detailDrid.getSelectionModel().getSelected();
            var grid = Ext.getCmp('aTCCollection-detailATCGrid');
            grid.getStore().removeAll();
            var aTCFrom = selectedRecord.get('ATCFrom');
            var aTCTo = selectedRecord.get('ATCTo');
            var atcNo = selectedRecord.get('NoofATC');
            var couter = -1;
            for (var i = 0; i < atcNo; i++) {
                var atc = 0;
                couter = couter + 1;
                if (typeof aTCTo == 'undefined' || aTCTo == "" || aTCTo == null || aTCTo == "null")
                    atc = aTCFrom;
                else
                    atc = aTCFrom + couter;
                var detailATCDrid = Ext.getCmp('aTCCollection-detailATCGrid');
                var store = detailATCDrid.getStore();

                var defaultData = {
                    ATC: atc,
                    IsDelivered: false,
                    DeliveredQuantity:0,
                    InvioceNo: '',
                    Remark: '',
                    Quantity:400,
                    InvoiceNo: '',
                    Customer: '',
                    Different:'',
                };
                var records = new store.recordType(defaultData);
                store.add(records);
            }

        }
    }, {
        xtype: 'tbseparator'
    }, {
        xtype: 'button',
        text: 'Remove',
        iconCls: 'icon-exit',
        disabled: false,
        handler: function () {
            var grid = Ext.getCmp('aTCCollection-detailATCGrid');

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
        disabled: false,
        handler: function () {
            var detailGrid = Ext.getCmp('aTCCollection-detailATCGrid');
            detailGrid.onSave();
        }
    }, {
        xtype: 'tbseparator'
    }, {
        xtype: 'button',
        text: 'Remove All',
        iconCls: 'icon-exit',
        disabled: false,
        handler: function () {
            var grid = Ext.getCmp('aTCCollection-detailATCGrid');
             grid.getStore().removeAll();
        }
    }, '->',
   

        ]


        Ext.erp.ux.aTCCollection.GridATCDetail.superclass.initComponent.apply(this, arguments);
    },
    onSave: function () {
        var mainGrid = Ext.getCmp('aTCCollection-detailGrid');
        var id = mainGrid.getSelectionModel().getSelected().get('Id');
        var grid = Ext.getCmp('aTCCollection-detailATCGrid');
        var store = grid.getStore();
        var rec = ''; var errorMesssage = "";
        var store = grid.getStore();
        
        store.each(function (item) {

          
            if (typeof item.get('ATC') == 'undefined' || item.get('ATC') == "") {
                if (errorMesssage == "")
                    errorMesssage = "ATCFrom";
                else
                    errorMesssage = errorMesssage + "</br>" + "          ATCFrom";
            } 
            if (errorMesssage != '') {
                Ext.MessageBox.show({
                    title: 'Save failed',
                    msg: "Please Enter Valid values for Item  " + item.data['ATC'] + " for feilds " + "</br>" + errorMesssage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
            rec = rec + item.data['Id'] + ':' +
                              item.data['PurchaseOrderDetailId'] + ':' +
                              item.data['ATC'] + ':' +
                              item.data['CustomerId'] + ':' +
                              item.data['InvoiceNo'] + ':' +
                              item.data['Remark'] + ':' +
                              item.data['IsDelivered'] + ':' +
                              item.data['Quantity'] + ':' +
                              item.data['DeliveredQuantity'] + ';';

            
            
        });

        if (errorMesssage != "")
            return;

        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
        PurchaseOrder.SaveATCDetail(id,rec, function (result) {
            if (result.success) {
                Ext.MessageBox.show({
                    title: 'Success',
                    msg: "Data has been deleted successfully",
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
    },
    customRenderer: function (value, metaData, record, rowIndex, colIndex, store) {

        if (record.get("Different") >0)
            return '<span style=color:green>' + value + '</span>';
        else if (record.get("Different") < 0)
            return '<span style=color:red>' + value + '</span>';      
        else if (record.get("IsDelivered") == true && record.get("Different") == 0)
            return '<span style=color:blue>' + value + '</span>';
        else
            return '<span style=color:black>' + value + '</span>';


    },
    afterRender: function () {

        Ext.erp.ux.aTCCollection.GridATCDetail.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('aTCCollection-detailATCGrid', Ext.erp.ux.aTCCollection.GridATCDetail);

/* @desc     aTCCollectionOrder form host window

* @copyright (c) 2020, 
* @date     September 2013
* @namespace Ext.erp.ux.aTCCollectionOrder
* @class     Ext.erp.ux.aTCCollectionOrder.Window
* @extends   Ext.Window
*/

Ext.erp.ux.aTCCollection.Window = function (config) {
    Ext.erp.ux.aTCCollection.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 800,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'aTCCollection-window',
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
   
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.aTCCollectionHeaderId);
                this.form.getForm().findField('RequestOrderHeaderId').setValue(this.requestOrderHeaderId);           
                this.form.getForm().findField('StoreId').setValue(this.storeId);
                this.form.getForm().findField('Store').setValue(this.store);

                if (typeof this.aTCCollectionHeaderId != "undefined" && this.aTCCollectionHeaderId != "") {
                    this.form.load({
                        waitMsg: 'Loading...',
                        params: { id: this.aTCCollectionHeaderId },
                        success: function () {
                            Ext.getCmp('aTCCollection-form').SetConsumer();

                        }
                    });
                    var grid = Ext.getCmp('aTCCollection-detailGrid');
                    var store = grid.getStore();
                    store.baseParams = { record: Ext.encode({ voucherHeaderId: this.aTCCollectionHeaderId, action: "storePurchaseOrder" }) };

                    grid.getStore().reload({
                        params: {
                            start: 0,
                            limit: grid.pageSize
                        }
                    });
                }
                else
                {                   
                    Ext.getCmp('aTCCollection-form').loadDocument();
                   var grid = Ext.getCmp('aTCCollection-detailGrid');
                    var store = grid.getStore();
                    store.baseParams = { record: Ext.encode({ storeId: this.StoreId, voucherHeaderId: this.requestOrderHeaderId, action: "requestOrder" }) };

                    grid.getStore().reload({
                        params: {
                            start: 0,
                            limit: grid.pageSize
                        }
                    });
                
                }

            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.ux.aTCCollection.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.aTCCollection.Form();
        this.grid = new Ext.erp.ux.aTCCollection.GridDetail();
        this.items = [this.form, this.grid];
        this.buttons = [
            {
                xtype: 'tbfill'
            }, {
                text: 'Save',
                iconCls: 'icon-accept',
                scope: this,
                handler: this.onSave
            }, {
                xtype: 'tbseparator'
            }, {
                text: 'Close',
                iconCls: 'icon-exit',
                handler: this.onCancel,
                scope: this
            }];
        Ext.erp.ux.aTCCollection.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var grid = Ext.getCmp('aTCCollection-detailGrid');
        var store = grid.getStore();
        var rec = ''; var errorMesssage = "";
        var selectedItems = grid.getSelectionModel().getSelections();
        var store = grid.getStore();
        if (store.getCount() < 1) {
            Ext.MessageBox.show({
                title: 'Save failed',
                msg: "Please select detail items",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        store.each(function (item) {

            if (typeof item.get('Quantity') == 'undefined' || item.get('Quantity') < 0) {
                if (errorMesssage == "")
                    errorMesssage = "Quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "           Quantity";
            }
            if (typeof item.get('UnitId') == 'undefined' || item.get('UnitId') == "") {
                if (errorMesssage == "")
                    errorMesssage = "Unit";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Unit";
            }if (typeof item.get('StoreId') == 'undefined' || item.get('StoreId') == "") {
                if (errorMesssage == "")
                    errorMesssage = "Store";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Store";
            }if (typeof item.get('UnitCost') == 'undefined' || item.get('UnitCost') < 0) {
                if (errorMesssage == "")
                    errorMesssage = "UnitCost";
                else
                    errorMesssage = errorMesssage + "</br>" + "          UnitCost";
            } if (typeof item.get('Name') == 'undefined' || item.get('Name') == "") {
                if (errorMesssage == "")
                    errorMesssage = "Name";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Name";
            }
            if (errorMesssage != '') {
                Ext.MessageBox.show({
                    title: 'Save failed',
                    msg: "Please Enter Valid values for Item  " + item.data['Name'] + " for feilds " + "</br>" + errorMesssage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
            rec = rec + item.data['Id'] + ':' +

                              item.data['PurchaseOrderHeaderId'] + ':' +
                              item.data['ItemId'] + ':' +
                              item.data['UnitId'] + ':' +
                              item.data['Quantity'] + ':' +
                              item.data['RemainingQuantity'] + ':' +
                              item.data['Name'] + ':' +
                              item.data['Remark'] + ':' +
                              item.data['UnitCost'] + ':' +
                              item.data['StoreId'] + ';';
        });

        if (errorMesssage != "")
            return;

        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
        var window = this;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ aTCCollectionDetails: rec, action: this.action }) },

            success: function (form, action) {

                Ext.getCmp('aTCCollection-form').getForm().reset();
                Ext.getCmp('aTCCollection-detailGrid').getStore().removeAll();
                Ext.getCmp('aTCCollection-paging').doRefresh();

                Ext.MessageBox.show({
                    title: 'Success',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    scope: this
                });
                window.close();
            },
            failure: function (form, action) {
                Ext.MessageBox.hide();

                Ext.MessageBox.show({
                    title: 'Error',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            },
        });
    },
    onCancel: function () {
        this.close();
    }
});
Ext.reg('aTCCollection-window', Ext.erp.ux.aTCCollection.Window);

/**
* @desc      PurchaseOrder grid

* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.aTCCollection
* @class     Ext.erp.ux.aTCCollection.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.aTCCollection.Grid = function (config) {
    Ext.erp.ux.aTCCollection.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PurchaseOrder.GetAllHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DSC'
            },
            fields: ['Id', 'VoucherNumber', 'RequestedDate', 'StatusId', 'Status', 'RequestedBy', 'NetPayWithWithholding', 'SubTotal', 'NetPay', 'Withholding', 'Vat', 'Store', 'Supplier', 'PurchaseType'],
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
        id: 'aTCCollection-grid',
        pageSize: 36,
        height: 300,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true
        },
        listeners: {
            rowClick: function () {
                var grid = Ext.getCmp('aTCCollection-grid');
                var id = grid.getSelectionModel().getSelected().get('Id');
                var status = grid.getSelectionModel().getSelected().get('Status');
                var detailGrid = Ext.getCmp('aTCCollection-detailGrid');
                var store = detailGrid.getStore();
                store.baseParams = { record: Ext.encode({ voucherHeaderId: id, action: "storePurchaseOrder" }) };
                if(status=="Approved")
                {
                    Ext.getCmp('aTCCollection-save').setDisabled(true);
                }
                else
                {
                    Ext.getCmp('aTCCollection-save').setDisabled(false);

                }
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
                   return '<img src="Content/images/app/OkPass.png"/>';
               else if (record.get("Status") == "Certified")
                   return '<img src="Content/images/app/pending.png"/>';
               else
                   return '<img src="Content/images/app/Cancel1.png"/>';
           }
       }, {
            dataIndex: 'VoucherNumber',
            header: 'Voucher Number',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'PurchaseType',
            header: 'PurchaseType Type',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'Supplier',
            header: 'Supplier',
            sortable: true,
            width: 100,
            menuDisabled: true,
           renderer: this.customRenderer,
        },  {
            dataIndex: 'Status',
            header: 'Status',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }]
    }, config));
}
Ext.extend(Ext.erp.ux.aTCCollection.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [{
            id: 'searchATCCollection',
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearchVoucher
        }, {
            xtype: 'tbseparator'
        },{
            xtype: 'button',
            text: 'Preview',
            id: 'preview-actCollection',
            hidden: false,
            iconCls: 'icon-preview',
            handler: this.onPreview
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Approve',
            hidden: false,
            iconCls: 'icon-accept',
            handler: this.onApprove
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'aTCCollection-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.aTCCollection.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {

        var grid = Ext.getCmp('aTCCollection-grid');
        if (!grid.getSelectionModel().hasSelection()) return;

       
        var voucherId = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        window.open('Reports/ErpReportViewer.aspx?rt=PreviewATCCollection&id=' + voucherId, 'PreviewIV', parameter);

    },
    onAdd: function () {
           new Ext.erp.ux.aTCCollection.Window({
            title: 'Add Purchase Request',
            action: 'Add'
        }).show();
    },
  
    onApprove: function () {
        var grid = Ext.getCmp('aTCCollection-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var status = grid.getSelectionModel().getSelected().get('Status');

        if (status != "Posted") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "Only posted transactions are approved, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.erp.ux.purchaseRequest.Window({
            title: 'Approve Purchase Request',
            purchaseRequestHeaderId: id,
            action: 'approve'
        }).show();
    },
    onDelete: function () {
        var grid = Ext.getCmp('aTCCollection-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var status = grid.getSelectionModel().getSelected().get('Status');
        if (status == "Void") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "you can not void already void transaction, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected record',
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
                    PurchaseOrder.Void(id, function (result) {
                        if (result.success) {
                            Ext.getCmp('aTCCollection-paging').doRefresh();
                            Ext.MessageBox.show({
                                title: 'Success',
                                msg: "Data has been deleted successfully",
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
    onSearchVoucher: function () {
        Ext.erp.ux.voucherSearch.Observable.on('searchvoucher', function (result) {
            result['mode'] = 'search';
            var grid = Ext.getCmp('aTCCollection-grid');
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.voucherSearch.Window({ title: 'Search Transactions' }).show();
    },
    customRenderer: function (value, metaData, record, rowIndex, colIndex, store) {

        if (record.get("Status") == "Approved")
            return '<span style=color:blue>' + value + '</span>';
        else if (record.get("Status") == "Void")
            return '<span style=color:red>' + value + '</span>';
        else if (record.get("Status") == "Certified")
            return '<span style=color:black>' + value + '</span>';

        else
            return '<span style=color:black>' + value + '</span>';


    },
    customRendererForAmount: function (value, metaData, record, rowIndex, colIndex, store) {
        return '<span style=color:darkorange>' + Ext.util.Format.number(value, '0,000.00 ') + '</span>';
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.ux.aTCCollection.Grid.superclass.afterRender.apply(this, arguments);
    },

});
Ext.reg('aTCCollection-grid', Ext.erp.ux.aTCCollection.Grid);

/**
* @desc      aTCCollectionDetail panel
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      December 22, 2014
* @version   $Id: aTCCollection.js, 0.1
* @namespace Ext.erp.ux.aTCCollectionDetail
* @class     Ext.erp.ux.aTCCollectionDetail.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.aTCCollection.DetailPanel = function (config) {
    Ext.erp.ux.aTCCollection.DetailPanel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.aTCCollection.DetailPanel, Ext.Panel, {
    initComponent: function () {
        this.detailGrid = new Ext.erp.ux.aTCCollection.GridDetail();
        this.detailATCGrid = new Ext.erp.ux.aTCCollection.GridATCDetail();
        this.items = [{
            layout: 'vbox',
            layoutConfig: {
                type: 'hbox',
                align: 'stretch',
                pack: 'start'
            },
            defaults: {
                flex: 1
            },
            items: [this.detailGrid,this.detailATCGrid]
        }

        ];

        Ext.erp.ux.aTCCollection.DetailPanel.superclass.initComponent.apply(this, arguments);

    }

});
Ext.reg('aTCCollectionDetail-panel', Ext.erp.ux.aTCCollection.DetailPanel);



/**
* @desc      aTCCollection panel

* @copyright (c) 2010, 
* @date      September 2013
* @version   $Id: aTCCollection.js, 0.1
* @namespace Ext.erp.ux.aTCCollection
* @class     Ext.erp.ux.aTCCollection.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.aTCCollection.Panel = function (config) {
    Ext.erp.ux.aTCCollection.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.aTCCollection.Panel, Ext.Panel, {
    initComponent: function () {
        this.headerGrid = new Ext.erp.ux.aTCCollection.Grid();
        this.detailPanel = new Ext.erp.ux.aTCCollection.DetailPanel();


        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                collapsed: false,
                split: true,
                width: 500,
                minSize: 200,
                maxSize: 600,
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
                    items: [this.detailPanel]

                }]
            }]
        }];
        Ext.erp.ux.aTCCollection.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('aTCCollection-panel', Ext.erp.ux.aTCCollection.Panel);



