import { combineReducers } from 'redux';
import {
    cartReducer,
    shiftClosingReducer,
    dayEndClosingReducer,
} from './TransaksiReducer'

export default combineReducers({
    cart: cartReducer,
    sc: shiftClosingReducer,
    de: dayEndClosingReducer,
});