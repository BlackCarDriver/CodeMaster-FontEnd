import React, { Component } from 'react'
import { connect } from 'dva'
import { List, Row, Col, Tabs, Breadcrumb, Image, Divider, Typography, Space, Empty, Form, Input, Button, Card } from 'antd'
import { CommentOutlined, CodeOutlined, ReadOutlined } from '@ant-design/icons'
import { Link as Link2 } from 'dva/router'
import CommentList from '../../commom/components/CommentList'

const namespace = 'createCode'

@connect(({ codeDetail }) => ({
  model: codeDetail
}))

class CodeDetail extends Component {
  state = {
    title: ''
  }
  componentDidMount = () => {
    let query = this.props.location.search.substring(1)
    let vars = query.split('&')
    let codeID = '?'
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split('=')
      if (pair[0] == 'id') {
        codeID = pair[1]
      }
    }
    console.debug('codeID=', codeID)
    this.setState({title: `codeID=${codeID}`})
  }

  // 调用 model 处理函数
  callModel = (funcName, params) => {
    const { dispatch } = this.props
    dispatch({
      type: `${namespace}/${funcName}`,
      payload: params
    })
  }
  // 修改单个model state 成员
  changeState = (name, newValue) => {
    this.callModel('updateState', {
      name: name, newValue: newValue
    })
  }

  render () {
    const { TabPane } = Tabs
    const { TextArea } = Input
    const { Title, Text, Link } = Typography

    const commentList = [
      {author:'BlackCarDri', timestamp:1614403507, imgSrc:'', desc: '<span key="comment-basic-reply-to">Reply to</span>'},
      {author:'BlackCarDriv', timestamp:1614403507, imgSrc:'', desc: '<span key="comment-basic-reply-to">Reply to</span>'},
      {author:'BlackCarDrive', timestamp:1614403507, imgSrc:'', desc: '<span key="comment-basic-reply-to">Reply to</span>'},
      {author:'BlackCarDriver', timestamp:1614403507, imgSrc:'', desc: '<span key="comment-basic-reply-to">Reply to</span>'},
      {author:'BlackCarDriver2', timestamp:1614403507, imgSrc:'', desc: '<span key="comment-basic-reply-to">Reply to</span>'},
      {author:'BlackCarDriver', timestamp:1614403507, imgSrc:'https://s.cn.bing.net/th?id=ODL.ece8b589cb3bf04f49f0cb6c7cdb12c8&w=94&h=131&c=7&rs=1&qlt=80&pid=RichNav', desc: '<span key="comment-basic-reply-to">Reply to</span>'},
    ]
    return (
      <div>
        <Row style={{marginBottom:'4em'}}>
          <Col span={18} pull={3} push={3}>
            <Row>
              <Breadcrumb>
                <Breadcrumb.Item><Link2 to='/home'>算法广场</Link2></Breadcrumb.Item>
                <Breadcrumb.Item>{this.state.title}</Breadcrumb.Item>
              </Breadcrumb>
            </Row>
            <Tabs defaultActiveKey='desc' size='large' style={{minHeight:'600px'}}>
              <TabPane tab={<span><CommentOutlined />介绍</span>} key='desc'>
                <Row>
                  <Col span={24}>
                    <Title level={3}>花呗计算器</Title>
                  </Col>
                  <Col><Image height={130} src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'/></Col>
                  <Col span={15} style={{paddingLeft: '10px'}}>
                    <Space direction='vertical' size={0}>
                      <Text><Text type='secondary'>作者: </Text><Text>BlackCarDriver</Text></Text>
                      <Text><Text type='secondary'>创作时间: </Text><Text>2021-02-24 23:03</Text></Text>
                      <Text><Text type='secondary'>评分: </Text><Text>4.6</Text></Text>
                      <Text><Text type='secondary'>分类:  </Text><Text>生活问题</Text></Text>
                      <Text><Text type='secondary'>标签: </Text>
                        <Space direction='horizontal' size={5}>
                          <Link>支付宝</Link><Text>/</Text>
                          <Link>花呗</Link><Text>/</Text>
                          <Link>利息</Link>
                        </Space>
                      </Text>
                      <Text type='secondary'>简介: <Text>一个帮助你计算花呗应还金额的算法，帮助你更好理财哦~</Text></Text>
                    </Space>
                  </Col>
                </Row>
                <Row style={{marginTop:'30px'}}>
                  <Title level={4}>详细介绍</Title>
                  <Divider style={{margin:'10px 0 24px 0'}}/>
                  <Empty style={{marginLeft:'10em'}} description='暂无介绍...'/>
                </Row>
              </TabPane>

              <TabPane tab={<span><CodeOutlined />使用</span>} key='run'>
      Content of Tab Pane 2
              </TabPane>
              <TabPane tab={<span><ReadOutlined />查看源码</span>} key='code'>
      Content of Tab Pane 2
              </TabPane>
            </Tabs>

            <Row style={{marginTop:'30px'}}>
              <Title level={4}>评论 ({commentList.length})</Title>
              <Divider style={{margin:'10px 0 24px 0'}}/>
              {commentList.length > 0 ? '' : <Empty style={{marginLeft:'10em'}} description='暂无评论...'/>}
              <Col span={24}>
                <List
                  itemLayout='horizontal'
                  dataSource={commentList}
                  renderItem={item =>
                    <li>
                      <CommentList
                        author={item.author}
                        imgSrc={item.imgSrc}
                        desc={item.desc}
                        timestamp={item.timestamp}
                      />
                    </li>
                  }
                />
              </Col>
              {commentList.length > 0 ? <Divider /> : ''}
              <Col span={12}>
                <Card>
                  <Form.Item>
                    <Input placeholder='这里输入昵称' defaultValue='隐形巨老'/>
                  </Form.Item>
                  <Form.Item>
                    <TextArea rows={1} placeholder='说些东西吧...' />
                  </Form.Item>
                  <Form.Item style={{marginBottom:'0'}}>
                    <Button htmlType='submit' type='primary'>发表评论</Button>
                  </Form.Item>
                </Card>
              </Col>
            </Row>

          </Col>
        </Row>
      </div>
    )
  }
}

export default CodeDetail
