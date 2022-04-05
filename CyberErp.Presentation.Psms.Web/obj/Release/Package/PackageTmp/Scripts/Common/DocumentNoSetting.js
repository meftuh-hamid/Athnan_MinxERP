Ext.ns('Ext.erp.ux.documentNoSetting');
/**
* @desc      DocumentNoSetting registration form
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.ux.documentNoSetting
* @class     Ext.erp.ux.documentNoSetting.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.documentNoSetting.Form = function (config) {
    Ext.erp.ux.documentNoSetting.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: DocumentNoSetting.Get,
            submit: DocumentNoSetting.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'documentNoSetting-form',
        padding: 5,
        labelWidth: 120,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'StoreId',
            xtype: 'hidden'
        },
        {
            name: 'SupplierId',
            xtype: 'hidden'
        },
         {
             hiddenName: 'DocumentType',
             xtype: 'combo',
             fieldLabel: 'Document Type',
             triggerAction: 'all',
             mode: 'local',
             editable: false,
             forceSelection: false,
             emptyText: '---Select---',
             allowBlank: false,
             store: new Ext.data.ArrayStore({
                 fields: ['Id', 'Name'],
                 idProperty: 'Name',
                 data: [
                     [1, 'Store Requisition'],
                     [2, 'Issue'],
                     [3, 'Receive'],
                     [4, 'Transfer Issue'],
                     [5, 'Transfer Receive'],
                     [6, 'Return'],
                     [8, 'Disposal'],
                     [9, 'Adjustment'],
                     [10, 'FixedAsset Transfer'],
                     [13, 'Purchase Request'],
                     [14, 'Purchase Order'],
                      [13, 'Sales Order'],
                     [14, 'Production Order'],
                     [15, 'Production Plan'],
                     [15, 'Freight Order'],
                 

                 ]
             }),
             valueField: 'Name',
             displayField: 'Name',
         },
        {
            hiddenName: 'Store',
            xtype: 'combo',
            fieldLabel: 'To Store',
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
                api: { read: Psms.GetStoreBySearch }
            }),
            valueField: 'Name',
            displayField: 'Name',
            pageSize: 10,
            listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('documentNoSetting-form').getForm();
                    form.findField('StoreId').setValue(rec.id);
                },
                change: function (cmb, newvalue, oldvalue) {
                    if (newvalue == "") {
                        var form = Ext.getCmp('documentNoSetting-form').getForm();
                        form.findField('StoreId').reset();

                    }
                }
            }
        }, {
            hiddenName: 'Supplier',
            xtype: 'combo',
            fieldLabel: 'Supplier',
            typeAhead: true,
            hideTrigger: true,
            minChars: 2,
            listWidth: 280,
            emptyText: '---Type to Search---',
            mode: 'remote',
            allowBlank: true,
            tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name', 'PurchaseModality', 'TaxRateIds', 'TaxRateDescription', 'TaxRate']
                }),
                autoLoad: true,
                api: { read: Psms.GetSupplierBySearch }
            }),
            valueField: 'Name',
            displayField: 'Name',
            pageSize: 10, listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('documentNoSetting-form').getForm();
                    form.findField('SupplierId').setValue(rec.id);
                 
                },
                change: function (cmb, newvalue, oldvalue) {
                    if (newvalue == "") {
                        var form = Ext.getCmp('documentNoSetting-form').getForm();
                        form.findField('SupplierId').reset();            
                    }
                }
            }
        }, {
            name: 'PreFix',
            xtype: 'textfield',
            fieldLabel: 'PreFix',
            allowBlank: false
        }, {
            name: 'SurFix',
            xtype: 'textfield',
            fieldLabel: 'SurFix',
            allowBlank: true
        }, {
            name: 'Year',
            xtype: 'textfield',
            fieldLabel: 'Year',
            allowBlank: true
        }, {
            name: 'NoofDigit',
            xtype: 'textfield',
            fieldLabel: 'No of Digit',
            allowBlank: false
        }, {
            name: 'LastNumber',
            xtype: 'numberfield',
            fieldLabel: 'Last Number',
            allowBlank: false
        }, ]
    }, config));
};
Ext.extend(Ext.erp.ux.documentNoSetting.Form, Ext.form.FormPanel);
Ext.reg('documentNoSetting-form', Ext.erp.ux.documentNoSetting.Form);

/**
* @desc      DocumentNoSetting registration form host window
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.ux.documentNoSetting
* @class     Ext.erp.ux.documentNoSetting.Window
* @extends   Ext.Window
*/
Ext.erp.ux.documentNoSetting.Window = function (config) {
    Ext.erp.ux.documentNoSetting.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 500,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.documentNoSettingId);
                if (this.documentNoSettingId != '') {
                    this.form.load({ params: { id: this.documentNoSettingId } });
                }
            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.ux.documentNoSetting.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.documentNoSetting.Form();
        this.items = [this.form];
        this.bbar = [{
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
        this.tools = [{
            id: 'refresh',
            qtip: 'Reset',
            handler: function () {
                this.form.getForm().reset();
            },
            scope: this
        }];
        Ext.erp.ux.documentNoSetting.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('documentNoSetting-form').getForm().reset();
                Ext.getCmp('documentNoSetting-paging').doRefresh();
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
    }
});
Ext.reg('documentNoSetting-window', Ext.erp.ux.documentNoSetting.Window);

/**
* @desc      DocumentNoSetting grid
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.ux.documentNoSetting
* @class     Ext.erp.ux.documentNoSetting.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.documentNoSetting.Grid = function (config) {
    Ext.erp.ux.documentNoSetting.Grid.superclass.constructor.call(this, Ext.apply({


        store: new Ext.data.GroupingStore({
            proxy: new Ext.data.DirectProxy({
                directFn: DocumentNoSetting.GetAll,
                paramsAsHash: false,
                paramOrder: 'start|limit|sort|dir|param',
            }),
            reader: new Ext.data.JsonReader({
                root: 'data',
                idProperty: 'Id',
                totalProperty: 'total',
                sortInfo: {
                    field: 'DocumentType',
                    direction: 'ASC'
                },
                fields: ['Id', 'DocumentType', 'PreFix', 'Store','Supplier', 'SurFix', 'Year', 'LastNumber', 'NoofDigit'],
            }),
            groupField: 'Store',
            sortInfo: {
                field: 'Store',
                direction: 'ASC'
            },
            remoteSort: true,
            listeners: {
                beforeLoad: function () { this.body.mask('Loading...', 'x-mask-loading'); },
                load: function () { this.body.unmask(); },
                loadException: function () { this.body.unmask(); },
                scope: this
            }
        }),
        view: new Ext.grid.GroupingView({
            forceFit: true,
            showGroupName: false,
            groupTextTpl: '{text}'
        }),


       
        id: 'documentNoSetting-grid',
        loadMask: true,
        pageSize: 30,
        stripeRows: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'DocumentType',
            header: 'Document Type',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'Store',
            header: 'Store',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'Supplier',
            header: 'Supplier',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'PreFix',
            header: 'PreFix',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'SurFix',
            header: 'SurFix',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'Year',
            header: 'Year',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'NoofDigit',
            header: 'No of Digit',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'LastNumber',
            header: 'Last Number',
            sortable: true,
            width: 200,
            menuDisabled: true
        }
        ]
    }, config));
};
Ext.extend(Ext.erp.ux.documentNoSetting.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'documentNoSetting-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.documentNoSetting.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.documentNoSetting.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('documentNoSetting-grid', Ext.erp.ux.documentNoSetting.Grid);


/**
* @desc      DocumentNoSetting Item panel
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.ux.documentNoSetting
* @class     Ext.erp.ux.documentNoSetting.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.documentNoSetting.Panel = function (config) {
    Ext.erp.ux.documentNoSetting.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: !Ext.erp.ux.Reception.getPermission('Document No Setting', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                iconCls: 'icon-edit',
                disabled: !Ext.erp.ux.Reception.getPermission('Document No Setting', 'CanEdit'),
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.ux.Reception.getPermission('Document No Setting', 'CanDelete'),
                handler: this.onDeleteClick
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'textfield',
                emptyText: 'Type search text here',
                submitEmptyText: false,
                enableKeyEvents: true,
                style: {
                    borderRadius: '25px',
                    padding: '0 10px',
                    width: '300px'
                },
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            var grid = Ext.getCmp('documentNoSetting-grid');
                            grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('documentNoSetting-grid');
                            grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    }
                }
            }]
        }
    }, config));
};
Ext.extend(Ext.erp.ux.documentNoSetting.Panel, Ext.Panel, {
    initComponent: function () {
        var grid = new Ext.erp.ux.documentNoSetting.Grid();
     
        this.items = [grid];

        Ext.erp.ux.documentNoSetting.Panel.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        new Ext.erp.ux.documentNoSetting.Window({
            documentNoSettingId: 0,
            title: 'Add DocumentNoSetting'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('documentNoSetting-grid');
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
        new Ext.erp.ux.documentNoSetting.Window({
            documentNoSettingId: id,
            title: 'Edit DocumentNoSetting'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('documentNoSetting-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a record to delete.',
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
            animEl: 'Delete',
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    DocumentNoSetting.Delete(id, function (result, response) {
                        Ext.getCmp('documentNoSetting-paging').doRefresh();
                    }, this);
                }
            }
        });
    }
});
Ext.reg('documentNoSetting-panel', Ext.erp.ux.documentNoSetting.Panel);
