Ext.ns('Ext.erp.ux.salesArea');



/**
* @desc      form

* @copyright (c) 2020, 
* @date      April 27, 2019
* @namespace Ext.erp.ux.salesArea
* @class     Ext.erp.ux.salesArea.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.salesArea.Form = function (config) {
    Ext.erp.ux.salesArea.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: SalesArea.Get,
            submit: SalesArea.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side',
            bodyStyle: 'background-color:transparent;'
        },
        id: 'salesArea-form',
        padding: 3,
        labelWidth: 100,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            layout: 'column',
            border: false,
    
            items: [{
                columnWidth: .5,
                defaults: {
                    anchor: '95%',
                    labelStyle: 'text-align:right;',
                    msgTarget: 'side',
          
                },
                layout: 'form',
                border: false,
                bodyStyle: 'background-color:transparent;',

                items: [
                {
                    name: 'Id',
                    xtype: 'hidden'
                }, {
                    name: 'CreatedAt',
                    xtype: 'hidden'
                },  {
                    name: 'PriceCategoryId',
                    xtype: 'hidden'
                }, {
                    name: 'StoreId',
                    xtype: 'hidden'
                }, {
                    name: 'Name',
                    xtype: 'textarea',
                    fieldLabel: 'Name',
                    width: 100,
                    readOnly: false,
                    allowBlank: false
                }, {
                    name: 'Code',
                    xtype: 'textfield',
                    fieldLabel: 'Code',
                    width: 100,
                    readOnly: false,
                    allowBlank: true
                }, 
                ]
            }, {
                columnWidth: .5,
                defaults: {
                    anchor: '95%',
                    labelStyle: 'text-align:right;',
                    msgTarget: 'side',
                },
                layout: 'form',
                border: false,
                bodyStyle: 'background-color:transparent;',

                items: [
                  {
                      name: 'Unit',
                      hiddenName: 'PriceCategory',
                      xtype: 'combo',
                      fieldLabel: 'Price Category',
                      anchor: '95%',
                      triggerAction: 'all',
                      mode: 'local',
                      width: 100,
                      editable: false,
                      typeAhead: true,
                      forceSelection: true,
                      selectOnFocus: true,
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
                          api: { read: Psms.GetPriceCategory }
                      }),
                      valueField: 'Id',
                      displayField: 'Name',
                      listeners: {
                          select: function (cmb, rec, idx) {
                              var form = Ext.getCmp('salesArea-form').getForm();
                              form.findField("PriceCategoryId").setValue(rec.id);
                          },
                      }
                  }, {
                     hiddenName: 'Store',
                     xtype: 'combo',
                     fieldLabel: 'Store',
                     typeAhead: false,
                     hideTrigger: true,
                     minChars: 2,
                     listWidth: 280,
                     emptyText: '---Type to Search---',
                     mode: 'remote',
                     allowBlank: true,
                     tpl: '<tpl for="."><div ext:qtip="{Id}. {Code}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> {Code}</div></tpl>',
                     store: new Ext.data.DirectStore({
                         reader: new Ext.data.JsonReader({
                             successProperty: 'success',
                             idProperty: 'Id',
                             root: 'data',
                             fields: ['Id', 'Name']
                         }),
                         autoLoad: true,
                         api: { read: Psms.GetStoreBySearch }
                     }),
                     valueField: 'Name',
                     displayField: 'Name',
                     pageSize: 10, listeners: {
                         select: function (cmb, rec, idx) {
                             var form = Ext.getCmp('salesArea-form').getForm();
                             form.findField('StoreId').setValue(rec.id);
                            
                         },
                         change: function (cmb, newvalue, oldvalue) {
                             if (newvalue == "") {
                                 var form = Ext.getCmp('salesArea-form').getForm();
                                 form.findField('StoreId').reset();
                             }
                         }
                     }
                  },
                {
                    name: 'IsSalesOrderCommited',
                    checked: true,
                    xtype: 'checkbox',
                    fieldLabel: 'Sales Order Commitment(Enabled) ?',
                    width: 100,
                    readOnly: false,
                    allowBlank: true,
                    checked: false,
                    listeners: {
                        check: function (cmb, rec, idx) {
                            Ext.getCmp('sales-form').calculateTotal();
                        },
                    }
                },

                ]
            }]
        }],
    }, config));
}
Ext.extend(Ext.erp.ux.salesArea.Form, Ext.form.FormPanel);
Ext.reg('salesArea-form', Ext.erp.ux.salesArea.Form);



/**
* @desc      window

* @copyright (c) 2010, 
* @date      April 01, 2019
* @namespace Ext.erp.ux.salesArea
* @class     Ext.erp.ux.salesArea.Window
* @extends   Ext.Window
*/
Ext.erp.ux.salesArea.Window = function (config) {
    Ext.erp.ux.salesArea.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 650,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {

                if (typeof this.salesAreaId != "undefined" && this.salesAreaId != "") {

                    this.form.load({ params: { id: this.salesAreaId } });
                }
                else {
                    this.form.getForm().findField('Id').setValue(this.salesAreaId);
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.salesArea.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.salesArea.Form();    
       this.items = [this.form];

       this.buttons = [{
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSave,
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        this.tools = [{
            id: 'refresh',
            qtip: 'Reset',
            handler: function () {
                this.form.getForm().reset();
            },
            scope: this
        }];
        Ext.erp.ux.salesArea.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        var form = Ext.getCmp('salesArea-form');
        if (!form.getForm().isValid()) return;
       
        var window = this;
      form.getForm().submit({
            msg: 'Please wait...',
            params: { record: Ext.encode({ }) },
            success: function (form, action) {
                       
                Ext.getCmp('salesArea-form').getForm().reset();
                if (typeof Ext.getCmp('salesArea-paging') != "undefined")
                    Ext.getCmp('salesArea-paging').doRefresh();
                else
                    window.close();
                Ext.MessageBox.show({
                    title: 'Success',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    scope: this
                });

            },
            failure: function (form, action) {
          
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    },
    onClose: function () {
        this.close();
    },
  
});
Ext.reg('salesArea-window', Ext.erp.ux.salesArea.Window);


/**
* @desc      salesArea grid

* @copyright (c) 2020, 
* @date      November 01, 2011
* @namespace Ext.erp.ux.salesArea
* @class     Ext.erp.ux.salesArea.Grid
* @extends   Ext.grid.GridPanel
*/

Ext.erp.ux.salesArea.Grid = function (config) {
    Ext.erp.ux.salesArea.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: SalesArea.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'Name','Code', 'Store',  'PriceCategory'],
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
        id: 'salesArea-grid',
        pageSize: 20,
        stripeRows: true,
        border: true,
        columnLines: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true

        }),
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        columns:
        [new Ext.grid.RowNumberer(),
            {
                dataIndex: 'Name',
                header: 'Name',
                sortable: true,
                width: 150,
                menuDisabled: true
            }, {
                dataIndex: 'Code',
                header: 'Code',
                sortable: true,
                width: 150,
                menuDisabled: true
            }, {
                dataIndex: 'Store',
                header: 'Store',
                sortable: true,
                width: 150,
                menuDisabled: true
            }, {
                dataIndex: 'PriceCategory',
                header: 'Price Category',
                sortable: true,
                width: 150,
                menuDisabled: true
            }, ]
    }, config));
};
Ext.extend(Ext.erp.ux.salesArea.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [
            {
                xtype: 'button',
                text: 'Add',
                id: 'addsalesArea',
                iconCls: 'icon-add',
                disabled: !Ext.erp.ux.Reception.getPermission('Sales Area', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editsalesArea',
                iconCls: 'icon-edit',
                disabled: !Ext.erp.ux.Reception.getPermission('Sales Area', 'CanEdit'),


                handler: this.onEdit
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletesalesArea',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.ux.Reception.getPermission('Sales Area', 'CanDelete'),
                handler: this.onDeleteClick
            },  {
                xtype: 'tbfill'
            }, {
                xtype: 'textfield',
                emptyText: 'Type Search text here and press "Enter"',
                submitemptyText: false,
                id:'salesAreaSearchText',
                enableKeyEvents: true,
                style: {
                    borderRadius: '25px',
                    padding: '0 10px',
                    width: '200px'
                },
                listeners: {
                    specialKey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            Ext.getCmp('salesArea-grid').onSearchGrid();
                        }
                    },
                    Keyup: function (field, e) {
                        if (field.getValue() == '') {
                            Ext.getCmp('salesArea-grid').onSearchGrid();
                        }
                    }
                }
            }];
        this.bbar = new Ext.PagingToolbar({
            id: 'salesArea-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.salesArea.Grid.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
       
        new Ext.erp.ux.salesArea.Window({
                  title: 'Add Sales Area'
        }).show();
    },
    onEdit: function () {
        var grid = Ext.getCmp('salesArea-grid');
           if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a record to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var id = grid.getSelectionModel().getSelected().get('Id');      
        new Ext.erp.ux.salesArea.Window({
            salesAreaId: id,
              title: 'Edit Sales Area'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('salesArea-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected salesArea',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    SalesArea.Delete(id, function (result, response) {
                        if (result.success) {
                            Ext.getCmp('salesArea-paging').doRefresh();
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
            }
        });
    },
    onSearchGrid: function () {
        var searchValue = Ext.getCmp('salesAreaSearchText').getValue();
        
        var grid = Ext.getCmp('salesArea-grid');
        grid.store.baseParams['record'] = Ext.encode({ searchText: searchValue });
        grid.store.load({ params: { start: 0, limit: grid.pageSize } });

    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.salesArea.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('salesArea-Grid', Ext.erp.ux.salesArea.Grid);


/**
* @desc      salesArea Main panel

* @copyright (c) 2020, 
* @date      Augest 11, 2011
* @namespace Ext.erp.ux.salesArea.Panel
* @class     Ext.erp.ux.salesArea.itemPanel
* @extends   Ext.Panel
*/
Ext.erp.ux.salesArea.Panel = function (config) {
    Ext.erp.ux.salesArea.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        flex: 1.5,
        border: false,
    }, config));
};
Ext.extend(Ext.erp.ux.salesArea.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.salesArea.Grid();
        this.items = [{
            layout: 'border',
            border: false,
            items: [ {
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
                    items: [this.grid]
                }]
            }]
        }];

        Ext.erp.ux.salesArea.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('salesArea-panel', Ext.erp.ux.salesArea.Panel);

