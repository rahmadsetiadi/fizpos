import { StyleSheet } from 'react-native';
import Constant from '../../../configs/constants';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    imageBg: {
        flex: 1,
        resizeMode: "cover",
    },
    textJudul: {
        fontSize: Constant.sizeTextJudul,
        fontFamily: Constant.fontFamily
    },
    textBiasa: {
        fontSize: Constant.sizeTextBiasa,
        fontFamily: Constant.fontFamily
    },
    container: {
        paddingTop: hp('3%'),
        paddingHorizontal: wp('3%'),
        marginBottom: hp('4%')
    },
    containerInput: {
        width: '100%',
        flexDirection: 'row',
        borderRadius: 3,
        borderStyle: 'solid',
        borderWidth: 0.8,
        height: 50,
        marginVertical: 13,
    },
    textInput: {
        fontSize: 16,
        marginLeft: 5,
        fontFamily: Constant.fontFamily,
        color: Constant.colorTextSecondary,
        width: '99%'
    },
    textInputPassword: {
        fontSize: 16,
        marginLeft: 5,
        fontFamily: Constant.fontFamily,
        color: Constant.colorTextSecondary,
        width: '91%'
    },
    textInputShift: {
        fontSize: 16,
        marginLeft: 5,
        fontFamily: Constant.fontFamily,
        color: Constant.colorTextSecondary,
        width: '100%'
    },
    icon: {
        position: 'absolute',
        right: 7,
        top: 15.5
    },
    btn: {
        width: '100%',
        paddingVertical: 12,
        marginVertical: 10,
        borderRadius: 2
    },
    btnText: {
        textAlign: 'center',
        color: Constant.colorTextPrimary,
    },
    footer: {
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        bottom: hp('3%'),
        paddingHorizontal: wp('3%')
    },
    footerContent: {
        flex: 1,
        height: hp('12%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default styles