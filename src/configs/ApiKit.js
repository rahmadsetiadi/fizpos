import axios from 'axios';
import Constant from './constants';

let APIKit = axios.create({
    baseURL: Constant.url,
    timeout: 10000,
});

export default APIKit;