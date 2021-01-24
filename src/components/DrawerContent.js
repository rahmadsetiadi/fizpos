import React, { useContext, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import GlobalFont from 'react-native-global-font';
import Constant from '../configs/constants';
import { connect } from 'react-redux';
import { AuthContext } from '../configs/authContext';
import {
    shiftClosingAction,
    dayEndClosingAction
} from '../actions/TransaksiAction';
import {
    View,
    StyleSheet,
    Switch
} from 'react-native';
import {
    Avatar,
    Drawer,
    Paragraph,
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem
} from '@react-navigation/drawer';

const DrawerContent = (props) => {
    const { logout } = useContext(AuthContext);
    const [isTaxppn, setIsTaxppn] = useState(false);
    const [isNPWP, setIsNPWP] = useState(false);

    useEffect(() => {
        props.navigation.closeDrawer();
        let fontName = Constant.fontFamily;
        GlobalFont.applyGlobal(fontName);
        getSettings();
    }, []);

    const getSettings = async () => {
        let status = await AsyncStorage.getItem(Constant.settings);
        if (status == null || status == undefined) {
            let data = {
                'statusTaxppn': false,
                'showNPWP': false
            }
            await AsyncStorage.setItem(Constant.settings, JSON.stringify(data));
            setIsTaxppn(false);
            setIsNPWP(false);
        } else {
            let parsed = JSON.parse(status);
            setIsTaxppn(parsed.statusTaxppn);
            setIsNPWP(parsed.showNPWP);
        }
    }

    const toggleTaxppn = async () => {
        let data = {
            'statusTaxppn': !isTaxppn,
            'showNPWP': isNPWP
        }
        await AsyncStorage.setItem(Constant.settings, JSON.stringify(data));
        setIsTaxppn(!isTaxppn);
        getSettings();
    }

    const toggleNPWP = async () => {
        let data = {
            'statusTaxppn': isTaxppn,
            'showNPWP': !isNPWP
        }
        await AsyncStorage.setItem(Constant.settings, JSON.stringify(data));
        setIsNPWP(!isNPWP);
        getSettings();
    }

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{ marginVertical: 15 }}>
                            <Avatar.Image
                                source={require('../assets/imgs/logo_fizpos.png')}
                                size={75}
                                style={{ borderWidth: 2, borderColor: Constant.colorPrimary }}
                            />
                        </View>
                    </View>
                    <DrawerItemList {...props} />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Icon name="window-close" color={color} size={size - 4} />
                        )}
                        label="Shift Closing"
                        onPress={() => {
                            props.navigation.closeDrawer();
                            props.shiftClosingAction(true);
                        }}
                    />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Icon name="hourglass-end" color={color} size={size - 4} />
                        )}
                        label="Dayend Closing"
                        onPress={() => {
                            props.navigation.closeDrawer();
                            props.dayEndClosingAction(true);
                        }}
                    />
                    <Paragraph style={{ marginLeft: 20 }}>SETTING</Paragraph>
                    <View style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 10, marginVertical: 10 }}>
                        <View style={{ flex: 0.7 }}>
                            <Paragraph>Tax PPN</Paragraph>
                        </View>
                        <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                            <Switch
                                trackColor={{ false: Constant.colorSecondary, true: Constant.colorSecondary }}
                                thumbColor={isTaxppn ? Constant.colorPrimary : Constant.colorThird}
                                onValueChange={toggleTaxppn}
                                value={isTaxppn}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 10, marginVertical: 10 }}>
                        <View style={{ flex: 0.7 }}>
                            <Paragraph>Show NPWP</Paragraph>
                        </View>
                        <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                            <Switch
                                trackColor={{ false: Constant.colorSecondary, true: Constant.colorSecondary }}
                                thumbColor={isNPWP ? Constant.colorPrimary : Constant.colorThird}
                                onValueChange={toggleNPWP}
                                value={isNPWP}
                            />
                        </View>
                    </View>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    icon={({ color, size }) => (
                        <Icon name="sign-out" color={color} size={size - 4} />
                    )}
                    label="Keluar"
                    onPress={() => {
                        logout()
                    }}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1
    },
    userInfoSection: {
        // paddingLeft: 20
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    title: {
        fontFamily: Constant.fontFamily,
        fontSize: Constant.sizeTextJudul2,
        fontWeight: 'bold'
    },
    caption: {
        fontFamily: Constant.fontFamily,
        fontSize: Constant.sizeTextBiasa,
        lineHeight: 17
    },
    drawerSection: {
        marginTop: 15
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16
    }
})

const mapStateToProps = (state) => ({
    sc: state.sc,
    de: state.de
});

export default connect(mapStateToProps, { shiftClosingAction, dayEndClosingAction })(DrawerContent);