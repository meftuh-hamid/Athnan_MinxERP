Ext.ns('Ext.erp.ux.alternativeItem');

/**
* @desc      user grid
* @author    Meftuh Mohammed
* @copyright (c) 2012, Cybersoft
* @namespace Ext.erp.ux.alternativeItem
* @class     Ext.erp.ux.alternativeItem.Grid
* @extends   Ext.grid.GridPanel
*/
var selectionModel = new Ext.grid.RowSelectionModel();

Ext.erp.ux.alternativeItem.Grid = function (config) {
    Ext.erp.ux.alternativeItem.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Item.GetAllAlternvative,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'AlternativeItemId', 'ItemId', 'AlternativeItem', 'Remark', 'MeasurementUnit'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('alternativeItem-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('alternativeItem-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('alternativeItem-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'alternativeItem-grid',
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
              dataIndex: 'AlternativeItem',
              header: 'Alternative Item',
              sortable: false,
              width: 200,
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
                          fields: ['Id', 'Name', 'MeasurementUnit']
                      }),
                      api: { read: Psms.GetItemBySearch }
                  }),
                  valueField: 'Name',
                  displayField: 'Name',
                  listeners: {

                      select: function (combo, record, index) {

                          var grid = Ext.getCmp('alternativeItem-grid');
                          var selectedrecord = grid.getSelectionModel().getSelected();
                          selectedrecord.set('AlternativeItemId', record.get("Id"));
                          selectedrecord.set('MeasurementUnit', record.get("MeasurementUnit"));

                      }
                  }
              })
          },{
              dataIndex: 'MeasurementUnit',
              header: 'Unit',
              sortable: false,
              width: 100,
              menuDisabled: true,
          },{
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
Ext.extend(Ext.erp.ux.alternativeItem.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: "" }) };
        this.tbar = [
            {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: false,
            handler: function () {
                var detailDrid = Ext.getCmp('alternativeItem-grid');
                var store = detailDrid.getStore();

                var defaultData = {
                     Remark:''
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
                var grid = Ext.getCmp('alternativeItem-grid');

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
                        var grid = Ext.getCmp('alternativeItem-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), itemId: grid.itemId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('alternativeItem-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), itemId: grid.itemId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'alternativeItem-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.alternativeItem.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.store.baseParams = { record: Ext.encode({ itemId:this.itemId }) };
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.alternativeItem.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('alternativeItem-grid', Ext.erp.ux.alternativeItem.Grid);


/**
* @desc      Permission registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.alternativeItem
* @class     Ext.erp.ux.alternativeItem.Window
* @extends   Ext.Window
*/
Ext.erp.ux.alternativeItem.Window = function (config) {
    Ext.erp.ux.alternativeItem.Window.superclass.constructor.call(this, Ext.apply({
        title: 'Alternative Items',
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
Ext.extend(Ext.erp.ux.alternativeItem.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.alternativeItem.Grid(
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
        Ext.erp.ux.alternativeItem.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {

        var grid = Ext.getCmp('alternativeItem-grid');
        var rec = '';
        var store = grid.getStore();
        var rec = '';
        store.each(function (item) {

            rec = rec + item.data['Id'] + ':' +
           item.data['AlternativeItemId'] + ':' +
           item.data['Remark'] + ';';

        });
        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
        Item.SaveItemAlternative(this.itemId, rec, function (result) {
            if (result.success) {
                Ext.getCmp('alternativeItem-paging').doRefresh();
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
Ext.reg('alternativeItem-Window', Ext.erp.ux.alternativeItem.Window);






