Ext.ns('Ext.erp.ux.productionJobCard');

/**
* @desc      productionJobCard Grid

* @copyright (c) 2013, 
* @date      June 22, 2013
* @namespace Ext.erp.ux.productionJobCard
* @class     Ext.erp.ux.productionJobCard.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.ux.productionJobCard.Grid = function (config) {
    Ext.erp.ux.productionJobCard.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ProductionPlan.GetAllHeader,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },

            fields: ['Id', 'VoucherNumber', 'PlanStartDate', 'PlanEndDate', 'Interval', 'PreparedBy', 'ActualOperatingCost', 'PlannedOperatingCost', 'AdditionalCost', 'MaterialCost', 'TotalCost', 'StatusId', 'Status', 'PreparedBy', 'SalesArea'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () { this.body.mask('Loading...', 'x-mask-loading'); },
                load: function () { this.body.unmask(); },
                loadException: function () { this.body.unmask(); },
                scope: this
            }
        }),
        id: 'productionJobCard-grid',
        selectedUnitTypeId: 0,
        pageSize: 30,
        height: 300,
        stripeRows: true,
        border: false,
        columnLines: true,
        listeners: {
            rowclick: function (grid, rowIndex, e) {
                var grid = Ext.getCmp('productionJobCard-grid');
                var selectedRecord = grid.getSelectionModel().getSelected();
                var id = selectedRecord.get("Id");               
                var detailGrid = Ext.getCmp('productionJobCard-detailGrid');
                var store = detailGrid.getStore();
                store.baseParams = { record: Ext.encode({ voucherHeaderId: id, action: '' }) };
                detailGrid.getStore().reload({
                    params: {
                        start: 0,
                        limit: detailGrid.pageSize
                    }
                });


                var operationGrid = Ext.getCmp('productionPlanOperation-grid');
                operationGrid.productionPlanId = id;
                var store = operationGrid.getStore();
                store.baseParams = { record: Ext.encode({ productionPlanId: id, action: 'boM' }) };
                operationGrid.getStore().reload({
                    params: {
                        start: 0,
                        limit: operationGrid.pageSize
                    }
                });
                var itemGrid = Ext.getCmp('productionPlanItem-grid');
                itemGrid.productionPlanId = id;
                var store = itemGrid.getStore();
                store.baseParams = { record: Ext.encode({ productionPlanId: id, action: 'boM' }) };
                itemGrid.getStore().reload({
                    params: {
                        start: 0,
                        limit: itemGrid.pageSize
                    }
                });

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
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'Status',
            header: 'Status',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.get("Status") == "Approved")
                    return '<img src="Content/images/app/OkPass.png"/>';
                else if (record.get("Status") == "Certified")
                    return '<img src="Content/images/app/pending.png"/>';
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
            dataIndex: 'PlanStartDate',
            header: 'Start Date',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'PlanEndDate',
            header: 'End Date',
            sortable: true,
            width: 100,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, {
            dataIndex: 'PreparedBy',
            header: 'Prepared By',
            sortable: true,
            width: 80,
            menuDisabled: true,
            renderer: this.customRenderer,

        }, ]
    }, config));
}
Ext.extend(Ext.erp.ux.productionJobCard.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({action:'jobCard'}) };
        this.tbar = [
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
            style: {
                borderRadius: '25px',
                padding: '0 10px',
                width: '200px'
            },
            listeners: {
                specialKey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        var grid = Ext.getCmp('productionJobCard-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('productionJobCard-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }]
        this.bbar = new Ext.PagingToolbar({
            id: 'productionJobCard-productionPlanpaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.ux.productionJobCard.Grid.superclass.initComponent.apply(this, arguments);
    },
    onPreview: function () {

        var grid = Ext.getCmp('productionJobCard-grid');
        if (!grid.getSelectionModel().hasSelection()) return;


        var voucherId = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

        window.open('Reports/ErpReportViewer.aspx?rt=PreviewJobCard&id=' + voucherId, 'PreviewIV', parameter);


    },

    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.ux.productionJobCard.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('productionJobCard-grid', Ext.erp.ux.productionJobCard.Grid);
/**
* @desc      Production Order detailGrid

* @copyright (c) 2010, 
* @date      September 2013
* @namespace Ext.erp.ux.productionJobCard
* @class     Ext.erp.ux.productionJobCard.GridDetail
* @extends   Ext.grid.GridPanel
*/
var productionJobCardSelectionModel = new Ext.grid.RowSelectionModel({
});
Ext.erp.ux.productionJobCard.GridDetail = function (config) {
    Ext.erp.ux.productionJobCard.GridDetail.superclass.constructor.call(this, Ext.apply({

        store: new Ext.data.GroupingStore({
            proxy: new Ext.data.DirectProxy({
                directFn: ProductionPlan.GetAllDetail,
                paramsAsHash: false,
                paramOrder: 'start|limit|sort|dir|record',
            }),
            reader: new Ext.data.JsonReader({
                root: 'data',
                idProperty: 'Id',
                totalProperty: 'total',
                sortInfo: {
                    field: 'ProductionCenter',
                    direction: 'ASC'
                },
                fields: ['Id', 'productionJobCardHeaderId', 'ProductionOrderDetailId', 'ProductionCenter', 'Assigned', 'AssignedId', 'ColorId', 'Name', 'Code', 'Size', 'Quantity', 'RemainingQuantity', 'StatusId', 'Remark'],
            }),
            groupField: 'ProductionCenter',
            sortInfo: {
                field: 'ProductionCenter',
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


        id: 'productionJobCard-detailGrid',
        clicksToEdit: 1,
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: true,
        height: 425,
        serialStore: new Ext.data.Store(),
        lOTStore: new Ext.data.Store(),
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true
        },
        listeners: {
            beforeLoad: function () {
                this.body.mask('Loading...', 'x-mask-loading');
            },
            load: function () {
                this.body.unmask();
            },
            loadException: function () {
                this.body.unmask();
            },
            afteredit: function (e) {
                var record = e.record;

            }
        },
        sm: productionJobCardSelectionModel,
        cm: new Ext.grid.ColumnModel({
            columns: [
                new Ext.grid.RowNumberer(),
                {
                    dataIndex: 'ProductionCenter',
                    header: 'ProductionCenter',
                    sortable: true,
                    hidden: true,
                    width: 140,
                    menuDisabled: true,
                }, {
                    dataIndex: 'Name',
                    header: 'Name',
                    sortable: true,
                    width: 140,
                    menuDisabled: true,
                }, {
                    dataIndex: 'Code',
                    header: 'Code',
                    sortable: true,
                    width: 90,
                    menuDisabled: true
                }, {
                    dataIndex: 'Size',
                    header: 'Size',
                    sortable: true,
                    width: 50,
                    menuDisabled: true
                }, {
                    dataIndex: 'ColorId',
                    header: 'Color',
                    sortable: true,
                    width: 70,
                    menuDisabled: true
                }, {
                    dataIndex: 'RemainingQuantity',
                    header: 'Remaining Qty',
                    sortable: true,
                    width: 70,

                    hidden: true,
                    menuDisabled: true,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,000 ');
                    }
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
                },
                {
                    dataIndex: 'Remark',
                    header: 'Remark',
                    sortable: true,
                    width: 70,
                    menuDisabled: true,

                    editor: {
                        xtype: 'textarea',
                        allowBlank: false
                    }
                },
            ]
        })
    }, config));
}
Ext.extend(Ext.erp.ux.productionJobCard.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({}) };

       
        Ext.erp.ux.productionJobCard.GridDetail.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        Ext.erp.ux.productionJobCard.GridDetail.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('productionJobCard-detailGrid', Ext.erp.ux.productionJobCard.GridDetail);


/**
* @desc      productionJobCard panel

* @copyright (c) 2013, 
* @date      June 22, 2013
* @version   $Id: TheClass.js, 0.1
* @namespace Ext.erp.ux.productionJobCard
* @class     Ext.erp.ux.productionJobCard.Panel
* @extends   Ext.Panel
*/
Ext.erp.ux.productionJobCard.Panel = function (config) {
    Ext.erp.ux.productionJobCard.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'productionJobCard-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.ux.productionJobCard.Panel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.erp.ux.productionJobCard.Grid();
        this.detailGrid = new Ext.erp.ux.productionJobCard.GridDetail();
        this.itemGrid = new Ext.erp.ux.productionPlanItem.Grid();
        this.operatioinGrid = new Ext.erp.ux.productionPlanOperation.Grid();
        this.operatioinTeamGrid = new Ext.erp.ux.productionPlanOperationTeam.Grid();
        
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                split: true,
                width: 450,
                minSize: 200,
                maxSize: 600,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [{
                    layout: 'border',
                    border: false,
                    items: [
                        {
                            region: 'center',
                            border: false,
                            collapsible: true,
                            items: [this.grid]
                        },
                        {
                            region: 'south',
                            border: false,
                            height: 340,
                            collapsible: true,
                            layout: 'fit',
                        items: [this.detailGrid],
                        }
                    ]
                }]
            }, {
                region: 'center',
                border: false,
                autoScroll: true,             
                items: [
               
                    {
                        xtype: 'panel',
                        bodyStyle: 'background:transparent; padding-top: 10px;',
                        flex: 1,
                       
                        items: [ {
                            xtype: 'panel',
                            title: 'Bill of Material',
                            bodyStyle: 'background:transparent; padding-top: 10px;',

                            items: [this.itemGrid]
                        }, {
                            xtype: 'panel',
                            title: 'Opration List',
                            bodyStyle: 'background:transparent; padding-top: 10px;',

                            items: [this.operatioinGrid]
                        }, {
                            xtype: 'panel',
                            title: 'Team',
                            bodyStyle: 'background:transparent; padding-top: 10px;',

                            items: [this.operatioinTeamGrid]
                        }, ]
                    }]
            }]
        }];
        Ext.erp.ux.productionJobCard.Panel.superclass.initComponent.apply(this, arguments);
    },
    onSave: function () {
        var form = Ext.getCmp('productionJobCard-form');

        if (!form.getForm().isValid()) return;
        form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('productionJobCard-form').getForm().reset();
            },
            failure: function (option, response) {
                Ext.MessageBox.show({
                    title: 'Failure',
                    msg: response.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    },
});
Ext.reg('productionJobCard-panel', Ext.erp.ux.productionJobCard.Panel);
