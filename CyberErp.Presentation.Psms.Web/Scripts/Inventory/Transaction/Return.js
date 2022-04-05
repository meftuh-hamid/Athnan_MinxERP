Ext.ns('Ext.erp.ux.return');

/**
* @desc      Return form
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.return
* @class     Ext.erp.ux.return.Form
* @extends   Ext.form.FormPanel
*/

Ext.erp.ux.return.Form = function (config) {
    Ext.erp.ux.return.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Return.Get,
            submit: Return.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'return-form',
        frame: true,
        labelWidth: 130,
        padding: 5,
        autoHeight: false,
        border: false,
        loadDocument: function () {

            Return.GetDocumentNo(function (result) {
                var form = Ext.getCmp('return-form').getForm();
                form.findField('VoucherNumber').setValue(result.data.DocNo);
                form.findField('StatusId').setValue(result.data.StatusId);
                form.findField('ReturnedById').setValue(result.data.EmployeeId);
                form.findField('PreparedById').setValue(result.data.EmployeeId);

                form.findField('ReturnedBy').setValue(result.data.Employee);
                form.findField('PreparedBy').setValue(result.data.Employee);

                form.findField('ReturnedDate').setValue(new Date());
                form.findField('FiscalYearId').setValue(result.data.FiscalYearId);


            });


        },
        onReturnTypeChange:function(){
            var form = Ext.getCmp('return-form').getForm();
            returnType = form.findField('ReturnType').getRawValue();
            if(returnType=="To Supplier")
            {
                form.findField('InvoiceNo').setVisible(true);
                form.findField('Supplier').setVisible(true);
                form.findField('IssueNo').setVisible(false);

            }
            else if (returnType == "To Store") {
                form.findField('InvoiceNo').setVisible(false);
                form.findField('IssueNo').setVisible(true);
                form.findField('Supplier').setVisible(false);

            }
            else
            {
                form.findField('InvoiceNo').setVisible(false);
                form.findField('IssueNo').setVisible(false);
                form.findField('Supplier').setVisible(false);


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
                    name: 'ConsumerTypeId',
                    xtype: 'hidden'
                }, 
                    {
                    name: 'IssueHeaderId',
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
                    name: 'ReturnedById',
                    xtype: 'hidden'
                }, {
                    name: 'SupplierId',
                    xtype: 'hidden'
                }, {
                    name: 'StoreId',
                    xtype: 'hidden'
                }, {
                    name: 'ReturnTypeId',
                    xtype: 'hidden'
                }, {
                    name: 'CostCodeId',
                    xtype: 'hidden'
                }, {
                    name: 'ProductionOrderId',
                    xtype: 'hidden'
                }, {
                    name: 'ProductionPlanId',
                    xtype: 'hidden'
                }, {
                    name: 'VoucherNumber',
                    xtype: 'textfield',
                    fieldLabel: 'Voucher Number',
                    readOnly: false,
                    allowBlank: false
                }, {
                    hiddenName: 'ReturnType',
                    xtype: 'combo',
                    fieldLabel: 'Return Type',
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
                        api: { read: Psms.GetReturnType }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('return-form').getForm();
                            form.findField("ReturnTypeId").setValue(rec.id);
                            Ext.getCmp('return-form').onReturnTypeChange();
                        },
                    }
                }, {
                    hiddenName: 'Supplier',
                    xtype: 'combo',
                    fieldLabel: 'Supplier',
                    typeAhead: false,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    hidden:true,
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
                        api: { read: Psms.GetSupplierBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10, listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('return-form').getForm();
                            form.findField('SupplierId').setValue(rec.id);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('return-form').getForm();
                                form.findField('SupplierId').reset();

                            }
                        }
                    }
                }, {
                    name: 'InvoiceNo',
                    xtype: 'textfield',
                    fieldLabel: 'Invoice No',
                    readOnly: false,
                    hidden:true,
                    allowBlank: true
                }, {
                    hiddenName: 'IssueNo',
                    xtype: 'combo',
                    fieldLabel: 'Issue No',
                    typeAhead: false,
                    width: 100,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    hidden:true,
                    emptyText: '---Type to Search---',
                    mode: 'remote',
                    allowBlank: true,
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name', 'StoreId', 'Store', 'ConsumerTypeId', 'ConsumerType', 'ConsumerStoreId', 'ConsumerStore', 'ConsumerEmployeeId', 'ConsumerEmployee', 'ConsumerUnitId', 'ConsumerUnit']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetIssueBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10, listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('return-form').getForm();
                            form.findField('IssueHeaderId').setValue(rec.id);
                            form.findField('StoreId').setValue(rec.get('StoreId'));
                            form.findField('Store').setValue(rec.get('Store'));

                            form.findField('ConsumerTypeId').setValue(rec.get('ConsumerTypeId'));
                            form.findField('ConsumerType').setValue(rec.get('ConsumerType'));

                            form.findField('ConsumerStore').setValue(rec.get('ConsumerStore'));
                            form.findField('ConsumerStore').setValue(rec.get('ConsumerStore'));

                            form.findField('ConsumerEmployeeId').setValue(rec.get('ConsumerEmployeeId'));
                            form.findField('ConsumerEmployee').setValue(rec.get('ConsumerEmployee'));
                            form.findField('ConsumerUnitId').setValue(rec.get('ConsumerUnitId'));
                            form.findField('ConsumerUnitId').setValue(rec.get('ConsumerUnitId'));

                            var consumerType = rec.get('ConsumerType');




                            if (consumerType == 'Store') {
                                form.findField('compositeEmployee').hide();
                                form.findField('compositeStore').show();
                                form.findField('compositeUnit').hide();
                            }
                            if (consumerType == 'Employee') {
                                form.findField('compositeEmployee').show();
                                form.findField('compositeStore').hide();
                                form.findField('compositeUnit').hide();
                            }
                            if (consumerType == 'Unit') {
                                form.findField('compositeEmployee').hide();
                                form.findField('compositeStore').hide();
                                form.findField('compositeUnit').show();
                            }
                            var grid = Ext.getCmp('return-detailGrid');
                            var store = grid.getStore();
                            store.baseParams = { record: Ext.encode({ voucherHeaderId: rec.id, action: "issue" }) };
                            grid.getStore().reload({
                                params: {
                                    start: 0,
                                    limit: grid.pageSize
                                }
                            });
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('return-form').getForm();
                                form.findField('IssueHeaderId').reset();                               
                            }
                        }
                    }
                }, {
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
                            var form = Ext.getCmp('return-form').getForm();
                            form.findField('ConsumerTypeId').setValue(rec.id);
                            //if Customer type is Store
                            if (rec.get("Name") == 'Store') {
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
                            else if (rec.get("Name") == 'Employee') {
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
                            else if (rec.get("Name") == 'Unit') {
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
                            var form = Ext.getCmp('return-form').getForm();
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
                            var form = Ext.getCmp('return-form').getForm();
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
                    items: [{
                        hiddenName: 'ConsumerEmployee',
                        xtype: 'combo',
                        fieldLabel: 'Consumer',
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
                            api: { read: Psms.GetEmployeeBySearch }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        pageSize: 10, listeners: {
                            select: function (cmb, rec, idx) {
                                var form = Ext.getCmp('return-form').getForm();
                                form.findField('ConsumerEmployeeId').setValue(rec.id);
                            },
                            change: function (cmb, newvalue, oldvalue) {
                                if (newvalue == "") {
                                    var form = Ext.getCmp('return-form').getForm();
                                    form.findField('ConsumerEmployeeId').reset();

                                }
                            }
                        }
                    }, {
                        xtype: 'button',
                        id: 'findEmployee',
                        iconCls: 'icon-filter',
                        width: 20,
                        handler: function () {
                            var form = Ext.getCmp('return-form').getForm();
                            new Ext.erp.ux.common.EmployeeWindow({
                                parentForm: form,
                                controlIdField: 'ConsumerEmployeeId',
                                controlNameField: 'ConsumerEmployee'
                            }).show();
                        }
                    }]
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
                            var form = Ext.getCmp('return-form').getForm();
                            form.findField('StoreId').setValue(rec.id);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('return-form').getForm();
                                form.findField('StoreId').reset();

                            }
                        }
                    }
                }, {
                    name: 'ReturnedDate',
                    xtype: 'datefield',
                    fieldLabel: 'Returned Date',
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
                        hiddenName: 'ReturnedBy',
                        xtype: 'combo',
                        fieldLabel: 'Returned By',
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
                                var form = Ext.getCmp('return-form').getForm();
                                form.findField('ReturnedById').setValue(rec.id);
                            },
                            change: function (cmb, newvalue, oldvalue) {
                                if (newvalue == "") {
                                    var form = Ext.getCmp('return-form').getForm();
                                    form.findField('ReturnedById').reset();

                                }
                            }
                        }
                      }, {
                          hiddenName: 'PreparedBy',
                          xtype: 'combo',
                          fieldLabel: 'Received/Issued By',
                          typeAhead: false,
                          width: 100,
                          hideTrigger: true,
                          minChars: 2,
                          hidden:true,
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
                                  var form = Ext.getCmp('return-form').getForm();
                                  form.findField('PreparedById').setValue(rec.id);
                              },
                              change: function (cmb, newvalue, oldvalue) {
                                  if (newvalue == "") {
                                      var form = Ext.getCmp('return-form').getForm();
                                      form.findField('PreparedById').reset();

                                  }
                              }
                          }
                      },  {
                          hiddenName: 'ProductionPlan',
                          xtype: 'combo',
                          fieldLabel: 'Production Plan',
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
                                  fields: ['Id', 'Name']
                              }),
                              autoLoad: true,
                              api: { read: Psms.GetProductionPlanBySearch }
                          }),
                          valueField: 'Name',
                          displayField: 'Name',
                          pageSize: 10,
                          listeners: {
                              select: function (cmb, rec, idx) {
                                  var form = Ext.getCmp('return-form').getForm();
                                  form.findField('ProductionPlanId').setValue(rec.id);
                              },
                              change: function (cmb, newvalue, oldvalue) {
                                  if (newvalue == "") {
                                      var form = Ext.getCmp('return-form').getForm();
                                      form.findField('ProductionPlanId').reset();

                                  }
                              }
                          }
                      }, {
                          hiddenName: 'ProductionOrder',
                          xtype: 'combo',
                          fieldLabel: 'Production Order',
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
                                  fields: ['Id', 'Name']
                              }),
                              autoLoad: true,
                              api: { read: Psms.GetProductionOrderBySearch }
                          }),
                          valueField: 'Name',
                          displayField: 'Name',
                          pageSize: 10,
                          listeners: {
                              select: function (cmb, rec, idx) {
                                  var form = Ext.getCmp('return-form').getForm();
                                  form.findField('ProductionOrderId').setValue(rec.id);
                              },
                              change: function (cmb, newvalue, oldvalue) {
                                  if (newvalue == "") {
                                      var form = Ext.getCmp('return-form').getForm();
                                      form.findField('ProductionOrderId').reset();

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
Ext.extend(Ext.erp.ux.return.Form, Ext.form.FormPanel);
Ext.reg('return-form', Ext.erp.ux.return.Form);



/**
* @desc      Return detailGrid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.return
* @class     Ext.erp.ux.return.GridDetail
* @extends   Ext.grid.GridPanel
*/
var returnSelectionModel = new Ext.grid.RowSelectionModel({
});
Ext.erp.ux.return.GridDetail = function (config) {
    Ext.erp.ux.return.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Return.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            //  idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'ReturnHeaderId', 'IsSerialItem', 'PartNumber', 'IsLOTItem', 'ItemId', 'UnitCost', 'Tax', 'Name', 'Code', 'MeasurementUnit', 'Quantity', 'ReturnedQuantity', 'RemainingQuantity', 'DamagedQuantity'],

            remoteSort: true
        }),
        id: 'return-detailGrid',
        clicksToEdit: 1,
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: true,
        height: 400,
        currentRecord: '',
        serialStore: new Ext.data.Store(),
        lOTStore: new Ext.data.Store(),
        sm: Ext.erp.ux.common.SelectionModel,

        viewConfig: {
            forceFit: true
        },
        listeners: {
            beforeLoad: function () {
                Ext.getCmp('return-detailGrid').body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
                Ext.getCmp('return-detailGrid').body.unmask();
            },
            loadException: function () {
                Ext.getCmp('return-detailGrid').body.unmask();
            },
            rowClick: function (grid, index) {
                var detailGrid = Ext.getCmp('return-detailGrid');
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
                           '<p><h6 class="w3-text-teal w3-small "><span> ' + '{Code}' + '-' + '{PartNumber}' + '</span></h6></p>' +
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

                                var detailDrid = Ext.getCmp('return-detailGrid');
                                var selectedrecord = detailDrid.getSelectionModel().getSelected();
                                selectedrecord.set('ItemId', record.get("Id"));
                                selectedrecord.set('Code', record.get("Code"));
                                selectedrecord.set('PartNumber', record.get("PartNumber"));
                                selectedrecord.set('MeasurementUnit', record.get("MeasurementUnit"));
                                selectedrecord.set('IsSerialItem', record.get("IsSerialItem"));

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
                    header: 'Returned Qty',
                    sortable: true,
                    width: 90,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000.00 ');
                    }
                }, {
                    dataIndex: 'RemainingQuantity',
                    header: 'Remaining Qty',
                    sortable: true,
                    width: 80,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000.00 ');
                    }
                }, {
                    dataIndex: 'DamagedQuantity',
                    header: 'Damaged Qty',
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
                    dataIndex: 'ReturnedQuantity',
                    header: 'Returned Qty',
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
                }]
        })
    }, config));
}
Ext.extend(Ext.erp.ux.return.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };

        this.tbar = [
            {
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: false,
                handler: function () {
                    var detailDrid = Ext.getCmp('return-detailGrid');
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
                    var grid = Ext.getCmp('return-detailGrid');

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
                iconCls: 'icon-accept',
                disabled: false,
                handler: function () {
                    var detailGrid = Ext.getCmp('return-detailGrid');
                    var storeId = Ext.getCmp('return-form').getForm().findField("StoreId").getValue();

                    new Ext.erp.ux.itemPicker.Window({
                        targetGrid: detailGrid,
                        storeId: storeId
                    }).show();
                }
            },

        ]
        this.bbar = []

        Ext.erp.ux.return.GridDetail.superclass.initComponent.apply(this, arguments);
    },
    onSerialLOtClick: function () {

        var detailDrid = Ext.getCmp('return-detailGrid');
        var currentRecord = detailDrid.currentRecord;
        var storeId = Ext.getCmp('return-form').getForm().findField("StoreId").getValue();
        var itemId = currentRecord.get("ItemId");
        var returnedQuantity = currentRecord.get("ReturnedQuantity");
        if (returnedQuantity < 0) {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "Returned Quantity must be greater than 0",
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
                issuedQuantity: returnedQuantity
            }).show();
        }
        else if (currentRecord.get("IsLOTItem")) {
            new Ext.erp.ux.itemLOTSelector.Window({
                title: 'Add Item LOT',
                itemStore: detailDrid.lOTStore.query("ItemId", itemId),
                targetGrid: detailDrid,
                storeId: storeId,
                itemId: itemId,
                issuedQuantity: returnedQuantity
            }).show();
        }
    },
    afterRender: function () {

        Ext.erp.ux.return.GridDetail.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('return-detailGrid', Ext.erp.ux.return.GridDetail);

/* @desc     returnOrder form host window
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date     September 2013
* @namespace Ext.erp.ux.returnOrder
* @class     Ext.erp.ux.returnOrder.Window
* @extends   Ext.Window
*/

Ext.erp.ux.return.Window = function (config) {
    Ext.erp.ux.return.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 900,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'return-window',
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
   
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.returnHeaderId);
               
                if (typeof this.returnHeaderId != "undefined" && this.returnHeaderId != "") {
                    this.form.load({
                        waitMsg: 'Loading...',
                        params: { id: this.returnHeaderId },
                        success: function (form, action) {
                            var grid = Ext.getCmp('return-detailGrid');
                            var serilStore = grid.serialStore;
                            var lOTStore = grid.lOTStore;
                            Ext.getCmp('return-form').onReturnTypeChange();
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
                            var form = Ext.getCmp('return-form');
                            var consumerTypeId = form.getForm().findField('ConsumerTypeId').getValue();
                            var consumerType = form.getForm().findField('ConsumerType').getValue();

                            if (consumerType == 'Store') {
                                form.getForm().findField('compositeEmployee').hide();
                                form.getForm().findField('compositeStore').show();
                                form.getForm().findField('compositeUnit').hide();
                            }
                            if (consumerType == 'Employee') {
                                form.getForm().findField('compositeEmployee').show();
                                form.getForm().findField('compositeStore').hide();
                                form.getForm().findField('compositeUnit').hide();
                            }
                            if (consumerType == 'Unit') {
                                form.getForm().findField('compositeEmployee').hide();
                                form.getForm().findField('compositeStore').hide();
                                form.getForm().findField('compositeUnit').show();
                            }
                        }
                    });
                    var grid = Ext.getCmp('return-detailGrid');
                    var store = grid.getStore();
                    store.baseParams = { record: Ext.encode({ voucherHeaderId: this.returnHeaderId, action: "storeReturn" }) };

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
                    Ext.getCmp('return-form').onReturnTypeChange();
                }

            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.ux.return.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.return.Form();
        this.grid = new Ext.erp.ux.return.GridDetail();
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
        Ext.erp.ux.return.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var grid = Ext.getCmp('return-detailGrid');
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
            if (typeof item.get('ReturnedQuantity') == 'undefined' || item.get('ReturnedQuantity') < 0) {
                if (errorMesssage == "")
                    errorMesssage = "Returned Quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "           Returned Quantity";
            }
         
            if (typeof item.get('RemainingQuantity') == 'undefined' || item.get('RemainingQuantity') > 1) {
                if (item.get('ReturnedQuantity') > item.get('RemainingQuantity'))
                    if (errorMesssage == "")
                        errorMesssage = "ReturnedQuantity should not be greater than remianing quantity";
                    else
                        errorMesssage = errorMesssage + "</br>" + "          ReturnedQuantity should not be greater than remianing quantity";
            }
            if (item.get('IsSerialItem') && item.get('ReturnedQuantity') != serialStore.query("ItemId", item.get('ItemId')).length) {
                if (errorMesssage == "")
                    errorMesssage = "Total Returned quantity should be equal to number of serials added";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Total returned quantity should be equal to number of serials added";

            }
            if (item.get('IsLOTItem')) {

                var lotList = lOTStore.query("ItemId", item.get('ItemId'));
                var totlLotQuantity = 0;
                lotList.each(function (item) {
                    totlLotQuantity = totlLotQuantity + item.get('Quantity');

                });

                if (item.get('ReturnedQuantity') != totlLotQuantity)
                    if (errorMesssage == "")
                        errorMesssage = "Total return quantity should be equal to total added LOT quantity";
                    else
                        errorMesssage = errorMesssage + "</br>" + "          Total return quantity should be equal to total added LOT quantity";

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

                              item.data['ReturnHeaderId'] + ':' +
                              item.data['ItemId'] + ':' +
                              item.data['Quantity'] + ':' +
                              item.data['ReturnedQuantity'] + ':' +
                              item.data['RemainingQuantity'] + ':' +
                              item.data['DamagedQuantity'] + ':' +
                               item.data['StatusId'] + ':' +
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
            params: { record: Ext.encode({ returnDetails: rec, itemSerials: serialRec, itemLOTs: lotRec, action: this.action }) },

            success: function (form, action) {

                Ext.getCmp('return-form').getForm().reset();
                Ext.getCmp('return-detailGrid').getStore().removeAll();
                Ext.getCmp('return-paging').doRefresh();

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
Ext.reg('return-window', Ext.erp.ux.return.Window);

/**
* @desc      Return grid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.return
* @class     Ext.erp.ux.return.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.return.Grid = function (config) {
    Ext.erp.ux.return.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Return.GetAllHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DESC'
            },
            fields: ['Id', 'VoucherNumber', 'Consumer', 'ConsumerType','PreparedBy', 'ReturnedDate', 'IsLastStep', 'Supplier','StatusId', 'Status', 'ReturnedBy', 'Store', 'ReturnType'],
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
        id: 'return-grid',
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
            dataIndex: 'Supplier',
            header: 'Supplier',
            sortable: true,
            width: 80,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'ReturnedDate',
            header: 'Return Date',
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
            dataIndex: 'ReturnType',
            header: 'Return Type',
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
                id: 'returnApproval',
                onTriggerClick: function (e) {
                    var grid = Ext.getCmp('return-grid');
                    var selectedrecord = grid.getSelectionModel().getSelected();
                    var id = selectedrecord.get('Id');
                    var position = Ext.getCmp('returnApproval').getPosition(false);
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
Ext.extend(Ext.erp.ux.return.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [{
            id: 'searchReturn',
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearchVoucher
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Return', 'CanAdd'),
            handler: this.onAdd
        },{
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Return', 'CanEdit'),
     
            handler: this.onEdit
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Return',
            iconCls: 'icon-accept',
            disabled: !Ext.erp.ux.Reception.getPermission('Return', 'CanApprove'),
            handler: this.onReceive
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Void',
            iconCls: 'icon-delete',
            disabled: !Ext.erp.ux.Reception.getPermission('Return', 'CanDelete'),
            handler: this.onDelete
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Revise',
            iconCls: 'icon-accept',
            disabled: !Ext.erp.ux.Reception.getPermission('Return', 'CanEdit'),
            handler: this.onRevise
        }, {
            xtype: 'button',
            text: 'Preview',
            id: 'preview-Return',
            hidden: false,
            iconCls: 'icon-preview',
            handler: this.onPreview
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'return-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.return.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {

        var grid = Ext.getCmp('return-grid');
        if (!grid.getSelectionModel().hasSelection()) return;

        var voucherId = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        window.open('Reports/ErpReportViewer.aspx?rt=PreviewStoreReturn&id=' + voucherId, 'PreviewIV', parameter);

    },
    onAdd: function () {
           new Ext.erp.ux.return.Window({
            title: 'Add Return',
            action: 'allAtOnce'
        }).show();
    },
    onEdit: function () {
        var grid = Ext.getCmp('return-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
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
        new Ext.erp.ux.return.Window({
            title: 'Edit Return',
            returnHeaderId: id,
            action: 'edit'
        }).show();
    },
    onRevise: function () {
        var grid = Ext.getCmp('return-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var status = grid.getSelectionModel().getSelected().get('Status');
        if (status == "Received" || status == "Issued") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: " received or issued transaction are  not be revised, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.ux.return.Window({
            title: 'Revise Return',
            returnHeaderId: id,
            action: 'revise'
        }).show();
    },
    onReceive: function () {
        var grid = Ext.getCmp('return-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var storeId = grid.getSelectionModel().getSelected().get('StoreId');
        var isLastStep = grid.getSelectionModel().getSelected().get('IsLastStep');
        var Status = grid.getSelectionModel().getSelected().get('Status');

        if (isLastStep == false || Status == "Received" || Status == "Issued") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "please authorization step is remain or already received, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.erp.ux.return.Window({
            title: 'Return',
            returnHeaderId: id,
            storeId: storeId,
            action: 'receive'
        }).show();
    },
    onDelete: function () {
        var grid = Ext.getCmp('return-grid');
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
                    Return.Void(id, function (result) {
                        if (result.success) {
                            Ext.getCmp('return-paging').doRefresh();
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
            var grid = Ext.getCmp('return-grid');
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
        Ext.erp.ux.return.Grid.superclass.afterRender.apply(this, arguments);
    },

});
Ext.reg('return-grid', Ext.erp.ux.return.Grid);



/**
* @desc      return panel
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @version   $Id: return.js, 0.1
* @namespace Ext.erp.ux.return
* @class     Ext.erp.ux.return.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.return.Panel = function (config) {
    Ext.erp.ux.return.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.return.Panel, Ext.Panel, {
    initComponent: function () {
        this.headerGrid = new Ext.erp.ux.return.Grid();
   
        this.items = [this.headerGrid];

        Ext.erp.ux.return.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('return-panel', Ext.erp.ux.return.Panel);

/**
* @desc      VoucherSearch form
* @namespace Ext.erp.ux.return
* @class     Ext.erp.ux.return.Form
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

Ext.erp.ux.return.SearchForm = function (config) {
    Ext.erp.ux.return.SearchForm.superclass.constructor.call(this, Ext.apply({
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'returnSearch-form',
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
            name: 'ReturnNo',
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
Ext.extend(Ext.erp.ux.return.SearchForm, Ext.form.FormPanel);
Ext.reg('returnSearch-form', Ext.erp.ux.return.SearchForm);

/**
* @desc      VoucherSearch form host window
* @namespace Ext.erp.ux.return
* @class     Ext.erp.ux.return.Window
* @extends   Ext.Window
*/
Ext.erp.ux.return.Observable = new Ext.util.Observable();
Ext.erp.ux.return.Observable.addEvents('searchvoucher');

Ext.erp.ux.return.SearchWindow = function (config) {
    Ext.erp.ux.return.SearchWindow.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.erp.ux.return.SearchWindow, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.return.SearchForm();
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
        Ext.erp.ux.return.SearchWindow.superclass.initComponent.call(this, arguments);
    },
    onFilter: function () {
        var form = Ext.getCmp('returnSearch-form').getForm();
        var result = {};
        result['referenceNo'] = form.findField('VoucherNo').getValue();
        result['srNo'] = form.findField('SRNo').getValue();
        result['returnNo'] = form.findField('ReturnNo').getValue();
        result['storeId'] = form.findField('StoreId').getValue();
        result['startDate'] = form.findField('StartDate').getValue();
        result['endDate'] = form.findField('EndDate').getValue();
        //result['transactionStatus'] = form.findField('TransactionStatus').getValue();
        Ext.erp.ux.return.Observable.fireEvent('searchvoucher', result);
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('returnSearch-window', Ext.erp.ux.return.SearchWindow);
