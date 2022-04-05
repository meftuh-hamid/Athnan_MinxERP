Ext.ns('Ext.erp.ux.storeLocationBin');

/**
* @desc      storeLocationBin form
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.storeLocationBin
* @class     Ext.erp.ux.storeLocationBin.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.storeLocationBin.Form = function (config) {
    Ext.erp.ux.storeLocationBin.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: StoreLocation.GetLocationBin,
            submit: StoreLocation.SaveLocationBin
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'storeLocationBin-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        },  {
            name: 'StoreLocationId',
            xtype: 'hidden'
        }, {
            name: 'CreatedAt',
            xtype: 'hidden'
        }, {
            xtype: 'textfield',
            name: 'StoreLocation',
            fieldLabel: 'Store Location',
            allowBlank: false,
            disabled: true
        },  {
            name: 'Name',
            xtype: 'textfield',
            fieldLabel: 'Name',
            width: 100,
            allowBlank: true
        }, {
            name: 'Code',
            xtype: 'textfield',
            fieldLabel: 'Code',
            width: 100,
            allowBlank: true
        }, {
            name: 'Size',
            xtype: 'textfield',
            fieldLabel: 'Size',
            width: 100,
            allowBlank: true
        }, {
            name: 'Capacity',
            xtype: 'textfield',
            fieldLabel: 'Capacity',
            width: 100,
            allowBlank: true
        }, {
            name: 'UtilizedSpace',
            xtype: 'numberfield',
            fieldLabel: 'Utilized Space',
            width: 100,
            allowBlank: true
        }, {
            xtype: 'textarea',
            name: 'Remark',
            width: 100,
            hidden: false,
            fieldLabel: 'Remark',
            allowBlank: true
        }]
    }, config));
};
Ext.extend(Ext.erp.ux.storeLocationBin.Form, Ext.form.FormPanel);
Ext.reg('storeLocationBin-form', Ext.erp.ux.storeLocationBin.Form);

/**
* @desc      LocationBin registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.storeLocationBin
* @class     Ext.erp.ux.storeLocationBin.Window
* @extends   Ext.Window
*/
Ext.erp.ux.storeLocationBin.Window = function (config) {
    Ext.erp.ux.storeLocationBin.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 500,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                this.form.getForm().findField('StoreLocationId').setValue(this.storeLocationId);
                this.form.getForm().findField('StoreLocation').setValue(this.storeLocationName);
                 if (this.mode == 'edit') {
                    this.form.getForm().load({ params: { id: this.storeLocationBinId } });
                }
            }
        }
    }, config));
};
Ext.extend(Ext.erp.ux.storeLocationBin.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.storeLocationBin.Form({ mode: this.mode });
        this.items = [this.form];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Save',
            iconCls: 'icon-save',
            scope: this,
            handler: this.onStoreLocationBinSave
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onStoreLocationBinClose,
            scope: this
        }];
        this.tools = [{
            id: 'refresh',
            qtip: 'Reset',
            handler: function () {
                var win = this;
                var form=this.form;
                form.reset();
                form.findField('StoreLocationId').setRawValue(win.storeId);
                form.findField('StoreLocation').setRawValue(win.storeLocationName);
            },
            scope: this
        }];
        Ext.erp.ux.storeLocationBin.Window.superclass.initComponent.call(this, arguments);
    },
    onStoreLocationBinSave: function () {
        if (!this.form.getForm().isValid()) return;
        var win = this;
        
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                var form = Ext.getCmp('storeLocationBin-form').getForm();
                form.reset();
               
                form.findField('StoreLocationId').setRawValue(win.storeId);
                form.findField('StoreLocation').setRawValue(win.storeLocationName);
                Ext.getCmp('storeLocationBin-paging').doRefresh();
                form.findField('Id').setRawValue('');
                if (mode == 'edit') {
                    win.close();
                }
            },
            failure: function (option, response) {
                Ext.MessageBox.show({
                    title: 'Failure',
                    msg: response.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    },
    onStoreLocationBinClose: function () {
        this.close();
    }
});
Ext.reg('storeLocationBin-window', Ext.erp.ux.storeLocationBin.Window);



/**
* @desc      storeLocationBin Grid
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.storeLocationBin
* @class     Ext.erp.ux.storeLocationBin.Grid
* @extends   Ext.grid.GridPanel
*/




Ext.erp.ux.storeLocationBin.Grid = function (config) {
    Ext.erp.ux.storeLocationBin.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: StoreLocation.GetAllLocationBin,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code', 'Type', 'Size', 'Capacity', 'UtilizedSpace', 'StoreLocation'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { this.body.mask('Loading...', 'x-mask-loading'); },
                load: function () {this.body.unmask(); },
                loadException: function () {this.body.unmask(); },
                scope: this
            }
        }),
        id: 'storeLocationBin-grid',
        pageSize: 30,
        height: 300,
        stripeRows: true,
        border: false,
        storeLocationId: 0,
        storeLocationName: '',
        columnLines: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true,
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
            dataIndex: 'StoreLocation',
            header: 'Store Location',
            sortable: true,
            hidden:true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Code',
            header: 'Code',
            sortable: true,
            width: 100,
            menuDisabled: true
        },{
            dataIndex: 'Size',
            header: 'Size',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Capacity',
            header: 'Capacity',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'UtilizedSpace',
            header: 'Utilized Space',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.renderer,

        }]
    }, config));
}
Ext.extend(Ext.erp.ux.storeLocationBin.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ storeLocationId: this.storeLocationId }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Add',
            id: 'addStoreLocationBin',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Store', 'CanAdd'),
            handler: this.onAddClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            id: 'editStoreLocationBin',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Store', 'CanEdit'),
            handler: this.onEditClick
        }, {
            xtype: 'button',
            text: 'Delete',
            id: 'deleteStoreLocationBin',
            iconCls: 'icon-delete',
            hidden: false,
            disabled: !Ext.erp.ux.Reception.getPermission('Store', 'CanDelete'),
            handler: this.onDeleteClick
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'textfield',
            emptyText: 'Type Search text here and press "Enter"',
            submitEmptyText: false,
            enableKeyEvents: true,
            style: {
                borderRadius: '25px',
                padding: '0 10px',
                width: '200px'
            },
            listeners: {
                specialKey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        var grid = Ext.getCmp('storeLocationBin-grid');
                        storeLocationId = grid.storeLocationId;
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), storeLocationId: storeLocationId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('storeLocationBin-grid');
                        storeLocationId = grid.storeLocationId;
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), storeLocationId: storeLocationId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'storeLocationBin-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });

        Ext.erp.ux.storeLocationBin.Grid.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        var grid = Ext.getCmp('storeLocationBin-grid');
        var storeLocationId = grid.storeLocationId;
        var storeLocationName = grid.storeLocationName;
        if (storeLocationId == 0) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select parent Location Bin.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.erp.ux.storeLocationBin.Window({
            storeLocationId: storeLocationId,
            storeLocationName: storeLocationName,
            mode: 'add',
            title: 'Add Location Bin'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('storeLocationBin-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a Location Bin to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var storeLocationBinId = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.ux.storeLocationBin.Window({
            title: 'Edit Location Bin',
            storeLocationBinId: storeLocationBinId,
            mode: 'edit',
            title: 'edit Location Bin'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('storeLocationBin-grid');
        var storeLocationBinId = grid.getSelectionModel().getSelected().get('Id');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a Location Bin to delete.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Location Bin',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            animEl: 'delete',
            fn: function (btn) {
                if (btn == 'ok') {
                    StoreLocation.DeleteLocationBin(storeLocationBinId, function (result) {
                        Ext.getCmp('storeLocationBin-paging').doRefresh();
                        if (result.success) {
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
        this.loadData();
        Ext.erp.ux.storeLocationBin.Grid.superclass.afterRender.apply(this, arguments);
    },
    loadData: function () {
        var grid = this;
        if (typeof grid != "undefined") {
            grid.store.baseParams = { record: Ext.encode({ storeLocationId: this.storeLocationId }) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });

        }
    }, renderer: function (value, metaData, record, rowIndex, colIndex, store) {

    if(value==0) value = 1;
    var capacity = record.data['Capacity']; if (capacity == 0) capacity = 1;
    var percent = (value / capacity)*100;
    return '<div class="x-progress x-progress-default" style="height: 13px;"><div class="x-progress-bar x-progress-bar-default" style="width: ' + percent + '%"></div></div>';
}
 
});
Ext.reg('storeLocationBin-Grid', Ext.erp.ux.storeLocationBin.Grid);




/**
* @desc      storeLocationBin panel
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.storeLocationBin
* @class     Ext.erp.ux.storeLocationBin.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.storeLocationBin.Panel = function (config) {
    Ext.erp.ux.storeLocationBin.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'storeLocationBin-panel',
        title:'Location Bin',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.storeLocationBin.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.storeLocationBin.Grid();
       this.items = [this.grid];
        Ext.erp.ux.storeLocationBin.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('storeLocationBin-panel', Ext.erp.ux.storeLocationBin.Panel);
