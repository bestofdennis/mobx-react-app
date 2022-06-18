import {Card, Breadcrumb, Form, Select, Upload, Space, Button, Radio, Input, message} from "antd";
import { PlusOutlined } from '@ant-design/icons';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import './index.scss';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {useEffect, useRef, useState} from "react";
import { useStore } from "../../store";
import {observer} from "mobx-react-lite";
import http from "../../utils/http";

const { Option } = Select;

const Publish = () => {
    const navigate = useNavigate();
    const { channelStore } = useStore();
    // 存放上传图片的列表 每上传一个，会放进来一个
    const [fileList, setFileList] = useState([]);
    // 切换图片 单选状态
    const [imgCount, setImageCount] = useState(1);
    useEffect(() => {
        channelStore.getChannels();
    }, []);
    // 使用useRef声明一个暂存仓库
    const cacheImgList = useRef();
    const onUploadChange = ({fileList}) => {
        console.log(fileList);
        const formatList = fileList.map(item => {
            if (item.response) {
                return {
                    url: item.response.data.url
                };
            }
            else {
                return item;
            }
        });
        setFileList(formatList);
        // 同时把图片列表存入仓库一份
        cacheImgList.current = formatList;
    }
    const radioChange = (e) => {
        setImageCount(e.target.value);
        // 从仓库里面取赌赢的图片数量 交给我们用来渲染图片列表的fileList
        // 通过调用setFileList
        if (e.target.value === 1) {
            const img = cacheImgList.current ? [cacheImgList.current[0]] : [];
            setFileList(img);
        }
        else if (e.target.value === 3) {
            setFileList(cacheImgList.current ? cacheImgList.current : []);
        }
    }
    // 提交表单
    const onFinish = async(val) => {
        const { channel_id, content, title, type } = val;
        const params = {
            channel_id,
            content, 
            title, 
            type,
            cover: {
                type,
                images: fileList.map(item => item.url)
            }
        };
        console.log('params:',params)
        if (id) {
            await http.put(`/mp/articles/${id}?draft=false`, params);
        } else {
            await http.post('/mp/articles?draft=false', params);
        }
        
        // 跳转列表 提示用户
        navigate('/article');
        id ? message.success('更新成功') : message.success('发布成功');
    }
    
    // 编辑功能
    // 文案适配 路由参数id 判断条件
    const [params] = useSearchParams();
    const id = params.get('id');
    // 数据回填 id调用接口 
    // 1 表单回填
    // 2 暂存列表
    // 3 Upload组件fileList
    // 4 SetImageCount
    const form = useRef(null);
    useEffect(() => {
        const loadDetail = async () => {
            const res = await http.get(`mp/articles/${id}`);
            // 表单数据回填
            form.current.setFieldsValue({...res.data, type: res.data.cover.type});
            setImageCount(res.data.cover.type);
            // 调用setFileList回填Upload上传组件数据
            const fileList = res.data.cover.images.map(item => {
                return {url: item};
            });
            if (fileList.length) {
                setFileList(fileList);
                // 暂存列表
                cacheImgList.current = fileList;
            }
        }
        if (id) {
            loadDetail();
        }
    }, []);
    
    return (
        <div className="publish">
            <Card
                title={
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>
                            <Link to="/home">首页</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{id ? '编辑文章' : '发布文章'}</Breadcrumb.Item>
                    </Breadcrumb>
                }
            >
                <Form
                    labelCol={{span: 4}}
                    wrapperCol={{span: 16}}
                    initialValues={{type: 1, content: ''}}
                    onFinish={onFinish}
                    ref={form}
                >
                    <Form.Item
                        label="标题"
                        name="title"
                        rules={[{required: true, message: '请输入文章标题'}]}
                    >
                        <Input placeholder="请输入文章标题" style={{width: 400}}/>
                    </Form.Item>
                    <Form.Item
                        label="频道"
                        name="channel_id"
                        rules={[{required: true, message: '请选择文章频道'}]}
                    >
                        <Select placeholder="请选择文章频道" style={{width: 200}}>
                            {
                                channelStore.channels.map(item => (
                                    <Option key={item.id} value={item.name}>
                                        {item.name}
                                    </Option>
                                ))
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item label="封面">
                        <Form.Item name="type">
                            <Radio.Group onChange={radioChange}>
                                <Radio value={1}>单图</Radio>
                                <Radio value={3}>三图</Radio>
                                <Radio value={0}>无图</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {/*Upload*控制最大上传数量maxCount*/}
                        {/*Upload*控制是否一次选择多个进行上传multiple*/}
                        {imgCount > 0 && (
                            <Upload
                                name="image"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList
                                action="http://geek.itheima.net/v1_0/upload"
                                fileList={fileList}
                                onChange={onUploadChange}
                                maxCount={imgCount}
                                multiple={imgCount > 1}
                            >
                                <div style={{marginTop: 8}}>
                                    <PlusOutlined/>
                                </div>
                            </Upload>
                        )}
                    </Form.Item>
                    <Form.Item
                        label="内容"
                        name="content"
                        rules={[{required: true, message: '请输入文章内容'}]}
                    >
                        <ReactQuill theme="snow"/>
                    </Form.Item>

                    <Form.Item wrapperCol={{offset: 4}}>
                        <Space>
                            <Button size="large" type="primary" htmlType="submit">
                                {id ? '更新文章' : '发布文章'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
export default observer(Publish);
