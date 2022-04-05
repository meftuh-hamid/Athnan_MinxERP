Ext.ns('Ext.erp.ux.inventoryEvaluation');

/**
* @desc      inventoryEvaluation form
* @author    Meftuh Mohammed
* @copyright (c) 2013, 
* @date      June 22, 2013
* @namespace Ext.erp.ux.inventoryEvaluation
* @class     Ext.erp.ux.inventoryEvaluation.Form
* @extends   Ext.form.FormPanel
*/
var globalWindow = window;
Ext.erp.ux.inventoryEvaluation.Form = function (config) {
    Ext.erp.ux.inventoryEvaluation.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            submit: ERPReport.SetinventoryEvaluationParam
        },
        paramOrder: ['id'],
        defaults: {
            labelStyle: 'text-align:right;',
            bodyStyle: 'background-color:transparent;',
            msgTarget: 'side',
        },
        id: 'inventoryEvaluation-form',
        padding: 5,
        labelWidth: 100,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        loadDocument: function () {

            BinCard.GetDocumentNo(function (result) {
                var form = Ext.getCmp('inventoryEvaluation-form').getForm();
                   form.findField('UpdateDate').setValue(result.data.Date);
             

            });


        },
        items: [{
            layout: 'column',
            border: false,

            items: [{
                columnWidth: .5,
                defaults: {
                    anchor: '90%',
                    labelStyle: 'text-align:right;',
                    msgTarget: 'side',

                },
                layout: 'form',
                border: false,
                bodyStyle: 'background-color:transparent;',

                items: [
{
    hiddenName: 'FiscalYearId',
    xtype: 'combo',
    fieldLabel: 'Fiscal Year',
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
        api: { read: Psms.GetFiscalYear }
    }),
    valueField: 'Id',
    displayField: 'Name'
}, {
    hiddenName: 'ItemId',
    xtype: 'combo',
    fieldLabel: 'Item',
    typeAhead: false,
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
            fields: ['Id', 'Name']
        }),
        autoLoad: true,
        api: { read: Psms.GetItemBySearch }
    }),
    valueField: 'Id',
    displayField: 'Name',
    pageSize: 10, listeners: {
        select: function (cmb, rec, idx) {

        },
    }
}, {
    name: 'FromDate',
    xtype: 'datefield',
    fieldLabel: 'Date From',
    hidden: true,

    emptyText: '---Select Date From---',
    width: 140,
    allowBlank: false,
    maxValue: (new Date()).format('m/d/Y')
}, {
    name: 'ToDate',
    xtype: 'datefield',
    fieldLabel: 'Date To',
    hidden: true,
    emptyText: '---Select Date To---',
    width: 140,
    allowBlank: false
}
                ]
            }, {
                columnWidth: .5,
                defaults: {
                    anchor: '90%',
                    labelStyle: 'text-align:right;',
                    msgTarget: 'side',
                },
                layout: 'form',
                border: false,
                bodyStyle: 'background-color:transparent;',

                items: [
                    {
                        name: 'StartDate',
                        xtype: 'datefield',
                        fieldLabel: 'Start Date',
                        altFormats: 'c',
                        width: 100,
                        allowBlank: false,
                    }, {
                        name: 'UpdateDate',
                        xtype: 'textfield',
                        fieldLabel: 'Update Date',
                        width: 100,
                        allowBlank: false,
                     },
                ]
            }]
        }],
    }, config));
};
Ext.extend(Ext.erp.ux.inventoryEvaluation.Form, Ext.form.FormPanel);
Ext.reg('inventoryEvaluation-form', Ext.erp.ux.inventoryEvaluation.Form);


/**
* @desc      RequestForQuotation detailGrid
* @author    Meftuh Mohammed
* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.inventoryEvaluation
* @class     Ext.erp.ux.inventoryEvaluation.GridDetail
* @extends   Ext.grid.GridPanel
*/
var inventoryEvaluationSelectionModel = new Ext.grid.CheckboxSelectionModel({
});
Ext.erp.ux.inventoryEvaluation.GridDetail = function (config) {
    Ext.erp.ux.inventoryEvaluation.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Store.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },

            fields: ['Id','Name', 'Code','StoreType', 'ParentStore'],

            remoteSort: true
        }),
        id: 'inventoryEvaluation-detailGrid',
        clicksToEdit: 1,
        pageSize: 500,
        height:150,
        stripeRows: true,
        columnLines: true,
        border: true,
        inventoryEvaluationSourceStore: new Ext.data.Store(),
        rFQStore: new Ext.data.Store(),

        sm: inventoryEvaluationSelectionModel,
        viewConfig: {
            forceFit: true
        },
        listeners: {
            beforeLoad: function () {
                Ext.getCmp('inventoryEvaluation-detailGrid').body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
                Ext.getCmp('inventoryEvaluation-detailGrid').body.unmask();
            },
            loadException: function () {
                Ext.getCmp('inventoryEvaluation-detailGrid').body.unmask();
            },
            afteredit: function (e) {
                var record = e.record;
            }
        },
        sm: inventoryEvaluationSelectionModel,
        cm: new Ext.grid.ColumnModel({
            columns: [
                inventoryEvaluationSelectionModel,
                new Ext.grid.RowNumberer(),
                {
                    dataIndex: 'Name',
                    header: 'Name',
                    sortable: true,
                    width: 140,
                    menuDisabled: true,
                }, {
                    dataIndex: 'IsCalculated',
                    header: 'Is Recalculated?',
                    sortable: true,
                    width: 150,
                    menuDisabled: true,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                        if (value)
                            return '<img src="Content/images/app/yes.png"/>';
                        else
                            return '<img src="Content/images/app/no.png"/>';
                    }
                },]
        })
    }, config));
}
Ext.extend(Ext.erp.ux.inventoryEvaluation.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({action:"GetAllStore"}) };
        this.bbar = [];

        Ext.erp.ux.inventoryEvaluation.GridDetail.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.inventoryEvaluation.GridDetail.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('inventoryEvaluation-detailGrid', Ext.erp.ux.inventoryEvaluation.GridDetail);


/**
* @desc      inventoryEvaluation registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2020, 
* @date      January 27, 2011
* @namespace Ext.erp.ux.inventoryEvaluation
* @class     Ext.erp.ux.inventoryEvaluation.Window
* @extends   Ext.Window
*/
Ext.erp.ux.inventoryEvaluation.Window = function (config) {
    Ext.erp.ux.inventoryEvaluation.Window.superclass.constructor.call(this, Ext.apply({
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
                Ext.getCmp('inventoryEvaluation-form').loadDocument();

            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.ux.inventoryEvaluation.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.ux.inventoryEvaluation.Form();
        this.detailGrid = new Ext.erp.ux.inventoryEvaluation.GridDetail();

        this.items = [this.detailGrid,this.form];
        this.bbar = [ {
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
        Ext.erp.ux.inventoryEvaluation.Window.superclass.initComponent.call(this, arguments);
    },

    onSave: function () {
         var form = Ext.getCmp('inventoryEvaluation-form').getForm();
        var fiscalYearId = form.findField('FiscalYearId').getValue();
        var itemId = form.findField('ItemId').getValue();
        var startDate = form.findField('StartDate').getValue();
        var updateDate = form.findField('UpdateDate').getValue();
        var action = 'RecalculateCost';

        var grid = Ext.getCmp('inventoryEvaluation-detailGrid');
        var store = grid.getStore();
        var storeRecord = '';
        var selectedItems = grid.getSelectionModel().getSelections();
        var store = grid.getStore();
        if (selectedItems.length < 1) {
            Ext.MessageBox.show({
                title: 'Save failed',
                msg: "Please select store",
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        this.recordCount = selectedItems.length;
        this.selectedItems = selectedItems;
        this.currentIndex = 0;
        this.store = store;
        var item = selectedItems[0];
        storeRecord = item.data['Id'] + ';';
        this.onAjaxCall(action, storeRecord, fiscalYearId);
        //$.get('Calculation/BincardCalculation.aspx?action=' + action + '&storeRecord=' + storeRecord + '&fiscalYearId=' + fiscalYearId + '&itemId=' + itemId + '&startDate=' + startDate + '&updateDate=' + updateDate, function (data) {
        //    store.getAt(i).set('IsCalculated', true);
        //    store.getAt(i).commit();
        //});
        //for (var i = 0; i < selectedItems.length; i++) {
        //    var item = selectedItems[i];
        //    storeRecord =  item.data['Id'] + ';';
        //    //$.get('Calculation/BincardCalculation.aspx?action=' + action + '&storeRecord=' + storeRecord + '&fiscalYearId=' + fiscalYearId + '&itemId=' + itemId + '&startDate=' + startDate + '&updateDate=' + updateDate, function (data) {
        //    //    store.getAt(i).set('IsCalculated', true);
        //    //    store.getAt(i).commit();
        //    //});
        //}
       
        // var parameter = 'width=300,height=400,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
        //globalWindow.open(('Calculation/BincardCalculation.aspx?action=' + action + '&storeRecord=' + storeRecord + '&fiscalYearId=' + fiscalYearId + '&itemId=' + itemId + '&startDate=' + startDate + '&updateDate=' + updateDate), '_blank', "height=300,width=400");
     
    },
    onAjaxCall: function (action, storeRecord, fiscalYearId) {
        var window = this;
        $.ajax({
            type: "POST",
            url: "Calculation/BincardCalculation.aspx/RecalculateStockcard",
            data: '{action: "' + action + '" ,storeRecord: "' + storeRecord + '" ,fiscalYearId: "' + fiscalYearId + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                window.store.getAt(window.currentIndex).set('IsCalculated', true);
                window.store.getAt(window.currentIndex).commit();

                window.currentIndex = window.currentIndex + 1;
                if (window.recordCount > window.currentIndex)
                {
                    var item = window.selectedItems[window.currentIndex];
                    storeRecord = item.data['Id'] + ';';
                    window.onAjaxCall(action, storeRecord, fiscalYearId);                       
                }
                else
                {
                    window.onAjaxCallForAllUpdate();
                }
            },
            failure: function (response) {
                alert(response.d);
            }
        });
    },
    onAjaxCallForAllUpdate: function () {
        var window = this;
        $.ajax({
            type: "POST",
            url: "Calculation/BincardCalculation.aspx/UpdateAllCost",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                alert("successfully updated")

            },
            failure: function (response) {
                alert(response.d);
            }
        });
    },

    onClose: function () {
        this.close();
    }
});
Ext.reg('inventoryEvaluation-window', Ext.erp.ux.inventoryEvaluation.Window);


/**
* @desc      inventoryEvaluation panel
* @author    Meftuh Mohammed
* @copyright (c) 2013, 
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.inventoryEvaluation
* @class     Ext.erp.ux.inventoryEvaluation.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.inventoryEvaluation.Panel = function (config) {
    Ext.erp.ux.inventoryEvaluation.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'inventoryEvaluation-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.inventoryEvaluation.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.inventoryEvaluation.Grid();
        this.items = [this.grid];
         this.tbar = [
        ];
        Ext.erp.ux.inventoryEvaluation.Panel.superclass.initComponent.apply(this, arguments);

    },
   

});
Ext.reg('inventoryEvaluation-panel', Ext.erp.ux.inventoryEvaluation.Panel);
