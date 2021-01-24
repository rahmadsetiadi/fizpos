import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import GlobalFont from 'react-native-global-font';
import Constant from '../../configs/constants';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet
} from 'react-native';
import {
    Badge,
    Title
} from 'react-native-paper';
// screens
import Home from '../../screens/app/home/HomeScreen';
import Cart from '../../screens/app/cart/CartScreen';
import PrintTransaksi from '../../screens/app/printTransaksi/PrintTransaksiScreen';

const Stack = createStackNavigator();

const NavigationDrawerStructure = (props) => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 0.3 }}>
                <TouchableOpacity
                    onPress={() => props.navigationProps.openDrawer()}
                    style={{ marginLeft: wp('2%'), marginTop: 7 }}
                >
                    <Icon name='bars' size={21} color='#fff' />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 0.7, marginHorizontal: wp('3%') }}>
                <Title style={{ ...styles.textJudul, color: Constant.colorTextPrimary }}>Home</Title>
            </View>
        </View>
    );
}

const IconRight = (props) => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
                onPress={() => props.navigationProps.navigate('HomeStack', { screen: 'Cart' })}
                // onPress={() => props.navigationProps.navigate('Cart')}
            >
                <Icon name='shopping-cart' size={21} color='#fff' />
                <Badge
                    style={{
                        position: 'absolute',
                        top: -10,
                        right: -10
                    }}
                >
                    {props.cart}
                </Badge>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => props.navigationProps.navigate('HomeStack', { screen: 'Cart' })}
                // onPress={() => props.navigationProps.navigate('Cart')}
                style={{ marginHorizontal: wp('1%') }}
            >
                <Text style={{ ...styles.textBiasa, color: Constant.colorTextPrimary }}>TERSIMPAN</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{ marginHorizontal: wp('2%') }}
            >
                <Icon name='ellipsis-v' size={21} color='#fff' />
            </TouchableOpacity>
        </View>
    )
}

const HomeStack = (props) => {
    const [totalCart, setTotalCart] = useState(0);
    
    useEffect(() => {
        props.route.state !== undefined ?
        props.route.state.index > 0 ?
        props.navigation.setOptions({ gestureEnabled: false })
        :
        props.navigation.setOptions({ gestureEnabled: true })
        :
        null;
        let fontName = Constant.fontFamily;
        GlobalFont.applyGlobal(fontName);
        getCart();
        return () => {
            setTotalCart(0);
        }
    }, [props.navigation, props.route]);

    const getCart = async () => {
        try {
            const ssp = await AsyncStorage.getItem(Constant.simpanSelectProduk);
            let parsed = JSON.parse(ssp);
            if(parsed == null || parsed.length == 0){
                setTotalCart(0);
            }else{
                setTotalCart(parsed.length);
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={Home}
                options={{
                    headerTitle: 'FIZPOS',
                    headerTitleAlign: 'center',
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontFamily: Constant.fontFamily
                    },
                    headerLeft: () => <NavigationDrawerStructure navigationProps={props.navigation} />,
                    headerRight: () => <IconRight cart={(props.cart == 0) ? totalCart : props.cart} navigationProps={props.navigation} />,
                    headerStyle: {
                        backgroundColor: Constant.colorPrimary
                    }
                }}
            />
            <Stack.Screen
                name="Cart"
                component={Cart}
                options={{
                    headerTitle: 'Cart',
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontFamily: Constant.fontFamily
                    },
                    headerStyle: {
                        backgroundColor: Constant.colorPrimary
                    }
                }}
            />
            <Stack.Screen
                name="PrintTransaksi"
                component={PrintTransaksi}
                options={{
                    headerTitle: 'Print',
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontFamily: Constant.fontFamily
                    },
                    headerStyle: {
                        backgroundColor: Constant.colorPrimary
                    }
                }}
            />
        </Stack.Navigator>
    )
}

const styles = StyleSheet.create({
    textJudul: {
        fontSize: Constant.sizeTextJudul,
        fontFamily: Constant.fontFamily
    },
    textBiasa: {
        fontSize: Constant.sizeTextBiasa,
        fontFamily: Constant.fontFamily
    },
});

const mapStateToProps = (state) => ({
    cart: state.cart
});

export default connect(mapStateToProps)(HomeStack);