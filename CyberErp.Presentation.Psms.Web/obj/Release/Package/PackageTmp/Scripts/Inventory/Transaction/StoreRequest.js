Ext.ns('Ext.erp.ux.goodsRequest');
/**
* @desc      Purchase Request registration form
* @author    Henock Melisse
* @copyright (c) 2013, Cybersoft
* @date      November 19, 2013
* @namespace Ext.erp.ux.goodsRequest
* @class     Ext.erp.ux.goodsRequest.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.goodsRequest.Form = function (config) {
    Ext.erp.ux.goodsRequest.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: StoreRequest.Get,
            submit: StoreRequest.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '80%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'goodsRequest-form',
        padding: 5,
        labelWidth: 120,
        autoHeight: true,
        border: false,
        listeners: {
            scope: this,
            render: function (cmb, rec) {
                Ext.getCmp('goodsRequest-form').refreshForm();
            }
        },
        refreshForm:function()
        {
            var voucherHeaderGrid = Ext.getCmp('goodsRequest-grid');
            voucherHeaderGrid.getSelectionModel().deselectRange(0, voucherHeaderGrid.pageSize);
            Ext.getCmp('savePR').setDisabled(false);
            Ext.getCmp('goodsRequest-form').getForm().reset();
            var form = Ext.getCmp('goodsRequest-form').getForm();
            Ext.getCmp('goodsRequest-form').onConsumerTypeChange()
            StoreRequest.GetDocumentNo(function (result) {
                form.findField('VoucherNumber').setValue(result.data.DocNo);
                form.findField('StatusId').setValue(result.data.StatusId);
                form.findField('Status').setValue(result.data.Status);
                form.findField('Requester').setValue(result.data.User);
                form.findField('RequestedById').setValue(result.data.RequestedById);
                form.findField('PreparedById').setValue(result.data.UserId);
                form.findField('StoreId').setValue(result.data.StoreId);
                 form.findField('FiscalYearId').setValue(result.data.FiscalYearId);
                 form.findField('RequestedDate').setValue(new Date());
                 form.findField('RequiredDate').setValue(new Date());
                });
            Ext.getCmp('goodsRequest-detailGrid').getStore().removeAll();
        },
        onConsumerTypeChange:function(){

            var form = Ext.getCmp('goodsRequest-form').getForm();
            var consumerType=form.findField('ConsumerType').getValue();
          
            if (consumerType == 'Store') {

                form.findField('ConsumerEmployee').hide();
                form.findField('ConsumerUnit').hide();
                form.findField('ConsumerStore').show();

                form.findField('ConsumerStore').allowBlank = false;
                form.findField('ConsumerEmployee').allowBlank = true;
                form.findField('ConsumerUnit').allowBlank = true;

                form.findField('ConsumerEmployee').setValue('');
                form.findField('ConsumerEmployeeId').setValue('');
                form.findField('ConsumerUnit').setValue('');
                form.findField('ConsumerUnitId').setValue('');
            }
            else if (consumerType == 'Employee') {
                form.findField('ConsumerEmployee').show();
                form.findField('ConsumerStore').hide();
                form.findField('ConsumerUnit').hide();
                form.findField('ConsumerStore').allowBlank = true;
                form.findField('ConsumerEmployee').allowBlank = false;
                form.findField('ConsumerUnit').allowBlank = true;


                form.findField('ConsumerUnit').setValue('');
                form.findField('ConsumerUnitId').setValue('');
                form.findField('ConsumerStore').setValue('');
                form.findField('ConsumerStoreId').setValue('');
            }

            else if (consumerType == 'Unit') {
                form.findField('ConsumerEmployee').hide();
                form.findField('ConsumerUnit').show();
                form.findField('ConsumerStore').hide();
                form.findField('ConsumerStore').allowBlank = true;
                form.findField('ConsumerEmployee').allowBlank = true;
                form.findField('ConsumerUnit').allowBlank = false;


                form.findField('ConsumerEmployee').setValue('');
                form.findField('ConsumerEmployeeId').setValue('');
                form.findField('ConsumerStore').setValue('');
                form.findField('ConsumerStoreId').setValue('');
            }
            else {
                form.findField('ConsumerEmployee').hide();
                form.findField('ConsumerStore').hide();
                form.findField('ConsumerUnit').hide();
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
                        xtype: 'hidden',
                        name: 'RequestedUnitId'
                    }, {
                        name: 'PreparedById',
                        xtype: 'hidden'
                    }, {
                        name: 'Date',
                        xtype: 'hidden'
                    }, {
                        name: 'CreatedAt',
                        xtype: 'hidden'
                    }, {
                        name: 'PurposeId',
                        xtype: 'hidden'
                    }, {
                        name: 'FiscalYearId',
                        xtype: 'hidden'
                    }, {
                        name: 'StoreId',
                        xtype: 'hidden'
                    }, {
                        name: 'StatusId',
                        xtype: 'hidden'
                    }, {
                        name: 'ConsumerTypeId',
                        xtype: 'hidden'
                    }, {
                        name: 'StoreRequestTypeId',
                        xtype: 'hidden'
                    }, {
                        name: 'RequestedById',
                        xtype: 'hidden'
                    }, {
                        name: 'ProductionOrderId',
                        xtype: 'hidden'
                    }, {
                        name: 'ProductionPlanId',
                        xtype: 'hidden'
                    }, {
                        xtype: 'compositefield',
                        name: 'compositeNew',
                        fieldLabel: 'Voucher Number',
                        items: [{
                            name: 'VoucherNumber',
                            xtype: 'textfield',
                            fieldLabel: 'Voucher Number',
                            readOnly: true,
                            allowBlank: false
                        }, {
                            xtype: 'button',
                            id: 'addNew',
                            iconCls: 'icon-add',
                            width: 10,
                            handler: function () {
                                Ext.getCmp('goodsRequest-form').refreshForm();
                            }
                        }]
                    }, {
                        name: 'RequestedDate',
                        xtype: 'datefield',
                        fieldLabel: 'Request Date',
                        altFormats: 'c',
                        editable: true,
                        anchor: '95%',
                        allowBlank: false,
                        value: (new Date()).format('m/d/Y'),
                        maxValue: (new Date()).format('m/d/Y')
                    }, {
                        name: 'RequiredDate',
                        xtype: 'datefield',
                        fieldLabel: 'Required Date',
                        altFormats: 'c',
                        editable: true,
                        hidden:true,
                        anchor: '95%',
                        allowBlank: true,
                        value: (new Date()).format('m/d/Y'),
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
                                var form = Ext.getCmp('goodsRequest-form').getForm();
                                form.findField('ConsumerTypeId').setValue(rec.id);

                                Ext.getCmp('goodsRequest-form').onConsumerTypeChange();
                            }
                        }
                    }, {
                        xtype: 'hidden',
                        name: 'ConsumerStoreId'
                    }, {
                        hiddenName: 'ConsumerStore',
                        xtype: 'combo',
                        fieldLabel: 'Consumer Store',
                        triggerAction: 'all',
                        mode: 'local',
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
                            api: { read: Psms.GetStore }
                        }),
                        displayField: 'Name',
                        valueField: 'Name',
                        listeners: {
                            scope: this,
                            select: function (cmb, rec) {
                                var form = Ext.getCmp('goodsRequest-form').getForm();
                                form.findField('ConsumerStoreId').setValue(rec.get("Id"));

                            }
                        }
                    },  {
                        xtype: 'hidden',
                        name: 'ConsumerUnitId'
                    }, {
                        hiddenName: 'ConsumerUnit',
                        xtype: 'combo',
                        fieldLabel: 'Consumer Unit',
                        triggerAction: 'all',
                        mode: 'local',
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
                            api: { read: Psms.GetUnit }
                        }),
                        displayField: 'Name',
                        valueField: 'Name',
                        listeners: {
                            scope: this,
                            select: function (cmb, rec) {
                                var form = Ext.getCmp('goodsRequest-form').getForm();
                                form.findField('ConsumerUnitId').setValue(rec.get("Id"));

                            }
                        }
                    },{
                        xtype: 'hidden',
                        name: 'ConsumerEmployeeId'
                    }, {
                        hiddenName: 'ConsumerEmployee',
                        xtype: 'combo',
                        fieldLabel: 'Consumer',
                        typeAhead: true,
                        hideTrigger: true,
                        minChars: 2,
                        listWidth: 280,
                        emptyText: '---Type to Search---',
                        mode: 'remote',
                        allowBlank: false,

                        tpl:
                        '<tpl for="."><div ext:qtip="{Name}" class="x-combo-list-item">' +
                            '<p><h6 class="w3-text-teal w3-small "><span>Name : ' + '{Name}' + '</span></h6></p>' +
                            '<p><h6 class="w3-text-teal w3-small "><span>Unit : ' + '{Unit}' + '</span></h6></p>' +
                        '</span></div></tpl>',
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'Name', 'UnitId', 'Unit']
                            }),
                            autoLoad: true,
                            api: { read: Psms.GetEmployeeBySearch }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        pageSize: 10, listeners: {
                            select: function (cmb, rec, idx) {
                                var form = Ext.getCmp('goodsRequest-form').getForm();
                                form.findField('ConsumerEmployeeId').setValue(rec.id);
                                form.findField('RequestedUnitId').setValue(rec.get('UnitId'));
                            },
                            change: function (cmb, newvalue, oldvalue) {
                                if (newvalue == "") {
                                    var form = Ext.getCmp('goodsRequest-form').getForm();
                                    form.findField('ConsumerEmployeeId').reset();

                                }
                            }
                        }
                    }, {
                        hiddenName: 'Store',
                        xtype: 'combo',
                        fieldLabel: 'Branch',
                        triggerAction: 'all',
                        mode: 'local',
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
                            api: { read: Psms.GetStore }
                        }),
                        displayField: 'Name',
                        valueField: 'Name',
                        listeners: {
                            scope: this,
                            select: function (cmb, rec) {
                                var form = Ext.getCmp('goodsRequest-form').getForm();
                                form.findField('StoreId').setValue(rec.get("Id"));

                            }
                        }
                    },  {
                        hiddenName: 'Purpose',
                        xtype: 'combo',
                        fieldLabel: 'Purpose',
                        triggerAction: 'all',
                        mode: 'local',
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
                            api: { read: Psms.GetRequestPurpose }
                        }),
                        displayField: 'Name',
                        valueField: 'Name',
                        listeners: {
                            scope: this,
                            select: function (cmb,rec) {
                                var form = Ext.getCmp('goodsRequest-form').getForm();
                                form.findField('PurposeId').setValue(rec.get("Id"));
                               
                            }
                        }
                    }, {
                        name: 'Status',
                        xtype: 'textfield',
                        fieldLabel: 'Status',
                        disabled: true,
                        hidden:true,
                        allowBlank: true
                    }]
                }, {
                    defaults: {
                        anchor: '95%'
                    },
                    items: [{
                        name: 'ReferenceNo',
                        xtype: 'textfield',
                        fieldLabel: 'Reference No',
                        width: 100,
                        allowBlank: true,
                        readOnly: false
                    }, {
                        name: 'Requester',
                        xtype: 'textfield',
                        fieldLabel: 'Requested By',
                        width: 100,
                        allowBlank: false,
                        readOnly: true
                    }, {
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
                            api: { read: Psms.GetProductionPlanBySearch }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        pageSize: 10,
                        listeners: {
                            select: function (cmb, rec, idx) {
                                var form = Ext.getCmp('goodsRequest-form').getForm();
                                form.findField('ProductionPlanId').setValue(rec.id);
                            },
                            change: function (cmb, newvalue, oldvalue) {
                                if (newvalue == "") {
                                    var form = Ext.getCmp('goodsRequest-form').getForm();
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
                            api: { read: Psms.GetProductionOrderBySearch }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        pageSize: 10,
                        listeners: {
                            select: function (cmb, rec, idx) {
                                var form = Ext.getCmp('goodsRequest-form').getForm();
                                form.findField('ProductionOrderId').setValue(rec.id);
                            },
                            change: function (cmb, newvalue, oldvalue) {
                                if (newvalue == "") {
                                    var form = Ext.getCmp('goodsRequest-form').getForm();
                                    form.findField('ProductionOrderId').reset();

                                }
                            }
                        }
                    }, {
                        name: 'Remarks',
                        xtype: 'textarea',
                        height:60,
                        fieldLabel: 'Remark'
                    }]
                }]
            }
        ],
    }, config));
}
Ext.extend(Ext.erp.ux.goodsRequest.Form, Ext.form.FormPanel);
Ext.reg('goodsRequest-form', Ext.erp.ux.goodsRequest.Form);

/**
* @desc      goodsRequest grid
* @author    Henock Melisse
* @copyright (c) 2013, Cybersoft
* @date      November 19, 2013
* @namespace Ext.erp.ux.goodsRequest
* @class     Ext.erp.ux.goodsRequest.DetailGrid
* @extends   Ext.grid.GridPanel
*/

Ext.erp.ux.goodsRequest.DetailGrid = function (config) {
    Ext.erp.ux.goodsRequest.DetailGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: window.StoreRequest.GetAllDetails,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            clickToEdit: 1,
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'ItemName',
                direction: 'ASC'
            },
            fields: ['Id', 'ItemId', 'Remark', 'StoreId', 'ItemName', 'Code', 'PartNumber', 'UnitId', 'AvailableQuantity', 'Weight', 'TotalWeight', 'Unit', 'Item', 'MeasurementUnit', 'Description', 'Quantity', 'UnprocessedQuantity', 'TechnicalSpecification'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('goodsRequest-detailGrid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    Ext.getCmp('goodsRequest-detailGrid').body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('goodsRequest-detailGrid').body.unmask();
                },
                scope: this
            }
        }),
        id: 'goodsRequest-detailGrid',
        voucherId: 0,
        pageSize: 10,
        stripeRows: true,
        columnLines: true,
        border: true,
        clicksToEdit: 1,
        currentRecord: '',
        action:'',
        sm: Ext.erp.ux.common.CheckBoxSelectionModel,
         listeners: {
            rowClick: function (grid, index) {
                var detailGrid = Ext.getCmp('goodsRequest-detailGrid');
                var currentRecord = detailGrid.getStore().getAt(index);
                detailGrid.currentRecord = currentRecord;
            },
            afteredit: function (e) {
                var record = e.record;
                var grid = Ext.getCmp('goodsRequest-detailGrid');
            }
        },
        viewConfig: {

        },
        columns: [Ext.erp.ux.common.CheckBoxSelectionModel,{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            readOnly: true,
            menuDisabled: true
        }, {
            dataIndex: 'ItemId',
            header: 'ItemId',
            sortable: true,
            hidden: true,
            width: 100,
            readOnly: true,
            menuDisabled: true
        }, {
            dataIndex: 'StoreId',
            header: 'StoreId',
            sortable: true,
            hidden: true,
            width: 100,
            readOnly: true,
            menuDisabled: true
        },
        new Ext.grid.RowNumberer(),

         {
             dataIndex: 'ItemName',
             header: 'Item Name',
             sortable: true,
             width: 180,
             menuDisabled: true,
             xtype: 'combocolumn',

             editor: new Ext.form.ComboBox({
                 width: 100,
                 hideTrigger: true,
                 minChars: 2,
                 typeAhead: false,

                 listWidth: 300,
                 emptyText: '---Type to Search---',
                 mode: 'remote',
                 pageSize: 12,
                 allowBlank: false,

                 tpl:
                 '<tpl for="."><div ext:qtip="{Name}" class="x-combo-list-item">' +
                     '<p><h6 class="w3-text-teal w3-small "><span> ' + '{Name}'+ '</span></h6></p>' +
                     '<p><h6 class="w3-text-teal w3-small "><span> ' + '{Code}' + '-' + '{PartNumber}' + '</span></h6></p>' +
                 '</span></div></tpl>',
                 store: new Ext.data.DirectStore({
                     reader: new Ext.data.JsonReader({
                         successProperty: 'success',
                         idProperty: 'Id',
                         root: 'data',
                         fields: ['Id', 'Name', 'Code', 'PartNumber', 'MeasurementUnit', 'ItemSpecification', 'Weight', 'UnitId', 'IsSerialItem', 'IsLOTItem', 'AvailableQuantity']
                     }),
                     api: { read: Psms.GetItemBySearch }
                 }),
                 valueField: 'Name',
                 displayField: 'Name',
                 listeners: {
                     beforeQuery: function (combo, record, index) {
                         var form = Ext.getCmp('goodsRequest-form').getForm();
                         var storeId = form.findField('StoreId').getValue();
                         var detailDrid = Ext.getCmp('goodsRequest-detailGrid');
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

                         var detailDrid = Ext.getCmp('goodsRequest-detailGrid');
                         var selectedrecord = detailDrid.currentRecord;
                         var store = detailDrid.getStore();
                         var index = store.findBy(function (item, id) {
                             if (id != selectedrecord.id && item.data.ItemName === record.get("Name")) return true;
                             else return false;
                         });

                         if (index == -1) {
                             selectedrecord.set('ItemId', record.get("Id"));
                             selectedrecord.set('Code', record.get("Code"));
                             selectedrecord.set('Unit', record.get("MeasurementUnit"));
                             selectedrecord.set('UnitId', record.get("UnitId"));
                             selectedrecord.set('TechnicalSpecification', record.get("ItemSpecification"));
                             selectedrecord.set('AvailableQuantity', record.get("AvailableQuantity"));
                             selectedrecord.set('PartNumber', record.get("PartNumber"));
                         }
                         else {
                             Ext.MessageBox.show({
                                 title: 'Error',
                                 msg: "The item is already added!",
                                 buttons: Ext.Msg.OK,
                                 icon: Ext.MessageBox.ERROR,
                                 scope: this
                             });
                         }
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
             dataIndex: 'Unit',
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

                         var detailDrid = Ext.getCmp('goodsRequest-detailGrid');
                         var selectedrecord = detailDrid.currentRecord;
                         selectedrecord.set('UnitId', record.get("Id"));
                     }
                 }
             })
         }, {
             dataIndex: 'Quantity',
             header: 'Quantity',
             sortable: true,
             width: 80,
             menuDisabled: true,
             editor: {
                 xtype: 'numberfield',
                 allowBlank: false
             }
         },  {
             dataIndex: 'TechnicalSpecification',
             header: 'Technical Spec.',
             sortable: true,
             width: 150,
             menuDisabled: true,
             editor: {
                 xtype: 'textarea',
                 allowBlank: false
             }
         }]
    }, config));
};
Ext.extend(Ext.erp.ux.goodsRequest.DetailGrid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ voucherTypeId: this.voucherTypeId }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Pick Items',
            id: 'pickItems',
            iconCls: 'icon-search',
            handler: this.onPickItems
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: false,
            handler: function () {
                var detailDrid = Ext.getCmp('goodsRequest-detailGrid');
                var store = detailDrid.getStore();

                var defaultData = {
                    Remark: '',
                    TechnicalSpecification: ''

                };
                var records = new store.recordType(defaultData);
                store.add(records);
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Remove Items',
            id: 'removeItems',
            iconCls: 'icon-delete',
            handler: this.onRemoveClick
        }, ];
        this.bbar = [{
            xtype: 'button',
            text: 'Save',
            id: 'savePR',
            iconCls: 'icon-save',
            handler: this.onSaveClick,
            scope: this
        },{
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Revise',
            iconCls: 'icon-accept',
            handler: this.onReviseClick,
            scope: this
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Delete',
            iconCls: 'icon-delete',
            handler: this.onDeleteClick
        },{
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Order',
            iconCls: 'icon-accept',
            handler: this.onOrderClick,
            scope: this
        },];
        Ext.erp.ux.goodsRequest.DetailGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        Ext.erp.ux.goodsRequest.DetailGrid.superclass.afterRender.apply(this, arguments);
    },
    onNewClick: function () {

        Ext.getCmp('savePR').setDisabled(false);
        var voucherHeaderGrid = Ext.getCmp('goodsRequest-grid');
        voucherHeaderGrid.getSelectionModel().deselectRange(0, voucherHeaderGrid.pageSize);
        Ext.getCmp('goodsRequest-form').getForm().reset();
        Ext.getCmp('goodsRequest-form').onConsumerTypeChange();
        Ext.getCmp('goodsRequest-detailGrid').getStore().removeAll();
    },
    onSaveClick: function () {
        var form = Ext.getCmp('goodsRequest-form');
        if (!form.getForm().isValid()) return;
        var grid = Ext.getCmp('goodsRequest-detailGrid');
        var rec = '';
        var store = grid.getStore();
        var qtyError = '';

        store.each(function (item) {
            if (item.data['Quantity'] == 0 || item.data['Quantity'] == null || item.data['Quantity'] == "" || item.data['Quantity'] == '') {
                qtyError = 'For item "' + item.data['ItemName'] + '" quantity cannot be empty or zero';
                return;
            }
            if (typeof item.data['ItemName'] == "undefined" || item.data['ItemName'] == "") {
                qtyError = 'For item "' + item.data['ItemName'] + '" ItemName cant be empty';
                return;
            }
            rec = rec + item.data['Id'] + ':' +
                    item.data['ItemName'] + ':' +
                    item.data['Quantity'] + ':' +
                    item.data['Description'] + ':' +
                    item.data['ItemId'] + ':' +
                    item.data['StoreId'] + ':' +
                    item.data['UnitId'] + ':' +
                    item.data['TechnicalSpecification'] + ':' +
                    item.data['Remark'] + ';';
        });
        if (qtyError != '') {
            var msg = Ext.MessageBox;
            Ext.erp.ux.SystemMessageManager.show({
                title: ' ',
                msg: qtyError,
                buttons: msg.OK,
                icon: msg.ERROR,
                cls: 'msgbox-critical',
                width: 400
            });
            return;
        }
        if (rec.length == '') {
            var msg = Ext.MessageBox;
            Ext.erp.ux.SystemMessageManager.show({
                title: ' ',
                msg: "Voucher Details cannot be empty !",
                buttons: msg.OK,
                icon: msg.ERROR,
                cls: 'msgbox-critical',
                width: 400
            });
            return;
        }
        Ext.getCmp('goodsRequest-detailGrid').formSubmit(rec);
    },
    onOrderClick: function () {
        if (!Ext.getCmp('goodsRequest-grid').getSelectionModel().hasSelection()) return;
        var form = Ext.getCmp('goodsRequest-form').getForm();
        var storeRequisitionHeaderId = form.findField('Id').getValue();
        var consumer = "",consumerId = "",orderType="";
        var consumerType = form.findField('ConsumerType').getRawValue();
        var store = form.findField('Store').getValue();
        var storeId = form.findField('StoreId').getValue();

        var gridDetail = Ext.getCmp('goodsRequest-detailGrid');
        var selectedRecords = gridDetail.getSelectionModel().getSelections();
        consumer = consumerType == 'Store' ? form.findField('ConsumerStore').getRawValue() :
                   consumerType == 'Employee' ? form.findField('ConsumerEmployee').getRawValue() :
                   consumerType == 'Unit' ? form.findField('ConsumerUnit').getRawValue() : "";
     
        consumerId = consumerType == 'Store' ? form.findField('ConsumerStoreId').getRawValue() :
                    consumerType == 'Employee' ? form.findField('ConsumerEmployeeId').getRawValue() :
                    consumerType == 'Unit' ? form.findField('ConsumerUnitId').getRawValue() : "";

        orderType = consumerType == 'Store' ? "Transfer Issue" : "Store Issue";

        new Ext.erp.ux.requestOrder.Window({
            title: " Order",
            orderType: orderType,
            store: store,
            storeId: storeId,
            consumerType:consumerType,
            consumerStore: consumerId,
            consumerStore: consumer,
            storeRequisitionHeaderId: storeRequisitionHeaderId,
            selectedRecords: selectedRecords,

        }).show();
    },
    onReviseClick: function () {
        this.action = 'revise';
        this.onSaveClick();
    },
    formSubmit: function (rec) {
        var form = Ext.getCmp('goodsRequest-form');
        form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ storeRequisitionDetails: rec, action: this.action }) },
            success: function () {
                Ext.getCmp('goodsRequest-form').getForm().reset();
                Ext.getCmp('goodsRequest-form').refreshForm();
                Ext.getCmp('goodsRequest-paging').doRefresh();
            },
            failure: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Failure',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            },
            scope: this,
        });
    },
    onRemoveClick: function () {
        var grid = Ext.getCmp('goodsRequest-detailGrid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var record = grid.getSelectionModel().getSelected();
        if (record !== undefined) {
            grid.store.remove(record);
        }
    },
    onPickItems: function () {
        var form = Ext.getCmp('goodsRequest-form').getForm();
        var storeId = form.findField('StoreId').getValue();
        var detailGrid = Ext.getCmp('goodsRequest-detailGrid');
        new Ext.erp.ux.itemPicker.Window({
            title: 'Pick Item',
            targetGrid: detailGrid,     
            storeId: storeId,
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('goodsRequest-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');

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
                    StoreRequest.Delete(id, function (result) {
                        if (result.success) {
                            Ext.getCmp('goodsRequest-paging').doRefresh();
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
});
Ext.reg('goodsRequest-detailGrid', Ext.erp.ux.goodsRequest.DetailGrid);

/**
* @desc      goodsRequest grid
* @author    Henock Melisse
* @copyright (c) 2010, Cybersoft
* @date      November 19, 2013
* @namespace Ext.erp.ux.goodsRequest
* @class     Ext.erp.ux.goodsRequest.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.goodsRequest.Grid = function (config) {
    Ext.erp.ux.goodsRequest.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: window.StoreRequest.GetAllHeaders,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DSC'
            },
            fields: ['Id', 'VoucherNumber', 'ReferenceNo', 'Requester', 'StoreRequestType', 'Date', 'RequiredDate', 'RequestPurpose', 'Status', 'StatusId'],
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
        id: 'goodsRequest-grid',
        searchCriteria: {},
        pageSize: 30,
        height: 300,
        stripeRows: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                scope: this,
                rowSelect: function () {
                    var status = Ext.getCmp('goodsRequest-grid').getSelectionModel().getSelected().get('Status');
                    if (status == "Posted") {
                        Ext.getCmp('savePR').setDisabled(false);
                    }
                    else {
                        Ext.getCmp('savePR').setDisabled(true);
                    }
                }
            }
        }),
        viewConfig: {

        },
        listeners: {
            rowClick: function () {
                this.loadVoucherHeader();
                this.loadVoucherDetail();
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
        }, new Ext.grid.RowNumberer(),
        {
            dataIndex: 'Status',
            header: 'Status',
            sortable: true,
            width: 110,
            menuDisabled: true
        },{
            dataIndex: 'VoucherNumber',
            header: 'Voucher Number',
            sortable: true,
            width: 100,
            menuDisabled: true
        },  {
            dataIndex: 'Requester',
            header: 'Requested By',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Date',
            header: 'Request Date',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'RequiredDate',
            header: 'Required Date',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, ]
    }, config));
};
Ext.extend(Ext.erp.ux.goodsRequest.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.tbar = [
            {
            xtype: 'button',
            text: 'Preview',
            id: 'GoodsRequest-previewPR',
            iconCls: 'icon-preview',
            handler: this.onPreview
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'textfield',
            emptyText: 'Type Search text here and press "Enter"',
            submitEmptyText: false,
            enableKeyEvents: true,
            style: {
                borderRadius: '25px',
                padding: '0 10px',
                width: '200px'
            },
            listeners: {
                specialKey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        var grid = Ext.getCmp('goodsRequest-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    var grid = Ext.getCmp('goodsRequest-grid');
                    grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                    grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                }
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'goodsRequest-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.goodsRequest.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.ux.goodsRequest.Grid.superclass.afterRender.apply(this, arguments);
    },
    onPreview: function () {
        var grid = Ext.getCmp('goodsRequest-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
        window.open('Reports/ErpReportViewer.aspx?rt=PreviewSR&id=' + id, 'PreviewSR', parameter);
    },
    loadVoucherHeader: function () {
        if (!this.getSelectionModel().hasSelection()) return;
        var id = this.getSelectionModel().getSelected().get('Id');    
        var form = Ext.getCmp('goodsRequest-form');
        if (typeof id != "undefined" && id != null) {
            form.load({
                params: { id: id },
                success: function () {
                    var form = Ext.getCmp('goodsRequest-form');
                    form.onConsumerTypeChange();
                }
            });
        }
    },
    loadVoucherDetail: function () {
        var voucherDetailGrid = Ext.getCmp('goodsRequest-detailGrid');
        var voucherDetailStore = voucherDetailGrid.getStore();
        if (this.getSelectionModel().hasSelection()) {
            storeRequisitionHeaderId = this.getSelectionModel().getSelected().get('Id');
        }
        voucherDetailStore.baseParams = { record: Ext.encode({ storeRequisitionHeaderId: storeRequisitionHeaderId }) };
        voucherDetailStore.load({
            params: { start: 0, limit: voucherDetailGrid.pageSize }
        });
    }

});
Ext.reg('goodsRequest-grid', Ext.erp.ux.goodsRequest.Grid);


/**
* @desc      goodsRequest panel
* @author    Henock Melisse
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @version   $Id: goodsRequest.js, 0.1
* @namespace Ext.erp.ux.goodsRequest
* @class     Ext.erp.ux.goodsRequest.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.goodsRequest.Panel = function (config) {
    Ext.erp.ux.goodsRequest.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.goodsRequest.Panel, Ext.Panel, {
    initComponent: function () {
        this.goodsRequestForm = new Ext.erp.ux.goodsRequest.Form();
        this.headerGrid = new Ext.erp.ux.goodsRequest.Grid();
        this.detailGrid = new Ext.erp.ux.goodsRequest.DetailGrid();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                split: true,
                width: 450,
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
                    items: [this.goodsRequestForm, this.detailGrid]
                }]
            }]
        }];
        Ext.erp.ux.goodsRequest.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('storeRequest-panel', Ext.erp.ux.goodsRequest.Panel);
