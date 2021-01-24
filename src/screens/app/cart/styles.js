import { StyleSheet } from 'react-native';
import Constant from '../../../configs/constants';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    textJudul: {
        fontSize: Constant.sizeTextJudul,
        fontFamily: Constant.fontFamily
    },
    textBiasa: {
        fontSize: Constant.sizeTextBiasa,
        fontFamily: Constant.fontFamily
    },
    container: {
        flex: 1
    },
    containerScroll: {
        paddingHorizontal: wp('3%'),
    },
    btnHapus: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: 30,
        borderRadius: 15,
        backgroundColor: Constant.colorPrimary,
        marginBottom: hp('0.5%')
    },
    btnPilih: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: 30,
        borderRadius: 15,
        backgroundColor: Constant.colorPrimary
    }
});

export default styles