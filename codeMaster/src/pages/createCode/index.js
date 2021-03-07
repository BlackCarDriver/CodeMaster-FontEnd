import React, { Component } from 'react'
import { connect } from 'dva'
import { Row, Col, Tabs, Input, Divider, Button, Space, Dropdown, Menu, Typography, Skeleton, message, Modal, Form } from 'antd'
import { BugOutlined, CloudUploadOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import CodeMirror from '@uiw/react-codemirror'
import 'codemirror/keymap/sublime'
import 'codemirror/theme/monokai.css'

import {goDemoCode, goDemoInput, cppDemoCode, cppDemoInput, cDemoCode, cDemoInput} from './defaultCode'

const namespace = 'createCode'
const { confirm } = Modal

@connect(({ createCode }) => ({
  model: createCode
}))

class CreateCode extends Component {
  state = {
    selectlanguage: 'C++',
    waitting: false,
    debugPass: false,
  }
  componentDidMount = () => {
    setTimeout(() => { // 初始化控制台表单
      this.setConsoleValue('input', cppDemoInput)
      this.setConsoleValue('ouput', '')
    }, 1000)
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

  // 显示确认模态框
  showConfirm = (desc, callbackFunc) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: desc,
      okText: '是',
      cancelText: '否',
      onOk () {callbackFunc()}
    })
  }

  // 选择的语言发生变更
  onSelectLanguage = (lang) => {
    const {selectlanguage} = this.state
    if (selectlanguage == lang) return
    this.setState({selectlanguage: lang})
    this.showConfirm('是否重置代码?', this.ResetCode)
  }
  // debug 按钮点击
  onDebugBtnClick = () => {
    if (!this.editerRef || !this.inputRef) {
      return
    }
    const { selectlanguage } = this.state
    let callbackFunc = (res) => {
      this.setState({waitting: false})
      if (!res) {
        message.warn('出错啦，请稍后重试...', 8)
        return
      }
      const { stdOut, stdErr } = res
      if (stdErr != '') {
        message.warn('代码编译失败...')
        this.setConsoleValue('ouput', '\n----------------- std Error -------------- \n' + stdErr, true)
      }
      if (stdOut != '') {
        this.setConsoleValue('output','\n----------------- std Output -------------- \n' + stdOut, true)
        message.success('代码通过测试啦,快去分享作品吧!')
      }
      this.setState({debugPass: true})
    }
    const inputValue = this.inputRef.getFieldValue('input')
    let params = {
      code: this.editerRef.editor.getValue(),
      lang: selectlanguage == 'C++' ? 'CPP' : selectlanguage,
      input: inputValue,
    }
    this.setState({waitting: true})
    this.callModel('codeDebug', {params:params, callbackFunc: callbackFunc})
  }
  // 清空代码按钮点击
  ClearCode = () => {
    if(this.editerRef) {
      this.editerRef.editor.setValue('')
    }else{
      console.warn('editerRef is ', this.editerRef)
    }
  }
  // 设置控制台的值
  setConsoleValue = (files, value, appendMod = false) => {
    if (!this.inputRef) {
      message.error('发生错误，请检查控制台')
      console.warn('this.inputRef=', this.inputRef)
      return
    }
    let newValue = ''
    if (appendMod) {
      newValue = this.inputRef.getFieldValue(files) + value
    }else{
      newValue = value
    }
    if (files == 'input'){
      this.inputRef.setFieldsValue({input: newValue})
    }else{
      this.inputRef.setFieldsValue({output: newValue})
    }
  }
  // 清空控制台
  ClearConsoler = () => {
    this.setConsoleValue('ouput', '')
  }
  // 重置代码按钮点击
  ResetCode = () => {
    const { selectlanguage } = this.state
    if (!this.editerRef) {
      message.warn('请重试')
      return
    }
    let code = ''
    let input = ''
    switch (selectlanguage) {
    case 'C':
      code = cDemoCode
      input = cDemoInput
      break
    case 'C++':
      code = cppDemoCode
      input = cppDemoInput
      break
    case 'GO':
      code = goDemoCode
      input = goDemoInput
      break
    default :
      message.warn('unexpect language:', selectlanguage)
    }
    this.editerRef.editor.setValue(code)
    this.setConsoleValue('input', input)
  }

  render () {
    const { TextArea } = Input
    const { TabPane } = Tabs
    const { Text } = Typography
    const { selectlanguage, waitting, debugPass } = this.state

    const menu =
      <Menu onClick={(v) => this.onSelectLanguage(v.key)}>
        <Menu.Item key='C++'>C++</Menu.Item>
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
                  <Button size='small' style={{width:'4.5em', float:'right'}}> {selectlanguage} <DownOutlined /></Button>
                </Dropdown>
              </Row>
              <Row style={{height: '60vh'}}>
                <CodeMirror ref={(r) => {this.editerRef = r}} value={cppDemoCode} options={{ theme: 'monokai', keyMap: 'sublime', mode: 'C++'}} />
              </Row>
              <Divider style={{margin:'1em'}}/>
              <Row style={{marginBottom:'1em'}}>
                <Col span={4}>
                  <Button loading={waitting} type='primary' onClick={() => {this.onDebugBtnClick()}} >
                    <BugOutlined />Debug Now!
                  </Button>
                </Col>
                <Col span={20} style={{textAlign:'right'}}>
                  <Space direction='horizontal' size={5}>
                    <Button size='small' type='default' onClick={() => this.showConfirm('确认重置代码?', this.ResetCode)}>重置代码</Button>
                    <Button size='small' type='default' onClick={() => this.showConfirm('确认清空代码吗?', this.ClearCode)}>清空代码</Button>
                    <Button size='small' type='default' onClick={() => this.showConfirm('确认清空控制台吗?', this.ClearConsoler)}>清空控制台</Button>
                  </Space>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form ref={(r) => this.inputRef = r} style={{width:'100%'}}>
                    <Form.Item name='input'>
                      <TextArea defaultValue={cppDemoInput} placeholder='>_ 程序输入' autoSize={{ minRows: 3, maxRows: 10 }}
                        style={{backgroundColor:'rgb(39, 40, 34)', color:'#f8f8f2', fontSize:'13px'}} />
                    </Form.Item>
                    <Form.Item name='output'>
                      <TextArea placeholder='程序输出' disabled autoSize={{ minRows: 3, maxRows: 10 }}
                        style={{backgroundColor:'rgb(39, 40, 34)', color:'#f8f8f2', fontSize:'13px'}} />
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
              <br/>
            </TabPane>
            {/* 作品提交标签页 */}
            <TabPane key='submit' tab={<span><CloudUploadOutlined />提交作品</span>}>
              <Row hidden={debugPass}>
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
