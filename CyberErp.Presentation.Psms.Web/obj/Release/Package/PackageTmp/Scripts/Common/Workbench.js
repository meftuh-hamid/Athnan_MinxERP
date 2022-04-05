Ext.ns('Ext.erp.ux.main');
/**
* @desc      Panel to host north items
* @author    Wondwosen Desalegn
* @copyright (c) 2010, Cybersoft
* @date      November 12, 2010
* @namespace Ext.erp.ux.main
* @class     Ext.erp.ux.main.North
* @extends   Ext.Panel
*/
Ext.erp.ux.main.North = function (config) {
    Ext.erp.ux.main.North.superclass.constructor.call(this, Ext.apply({
        region: 'north',
        height: 30,
        border: false,
        header: false,
        items: [
            {
                xtype: 'toolbar',
                style: ' background :rgb(18 132 212)',
                items: [{
                    xtype: 'displayfield',
                    style: 'font-weight: bold;color: white;font-family: tahoma,arial,verdana,sans-serif;',
                    value: 'Sales and Inventory System',
                    autoWidth: true
                }, '->', {
                xtype: 'displayfield',
                style: 'font-weight: bold;color:white',
                value: '',
                id: 'loggedInUser-toolbar',
                autoWidth: true
            }, '-', {
                text: 'Logout',
                style: 'font-weight: bold;color:white',
                handler: function () {
                    var msg = Ext.MessageBox;
                    Ext.erp.ux.SystemMessageManager.show({
                        title: 'Logout',
                        msg: 'All unsaved data will be lost. Are you sure you want to log out.',
                        buttons: msg.YESNO,
                        icon: msg.QUESTION,
                        cls: 'msgbox-question',
                        width: 400,
                        fn: function (buttonType) {
                            if (buttonType == 'yes') {
                                Ext.erp.ux.SystemMessageManager.wait(
                                    new Ext.erp.ux.SystemMessage({
                                        text: 'Please wait, signing out...',
                                        type: Ext.erp.ux.SystemMessageManager.TYPE_WAIT
                                    })
                                );
                                Workbench.Logout(function (request, response) {
                                    window.onbeforeunload = Ext.emptyFn;
                                    window.location.href = location.protocol + '//' + location.host + response.result.data.ApplicationPath + '/Reception';
                                });
                            }
                        }
                    });
                }
            }]
        }]
    }));
}
Ext.extend(Ext.erp.ux.main.North, Ext.Panel);
Ext.reg('north-panel', Ext.erp.ux.main.North);

/**
* @desc      Panel to host east items
* @author    Wondwosen Desalegn
* @copyright (c) 2010, Cybersoft
* @date      November 12, 2010
* @namespace Ext.erp.ux.main
* @class     Ext.erp.ux.main.East
* @extends   Ext.Panel
*/
Ext.erp.ux.main.East = function (config) {
    Ext.erp.ux.main.East.superclass.constructor.call(this, Ext.apply({
        title: 'Task Detail',
        region: 'east',
        margins: '0 0 0 3',
        cmargins: '0 0 0 3',
        width: 200,
        minSize: 100,
        maxSize: 300,
        collapsible: true,
        collapsed: true,
        layout: 'fit'
    }));
}
Ext.extend(Ext.erp.ux.main.East, Ext.Panel);
Ext.reg('east-panel', Ext.erp.ux.main.East);

/**
* @desc      Panel to host south items
* @author    Wondwosen Desalegn
* @copyright (c) 2010, Cybersoft
* @date      November 12, 2010
* @namespace Ext.erp.ux.main
* @class     Ext.erp.ux.main.South
* @extends   Ext.Panel
*/
Ext.erp.ux.main.South = function (config) {
    Ext.erp.ux.main.South.superclass.constructor.call(this, Ext.apply({
        title: 'South',
        region: 'south',
        width: 200,
        minSize: 100,
        maxSize: 300,
        collapsible: true
    }));
}
Ext.extend(Ext.erp.ux.main.South, Ext.Panel);
Ext.reg('south-panel', Ext.erp.ux.main.South);

/**
* @desc      Panel to host west items
* @author    Wondwosen Desalegn
* @copyright (c) 2010, Cybersoft
* @date      November 12, 2010
* @namespace Ext.erp.ux.main
* @class     Ext.erp.ux.main.South
* @extends   Ext.Panel
*/

Ext.erp.ux.main.West = function (config) {
    Ext.erp.ux.main.West.superclass.constructor.call(this, Ext.apply({
        id: 'menu-panel',
        title: 'Tasks',
        region: 'west',
        margins: '0 3 0 0',
        cmargins: '0 3 0 0',
        width: 200,
        minSize: 100,
        maxSize: 300,
        collapsible: true,
        layout: 'accordion'
    }));
}
Ext.extend(Ext.erp.ux.main.West, Ext.Panel);
Ext.reg('west-panel', Ext.erp.ux.main.West);

/**
* @desc      Panel to host content items in the center
* @author    Wondwosen Desalegn
* @copyright (c) 2010, Cybersoft
* @date      November 12, 2010
* @namespace Ext.erp.ux.main
* @class     Ext.erp.ux.main.Center
* @extends   Ext.Panel
*/
Ext.erp.ux.main.Center = function (config) {
    Ext.erp.ux.main.Center.superclass.constructor.call(this, Ext.apply({
        id: 'content-panel',
        collapsible: false,
        region: 'center',
        margins: '0 0 0 0',
        activeTab: 0,
        resizeTabs: true,
        minTabWidth: 100,
        tabWidth: 150,
        enableTabScroll: true,
        defaults: {
            autoScroll: true
        },
        items: [{
            title: 'Home',
            layout: 'fit',
            iconCls: 'icon-home',
            items: [{
                xtype: 'notification-panel',
                //id: 'notification-panel'
            }]
        }],
        plugins: new Ext.ux.TabCloseMenu()
    }));
}
Ext.extend(Ext.erp.ux.main.Center, Ext.TabPanel, {
    loadPage: function (id, href, text, cls) {
        var tab = this.getComponent(id);
        if (tab) {
            this.setActiveTab(tab);
        }
        else {
            Ext.getCmp('content-panel').add({
                id: id,
                title: text,
                closable: true,
                layout: 'fit',
               // iconCls: cls,
                items: [{
                    xtype: href,
                    id: href
                }]
            }).show();
        }
    }
});
Ext.reg('center-panel', Ext.erp.ux.main.Center);

Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = 'Content/images/default/s.gif';
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Ext.QuickTips.init();
    var northPanel = new Ext.erp.ux.main.North();
    var westPanel = new Ext.erp.ux.main.West();
    var eastPanel = new Ext.erp.ux.main.East();
    var centerPanel = new Ext.erp.ux.main.Center();

    //Set Ajax request timeout
    Ext.override(Ext.data.Connection, {
        timeout: 300000
    });
    var currentUser = Ext.getCmp('loggedInUser-toolbar');

    Workbench.InitializeApp(function (response, action) {
        if (!action.result.success) {
            window.location.replace(location.protocol + '//' + location.host + action.result.data.ApplicationPath + '/Reception');
            return;
        }
        var permissions = {};
        for (var i = 0; i < action.result.data.Permissions.length; i++) {
            var permission = action.result.data.Permissions[i];
            var operation = permission.Operation;
            permissions[operation] = {
                CanAdd: permission.CanAdd,
                CanEdit: permission.CanEdit,
                CanDelete: permission.CanDelete,
                CanApprove: permission.CanApprove,
                CanView: permission.CanView,
                CanCertify: permission.CanCertify
            };
        }
        var options = {
            applicationPath: action.result.data.ApplicationPath,
            userId: action.result.data.Id,
            userName: action.result.data.UserName,
            permissions: permissions
        };
        currentUser.setValue(action.result.data.UserName);

        Ext.erp.ux.Reception.initializeApp(options);
        Workbench.GetModules(function (result) {
            var modules = result.data;
            for (var i = 0; i < modules.length; i++) {
                var mTree = new Ext.tree.TreePanel({
                    id: modules[i].text,
                    title: modules[i].text,
                    loader: new Ext.tree.TreeLoader({
                        directFn: Workbench.GetOperations
                    }),
                    border: false,
                    rootVisible: false,
                    lines: false,
                    autoScroll: true,
                    stateful: false,
                    listeners: {
                        click: function (node, e) {
                            e.stopEvent();
                            centerPanel.loadPage(node.attributes.id, node.attributes.href, node.attributes.text, node.attributes.iconCls);
                        },
                        expand: function (p) {
                            p.syncSize();
                        }
                    },
                    root: {
                        text: modules[i].text,
                        id: modules[i].id
                    }
                });
                westPanel.add(mTree);
            }
            var viewport = new Ext.Viewport({
                layout: 'border',
                items: [northPanel, westPanel, centerPanel]
            });

            //var runner = new Ext.util.TaskRunner();
            //runner.start({
            //    run: function () {
            //        window.Notifications.GetUserNotificationsCount(function (result) {
            //            if (result.success) {
            //                var btn = Ext.getCmp('btnNotification');

            //                btn.setText(result.total);

            //            }
            //            else {
            //            }
            //        });
            //    },
            //    interval: 10000 // in milli seconds
            //});

            viewport.doLayout();
        });
    });

    Ext.Direct.on('exception', function (e) {
        var title = 'Direct Exception', message;
        if (Ext.isDefined(e.where)) {
            message = String.format('<b>{0}</b><p>The exception was thrown from {1}.{2}()</p><pre>{3}</pre>', Ext.util.Format.nl2br(e.message), e.action, e.method, e.where);
            var w = new Ext.Window({
                title: title,
                width: 600,
                height: 400,
                modal: true,
                layout: 'fit',
                border: false,
                maximizable: true,
                items: {
                    html: message,
                    autoScroll: true,
                    preventBodyReset: true,
                    bodyStyle: 'font-size:12px',
                    padding: 5
                },
                buttons: [{
                    text: 'OK',
                    handler: function () {
                        w.close();
                    }
                }],
                buttonAlign: 'center',
                defaultButton: 0
            }).show();
        } else {
            message = 'Error occured. Unable to process request.';
            Ext.Msg.alert(title, message);
        }
    });
});