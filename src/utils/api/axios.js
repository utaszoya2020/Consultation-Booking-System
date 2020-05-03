import axios from 'axios';

import { getToken } from '../authentication';
// For Dev
//axios.defaults.baseURL = 'http://localhost:4000/api';
// For Production
axios.defaults.baseURL =
    'http://bookingappapi-env.eba-b77icp2s.ap-southeast-2.elasticbeanstalk.com/api/';

const appendAuthToken = (config) => {
    const jwtToken = getToken();
    const Authorization = jwtToken && `Bearer ${jwtToken}`;

    return { ...config, headers: { Authorization, ...config.header } };
};

export const get = (url, config = {}) =>
    axios.get(url, appendAuthToken(config));

export const post = (url, data, config = {}) =>
    axios.post(url, data, appendAuthToken(config));

export const put = (url, data, config = {}) =>
    axios.put(url, data, appendAuthToken(config));

export const del = (url, config = {}) =>
    axios.delete(url, appendAuthToken(config));
