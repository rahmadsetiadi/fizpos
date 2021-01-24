import React, { useState, useEffect, useCallback } from 'react';
import APIKit from '../../../configs/ApiKit';
import Spinner from 'react-native-loading-spinner-overlay';
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
    ScrollView,
    RefreshControl,
    Text,
    Modal,
    TextInput,
    TouchableOpacity
} from 'react-native';
import {
    Divider,
    Paragraph,
    Title,
    DataTable,
    Badge
} from 'react-native-paper';
import {
    SearchBar
} from 'react-native-elements';
const TransactionsHistory = (props) => {
    const [dataTransactionHistory, setDataTransactionsHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState(null);
    const [modalVoid, setModalVoid] = useState(false);
    const [passwordVoid, setPasswordVoid] = useState(null);

    useEffect(() => {
        let fontName = Constant.fontFamily;
        GlobalFont.applyGlobal(fontName);
        getDataTransactionsHistory();
        return () => {
            // setDataTransactionsHistory([]);
            setSearch(null);
        }
    }, []);

    const getDataTransactionsHistory = () => {
        setIsLoading(true);
        APIKit.get(`order/history?${Constant.apiKey}`)
            .then((res) => {
                setIsLoading(false);
                setDataTransactionsHistory(res.data.data);
            }, err => {
                setIsLoading(false);
                console.log(err);
            });
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        APIKit.get(`order/history?${Constant.apiKey}`, {})
            .then((res) => {
                setRefreshing(false);
                setDataTransactionsHistory(res.data.data);
            }, err => {
                setRefreshing(false);
                console.log(err);
            });
    }, []);

    const reprint = (id_order) => {
        props.navigation.navigate('HomeStack', { screen: 'PrintTransaksi', params: { idOrder: id_order } })
    }

    return (
        <View style={{ flex: 1 }}>
            <Spinner visible={isLoading} />
            <ScrollView
                style={{
                    paddingHorizontal: wp('2%')
                }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <View style={{ flex: 0.3, justifyContent: 'center' }}>
                        <Title style={{ ...styles.textJudul, fontWeight: 'bold' }}>TRANSACTIONS HISTORY</Title>
                    </View>
                    <View style={{ flex: 0.4, justifyContent: 'center' }}>
                        <SearchBar
                            placeholder="Search by SKU..."
                            containerStyle={{ backgroundColor: 'transparent' }}
                            platform="ios"
                            cancelButtonProps={{
                                color: Constant.colorPrimary
                            }}
                            value={search}
                            onChangeText={(text) => setSearch(text)}
                        />
                    </View>
                    <View style={{ flex: 0.3, justifyContent: 'center' }}>
                        <Paragraph style={{ ...styles.textBiasa, textAlign: 'right' }}>Report/Transactions History</Paragraph>
                    </View>
                </View>
                <Divider />
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Date</DataTable.Title>
                        <DataTable.Title>Receipt</DataTable.Title>
                        <DataTable.Title>SKU</DataTable.Title>
                        <DataTable.Title>Product Name</DataTable.Title>
                        <DataTable.Title numeric>Qty</DataTable.Title>
                        <DataTable.Title numeric>Price</DataTable.Title>
                        <DataTable.Title numeric>####</DataTable.Title>
                    </DataTable.Header>
                    {dataTransactionHistory.map((item, index) =>
                        <DataTable.Row key={index}>
                            <DataTable.Cell>{item.created}</DataTable.Cell>
                            <DataTable.Cell>{item.orders_number}</DataTable.Cell>
                            <DataTable.Cell>{item.prodcode}</DataTable.Cell>
                            <DataTable.Cell>{item.title}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.qty}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.price}</DataTable.Cell>
                            <DataTable.Cell numeric>
                            <TouchableOpacity style={styles.btnReprint} onPress={() => { reprint(item.id) }}><Text style={{ color: '#fff' }}>Re-print</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.btnVoid} onPress={() => { setModalVoid(!modalVoid) }}><Text style={{ color: '#fff' }}>Void</Text></TouchableOpacity>
                                {/* <Icon name="print" size={17} color={Constant.colorPrimary} onPress={() => { reprint(item.id) }} /> || <Icon name="trash" size={17} color="red" onPress={() => { setModalVoid(!modalVoid) }} /> */}
                            </DataTable.Cell>
                        </DataTable.Row>
                    )}
                </DataTable>
            </ScrollView>
            {/* modal void */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVoid}
                onRequestClose={() => {
                    setModalVoid(!modalVoid);
                    setPasswordVoid(null);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.containerInput}>
                            <TextInput
                                style={[styles.textInput, styles.textBiasa]}
                                placeholder="Enter password..."
                                secureTextEntry={true}
                                value={passwordVoid}
                                onChangeText={(text) => setPasswordVoid(text)}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
                            <TouchableOpacity
                                style={{ ...styles.openButton, backgroundColor: Constant.colorThird }}
                                onPress={() => {
                                    setModalVoid(!modalVoid);
                                    setPasswordVoid(null);
                                }}
                            >
                                <Text style={[styles.textStyle, styles.textBiasa]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ ...styles.openButton, backgroundColor: Constant.colorPrimary }}
                                onPress={() => {
                                    if(passwordVoid != null || passwordVoid != ''){
                                        setModalVoid(!modalVoid);
                                        setPasswordVoid(null);
                                    }
                                }}
                            >
                                <Text style={[styles.textStyle, styles.textBiasa]}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default TransactionsHistory;