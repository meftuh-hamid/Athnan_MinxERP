Ext.ns('Ext.erp.ux.purchaseRequest');

/**
* @desc      PurchaseRequest form
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.purchaseRequest
* @class     Ext.erp.ux.purchaseRequest.Form
* @extends   Ext.form.FormPanel
*/

Ext.erp.ux.purchaseRequest.Form = function (config) {
    Ext.erp.ux.purchaseRequest.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: PurchaseRequest.Get,
            submit: PurchaseRequest.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'purchaseRequest-form',
        frame: true,
        labelWidth: 130,
        padding: 5,
        autoHeight: false,
        border: false,

        loadDocument: function () {

            PurchaseRequest.GetDocumentNo(function (result) {
                var form = Ext.getCmp('purchaseRequest-form').getForm();
                form.findField('VoucherNumber').setValue(result.data.DocNo);
                form.findField('StatusId').setValue(result.data.StatusId);
                form.findField('PreparedById').setValue(result.data.EmployeeId);
                form.findField('RequestedById').setValue(result.data.EmployeeId);
                form.findField('RequestedBy').setValue(result.data.Employee);
                form.findField('RequestedDate').setValue(new Date());
                form.findField('FiscalYearId').setValue(result.data.FiscalYearId);


            });


        },
        SetConsumer:function(){
            var form = Ext.getCmp('purchaseRequest-form').getForm();
            var consumerType=form.findField('ConsumerType').getValue();

            //if Customer type is Store
            if (consumerType == 'Store') {
                form.findField('compositeEmployee').hide();
                form.findField('compositeUnit').hide();
                form.findField('compositeStore').show();

                form.findField('ConsumerStore').allowBlank = false;
                form.findField('ConsumerEmployee').allowBlank = true;
                form.findField('ConsumerUnit').allowBlank = true;

                form.findField('ConsumerEmployee').setValue('');
                form.findField('ConsumerEmployeeId').setValue('');
                form.findField('ConsumerUnit').setValue('');
                form.findField('ConsumerUnitId').setValue('');
            }
                //if Customer type is employee
            else if (consumerType == 'Employee') {
                form.findField('compositeEmployee').show();
                form.findField('compositeStore').hide();
                form.findField('compositeUnit').hide();
                form.findField('ConsumerStore').allowBlank = true;
                form.findField('ConsumerEmployee').allowBlank = false;
                form.findField('ConsumerUnit').allowBlank = true;


                form.findField('ConsumerUnit').setValue('');
                form.findField('ConsumerUnitId').setValue('');
                form.findField('ConsumerStore').setValue('');
                form.findField('ConsumerStoreId').setValue('');
            } //if Customer type is unit
            else if (consumerType == 'Unit') {
                form.findField('compositeEmployee').hide();
                form.findField('compositeUnit').show();
                form.findField('compositeStore').hide();
                form.findField('ConsumerStore').allowBlank = true;
                form.findField('ConsumerEmployee').allowBlank = true;
                form.findField('ConsumerUnit').allowBlank = false;


                form.findField('ConsumerEmployee').setValue('');
                form.findField('ConsumerEmployeeId').setValue('');
                form.findField('ConsumerStore').setValue('');
                form.findField('ConsumerStoreId').setValue('');
            }
            else {
                form.findField('compositeEmployee').hide();
                form.findField('compositeStore').hide();
                form.findField('compositeUnit').hide();
                form.findField('ConsumerStore').allowBlank = true;
                form.findField('ConsumerEmployee').allowBlank = true;
                form.findField('ConsumerUnit').allowBlank = true;

                form.findField('ConsumerEmployee').setValue('');
                form.findField('ConsumerEmployeeId').setValue('');
                form.findField('ConsumerUnit').setValue('');
                form.findField('ConsumerUnitId').setValue('');
                form.findField('ConsumerStore').setValue('');
                form.findField('ConsumerStoreId').setValue('');
            }
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
                }, {
                    name: 'AssignedEmployeeId',
                    xtype: 'hidden'
                },{
                    name: 'PurchaseOrderId',
                    xtype: 'hidden'
                }, {
                    name: 'RequestOrderHeaderId',
                    xtype: 'hidden'
                }, {
                    name: 'ConsumerTypeId',
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
                    name: 'CertifiedById',
                    xtype: 'hidden'
                }, {
                    name: 'ApprovedById',
                    xtype: 'hidden'
                }, {
                    name: 'RequestedById',
                    xtype: 'hidden'
                },  {
                    name: 'StoreId',
                    xtype: 'hidden'
                }, {
                    name: 'RequestTypeId',
                    xtype: 'hidden'
                }, {
                    name: 'PurchaseTypeId',
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
                            var form = Ext.getCmp('purchaseRequest-form').getForm();
                            form.findField('StoreId').setValue(rec.id);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('purchaseRequest-form').getForm();
                                form.findField('StoreId').reset();

                            }
                        }
                    }
                }, {
                    name: 'RequestedDate',
                    xtype: 'datefield',
                    fieldLabel: 'Request Date',
                    width: 100,
                    allowBlank: false,
                    value: new Date(),
                }, {
                    name: 'RequiredDate',
                    xtype: 'datefield',
                    fieldLabel: 'Required Date',
                    width: 100,
                    allowBlank: false,
                    value: new Date(),
                },
                 {
                hiddenName: 'RequestType',
                xtype: 'combo',
                fieldLabel: 'Request Type',
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
                    api: { read: Psms.GetPurchaseRequestType }
                }),
                valueField: 'Id',
                displayField: 'Name' ,
                listeners: {
                    select: function (cmb, rec, idx) {
                        var form = Ext.getCmp('purchaseRequest-form').getForm();
                        form.findField("RequestTypeId").setValue(rec.id);
                    },
                }
                }, 
               ]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [
                      {
                          hiddenName: 'ConsumerType',
                          xtype: 'combo',
                          fieldLabel: 'Consumer Type',
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
                              api: { read: Psms.GetConsumerType }
                          }),
                          valueField: 'Name',
                          displayField: 'Name',
                          listeners: {
                              scope: this,
                              select: function (cmb, rec) {
                                  var form = Ext.getCmp('purchaseRequest-form').getForm();
                                  form.findField("ConsumerTypeId").setValue(rec.id);

                                  Ext.getCmp('purchaseRequest-form').SetConsumer();

                              }
                          }
                      }, {
                          xtype: 'hidden',
                          name: 'ConsumerStoreId'
                      }, {
                          xtype: 'compositefield',
                          name: 'compositeStore',
                          fieldLabel: 'Consumer Store',
                          hidden: true,
                          defaults: {
                              flex: 1
                          },
                          items: [{
                              name: 'ConsumerStore',
                              xtype: 'textfield',
                              fieldLabel: 'Consumer',
                              readonly: true,
                              allowBlank: true
                          }, {
                              xtype: 'button',
                              id: 'findStore',
                              iconCls: 'icon-filter',
                              width: 20,
                              handler: function () {
                                  var form = Ext.getCmp('purchaseRequest-form').getForm();
                                  new Ext.erp.ux.common.StoreWindow({
                                      parentForm: form,
                                      controlIdField: 'ConsumerStoreId',
                                      controlNameField: 'ConsumerStore'
                                  }).show();
                              }
                          }]
                      }, {
                          xtype: 'hidden',
                          name: 'ConsumerUnitId'
                      }, {
                          xtype: 'compositefield',
                          name: 'compositeUnit',
                          fieldLabel: 'Consumer Department',
                          hidden: true,
                          defaults: {
                              flex: 1
                          },
                          items: [{
                              name: 'ConsumerUnit',
                              xtype: 'textfield',
                              fieldLabel: 'Consumer',
                              readonly: true,
                              allowBlank: true
                          }, {
                              xtype: 'button',
                              id: 'findUnit',
                              iconCls: 'icon-filter',
                              width: 20,
                              handler: function () {
                                  var form = Ext.getCmp('purchaseRequest-form').getForm();
                                  new Ext.erp.ux.common.UnitWindow({
                                      parentForm: form,
                                      controlIdField: 'ConsumerUnitId',
                                      controlNameField: 'ConsumerUnit'
                                  }).show();
                              }
                          }]
                      }, {
                          xtype: 'hidden',
                          name: 'ConsumerEmployeeId'
                      }, {
                          xtype: 'compositefield',
                          name: 'compositeEmployee',
                          fieldLabel: 'Consumer Employee',
                          hidden: true,
                          defaults: {
                              flex: 1
                          },
                          items: [ {
                              hiddenName: 'ConsumerEmployee',
                              xtype: 'combo',
                              fieldLabel: 'Employee',
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
                                      var form = Ext.getCmp('purchaseRequest-form').getForm();
                                      form.findField('ConsumerEmployeeId').setValue(rec.id);
                                  },
                                  change: function (cmb, newvalue, oldvalue) {
                                      if (newvalue == "") {
                                          var form = Ext.getCmp('purchaseRequest-form').getForm();
                                          form.findField('ConsumerEmployeeId').reset();

                                      }
                                  }
                              }
                          }, ]
                      }, {
                        name: 'StoreRequestNo',
                        xtype: 'textfield',
                        fieldLabel: 'Store Request Number',
                        readonly: true,
                        disabled:true,
                        allowBlank: true
                    }, {
                        hiddenName: 'RequestedBy',
                        xtype: 'combo',
                        fieldLabel: 'Requested By',
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
                                var form = Ext.getCmp('purchaseRequest-form').getForm();
                                form.findField('RequestedById').setValue(rec.id);
                            },
                            change: function (cmb, newvalue, oldvalue) {
                                if (newvalue == "") {
                                    var form = Ext.getCmp('purchaseRequest-form').getForm();
                                    form.findField('RequestedById').reset();

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
Ext.extend(Ext.erp.ux.purchaseRequest.Form, Ext.form.FormPanel);
Ext.reg('purchaseRequest-form', Ext.erp.ux.purchaseRequest.Form);



/**
* @desc      PurchaseRequest detailGrid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.purchaseRequest
* @class     Ext.erp.ux.purchaseRequest.GridDetail
* @extends   Ext.grid.GridPanel
*/
var purchaseRequestSelectionModel = new Ext.grid.CheckboxSelectionModel({
});
Ext.erp.ux.purchaseRequest.GridDetail = function (config) {
    Ext.erp.ux.purchaseRequest.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PurchaseRequest.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'PurchaseRequestHeaderId', 'ItemId','PurchaseType', 'UnitId', 'MeasurementUnit', 'Name', 'Code', 'Quantity', 'RequestedQuantity', 'UnprocessedQuantity', 'BudgetedQuantity', 'RemainingQuantity', 'Remark'],

            remoteSort: true
        }),
        id: 'purchaseRequest-detailGrid',
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
                Ext.getCmp('purchaseRequest-detailGrid').body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
                Ext.getCmp('purchaseRequest-detailGrid').body.unmask();
            },
            loadException: function () {
                Ext.getCmp('purchaseRequest-detailGrid').body.unmask();
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
                        tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> {Code}</div></tpl>',
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'Name', 'Code','UnitId', 'MeasurementUnit']
                            }),
                            api: { read: Psms.GetItemBySearch }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        listeners: {

                            select: function (combo, record, index) {

                                var detailDrid = Ext.getCmp('purchaseRequest-detailGrid');
                                var selectedrecord = detailDrid.getSelectionModel().getSelected();
                                selectedrecord.set('ItemId', record.get("Id"));
                                selectedrecord.set('UnitId', record.get("UnitId"));
                                selectedrecord.set('Code', record.get("Code"));
                                selectedrecord.set('MeasurementUnit', record.get("MeasurementUnit"));
                                
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
                    menuDisabled: true,
                    editor: new Ext.form.ComboBox({
                        hiddenName: 'MeasurementUnit',
                        xtype: 'combo',
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
                            api: { read: Psms.GetMeasurementUnit }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        listeners: {

                            select: function (combo, record, index) {

                                var detailDrid = Ext.getCmp('purchaseRequest-detailGrid');
                                var selectedrecord = detailDrid.getSelectionModel().getSelected();
                                selectedrecord.set('UnitId', record.get("Id"));
                            }
                        }
                    })
                }, {
                    dataIndex: 'RemainingQuantity',
                    header: 'Remaining Qty',
                    sortable: true,
                    width: 70,
                    hidden: false,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000.00 ');
                    }
                }, {
                    dataIndex: 'Quantity',
                    header: 'Qty',
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
                }, {
                    dataIndex: 'Remark',
                    header: 'Remark',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,
                    editor: {
                        xtype: 'textarea',
                        allowBlank: false
                    }
                }]
        })
    }, config));
}
Ext.extend(Ext.erp.ux.purchaseRequest.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };

        this.tbar = [
            {
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: false,
                handler: function () {
                    var detailDrid = Ext.getCmp('purchaseRequest-detailGrid');
                    var store = detailDrid.getStore();

                    var defaultData = {
                        Remark:'',
                        Quantity: 0,
                        RequestedQuantity: 0,
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
                    var grid = Ext.getCmp('purchaseRequest-detailGrid');

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
                    var detailGrid = Ext.getCmp('purchaseRequest-detailGrid');
                    new Ext.erp.ux.itemPicker.Window({
                        targetGrid: detailGrid
                    }).show();
                }
            },

        ]
        this.bbar = []

        Ext.erp.ux.purchaseRequest.GridDetail.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        Ext.erp.ux.purchaseRequest.GridDetail.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('purchaseRequest-detailGrid', Ext.erp.ux.purchaseRequest.GridDetail);

/* @desc     purchaseRequestOrder form host window
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date     September 2013
* @namespace Ext.erp.ux.purchaseRequestOrder
* @class     Ext.erp.ux.purchaseRequestOrder.Window
* @extends   Ext.Window
*/

Ext.erp.ux.purchaseRequest.Window = function (config) {
    Ext.erp.ux.purchaseRequest.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 800,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'purchaseRequest-window',
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
   
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.purchaseRequestHeaderId);
                this.form.getForm().findField('RequestOrderHeaderId').setValue(this.requestOrderHeaderId);
                this.form.getForm().findField('StoreRequestNo').setValue(this.storeRequestNumber);

                this.form.getForm().findField('StoreId').setValue(this.storeId);
                this.form.getForm().findField('Store').setValue(this.store);
               
                this.form.getForm().findField('ConsumerTypeId').setValue(this.consumerTypeId);
                this.form.getForm().findField('ConsumerType').setValue(this.consumerType);
                if (this.consumerType == 'Store') {
                    this.form.getForm().findField('compositeEmployee').hide();
                    this.form.getForm().findField('compositeStore').show();
                    this.form.getForm().findField('compositeUnit').hide();
                    this.form.getForm().findField('ConsumerStoreId').setValue(this.consumerId);
                    this.form.getForm().findField('ConsumerStore').setValue(this.consumer);

                }
                if (this.consumerType == 'Employee') {
                    this.form.getForm().findField('compositeEmployee').show();
                    this.form.getForm().findField('compositeStore').hide();
                    this.form.getForm().findField('compositeUnit').hide();
                    this.form.getForm().findField('ConsumerEmployeeId').setValue(this.consumerId);
                    this.form.getForm().findField('ConsumerEmployee').setValue(this.consumer);

                }
                if (this.consumerType == 'Unit') {
                    this.form.getForm().findField('compositeEmployee').hide();
                    this.form.getForm().findField('compositeStore').hide();
                    this.form.getForm().findField('compositeUnit').show();
                    this.form.getForm().findField('ConsumerUnitId').setValue(this.consumerId);
                    this.form.getForm().findField('ConsumerUnit').setValue(this.consumer);

                }

                if (typeof this.purchaseRequestHeaderId != "undefined" && this.purchaseRequestHeaderId != "") {
                    this.form.load({
                        waitMsg: 'Loading...',
                        params: { id: this.purchaseRequestHeaderId },
                        success: function () {
                            Ext.getCmp('purchaseRequest-form').SetConsumer();

                        }
                    });
                    var grid = Ext.getCmp('purchaseRequest-detailGrid');
                    var store = grid.getStore();
                    store.baseParams = { record: Ext.encode({ voucherHeaderId: this.purchaseRequestHeaderId, action: "storePurchaseRequest" }) };

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

                    Ext.getCmp('purchaseRequest-form').loadDocument();
                    var grid = Ext.getCmp('purchaseRequest-detailGrid');
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
Ext.extend(Ext.erp.ux.purchaseRequest.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.purchaseRequest.Form();
        this.grid = new Ext.erp.ux.purchaseRequest.GridDetail();
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
        Ext.erp.ux.purchaseRequest.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var grid = Ext.getCmp('purchaseRequest-detailGrid');
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

                              item.data['PurchaseRequestHeaderId'] + ':' +
                              item.data['ItemId'] + ':' +
                              item.data['UnitId'] + ':' +
                              item.data['Quantity'] + ':' +
                              item.data['RemainingQuantity'] + ':' +
                              item.data['Name'] + ':' +
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
            params: { record: Ext.encode({ purchaseRequestDetails: rec, action: this.action }) },

            success: function (form, action) {

                Ext.getCmp('purchaseRequest-form').getForm().reset();
                Ext.getCmp('purchaseRequest-detailGrid').getStore().removeAll();
                Ext.getCmp('purchaseRequest-paging').doRefresh();

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
Ext.reg('purchaseRequest-window', Ext.erp.ux.purchaseRequest.Window);

/**
* @desc      PurchaseRequest grid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.purchaseRequest
* @class     Ext.erp.ux.purchaseRequest.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.purchaseRequest.Grid = function (config) {
    Ext.erp.ux.purchaseRequest.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PurchaseRequest.GetAllHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DESC'
            },
            fields: ['Id', 'VoucherNumber', 'AssignedEmployee', 'RequestedDate', 'IsLastStep', 'RequiredDate', 'StoreRequestNo', 'ConsumerType', 'Consumer', 'StatusId', 'Status', 'RequestedBy', 'Store', 'RequestType'],
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
        id: 'purchaseRequest-grid',
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
            dataIndex: 'IsLastStep',
            header: 'Status',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.get("IsLastStep") == true)
                    return '<img src="Content/images/app/yes.png"/>';
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
            header: 'Request Type',
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
            dataIndex: 'AssignedEmployee',
            header: 'Assigned Employee',
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
Ext.extend(Ext.erp.ux.purchaseRequest.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [{
            id: 'searchPurchaseRequest',
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearchVoucher
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Purchase Request', 'CanAdd'),
            handler: this.onAdd
        },{
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Purchase Request', 'CanEdit'),
     
            handler: this.onEdit
        },  {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Void',
            iconCls: 'icon-delete',
            disabled: !Ext.erp.ux.Reception.getPermission('Purchase Request', 'CanDelete'),
            handler: this.onDelete
        },{
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Assign',
            iconCls: 'icon-accept',
            disabled: !Ext.erp.ux.Reception.getPermission('Purchase Request', 'CanAdd'),
            handler: this.onAssign
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Send for Approval',
            iconCls: 'icon-accept',
            disabled: !Ext.erp.ux.Reception.getPermission('Purchase Request', 'CanEdit'),
            handler: this.onRevise
        }, {
            xtype: 'button',
            text: 'Preview',
            id: 'preview-PurchaseRequest',
            hidden: false,
            iconCls: 'icon-preview',
            handler: this.onPreview
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'purchaseRequest-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.purchaseRequest.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {

        var grid = Ext.getCmp('purchaseRequest-grid');
        if (!grid.getSelectionModel().hasSelection()) return;

       
        var voucherId = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        window.open('Reports/ErpReportViewer.aspx?rt=PreviewPurchaseRequest&id=' + voucherId, 'PreviewIV', parameter);

    },
    onAdd: function () {
           new Ext.erp.ux.purchaseRequest.Window({
            title: 'Add Purchase Request',
            action: 'Add'
        }).show();
    },
    onEdit: function () {
        var grid = Ext.getCmp('purchaseRequest-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var status = grid.getSelectionModel().getSelected().get('Status');
        if (status != "Posted") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "Only Posted transaction are certiefied, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.erp.ux.purchaseRequest.Window({
            title: 'Edit Purchase Request',
            purchaseRequestHeaderId: id,
            action: 'edit'
        }).show();
    },
    onRevise: function () {
        var grid = Ext.getCmp('purchaseRequest-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var status = grid.getSelectionModel().getSelected().get('Status');
     
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.ux.purchaseRequest.Window({
            title: 'Revise Purchase Request',
            purchaseRequestHeaderId: id,
            action: 'revise'
        }).show();
    },
    onDelete: function () {
        var grid = Ext.getCmp('purchaseRequest-grid');
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
                    PurchaseRequest.Void(id, function (result) {
                        if (result.success) {
                            Ext.getCmp('purchaseRequest-paging').doRefresh();
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
    onAssign: function () {
        var grid = Ext.getCmp('purchaseRequest-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var IsLastStep = grid.getSelectionModel().getSelected().get('IsLastStep');
        if (IsLastStep != true) {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "Only Approved transactions are assigned, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.erp.ux.employeeAssignement.Window({
            title: 'Assign Employee',
            voucherId: id,
          
        }).show();
    },
    onSearchVoucher: function () {
        Ext.erp.ux.voucherSearch.Observable.on('searchvoucher', function (result) {
            result['mode'] = 'search';
            var grid = Ext.getCmp('purchaseRequest-grid');
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.voucherSearch.Window({ title: 'Search Purchase Request' }).show();
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.ux.purchaseRequest.Grid.superclass.afterRender.apply(this, arguments);
    },

});
Ext.reg('purchaseRequest-grid', Ext.erp.ux.purchaseRequest.Grid);





/**
* @desc      purchaseRequest panel
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @version   $Id: purchaseRequest.js, 0.1
* @namespace Ext.erp.ux.purchaseRequest
* @class     Ext.erp.ux.purchaseRequest.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.purchaseRequest.Panel = function (config) {
    Ext.erp.ux.purchaseRequest.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.purchaseRequest.Panel, Ext.Panel, {
    initComponent: function () {
        this.headerGrid = new Ext.erp.ux.purchaseRequest.Grid();
    
        this.items = [this.headerGrid];

        Ext.erp.ux.purchaseRequest.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('purchaseRequest-panel', Ext.erp.ux.purchaseRequest.Panel);

/**
* @desc      VoucherSearch form
* @namespace Ext.erp.ux.purchaseRequest
* @class     Ext.erp.ux.purchaseRequest.Form
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

Ext.erp.ux.purchaseRequest.SearchForm = function (config) {
    Ext.erp.ux.purchaseRequest.SearchForm.superclass.constructor.call(this, Ext.apply({
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'purchaseRequestSearch-form',
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
            name: 'PurchaseRequestNo',
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
Ext.extend(Ext.erp.ux.purchaseRequest.SearchForm, Ext.form.FormPanel);
Ext.reg('purchaseRequestSearch-form', Ext.erp.ux.purchaseRequest.SearchForm);

/**
* @desc      VoucherSearch form host window
* @namespace Ext.erp.ux.purchaseRequest
* @class     Ext.erp.ux.purchaseRequest.Window
* @extends   Ext.Window
*/
Ext.erp.ux.purchaseRequest.Observable = new Ext.util.Observable();
Ext.erp.ux.purchaseRequest.Observable.addEvents('searchvoucher');

Ext.erp.ux.purchaseRequest.SearchWindow = function (config) {
    Ext.erp.ux.purchaseRequest.SearchWindow.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.erp.ux.purchaseRequest.SearchWindow, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.purchaseRequest.SearchForm();
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
        Ext.erp.ux.purchaseRequest.SearchWindow.superclass.initComponent.call(this, arguments);
    },
    onFilter: function () {
        var form = Ext.getCmp('purchaseRequestSearch-form').getForm();
        var result = {};
        result['referenceNo'] = form.findField('VoucherNo').getValue();
        result['srNo'] = form.findField('SRNo').getValue();
        result['purchaseRequestNo'] = form.findField('PurchaseRequestNo').getValue();
        result['storeId'] = form.findField('StoreId').getValue();
        result['startDate'] = form.findField('StartDate').getValue();
        result['endDate'] = form.findField('EndDate').getValue();
        //result['transactionStatus'] = form.findField('TransactionStatus').getValue();
        Ext.erp.ux.purchaseRequest.Observable.fireEvent('searchvoucher', result);
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('purchaseRequestSearch-window', Ext.erp.ux.purchaseRequest.SearchWindow);