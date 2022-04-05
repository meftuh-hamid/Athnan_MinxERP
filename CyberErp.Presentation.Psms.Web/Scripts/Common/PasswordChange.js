Ext.ns('Ext.erp.ux.passwordChange');
/**
* @desc      Change Password form
* @namespace Ext.erp.ux.passwordChange
* @class     Ext.erp.ux.passwordChange.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.passwordChange.Form = function (config) {
    Ext.erp.ux.passwordChange.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            submit: Admin.ChangePassword
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'passwordChange-form',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            xtype: 'textfield',
            inputType: 'password',
            name: 'PreviousPassword',
            fieldLabel: 'Previous Password',
            allowBlank: false
        }, {
            xtype: 'textfield',
            inputType: 'password',
            name: 'NewPassword',
            fieldLabel: 'New Password',
            allowBlank: false

        }, {
            xtype: 'textfield',
            inputType: 'password',
            name: 'ConfirmPassword',
            fieldLabel: 'Confirm Password',
            allowBlank: false
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.passwordChange.Form, Ext.form.FormPanel);
Ext.reg('passwordChange-form', Ext.erp.ux.passwordChange.Form);

/**
* @desc      Change Password form host window
* @namespace Ext.erp.ux.passwordChange
* @class     Ext.erp.ux.passwordChange.Window
* @extends   Ext.Window
*/
Ext.erp.ux.passwordChange.Window = function (config) {
    Ext.erp.ux.passwordChange.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 450,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'        
    }, config));
}
Ext.extend(Ext.erp.ux.passwordChange.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.passwordChange.Form();
        this.items = [this.form];
        this.bbar = [{
            text: 'Save',
            id: 'btnSave',
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
        Ext.erp.ux.passwordChange.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var win = this;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function (form, action) {
                Ext.getCmp('passwordChange-form').getForm().reset();
                Ext.Msg.alert('Success', action.result.data);
                win.close();
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
Ext.reg('passwordChange-window', Ext.erp.ux.passwordChange.Window);
