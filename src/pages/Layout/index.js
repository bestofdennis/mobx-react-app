import React, {useEffect} from "react";
import {Layout, Menu, Popconfirm, message} from "antd";
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {HomeOutlined, DiffOutlined, EditOutlined, LogoutOutlined} from '@ant-design/icons';
import { useStore } from '@/store';
import { observer } from "mobx-react-lite";
import './index.scss';

const {Header, Sider} = Layout;

const MainLayout = () => {
    const { pathname } = useLocation();
    const { userStore, loginStore } = useStore();
    useEffect(() => {
        userStore.getUserInfo();
    }, [userStore]);
    
    const navigate = useNavigate();
    // 确认退出
    const logOut = () => {
        loginStore.removeToken();
        message.success('退出成功');
        navigate('/login');
    }
    
    return (
        <Layout>
            <Header className="header">
                <div className="logo"></div>
                <div className="user-info">
                    <span className="user-name">{userStore.userInfo.name}</span>
                    <span className="user-logout">
                        <Popconfirm title="是否确认退出？" okText="退出" cancelText="取消" onConfirm={logOut}>
                            <LogoutOutlined/>退出
                        </Popconfirm>
                    </span>
                </div>
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        theme="dark"

                        style={{height: '100%', borderRight: 0}}
                        defaultSelectedKeys={[pathname]}
                    >
                        <Menu.Item icon={<HomeOutlined/>} key="/">
                            <Link to='/'>数据概览</Link>
                        </Menu.Item>
                        <Menu.Item icon={<DiffOutlined/>} key="/article">
                            <Link to="/article">内容管理</Link>
                        </Menu.Item>
                        <Menu.Item icon={<EditOutlined/>} key="/publish">
                            <Link to="/publish">发布文章</Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="layout-content" style={{padding: 20}}>
                    {/*二级路由出口*/}
                    <Outlet/>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default observer(MainLayout);
