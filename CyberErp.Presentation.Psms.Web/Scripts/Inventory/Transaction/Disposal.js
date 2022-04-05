Ext.ns('Ext.erp.ux.disposal');

/**
* @desc      Disposal form
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.disposal
* @class     Ext.erp.ux.disposal.Form
* @extends   Ext.form.FormPanel
*/

Ext.erp.ux.disposal.Form = function (config) {
    Ext.erp.ux.disposal.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Disposal.Get,
            submit: Disposal.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'disposal-form',
        frame: true,
        labelWidth: 130,
        padding: 5,
        autoHeight: false,
        border: false,
        loadDocument: function () {

            Disposal.GetDocumentNo(function (result) {
                var form = Ext.getCmp('disposal-form').getForm();
                form.findField('VoucherNumber').setValue(result.data.DocNo);

                form.findField('StatusId').setValue(result.data.StatusId);
                form.findField('PreparedById').setValue(result.data.EmployeeId);
                form.findField('DisposedById').setValue(result.data.EmployeeId);
                form.findField('DisposedBy').setValue(result.data.Employee);
                form.findField('DisposedDate').setValue(new Date());
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
                items: [{
                    name: 'Id',
                    xtype: 'hidden'
                }, {
                    name: 'CertifiedDate',
                    xtype: 'hidden'
                }, {
                    name: 'FiscalYearId',
                    xtype: 'hidden'
                }, {
                    name: 'DisposalRequestHeaderId',
                    xtype: 'hidden'
                },  {
                    name: 'CreatedAt',
                    xtype: 'hidden'
                }, {
                    name: 'StatusId',
                    xtype: 'hidden'
                }, {
                    name: 'PreparedById',
                    xtype: 'hidden'
                }, {
                    name: 'DisposedById',
                    xtype: 'hidden'
                }, {
                    name: 'DisposalTypeId',
                    xtype: 'hidden'
                },{
                    name: 'StoreId',
                    xtype: 'hidden'
                }, {
                    name: 'VoucherNumber',
                    xtype: 'textfield',
                    fieldLabel: 'Voucher Number',
                    readOnly: true,
                    allowBlank: false
                }, {
                    hiddenName: 'Store',
                    xtype: 'combo',
                    fieldLabel: 'Store',
                    typeAhead: true,
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
                            var form = Ext.getCmp('disposal-form').getForm();
                            form.findField('StoreId').setValue(rec.id);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('disposal-form').getForm();
                                form.findField('StoreId').reset();

                            }
                        }
                    }
                }, {
                    name: 'DisposedDate',
                    xtype: 'datefield',
                    fieldLabel: 'Disposed Date',
                    width: 100,
                    allowBlank: false,
                    value: new Date(),
                    maxValue: (new Date()).format('m/d/Y')
                },{
                    hiddenName: 'DisposalType',
                    xtype: 'combo',
                    fieldLabel: 'Disposal Type',
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
                        api: { read: Psms.GetDisposalType }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('disposal-form').getForm();
                            form.findField("DisposalTypeId").setValue(rec.id);
                                 },
                    }
                }, ]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [{
                    hiddenName: 'DisposedBy',
                    xtype: 'combo',
                    fieldLabel: 'Disposed By',
                    typeAhead: true,
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
                            var form = Ext.getCmp('disposal-form').getForm();
                            form.findField('DisposedById').setValue(rec.id);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('disposal-form').getForm();
                                form.findField('DisposedById').reset();

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
Ext.extend(Ext.erp.ux.disposal.Form, Ext.form.FormPanel);
Ext.reg('disposal-form', Ext.erp.ux.disposal.Form);

/**
* @desc      Disposal detailGrid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.disposal
* @class     Ext.erp.ux.disposal.GridDetail
* @extends   Ext.grid.GridPanel
*/
var disposalSelectionModel = new Ext.grid.RowSelectionModel({
});
Ext.erp.ux.disposal.GridDetail = function (config) {
    Ext.erp.ux.disposal.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Disposal.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            //  idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'DisposalHeaderId', 'IsSerialItem', 'IsLOTItem', 'ItemId', 'Name', 'Code', 'MeasurementUnit', 'AvailableQuantity', 'Quantity', 'UnitPrice', 'DisposedQuantity', 'RemainingQuantity'],

            remoteSort: true
        }),
        id: 'disposal-detailGrid',
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
                Ext.getCmp('disposal-detailGrid').body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
                Ext.getCmp('disposal-detailGrid').body.unmask();
            },
            loadException: function () {
                Ext.getCmp('disposal-detailGrid').body.unmask();
            },
            rowClick: function (grid, index) {
                var detailGrid = Ext.getCmp('disposal-detailGrid');
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
                    editor: new Ext.form.ComboBox({
                        typeAhead: true, width: 100,
                        hideTrigger: true,
                        minChars: 2,
                        listWidth: 300,
                        emptyText: '---Type to Search---',
                        mode: 'remote',
                        pageSize: 12,
                        allowBlank: false,
                        tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'Name', 'Code', 'UnitId', 'IsSerialItem', 'IsLOTItem', 'MeasurementUnit']
                            }),
                            api: { read: Psms.GetItemBySearch }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        listeners: {

                            select: function (combo, record, index) {

                                var detailDrid = Ext.getCmp('disposal-detailGrid');
                                var selectedrecord = detailDrid.getSelectionModel().getSelected();
                                selectedrecord.set('ItemId', record.get("Id"));
                                selectedrecord.set('UnitId', record.get("UnitId"));
                                selectedrecord.set('Code', record.get("Code"));
                                selectedrecord.set('MeasurementUnit', record.get("MeasurementUnit"));
                                selectedrecord.set('IsSerialItem', record.get("IsSerialItem"));

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
                    dataIndex: 'MeasurementUnit',
                    header: 'Unit',
                    sortable: true,
                    width: 100,
                    menuDisabled: true
                }, {
                    dataIndex: 'DisposedQuantity',
                    header: 'Disposed Qty',
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
                },{
                    dataIndex: 'UnitPrice',
                    header: 'Unit Price',
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
Ext.extend(Ext.erp.ux.disposal.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.tbar = [
            {
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: false,
                handler: function () {
                    var detailDrid = Ext.getCmp('disposal-detailGrid');
                    var store = detailDrid.getStore();

                    var defaultData = {
                        Remark: '',
                        Quantity: 0,
                        DisposedQuantity: 0,
                        RemainingQuantity: 0
                    };
                    var records = new store.recordType(defaultData);
                    store.add(records);
                }
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Remove',
                iconCls: 'icon-exit',
                disabled: false,
                handler: function () {
                    var grid = Ext.getCmp('disposal-detailGrid');

                    if (!grid.getSelectionModel().hasSelection())
                        return;

                    var selectedrecord = grid.getSelectionModel().getSelected();
                    grid.getStore().remove(selectedrecord);
                }
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Add Serial/LOT',
                iconCls: 'icon-add',
                handler: this.onSerialLOtClick
            }, '->',
            {
                xtype: 'button',
                text: 'Picker',
                iconCls: 'icon-picker',
                disabled: false,
                handler: function () {
                    var detailGrid = Ext.getCmp('disposal-detailGrid');
                    new Ext.erp.ux.itemPicker.Window({
                        targetGrid: detailGrid
                    }).show();
                }
            }, ];
        this.bbar = []

        Ext.erp.ux.disposal.GridDetail.superclass.initComponent.apply(this, arguments);
    },
    onSerialLOtClick: function () {

        var detailDrid = Ext.getCmp('disposal-detailGrid');
        var currentRecord = detailDrid.currentRecord;
        var storeId = Ext.getCmp('disposal-form').getForm().findField("StoreId").getValue();
        var itemId = currentRecord.get("ItemId");
        var disposaldQuantity = currentRecord.get("DisposedQuantity");
        if (disposaldQuantity < 0) {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "Disposed Quantity must be greater than 0",
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
                issuedQuantity: disposaldQuantity
            }).show();
        }
        else if (currentRecord.get("IsLOTItem")) {
            new Ext.erp.ux.itemLOTSelector.Window({
                title: 'Add Item LOT',
                itemStore: detailDrid.lOTStore.query("ItemId", itemId),
                targetGrid: detailDrid,
                storeId: storeId,
                itemId: itemId,
                issuedQuantity: disposaldQuantity
            }).show();
        }
    },
    afterRender: function () {
        Ext.erp.ux.disposal.GridDetail.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('disposal-detailGrid', Ext.erp.ux.disposal.GridDetail);


/* @desc     disposalOrder form host window
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date     September 2013
* @namespace Ext.erp.ux.disposalOrder
* @class     Ext.erp.ux.disposalOrder.Window
* @extends   Ext.Window
*/

Ext.erp.ux.disposal.Window = function (config) {
    Ext.erp.ux.disposal.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 700,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'disposal-window',
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.disposalHeaderId);
              
                if (typeof this.disposalHeaderId != "undefined" && this.disposalHeaderId != "") {
                    this.form.load({
                        waitMsg: 'Loading...',
                        params: { id: this.disposalHeaderId },
                        success: function (form, action) {
                            var grid = Ext.getCmp('disposal-detailGrid');
                            var serilStore = grid.serialStore;
                            var lOTStore = grid.lOTStore;

                            var serilList = action.result.serialList;
                            var lOTList = action.result.lotList;

                            for (var i = 0; i < serilList.length; i++) {
                                var item = serilList[i];
                                var p = new Ext.data.Record({
                                    Id: item.Id,
                                    ItemId: item.ItemId,
                                    StoreId: item.StoreId,
                                    ItemSerialId: item.ItemSerialId,
                                    Number: item.Number,
                                    IsAvailable: item.IsAvailable,
                                    Description: item.Description,
                                    PlateNo: item.PlateNo,
                                    Remark: '',
                                });
                                var count = serilStore.getCount();
                                serilStore.insert(count, p);
                            };
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
                    });

                    var grid = Ext.getCmp('disposal-detailGrid');
                    var store = grid.getStore();
                    store.baseParams = { record: Ext.encode({ storeId: this.storeId, voucherHeaderId: this.disposalHeaderId, action: "storeDisposal" }) };

                    grid.getStore().reload({
                        params: {
                            start: 0,
                            limit: grid.pageSize
                        }
                    });
                } else {
                    Ext.getCmp('disposal-form').loadDocument();
                   
                }

            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.ux.disposal.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.disposal.Form();
        this.grid = new Ext.erp.ux.disposal.GridDetail();
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
        Ext.erp.ux.disposal.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var grid = Ext.getCmp('disposal-detailGrid');
        var store = grid.getStore();
        var rec = '', serialRec = '', lotRec = ''; var errorMesssage = "";
        var selectedItems = grid.getSelectionModel().getSelections();
        var store = grid.getStore();
        var serialStore = grid.serialStore;
        var lOTStore = grid.lOTStore;
        if (store.getCount() < 1) {
            Ext.MessageBox.show({
                title: 'Save failed',
                msg: "Please detail items",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        store.each(function (item) {
            if (typeof item.get('DisposedQuantity') == 'undefined' || item.get('DisposedQuantity') < 0) {
                if (errorMesssage == "")
                    errorMesssage = "Disposed Quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Disposed Quantity";
            }
            if (item.get('IsSerialItem') && item.get('DisposedQuantity') != serialStore.query("ItemId", item.get('ItemId')).length) {
                if (errorMesssage == "")
                    errorMesssage = "Total Disposed quantity should be equal to number of serials added";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Total Disposed quantity should be equal to number of serials added";

            }
            if (item.get('IsLOTItem') && item.get('DisposedQuantity') != serialStore.query("ItemId", item.get('ItemId')).sum('Quantity')) {
                if (errorMesssage == "")
                    errorMesssage = "Total Disposed quantity should be equal to total added LOT quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Total Disposed quantity should be equal to total added LOT quantity";

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

                              item.data['DisposalHeaderId'] + ':' +
                              item.data['ItemId'] + ':' +
                              item.data['Quantity'] + ':' +
                              item.data['DisposedQuantity'] + ':' +
                              item.data['RemainingQuantity'] + ':' +
                              item.data['StatusId'] + ':' +
                              item.data['Remark'] + ':' +
                              item.data['UnitPrice'] + ';';
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
            params: { record: Ext.encode({ disposalDetails: rec, itemSerials: serialRec, itemLOTs: lotRec, action: this.action }) },

            success: function (form, action) {

                Ext.getCmp('disposal-form').getForm().reset();
                Ext.getCmp('disposal-detailGrid').getStore().removeAll();
                Ext.getCmp('disposal-paging').doRefresh();

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
Ext.reg('disposal-window', Ext.erp.ux.disposal.Window);

/**
* @desc      Disposal grid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.disposal
* @class     Ext.erp.ux.disposal.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.disposal.Grid = function (config) {
    Ext.erp.ux.disposal.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Disposal.GetAllHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DESC'
            },
            fields: ['Id', 'VoucherNumber', 'DisposedDate', 'StatusId', 'Status', 'DisposalType', 'PreparedBy', 'IsLastStep', 'DisposedBy', 'Store', 'StoreId'],
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
        id: 'disposal-grid',
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
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'DisposedDate',
            header: 'Disposal Date',
            sortable: true,
            width: 80,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'Store',
            header: 'Store',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'DisposalType',
            header: 'Disposal Type',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'PreparedBy',
            header: 'Prepared By',
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

        }, {
            dataIndex: 'Approval',
            header: 'Approval',
            sortable: true,
            width: 100,
            menuDisabled: true,
            editor: new Ext.form.TriggerField({
                id: 'disposalApproval',
                onTriggerClick: function (e) {
                    var grid = Ext.getCmp('disposal-grid');
                    var selectedrecord = grid.getSelectionModel().getSelected();
                    var id = selectedrecord.get('Id');
                    var position = Ext.getCmp('disposalApproval').getPosition(false);
                    new Ext.erp.ux.voucherApproval.Window({
                        title: 'Approval',
                        id: id,
                        x: position[0] - 290,
                        y: position[1] + 21,
                    }).show();
                }
            })
        }, ]
    }, config));
}
Ext.extend(Ext.erp.ux.disposal.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [{
            id: 'searchDisposal',
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearchVoucher
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Disposal', 'CanAdd'),

            handler: this.onAdd
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Disposal', 'CanEdit'),

            handler: this.onEdit
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Issue',
            iconCls: 'icon-accept',
            disabled: !Ext.erp.ux.Reception.getPermission('Disposal', 'CanEdit'),
            handler: this.onIssue
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Void',
            iconCls: 'icon-delete',
            disabled: !Ext.erp.ux.Reception.getPermission('Disposal', 'CanDelete'),
            handler: this.onDelete
        }, {
            xtype: 'button',
            text: 'Preview',
            id: 'preview-Disposal',
            hidden: true,
            iconCls: 'icon-preview',
            handler: this.onPreview
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'disposal-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.disposal.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {

        var grid = Ext.getCmp('disposal-grid');
        if (!grid.getSelectionModel().hasSelection()) return;

        var voucherNo = grid.getSelectionModel().getSelected().get('VoucherNumber');
        var statusId = grid.getSelectionModel().getSelected().get('StatusId');

        var forCommitment = grid.getSelectionModel().getSelected().get('ForCommitment');

        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        if (forCommitment == false) {
            window.open('Reports/ErpReportViewer.aspx?rt=PreviewIV&vn=' + voucherNo + '&sId=' + statusId, 'PreviewIV', parameter);
        }
        else {
            window.open('Reports/ErpReportViewer.aspx?rt=PreviewIVForCommitment&vn=' + voucherNo + '&sId=' + statusId, 'PreviewIV', parameter);
        }
    },
    onAdd: function () {
              new Ext.erp.ux.disposal.Window({
            title: 'Add Store Disposal',
            disposalHeaderId: '',
            action: 'allAtOnce'
        }).show();
    },
    onEdit: function () {
        var grid = Ext.getCmp('disposal-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var storeId = grid.getSelectionModel().getSelected().get('StoreId');
        var status = grid.getSelectionModel().getSelected().get('Status');

        if (status != "Posted") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "Only Posted transaction can be edited, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.erp.ux.disposal.Window({
            title: 'Edit Disposal',
            disposalHeaderId: id,
            storeId: storeId,
            action: 'edit'
        }).show();
    },
    onIssue: function () {
        var grid = Ext.getCmp('disposal-grid');
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

        new Ext.erp.ux.disposal.Window({
            title: 'Disposal',
            disposalHeaderId: id,
            storeId: storeId,
            action: 'issue'
        }).show();
    },
    onDelete: function () {
        var grid = Ext.getCmp('disposal-grid');
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
                    Disposal.Void(id, function (result) {
                        if (result.success) {
                            Ext.getCmp('disposal-paging').doRefresh();
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
            var grid = Ext.getCmp('disposal-grid');
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.voucherSearch.Window({ title: 'Search Transactions' }).show();
    },
    customRenderer: function (value, metaData, record, rowIndex, colIndex, store) {

        if (record.get("Status") == "Approved")
            return '<span style=color:green>' + value + '</span>';
        else if (record.get("Status") == "Void")
            return '<span style=color:red>' + value + '</span>';
        else if (record.get("Status") == "Certified")
            return '<span style=color:black>' + value + '</span>';

        else
            return '<span style=color:black>' + value + '</span>';


    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.ux.disposal.Grid.superclass.afterRender.apply(this, arguments);
    }

});
Ext.reg('disposal-grid', Ext.erp.ux.disposal.Grid);



/**
* @desc     disposal grid
* @author   Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.disposal
* @class     Ext.erp.ux.disposal.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.disposal.DisposalRequestGrid = function (config) {
    Ext.erp.ux.disposal.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Disposal.GetAllDisposalRequestHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DESC'
            },
            fields: ['Id', 'StoreId', 'Store', 'RequestedDate', 'VoucherNumber', 'RequestedBy', 'ConsumerType', 'Consumer', 'StatusId', 'Status'],
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
        id: 'disposalDisposalRequest-grid',
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
            rowclick: function (grid, rowIndex, e) {
                var id = Ext.getCmp('disposalDisposalRequest-grid').getSelectionModel().getSelected().get("Id"); var grid = Ext.getCmp('disposal-detailGrid');
                var grid = Ext.getCmp('disposal-grid');
                var store = grid.getStore();
                store.baseParams = { record: Ext.encode({ disposalRequestId: id }) };
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
            menuDisabled: true
        }, {
            dataIndex: 'VoucherNumber',
            header: 'Disposal Request No',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'RequestedDate',
            header: 'Requested Date',
            sortable: true,
            width: 100,
            menuDisabled: true
        },  {
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
        },  {
            dataIndex: 'RequestedBy',
            header: 'Requested By',
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
Ext.extend(Ext.erp.ux.disposal.DisposalRequestGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [
            {
                id: 'searchDisposalRequest',
                text: 'Search',
                iconCls: 'icon-filter',
                handler: this.onSearchVoucher
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: !Ext.erp.ux.Reception.getPermission('Disposal', 'CanAdd'),
                handler: this.onAdd
            }];
        this.bbar = new Ext.PagingToolbar({
            id: 'disposalDisposalRequest-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.disposal.DisposalRequestGrid.superclass.initComponent.apply(this, arguments);
    },
    onSearchVoucher: function () {
        Ext.erp.ux.disposalDisposalRequest.Observable.on('searchDisposalRequest', function (result) {
            result['mode'] = 'search';
            var grid = Ext.getCmp('disposalDisposalRequest-grid');
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.disposalDisposalRequest.SearchDisposalRequestWindow({ title: 'Search Request Order' }).show();
    },
    onAdd: function () {
        var grid = Ext.getCmp('disposalDisposalRequest-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var disposalRequestNumber = grid.getSelectionModel().getSelected().get('VoucherNumber');
        var requestedBy = grid.getSelectionModel().getSelected().get('RequestedBy');
        var storeId = grid.getSelectionModel().getSelected().get('StoreId');
        var store = grid.getSelectionModel().getSelected().get('Store');
        new Ext.erp.ux.disposal.Window({
            title: 'Add Store Disposal',
            disposalRequestHeaderId: id,
            disposalRequestNumber: disposalRequestNumber,
            requestedBy: requestedBy,
            storeId: storeId,
            store: store,
            action: 'add'
        }).show();
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.ux.disposal.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('disposalDisposalRequest-grid', Ext.erp.ux.disposal.DisposalRequestGrid);

/**
* @desc      disposal panel
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @version   $Id: disposal.js, 0.1
* @namespace Ext.erp.ux.disposal
* @class     Ext.erp.ux.disposal.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.disposal.Panel = function (config) {
    Ext.erp.ux.disposal.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.disposal.Panel, Ext.Panel, {
    initComponent: function () {
        this.headerGrid = new Ext.erp.ux.disposal.Grid();
      
        this.items = [{
            layout: 'border',
            border: false,
            items: [ {
                region: 'center',
                border: false,
                layout: 'fit',
                items: [this.headerGrid]
            }]
        }];

        Ext.erp.ux.disposal.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('disposal-panel', Ext.erp.ux.disposal.Panel);

/**
* @desc      VoucherSearch form
* @namespace Ext.erp.ux.disposal
* @class     Ext.erp.ux.disposal.Form
* @extends   Ext.form.FormPanel
*/

Ext.apply(Ext.form.VTypes, {
    daterange: function (val, field) {
        var date = field.parseDate(val);
        if (!date) {
            return false;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = Ext.getCmp(field.startDateField);
            start.setMaxValue(date);
            this.dateRangeMax = date;
        }
        else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = Ext.getCmp(field.endDateField);
            end.setMinValue(date);
            this.dateRangeMin = date;
        }
        return true;
    }
});

Ext.erp.ux.disposal.SearchForm = function (config) {
    Ext.erp.ux.disposal.SearchForm.superclass.constructor.call(this, Ext.apply({
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'disposalSearch-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'VoucherNo',
            xtype: 'textfield',
            fieldLabel: 'IO No'
        }, {
            name: 'SRNo',
            xtype: 'textfield',
            fieldLabel: 'SR No'
        }, {
            name: 'ReceiveNo',
            xtype: 'textfield',
            fieldLabel: 'GRN No'
        }, {
            hiddenName: 'StoreId',
            xtype: 'combo',
            fieldLabel: 'Store',
            triggerAction: 'all',
            mode: 'remote',
            forceSelection: true,
            emptyText: '---Select---',
            allowBlank: true,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: Combo.GetStores }
            }),
            valueField: 'Id',
            displayField: 'Name'
        }, {
            id: 'StartDate',
            name: 'StartDate',
            xtype: 'datefield',
            fieldLabel: 'Start Date',
            altFormats: 'c',
            editable: true,
            vtype: 'daterange',
            endDateField: 'EndDate',
            showToday: false
        }, {
            id: 'EndDate',
            name: 'EndDate',
            xtype: 'datefield',
            fieldLabel: 'End Date',
            altFormats: 'c',
            editable: true,
            vtype: 'daterange',
            startDateField: 'StartDate',
            showToday: false
        }]
    }, config));
};
Ext.extend(Ext.erp.ux.disposal.SearchForm, Ext.form.FormPanel);
Ext.reg('disposalSearch-form', Ext.erp.ux.disposal.SearchForm);

/**
* @desc      VoucherSearch form host window
* @namespace Ext.erp.ux.disposal
* @class     Ext.erp.ux.disposal.Window
* @extends   Ext.Window
*/
Ext.erp.ux.disposal.Observable = new Ext.util.Observable();
Ext.erp.ux.disposal.Observable.addEvents('searchvoucher');

Ext.erp.ux.disposal.SearchWindow = function (config) {
    Ext.erp.ux.disposal.SearchWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 400,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
};
Ext.extend(Ext.erp.ux.disposal.SearchWindow, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.disposal.SearchForm();
        /*if (this.source == 'voucher') {
            this.form.getForm().findField('TransactionStatus').hide();
        }*/
        this.items = [this.form];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Filter',
            iconCls: 'icon-filter',
            handler: this.onFilter,
            scope: this
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        var searchForm = this.form;
        this.tools = [{
            id: 'refresh',
            qtip: 'Reset',
            handler: function () {
                searchForm.getForm().reset();
            },
            scope: this
        }];
        Ext.erp.ux.disposal.SearchWindow.superclass.initComponent.call(this, arguments);
    },
    onFilter: function () {
        var form = Ext.getCmp('disposalSearch-form').getForm();
        var result = {};
        result['referenceNo'] = form.findField('VoucherNo').getValue();
        result['srNo'] = form.findField('SRNo').getValue();
        result['receiveNo'] = form.findField('ReceiveNo').getValue();
        result['storeId'] = form.findField('StoreId').getValue();
        result['startDate'] = form.findField('StartDate').getValue();
        result['endDate'] = form.findField('EndDate').getValue();
        //result['transactionStatus'] = form.findField('TransactionStatus').getValue();
        Ext.erp.ux.disposal.Observable.fireEvent('searchvoucher', result);
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('disposalSearch-window', Ext.erp.ux.disposal.SearchWindow);