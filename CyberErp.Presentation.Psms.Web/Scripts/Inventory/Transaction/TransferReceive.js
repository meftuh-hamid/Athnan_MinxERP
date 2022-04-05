Ext.ns('Ext.erp.ux.transferReceive');

/**
* @desc      TransferReceive form
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.transferReceive
* @class     Ext.erp.ux.transferReceive.Form
* @extends   Ext.form.FormPanel
*/

Ext.erp.ux.transferReceive.Form = function (config) {
    Ext.erp.ux.transferReceive.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: TransferReceive.Get,
            submit: TransferReceive.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'transferReceive-form',
        frame: true,
        labelWidth: 130,
        padding: 5,
        autoHeight: false,
        border: false,
        loadDocument: function () {

            TransferReceive.GetDocumentNo(function (result) {
                var form = Ext.getCmp('transferReceive-form').getForm();
                form.findField('VoucherNumber').setValue(result.data.DocNo);
                form.findField('StatusId').setValue(result.data.StatusId);
                form.findField('PreparedById').setValue(result.data.EmployeeId);
                form.findField('ReceivedDate').setValue(new Date());
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
                    name: 'TransferIssueHeaderId',
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
                    readOnly: true,
                    allowBlank: true
                },  {
                    hiddenName: 'TransferIssueNumber',
                    xtype: 'combo',
                    fieldLabel: 'Transfer Issue Number',
                    typeAhead: false,
                    width: 100,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    emptyText: '---Type to Search---',
                    mode: 'remote',
                    allowBlank: true,
                    hidden: false,
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name','FromStoreId','FromStore','ToStore','ToStoreId']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetTransferIssueBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10,
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('transferReceive-form').getForm();
                            form.findField('TransferIssueHeaderId').setValue(rec.id);
                            form.findField('FromStoreId').setValue(rec.get('FromStoreId'));
                            form.findField('FromStore').setValue(rec.get('FromStore'));
                            form.findField('ToStoreId').setValue(rec.get('ToStoreId'));
                            form.findField('ToStore').setValue(rec.get('ToStore'));
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('transferReceive-form').getForm();
                                form.findField('TransferIssueHeaderId').reset();

                            }
                        }
                    }
                }, {
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
                            var form = Ext.getCmp('transferReceive-form').getForm();
                            form.findField('FromStoreId').setValue(rec.id);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('transferReceive-form').getForm();
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
                            var form = Ext.getCmp('transferReceive-form').getForm();
                            form.findField('ToStoreId').setValue(rec.id);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('transferReceive-form').getForm();
                                form.findField('ToStoreId').reset();

                            }
                        }
                    }
                }, {
                    name: 'ReceivedDate',
                    xtype: 'datefield',
                    fieldLabel: 'Received Date',
                    width: 100,
                    allowBlank: false,
                    value: new Date(),
                    maxValue: (new Date()).format('m/d/Y')
                }, ]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [
                    {
                        name: 'PlateNo',
                        xtype: 'textfield',
                        fieldLabel: 'Plate No',
                        readOnly: false,
                        hidden: true,
                        allowBlank: true
                    },
                   {
                       name: 'DriverName',
                       xtype: 'textfield',
                       fieldLabel: 'Driver',
                       readOnly: false,
                       hidden: true,
                       allowBlank: true
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
                       allowBlank: true,
                       hidden: true,
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
                               var form = Ext.getCmp('transferReceive-form').getForm();
                               form.findField('DeliveredById').setValue(rec.id);
                           },
                           change: function (cmb, newvalue, oldvalue) {
                               if (newvalue == "") {
                                   var form = Ext.getCmp('transferReceive-form').getForm();
                                   form.findField('DeliveredById').reset();

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
                    emptyText: '---Type to Search---',
                    mode: 'remote',
                    allowBlank: true,
                    hidden: true,
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
                            var form = Ext.getCmp('transferReceive-form').getForm();
                            form.findField('ReceivedById').setValue(rec.id);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('transferReceive-form').getForm();
                                form.findField('ReceivedById').reset();

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
Ext.extend(Ext.erp.ux.transferReceive.Form, Ext.form.FormPanel);
Ext.reg('transferReceive-form', Ext.erp.ux.transferReceive.Form);


/**
* @desc      TransferReceive detailGrid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.transferReceive
* @class     Ext.erp.ux.transferReceive.GridDetail
* @extends   Ext.grid.GridPanel
*/
var transferReceiveSelectionModel = new Ext.grid.CheckboxSelectionModel({
});
Ext.erp.ux.transferReceive.GridDetail = function (config) {
    Ext.erp.ux.transferReceive.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: TransferReceive.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            //  idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'TransferReceiveHeaderId', 'ItemId', 'PartNumber', 'UnitCost', 'Name', 'Code', 'MeasurementUnit', 'Quantity', 'TransferReceivedQuantity', 'RemainingQuantity'],

            remoteSort: true
        }),
        id: 'transferReceive-detailGrid',
        clicksToEdit: 1,
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: true,
        height: 250,
        sm: Ext.erp.ux.common.SelectionModel,

        viewConfig: {
            forceFit: true
        },
        listeners: {
            beforeLoad: function () {
                Ext.getCmp('transferReceive-detailGrid').body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
                Ext.getCmp('transferReceive-detailGrid').body.unmask();
            },
            loadException: function () {
                Ext.getCmp('transferReceive-detailGrid').body.unmask();
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
                        '<p><h6 class="w3-text-teal w3-small "><span> ' + '{Code}' + '-' + '{PartNumber}' + '</span></h6></p>' +
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
                                var form = Ext.getCmp('transferReceive-form').getForm();
                                var storeId = form.findField('FromStoreId').getValue();
                                var detailDrid = Ext.getCmp('transferReceive-detailGrid');
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

                                var detailDrid = Ext.getCmp('transferReceive-detailGrid');
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
                    dataIndex: 'TransferReceivedQuantity',
                    header: 'Received Qty',
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
Ext.extend(Ext.erp.ux.transferReceive.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.tbar = [
      {
          xtype: 'button',
          text: 'Add',
          iconCls: 'icon-add',
          disabled: false,
          hidden:true,
          handler: function () {
              var detailDrid = Ext.getCmp('transferReceive-detailGrid');
              var store = detailDrid.getStore();

              var defaultData = {
                  Tax: 0,
                  Quantity:0,
                  TransferReceivedQuantity: 0,
                  RemainingQuantity: 0,
                  DamagedQuantity: 0,
              };
              var records = new store.recordType(defaultData);
              store.add(records);
          }
      }, {
          xtype: 'tbseparator'
      }, {
          xtype: 'tbseparator'
      }, {
          xtype: 'button',
          text: 'Remove',
          iconCls: 'icon-exit',
          disabled: false,
          handler: function () {
              var grid = Ext.getCmp('transferReceive-detailGrid');

              if (!grid.getSelectionModel().hasSelection())
                  return;

              var selectedrecord = grid.getSelectionModel().getSelected();
              grid.getStore().remove(selectedrecord);
          }
      }, {
          xtype: 'tbfill'
      }, {
          xtype: 'button',
          text: 'Picker',
          iconCls: 'icon-accept',
          disabled: false,
          hidden: true,
          handler: function () {
              var detailGrid = Ext.getCmp('transferReceive-detailGrid');
              new Ext.erp.ux.itemPicker.Window({
                  targetGrid: detailGrid
              }).show();
          }
      }, ];
        this.bbar = []

        Ext.erp.ux.transferReceive.GridDetail.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        Ext.erp.ux.transferReceive.GridDetail.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('transferReceive-detailGrid', Ext.erp.ux.transferReceive.GridDetail);

/* @desc     transferReceiveOrder form host window
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date     September 2013
* @namespace Ext.erp.ux.transferReceiveOrder
* @class     Ext.erp.ux.transferReceiveOrder.Window
* @extends   Ext.Window
*/

Ext.erp.ux.transferReceive.Window = function (config) {
    Ext.erp.ux.transferReceive.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 700,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'transferReceive-window',
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.transferReceiveHeaderId);
                this.form.getForm().findField('TransferIssueHeaderId').setValue(this.transferIssueHeaderId);
                this.form.getForm().findField('StoreRequestNumber').setValue(this.storeRequestNumber);
                this.form.getForm().findField('TransferIssueNumber').setValue(this.transferIssueNumber);
                this.form.getForm().findField('DeliveredById').setValue(this.deliveredById);
                this.form.getForm().findField('DeliveredBy').setValue(this.deliveredBy);
                this.form.getForm().findField('ReceivedBy').setValue(this.receivedBy);
                this.form.getForm().findField('ReceivedById').setValue(this.receivedById);
                this.form.getForm().findField('FromStoreId').setValue(this.fromStoreId);
                this.form.getForm().findField('FromStore').setValue(this.fromStore);
                this.form.getForm().findField('ToStoreId').setValue(this.toStoreId);
                this.form.getForm().findField('ToStore').setValue(this.toStore);
                this.form.getForm().findField('DriverName').setValue(this.driverName);
                this.form.getForm().findField('PreparedById').setValue(this.transferIssuedById);
                this.form.getForm().findField('PlateNo').setValue(this.plateNo);


                if (typeof this.transferReceiveHeaderId != "undefined" && this.transferReceiveHeaderId != "")
                {
                    this.form.load({
                        waitMsg: 'Loading...',
                        params: { id: this.transferReceiveHeaderId }
                    });

                    var grid = Ext.getCmp('transferReceive-detailGrid');
                    var store = grid.getStore();
                    store.baseParams = { record: Ext.encode({ voucherHeaderId: this.transferReceiveHeaderId, action: "storeTransferReceive" }) };

                    grid.getStore().reload({
                        params: {
                            start: 0,
                            limit: grid.pageSize
                        }
                    });
                } else if (typeof this.transferIssueHeaderId != "undefined" && this.transferIssueHeaderId != "")
                {
                    Ext.getCmp('transferReceive-form').loadDocument();
                    var grid = Ext.getCmp('transferReceive-detailGrid');
                    var store = grid.getStore();
                    store.baseParams = { record: Ext.encode({ voucherHeaderId: this.transferIssueHeaderId, action: "storeTransferIssue" }) };

                    grid.getStore().reload({
                        params: {
                            start: 0,
                            limit: grid.pageSize
                        }
                    });
                }
            else
            {
                    Ext.getCmp('transferReceive-form').loadDocument();
            }
              
            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.ux.transferReceive.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.transferReceive.Form();
        this.grid = new Ext.erp.ux.transferReceive.GridDetail();
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
        Ext.erp.ux.transferReceive.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var grid = Ext.getCmp('transferReceive-detailGrid');
        var store = grid.getStore();
        var rec = ''; var errorMesssage = "";
        var selectedItems = grid.getSelectionModel().getSelections();
        var store = grid.getStore();
        
        store.each(function (item) {
            if (typeof item.get('TransferReceivedQuantity') == 'undefined' || item.get('TransferReceivedQuantity') < 0) {
                if (errorMesssage == "")
                    errorMesssage = "Received Quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Transfer Received Quantity";
            }
            //else if (item.get('TransferReceivedQuantity') > item.get('RemainingQuantity')) {
            //    if (errorMesssage == "")
            //        errorMesssage = "Received Quantity";
            //    else
            //        errorMesssage = errorMesssage + "</br>" + "          Received Quantity should not be greater than remaining quantity";
            //}

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

                              item.data['TransferReceiveHeaderId'] + ':' +
                              item.data['ItemId'] + ':' +
                              item.data['Quantity'] + ':' +
                              item.data['TransferReceivedQuantity'] + ':' +
                              item.data['RemainingQuantity'] + ':' +
                              item.data['StatusId'] + ':' +
                              item.data['UnitCost'] + ':' +
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
        var window = this;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ transferReceiveDetails: rec,action:this.action }) },

            success: function (form, action) {

                Ext.getCmp('transferReceive-form').getForm().reset();
                Ext.getCmp('transferReceive-detailGrid').getStore().removeAll();
                Ext.getCmp('transferReceive-paging').doRefresh();
                Ext.getCmp('transferReceiveTransferIssue-paging').doRefresh();

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
Ext.reg('transferReceive-window', Ext.erp.ux.transferReceive.Window);

/**
* @desc      TransferReceive grid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.transferReceive
* @class     Ext.erp.ux.transferReceive.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.transferReceive.Grid = function (config) {
    Ext.erp.ux.transferReceive.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: TransferReceive.GetAllHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DESC'
            },
            fields: ['Id', 'VoucherNumber', 'ReceivedDate', 'StatusId', 'Status','TransferoutNo', 'ReceivedBy', 'PreparedBy','IsLastStep', 'FromStoreId', 'ToStoreId','FromStore', 'ToStore','Remark'],
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
        id: 'transferReceive-grid',
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
                if (record.get("Status") == "Received")
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
            dataIndex: 'TransferoutNo',
            header: 'Transfer out Number',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ReceivedDate',
            header: 'Receive Date',
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
                id: 'transferReceiveApproval',
                onTriggerClick: function (e) {
                    var grid = Ext.getCmp('transferReceive-grid');
                    var selectedrecord = grid.getSelectionModel().getSelected();
                    var id = selectedrecord.get('Id');
                    var position = Ext.getCmp('transferReceiveApproval').getPosition(false);
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
Ext.extend(Ext.erp.ux.transferReceive.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({  }) };
        this.tbar = [{
            id: 'searchTransferReceive',
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearchVoucher
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            hidden:true,
            disabled: !Ext.erp.ux.Reception.getPermission('Transfer Receive', 'CanAdd'),
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
            text: 'Receive',
            iconCls: 'icon-accept',
            disabled: !Ext.erp.ux.Reception.getPermission('Transfer Receive', 'CanEdit'),
            handler: this.onReceive
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Void',
            iconCls: 'icon-delete',
            disabled: !Ext.erp.ux.Reception.getPermission('Transfer Receive', 'CanDelete'),
            handler: this.onDelete
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Revise',
            iconCls: 'icon-accept',
            hidden:true,
            disabled: !Ext.erp.ux.Reception.getPermission('Transfer Receive', 'CanEdit'),
            handler: this.onRevise
        }, {
            xtype: 'button',
            text: 'Preview',
            id: 'preview-TransferReceive',
            hidden: false,
            iconCls: 'icon-preview',
            handler: this.onPreview
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'transferReceive-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.transferReceive.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {

        var grid = Ext.getCmp('transferReceive-grid');
        if (!grid.getSelectionModel().hasSelection()) return;

        var voucherId = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        window.open('Reports/ErpReportViewer.aspx?rt=PreviewTransferReceive&id=' + voucherId, 'PreviewIV', parameter);

    },
    onAdd: function () {
        new Ext.erp.ux.transferReceive.Window({
            title: 'Add Transfer Receive',
            action: 'add'
        }).show();
    },
    onEdit: function () {
        var grid = Ext.getCmp('transferReceive-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var Status = grid.getSelectionModel().getSelected().get('Status');

        if (Status != "Posted") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "only posted status transfer receive is editable, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.erp.ux.transferReceive.Window({
            title: 'Edit Transfer Receive',           
            transferReceiveHeaderId: id,
            action:'edit'
        }).show();
    },
    onRevise: function () {
        var grid = Ext.getCmp('transferReceive-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var status = grid.getSelectionModel().getSelected().get('Status');
        if (status == "Received") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: " received transaction are  not be revised, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.ux.transferReceive.Window({
            title: 'Revise Transfer In',
            transferReceiveHeaderId: id,
            action: 'revise'
        }).show();
    },
    onReceive: function () {
        var grid = Ext.getCmp('transferReceive-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var storeId = grid.getSelectionModel().getSelected().get('ToStoreId');
        var isLastStep = grid.getSelectionModel().getSelected().get('IsLastStep');
        var Status = grid.getSelectionModel().getSelected().get('Status');

        if (isLastStep == false || Status == "Received") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "please authorization step is remain or already received, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.erp.ux.transferReceive.Window({
            title: 'Transfer Receive',
            transferReceiveHeaderId: id,
            toStoreId: storeId,
            action: 'receive'
        }).show();
    },
    onDelete: function () {
        var grid = Ext.getCmp('transferReceive-grid');
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
                    TransferReceive.Void(id, function (result) {
                        if (result.success) {
                            Ext.getCmp('transferReceive-paging').doRefresh();
                            Ext.getCmp('transferReceiveTransferIssue-paging').doRefresh();

                            
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
        Ext.erp.ux.voucherSearch.Observable.on('searchVoucher1', function (result) {
            result['mode'] = 'search';
            var grid = Ext.getCmp('transferReceive-grid');
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.voucherSearch.Window({ title: 'Search Transfer Receive', action: 'searcVoucher1' }).show();
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.ux.transferReceive.Grid.superclass.afterRender.apply(this, arguments);
    }

});
Ext.reg('transferReceive-grid', Ext.erp.ux.transferReceive.Grid);




/**
* @desc     transferReceive grid
* @author   Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.transferReceive
* @class     Ext.erp.ux.transferReceive.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.transferReceive.TransferIssueGrid = function (config) {
    Ext.erp.ux.transferReceive.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: TransferReceive.GetAllTransferIssueHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DESC'
            },
            fields: ['Id', 'StoreId', 'FromStoreId', 'ToStoreId', 'FromStore', 'ToStore', 'RequestedDate', 'DriverName', 'TransferIssuedById', 'PlateNo', 'IssuedDate', 'VoucherNumber', 'StoreRequestNumber', 'ReceivedBy', 'ReceivedById', 'DeliveredById', 'DeliveredBy', 'IssuedBy', 'ConsumerType', 'Consumer', 'Requester', 'IsRedirected', 'StatusId', 'Status', 'IsReceived'],
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
        id: 'transferReceiveTransferIssue-grid',
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
            rowclick: function (grid, rowIndex, e) {

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
            header: 'SIV No',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'IssuedDate',
            header: 'Issued Date',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'StoreRequestNumber',
            header: 'SRV No',
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
            dataIndex: 'IssuedBy',
            header: 'Issued By',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'FromStore',
            header: 'From Store',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'ToStore',
            header: 'To Store',
            sortable: true,
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
            dataIndex: 'Requester',
            header: 'Requested By',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'ReceivedBy',
            header: 'ReceivedBy By',
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
Ext.extend(Ext.erp.ux.transferReceive.TransferIssueGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [
            {
                id: 'searchTransferIssue',
                text: 'Search',
                iconCls: 'icon-filter',
                handler: this.onSearchVoucher
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: !Ext.erp.ux.Reception.getPermission('Transfer Receive', 'CanAdd'),
                handler: this.onAdd
            }];
        this.bbar = new Ext.PagingToolbar({
            id: 'transferReceiveTransferIssue-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.transferReceive.TransferIssueGrid.superclass.initComponent.apply(this, arguments);
    },
    onSearchVoucher: function () {
        Ext.erp.ux.voucherSearch.Observable.on('searchvoucher', function (result) {
            result['mode'] = 'search';
            var grid = Ext.getCmp('transferReceiveTransferIssue-grid');
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.voucherSearch.Window({ title: 'Search Transactions' }).show();
    },
    onAdd: function () {
        var grid = Ext.getCmp('transferReceiveTransferIssue-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var isReceived = grid.getSelectionModel().getSelected().get('IsReceived');
        if (isReceived ==true) {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "it is already received, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var storeRequestNumber = grid.getSelectionModel().getSelected().get('StoreRequestNumber');
        var transferIssueNumber = grid.getSelectionModel().getSelected().get('VoucherNumber');

        var receivedBy = grid.getSelectionModel().getSelected().get('ReceivedBy');
        var receivedById = grid.getSelectionModel().getSelected().get('ReceivedById');
        var deliveredById = grid.getSelectionModel().getSelected().get('DeliveredById');
        var deliveredBy = grid.getSelectionModel().getSelected().get('DeliveredBy');

        var fromStoreId = grid.getSelectionModel().getSelected().get('FromStoreId');
        var fromStore = grid.getSelectionModel().getSelected().get('FromStore');
        var toStoreId = grid.getSelectionModel().getSelected().get('ToStoreId');
        var toStore = grid.getSelectionModel().getSelected().get('ToStore');

        var driverName = grid.getSelectionModel().getSelected().get('DriverName');
        var transferIssuedById = grid.getSelectionModel().getSelected().get('TransferIssuedById');
        var plateNo = grid.getSelectionModel().getSelected().get('PlateNo');
       
        new Ext.erp.ux.transferReceive.Window({
            title: 'Add Transfer Receive',
            transferIssueHeaderId: id,
            transferIssueNumber: transferIssueNumber,
            storeRequestNumber: storeRequestNumber,
            deliveredById: deliveredById,
            deliveredBy:deliveredBy,
            receivedBy: receivedBy,
            receivedById:receivedById,
            fromStoreId: fromStoreId,
            fromStore: fromStore,
            toStoreId: toStoreId,
            toStore: toStore,
            driverName: driverName,
            transferIssuedById: transferIssuedById,
            plateNo:plateNo,
            action: 'add'
        }).show();
    },
    customRenderer: function (value, metaData, record, rowIndex, colIndex, store) {

        if (record.get("IsReceived") == true)
            return '<span style=color:green>' + value + '</span>';
           else
            return '<span style=color:black>' + value + '</span>';


    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.ux.transferReceive.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('transferReceiveTransferIssue-grid', Ext.erp.ux.transferReceive.TransferIssueGrid);

/**
* @desc      transferReceive panel
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @version   $Id: transferReceive.js, 0.1
* @namespace Ext.erp.ux.transferReceive
* @class     Ext.erp.ux.transferReceive.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.transferReceive.Panel = function (config) {
    Ext.erp.ux.transferReceive.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.transferReceive.Panel, Ext.Panel, {
    initComponent: function () {
        this.headerGrid = new Ext.erp.ux.transferReceive.Grid();
        this.transferIssueGrid = new Ext.erp.ux.transferReceive.TransferIssueGrid();

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
                items: [this.transferIssueGrid]
            }, {
                region: 'center',
                border: false,
                layout: 'fit',
                items: [this.headerGrid]
            }]
        }];

        Ext.erp.ux.transferReceive.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('transferReceive-panel', Ext.erp.ux.transferReceive.Panel);
