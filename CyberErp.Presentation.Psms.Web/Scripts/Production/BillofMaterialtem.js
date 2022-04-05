Ext.ns('Ext.erp.ux.billofMaterialItem');

/**
* @desc      user grid

* @copyright (c) 2012, 
* @namespace Ext.erp.ux.billofMaterialItem
* @class     Ext.erp.ux.billofMaterialItem.Grid
* @extends   Ext.grid.GridPanel
*/
var selectionModel = new Ext.grid.RowSelectionModel();

Ext.erp.ux.billofMaterialItem.Grid = function (config) {
    Ext.erp.ux.billofMaterialItem.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: BillofMaterial.GetAllItem,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'BillofMaterialHeaderId', 'ItemId', 'Description', 'UnitId', 'Unit','StoreId','Store', 'Quantity', 'ScrapQuantity', 'UnitCost', 'Remark'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('billofMaterialItem-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('billofMaterialItem-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('billofMaterialItem-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'billofMaterialItem-grid',
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
              dataIndex: 'Description',
              header: 'Item Description',
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
                              fields: ['Id', 'Name','Code','UnitId','MeasurementUnit']
                          }),
                          autoLoad: true,
                          api: { read: Psms.GetItemBySearch }
                      }),
                      valueField: 'Name',
                      displayField: 'Name',
                      pageSize: 10,
                      listeners: {
                          select: function (cmb, rec, idx) {
                              var grid = Ext.getCmp('billofMaterialItem-grid');
                              var selectedrecord = grid.getSelectionModel().getSelected();
                              var store = grid.getStore();
                              var index = store.findExact('ItemId', rec.get("Id"));
                              if (index == -1) {
                                  selectedrecord.set('ItemId', rec.get("Id"));
                                  selectedrecord.set('UnitId', rec.get("UnitId"));
                                  selectedrecord.set('Unit', rec.get("MeasurementUnit"));
                                           }
                              else {
                                  Ext.MessageBox.show({
                                      title: 'Error',
                                      msg: "The item is already added!",
                                      buttons: Ext.Msg.OK,
                                      icon: Ext.MessageBox.ERROR,
                                      scope: this
                                  });
                                  return;
                              }

                          },
                      }
                  })
          }, {
              dataIndex: 'Unit',
              header: 'Unit',
              sortable: false,
              width: 50,
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
                          var grid = Ext.getCmp('billofMaterialItem-grid');
                          var selectedrecord = grid.getSelectionModel().getSelected();
                          var store = grid.getStore();
                              selectedrecord.set('UnitId', rec.get("Id"));
                      },
                  }
              })
          },
          {
              dataIndex: 'Store',
              header: 'Store',
              sortable: false,
              hidden:true,
              width: 50,
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
                          api: { read: Psms.GetStoreBySearch }
                      }),
                      valueField: 'Name',
                      displayField: 'Name',
                      pageSize: 10,
                      listeners: {
                          select: function (cmb, rec, idx) {
                              var grid = Ext.getCmp('billofMaterialItem-grid');
                              var selectedrecord = grid.getSelectionModel().getSelected();
                              selectedrecord.set('StoreId', rec.get("Id"));
                          },
                      }
                  })
          }, {
              dataIndex: 'Quantity',
              header: 'Quantity',
              sortable: false,
              width: 100,
              menuDisabled: true,
              editor: new Ext.form.NumberField({         
              })
          }, {
              dataIndex: 'ScrapQuantity',
              header: 'Scrap Quantity',
              sortable: false,
              width: 100,
              menuDisabled: true,
              editor: new Ext.form.NumberField({
              })
          }, {
              dataIndex: 'UnitCost',
              header: 'Unit Cost',
              sortable: false,
              width: 100,
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
Ext.extend(Ext.erp.ux.billofMaterialItem.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: "" }) };
        this.tbar = [
            {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: false,
            handler: function () {
                var detailDrid = Ext.getCmp('billofMaterialItem-grid');
                var store = detailDrid.getStore();

                var defaultData = {
                    Remark: '',
                    ConversionRate: '1',
                    Quantity: 0,
                    UnitCost:0,
                    ScrapQuantity:0,
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
                var grid = Ext.getCmp('billofMaterialItem-grid');

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
                        var grid = Ext.getCmp('billofMaterialItem-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), itemId: grid.itemId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('billofMaterialItem-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), itemId: grid.itemId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }];
        this.bbar = [ 
            new Ext.PagingToolbar({
            id: 'billofMaterialItem-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        })];
        Ext.erp.ux.billofMaterialItem.Grid.superclass.initComponent.apply(this, arguments);
    },
    onSave: function () {

        var grid = Ext.getCmp('billofMaterialItem-grid');
        var rec = '';
        var store = grid.getStore();
        var rec = '', errorMesssage = "";
        var billofMaterail = grid.billofMaterialId;
        store.each(function (item) {
            if (typeof item.get('Description') == 'undefined' || item.get('Description') =="") {
                if (errorMesssage == "")
                    errorMesssage = "Description";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Description";
            }
            if (typeof item.get('UnitId') == 'undefined' || item.get('UnitId') =="") {
                if (errorMesssage == "")
                    errorMesssage = "Unit";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Unit";
            }
            if (typeof item.get('Quantity') == 'undefined' || item.get('Quantity') <=0) {
                if (errorMesssage == "")
                    errorMesssage = "Quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Quantity";
            }

            rec = rec + item.data['Id'] + ':' +
           item.data['BillofMaterialHeaderId'] + ':' +
           item.data['ItemId'] + ':' +
           item.data['Description'] + ':' +
           item.data['UnitId'] + ':' +
           item.data['Quantity'] + ':' +
           item.data['UnitCost'] + ':' +
           item.data['Remark'] + ':' +
            item.data['ScrapQuantity'] + ':' +
            item.data['StoreId'] + ';';
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
        BillofMaterial.SaveItem(billofMaterail, rec, function (result) {
            if (result.success) {
                Ext.getCmp('billofMaterialItem-paging').doRefresh();
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
        this.store.baseParams = { record: Ext.encode({ billofMaterialId: this.itemId }) };
        
        Ext.erp.ux.billofMaterialItem.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('billofMaterialItem-grid', Ext.erp.ux.billofMaterialItem.Grid);


/**
* @desc      Permission registration form host window

* @copyright (c) 2010, 
* @date      November 01, 2010
* @namespace Ext.erp.ux.billofMaterialItem
* @class     Ext.erp.ux.billofMaterialItem.Window
* @extends   Ext.Window
*/
Ext.erp.ux.billofMaterialItem.Window = function (config) {
    Ext.erp.ux.billofMaterialItem.Window.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.erp.ux.billofMaterialItem.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.billofMaterialItem.Grid(
            {
                itemId: this.itemId
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
        Ext.erp.ux.billofMaterialItem.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        var grid = Ext.getCmp('billofMaterialItem-grid');
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
                Ext.getCmp('billofMaterialItem-paging').doRefresh();
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
Ext.reg('billofMaterialItem-Window', Ext.erp.ux.billofMaterialItem.Window);






