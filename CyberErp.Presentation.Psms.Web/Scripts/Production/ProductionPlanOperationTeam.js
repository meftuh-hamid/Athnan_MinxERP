Ext.ns('Ext.erp.ux.productionPlanOperationTeam');

/**
* @desc      user grid

* @copyright (c) 2012, 
* @namespace Ext.erp.ux.productionPlanOperationTeam
* @class     Ext.erp.ux.productionPlanOperationTeam.Grid
* @extends   Ext.grid.GridPanel
*/
var operationTeamSelectionModel = new Ext.grid.RowSelectionModel();

Ext.erp.ux.productionPlanOperationTeam.Grid = function (config) {
    Ext.erp.ux.productionPlanOperationTeam.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ProductionPlan.GetAllOperationTeam,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'ProductionPlanJobCardDetailId', 'AssignedEmployeeId', 'AssignedEmployee', 'Remark'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('productionPlanOperationTeam-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('productionPlanOperationTeam-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('productionPlanOperationTeam-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'productionPlanOperationTeam-grid',
        pageSize: 20,
        height:200,
        stripeRows: true,
        border: false,
        clicksToEdit: 1,
        sm: operationTeamSelectionModel,
        
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(),
        {
              dataIndex: 'AssignedEmployee',
              header: 'Assigned Employee',
              sortable: false,
              width: 200,
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
                              var grid = Ext.getCmp('productionPlanOperationTeam-grid');
                              var selectedrecord = grid.getSelectionModel().getSelected();
                              selectedrecord.set('AssignedEmployeeId', rec.get("Id"));
                          },
                      }
                  })
          }, {
                dataIndex: 'Remark',
                header: 'Remark',
                width: 150,
                menuDisabled: true,
                editor: new Ext.form.TextArea({
                    height: 150,

                })
            }]
    }, config));
}
Ext.extend(Ext.erp.ux.productionPlanOperationTeam.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: "" }) };
        this.tbar = [
            {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: false,
            handler: function () {
                var detailDrid = Ext.getCmp('productionPlanOperationTeam-grid');
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
                var grid = Ext.getCmp('productionPlanOperationTeam-grid');

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
                        var grid = Ext.getCmp('productionPlanOperationTeam-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), productionPlanJobCardId: grid.productionPlanJobCardId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('productionPlanOperationTeam-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), productionPlanJobCardId: grid.productionPlanJobCardId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }];
        this.bbar = [
            
            new Ext.PagingToolbar({
            id: 'productionPlanOperationTeam-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        })];
        Ext.erp.ux.productionPlanOperationTeam.Grid.superclass.initComponent.apply(this, arguments);
    },
    onSave: function () {

        var grid = Ext.getCmp('productionPlanOperationTeam-grid');
        var rec = '';
        var store = grid.getStore();
        var rec = '', errorMesssage = "";
        var productionPlanJobCardId = grid.productionPlanJobCardId;
        store.each(function (item) {
            if (typeof item.get('AssignedEmployeeId') == 'undefined' || item.get('AssignedEmployeeId') == "") {
                if (errorMesssage == "")
                    errorMesssage = "Employee";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Employee";
            }
           

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
          
            rec = rec + item.data['Id'] + ':' +
           item.data['ProductionPlanJobCardDetailId'] + ':' +
           item.data['AssignedEmployeeId'] + ':' +
           item.data['Remark'] + ';';
        
        });
        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
        ProductionPlan.SaveOperationTeam(productionPlanJobCardId, rec, function (result) {
            if (result.success) {
                Ext.getCmp('productionPlanOperationTeam-paging').doRefresh();
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
        this.store.baseParams = { record: Ext.encode({ productionPlanJobCardId: this.productionPlanJobCardId }) };
        
        Ext.erp.ux.productionPlanOperationTeam.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('productionPlanOperationTeam-grid', Ext.erp.ux.productionPlanOperationTeam.Grid);


/**
* @desc      Permission registration form host window

* @copyright (c) 2010, 
* @date      November 01, 2010
* @namespace Ext.erp.ux.productionPlanOperationTeam
* @class     Ext.erp.ux.productionPlanOperationTeam.Window
* @extends   Ext.Window
*/
Ext.erp.ux.productionPlanOperationTeam.Window = function (config) {
    Ext.erp.ux.productionPlanOperationTeam.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.erp.ux.productionPlanOperationTeam.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.productionPlanOperationTeam.Grid(
            {
                productionPlanJobCardId: this.productionPlanJobCardId
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
        Ext.erp.ux.productionPlanOperationTeam.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        var grid = Ext.getCmp('productionPlanOperationTeam-grid');
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
        Item.SaveItemWorkStation(this.productionPlanJobCardId, rec, function (result) {
            if (result.success) {
                Ext.getCmp('productionPlanOperationTeam-paging').doRefresh();
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
Ext.reg('productionPlanOperationTeam-Window', Ext.erp.ux.productionPlanOperationTeam.Window);






