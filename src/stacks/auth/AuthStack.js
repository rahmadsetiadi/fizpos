import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// screens
import MainAuth from '../../screens/auth/MainAuth';
import Login from '../../screens/auth/login/LoginScreen';
import Register from '../../screens/auth/register/RegisterScreen';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainAuth"
        component={MainAuth}
        options={{
          headerTransparent: true,
          headerTitle: null,
          headerLeft: null
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerTransparent: true,
          headerTitle: null,
          headerLeft: null
        }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          headerTransparent: true,
          headerTitle: null,
          headerLeft: null
        }}
      />
    </Stack.Navigator>
  )
}

export default AuthStack;