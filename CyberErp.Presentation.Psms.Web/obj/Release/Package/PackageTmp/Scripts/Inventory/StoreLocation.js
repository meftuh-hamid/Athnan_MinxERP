Ext.ns('Ext.erp.ux.storeLocation');

/**
* @desc      storeLocation form
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.storeLocation
* @class     Ext.erp.ux.storeLocation.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.storeLocation.Form = function (config) {
    Ext.erp.ux.storeLocation.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: StoreLocation.Get,
            submit: StoreLocation.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'storeLocation-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        },  {
            name: 'StoreId',
            xtype: 'hidden'
        }, {
            name: 'CreatedAt',
            xtype: 'hidden'
        }, {
            xtype: 'textfield',
            name: 'Store',
            fieldLabel: 'Store',
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
            name: 'Type',
            xtype: 'textfield',
            fieldLabel: 'Type',
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
Ext.extend(Ext.erp.ux.storeLocation.Form, Ext.form.FormPanel);
Ext.reg('storeLocation-form', Ext.erp.ux.storeLocation.Form);

/**
* @desc      Location registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.storeLocation
* @class     Ext.erp.ux.storeLocation.Window
* @extends   Ext.Window
*/
Ext.erp.ux.storeLocation.Window = function (config) {
    Ext.erp.ux.storeLocation.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('StoreId').setValue(this.storeId);
                this.form.getForm().findField('Store').setValue(this.storeName);
                 if (this.mode == 'edit') {
                    this.form.getForm().load({ params: { id: this.storeLocationId } });
                }
            }
        }
    }, config));
};
Ext.extend(Ext.erp.ux.storeLocation.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.storeLocation.Form({ mode: this.mode });
        this.items = [this.form];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Save',
            iconCls: 'icon-save',
            scope: this,
            handler: this.onStoreLocationSave
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onStoreLocationClose,
            scope: this
        }];
        this.tools = [{
            id: 'refresh',
            qtip: 'Reset',
            handler: function () {
                var win = this;
                var form=this.form;
                form.reset();
                form.findField('StoreId').setRawValue(win.storeId);
                form.findField('Store').setRawValue(win.storeName);
            },
            scope: this
        }];
        Ext.erp.ux.storeLocation.Window.superclass.initComponent.call(this, arguments);
    },
    onStoreLocationSave: function () {
        if (!this.form.getForm().isValid()) return;
        var win = this;
        
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                var form = Ext.getCmp('storeLocation-form').getForm();
                form.reset();
               
                form.findField('StoreId').setRawValue(win.storeId);
                form.findField('Store').setRawValue(win.storeName);
                Ext.getCmp('storeLocation-paging').doRefresh();
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
    onStoreLocationClose: function () {
        this.close();
    }
});
Ext.reg('storeLocation-window', Ext.erp.ux.storeLocation.Window);



/**
* @desc      storeLocation Grid
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.storeLocation
* @class     Ext.erp.ux.storeLocation.Grid
* @extends   Ext.grid.GridPanel
*/




Ext.erp.ux.storeLocation.Grid = function (config) {
    Ext.erp.ux.storeLocation.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: StoreLocation.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code', 'Type', 'Size', 'Capacity', 'UtilizedSpace', 'Store'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { this.body.mask('Loading...', 'x-mask-loading'); },
                load: function () {this.body.unmask(); },
                loadException: function () {this.body.unmask(); },
                scope: this
            }
        }),
        id: 'storeLocation-grid',
        pageSize: 30,
        height: 300,
        stripeRows: true,
        border: false,
        storeId: 0,
        storeName:'',
        columnLines: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true,
            autoFill: true
        }, listeners: {
            rowClick: function () {
                var grid = Ext.getCmp('storeLocation-grid');
                var id = grid.getSelectionModel().getSelected().get('Id');
                var storeLocation = grid.getSelectionModel().getSelected().get('Name');


                Ext.getCmp('storeLocationBin-grid').storeLocationId = id;
                Ext.getCmp('storeLocationBin-grid').storeLocationName = storeLocation;
                Ext.getCmp('storeLocationBin-grid').loadData();

            },
            rowdblclick: function (grid, rowIndex, e) {
            },
            scope: this
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
            dataIndex: 'Store',
            header: 'Store',
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
        }, {
            dataIndex: 'Type',
            header: 'Type',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
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
Ext.extend(Ext.erp.ux.storeLocation.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ storeId: this.storeId }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Add',
            id: 'addStoreLocation',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Store', 'CanAdd'),
            handler: this.onAddClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            id: 'editStoreLocation',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Store', 'CanEdit'),
            handler: this.onEditClick
        }, {
            xtype: 'button',
            text: 'Delete',
            id: 'deleteStoreLocation',
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
                        var grid = Ext.getCmp('storeLocation-grid');
                        storeId = grid.storeId;
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), storeId: storeId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('storeLocation-grid');
                        storeId = grid.storeId;
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue(), storeId: storeId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'storeLocation-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });

        Ext.erp.ux.storeLocation.Grid.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        var grid = Ext.getCmp('storeLocation-grid');
        var storeId = grid.storeId;
        var storeName = grid.storeName;
        if (storeId == 0) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select parent store Location.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.erp.ux.storeLocation.Window({
            storeId: storeId,
            storeName: storeName,
            mode: 'add',
            title: 'Add Store Location'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('storeLocation-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a store Location to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var storeLocationId = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.ux.storeLocation.Window({
            title: 'Edit Store Location',
            storeLocationId: storeLocationId,
            mode: 'edit',
            title: 'edit Store Location'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('storeLocation-grid');
        var storeLocationId = grid.getSelectionModel().getSelected().get('Id');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a Store Location to delete.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected store Location',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            animEl: 'delete',
            fn: function (btn) {
                if (btn == 'ok') {
                    StoreLocation.Delete(storeLocationId, function (result) {
                        Ext.getCmp('storeLocation-paging').doRefresh();
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
        Ext.erp.ux.storeLocation.Grid.superclass.afterRender.apply(this, arguments);
    },
    loadData: function () {
        var grid = this;
        if (typeof grid != "undefined") {
            grid.store.baseParams = { record: Ext.encode({ storeId: this.storeId }) };
            grid.store.load({ params: { start: 0, limit: grid.pageSize } });

        }
    },
    renderer: function (value, metaData, record, rowIndex, colIndex, store) {

        if (value == 0) value = 1;
        var capacity = record.data['Capacity']; if (capacity == 0) capacity = 1;
        var percent = (value / capacity) * 100;
        return '<div class="x-progress x-progress-default" style="height: 13px;"><div class="x-progress-bar x-progress-bar-default" style="width: ' + percent + '%"></div></div>';
    }
 
});
Ext.reg('storeLocation-Grid', Ext.erp.ux.storeLocation.Grid);

/**
* @desc      storeLocation panel
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.storeLocation
* @class     Ext.erp.ux.storeLocation.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.storeLocation.LocationPanel = function (config) {
    Ext.erp.ux.storeLocation.LocationPanel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'storeLocation-locationPanel',
        title: 'Location',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.storeLocation.LocationPanel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.storeLocation.Grid();
        this.items = [this.grid];
        Ext.erp.ux.storeLocation.LocationPanel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('storeLocation-locationPanel', Ext.erp.ux.storeLocation.LocationPanel);


/**
* @desc      storeLocation panel
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.storeLocation
* @class     Ext.erp.ux.storeLocation.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.storeLocation.Panel = function (config) {
    Ext.erp.ux.storeLocation.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'storeLocation-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.storeLocation.Panel, Ext.Panel, {
    initComponent: function () {
        this.locationPanel = new Ext.erp.ux.storeLocation.LocationPanel();
        this.locationBinPanel = new Ext.erp.ux.storeLocationBin.Panel();
        this.items = [{
            layout: 'hbox',
            border:true,
            layoutConfig: {
                type: 'vbox',
                align: 'stretch',
                border: true,
                pack: 'start'
            },
            defaults: {
                flex: 1
            },
            items: [this.locationPanel, this.locationBinPanel]

        }];
        Ext.erp.ux.storeLocation.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('storeLocation-panel', Ext.erp.ux.storeLocation.Panel);
