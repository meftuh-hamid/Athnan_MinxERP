Ext.ns('Ext.erp.ux.notificationWindow');

Ext.erp.ux.notificationWindow.Form = function (config) {
    Ext.erp.ux.notificationWindow.Form.superclass.constructor.call(this, Ext.apply({
        api: {
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '90%', labelStyle: 'text-align:right;', msgTarget: 'side'
        },
        id: 'notification-form',
        padding: 5,
        labelWidth: 120,
        height: 400,
        border: false,
        fileUpload: true,

        isFormLoad: false,
        frame: false,
        autoScroll: true,
        baseCls: 'x-plain',
        items: [
             {
                 xtype: 'hidden',
                 name: 'StoreId'
             }, {
                 xtype: 'hidden',
                 name: 'UnitId'
             }, {
                xtype: 'textfield',
                name: 'Criteria',
                allowBlank: true,
                fieldLabel: 'Criteria',
                disabled: false,
                hidden: true,
                readOnly: true
            }, {
                xtype: 'textfield',
                name: 'Type',
                allowBlank: true,
                fieldLabel: 'Type',
                disabled: false,
                readOnly: true
            },
            {
                xtype: 'textfield',
                name: 'Title',
                allowBlank: true,
                fieldLabel: 'Title',
                disabled: false,
                readOnly: true
            },
             {
                 xtype: 'textfield',
                 name: 'VoucherStatus',
                 allowBlank: true,
                 fieldLabel: 'Action',
                 disabled: false,
                 readOnly: true
             },
             {
                 xtype: 'textfield',
                 name: 'Supplier',
                 allowBlank: true,
                 fieldLabel: 'Supplier',
                 disabled: false,
                 readOnly: true
             },
            {
                xtype: 'textfield',
                name: 'Date',
                allowBlank: true,
                fieldLabel: 'Date',
                disabled: false,
                readOnly: true
            },
             {
                 name: 'Message',
                 xtype: 'textarea',
                 fieldLabel: 'Message',
                 width: 100,
                 readOnly: false,
                 allowBlank: true,
                 height: 120,
             },
             {
                 name: 'Response',
                 xtype: 'textarea',
                 fieldLabel: 'Response',
                 width: 100,
                 readOnly: false,
                 value: '',
                 allowBlank: true,
                 height: 200,
             }
        ],
        buttons: [{
            text: 'Preview',
            iconCls: 'icon-preview',
            handler: function () {
                var grid = Ext.getCmp('notification-grid');
                if (!grid.getSelectionModel().hasSelection()) return;
                var voucherId = grid.getSelectionModel().getSelected().get('VoucherId');
                var voucherTypeId = grid.getSelectionModel().getSelected().get('VoucherTypeId');
                var iframePanel = Ext.getCmp('notificationWindow-iframePanel');
                var url = 'Reports/ErpReportViewer.aspx?rt=&id=' + voucherId + '&voucherTypeId=' + voucherTypeId;
                iframePanel.removeAll();
                iframePanel.add(new Ext.erp.ux.common.IFrameComponent({ url: url }));
                iframePanel.doLayout();
            },
            scope: this
        }, {
            text: 'Cancel',
            iconCls: 'icon-exit',
            handler: function () {
                form = Ext.getCmp('rptBincard-form').getForm();
                form.reset();

            },
            scope: this
        }]

    }, config));
}
Ext.extend(Ext.erp.ux.notificationWindow.Form, Ext.form.FormPanel);
Ext.reg('notification-form', Ext.erp.ux.notificationWindow.Form);
/**
* @desc      Item selection window
* @author    Girmaye Delelegn
* @copyright (c) 2014, 
* @date      oct 16, 2014
* @namespace Ext.erp.ux.notificationWindow
* @class     Ext.erp.ux.notificationWindow.notificationWindow
* @extends   Ext.Window
*/
Ext.erp.ux.notificationWindow.notificationWindow = function (config) {
    Ext.erp.ux.notificationWindow.notificationWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 1000,

        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        id: 'notification-window',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {

                var form = Ext.getCmp('notification-form').getForm();
                form.findField('Type').setValue(this.type);
                form.findField('Title').setValue(this.title);
                form.findField('Date').setValue(this.date);
                form.findField('Message').setValue(this.message);
                form.findField('VoucherStatus').setValue(this.voucherStatus);
                form.findField('Response').setValue(this.response);
                form.findField('Criteria').setValue(this.criteria);
                form.findField('Supplier').setValue(this.supplier);
                form.findField('StoreId').setValue(this.storeId);
                form.findField('UnitId').setValue(this.unitId);

                var grid = Ext.getCmp('notification-grid');
                if (!grid.getSelectionModel().hasSelection()) return;
                var voucherId = grid.getSelectionModel().getSelected().get('VoucherId');
                var voucherTypeId = grid.getSelectionModel().getSelected().get('VoucherTypeId');
                var iframePanel = Ext.getCmp('notificationWindow-iframePanel');
                var url = 'Reports/ErpReportViewer.aspx?rt=&id=' + voucherId + '&voucherTypeId=' + voucherTypeId;
                iframePanel.removeAll();
                iframePanel.add(new Ext.erp.ux.common.IFrameComponent({ url: url }));
                iframePanel.doLayout();


                Notification.UpdateViewStatus(this.id, function (result) {
                    Ext.getCmp('notification-paging').doRefresh();

                });
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.notificationWindow.notificationWindow, Ext.Window, {
    initComponent: function () {
        this.panel = new Ext.erp.ux.notificationWindow.Panel();

        this.items = [this.panel];
        this.bbar = [
            //{
            //xtype: 'tbfill'
            //},
        {
            text: 'Respond',
            iconCls: 'icon-accept',
            scope: this,
            handler: this.onActionClick
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Reject',
            iconCls: 'icon-delete',
            scope: this,
            handler: this.onRejectClick
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-delete',
            scope: this,
            handler: this.onClose
        }];
        Ext.erp.ux.notificationWindow.notificationWindow.superclass.initComponent.call(this, arguments);
    },
    onClose: function () {

        this.close();
    },
    onRejectClick: function () {
        this.action = 'reject';
        this.formSubmit();


    },
    onActionClick: function () {
        this.action = 'response';
        this.formSubmit();


    },
    formSubmit: function () {
        var grid = Ext.getCmp('notification-grid');
        var form = Ext.getCmp('notification-form').getForm();

        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var title = grid.getSelectionModel().getSelected().get('Title');
        var voucherId = grid.getSelectionModel().getSelected().get('VoucherId');
        var voucherNo = grid.getSelectionModel().getSelected().get('VoucherNo');
        var voucherTypeId = grid.getSelectionModel().getSelected().get('VoucherTypeId');
        var voucherStatusId = grid.getSelectionModel().getSelected().get('VoucherStatusId');
        var voucherStatus = grid.getSelectionModel().getSelected().get('Status');
        var message = grid.getSelectionModel().getSelected().get('Message');
        var criteria = grid.getSelectionModel().getSelected().get('Criteria');
        var response = form.findField('Response').getValue();
        var storeId = form.findField('StoreId').getValue();
        var unitId = form.findField('UnitId').getValue();
        var window = this;
        Ext.MessageBox.show({
            title: 'Action',
            msg: 'Are you sure you want to to Action the selected record',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            animEl: 'Action',
            fn: function (btn) {
                if (btn == 'ok') {
                    Ext.MessageBox.show({
                        msg: 'Please wait...',
                        width: 250,
                        wait: true,
                        waitConfig: { interval: 1000 }
                    });
                    var action = this.action;
                    Notification.Save(id, title, voucherId, voucherNo, voucherTypeId, voucherStatusId, voucherStatus, message, response, action, criteria,storeId,unitId, function (result) {
                        if (result.success) {
                            Ext.getCmp('notification-paging').doRefresh();

                            Ext.MessageBox.show({
                                title: 'Success',
                                msg: "Data has been successfully saved",
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO,
                                scope: this
                            });
                            window.close();
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
});
Ext.reg('notification-notificationWindow', Ext.erp.ux.notificationWindow.notificationWindow);

/**
* @desc      General Ledger Report viewer panel
* @author    Wondwosen Desalegn
* @copyright (c) 2010, Cybersoft
* @date      November 01, 2010
* @namespace Ext.erp.ux.GeneralLedger
* @class     Ext.erp.ux.GeneralLedger.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.notificationWindow.Panel = function (config) {
    Ext.erp.ux.notificationWindow.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        height:500,
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{}]
        }
    }, config));
}
Ext.extend(Ext.erp.ux.notificationWindow.Panel, Ext.Panel, {
    initComponent: function () {
        this.url = 'Report/ErpReportViewer.aspx';
        this.form = new Ext.erp.ux.notificationWindow.Form();
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
                height:500,
                layout: 'fit',
                id: 'notificationWindow-iframePanel',
                items: [this.iframeComponent]
            }]
        }];

        Ext.erp.ux.notificationWindow.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('notificationWindow-panel', Ext.erp.ux.notificationWindow.Panel);