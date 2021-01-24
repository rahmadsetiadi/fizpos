import React, { useEffect, useState } from 'react'
import GlobalFont from 'react-native-global-font'
import Icon from 'react-native-vector-icons/FontAwesome'
import Constant from '../../configs/constants'
import {
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import {
    Card,
    Paragraph,
    Title
} from 'react-native-paper'

const MainAuth = (props) => {
    const [yearNow, setYearNow] = useState(null)

    useEffect(() => {
        let fontName = Constant.fontFamily
        GlobalFont.applyGlobal(fontName)
        getYearNow()
    }, [])

    const getYearNow = () => {
        var date = new Date()
        setYearNow(date.getFullYear())
    }

    return (
        <View style={styles.container}>
            <Title style={styles.title}>SELAMAT DATANG</Title>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => {
                        props.navigation.navigate('Login')
                    }}
                >
                    <Card style={styles.card}>
                        <Card.Content>
                            <Icon name="sign-in" size={75} color="#000" />
                            <Paragraph style={{ textAlign: 'center' }}>Login</Paragraph>
                        </Card.Content>
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        props.navigation.navigate('Register')
                    }}
                >
                    <Card style={styles.card}>
                        <Card.Content>
                            <Icon name="registered" size={75} color="#000" />
                            <Paragraph style={{ textAlign: 'center' }}>Register</Paragraph>
                        </Card.Content>
                    </Card>
                </TouchableOpacity>
            </View>
            <Paragraph style={styles.text}>{`${yearNow}, FIZPOS`}</Paragraph>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Constant.colorPrimary
    },
    card: {
        paddingHorizontal: 50,
        paddingVertical: 50,
        marginHorizontal: '2%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50
    },
    title: {
        fontFamily: Constant.fontFamily,
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: '5%',
        color: '#fff'
    },
    text: {
        fontFamily: Constant.fontFamily,
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: '3%',
        color: '#fff'
    }
})

export default MainAuth