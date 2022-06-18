// 封装axios
// 实例化 请求拦截器 响应拦截器
import axios from "axios";
import { getToken } from "./token";
import history from './history';

const http = axios.create({
    baseURL: 'http://geek.itheima.net/v1_0',
    timeout: 5000
});
//添加请求拦截器
http.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

//添加响应拦截器
http.interceptors.response.use((response) => {
    // 2xx 的响应状态码都会有触发该函数
    return response.data;
}, (error) => {
    // 超出2xx的响应状态码触发该函数
    console.dir(error);
    if (error.response.status === 401) {
        // 跳回到登陆页
        // react-router 默认情况下 并不支持在组件外完成路由跳转 
        // 官方方案：手动创建history.js和HistoryRouter
        // github.com/remix-run/react-router/issues/8264
        history.push('/login');
    }
    return Promise.reject(error);
});

export default http;
