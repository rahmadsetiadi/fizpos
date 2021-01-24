import { StyleSheet } from 'react-native';
import Constant from '../../../configs/constants';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    textJudul: {
        fontSize: Constant.sizeTextJudul2,
        fontFamily: Constant.fontFamily
    },
    textBiasa: {
        fontSize: Constant.sizeTextBiasa,
        fontFamily: Constant.fontFamily
    },
    container: {
        flex: 1,
        marginHorizontal: wp('20%'),
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'cover'
    },
    btnCetak: {
        backgroundColor: Constant.colorPrimary,
        // width: wp('100%'),
        height: 50,
        justifyContent: 'center'
    },
    btnReconnect: {
        backgroundColor: Constant.colorThird,
        // width: wp('100%'),
        height: 50,
        justifyContent: 'center'
    }
})

export default styles;