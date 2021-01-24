import React, { useEffect, useState } from 'react'
import APIKit from '../../../configs/ApiKit'
import GlobalFont from 'react-native-global-font'
import Constant from '../../../configs/constants'
import Spinner from 'react-native-loading-spinner-overlay'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from './styles'
import { Picker } from '@react-native-community/picker'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import {
    View,
    ToastAndroid,
    TouchableOpacity,
    TextInput,
    Text,
    SafeAreaView,
    ScrollView
} from 'react-native'
import {
    Paragraph,
    Card,
    Title
} from 'react-native-paper'

const Register = (props) => {
    const [dataTypeBusiness, setDataTypeBusiness] = useState([])
    const [dataBusinessTown, setDataBusinessTown] = useState([])
    const [fullname, setFullname] = useState(null)
    const [username, setUsername] = useState(null)
    const [email, setEmail] = useState(null)
    const [phone, setPhone] = useState(null)
    const [password, setPassword] = useState(null)
    const [businessName, setBusinessName] = useState(null)
    const [typeBusiness, setTypeBusiness] = useState('')
    const [businessTown, setBusinessTown] = useState('')
    const [togglePass, setTogglePass] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [yearNow, setYearNow] = useState(null)

    useEffect(() => {
        let fontName = Constant.fontFamily
        GlobalFont.applyGlobal(fontName)
        getYearNow()
        getJenisBisnis()
        getKotaBisnis()
    }, [])

    const toast = (pesan) => {
        ToastAndroid.showWithGravity(
            pesan,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        )
    }

    const getYearNow = () => {
        var date = new Date()
        setYearNow(date.getFullYear())
    }

    const showPass = (show) => {
        setTogglePass(!show)
    }

    const getJenisBisnis = () => {
        APIKit.get(`company/companycategory`, { headers: Constant.headers })
            .then((res) => {
                setDataTypeBusiness(res.data.data)
            }, err => {
                console.log(err)
            })
    }

    const getKotaBisnis = () => {
        APIKit.get(`province`, { headers: Constant.headers })
            .then((res) => {
                setDataBusinessTown(res.data.data)
            }, err => {
                console.log(err)
            })
    }

    const handleRegister = () => {
        if (fullname == null || username == null || email == null || phone == null || password == null || businessName == null || typeBusiness == '' || businessTown == '') {
            toast(`Semua data harus diisi !`)
        } else {
            let data = {
                'username': username,
                'fullname': fullname,
                'email': email,
                'phone': phone,
                'password': password,
                'comname': businessName,
                'comcategory': typeBusiness,
                'city': businessTown
            }
            setIsLoading(true)
            APIKit.post(`auth/signup`, data, { headers: Constant.headers })
                .then((res) => {
                    setIsLoading(false)
                    toast(res.data.message)
                    props.navigation.goBack()
                }, err => {
                    setIsLoading(false)
                    toast(err.response.data.message)
                })
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Spinner visible={isLoading} />
            <Title style={{ fontSize: 25, color: Constant.colorPrimary, fontWeight: 'bold', textAlign: 'center' }}>
                FIZPOS - DAFTAR
            </Title>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <View style={{ flex: 0.5, alignItems: 'center' }}>
                    <Card style={{ width: '90%' }}>
                        <Card.Content>
                            <Title style={{ ...styles.textJudul, color: Constant.colorPrimary, fontWeight: 'bold' }}>
                                Data User
                            </Title>
                            <Paragraph style={styles.textBiasa}>
                                Isikan informasi data anda
                            </Paragraph>
                            <View style={styles.containerInput}>
                                <TextInput
                                    style={[styles.textInput, styles.textBiasa]}
                                    placeholder="Nama Lengkap"
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text) => setFullname(text)}
                                />
                            </View>
                            <View style={styles.containerInput}>
                                <TextInput
                                    style={[styles.textInput, styles.textBiasa]}
                                    placeholder="Username"
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text) => setUsername(text)}
                                />
                            </View>
                            <View style={styles.containerInput}>
                                <TextInput
                                    style={[styles.textInput, styles.textBiasa]}
                                    placeholder="Email"
                                    keyboardType="email-address"
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text) => setEmail(text)}
                                />
                            </View>
                            <View style={styles.containerInput}>
                                <TextInput
                                    style={[styles.textInput, styles.textBiasa]}
                                    placeholder="No Telepon"
                                    keyboardType="phone-pad"
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text) => setPhone(text)}
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
                        </Card.Content>
                    </Card>
                </View>
                <View style={{ flex: 0.5, alignItems: 'center' }}>
                    <Card style={{ width: '90%' }}>
                        <Card.Content>
                            <Title style={{ ...styles.textJudul, color: Constant.colorPrimary, fontWeight: 'bold' }}>
                                Informasi Bisnis
                            </Title>
                            <Paragraph style={styles.textBiasa}>
                                Isikan informasi bisnis anda
                            </Paragraph>
                            <View style={styles.containerInput}>
                                <TextInput
                                    style={[styles.textInput, styles.textBiasa]}
                                    placeholder="Nama Bisnis"
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text) => setBusinessName(text)}
                                />
                            </View>
                            <View style={styles.containerInput}>
                                <Picker
                                    selectedValue={typeBusiness}
                                    placeholder="Jenis Bisnis"
                                    style={[styles.textInputShift, styles.textBiasa]}
                                    onValueChange={(itemValue) => setTypeBusiness(itemValue)}
                                >
                                    <Picker.Item label="--- Jenis Bisnis ---" value="" />
                                    {dataTypeBusiness.map((item, index) =>
                                        <Picker.Item key={index} label={item.category} value={item.id} />
                                    )}
                                </Picker>
                            </View>
                            <View style={styles.containerInput}>
                                <Picker
                                    selectedValue={businessTown}
                                    placeholder="Kota Bisnis"
                                    style={[styles.textInputShift, styles.textBiasa]}
                                    onValueChange={(itemValue) => setBusinessTown(itemValue)}
                                >
                                    <Picker.Item label="--- Kota Bisnis ---" value="" />
                                    {dataBusinessTown.map((item, index) =>
                                        <Picker.Item key={index} label={item.title} value={item.id} />
                                    )}
                                </Picker>
                            </View>
                        </Card.Content>
                    </Card>
                </View>
            </View>
            <View style={{ alignItems: 'center', marginTop: 20 }}>
                <TouchableOpacity
                    style={{ ...styles.btn, backgroundColor: Constant.colorPrimary }}
                    onPress={() => {
                        handleRegister()
                    }}
                >
                    <Text style={[styles.btnText, styles.textBiasa]}>DAFTAR</Text>
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                    <Paragraph style={styles.textBiasa}>{`@${yearNow}, Fizpost`}</Paragraph>
                </View>
            </View>
        </View>
    )
}

export default Register