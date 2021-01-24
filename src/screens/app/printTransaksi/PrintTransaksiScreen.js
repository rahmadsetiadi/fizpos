import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage';
import { Card, Paragraph, Title } from 'react-native-paper';
import Constant from '../../../configs/constants';
import APIKit from '../../../configs/ApiKit';
import {
    printOrder
} from '../../../service/Print';
import {
    BluetoothEscposPrinter,
    BluetoothManager,
    BluetoothTscPrinter
} from '@cloudgakkai/react-native-bluetooth-escpos-printer';
import styles from './styles';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import {
    DeviceEventEmitter,
    TouchableOpacity,
    ToastAndroid,
    ScrollView,
    Image,
    View,
    Text
} from 'react-native';
import {
    Divider
} from 'react-native-paper';

const PrintTransaksi = (props) => {
    const [availableDevices, setAvailableDevices] = useState([])
    const [selectedDevice, setSelectedDevice] = useState([])
    const [bluetooth, setBluetooth] = useState(false)
    const [printerConnect, setPrinterConnect] = useState(false)
    const [dataOrder, setDataOrder] = useState([])
    const [dataOrderDetail, setDataOrderDetail] = useState([])
    const [dataOrderPayment, setDataOrderPayment] = useState([])
    const [totalPay, setTotalPay] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [dataLogin, setDataLogin] = useState([])
    const [dateNow, setDateNow] = useState('')
    const [isTaxppn, setIsTaxppn] = useState(false)
    const [isNPWP, setIsNPWP] = useState(false)

    let _listeners = [];

    useEffect(() => {
        getOrder();
        getDataLogin();
        getSettings();
        BluetoothManager.isBluetoothEnabled().then((enabled) => {
            setBluetooth(enabled)
            scanBluetooth();
        }, (err) => {
            setBluetooth(false)
            alert('Harap aktifkan Bluetooth!')
        });

        _listeners.push(DeviceEventEmitter.addListener(
            BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, (rsp) => {
                _deviceAlreadPaired(rsp)
            }));
        _listeners.push(DeviceEventEmitter.addListener(
            BluetoothManager.EVENT_DEVICE_FOUND, (rsp) => {
                _deviceFoundEvent(rsp)
            }));
        _listeners.push(DeviceEventEmitter.addListener(
            BluetoothManager.EVENT_CONNECTION_LOST, () => {

            }
        ));
        _listeners.push(DeviceEventEmitter.addListener(
            BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT, () => {
                ToastAndroid.show("Device Not Support Bluetooth !", ToastAndroid.LONG);
            }
        ))
        return () => {
            setAvailableDevices([]);
            setSelectedDevice([]);
            setDataOrder([]);
            setDataOrderDetail([]);
            setDataOrderPayment([]);
            setDataLogin([]);
            setTotalPay(0);
            setBluetooth(false);
            setDateNow('');
        }
    }, [])

    const _deviceAlreadPaired = (rsp) => {
        let ds = null;
        if (typeof (rsp.devices) == 'object') {
            ds = rsp.devices;
        } else {
            try {
                ds = JSON.parse(rsp.devices);
            } catch (e) {
            }
        }
        if (ds && ds.length) {
            let pared = selectedDevice;
            pared = pared.concat(ds || []);
            setSelectedDevice(pared);
        }
    }

    const _deviceFoundEvent = (rsp) => {//alert(JSON.stringify(rsp))
        let r = null;
        try {
            if (typeof (rsp.device) == "object") {
                r = rsp.device;
            } else {
                r = JSON.parse(rsp.device);
            }
        } catch (e) {//alert(e.message);
            //ignore
        }
        //alert('f')
        if (r) {
            let found = availableDevices || [];
            if (found.findIndex) {
                let duplicated = found.findIndex(function (x) {
                    return x.address == r.address
                });
                //CHECK DEPLICATED HERE...
                if (duplicated == -1) {
                    found.push(r);
                    setAvailableDevices(found)
                }
            }
        }
    }

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
                alert(`Harap sambungkan ke printer bluetooth, lalu mulai ulang aplikasi ini !`);
            }
        }, (err) => {
            alert(err)
        });
    }

    const connectBluetooth = (address) => {
        BluetoothManager.connect(address)
            .then((s) => {
                console.log(s)
                setPrinterConnect(true);
            }, (e) => {
                alert(`Opss.. gagal menyambungkan ke printer bluetooth !`);
                setPrinterConnect(false);
                console.log(e)
            })
    }

    const getDataLogin = async () => {
        let val = await AsyncStorage.getItem(Constant.loginFizpos);
        if (val != null || val != undefined) {
            let parsed = JSON.parse(val);
            setDataLogin(parsed);
        } else {
            alert('Opss.. mohon login terlebih dahulu !');
        }
    }

    const getSettings = async () => {
        let status = await AsyncStorage.getItem(Constant.settings);
        let parsed = JSON.parse(status);
        setIsTaxppn(parsed.statusTaxppn);
        setIsNPWP(parsed.showNPWP);
    }

    const getOrder = () => {
        var date = new Date();
        var format = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
        setIsLoading(true)
        APIKit.get(`order/order_by_id/${props.route.params.idOrder}?${Constant.apiKey}`)
            .then((res) => {
                setDateNow(format);
                setDataOrder(res.data.data)
                getOrderDetail()
            }, err => {
                setIsLoading(false)
                console.log(err);
            });
    }

    const getOrderDetail = () => {
        APIKit.get(`order/orderdetail_by_id/${props.route.params.idOrder}?${Constant.apiKey}`)
            .then((res) => {
                setDataOrderDetail(res.data.data)
                getOrderPayment()
            }, err => {
                setIsLoading(false)
                console.log(err);
            });
    }

    const getOrderPayment = () => {
        APIKit.get(`order/orderpayment_by_id/${props.route.params.idOrder}?${Constant.apiKey}`)
            .then((res) => {
                let tot_pay = 0;
                res.data.data.map((item, index) => {
                    tot_pay += parseInt(item.PAY_AMT);
                })
                setTotalPay(tot_pay)
                setDataOrderPayment(res.data.data)
                setIsLoading(false)
            }, err => {
                setIsLoading(false)
                console.log(err);
            });
    }

    const _print = async () => {
        printOrder(dateNow, dataLogin, totalPay, dataOrder, dataOrderDetail, dataOrderPayment, props, isTaxppn, isNPWP)
        // console.log('print')
    }

    return (
        <View style={{ flex: 1 }}>
            <Spinner visible={isLoading} />

            <ScrollView showVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    {(!isLoading) ?
                        <Card style={{ marginTop: hp('4%') }}>
                            <Card.Content>
                                <Title style={{ textAlign: 'center' }}>TOKO Async</Title>
                                <Paragraph style={{...styles.textBiasa, textAlign: 'center'}}>Jl Pejaten Raya No. 9C Jakarta Selatan</Paragraph>
                                {(isNPWP) ?
                                    <Paragraph style={{...styles.textBiasa, textAlign: 'center'}}>NPWP: 1234567890123456</Paragraph>
                                :
                                    null
                                }
                                <View style={{ marginTop: hp('2%') }}>
                                    <Text style={styles.textBiasa}>{dateNow}</Text>
                                    <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                        <View style={{ flex: 0.7 }}>
                                            <Text style={styles.textBiasa}>POS: cashier</Text>
                                        </View>
                                        <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                                            <Text style={styles.textBiasa}>{`Cashier: ${dataLogin.userid}`}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                        <View style={{ flex: 0.7 }}>
                                            <Text style={styles.textBiasa}>{`Invoice #${dataOrder.orders_number}`}</Text>
                                        </View>
                                        <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                                            <Text style={styles.textBiasa}>{`Server: ${dataLogin.userid}`}</Text>
                                        </View>
                                    </View>
                                    <Divider style={{ marginVertical: 10 }} />
                                    <Title style={{ ...styles.textJudul, fontWeight: 'bold' }}>ORDER ITEM</Title>
                                    {dataOrderDetail.map((item, index) =>
                                        <View style={{ flexDirection: 'row', marginTop: hp('1%') }} key={index}>
                                            <View style={{ flex: 0.1 }}>
                                                <Text style={styles.textBiasa}>{item.qty}</Text>
                                            </View>
                                            <View style={{ flex: 0.6 }}>
                                                <Text style={styles.textBiasa}>{item.title}</Text>
                                            </View>
                                            <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                                                <Text style={styles.textBiasa}>{`: Rp ${item.price}`}</Text>
                                            </View>
                                        </View>
                                    )}
                                    <Divider style={{ marginVertical: 10 }} />
                                    <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                        <View style={{ flex: 0.7 }}>
                                            <Text style={styles.textBiasa}>Subtotal</Text>
                                        </View>
                                        <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                                            <Text style={styles.textBiasa}>{`Rp ${dataOrder.subtotal}`}</Text>
                                        </View>
                                    </View>
                                    {(isTaxppn) ?
                                        <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                            <View style={{ flex: 0.7 }}>
                                                <Text style={styles.textBiasa}>Tax (10% included)</Text>
                                            </View>
                                            <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                                                <Text style={styles.textBiasa}>{`Rp ${dataOrder.subtotal * 10 / 100}`}</Text>
                                            </View>
                                        </View>
                                        :
                                        null
                                    }
                                    <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                        <View style={{ flex: 0.7 }}>
                                            <Title style={{ ...styles.textJudul, fontWeight: 'bold' }}>Total</Title>
                                        </View>
                                        <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                                            <Text style={{ ...styles.textBiasa, fontWeight: 'bold' }}>{`Rp ${dataOrder.total_price}`}</Text>
                                        </View>
                                    </View>
                                    {dataOrderPayment.map((item, index) =>
                                        <View key={index}>
                                            {(item.CARD_NO != null) ?
                                                <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                                    <View style={{ flex: 0.7 }}>
                                                        <Text style={styles.textBiasa}>Nomor Member</Text>
                                                    </View>
                                                    <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                                                        <Text style={styles.textBiasa}>{parseInt(item.CARD_NO)}</Text>
                                                    </View>
                                                </View>
                                            :
                                                null
                                            }
                                            <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                                <View style={{ flex: 0.7 }}>
                                                    <Text style={styles.textBiasa}>{item.PAY_CD}</Text>
                                                </View>
                                                <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                                                    <Text style={styles.textBiasa}>{`Rp ${parseInt(item.PAY_AMT)}`}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                    <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                        <View style={{ flex: 0.7 }}>
                                            <Text style={styles.textBiasa}>Change</Text>
                                        </View>
                                        <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                                            <Text style={styles.textBiasa}>{`Rp ${totalPay - dataOrder.total_price}`}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ alignItems: 'center', marginTop: hp('5%') }}>
                                    <Text>*** Thank You For Order And See You Soon ***</Text>
                                </View>
                            </Card.Content>
                        </Card>
                        :
                        null
                    }
                </View>
            </ScrollView>
            <View style={{ position: 'absolute', bottom: 0, flexDirection: 'row' }}>
                <View style={{ flex: 0.7 }}>
                    <TouchableOpacity
                        style={styles.btnCetak}
                        activeOpacity={0.9}
                        onPress={() => _print()}
                        disabled={!printerConnect}
                    >
                        <Text style={{ textAlign: 'center', color: '#fff' }}>Print</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 0.3 }}>
                    <TouchableOpacity
                        style={styles.btnReconnect}
                        activeOpacity={0.9}
                        onPress={() => scanBluetooth()}
                    >
                        <Text style={{ textAlign: 'center', color: '#fff' }}>Re-Connect Printer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default PrintTransaksi;