Ext.ns('Ext.erp.ux.productionPlan');

/**
* @desc      productionPlan form

* @copyright (c) 2013, 
* @date      June 22, 2013
* @namespace Ext.erp.ux.productionPlan
* @class     Ext.erp.ux.productionPlan.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.productionPlan.Form = function (config) {
    Ext.erp.ux.productionPlan.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: ProductionPlan.Get,
            submit: ProductionPlan.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'productionPlan-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        loadDocument: function () {

            ProductionOrder.GetDocumentNo(function (result) {

                var form = Ext.getCmp('productionPlan-form').getForm();
                form.findField('VoucherNumber').setValue(result.data.DocNo);
                form.findField('StatusId').setValue(result.data.StatusId);
                form.findField('PreparedById').setValue(result.data.EmployeeId);
                form.findField('PreparedBy').setValue(result.data.Employee);
                form.findField('Status').setValue(result.data.Status);
            });
        },
        getMinute: function () {
            var form = Ext.getCmp('productionPlan-form').getForm();
            const startDate = form.findField('PlanStartDate').getValue();
            const endDate = form.findField('PlanEndDate').getValue();
            const startTime = form.findField('PlanStartTime').getValue();
            const endTime = form.findField('PlanEndTime').getValue();
            if ((startDate instanceof Date && !isNaN(startDate.valueOf())) && (endDate instanceof Date && !isNaN(endDate.valueOf())))
            {
                var difference = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
                if ((typeof startTime!='undefined' && startTime!='') && (typeof endTime!='undefined' && endTime!='')) {
                    var hourDiff = parseFloat(endTime.split(':')[0]) - parseFloat((startTime.split(':')[0]));
                    var minuteDiff = parseFloat(endTime.split(':')[1]) - parseFloat((startTime.split(':')[1]));
                    var starttype = startTime.split(' ')[2];
                    var endType = endTime.split(' ')[2];
                    var hours=0;
                    if (starttype == endType)
                    {
                        hours= Math.abs(hourDiff);
                    }
                    else {
                        hours = Math.abs(hourDiff+12);

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
                },  {
                    name: 'CreatedAt',
                    xtype: 'hidden'
                },  {
                    name: 'StatusId',
                    xtype: 'hidden'
                }, {
                    name: 'PreparedById',
                    xtype: 'hidden'
                }, {
                    name: 'VoucherNumber',
                    xtype: 'textfield',
                    fieldLabel: 'Plan No',
                    width: 100,
                    readOnly: false,
                    allowBlank: true
                },  {
                    name: 'PlanStartDate',
                    xtype: 'datefield',
                    fieldLabel: 'Plan Start Date',
                    width: 100,
                    readOnly: false,
                    allowBlank: false,
                    listeners: {
                        change: function (cmb, newvalue, oldvalue) {
                                Ext.getCmp('productionPlan-form').getMinute();
                         }
                    }
                }, {
                    name: 'PlanStartTime',
                    xtype: 'timefield',
                    fieldLabel: 'Plan Start Time',
                    width: 100,
                    readOnly: false,
                    allowBlank: false,
                    listeners: {
                        change: function (cmb, newvalue, oldvalue) {
                            Ext.getCmp('productionPlan-form').getMinute();
                        }
                    }
                },
                    {
                        name: 'PlanEndDate',
                        xtype: 'datefield',
                        fieldLabel: 'Plan End Date',
                        width: 100,
                        readOnly: false,
                        allowBlank: false,
                        listeners: {
                            change: function (cmb, newvalue, oldvalue) {
                                Ext.getCmp('productionPlan-form').getMinute();
                            }
                        }
                    }, {
                        name: 'PlanEndTime',
                        xtype: 'timefield',
                        fieldLabel: 'Plan End Time',
                        width: 100,
                        readOnly: false,
                        allowBlank: false,
                        listeners: {
                            change: function (cmb, newvalue, oldvalue) {
                                Ext.getCmp('productionPlan-form').getMinute();
                            }
                        }
                    }, ]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [
                   {
                       name: 'Interval',
                       xtype: 'numberfield',
                       fieldLabel: 'Interval(Hour)',
                       width: 100,
                       readOnly: false,
                       value: 0,
                       allowBlank: true
                   }, {
                       hiddenName: 'PreparedBy',
                       xtype: 'combo',
                       fieldLabel: 'Prepared By',
                       typeAhead: false,
                       hideTrigger: true,
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
                               fields: ['Id', 'Name']
                           }),
                           autoLoad: true,
                           api: { read: Psms.GetEmployeeBySearch }
                       }),
                       valueField: 'Name',
                       displayField: 'Name',
                       pageSize: 10, listeners: {
                           select: function (cmb, rec, idx) {
                               var form = Ext.getCmp('productionPlan-form').getForm();
                               form.findField('PreparedById').setValue(rec.id);
                           },
                           change: function (cmb, newvalue, oldvalue) {
                               if (newvalue == "") {
                                   var form = Ext.getCmp('productionPlan-form').getForm();
                                   form.findField('PreparedById').reset();
                               }
                           }
                       }
                   }, {
                      name: 'PlannedOperatingCost',
                      xtype: 'numberfield',
                      fieldLabel: 'Planned Operating Cost',
                      width: 100,
                      readOnly: true,
                      hidden:true,
                      value: 0,
                      allowBlank: true
                  }, {
                      name: 'ActualOperatingCost',
                      xtype: 'numberfield',
                      fieldLabel: 'Actual Operating Cost',
                      width: 100,
                      hidden: true,
                      readOnly: true,
                      value: 0,
                      allowBlank: true
                  },{
                      name: 'AdditionalCost',
                      xtype: 'numberfield',
                      fieldLabel: 'Additional Cost',
                      width: 100,
                      hidden: true,
                      readOnly: true,
                      value: 0,
                      allowBlank: true
                  },{
                      name: 'MaterialCost',
                      xtype: 'numberfield',
                      fieldLabel: 'Material Cost',
                      width: 100,
                      hidden: true,
                      readOnly: true,
                      value: 0,
                      allowBlank: true
                  },{
                      name: 'Total',
                      xtype: 'numberfield',
                      fieldLabel: 'Total',
                      width: 100,
                      hidden: true,
                      readOnly: true,
                      value:0,
                      allowBlank: true
                  }, {
                      name: 'Remark',
                      xtype: 'textarea',
                      fieldLabel: 'Remark',
                      width: 100,
                      readOnly: false,
                      allowBlank: true
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
                              var form = Ext.getCmp('productionPlan-form').getForm();
                              form.findField("StatusId").setValue(rec.id);
                          },
                      }
                  }, 
                  
                ]
            },]
        }]

    
    }, config));
};
Ext.extend(Ext.erp.ux.productionPlan.Form, Ext.form.FormPanel);
Ext.reg('productionPlan-form', Ext.erp.ux.productionPlan.Form);

/**
* @desc      productionPlan Grid

* @copyright (c) 2013, 
* @date      June 22, 2013
* @namespace Ext.erp.ux.productionPlan
* @class     Ext.erp.ux.productionPlan.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.productionPlan.Grid = function (config) {
    Ext.erp.ux.productionPlan.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ProductionPlan.GetAllHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'VoucherNumber', 'PlanStartDate', 'PlanEndDate', 'Interval', 'PlanStartTime', 'PlanEndTime', 'PreparedBy', 'ActualOperatingCost', 'PlannedOperatingCost', 'AdditionalCost', 'MaterialCost', 'TotalCost', 'StatusId', 'Status', 'PreparedBy', 'SalesArea'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('productionPlan-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('productionPlan-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('productionPlan-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'productionPlan-grid',
        selectedUnitTypeId: 0,
        pageSize: 30,
        height: 300,
        stripeRows: true,
        border: false,
        columnLines: true,
        listeners: {
            rowclick: function (grid, rowIndex, e) {
                var grid = Ext.getCmp('productionPlan-grid');
                var selectedRecord = grid.getSelectionModel().getSelected();
                var id = selectedRecord.get("Id");
                var form = Ext.getCmp('productionPlan-form').getForm();
                form.load({
                    params: { id: id },
                    success: function () {
                    }
                });
                var detailGrid = Ext.getCmp('productionPlan-detailGrid');
                var store = detailGrid.getStore();
                store.baseParams = { record: Ext.encode({ voucherHeaderId: id, action: '' }) };
                detailGrid.getStore().reload({
                    params: {
                        start: 0,
                        limit: detailGrid.pageSize
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
            dataIndex: 'VoucherNumber',
            header: 'Plan Number',
            sortable: true,
            width: 100,

            menuDisabled: true,
            renderer: this.customRenderer,

        },{
            dataIndex: 'PlanStartDate',
            header: 'Start Date',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'PlanEndDate',
            header: 'End Date',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'PlanStartTime',
            header: 'Start Time',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'PlanEndTime',
            header: 'End Time',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'Interval',
            header: 'Interval',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'PreparedBy',
            header: 'Prepared By',
            sortable: true,
            width: 80,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, ]
    }, config));
}
Ext.extend(Ext.erp.ux.productionPlan.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [
            {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Preview',
                 hidden: false,
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
                        var grid = Ext.getCmp('productionPlan-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('productionPlan-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'productionPlan-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.productionPlan.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {

        var grid = Ext.getCmp('productionPlan-grid');
        if (!grid.getSelectionModel().hasSelection()) return;


        var voucherId = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        window.open('Reports/ErpReportViewer.aspx?rt=PreviewProductionPlan&id=' + voucherId, 'PreviewIV', parameter);


    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.productionPlan.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('productionPlan-Grid', Ext.erp.ux.productionPlan.Grid);
/**
* @desc      Production Order detailGrid

* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.productionPlan
* @class     Ext.erp.ux.productionPlan.GridDetail
* @extends   Ext.grid.GridPanel
*/
var productionPlanSelectionModel = new Ext.grid.RowSelectionModel({
});
Ext.erp.ux.productionPlan.GridDetail = function (config) {
    Ext.erp.ux.productionPlan.GridDetail.superclass.constructor.call(this, Ext.apply({

        store: new Ext.data.GroupingStore({
            proxy: new Ext.data.DirectProxy({
                directFn: ProductionPlan.GetAllDetail,
                paramsAsHash: false,
                paramOrder: 'start|limit|sort|dir|record',
            }),
            reader: new Ext.data.JsonReader({
                root: 'data',
                idProperty: 'Id',
                totalProperty: 'total',
                sortInfo: {
                    field: 'ProductionCenter',
                    direction: 'ASC'
                },
                fields: ['Id', 'ProductionPlanHeaderId', 'ProductionOrderDetailId', 'ProductionCenter', 'Assigned','AssignedId', 'Name', 'Code','Quantity', 'RemainingQuantity', 'StatusId', 'Remark'],
            }),
            groupField: 'ProductionCenter',
            sortInfo: {
                field: 'ProductionCenter',
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

      
        id: 'productionPlan-detailGrid',
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
                this.body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
                this.body.unmask();
            },
            loadException: function () {
                this.body.unmask();
            },
            afteredit: function (e) {
                var record = e.record;

            }
        },
        sm: productionPlanSelectionModel,
        cm: new Ext.grid.ColumnModel({
            columns: [
                new Ext.grid.RowNumberer(),
                {
                    dataIndex: 'ProductionCenter',
                    header: 'ProductionCenter',
                    sortable: true,
                    hidden:true,
                    width: 140,
                    menuDisabled: true,
                }, {
                    dataIndex: 'Name',
                    header: 'Name',
                    sortable: true,
                    width: 140,
                    menuDisabled: true,
                }, {
                    dataIndex: 'Code',
                    header: 'Code',
                    sortable: true,
                    width: 90,
                    menuDisabled: true
                }, {
                    dataIndex: 'RemainingQuantity',
                    header: 'Remaining Qty',
                    sortable: true,
                    width: 70,

                    hidden: true,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000 ');
                    }
                },
                {
                    dataIndex: 'Assigned',
                    header: 'Assigned',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,
                    xtype: 'combocolumn',
                    editor: new Ext.form.ComboBox(
                        {
                            hiddenName: 'Assigned',
                            xtype: 'combo',
                            fieldLabel: 'Assigned',
                            typeAhead: false,
                            width: 100,
                            hideTrigger: true,
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
                                    fields: ['Id', 'Name', 'Code']
                                }),
                                autoLoad: true,
                                api: { read: Psms.GetEmployeeBySearch }
                            }),
                            valueField: 'Name',
                            displayField: 'Name',
                            pageSize: 10,
                            listeners: {
                                select: function (cmb, rec, idx) {
                                    var grid = Ext.getCmp('productionPlan-detailGrid');
                                    var selectedrecord = grid.getSelectionModel().getSelected();
                                    selectedrecord.set('AssignedId', rec.get("Id"));
                                },
                            }
                        })
                },
                {
                    dataIndex: 'Quantity',
                    header: 'Qty',
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
Ext.extend(Ext.erp.ux.productionPlan.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [          
           {
               xtype: 'button',
               text: 'Remove',
               iconCls: 'icon-exit',
               disabled: false,
               handler: function () {
                   var grid = Ext.getCmp('productionPlan-detailGrid');

                   if (!grid.getSelectionModel().hasSelection())
                       return;

                   var selectedrecord = grid.getSelectionModel().getSelected();
                   grid.getStore().remove(selectedrecord);
               }
           },]
        this.bbar = [{
            xtype: 'button',
            text: 'New',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Production Plan', 'CanAdd'),
            handler: this.onAdd
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Save',
            iconCls: 'icon-save',
            disabled: !Ext.erp.ux.Reception.getPermission('Production Plan', 'CanAdd'),

            handler: this.onSave
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Void',
            iconCls: 'icon-delete',
            disabled: !Ext.erp.ux.Reception.getPermission('Production Plan', 'CanDelete'),
            handler: this.onDelete
        }, ]
        Ext.erp.ux.productionPlan.GridDetail.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {

        var grid = Ext.getCmp('productionOrder-grid');
        if (!grid.getSelectionModel().hasSelection()) return;


        var voucherId = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        window.open('Reports/ErpReportViewer.aspx?rt=PreviewProductionOrder&id=' + voucherId, 'PreviewIV', parameter);


    },
   
    onAdd: function () {
       Ext.getCmp('productionPlan-detailGrid').getStore().removeAll();
       Ext.getCmp('productionPlan-form').getForm().reset();
       Ext.getCmp('productionPlan-form').loadDocument();
    },

    onSave: function () {
        var form = Ext.getCmp('productionPlan-form').getForm();

        if (!form.isValid()) return;
        var grid = Ext.getCmp('productionPlan-detailGrid');
        var store = grid.getStore();
        var rec = '';
        this.errorMesssage = "";
        var store = grid.getStore();
        if (store.getCount() < 1) {
            Ext.MessageBox.show({
                title: 'Save failed',
                msg: "Please Add detail items",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        rec = Ext.getCmp('productionPlan-detailGrid').parseDetailData(store);
        if (this.errorMesssage != "")
            return;
        Ext.getCmp('productionPlan-detailGrid').submitForm(rec);

    },
    parseDetailData: function (store) {
        var rec = '';
        store.each(function (item) {
            Ext.getCmp('productionPlan-detailGrid').errorMesssage = Ext.getCmp('productionPlan-detailGrid').validateDetailData(item);
            if (Ext.getCmp('productionPlan-detailGrid').errorMesssage != '') {
                Ext.MessageBox.show({
                    title: 'Save failed',
                    msg: "Please Enter Valid values for Item  " + item.data['Name'] + " for feilds " + "</br>" + Ext.getCmp('productionPlan-detailGrid').errorMesssage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
            rec = rec + item.data['Id'] + ':' +
                 item.data['ProductionPlanHeaderId'] + ':' +
                item.data['ProductionOrderDetailId'] + ':' +
                item.data['Quantity'] + ':' +
                item.data['RemainingQuantity'] + ':' +
            item.data['Remark'] + ':' +
            item.data['AssignedId'] + ';';

        });
        return rec;
    },
    validateDetailData: function (item) {
        var errorMesssage = '';
        var form = Ext.getCmp('productionPlan-form').getForm();
        var grid = Ext.getCmp('productionPlan-detailGrid');


       
        if (typeof item.get('Quantity') == 'undefined' || item.get('Quantity') < 0) {
            if (errorMesssage == "")
                errorMesssage = "Quantity";
            else
                errorMesssage = errorMesssage + "</br>" + "           Quantity";
        }
        if (typeof item.get('AssignedId') == 'undefined' || item.get('AssignedId') < 0) {
            if (errorMesssage == "")
                errorMesssage = "Assigned Person";
            else
                errorMesssage = errorMesssage + "</br>" + "           Assigned Person";
        }
        return errorMesssage;
    },
    submitForm: function (rec) {
        var form = Ext.getCmp('productionPlan-form').getForm();

        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
        form.submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ productionPlanDetails: rec, action:'' }) },

            success: function (form, action) {

                Ext.getCmp('productionPlan-form').getForm().reset();
                Ext.getCmp('productionPlan-detailGrid').getStore().removeAll();
                Ext.getCmp('productionPlan-paging').doRefresh();
                Ext.MessageBox.show({
                    title: 'Success',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    scope: this
                });
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
    onDelete: function () {
        var grid = Ext.getCmp('productionPlan-grid');
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
                    ProductionPlan.Void(id, function (result) {
                        if (result.success) {
                            Ext.getCmp('productionPlan-paging').doRefresh();
                            Ext.getCmp('productionPlan-detailGrid').getStore().removeAll();
                            Ext.getCmp('productionPlan-form').getForm().reset();
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
    afterRender: function () {

        Ext.erp.ux.productionPlan.GridDetail.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('productionPlan-detailGrid', Ext.erp.ux.productionPlan.GridDetail);


/**
* @desc      productionPlan Grid

* @copyright (c) 2013, 
* @date      June 22, 2013
* @namespace Ext.erp.ux.productionPlan
* @class     Ext.erp.ux.productionPlan.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.productionPlan.ProductionOrderGrid = function (config) {
    Ext.erp.ux.productionPlan.ProductionOrderGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ProductionOrder.GetAllHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DESC'
            },
            fields: ['Id', 'VoucherNumber', 'ReferenceNo', 'Date', 'PromisedDate', 'Customer', 'StatusId', 'Status', 'PreparedBy', 'SalesArea'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { this.body.mask('Loading...', 'x-mask-loading'); },
                load: function () { this.body.unmask(); },
                loadException: function () { this.body.unmask(); },
                scope: this
            }
        }),
        id: 'productionPlan-productionOrderGrid',
        selectedUnitTypeId: 0,
        pageSize: 30,
        height: 300,
        stripeRows: true,
        border: false,
        columnLines: true,
        listeners: {
            rowclick: function (grid, rowIndex, e) {
                var grid = Ext.getCmp('productionPlan-productionOrderGrid');
                var selectedRecord = grid.getSelectionModel().getSelected();
                var id = selectedRecord.get("Id");              
                var poGrid = Ext.getCmp('productionPlan-pOGridDetail');
                var store = poGrid.getStore();
                store.baseParams = { record: Ext.encode({ voucherHeaderId: id, action: 'plan' }) };
                poGrid.getStore().reload({
                    params: {
                        start: 0,
                        limit: poGrid.pageSize
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
            dataIndex: 'VoucherNumber',
            header: 'Order Number',
            sortable: true,
            width: 90,

            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'ReferenceNo',
            header: 'Reference No',
            sortable: true,
            width: 90,

            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'PromisedDate',
            header: 'Promised Date',
            sortable: true,
            width: 80,
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
            dataIndex: 'Customer',
            header: 'Customer',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'Date',
            header: 'Date',
            sortable: true,
            width: 80,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'PreparedBy',
            header: 'Prepared By',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        } ,{
            dataIndex: 'Status',
            header: 'Status',
            sortable: true,
            width: 50,
            menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.get("Status") == "Approved")
                    return '<img src="Content/images/app/OkPass.png"/>';
                else if (record.get("Status") == "Certified")
                    return '<img src="Content/images/app/pending.png"/>';
                else
                    return '<img src="Content/images/app/Cancel1.png"/>';
            }
        },]
    }, config));
}
Ext.extend(Ext.erp.ux.productionPlan.ProductionOrderGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ type: "forProductionPlan" }) };
        this.tbar = [ {
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
                        var grid = Ext.getCmp('productionPlan-productionOrderGrid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('productionPlan-productionOrderGrid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'productionPlan-productionOrderGridpaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.productionPlan.ProductionOrderGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.productionPlan.ProductionOrderGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('productionPlan-productionOrderGrid', Ext.erp.ux.productionPlan.ProductionOrderGrid);


/**
* @desc      Production Order detailGrid

* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.productionPlan
* @class     Ext.erp.ux.productionPlan.GridDetail
* @extends   Ext.grid.GridPanel
*/
var productionplanPOSelectionModel = new Ext.grid.CheckboxSelectionModel({
});
Ext.erp.ux.productionPlan.POGridDetail = function (config) {
    Ext.erp.ux.productionPlan.POGridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ProductionOrder.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'ProductionPlanHeaderId', 'ProductionOrderDetailId', 'ProductionCenter', 'Name', 'Code', 'Quantity', 'RemainingQuantity', 'StatusId', 'Remark'],

            remoteSort: true,
            listeners: {
                load: function () {
                }
            }
        }),
        id: 'productionPlan-pOGridDetail',
        clicksToEdit: 1,
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: true,
        height: 250,
        serialStore: new Ext.data.Store(),
        lOTStore: new Ext.data.Store(),
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
        },
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
            afteredit: function (e) {
                var record = e.record;

            }
        },
        sm: productionplanPOSelectionModel,
        cm: new Ext.grid.ColumnModel({
            columns: [
                new Ext.grid.RowNumberer(),productionplanPOSelectionModel,
                {
                    dataIndex: 'Name',
                    header: 'Name',
                    sortable: true,
                    width: 140,
                    menuDisabled: true,
                }, {
                    dataIndex: 'Code',
                    header: 'Code',
                    sortable: true,
                    width: 100,
                    menuDisabled: true
                },  {
                    dataIndex: 'RemainingQuantity',
                    header: 'Remaining Qty',
                    sortable: true,
                    width: 70,
                    hidden: false,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000 ');
                    }
                },
                {
                    dataIndex: 'Quantity',
                    header: 'Qty',
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
            ]
        })
    }, config));
}
Ext.extend(Ext.erp.ux.productionPlan.POGridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };

        this.tbar = [
           {
                 xtype: 'button',
                 text: 'Move to Plan',
                 iconCls: 'icon-add',
                 handler: function () {
                     var podetailDrid = Ext.getCmp('productionPlan-pOGridDetail');
                     if (!podetailDrid.getSelectionModel().hasSelection()) return;
                     var selectedItems = podetailDrid.getSelectionModel().getSelections();
                     var detailDrid = Ext.getCmp('productionPlan-detailGrid');
                     var store = detailDrid.getStore();
                     var item = store.recordType;
                     var poHeader = Ext.getCmp('productionPlan-productionOrderGrid');
                     var selectedRecord = poHeader.getSelectionModel().getSelected();
                     var remark = selectedRecord.get('VoucherNumber') + "-" + selectedRecord.get('ReferenceNo')
                     for (var i = 0; i < selectedItems.length; i++) {

                         var index = store.findExact("ProdutionOrderDetailId", selectedItems[i].get('Id'))
                         if (index == -1) {

                             var p = new item({
                                 ProductionOrderDetailId: selectedItems[i].get('Id'),
                                 Name: selectedItems[i].get('Name'),
                                 Code: selectedItems[i].get('Code'),
                                 Quantity: selectedItems[i].get('Quantity'),
                                 RemainingQuantity: selectedItems[i].get('Quantity'),
                                 ProductionCenter: selectedItems[i].get('ProductionCenter'),
                                 Remark: remark
                             });
                             var count = store.getCount();
                             store.insert(count, p);
                         }
                     }
                 }
             }]
        Ext.erp.ux.productionPlan.POGridDetail.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        Ext.erp.ux.productionPlan.POGridDetail.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('productionPlan-pOGridDetail', Ext.erp.ux.productionPlan.POGridDetail);



/**
* @desc      aTCCollectionDetail panel
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      December 22, 2014
* @version   $Id: aTCCollection.js, 0.1
* @namespace Ext.erp.ux.productionPlanDetail
* @class     Ext.erp.ux.productionPlanDetail.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.productionPlan.DetailPanel = function (config) {
    Ext.erp.ux.productionPlan.DetailPanel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.productionPlan.DetailPanel, Ext.Panel, {
    initComponent: function () {
        this.form = new Ext.erp.ux.productionPlan.Form();
        this.detailGrid = new Ext.erp.ux.productionPlan.GridDetail();
        this.items = [{
            layout: 'vbox',
            layoutConfig: {
                type: 'hbox',
                align: 'stretch',
                pack: 'start'
            },
            defaults: {
                flex: 1
            },
            items: [this.form, this.detailGrid]
        }

        ];

        Ext.erp.ux.productionPlan.DetailPanel.superclass.initComponent.apply(this, arguments);

    }

});
Ext.reg('aTCCollectionDetail-panel', Ext.erp.ux.productionPlan.DetailPanel);




/**
* @desc      productionPlan panel

* @copyright (c) 2013, 
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.productionPlan
* @class     Ext.erp.ux.productionPlan.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.productionPlan.Panel = function (config) {
    Ext.erp.ux.productionPlan.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'productionPlan-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.productionPlan.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.productionPlan.Grid();
        this.detailPanel = new Ext.erp.ux.productionPlan.DetailPanel();
        this.productiongrid = new Ext.erp.ux.productionPlan.ProductionOrderGrid();
        this.productionOrderDetail =new Ext.erp.ux.productionPlan.POGridDetail();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                split: true,
                width: 320,
                minSize: 200,
                maxSize: 600,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [{
                    layout: 'border',
                    border: false,
                    items: [
                        {
                            region: 'center',
                            border: false,
                            collapsible: true,
                            items: [this.productiongrid]
                        },
                        {
                            region: 'south',
                            border: false,
                            height: 340,
                            collapsible: true,
                            layout: 'fit',
                            items: [this.productionOrderDetail],
                        }
                    ]
                }]
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
                    items: [this.detailPanel]

                }]
            }, {
                region: 'east',
                border: true,
                collapsible: true,
                split: true,
                width: 320,
                minSize: 200,
                maxSize: 600,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.grid]
            }, ]
        }];
        Ext.erp.ux.productionPlan.Panel.superclass.initComponent.apply(this, arguments);
    },
    onSave: function () {
        var form = Ext.getCmp('productionPlan-form');

        if (!form.getForm().isValid()) return;
        form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('productionPlan-form').getForm().reset();
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
});
Ext.reg('productionPlan-panel', Ext.erp.ux.productionPlan.Panel);
