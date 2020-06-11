import { get } from './axios';
const API_USER_URL = './users';

export const fetchUserDetail = (userId) => {
    const url = `${API_USER_URL}/${userId}`;
    return get(url).then((response) => response.data);
};
