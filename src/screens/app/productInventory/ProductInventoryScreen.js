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
    RefreshControl
} from 'react-native';
import {
    Divider,
    Paragraph,
    Title,
    DataTable
} from 'react-native-paper';

const ProductInventory = () => {
    const [dataProductInventory, setDataProductInventory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        let fontName = Constant.fontFamily;
        GlobalFont.applyGlobal(fontName);
        getDataProductInventory();
        return () => {
            setDataProductInventory([]);
        }
    }, []);

    const getDataProductInventory = () => {
        setIsLoading(true);
        APIKit.get(`order/stock?${Constant.apiKey}`)
            .then((res) => {
                setIsLoading(false);
                setDataProductInventory(res.data.data);
            }, err => {
                setIsLoading(false);
                console.log(err);
            });
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        APIKit.get(`order/stock?${Constant.apiKey}`, {})
            .then((res) => {
                setRefreshing(false);
                setDataProductInventory(res.data.data);
            }, err => {
                setRefreshing(false);
                console.log(err);
            });
    }, []);

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
                    <View style={{ flex: 0.5, justifyContent: 'center' }}>
                        <Title style={{ ...styles.textJudul, fontWeight: 'bold' }}>STOCK BALANCE</Title>
                    </View>
                    <View style={{ flex: 0.5, justifyContent: 'center' }}>
                        <Paragraph style={{ ...styles.textBiasa, textAlign: 'right' }}>Report/Stock Balance</Paragraph>
                    </View>
                </View>
                <Divider />
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>SKU</DataTable.Title>
                        <DataTable.Title>Product Name</DataTable.Title>
                        <DataTable.Title numeric>Opening Stock</DataTable.Title>
                        <DataTable.Title numeric>Stock Received</DataTable.Title>
                        <DataTable.Title numeric>Stock Return</DataTable.Title>
                        <DataTable.Title numeric>Sales</DataTable.Title>
                        <DataTable.Title numeric>Balance</DataTable.Title>
                    </DataTable.Header>
                    {dataProductInventory.map((item, index) =>
                        <DataTable.Row key={index}>
                            <DataTable.Cell>{item.prodcode}</DataTable.Cell>
                            <DataTable.Cell>{item.title}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.opening_stock}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.stock_received}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.stock_return}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.sales}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.balance}</DataTable.Cell>
                        </DataTable.Row>
                    )}
                </DataTable>
            </ScrollView>
        </View>
    )
}

export default ProductInventory;