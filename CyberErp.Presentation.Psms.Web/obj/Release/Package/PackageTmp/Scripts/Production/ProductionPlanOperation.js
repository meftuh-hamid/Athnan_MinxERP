Ext.ns('Ext.erp.ux.productionPlanOperation');

/**
* @desc      user grid

* @copyright (c) 2012, 
* @namespace Ext.erp.ux.productionPlanOperation
* @class     Ext.erp.ux.productionPlanOperation.Grid
* @extends   Ext.grid.GridPanel
*/
var operationSelectionModel = new Ext.grid.RowSelectionModel();

Ext.erp.ux.productionPlanOperation.Grid = function (config) {
    Ext.erp.ux.productionPlanOperation.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ProductionPlan.GetAllOperation,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'ProductionPlanHeaderId', 'OperationId', 'Description', 'HourRate', 'Status', 'OperationTime', 'AssignedEmployeeId', 'AssignedEmployee', 'StartDate', 'EndDate', 'Interval', 'StatusId', 'Status', 'WorkStationId', 'WorkStation', 'Remark'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('productionPlanOperation-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('productionPlanOperation-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('productionPlanOperation-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'productionPlanOperation-grid',
        pageSize: 20,
        height:300,
        stripeRows: true,
        border: false,
        clicksToEdit: 1,
        sm: operationSelectionModel,
        listeners: {
            rowclick: function (grid, rowIndex, e) {
                var grid = Ext.getCmp('productionPlanOperation-grid');
                var selectedRecord = grid.getSelectionModel().getSelected();
                var id = selectedRecord.get("Id");
               
                var operationTeamGrid = Ext.getCmp('productionPlanOperationTeam-grid');
                operationTeamGrid.productionPlanJobCardId = id;
                var store = operationTeamGrid.getStore();
                store.baseParams = { record: Ext.encode({ productionPlanJobCardId: id, action: '' }) };
                operationTeamGrid.getStore().reload({
                    params: {
                        start: 0,
                        limit: operationTeamGrid.pageSize
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
        }, new Ext.grid.RowNumberer(),
       
          {
              dataIndex: 'Description',
              header: 'Operation',
              sortable: false,
              width: 120,
              menuDisabled: true,
              editor: new Ext.form.ComboBox({
                  xtype: 'combo',
                  fieldLabel: 'WorkStation',
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
                          fields: ['Id', 'Name','WorkStationId','WorkStation']
                      }),
                      autoLoad: true,
                      api: { read: Psms.GetOperation }
                  }),
                  valueField: 'Name',
                  displayField: 'Name',
                  listeners: {
                      select: function (cmb, rec, idx) {
                          var grid = Ext.getCmp('productionPlanOperation-grid');
                          var selectedrecord = grid.getSelectionModel().getSelected();
                          var store = grid.getStore();
                          selectedrecord.set('OperationId', rec.get("Id"));
                          selectedrecord.set('WorkStationId', rec.get("WorkStationId"));
                          selectedrecord.set('WorkStation', rec.get("WorkStation"));
                      },
                  }
              })
          }, {
              dataIndex: 'WorkStation',
              header: 'WorkStation',
              sortable: false,
              width: 100,
              menuDisabled: true,
              editor: new Ext.form.ComboBox({
                  xtype: 'combo',
                  fieldLabel: 'WorkStation',
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
                      api: { read: Psms.GetWorkStation }
                  }),
                  valueField: 'Name',
                  displayField: 'Name',
                  listeners: {
                      select: function (cmb, rec, idx) {
                          var grid = Ext.getCmp('productionPlanOperation-grid');
                          var selectedrecord = grid.getSelectionModel().getSelected();
                          var store = grid.getStore();
                              selectedrecord.set('WorkStationId', rec.get("Id"));
                      },
                  }
              })
          }, {
              dataIndex: 'HourRate',
              header: 'HourRate',
              sortable: false,
              width: 90,
              hidden:true,
              menuDisabled: true,
              editor: new Ext.form.NumberField({
              })
          }, {
              dataIndex: 'OperationTime',
              header: 'Operation Time(Minute)',
              sortable: false,
              width: 100,
              menuDisabled: true,
              editor: new Ext.form.NumberField({
              })
          }, {
              dataIndex: 'AssignedEmployee',
              header: 'Assigned Employee',
              sortable: false,
              width: 120,
              menuDisabled: true,
              xtype: 'combocolumn',
              editor: new Ext.form.ComboBox(
                  {
                      hiddenName: 'Name',
                      xtype: 'combo',
                      fieldLabel: 'Item',
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
                              fields: ['Id', 'Name', 'Code', 'UnitId', 'MeasurementUnit']
                          }),
                          autoLoad: true,
                          api: { read: Psms.GetEmployeeBySearch }
                      }),
                      valueField: 'Name',
                      displayField: 'Name',
                      pageSize: 10,
                      listeners: {
                          select: function (cmb, rec, idx) {
                              var grid = Ext.getCmp('productionPlanOperation-grid');
                              var selectedrecord = grid.getSelectionModel().getSelected();
                              selectedrecord.set('AssignedEmployeeId', rec.get("Id"));
                          },
                      }
                  })
          }, {
              dataIndex: 'StartDate',
              header: 'Start Date',
              sortable: false,
              width: 100,
              menuDisabled: true,
              editor: new Ext.form.DateField({         
              })
          }, {
              dataIndex: 'EndDate',
              header: 'EndDate',
              sortable: false,
              hidden: true,
              width: 100,
              menuDisabled: true,
              editor: new Ext.form.DateField({
              })
          }, {
              dataIndex: 'Interval',
              header: 'Interval',
              sortable: false,
              width: 80,
              hidden:true,
              menuDisabled: true,
              editor: new Ext.form.NumberField({
              })
          }, {
              dataIndex: 'Status',
              header: 'Status',
              sortable: false,
              hidden:true,
              width: 100,
              menuDisabled: true,
              editor: new Ext.form.ComboBox({
                  xtype: 'combo',
                  fieldLabel: 'WorkStation',
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
                  valueField: 'Name',
                  displayField: 'Name',
                  listeners: {
                      select: function (cmb, rec, idx) {
                          var grid = Ext.getCmp('productionPlanOperation-grid');
                          var selectedrecord = grid.getSelectionModel().getSelected();
                          var store = grid.getStore();
                          selectedrecord.set('StatusId', rec.get("Id"));
                      },
                  }
              })
          }, {
                dataIndex: 'Remark',
                header: 'Remark',
                width: 120,
                menuDisabled: true,
                editor: new Ext.form.TextArea({
                    height: 150,

                })
            }]
    }, config));
}
Ext.extend(Ext.erp.ux.productionPlanOperation.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: "" }) };
        this.tbar = [
            {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: false,
            handler: function () {
                var detailDrid = Ext.getCmp('productionPlanOperation-grid');
                var store = detailDrid.getStore();

                var defaultData = {
                    Remark: '',
                    HourRate: 0,
                    SequenceNo: 0,
                    OperationTime: 0,
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
                var grid = Ext.getCmp('productionPlanOperation-grid');

                if (!grid.getSelectionModel().hasSelection())
                    return;

                var selectedrecord = grid.getSelectionModel().getSelected();
                grid.getStore().remove(selectedrecord);
            }
        }, {
            xtype: 'button',
            text: 'Save',
            iconCls: 'icon-save',
            disabled: false,
            handler: this.onSave,
        }, {
            xtype: 'button',
            text: 'Load',
            iconCls: 'icon-accept',
            disabled: false,
            hidden:true,
            handler: function () {
                var operationGrid = Ext.getCmp('productionPlanOperation-grid');
                var id = operationGrid.productionPlanId;
                var store = operationGrid.getStore();

                store.baseParams = { record: Ext.encode({ productionOrderId: id, action: 'boM' }) };
                operationGrid.getStore().reload({
                    params: {
                        start: 0,
                        limit: operationGrid.pageSize
                    }
                });
            }
        }, {
            xtype: 'textfield',
            emptyText: 'Type Search text here and press "Enter"',
            submitEmptyText: false,
            hidden:true,
            enableKeyEvents: true,
            style: {
                borderRadius: '25px',
                padding: '0 10px',
                width: '280px'
            },
            listeners: {
                specialKey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        var grid = Ext.getCmp('productionPlanOperation-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), productionPlanId: grid.productionPlanId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('productionPlanOperation-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), productionPlanId: grid.productionPlanId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }];
        this.bbar = [
            
            new Ext.PagingToolbar({
            id: 'productionPlanOperation-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        })];
        Ext.erp.ux.productionPlanOperation.Grid.superclass.initComponent.apply(this, arguments);
    },
    onSave: function () {

        var grid = Ext.getCmp('productionPlanOperation-grid');
        var rec = '';
        var store = grid.getStore();
        var rec = '', errorMesssage = "";
        var productionPlanId = grid.productionPlanId;
        store.each(function (item) {
            if (typeof item.get('Description') == 'undefined' || item.get('Description') =="") {
                if (errorMesssage == "")
                    errorMesssage = "Operation";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Operation";
            }
            if (typeof item.get('WorkStationId') == 'undefined' || item.get('WorkStationId') =="") {
                if (errorMesssage == "")
                    errorMesssage = "WorkStation";
                else
                    errorMesssage = errorMesssage + "</br>" + "          WorkStation";
            }


            var startdate = '', endDate = '';;
            if (item.data['StartDate'] instanceof Date && !isNaN(item.data['StartDate'].valueOf()))
                var startdate = (new Date(item.data['StartDate'])).format('M/d/y');
            if (item.data['EndDate'] instanceof Date && !isNaN(item.data['EndDate'].valueOf()))
                var startdate = (new Date(item.data['EndDate'])).format('M/d/y');

            rec = rec + item.data['Id'] + ':' +
           item.data['ProductionPlanHeaderId'] + ':' +
           item.data['OperationId'] + ':' +
            item.data['WorkStationId'] + ':' +
           item.data['AssignedEmployeeId'] + ':' +
           item.data['HourRate'] + ':' +
           item.data['OperationTime'] + ':' +
         
           startdate + ':' +
           startdate + ':' +
           item.data['Interval'] + ':' +
           item.data['StatusId'] + ':' +
           item.data['Remark'] + ';';
        
        });
        if (errorMesssage != '') {
            Ext.MessageBox.show({
                title: 'Save failed',
                msg: "Please Enter Valid values for Item  " + item.data['Description'] + " for feilds " + "</br>" + errorMesssage,
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
        ProductionPlan.SaveOperation(productionPlanId, rec, function (result) {
            if (result.success) {
                Ext.getCmp('productionPlanOperation-paging').doRefresh();
                Ext.MessageBox.show({
                    title: 'Success',
                    msg: result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
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
    afterRender: function () {
        this.store.baseParams = { record: Ext.encode({ productionPlanId: this.productionPlanId }) };
        
        Ext.erp.ux.productionPlanOperation.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('productionPlanOperation-grid', Ext.erp.ux.productionPlanOperation.Grid);


/**
* @desc      Permission registration form host window

* @copyright (c) 2010, 
* @date      November 01, 2010
* @namespace Ext.erp.ux.productionPlanOperation
* @class     Ext.erp.ux.productionPlanOperation.Window
* @extends   Ext.Window
*/
Ext.erp.ux.productionPlanOperation.Window = function (config) {
    Ext.erp.ux.productionPlanOperation.Window.superclass.constructor.call(this, Ext.apply({
        title: 'Item WorkStations',
        layout: 'hbox',
        width: 500,
        bodyStyle: 'margin: 5px; padding-right: 10px',
        align: 'stretch',
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
    }, config));
}
Ext.extend(Ext.erp.ux.productionPlanOperation.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.productionPlanOperation.Grid(
            {
                OperationId: this.productionPlanId
            });
        this.items = [this.grid];

        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSave,
            scope: this
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.erp.ux.productionPlanOperation.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        var grid = Ext.getCmp('productionPlanOperation-grid');
        var rec = '';
        var store = grid.getStore();
        var rec = '';
        store.each(function (item) {

            rec = rec + item.data['Id'] + ':' +
           item.data['MeasurementWorkStationId'] + ':' +
           item.data['ConversionRate'] + ':' +
           item.data['Remark'] + ';';

        });
        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
        Item.SaveItemWorkStation(this.productionPlanId, rec, function (result) {
            if (result.success) {
                Ext.getCmp('productionPlanOperation-paging').doRefresh();
                Ext.MessageBox.show({
                    title: 'Success',
                    msg: result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
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
    onClose: function () {
        this.close();
    }
});
Ext.reg('productionPlanOperation-Window', Ext.erp.ux.productionPlanOperation.Window);






