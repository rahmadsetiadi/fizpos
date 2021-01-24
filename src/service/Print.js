import React, { useContext } from 'react';
import { ToastAndroid } from 'react-native'
import {
    BluetoothEscposPrinter,
    BluetoothManager,
} from '@cloudgakkai/react-native-bluetooth-escpos-printer';

const scanBluetooth = () => {
    BluetoothManager.enableBluetooth().then((r) => {
        var paired = [];
        if (r && r.length > 0) {
            for (var i = 0; i < r.length; i++) {
                try {
                    paired.push(JSON.parse(r[i]));
                } catch (e) {
                    //ignore
                }
            }
            connectBluetooth(paired[0].address);
        } else {
            alert(`Please connect to bluetooth printer, and then restart this apps !`);
        }
    }, (err) => {
        alert(err)
    });
}

const connectBluetooth = (address) => {
    BluetoothManager.connect(address)
        .then((s) => {
            console.log(s)
        }, (e) => {
            console.log(e)
        })
}

export const printOrder = async (dateNow, dataLogin, totalPay, dataOrder, dataOrderDetail, dataOrderPayment, props, isTaxppn, isNPWP) => {
    try {
        await BluetoothEscposPrinter.printerInit();
        await BluetoothEscposPrinter.printerLeftSpace(0);

        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
        await BluetoothEscposPrinter.printText(`TOKO Async\r\n`, { widthtimes: 1, heigthtimes: 1, fonttype: 1, });
        await BluetoothEscposPrinter.printText(`Jl Pejaten Raya No. 9C Jakarta Selatan\r\n`, {});
        if(isNPWP){
            await BluetoothEscposPrinter.printText(`NPWP: 1234567890123456\r\n`, {});
        }
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
        await BluetoothEscposPrinter.printText(`${dateNow}\r\n`, {});
        await BluetoothEscposPrinter.setBlob(0);
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.LEFT],
            [`POS: cashier`, `Cashier: ${dataLogin.userid}`],
            {},
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.LEFT],
            [`Invoice #${dataOrder.orders_number}`, `Server: ${dataLogin.userid}`],
            {},
        );
        await BluetoothEscposPrinter.printText(`-------------------------------\r\n`, {});
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
        await BluetoothEscposPrinter.setBlob(0);
        await BluetoothEscposPrinter.printText(`ORDER ITEM\r\n`, { fontWeight: 'bold', fonttype: 1 });
        dataOrderDetail.map(async (item, index) => {
            await BluetoothEscposPrinter.printColumn(
                [20, 12],
                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.LEFT],
                [`${item.qty} ${item.title}`, `: Rp ${item.price}`],
                {},
            );
        })
        await BluetoothEscposPrinter.printText(`-------------------------------\r\n`, {});
        await BluetoothEscposPrinter.setBlob(1)
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Subtotal", `Rp ${dataOrder.subtotal}`],
            {
                fonttype: 0,
            },
        );
        if(isTaxppn){
            await BluetoothEscposPrinter.printColumn(
                [20, 12],
                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                ["Tax (10% included)", `Rp ${dataOrder.subtotal*10/100}`],
                {
                    fonttype: 0,
                },
            );
        }
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["TOTAL", `Rp ${dataOrder.total_price}`],
            {
                fonttype: 0,
            },
        );
        dataOrderPayment.map( async (item, index) => {
            if(item.CARD_NO != null) {
                await BluetoothEscposPrinter.printColumn(
                    [20, 12],
                    [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                    [`Nomor Member`, `${parseInt(item.CARD_NO)}`],
                    {
                        fonttype: 0,
                    },
                );
            }
            await BluetoothEscposPrinter.printColumn(
                [20, 12],
                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                [`${item.PAY_CD}`, `Rp ${parseInt(item.PAY_AMT)}`],
                {
                    fonttype: 0,
                },
            );
        })
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Change", `Rp ${totalPay - dataOrder.total_price}`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.setBlob(0)
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
        await BluetoothEscposPrinter.printText("\r\n", {});
        await BluetoothEscposPrinter.printText("*** Thank You For Order And See You Soon ***\r\n", {});
        await BluetoothEscposPrinter.printText("\r\n\r\n\r\n", {});

        ToastAndroid.show("Struk berhasil dicetak!", ToastAndroid.LONG);
        props.navigation.goBack();
    } catch (e) {
        ToastAndroid.show(e.message || "ERROR", ToastAndroid.LONG)
    }
}

export const printShiftClosing = async () => {
    scanBluetooth();
    try {
        await BluetoothEscposPrinter.printerInit();
        await BluetoothEscposPrinter.printerLeftSpace(0);

        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
        await BluetoothEscposPrinter.setBlob(0);
        await BluetoothEscposPrinter.printText(`X REPORT\r\n`, {});
        await BluetoothEscposPrinter.printText(`===============================\r\n`, {});
        await BluetoothEscposPrinter.printColumn(
            [12, 20],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Date", `: 30-10-2020`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [12, 20],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Cashier", `: 0001`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [12, 20],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Shift", `: 1`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
        await BluetoothEscposPrinter.setBlob(0);
        await BluetoothEscposPrinter.printText(`**SALES TRANSACTION**`, {});
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
        await BluetoothEscposPrinter.setBlob(0);
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Actual Sales:", `100000`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Exchange Gain:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Sales Refund:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
        await BluetoothEscposPrinter.setBlob(0);
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Gross Sales:", `100000`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Discount:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Promo:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Tax:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printText(`-------------------------------\r\n`, {});
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Net Sales:", `100000`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printText("\r\n", {});
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
        await BluetoothEscposPrinter.setBlob(0);
        await BluetoothEscposPrinter.printText(`**COLLECTION BREAKDOWN**\r\n`, {});
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
        await BluetoothEscposPrinter.setBlob(0);
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["TOTAL CASH:", `100000`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["TOTAL CARDS:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["TOTAL DEBIT:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["TOTAL VOUCHER:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["TOTAL COLLECTION:", `100000`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["CASH Declare:", `100000`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printText(`-------------------------------\r\n`, {});
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Variance in Collection", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
        await BluetoothEscposPrinter.setBlob(0);
        await BluetoothEscposPrinter.printText(`**CONTROL TOTAL**\r\n`, {});
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
        await BluetoothEscposPrinter.setBlob(0);
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Float Money:", `100000`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Cash Back:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Item Void:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Trans Void:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Abort Sales:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["No Sales:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["1st Receipt No", `****1`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Last Receipt No", `****1`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["No of Receipt Used", `1`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.setBlob(0)
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
        await BluetoothEscposPrinter.printText("\r\n", {});
        await BluetoothEscposPrinter.printText("*** END ***\r\n", {});
        await BluetoothEscposPrinter.printText("\r\n\r\n", {});
        ToastAndroid.show(`Print Successfully !`, ToastAndroid.LONG)
    } catch (e) {
        ToastAndroid.show(e.message || "ERROR", ToastAndroid.LONG)
    }
}

export const printDayEndClosing = async () => {
    scanBluetooth();
    try {
        await BluetoothEscposPrinter.printerInit();
        await BluetoothEscposPrinter.printerLeftSpace(0);

        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
        await BluetoothEscposPrinter.setBlob(0);
        await BluetoothEscposPrinter.printText(`X REPORT\r\n`, {});
        await BluetoothEscposPrinter.printText(`===============================\r\n`, {});
        await BluetoothEscposPrinter.printColumn(
            [12, 20],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Date", `: 30-10-2020`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [12, 20],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Cashier", `: 0001`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [12, 20],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Shift", `: 1`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
        await BluetoothEscposPrinter.setBlob(0);
        await BluetoothEscposPrinter.printText(`**SALES TRANSACTION**\r\n`, {});
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
        await BluetoothEscposPrinter.setBlob(0);
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Actual Sales:", `100000`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Exchange Gain:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Sales Refund:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
        await BluetoothEscposPrinter.setBlob(0);
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Gross Sales:", `100000`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Discount:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Promo:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Tax:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printText(`-------------------------------\r\n`, {});
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Net Sales:", `100000`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printText("\r\n", {});
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
        await BluetoothEscposPrinter.setBlob(0);
        await BluetoothEscposPrinter.printText(`**COLLECTION BREAKDOWN**\r\n`, {});
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
        await BluetoothEscposPrinter.setBlob(0);
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["TOTAL CASH:", `100000`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["TOTAL CARDS:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["TOTAL DEBIT:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["TOTAL VOUCHER:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["TOTAL COLLECTION:", `100000`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["CASH Declare:", `100000`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printText(`-------------------------------\r\n`, {});
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Variance in Collection", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
        await BluetoothEscposPrinter.setBlob(0);
        await BluetoothEscposPrinter.printText(`**CONTROL TOTAL**`, {});
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
        await BluetoothEscposPrinter.setBlob(0);
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Float Money:", `100000`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Cash Back:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Item Void:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Trans Void:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Abort Sales:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["No Sales:", `0`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["1st Receipt No", `****1`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["Last Receipt No", `****1`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.printColumn(
            [20, 12],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["No of Receipt Used", `1`],
            {
                fonttype: 0,
            },
        );
        await BluetoothEscposPrinter.setBlob(0)
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
        await BluetoothEscposPrinter.printText("\r\n", {});
        await BluetoothEscposPrinter.printText("*** END ***\r\n", {});
        await BluetoothEscposPrinter.printText("\r\n\r\n", {});
        ToastAndroid.show(`Print Successfully !`, ToastAndroid.LONG)
    } catch (e) {
        ToastAndroid.show(e.message || "ERROR", ToastAndroid.LONG)
    }
}