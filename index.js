/**
  Create By Diamsyah M Dida
*/

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import React from 'react';
import { Provider } from 'react-redux';
import reducers from './src/reducers';
import { createStore } from 'redux';

const store = createStore(reducers);

const RNRedux = () => (
    <Provider store = {store}>
        <App />
    </Provider>
)

AppRegistry.registerComponent(appName, () => RNRedux);
