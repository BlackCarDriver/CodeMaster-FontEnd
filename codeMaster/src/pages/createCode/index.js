import React, { Component } from 'react'
import { connect } from 'dva'
import { Row, Col, Tabs, Input, Divider, Button, Space, Dropdown, Menu, Typography, Skeleton, message, Modal, Form, Select } from 'antd'
import { BugOutlined, CloudUploadOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import CodeMirror from '@uiw/react-codemirror'
import 'codemirror/keymap/sublime'
import 'codemirror/theme/monokai.css'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import {goDemoCode, goDemoInput, cppDemoCode, cppDemoInput, cDemoCode, cDemoInput} from './defaultCode'

const namespace = 'createCode'

@connect(({ createCode }) => ({
  model: createCode
}))

class CreateCode extends Component {
  state = {
    selectlanguage: 'C++',
    waitting: false,
    debugPass: true,
    detailVisable: false,
    passCode: '', // debug通过的代码
    passInput: '',
    passOutput: '',
    quailTempValue: '', // 富文本编辑器临时内容
    modules: {
      toolbar: {
        container: [
          [{ header: [1, 2,3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike', ],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ 'align': [] }],
          [{ 'color': [] }, { 'background': [] }],
          ['link'],
          ['clean']

        ],
      },
    }
  }
  componentDidMount = () => {
    setTimeout(() => { // 初始化控制台表单
      this.setConsoleValue('input', cppDemoInput)
      this.setConsoleValue('ouput', '')
    }, 1000)
  }
  // 标签页改变
  onTagChange = (v) => {
    if (v == 'debug') {
      //...
    }else{
      // 更新提交作品表单的值
      const {passInput, passOutput, passCode} = this.state
      this.submitRef.setFieldsValue({demoInput: passInput, demoOuput:passOutput, code: passCode})
    }
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
    const debugCode = this.editerRef.editor.getValue()
    const inputValue = this.inputRef.getFieldValue('input')
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
      this.setState({debugPass: true, passCode: debugCode, passInput: inputValue, passOutput: stdOut})
    }
    let params = {
      code: debugCode,
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
    let oldValue = this.inputRef.getFieldValue(files)
    if (appendMod) {
      newValue = (oldValue ? oldValue : '') + value
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
  // 检查提交的表单是否正确
  checkCodeForm = (v) => {
    if (v.title == undefined || v.title == '') return '名称不能为空喔'
    if (v.ctype == undefined || v.ctype < 0 || v.ctype > 4) return '算法类型选择有误喔'
    if (v.desc == undefined || v.desc == '') return '简介不能为空喔'
    if (v.code == undefined || v.code == '') return '代码不能为空喔'
    if (v.author == undefined || v.author == '' ) v.author = '隐形巨佬'
    if (v.tagStr == undefined) v.tagStr = ''
    if (v.detail == undefined) v.detail = ''
    if (v.imgSrc == undefined) v.imgSrc = ''
    if (v.demoInput == undefined) v.demoInput = ''
    if (v.demoOuput == undefined) v.demoOuput = ''
    if (v.detail == undefined) v.detail = ''
    if (v.language == undefined) v.language = this.state.selectlanguage
    v.ctype = parseInt(v.ctype)
    return ''
  }
  // 提交作品数据表单
  submitMyCode = (fromValue) => {
    console.debug('fromValue=', fromValue)
    let res = this.checkCodeForm(fromValue)
    if (res != '' ) {
      message.warn('请检查或完善作品信息: ' + res)
      return
    }
    // TODO: 提交
    let callbackFunc = (ok) => {
      if (ok) {
        message.success('提交成功!')
      }else{
        message.error('出错了,请稍后再试...')
      }
    }
    this.callModel('codeSubmit', {params:fromValue, callbackFunc: callbackFunc})
  }
  // 富文本内容改变
  onQuillChange = (v) => {
    this.setState({quailTempValue: v})
  }
  // 确定完成详细介绍编辑
  onFinshEdit = () => {
    const { quailTempValue } = this.state
    this.setState({detailVisable: false})
    this.submitRef.setFieldsValue({detail: quailTempValue})
  }
  render () {
    const { TextArea } = Input
    const { TabPane } = Tabs
    const { confirm } = Modal
    const { Text } = Typography
    const { Option } = Select
    const { selectlanguage, waitting, debugPass, passCode, passInput, passOutput, detailVisable, modules } = this.state

    const menu =
      <Menu onClick={(v) => this.onSelectLanguage(v.key)}>
        <Menu.Item key='C++'>C++</Menu.Item>
        <Menu.Item key='C'>C</Menu.Item>
        <Menu.Item key='GO'>GO</Menu.Item>
      </Menu>

    return (
      <Row>
        <Col span={18} pull={3} push={3}>
          <Tabs size='middle' type='card' defaultActiveKey='submit' onChange={(v) => {this.onTagChange(v)}}>
            {/* 代码测试标签页 */}
            <TabPane key='debug' tab={<span><BugOutlined />代码测试</span>}>
              <Row style={{marginBottom: '1em'}}>
                <Text>选择语言：</Text>
                <Dropdown overlay={menu}>
                  <Button size='small' style={{width:'4.5em', float:'right'}}> {selectlanguage} <DownOutlined /></Button>
                </Dropdown>
              </Row>
              <Row style={{height: '60vh'}}>
                <CodeMirror ref={(r) => {this.editerRef = r}} value={cppDemoCode} options={{ theme: 'monokai', keyMap: 'sublime', mode: 'C++'}}
                  onChange={() => {this.setState({debugPass: false})}}/>
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
                        style={{backgroundColor:'rgb(39, 40, 34)', color:'#f8f8f2', fontSize:'13px'}} onChange={() => {console.debug(this.setState({debugPass: false}))}}/>
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
              <Row hidden={!debugPass}>
                <Col offset={1} span={23}>
                  <Form initialValues={{author: '隐形巨佬', ctype: '0'}} onFinish={this.submitMyCode} ref={form => { this.submitRef = form }} labelCol={{span: 4}} wrapperCol={{span:10}}>
                    <Form.Item tooltip='给你的作品起个漂亮的名字或标题吧' label='作品名称' name='title'>
                      <Input />
                    </Form.Item>
                    <Form.Item hidden name='imgSrc'>
                      <Input value=''/>
                    </Form.Item>
                    <Form.Item tooltip='设置正确的分类可以让其他用户' label='算法类型' name='ctype'>
                      <Select defaultValue='其他'>
                        <Option key='0'>其他</Option>
                        <Option key='1'>生活问题</Option>
                        <Option key='2'>数据结构与算法</Option>
                        <Option key='3'>程序开发</Option>
                        <Option key='4'>趣味/恶搞</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item tooltip='不写就是巨佬喔' label='作者昵称' name='author'>
                      <Input defaultValue='隐形巨佬' placeholder='隐形巨佬' maxLength={20}/>
                    </Form.Item>
                    <Form.Item tooltip='多个标签可使用空格隔开' label='标签' name='tagStr'>
                      <Input maxLength={30} placeholder='标签1 标签2(选填)'/>
                    </Form.Item>
                    <Form.Item tooltip='用一两句话来介绍你的作品吧' label='作品简介' name='desc'>
                      <TextArea maxLength={200} placeholder='用一句话来介绍你的作品吧' autoSize={{ minRows: 1, maxRows: 5 }}/>
                    </Form.Item>
                    <Form.Item tooltip='告诉其他使用者程序输入的格式呢' label='输入格式说明' name='inputDesc'>
                      <TextArea maxLength={400} placeholder='输入数据的格式或含义' autoSize={{ minRows: 1, maxRows: 5 }}/>
                    </Form.Item>
                    <Form.Item tooltip='给出一个程序输入的例子' label='样例输入' name='demoInput'>
                      <TextArea key={debugPass} defaultValue={passInput} maxLength={8000} placeholder='(选填)' autoSize={{ minRows: 1, maxRows: 5 }}/>
                    </Form.Item>
                    <Form.Item tooltip='样例输入得到的程序输出' label='期待输出' name='demoOuput'>
                      <TextArea key={debugPass} defaultValue={passOutput} maxLength={8000} placeholder='(选填)' autoSize={{ minRows: 1, maxRows: 5 }}/>
                    </Form.Item>
                    <Form.Item tooltip='debug通过的代码' label='程序源码' name='code' >
                      <TextArea key={debugPass} defaultValue={passCode} disabled autoSize={{ minRows: 5, maxRows: 10 }}/>
                    </Form.Item>
                    <Form.Item tooltip='详细地描述一下你的作品吧,如原理、作用...' label='详细介绍'>
                      <Button type='dashed' onClick={() => this.setState({detailVisable: true})}>点我编辑</Button>
                    </Form.Item>
                    <Form.Item name='detail' label='详细介绍(html)'>
                      <TextArea disabled autoSize={{ minRows: 1, maxRows: 5 }}/>
                    </Form.Item>
                    <Form.Item label=' '>
                      <Button type='primary' htmlType='submit'>提交</Button>
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
              <Modal width='700px' title='详细介绍' visible={detailVisable} closable={false}
                onOk={() => this.onFinshEdit()}
                onCancel={() => this.setState({detailVisable: false})} okText='确认' cancelText='取消'>
                <ReactQuill modules={modules} onChange={this.onQuillChange} theme='snow'/>
              </Modal>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    )
  }
}

export default CreateCode
