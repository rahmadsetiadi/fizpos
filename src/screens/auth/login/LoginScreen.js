import React, { useState, useContext, useEffect } from 'react';
import APIKit from '../../../configs/ApiKit';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../../../configs/authContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import GlobalFont from 'react-native-global-font';
import Constant from '../../../configs/constants';
import styles from './styles';
import {
    BluetoothManager,
} from '@cloudgakkai/react-native-bluetooth-escpos-printer';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import {
    View,
    TouchableOpacity,
    ToastAndroid,
    TextInput,
    Text,
    SafeAreaView,
} from 'react-native';
import {
    Appbar,
    Paragraph,
    Card,
    Title
} from 'react-native-paper';

const Login = (props) => {
    const { login } = useContext(AuthContext);
    const [yearNow, setYearNow] = useState(null);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [togglePass, setTogglePass] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    let _listeners = [];

    useEffect(() => {
        // scanBluetooth();
        let fontName = Constant.fontFamily;
        GlobalFont.applyGlobal(fontName);
        getYearNow();
    }, []);

    const getYearNow = () => {
        var date = new Date();
        setYearNow(date.getFullYear());
    }

    const toast = (pesan) => {
        ToastAndroid.showWithGravity(
            pesan,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );
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
                console.log(paired[0].address);
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

    const handleLogin = () => {
        if (username == null) {
            toast(`User ID harus diisi !`);
        } else if (password == null) {
            toast(`Password harus diisi !`);
        } else {
            setIsLoading(true);
            let data = {
                'login': username,
                'password': password
            }
            APIKit.post(`auth/login`, data, { headers: Constant.headers })
                .then((res) => {
                    setIsLoading(false);
                    toast(res.data.message);
                    login(res.data.data);
                }, err => {
                    setIsLoading(false);
                    toast(err.response.data.message);
                });
        }
    }

    const showPass = (show) => {
        setTogglePass(!show);
    }

    return (
        <View style={{ flex: 1 }}>
            <Spinner visible={isLoading} />
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Card style={{ width: wp('50%') }}>
                    <Card.Content>
                        <Title style={{ ...styles.textJudul, color: Constant.colorPrimary, fontWeight: 'bold' }}>
                            FIZPOS - MASUK
                        </Title>
                        <Paragraph style={styles.textBiasa}>
                            Masukkan username dan password anda dengan benar
                        </Paragraph>
                        <View style={styles.containerInput}>
                            <TextInput
                                style={[styles.textInput, styles.textBiasa]}
                                placeholder="Username"
                                underlineColorAndroid='transparent'
                                onChangeText={(text) => setUsername(text)}
                            />
                        </View>
                        <View style={styles.containerInput}>
                            <Icon
                                style={styles.icon}
                                name={togglePass == true ? 'eye-slash' : 'eye'}
                                color="#000"
                                size={15}
                                onPress={() => showPass(togglePass)}
                            />
                            <TextInput
                                style={[styles.textInputPassword, styles.textBiasa]}
                                placeholder="Password"
                                underlineColorAndroid='transparent'
                                secureTextEntry={togglePass}
                                onChangeText={(text) => setPassword(text)}
                            />
                        </View>
                        <TouchableOpacity
                            style={{ ...styles.btn, backgroundColor: Constant.colorPrimary }}
                            onPress={() => handleLogin()}
                        >
                            <Text style={[styles.btnText, styles.textBiasa]}>MASUK</Text>
                        </TouchableOpacity>
                        <View style={{ alignItems: 'center' }}>
                            <Paragraph style={styles.textBiasa}>{`@${yearNow}, Fizpost`}</Paragraph>
                        </View>
                    </Card.Content>
                </Card>
            </SafeAreaView>
        </View>
    )
}

export default Login;