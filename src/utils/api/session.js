import { get, post, put, del } from './axios';

const API_SESSION_URL = './sessions';

export const fetchAllSessions = () => {
    const url = API_SESSION_URL;
    return get(url).then((response) => response.data);
};

export const addSession = (date, currentSessionTime, campus) => {
    const url = API_SESSION_URL;
    const data = {date, time: currentSessionTime, campus};
    return post(url, data).then((response) => response.data);
};

export const fetchSession = (date, campus) => {
    const url = `${API_SESSION_URL}?date=${date}&?campus=${campus}`;
    return get(url).then((response) => response.data);
};

export const updateSession = (sessionId, date, currentSessionTime, campus) => {
    const url = `${API_SESSION_URL}/${sessionId}`;
    const data = {date, time: currentSessionTime, campus};
    return put(url, data).then((response) => response.data);
};

export const deleteSession = (date, campus) => {
    const url = `${API_SESSION_URL}?date=${date}&?campus=${campus}`;
    return del(url).then((response) => response.data);
};

