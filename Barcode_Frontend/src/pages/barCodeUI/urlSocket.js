import axios from 'axios';

var urlSocket = axios.create({
    baseURL: 'https://172.16.1.168:5003',
    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
});

export default urlSocket;
