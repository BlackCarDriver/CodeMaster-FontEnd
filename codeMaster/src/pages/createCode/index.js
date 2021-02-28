import React, { Component } from 'react'
import { connect } from 'dva'
import { Row, Col, Tabs, Input, Divider, Button, Space, Dropdown, Menu, Typography, Skeleton } from 'antd'
import { BugOutlined, CloudUploadOutlined, DownOutlined } from '@ant-design/icons'

import CodeMirror from '@uiw/react-codemirror'
import 'codemirror/keymap/sublime'
import 'codemirror/theme/monokai.css'

const namespace = 'createCode'

@connect(({ createCode }) => ({
  model: createCode
}))

class CreateCode extends Component {
  state = {
    testPass: false
  }
  componentDidMount = () => {
    console.debug('init success')
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
    const { TextArea } = Input
    const { TabPane } = Tabs
    const code = 'const a = 0;'
    const { Text } = Typography
    const { testPass } = this.state

    const menu =
      <Menu>
        <Menu.Item key='CPP'>C++</Menu.Item>
        <Menu.Item key='C'>C</Menu.Item>
        <Menu.Item key='GO'>GO</Menu.Item>
      </Menu>


    return (
      <Row>
        <Col span={18} pull={3} push={3}>
          <Tabs size='middle' type='card'>
            {/* 代码测试标签页 */}
            <TabPane key='debug' tab={<span><BugOutlined />代码测试</span>}>
              <Row style={{marginBottom: '1em'}}>
                <Text>选择语言：</Text>
                <Dropdown overlay={menu}>
                  <Button size='small'> C++ <DownOutlined /></Button>
                </Dropdown>
              </Row>
              <Row style={{height: '60vh'}}>
                <CodeMirror value={code}
                  options={{ theme: 'monokai', keyMap: 'sublime', mode: 'jsx'}} />
              </Row>
              <Divider style={{margin:'1em'}}/>
              <Row style={{marginBottom:'1em'}}>
                <Col span={4}><Button type='primary'><BugOutlined />Debug Now!</Button></Col>
                <Col span={20} style={{textAlign:'right'}}>
                  <Space direction='horizontal' size={5}>
                    <Button type='default'>重置代码</Button>
                    <Button type='default'>清空代码</Button>
                    <Button type='default'>清空控制台</Button>
                  </Space>
                </Col>
              </Row>
              <Row>
                <TextArea allowClear autoSize={{ minRows: 3, maxRows: 10 }}
                  style={{backgroundColor:'rgb(39, 40, 34)', color:'#f8f8f2', fontSize:'13px'}}/>
              </Row>
              <br/>
            </TabPane>
            {/* 作品提交标签页 */}
            <TabPane key='submit' tab={<span><CloudUploadOutlined />提交作品</span>}>
              <Row hidden={testPass}>
                <Text type='secondary'>debug代码通过后方可解锁此功能....</Text>
                <Skeleton paragraph={{ rows: 8 }}/>
              </Row>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    )
  }
}

export default CreateCode
