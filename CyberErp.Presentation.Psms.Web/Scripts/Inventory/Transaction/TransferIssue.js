Ext.ns('Ext.erp.ux.transferIssue');

/**
* @desc      TransferIssue form
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.transferIssue
* @class     Ext.erp.ux.transferIssue.Form
* @extends   Ext.form.FormPanel
*/

Ext.erp.ux.transferIssue.Form = function (config) {
    Ext.erp.ux.transferIssue.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: TransferIssue.Get,
            submit: TransferIssue.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'transferIssue-form',
        frame: true,
        labelWidth: 130,
        padding: 5,
        autoHeight: false,
        border: false,
        loadDocument: function () {

            TransferIssue.GetDocumentNo(function (result) {
                var form = Ext.getCmp('transferIssue-form').getForm();
                form.findField('VoucherNumber').setValue(result.data.DocNo);

                form.findField('StatusId').setValue(result.data.StatusId);
                form.findField('PreparedById').setValue(result.data.EmployeeId);
                form.findField('TransferIssuedById').setValue(result.data.EmployeeId);
                form.findField('TransferIssuedBy').setValue(result.data.Employee);
                form.findField('IssuedDate').setValue(new Date());
                form.findField('FiscalYearId').setValue(result.data.FiscalYearId);
                form.findField('ReceivedById').setValue(result.data.EmployeeId);
                form.findField('ReceivedBy').setValue(result.data.Employee);

                
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
                items: [{
                    name: 'Id',
                    xtype: 'hidden'
                }, {
                    name: 'FiscalYearId',
                    xtype: 'hidden'
                }, {
                    name: 'DeliveredDate',
                    xtype: 'hidden'
                }, {
                    name: 'RequestOrderHeaderId',
                    xtype: 'hidden'
                }, {
                    name: 'CommitmentHeaderId',
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
                    name: 'TransferIssuedById',
                    xtype: 'hidden'
                }, {
                    name: 'DeliveredById',
                    xtype: 'hidden'
                }, {
                    name: 'ReceivedById',
                    xtype: 'hidden'
                }, {
                    name: 'FromStoreId',
                    xtype: 'hidden'
                }, {
                    name: 'ToStoreId',
                    xtype: 'hidden'
                }, {
                    name: 'VoucherNumber',
                    xtype: 'textfield',
                    fieldLabel: 'Voucher Number',
                    readOnly: false,
                    allowBlank: false
                }, {
                    name: 'StoreRequestNumber',
                    xtype: 'textfield',
                    fieldLabel: 'SR Number',
                    readOnly: false,
                    allowBlank: true
                },{
                    hiddenName: 'FromStore',
                    xtype: 'combo',
                    fieldLabel: 'From Store',
                    typeAhead: false,
                    width: 100,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    emptyText: '---Type to Search---',
                    mode: 'remote',
                    allowBlank: false,
                    hidden: false,
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
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
                            var form = Ext.getCmp('transferIssue-form').getForm();
                            form.findField('FromStoreId').setValue(rec.id);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('transferIssue-form').getForm();
                                form.findField('FromStoreId').reset();

                            }
                        }
                    }
                }, {
                    hiddenName: 'ToStore',
                    xtype: 'combo',
                    fieldLabel: 'To Store',
                    typeAhead: false,
                    width: 100,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    emptyText: '---Type to Search---',
                    mode: 'remote',
                    allowBlank: false,
                    hidden: false,
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
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
                            var form = Ext.getCmp('transferIssue-form').getForm();
                            form.findField('ToStoreId').setValue(rec.id);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('issue-form').getForm();
                                form.findField('ToStoreId').reset();

                            }
                        }
                    }
                },  {
                    name: 'IssuedDate',
                    xtype: 'datefield',
                    fieldLabel: 'Issued Date',
                    width: 100,
                    allowBlank: false,
                    value: new Date(),
                    maxValue: (new Date()).format('m/d/Y')
                }, {
                    name: 'OrderedBy',
                    xtype: 'textfield',
                    fieldLabel: 'Ordered By',
                    hidden:true,
                    readOnly: true,
                    allowBlank: true
                }]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [
                    {
                        name: 'PlateNo',
                        xtype: 'textfield',
                        fieldLabel: 'Plate No',
                        hidden: true,
                        readOnly: false,
                        allowBlank: true
                    },
                   {
                       name: 'DriverName',
                       xtype: 'textfield',
                       fieldLabel: 'Driver',
                       readOnly: false,
                       hidden: true,
                       allowBlank: true
                   },  {
                       hiddenName: 'TransferIssuedBy',
                       xtype: 'combo',
                       fieldLabel: 'Transfer By',
                       typeAhead: false,
                       width: 100,
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
                           api: { read: Psms.GetEmployeeBySearch }
                       }),
                       valueField: 'Name',
                       displayField: 'Name',
                       pageSize: 10, listeners: {
                           select: function (cmb, rec, idx) {
                               var form = Ext.getCmp('transferIssue-form').getForm();
                               form.findField('TransferIssuedById').setValue(rec.id);
                           },
                           change: function (cmb, newvalue, oldvalue) {
                               if (newvalue == "") {
                                   var form = Ext.getCmp('transferIssue-form').getForm();
                                   form.findField('TransferIssuedById').reset();

                               }
                           }
                       }
                   }, {
                    hiddenName: 'ReceivedBy',
                    xtype: 'combo',
                    fieldLabel: 'Received By',
                    typeAhead: false,
                    width: 100,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    hidden: true,
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
                        api: { read: Psms.GetEmployeeBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10, listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('transferIssue-form').getForm();
                            form.findField('ReceivedById').setValue(rec.id);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('transferIssue-form').getForm();
                                form.findField('ReceivedById').reset();

                            }
                        }
                    }
                }, {
                    hiddenName: 'DeliveredBy',
                    xtype: 'combo',
                    fieldLabel: 'Delivered By',
                    typeAhead: false,
                    width: 100,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    emptyText: '---Type to Search---',
                    mode: 'remote',
                    hidden:true,
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
                        api: { read: Psms.GetEmployeeBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10, listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('transferIssue-form').getForm();
                            form.findField('DeliveredById').setValue(rec.id);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('transferIssue-form').getForm();
                                form.findField('DeliveredById').reset();

                            }
                        }
                    }
                }, {
                    name: 'Remark',
                    xtype: 'textarea',
                    fieldLabel: 'Remark',
                    width: 100,
                    allowBlank: true,
                    readOnly: false
                }]
            }]
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.transferIssue.Form, Ext.form.FormPanel);
Ext.reg('transferIssue-form', Ext.erp.ux.transferIssue.Form);


/**
* @desc      TransferIssue detailGrid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.transferIssue
* @class     Ext.erp.ux.transferIssue.GridDetail
* @extends   Ext.grid.GridPanel
*/
var transferIssueSelectionModel = new Ext.grid.CheckboxSelectionModel({
});
Ext.erp.ux.transferIssue.GridDetail = function (config) {
    Ext.erp.ux.transferIssue.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: TransferIssue.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            //  idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'TransferIssueHeaderId', 'ItemId', 'PartNumber', 'IsLOTItem', 'IsSerialItem', 'Name', 'Code', 'MeasurementUnit', 'Quantity', 'TransferIssuedQuantity', 'RemainingQuantity', 'AvailableQuantity'],

            remoteSort: true
        }),
        id: 'transferIssue-detailGrid',
        clicksToEdit: 1,
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: true,
        currentRecord: '',
        serialStore: new Ext.data.Store(),
        lOTStore: new Ext.data.Store(),


        height: 250,
        sm: Ext.erp.ux.common.SelectionModel,

        viewConfig: {
            forceFit: true
        },
        listeners: {
            beforeLoad: function () {
                Ext.getCmp('transferIssue-detailGrid').body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
                Ext.getCmp('transferIssue-detailGrid').body.unmask();
            },
            loadException: function () {
                Ext.getCmp('transferIssue-detailGrid').body.unmask();
            },
            rowClick: function (grid, index) {
                var detailGrid = Ext.getCmp('transferIssue-detailGrid');
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
                    menuDisabled: true,
                    xtype: 'combocolumn',
                    editor: new Ext.form.ComboBox({
                        typeAhead: false, width: 100,
                        hideTrigger: true,
                        minChars: 2,
                        listWidth: 300,
                        emptyText: '---Type to Search---',
                        mode: 'remote',
                        pageSize: 12,
                        allowBlank: false,
                        tpl:
                    '<tpl for="."><div ext:qtip="{Name}" class="x-combo-list-item">' +
                        '<p><h6 class="w3-text-teal w3-small "><span> ' + '{Name}' + '</span></h6></p>' +
                        '<p><h6 class="w3-text-teal w3-small "><span>' + '{Code}' + '-' + '{PartNumber}' + '</span></h6></p>' +
                    '</span></div></tpl>', store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'Name', 'Code', 'PartNumber', 'UnitCost', 'AvailableQuantity', 'MeasurementUnit', 'IsSerialItem', 'IsLOTItem']
                            }),
                            api: { read: Psms.GetItemBySearch }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        listeners: {
                            beforeQuery: function (combo, record, index) {
                                var form = Ext.getCmp('transferIssue-form').getForm();
                                var storeId = form.findField('FromStoreId').getValue();
                                var detailDrid = Ext.getCmp('transferIssue-detailGrid');
                                var selectedrecord = detailDrid.currentRecord;
                                this.store.baseParams = { storeId: storeId };
                                this.getStore().reload({
                                    params: {
                                        start: 0,
                                        limit: this.pageSize
                                    }
                                });

                            },

                            select: function (combo, record, index) {

                                var detailDrid = Ext.getCmp('transferIssue-detailGrid');
                                var selectedrecord = detailDrid.getSelectionModel().getSelected();
                                selectedrecord.set('ItemId', record.get("Id"));
                                selectedrecord.set('Code', record.get("Code"));
                                selectedrecord.set('MeasurementUnit', record.get("MeasurementUnit"));
                                selectedrecord.set('IsSerialItem', record.get("IsSerialItem"));
                                selectedrecord.set('AvailableQuantity', record.get("AvailableQuantity"));
                                selectedrecord.set('PartNumber', record.get("PartNumber"));
                                selectedrecord.set('IsLOTItem', record.get("IsLOTItem"));

                            }
                        }
                    })
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
                    hidden: true,
                    menuDisabled: true
                }, {
                    dataIndex: 'MeasurementUnit',
                    header: 'Unit',
                    sortable: true,
                    width: 100,
                    menuDisabled: true
                }, {
                    dataIndex: 'Quantity',
                    header: 'Order Qty',
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
                    dataIndex: 'TransferIssuedQuantity',
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
Ext.extend(Ext.erp.ux.transferIssue.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.tbar = [
             {
                 xtype: 'button',
                 text: 'Add',
                 iconCls: 'icon-add',
                 disabled: false,
                 handler: function () {
                     var detailDrid = Ext.getCmp('transferIssue-detailGrid');
                     var store = detailDrid.getStore();

                     var defaultData = {
                         Tax: 0,
                         Quantity:0,
                         TransferIssuedQuantity: 0,
                         RemainingQuantity: 0,
                         DamagedQuantity: 0,
                     };
                     var records = new store.recordType(defaultData);
                     store.add(records);
                 }
             }, {
                 xtype: 'tbseparator'
             },  {
            xtype: 'button',
            text: 'Remove',
            iconCls: 'icon-exit',
            disabled: false,
            handler: function () {
                var grid = Ext.getCmp('transferIssue-detailGrid');

                if (!grid.getSelectionModel().hasSelection())
                    return;

                var selectedrecord = grid.getSelectionModel().getSelected();
                grid.getStore().remove(selectedrecord);
            }
        },{
            xtype: 'button',
            text: 'Picker',
            iconCls: 'icon-accept',
            disabled: false,
            handler: function () {
                var detailGrid = Ext.getCmp('transferIssue-detailGrid');
                var storeId = Ext.getCmp('transferIssue-form').getForm().findField("FromStoreId").getValue();

                new Ext.erp.ux.itemPicker.Window({
                    targetGrid: detailGrid,
                    storeId: storeId
                }).show();
            }
        },];
        this.bbar = []

        Ext.erp.ux.transferIssue.GridDetail.superclass.initComponent.apply(this, arguments);
    },
    onSerialLOtClick: function () {

        var detailDrid = Ext.getCmp('transferIssue-detailGrid');
        var currentRecord = detailDrid.currentRecord;
        var storeId = Ext.getCmp('transferIssue-form').getForm().findField("FromStoreId").getValue();
        var itemId = currentRecord.get("ItemId");
        var issuedQuantity = currentRecord.get("TransferIssuedQuantity");
        if (issuedQuantity <= 0) {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "Issued Quantity must be greater than 0",
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
        Ext.erp.ux.transferIssue.GridDetail.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('transferIssue-detailGrid', Ext.erp.ux.transferIssue.GridDetail);

/* @desc     transferIssueOrder form host window
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date     September 2013
* @namespace Ext.erp.ux.transferIssueOrder
* @class     Ext.erp.ux.transferIssueOrder.Window
* @extends   Ext.Window
*/

Ext.erp.ux.transferIssue.Window = function (config) {
    Ext.erp.ux.transferIssue.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 700,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'transferIssue-window',
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        approve:"",
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.transferIssueHeaderId);
                this.form.getForm().findField('RequestOrderHeaderId').setValue(this.requestOrderHeaderId);
                this.form.getForm().findField('StoreRequestNumber').setValue(this.storeRequestNumber);
                this.form.getForm().findField('OrderedBy').setValue(this.orderedBy);
                this.form.getForm().findField('FromStoreId').setValue(this.fromStoreId);
                this.form.getForm().findField('FromStore').setValue(this.fromStore);
                this.form.getForm().findField('ToStoreId').setValue(this.toStoreId);
                this.form.getForm().findField('ToStore').setValue(this.toStore);

                if (typeof this.transferIssueHeaderId != "undefined" && this.transferIssueHeaderId != "")
                {
                    this.form.load({
                        waitMsg: 'Loading...',
                        params: { id: this.transferIssueHeaderId },
                        success: function (form, action) {
                            var grid = Ext.getCmp('transferIssue-detailGrid');
                            var serilList = action.result.serialList;
                            var lOTList = action.result.lotList;
                            Ext.getCmp('transferIssue-window').onLoadLOTSerial(serilList, lOTList);

                        }
                    });

                    var grid = Ext.getCmp('transferIssue-detailGrid');
                    var store = grid.getStore();
                    store.baseParams = { record: Ext.encode({storeId:this.fromStoreId, voucherHeaderId: this.transferIssueHeaderId, action: "storeTransferIssue" }) };

                    grid.getStore().reload({
                        params: {
                            start: 0,
                            limit: grid.pageSize
                        }
                    });
                } 
                else    if (typeof this.requestOrderHeaderId != "undefined" && this.requestOrderHeaderId != "")
             
                {
                    Ext.getCmp('transferIssue-form').loadDocument();
                    var grid = Ext.getCmp('transferIssue-detailGrid');
                    var store = grid.getStore();
                    store.baseParams = { record: Ext.encode({ storeId: this.fromStoreId, voucherHeaderId: this.requestOrderHeaderId, action: "requestOrder" }) };

                    grid.getStore().reload({
                        params: {
                            start: 0,
                            limit: grid.pageSize
                        }
                    });
                }
            else
            {
                    Ext.getCmp('transferIssue-form').loadDocument();
            }
              
            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.ux.transferIssue.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.transferIssue.Form();
        this.grid = new Ext.erp.ux.transferIssue.GridDetail();
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
                text: 'Approve',
                iconCls: 'icon-accept',
                scope: this,
                disabled: !Ext.erp.ux.Reception.getPermission('Transfer Issue', 'CanApprove'),
                handler: this.onApprove
            }, {
                xtype: 'tbseparator'
            }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onCancel,
            scope: this
        }];
        Ext.erp.ux.transferIssue.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var grid = Ext.getCmp('transferIssue-detailGrid');
        var store = grid.getStore();
        var rec = '', serialRec = '', lotRec = ''; var errorMesssage = "";
        var selectedItems = grid.getSelectionModel().getSelections();
        var store = grid.getStore();
        var serialStore = grid.serialStore;
        var lOTStore = grid.lOTStore;
        var requestOrderId = this.form.getForm().findField("RequestOrderHeaderId").getValue();
      
        store.each(function (item) {
            if (typeof item.get('TransferIssuedQuantity') == 'undefined' || item.get('TransferIssuedQuantity') < 0) {
                if (errorMesssage == "")
                    errorMesssage = "Issued Quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "          TransferIssued Quantity";
            }
            else if (requestOrderId!="" && item.get('TransferIssuedQuantity') > item.get('RemainingQuantity')) {
                if (errorMesssage == "")
                    errorMesssage = "Issued Quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Issued Quantity should not be greater than remaining quantity";
            }
            if (item.get('IsSerialItem') && item.get('TransferIssuedQuantity') != serialStore.query("ItemId", item.get('ItemId')).length) {
                if (errorMesssage == "")
                    errorMesssage = "Total Issued quantity should be equal to number of serials added";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Total issued quantity should be equal to number of serials added";

            }
            if (item.get('IsLOTItem')) {

                var lotList = lOTStore.query("ItemId", item.get('ItemId'));
                var totlLotQuantity = 0;
                lotList.each(function (item) {
                    totlLotQuantity = totlLotQuantity + item.get('Quantity');

                });

                if (item.get('TransferIssuedQuantity') != totlLotQuantity)
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

                              item.data['TransferIssueHeaderId'] + ':' +
                              item.data['ItemId'] + ':' +
                              item.data['Quantity'] + ':' +
                              item.data['TransferIssuedQuantity'] + ':' +
                              item.data['RemainingQuantity'] + ':' +
                              item.data['StatusId'] + ':' +
                              item.data['Remark'] + ';';
        });
        serialStore.each(function (item) {
            serialRec = serialRec + item.data['Id'] + ':' +
                             item.data['ItemId'] + ':' +
                             item.data['StoreId'] + ':' +
                             item.data['ItemSerialId'] + ';';

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
            params: { record: Ext.encode({ transferIssueDetails: rec, itemSerials: serialRec, itemLOTs: lotRec, action: this.action, otherParam: this.approve }) },

            success: function (form, action) {

                Ext.getCmp('transferIssue-form').getForm().reset();
                Ext.getCmp('transferIssue-detailGrid').getStore().removeAll();
                Ext.getCmp('transferIssue-paging').doRefresh();
                Ext.getCmp('transferIssueRequestOrder-paging').doRefresh();


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
    onApprove: function () {
        this.approve = "approve";
        this.onSave('approve');
        
    },
    onLoadLOTSerial: function (serilList, lOTList) {

        var grid = Ext.getCmp('transferIssue-detailGrid');
        var serilStore = grid.serialStore;
        var lOTStore = grid.lOTStore;

        if (typeof serilList != "undefined" && serilList != null && serilList != "") {
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
        if (typeof lOTList != "undefined" && lOTList != null && lOTList != "") {
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
Ext.reg('transferIssue-window', Ext.erp.ux.transferIssue.Window);

/**
* @desc      TransferIssue grid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.transferIssue
* @class     Ext.erp.ux.transferIssue.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.transferIssue.Grid = function (config) {
    Ext.erp.ux.transferIssue.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: TransferIssue.GetAllHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DESC'
            },
            fields: ['Id', 'VoucherNumber', 'IssuedDate', 'StatusId', 'Status', 'PreparedBy', 'TransferIssuedBy', 'IsLastStep', 'FromStore', 'FromStoreId', 'ToStore','Remark'],
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
        id: 'transferIssue-grid',
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
                this.onEdit();
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
            dataIndex: 'IssuedDate',
            header: 'Issued Date',
            sortable: true,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'FromStore',
            header: 'From Store',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ToStore',
            header: 'To Store',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'PreparedBy',
            header: 'Prepared By',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Remark',
            header: 'Remark',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Status',
            header: 'Status',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Approval',
            header: 'Approval',
            sortable: true,
            width: 100,
            menuDisabled: true,
            editor: new Ext.form.TriggerField({
                id: 'transferIssueApproval',
                onTriggerClick: function (e) {
                    var grid = Ext.getCmp('transferIssue-grid');
                    var selectedrecord = grid.getSelectionModel().getSelected();
                    var id = selectedrecord.get('Id');
                    var position = Ext.getCmp('transferIssueApproval').getPosition(false);
                    new Ext.erp.ux.voucherApproval.Window({
                        title: 'Approval',
                        id: id,
                        x: position[0] - 290,
                        y: position[1] + 21,
                    }).show();
                }
            })
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.transferIssue.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({  }) };
        this.tbar = [{
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearchVoucher
        },{
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Transfer Issue', 'CanAdd'),
            handler: this.onAdd
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
            disabled: !Ext.erp.ux.Reception.getPermission('Transfer Issue', 'CanEdit'),
            handler: this.onIssue
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Void',
            iconCls: 'icon-delete',
            disabled: !Ext.erp.ux.Reception.getPermission('Transfer Issue', 'CanDelete'),
            handler: this.onDelete
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Revise',
            iconCls: 'icon-accept',
            disabled: !Ext.erp.ux.Reception.getPermission('Transfer Issue', 'CanEdit'),
            handler: this.onRevise
        }, {
            xtype: 'button',
            text: 'Preview',
            id: 'preview-TransferIssue',
            hidden: false,
            iconCls: 'icon-preview',
            handler: this.onPreview
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'transferIssue-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.transferIssue.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {
        var grid = Ext.getCmp('transferIssue-grid');
        if (!grid.getSelectionModel().hasSelection()) return;

        var voucherId = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        window.open('Reports/ErpReportViewer.aspx?rt=PreviewTransferIssue&id=' + voucherId, 'PreviewIV', parameter);


    },
    onAdd: function () {
        new Ext.erp.ux.transferIssue.Window({
            title: 'Add Transfer Issue',
            action: 'add'
        }).show();
    },
    onEdit: function () {
        var grid = Ext.getCmp('transferIssue-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var fromStoreId = grid.getSelectionModel().getSelected().get('FromStoreId');
        var Status = grid.getSelectionModel().getSelected().get('Status');

        if (Status != "Posted") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "only posted status transfer issue is editable, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.erp.ux.transferIssue.Window({
            title: 'Edit Transfer Issue',           
            transferIssueHeaderId: id,
            fromStoreId:fromStoreId,
            action:'edit'
        }).show();
    },
    onRevise: function () {
        var grid = Ext.getCmp('transferIssue-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var status = grid.getSelectionModel().getSelected().get('Status');
        var storeId = grid.getSelectionModel().getSelected().get('FromStoreId');

        if (status == "Issued") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: " issued transaction are  not be revised, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.ux.transferIssue.Window({
            title: 'Revise Transfer Out',
            transferIssueHeaderId: id,
            fromStoreId: storeId,
            action: 'revise'
        }).show();
    },
    onIssue: function () {
        var grid = Ext.getCmp('transferIssue-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var storeId = grid.getSelectionModel().getSelected().get('FromStoreId');
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
        new Ext.erp.ux.transferIssue.Window({
            title: 'Transfer Issue',
            transferIssueHeaderId: id,
            fromStoreId: storeId,
            action: 'issue'
        }).show();
    },
    onDelete: function () {
        var grid = Ext.getCmp('transferIssue-grid');
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
                    TransferIssue.Void(id, function (result) {
                        if (result.success) {
                            Ext.getCmp('transferIssue-paging').doRefresh();
                            Ext.getCmp('transferIssueRequestOrder-paging').doRefresh();


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
            var grid = Ext.getCmp('transferIssue-grid');
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.voucherSearch.Window({ title: 'Search Transactions', action: 'searcVoucher1' }).show();
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.ux.transferIssue.Grid.superclass.afterRender.apply(this, arguments);
    },
});
Ext.reg('transferIssue-grid', Ext.erp.ux.transferIssue.Grid);




/**
* @desc     transferIssue grid
* @author   Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.transferIssue
* @class     Ext.erp.ux.transferIssue.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.transferIssue.RequestOrderGrid = function (config) {
    Ext.erp.ux.transferIssue.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: TransferIssue.GetAllRequestOrderHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DESC'
            },
            fields: ['Id', 'StoreId', 'Store', 'ToStoreId', 'Store', 'RequestedDate', 'VoucherNumber', 'OrderedBy', 'ConsumerType', 'Consumer', 'Requester', 'IsRedirected', 'StatusId', 'Status'],
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
        id: 'transferIssueRequestOrder-grid',
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
            rowclick: function (grid, rowIndex, e) {
                var id = Ext.getCmp('transferIssueRequestOrder-grid').getSelectionModel().getSelected().get("Id"); var grid = Ext.getCmp('transferIssue-detailGrid');
                var grid = Ext.getCmp('transferIssue-grid');
                var store = grid.getStore();
                store.baseParams = { record: Ext.encode({ requestOrderId: id}) };
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
            renderer: this.customRenderer,
        },{
            dataIndex: 'VoucherNumber',
            header: 'SR No',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'RequestedDate',
            header: 'Requested Date',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'Requester',
            header: 'Requested By',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'ConsumerType',
            header: 'Consumer Type',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'Consumer',
            header: 'Consumer',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'OrderedBy',
            header: 'Ordered By',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'Status',
            header: 'Status',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.transferIssue.RequestOrderGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [
            {
                text: 'Search',
                iconCls: 'icon-filter',
                handler: this.onSearchVoucher
            }, {
                xtype: 'tbseparator'
            }, {
                checked: true,
                xtype: 'checkbox',
                id: 'transferIssue-ShowPurchase',
                readOnly: false,
                allowBlank: true,
                checked: false,
                listeners: {

                    check: function (check, value, index) {
                        var grid = Ext.getCmp('transferIssueRequestOrder-grid');
                        var store = grid.getStore();
                        store.baseParams = { record: Ext.encode({ requestOrderId: id, isPurchase: value }) };
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
                value: "Purchase",
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: !Ext.erp.ux.Reception.getPermission('Transfer Issue', 'CanAdd'),
                handler: this.onAdd
            },{
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Void',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.ux.Reception.getPermission('Transfer Issue', 'CanDelete'),
                handler: this.onVoid
            }];
        this.bbar = new Ext.PagingToolbar({
            id: 'transferIssueRequestOrder-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.transferIssue.RequestOrderGrid.superclass.initComponent.apply(this, arguments);
    },
    onSearchVoucher: function () {
        Ext.erp.ux.voucherSearch.Observable.on('searchvoucher', function (result) {
            result['mode'] = 'search';
            var grid = Ext.getCmp('transferIssueRequestOrder-grid');
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.voucherSearch.Window({ title: 'Search Transactions' }).show();
    },
    onAdd: function () {
        var grid = Ext.getCmp('transferIssueRequestOrder-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var status = grid.getSelectionModel().getSelected().get('Status');
        if (status != "Posted" && status != "Partially") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "Only Posted requisition order or partially issued is to be issued, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var storeRequestNumber = grid.getSelectionModel().getSelected().get('VoucherNumber');
        var orderedBy = grid.getSelectionModel().getSelected().get('OrderedBy');
        var storeId = grid.getSelectionModel().getSelected().get('StoreId');
        var store = grid.getSelectionModel().getSelected().get('Store');
        var toStoreId = grid.getSelectionModel().getSelected().get('ToStoreId');
        var toStore = grid.getSelectionModel().getSelected().get('Consumer');

        new Ext.erp.ux.transferIssue.Window({
            title: 'Add Transfer Issue',
            requestOrderHeaderId: id,
            storeRequestNumber: storeRequestNumber,
            orderedBy: orderedBy,
            fromStoreId: storeId,
            fromStore: store,
            toStoreId: toStoreId,
            toStore: toStore,
            action: 'add'
        }).show();
    },
    onVoid: function () {
        var grid = Ext.getCmp('transferIssueRequestOrder-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var status = grid.getSelectionModel().getSelected().get('Status');
        if (status != "Posted") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "Only Posted requisition order is to be void, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
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
                    TransferIssue.VoidRequisitionOrder(id, function (result) {
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
    customRenderer: function (value, metaData, record, rowIndex, colIndex, store) {

        if (record.get("Status") == "Approved")
            return '<span style=color:green>' + value + '</span>';
        else if (record.get("Status") == "Void")
            return '<span style=color:red>' + value + '</span>';
        else if (record.get("Status") == "Partially")
            return '<span style=color:blue>' + value + '</span>';

        else
            return '<span style=color:black>' + value + '</span>';

    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.ux.transferIssue.RequestOrderGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('transferIssueRequestOrder-grid', Ext.erp.ux.transferIssue.RequestOrderGrid);

/**
* @desc      transferIssue panel
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @version   $Id: transferIssue.js, 0.1
* @namespace Ext.erp.ux.transferIssue
* @class     Ext.erp.ux.transferIssue.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.transferIssue.Panel = function (config) {
    Ext.erp.ux.transferIssue.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.transferIssue.Panel, Ext.Panel, {
    initComponent: function () {
        this.headerGrid = new Ext.erp.ux.transferIssue.Grid();
        this.requestOrderGrid = new Ext.erp.ux.transferIssue.RequestOrderGrid();

        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                split: true,
                width: 300,
                minSize: 300,
                maxSize: 600,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.requestOrderGrid]
            }, {
                region: 'center',
                border: false,
                layout: 'fit',
                items: [this.headerGrid]
            }]
        }];

        Ext.erp.ux.transferIssue.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('transferIssue-panel', Ext.erp.ux.transferIssue.Panel);
