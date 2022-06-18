import {makeAutoObservable} from "mobx";
import {http, getToken, setToken} from "@/utils";
import {removeToken} from "../utils";

class LoginStore {
    token = getToken() || '';
    constructor() {
        // 响应式
        makeAutoObservable(this);
    }
    getToken = async ({ mobile, code }) => {
        // 调用登录接口
        const res = await http.post('authorizations', {
            mobile, code
        });
        // 存入token
        this.token = res.data.token;
        // 存入localStorage
        setToken(this.token);
    }
    removeToken = () => {
        this.token = ''
        removeToken();
    }
}

export default LoginStore;
