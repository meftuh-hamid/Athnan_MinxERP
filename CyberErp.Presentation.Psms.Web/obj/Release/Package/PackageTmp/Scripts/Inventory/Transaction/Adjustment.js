Ext.ns('Ext.erp.ux.adjustment');

/**
* @desc      Adjustment form
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.adjustment
* @class     Ext.erp.ux.adjustment.Form
* @extends   Ext.form.FormPanel
*/

Ext.erp.ux.adjustment.Form = function (config) {
    Ext.erp.ux.adjustment.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Adjustment.Get,
            submit: Adjustment.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'adjustment-form',
        frame: true,
        labelWidth: 130,
        padding: 5,
        autoHeight: false,
        border: false,
        loadDocument: function () {

            Adjustment.GetDocumentNo(function (result) {
                var form = Ext.getCmp('adjustment-form').getForm();
                form.findField('VoucherNumber').setValue(result.data.DocNo);
                form.findField('StatusId').setValue(result.data.StatusId);
                form.findField('PreparedById').setValue(result.data.EmployeeId);
                form.findField('AdjustmentedById').setValue(result.data.EmployeeId);
                form.findField('AdjustmentedBy').setValue(result.data.Employee);
                form.findField('AdjustmentedDate').setValue(new Date());
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
                    name: 'FiscalYearId',
                    xtype: 'hidden'
                }, {
                    name: 'CertifiedDate',
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
                    name: 'CertifiedById',
                    xtype: 'hidden'
                }, {
                    name: 'ApprovedById',
                    xtype: 'hidden'
                }, {
                    name: 'AdjustmentedById',
                    xtype: 'hidden'
                }, {
                    name: 'StoreId',
                    xtype: 'hidden'
                }, {
                    name: 'AdjustmentTypeId',
                    xtype: 'hidden'
                },  {
                    name: 'VoucherNumber',
                    xtype: 'textfield',
                    fieldLabel: 'Voucher Number',
                    readOnly: true,
                    allowBlank: false
                }, {
                    hiddenName: 'AdjustmentType',
                    xtype: 'combo',
                    fieldLabel: 'Adjustment Type',
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
                        api: { read: Psms.GetAdjustmentType }
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('adjustment-form').getForm();
                            form.findField("AdjustmentTypeId").setValue(rec.id);
                        },
                    }
                },  ]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [
                      {
                          hiddenName: 'Store',
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
                                  var form = Ext.getCmp('adjustment-form').getForm();
                                  form.findField('StoreId').setValue(rec.id);
                              },
                              change: function (cmb, newvalue, oldvalue) {
                                  if (newvalue == "") {
                                      var form = Ext.getCmp('adjustment-form').getForm();
                                      form.findField('StoreId').reset();

                                  }
                              }
                          }
                      }, {
                          name: 'AdjustmentedDate',
                          xtype: 'datefield',
                          fieldLabel: 'Adjustmented Date',
                          width: 100,
                          allowBlank: false,
                          value: new Date(),
                          maxValue: (new Date()).format('m/d/Y')
                      } ,{
                        hiddenName: 'AdjustmentedBy',
                        xtype: 'combo',
                        fieldLabel: 'Adjustmented By',
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
                                var form = Ext.getCmp('adjustment-form').getForm();
                                form.findField('AdjustmentedById').setValue(rec.id);
                            },
                            change: function (cmb, newvalue, oldvalue) {
                                if (newvalue == "") {
                                    var form = Ext.getCmp('adjustment-form').getForm();
                                    form.findField('AdjustmentedById').reset();

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
Ext.extend(Ext.erp.ux.adjustment.Form, Ext.form.FormPanel);
Ext.reg('adjustment-form', Ext.erp.ux.adjustment.Form);



/**
* @desc      Adjustment detailGrid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.adjustment
* @class     Ext.erp.ux.adjustment.GridDetail
* @extends   Ext.grid.GridPanel
*/
var adjustmentSelectionModel = new Ext.grid.RowSelectionModel({
});
Ext.erp.ux.adjustment.GridDetail = function (config) {
    Ext.erp.ux.adjustment.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Adjustment.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            //  idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'AdjustmentHeaderId', 'IsSerialItem', 'IsLOTItem', 'ItemId', 'AvailableQuantity', 'UnitCost', 'PartNumber', 'Tax', 'AdjustmentConditionId', 'AdjustmentCondition', 'Name', 'Code', 'MeasurementUnit', 'Quantity'],

            remoteSort: true
        }),
        id: 'adjustment-detailGrid',
        clicksToEdit: 1,
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: true,
        height: 300,
        currentRecord: '',
        serialStore: new Ext.data.Store(),
        lOTStore: new Ext.data.Store(),
        sm: Ext.erp.ux.common.SelectionModel,

        viewConfig: {
            forceFit: true
        },
        listeners: {
            beforeLoad: function () {
                Ext.getCmp('adjustment-detailGrid').body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
                Ext.getCmp('adjustment-detailGrid').body.unmask();
            },
            loadException: function () {
                Ext.getCmp('adjustment-detailGrid').body.unmask();
            },
            rowClick: function (grid, index) {
                var detailGrid = Ext.getCmp('adjustment-detailGrid');
                var currentRecord = detailGrid.getStore().getAt(index);
                detailGrid.currentRecord = currentRecord;
            },
            afteredit: function (e) {
               
            }    
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
                           '<p><h6 class="w3-text-teal w3-small "><span>' + '{Name}' + '</span></h6></p>' +
                           '<p><h6 class="w3-text-teal w3-small "><span>' + '{Code}' + '-' + '{PartNumber}' + '</span></h6></p>' +
                       '</span></div></tpl>', store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'Name', 'Code', 'PartNumber', 'MeasurementUnit', 'IsSerialItem', 'IsLOTItem']
                            }),
                            api: { read: Psms.GetItemBySearch }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        listeners: {

                            select: function (combo, record, index) {

                                var detailDrid = Ext.getCmp('adjustment-detailGrid');
                                var selectedrecord = detailDrid.getSelectionModel().getSelected();
                                selectedrecord.set('ItemId', record.get("Id"));
                                selectedrecord.set('Code', record.get("Code"));
                                selectedrecord.set('MeasurementUnit', record.get("MeasurementUnit"));
                                selectedrecord.set('IsSerialItem', record.get("IsSerialItem"));
                                selectedrecord.set('PartNumber', record.get("PartNumber"));                               
                                selectedrecord.set('IsLOTItem', record.get("IsLOTItem"));
                                selectedrecord.set('DamagedQuantity',0);

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
                },  {
                    dataIndex: 'Quantity',
                    header: 'Adjustmented Qty',
                    sortable: true,
                    width: 80,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000.00 ');
                    },
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: false
                    }
                }, {
                    dataIndex: 'UnitCost',
                    header: 'Unit Cost',
                    sortable: true,
                    width: 80,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000.00 ');
                    },
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: false
                    }
                },]
        })
    }, config));
}
Ext.extend(Ext.erp.ux.adjustment.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };

        this.tbar = [
            {
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: false,
                handler: function () {
                    var detailDrid = Ext.getCmp('adjustment-detailGrid');
                    var store = detailDrid.getStore();

                    var defaultData = {
                        Tax: 0,
                        Quantity: 0,
                        RemainingQuantity: 0,
                        DamagedQuantity:0,
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
                    var grid = Ext.getCmp('adjustment-detailGrid');

                    if (!grid.getSelectionModel().hasSelection())
                        adjustment;

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
                    var detailGrid = Ext.getCmp('adjustment-detailGrid');
                    var storeId = Ext.getCmp('adjustment-form').getForm().findField("StoreId").getValue();

                    new Ext.erp.ux.itemPicker.Window({
                        targetGrid: detailGrid,
                        storeId: storeId
                    }).show();
                }
            },

        ]
        this.bbar = []

        Ext.erp.ux.adjustment.GridDetail.superclass.initComponent.apply(this, arguments);
    },
    onSerialLOtClick: function () {

        var detailDrid = Ext.getCmp('adjustment-detailGrid');
        var currentRecord = detailDrid.currentRecord;
        var storeId = Ext.getCmp('adjustment-form').getForm().findField("StoreId").getValue();
        var itemId = currentRecord.get("ItemId");
        var Quantity = currentRecord.get("Quantity");
        if (Quantity < 0) {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "Adjustmented Quantity must be greater than 0",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            adjustment;

        }
        if (currentRecord.get("IsSerialItem")) {
            new Ext.erp.ux.itemSerialSelector.Window({
                title: 'Add Item Serials',
                itemStore: detailDrid.serialStore.query("ItemId", itemId),
                targetGrid: detailDrid,
                storeId: storeId,
                itemId: itemId,
                issuedQuantity: Quantity
            }).show();
        }
        else if (currentRecord.get("IsLOTItem")) {
            new Ext.erp.ux.itemLOTSelector.Window({
                title: 'Add Item LOT',
                itemStore: detailDrid.lOTStore.query("ItemId", itemId),
                targetGrid: detailDrid,
                storeId: storeId,
                itemId: itemId,
                issuedQuantity: Quantity
            }).show();
        }
    },
    afterRender: function () {

        Ext.erp.ux.adjustment.GridDetail.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('adjustment-detailGrid', Ext.erp.ux.adjustment.GridDetail);

/* @desc     adjustmentOrder form host window
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date     September 2013
* @namespace Ext.erp.ux.adjustmentOrder
* @class     Ext.erp.ux.adjustmentOrder.Window
* @extends   Ext.Window
*/

Ext.erp.ux.adjustment.Window = function (config) {
    Ext.erp.ux.adjustment.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 800,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'adjustment-window',
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
   
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.adjustmentHeaderId);
                if (typeof this.adjustmentHeaderId != "undefined" && this.adjustmentHeaderId != "") {
                    this.form.load({
                        waitMsg: 'Loading...',
                        params: { id: this.adjustmentHeaderId },
                        success: function (form, action) {
                            var grid = Ext.getCmp('adjustment-detailGrid');
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
                                    Description: item.Description,
                                    PlateNo: item.PlateNo,
                                    IsAvailable: item.IsAvailable,
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
                            var form = Ext.getCmp('adjustment-form');
                            
                        }
                    });
                    var grid = Ext.getCmp('adjustment-detailGrid');
                    var store = grid.getStore();
                    store.baseParams = { record: Ext.encode({ voucherHeaderId: this.adjustmentHeaderId, action: "storeAdjustment" }) };

                    grid.getStore().reload({
                        params: {
                            start: 0,
                            limit: grid.pageSize
                        }
                    });
                }
                else
                {
                    this.form.loadDocument();
                }

            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.ux.adjustment.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.adjustment.Form();
        this.grid = new Ext.erp.ux.adjustment.GridDetail();
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
        Ext.erp.ux.adjustment.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var grid = Ext.getCmp('adjustment-detailGrid');
        var store = grid.getStore();
        var rec = '', serialRec = '', lotRec = '';; var errorMesssage = "";
        var serialStore = grid.serialStore;
        var lOTStore = grid.lOTStore;
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
                    errorMesssage = "Adjustmented Quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "           Adjustmented Quantity";
            }

            if (item.get('IsSerialItem') && item.get('Quantity') != serialStore.query("ItemId", item.get('ItemId')).length) {
                if (errorMesssage == "")
                    errorMesssage = "Total Adjustmented quantity should be equal to number of serials added";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Total adjustmented quantity should be equal to number of serials added";

            }
            if (item.get('IsLOTItem') && item.get('Quantity') != serialStore.query("ItemId", item.get('ItemId')).sum('Quantity')) {
                if (errorMesssage == "")
                    errorMesssage = "Total adjustmented quantity should be equal to total added LOT quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Total adjustmented quantity should be equal to total added LOT quantity";

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

                              item.data['AdjustmentHeaderId'] + ':' +
                              item.data['ItemId'] + ':' +
                              item.data['Quantity'] + ':' +

                              item.data['UnitCost'] + ':' +


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
            adjustment;

        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
        var window = this;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ adjustmentDetails: rec, itemSerials: serialRec, itemLOTs: lotRec, action: this.action }) },

            success: function (form, action) {

                Ext.getCmp('adjustment-form').getForm().reset();
                Ext.getCmp('adjustment-detailGrid').getStore().removeAll();
                Ext.getCmp('adjustment-paging').doRefresh();

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
Ext.reg('adjustment-window', Ext.erp.ux.adjustment.Window);

/**
* @desc      Adjustment grid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.adjustment
* @class     Ext.erp.ux.adjustment.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.adjustment.Grid = function (config) {
    Ext.erp.ux.adjustment.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Adjustment.GetAllHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DESC'
            },
            fields: ['Id', 'VoucherNumber', 'Consumer', 'ConsumerType', 'AdjustmentedDate', 'PreparedBy', 'IsLastStep', 'StatusId', 'Status', 'AdjustmentedBy', 'Store', 'AdjustmentType'],
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
        id: 'adjustment-grid',
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
                if (record.get("Status") == "Received" || record.get("Status") == "Issued")
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
            dataIndex: 'AdjustmentedDate',
            header: 'Adjustment Date',
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
            dataIndex: 'AdjustmentType',
            header: 'Adjustment Type',
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
                id: 'adjustmentApproval',
                onTriggerClick: function (e) {
                    var grid = Ext.getCmp('adjustment-grid');
                    var selectedrecord = grid.getSelectionModel().getSelected();
                    var id = selectedrecord.get('Id');
                    var position = Ext.getCmp('adjustmentApproval').getPosition(false);
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
Ext.extend(Ext.erp.ux.adjustment.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [{
            id: 'searchAdjustment',
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearchVoucher
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Adjustment', 'CanAdd'),
            handler: this.onAdd
        },{
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Adjustment', 'CanEdit'),
     
            handler: this.onEdit
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Adjust',
            iconCls: 'icon-accept',
            disabled: !Ext.erp.ux.Reception.getPermission('Adjustment', 'CanApprove'),
            handler: this.onIssue
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Void',
            iconCls: 'icon-delete',
            disabled: !Ext.erp.ux.Reception.getPermission('Adjustment', 'CanDelete'),
            handler: this.onDelete
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Revise',
            iconCls: 'icon-accept',
            disabled: !Ext.erp.ux.Reception.getPermission('Adjustment', 'CanEdit'),
            handler: this.onRevise
        }, {
            xtype: 'button',
            text: 'Preview',
            id: 'preview-Adjustment',
            hidden: false,
            iconCls: 'icon-preview',
            handler: this.onPreview
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'adjustment-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.adjustment.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {

        var grid = Ext.getCmp('adjustment-grid');
        if (!grid.getSelectionModel().hasSelection()) adjustment;

        var voucherId = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        window.open('Reports/ErpReportViewer.aspx?rt=PreviewStoreAdjustment&id=' + voucherId, 'PreviewIV', parameter);

    },
    onAdd: function () {
           new Ext.erp.ux.adjustment.Window({
            title: 'Add Adjustment',
            action: 'allAtOnce'
        }).show();
    },
    onEdit: function () {
        var grid = Ext.getCmp('adjustment-grid');
        if (!grid.getSelectionModel().hasSelection()) adjustment;
        var id = grid.getSelectionModel().getSelected().get('Id');
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
        new Ext.erp.ux.adjustment.Window({
            title: 'Edit Adjustment',
            adjustmentHeaderId: id,
            action: 'edit'
        }).show();
    },
    onRevise: function () {
        var grid = Ext.getCmp('adjustment-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var status = grid.getSelectionModel().getSelected().get('Status');
     
        if (status == "Issued" || status == "Received") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: " Issued or received transaction are  not be revised, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.ux.adjustment.Window({
            title: 'Revise Adjustment',
            adjustmentHeaderId: id,
            action: 'revise'
        }).show();
    },
    onIssue: function () {
        var grid = Ext.getCmp('adjustment-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var storeId = grid.getSelectionModel().getSelected().get('StoreId');
        var isLastStep = grid.getSelectionModel().getSelected().get('IsLastStep');
        var Status = grid.getSelectionModel().getSelected().get('Status');

        if (isLastStep == false || Status == "Received" || Status == "Issued") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "please authorization step is remain or already adjusted, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.erp.ux.adjustment.Window({
            title: 'Adjustment',
            adjustmentHeaderId: id,
            storeId: storeId,
            action: 'issue'
        }).show();
    },
    onDelete: function () {
        var grid = Ext.getCmp('adjustment-grid');
        if (!grid.getSelectionModel().hasSelection()) adjustment;
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
            adjustment;
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
                    Adjustment.Void(id, function (result) {
                        if (result.success) {
                            Ext.getCmp('adjustment-paging').doRefresh();
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
            var grid = Ext.getCmp('adjustment-grid');
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
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.adjustment.Grid.superclass.afterRender.apply(this, arguments);
    },

});
Ext.reg('adjustment-grid', Ext.erp.ux.adjustment.Grid);



/**
* @desc      adjustment panel
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @version   $Id: adjustment.js, 0.1
* @namespace Ext.erp.ux.adjustment
* @class     Ext.erp.ux.adjustment.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.adjustment.Panel = function (config) {
    Ext.erp.ux.adjustment.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.adjustment.Panel, Ext.Panel, {
    initComponent: function () {
        this.headerGrid = new Ext.erp.ux.adjustment.Grid();
   
        this.items = [this.headerGrid];

        Ext.erp.ux.adjustment.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('adjustment-panel', Ext.erp.ux.adjustment.Panel);

/**
* @desc      VoucherSearch form
* @namespace Ext.erp.ux.adjustment
* @class     Ext.erp.ux.adjustment.Form
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

Ext.erp.ux.adjustment.SearchForm = function (config) {
    Ext.erp.ux.adjustment.SearchForm.superclass.constructor.call(this, Ext.apply({
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'adjustmentSearch-form',
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
            name: 'AdjustmentNo',
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
Ext.extend(Ext.erp.ux.adjustment.SearchForm, Ext.form.FormPanel);
Ext.reg('adjustmentSearch-form', Ext.erp.ux.adjustment.SearchForm);

/**
* @desc      VoucherSearch form host window
* @namespace Ext.erp.ux.adjustment
* @class     Ext.erp.ux.adjustment.Window
* @extends   Ext.Window
*/
Ext.erp.ux.adjustment.Observable = new Ext.util.Observable();
Ext.erp.ux.adjustment.Observable.addEvents('searchvoucher');

Ext.erp.ux.adjustment.SearchWindow = function (config) {
    Ext.erp.ux.adjustment.SearchWindow.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.erp.ux.adjustment.SearchWindow, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.adjustment.SearchForm();
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
        Ext.erp.ux.adjustment.SearchWindow.superclass.initComponent.call(this, arguments);
    },
    onFilter: function () {
        var form = Ext.getCmp('adjustmentSearch-form').getForm();
        var result = {};
        result['referenceNo'] = form.findField('VoucherNo').getValue();
        result['srNo'] = form.findField('SRNo').getValue();
        result['adjustmentNo'] = form.findField('AdjustmentNo').getValue();
        result['storeId'] = form.findField('StoreId').getValue();
        result['startDate'] = form.findField('StartDate').getValue();
        result['endDate'] = form.findField('EndDate').getValue();
        //result['transactionStatus'] = form.findField('TransactionStatus').getValue();
        Ext.erp.ux.adjustment.Observable.fireEvent('searchvoucher', result);
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('adjustmentSearch-window', Ext.erp.ux.adjustment.SearchWindow);