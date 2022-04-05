Ext.ns('Ext.erp.ux.common');

/******************************************************************************************
*Selection Model
*******************************************************************************************/
Ext.erp.ux.common.SelectionModel = new Ext.grid.RowSelectionModel({
    singleSelect: true,
    onEditorKey: function (field, e) {
        var k = e.getKey(), newCell = null, g = this.grid, ed = g.activeEditor;
        var shift = e.shiftKey;
        if (k == e.TAB) {
            e.stopEvent();
            ed.completeEdit();
            if (shift) {
                newCell = g.walkCells(ed.row, ed.col - 1, -1, this.acceptsNav, this);
            } else {
                newCell = g.walkCells(ed.row, ed.col + 1, 1, this.acceptsNav, this);
                if (!newCell) {
                }
            }
        }
        if (k == 38) {
            e.stopEvent();
            ed.completeEdit();
            newCell = g.walkCells(ed.row - 1, ed.col, 1, this.acceptsNav, this);

        }
        if (k == 37) {
            e.stopEvent();
            ed.completeEdit();
            newCell = g.walkCells(ed.row, ed.col - 1, -1, this.acceptsNav, this);

        }
        if (k == 39) {
            e.stopEvent();
            ed.completeEdit();
            newCell = g.walkCells(ed.row, ed.col + 1, 1, this.acceptsNav, this);

        }
        if (k == 40) {
            e.stopEvent();
            ed.completeEdit();
            newCell = g.walkCells(ed.row + 1, ed.col, 1, this.acceptsNav, this);

        }
        if (newCell) {
            g.startEditing(newCell[0], newCell[1]);
        }
    }
});


Ext.erp.ux.common.CheckBoxSelectionModel = new Ext.grid.CheckboxSelectionModel({
});

/******************************************************************************************
*IFrame Component
*******************************************************************************************/

/**
* @desc      Panel to host html page
* @author    Meftuh Mohammed
* @copyright (c) 2010, Cybersoft
* @date      November 12, 2012
* @namespace Ext.erp.ux.common
* @class     Ext.erp.ux.common.IFrameComponent
* @extends   Ext.Panel
*/

Ext.erp.ux.common.IFrameComponent = Ext.extend(Ext.BoxComponent, {
    onRender: function (ct, position) {
        this.el = ct.createChild({ tag: 'iframe', id: 'iframe-' + this.id, frameBorder: 0, src: this.url });
    }
});

/**
* @desc      EmployeeSelection form
* @author    Meftuh Mohammed
* @copyright (c) 2012, Cybersoft
* @date      April 24, 2012
* @namespace Ext.erp.ux.common
* @class     Ext.erp.ux.common.Form
* @extends   Ext.tree.FormPanel
*/
Ext.erp.ux.common.Form = function (config) {
    Ext.erp.ux.common.Form.superclass.constructor.call(this, Ext.apply({
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side',
            bodyStyle: 'background:transparent;padding:5px'
        },
        id: 'employeeSelection-form',
        labelWidth: 115,
        height: 100,
        border: false,
        layout: 'form',
        bodyStyle: 'background:transparent;padding:5px',
        baseCls: 'x-plain',
        items: [{
            xtype: 'compositefield',
            fieldLabel: 'Search by',
            defaults: {
                flex: 1
            },
            items: [{
                hiddenName: 'SearchBy',
                xtype: 'combo',
                fieldLabel: 'Search by',
                triggerAction: 'all',
                mode: 'local',
                editable: false,
                forceSelection: false,
                emptyText: '---Select---',
                allowBlank: true,
                store: new Ext.data.ArrayStore({
                    fields: ['Id', 'Name'],
                    data: [[1, 'Identity No.'], [2, 'First Name'], [3, 'Last Name'], [4, 'Grandfather Name'], [5, 'Gender'], [6, 'Employment Nature']]
                }),
                valueField: 'Id',
                displayField: 'Name',
                listeners: {
                    'select': function (cmb, rec, idx) {
                        var form = Ext.getCmp('employeeSelection-form').getForm();
                        var searchByCombo = this.getValue();
                        var criteriaCombo = form.findField('Criteria');
                        var searchText = form.findField('SearchText');
                        var genderCombo = form.findField('GenderId');
                        var empNatureCombo = form.findField('EmploymentNatureId');
                        if (searchByCombo == 5) {
                            criteriaCombo.hide();
                            searchText.hide();
                            genderCombo.show();
                            empNatureCombo.hide();
                        }
                        else if (searchByCombo == 6) {
                            criteriaCombo.hide();
                            searchText.hide();
                            genderCombo.hide();
                            empNatureCombo.show();
                        }
                        else {
                            criteriaCombo.show();
                            searchText.show();
                            genderCombo.hide();
                            empNatureCombo.hide();
                        }
                    }
                }
            }, {
                xtype: 'button',
                id: 'resetControls',
                iconCls: 'icon-refresh',
                width: 25,
                handler: function () {
                    var form = Ext.getCmp('employeeSelection-form').getForm();
                    var searchBy = form.findField('SearchBy');
                    var genderCombo = form.findField('GenderId');
                    var employmentNatureCombo = form.findField('EmploymentNatureId');
                    var criteriaCombo = form.findField('Criteria');
                    var searchTextCombo = form.findField('SearchText');
                    searchBy.reset();
                    genderCombo.reset(); genderCombo.hide();
                    employmentNatureCombo.reset(); employmentNatureCombo.hide();
                    criteriaCombo.reset(); criteriaCombo.hide();
                    searchTextCombo.reset(); searchTextCombo.hide();
                }
            }]
        }, {
            hiddenName: 'Criteria',
            xtype: 'combo',
            fieldLabel: 'Criteria',
            hidden: true,
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            forceSelection: false,
            emptyText: '---Select---',
            allowBlank: true,
            store: new Ext.data.ArrayStore({
                fields: ['Id', 'Name'],
                data: [[1, 'Starts With'], [2, 'Contains'], [3, 'Ends With']]
            }),
            valueField: 'Id',
            displayField: 'Name'
        }, {
            name: 'SearchText',
            xtype: 'textfield',
            hidden: true,
            fieldLabel: 'Search Text'
        }, {
            hiddenName: 'GenderId',
            xtype: 'combo',
            fieldLabel: 'Gender',
            hidden: true,
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            forceSelection: false,
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
                api: { read: Psms.GetGender }
            }),
            valueField: 'Id',
            displayField: 'Name'
        }, {
            hiddenName: 'EmploymentNatureId',
            xtype: 'combo',
            fieldLabel: 'Employment Nature',
            hidden: true,
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            forceSelection: false,
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
                api: { read: Psms.GetEmploymentNature }
            }),
            valueField: 'Id',
            displayField: 'Name'
        }]
    }, config));
};
Ext.extend(Ext.erp.ux.common.Form, Ext.form.FormPanel);
Ext.reg('employeeSelection-form', Ext.erp.ux.common.Form);

/**
* @desc      EmployeeSelection grid
* @author    Wondwosen Desalegn
* @copyright (c) 2012, Cybersoft
* @date      April 24, 2012
* @namespace Ext.erp.ux.common
* @class     Ext.erp.ux.common.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.common.Grid = function (config) {
    Ext.erp.ux.common.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Psms.GetPagedEmployee,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'IdentityNumber', 'FirstName', 'LastName', 'GrandLastName', 'Gender', 'PositionName', 'PositionCode'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { Ext.getCmp('employeeSelection-grid').body.mask('Loading...', 'x-mask-loading'); },
                load: function () { Ext.getCmp('employeeSelection-grid').body.unmask(); },
                loadException: function () { Ext.getCmp('employeeSelection-grid').body.unmask(); },
                scope: this
            }
        }),
        id: 'employeeSelection-grid',
        pageSize: 15,
        stripeRows: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: false,
            autoExpandColumn: 'IdentityNumber',
            autoFill: true
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'IdentityNumber',
            header: 'Id No.',
            sortable: true,
            width: 220,
            menuDisabled: false
        }, {
            dataIndex: 'FirstName',
            header: 'First Name',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'LastName',
            header: 'Father Name',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'GrandLastName',
            header: 'Grand Father Name',
            sortable: true,
            width: 220,
            menuDisabled: true
        }, {
            dataIndex: 'PositionName',
            header: 'Position Name',
            sortable: true,
            width: 250,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.common.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.bbar = new Ext.PagingToolbar({
            id: 'employee-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.common.Grid.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('employeeSelection-grid', Ext.erp.ux.common.Grid);

/**
* @desc      EmployeeSelection tree
* @author    Wondwosen Desalegn
* @copyright (c) 2012, Cybersoft
* @date      April 24, 2012
* @namespace Ext.erp.ux.common
* @class     Ext.erp.ux.common.Tree
* @extends   Ext.tree.TreePanel
*/
Ext.erp.ux.common.Tree = function (config) {
    Ext.erp.ux.common.Tree.superclass.constructor.call(this, Ext.apply({
        id: 'employeeSelection-tree',
        loader: new Ext.tree.TreeLoader({
            directFn: Psms.PopulateUnitTree
        }),
        selectedUnitId: 0,
        selectedUnitTypeId: 0,
        border: false,
        rootVisible: true,
        lines: true,
        autoScroll: true,
        stateful: false,
        root: {
            text: 'Units',
            id: 'root-unit'
        },
        tbar: [{
            xtype: 'displayfield',
            id: 'selected-unit',
            style: 'font-weight: bold'
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            id: 'expand-all-employeeSelection',
            iconCls: 'icon-expand-all',
            tooltip: 'Expand All',
            handler: function () {
                Ext.getCmp('employeeSelection-tree').expandAll();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'collapse-all-employeeSelection',
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function () {
                Ext.getCmp('employeeSelection-tree').collapseAll();
            }
        }],
        listeners: {
            click: function (node, e) {
                e.stopEvent();
                node.select();
                node.reload();
                node.getOwnerTree().selectedUnitTypeId = node.attributes.id == 'root-unit' ? 0 : node.attributes.unitTypeId;
                node.getOwnerTree().selectedUnitId = node.attributes.id == 'root-unit' ? 0 : node.attributes.id;
                var employeeSelectionGrid = Ext.getCmp('employeeSelection-grid');
                var selectedUnit = node.attributes.id == 'root-unit' ? '' : '[' + node.attributes.text + ']';
                Ext.getCmp('selected-unit').setValue(selectedUnit);
                employeeSelectionGrid.store.baseParams['record'] = Ext.encode({ unitId: node.id });
                employeeSelectionGrid.store.load({ params: { start: 0, limit: employeeSelectionGrid.pageSize } });
            },
            expand: function (p) {
                p.syncSize();
            }
        }
    }, config));
}
Ext.extend(Ext.erp.ux.common.Tree, Ext.tree.TreePanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'displayfield',
            id: 'selected-unit',
            style: 'font-weight: bold'
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            id: 'expand-all-assets',
            iconCls: 'icon-expand-all',
            tooltip: 'Expand All',
            handler: function () {
                Ext.getCmp('fixedAsset-tree').expandAll();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'collapse-all-assets',
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function () {
                Ext.getCmp('fixedAsset-tree').collapseAll();
            }
        }];
        Ext.erp.ux.common.Tree.superclass.initComponent.call(this, arguments);
    }
});
Ext.reg('employeeSelection-tree', Ext.erp.ux.common.Tree);


/**
* @desc      EmployeeSelection window
* @author    Wondwosen Desalegn
* @copyright (c) 2012, Cybersoft
* @date      April 24, 2012
* @namespace Ext.erp.ux.common
* @class     Ext.erp.ux.common.EmployeeWindow
* @extends   Ext.Window
*/
Ext.erp.ux.common.EmployeeWindow = function (config) {
    Ext.erp.ux.common.EmployeeWindow.superclass.constructor.call(this, Ext.apply({
        title: 'Employee Selection Criteria',
        width: 900,
        height: 490,
        layout: 'hbox',
        bodyStyle: 'margin: 5px; padding-right: 10px',
        align: 'stretch',
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right'
    }, config));
}
Ext.extend(Ext.erp.ux.common.EmployeeWindow, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.common.Form();
        this.grid = new Ext.erp.ux.common.Grid();
        this.tree = new Ext.erp.ux.common.Tree();

        this.items = [{
            xtype: 'panel',
            width: 300,
            height: 430,
            layout: 'fit',
            bodyStyle: 'background:transparent',
            flex: 1,
            items: [this.tree]
        }, {
            xtype: 'panel',
            width: 10,
            bodyStyle: 'background:transparent',
            border: false,
            flex: 1
        }, {
            xtype: 'panel',
            layout: 'vbox',
            height: 430,
            width: 570,
            bodyStyle: 'background:transparent',
            border: false,
            flex: 1,
            align: 'stretch',
            items: [{
                xtype: 'panel',
                title: 'Selection Criteria',
                height: 130,
                layout: 'fit',
                width: 565,
                bodyStyle: 'background:transparent; padding-top: 10px;',
                flex: 1,
                items: [this.form]
            }, {
                xtype: 'panel',
                height: 30,
                width: 565,
                bodyStyle: 'background:transparent;',
                border: false,
                flex: 1,
                items: [{
                    xtype: 'toolbar',
                    style: {
                        background: 'none',
                        border: 'none',
                        paddingTop: '5px'
                    },
                    items: [{
                        xtype: 'tbfill'
                    }, {
                        xtype: 'button',
                        text: 'Filter Employee',
                        iconCls: 'icon-filter',
                        handler: function () {
                            var form = Ext.getCmp('employeeSelection-form').getForm();
                            var tree = Ext.getCmp('employeeSelection-tree');
                            var searchByComboValue = form.findField('SearchBy').getRawValue();
                            var criteriaComboValue = form.findField('Criteria').getRawValue();
                            var searchTextValue = form.findField('SearchText').getValue();
                            var genderComboValue = form.findField('GenderId').getValue();
                            var empNatureComboValue = form.findField('EmploymentNatureId').getValue();
                            var searchParams = '';
                            if (searchByComboValue == 'Gender') {
                                searchParams = searchByComboValue + ';' + genderComboValue;
                            }
                            else if (searchByComboValue == 'Employment Nature') {
                                searchParams = searchByComboValue + ';' + empNatureComboValue;
                            }
                            else {
                                searchParams = searchByComboValue + ';' + criteriaComboValue + ';' + searchTextValue;
                            }

                            var employeeSelectionGrid = Ext.getCmp('employeeSelection-grid');
                            employeeSelectionGrid.store.baseParams = { record: Ext.encode({ unitId: tree.selectedUnitId, searchParam: searchParams }) };
                            employeeSelectionGrid.store.load({ params: { start: 0, limit: employeeSelectionGrid.pageSize } });
                        }
                    }]

                }]
            }, {
                xtype: 'panel',
                layout: 'fit',
                width: 565,
                height: 270,
                bodyStyle: 'background:transparent',
                flex: 1,
                items: [this.grid]
            }]
        }];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Select',
            iconCls: 'icon-accept',
            scope: this,
            handler: this.onSelect
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.erp.ux.common.EmployeeWindow.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        if (!this.grid.getSelectionModel().hasSelection()) return;
        var selected = this.grid.getSelectionModel().getSelected();
        var id = selected.get('Id');
        var name = selected.get('FirstName') + ' ' + selected.get('LastName');
        var form = this.parentForm;

        form.findField(this.controlIdField).setValue(id);
        form.findField(this.controlNameField).setValue(name);
        this.close();
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('employeeSelection-window', Ext.erp.ux.common.EmployeeWindow);

/**
* @desc      EmployeeSelection tree
* @author    Wondwosen Desalegn
* @copyright (c) 2012, Cybersoft
* @date      April 24, 2012
* @namespace Ext.erp.ux.common
* @class     Ext.erp.ux.common.UnitTree
* @extends   Ext.tree.TreePanel
*/
Ext.erp.ux.common.UnitTree = function (config) {
    Ext.erp.ux.common.UnitTree.superclass.constructor.call(this, Ext.apply({
        id: 'employeeSelection-tree',
        loader: new Ext.tree.TreeLoader({
            directFn: Psms.PopulateUnitTree
        }),
        selectedUnitId: 0,
        selectedUnitTypeId: 0,
        border: false,
        rootVisible: true,
        lines: true,
        autoScroll: true,
        stateful: false,
        root: {
            text: 'Units',
            id: 'root-unit'
        },
        tbar: [{
            xtype: 'displayfield',
            id: 'selected-unit',
            style: 'font-weight: bold'
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            id: 'expand-all-employeeSelection',
            iconCls: 'icon-expand-all',
            tooltip: 'Expand All',
            handler: function () {
                Ext.getCmp('employeeSelection-tree').expandAll();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'collapse-all-employeeSelection',
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function () {
                Ext.getCmp('employeeSelection-tree').collapseAll();
            }
        }],
        listeners: {
            click: function (node, e) {
                e.stopEvent();
                node.select();
                node.reload();
                node.getOwnerTree().selectedUnitTypeId = node.attributes.id == 'root-unit' ? 0 : node.attributes.unitTypeId;
                node.getOwnerTree().selectedUnitId = node.attributes.id == 'root-unit' ? 0 : node.attributes.id;
                var selectedUnit = node.attributes.id == 'root-unit' ? '' : '[' + node.attributes.text + ']';
                Ext.getCmp('selected-unit').setValue(selectedUnit);
            },
            expand: function (p) {
                p.syncSize();
            }
        }
    }, config));
}
Ext.extend(Ext.erp.ux.common.UnitTree, Ext.tree.TreePanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'displayfield',
            id: 'selected-unit',
            style: 'font-weight: bold'
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            id: 'expand-all-assets',
            iconCls: 'icon-expand-all',
            tooltip: 'Expand All',
            handler: function () {
                Ext.getCmp('fixedAsset-tree').expandAll();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            id: 'collapse-all-assets',
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
            handler: function () {
                Ext.getCmp('fixedAsset-tree').collapseAll();
            }
        }];
        Ext.erp.ux.common.UnitTree.superclass.initComponent.call(this, arguments);
    }
});
Ext.reg('employeeSelection-unittree', Ext.erp.ux.common.UnitTree);

/**
* @desc      UnitSelection window
* @author    Wondwosen Desalegn
* @copyright (c) 2012, Cybersoft
* @date      April 24, 2012
* @namespace Ext.erp.ux.common
* @class     Ext.erp.ux.common.UnitWindow
* @extends   Ext.Window
*/
Ext.erp.ux.common.UnitWindow = function (config) {
    Ext.erp.ux.common.UnitWindow.superclass.constructor.call(this, Ext.apply({
        title: 'Unit Selection',
        width: 500,
        height: 400,
        layout: 'fit',
        bodyStyle: 'padding:5px;',
        align: 'stretch',
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right'
    }, config));
}
Ext.extend(Ext.erp.ux.common.UnitWindow, Ext.Window, {
    initComponent: function () {
        this.tree = new Ext.erp.ux.common.UnitTree();
        this.items = [this.tree];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Select',
            iconCls: 'icon-accept',
            scope: this,
            handler: this.onSelect
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.erp.ux.common.UnitWindow.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        var tree = this.tree;
        var node = tree.getSelectionModel().getSelectedNode();
        var nodeId = node.attributes.id;
        var nodeName = node.attributes.text;
        var form = this.parentForm;
        form.findField(this.controlIdField).setValue(nodeId);
        form.findField(this.controlNameField).setValue(nodeName);
        this.close();
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('employeeSelection-unitwindow', Ext.erp.ux.common.UnitWindow);

/**
* @desc      UnitSelection window
* @author    Wondwosen Desalegn
* @copyright (c) 2012, Cybersoft
* @date      April 24, 2012
* @namespace Ext.erp.ux.common
* @class     Ext.erp.ux.common.StoreWindow
* @extends   Ext.Window
*/
Ext.erp.ux.common.StoreWindow = function (config) {
    Ext.erp.ux.common.StoreWindow.superclass.constructor.call(this, Ext.apply({
        title: 'Store Selection',
        width: 500,
        height: 400,
        layout: 'fit',
        bodyStyle: 'padding:5px;',
        align: 'stretch',
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right'
    }, config));
}
Ext.extend(Ext.erp.ux.common.StoreWindow, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.common.StoreGrid();
        this.items = [this.grid];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Select',
            iconCls: 'icon-accept',
            scope: this,
            handler: this.onSelect
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.erp.ux.common.StoreWindow.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        var grid = Ext.getCmp('storeSelection-storeGrid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var name = grid.getSelectionModel().getSelected().get('Name');
        var form = this.parentForm;
        form.findField(this.controlIdField).setValue(id);
        form.findField(this.controlNameField).setValue(name);
        this.close();
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('employeeSelection-storewindow', Ext.erp.ux.common.StoreWindow);


/**
* @desc      itemSubCategory grid
* @author    Meftuh Mohammed
* @copyright (c) 2013, Cybersoft
* @date      January 14, 2014
* @namespace Ext.erp.ux.common
* @class     Ext.erp.ux.common.StoreGrid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.common.StoreGrid = function (config) {
    Ext.erp.ux.common.StoreGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Psms.GetPagedStore,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code'],
            remoteSort: true
        }),
        id: 'storeSelection-storeGrid',
        pageSize: 10,
        stripeRows: true,
        border: false,
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
        }, {
            dataIndex: 'Name',
            header: 'Item MainCategory Name',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Code',
            header: 'Item MainCategory Code',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.common.StoreGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.bbar = new Ext.PagingToolbar({
            id: 'storeSelection-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.common.StoreGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.store.baseParams = { record: Ext.encode({ Store: '' }) };
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.common.StoreGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('employeeSelection-storeGrid', Ext.erp.ux.common.StoreGrid);



/**
* @desc      DeliveryOrderSelection window
* @author    Bethelhem Teka
* @copyright (c) 2012, Cybersoft
* @date      April 24, 2012
* @namespace Ext.erp.ux.common
* @class     Ext.erp.ux.common.DeliveryOrderWindow
* @extends   Ext.Window
*/
Ext.erp.ux.common.DeliveryOrderWindow = function (config) {
    Ext.erp.ux.common.DeliveryOrderWindow.superclass.constructor.call(this, Ext.apply({
        title: 'Delivery Order Ref.',
        width: 500,
        height: 400,
        layout: 'fit',
        id: 'deliveryOrderSelection-window',
        bodyStyle: 'padding:5px;',
        align: 'stretch',
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right'
    }, config));
}
Ext.extend(Ext.erp.ux.common.DeliveryOrderWindow, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.common.DeliveryOrderGrid();
        this.items = [this.grid];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Select',
            iconCls: 'icon-accept',
            scope: this,
            handler: this.onSelect
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.erp.ux.common.DeliveryOrderWindow.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        var grid = Ext.getCmp('deliveryOrderSelection-deliveryGrid');
        if (!grid.getSelectionModel().hasSelection()) return;





        var deliveryOrderHeaderIds = '';
        var deliveryOrderHeaderNos = '';

        var selectedRows = grid.getSelectionModel().getSelections();
        for (var i = 0; i < selectedRows.length; i++) {
            if (i < selectedRows.length - 1) {
                deliveryOrderHeaderIds = deliveryOrderHeaderIds + selectedRows[i].get("Id") + ':';
                deliveryOrderHeaderNos = deliveryOrderHeaderNos + selectedRows[i].get("Name") + ':';
            }
            else {
                deliveryOrderHeaderIds = deliveryOrderHeaderIds + selectedRows[i].get("Id");
                deliveryOrderHeaderNos = deliveryOrderHeaderNos + selectedRows[i].get("Name");
            }

        }


        if (this.parentGridDetail == 'dispatch-gridDetail') {


            Ext.getCmp('DeliveryOrderRefNoOnDispatch').setValue(deliveryOrderHeaderNos);
            Ext.getCmp('hiddenDeliveryOrderOnDispatch').setValue(deliveryOrderHeaderNos);
            Ext.getCmp('DeliveryOrderHeaderIdOnDispatch').setValue(deliveryOrderHeaderIds);

            var voucherDetailGrid = Ext.getCmp('dispatch-gridDetail');
            var voucherDetailStore = voucherDetailGrid.getStore();
            voucherDetailStore.baseParams = { record: Ext.encode({ deliveryOrderHeaderId: deliveryOrderHeaderIds, disposalHeaderId: "", storeIssueHeaderId: "" }) };
            voucherDetailStore.load({
                params: { start: 0, limit: voucherDetailGrid.pageSize }
            });
        }
        if (this.parentGridDetail == 'returnRequisition-gridDetail') {
            Ext.getCmp('DeliveryOrderRefNoOnReturn').setValue(deliveryOrderHeaderNos);
            Ext.getCmp('hiddenDeliveryOrderOnReturn').setValue(deliveryOrderHeaderNos);
            Ext.getCmp('DeliveryOrderHeaderIdOnReturn').setValue(deliveryOrderHeaderIds);

            var voucherDetailGrid = Ext.getCmp('returnRequisition-gridDetail');
            var voucherDetailStore = voucherDetailGrid.getStore();
            voucherDetailStore.baseParams = { record: Ext.encode({ deliveryOrderId: deliveryOrderHeaderIds, disposalHeaderId: "", SIVId: "" }) };
            voucherDetailStore.load({
                params: { start: 0, limit: voucherDetailGrid.pageSize }
            });
        }



        this.close();
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('deliveryOrderSelection-window', Ext.erp.ux.common.DeliveryOrderWindow);



/**
* @desc      itemSubCategory grid
* @author    Bethelhem Teka
* @copyright (c) 2013, Cybersoft
* @date      January 14, 2014
* @namespace Ext.erp.ux.common
* @class     Ext.erp.ux.common.DeliveryOrderGrid
* @extends   Ext.grid.GridPanel
*/
var selModelDeliveryOrderGrid = new Ext.grid.CheckboxSelectionModel();

Ext.erp.ux.common.DeliveryOrderGrid = function (config) {
    Ext.erp.ux.common.DeliveryOrderGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Psms.GetApprovedGRN,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'SalesRefNo', 'DO_Date'],
            remoteSort: true
        }),
        id: 'deliveryOrderSelection-deliveryGrid',
        pageSize: 10,
        stripeRows: true,
        border: false,
        sm: selModelDeliveryOrderGrid,
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        columns: [selModelDeliveryOrderGrid, {
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Name',
            header: 'Goods Receive Ref. ',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'DO_Date',
            header: 'Goods Receive Date',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.common.DeliveryOrderGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.bbar = new Ext.PagingToolbar({
            id: 'deliveryOrderSelection-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.common.DeliveryOrderGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.store.baseParams = { record: Ext.encode({ Store: '' }) };
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.common.DeliveryOrderGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('deliveryOrderSelection-deliveryGrid', Ext.erp.ux.common.DeliveryOrderGrid);






/**
* @desc      StoreIssueSelection window
* @author    Bethelhem Teka
* @copyright (c) 2012, Cybersoft
* @date      April 24, 2012
* @namespace Ext.erp.ux.common
* @class     Ext.erp.ux.common.SIVWindow
* @extends   Ext.Window
*/
Ext.erp.ux.common.SIVWindow = function (config) {
    Ext.erp.ux.common.SIVWindow.superclass.constructor.call(this, Ext.apply({
        title: 'SIV Ref No.',
        width: 500,
        height: 400,
        layout: 'fit',
        id: 'storeIssueSelection-window',
        bodyStyle: 'padding:5px;',
        align: 'stretch',
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right'
    }, config));
}
Ext.extend(Ext.erp.ux.common.SIVWindow, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.common.SIVGrid();
        this.items = [this.grid];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Select',
            iconCls: 'icon-accept',
            scope: this,
            handler: this.onSelect
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.erp.ux.common.SIVWindow.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        var grid = Ext.getCmp('StoreIssueSelection-sivGrid');
        if (!grid.getSelectionModel().hasSelection()) return;





        var storeIssueHeaderIds = '';
        var storeIssueHeaderNos = '';

        var selectedRows = grid.getSelectionModel().getSelections();
        for (var i = 0; i < selectedRows.length; i++) {
            if (i < selectedRows.length - 1) {
                storeIssueHeaderIds = storeIssueHeaderIds + selectedRows[i].get("Id") + ':';
                storeIssueHeaderNos = storeIssueHeaderNos + selectedRows[i].get("Name") + ':';
            }
            else {
                storeIssueHeaderIds = storeIssueHeaderIds + selectedRows[i].get("Id");
                storeIssueHeaderNos = storeIssueHeaderNos + selectedRows[i].get("Name");
            }

        }

        //alert(storeIssueHeaderIds);
        //alert(storeIssueHeaderNos);


        if (this.parentGridDetail == 'dispatch-gridDetail') {

            Ext.getCmp('StoreIssueVoucerRefNoOnDispatch').setValue(storeIssueHeaderNos);
            Ext.getCmp('hiddenStoreIssueOnDispatch').setValue(storeIssueHeaderNos);
            Ext.getCmp('StoreIssueVoucherHeaderIdOnDispatch').setValue(storeIssueHeaderIds);


            var voucherDetailGrid = Ext.getCmp('dispatch-gridDetail');
            var voucherDetailStore = voucherDetailGrid.getStore();
            voucherDetailStore.baseParams = { record: Ext.encode({ storeIssueHeaderId: storeIssueHeaderIds, disposalHeaderId: "", deliveryOrderHeaderId: "" }) };
            voucherDetailStore.load({
                params: { start: 0, limit: voucherDetailGrid.pageSize }
            });
        }
        if (this.parentGridDetail == 'returnRequisition-gridDetail') {
            Ext.getCmp('StoreIssueVoucerRefNoOnReturn').setValue(storeIssueHeaderNos);
            Ext.getCmp('hiddenStoreIssueOnReturn').setValue(storeIssueHeaderNos);
            Ext.getCmp('StoreIssueVoucherHeaderIdOnReturn').setValue(storeIssueHeaderIds);

            var voucherDetailGrid = Ext.getCmp('returnRequisition-gridDetail');
            var voucherDetailStore = voucherDetailGrid.getStore();
            voucherDetailStore.baseParams = { record: Ext.encode({ SIVId: storeIssueHeaderIds, deliveryOrderId: "" }) };
            voucherDetailStore.load({
                params: { start: 0, limit: voucherDetailGrid.pageSize }
            });
        }
        this.close();
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('storeIssueSelection-window', Ext.erp.ux.common.SIVWindow);



/**
* @desc      itemSubCategory grid
* @author    Bethelhem Teka
* @copyright (c) 2013, Cybersoft
* @date      January 14, 2014
* @namespace Ext.erp.ux.common
* @class     Ext.erp.ux.common.SIVGrid
* @extends   Ext.grid.GridPanel
*/
var selModelStoreIssueGrid = new Ext.grid.CheckboxSelectionModel();

Ext.erp.ux.common.SIVGrid = function (config) {
    Ext.erp.ux.common.SIVGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Psms.GetApprovedTransferOuts,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'Date', 'Name', 'Purpose', 'ProjectNo', 'Date'],
            remoteSort: true
        }),
        id: 'StoreIssueSelection-sivGrid',
        pageSize: 10,
        stripeRows: true,
        border: false,
        sm: selModelStoreIssueGrid,
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        columns: [selModelStoreIssueGrid, {
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Name',
            header: 'SIV Ref No.',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Purpose',
            header: 'Purpose',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Date',
            header: 'Date',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ProjectNo',
            header: 'ProjectNo',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.ux.common.SIVGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.bbar = new Ext.PagingToolbar({
            id: 'StoreIssueSelection-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.common.SIVGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        var host = Ext.getCmp('storeIssueSelection-window').parentGridDetail
        this.store.baseParams = { record: Ext.encode({ Store: '', host: host }) };
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.common.SIVGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('StoreIssueSelection-sivGrid', Ext.erp.ux.common.SIVGrid);
