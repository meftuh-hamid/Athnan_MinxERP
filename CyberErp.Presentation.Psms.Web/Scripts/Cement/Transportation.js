Ext.ns('Ext.erp.ux.transportation');

/**
* @desc      Transportation form

* @copyright (c) 2020, 
* @date      September 2013
* @namespace Ext.erp.ux.transportation
* @class     Ext.erp.ux.transportation.Form
* @extends   Ext.form.FormPanel
*/

Ext.erp.ux.transportation.Form = function (config) {
    Ext.erp.ux.transportation.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Transportation.Get,
            submit: Transportation.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'transportation-form',
        frame: true,
        labelWidth: 70,
        padding: 5,
        autoHeight: false,
        border: false,

        loadDocument: function () {

            Transportation.GetDocumentNo(function (result) {
                var form = Ext.getCmp('transportation-form').getForm();
                form.findField('StatusId').setValue(result.data.StatusId);
                form.findField('PreparedById').setValue(result.data.EmployeeId);
                form.findField('Date').setValue(new Date());
                form.findField('FiscalYearId').setValue(result.data.FiscalYearId);
                form.findField('DriverName').setValue('');
                form.findField('PlateNo').setValue('');
                form.findField('DriverTelephone').setValue('');


            });


        },
         baseCls: 'x-plain',
        items: [{
            layout: 'column',
            bodyStyle: 'background-color:transparent;',
            border: false,
            defaults: {
                columnWidth: .33,
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
                }, {
                    name: 'FiscalYearId',
                    xtype: 'hidden'
                },  {
                    name: 'SupplierId',
                    xtype: 'hidden'
                },  {
                    name: 'UnitId',
                    xtype: 'hidden'
                }, {
                    name: 'FreightOrderId',
                    xtype: 'hidden'
                }, {
                    name: 'CreatedAt',
                    xtype: 'hidden'
                }, {
                    name: 'StatusId',
                    xtype: 'hidden'
                }, {
                    name: 'PreparedById',
                    xtype: 'hidden'
                }, {
                    name: 'CustomerId',
                    xtype: 'hidden'
                }, {
                    name: 'ItemId',
                    xtype: 'hidden'
                }, {
                    hiddenName: 'VoucherNumber',
                    xtype: 'combo',
                    fieldLabel: 'Voucher No',
                    typeAhead: false,
                    width: 100,
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
                            fields: ['Id', 'Code','Name','ATC','ItemId','Item', 'SupplierId','Customer','CustomerId','InvoiceNo', 'Supplier', 'Quantity', 'Unit', 'UnitId']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetAllFrieghtOrderBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10,
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('transportation-form').getForm();
                            form.findField('FreightOrderId').setValue(rec.data['Id']);
                            form.findField('SupplierId').setValue(rec.data['SupplierId']);
                            form.findField('Supplier').setValue(rec.data['Supplier']);
                            form.findField('Quantity').setValue(rec.data['Quantity']);
                            form.findField('UnitId').setValue(rec.data['UnitId']);
                            form.findField('ATC').setValue(rec.data['ATC']);
                            form.findField('ItemId').setValue(rec.data['ItemId']);
                            form.findField('Item').setValue(rec.data['Item']);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('transportation-form').getForm();
                                form.findField('StoreId').reset();

                            }
                        }
                    }
                }, {
                    hiddenName: 'ATC',
                    xtype: 'combo',
                    fieldLabel: 'ATC',
                    typeAhead: false,
                    width: 100,
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
                            fields: ['Id', 'Name','SupplierId','Supplier', 'Quantity', 'Unit', 'UnitId']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetATCBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10,
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('transportation-form').getForm();
                              },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('transportation-form').getForm();
                        
                            }
                        }
                    }
                }, {
                    hiddenName: 'Supplier',
                    xtype: 'combo',
                    fieldLabel: 'Suplier',
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
                        api: { read: Psms.GetSupplierBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10, listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('transportation-form').getForm();
                            form.findField('SupplierId').setValue(rec.id);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('transportation-form').getForm();
                                form.findField('SupplierId').reset();
                            }
                        }
                    }
                }, {
                    hiddenName: 'Item',
                    xtype: 'combo',
                    fieldLabel: 'Item',
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
                        api: { read: Psms.GetItemBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10, listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('transportation-form').getForm();
                            form.findField('ItemId').setValue(rec.id);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('transportation-form').getForm();
                                form.findField('ItemId').reset();
                            }
                        }
                    }
                }, {
                    name: 'Quantity',
                    xtype: 'textfield',
                    fieldLabel: 'Quantity',
                    readOnly: false,
                    allowBlank: true
                }, {
                    name: 'UnitCost',
                    xtype: 'textfield',
                    fieldLabel: 'Unit Cost',
                    readOnly: false,
                    allowBlank: true
                }, {
                    name: 'Date',
                    xtype: 'datefield',
                    fieldLabel: 'Date',
                    width: 100,
                    allowBlank: false,
                    value: new Date(),
                },
               {
                   name: 'Location',
                   xtype: 'textfield',
                   fieldLabel: 'Location',
                   readOnly: false,
                   allowBlank: true
               }, {
                   name: 'IsOwnedVehicle',
                   checked: true,
                   xtype: 'checkbox',
                   fieldLabel: 'Is Owned Vehicle?',
                   width: 100,
                   readOnly: false,
                   allowBlank: true,
                   checked: false
               },
                 ]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [
                      {
                          hiddenName: 'DriverName',
                          xtype: 'combo',
                          fieldLabel: 'DriverName',
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
                              api: { read: Psms.GetEmployeeBySearch }
                          }),
                          valueField: 'Name',
                          displayField: 'Name',
                          pageSize: 10,
                          listeners: {
                              beforeQuery: function (combo, record, index) {
                                  this.store.baseParams = { salesPersonType: 'Driver' };
                                  this.getStore().reload({
                                      params: {
                                          start: 0,
                                          limit: this.pageSize
                                      }
                                  });

                              },
                              select: function (cmb, rec, idx) {
                              },
                              change: function (cmb, newvalue, oldvalue) {
                                  if (newvalue == "") {
                                  }
                              }
                          }
                      }, {
                          name: 'DriverTelephone',
                          xtype: 'textfield',
                          fieldLabel: 'Driver Telephone',
                          readOnly: false,
                          allowBlank: true
                      }, {
                          name: 'PlateNo',
                          xtype: 'textfield',
                          fieldLabel: 'PlateNo',
                          readOnly: false,
                          allowBlank: true
                      }, {
                          name: 'LicenseNo',
                          xtype: 'textfield',
                          fieldLabel: 'LicenseNo',
                          readOnly: false,
                          allowBlank: true
                      },
                ]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [
                     {
                         name: 'ShipperName',
                         xtype: 'textfield',
                         fieldLabel: 'Shipper',
                         readOnly: false,
                         allowBlank: true
                     }, {
                        name: 'ReceivedBy',
                        xtype: 'textfield',
                        fieldLabel: 'Received By',
                        readOnly: false,
                        allowBlank: true
                    }, {
                        name: 'Remark',
                        xtype: 'textarea',
                        fieldLabel: 'Remark',
                        width: 100,
                        allowBlank: true,
                        readOnly: false
                    }]
            }]
        }]
       
    }, config));
}
Ext.extend(Ext.erp.ux.transportation.Form, Ext.form.FormPanel);
Ext.reg('transportation-form', Ext.erp.ux.transportation.Form);



/* @desc     transportationOrder form host window

* @copyright (c) 2020, 
* @date     September 2013
* @namespace Ext.erp.ux.transportationOrder
* @class     Ext.erp.ux.transportationOrder.Window
* @extends   Ext.Window
*/

Ext.erp.ux.transportation.Window = function (config) {
    Ext.erp.ux.transportation.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 800,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'transportation-window',
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
   
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.transportationHeaderId);
               
                if (typeof this.transportationHeaderId != "undefined" && this.transportationHeaderId != "") {
                    this.form.load({
                        waitMsg: 'Loading...',
                        params: { id: this.transportationHeaderId },
                        success: function () {
                     
                        }
                    });
                }
                else {
                    Ext.getCmp('transportation-form').loadDocument();
                }

            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.ux.transportation.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.transportation.Form();
        this.items = [this.form];
        this.buttons = [
            {
                xtype: 'tbfill'
            }, {
                text: 'Save',
                iconCls: 'icon-accept',
                scope: this,
                handler: this.onSave
            }, {
                xtype: 'tbseparator'
            }, {
                text: 'Close',
                iconCls: 'icon-exit',
                handler: this.onCancel,
                scope: this
            }];
        Ext.erp.ux.transportation.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
       
    
        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
        var window = this;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ action: this.action }) },

            success: function (form, action) {

                Ext.getCmp('transportation-form').getForm().reset();
                 Ext.getCmp('transportation-paging').doRefresh();

                Ext.MessageBox.show({
                    title: 'Success',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    scope: this
                });
            //    window.close();
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
Ext.reg('transportation-window', Ext.erp.ux.transportation.Window);

/**
* @desc      Transportation grid

* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.transportation
* @class     Ext.erp.ux.transportation.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.transportation.Grid = function (config) {
    Ext.erp.ux.transportation.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Transportation.GetAllHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'DSC'
            },
            fields: ['Id', 'VoucherNumber', 'Date', 'StatusId', 'Status', 'UnitCost', 'Location', 'IsOwnedVehicle', 'PreparedBy', 'ATC', 'Unit', 'Quantity', 'DriverName', 'DriverTelephone', 'PlateNo', 'LicenseNo', 'ShipperName', 'ReceivedBy', 'Supplier'],
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
        id: 'transportation-grid',
        pageSize: 36,
        height: 300,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true
        },
        listeners: {
            rowClick: function () {
            },
            rowdblclick: function (grid, rowIndex, e) {
            },
            scope: this
        },
        columns: [
            new Ext.grid.RowNumberer(),
        {
            dataIndex: 'Status',
            header: 'Status',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.get("Status") == "Approved")
                    return '<img src="Content/images/app/OkPass.png"/>';
                else if (record.get("Status") == "Certified")
                    return '<img src="Content/images/app/pending.png"/>';
                else
                    return '<img src="Content/images/app/Cancel1.png"/>';
            }
        }, {
            dataIndex: 'VoucherNumber',
            header: 'VoucherNumber',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'ATC',
            header: 'ATC',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'Supplier',
            header: 'Supplier',
            sortable: true,
            width: 100,
            menuDisabled: true,
           renderer: this.customRenderer,
        }, {
            dataIndex: 'Location',
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

        },
        {
            dataIndex: 'UnitCost',
            header: 'Unit Cost',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,
        }, {
            dataIndex: 'Unit',
            header: 'Unit',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'Quantity',
            header: 'Quantity',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRendererForAmount,

        }, {
            dataIndex: 'IsOwnedVehicle',
            header: 'Is Owned Vehicle?',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.get("Status") == "Approved")
                    return '<img src="Content/images/app/OkPass.png"/>';
                else if (record.get("Status") == "Certified")
                    return '<img src="Content/images/app/pending.png"/>';
                else
                    return '<img src="Content/images/app/Cancel1.png"/>';
            }
        }, {
            dataIndex: 'DriverName',
            header: 'Driver',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'DriverTelephone',
            header: 'Driver Tele',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'PlateNo',
            header: 'PlateNo',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'Status',
            header: 'Status',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }]
    }, config));
}
Ext.extend(Ext.erp.ux.transportation.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [{
            id: 'searchTransportation',
            text: 'Search',
            iconCls: 'icon-filter',
            handler: this.onSearchVoucher
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Transportation', 'CanAdd'),
            handler: this.onAdd
        },{
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Transportation', 'CanEdit'),
     
            handler: this.onEdit
        },  {
            xtype: 'tbseparator',
            hidden: true,
        }, {
            xtype: 'button',
            text: 'Void',
            iconCls: 'icon-delete',
            disabled: !Ext.erp.ux.Reception.getPermission('Transportation', 'CanDelete'),
            handler: this.onDelete
        },{
            xtype: 'button',
            text: 'Preview',
            id: 'preview-Transportation',
            hidden: false,
            iconCls: 'icon-preview',
            handler: this.onPreview
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'transportation-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.transportation.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {

        var grid = Ext.getCmp('transportation-grid');
        if (!grid.getSelectionModel().hasSelection()) return;

       
        var voucherId = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        window.open('Reports/ErpReportViewer.aspx?rt=PreviewTransportation&id=' + voucherId, 'PreviewIV', parameter);

    },
    onAdd: function () {
           new Ext.erp.ux.transportation.Window({
            title: 'Add Transportation',
            action: 'Add'
        }).show();
    },
    onEdit: function () {
        var grid = Ext.getCmp('transportation-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var status = grid.getSelectionModel().getSelected().get('Status');
        if (status != "Posted") {
            Ext.MessageBox.show({
                title: 'Error',
                msg: "Only posted transaction are edited, check the status!",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.erp.ux.transportation.Window({
            title: 'Edit Transportation',
            transportationHeaderId: id,
            action: 'edit'
        }).show();
    },
    onDelete: function () {
        var grid = Ext.getCmp('transportation-grid');
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
                    Transportation.Void(id, function (result) {
                        if (result.success) {
                            Ext.getCmp('transportation-paging').doRefresh();
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
    onSearchVoucher: function () {
        Ext.erp.ux.voucherSearch.Observable.on('searchvoucher', function (result) {
            result['mode'] = 'search';
            var grid = Ext.getCmp('transportation-grid');
            grid.searchCriteria = result;
            grid.store.baseParams = { record: Ext.encode(result) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
        }, this);
        new Ext.erp.ux.voucherSearch.Window({ title: 'Search Transactions' }).show();
    },
    customRenderer: function (value, metaData, record, rowIndex, colIndex, store) {

        if (record.get("Status") == "Approved")
            return '<span style=color:blue>' + value + '</span>';
        else if (record.get("Status") == "Void")
            return '<span style=color:red>' + value + '</span>';
        else if (record.get("Status") == "Certified")
            return '<span style=color:black>' + value + '</span>';

        else
            return '<span style=color:black>' + value + '</span>';


    },
    customRendererForAmount: function (value, metaData, record, rowIndex, colIndex, store) {
        return '<span style=color:darkorange>' + Ext.util.Format.number(value, '0,000.00 ') + '</span>';
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.ux.transportation.Grid.superclass.afterRender.apply(this, arguments);
    },

});
Ext.reg('transportation-grid', Ext.erp.ux.transportation.Grid);





/**
* @desc      transportation panel

* @copyright (c) 2010, 
* @date      September 2013
* @version   $Id: transportation.js, 0.1
* @namespace Ext.erp.ux.transportation
* @class     Ext.erp.ux.transportation.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.transportation.Panel = function (config) {
    Ext.erp.ux.transportation.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false
    }, config));
}
Ext.extend(Ext.erp.ux.transportation.Panel, Ext.Panel, {
    initComponent: function () {
        this.headerGrid = new Ext.erp.ux.transportation.Grid();
    
        this.items = [this.headerGrid];

        Ext.erp.ux.transportation.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('transportation-panel', Ext.erp.ux.transportation.Panel);

/**
* @desc      VoucherSearch form
* @namespace Ext.erp.ux.transportation
* @class     Ext.erp.ux.transportation.Form
* @extends   Ext.form.FormPanel
*/

Ext.apply(Ext.form.VTypes, {
    daterange: function (val, field) {
        var date = field.parseDate(val);
        if (!date) {
            return false;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = Ext.getCmp(field.startDateField);
            start.setMaxValue(date);
            this.dateRangeMax = date;
        }
        else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = Ext.getCmp(field.endDateField);
            end.setMinValue(date);
            this.dateRangeMin = date;
        }
        return true;
    }
});

