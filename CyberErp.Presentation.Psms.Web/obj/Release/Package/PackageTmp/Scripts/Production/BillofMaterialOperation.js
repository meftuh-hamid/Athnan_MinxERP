Ext.ns('Ext.erp.ux.billofMaterialOperation');

/**
* @desc      user grid

* @copyright (c) 2012, 
* @namespace Ext.erp.ux.billofMaterialOperation
* @class     Ext.erp.ux.billofMaterialOperation.Grid
* @extends   Ext.grid.GridPanel
*/
var operationSelectionModel = new Ext.grid.RowSelectionModel();

Ext.erp.ux.billofMaterialOperation.Grid = function (config) {
    Ext.erp.ux.billofMaterialOperation.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: BillofMaterial.GetAllOperation,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'BillofMaterialHeaderId', 'OperationId', 'Description', 'SequenceNo', 'WorkStationId', 'WorkStation', 'HourRate', 'OperationTime', 'Remark'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('billofMaterialOperation-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('billofMaterialOperation-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('billofMaterialOperation-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'billofMaterialOperation-grid',
        pageSize: 20,
        height:350,
        stripeRows: true,
        border: false,
        clicksToEdit: 1,
        sm: operationSelectionModel,
      
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(),
        {
            dataIndex: 'SequenceNo',
            header: 'Sequence No',
            sortable: false,
            width: 110,
            menuDisabled: true,
            editor: new Ext.form.NumberField({
            })
        },
          {
              dataIndex: 'Description',
              header: 'Operation',
              sortable: false,
              width: 200,
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
                          var grid = Ext.getCmp('billofMaterialOperation-grid');
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
              width: 200,
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
                          var grid = Ext.getCmp('billofMaterialOperation-grid');
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
              width: 100,
              menuDisabled: true,
              editor: new Ext.form.NumberField({         
              })
          }, {
              dataIndex: 'OperationTime',
              header: 'Operation Time(Hr)',
              sortable: false,
              width: 150,
              menuDisabled: true,
              editor: new Ext.form.NumberField({
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
Ext.extend(Ext.erp.ux.billofMaterialOperation.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: "" }) };
        this.tbar = [
            {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: false,
            handler: function () {
                var detailDrid = Ext.getCmp('billofMaterialOperation-grid');
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
                var grid = Ext.getCmp('billofMaterialOperation-grid');

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
            xtype: 'textfield',
            emptyText: 'Type Search text here and press "Enter"',
            submitEmptyText: false,
            enableKeyEvents: true,
            style: {
                borderRadius: '25px',
                padding: '0 10px',
                width: '280px'
            },
            listeners: {
                specialKey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        var grid = Ext.getCmp('billofMaterialOperation-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), OperationId: grid.OperationId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('billofMaterialOperation-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), OperationId: grid.OperationId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        },
       ];
        this.bbar = [
            
            new Ext.PagingToolbar({
            id: 'billofMaterialOperation-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        })];
        Ext.erp.ux.billofMaterialOperation.Grid.superclass.initComponent.apply(this, arguments);
    },
    onSave: function () {

        var grid = Ext.getCmp('billofMaterialOperation-grid');
        var rec = '';
        var store = grid.getStore();
        var rec = '', errorMesssage = "";
        var billofMaterail = grid.billofMaterialId;
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
            if (typeof item.get('HourRate') == 'undefined' || item.get('HourRate') <0) {
                if (errorMesssage == "")
                    errorMesssage = "HourRate";
                else
                    errorMesssage = errorMesssage + "</br>" + "          HourRate";
            }
            if (typeof item.get('OperationTime') == 'undefined' || item.get('OperationTime') <= 0) {
                if (errorMesssage == "")
                    errorMesssage = "OperationTime";
                else
                    errorMesssage = errorMesssage + "</br>" + "          OperationTime";
            }
           
            rec = rec + item.data['Id'] + ':' +
           item.data['BillofMaterialHeaderId'] + ':' +
           item.data['OperationId'] + ':' +          
           item.data['WorkStationId'] + ':' +
           item.data['Description'] + ':' +
           item.data['HourRate'] + ':' +
           item.data['OperationTime'] + ':' +
           item.data['Remark'] + ':' +
            item.data['SequenceNo'] + ';';
      
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
        BillofMaterial.SaveOperation(billofMaterail, rec, function (result) {
            if (result.success) {
                Ext.getCmp('billofMaterialOperation-paging').doRefresh();
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
        this.store.baseParams = { record: Ext.encode({ billofMaterialId: this.OperationId }) };
        
        Ext.erp.ux.billofMaterialOperation.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('billofMaterialOperation-grid', Ext.erp.ux.billofMaterialOperation.Grid);


/**
* @desc      Permission registration form host window

* @copyright (c) 2010, 
* @date      November 01, 2010
* @namespace Ext.erp.ux.billofMaterialOperation
* @class     Ext.erp.ux.billofMaterialOperation.Window
* @extends   Ext.Window
*/
Ext.erp.ux.billofMaterialOperation.Window = function (config) {
    Ext.erp.ux.billofMaterialOperation.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.erp.ux.billofMaterialOperation.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.billofMaterialOperation.Grid(
            {
                OperationId: this.OperationId
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
        Ext.erp.ux.billofMaterialOperation.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        var grid = Ext.getCmp('billofMaterialOperation-grid');
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
        Item.SaveItemWorkStation(this.OperationId, rec, function (result) {
            if (result.success) {
                Ext.getCmp('billofMaterialOperation-paging').doRefresh();
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
Ext.reg('billofMaterialOperation-Window', Ext.erp.ux.billofMaterialOperation.Window);






