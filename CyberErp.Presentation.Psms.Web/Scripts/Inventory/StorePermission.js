Ext.ns('Ext.erp.ux.storePermission');

/**
* @desc      user grid
* @author    Meftuh Mohammed
* @copyright (c) 2012, Cybersoft
* @namespace Ext.erp.ux.storePermission
* @class     Ext.erp.ux.storePermission.Grid
* @extends   Ext.grid.GridPanel
*/
var selectionModel = new Ext.grid.RowSelectionModel();

Ext.erp.ux.storePermission.Grid = function (config) {
    Ext.erp.ux.storePermission.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: StorePermission.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id','UserId','StoreId', 'User', 'IsCoordinator','Remark'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('storePermission-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('storePermission-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('storePermission-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'storePermission-grid',
        pageSize: 20,
        height:390,
        stripeRows: true,
        border: false,
        clicksToEdit: 1,
        sm: selectionModel,
        viewConfig: {
            forceFit: false,
            autoExpandColumn: 'User',
            autoFill: true
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
              dataIndex: 'User',
              header: 'User',
              sortable: false,
              width: 100,
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
                          fields: ['Id', 'Name']
                      }),
                      api: { read: Psms.GetUserBySearch }
                  }),
                  valueField: 'Name',
                  displayField: 'Name',
                  listeners: {

                      select: function (combo, record, index) {

                          var grid = Ext.getCmp('storePermission-grid');
                          var selectedrecord = grid.getSelectionModel().getSelected();
                          selectedrecord.set('UserId', record.get("Id"));
                      }
                  }
              })
          },{
               dataIndex: 'IsCoordinator',
               header: 'Is Coordinator',
                width: 90,
                menuDisabled: true,
                renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                    if (value)
                        return '<img src="Content/images/app/yes.png"/>';
                    else
                        return '<img src="Content/images/app/no.png"/>';
                },
                editor: new Ext.form.Checkbox({
                    value:false,
                })
            }, {
                dataIndex: 'Remark',
                header: 'Remark',
                width: 100,
                menuDisabled: true,
                editor: new Ext.form.TextArea({
                    height: 150,

                })
            }]
    }, config));
}
Ext.extend(Ext.erp.ux.storePermission.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: "" }) };
        this.tbar = [
            {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: false,
            handler: function () {
                var detailDrid = Ext.getCmp('storePermission-grid');
                var store = detailDrid.getStore();

                var defaultData = {
                    IsCoordinator: false,
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
                var grid = Ext.getCmp('storePermission-grid');

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
                        var grid = Ext.getCmp('storePermission-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), storeId: grid.storeId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('storePermission-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), storeId: grid.storeId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'storePermission-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.storePermission.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.store.baseParams = { record: Ext.encode({ storeId:this.storeId }) };
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.storePermission.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('storePermission-grid', Ext.erp.ux.storePermission.Grid);



/**
* @desc      Permission registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.storePermission
* @class     Ext.erp.ux.storePermission.Window
* @extends   Ext.Window
*/
Ext.erp.ux.storePermission.Window = function (config) {
    Ext.erp.ux.storePermission.Window.superclass.constructor.call(this, Ext.apply({
        title: 'Employee Store Permission',
        layout: 'hbox',
        width: 600,
        bodyStyle: 'margin: 5px; padding-right: 10px',
        align: 'stretch',
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
    }, config));
}
Ext.extend(Ext.erp.ux.storePermission.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.storePermission.Grid(
            {
                storeId:this.storeId
            });
        this.items = [this.grid];

        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSave,
            scope: this
        },  {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.erp.ux.storePermission.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        
        var grid = Ext.getCmp('storePermission-grid');
        var rec = '';
        var store = grid.getStore();
         var rec = '';
         store.each(function (item) {

            rec = rec + item.data['Id'] + ':' +
           item.data['UserId'] + ':' +
           item.data['IsCoordinator'] + ':' +
           item.data['Remark'] + ';';

        });
        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
        //if (rec.length == 0) {

        //    Ext.MessageBox.show({
        //        title: 'Save failed',
        //        msg: "You must select at least one user",
        //        buttons: Ext.Msg.OK,
        //        icon: Ext.MessageBox.ERROR,
        //        scope: this
        //    });
        //    return;
        //}
        StorePermission.Save(this.storeId,rec, function (result) {
            if (result.success) {
                Ext.getCmp('storePermission-paging').doRefresh();
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
Ext.reg('storePermission-Window', Ext.erp.ux.storePermission.Window);


