import { StyleSheet } from 'react-native';
import Constant from '../../../configs/constants';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    // umum
    textJudul: {
        fontSize: Constant.sizeTextJudul2,
        fontFamily: Constant.fontFamily
    },
    textBiasa: {
        fontSize: Constant.sizeTextBiasa,
        fontFamily: Constant.fontFamily
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    botView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: "#eaeaea",
        borderRadius: 20,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 20,
        elevation: 2,
        marginHorizontal: 5,
    },
    textStyle: {
        color: "white",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: '#fff'
    },
    containerInputGeneral: {
        width: wp('50%'),
        flexDirection: 'row',
        borderRadius: 3,
        borderStyle: 'solid',
        borderWidth: 0.8,
        height: 50,
        marginVertical: 13,
    },
    textInputShift: {
        fontSize: Constant.sizeTextBiasa,
        marginLeft: 5,
        fontFamily: Constant.fontFamily,
        color: Constant.colorTextSecondary,
        width: '100%'
    },

    // Part kategori
    containerKategori: {
        flex: 0.2,
        marginTop: hp('2%'),
        borderWidth: 1.5,
        borderColor: Constant.colorSecondary,
        height: '100%',
        width: '100%'
    },
    detailKategori: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: hp('7%'),
        paddingBottom: hp('1%')
    },
    btnCariKategori: {
        flex: 0.5,
        backgroundColor: Constant.colorThird,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    btnBarcodeKategori: {
        flex: 0.5,
        backgroundColor: Constant.colorPrimary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    closeScan: {
        backgroundColor: Constant.colorPrimary,
        width: wp('10%'),
        height: hp('5%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },

    // Part List
    containerList: {
        flex: 0.5,
        marginTop: hp('2%'),
        marginHorizontal: wp('1%'),
        height: '100%',
        width: '100%'
    },

    // Part Cart
    containerCart: {
        flex: 0.3,
        borderWidth: 1.5,
        borderColor: Constant.colorSecondary,
        height: '100%',
        width: '100%'
    },
    cardCart: {
        marginVertical: hp('0.3%'),
        borderLeftWidth: 4.5,
        borderLeftColor: Constant.colorPrimary
    },
    btnMinusCart: {
        backgroundColor: Constant.colorThird,
        color: Constant.colorTextPrimary
    },
    btnPlusCart: {
        backgroundColor: Constant.colorPrimary,
        color: Constant.colorTextPrimary
    },
    btnHapusCart: {
        backgroundColor: 'red',
        color: Constant.colorTextPrimary
    },
    detailCart: {
        justifyContent: 'flex-end',
        backgroundColor: Constant.colorSecondary,
        paddingHorizontal: wp('1%'),
        paddingVertical: hp('1%')
    },
    btnResetCart: {
        backgroundColor: Constant.colorPrimary,
        width: '100%',
        height: hp('4.5%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: hp('0.7%')
    },
    btnSimpanCart: {
        backgroundColor: Constant.colorThird,
        width: '98%',
        height: hp('4.5%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: hp('1%')
    },
    btnBayarCart: {
        backgroundColor: Constant.colorPrimary,
        width: '98%',
        height: hp('4.5%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: hp('1%')
    },
    btnConfirmCart: {
        backgroundColor: Constant.colorPrimary,
        width: '100%',
        height: hp('4.5%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: hp('1%')
    },
    containerInputNamaCustomer: {
        width: wp('40%'),
        flexDirection: 'row',
        borderRadius: 3,
        borderStyle: 'solid',
        borderWidth: 0.8,
        height: 50,
        marginVertical: 13,
    },
    textInputNamaCustomer: {
        marginLeft: 5,
        color: Constant.colorTextSecondary,
        width: '91%'
    },
    boxPaymentType: {
        width: 150,
        height: 130,
        backgroundColor: Constant.colorPrimary,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnScNominal: {
        padding: 8,
        marginRight: 5,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: Constant.colorThird
    }
});

export default styles