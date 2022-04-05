Ext.ns('Ext.erp.ux.fixedAssetTransfer');

/**
* @desc      FixedAssetTransfer form
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.fixedAssetTransfer
* @class     Ext.erp.ux.fixedAssetTransfer.Form
* @extends   Ext.form.FormPanel
*/

Ext.erp.ux.fixedAssetTransfer.Form = function (config) {
    Ext.erp.ux.fixedAssetTransfer.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: FixedAssetTransfer.Get,
            submit: FixedAssetTransfer.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'fixedAssetTransfer-form',
        frame: true,
        labelWidth: 100,
        padding: 5,
        autoHeight: false,
        border: false,
        loadDocument: function () {

            FixedAssetTransfer.GetDocumentNo(function (result) {
                var form = Ext.getCmp('fixedAssetTransfer-form').getForm();
                form.findField('VoucherNumber').setValue(result.data.DocNo);
                form.findField('StatusId').setValue(result.data.StatusId);
                form.findField('PreparedById').setValue(result.data.EmployeeId);
                form.findField('TransferedById').setValue(result.data.EmployeeId);
                form.findField('TransferedBy').setValue(result.data.Employee);
                form.findField('TransferedDate').setValue(new Date());
                form.findField('FiscalYearId').setValue(result.data.FiscalYearId);


            });


        },
        SetConsumer: function () {
            var form = Ext.getCmp('fixedAssetTransfer-form').getForm();
            var consumerType = form.findField('ConsumerType').getValue();

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
        SetFromConsumer: function () {
            var form = Ext.getCmp('fixedAssetTransfer-form').getForm();
            var consumerType = form.findField('FromConsumerType').getValue();

            //if Customer type is Store
            if (consumerType == 'Store') {
                form.findField('FromcompositeEmployee').hide();
                form.findField('FromcompositeUnit').hide();
                form.findField('FromcompositeStore').show();

                form.findField('FromConsumerStore').allowBlank = false;
                form.findField('FromConsumerEmployee').allowBlank = true;
                form.findField('FromConsumerUnit').allowBlank = true;

                form.findField('FromConsumerEmployee').setValue('');
                form.findField('FromConsumerEmployeeId').setValue('');
                form.findField('FromConsumerUnit').setValue('');
                form.findField('FromConsumerUnitId').setValue('');
            }
                //if Customer type is employee
            else if (consumerType == 'Employee') {
                form.findField('FromcompositeEmployee').show();
                form.findField('FromcompositeStore').hide();
                form.findField('FromcompositeUnit').hide();
                form.findField('FromConsumerStore').allowBlank = true;
                form.findField('FromConsumerEmployee').allowBlank = false;
                form.findField('FromConsumerUnit').allowBlank = true;


                form.findField('FromConsumerUnit').setValue('');
                form.findField('FromConsumerUnitId').setValue('');
                form.findField('FromConsumerStore').setValue('');
                form.findField('FromConsumerStoreId').setValue('');
            } //if Customer type is unit
            else if (consumerType == 'Unit') {
                form.findField('FromcompositeEmployee').hide();
                form.findField('FromcompositeUnit').show();
                form.findField('FromcompositeStore').hide();
                form.findField('FromConsumerStore').allowBlank = true;
                form.findField('FromConsumerEmployee').allowBlank = true;
                form.findField('FromConsumerUnit').allowBlank = false;


                form.findField('FromConsumerEmployee').setValue('');
                form.findField('FromConsumerEmployeeId').setValue('');
                form.findField('FromConsumerStore').setValue('');
                form.findField('FromConsumerStoreId').setValue('');
            }
            else {
                form.findField('FromcompositeEmployee').hide();
                form.findField('FromcompositeStore').hide();
                form.findField('FromcompositeUnit').hide();
                form.findField('FromConsumerStore').allowBlank = true;
                form.findField('FromConsumerEmployee').allowBlank = true;
                form.findField('FromConsumerUnit').allowBlank = true;

                form.findField('FromConsumerEmployee').setValue('');
                form.findField('FromConsumerEmployeeId').setValue('');
                form.findField('FromConsumerUnit').setValue('');
                form.findField('FromConsumerUnitId').setValue('');
                form.findField('FromConsumerStore').setValue('');
                form.findField('FromConsumerStoreId').setValue('');
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
                },{
                    name: 'PurchaseRequestHeaderId',
                    xtype: 'hidden'
                }, {
                    name: 'PurchaseOrderId',
                    xtype: 'hidden'
                }, {
                    name: 'CreatedAt',
                    xtype: 'hidden'
                }, {
                    name: 'StatusId',
                    xtype: 'hidden'
                },{
                    name: 'CertifiedDate',
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
                    name: 'TransferedById',
                    xtype: 'hidden'
                }, {
                    name: 'InspectionHeaderId',
                    xtype: 'hidden'
                }, {
                    name: 'StoreId',
                    xtype: 'hidden'
                }, {
                    name: 'IssueHeaderId',
                    xtype: 'hidden'
                }, {
                    name: 'ConsumerTypeId',
                    xtype: 'hidden'
                }, {
                    name: 'FromConsumerTypeId',
                    xtype: 'hidden'
                }, {
                    name: 'VoucherNumber',
                    xtype: 'textfield',
                    fieldLabel: 'Voucher Number',
                    readOnly: true,
                    allowBlank: false
                }, {
                    hiddenName: 'IssueNo',
                    xtype: 'combo',
                    fieldLabel: 'Issue No',
                    typeAhead: true,
                    width: 100,
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
                            fields: ['Id', 'Name', 'StoreId', 'Store', 'ConsumerTypeId', 'ConsumerType', 'ConsumerStoreId', 'ConsumerStore', 'ConsumerEmployeeId', 'ConsumerEmployee', 'ConsumerUnitId', 'ConsumerUnit']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetIssueBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10, listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('fixedAssetTransfer-form').getForm();
                            form.findField('IssueHeaderId').setValue(rec.id);
                            form.findField('StoreId').setValue(rec.get('StoreId'));
                            form.findField('Store').setValue(rec.get('Store'));

                            form.findField('FromConsumerTypeId').setValue(rec.get('ConsumerTypeId'));
                            form.findField('FromConsumerType').setValue(rec.get('ConsumerType'));

                            form.findField('FromConsumerStore').setValue(rec.get('ConsumerStore'));
                            form.findField('FromConsumerStore').setValue(rec.get('ConsumerStore'));

                            form.findField('FromConsumerEmployeeId').setValue(rec.get('ConsumerEmployeeId'));
                            form.findField('FromConsumerEmployee').setValue(rec.get('ConsumerEmployee'));
                            form.findField('FromConsumerUnitId').setValue(rec.get('ConsumerUnitId'));
                            form.findField('FromConsumerUnitId').setValue(rec.get('ConsumerUnitId'));
                           
                            Ext.getCmp('fixedAssetTransfer-form').SetFromConsumer();
                            var grid = Ext.getCmp('fixedAssetTransfer-detailGrid');
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
                                var form = Ext.getCmp('fixedAssetTransfer-form').getForm();
                                form.findField('IssueHeaderId').reset();
                            }
                        }
                    }
                }, {
                    hiddenName: 'FromConsumerType',
                    xtype: 'combo',
                    fieldLabel: 'From Consumer Type',
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
                            var form = Ext.getCmp('fixedAssetTransfer-form').getForm();
                            form.findField('FromConsumerTypeId').setValue(rec.id);
                            Ext.getCmp('fixedAssetTransfer-form').SetFromConsumer();

                        }
                    }
                }, {
                    xtype: 'hidden',
                    name: 'FromConsumerStoreId'
                }, {
                    xtype: 'compositefield',
                    name: 'FromcompositeStore',
                    fieldLabel: 'From Consumer Store',
                    hidden: true,
                    defaults: {
                        flex: 1
                    },
                    items: [{
                        name: 'FromConsumerStore',
                        xtype: 'textfield',
                        fieldLabel: 'From Consumer',
                        readonly: true,
                        allowBlank: true
                    }, {
                        xtype: 'button',
                        id: 'findFromStore',
                        iconCls: 'icon-filter',
                        width: 20,
                        handler: function () {
                            var form = Ext.getCmp('fixedAssetTransfer-form').getForm();
                            new Ext.erp.ux.common.StoreWindow({
                                parentForm: form,
                                controlIdField: 'FromConsumerStoreId',
                                controlNameField: 'FromConsumerStore'
                            }).show();
                        }
                    }]
                }, {
                    xtype: 'hidden',
                    name: 'FromConsumerUnitId'
                }, {
                    xtype: 'compositefield',
                    name: 'FromcompositeUnit',
                    fieldLabel: 'From Consumer Department',
                    hidden: true,
                    defaults: {
                        flex: 1
                    },
                    items: [{
                        name: 'FromConsumerUnit',
                        xtype: 'textfield',
                        fieldLabel: 'FromConsumer',
                        readonly: true,
                        allowBlank: true
                    }, {
                        xtype: 'button',
                        id: 'findFromUnit',
                        iconCls: 'icon-filter',
                        width: 20,
                        handler: function () {
                            var form = Ext.getCmp('fixedAssetTransfer-form').getForm();
                            new Ext.erp.ux.common.UnitWindow({
                                parentForm: form,
                                controlIdField: 'FromConsumerUnitId',
                                controlNameField: 'FromConsumerUnit'
                            }).show();
                        }
                    }]
                }, {
                    xtype: 'hidden',
                    name: 'FromConsumerEmployeeId'
                }, {
                    xtype: 'compositefield',
                    name: 'FromcompositeEmployee',
                    fieldLabel: 'From Consumer Employee',
                    hidden: true,
                    defaults: {
                        flex: 1
                    },
                    items: [{
                        name: 'FromConsumerEmployee',
                        xtype: 'textfield',
                        fieldLabel: 'From Consumer',
                        readonly: true,
                        allowBlank: true
                    }, {
                        xtype: 'button',
                        id: 'findFromEmployee',
                        iconCls: 'icon-filter',
                        width: 20,
                        handler: function () {
                            var form = Ext.getCmp('fixedAssetTransfer-form').getForm();
                            new Ext.erp.ux.common.EmployeeWindow({
                                parentForm: form,
                                controlIdField: 'FromConsumerEmployeeId',
                                controlNameField: 'FromConsumerEmployee'
                            }).show();
                        }
                    }]
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
                            var form = Ext.getCmp('fixedAssetTransfer-form').getForm();
                            form.findField('StoreId').setValue(rec.id);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('fixedAssetTransfer-form').getForm();
                                form.findField('StoreId').reset();

                            }
                        }
                    }
                },  ]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [
                 {
                     name: 'TransferedDate',
                     xtype: 'datefield',
                     fieldLabel: 'Transferd Date',
                     width: 100,
                     allowBlank: false,
                     value: new Date(),
                     maxValue: (new Date()).format('m/d/Y')
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
                             var form = Ext.getCmp('fixedAssetTransfer-form').getForm();
                             form.findField('ConsumerTypeId').setValue(rec.id);
                             Ext.getCmp('fixedAssetTransfer-form').SetConsumer();

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
                             var form = Ext.getCmp('fixedAssetTransfer-form').getForm();
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
                             var form = Ext.getCmp('fixedAssetTransfer-form').getForm();
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
                         name: 'ConsumerEmployee',
                         xtype: 'textfield',
                         fieldLabel: 'Consumer',
                         readonly: true,
                         allowBlank: true
                     }, {
                         xtype: 'button',
                         id: 'findEmployee',
                         iconCls: 'icon-filter',
                         width: 20,
                         handler: function () {
                             var form = Ext.getCmp('fixedAssetTransfer-form').getForm();
                             new Ext.erp.ux.common.EmployeeWindow({
                                 parentForm: form,
                                 controlIdField: 'ConsumerEmployeeId',
                                 controlNameField: 'ConsumerEmployee'
                             }).show();
                         }
                     }]
                 }, {
                     hiddenName: 'TransferedBy',
                     xtype: 'combo',
                     fieldLabel: 'Transfered By',
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
                             var form = Ext.getCmp('fixedAssetTransfer-form').getForm();
                             form.findField('TransferedById').setValue(rec.id);
                         },
                         change: function (cmb, newvalue, oldvalue) {
                             if (newvalue == "") {
                                 var form = Ext.getCmp('fixedAssetTransfer-form').getForm();
                                 form.findField('TransferedById').reset();

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
            }, ]
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.fixedAssetTransfer.Form, Ext.form.FormPanel);
Ext.reg('fixedAssetTransfer-form', Ext.erp.ux.fixedAssetTransfer.Form);



/**
* @desc      FixedAssetTransfer detailGrid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.fixedAssetTransfer
* @class     Ext.erp.ux.fixedAssetTransfer.GridDetail
* @extends   Ext.grid.GridPanel
*/
var fixedAssetTransferSelectionModel =  new Ext.grid.CheckboxSelectionModel({
});
Ext.erp.ux.fixedAssetTransfer.GridDetail = function (config) {
    Ext.erp.ux.fixedAssetTransfer.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FixedAssetTransfer.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            //  idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'FixedAssetTransferHeaderId', 'IsSerialItem', 'IsLOTItem', 'ItemId', 'DamagedQuantity', 'UnitCost', 'Name', 'Code', 'MeasurementUnit', 'Quantity', 'TransferedQuantity', 'RemainingQuantity'],

            remoteSort: true,
            listeners: {
                load: function () {
                },

            },
        }),
        id: 'fixedAssetTransfer-detailGrid',
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
                Ext.getCmp('fixedAssetTransfer-detailGrid').body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
              
                Ext.getCmp('fixedAssetTransfer-detailGrid').body.unmask();
            },
            loadException: function () {
                Ext.getCmp('fixedAssetTransfer-detailGrid').body.unmask();
            },
            afteredit: function (e) {
                var record = e.record;
            },
            rowClick: function (grid, index) {
                var detailGrid = Ext.getCmp('fixedAssetTransfer-detailGrid');
                var currentRecord = detailGrid.getStore().getAt(index);
                detailGrid.currentRecord = currentRecord;
            },
        },
        cm: new Ext.grid.ColumnModel({
            columns: [
                fixedAssetTransferSelectionModel,
                new Ext.grid.RowNumberer(),
                {
                    dataIndex: 'Name',
                    header: 'Name',
                    sortable: true,
                    width: 140,
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
                                fields: ['Id', 'Name', 'Code', 'MeasurementUnit','UnitId', 'IsSerialItem', 'IsLOTItem']
                            }),
                            api: { read: Psms.GetItemBySearch }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        listeners: {

                            select: function (combo, record, index) {

                                var detailDrid = Ext.getCmp('fixedAssetTransfer-detailGrid');
                                var selectedrecord = detailDrid.getSelectionModel().getSelected();
                                selectedrecord.set('ItemId', record.get("Id"));
                                selectedrecord.set('Code', record.get("Code"));
                                selectedrecord.set('IsSerialItem', record.get("IsSerialItem"));
                                selectedrecord.set('IsLOTItem', record.get("IsLOTItem"));
                                selectedrecord.set('MeasurementUnit', record.get("MeasurementUnit"));
                                selectedrecord.set('UnitId', record.get("UnitId"));
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
                    dataIndex: 'Quantity',
                    header: 'Issued Qty',
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
                },  {
                    dataIndex: 'TransferedQuantity',
                    header: 'Transferd Qty',
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
                }, ]
        })
    }, config));
}
Ext.extend(Ext.erp.ux.fixedAssetTransfer.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };

        this.tbar = [
            {
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: false,
                handler: function () {
                    var detailDrid = Ext.getCmp('fixedAssetTransfer-detailGrid');
                    var store = detailDrid.getStore();

                    var defaultData = {
                        Tax: 0,
                        UnitCost: 0,
                        TransferedQuantity:0,
                        Quantity: 0,
                        RemainingQuantity: 0,
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
                    var grid = Ext.getCmp('fixedAssetTransfer-detailGrid');

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
                    var detailGrid = Ext.getCmp('fixedAssetTransfer-detailGrid');
                    new Ext.erp.ux.itemPicker.Window({
                        targetGrid: detailGrid
                    }).show();
                }
            },

        ]
        this.bbar = [];
        Ext.erp.ux.fixedAssetTransfer.GridDetail.superclass.initComponent.apply(this, arguments);
    },
    onSerialLOtClick: function () {

        var detailDrid = Ext.getCmp('fixedAssetTransfer-detailGrid');
        var currentRecord = detailDrid.currentRecord;
        var storeId = Ext.getCmp('fixedAssetTransfer-form').getForm().findField("StoreId").getValue();
        var itemId = currentRecord.get("ItemId");

        var fixedAssetTransferdQuantity = currentRecord.get("TransferedQuantity");
         var quantity = fixedAssetTransferdQuantity;
         if (quantity < 0) {
             Ext.MessageBox.show({
                 title: 'Error',
                 msg: "Transfered Quantity must be greater than 0",
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
                 issuedQuantity: quantity
             }).show();
         }
         else if (currentRecord.get("IsLOTItem")) {
             new Ext.erp.ux.itemLOTSelector.Window({
                 title: 'Add Item LOT',
                 itemStore: detailDrid.lOTStore.query("ItemId", itemId),
                 targetGrid: detailDrid,
                 storeId: storeId,
                 itemId: itemId,
                 issuedQuantity: quantity
             }).show();
         }
    },

    afterRender: function () {

        Ext.erp.ux.fixedAssetTransfer.GridDetail.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('fixedAssetTransfer-detailGrid', Ext.erp.ux.fixedAssetTransfer.GridDetail);

/* @desc     fixedAssetTransferOrder form host window
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date     September 2013
* @namespace Ext.erp.ux.fixedAssetTransferOrder
* @class     Ext.erp.ux.fixedAssetTransferOrder.Window
* @extends   Ext.Window
*/

Ext.erp.ux.fixedAssetTransfer.Window = function (config) {
    Ext.erp.ux.fixedAssetTransfer.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 800,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'fixedAssetTransfer-window',
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
   
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.fixedAssetTransferHeaderId);
               
                if (typeof this.fixedAssetTransferHeaderId != "undefined" && this.fixedAssetTransferHeaderId != "") {
                    this.form.load({
                        waitMsg: 'Loading...',
                        params: { id: this.fixedAssetTransferHeaderId },
                        success: function (form, action) {
                            Ext.getCmp('fixedAssetTransfer-form').SetConsumer();
                            Ext.getCmp('fixedAssetTransfer-form').SetFromConsumer();

                            var grid = Ext.getCmp('fixedAssetTransfer-detailGrid');
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
                        }
                    });
                    var grid = Ext.getCmp('fixedAssetTransfer-detailGrid');
                    var store = grid.getStore();
                    store.baseParams = { record: Ext.encode({ voucherHeaderId: this.fixedAssetTransferHeaderId, action: "storeFixedAssetTransfer" }) };

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
Ext.extend(Ext.erp.ux.fixedAssetTransfer.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.fixedAssetTransfer.Form();
        this.grid = new Ext.erp.ux.fixedAssetTransfer.GridDetail();
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
        Ext.erp.ux.fixedAssetTransfer.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var grid = Ext.getCmp('fixedAssetTransfer-detailGrid');
        var store = grid.getStore();
        var rec = '',serialRec='',lotRec='';; var errorMesssage = "";
        var selectedItems = grid.getSelectionModel().getSelections();
        var store = grid.getStore();
        var serialStore = grid.serialStore;
        var lOTStore = grid.lOTStore;

        if (selectedItems.length < 1) {
            Ext.MessageBox.show({
                title: 'Save failed',
                msg: "Please select detail items",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        for (var i = 0; i < selectedItems.length; i++) {
            var item = selectedItems[i];
            if (typeof item.get('TransferedQuantity') == 'undefined' || item.get('TransferedQuantity') < 0) {
                if (errorMesssage == "")
                    errorMesssage = "Transfered Quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "           Transfered Quantity";
            }          
            if (item.get('RemainingQuantity') > 0 && item.get('TransferedQuantity') > item.get('RemainingQuantity')) {
                if (errorMesssage == "")
                    errorMesssage = "Transfered Quantity should not be greater than remaining quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Transfered Quantity should not be greater than remaining quantity";
            }
            if (item.get('IsSerialItem') && item.get('TransferedQuantity') != serialStore.query("ItemId", item.get('ItemId')).length) {
                if (errorMesssage == "")
                    errorMesssage = "Total transfered quantity should be equal to number of serials added";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Total transfered quantity should be equal to number of serials added";

            }
            if (item.get('IsLOTItem') && item.get('TransferedQuantity') != serialStore.query("ItemId", item.get('ItemId')).sum('Quantity')) {
                if (errorMesssage == "")
                    errorMesssage = "Total transfered quantity should be equal to total added LOT quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Total issued quantity should be equal to total added LOT quantity";

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

                              item.data['FixedAssetTransferHeaderId'] + ':' +
                              item.data['ItemId'] + ':' +
                              item.data['Quantity'] + ':' +
                              item.data['TransferedQuantity'] + ':' +
                              item.data['RemainingQuantity'] + ':' +   
                              item.data['Remark'] + ';';
        }
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
            params: { record: Ext.encode({ fixedAssetTransferDetails: rec,itemSerials: serialRec, itemLOTs: lotRec, action: this.action }) },

            success: function (form, action) {

                Ext.getCmp('fixedAssetTransfer-form').getForm().reset();
                Ext.getCmp('fixedAssetTransfer-detailGrid').getStore().removeAll();
                Ext.getCmp('fixedAssetTransfer-paging').doRefresh();

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
Ext.reg('fixedAssetTransfer-window', Ext.erp.ux.fixedAssetTransfer.Window);

/**
* @desc      FixedAssetTransfer grid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.fixedAssetTransfer
* @class     Ext.erp.ux.fixedAssetTransfer.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.fixedAssetTransfer.Grid = function (config) {
    Ext.erp.ux.fixedAssetTransfer.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: FixedAssetTransfer.GetAllHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DESC'
            },
            fields: ['Id', 'VoucherNumber', 'TransferedDate', 'StatusId', 'Status', 'TransferedBy', 'Store','ConsumerType','Consumer','FromConsumerType','FromConsumer'],
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
        id: 'fixedAssetTransfer-grid',
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
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'TransferedDate',
            header: 'ransfer Date',
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
            dataIndex: 'FromConsumerType',
            header: 'From Consumer Type',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'FromConsumer',
            header: 'From Consumer',
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
Ext.extend(Ext.erp.ux.fixedAssetTransfer.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [{
            id: 'searchFixedAssetTransfer',
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearchVoucher
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Fixed Asset Transfer', 'CanAdd'),
            handler: this.onAdd
        },{
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Fixed Asset Transfer', 'CanEdit'),
     
            handler: this.onEdit
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Certify',
            iconCls: 'icon-accept',
            handler: this.onCertify,
            disabled: !Ext.erp.ux.Reception.getPermission('Fixed Asset Transfer', 'CanApprove'),
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Approve',
            iconCls: 'icon-accept',
            disabled: !Ext.erp.ux.Reception.getPermission('Fixed Asset Transfer', 'CanApprove'),
            handler: this.onApprove
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Void',
            iconCls: 'icon-delete',
            disabled: !Ext.erp.ux.Reception.getPermission('Fixed Asset Transfer', 'CanDelete'),
            handler: this.onDelete
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Preview',
            id: 'preview-FixedAssetTransfer',
            hidden: false,
            iconCls: 'icon-preview',
            handler: this.onPreview
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'fixedAssetTransfer-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.fixedAssetTransfer.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {

        var grid = Ext.getCmp('fixedAssetTransfer-grid');
        if (!grid.getSelectionModel().hasSelection()) return;

        var voucherId = grid.getSelectionModel().getSelected().get('Id');
        var fixedAssetTransferType = grid.getSelectionModel().getSelected().get('FixedAssetTransferType');

        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        window.open('Reports/ErpReportViewer.aspx?rt=PreviewGRN&id=' + voucherId + '&fixedAssetTransferType=' + fixedAssetTransferType, 'PreviewIV', parameter);

    },
    onAdd: function () {
           new Ext.erp.ux.fixedAssetTransfer.Window({
            title: 'Add FixedAssetTransfer',
            action: 'allAtOnce'
        }).show();
    },
    onEdit: function () {
        var grid = Ext.getCmp('fixedAssetTransfer-grid');
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
        new Ext.erp.ux.fixedAssetTransfer.Window({
            title: 'Edit FixedAssetTransfer',
            fixedAssetTransferHeaderId: id,
            action: 'edit'
        }).show();
    },
    onCertify: function () {
        var grid = Ext.getCmp('fixedAssetTransfer-grid');
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
        new Ext.erp.ux.fixedAssetTransfer.Window({
            title: 'Certify FixedAssetTransfer',
            fixedAssetTransferHeaderId: id,
            action: 'certify'
        }).show();
    },
    onApprove: function () {
        var grid = Ext.getCmp('fixedAssetTransfer-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var status = grid.getSelectionModel().getSelected().get('Status');

        if (status != "Certified") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "Only certified transaction are approved, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.erp.ux.fixedAssetTransfer.Window({
            title: 'Approve FixedAssetTransfer',
            fixedAssetTransferHeaderId: id,
            action: 'approve'
        }).show();
    },
    onDelete: function () {
        var grid = Ext.getCmp('fixedAssetTransfer-grid');
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
                    FixedAssetTransfer.Void(id, function (result) {
                        if (result.success) {
                            Ext.getCmp('fixedAssetTransfer-paging').doRefresh();
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
    onIssue: function () {
        var grid = Ext.getCmp('fixedAssetTransfer-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.ux.requestOrderPicker.Window({
            title: 'Select Request Order',
            voucherHeaderId: id,
            action: 'Select'
        }).show();

    },
    onSearchVoucher: function () {
        Ext.erp.ux.voucherSearch.Observable.on('searchvoucher', function (result) {
            result['mode'] = 'search';
            var grid = Ext.getCmp('fixedAssetTransfer-grid');
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
        Ext.erp.ux.fixedAssetTransfer.Grid.superclass.afterRender.apply(this, arguments);
    },

});
Ext.reg('fixedAssetTransfer-grid', Ext.erp.ux.fixedAssetTransfer.Grid);



/**
* @desc      fixedAssetTransfer panel
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @version   $Id: fixedAssetTransfer.js, 0.1
* @namespace Ext.erp.ux.fixedAssetTransfer
* @class     Ext.erp.ux.fixedAssetTransfer.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.fixedAssetTransfer.Panel = function (config) {
    Ext.erp.ux.fixedAssetTransfer.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.fixedAssetTransfer.Panel, Ext.Panel, {
    initComponent: function () {
        this.headerGrid = new Ext.erp.ux.fixedAssetTransfer.Grid();
   
        this.items = [this.headerGrid];

        Ext.erp.ux.fixedAssetTransfer.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('fixedAssetTransfer-panel', Ext.erp.ux.fixedAssetTransfer.Panel);

/**
* @desc      VoucherSearch form
* @namespace Ext.erp.ux.fixedAssetTransfer
* @class     Ext.erp.ux.fixedAssetTransfer.Form
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

Ext.erp.ux.fixedAssetTransfer.SearchForm = function (config) {
    Ext.erp.ux.fixedAssetTransfer.SearchForm.superclass.constructor.call(this, Ext.apply({
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'fixedAssetTransferSearch-form',
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
            name: 'FixedAssetTransferNo',
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
Ext.extend(Ext.erp.ux.fixedAssetTransfer.SearchForm, Ext.form.FormPanel);
Ext.reg('fixedAssetTransferSearch-form', Ext.erp.ux.fixedAssetTransfer.SearchForm);

/**
* @desc      VoucherSearch form host window
* @namespace Ext.erp.ux.fixedAssetTransfer
* @class     Ext.erp.ux.fixedAssetTransfer.Window
* @extends   Ext.Window
*/
Ext.erp.ux.fixedAssetTransfer.Observable = new Ext.util.Observable();
Ext.erp.ux.fixedAssetTransfer.Observable.addEvents('searchvoucher');

Ext.erp.ux.fixedAssetTransfer.SearchWindow = function (config) {
    Ext.erp.ux.fixedAssetTransfer.SearchWindow.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.erp.ux.fixedAssetTransfer.SearchWindow, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.fixedAssetTransfer.SearchForm();
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
        Ext.erp.ux.fixedAssetTransfer.SearchWindow.superclass.initComponent.call(this, arguments);
    },
    onFilter: function () {
        var form = Ext.getCmp('fixedAssetTransferSearch-form').getForm();
        var result = {};
        result['referenceNo'] = form.findField('VoucherNo').getValue();
        result['srNo'] = form.findField('SRNo').getValue();
        result['fixedAssetTransferNo'] = form.findField('FixedAssetTransferNo').getValue();
        result['storeId'] = form.findField('StoreId').getValue();
        result['startDate'] = form.findField('StartDate').getValue();
        result['endDate'] = form.findField('EndDate').getValue();
        //result['transactionStatus'] = form.findField('TransactionStatus').getValue();
        Ext.erp.ux.fixedAssetTransfer.Observable.fireEvent('searchvoucher', result);
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('fixedAssetTransferSearch-window', Ext.erp.ux.fixedAssetTransfer.SearchWindow);