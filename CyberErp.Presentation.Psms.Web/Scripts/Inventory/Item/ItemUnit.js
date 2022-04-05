Ext.ns('Ext.erp.ux.itemUnit');

/**
* @desc      user grid
* @author    Meftuh Mohammed
* @copyright (c) 2012, Cybersoft
* @namespace Ext.erp.ux.itemUnit
* @class     Ext.erp.ux.itemUnit.Grid
* @extends   Ext.grid.GridPanel
*/
var selectionModel = new Ext.grid.RowSelectionModel();

Ext.erp.ux.itemUnit.Grid = function (config) {
    Ext.erp.ux.itemUnit.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Item.GetAllItemUnit,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'MeasurementUnitId', 'ItemId', 'MeasurementUnit', 'ConversionRate', 'Remark'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('itemUnit-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('itemUnit-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('itemUnit-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'itemUnit-grid',
        pageSize: 20,
        height:350,
        stripeRows: true,
        border: false,
        clicksToEdit: 1,
        sm: selectionModel,
      
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(),
          {
              dataIndex: 'MeasurementUnit',
              header: 'Measurement Unit',
              sortable: false,
              width: 200,
              menuDisabled: true,
              editor: new Ext.form.ComboBox({
                   xtype: 'combo',
                  fieldLabel: 'Unit',
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
                      select: function (cmb, rec, idx) {
                          var grid = Ext.getCmp('itemUnit-grid');
                          var selectedrecord = grid.getSelectionModel().getSelected();
                          selectedrecord.set('MeasurementUnitId', rec.get("Id"));
                      },
                  }
              })
          }, {
              dataIndex: 'ConversionRate',
              header: 'Conversion Rate',
              sortable: false,
              width: 100,
              menuDisabled: true,
              editor: new Ext.form.NumberField({
                  decimalPrecision: 4
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
Ext.extend(Ext.erp.ux.itemUnit.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: "" }) };
        this.tbar = [
            {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: false,
            handler: function () {
                var detailDrid = Ext.getCmp('itemUnit-grid');
                var store = detailDrid.getStore();
                var conversionRate = detailDrid.inventoryUnit != 0 ? parseFloat(1 / parseFloat(detailDrid.inventoryUnit)) : 1;

                var defaultData = {
                    Remark: '',
                    ConversionRate: conversionRate
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
                var grid = Ext.getCmp('itemUnit-grid');

                if (!grid.getSelectionModel().hasSelection())
                    return;

                var selectedrecord = grid.getSelectionModel().getSelected();
                grid.getStore().remove(selectedrecord);
            }
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
                        var grid = Ext.getCmp('itemUnit-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), itemId: grid.itemId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('itemUnit-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), itemId: grid.itemId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'itemUnit-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.itemUnit.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.store.baseParams = { record: Ext.encode({ itemId:this.itemId }) };
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.itemUnit.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('itemUnit-grid', Ext.erp.ux.itemUnit.Grid);


/**
* @desc      Permission registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.itemUnit
* @class     Ext.erp.ux.itemUnit.Window
* @extends   Ext.Window
*/
Ext.erp.ux.itemUnit.Window = function (config) {
    Ext.erp.ux.itemUnit.Window.superclass.constructor.call(this, Ext.apply({
        title: 'Item Units',
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
Ext.extend(Ext.erp.ux.itemUnit.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.itemUnit.Grid(
            {
                itemId: this.itemId,
                inventoryUnit: this.inventoryUnit
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
        Ext.erp.ux.itemUnit.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        var grid = Ext.getCmp('itemUnit-grid');
        var rec = '';
        var store = grid.getStore();
        var rec = '';
        store.each(function (item) {

            rec = rec + item.data['Id'] + ':' +
           item.data['MeasurementUnitId'] + ':' +
           item.data['ConversionRate'] + ':' +
           item.data['Remark'] + ';';

        });
        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
      
        Item.SaveItemUnit(this.itemId, rec, function (result) {
            if (result.success) {
                Ext.getCmp('itemUnit-paging').doRefresh();
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
Ext.reg('itemUnit-Window', Ext.erp.ux.itemUnit.Window);






