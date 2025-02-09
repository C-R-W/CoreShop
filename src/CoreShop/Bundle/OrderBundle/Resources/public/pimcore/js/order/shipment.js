/*
 * CoreShop.
 *
 * This source file is subject to the GNU General Public License version 3 (GPLv3)
 * For the full copyright and license information, please view the LICENSE.md and gpl-3.0.txt
 * files that are distributed with this source code.
 *
 * @copyright  Copyright (c) CoreShop GmbH (https://www.coreshop.org)
 * @license    https://www.coreshop.org/license     GNU General Public License version 3 (GPLv3)
 *
 */

pimcore.registerNS('coreshop.order.order.shipment');
coreshop.order.order.shipment = Class.create({
    order: null,
    cb: null,

    height: 400,
    width: 800,

    initialize: function (order, cb) {
        this.order = order;
        this.cb = cb;

        Ext.Ajax.request({
            url: Routing.generate('coreshop_admin_order_shipment_get_processable_items'),
            params: {
                id: this.order.o_id
            },
            success: function (response) {
                var res = Ext.decode(response.responseText);

                if (res.success) {
                    if (res.items.length > 0) {
                        this.show(res.items);
                    }
                    else {
                        Ext.Msg.alert(t('coreshop_shipment'), t('coreshop_shipment_no_items'));
                    }
                } else {
                    Ext.Msg.alert(t('error'), res.message);
                }
            }.bind(this)
        });
    },

    getStoreFields: function() {
        return [
            'orderItemId',
            'price',
            'maxToShip',
            'quantity',
            'quantityShipped',
            'toShip',
            'tax',
            'total',
            'name'
        ];
    },

    getGridColumns: function() {
        return [
            {
                xtype: 'gridcolumn',
                flex: 1,
                dataIndex: 'name',
                text: t('coreshop_product')
            },
            {
                xtype: 'gridcolumn',
                dataIndex: 'price',
                text: t('coreshop_price'),
                width: 100,
                align: 'right',
                renderer: coreshop.util.format.currency.bind(this, this.order.currency.isoCode)
            },
            {
                xtype: 'gridcolumn',
                dataIndex: 'quantity',
                text: t('coreshop_quantity'),
                width: 100,
                align: 'right'
            },
            {
                xtype: 'gridcolumn',
                dataIndex: 'quantityShipped',
                text: t('coreshop_shipped_quantity'),
                width: 120,
                align: 'right'
            },
            {
                xtype: 'gridcolumn',
                dataIndex: 'toShip',
                text: t('coreshop_quantity_to_ship'),
                width: 100,
                align: 'right',
                field: {
                    xtype: 'numberfield',
                    decimalPrecision: 0
                }
            }
        ];
    },

    createWindow: function(shipAbleItems) {
        var me = this;

        var positionStore = new Ext.data.JsonStore({
            data: shipAbleItems,
            fields: this.getStoreFields()
        });

        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing');

        var itemsGrid = {
            xtype: 'grid',
            minHeight: 400,
            cls: 'coreshop-order-detail-grid',
            store: positionStore,
            plugins: [rowEditing],
            listeners: {
                validateedit: function (editor, context) {
                    if (context.field === 'toShip') {
                        return context.value <= context.record.data.maxToShip;
                    }

                    return true;
                }
            },
            columns: this.getGridColumns()
        };

        var trackingCode = Ext.create('Ext.form.TextField', {
            fieldLabel: t('coreshop_tracking_code'),
            name: 'trackingCode'
        });

        var panel = Ext.create('Ext.form.Panel', {
            title: t('coreshop_shipment'),
            border: true,
            iconCls: 'coreshop_icon_shipping',
            bodyPadding: 10,
            items: [trackingCode, itemsGrid]
        });

        var window = new Ext.window.Window({
            width: me.width,
            height: me.height,
            resizeable: true,
            modal: true,
            layout: 'fit',
            title: t('coreshop_shipment_create_new') + ' (' + this.order.o_id + ')',
            items: [panel],
            buttons: [
                {
                    text: t('save'),
                    iconCls: 'pimcore_icon_apply',
                    handler: function (btn) {
                        var itemsToShip = [];

                        positionStore.getRange().forEach(function (item) {
                            if (item.get('toShip') > 0) {
                                itemsToShip.push(me.processItemsToShip(item));
                            }
                        });

                        window.setLoading(t('loading'));

                        var data = panel.getForm().getFieldValues();
                        data['id'] = parseInt(this.order.o_id);
                        data['items'] = itemsToShip;

                        Ext.Ajax.request({
                            url: Routing.generate('coreshop_admin_order_shipment_create'),
                            method: 'post',
                            jsonData: data,
                            success: function (response) {
                                var res = Ext.decode(response.responseText);

                                if (res.success) {
                                    pimcore.helpers.showNotification(t('success'), t('success'), 'success');

                                    if (Ext.isFunction(this.cb)) {
                                        this.cb();
                                    }

                                    window.close();
                                } else {
                                    pimcore.helpers.showNotification(t('error'), t(res.message), 'error');
                                }

                                window.setLoading(false);
                            }.bind(this)
                        });
                    }.bind(this)
                }
            ]
        });

        return window;
    },

    processItemsToShip: function(item) {
        return {
            orderItemId: item.get('orderItemId'),
            quantity: item.get('toShip')
        };
    },

    show: function (shipAbleItems) {
        var grWindow = this.createWindow(shipAbleItems);

        grWindow.show();

        return window;
    }
});
