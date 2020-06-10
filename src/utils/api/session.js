import { get, post, put, patch } from './axios';

const API_SESSION_URL = './sessions';

export const fetchAllSessions = () => {
    const url = API_SESSION_URL;
    return get(url).then((response) => response.data);
};

export const addSession = (sessions) => {
    const url = API_SESSION_URL;
    const data = {sessions};
    return post(url, data).then((response) => response.data);
};

export const fetchAllSessionByDate = (date) => {
    const url = `${API_SESSION_URL}?date=${date}`;
    return get(url).then((response) => response.data);
};