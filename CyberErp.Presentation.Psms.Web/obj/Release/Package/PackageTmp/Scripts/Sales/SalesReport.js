﻿Ext.ns('Ext.erp.ux.rptSales');

/**
* @desc      General Ledger Report Criteria form
* @author    Meftuh Mohammed
* @copyright (c) 2012, Cybersoft
* @date      April 24, 2012
* @namespace Ext.erp.ux.rptSales
* @class     Ext.erp.ux.rptSales.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.rptSales.Form = function (config) {
    Ext.erp.ux.rptSales.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            submit: ERPReport.SetBincardReportParam
        },
        defaults: {
            anchor: '95%',
            msgTarget: 'side',
            labelStyle: 'text-align:right;'
        },
        id: 'rptSales-form',
        padding: 5,
        labelWidth: 110,
        autoHeight: true,
        border: false,
        width: 840,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'Consumer',
            xtype: 'hidden'
        }, {
            name: 'CustomerId',
            xtype: 'hidden'
        }, {
            name: 'CustomerCode',
            xtype: 'hidden'
        }, {
            hiddenName: 'ReportName',
            xtype: 'combo',
            fieldLabel: 'Report Name',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            forceSelection: false,
            emptyText: '---Select---',
            allowBlank: false,
            store: new Ext.data.ArrayStore({
                fields: ['Id', 'Name'],
                data: [
                    ['Sales', 'Sales'],
                    ['Sales Summary', 'Sales Summary'],
                    ['Collection', 'Collection'],
                    ['Settlement', 'Settlement'],
                    ['Customer Ledger', 'Customer Ledger'],
                    ['Customer Balance', 'Customer Balance'],
                    ['Customer Aging', 'Customer Aging'],

                ]
            }),
            valueField: 'Id',
            displayField: 'Name',

        }, {
            name: 'VoucherNo',
            xtype: 'textfield',
            fieldLabel: 'VoucherNo',
            readonly: false,
            hidden: true,
            allowBlank: true
        }, {
            name: 'ReferenceNo',
            xtype: 'textfield',
            fieldLabel: 'Reference No',
            readonly: false,
            hidden: true,
            allowBlank: true
        }, {
            hiddenName: 'Customer',
            xtype: 'combo',
            fieldLabel: 'Customer',
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
                    fields: ['Id', 'Name','Code']
                }),
                autoLoad: true,
                api: { read: Psms.GetCustomerBySearch }
            }),
            valueField: 'Id',
            displayField: 'Name',
            pageSize: 10,
            listeners: {
                scope: this,
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('rptSales-form').getForm();
                    form.findField('CustomerId').setValue(rec.id);
                    form.findField('CustomerCode').setValue(rec.data['Code']);
                }
            }
        }, {
            xtype: 'hidden',
            name: 'ItemTypeId'
        }, {
            hiddenName: 'ItemType',
            xtype: 'combo',
            fieldLabel: 'Item Type',
            triggerAction: 'all',
            mode: 'remote',
            editable: false,
            hidden: false,
            forceSelection: true,
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
                api: {
                    read: Psms.GetItemType
                }
            }),
            valueField: 'Name',
            displayField: 'Name',
            listeners: {
                scope: this,
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('rptSales-form').getForm();
                    form.findField('ItemTypeId').setValue(rec.id);
                }
            }
        }, {
            xtype: 'hidden',
            name: 'ItemId'
        }, {
            hiddenName: 'ItemName',
            xtype: 'combo',
            fieldLabel: 'Item',
            typeAhead: false,
            hideTrigger: true,
            minChars: 2,
            listWidth: 280,
            allowBlank: true,
            mode: 'remote',
            tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' +
                    '<h3><span>{Name}</span></h3> {Code}</div></tpl>',
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    totalProperty: 'total',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                api: { read: Item.GetSearchItems }
            }),
            valueField: 'Name',
            displayField: 'Name',
            pageSize: 10,
            listeners: {
                scope: this,
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('rptSales-form').getForm();
                    form.findField('ItemId').setValue(rec.id);
                }
            }
        }, {
            xtype: 'hidden',
            name: 'StoreId'
        }, {
            hiddenName: 'Store',
            xtype: 'combo',
            fieldLabel: 'Store',
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
                scope: this,
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('rptSales-form').getForm();
                    form.findField('StoreId').setValue(rec.id);
                }
            }
        }, {
            hiddenName: 'ItemCategoryId',
             xtype: 'combo',
            fieldLabel: 'item Category',
            triggerAction: 'all',
            mode: 'remote',
            editable: false,
            hidden: true,
            forceSelection: true,
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
                api: {
                    read: Psms.GetItemCategory
                }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
            }
        }, {
            hiddenName: 'StatusId',
            xtype: 'combo',
            fieldLabel: 'Status',
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
                api: { read: Psms.GetVoucherStatus }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
            }
        }, {
            hiddenName: 'ConsumerTypeId',
            xtype: 'combo',
            fieldLabel: 'Consumer Type',
            triggerAction: 'all',
            mode: 'remote',
            editable: false,
            forceSelection: true,
            emptyText: '---Select---',
            allowBlank: true,
            hidden: true,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: Psms.GetConsumerType }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                scope: this,
                select: function (cmb, rec) {
                    var form = Ext.getCmp('rptSales-form').getForm();
                       //if Customer type is Store
                    if (rec.get("Name") == 'Store') {
                        form.findField('compositeEmployee').hide();
                        form.findField('compositeUnit').hide();
                        form.findField('compositeStore').show();

                        form.findField('ConsumerStore').allowBlank = true;
                        form.findField('ConsumerEmployee').allowBlank = true;
                        form.findField('ConsumerUnit').allowBlank = true;

                        form.findField('ConsumerEmployee').setValue('');
                        form.findField('ConsumerEmployeeId').setValue('');
                        form.findField('ConsumerUnit').setValue('');
                        form.findField('ConsumerUnitId').setValue('');
                    }
                        //if Customer type is employee
                    else if (rec.get("Name") == 'Employee') {
                        form.findField('compositeEmployee').show();
                        form.findField('compositeStore').hide();
                        form.findField('compositeUnit').hide();
                        form.findField('ConsumerStore').allowBlank = true;
                        form.findField('ConsumerEmployee').allowBlank = true;
                        form.findField('ConsumerUnit').allowBlank = true;


                        form.findField('ConsumerUnit').setValue('');
                        form.findField('ConsumerUnitId').setValue('');
                        form.findField('ConsumerStore').setValue('');
                        form.findField('ConsumerStoreId').setValue('');
                    } //if Customer type is unit
                    else if (rec.get("Name") == 'Unit') {
                        form.findField('compositeEmployee').hide();
                        form.findField('compositeUnit').show();
                        form.findField('compositeStore').hide();
                        form.findField('ConsumerStore').allowBlank = true;
                        form.findField('ConsumerEmployee').allowBlank = true;
                        form.findField('ConsumerUnit').allowBlank = true;


                        form.findField('ConsumerEmployee').setValue('');
                        form.findField('ConsumerEmployeeId').setValue('');
                        form.findField('ConsumerStore').setValue('');
                        form.findField('ConsumerStoreId').setValue('');
                    }
                    else {
                        form.findField('compositeEmployee').hide();
                        form.findField('compositeStore').hide();
                        form.findField('compositeUnit').hide();
                        form.findField('ConsumerStore').allowBlank = true;
                        form.findField('ConsumerEmployee').allowBlank = true;
                        form.findField('ConsumerUnit').allowBlank = true;

                        form.findField('ConsumerEmployee').setValue('');
                        form.findField('ConsumerEmployeeId').setValue('');
                        form.findField('ConsumerUnit').setValue('');
                        form.findField('ConsumerUnitId').setValue('');
                        form.findField('ConsumerStore').setValue('');
                        form.findField('ConsumerStoreId').setValue('');
                    }
                }
            }
        }, {
            xtype: 'hidden',
            name: 'ConsumerStoreId'
        }, {
            xtype: 'compositefield',
            name: 'compositeStore',
            fieldLabel: 'Consumer Store',
            hidden: true,
            defaults: {
                flex: 1
            },
            items: [{
                name: 'ConsumerStore',
                xtype: 'textfield',
                fieldLabel: 'Consumer',
                readonly: true,
                allowBlank: true
            }, {
                xtype: 'button',
                iconCls: 'icon-filter',
                width: 20,
                handler: function () {
                    var form = Ext.getCmp('rptSales-form').getForm();
                    new Ext.erp.ux.common.StoreWindow({
                        parentForm: form,
                        controlIdField: 'ConsumerStoreId',
                        controlNameField: 'ConsumerStore',
                        consumer: 'Consumer'
                    }).show();
                }
            }]
        }, {
            xtype: 'hidden',
            name: 'ConsumerUnitId'
        }, {
            xtype: 'compositefield',
            name: 'compositeUnit',
            fieldLabel: 'Consumer Department',
            hidden: true,
            defaults: {
                flex: 1
            },
            items: [{
                name: 'ConsumerUnit',
                xtype: 'textfield',
                fieldLabel: 'Consumer',
                readonly: true,
                allowBlank: true
            }, {
                xtype: 'button',
                iconCls: 'icon-filter',
                width: 20,
                handler: function () {
                    var form = Ext.getCmp('rptSales-form').getForm();
                    new Ext.erp.ux.common.UnitWindow({
                        parentForm: form,
                        controlIdField: 'ConsumerUnitId',
                        controlNameField: 'ConsumerUnit',
                        consumer: 'Consumer'
                    }).show();
                }
            }]
        }, {
            xtype: 'hidden',
            name: 'ConsumerEmployeeId'
        }, {
            xtype: 'compositefield',
            name: 'compositeEmployee',
            fieldLabel: 'Consumer Employee',
            hidden: true,
            defaults: {
                flex: 1
            },
            items: [{
                name: 'ConsumerEmployee',
                xtype: 'textfield',
                fieldLabel: 'Consumer',
                readonly: true,
                allowBlank: true
            }, {
                xtype: 'button',
                 iconCls: 'icon-filter',
                width: 20,
                handler: function () {
                    var form = Ext.getCmp('rptSales-form').getForm();
                    new Ext.erp.ux.common.EmployeeWindow({
                        parentForm: form,
                        controlIdField: 'ConsumerEmployeeId',
                        controlNameField: 'ConsumerEmployee',
                        consumer: 'Consumer'
                    }).show();
                }
            }]
        }, {
            name: 'StartDate',
            xtype: 'datefield',
            fieldLabel: 'Start Date',
            width: 100,
            allowBlank: false,
           value: new Date(),
        }, {
            name: 'EndDate',
            xtype: 'datefield',
            fieldLabel: 'End Date',
            width: 100,
            allowBlank: false,
            value: new Date(),
        }],
        buttons: [{
            text: 'Preview',
            iconCls: 'icon-preview',
            handler: function () {
                var form = Ext.getCmp('rptSales-form');
                form.getForm().submit({
                    waitMsg: 'Please wait...',
                    success: function () {
                        var iframePanel = Ext.getCmp('rptSales-iframePanel');
                        var url = 'Reports/ErpReportViewer.aspx?rt=Sales' + '&' + (new Date).getTime();
                        iframePanel.removeAll();
                        iframePanel.add(new Ext.erp.ux.common.IFrameComponent({ url: url }));
                        iframePanel.doLayout();
                    }
                });
            },
            scope: this
        }, {
            text: 'Cancel',
            iconCls: 'icon-exit',
            handler: function () {
                form = Ext.getCmp('rptSales-form').getForm();
                form.reset();

            },
            scope: this
        }]
    }, config));
};
Ext.extend(Ext.erp.ux.rptSales.Form, Ext.form.FormPanel);
Ext.reg('rptSales-form', Ext.erp.ux.rptSales.Form);

/**
* @desc      General Ledger Report viewer panel
* @author    Wondwosen Desalegn
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.GeneralLedger
* @class     Ext.erp.ux.GeneralLedger.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.rptSales.Panel = function (config) {
    Ext.erp.ux.rptSales.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{}]
        }
    }, config));
}
Ext.extend(Ext.erp.ux.rptSales.Panel, Ext.Panel, {
    initComponent: function () {
        this.url = 'Reports/ErpReportViewer.aspx';
        this.form = new Ext.erp.ux.rptSales.Form();
        this.iframeComponent = new Ext.erp.ux.common.IFrameComponent({ url: this.url });
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                width: 350,
                collapsible: true,
                minSize: 100,
                maxSize: 500,
                split: true,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.form]
            }, {
                region: 'center',
                border: true,
                layout: 'fit',
                id: 'rptSales-iframePanel',
                items: [this.iframeComponent]
            }]
        }];

        Ext.erp.ux.rptSales.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('rptSales-panel', Ext.erp.ux.rptSales.Panel);
