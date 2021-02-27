import React, { Component } from 'react'
import { connect } from 'dva'
import { List, Row, Col, Tabs, Breadcrumb, Image, Divider, Typography, Space, Empty, Form, Input, Button, Card } from 'antd'
import { CommentOutlined, CodeOutlined, ReadOutlined } from '@ant-design/icons'
import { Link as Link2 } from 'dva/router'
import CommentList from '../../commom/components/CommentList'
import CodeEditer from '../../commom/components/CodeEditer'
import { timeFormater, codeTypeFormater } from '../../commom/utils/util'

const namespace = 'codeDetail'

@connect(({ codeDetail }) => ({
  model: codeDetail
}))

class CodeDetail extends Component {
  state = {
    title: ''
  }
  componentDidMount = () => {
    // 获取路由url参数并获取算法详情信息
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
    // 获取评论数据
    this.callModel('queryCommentList')
    this.callModel('queryCodeMessage')
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
    const { commentList, codeMessag } = this.props.model

    // this.setState({title: `codeID=${codeMessag.title}`})

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
                    <Title level={3}>{codeMessag.title}</Title>
                  </Col>
                  <Col><Image height={130} style={{maxWidth:'300px'}} src={codeMessag.imgSrc}/></Col>
                  <Col span={15} style={{paddingLeft: '10px'}}>
                    <Space direction='vertical' size={0}>
                      <Text><Text type='secondary'>作者: </Text><Text>{codeMessag.author}</Text></Text>
                      <Text><Text type='secondary'>创作时间: </Text><Text>{timeFormater(codeMessag.timestamp, 0)}</Text></Text>
                      <Text><Text type='secondary'>评分: </Text><Text>{codeMessag.score}</Text></Text>
                      <Text><Text type='secondary'>分类:  </Text><Text>{codeTypeFormater(codeMessag.type)}</Text></Text>
                      <Text><Text type='secondary'>标签: </Text>
                        <Space direction='horizontal' size={5}>
                          {codeMessag.tags.map((item, idx) => {
                            if (idx + 1 != codeMessag.tags.length) {
                              return <><Link key={idx}>{item}</Link><Text>/</Text></>
                            }
                            return <><Link key={idx}>{item}</Link></>
                          })}
                        </Space>
                      </Text>
                      <Text type='secondary'>简介: <Text>{codeMessag.desc}</Text></Text>
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

              {/* 代码查看标签页 */}
              <TabPane tab={<span><ReadOutlined />查看源码</span>} key='code'>
                <Text code>main.{codeMessag.language}</Text>
                <div style={{padding:'1em', border: 'solid 1px rgba(0, 0, 0, 0.08)'}}>
                  <CodeEditer code={codeMessag.code}/>
                </div>
              </TabPane>
            </Tabs>

            {/* 评论区 */}
            <Row style={{marginTop:'30px'}}>
              <Title level={4}>评论 ({commentList.length})</Title>
              <Divider style={{margin:'10px 0 24px 0'}}/>
              {commentList.length > 0 ?
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
                </Col> : <Empty style={{marginLeft:'10em'}} description='暂无评论...'/>}
              <Divider />
              <Col span={12}>
                <Card>
                  <Form.Item>
                    <Input placeholder='这里输入昵称' defaultValue='隐形巨老' maxLength={30}/>
                  </Form.Item>
                  <Form.Item>
                    <TextArea rows={1} placeholder='说些东西吧...' maxLength={250}/>
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
