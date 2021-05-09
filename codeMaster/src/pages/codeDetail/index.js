import React, { Component } from 'react'
import { connect } from 'dva'
import { List, Row, Col, Tabs, Breadcrumb, Image, Divider, Typography, Space, Empty, Form, Input, Button, Card, Tooltip, message } from 'antd'
import { CommentOutlined, CodeOutlined, ReadOutlined, CopyOutlined } from '@ant-design/icons'
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
    title: '',
    codeID: '',
    runInput: '',
    isRunning: false,
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
    this.setState({title: `codeID=${codeID}`, codeID: codeID})
    // 获取评论数据
    this.callModel('queryCommentList', {codeID: codeID})
    this.callModel('queryCodeMessage', {codeID: codeID})
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
  // 提交评论
  submitComment = (v) => {
    console.debug('comment=', v)
    const {comment, author} = v
    if (comment == '' || author == '') {
      message.warn('请填写昵称或评论内容')
      return
    }
    let callbackFunc = (ok) => {
      if (ok) {
        message.success('评论成功')
        this.callModel('queryCommentList', {codeID: codeID})
        this.recommendRef.resetFields()
      }else{
        message.warn('评论失败')
      }
    }
    const {codeID} = this.state
    this.callModel('subMitComment',
      {params: {comment: comment, author: author, workId: codeID}, callbackFunc: callbackFunc}
    )

  }
  // 执行算法
  runWork = (v) => {
    const {codeID, runInput} = this.state
    this.setState({isRunning: true})
    this.callModel('runWork', {
      params:{workId: codeID, input: runInput},
      callbackFunc: (ok, payload) => {
        this.setState({isRunning: false})
        if (ok) {
          message.success('执行成功')
          this.setState({runOuput: payload})
        }else{
          message.warn('执行失败')
        }
      }
    })
  }

  render = () => {
    const { TabPane } = Tabs
    const { TextArea } = Input
    const { Title, Text, Link, Paragraph } = Typography
    const { commentList, codeMessage } = this.props.model
    const { runOuput, isRunning } = this.state

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
                    <Title level={3}>{codeMessage.title}</Title>
                  </Col>
                  <Col><Image height={130} style={{maxWidth:'300px'}} src={codeMessage.coverUrl}/></Col>
                  <Col span={15} style={{paddingLeft: '10px'}}>
                    <Space direction='vertical' size={0}>
                      <Text><Text type='secondary'>作者: </Text><Text>{codeMessage.author}</Text></Text>
                      <Text><Text type='secondary'>创作时间: </Text><Text>{timeFormater(codeMessage.timestamp, 0)}</Text></Text>
                      <Text><Text type='secondary'>评分: </Text><Text>{codeMessage.score}</Text></Text>
                      <Text><Text type='secondary'>分类:  </Text><Text>{codeTypeFormater(codeMessage.ctype)}</Text></Text>
                      <Text><Text type='secondary'>标签: </Text>
                        <Space direction='horizontal' size={5}>
                          {codeMessage.tags.map((item, idx) => {
                            if (idx + 1 != codeMessage.tags.length) {
                              return <><Link key={idx}>{item}</Link><Text>/</Text></>
                            }
                            return <><Link key={idx}>{item}</Link></>
                          })}
                        </Space>
                      </Text>
                      <Text type='secondary'>简介:<Text>{codeMessage.desc}</Text>
                      </Text>
                    </Space>
                  </Col>
                </Row>
                <Row style={{marginTop:'30px'}}>
                  <Title level={4}>详细介绍</Title>
                  <Divider style={{margin:'10px 0 24px 0'}}/>
                  <div>
                    {codeMessage.detail ? <div className='html-wrap' dangerouslySetInnerHTML={{ __html: codeMessage.detail }} /> : <Empty style={{marginLeft:'10em'}} description='暂无详细介绍...' />}
                  </div>
                </Row>
              </TabPane>

              {/* 算法执行标签页 */}
              <TabPane tab={<span><CodeOutlined />使用</span>} key='run'>
                <Row>
                  <Col span={12}>
                    <Paragraph>
                      <Title level={5}>格式说明</Title>
                      <blockquote style={{whiteSpace:'pre'}}>
                        {codeMessage.inputDesc}
                      </blockquote>
                      <Title level={5}>输入案例</Title>
                      <pre>
                        {codeMessage.demoInput}
                      </pre>
                      <Title level={5}>预期结果</Title>
                      <pre>
                        {codeMessage.demoOuput}
                      </pre>
                    </Paragraph>
                  </Col>
                  <br />
                  <Col span={24}>
                    <Divider style={{margin:'24px 0 10px 0'}}/>
                    <Title level={5}>输入数据 👇</Title>
                  </Col>
                  <Col span={12}>
                    <Space direction='vertical' size={8} style={{width:'100%'}}>
                      <TextArea placeholder='这里输入数据...' allowClear autoSize={{ minRows: 5, maxRows: 10 }} onChange={(e) => this.setState({runInput: e.target.value})}/>
                      <Button type='primary' loading={isRunning} onClick={() => {this.runWork()}}>计算结果</Button>
                      <TextArea placeholder='这里将会展示运行结果...' autoSize={{ minRows: 3, maxRows: 100 }} key={runOuput} value={runOuput}></TextArea>
                    </Space>
                  </Col>
                </Row>
              </TabPane>

              {/* 代码查看标签页 */}
              <TabPane tab={<span><ReadOutlined />查看源码</span>} key='code'>
                <Text code copyable={{
                  icon: [<CopyOutlined key='1' />],
                  tooltips: ['点我复制', '复制成功'],
                  text: codeMessage.code
                }} >
                    main.{codeMessage.language}
                </Text>
                <div style={{ border: 'solid 1px rgba(0, 0, 0, 0.08)'}}>
                  <CodeEditer code={codeMessage.code}/>
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
                          imgSrc={item.coverUrl}
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
                  <Form onFinish={(v) => {this.submitComment(v)}} ref={(v) => {this.recommendRef = v}} initialValues={{author:'隐形巨佬', comment:''}}>
                    <Form.Item name='author' >
                      <Input placeholder='这里输入昵称' defaultValue='隐形巨佬' maxLength={30}/>
                    </Form.Item>
                    <Form.Item name='comment'>
                      <TextArea rows={1} placeholder='说些东西吧...' maxLength={250}/>
                    </Form.Item>
                    <Form.Item style={{marginBottom:'0'}}>
                      <Button htmlType='submit' type='primary'>发表评论</Button>
                    </Form.Item>
                  </Form>
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
