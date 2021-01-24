import React, { useState, useEffect, useCallback, useContext } from 'react';
import APIKit from '../../../configs/ApiKit';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import {
    cartAction,
    shiftClosingAction,
    dayEndClosingAction
} from '../../../actions/TransaksiAction';
import QRCodeScanner from 'react-native-qrcode-scanner';
import NumberFormat from 'react-number-format';
import Spinner from 'react-native-loading-spinner-overlay';
import GlobalFont from 'react-native-global-font';
import Constant from '../../../configs/constants';
import { AuthContext } from '../../../configs/authContext';
import {
    printShiftClosing,
    printDayEndClosing
} from '../../../service/Print';
import styles from './styles';
import { Picker } from '@react-native-community/picker';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import {
    RefreshControl,
    View,
    TouchableOpacity,
    ScrollView,
    Text,
    FlatList,
    Modal,
    TextInput,
    Alert,
    ToastAndroid,
    Keyboard
} from 'react-native';
import {
    Title,
    List,
    Card,
    Paragraph,
    Divider,
    Badge,
} from 'react-native-paper';
import {
    SearchBar,
} from 'react-native-elements';

const Home = (props) => {
    const { logout } = useContext(AuthContext);
    const [visibleKeyboard, setVisibleKeyboard] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // variable modal first
    const [modalFirst, setModalFirst] = useState(false);
    const [floatMoney, setFloatMoney] = useState(100000);
    const [shift, setShift] = useState('');

    // variable part kategori
    const [dataKategori, setDataKategori] = useState([]);
    const [kategori, setKategori] = useState(null);
    const [modalCariProduk, setModalCariProduk] = useState(false);
    const [showScanQRCode, setShowScanQRCode] = useState(false);
    const [dataScan, setDataScan] = useState(null);
    const [cariProduk, setCariProduk] = useState(null);

    // variable part list
    const [dataProduk, setDataProduk] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    // variable part cart 
    const [dataPartCart, setDataPartCart] = useState([]);
    const [dataPaymentType, setDataPaymentType] = useState([]);
    const [totalBayar, setTotalBayar] = useState(0);
    const [modalSimpanSelectProduk, setModalSimpanSelectProduk] = useState(false);
    const [modalMetodeBayar, setModalMetodeBayar] = useState(false);
    const [modalInputNominal, setModalInputNominal] = useState(false);
    const [pickMetodeBayar, setPickMetodeBayar] = useState(null);
    const [nominalBayar, setNominalBayar] = useState(0);
    const [typeNominalBayar, setTypeNominalBayar] = useState(null);
    const [arrMetodeBayar, setArrMetodeBayar] = useState([]);
    const [namaCustomer, setNamaCustomer] = useState(null);
    const [noMemberCard, setNoMemberCard] = useState(0);
    const [scNominal, setScNominal] = useState(0);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            callDataSelectToPartCart();
            callDataNMB();
        });
        callDataSelectToPartCart();
        callDataNMB();
        cekSettingFirstLogin();
        let fontName = Constant.fontFamily;
        GlobalFont.applyGlobal(fontName);
        const keyboardShow = Keyboard.addListener('keyboardDidShow', () => setVisibleKeyboard(true));
        const keyboardHide = Keyboard.addListener('keyboardDidHide', () => setVisibleKeyboard(false));
        return () => {
            // kategori
            setDataKategori([]);
            setKategori(null);
            setDataScan(null);
            setCariProduk(null);
            // list product
            setDataProduk([]);
            // cart
            setDataPartCart([]);
            setDataPaymentType([]);
            setTotalBayar(0);
            unsubscribe;
            keyboardShow.remove();
            keyboardHide.remove();
        }
    }, []);

    const toast = (pesan) => {
        ToastAndroid.showWithGravity(
            pesan,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );
    }

    // ----- fungsi modal first -----
    const cekSettingFirstLogin = async () => {
        let val = await AsyncStorage.getItem(Constant.settingFirstLogin);
        if (val == null || val == undefined) {
            setModalFirst(true);
        } else {
            getPaymentType();
            getKategori();
        }
    }

    const saveConf = async () => {
        if (floatMoney == 0 || shift == '') {
            toast(`Data harus diisi semua !`);
        } else {
            let data = {
                'floatMoney': floatMoney,
                'shift': shift
            }
            try {
                await AsyncStorage.setItem(Constant.settingFirstLogin, JSON.stringify(data));
                setModalFirst(!modalFirst);
                cekSettingFirstLogin();
            } catch (e) {
                console.log(e);
            }
        }
    }

    const funcPrintShiftClosing = () => {
        printShiftClosing();
        props.shiftClosingAction(false);
        logout();
    }

    const funcPrintDayEndClosing = () => {
        printDayEndClosing();
        props.dayEndClosingAction(false);
        logout();
    }

    // ----- fungsi part kategori -----
    const getKategori = () => {
        setIsLoading(true);
        APIKit.get(`department?${Constant.apiKey}`, {})
            .then((res) => {
                // setIsLoading(false);
                setDataKategori(res.data.data);
                setKategori(res.data.data[0].DeptDesc);
                getProduk(res.data.data[0].DeptCode);
            }, err => {
                setIsLoading(false);
                console.log(err);
            });
    }

    const openScanQR = () => {
        setShowScanQRCode(true);
    }

    const onScan = (e) => {
        setDataScan(e.data);
        setShowScanQRCode(false);
        Alert.alert('hasil scan = ', e.data);
    }

    const selectKategori = (item) => {
        setIsLoading(true);
        APIKit.get(`product/bykategori/${item.DeptCode}?${Constant.apiKey}`, {})
            .then((res) => {
                setIsLoading(false);
                setKategori(item.DeptDesc);
                setDataProduk(res.data.data);
            }, err => {
                setIsLoading(false);
                console.log(err);
            });
    }
    // ----- fungsi part kategori -----

    // ----- fungsi untuk part list -----
    const getProduk = (deptcode) => {
        APIKit.get(`product/bykategori/${deptcode}?${Constant.apiKey}`, {})
            .then((res) => {
                setIsLoading(false);
                setDataProduk(res.data.data);
            }, err => {
                setIsLoading(false);
                console.log(err);
            });
    }

    const selectItem = async (item) => {
        let data = {
            'id': item.id,
            'category_id': item.category_id,
            'prodcode': item.prodcode,
            'title': item.title,
            'price': +item.price,
            'stock': +item.stock,
            'weight': +item.weight,
            'description': item.description,
            'qty': 1,
            'discount': +item.discount,
            'DeptCode': item.DeptCode
        };
        try {
            let val = await AsyncStorage.getItem(Constant.selectProduk);
            let selects = JSON.parse(val);
            if (selects === null || selects.length === 0) {
                selects = [data];
                await AsyncStorage.setItem(Constant.selectProduk, JSON.stringify(selects));
            } else {
                selects.map((itemMap, index) => {
                    if (itemMap.id == item.id) {
                        incQtyProduk(itemMap, index);
                    }
                    selects.push(data);
                })
                await AsyncStorage.setItem(Constant.selectProduk, JSON.stringify(selects));
            }
            callDataSelectToPartCart();
        } catch (e) {
            console.log(e);
        }
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        APIKit.get(`product/bykategori/${kategori}?${Constant.apiKey}`, {})
            .then((res) => {
                setRefreshing(false);
                setDataProduk(res.data.data);
            }, err => {
                setRefreshing(false);
                console.log(err);
            });
    }, []);
    // ----- fungsi untuk part list -----

    // ----- fungsi untuk part cart -----
    const getPaymentType = () => {
        APIKit.get(`paymenttype?${Constant.apiKey}`, {})
            .then((res) => {
                setDataPaymentType(res.data.data);
            }, err => {
                console.log(err);
            });
    }

    const callDataSelectToPartCart = async () => {
        let select = await AsyncStorage.getItem(Constant.selectProduk);
        let parsed = JSON.parse(select);
        if (parsed === null || parsed.length === 0) {
            setDataPartCart([]);
            setTotalBayar(0);
        } else {
            let tot_diskon = 0;
            let tot_bayar = 0;
            parsed.map((item) => {
                tot_diskon += item.price * item.qty * item.discount / 100;
                tot_bayar += item.price * item.qty;
            })
            let grand_tot = tot_bayar - tot_diskon;
            setTotalBayar(grand_tot);
            setNominalBayar(grand_tot);
            setDataPartCart(parsed);
        }
    }

    const decQtyProduk = (item, index) => {
        if (item.qty === 1) {
            return;
        } else {
            item.qty--;
            item.total = item.price * item.qty;
            saveDataSelectProduk(item, index);
        }
    }

    const incQtyProduk = (item, index) => {
        item.qty++;
        item.total = item.price * item.qty;
        saveDataSelectProduk(item, index);
    }

    const hapusQtyProduk = async (index) => {
        if (index > -1) {
            let val = await AsyncStorage.getItem(Constant.selectProduk);
            let select = JSON.parse(val);
            select.splice(index, 1);
            await AsyncStorage.setItem(Constant.selectProduk, JSON.stringify(select));
            setUlang();
        }
    }

    const saveDataSelectProduk = async (item, index) => {
        const val = await AsyncStorage.getItem(Constant.selectProduk);
        let selects = JSON.parse(val);
        if (selects == null || selects.length == 0) {
            selects = [item];
        } else {
            try {
                selects.find(v => v.id == item.id).qty = item.qty;
                selects.find(v => v.id == item.id).total = item.total;
            } catch (e) {
                for (var i = 0; i < selects.length; i++) {
                    selects.push(item);
                    break;
                }
                console.log(e);
            }
        }
        await AsyncStorage.setItem(Constant.selectProduk, JSON.stringify(selects));
        setUlang();
    }

    const setUlang = async () => {
        const val = await AsyncStorage.getItem(Constant.selectProduk);
        if (val == null) {
            setTotalBayar(0);
            setDataPartCart([]);
        } else {
            let selects = JSON.parse(val);
            if (selects == null || selects.length == 0) {
                setTotalBayar(0);
                setDataPartCart([]);
            } else {
                let tot_diskon = 0;
                let tot_bayar = 0;
                selects.map((item) => {
                    tot_diskon += item.price * item.qty * item.discount / 100;
                    tot_bayar += item.price * item.qty;
                })
                let grand_tot = tot_bayar - tot_diskon;
                setTotalBayar(grand_tot);
                setNominalBayar(grand_tot);
            }
            setDataPartCart(selects);
        }
    }

    const resetCart = () => {
        Alert.alert(
            "Hey",
            "Anda ingin menghapus semua data ini?",
            [
                {
                    text: "Tidak",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Ya",
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem(Constant.selectProduk);
                            setArrMetodeBayar([]);
                            setUlang();
                        } catch (e) {
                            console.log(e)
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    }

    const toMetodeBayar = async () => {
        if (totalBayar > 0) {
            setModalMetodeBayar(!modalMetodeBayar);
        } else {
            return;
        }
    }

    const showModalSimpan = async () => {
        try {
            let val = await AsyncStorage.getItem(Constant.selectProduk);
            if (val != null) {
                setModalSimpanSelectProduk(true);
            } else {
                toast(`Anda belum memilih produk !`);
            }
        } catch (e) {
            console.log(e)
        }
    }

    const simpanSelectProduk = async () => {
        if (namaCustomer == null || namaCustomer == '') {
            toast(`Nama Customer belum diisi.`);
        } else {
            var randomNumber = Math.random() * 1000;
            let sp = await AsyncStorage.getItem(Constant.selectProduk);
            let data_sp = JSON.parse(sp);
            let data = {
                'id': randomNumber.toFixed(),
                'namaCustomer': namaCustomer,
                'data': data_sp
            };
            let ssp = await AsyncStorage.getItem(Constant.simpanSelectProduk);
            let data_ssp = JSON.parse(ssp);
            if (data_ssp === null || data_ssp.length === 0) {
                data_ssp = [data];
                await AsyncStorage.setItem(Constant.simpanSelectProduk, JSON.stringify(data_ssp));
            } else {
                for (let i = 0; i < data_ssp.length; i++) {
                    data_ssp.push(data);
                    break;
                }
                await AsyncStorage.setItem(Constant.simpanSelectProduk, JSON.stringify(data_ssp));
            }
            const val_redux = await AsyncStorage.getItem(Constant.simpanSelectProduk);
            let parsedd = JSON.parse(val_redux);
            props.cartAction(parsedd.length);
            await AsyncStorage.removeItem(Constant.selectProduk);
            setNamaCustomer(null);
            setModalSimpanSelectProduk(false);
            setArrMetodeBayar([]);
            setUlang();
        }
    }

    const callDataNMB = async () => {
        let nmb = await AsyncStorage.getItem(Constant.metodeNominalBayar);
        let parsed = JSON.parse(nmb);
        if (parsed === null || parsed.length === 0) {
            setArrMetodeBayar([]);
        } else {
            setArrMetodeBayar(parsed);
        }
    }

    const funcSetMetodeBayar = async (pay_cd) => {
        var randomNumber = Math.random() * 1000;
        let mb;
        if (pay_cd == null) {
            mb = {
                'id': randomNumber.toFixed(),
                'pay_cd': pickMetodeBayar,
                'pay_amt': nominalBayar,
                'card_no': noMemberCard
            }
        } else {
            mb = {
                'id': randomNumber.toFixed(),
                'pay_cd': pay_cd,
                'pay_amt': scNominal,
                'card_no': null
            }
        }
        let val = await AsyncStorage.getItem(Constant.metodeNominalBayar);
        let parsed = JSON.parse(val);
        if (parsed == null || parsed.length == 0 || parsed == undefined) {
            parsed = [mb];
            await AsyncStorage.setItem(Constant.metodeNominalBayar, JSON.stringify(parsed));
        } else {
            for (let i = 0; i < parsed.length; i++) {
                parsed.push(mb);
                break;
            }
            await AsyncStorage.setItem(Constant.metodeNominalBayar, JSON.stringify(parsed));
        }
        // if (arrMetodeBayar.length == 0 || arrMetodeBayar == undefined || arrMetodeBayar == null) {
        //     setArrMetodeBayar([mb]);
        // } else {
        //     let val = arrMetodeBayar;
        //     for (let i = 0; i < val.length; i++) {
        //         val.push(mb);
        //         break;
        //     }
        //     setArrMetodeBayar(val);
        // }
        setNominalBayar(0);
        setScNominal(0);
        setTypeNominalBayar(null);
        setModalInputNominal(false);
        setPickMetodeBayar(null);
        setUlangMetodeBayar();
    }

    const funcHapusNominalBayar = async (index) => {
        if (index > -1) {
            let val = await AsyncStorage.getItem(Constant.metodeNominalBayar);
            let parsed = JSON.parse(val);
            parsed.splice(index, 1);
            await AsyncStorage.setItem(Constant.metodeNominalBayar, JSON.stringify(parsed));
            setUlangMetodeBayar();
        }
        // setArrMetodeBayar(item => item.filter((img, i) => i !== index));
    }

    const setUlangMetodeBayar = async () => {
        const val = await AsyncStorage.getItem(Constant.metodeNominalBayar);
        if (val == null) {
            setArrMetodeBayar([]);
        } else {
            let parsed = JSON.parse(val);
            if (parsed == null || parsed.length == 0) {
                setArrMetodeBayar([]);
            } else {
                setArrMetodeBayar(parsed)
            }
        }
    }

    const orderDone = () => {
        let items = [];
        dataPartCart.map((item, index) => {
            let dataLoop = {
                'prodcode': item.prodcode,
                'qty': item.qty,
                'price': item.price
            }
            items.push(dataLoop);
        })
        let data = {
            'userid': '0001',
            'subtotal': totalBayar,
            'items': items,
            'payment': arrMetodeBayar
        }
        // props.navigation.navigate('HomeStack', { screen: 'PrintTransaksi', params: { idOrder: 25460 } })
        // return;
        setIsLoading(true);
        APIKit.post(`saveorder`, data, { headers: Constant.headers })
            .then((res) => {
                setIsLoading(false);
                resetAllSelectProduct(res.data.data);
            }, err => {
                toast(`Opss.. something's wrong, please contact administrator`);
                setIsLoading(false);
                console.log(err);
            });
    }

    const resetAllSelectProduct = async (id_order) => {
        props.navigation.navigate('HomeStack', { screen: 'PrintTransaksi', params: { idOrder: id_order } })
        await AsyncStorage.removeItem(Constant.selectProduk);
        await AsyncStorage.removeItem(Constant.metodeNominalBayar);
        setArrMetodeBayar([]);
    }
    // ----- fungsi untuk part cart -----

    if (showScanQRCode) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <QRCodeScanner
                    containerStyle={{
                        backgroundColor: '#fff',
                    }}
                    onRead={(data) => onScan(data)}
                    reactivate={true}
                    permissionDialogMessage="Need Permission To Access Camera"
                    reactivateTimeout={10}
                    showMarker={true}
                    markerStyle={{
                        borderColor: '#fff',
                        borderRadius: 10,
                    }}
                />
                <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
                    <TouchableOpacity
                        onPress={() => { setShowScanQRCode(false) }}
                        style={styles.closeScan}
                    >
                        <Text style={{ ...styles.textBiasa, color: Constant.colorTextPrimary }}>TUTUP</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    } else {
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                {/* ----- modal first ----- */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalFirst}
                    onRequestClose={() => {
                        setModalFirst(true);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text>Float Money</Text>
                            <View style={styles.containerInputGeneral}>
                                <TextInput
                                    style={[styles.textInputNamaCustomer, styles.textBiasa]}
                                    placeholder="Nominal..."
                                    value={floatMoney.toString()}
                                    keyboardType={'numeric'}
                                    onChangeText={(text) => setFloatMoney(+text)}
                                />
                            </View>
                            <View style={styles.containerInputGeneral}>
                                <Picker
                                    selectedValue={shift}
                                    placeholder="Shift"
                                    style={[styles.textInputShift, styles.textBiasa]}
                                    onValueChange={(itemValue, itemIndex) => setShift(itemValue)}
                                >
                                    <Picker.Item label="Select Shift" value="" />
                                    <Picker.Item label="Shift 1" value="shift1" />
                                    <Picker.Item label="Shift 2" value="shift2" />
                                    <Picker.Item label="Shift 3" value="shift3" />
                                </Picker>
                            </View>
                            <TouchableOpacity
                                style={{ ...styles.openButton, backgroundColor: Constant.colorPrimary }}
                                onPress={() => {
                                    saveConf();
                                }}
                            >
                                <Text style={[styles.textStyle, styles.textBiasa]}>Ya</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={props.sc}
                    onRequestClose={() => {
                        props.shiftClosingAction(false);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text>Float Money</Text>
                            <View style={styles.containerInputGeneral}>
                                <TextInput
                                    style={[styles.textInputNamaCustomer, styles.textBiasa]}
                                    placeholder="Nominal..."
                                    value={floatMoney.toString()}
                                    keyboardType={'numeric'}
                                    onChangeText={(text) => setFloatMoney(+text)}
                                />
                            </View>
                            <View style={styles.containerInputGeneral}>
                                <Picker
                                    selectedValue={shift}
                                    placeholder="Shift"
                                    style={[styles.textInputShift, styles.textBiasa]}
                                    onValueChange={(itemValue, itemIndex) => setShift(itemValue)}
                                >
                                    <Picker.Item label="Select Shift" value="" />
                                    <Picker.Item label="Shift 1" value="shift1" />
                                    <Picker.Item label="Shift 2" value="shift2" />
                                    <Picker.Item label="Shift 3" value="shift3" />
                                </Picker>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                <TouchableOpacity
                                    style={{ ...styles.openButton, backgroundColor: Constant.colorThird }}
                                    onPress={() => {
                                        props.shiftClosingAction(false);
                                    }}
                                >
                                    <Text style={[styles.textStyle, styles.textBiasa]}>Tidak</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ ...styles.openButton, backgroundColor: Constant.colorPrimary }}
                                    onPress={() => {
                                        funcPrintShiftClosing();
                                    }}
                                >
                                    <Text style={[styles.textStyle, styles.textBiasa]}>Ya</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={props.de}
                    onRequestClose={() => {
                        props.dayEndClosingAction(false);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={{ alignItems: 'center' }}>
                                <Title style={styles.textJudul}>Apakah Anda yakin hari akan berakhir?</Title>
                                <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                    <TouchableOpacity
                                        style={{ ...styles.openButton, backgroundColor: Constant.colorThird }}
                                        onPress={() => {
                                            props.dayEndClosingAction(false);
                                        }}
                                    >
                                        <Text style={[styles.textStyle, styles.textBiasa]}>Tidak</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ ...styles.openButton, backgroundColor: Constant.colorPrimary }}
                                        onPress={() => {
                                            funcPrintDayEndClosing();
                                        }}
                                    >
                                        <Text style={[styles.textStyle, styles.textBiasa]}>Ya</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
                {/* ----- modal first ----- */}

                {/* ----- part kategori ----- */}
                <View style={styles.containerKategori}>
                    <ScrollView>
                        {dataKategori.map((item, index) =>
                            <View key={index}>
                                <List.Item
                                    titleStyle={{ ...styles.textJudul, textTransform: 'capitalize', color: (item.DeptDesc == kategori) ? Constant.colorPrimary : Constant.colorTextSecondary }}
                                    title={item.DeptDesc}
                                    onPress={() => { selectKategori(item) }}
                                />
                                <Divider />
                            </View>
                        )}
                    </ScrollView>
                    {(visibleKeyboard) ?
                        null
                        :
                        <View style={styles.detailKategori}>
                            <TouchableOpacity
                                onPress={() => { setModalCariProduk(true) }}
                                style={styles.btnCariKategori}
                            >
                                <Icon name="search" size={20} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => openScanQR()}
                                style={styles.btnBarcodeKategori}
                            >
                                <Icon name="barcode" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    }
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalCariProduk}
                        onRequestClose={() => {
                            setModalCariProduk(!modalCariProduk);
                            setCariProduk(null);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <SearchBar
                                    containerStyle={{ width: wp('50%') }}
                                    placeholder="Cari nama produk/sku"
                                    value={cariProduk}
                                    platform="ios"
                                    cancelButtonProps={{
                                        color: Constant.colorPrimary
                                    }}
                                    onChangeText={(text) => setCariProduk(text)}
                                />
                                <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                    <TouchableOpacity
                                        style={{ ...styles.openButton, backgroundColor: Constant.colorPrimary }}
                                        onPress={() => {
                                            setModalCariProduk(!modalCariProduk);
                                            setCariProduk(null);
                                        }}
                                    >
                                        <Text style={[styles.textStyle, styles.textBiasa]}>Tutup</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
                {/* ----- part kategori ----- */}

                {/* ----- part list product ----- */}
                <Spinner visible={isLoading} />
                <View style={styles.containerList}>
                    <Title style={{ ...styles.textJudul, textAlign: 'center', textTransform: 'capitalize' }}>{kategori}</Title>
                    <FlatList
                        data={dataProduk}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => { selectItem(item) }}
                                style={{ flex: 1, marginHorizontal: 5, marginVertical: 10 }}
                            >
                                <Card>
                                    <Card.Cover source={{ uri: Constant.url + item.dir + item.photo }} style={{ width: '100%' }} />
                                    <Card.Content>
                                        <Paragraph style={{ ...styles.textBiasa, textAlign: 'center' }}>{item.title}</Paragraph>
                                        <Paragraph style={{ ...styles.textBiasa, textAlign: 'center' }}>
                                            <NumberFormat value={item.price} displayType={'text'} thousandSeparator={true} prefix={'Rp '} renderText={value => <Text>{value}</Text>} />
                                        </Paragraph>
                                    </Card.Content>
                                </Card>
                            </TouchableOpacity>
                        )}
                        numColumns={3}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />
                </View>
                {/* ----- part list product ----- */}

                {/* ----- part cart ----- */}
                <View style={styles.containerCart}>
                    <ScrollView style={{ paddingHorizontal: wp('1%'), paddingVertical: hp('1%') }}>
                        {dataPartCart.length > 0 ?
                            <TouchableOpacity
                                onPress={() => { resetCart() }}
                                style={styles.btnResetCart}
                            >
                                <Text style={{ ...styles.textBiasa, color: Constant.colorTextPrimary }}>Hapus Semua</Text>
                            </TouchableOpacity>
                            :
                            null
                        }
                        {(arrMetodeBayar.length > 0) ?
                            <Title style={{ ...styles.textJudul, fontWeight: 'bold' }}>
                                Metode Bayar
                                </Title>
                            :
                            null
                        }
                        {arrMetodeBayar.map((item, index) =>
                            <View style={{ flexDirection: 'row' }} key={index}>
                                <View style={{ flex: 0.4, alignItems: 'flex-start' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                funcHapusNominalBayar(index);
                                            }}
                                        >
                                            <Icon name="trash" color="red" size={16} />
                                        </TouchableOpacity>
                                        <Paragraph style={{ ...styles.textBiasa, marginLeft: 7 }}>
                                            {item.pay_cd}
                                        </Paragraph>
                                    </View>
                                </View>
                                <View style={{ flex: 0.6, alignItems: 'flex-end' }}>
                                    <Paragraph style={styles.textBiasa}>
                                        <NumberFormat value={item.pay_amt} displayType={'text'} thousandSeparator={true} prefix={'Rp '} renderText={value => <Text>{value}</Text>} />
                                    </Paragraph>
                                </View>
                            </View>
                        )}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 0.5 }}>
                                <Title style={styles.textJudul}>TOTAL</Title>
                            </View>
                            <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                                <Title style={styles.textJudul}>
                                    <NumberFormat value={totalBayar} displayType={'text'} thousandSeparator={true} prefix={'Rp '} renderText={value => <Text>{value}</Text>} />
                                </Title>
                            </View>
                        </View>
                        {dataPartCart.map((item, index) =>
                            <Card key={index} style={styles.cardCart}>
                                <Card.Content>
                                    <View style={{ flexDirection: 'row', marginVertical: 15 }}>
                                        <View style={{ flex: 0.6 }}>
                                            <Text style={styles.textBiasa}>{item.title}</Text>
                                            <Text style={styles.textBiasa}>Diskon</Text>
                                            <View style={{ flexDirection: 'row', marginTop: hp('2%') }}>
                                                <Badge
                                                    style={styles.btnMinusCart}
                                                    onPress={() => { decQtyProduk(item, index) }}
                                                >
                                                    <Icon name="minus" color="#fff" size={16} />
                                                </Badge>
                                                <View style={{ flex: 0.4, alignItems: 'center' }}>
                                                    <Text style={styles.textBiasa}>{item.qty}</Text>
                                                </View>
                                                <Badge
                                                    style={styles.btnPlusCart}
                                                    onPress={() => { incQtyProduk(item, index) }}
                                                >
                                                    <Icon name="plus" color="#fff" size={16} />
                                                </Badge>
                                            </View>
                                        </View>
                                        <View style={{ flex: 0.4 }}>
                                            <Text style={styles.textBiasa}>
                                                <NumberFormat value={item.price * item.qty} displayType={'text'} thousandSeparator={true} prefix={'Rp '} renderText={value => <Text>{value}</Text>} />
                                            </Text>
                                            <Text style={styles.textBiasa}>
                                                <NumberFormat value={item.price * item.qty * item.discount / 100} displayType={'text'} thousandSeparator={true} prefix={'Rp '} renderText={value => <Text>{value}</Text>} />
                                            </Text>
                                            <View style={{ flexDirection: 'row', marginTop: hp('2%') }}>
                                                <Badge
                                                    style={styles.btnHapusCart}
                                                    onPress={() => { hapusQtyProduk(index) }}
                                                >
                                                    <Icon name="trash" color="#fff" size={16} />
                                                </Badge>
                                            </View>
                                        </View>
                                    </View>
                                    {/* <Divider /> */}
                                </Card.Content>
                            </Card>
                        )}
                    </ScrollView>
                    {(visibleKeyboard) ?
                        null
                        :
                        <View style={styles.detailCart}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 0.4, alignItems: 'flex-start' }}>
                                    {/* <Title style={styles.textJudul}>Total</Title> */}
                                    <TouchableOpacity
                                        onPress={() => showModalSimpan()}
                                        style={styles.btnSimpanCart}
                                    >
                                        <Text style={{ ...styles.textBiasa, color: Constant.colorTextPrimary }}>SIMPAN</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 0.6, alignItems: 'flex-end' }}>
                                    {/* <Title style={styles.textJudul}>
                                        <NumberFormat value={totalBayar} displayType={'text'} thousandSeparator={true} prefix={'Rp '} renderText={value => <Text>{value}</Text>} />
                                    </Title> */}
                                    <TouchableOpacity
                                        onPress={() => toMetodeBayar()}
                                        style={styles.btnBayarCart}
                                    >
                                        <Text style={{ ...styles.textBiasa, color: Constant.colorTextPrimary }}>BAYAR</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    orderDone();
                                }}
                                style={styles.btnConfirmCart}
                            >
                                <Text style={{ ...styles.textBiasa, color: Constant.colorTextPrimary }}>SELESAI</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {/* modal btn simpan */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalSimpanSelectProduk}
                        onRequestClose={() => {
                            setModalSimpanSelectProduk(!modalSimpanSelectProduk);
                            setNamaCustomer(null);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <View style={styles.containerInputNamaCustomer}>
                                    <TextInput
                                        style={[styles.textInputNamaCustomer, styles.textBiasa]}
                                        placeholder="Nama costumer..."
                                        value={namaCustomer}
                                        onChangeText={(text) => setNamaCustomer(text)}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                    <TouchableOpacity
                                        style={{ ...styles.openButton, backgroundColor: Constant.colorThird }}
                                        onPress={() => {
                                            setModalSimpanSelectProduk(!modalSimpanSelectProduk);
                                            setNamaCustomer(null);
                                        }}
                                    >
                                        <Text style={[styles.textStyle, styles.textBiasa]}>Tutup</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ ...styles.openButton, backgroundColor: Constant.colorPrimary }}
                                        onPress={() => {
                                            simpanSelectProduk()
                                        }}
                                    >
                                        <Text style={[styles.textStyle, styles.textBiasa]}>Simpan</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    {/* modal btn bayar */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalMetodeBayar}
                        onRequestClose={() => {
                            setModalMetodeBayar(!modalMetodeBayar);
                            setPickMetodeBayar(null);
                            setScNominal(0);
                        }}
                    >
                        <View style={styles.botView}>
                            <View style={{ ...styles.modalView, justifyContent: 'center', alignItems: 'flex-start' }}>
                                <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                                    <TouchableOpacity
                                        style={{ ...styles.btnScNominal, backgroundColor: (scNominal == 5000) ? Constant.colorPrimary : Constant.colorSecondary }}
                                        onPress={() => setScNominal(5000)}
                                    >
                                        <Paragraph style={{ ...styles.textBiasa, color: (scNominal == 5000) ? Constant.colorTextPrimary : Constant.colorTextSecondary }}>Rp 5,000</Paragraph>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ ...styles.btnScNominal, backgroundColor: (scNominal == 10000) ? Constant.colorPrimary : Constant.colorSecondary }}
                                        onPress={() => setScNominal(10000)}
                                    >
                                        <Paragraph style={{ ...styles.textBiasa, color: (scNominal == 10000) ? Constant.colorTextPrimary : Constant.colorTextSecondary }}>Rp 10,000</Paragraph>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ ...styles.btnScNominal, backgroundColor: (scNominal == 20000) ? Constant.colorPrimary : Constant.colorSecondary }}
                                        onPress={() => setScNominal(20000)}
                                    >
                                        <Paragraph style={{ ...styles.textBiasa, color: (scNominal == 20000) ? Constant.colorTextPrimary : Constant.colorTextSecondary }}>Rp 20,000</Paragraph>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ ...styles.btnScNominal, backgroundColor: (scNominal == 50000) ? Constant.colorPrimary : Constant.colorSecondary }}
                                        onPress={() => setScNominal(50000)}
                                    >
                                        <Paragraph style={{ ...styles.textBiasa, color: (scNominal == 50000) ? Constant.colorTextPrimary : Constant.colorTextSecondary }}>Rp 50,000</Paragraph>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ ...styles.btnScNominal, backgroundColor: (scNominal == 100000) ? Constant.colorPrimary : Constant.colorSecondary }}
                                        onPress={() => setScNominal(100000)}
                                    >
                                        <Paragraph style={{ ...styles.textBiasa, color: (scNominal == 100000) ? Constant.colorTextPrimary : Constant.colorTextSecondary }}>Rp 100,000</Paragraph>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <ScrollView horizontal>
                                        {dataPaymentType.map((item, index) =>
                                            <View
                                                key={index}
                                                style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 3 }}
                                            >
                                                <TouchableOpacity
                                                    style={styles.boxPaymentType}
                                                    onPress={() => {
                                                        setModalMetodeBayar(!modalMetodeBayar);
                                                        if (scNominal == 0) {
                                                            setPickMetodeBayar(item.Pay_Cd);
                                                            setModalInputNominal(!modalInputNominal);
                                                        } else {
                                                            funcSetMetodeBayar(item.Pay_Cd);
                                                        }
                                                    }}
                                                >
                                                    <Title style={{ ...styles.textJudul, color: Constant.colorTextPrimary }}>{item.PayDes}</Title>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalInputNominal}
                        onRequestClose={() => {
                            setModalInputNominal(!modalInputNominal);
                            setNominalBayar(0);
                            setTypeNominalBayar(null);
                            setPickMetodeBayar(null);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                {dataPaymentType.map((item, index) =>
                                    <View key={index}>
                                        {(item.Pay_Cd == pickMetodeBayar) ?
                                            <View>
                                                {(item.Pay_Cd == 'DD_CARD') ?
                                                    <View>
                                                        <Text>Nomor Member</Text>
                                                        <View style={styles.containerInputNamaCustomer}>
                                                            <TextInput
                                                                style={[styles.textInputNamaCustomer, styles.textBiasa]}
                                                                placeholder="Masukkan no member"
                                                                value={noMemberCard.toString()}
                                                                keyboardType={'numeric'}
                                                                onChangeText={(text) => {
                                                                    setNoMemberCard(+text);
                                                                }}
                                                            />
                                                        </View>
                                                    </View>
                                                    :
                                                    null
                                                }
                                                <Text>{item.PayDes}</Text>
                                                <View style={styles.containerInputNamaCustomer}>
                                                    <TextInput
                                                        style={[styles.textInputNamaCustomer, styles.textBiasa]}
                                                        placeholder={`Nominal ${item.PayDes}`}
                                                        value={nominalBayar.toString()}
                                                        keyboardType={'numeric'}
                                                        onChangeText={(text) => {
                                                            setNominalBayar(+text);
                                                            // setTypeNominalBayar(pickMetodeBayar);
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                            :
                                            null
                                        }
                                    </View>
                                )}
                                <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                                    <TouchableOpacity
                                        style={{ ...styles.openButton, backgroundColor: Constant.colorThird }}
                                        onPress={() => {
                                            setNominalBayar(0);
                                            setTypeNominalBayar(null);
                                            setModalInputNominal(!modalInputNominal);
                                            setPickMetodeBayar(null);
                                        }}
                                    >
                                        <Text style={[styles.textStyle, styles.textBiasa]}>Tidak</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ ...styles.openButton, backgroundColor: Constant.colorPrimary }}
                                        onPress={() => {
                                            funcSetMetodeBayar(null);
                                        }}
                                    >
                                        <Text style={[styles.textStyle, styles.textBiasa]}>Ya</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
                {/* ----- part cart ----- */}
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    cart: state.cart,
    sc: state.sc,
    de: state.de
});

export default connect(mapStateToProps, { cartAction, shiftClosingAction, dayEndClosingAction })(Home);