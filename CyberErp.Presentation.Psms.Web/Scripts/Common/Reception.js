Ext.namespace('Ext.erp.ux');

Ext.erp.ux.Reception = function () {
    var _options = {
        loginWindowClass: Ext.erp.ux.reception.LoginWindow
    };

    var _applicationPath = null;
    var _userId = null;
    var _userName = null;
    var _lastUserRequest = null;
    var _applicationStarted = false;
    var _loginWindow = null;
    var _logoutWindow = null;
    var _permissions = {};

    var _onLoginSuccess = function (form, action) {
        var applicationPath = action.result.data.ApplicationPath;
        _userId = action.result.data.userId;
        _userName = action.result.data.userName;
        var context = _context;
        _loginWindow.close();
        if (context == this.TYPE_LOGIN || !_applicationStarted) {
            (function () {
                this.location.href = location.protocol + '//' + location.host + applicationPath + '/Workbench';
            }).defer(10, window);
        }
    };

    var _onLoginFailure = function (basicForm, formAction) {
        _loginWindow.setControlsDisabled(false);
    };

    var _onLogoutSuccess = function (response, action) {
        window.onbeforeunload = Ext.emptyFn;
        window.location.href = location.protocol + '//' + location.host + _applicationPath + '/Reception'
    };

    var _onBeforeLogin = function (loginWindow, username, password) {
        loginWindow.setControlsDisabled(true);
    };

    var _onExit = function () {
        if (_context == this.TYPE_TOKEN_FAILURE) {
            Ext.erp.ux.SystemMessageManager.wait(
                new Ext.erp.ux.SystemMessage({
                    text: 'Please wait, signing out...',
                    type: Ext.erp.ux.SystemMessage.TYPE_WAIT
                })
            );
        } else {
            _logout('yes');
        }
    };

    var _onDestroy = function () {
        _loginWindow = null;
        _context = null;
    };

    var _login = function () {
        _buildLoginWindow({
            modal: _applicationStarted
        });
    };

    var _logout = function (buttonType) {
        if (buttonType == 'yes') {
            Ext.erp.ux.SystemMessageManager.wait(
                new Ext.erp.ux.SystemMessage({
                    text: 'Please wait, signing out...',
                    type: Ext.erp.ux.SystemMessageManager.TYPE_WAIT
                })
            );
            Reception.Logout(_onLogoutSuccess);
        }
    };

    var _authenticate = function () {
        _buildLoginWindow({
            usernameValue: _user.userName,
            modal: _applicationStarted,
            lastUserRequest: _lastUserRequest ? _lastUserRequest : 0,
            draggable: true
        });
    };

    var _unlock = function () {
        _buildLoginWindow({
            hideLanguageField: true,
            usernameValue: _userName,
            showExit: !_applicationStarted,
            modal: _applicationStarted,
            draggable: true
        });
    };

    var _restart = function (buttonType) {
        if (buttonType == 'yes') {
            Ext.erp.ux.SystemMessageManager.wait(
                new Ext.erp.ux.SystemMessage({
                    text: 'Restarting application...',
                    type: Ext.erp.ux.SystemMessage.TYPE_WAIT
                })
            );
            (function () {
                window.onbeforeunload = Ext.emptyFn;
                window.location.replace(location.protocol + '//' + location.host + _applicationPath + '/Workbench');
            }).defer(500, window);
        }
    };

    var _buildLoginWindow = function (config) {
        if (_loginWindow === null) {
            var options = {
                draggable: false
            };
            var config = config || {};
            Ext.apply(options, config);
            _loginWindow = new _options['loginWindowClass'](options);
            _loginWindow.on('exit', _onExit, Ext.erp.ux.Reception);
            _loginWindow.on('loginsuccess', _onLoginSuccess, Ext.erp.ux.Reception);
            _loginWindow.on('loginfailure', _onLoginFailure, Ext.erp.ux.Reception);
            _loginWindow.on('beforelogin', _onBeforeLogin, Ext.erp.ux.Reception);
            _loginWindow.on('destroy', _onDestroy, Ext.erp.ux.Reception);
        }
        if (!_loginWindow.isVisible()) {
            _loginWindow.show();
        }
    };

    var _lockWorkbench = function () {
        Ext.erp.ux.SystemMessageManager.hide();
        var reception = Ext.erp.ux.Reception;
        reception.showLogin(reception.TYPE_UNLOCK);
    };

    var _context = null;
    var _instance = null;

    return {
        TYPE_LOGIN: 2,
        TYPE_AUTHENTICATE: 4,
        TYPE_UNLOCK: 8,
        TYPE_TOKEN_FAILURE: 16,

        getInstance: function (applicationStarted, options) {
            _applicationStarted = applicationStarted;
            _instance = Ext.apply(_options, options || {});
            return _instance;
        },

        initializeApp: function (options) {
            _applicationPath = options.applicationPath;
            _userId = options.userId;
            _userName = options.userName;
            _applicationStarted = true;
            _permissions = options.permissions;
        },

        getPermission: function (operation, accessLevel) {
            var permission = null;
            switch (accessLevel) {
                case 'CanAdd':
                    permission = _permissions[operation].CanAdd;
                    break;
                case 'CanEdit':
                    permission = _permissions[operation].CanEdit;
                    break;
                case 'CanDelete':
                    permission = _permissions[operation].CanDelete;
                    break;
                case 'CanCertify':
                    permission = _permissions[operation].CanCertify;
                    break;
                case 'CanApprove':
                    permission = _permissions[operation].CanApprove;
                    break;
                case 'CanView':
                    permission = _permissions[operation].CanView;
                    break;
                default:
                    permission = false;
                    break;
            }
            return permission;
        },

        onLogin: function (fn, scope) {
            _listeners.push({
                fn: fn,
                scope: scope || window
            });
        },

        onBeforeUserLoad: function (fn, scope) {
            _userBeforeLoadListeners.push({
                fn: fn,
                scope: scope || window
            });
        },

        onUserLoad: function (fn, scope) {
            _userLoadListeners.push({
                fn: fn,
                scope: scope || window
            });
        },

        onBeforeLogout: function (fn, scope) {
            _beforeLogoutListeners.push({
                fn: fn,
                scope: scope || window
            });
        },

        onUserLoadFailure: function (fn, scope) {
            _userLoadFailureListeners.push({
                fn: fn,
                scope: scope || window
            });
        },

        getUser: function () {
            return _user;
        },

        lockWorkbench: function () {
            if (_context === this.TYPE_UNLOCK) {
                return;
            } else if (_context !== null) {
                throw (
                    'Reception.lockWorkbench: '
                    + 'Current context is AUTHENTICATE but server returned LOCKED'
                );
            }

            Ext.erp.ux.SystemMessageManager.wait(
                new Ext.erp.ux.SystemMessage({
                    text: 'Please wait, locking workbench...',
                    type: Ext.erp.ux.SystemMessage.TYPE_WAIT
                })
            );
            _lockWorkbench();
        },

        restart: function () {
            var msg = Ext.MessageBox;

            Ext.erp.ux.SystemMessageManager.show({
                title: 'Restart',
                msg: 'All unsaved data will be lost. Are you sure you want to restart?',
                buttons: msg.YESNO,
                icon: msg.QUESTION,
                cls: 'msgbox-question',
                width: 400,
                fn: _restart
            });
        },

        logout: function () {
            var msg = Ext.MessageBox;
            Ext.erp.ux.SystemMessageManager.show({
                title: 'Logout',
                msg: 'All unsaved data will be lost. Are you sure you want to sign out and exit',
                buttons: msg.YESNO,
                icon: msg.QUESTION,
                cls: 'msgbox-question',
                width: 400,
                fn: _logout
            });
        },

        showLogout: function () {
            if (_logoutWindow === null) {
                _logoutWindow = new Ext.erp.ux.reception.LogoutWindow();
                _logoutWindow.on('destroy', function () {
                    _logoutWindow = null;
                });
            }
            _logoutWindow.show();
        },

        showLogin: function (contextType) {
            switch (contextType) {
                case this.TYPE_LOGIN:
                    _context = contextType;
                    _login();
                    break;
                case this.TYPE_AUTHENTICATE:
                    _context = contextType;
                    _authenticate();
                    break;
                case this.TYPE_UNLOCK:
                    _context = contextType;
                    _unlock();
                    break;
                case this.TYPE_TOKEN_FAILURE:
                    _context = contextType;
                    _tokenFailureSignOut();
                    break;
                default:
                    throw ('No valid login context provided.');
                    break;
            }
        },

        isClosed: function () {
            return _context === this.TYPE_TOKEN_FAILURE;
        },

        isLocked: function () {
            return (_context === this.TYPE_UNLOCK || _context === this.TYPE_AUTHENTICATE);
        },

        confirmApplicationLeave: function () {
            return function (evt) {
                var message = 'Are you sure you want to exit your current session';
                if (typeof evt == "undefined") {
                    evt = window.event;
                }
                if (evt) {
                    evt.returnValue = message;
                }
                return message;
            };
        }
    };
} ();