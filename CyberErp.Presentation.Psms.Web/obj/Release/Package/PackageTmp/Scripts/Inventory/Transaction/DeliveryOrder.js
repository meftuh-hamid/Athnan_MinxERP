Ext.ns('Ext.erp.ux.deliveryOrder');

/**
* @desc      DeliveryOrder form

* @copyright (c) 2020, 
* @date      September 2013
* @namespace Ext.erp.ux.deliveryOrder
* @class     Ext.erp.ux.deliveryOrder.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.deliveryOrder.Form = function (config) {
    Ext.erp.ux.deliveryOrder.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: DeliveryOrder.Get,
            submit: DeliveryOrder.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'deliveryOrder-form',
        frame: true,
        labelWidth: 130,
        padding: 5,
        autoHeight: false,
        border: false,
        loadDocument: function () {

            DeliveryOrder.GetDocumentNo(function (result) {
                var form = Ext.getCmp('deliveryOrder-form').getForm();
                form.findField('VoucherNumber').setValue(result.data.DocNo);
                form.findField('StatusId').setValue(result.data.StatusId);
                form.findField('PreparedById').setValue(result.data.EmployeeId);
                
                form.findField('PreparedBy').setValue(result.data.Employee);

                form.findField('DeliveryOrderdById').setValue(result.data.EmployeeId);
                form.findField('DeliveryOrderdBy').setValue(result.data.Employee);
                form.findField('DeliveryOrderdDate').setValue(new Date());
                form.findField('FiscalYearId').setValue(result.data.FiscalYearId);               
            });


        },
        baseCls: 'x-plain',
        items: [{
            layout: 'column',
            bodyStyle: 'background-color:transparent;',
            border: false,
            defaults: {
                columnWidth: .5,
                border: false,
                bodyStyle: 'background-color:transparent;',
                layout: 'form'
            },
            items: [{
                defaults: {
                    anchor: '95%',
          
                },
                items: [

                    {
                    name: 'Id',
                    xtype: 'hidden'
                }, {
                    name: 'FiscalYearId',
                    xtype: 'hidden'
                }, {
                    name: 'PreparedBy',
                    xtype: 'hidden'
                }, {
                    name: 'SalesHeaderId',
                    xtype: 'hidden'
                },{
                    name: 'ManualSalesHeaderId',
                    xtype: 'hidden'
                }, {
                    name: 'CreatedAt',
                    xtype: 'hidden'
                }, {
                    name: 'StatusId',
                    xtype: 'hidden'
                }, {
                    name: 'PreparedById',
                    xtype: 'hidden'
                }, {
                    name: 'DeliveryOrderdById',
                    xtype: 'hidden'
                }, {
                    name: 'CertifiedById',
                    xtype: 'hidden'
                }, {
                    name: 'ApprovedById',
                    xtype: 'hidden'
                }, {
                    name: 'StoreId',
                    xtype: 'hidden'
                }, {
                    name: 'VoucherNumber',
                    xtype: 'textfield',
                    fieldLabel: 'Voucher Number',
                    readOnly: true,
                    allowBlank: false
                }, {
                    name: 'AttachmentNumber',
                    xtype: 'textfield',
                    fieldLabel: 'Sales Ref.',
                    readOnly: false,
                    allowBlank: false
                }, {
                    hiddenName: 'Customer',
                    xtype: 'combo',
                    fieldLabel: 'Customer',
                    typeAhead: false,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    emptyText: '---Type to Search---',
                    mode: 'remote',
                    allowBlank: false,
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetCustomerBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10, listeners: {
                        select: function (cmb, rec, idx) {

                        },
                    }
                }, {
                    hiddenName: 'Store',
                    xtype: 'combo',
                    fieldLabel: 'Store',
                    typeAhead: false,
                    width: 100,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    emptyText: '---Type to Search---',
                    mode: 'remote',
                    allowBlank: false,
                    hidden: false,
                           tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' +'<h3><span>{Name}</span></h3> {Code}</div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetStoreBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10,
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('deliveryOrder-form').getForm();
                            form.findField('StoreId').setValue(rec.id);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('deliveryOrder-form').getForm();
                                form.findField('StoreId').reset();

                            }
                        }
                    }
                }, {
                    name: 'DeliveryOrderdDate',
                    xtype: 'datefield',
                    fieldLabel: 'Date',
                    width: 100,
                    allowBlank: false,
                    value: new Date(),
                    maxValue: (new Date()).format('m/d/Y')
                } ]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [
                    {
                        hiddenName: 'DeliveryOrderdBy',
                        xtype: 'combo',
                        fieldLabel: 'Ordered By',
                        typeAhead: false,
                        width: 100,
                        hideTrigger: true,
                        minChars: 2,
                        listWidth: 280,
                        emptyText: '---Type to Search---',
                        mode: 'remote',
                        allowBlank: false,
                               tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' +'<h3><span>{Name}</span></h3> {Code}</div></tpl>',
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'Name']
                            }),
                            autoLoad: true,
                                api: { read: Psms.GetEmployeeBySearch }
            
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        pageSize: 10, listeners: {
                            select: function (cmb, rec, idx) {
                                var form = Ext.getCmp('deliveryOrder-form').getForm();
                                form.findField('DeliveryOrderdById').setValue(rec.id);
                            },
                            change: function (cmb, newvalue, oldvalue) {
                                if (newvalue == "") {
                                    var form = Ext.getCmp('deliveryOrder-form').getForm();
                                    form.findField('DeliveryOrderdById').reset();

                                }
                            }
                        }
                    },
                    {
                    name: 'ReceivedBy',
                    xtype: 'textfield',
                    fieldLabel: 'Received',
                    readOnly: false,
                    allowBlank: false
                    }, {
                        name: 'PlateNo',
                        xtype: 'textfield',
                        fieldLabel: 'Plate No',
                        readOnly: false,
                        allowBlank: true
                    }, {
                        name: 'Driver',
                        xtype: 'textfield',
                        fieldLabel: 'Driver',
                        readOnly: false,
                        allowBlank: true
                    }, {
                        name: 'Remark',
                        xtype: 'textarea',
                        fieldLabel: 'Remark',
                        readOnly: false,
                        allowBlank: true
                    }]
            }]
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.deliveryOrder.Form, Ext.form.FormPanel);
Ext.reg('deliveryOrder-form', Ext.erp.ux.deliveryOrder.Form);

/**
* @desc      DeliveryOrder detailGrid

* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.deliveryOrder
* @class     Ext.erp.ux.deliveryOrder.GridDetail
* @extends   Ext.grid.GridPanel
*/
var deliveryOrderSelectionModel = new Ext.grid.RowSelectionModel({
});
Ext.erp.ux.deliveryOrder.GridDetail = function (config) {
    Ext.erp.ux.deliveryOrder.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: DeliveryOrder.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
           // idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'DeliveryOrderHeaderId', 'SalesDetailId', 'IsSerialItem', 'IsLOTItem', 'ItemId', 'UnitId', 'Name', 'Code', 'MeasurementUnit', 'AvailableQuantity', 'Quantity', 'DeliveryOrderdQuantity', 'RemainingQuantity'],

            remoteSort: true
        }),
        id: 'deliveryOrder-detailGrid',
        clicksToEdit: 1,
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: true,
        height: 250,
        currentRecord: '',
        serialStore: new Ext.data.Store(),
        lOTStore: new Ext.data.Store(),
        sm: Ext.erp.ux.common.SelectionModel,

        viewConfig: {
          forceFit: true
        },
        listeners: {
            beforeLoad: function () {
                Ext.getCmp('deliveryOrder-detailGrid').body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
                Ext.getCmp('deliveryOrder-detailGrid').body.unmask();
            },
            loadException: function () {
                Ext.getCmp('deliveryOrder-detailGrid').body.unmask();
            },
            rowClick: function (grid, index) {
                var detailGrid = Ext.getCmp('deliveryOrder-detailGrid');
                var currentRecord = detailGrid.getStore().getAt(index);
                detailGrid.currentRecord = currentRecord;
            },
            scope: this
        },
        cm: new Ext.grid.ColumnModel({
            columns: [
                new Ext.grid.RowNumberer(), {
                    dataIndex: 'Name',
                    header: 'Name',
                    sortable: true,
                    width: 180,
                    menuDisabled: true
                }, {
                    dataIndex: 'Code',
                    header: 'Code',
                    sortable: true,
                    width: 100,
                    menuDisabled: true
                }, {
                    dataIndex: 'MeasurementUnit',
                    header: 'Unit',
                    sortable: true,
                    width: 100,
                    menuDisabled: true
                }, {
                    dataIndex: 'Quantity',
                    header: 'Sold Qty',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000.00 ');
                    }
                }, {
                    dataIndex: 'RemainingQuantity',
                    header: 'Remaining Qty',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000.00 ');
                    }
                }, {
                    dataIndex: 'AvailableQuantity',
                    header: 'Available Qty',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000.00 ');
                    }
                }, {
                    dataIndex: 'DeliveryOrderdQuantity',
                    header: 'Issued Qty',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000.00 ');
                    },
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: false
                    }
                }]
        })
    }, config));
}
Ext.extend(Ext.erp.ux.deliveryOrder.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.tbar = [
            {
                xtype: 'button',
                text: 'Add Serial/LOT',
                iconCls: 'icon-add',
                handler: this.onSerialLOtClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Remove',
                iconCls: 'icon-exit',
                disabled: false,
                handler: function () {
                    var grid = Ext.getCmp('deliveryOrder-detailGrid');

                    if (!grid.getSelectionModel().hasSelection())
                        return;

                    var selectedrecord = grid.getSelectionModel().getSelected();
                    grid.getStore().remove(selectedrecord);
                }
            }, '->',
            {
                xtype: 'button',
                text: 'Picker',
                iconCls: 'icon-picker',
                disabled: false,
                handler: function () {
                    var detailGrid = Ext.getCmp('deliveryOrder-detailGrid');
                    new Ext.erp.ux.itemPicker.Window({
                        targetGrid: detailGrid
                    }).show();
                }
            }, ];
        this.bbar = []

        Ext.erp.ux.deliveryOrder.GridDetail.superclass.initComponent.apply(this, arguments);
    },
    onSerialLOtClick: function () {

        var detailDrid = Ext.getCmp('deliveryOrder-detailGrid');
        var currentRecord = detailDrid.currentRecord;
        var storeId = Ext.getCmp('deliveryOrder-form').getForm().findField("StoreId").getValue();
        var itemId = currentRecord.get("ItemId");
        var issuedQuantity = currentRecord.get("DeliveryOrderdQuantity");
        if (issuedQuantity < 0) {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "Sold Quantity must be greater than 0",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;

        }
        if (typeof storeId == "undefined" || storeId == "" || storeId == 0)
        {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "please select store first!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        if (currentRecord.get("IsSerialItem")) {
            new Ext.erp.ux.itemSerialSelector.Window({
                title: 'Add Item Serials',
                itemStore: detailDrid.serialStore.query("ItemId", itemId),
                targetGrid: detailDrid,
                storeId: storeId,
                itemId: itemId,
                issuedQuantity: issuedQuantity
            }).show();
        }
        else if (currentRecord.get("IsLOTItem")) {
            new Ext.erp.ux.itemLOTSelector.Window({
                title: 'Add Item LOT',
                itemStore: detailDrid.lOTStore.query("ItemId", itemId),
                targetGrid: detailDrid,
                storeId: storeId,
                itemId: itemId,
                issuedQuantity: issuedQuantity
            }).show();
        }
    },
    afterRender: function () {
        Ext.erp.ux.deliveryOrder.GridDetail.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('deliveryOrder-detailGrid', Ext.erp.ux.deliveryOrder.GridDetail);

/* @desc     deliveryOrderOrder form host window

* @copyright (c) 2020, 
* @date     September 2013
* @namespace Ext.erp.ux.deliveryOrderOrder
* @class     Ext.erp.ux.deliveryOrderOrder.Window
* @extends   Ext.Window
*/

Ext.erp.ux.deliveryOrder.Window = function (config) {
    Ext.erp.ux.deliveryOrder.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 800,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'deliveryOrder-window',
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.finishedGoodsIssueVoucherHeaderId);
                var isManualSales = Ext.getCmp('deliveryOrder-ShowManualSales').getValue();

                if (typeof this.isThirdParty == "undefined" || this.isThirdParty == '')
                {
                    if (isManualSales==true)
                        this.form.getForm().findField('ManualSalesHeaderId').setValue(this.salesHeaderId);
                    else
                        this.form.getForm().findField('SalesHeaderId').setValue(this.salesHeaderId);

                    this.form.getForm().findField('AttachmentNumber').setValue(this.attachmentNo);
                    this.form.getForm().findField('Customer').setValue(this.customer);

                }
                  var grid = Ext.getCmp('deliveryOrder-detailGrid');

                if (typeof this.finishedGoodsIssueVoucherHeaderId != "undefined" && this.finishedGoodsIssueVoucherHeaderId != "")
                {
                    this.form.load({
                        waitMsg: 'Loading...',
                        params: { id: this.finishedGoodsIssueVoucherHeaderId },
                        success:function(form,action){
                           
                            var serilList = action.result.serialList;
                            var lOTList = action.result.lotList;
                            Ext.getCmp('deliveryOrder-window').onLoadLOSerial(serilList, lOTList);

                        }
                    });
                    
                
                    var store = grid.getStore();
                    store.baseParams = { record: Ext.encode({ storeId: this.storeId, voucherHeaderId: this.finishedGoodsIssueVoucherHeaderId, action: "deliveryOrder" }) };

                    grid.getStore().reload({
                        params: {
                            start: 0,
                            limit: grid.pageSize
                        }
                    });
                } else
                {
                    Ext.getCmp('deliveryOrder-form').loadDocument();
                    if (typeof this.isThirdParty == "undefined")
                    {
                        var grid = Ext.getCmp('deliveryOrder-detailGrid');
                        var store = grid.getStore();
                    
                        store.baseParams = { record: Ext.encode({ storeId: this.storeId, voucherHeaderId: this.salesHeaderId, action:isManualSales==true?"manualSales": "sales" }) };

                        grid.getStore().reload({
                            params: {
                                start: 0,
                                limit: grid.pageSize
                            }
                        });
                    }
                    
                }
              
            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.ux.deliveryOrder.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.deliveryOrder.Form();
        this.grid = new Ext.erp.ux.deliveryOrder.GridDetail();
        this.items = [this.form, this.grid];
        this.bbar = [
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
        Ext.erp.ux.deliveryOrder.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var grid = Ext.getCmp('deliveryOrder-detailGrid');
        var form=Ext.getCmp('deliveryOrder-form');
        var store = grid.getStore();
        var rec = '',serialRec='',lotRec=''; var errorMesssage = "";
        var selectedItems = grid.getSelectionModel().getSelections();
        var store = grid.getStore();
        var serialStore = grid.serialStore;
        var lOTStore = grid.lOTStore;
        salesVoucherHeaderId = form.getForm().findField('SalesHeaderId').getValue();

        store.each(function (item) {
            if (typeof item.get('DeliveryOrderdQuantity') == 'undefined' || item.get('DeliveryOrderdQuantity') < 0) {
                if (errorMesssage == "")
                    errorMesssage = "DeliveryOrderd Quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "          DeliveryOrderd Quantity";
            }
            else if (salesVoucherHeaderId>0 && item.get('DeliveryOrderdQuantity') > item.get('RemainingQuantity')) {
                if (errorMesssage == "")
                    errorMesssage = "Issue quantity should not be greater than remaining quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Issue quantity should not be greater than remaining quantity";
            }
            if (item.get('IsSerialItem') && item.get('DeliveryOrderdQuantity') != serialStore.query("ItemId", item.get('ItemId')).length) {
                if (errorMesssage == "")
                    errorMesssage = "Total issue quantity should be equal to number of serials added";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Total issue quantity should be equal to number of serials added";

            }

           

            if (item.get('IsLOTItem')) {
                
                var lotList = lOTStore.query("ItemId", item.get('ItemId'));
                var totlLotQuantity = 0;
                lotList.each(function (item) {
                    totlLotQuantity = totlLotQuantity + item.get('Quantity');

                });
                
                if (item.get('DeliveryOrderdQuantity') != totlLotQuantity)
                if (errorMesssage == "")
                    errorMesssage = "Total issue quantity should be equal to total added LOT quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Total issue quantity should be equal to total added LOT quantity";

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

                              item.data['DeliveryOrderHeaderId'] + ':' +
                              item.data['ItemId'] + ':' +
                              item.data['Quantity'] + ':' +
                              item.data['DeliveryOrderdQuantity'] + ':' +
                              item.data['RemainingQuantity'] + ':' +
                              item.data['UnitId'] + ';';
        });

        serialStore.each(function (item) {
            serialRec = serialRec + item.data['Id'] + ':' +
                             item.data['ItemId'] + ':' +
                             item.data['StoreId'] + ':' +
                             item.data['ItemSerialId']+ ';';

        });
        lOTStore.each(function (item) {
            lotRec = lotRec + item.data['Id'] + ':' +
                             item.data['ItemId'] + ':' +
                             item.data['StoreId'] + ':' +
                             item.data['ItemLOTId'] + ':' +
                             item.data['Quantity'] + ';';

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
            params: { record: Ext.encode({ deliveryOrderDetails: rec, itemSerials: serialRec, itemLOTs: lotRec, action: this.action }) },

            success: function (form, action) {

                Ext.getCmp('deliveryOrder-form').getForm().reset();
                Ext.getCmp('deliveryOrder-detailGrid').getStore().removeAll();
                Ext.getCmp('deliveryOrder-paging').doRefresh();
                Ext.getCmp('deliveryOrderSales-paging').doRefresh();

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
    onLoadLOSerial: function (serilList, lOTList) {

        var grid = Ext.getCmp('deliveryOrder-detailGrid');
        var serilStore = grid.serialStore;
        var lOTStore = grid.lOTStore;

        if (typeof serilList != "undefined" && serilList != null && serilList != "")
        {
            for (var i = 0; i < serilList.length; i++) {
                var item = serilList[i];
                var p = new Ext.data.Record({
                    Id: item.Id,
                    ItemId: item.ItemId,
                    StoreId: item.StoreId,
                    ItemSerialId: item.ItemSerialId,
                    Number: item.Number,
                    IsAvailable: item.IsAvailable,
                    Remark: '',
                });
                var count = serilStore.getCount();
                serilStore.insert(count, p);
            };
        }
        if (typeof lOTList != "undefined" && lOTList != null && lOTList != "")
        {
            for (var i = 0; i < lOTList.length; i++) {
                var item = lOTList[i];
                var p = new Ext.data.Record({
                    Id: item.Id,
                    ItemId: item.ItemId,
                    StoreId: item.StoreId,
                    ItemLOTId: item.ItemLOTId,
                    Number: item.Number,
                    Quantity: item.Quantity,
                    AvailableQuantity: item.AvailableQuantity,
                    Remark: '',
                });
                var count = lOTStore.getCount();
                lOTStore.insert(count, p);
            };
        }
       
    },
    onCancel: function () {
        this.close();
    }
});
Ext.reg('deliveryOrder-window', Ext.erp.ux.deliveryOrder.Window);

/**
* @desc      DeliveryOrder grid

* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.deliveryOrder
* @class     Ext.erp.ux.deliveryOrder.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.deliveryOrder.Grid = function (config) {
    Ext.erp.ux.deliveryOrder.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: DeliveryOrder.GetAllHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DESC'
            },
            fields: ['Id', 'VoucherNumber', 'Customer', 'DeliveryOrderdDate', 'StatusId', 'FSNo', 'SalesOrderNo', 'Status', 'IsLastStep', 'DeliveryOrderdBy', 'Store', 'StoreId'],
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
        id: 'deliveryOrder-grid',
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
                if (record.get("Status") == "Issued")
                    return '<img src="Content/images/app/yes.png"/>';

                else if (record.get("IsLastStep") == true)
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
            dataIndex: 'SalesOrderNo',
            header: 'Sales Order No',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'FSNo',
            header: 'FS No',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Customer',
            header: 'Customer',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'DeliveryOrderdDate',
            header: 'Date',
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
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.deliveryOrder.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({  }) };
        this.tbar = [{
            id: 'searchDeliveryOrder',
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearchVoucher
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            iconCls: 'icon-edit',
            handler: this.onEdit
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Issue',
            iconCls: 'icon-accept',
            disabled: !Ext.erp.ux.Reception.getPermission('Delivery Order', 'CanEdit'),
            handler: this.onIssue
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Void',
            iconCls: 'icon-delete',
            disabled: !Ext.erp.ux.Reception.getPermission('Delivery Order', 'CanDelete'),
            handler: this.onDelete
        }, {
            xtype: 'button',
            text: 'Preview',
            id: 'preview-DeliveryOrder',
            hidden: false,
            iconCls: 'icon-preview',
            handler: this.onPreview
        },{
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            text: 'Add Third Party',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Delivery Order', 'CanAdd'),
            handler: this.onAddThirdParty
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Load Third Party',
            iconCls: 'icon-accept',
            handler: this.onLoadThirdParty
        }, ];
        this.bbar = new Ext.PagingToolbar({
            id: 'deliveryOrder-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.deliveryOrder.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {

        var grid = Ext.getCmp('deliveryOrder-grid');
        if (!grid.getSelectionModel().hasSelection()) return;

        var voucherId = grid.getSelectionModel().getSelected().get('Id');
        var storeRequestType = grid.getSelectionModel().getSelected().get('StoreRequestType');

        
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        window.open('Reports/ErpReportViewer.aspx?rt=PreviewDeliveryOrder&id=' + voucherId + '&storeRequestType=' + storeRequestType, 'PreviewIV', parameter);

    },
    onEdit: function () {
        var grid = Ext.getCmp('deliveryOrder-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var storeId = grid.getSelectionModel().getSelected().get('StoreId');
        var Status = grid.getSelectionModel().getSelected().get('Status');

        if (Status != "Posted") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "only posted status delivery order is editable, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.erp.ux.deliveryOrder.Window({
            title: 'Edit Delivery Order',           
            finishedGoodsIssueVoucherHeaderId: id,
            storeId:storeId,
            action:'edit'
        }).show();
    },
    onIssue: function () {
        var grid = Ext.getCmp('deliveryOrder-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var storeId = grid.getSelectionModel().getSelected().get('StoreId');
        var isLastStep = grid.getSelectionModel().getSelected().get('IsLastStep');
        var Status = grid.getSelectionModel().getSelected().get('Status');

        if (isLastStep == false || Status == "Issued") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "please authorization step is remain or already issued, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }

        new Ext.erp.ux.deliveryOrder.Window({
            title: 'Delivery Order',
            finishedGoodsIssueVoucherHeaderId: id,
            storeId: storeId,
            action: 'issue'
        }).show();
    },
    onDelete: function () {
        var grid = Ext.getCmp('deliveryOrder-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var status = grid.getSelectionModel().getSelected().get('Status');
        if (status == "Void")
        {
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
                    DeliveryOrder.Void(id, function (result) {
                        if (result.success) {
                            Ext.getCmp('deliveryOrder-paging').doRefresh();
                            Ext.getCmp('deliveryOrderSales-paging').doRefresh();

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
        Ext.erp.ux.voucherSearch.Observable.on('searchvoucher1', function (result) {
            result['mode'] = 'search';
            var grid = Ext.getCmp('deliveryOrder-grid');
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.voucherSearch.Window({ title: 'Search Transactions' , action: 'searcVoucher1'}).show();
    },
    onAddThirdParty: function () {

        new Ext.erp.ux.deliveryOrder.Window({
            title: 'Add Third Party Delivery Order',
            action: 'add',
            isThirdParty:true,
        }).show();
    },

    onLoadThirdParty: function () {
         var grid = Ext.getCmp('deliveryOrder-grid');
        var store = grid.getStore();
        store.baseParams = { record: Ext.encode({ isThirdParty:true }) };
        grid.getStore().reload({
            params: {
                start: 0,
                limit: grid.pageSize
            }
        });
    },
    afterRender: function () {
        var grid = Ext.getCmp('deliveryOrder-grid');
        var store = grid.getStore();
        store.baseParams = { record: Ext.encode({ isThirdParty: true }) };
        grid.getStore().reload({
            params: {
                start: 0,
                limit: grid.pageSize
            }
        });
        Ext.erp.ux.receive.Grid.superclass.afterRender.apply(this, arguments);
    },

});
Ext.reg('deliveryOrder-grid', Ext.erp.ux.deliveryOrder.Grid);




/**
* @desc     deliveryOrder grid

* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.deliveryOrder
* @class     Ext.erp.ux.deliveryOrder.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.deliveryOrder.SalesGrid = function (config) {
    Ext.erp.ux.deliveryOrder.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: DeliveryOrder.GetAllSalesHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DESC'
            },
            fields: ['Id', 'StoreId', 'Store', 'FsNo', 'SalesArea','ZReportReference', 'Date', 'VoucherNumber', 'Customer', 'SalesType', 'IsFullyIssued'],
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
        id: 'deliveryOrderSales-grid',
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
            rowclick: function (grid, rowIndex, e) {
                var id = Ext.getCmp('deliveryOrderSales-grid').getSelectionModel().getSelected().get("Id"); var grid = Ext.getCmp('deliveryOrder-detailGrid');
                var grid = Ext.getCmp('deliveryOrder-grid');
                var store = grid.getStore();
                store.baseParams = { record: Ext.encode({ salesId: id}) };
                grid.getStore().reload({
                    params: {
                        start: 0,
                        limit: grid.pageSize
                    }
                });
            },
            scope: this
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true,
            renderer:this.customRenderer,
        }, {
            dataIndex: 'VoucherNumber',
            header: 'Sales Order',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'FsNo',
            header: 'FsNo',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'SalesArea',
            header: 'Sales Area',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'SalesType',
            header: 'Sales Type',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'Date',
            header: 'Date',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'Customer',
            header: 'Customer',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.deliveryOrder.SalesGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [
            {
                id: 'searchSales',
                text: 'Search',
                iconCls: 'icon-filter',
                handler: this.onSearchVoucher
            }, {
                xtype: 'tbseparator'
            }, {
                checked: true,
                xtype: 'checkbox',
                id: 'deliveryOrder-ShowManualSales',
                readOnly: false,
                allowBlank: true,
                checked: false,
                listeners: {

                    check: function (check, value, index) {
                        var grid = Ext.getCmp('deliveryOrderSales-grid');
                        var store = grid.getStore();
                        store.baseParams = { record: Ext.encode({ isManualSales: value }) };
                        grid.getStore().reload({
                            params: {
                                start: 0,
                                limit: grid.pageSize
                            }
                        });
                    }
                }
            }, {
                xtype: 'displayfield',
                value: "Manual Sales",
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: !Ext.erp.ux.Reception.getPermission('Delivery Order', 'CanAdd'),
                handler: this.onAdd
            }];
        this.bbar = new Ext.PagingToolbar({
            id: 'deliveryOrderSales-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.deliveryOrder.SalesGrid.superclass.initComponent.apply(this, arguments);
    },
    onSearchVoucher: function () {
       Ext.erp.ux.voucherSearch.Observable.on('searchvoucher', function (result) {
            result['mode'] = 'search';
            var grid = Ext.getCmp('deliveryOrderSales-grid');
            grid.searchCriteria = result;
            var isManualSales = Ext.getCmp('deliveryOrder-ShowManualSales').getValue();
            grid.store.baseParams = { record: Ext.encode(result), isManualSales: isManualSales };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.voucherSearch.Window({ title: 'Search Transactions' }).show();
    },
    onAdd: function () {
        var grid = Ext.getCmp('deliveryOrderSales-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var isFullyDeliveryOrderd = grid.getSelectionModel().getSelected().get('IsFullyIssued');
        if (isFullyDeliveryOrderd == true) {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "the sales is full issued, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var AttachmentNumber = grid.getSelectionModel().getSelected().get('FsNo');
        var orderedBy = grid.getSelectionModel().getSelected().get('OrderedBy');
        var storeId = grid.getSelectionModel().getSelected().get('StoreId');
        var store = grid.getSelectionModel().getSelected().get('Store');
        var customer = grid.getSelectionModel().getSelected().get('Customer');

       
        new Ext.erp.ux.deliveryOrder.Window({
            title: 'Add Store Delivery Order',
            salesHeaderId: id,
            customer:customer,
            attachmentNo: AttachmentNumber,
            storeId: storeId,
            store: store,
            action: 'add'
        }).show();
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.ux.deliveryOrder.Grid.superclass.afterRender.apply(this, arguments);
    },

    customRenderer: function (value, metaData, record, rowIndex, colIndex, store) {

        if (record.get("IsFullyIssued") == true)
            return '<span style=color:green>' + value + '</span>';
         else
            return '<span style=color:black>' + value + '</span>';


    }
});
Ext.reg('deliveryOrderSales-grid', Ext.erp.ux.deliveryOrder.SalesGrid);

/**
* @desc      deliveryOrder panel

* @copyright (c) 2010, 
* @date      September 2013
* @version   $Id: deliveryOrder.js, 0.1
* @namespace Ext.erp.ux.deliveryOrder
* @class     Ext.erp.ux.deliveryOrder.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.deliveryOrder.Panel = function (config) {
    Ext.erp.ux.deliveryOrder.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.deliveryOrder.Panel, Ext.Panel, {
    initComponent: function () {
        this.headerGrid = new Ext.erp.ux.deliveryOrder.Grid();
        this.salesGrid = new Ext.erp.ux.deliveryOrder.SalesGrid();

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
                maxSize: 600,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.salesGrid]
            }, {
                region: 'center',
                border: false,
                layout: 'fit',
                items: [this.headerGrid]
            }]
        }];

        Ext.erp.ux.deliveryOrder.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('deliveryOrder-panel', Ext.erp.ux.deliveryOrder.Panel);
