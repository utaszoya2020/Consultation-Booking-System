import { get, post, put, patch } from './axios';
import { BOOKING_TYPE, ONLINE_BOOKING_STATUS, OFFLINE_BOOKING_STATUS } from '../../constants/option';

//TODO Move api url to urlmap.js
const API_BOOKING_URL = './bookings';
const API_USER_URL = './users';
const API_CHAT_URL = './chats';
const API_LOG_URL = './logs';

// TODO Fix REST API
export const fetchAllMyBookings = (userId) => {
    const url = `${API_USER_URL}/${userId}/bookings`;
    return get(url).then((response) => response.data);
    
};

export const fetchAllBookings = () => {
    const url = `${API_BOOKING_URL}`;
    return get(url).then((response) => response.data);
};
//TODO optimise
export const fetchAllOfflineBookings = () => {
    const url = `${API_BOOKING_URL}?type=offline`;
    return get(url).then((response) => response.data);
};

export const fetchBookingDetail = (bookingId) => {
    const url = `${API_BOOKING_URL}/${bookingId}`;
    
    return get(url).then((response) => response.data);
};

export const fetchBookingUpdateDetail = (bookingId) => {
    const url = `${API_BOOKING_URL}/update/${bookingId}`;
    console.log('dad1')
    return get(url).then((response) => response.data);
};

export const addBooking = (
    type,
    campus,
    userId,
    topic,
    subject,
    content,
    bookingDate,
    bookingTime,
    attachment
) => {
    const url = API_BOOKING_URL;
    console.log(attachment);
    const status = type === BOOKING_TYPE.ONLINE ? ONLINE_BOOKING_STATUS.PROCESSING : OFFLINE_BOOKING_STATUS.PENDING;
    const data = {
        type,
        campus,
        userId,
        topic,
        subject,
        content,
        bookingDate,
        bookingTime,
        attachment,
        status,
    };
    return post(url, data).then((response) => response.data);
};

export const updateBookingStatus = (bookingId, status, log) => {
    const url = `${API_BOOKING_URL}/${bookingId}`;
    const data = {status, log};
    return patch(url, data).then((response) => response.data);
};

export const addChat = (chat) => {
    const url = API_CHAT_URL;
    const data = chat;
    return post(url, data).then((response) => response.data);
};

export const addLog = (input) => {
    
    const url = API_LOG_URL;
    const data = input;
    return post(url, data).then((response) => response.data);
};

export const fetchAllChatByBookingId = (bookingId) => {
    const url = `${API_CHAT_URL}?bookingId=${bookingId}`;
    return get(url).then((response) => response.data);
};

export const updateChat = (chatId, chatRecords) => {
    const url = `${API_CHAT_URL}/${chatId}`;
    const data = chatRecords;
    return put(url, data).then((response) => response.data);
};
