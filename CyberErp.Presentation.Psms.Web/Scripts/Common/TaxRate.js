Ext.ns('Ext.erp.ux.taxRate');

/**
* @desc      taxRate form
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.taxRate
* @class     Ext.erp.ux.taxRate.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.taxRate.Form = function (config) {
    Ext.erp.ux.taxRate.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: TaxRate.Get,
            submit: TaxRate.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'taxRate-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'CreatedAt',
            xtype: 'hidden'
        }, {
            name: 'Name',
            xtype: 'textfield',
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
            allowBlank: false
        }, {
            name: 'Rate',
            xtype: 'numberfield',
            fieldLabel: 'Rate',
            width: 100,
            readOnly: false,
            allowBlank: false
        }, {
            name: 'IsIncludedInItemCosting',
            checked: true,
            xtype: 'checkbox',
            fieldLabel: 'Is Included In Item Costing?',
            width: 100,
            readOnly: false,
            allowBlank: true,
            checked: false
        }, {
            name: 'IsAddition',
            checked: true,
            xtype: 'checkbox',
            fieldLabel: 'Is Addition?',
            width: 100,
            readOnly: false,
            allowBlank: true,
            checked: false
        }, {
            name: 'IsTaxable',
            checked: true,
            xtype: 'checkbox',
            fieldLabel: 'IsTaxable with Vat?',
            width: 100,
            readOnly: false,
            allowBlank: true,
            checked: false
        }, {
            name: 'Remark',
            xtype: 'textarea',
            fieldLabel: 'Remark',
            width: 100,
            readOnly: false,
            allowBlank: false
        }, ]
    }, config));
};
Ext.extend(Ext.erp.ux.taxRate.Form, Ext.form.FormPanel);
Ext.reg('taxRate-form', Ext.erp.ux.taxRate.Form);



/**
* @desc      Receive detailGrid
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      September 2013
* @namespace Ext.erp.ux.taxRate
* @class     Ext.erp.ux.taxRate.GridDetail
* @extends   Ext.grid.GridPanel
*/

Ext.erp.ux.taxRate.GridDetail = function (config) {
    Ext.erp.ux.taxRate.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: TaxRate.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            //  idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'TaxRateId', 'CostCenterId', 'SubsidiaryAccountId', 'CostCenter', 'SubsidiaryAccount', 'CreatedAt','Remark'],
            remoteSort: true
        }),
        id: 'taxRate-detailGrid',
        clicksToEdit: 1,
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: true,
        height: 300,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true
        },
        listeners: {
            beforeLoad: function () {
                Ext.getCmp('taxRate-detailGrid').body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
                Ext.getCmp('taxRate-detailGrid').body.unmask();
            },
            loadException: function () {
                Ext.getCmp('taxRate-detailGrid').body.unmask();
            },
            afteredit: function (e) {
                var record = e.record;
            }
        },
       cm: new Ext.grid.ColumnModel({
            columns: [
                new Ext.grid.RowNumberer(),
                {
                    dataIndex: 'CostCenter',
                    header: 'Cost Center',
                    sortable: true,
                    width: 140,
                    menuDisabled: true,
                    editor: new Ext.form.ComboBox({
                        hiddenName: 'CostCenter',
                        xtype: 'combo',
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
                            api: { read: Psms.GetCostCenter }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        listeners: {

                            select: function (combo, record, index) {

                                var detailDrid = Ext.getCmp('taxRate-detailGrid');
                                var selectedrecord = detailDrid.getSelectionModel().getSelected();
                                selectedrecord.set('CostCenterId', record.get("Id"));
                            }
                        }
                    })
                }, {
                    dataIndex: 'SubsidiaryAccount',
                    header: 'Subsidiary Account',
                    sortable: true,
                    width: 140,
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
                            api: { read: Psms.GetSubsidairyAccountBySearch }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        listeners: {

                            select: function (combo, record, index) {

                                var detailDrid = Ext.getCmp('taxRate-detailGrid');
                                var selectedrecord = detailDrid.getSelectionModel().getSelected();
                                selectedrecord.set('SubsidiaryAccountId', record.get("Id"));
                            }
                        }
                    })
                } ]
        })
    }, config));
}
Ext.extend(Ext.erp.ux.taxRate.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };

        this.tbar = [
            {
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: false,
                handler: function () {
                    var detailDrid = Ext.getCmp('taxRate-detailGrid');
                    var store = detailDrid.getStore();

                    var defaultData = {
                     Remark:'',
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
                    var grid = Ext.getCmp('taxRate-detailGrid');

                    if (!grid.getSelectionModel().hasSelection())
                        return;

                    var selectedrecord = grid.getSelectionModel().getSelected();
                    grid.getStore().remove(selectedrecord);
                }
            }, '->'

        ]
        this.bbar = []

        Ext.erp.ux.taxRate.GridDetail.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        Ext.erp.ux.taxRate.GridDetail.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('taxRate-detailGrid', Ext.erp.ux.taxRate.GridDetail);

/**
* @desc      taxRate registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2011, Cybersoft
* @date      January 27, 2011
* @namespace Ext.erp.ux.taxRate
* @class     Ext.erp.ux.taxRate.Window
* @extends   Ext.Window
*/
Ext.erp.ux.taxRate.Window = function (config) {
    Ext.erp.ux.taxRate.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 600,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.taxRateId);
                if (typeof this.taxRateId != "undefined" && this.taxRateId != "") {
                
                    this.form.load({ params: { id: this.taxRateId } });
                    var grid = Ext.getCmp('taxRate-detailGrid');
                    var store = grid.getStore();
                    store.baseParams = { record: Ext.encode({ taxRateId: this.taxRateId, action: "taxRate" }) };

                    grid.getStore().reload({
                        params: {
                            start: 0,
                            limit: grid.pageSize
                        }
                    });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.taxRate.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.taxRate.Form();
        this.grid = new Ext.erp.ux.taxRate.GridDetail();
        this.items = [this.form, this.grid];

        this.bbar = [{
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
        Ext.erp.ux.taxRate.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var grid = Ext.getCmp('taxRate-detailGrid');
        var store = grid.getStore();
      
        var rec = ''; var errorMesssage = "";
        store.each(function (item) {
            if (typeof item.get('CostCenterId') == 'undefined' || item.get('CostCenterId') =="") {
                if (errorMesssage == "")
                    errorMesssage = "Cost Center";
                else
                    errorMesssage = errorMesssage + "</br>" + "           Cost Center";
            }
            if (typeof item.get('SubsidiaryAccountId') == 'undefined' || item.get('SubsidiaryAccountId') =="") {
                if (errorMesssage == "")
                    errorMesssage = "Subsidiary Account";
                else
                    errorMesssage = errorMesssage + "</br>" + "          Subsidiary Account";
            }
            if (errorMesssage != '') {
                Ext.MessageBox.show({
                    title: 'Save failed',
                    msg: "Please Enter Valid values for Item  " + item.data['CostCenter'] + " for feilds " + "</br>" + errorMesssage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
            rec = rec + item.get('Id')+ ':' +

                   item.data['TaxRateId'] + ':' +
                   item.data['CostCenterId'] + ':' +
                   item.data['SubsidiaryAccountId'] + ':' +
                   item.data['Remark'] + ';';

     
        });
        if (errorMesssage != "")
            return;

        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ taxRateDetails: rec, action: this.action }) },

            success: function () {
                Ext.getCmp('taxRate-form').getForm().reset();
                Ext.getCmp('taxRate-detailGrid').getStore().removeAll();

                Ext.getCmp('taxRate-paging').doRefresh();
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
    onClose: function () {
        this.close();
    }
});
Ext.reg('taxRate-window', Ext.erp.ux.taxRate.Window);



/**
* @desc      taxRate Grid
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @namespace Ext.erp.ux.taxRate
* @class     Ext.erp.ux.taxRate.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.taxRate.Grid = function (config) {
    Ext.erp.ux.taxRate.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: TaxRate.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code', 'Rate', 'IsIncludedInItemCosting', 'IsAddition', 'Remark'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('taxRate-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('taxRate-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('taxRate-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'taxRate-grid',
        selectedUnitTypeId: 0,
        pageSize: 10,
        height: 300,
        stripeRows: true,
        border: false,
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
        }, new Ext.grid.RowNumberer(), {
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
            dataIndex: 'Rate',
            header: 'Rate',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'IsIncludedInItemCosting',
            header: 'Is Included In Item Costing?',
            sortable: true,
            width: 150,
            menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value)
                    return '<img src="Content/images/app/yes.png"/>';
                  else
                    return '<img src="Content/images/app/no.png"/>';
            }
        }, {
            dataIndex: 'IsAddition',
            header: 'Is Addition?',
            sortable: true,
            width: 150,
            menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value)
                    return '<img src="Content/images/app/yes.png"/>';
                else
                    return '<img src="Content/images/app/no.png"/>';
            }
        }, {
            dataIndex: 'Remark',
            header: 'Remark',
            sortable: true,
            width: 150,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.taxRate.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({  }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Add',
            id: 'addTaxRate',
            iconCls: 'icon-add',
            disabled: !Ext.erp.ux.Reception.getPermission('Tax Rate', 'CanAdd'),
            handler: this.onAddClick
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            id: 'editTaxRate',
            iconCls: 'icon-edit',
            disabled: !Ext.erp.ux.Reception.getPermission('Tax Rate', 'CanEdit'),
            handler: this.onEditClick
        }, {
            xtype: 'button',
            text: 'Delete',
            id: 'deleteTaxRate',
            iconCls: 'icon-delete',
            hidden: false,
            disabled: !Ext.erp.ux.Reception.getPermission('Tax Rate', 'CanDelete'),
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
                        var grid = Ext.getCmp('taxRate-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('taxRate-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'taxRate-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.taxRate.Grid.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        
        new Ext.erp.ux.taxRate.Window({
            mode: 'add',
            title: 'Add TaxRate'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('taxRate-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a TaxRate to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var taxRateId = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.ux.taxRate.Window({
            title: 'Edit TaxRate',
            taxRateId: taxRateId,          
            mode: 'edit'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('taxRate-grid');
        var taxRateId = grid.getSelectionModel().getSelected().get('Id');

        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected TaxR ate',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            animEl: 'delete',
            fn: function (btn) {
                if (btn == 'ok') {
                    TaxRate.Delete(taxRateId, function (result) {
                        if (result.success) {
                            Ext.getCmp('taxRate-paging').doRefresh();
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
        Ext.erp.ux.taxRate.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('taxRate-Grid', Ext.erp.ux.taxRate.Grid);



/**
* @desc      taxRate panel
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.taxRate
* @class     Ext.erp.ux.taxRate.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.taxRate.Panel = function (config) {
    Ext.erp.ux.taxRate.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'taxRate-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.taxRate.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.taxRate.Grid();
        this.items = [this.grid];
        Ext.erp.ux.taxRate.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('taxRate-panel', Ext.erp.ux.taxRate.Panel);
