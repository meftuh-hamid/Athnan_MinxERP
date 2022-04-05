Ext.ns('Ext.erp.ux.rptItem');

/**
* @desc      General Ledger Report Criteria form
* @author    Meftuh Mohammed
* @copyright (c) 2012, Cybersoft
* @date      April 24, 2012
* @namespace Ext.erp.ux.rptItem
* @class     Ext.erp.ux.rptItem.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.rptItem.Form = function (config) {
    Ext.erp.ux.rptItem.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            submit: ERPReport.SetBincardReportParam
        },
        defaults: {
            anchor: '95%',
            msgTarget: 'side',
            labelStyle: 'text-align:right;'
        },
        id: 'rptItem-form',
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
                    ['ItemList', 'Item List'],
                    ['ActiveItem', 'Active Item'],
                    ['InActiveItem', 'InActive Item'],
                    ['ItemClass', 'Item Class'],
                    ['Item Serial', 'Item Serial'],
                    ['ItemLOT', 'Item LOT'],
                 
                ]
            }),
            valueField: 'Id',
            displayField: 'Name',
           
        },  {
            xtype: 'hidden',
            name: 'ItemId'
        }, {
            hiddenName: 'Item',
            xtype: 'combo',
            fieldLabel: 'Item',
            typeAhead: false,
            hideTrigger: true,
            minChars: 2,
            listWidth: 280,
            allowBlank: true,
            mode: 'remote',
            tpl:
                     '<tpl for="."><div ext:qtip="{Name}" class="x-combo-list-item">' +
                         '<p><h6 class="w3-text-teal w3-small "><span> ' + '{Name}' + '</span></h6></p>' +
                         '<p><h6 class="w3-text-teal w3-small "><span> ' + '{Code}' + '-' + '{PartNumber}' + '</span></h6></p>' +
                     '</span></div></tpl>', store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    totalProperty: 'total',
                    root: 'data',
                    fields: ['Id', 'Name','Code','PartNumber']
                }),
                api: { read: Item.GetItemBySearch }
            }),
            valueField: 'Name',
            displayField: 'Name',
            pageSize: 10,
            listeners: {
                scope: this,
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('rptItem-form').getForm();
                    form.findField('ItemId').setValue(rec.id);
                }
            }
        }, {
            hiddenName: 'StoreId',
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
            valueField: 'Id',
            displayField: 'Name',
            pageSize: 10,
            listeners: {

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
            name: 'ShowDetail',
            checked: true,
            xtype: 'checkbox',
            fieldLabel: 'Show Detail?',
            width: 100,
            readOnly: false,
            allowBlank: true,
            checked: false
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
                var form = Ext.getCmp('rptItem-form');
                form.getForm().submit({
                    waitMsg: 'Please wait...',
                    success: function () {
                        var iframePanel = Ext.getCmp('rptItem-iframePanel');
                        var url = 'Reports/ErpReportViewer.aspx?rt=Item' + '&' + (new Date).getTime();
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
                form = Ext.getCmp('rptItem-form').getForm();
                form.reset();

            },
            scope: this
        }]
    }, config));
};
Ext.extend(Ext.erp.ux.rptItem.Form, Ext.form.FormPanel);
Ext.reg('rptItem-form', Ext.erp.ux.rptItem.Form);

/**
* @desc      General Ledger Report viewer panel
* @author    Wondwosen Desalegn
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.GeneralLedger
* @class     Ext.erp.ux.GeneralLedger.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.rptItem.Panel = function (config) {
    Ext.erp.ux.rptItem.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{}]
        }
    }, config));
}
Ext.extend(Ext.erp.ux.rptItem.Panel, Ext.Panel, {
    initComponent: function () {
        this.url = 'Reports/ErpReportViewer.aspx';
        this.form = new Ext.erp.ux.rptItem.Form();
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
                id: 'rptItem-iframePanel',
                items: [this.iframeComponent]
            }]
        }];

        Ext.erp.ux.rptItem.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('rptItem-panel', Ext.erp.ux.rptItem.Panel);
