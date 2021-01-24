import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import GlobalFont from 'react-native-global-font';
import Constant from '../../configs/constants';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import {
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import {
    Title
} from 'react-native-paper';
// screens
import TransactionsHistory from '../../screens/app/transactionsHistory/TransactionsHistoryScreen';

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
                <Title style={{ ...styles.textJudul, color: Constant.colorTextPrimary }}>Transactions History</Title>
            </View>
        </View>
    );
}

const TransactionsHistoryStack = (props) => {
    useEffect(() => {
        let fontName = Constant.fontFamily;
        GlobalFont.applyGlobal(fontName);
        props.route.state !== undefined
            ? props.route.state.index > 0
                ? props.navigation.setOptions({ gestureEnabled: false })
                : props.navigation.setOptions({ gestureEnabled: true })
            : null;
    }, [props.navigation, props.route]);

    return (
        <Stack.Navigator initialRouteName="TransactionsHistory">
          <Stack.Screen
            name="TransactionsHistory"
            component={TransactionsHistory}
            options={{
                    headerTitle: 'FIZPOS',
                    headerTitleAlign: 'center',
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontFamily: Constant.fontFamily
                    },
                    headerLeft: () => <NavigationDrawerStructure navigationProps={props.navigation} />,
                    headerStyle: {
                        backgroundColor: '#5cb85c'
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

export default TransactionsHistoryStack;