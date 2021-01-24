import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import GlobalFont from 'react-native-global-font';
import Constant from '../../../configs/constants';
import styles from './styles';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import {
    View,
    Text
} from 'react-native';

const ProfitLosStatement = () => {
    useEffect(() => {

    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Profit & Lost Statement</Text>
        </View>
    )
}

export default ProfitLosStatement;