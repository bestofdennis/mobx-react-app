import React from "react";
import {Button, Card, Checkbox, Form, Input, message} from 'antd';
import plane from '@/assets/plane.png';
import './index.scss';
import { useStore } from "@/store";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { loginStore } = useStore();
    const navigate = useNavigate();
     const onFinish = async(val) => {
        console.log(val);
        // 登录
         try {
             await loginStore.getToken({
                 mobile: val.tel,
                 code: val.password
             })
             // 跳转首页
             navigate('/', { replace: true });
             message.success('登录成功');
         } catch (e) {
             message.error(e.response?.data?.message || '登录失败');
         }
    }
    const onFinishFailed = (val) => {
        console.log('Failed:',val);
    }
    return (
        <div className="login">
            <Card className="login-container">
                <img className="login-logo" src={plane} alt="" />
                <Form
                    validateTrigger={['onBlur', 'onChange']}
                    initialValues={{
                        remember: true
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        name="tel"
                        rules={[
                            {
                                required: true,
                                message: '请输入手机号'
                            },
                            {
                                pattern: /^1[3-9]\d{9}$/,
                                message: '请输入正确的手机号',
                                validateTrigger: 'onBlur'
                            }
                        ]}
                    >
                        <Input size="large" placeholder="请输入手机号"/>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入验证码'
                            },
                            {
                                len: 6,
                                message: '请输入6位密码',
                                validateTrigger: 'onChange'
                            }
                        ]}
                    >
                        <Input size="large" placeholder="请输入验证码" />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox className="login-checkbox-label">我已阅读并同意「用户协议」和「隐私条款」</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
