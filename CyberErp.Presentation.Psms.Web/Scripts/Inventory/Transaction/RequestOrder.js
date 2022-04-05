Ext.ns('Ext.erp.ux.requestOrder');
/**
* @desc      Purchase Request registration form
* @author   Meftuh Mohammed
* @copyright (c) 2013, 
* @date      Sep , 2019
* @namespace Ext.erp.ux.requestOrder
* @class     Ext.erp.ux.requestOrder.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.requestOrder.Form = function (config) {
    Ext.erp.ux.requestOrder.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            //load: GoodsRequestManagement.GetRequestOrder,
            submit: GoodsRequestManagement.SaveRequestOrder
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'requestOrder-form',
        padding: 5,
        labelWidth: 100,
        bodyStyle: 'padding: 20px 5px 5px 10px;',
        autoHeight: false,
        border: false,
        loadDocument: function () {

            GoodsRequestManagement.GetDocumentNo(function (result) {
                var form = Ext.getCmp('requestOrder-form').getForm();
                form.findField('StatusId').setValue(result.data.StatusId);
                form.findField('PreparedById').setValue(result.data.EmployeeId);
                form.findField('OrderedById').setValue(result.data.EmployeeId);
                form.findField('OrderedBy').setValue(result.data.Employee);
                form.findField('Date').setValue(new Date());
            });


        },
        baseCls: 'x-plain',


        items: [
          {
              layout: 'column',
              border: false,
              bodyStyle: 'background-color:transparent;',
              defaults: {
                  columnWidth: .5,
                  border: false,
                  bodyStyle: 'background-color:transparent;',
                  layout: 'form'
              },
              items: [{
                  defaults: {
                      anchor: '95%'
                  },
                  items: [{
                      name: 'Id',
                      xtype: 'hidden'
                  }, {
                      name: 'CertifiedDate',
                      xtype: 'hidden'
                  }, {
                      name: 'StoreRequisitionHeaderId',
                      xtype: 'hidden'
                  }, {
                      name: 'StoreRequestTypeId',
                      xtype: 'hidden'
                  }, {
                      name: 'CommitmentHeaderId',
                      xtype: 'hidden'
                  }, {
                      name: 'OrderedById',
                      xtype: 'hidden'
                  }, {
                      name: 'PreparedById',
                      xtype: 'hidden'
                  }, {
                      name: 'PRRequestOrderId',
                      xtype: 'hidden'
                  }, {
                      name: 'StatusId',
                      xtype: 'hidden'
                  }, {
                      name: 'FromStoreId',
                      xtype: 'hidden'
                  }, {
                      name: 'StoreId',
                      xtype: 'hidden'
                  }, {
                      name: 'OrderType',
                      xtype: 'textfield',
                      fieldLabel: 'Order Type',
                      readonly: true,
                      allowBlank: true
                  }, {
                      name: 'Date',
                      xtype: 'datefield',
                      fieldLabel: 'Date',
                      width: 100,
                      allowBlank: false,
                      Value: new Date()
                  }, {
                      hiddenName: 'FromStore',
                      xtype: 'combo',
                      fieldLabel: 'From Store',
                      typeAhead: false,
                      width: 100,
                      hideTrigger: true,
                      minChars: 2,
                      listWidth: 280,
                      emptyText: '---Type to Search---',
                      mode: 'remote',
                      allowBlank: true,
                      hidden: true,
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
                              var form = Ext.getCmp('requestOrder-form').getForm();
                              form.findField('FromStoreId').setValue(rec.id);
                          },
                          change: function (cmb, newvalue, oldvalue) {
                              if (newvalue == "") {
                                  var form = Ext.getCmp('requestOrder-form').getForm();
                                  form.findField('FromStoreId').reset();

                              }
                          }
                      }
                  }, {
                      hiddenName: 'RequestTypeId',
                      xtype: 'combo',
                      fieldLabel: 'Request Type',
                      triggerAction: 'all',
                      mode: 'remote',
                      editable: false,
                      forceSelection: true,
                      hidden: true,
                      emptyText: '---Select---',
                      allowBlank: true,
                      store: new Ext.data.DirectStore({
                          reader: new Ext.data.JsonReader({
                              successProperty: 'success',
                              idProperty: 'Id',
                              root: 'data',
                              fields: ['Id', 'Name']
                          }),
                          autoLoad: true,
                          api: { read: Psms.GetPurchaseRequestType }
                      }),
                      valueField: 'Id',
                      displayField: 'Name',
                      listeners: {
                          select: function (cmb, rec, idx) {
                          },
                      }
                  }]
              }, {
                  defaults: {
                      anchor: '95%'
                  },
                  items: [
                      {
                          hiddenName: 'Store',
                          xtype: 'combo',
                          fieldLabel: 'To Store',
                          typeAhead: false,
                          width: 100,
                          hideTrigger: true,
                          minChars: 2,
                          listWidth: 280,
                          emptyText: '---Type to Search---',
                          mode: 'remote',
                          allowBlank: true,
                          hidden: true,
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
                                  var form = Ext.getCmp('requestOrder-form').getForm();
                                  form.findField('StoreId').setValue(rec.id);
                              },
                              change: function (cmb, newvalue, oldvalue) {
                                  if (newvalue == "") {
                                      var form = Ext.getCmp('requestOrder-form').getForm();
                                      form.findField('StoreId').reset();

                                  }
                              }
                          }
                      }, {
                          hiddenName: 'OrderedBy',
                          xtype: 'combo',
                          fieldLabel: 'Ordered By',
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
                                  fields: ['Id', 'Name']
                              }),
                              autoLoad: true,
                              api: { read: Psms.GetEmployeeBySearch }
                          }),
                          valueField: 'Name',
                          displayField: 'Name',
                          pageSize: 10, listeners: {
                              select: function (cmb, rec, idx) {
                                  var form = Ext.getCmp('requestOrder-form').getForm();
                                  form.findField('OrderedById').setValue(rec.id);
                              },
                              change: function (cmb, newvalue, oldvalue) {
                                  if (newvalue == "") {
                                      var form = Ext.getCmp('requestOrder-form').getForm();
                                      form.findField('OrderedById').reset();

                                  }
                              }
                          }
                      }, {
                          name: 'Remark',
                          xtype: 'textarea',
                          fieldLabel: 'Remark',
                          width: 100,
                          allowBlank: true,
                          readOnly: false
                      }]
              }]
          }
        ],

    }, config));
}
Ext.extend(Ext.erp.ux.requestOrder.Form, Ext.form.FormPanel);
Ext.reg('requestOrder-form', Ext.erp.ux.requestOrder.Form);

/**
* @desc      requestOrder grid
* @author   Meftuh Mohammed
* @copyright (c) 2013, 
* @date      Sep , 2019
* @namespace Ext.erp.ux.requestOrder
* @class     Ext.erp.ux.requestOrder.DetailGrid
* @extends   Ext.grid.GridPanel
*/
var selectionModel = new Ext.grid.RowSelectionModel({
});
Ext.erp.ux.requestOrder.DetailGrid = function (config) {
    Ext.erp.ux.requestOrder.DetailGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            //directFn: GoodsRequestManagement.GetAllRequestOrderDetails,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            clickToEdit: 1,
         //   idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'RequestOrderHeaderId','StatusId', 'ItemId','PartNumber', 'UnitId', 'Name', 'Code', 'MeasurementUnit', 'UnprocessedQuantity', 'RemainingQuantity', 'Quantity'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('orderRequest-detailGrid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    Ext.getCmp('orderRequest-detailGrid').body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('orderRequest-detailGrid').body.unmask();
                },
                scope: this
            }
        }),
        id: 'orderRequest-detailGrid',
        voucherId: 0,
        pageSize: 100,
        height: 250,
        stripeRows: true,
        columnLines: true,
        border: true,
        clicksToEdit: 1,
        sm: selectionModel,
        viewConfig: {
            forceFit: true
        },
        listeners: {
            rowClick: function () {
            },
            scope: this
        },
        columns: [
            new Ext.grid.RowNumberer(),
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
               width: 70,
               menuDisabled: true
           }, {
               dataIndex: 'PartNumber',
               header: 'Part Number',
               sortable: true,
               width: 70,
               menuDisabled: true
           }, {
               dataIndex: 'MeasurementUnit',
               header: 'Unit',
               sortable: true,
               width: 40,
               menuDisabled: true
           }, {
               dataIndex: 'UnprocessedQuantity',
               header: 'Remaining Quantity',
               sortable: true,
               width: 100,
               menuDisabled: true
           }, {
               dataIndex: 'Quantity',
               header: 'Qty to Process',
               sortable: true,
               width: 70,
               menuDisabled: true,
               editor: {
                   xtype: 'numberfield',
                   allowBlank: false
               }
           }]
    }, config));
};
Ext.extend(Ext.erp.ux.requestOrder.DetailGrid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [{
            xtype: 'button',
            text: 'Remove',
            iconCls: 'icon-exit',
            disabled: false,
            handler: function () {
                var grid = Ext.getCmp('orderRequest-detailGrid');

                if (!grid.getSelectionModel().hasSelection())
                    adjustment;

                var selectedrecord = grid.getSelectionModel().getSelected();
                grid.getStore().remove(selectedrecord);
            }
        }];
        Ext.erp.ux.requestOrder.DetailGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        Ext.erp.ux.requestOrder.DetailGrid.superclass.afterRender.apply(this, arguments);
    },
    customRenderer: function (value, metaData, record, rowIndex, colIndex, store) {
        if (record.data.RemainingQuantity > 0) {
            return '<span style="color:red;">' + value + '</span>';
        }
        else if (record.data.RemainingQuantity == 0) {
            return '<span style="color:green;">' + value + '</span>';
        }
        else if (record.data.Quantity > 0) {
            return '<span style="color:green;">' + value + '</span>';
        }
        else {
            return '<span style="color:red;">' + value + '</span>';
        }
    }
});
Ext.reg('orderRequest-detailGrid', Ext.erp.ux.requestOrder.DetailGrid);


/**
* @desc      Item Selection Window
* @author   Meftuh Mohammed
* @copyright (c) 2013, 
* @date      Sep , 2019
* @namespace Ext.erp.ux.requestOrder
* @class     Ext.erp.ux.requestOrder.Window
* @extends   Ext.Window
*/
Ext.erp.ux.requestOrder.Window = function (config) {
    Ext.erp.ux.requestOrder.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 650,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {

                this.form.getForm().findField('Id').setValue(this.requestOrderHeaderId);
                this.form.getForm().findField('OrderType').setValue(this.orderType);
                this.form.getForm().findField('FromStoreId').setValue(this.storeId);
                this.form.getForm().findField('FromStore').setValue(this.store);

                if (typeof this.storeRequisitionHeaderId != "undefined" && this.storeRequisitionHeaderId != "")
                    this.form.getForm().findField('StoreRequisitionHeaderId').setValue(this.storeRequisitionHeaderId);
              
                if (this.orderType == "Store Issue") {
                    this.form.getForm().findField('Store').setVisible(false);
                    this.form.getForm().findField('Store').allowBlank = true;
                    this.form.getForm().findField('FromStore').setVisible(true);
                    this.form.getForm().findField('FromStore').allowBlank = false;
               
                }
                else if (this.orderType == "Transfer Issue") {
                    this.form.getForm().findField('Store').setVisible(true);
                    this.form.getForm().findField('Store').allowBlank = false;
                    this.form.getForm().findField('Store').setValue(this.consumerStore);
                    this.form.getForm().findField('StoreId').setValue(this.consumerStoreId);
                    this.form.getForm().findField('FromStore').setVisible(true);
                    this.form.getForm().findField('FromStore').allowBlank = false;
              
           

                } else if (this.orderType == "Purchase Request") {

                    this.form.getForm().findField('RequestTypeId').setVisible(true);
                    this.form.getForm().findField('RequestTypeId').allowBlank = false;
                 

                }
                var grid = this.grid;
                var store = grid.getStore();
                var orderRequestDetail = store.recordType;
                this.form.loadDocument();
                for (var i = 0; i < this.selectedRecords.length; i++) {


                    var item = this.selectedRecords[i];

                    if (item.get('UnprocessedQuantity') > 0)
                    {
                        var p = new orderRequestDetail({
                            ItemId: item.get('ItemId'),
                            Name: item.get('ItemName'),
                            Code: item.get('Code'),
                            MeasurementUnit: item.get('Unit'),
                            UnitId: item.get('UnitId'),
                            UnprocessedQuantity: item.get('UnprocessedQuantity'),
                            Quantity: item.get('UnprocessedQuantity'),
                            IsUsedItem: item.get('IsUsedItem'),
                            PartNumber: item.get('PartNumber')
                        });
                        var count = store.getCount();
                        store.insert(count, p);
                    }
                  
                };
            }
        }
    }, config));
};
Ext.extend(Ext.erp.ux.requestOrder.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.requestOrder.Form();
        this.grid = new Ext.erp.ux.requestOrder.DetailGrid();
        this.items = [this.form, this.grid];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Save',
            iconCls: 'icon-accept',
            scope: this,
            handler: this.onSave
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Cancel',
            iconCls: 'icon-cancel',
            scope: this,
            handler: this.onCancel
        }];
        Ext.erp.ux.requestOrder.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var grid = Ext.getCmp('orderRequest-detailGrid');
        var store = grid.getStore();
        var rec = ''; var errorMesssage = "";
        var selectedItems = grid.getSelectionModel().getSelections();
        var store = grid.getStore();

        store.each(function (item) {
            if (typeof item.get('Quantity') == 'undefined' || item.get('Quantity') < 0) {
                if (errorMesssage == "")
                    errorMesssage = "Quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Quantity";
            }
            else if (item.get('Quantity') > item.get('UnprocessedQuantity')) {
                if (errorMesssage == "")
                    errorMesssage = " Quantity should not be greater than remaining quantity";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Quantity should not be greater than remaining quantity";
            }

            if (errorMesssage != '') {
                Ext.MessageBox.show({
                    title: 'Save failed',
                    msg: "Please Enter Valid values for Item  " + item.data['Name'] + " for feilds " + "</br>" + errorMesssage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
            rec = rec + item.data['Id'] + ':' +

                              item.data['Name'] + ':' +
                              item.data['ItemId'] + ':' +
                              item.data['Quantity'] + ':' +
                              item.data['RemainingQuantity'] + ':' +
                              item.data['UnitId'] + ':' +
                              item.data['Remark'] + ';';
        });

        if (errorMesssage != "")
            return;

        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
        var window = this;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ requestOrderDetails: rec }) },

            success: function (form, action) {

                Ext.getCmp('requestOrder-form').getForm().reset();
                Ext.getCmp('orderRequest-detailGrid').getStore().removeAll();
                Ext.getCmp('goodsRequest-detailGrid').getStore().removeAll();
                Ext.getCmp('goodsRequest-form').getForm().reset();

                Ext.MessageBox.show({
                    title: 'Success',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    scope: this
                });
                 window.close();

                 Ext.getCmp('goodsRequest-paging').doRefresh();


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
    onCancel: function () {
        this.close();
    }
});
Ext.reg('requestOrder-Window', Ext.erp.ux.requestOrder.Window);
