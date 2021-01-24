import { StyleSheet } from 'react-native';
import Constant from '../../../configs/constants';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    wrapFixTop: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        paddingHorizontal: wp('1%')
    },
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
    containerInput: {
        width: wp('40%'),
        flexDirection: 'row',
        borderRadius: 3,
        borderStyle: 'solid',
        borderWidth: 0.8,
        height: 50,
        marginVertical: 13,
    },
    textInput: {
        marginLeft: 5,
        color: Constant.colorTextSecondary,
        width: '91%'
    },
    btnReprint: {
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: Constant.colorPrimary
    },
    btnVoid: {
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        backgroundColor: 'red',
        paddingHorizontal: 10,
        paddingVertical: 5,
    }
});

export default styles;