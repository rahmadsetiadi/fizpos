import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import {
    cartAction
} from '../../../actions/TransaksiAction';
import GlobalFont from 'react-native-global-font';
import Constant from '../../../configs/constants';
import styles from './styles';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import {
    View,
    StyleSheet,
    Text,
    Image,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import {
    Title,
    Paragraph,
    Divider,
    Snackbar
} from 'react-native-paper';

const CartScreen = (props) => {
    const [visibleSnackbar, setVisibleSnackbar] = useState(false);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        let fontName = Constant.fontFamily;
        GlobalFont.applyGlobal(fontName);
        getCart();
        return () => {
            setCart([]);
            setVisibleSnackbar(false);
        }
    }, []);

    const getCart = async () => {
        try {
            const cart = await AsyncStorage.getItem(Constant.simpanSelectProduk);
            if (cart != null || cart != undefined) {
                let parsedd = JSON.parse(cart);
                props.cartAction(parsedd.length);
                setCart(parsedd);
            } else {
                props.cartAction(0);
                setCart([]);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const hapus = async (index) => {
        if (index > -1) {
            let val = await AsyncStorage.getItem(Constant.simpanSelectProduk);
            let select = JSON.parse(val);
            select.splice(index, 1);
            await AsyncStorage.setItem(Constant.simpanSelectProduk, JSON.stringify(select));
            setVisibleSnackbar(true);
            getCart();
        }
    }

    const pilih = async (item, index) => {
        if (index > -1) {
            try {
                await AsyncStorage.setItem(Constant.selectProduk, JSON.stringify(item.data));
                let val = await AsyncStorage.getItem(Constant.simpanSelectProduk);
                let parsed = JSON.parse(val);
                parsed.splice(index, 1);
                props.cartAction(parsed.length);
                await AsyncStorage.setItem(Constant.simpanSelectProduk, JSON.stringify(parsed));
                props.navigation.goBack();
            } catch (e) {
                console.log(e)
            }
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.containerScroll}>
                {cart.map((item, index) =>
                    <View style={{ flex: 1, marginVertical: hp('1.7%') }} key={index}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 0.7, justifyContent: 'center' }}>
                                <Title style={styles.textJudul}>{`${item.id} - ${item.namaCustomer}`}</Title>
                                <Paragraph style={styles.textBiasa}>{`${item.data.length} item`}</Paragraph>
                            </View>
                            <View style={{ flex: 0.3, alignItems: 'flex-end', justifyContent: 'center' }}>
                                <View style={{ flexDirection: 'column', marginVertical: hp('1.5%') }}>
                                    <TouchableOpacity
                                        onPress={() => { hapus(index) }}
                                        style={styles.btnHapus}
                                    >
                                        <Text style={{ ...styles.textBiasa, textAlign: 'center', color: Constant.colorTextPrimary }}>Hapus</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => { pilih(item, index) }}
                                        style={styles.btnPilih}
                                    >
                                        <Text style={{ ...styles.textBiasa, textAlign: 'center', color: Constant.colorTextPrimary }}>Pilih</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <Divider />
                    </View>
                )}
            </ScrollView>
            <Snackbar
                visible={visibleSnackbar}
                onDismiss={() => setVisibleSnackbar(false)}
                duration={2000}
            >
                Data berhasil dihapus !
            </Snackbar>
        </View>
    )
}

const mapStateToProps = (state) => ({
    cart: state.cart
});

export default connect(mapStateToProps, { cartAction })(CartScreen);