import LoginStore from './login.Store';
import UserStore from  './user.Store';
import ChannelStore from "./channel.Store";
import React from 'react';

class RouteStore {
    constructor() {
        this.loginStore = new LoginStore();
        this.userStore = new UserStore();
        this.channelStore = new ChannelStore();
    }
}

const rootStore = new RouteStore();
const context = React.createContext(rootStore);

const useStore = () => React.useContext(context);

export { useStore };
