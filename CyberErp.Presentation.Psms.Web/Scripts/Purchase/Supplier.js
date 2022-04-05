Ext.ns('Ext.erp.ux.supplier');



/**
* @desc      form
* @author    Meftuh mohammed
* @copyright (c) 2011, Cybersoft
* @date      April 27, 2019
* @namespace Ext.erp.ux.supplier
* @class     Ext.erp.ux.supplier.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.supplier.Form = function (config) {
    Ext.erp.ux.supplier.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Supplier.Get,
            submit: Supplier.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side',
            bodyStyle: 'background-color:transparent;'
        },
        id: 'supplier-form',
        padding: 3,
        labelWidth: 150,
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
                },{
                    name: 'SupplierCategoryId',
                    xtype: 'hidden'
                },{
                    name: 'SubsidiaryAccountId',
                    xtype: 'hidden'
                }, {
                    name: 'TaxRateIds',
                    xtype: 'hidden'
                }, {
                    name: 'TaxRate',
                    xtype: 'hidden'
                }, {
                    name: 'CreatedAt',
                    xtype: 'hidden'
                }, {
                    name: 'Name',
                    xtype: 'textarea',
                    fieldLabel: 'Description',
                    width: 100,
                    readOnly: false,
                    allowBlank: false
                }, {
                    name: 'Code',
                    xtype: 'textfield',
                    fieldLabel: 'Code',
                    readOnly: false,
                    value:'',
                    allowBlank: true
                }, {
                    hiddenName: 'SupplierCategory',
                    xtype: 'combo',
                    fieldLabel: 'Supplier Category',
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
                        paramOrder: ['TINId'],

                        api: {
                            read: Psms.GetSupplierCategory
                        }
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                    listeners: {
                        select: function (cmb, rec, idx) {
                            form = Ext.getCmp('supplier-form').getForm();
                            form.findField('SupplierCategoryId').setValue(rec.id);
                        }
                    }
                }, {
                    name: 'Telephone',
                    xtype: 'textfield',
                    fieldLabel: 'Telephone',
                    readOnly: false,
                    value: '',
                    allowBlank: false
                }, {
                    name: 'Email',
                    xtype: 'textfield',
                    fieldLabel: 'Email',
                    readOnly: false,
                    allowBlank: true
                }, {
                    hiddenName: 'SubsidiaryAccount',
                    xtype: 'combo',
                    fieldLabel: 'Subsidiary Account',
                    typeAhead: true,
                    width: 100,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    emptyText: '---Type to Search---',
                    mode: 'remote',
                    allowBlank: true,
                    hidden: false,
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Psms.GetSubsidairyAccountBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10,
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('supplier-form').getForm();
                            form.findField('SubsidiaryAccountId').setValue(rec.id);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('supplier-form').getForm();
                                form.findField('SubsidiaryAccountId').reset();

                            }
                        }
                    }
                }, {
                    name: 'Address',
                    xtype: 'textarea',
                    fieldLabel: 'Address',
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
                     name: 'ContactPerson',
                     xtype: 'textfield',
                     fieldLabel: 'Contact Person',
                     value: '',
                     readOnly: false,
                     allowBlank: true
                 }, {
                    name: 'TIN',
                    xtype: 'textfield',
                    fieldLabel: 'TIN',
                    readOnly: false,
                    allowBlank: true
                },
                {
                    name: 'VAT',
                    xtype: 'textfield',
                    fieldLabel: 'VAT Reg.No',
                    readOnly: false,
                    allowBlank: true
                },
               {
                   xtype: 'compositefield',
                   fieldLabel: 'Tax',
                   defaults: {
                       flex: 1
                   },
                   items: [
                       {
                           name: 'TaxRateDescription',
                           xtype: 'textarea',
                           fieldLabel: 'Tax',
                           allowBlank: true,
                           height:50,
                           readOnly: false
                       },
                   {
                       xtype: 'button',
                       width: 30,
                       iconCls: 'icon-add',
                       handler: function () {
                           var form = Ext.getCmp('supplier-form').getForm();
                           new Ext.erp.ux.taxPicker.Window({
                               targetForm: form,
                           }).show();

                       }
                   }
                   ]
               },
               {
                   name: 'PurchaseModality',
                   xtype: 'textfield',
                   fieldLabel: 'Purchase Modality',
                   readOnly: false,
                   value: '',
                   allowBlank: true
               },

                ]
            }]
        }],
    }, config));
}
Ext.extend(Ext.erp.ux.supplier.Form, Ext.form.FormPanel);
Ext.reg('supplier-form', Ext.erp.ux.supplier.Form);


/**
* @desc      Supplier detailGrid
* @author    Wondwosen Desalegn
* @copyright (c) 2010, Cybersoft
* @date      February 03, 2011
* @namespace Ext.erp.ux.supplier
* @class     Ext.erp.ux.supplier.DetailGrid
* @extends   Ext.detailGrid.GridPanel
*/

Ext.erp.ux.supplier.DetailGrid = function (config) {
    Ext.erp.ux.supplier.DetailGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Supplier.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'SupplierId', 'ItemId', 'Name', 'Code', 'MappingTypeId', 'MappingType', 'IsActive','Remark', ],
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
        id: 'supplier-detailGrid',
        pageSize: 50,
        height:200,
        stripeRows: true,
        border: false,
        clicksToEdit: 1,
        columnLines: true,
        hidden:true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
            afteredit: function (e) {
                var record = e.record;
            }
        },
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        columns: [new Ext.grid.RowNumberer(),
            {
                dataIndex: 'Id',
                header: 'Id',
                sortable: true,
                hidden: true,
                width: 100,
                menuDisabled: true
            },  {
                dataIndex: 'Name',
                header: 'Name',
                sortable: true,
                width: 110,
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
                            fields: ['Id', 'Name', 'Code']
                        }),
                        api: { read: Psms.GetItemBySearch }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    listeners: {

                        select: function (combo, record, index) {

                            var grid = Ext.getCmp('supplier-detailGrid');
                            var selectedrecord = grid.getSelectionModel().getSelected();
                            selectedrecord.set('ItemId', record.get("Id"));
                            selectedrecord.set('Code', record.get("Code"));
                        }
                    }
                })
            }, {
                dataIndex: 'Code',
                header: 'Code',
                sortable: true,
                width: 60,
                menuDisabled: true
            }, {
                dataIndex: 'MappingType',
                header: 'Mapping Type',
                sortable: true,
                width: 60,
                menuDisabled: true,
                editor: new Ext.form.ComboBox({
                    triggerAction: 'all',
                    mode: 'remote',
                    editable: false,
                    forceSelection: true,
                    emptyText: '---Select---',
                    allowBlank: true, store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        api: { read: Psms.GetSupplierItemMappingType }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    listeners: {

                        select: function (combo, record, index) {

                            var grid = Ext.getCmp('supplier-detailGrid');
                            var selectedrecord = grid.getSelectionModel().getSelected();
                            selectedrecord.set('MappingTypeId', record.get("Id"));
                         }
                    }
                })
            },{
                dataIndex: 'IsActive',
                header: 'Is Blocked?',
                width: 60,
                menuDisabled: true,
                editor: new Ext.form.Checkbox({
                })
            }, {
                dataIndex: 'Remark',
                header: 'Term and Condition',
                width: 130,
                menuDisabled: true,
                editor: new Ext.form.TextArea({
                    height: 150,

                })
            }],
    }, config));
}
Ext.extend(Ext.erp.ux.supplier.DetailGrid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ unitId: '' }) }

        this.tbar = [
            {
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: false,
                handler: function () {
                    var detailDrid = Ext.getCmp('supplier-detailGrid');
                    var store = detailDrid.getStore();
                 
                    var defaultData = {
                        IsActive: false
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
                    var grid = Ext.getCmp('supplier-detailGrid');

                    if (!grid.getSelectionModel().hasSelection())
                        return;

                    var selectedrecord = grid.getSelectionModel().getSelected();
                    grid.getStore().remove(selectedrecord);
                }
            }, '->',
            {
                xtype: 'button',
                text: 'Picker',
                iconCls: 'icon-picker',
                disabled: false,
                handler: function () {
                    var detailGrid = Ext.getCmp('supplier-detailGrid');
                    new Ext.erp.ux.itemPicker.Window({
                        targetGrid: detailGrid
                    }).show();
                }
            },

        ]

        Ext.erp.ux.supplier.DetailGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        Ext.erp.ux.supplier.DetailGrid.superclass.afterRender.apply(this, arguments);
    },
   });
Ext.reg('supplier-detailGrid', Ext.erp.ux.supplier.DetailGrid);


/**
* @desc      window
* @author    Meftuh mohammed
* @copyright (c) 2010, Cybersoft
* @date      April 01, 2019
* @namespace Ext.erp.ux.supplier
* @class     Ext.erp.ux.supplier.Window
* @extends   Ext.Window
*/
Ext.erp.ux.supplier.Window = function (config) {
    Ext.erp.ux.supplier.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 800,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {

                if (typeof this.supplierId != "undefined" && this.supplierId!="") {

                    this.form.load({ params: { id: this.supplierId } });
                    var detailGrid = Ext.getCmp('supplier-detailGrid');
                    detailGrid.store.baseParams = { record: Ext.encode({ supplierId: this.supplierId }) };
                    detailGrid.getStore().reload({
                        params: {
                            start: 0,
                            limit: detailGrid.pageSize
                        }
                    });
                }
                else {
                    this.form.getForm().findField('Id').setValue(this.supplierId);
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.supplier.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.supplier.Form();
        this.detailGrid =new Ext.erp.ux.supplier.DetailGrid();
   
       this.items = [this.form, this.detailGrid];

       this.bbar = [{
           text: '  ',
           id:'supplier-showDetail',
           iconCls: 'icon-accept',
           handler: this.onShowDetail,
           scope: this
       }, {
            text: '  ',
            iconCls: 'icon-save',
            handler: this.onSave,
            scope: this
        }, {
            text: '  ',
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
        Ext.erp.ux.supplier.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        var form = Ext.getCmp('supplier-form');
        if (!form.getForm().isValid()) return;

        var gridData = Ext.getCmp('supplier-detailGrid');
        var store = gridData.getStore();
        var rec = '';
        store.each(function (item) {

            rec = rec + item.data['Id'] + ':' +
           item.data['SupplierId'] + ':' +
           item.data['ItemId'] + ':' +
           item.data['MappingTypeId'] + ':' +
           item.data['IsActive'] + ':' +
           item.data['Remark'] + ';';

        });
        Ext.MessageBox.show({
            msg: 'Please wait...',
            width: 250,
            wait: true,
            waitConfig: { interval: 1000 }
        });
        var window = this;
      form.getForm().submit({
            waslmsg: 'Please wait...',
            params: { record: Ext.encode({ supplierItems: rec }) },
            success: function (form, action) {
                if (typeof window.targetForm != "undefined")
                {
                    window.targetForm.findField("SupplierId").setValue(action.result.supplierId);
                    window.targetForm.findField("Supplier").setValue(Ext.getCmp('supplier-form').getForm().findField("Name").getValue());

                }
          
                Ext.getCmp('supplier-form').getForm().reset();
                if (typeof Ext.getCmp('supplier-paging') != "undefined")
                    Ext.getCmp('supplier-paging').doRefresh();
                else
                    window.close();
                if (typeof Ext.getCmp('supplier-detailGrid') != "undefined")
                Ext.getCmp('supplier-detailGrid').getStore().removeAll();
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
    onShowDetail: function () {
        var button = Ext.getCmp('supplier-showDetail');
        if (button.text == "Show Detail")
        {
            Ext.getCmp('supplier-detailGrid').setVisible(true);
            button.text = "Hide Detail";
        }
        else
        {
            Ext.getCmp('supplier-detailGrid').setVisible(false);
            button.text = "Show Detail";

        }
     
}
});
Ext.reg('supplier-window', Ext.erp.ux.supplier.Window);


/**
* @desc      supplier grid
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      November 01, 2011
* @namespace Ext.erp.ux.supplier
* @class     Ext.erp.ux.supplier.Grid
* @extends   Ext.grid.GridPanel
*/

Ext.erp.ux.supplier.Grid = function (config) {
    Ext.erp.ux.supplier.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Supplier.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'Name', 'Code', 'SubsidiaryAccount', 'ContactPerson', 'Address', 'Email', 'SupplierCategory', 'Telephone', 'TIN', 'VAT', 'Remark'],
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
        id: 'supplier-grid',
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
                dataIndex: 'ContactPerson',
                header: 'Contact Person',
                sortable: true,
                width: 150,
                menuDisabled: true
            }, {
                dataIndex: 'TIN',
                header: 'TIN',
                sortable: true,
                width: 150,
                menuDisabled: true
            }, {
                dataIndex: 'VAT',
                header: 'VAT Re.No',
                sortable: true,
                width: 150,
                menuDisabled: true
            }, {
                dataIndex: 'Telephone',
                header: 'Telephone',
                sortable: true,
                width: 150,
                menuDisabled: true
            }, {
                dataIndex: 'Email',
                header: 'Email',
                sortable: true,
                width: 150,
                menuDisabled: true
            },{
                dataIndex: 'SubsidiaryAccount',
                header: 'Subsidiary Account',
                sortable: true,
                width: 150,
                menuDisabled: true
            }, {
                dataIndex: 'Address',
                header: 'Address',
                sortable: true,
                width: 150,
                menuDisabled: true
            }]
    }, config));
};
Ext.extend(Ext.erp.ux.supplier.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };
        this.tbar = [
            {
                xtype: 'button',
                text: 'Add',
                id: 'addsupplier',
                iconCls: 'icon-add',
                disabled: !Ext.erp.ux.Reception.getPermission('Supplier', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editsupplier',
                iconCls: 'icon-edit',
                disabled: !Ext.erp.ux.Reception.getPermission('Supplier', 'CanEdit'),


                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletesupplier',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.ux.Reception.getPermission('Supplier', 'CanDelete'),
                handler: this.onDeleteClick
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'textfield',
                emptyText: 'Type Search text here and press "Enter"',
                submitemptyText: false,
                enableKeyEvents: true,
                style: {
                    borderRadius: '25px',
                    padding: '0 10px',
                    width: '200px'
                },
                listeners: {
                    specialKey: function (field, e) {
                        if (e.getKey() == e.ENTER) {

                            var grid = Ext.getCmp('supplier-grid');
                            grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    Keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('supplier-grid');
                            grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    }
                }
            }];
        this.bbar = new Ext.PagingToolbar({
            id: 'supplier-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.supplier.Grid.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        new Ext.erp.ux.supplier.Window({
            title: 'Add supplier'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('supplier-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');

        new Ext.erp.ux.supplier.Window({
            supplierId: id,
            title: 'Edit supplier'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('supplier-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected supplier',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    Supplier.Delete(id, function (result, response) {
                        if (result.success) {
                            Ext.getCmp('supplier-paging').doRefresh();
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
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.supplier.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('supplier-Grid', Ext.erp.ux.supplier.Grid);


/**
* @desc      supplier Main panel
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      Augest 11, 2011
* @namespace Ext.erp.ux.supplier.Panel
* @class     Ext.erp.ux.supplier.itemPanel
* @extends   Ext.Panel
*/
Ext.erp.ux.supplier.Panel = function (config) {
    Ext.erp.ux.supplier.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        flex: 1.5,
        border: false,
    }, config));
};
Ext.extend(Ext.erp.ux.supplier.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.supplier.Grid();
        this.items = [this.grid];

        Ext.erp.ux.supplier.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('supplier-panel', Ext.erp.ux.supplier.Panel);

