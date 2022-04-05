Ext.ns('Ext.erp.ux.productionPlanStatus');

/**
* @desc      productionPlanStatus Grid

* @copyright (c) 2013, 
* @date      June 22, 2013
* @namespace Ext.erp.ux.productionPlanStatus
* @class     Ext.erp.ux.productionPlanStatus.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.productionPlanStatus.Grid = function (config) {
    Ext.erp.ux.productionPlanStatus.Grid.superclass.constructor.call(this, Ext.apply({

        store: new Ext.data.GroupingStore({
            proxy: new Ext.data.DirectProxy({
                directFn: ProductionPlan.GetAllStatusDetail,
                paramsAsHash: false,
                paramOrder: 'start|limit|sort|dir|record',
            }),
            reader: new Ext.data.JsonReader({
                root: 'data',
                idProperty: 'Id',
                totalProperty: 'total',
                sortInfo: {
                    field: 'VoucherNumber',
                    direction: 'ASC'
                },
                fields: ['Id', 'VoucherNumber', 'ProductionOrderNo', 'ProductionCenter', 'ProgressStatus','Operation', 'Assigned', 'Name', 'Code', 'Quantity', 'RemainingQuantity', 'StatusId', 'Remark'],
            }),
            groupField: 'VoucherNumber',
            sortInfo: {
                field: 'VoucherNumber',
                direction: 'ASC'
            },
            remoteSort: true,
            listeners: {
                beforeLoad: function () { this.body.mask('Loading...', 'x-mask-loading'); },
                load: function () { this.body.unmask(); },
                loadException: function () { this.body.unmask(); },
                scope: this
            }
        }),
        view: new Ext.grid.GroupingView({
            forceFit: true,
            showGroupName: false,
            groupTextTpl: '{text}'
        }),
        id: 'productionPlanStatus-grid',
        selectedUnitTypeId: 0,
        pageSize: 30,
        height: 300,
        stripeRows: true,
        border: false,
        columnLines: true,
        listeners: {
            rowclick: function (grid, rowIndex, e) {

            },
            scope: this
        },
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            //       autoFill: true
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(),
        {
            dataIndex: 'Status',
            header: 'Status',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.get("ProgressStatus") == "Completed")
                    return '<img src="Content/images/app/OkPass.png"/>';
                else
                    return '<img src="Content/images/app/Cancel1.png"/>';
            }
        }, {
            dataIndex: 'VoucherNumber',
            header: 'Plan Number',
            sortable: true,
            width: 100,

            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'ProductionOrderNo',
            header: 'Order No',
            sortable: true,
            width: 100,

            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'Operation',
            header: 'Last Operation',
            sortable: true,
            width: 100,

            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'ProgressStatus',
            header: 'Status',
            sortable: true,
            width: 100,

            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 240,
            menuDisabled: true,
        }, 
        {
            dataIndex: 'Assigned',
            header: 'Assigned',
            sortable: true,
            width: 70,
            menuDisabled: true,
            xtype: 'combocolumn',

        },
        {
            dataIndex: 'Quantity',
            header: 'Qty',
            sortable: true,
            width: 70,
            menuDisabled: true,
            renderer: function (value) {
                return Ext.util.Format.number(value, '0,000 ');
            },
            editor: {
                xtype: 'numberfield',
                allowBlank: false
            }
        }, ]
    }, config));
}
Ext.extend(Ext.erp.ux.productionPlanStatus.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({action:'PlanStatus'}) };
        this.tbar = [
             {
                 name: 'StartDate',
                 xtype: 'datefield',
                 fieldLabel: 'From Date',
                 width: 100,
                 id: 'StartDate',
                 allowBlank: false,
                 value: new Date(),
                 maxValue: (new Date()).format('m/d/Y'),
                 listeners: {
                     select: function (cmb, rec, idx) {
                         Ext.getCmp('productionPlanStatus-grid').onSearch();
                     },
                 }
             }, {
                 name: 'EndDate',
                 xtype: 'datefield',
                 fieldLabel: 'To Date',
                 width: 100,
                 id: 'EndDate',
                 allowBlank: false,
                 value: new Date(),
                 maxValue: (new Date()).format('m/d/Y'),
                 listeners: {
                     select: function (cmb, rec, idx) {
                         Ext.getCmp('productionPlanStatus-grid').onSearch();


                     },
                 }
             }, {
                 hiddenName: 'Status',
                 xtype: 'combo',
                 fieldLabel: 'Status',
                 triggerAction: 'all',
                 mode: 'remote',
                 editable: false,
                 id: 'Status',
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
                     api: { read: Psms.GetVoucherStatus }
                 }),
                 valueField: 'Id',
                 displayField: 'Name',
                 listeners: {
                     select: function (cmb, rec, idx) {
                         Ext.getCmp('productionPlanStatus-grid').onSearch();
                        
                        
                     },
                 }
             },
           {
                xtype: 'button',
                text: 'Preview',
                hidden: false,
                iconCls: 'icon-preview',
                handler: this.onPreview
            }, {
            xtype: 'tbfill'
        }, {
            xtype: 'textfield',
            emptyText: 'Type Search text here and press "Enter"',
            submitEmptyText: false,
            enableKeyEvents: true,
            id:'searchText',
            style: {
                borderRadius: '25px',
                padding: '0 10px',
                width: '200px'
            },
            listeners: {
                specialKey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        Ext.getCmp('productionPlanStatus-grid').onSearch();
                        
                       }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                         Ext.getCmp('productionPlanStatus-grid').onSearch();
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'productionPlanStatus-productionPlanpaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.productionPlanStatus.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {

        var grid = Ext.getCmp('productionPlanStatus-grid');
        if (!grid.getSelectionModel().hasSelection()) return;


        var voucherId = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        window.open('Reports/ErpReportViewer.aspx?rt=PreviewPlanStatus&id=' + voucherId, 'PreviewIV', parameter);


    },
    customRenderer: function (value, metaData, record, rowIndex, colIndex, store) {

        if (record.get("ProgressStatus") == "Completed")
            return '<span style=color:blue>' + value + '</span>';
        if (record.get("ProgressStatus") == "Started")
            return '<span style=color:black>' + value + '</span>';
        else
            return '<span style=color:black>' + value + '</span>';


    },
    onSearch: function (value, metaData, record, rowIndex, colIndex, store) {

        var grid = Ext.getCmp('productionPlanStatus-grid');
        var startDate = Ext.getCmp('StartDate').getValue();
        var endDate = Ext.getCmp('EndDate').getValue();
        var status = Ext.getCmp('Status').getValue();
        var searchText = Ext.getCmp('searchText').getValue();
        grid.store.baseParams['record'] = Ext.encode({ searchText: searchText, startDate: startDate, endDate: endDate, status: status });
        grid.store.load({ params: { start: 0, limit: grid.pageSize } });


    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.productionPlanStatus.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('productionPlanStatus-grid', Ext.erp.ux.productionPlanStatus.Grid);



/**
* @desc      productionPlanStatus panel

* @copyright (c) 2013, 
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.productionPlanStatus
* @class     Ext.erp.ux.productionPlanStatus.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.productionPlanStatus.Panel = function (config) {
    Ext.erp.ux.productionPlanStatus.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'productionPlanStatus-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.productionPlanStatus.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.productionPlanStatus.Grid();
         
        this.items = [this.grid];
        Ext.erp.ux.productionPlanStatus.Panel.superclass.initComponent.apply(this, arguments);
    },
});
Ext.reg('productionPlanStatus-panel', Ext.erp.ux.productionPlanStatus.Panel);
