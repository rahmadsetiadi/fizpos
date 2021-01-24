/**
  Create By Diamsyah M Dida
*/

import React, { useMemo, useReducer, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from './src/configs/authContext';
import Constant from './src/configs/constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  ActivityIndicator,
  View,
  StatusBar
} from 'react-native';
// customDrawer
import DrawerContent from './src/components/DrawerContent';
// stacks
import AuthStack from './src/stacks/auth/AuthStack';
import HomeStack from './src/stacks/app/HomeStack';
import TransactionsHistoryStack from './src/stacks/app/TransactionsHistoryStack';
import CashierReportStack from './src/stacks/app/CashierReportStack';
import CogsReportStack from './src/stacks/app/CogsReportStack';
import PaymentSummaryStack from './src/stacks/app/PaymentSummaryStack';
import ProductInventoryStack from './src/stacks/app/ProductInventoryStack';
import ProfitLostStatementStack from './src/stacks/app/ProfitLostStatementStack';
import RevenueSummaryStack from './src/stacks/app/RevenueSummaryStack';
import WeeklyMonthlyReportStack from './src/stacks/app/WeeklyMonthlyReportStack';
import XZReportStack from './src/stacks/app/XZReportStack';

const Drawer = createDrawerNavigator();

const App = () => {
  const initialLoginState = {
    userToken: null,
    isLoading: true
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false
        }
      case 'LOGIN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false
        }
      case 'LOGOUT':
        return {
          ...prevState,
          userToken: null,
          isLoading: false
        }
      case 'REGISTER':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false
        }
    }
  }

  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  const authContext = useMemo(() => ({
    login: async (response) => {
      try {
        await AsyncStorage.setItem(Constant.loginFizpos, JSON.stringify(response));
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'LOGIN', token: response });
    },
    logout: async () => {
      try {
        await AsyncStorage.clear();
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' })
    }
  }), []);

  useEffect(() => {
    setTimeout(async () => {
      let res = null;
      try {
        res = await AsyncStorage.getItem(Constant.loginFizpos);
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: JSON.parse(res) });
    }, 100);
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  const Drawerr = () => {
    return (
      <Drawer.Navigator
        initialRouteName="HomeStack"
        backBehavior="initialRoute"
        drawerContent={(props) => <DrawerContent {...props} />}
        drawerContentOptions={{
          activeBackgroundColor: Constant.colorPrimary,
          activeTintColor: '#ffffff'
        }}
        drawerStyle={{
          borderRadius: 40,
        }}
      >
        <Drawer.Screen
          name="HomeStack"
          component={HomeStack}
          options={{
            title: 'Home',
            drawerIcon: config => <Icon size={config.size-2} color={config.color} name='home'></Icon>
          }}
        />
        <Drawer.Screen
          name="TransactionsHistoryStack"
          component={TransactionsHistoryStack}
          options={{
            title: 'Riwayat Transaksi',
            drawerIcon: config => <Icon size={config.size-5} color={config.color} name='cart-arrow-down'></Icon>
          }}
        />
        <Drawer.Screen
          name="CashierReportStack"
          component={CashierReportStack}
          options={{
            title: 'Laporan Kasir',
            drawerIcon: config => <Icon size={config.size-5} color={config.color} name='user-md'></Icon>
          }}
        />
        <Drawer.Screen
          name="CogsReportStack"
          component={CogsReportStack}
          options={{
            title: 'Harga pokok penjualan (HPP)',
            drawerIcon: config => <Icon size={config.size-5} color={config.color} name='cogs'></Icon>
          }}
        />
        <Drawer.Screen
          name="PaymentSummaryStack"
          component={PaymentSummaryStack}
          options={{
            title: 'Ringkasan Pembayaran',
            drawerIcon: config => <Icon size={config.size-5} color={config.color} name='hdd-o'></Icon>
          }}
        />
        <Drawer.Screen
          name="ProductInventoryStack"
          component={ProductInventoryStack}
          options={{
            title: 'Persediaan Product',
            drawerIcon: config => <Icon size={config.size-5} color={config.color} name='indent'></Icon>
          }}
        />
        <Drawer.Screen
          name="ProfitLostStatementStack"
          component={ProfitLostStatementStack}
          options={{
            title: 'Laporan Laba & Rugi',
            drawerIcon: config => <Icon size={config.size-5} color={config.color} name='bar-chart'></Icon>
          }}
        />
        <Drawer.Screen
          name="RevenueSummaryStack"
          component={RevenueSummaryStack}
          options={{
            title: 'Ringkasan Pendapatan',
            drawerIcon: config => <Icon size={config.size-5} color={config.color} name='line-chart'></Icon>
          }}
        />
        <Drawer.Screen
          name="WeeklyMonthlyReportStack"
          component={WeeklyMonthlyReportStack}
          options={{
            title: 'Laporan Mingguan & Bulanan',
            drawerIcon: config => <Icon size={config.size-5} color={config.color} name='calendar'></Icon>
          }}
        />
        <Drawer.Screen
          name="XZReportStack"
          component={XZReportStack}
          options={{
            title: 'Laporan X-Z',
            drawerIcon: config => <Icon size={config.size-5} color={config.color} name='sort-amount-asc'></Icon>
          }}
        />
      </Drawer.Navigator>
    )
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <StatusBar backgroundColor={Constant.colorPrimary} />
        {loginState.userToken !== null ? (
          <>
            <Drawerr />
          </>
        )
          :
          <>
            <AuthStack />
          </>
          }
        </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
