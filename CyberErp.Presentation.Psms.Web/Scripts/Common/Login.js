Ext.ns('Ext.erp.ux.reception');

/**
* @desc      Login form
* @copyright (c) 2010, 
* @date      November 01, 2010
* @namespace Ext.erp.ux.reception
* @class     Ext.erp.ux.reception.LoginForm
* @extends   Ext.form.FormPanel
*/
Ext.erp.ux.reception.LoginForm = function (config) {
    Ext.erp.ux.reception.LoginForm.superclass.constructor.call(this, Ext.apply({
        api: {
            submit: Reception.Login
        },
        id: 'login-form',
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        cls: 'x-small-editor reception-LoginWindow-formPanel',
        padding: 5,
        labelWidth: 150,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        monitorValid: true
    }, config));
};
Ext.extend(Ext.erp.ux.reception.LoginForm, Ext.form.FormPanel);
Ext.reg('login-form', Ext.erp.ux.reception.LoginForm);

/**
* @desc      Login form host window
* @date      November 01, 2010
* @namespace Ext.erp.ux.reception
* @class     Ext.erp.ux.reception.LoginWindow
* @extends   Ext.Window
*/
Ext.erp.ux.reception.LoginWindow = function (config) {
    Ext.erp.ux.reception.LoginWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 590,
        height: 335,
        modal: true,
        closable: false,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        cls: 'reception-LoginWindow'
    }, config));
};
Ext.extend(Ext.erp.ux.reception.LoginWindow, Ext.Window, {
    defaultFocusField: 'Username',
    editionLabel: 'Enterprise Edition',
    versionLabel: '',
    loginButton: null,
    exitButton: null,
    headerPanel: null,
    formPanel: null,
    usernameField: null,
    passwordField: null,
    languageField: null,
    initComponent: function () {
        var buttonConfig = [];
        this.loginButton = this.createLoginButton();
        if (this.showExit) {
            this.exitButton = this.createExitButton();
            buttonConfig.push(this.exitButton);
        }
        buttonConfig.push(this.loginButton);
        this.usernameField = this.createUsernameField();
        if (this.usernameValue) {
            this.usernameField.setValue(this.usernameValue);
            this.usernameField.setDisabled(true);
            this.defaultFocusField = 'Password';
        }
        this.passwordField = this.createPasswordField();
        this.languageField = this.createLanguageField();
        this.languageField.setValue('en-US');        
        this.headerPanel = this.createHeaderPanel();
        this.formPanel = this.createFormPanel(this.usernameField, this.passwordField, this.languageField);
        if(this.hideLanguageField) {
            this.languageField.hide();
        }
        this.items = [{
                xtype  :'box',
                cls: 'reception-LoginWindow-Logo',
        }, this.headerPanel, this.formPanel, {
                xtype  :'box',
                cls    : 'reception-LoginWindow-versionLabel',
                autoEl : {
                    tag  : 'div',
                    html : this.versionLabel
            }}];
        this.buttons = [{ xtype: 'tbfill' }, this.loginButton];
        this.addEvents('exit', 'beforelogin', 'loginsuccess', 'loginfailure');
        Ext.erp.ux.reception.LoginWindow.superclass.initComponent.call(this, arguments);
    },
    initEvents: function () {
        this.on('show', function () {
            try {
                if (this.defaultFocusField == 'password') {
                    this.passwordField.focus('', 10);
                } else {
                    this.usernameField.focus('', 10);
                }
            } catch (e) {
                
            }
        }, this);
        Ext.erp.ux.reception.LoginWindow.superclass.initEvents.call(this, arguments);
    },
    afterRender: function() {
        var loginButton = this.loginButton;
        this.languageField.on('select', function () {
            loginButton.setDisabled(true);
            Reception.ChangeCulture(this.getValue(), function(){                        
                loginButton.setDisabled(false);
            });
        });
        Ext.erp.ux.reception.LoginWindow.superclass.afterRender.call(this, arguments);
    },
    onClientValidation : function(formPanel, isValid)
    {
        if (!isValid) {
            this.loginButton.setDisabled(true);
        } else {
            this.loginButton.setDisabled(false);
        }
    },
    onLoginSuccess: function (basicForm, action) {
        this.fireEvent('loginsuccess', basicForm, action);
    },
    onLoginFailure: function (basicForm, action) {
        if (!Ext.erp.ux.Reception.isClosed()) {
            this.passwordField.setValue('');
            Ext.MessageBox.show({
                title: 'Failure',
                msg: action.result.data,
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
        }
        try {
            this.passwordField.focus('', 10);
        } catch (e) {
        }

        this.fireEvent('loginfailure', basicForm, action);
    },
    onLoginButtonClick: function () {
        this.doSubmit();
    },
    onExitButtonClick: function () {
        this.fireEvent('exit');
    },
    onSpecialKey: function (textField, eventObject) {
        var keyCode = eventObject.getKey();
        var eO = Ext.EventObject;

        if (keyCode != eO.ENTER && keyCode != eO.RETURN) {
            return;
        }
        if (this.usernameField.getValue().trim() == ""
            || this.passwordField.getValue().trim() == "") {
            return;
        }
        this.doSubmit();
    },
    doSubmit: function () {
        var username = this.usernameValue || this.usernameField.getValue();
        if (this.fireEvent('beforelogin', this, username, this.passwordField.getValue()) === false) {
            return;
        }
        var params = {
            username: username,
            password: this.passwordField.getValue()
        };
        if (this.lastUserRequest) {
            params.lastUserRequest = this.lastUserRequest;
        }
        this.formPanel.form.submit({
            waitMsg: 'Please wait...',
            params: params,
            success: this.onLoginSuccess,
            failure: this.onLoginFailure,
            scope: this
        });
    },
    createLoginButton: function () {
        var lbutton = new Ext.Button({
            text: 'Login',
            minWidth: 75,
            disabled: true,
            handler: this.onLoginButtonClick,
            scope: this,
            iconCls: 'icon-accept'
        });
        return lbutton;
    },
    createExitButton: function () {
        var ebutton = new Ext.Button({
            text: 'Exit',
            minWidth: 75,
            handler: this.onExitButtonClick,
            scope: this
        });
        return ebutton;
    },
    createUsernameField: function () {
        return new Ext.form.TextField({
            fieldLabel: 'Username',
            name: 'Username',
            preventMark: true,
            allowBlank: false,
            listeners: {
                specialkey: {
                    fn: this.onSpecialKey,
                    scope: this
                }
            }
        });
    },
    createPasswordField: function () {
        return new Ext.form.TextField({
            inputType: 'password',
            allowBlank: false,
            preventMark: true,
            name: 'Password',
            fieldLabel: 'Password',
            listeners: {
                specialkey: {
                    fn: this.onSpecialKey,
                    scope: this
                }
            }
        });
    },
    createLanguageField: function() {
        var languageStore = new Ext.data.ArrayStore({
           autoDestroy: true,
           storeId: 'my_array_store',
           fields: [
              {name: 'Id', type: 'string'},
              {name: 'Name', type: 'string'}
           ]
        });
        var data = [["en-US", "English"], ["hi-IN", "Amharic"]];
        languageStore.loadData(data,false);

        return new Ext.form.ComboBox({
            store: languageStore,
            hiddenName: 'Language',
            fieldLabel: 'Language',
            valueField: 'Id',
            hidden: true,
            displayField:'Name',
            mode: 'local',
            forceSelection: true,
            editable: false,
            triggerAction: 'all',
            emptyText:'---Select---',
            selectOnFocus:true,
            listeners: {
                select: function () {
                    var selectedLanguage = this.getValue();
                    Reception.ChangeCulture(selectedLanguage, function(){                        
                        
                    });
                }
            }
        });
    },
    createHeaderPanel: function() {
        return new Ext.Panel ({
            baseCls : 'x-plain',
            html    : '',
            cls     : 'reception-LoginWindow-Header',
            region  : 'north',
            height  : 150
        });
    },
    createFormPanel: function (usernameField, passwordField, languageField) {
        return new Ext.erp.ux.reception.LoginForm({
            items: [
                usernameField,
                passwordField,
                languageField
            ],
            listeners: {
                clientvalidation: {
                    fn: this.onClientValidation,
                    scope: this
                }
            }
        });
    },
    showLoginButton: function (show) {
        this.loginButton.setVisible(show);
    },
    showFormPanel: function (show) {
        this.formPanel.setVisible(show);
    },
    setControlsDisabled: function (disable) {
        if (disable) {
            this.formPanel.stopMonitoring();
        } else {
            this.formPanel.startMonitoring();
        }
        this.loginButton.setDisabled(disable);
        if (!this.usernameValue) {
            this.usernameField.setDisabled(disable);
        }
        this.passwordField.setDisabled(disable);
        if (this.exitButton) {
            this.exitButton.setDisabled(disable);
        }
    }
});
Ext.reg('login-window', Ext.erp.ux.reception.LoginWindow);
