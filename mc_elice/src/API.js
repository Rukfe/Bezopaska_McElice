// API.js
import axios from 'axios';

export const generateKeys = async () => {
    return await axios.get('/generate_keys');
};

export const encryptMessage = async (message) => {
    return await axios.post('/encrypt', { message });
};

export const decryptMessage = async (message) => {
    return await axios.post('/decrypt', { message });
};

export const getKey = async () => {
    return await axios.get('/get_key');
};

export const changeKey = async () => {
    return await axios.post('/change_key');
};
