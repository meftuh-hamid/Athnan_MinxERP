Ext.ns('Ext.erp.ux.productionJobCardStatus');


/**
* @desc      productionJobCardStatus form

* @copyright (c) 2013, 
* @date      June 22, 2013
* @namespace Ext.erp.ux.productionJobCardStatus
* @class     Ext.erp.ux.productionJobCardStatus.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.productionJobCardStatus.Form = function (config) {
    Ext.erp.ux.productionJobCardStatus.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: ProductionPlan.GetJobCard,
            submit: ProductionPlan.SaveJobCard
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'productionJobCardStatus-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        getMinute: function () {
            var form = Ext.getCmp('productionJobCardStatus-form').getForm();
            const startDate = form.findField('StartDate').getValue();
            const endDate = form.findField('EndDate').getValue();
            const startTime = form.findField('StartMinute').getValue();
            const endTime = form.findField('EndMinute').getValue();
            if ((startDate instanceof Date && !isNaN(startDate.valueOf())) && (endDate instanceof Date && !isNaN(endDate.valueOf()))) {
                var difference = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
                if ((typeof startTime != 'undefined' && startTime != '') && (typeof endTime != 'undefined' && endTime != '')) {
                    var hourDiff = parseFloat(endTime.split(':')[0]) - parseFloat((startTime.split(':')[0]));
                    var minuteDiff = parseFloat(endTime.split(':')[1]) - parseFloat((startTime.split(':')[1]));
                    var starttype = startTime.split(' ')[2];
                    var endType = endTime.split(' ')[2];
                    var hours = 0;
                    if (starttype == endType) {
                        hours = Math.abs(hourDiff);
                    }
                    else {
                        hours = Math.abs(hourDiff + 12);

                    }
                    var totalHour = Math.round(minuteDiff / 60) + hours + difference * 60;
                    form.findField('Interval').setValue(totalHour);
                }
            }
        },
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
                    name: 'CreatedAt',
                    xtype: 'hidden'
                }, {
                    name: 'StatusId',
                    xtype: 'hidden'
                }, {
                    name: 'PreparedById',
                    xtype: 'hidden'
                }, {
                    name: 'ProductionPlanHeaderId',
                    xtype: 'hidden'
                }, {
                    name: 'OperationId',
                    xtype: 'hidden'
                }, {
                    name: 'AssignedEmployeeId',
                    xtype: 'hidden'
                }, {
                    name: 'WorkStationId',
                    xtype: 'hidden'
                }, {
                    name: 'HourRate',
                    xtype: 'hidden'
                }, {
                    name: 'Number',
                    xtype: 'textfield',
                    fieldLabel: 'Number',
                    width: 100,
                    readOnly: false,
                    allowBlank: true,
                    listeners: {
                        change: function (cmb, newValue, idx) {
                            var form = Ext.getCmp('productionJobCardStatus-form').getForm();
                            var planNo = form.findField("Number").getValue();
                            var operationColumn=Ext.getCmp('productionPlan-operation');
                            
                            operationColumn.store.baseParams = { planNo: planNo };
                            operationColumn.getStore().reload({
                                params: {
                                    start: 0,
                                    limit: operationColumn.pageSize
                                }
                            });
                        },
                    }
                },
                {
                    hiddenName: 'JobCardOperation',
                    xtype: 'combo',
                    fieldLabel: 'Operation',
                    id:'productionPlan-operation',
                    typeAhead: false,
                    width: 100,
                    hideTrigger: false,
                    minChars: 2,
                    listWidth: 280,
                    emptyText: '---Type to Search---',
                    mode: 'remote',
                    allowBlank: false,
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> {Code}</div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name', 'ProductionPlanHeaderId']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetJobCardOperation }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10,
                    listeners: {
                        beforequery: function (cmb, rec, idx) {
                            var form = Ext.getCmp('productionJobCardStatus-form').getForm();
                            var planNo = form.findField("Number").getValue();
                            this.store.baseParams = { planNo: planNo };
                            this.getStore().reload({
                                params: {
                                    start: 0,
                                    limit: this.pageSize
                                }
                            });
                        }, select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('productionJobCardStatus-form').getForm();
                            form.findField("ProductionPlanHeaderId").setValue(rec.data['ProductionPlanHeaderId']);
                            ProductionPlan.UpdateJobcarStatus(rec.data['ProductionPlanHeaderId'], rec.id, function (result) {
                                if (result.success) {
                                    Ext.getCmp('productionJobCardStatus-productionJobCardStatuspaging').doRefresh();
                                    var form = Ext.getCmp('productionJobCardStatus-form').getForm();
                                    form.load({
                                        params: { id: rec.id },
                                        success: function () {
                                       
                                        }
                                    });
                                }
                                else {
                                    Ext.MessageBox.show({
                                        title: 'Error',
                                        msg: result.data,
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.MessageBox.ERROR,
                                        scope: this
                                    });
                                }
                            }, this);

                        },
                    }
              },
                 {
                    name: 'StartDate',
                    xtype: 'datefield',
                    fieldLabel: 'Start Date',
                    width: 100,
                    readOnly: false,
                    allowBlank: false,
                    change: function (cmb, newvalue, oldvalue) {
                        Ext.getCmp('productionJobCardStatus-form').getMinute();
                    }
                }, {
                    name: 'StartMinute',
                    xtype: 'timefield',
                    fieldLabel: 'Start Hour',
                    width: 100,
                    readOnly: false,
                    allowBlank: true,
                    change: function (cmb, newvalue, oldvalue) {
                        Ext.getCmp('productionJobCardStatus-form').getMinute();
                    }
                },  {
                        name: 'Interval',
                        xtype: 'numberfield',
                        fieldLabel: 'Interval(Hr)',
                        width: 100,
                        readOnly: false,
                        value: 0,
                        allowBlank: true
                    },  {
                        name: 'Remark',
                        xtype: 'textarea',
                        fieldLabel: 'Remark',
                        width: 100,
                        readOnly: false,
                        allowBlank: true
                    }, ]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [
                  {
                      name: 'EndDate',
                      xtype: 'datefield',
                      fieldLabel: 'End Date',
                      width: 100,
                      readOnly: false,
                      allowBlank: true,
                      change: function (cmb, newvalue, oldvalue) {
                          Ext.getCmp('productionJobCardStatus-form').getMinute();
                      }
                  }, {
                      name: 'EndMinute',
                      xtype: 'timefield',
                      fieldLabel: 'End Hour',
                      width: 100,
                      readOnly: false,
                      allowBlank: true, change: function (cmb, newvalue, oldvalue) {
                          Ext.getCmp('productionJobCardStatus-form').getMinute();
                      }
                  }, {
                      hiddenName: 'Status',
                      xtype: 'combo',
                      fieldLabel: 'Status',
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
                          api: { read: Psms.GetVoucherStatus }
                      }),
                      valueField: 'Id',
                      displayField: 'Name',
                      listeners: {
                          select: function (cmb, rec, idx) {
                              var form = Ext.getCmp('productionJobCardStatus-form').getForm();
                              form.findField("StatusId").setValue(rec.id);
                          },
                      }
                  },

                ]
            }, ]
        }],
        tbar : [
               {
                   xtype: 'button',
                   text: 'Add',
                   iconCls: 'icon-add',
                   disabled: false,
                   handler: function () {
                       var form = Ext.getCmp('productionJobCardStatus-form').getForm();
                       form.reset();
                       Ext.getCmp('productionJobCardStatus-detailGrid').getStore().removeAll();
                   },
               }, {
                   xtype: 'button',
                   text: 'Save',
                   iconCls: 'icon-save',
                   disabled: false,
                   handler: function () {
                       var form = Ext.getCmp('productionJobCardStatus-form');
                       if (!form.getForm().isValid()) return;
                       var statusId = form.getForm().findField('StatusId').getValue();
                       var id = form.getForm().findField('Id').getValue();
                       var grid = Ext.getCmp('productionJobCardStatus-detailGrid');
                       var store = grid.getStore();
                       var rec = '';
                       form.errorMesssage = "";
                       var store = grid.getStore();
                       rec = form.parseDetailData(store);
                       if (form.errorMesssage != "")
                           return;                     
                       form.getForm().submit({
                           waitMsg: 'Please wait...',
                           success: function () {
                               if (rec != '')
                                   form.saveDetail(rec, id, statusId);
                               else
                               {
                                   Ext.getCmp('productionJobCardStatus-form').getForm().reset();
                                   Ext.getCmp('productionJobCardStatus-productionJobCardStatuspaging').doRefresh();
                                   Ext.getCmp('productionJobCardStatus-detailGrid').getStore().removeAll();

                               }
                             
                            
                           },
                           failure: function (option, response) {
                               Ext.MessageBox.show({
                                   title: 'Failure',
                                   msg: response.result.data,
                                   buttons: Ext.Msg.OK,
                                   icon: Ext.MessageBox.ERROR,
                                   scope: this
                               });
                           }
                       });
                   },
               }, ],
        parseDetailData: function (store) {
            var rec = '';
            var form = Ext.getCmp('productionJobCardStatus-form');

            store.each(function (item) {
                form.errorMesssage = form.validateDetailData(item);
                if (form.errorMesssage != '') {
                    Ext.MessageBox.show({
                        title: 'Save failed',
                        msg: "Please Enter Valid values for Item  " + item.data['Name'] + " for feilds " + "</br>" + form.errorMesssage,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,
                        scope: this
                    });
                    return;
                }
                rec = rec + item.data['Id'] + ':' +

                    item.data['ProductionPlanJobCardDetailId'] + ':' +
                    item.data['ItemId'] + ':' +
                    item.data['Quantity'] + ':' +
                    item.data['AcceptedQuantity'] + ':' +
                    item.data['RemainingQuantity'] + ':' +
                    item.data['ReturnedQuantity'] + ':' +
                    item.data['Remark'] + ';';

            });
            return rec;
        },
        validateDetailData: function (item) {
            var errorMesssage = '';
            var grid = Ext.getCmp('productionJobCardStatus-detailGrid');
          
            if (typeof item.get('Quantity') == 'undefined' || item.get('Quantity') < 0) {
                if (errorMesssage == "")
                    errorMesssage = "Quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "           Quantity";
            }
            if (item.get('RemainingQuantity') > item.get('Quantity')) {
                if (errorMesssage == "")
                    errorMesssage = "Remaining Quantity should be greater than  quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "           Remaining Quantity should be greater than  quantity";
            }

            return errorMesssage;
        },
        saveDetail: function (rec, id, statusId) {
            ProductionPlan.SaveResultDetail(rec, id, statusId, function (result) {
                if (result.success) {
                    Ext.getCmp('productionJobCardStatus-form').getForm().reset();
                    Ext.getCmp('productionJobCardStatus-productionJobCardStatuspaging').doRefresh();
                    Ext.getCmp('productionJobCardStatus-detailGrid').getStore().removeAll();
                }
                else {
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: result.data,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,
                        scope: this
                    });
                }
            }, this);
        }

    }, config));
};
Ext.extend(Ext.erp.ux.productionJobCardStatus.Form, Ext.form.FormPanel);
Ext.reg('productionJobCardStatus-form', Ext.erp.ux.productionJobCardStatus.Form);


/**
* @desc      productionJobCardStatus detailGrid

* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.productionJobCardStatus
* @class     Ext.erp.ux.productionJobCardStatus.GridDetail
* @extends   Ext.grid.GridPanel
*/
var productionJobCardStatusSelectionModel = new Ext.grid.RowSelectionModel({
});
Ext.erp.ux.productionJobCardStatus.GridDetail = function (config) {
    Ext.erp.ux.productionJobCardStatus.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ProductionPlan.GetAllResultDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'ProductionPlanJobCardDetailId', 'ItemId', 'UnitId', 'MeasurementUnit', 'RemainingQuantity', 'AcceptedQuantity', 'ReturnedQuantity', 'Name', 'Code', 'Quantity', 'Remark'],

            remoteSort: true,
            listeners: {
                load: function () {
                }
            }
        }),
        id: 'productionJobCardStatus-detailGrid',
        clicksToEdit: 1,
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: true,
        serialStore: new Ext.data.Store(),
        lOTStore: new Ext.data.Store(),
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true
        },
        listeners: {
            beforeLoad: function () {
                Ext.getCmp('productionJobCardStatus-detailGrid').body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
                Ext.getCmp('productionJobCardStatus-detailGrid').body.unmask();
            },
            loadException: function () {
                Ext.getCmp('productionJobCardStatus-detailGrid').body.unmask();
            },
            afteredit: function (e) {
                var record = e.record;
                if (record.get('UnitPrice') > 0 || e.field == 'SoldQuantity' || e.field == 'UnitPrice') {
                }
            }
        },
        sm: productionJobCardStatusSelectionModel,
        cm: new Ext.grid.ColumnModel({
            columns: [
                new Ext.grid.RowNumberer(),
                {
                    dataIndex: 'Code',
                    header: 'Code',
                    sortable: true,
                    width: 100,
                    menuDisabled: true
                }, {
                    dataIndex: 'Name',
                    header: 'Name',
                    sortable: true,
                    width: 140,
                    readOnly: true,
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
                        tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> {Code}</div></tpl>',
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'Name', 'Code', 'Color', 'Size', 'IsSerialItem', 'IsLOTItem', 'UnitId', 'MeasurementUnit', 'UnitPrice', 'PriceGroup', 'PriceGroupId']
                            }),
                            api: { read: Psms.GetItemBySearch }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        listeners: {
                            select: function (combo, record, index) {
                                var detailDrid = Ext.getCmp('productionJobCardStatus-detailGrid');
                                var selectedrecord = detailDrid.getSelectionModel().getSelected();
                                selectedrecord.set('ItemId', record.get("Id"));
                                selectedrecord.set('UnitId', record.get("UnitId"));
                                selectedrecord.set('Code', record.get("Code"));
                                selectedrecord.set('ReturnedQuantity', 0);
                                selectedrecord.set('RemainingQuantity', 0);
                                selectedrecord.set('AcceptedQuantity', 0);
                                selectedrecord.set('Quantity', 0);
                                selectedrecord.set('MeasurementUnit', record.get("MeasurementUnit"));
                            }
                        }
                    })
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

                                var detailGrid = Ext.getCmp('productionJobCardStatus-detailGrid');
                                var selectedrecord = detailGrid.getSelectionModel().getSelected();
                                selectedrecord.set('UnitId', record.get("Id"));
                            }
                        }
                    })
                }, 
                {
                    dataIndex: 'Quantity',
                    header: 'Quantity',
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
                     dataIndex: 'AcceptedQuantity',
                     header: 'Accepted Quantity',
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
                     dataIndex: 'ReturnedQuantity',
                     header: 'Returned Quantity',
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
                 },
            ]
        })
    }, config));
}
Ext.extend(Ext.erp.ux.productionJobCardStatus.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };

        this.tbar = [
            {
                hiddenName: 'Status',
                xtype: 'combo',
                id:'productionJobCardStatus-statusCombo',
                fieldLabel: 'Sales Area',
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
                    api: { read: Psms.GetProductionStatus }
                }),
                valueField: 'Id',
                displayField: 'Name',
                listeners: {
                    select: function (cmb, rec, idx) {
                        var form = Ext.getCmp('productionJobCardStatus-form');
                        var statusId = form.getForm().findField('StatusId').getValue();
                        var id = form.getForm().findField('Id').getValue();
                        var grid = Ext.getCmp('productionJobCardStatus-detailGrid');
                        var store = grid.getStore();
                        store.baseParams = { record: Ext.encode({ voucherHeaderId: id, statusId: statusId}) };
                        grid.getStore().reload({
                            params: {
                                start: 0,
                                limit: grid.pageSize
                            }
                        });
                    }
                }
            }, {
                xtype: 'button',
                text: 'Remove',
                iconCls: 'icon-exit',
                disabled: false,
                handler: function () {
                    var grid = Ext.getCmp('productionJobCardStatus-detailGrid');

                    if (!grid.getSelectionModel().hasSelection())
                        return;

                    var selectedrecord = grid.getSelectionModel().getSelected();
                    grid.getStore().remove(selectedrecord);
                }
            },
            '->',
            {
                xtype: 'button',
                text: 'Select Items',
                hidden: false,
                iconCls: 'icon-accept',
                disabled: false,
                handler: function () {
                    var detailGrid = Ext.getCmp('productionJobCardStatus-detailGrid');
                    new Ext.erp.ux.itemPicker.Window({
                        targetGrid: detailGrid
                    }).show();
                }
            },

        ]
        this.bbar = [{
            xtype: 'displayfield',
            id: "productionJobCardStatus-totalSummary",
            style: 'font-weight: bold;font-size:12px;'
        }, ]

        Ext.erp.ux.productionJobCardStatus.GridDetail.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        Ext.erp.ux.productionJobCardStatus.GridDetail.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('productionJobCardStatus-detailGrid', Ext.erp.ux.productionJobCardStatus.GridDetail);


/**
* @desc      productionJobCardStatus Grid

* @copyright (c) 2013, 
* @date      June 22, 2013
* @namespace Ext.erp.ux.productionJobCardStatus
* @class     Ext.erp.ux.productionJobCardStatus.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.productionJobCardStatus.Grid = function (config) {
    Ext.erp.ux.productionJobCardStatus.Grid.superclass.constructor.call(this, Ext.apply({

        store: new Ext.data.GroupingStore({
            proxy: new Ext.data.DirectProxy({
                directFn: ProductionPlan.GetAllOperationForStatus,
                paramsAsHash: false,
                paramOrder: 'start|limit|sort|dir|record',
            }),
            reader: new Ext.data.JsonReader({
                root: 'data',
                idProperty: 'Id',
                totalProperty: 'total',
                sortInfo: {
                    field: 'VoucherNumber',
                    direction: 'ASC'
                },
                fields: ['Id', 'VoucherNumber', 'OperationId', 'Description','Status', 'WorkStation', 'HourRate', 'OperationTime', 'AssignedEmployeeId', 'AssignedEmployee', ],
            }),
            groupField: 'VoucherNumber',
            sortInfo: {
                field: 'VoucherNumber',
                direction: 'ASC'
            },
            remoteSort: true,
            listeners: {
                beforeLoad: function () { this.body.mask('Loading...', 'x-mask-loading'); },
                load: function () { this.body.unmask(); },
                loadException: function () { this.body.unmask(); },
                scope: this
            }
        }),
        view: new Ext.grid.GroupingView({
            forceFit: true,
            showGroupName: false,
            groupTextTpl: '{text}'
        }),
        id: 'productionJobCardStatus-grid',
        selectedUnitTypeId: 0,
        pageSize: 30,
        height: 300,
        stripeRows: true,
        border: false,
        columnLines: true,
        listeners: {
            rowclick: function (grid, rowIndex, e) {
                var grid = Ext.getCmp('productionJobCardStatus-grid');
                var selectedRecord = grid.getSelectionModel().getSelected();
                var id = selectedRecord.get("Id");               
                var form = Ext.getCmp('productionJobCardStatus-form').getForm();
                form.load({
                    params: { id: id },
                    success: function () {
                        var grid = Ext.getCmp('productionJobCardStatus-grid');
                        var selectedRecord = grid.getSelectionModel().getSelected();
                        var form = Ext.getCmp('productionJobCardStatus-form').getForm();
                        form.findField('JobCardOperation').setRawValue(selectedRecord.get('Description'));
                        form.findField('Number').setRawValue(selectedRecord.get('VoucherNumber'));

                    }
                });

            },
            scope: this
        },
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            //       autoFill: true
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'Status',
            header: 'Status',
            sortable: true,
            width: 100,
            menuDisabled: true,
        }, {
            dataIndex: 'VoucherNumber',
            header: 'Plan Number',
            sortable: true,
            width: 100,
            hidden:true,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'Description',
            header: 'Description',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'WorkStation',
            header: 'Work Station',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'OperationTime',
            header: 'Operation Time(Minute)',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'AssignedEmployee',
            header: 'Assigned',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, ]
    }, config));
}
Ext.extend(Ext.erp.ux.productionJobCardStatus.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [
        {
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
                        var grid = Ext.getCmp('productionJobCardStatus-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('productionJobCardStatus-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'productionJobCardStatus-productionJobCardStatuspaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.productionJobCardStatus.Grid.superclass.initComponent.apply(this, arguments);
    },
   
    
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.productionJobCardStatus.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('productionJobCardStatus-grid', Ext.erp.ux.productionJobCardStatus.Grid);



/**
* @desc      productionJobCardStatus panel

* @copyright (c) 2013, 
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.productionJobCardStatus
* @class     Ext.erp.ux.productionJobCardStatus.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.productionJobCardStatus.Panel = function (config) {
    Ext.erp.ux.productionJobCardStatus.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'productionJobCardStatus-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.productionJobCardStatus.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.productionJobCardStatus.Grid();
        this.detailgrid = new Ext.erp.ux.productionJobCardStatus.GridDetail();
        this.form = new Ext.erp.ux.productionJobCardStatus.Form();
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
                items: [this.grid]
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
                    items: [this.form, this.detailgrid]
                }]
            }]
        }];
       
        Ext.erp.ux.productionJobCardStatus.Panel.superclass.initComponent.apply(this, arguments);
    },
   
});
Ext.reg('productionJobCardStatus-panel', Ext.erp.ux.productionJobCardStatus.Panel);
