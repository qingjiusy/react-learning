import {
    Card,
    Breadcrumb,
    Form,
    Button,
    Radio,
    Input,
    Upload,
    Space,
    Select,
    message
  } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useSearchParams } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useEffect, useState } from 'react'
import { createArticleAPI, getArticleById, updateArticleAPI} from '@/apis/article'
import { useChannel } from '@/hooks/useChannel'
  
const { Option } = Select

const Publish = () => {
    //获取频道列表
    const {channelList} = useChannel()

    //提交表单
    function onFinish(formValue) {
        //校验封面类型imageType是否和实际的图片列表image一致
        if(imageList.length !== imageType) return message.warning('封面类型和图片数量不匹配！')
        const {title, content, channel_id} = formValue
        //按照接口文档格式来处理收集到的表单格式
        const reqData = {
            title,
            content,
            cover: {
                type: imageType, //封面模式
                //这里url要针对不同的逻辑写不同的样式变换来保证正确传参
                images: imageList.map(item => {
                    if(item.response){
                        return item.response.data.url
                    }else{
                        return item.url
                    }
                }) //图片列表 
            },
            channel_id
        }
        //调用接口
        //处理调用不同的接口 新增 - 新增接口 编辑状态 - 更新接口
        //根据有无id判断！
        if(articleId){
            updateArticleAPI({...reqData, id: articleId})
        }else{
            createArticleAPI(reqData)
        }
    }

    //上传回调
    const [imageList, setImageList] = useState([])
    function onChange(value){
        setImageList(value.fileList)
    }

    //切换图片封面类型
    const [imageType, setImageType] = useState(0)
    function onTypeChange(e){
        setImageType(e.target.value)
    }

    //回填数据
    const [searchParams] = useSearchParams()
    const articleId = searchParams.get('id')
    //获取实例
    //在 Ant Design 的表单系统中，Form.useForm()是一个自定义 Hook
    // 用来获取表单实例 form。这个实例可以让你主动控制表单
    const [form] = Form.useForm()

    async function getArticleDetail() {
        const res = await getArticleById(articleId)
        const data = res.data

        form.setFieldsValue({
            ...data,
            type: data.cover.type
        })
        //回填图片列表，根据虾米那的逻辑我们要显示图片要先保证imageType正确
        setImageType(data.cover.type)
        //显示图片
        setImageList(data.cover.images.map(url=> {
            return { url }
        }))
    }

    useEffect(() => {
        //通过id获取数据
        //同时要考虑到只有有id的时候才能调用此函数回填
        if(articleId){
            getArticleDetail()
        }
        //调用实例方法完成回填
    }, [articleId, form])

    return (
        <div className="publish">
        <Card
            title={
            <Breadcrumb items={[
                { title: <Link to={'/'}>首页</Link> },
                { title: `${articleId ? '编辑' : '发布'}文章` },
            ]}
            />
            }
        >
            <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ type: 0 }}
            onFinish={onFinish}
            form={form}
            >
            <Form.Item
                label="标题"
                name="title"
                rules={[{ required: true, message: '请输入文章标题' }]}
            >
                <Input placeholder="请输入文章标题" style={{ width: 400 }} />
            </Form.Item>
            <Form.Item
                label="频道"
                name="channel_id"
                rules={[{ required: true, message: '请选择文章频道' }]}
            >
                <Select placeholder="请选择文章频道" style={{ width: 400 }}>
                {/* value属性在用户选中之后会自动收集，作为接口的提交字段 */}
                {channelList.map(item=><Option key={item.id} value={item.id}>{item.name}</Option>)}
                </Select>
            </Form.Item>
            <Form.Item label="封面">
            <Form.Item name="type">
                <Radio.Group onChange={onTypeChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
                </Radio.Group>
            </Form.Item>
            {/* 
                listType：决定选择文件框的外观样式
                showUploadList：控制显示上传列表
            */}
            {imageType > 0 && <Upload
                listType="picture-card"
                showUploadList
                action={'http://geek.itheima.net/v1_0/upload'}
                name="image"
                onChange={onChange}
                maxCount={imageType}
                fileList={imageList}
            >
                <div style={{ marginTop: 8 }}>
                <PlusOutlined />
                </div>
            </Upload>}
            </Form.Item>
            <Form.Item
                label="内容"
                name="content"
                rules={[{ required: true, message: '请输入文章内容' }]}
            >
                {/* 放置一个富文本编辑器 */}
                <ReactQuill
                className="publish-quill"
                theme="snow"
                placeholder="请输入文章内容"
                />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4 }}>
                <Space>
                <Button size="large" type="primary" htmlType="submit">
                    发布文章
                </Button>
                </Space>
            </Form.Item>
            </Form>
        </Card>
        </div>
    )
}

export default Publish